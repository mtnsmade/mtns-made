// Member Onboarding Script - Supabase Version
// Multi-step form for completing member profile after payment
// Uses Supabase for data storage and image uploads
// Replaces Memberstack JSON, Zapier, and Uploadcare

(function() {
  console.log('Member onboarding Supabase script loaded');

  // ============================================
  // CONFIGURATION
  // ============================================
  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH';
  const STORAGE_BUCKET = 'member-images';

  // Membership type classifications
  const BUSINESS_TYPES = ['small-business', 'large-business', 'not-for-profit', 'spaces-suppliers'];
  const SPACES_SUPPLIERS_TYPE = 'spaces-suppliers';

  // ============================================
  // STATE
  // ============================================
  let supabase = null;
  let currentStep = 1;
  let totalSteps = 5;
  let memberData = null;  // Memberstack data
  let supabaseMember = null;  // Supabase member record
  let categories = { directories: [], subDirectories: [], spaceCategories: [], supplierCategories: [] };
  let suburbs = [];
  let formData = {
    profileImageUrl: null,
    profileImageFile: null,
    featureImageUrl: null,
    featureImageFile: null,
    bio: '',
    businessName: '',
    suburb: null,  // { id, name }
    spaceOrSupplier: null,
    chosenDirectories: [],
    spaceCategories: [],
    supplierCategories: [],
    businessAddress: '',
    displayAddress: false,
    openingHours: {
      monday: '', tuesday: '', wednesday: '', thursday: '',
      friday: '', saturday: '', sunday: ''
    },
    displayOpeningHours: false,
    website: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    tiktok: '',
    youtube: ''
  };

  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // ============================================
  // STYLES
  // ============================================
  const styles = `
    .ms-container {
      font-family: inherit;
      width: 100%;
      max-width: 700px;
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
      line-height: 1.5;
    }
    .ms-progress {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 32px;
    }
    .ms-progress-step {
      width: 40px;
      height: 4px;
      background: #e0e0e0;
      border-radius: 2px;
      transition: background 0.3s;
    }
    .ms-progress-step.active {
      background: #333;
    }
    .ms-progress-step.completed {
      background: #28a745;
    }
    .ms-form {
      background: #fff;
      border-radius: 8px;
      padding: 32px;
      border: 1px solid #e0e0e0;
    }
    @media (max-width: 600px) {
      .ms-form {
        padding: 24px 16px;
      }
    }
    .ms-step-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }
    .ms-step-description {
      font-size: 14px;
      color: #666;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }
    .ms-form-field {
      margin-bottom: 20px;
    }
    .ms-form-field label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      text-align: left;
    }
    .ms-form-field label span.required {
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
    textarea.ms-form-input {
      min-height: 120px;
      resize: vertical;
    }
    .ms-image-upload {
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      position: relative;
    }
    .ms-image-upload:hover {
      border-color: #999;
      background: #fafafa;
    }
    .ms-image-upload.has-image {
      padding: 0;
      border-style: solid;
    }
    .ms-image-upload input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
    .ms-image-upload-text {
      color: #666;
      font-size: 14px;
    }
    .ms-image-upload-text strong {
      color: #333;
    }
    .ms-image-preview {
      width: 100%;
      max-height: 200px;
      object-fit: cover;
      border-radius: 6px;
    }
    .ms-image-preview.profile {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: 0 auto;
      display: block;
    }
    .ms-image-remove {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0,0,0,0.7);
      color: #fff;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    }
    .ms-image-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 600px) {
      .ms-image-row {
        grid-template-columns: 1fr;
      }
    }
    .ms-category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 8px;
    }
    .ms-category-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 13px;
    }
    .ms-category-item:hover {
      background: #f5f5f5;
    }
    .ms-category-item.selected {
      background: #333;
      color: #fff;
      border-color: #333;
    }
    .ms-category-item input {
      display: none;
    }
    .ms-radio-group {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }
    .ms-radio-item {
      flex: 1;
      padding: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    .ms-radio-item:hover {
      border-color: #999;
    }
    .ms-radio-item.selected {
      border-color: #333;
      background: #f5f5f5;
    }
    .ms-radio-item input {
      display: none;
    }
    .ms-radio-item-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }
    .ms-radio-item-desc {
      font-size: 12px;
      color: #666;
    }
    .ms-hours-grid {
      display: grid;
      gap: 12px;
    }
    .ms-hours-row {
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 12px;
      align-items: center;
    }
    .ms-hours-day {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    .ms-hours-input {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
    }
    .ms-toggle-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .ms-toggle-label {
      font-size: 14px;
      color: #333;
    }
    .ms-toggle {
      position: relative;
      width: 48px;
      height: 26px;
    }
    .ms-toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .ms-toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.3s;
      border-radius: 26px;
    }
    .ms-toggle-slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
    .ms-toggle input:checked + .ms-toggle-slider {
      background-color: #333;
    }
    .ms-toggle input:checked + .ms-toggle-slider:before {
      transform: translateX(22px);
    }
    .ms-links-grid {
      display: grid;
      gap: 16px;
    }
    .ms-link-field {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 12px;
      align-items: center;
    }
    .ms-link-label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    .ms-btn-row {
      display: flex;
      gap: 12px;
      margin-top: 24px;
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
      flex: 1;
    }
    .ms-btn:hover {
      background: #555;
    }
    .ms-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .ms-btn-secondary {
      background: #fff;
      color: #333;
      border: 1px solid #333;
    }
    .ms-btn-secondary:hover {
      background: #f5f5f5;
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
    .ms-char-count {
      font-size: 12px;
      color: #666;
      text-align: right;
      margin-top: 4px;
    }
    .ms-selected-count {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }
    .ms-accordion {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 12px;
      overflow: hidden;
    }
    .ms-accordion-header {
      padding: 14px 16px;
      background: #f8f9fa;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      font-size: 14px;
    }
    .ms-accordion-header:hover {
      background: #f0f0f0;
    }
    .ms-accordion-arrow {
      transition: transform 0.2s;
    }
    .ms-accordion.open .ms-accordion-arrow {
      transform: rotate(180deg);
    }
    .ms-accordion-content {
      display: none;
      padding: 16px;
    }
    .ms-accordion.open .ms-accordion-content {
      display: block;
    }
    .ms-accordion-count {
      font-size: 12px;
      color: #666;
      font-weight: normal;
    }
    .ms-suburb-search {
      position: relative;
    }
    .ms-suburb-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      max-height: 200px;
      overflow-y: auto;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      z-index: 100;
      display: none;
    }
    .ms-suburb-dropdown.visible {
      display: block;
    }
    .ms-suburb-option {
      padding: 10px 14px;
      cursor: pointer;
      font-size: 14px;
    }
    .ms-suburb-option:hover {
      background: #f5f5f5;
    }
    .ms-field-error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }
  `;

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  function waitForDependencies() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50;
      const check = setInterval(() => {
        attempts++;
        if (window.$memberstackDom && window.supabase) {
          clearInterval(check);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(check);
          reject(new Error('Dependencies not loaded (Memberstack or Supabase)'));
        }
      }, 100);
    });
  }

  function isBusinessType(type) {
    return BUSINESS_TYPES.includes(type);
  }

  function isSpacesSuppliers(type) {
    return type === SPACES_SUPPLIERS_TYPE;
  }

  // Social media URL normalization
  const SOCIAL_PLATFORMS = {
    instagram: {
      baseUrl: 'https://www.instagram.com/',
      patterns: [/instagram\.com\/([^\/\?]+)/i, /^@?([a-zA-Z0-9._]+)$/]
    },
    facebook: {
      baseUrl: 'https://www.facebook.com/',
      patterns: [/facebook\.com\/([^\/\?]+)/i, /^([a-zA-Z0-9.]+)$/]
    },
    linkedin: {
      baseUrl: 'https://www.linkedin.com/in/',
      patterns: [/linkedin\.com\/(in|company)\/([^\/\?]+)/i, /^([a-zA-Z0-9-]+)$/]
    },
    tiktok: {
      baseUrl: 'https://www.tiktok.com/@',
      patterns: [/tiktok\.com\/@?([^\/\?]+)/i, /^@?([a-zA-Z0-9._]+)$/]
    },
    youtube: {
      baseUrl: 'https://www.youtube.com/',
      patterns: [/youtube\.com\/(channel|c|user|@)\/([^\/\?]+)/i, /youtube\.com\/([^\/\?]+)/i, /^@?([a-zA-Z0-9_-]+)$/]
    }
  };

  function normalizeUrl(value, platform = null) {
    if (!value || !value.trim()) {
      return { valid: true, url: '' };
    }

    value = value.trim();

    if (value.includes(' ')) {
      return { valid: false, error: 'Please enter only one URL (no spaces)' };
    }

    const httpCount = (value.match(/https?:\/\//gi) || []).length;
    if (httpCount > 1) {
      return { valid: false, error: 'Please enter only one URL' };
    }

    if (/^https?:\/\//i.test(value)) {
      try {
        new URL(value);
        return { valid: true, url: value };
      } catch {
        return { valid: false, error: 'Invalid URL format' };
      }
    }

    if (platform === 'website') {
      if (/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/.test(value)) {
        return { valid: true, url: 'https://' + value };
      }
      return { valid: false, error: 'Please enter a full website URL (e.g., https://example.com)' };
    }

    if (platform && SOCIAL_PLATFORMS[platform]) {
      const config = SOCIAL_PLATFORMS[platform];

      if (value.toLowerCase().includes(platform.toLowerCase() + '.com')) {
        return { valid: true, url: 'https://' + value.replace(/^(https?:\/\/)?/i, '') };
      }

      for (const pattern of config.patterns) {
        const match = value.match(pattern);
        if (match) {
          const username = match[match.length - 1];
          if (username.toLowerCase() === platform.toLowerCase()) {
            return { valid: false, error: `Please enter your ${platform} profile URL or username` };
          }
          return { valid: true, url: config.baseUrl + username.replace(/^@/, '') };
        }
      }

      return { valid: false, error: `Please enter a valid ${platform} URL or username` };
    }

    return { valid: false, error: 'Invalid URL' };
  }

  function validateSocialLinks() {
    const errors = [];
    const platforms = ['website', 'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube'];

    platforms.forEach(platform => {
      const value = formData[platform];
      if (value && value.trim()) {
        const result = normalizeUrl(value, platform);
        if (!result.valid) {
          errors.push({ platform, error: result.error });
        } else {
          formData[platform] = result.url;
        }
      }
    });

    return errors;
  }

  // ============================================
  // SUPABASE OPERATIONS
  // ============================================

  async function loadCategories() {
    try {
      // Load directories
      const { data: directories, error: dirError } = await supabase
        .from('directories')
        .select('id, name, slug')
        .order('display_order');

      if (dirError) throw dirError;

      // Load sub-directories
      const { data: subDirectories, error: subError } = await supabase
        .from('sub_directories')
        .select('id, name, slug, directory_id')
        .order('name');

      if (subError) throw subError;

      // Load space categories
      const { data: spaceCategories, error: spaceError } = await supabase
        .from('creative_space_categories')
        .select('id, name, slug')
        .order('name');

      if (spaceError) throw spaceError;

      // Load supplier categories
      const { data: supplierCategories, error: supplierError } = await supabase
        .from('supplier_categories')
        .select('id, name, slug')
        .order('name');

      if (supplierError) throw supplierError;

      categories = {
        directories: directories || [],
        subDirectories: subDirectories || [],
        spaceCategories: spaceCategories || [],
        supplierCategories: supplierCategories || []
      };

      return categories;
    } catch (error) {
      console.error('Error loading categories:', error);
      throw error;
    }
  }

  async function loadSuburbs(searchTerm) {
    try {
      let query = supabase
        .from('suburbs')
        .select('id, name, state')
        .order('name')
        .limit(20);

      if (searchTerm && searchTerm.length >= 2) {
        query = query.ilike('name', `${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error loading suburbs:', error);
      return [];
    }
  }

  async function getOrCreateMember(memberstackId) {
    try {
      // First try to find existing member
      const { data: existing, error: findError } = await supabase
        .from('members')
        .select('*')
        .eq('memberstack_id', memberstackId)
        .single();

      if (existing) {
        return existing;
      }

      // If not found, we need to wait for the webhook to create it
      // The member should exist if they've gone through signup
      console.log('Member not found in Supabase, may need to wait for webhook');
      return null;
    } catch (error) {
      console.error('Error getting member:', error);
      return null;
    }
  }

  async function uploadImage(file, memberstackId, type) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = `${memberstackId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      throw error;
    }
  }

  async function saveOnboardingData() {
    const memberstackId = memberData.id;

    try {
      // Upload images if we have files
      let profileImageUrl = formData.profileImageUrl;
      let featureImageUrl = formData.featureImageUrl;

      if (formData.profileImageFile) {
        profileImageUrl = await uploadImage(formData.profileImageFile, memberstackId, 'profile');
      }

      if (formData.featureImageFile) {
        featureImageUrl = await uploadImage(formData.featureImageFile, memberstackId, 'feature');
      }

      // Generate slug from business name or member name
      const displayName = formData.businessName || `${memberData.customFields?.['first-name'] || ''} ${memberData.customFields?.['last-name'] || ''}`.trim();
      const slug = displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      // Build the update data for Supabase
      const updateData = {
        profile_image_url: profileImageUrl,
        header_image_url: featureImageUrl,
        bio: formData.bio,
        slug: slug,
        name: displayName,
        business_name: formData.businessName || null,
        suburb_id: formData.suburb?.id || null,
        show_address: formData.displayAddress,
        show_opening_hours: formData.displayOpeningHours,
        // Opening hours
        opening_monday: formData.openingHours.monday || null,
        opening_tuesday: formData.openingHours.tuesday || null,
        opening_wednesday: formData.openingHours.wednesday || null,
        opening_thursday: formData.openingHours.thursday || null,
        opening_friday: formData.openingHours.friday || null,
        opening_saturday: formData.openingHours.saturday || null,
        opening_sunday: formData.openingHours.sunday || null,
        // Links
        website: formData.website || null,
        instagram: formData.instagram || null,
        facebook: formData.facebook || null,
        linkedin: formData.linkedin || null,
        tiktok: formData.tiktok || null,
        youtube: formData.youtube || null,
        // Space/Supplier flags
        is_creative_space: formData.spaceOrSupplier === 'space',
        is_supplier: formData.spaceOrSupplier === 'supplier',
        // Mark profile as complete
        profile_complete: true
      };

      // Update or insert the member
      const { data: updatedMember, error: updateError } = await supabase
        .from('members')
        .upsert({
          memberstack_id: memberstackId,
          email: memberData.auth?.email,
          first_name: memberData.customFields?.['first-name'] || null,
          last_name: memberData.customFields?.['last-name'] || null,
          ...updateData
        }, {
          onConflict: 'memberstack_id'
        })
        .select()
        .single();

      if (updateError) throw updateError;

      // Save category selections to junction tables
      const memberId = updatedMember.id;

      // Delete existing category associations
      await supabase.from('member_sub_directories').delete().eq('member_id', memberId);
      await supabase.from('member_space_categories').delete().eq('member_id', memberId);
      await supabase.from('member_supplier_categories').delete().eq('member_id', memberId);

      // Insert new sub-directory associations
      if (formData.chosenDirectories.length > 0) {
        const subDirInserts = formData.chosenDirectories.map(subDirId => ({
          member_id: memberId,
          sub_directory_id: subDirId
        }));
        await supabase.from('member_sub_directories').insert(subDirInserts);
      }

      // Insert space category associations
      if (formData.spaceCategories.length > 0) {
        const spaceCatInserts = formData.spaceCategories.map(catId => ({
          member_id: memberId,
          space_category_id: catId
        }));
        await supabase.from('member_space_categories').insert(spaceCatInserts);
      }

      // Insert supplier category associations
      if (formData.supplierCategories.length > 0) {
        const supplierCatInserts = formData.supplierCategories.map(catId => ({
          member_id: memberId,
          supplier_category_id: catId
        }));
        await supabase.from('member_supplier_categories').insert(supplierCatInserts);
      }

      // Also update Memberstack to mark onboarding complete
      await window.$memberstackDom.updateMember({
        customFields: {
          'onboarding-complete': 'true'
        }
      });

      console.log('Onboarding data saved successfully');
      return updatedMember;

    } catch (error) {
      console.error('Error saving onboarding data:', error);
      throw error;
    }
  }

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  function renderProgress(container) {
    const membershipType = memberData?.customFields?.['membership-type'];
    totalSteps = isBusinessType(membershipType) ? 5 : 4;

    let html = '<div class="ms-progress">';
    for (let i = 1; i <= totalSteps; i++) {
      let className = 'ms-progress-step';
      if (i < currentStep) className += ' completed';
      if (i === currentStep) className += ' active';
      html += `<div class="${className}"></div>`;
    }
    html += '</div>';
    return html;
  }

  function renderStep1(container) {
    container.innerHTML = `
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Let's set up your public profile. This should only take a few minutes.</p>
        </div>
        ${renderProgress(container)}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 1: Profile Images</h3>
          <p class="ms-step-description">Upload images that will appear on your public profile.</p>

          <div class="ms-image-row">
            <div class="ms-form-field">
              <label>Profile Image <span class="required">*</span></label>
              <div class="ms-image-upload" id="profile-upload">
                <input type="file" accept="image/*" id="profile-file-input">
                <div class="ms-image-upload-text" id="profile-upload-text">
                  <strong>Click to upload</strong><br>
                  Square image recommended
                </div>
              </div>
              <div class="ms-hint">This will be your profile photo</div>
            </div>

            <div class="ms-form-field">
              <label>Feature Image <span class="required">*</span></label>
              <div class="ms-image-upload" id="feature-upload">
                <input type="file" accept="image/*" id="feature-file-input">
                <div class="ms-image-upload-text" id="feature-upload-text">
                  <strong>Click to upload</strong><br>
                  Landscape image recommended
                </div>
              </div>
              <div class="ms-hint">This appears as the header on your profile page</div>
            </div>
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `;

    setupStep1Handlers(container);
  }

  function setupStep1Handlers(container) {
    const profileUpload = container.querySelector('#profile-upload');
    const featureUpload = container.querySelector('#feature-upload');
    const profileInput = container.querySelector('#profile-file-input');
    const featureInput = container.querySelector('#feature-file-input');
    const nextBtn = container.querySelector('#ms-next-btn');
    const errorBanner = container.querySelector('#ms-error-banner');

    function renderProfileState() {
      if (formData.profileImageUrl) {
        profileUpload.innerHTML = `
          <img src="${formData.profileImageUrl}" class="ms-image-preview profile" alt="Profile preview">
          <button type="button" class="ms-image-remove" data-remove="profile">&times;</button>
        `;
        profileUpload.classList.add('has-image');
      } else {
        profileUpload.innerHTML = `
          <input type="file" accept="image/*" id="profile-file-input">
          <div class="ms-image-upload-text">
            <strong>Click to upload</strong><br>
            Square image recommended
          </div>
        `;
        profileUpload.classList.remove('has-image');
        // Re-attach file input handler
        const newInput = profileUpload.querySelector('#profile-file-input');
        newInput.addEventListener('change', handleProfileFileSelect);
      }
    }

    function renderFeatureState() {
      if (formData.featureImageUrl) {
        featureUpload.innerHTML = `
          <img src="${formData.featureImageUrl}" class="ms-image-preview" alt="Feature preview">
          <button type="button" class="ms-image-remove" data-remove="feature">&times;</button>
        `;
        featureUpload.classList.add('has-image');
      } else {
        featureUpload.innerHTML = `
          <input type="file" accept="image/*" id="feature-file-input">
          <div class="ms-image-upload-text">
            <strong>Click to upload</strong><br>
            Landscape image recommended
          </div>
        `;
        featureUpload.classList.remove('has-image');
        const newInput = featureUpload.querySelector('#feature-file-input');
        newInput.addEventListener('change', handleFeatureFileSelect);
      }
    }

    function handleProfileFileSelect(e) {
      const file = e.target.files[0];
      if (file) {
        formData.profileImageFile = file;
        formData.profileImageUrl = URL.createObjectURL(file);
        renderProfileState();
        errorBanner.style.display = 'none';
      }
    }

    function handleFeatureFileSelect(e) {
      const file = e.target.files[0];
      if (file) {
        formData.featureImageFile = file;
        formData.featureImageUrl = URL.createObjectURL(file);
        renderFeatureState();
        errorBanner.style.display = 'none';
      }
    }

    profileInput.addEventListener('change', handleProfileFileSelect);
    featureInput.addEventListener('change', handleFeatureFileSelect);

    // Handle remove button clicks
    profileUpload.addEventListener('click', (e) => {
      if (e.target.dataset.remove === 'profile') {
        e.stopPropagation();
        formData.profileImageUrl = null;
        formData.profileImageFile = null;
        renderProfileState();
      }
    });

    featureUpload.addEventListener('click', (e) => {
      if (e.target.dataset.remove === 'feature') {
        e.stopPropagation();
        formData.featureImageUrl = null;
        formData.featureImageFile = null;
        renderFeatureState();
      }
    });

    // Restore previews if coming back from later step
    renderProfileState();
    renderFeatureState();

    nextBtn.addEventListener('click', () => {
      if (!formData.profileImageUrl) {
        showError(errorBanner, 'Please upload a profile image');
        return;
      }
      if (!formData.featureImageUrl) {
        showError(errorBanner, 'Please upload a feature image');
        return;
      }
      currentStep = 2;
      renderCurrentStep(container);
    });
  }

  function renderStep2(container) {
    const membershipType = memberData?.customFields?.['membership-type'];
    const showBusinessName = isBusinessType(membershipType);

    container.innerHTML = `
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Tell us about yourself${showBusinessName ? ' and your business' : ''}.</p>
        </div>
        ${renderProgress(container)}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 2: About You</h3>
          <p class="ms-step-description">This information will be displayed on your public profile.</p>

          ${showBusinessName ? `
            <div class="ms-form-field">
              <label>Business / Trading Name <span class="required">*</span></label>
              <input type="text" class="ms-form-input" id="ms-business-name" value="${formData.businessName}" placeholder="Enter your business or trading name">
            </div>
          ` : ''}

          <div class="ms-form-field">
            <label>Location <span class="required">*</span></label>
            <div class="ms-suburb-search">
              <input type="text" class="ms-form-input" id="ms-suburb-search" value="${formData.suburb?.name || ''}" placeholder="Search for your suburb...">
              <div class="ms-suburb-dropdown" id="ms-suburb-dropdown"></div>
            </div>
            <div class="ms-hint">Start typing to search for your suburb</div>
          </div>

          <div class="ms-form-field">
            <label>Bio <span class="required">*</span></label>
            <textarea class="ms-form-input" id="ms-bio" maxlength="2000" placeholder="Tell us about your creative practice, skills, and what you offer...">${formData.bio}</textarea>
            <div class="ms-char-count"><span id="ms-bio-count">${formData.bio.length}</span> / 2000 characters</div>
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `;

    setupStep2Handlers(container, showBusinessName);
  }

  function setupStep2Handlers(container, showBusinessName) {
    const bioInput = container.querySelector('#ms-bio');
    const bioCount = container.querySelector('#ms-bio-count');
    const suburbSearch = container.querySelector('#ms-suburb-search');
    const suburbDropdown = container.querySelector('#ms-suburb-dropdown');
    const businessNameInput = showBusinessName ? container.querySelector('#ms-business-name') : null;
    const backBtn = container.querySelector('#ms-back-btn');
    const nextBtn = container.querySelector('#ms-next-btn');
    const errorBanner = container.querySelector('#ms-error-banner');

    let searchTimeout = null;

    bioInput.addEventListener('input', () => {
      formData.bio = bioInput.value;
      bioCount.textContent = bioInput.value.length;
    });

    if (businessNameInput) {
      businessNameInput.addEventListener('input', () => {
        formData.businessName = businessNameInput.value;
      });
    }

    // Suburb search
    suburbSearch.addEventListener('input', async () => {
      const searchTerm = suburbSearch.value.trim();

      clearTimeout(searchTimeout);

      if (searchTerm.length < 2) {
        suburbDropdown.classList.remove('visible');
        return;
      }

      searchTimeout = setTimeout(async () => {
        const results = await loadSuburbs(searchTerm);
        suburbs = results;

        if (results.length > 0) {
          suburbDropdown.innerHTML = results.map(s =>
            `<div class="ms-suburb-option" data-id="${s.id}" data-name="${s.name}">${s.name}, ${s.state}</div>`
          ).join('');
          suburbDropdown.classList.add('visible');
        } else {
          suburbDropdown.classList.remove('visible');
        }
      }, 300);
    });

    suburbDropdown.addEventListener('click', (e) => {
      const option = e.target.closest('.ms-suburb-option');
      if (option) {
        formData.suburb = {
          id: option.dataset.id,
          name: option.dataset.name
        };
        suburbSearch.value = option.dataset.name;
        suburbDropdown.classList.remove('visible');
      }
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.ms-suburb-search')) {
        suburbDropdown.classList.remove('visible');
      }
    });

    backBtn.addEventListener('click', () => {
      currentStep = 1;
      renderCurrentStep(container);
    });

    nextBtn.addEventListener('click', () => {
      if (showBusinessName && !formData.businessName.trim()) {
        showError(errorBanner, 'Please enter your business name');
        return;
      }
      if (!formData.suburb) {
        showError(errorBanner, 'Please select your location');
        return;
      }
      if (!formData.bio.trim()) {
        showError(errorBanner, 'Please enter a bio');
        return;
      }
      if (formData.bio.trim().length < 50) {
        showError(errorBanner, 'Please enter at least 50 characters for your bio');
        return;
      }
      currentStep = 3;
      renderCurrentStep(container);
    });
  }

  function renderStep3(container) {
    const membershipType = memberData?.customFields?.['membership-type'];
    const isSpaceSupplier = isSpacesSuppliers(membershipType);

    container.innerHTML = `
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Select the categories that best describe your work.</p>
        </div>
        ${renderProgress(container)}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 3: Categories</h3>
          <p class="ms-step-description">Choose categories so people can find you in the directory. Select at least one.</p>

          <div id="categories-container">
            ${isSpaceSupplier ? renderSpaceSupplierSelector() : renderDirectoriesSelector()}
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `;

    setupStep3Handlers(container, isSpaceSupplier);
  }

  function renderSpaceSupplierSelector() {
    return `
      <div class="ms-form-field">
        <label>What type of listing are you? <span class="required">*</span></label>
        <div class="ms-radio-group">
          <label class="ms-radio-item ${formData.spaceOrSupplier === 'space' ? 'selected' : ''}" id="radio-space">
            <input type="radio" name="space-supplier" value="space" ${formData.spaceOrSupplier === 'space' ? 'checked' : ''}>
            <div class="ms-radio-item-title">Creative Space</div>
            <div class="ms-radio-item-desc">Studios, venues, galleries, etc.</div>
          </label>
          <label class="ms-radio-item ${formData.spaceOrSupplier === 'supplier' ? 'selected' : ''}" id="radio-supplier">
            <input type="radio" name="space-supplier" value="supplier" ${formData.spaceOrSupplier === 'supplier' ? 'checked' : ''}>
            <div class="ms-radio-item-title">Supplier</div>
            <div class="ms-radio-item-desc">Materials, services, equipment, etc.</div>
          </label>
        </div>
      </div>
      <div id="space-supplier-categories" style="${formData.spaceOrSupplier ? '' : 'display: none;'}">
        ${formData.spaceOrSupplier === 'space' ? renderSpaceCategories() : ''}
        ${formData.spaceOrSupplier === 'supplier' ? renderSupplierCategories() : ''}
      </div>
    `;
  }

  function renderSpaceCategories() {
    let html = '<div class="ms-category-section"><div class="ms-category-header" style="font-weight:600;margin-bottom:12px;">Select Space Categories</div><div class="ms-category-grid">';
    categories.spaceCategories.forEach(cat => {
      const selected = formData.spaceCategories.includes(cat.id);
      html += `
        <label class="ms-category-item ${selected ? 'selected' : ''}" data-id="${cat.id}">
          <input type="checkbox" value="${cat.id}" ${selected ? 'checked' : ''}>
          ${cat.name}
        </label>
      `;
    });
    html += '</div><div class="ms-selected-count"><span id="space-count">' + formData.spaceCategories.length + '</span> selected</div></div>';
    return html;
  }

  function renderSupplierCategories() {
    let html = '<div class="ms-category-section"><div class="ms-category-header" style="font-weight:600;margin-bottom:12px;">Select Supplier Categories</div><div class="ms-category-grid">';
    categories.supplierCategories.forEach(cat => {
      const selected = formData.supplierCategories.includes(cat.id);
      html += `
        <label class="ms-category-item ${selected ? 'selected' : ''}" data-id="${cat.id}">
          <input type="checkbox" value="${cat.id}" ${selected ? 'checked' : ''}>
          ${cat.name}
        </label>
      `;
    });
    html += '</div><div class="ms-selected-count"><span id="supplier-count">' + formData.supplierCategories.length + '</span> selected</div></div>';
    return html;
  }

  function renderDirectoriesSelector() {
    let html = '';

    categories.directories.forEach(parent => {
      const subDirs = categories.subDirectories.filter(d => d.directory_id === parent.id);
      if (subDirs.length === 0) return;

      const selectedInGroup = subDirs.filter(d => formData.chosenDirectories.includes(d.id)).length;
      const isOpen = selectedInGroup > 0;

      html += `
        <div class="ms-accordion ${isOpen ? 'open' : ''}" data-parent="${parent.id}">
          <div class="ms-accordion-header">
            ${parent.name}
            <span>
              <span class="ms-accordion-count">${selectedInGroup > 0 ? `(${selectedInGroup} selected)` : ''}</span>
              <span class="ms-accordion-arrow">▼</span>
            </span>
          </div>
          <div class="ms-accordion-content">
            <div class="ms-category-grid">
      `;

      subDirs.forEach(dir => {
        const selected = formData.chosenDirectories.includes(dir.id);
        html += `
          <label class="ms-category-item ${selected ? 'selected' : ''}" data-id="${dir.id}">
            <input type="checkbox" value="${dir.id}" ${selected ? 'checked' : ''}>
            ${dir.name}
          </label>
        `;
      });

      html += `
            </div>
          </div>
        </div>
      `;
    });

    html += `<div class="ms-selected-count"><span id="directory-count">${formData.chosenDirectories.length}</span> categories selected</div>`;
    return html;
  }

  function setupStep3Handlers(container, isSpaceSupplier) {
    const backBtn = container.querySelector('#ms-back-btn');
    const nextBtn = container.querySelector('#ms-next-btn');
    const errorBanner = container.querySelector('#ms-error-banner');

    backBtn.addEventListener('click', () => {
      currentStep = 2;
      renderCurrentStep(container);
    });

    if (isSpaceSupplier) {
      const radioSpace = container.querySelector('#radio-space');
      const radioSupplier = container.querySelector('#radio-supplier');
      const categoriesContainer = container.querySelector('#space-supplier-categories');

      radioSpace.addEventListener('click', () => {
        formData.spaceOrSupplier = 'space';
        formData.supplierCategories = [];
        radioSpace.classList.add('selected');
        radioSupplier.classList.remove('selected');
        categoriesContainer.innerHTML = renderSpaceCategories();
        categoriesContainer.style.display = 'block';
        setupCategoryCheckboxes(container, 'spaceCategories', 'space-count');
      });

      radioSupplier.addEventListener('click', () => {
        formData.spaceOrSupplier = 'supplier';
        formData.spaceCategories = [];
        radioSupplier.classList.add('selected');
        radioSpace.classList.remove('selected');
        categoriesContainer.innerHTML = renderSupplierCategories();
        categoriesContainer.style.display = 'block';
        setupCategoryCheckboxes(container, 'supplierCategories', 'supplier-count');
      });

      if (formData.spaceOrSupplier === 'space') {
        setupCategoryCheckboxes(container, 'spaceCategories', 'space-count');
      } else if (formData.spaceOrSupplier === 'supplier') {
        setupCategoryCheckboxes(container, 'supplierCategories', 'supplier-count');
      }

      nextBtn.addEventListener('click', () => {
        if (!formData.spaceOrSupplier) {
          showError(errorBanner, 'Please select whether you are a Creative Space or Supplier');
          return;
        }
        const categoryCount = formData.spaceOrSupplier === 'space'
          ? formData.spaceCategories.length
          : formData.supplierCategories.length;
        if (categoryCount === 0) {
          showError(errorBanner, 'Please select at least one category');
          return;
        }
        currentStep = 4;
        renderCurrentStep(container);
      });

    } else {
      // Accordion handlers
      container.querySelectorAll('.ms-accordion-header').forEach(header => {
        header.addEventListener('click', () => {
          header.parentElement.classList.toggle('open');
        });
      });

      setupCategoryCheckboxes(container, 'chosenDirectories', 'directory-count');

      nextBtn.addEventListener('click', () => {
        if (formData.chosenDirectories.length === 0) {
          showError(errorBanner, 'Please select at least one category');
          return;
        }
        const membershipType = memberData?.customFields?.['membership-type'];
        if (isBusinessType(membershipType)) {
          currentStep = 4;
        } else {
          currentStep = 5;
        }
        renderCurrentStep(container);
      });
    }
  }

  function setupCategoryCheckboxes(container, dataKey, countId) {
    container.querySelectorAll('.ms-category-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const id = item.dataset.id;
        const index = formData[dataKey].indexOf(id);

        if (index === -1) {
          formData[dataKey].push(id);
          item.classList.add('selected');
        } else {
          formData[dataKey].splice(index, 1);
          item.classList.remove('selected');
        }

        const countEl = container.querySelector('#' + countId);
        if (countEl) {
          countEl.textContent = formData[dataKey].length;
        }

        if (dataKey === 'chosenDirectories') {
          updateAccordionCounts(container);
        }
      });
    });
  }

  function updateAccordionCounts(container) {
    container.querySelectorAll('.ms-accordion').forEach(accordion => {
      const parentId = accordion.dataset.parent;
      const subDirs = categories.subDirectories.filter(d => d.directory_id === parentId);
      const selectedCount = subDirs.filter(d => formData.chosenDirectories.includes(d.id)).length;
      const countSpan = accordion.querySelector('.ms-accordion-count');
      countSpan.textContent = selectedCount > 0 ? `(${selectedCount} selected)` : '';
    });
  }

  function renderStep4(container) {
    container.innerHTML = `
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Add your business location and hours.</p>
        </div>
        ${renderProgress(container)}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 4: Location & Hours</h3>
          <p class="ms-step-description">This information is optional. You can control what's displayed publicly.</p>

          <div class="ms-form-field">
            <label>Business Address</label>
            <input type="text" class="ms-form-input" id="ms-address" value="${formData.businessAddress}" placeholder="Enter your business address">
            <div class="ms-hint">This is where customers can find you</div>
          </div>

          <div class="ms-toggle-field">
            <span class="ms-toggle-label">Display address publicly on my profile</span>
            <label class="ms-toggle">
              <input type="checkbox" id="ms-display-address" ${formData.displayAddress ? 'checked' : ''}>
              <span class="ms-toggle-slider"></span>
            </label>
          </div>

          <div class="ms-form-field">
            <label>Opening Hours</label>
            <div class="ms-hours-grid">
              ${DAYS_OF_WEEK.map(day => `
                <div class="ms-hours-row">
                  <span class="ms-hours-day">${day}</span>
                  <input type="text" class="ms-hours-input" id="ms-hours-${day.toLowerCase()}"
                    value="${formData.openingHours[day.toLowerCase()]}"
                    placeholder="e.g., 9am - 5pm or Closed">
                </div>
              `).join('')}
            </div>
          </div>

          <div class="ms-toggle-field">
            <span class="ms-toggle-label">Display opening hours publicly on my profile</span>
            <label class="ms-toggle">
              <input type="checkbox" id="ms-display-hours" ${formData.displayOpeningHours ? 'checked' : ''}>
              <span class="ms-toggle-slider"></span>
            </label>
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `;

    setupStep4Handlers(container);
  }

  function setupStep4Handlers(container) {
    const addressInput = container.querySelector('#ms-address');
    const displayAddressToggle = container.querySelector('#ms-display-address');
    const displayHoursToggle = container.querySelector('#ms-display-hours');
    const backBtn = container.querySelector('#ms-back-btn');
    const nextBtn = container.querySelector('#ms-next-btn');

    addressInput.addEventListener('input', () => {
      formData.businessAddress = addressInput.value;
    });

    displayAddressToggle.addEventListener('change', () => {
      formData.displayAddress = displayAddressToggle.checked;
    });

    displayHoursToggle.addEventListener('change', () => {
      formData.displayOpeningHours = displayHoursToggle.checked;
    });

    DAYS_OF_WEEK.forEach(day => {
      const input = container.querySelector(`#ms-hours-${day.toLowerCase()}`);
      input.addEventListener('input', () => {
        formData.openingHours[day.toLowerCase()] = input.value;
      });
    });

    backBtn.addEventListener('click', () => {
      currentStep = 3;
      renderCurrentStep(container);
    });

    nextBtn.addEventListener('click', () => {
      currentStep = 5;
      renderCurrentStep(container);
    });
  }

  function renderStep5(container) {
    const membershipType = memberData?.customFields?.['membership-type'];
    const stepNumber = isBusinessType(membershipType) ? 5 : 4;

    container.innerHTML = `
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Almost done! Add your online presence.</p>
        </div>
        ${renderProgress(container)}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step ${stepNumber}: Links</h3>
          <p class="ms-step-description">Add your website and social media links. All fields are optional.</p>

          <div class="ms-links-grid">
            <div class="ms-link-field">
              <span class="ms-link-label">Website</span>
              <input type="url" class="ms-form-input" id="ms-website" value="${formData.website}" placeholder="https://yourwebsite.com">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">Instagram</span>
              <input type="url" class="ms-form-input" id="ms-instagram" value="${formData.instagram}" placeholder="https://instagram.com/username">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">Facebook</span>
              <input type="url" class="ms-form-input" id="ms-facebook" value="${formData.facebook}" placeholder="https://facebook.com/page">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">LinkedIn</span>
              <input type="url" class="ms-form-input" id="ms-linkedin" value="${formData.linkedin}" placeholder="https://linkedin.com/in/username">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">TikTok</span>
              <input type="url" class="ms-form-input" id="ms-tiktok" value="${formData.tiktok}" placeholder="https://tiktok.com/@username">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">YouTube</span>
              <input type="url" class="ms-form-input" id="ms-youtube" value="${formData.youtube}" placeholder="https://youtube.com/channel">
            </div>
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-submit-btn">Complete Profile</button>
          </div>
        </div>
      </div>
    `;

    setupStep5Handlers(container);
  }

  function setupStep5Handlers(container) {
    const backBtn = container.querySelector('#ms-back-btn');
    const submitBtn = container.querySelector('#ms-submit-btn');
    const errorBanner = container.querySelector('#ms-error-banner');

    const linkInputs = ['website', 'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube'];
    linkInputs.forEach(platform => {
      const input = container.querySelector(`#ms-${platform}`);
      const field = input.closest('.ms-link-field');

      let errorEl = field.querySelector('.ms-field-error');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'ms-field-error';
        errorEl.style.cssText = 'grid-column: 2;';
        field.appendChild(errorEl);
      }

      input.addEventListener('input', () => {
        formData[platform] = input.value;
        input.classList.remove('error');
        errorEl.textContent = '';
      });

      input.addEventListener('blur', () => {
        const value = input.value.trim();
        if (!value) {
          input.classList.remove('error');
          errorEl.textContent = '';
          return;
        }

        const result = normalizeUrl(value, platform);
        if (result.valid) {
          if (result.url !== value) {
            input.value = result.url;
            formData[platform] = result.url;
          }
          input.classList.remove('error');
          errorEl.textContent = '';
        } else {
          input.classList.add('error');
          errorEl.textContent = result.error;
        }
      });
    });

    backBtn.addEventListener('click', () => {
      const membershipType = memberData?.customFields?.['membership-type'];
      if (isBusinessType(membershipType)) {
        currentStep = 4;
      } else {
        currentStep = 3;
      }
      renderCurrentStep(container);
    });

    submitBtn.addEventListener('click', async () => {
      const errors = validateSocialLinks();
      if (errors.length > 0) {
        errors.forEach(({ platform, error }) => {
          const input = container.querySelector(`#ms-${platform}`);
          const field = input.closest('.ms-link-field');
          const errorEl = field.querySelector('.ms-field-error');
          input.classList.add('error');
          if (errorEl) errorEl.textContent = error;
        });
        showError(errorBanner, 'Please fix the highlighted fields before continuing');
        return;
      }

      linkInputs.forEach(platform => {
        const input = container.querySelector(`#ms-${platform}`);
        if (formData[platform]) {
          input.value = formData[platform];
        }
      });

      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      try {
        await saveOnboardingData();
        renderSuccess(container);
      } catch (error) {
        console.error('Submit error:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Complete Profile';
        showError(errorBanner, 'An error occurred. Please try again.');
      }
    });
  }

  function renderSuccess(container) {
    let countdown = 5;

    container.innerHTML = `
      <div class="ms-container">
        <div class="ms-form" style="text-align: center; padding: 48px 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">&#10003;</div>
          <h2 style="margin: 0 0 8px 0;">Profile Complete!</h2>
          <p style="color: #666; margin-bottom: 16px;">Your profile is now set up and ready to go.</p>
          <p style="color: #999; font-size: 14px;">Transferring you to your dashboard in <span id="countdown">${countdown}</span> seconds...</p>
          <a href="/profile/start" class="ms-btn" style="display: inline-block; text-decoration: none; margin-top: 16px;">Go to Dashboard Now</a>
        </div>
      </div>
    `;

    const countdownEl = container.querySelector('#countdown');
    const timer = setInterval(() => {
      countdown--;
      if (countdownEl) countdownEl.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(timer);
        window.location.href = '/profile/start';
      }
    }, 1000);
  }

  function renderCurrentStep(container) {
    switch (currentStep) {
      case 1: renderStep1(container); break;
      case 2: renderStep2(container); break;
      case 3: renderStep3(container); break;
      case 4: renderStep4(container); break;
      case 5: renderStep5(container); break;
    }
  }

  function showError(banner, message) {
    banner.textContent = message;
    banner.style.display = 'block';
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function renderNotLoggedIn(container) {
    container.innerHTML = `
      <div class="ms-container">
        <div class="ms-form">
          <div class="ms-error-banner" style="display: block;">
            Please log in to complete your profile.
          </div>
          <p style="text-align: center; margin-top: 20px;">
            <a href="/login" style="color: #333; font-weight: 600;">Log in</a>
          </p>
        </div>
      </div>
    `;
  }

  function renderAlreadyCompleted(container) {
    container.innerHTML = `
      <div class="ms-container">
        <div class="ms-form" style="text-align: center; padding: 48px 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">&#10003;</div>
          <h2 style="margin: 0 0 8px 0;">Profile Already Complete</h2>
          <p style="color: #666; margin-bottom: 24px;">You've already completed your profile setup.</p>
          <a href="/profile/start" class="ms-btn" style="display: inline-block; text-decoration: none;">Go to Dashboard</a>
        </div>
      </div>
    `;
  }

  function renderError(container, message) {
    container.innerHTML = `
      <div class="ms-container">
        <div class="ms-form">
          <div class="ms-error-banner" style="display: block;">${message}</div>
        </div>
      </div>
    `;
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async function init() {
    // Look for either container class
    const container = document.querySelector('.onboarding-form') || document.querySelector('.supabase-onboarding-container');
    if (!container) {
      console.warn('Could not find onboarding container (.onboarding-form or .supabase-onboarding-container)');
      return;
    }

    // Add styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Show loading
    container.innerHTML = '<div class="ms-loading">Loading...</div>';

    try {
      await waitForDependencies();

      // Initialize Supabase
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      const { data: member } = await window.$memberstackDom.getCurrentMember();

      if (!member) {
        renderNotLoggedIn(container);
        return;
      }

      memberData = member;

      // Check if already completed
      if (member.customFields?.['onboarding-complete'] === 'true') {
        renderAlreadyCompleted(container);
        return;
      }

      // Load categories from Supabase
      await loadCategories();

      // Start onboarding
      renderCurrentStep(container);

    } catch (error) {
      console.error('Init error:', error);
      renderError(container, 'Error loading onboarding. Please refresh the page.');
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
