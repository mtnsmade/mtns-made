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
  let membershipTypes = [];

  // ============================================
  // STYLES - Light Monotonal Theme
  // ============================================
  const styles = `
    .admin-dashboard {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .admin-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .admin-timestamp {
      font-size: 12px;
      color: #888;
    }

    .admin-btn {
      background: #fff;
      color: #1a1a1a;
      border: 1px solid #d0d0d0;
      padding: 8px 16px;
      font-family: inherit;
      font-size: 13px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .admin-btn:hover {
      background: #1a1a1a;
      color: #fff;
      border-color: #1a1a1a;
    }

    .admin-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .admin-btn.primary {
      background: #1a1a1a;
      color: #fff;
      border-color: #1a1a1a;
    }

    .admin-btn.primary:hover {
      background: #333;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-cell {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
    }

    .stat-value {
      font-size: 36px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
      font-variant-numeric: tabular-nums;
    }

    .stat-label {
      font-size: 12px;
      color: #888;
    }

    .stat-cell.alert .stat-value {
      color: #dc3545;
    }

    .stat-cell.success .stat-value {
      color: #1a1a1a;
    }

    /* Section */
    .admin-section {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 24px;
      overflow: hidden;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .section-badge {
      font-size: 11px;
      padding: 4px 10px;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      color: #666;
    }

    .section-badge.alert {
      border-color: #dc3545;
      color: #dc3545;
    }

    .section-badge.success {
      border-color: #1a1a1a;
      color: #1a1a1a;
    }

    /* Tabs */
    .tabs-container {
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      padding: 0 8px;
    }

    .tab-btn {
      background: transparent;
      border: none;
      padding: 14px 16px;
      font-family: inherit;
      font-size: 13px;
      color: #888;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      transition: all 0.15s;
    }

    .tab-btn:hover {
      color: #1a1a1a;
    }

    .tab-btn.active {
      color: #1a1a1a;
      font-weight: 500;
      border-bottom-color: #1a1a1a;
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
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #888;
      border-bottom: 1px solid #e0e0e0;
    }

    .admin-table td {
      padding: 14px 16px;
      font-size: 13px;
      color: #333;
      border-bottom: 1px solid #f0f0f0;
    }

    .admin-table tr:hover td {
      background: #fafafa;
    }

    .admin-table .name-cell {
      color: #1a1a1a;
      font-weight: 500;
    }

    .admin-table .email-cell {
      color: #888;
      font-size: 12px;
    }

    .admin-table .time-cell {
      color: #888;
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }

    /* Status indicators */
    .status {
      display: inline-block;
      font-size: 11px;
      padding: 3px 8px;
      border: 1px solid;
      border-radius: 4px;
    }

    .status.active {
      border-color: #1a1a1a;
      color: #1a1a1a;
    }

    .status.lapsed {
      border-color: #dc3545;
      color: #dc3545;
    }

    .status.synced {
      border-color: #1a1a1a;
      color: #1a1a1a;
    }

    .status.pending {
      border-color: #888;
      color: #888;
    }

    .status.complete {
      border-color: #1a1a1a;
      color: #1a1a1a;
    }

    .status.incomplete {
      border-color: #dc3545;
      color: #dc3545;
    }

    .status.draft {
      border-color: #888;
      color: #888;
    }

    /* Action buttons in table */
    .action-btn {
      background: #fff;
      border: 1px solid #d0d0d0;
      color: #333;
      padding: 6px 12px;
      font-family: inherit;
      font-size: 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s;
      text-decoration: none;
      display: inline-block;
    }

    .action-btn:hover {
      background: #1a1a1a;
      color: #fff;
      border-color: #1a1a1a;
    }

    .action-btn.contact-btn {
      background: #1a1a1a;
      color: #fff;
      border-color: #1a1a1a;
    }

    .action-btn.contact-btn:hover {
      background: #333;
    }

    .action-btn.contacted {
      background: #fff;
      color: #888;
      border-color: #d0d0d0;
      cursor: default;
    }

    .action-btn.contacted:hover {
      background: #fff;
      color: #888;
      border-color: #d0d0d0;
    }

    .action-btns {
      display: flex;
      gap: 6px;
      flex-wrap: nowrap;
      align-items: center;
    }

    /* Approve/Reject buttons */
    .action-btn.approve-btn {
      background: #10b981;
      color: #fff;
      border-color: #10b981;
    }

    .action-btn.approve-btn:hover {
      background: #059669;
      border-color: #059669;
    }

    .action-btn.reject-btn {
      background: #ef4444;
      color: #fff;
      border-color: #ef4444;
    }

    .action-btn.reject-btn:hover {
      background: #dc2626;
      border-color: #dc2626;
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-btn.delete-btn {
      background: #fff;
      color: #dc3545;
      border-color: #dc3545;
    }

    .action-btn.delete-btn:hover {
      background: #dc3545;
      color: #fff;
    }

    .action-btn.edit-btn {
      background: #fff;
      color: #0066cc;
      border-color: #0066cc;
    }

    .action-btn.edit-btn:hover {
      background: #0066cc;
      color: #fff;
    }

    .action-btn.preview-btn {
      background: #fff;
      color: #555;
      border-color: #bbb;
    }

    .action-btn.preview-btn:hover {
      background: #555;
      color: #fff;
      border-color: #555;
    }

    /* Event Preview Modal */
    .modal-preview {
      max-width: 680px;
    }

    .event-preview-image {
      width: 100%;
      height: 220px;
      object-fit: cover;
      border-radius: 6px;
      margin-bottom: 20px;
      background: #f0f0f0;
      display: block;
    }

    .preview-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 24px;
    }

    .preview-field {
      margin-bottom: 16px;
    }

    .preview-label {
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #888;
      margin-bottom: 4px;
    }

    .preview-value {
      font-size: 14px;
      color: #1a1a1a;
      line-height: 1.5;
      word-break: break-word;
    }

    .preview-value a {
      color: #0066cc;
      text-decoration: none;
    }

    .preview-value a:hover {
      text-decoration: underline;
    }

    .type-cell {
      font-size: 12px;
      color: #666;
    }

    /* Empty state */
    .empty-state {
      padding: 48px 24px;
      text-align: center;
      color: #888;
      font-size: 13px;
    }

    /* Loading */
    .admin-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 24px;
      color: #888;
    }

    .loader {
      width: 32px;
      height: 32px;
      border: 2px solid #e0e0e0;
      border-top-color: #1a1a1a;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-text {
      font-size: 13px;
      color: #888;
    }

    /* Issues list */
    .issues-list {
      padding: 0;
    }

    .issue-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      border-bottom: 1px solid #f0f0f0;
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
      background: #f59f00;
    }

    .issue-icon.error {
      background: #dc3545;
    }

    .issue-icon.info {
      background: #888;
    }

    .issue-text {
      flex: 1;
      font-size: 13px;
      color: #333;
    }

    .issue-count {
      font-size: 13px;
      color: #888;
      font-weight: 500;
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
      font-size: 10px;
      padding: 2px 6px;
      background: #fff;
      color: #dc3545;
      border: 1px solid #dc3545;
      border-radius: 3px;
    }

    /* Activity Feed */
    .activity-feed {
      padding: 0;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 20px;
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.15s;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-item:hover {
      background: #fafafa;
    }

    .activity-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
      background: #f0f0f0;
      color: #666;
    }

    .activity-icon.profile {
      background: #e3f2fd;
      color: #1976d2;
    }

    .activity-icon.project {
      background: #e8f5e9;
      color: #388e3c;
    }

    .activity-icon.event {
      background: #fff3e0;
      color: #f57c00;
    }

    .activity-icon.canceled {
      background: #ffebee;
      color: #c62828;
    }

    .activity-icon.reactivated {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .activity-icon.signup {
      background: #fff8e1;
      color: #ff8f00;
    }

    .activity-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      flex-shrink: 0;
      overflow: hidden;
      background: #f0f0f0;
    }

    .activity-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .activity-content {
      flex: 1;
      min-width: 0;
    }

    .activity-text {
      font-size: 13px;
      color: #333;
      line-height: 1.4;
    }

    .activity-text strong {
      font-weight: 600;
      color: #1a1a1a;
    }

    .activity-text .entity-name {
      font-style: italic;
      color: #555;
    }

    .activity-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 4px;
    }

    .activity-time {
      font-size: 11px;
      color: #888;
    }

    .activity-action {
      margin-left: auto;
      flex-shrink: 0;
    }

    /* Modal Overlay */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 24px;
    }

    .modal {
      background: #fff;
      border-radius: 12px;
      width: 100%;
      max-width: 560px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }

    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .modal-close {
      background: transparent;
      border: none;
      color: #888;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    .modal-close:hover {
      color: #1a1a1a;
    }

    .modal-body {
      padding: 24px;
    }

    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
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
      font-size: 12px;
      font-weight: 500;
      color: #333;
      margin-bottom: 6px;
    }

    .form-input {
      width: 100%;
      background: #fff;
      border: 1px solid #d0d0d0;
      color: #1a1a1a;
      padding: 10px 12px;
      font-family: inherit;
      font-size: 14px;
      border-radius: 6px;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #1a1a1a;
    }

    textarea.form-input {
      min-height: 140px;
      resize: vertical;
      line-height: 1.5;
    }

    .form-hint {
      font-size: 11px;
      color: #888;
      margin-top: 4px;
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
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .stat-cell {
        padding: 16px;
      }

      .stat-value {
        font-size: 28px;
      }

      .admin-table {
        display: block;
        overflow-x: auto;
      }

      .tabs-container {
        overflow-x: auto;
      }
    }
  `;

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  async function getAdminMemberId() {
    const { data: member } = await window.$memberstackDom.getCurrentMember();
    return member?.id || '';
  }

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
      failedSignups,
      recentEvents,
      eventStats,
      recentOpportunities,
      opportunityStats,
      recentProjects,
      messageStats,
      recentActivity,
      membershipTypesData
    ] = await Promise.all([
      loadRecentMembers(),
      loadMemberStats(),
      loadIncompleteProfiles(),
      loadFailedSignups(),
      loadRecentEvents(),
      loadEventStats(),
      loadRecentOpportunities(),
      loadOpportunityStats(),
      loadRecentProjects(),
      loadMessageStats(),
      loadRecentActivity(),
      loadMembershipTypes()
    ]);

    // Store membership types globally for use in modals
    membershipTypes = membershipTypesData;

    return {
      recentMembers,
      memberStats,
      incompleteProfiles,
      failedSignups,
      recentEvents,
      eventStats,
      recentOpportunities,
      opportunityStats,
      recentProjects,
      messageStats,
      recentActivity,
      membershipTypes: membershipTypesData,
      loadedAt: new Date()
    };
  }

  async function loadRecentMembers() {
    const { data, error } = await supabase
      .from('members')
      .select(`
        id, memberstack_id, name, email, first_name, last_name, slug,
        subscription_status, profile_complete, webflow_id,
        profile_image_url, header_image_url, bio, suburb_id,
        membership_type_id, membership_types(id, name),
        created_at, updated_at
      `)
      .neq('is_deleted', true)
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
      .select('id, subscription_status, profile_complete, webflow_id')
      .neq('is_deleted', true);

    const total = all?.length || 0;
    const active = all?.filter(m => m.subscription_status === 'active').length || 0;
    const lapsed = all?.filter(m => m.subscription_status === 'lapsed').length || 0;
    const complete = all?.filter(m => m.profile_complete).length || 0;
    const synced = all?.filter(m => m.webflow_id).length || 0;
    const pendingSync = all?.filter(m => m.profile_complete && !m.webflow_id && m.subscription_status === 'active').length || 0;

    return { total, active, lapsed, complete, synced, pendingSync };
  }

  async function loadMembershipTypes() {
    const { data, error } = await supabase
      .from('membership_types')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error loading membership types:', error);
      return [];
    }
    return data || [];
  }

  async function loadMessageStats() {
    try {
      // Get current month start
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Total messages
      const { data: allMessages } = await supabase
        .from('messages')
        .select('id, is_read, created_at');

      // This month's messages
      const { data: monthMessages } = await supabase
        .from('messages')
        .select('id')
        .gte('created_at', monthStart);

      const total = allMessages?.length || 0;
      const unread = allMessages?.filter(m => !m.is_read).length || 0;
      const thisMonth = monthMessages?.length || 0;

      return { total, unread, thisMonth };
    } catch (error) {
      console.error('Error loading message stats:', error);
      return { total: 0, unread: 0, thisMonth: 0 };
    }
  }

  async function loadIncompleteProfiles() {
    const { data, error } = await supabase
      .from('members')
      .select(`
        id, memberstack_id, name, email, first_name, slug, subscription_status,
        profile_complete, profile_reminder_sent_at, created_at,
        profile_image_url, header_image_url, bio, suburb_id
      `)
      .eq('profile_complete', false)
      .eq('subscription_status', 'active')
      .neq('is_deleted', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading incomplete profiles:', error);
      return [];
    }
    return data || [];
  }

  async function loadFailedSignups() {
    // Failed signups: members who don't have 'active' or 'lapsed' status
    // This catches: null, empty string, 'trialing', 'canceled', etc.
    const { data, error } = await supabase
      .from('members')
      .select(`
        id, memberstack_id, name, email, first_name, slug,
        subscription_status, profile_complete, profile_reminder_sent_at, created_at
      `)
      .not('subscription_status', 'in', '("active","lapsed","deleted")')
      .neq('is_deleted', true)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Error loading failed signups:', error);
      return [];
    }
    return data || [];
  }

  async function loadRecentEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('id, name, slug, memberstack_id, member_contact_email, is_draft, is_archived, webflow_id, created_at')
      .order('is_draft', { ascending: false })  // pending (is_draft=true) first
      .order('created_at', { ascending: false })
      .limit(50);

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

  async function loadRecentOpportunities() {
    const { data, error } = await supabase
      .from('opportunities')
      .select('id, name, slug, memberstack_id, member_contact_email, opportunity_type, is_draft, is_archived, webflow_id, created_at')
      .order('is_draft', { ascending: false })  // pending (is_draft=true) first
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading recent opportunities:', error);
      return [];
    }
    const opps = data || [];

    // Enrich with member names
    const ids = [...new Set(opps.map(o => o.memberstack_id).filter(Boolean))];
    if (ids.length > 0) {
      const { data: members } = await supabase
        .from('members')
        .select('memberstack_id, first_name, last_name, name')
        .in('memberstack_id', ids);
      if (members) {
        const memberMap = Object.fromEntries(members.map(m => [m.memberstack_id, m]));
        opps.forEach(o => {
          const m = memberMap[o.memberstack_id];
          if (m) o.member_name = [m.first_name, m.last_name].filter(Boolean).join(' ') || m.name || null;
        });
      }
    }
    return opps;
  }

  async function loadOpportunityStats() {
    const { data: all } = await supabase
      .from('opportunities')
      .select('id, is_draft, is_archived');

    const total = all?.length || 0;
    const pending = all?.filter(o => o.is_draft && !o.is_archived).length || 0;
    const published = all?.filter(o => !o.is_draft && !o.is_archived).length || 0;

    return { total, pending, published };
  }

  async function loadRecentProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id, name, slug, member_id, webflow_id, is_draft, is_deleted,
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

  async function loadRecentActivity() {
    const { data, error } = await supabase
      .from('activity_log')
      .select(`
        id, member_id, memberstack_id, activity_type, description,
        entity_type, entity_id, entity_name,
        member_webflow_url, entity_webflow_url, created_at
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading recent activity:', error);
      return [];
    }

    // Enrich with member names and profile images
    const memberIds = [...new Set(data.filter(a => a.member_id).map(a => a.member_id))];
    let memberData = {};

    if (memberIds.length > 0) {
      const { data: members } = await supabase
        .from('members')
        .select('id, name, first_name, last_name, profile_image_url')
        .in('id', memberIds);

      if (members) {
        members.forEach(m => {
          memberData[m.id] = {
            name: m.name || `${m.first_name || ''} ${m.last_name || ''}`.trim() || 'Unknown Member',
            profile_image_url: m.profile_image_url || null
          };
        });
      }
    }

    return data.map(activity => ({
      ...activity,
      member_name: activity.member_id ? (memberData[activity.member_id]?.name || 'Unknown Member') : 'Unknown Member',
      member_profile_image: activity.member_id ? (memberData[activity.member_id]?.profile_image_url || null) : null
    }));
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
        // Call the send-email Edge Function (no auth required - deployed with --no-verify-jwt)
        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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
          // Update profile_reminder_sent_at in Supabase
          await supabase
            .from('members')
            .update({ profile_reminder_sent_at: new Date().toISOString() })
            .eq('id', member.id);

          alert('Email sent successfully!');
          modal.remove();

          // Refresh the dashboard to show updated "Contacted" state
          const container = document.querySelector('.dashboard-feed');
          if (container) refreshDashboard(container);
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

  function showEditMemberModal(memberId, memberName, currentTypeId) {
    const currentTypeName = membershipTypes.find(t => t.id === currentTypeId)?.name || 'Not set';

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Edit Member</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label class="form-label">Member</label>
            <input type="text" class="form-input" value="${memberName}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">Current Type</label>
            <input type="text" class="form-input" value="${currentTypeName}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">New Membership Type</label>
            <select class="form-input" id="modal-membership-type">
              <option value="">-- Select New Type --</option>
              ${membershipTypes.map(type => `
                <option value="${type.id}" ${type.id === currentTypeId ? 'disabled' : ''}>
                  ${type.name}${type.id === currentTypeId ? ' (current)' : ''}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="form-field">
            <label class="form-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="modal-skip-billing" style="width: auto;">
              <span>Skip billing change (update label only)</span>
            </label>
            <div class="form-hint">If unchecked, this will change their Memberstack plan and Stripe subscription</div>
          </div>
          <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 12px; margin-top: 12px; font-size: 12px;">
            <strong>Warning:</strong> Changing membership type will:
            <ul style="margin: 8px 0 0 16px; padding: 0;">
              <li>Update Memberstack custom field</li>
              <li>Change Stripe subscription (unless skipped)</li>
              <li>Update Supabase database</li>
              <li>Sync changes to Webflow</li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="modal-cancel">Cancel</button>
          <button class="admin-btn primary" id="modal-save">Update Membership</button>
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

    modal.querySelector('#modal-save').addEventListener('click', async () => {
      const newTypeId = modal.querySelector('#modal-membership-type').value;
      const skipBilling = modal.querySelector('#modal-skip-billing').checked;

      if (!newTypeId) {
        alert('Please select a new membership type');
        return;
      }

      const newTypeName = membershipTypes.find(t => t.id === newTypeId)?.name || 'Unknown';

      // Confirm the change
      const confirmMsg = skipBilling
        ? `Change ${memberName}'s type from "${currentTypeName}" to "${newTypeName}"?\n\nThis will update the label only (no billing change).`
        : `Change ${memberName}'s type from "${currentTypeName}" to "${newTypeName}"?\n\nThis WILL change their Stripe subscription and billing.`;

      if (!confirm(confirmMsg)) {
        return;
      }

      const saveBtn = modal.querySelector('#modal-save');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Updating Memberstack...';

      try {
        // Call the admin-update-member Edge Function
        const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-update-member`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            memberId: memberId,
            newMembershipTypeId: newTypeId,
            skipPlanChange: skipBilling
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Update failed');
        }

        // Show success with details
        let successMsg = `Membership type updated!\n\n${result.change.from} → ${result.change.to}`;

        if (result.results.warnings && result.results.warnings.length > 0) {
          successMsg += `\n\nWarnings:\n- ${result.results.warnings.join('\n- ')}`;
        }

        alert(successMsg);
        modal.remove();

        // Refresh the dashboard
        const container = document.querySelector('.dashboard-feed');
        if (container) refreshDashboard(container);
      } catch (error) {
        console.error('Error updating membership type:', error);
        alert('Error updating membership type: ' + error.message);
        saveBtn.disabled = false;
        saveBtn.textContent = 'Update Membership';
      }
    });
  }

  async function showEventPreviewModal(eventId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal modal-preview">
        <div class="modal-header">
          <h3 class="modal-title">Event Preview</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="admin-loading" style="padding: 40px 0;">
            <div class="loader"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error || !event) {
      modal.querySelector('.modal-body').innerHTML = '<div style="padding: 24px; color: #dc3545;">Failed to load event details.</div>';
      return;
    }

    const formatDate = (d) => d
      ? new Date(d).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : '--';

    const location = [event.location_name, event.location_address].filter(Boolean).join(', ') || '--';

    modal.querySelector('.modal-title').textContent = event.name || 'Event Preview';
    modal.querySelector('.modal-body').innerHTML = `
      ${event.feature_image_url ? `<img src="${event.feature_image_url}" class="event-preview-image" alt="${event.name}">` : ''}
      <div class="preview-grid">
        <div class="preview-field">
          <div class="preview-label">Start</div>
          <div class="preview-value">${formatDate(event.date_start)}</div>
        </div>
        <div class="preview-field">
          <div class="preview-label">End</div>
          <div class="preview-value">${formatDate(event.date_end)}</div>
        </div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Location</div>
        <div class="preview-value">${location}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Description</div>
        <div class="preview-value">${event.description || '--'}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">RSVP / Tickets</div>
        <div class="preview-value">${event.rsvp_link ? `<a href="${event.rsvp_link}" target="_blank">${event.rsvp_link}</a>` : '--'}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Submitted by</div>
        <div class="preview-value">${event.member_contact_email || '--'}</div>
      </div>
    `;
  }

  async function showOpportunityPreviewModal(opportunityId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal modal-preview">
        <div class="modal-header">
          <h3 class="modal-title">Opportunity Preview</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="admin-loading" style="padding: 40px 0;">
            <div class="loader"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    const { data: opp, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single();

    if (error || !opp) {
      modal.querySelector('.modal-body').innerHTML = '<div style="padding: 24px; color: #dc3545;">Failed to load opportunity details.</div>';
      return;
    }

    const formatDate = (d) => d
      ? new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
      : '--';

    modal.querySelector('.modal-title').textContent = opp.name || 'Opportunity Preview';
    modal.querySelector('.modal-body').innerHTML = `
      <div class="preview-grid">
        <div class="preview-field">
          <div class="preview-label">Type</div>
          <div class="preview-value">${opp.opportunity_type || '--'}</div>
        </div>
        <div class="preview-field">
          <div class="preview-label">Closes</div>
          <div class="preview-value">${formatDate(opp.closing_date)}</div>
        </div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Organisation</div>
        <div class="preview-value">${opp.organization || '--'}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Description</div>
        <div class="preview-value">${opp.description || '--'}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">How to Apply</div>
        <div class="preview-value">${opp.how_to_apply || '--'}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">URL</div>
        <div class="preview-value">${opp.opportunity_url ? `<a href="${opp.opportunity_url}" target="_blank">${opp.opportunity_url}</a>` : '--'}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Remote</div>
        <div class="preview-value">${opp.is_remote ? 'Yes' : 'No'}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Submitted by</div>
        <div class="preview-value">${opp.member_name || opp.member_contact_email || '--'}</div>
      </div>
    `;
  }

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  function renderDashboard(container, data) {
    const incompleteCount = data.incompleteProfiles.length;
    const pendingEvents = data.eventStats.pending;
    const pendingOpportunities = data.opportunityStats.pending;

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
            <div class="stat-value">${data.messageStats.thisMonth}</div>
            <div class="stat-label">Messages This Month</div>
          </div>
        </div>

        <!-- Issues Section -->
        ${renderIssuesSection(data)}

        <!-- Activity Tabs -->
        <div class="admin-section">
          <div class="tabs-container">
            <button class="tab-btn active" data-tab="activity">Activity</button>
            <button class="tab-btn" data-tab="members">Recent Members</button>
            <button class="tab-btn" data-tab="incomplete">Incomplete (${incompleteCount})</button>
            <button class="tab-btn" data-tab="failed">Failed Signups (${data.failedSignups.length})</button>
            <button class="tab-btn" data-tab="events">Events ${pendingEvents > 0 ? `(${pendingEvents})` : ''}</button>
            <button class="tab-btn" data-tab="opportunities">Opportunities ${pendingOpportunities > 0 ? `(${pendingOpportunities})` : ''}</button>
            <button class="tab-btn" data-tab="projects">Projects</button>
          </div>

          <div class="tab-content active" id="tab-activity">
            ${renderActivityFeed(data.recentActivity)}
          </div>

          <div class="tab-content" id="tab-members">
            ${renderMembersTable(data.recentMembers)}
          </div>

          <div class="tab-content" id="tab-incomplete">
            ${renderIncompleteTable(data.incompleteProfiles)}
          </div>

          <div class="tab-content" id="tab-failed">
            ${renderFailedSignupsTable(data.failedSignups)}
          </div>

          <div class="tab-content" id="tab-events">
            ${renderEventsTable(data.recentEvents, data.eventStats)}
          </div>

          <div class="tab-content" id="tab-opportunities">
            ${renderOpportunitiesTable(data.recentOpportunities, data.opportunityStats)}
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
                       data.recentMembers.find(m => m.id === memberId) ||
                       data.failedSignups.find(m => m.id === memberId);
        if (member) {
          showContactModal(member);
        }
      });
    });

    // Setup approve buttons
    container.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const eventId = btn.dataset.eventId;
        const eventName = btn.dataset.eventName;

        if (!confirm(`Approve event "${eventName}"?\n\nThis will publish the event and notify the member.`)) {
          return;
        }

        btn.disabled = true;
        btn.textContent = 'Approving...';

        try {
          const adminToken = await getAdminMemberId();
          const response = await fetch(`${SUPABASE_URL}/functions/v1/manage-event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'apikey': SUPABASE_ANON_KEY,
              'X-Member-Id': adminToken,
            },
            body: JSON.stringify({
              eventId: eventId,
              action: 'approve',
            }),
          });

          const result = await response.json();

          if (result.success) {
            alert(`Event "${eventName}" has been approved!\n\nThe member will be notified and the event will sync to Webflow.`);
            refreshDashboard(container);
          } else {
            alert(`Failed to approve event: ${result.error}`);
            btn.disabled = false;
            btn.textContent = 'Approve';
          }
        } catch (error) {
          console.error('Approve error:', error);
          alert('Error approving event. Please try again.');
          btn.disabled = false;
          btn.textContent = 'Approve';
        }
      });
    });

    // Setup reject buttons
    container.querySelectorAll('.reject-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const eventId = btn.dataset.eventId;
        const eventName = btn.dataset.eventName;

        const reason = prompt(`Reject event "${eventName}"?\n\nOptionally enter a reason (or leave blank):`);

        if (reason === null) {
          return; // User cancelled
        }

        btn.disabled = true;
        btn.textContent = 'Rejecting...';

        try {
          const adminToken = await getAdminMemberId();
          const response = await fetch(`${SUPABASE_URL}/functions/v1/manage-event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'apikey': SUPABASE_ANON_KEY,
              'X-Member-Id': adminToken,
            },
            body: JSON.stringify({
              eventId: eventId,
              action: 'reject',
              rejectionReason: reason || undefined,
            }),
          });

          const result = await response.json();

          if (result.success) {
            alert(`Event "${eventName}" has been rejected.\n\nThe member will be notified.`);
            refreshDashboard(container);
          } else {
            alert(`Failed to reject event: ${result.error}`);
            btn.disabled = false;
            btn.textContent = 'Reject';
          }
        } catch (error) {
          console.error('Reject error:', error);
          alert('Error rejecting event. Please try again.');
          btn.disabled = false;
          btn.textContent = 'Reject';
        }
      });
    });

    // Setup preview buttons
    container.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        showEventPreviewModal(btn.dataset.eventId);
      });
    });

    // Setup opportunity preview buttons
    container.querySelectorAll('.preview-opp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        showOpportunityPreviewModal(btn.dataset.oppId);
      });
    });

    // Setup opportunity approve buttons
    container.querySelectorAll('.approve-opp-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const oppId = btn.dataset.oppId;
        const oppName = btn.dataset.oppName;

        if (!confirm(`Approve opportunity "${oppName}"?\n\nThis will publish it and notify the member.`)) {
          return;
        }

        btn.disabled = true;
        btn.textContent = 'Approving...';

        try {
          const adminToken = await getAdminMemberId();
          console.log('[opp-approve] token obtained:', !!adminToken);
          const response = await fetch(`${SUPABASE_URL}/functions/v1/manage-opportunity`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'apikey': SUPABASE_ANON_KEY,
              'X-Member-Id': adminToken,
            },
            body: JSON.stringify({ opportunityId: oppId, action: 'approve' }),
          });

          console.log('[opp-approve] response status:', response.status);
          const text = await response.text();
          console.log('[opp-approve] response body:', text);
          const result = JSON.parse(text);

          if (result.success) {
            alert(`Opportunity "${oppName}" has been approved!\n\nThe member will be notified.`);
            refreshDashboard(container);
          } else {
            alert(`Failed to approve opportunity: ${result.error}`);
            btn.disabled = false;
            btn.textContent = 'Approve';
          }
        } catch (error) {
          console.error('Opportunity approve error:', error);
          alert('Error approving opportunity. Please try again.');
          btn.disabled = false;
          btn.textContent = 'Approve';
        }
      });
    });

    // Setup opportunity reject buttons
    container.querySelectorAll('.reject-opp-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const oppId = btn.dataset.oppId;
        const oppName = btn.dataset.oppName;

        const reason = prompt(`Reject opportunity "${oppName}"?\n\nOptionally enter a reason (or leave blank):`);

        if (reason === null) {
          return; // User cancelled
        }

        btn.disabled = true;
        btn.textContent = 'Rejecting...';

        try {
          const adminToken = await getAdminMemberId();
          const response = await fetch(`${SUPABASE_URL}/functions/v1/manage-opportunity`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'apikey': SUPABASE_ANON_KEY,
              'X-Member-Id': adminToken,
            },
            body: JSON.stringify({
              opportunityId: oppId,
              action: 'reject',
              rejectionReason: reason || undefined,
            }),
          });

          const result = await response.json();

          if (result.success) {
            alert(`Opportunity "${oppName}" has been rejected.\n\nThe member will be notified.`);
            refreshDashboard(container);
          } else {
            alert(`Failed to reject opportunity: ${result.error}`);
            btn.disabled = false;
            btn.textContent = 'Reject';
          }
        } catch (error) {
          console.error('Opportunity reject error:', error);
          alert('Error rejecting opportunity. Please try again.');
          btn.disabled = false;
          btn.textContent = 'Reject';
        }
      });
    });

    // Setup edit buttons
    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const memberId = btn.dataset.memberId;
        const memberName = btn.dataset.memberName;
        const currentTypeId = btn.dataset.currentType;
        showEditMemberModal(memberId, memberName, currentTypeId);
      });
    });

    // Setup delete buttons
    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const memberId = btn.dataset.memberId;
        const memberName = btn.dataset.memberName;

        if (!confirm(`Delete "${memberName}"?\n\nThis will remove them from the dashboard and Webflow directory. This action cannot be undone.`)) {
          return;
        }

        btn.disabled = true;
        btn.textContent = 'Deleting...';

        try {
          // Soft delete: set is_deleted = true and subscription_status = 'deleted'
          const { error } = await supabase
            .from('members')
            .update({
              is_deleted: true,
              subscription_status: 'deleted',
              updated_at: new Date().toISOString()
            })
            .eq('id', memberId);

          if (error) {
            throw error;
          }

          alert(`"${memberName}" has been deleted.`);
          refreshDashboard(container);
        } catch (error) {
          console.error('Delete error:', error);
          alert('Error deleting member. Please try again.');
          btn.disabled = false;
          btn.textContent = 'Delete';
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

    if (data.opportunityStats.pending > 0) {
      issues.push({
        type: 'info',
        text: 'Opportunities pending review',
        count: data.opportunityStats.pending
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
            <th>Type</th>
            <th>Status</th>
            <th>Profile</th>
            <th>Joined</th>
            <th>Action</th>
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
                <span class="type-cell">${member.membership_types?.name || 'Not set'}</span>
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
              <td class="time-cell">${timeAgo(member.created_at)}</td>
              <td>
                <div class="action-btns">
                  <button class="action-btn edit-btn" data-member-id="${member.id}" data-member-name="${member.name || member.first_name || 'this member'}" data-current-type="${member.membership_type_id || ''}">Edit</button>
                  ${member.webflow_id && member.slug ? `
                    <a href="${SITE_URL}/members/${member.slug}" target="_blank" class="action-btn view-btn">View</a>
                  ` : ''}
                  <button class="action-btn delete-btn" data-member-id="${member.id}" data-member-name="${member.name || member.first_name || 'this member'}">Delete</button>
                </div>
              </td>
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
                  <div class="action-btns">
                    ${member.profile_reminder_sent_at ? `
                      <button class="action-btn contacted" disabled>Contacted</button>
                    ` : `
                      <button class="action-btn contact-btn" data-member-id="${member.id}">Contact</button>
                    `}
                    ${member.webflow_id && member.slug ? `
                      <a href="${SITE_URL}/members/${member.slug}" target="_blank" class="action-btn">View</a>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  function renderFailedSignupsTable(members) {
    if (members.length === 0) {
      return '<div class="empty-state">No failed signups found</div>';
    }

    return `
      <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; font-size: 12px; color: #666;">
        Members who started signup but never completed payment (not active, not lapsed)
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Status</th>
            <th>Started</th>
            <th>Action</th>
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
                <span class="status pending">
                  ${member.subscription_status || 'no status'}
                </span>
              </td>
              <td class="time-cell">${timeAgo(member.created_at)}</td>
              <td>
                <div class="action-btns">
                  ${member.profile_reminder_sent_at ? `
                    <button class="action-btn contacted" disabled>Contacted</button>
                  ` : `
                    <button class="action-btn contact-btn" data-member-id="${member.id}">Contact</button>
                  `}
                  <button class="action-btn delete-btn" data-member-id="${member.id}" data-member-name="${member.name || member.first_name || 'this member'}">Delete</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function renderEventsTable(events, stats) {
    return `
      <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; font-size: 11px; color: #666;">
        <span style="margin-right: 24px;"><strong style="color: #f59f00;">${stats.pending}</strong> Pending</span>
        <span><strong style="color: #1a1a1a;">${stats.published}</strong> Published</span>
      </div>
      ${events.length === 0 ? '<div class="empty-state">No events found</div>' : `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Status</th>
              <th>Webflow</th>
              <th>Created</th>
              <th>Action</th>
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
                  <td>
                    <div class="action-btns">
                      ${status === 'pending' ? `
                        <button class="action-btn preview-btn" data-event-id="${event.id}">Preview</button>
                        <button class="action-btn approve-btn" data-event-id="${event.id}" data-event-name="${event.name}">Approve</button>
                        <button class="action-btn reject-btn" data-event-id="${event.id}" data-event-name="${event.name}">Reject</button>
                      ` : ''}
                      ${event.webflow_id && event.slug ? `
                        <a href="${SITE_URL}/event/${event.slug}" target="_blank" class="action-btn view-btn">View</a>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `}
    `;
  }

  function renderOpportunitiesTable(opportunities, stats) {
    return `
      <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; font-size: 11px; color: #666;">
        <span style="margin-right: 24px;"><strong style="color: #f59f00;">${stats.pending}</strong> Pending</span>
        <span><strong style="color: #1a1a1a;">${stats.published}</strong> Published</span>
      </div>
      ${opportunities.length === 0 ? '<div class="empty-state">No opportunities found</div>' : `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Opportunity</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${opportunities.map(opp => {
              let status = 'draft';
              if (opp.is_archived) status = 'archived';
              else if (!opp.is_draft) status = 'published';
              else status = 'pending';

              return `
                <tr>
                  <td>
                    <div class="name-cell">${opp.name || 'Untitled'}</div>
                    <div class="email-cell">${opp.member_contact_email || '--'}</div>
                  </td>
                  <td>
                    <span class="type-cell">${opp.opportunity_type || '--'}</span>
                  </td>
                  <td>
                    <span class="status ${status === 'published' ? 'complete' : status === 'pending' ? 'pending' : 'draft'}">
                      ${status}
                    </span>
                  </td>
                  <td class="time-cell">${timeAgo(opp.created_at)}</td>
                  <td>
                    <div class="action-btns">
                      ${status === 'pending' ? `
                        <button class="action-btn preview-opp-btn" data-opp-id="${opp.id}">Preview</button>
                        <button class="action-btn approve-opp-btn" data-opp-id="${opp.id}" data-opp-name="${opp.name}">Approve</button>
                        <button class="action-btn reject-opp-btn" data-opp-id="${opp.id}" data-opp-name="${opp.name}">Reject</button>
                      ` : ''}
                      ${opp.webflow_id && opp.slug ? `
                        <a href="${SITE_URL}/opportunities/${opp.slug}" target="_blank" class="action-btn view-btn">View</a>
                      ` : ''}
                    </div>
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
            <th>Webflow</th>
            <th>Updated</th>
            <th>Action</th>
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
              <td>
                ${project.webflow_id && project.slug ? `
                  <a href="${SITE_URL}/projects/${project.slug}" target="_blank" class="action-btn view-btn">View</a>
                ` : '--'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function renderActivityFeed(activities) {
    if (!activities || activities.length === 0) {
      return '<div class="empty-state">No recent activity</div>';
    }

    const getActivityIcon = (type) => {
      if (type === 'member_signup') return { class: 'signup', icon: '🎉' };
      if (type === 'profile_update') return { class: 'profile', icon: '👤' };
      if (type.startsWith('project_')) return { class: 'project', icon: '📁' };
      if (type.startsWith('event_')) return { class: 'event', icon: '📅' };
      if (type.startsWith('opportunity_')) return { class: 'event', icon: '💼' };
      if (type === 'subscription_canceled') return { class: 'canceled', icon: '🚫' };
      if (type === 'subscription_reactivated') return { class: 'reactivated', icon: '✅' };
      return { class: '', icon: '📝' };
    };

    const getViewUrl = (activity) => {
      // Don't show View for new signups - they won't have a profile until onboarding completes
      if (activity.activity_type === 'member_signup') return null;
      if (activity.entity_webflow_url) return activity.entity_webflow_url;
      if (activity.member_webflow_url) return activity.member_webflow_url;
      return null;
    };

    return `
      <div class="activity-feed">
        ${activities.map(activity => {
          const icon = getActivityIcon(activity.activity_type);
          const viewUrl = getViewUrl(activity);
          const hasProfileImage = activity.member_profile_image;

          return `
            <div class="activity-item">
              ${hasProfileImage ? `
                <div class="activity-avatar">
                  <img src="${activity.member_profile_image}" alt="${activity.member_name}">
                </div>
              ` : `
                <div class="activity-icon ${icon.class}">${icon.icon}</div>
              `}
              <div class="activity-content">
                <div class="activity-text">
                  <strong>${activity.member_name}</strong> ${activity.description}
                </div>
                <div class="activity-meta">
                  <span class="activity-time">${timeAgo(activity.created_at)}</span>
                </div>
              </div>
              <div class="activity-action">
                ${viewUrl ? `
                  <a href="${viewUrl}" target="_blank" class="action-btn">View</a>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
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
