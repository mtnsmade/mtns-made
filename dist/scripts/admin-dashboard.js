(function(){console.log("Admin dashboard v2 loaded");const v="https://epszwomtxkpjegbjbixr.supabase.co",j="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",w="https://www.mtnsmade.com.au";let b=null,q=null,M=[];class E extends Error{}async function B(){const e=window.$memberstackDom;return(e&&typeof e.getMemberCookie=="function"?await e.getMemberCookie():"")||""}async function x(){return{"Content-Type":"application/json",Authorization:`Bearer ${j}`,apikey:j,"X-Member-Token":await B()}}async function h(e,t={}){const o=await fetch(`${v}/functions/v1/admin-data`,{method:"POST",headers:await x(),body:JSON.stringify({action:e,...t})}),i=await o.json().catch(()=>({}));if(o.status===401)throw new E("Staff login required");if(!o.ok)throw new Error(i.error||`admin-data ${e} failed`);return i.data}const W=`
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
  `;function $(e){if(!e)return"--";const t=new Date(e),i=Math.floor((new Date-t)/1e3);return i<60?"now":i<3600?`${Math.floor(i/60)}m`:i<86400?`${Math.floor(i/3600)}h`:i<604800?`${Math.floor(i/86400)}d`:t.toLocaleDateString("en-AU",{day:"2-digit",month:"short"})}function V(){return new Date().toLocaleString("en-AU",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).toUpperCase()}function P(e){const t=[];return e.profile_image_url||t.push("Profile Image"),e.header_image_url||t.push("Header Image"),(!e.bio||e.bio.length<50)&&t.push("Bio"),e.suburb_id||t.push("Location"),t}function J(e,t){const o=e.first_name||e.name||"there",i=t.length>0?`

To complete your profile, you'll need:
${t.map(n=>`- ${n}`).join(`
`)}`:"";return`Hi ${o},

Thanks for being part of MTNS MADE! We noticed your profile isn't quite complete yet.

A complete profile helps other creatives find you in the directory and shows off your amazing work.${i}

Complete your profile here: ${w}/profile/start

Let us know if you need any help!

MTNS MADE Team`}async function z(){const[e,t,o,i,n,r,a,s,l,d,c,p]=await Promise.all([Y(),G(),Q(),Z(),ee(),te(),ae(),oe(),ie(),X(),ne(),K()]);return M=p,{recentMembers:e,memberStats:t,incompleteProfiles:o,failedSignups:i,recentEvents:n,eventStats:r,recentOpportunities:a,opportunityStats:s,recentProjects:l,messageStats:d,recentActivity:c,membershipTypes:p,loadedAt:new Date}}async function Y(){try{return await h("recent-members")||[]}catch(e){if(e instanceof E)throw e;return console.error("Error loading recent members:",e),[]}}async function G(){const e=await h("member-stats").catch(s=>{if(s instanceof E)throw s;return console.error("Error loading member stats:",s),[]}),t=(e==null?void 0:e.length)||0,o=(e==null?void 0:e.filter(s=>s.subscription_status==="active").length)||0,i=(e==null?void 0:e.filter(s=>s.subscription_status==="lapsed").length)||0,n=(e==null?void 0:e.filter(s=>s.profile_complete).length)||0,r=(e==null?void 0:e.filter(s=>s.webflow_id).length)||0,a=(e==null?void 0:e.filter(s=>s.profile_complete&&!s.webflow_id&&s.subscription_status==="active").length)||0;return{total:t,active:o,lapsed:i,complete:n,synced:r,pendingSync:a}}async function K(){const{data:e,error:t}=await b.from("membership_types").select("id, name").order("name");return t?(console.error("Error loading membership types:",t),[]):e||[]}async function X(){try{const e=new Date,t=new Date(e.getFullYear(),e.getMonth(),1).toISOString(),{data:o,error:i}=await b.rpc("admin_message_stats",{month_start:t});if(i)throw i;const n=o&&o[0]||{};return{total:Number(n.total)||0,unread:Number(n.unread)||0,thisMonth:Number(n.this_month)||0}}catch(e){return console.error("Error loading message stats:",e),{total:0,unread:0,thisMonth:0}}}async function Q(){try{return await h("incomplete-profiles")||[]}catch(e){if(e instanceof E)throw e;return console.error("Error loading incomplete profiles:",e),[]}}async function Z(){try{return await h("failed-signups")||[]}catch(e){if(e instanceof E)throw e;return console.error("Error loading failed signups:",e),[]}}async function ee(){const e="id, name, slug, memberstack_id, member_contact_email, is_draft, is_archived, webflow_id, created_at",[{data:t,error:o},{data:i,error:n}]=await Promise.all([b.from("events").select(e).eq("is_draft",!0).order("created_at",{ascending:!1}).limit(50),b.from("events").select(e).eq("is_draft",!1).order("created_at",{ascending:!1}).limit(50)]);return o||n?(console.error("Error loading recent events:",o||n),[]):[...t||[],...i||[]]}async function te(){const{data:e}=await b.from("events").select("id, is_draft, is_archived, webflow_id"),t=(e==null?void 0:e.length)||0,o=(e==null?void 0:e.filter(n=>n.is_draft&&!n.is_archived).length)||0,i=(e==null?void 0:e.filter(n=>!n.is_draft&&!n.is_archived).length)||0;return{total:t,pending:o,published:i}}async function ae(){const e="id, name, slug, memberstack_id, member_contact_email, opportunity_type, is_draft, is_archived, webflow_id, created_at",[{data:t,error:o},{data:i,error:n}]=await Promise.all([b.from("opportunities").select(e).eq("is_draft",!0).order("created_at",{ascending:!1}).limit(50),b.from("opportunities").select(e).eq("is_draft",!1).order("created_at",{ascending:!1}).limit(50)]);if(o||n)return console.error("Error loading recent opportunities:",o||n),[];const r=[...t||[],...i||[]],a=[...new Set(r.map(s=>s.memberstack_id).filter(Boolean))];if(a.length>0){const s=await h("names-by-memberstack-id",{ids:a}).catch(()=>null);if(s){const l=Object.fromEntries(s.map(d=>[d.memberstack_id,d]));r.forEach(d=>{const c=l[d.memberstack_id];c&&(d.member_name=[c.first_name,c.last_name].filter(Boolean).join(" ")||c.name||null)})}}return r}async function oe(){const{data:e}=await b.from("opportunities").select("id, is_draft, is_archived"),t=(e==null?void 0:e.length)||0,o=(e==null?void 0:e.filter(n=>n.is_draft&&!n.is_archived).length)||0,i=(e==null?void 0:e.filter(n=>!n.is_draft&&!n.is_archived).length)||0;return{total:t,pending:o,published:i}}async function ie(){const{data:e,error:t}=await b.from("projects").select(`
        id, name, slug, member_id, webflow_id, is_draft, is_deleted,
        created_at, updated_at
      `).eq("is_deleted",!1).order("updated_at",{ascending:!1}).limit(15);return t?(console.error("Error loading recent projects:",t),[]):e||[]}async function ne(){const{data:e,error:t}=await b.from("activity_log").select(`
        id, member_id, memberstack_id, activity_type, description,
        entity_type, entity_id, entity_name,
        member_webflow_url, entity_webflow_url, created_at
      `).order("created_at",{ascending:!1}).limit(50);if(t)return console.error("Error loading recent activity:",t),[];const o=[...new Set(e.filter(n=>n.member_id).map(n=>n.member_id))];let i={};if(o.length>0){const n=await h("names-by-member-id",{ids:o}).catch(()=>null);n&&n.forEach(r=>{i[r.id]={name:r.name||`${r.first_name||""} ${r.last_name||""}`.trim()||"Unknown Member",profile_image_url:r.profile_image_url||null}})}return e.map(n=>{var r,a;return{...n,member_name:n.member_id&&((r=i[n.member_id])==null?void 0:r.name)||"Unknown Member",member_profile_image:n.member_id&&((a=i[n.member_id])==null?void 0:a.profile_image_url)||null}})}function re(e){const t=P(e),o=J(e,t),i=document.createElement("div");i.className="modal-overlay",i.innerHTML=`
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
            <textarea class="form-input" id="modal-body">${o}</textarea>
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
    `,document.body.appendChild(i),i.querySelector(".modal-close").addEventListener("click",()=>i.remove()),i.querySelector("#modal-cancel").addEventListener("click",()=>i.remove()),i.addEventListener("click",r=>{r.target===i&&i.remove()});const n=i.querySelector("#modal-password-reset");n&&n.addEventListener("click",async()=>{if(confirm(`Send a password reset email to ${e.email||e.first_name||"this member"}?`)){n.disabled=!0,n.textContent="Sending...";try{if(!e.email)throw new Error("No email address on file for this member");if(!window.$memberstackDom)throw new Error("Memberstack is not loaded on this page - refresh and try again");await window.$memberstackDom.sendMemberResetPasswordEmail({email:e.email}),alert(`Password reset email sent to ${e.email}.`),n.textContent="Sent"}catch(r){console.error("Password reset error:",r),alert(`Error sending password reset: ${r.message||r}`),n.disabled=!1,n.textContent="Send Password Reset"}}}),i.querySelector("#modal-send").addEventListener("click",async()=>{const r=i.querySelector("#modal-to").value,a=i.querySelector("#modal-subject").value,s=i.querySelector("#modal-body").value;if(!r){alert("No email address available for this member");return}const l=i.querySelector("#modal-send");l.disabled=!0,l.textContent="Sending...";try{const c=await(await fetch(`${v}/functions/v1/send-email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:r,subject:a,text:s,html:s.replace(/\n/g,"<br>")})})).json();if(c.success){await h("mark-reminder-sent",{id:e.id}).catch(u=>console.error("Could not record reminder:",u)),alert("Email sent successfully!"),i.remove();const p=document.querySelector(".dashboard-feed");p&&g(p)}else alert("Failed to send email: "+(c.error||"Unknown error")),l.disabled=!1,l.textContent="Send Email"}catch(d){console.error("Error sending email:",d),alert("Error sending email. Check console for details."),l.disabled=!1,l.textContent="Send Email"}})}function se(e,t,o){var r;const i=((r=M.find(a=>a.id===o))==null?void 0:r.name)||"Not set",n=document.createElement("div");n.className="modal-overlay",n.innerHTML=`
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
            <input type="text" class="form-input" value="${i}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">New Membership Type</label>
            <select class="form-input" id="modal-membership-type">
              <option value="">-- Select New Type --</option>
              ${M.map(a=>`
                <option value="${a.id}" ${a.id===o?"disabled":""}>
                  ${a.name}${a.id===o?" (current)":""}
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
    `,document.body.appendChild(n),n.querySelector(".modal-close").addEventListener("click",()=>n.remove()),n.querySelector("#modal-cancel").addEventListener("click",()=>n.remove()),n.addEventListener("click",a=>{a.target===n&&n.remove()}),n.querySelector("#modal-save").addEventListener("click",async()=>{var p;const a=n.querySelector("#modal-membership-type").value,s=n.querySelector("#modal-skip-billing").checked;if(!a){alert("Please select a new membership type");return}const l=((p=M.find(u=>u.id===a))==null?void 0:p.name)||"Unknown",d=s?`Change ${t}'s type from "${i}" to "${l}"?

This will update the label only (no billing change).`:`Change ${t}'s type from "${i}" to "${l}"?

This WILL change their Stripe subscription and billing.`;if(!confirm(d))return;const c=n.querySelector("#modal-save");c.disabled=!0,c.textContent="Updating Memberstack...";try{const u=await fetch(`${v}/functions/v1/admin-update-member`,{method:"POST",headers:await x(),body:JSON.stringify({memberId:e,newMembershipTypeId:a,skipPlanChange:s})}),f=await u.json();if(!u.ok)throw new Error(f.error||"Update failed");let _=`Membership type updated!

${f.change.from} → ${f.change.to}`;f.results.warnings&&f.results.warnings.length>0&&(_+=`

Warnings:
- ${f.results.warnings.join(`
- `)}`),alert(_),n.remove();const y=document.querySelector(".dashboard-feed");y&&g(y)}catch(u){console.error("Error updating membership type:",u),alert("Error updating membership type: "+u.message),c.disabled=!1,c.textContent="Update Membership"}})}function le(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,100)}async function de(e){const t=le(e),{data:o}=await b.from("opportunities").select("slug").eq("slug",t).maybeSingle();if(!o)return t;const{data:i}=await b.from("opportunities").select("slug").like("slug",`${t}-%`),n=new Set((i||[]).map(a=>a.slug));n.add(t);let r=2;for(;n.has(`${t}-${r}`);)r++;return`${t}-${r}`}const ce={job:"Job / Employment",commission:"Commission",collaboration:"Collaboration","call-for-entries":"Call for Entries",residency:"Residency / Fellowship",volunteer:"Volunteer"};function pe(){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`
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
              ${Object.entries(ce).map(([t,o])=>`
                <option value="${t}">${o}</option>
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
    `,document.body.appendChild(e),e.querySelector(".modal-close").addEventListener("click",()=>e.remove()),e.querySelector("#modal-cancel").addEventListener("click",()=>e.remove()),e.addEventListener("click",t=>{t.target===e&&e.remove()}),e.querySelector("#modal-save").addEventListener("click",async()=>{const t=e.querySelector("#modal-opp-name").value.trim(),o=e.querySelector("#modal-opp-type").value;if(!t||!o){alert("Title and Type are required.");return}const i=e.querySelector("#modal-save");i.disabled=!0,i.textContent="Creating...";try{const n=await de(t),r={name:t,slug:n,opportunity_type:o,organization:e.querySelector("#modal-opp-org").value.trim()||null,contact_name:e.querySelector("#modal-opp-contact-name").value.trim()||null,member_contact_email:e.querySelector("#modal-opp-contact-email").value.trim()||null,description:e.querySelector("#modal-opp-description").value.trim()||null,criteria:e.querySelector("#modal-opp-criteria").value.trim()||null,opportunity_url:e.querySelector("#modal-opp-url").value.trim()||null,closing_date:e.querySelector("#modal-opp-closing-date").value||null,is_draft:!0,is_archived:!1},{data:a,error:s}=await b.from("opportunities").insert(r).select("id").single();if(s)throw s;i.textContent="Publishing...";const d=await(await fetch(`${v}/functions/v1/manage-opportunity`,{method:"POST",headers:await x(),body:JSON.stringify({opportunityId:a.id,action:"approve"})})).json();if(!d.success)throw new Error(d.error||"Failed to publish");alert(`"${t}" has been created and published.`),e.remove(),g(document.querySelector(".dashboard-feed"))}catch(n){console.error("Error creating opportunity:",n),alert("Error creating opportunity: "+n.message),i.disabled=!1,i.textContent="Create & Publish"}})}async function me(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
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
    `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",()=>t.remove()),t.addEventListener("click",a=>{a.target===t&&t.remove()});const{data:o,error:i}=await b.from("events").select("*").eq("id",e).single();if(i||!o){t.querySelector(".modal-body").innerHTML='<div style="padding: 24px; color: #dc3545;">Failed to load event details.</div>';return}const n=a=>a?new Date(a).toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):"--",r=[o.location_name,o.location_address].filter(Boolean).join(", ")||"--";t.querySelector(".modal-title").textContent=o.name||"Event Preview",t.querySelector(".modal-body").innerHTML=`
      ${o.feature_image_url?`<img src="${o.feature_image_url}" class="event-preview-image" alt="${o.name}">`:""}
      <div class="preview-grid">
        <div class="preview-field">
          <div class="preview-label">Start</div>
          <div class="preview-value">${n(o.date_start)}</div>
        </div>
        <div class="preview-field">
          <div class="preview-label">End</div>
          <div class="preview-value">${n(o.date_end)}</div>
        </div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Location</div>
        <div class="preview-value">${r}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Description</div>
        <div class="preview-value">${o.description||"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">RSVP / Tickets</div>
        <div class="preview-value">${o.rsvp_link?`<a href="${o.rsvp_link}" target="_blank">${o.rsvp_link}</a>`:"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Submitted by</div>
        <div class="preview-value">${o.member_contact_email||"--"}</div>
      </div>
    `}async function ue(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
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
    `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",()=>t.remove()),t.addEventListener("click",r=>{r.target===t&&t.remove()});const{data:o,error:i}=await b.from("opportunities").select("*").eq("id",e).single();if(i||!o){t.querySelector(".modal-body").innerHTML='<div style="padding: 24px; color: #dc3545;">Failed to load opportunity details.</div>';return}const n=r=>r?new Date(r).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"}):"--";t.querySelector(".modal-title").textContent=o.name||"Opportunity Preview",t.querySelector(".modal-body").innerHTML=`
      <div class="preview-grid">
        <div class="preview-field">
          <div class="preview-label">Type</div>
          <div class="preview-value">${o.opportunity_type||"--"}</div>
        </div>
        <div class="preview-field">
          <div class="preview-label">Closes</div>
          <div class="preview-value">${n(o.closing_date)}</div>
        </div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Organisation</div>
        <div class="preview-value">${o.organization||"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Description</div>
        <div class="preview-value">${o.description||"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">How to Apply</div>
        <div class="preview-value">${o.how_to_apply||"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">URL</div>
        <div class="preview-value">${o.opportunity_url?`<a href="${o.opportunity_url}" target="_blank">${o.opportunity_url}</a>`:"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Remote</div>
        <div class="preview-value">${o.is_remote?"Yes":"No"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Submitted by</div>
        <div class="preview-value">${o.member_name||o.member_contact_email||"--"}</div>
      </div>
    `}function O(e,t){var r;const o=t.incompleteProfiles.length,i=t.eventStats.pending,n=t.opportunityStats.pending;e.innerHTML=`
      <div class="admin-dashboard">
        <div class="admin-header">
          <h1>MTNS MADE // System Dashboard</h1>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span class="admin-timestamp">Updated: ${V()}</span>
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
          <div class="stat-cell ${o>5?"alert":""}">
            <div class="stat-value">${t.memberStats.complete}/${t.memberStats.total}</div>
            <div class="stat-label">Profiles Complete</div>
          </div>
          <div class="stat-cell">
            <div class="stat-value">${t.messageStats.thisMonth}</div>
            <div class="stat-label">Messages This Month</div>
          </div>
        </div>

        <!-- Issues Section -->
        ${be(t)}

        <!-- Activity Tabs -->
        <div class="admin-section">
          <div class="tabs-container">
            <button class="tab-btn active" data-tab="activity">Activity</button>
            <button class="tab-btn" data-tab="members">Recent Members</button>
            <button class="tab-btn" data-tab="incomplete">Incomplete (${o})</button>
            <button class="tab-btn" data-tab="failed">Failed Signups (${t.failedSignups.length})</button>
            <button class="tab-btn" data-tab="events">Events ${i>0?`(${i})`:""}</button>
            <button class="tab-btn" data-tab="opportunities">Opportunities ${n>0?`(${n})`:""}</button>
            <button class="tab-btn" data-tab="projects">Projects</button>
            <button class="tab-btn" data-tab="support">Support</button>
            <button class="tab-btn" data-tab="sop">SOPs</button>
          </div>

          <div class="tab-content active" id="tab-activity">
            ${we(t.recentActivity)}
          </div>

          <div class="tab-content" id="tab-members">
            ${fe(t.recentMembers)}
          </div>

          <div class="tab-content" id="tab-incomplete">
            ${ve(t.incompleteProfiles)}
          </div>

          <div class="tab-content" id="tab-failed">
            ${he(t.failedSignups)}
          </div>

          <div class="tab-content" id="tab-events">
            ${ge(t.recentEvents,t.eventStats)}
          </div>

          <div class="tab-content" id="tab-opportunities">
            ${ye(t.recentOpportunities,t.opportunityStats)}
          </div>

          <div class="tab-content" id="tab-projects">
            ${xe(t.recentProjects)}
          </div>

          <div class="tab-content" id="tab-support">
            <div id="support-tracker-root">Loading...</div>
          </div>

          <div class="tab-content" id="tab-sop">
            <div id="sop-root">Loading...</div>
          </div>
        </div>
      </div>
    `,e.querySelectorAll(".tab-btn").forEach(a=>{a.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(s=>s.classList.remove("active")),e.querySelectorAll(".tab-content").forEach(s=>s.classList.remove("active")),a.classList.add("active"),e.querySelector(`#tab-${a.dataset.tab}`).classList.add("active"),a.dataset.tab==="support"&&S(),a.dataset.tab==="sop"&&Ee()})}),e.querySelector("#refresh-btn").addEventListener("click",()=>g(e)),e.querySelectorAll(".contact-btn").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.memberId,l=t.incompleteProfiles.find(d=>d.id===s)||t.recentMembers.find(d=>d.id===s)||t.failedSignups.find(d=>d.id===s);l&&re(l)})}),e.querySelectorAll(".approve-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.eventId,l=a.dataset.eventName;if(confirm(`Approve event "${l}"?

This will publish the event and notify the member.`)){a.disabled=!0,a.textContent="Approving...";try{const c=await(await fetch(`${v}/functions/v1/manage-event`,{method:"POST",headers:await x(),body:JSON.stringify({eventId:s,action:"approve"})})).json();c.success?(alert(`Event "${l}" has been approved!

The member will be notified and the event will sync to Webflow.`),g(e)):(alert(`Failed to approve event: ${c.error}`),a.disabled=!1,a.textContent="Approve")}catch(d){console.error("Approve error:",d),alert("Error approving event. Please try again."),a.disabled=!1,a.textContent="Approve"}}})}),e.querySelectorAll(".reject-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.eventId,l=a.dataset.eventName,d=prompt(`Reject event "${l}"?

Optionally enter a reason (or leave blank):`);if(d!==null){a.disabled=!0,a.textContent="Rejecting...";try{const p=await(await fetch(`${v}/functions/v1/manage-event`,{method:"POST",headers:await x(),body:JSON.stringify({eventId:s,action:"reject",rejectionReason:d||void 0})})).json();p.success?(alert(`Event "${l}" has been rejected.

The member will be notified.`),g(e)):(alert(`Failed to reject event: ${p.error}`),a.disabled=!1,a.textContent="Reject")}catch(c){console.error("Reject error:",c),alert("Error rejecting event. Please try again."),a.disabled=!1,a.textContent="Reject"}}})}),e.querySelectorAll(".preview-btn").forEach(a=>{a.addEventListener("click",()=>{me(a.dataset.eventId)})}),(r=e.querySelector("#new-opportunity-btn"))==null||r.addEventListener("click",()=>{pe()}),e.querySelectorAll(".preview-opp-btn").forEach(a=>{a.addEventListener("click",()=>{ue(a.dataset.oppId)})}),e.querySelectorAll(".approve-opp-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.oppId,l=a.dataset.oppName;if(confirm(`Approve opportunity "${l}"?

This will publish it and notify the member.`)){a.disabled=!0,a.textContent="Approving...";try{const c=await(await fetch(`${v}/functions/v1/manage-opportunity`,{method:"POST",headers:await x(),body:JSON.stringify({opportunityId:s,action:"approve"})})).json();c.success?(alert(`Opportunity "${l}" has been approved!

The member will be notified.`),g(e)):(alert(`Failed to approve opportunity: ${c.error}`),a.disabled=!1,a.textContent="Approve")}catch(d){console.error("Opportunity approve error:",d),alert("Error approving opportunity. Please try again."),a.disabled=!1,a.textContent="Approve"}}})}),e.querySelectorAll(".reject-opp-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.oppId,l=a.dataset.oppName,d=prompt(`Reject opportunity "${l}"?

Optionally enter a reason (or leave blank):`);if(d!==null){a.disabled=!0,a.textContent="Rejecting...";try{const p=await(await fetch(`${v}/functions/v1/manage-opportunity`,{method:"POST",headers:await x(),body:JSON.stringify({opportunityId:s,action:"reject",rejectionReason:d||void 0})})).json();p.success?(alert(`Opportunity "${l}" has been rejected.

The member will be notified.`),g(e)):(alert(`Failed to reject opportunity: ${p.error}`),a.disabled=!1,a.textContent="Reject")}catch(c){console.error("Opportunity reject error:",c),alert("Error rejecting opportunity. Please try again."),a.disabled=!1,a.textContent="Reject"}}})}),e.querySelectorAll(".edit-btn").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.memberId,l=a.dataset.memberName,d=a.dataset.currentType;se(s,l,d)})}),e.querySelectorAll(".delete-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.memberId,l=a.dataset.memberName;if(confirm(`Delete "${l}"?

This will remove them from the dashboard and Webflow directory. This action cannot be undone.`)){a.disabled=!0,a.textContent="Deleting...";try{await h("soft-delete-member",{id:s}),alert(`"${l}" has been deleted.`),g(e)}catch(d){console.error("Delete error:",d),alert("Error deleting member. Please try again."),a.disabled=!1,a.textContent="Delete"}}})}),e.querySelectorAll(".delete-project-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.projectId,l=a.dataset.projectName;if(confirm(`Delete project "${l}"?

This will remove it from Webflow and the directory. This cannot be undone.`)){a.disabled=!0,a.textContent="Deleting...";try{const c=await(await fetch(`${v}/functions/v1/admin-tools`,{method:"POST",headers:await x(),body:JSON.stringify({action:"delete-project",projectId:s})})).json();c.success?(alert(`Project "${l}" has been deleted.`),g(e)):(alert(`Failed to delete project: ${c.error}`),a.disabled=!1,a.textContent="Delete")}catch(d){console.error("Delete project error:",d),alert("Error deleting project. Please try again."),a.disabled=!1,a.textContent="Delete"}}})}),e.querySelectorAll(".delete-opp-btn").forEach(a=>{a.addEventListener("click",async()=>{const s=a.dataset.oppId,l=a.dataset.oppName;if(confirm(`Delete "${l}"?

This will remove it from the site. This cannot be undone.`)){a.disabled=!0,a.textContent="Deleting...";try{const c=await(await fetch(`${v}/functions/v1/admin-tools`,{method:"POST",headers:await x(),body:JSON.stringify({action:"delete-opportunity",opportunityId:s})})).json();c.success?(alert(`"${l}" has been deleted.`),g(e)):(alert(`Failed to delete: ${c.error}`),a.disabled=!1,a.textContent="Delete")}catch(d){console.error("Delete opportunity error:",d),alert("Error deleting opportunity. Please try again."),a.disabled=!1,a.textContent="Delete"}}})})}function be(e){const t=[];e.memberStats.pendingSync>0&&t.push({type:"warning",text:"Members pending Webflow sync",count:e.memberStats.pendingSync});const o=e.incompleteProfiles.filter(i=>(Date.now()-new Date(i.created_at))/864e5>7&&!i.profile_reminder_sent_at);return o.length>0&&t.push({type:"info",text:"Incomplete profiles (7+ days, no reminder sent)",count:o.length}),e.eventStats.pending>0&&t.push({type:"info",text:"Events pending review",count:e.eventStats.pending}),e.opportunityStats.pending>0&&t.push({type:"info",text:"Opportunities pending review",count:e.opportunityStats.pending}),e.memberStats.lapsed>0&&t.push({type:"error",text:"Lapsed subscriptions",count:e.memberStats.lapsed}),t.length===0?`
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
          ${t.map(i=>`
            <div class="issue-item">
              <div class="issue-icon ${i.type}"></div>
              <div class="issue-text">${i.text}</div>
              <div class="issue-count">${i.count}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `}function fe(e){return e.length===0?'<div class="empty-state">No members found</div>':`
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
          ${e.map(t=>{var o;return`
            <tr>
              <td>
                <div class="name-cell">${t.name||t.first_name||"No name"}</div>
                <div class="email-cell">${t.email||"--"}</div>
              </td>
              <td>
                <span class="type-cell">${((o=t.membership_types)==null?void 0:o.name)||"Not set"}</span>
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
              <td class="time-cell">${$(t.created_at)}</td>
              <td>
                <div class="action-btns">
                  <button class="action-btn edit-btn" data-member-id="${t.id}" data-member-name="${t.name||t.first_name||"this member"}" data-current-type="${t.membership_type_id||""}">Edit</button>
                  ${t.webflow_id&&t.slug?`
                    <a href="${w}/members/${t.slug}" target="_blank" class="action-btn view-btn">View</a>
                  `:""}
                  <button class="action-btn delete-btn" data-member-id="${t.id}" data-member-name="${t.name||t.first_name||"this member"}">Delete</button>
                </div>
              </td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    `}function ve(e){return e.length===0?'<div class="empty-state">All active members have complete profiles</div>':`
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
          ${e.map(t=>{const o=P(t);return`
              <tr>
                <td>
                  <div class="name-cell">${t.name||t.first_name||"No name"}</div>
                  <div class="email-cell">${t.email||"--"}</div>
                </td>
                <td>
                  <div class="missing-fields">
                    ${o.slice(0,3).map(i=>`<span class="missing-field">${i}</span>`).join("")}
                    ${o.length>3?`<span class="missing-field">+${o.length-3}</span>`:""}
                  </div>
                </td>
                <td class="time-cell">
                  ${t.profile_reminder_sent_at?$(t.profile_reminder_sent_at):"--"}
                </td>
                <td class="time-cell">${$(t.created_at)}</td>
                <td>
                  <div class="action-btns">
                    ${t.profile_reminder_sent_at?`
                      <button class="action-btn contacted" disabled>Contacted</button>
                    `:`
                      <button class="action-btn contact-btn" data-member-id="${t.id}">Contact</button>
                    `}
                    ${t.webflow_id&&t.slug?`
                      <a href="${w}/members/${t.slug}" target="_blank" class="action-btn">View</a>
                    `:""}
                  </div>
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    `}function he(e){return e.length===0?'<div class="empty-state">No failed signups found</div>':`
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
              <td class="time-cell">${$(t.created_at)}</td>
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
    `}function ge(e,t){return`
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
            ${e.map(o=>{let i="draft";return o.is_archived?i="archived":o.is_draft?i="pending":i="published",`
                <tr>
                  <td>
                    <div class="name-cell">${o.name||"Untitled"}</div>
                    <div class="email-cell">${o.member_contact_email||"--"}</div>
                  </td>
                  <td>
                    <span class="status ${i==="published"?"complete":i==="pending"?"pending":"draft"}">
                      ${i}
                    </span>
                  </td>
                  <td>
                    <span class="status ${o.webflow_id?"synced":"pending"}">
                      ${o.webflow_id?"Synced":"--"}
                    </span>
                  </td>
                  <td class="time-cell">${$(o.created_at)}</td>
                  <td>
                    <div class="action-btns">
                      ${i==="pending"?`
                        <button class="action-btn preview-btn" data-event-id="${o.id}">Preview</button>
                        <button class="action-btn approve-btn" data-event-id="${o.id}" data-event-name="${o.name}">Approve</button>
                        <button class="action-btn reject-btn" data-event-id="${o.id}" data-event-name="${o.name}">Reject</button>
                      `:""}
                      ${o.webflow_id&&o.slug?`
                        <a href="${w}/event/${o.slug}" target="_blank" class="action-btn view-btn">View</a>
                      `:""}
                    </div>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      `}
    `}function ye(e,t){return`
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
            ${e.map(o=>{let i="draft";return o.is_archived?i="archived":o.is_draft?i="pending":i="published",`
                <tr>
                  <td>
                    <div class="name-cell">${o.name||"Untitled"}</div>
                    <div class="email-cell">${o.member_contact_email||"--"}</div>
                  </td>
                  <td>
                    <span class="type-cell">${o.opportunity_type||"--"}</span>
                  </td>
                  <td>
                    <span class="status ${i==="published"?"complete":i==="pending"?"pending":"draft"}">
                      ${i}
                    </span>
                  </td>
                  <td class="time-cell">${$(o.created_at)}</td>
                  <td>
                    <div class="action-btns">
                      ${i==="pending"?`
                        <button class="action-btn preview-opp-btn" data-opp-id="${o.id}">Preview</button>
                        <button class="action-btn approve-opp-btn" data-opp-id="${o.id}" data-opp-name="${o.name}">Approve</button>
                        <button class="action-btn reject-opp-btn" data-opp-id="${o.id}" data-opp-name="${o.name}">Reject</button>
                      `:""}
                      ${o.webflow_id&&o.slug?`
                        <a href="${w}/opportunities/${o.slug}" target="_blank" class="action-btn view-btn">View</a>
                      `:""}
                      <button class="action-btn delete-opp-btn" data-opp-id="${o.id}" data-opp-name="${m(o.name||"this opportunity")}" style="color:#dc3545;border-color:#dc3545;">Delete</button>
                    </div>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      `}
    `}function xe(e){return e.length===0?'<div class="empty-state">No projects found</div>':`
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
              <td class="time-cell">${$(t.updated_at)}</td>
              <td>
                <div class="action-btns">
                  ${t.webflow_id&&t.slug?`
                    <a href="${w}/projects/${t.slug}" target="_blank" class="action-btn view-btn">View</a>
                  `:""}
                  <button class="action-btn delete-project-btn" data-project-id="${t.id}" data-project-name="${(t.name||"this project").replace(/"/g,"&quot;")}">Delete</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}function we(e){if(!e||e.length===0)return'<div class="empty-state">No recent activity</div>';const t=i=>i==="member_signup"?{class:"signup",icon:"🎉"}:i==="profile_update"?{class:"profile",icon:"👤"}:i.startsWith("project_")?{class:"project",icon:"📁"}:i.startsWith("event_")?{class:"event",icon:"📅"}:i.startsWith("opportunity_")?{class:"event",icon:"💼"}:i==="subscription_canceled"?{class:"canceled",icon:"🚫"}:i==="subscription_reactivated"?{class:"reactivated",icon:"✅"}:{class:"",icon:"📝"},o=i=>i.activity_type==="member_signup"?null:i.entity_webflow_url?i.entity_webflow_url:i.member_webflow_url?i.member_webflow_url:null;return`
      <div class="activity-feed">
        ${e.map(i=>{const n=t(i.activity_type),r=o(i);return`
            <div class="activity-item">
              ${i.member_profile_image?`
                <div class="activity-avatar">
                  <img src="${i.member_profile_image}" alt="${i.member_name}">
                </div>
              `:`
                <div class="activity-icon ${n.class}">${n.icon}</div>
              `}
              <div class="activity-content">
                <div class="activity-text">
                  <strong>${i.member_name}</strong> ${i.description}
                </div>
                <div class="activity-meta">
                  <span class="activity-time">${$(i.created_at)}</span>
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
    `}const C={member_support:"Member Support",website_bug:"Website Bug",feature_request:"Feature Request"},I={not_started:"Not Started",in_progress:"In Progress",feedback_needed:"Feedback Needed",complete:"Complete",stalled:"Stalled"};let A="main";const $e=new Set(["not_started","in_progress","feedback_needed"]),_e=new Set(["complete","stalled"]);async function Se(){const{data:e,error:t}=await b.from("support_tasks").select("*, support_task_comments(*)").order("created_at",{ascending:!1});return t?(console.error("loadSupportTasks:",t),[]):((e||[]).forEach(o=>{var i;return(i=o.support_task_comments)==null?void 0:i.sort((n,r)=>new Date(n.created_at)-new Date(r.created_at))}),e||[])}const T=7;function ke(e){const t=new Date,o=t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0"),i=e.filter(p=>{const u=new Date(p.created_at);return u.getFullYear()+"-"+String(u.getMonth()+1).padStart(2,"0")===o}).reduce((p,u)=>p+(parseFloat(u.hours)||0),0),n=Math.min(i/T*100,100),r=T-i,a=t.toLocaleDateString("en-AU",{month:"long"});let s="",l=`${r%1===0?r:r.toFixed(1)}h remaining`;if(i>T){s="over";const p=i-T;l=`${p%1===0?p:p.toFixed(1)}h over this month's limit`}else i>=5&&(s="approaching",l=`${r%1===0?r:r.toFixed(1)}h remaining — approaching limit`);const d=i%1===0?i:i.toFixed(1),c=document.createElement("div");return c.className=`retainer-banner${s?" "+s:""}`,c.innerHTML=`
      <div class="retainer-label">Retainer &mdash; ${a}</div>
      <div class="retainer-bar-wrap">
        <div class="retainer-bar-fill" style="width:${n}%"></div>
      </div>
      <div class="retainer-hours">${d}h / ${T}h</div>
      <div class="retainer-status">${l}</div>
    `,c}async function S(){const e=document.getElementById("support-tracker-root");if(!e)return;e.innerHTML='<div style="padding:20px;color:#888;font-size:13px;">Loading...</div>';const t=await Se();Te(e,t)}async function Ee(){const e=document.getElementById("sop-root");if(!e)return;e.innerHTML='<div style="padding:20px;color:#888;font-size:13px;">Loading...</div>';const{data:t,error:o}=await b.from("sops").select("*").order("category",{ascending:!0}).order("title",{ascending:!0});if(o){e.innerHTML=`<div class="empty-state" style="padding:40px 20px;">Error loading SOPs: ${m(o.message)}</div>`;return}if(!t||t.length===0){e.innerHTML='<div class="empty-state" style="padding:40px 20px;">No SOPs yet.</div>';return}e.innerHTML=t.map(i=>`
      <div class="admin-section" style="margin-bottom:16px;border:1px solid #eee;border-radius:8px;padding:20px;">
        <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:12px;">
          <h3 style="margin:0;font-size:16px;">${m(i.title)}</h3>
          ${i.category?`<span class="status" style="font-size:10px;padding:2px 8px;">${m(i.category)}</span>`:""}
        </div>
        <div style="font-size:13px;line-height:1.6;color:#333;white-space:pre-wrap;">${m(i.content)}</div>
      </div>
    `).join("")}function Te(e,t){var i,n;const o=A==="archive";if(e.innerHTML=`
      <div class="support-toolbar">
        <div class="support-toolbar-actions">
          <button class="admin-btn primary" id="new-task-btn">+ New Task</button>
          <button class="admin-btn ${o?"primary":""}" id="archive-view-btn">Archive</button>
        </div>
        ${o?'<span style="font-size:12px;color:#888;">Completed &amp; stalled tasks</span>':'<span style="font-size:12px;color:#888;">Active tasks</span>'}
      </div>
    `,e.appendChild(ke(t)),o)qe(e,t.filter(r=>_e.has(r.status)));else{const r=t.filter(s=>$e.has(s.status)),a=document.createElement("div");a.innerHTML=r.length===0?'<div class="empty-state" style="padding:40px 20px;">No active tasks.</div>':`<table class="admin-table" id="support-table">
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
              ${r.map(s=>Me(s)).join("")}
            </tbody>
          </table>`,e.appendChild(a),e.querySelectorAll(".task-detail-btn").forEach(s=>{s.addEventListener("click",()=>{const l=t.find(d=>d.id===s.dataset.taskId);l&&R(l)})}),e.querySelectorAll(".form-input[data-task-id]").forEach(s=>{s.addEventListener("change",async()=>{const l=t.find(d=>d.id===s.dataset.taskId);await Ce(s.dataset.taskId,s.value,l),await S()})}),e.querySelectorAll(".task-edit-btn").forEach(s=>{s.addEventListener("click",()=>{const l=t.find(d=>d.id===s.dataset.taskId);l&&je(l)})})}(i=e.querySelector("#new-task-btn"))==null||i.addEventListener("click",()=>Le()),(n=e.querySelector("#archive-view-btn"))==null||n.addEventListener("click",()=>{A=A==="archive"?"main":"archive",S()})}function qe(e,t){const o={};t.forEach(a=>{const s=new Date(a.created_at),l=`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`;o[l]||(o[l]=[]),o[l].push(a)});const i=Object.keys(o).sort((a,s)=>s.localeCompare(a));if(i.length===0){const a=document.createElement("div");a.className="empty-state",a.style.padding="40px 20px",a.textContent="No archived tasks yet.",e.appendChild(a);return}function n(a){const[s,l]=a.split("-");return new Date(parseInt(s),parseInt(l)-1,1).toLocaleDateString("en-AU",{month:"long",year:"numeric"})}const r=document.createElement("div");r.className="archive-month-grid",i.forEach(a=>{const s=o[a].slice().sort((p,u)=>new Date(u.updated_at)-new Date(p.updated_at)),l=s.reduce((p,u)=>p+(parseFloat(u.hours)||0),0),d=l>0?`${l%1===0?l:l.toFixed(2)}h`:"—",c=document.createElement("div");c.className="month-card expanded",c.innerHTML=`
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
                <span class="status ${p.category}" style="font-size:10px;padding:2px 6px;margin-right:4px;">${C[p.category]||p.category}</span>
                ${m(p.title.length>80?p.title.substring(0,77)+"…":p.title)}
              </div>
              <div class="month-task-meta">${p.hours!=null?p.hours+"h":""}</div>
            </div>
          `).join("")}
        </div>
      `,c.addEventListener("click",()=>{c.classList.toggle("expanded")}),c.querySelectorAll(".month-task-title").forEach(p=>{p.addEventListener("click",u=>{u.stopPropagation();const f=p.dataset.taskId;b.from("support_tasks").select("*, support_task_comments(*)").eq("id",f).single().then(({data:_})=>{var y;_&&((y=_.support_task_comments)==null||y.sort((N,D)=>new Date(N.created_at)-new Date(D.created_at)),R(_))})})}),r.appendChild(c)}),e.appendChild(r)}function Me(e){const t=e.support_task_comments||[];return`
      <tr>
        <td>
          <span class="status ${e.category}">${C[e.category]||e.category}</span>
          ${e.source==="member"?'<span style="display:inline-block;margin-left:4px;padding:1px 6px;border-radius:8px;font-size:10px;font-weight:600;background:#e8f4fc;color:#0066cc;" title="Submitted directly by the member">M</span>':""}
        </td>
        <td class="time-cell">${U(e.created_at)}</td>
        <td>
          <div class="name-cell" title="${m(e.title)}" style="cursor:default;">${m(e.title.length>80?e.title.substring(0,77)+"…":e.title)}</div>
        </td>
        <td>
          ${e.member_name?e.member_profile_url?`<a class="email-cell" href="${e.member_profile_url}" target="_blank" style="color:#0066cc;text-decoration:none;">${m(e.member_name)}</a>`:`<span class="email-cell">${m(e.member_name)}</span>`:""}
        </td>
        <td>
          <select class="form-input" data-task-id="${e.id}" style="padding:4px 8px;font-size:12px;width:auto;">
            ${Object.entries(I).map(([o,i])=>`<option value="${o}" ${e.status===o?"selected":""}>${i}</option>`).join("")}
          </select>
        </td>
        <td class="time-cell">${e.hours!=null?e.hours+"h":""}</td>
        <td>
          <div class="action-btns">
            <button class="action-btn task-detail-btn" data-task-id="${e.id}">
              ${t.length>0?`Comments (${t.length})`:"Comments"}
            </button>
            <button class="action-btn edit-btn task-edit-btn" data-task-id="${e.id}">Edit</button>
          </div>
        </td>
      </tr>
    `}function R(e){const t=e.support_task_comments||[],o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`
      <div class="modal" style="max-width:620px;">
        <div class="modal-header">
          <div>
            <span class="status ${e.category}" style="margin-bottom:6px;display:inline-block;">${C[e.category]||e.category}</span>
            ${e.source==="member"?'<span style="margin:0 0 6px 6px;display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;background:#e8f4fc;color:#0066cc;" title="Submitted directly by the member via /profile/support">Member submitted</span>':""}
            <h3 class="modal-title" style="margin-top:6px;">${m(e.title)}</h3>
          </div>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          ${e.description?`
            <div class="form-field">
              <div class="form-label">Description</div>
              <div style="font-size:13px;line-height:1.7;color:#333;white-space:pre-wrap;">${m(e.description)}</div>
            </div>
          `:""}
          ${e.notes?`
            <div class="form-field">
              <div class="form-label">Notes</div>
              <div style="font-size:13px;line-height:1.7;color:#555;white-space:pre-wrap;">${m(e.notes)}</div>
            </div>
          `:""}
          ${e.member_note?`
            <div class="form-field">
              <div class="form-label">Message to member</div>
              <div style="font-size:13px;line-height:1.7;color:#333;white-space:pre-wrap;">${m(e.member_note)}</div>
            </div>
          `:""}
          ${e.member_name?`
            <div class="form-field">
              <div class="form-label">Member</div>
              <div style="font-size:13px;">
                ${e.member_profile_url?`<a href="${e.member_profile_url}" target="_blank" style="color:#0066cc;">${m(e.member_name)}</a>`:m(e.member_name)}
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
                    <div class="comment-meta">${m(r.author)} &middot; ${U(r.created_at)}</div>
                    <div class="comment-text">${m(r.body)}</div>
                    ${r.image_url?`<img src="${m(r.image_url)}" style="max-width:100%;border-radius:4px;margin-top:8px;display:block;" loading="lazy">`:""}
                  </div>
                </div>
              `).join("")}
            </div>
            ${t.length<5?`
              <div class="comment-input-row" style="margin-top:16px;">
                <textarea class="form-input" id="task-comment-input" placeholder="${e.source==="member"?`Reply to ${m(e.member_name||"member")}...`:"Add a comment..."}" style="min-height:70px;resize:none;flex:1;"></textarea>
                <div style="margin-top:8px;">
                  <label style="font-size:12px;color:#666;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
                    <input type="file" id="task-comment-image" accept="image/*" style="display:none;">
                    <span style="padding:4px 8px;border:1px solid #ddd;border-radius:4px;background:#fafafa;">Attach screenshot</span>
                    <span id="task-comment-image-name" style="color:#888;"></span>
                  </label>
                </div>
              </div>
              <div style="font-size:11px;color:#999;margin-top:6px;">
                ${e.source==="member"&&e.submitted_email?`Sent directly to ${m(e.submitted_email)} (cc: hello@mtnsmade.com.au)`:"Internal note only: emails hello@mtnsmade.com.au, not the member."}
              </div>
            `:'<div style="font-size:12px;color:#999;margin-top:8px;">Maximum 5 comments reached.</div>'}
          </div>
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="td-close">Close</button>
          ${t.length<5?'<button class="admin-btn primary" id="td-add-comment">Add Comment</button>':""}
        </div>
      </div>
    `,document.body.appendChild(o),o.querySelector(".modal-close").addEventListener("click",()=>o.remove()),o.querySelector("#td-close").addEventListener("click",()=>o.remove()),o.addEventListener("click",r=>{r.target===o&&o.remove()});const i=o.querySelector("#task-comment-image");i&&i.addEventListener("change",()=>{var a;const r=o.querySelector("#task-comment-image-name");r&&(r.textContent=((a=i.files[0])==null?void 0:a.name)||"")});const n=o.querySelector("#td-add-comment");n&&n.addEventListener("click",async()=>{var l;const r=o.querySelector("#task-comment-input"),a=r==null?void 0:r.value.trim();if(!a)return;n.disabled=!0,n.textContent="Saving...";let s=null;if((l=i==null?void 0:i.files)!=null&&l[0]){const d=i.files[0],c=d.name.split(".").pop()||"png",p=`${e.id}/${Date.now()}.${c}`,{error:u}=await b.storage.from("support-screenshots").upload(p,d,{contentType:d.type});if(!u){const{data:f}=b.storage.from("support-screenshots").getPublicUrl(p);s=(f==null?void 0:f.publicUrl)||null}}await b.from("support_task_comments").insert({task_id:e.id,author:"Racket",body:a,image_url:s}),o.remove(),await k("comment",e,a),await S()})}async function Ce(e,t,o){await b.from("support_tasks").update({status:t}).eq("id",e),t==="feedback_needed"?await k("feedback_needed",o||{id:e,title:"(task)",status:t}):t==="complete"?await k("complete",o||{id:e,title:"(task)",status:t}):t==="in_progress"?await k("in_progress",o||{id:e,title:"(task)",status:t}):t==="stalled"&&await k("stalled",o||{id:e,title:"(task)",status:t})}async function k(e,t,o){const i=C[t.category]||t.category||"",n=t.member_name?`
Member: ${t.member_name}${t.member_profile_url?" — "+t.member_profile_url:""}`:"";let r,a,s,l,d;const c="https://www.mtnsmade.com.au/admin/dashboard";if(e==="created")r="contact@racket.net.au",a=`New MTNS MADE support task: ${t.title}`,s=`A new support task has been logged.

Category: ${i}${n}
Task: ${t.title}
${t.description?`
`+t.description:""}

View on dashboard: ${c}`;else if(e==="comment")if(t.source==="member"&&t.submitted_email){const p=(t.member_name||"").split(" ")[0]||"there";r=t.submitted_email,l="hello@mtnsmade.com.au",a=`Re: ${t.title}`,s=`Hi ${p},

${o}

If you have any further questions, just reply to this email.

Thanks,
The MTNS MADE Team`,d=`Hi ${m(p)},<br><br>${m(o).replace(/\n/g,"<br>")}<br><br>If you have any further questions, just reply to this email.<br><br>Thanks,<br>The MTNS MADE Team`}else r="hello@mtnsmade.com.au",a=`New comment on: ${t.title}`,s=`Racket has added a comment to a support task.

Category: ${i}${n}
Task: ${t.title}

Comment:
${o}

View on dashboard: ${c}`;else if(e==="in_progress")r="hello@mtnsmade.com.au",a=`Task in progress: ${t.title}`,s=`A support task is now in progress.

Category: ${i}${n}
Task: ${t.title}
${t.notes?`
Notes:
`+t.notes:""}

View on dashboard: ${c}`;else if(e==="feedback_needed")r="hello@mtnsmade.com.au",a=`Feedback needed: ${t.title}`,s=`A support task requires your feedback.

Category: ${i}${n}
Task: ${t.title}
${t.description?`
`+t.description:""}

View on dashboard: ${c}`;else if(e==="complete")r="hello@mtnsmade.com.au",a=`Task complete: ${t.title}`,s=`A support task has been marked complete.

Category: ${i}${n}
Task: ${t.title}

View on dashboard: ${c}`;else if(e==="stalled")r="hello@mtnsmade.com.au",a=`Task stalled: ${t.title}`,s=`A support task has been marked stalled.

Category: ${i}${n}
Task: ${t.title}
${t.notes?`
Notes:
`+t.notes:""}

View on dashboard: ${c}`;else return;try{if(await fetch(`${v}/functions/v1/send-email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:r,cc:l,subject:a,text:s,html:d||s.replace(/\n/g,"<br>")})}),e==="complete"&&t.category==="member_support"){let p=t.submitted_email||null,u=t.member_name;if(!p&&t.member_id){const f=await h("member-email",{id:t.member_id}).catch(()=>null);p=(f==null?void 0:f.email)||null,u=(f==null?void 0:f.name)||u}if(p){const f=(u==null?void 0:u.split(" ")[0])||"there",_=`Your support request has been resolved: ${t.title}`,y=(t.member_note||"").trim(),N=y?`

${y}`:"",D=y?`<br><br>${m(y).replace(/\n/g,"<br>")}`:"",Ae=`Hi ${f},

We wanted to let you know that your support request has been resolved.

Request: ${t.title}${N}

If you have any further questions or need anything else, feel free to reach out at hello@mtnsmade.com.au.

Thanks,
The MTNS MADE Team`,Ne=`Hi ${m(f)},<br><br>We wanted to let you know that your support request has been resolved.<br><br>Request: ${m(t.title)}${D}<br><br>If you have any further questions or need anything else, feel free to reach out at hello@mtnsmade.com.au.<br><br>Thanks,<br>The MTNS MADE Team`;await fetch(`${v}/functions/v1/send-email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:p,cc:"hello@mtnsmade.com.au",subject:_,text:Ae,html:Ne})})}}}catch(p){console.error("sendTaskNotification error:",p)}}let L=null;async function H(e){return!e||e.length<2?[]:await h("search-members",{query:e}).catch(()=>null)||[]}function Le(){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`
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
    `,document.body.appendChild(e);const t=e.querySelector("#st-category"),o=e.querySelector("#st-member-field"),i=()=>{o.style.display=t.value==="member_support"?"block":"none"};i(),t.addEventListener("change",i);const n=e.querySelector("#st-member-search"),r=e.querySelector("#st-member-suggestions");n.addEventListener("input",()=>{clearTimeout(L);const a=n.value.trim();if(a.length<2){r.style.display="none";return}L=setTimeout(async()=>{const s=await H(a);if(s.length===0){r.style.display="none";return}r.innerHTML=s.map(l=>`<div class="member-suggestion-item" data-id="${l.id}" data-name="${m(l.name||"")}" data-slug="${l.slug||""}">
            ${m(l.name||l.id)}
            ${l.business_name?`<span style="display:block;font-size:11px;color:#888;margin-top:1px;">${m(l.business_name)}</span>`:""}
          </div>`).join(""),r.style.display="block",r.querySelectorAll(".member-suggestion-item").forEach(l=>{l.addEventListener("click",()=>{e.querySelector("#st-member-id").value=l.dataset.id,e.querySelector("#st-member-name").value=l.dataset.name,e.querySelector("#st-member-url").value=l.dataset.slug?`${w}/members/${l.dataset.slug}`:"",n.value=l.dataset.name,r.style.display="none"})})},250)}),e.querySelector(".modal-close").addEventListener("click",()=>e.remove()),e.querySelector("#st-cancel").addEventListener("click",()=>e.remove()),e.addEventListener("click",a=>{a.target===e&&e.remove()}),e.querySelector("#st-save").addEventListener("click",async()=>{const a=e.querySelector("#st-title").value.trim(),s=e.querySelector("#st-category").value;if(!a){alert("Please enter a task title.");return}const l=e.querySelector("#st-save");l.disabled=!0,l.textContent="Saving...";const d=e.querySelector("#st-member-id").value,c={category:s,title:a,description:e.querySelector("#st-description").value.trim()||null,status:"not_started",hours:null,member_id:d||null,member_name:e.querySelector("#st-member-name").value||null,member_profile_url:e.querySelector("#st-member-url").value||null},{data:p,error:u}=await b.from("support_tasks").insert(c).select().single();if(u){alert("Error creating task: "+u.message),l.disabled=!1,l.textContent="Create Task";return}e.remove(),await k("created",p),await S()})}function je(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
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
            <input type="text" class="form-input" id="et-title" value="${m(e.title)}">
          </div>
          <div class="form-field">
            <label class="form-label">Member</label>
            <div class="member-search-wrap">
              <input type="text" class="form-input" id="et-member-search" placeholder="Search by name or trading name..." autocomplete="off" value="${m(e.member_name||"")}">
              <div class="member-suggestions" id="et-member-suggestions" style="display:none;"></div>
            </div>
            <input type="hidden" id="et-member-id" value="${m(e.member_id||"")}">
            <input type="hidden" id="et-member-name" value="${m(e.member_name||"")}">
            <input type="hidden" id="et-member-url" value="${m(e.member_profile_url||"")}">
          </div>
          <div class="form-field">
            <label class="form-label">Description</label>
            <textarea class="form-input" id="et-description" style="min-height:80px;">${m(e.description||"")}</textarea>
          </div>
          <div class="form-field">
            <label class="form-label">Notes (internal only, not sent to the member)</label>
            <textarea class="form-input" id="et-notes" style="min-height:60px;" placeholder="Internal notes, resolution summary...">${m(e.notes||"")}</textarea>
          </div>
          <div class="form-field">
            <label class="form-label">Message to member (sent with the resolution email)</label>
            <textarea class="form-input" id="et-member-note" style="min-height:60px;" placeholder="Optional. What you did, or what they need to do next...">${m(e.member_note||"")}</textarea>
            <div style="font-size:11px;color:#999;margin-top:4px;">Emailed to the member when a Member Support task is marked Complete. Leave blank to send the standard message.</div>
          </div>
          <div class="form-field">
            <label class="form-label">Status</label>
            <select class="form-input" id="et-status">
              ${Object.entries(I).map(([n,r])=>`<option value="${n}" ${e.status===n?"selected":""}>${r}</option>`).join("")}
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
    `,document.body.appendChild(t);const o=t.querySelector("#et-member-search"),i=t.querySelector("#et-member-suggestions");o.addEventListener("input",()=>{clearTimeout(L);const n=o.value.trim();if(n.length<2){i.style.display="none";return}L=setTimeout(async()=>{const r=await H(n);if(r.length===0){i.style.display="none";return}i.innerHTML=r.map(a=>`<div class="member-suggestion-item" data-id="${a.id}" data-name="${m(a.name||"")}" data-slug="${a.slug||""}">
            ${m(a.name||a.id)}
            ${a.business_name?`<span style="display:block;font-size:11px;color:#888;margin-top:1px;">${m(a.business_name)}</span>`:""}
          </div>`).join(""),i.style.display="block",i.querySelectorAll(".member-suggestion-item").forEach(a=>{a.addEventListener("click",()=>{t.querySelector("#et-member-id").value=a.dataset.id,t.querySelector("#et-member-name").value=a.dataset.name,t.querySelector("#et-member-url").value=a.dataset.slug?`${w}/members/${a.dataset.slug}`:"",o.value=a.dataset.name,i.style.display="none"})})},250)}),t.querySelector(".modal-close").addEventListener("click",()=>t.remove()),t.querySelector("#et-cancel").addEventListener("click",()=>t.remove()),t.addEventListener("click",n=>{n.target===t&&t.remove()}),t.querySelector("#et-delete").addEventListener("click",async()=>{if(!confirm(`Delete "${e.title}"? This cannot be undone.`))return;const n=t.querySelector("#et-delete");n.disabled=!0,n.textContent="Deleting...",await b.from("support_task_comments").delete().eq("task_id",e.id),await b.from("support_tasks").delete().eq("id",e.id),t.remove(),await S()}),t.querySelector("#et-save").addEventListener("click",async()=>{const n=t.querySelector("#et-save"),r=t.querySelector("#et-status").value,a=r!==e.status;n.disabled=!0,n.textContent="Saving...";const s=t.querySelector("#et-hours").value,l=t.querySelector("#et-member-name").value||t.querySelector("#et-member-search").value.trim()||null,d={category:t.querySelector("#et-category").value,title:t.querySelector("#et-title").value.trim(),description:t.querySelector("#et-description").value.trim()||null,notes:t.querySelector("#et-notes").value.trim()||null,member_note:t.querySelector("#et-member-note").value.trim()||null,status:r,hours:s?parseFloat(s):null,member_id:t.querySelector("#et-member-id").value||null,member_name:l,member_profile_url:t.querySelector("#et-member-url").value||null},{error:c}=await b.from("support_tasks").update(d).eq("id",e.id);if(c){alert("Error saving: "+c.message),n.disabled=!1,n.textContent="Save Changes";return}if(a){const p=["feedback_needed","complete","in_progress","stalled"].includes(r)?r:null;await k(p,{...e,...d})}t.remove(),await S()})}function U(e){return e?new Date(e).toLocaleDateString("en-AU",{day:"2-digit",month:"2-digit",year:"2-digit"}):""}function m(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}async function g(e){const t=e.querySelector("#refresh-btn");t&&(t.disabled=!0,t.textContent="Loading...");try{q=await z(),O(e,q)}catch(o){console.error("Error refreshing dashboard:",o),t&&(t.disabled=!1,t.textContent="Refresh")}}async function F(){const e=document.querySelector(".dashboard-feed");if(!e){console.warn("Could not find .dashboard-feed container");return}if(typeof window.supabase>"u"){e.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error: Supabase library not loaded</div>
          </div>
        </div>
      `;return}if(b=window.supabase.createClient(v,j),!document.querySelector("#admin-dashboard-styles")){const t=document.createElement("style");t.id="admin-dashboard-styles",t.textContent=W,document.head.appendChild(t)}e.innerHTML=`
      <div class="admin-dashboard">
        <div class="admin-loading">
          <div class="loader"></div>
          <div class="loading-text">Loading system data...</div>
        </div>
      </div>
    `;try{for(let t=0;t<20&&!window.$memberstackDom;t++)await new Promise(o=>setTimeout(o,250));await h("whoami"),q=await z(),O(e,q)}catch(t){if(t instanceof E){e.innerHTML=`
          <div class="admin-dashboard">
            <div class="admin-loading">
              <div class="loading-text">Staff login required</div>
              <div style="color: #666; font-size: 11px; margin-top: 8px;">Log in with your MTNS MADE account that has admin access, then reload this page.</div>
            </div>
          </div>
        `;return}console.error("Error loading dashboard:",t),e.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error loading dashboard</div>
            <div style="color: #666; font-size: 11px; margin-top: 8px;">${t.message}</div>
          </div>
        </div>
      `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",F):F()})();
