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

    /* Support Tracker — extends existing .status and .action-btn systems */

    /* Category badges — coloured backgrounds on top of existing .status base */
    .status.member_support  { background: #fff3e0; border-color: #e65100; color: #e65100; }
    .status.website_bug     { background: #fce4ec; border-color: #c62828; color: #c62828; }
    .status.feature_request { background: #e8f5e9; border-color: #2e7d32; color: #2e7d32; }

    /* Task status modifiers — added to existing .status system */
    .status.not_started     { border-color: #bbb; color: #888; }
    .status.in_progress     { border-color: #f57f17; color: #f57f17; }
    .status.feedback_needed { border-color: #1565c0; color: #1565c0; }
    .status.stalled         { border-color: #dc3545; color: #dc3545; }

    /* Support toolbar — two-button layout */
    .support-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 20px;
      flex-wrap: wrap;
    }

    .support-toolbar-actions { display: flex; gap: 8px; align-items: center; }

    /* Archive view */
    .archive-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid #e8e8e8;
    }

    .archive-header h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .archive-month-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 20px;
    }

    .month-card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .month-card:hover { border-color: #bbb; background: #fafafa; }

    .month-card.expanded { border-color: #1a1a1a; }

    .month-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .month-card-name {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .month-card-chevron {
      font-size: 10px;
      color: #aaa;
      transition: transform 0.15s;
    }

    .month-card.expanded .month-card-chevron { transform: rotate(180deg); }

    .month-card-stats {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #888;
    }

    .month-card-stat strong { color: #1a1a1a; }

    .month-tasks {
      display: none;
      margin-top: 10px;
      border-top: 1px solid #e8e8e8;
      padding-top: 10px;
    }

    .month-card.expanded .month-tasks { display: block; }

    .month-task-item {
      padding: 6px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 12px;
      color: #333;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .month-task-item:last-child { border-bottom: none; }

    .month-task-title {
      flex: 1;
      line-height: 1.4;
      cursor: pointer;
    }

    .month-task-title:hover { color: #0066cc; }

    .month-task-meta { color: #aaa; white-space: nowrap; }

    /* Comments */
    .comments-section { margin-top: 16px; }
    .comments-title { font-size: 11px; font-weight: 500; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
    .comment-item { display: flex; gap: 10px; margin-bottom: 12px; }
    .comment-author-badge {
      background: #1a1a1a; color: #fff; border-radius: 50%;
      width: 26px; height: 26px; display: flex; align-items: center;
      justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0;
    }
    .comment-author-badge.hannah { background: #6366f1; }
    .comment-body { flex: 1; }
    .comment-meta { font-size: 11px; color: #999; margin-bottom: 3px; }
    .comment-text { font-size: 13px; line-height: 1.5; }
    .comment-input-row { display: flex; gap: 8px; margin-top: 12px; align-items: flex-end; }

    /* Member autocomplete */
    .member-search-wrap { position: relative; }
    .member-suggestions {
      position: absolute; top: 100%; left: 0; right: 0; background: #fff;
      border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 6px 6px;
      z-index: 100; max-height: 200px; overflow-y: auto;
    }
    .member-suggestion-item { padding: 8px 12px; font-size: 13px; cursor: pointer; }
    .member-suggestion-item:hover { background: #f5f5f5; }

    @media (max-width: 768px) {
      .support-toolbar { flex-direction: column; align-items: flex-start; }
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
            <button class="tab-btn" data-tab="support">Support</button>
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

          <div class="tab-content" id="tab-support">
            <div id="support-tracker-root">Loading...</div>
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
        if (tab.dataset.tab === 'support') {
          initSupportTracker();
        }
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
          const response = await fetch(`${SUPABASE_URL}/functions/v1/manage-event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'apikey': SUPABASE_ANON_KEY,
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
          const response = await fetch(`${SUPABASE_URL}/functions/v1/manage-event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'apikey': SUPABASE_ANON_KEY,
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
          const response = await fetch(`${SUPABASE_URL}/functions/v1/manage-opportunity`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'apikey': SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ opportunityId: oppId, action: 'approve' }),
          });

          const result = await response.json();

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
          const response = await fetch(`${SUPABASE_URL}/functions/v1/manage-opportunity`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'apikey': SUPABASE_ANON_KEY,
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
  // SUPPORT TRACKER
  // ============================================

  const SUPPORT_CATEGORY_LABELS = {
    member_support:  'Member Support',
    website_bug:     'Website Bug',
    feature_request: 'Feature Request',
  };

  const SUPPORT_STATUS_LABELS = {
    not_started:      'Not Started',
    in_progress:      'In Progress',
    feedback_needed:  'Feedback Needed',
    complete:         'Complete',
    stalled:          'Stalled',
  };

  // 'main' shows active tasks; 'archive' shows monthly overview of completed tasks
  let supportView = 'main';

  const SUPPORT_ACTIVE_STATUSES   = new Set(['not_started', 'in_progress', 'feedback_needed']);
  const SUPPORT_ARCHIVED_STATUSES = new Set(['complete', 'stalled']);

  async function loadSupportTasks() {
    const { data, error } = await supabase
      .from('support_tasks')
      .select('*, support_task_comments(*)')
      .order('created_at', { ascending: false });
    if (error) { console.error('loadSupportTasks:', error); return []; }
    (data || []).forEach(t => t.support_task_comments?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
    return data || [];
  }

  async function initSupportTracker() {
    const root = document.getElementById('support-tracker-root');
    if (!root) return;
    root.innerHTML = '<div style="padding:20px;color:#888;font-size:13px;">Loading...</div>';
    const tasks = await loadSupportTasks();
    renderSupportTracker(root, tasks);
  }

  function renderSupportTracker(root, tasks) {
    const isArchive = supportView === 'archive';

    root.innerHTML = `
      <div class="support-toolbar">
        <div class="support-toolbar-actions">
          <button class="admin-btn primary" id="new-task-btn">+ New Task</button>
          <button class="admin-btn ${isArchive ? 'primary' : ''}" id="archive-view-btn">Archive</button>
        </div>
        ${isArchive
          ? '<span style="font-size:12px;color:#888;">Completed &amp; stalled tasks</span>'
          : '<span style="font-size:12px;color:#888;">Active tasks</span>'}
      </div>
    `;

    if (isArchive) {
      renderMonthlyArchive(root, tasks.filter(t => SUPPORT_ARCHIVED_STATUSES.has(t.status)));
    } else {
      const active = tasks.filter(t => SUPPORT_ACTIVE_STATUSES.has(t.status));
      const tableEl = document.createElement('div');
      tableEl.innerHTML = active.length === 0
        ? '<div class="empty-state" style="padding:40px 20px;">No active tasks.</div>'
        : `<table class="admin-table" id="support-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Date</th>
                <th>Task</th>
                <th>Member</th>
                <th>Status</th>
                <th>Hours</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${active.map(t => renderSupportRow(t)).join('')}
            </tbody>
          </table>`;
      root.appendChild(tableEl);

      // Notes modal buttons
      root.querySelectorAll('.task-detail-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const task = tasks.find(t => t.id === btn.dataset.taskId);
          if (task) showTaskDetailModal(task);
        });
      });

      // Status selects
      root.querySelectorAll('.form-input[data-task-id]').forEach(sel => {
        sel.addEventListener('change', async () => {
          const task = tasks.find(t => t.id === sel.dataset.taskId);
          await updateTaskStatus(sel.dataset.taskId, sel.value, task);
          await initSupportTracker();
        });
      });

      // Edit buttons
      root.querySelectorAll('.task-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const task = tasks.find(t => t.id === btn.dataset.taskId);
          if (task) showEditTaskModal(task);
        });
      });
    }

    // Toolbar buttons (always present)
    root.querySelector('#new-task-btn')?.addEventListener('click', () => showNewTaskModal());
    root.querySelector('#archive-view-btn')?.addEventListener('click', () => {
      supportView = supportView === 'archive' ? 'main' : 'archive';
      initSupportTracker();
    });
  }

  function renderMonthlyArchive(root, archivedTasks) {
    // Group by YYYY-MM of created_at (the month the work was originally logged)
    const byMonth = {};
    archivedTasks.forEach(t => {
      const d = new Date(t.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!byMonth[key]) byMonth[key] = [];
      byMonth[key].push(t);
    });

    const monthKeys = Object.keys(byMonth).sort((a, b) => b.localeCompare(a)); // newest first

    if (monthKeys.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.style.padding = '40px 20px';
      empty.textContent = 'No archived tasks yet.';
      root.appendChild(empty);
      return;
    }

    function monthLabel(key) {
      const [y, m] = key.split('-');
      return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
    }

    const grid = document.createElement('div');
    grid.className = 'archive-month-grid';

    monthKeys.forEach(key => {
      // Sort tasks within month: most recently updated first
      const monthTasks = byMonth[key].slice().sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      const totalHours = monthTasks.reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0);
      const hoursDisplay = totalHours > 0 ? `${totalHours % 1 === 0 ? totalHours : totalHours.toFixed(2)}h` : '—';

      const card = document.createElement('div');
      // All cards start expanded
      card.className = 'month-card expanded';
      card.innerHTML = `
        <div class="month-card-header">
          <div class="month-card-name">${monthLabel(key)}</div>
          <div class="month-card-chevron">▼</div>
        </div>
        <div class="month-card-stats">
          <div class="month-card-stat"><strong>${monthTasks.length}</strong> task${monthTasks.length !== 1 ? 's' : ''}</div>
          <div class="month-card-stat"><strong>${hoursDisplay}</strong></div>
        </div>
        <div class="month-tasks">
          ${monthTasks.map(t => `
            <div class="month-task-item">
              <div class="month-task-title" data-task-id="${t.id}">
                <span class="status ${t.category}" style="font-size:10px;padding:2px 6px;margin-right:4px;">${SUPPORT_CATEGORY_LABELS[t.category] || t.category}</span>
                ${escHtml(t.title.length > 80 ? t.title.substring(0, 77) + '…' : t.title)}
              </div>
              <div class="month-task-meta">${t.hours != null ? t.hours + 'h' : ''}</div>
            </div>
          `).join('')}
        </div>
      `;

      card.addEventListener('click', () => {
        card.classList.toggle('expanded');
      });

      // Task title clicks → open detail modal (need tasks ref from outer scope)
      card.querySelectorAll('.month-task-title').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          // We need the full task with comments — trigger a fresh load for this task
          const taskId = el.dataset.taskId;
          supabase.from('support_tasks').select('*, support_task_comments(*)').eq('id', taskId).single().then(({ data: t }) => {
            if (t) {
              t.support_task_comments?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
              showTaskDetailModal(t);
            }
          });
        });
      });

      grid.appendChild(card);
    });

    root.appendChild(grid);
  }

  function renderSupportRow(task) {
    const comments = task.support_task_comments || [];
    return `
      <tr>
        <td><span class="status ${task.category}">${SUPPORT_CATEGORY_LABELS[task.category] || task.category}</span></td>
        <td class="time-cell">${formatDate(task.created_at)}</td>
        <td>
          <div class="name-cell" title="${escHtml(task.title)}" style="cursor:default;">${escHtml(task.title.length > 80 ? task.title.substring(0, 77) + '…' : task.title)}</div>
        </td>
        <td>
          ${task.member_name
            ? (task.member_profile_url
                ? `<a class="email-cell" href="${task.member_profile_url}" target="_blank" style="color:#0066cc;text-decoration:none;">${escHtml(task.member_name)}</a>`
                : `<span class="email-cell">${escHtml(task.member_name)}</span>`)
            : ''}
        </td>
        <td>
          <select class="form-input" data-task-id="${task.id}" style="padding:4px 8px;font-size:12px;width:auto;">
            ${Object.entries(SUPPORT_STATUS_LABELS).map(([val, label]) =>
              `<option value="${val}" ${task.status === val ? 'selected' : ''}>${label}</option>`
            ).join('')}
          </select>
        </td>
        <td class="time-cell">${task.hours != null ? task.hours + 'h' : ''}</td>
        <td>
          <div class="action-btns">
            <button class="action-btn task-detail-btn" data-task-id="${task.id}">
              ${comments.length > 0 ? `Notes (${comments.length})` : 'Notes'}
            </button>
            <button class="action-btn edit-btn task-edit-btn" data-task-id="${task.id}">Edit</button>
          </div>
        </td>
      </tr>
    `;
  }

  function showTaskDetailModal(task) {
    const comments = task.support_task_comments || [];
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width:620px;">
        <div class="modal-header">
          <div>
            <span class="status ${task.category}" style="margin-bottom:6px;display:inline-block;">${SUPPORT_CATEGORY_LABELS[task.category] || task.category}</span>
            <h3 class="modal-title" style="margin-top:6px;">${escHtml(task.title)}</h3>
          </div>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          ${task.description ? `
            <div class="form-field">
              <div class="form-label">Description</div>
              <div style="font-size:13px;line-height:1.7;color:#333;white-space:pre-wrap;">${escHtml(task.description)}</div>
            </div>
          ` : ''}
          ${task.notes ? `
            <div class="form-field">
              <div class="form-label">Notes</div>
              <div style="font-size:13px;line-height:1.7;color:#555;white-space:pre-wrap;">${escHtml(task.notes)}</div>
            </div>
          ` : ''}
          ${task.member_name ? `
            <div class="form-field">
              <div class="form-label">Member</div>
              <div style="font-size:13px;">
                ${task.member_profile_url
                  ? `<a href="${task.member_profile_url}" target="_blank" style="color:#0066cc;">${escHtml(task.member_name)}</a>`
                  : escHtml(task.member_name)}
              </div>
            </div>
          ` : ''}

          <div class="comments-section">
            <div class="comments-title">Comments (${comments.length}/5)</div>
            <div id="task-comments-list">
              ${comments.map(c => `
                <div class="comment-item">
                  <div class="comment-author-badge ${c.author.toLowerCase() === 'hannah' || c.author === 'MTNS MADE' ? 'hannah' : ''}">${c.author.charAt(0).toUpperCase()}</div>
                  <div class="comment-body">
                    <div class="comment-meta">${escHtml(c.author)} &middot; ${formatDate(c.created_at)}</div>
                    <div class="comment-text">${escHtml(c.body)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            ${comments.length < 5 ? `
              <div class="comment-input-row" style="margin-top:16px;">
                <textarea class="form-input" id="task-comment-input" placeholder="Add a comment..." style="min-height:70px;resize:none;flex:1;"></textarea>
              </div>
            ` : '<div style="font-size:12px;color:#999;margin-top:8px;">Maximum 5 comments reached.</div>'}
          </div>
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="td-close">Close</button>
          ${comments.length < 5 ? `<button class="admin-btn primary" id="td-add-comment">Add Comment</button>` : ''}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#td-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    const addBtn = modal.querySelector('#td-add-comment');
    if (addBtn) {
      addBtn.addEventListener('click', async () => {
        const input = modal.querySelector('#task-comment-input');
        const text = input?.value.trim();
        if (!text) return;
        addBtn.disabled = true;
        addBtn.textContent = 'Saving...';
        await supabase.from('support_task_comments').insert({
          task_id: task.id,
          author: 'Racket',
          body: text,
        });
        modal.remove();
        await sendTaskNotification('comment', task, text);
        await initSupportTracker();
      });
    }
  }

  async function updateTaskStatus(taskId, newStatus, task) {
    await supabase.from('support_tasks').update({ status: newStatus }).eq('id', taskId);

    if (newStatus === 'feedback_needed') {
      await sendTaskNotification('feedback_needed', task || { id: taskId, title: '(task)', status: newStatus });
    } else if (newStatus === 'complete') {
      await sendTaskNotification('complete', task || { id: taskId, title: '(task)', status: newStatus });
    }
  }

  async function sendTaskNotification(event, task, commentText) {
    const categoryLabel = SUPPORT_CATEGORY_LABELS[task.category] || task.category || '';
    const memberLine = task.member_name ? `\nMember: ${task.member_name}${task.member_profile_url ? ' — ' + task.member_profile_url : ''}` : '';

    let to, subject, body;

    const dashboardLink = 'https://www.mtnsmade.com.au/admin/dashboard';

    if (event === 'created') {
      to = 'contact@racket.net.au';
      subject = `New MTNS MADE support task: ${task.title}`;
      body = `A new support task has been logged.\n\nCategory: ${categoryLabel}${memberLine}\nTask: ${task.title}\n${task.description ? '\n' + task.description : ''}\n\nView on dashboard: ${dashboardLink}`;
    } else if (event === 'comment') {
      to = 'hello@mtnsmade.com.au';
      subject = `New comment on: ${task.title}`;
      body = `Racket has added a comment to a support task.\n\nCategory: ${categoryLabel}${memberLine}\nTask: ${task.title}\n\nComment:\n${commentText}\n\nView on dashboard: ${dashboardLink}`;
    } else if (event === 'feedback_needed') {
      to = 'hello@mtnsmade.com.au';
      subject = `Feedback needed: ${task.title}`;
      body = `A support task requires your feedback.\n\nCategory: ${categoryLabel}${memberLine}\nTask: ${task.title}\n${task.description ? '\n' + task.description : ''}\n\nView on dashboard: ${dashboardLink}`;
    } else if (event === 'complete') {
      to = 'hello@mtnsmade.com.au';
      subject = `Task complete: ${task.title}`;
      body = `A support task has been marked complete.\n\nCategory: ${categoryLabel}${memberLine}\nTask: ${task.title}\n\nView on dashboard: ${dashboardLink}`;
    } else {
      return;
    }

    try {
      await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, text: body, html: body.replace(/\n/g, '<br>') }),
      });
    } catch (e) {
      console.error('sendTaskNotification error:', e);
    }
  }

  // Member search (debounced)
  let memberSearchTimer = null;
  async function searchMembers(query) {
    if (!query || query.length < 2) return [];
    const { data } = await supabase
      .from('members')
      .select('id, name, slug, business_name')
      .or(`name.ilike.%${query}%,business_name.ilike.%${query}%`)
      .eq('subscription_status', 'active')
      .limit(8);
    return data || [];
  }

  function showNewTaskModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width:560px;">
        <div class="modal-header">
          <h3 class="modal-title">New Support Task</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label class="form-label">Category</label>
            <select class="form-input" id="st-category">
              <option value="member_support">Member Support</option>
              <option value="website_bug">Website Bug</option>
              <option value="feature_request">Feature Request</option>
            </select>
          </div>
          <div class="form-field" id="st-member-field">
            <label class="form-label">Member</label>
            <div class="member-search-wrap">
              <input type="text" class="form-input" id="st-member-search" placeholder="Search by name or trading name..." autocomplete="off">
              <div class="member-suggestions" id="st-member-suggestions" style="display:none;"></div>
            </div>
            <input type="hidden" id="st-member-id">
            <input type="hidden" id="st-member-name">
            <input type="hidden" id="st-member-url">
          </div>
          <div class="form-field">
            <label class="form-label">Title</label>
            <input type="text" class="form-input" id="st-title" placeholder="Brief summary of the task">
          </div>
          <div class="form-field">
            <label class="form-label">Description</label>
            <textarea class="form-input" id="st-description" style="min-height:80px;" placeholder="Full details, context, links..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="st-cancel">Cancel</button>
          <button class="admin-btn primary" id="st-save">Create Task</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Show/hide member field based on category
    const catSel = modal.querySelector('#st-category');
    const memberField = modal.querySelector('#st-member-field');
    const toggleMemberField = () => {
      memberField.style.display = catSel.value === 'member_support' ? 'block' : 'none';
    };
    toggleMemberField();
    catSel.addEventListener('change', toggleMemberField);

    // Member search autocomplete
    const memberInput = modal.querySelector('#st-member-search');
    const suggestions = modal.querySelector('#st-member-suggestions');
    memberInput.addEventListener('input', () => {
      clearTimeout(memberSearchTimer);
      const q = memberInput.value.trim();
      if (q.length < 2) { suggestions.style.display = 'none'; return; }
      memberSearchTimer = setTimeout(async () => {
        const results = await searchMembers(q);
        if (results.length === 0) { suggestions.style.display = 'none'; return; }
        suggestions.innerHTML = results.map(m =>
          `<div class="member-suggestion-item" data-id="${m.id}" data-name="${escHtml(m.name || '')}" data-slug="${m.slug || ''}">
            ${escHtml(m.name || m.id)}
            ${m.business_name ? `<span style="display:block;font-size:11px;color:#888;margin-top:1px;">${escHtml(m.business_name)}</span>` : ''}
          </div>`
        ).join('');
        suggestions.style.display = 'block';
        suggestions.querySelectorAll('.member-suggestion-item').forEach(item => {
          item.addEventListener('click', () => {
            modal.querySelector('#st-member-id').value = item.dataset.id;
            modal.querySelector('#st-member-name').value = item.dataset.name;
            modal.querySelector('#st-member-url').value = item.dataset.slug ? `${SITE_URL}/members/${item.dataset.slug}` : '';
            memberInput.value = item.dataset.name;
            suggestions.style.display = 'none';
          });
        });
      }, 250);
    });

    // Close
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#st-cancel').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    // Save
    modal.querySelector('#st-save').addEventListener('click', async () => {
      const title = modal.querySelector('#st-title').value.trim();
      const category = modal.querySelector('#st-category').value;
      if (!title) { alert('Please enter a task title.'); return; }

      const saveBtn = modal.querySelector('#st-save');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      const memberId = modal.querySelector('#st-member-id').value;
      const payload = {
        category,
        title,
        description: modal.querySelector('#st-description').value.trim() || null,
        status: 'not_started',
        hours: null,
        member_id: memberId || null,
        member_name: modal.querySelector('#st-member-name').value || null,
        member_profile_url: modal.querySelector('#st-member-url').value || null,
      };

      const { data: newTask, error } = await supabase.from('support_tasks').insert(payload).select().single();

      if (error) {
        alert('Error creating task: ' + error.message);
        saveBtn.disabled = false;
        saveBtn.textContent = 'Create Task';
        return;
      }

      modal.remove();
      await sendTaskNotification('created', newTask);
      await initSupportTracker();
    });
  }

  function showEditTaskModal(task) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width:560px;">
        <div class="modal-header">
          <h3 class="modal-title">Edit Task</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label class="form-label">Category</label>
            <select class="form-input" id="et-category">
              <option value="member_support" ${task.category === 'member_support' ? 'selected' : ''}>Member Support</option>
              <option value="website_bug" ${task.category === 'website_bug' ? 'selected' : ''}>Website Bug</option>
              <option value="feature_request" ${task.category === 'feature_request' ? 'selected' : ''}>Feature Request</option>
            </select>
          </div>
          <div class="form-field">
            <label class="form-label">Title</label>
            <input type="text" class="form-input" id="et-title" value="${escHtml(task.title)}">
          </div>
          <div class="form-field">
            <label class="form-label">Description</label>
            <textarea class="form-input" id="et-description" style="min-height:80px;">${escHtml(task.description || '')}</textarea>
          </div>
          <div class="form-field">
            <label class="form-label">Notes</label>
            <textarea class="form-input" id="et-notes" style="min-height:60px;" placeholder="Internal notes, resolution summary...">${escHtml(task.notes || '')}</textarea>
          </div>
          <div class="form-field">
            <label class="form-label">Status</label>
            <select class="form-input" id="et-status">
              ${Object.entries(SUPPORT_STATUS_LABELS).map(([val, label]) =>
                `<option value="${val}" ${task.status === val ? 'selected' : ''}>${label}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-field">
            <label class="form-label">Hours</label>
            <input type="number" class="form-input" id="et-hours" value="${task.hours != null ? task.hours : ''}" step="0.25" min="0" style="max-width:120px;">
          </div>
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="et-delete" style="color:#dc3545;border-color:#dc3545;margin-right:auto;">Delete</button>
          <button class="admin-btn" id="et-cancel">Cancel</button>
          <button class="admin-btn primary" id="et-save">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#et-cancel').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    modal.querySelector('#et-delete').addEventListener('click', async () => {
      if (!confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
      const delBtn = modal.querySelector('#et-delete');
      delBtn.disabled = true;
      delBtn.textContent = 'Deleting...';
      await supabase.from('support_task_comments').delete().eq('task_id', task.id);
      await supabase.from('support_tasks').delete().eq('id', task.id);
      modal.remove();
      await initSupportTracker();
    });

    modal.querySelector('#et-save').addEventListener('click', async () => {
      const saveBtn = modal.querySelector('#et-save');
      const newStatus = modal.querySelector('#et-status').value;
      const statusChanged = newStatus !== task.status;

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      const hours = modal.querySelector('#et-hours').value;
      const { error } = await supabase.from('support_tasks').update({
        category:    modal.querySelector('#et-category').value,
        title:       modal.querySelector('#et-title').value.trim(),
        description: modal.querySelector('#et-description').value.trim() || null,
        notes:       modal.querySelector('#et-notes').value.trim() || null,
        status:      newStatus,
        hours:       hours ? parseFloat(hours) : null,
      }).eq('id', task.id);

      if (error) {
        alert('Error saving: ' + error.message);
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
        return;
      }

      if (statusChanged) {
        await sendTaskNotification(newStatus === 'feedback_needed' ? 'feedback_needed' : newStatus === 'complete' ? 'complete' : null, task);
      }

      modal.remove();
      await initSupportTracker();
    });
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: '2-digit' });
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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
