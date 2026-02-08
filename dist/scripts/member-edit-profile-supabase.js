// Member Edit Profile Script - Supabase Version
// Single-page form for editing member profile information
// Uses Supabase for data storage and image uploads
// Replaces Memberstack JSON, Zapier, and Uploadcare

(function() {
  console.log('Member edit profile Supabase script loaded');

  // ============================================
  // CONFIGURATION
  // ============================================
  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH';
  const STORAGE_BUCKET = 'member-images';

  // Membership type classifications
  const BUSINESS_TYPES = ['small-business', 'large-business', 'not-for-profit', 'spaces-suppliers'];
  const SPACES_SUPPLIERS_TYPE = 'spaces-suppliers';
  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // ============================================
  // STATE
  // ============================================
  let supabase = null;
  let memberData = null;  // Memberstack data
  let supabaseMember = null;  // Supabase member record
  let categories = { directories: [], subDirectories: [], spaceCategories: [], supplierCategories: [] };
  let suburbs = [];
  let formData = {
    firstName: '',
    lastName: '',
    email: '',
    profileImageUrl: '',
    profileImageFile: null,
    featureImageUrl: '',
    featureImageFile: null,
    bio: '',
    businessName: '',
    suburb: null,
    businessAddress: '',
    displayAddress: false,
    openingHours: {
      monday: '', tuesday: '', wednesday: '', thursday: '',
      friday: '', saturday: '', sunday: ''
    },
    displayOpeningHours: false,
    spaceOrSupplier: null,
    chosenDirectories: [],
    spaceCategories: [],
    supplierCategories: [],
    website: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    tiktok: '',
    youtube: ''
  };

  // ============================================
  // STYLES
  // ============================================
  const styles = `
    .ep-container {
      font-family: inherit;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
    }
    .ep-form {
      background: #fff;
      border-radius: 8px;
      padding: 32px;
      border: 1px solid #e0e0e0;
    }
    @media (max-width: 600px) {
      .ep-form {
        padding: 24px 16px;
      }
    }
    .ep-section {
      margin-bottom: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid #e0e0e0;
    }
    .ep-section:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .ep-section-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }
    .ep-section-description {
      font-size: 14px;
      color: #666;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }
    .ep-form-field {
      margin-bottom: 20px;
    }
    .ep-form-field label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      text-align: left;
    }
    .ep-form-field label span.required {
      color: #dc3545;
    }
    .ep-form-field .ep-hint {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    .ep-form-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .ep-form-input:focus {
      outline: none;
      border-color: #333;
    }
    .ep-form-input.error {
      border-color: #dc3545;
    }
    .ep-form-input[readonly] {
      background: #f5f5f5;
      color: #666;
      cursor: not-allowed;
    }
    textarea.ep-form-input {
      min-height: 120px;
      resize: vertical;
    }
    .ep-image-upload {
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      position: relative;
    }
    .ep-image-upload:hover {
      border-color: #999;
      background: #fafafa;
    }
    .ep-image-upload.has-image {
      padding: 0;
      border-style: solid;
    }
    .ep-image-upload input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
    .ep-image-upload-text {
      color: #666;
      font-size: 14px;
    }
    .ep-image-upload-text strong {
      color: #333;
    }
    .ep-image-preview {
      width: 100%;
      max-height: 200px;
      object-fit: cover;
      border-radius: 6px;
    }
    .ep-image-preview.profile {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: 0 auto;
      display: block;
    }
    .ep-image-remove {
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
    .ep-image-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 600px) {
      .ep-image-row {
        grid-template-columns: 1fr;
      }
    }
    .ep-category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 8px;
    }
    .ep-category-item {
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
    .ep-category-item:hover {
      background: #f5f5f5;
    }
    .ep-category-item.selected {
      background: #333;
      color: #fff;
      border-color: #333;
    }
    .ep-category-item input {
      display: none;
    }
    .ep-radio-group {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }
    .ep-radio-item {
      flex: 1;
      padding: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    .ep-radio-item:hover {
      border-color: #999;
    }
    .ep-radio-item.selected {
      border-color: #333;
      background: #f5f5f5;
    }
    .ep-radio-item input {
      display: none;
    }
    .ep-radio-item-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }
    .ep-radio-item-desc {
      font-size: 12px;
      color: #666;
    }
    .ep-hours-grid {
      display: grid;
      gap: 12px;
    }
    .ep-hours-row {
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 12px;
      align-items: center;
    }
    .ep-hours-day {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    .ep-hours-input {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
    }
    .ep-toggle-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .ep-toggle-label {
      font-size: 14px;
      color: #333;
    }
    .ep-toggle {
      position: relative;
      width: 48px;
      height: 26px;
    }
    .ep-toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .ep-toggle-slider {
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
    .ep-toggle-slider:before {
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
    .ep-toggle input:checked + .ep-toggle-slider {
      background-color: #333;
    }
    .ep-toggle input:checked + .ep-toggle-slider:before {
      transform: translateX(22px);
    }
    .ep-links-grid {
      display: grid;
      gap: 16px;
    }
    .ep-link-field {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 12px;
      align-items: center;
    }
    .ep-link-label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    .ep-btn-row {
      display: flex;
      gap: 12px;
      margin-top: 32px;
    }
    .ep-btn {
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
    .ep-btn:hover {
      background: #555;
    }
    .ep-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .ep-btn-secondary {
      background: #fff;
      color: #333;
      border: 1px solid #333;
    }
    .ep-btn-secondary:hover {
      background: #f5f5f5;
    }
    .ep-loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .ep-error-banner {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .ep-success-banner {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
      text-align: center;
    }
    .ep-char-count {
      font-size: 12px;
      color: #666;
      text-align: right;
      margin-top: 4px;
    }
    .ep-selected-count {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }
    .ep-parent-categories {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
    .ep-parent-btn {
      padding: 8px 16px;
      border: 1px solid #333;
      border-radius: 20px;
      background: #fff;
      color: #333;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }
    .ep-parent-btn:hover {
      background: #f5f5f5;
    }
    .ep-parent-btn.active {
      background: #333;
      color: #fff;
    }
    .ep-child-categories {
      display: none;
      flex-wrap: wrap;
      gap: 8px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      margin-top: 12px;
    }
    .ep-child-categories.visible {
      display: flex;
    }
    .ep-child-btn {
      padding: 6px 14px;
      border: 1px solid #ddd;
      border-radius: 16px;
      background: #fff;
      color: #333;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
    }
    .ep-child-btn:hover {
      border-color: #999;
    }
    .ep-child-btn.selected {
      border-color: #007bff;
      color: #007bff;
    }
    .ep-selected-categories {
      margin-top: 16px;
      padding: 12px;
      background: #f0f0f0;
      border-radius: 8px;
    }
    .ep-selected-categories h5 {
      margin: 0 0 8px 0;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
    }
    .ep-selected-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .ep-selected-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #333;
      color: #fff;
      border-radius: 12px;
      font-size: 12px;
    }
    .ep-selected-tag button {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 0;
      font-size: 14px;
      line-height: 1;
    }
    .ep-field-error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }
    .ep-suburb-search {
      position: relative;
    }
    .ep-suburb-dropdown {
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
    .ep-suburb-dropdown.visible {
      display: block;
    }
    .ep-suburb-option {
      padding: 10px 14px;
      cursor: pointer;
      font-size: 14px;
    }
    .ep-suburb-option:hover {
      background: #f5f5f5;
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
          reject(new Error('Dependencies not loaded'));
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
      return { valid: false, error: 'Please enter a full website URL' };
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

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // SUPABASE OPERATIONS
  // ============================================

  async function loadCategories() {
    try {
      const { data: directories } = await supabase
        .from('directories')
        .select('id, name, slug')
        .order('display_order');

      const { data: subDirectories } = await supabase
        .from('sub_directories')
        .select('id, name, slug, directory_id')
        .order('name');

      const { data: spaceCategories } = await supabase
        .from('creative_space_categories')
        .select('id, name, slug')
        .order('name');

      const { data: supplierCategories } = await supabase
        .from('supplier_categories')
        .select('id, name, slug')
        .order('name');

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

  async function loadAllSuburbs() {
    try {
      const { data, error } = await supabase
        .from('suburbs')
        .select('id, name, state')
        .order('name');

      if (error) throw error;

      suburbs = data || [];
      return suburbs;
    } catch (error) {
      console.error('Error loading suburbs:', error);
      return [];
    }
  }

  async function loadMemberData(memberstackId) {
    try {
      // Load member with suburb
      const { data: member, error } = await supabase
        .from('members')
        .select(`
          *,
          suburbs (id, name, state)
        `)
        .eq('memberstack_id', memberstackId)
        .single();

      if (error) throw error;
      if (!member) return null;

      supabaseMember = member;

      // Load member's sub-directories
      const { data: memberSubDirs } = await supabase
        .from('member_sub_directories')
        .select('sub_directory_id')
        .eq('member_id', member.id);

      // Load member's space categories
      const { data: memberSpaceCats } = await supabase
        .from('member_space_categories')
        .select('space_category_id')
        .eq('member_id', member.id);

      // Load member's supplier categories
      const { data: memberSupplierCats } = await supabase
        .from('member_supplier_categories')
        .select('supplier_category_id')
        .eq('member_id', member.id);

      // Populate formData
      formData.firstName = member.first_name || '';
      formData.lastName = member.last_name || '';
      formData.email = member.email || '';
      formData.profileImageUrl = member.profile_image_url || '';
      formData.featureImageUrl = member.header_image_url || '';
      formData.bio = member.bio || '';
      formData.businessName = member.business_name || '';
      formData.businessAddress = member.business_address || '';
      formData.displayAddress = member.show_address || false;
      formData.displayOpeningHours = member.show_opening_hours || false;

      // Suburb
      if (member.suburbs) {
        formData.suburb = {
          id: member.suburbs.id,
          name: member.suburbs.name
        };
      }

      // Opening hours
      DAYS_OF_WEEK.forEach(day => {
        formData.openingHours[day.toLowerCase()] = member[`opening_${day.toLowerCase()}`] || '';
      });

      // Space/Supplier type
      if (member.is_creative_space) {
        formData.spaceOrSupplier = 'space';
      } else if (member.is_supplier) {
        formData.spaceOrSupplier = 'supplier';
      }

      // Categories
      formData.chosenDirectories = (memberSubDirs || []).map(d => d.sub_directory_id);
      formData.spaceCategories = (memberSpaceCats || []).map(c => c.space_category_id);
      formData.supplierCategories = (memberSupplierCats || []).map(c => c.supplier_category_id);

      // Links
      formData.website = member.website || '';
      formData.instagram = member.instagram || '';
      formData.facebook = member.facebook || '';
      formData.linkedin = member.linkedin || '';
      formData.tiktok = member.tiktok || '';
      formData.youtube = member.youtube || '';

      return member;
    } catch (error) {
      console.error('Error loading member data:', error);
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

  async function saveProfile() {
    const memberstackId = memberData.id;

    try {
      // Upload new images if we have files
      let profileImageUrl = formData.profileImageUrl;
      let featureImageUrl = formData.featureImageUrl;

      if (formData.profileImageFile) {
        profileImageUrl = await uploadImage(formData.profileImageFile, memberstackId, 'profile');
      }

      if (formData.featureImageFile) {
        featureImageUrl = await uploadImage(formData.featureImageFile, memberstackId, 'feature');
      }

      // Generate slug
      const displayName = formData.businessName || `${formData.firstName} ${formData.lastName}`.trim();
      const slug = displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      // Build update data
      const updateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        name: displayName,
        slug: slug,
        profile_image_url: profileImageUrl,
        header_image_url: featureImageUrl,
        bio: formData.bio,
        business_name: formData.businessName || null,
        suburb_id: formData.suburb?.id || null,
        show_address: formData.displayAddress,
        show_opening_hours: formData.displayOpeningHours,
        opening_monday: formData.openingHours.monday || null,
        opening_tuesday: formData.openingHours.tuesday || null,
        opening_wednesday: formData.openingHours.wednesday || null,
        opening_thursday: formData.openingHours.thursday || null,
        opening_friday: formData.openingHours.friday || null,
        opening_saturday: formData.openingHours.saturday || null,
        opening_sunday: formData.openingHours.sunday || null,
        website: formData.website || null,
        instagram: formData.instagram || null,
        facebook: formData.facebook || null,
        linkedin: formData.linkedin || null,
        tiktok: formData.tiktok || null,
        youtube: formData.youtube || null,
        is_creative_space: formData.spaceOrSupplier === 'space',
        is_supplier: formData.spaceOrSupplier === 'supplier'
      };

      // Update member
      const { error: updateError } = await supabase
        .from('members')
        .update(updateData)
        .eq('memberstack_id', memberstackId);

      if (updateError) throw updateError;

      // Update category associations
      const memberId = supabaseMember.id;

      // Delete existing
      await supabase.from('member_sub_directories').delete().eq('member_id', memberId);
      await supabase.from('member_space_categories').delete().eq('member_id', memberId);
      await supabase.from('member_supplier_categories').delete().eq('member_id', memberId);

      // Insert new sub-directories
      if (formData.chosenDirectories.length > 0) {
        const inserts = formData.chosenDirectories.map(subDirId => ({
          member_id: memberId,
          sub_directory_id: subDirId
        }));
        await supabase.from('member_sub_directories').insert(inserts);
      }

      // Insert space categories
      if (formData.spaceCategories.length > 0) {
        const inserts = formData.spaceCategories.map(catId => ({
          member_id: memberId,
          space_category_id: catId
        }));
        await supabase.from('member_space_categories').insert(inserts);
      }

      // Insert supplier categories
      if (formData.supplierCategories.length > 0) {
        const inserts = formData.supplierCategories.map(catId => ({
          member_id: memberId,
          supplier_category_id: catId
        }));
        await supabase.from('member_supplier_categories').insert(inserts);
      }

      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  function renderEditForm(container) {
    const membershipType = memberData?.customFields?.['membership-type'];
    const isBusinessMember = isBusinessType(membershipType);
    const isSpaceSupplier = isSpacesSuppliers(membershipType);

    container.innerHTML = `
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" id="ep-error-banner" style="display: none;"></div>
          <div class="ep-success-banner" id="ep-success-banner" style="display: none;"></div>

          ${renderAboutYouSection()}
          ${isBusinessMember ? renderBusinessDetailsSection() : ''}
          ${renderCategoriesSection(isSpaceSupplier)}
          ${renderLinksSection()}

          <div class="ep-btn-row">
            <a href="/profile/start" class="ep-btn ep-btn-secondary" style="text-decoration: none; text-align: center;">Cancel</a>
            <button type="button" class="ep-btn" id="ep-save-btn">Save Changes</button>
          </div>
        </div>
      </div>
    `;

    setupFormHandlers(container, isBusinessMember, isSpaceSupplier);
  }

  function renderAboutYouSection() {
    return `
      <div class="ep-section">
        <h3 class="ep-section-title">About You</h3>
        <p class="ep-section-description">Basic information about you and your creative practice.</p>

        <div class="ep-image-row">
          <div class="ep-form-field">
            <label>Profile Image <span class="required">*</span></label>
            <div class="ep-image-upload" id="profile-upload">
              ${formData.profileImageUrl
                ? `<img src="${formData.profileImageUrl}" class="ep-image-preview profile" alt="Profile preview">
                   <button type="button" class="ep-image-remove" data-remove="profile">&times;</button>`
                : `<input type="file" accept="image/*" id="profile-file-input">
                   <div class="ep-image-upload-text">
                    <strong>Click to upload</strong><br>
                    Square image recommended
                  </div>`
              }
            </div>
            <div class="ep-hint">This will be your profile photo</div>
          </div>

          <div class="ep-form-field">
            <label>Feature Image <span class="required">*</span></label>
            <div class="ep-image-upload" id="feature-upload">
              ${formData.featureImageUrl
                ? `<img src="${formData.featureImageUrl}" class="ep-image-preview" alt="Feature preview">
                   <button type="button" class="ep-image-remove" data-remove="feature">&times;</button>`
                : `<input type="file" accept="image/*" id="feature-file-input">
                   <div class="ep-image-upload-text">
                    <strong>Click to upload</strong><br>
                    Landscape image recommended
                  </div>`
              }
            </div>
            <div class="ep-hint">This appears as the header on your profile page</div>
          </div>
        </div>

        <div class="ep-form-field">
          <label>First Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-first-name" value="${escapeHtml(formData.firstName)}" placeholder="Enter your first name">
        </div>

        <div class="ep-form-field">
          <label>Last Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-last-name" value="${escapeHtml(formData.lastName)}" placeholder="Enter your last name">
        </div>

        <div class="ep-form-field">
          <label>Email Address</label>
          <input type="email" class="ep-form-input" id="ep-email" value="${escapeHtml(formData.email)}" readonly>
          <div class="ep-hint">Email cannot be changed here. Contact support if you need to update it.</div>
        </div>

        <div class="ep-form-field">
          <label>Location <span class="required">*</span></label>
          <select class="ep-form-input" id="ep-suburb-select">
            <option value="">Select your suburb...</option>
            ${suburbs.map(s => `<option value="${s.id}" ${formData.suburb?.id === s.id ? 'selected' : ''}>${s.name}, ${s.state}</option>`).join('')}
          </select>
        </div>

        <div class="ep-form-field">
          <label>Public Bio <span class="required">*</span></label>
          <textarea class="ep-form-input" id="ep-bio" maxlength="2000" placeholder="Tell us about your creative practice, skills, and what you offer...">${escapeHtml(formData.bio)}</textarea>
          <div class="ep-char-count"><span id="ep-bio-count">${formData.bio.length}</span> / 2000 characters</div>
        </div>
      </div>
    `;
  }

  function renderBusinessDetailsSection() {
    return `
      <div class="ep-section">
        <h3 class="ep-section-title">Business Details</h3>
        <p class="ep-section-description">Information about your business or organization.</p>

        <div class="ep-form-field">
          <label>Business / Trading Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-business-name" value="${escapeHtml(formData.businessName)}" placeholder="Enter your business or trading name">
        </div>

        <div class="ep-form-field">
          <label>Business Address</label>
          <input type="text" class="ep-form-input" id="ep-address" value="${escapeHtml(formData.businessAddress)}" placeholder="Enter your business address">
          <div class="ep-hint">This is where customers can find you</div>
        </div>

        <div class="ep-toggle-field">
          <span class="ep-toggle-label">Display address publicly on my profile</span>
          <label class="ep-toggle">
            <input type="checkbox" id="ep-display-address" ${formData.displayAddress ? 'checked' : ''}>
            <span class="ep-toggle-slider"></span>
          </label>
        </div>

        <div class="ep-form-field">
          <label>Opening Hours</label>
          <div class="ep-hours-grid">
            ${DAYS_OF_WEEK.map(day => `
              <div class="ep-hours-row">
                <span class="ep-hours-day">${day}</span>
                <input type="text" class="ep-hours-input" id="ep-hours-${day.toLowerCase()}"
                  value="${escapeHtml(formData.openingHours[day.toLowerCase()])}"
                  placeholder="e.g., 9am - 5pm or Closed">
              </div>
            `).join('')}
          </div>
        </div>

        <div class="ep-toggle-field">
          <span class="ep-toggle-label">Display opening hours publicly on my profile</span>
          <label class="ep-toggle">
            <input type="checkbox" id="ep-display-hours" ${formData.displayOpeningHours ? 'checked' : ''}>
            <span class="ep-toggle-slider"></span>
          </label>
        </div>
      </div>
    `;
  }

  function renderCategoriesSection(isSpaceSupplier) {
    return `
      <div class="ep-section">
        <h3 class="ep-section-title">Categories</h3>
        <p class="ep-section-description">Select the categories that best describe your work.</p>

        <div id="categories-container">
          ${isSpaceSupplier ? renderSpaceSupplierSelector() : renderDirectoriesSelector()}
        </div>
      </div>
    `;
  }

  function renderSpaceSupplierSelector() {
    return `
      <div class="ep-form-field">
        <label>What type of listing are you? <span class="required">*</span></label>
        <div class="ep-radio-group">
          <label class="ep-radio-item ${formData.spaceOrSupplier === 'space' ? 'selected' : ''}" id="radio-space">
            <input type="radio" name="space-supplier" value="space" ${formData.spaceOrSupplier === 'space' ? 'checked' : ''}>
            <div class="ep-radio-item-title">Creative Space</div>
            <div class="ep-radio-item-desc">Studios, venues, galleries, etc.</div>
          </label>
          <label class="ep-radio-item ${formData.spaceOrSupplier === 'supplier' ? 'selected' : ''}" id="radio-supplier">
            <input type="radio" name="space-supplier" value="supplier" ${formData.spaceOrSupplier === 'supplier' ? 'checked' : ''}>
            <div class="ep-radio-item-title">Supplier</div>
            <div class="ep-radio-item-desc">Materials, services, equipment, etc.</div>
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
    let html = '<div class="ep-category-section"><div style="font-weight:600;margin-bottom:12px;">Select Space Categories</div><div class="ep-category-grid">';
    categories.spaceCategories.forEach(cat => {
      const selected = formData.spaceCategories.includes(cat.id);
      html += `
        <label class="ep-category-item ${selected ? 'selected' : ''}" data-id="${cat.id}">
          <input type="checkbox" value="${cat.id}" ${selected ? 'checked' : ''}>
          ${cat.name}
        </label>
      `;
    });
    html += '</div><div class="ep-selected-count"><span id="space-count">' + formData.spaceCategories.length + '</span> selected</div></div>';
    return html;
  }

  function renderSupplierCategories() {
    let html = '<div class="ep-category-section"><div style="font-weight:600;margin-bottom:12px;">Select Supplier Categories</div><div class="ep-category-grid">';
    categories.supplierCategories.forEach(cat => {
      const selected = formData.supplierCategories.includes(cat.id);
      html += `
        <label class="ep-category-item ${selected ? 'selected' : ''}" data-id="${cat.id}">
          <input type="checkbox" value="${cat.id}" ${selected ? 'checked' : ''}>
          ${cat.name}
        </label>
      `;
    });
    html += '</div><div class="ep-selected-count"><span id="supplier-count">' + formData.supplierCategories.length + '</span> selected</div></div>';
    return html;
  }

  function getCategoryName(id) {
    const dir = categories.subDirectories.find(d => d.id === id);
    return dir ? dir.name : id;
  }

  function renderDirectoriesSelector() {
    let html = '<div class="ep-category-selector">';

    // Parent category buttons
    html += '<div class="ep-parent-categories">';
    categories.directories.forEach(parent => {
      html += `<button type="button" class="ep-parent-btn" data-parent="${parent.id}">${parent.name}</button>`;
    });
    html += '</div>';

    // Child category containers
    categories.directories.forEach(parent => {
      const subDirs = categories.subDirectories.filter(d => d.directory_id === parent.id);
      html += `<div class="ep-child-categories" data-parent="${parent.id}">`;
      subDirs.forEach(dir => {
        const isSelected = formData.chosenDirectories.includes(dir.id);
        html += `<button type="button" class="ep-child-btn ${isSelected ? 'selected' : ''}" data-id="${dir.id}">${dir.name}</button>`;
      });
      html += '</div>';
    });

    // Selected categories display
    html += `
      <div class="ep-selected-categories" id="ep-selected-section" style="${formData.chosenDirectories.length ? '' : 'display: none;'}">
        <h5>Selected Categories</h5>
        <div class="ep-selected-list" id="ep-selected-list"></div>
      </div>
    </div>`;

    return html;
  }

  function renderLinksSection() {
    return `
      <div class="ep-section">
        <h3 class="ep-section-title">External Links</h3>
        <p class="ep-section-description">Add your website and social media links. All fields are optional.</p>

        <div class="ep-links-grid">
          <div class="ep-link-field">
            <span class="ep-link-label">Website</span>
            <input type="url" class="ep-form-input" id="ep-website" value="${escapeHtml(formData.website)}" placeholder="https://yourwebsite.com">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">Instagram</span>
            <input type="url" class="ep-form-input" id="ep-instagram" value="${escapeHtml(formData.instagram)}" placeholder="https://instagram.com/username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">Facebook</span>
            <input type="url" class="ep-form-input" id="ep-facebook" value="${escapeHtml(formData.facebook)}" placeholder="https://facebook.com/page">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">LinkedIn</span>
            <input type="url" class="ep-form-input" id="ep-linkedin" value="${escapeHtml(formData.linkedin)}" placeholder="https://linkedin.com/in/username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">TikTok</span>
            <input type="url" class="ep-form-input" id="ep-tiktok" value="${escapeHtml(formData.tiktok)}" placeholder="https://tiktok.com/@username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">YouTube</span>
            <input type="url" class="ep-form-input" id="ep-youtube" value="${escapeHtml(formData.youtube)}" placeholder="https://youtube.com/channel">
          </div>
        </div>
      </div>
    `;
  }

  // ============================================
  // SETUP HANDLERS
  // ============================================

  function setupFormHandlers(container, isBusinessMember, isSpaceSupplier) {
    const errorBanner = container.querySelector('#ep-error-banner');
    const successBanner = container.querySelector('#ep-success-banner');
    const saveBtn = container.querySelector('#ep-save-btn');

    setupAboutYouHandlers(container);

    if (isBusinessMember) {
      setupBusinessDetailsHandlers(container);
    }

    setupCategoriesHandlers(container, isSpaceSupplier);
    setupLinksHandlers(container);

    saveBtn.addEventListener('click', async () => {
      errorBanner.style.display = 'none';
      successBanner.style.display = 'none';

      // Validate
      if (!formData.firstName.trim()) {
        showError(errorBanner, 'Please enter your first name');
        return;
      }
      if (!formData.lastName.trim()) {
        showError(errorBanner, 'Please enter your last name');
        return;
      }
      if (!formData.profileImageUrl) {
        showError(errorBanner, 'Please upload a profile image');
        return;
      }
      if (!formData.featureImageUrl) {
        showError(errorBanner, 'Please upload a feature image');
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

      if (isBusinessMember && !formData.businessName.trim()) {
        showError(errorBanner, 'Please enter your business name');
        return;
      }

      if (isSpaceSupplier) {
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
      } else {
        if (formData.chosenDirectories.length === 0) {
          showError(errorBanner, 'Please select at least one category');
          return;
        }
      }

      const linkErrors = validateSocialLinks();
      if (linkErrors.length > 0) {
        linkErrors.forEach(({ platform, error }) => {
          const input = container.querySelector(`#ep-${platform}`);
          const field = input.closest('.ep-link-field');
          let errorEl = field.querySelector('.ep-field-error');
          if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'ep-field-error';
            field.appendChild(errorEl);
          }
          input.classList.add('error');
          errorEl.textContent = error;
        });
        showError(errorBanner, 'Please fix the highlighted fields before saving');
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      try {
        await saveProfile();
        successBanner.textContent = 'Profile updated successfully!';
        successBanner.style.display = 'block';
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        saveBtn.textContent = 'Save Changes';
        saveBtn.disabled = false;
      } catch (error) {
        console.error('Save error:', error);
        showError(errorBanner, 'An error occurred while saving. Please try again.');
        saveBtn.textContent = 'Save Changes';
        saveBtn.disabled = false;
      }
    });
  }

  function setupAboutYouHandlers(container) {
    const firstNameInput = container.querySelector('#ep-first-name');
    const lastNameInput = container.querySelector('#ep-last-name');
    const bioInput = container.querySelector('#ep-bio');
    const bioCount = container.querySelector('#ep-bio-count');
    const suburbSelect = container.querySelector('#ep-suburb-select');

    firstNameInput.addEventListener('input', () => {
      formData.firstName = firstNameInput.value;
    });

    lastNameInput.addEventListener('input', () => {
      formData.lastName = lastNameInput.value;
    });

    bioInput.addEventListener('input', () => {
      formData.bio = bioInput.value;
      bioCount.textContent = bioInput.value.length;
    });

    // Suburb dropdown
    suburbSelect.addEventListener('change', () => {
      const selectedOption = suburbSelect.options[suburbSelect.selectedIndex];
      if (selectedOption.value) {
        formData.suburb = {
          id: selectedOption.value,
          name: selectedOption.text.split(',')[0].trim()
        };
      } else {
        formData.suburb = null;
      }
    });

    // Image uploads
    setupImageUploadHandlers(container);
  }

  function setupImageUploadHandlers(container) {
    const profileUpload = container.querySelector('#profile-upload');
    const featureUpload = container.querySelector('#feature-upload');

    function renderProfileState() {
      if (formData.profileImageUrl) {
        profileUpload.innerHTML = `
          <img src="${formData.profileImageUrl}" class="ep-image-preview profile" alt="Profile preview">
          <button type="button" class="ep-image-remove" data-remove="profile">&times;</button>
        `;
        profileUpload.classList.add('has-image');
      } else {
        profileUpload.innerHTML = `
          <input type="file" accept="image/*" id="profile-file-input">
          <div class="ep-image-upload-text">
            <strong>Click to upload</strong><br>
            Square image recommended
          </div>
        `;
        profileUpload.classList.remove('has-image');
        const input = profileUpload.querySelector('#profile-file-input');
        input.addEventListener('change', handleProfileFileSelect);
      }
    }

    function renderFeatureState() {
      if (formData.featureImageUrl) {
        featureUpload.innerHTML = `
          <img src="${formData.featureImageUrl}" class="ep-image-preview" alt="Feature preview">
          <button type="button" class="ep-image-remove" data-remove="feature">&times;</button>
        `;
        featureUpload.classList.add('has-image');
      } else {
        featureUpload.innerHTML = `
          <input type="file" accept="image/*" id="feature-file-input">
          <div class="ep-image-upload-text">
            <strong>Click to upload</strong><br>
            Landscape image recommended
          </div>
        `;
        featureUpload.classList.remove('has-image');
        const input = featureUpload.querySelector('#feature-file-input');
        input.addEventListener('change', handleFeatureFileSelect);
      }
    }

    function handleProfileFileSelect(e) {
      const file = e.target.files[0];
      if (file) {
        formData.profileImageFile = file;
        formData.profileImageUrl = URL.createObjectURL(file);
        renderProfileState();
      }
    }

    function handleFeatureFileSelect(e) {
      const file = e.target.files[0];
      if (file) {
        formData.featureImageFile = file;
        formData.featureImageUrl = URL.createObjectURL(file);
        renderFeatureState();
      }
    }

    // Initial file input listeners
    const profileInput = profileUpload.querySelector('#profile-file-input');
    const featureInput = featureUpload.querySelector('#feature-file-input');
    if (profileInput) profileInput.addEventListener('change', handleProfileFileSelect);
    if (featureInput) featureInput.addEventListener('change', handleFeatureFileSelect);

    // Remove button handlers
    profileUpload.addEventListener('click', (e) => {
      if (e.target.dataset.remove === 'profile') {
        e.stopPropagation();
        formData.profileImageUrl = '';
        formData.profileImageFile = null;
        renderProfileState();
      }
    });

    featureUpload.addEventListener('click', (e) => {
      if (e.target.dataset.remove === 'feature') {
        e.stopPropagation();
        formData.featureImageUrl = '';
        formData.featureImageFile = null;
        renderFeatureState();
      }
    });
  }

  function setupBusinessDetailsHandlers(container) {
    const businessNameInput = container.querySelector('#ep-business-name');
    const addressInput = container.querySelector('#ep-address');
    const displayAddressToggle = container.querySelector('#ep-display-address');
    const displayHoursToggle = container.querySelector('#ep-display-hours');

    if (businessNameInput) {
      businessNameInput.addEventListener('input', () => {
        formData.businessName = businessNameInput.value;
      });
    }

    if (addressInput) {
      addressInput.addEventListener('input', () => {
        formData.businessAddress = addressInput.value;
      });
    }

    if (displayAddressToggle) {
      displayAddressToggle.addEventListener('change', () => {
        formData.displayAddress = displayAddressToggle.checked;
      });
    }

    if (displayHoursToggle) {
      displayHoursToggle.addEventListener('change', () => {
        formData.displayOpeningHours = displayHoursToggle.checked;
      });
    }

    DAYS_OF_WEEK.forEach(day => {
      const input = container.querySelector(`#ep-hours-${day.toLowerCase()}`);
      if (input) {
        input.addEventListener('input', () => {
          formData.openingHours[day.toLowerCase()] = input.value;
        });
      }
    });
  }

  function setupCategoriesHandlers(container, isSpaceSupplier) {
    if (isSpaceSupplier) {
      const radioSpace = container.querySelector('#radio-space');
      const radioSupplier = container.querySelector('#radio-supplier');
      const categoriesContainer = container.querySelector('#space-supplier-categories');

      if (radioSpace) {
        radioSpace.addEventListener('click', () => {
          formData.spaceOrSupplier = 'space';
          formData.supplierCategories = [];
          radioSpace.classList.add('selected');
          radioSupplier.classList.remove('selected');
          categoriesContainer.innerHTML = renderSpaceCategories();
          categoriesContainer.style.display = 'block';
          setupCategoryCheckboxes(container, 'spaceCategories', 'space-count');
        });
      }

      if (radioSupplier) {
        radioSupplier.addEventListener('click', () => {
          formData.spaceOrSupplier = 'supplier';
          formData.spaceCategories = [];
          radioSupplier.classList.add('selected');
          radioSpace.classList.remove('selected');
          categoriesContainer.innerHTML = renderSupplierCategories();
          categoriesContainer.style.display = 'block';
          setupCategoryCheckboxes(container, 'supplierCategories', 'supplier-count');
        });
      }

      if (formData.spaceOrSupplier === 'space') {
        setupCategoryCheckboxes(container, 'spaceCategories', 'space-count');
      } else if (formData.spaceOrSupplier === 'supplier') {
        setupCategoryCheckboxes(container, 'supplierCategories', 'supplier-count');
      }
    } else {
      setupDirectoryCategorySelector(container);
    }
  }

  function setupDirectoryCategorySelector(container) {
    const parentBtns = container.querySelectorAll('.ep-parent-btn');
    const childContainers = container.querySelectorAll('.ep-child-categories');
    const selectedList = container.querySelector('#ep-selected-list');
    const selectedSection = container.querySelector('#ep-selected-section');

    function updateSelectedDisplay() {
      if (!selectedList || !selectedSection) return;

      selectedList.innerHTML = formData.chosenDirectories.map(id => {
        const name = getCategoryName(id);
        return `<span class="ep-selected-tag">${name}<button type="button" data-id="${id}">&times;</button></span>`;
      }).join('');

      selectedSection.style.display = formData.chosenDirectories.length ? '' : 'none';

      container.querySelectorAll('.ep-child-btn').forEach(btn => {
        const id = btn.dataset.id;
        btn.classList.toggle('selected', formData.chosenDirectories.includes(id));
      });
    }

    updateSelectedDisplay();

    parentBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const parentId = btn.dataset.parent;
        const isActive = btn.classList.contains('active');

        parentBtns.forEach(b => b.classList.remove('active'));
        childContainers.forEach(c => c.classList.remove('visible'));

        if (!isActive) {
          btn.classList.add('active');
          container.querySelector(`.ep-child-categories[data-parent="${parentId}"]`).classList.add('visible');
        }
      });
    });

    container.querySelectorAll('.ep-child-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const index = formData.chosenDirectories.indexOf(id);

        if (index === -1) {
          formData.chosenDirectories.push(id);
        } else {
          formData.chosenDirectories.splice(index, 1);
        }

        updateSelectedDisplay();
      });
    });

    if (selectedList) {
      selectedList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          const id = e.target.dataset.id;
          const index = formData.chosenDirectories.indexOf(id);
          if (index !== -1) {
            formData.chosenDirectories.splice(index, 1);
            updateSelectedDisplay();
          }
        }
      });
    }
  }

  function setupCategoryCheckboxes(container, dataKey, countId) {
    container.querySelectorAll('.ep-category-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const id = item.dataset.id;
        if (!id) return;

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
      });
    });
  }

  function setupLinksHandlers(container) {
    const linkInputs = ['website', 'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube'];

    linkInputs.forEach(platform => {
      const input = container.querySelector(`#ep-${platform}`);
      if (!input) return;

      const field = input.closest('.ep-link-field');

      let errorEl = field.querySelector('.ep-field-error');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'ep-field-error';
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
  }

  function showError(banner, message) {
    banner.textContent = message;
    banner.style.display = 'block';
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function renderNotLoggedIn(container) {
    container.innerHTML = `
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" style="display: block;">
            Please log in to edit your profile.
          </div>
          <p style="text-align: center; margin-top: 20px;">
            <a href="/login" style="color: #333; font-weight: 600;">Log in</a>
          </p>
        </div>
      </div>
    `;
  }

  function renderError(container, message) {
    container.innerHTML = `
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" style="display: block;">${message}</div>
        </div>
      </div>
    `;
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async function init() {
    const container = document.querySelector('.all-types-profile-edit') || document.querySelector('.supabase-edit-profile-container');
    if (!container) {
      console.warn('Could not find edit profile container');
      return;
    }

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    container.innerHTML = '<div class="ep-loading">Loading your profile...</div>';

    try {
      await waitForDependencies();

      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      const { data: member } = await window.$memberstackDom.getCurrentMember();

      if (!member) {
        renderNotLoggedIn(container);
        return;
      }

      memberData = member;

      // Load categories and suburbs
      await loadCategories();
      await loadAllSuburbs();

      // Load member data from Supabase
      await loadMemberData(member.id);

      // Render form
      renderEditForm(container);

    } catch (error) {
      console.error('Init error:', error);
      renderError(container, 'Error loading profile. Please refresh the page.');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
