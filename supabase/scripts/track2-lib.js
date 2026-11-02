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

// Group B: already on the right tier, still on a 2024 price. Each 2024 price
// maps to the tier's one active 2026 price with the same billing period
// (found by track2-groupb-dry-run.js, 2026-11-02). Spaces & Suppliers is not
// here: its 2026 price is not decided.
const GROUP_B_TARGET = {
  price_1PhVBqI0ScLVLNgqwimq6Phx: { tier: 'emerging', name: 'Emerging', stripe: 'price_1U0i40I0ScLVLNgqPy793m7K', memberstack: 'prc_2026-emerging-annual-lk2i906t0', plan: 'pln_emerging-i59k0l22' },
  price_1Q3syRI0ScLVLNgqMOQgC3M2: { tier: 'emerging', name: 'Emerging', stripe: 'price_1U0i9hI0ScLVLNgqmvuGAraN', memberstack: 'prc_2026-emerging-monthly-fd2ia06uj', plan: 'pln_emerging-i59k0l22' },
  price_1PhVFlI0ScLVLNgqMjnUpLpE: { tier: 'professional', name: 'Professional', stripe: 'price_1U0iBqI0ScLVLNgqy1h3qaQ5', memberstack: 'prc_2026-professional-annual-8x2ix01w6', plan: 'pln_professional-ic970osr' },
  price_1Q3sFeI0ScLVLNgqzYR05G5U: { tier: 'professional', name: 'Professional', stripe: 'price_1U0iCHI0ScLVLNgqSqo0DmL4', memberstack: 'prc_2026-professional-monthly-e72ib06fg', plan: 'pln_professional-ic970osr' },
  price_1PhVA6I0ScLVLNgqBU9pVQll: { tier: 'not-for-profit', name: 'Not For Profit', stripe: 'price_1U0iFAI0ScLVLNgqQg1Po8Ix', memberstack: 'prc_2026-not-for-profit-annual-0j2go0ypj', plan: 'pln_not-for-profit-qaa106a4' },
  price_1Q3sfcI0ScLVLNgqc0G27iy4: { tier: 'not-for-profit', name: 'Not For Profit', stripe: 'price_1U0iFWI0ScLVLNgqVRYK76F2', memberstack: 'prc_2026-not-for-profit-monthly-442j001xz', plan: 'pln_not-for-profit-qaa106a4' },
  price_1PhVH1I0ScLVLNgqI0wsbQ05: { tier: 'small-business', name: 'Small Business', stripe: 'price_1U0iD7I0ScLVLNgq1VzQNnJm', memberstack: 'prc_2026-small-business-annual-el2ic068k', plan: 'pln_small-business-qsa506lc' },
  price_1PhVI2I0ScLVLNgqpwNWVx7g: { tier: 'large-business', name: 'Large Business', stripe: 'price_1U0iEAI0ScLVLNgqxEce82Lh', memberstack: 'prc_2026-medium-large-business-annual-su2iy0155', plan: 'pln_medium-large-business-9qa706pj' },
};

function requireKeys() {
  if (!STRIPE_KEY || !MS_KEY) {
    console.error('STRIPE_RESTRICTED_KEY and SECRET_KEY must be set in cred.env');
    process.exit(1);
  }
}

// fetch that retries on network errors (not on HTTP errors). Stripe writes
// carry an Idempotency-Key, so a retried POST cannot apply twice.
async function fetchRetry(url, opts, tries = 5) {
  for (let i = 1; ; i++) {
    try {
      return await fetch(url, opts);
    } catch (err) {
      if (i >= tries) throw err;
      await new Promise((r) => setTimeout(r, 5000 * i));
    }
  }
}

async function stripeGet(apiPath, params = {}) {
  const url = new URL('https://api.stripe.com/v1' + apiPath);
  for (const [k, v] of Object.entries(params)) url.searchParams.append(k, v);
  const res = await fetchRetry(url, {
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
    const res = await fetchRetry(url, { headers: { 'X-API-KEY': MS_KEY, 'User-Agent': 'curl/8.7.1' } });
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

// Same idea for Group B, where the tier is already right: '' if the
// subscription can go in the automated batch.
function groupBExclusionReason({ s, m, liveSubsForCustomer }) {
  const target = GROUP_B_TARGET[s.items.data[0] && s.items.data[0].price.id];
  const paid = ((m && m.planConnections) || []).filter((c) => c.status === 'ACTIVE' && c.payment && c.payment.amount);
  if (!target) return 'no 2026 price for this period';
  if (!m) return 'no Memberstack member for this Stripe customer';
  if (s.status !== 'active') return `status ${s.status}`;
  if (s.cancel_at_period_end || s.cancel_at) return 'cancelling';
  if (s.collection_method !== 'charge_automatically') return 'invoice billing, handled individually';
  if (s.items.data.length !== 1) return 'subscription has more than one item';
  if (liveSubsForCustomer > 1) return 'customer has more than one live subscription';
  if (s.discount || (s.discounts && s.discounts.length)) return 'discount on subscription';
  if (s.pending_update || s.schedule) return 'pending update or schedule';
  if (paid.length !== 1) return `${paid.length} paid Memberstack plans`;
  if (paid[0].planId !== target.plan) return `Memberstack plan ${paid[0].planId}`;
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
  GROUP_B_TARGET,
  requireKeys,
  stripeGet,
  stripeListAll,
  memberstackAll,
  loadOverrides,
  readLedger,
  memberEmail,
  exclusionReason,
  groupBExclusionReason,
  fetchRetry,
};
