/**
 * MTNS MADE - Track 2 member notices
 *
 * Builds the price-change notice for every Group A member in the automated
 * Professional batch and writes the rendered emails to files for review.
 * By default it sends nothing. Never changes Stripe, Memberstack, Supabase or
 * Webflow.
 *
 * Usage:
 *   node track2-notices.js --out <dir> [--overrides <file.csv>] [--notice-days 30] [--send-date YYYY-MM-DD]
 *   node track2-notices.js --out <dir> [--overrides ...] --send --only a@x.com,b@y.com
 *
 *   --send         Actually send, but ONLY to the addresses listed in --only.
 *                  There is no "send to everyone" mode: each batch is named.
 *   --only         Comma-separated recipient emails for this batch. Every one
 *                  must be in the rendered, non-excluded list or nothing sends.
 *
 *   --out          Directory for manifest.csv and emails.txt. Both contain
 *                  member names and emails, so keep it outside the repo
 *                  (the repo is public).
 *   --overrides    Optional CSV with columns email,target_slug for members
 *                  whose tier was decided outside Memberstack.
 *   --notice-days  Days between the email and the first charge at the new
 *                  fee. Default 30.
 *   --send-date    Date the notices will go out. Default today. Ignored
 *                  with --send (always today, so the dates in the email are
 *                  counted from the real send).
 *
 * Every send is recorded in pricing-migration/track2-notices-sent.json
 * (gitignored). An address already in that ledger, in any state, is never
 * emailed again by this script; a "sending" entry means a run stopped mid-send
 * and must be checked by hand in the support@ Sent folder.
 *
 * Credentials from ../../cred.env: STRIPE_RESTRICTED_KEY, SECRET_KEY
 * (Memberstack admin). Values are never printed.
 *
 * See docs/track2-member-migration-plan.md (gitignored) for the plan.
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../cred.env') });
const { parse } = require('csv-parse/sync');

const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
};
const OUT_DIR = argValue('--out');
const OVERRIDES_PATH = argValue('--overrides');
const NOTICE_DAYS = Number(argValue('--notice-days') || 30);
const SEND = args.includes('--send');
const ONLY = (argValue('--only') || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
const SEND_DATE = !SEND && argValue('--send-date') ? new Date(argValue('--send-date') + 'T00:00:00Z') : new Date();
const LEDGER_PATH = path.join(__dirname, '../../pricing-migration/track2-notices-sent.json');

if (!OUT_DIR) {
  console.error('Missing --out <dir>. Write it outside the repo.');
  process.exit(1);
}
if (SEND && ONLY.length === 0) {
  console.error('--send needs --only <emails>. Each batch must be named.');
  process.exit(1);
}

const STRIPE_KEY = process.env.STRIPE_RESTRICTED_KEY;
const MS_KEY = process.env.SECRET_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const INTERNAL_SECRET = process.env.INTERNAL_FN_SECRET;
if (!STRIPE_KEY || !MS_KEY) {
  console.error('STRIPE_RESTRICTED_KEY and SECRET_KEY must be set in cred.env');
  process.exit(1);
}
if (SEND && (!SUPABASE_URL || !INTERNAL_SECRET)) {
  console.error('SUPABASE_URL and INTERNAL_FN_SECRET must be set in cred.env to send');
  process.exit(1);
}

// Live legacy flat-plan prices (checked 2026-10-18; the other legacy prices
// have no live subscriptions).
const LEGACY_PRICES = {
  price_1NmyKdI0ScLVLNgq2k7wyA2P: { kind: 'annual', amount: 40 }, // every 12 months
  price_1NdB3BI0ScLVLNgqXtoO86ux: { kind: 'annual', amount: 40 }, // every year
  price_1NdB2HI0ScLVLNgqHLPfPaXb: { kind: 'monthly', amount: 5 },
  price_1NmyK1I0ScLVLNgqAbElYu4x: { kind: 'monthly', amount: 5 },
};
const PROFESSIONAL = { annual: 50, monthly: 5 };

// ============================================
// API HELPERS (GET only)
// ============================================

async function stripeGet(apiPath, params = {}) {
  const url = new URL('https://api.stripe.com/v1' + apiPath);
  for (const [k, v] of Object.entries(params)) url.searchParams.append(k, v);
  const res = await fetch(url, {
    headers: { Authorization: 'Basic ' + Buffer.from(STRIPE_KEY + ':').toString('base64') },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Stripe ${apiPath} HTTP ${res.status}: ${body.error ? body.error.message : ''}`);
  return body;
}

async function stripeListAll(apiPath, params) {
  const out = [];
  let after = null;
  for (;;) {
    const page = await stripeGet(apiPath, { ...params, limit: '100', ...(after ? { starting_after: after } : {}) });
    out.push(...page.data);
    if (!page.has_more) return out;
    after = page.data[page.data.length - 1].id;
  }
}

async function memberstackAll() {
  const out = [];
  let after = null;
  for (;;) {
    const url = 'https://admin.memberstack.com/members?limit=100' + (after ? `&after=${after}` : '');
    // Memberstack's edge rejects default runtime user agents (Cloudflare 1010).
    const res = await fetch(url, { headers: { 'X-API-KEY': MS_KEY, 'User-Agent': 'curl/8.7.1' } });
    if (!res.ok) throw new Error(`Memberstack HTTP ${res.status}`);
    const body = await res.json();
    out.push(...(body.data || []));
    if (!body.hasNextPage || !body.data || body.data.length === 0) return out;
    after = body.endCursor;
  }
}

// ============================================
// HELPERS
// ============================================

function firstNameOf(raw) {
  const name = (raw || '').trim().split(/\s+/)[0] || '';
  if (!name) return 'there';
  // Only fix all-lowercase entries; leave deliberate casing (e.g. McLean) alone.
  return name === name.toLowerCase() ? name[0].toUpperCase() + name.slice(1) : name;
}

function formatDate(d) {
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Sydney' });
}

// First renewal falling at least NOTICE_DAYS after the send date.
function effectiveRenewal(periodEnd, interval, intervalCount) {
  const cutoff = new Date(SEND_DATE.getTime() + NOTICE_DAYS * 86400000);
  const d = new Date(periodEnd * 1000);
  const months = (interval === 'year' ? 12 : 1) * intervalCount;
  while (d < cutoff) d.setUTCMonth(d.getUTCMonth() + months);
  return d;
}

const csvCell = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

// ============================================
// TEMPLATES (approved copy, plan section 10)
// ============================================

const SIGN_OFF = `If you think a different tier would suit you better, or you have any questions, reply to this email or contact support@mtnsmade.com.au and we'll be happy to review your membership with you.

Thank you for your continued support of MTNS MADE.

Kind regards,
The MTNS MADE Team`;

function templateA({ first_name, tier, old_amount, new_amount, effective_date }) {
  return {
    subject: `Your MTNS MADE membership is moving to the ${tier} tier`,
    body: `Hi ${first_name},

There's nothing you need to do. We're writing to let you know about a change to your MTNS MADE membership.

MTNS MADE now has tiered memberships, and we've moved your membership to the ${tier} tier.

Here's how your annual fee changes:

Current fee: $${old_amount} a year
New fee: $${new_amount} a year
Starting: at your renewal on ${effective_date}

The new fee replaces your current fee. It isn't an extra charge, and nothing changes before ${effective_date}.

${SIGN_OFF}`,
  };
}

function templateB({ first_name }) {
  return {
    subject: 'Your MTNS MADE membership is now on the Professional tier',
    body: `Hi ${first_name},

There's nothing you need to do, and your fee isn't changing.

MTNS MADE now has tiered memberships, and we've moved your membership to the Professional tier.

Your fee stays at $5 a month, charged on the same day each month as it is now.

${SIGN_OFF}`,
  };
}

// ============================================
// SENDING
// ============================================

function readLedger() {
  return fs.existsSync(LEDGER_PATH) ? JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8')) : {};
}

function writeLedger(ledger) {
  fs.mkdirSync(path.dirname(LEDGER_PATH), { recursive: true });
  const tmp = LEDGER_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(ledger, null, 2) + '\n');
  fs.renameSync(tmp, LEDGER_PATH);
}

// Through the send-email edge function, so mail goes out via the existing
// Gmail service account from the allowlisted support@ sender. The internal
// secret marks this as a trusted server-side caller.
async function sendOne(row) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-internal-secret': INTERNAL_SECRET },
    body: JSON.stringify({
      to: row.email,
      from: 'MTNS MADE <support@mtnsmade.com.au>',
      replyTo: 'support@mtnsmade.com.au',
      subject: row.email_out.subject,
      text: row.email_out.body,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) throw new Error(`send-email HTTP ${res.status}: ${body.error || 'unknown error'}`);
  return body.id || '';
}

async function sendBatch(rows) {
  const sendable = new Map(rows.filter((r) => r.email_out).map((r) => [r.email.toLowerCase(), r]));
  const ledger = readLedger();
  const problems = [];
  for (const e of ONLY) {
    if (!sendable.has(e)) problems.push(`${e}: not in the rendered, non-excluded list`);
    else if (ledger[e]) problems.push(`${e}: already in the ledger (${ledger[e].status}, ${ledger[e].at})`);
  }
  if (problems.length) {
    console.error('Nothing sent. Fix these first:\n  ' + problems.join('\n  '));
    process.exit(1);
  }

  for (const e of ONLY) {
    const row = sendable.get(e);
    const base = { template: row.template, effective_date: row.effective_date, stripe_subscription: row.stripe_subscription, memberstack_id: row.memberstack_id };
    ledger[e] = { ...base, status: 'sending', at: new Date().toISOString() };
    writeLedger(ledger);
    try {
      const id = await sendOne(row);
      ledger[e] = { ...base, status: 'sent', at: new Date().toISOString(), gmail_id: id };
      writeLedger(ledger);
      console.log(`  sent      ${e} (template ${row.template}${row.effective_date ? ', from ' + row.effective_date : ''})`);
    } catch (err) {
      ledger[e] = { ...base, status: 'failed', at: new Date().toISOString(), error: err.message };
      writeLedger(ledger);
      console.error(`  FAILED    ${e}: ${err.message}`);
      console.error('Stopping the batch on the first failure.');
      process.exit(1);
    }
  }
  console.log(`Sent ${ONLY.length}. Ledger: ${LEDGER_PATH}`);
}

// ============================================
// MAIN
// ============================================

async function main() {
  const overrides = new Map();
  if (OVERRIDES_PATH) {
    for (const r of parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'), { columns: true, skip_empty_lines: true })) {
      overrides.set(r.email.trim().toLowerCase(), r.target_slug.trim());
    }
  }

  const members = await memberstackAll();
  const byCustomer = new Map();
  for (const m of members) if (m.stripeCustomerId) byCustomer.set(m.stripeCustomerId, m);

  const subs = [];
  for (const priceId of Object.keys(LEGACY_PRICES)) {
    for (const s of await stripeListAll('/subscriptions', { price: priceId, status: 'active' })) subs.push({ s, priceId });
  }

  const perCustomer = new Map();
  for (const { s } of subs) perCustomer.set(s.customer, (perCustomer.get(s.customer) || 0) + 1);

  const rows = [];
  for (const { s, priceId } of subs) {
    const legacy = LEGACY_PRICES[priceId];
    const item = s.items.data[0];
    const rec = item.price.recurring;
    const periodEnd = item.current_period_end || s.current_period_end;
    const m = byCustomer.get(s.customer);
    const email = m ? (m.auth && m.auth.email) || '' : '';
    const cf = (m && m.customFields) || {};
    const target = overrides.get(email.toLowerCase()) || cf['membership-type'] || '';

    let exclude = '';
    if (!m) exclude = 'no Memberstack member for this Stripe customer';
    else if (s.cancel_at_period_end) exclude = 'cancelling at period end';
    else if (s.collection_method !== 'charge_automatically') exclude = 'invoice billing, handled individually';
    else if (s.items.data.length !== 1) exclude = 'subscription has more than one item';
    else if (perCustomer.get(s.customer) > 1) exclude = 'customer has more than one legacy subscription';
    else if (!target) exclude = 'no tier decided';
    else if (target !== 'professional') exclude = `outlier (${target}), awaiting Hannah`;

    const row = {
      email,
      first_name: firstNameOf(cf['first-name']),
      memberstack_id: m ? m.id : '',
      stripe_subscription: s.id,
      current_price: priceId,
      billing: `${rec.interval_count} x ${rec.interval}`,
      renews: periodEnd ? formatDate(new Date(periodEnd * 1000)) : '',
      target,
      template: '',
      effective_date: '',
      excluded: exclude,
    };

    if (!exclude) {
      if (legacy.kind === 'annual') {
        row.template = 'A';
        row.effective_date = formatDate(effectiveRenewal(periodEnd, rec.interval, rec.interval_count));
        row.email_out = templateA({ ...row, tier: 'Professional', old_amount: legacy.amount, new_amount: PROFESSIONAL.annual });
      } else {
        row.template = 'B';
        row.email_out = templateB(row);
      }
    }
    rows.push(row);
  }

  rows.sort((a, b) => (a.excluded ? 1 : 0) - (b.excluded ? 1 : 0) || a.template.localeCompare(b.template) || a.email.localeCompare(b.email));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const cols = ['email', 'first_name', 'template', 'billing', 'renews', 'effective_date', 'target', 'excluded', 'memberstack_id', 'stripe_subscription', 'current_price'];
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.csv'), [cols.join(','), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\n') + '\n');

  const sendable = rows.filter((r) => r.email_out);
  fs.writeFileSync(
    path.join(OUT_DIR, 'emails.txt'),
    sendable.map((r) => `To: ${r.email}\nSubject: ${r.email_out.subject}\n\n${r.email_out.body}\n`).join('\n' + '='.repeat(72) + '\n\n')
  );

  const count = (f) => rows.filter(f).length;
  console.log(`Send date ${formatDate(SEND_DATE)}, notice ${NOTICE_DAYS} days`);
  console.log(`Live legacy subscriptions: ${rows.length}`);
  console.log(`  To notify: ${sendable.length} (template A ${count((r) => r.template === 'A')}, template B ${count((r) => r.template === 'B')})`);
  const reasons = {};
  for (const r of rows) if (r.excluded) reasons[r.excluded] = (reasons[r.excluded] || 0) + 1;
  for (const [k, v] of Object.entries(reasons)) console.log(`  Excluded, ${k}: ${v}`);
  const deferred = rows.filter((r) => r.template === 'A' && r.effective_date !== r.renews).length;
  console.log(`  Annual members renewing inside the notice window (pay old fee once more): ${deferred}`);
  console.log(`Wrote ${path.join(OUT_DIR, 'manifest.csv')} and emails.txt`);

  const ledger = readLedger();
  const alreadySent = rows.filter((r) => ledger[r.email.toLowerCase()]).length;
  if (alreadySent) console.log(`  Already in the sent ledger: ${alreadySent}`);

  if (SEND) {
    console.log(`\nSENDING to ${ONLY.length} named recipient(s):`);
    await sendBatch(rows);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
