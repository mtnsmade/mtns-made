/**
 * MTNS MADE - Track 2 invoice preview (READ ONLY, plan step 3)
 *
 * Uses Stripe's GET /v1/invoices/upcoming, which computes an invoice without
 * creating or charging anything. Nothing is written to Stripe.
 *
 * Usage:
 *   node track2-invoice-preview.js --list-prices
 *       Lists active Stripe prices so target price IDs can be chosen.
 *
 *   node track2-invoice-preview.js --sub <sub_id> --price <price_id>
 *       Previews switching the subscription's single item to the target price,
 *       with proration_behavior=none (the plan's "next invoice at target amount"
 *       case) and with create_prorations (what an immediate change would bill).
 *
 * Credentials: STRIPE_RESTRICTED_KEY from ../../cred.env. Values are never printed.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../cred.env') });

const STRIPE_KEY = process.env.STRIPE_RESTRICTED_KEY;
if (!STRIPE_KEY) {
  console.error('STRIPE_RESTRICTED_KEY not found in cred.env');
  process.exit(1);
}

const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
};

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

function describeInterval(rec) {
  if (!rec) return '';
  return rec.interval_count && rec.interval_count > 1 ? `every ${rec.interval_count} ${rec.interval}s` : rec.interval;
}

async function listPrices() {
  const page = await stripeGet('/v1/prices', [['active', 'true'], ['limit', '100'], ['expand[]', 'data.product']]);
  console.log('id | amount (cents) | currency | billing | product name');
  for (const p of page.data) {
    const name = p.product && typeof p.product === 'object' ? p.product.name : p.product;
    console.log(`${p.id} | ${p.unit_amount} | ${p.currency} | ${describeInterval(p.recurring)} | ${name}`);
  }
  console.log(`\n${page.data.length} active prices${page.has_more ? ' (more exist, list truncated)' : ''}.`);
}

async function previewChange(subId, targetPriceId) {
  const sub = await stripeGet(`/v1/subscriptions/${subId}`);
  if (sub.items.data.length !== 1) {
    throw new Error(`Subscription has ${sub.items.data.length} items; this script only handles single-item subscriptions`);
  }
  const item = sub.items.data[0];
  const target = await stripeGet(`/v1/prices/${targetPriceId}`);

  const base = [
    ['subscription', subId],
    ['subscription_details[items][0][id]', item.id],
    ['subscription_details[items][0][price]', targetPriceId],
  ];

  const next = await stripeGet('/v1/invoices/upcoming', [...base, ['subscription_details[proration_behavior]', 'none']]);
  const now = await stripeGet('/v1/invoices/upcoming', [...base, ['subscription_details[proration_behavior]', 'create_prorations']]);

  const periodEnd = sub.current_period_end;
  const checks = [];
  const prorationLines = (inv) => inv.lines.data.filter((l) => l.proration).length;
  const lineSummary = (inv) => inv.lines.data.map((l) => ({
    description: (l.description || '').slice(0, 60),
    amount: l.amount,
    proration: l.proration,
    period_end: new Date(l.period.end * 1000).toISOString().slice(0, 10),
  }));

  checks.push(['Target price is active', target.active === true]);
  checks.push(['Target billing matches current billing (interval and count)',
    describeInterval(target.recurring) === describeInterval(item.price.recurring)]);
  checks.push(['No-proration preview has zero proration lines', prorationLines(next) === 0]);
  checks.push(['Next invoice amount equals target unit amount', next.amount_due === target.unit_amount]);
  checks.push(['Next invoice bills the period that starts on the existing renewal date', next.lines.data.every((l) => l.period.start === periodEnd)]);

  console.log('Subscription:', subId, '| status:', sub.status, '| cancel_at_period_end:', sub.cancel_at_period_end);
  console.log('Current price:', item.price.id, '|', item.price.unit_amount, '|', describeInterval(item.price.recurring));
  console.log('Target price: ', targetPriceId, '|', target.unit_amount, '|', describeInterval(target.recurring));
  console.log('Renewal date:', new Date(periodEnd * 1000).toISOString().slice(0, 10));

  console.log('\nproration_behavior=none (next invoice):');
  console.log('  amount_due:', next.amount_due, next.currency, '| lines:', JSON.stringify(lineSummary(next)));
  console.log('\nproration_behavior=create_prorations (immediate change, what the SOP would bill now):');
  console.log('  amount_due:', now.amount_due, now.currency, '| lines:', JSON.stringify(lineSummary(now)));

  console.log('\nChecks for the no-proration case:');
  for (const [name, ok] of checks) console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}`);
  console.log('\nNothing was created or charged. Upcoming-invoice calls are GET requests.');
}

(async () => {
  if (args.includes('--list-prices')) {
    await listPrices();
    return;
  }
  const sub = argValue('--sub');
  const price = argValue('--price');
  if (!sub || !price) {
    console.error('Usage: --list-prices, or --sub <sub_id> --price <price_id>');
    process.exit(1);
  }
  await previewChange(sub, price);
})().catch((err) => {
  console.error('Preview failed:', err.message);
  process.exit(1);
});
