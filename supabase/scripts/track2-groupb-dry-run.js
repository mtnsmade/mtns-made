/**
 * MTNS MADE - Track 2 Group B dry run (READ ONLY)
 *
 * Group B: members already on the right tier but still paying a 2024 price.
 * For each live subscription on a 2024 price this finds the tier's 2026 price
 * with the same billing period (so a swap keeps the renewal date), checks the
 * member in Memberstack and Supabase, and flags anyone to set aside.
 * Makes NO changes to Stripe, Memberstack, Supabase or Webflow.
 *
 * Usage:
 *   node track2-groupb-dry-run.js [--send-date 2026-11-02] [--notice-days 30] [--out <file.csv>]
 *
 *   --out  Defaults to pricing-migration/groupb-dryrun-<send-date>.csv
 *          (gitignored; it contains member emails).
 *
 * Spaces & Suppliers is left out: its 2026 price is not decided yet.
 * Credentials from ../../cred.env. Values are never printed.
 */

const path = require('path');
const fs = require('fs');
const { PRIVATE_DIR, requireKeys, stripeGet, stripeListAll, memberstackAll, memberEmail } = require('./track2-lib');

const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
};
const SEND_DATE = argValue('--send-date') || new Date().toISOString().slice(0, 10);
const NOTICE_DAYS = Number(argValue('--notice-days') || 30);
const OUT_PATH = argValue('--out') || path.join(PRIVATE_DIR, `groupb-dryrun-${SEND_DATE}.csv`);

// 2024 tier prices with live subscriptions (stripe-price-audit.md, rechecked 2026-11-02).
const GROUP_B_PRICES = {
  price_1PhVBqI0ScLVLNgqwimq6Phx: 'emerging',
  price_1Q3syRI0ScLVLNgqMOQgC3M2: 'emerging',
  price_1PhVFlI0ScLVLNgqMjnUpLpE: 'professional',
  price_1Q3sFeI0ScLVLNgqzYR05G5U: 'professional',
  price_1PhVA6I0ScLVLNgqBU9pVQll: 'not-for-profit',
  price_1Q3sfcI0ScLVLNgqc0G27iy4: 'not-for-profit',
  price_1PhVH1I0ScLVLNgqI0wsbQ05: 'small-business',
  price_1Q3sijI0ScLVLNgqtr6h7WRK: 'small-business',
  price_1PhVI2I0ScLVLNgqpwNWVx7g: 'large-business',
  price_1Q3sjWI0ScLVLNgq2NlmIDMQ: 'large-business',
};
const PLAN_BY_TIER = {
  emerging: 'pln_emerging-i59k0l22',
  professional: 'pln_professional-ic970osr',
  'not-for-profit': 'pln_not-for-profit-qaa106a4',
  'small-business': 'pln_small-business-qsa506lc',
  'large-business': 'pln_medium-large-business-9qa706pj',
};
// 2026 Memberstack prices used by the join page.
const MS_PRICE_2026 = {
  'emerging:year': 'prc_2026-emerging-annual-lk2i906t0',
  'emerging:month': 'prc_2026-emerging-monthly-fd2ia06uj',
  'professional:year': 'prc_2026-professional-annual-8x2ix01w6',
  'professional:month': 'prc_2026-professional-monthly-e72ib06fg',
  'not-for-profit:year': 'prc_2026-not-for-profit-annual-0j2go0ypj',
  'not-for-profit:month': 'prc_2026-not-for-profit-monthly-442j001xz',
  'small-business:year': 'prc_2026-small-business-annual-el2ic068k',
  'small-business:month': 'prc_2026-small-business-monthly-wv2gm0yo4',
  'large-business:year': 'prc_2026-medium-large-business-annual-su2iy0155',
  'large-business:month': 'prc_2026-medium-large-business-monthly-3m2gn0yxa',
};

const LIVE = new Set(['active', 'trialing', 'past_due']);
const DAY = 86400000;
const period = (rec) => `${rec.interval_count}x${rec.interval}`;
const longDate = (ts) => new Date(ts * 1000).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Sydney' });
const money = (cents) => `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;
const csvCell = (v) => (/[",\n]/.test(String(v ?? '')) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? ''));

async function supabaseByMemberstack() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const out = new Map();
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/members?select=memberstack_id,subscription_status,webflow_id,membership_types(slug)`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + 999}` },
    });
    if (!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
    const rows = await res.json();
    for (const r of rows) if (r.memberstack_id) out.set(r.memberstack_id, r);
    if (rows.length < 1000) return out;
  }
}

// The one active price on the tier's product with the same billing period.
async function findTargets(liveSubs) {
  const products = new Map();
  for (const s of liveSubs) {
    const p = s.items.data[0] && s.items.data[0].price;
    if (p && GROUP_B_PRICES[p.id]) products.set(p.product, GROUP_B_PRICES[p.id]);
  }
  const targets = {};
  for (const [product, tier] of products) {
    const prices = await stripeListAll('/prices', { product, active: 'true' });
    for (const oldId of Object.keys(GROUP_B_PRICES).filter((id) => GROUP_B_PRICES[id] === tier)) {
      let old;
      try { old = await stripeGet(`/prices/${oldId}`); } catch { continue; }
      const matches = prices.filter((p) => p.id !== oldId && p.recurring && period(p.recurring) === period(old.recurring) && p.currency === old.currency);
      targets[oldId] = {
        tier,
        old,
        candidates: matches,
        target: matches.length === 1 ? matches[0] : null,
        msPrice: MS_PRICE_2026[`${tier}:${old.recurring.interval}`],
      };
    }
  }
  return targets;
}

(async () => {
  requireKeys();
  const sendMs = Date.parse(SEND_DATE + 'T00:00:00+11:00');
  const cutoff = sendMs + NOTICE_DAYS * DAY;

  const [subs, members, sb] = await Promise.all([stripeListAll('/subscriptions', { status: 'all' }), memberstackAll(), supabaseByMemberstack()]);
  const live = subs.filter((s) => LIVE.has(s.status));
  const liveByCustomer = new Map();
  for (const s of live) liveByCustomer.set(s.customer, (liveByCustomer.get(s.customer) || 0) + 1);
  const msByCustomer = new Map(members.filter((m) => m.stripeCustomerId).map((m) => [m.stripeCustomerId, m]));
  const targets = await findTargets(live);

  // Evidence that each target price already maps to the right Memberstack plan and price.
  const evidence = {};
  for (const s of live) {
    const p = s.items.data[0] && s.items.data[0].price;
    const t = Object.values(targets).find((x) => x.target && x.target.id === (p && p.id));
    if (!t) continue;
    const m = msByCustomer.get(s.customer);
    const pc = ((m && m.planConnections) || []).find((c) => c.status === 'ACTIVE' && c.payment && c.payment.amount);
    const ok = pc && pc.planId === PLAN_BY_TIER[t.tier] && pc.payment.priceId === t.msPrice;
    const e = (evidence[p.id] ||= { subs: 0, mapped: 0 });
    e.subs++;
    if (ok) e.mapped++;
  }

  const rows = [];
  for (const s of live) {
    const item = s.items.data[0];
    if (!item || !GROUP_B_PRICES[item.price.id]) continue;
    const t = targets[item.price.id];
    const m = msByCustomer.get(s.customer);
    const pc = ((m && m.planConnections) || []).filter((c) => c.status === 'ACTIVE' && c.payment && c.payment.amount);
    const sbm = m ? sb.get(m.id) : null;
    const periodEnd = item.current_period_end || s.current_period_end;
    const reasons = [];
    if (s.status !== 'active') reasons.push(`status ${s.status}`);
    if (s.cancel_at_period_end || s.cancel_at) reasons.push('cancelling');
    if (s.collection_method !== 'charge_automatically') reasons.push('invoice billing');
    if (s.items.data.length !== 1) reasons.push('more than one item');
    if (liveByCustomer.get(s.customer) > 1) reasons.push('customer has more than one live subscription');
    if (s.discount || (s.discounts && s.discounts.length)) reasons.push('discount on subscription');
    if (s.pending_update) reasons.push('pending update');
    if (s.schedule) reasons.push('subscription schedule');
    if (!t || !t.target) reasons.push(`no single 2026 price for this period (${t ? t.candidates.length : 0} found)`);
    if (!m) reasons.push('no Memberstack member');
    else if (pc.length !== 1) reasons.push(`${pc.length} paid Memberstack plans`);
    else if (pc[0].planId !== PLAN_BY_TIER[GROUP_B_PRICES[item.price.id]]) reasons.push(`Memberstack plan ${pc[0].planId}`);
    if (m && !sbm) reasons.push('no Supabase member');
    else if (sbm) {
      const type = sbm.membership_types ? sbm.membership_types.slug : null;
      if (type !== GROUP_B_PRICES[item.price.id]) reasons.push(`Supabase type ${type}`);
      if (sbm.subscription_status !== 'active') reasons.push(`Supabase status ${sbm.subscription_status}`);
    }

    // First renewal at least NOTICE_DAYS after the send date is when the new fee starts.
    let effective = periodEnd;
    const rec = item.price.recurring;
    while (effective * 1000 < cutoff) {
      const d = new Date(effective * 1000);
      if (rec.interval === 'year') d.setUTCFullYear(d.getUTCFullYear() + rec.interval_count);
      else d.setUTCMonth(d.getUTCMonth() + rec.interval_count);
      effective = Math.floor(d.getTime() / 1000);
    }

    rows.push({
      sub: s.id,
      email: memberEmail(m),
      tier: GROUP_B_PRICES[item.price.id],
      period: period(rec),
      old_price: item.price.id,
      old_amount: money(item.price.unit_amount),
      new_price: t && t.target ? t.target.id : '',
      new_amount: t && t.target ? money(t.target.unit_amount) : '',
      next_renewal: longDate(periodEnd),
      new_fee_from: longDate(effective),
      renews_inside_notice: effective !== periodEnd ? 'yes' : '',
      status: reasons.length ? 'set aside' : 'ready',
      reasons: reasons.join('; '),
    });
  }
  rows.sort((a, b) => a.tier.localeCompare(b.tier) || a.period.localeCompare(b.period) || a.sub.localeCompare(b.sub));

  const cols = Object.keys(rows[0] || { sub: '' });
  fs.writeFileSync(OUT_PATH, [cols.join(','), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\n') + '\n');

  // Summary without member details.
  console.log(`Group B dry run, send date ${SEND_DATE}, ${NOTICE_DAYS}-day notice\n`);
  console.log('Price mapping:');
  for (const [oldId, t] of Object.entries(targets)) {
    const n = rows.filter((r) => r.old_price === oldId).length;
    if (!n) continue;
    const tgt = t.target;
    const ev = tgt ? evidence[tgt.id] : null;
    const evText = ev ? `${ev.mapped}/${ev.subs} live members on it map to ${t.msPrice}` : 'no live members on it yet (Memberstack mapping unproven)';
    console.log(`  ${t.tier} ${period(t.old.recurring)}: ${oldId} ${money(t.old.unit_amount)} -> ${tgt ? `${tgt.id} ${money(tgt.unit_amount)}` : `NO SINGLE TARGET (${t.candidates.length})`} | ${n} members | ${tgt ? evText : ''}`);
  }
  const ready = rows.filter((r) => r.status === 'ready');
  console.log(`\nLive Group B subscriptions: ${rows.length}. Ready: ${ready.length}. Set aside: ${rows.length - ready.length}.`);
  const reasonCount = {};
  for (const r of rows) for (const x of r.reasons ? r.reasons.split('; ') : []) reasonCount[x] = (reasonCount[x] || 0) + 1;
  for (const [k, v] of Object.entries(reasonCount)) console.log(`  set aside: ${k} (${v})`);
  const byTier = {};
  for (const r of ready) byTier[`${r.tier} ${r.period}`] = (byTier[`${r.tier} ${r.period}`] || 0) + 1;
  console.log('\nReady by tier:', JSON.stringify(byTier));
  console.log(`Ready members renewing inside the notice window (new fee from the following renewal): ${ready.filter((r) => r.renews_inside_notice).length}`);
  const byMonth = {};
  for (const r of ready.filter((x) => x.period === '1xyear')) {
    const k = r.new_fee_from.split(' ').slice(1).join(' ');
    byMonth[k] = (byMonth[k] || 0) + 1;
  }
  console.log('Annual ready members by month the new fee starts:', JSON.stringify(byMonth));
  console.log(`\nWrote ${OUT_PATH}`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
