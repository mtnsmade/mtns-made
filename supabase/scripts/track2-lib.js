/**
 * MTNS MADE - Track 2 shared definitions (READ ONLY helpers)
 *
 * Used by track2-notices.js and track2-status.js so both agree on which
 * subscriptions are in the migration, who is excluded and why, and what each
 * member moves to. All API helpers here are GET only.
 *
 * Credentials from ../../cred.env. Values are never printed.
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../cred.env'), quiet: true });
const { parse } = require('csv-parse/sync');

const STRIPE_KEY = process.env.STRIPE_RESTRICTED_KEY;
const MS_KEY = process.env.SECRET_KEY;

// Gitignored folder for anything containing member data.
const PRIVATE_DIR = path.join(__dirname, '../../pricing-migration');
const OVERRIDES_PATH = path.join(PRIVATE_DIR, 'track2-overrides.csv');
const LEDGER_PATH = path.join(PRIVATE_DIR, 'track2-notices-sent.json');

// Live legacy flat-plan prices (checked 2026-10-18; the other legacy prices
// have no live subscriptions).
const LEGACY_PRICES = {
  price_1NmyKdI0ScLVLNgq2k7wyA2P: { kind: 'annual', amount: 40 }, // every 12 months
  price_1NdB3BI0ScLVLNgqXtoO86ux: { kind: 'annual', amount: 40 }, // every year
  price_1NdB2HI0ScLVLNgqHLPfPaXb: { kind: 'monthly', amount: 5 },
  price_1NmyK1I0ScLVLNgqAbElYu4x: { kind: 'monthly', amount: 5 },
};
const PROFESSIONAL = { annual: 50, monthly: 5 };
const PROFESSIONAL_PLAN_ID = 'pln_professional-ic970osr';

// Period-matched Professional target for each legacy price (plan section 4).
const PROFESSIONAL_TARGET = {
  price_1NmyKdI0ScLVLNgq2k7wyA2P: { stripe: 'price_1UEsjbI0ScLVLNgqhYQWLfj2', memberstack: 'prc_member-yearly-12-months-2026-u81ol0vlc' },
  price_1NdB3BI0ScLVLNgqXtoO86ux: { stripe: 'price_1U0iBqI0ScLVLNgqy1h3qaQ5', memberstack: 'prc_2026-professional-annual-8x2ix01w6' },
  price_1NdB2HI0ScLVLNgqHLPfPaXb: { stripe: 'price_1U0iCHI0ScLVLNgqSqo0DmL4', memberstack: 'prc_2026-professional-monthly-e72ib06fg' },
  price_1NmyK1I0ScLVLNgqAbElYu4x: { stripe: 'price_1U0iCHI0ScLVLNgqSqo0DmL4', memberstack: 'prc_2026-professional-monthly-e72ib06fg' },
};

function requireKeys() {
  if (!STRIPE_KEY || !MS_KEY) {
    console.error('STRIPE_RESTRICTED_KEY and SECRET_KEY must be set in cred.env');
    process.exit(1);
  }
}

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

// Tier decisions made outside Memberstack (email -> target slug).
function loadOverrides(file = OVERRIDES_PATH) {
  const map = new Map();
  if (file && fs.existsSync(file)) {
    for (const r of parse(fs.readFileSync(file, 'utf8'), { columns: true, skip_empty_lines: true })) {
      map.set(r.email.trim().toLowerCase(), r.target_slug.trim());
    }
  }
  return map;
}

function readLedger() {
  return fs.existsSync(LEDGER_PATH) ? JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8')) : {};
}

function memberEmail(m) {
  return m ? (m.auth && m.auth.email) || '' : '';
}

// Why a legacy subscription is outside the automated Professional batch, or ''
// if it is in it.
function exclusionReason({ s, m, target, legacySubsForCustomer }) {
  if (!m) return 'no Memberstack member for this Stripe customer';
  if (s.cancel_at_period_end) return 'cancelling at period end';
  if (s.collection_method !== 'charge_automatically') return 'invoice billing, handled individually';
  if (s.items.data.length !== 1) return 'subscription has more than one item';
  if (legacySubsForCustomer > 1) return 'customer has more than one legacy subscription';
  if (!target) return 'no tier decided';
  if (target !== 'professional') return `outlier (${target}), awaiting Hannah`;
  return '';
}

module.exports = {
  PRIVATE_DIR,
  OVERRIDES_PATH,
  LEDGER_PATH,
  LEGACY_PRICES,
  PROFESSIONAL,
  PROFESSIONAL_PLAN_ID,
  PROFESSIONAL_TARGET,
  requireKeys,
  stripeGet,
  stripeListAll,
  memberstackAll,
  loadOverrides,
  readLedger,
  memberEmail,
  exclusionReason,
};
