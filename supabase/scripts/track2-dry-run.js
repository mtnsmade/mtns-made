/**
 * MTNS MADE - Track 2 legacy subscription dry run (READ ONLY)
 *
 * Lists every subscription still on a legacy "MTNS MADE Membership" price,
 * matches each one to its Supabase member, and writes a CSV for review.
 * Makes NO changes to Stripe, Memberstack, Supabase or Webflow.
 *
 * Usage:
 *   node track2-dry-run.js --out <file.csv> [--classification <file.csv>]
 *
 *   --out             Where to write the review CSV. Contains member emails,
 *                     so write it outside the repo (the repo is public).
 *   --classification  Optional CSV with columns: email,target_slug
 *                     (target tier per member). Without it, target_slug is blank.
 *
 * Credentials: SUPABASE_* from scripts/.env, STRIPE_RESTRICTED_KEY from ../../cred.env.
 * Values are never printed.
 */

const path = require('path');
const fs = require('fs');
// cred.env is the source of truth (CLAUDE.md), so load it first; scripts/.env can hold stale keys
require('dotenv').config({ path: path.join(__dirname, '../../cred.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');
const { parse } = require('csv-parse/sync');

// ============================================
// ARGS
// ============================================

const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
};
const OUT_PATH = argValue('--out');
const CLASSIFICATION_PATH = argValue('--classification');

if (!OUT_PATH) {
  console.error('Missing --out <file.csv>. Write it outside the repo.');
  process.exit(1);
}

// ============================================
// LEGACY PRICES (from pricing-migration/stripe-price-audit.md)
// ============================================

const LEGACY_PRICE_IDS = [
  'price_1Tp0IRI0ScLVLNgqNeQZwoHe', // $5.50/mo, 3 Jul (placeholder? confirm with Hannah)
  'price_1Tp0HEI0ScLVLNgqKDYcdYAr', // $50/yr, 3 Jul (placeholder? confirm with Hannah)
  'price_1NmyKdI0ScLVLNgq2k7wyA2P', // $40/yr, 5 Sep 2023
  'price_1NmyK1I0ScLVLNgqAbElYu4x', // $5/mo, 5 Sep 2023
  'price_1NdB3BI0ScLVLNgqXtoO86ux', // $40/yr, 9 Aug 2023
  'price_1NdB2HI0ScLVLNgqHLPfPaXb', // $5/mo, 9 Aug 2023
  'price_1Na6UfI0ScLVLNgqPbmmBHiU', // $30/yr, 1 Aug 2023
  'price_1Na6TTI0ScLVLNgqJAT0GzOL', // $30/yr, 1 Aug 2023
  'price_1NRTqhI0ScLVLNgq6B3uaos9', // $30/yr, 8 Jul 2023
];

// Statuses that still bill or still hold the membership
const LIVE_STATUSES = ['active', 'trialing', 'past_due'];

// ============================================
// STRIPE (GET only)
// ============================================

const STRIPE_KEY = process.env.STRIPE_RESTRICTED_KEY;
if (!STRIPE_KEY) {
  console.error('STRIPE_RESTRICTED_KEY not found in cred.env');
  process.exit(1);
}

async function stripeGet(apiPath, pairs) {
  const url = new URL('https://api.stripe.com' + apiPath);
  for (const [k, v] of pairs) url.searchParams.append(k, v);
  const res = await fetch(url, {
    headers: { Authorization: 'Basic ' + Buffer.from(STRIPE_KEY + ':').toString('base64') },
  });
  if (!res.ok) throw new Error(`Stripe ${apiPath} returned HTTP ${res.status}`);
  return res.json();
}

async function listLiveSubsForPrice(priceId) {
  const results = [];
  for (const status of LIVE_STATUSES) {
    let startingAfter = null;
    do {
      const pairs = [
        ['price', priceId],
        ['status', status],
        ['limit', '100'],
        ['expand[]', 'data.customer'],
      ];
      if (startingAfter) pairs.push(['starting_after', startingAfter]);
      const page = await stripeGet('/v1/subscriptions', pairs);
      results.push(...page.data);
      startingAfter = page.has_more ? page.data[page.data.length - 1].id : null;
    } while (startingAfter);
  }
  return results;
}

// ============================================
// SUPABASE (SELECT only)
// ============================================

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function loadSupabaseMembersByEmail() {
  const byEmail = new Map();
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('members')
      .select('id, memberstack_id, email, subscription_status, membership_types(name, slug)')
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`Supabase members read failed: ${error.message}`);
    for (const m of data) {
      if (m.email) byEmail.set(m.email.trim().toLowerCase(), m);
    }
    if (data.length < PAGE) break;
  }
  return byEmail;
}

// ============================================
// CLASSIFICATION (optional)
// ============================================

function loadClassification(file) {
  if (!file) return new Map();
  const rows = parse(fs.readFileSync(file, 'utf-8'), { columns: true, skip_empty_lines: true });
  return new Map(rows.map((r) => [r.email.trim().toLowerCase(), r.target_slug.trim()]));
}

// ============================================
// MAIN
// ============================================

// interval_count matters: a monthly price with interval_count 12 bills every 12 months
function describeInterval(rec) {
  if (!rec) return "";
  return rec.interval_count && rec.interval_count > 1 ? `every ${rec.interval_count} ${rec.interval}s` : rec.interval;
}

function csvCell(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

(async () => {
  console.log('Loading legacy subscriptions from Stripe (read only)...');
  const subsByPrice = {};
  const seen = new Set();
  const rows = [];

  for (const priceId of LEGACY_PRICE_IDS) {
    const subs = await listLiveSubsForPrice(priceId);
    subsByPrice[priceId] = subs.length;
    for (const sub of subs) {
      if (seen.has(sub.id)) continue; // a sub can appear under more than one price
      seen.add(sub.id);
      rows.push({ sub, priceId });
    }
  }
  console.log(`Live subscriptions on legacy prices: ${rows.length}`);

  console.log('Loading Supabase members (read only)...');
  const membersByEmail = await loadSupabaseMembersByEmail();
  const targetByEmail = loadClassification(CLASSIFICATION_PATH);

  // Count legacy subs per customer, to flag double subscriptions
  const subsPerCustomer = new Map();
  for (const { sub } of rows) {
    const cid = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
    subsPerCustomer.set(cid, (subsPerCustomer.get(cid) || 0) + 1);
  }

  const flagCounts = {};
  const out = [];
  const header = [
    'subscription_id', 'stripe_status', 'stripe_customer_id', 'email',
    'stripe_metadata_memberstack_id', 'price_id', 'unit_amount_cents', 'interval',
    'current_period_end', 'cancel_at_period_end', 'item_count',
    'supabase_member_id', 'supabase_memberstack_id', 'supabase_subscription_status',
    'supabase_membership_type', 'target_slug', 'flags',
  ];
  out.push(header.join(','));

  const customerKeysSeen = new Set();

  for (const { sub, priceId } of rows) {
    const customer = typeof sub.customer === 'string' ? null : sub.customer;
    const cid = customer ? customer.id : sub.customer;
    const email = customer && customer.email ? customer.email.trim().toLowerCase() : '';
    // Stripe-side key set by Memberstack is msMemberId (names confirmed by the metadata key summary)
    const msFromStripe = (customer && customer.metadata && customer.metadata.msMemberId)
      || (sub.metadata && sub.metadata.msMemberId) || '';
    if (customer && customer.metadata) Object.keys(customer.metadata).forEach((k) => customerKeysSeen.add(k));

    const member = membersByEmail.get(email);
    const flags = [];
    if (!email) flags.push('NO_EMAIL_ON_CUSTOMER');
    if (!member) flags.push('NO_SUPABASE_MATCH');
    if (member && msFromStripe && member.memberstack_id !== msFromStripe) flags.push('MEMBERSTACK_ID_MISMATCH');
    if (member && member.subscription_status !== 'active' && sub.status === 'active') flags.push('SUPABASE_STATUS_DIFFERS');
    if (sub.items.data.length > 1) flags.push('MULTI_ITEM');
    if (subsPerCustomer.get(cid) > 1) flags.push('DUPLICATE_LEGACY_SUB');
    if (sub.status === 'trialing') flags.push('TRIALING');
    if (sub.status === 'past_due') flags.push('PAST_DUE');
    if (sub.cancel_at_period_end) flags.push('CANCEL_AT_PERIOD_END');
    const target = targetByEmail.get(email) || '';
    if (!target) flags.push('NO_TARGET_TIER');
    flags.forEach((f) => { flagCounts[f] = (flagCounts[f] || 0) + 1; });

    const item = sub.items.data[0];
    out.push([
      sub.id, sub.status, cid, email, msFromStripe, priceId,
      item.price.unit_amount, describeInterval(item.price.recurring),
      new Date(sub.current_period_end * 1000).toISOString().slice(0, 10),
      sub.cancel_at_period_end, sub.items.data.length,
      member ? member.id : '', member ? member.memberstack_id : '',
      member ? member.subscription_status : '',
      member && member.membership_types ? member.membership_types.slug : '',
      target, flags.join('|'),
    ].map(csvCell).join(','));
  }

  fs.writeFileSync(OUT_PATH, out.join('\n') + '\n');

  console.log('\n=== SUMMARY (no member emails printed) ===');
  console.log('Subscriptions per legacy price:');
  for (const [p, n] of Object.entries(subsByPrice)) console.log(`  ${p}: ${n}`);
  console.log(`Unique live subscriptions: ${rows.length}`);
  console.log('Flags:');
  for (const [f, n] of Object.entries(flagCounts).sort()) console.log(`  ${f}: ${n}`);
  console.log(`Customer metadata keys present (names only): ${[...customerKeysSeen].join(', ') || 'none'}`);
  console.log(`\nReview CSV written to: ${OUT_PATH}`);
  console.log('Nothing was changed in Stripe, Memberstack, Supabase or Webflow.');
})().catch((err) => {
  console.error('Dry run failed:', err.message);
  process.exit(1);
});
