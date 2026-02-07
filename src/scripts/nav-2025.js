// MTNS MADE 2025 Navigation Component
// Responsive navigation with dropdowns and mobile menu
// For use with Webflow

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    // Breakpoints matching your designs
    breakpoints: {
      desktopMin: 1200,
      tabletMax: 992,
      tabletMin: 768,
      mobileLandscape: 576,
      mobilePortrait: 375
    },
    // Animation timing
    animation: {
      duration: 200,
      easing: 'ease-out'
    }
  };

  // ============================================
  // STYLES
  // ============================================
  const styles = `
    /* ==========================================
       MTNS MADE 2025 Navigation
       ========================================== */

    /* CSS Variables */
    :root {
      --nav-height: 72px;
      --nav-bg: #F5F3EE;
      --nav-text: #1a2e35;
      --nav-text-hover: #3d5a66;
      --btn-primary-bg: #4a9a8f;
      --btn-primary-text: #fff;
      --btn-secondary-bg: #1a2e35;
      --btn-secondary-text: #fff;
      --dropdown-bg: #fff;
      --dropdown-shadow: 0 4px 20px rgba(0,0,0,0.12);
      --dropdown-radius: 8px;
      --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --transition-fast: 150ms ease;
      --transition-normal: 200ms ease;
    }

    /* Reset for nav elements */
    .x-header * {
      box-sizing: border-box;
    }

    /* ==========================================
       Header Container
       ========================================== */
    .x-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--nav-bg);
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .x-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--nav-height);
      padding: 0 24px;
      max-width: 1440px;
      margin: 0 auto;
    }

    /* ==========================================
       Logo
       ========================================== */
    .x-nav-logo {
      flex-shrink: 0;
    }

    .x-nav-logo a {
      display: block;
      text-decoration: none;
    }

    .x-nav-logo img {
      height: 24px;
      width: auto;
    }

    .x-nav-logo-text {
      font-family: var(--font-family);
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: var(--nav-text);
      text-decoration: none;
    }

    /* ==========================================
       Primary Navigation
       ========================================== */
    .x-nav-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 auto;
    }

    .x-nav-item {
      position: relative;
    }

    .x-nav-link {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 16px;
      font-family: var(--font-family);
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: var(--nav-text);
      text-decoration: none;
      border-radius: 4px;
      transition: color var(--transition-fast), background var(--transition-fast);
    }

    .x-nav-link:hover {
      color: var(--nav-text-hover);
      background: rgba(0,0,0,0.03);
    }

    .x-nav-link[aria-expanded="true"] {
      background: rgba(0,0,0,0.05);
    }

    .x-nav-link-chevron {
      width: 12px;
      height: 12px;
      transition: transform var(--transition-fast);
    }

    .x-nav-link[aria-expanded="true"] .x-nav-link-chevron {
      transform: rotate(180deg);
    }

    /* ==========================================
       Dropdown Menu
       ========================================== */
    .x-nav-dropdown {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(8px);
      min-width: 220px;
      background: var(--dropdown-bg);
      border-radius: var(--dropdown-radius);
      box-shadow: var(--dropdown-shadow);
      opacity: 0;
      visibility: hidden;
      transition: opacity var(--transition-normal), transform var(--transition-normal), visibility var(--transition-normal);
      z-index: 100;
      padding: 8px 0;
    }

    .x-nav-dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }

    .x-nav-dropdown-item {
      display: block;
      padding: 10px 16px;
      font-family: var(--font-family);
      font-size: 14px;
      color: var(--nav-text);
      text-decoration: none;
      transition: background var(--transition-fast);
    }

    .x-nav-dropdown-item:hover {
      background: rgba(0,0,0,0.04);
    }

    .x-nav-dropdown-divider {
      height: 1px;
      background: rgba(0,0,0,0.08);
      margin: 8px 0;
    }

    /* ==========================================
       Right Side Actions
       ========================================== */
    .x-nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    /* Buttons */
    .x-nav-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 18px;
      font-family: var(--font-family);
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
      color: var(--btn-primary-text);
    }

    .x-nav-btn-primary:hover {
      background: #3d8a7f;
    }

    .x-nav-btn-secondary {
      background: var(--btn-secondary-bg);
      color: var(--btn-secondary-text);
    }

    .x-nav-btn-secondary:hover {
      background: #2a3e45;
    }

    .x-nav-btn-icon {
      width: 16px;
      height: 16px;
    }

    /* Search Button */
    .x-nav-search {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 16px;
      background: var(--btn-secondary-bg);
      color: var(--btn-secondary-text);
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-family: var(--font-family);
      font-size: 13px;
      font-weight: 500;
      transition: all var(--transition-fast);
    }

    .x-nav-search:hover {
      background: #2a3e45;
    }

    .x-nav-search-icon {
      width: 16px;
      height: 16px;
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
      padding: 10px 16px;
      background: var(--btn-secondary-bg);
      color: var(--btn-secondary-text);
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-family: var(--font-family);
      font-size: 13px;
      font-weight: 500;
      transition: all var(--transition-fast);
    }

    .x-nav-user-btn:hover {
      background: #2a3e45;
    }

    .x-nav-user-chevron {
      width: 12px;
      height: 12px;
      transition: transform var(--transition-fast);
    }

    .x-nav-user-btn[aria-expanded="true"] .x-nav-user-chevron {
      transform: rotate(180deg);
    }

    .x-nav-user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      min-width: 200px;
      background: var(--dropdown-bg);
      border-radius: var(--dropdown-radius);
      box-shadow: var(--dropdown-shadow);
      opacity: 0;
      visibility: hidden;
      transform: translateY(8px);
      transition: opacity var(--transition-normal), transform var(--transition-normal), visibility var(--transition-normal);
      z-index: 100;
      padding: 8px 0;
    }

    .x-nav-user-dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .x-nav-user-header {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }

    .x-nav-user-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--nav-text);
      margin: 0 0 2px 0;
    }

    .x-nav-user-email {
      font-size: 12px;
      color: #666;
      margin: 0;
    }

    .x-nav-user-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      font-family: var(--font-family);
      font-size: 14px;
      color: var(--nav-text);
      text-decoration: none;
      transition: background var(--transition-fast);
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }

    .x-nav-user-item:hover {
      background: rgba(0,0,0,0.04);
    }

    .x-nav-user-item-icon {
      width: 16px;
      height: 16px;
      opacity: 0.6;
    }

    .x-nav-user-item-danger {
      color: #dc3545;
    }

    /* ==========================================
       Hamburger Menu Button
       ========================================== */
    .x-nav-hamburger {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 32px;
      height: 32px;
      padding: 4px;
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
      padding: 24px;
      transform: translateX(100%);
      transition: transform 300ms ease;
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
      color: #666;
      margin: 0 0 12px 0;
      padding: 0 8px;
    }

    .x-nav-mobile-link {
      display: block;
      padding: 14px 8px;
      font-family: var(--font-family);
      font-size: 16px;
      font-weight: 500;
      color: var(--nav-text);
      text-decoration: none;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }

    .x-nav-mobile-link:hover {
      color: var(--nav-text-hover);
    }

    .x-nav-mobile-link:last-child {
      border-bottom: none;
    }

    .x-nav-mobile-btn {
      display: block;
      width: 100%;
      padding: 16px;
      text-align: center;
      font-family: var(--font-family);
      font-size: 15px;
      font-weight: 500;
      text-decoration: none;
      border-radius: 50px;
      margin-bottom: 12px;
    }

    .x-nav-mobile-btn-primary {
      background: var(--btn-primary-bg);
      color: var(--btn-primary-text);
    }

    /* ==========================================
       Responsive Breakpoints
       ========================================== */

    /* Desktop Min (< 1200px) - Hide search text */
    @media (max-width: 1199px) {
      .x-nav-search-text {
        display: none;
      }

      .x-nav-search {
        padding: 10px 12px;
      }
    }

    /* Tablet Max (< 992px) - Hide search entirely */
    @media (max-width: 991px) {
      .x-nav-search {
        display: none;
      }
    }

    /* Tablet Min (< 768px) - Hide some nav items */
    @media (max-width: 767px) {
      .x-nav-item[data-priority="low"] {
        display: none;
      }
    }

    /* Mobile Landscape (< 576px) - Hide primary nav */
    @media (max-width: 575px) {
      .x-nav-primary {
        display: none;
      }

      .x-nav-actions {
        gap: 8px;
      }

      .x-nav-btn,
      .x-nav-user-btn {
        padding: 8px 14px;
        font-size: 12px;
      }
    }

    /* Mobile Portrait (< 375px) - Hide become a member */
    @media (max-width: 374px) {
      .x-nav-btn-primary {
        display: none;
      }
    }

    /* ==========================================
       Utility: Body scroll lock
       ========================================== */
    body.nav-mobile-open {
      overflow: hidden;
    }
  `;

  // ============================================
  // HTML TEMPLATE
  // ============================================
  function getNavHTML(options = {}) {
    const {
      logoUrl = '/',
      logoText = 'MTNS MADE',
      logoImg = null,
      userName = null,
      userEmail = null,
      isLoggedIn = false,
      navItems = [
        { label: 'Find a Creative', href: '/directory', priority: 'high' },
        { label: 'Events', href: '/events', priority: 'high' },
        { label: 'Jobs', href: '/jobs', priority: 'high' },
        { label: 'Resources', href: '/resources', priority: 'low' },
        { label: 'Magazine', href: '/magazine', priority: 'low' }
      ],
      userMenuItems = [
        { label: 'My Profile', href: '/profile', icon: 'user' },
        { label: 'Edit Profile', href: '/profile/edit', icon: 'edit' },
        { label: 'My Portfolio', href: '/profile/portfolio', icon: 'briefcase' },
        { label: 'Settings', href: '/settings', icon: 'settings' },
        { divider: true },
        { label: 'Log Out', href: '/logout', icon: 'logout', danger: true }
      ]
    } = options;

    const logoHTML = logoImg
      ? `<a href="${logoUrl}"><img src="${logoImg}" alt="${logoText}"></a>`
      : `<a href="${logoUrl}" class="x-nav-logo-text">${logoText}</a>`;

    const navItemsHTML = navItems.map(item => `
      <div class="x-nav-item" data-priority="${item.priority || 'high'}">
        <a href="${item.href}" class="x-nav-link">${item.label}</a>
      </div>
    `).join('');

    const userDropdownItemsHTML = userMenuItems.map(item => {
      if (item.divider) {
        return '<div class="x-nav-dropdown-divider"></div>';
      }
      return `
        <a href="${item.href}" class="x-nav-user-item ${item.danger ? 'x-nav-user-item-danger' : ''}">
          ${getIcon(item.icon)}
          ${item.label}
        </a>
      `;
    }).join('');

    const userSection = isLoggedIn ? `
      <div class="x-nav-user">
        <button class="x-nav-user-btn" aria-expanded="false" aria-haspopup="true">
          Hello, ${userName || 'User'}
          ${getIcon('chevron-down', 'x-nav-user-chevron')}
        </button>
        <div class="x-nav-user-dropdown">
          ${userName || userEmail ? `
            <div class="x-nav-user-header">
              ${userName ? `<p class="x-nav-user-name">${userName}</p>` : ''}
              ${userEmail ? `<p class="x-nav-user-email">${userEmail}</p>` : ''}
            </div>
          ` : ''}
          ${userDropdownItemsHTML}
        </div>
      </div>
    ` : '';

    const mobileNavItemsHTML = navItems.map(item =>
      `<a href="${item.href}" class="x-nav-mobile-link">${item.label}</a>`
    ).join('');

    return `
      <nav class="x-nav" role="navigation" aria-label="Main navigation">
        <!-- Logo -->
        <div class="x-nav-logo">
          ${logoHTML}
        </div>

        <!-- Primary Navigation -->
        <div class="x-nav-primary">
          ${navItemsHTML}
        </div>

        <!-- Right Actions -->
        <div class="x-nav-actions">
          <a href="/join" class="x-nav-btn x-nav-btn-primary">Become a Member</a>

          ${userSection}

          <button class="x-nav-search" aria-label="Search">
            ${getIcon('search', 'x-nav-search-icon')}
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
        <div class="x-nav-mobile-section">
          <a href="/join" class="x-nav-mobile-btn x-nav-mobile-btn-primary">Become a Member</a>
        </div>

        <div class="x-nav-mobile-section">
          <h3 class="x-nav-mobile-title">Navigation</h3>
          ${mobileNavItemsHTML}
        </div>

        ${isLoggedIn ? `
          <div class="x-nav-mobile-section">
            <h3 class="x-nav-mobile-title">Account</h3>
            ${userMenuItems.filter(i => !i.divider).map(item =>
              `<a href="${item.href}" class="x-nav-mobile-link">${item.label}</a>`
            ).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  // ============================================
  // ICONS
  // ============================================
  function getIcon(name, className = '') {
    const icons = {
      'chevron-down': `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
      'search': `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>`,
      'user': `<svg class="x-nav-user-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
      'edit': `<svg class="x-nav-user-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
      'briefcase': `<svg class="x-nav-user-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
      'settings': `<svg class="x-nav-user-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
      'logout': `<svg class="x-nav-user-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`
    };
    return icons[name] || '';
  }

  // ============================================
  // INITIALIZATION & EVENT HANDLERS
  // ============================================
  function initNav() {
    const header = document.querySelector('.x-header');
    if (!header) {
      console.warn('Navigation: .x-header element not found');
      return;
    }

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.id = 'x-nav-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Check for Memberstack user
    let navOptions = {};

    if (window.$memberstackDom) {
      window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
        if (member) {
          navOptions = {
            isLoggedIn: true,
            userName: member.customFields?.['first-name'] || member.auth?.email?.split('@')[0] || 'User',
            userEmail: member.auth?.email
          };
        }
        renderNav(header, navOptions);
      }).catch(() => {
        renderNav(header, navOptions);
      });
    } else {
      // Wait for Memberstack
      const checkMemberstack = setInterval(() => {
        if (window.$memberstackDom) {
          clearInterval(checkMemberstack);
          window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
            if (member) {
              navOptions = {
                isLoggedIn: true,
                userName: member.customFields?.['first-name'] || member.auth?.email?.split('@')[0] || 'User',
                userEmail: member.auth?.email
              };
            }
            renderNav(header, navOptions);
          }).catch(() => {
            renderNav(header, navOptions);
          });
        }
      }, 100);

      // Timeout fallback
      setTimeout(() => {
        clearInterval(checkMemberstack);
        if (!header.querySelector('.x-nav')) {
          renderNav(header, navOptions);
        }
      }, 2000);
    }
  }

  function renderNav(header, options) {
    header.innerHTML = getNavHTML(options);
    setupEventListeners(header);
  }

  function setupEventListeners(header) {
    // User dropdown toggle
    const userBtn = header.querySelector('.x-nav-user-btn');
    const userDropdown = header.querySelector('.x-nav-user-dropdown');

    if (userBtn && userDropdown) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = userDropdown.classList.toggle('open');
        userBtn.setAttribute('aria-expanded', isOpen);
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
      if (userDropdown && !e.target.closest('.x-nav-user')) {
        userDropdown.classList.remove('open');
        userBtn?.setAttribute('aria-expanded', 'false');
      }
    });

    // Close mobile menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (userDropdown?.classList.contains('open')) {
          userDropdown.classList.remove('open');
          userBtn?.setAttribute('aria-expanded', 'false');
        }
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
  // EXPORT FOR MANUAL USE
  // ============================================
  window.MTNSNav = {
    init: initNav,
    getHTML: getNavHTML,
    styles: styles
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }

})();
