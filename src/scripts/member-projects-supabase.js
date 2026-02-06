// Member Projects Supabase Script
// Manages member projects using Supabase as the data store
// Replaces Memberstack JSON, Zapier, and Uploadcare with Supabase

(function() {
  console.log('Member projects Supabase script loaded');

  // ============================================
  // CONFIGURATION
  // ============================================
  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH';
  const STORAGE_BUCKET = 'project-images';
  const MAX_GALLERY_IMAGES = 20;

  // Project limits by membership type
  const PROJECT_LIMITS = {
    'emerging': 2,
    'professional': 5,
    'small-business': 5,
    'not-for-profit': 5,
    'large-business': 8,
    'spaces-suppliers': 5
  };

  // ============================================
  // STATE
  // ============================================
  let supabase = null;
  let currentMember = null;
  let projects = [];
  let categories = { directories: [], subDirectories: [] };

  // ============================================
  // STYLES
  // ============================================
  const styles = `
    .mp-container {
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      overflow-x: visible;
    }
    .mp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .mp-header h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
    .mp-header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .mp-project-count {
      font-size: 14px;
      color: #666;
    }
    .mp-btn-disabled {
      background: #ccc !important;
      cursor: not-allowed !important;
    }
    .mp-btn-disabled:hover {
      background: #ccc !important;
    }
    .mp-btn {
      background: #333;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .mp-btn:hover {
      background: #555;
    }
    .mp-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .mp-btn-secondary {
      background: #fff;
      color: #333;
      border: 1px solid #ddd;
    }
    .mp-btn-secondary:hover {
      background: #f5f5f5;
    }
    .mp-btn-danger {
      background: #dc3545;
    }
    .mp-btn-danger:hover {
      background: #c82333;
    }
    .mp-btn-small {
      padding: 6px 12px;
      font-size: 12px;
    }
    .mp-loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    .mp-empty {
      text-align: center;
      padding: 40px;
      background: #f9f9f9;
      border-radius: 8px;
      border: 2px dashed #ddd;
    }
    .mp-empty p {
      margin: 0 0 16px 0;
      color: #666;
    }
    .mp-project-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 12px;
      background: #fff;
      overflow: hidden;
    }
    .mp-project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
    }
    .mp-project-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .mp-project-header-left:hover .mp-project-title {
      color: #555;
    }
    .mp-project-header-actions {
      display: flex;
      gap: 8px;
    }
    .mp-toggle-icon {
      font-size: 10px;
      color: #999;
      transition: transform 0.2s;
    }
    .mp-toggle-icon.open {
      transform: rotate(90deg);
    }
    .mp-project-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    .mp-project-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s ease-out;
      border-top: 0 solid #e0e0e0;
    }
    .mp-project-content.open {
      max-height: 2000px;
      border-top-width: 1px;
    }
    .mp-project-fields {
      padding: 20px;
    }
    .mp-field {
      margin-bottom: 16px;
    }
    .mp-field:last-child {
      margin-bottom: 0;
    }
    .mp-field-label {
      font-size: 12px;
      font-weight: 600;
      color: #666;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .mp-field-value {
      padding: 8px 12px;
      background: #f5f5f5;
      border-radius: 4px;
      min-height: 20px;
      color: #333;
    }
    .mp-field-value.empty {
      color: #999;
      font-style: italic;
    }
    .mp-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    .mp-modal {
      background: #fff;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .mp-modal-header {
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
    }
    .mp-modal-header h3 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }
    .mp-modal-body {
      padding: 20px;
    }
    .mp-modal-footer {
      padding: 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    .mp-form-field {
      margin-bottom: 20px;
    }
    .mp-form-field label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
    }
    .mp-form-field label span {
      color: #dc3545;
    }
    .mp-form-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
    }
    .mp-form-input:focus {
      outline: none;
      border-color: #333;
    }
    textarea.mp-form-input {
      min-height: 80px;
      resize: vertical;
    }
    .mp-form-input.error {
      border-color: #dc3545;
    }
    .mp-form-input.valid {
      border-color: #28a745;
    }
    .mp-input-hint {
      font-size: 11px;
      color: #666;
      margin-top: 4px;
    }
    .mp-input-error {
      font-size: 11px;
      color: #dc3545;
      margin-top: 4px;
      display: none;
    }
    .mp-input-error.visible {
      display: block;
    }

    /* Category Selector Styles */
    .mp-category-section {
      margin-bottom: 20px;
    }
    .mp-category-section h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
    .mp-parent-categories {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
    .mp-parent-btn {
      padding: 8px 16px;
      border: 1px solid #333;
      border-radius: 20px;
      background: #fff;
      color: #333;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .mp-parent-btn:hover {
      background: #f5f5f5;
    }
    .mp-parent-btn.active {
      background: #333;
      color: #fff;
    }
    .mp-child-categories {
      display: none;
      flex-wrap: wrap;
      gap: 8px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      margin-top: 12px;
    }
    .mp-child-categories.visible {
      display: flex;
    }
    .mp-child-btn {
      padding: 6px 14px;
      border: 1px solid #ddd;
      border-radius: 16px;
      background: #fff;
      color: #666;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .mp-child-btn:hover {
      border-color: #333;
      color: #333;
    }
    .mp-child-btn.selected {
      background: #e8f4fc;
      border-color: #007bff;
      color: #007bff;
    }
    .mp-selected-categories {
      margin-top: 16px;
      padding: 12px;
      background: #f0f0f0;
      border-radius: 8px;
    }
    .mp-selected-categories h5 {
      margin: 0 0 8px 0;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
    }
    .mp-selected-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .mp-selected-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #333;
      color: #fff;
      border-radius: 12px;
      font-size: 12px;
    }
    .mp-selected-tag button {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 0;
      font-size: 14px;
      line-height: 1;
    }

    /* Image Upload Styles */
    .mp-image-section {
      margin-bottom: 20px;
    }
    .mp-image-section h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    /* Feature Image */
    .mp-feature-upload {
      margin-bottom: 20px;
    }
    .mp-feature-upload-area {
      aspect-ratio: 16/9;
      border: 2px dashed #ddd;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafafa;
      position: relative;
      overflow: hidden;
    }
    .mp-feature-upload-area:hover {
      border-color: #333;
      background: #f5f5f5;
    }
    .mp-feature-upload-area.has-image {
      border-style: solid;
      border-color: #ddd;
    }
    .mp-feature-upload-area img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }
    .mp-feature-upload-area .mp-upload-placeholder {
      text-align: center;
      color: #999;
      font-size: 14px;
    }
    .mp-feature-upload-area .mp-upload-placeholder span {
      display: block;
      font-size: 32px;
      margin-bottom: 8px;
    }
    .mp-feature-upload-area .mp-remove-image {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(220, 53, 69, 0.9);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      display: none;
    }
    .mp-feature-upload-area.has-image .mp-remove-image {
      display: block;
    }
    .mp-feature-upload-area.has-image .mp-upload-placeholder {
      display: none;
    }

    /* Gallery Grid */
    .mp-gallery-section {
      margin-top: 20px;
    }
    .mp-gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .mp-gallery-header h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
    .mp-gallery-count {
      font-size: 12px;
      color: #666;
    }
    .mp-gallery-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .mp-gallery-item {
      aspect-ratio: 1;
      border: 2px dashed #ddd;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafafa;
      position: relative;
      overflow: hidden;
    }
    .mp-gallery-item:hover {
      border-color: #333;
      background: #f5f5f5;
    }
    .mp-gallery-item.has-image {
      border-style: solid;
      border-color: #ddd;
      cursor: grab;
    }
    .mp-gallery-item.has-image:active {
      cursor: grabbing;
    }
    .mp-gallery-item.dragging {
      opacity: 0.5;
    }
    .mp-gallery-item.drag-over {
      border-color: #007bff;
      border-width: 3px;
    }
    .mp-gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }
    .mp-gallery-item .mp-upload-placeholder {
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    .mp-gallery-item .mp-upload-placeholder span {
      display: block;
      font-size: 24px;
      margin-bottom: 4px;
    }
    .mp-gallery-item .mp-remove-image {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(220, 53, 69, 0.9);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      display: none;
      z-index: 10;
    }
    .mp-gallery-item.has-image .mp-remove-image {
      display: block;
    }
    .mp-gallery-item.has-image .mp-upload-placeholder {
      display: none;
    }
    .mp-gallery-item .mp-drag-handle {
      position: absolute;
      bottom: 4px;
      left: 4px;
      background: rgba(0,0,0,0.5);
      color: #fff;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 10px;
      display: none;
    }
    .mp-gallery-item.has-image .mp-drag-handle {
      display: block;
    }

    /* Upload Progress */
    .mp-upload-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: #e0e0e0;
    }
    .mp-upload-progress-bar {
      height: 100%;
      background: #007bff;
      transition: width 0.3s;
    }

    /* Display styles for project card */
    .mp-categories-display {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .mp-category-tag {
      padding: 4px 10px;
      background: #e8f4fc;
      color: #007bff;
      border-radius: 12px;
      font-size: 11px;
    }
    .mp-images-display {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .mp-images-display img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 4px;
    }
    .mp-images-display .mp-feature-thumb {
      grid-column: span 4;
      aspect-ratio: 16/9;
    }
  `;

  // ============================================
  // SUPABASE CLIENT INITIALIZATION
  // ============================================
  function initSupabase() {
    if (!window.supabase) {
      console.error('Supabase JS library not loaded');
      return false;
    }
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized');
    return true;
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  function getProjectLimit(membershipType) {
    if (!membershipType) return 2;
    const type = membershipType.toLowerCase();
    return PROJECT_LIMITS[type] || 2;
  }

  function generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50) + '-' + Date.now().toString(36);
  }

  function sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/[\r\n]+/g, ' ')
      .replace(/[\x00-\x1F\x7F]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function formatUrl(url) {
    if (!url || url.trim() === '') return '';
    let formatted = url.trim();
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted;
    }
    try {
      new URL(formatted);
      return formatted;
    } catch {
      return '';
    }
  }

  function isValidUrl(url) {
    if (!url || url.trim() === '') return true;
    let testUrl = url.trim();
    if (!/^https?:\/\//i.test(testUrl)) {
      testUrl = 'https://' + testUrl;
    }
    try {
      new URL(testUrl);
      return true;
    } catch {
      return false;
    }
  }

  function isValidShowreelUrl(url) {
    if (!url || url.trim() === '') return true; // Empty is valid (optional field)
    let testUrl = url.trim();
    if (!/^https?:\/\//i.test(testUrl)) {
      testUrl = 'https://' + testUrl;
    }
    try {
      const urlObj = new URL(testUrl);
      const hostname = urlObj.hostname.toLowerCase();
      // Check for YouTube
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        return true;
      }
      // Check for Vimeo
      if (hostname.includes('vimeo.com')) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // ============================================
  // SUPABASE DATA OPERATIONS
  // ============================================

  async function loadCategories() {
    try {
      const { data: directories, error: dirError } = await supabase
        .from('directories')
        .select('id, webflow_id, name, slug')
        .order('display_order');

      if (dirError) throw dirError;

      const { data: subDirectories, error: subError } = await supabase
        .from('sub_directories')
        .select('id, webflow_id, name, slug, directory_slug')
        .order('name');

      if (subError) throw subError;

      console.log(`Loaded ${directories.length} directories and ${subDirectories.length} sub-directories`);
      return { directories, subDirectories };
    } catch (error) {
      console.error('Error loading categories:', error);
      return { directories: [], subDirectories: [] };
    }
  }

  async function loadProjects(memberstackId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_sub_directories (
            sub_directory_id
          )
        `)
        .eq('memberstack_id', memberstackId)
        .eq('is_deleted', false)
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Transform to include category IDs array
      const transformed = data.map(project => ({
        ...project,
        categories: project.project_sub_directories?.map(psd => psd.sub_directory_id) || [],
        gallery_images: project.gallery_images || []
      }));

      console.log(`Loaded ${transformed.length} projects for member ${memberstackId}`);
      return transformed;
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }

  async function createProject(projectData) {
    try {
      const { categories, ...projectFields } = projectData;

      // Insert project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          memberstack_id: currentMember.id,
          name: projectFields.name,
          slug: generateSlug(projectFields.name),
          description: projectFields.description,
          feature_image_url: projectFields.feature_image_url || null,
          gallery_images: projectFields.gallery_images || [],
          external_link: projectFields.external_link || null,
          showreel_link: projectFields.showreel_link || null,
          display_order: projectFields.display_order || 0,
          is_draft: false,
          is_deleted: false
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Insert category relationships
      if (categories && categories.length > 0) {
        const categoryRows = categories.map(subDirId => ({
          project_id: project.id,
          sub_directory_id: subDirId
        }));

        const { error: catError } = await supabase
          .from('project_sub_directories')
          .insert(categoryRows);

        if (catError) {
          console.error('Error linking categories:', catError);
        }
      }

      console.log('Project created:', project.id);
      return { ...project, categories: categories || [], gallery_images: project.gallery_images || [] };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async function updateProject(projectId, projectData) {
    try {
      const { categories, ...projectFields } = projectData;

      // Update project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .update({
          name: projectFields.name,
          description: projectFields.description,
          feature_image_url: projectFields.feature_image_url || null,
          gallery_images: projectFields.gallery_images || [],
          external_link: projectFields.external_link || null,
          showreel_link: projectFields.showreel_link || null,
          display_order: projectFields.display_order || 0
        })
        .eq('id', projectId)
        .eq('memberstack_id', currentMember.id)
        .select()
        .single();

      if (projectError) throw projectError;

      // Update category relationships
      // First delete existing
      const { error: deleteError } = await supabase
        .from('project_sub_directories')
        .delete()
        .eq('project_id', projectId);

      if (deleteError) {
        console.error('Error deleting old categories:', deleteError);
      }

      // Then insert new
      if (categories && categories.length > 0) {
        const categoryRows = categories.map(subDirId => ({
          project_id: projectId,
          sub_directory_id: subDirId
        }));

        const { error: catError } = await supabase
          .from('project_sub_directories')
          .insert(categoryRows);

        if (catError) {
          console.error('Error linking categories:', catError);
        }
      }

      console.log('Project updated:', projectId);
      return { ...project, categories: categories || [], gallery_images: project.gallery_images || [] };
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async function deleteProject(projectId) {
    try {
      // Soft delete
      const { error } = await supabase
        .from('projects')
        .update({ is_deleted: true })
        .eq('id', projectId)
        .eq('memberstack_id', currentMember.id);

      if (error) throw error;

      console.log('Project deleted:', projectId);
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // ============================================
  // IMAGE UPLOAD OPERATIONS
  // ============================================

  async function uploadImage(file, projectId) {
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const path = `${currentMember.id}/${projectId || 'new'}/${timestamp}.${ext}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path);

    console.log('Image uploaded:', publicUrl);
    return publicUrl;
  }

  async function deleteImage(url) {
    try {
      // Extract path from URL
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/project-images\/(.+)/);
      if (!pathMatch) return;

      const path = pathMatch[1];
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([path]);

      if (error) {
        console.error('Error deleting image:', error);
      }
    } catch (error) {
      console.error('Error parsing image URL:', error);
    }
  }

  // ============================================
  // UI HELPERS
  // ============================================

  function getCategoryName(categoryId) {
    const subDir = categories.subDirectories.find(sd => sd.id === categoryId);
    return subDir ? subDir.name : categoryId;
  }

  function getSubDirectoriesByParent(parentSlug) {
    return categories.subDirectories.filter(sd => sd.directory_slug === parentSlug);
  }

  function setupUrlValidation(container) {
    const input = container.querySelector('#mp-form-external_link');
    const errorMsg = container.querySelector('#mp-url-error');
    if (!input || !errorMsg) return;

    const validate = () => {
      const value = input.value.trim();
      if (value === '') {
        input.classList.remove('error', 'valid');
        errorMsg.classList.remove('visible');
      } else if (isValidUrl(value)) {
        input.classList.remove('error');
        input.classList.add('valid');
        errorMsg.classList.remove('visible');
      } else {
        input.classList.remove('valid');
        input.classList.add('error');
        errorMsg.classList.add('visible');
      }
    };

    input.addEventListener('blur', validate);
    input.addEventListener('input', () => {
      if (input.classList.contains('error') && isValidUrl(input.value)) {
        input.classList.remove('error');
        input.classList.add('valid');
        errorMsg.classList.remove('visible');
      }
    });

    if (input.value.trim()) {
      validate();
    }
  }

  function setupShowreelValidation(container) {
    const input = container.querySelector('#mp-form-showreel_link');
    const errorMsg = container.querySelector('#mp-showreel-error');
    if (!input || !errorMsg) return;

    const validate = () => {
      const value = input.value.trim();
      if (value === '') {
        input.classList.remove('error', 'valid');
        errorMsg.classList.remove('visible');
      } else if (isValidShowreelUrl(value)) {
        input.classList.remove('error');
        input.classList.add('valid');
        errorMsg.classList.remove('visible');
      } else {
        input.classList.remove('valid');
        input.classList.add('error');
        errorMsg.classList.add('visible');
      }
    };

    input.addEventListener('blur', validate);
    input.addEventListener('input', () => {
      if (input.classList.contains('error') && isValidShowreelUrl(input.value)) {
        input.classList.remove('error');
        input.classList.add('valid');
        errorMsg.classList.remove('visible');
      }
    });

    if (input.value.trim()) {
      validate();
    }
  }

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  function renderProjects(wrapper) {
    if (projects.length === 0) {
      wrapper.innerHTML = `
        <div class="mp-empty">
          <p>You don't have any projects yet</p>
          <button class="mp-btn" id="mp-add-first">Add Your First Project</button>
        </div>
      `;
      wrapper.querySelector('#mp-add-first').addEventListener('click', () => openAddModal(wrapper));
      return;
    }

    const membershipType = currentMember?.customFields?.['membership-type'];
    const limit = getProjectLimit(membershipType);
    const remaining = limit - projects.length;
    const atLimit = remaining <= 0;

    let html = `
      <div class="mp-header">
        <h2>My Projects</h2>
        <div class="mp-header-right">
          <span class="mp-project-count">${projects.length} of ${limit} projects</span>
          <button class="mp-btn ${atLimit ? 'mp-btn-disabled' : ''}" id="mp-add-project" ${atLimit ? 'disabled' : ''}>
            ${atLimit ? 'Limit Reached' : 'Add Another Project'}
          </button>
        </div>
      </div>
      <div class="mp-projects-list">
    `;

    projects.forEach((project, index) => {
      html += renderProjectCard(project, index);
    });

    html += '</div>';
    wrapper.innerHTML = html;

    wrapper.querySelector('#mp-add-project').addEventListener('click', () => {
      const membershipType = currentMember?.customFields?.['membership-type'];
      const limit = getProjectLimit(membershipType);

      if (projects.length >= limit) {
        showLimitReachedModal(limit, membershipType);
        return;
      }

      openAddModal(wrapper);
    });

    wrapper.querySelectorAll('.mp-project-card').forEach((card, index) => {
      const project = projects[index];
      setupProjectCard(card, project, wrapper);
    });
  }

  function renderProjectCard(project, index) {
    let fieldsHtml = '';

    // Description
    const desc = project.description || '';
    fieldsHtml += `
      <div class="mp-field">
        <div class="mp-field-label">Description</div>
        <div class="mp-field-value ${!desc ? 'empty' : ''}">
          ${desc || 'No description'}
        </div>
      </div>
    `;

    // Categories display
    const projectCategories = project.categories || [];
    fieldsHtml += `
      <div class="mp-field">
        <div class="mp-field-label">Categories</div>
        <div class="mp-categories-display">
          ${projectCategories.length > 0
            ? projectCategories.map(id => `<span class="mp-category-tag">${getCategoryName(id)}</span>`).join('')
            : '<span class="mp-field-value empty">No categories selected</span>'
          }
        </div>
      </div>
    `;

    // Images display
    const hasFeature = project.feature_image_url;
    const galleryImages = project.gallery_images || [];
    const hasImages = hasFeature || galleryImages.length > 0;

    if (hasImages) {
      fieldsHtml += `
        <div class="mp-field">
          <div class="mp-field-label">Images</div>
          <div class="mp-images-display">
            ${hasFeature ? `<img src="${project.feature_image_url}" class="mp-feature-thumb" alt="Feature">` : ''}
            ${galleryImages.map((url, i) => `<img src="${url}" alt="Gallery ${i + 1}">`).join('')}
          </div>
        </div>
      `;
    }

    // Links
    if (project.external_link) {
      fieldsHtml += `
        <div class="mp-field">
          <div class="mp-field-label">External Link</div>
          <div class="mp-field-value">
            <a href="${project.external_link}" target="_blank">${project.external_link}</a>
          </div>
        </div>
      `;
    }

    if (project.showreel_link) {
      fieldsHtml += `
        <div class="mp-field">
          <div class="mp-field-label">Showreel</div>
          <div class="mp-field-value">
            <a href="${project.showreel_link}" target="_blank">${project.showreel_link}</a>
          </div>
        </div>
      `;
    }

    return `
      <div class="mp-project-card" data-project-id="${project.id}">
        <div class="mp-project-header">
          <div class="mp-project-header-left mp-toggle-details">
            <span class="mp-toggle-icon">&#9654;</span>
            <h3 class="mp-project-title">${project.name || 'Untitled Project'}</h3>
          </div>
          <div class="mp-project-header-actions">
            <button class="mp-btn mp-btn-secondary mp-btn-small mp-edit-btn">Edit</button>
            <button class="mp-btn mp-btn-danger mp-btn-small mp-delete-btn">Delete</button>
          </div>
        </div>
        <div class="mp-project-content">
          <div class="mp-project-fields">
            ${fieldsHtml}
          </div>
        </div>
      </div>
    `;
  }

  function setupProjectCard(card, project, wrapper) {
    const content = card.querySelector('.mp-project-content');
    const toggleArea = card.querySelector('.mp-toggle-details');
    const toggleIcon = card.querySelector('.mp-toggle-icon');
    const editBtn = card.querySelector('.mp-edit-btn');
    const deleteBtn = card.querySelector('.mp-delete-btn');

    toggleArea.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = content.classList.toggle('open');
      toggleIcon.classList.toggle('open', isOpen);
    });

    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal(project, wrapper);
    });

    deleteBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this project?')) {
        deleteBtn.disabled = true;
        deleteBtn.textContent = 'Deleting...';

        try {
          await deleteProject(project.id);
          projects = projects.filter(p => p.id !== project.id);
          renderProjects(wrapper);
        } catch (error) {
          console.error('Error deleting project:', error);
          alert('Error deleting project. Please try again.');
          deleteBtn.disabled = false;
          deleteBtn.textContent = 'Delete';
        }
      }
    });
  }

  // ============================================
  // CATEGORY SELECTOR
  // ============================================

  function createCategorySelector(selectedCategories = []) {
    let html = `
      <div class="mp-category-section">
        <h4>Choose Project Categories</h4>
        <p style="font-size: 12px; color: #666; margin: 0 0 12px 0;">Select a category to see subcategories. You can choose from multiple categories.</p>
        <div class="mp-parent-categories">
    `;

    categories.directories.forEach(parent => {
      html += `<button type="button" class="mp-parent-btn" data-parent="${parent.slug}">${parent.name}</button>`;
    });

    html += `</div>`;

    // Child category containers
    categories.directories.forEach(parent => {
      const children = getSubDirectoriesByParent(parent.slug);
      html += `<div class="mp-child-categories" data-parent="${parent.slug}">`;
      children.forEach(child => {
        const isSelected = selectedCategories.includes(child.id);
        html += `<button type="button" class="mp-child-btn ${isSelected ? 'selected' : ''}" data-id="${child.id}">${child.name}</button>`;
      });
      html += `</div>`;
    });

    html += `
        <div class="mp-selected-categories" style="${selectedCategories.length ? '' : 'display: none;'}">
          <h5>Selected Categories</h5>
          <div class="mp-selected-list"></div>
        </div>
      </div>
    `;

    return html;
  }

  function setupCategorySelector(container, selectedCategories, onChange) {
    const parentBtns = container.querySelectorAll('.mp-parent-btn');
    const childContainers = container.querySelectorAll('.mp-child-categories');
    const selectedList = container.querySelector('.mp-selected-list');
    const selectedSection = container.querySelector('.mp-selected-categories');

    function updateSelectedDisplay() {
      selectedList.innerHTML = selectedCategories.map(id => {
        const name = getCategoryName(id);
        return `<span class="mp-selected-tag">${name}<button type="button" data-id="${id}">&times;</button></span>`;
      }).join('');

      selectedSection.style.display = selectedCategories.length ? '' : 'none';

      container.querySelectorAll('.mp-child-btn').forEach(btn => {
        btn.classList.toggle('selected', selectedCategories.includes(btn.dataset.id));
      });

      if (onChange) onChange(selectedCategories);
    }

    parentBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const parentSlug = btn.dataset.parent;
        const isActive = btn.classList.contains('active');

        parentBtns.forEach(b => b.classList.remove('active'));
        childContainers.forEach(c => c.classList.remove('visible'));

        if (!isActive) {
          btn.classList.add('active');
          container.querySelector(`.mp-child-categories[data-parent="${parentSlug}"]`).classList.add('visible');
        }
      });
    });

    container.querySelectorAll('.mp-child-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const index = selectedCategories.indexOf(id);
        if (index > -1) {
          selectedCategories.splice(index, 1);
        } else {
          selectedCategories.push(id);
        }
        updateSelectedDisplay();
      });
    });

    selectedList.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const id = e.target.dataset.id;
        const index = selectedCategories.indexOf(id);
        if (index > -1) {
          selectedCategories.splice(index, 1);
          updateSelectedDisplay();
        }
      }
    });

    updateSelectedDisplay();
  }

  // ============================================
  // IMAGE UPLOADER
  // ============================================

  function createImageUploader(projectData = {}) {
    const galleryCount = (projectData.gallery_images || []).length;

    return `
      <div class="mp-image-section">
        <div class="mp-feature-upload">
          <h4>Feature Image</h4>
          <div class="mp-feature-upload-area ${projectData.feature_image_url ? 'has-image' : ''}" id="mp-feature-upload">
            ${projectData.feature_image_url ? `<img src="${projectData.feature_image_url}" alt="Feature">` : ''}
            <div class="mp-upload-placeholder"><span>+</span>Click to upload feature image</div>
            <button type="button" class="mp-remove-image">&times;</button>
            <input type="file" accept="image/*" style="display: none;" id="mp-feature-input">
          </div>
        </div>

        <div class="mp-gallery-section">
          <div class="mp-gallery-header">
            <h4>Gallery Images</h4>
            <span class="mp-gallery-count"><span id="mp-gallery-count-num">${galleryCount}</span> / ${MAX_GALLERY_IMAGES}</span>
          </div>
          <div class="mp-gallery-grid" id="mp-gallery-grid">
            ${(projectData.gallery_images || []).map((url, i) => `
              <div class="mp-gallery-item has-image" data-index="${i}" draggable="true">
                <img src="${url}" alt="Gallery ${i + 1}">
                <button type="button" class="mp-remove-image">&times;</button>
                <span class="mp-drag-handle">Drag</span>
              </div>
            `).join('')}
            ${galleryCount < MAX_GALLERY_IMAGES ? `
              <div class="mp-gallery-item mp-gallery-add" id="mp-gallery-add">
                <div class="mp-upload-placeholder"><span>+</span>Add</div>
                <input type="file" accept="image/*" multiple style="display: none;" id="mp-gallery-input">
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  function setupImageUploader(container, projectData, onChange) {
    // Feature image upload
    const featureArea = container.querySelector('#mp-feature-upload');
    const featureInput = container.querySelector('#mp-feature-input');

    featureArea.addEventListener('click', (e) => {
      if (e.target.classList.contains('mp-remove-image')) {
        e.stopPropagation();
        projectData.feature_image_url = '';
        featureArea.classList.remove('has-image');
        const img = featureArea.querySelector('img');
        if (img) img.remove();
        if (onChange) onChange();
        return;
      }

      if (!featureArea.classList.contains('has-image')) {
        featureInput.click();
      }
    });

    featureInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        featureArea.style.opacity = '0.5';
        const url = await uploadImage(file, projectData.id);
        projectData.feature_image_url = url;
        featureArea.classList.add('has-image');

        let img = featureArea.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          featureArea.insertBefore(img, featureArea.firstChild);
        }
        img.src = url;
        img.alt = 'Feature';
        featureArea.style.opacity = '1';

        if (onChange) onChange();
      } catch (error) {
        console.error('Error uploading feature image:', error);
        alert('Error uploading image. Please try again.');
        featureArea.style.opacity = '1';
      }

      featureInput.value = '';
    });

    // Gallery image upload
    setupGalleryUploader(container, projectData, onChange);
  }

  function setupGalleryUploader(container, projectData, onChange) {
    const galleryGrid = container.querySelector('#mp-gallery-grid');
    const galleryInput = container.querySelector('#mp-gallery-input');
    const galleryAdd = container.querySelector('#mp-gallery-add');
    const countNum = container.querySelector('#mp-gallery-count-num');

    if (!projectData.gallery_images) {
      projectData.gallery_images = [];
    }

    function updateGalleryDisplay() {
      galleryGrid.innerHTML = '';

      projectData.gallery_images.forEach((url, i) => {
        const item = document.createElement('div');
        item.className = 'mp-gallery-item has-image';
        item.dataset.index = i;
        item.draggable = true;
        item.innerHTML = `
          <img src="${url}" alt="Gallery ${i + 1}">
          <button type="button" class="mp-remove-image">&times;</button>
          <span class="mp-drag-handle">Drag</span>
        `;
        galleryGrid.appendChild(item);
      });

      if (projectData.gallery_images.length < MAX_GALLERY_IMAGES) {
        const addBtn = document.createElement('div');
        addBtn.className = 'mp-gallery-item mp-gallery-add';
        addBtn.id = 'mp-gallery-add';
        addBtn.innerHTML = `
          <div class="mp-upload-placeholder"><span>+</span>Add</div>
          <input type="file" accept="image/*" multiple style="display: none;" id="mp-gallery-input">
        `;
        galleryGrid.appendChild(addBtn);

        // Re-setup add button listener
        const newInput = addBtn.querySelector('#mp-gallery-input');
        addBtn.addEventListener('click', () => newInput.click());
        newInput.addEventListener('change', handleGalleryFiles);
      }

      countNum.textContent = projectData.gallery_images.length;

      // Setup drag and drop
      setupDragAndDrop();
      // Setup remove buttons
      setupRemoveButtons();
    }

    function setupDragAndDrop() {
      const items = galleryGrid.querySelectorAll('.mp-gallery-item.has-image');
      let draggedItem = null;

      items.forEach(item => {
        item.addEventListener('dragstart', (e) => {
          draggedItem = item;
          item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
          item.classList.remove('dragging');
          galleryGrid.querySelectorAll('.mp-gallery-item').forEach(i => i.classList.remove('drag-over'));
        });

        item.addEventListener('dragover', (e) => {
          e.preventDefault();
          if (item !== draggedItem && item.classList.contains('has-image')) {
            item.classList.add('drag-over');
          }
        });

        item.addEventListener('dragleave', () => {
          item.classList.remove('drag-over');
        });

        item.addEventListener('drop', (e) => {
          e.preventDefault();
          item.classList.remove('drag-over');

          if (draggedItem && item !== draggedItem) {
            const fromIndex = parseInt(draggedItem.dataset.index);
            const toIndex = parseInt(item.dataset.index);

            // Swap in array
            const temp = projectData.gallery_images[fromIndex];
            projectData.gallery_images[fromIndex] = projectData.gallery_images[toIndex];
            projectData.gallery_images[toIndex] = temp;

            updateGalleryDisplay();
            if (onChange) onChange();
          }
        });
      });
    }

    function setupRemoveButtons() {
      galleryGrid.querySelectorAll('.mp-gallery-item.has-image .mp-remove-image').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const item = btn.closest('.mp-gallery-item');
          const index = parseInt(item.dataset.index);
          projectData.gallery_images.splice(index, 1);
          updateGalleryDisplay();
          if (onChange) onChange();
        });
      });
    }

    async function handleGalleryFiles(e) {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const remaining = MAX_GALLERY_IMAGES - projectData.gallery_images.length;
      const toUpload = files.slice(0, remaining);

      for (const file of toUpload) {
        try {
          const url = await uploadImage(file, projectData.id);
          projectData.gallery_images.push(url);
          updateGalleryDisplay();
          if (onChange) onChange();
        } catch (error) {
          console.error('Error uploading gallery image:', error);
          alert('Error uploading image: ' + file.name);
        }
      }

      e.target.value = '';
    }

    if (galleryAdd) {
      galleryAdd.addEventListener('click', () => galleryInput?.click());
    }

    if (galleryInput) {
      galleryInput.addEventListener('change', handleGalleryFiles);
    }

    // Initial setup
    setupDragAndDrop();
    setupRemoveButtons();
  }

  // ============================================
  // MODALS
  // ============================================

  function showLimitReachedModal(limit, membershipType) {
    const membershipName = membershipType ? membershipType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'your membership';

    const modal = document.createElement('div');
    modal.className = 'mp-modal-overlay';
    modal.innerHTML = `
      <div class="mp-modal" style="max-width: 450px;">
        <div class="mp-modal-header">
          <h3>Project Limit Reached</h3>
        </div>
        <div class="mp-modal-body" style="text-align: center; padding: 30px;">
          <p style="margin-bottom: 16px; font-size: 16px;">
            You've reached the maximum of <strong>${limit} projects</strong> for ${membershipName} members.
          </p>
          <p style="margin-bottom: 0; color: #666;">
            To add a new project, please delete an existing one or consider upgrading your membership.
          </p>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn" id="mp-modal-close">Got it</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#mp-modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  function openAddModal(wrapper) {
    const selectedCategories = [];
    const projectData = {
      feature_image_url: '',
      gallery_images: []
    };

    const modal = document.createElement('div');
    modal.className = 'mp-modal-overlay';
    modal.innerHTML = `
      <div class="mp-modal">
        <div class="mp-modal-header">
          <h3>Add New Project</h3>
        </div>
        <div class="mp-modal-body">
          <div class="mp-form-field">
            <label>Project Name <span>*</span></label>
            <input type="text" class="mp-form-input" id="mp-form-name" required>
          </div>
          <div class="mp-form-field">
            <label>Project Description <span>*</span></label>
            <textarea class="mp-form-input" id="mp-form-description"></textarea>
            <div class="mp-input-hint">Minimum 50 words required (<span id="mp-word-count">0</span> words)</div>
            <div class="mp-input-error" id="mp-description-error">Please enter at least 50 words</div>
          </div>

          ${createCategorySelector(selectedCategories)}
          ${createImageUploader(projectData)}

          <div class="mp-form-field">
            <label>Showreel Link</label>
            <input type="text" class="mp-form-input" id="mp-form-showreel_link" placeholder="https://youtube.com/watch?v=... or https://vimeo.com/...">
            <div class="mp-input-hint">YouTube or Vimeo URL only</div>
            <div class="mp-input-error" id="mp-showreel-error">Please enter a valid YouTube or Vimeo URL</div>
          </div>
          <div class="mp-form-field">
            <label>Project External Link</label>
            <input type="text" class="mp-form-input" id="mp-form-external_link" placeholder="https://example.com">
            <div class="mp-input-hint">Enter a complete URL including https://</div>
            <div class="mp-input-error" id="mp-url-error">Please enter a valid URL (e.g., https://example.com)</div>
          </div>
          <div class="mp-form-field">
            <label>Display Order</label>
            <input type="number" class="mp-form-input" id="mp-form-display_order" value="0">
          </div>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn mp-btn-secondary" id="mp-modal-cancel">Cancel</button>
          <button class="mp-btn" id="mp-modal-save">Create Project</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    setupCategorySelector(modal, selectedCategories, null);
    setupImageUploader(modal, projectData, null);
    setupUrlValidation(modal);
    setupShowreelValidation(modal);

    // Word count
    const descriptionInput = modal.querySelector('#mp-form-description');
    const wordCountEl = modal.querySelector('#mp-word-count');
    const updateWordCount = () => {
      const text = descriptionInput.value.trim();
      const count = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
      wordCountEl.textContent = count;
      wordCountEl.style.color = count >= 50 ? '#28a745' : '#666';
      modal.querySelector('#mp-description-error').style.display = 'none';
    };
    descriptionInput.addEventListener('input', updateWordCount);
    updateWordCount();

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    modal.querySelector('#mp-modal-cancel').addEventListener('click', () => modal.remove());

    const saveBtn = modal.querySelector('#mp-modal-save');
    saveBtn.addEventListener('click', async () => {
      const projectName = modal.querySelector('#mp-form-name').value.trim();
      const projectDescription = modal.querySelector('#mp-form-description').value.trim();
      const wordCount = projectDescription ? projectDescription.split(/\s+/).filter(w => w.length > 0).length : 0;

      if (!projectName) {
        alert('Project name is required');
        return;
      }

      if (wordCount < 50) {
        const errorEl = modal.querySelector('#mp-description-error');
        if (errorEl) errorEl.style.display = 'block';
        modal.querySelector('#mp-form-description').focus();
        return;
      }

      const showreelLink = modal.querySelector('#mp-form-showreel_link').value.trim();
      if (showreelLink && !isValidShowreelUrl(showreelLink)) {
        const errorEl = modal.querySelector('#mp-showreel-error');
        if (errorEl) errorEl.classList.add('visible');
        modal.querySelector('#mp-form-showreel_link').classList.add('error');
        modal.querySelector('#mp-form-showreel_link').focus();
        return;
      }

      const externalLink = modal.querySelector('#mp-form-external_link').value.trim();
      if (externalLink && !isValidUrl(externalLink)) {
        const errorEl = modal.querySelector('#mp-url-error');
        if (errorEl) errorEl.classList.add('visible');
        modal.querySelector('#mp-form-external_link').classList.add('error');
        modal.querySelector('#mp-form-external_link').focus();
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'Creating...';

      try {
        const newProject = await createProject({
          name: projectName,
          description: projectDescription,
          external_link: formatUrl(modal.querySelector('#mp-form-external_link').value),
          showreel_link: formatUrl(modal.querySelector('#mp-form-showreel_link').value),
          display_order: parseInt(modal.querySelector('#mp-form-display_order').value) || 0,
          categories: [...selectedCategories],
          feature_image_url: projectData.feature_image_url || '',
          gallery_images: projectData.gallery_images || []
        });

        projects.push(newProject);
        projects.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        modal.remove();
        renderProjects(wrapper);
      } catch (error) {
        console.error('Error creating project:', error);
        alert('Error creating project. Please try again.');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Create Project';
      }
    });

    modal.querySelector('#mp-form-name').focus();
  }

  function openEditModal(project, wrapper) {
    const selectedCategories = [...(project.categories || [])];
    const projectData = {
      id: project.id,
      feature_image_url: project.feature_image_url || '',
      gallery_images: [...(project.gallery_images || [])]
    };

    const modal = document.createElement('div');
    modal.className = 'mp-modal-overlay';
    modal.innerHTML = `
      <div class="mp-modal">
        <div class="mp-modal-header">
          <h3>Edit Project</h3>
        </div>
        <div class="mp-modal-body">
          <div class="mp-form-field">
            <label>Project Name <span>*</span></label>
            <input type="text" class="mp-form-input" id="mp-form-name" value="${project.name || ''}" required>
          </div>
          <div class="mp-form-field">
            <label>Project Description <span>*</span></label>
            <textarea class="mp-form-input" id="mp-form-description">${project.description || ''}</textarea>
            <div class="mp-input-hint">Minimum 50 words required (<span id="mp-word-count">0</span> words)</div>
            <div class="mp-input-error" id="mp-description-error">Please enter at least 50 words</div>
          </div>

          ${createCategorySelector(selectedCategories)}
          ${createImageUploader(projectData)}

          <div class="mp-form-field">
            <label>Showreel Link</label>
            <input type="text" class="mp-form-input" id="mp-form-showreel_link" value="${project.showreel_link || ''}" placeholder="https://youtube.com/watch?v=... or https://vimeo.com/...">
            <div class="mp-input-hint">YouTube or Vimeo URL only</div>
            <div class="mp-input-error" id="mp-showreel-error">Please enter a valid YouTube or Vimeo URL</div>
          </div>
          <div class="mp-form-field">
            <label>Project External Link</label>
            <input type="text" class="mp-form-input" id="mp-form-external_link" value="${project.external_link || ''}" placeholder="https://example.com">
            <div class="mp-input-hint">Enter a complete URL including https://</div>
            <div class="mp-input-error" id="mp-url-error">Please enter a valid URL (e.g., https://example.com)</div>
          </div>
          <div class="mp-form-field">
            <label>Display Order</label>
            <input type="number" class="mp-form-input" id="mp-form-display_order" value="${project.display_order || 0}">
          </div>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn mp-btn-secondary" id="mp-modal-cancel">Cancel</button>
          <button class="mp-btn" id="mp-modal-save">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    setupCategorySelector(modal, selectedCategories, null);
    setupImageUploader(modal, projectData, null);
    setupUrlValidation(modal);
    setupShowreelValidation(modal);

    // Word count
    const descriptionInput = modal.querySelector('#mp-form-description');
    const wordCountEl = modal.querySelector('#mp-word-count');
    const updateWordCount = () => {
      const text = descriptionInput.value.trim();
      const count = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
      wordCountEl.textContent = count;
      wordCountEl.style.color = count >= 50 ? '#28a745' : '#666';
      modal.querySelector('#mp-description-error').style.display = 'none';
    };
    descriptionInput.addEventListener('input', updateWordCount);
    updateWordCount();

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    modal.querySelector('#mp-modal-cancel').addEventListener('click', () => modal.remove());

    const saveBtn = modal.querySelector('#mp-modal-save');
    saveBtn.addEventListener('click', async () => {
      const projectName = modal.querySelector('#mp-form-name').value.trim();
      const projectDescription = modal.querySelector('#mp-form-description').value.trim();
      const wordCount = projectDescription ? projectDescription.split(/\s+/).filter(w => w.length > 0).length : 0;

      if (!projectName) {
        alert('Project name is required');
        return;
      }

      if (wordCount < 50) {
        const errorEl = modal.querySelector('#mp-description-error');
        if (errorEl) errorEl.style.display = 'block';
        modal.querySelector('#mp-form-description').focus();
        return;
      }

      const showreelLink = modal.querySelector('#mp-form-showreel_link').value.trim();
      if (showreelLink && !isValidShowreelUrl(showreelLink)) {
        const errorEl = modal.querySelector('#mp-showreel-error');
        if (errorEl) errorEl.classList.add('visible');
        modal.querySelector('#mp-form-showreel_link').classList.add('error');
        modal.querySelector('#mp-form-showreel_link').focus();
        return;
      }

      const externalLink = modal.querySelector('#mp-form-external_link').value.trim();
      if (externalLink && !isValidUrl(externalLink)) {
        const errorEl = modal.querySelector('#mp-url-error');
        if (errorEl) errorEl.classList.add('visible');
        modal.querySelector('#mp-form-external_link').classList.add('error');
        modal.querySelector('#mp-form-external_link').focus();
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      try {
        const updated = await updateProject(project.id, {
          name: projectName,
          description: projectDescription,
          external_link: formatUrl(modal.querySelector('#mp-form-external_link').value),
          showreel_link: formatUrl(modal.querySelector('#mp-form-showreel_link').value),
          display_order: parseInt(modal.querySelector('#mp-form-display_order').value) || 0,
          categories: [...selectedCategories],
          feature_image_url: projectData.feature_image_url || '',
          gallery_images: projectData.gallery_images || []
        });

        // Update in local array
        const index = projects.findIndex(p => p.id === project.id);
        if (index > -1) {
          projects[index] = updated;
        }
        projects.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

        modal.remove();
        renderProjects(wrapper);
      } catch (error) {
        console.error('Error updating project:', error);
        alert('Error updating project. Please try again.');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
      }
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function waitForMemberstack() {
    return new Promise((resolve) => {
      if (window.$memberstackDom) {
        resolve();
      } else {
        const check = setInterval(() => {
          if (window.$memberstackDom) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      }
    });
  }

  function waitForSupabase() {
    return new Promise((resolve, reject) => {
      if (window.supabase) {
        resolve();
        return;
      }

      let attempts = 0;
      const maxAttempts = 50; // 5 seconds

      const check = setInterval(() => {
        attempts++;
        if (window.supabase) {
          clearInterval(check);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(check);
          reject(new Error('Supabase library not loaded'));
        }
      }, 100);
    });
  }

  async function init() {
    const container = document.querySelector('.supabase-project-container');
    if (!container) {
      console.warn('Could not find .supabase-project-container');
      return;
    }

    // Add styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Create main container
    const wrapper = document.createElement('div');
    wrapper.className = 'mp-container';
    wrapper.innerHTML = '<div class="mp-loading">Loading projects...</div>';
    container.appendChild(wrapper);

    try {
      // Wait for dependencies
      await waitForSupabase();
      await waitForMemberstack();

      // Initialize Supabase
      if (!initSupabase()) {
        wrapper.innerHTML = '<div class="mp-loading">Error: Could not initialize Supabase</div>';
        return;
      }

      // Get current member
      const { data: member } = await window.$memberstackDom.getCurrentMember();
      if (!member) {
        wrapper.innerHTML = '<div class="mp-loading">Please log in to view your projects.</div>';
        return;
      }
      currentMember = member;
      console.log('Current member:', currentMember.id);

      // Load categories from Supabase
      categories = await loadCategories();
      console.log(`Categories loaded: ${categories.directories.length} directories, ${categories.subDirectories.length} sub-directories`);

      // Load projects from Supabase
      projects = await loadProjects(member.id);

      // Render
      renderProjects(wrapper);
    } catch (error) {
      console.error('Error initializing member projects:', error);
      wrapper.innerHTML = '<div class="mp-loading">Error loading projects. Please refresh the page.</div>';
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
