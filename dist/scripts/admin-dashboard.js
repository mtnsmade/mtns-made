(function(){console.log("Admin dashboard v2 loaded");const v="https://epszwomtxkpjegbjbixr.supabase.co",g="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",y="https://www.mtnsmade.com.au";let m=null,E=null,T=[];const I=`
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

    /* Retainer banner */
    .retainer-banner {
      margin: 0 20px 12px;
      padding: 14px 16px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      background: #f9f9f9;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .retainer-banner.approaching {
      background: #fff8e1;
      border-color: #f9a825;
    }

    .retainer-banner.over {
      background: #fce4ec;
      border-color: #c62828;
    }

    .retainer-label {
      font-size: 12px;
      font-weight: 600;
      color: #555;
      white-space: nowrap;
    }

    .retainer-bar-wrap {
      flex: 1;
      min-width: 120px;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }

    .retainer-bar-fill {
      height: 100%;
      border-radius: 4px;
      background: #4caf50;
      transition: width 0.3s;
    }

    .retainer-banner.approaching .retainer-bar-fill { background: #f9a825; }
    .retainer-banner.over .retainer-bar-fill { background: #e53935; }

    .retainer-hours {
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      color: #1a1a1a;
    }

    .retainer-status {
      font-size: 12px;
      color: #555;
      white-space: nowrap;
    }

    .retainer-banner.approaching .retainer-status { color: #e65100; font-weight: 600; }
    .retainer-banner.over .retainer-status { color: #c62828; font-weight: 600; }

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
  `;function x(e){if(!e)return"--";const t=new Date(e),o=Math.floor((new Date-t)/1e3);return o<60?"now":o<3600?`${Math.floor(o/60)}m`:o<86400?`${Math.floor(o/3600)}h`:o<604800?`${Math.floor(o/86400)}d`:t.toLocaleDateString("en-AU",{day:"2-digit",month:"short"})}function R(){return new Date().toLocaleString("en-AU",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).toUpperCase()}function j(e){const t=[];return e.profile_image_url||t.push("Profile Image"),e.header_image_url||t.push("Header Image"),(!e.bio||e.bio.length<50)&&t.push("Bio"),e.suburb_id||t.push("Location"),t}function U(e,t){const i=e.first_name||e.name||"there",o=t.length>0?`

To complete your profile, you'll need:
${t.map(n=>`- ${n}`).join(`
`)}`:"";return`Hi ${i},

Thanks for being part of MTNS MADE! We noticed your profile isn't quite complete yet.

A complete profile helps other creatives find you in the directory and shows off your amazing work.${o}

Complete your profile here: ${y}/profile/start

Let us know if you need any help!

MTNS MADE Team`}async function M(){const[e,t,i,o,n,r,a,s,l,d,c,p]=await Promise.all([F(),H(),V(),J(),Y(),G(),K(),Q(),X(),W(),Z(),B()]);return T=p,{recentMembers:e,memberStats:t,incompleteProfiles:i,failedSignups:o,recentEvents:n,eventStats:r,recentOpportunities:a,opportunityStats:s,recentProjects:l,messageStats:d,recentActivity:c,membershipTypes:p,loadedAt:new Date}}async function F(){const{data:e,error:t}=await m.from("members").select(`
        id, memberstack_id, name, email, first_name, last_name, slug,
        subscription_status, profile_complete, webflow_id,
        profile_image_url, header_image_url, bio, suburb_id,
        membership_type_id, membership_types(id, name),
        created_at, updated_at
      `).neq("is_deleted",!0).order("created_at",{ascending:!1}).limit(20);return t?(console.error("Error loading recent members:",t),[]):e||[]}async function H(){const{data:e}=await m.from("members").select("id, subscription_status, profile_complete, webflow_id").neq("is_deleted",!0),t=(e==null?void 0:e.length)||0,i=(e==null?void 0:e.filter(s=>s.subscription_status==="active").length)||0,o=(e==null?void 0:e.filter(s=>s.subscription_status==="lapsed").length)||0,n=(e==null?void 0:e.filter(s=>s.profile_complete).length)||0,r=(e==null?void 0:e.filter(s=>s.webflow_id).length)||0,a=(e==null?void 0:e.filter(s=>s.profile_complete&&!s.webflow_id&&s.subscription_status==="active").length)||0;return{total:t,active:i,lapsed:o,complete:n,synced:r,pendingSync:a}}async function B(){const{data:e,error:t}=await m.from("membership_types").select("id, name").order("name");return t?(console.error("Error loading membership types:",t),[]):e||[]}async function W(){try{const e=new Date,t=new Date(e.getFullYear(),e.getMonth(),1).toISOString(),{data:i}=await m.from("messages").select("id, is_read, created_at"),{data:o}=await m.from("messages").select("id").gte("created_at",t),n=(i==null?void 0:i.length)||0,r=(i==null?void 0:i.filter(s=>!s.is_read).length)||0,a=(o==null?void 0:o.length)||0;return{total:n,unread:r,thisMonth:a}}catch(e){return console.error("Error loading message stats:",e),{total:0,unread:0,thisMonth:0}}}async function V(){const{data:e,error:t}=await m.from("members").select(`
        id, memberstack_id, name, email, first_name, slug, subscription_status,
        profile_complete, profile_reminder_sent_at, created_at,
        profile_image_url, header_image_url, bio, suburb_id
      `).eq("profile_complete",!1).eq("subscription_status","active").neq("is_deleted",!0).order("created_at",{ascending:!0});return t?(console.error("Error loading incomplete profiles:",t),[]):e||[]}async function J(){const{data:e,error:t}=await m.from("members").select(`
        id, memberstack_id, name, email, first_name, slug,
        subscription_status, profile_complete, profile_reminder_sent_at, created_at
      `).not("subscription_status","in",'("active","lapsed","deleted")').neq("is_deleted",!0).order("created_at",{ascending:!1}).limit(30);return t?(console.error("Error loading failed signups:",t),[]):e||[]}async function Y(){const e="id, name, slug, memberstack_id, member_contact_email, is_draft, is_archived, webflow_id, created_at",[{data:t,error:i},{data:o,error:n}]=await Promise.all([m.from("events").select(e).eq("is_draft",!0).order("created_at",{ascending:!1}).limit(50),m.from("events").select(e).eq("is_draft",!1).order("created_at",{ascending:!1}).limit(50)]);return i||n?(console.error("Error loading recent events:",i||n),[]):[...t||[],...o||[]]}async function G(){const{data:e}=await m.from("events").select("id, is_draft, is_archived, webflow_id"),t=(e==null?void 0:e.length)||0,i=(e==null?void 0:e.filter(n=>n.is_draft&&!n.is_archived).length)||0,o=(e==null?void 0:e.filter(n=>!n.is_draft&&!n.is_archived).length)||0;return{total:t,pending:i,published:o}}async function K(){const e="id, name, slug, memberstack_id, member_contact_email, opportunity_type, is_draft, is_archived, webflow_id, created_at",[{data:t,error:i},{data:o,error:n}]=await Promise.all([m.from("opportunities").select(e).eq("is_draft",!0).order("created_at",{ascending:!1}).limit(50),m.from("opportunities").select(e).eq("is_draft",!1).order("created_at",{ascending:!1}).limit(50)]);if(i||n)return console.error("Error loading recent opportunities:",i||n),[];const r=[...t||[],...o||[]],a=[...new Set(r.map(s=>s.memberstack_id).filter(Boolean))];if(a.length>0){const{data:s}=await m.from("members").select("memberstack_id, first_name, last_name, name").in("memberstack_id",a);if(s){const l=Object.fromEntries(s.map(d=>[d.memberstack_id,d]));r.forEach(d=>{const c=l[d.memberstack_id];c&&(d.member_name=[c.first_name,c.last_name].filter(Boolean).join(" ")||c.name||null)})}}return r}async function Q(){const{data:e}=await m.from("opportunities").select("id, is_draft, is_archived"),t=(e==null?void 0:e.length)||0,i=(e==null?void 0:e.filter(n=>n.is_draft&&!n.is_archived).length)||0,o=(e==null?void 0:e.filter(n=>!n.is_draft&&!n.is_archived).length)||0;return{total:t,pending:i,published:o}}async function X(){const{data:e,error:t}=await m.from("projects").select(`
        id, name, slug, member_id, webflow_id, is_draft, is_deleted,
        created_at, updated_at
      `).eq("is_deleted",!1).order("updated_at",{ascending:!1}).limit(15);return t?(console.error("Error loading recent projects:",t),[]):e||[]}async function Z(){const{data:e,error:t}=await m.from("activity_log").select(`
        id, member_id, memberstack_id, activity_type, description,
        entity_type, entity_id, entity_name,
        member_webflow_url, entity_webflow_url, created_at
      `).order("created_at",{ascending:!1}).limit(50);if(t)return console.error("Error loading recent activity:",t),[];const i=[...new Set(e.filter(n=>n.member_id).map(n=>n.member_id))];let o={};if(i.length>0){const{data:n}=await m.from("members").select("id, name, first_name, last_name, profile_image_url").in("id",i);n&&n.forEach(r=>{o[r.id]={name:r.name||`${r.first_name||""} ${r.last_name||""}`.trim()||"Unknown Member",profile_image_url:r.profile_image_url||null}})}return e.map(n=>{var r,a;return{...n,member_name:n.member_id&&((r=o[n.member_id])==null?void 0:r.name)||"Unknown Member",member_profile_image:n.member_id&&((a=o[n.member_id])==null?void 0:a.profile_image_url)||null}})}function ee(e){const t=j(e),i=U(e,t),o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Contact Member</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label class="form-label">To</label>
            <input type="text" class="form-input" id="modal-to" value="${e.email||""}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">Subject</label>
            <input type="text" class="form-input" id="modal-subject" value="Complete your MTNS MADE profile">
          </div>
          <div class="form-field">
            <label class="form-label">Message</label>
            <textarea class="form-input" id="modal-body">${i}</textarea>
            <div class="form-hint">Edit the message above as needed</div>
          </div>
          ${t.length>0?`
            <div class="form-field">
              <label class="form-label">Missing Fields Detected</label>
              <div class="missing-fields">
                ${t.map(r=>`<span class="missing-field">${r}</span>`).join("")}
              </div>
            </div>
          `:""}
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="modal-cancel">Cancel</button>
          ${e.memberstack_id?'<button class="admin-btn" id="modal-password-reset">Send Password Reset</button>':""}
          <button class="admin-btn primary" id="modal-send">Send Email</button>
        </div>
      </div>
    `,document.body.appendChild(o),o.querySelector(".modal-close").addEventListener("click",()=>o.remove()),o.querySelector("#modal-cancel").addEventListener("click",()=>o.remove()),o.addEventListener("click",r=>{r.target===o&&o.remove()});const n=o.querySelector("#modal-password-reset");n&&n.addEventListener("click",async()=>{if(confirm(`Send a password reset email to ${e.email||e.first_name||"this member"}?`)){n.disabled=!0,n.textContent="Sending...";try{const a=await(await fetch(`${v}/functions/v1/admin-tools`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"send-password-reset",memberstackId:e.memberstack_id})})).json();a.success?(alert("Password reset email sent successfully."),n.textContent="Sent"):(alert(`Failed to send password reset: ${a.error}`),n.disabled=!1,n.textContent="Send Password Reset")}catch(r){console.error("Password reset error:",r),alert("Error sending password reset. Check console for details."),n.disabled=!1,n.textContent="Send Password Reset"}}}),o.querySelector("#modal-send").addEventListener("click",async()=>{const r=o.querySelector("#modal-to").value,a=o.querySelector("#modal-subject").value,s=o.querySelector("#modal-body").value;if(!r){alert("No email address available for this member");return}const l=o.querySelector("#modal-send");l.disabled=!0,l.textContent="Sending...";try{const c=await(await fetch(`${v}/functions/v1/send-email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:r,subject:a,text:s,html:s.replace(/\n/g,"<br>")})})).json();if(c.success){await m.from("members").update({profile_reminder_sent_at:new Date().toISOString()}).eq("id",e.id),alert("Email sent successfully!"),o.remove();const p=document.querySelector(".dashboard-feed");p&&h(p)}else alert("Failed to send email: "+(c.error||"Unknown error")),l.disabled=!1,l.textContent="Send Email"}catch(d){console.error("Error sending email:",d),alert("Error sending email. Check console for details."),l.disabled=!1,l.textContent="Send Email"}})}function te(e,t,i){var r;const o=((r=T.find(a=>a.id===i))==null?void 0:r.name)||"Not set",n=document.createElement("div");n.className="modal-overlay",n.innerHTML=`
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Edit Member</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label class="form-label">Member</label>
            <input type="text" class="form-input" value="${t}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">Current Type</label>
            <input type="text" class="form-input" value="${o}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">New Membership Type</label>
            <select class="form-input" id="modal-membership-type">
              <option value="">-- Select New Type --</option>
              ${T.map(a=>`
                <option value="${a.id}" ${a.id===i?"disabled":""}>
                  ${a.name}${a.id===i?" (current)":""}
                </option>
              `).join("")}
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
    `,document.body.appendChild(n),n.querySelector(".modal-close").addEventListener("click",()=>n.remove()),n.querySelector("#modal-cancel").addEventListener("click",()=>n.remove()),n.addEventListener("click",a=>{a.target===n&&n.remove()}),n.querySelector("#modal-save").addEventListener("click",async()=>{var p;const a=n.querySelector("#modal-membership-type").value,s=n.querySelector("#modal-skip-billing").checked;if(!a){alert("Please select a new membership type");return}const l=((p=T.find(b=>b.id===a))==null?void 0:p.name)||"Unknown",d=s?`Change ${t}'s type from "${o}" to "${l}"?

This will update the label only (no billing change).`:`Change ${t}'s type from "${o}" to "${l}"?

This WILL change their Stripe subscription and billing.`;if(!confirm(d))return;const c=n.querySelector("#modal-save");c.disabled=!0,c.textContent="Updating Memberstack...";try{const b=await fetch(`${v}/functions/v1/admin-update-member`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({memberId:e,newMembershipTypeId:a,skipPlanChange:s})}),f=await b.json();if(!b.ok)throw new Error(f.error||"Update failed");let _=`Membership type updated!

${f.change.from} → ${f.change.to}`;f.results.warnings&&f.results.warnings.length>0&&(_+=`

Warnings:
- ${f.results.warnings.join(`
- `)}`),alert(_),n.remove();const k=document.querySelector(".dashboard-feed");k&&h(k)}catch(b){console.error("Error updating membership type:",b),alert("Error updating membership type: "+b.message),c.disabled=!1,c.textContent="Update Membership"}})}function ae(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,100)}async function ie(e){const t=ae(e),{data:i}=await m.from("opportunities").select("slug").eq("slug",t).maybeSingle();if(!i)return t;const{data:o}=await m.from("opportunities").select("slug").like("slug",`${t}-%`),n=new Set((o||[]).map(a=>a.slug));n.add(t);let r=2;for(;n.has(`${t}-${r}`);)r++;return`${t}-${r}`}const oe={job:"Job / Employment",commission:"Commission",collaboration:"Collaboration","call-for-entries":"Call for Entries",residency:"Residency / Fellowship",volunteer:"Volunteer"};function ne(){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">New Opportunity</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label class="form-label">Title *</label>
            <input type="text" class="form-input" id="modal-opp-name">
          </div>
          <div class="form-field">
            <label class="form-label">Type *</label>
            <select class="form-input" id="modal-opp-type">
              <option value="">-- Select Type --</option>
              ${Object.entries(oe).map(([t,i])=>`
                <option value="${t}">${i}</option>
              `).join("")}
            </select>
          </div>
          <div class="form-field">
            <label class="form-label">Organization</label>
            <input type="text" class="form-input" id="modal-opp-org">
          </div>
          <div class="form-field">
            <label class="form-label">Contact Name</label>
            <input type="text" class="form-input" id="modal-opp-contact-name">
          </div>
          <div class="form-field">
            <label class="form-label">Contact Email</label>
            <input type="email" class="form-input" id="modal-opp-contact-email">
          </div>
          <div class="form-field">
            <label class="form-label">Description</label>
            <textarea class="form-input" id="modal-opp-description" rows="4"></textarea>
          </div>
          <div class="form-field">
            <label class="form-label">Criteria / How to Apply</label>
            <textarea class="form-input" id="modal-opp-criteria" rows="4"></textarea>
          </div>
          <div class="form-field">
            <label class="form-label">More Info URL</label>
            <input type="url" class="form-input" id="modal-opp-url">
          </div>
          <div class="form-field">
            <label class="form-label">Closing Date</label>
            <input type="date" class="form-input" id="modal-opp-closing-date">
          </div>
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="modal-cancel">Cancel</button>
          <button class="admin-btn primary" id="modal-save">Create & Publish</button>
        </div>
      </div>
    `,document.body.appendChild(e),e.querySelector(".modal-close").addEventListener("click",()=>e.remove()),e.querySelector("#modal-cancel").addEventListener("click",()=>e.remove()),e.addEventListener("click",t=>{t.target===e&&e.remove()}),e.querySelector("#modal-save").addEventListener("click",async()=>{const t=e.querySelector("#modal-opp-name").value.trim(),i=e.querySelector("#modal-opp-type").value;if(!t||!i){alert("Title and Type are required.");return}const o=e.querySelector("#modal-save");o.disabled=!0,o.textContent="Creating...";try{const n=await ie(t),r={name:t,slug:n,opportunity_type:i,organization:e.querySelector("#modal-opp-org").value.trim()||null,contact_name:e.querySelector("#modal-opp-contact-name").value.trim()||null,member_contact_email:e.querySelector("#modal-opp-contact-email").value.trim()||null,description:e.querySelector("#modal-opp-description").value.trim()||null,criteria:e.querySelector("#modal-opp-criteria").value.trim()||null,opportunity_url:e.querySelector("#modal-opp-url").value.trim()||null,closing_date:e.querySelector("#modal-opp-closing-date").value||null,is_draft:!0,is_archived:!1},{data:a,error:s}=await m.from("opportunities").insert(r).select("id").single();if(s)throw s;o.textContent="Publishing...";const d=await(await fetch(`${v}/functions/v1/manage-opportunity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`,apikey:g},body:JSON.stringify({opportunityId:a.id,action:"approve"})})).json();if(!d.success)throw new Error(d.error||"Failed to publish");alert(`"${t}" has been created and published.`),e.remove(),h(document.querySelector(".dashboard-feed"))}catch(n){console.error("Error creating opportunity:",n),alert("Error creating opportunity: "+n.message),o.disabled=!1,o.textContent="Create & Publish"}})}async function re(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
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
    `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",()=>t.remove()),t.addEventListener("click",a=>{a.target===t&&t.remove()});const{data:i,error:o}=await m.from("events").select("*").eq("id",e).single();if(o||!i){t.querySelector(".modal-body").innerHTML='<div style="padding: 24px; color: #dc3545;">Failed to load event details.</div>';return}const n=a=>a?new Date(a).toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):"--",r=[i.location_name,i.location_address].filter(Boolean).join(", ")||"--";t.querySelector(".modal-title").textContent=i.name||"Event Preview",t.querySelector(".modal-body").innerHTML=`
      ${i.feature_image_url?`<img src="${i.feature_image_url}" class="event-preview-image" alt="${i.name}">`:""}
      <div class="preview-grid">
        <div class="preview-field">
          <div class="preview-label">Start</div>
          <div class="preview-value">${n(i.date_start)}</div>
        </div>
        <div class="preview-field">
          <div class="preview-label">End</div>
          <div class="preview-value">${n(i.date_end)}</div>
        </div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Location</div>
        <div class="preview-value">${r}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Description</div>
        <div class="preview-value">${i.description||"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">RSVP / Tickets</div>
        <div class="preview-value">${i.rsvp_link?`<a href="${i.rsvp_link}" target="_blank">${i.rsvp_link}</a>`:"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Submitted by</div>
        <div class="preview-value">${i.member_contact_email||"--"}</div>
      </div>
    `}async function se(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
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
    `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",()=>t.remove()),t.addEventListener("click",r=>{r.target===t&&t.remove()});const{data:i,error:o}=await m.from("opportunities").select("*").eq("id",e).single();if(o||!i){t.querySelector(".modal-body").innerHTML='<div style="padding: 24px; color: #dc3545;">Failed to load opportunity details.</div>';return}const n=r=>r?new Date(r).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"}):"--";t.querySelector(".modal-title").textContent=i.name||"Opportunity Preview",t.querySelector(".modal-body").innerHTML=`
      <div class="preview-grid">
        <div class="preview-field">
          <div class="preview-label">Type</div>
          <div class="preview-value">${i.opportunity_type||"--"}</div>
        </div>
        <div class="preview-field">
          <div class="preview-label">Closes</div>
          <div class="preview-value">${n(i.closing_date)}</div>
        </div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Organisation</div>
        <div class="preview-value">${i.organization||"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Description</div>
        <div class="preview-value">${i.description||"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">How to Apply</div>
        <div class="preview-value">${i.how_to_apply||"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">URL</div>
        <div class="preview-value">${i.opportunity_url?`<a href="${i.opportunity_url}" target="_blank">${i.opportunity_url}</a>`:"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Remote</div>
        <div class="preview-value">${i.is_remote?"Yes":"No"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Submitted by</div>
        <div class="preview-value">${i.member_name||i.member_contact_email||"--"}</div>
      </div>
    `}function A(e,t){var r;const i=t.incompleteProfiles.length,o=t.eventStats.pending,n=t.opportunityStats.pending;e.innerHTML=`
      <div class="admin-dashboard">
        <div class="admin-header">
          <h1>MTNS MADE // System Dashboard</h1>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span class="admin-timestamp">Updated: ${R()}</span>
            <button class="admin-btn" id="refresh-btn">Refresh</button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-cell">
            <div class="stat-value">${t.memberStats.total}</div>
            <div class="stat-label">Total Members</div>
          </div>
          <div class="stat-cell success">
            <div class="stat-value">${t.memberStats.active}</div>
            <div class="stat-label">Active</div>
          </div>
          <div class="stat-cell ${i>5?"alert":""}">
            <div class="stat-value">${t.memberStats.complete}/${t.memberStats.total}</div>
            <div class="stat-label">Profiles Complete</div>
          </div>
          <div class="stat-cell">
            <div class="stat-value">${t.messageStats.thisMonth}</div>
            <div class="stat-label">Messages This Month</div>
          </div>
        </div>

        <!-- Issues Section -->
        ${le(t)}

        <!-- Activity Tabs -->
        <div class="admin-section">
          <div class="tabs-container">
            <button class="tab-btn active" data-tab="activity">Activity</button>
            <button class="tab-btn" data-tab="members">Recent Members</button>
            <button class="tab-btn" data-tab="incomplete">Incomplete (${i})</button>
            <button class="tab-btn" data-tab="failed">Failed Signups (${t.failedSignups.length})</button>
            <button class="tab-btn" data-tab="events">Events ${o>0?`(${o})`:""}</button>
            <button class="tab-btn" data-tab="opportunities">Opportunities ${n>0?`(${n})`:""}</button>
            <button class="tab-btn" data-tab="projects">Projects</button>
            <button class="tab-btn" data-tab="support">Support</button>
            <button class="tab-btn" data-tab="sop">SOPs</button>
          </div>

          <div class="tab-content active" id="tab-activity">
            ${fe(t.recentActivity)}
          </div>

          <div class="tab-content" id="tab-members">
            ${de(t.recentMembers)}
          </div>

          <div class="tab-content" id="tab-incomplete">
            ${ce(t.incompleteProfiles)}
          </div>

          <div class="tab-content" id="tab-failed">
            ${pe(t.failedSignups)}
          </div>

          <div class="tab-content" id="tab-events">
            ${me(t.recentEvents,t.eventStats)}
          </div>

          <div class="tab-content" id="tab-opportunities">
            ${ue(t.recentOpportunities,t.opportunityStats)}
          </div>

          <div class="tab-content" id="tab-projects">
            ${be(t.recentProjects)}
          </div>

          <div class="tab-content" id="tab-support">
            <div id="support-tracker-root">Loading...</div>
          </div>

          <div class="tab-content" id="tab-sop">
            <div id="sop-root">Loading...</div>
          </div>
        </div>
      </div>
    `,e.querySelectorAll(".tab-btn").forEach(a=>{a.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(s=>s.classList.remove("active")),e.querySelectorAll(".tab-content").forEach(s=>s.classList.remove("active")),a.classList.add("active"),e.querySelector(`#tab-${a.dataset.tab}`).classList.add("active"),a.dataset.tab==="support"&&w(),a.dataset.tab==="sop"&&xe()})}),e.querySelector("#refresh-btn").addEventListener("click",()=>h(e)),e.querySelectorAll(".contact-btn").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.memberId,l=t.incompleteProfiles.find(d=>d.id===s)||t.recentMembers.find(d=>d.id===s)||t.failedSignups.find(d=>d.id===s);l&&ee(l)})}),e.querySelectorAll(".approve-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.eventId,l=a.dataset.eventName;if(confirm(`Approve event "${l}"?

This will publish the event and notify the member.`)){a.disabled=!0,a.textContent="Approving...";try{const c=await(await fetch(`${v}/functions/v1/manage-event`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`,apikey:g},body:JSON.stringify({eventId:s,action:"approve"})})).json();c.success?(alert(`Event "${l}" has been approved!

The member will be notified and the event will sync to Webflow.`),h(e)):(alert(`Failed to approve event: ${c.error}`),a.disabled=!1,a.textContent="Approve")}catch(d){console.error("Approve error:",d),alert("Error approving event. Please try again."),a.disabled=!1,a.textContent="Approve"}}})}),e.querySelectorAll(".reject-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.eventId,l=a.dataset.eventName,d=prompt(`Reject event "${l}"?

Optionally enter a reason (or leave blank):`);if(d!==null){a.disabled=!0,a.textContent="Rejecting...";try{const p=await(await fetch(`${v}/functions/v1/manage-event`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`,apikey:g},body:JSON.stringify({eventId:s,action:"reject",rejectionReason:d||void 0})})).json();p.success?(alert(`Event "${l}" has been rejected.

The member will be notified.`),h(e)):(alert(`Failed to reject event: ${p.error}`),a.disabled=!1,a.textContent="Reject")}catch(c){console.error("Reject error:",c),alert("Error rejecting event. Please try again."),a.disabled=!1,a.textContent="Reject"}}})}),e.querySelectorAll(".preview-btn").forEach(a=>{a.addEventListener("click",()=>{re(a.dataset.eventId)})}),(r=e.querySelector("#new-opportunity-btn"))==null||r.addEventListener("click",()=>{ne()}),e.querySelectorAll(".preview-opp-btn").forEach(a=>{a.addEventListener("click",()=>{se(a.dataset.oppId)})}),e.querySelectorAll(".approve-opp-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.oppId,l=a.dataset.oppName;if(confirm(`Approve opportunity "${l}"?

This will publish it and notify the member.`)){a.disabled=!0,a.textContent="Approving...";try{const c=await(await fetch(`${v}/functions/v1/manage-opportunity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`,apikey:g},body:JSON.stringify({opportunityId:s,action:"approve"})})).json();c.success?(alert(`Opportunity "${l}" has been approved!

The member will be notified.`),h(e)):(alert(`Failed to approve opportunity: ${c.error}`),a.disabled=!1,a.textContent="Approve")}catch(d){console.error("Opportunity approve error:",d),alert("Error approving opportunity. Please try again."),a.disabled=!1,a.textContent="Approve"}}})}),e.querySelectorAll(".reject-opp-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.oppId,l=a.dataset.oppName,d=prompt(`Reject opportunity "${l}"?

Optionally enter a reason (or leave blank):`);if(d!==null){a.disabled=!0,a.textContent="Rejecting...";try{const p=await(await fetch(`${v}/functions/v1/manage-opportunity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`,apikey:g},body:JSON.stringify({opportunityId:s,action:"reject",rejectionReason:d||void 0})})).json();p.success?(alert(`Opportunity "${l}" has been rejected.

The member will be notified.`),h(e)):(alert(`Failed to reject opportunity: ${p.error}`),a.disabled=!1,a.textContent="Reject")}catch(c){console.error("Opportunity reject error:",c),alert("Error rejecting opportunity. Please try again."),a.disabled=!1,a.textContent="Reject"}}})}),e.querySelectorAll(".edit-btn").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.memberId,l=a.dataset.memberName,d=a.dataset.currentType;te(s,l,d)})}),e.querySelectorAll(".delete-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.memberId,l=a.dataset.memberName;if(confirm(`Delete "${l}"?

This will remove them from the dashboard and Webflow directory. This action cannot be undone.`)){a.disabled=!0,a.textContent="Deleting...";try{const{error:d}=await m.from("members").update({is_deleted:!0,subscription_status:"deleted",updated_at:new Date().toISOString()}).eq("id",s);if(d)throw d;alert(`"${l}" has been deleted.`),h(e)}catch(d){console.error("Delete error:",d),alert("Error deleting member. Please try again."),a.disabled=!1,a.textContent="Delete"}}})}),e.querySelectorAll(".delete-project-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.projectId,l=a.dataset.projectName;if(confirm(`Delete project "${l}"?

This will remove it from Webflow and the directory. This cannot be undone.`)){a.disabled=!0,a.textContent="Deleting...";try{const c=await(await fetch(`${v}/functions/v1/admin-tools`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"delete-project",projectId:s})})).json();c.success?(alert(`Project "${l}" has been deleted.`),h(e)):(alert(`Failed to delete project: ${c.error}`),a.disabled=!1,a.textContent="Delete")}catch(d){console.error("Delete project error:",d),alert("Error deleting project. Please try again."),a.disabled=!1,a.textContent="Delete"}}})}),e.querySelectorAll(".delete-opp-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.oppId,l=a.dataset.oppName;if(confirm(`Delete "${l}"?

This will remove it from the site. This cannot be undone.`)){a.disabled=!0,a.textContent="Deleting...";try{const c=await(await fetch(`${v}/functions/v1/admin-tools`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"delete-opportunity",opportunityId:s})})).json();c.success?(alert(`"${l}" has been deleted.`),h(e)):(alert(`Failed to delete: ${c.error}`),a.disabled=!1,a.textContent="Delete")}catch(d){console.error("Delete opportunity error:",d),alert("Error deleting opportunity. Please try again."),a.disabled=!1,a.textContent="Delete"}}})})}function le(e){const t=[];e.memberStats.pendingSync>0&&t.push({type:"warning",text:"Members pending Webflow sync",count:e.memberStats.pendingSync});const i=e.incompleteProfiles.filter(o=>(Date.now()-new Date(o.created_at))/864e5>7&&!o.profile_reminder_sent_at);return i.length>0&&t.push({type:"info",text:"Incomplete profiles (7+ days, no reminder sent)",count:i.length}),e.eventStats.pending>0&&t.push({type:"info",text:"Events pending review",count:e.eventStats.pending}),e.opportunityStats.pending>0&&t.push({type:"info",text:"Opportunities pending review",count:e.opportunityStats.pending}),e.memberStats.lapsed>0&&t.push({type:"error",text:"Lapsed subscriptions",count:e.memberStats.lapsed}),t.length===0?`
        <div class="admin-section">
          <div class="section-header">
            <h2 class="section-title">System Status</h2>
            <span class="section-badge success">All Systems Nominal</span>
          </div>
          <div class="empty-state">No issues detected</div>
        </div>
      `:`
      <div class="admin-section">
        <div class="section-header">
          <h2 class="section-title">Attention Required</h2>
          <span class="section-badge alert">${t.length} Issue${t.length>1?"s":""}</span>
        </div>
        <div class="issues-list">
          ${t.map(o=>`
            <div class="issue-item">
              <div class="issue-icon ${o.type}"></div>
              <div class="issue-text">${o.text}</div>
              <div class="issue-count">${o.count}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `}function de(e){return e.length===0?'<div class="empty-state">No members found</div>':`
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
          ${e.map(t=>{var i;return`
            <tr>
              <td>
                <div class="name-cell">${t.name||t.first_name||"No name"}</div>
                <div class="email-cell">${t.email||"--"}</div>
              </td>
              <td>
                <span class="type-cell">${((i=t.membership_types)==null?void 0:i.name)||"Not set"}</span>
              </td>
              <td>
                <span class="status ${t.subscription_status||"active"}">
                  ${t.subscription_status||"active"}
                </span>
              </td>
              <td>
                <span class="status ${t.profile_complete?"complete":"incomplete"}">
                  ${t.profile_complete?"Complete":"Incomplete"}
                </span>
              </td>
              <td class="time-cell">${x(t.created_at)}</td>
              <td>
                <div class="action-btns">
                  <button class="action-btn edit-btn" data-member-id="${t.id}" data-member-name="${t.name||t.first_name||"this member"}" data-current-type="${t.membership_type_id||""}">Edit</button>
                  ${t.webflow_id&&t.slug?`
                    <a href="${y}/members/${t.slug}" target="_blank" class="action-btn view-btn">View</a>
                  `:""}
                  <button class="action-btn delete-btn" data-member-id="${t.id}" data-member-name="${t.name||t.first_name||"this member"}">Delete</button>
                </div>
              </td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    `}function ce(e){return e.length===0?'<div class="empty-state">All active members have complete profiles</div>':`
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
          ${e.map(t=>{const i=j(t);return`
              <tr>
                <td>
                  <div class="name-cell">${t.name||t.first_name||"No name"}</div>
                  <div class="email-cell">${t.email||"--"}</div>
                </td>
                <td>
                  <div class="missing-fields">
                    ${i.slice(0,3).map(o=>`<span class="missing-field">${o}</span>`).join("")}
                    ${i.length>3?`<span class="missing-field">+${i.length-3}</span>`:""}
                  </div>
                </td>
                <td class="time-cell">
                  ${t.profile_reminder_sent_at?x(t.profile_reminder_sent_at):"--"}
                </td>
                <td class="time-cell">${x(t.created_at)}</td>
                <td>
                  <div class="action-btns">
                    ${t.profile_reminder_sent_at?`
                      <button class="action-btn contacted" disabled>Contacted</button>
                    `:`
                      <button class="action-btn contact-btn" data-member-id="${t.id}">Contact</button>
                    `}
                    ${t.webflow_id&&t.slug?`
                      <a href="${y}/members/${t.slug}" target="_blank" class="action-btn">View</a>
                    `:""}
                  </div>
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    `}function pe(e){return e.length===0?'<div class="empty-state">No failed signups found</div>':`
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
          ${e.map(t=>`
            <tr>
              <td>
                <div class="name-cell">${t.name||t.first_name||"No name"}</div>
                <div class="email-cell">${t.email||"--"}</div>
              </td>
              <td>
                <span class="status pending">
                  ${t.subscription_status||"no status"}
                </span>
              </td>
              <td class="time-cell">${x(t.created_at)}</td>
              <td>
                <div class="action-btns">
                  ${t.profile_reminder_sent_at?`
                    <button class="action-btn contacted" disabled>Contacted</button>
                  `:`
                    <button class="action-btn contact-btn" data-member-id="${t.id}">Contact</button>
                  `}
                  <button class="action-btn delete-btn" data-member-id="${t.id}" data-member-name="${t.name||t.first_name||"this member"}">Delete</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}function me(e,t){return`
      <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; font-size: 11px; color: #666;">
        <span style="margin-right: 24px;"><strong style="color: #f59f00;">${t.pending}</strong> Pending</span>
        <span><strong style="color: #1a1a1a;">${t.published}</strong> Published</span>
      </div>
      ${e.length===0?'<div class="empty-state">No events found</div>':`
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
            ${e.map(i=>{let o="draft";return i.is_archived?o="archived":i.is_draft?o="pending":o="published",`
                <tr>
                  <td>
                    <div class="name-cell">${i.name||"Untitled"}</div>
                    <div class="email-cell">${i.member_contact_email||"--"}</div>
                  </td>
                  <td>
                    <span class="status ${o==="published"?"complete":o==="pending"?"pending":"draft"}">
                      ${o}
                    </span>
                  </td>
                  <td>
                    <span class="status ${i.webflow_id?"synced":"pending"}">
                      ${i.webflow_id?"Synced":"--"}
                    </span>
                  </td>
                  <td class="time-cell">${x(i.created_at)}</td>
                  <td>
                    <div class="action-btns">
                      ${o==="pending"?`
                        <button class="action-btn preview-btn" data-event-id="${i.id}">Preview</button>
                        <button class="action-btn approve-btn" data-event-id="${i.id}" data-event-name="${i.name}">Approve</button>
                        <button class="action-btn reject-btn" data-event-id="${i.id}" data-event-name="${i.name}">Reject</button>
                      `:""}
                      ${i.webflow_id&&i.slug?`
                        <a href="${y}/event/${i.slug}" target="_blank" class="action-btn view-btn">View</a>
                      `:""}
                    </div>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      `}
    `}function ue(e,t){return`
      <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; font-size: 11px; color: #666; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="margin-right: 24px;"><strong style="color: #f59f00;">${t.pending}</strong> Pending</span>
          <span><strong style="color: #1a1a1a;">${t.published}</strong> Published</span>
        </div>
        <button class="admin-btn primary" id="new-opportunity-btn">+ New Opportunity</button>
      </div>
      ${e.length===0?'<div class="empty-state">No opportunities found</div>':`
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
            ${e.map(i=>{let o="draft";return i.is_archived?o="archived":i.is_draft?o="pending":o="published",`
                <tr>
                  <td>
                    <div class="name-cell">${i.name||"Untitled"}</div>
                    <div class="email-cell">${i.member_contact_email||"--"}</div>
                  </td>
                  <td>
                    <span class="type-cell">${i.opportunity_type||"--"}</span>
                  </td>
                  <td>
                    <span class="status ${o==="published"?"complete":o==="pending"?"pending":"draft"}">
                      ${o}
                    </span>
                  </td>
                  <td class="time-cell">${x(i.created_at)}</td>
                  <td>
                    <div class="action-btns">
                      ${o==="pending"?`
                        <button class="action-btn preview-opp-btn" data-opp-id="${i.id}">Preview</button>
                        <button class="action-btn approve-opp-btn" data-opp-id="${i.id}" data-opp-name="${i.name}">Approve</button>
                        <button class="action-btn reject-opp-btn" data-opp-id="${i.id}" data-opp-name="${i.name}">Reject</button>
                      `:""}
                      ${i.webflow_id&&i.slug?`
                        <a href="${y}/opportunities/${i.slug}" target="_blank" class="action-btn view-btn">View</a>
                      `:""}
                      <button class="action-btn delete-opp-btn" data-opp-id="${i.id}" data-opp-name="${u(i.name||"this opportunity")}" style="color:#dc3545;border-color:#dc3545;">Delete</button>
                    </div>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      `}
    `}function be(e){return e.length===0?'<div class="empty-state">No projects found</div>':`
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
          ${e.map(t=>`
            <tr>
              <td>
                <div class="name-cell">${t.name||"Untitled"}</div>
              </td>
              <td>
                <span class="status ${t.webflow_id?"synced":"pending"}">
                  ${t.webflow_id?"Synced":"Pending"}
                </span>
              </td>
              <td class="time-cell">${x(t.updated_at)}</td>
              <td>
                <div class="action-btns">
                  ${t.webflow_id&&t.slug?`
                    <a href="${y}/projects/${t.slug}" target="_blank" class="action-btn view-btn">View</a>
                  `:""}
                  <button class="action-btn delete-project-btn" data-project-id="${t.id}" data-project-name="${(t.name||"this project").replace(/"/g,"&quot;")}">Delete</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}function fe(e){if(!e||e.length===0)return'<div class="empty-state">No recent activity</div>';const t=o=>o==="member_signup"?{class:"signup",icon:"🎉"}:o==="profile_update"?{class:"profile",icon:"👤"}:o.startsWith("project_")?{class:"project",icon:"📁"}:o.startsWith("event_")?{class:"event",icon:"📅"}:o.startsWith("opportunity_")?{class:"event",icon:"💼"}:o==="subscription_canceled"?{class:"canceled",icon:"🚫"}:o==="subscription_reactivated"?{class:"reactivated",icon:"✅"}:{class:"",icon:"📝"},i=o=>o.activity_type==="member_signup"?null:o.entity_webflow_url?o.entity_webflow_url:o.member_webflow_url?o.member_webflow_url:null;return`
      <div class="activity-feed">
        ${e.map(o=>{const n=t(o.activity_type),r=i(o);return`
            <div class="activity-item">
              ${o.member_profile_image?`
                <div class="activity-avatar">
                  <img src="${o.member_profile_image}" alt="${o.member_name}">
                </div>
              `:`
                <div class="activity-icon ${n.class}">${n.icon}</div>
              `}
              <div class="activity-content">
                <div class="activity-text">
                  <strong>${o.member_name}</strong> ${o.description}
                </div>
                <div class="activity-meta">
                  <span class="activity-time">${x(o.created_at)}</span>
                </div>
              </div>
              <div class="activity-action">
                ${r?`
                  <a href="${r}" target="_blank" class="action-btn">View</a>
                `:""}
              </div>
            </div>
          `}).join("")}
      </div>
    `}const q={member_support:"Member Support",website_bug:"Website Bug",feature_request:"Feature Request"},N={not_started:"Not Started",in_progress:"In Progress",feedback_needed:"Feedback Needed",complete:"Complete",stalled:"Stalled"};let L="main";const ve=new Set(["not_started","in_progress","feedback_needed"]),ge=new Set(["complete","stalled"]);async function he(){const{data:e,error:t}=await m.from("support_tasks").select("*, support_task_comments(*)").order("created_at",{ascending:!1});return t?(console.error("loadSupportTasks:",t),[]):((e||[]).forEach(i=>{var o;return(o=i.support_task_comments)==null?void 0:o.sort((n,r)=>new Date(n.created_at)-new Date(r.created_at))}),e||[])}const $=7;function ye(e){const t=new Date,i=t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0"),o=e.filter(p=>{const b=new Date(p.created_at);return b.getFullYear()+"-"+String(b.getMonth()+1).padStart(2,"0")===i}).reduce((p,b)=>p+(parseFloat(b.hours)||0),0),n=Math.min(o/$*100,100),r=$-o,a=t.toLocaleDateString("en-AU",{month:"long"});let s="",l=`${r%1===0?r:r.toFixed(1)}h remaining`;if(o>$){s="over";const p=o-$;l=`${p%1===0?p:p.toFixed(1)}h over this month's limit`}else o>=5&&(s="approaching",l=`${r%1===0?r:r.toFixed(1)}h remaining — approaching limit`);const d=o%1===0?o:o.toFixed(1),c=document.createElement("div");return c.className=`retainer-banner${s?" "+s:""}`,c.innerHTML=`
      <div class="retainer-label">Retainer &mdash; ${a}</div>
      <div class="retainer-bar-wrap">
        <div class="retainer-bar-fill" style="width:${n}%"></div>
      </div>
      <div class="retainer-hours">${d}h / ${$}h</div>
      <div class="retainer-status">${l}</div>
    `,c}async function w(){const e=document.getElementById("support-tracker-root");if(!e)return;e.innerHTML='<div style="padding:20px;color:#888;font-size:13px;">Loading...</div>';const t=await he();we(e,t)}async function xe(){const e=document.getElementById("sop-root");if(!e)return;e.innerHTML='<div style="padding:20px;color:#888;font-size:13px;">Loading...</div>';const{data:t,error:i}=await m.from("sops").select("*").order("category",{ascending:!0}).order("title",{ascending:!0});if(i){e.innerHTML=`<div class="empty-state" style="padding:40px 20px;">Error loading SOPs: ${u(i.message)}</div>`;return}if(!t||t.length===0){e.innerHTML='<div class="empty-state" style="padding:40px 20px;">No SOPs yet.</div>';return}e.innerHTML=t.map(o=>`
      <div class="admin-section" style="margin-bottom:16px;border:1px solid #eee;border-radius:8px;padding:20px;">
        <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:12px;">
          <h3 style="margin:0;font-size:16px;">${u(o.title)}</h3>
          ${o.category?`<span class="status" style="font-size:10px;padding:2px 8px;">${u(o.category)}</span>`:""}
        </div>
        <div style="font-size:13px;line-height:1.6;color:#333;white-space:pre-wrap;">${u(o.content)}</div>
      </div>
    `).join("")}function we(e,t){var o,n;const i=L==="archive";if(e.innerHTML=`
      <div class="support-toolbar">
        <div class="support-toolbar-actions">
          <button class="admin-btn primary" id="new-task-btn">+ New Task</button>
          <button class="admin-btn ${i?"primary":""}" id="archive-view-btn">Archive</button>
        </div>
        ${i?'<span style="font-size:12px;color:#888;">Completed &amp; stalled tasks</span>':'<span style="font-size:12px;color:#888;">Active tasks</span>'}
      </div>
    `,e.appendChild(ye(t)),i)_e(e,t.filter(r=>ge.has(r.status)));else{const r=t.filter(s=>ve.has(s.status)),a=document.createElement("div");a.innerHTML=r.length===0?'<div class="empty-state" style="padding:40px 20px;">No active tasks.</div>':`<table class="admin-table" id="support-table">
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
              ${r.map(s=>$e(s)).join("")}
            </tbody>
          </table>`,e.appendChild(a),e.querySelectorAll(".task-detail-btn").forEach(s=>{s.addEventListener("click",()=>{const l=t.find(d=>d.id===s.dataset.taskId);l&&P(l)})}),e.querySelectorAll(".form-input[data-task-id]").forEach(s=>{s.addEventListener("change",async()=>{const l=t.find(d=>d.id===s.dataset.taskId);await Se(s.dataset.taskId,s.value,l),await w()})}),e.querySelectorAll(".task-edit-btn").forEach(s=>{s.addEventListener("click",()=>{const l=t.find(d=>d.id===s.dataset.taskId);l&&Ee(l)})})}(o=e.querySelector("#new-task-btn"))==null||o.addEventListener("click",()=>ke()),(n=e.querySelector("#archive-view-btn"))==null||n.addEventListener("click",()=>{L=L==="archive"?"main":"archive",w()})}function _e(e,t){const i={};t.forEach(a=>{const s=new Date(a.created_at),l=`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`;i[l]||(i[l]=[]),i[l].push(a)});const o=Object.keys(i).sort((a,s)=>s.localeCompare(a));if(o.length===0){const a=document.createElement("div");a.className="empty-state",a.style.padding="40px 20px",a.textContent="No archived tasks yet.",e.appendChild(a);return}function n(a){const[s,l]=a.split("-");return new Date(parseInt(s),parseInt(l)-1,1).toLocaleDateString("en-AU",{month:"long",year:"numeric"})}const r=document.createElement("div");r.className="archive-month-grid",o.forEach(a=>{const s=i[a].slice().sort((p,b)=>new Date(b.updated_at)-new Date(p.updated_at)),l=s.reduce((p,b)=>p+(parseFloat(b.hours)||0),0),d=l>0?`${l%1===0?l:l.toFixed(2)}h`:"—",c=document.createElement("div");c.className="month-card expanded",c.innerHTML=`
        <div class="month-card-header">
          <div class="month-card-name">${n(a)}</div>
          <div class="month-card-chevron">▼</div>
        </div>
        <div class="month-card-stats">
          <div class="month-card-stat"><strong>${s.length}</strong> task${s.length!==1?"s":""}</div>
          <div class="month-card-stat"><strong>${d}</strong></div>
        </div>
        <div class="month-tasks">
          ${s.map(p=>`
            <div class="month-task-item">
              <div class="month-task-title" data-task-id="${p.id}">
                <span class="status ${p.category}" style="font-size:10px;padding:2px 6px;margin-right:4px;">${q[p.category]||p.category}</span>
                ${u(p.title.length>80?p.title.substring(0,77)+"…":p.title)}
              </div>
              <div class="month-task-meta">${p.hours!=null?p.hours+"h":""}</div>
            </div>
          `).join("")}
        </div>
      `,c.addEventListener("click",()=>{c.classList.toggle("expanded")}),c.querySelectorAll(".month-task-title").forEach(p=>{p.addEventListener("click",b=>{b.stopPropagation();const f=p.dataset.taskId;m.from("support_tasks").select("*, support_task_comments(*)").eq("id",f).single().then(({data:_})=>{var k;_&&((k=_.support_task_comments)==null||k.sort((Te,qe)=>new Date(Te.created_at)-new Date(qe.created_at)),P(_))})})}),r.appendChild(c)}),e.appendChild(r)}function $e(e){const t=e.support_task_comments||[];return`
      <tr>
        <td><span class="status ${e.category}">${q[e.category]||e.category}</span></td>
        <td class="time-cell">${D(e.created_at)}</td>
        <td>
          <div class="name-cell" title="${u(e.title)}" style="cursor:default;">${u(e.title.length>80?e.title.substring(0,77)+"…":e.title)}</div>
        </td>
        <td>
          ${e.member_name?e.member_profile_url?`<a class="email-cell" href="${e.member_profile_url}" target="_blank" style="color:#0066cc;text-decoration:none;">${u(e.member_name)}</a>`:`<span class="email-cell">${u(e.member_name)}</span>`:""}
        </td>
        <td>
          <select class="form-input" data-task-id="${e.id}" style="padding:4px 8px;font-size:12px;width:auto;">
            ${Object.entries(N).map(([i,o])=>`<option value="${i}" ${e.status===i?"selected":""}>${o}</option>`).join("")}
          </select>
        </td>
        <td class="time-cell">${e.hours!=null?e.hours+"h":""}</td>
        <td>
          <div class="action-btns">
            <button class="action-btn task-detail-btn" data-task-id="${e.id}">
              ${t.length>0?`Notes (${t.length})`:"Notes"}
            </button>
            <button class="action-btn edit-btn task-edit-btn" data-task-id="${e.id}">Edit</button>
          </div>
        </td>
      </tr>
    `}function P(e){const t=e.support_task_comments||[],i=document.createElement("div");i.className="modal-overlay",i.innerHTML=`
      <div class="modal" style="max-width:620px;">
        <div class="modal-header">
          <div>
            <span class="status ${e.category}" style="margin-bottom:6px;display:inline-block;">${q[e.category]||e.category}</span>
            <h3 class="modal-title" style="margin-top:6px;">${u(e.title)}</h3>
          </div>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          ${e.description?`
            <div class="form-field">
              <div class="form-label">Description</div>
              <div style="font-size:13px;line-height:1.7;color:#333;white-space:pre-wrap;">${u(e.description)}</div>
            </div>
          `:""}
          ${e.notes?`
            <div class="form-field">
              <div class="form-label">Notes</div>
              <div style="font-size:13px;line-height:1.7;color:#555;white-space:pre-wrap;">${u(e.notes)}</div>
            </div>
          `:""}
          ${e.member_name?`
            <div class="form-field">
              <div class="form-label">Member</div>
              <div style="font-size:13px;">
                ${e.member_profile_url?`<a href="${e.member_profile_url}" target="_blank" style="color:#0066cc;">${u(e.member_name)}</a>`:u(e.member_name)}
              </div>
            </div>
          `:""}

          <div class="comments-section">
            <div class="comments-title">Comments (${t.length}/5)</div>
            <div id="task-comments-list">
              ${t.map(r=>`
                <div class="comment-item">
                  <div class="comment-author-badge ${r.author.toLowerCase()==="hannah"||r.author==="MTNS MADE"?"hannah":""}">${r.author.charAt(0).toUpperCase()}</div>
                  <div class="comment-body">
                    <div class="comment-meta">${u(r.author)} &middot; ${D(r.created_at)}</div>
                    <div class="comment-text">${u(r.body)}</div>
                    ${r.image_url?`<img src="${u(r.image_url)}" style="max-width:100%;border-radius:4px;margin-top:8px;display:block;" loading="lazy">`:""}
                  </div>
                </div>
              `).join("")}
            </div>
            ${t.length<5?`
              <div class="comment-input-row" style="margin-top:16px;">
                <textarea class="form-input" id="task-comment-input" placeholder="Add a comment..." style="min-height:70px;resize:none;flex:1;"></textarea>
                <div style="margin-top:8px;">
                  <label style="font-size:12px;color:#666;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
                    <input type="file" id="task-comment-image" accept="image/*" style="display:none;">
                    <span style="padding:4px 8px;border:1px solid #ddd;border-radius:4px;background:#fafafa;">Attach screenshot</span>
                    <span id="task-comment-image-name" style="color:#888;"></span>
                  </label>
                </div>
              </div>
            `:'<div style="font-size:12px;color:#999;margin-top:8px;">Maximum 5 comments reached.</div>'}
          </div>
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="td-close">Close</button>
          ${t.length<5?'<button class="admin-btn primary" id="td-add-comment">Add Comment</button>':""}
        </div>
      </div>
    `,document.body.appendChild(i),i.querySelector(".modal-close").addEventListener("click",()=>i.remove()),i.querySelector("#td-close").addEventListener("click",()=>i.remove()),i.addEventListener("click",r=>{r.target===i&&i.remove()});const o=i.querySelector("#task-comment-image");o&&o.addEventListener("change",()=>{var a;const r=i.querySelector("#task-comment-image-name");r&&(r.textContent=((a=o.files[0])==null?void 0:a.name)||"")});const n=i.querySelector("#td-add-comment");n&&n.addEventListener("click",async()=>{var l;const r=i.querySelector("#task-comment-input"),a=r==null?void 0:r.value.trim();if(!a)return;n.disabled=!0,n.textContent="Saving...";let s=null;if((l=o==null?void 0:o.files)!=null&&l[0]){const d=o.files[0],c=d.name.split(".").pop()||"png",p=`${e.id}/${Date.now()}.${c}`,{error:b}=await m.storage.from("support-screenshots").upload(p,d,{contentType:d.type});if(!b){const{data:f}=m.storage.from("support-screenshots").getPublicUrl(p);s=(f==null?void 0:f.publicUrl)||null}}await m.from("support_task_comments").insert({task_id:e.id,author:"Racket",body:a,image_url:s}),i.remove(),await S("comment",e,a),await w()})}async function Se(e,t,i){await m.from("support_tasks").update({status:t}).eq("id",e),t==="feedback_needed"?await S("feedback_needed",i||{id:e,title:"(task)",status:t}):t==="complete"&&await S("complete",i||{id:e,title:"(task)",status:t})}async function S(e,t,i){var d;const o=q[t.category]||t.category||"",n=t.member_name?`
Member: ${t.member_name}${t.member_profile_url?" — "+t.member_profile_url:""}`:"";let r,a,s;const l="https://www.mtnsmade.com.au/admin/dashboard";if(e==="created")r="contact@racket.net.au",a=`New MTNS MADE support task: ${t.title}`,s=`A new support task has been logged.

Category: ${o}${n}
Task: ${t.title}
${t.description?`
`+t.description:""}

View on dashboard: ${l}`;else if(e==="comment")r="hello@mtnsmade.com.au",a=`New comment on: ${t.title}`,s=`Racket has added a comment to a support task.

Category: ${o}${n}
Task: ${t.title}

Comment:
${i}

View on dashboard: ${l}`;else if(e==="feedback_needed")r="hello@mtnsmade.com.au",a=`Feedback needed: ${t.title}`,s=`A support task requires your feedback.

Category: ${o}${n}
Task: ${t.title}
${t.description?`
`+t.description:""}

View on dashboard: ${l}`;else if(e==="complete")r="hello@mtnsmade.com.au",a=`Task complete: ${t.title}`,s=`A support task has been marked complete.

Category: ${o}${n}
Task: ${t.title}

View on dashboard: ${l}`;else return;try{if(await fetch(`${v}/functions/v1/send-email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:r,subject:a,text:s,html:s.replace(/\n/g,"<br>")})}),e==="complete"&&t.member_id&&t.category==="member_support"){const{data:c}=await m.from("members").select("email, name").eq("id",t.member_id).single();if(c!=null&&c.email){const p=((d=c.name)==null?void 0:d.split(" ")[0])||"there",b=`Your support request has been resolved: ${t.title}`,f=`Hi ${p},

We wanted to let you know that your support request has been resolved.

Request: ${t.title}

If you have any further questions or need anything else, feel free to reach out at hello@mtnsmade.com.au.

Thanks,
The MTNS MADE Team`;await fetch(`${v}/functions/v1/send-email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:c.email,subject:b,text:f,html:f.replace(/\n/g,"<br>")})})}}}catch(c){console.error("sendTaskNotification error:",c)}}let C=null;async function z(e){if(!e||e.length<2)return[];const{data:t}=await m.from("members").select("id, name, slug, business_name").or(`name.ilike.%${e}%,business_name.ilike.%${e}%`).eq("subscription_status","active").limit(8);return t||[]}function ke(){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`
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
    `,document.body.appendChild(e);const t=e.querySelector("#st-category"),i=e.querySelector("#st-member-field"),o=()=>{i.style.display=t.value==="member_support"?"block":"none"};o(),t.addEventListener("change",o);const n=e.querySelector("#st-member-search"),r=e.querySelector("#st-member-suggestions");n.addEventListener("input",()=>{clearTimeout(C);const a=n.value.trim();if(a.length<2){r.style.display="none";return}C=setTimeout(async()=>{const s=await z(a);if(s.length===0){r.style.display="none";return}r.innerHTML=s.map(l=>`<div class="member-suggestion-item" data-id="${l.id}" data-name="${u(l.name||"")}" data-slug="${l.slug||""}">
            ${u(l.name||l.id)}
            ${l.business_name?`<span style="display:block;font-size:11px;color:#888;margin-top:1px;">${u(l.business_name)}</span>`:""}
          </div>`).join(""),r.style.display="block",r.querySelectorAll(".member-suggestion-item").forEach(l=>{l.addEventListener("click",()=>{e.querySelector("#st-member-id").value=l.dataset.id,e.querySelector("#st-member-name").value=l.dataset.name,e.querySelector("#st-member-url").value=l.dataset.slug?`${y}/members/${l.dataset.slug}`:"",n.value=l.dataset.name,r.style.display="none"})})},250)}),e.querySelector(".modal-close").addEventListener("click",()=>e.remove()),e.querySelector("#st-cancel").addEventListener("click",()=>e.remove()),e.addEventListener("click",a=>{a.target===e&&e.remove()}),e.querySelector("#st-save").addEventListener("click",async()=>{const a=e.querySelector("#st-title").value.trim(),s=e.querySelector("#st-category").value;if(!a){alert("Please enter a task title.");return}const l=e.querySelector("#st-save");l.disabled=!0,l.textContent="Saving...";const d=e.querySelector("#st-member-id").value,c={category:s,title:a,description:e.querySelector("#st-description").value.trim()||null,status:"not_started",hours:null,member_id:d||null,member_name:e.querySelector("#st-member-name").value||null,member_profile_url:e.querySelector("#st-member-url").value||null},{data:p,error:b}=await m.from("support_tasks").insert(c).select().single();if(b){alert("Error creating task: "+b.message),l.disabled=!1,l.textContent="Create Task";return}e.remove(),await S("created",p),await w()})}function Ee(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
      <div class="modal" style="max-width:560px;">
        <div class="modal-header">
          <h3 class="modal-title">Edit Task</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label class="form-label">Category</label>
            <select class="form-input" id="et-category">
              <option value="member_support" ${e.category==="member_support"?"selected":""}>Member Support</option>
              <option value="website_bug" ${e.category==="website_bug"?"selected":""}>Website Bug</option>
              <option value="feature_request" ${e.category==="feature_request"?"selected":""}>Feature Request</option>
            </select>
          </div>
          <div class="form-field">
            <label class="form-label">Title</label>
            <input type="text" class="form-input" id="et-title" value="${u(e.title)}">
          </div>
          <div class="form-field">
            <label class="form-label">Member</label>
            <div class="member-search-wrap">
              <input type="text" class="form-input" id="et-member-search" placeholder="Search by name or trading name..." autocomplete="off" value="${u(e.member_name||"")}">
              <div class="member-suggestions" id="et-member-suggestions" style="display:none;"></div>
            </div>
            <input type="hidden" id="et-member-id" value="${u(e.member_id||"")}">
            <input type="hidden" id="et-member-name" value="${u(e.member_name||"")}">
            <input type="hidden" id="et-member-url" value="${u(e.member_profile_url||"")}">
          </div>
          <div class="form-field">
            <label class="form-label">Description</label>
            <textarea class="form-input" id="et-description" style="min-height:80px;">${u(e.description||"")}</textarea>
          </div>
          <div class="form-field">
            <label class="form-label">Notes</label>
            <textarea class="form-input" id="et-notes" style="min-height:60px;" placeholder="Internal notes, resolution summary...">${u(e.notes||"")}</textarea>
          </div>
          <div class="form-field">
            <label class="form-label">Status</label>
            <select class="form-input" id="et-status">
              ${Object.entries(N).map(([n,r])=>`<option value="${n}" ${e.status===n?"selected":""}>${r}</option>`).join("")}
            </select>
          </div>
          <div class="form-field">
            <label class="form-label">Hours</label>
            <input type="number" class="form-input" id="et-hours" value="${e.hours!=null?e.hours:""}" step="0.25" min="0" style="max-width:120px;">
          </div>
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="et-delete" style="color:#dc3545;border-color:#dc3545;margin-right:auto;">Delete</button>
          <button class="admin-btn" id="et-cancel">Cancel</button>
          <button class="admin-btn primary" id="et-save">Save Changes</button>
        </div>
      </div>
    `,document.body.appendChild(t);const i=t.querySelector("#et-member-search"),o=t.querySelector("#et-member-suggestions");i.addEventListener("input",()=>{clearTimeout(C);const n=i.value.trim();if(n.length<2){o.style.display="none";return}C=setTimeout(async()=>{const r=await z(n);if(r.length===0){o.style.display="none";return}o.innerHTML=r.map(a=>`<div class="member-suggestion-item" data-id="${a.id}" data-name="${u(a.name||"")}" data-slug="${a.slug||""}">
            ${u(a.name||a.id)}
            ${a.business_name?`<span style="display:block;font-size:11px;color:#888;margin-top:1px;">${u(a.business_name)}</span>`:""}
          </div>`).join(""),o.style.display="block",o.querySelectorAll(".member-suggestion-item").forEach(a=>{a.addEventListener("click",()=>{t.querySelector("#et-member-id").value=a.dataset.id,t.querySelector("#et-member-name").value=a.dataset.name,t.querySelector("#et-member-url").value=a.dataset.slug?`${y}/members/${a.dataset.slug}`:"",i.value=a.dataset.name,o.style.display="none"})})},250)}),t.querySelector(".modal-close").addEventListener("click",()=>t.remove()),t.querySelector("#et-cancel").addEventListener("click",()=>t.remove()),t.addEventListener("click",n=>{n.target===t&&t.remove()}),t.querySelector("#et-delete").addEventListener("click",async()=>{if(!confirm(`Delete "${e.title}"? This cannot be undone.`))return;const n=t.querySelector("#et-delete");n.disabled=!0,n.textContent="Deleting...",await m.from("support_task_comments").delete().eq("task_id",e.id),await m.from("support_tasks").delete().eq("id",e.id),t.remove(),await w()}),t.querySelector("#et-save").addEventListener("click",async()=>{const n=t.querySelector("#et-save"),r=t.querySelector("#et-status").value,a=r!==e.status;n.disabled=!0,n.textContent="Saving...";const s=t.querySelector("#et-hours").value,l=t.querySelector("#et-member-name").value||t.querySelector("#et-member-search").value.trim()||null,{error:d}=await m.from("support_tasks").update({category:t.querySelector("#et-category").value,title:t.querySelector("#et-title").value.trim(),description:t.querySelector("#et-description").value.trim()||null,notes:t.querySelector("#et-notes").value.trim()||null,status:r,hours:s?parseFloat(s):null,member_id:t.querySelector("#et-member-id").value||null,member_name:l,member_profile_url:t.querySelector("#et-member-url").value||null}).eq("id",e.id);if(d){alert("Error saving: "+d.message),n.disabled=!1,n.textContent="Save Changes";return}a&&await S(r==="feedback_needed"?"feedback_needed":r==="complete"?"complete":null,e),t.remove(),await w()})}function D(e){return e?new Date(e).toLocaleDateString("en-AU",{day:"2-digit",month:"2-digit",year:"2-digit"}):""}function u(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}async function h(e){const t=e.querySelector("#refresh-btn");t&&(t.disabled=!0,t.textContent="Loading...");try{E=await M(),A(e,E)}catch(i){console.error("Error refreshing dashboard:",i),t&&(t.disabled=!1,t.textContent="Refresh")}}async function O(){const e=document.querySelector(".dashboard-feed");if(!e){console.warn("Could not find .dashboard-feed container");return}if(typeof window.supabase>"u"){e.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error: Supabase library not loaded</div>
          </div>
        </div>
      `;return}if(m=window.supabase.createClient(v,g),!document.querySelector("#admin-dashboard-styles")){const t=document.createElement("style");t.id="admin-dashboard-styles",t.textContent=I,document.head.appendChild(t)}e.innerHTML=`
      <div class="admin-dashboard">
        <div class="admin-loading">
          <div class="loader"></div>
          <div class="loading-text">Loading system data...</div>
        </div>
      </div>
    `;try{E=await M(),A(e,E)}catch(t){console.error("Error loading dashboard:",t),e.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error loading dashboard</div>
            <div style="color: #666; font-size: 11px; margin-top: 8px;">${t.message}</div>
          </div>
        </div>
      `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",O):O()})();
