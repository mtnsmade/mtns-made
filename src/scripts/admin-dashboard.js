// Admin Dashboard Script v2
// Monotonal design with contact functionality
// Container: .dashboard-feed

(function() {
  console.log('Admin dashboard v2 loaded');

  // ============================================
  // CONFIGURATION
  // ============================================
  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH';
  const SITE_URL = 'https://www.mtnsmade.com.au';

  let supabase = null;
  let dashboardData = null;

  // ============================================
  // STYLES - Monotonal Dark Theme
  // ============================================
  const styles = `
    .admin-dashboard {
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
      max-width: 1400px;
      margin: 0 auto;
      background: #0a0a0a;
      color: #e0e0e0;
      padding: 32px;
      min-height: 100vh;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #333;
    }

    .admin-header h1 {
      margin: 0;
      font-size: 14px;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #fff;
    }

    .admin-timestamp {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .admin-btn {
      background: transparent;
      color: #e0e0e0;
      border: 1px solid #444;
      padding: 8px 16px;
      font-family: inherit;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .admin-btn:hover {
      background: #fff;
      color: #0a0a0a;
      border-color: #fff;
    }

    .admin-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .admin-btn.primary {
      background: #fff;
      color: #0a0a0a;
      border-color: #fff;
    }

    .admin-btn.primary:hover {
      background: transparent;
      color: #fff;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px;
      background: #333;
      border: 1px solid #333;
      margin-bottom: 32px;
    }

    .stat-cell {
      background: #0a0a0a;
      padding: 24px;
      text-align: center;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 300;
      color: #fff;
      margin-bottom: 8px;
      font-variant-numeric: tabular-nums;
    }

    .stat-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
    }

    .stat-cell.alert .stat-value {
      color: #ff6b6b;
    }

    .stat-cell.success .stat-value {
      color: #69db7c;
    }

    /* Section */
    .admin-section {
      border: 1px solid #333;
      margin-bottom: 24px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #333;
      background: #111;
    }

    .section-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #888;
      margin: 0;
    }

    .section-badge {
      font-size: 10px;
      padding: 4px 8px;
      border: 1px solid #444;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .section-badge.alert {
      border-color: #ff6b6b;
      color: #ff6b6b;
    }

    .section-badge.success {
      border-color: #69db7c;
      color: #69db7c;
    }

    /* Tabs */
    .tabs-container {
      border-bottom: 1px solid #333;
      display: flex;
      background: #111;
    }

    .tab-btn {
      background: transparent;
      border: none;
      padding: 16px 24px;
      font-family: inherit;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      transition: all 0.2s;
    }

    .tab-btn:hover {
      color: #e0e0e0;
    }

    .tab-btn.active {
      color: #fff;
      border-bottom-color: #fff;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    /* Table */
    .admin-table {
      width: 100%;
      border-collapse: collapse;
    }

    .admin-table th {
      text-align: left;
      padding: 12px 16px;
      font-size: 10px;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      border-bottom: 1px solid #333;
      background: #0f0f0f;
    }

    .admin-table td {
      padding: 14px 16px;
      font-size: 12px;
      color: #ccc;
      border-bottom: 1px solid #1a1a1a;
    }

    .admin-table tr:hover td {
      background: #111;
    }

    .admin-table .name-cell {
      color: #fff;
      font-weight: 500;
    }

    .admin-table .email-cell {
      color: #666;
      font-size: 11px;
    }

    .admin-table .time-cell {
      color: #555;
      font-size: 11px;
      font-variant-numeric: tabular-nums;
    }

    /* Status indicators */
    .status {
      display: inline-block;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 4px 8px;
      border: 1px solid;
    }

    .status.active {
      border-color: #69db7c;
      color: #69db7c;
    }

    .status.lapsed {
      border-color: #ff6b6b;
      color: #ff6b6b;
    }

    .status.synced {
      border-color: #69db7c;
      color: #69db7c;
    }

    .status.pending {
      border-color: #ffd43b;
      color: #ffd43b;
    }

    .status.complete {
      border-color: #69db7c;
      color: #69db7c;
    }

    .status.incomplete {
      border-color: #ff6b6b;
      color: #ff6b6b;
    }

    .status.draft {
      border-color: #666;
      color: #666;
    }

    /* Action buttons in table */
    .action-btn {
      background: transparent;
      border: 1px solid #444;
      color: #888;
      padding: 6px 12px;
      font-family: inherit;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: #fff;
      color: #0a0a0a;
      border-color: #fff;
    }

    /* Empty state */
    .empty-state {
      padding: 48px 24px;
      text-align: center;
      color: #555;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Loading */
    .admin-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 24px;
      color: #666;
    }

    .loader {
      width: 40px;
      height: 40px;
      border: 1px solid #333;
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-text {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Issues list */
    .issues-list {
      padding: 0;
    }

    .issue-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid #1a1a1a;
    }

    .issue-item:last-child {
      border-bottom: none;
    }

    .issue-icon {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .issue-icon.warning {
      background: #ffd43b;
    }

    .issue-icon.error {
      background: #ff6b6b;
    }

    .issue-icon.info {
      background: #74c0fc;
    }

    .issue-text {
      flex: 1;
      font-size: 12px;
      color: #ccc;
    }

    .issue-count {
      font-size: 11px;
      color: #666;
      font-variant-numeric: tabular-nums;
    }

    /* Missing fields */
    .missing-fields {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 4px;
    }

    .missing-field {
      font-size: 9px;
      padding: 2px 6px;
      background: #1a1a1a;
      color: #ff6b6b;
      border: 1px solid #333;
    }

    /* Modal Overlay */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 24px;
    }

    .modal {
      background: #0a0a0a;
      border: 1px solid #333;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #fff;
      margin: 0;
    }

    .modal-close {
      background: transparent;
      border: none;
      color: #666;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    .modal-close:hover {
      color: #fff;
    }

    .modal-body {
      padding: 24px;
    }

    .modal-footer {
      padding: 20px 24px;
      border-top: 1px solid #333;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    /* Form fields in modal */
    .form-field {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      margin-bottom: 8px;
    }

    .form-input {
      width: 100%;
      background: #111;
      border: 1px solid #333;
      color: #e0e0e0;
      padding: 12px;
      font-family: inherit;
      font-size: 13px;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #fff;
    }

    textarea.form-input {
      min-height: 150px;
      resize: vertical;
      line-height: 1.5;
    }

    .form-hint {
      font-size: 10px;
      color: #555;
      margin-top: 6px;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .admin-dashboard {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .admin-table {
        display: block;
        overflow-x: auto;
      }
    }
  `;

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  function timeAgo(dateString) {
    if (!dateString) return '--';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString('en-AU', { day: '2-digit', month: 'short' });
  }

  function formatTimestamp() {
    return new Date().toLocaleString('en-AU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).toUpperCase();
  }

  function getMissingFields(member) {
    const missing = [];
    if (!member.profile_image_url) missing.push('Profile Image');
    if (!member.header_image_url) missing.push('Header Image');
    if (!member.bio || member.bio.length < 50) missing.push('Bio');
    if (!member.suburb_id) missing.push('Location');
    // Categories would need a separate query
    return missing;
  }

  function generateEmailTemplate(member, missingFields) {
    const name = member.first_name || member.name || 'there';
    const fieldsText = missingFields.length > 0
      ? `\n\nTo complete your profile, you'll need:\n${missingFields.map(f => `- ${f}`).join('\n')}`
      : '';

    return `Hi ${name},

Thanks for being part of MTNS MADE! We noticed your profile isn't quite complete yet.

A complete profile helps other creatives find you in the directory and shows off your amazing work.${fieldsText}

Complete your profile here: ${SITE_URL}/profile/start

Let us know if you need any help!

MTNS MADE Team`;
  }

  // ============================================
  // DATA LOADING
  // ============================================

  async function loadDashboardData() {
    const [
      recentMembers,
      memberStats,
      incompleteProfiles,
      recentEvents,
      eventStats,
      recentProjects
    ] = await Promise.all([
      loadRecentMembers(),
      loadMemberStats(),
      loadIncompleteProfiles(),
      loadRecentEvents(),
      loadEventStats(),
      loadRecentProjects()
    ]);

    return {
      recentMembers,
      memberStats,
      incompleteProfiles,
      recentEvents,
      eventStats,
      recentProjects,
      loadedAt: new Date()
    };
  }

  async function loadRecentMembers() {
    const { data, error } = await supabase
      .from('members')
      .select(`
        id, memberstack_id, name, email, first_name, last_name,
        subscription_status, profile_complete, webflow_id,
        profile_image_url, header_image_url, bio, suburb_id,
        created_at, updated_at
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error loading recent members:', error);
      return [];
    }
    return data || [];
  }

  async function loadMemberStats() {
    const { data: all } = await supabase
      .from('members')
      .select('id, subscription_status, profile_complete, webflow_id');

    const total = all?.length || 0;
    const active = all?.filter(m => m.subscription_status === 'active').length || 0;
    const lapsed = all?.filter(m => m.subscription_status === 'lapsed').length || 0;
    const complete = all?.filter(m => m.profile_complete).length || 0;
    const synced = all?.filter(m => m.webflow_id).length || 0;
    const pendingSync = all?.filter(m => m.profile_complete && !m.webflow_id && m.subscription_status === 'active').length || 0;

    return { total, active, lapsed, complete, synced, pendingSync };
  }

  async function loadIncompleteProfiles() {
    const { data, error } = await supabase
      .from('members')
      .select(`
        id, memberstack_id, name, email, first_name, subscription_status,
        profile_complete, profile_reminder_sent_at, created_at,
        profile_image_url, header_image_url, bio, suburb_id
      `)
      .eq('profile_complete', false)
      .eq('subscription_status', 'active')
      .order('created_at', { ascending: true })
      .limit(30);

    if (error) {
      console.error('Error loading incomplete profiles:', error);
      return [];
    }
    return data || [];
  }

  async function loadRecentEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('id, name, memberstack_id, member_contact_email, is_draft, is_archived, webflow_id, created_at')
      .order('created_at', { ascending: false })
      .limit(15);

    if (error) {
      console.error('Error loading recent events:', error);
      return [];
    }
    return data || [];
  }

  async function loadEventStats() {
    const { data: all } = await supabase
      .from('events')
      .select('id, is_draft, is_archived, webflow_id');

    const total = all?.length || 0;
    const pending = all?.filter(e => e.is_draft && !e.is_archived).length || 0;
    const published = all?.filter(e => !e.is_draft && !e.is_archived).length || 0;

    return { total, pending, published };
  }

  async function loadRecentProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id, name, member_id, webflow_id, is_draft, is_deleted,
        created_at, updated_at
      `)
      .eq('is_deleted', false)
      .order('updated_at', { ascending: false })
      .limit(15);

    if (error) {
      console.error('Error loading recent projects:', error);
      return [];
    }
    return data || [];
  }

  // ============================================
  // MODAL FUNCTIONS
  // ============================================

  function showContactModal(member) {
    const missingFields = getMissingFields(member);
    const emailBody = generateEmailTemplate(member, missingFields);

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Contact Member</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label class="form-label">To</label>
            <input type="text" class="form-input" id="modal-to" value="${member.email || ''}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">Subject</label>
            <input type="text" class="form-input" id="modal-subject" value="Complete your MTNS MADE profile">
          </div>
          <div class="form-field">
            <label class="form-label">Message</label>
            <textarea class="form-input" id="modal-body">${emailBody}</textarea>
            <div class="form-hint">Edit the message above as needed</div>
          </div>
          ${missingFields.length > 0 ? `
            <div class="form-field">
              <label class="form-label">Missing Fields Detected</label>
              <div class="missing-fields">
                ${missingFields.map(f => `<span class="missing-field">${f}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="modal-cancel">Cancel</button>
          <button class="admin-btn primary" id="modal-send">Send Email</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#modal-cancel').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    modal.querySelector('#modal-send').addEventListener('click', async () => {
      const to = modal.querySelector('#modal-to').value;
      const subject = modal.querySelector('#modal-subject').value;
      const body = modal.querySelector('#modal-body').value;

      if (!to) {
        alert('No email address available for this member');
        return;
      }

      const sendBtn = modal.querySelector('#modal-send');
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending...';

      try {
        // Call the send-email Edge Function
        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            to: to,
            subject: subject,
            text: body,
            html: body.replace(/\n/g, '<br>')
          })
        });

        const result = await response.json();

        if (result.success) {
          alert('Email sent successfully!');
          modal.remove();
        } else {
          alert('Failed to send email: ' + (result.error || 'Unknown error'));
          sendBtn.disabled = false;
          sendBtn.textContent = 'Send Email';
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Error sending email. Check console for details.');
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send Email';
      }
    });
  }

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  function renderDashboard(container, data) {
    const incompleteCount = data.incompleteProfiles.length;
    const pendingEvents = data.eventStats.pending;

    container.innerHTML = `
      <div class="admin-dashboard">
        <div class="admin-header">
          <h1>MTNS MADE // System Dashboard</h1>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span class="admin-timestamp">Updated: ${formatTimestamp()}</span>
            <button class="admin-btn" id="refresh-btn">Refresh</button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-cell">
            <div class="stat-value">${data.memberStats.total}</div>
            <div class="stat-label">Total Members</div>
          </div>
          <div class="stat-cell success">
            <div class="stat-value">${data.memberStats.active}</div>
            <div class="stat-label">Active</div>
          </div>
          <div class="stat-cell ${incompleteCount > 5 ? 'alert' : ''}">
            <div class="stat-value">${data.memberStats.complete}/${data.memberStats.total}</div>
            <div class="stat-label">Profiles Complete</div>
          </div>
          <div class="stat-cell">
            <div class="stat-value">${data.memberStats.synced}</div>
            <div class="stat-label">Synced to Webflow</div>
          </div>
        </div>

        <!-- Issues Section -->
        ${renderIssuesSection(data)}

        <!-- Activity Tabs -->
        <div class="admin-section">
          <div class="tabs-container">
            <button class="tab-btn active" data-tab="members">Recent Members</button>
            <button class="tab-btn" data-tab="incomplete">Incomplete (${incompleteCount})</button>
            <button class="tab-btn" data-tab="events">Events</button>
            <button class="tab-btn" data-tab="projects">Projects</button>
          </div>

          <div class="tab-content active" id="tab-members">
            ${renderMembersTable(data.recentMembers)}
          </div>

          <div class="tab-content" id="tab-incomplete">
            ${renderIncompleteTable(data.incompleteProfiles)}
          </div>

          <div class="tab-content" id="tab-events">
            ${renderEventsTable(data.recentEvents, data.eventStats)}
          </div>

          <div class="tab-content" id="tab-projects">
            ${renderProjectsTable(data.recentProjects)}
          </div>
        </div>
      </div>
    `;

    // Setup tab switching
    container.querySelectorAll('.tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        container.querySelector(`#tab-${tab.dataset.tab}`).classList.add('active');
      });
    });

    // Setup refresh button
    container.querySelector('#refresh-btn').addEventListener('click', () => refreshDashboard(container));

    // Setup contact buttons
    container.querySelectorAll('.contact-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const memberId = btn.dataset.memberId;
        const member = data.incompleteProfiles.find(m => m.id === memberId) ||
                       data.recentMembers.find(m => m.id === memberId);
        if (member) {
          showContactModal(member);
        }
      });
    });
  }

  function renderIssuesSection(data) {
    const issues = [];

    if (data.memberStats.pendingSync > 0) {
      issues.push({
        type: 'warning',
        text: 'Members pending Webflow sync',
        count: data.memberStats.pendingSync
      });
    }

    const oldIncomplete = data.incompleteProfiles.filter(m => {
      const days = (Date.now() - new Date(m.created_at)) / (1000 * 60 * 60 * 24);
      return days > 7 && !m.profile_reminder_sent_at;
    });

    if (oldIncomplete.length > 0) {
      issues.push({
        type: 'info',
        text: 'Incomplete profiles (7+ days, no reminder sent)',
        count: oldIncomplete.length
      });
    }

    if (data.eventStats.pending > 0) {
      issues.push({
        type: 'info',
        text: 'Events pending review',
        count: data.eventStats.pending
      });
    }

    if (data.memberStats.lapsed > 0) {
      issues.push({
        type: 'error',
        text: 'Lapsed subscriptions',
        count: data.memberStats.lapsed
      });
    }

    if (issues.length === 0) {
      return `
        <div class="admin-section">
          <div class="section-header">
            <h2 class="section-title">System Status</h2>
            <span class="section-badge success">All Systems Nominal</span>
          </div>
          <div class="empty-state">No issues detected</div>
        </div>
      `;
    }

    return `
      <div class="admin-section">
        <div class="section-header">
          <h2 class="section-title">Attention Required</h2>
          <span class="section-badge alert">${issues.length} Issue${issues.length > 1 ? 's' : ''}</span>
        </div>
        <div class="issues-list">
          ${issues.map(issue => `
            <div class="issue-item">
              <div class="issue-icon ${issue.type}"></div>
              <div class="issue-text">${issue.text}</div>
              <div class="issue-count">${issue.count}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderMembersTable(members) {
    if (members.length === 0) {
      return '<div class="empty-state">No members found</div>';
    }

    return `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Status</th>
            <th>Profile</th>
            <th>Webflow</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          ${members.map(member => `
            <tr>
              <td>
                <div class="name-cell">${member.name || member.first_name || 'No name'}</div>
                <div class="email-cell">${member.email || '--'}</div>
              </td>
              <td>
                <span class="status ${member.subscription_status || 'active'}">
                  ${member.subscription_status || 'active'}
                </span>
              </td>
              <td>
                <span class="status ${member.profile_complete ? 'complete' : 'incomplete'}">
                  ${member.profile_complete ? 'Complete' : 'Incomplete'}
                </span>
              </td>
              <td>
                <span class="status ${member.webflow_id ? 'synced' : 'pending'}">
                  ${member.webflow_id ? 'Synced' : 'Pending'}
                </span>
              </td>
              <td class="time-cell">${timeAgo(member.created_at)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function renderIncompleteTable(members) {
    if (members.length === 0) {
      return '<div class="empty-state">All active members have complete profiles</div>';
    }

    return `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Missing</th>
            <th>Reminder</th>
            <th>Joined</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${members.map(member => {
            const missing = getMissingFields(member);
            return `
              <tr>
                <td>
                  <div class="name-cell">${member.name || member.first_name || 'No name'}</div>
                  <div class="email-cell">${member.email || '--'}</div>
                </td>
                <td>
                  <div class="missing-fields">
                    ${missing.slice(0, 3).map(f => `<span class="missing-field">${f}</span>`).join('')}
                    ${missing.length > 3 ? `<span class="missing-field">+${missing.length - 3}</span>` : ''}
                  </div>
                </td>
                <td class="time-cell">
                  ${member.profile_reminder_sent_at ? timeAgo(member.profile_reminder_sent_at) : '--'}
                </td>
                <td class="time-cell">${timeAgo(member.created_at)}</td>
                <td>
                  <button class="action-btn contact-btn" data-member-id="${member.id}">Contact</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  function renderEventsTable(events, stats) {
    return `
      <div style="padding: 12px 16px; border-bottom: 1px solid #333; font-size: 11px; color: #666;">
        <span style="margin-right: 24px;"><strong style="color: #ffd43b;">${stats.pending}</strong> Pending</span>
        <span><strong style="color: #69db7c;">${stats.published}</strong> Published</span>
      </div>
      ${events.length === 0 ? '<div class="empty-state">No events found</div>' : `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Status</th>
              <th>Webflow</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            ${events.map(event => {
              let status = 'draft';
              if (event.is_archived) status = 'archived';
              else if (!event.is_draft) status = 'published';
              else status = 'pending';

              return `
                <tr>
                  <td>
                    <div class="name-cell">${event.name || 'Untitled'}</div>
                    <div class="email-cell">${event.member_contact_email || '--'}</div>
                  </td>
                  <td>
                    <span class="status ${status === 'published' ? 'complete' : status === 'pending' ? 'pending' : 'draft'}">
                      ${status}
                    </span>
                  </td>
                  <td>
                    <span class="status ${event.webflow_id ? 'synced' : 'pending'}">
                      ${event.webflow_id ? 'Synced' : '--'}
                    </span>
                  </td>
                  <td class="time-cell">${timeAgo(event.created_at)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `}
    `;
  }

  function renderProjectsTable(projects) {
    if (projects.length === 0) {
      return '<div class="empty-state">No projects found</div>';
    }

    return `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Webflow</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          ${projects.map(project => `
            <tr>
              <td>
                <div class="name-cell">${project.name || 'Untitled'}</div>
              </td>
              <td>
                <span class="status ${project.webflow_id ? 'synced' : 'pending'}">
                  ${project.webflow_id ? 'Synced' : 'Pending'}
                </span>
              </td>
              <td class="time-cell">${timeAgo(project.updated_at)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // ============================================
  // REFRESH FUNCTION
  // ============================================

  async function refreshDashboard(container) {
    const refreshBtn = container.querySelector('#refresh-btn');
    if (refreshBtn) {
      refreshBtn.disabled = true;
      refreshBtn.textContent = 'Loading...';
    }

    try {
      dashboardData = await loadDashboardData();
      renderDashboard(container, dashboardData);
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      if (refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.textContent = 'Refresh';
      }
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async function init() {
    const container = document.querySelector('.dashboard-feed');
    if (!container) {
      console.warn('Could not find .dashboard-feed container');
      return;
    }

    // Check for Supabase library
    if (typeof window.supabase === 'undefined') {
      container.innerHTML = `
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error: Supabase library not loaded</div>
          </div>
        </div>
      `;
      return;
    }

    // Initialize Supabase client
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Add styles
    if (!document.querySelector('#admin-dashboard-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'admin-dashboard-styles';
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    }

    // Show loading state
    container.innerHTML = `
      <div class="admin-dashboard">
        <div class="admin-loading">
          <div class="loader"></div>
          <div class="loading-text">Loading system data...</div>
        </div>
      </div>
    `;

    try {
      dashboardData = await loadDashboardData();
      renderDashboard(container, dashboardData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      container.innerHTML = `
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error loading dashboard</div>
            <div style="color: #666; font-size: 11px; margin-top: 8px;">${error.message}</div>
          </div>
        </div>
      `;
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
