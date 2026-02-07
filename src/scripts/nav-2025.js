// MTNS MADE 2025 Navigation Component
// Responsive navigation with shadcn-style dropdowns
// For use with Webflow

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    supabaseUrl: 'https://epszwomtxkpjegbjbixr.supabase.co',
    supabaseKey: 'sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH'
  };

  // Directory categories (from Supabase, ordered by display_order)
  const DIRECTORY_CATEGORIES = [
    { name: 'Artisanal Products', slug: 'artisanal-products' },
    { name: 'Craft', slug: 'craft' },
    { name: 'Creative Education', slug: 'creative-education' },
    { name: 'Cultural Work', slug: 'cultural-work' },
    { name: 'Design', slug: 'design' },
    { name: 'Performing Arts', slug: 'performing-arts' },
    { name: 'Photography', slug: 'photography' },
    { name: 'Publishing', slug: 'publishing' },
    { name: 'Screen', slug: 'screen' },
    { name: 'Visual Arts', slug: 'visual-arts' }
  ];

  // ============================================
  // LOGO SVG
  // ============================================
  const LOGO_SVG = `<svg width="151" height="15" viewBox="0 0 151 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2494_2947)">
<path d="M12.4863 0.209707L7.22333 8.93708L1.96031 0.209707H0V14.793H2.78599V6.66785L6.25382 12.3974H8.19283L11.6607 6.66785V14.793H14.4467V0.209707H12.4863Z" fill="#1D3748"/>
<path d="M21.8086 0.209708V2.70747H25.6253V14.793H28.4113V2.70747H32.2307V0.209708H21.8086Z" fill="#1D3748"/>
<path d="M49.4714 0.209708V9.70872L41.4198 0.209708H39.4595V14.793H42.2455V5.29126L50.2971 14.793H52.2574V0.209708H49.4714Z" fill="#1D3748"/>
<path d="M60.1863 10.8971C61.012 11.8139 62.2718 12.5022 63.5929 12.5022C64.8314 12.5022 65.6971 11.7306 65.6971 10.6686C65.6971 8.79459 63.0149 8.56336 61.0733 7.418C59.9386 6.75121 59.0304 5.75103 59.0304 4.10557C59.0304 1.50027 61.4035 0 63.798 0C65.2629 0 66.6266 0.354902 67.9876 1.3739L66.544 3.45761C65.9661 2.91719 64.9966 2.50045 64.0457 2.50045C62.9936 2.50045 61.8164 2.96021 61.8164 4.08406C61.8164 6.43933 68.483 5.70801 68.483 10.6256C68.483 13.2094 66.1925 15 63.5902 15C61.6512 15 59.8534 14.188 58.3672 12.8114L60.1837 10.8944L60.1863 10.8971Z" fill="#1D3748"/>
<path d="M95.6211 0.209708L90.3581 8.93708L85.0951 0.209708H83.1348V14.793H85.9208V6.66785L89.3886 12.3974H91.3276L94.7954 6.66785V14.793H97.5814V0.209708H95.6211Z" fill="#1D3748"/>
<path d="M132.023 4.3341C131.219 3.31241 130.041 2.71016 128.329 2.71016H126.265V12.2925H128.329C130.041 12.2925 131.219 11.6876 132.023 10.6686C132.683 9.83509 133.075 8.71123 133.075 7.50134C133.075 6.29144 132.683 5.16759 132.023 4.3341ZM128.02 0.209708C130.31 0.209708 131.818 0.709798 132.992 1.58361C134.766 2.91718 135.861 5.08424 135.861 7.50134C135.861 9.91844 134.766 12.0855 132.992 13.4191C131.815 14.2929 130.31 14.793 128.02 14.793H123.479V0.209708H128.02Z" fill="#1D3748"/>
<path d="M142.125 0.209708V14.793H151V12.2925H144.911V8.22996H149.349V5.72951H144.911V2.70747H150.795V0.209708H142.125Z" fill="#1D3748"/>
<path d="M110.143 4.75084L112.814 11.0262H107.476L110.143 4.75084ZM109.173 0.209708L102.98 14.793H105.889L106.419 13.5374H113.885L114.415 14.793H117.326L111.133 0.209708H109.173Z" fill="#1D3748"/>
</g>
<defs>
<clipPath id="clip0_2494_2947">
<rect width="151" height="15" fill="white"/>
</clipPath>
</defs>
</svg>`;

  // ============================================
  // STYLES - shadcn-inspired design
  // ============================================
  const styles = `
    /* ==========================================
       MTNS MADE 2025 Navigation
       Font: Brown Bold
       ========================================== */

    :root {
      --nav-height: 72px;
      --nav-bg: #ffffff;
      --nav-text: #1D3748;
      --nav-text-muted: #64748b;
      --nav-text-hover: #0f172a;
      --btn-primary-bg: #4a9a8f;
      --btn-primary-hover: #3d8a7f;
      --btn-secondary-bg: #1D3748;
      --btn-secondary-hover: #2a4558;
      --dropdown-bg: #ffffff;
      --dropdown-border: #e2e8f0;
      --dropdown-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      --dropdown-item-hover: #f1f5f9;
      --dropdown-radius: 8px;
      --font-nav: "brown", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
      --transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .x-header * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* ==========================================
       Header Container
       ========================================== */
    .x-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--nav-bg);
      width: 100%;
    }

    .x-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--nav-height);
      padding: 0 40px;
      width: 100%;
    }

    @media (max-width: 991px) {
      .x-nav {
        padding: 0 24px;
      }
    }

    @media (max-width: 575px) {
      .x-nav {
        padding: 0 16px;
      }
    }

    /* ==========================================
       Logo
       ========================================== */
    .x-nav-logo {
      flex-shrink: 0;
    }

    .x-nav-logo a {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .x-nav-logo svg {
      height: 15px;
      width: auto;
    }

    /* ==========================================
       Primary Navigation
       ========================================== */
    .x-nav-primary {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .x-nav-item {
      position: relative;
    }

    .x-nav-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 8px 14px;
      font-family: var(--font-nav);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      color: var(--nav-text);
      text-decoration: none;
      border-radius: 6px;
      transition: background var(--transition-fast), color var(--transition-fast);
      cursor: pointer;
      background: transparent;
      border: none;
    }

    .x-nav-link:hover {
      background: rgba(0, 0, 0, 0.04);
    }

    .x-nav-link[aria-expanded="true"] {
      background: rgba(0, 0, 0, 0.06);
    }

    .x-nav-chevron {
      width: 14px;
      height: 14px;
      opacity: 0.5;
      transition: transform var(--transition-fast);
    }

    .x-nav-link[aria-expanded="true"] .x-nav-chevron {
      transform: rotate(180deg);
    }

    /* ==========================================
       Dropdown Menu (shadcn style)
       ========================================== */
    .x-nav-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      min-width: 220px;
      background: var(--dropdown-bg);
      border: 1px solid var(--dropdown-border);
      border-radius: var(--dropdown-radius);
      box-shadow: var(--dropdown-shadow);
      padding: 4px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-4px);
      transition: opacity var(--transition-normal), transform var(--transition-normal), visibility var(--transition-normal);
      z-index: 100;
    }

    .x-nav-dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .x-nav-dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 8px 12px;
      font-family: var(--font-sans);
      font-size: 14px;
      font-weight: 400;
      color: var(--nav-text);
      text-decoration: none;
      border-radius: 4px;
      transition: background var(--transition-fast);
      cursor: pointer;
      border: none;
      background: transparent;
      text-align: left;
    }

    .x-nav-dropdown-item:hover {
      background: var(--dropdown-item-hover);
    }

    .x-nav-dropdown-item-icon {
      width: 16px;
      height: 16px;
      opacity: 0.5;
      flex-shrink: 0;
    }

    .x-nav-dropdown-divider {
      height: 1px;
      background: var(--dropdown-border);
      margin: 4px 0;
    }

    .x-nav-dropdown-label {
      padding: 8px 12px 4px;
      font-size: 12px;
      font-weight: 500;
      color: var(--nav-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .x-nav-dropdown-footer {
      border-top: 1px solid var(--dropdown-border);
      margin-top: 4px;
      padding-top: 4px;
    }

    .x-nav-dropdown-item.view-all {
      font-weight: 500;
      color: var(--btn-primary-bg);
    }

    .x-nav-dropdown-item.view-all:hover {
      background: rgba(74, 154, 143, 0.08);
    }

    .x-nav-dropdown-item.danger {
      color: #dc2626;
    }

    .x-nav-dropdown-item.danger:hover {
      background: #fef2f2;
    }

    /* ==========================================
       Right Side Actions
       ========================================== */
    .x-nav-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    /* Buttons */
    .x-nav-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 9px 18px;
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
    }

    .x-nav-btn-primary {
      background: var(--btn-primary-bg);
      color: #fff;
    }

    .x-nav-btn-primary:hover {
      background: var(--btn-primary-hover);
    }

    .x-nav-btn-secondary {
      background: var(--btn-secondary-bg);
      color: #fff;
    }

    .x-nav-btn-secondary:hover {
      background: var(--btn-secondary-hover);
    }

    /* Search Button */
    .x-nav-search {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 9px 14px;
      background: var(--btn-secondary-bg);
      color: #fff;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 500;
      transition: all var(--transition-fast);
    }

    .x-nav-search:hover {
      background: var(--btn-secondary-hover);
    }

    .x-nav-search-icon {
      width: 15px;
      height: 15px;
    }

    .x-nav-search-text {
      display: inline;
    }

    /* ==========================================
       User Dropdown
       ========================================== */
    .x-nav-user {
      position: relative;
    }

    .x-nav-user-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 14px;
      background: var(--btn-secondary-bg);
      color: #fff;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 500;
      transition: all var(--transition-fast);
    }

    .x-nav-user-btn:hover {
      background: var(--btn-secondary-hover);
    }

    .x-nav-user-chevron {
      width: 12px;
      height: 12px;
      opacity: 0.7;
      transition: transform var(--transition-fast);
    }

    .x-nav-user-btn[aria-expanded="true"] .x-nav-user-chevron {
      transform: rotate(180deg);
    }

    .x-nav-user-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      min-width: 200px;
      background: var(--dropdown-bg);
      border: 1px solid var(--dropdown-border);
      border-radius: var(--dropdown-radius);
      box-shadow: var(--dropdown-shadow);
      padding: 4px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-4px);
      transition: opacity var(--transition-normal), transform var(--transition-normal), visibility var(--transition-normal);
      z-index: 100;
    }

    .x-nav-user-dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .x-nav-user-header {
      padding: 12px 12px 8px;
      border-bottom: 1px solid var(--dropdown-border);
      margin-bottom: 4px;
    }

    .x-nav-user-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--nav-text);
    }

    .x-nav-user-email {
      font-size: 12px;
      color: var(--nav-text-muted);
      margin-top: 2px;
    }

    /* ==========================================
       Hamburger Menu Button
       ========================================== */
    .x-nav-hamburger {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 28px;
      height: 28px;
      padding: 2px;
      background: none;
      border: none;
      cursor: pointer;
    }

    .x-nav-hamburger-line {
      width: 100%;
      height: 2px;
      background: var(--nav-text);
      border-radius: 1px;
      transition: transform var(--transition-normal), opacity var(--transition-normal);
    }

    .x-nav-hamburger[aria-expanded="true"] .x-nav-hamburger-line:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    .x-nav-hamburger[aria-expanded="true"] .x-nav-hamburger-line:nth-child(2) {
      opacity: 0;
    }

    .x-nav-hamburger[aria-expanded="true"] .x-nav-hamburger-line:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    /* ==========================================
       Mobile Menu Overlay
       ========================================== */
    .x-nav-mobile {
      position: fixed;
      top: var(--nav-height);
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--nav-bg);
      z-index: 999;
      overflow-y: auto;
      padding: 20px 24px 40px;
      transform: translateX(100%);
      transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .x-nav-mobile.open {
      transform: translateX(0);
    }

    .x-nav-mobile-section {
      margin-bottom: 24px;
    }

    .x-nav-mobile-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--nav-text-muted);
      margin-bottom: 12px;
      padding: 0 4px;
    }

    .x-nav-mobile-link {
      display: block;
      padding: 14px 4px;
      font-family: var(--font-sans);
      font-size: 16px;
      font-weight: 500;
      color: var(--nav-text);
      text-decoration: none;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }

    .x-nav-mobile-link:last-child {
      border-bottom: none;
    }

    .x-nav-mobile-link:hover {
      color: var(--nav-text-hover);
    }

    .x-nav-mobile-link.sub {
      padding-left: 20px;
      font-size: 15px;
      font-weight: 400;
      color: var(--nav-text-muted);
    }

    .x-nav-mobile-btn {
      display: block;
      width: 100%;
      padding: 14px;
      text-align: center;
      font-family: var(--font-sans);
      font-size: 15px;
      font-weight: 500;
      text-decoration: none;
      border-radius: 50px;
      margin-bottom: 10px;
    }

    .x-nav-mobile-btn-primary {
      background: var(--btn-primary-bg);
      color: #fff;
    }

    .x-nav-mobile-btn-secondary {
      background: var(--btn-secondary-bg);
      color: #fff;
    }

    /* ==========================================
       Responsive Breakpoints
       ========================================== */

    /* Desktop Min (< 1200px) - Hide search text */
    @media (max-width: 1199px) {
      .x-nav-search-text {
        display: none;
      }
    }

    /* Tablet Max (< 992px) - Hide search */
    @media (max-width: 991px) {
      .x-nav-search {
        display: none;
      }
    }

    /* Tablet Min (< 768px) - Hide low priority nav */
    @media (max-width: 767px) {
      .x-nav-item[data-priority="low"] {
        display: none;
      }
    }

    /* Mobile Landscape (< 576px) - Hide all primary nav */
    @media (max-width: 575px) {
      .x-nav-primary {
        display: none;
      }

      .x-nav-actions {
        gap: 8px;
      }

      .x-nav-btn,
      .x-nav-user-btn {
        padding: 8px 12px;
        font-size: 12px;
      }
    }

    /* Mobile Portrait (< 375px) - Minimal */
    @media (max-width: 374px) {
      .x-nav-btn-primary {
        display: none;
      }
    }

    /* Body scroll lock */
    body.nav-mobile-open {
      overflow: hidden;
    }
  `;

  // ============================================
  // ICONS (Lucide-style)
  // ============================================
  const icons = {
    chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
    briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
    logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
    helpCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`
  };

  // ============================================
  // RENDER NAVIGATION
  // ============================================
  function renderNav(options = {}) {
    const {
      isLoggedIn = false,
      firstName = 'User',
      email = ''
    } = options;

    // Build category dropdown items
    const categoryItems = DIRECTORY_CATEGORIES.map(cat => `
      <a href="/directory/${cat.slug}" class="x-nav-dropdown-item">
        ${cat.name}
      </a>
    `).join('');

    // Build user menu items
    const userMenuItems = `
      <a href="/profile" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${icons.user}</span>
        My Profile
      </a>
      <a href="/profile/edit" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${icons.edit}</span>
        Edit Profile
      </a>
      <a href="/profile/edit-portfolio-supabase" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${icons.briefcase}</span>
        My Portfolio
      </a>
      <a href="/events" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${icons.calendar}</span>
        My Events
      </a>
      <div class="x-nav-dropdown-divider"></div>
      <a href="/support" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${icons.helpCircle}</span>
        Get Support
      </a>
      <div class="x-nav-dropdown-divider"></div>
      <a href="/logout" class="x-nav-dropdown-item danger">
        <span class="x-nav-dropdown-item-icon">${icons.logout}</span>
        Log Out
      </a>
    `;

    // Mobile menu categories
    const mobileCategoryItems = DIRECTORY_CATEGORIES.map(cat => `
      <a href="/directory/${cat.slug}" class="x-nav-mobile-link sub">${cat.name}</a>
    `).join('');

    return `
      <nav class="x-nav" role="navigation" aria-label="Main navigation">
        <!-- Logo -->
        <div class="x-nav-logo">
          <a href="/">${LOGO_SVG}</a>
        </div>

        <!-- Primary Navigation -->
        <div class="x-nav-primary">
          <!-- Find a Creative (with dropdown) -->
          <div class="x-nav-item" data-priority="high">
            <button class="x-nav-link" aria-expanded="false" aria-haspopup="true" data-dropdown="directory">
              Find a Creative
              <span class="x-nav-chevron">${icons.chevronDown}</span>
            </button>
            <div class="x-nav-dropdown" id="dropdown-directory">
              ${categoryItems}
              <div class="x-nav-dropdown-footer">
                <a href="/directory" class="x-nav-dropdown-item view-all">
                  <span class="x-nav-dropdown-item-icon">${icons.grid}</span>
                  View All Categories
                </a>
              </div>
            </div>
          </div>

          <div class="x-nav-item" data-priority="high">
            <a href="/events" class="x-nav-link">Events</a>
          </div>

          <div class="x-nav-item" data-priority="high">
            <a href="/jobs" class="x-nav-link">Jobs</a>
          </div>

          <div class="x-nav-item" data-priority="low">
            <a href="/resources" class="x-nav-link">Resources</a>
          </div>

          <div class="x-nav-item" data-priority="low">
            <a href="/magazine" class="x-nav-link">Magazine</a>
          </div>
        </div>

        <!-- Right Actions -->
        <div class="x-nav-actions">
          ${!isLoggedIn ? `
            <a href="/join" class="x-nav-btn x-nav-btn-primary">Become a Member</a>
          ` : ''}

          ${isLoggedIn ? `
            <div class="x-nav-user">
              <button class="x-nav-user-btn" aria-expanded="false" aria-haspopup="true">
                Hello, ${firstName}
                <span class="x-nav-user-chevron">${icons.chevronDown}</span>
              </button>
              <div class="x-nav-user-dropdown">
                ${email ? `
                  <div class="x-nav-user-header">
                    <div class="x-nav-user-name">${firstName}</div>
                    <div class="x-nav-user-email">${email}</div>
                  </div>
                ` : ''}
                ${userMenuItems}
              </div>
            </div>
          ` : ''}

          <button class="x-nav-search" aria-label="Search">
            <span class="x-nav-search-icon">${icons.search}</span>
            <span class="x-nav-search-text">Search</span>
          </button>

          <button class="x-nav-hamburger" aria-expanded="false" aria-controls="x-nav-mobile" aria-label="Toggle menu">
            <span class="x-nav-hamburger-line"></span>
            <span class="x-nav-hamburger-line"></span>
            <span class="x-nav-hamburger-line"></span>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <div class="x-nav-mobile" id="x-nav-mobile" aria-hidden="true">
        ${!isLoggedIn ? `
          <div class="x-nav-mobile-section">
            <a href="/join" class="x-nav-mobile-btn x-nav-mobile-btn-primary">Become a Member</a>
          </div>
        ` : ''}

        <div class="x-nav-mobile-section">
          <h3 class="x-nav-mobile-title">Find a Creative</h3>
          ${mobileCategoryItems}
          <a href="/directory" class="x-nav-mobile-link" style="color: var(--btn-primary-bg); font-weight: 500;">View All Categories</a>
        </div>

        <div class="x-nav-mobile-section">
          <h3 class="x-nav-mobile-title">Navigation</h3>
          <a href="/events" class="x-nav-mobile-link">Events</a>
          <a href="/jobs" class="x-nav-mobile-link">Jobs</a>
          <a href="/resources" class="x-nav-mobile-link">Resources</a>
          <a href="/magazine" class="x-nav-mobile-link">Magazine</a>
        </div>

        ${isLoggedIn ? `
          <div class="x-nav-mobile-section">
            <h3 class="x-nav-mobile-title">Account</h3>
            <a href="/profile" class="x-nav-mobile-link">My Profile</a>
            <a href="/profile/edit" class="x-nav-mobile-link">Edit Profile</a>
            <a href="/profile/edit-portfolio-supabase" class="x-nav-mobile-link">My Portfolio</a>
            <a href="/events" class="x-nav-mobile-link">My Events</a>
            <a href="/support" class="x-nav-mobile-link">Get Support</a>
            <a href="/logout" class="x-nav-mobile-link" style="color: #dc2626;">Log Out</a>
          </div>
        ` : `
          <div class="x-nav-mobile-section">
            <a href="/login" class="x-nav-mobile-btn x-nav-mobile-btn-secondary">Log In</a>
          </div>
        `}
      </div>
    `;
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================
  function setupEventListeners(header) {
    // Directory dropdown toggle
    const directoryBtn = header.querySelector('[data-dropdown="directory"]');
    const directoryDropdown = header.querySelector('#dropdown-directory');

    if (directoryBtn && directoryDropdown) {
      directoryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = directoryDropdown.classList.toggle('open');
        directoryBtn.setAttribute('aria-expanded', isOpen);

        // Close user dropdown if open
        const userDropdown = header.querySelector('.x-nav-user-dropdown');
        const userBtn = header.querySelector('.x-nav-user-btn');
        if (userDropdown?.classList.contains('open')) {
          userDropdown.classList.remove('open');
          userBtn?.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // User dropdown toggle
    const userBtn = header.querySelector('.x-nav-user-btn');
    const userDropdown = header.querySelector('.x-nav-user-dropdown');

    if (userBtn && userDropdown) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = userDropdown.classList.toggle('open');
        userBtn.setAttribute('aria-expanded', isOpen);

        // Close directory dropdown if open
        if (directoryDropdown?.classList.contains('open')) {
          directoryDropdown.classList.remove('open');
          directoryBtn?.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Hamburger menu toggle
    const hamburger = header.querySelector('.x-nav-hamburger');
    const mobileMenu = header.querySelector('.x-nav-mobile');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        mobileMenu.setAttribute('aria-hidden', !isOpen);
        document.body.classList.toggle('nav-mobile-open', isOpen);
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (directoryDropdown && !e.target.closest('.x-nav-item[data-priority="high"]:first-child')) {
        directoryDropdown.classList.remove('open');
        directoryBtn?.setAttribute('aria-expanded', 'false');
      }
      if (userDropdown && !e.target.closest('.x-nav-user')) {
        userDropdown.classList.remove('open');
        userBtn?.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        directoryDropdown?.classList.remove('open');
        directoryBtn?.setAttribute('aria-expanded', 'false');
        userDropdown?.classList.remove('open');
        userBtn?.setAttribute('aria-expanded', 'false');

        if (mobileMenu?.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          hamburger?.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('nav-mobile-open');
        }
      }
    });

    // Close mobile menu on link click
    mobileMenu?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nav-mobile-open');
      });
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  async function init() {
    const header = document.querySelector('.x-header');
    if (!header) {
      console.warn('MTNS Nav: .x-header element not found');
      return;
    }

    // Inject styles
    if (!document.getElementById('x-nav-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'x-nav-styles';
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    }

    // Check for Memberstack user
    let navOptions = { isLoggedIn: false };

    const renderAndSetup = () => {
      header.innerHTML = renderNav(navOptions);
      setupEventListeners(header);
    };

    // Wait for Memberstack
    const checkMemberstack = () => {
      return new Promise((resolve) => {
        if (window.$memberstackDom) {
          resolve(window.$memberstackDom);
        } else {
          let attempts = 0;
          const check = setInterval(() => {
            attempts++;
            if (window.$memberstackDom) {
              clearInterval(check);
              resolve(window.$memberstackDom);
            } else if (attempts >= 30) {
              clearInterval(check);
              resolve(null);
            }
          }, 100);
        }
      });
    };

    const memberstack = await checkMemberstack();

    if (memberstack) {
      try {
        const { data: member } = await memberstack.getCurrentMember();
        if (member) {
          navOptions = {
            isLoggedIn: true,
            firstName: member.customFields?.['first-name'] ||
                       member.auth?.email?.split('@')[0] ||
                       'User',
            email: member.auth?.email || ''
          };
        }
      } catch (err) {
        console.warn('MTNS Nav: Error getting member', err);
      }
    }

    renderAndSetup();
  }

  // ============================================
  // EXPORT
  // ============================================
  window.MTNSNav = {
    init,
    render: renderNav,
    styles
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
