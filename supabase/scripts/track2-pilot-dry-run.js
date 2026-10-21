/**
 * MTNS MADE - Track 2 pilot, DRY RUN ONLY
 *
 * For one member, reads the current state and prints the planned steps and
 * pass conditions. Writes a rollback record (old item ID and price ID) to the
 * path given by --out. Makes no changes anywhere.
 *
 * There is deliberately no live path in this script. The live change needs
 * Hannah's sign-off on the notice and placement, and explicit approval in chat
 * for that member. It will be added as a separate script after that.
 *
 * Usage:
 *   node track2-pilot-dry-run.js --sub <sub_id> --target-price <price_id> --out <rollback.json>
 *
 * --out should point outside the repo (the record holds member identifiers).
 *
 * Reads: Stripe (GET), Supabase members (SELECT). Credentials from ../../cred.env.
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../cred.env') });
const { createClient } = require('@supabase/supabase-js');

const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
};
const SUB_ID = argValue('--sub');
const TARGET_PRICE = argValue('--target-price');
const OUT = argValue('--out');
if (!SUB_ID || !TARGET_PRICE || !OUT) {
  console.error('Usage: --sub <sub_id> --target-price <price_id> --out <rollback.json>');
  process.exit(1);
}

const STRIPE_KEY = process.env.STRIPE_RESTRICTED_KEY;
async function stripeGet(apiPath, pairs = []) {
  const url = new URL('https://api.stripe.com' + apiPath);
  for (const [k, v] of pairs) url.searchParams.append(k, v);
  const res = await fetch(url, {
    headers: { Authorization: 'Basic ' + Buffer.from(STRIPE_KEY + ':').toString('base64') },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Stripe ${apiPath} HTTP ${res.status}: ${body.error ? body.error.message : ''}`);
  return body;
}

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const sub = await stripeGet(`/v1/subscriptions/${SUB_ID}`, [['expand[]', 'customer']]);
  if (sub.items.data.length !== 1) throw new Error('Pilot expects a single-item subscription');
  const item = sub.items.data[0];
  const target = await stripeGet(`/v1/prices/${TARGET_PRICE}`);
  const msId = sub.metadata.msMemberId || (typeof sub.customer === 'object' && sub.customer.metadata.msMemberId) || '';

  const { data: members, error } = await sb
    .from('members')
    .select('id, memberstack_id, subscription_status, membership_types(slug)')
    .eq('memberstack_id', msId);
  if (error) throw new Error(`Supabase read failed: ${error.message}`);
  const member = members && members[0];

  const upcomingBase = [
    ['subscription', SUB_ID],
    ['subscription_details[items][0][id]', item.id],
    ['subscription_details[items][0][price]', TARGET_PRICE],
    ['subscription_details[proration_behavior]', 'none'],
  ];
  const upcoming = await stripeGet('/v1/invoices/upcoming', upcomingBase);
  const prorations = upcoming.lines.data.filter((l) => l.proration).length;

  const rollback = {
    recorded_at: new Date().toISOString(),
    subscription_id: SUB_ID,
    subscription_item_id: item.id,
    old_price_id: item.price.id,
    old_unit_amount: item.price.unit_amount,
    interval_count: item.price.recurring.interval_count,
    interval: item.price.recurring.interval,
    supabase_member_id: member ? member.id : null,
    supabase_membership_type: member && member.membership_types ? member.membership_types.slug : null,
    memberstack_id: msId,
  };
  fs.writeFileSync(OUT, JSON.stringify(rollback, null, 2) + '\n');

  const sameBilling = describe(target.recurring) === describe(item.price.recurring);
  const renewal = new Date(sub.current_period_end * 1000).toISOString().slice(0, 10);

  console.log('=== PILOT DRY RUN (no changes made) ===');
  console.log(`Subscription ${SUB_ID} | status ${sub.status} | cancel_at_period_end ${sub.cancel_at_period_end} | renewal ${renewal}`);
  console.log(`Supabase member found: ${member ? 'yes' : 'NO'} | supabase status ${member ? member.subscription_status : '-'} | supabase type ${rollback.supabase_membership_type}`);
  console.log(`Current price ${item.price.id}: ${item.price.unit_amount} ${describe(item.price.recurring)}`);
  console.log(`Target price  ${TARGET_PRICE}: ${target.unit_amount} ${describe(target.recurring)} (active: ${target.active})`);
  console.log(`Next invoice (no proration): ${upcoming.amount_due} | proration lines ${prorations}`);
  console.log(`Rollback record written to: ${OUT}`);

  console.log('\nPre-change checks:');
  const checks = [
    ['Subscription is active (not trialing, past_due or cancelling)', sub.status === 'active' && !sub.cancel_at_period_end],
    ['Supabase member exists and is active', !!member && member.subscription_status === 'active'],
    ['Target price is active', target.active === true],
    ['Billing interval unchanged', sameBilling],
    ['No-proration preview has zero proration lines', prorations === 0],
    ['Next invoice bills the period that starts on the existing renewal date', upcoming.lines.data.every((l) => l.period.start === sub.current_period_end)],
    ['Next invoice equals target amount', upcoming.amount_due === target.unit_amount],
  ];
  for (const [name, ok] of checks) console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}`);

  console.log('\nPlanned live steps (NOT executed; need sign-off and per-member approval):');
  console.log('  1. Confirm notice has been sent and period passed (Hannah sign-off)');
  console.log('  2. Stripe: update subscription item to target price, proration_behavior=none');
  console.log('  3. Stripe: re-read subscription; confirm item price and renewal date');
  console.log('  4. Memberstack: plan connection updated (verify by reading member, not the webhook)');
  console.log('  5. Supabase: membership_type updated; check no lapse or cancellation activity logged');
  console.log('  6. Webflow: tier reflected on the member item (after sync)');
  console.log('  Stop on any failed check; reverse per the rollback record.');
})().catch((err) => {
  console.error('Pilot dry run failed:', err.message);
  process.exit(1);
});

function describe(rec) {
  if (!rec) return '';
  return rec.interval_count && rec.interval_count > 1 ? `every ${rec.interval_count} ${rec.interval}s` : rec.interval;
}
