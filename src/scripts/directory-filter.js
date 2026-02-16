/**
 * MTNS MADE - Directory Filter
 * Adds sub-category filtering to directory pages
 *
 * Usage: Add to directory template pages (e.g., /directories/photography)
 * Expects:
 *   - Container with class "directory-members-grid" for member cards
 *   - Container with class "directory-filters" for filter buttons
 *   - URL structure: /directories/{directory-slug}
 */

(function() {
  'use strict';

  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTE5MzUsImV4cCI6MjA4NTg4NzkzNX0.TJPI5NQmWHR6F5eGVZH26Mzj601RDp5bgcpYZFVymwQ';

  let supabase;
  let currentDirectory = null;
  let subDirectories = [];
  let allMembers = [];
  let memberSubDirectoryMap = {}; // member_id -> [sub_directory_ids]
  let activeFilters = new Set();

  // Inject styles (only for filter buttons - member grid uses existing Webflow styles)
  const styles = `
    .directory-filters {
      margin-bottom: 32px;
    }
    .directory-filters-label {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 12px;
      color: #666;
    }
    .directory-filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .directory-filter-btn {
      padding: 8px 16px;
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      font-family: inherit;
      font-size: 14px;
      color: #333;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .directory-filter-btn:hover {
      background: #e8e8e8;
      border-color: #ccc;
    }
    .directory-filter-btn.active {
      background: #333;
      border-color: #333;
      color: #fff;
    }
    .directory-filter-btn.active:hover {
      background: #555;
      border-color: #555;
    }
    .directory-filter-clear {
      padding: 8px 16px;
      background: transparent;
      border: 1px dashed #ccc;
      border-radius: 20px;
      font-family: inherit;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .directory-filter-clear:hover {
      border-color: #999;
      color: #333;
    }
    .directory-member-count {
      margin-top: 16px;
      font-size: 14px;
      color: #666;
    }
    .directory-loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .directory-empty {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .directory-empty h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      color: #333;
    }
    @media (max-width: 575px) {
      .directory-filter-buttons {
        gap: 6px;
      }
      .directory-filter-btn,
      .directory-filter-clear {
        padding: 6px 12px;
        font-size: 13px;
      }
    }
  `;

  function injectStyles() {
    if (!document.getElementById('directory-filter-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'directory-filter-styles';
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    }
  }

  function getDirectorySlugFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/\/directories\/([^\/]+)/);
    return match ? match[1] : null;
  }

  async function init() {
    const slug = getDirectorySlugFromUrl();
    if (!slug) {
      console.log('Directory filter: Not on a directory page');
      return;
    }

    // Look for the Webflow grid container or fallback
    const membersGrid = document.querySelector('.x-member-grid-container') ||
                        document.querySelector('.directory-members-grid');
    const filtersContainer = document.querySelector('.directory-filters');

    if (!membersGrid) {
      console.log('Directory filter: No members grid container found (.x-member-grid-container or .directory-members-grid)');
      return;
    }

    injectStyles();

    // Check for Supabase
    if (!window.supabase) {
      console.error('Directory filter: Supabase library not loaded');
      return;
    }

    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Show loading
    membersGrid.innerHTML = '<div class="w-dyn-list"><div class="directory-loading">Loading members...</div></div>';

    try {
      await loadDirectoryData(slug);

      if (filtersContainer) {
        renderFilters(filtersContainer);
      }

      renderMembers(membersGrid, allMembers);
    } catch (error) {
      console.error('Directory filter error:', error);
      membersGrid.innerHTML = '<div class="directory-empty"><h3>Error loading members</h3><p>Please refresh the page.</p></div>';
    }
  }

  async function loadDirectoryData(slug) {
    console.log('Directory filter: Loading data for', slug);

    // 1. Get the directory
    const { data: directory, error: dirError } = await supabase
      .from('directories')
      .select('id, name, slug')
      .eq('slug', slug)
      .single();

    if (dirError || !directory) {
      throw new Error('Directory not found: ' + slug);
    }

    currentDirectory = directory;
    console.log('Directory filter: Found directory', directory.name, directory.id);

    // 2. Get all sub-directories for this parent
    const { data: subDirs, error: subError } = await supabase
      .from('sub_directories')
      .select('id, name, slug')
      .eq('directory_id', directory.id)
      .order('name');

    if (subError) throw subError;
    subDirectories = subDirs || [];
    console.log('Directory filter: Found', subDirectories.length, 'sub-directories');

    // 3. Get members from BOTH sources:
    //    - member_directories (parent directory link)
    //    - member_sub_directories (sub-directory links)
    const memberIds = new Set();
    memberSubDirectoryMap = {};

    // 3a. Get members linked to the parent directory
    const { data: parentMembers, error: pmError } = await supabase
      .from('member_directories')
      .select('member_id')
      .eq('directory_id', directory.id);

    if (pmError) {
      console.log('Directory filter: Error fetching parent directory members:', pmError);
    } else {
      console.log('Directory filter: Found', (parentMembers || []).length, 'members via parent directory');
      (parentMembers || []).forEach(pm => memberIds.add(pm.member_id));
    }

    // 3b. Get members linked to sub-directories
    const subDirIds = subDirectories.map(sd => sd.id);
    if (subDirIds.length > 0) {
      const { data: memberSubs, error: msError } = await supabase
        .from('member_sub_directories')
        .select('member_id, sub_directory_id')
        .in('sub_directory_id', subDirIds);

      if (msError) {
        console.log('Directory filter: Error fetching sub-directory members:', msError);
      } else {
        console.log('Directory filter: Found', (memberSubs || []).length, 'member-subdirectory links');
        (memberSubs || []).forEach(ms => {
          memberIds.add(ms.member_id);
          if (!memberSubDirectoryMap[ms.member_id]) {
            memberSubDirectoryMap[ms.member_id] = [];
          }
          memberSubDirectoryMap[ms.member_id].push(ms.sub_directory_id);
        });
      }
    }

    console.log('Directory filter: Found', memberIds.size, 'unique members total');

    // 4. Fetch all member details
    if (memberIds.size === 0) {
      allMembers = [];
      return;
    }

    const { data: members, error: memError } = await supabase
      .from('members')
      .select(`
        id, name, slug, business_name,
        profile_image_url, header_image_url, short_summary,
        suburb_id, suburbs(name, slug),
        status, subscription_status, membership_type_id,
        membership_types(name)
      `)
      .in('id', Array.from(memberIds))
      .eq('status', 'active')
      .order('name');

    if (memError) throw memError;

    console.log('Directory filter: Fetched', (members || []).length, 'active status members');

    // Filter to only active/trialing subscription members and add their sub-directory info
    allMembers = (members || [])
      .filter(m => m.subscription_status === 'active' || m.subscription_status === 'trialing')
      .map(m => ({
        ...m,
        subDirectoryIds: memberSubDirectoryMap[m.id] || [],
        subDirectoryNames: (memberSubDirectoryMap[m.id] || [])
          .map(sdId => subDirectories.find(sd => sd.id === sdId)?.name)
          .filter(Boolean)
      }));

    console.log('Directory filter: Loaded', allMembers.length, 'members with active/trialing subscription');
  }

  function renderFilters(container) {
    if (subDirectories.length === 0) {
      container.innerHTML = '';
      return;
    }

    const filterButtons = subDirectories.map(sd => `
      <button class="directory-filter-btn" data-sub-id="${sd.id}" data-sub-slug="${sd.slug}">
        ${sd.name}
      </button>
    `).join('');

    container.innerHTML = `
      <p class="directory-filters-label">Filter by specialty:</p>
      <div class="directory-filter-buttons">
        ${filterButtons}
        <button class="directory-filter-clear" style="display: none;">Clear filters</button>
      </div>
      <p class="directory-member-count">${allMembers.length} members</p>
    `;

    // Attach click handlers
    container.querySelectorAll('.directory-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => handleFilterClick(btn, container));
    });

    container.querySelector('.directory-filter-clear')?.addEventListener('click', () => {
      clearFilters(container);
    });
  }

  function handleFilterClick(btn, filtersContainer) {
    const subId = btn.dataset.subId;

    if (activeFilters.has(subId)) {
      activeFilters.delete(subId);
      btn.classList.remove('active');
    } else {
      activeFilters.add(subId);
      btn.classList.add('active');
    }

    // Show/hide clear button
    const clearBtn = filtersContainer.querySelector('.directory-filter-clear');
    if (clearBtn) {
      clearBtn.style.display = activeFilters.size > 0 ? 'inline-block' : 'none';
    }

    // Filter and re-render
    const filtered = filterMembers();
    const grid = document.querySelector('.directory-members-grid');
    renderMembers(grid, filtered);

    // Update count
    const countEl = filtersContainer.querySelector('.directory-member-count');
    if (countEl) {
      const filterText = activeFilters.size > 0
        ? ` (filtered from ${allMembers.length})`
        : '';
      countEl.textContent = `${filtered.length} members${filterText}`;
    }
  }

  function clearFilters(filtersContainer) {
    activeFilters.clear();

    filtersContainer.querySelectorAll('.directory-filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    const clearBtn = filtersContainer.querySelector('.directory-filter-clear');
    if (clearBtn) clearBtn.style.display = 'none';

    const grid = document.querySelector('.directory-members-grid');
    renderMembers(grid, allMembers);

    const countEl = filtersContainer.querySelector('.directory-member-count');
    if (countEl) {
      countEl.textContent = `${allMembers.length} members`;
    }
  }

  function filterMembers() {
    if (activeFilters.size === 0) {
      return allMembers;
    }

    return allMembers.filter(member => {
      // Member must have at least one of the active filter sub-directories
      return member.subDirectoryIds.some(sdId => activeFilters.has(sdId));
    });
  }

  function renderMembers(container, members) {
    if (members.length === 0) {
      container.innerHTML = `
        <div class="w-dyn-list">
          <div class="w-dyn-empty">
            <div class="directory-empty">
              <h3>No members found</h3>
              <p>Try clearing your filters or check back later.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const cards = members.map(member => {
      const featureImage = member.header_image_url || member.profile_image_url || '';
      const profileImage = member.profile_image_url || '';
      const suburbName = member.suburbs?.name || '';
      const suburbSlug = member.suburbs?.slug || '';
      const memberType = member.membership_types?.name || 'Professional';
      const displayName = member.business_name || member.name;

      return `
        <div role="listitem" class="w-dyn-item">
          <div class="x-member-card">
            <div class="x-member-feature-image-container">
              <div class="x-member-type hide">
                <img src="https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/681ac65056f48d463096333e_Status%3DProfessional.svg" loading="lazy" alt="" class="x-member-type-image">
                <div class="text-style-allcaps text-color-white small">${memberType}</div>
                <div>${memberType}</div>
              </div>
              <a href="/members/${member.slug}" class="x-member-feature-image w-inline-block">
                <img src="${featureImage}" loading="lazy" alt="${displayName}" class="x-member-feature-image" onerror="this.style.display='none'">
              </a>
            </div>
            <div class="x-member-card-text-container">
              <div class="x-member-name">
                <div class="x-member-profile-image">
                  <img src="${profileImage}" loading="lazy" alt="${displayName}" onerror="this.style.display='none'">
                </div>
                <a href="/members/${member.slug}" class="heading-style-h4 member-name">${displayName}</a>
              </div>
              <div class="x-member-location">
                ${suburbSlug ? `<a href="/suburb/${suburbSlug}" class="text-style-allcaps text-weight-light small">${suburbName}</a>` : `<span class="text-style-allcaps text-weight-light small">${suburbName}</span>`}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Use the exact Webflow grid structure
    container.innerHTML = `
      <div class="w-dyn-list">
        <div role="list" class="x-member-grid w-dyn-items">
          ${cards}
        </div>
      </div>
    `;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
