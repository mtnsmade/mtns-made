// Admin Dashboard Script
// Displays recent activity, sync status, and system health
// Container: .dashboard-feed

(function() {
  console.log('Admin dashboard script loaded');

  // ============================================
  // CONFIGURATION
  // ============================================
  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH';

  let supabase = null;

  // ============================================
  // STYLES
  // ============================================
  const styles = `
    .admin-dashboard {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .admin-header h1 {
      margin: 0;
      font-size: 28px;
      color: #1a1a1a;
    }

    .admin-refresh-btn {
      background: #1a1a1a;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .admin-refresh-btn:hover {
      background: #333;
    }

    .admin-refresh-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }

    .admin-refresh-btn .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .admin-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
    }

    .stat-card .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 4px;
    }

    .stat-card .stat-label {
      font-size: 14px;
      color: #666;
    }

    .stat-card.warning {
      border-color: #ffc107;
      background: #fffbeb;
    }

    .stat-card.success {
      border-color: #28a745;
      background: #f0fff4;
    }

    .stat-card.info {
      border-color: #007bff;
      background: #f0f7ff;
    }

    .admin-section {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 24px;
      overflow: hidden;
    }

    .admin-section-header {
      background: #f9f9f9;
      padding: 16px 20px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .admin-section-header h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .admin-section-header .badge {
      background: #e0e0e0;
      color: #666;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .admin-section-header .badge.warning {
      background: #ffc107;
      color: #333;
    }

    .admin-section-header .badge.success {
      background: #28a745;
      color: #fff;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
    }

    .admin-table th {
      text-align: left;
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
    }

    .admin-table td {
      padding: 12px 16px;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #f0f0f0;
      vertical-align: middle;
    }

    .admin-table tr:last-child td {
      border-bottom: none;
    }

    .admin-table tr:hover {
      background: #f9f9f9;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.lapsed {
      background: #f8d7da;
      color: #721c24;
    }

    .status-badge.trialing {
      background: #fff3cd;
      color: #856404;
    }

    .status-badge.synced {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-badge.draft {
      background: #e2e3e5;
      color: #383d41;
    }

    .status-badge.complete {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.incomplete {
      background: #f8d7da;
      color: #721c24;
    }

    .time-ago {
      color: #999;
      font-size: 12px;
    }

    .member-name {
      font-weight: 500;
    }

    .member-email {
      color: #666;
      font-size: 12px;
    }

    .empty-state {
      padding: 40px 20px;
      text-align: center;
      color: #999;
    }

    .admin-loading {
      padding: 60px 20px;
      text-align: center;
      color: #666;
    }

    .admin-loading .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e0e0e0;
      border-top-color: #1a1a1a;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    .issue-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
    }

    .issue-item:last-child {
      border-bottom: none;
    }

    .issue-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .issue-icon.warning {
      background: #fff3cd;
      color: #856404;
    }

    .issue-icon.error {
      background: #f8d7da;
      color: #721c24;
    }

    .issue-icon.info {
      background: #cce5ff;
      color: #004085;
    }

    .issue-details {
      flex: 1;
    }

    .issue-title {
      font-weight: 500;
      color: #333;
      margin-bottom: 2px;
    }

    .issue-description {
      font-size: 13px;
      color: #666;
    }

    .tabs {
      display: flex;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 0;
    }

    .tab {
      padding: 12px 20px;
      background: none;
      border: none;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
    }

    .tab:hover {
      color: #333;
    }

    .tab.active {
      color: #1a1a1a;
      border-bottom-color: #1a1a1a;
      font-weight: 500;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    @media (max-width: 768px) {
      .admin-table {
        display: block;
        overflow-x: auto;
      }

      .admin-stats {
        grid-template-columns: 1fr 1fr;
      }
    }
  `;

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  function timeAgo(dateString) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  }

  function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ============================================
  // DATA LOADING
  // ============================================

  async function loadDashboardData() {
    const [
      recentMembers,
      memberStats,
      pendingSyncs,
      incompleteProfiles,
      recentEvents,
      eventStats,
      recentProjects
    ] = await Promise.all([
      loadRecentMembers(),
      loadMemberStats(),
      loadPendingSyncs(),
      loadIncompleteProfiles(),
      loadRecentEvents(),
      loadEventStats(),
      loadRecentProjects()
    ]);

    return {
      recentMembers,
      memberStats,
      pendingSyncs,
      incompleteProfiles,
      recentEvents,
      eventStats,
      recentProjects
    };
  }

  async function loadRecentMembers() {
    const { data, error } = await supabase
      .from('members')
      .select(`
        id, memberstack_id, name, email, first_name, last_name,
        subscription_status, profile_complete, webflow_id,
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
      .select('id, subscription_status, profile_complete, webflow_id', { count: 'exact' });

    const total = all?.length || 0;
    const active = all?.filter(m => m.subscription_status === 'active').length || 0;
    const lapsed = all?.filter(m => m.subscription_status === 'lapsed').length || 0;
    const trialing = all?.filter(m => m.subscription_status === 'trialing').length || 0;
    const complete = all?.filter(m => m.profile_complete).length || 0;
    const synced = all?.filter(m => m.webflow_id).length || 0;

    return { total, active, lapsed, trialing, complete, synced };
  }

  async function loadPendingSyncs() {
    // Members without webflow_id who should be synced
    const { data, error } = await supabase
      .from('members')
      .select('id, name, email, profile_complete, subscription_status, created_at')
      .is('webflow_id', null)
      .eq('subscription_status', 'active')
      .eq('profile_complete', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading pending syncs:', error);
      return [];
    }
    return data || [];
  }

  async function loadIncompleteProfiles() {
    const { data, error } = await supabase
      .from('members')
      .select(`
        id, name, email, first_name, subscription_status,
        profile_complete, profile_reminder_sent_at, created_at
      `)
      .eq('profile_complete', false)
      .eq('subscription_status', 'active')
      .order('created_at', { ascending: true })
      .limit(20);

    if (error) {
      console.error('Error loading incomplete profiles:', error);
      return [];
    }
    return data || [];
  }

  async function loadRecentEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('id, name, memberstack_id, member_contact_email, is_draft, is_archived, webflow_id, created_at, updated_at')
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
    const archived = all?.filter(e => e.is_archived).length || 0;

    return { total, pending, published, archived };
  }

  async function loadRecentProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id, name, member_id, webflow_id, is_draft, is_deleted,
        created_at, updated_at,
        members!inner(name, email)
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
  // RENDER FUNCTIONS
  // ============================================

  function renderDashboard(container, data) {
    container.innerHTML = `
      <div class="admin-dashboard">
        <div class="admin-header">
          <h1>System Dashboard</h1>
          <button class="admin-refresh-btn" id="refresh-btn">
            <span class="btn-text">Refresh</span>
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="admin-stats">
          <div class="stat-card info">
            <div class="stat-value">${data.memberStats.total}</div>
            <div class="stat-label">Total Members</div>
          </div>
          <div class="stat-card success">
            <div class="stat-value">${data.memberStats.active}</div>
            <div class="stat-label">Active Subscriptions</div>
          </div>
          <div class="stat-card ${data.memberStats.total - data.memberStats.complete > 5 ? 'warning' : ''}">
            <div class="stat-value">${data.memberStats.complete} / ${data.memberStats.total}</div>
            <div class="stat-label">Profiles Complete</div>
          </div>
          <div class="stat-card ${data.pendingSyncs.length > 0 ? 'warning' : 'success'}">
            <div class="stat-value">${data.memberStats.synced}</div>
            <div class="stat-label">Synced to Webflow</div>
          </div>
        </div>

        <!-- Issues / Attention Needed -->
        ${renderIssuesSection(data)}

        <!-- Activity Tabs -->
        <div class="admin-section">
          <div class="tabs">
            <button class="tab active" data-tab="members">Recent Members</button>
            <button class="tab" data-tab="events">Events</button>
            <button class="tab" data-tab="projects">Projects</button>
            <button class="tab" data-tab="incomplete">Incomplete Profiles</button>
          </div>

          <div class="tab-content active" id="tab-members">
            ${renderMembersTable(data.recentMembers)}
          </div>

          <div class="tab-content" id="tab-events">
            ${renderEventsTable(data.recentEvents, data.eventStats)}
          </div>

          <div class="tab-content" id="tab-projects">
            ${renderProjectsTable(data.recentProjects)}
          </div>

          <div class="tab-content" id="tab-incomplete">
            ${renderIncompleteTable(data.incompleteProfiles)}
          </div>
        </div>
      </div>
    `;

    // Setup tab switching
    container.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        container.querySelector(`#tab-${tab.dataset.tab}`).classList.add('active');
      });
    });

    // Setup refresh button
    const refreshBtn = container.querySelector('#refresh-btn');
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = '<span class="spinner"></span> Loading...';
      await init();
    });
  }

  function renderIssuesSection(data) {
    const issues = [];

    // Check for pending syncs
    if (data.pendingSyncs.length > 0) {
      issues.push({
        type: 'warning',
        title: `${data.pendingSyncs.length} member(s) pending Webflow sync`,
        description: 'Complete profiles not yet synced to Webflow CMS'
      });
    }

    // Check for incomplete profiles
    const oldIncomplete = data.incompleteProfiles.filter(m => {
      const created = new Date(m.created_at);
      const daysSince = (Date.now() - created) / (1000 * 60 * 60 * 24);
      return daysSince > 7 && !m.profile_reminder_sent_at;
    });

    if (oldIncomplete.length > 0) {
      issues.push({
        type: 'info',
        title: `${oldIncomplete.length} member(s) with incomplete profiles (7+ days)`,
        description: 'Consider sending profile completion reminders'
      });
    }

    // Check for pending events
    if (data.eventStats.pending > 0) {
      issues.push({
        type: 'info',
        title: `${data.eventStats.pending} event(s) pending review`,
        description: 'Events awaiting admin approval before publishing'
      });
    }

    // Check for lapsed members
    if (data.memberStats.lapsed > 0) {
      issues.push({
        type: 'warning',
        title: `${data.memberStats.lapsed} lapsed subscription(s)`,
        description: 'Members with canceled subscriptions'
      });
    }

    if (issues.length === 0) {
      return `
        <div class="admin-section">
          <div class="admin-section-header">
            <h2>System Status</h2>
            <span class="badge success">All Good</span>
          </div>
          <div class="empty-state">No issues detected</div>
        </div>
      `;
    }

    return `
      <div class="admin-section">
        <div class="admin-section-header">
          <h2>Attention Needed</h2>
          <span class="badge warning">${issues.length} item(s)</span>
        </div>
        <div class="issues-list">
          ${issues.map(issue => `
            <div class="issue-item">
              <div class="issue-icon ${issue.type}">
                ${issue.type === 'warning' ? '!' : issue.type === 'error' ? 'X' : 'i'}
              </div>
              <div class="issue-details">
                <div class="issue-title">${issue.title}</div>
                <div class="issue-description">${issue.description}</div>
              </div>
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
                <div class="member-name">${member.name || member.first_name || 'No name'}</div>
                <div class="member-email">${member.email || '-'}</div>
              </td>
              <td>
                <span class="status-badge ${member.subscription_status || 'active'}">
                  ${member.subscription_status || 'active'}
                </span>
              </td>
              <td>
                <span class="status-badge ${member.profile_complete ? 'complete' : 'incomplete'}">
                  ${member.profile_complete ? 'Complete' : 'Incomplete'}
                </span>
              </td>
              <td>
                <span class="status-badge ${member.webflow_id ? 'synced' : 'pending'}">
                  ${member.webflow_id ? 'Synced' : 'Pending'}
                </span>
              </td>
              <td>
                <span class="time-ago">${timeAgo(member.created_at)}</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function renderEventsTable(events, stats) {
    return `
      <div style="padding: 16px; background: #f9f9f9; border-bottom: 1px solid #e0e0e0;">
        <span style="margin-right: 16px;"><strong>${stats.pending}</strong> Pending Review</span>
        <span style="margin-right: 16px;"><strong>${stats.published}</strong> Published</span>
        <span><strong>${stats.archived}</strong> Archived</span>
      </div>
      ${events.length === 0 ? '<div class="empty-state">No events found</div>' : `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Submitted By</th>
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
                    <div class="member-name">${event.name || 'Untitled'}</div>
                  </td>
                  <td>
                    <div class="member-email">${event.member_contact_email || event.memberstack_id || '-'}</div>
                  </td>
                  <td>
                    <span class="status-badge ${status}">
                      ${status === 'pending' ? 'Pending Review' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge ${event.webflow_id ? 'synced' : 'pending'}">
                      ${event.webflow_id ? 'Synced' : 'Not Synced'}
                    </span>
                  </td>
                  <td>
                    <span class="time-ago">${timeAgo(event.created_at)}</span>
                  </td>
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
            <th>Member</th>
            <th>Webflow</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          ${projects.map(project => `
            <tr>
              <td>
                <div class="member-name">${project.name || 'Untitled'}</div>
              </td>
              <td>
                <div class="member-email">${project.members?.name || project.members?.email || '-'}</div>
              </td>
              <td>
                <span class="status-badge ${project.webflow_id ? 'synced' : 'pending'}">
                  ${project.webflow_id ? 'Synced' : 'Pending'}
                </span>
              </td>
              <td>
                <span class="time-ago">${timeAgo(project.updated_at)}</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function renderIncompleteTable(members) {
    if (members.length === 0) {
      return '<div class="empty-state">All active members have complete profiles!</div>';
    }

    return `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Status</th>
            <th>Reminder Sent</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          ${members.map(member => `
            <tr>
              <td>
                <div class="member-name">${member.name || member.first_name || 'No name'}</div>
                <div class="member-email">${member.email || '-'}</div>
              </td>
              <td>
                <span class="status-badge ${member.subscription_status}">
                  ${member.subscription_status}
                </span>
              </td>
              <td>
                ${member.profile_reminder_sent_at
                  ? `<span class="time-ago">${timeAgo(member.profile_reminder_sent_at)}</span>`
                  : '<span style="color: #999;">Not sent</span>'
                }
              </td>
              <td>
                <span class="time-ago">${timeAgo(member.created_at)}</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
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
      container.innerHTML = '<div class="admin-loading">Error: Supabase library not loaded</div>';
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
      <div class="admin-loading">
        <div class="spinner"></div>
        Loading dashboard data...
      </div>
    `;

    try {
      const data = await loadDashboardData();
      renderDashboard(container, data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      container.innerHTML = `
        <div class="admin-loading">
          Error loading dashboard. Please refresh the page.
          <br><small style="color: #999;">${error.message}</small>
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
