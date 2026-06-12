/**
 * MTNS MADE - Opportunities Board Display
 * Compact summary rows — click any card to open a full-detail overlay.
 */

(function () {
  'use strict';

  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH';

  const OPPORTUNITY_TYPE_LABELS = {
    'job':              'Job / Employment',
    'commission':       'Commission',
    'collaboration':    'Collaboration',
    'call-for-entries': 'Call for Entries',
    'residency':        'Residency / Fellowship',
    'volunteer':        'Volunteer',
  };

  const styles = `
    /* ── Summary cards ── */
    .x-opp-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .x-opp-row {
      display: flex;
      align-items: baseline;
      gap: 16px;
      padding: 20px 24px;
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s;
      text-align: left;
      width: 100%;
      font-family: inherit;
      position: relative;
    }
    .x-opp-row:hover {
      border-color: #1a1a1a;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .x-opp-row-left {
      flex: 1;
      min-width: 0;
    }
    .x-opp-row-right {
      flex-shrink: 0;
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .x-opp-type-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: #666;
      background: #f2f2f2;
      border-radius: 2px;
      padding: 2px 7px;
      margin-bottom: 6px;
    }

    .x-opp-row-title {
      margin: 0 0 3px;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .x-opp-row-org {
      font-size: 13px;
      color: #777;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .x-opp-row-meta {
      font-size: 12px;
      color: #999;
      white-space: nowrap;
    }
    .x-opp-row-meta strong { color: #666; font-weight: 600; }

    .x-opp-closing-soon {
      font-size: 11px;
      font-weight: 600;
      color: #c0392b;
      letter-spacing: 0.03em;
    }

    .x-opp-row-arrow {
      font-size: 16px;
      color: #ccc;
      margin-left: 8px;
      flex-shrink: 0;
      align-self: center;
    }
    .x-opp-row:hover .x-opp-row-arrow { color: #1a1a1a; }

    /* ── Overlay ── */
    .x-opp-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 9999;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 40px 20px;
      overflow-y: auto;
    }

    .x-opp-modal {
      background: #fff;
      border-radius: 6px;
      width: 100%;
      max-width: 720px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      position: relative;
      padding: 48px 52px;
      margin: auto;
    }

    .x-opp-modal-close {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      font-size: 22px;
      color: #aaa;
      cursor: pointer;
      line-height: 1;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: inherit;
    }
    .x-opp-modal-close:hover { color: #1a1a1a; background: #f5f5f5; }

    .x-opp-modal-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: #666;
      background: #f2f2f2;
      border-radius: 2px;
      padding: 3px 8px;
      margin-bottom: 14px;
    }

    .x-opp-modal-title {
      margin: 0 0 6px;
      font-size: 26px;
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1.25;
    }

    .x-opp-modal-org {
      font-size: 15px;
      color: #777;
      margin: 0 0 24px;
    }

    .x-opp-modal-meta-row {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      padding: 16px 0;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 28px;
    }
    .x-opp-modal-meta-item {
      font-size: 13px;
      color: #666;
    }
    .x-opp-modal-meta-item strong {
      display: block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #aaa;
      margin-bottom: 2px;
    }

    .x-opp-modal-section {
      margin-bottom: 24px;
    }
    .x-opp-modal-section h3 {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #aaa;
      margin: 0 0 8px;
    }
    .x-opp-modal-section p {
      font-size: 15px;
      color: #333;
      line-height: 1.7;
      margin: 0;
      white-space: pre-line;
    }

    .x-opp-modal-actions {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .x-opp-modal-apply {
      display: inline-block;
      background: #1a1a1a;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 4px;
      letter-spacing: 0.02em;
    }
    .x-opp-modal-apply:hover { background: #333; color: #fff; }

    .x-opp-modal-contact {
      font-size: 13px;
      color: #888;
    }
    .x-opp-modal-contact a { color: #555; }

    /* ── Filters ── */
    .x-opp-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 28px;
    }
    .x-opp-filter-btn {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 2px;
      padding: 7px 16px;
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      color: #333;
      transition: all 0.15s;
    }
    .x-opp-filter-btn:hover { border-color: #333; }
    .x-opp-filter-btn.active {
      background: #1a1a1a;
      border-color: #1a1a1a;
      color: #fff;
    }

    .x-opp-loading, .x-opp-empty {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .x-opp-empty h3 { margin: 0 0 8px; font-size: 18px; color: #333; }

    @media (max-width: 600px) {
      .x-opp-row { flex-wrap: wrap; }
      .x-opp-row-right { flex-direction: row; align-items: center; gap: 12px; }
      .x-opp-modal { padding: 32px 24px; }
      .x-opp-modal-title { font-size: 22px; }
    }
  `;

  let allOpportunities = [];
  let activeFilter = null;

  function formatDate(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function isClosingSoon(dateStr) {
    if (!dateStr) return false;
    const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 14;
  }

  // ── Summary row (card) ──────────────────────────────────────────────────────

  function renderRow(opp) {
    const typeLabel = OPPORTUNITY_TYPE_LABELS[opp.opportunity_type] || opp.opportunity_type || '';
    const closingFormatted = formatDate(opp.closing_date);
    const closingSoon = isClosingSoon(opp.closing_date);

    return `
      <button class="x-opp-row" data-id="${opp.id}" type="button" aria-label="View ${opp.name}">
        <div class="x-opp-row-left">
          ${typeLabel ? `<span class="x-opp-type-badge">${typeLabel}</span>` : ''}
          <h2 class="x-opp-row-title">${opp.name || 'Untitled'}</h2>
          ${opp.organization ? `<p class="x-opp-row-org">${opp.organization}</p>` : ''}
        </div>
        <div class="x-opp-row-right">
          ${closingFormatted ? `<div class="x-opp-row-meta"><strong>Closes</strong> ${closingFormatted}</div>` : ''}
          ${closingSoon ? `<div class="x-opp-closing-soon">Closing soon</div>` : ''}
          ${opp.budget ? `<div class="x-opp-row-meta">${opp.budget}</div>` : ''}
        </div>
        <span class="x-opp-row-arrow">›</span>
      </button>`;
  }

  // ── Full detail overlay ─────────────────────────────────────────────────────

  function openOverlay(opp) {
    const typeLabel = OPPORTUNITY_TYPE_LABELS[opp.opportunity_type] || opp.opportunity_type || '';
    const closingFormatted = formatDate(opp.closing_date);
    const closingSoon = isClosingSoon(opp.closing_date);

    const overlay = document.createElement('div');
    overlay.className = 'x-opp-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    overlay.innerHTML = `
      <div class="x-opp-modal">
        <button class="x-opp-modal-close" aria-label="Close">✕</button>

        ${typeLabel ? `<span class="x-opp-modal-badge">${typeLabel}</span>` : ''}
        <h2 class="x-opp-modal-title">${opp.name || 'Untitled'}</h2>
        ${opp.organization ? `<p class="x-opp-modal-org">${opp.organization}</p>` : ''}

        <div class="x-opp-modal-meta-row">
          ${closingFormatted ? `
            <div class="x-opp-modal-meta-item">
              <strong>Closes</strong>
              ${closingFormatted}${closingSoon ? ' <span style="color:#c0392b;font-weight:600"> · Closing soon</span>' : ''}
            </div>` : ''}
          ${opp.budget ? `
            <div class="x-opp-modal-meta-item">
              <strong>Budget / Rate</strong>
              ${opp.budget}
            </div>` : ''}
          ${opp.is_remote ? `
            <div class="x-opp-modal-meta-item">
              <strong>Location</strong>
              Remote / location flexible
            </div>` : ''}
        </div>

        ${opp.description ? `
          <div class="x-opp-modal-section">
            <h3>About this opportunity</h3>
            <p>${opp.description}</p>
          </div>` : ''}

        ${opp.criteria ? `
          <div class="x-opp-modal-section">
            <h3>Criteria</h3>
            <p>${opp.criteria}</p>
          </div>` : ''}

        <div class="x-opp-modal-actions">
          ${opp.opportunity_url
            ? `<a href="${opp.opportunity_url}" target="_blank" rel="noopener" class="x-opp-modal-apply">Apply / More info →</a>`
            : ''}
          ${opp.member_contact_email
            ? `<span class="x-opp-modal-contact">or email <a href="mailto:${opp.member_contact_email}">${opp.member_contact_email}</a></span>`
            : ''}
        </div>
      </div>`;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Close handlers
    overlay.querySelector('.x-opp-modal-close').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
    document.addEventListener('keydown', onEsc);

    function closeOverlay() {
      overlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEsc);
    }
    function onEsc(e) { if (e.key === 'Escape') closeOverlay(); }
  }

  // ── Grid / list rendering ───────────────────────────────────────────────────

  function renderList(container, opps) {
    if (opps.length === 0) {
      container.innerHTML = `
        <div class="x-opp-empty">
          <h3>No opportunities found</h3>
          <p>${activeFilter ? 'Try clearing the filter or check back soon.' : 'Check back soon — new listings are added regularly.'}</p>
        </div>`;
      return;
    }

    container.innerHTML = `<div class="x-opp-list">${opps.map(renderRow).join('')}</div>`;

    container.querySelectorAll('.x-opp-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const opp = allOpportunities.find(o => o.id === btn.dataset.id);
        if (opp) openOverlay(opp);
      });
    });
  }

  function renderFilters(filtersEl, opportunities) {
    const typesPresent = [...new Set(opportunities.map(o => o.opportunity_type).filter(Boolean))];
    if (typesPresent.length < 2) { filtersEl.style.display = 'none'; return; }

    const buttons = typesPresent.map(type => {
      const label = OPPORTUNITY_TYPE_LABELS[type] || type;
      return `<button class="x-opp-filter-btn" data-type="${type}">${label}</button>`;
    }).join('');

    filtersEl.innerHTML = `
      <div class="x-opp-filters">
        ${buttons}
        <button class="x-opp-filter-btn active" data-type="">All</button>
      </div>`;

    filtersEl.querySelectorAll('.x-opp-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filtersEl.querySelectorAll('.x-opp-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.type || null;
        const filtered = activeFilter
          ? allOpportunities.filter(o => o.opportunity_type === activeFilter)
          : allOpportunities;
        const grid = document.querySelector('.x-member-grid-container');
        if (grid) renderList(grid, filtered);
      });
    });
  }

  async function init() {
    const container = document.querySelector('.x-member-grid-container');
    if (!container) return;

    if (!window.supabase) {
      container.innerHTML = '<div class="x-opp-loading">Error: Supabase not loaded. Please refresh.</div>';
      return;
    }

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    container.innerHTML = '<div class="x-opp-loading">Loading opportunities...</div>';

    const { data, error } = await supabase
      .from('opportunities')
      .select('id, name, slug, opportunity_type, organization, description, criteria, budget, closing_date, opportunity_url, member_contact_email, is_remote, created_at')
      .eq('is_draft', false)
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Opportunities display error:', error);
      container.innerHTML = '<div class="x-opp-empty"><h3>Error loading opportunities</h3><p>Please refresh the page.</p></div>';
      return;
    }

    allOpportunities = data || [];

    const filtersEl = document.querySelector('.directory-filters') || (() => {
      const el = document.createElement('div');
      container.parentNode.insertBefore(el, container);
      return el;
    })();
    renderFilters(filtersEl, allOpportunities);
    renderList(container, allOpportunities);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
