/**
 * MTNS MADE - Track 2 progress tracker (READ ONLY)
 *
 * Takes a live snapshot of every Group A and Group B subscription, works out where each
 * member is in the migration, records the snapshot, and writes a local HTML
 * page to view progress. Makes NO changes to Stripe, Memberstack, Supabase or
 * Webflow, and sends nothing.
 *
 * Usage:
 *   node track2-status.js [--open] [--notice-days 30]
 *
 * Writes to pricing-migration/ (gitignored; the repo is public):
 *   track2-roster.json    every subscription ever seen on a legacy (Group A)
 *                         or 2024 tier (Group B) price.
 *                         Members stay on it after their price is swapped,
 *                         so they can be followed to the end.
 *   track2-history.json   one entry per run: counts and each member's stage,
 *                         used to spot anyone moving backwards.
 *   track2-tracker.html   the page. --open opens it in the browser.
 *
 * Reads track2-notices-sent.json (written by track2-notices.js --send) and
 * track2-overrides.csv. Stages, in order:
 *   Excluded, Ready, Notice sent, Price swapped, Verified, Renewed at new price
 * plus Ended (subscription no longer live) and Other price (needs a look).
 * Verified means Stripe, Memberstack and Supabase agree. Webflow is not
 * checked here; it follows Supabase via sync-to-webflow.
 */

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const {
  PRIVATE_DIR,
  LEGACY_PRICES,
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
} = require('./track2-lib');

// Swap target for every source price, Group A and Group B, in one shape.
const TARGETS = { ...GROUP_B_TARGET };
for (const [id, t] of Object.entries(PROFESSIONAL_TARGET)) TARGETS[id] = { ...t, tier: 'professional', name: 'Professional', plan: PROFESSIONAL_PLAN_ID };
// Group B was swapped before it joined the roster, so seed it from the notice run.
const GROUP_B_MANIFEST = path.join(PRIVATE_DIR, 'notices-groupb-2026-11-02', 'manifest.csv');

const ROSTER_PATH = path.join(PRIVATE_DIR, 'track2-roster.json');
const HISTORY_PATH = path.join(PRIVATE_DIR, 'track2-history.json');
const PAGE_PATH = path.join(PRIVATE_DIR, 'track2-tracker.html');

const STAGES = ['Excluded', 'Ready', 'Notice sent', 'Price swapped', 'Verified', 'Renewed at new price', 'Ended', 'Other price'];
// Forward order for spotting regressions; Ended and Other price sit outside it.
const RANK = { Excluded: 0, Ready: 1, 'Notice sent': 2, 'Price swapped': 3, Verified: 4, 'Renewed at new price': 5 };
const LIVE = new Set(['active', 'trialing', 'past_due']);
const DAY = 86400000;
// Must match the notice period used by track2-notices.js (--notice-days).
const NOTICE_DAYS = Number((process.argv.includes('--notice-days') && process.argv[process.argv.indexOf('--notice-days') + 1]) || 30);

const readJson = (p, fallback) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : fallback);
function writeJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p + '.tmp', JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(p + '.tmp', p);
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const n = i++;
      out[n] = await fn(items[n]);
    }
  }));
  return out;
}

async function supabaseMembers() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const res = await fetch(`${url}/rest/v1/members?select=memberstack_id,subscription_status,membership_types(slug)&limit=5000`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
  const map = new Map();
  for (const r of await res.json()) {
    if (r.memberstack_id) map.set(r.memberstack_id, { type: r.membership_types ? r.membership_types.slug : null, status: r.subscription_status });
  }
  return map;
}

function periodEndOf(s) {
  const item = s.items && s.items.data[0];
  return (item && item.current_period_end) || s.current_period_end || null;
}

function groupOf(entry, exclusion) {
  if (GROUP_B_TARGET[entry.legacy_price]) {
    if (exclusion) return 'Group B, excluded';
    const t = GROUP_B_TARGET[entry.legacy_price];
    return `Group B, ${t.name} ${entry.monthly ? 'monthly' : 'yearly'}`;
  }
  if (exclusion.startsWith('outlier')) return 'Outliers';
  if (exclusion) return 'Excluded (other)';
  const legacy = LEGACY_PRICES[entry.legacy_price];
  if (legacy.kind === 'monthly') return 'Monthly';
  return entry.legacy_price === 'price_1NmyKdI0ScLVLNgq2k7wyA2P' ? 'Annual, every 12 months' : 'Annual, yearly';
}

const fmt = (ts) => (ts ? new Date(ts * 1000).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Australia/Sydney' }) : '');

async function main() {
  requireKeys();
  const now = Date.now();
  const overrides = loadOverrides();
  const ledger = readLedger();

  const [members, sbMembers] = await Promise.all([memberstackAll(), supabaseMembers()]);
  const byCustomer = new Map();
  for (const m of members) if (m.stripeCustomerId) byCustomer.set(m.stripeCustomerId, m);

  // Current legacy subscriptions: adds anything new to the roster.
  const legacySubs = [];
  for (const priceId of Object.keys(LEGACY_PRICES)) {
    for (const s of await stripeListAll('/subscriptions', { price: priceId, status: 'active' })) legacySubs.push({ s, priceId });
  }
  const perCustomer = new Map();
  for (const { s } of legacySubs) perCustomer.set(s.customer, (perCustomer.get(s.customer) || 0) + 1);

  // Group B: still on a 2024 price now, or in the notice run.
  const allLive = (await stripeListAll('/subscriptions', { status: 'all' })).filter((s) => LIVE.has(s.status));
  const livePerCustomer = new Map();
  for (const s of allLive) livePerCustomer.set(s.customer, (livePerCustomer.get(s.customer) || 0) + 1);
  const groupBSubs = allLive.filter((s) => s.items.data[0] && GROUP_B_TARGET[s.items.data[0].price.id]).map((s) => ({ s, priceId: s.items.data[0].price.id }));
  if (fs.existsSync(GROUP_B_MANIFEST)) {
    const { parse } = require('csv-parse/sync');
    for (const r of parse(fs.readFileSync(GROUP_B_MANIFEST, 'utf8'), { columns: true })) {
      if (!groupBSubs.some((x) => x.s.id === r.stripe_subscription)) groupBSubs.push({ s: { id: r.stripe_subscription }, priceId: r.current_price, fromManifest: true });
    }
  }

  const roster = readJson(ROSTER_PATH, { created_at: new Date(now).toISOString(), subs: {} });
  const firstRun = Object.keys(roster.subs).length === 0;
  const added = [];
  for (const { s, priceId } of legacySubs) {
    if (!roster.subs[s.id]) {
      roster.subs[s.id] = { customer: s.customer, legacy_price: priceId, added_at: new Date(now).toISOString() };
      added.push(s.id);
    }
  }
  const groupBFirst = !Object.values(roster.subs).some((e) => e.group === 'B');
  for (const { s, priceId, fromManifest } of groupBSubs) {
    if (roster.subs[s.id]) continue;
    const full = fromManifest ? await stripeGet(`/subscriptions/${s.id}`) : s;
    const rec = (await stripeGet(`/prices/${priceId}`)).recurring;
    roster.subs[s.id] = { customer: full.customer, legacy_price: priceId, group: 'B', monthly: rec.interval === 'month', added_at: new Date(now).toISOString() };
    if (!groupBFirst) added.push(s.id);
  }

  // Live state of every roster subscription, swapped or not.
  const ids = Object.keys(roster.subs);
  const live = await mapLimit(ids, 8, (id) => stripeGet(`/subscriptions/${id}`).catch((e) => ({ id, __error: e.message })));

  const rows = [];
  for (let n = 0; n < ids.length; n++) {
    const id = ids[n];
    const entry = roster.subs[id];
    const s = live[n];
    const m = byCustomer.get(entry.customer);
    const email = memberEmail(m);
    const cf = (m && m.customFields) || {};
    const target = overrides.get(email.toLowerCase()) || cf['membership-type'] || '';
    const pro = TARGETS[entry.legacy_price];
    const sent = ledger[email.toLowerCase()];
    const row = {
      sub: id,
      name: [cf['first-name'], cf['last-name']].filter(Boolean).join(' ') || email,
      business: cf['trading-name'] || '',
      email,
      target,
      group: '',
      stage: '',
      price: '',
      renews: '',
      renews_ts: null,
      notice: sent ? sent.status : '',
      notice_at: sent ? sent.at.slice(0, 10) : '',
      effective_date: sent && sent.effective_date ? sent.effective_date : '',
      checks: [],
      note: '',
    };

    if (s.__error) {
      row.stage = 'Other price';
      row.checks.push(`Could not read subscription: ${s.__error}`);
      row.group = 'Excluded (other)';
      rows.push(row);
      continue;
    }

    const item = s.items.data[0];
    const priceId = item ? item.price.id : '';
    const periodEnd = periodEndOf(s);
    row.price = priceId;
    row.renews = fmt(periodEnd);
    row.renews_ts = periodEnd;

    const onLegacy = priceId === entry.legacy_price;
    const exclusion = !onLegacy
      ? entry.last_exclusion || ''
      : entry.group === 'B'
        ? groupBExclusionReason({ s, m, liveSubsForCustomer: livePerCustomer.get(s.customer) || 1 })
        : exclusionReason({ s, m, target, legacySubsForCustomer: perCustomer.get(s.customer) || 1 });
    if (entry.group === 'B') row.target = GROUP_B_TARGET[entry.legacy_price].tier;
    if (onLegacy) {
      entry.last_exclusion = exclusion;
      entry.last_legacy_period_end = periodEnd;
    }
    row.group = groupOf(entry, exclusion);

    if (!LIVE.has(s.status)) {
      row.stage = 'Ended';
      row.note = `Subscription ${s.status}`;
    } else if (onLegacy) {
      if (exclusion) {
        row.stage = 'Excluded';
        row.note = exclusion;
      } else if (sent && sent.status === 'sent') {
        row.stage = 'Notice sent';
      } else {
        row.stage = 'Ready';
      }
    } else if (pro && priceId === pro.stripe) {
      // Swapped to the target price: verify across systems.
      const failed = [];
      if (s.items.data.length !== 1) failed.push('Stripe: more than one item');
      if (entry.last_legacy_period_end && periodEnd !== entry.last_legacy_period_end) {
        failed.push(`Stripe: renewal date moved (${fmt(entry.last_legacy_period_end)} to ${fmt(periodEnd)})`);
      }
      const paid = ((m && m.planConnections) || []).filter((p) => p.status === 'ACTIVE' && p.payment && p.payment.amount);
      if (paid.length !== 1) failed.push(`Memberstack: ${paid.length} paid active plans`);
      const pc = paid[0];
      if (pc && pc.planId !== pro.plan) failed.push(`Memberstack: plan ${pc.planId}`);
      if (pc && pc.payment.priceId !== pro.memberstack) failed.push(`Memberstack: price ${pc.payment.priceId}`);
      const sb = sbMembers && m ? sbMembers.get(m.id) : null;
      if (!sb) failed.push('Supabase: member not found');
      else {
        if (sb.type !== pro.tier) failed.push(`Supabase: type ${sb.type}`);
        if (sb.status !== 'active') failed.push(`Supabase: status ${sb.status}`);
      }
      const custSubs = await stripeListAll('/subscriptions', { customer: entry.customer, status: 'all' });
      const open = custSubs.filter((x) => LIVE.has(x.status));
      if (open.length !== 1) failed.push(`Stripe: customer has ${open.length} live subscriptions`);

      row.checks = failed;
      if (failed.length) {
        row.stage = 'Price swapped';
      } else {
        const inv = await stripeGet('/invoices', { subscription: id, status: 'paid', limit: '5' });
        const renewed = inv.data.some((i) => i.billing_reason === 'subscription_cycle' && i.lines.data.some((l) => l.price && l.price.id === pro.stripe));
        row.stage = renewed ? 'Renewed at new price' : 'Verified';
      }
    } else {
      row.stage = 'Other price';
      row.note = `On ${priceId || 'no price'}, not the source or target price`;
    }
    rows.push(row);
  }

  // Attention items.
  const history = readJson(HISTORY_PATH, []);
  const prev = history.length ? history[history.length - 1].stages : {};
  const attention = [];
  for (const r of rows) {
    if (r.notice === 'failed' || r.notice === 'sending') attention.push({ who: r.name, sub: r.sub, issue: `Notice ${r.notice}: check the support@ Sent folder before any re-send` });
    if (r.checks.length) attention.push({ who: r.name, sub: r.sub, issue: r.checks.join('; ') });
    if (r.stage === 'Other price') attention.push({ who: r.name, sub: r.sub, issue: r.note || 'Unexpected price' });
    const was = prev[r.sub];
    if (was && RANK[was] !== undefined && RANK[r.stage] !== undefined && RANK[r.stage] < RANK[was]) {
      attention.push({ who: r.name, sub: r.sub, issue: `Moved back from ${was} to ${r.stage}` });
    }
    if (r.stage === 'Notice sent' && r.effective_date) {
      const eff = Date.parse(r.effective_date);
      if (!Number.isNaN(eff) && eff - now < 14 * DAY) attention.push({ who: r.name, sub: r.sub, issue: `Price swap needed before ${r.effective_date}` });
    }
  }
  if (!firstRun && added.length) attention.push({ who: `${added.length} subscription(s)`, sub: '', issue: 'New on a legacy price since the last run, added to the roster' });

  // Swap timing: never swap before a renewal that should still be at the old fee.
  for (const r of rows) {
    if (r.stage !== 'Notice sent' || !r.effective_date || !r.renews_ts) continue;
    const eff = Date.parse(r.effective_date);
    if (!Number.isNaN(eff) && r.renews_ts * 1000 < eff - DAY) r.note = `Swap only after the ${r.renews} renewal (still at the old fee)`;
  }
  for (const r of rows) {
    // Group A monthly members pay $5 before and after, so this only matters for fee changes.
    if (r.stage === 'Ready' && r.group !== 'Monthly' && r.renews_ts && r.renews_ts * 1000 - now < NOTICE_DAYS * DAY) {
      r.note = `Renews inside the ${NOTICE_DAYS}-day notice window: pays the old fee once more`;
    }
  }

  const counts = Object.fromEntries(STAGES.map((st) => [st, rows.filter((r) => r.stage === st).length]));
  history.push({ at: new Date(now).toISOString(), counts, stages: Object.fromEntries(rows.map((r) => [r.sub, r.stage])) });
  writeJson(ROSTER_PATH, roster);
  writeJson(HISTORY_PATH, history);

  const upcoming = rows
    .filter((r) => r.renews_ts && r.renews_ts * 1000 >= now && r.renews_ts * 1000 - now < 45 * DAY && !['Ended'].includes(r.stage))
    .sort((a, b) => a.renews_ts - b.renews_ts);

  const data = {
    generated: new Date(now).toISOString(),
    stages: STAGES,
    counts,
    rows: rows.sort((a, b) => STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage) || a.name.localeCompare(b.name)),
    attention,
    upcoming: upcoming.map((r) => ({ name: r.name, renews: r.renews, stage: r.stage, group: r.group, note: r.note })),
    history: history.map((h) => ({ at: h.at, counts: h.counts })),
  };
  fs.writeFileSync(PAGE_PATH, renderPage(data));

  console.log(`Snapshot ${data.generated}: ${rows.length} subscriptions${firstRun ? ' (roster created)' : added.length ? `, ${added.length} added to roster` : ''}`);
  for (const st of STAGES) if (counts[st]) console.log(`  ${st.padEnd(22)} ${counts[st]}`);
  console.log(`  Needs attention: ${attention.length}`);
  console.log(`Page: ${PAGE_PATH}`);
  if (process.argv.includes('--open')) execFileSync('open', [PAGE_PATH]);
}

function renderPage(data) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Track 2 migration tracker</title>
<style>
  :root { --ink:#1d1d1b; --muted:#6b6b66; --line:#e3e1dc; --bg:#ffffff; --panel:#f7f6f3; --accent:#2f5d50; --warn:#a4421b; }
  * { box-sizing:border-box; }
  body { margin:0; font:14px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color:var(--ink); background:var(--bg); }
  main { max-width:1180px; margin:0 auto; padding:28px 24px 60px; }
  h1 { font-size:22px; margin:0 0 4px; }
  h2 { font-size:15px; margin:34px 0 10px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); }
  .sub { color:var(--muted); margin:0; }
  .pipeline { display:grid; grid-template-columns:repeat(auto-fit,minmax(118px,1fr)); gap:8px; margin-top:20px; }
  .stage { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:12px; }
  .stage b { display:block; font-size:26px; font-variant-numeric:tabular-nums; }
  .stage span { color:var(--muted); font-size:12px; }
  .stage.alert { border-color:var(--warn); }
  .bar { display:flex; height:10px; border-radius:5px; overflow:hidden; margin-top:14px; background:var(--line); }
  .bar div { height:100%; }
  .legend { display:flex; flex-wrap:wrap; gap:14px; margin-top:8px; font-size:12px; color:var(--muted); }
  .legend i { display:inline-block; width:10px; height:10px; border-radius:2px; margin-right:5px; vertical-align:-1px; }
  table { width:100%; border-collapse:collapse; }
  th, td { text-align:left; padding:7px 8px; border-bottom:1px solid var(--line); vertical-align:top; }
  th { font-size:12px; color:var(--muted); font-weight:600; position:sticky; top:0; background:var(--bg); }
  td.n { text-align:right; font-variant-numeric:tabular-nums; }
  .wrap { overflow-x:auto; }
  .pill { display:inline-block; padding:1px 8px; border-radius:10px; font-size:12px; background:var(--panel); border:1px solid var(--line); white-space:nowrap; }
  .attn { border-left:3px solid var(--warn); background:#fbf3ef; padding:8px 12px; margin:0 0 6px; border-radius:0 6px 6px 0; }
  .ok { color:var(--accent); }
  .muted { color:var(--muted); }
  .controls { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:10px; }
  select, input { font:inherit; padding:6px 8px; border:1px solid var(--line); border-radius:6px; background:#fff; }
  input { min-width:220px; }
  .small { font-size:12px; }
</style>
</head>
<body>
<main>
  <h1>Track 2 migration tracker</h1>
  <p class="sub" id="meta"></p>
  <div class="pipeline" id="pipeline"></div>
  <div class="bar" id="bar"></div>
  <div class="legend" id="legend"></div>

  <h2>Needs attention</h2>
  <div id="attention"></div>

  <h2>By group</h2>
  <div class="wrap"><table id="groups"></table></div>

  <h2>Renewing in the next 45 days</h2>
  <div class="wrap"><table id="upcoming"></table></div>

  <h2>Members</h2>
  <div class="controls">
    <select id="fStage"><option value="">All stages</option></select>
    <select id="fGroup"><option value="">All groups</option></select>
    <input id="fText" placeholder="Search name, business or email">
    <span class="muted small" id="shown"></span>
  </div>
  <div class="wrap"><table id="members"></table></div>

  <h2>History</h2>
  <div class="wrap"><table id="history"></table></div>
  <p class="muted small">Read-only snapshot. Verified means Stripe, Memberstack and Supabase agree; Webflow is not checked here. Contains member data: keep this file private.</p>
</main>
<script>
const D = ${json};
const COLORS = { 'Excluded':'#bdbab3', 'Ready':'#d9c58f', 'Notice sent':'#8fb3c9', 'Price swapped':'#6d95b5', 'Verified':'#4f8a73', 'Renewed at new price':'#2f5d50', 'Ended':'#8a8782', 'Other price':'#a4421b' };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const total = D.rows.length;
document.getElementById('meta').textContent = 'Snapshot ' + new Date(D.generated).toLocaleString('en-AU') + ' \\u00b7 ' + total + ' subscriptions';

const pipe = document.getElementById('pipeline');
const bar = document.getElementById('bar');
const legend = document.getElementById('legend');
for (const st of D.stages) {
  const n = D.counts[st] || 0;
  if (!n && (st === 'Ended' || st === 'Other price')) continue;
  pipe.insertAdjacentHTML('beforeend', '<div class="stage' + (st === 'Other price' && n ? ' alert' : '') + '"><b>' + n + '</b><span>' + esc(st) + '</span></div>');
  if (n) {
    bar.insertAdjacentHTML('beforeend', '<div title="' + esc(st) + ': ' + n + '" style="width:' + (100 * n / total) + '%;background:' + COLORS[st] + '"></div>');
    legend.insertAdjacentHTML('beforeend', '<span><i style="background:' + COLORS[st] + '"></i>' + esc(st) + ' ' + n + '</span>');
  }
}

const att = document.getElementById('attention');
att.innerHTML = D.attention.length
  ? D.attention.map(a => '<p class="attn"><b>' + esc(a.who) + '</b> ' + esc(a.issue) + '</p>').join('')
  : '<p class="ok">Nothing needs attention.</p>';

const groups = [...new Set(D.rows.map(r => r.group))].sort();
const shownStages = D.stages.filter(st => D.rows.some(r => r.stage === st));
document.getElementById('groups').innerHTML =
  '<tr><th>Group</th>' + shownStages.map(s => '<th class="n">' + esc(s) + '</th>').join('') + '<th class="n">Total</th></tr>' +
  groups.map(g => {
    const rs = D.rows.filter(r => r.group === g);
    return '<tr><td>' + esc(g) + '</td>' + shownStages.map(s => '<td class="n">' + (rs.filter(r => r.stage === s).length || '<span class="muted">0</span>') + '</td>').join('') + '<td class="n"><b>' + rs.length + '</b></td></tr>';
  }).join('');

document.getElementById('upcoming').innerHTML = D.upcoming.length
  ? '<tr><th>Renews</th><th>Member</th><th>Group</th><th>Stage</th><th>Note</th></tr>' +
    D.upcoming.map(u => '<tr><td>' + esc(u.renews) + '</td><td>' + esc(u.name) + '</td><td>' + esc(u.group) + '</td><td><span class="pill">' + esc(u.stage) + '</span></td><td class="small">' + esc(u.note) + '</td></tr>').join('')
  : '<tr><td class="muted">No renewals in the next 45 days.</td></tr>';

const fStage = document.getElementById('fStage'), fGroup = document.getElementById('fGroup'), fText = document.getElementById('fText');
shownStages.forEach(s => fStage.insertAdjacentHTML('beforeend', '<option>' + esc(s) + '</option>'));
groups.forEach(g => fGroup.insertAdjacentHTML('beforeend', '<option>' + esc(g) + '</option>'));
function drawMembers() {
  const q = fText.value.trim().toLowerCase();
  const rs = D.rows.filter(r => (!fStage.value || r.stage === fStage.value) && (!fGroup.value || r.group === fGroup.value) &&
    (!q || (r.name + ' ' + r.business + ' ' + r.email).toLowerCase().includes(q)));
  document.getElementById('shown').textContent = rs.length + ' of ' + total;
  document.getElementById('members').innerHTML =
    '<tr><th>Member</th><th>Group</th><th>Stage</th><th>Renews</th><th>Notice</th><th>New fee from</th><th>Notes</th></tr>' +
    rs.map(r => '<tr><td>' + esc(r.name) + (r.business ? '<div class="muted small">' + esc(r.business) + '</div>' : '') + '<div class="muted small">' + esc(r.email) + '</div></td>' +
      '<td class="small">' + esc(r.group) + '</td><td><span class="pill" style="border-color:' + COLORS[r.stage] + '">' + esc(r.stage) + '</span></td>' +
      '<td class="small">' + esc(r.renews) + '</td><td class="small">' + esc(r.notice ? r.notice + ' ' + r.notice_at : '') + '</td>' +
      '<td class="small">' + esc(r.effective_date) + '</td><td class="small">' + esc([r.note, ...r.checks].filter(Boolean).join('; ')) + '</td></tr>').join('');
}
[fStage, fGroup].forEach(el => el.addEventListener('change', drawMembers));
fText.addEventListener('input', drawMembers);
drawMembers();

document.getElementById('history').innerHTML =
  '<tr><th>Run</th>' + D.stages.map(s => '<th class="n">' + esc(s) + '</th>').join('') + '</tr>' +
  D.history.slice().reverse().map(h => '<tr><td class="small">' + new Date(h.at).toLocaleString('en-AU') + '</td>' + D.stages.map(s => '<td class="n">' + (h.counts[s] || '<span class="muted">0</span>') + '</td>').join('') + '</tr>').join('');
</script>
</body>
</html>
`;
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
