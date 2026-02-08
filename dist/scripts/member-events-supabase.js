// Member Events Supabase Script
// Displays, creates, edits, and submits member events for review
// Stores in Supabase, syncs to Webflow CMS via Edge Functions
// Events require approval before publishing

(function() {
  console.log('Member events Supabase script loaded');

  // ============================================
  // CONFIGURATION
  // ============================================
  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxMjk1NTgsImV4cCI6MjA0NDcwNTU1OH0.X8oL0cMvGZS0lOfb_IbBE91crTbDYLR-ge6VlPZuXJI';

  // Webflow collection IDs (for reference)
  const EVENTS_COLLECTION_ID = '64aa21e9193adf43b765fcf1';

  // Maximum days in future for event expiry
  const MAX_EXPIRY_DAYS = 90;

  let supabase = null;
  let currentMember = null;
  let events = [];
  let suburbs = [];

  // Event status types
  const STATUS = {
    DRAFT: 'draft',
    PENDING_REVIEW: 'pending_review',
    PUBLISHED: 'published',
    CHANGES_REQUESTED: 'changes_requested'
  };

  // Styles
  const styles = `
    .me-container {
      font-family: inherit;
      width: 100%;
    }
    .me-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .me-header h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
    .me-btn {
      background: #333;
      color: #fff;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .me-btn:hover {
      background: #555;
    }
    .me-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .me-btn-secondary {
      background: #fff;
      color: #333;
      border: 1px solid #ddd;
    }
    .me-btn-secondary:hover {
      background: #f5f5f5;
    }
    .me-btn-danger {
      background: #dc3545;
    }
    .me-btn-danger:hover {
      background: #c82333;
    }
    .me-btn-success {
      background: #28a745;
    }
    .me-btn-success:hover {
      background: #218838;
    }
    .me-btn-small {
      padding: 8px 16px;
      font-size: 13px;
    }
    .me-loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .me-empty {
      text-align: center;
      padding: 60px 20px;
      background: #f9f9f9;
      border-radius: 8px;
      border: 2px dashed #ddd;
    }
    .me-empty p {
      margin: 0 0 20px 0;
      color: #666;
      font-size: 16px;
    }

    /* Event Cards */
    .me-events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    .me-event-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fff;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .me-event-image {
      width: 100%;
      aspect-ratio: 16/9;
      background: #f0f0f0;
      position: relative;
      overflow: hidden;
    }
    .me-event-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .me-event-image .me-no-image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #999;
      font-size: 14px;
    }
    .me-event-status {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .me-status-draft {
      background: #6c757d;
      color: #fff;
    }
    .me-status-pending_review {
      background: #ffc107;
      color: #333;
    }
    .me-status-published {
      background: #28a745;
      color: #fff;
    }
    .me-status-changes_requested {
      background: #dc3545;
      color: #fff;
    }
    .me-event-body {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .me-event-title {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .me-event-date {
      font-size: 14px;
      color: #007bff;
      margin-bottom: 8px;
    }
    .me-event-location {
      font-size: 13px;
      color: #666;
      margin-bottom: 12px;
    }
    .me-event-description {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      flex: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .me-event-actions {
      display: flex;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid #e0e0e0;
      background: #fafafa;
    }
    .me-event-actions .me-btn {
      flex: 1;
    }

    /* Modal */
    .me-modal-overlay {
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
      padding: 20px;
    }
    .me-modal {
      background: #fff;
      border-radius: 8px;
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .me-modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e0e0e0;
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 1;
    }
    .me-modal-header h3 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }
    .me-modal-body {
      padding: 24px;
    }
    .me-modal-footer {
      padding: 20px 24px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      position: sticky;
      bottom: 0;
      background: #fff;
    }

    /* Form Fields */
    .me-form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 600px) {
      .me-form-row {
        grid-template-columns: 1fr;
      }
    }
    .me-form-field {
      margin-bottom: 20px;
    }
    .me-form-field.full-width {
      grid-column: 1 / -1;
    }
    .me-form-field label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    .me-form-field label span {
      color: #dc3545;
    }
    .me-form-field .me-hint {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    .me-form-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .me-form-input:focus {
      outline: none;
      border-color: #333;
    }
    .me-form-input.error {
      border-color: #dc3545;
    }
    .me-form-input.valid {
      border-color: #28a745;
    }
    textarea.me-form-input {
      min-height: 120px;
      resize: vertical;
    }
    select.me-form-input {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
    }
    .me-error-msg {
      font-size: 12px;
      color: #dc3545;
      margin-top: 4px;
      display: none;
    }
    .me-error-msg.visible {
      display: block;
    }

    /* Image Upload */
    .me-image-upload {
      width: 100%;
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
    .me-image-upload:hover {
      border-color: #333;
      background: #f5f5f5;
    }
    .me-image-upload.has-image {
      border-style: solid;
      border-color: #ddd;
    }
    .me-image-upload img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }
    .me-image-upload .me-upload-placeholder {
      text-align: center;
      color: #999;
      font-size: 14px;
      padding: 20px;
    }
    .me-image-upload .me-upload-placeholder span {
      display: block;
      font-size: 32px;
      margin-bottom: 8px;
    }
    .me-image-upload .me-remove-image {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(220, 53, 69, 0.9);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      display: none;
    }
    .me-image-upload.has-image .me-remove-image {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .me-image-upload.has-image .me-upload-placeholder {
      display: none;
    }
    .me-image-upload input[type="file"] {
      display: none;
    }

    /* Info box */
    .me-info-box {
      padding: 16px;
      background: #e8f4fc;
      border-radius: 8px;
      margin-bottom: 24px;
      border-left: 4px solid #007bff;
    }
    .me-info-box p {
      margin: 0;
      font-size: 14px;
      color: #333;
      line-height: 1.5;
    }
    .me-info-box.warning {
      background: #fff3cd;
      border-left-color: #ffc107;
    }

    /* Progress overlay */
    .me-progress-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10001;
    }
    .me-progress-container {
      text-align: center;
      max-width: 400px;
      padding: 40px;
    }
    .me-progress-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e0e0e0;
      border-top-color: #333;
      border-radius: 50%;
      animation: me-spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes me-spin {
      to { transform: rotate(360deg); }
    }
    .me-progress-status {
      font-size: 16px;
      color: #333;
      margin-bottom: 8px;
    }
    .me-progress-detail {
      font-size: 14px;
      color: #666;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .me-header {
        flex-direction: column;
        align-items: stretch;
      }
      .me-header h2 {
        text-align: center;
      }
      .me-events-grid {
        grid-template-columns: 1fr;
      }
      .me-event-actions {
        flex-direction: column;
      }
      .me-modal-footer {
        flex-direction: column;
      }
      .me-modal-footer .me-btn {
        width: 100%;
      }
    }
  `;

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function formatDateInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  }

  function calculateExpiryDate(eventEndDate) {
    if (!eventEndDate) return null;
    const endDate = new Date(eventEndDate);
    const maxExpiry = new Date();
    maxExpiry.setDate(maxExpiry.getDate() + MAX_EXPIRY_DAYS);
    const expiryDate = endDate > maxExpiry ? maxExpiry : endDate;
    return expiryDate.toISOString();
  }

  function generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100);
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
    const testUrl = url.trim();
    if (!/^https?:\/\//i.test(testUrl)) return false;
    try {
      const parsed = new URL(testUrl);
      if (!parsed.hostname || !parsed.hostname.includes('.')) return false;
      return true;
    } catch {
      return false;
    }
  }

  function getStatusLabel(status) {
    const labels = {
      [STATUS.DRAFT]: 'Draft',
      [STATUS.PENDING_REVIEW]: 'Pending Review',
      [STATUS.PUBLISHED]: 'Published',
      [STATUS.CHANGES_REQUESTED]: 'Changes Requested'
    };
    return labels[status] || status || 'Draft';
  }

  function getEventStatus(event) {
    if (event.is_draft === false && event.is_archived === false) {
      return STATUS.PUBLISHED;
    }
    if (event.is_draft === true) {
      return STATUS.PENDING_REVIEW;
    }
    return STATUS.DRAFT;
  }

  // ============================================
  // PROGRESS OVERLAY
  // ============================================

  function showProgressOverlay(status, detail = '') {
    let overlay = document.querySelector('.me-progress-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'me-progress-overlay';
      overlay.innerHTML = `
        <div class="me-progress-container">
          <div class="me-progress-spinner"></div>
          <div class="me-progress-status"></div>
          <div class="me-progress-detail"></div>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    overlay.querySelector('.me-progress-status').textContent = status;
    overlay.querySelector('.me-progress-detail').textContent = detail;
    overlay.style.display = 'flex';
    return overlay;
  }

  function hideProgressOverlay() {
    const overlay = document.querySelector('.me-progress-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  // ============================================
  // SUPABASE OPERATIONS
  // ============================================

  async function loadSuburbs() {
    const { data, error } = await supabase
      .from('suburbs')
      .select('id, webflow_id, name, slug')
      .order('name');

    if (error) {
      console.error('Error loading suburbs:', error);
      return [];
    }
    return data || [];
  }

  async function loadEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('memberstack_id', currentMember.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading events:', error);
      throw error;
    }
    return data || [];
  }

  async function createEvent(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }
    return data;
  }

  async function updateEvent(eventId, eventData) {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      throw error;
    }
    return data;
  }

  async function deleteEvent(eventId) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  async function uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${currentMember.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('event-images')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async function waitForMemberstack() {
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

  async function init() {
    const container = document.querySelector('.member-event-submission');
    if (!container) {
      console.warn('Could not find .member-event-submission container');
      return;
    }

    // Check for Supabase library
    if (typeof window.supabase === 'undefined') {
      console.error('Supabase library not loaded');
      container.innerHTML = '<div class="me-loading">Error: Supabase library not loaded. Please refresh the page.</div>';
      return;
    }

    // Initialize Supabase client
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Add styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'me-container';
    wrapper.innerHTML = '<div class="me-loading">Loading your events...</div>';
    container.appendChild(wrapper);

    try {
      await waitForMemberstack();

      const { data: member } = await window.$memberstackDom.getCurrentMember();
      if (!member) {
        wrapper.innerHTML = '<div class="me-loading">Please log in to submit events.</div>';
        return;
      }
      currentMember = member;
      console.log('Current member:', currentMember.id);

      // Load data in parallel
      const [loadedSuburbs, loadedEvents] = await Promise.all([
        loadSuburbs(),
        loadEvents()
      ]);

      suburbs = loadedSuburbs;
      events = loadedEvents;

      console.log('Loaded suburbs:', suburbs.length);
      console.log('Loaded events:', events.length);

      renderEvents(wrapper);
    } catch (error) {
      console.error('Error initializing member events:', error);
      wrapper.innerHTML = '<div class="me-loading">Error loading events. Please refresh the page.</div>';
    }
  }

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  function renderEvents(wrapper) {
    if (events.length === 0) {
      wrapper.innerHTML = `
        <div class="me-empty">
          <p>You haven't submitted any events yet</p>
          <button class="me-btn" id="me-add-first">Submit an Event</button>
        </div>
      `;
      wrapper.querySelector('#me-add-first').addEventListener('click', () => openEventModal(null, wrapper));
      return;
    }

    let html = `
      <div class="me-header">
        <h2>My Events</h2>
        <button class="me-btn" id="me-add-event">Submit New Event</button>
      </div>
      <div class="me-events-grid">
    `;

    events.forEach(event => {
      html += renderEventCard(event);
    });

    html += '</div>';
    wrapper.innerHTML = html;

    wrapper.querySelector('#me-add-event').addEventListener('click', () => openEventModal(null, wrapper));

    wrapper.querySelectorAll('.me-event-card').forEach((card) => {
      const eventId = card.dataset.eventId;
      const event = events.find(e => e.id === eventId);
      if (event) setupEventCard(card, event, wrapper);
    });
  }

  function renderEventCard(event) {
    const status = getEventStatus(event);
    const statusClass = `me-status-${status}`;
    let dateDisplay = event.date_start ? formatDate(event.date_start) : 'Date not set';
    if (event.time_display) {
      dateDisplay += ` | ${event.time_display}`;
    }

    return `
      <div class="me-event-card" data-event-id="${event.id}">
        <div class="me-event-image">
          ${event.feature_image_url
            ? `<img src="${event.feature_image_url}" alt="${event.name}">`
            : '<div class="me-no-image">No image</div>'
          }
          <span class="me-event-status ${statusClass}">${getStatusLabel(status)}</span>
        </div>
        <div class="me-event-body">
          <h3 class="me-event-title">${event.name || 'Untitled Event'}</h3>
          <div class="me-event-date">${dateDisplay}</div>
          <div class="me-event-location">${event.location_name || 'Location not set'}</div>
          <p class="me-event-description">${event.description || 'No description'}</p>
        </div>
        <div class="me-event-actions">
          <button class="me-btn me-btn-secondary me-btn-small me-edit-btn">Edit</button>
          <button class="me-btn me-btn-danger me-btn-small me-delete-btn">Delete</button>
        </div>
      </div>
    `;
  }

  function setupEventCard(card, event, wrapper) {
    const editBtn = card.querySelector('.me-edit-btn');
    const deleteBtn = card.querySelector('.me-delete-btn');

    editBtn.addEventListener('click', () => {
      openEventModal(event, wrapper);
    });

    deleteBtn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete this event?')) return;

      deleteBtn.disabled = true;
      deleteBtn.textContent = 'Deleting...';

      try {
        await deleteEvent(event.id);
        events = events.filter(e => e.id !== event.id);
        renderEvents(wrapper);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please try again.');
        deleteBtn.disabled = false;
        deleteBtn.textContent = 'Delete';
      }
    });
  }

  // ============================================
  // SUBURB DROPDOWN
  // ============================================

  function createSuburbSelect(selectedId) {
    let options = '<option value="">Select a suburb...</option>';
    suburbs.forEach(suburb => {
      const selected = suburb.id === selectedId ? 'selected' : '';
      options += `<option value="${suburb.id}" ${selected}>${suburb.name}</option>`;
    });
    return `<select class="me-form-input" id="me-form-suburb">${options}</select>`;
  }

  // ============================================
  // EVENT MODAL
  // ============================================

  function openEventModal(existingEvent, wrapper) {
    const isEdit = !!existingEvent;
    const event = existingEvent || {};
    const eventData = {
      feature_image_url: event.feature_image_url || ''
    };

    const status = isEdit ? getEventStatus(event) : STATUS.DRAFT;
    const wasPublished = status === STATUS.PUBLISHED;
    const showReviewWarning = isEdit && wasPublished;

    const modal = document.createElement('div');
    modal.className = 'me-modal-overlay';
    modal.innerHTML = `
      <div class="me-modal">
        <div class="me-modal-header">
          <h3>${isEdit ? 'Edit Event' : 'Submit an Event'}</h3>
        </div>
        <div class="me-modal-body">
          ${!isEdit ? `
            <div class="me-info-box">
              <p><strong>How it works:</strong> Submit your event details and our team will review it within 48 hours. Once approved, your event will appear on the MTNS MADE events calendar.</p>
            </div>
          ` : ''}

          ${showReviewWarning ? `
            <div class="me-info-box warning">
              <p><strong>Note:</strong> This event is currently published. Any changes you make will require re-approval and the event will be temporarily unpublished until reviewed.</p>
            </div>
          ` : ''}

          <div class="me-form-field full-width">
            <label>Event Name <span>*</span></label>
            <input type="text" class="me-form-input" id="me-form-name" value="${event.name || ''}" required>
          </div>

          <div class="me-form-row">
            <div class="me-form-field">
              <label>Event Date Start <span>*</span></label>
              <input type="date" class="me-form-input" id="me-form-starts"
                     value="${formatDateInput(event.date_start)}" required>
            </div>
            <div class="me-form-field">
              <label>Event Date End</label>
              <input type="date" class="me-form-input" id="me-form-ends"
                     value="${formatDateInput(event.date_end)}">
              <div class="me-hint">Leave blank if single-day event</div>
            </div>
          </div>

          <div class="me-form-field full-width">
            <label>Time</label>
            <input type="text" class="me-form-input" id="me-form-time"
                   value="${event.time_display || ''}" placeholder="e.g., 6pm - 8pm">
          </div>

          <div class="me-form-field full-width">
            <label>Location Name <span>*</span></label>
            <input type="text" class="me-form-input" id="me-form-location-name"
                   value="${event.location_name || ''}" placeholder="e.g., Blue Mountains Cultural Centre">
          </div>

          <div class="me-form-row">
            <div class="me-form-field">
              <label>Full Street Address</label>
              <input type="text" class="me-form-input" id="me-form-address"
                     value="${event.location_address || ''}" placeholder="e.g., 30 Parke Street">
            </div>
            <div class="me-form-field">
              <label>Suburb</label>
              ${createSuburbSelect(event.suburb_id)}
            </div>
          </div>

          <div class="me-form-field full-width">
            <label>Event Description <span>*</span></label>
            <textarea class="me-form-input" id="me-form-description"
                      placeholder="Describe your event in detail...">${event.description || ''}</textarea>
            <div class="me-hint">A short summary will be automatically generated from this description.</div>
          </div>

          <div class="me-form-field full-width">
            <label>Feature Image <span>*</span></label>
            <div class="me-image-upload ${eventData.feature_image_url ? 'has-image' : ''}" id="me-image-upload">
              ${eventData.feature_image_url ? `<img src="${eventData.feature_image_url}" alt="Feature">` : ''}
              <div class="me-upload-placeholder">
                <span>+</span>
                Click to upload image<br>
                <small>Recommended: 1920x1080px (16:9)</small>
              </div>
              <button type="button" class="me-remove-image">&times;</button>
              <input type="file" id="me-image-input" accept="image/*">
            </div>
          </div>

          <div class="me-form-row">
            <div class="me-form-field">
              <label>RSVP / Tickets Link</label>
              <input type="text" class="me-form-input" id="me-form-rsvp"
                     value="${event.rsvp_link || ''}" placeholder="https://...">
              <div class="me-hint">Link to tickets, registration, or RSVP page</div>
              <div class="me-error-msg" id="me-rsvp-error">Link must be complete and include https://</div>
            </div>
            <div class="me-form-field">
              <label>Eventbrite Event ID</label>
              <input type="text" class="me-form-input" id="me-form-eventbrite"
                     value="${event.eventbrite_id || ''}" placeholder="e.g., 123456789">
              <div class="me-hint">Optional: For Eventbrite integration</div>
            </div>
          </div>

        </div>
        <div class="me-modal-footer">
          <button class="me-btn me-btn-secondary" id="me-modal-cancel">Cancel</button>
          ${isEdit && status === STATUS.DRAFT ? `
            <button class="me-btn me-btn-secondary" id="me-modal-save-draft">Save Draft</button>
          ` : ''}
          <button class="me-btn me-btn-success" id="me-modal-submit">
            ${isEdit ? (wasPublished ? 'Submit for Re-Review' : 'Update & Submit') : 'Submit for Review'}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup image upload
    const imageUpload = modal.querySelector('#me-image-upload');
    const imageInput = modal.querySelector('#me-image-input');

    imageUpload.addEventListener('click', (e) => {
      if (e.target.classList.contains('me-remove-image')) {
        e.stopPropagation();
        eventData.feature_image_url = '';
        eventData.newImageFile = null;
        imageUpload.classList.remove('has-image');
        const img = imageUpload.querySelector('img');
        if (img) img.remove();
        return;
      }
      imageInput.click();
    });

    imageInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        eventData.newImageFile = file;
        imageUpload.classList.add('has-image');
        let img = imageUpload.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          imageUpload.insertBefore(img, imageUpload.firstChild);
        }
        img.src = e.target.result;
        img.alt = 'Feature';
      };
      reader.readAsDataURL(file);
    });

    // Setup RSVP URL validation
    const rsvpInput = modal.querySelector('#me-form-rsvp');
    const rsvpError = modal.querySelector('#me-rsvp-error');
    rsvpInput.addEventListener('blur', () => {
      const isValid = isValidUrl(rsvpInput.value);
      rsvpInput.classList.toggle('error', !isValid && rsvpInput.value);
      rsvpInput.classList.toggle('valid', isValid && rsvpInput.value);
      rsvpError.classList.toggle('visible', !isValid && rsvpInput.value);
    });

    // Close handlers
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    modal.querySelector('#me-modal-cancel').addEventListener('click', () => modal.remove());

    // Save draft (if available)
    const saveDraftBtn = modal.querySelector('#me-modal-save-draft');
    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', async () => {
        await saveEvent(modal, event, eventData, wrapper, false);
      });
    }

    // Submit for review
    modal.querySelector('#me-modal-submit').addEventListener('click', async () => {
      await saveEvent(modal, event, eventData, wrapper, true, wasPublished);
    });
  }

  // ============================================
  // SAVE EVENT
  // ============================================

  async function saveEvent(modal, existingEvent, eventData, wrapper, submitForReview, wasPublished = false) {
    const isEdit = !!existingEvent.id;

    // Get form values
    const name = modal.querySelector('#me-form-name').value.trim();
    const dateStarts = modal.querySelector('#me-form-starts').value;
    const dateEnds = modal.querySelector('#me-form-ends').value;
    const locationName = modal.querySelector('#me-form-location-name').value.trim();
    const description = modal.querySelector('#me-form-description').value.trim();
    const featureImageUrl = eventData.feature_image_url;
    const newImageFile = eventData.newImageFile;

    // Validation
    if (!name) {
      alert('Please enter an event name');
      return;
    }
    if (!dateStarts) {
      alert('Please set when the event starts');
      return;
    }
    if (submitForReview) {
      if (!locationName) {
        alert('Please enter a location name');
        return;
      }
      if (!description) {
        alert('Please enter an event description');
        return;
      }
      if (!featureImageUrl && !newImageFile) {
        alert('Please upload a feature image');
        return;
      }
    }

    // Validate RSVP URL if provided
    const rsvpLink = modal.querySelector('#me-form-rsvp').value.trim();
    if (rsvpLink && !isValidUrl(rsvpLink)) {
      alert('Please enter a valid RSVP link URL');
      return;
    }

    const suburbId = modal.querySelector('#me-form-suburb').value || null;

    const submitBtn = modal.querySelector('#me-modal-submit');
    const saveDraftBtn = modal.querySelector('#me-modal-save-draft');
    submitBtn.disabled = true;
    submitBtn.textContent = submitForReview ? 'Submitting...' : 'Saving...';
    if (saveDraftBtn) saveDraftBtn.disabled = true;

    try {
      showProgressOverlay('Saving event...', 'Please wait');

      // Upload new image if provided
      let finalImageUrl = featureImageUrl;
      if (newImageFile) {
        showProgressOverlay('Uploading image...', 'Please wait');
        finalImageUrl = await uploadImage(newImageFile);
      }

      const eventObj = {
        memberstack_id: currentMember.id,
        member_contact_email: currentMember.auth?.email || '',
        name: name,
        slug: generateSlug(name),
        date_start: dateStarts ? new Date(dateStarts).toISOString() : null,
        date_end: dateEnds ? new Date(dateEnds).toISOString() : null,
        date_expiry: calculateExpiryDate(dateEnds || dateStarts),
        time_display: modal.querySelector('#me-form-time').value.trim() || null,
        location_name: locationName || null,
        location_address: modal.querySelector('#me-form-address').value.trim() || null,
        suburb_id: suburbId,
        description: description || null,
        feature_image_url: finalImageUrl || null,
        rsvp_link: formatUrl(rsvpLink) || null,
        eventbrite_id: modal.querySelector('#me-form-eventbrite').value.trim() || null,
        is_draft: submitForReview ? true : true, // Always draft until admin approves
        is_archived: false
      };

      showProgressOverlay('Saving to database...', 'Please wait');

      let savedEvent;
      if (isEdit) {
        savedEvent = await updateEvent(existingEvent.id, eventObj);
        const index = events.findIndex(e => e.id === existingEvent.id);
        if (index > -1) {
          events[index] = savedEvent;
        }
      } else {
        savedEvent = await createEvent(eventObj);
        events.unshift(savedEvent);
      }

      hideProgressOverlay();
      modal.remove();
      renderEvents(wrapper);

      if (submitForReview) {
        alert(isEdit
          ? 'Your event has been updated and submitted for review.'
          : 'Your event has been submitted for review. We\'ll notify you once it\'s approved.');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      hideProgressOverlay();
      alert('Error saving event. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = submitForReview ? 'Submit for Review' : 'Save';
      if (saveDraftBtn) saveDraftBtn.disabled = false;
    }
  }

  // ============================================
  // RUN
  // ============================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
