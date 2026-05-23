// Member Opportunities Supabase Script
// Displays, creates, edits, and submits member job/opportunity listings for review
// Stores in Supabase; opportunities require approval before appearing on the public board

(function() {
  console.log('Member opportunities Supabase script loaded');

  // ============================================
  // CONFIGURATION
  // ============================================
  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH';

  const OPPORTUNITY_TYPES = [
    { value: 'job', label: 'Job / Employment' },
    { value: 'commission', label: 'Commission' },
    { value: 'collaboration', label: 'Collaboration' },
    { value: 'call-for-entries', label: 'Call for Entries' },
    { value: 'residency', label: 'Residency / Fellowship' },
    { value: 'volunteer', label: 'Volunteer' },
  ];

  let supabase = null;
  let currentMember = null;
  let opportunities = [];
  let suburbs = [];

  const STATUS = {
    DRAFT: 'draft',
    PENDING_REVIEW: 'pending_review',
    PUBLISHED: 'published',
    REJECTED: 'rejected'
  };

  // ============================================
  // STYLES
  // ============================================
  const styles = `
    .mo-container { font-family: inherit; width: 100%; }
    .mo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .mo-header h2 { margin: 0; font-size: 24px; color: #333; }
    .mo-btn { background: #333; color: #fff; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 14px; transition: background 0.2s; }
    .mo-btn:hover { background: #555; }
    .mo-btn:disabled { background: #999; cursor: not-allowed; }
    .mo-btn-secondary { background: #fff; color: #333; border: 1px solid #ddd; }
    .mo-btn-secondary:hover { background: #f5f5f5; }
    .mo-btn-danger { background: #dc3545; }
    .mo-btn-danger:hover { background: #c82333; }
    .mo-btn-success { background: #28a745; }
    .mo-btn-success:hover { background: #218838; }
    .mo-btn-small { padding: 8px 16px; font-size: 13px; }
    .mo-loading { text-align: center; padding: 60px 20px; color: #666; }
    .mo-empty { text-align: center; padding: 60px 20px; background: #f9f9f9; border-radius: 8px; border: 2px dashed #ddd; }
    .mo-empty p { margin: 0 0 20px 0; color: #666; font-size: 16px; }

    /* Opportunity Cards */
    .mo-list { display: flex; flex-direction: column; gap: 16px; }
    .mo-card { border: 1px solid #e0e0e0; border-radius: 8px; background: #fff; overflow: hidden; }
    .mo-card-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 20px; gap: 12px; }
    .mo-card-title { margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #333; }
    .mo-card-meta { font-size: 13px; color: #666; }
    .mo-card-status { flex-shrink: 0; }
    .mo-status { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .mo-status-draft { background: #6c757d; color: #fff; }
    .mo-status-pending_review { background: #ffc107; color: #333; }
    .mo-status-published { background: #28a745; color: #fff; }
    .mo-status-rejected { background: #dc3545; color: #fff; }
    .mo-card-body { padding: 0 20px 16px; }
    .mo-card-description { font-size: 14px; color: #666; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .mo-card-actions { display: flex; gap: 10px; padding: 16px 20px; border-top: 1px solid #e0e0e0; background: #fafafa; }
    .mo-card-actions .mo-btn { flex: 1; }

    /* Modal */
    .mo-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px; }
    .mo-modal { background: #fff; border-radius: 8px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; }
    .mo-modal-header { padding: 20px 24px; border-bottom: 1px solid #e0e0e0; position: sticky; top: 0; background: #fff; z-index: 1; }
    .mo-modal-header h3 { margin: 0; font-size: 20px; color: #333; }
    .mo-modal-body { padding: 24px; }
    .mo-modal-footer { padding: 20px 24px; border-top: 1px solid #e0e0e0; display: flex; gap: 12px; justify-content: flex-end; position: sticky; bottom: 0; background: #fff; }

    /* Form */
    .mo-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    @media (max-width: 600px) { .mo-form-row { grid-template-columns: 1fr; } }
    .mo-form-field { margin-bottom: 20px; }
    .mo-form-field.full-width { grid-column: 1 / -1; }
    .mo-form-field label { display: block; font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px; }
    .mo-form-field label span { color: #dc3545; }
    .mo-hint { font-size: 12px; color: #666; margin-top: 4px; }
    .mo-form-input { width: 100%; padding: 12px 14px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; font-family: inherit; box-sizing: border-box; transition: border-color 0.2s; }
    .mo-form-input:focus { outline: none; border-color: #333; }
    .mo-form-input.error { border-color: #dc3545; }
    textarea.mo-form-input { min-height: 120px; resize: vertical; }
    select.mo-form-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
    .mo-error-msg { font-size: 12px; color: #dc3545; margin-top: 4px; display: none; }
    .mo-error-msg.visible { display: block; }

    /* Info box */
    .mo-info-box { padding: 16px; background: #e8f4fc; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #007bff; }
    .mo-info-box p { margin: 0; font-size: 14px; color: #333; line-height: 1.5; }
    .mo-info-box.warning { background: #fff3cd; border-left-color: #ffc107; }

    /* Progress overlay */
    .mo-progress-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10001; }
    .mo-progress-container { text-align: center; max-width: 400px; padding: 40px; }
    .mo-progress-spinner { width: 48px; height: 48px; border: 4px solid #e0e0e0; border-top-color: #333; border-radius: 50%; animation: mo-spin 1s linear infinite; margin: 0 auto 20px; }
    @keyframes mo-spin { to { transform: rotate(360deg); } }
    .mo-progress-status { font-size: 16px; color: #333; margin-bottom: 8px; }
    .mo-progress-detail { font-size: 14px; color: #666; }

    @media (max-width: 480px) {
      .mo-header { flex-direction: column; align-items: stretch; }
      .mo-header h2 { text-align: center; }
      .mo-card-actions { flex-direction: column; }
      .mo-modal-footer { flex-direction: column; }
      .mo-modal-footer .mo-btn { width: 100%; }
    }
  `;

  // ============================================
  // HELPERS
  // ============================================

  function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  function createSlugBase(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 100);
  }

  async function generateUniqueSlug(name) {
    const baseSlug = createSlugBase(name);
    const { data: existing } = await supabase.from('opportunities').select('slug').eq('slug', baseSlug).maybeSingle();
    if (!existing) return baseSlug;
    const { data: similar } = await supabase.from('opportunities').select('slug').like('slug', `${baseSlug}-%`);
    const existingSlugs = new Set((similar || []).map(o => o.slug));
    existingSlugs.add(baseSlug);
    let counter = 2;
    while (existingSlugs.has(`${baseSlug}-${counter}`)) counter++;
    return `${baseSlug}-${counter}`;
  }

  function formatUrl(url) {
    if (!url || url.trim() === '') return '';
    let formatted = url.trim();
    if (!/^https?:\/\//i.test(formatted)) formatted = 'https://' + formatted;
    try { new URL(formatted); return formatted; } catch { return ''; }
  }

  function isValidUrl(url) {
    if (!url || url.trim() === '') return true;
    const testUrl = url.trim();
    if (!/^https?:\/\//i.test(testUrl)) return false;
    try {
      const parsed = new URL(testUrl);
      return !!(parsed.hostname && parsed.hostname.includes('.'));
    } catch { return false; }
  }

  function getOpportunityStatus(opp) {
    if (opp.is_archived === true) return STATUS.REJECTED;
    if (opp.is_draft === false) return STATUS.PUBLISHED;
    if (opp.is_draft === true) return STATUS.PENDING_REVIEW;
    return STATUS.DRAFT;
  }

  function getStatusLabel(status) {
    const labels = {
      [STATUS.DRAFT]: 'Draft',
      [STATUS.PENDING_REVIEW]: 'Pending Review',
      [STATUS.PUBLISHED]: 'Published',
      [STATUS.REJECTED]: 'Not Approved'
    };
    return labels[status] || status || 'Draft';
  }

  function getTypeLabel(value) {
    return OPPORTUNITY_TYPES.find(t => t.value === value)?.label || value || '';
  }

  // ============================================
  // PROGRESS OVERLAY
  // ============================================

  function showProgressOverlay(status, detail = '') {
    let overlay = document.querySelector('.mo-progress-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mo-progress-overlay';
      overlay.innerHTML = `
        <div class="mo-progress-container">
          <div class="mo-progress-spinner"></div>
          <div class="mo-progress-status"></div>
          <div class="mo-progress-detail"></div>
        </div>`;
      document.body.appendChild(overlay);
    }
    overlay.querySelector('.mo-progress-status').textContent = status;
    overlay.querySelector('.mo-progress-detail').textContent = detail;
    overlay.style.display = 'flex';
  }

  function hideProgressOverlay() {
    const overlay = document.querySelector('.mo-progress-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  // ============================================
  // SUPABASE OPERATIONS
  // ============================================

  async function loadSuburbs() {
    const { data, error } = await supabase.from('suburbs').select('id, name').order('name');
    if (error) { console.error('Error loading suburbs:', error); return []; }
    return data || [];
  }

  async function loadOpportunities() {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('memberstack_id', currentMember.id)
      .order('created_at', { ascending: false });
    if (error) { console.error('Error loading opportunities:', error); throw error; }
    return data || [];
  }

  async function createOpportunity(data) {
    const { data: result, error } = await supabase.from('opportunities').insert([data]).select().single();
    if (error) { console.error('Error creating opportunity:', error); throw error; }
    return result;
  }

  async function updateOpportunity(id, data) {
    const { data: result, error } = await supabase.from('opportunities').update(data).eq('id', id).select().single();
    if (error) { console.error('Error updating opportunity:', error); throw error; }
    return result;
  }

  async function deleteOpportunity(id) {
    // If the opportunity is published (has webflow_id), archive it in Webflow first
    const opp = opportunities.find(o => o.id === id);
    if (opp?.webflow_id) {
      try {
        const token = (await window.$memberstackDom.getMemberToken())?.data?.token || '';
        await fetch(`${SUPABASE_URL}/functions/v1/manage-opportunity`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
            'X-Member-Token': token,
          },
          body: JSON.stringify({ opportunityId: id, action: 'reject' }),
        });
      } catch (err) {
        console.warn('Webflow cleanup failed, proceeding with delete:', err);
      }
    }

    const { error } = await supabase.from('opportunities').delete().eq('id', id);
    if (error) { console.error('Error deleting opportunity:', error); throw error; }
  }

  // ============================================
  // ACTIVITY LOGGING
  // ============================================

  async function logActivity(activityType, entity = null) {
    try {
      const payload = { memberstack_id: currentMember.id, activity_type: activityType };
      if (entity) { payload.entity_type = 'opportunity'; payload.entity_id = entity.id || null; payload.entity_name = entity.name || null; }
      await fetch(`${SUPABASE_URL}/functions/v1/log-activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'apikey': SUPABASE_ANON_KEY },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.warn('Failed to log activity:', error);
    }
  }

  async function notifyAdminSubmission(opp, isUpdate = false) {
    try {
      const memberName = currentMember.customFields?.['first-name']
        ? `${currentMember.customFields['first-name']} ${currentMember.customFields['last-name'] || ''}`.trim()
        : currentMember.auth?.email || 'Unknown Member';

      await fetch(`${SUPABASE_URL}/functions/v1/notify-opportunity-submission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'apikey': SUPABASE_ANON_KEY },
        body: JSON.stringify({
          opportunityName: opp.name,
          opportunityType: getTypeLabel(opp.opportunity_type),
          memberName,
          memberEmail: currentMember.auth?.email || '',
          isUpdate,
        }),
      });
    } catch (error) {
      console.warn('Failed to notify admin:', error);
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async function waitForMemberstack() {
    return new Promise((resolve) => {
      if (window.$memberstackDom) return resolve();
      const check = setInterval(() => { if (window.$memberstackDom) { clearInterval(check); resolve(); } }, 100);
    });
  }

  async function init() {
    const container = document.querySelector('.member-opportunity-submission');
    if (!container) { console.warn('Could not find .member-opportunity-submission container'); return; }

    if (typeof window.supabase === 'undefined') {
      container.innerHTML = '<div class="mo-loading">Error: Supabase library not loaded. Please refresh the page.</div>';
      return;
    }

    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const wrapper = document.createElement('div');
    wrapper.className = 'mo-container';
    wrapper.innerHTML = '<div class="mo-loading">Loading your listings...</div>';
    container.appendChild(wrapper);

    try {
      await waitForMemberstack();

      const { data: member } = await window.$memberstackDom.getCurrentMember();
      if (!member) { wrapper.innerHTML = '<div class="mo-loading">Please log in to manage listings.</div>'; return; }
      currentMember = member;

      const [loadedSuburbs, loadedOpportunities] = await Promise.all([loadSuburbs(), loadOpportunities()]);
      suburbs = loadedSuburbs;
      opportunities = loadedOpportunities;

      renderOpportunities(wrapper);
    } catch (error) {
      console.error('Error initializing member opportunities:', error);
      wrapper.innerHTML = '<div class="mo-loading">Error loading listings. Please refresh the page.</div>';
    }
  }

  // ============================================
  // RENDER
  // ============================================

  function renderOpportunities(wrapper) {
    if (opportunities.length === 0) {
      wrapper.innerHTML = `
        <div class="mo-empty">
          <p>You haven't posted any opportunities yet</p>
          <button class="mo-btn" id="mo-add-first">Post an Opportunity</button>
        </div>`;
      wrapper.querySelector('#mo-add-first').addEventListener('click', () => openModal(null, wrapper));
      return;
    }

    wrapper.innerHTML = `
      <div class="mo-header">
        <h2>My Opportunities</h2>
        <button class="mo-btn" id="mo-add-opp">Post New Opportunity</button>
      </div>
      <div class="mo-list">
        ${opportunities.map(opp => renderCard(opp)).join('')}
      </div>`;

    wrapper.querySelector('#mo-add-opp').addEventListener('click', () => openModal(null, wrapper));

    wrapper.querySelectorAll('.mo-card').forEach(card => {
      const opp = opportunities.find(o => o.id === card.dataset.oppId);
      if (opp) setupCard(card, opp, wrapper);
    });
  }

  function renderCard(opp) {
    const status = getOpportunityStatus(opp);
    const typeLabel = getTypeLabel(opp.opportunity_type);
    const meta = [typeLabel, opp.closing_date ? `Closes ${formatDate(opp.closing_date)}` : ''].filter(Boolean).join(' · ');

    return `
      <div class="mo-card" data-opp-id="${opp.id}">
        <div class="mo-card-header">
          <div>
            <h3 class="mo-card-title">${opp.name || 'Untitled'}</h3>
            <div class="mo-card-meta">${meta}</div>
          </div>
          <div class="mo-card-status">
            <span class="mo-status mo-status-${status}">${getStatusLabel(status)}</span>
          </div>
        </div>
        ${opp.description ? `<div class="mo-card-body"><p class="mo-card-description">${opp.description}</p></div>` : ''}
        <div class="mo-card-actions">
          <button class="mo-btn mo-btn-secondary mo-btn-small mo-edit-btn">Edit</button>
          <button class="mo-btn mo-btn-danger mo-btn-small mo-delete-btn">Delete</button>
        </div>
      </div>`;
  }

  function setupCard(card, opp, wrapper) {
    card.querySelector('.mo-edit-btn').addEventListener('click', () => openModal(opp, wrapper));

    card.querySelector('.mo-delete-btn').addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete this listing?')) return;
      const btn = card.querySelector('.mo-delete-btn');
      btn.disabled = true;
      btn.textContent = 'Deleting...';
      try {
        await deleteOpportunity(opp.id);
        opportunities = opportunities.filter(o => o.id !== opp.id);
        renderOpportunities(wrapper);
      } catch (error) {
        console.error('Error deleting opportunity:', error);
        alert('Error deleting listing. Please try again.');
        btn.disabled = false;
        btn.textContent = 'Delete';
      }
    });
  }

  // ============================================
  // MODAL
  // ============================================

  function createSuburbSelect(selectedId) {
    let options = '<option value="">Select a suburb... (optional)</option>';
    suburbs.forEach(s => {
      options += `<option value="${s.id}" ${s.id === selectedId ? 'selected' : ''}>${s.name}</option>`;
    });
    return `<select class="mo-form-input" id="mo-form-suburb">${options}</select>`;
  }

  function createTypeSelect(selectedValue) {
    let options = '<option value="">Select a type...</option>';
    OPPORTUNITY_TYPES.forEach(t => {
      options += `<option value="${t.value}" ${t.value === selectedValue ? 'selected' : ''}>${t.label}</option>`;
    });
    return `<select class="mo-form-input" id="mo-form-type">${options}</select>`;
  }

  function openModal(existingOpp, wrapper) {
    const isEdit = !!existingOpp;
    const opp = existingOpp || {};
    const status = isEdit ? getOpportunityStatus(opp) : STATUS.DRAFT;
    const wasPublished = status === STATUS.PUBLISHED;
    const wasRejected = status === STATUS.REJECTED;
    const showReviewWarning = isEdit && (wasPublished || wasRejected);

    const modal = document.createElement('div');
    modal.className = 'mo-modal-overlay';
    modal.innerHTML = `
      <div class="mo-modal">
        <div class="mo-modal-header">
          <h3>${isEdit ? 'Edit Listing' : 'Post an Opportunity'}</h3>
        </div>
        <div class="mo-modal-body">
          ${!isEdit ? `
            <div class="mo-info-box">
              <p><strong>How it works:</strong> Submit your listing and our team will review it within 48 hours. Once approved, it will appear on the MTNS MADE jobs and opportunities board.</p>
            </div>` : ''}
          ${showReviewWarning ? `
            <div class="mo-info-box warning">
              <p><strong>Note:</strong> ${wasRejected
                ? 'This listing was not approved. You can edit and resubmit it for review.'
                : 'This listing is currently published. Any changes will require re-approval.'
              }</p>
            </div>` : ''}

          <div class="mo-form-field full-width">
            <label>Job / Opportunity Title <span>*</span></label>
            <input type="text" class="mo-form-input" id="mo-form-name" value="${opp.name || ''}" placeholder="e.g., Seeking textile artist for collaboration">
          </div>

          <div class="mo-form-row">
            <div class="mo-form-field">
              <label>Opportunity Type <span>*</span></label>
              ${createTypeSelect(opp.opportunity_type)}
            </div>
            <div class="mo-form-field">
              <label>Trading Name / Business Name</label>
              <input type="text" class="mo-form-input" id="mo-form-org" value="${opp.organization || ''}" placeholder="Your name or business">
            </div>
          </div>

          <div class="mo-form-row">
            <div class="mo-form-field">
              <label>Closing Date <span>*</span></label>
              <input type="date" class="mo-form-input" id="mo-form-closing" value="${opp.closing_date || ''}">
            </div>
            <div class="mo-form-field">
              <label>Budget <span>*</span></label>
              <input type="text" class="mo-form-input" id="mo-form-budget" value="${opp.budget || ''}" placeholder="e.g. $500–1000 AUD">
            </div>
          </div>

          <div class="mo-form-field full-width">
            <label>Summary of Job or Opportunity <span>*</span></label>
            <textarea class="mo-form-input" id="mo-form-description" placeholder="Describe the opportunity, what you're looking for, and any key details...">${opp.description || ''}</textarea>
          </div>

          <div class="mo-form-field full-width">
            <label>Criteria <span>*</span></label>
            <textarea class="mo-form-input" id="mo-form-criteria" style="min-height:100px" placeholder="List the required or desired attributes for applicants...">${opp.criteria || ''}</textarea>
            <div class="mo-hint">Required or desired attributes the applicant should have</div>
          </div>

          <div class="mo-form-row">
            <div class="mo-form-field">
              <label>Link to Full Details</label>
              <input type="text" class="mo-form-input" id="mo-form-url" value="${opp.opportunity_url || ''}" placeholder="https://...">
              <div class="mo-hint">External job listing, application form, etc.</div>
              <div class="mo-error-msg" id="mo-url-error">Link must be complete and include https://</div>
            </div>
            <div class="mo-form-field">
              <label>Suburb</label>
              ${createSuburbSelect(opp.suburb_id)}
            </div>
          </div>

          <div class="mo-form-field">
            <label style="display:flex;align-items:center;gap:8px;font-weight:400;cursor:pointer">
              <input type="checkbox" id="mo-form-remote" ${opp.is_remote ? 'checked' : ''}>
              Remote / location flexible
            </label>
          </div>

        </div>
        <div class="mo-modal-footer">
          <button class="mo-btn mo-btn-secondary" id="mo-modal-cancel">Cancel</button>
          <button class="mo-btn mo-btn-success" id="mo-modal-submit">
            ${isEdit ? (wasPublished || wasRejected ? 'Submit for Re-Review' : 'Update & Submit') : 'Submit for Review'}
          </button>
        </div>
      </div>`;

    document.body.appendChild(modal);

    // URL validation
    const urlInput = modal.querySelector('#mo-form-url');
    const urlError = modal.querySelector('#mo-url-error');
    urlInput.addEventListener('blur', () => {
      const isValid = isValidUrl(urlInput.value);
      urlInput.classList.toggle('error', !isValid && urlInput.value);
      urlError.classList.toggle('visible', !isValid && urlInput.value);
    });

    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    modal.querySelector('#mo-modal-cancel').addEventListener('click', () => modal.remove());
    modal.querySelector('#mo-modal-submit').addEventListener('click', () => saveOpportunity(modal, opp, wrapper, wasPublished));
  }

  // ============================================
  // SAVE
  // ============================================

  async function saveOpportunity(modal, existingOpp, wrapper, wasPublished) {
    const isEdit = !!existingOpp.id;

    const name = modal.querySelector('#mo-form-name').value.trim();
    const opportunityType = modal.querySelector('#mo-form-type').value;
    const description = modal.querySelector('#mo-form-description').value.trim();
    const budget = modal.querySelector('#mo-form-budget').value.trim();
    const criteria = modal.querySelector('#mo-form-criteria').value.trim();
    const closingDate = modal.querySelector('#mo-form-closing').value;
    const urlInput = modal.querySelector('#mo-form-url').value.trim();

    if (!name) { alert('Please enter a listing title'); return; }
    if (!opportunityType) { alert('Please select an opportunity type'); return; }
    if (!closingDate) { alert('Please enter a closing date'); return; }
    if (!budget) { alert('Please enter a budget or remuneration'); return; }
    if (!description) { alert('Please enter a summary of the opportunity'); return; }
    if (!criteria) { alert('Please enter the criteria for applicants'); return; }
    if (urlInput && !isValidUrl(urlInput)) { alert('Please enter a valid link URL'); return; }

    const submitBtn = modal.querySelector('#mo-modal-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      showProgressOverlay('Saving listing...', 'Please wait');

      const slug = isEdit ? existingOpp.slug : await generateUniqueSlug(name);

      const oppData = {
        memberstack_id: currentMember.id,
        member_contact_email: currentMember.auth?.email || '',
        name,
        slug,
        opportunity_type: opportunityType || null,
        organization: modal.querySelector('#mo-form-org').value.trim() || null,
        description: description || null,
        budget: budget || null,
        criteria: criteria || null,
        how_to_apply: null,
        opportunity_url: formatUrl(urlInput) || null,
        closing_date: closingDate || null,
        suburb_id: modal.querySelector('#mo-form-suburb').value || null,
        is_remote: modal.querySelector('#mo-form-remote').checked,
        is_draft: true,       // Always pending review until admin approves
        is_archived: false,   // Clear rejection state on resubmit
      };

      let saved;
      if (isEdit) {
        saved = await updateOpportunity(existingOpp.id, oppData);
        await logActivity('opportunity_update', { id: saved.id, name: saved.name });
        const idx = opportunities.findIndex(o => o.id === existingOpp.id);
        if (idx > -1) opportunities[idx] = saved;
      } else {
        saved = await createOpportunity(oppData);
        await logActivity('opportunity_submit', { id: saved.id, name: saved.name });
        opportunities.unshift(saved);
      }

      hideProgressOverlay();
      modal.remove();
      renderOpportunities(wrapper);

      // Notify admin (fire and forget)
      notifyAdminSubmission(saved, isEdit).catch(err => console.warn('Admin notification failed:', err));

      alert(isEdit
        ? 'Your listing has been updated and submitted for review.'
        : 'Your listing has been submitted for review. We\'ll notify you once it\'s approved.');

    } catch (error) {
      console.error('Error saving opportunity:', error);
      hideProgressOverlay();
      alert('Error saving listing. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit for Review';
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
