/**
 * MTNS MADE - Track 2 notice vs Stripe charge check (READ ONLY)
 *
 * For every rendered notice, compares what the email says (current fee, new
 * fee, start date) with what Stripe will actually charge after the swap:
 * the target price itself, and an invoice preview of the swapped
 * subscription (amount due, tax, discounts, customer balance, date).
 *
 * Usage:
 *   node track2-price-check.js --emails <dir>/emails.txt --manifest <dir>/manifest.csv --out <report.csv>
 *
 * Makes no changes. --out holds member emails, keep it outside the repo.
 */

const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { PROFESSIONAL_TARGET, GROUP_B_TARGET, requireKeys, stripeGet, readLedger } = require('./track2-lib');

const args = process.argv.slice(2);
const argValue = (flag) => args[args.indexOf(flag) + 1];
const EMAILS = argValue('--emails');
const MANIFEST = argValue('--manifest');
const OUT = argValue('--out');

// Group A (legacy flat plan) and Group B (2024 tier prices) targets.
const TARGET = { ...PROFESSIONAL_TARGET, ...GROUP_B_TARGET };

const longDate = (ts) => new Date(ts * 1000).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Sydney' });
const dollars = (cents) => (cents % 100 ? (cents / 100).toFixed(2) : String(cents / 100));

function parseEmails(text) {
  const out = new Map();
  for (const block of text.split(/^=+$/m)) {
    const to = (block.match(/^To: (.+)$/m) || [])[1];
    if (!to) continue;
    const cur = block.match(/Current fee: \$([\d.]+) a (year|month)/);
    const neu = block.match(/New fee: \$([\d.]+) a (year|month)/);
    const start = (block.match(/Starting: (?:at your renewal|with your payment) on (.+)$/m) || [])[1];
    const monthly = block.match(/Your fee stays at \$([\d.]+) a month/);
    out.set(to.trim().toLowerCase(), monthly
      ? { old: monthly[1], new: monthly[1], per: 'month', start: '' }
      : { old: cur && cur[1], new: neu && neu[1], per: neu && neu[2], start: start && start.trim() });
  }
  return out;
}

(async () => {
  requireKeys();
  const emails = parseEmails(fs.readFileSync(EMAILS, 'utf8'));
  const rows = parse(fs.readFileSync(MANIFEST, 'utf8'), { columns: true }).filter((r) => !r.excluded);
  const ledger = readLedger();

  // The target prices themselves.
  console.log('Target prices in Stripe now:');
  const targets = {};
  for (const id of new Set(rows.map((r) => TARGET[r.current_price]).filter(Boolean).map((t) => t.stripe))) {
    const p = await stripeGet(`/prices/${id}`, { 'expand[]': 'product' });
    targets[id] = p;
    const r = p.recurring;
    console.log(`  ${id}: ${p.currency.toUpperCase()} ${dollars(p.unit_amount)} every ${r.interval_count} ${r.interval} | active ${p.active} | product "${p.product.name}" | tax_behavior ${p.tax_behavior} | created ${new Date(p.created * 1000).toISOString().slice(0, 10)}`);
  }

  const report = [];
  for (const r of rows) {
    const email = r.email.toLowerCase();
    const sent = ledger[email];
    const said = emails.get(email);
    const s = await stripeGet(`/subscriptions/${r.stripe_subscription}`, { 'expand[]': 'customer' });
    const item = s.items.data[0];
    const target = TARGET[item.price.id];
    const issues = [];
    if (!target) issues.push(`not on a Track 2 source price (${item.price.id})`);
    const tp = target && targets[target.stripe];
    const periodEnd = item.current_period_end || s.current_period_end;
    const renews = longDate(periodEnd);
    // The start date the member was (or will be) told.
    const start = sent ? sent.effective_date : said && said.start;

    if (!said) issues.push('no rendered email');
    if (said && target) {
      if (Number(said.old) * 100 !== item.price.unit_amount) issues.push(`email current fee $${said.old}, Stripe price $${dollars(item.price.unit_amount)}`);
      if (Number(said.new) * 100 !== tp.unit_amount) issues.push(`email new fee $${said.new}, target price $${dollars(tp.unit_amount)}`);
      const rec = item.price.recurring;
      const per = rec.interval === 'year' || rec.interval_count === 12 ? 'year' : 'month';
      if (said.per !== per) issues.push(`email says a ${said.per}, billing is ${per}ly`);
    }
    if (s.customer.discount || s.discount || (s.discounts && s.discounts.length)) issues.push('has a discount or coupon');
    if (s.customer.balance) issues.push(`customer balance ${dollars(s.customer.balance)}`);

    let preview = null;
    if (target) {
      const renewsAtNewFee = !start || start === renews;
      if (renewsAtNewFee) {
        preview = await stripeGet('/invoices/upcoming', {
          subscription: s.id,
          'subscription_details[items][0][id]': item.id,
          'subscription_details[items][0][price]': target.stripe,
          'subscription_details[proration_behavior]': 'none',
        });
        if (preview.amount_due !== tp.unit_amount) issues.push(`preview charges $${dollars(preview.amount_due)} (total $${dollars(preview.total)}, tax $${dollars(preview.tax || 0)})`);
        if (preview.lines.data.some((l) => l.proration)) issues.push('preview has proration');
        if (longDate(preview.next_payment_attempt || preview.period_end || periodEnd) !== renews && preview.lines.data[0].period.start !== periodEnd) issues.push('preview date differs from renewal');
      } else {
        // Renews before the new-fee date: that renewal stays at the old fee.
        preview = await stripeGet('/invoices/upcoming', { subscription: s.id });
        if (preview.amount_due !== item.price.unit_amount) issues.push(`next renewal ${renews} charges $${dollars(preview.amount_due)}, expected old fee`);
        if (start && Date.parse(start) <= periodEnd * 1000) issues.push(`email start ${start} is not after renewal ${renews}`);
      }
    }
    report.push({
      email,
      notice: sent ? 'sent' : 'not sent',
      billing: r.billing,
      renews,
      email_current: said ? said.old : '',
      email_new: said ? said.new : '',
      email_start: start || '',
      stripe_current: dollars(item.price.unit_amount),
      stripe_target: tp ? dollars(tp.unit_amount) : '',
      next_charge: preview ? dollars(preview.amount_due) : '',
      next_charge_date: renews,
      issues: issues.join('; '),
    });
  }

  const cols = Object.keys(report[0]);
  fs.writeFileSync(OUT, [cols.join(','), ...report.map((x) => cols.map((c) => `"${String(x[c]).replace(/"/g, '""')}"`).join(','))].join('\n') + '\n');
  const bad = report.filter((x) => x.issues);
  console.log(`\nChecked ${report.length} notices (${report.filter((x) => x.notice === 'sent').length} already sent). Mismatches: ${bad.length}`);
  for (const b of bad) console.log(`  ${b.notice.padEnd(8)} ${b.billing.padEnd(10)} renews ${b.renews}: ${b.issues}`);
  console.log(`Report: ${OUT}`);
})().catch((e) => {
  console.error('Check failed:', e.message);
  process.exit(1);
});
