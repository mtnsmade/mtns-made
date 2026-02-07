(function(){const x=[{name:"Artisanal Products",slug:"artisanal-products"},{name:"Craft",slug:"craft"},{name:"Creative Education",slug:"creative-education"},{name:"Cultural Work",slug:"cultural-work"},{name:"Design",slug:"design"},{name:"Performing Arts",slug:"performing-arts"},{name:"Photography",slug:"photography"},{name:"Publishing",slug:"publishing"},{name:"Screen",slug:"screen"},{name:"Visual Arts",slug:"visual-arts"}],m=`
    /* ==========================================
       MTNS MADE 2025 Navigation
       Colors from design files
       ========================================== */

    :root {
      --nav-height: 72px;
      --nav-bg: #F5F3EE;
      --nav-text: #1a2e35;
      --nav-text-muted: #64748b;
      --nav-text-hover: #0f172a;
      --btn-primary-bg: #4a9a8f;
      --btn-primary-hover: #3d8a7f;
      --btn-secondary-bg: #1a2e35;
      --btn-secondary-hover: #2a3e45;
      --dropdown-bg: #ffffff;
      --dropdown-border: #e2e8f0;
      --dropdown-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      --dropdown-item-hover: #f1f5f9;
      --dropdown-radius: 8px;
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      --font-logo: "acumin-pro-wide", var(--font-sans);
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
      font-family: var(--font-logo);
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.2em;
      color: var(--nav-text);
    }

    .x-nav-logo img {
      height: 24px;
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
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 500;
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
  `,l={chevronDown:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',briefcase:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',logout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>'};function b(t={}){const{isLoggedIn:e=!1,firstName:r="User",email:s=""}=t,d=x.map(a=>`
      <a href="/directory/${a.slug}" class="x-nav-dropdown-item">
        ${a.name}
      </a>
    `).join(""),i=`
      <a href="/profile" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${l.user}</span>
        My Profile
      </a>
      <a href="/profile/edit" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${l.edit}</span>
        Edit Profile
      </a>
      <a href="/profile/edit-portfolio-supabase" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${l.briefcase}</span>
        My Portfolio
      </a>
      <a href="/events" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${l.calendar}</span>
        My Events
      </a>
      <div class="x-nav-dropdown-divider"></div>
      <a href="/logout" class="x-nav-dropdown-item danger">
        <span class="x-nav-dropdown-item-icon">${l.logout}</span>
        Log Out
      </a>
    `,o=x.map(a=>`
      <a href="/directory/${a.slug}" class="x-nav-mobile-link sub">${a.name}</a>
    `).join("");return`
      <nav class="x-nav" role="navigation" aria-label="Main navigation">
        <!-- Logo -->
        <div class="x-nav-logo">
          <a href="/">MTNS MADE</a>
        </div>

        <!-- Primary Navigation -->
        <div class="x-nav-primary">
          <!-- Find a Creative (with dropdown) -->
          <div class="x-nav-item" data-priority="high">
            <button class="x-nav-link" aria-expanded="false" aria-haspopup="true" data-dropdown="directory">
              Find a Creative
              <span class="x-nav-chevron">${l.chevronDown}</span>
            </button>
            <div class="x-nav-dropdown" id="dropdown-directory">
              ${d}
              <div class="x-nav-dropdown-footer">
                <a href="/directory" class="x-nav-dropdown-item view-all">
                  <span class="x-nav-dropdown-item-icon">${l.grid}</span>
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
          ${e?"":`
            <a href="/join" class="x-nav-btn x-nav-btn-primary">Become a Member</a>
          `}

          ${e?`
            <div class="x-nav-user">
              <button class="x-nav-user-btn" aria-expanded="false" aria-haspopup="true">
                Hello, ${r}
                <span class="x-nav-user-chevron">${l.chevronDown}</span>
              </button>
              <div class="x-nav-user-dropdown">
                ${s?`
                  <div class="x-nav-user-header">
                    <div class="x-nav-user-name">${r}</div>
                    <div class="x-nav-user-email">${s}</div>
                  </div>
                `:""}
                ${i}
              </div>
            </div>
          `:""}

          <button class="x-nav-search" aria-label="Search">
            <span class="x-nav-search-icon">${l.search}</span>
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
        ${e?"":`
          <div class="x-nav-mobile-section">
            <a href="/join" class="x-nav-mobile-btn x-nav-mobile-btn-primary">Become a Member</a>
          </div>
        `}

        <div class="x-nav-mobile-section">
          <h3 class="x-nav-mobile-title">Find a Creative</h3>
          ${o}
          <a href="/directory" class="x-nav-mobile-link" style="color: var(--btn-primary-bg); font-weight: 500;">View All Categories</a>
        </div>

        <div class="x-nav-mobile-section">
          <h3 class="x-nav-mobile-title">Navigation</h3>
          <a href="/events" class="x-nav-mobile-link">Events</a>
          <a href="/jobs" class="x-nav-mobile-link">Jobs</a>
          <a href="/resources" class="x-nav-mobile-link">Resources</a>
          <a href="/magazine" class="x-nav-mobile-link">Magazine</a>
        </div>

        ${e?`
          <div class="x-nav-mobile-section">
            <h3 class="x-nav-mobile-title">Account</h3>
            <a href="/profile" class="x-nav-mobile-link">My Profile</a>
            <a href="/profile/edit" class="x-nav-mobile-link">Edit Profile</a>
            <a href="/profile/edit-portfolio-supabase" class="x-nav-mobile-link">My Portfolio</a>
            <a href="/events" class="x-nav-mobile-link">My Events</a>
            <a href="/logout" class="x-nav-mobile-link" style="color: #dc2626;">Log Out</a>
          </div>
        `:`
          <div class="x-nav-mobile-section">
            <a href="/login" class="x-nav-mobile-btn x-nav-mobile-btn-secondary">Log In</a>
          </div>
        `}
      </div>
    `}function f(t){const e=t.querySelector('[data-dropdown="directory"]'),r=t.querySelector("#dropdown-directory");e&&r&&e.addEventListener("click",a=>{a.stopPropagation();const p=r.classList.toggle("open");e.setAttribute("aria-expanded",p);const n=t.querySelector(".x-nav-user-dropdown"),v=t.querySelector(".x-nav-user-btn");n!=null&&n.classList.contains("open")&&(n.classList.remove("open"),v==null||v.setAttribute("aria-expanded","false"))});const s=t.querySelector(".x-nav-user-btn"),d=t.querySelector(".x-nav-user-dropdown");s&&d&&s.addEventListener("click",a=>{a.stopPropagation();const p=d.classList.toggle("open");s.setAttribute("aria-expanded",p),r!=null&&r.classList.contains("open")&&(r.classList.remove("open"),e==null||e.setAttribute("aria-expanded","false"))});const i=t.querySelector(".x-nav-hamburger"),o=t.querySelector(".x-nav-mobile");i&&o&&i.addEventListener("click",()=>{const a=o.classList.toggle("open");i.setAttribute("aria-expanded",a),o.setAttribute("aria-hidden",!a),document.body.classList.toggle("nav-mobile-open",a)}),document.addEventListener("click",a=>{r&&!a.target.closest('.x-nav-item[data-priority="high"]:first-child')&&(r.classList.remove("open"),e==null||e.setAttribute("aria-expanded","false")),d&&!a.target.closest(".x-nav-user")&&(d.classList.remove("open"),s==null||s.setAttribute("aria-expanded","false"))}),document.addEventListener("keydown",a=>{a.key==="Escape"&&(r==null||r.classList.remove("open"),e==null||e.setAttribute("aria-expanded","false"),d==null||d.classList.remove("open"),s==null||s.setAttribute("aria-expanded","false"),o!=null&&o.classList.contains("open")&&(o.classList.remove("open"),i==null||i.setAttribute("aria-expanded","false"),o.setAttribute("aria-hidden","true"),document.body.classList.remove("nav-mobile-open")))}),o==null||o.querySelectorAll("a").forEach(a=>{a.addEventListener("click",()=>{o.classList.remove("open"),i==null||i.setAttribute("aria-expanded","false"),o.setAttribute("aria-hidden","true"),document.body.classList.remove("nav-mobile-open")})})}async function c(){var i,o,a,p;const t=document.querySelector(".x-header");if(!t){console.warn("MTNS Nav: .x-header element not found");return}if(!document.getElementById("x-nav-styles")){const n=document.createElement("style");n.id="x-nav-styles",n.textContent=m,document.head.appendChild(n)}let e={isLoggedIn:!1};const r=()=>{t.innerHTML=b(e),f(t)},d=await new Promise(n=>{if(window.$memberstackDom)n(window.$memberstackDom);else{let v=0;const g=setInterval(()=>{v++,window.$memberstackDom?(clearInterval(g),n(window.$memberstackDom)):v>=30&&(clearInterval(g),n(null))},100)}});if(d)try{const{data:n}=await d.getCurrentMember();n&&(e={isLoggedIn:!0,firstName:((i=n.customFields)==null?void 0:i["first-name"])||((a=(o=n.auth)==null?void 0:o.email)==null?void 0:a.split("@")[0])||"User",email:((p=n.auth)==null?void 0:p.email)||""})}catch(n){console.warn("MTNS Nav: Error getting member",n)}r()}window.MTNSNav={init:c,render:b,styles:m},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",c):c()})();
