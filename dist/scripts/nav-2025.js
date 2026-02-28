(function(){const y=[{name:"Artisanal Products",slug:"artisanal-products"},{name:"Craft",slug:"craft"},{name:"Creative Education",slug:"creative-education"},{name:"Cultural Work",slug:"cultural-work"},{name:"Design",slug:"design"},{name:"Performing Arts",slug:"performing-arts"},{name:"Photography",slug:"photography"},{name:"Publishing",slug:"publishing"},{name:"Screen",slug:"screen"},{name:"Visual Arts",slug:"visual-arts"}],f=`<svg width="151" height="15" viewBox="0 0 151 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_nav)">
<path d="M12.4863 0.209707L7.22333 8.93708L1.96031 0.209707H0V14.793H2.78599V6.66785L6.25382 12.3974H8.19283L11.6607 6.66785V14.793H14.4467V0.209707H12.4863Z" fill="currentColor"/>
<path d="M21.8086 0.209708V2.70747H25.6253V14.793H28.4113V2.70747H32.2307V0.209708H21.8086Z" fill="currentColor"/>
<path d="M49.4714 0.209708V9.70872L41.4198 0.209708H39.4595V14.793H42.2455V5.29126L50.2971 14.793H52.2574V0.209708H49.4714Z" fill="currentColor"/>
<path d="M60.1863 10.8971C61.012 11.8139 62.2718 12.5022 63.5929 12.5022C64.8314 12.5022 65.6971 11.7306 65.6971 10.6686C65.6971 8.79459 63.0149 8.56336 61.0733 7.418C59.9386 6.75121 59.0304 5.75103 59.0304 4.10557C59.0304 1.50027 61.4035 0 63.798 0C65.2629 0 66.6266 0.354902 67.9876 1.3739L66.544 3.45761C65.9661 2.91719 64.9966 2.50045 64.0457 2.50045C62.9936 2.50045 61.8164 2.96021 61.8164 4.08406C61.8164 6.43933 68.483 5.70801 68.483 10.6256C68.483 13.2094 66.1925 15 63.5902 15C61.6512 15 59.8534 14.188 58.3672 12.8114L60.1837 10.8944L60.1863 10.8971Z" fill="currentColor"/>
<path d="M95.6211 0.209708L90.3581 8.93708L85.0951 0.209708H83.1348V14.793H85.9208V6.66785L89.3886 12.3974H91.3276L94.7954 6.66785V14.793H97.5814V0.209708H95.6211Z" fill="currentColor"/>
<path d="M132.023 4.3341C131.219 3.31241 130.041 2.71016 128.329 2.71016H126.265V12.2925H128.329C130.041 12.2925 131.219 11.6876 132.023 10.6686C132.683 9.83509 133.075 8.71123 133.075 7.50134C133.075 6.29144 132.683 5.16759 132.023 4.3341ZM128.02 0.209708C130.31 0.209708 131.818 0.709798 132.992 1.58361C134.766 2.91718 135.861 5.08424 135.861 7.50134C135.861 9.91844 134.766 12.0855 132.992 13.4191C131.815 14.2929 130.31 14.793 128.02 14.793H123.479V0.209708H128.02Z" fill="currentColor"/>
<path d="M142.125 0.209708V14.793H151V12.2925H144.911V8.22996H149.349V5.72951H144.911V2.70747H150.795V0.209708H142.125Z" fill="currentColor"/>
<path d="M110.143 4.75084L112.814 11.0262H107.476L110.143 4.75084ZM109.173 0.209708L102.98 14.793H105.889L106.419 13.5374H113.885L114.415 14.793H117.326L111.133 0.209708H109.173Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_nav">
<rect width="151" height="15" fill="white"/>
</clipPath>
</defs>
</svg>`,k=f.replace(/currentColor/g,"#ffffff"),b=`
    /* MTNS MADE 2025 Navigation */
    :root {
      --nav-height: 50px;
      --nav-bg: #ffffff;
      --nav-text: #1D3748;
      --nav-text-muted: #64748b;
      --btn-bg: #353435;
      --btn-hover: #F05D61;
      --dropdown-bg: #ffffff;
      --dropdown-border: #e2e8f0;
      --dropdown-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      --dropdown-item-hover: #DCF1EF;
      --dropdown-radius: 8px;
      --overlay-bg: #353435;
      --overlay-text: #ffffff;
      --overlay-hover: #F05D61;
      --font-nav-bold: "Mtnsmade Bold", sans-serif;
      --font-nav-regular: "Mtnsmade Regular", sans-serif;
      --font-nav-light: "Mtnsmade Light", sans-serif;
      --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
      --transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .x-header *, .x-nav-overlay *, .x-search-overlay * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* Header */
    .x-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--nav-bg);
      width: 100%;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    /* Add padding to body to account for fixed header */
    body {
      padding-top: var(--nav-height);
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
      .x-nav { padding: 0 24px; }
    }

    @media (max-width: 575px) {
      .x-nav { padding: 0 16px; }
    }

    /* Logo */
    .x-nav-logo {
      flex-shrink: 0;
      color: var(--nav-text);
    }

    .x-nav-logo a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: inherit;
    }

    .x-nav-logo svg {
      height: 15px;
      width: auto;
    }

    /* Primary Navigation */
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
      font-family: var(--font-nav-bold);
      font-size: 13px;
      font-weight: normal;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      color: var(--nav-text);
      text-decoration: none;
      border-radius: 6px;
      transition: background var(--transition-fast);
      cursor: pointer;
      background: transparent;
      border: none;
    }

    .x-nav-link:hover {
      background: var(--dropdown-item-hover);
      color: var(--nav-text);
    }

    .x-nav-link[aria-expanded="true"] {
      background: var(--dropdown-item-hover);
      color: var(--nav-text);
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

    /* Dropdown (shadcn style) */
    .x-nav-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
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
      font-family: var(--font-nav-regular);
      font-size: 14px;
      font-weight: normal;
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
      color: var(--nav-text);
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

    .x-nav-dropdown-footer {
      border-top: 1px solid var(--dropdown-border);
      margin-top: 4px;
      padding-top: 4px;
    }

    .x-nav-dropdown-item.view-all {
      font-weight: 500;
    }

    .x-nav-dropdown-item.danger {
      color: #dc2626;
    }

    .x-nav-dropdown-item.danger:hover {
      background: #fef2f2;
    }

    /* Right Actions */
    .x-nav-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    /* Buttons - Mtnsmade Light font */
    .x-nav-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 3px 15px;
      font-family: var(--font-nav-light);
      font-size: 13px;
      font-weight: 300;
      text-decoration: none;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background var(--transition-fast), opacity var(--transition-fast);
      white-space: nowrap;
      background: #F05D61;
      color: #fff;
    }

    .x-nav-btn:hover {
      opacity: 0.9;
    }

    /* Search Button */
    .x-nav-search {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 3px 15px;
      background: var(--btn-bg);
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-family: var(--font-nav-light);
      font-size: 13px;
      font-weight: 300;
      transition: background var(--transition-fast);
    }

    .x-nav-search:hover {
      background: var(--btn-hover);
    }

    .x-nav-search-icon {
      width: 15px;
      height: 15px;
    }

    .x-nav-search-text {
      display: inline;
    }

    /* User Dropdown Button */
    .x-nav-user {
      position: relative;
    }

    .x-nav-user-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 15px;
      background: var(--btn-bg);
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-family: var(--font-nav-light);
      font-size: 13px;
      font-weight: 300;
      transition: background var(--transition-fast);
    }

    .x-nav-user-btn:hover {
      background: var(--btn-hover);
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
      font-family: var(--font-nav-bold);
      font-weight: normal;
      font-size: 14px;
      color: var(--nav-text);
    }

    .x-nav-user-email {
      font-family: var(--font-nav-regular);
      font-size: 12px;
      color: var(--nav-text-muted);
      margin-top: 2px;
    }

    /* Hamburger */
    .x-nav-hamburger {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 6px;
      width: 40px;
      height: 40px;
      padding: 4px 0;
      background: none;
      border: none;
      cursor: pointer;
    }

    .x-nav-hamburger-line {
      width: 40px;
      height: 2px;
      background: var(--nav-text);
      border-radius: 1px;
      transition: transform var(--transition-normal), opacity var(--transition-normal);
    }

    /* ==========================================
       OVERLAY MENU
       ========================================== */
    .x-nav-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--nav-bg);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      opacity: 0;
      visibility: hidden;
      transition: opacity 300ms ease, visibility 300ms ease;
    }

    .x-nav-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    .x-nav-overlay-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
      height: var(--nav-height);
      background: var(--nav-bg);
      flex-shrink: 0;
    }

    @media (max-width: 991px) {
      .x-nav-overlay-header { padding: 0 24px; }
    }

    @media (max-width: 575px) {
      .x-nav-overlay-header { padding: 0 16px; }
    }

    .x-nav-overlay-logo {
      color: var(--nav-text);
    }

    .x-nav-overlay-logo svg {
      height: 15px;
      width: auto;
    }

    .x-nav-overlay-header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .x-nav-overlay-user-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 15px;
      background: var(--btn-hover);
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-family: var(--font-nav-light);
      font-size: 13px;
      font-weight: 300;
      text-decoration: none;
    }

    .x-nav-overlay-user-btn svg {
      width: 12px;
      height: 12px;
    }

    .x-nav-overlay-login-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 15px;
      background: transparent;
      color: var(--nav-text);
      border: 1px solid var(--nav-text);
      border-radius: 8px;
      cursor: pointer;
      font-family: var(--font-nav-light);
      font-size: 13px;
      font-weight: 300;
      text-decoration: none;
      transition: background var(--transition-fast), color var(--transition-fast);
    }

    .x-nav-overlay-login-btn:hover {
      background: var(--nav-text);
      color: #fff;
    }

    .x-nav-overlay-login-btn svg {
      width: 14px;
      height: 14px;
    }

    .x-nav-overlay-close {
      background: none;
      border: none;
      color: var(--nav-text);
      cursor: pointer;
      padding: 8px;
    }

    .x-nav-overlay-close svg {
      width: 24px;
      height: 24px;
    }

    .x-nav-overlay-body {
      flex: 1;
      background: var(--overlay-bg);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .x-nav-overlay-search {
      padding: 20px 40px;
      flex-shrink: 0;
    }

    @media (max-width: 991px) {
      .x-nav-overlay-search { padding: 20px 24px; }
    }

    @media (max-width: 575px) {
      .x-nav-overlay-search { padding: 16px; }
    }

    .x-nav-overlay-search-wrapper {
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 10px 16px;
      gap: 12px;
    }

    .x-nav-overlay-search-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      font-family: var(--font-nav-regular);
      font-size: 14px;
      color: var(--overlay-text);
    }

    .x-nav-overlay-search-input::placeholder {
      color: rgba(255,255,255,0.5);
    }

    .x-nav-overlay-search-btn {
      background: none;
      border: none;
      color: var(--overlay-text);
      cursor: pointer;
      padding: 0;
    }

    .x-nav-overlay-search-btn svg {
      width: 18px;
      height: 18px;
    }

    .x-nav-overlay-content {
      padding: 0 40px;
      flex: 1;
    }

    @media (max-width: 991px) {
      .x-nav-overlay-content { padding: 0 24px; }
    }

    @media (max-width: 575px) {
      .x-nav-overlay-content { padding: 0 16px; }
    }

    /* Overlay Nav Items */
    .x-nav-overlay-item {
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .x-nav-overlay-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      font-family: var(--font-nav-regular);
      font-size: 20px;
      font-weight: normal;
      color: var(--overlay-text);
      text-decoration: none;
      transition: color var(--transition-fast);
      cursor: pointer;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
    }

    .x-nav-overlay-link:hover {
      color: var(--overlay-hover);
    }

    .x-nav-overlay-link.active {
      color: var(--overlay-hover);
    }

    .x-nav-overlay-link-chevron {
      width: 16px;
      height: 16px;
      opacity: 0.5;
      transition: transform var(--transition-fast);
    }

    .x-nav-overlay-link.active .x-nav-overlay-link-chevron {
      transform: rotate(180deg);
    }

    /* Overlay Subnav (Categories) */
    .x-nav-overlay-subnav {
      display: none;
      padding: 0 0 16px;
      column-count: 2;
      column-gap: 40px;
    }

    @media (max-width: 575px) {
      .x-nav-overlay-subnav {
        column-count: 1;
      }
    }

    .x-nav-overlay-subnav.open {
      display: block;
    }

    .x-nav-overlay-sublink {
      display: block;
      padding: 8px 0;
      font-family: var(--font-nav-regular);
      font-size: 14px;
      font-weight: normal;
      color: var(--overlay-text);
      text-decoration: none;
      transition: color var(--transition-fast);
      break-inside: avoid;
    }

    .x-nav-overlay-sublink:hover {
      color: var(--overlay-hover);
    }

    .x-nav-overlay-sublink.view-all {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .x-nav-overlay-sublink.view-all svg {
      width: 16px;
      height: 16px;
    }

    /* Overlay Footer Links */
    .x-nav-overlay-footer {
      padding: 20px 40px 30px;
      flex-shrink: 0;
      margin-top: auto;
    }

    @media (max-width: 991px) {
      .x-nav-overlay-footer { padding: 20px 24px 30px; }
    }

    @media (max-width: 575px) {
      .x-nav-overlay-footer { padding: 16px 16px 30px; }
    }

    .x-nav-overlay-footer-link {
      display: block;
      padding: 6px 0;
      font-family: var(--font-nav-regular);
      font-size: 14px;
      font-weight: normal;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .x-nav-overlay-footer-link:hover {
      color: var(--overlay-text);
    }

    /* ==========================================
       SEARCH OVERLAY
       ========================================== */
    .x-search-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-bg);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      opacity: 0;
      visibility: hidden;
      transition: opacity 300ms ease, visibility 300ms ease;
    }

    .x-search-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    .x-search-overlay-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
      height: var(--nav-height);
    }

    @media (max-width: 991px) {
      .x-search-overlay-header { padding: 0 24px; }
    }

    @media (max-width: 575px) {
      .x-search-overlay-header { padding: 0 16px; }
    }

    .x-search-overlay-logo {
      color: var(--overlay-text);
    }

    .x-search-overlay-logo svg {
      height: 15px;
      width: auto;
    }

    .x-search-overlay-close {
      background: none;
      border: none;
      color: var(--overlay-text);
      cursor: pointer;
      padding: 8px;
    }

    .x-search-overlay-close svg {
      width: 24px;
      height: 24px;
    }

    .x-search-overlay-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .x-search-form {
      width: 100%;
      max-width: 720px;
    }

    .x-search-input-wrapper {
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 16px 20px;
      gap: 12px;
    }

    .x-search-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      font-family: var(--font-nav-regular);
      font-size: 16px;
      color: var(--overlay-text);
    }

    .x-search-input::placeholder {
      color: rgba(255,255,255,0.5);
    }

    .x-search-submit {
      padding: 10px 20px;
      background: var(--overlay-hover);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-family: var(--font-nav-light);
      font-size: 14px;
      font-weight: 300;
      cursor: pointer;
      transition: opacity var(--transition-fast);
    }

    .x-search-submit:hover {
      opacity: 0.9;
    }

    /* ==========================================
       RESPONSIVE
       ========================================== */
    @media (max-width: 1199px) {
      .x-nav-search-text { display: none; }
    }

    @media (max-width: 991px) {
      .x-nav-search { display: none; }
    }

    @media (max-width: 767px) {
      .x-nav-item[data-priority="low"] { display: none; }
    }

    @media (max-width: 575px) {
      .x-nav-primary { display: none; }
      .x-nav-actions { gap: 8px; }
      .x-nav-btn, .x-nav-user-btn { padding: 8px 12px; font-size: 12px; }
      .x-nav-login { display: none; }
    }

    @media (max-width: 374px) {
      .x-nav-btn:not(.x-nav-user-btn) { display: none; }
    }

    /* Login button in main nav */
    .x-nav-login {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 15px;
      background: transparent;
      color: var(--nav-text);
      border: 1px solid var(--btn-bg);
      border-radius: 8px;
      font-family: var(--font-nav-light);
      font-size: 13px;
      font-weight: 300;
      text-decoration: none;
      transition: background var(--transition-fast), color var(--transition-fast);
    }

    .x-nav-login:hover {
      background: var(--btn-bg);
      color: #fff;
    }

    body.nav-overlay-open {
      overflow: hidden;
    }
  `,r={chevronDown:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',briefcase:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',logout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',helpCircle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',message:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v2H7zm0 4h7v2H7z"/><path d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2m0 14H6.667L4 18V4h16z"/></svg>',login:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>'};function w(n={}){const{isLoggedIn:e=!1,firstName:l="User",lastName:o="",email:d="",profileUrl:c=""}=n,p=y.map(a=>`
      <a href="/directories/${a.slug}" class="x-nav-dropdown-item">${a.name}</a>
    `).join(""),t=o?`${l} ${o}`:l,s=`
      <a href="/profile/edit-profile" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${r.edit}</span>Edit Profile
      </a>
      <a href="/profile/edit-portfolio" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${r.briefcase}</span>Edit Portfolio
      </a>
      <a href="/profile/suggest-an-event" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${r.calendar}</span>My Events
      </a>
      <a href="/profile/messages" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${r.message}</span>My Messages
      </a>
      <a href="/profile/support" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${r.helpCircle}</span>Get Support
      </a>
      ${c?`<a href="${c}" class="x-nav-dropdown-item">
        <span class="x-nav-dropdown-item-icon">${r.user}</span>View my Profile
      </a>`:""}
      <div class="x-nav-dropdown-divider"></div>
      <button type="button" class="x-nav-dropdown-item danger" data-action="logout">
        <span class="x-nav-dropdown-item-icon">${r.logout}</span>Log Out
      </button>
    `,x=y.map(a=>`
      <a href="/directories/${a.slug}" class="x-nav-overlay-sublink">${a.name}</a>
    `).join("");return`
      <nav class="x-nav" role="navigation">
        <div class="x-nav-logo">
          <a href="/">${f}</a>
        </div>

        <div class="x-nav-primary">
          <div class="x-nav-item" data-priority="high">
            <button class="x-nav-link" aria-expanded="false" data-dropdown="directory">
              Find a Creative<span class="x-nav-chevron">${r.chevronDown}</span>
            </button>
            <div class="x-nav-dropdown" id="dropdown-directory">
              ${p}
              <div class="x-nav-dropdown-footer">
                <a href="/find-a-creative" class="x-nav-dropdown-item view-all">
                  <span class="x-nav-dropdown-item-icon">${r.grid}</span>View all Categories
                </a>
              </div>
            </div>
          </div>
          <div class="x-nav-item" data-priority="high"><a href="/events" class="x-nav-link">Events</a></div>
          <div class="x-nav-item" data-priority="high"><a href="/jobs" class="x-nav-link">Jobs</a></div>
          <div class="x-nav-item" data-priority="low"><a href="/resources" class="x-nav-link">Resources</a></div>
          <div class="x-nav-item" data-priority="low"><a href="/magazine" class="x-nav-link">Magazine</a></div>
        </div>

        <div class="x-nav-actions">
          ${e?"":'<a href="/join" class="x-nav-btn">Become a Member</a>'}
          ${e?`
            <div class="x-nav-user">
              <button class="x-nav-user-btn" aria-expanded="false">
                Hello, ${l}<span class="x-nav-user-chevron">${r.chevronDown}</span>
              </button>
              <div class="x-nav-user-dropdown">
                ${d?`<div class="x-nav-user-header"><div class="x-nav-user-name">${t}</div><div class="x-nav-user-email">${d}</div></div>`:""}
                ${s}
              </div>
            </div>
          `:""}
          <button class="x-nav-search" data-action="search">
            <span class="x-nav-search-icon">${r.search}</span>
            <span class="x-nav-search-text">Search</span>
          </button>
          <button class="x-nav-hamburger" data-action="menu" aria-label="Menu">
            <span class="x-nav-hamburger-line"></span>
            <span class="x-nav-hamburger-line"></span>
            <span class="x-nav-hamburger-line"></span>
          </button>
        </div>
      </nav>

      <!-- Navigation Overlay -->
      <div class="x-nav-overlay" id="x-nav-overlay">
        <div class="x-nav-overlay-header">
          <div class="x-nav-overlay-logo">${f}</div>
          <div class="x-nav-overlay-header-actions">
            ${e?`<a href="${c||"/profile"}" class="x-nav-overlay-user-btn">Hello, ${l} ${r.chevronDown}</a>`:`<a href="/tools/login" class="x-nav-overlay-login-btn">${r.login} Log In</a>`}
            <button class="x-nav-overlay-close" data-action="close-menu">${r.x}</button>
          </div>
        </div>
        <div class="x-nav-overlay-body">
          <div class="x-nav-overlay-search">
            <form action="/search" method="get" class="x-nav-overlay-search-wrapper">
              <input type="text" name="query" class="x-nav-overlay-search-input" placeholder="Search the directory" autocomplete="off">
              <button type="submit" class="x-nav-overlay-search-btn">${r.search}</button>
            </form>
          </div>
          <div class="x-nav-overlay-content">
            <div class="x-nav-overlay-item">
              <button class="x-nav-overlay-link" data-toggle="find-creative">Find a Creative<span class="x-nav-overlay-link-chevron">${r.chevronDown}</span></button>
              <div class="x-nav-overlay-subnav" id="subnav-find-creative">
                ${x}
                <a href="/find-a-creative" class="x-nav-overlay-sublink view-all">${r.grid} View all Categories</a>
              </div>
            </div>
            <div class="x-nav-overlay-item"><a href="/events" class="x-nav-overlay-link">Events</a></div>
            <div class="x-nav-overlay-item"><a href="/opportunities" class="x-nav-overlay-link">Opportunities</a></div>
            <div class="x-nav-overlay-item"><a href="/resources" class="x-nav-overlay-link">Resources</a></div>
            <div class="x-nav-overlay-item"><a href="/stories" class="x-nav-overlay-link">Stories</a></div>
            <div class="x-nav-overlay-item"><a href="/magazine" class="x-nav-overlay-link">Magazine</a></div>
          </div>
          <div class="x-nav-overlay-footer">
            <a href="/about" class="x-nav-overlay-footer-link">About</a>
            <a href="/contact" class="x-nav-overlay-footer-link">Contact</a>
            <a href="/support" class="x-nav-overlay-footer-link">Support</a>
          </div>
        </div>
      </div>

      <!-- Search Overlay -->
      <div class="x-search-overlay" id="x-search-overlay">
        <div class="x-search-overlay-header">
          <div class="x-search-overlay-logo">${k}</div>
          <button class="x-search-overlay-close" data-action="close-search">${r.x}</button>
        </div>
        <div class="x-search-overlay-content">
          <form class="x-search-form" action="/search" method="get">
            <div class="x-search-input-wrapper">
              <input type="text" name="query" class="x-search-input" placeholder="Enter your search" autocomplete="off">
              <button type="submit" class="x-search-submit">Search</button>
            </div>
          </form>
        </div>
      </div>
    `}function L(n){const e=n.querySelector('[data-dropdown="directory"]'),l=n.querySelector("#dropdown-directory"),o=n.querySelector(".x-nav-user-btn"),d=n.querySelector(".x-nav-user-dropdown"),c=n.querySelector('[data-action="menu"]'),p=n.querySelector('[data-action="search"]'),t=n.querySelector("#x-nav-overlay"),s=n.querySelector("#x-search-overlay"),x=n.querySelector('[data-action="close-menu"]'),a=n.querySelector('[data-action="close-search"]'),v=n.querySelector('[data-toggle="find-creative"]'),g=n.querySelector("#subnav-find-creative");e==null||e.addEventListener("click",i=>{i.stopPropagation();const h=l.classList.toggle("open");e.setAttribute("aria-expanded",h),d!=null&&d.classList.contains("open")&&(d.classList.remove("open"),o==null||o.setAttribute("aria-expanded","false"))}),o==null||o.addEventListener("click",i=>{i.stopPropagation();const h=d.classList.toggle("open");o.setAttribute("aria-expanded",h),l!=null&&l.classList.contains("open")&&(l.classList.remove("open"),e==null||e.setAttribute("aria-expanded","false"))}),c==null||c.addEventListener("click",()=>{t==null||t.classList.add("open"),document.body.classList.add("nav-overlay-open")}),x==null||x.addEventListener("click",()=>{t==null||t.classList.remove("open"),document.body.classList.remove("nav-overlay-open")}),p==null||p.addEventListener("click",()=>{s==null||s.classList.add("open"),document.body.classList.add("nav-overlay-open"),setTimeout(()=>{var i;return(i=s==null?void 0:s.querySelector(".x-search-input"))==null?void 0:i.focus()},100)}),a==null||a.addEventListener("click",()=>{s==null||s.classList.remove("open"),document.body.classList.remove("nav-overlay-open")}),v==null||v.addEventListener("click",()=>{const i=g==null?void 0:g.classList.toggle("open");v.classList.toggle("active",i)}),document.addEventListener("click",i=>{l&&!i.target.closest('[data-dropdown="directory"]')&&!i.target.closest("#dropdown-directory")&&(l.classList.remove("open"),e==null||e.setAttribute("aria-expanded","false")),d&&!i.target.closest(".x-nav-user")&&(d.classList.remove("open"),o==null||o.setAttribute("aria-expanded","false"))}),document.addEventListener("keydown",i=>{i.key==="Escape"&&(l==null||l.classList.remove("open"),e==null||e.setAttribute("aria-expanded","false"),d==null||d.classList.remove("open"),o==null||o.setAttribute("aria-expanded","false"),t==null||t.classList.remove("open"),s==null||s.classList.remove("open"),document.body.classList.remove("nav-overlay-open"))});const m=n.querySelector('[data-action="logout"]');m==null||m.addEventListener("click",async i=>{if(i.preventDefault(),window.$memberstackDom)try{await window.$memberstackDom.logout(),window.location.href="/"}catch(h){console.error("Logout error:",h),window.location.href="/"}else window.location.href="/"}),t==null||t.querySelectorAll("a").forEach(i=>{i.addEventListener("click",()=>{t.classList.remove("open"),document.body.classList.remove("nav-overlay-open")})})}async function u(){var d,c,p,t,s,x;const n=document.querySelector(".x-header");if(!n)return;if(!document.getElementById("x-nav-styles")){const a=document.createElement("style");a.id="x-nav-styles",a.textContent=b,document.head.appendChild(a)}let e={isLoggedIn:!1};const o=await new Promise(a=>{if(window.$memberstackDom)return a(window.$memberstackDom);let v=0;const g=setInterval(()=>{v++,window.$memberstackDom?(clearInterval(g),a(window.$memberstackDom)):v>=30&&(clearInterval(g),a(null))},100)});if(o)try{const{data:a}=await o.getCurrentMember();if(a){let v=((d=a.customFields)==null?void 0:d["member-webflow-url"])||"";v&&!/^https?:\/\//i.test(v)&&(v="https://"+v),e={isLoggedIn:!0,firstName:((c=a.customFields)==null?void 0:c["first-name"])||((t=(p=a.auth)==null?void 0:p.email)==null?void 0:t.split("@")[0])||"User",lastName:((s=a.customFields)==null?void 0:s["last-name"])||"",email:((x=a.auth)==null?void 0:x.email)||"",profileUrl:v}}}catch(a){console.warn("MTNS Nav: Error getting member",a)}n.innerHTML=w(e),L(n)}window.MTNSNav={init:u,render:w,styles:b},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",u):u()})();
