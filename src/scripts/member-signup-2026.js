// Member Signup 2026 Script
// Simplified signup form - collects basic info only
// Membership type passed via URL parameter
// Full profile completion happens post-payment in onboarding

(function() {
  console.log('Member signup 2026 script loaded');

  // ============================================
  // CONFIGURATION
  // ============================================

  // Membership types with their Memberstack plan and price IDs
  const MEMBERSHIP_TYPES = {
    'emerging': {
      name: 'Emerging',
      planId: 'pln_emerging-i59k0l22',
      monthlyPriceId: 'prc_emerging-monthly-pjfn0zg0',
      yearlyPriceId: 'prc_emerging-subscription-gsa206gw'
    },
    'professional': {
      name: 'Professional',
      planId: 'pln_professional-ic970osr',
      monthlyPriceId: 'prc_professional-monthly-ilg80e59',
      yearlyPriceId: 'prc_professional-subscription-4z9m0lla'
    },
    'not-for-profit': {
      name: 'Not For Profit',
      planId: 'pln_not-for-profit-qaa106a4',
      monthlyPriceId: 'prc_not-for-profit-monthly-t1gb0etf',
      yearlyPriceId: 'prc_not-for-profit-subscription-w69j0l9k'
    },
    'small-business': {
      name: 'Small Business',
      planId: 'pln_small-business-qsa506lc',
      monthlyPriceId: 'prc_small-business-monthly-3zgd0ga2',
      yearlyPriceId: 'prc_small-business-subscription-jpa606e1'
    },
    'large-business': {
      name: 'Large Business',
      planId: 'pln_medium-large-business-9qa706pj',
      monthlyPriceId: 'prc_medium-large-business-monthly-i2fl0z2d',
      yearlyPriceId: 'prc_medium-large-business-subscription-g6a806rj'
    },
    'spaces-suppliers': {
      name: 'Spaces / Suppliers',
      planId: 'pln_creative-spaces-suppliers-ck5s08g3',
      monthlyPriceId: 'prc_spaces-suppliers-monthly-odbt0bpb',
      yearlyPriceId: 'prc_spaces-suppliers-yearly-o0bo07rj'
    }
  };

  // Suburbs data (from Webflow CMS)
  const SUBURBS = [
    { id: '64bfb65db1569eeda7582433', name: 'Bell', slug: 'bell' },
    { id: '64bfb65dc335367110321546', name: 'Bilpin', slug: 'bilpin' },
    { id: '64bfb65d757e05b74ba0e403', name: 'Blackheath', slug: 'blackheath' },
    { id: '64bfb65d6a8497d80eb5b5c6', name: 'Blaxland', slug: 'blaxland' },
    { id: '64bfb65d409f7c767042076c', name: 'Bullaburra', slug: 'bullaburra' },
    { id: '64bfb65d409f7c767042076d', name: 'Faulconbridge', slug: 'faulconbridge' },
    { id: '64bfb65d655ee21e8c72ee13', name: 'Glenbrook', slug: 'glenbrook' },
    { id: '64bfb65d2cc46c71a5be8efb', name: 'Hazelbrook', slug: 'hazelbrook' },
    { id: '64bfb65d7519806dd636ca2a', name: 'Katoomba', slug: 'katoomba' },
    { id: '64bfb65e2cc46c71a5be8f19', name: 'Lapstone', slug: 'lapstone' },
    { id: '64bfb65e57a4cc3165c39201', name: 'Lawson', slug: 'lawson' },
    { id: '64bfb65ec791453caa2f9d46', name: 'Leura', slug: 'leura' },
    { id: '64bfb65ec791453caa2f9d4f', name: 'Linden', slug: 'linden' },
    { id: '64bfb65e75299ea8759da3c3', name: 'Medlow Bath', slug: 'medlow-bath' },
    { id: '64bfb65ec016ed44dbb8add3', name: 'Megalong Valley', slug: 'megalong-valley' },
    { id: '64bfb65ec7c3a0d4663a1577', name: 'Mount Irvine', slug: 'mount-irvine' },
    { id: '64bfb65fafe29b2df8a63f02', name: 'Mount Tomah', slug: 'mount-tomah' },
    { id: '64bfb65f7519806dd636cccf', name: 'Mount Victoria', slug: 'mount-victoria' },
    { id: '64bfb65f2cc46c71a5be9045', name: 'Mount Wilson', slug: 'mount-wilson' },
    { id: '6733dfdf795b2df6a1573dd1', name: 'Penrith', slug: 'penrith' },
    { id: '64bfb65f2cc46c71a5be907d', name: 'Springwood', slug: 'springwood' },
    { id: '64bfb65feec6228116d7a9f3', name: 'Sun Valley', slug: 'sun-valley' },
    { id: '64bfb65f73964b051a9b6baf', name: 'Valley Heights', slug: 'valley-heights' },
    { id: '64bfb65fd304d7de5fc6ecf0', name: 'Warrimoo', slug: 'warrimoo' },
    { id: '64bfb65f9f89e1af537ca7e1', name: 'Wentworth Falls', slug: 'wentworth-falls' },
    { id: '64bfb65fc3353671103219b0', name: 'Winmalee', slug: 'winmalee' },
    { id: '64bfb65f363259218e7640bf', name: 'Woodford', slug: 'woodford' },
    { id: '64bfb66060c8908f983dd9e6', name: 'Yellow Rock', slug: 'yellow-rock' }
  ];

  // Styles - consistent with member-events.js
  const styles = `
    .ms-container {
      font-family: inherit;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
    .ms-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .ms-header h2 {
      margin: 0 0 8px 0;
      font-size: 28px;
      color: #333;
    }
    .ms-header p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }
    .ms-membership-badge {
      display: inline-block;
      background: #333;
      color: #fff;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 12px;
    }
    .ms-form {
      background: #fff;
      border-radius: 8px;
      padding: 32px;
      border: 1px solid #e0e0e0;
    }
    .ms-form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 600px) {
      .ms-form-row {
        grid-template-columns: 1fr;
      }
      .ms-form {
        padding: 24px 16px;
      }
    }
    .ms-form-field {
      margin-bottom: 20px;
    }
    .ms-form-field.full-width {
      grid-column: 1 / -1;
    }
    .ms-form-field label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      text-align: left;
    }
    .ms-form-field label span {
      color: #dc3545;
    }
    .ms-form-field .ms-hint {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    .ms-form-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .ms-form-input:focus {
      outline: none;
      border-color: #333;
    }
    .ms-form-input.error {
      border-color: #dc3545;
    }
    select.ms-form-input {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
    }
    .ms-error-msg {
      font-size: 12px;
      color: #dc3545;
      margin-top: 4px;
      display: none;
    }
    .ms-error-msg.visible {
      display: block;
    }
    .ms-checkbox-field {
      margin-bottom: 16px;
    }
    .ms-checkbox-field label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-weight: 400;
      cursor: pointer;
    }
    .ms-checkbox-field input[type="checkbox"] {
      margin-top: 3px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    .ms-checkbox-field a {
      color: #007bff;
      text-decoration: underline;
    }
    .ms-btn {
      background: #333;
      color: #fff;
      border: none;
      padding: 14px 28px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: background 0.2s;
      width: 100%;
      margin-top: 12px;
    }
    .ms-btn:hover {
      background: #555;
    }
    .ms-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .ms-divider {
      display: flex;
      align-items: center;
      margin: 24px 0;
      color: #999;
      font-size: 13px;
    }
    .ms-divider::before,
    .ms-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #ddd;
    }
    .ms-divider::before {
      margin-right: 16px;
    }
    .ms-divider::after {
      margin-left: 16px;
    }
    .ms-login-link {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #666;
    }
    .ms-login-link a {
      color: #333;
      font-weight: 600;
      text-decoration: none;
    }
    .ms-login-link a:hover {
      text-decoration: underline;
    }
    .ms-loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .ms-error-banner {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .ms-info-box {
      padding: 16px;
      background: #e8f4fc;
      border-radius: 8px;
      margin-bottom: 24px;
      border-left: 4px solid #007bff;
    }
    .ms-info-box p {
      margin: 0;
      font-size: 14px;
      color: #333;
      line-height: 1.5;
    }
    .ms-password-requirements {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
      padding-left: 16px;
    }
    .ms-password-requirements li {
      margin-bottom: 4px;
    }
  `;

  // Get membership type and billing frequency from URL parameters
  function getSignupParamsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    let type = params.get('type');
    let billing = params.get('billing') || 'monthly'; // Default to monthly

    // Validate type
    if (!type || !MEMBERSHIP_TYPES[type]) {
      // Try to extract from URL path (e.g., /join/signup/2026/professional)
      const pathMatch = window.location.pathname.match(/\/join\/signup\/2026\/([^\/]+)/);
      if (pathMatch && MEMBERSHIP_TYPES[pathMatch[1]]) {
        type = pathMatch[1];
      } else {
        type = null;
      }
    }

    // Validate billing
    if (billing !== 'monthly' && billing !== 'yearly') {
      billing = 'monthly';
    }

    return { type, billing };
  }

  // Generate slug from name
  function generateSlug(firstName, lastName) {
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    return fullName
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Create suburb dropdown HTML
  function createSuburbSelect() {
    let options = '<option value="">Select your suburb...</option>';
    SUBURBS.forEach(suburb => {
      options += `<option value="${suburb.id}" data-slug="${suburb.slug}">${suburb.name}</option>`;
    });
    return `<select class="ms-form-input" id="ms-suburb" required>${options}</select>`;
  }

  // Wait for Memberstack
  function waitForMemberstack() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50;

      const check = setInterval(() => {
        attempts++;
        if (window.$memberstackDom) {
          clearInterval(check);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(check);
          reject(new Error('Memberstack not loaded'));
        }
      }, 100);
    });
  }

  // Validate email format
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Validate password strength
  function isValidPassword(password) {
    return password.length >= 8;
  }

  // Render the signup form
  function renderForm(container, membershipType, billingFrequency) {
    const typeInfo = MEMBERSHIP_TYPES[membershipType];
    const billingLabel = billingFrequency === 'yearly' ? 'Yearly' : 'Monthly';

    container.innerHTML = `
      <div class="ms-container">
        <div class="ms-header">
          <h2>CREATE YOUR ACCOUNT</h2>
          <div class="ms-membership-badge">${typeInfo.name} - ${billingLabel}</div>
        </div>

        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <div class="ms-form-row">
            <div class="ms-form-field">
              <label>First Name <span>*</span></label>
              <input type="text" class="ms-form-input" id="ms-first-name" required>
            </div>
            <div class="ms-form-field">
              <label>Last Name <span>*</span></label>
              <input type="text" class="ms-form-input" id="ms-last-name" required>
            </div>
          </div>

          <div class="ms-form-field">
            <label>Email <span>*</span></label>
            <input type="email" class="ms-form-input" id="ms-email" required>
            <div class="ms-error-msg" id="ms-email-error">Please enter a valid email address</div>
          </div>

          <div class="ms-form-field">
            <label>Suburb <span>*</span></label>
            ${createSuburbSelect()}
            <div class="ms-hint">Select the suburb where you live or where the majority of your business activity takes place</div>
          </div>

          <div class="ms-form-field">
            <label>Password <span>*</span></label>
            <input type="password" class="ms-form-input" id="ms-password" required>
            <ul class="ms-password-requirements">
              <li>At least 8 characters</li>
            </ul>
            <div class="ms-error-msg" id="ms-password-error">Password must be at least 8 characters</div>
          </div>

          <div class="ms-divider">Confirmations</div>

          <div class="ms-checkbox-field">
            <label>
              <input type="checkbox" id="ms-confirm-location" required>
              <span>I confirm that I live or work within the Blue Mountains</span>
            </label>
          </div>

          <div class="ms-checkbox-field">
            <label>
              <input type="checkbox" id="ms-confirm-creative" required>
              <span>I confirm that I work in the creative industries as per <a href="#" data-modal="creative-definition">this definition</a></span>
            </label>
          </div>

          <button type="button" class="ms-btn" id="ms-submit-btn">
            Create Account & Continue to Payment
          </button>

          <div class="ms-login-link">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </div>
      </div>
    `;

    setupFormHandlers(container, membershipType, billingFrequency);
  }

  // Setup form event handlers
  function setupFormHandlers(container, membershipType, billingFrequency) {
    const form = container.querySelector('.ms-form');
    const submitBtn = container.querySelector('#ms-submit-btn');
    const emailInput = container.querySelector('#ms-email');
    const passwordInput = container.querySelector('#ms-password');
    const emailError = container.querySelector('#ms-email-error');
    const passwordError = container.querySelector('#ms-password-error');
    const errorBanner = container.querySelector('#ms-error-banner');

    // Email validation on blur
    emailInput.addEventListener('blur', () => {
      const isValid = isValidEmail(emailInput.value);
      emailInput.classList.toggle('error', !isValid && emailInput.value);
      emailError.classList.toggle('visible', !isValid && emailInput.value);
    });

    // Password validation on blur
    passwordInput.addEventListener('blur', () => {
      const isValid = isValidPassword(passwordInput.value);
      passwordInput.classList.toggle('error', !isValid && passwordInput.value);
      passwordError.classList.toggle('visible', !isValid && passwordInput.value);
    });

    // Submit handler
    submitBtn.addEventListener('click', async () => {
      // Hide previous errors
      errorBanner.style.display = 'none';

      // Get values
      const firstName = container.querySelector('#ms-first-name').value.trim();
      const lastName = container.querySelector('#ms-last-name').value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const suburbSelect = container.querySelector('#ms-suburb');
      const suburbId = suburbSelect.value;
      const suburbName = suburbSelect.options[suburbSelect.selectedIndex]?.text || '';
      const confirmLocation = container.querySelector('#ms-confirm-location').checked;
      const confirmCreative = container.querySelector('#ms-confirm-creative').checked;

      // Validation
      if (!firstName || !lastName) {
        showError(errorBanner, 'Please enter your first and last name');
        return;
      }

      if (!email || !isValidEmail(email)) {
        showError(errorBanner, 'Please enter a valid email address');
        emailInput.classList.add('error');
        return;
      }

      if (!suburbId) {
        showError(errorBanner, 'Please select your suburb');
        return;
      }

      if (!password || !isValidPassword(password)) {
        showError(errorBanner, 'Password must be at least 8 characters');
        passwordInput.classList.add('error');
        return;
      }

      if (!confirmLocation) {
        showError(errorBanner, 'Please confirm that you live or work within the Blue Mountains');
        return;
      }

      if (!confirmCreative) {
        showError(errorBanner, 'Please confirm that you work in the creative industries');
        return;
      }

      // Disable submit button
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';

      try {
        // Generate slug for member profile
        // Individual types use firstname-lastname, business types set slug during onboarding
        const isBusinessType = ['small-business', 'large-business', 'not-for-profit', 'spaces-suppliers'].includes(membershipType);
        const slug = isBusinessType ? '' : generateSlug(firstName, lastName);

        // Get the plan and price IDs for this membership type
        const typeInfo = MEMBERSHIP_TYPES[membershipType];
        const priceId = billingFrequency === 'yearly'
          ? typeInfo.yearlyPriceId
          : typeInfo.monthlyPriceId;

        // Step 1: Create member without plan (faster)
        const signupResult = await window.$memberstackDom.signupMemberEmailPassword({
          email: email,
          password: password,
          customFields: {
            'first-name': firstName,
            'last-name': lastName,
            'slug': slug,
            'suburb': suburbName,
            'suburb-id': suburbId,
            'membership-type': membershipType,
            'billing-frequency': billingFrequency,
            'onboarding-complete': 'false'
          }
        });

        console.log('Signup result:', signupResult);

        if (signupResult.data && signupResult.data.member) {
          // Step 2: Redirect to checkout for the plan
          submitBtn.textContent = 'Redirecting to checkout...';

          // Use Memberstack's purchase method to redirect to Stripe checkout
          await window.$memberstackDom.purchasePlansWithCheckout({
            priceId: priceId
          });
        } else {
          throw new Error('Signup failed - no member data returned');
        }

      } catch (error) {
        console.error('Signup error:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account & Continue to Payment';

        // Handle specific Memberstack errors
        let errorMessage = 'An error occurred. Please try again.';

        if (error.message) {
          if (error.message.includes('already exists') || error.message.includes('already registered')) {
            errorMessage = 'An account with this email already exists. Please log in instead.';
          } else if (error.message.includes('password')) {
            errorMessage = 'Password does not meet requirements. Please use at least 8 characters.';
          } else {
            errorMessage = error.message;
          }
        }

        showError(errorBanner, errorMessage);
      }
    });
  }

  // Show error message
  function showError(banner, message) {
    banner.textContent = message;
    banner.style.display = 'block';
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Render error state
  function renderError(container, message) {
    container.innerHTML = `
      <div class="ms-container">
        <div class="ms-form">
          <div class="ms-error-banner" style="display: block;">
            ${message}
          </div>
          <p style="text-align: center; margin-top: 20px;">
            <a href="/join/type" style="color: #333; font-weight: 600;">Choose a membership type</a>
          </p>
        </div>
      </div>
    `;
  }

  // Initialize
  async function init() {
    const container = document.querySelector('.multi-signup-form');
    if (!container) {
      console.warn('Could not find .multi-signup-form container');
      return;
    }

    // Add styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Show loading state
    container.innerHTML = '<div class="ms-loading">Loading...</div>';

    // Get membership type and billing from URL
    const { type: membershipType, billing: billingFrequency } = getSignupParamsFromUrl();

    if (!membershipType) {
      renderError(container, 'No membership type specified. Please select a membership type first.');
      return;
    }

    try {
      // Wait for Memberstack to load
      await waitForMemberstack();

      // Check if already logged in
      const { data: member } = await window.$memberstackDom.getCurrentMember();
      if (member) {
        // Already logged in - redirect to dashboard or onboarding
        window.location.href = '/member/dashboard';
        return;
      }

      // Render the form
      renderForm(container, membershipType, billingFrequency);

    } catch (error) {
      console.error('Error initializing signup form:', error);
      renderError(container, 'Error loading signup form. Please refresh the page.');
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
