/**
 * MTNS MADE - Track 2 price swap
 *
 * Moves named Group A subscriptions from their legacy price to the
 * period-matched Professional price (plan section 4) with
 * proration_behavior=none, so nothing is charged until the member's existing
 * renewal date. Nothing is written to Memberstack, Supabase or Webflow: they
 * follow from Stripe and are verified here, not relied on.
 *
 * Usage:
 *   node track2-swap.js --subs sub_a,sub_b              preview only (default)
 *   node track2-swap.js --subs sub_a,sub_b --execute    swap, then verify each
 *   node track2-swap.js --rollback --subs sub_a [--execute]
 *
 *   --subs       Comma-separated Stripe subscription IDs. There is no "all"
 *                mode: every batch is named.
 *   --execute    Make the change. Members are done one at a time and the run
 *                stops at the first failed check.
 *   --rollback   Put the item back on the old price from the swap record.
 *                The old prices are archived; unarchive the price in the
 *                Stripe dashboard first, and re-archive it afterwards.
 *
 * A member is only swapped when their notice is in the sent ledger and their
 * next renewal is the new-fee renewal from that notice. A member renewing
 * before it is refused until after that renewal (they pay the old fee once
 * more). Monthly members have no fee change, so no date rule.
 *
 * Every change is recorded in pricing-migration/track2-swaps.json (gitignored;
 * the repo is public) before it is made, with the old item and price IDs for
 * rollback.
 *
 * Credentials from ../../cred.env: STRIPE_RESTRICTED_KEY (subscription write),
 * SECRET_KEY (Memberstack admin, read), SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY (read), WEBFLOW_API_TOKEN and
 * WEBFLOW_MEMBERS_COLLECTION_ID (read). Values are never printed.
 */

const path = require('path');
const fs = require('fs');
const {
  PRIVATE_DIR,
  PROFESSIONAL_PLAN_ID,
  PROFESSIONAL_TARGET,
  GROUP_B_TARGET,
  requireKeys,
  stripeGet,
  stripeListAll,
  readLedger,
  fetchRetry: fetch,
} = require('./track2-lib');

// Group A (legacy flat plan to Professional) and Group B (2024 to 2026 price,
// same tier), in one shape.
const TARGETS = { ...GROUP_B_TARGET };
for (const [id, t] of Object.entries(PROFESSIONAL_TARGET)) TARGETS[id] = { ...t, tier: 'professional', name: 'Professional', plan: PROFESSIONAL_PLAN_ID };

const SWAPS_PATH = path.join(PRIVATE_DIR, 'track2-swaps.json');
const LIVE = new Set(['active', 'trialing', 'past_due']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
};
const SUBS = (argValue('--subs') || '').split(',').map((s) => s.trim()).filter(Boolean);
const EXECUTE = args.includes('--execute');
const ROLLBACK = args.includes('--rollback');
if (!SUBS.length) {
  console.error('Usage: --subs sub_a,sub_b [--execute] [--rollback]');
  process.exit(1);
}

async function stripePost(apiPath, params, idempotencyKey) {
  const res = await fetch('https://api.stripe.com/v1' + apiPath, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(process.env.STRIPE_RESTRICTED_KEY + ':').toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Idempotency-Key': idempotencyKey,
    },
    body: new URLSearchParams(params).toString(),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Stripe POST ${apiPath} HTTP ${res.status}: ${body.error ? body.error.message : ''}`);
  return body;
}

async function memberstackMember(id) {
  const res = await fetch(`https://admin.memberstack.com/members/${id}`, {
    headers: { 'X-API-KEY': process.env.SECRET_KEY, 'User-Agent': 'curl/8.7.1' },
  });
  if (!res.ok) throw new Error(`Memberstack HTTP ${res.status}`);
  return (await res.json()).data;
}

async function supabaseMember(msId) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/members?select=subscription_status,webflow_id,profile_complete,membership_types(slug)&memberstack_id=eq.${msId}`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
  return (await res.json())[0] || null;
}

// Tier slug -> Webflow membership type item id.
async function tierWebflowIds() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/membership_types?select=slug,webflow_id`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
  return Object.fromEntries((await res.json()).map((t) => [t.slug, t.webflow_id]));
}

async function webflowItem(itemId) {
  const res = await fetch(`https://api.webflow.com/v2/collections/${process.env.WEBFLOW_MEMBERS_COLLECTION_ID}/items/${itemId}`, {
    headers: { Authorization: `Bearer ${process.env.WEBFLOW_API_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Webflow HTTP ${res.status}`);
  return res.json();
}

const readJson = (p, fallback) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : fallback);
function recordSwap(subId, event) {
  const all = readJson(SWAPS_PATH, {});
  (all[subId] = all[subId] || []).push({ at: new Date().toISOString(), ...event });
  fs.writeFileSync(SWAPS_PATH + '.tmp', JSON.stringify(all, null, 2) + '\n');
  fs.renameSync(SWAPS_PATH + '.tmp', SWAPS_PATH);
}

function periodEndOf(s) {
  const item = s.items.data[0];
  return (item && item.current_period_end) || s.current_period_end;
}
const longDate = (ts) => new Date(ts * 1000).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Sydney' });
const describe = (rec) => (rec.interval_count > 1 ? `every ${rec.interval_count} ${rec.interval}s` : rec.interval);

// Checks before a swap. Returns { failed, plan } where plan holds what the
// swap needs.
async function preflight(subId, ledgerBySub) {
  const failed = [];
  const s = await stripeGet(`/subscriptions/${subId}`);
  const item = s.items.data[0];
  const oldPrice = item ? item.price.id : '';
  const target = TARGETS[oldPrice];
  const notice = ledgerBySub.get(subId);
  const periodEnd = periodEndOf(s);
  const plan = { s, item, oldPrice, target, notice, periodEnd };

  if (!target) {
    failed.push(`not on a Track 2 source price (on ${oldPrice || 'nothing'})`);
    return { failed, plan };
  }
  if (s.status !== 'active') failed.push(`status ${s.status}`);
  if (s.cancel_at_period_end) failed.push('cancelling at period end');
  if (s.collection_method !== 'charge_automatically') failed.push('invoice billing');
  if (s.items.data.length !== 1) failed.push('more than one item');
  const targetPrice = await stripeGet(`/prices/${target.stripe}`);
  // Where the fee changes, the next charge must be the one the notice named.
  if (!notice || notice.status !== 'sent') failed.push('no sent notice in the ledger');
  else if (targetPrice.unit_amount !== item.price.unit_amount && notice.effective_date !== longDate(periodEnd)) {
    failed.push(`renews ${longDate(periodEnd)} but the new fee starts ${notice.effective_date}: swap after that renewal`);
  }

  if (!targetPrice.active) failed.push('target price is archived');
  if (describe(targetPrice.recurring) !== describe(item.price.recurring)) failed.push('billing period differs from the target');

  const custSubs = await stripeListAll('/subscriptions', { customer: s.customer, status: 'all' });
  const open = custSubs.filter((x) => LIVE.has(x.status)).length;
  if (open !== 1) failed.push(`customer has ${open} live subscriptions`);

  const upcoming = await stripeGet('/invoices/upcoming', {
    subscription: subId,
    'subscription_details[items][0][id]': item.id,
    'subscription_details[items][0][price]': target.stripe,
    'subscription_details[proration_behavior]': 'none',
  });
  if (upcoming.lines.data.some((l) => l.proration)) failed.push('preview has proration lines');
  if (upcoming.amount_due !== targetPrice.unit_amount) failed.push(`preview amount ${upcoming.amount_due}, expected ${targetPrice.unit_amount}`);
  if (!upcoming.lines.data.every((l) => l.period.start === periodEnd)) failed.push('preview does not start at the existing renewal');

  const msId = s.metadata.msMemberId || (notice && notice.memberstack_id) || '';
  plan.msId = msId;
  const sb = msId ? await supabaseMember(msId) : null;
  if (!sb) failed.push('Supabase member not found');
  else if (sb.subscription_status !== 'active') failed.push(`Supabase status ${sb.subscription_status}`);
  plan.amountBefore = item.price.unit_amount;
  plan.amountAfter = targetPrice.unit_amount;
  return { failed, plan };
}

// Checks after a swap, polling while Memberstack and the webhook catch up.
async function verify(subId, plan, startedAt, webflowTierIds) {
  const failed = [];
  const s = await stripeGet(`/subscriptions/${subId}`);
  if (s.items.data[0].price.id !== plan.target.stripe) failed.push(`Stripe: item on ${s.items.data[0].price.id}`);
  if (periodEndOf(s) !== plan.periodEnd) failed.push(`Stripe: renewal moved to ${longDate(periodEndOf(s))}`);
  const inv = await stripeGet('/invoices', { subscription: subId, 'created[gte]': String(startedAt - 60) });
  if (inv.data.length) failed.push(`Stripe: ${inv.data.length} invoice(s) created by the swap`);

  let msFailed = ['Memberstack: not checked'];
  for (let i = 0; i < 12; i++) {
    const m = await memberstackMember(plan.msId);
    const paid = (m.planConnections || []).filter((p) => p.status === 'ACTIVE' && p.payment && p.payment.amount);
    msFailed = [];
    if (paid.length !== 1) msFailed.push(`Memberstack: ${paid.length} paid active plans`);
    else {
      if (paid[0].planId !== plan.target.plan) msFailed.push(`Memberstack: plan ${paid[0].planId}`);
      if (paid[0].payment.priceId !== plan.target.memberstack) msFailed.push(`Memberstack: price ${paid[0].payment.priceId}`);
    }
    if (!msFailed.length) break;
    await sleep(10000);
  }
  failed.push(...msFailed);

  // Give the plan-updated webhook time to land before reading Supabase.
  await sleep(15000);
  const sb = await supabaseMember(plan.msId);
  if (!sb) failed.push('Supabase: member not found');
  else {
    const type = sb.membership_types ? sb.membership_types.slug : null;
    if (type !== plan.target.tier) failed.push(`Supabase: type ${type}`);
    if (sb.subscription_status !== 'active') failed.push(`Supabase: status ${sb.subscription_status}`);
    if (sb.webflow_id) {
      const wf = await webflowItem(sb.webflow_id);
      if (wf.isArchived || wf.isDraft) failed.push('Webflow: profile archived or draft');
      const tierId = webflowTierIds[plan.target.tier];
      if (tierId && wf.fieldData['choose-membership-type'] !== tierId) failed.push(`Webflow: tier is not ${plan.target.name}`);
    } else if (sb.profile_complete) failed.push('Webflow: no webflow_id in Supabase');
    // An incomplete profile has no Webflow item by design, so there is nothing to check.
  }

  const custSubs = await stripeListAll('/subscriptions', { customer: s.customer, status: 'all' });
  const open = custSubs.filter((x) => LIVE.has(x.status)).length;
  if (open !== 1) failed.push(`Stripe: customer has ${open} live subscriptions`);
  return failed;
}

async function rollback(subId) {
  const events = readJson(SWAPS_PATH, {})[subId] || [];
  const swap = [...events].reverse().find((e) => e.status === 'swapped');
  if (!swap) throw new Error('no swap record for this subscription');
  const s = await stripeGet(`/subscriptions/${subId}`);
  const item = s.items.data[0];
  console.log(`${subId}: on ${item.price.id}, record says old price ${swap.old_price}, renews ${longDate(periodEndOf(s))}`);
  if (item.id !== swap.item_id) throw new Error('subscription item changed since the swap');
  const old = await stripeGet(`/prices/${swap.old_price}`);
  if (!old.active) throw new Error(`old price ${swap.old_price} is archived: unarchive it in the Stripe dashboard first`);
  if (!EXECUTE) return console.log('  preview only; add --execute to roll back');
  recordSwap(subId, { status: 'rolling_back', item_id: item.id, from_price: item.price.id, to_price: swap.old_price });
  await stripePost(`/subscriptions/${subId}`, {
    'items[0][id]': item.id,
    'items[0][price]': swap.old_price,
    proration_behavior: 'none',
  }, `track2-rollback-${subId}-${Date.now()}`);
  const after = await stripeGet(`/subscriptions/${subId}`);
  const ok = after.items.data[0].price.id === swap.old_price && periodEndOf(after) === periodEndOf(s);
  recordSwap(subId, { status: ok ? 'rolled_back' : 'rollback_check_failed', item_id: item.id, price: after.items.data[0].price.id });
  console.log(`  ${ok ? 'rolled back' : 'CHECK FAILED'}: now on ${after.items.data[0].price.id}, renews ${longDate(periodEndOf(after))}`);
  console.log('  Re-archive the old price in the Stripe dashboard.');
}

async function main() {
  requireKeys();
  if (ROLLBACK) {
    for (const subId of SUBS) await rollback(subId);
    return;
  }
  const ledgerBySub = new Map(Object.values(readLedger()).map((e) => [e.stripe_subscription, e]));
  const webflowTierIds = await tierWebflowIds();
  console.log(`${EXECUTE ? 'EXECUTE' : 'PREVIEW (no changes)'}: ${SUBS.length} subscription(s)\n`);

  let done = 0;
  for (const subId of SUBS) {
    const { failed, plan } = await preflight(subId, ledgerBySub);
    const line = plan.target
      ? `${subId}: ${plan.target.name} ${plan.amountBefore / 100} to ${plan.amountAfter / 100} ${describe(plan.item.price.recurring)}, renews ${longDate(plan.periodEnd)}`
      : subId;
    if (failed.length) {
      console.log(`SKIP  ${line}\n      ${failed.join('; ')}`);
      if (EXECUTE) {
        console.log('\nStopped: a pre-change check failed.');
        break;
      }
      continue;
    }
    if (!EXECUTE) {
      console.log(`OK    ${line}`);
      continue;
    }

    const startedAt = Math.floor(Date.now() / 1000);
    recordSwap(subId, { status: 'swapping', item_id: plan.item.id, old_price: plan.oldPrice, new_price: plan.target.stripe, period_end: plan.periodEnd, memberstack_id: plan.msId });
    await stripePost(`/subscriptions/${subId}`, {
      'items[0][id]': plan.item.id,
      'items[0][price]': plan.target.stripe,
      proration_behavior: 'none',
    }, `track2-swap-${subId}-${startedAt}`);
    recordSwap(subId, { status: 'swapped', item_id: plan.item.id, old_price: plan.oldPrice, new_price: plan.target.stripe });

    const problems = await verify(subId, plan, startedAt, webflowTierIds);
    recordSwap(subId, { status: problems.length ? 'verify_failed' : 'verified', problems });
    console.log(`${problems.length ? 'FAIL' : 'DONE'}  ${line}${problems.length ? '\n      ' + problems.join('; ') : ''}`);
    if (problems.length) {
      console.log('\nStopped: a post-change check failed. Investigate, or roll back with --rollback.');
      break;
    }
    done++;
  }
  if (EXECUTE) console.log(`\nSwapped and verified: ${done} of ${SUBS.length}`);
}

main().catch((err) => {
  console.error('Swap failed:', err.message);
  process.exit(1);
});
