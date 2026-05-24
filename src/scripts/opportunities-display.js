/**
 * MTNS MADE - Opportunities Board Display
 * Fetches approved opportunities from Supabase and renders them into the
 * .x-member-grid-container using the same grid structure as member directories.
 * No images — text-focused cards with type, budget, closing date and description.
 */

(function () {
  'use strict';

  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTE5MzUsImV4cCI6MjA4NTg4NzkzNX0.TJPI5NQmWHR6F5eGVZH26Mzj601RDp5bgcpYZFVymwQ';

  const OPPORTUNITY_TYPE_LABELS = {
    'job':              'Job / Employment',
    'commission':       'Commission',
    'collaboration':    'Collaboration',
    'call-for-entries': 'Call for Entries',
    'residency':        'Residency / Fellowship',
    'volunteer':        'Volunteer',
  };

  const styles = `
    /* Opportunity card — no image, text-focused */
    .x-opp-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: #fff;
      overflow: hidden;
      transition: box-shadow 0.2s;
    }
    .x-opp-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

    .x-opp-card-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 12px;
    }

    .x-opp-type-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #555;
      background: #f0f0f0;
      border-radius: 2px;
      padding: 3px 8px;
      align-self: flex-start;
    }

    .x-opp-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 1.3;
    }

    .x-opp-org {
      font-size: 14px;
      color: #666;
      margin: 0;
    }

    .x-opp-description {
      font-size: 14px;
      color: #555;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin: 0;
    }

    .x-opp-card-footer {
      padding: 14px 24px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      background: #fafafa;
    }

    .x-opp-meta {
      font-size: 12px;
      color: #888;
    }
    .x-opp-meta strong { color: #555; font-weight: 600; }

    .x-opp-link {
      font-size: 13px;
      font-weight: 600;
      color: #1a1a1a;
      text-decoration: underline;
      white-space: nowrap;
    }
    .x-opp-link:hover { color: #555; }

    /* Filters */
    .x-opp-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 32px;
    }
    .x-opp-filter-btn {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 2px;
      padding: 8px 16px;
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

    .x-opp-count {
      font-size: 13px;
      color: #888;
      margin-bottom: 20px;
    }

    .x-opp-loading, .x-opp-empty {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .x-opp-empty h3 { margin: 0 0 8px; font-size: 18px; color: #333; }
  `;

  let supabase = null;
  let allOpportunities = [];
  let activeFilter = null;

  function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function isClosingSoon(dateStr) {
    if (!dateStr) return false;
    const closing = new Date(dateStr);
    const now = new Date();
    const diffDays = (closing - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 14;
  }

  function renderCard(opp) {
    const typeLabel = OPPORTUNITY_TYPE_LABELS[opp.opportunity_type] || opp.opportunity_type || '';
    const closingFormatted = formatDate(opp.closing_date);
    const closingSoon = isClosingSoon(opp.closing_date);
    const hasExternalLink = opp.opportunity_url;

    return `
      <div role="listitem" class="w-dyn-item">
        <div class="x-opp-card">
          <div class="x-opp-card-body">
            ${typeLabel ? `<span class="x-opp-type-badge">${typeLabel}</span>` : ''}
            <h2 class="x-opp-title">${opp.name || 'Untitled'}</h2>
            ${opp.organization ? `<p class="x-opp-org">${opp.organization}</p>` : ''}
            ${opp.description ? `<p class="x-opp-description">${opp.description}</p>` : ''}
          </div>
          <div class="x-opp-card-footer">
            <div>
              ${closingFormatted ? `<div class="x-opp-meta"><strong>Closes:</strong> ${closingFormatted}${closingSoon ? ' <span style="color:#c0392b">· Closing soon</span>' : ''}</div>` : ''}
              ${opp.budget ? `<div class="x-opp-meta"><strong>Budget:</strong> ${opp.budget}</div>` : ''}
            </div>
            ${hasExternalLink ? `<a href="${opp.opportunity_url}" target="_blank" rel="noopener" class="x-opp-link">More info →</a>` : ''}
          </div>
        </div>
      </div>`;
  }

  function renderGrid(container, opps) {
    if (opps.length === 0) {
      container.innerHTML = `
        <div class="w-dyn-list">
          <div class="w-dyn-empty">
            <div class="x-opp-empty">
              <h3>No opportunities found</h3>
              <p>${activeFilter ? 'Try clearing the filter or check back soon.' : 'Check back soon — new listings are added regularly.'}</p>
            </div>
          </div>
        </div>`;
      return;
    }

    container.innerHTML = `
      <div class="w-dyn-list">
        <div role="list" class="x-member-grid w-dyn-items">
          ${opps.map(renderCard).join('')}
        </div>
      </div>`;
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
        if (grid) renderGrid(grid, filtered);
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

    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    container.innerHTML = '<div class="x-opp-loading">Loading opportunities...</div>';

    const { data, error } = await supabase
      .from('opportunities')
      .select('id, name, slug, opportunity_type, organization, description, budget, closing_date, opportunity_url, is_remote, created_at')
      .eq('is_draft', false)
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Opportunities display error:', error);
      container.innerHTML = '<div class="x-opp-empty"><h3>Error loading opportunities</h3><p>Please refresh the page.</p></div>';
      return;
    }

    allOpportunities = data || [];

    // Render filters above container if .directory-filters exists, otherwise inject above grid
    const filtersEl = document.querySelector('.directory-filters') || (() => {
      const el = document.createElement('div');
      container.parentNode.insertBefore(el, container);
      return el;
    })();
    renderFilters(filtersEl, allOpportunities);

    renderGrid(container, allOpportunities);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
