// Member Events Script
// Displays, creates, edits, and submits member events for review
// Stores in Memberstack JSON, syncs to Webflow CMS via Zapier webhooks
// Events require approval before publishing

(function() {
  console.log('Member events script loaded');

  // ============================================
  // CONFIGURATION
  // ============================================
  const WEBHOOKS = {
    create: 'https://hooks.zapier.com/hooks/catch/20216239/ul9jvec/',
    update: 'https://hooks.zapier.com/hooks/catch/20216239/ul5bmv5/',
    delete: 'YOUR_DELETE_EVENT_WEBHOOK'
  };

  const UPLOADCARE_PUBLIC_KEY = '4ab46fc683f9c002ae8b';

  // Collection IDs
  const EVENTS_COLLECTION_ID = '64aa21e9193adf43b765fcf1';

  // Maximum days in future for event expiry
  const MAX_EXPIRY_DAYS = 90;

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

  let currentMember = null;
  let events = [];
  let uploadcareLoaded = false;

  // Event status types
  const STATUS = {
    DRAFT: 'draft',
    PENDING_REVIEW: 'pending_review',
    PUBLISHED: 'published',
    CHANGES_REQUESTED: 'changes_requested'
  };

  // Styles - full width, responsive
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

    /* Multi-select for members */
    .me-multiselect {
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #fff;
    }
    .me-multiselect-search {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    .me-multiselect-search input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .me-multiselect-options {
      max-height: 200px;
      overflow-y: auto;
    }
    .me-multiselect-option {
      padding: 10px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background 0.1s;
    }
    .me-multiselect-option:hover {
      background: #f5f5f5;
    }
    .me-multiselect-option.selected {
      background: #e8f4fc;
    }
    .me-multiselect-option input {
      margin: 0;
    }
    .me-multiselect-selected {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #eee;
      min-height: 48px;
    }
    .me-multiselect-selected:empty::before {
      content: 'No members selected';
      color: #999;
      font-size: 13px;
    }
    .me-selected-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #333;
      color: #fff;
      border-radius: 12px;
      font-size: 12px;
    }
    .me-selected-tag button {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 0;
      font-size: 14px;
      line-height: 1;
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

  // Generate unique ID
  function generateId() {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Format date for display
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

  // Format datetime for input (legacy)
  function formatDateTimeLocal(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  // Format date for date input (YYYY-MM-DD)
  function formatDateInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  }

  // Calculate expiry date (max 90 days from event end)
  function calculateExpiryDate(eventEndDate) {
    if (!eventEndDate) return '';
    const endDate = new Date(eventEndDate);
    const maxExpiry = new Date();
    maxExpiry.setDate(maxExpiry.getDate() + MAX_EXPIRY_DAYS);

    // Use the earlier of: event end date or 90 days from now
    const expiryDate = endDate > maxExpiry ? maxExpiry : endDate;
    return expiryDate.toISOString();
  }

  // Load Uploadcare script
  function loadUploadcare() {
    return new Promise((resolve) => {
      if (uploadcareLoaded || window.uploadcare) {
        uploadcareLoaded = true;
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js';
      script.onload = () => {
        uploadcareLoaded = true;
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  // Open Uploadcare dialog
  function openImageUpload(callback) {
    if (!window.uploadcare) {
      console.error('Uploadcare not loaded');
      return;
    }

    const dialog = uploadcare.openDialog(null, {
      publicKey: UPLOADCARE_PUBLIC_KEY,
      imagesOnly: true,
      crop: '16:9',
      imageShrink: '1920x1080'
    });

    dialog.done((file) => {
      file.promise().done((fileInfo) => {
        callback(fileInfo.cdnUrl);
      });
    });
  }

  // Sanitize text for JSON/API
  function sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/[\r\n]+/g, ' ')
      .replace(/[\x00-\x1F\x7F]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Format URL for Webflow Link field
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

  // Validate URL - must be complete with https:// and valid domain
  function isValidUrl(url) {
    if (!url || url.trim() === '') return true; // Empty is OK
    const testUrl = url.trim();

    // Must start with https:// or http://
    if (!/^https?:\/\//i.test(testUrl)) {
      return false;
    }

    try {
      const parsed = new URL(testUrl);
      // Must have a valid hostname with at least one dot (e.g., google.com)
      if (!parsed.hostname || !parsed.hostname.includes('.')) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  // Get status label
  function getStatusLabel(status) {
    const labels = {
      [STATUS.DRAFT]: 'Draft',
      [STATUS.PENDING_REVIEW]: 'Pending Review',
      [STATUS.PUBLISHED]: 'Published',
      [STATUS.CHANGES_REQUESTED]: 'Changes Requested'
    };
    return labels[status] || status;
  }

  // Send webhook to Zapier
  async function sendWebhook(action, event) {
    const webhookUrl = WEBHOOKS[action];

    if (!webhookUrl || webhookUrl.includes('YOUR_')) {
      console.warn(`Webhook not configured for action: ${action}`);
      return { success: false, error: 'Webhook not configured' };
    }

    const memberWebflowId = currentMember.customFields?.['webflow-member-id'] || '';

    const payload = {
      action: action,
      event_id: event.id,
      webflow_item_id: event.webflow_item_id || '',
      member_webflow_id: memberWebflowId,
      memberstack_id: currentMember.id,
      member_email: currentMember.auth?.email || '',
      // Event fields
      name: sanitizeText(event.name),
      slug: event.name ? event.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '',
      'date-event-starts': event.date_event_starts || '',
      'date-event-ends': event.date_event_ends || '',
      'event-expiry-date': event.event_expiry_date || '',
      'time': sanitizeText(event.time || ''),
      'location-name': sanitizeText(event.location_name || ''),
      'location-full-street-address': sanitizeText(event.location_full_address || ''),
      'choose-suburb': event.suburb_id || '',
      'description': event.description || '',
      'feature-image': event.feature_image || '',
      'eventbrite-event-id': sanitizeText(event.eventbrite_id || ''),
      'rsvp-link': formatUrl(event.rsvp_link || ''),
      'members-involved-in-this-event': event.members_involved || [],
      // Status
      status: event.status || STATUS.PENDING_REVIEW,
      is_edit: action === 'update' && event.was_published === true
    };

    console.log(`Sending ${action} webhook:`, payload);

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });

      console.log(`Webhook ${action} sent successfully`);
      return { success: true };
    } catch (error) {
      console.error(`Webhook ${action} failed:`, error);
      return { success: false, error: error.message };
    }
  }

  // Wait for Memberstack
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

  // Load events from member JSON
  async function loadEvents() {
    try {
      const { data } = await window.$memberstackDom.getMemberJSON();
      events = (data && data.memberEvents) || [];
      events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      console.log('Loaded events:', events.length);
    } catch (error) {
      console.error('Error loading events:', error);
      events = [];
    }
  }

  // Save events to member JSON
  async function saveEvents() {
    try {
      const { data: existingData } = await window.$memberstackDom.getMemberJSON();
      const mergedData = { ...existingData, memberEvents: events };

      await window.$memberstackDom.updateMemberJSON({
        json: mergedData
      });
      console.log('Events saved');
    } catch (error) {
      console.error('Error saving events:', error);
      throw error;
    }
  }


  // Initialize
  async function init() {
    const container = document.querySelector('.member-event-submission');
    if (!container) {
      console.warn('Could not find .member-event-submission container');
      return;
    }

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
      // Load dependencies in parallel
      await Promise.all([
        loadUploadcare(),
        waitForMemberstack()
      ]);

      // Get current member
      const { data: member } = await window.$memberstackDom.getCurrentMember();
      if (!member) {
        wrapper.innerHTML = '<div class="me-loading">Please log in to submit events.</div>';
        return;
      }
      currentMember = member;
      console.log('Current member:', currentMember.id);

      // Load events
      await loadEvents();

      // Render
      renderEvents(wrapper);
    } catch (error) {
      console.error('Error initializing member events:', error);
      wrapper.innerHTML = '<div class="me-loading">Error loading events. Please refresh the page.</div>';
    }
  }

  // Render events list
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

    wrapper.querySelectorAll('.me-event-card').forEach((card, index) => {
      const event = events[index];
      setupEventCard(card, event, wrapper);
    });
  }

  // Render single event card
  function renderEventCard(event) {
    const statusClass = `me-status-${event.status || STATUS.DRAFT}`;
    let dateDisplay = event.date_event_starts ? formatDate(event.date_event_starts) : 'Date not set';
    if (event.time) {
      dateDisplay += ` | ${event.time}`;
    }

    return `
      <div class="me-event-card" data-event-id="${event.id}">
        <div class="me-event-image">
          ${event.feature_image
            ? `<img src="${event.feature_image}" alt="${event.name}">`
            : '<div class="me-no-image">No image</div>'
          }
          <span class="me-event-status ${statusClass}">${getStatusLabel(event.status)}</span>
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

  // Setup event card interactions
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
        await loadEvents();
        const freshEvent = events.find(e => e.id === event.id);

        if (freshEvent && freshEvent.webflow_item_id) {
          await sendWebhook('delete', freshEvent);
        }

        events = events.filter(e => e.id !== event.id);
        await saveEvents();
        renderEvents(wrapper);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please try again.');
        deleteBtn.disabled = false;
        deleteBtn.textContent = 'Delete';
      }
    });
  }

  // Create suburb dropdown HTML
  function createSuburbSelect(selectedId) {
    let options = '<option value="">Select a suburb...</option>';
    SUBURBS.forEach(suburb => {
      const selected = suburb.id === selectedId ? 'selected' : '';
      options += `<option value="${suburb.id}" ${selected}>${suburb.name}</option>`;
    });

    return `<select class="me-form-input" id="me-form-suburb">${options}</select>`;
  }


  // Open event modal (create or edit)
  function openEventModal(existingEvent, wrapper) {
    const isEdit = !!existingEvent;
    const event = existingEvent || {};
    const eventData = {
      feature_image: event.feature_image || ''
    };

    // Check if editing a published event
    const wasPublished = event.status === STATUS.PUBLISHED;
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
                     value="${formatDateInput(event.date_event_starts)}" required>
            </div>
            <div class="me-form-field">
              <label>Event Date End</label>
              <input type="date" class="me-form-input" id="me-form-ends"
                     value="${formatDateInput(event.date_event_ends)}">
              <div class="me-hint">Leave blank if single-day event</div>
            </div>
          </div>

          <div class="me-form-field full-width">
            <label>Time</label>
            <input type="text" class="me-form-input" id="me-form-time"
                   value="${event.time || ''}" placeholder="e.g., 6pm - 8pm">
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
                     value="${event.location_full_address || ''}" placeholder="e.g., 30 Parke Street">
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
            <div class="me-image-upload ${eventData.feature_image ? 'has-image' : ''}" id="me-image-upload">
              ${eventData.feature_image ? `<img src="${eventData.feature_image}" alt="Feature">` : ''}
              <div class="me-upload-placeholder">
                <span>+</span>
                Click to upload image<br>
                <small>Recommended: 1920x1080px (16:9)</small>
              </div>
              <button type="button" class="me-remove-image">&times;</button>
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
          ${isEdit && event.status === STATUS.DRAFT ? `
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
    imageUpload.addEventListener('click', (e) => {
      if (e.target.classList.contains('me-remove-image')) {
        e.stopPropagation();
        eventData.feature_image = '';
        imageUpload.classList.remove('has-image');
        const img = imageUpload.querySelector('img');
        if (img) img.remove();
        return;
      }

      openImageUpload((url) => {
        eventData.feature_image = url;
        imageUpload.classList.add('has-image');
        let img = imageUpload.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          imageUpload.insertBefore(img, imageUpload.firstChild);
        }
        img.src = url;
        img.alt = 'Feature';
      });
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

  // Save event
  async function saveEvent(modal, existingEvent, eventData, wrapper, submitForReview, wasPublished = false) {
    const isEdit = !!existingEvent.id;

    // Get form values
    const name = modal.querySelector('#me-form-name').value.trim();
    const dateStarts = modal.querySelector('#me-form-starts').value;
    const dateEnds = modal.querySelector('#me-form-ends').value;
    const locationName = modal.querySelector('#me-form-location-name').value.trim();
    const description = modal.querySelector('#me-form-description').value.trim();
    const featureImage = eventData.feature_image;

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
      if (!featureImage) {
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

    // Get suburb
    const suburbEl = modal.querySelector('#me-form-suburb');
    const suburbId = suburbEl.tagName === 'SELECT' ? suburbEl.value : '';
    const suburbName = suburbEl.tagName === 'INPUT' ? suburbEl.value.trim() : '';

    const submitBtn = modal.querySelector('#me-modal-submit');
    const saveDraftBtn = modal.querySelector('#me-modal-save-draft');
    submitBtn.disabled = true;
    submitBtn.textContent = submitForReview ? 'Submitting...' : 'Saving...';
    if (saveDraftBtn) saveDraftBtn.disabled = true;

    const eventObj = {
      id: existingEvent.id || generateId(),
      name: name,
      date_event_starts: dateStarts ? new Date(dateStarts).toISOString() : '',
      date_event_ends: dateEnds ? new Date(dateEnds).toISOString() : '',
      event_expiry_date: calculateExpiryDate(dateEnds || dateStarts),
      time: modal.querySelector('#me-form-time').value.trim(),
      location_name: locationName,
      location_full_address: modal.querySelector('#me-form-address').value.trim(),
      suburb_id: suburbId,
      suburb_name: suburbName,
      description: description,
      feature_image: featureImage,
      rsvp_link: rsvpLink,
      eventbrite_id: modal.querySelector('#me-form-eventbrite').value.trim(),
      members_involved: [], // Admin adds members during review
      status: submitForReview ? STATUS.PENDING_REVIEW : STATUS.DRAFT,
      was_published: wasPublished,
      webflow_item_id: existingEvent.webflow_item_id || '',
      created_at: existingEvent.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      if (isEdit) {
        const index = events.findIndex(e => e.id === eventObj.id);
        if (index > -1) {
          events[index] = eventObj;
        }
      } else {
        events.unshift(eventObj);
      }

      await saveEvents();

      if (submitForReview) {
        // Use webflow_item_id to determine create vs update
        // If no webflow_item_id exists, it's a create (even if editing a local draft)
        const action = eventObj.webflow_item_id ? 'update' : 'create';
        await sendWebhook(action, eventObj);
      }

      modal.remove();
      renderEvents(wrapper);

      if (submitForReview) {
        alert(isEdit
          ? 'Your event has been updated and submitted for review.'
          : 'Your event has been submitted for review. We\'ll notify you once it\'s approved.');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = submitForReview ? 'Submit for Review' : 'Save';
      if (saveDraftBtn) saveDraftBtn.disabled = false;
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
