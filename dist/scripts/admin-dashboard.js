(function(){console.log("Admin dashboard v2 loaded");const g="https://epszwomtxkpjegbjbixr.supabase.co",b="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",x="https://www.mtnsmade.com.au";let d=null,$=null,k=[];const P=`
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

    /* Support Tracker */
    .support-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .support-filters {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .filter-pill {
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .filter-pill:hover { background: #e8e8e8; }
    .filter-pill.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

    .task-category {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }

    .task-category.member_support  { background: #fff3e0; color: #e65100; }
    .task-category.website_bug     { background: #fce4ec; color: #c62828; }
    .task-category.feature_request { background: #e8f5e9; color: #2e7d32; }

    .task-status {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }

    .task-status.not_started   { background: #f5f5f5; color: #666; }
    .task-status.in_progress   { background: #fff8e1; color: #f57f17; }
    .task-status.feedback_needed { background: #e3f2fd; color: #1565c0; }
    .task-status.complete      { background: #e8f5e9; color: #2e7d32; }
    .task-status.stalled       { background: #fce4ec; color: #c62828; }

    .task-title-cell { font-weight: 500; font-size: 13px; }
    .task-desc { font-size: 12px; color: #666; margin-top: 3px; }
    .task-member-link { color: #1a1a1a; text-decoration: underline; font-size: 12px; }

    .status-select {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 3px 6px;
      font-size: 12px;
      font-family: inherit;
      cursor: pointer;
      background: #fff;
    }

    .task-row-expand {
      background: #fafafa;
    }

    .task-detail-panel {
      padding: 16px 20px;
      border-top: 1px solid #f0f0f0;
    }

    .comments-section { margin-top: 16px; }
    .comments-title { font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }

    .comment-item {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
    }

    .comment-author-badge {
      background: #1a1a1a;
      color: #fff;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .comment-author-badge.hannah { background: #6366f1; }

    .comment-body { flex: 1; }
    .comment-meta { font-size: 11px; color: #999; margin-bottom: 3px; }
    .comment-text { font-size: 13px; line-height: 1.5; }

    .comment-input-row {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      align-items: flex-end;
    }

    .comment-textarea {
      flex: 1;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 8px 10px;
      font-family: inherit;
      font-size: 13px;
      resize: none;
      min-height: 60px;
    }

    .comment-textarea:focus { outline: none; border-color: #1a1a1a; }

    .support-empty { padding: 40px; text-align: center; color: #aaa; font-size: 14px; }

    .member-search-wrap { position: relative; }
    .member-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-top: none;
      border-radius: 0 0 6px 6px;
      z-index: 100;
      max-height: 200px;
      overflow-y: auto;
    }

    .member-suggestion-item {
      padding: 8px 12px;
      font-size: 13px;
      cursor: pointer;
    }

    .member-suggestion-item:hover { background: #f5f5f5; }

    @media (max-width: 768px) {
      .support-toolbar { flex-direction: column; align-items: flex-start; }
    }
  `;function h(e){if(!e)return"--";const t=new Date(e),i=Math.floor((new Date-t)/1e3);return i<60?"now":i<3600?`${Math.floor(i/60)}m`:i<86400?`${Math.floor(i/3600)}h`:i<604800?`${Math.floor(i/86400)}d`:t.toLocaleDateString("en-AU",{day:"2-digit",month:"short"})}function I(){return new Date().toLocaleString("en-AU",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).toUpperCase()}function T(e){const t=[];return e.profile_image_url||t.push("Profile Image"),e.header_image_url||t.push("Header Image"),(!e.bio||e.bio.length<50)&&t.push("Bio"),e.suburb_id||t.push("Location"),t}function D(e,t){const a=e.first_name||e.name||"there",i=t.length>0?`

To complete your profile, you'll need:
${t.map(s=>`- ${s}`).join(`
`)}`:"";return`Hi ${a},

Thanks for being part of MTNS MADE! We noticed your profile isn't quite complete yet.

A complete profile helps other creatives find you in the directory and shows off your amazing work.${i}

Complete your profile here: ${x}/profile/start

Let us know if you need any help!

MTNS MADE Team`}async function q(){const[e,t,a,i,s,o,n,r,l,c,p,_]=await Promise.all([O(),R(),B(),H(),W(),J(),V(),Y(),G(),F(),K(),U()]);return k=_,{recentMembers:e,memberStats:t,incompleteProfiles:a,failedSignups:i,recentEvents:s,eventStats:o,recentOpportunities:n,opportunityStats:r,recentProjects:l,messageStats:c,recentActivity:p,membershipTypes:_,loadedAt:new Date}}async function O(){const{data:e,error:t}=await d.from("members").select(`
        id, memberstack_id, name, email, first_name, last_name, slug,
        subscription_status, profile_complete, webflow_id,
        profile_image_url, header_image_url, bio, suburb_id,
        membership_type_id, membership_types(id, name),
        created_at, updated_at
      `).neq("is_deleted",!0).order("created_at",{ascending:!1}).limit(20);return t?(console.error("Error loading recent members:",t),[]):e||[]}async function R(){const{data:e}=await d.from("members").select("id, subscription_status, profile_complete, webflow_id").neq("is_deleted",!0),t=(e==null?void 0:e.length)||0,a=(e==null?void 0:e.filter(r=>r.subscription_status==="active").length)||0,i=(e==null?void 0:e.filter(r=>r.subscription_status==="lapsed").length)||0,s=(e==null?void 0:e.filter(r=>r.profile_complete).length)||0,o=(e==null?void 0:e.filter(r=>r.webflow_id).length)||0,n=(e==null?void 0:e.filter(r=>r.profile_complete&&!r.webflow_id&&r.subscription_status==="active").length)||0;return{total:t,active:a,lapsed:i,complete:s,synced:o,pendingSync:n}}async function U(){const{data:e,error:t}=await d.from("membership_types").select("id, name").order("name");return t?(console.error("Error loading membership types:",t),[]):e||[]}async function F(){try{const e=new Date,t=new Date(e.getFullYear(),e.getMonth(),1).toISOString(),{data:a}=await d.from("messages").select("id, is_read, created_at"),{data:i}=await d.from("messages").select("id").gte("created_at",t),s=(a==null?void 0:a.length)||0,o=(a==null?void 0:a.filter(r=>!r.is_read).length)||0,n=(i==null?void 0:i.length)||0;return{total:s,unread:o,thisMonth:n}}catch(e){return console.error("Error loading message stats:",e),{total:0,unread:0,thisMonth:0}}}async function B(){const{data:e,error:t}=await d.from("members").select(`
        id, memberstack_id, name, email, first_name, slug, subscription_status,
        profile_complete, profile_reminder_sent_at, created_at,
        profile_image_url, header_image_url, bio, suburb_id
      `).eq("profile_complete",!1).eq("subscription_status","active").neq("is_deleted",!0).order("created_at",{ascending:!0});return t?(console.error("Error loading incomplete profiles:",t),[]):e||[]}async function H(){const{data:e,error:t}=await d.from("members").select(`
        id, memberstack_id, name, email, first_name, slug,
        subscription_status, profile_complete, profile_reminder_sent_at, created_at
      `).not("subscription_status","in",'("active","lapsed","deleted")').neq("is_deleted",!0).order("created_at",{ascending:!1}).limit(30);return t?(console.error("Error loading failed signups:",t),[]):e||[]}async function W(){const{data:e,error:t}=await d.from("events").select("id, name, slug, memberstack_id, member_contact_email, is_draft, is_archived, webflow_id, created_at").order("is_draft",{ascending:!1}).order("created_at",{ascending:!1}).limit(50);return t?(console.error("Error loading recent events:",t),[]):e||[]}async function J(){const{data:e}=await d.from("events").select("id, is_draft, is_archived, webflow_id"),t=(e==null?void 0:e.length)||0,a=(e==null?void 0:e.filter(s=>s.is_draft&&!s.is_archived).length)||0,i=(e==null?void 0:e.filter(s=>!s.is_draft&&!s.is_archived).length)||0;return{total:t,pending:a,published:i}}async function V(){const{data:e,error:t}=await d.from("opportunities").select("id, name, slug, memberstack_id, member_contact_email, opportunity_type, is_draft, is_archived, webflow_id, created_at").order("is_draft",{ascending:!1}).order("created_at",{ascending:!1}).limit(50);if(t)return console.error("Error loading recent opportunities:",t),[];const a=e||[],i=[...new Set(a.map(s=>s.memberstack_id).filter(Boolean))];if(i.length>0){const{data:s}=await d.from("members").select("memberstack_id, first_name, last_name, name").in("memberstack_id",i);if(s){const o=Object.fromEntries(s.map(n=>[n.memberstack_id,n]));a.forEach(n=>{const r=o[n.memberstack_id];r&&(n.member_name=[r.first_name,r.last_name].filter(Boolean).join(" ")||r.name||null)})}}return a}async function Y(){const{data:e}=await d.from("opportunities").select("id, is_draft, is_archived"),t=(e==null?void 0:e.length)||0,a=(e==null?void 0:e.filter(s=>s.is_draft&&!s.is_archived).length)||0,i=(e==null?void 0:e.filter(s=>!s.is_draft&&!s.is_archived).length)||0;return{total:t,pending:a,published:i}}async function G(){const{data:e,error:t}=await d.from("projects").select(`
        id, name, slug, member_id, webflow_id, is_draft, is_deleted,
        created_at, updated_at
      `).eq("is_deleted",!1).order("updated_at",{ascending:!1}).limit(15);return t?(console.error("Error loading recent projects:",t),[]):e||[]}async function K(){const{data:e,error:t}=await d.from("activity_log").select(`
        id, member_id, memberstack_id, activity_type, description,
        entity_type, entity_id, entity_name,
        member_webflow_url, entity_webflow_url, created_at
      `).order("created_at",{ascending:!1}).limit(50);if(t)return console.error("Error loading recent activity:",t),[];const a=[...new Set(e.filter(s=>s.member_id).map(s=>s.member_id))];let i={};if(a.length>0){const{data:s}=await d.from("members").select("id, name, first_name, last_name, profile_image_url").in("id",a);s&&s.forEach(o=>{i[o.id]={name:o.name||`${o.first_name||""} ${o.last_name||""}`.trim()||"Unknown Member",profile_image_url:o.profile_image_url||null}})}return e.map(s=>{var o,n;return{...s,member_name:s.member_id&&((o=i[s.member_id])==null?void 0:o.name)||"Unknown Member",member_profile_image:s.member_id&&((n=i[s.member_id])==null?void 0:n.profile_image_url)||null}})}function Q(e){const t=T(e),a=D(e,t),i=document.createElement("div");i.className="modal-overlay",i.innerHTML=`
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
            <textarea class="form-input" id="modal-body">${a}</textarea>
            <div class="form-hint">Edit the message above as needed</div>
          </div>
          ${t.length>0?`
            <div class="form-field">
              <label class="form-label">Missing Fields Detected</label>
              <div class="missing-fields">
                ${t.map(s=>`<span class="missing-field">${s}</span>`).join("")}
              </div>
            </div>
          `:""}
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="modal-cancel">Cancel</button>
          <button class="admin-btn primary" id="modal-send">Send Email</button>
        </div>
      </div>
    `,document.body.appendChild(i),i.querySelector(".modal-close").addEventListener("click",()=>i.remove()),i.querySelector("#modal-cancel").addEventListener("click",()=>i.remove()),i.addEventListener("click",s=>{s.target===i&&i.remove()}),i.querySelector("#modal-send").addEventListener("click",async()=>{const s=i.querySelector("#modal-to").value,o=i.querySelector("#modal-subject").value,n=i.querySelector("#modal-body").value;if(!s){alert("No email address available for this member");return}const r=i.querySelector("#modal-send");r.disabled=!0,r.textContent="Sending...";try{const c=await(await fetch(`${g}/functions/v1/send-email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:s,subject:o,text:n,html:n.replace(/\n/g,"<br>")})})).json();if(c.success){await d.from("members").update({profile_reminder_sent_at:new Date().toISOString()}).eq("id",e.id),alert("Email sent successfully!"),i.remove();const p=document.querySelector(".dashboard-feed");p&&y(p)}else alert("Failed to send email: "+(c.error||"Unknown error")),r.disabled=!1,r.textContent="Send Email"}catch(l){console.error("Error sending email:",l),alert("Error sending email. Check console for details."),r.disabled=!1,r.textContent="Send Email"}})}function X(e,t,a){var o;const i=((o=k.find(n=>n.id===a))==null?void 0:o.name)||"Not set",s=document.createElement("div");s.className="modal-overlay",s.innerHTML=`
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
              ${k.map(n=>`
                <option value="${n.id}" ${n.id===a?"disabled":""}>
                  ${n.name}${n.id===a?" (current)":""}
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
    `,document.body.appendChild(s),s.querySelector(".modal-close").addEventListener("click",()=>s.remove()),s.querySelector("#modal-cancel").addEventListener("click",()=>s.remove()),s.addEventListener("click",n=>{n.target===s&&s.remove()}),s.querySelector("#modal-save").addEventListener("click",async()=>{var _;const n=s.querySelector("#modal-membership-type").value,r=s.querySelector("#modal-skip-billing").checked;if(!n){alert("Please select a new membership type");return}const l=((_=k.find(f=>f.id===n))==null?void 0:_.name)||"Unknown",c=r?`Change ${t}'s type from "${i}" to "${l}"?

This will update the label only (no billing change).`:`Change ${t}'s type from "${i}" to "${l}"?

This WILL change their Stripe subscription and billing.`;if(!confirm(c))return;const p=s.querySelector("#modal-save");p.disabled=!0,p.textContent="Updating Memberstack...";try{const f=await fetch(`${g}/functions/v1/admin-update-member`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({memberId:e,newMembershipTypeId:n,skipPlanChange:r})}),v=await f.json();if(!f.ok)throw new Error(v.error||"Update failed");let N=`Membership type updated!

${v.change.from} → ${v.change.to}`;v.results.warnings&&v.results.warnings.length>0&&(N+=`

Warnings:
- ${v.results.warnings.join(`
- `)}`),alert(N),s.remove();const z=document.querySelector(".dashboard-feed");z&&y(z)}catch(f){console.error("Error updating membership type:",f),alert("Error updating membership type: "+f.message),p.disabled=!1,p.textContent="Update Membership"}})}async function Z(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
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
    `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",()=>t.remove()),t.addEventListener("click",n=>{n.target===t&&t.remove()});const{data:a,error:i}=await d.from("events").select("*").eq("id",e).single();if(i||!a){t.querySelector(".modal-body").innerHTML='<div style="padding: 24px; color: #dc3545;">Failed to load event details.</div>';return}const s=n=>n?new Date(n).toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):"--",o=[a.location_name,a.location_address].filter(Boolean).join(", ")||"--";t.querySelector(".modal-title").textContent=a.name||"Event Preview",t.querySelector(".modal-body").innerHTML=`
      ${a.feature_image_url?`<img src="${a.feature_image_url}" class="event-preview-image" alt="${a.name}">`:""}
      <div class="preview-grid">
        <div class="preview-field">
          <div class="preview-label">Start</div>
          <div class="preview-value">${s(a.date_start)}</div>
        </div>
        <div class="preview-field">
          <div class="preview-label">End</div>
          <div class="preview-value">${s(a.date_end)}</div>
        </div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Location</div>
        <div class="preview-value">${o}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Description</div>
        <div class="preview-value">${a.description||"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">RSVP / Tickets</div>
        <div class="preview-value">${a.rsvp_link?`<a href="${a.rsvp_link}" target="_blank">${a.rsvp_link}</a>`:"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Submitted by</div>
        <div class="preview-value">${a.member_contact_email||"--"}</div>
      </div>
    `}async function ee(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
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
    `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",()=>t.remove()),t.addEventListener("click",o=>{o.target===t&&t.remove()});const{data:a,error:i}=await d.from("opportunities").select("*").eq("id",e).single();if(i||!a){t.querySelector(".modal-body").innerHTML='<div style="padding: 24px; color: #dc3545;">Failed to load opportunity details.</div>';return}const s=o=>o?new Date(o).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"}):"--";t.querySelector(".modal-title").textContent=a.name||"Opportunity Preview",t.querySelector(".modal-body").innerHTML=`
      <div class="preview-grid">
        <div class="preview-field">
          <div class="preview-label">Type</div>
          <div class="preview-value">${a.opportunity_type||"--"}</div>
        </div>
        <div class="preview-field">
          <div class="preview-label">Closes</div>
          <div class="preview-value">${s(a.closing_date)}</div>
        </div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Organisation</div>
        <div class="preview-value">${a.organization||"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Description</div>
        <div class="preview-value">${a.description||"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">How to Apply</div>
        <div class="preview-value">${a.how_to_apply||"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">URL</div>
        <div class="preview-value">${a.opportunity_url?`<a href="${a.opportunity_url}" target="_blank">${a.opportunity_url}</a>`:"--"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Remote</div>
        <div class="preview-value">${a.is_remote?"Yes":"No"}</div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Submitted by</div>
        <div class="preview-value">${a.member_name||a.member_contact_email||"--"}</div>
      </div>
    `}function j(e,t){const a=t.incompleteProfiles.length,i=t.eventStats.pending,s=t.opportunityStats.pending;e.innerHTML=`
      <div class="admin-dashboard">
        <div class="admin-header">
          <h1>MTNS MADE // System Dashboard</h1>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span class="admin-timestamp">Updated: ${I()}</span>
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
          <div class="stat-cell ${a>5?"alert":""}">
            <div class="stat-value">${t.memberStats.complete}/${t.memberStats.total}</div>
            <div class="stat-label">Profiles Complete</div>
          </div>
          <div class="stat-cell">
            <div class="stat-value">${t.messageStats.thisMonth}</div>
            <div class="stat-label">Messages This Month</div>
          </div>
        </div>

        <!-- Issues Section -->
        ${te(t)}

        <!-- Activity Tabs -->
        <div class="admin-section">
          <div class="tabs-container">
            <button class="tab-btn active" data-tab="activity">Activity</button>
            <button class="tab-btn" data-tab="members">Recent Members</button>
            <button class="tab-btn" data-tab="incomplete">Incomplete (${a})</button>
            <button class="tab-btn" data-tab="failed">Failed Signups (${t.failedSignups.length})</button>
            <button class="tab-btn" data-tab="events">Events ${i>0?`(${i})`:""}</button>
            <button class="tab-btn" data-tab="opportunities">Opportunities ${s>0?`(${s})`:""}</button>
            <button class="tab-btn" data-tab="projects">Projects</button>
            <button class="tab-btn" data-tab="support">Support</button>
          </div>

          <div class="tab-content active" id="tab-activity">
            ${le(t.recentActivity)}
          </div>

          <div class="tab-content" id="tab-members">
            ${ae(t.recentMembers)}
          </div>

          <div class="tab-content" id="tab-incomplete">
            ${ie(t.incompleteProfiles)}
          </div>

          <div class="tab-content" id="tab-failed">
            ${oe(t.failedSignups)}
          </div>

          <div class="tab-content" id="tab-events">
            ${se(t.recentEvents,t.eventStats)}
          </div>

          <div class="tab-content" id="tab-opportunities">
            ${ne(t.recentOpportunities,t.opportunityStats)}
          </div>

          <div class="tab-content" id="tab-projects">
            ${re(t.recentProjects)}
          </div>

          <div class="tab-content" id="tab-support">
            <div id="support-tracker-root">Loading...</div>
          </div>
        </div>
      </div>
    `,e.querySelectorAll(".tab-btn").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(n=>n.classList.remove("active")),e.querySelectorAll(".tab-content").forEach(n=>n.classList.remove("active")),o.classList.add("active"),e.querySelector(`#tab-${o.dataset.tab}`).classList.add("active"),o.dataset.tab==="support"&&w()})}),e.querySelector("#refresh-btn").addEventListener("click",()=>y(e)),e.querySelectorAll(".contact-btn").forEach(o=>{o.addEventListener("click",()=>{const n=o.dataset.memberId,r=t.incompleteProfiles.find(l=>l.id===n)||t.recentMembers.find(l=>l.id===n)||t.failedSignups.find(l=>l.id===n);r&&Q(r)})}),e.querySelectorAll(".approve-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=o.dataset.eventId,r=o.dataset.eventName;if(confirm(`Approve event "${r}"?

This will publish the event and notify the member.`)){o.disabled=!0,o.textContent="Approving...";try{const c=await(await fetch(`${g}/functions/v1/manage-event`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b},body:JSON.stringify({eventId:n,action:"approve"})})).json();c.success?(alert(`Event "${r}" has been approved!

The member will be notified and the event will sync to Webflow.`),y(e)):(alert(`Failed to approve event: ${c.error}`),o.disabled=!1,o.textContent="Approve")}catch(l){console.error("Approve error:",l),alert("Error approving event. Please try again."),o.disabled=!1,o.textContent="Approve"}}})}),e.querySelectorAll(".reject-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=o.dataset.eventId,r=o.dataset.eventName,l=prompt(`Reject event "${r}"?

Optionally enter a reason (or leave blank):`);if(l!==null){o.disabled=!0,o.textContent="Rejecting...";try{const p=await(await fetch(`${g}/functions/v1/manage-event`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b},body:JSON.stringify({eventId:n,action:"reject",rejectionReason:l||void 0})})).json();p.success?(alert(`Event "${r}" has been rejected.

The member will be notified.`),y(e)):(alert(`Failed to reject event: ${p.error}`),o.disabled=!1,o.textContent="Reject")}catch(c){console.error("Reject error:",c),alert("Error rejecting event. Please try again."),o.disabled=!1,o.textContent="Reject"}}})}),e.querySelectorAll(".preview-btn").forEach(o=>{o.addEventListener("click",()=>{Z(o.dataset.eventId)})}),e.querySelectorAll(".preview-opp-btn").forEach(o=>{o.addEventListener("click",()=>{ee(o.dataset.oppId)})}),e.querySelectorAll(".approve-opp-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=o.dataset.oppId,r=o.dataset.oppName;if(confirm(`Approve opportunity "${r}"?

This will publish it and notify the member.`)){o.disabled=!0,o.textContent="Approving...";try{const c=await(await fetch(`${g}/functions/v1/manage-opportunity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b},body:JSON.stringify({opportunityId:n,action:"approve"})})).json();c.success?(alert(`Opportunity "${r}" has been approved!

The member will be notified.`),y(e)):(alert(`Failed to approve opportunity: ${c.error}`),o.disabled=!1,o.textContent="Approve")}catch(l){console.error("Opportunity approve error:",l),alert("Error approving opportunity. Please try again."),o.disabled=!1,o.textContent="Approve"}}})}),e.querySelectorAll(".reject-opp-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=o.dataset.oppId,r=o.dataset.oppName,l=prompt(`Reject opportunity "${r}"?

Optionally enter a reason (or leave blank):`);if(l!==null){o.disabled=!0,o.textContent="Rejecting...";try{const p=await(await fetch(`${g}/functions/v1/manage-opportunity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b},body:JSON.stringify({opportunityId:n,action:"reject",rejectionReason:l||void 0})})).json();p.success?(alert(`Opportunity "${r}" has been rejected.

The member will be notified.`),y(e)):(alert(`Failed to reject opportunity: ${p.error}`),o.disabled=!1,o.textContent="Reject")}catch(c){console.error("Opportunity reject error:",c),alert("Error rejecting opportunity. Please try again."),o.disabled=!1,o.textContent="Reject"}}})}),e.querySelectorAll(".edit-btn").forEach(o=>{o.addEventListener("click",()=>{const n=o.dataset.memberId,r=o.dataset.memberName,l=o.dataset.currentType;X(n,r,l)})}),e.querySelectorAll(".delete-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=o.dataset.memberId,r=o.dataset.memberName;if(confirm(`Delete "${r}"?

This will remove them from the dashboard and Webflow directory. This action cannot be undone.`)){o.disabled=!0,o.textContent="Deleting...";try{const{error:l}=await d.from("members").update({is_deleted:!0,subscription_status:"deleted",updated_at:new Date().toISOString()}).eq("id",n);if(l)throw l;alert(`"${r}" has been deleted.`),y(e)}catch(l){console.error("Delete error:",l),alert("Error deleting member. Please try again."),o.disabled=!1,o.textContent="Delete"}}})})}function te(e){const t=[];e.memberStats.pendingSync>0&&t.push({type:"warning",text:"Members pending Webflow sync",count:e.memberStats.pendingSync});const a=e.incompleteProfiles.filter(i=>(Date.now()-new Date(i.created_at))/864e5>7&&!i.profile_reminder_sent_at);return a.length>0&&t.push({type:"info",text:"Incomplete profiles (7+ days, no reminder sent)",count:a.length}),e.eventStats.pending>0&&t.push({type:"info",text:"Events pending review",count:e.eventStats.pending}),e.opportunityStats.pending>0&&t.push({type:"info",text:"Opportunities pending review",count:e.opportunityStats.pending}),e.memberStats.lapsed>0&&t.push({type:"error",text:"Lapsed subscriptions",count:e.memberStats.lapsed}),t.length===0?`
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
    `}function ae(e){return e.length===0?'<div class="empty-state">No members found</div>':`
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
          ${e.map(t=>{var a;return`
            <tr>
              <td>
                <div class="name-cell">${t.name||t.first_name||"No name"}</div>
                <div class="email-cell">${t.email||"--"}</div>
              </td>
              <td>
                <span class="type-cell">${((a=t.membership_types)==null?void 0:a.name)||"Not set"}</span>
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
              <td class="time-cell">${h(t.created_at)}</td>
              <td>
                <div class="action-btns">
                  <button class="action-btn edit-btn" data-member-id="${t.id}" data-member-name="${t.name||t.first_name||"this member"}" data-current-type="${t.membership_type_id||""}">Edit</button>
                  ${t.webflow_id&&t.slug?`
                    <a href="${x}/members/${t.slug}" target="_blank" class="action-btn view-btn">View</a>
                  `:""}
                  <button class="action-btn delete-btn" data-member-id="${t.id}" data-member-name="${t.name||t.first_name||"this member"}">Delete</button>
                </div>
              </td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    `}function ie(e){return e.length===0?'<div class="empty-state">All active members have complete profiles</div>':`
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
          ${e.map(t=>{const a=T(t);return`
              <tr>
                <td>
                  <div class="name-cell">${t.name||t.first_name||"No name"}</div>
                  <div class="email-cell">${t.email||"--"}</div>
                </td>
                <td>
                  <div class="missing-fields">
                    ${a.slice(0,3).map(i=>`<span class="missing-field">${i}</span>`).join("")}
                    ${a.length>3?`<span class="missing-field">+${a.length-3}</span>`:""}
                  </div>
                </td>
                <td class="time-cell">
                  ${t.profile_reminder_sent_at?h(t.profile_reminder_sent_at):"--"}
                </td>
                <td class="time-cell">${h(t.created_at)}</td>
                <td>
                  <div class="action-btns">
                    ${t.profile_reminder_sent_at?`
                      <button class="action-btn contacted" disabled>Contacted</button>
                    `:`
                      <button class="action-btn contact-btn" data-member-id="${t.id}">Contact</button>
                    `}
                    ${t.webflow_id&&t.slug?`
                      <a href="${x}/members/${t.slug}" target="_blank" class="action-btn">View</a>
                    `:""}
                  </div>
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    `}function oe(e){return e.length===0?'<div class="empty-state">No failed signups found</div>':`
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
              <td class="time-cell">${h(t.created_at)}</td>
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
    `}function se(e,t){return`
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
            ${e.map(a=>{let i="draft";return a.is_archived?i="archived":a.is_draft?i="pending":i="published",`
                <tr>
                  <td>
                    <div class="name-cell">${a.name||"Untitled"}</div>
                    <div class="email-cell">${a.member_contact_email||"--"}</div>
                  </td>
                  <td>
                    <span class="status ${i==="published"?"complete":i==="pending"?"pending":"draft"}">
                      ${i}
                    </span>
                  </td>
                  <td>
                    <span class="status ${a.webflow_id?"synced":"pending"}">
                      ${a.webflow_id?"Synced":"--"}
                    </span>
                  </td>
                  <td class="time-cell">${h(a.created_at)}</td>
                  <td>
                    <div class="action-btns">
                      ${i==="pending"?`
                        <button class="action-btn preview-btn" data-event-id="${a.id}">Preview</button>
                        <button class="action-btn approve-btn" data-event-id="${a.id}" data-event-name="${a.name}">Approve</button>
                        <button class="action-btn reject-btn" data-event-id="${a.id}" data-event-name="${a.name}">Reject</button>
                      `:""}
                      ${a.webflow_id&&a.slug?`
                        <a href="${x}/event/${a.slug}" target="_blank" class="action-btn view-btn">View</a>
                      `:""}
                    </div>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      `}
    `}function ne(e,t){return`
      <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; font-size: 11px; color: #666;">
        <span style="margin-right: 24px;"><strong style="color: #f59f00;">${t.pending}</strong> Pending</span>
        <span><strong style="color: #1a1a1a;">${t.published}</strong> Published</span>
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
            ${e.map(a=>{let i="draft";return a.is_archived?i="archived":a.is_draft?i="pending":i="published",`
                <tr>
                  <td>
                    <div class="name-cell">${a.name||"Untitled"}</div>
                    <div class="email-cell">${a.member_contact_email||"--"}</div>
                  </td>
                  <td>
                    <span class="type-cell">${a.opportunity_type||"--"}</span>
                  </td>
                  <td>
                    <span class="status ${i==="published"?"complete":i==="pending"?"pending":"draft"}">
                      ${i}
                    </span>
                  </td>
                  <td class="time-cell">${h(a.created_at)}</td>
                  <td>
                    <div class="action-btns">
                      ${i==="pending"?`
                        <button class="action-btn preview-opp-btn" data-opp-id="${a.id}">Preview</button>
                        <button class="action-btn approve-opp-btn" data-opp-id="${a.id}" data-opp-name="${a.name}">Approve</button>
                        <button class="action-btn reject-opp-btn" data-opp-id="${a.id}" data-opp-name="${a.name}">Reject</button>
                      `:""}
                      ${a.webflow_id&&a.slug?`
                        <a href="${x}/opportunities/${a.slug}" target="_blank" class="action-btn view-btn">View</a>
                      `:""}
                    </div>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      `}
    `}function re(e){return e.length===0?'<div class="empty-state">No projects found</div>':`
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
              <td class="time-cell">${h(t.updated_at)}</td>
              <td>
                ${t.webflow_id&&t.slug?`
                  <a href="${x}/projects/${t.slug}" target="_blank" class="action-btn view-btn">View</a>
                `:"--"}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}function le(e){if(!e||e.length===0)return'<div class="empty-state">No recent activity</div>';const t=i=>i==="member_signup"?{class:"signup",icon:"🎉"}:i==="profile_update"?{class:"profile",icon:"👤"}:i.startsWith("project_")?{class:"project",icon:"📁"}:i.startsWith("event_")?{class:"event",icon:"📅"}:i.startsWith("opportunity_")?{class:"event",icon:"💼"}:i==="subscription_canceled"?{class:"canceled",icon:"🚫"}:i==="subscription_reactivated"?{class:"reactivated",icon:"✅"}:{class:"",icon:"📝"},a=i=>i.activity_type==="member_signup"?null:i.entity_webflow_url?i.entity_webflow_url:i.member_webflow_url?i.member_webflow_url:null;return`
      <div class="activity-feed">
        ${e.map(i=>{const s=t(i.activity_type),o=a(i);return`
            <div class="activity-item">
              ${i.member_profile_image?`
                <div class="activity-avatar">
                  <img src="${i.member_profile_image}" alt="${i.member_name}">
                </div>
              `:`
                <div class="activity-icon ${s.class}">${s.icon}</div>
              `}
              <div class="activity-content">
                <div class="activity-text">
                  <strong>${i.member_name}</strong> ${i.description}
                </div>
                <div class="activity-meta">
                  <span class="activity-time">${h(i.created_at)}</span>
                </div>
              </div>
              <div class="activity-action">
                ${o?`
                  <a href="${o}" target="_blank" class="action-btn">View</a>
                `:""}
              </div>
            </div>
          `}).join("")}
      </div>
    `}const M={member_support:"Member Support",website_bug:"Website Bug",feature_request:"Feature Request"},E={not_started:"Not Started",in_progress:"In Progress",feedback_needed:"Feedback Needed",complete:"Complete",stalled:"Stalled"};let m={category:"all",status:"all"};async function de(){const{data:e,error:t}=await d.from("support_tasks").select("*, support_task_comments(*)").order("created_at",{ascending:!1});return t?(console.error("loadSupportTasks:",t),[]):((e||[]).forEach(a=>{var i;return(i=a.support_task_comments)==null?void 0:i.sort((s,o)=>new Date(s.created_at)-new Date(o.created_at))}),e||[])}async function w(){const e=document.getElementById("support-tracker-root");if(!e)return;e.innerHTML='<div class="support-empty">Loading...</div>';const t=await de();ce(e,t)}function ce(e,t){var i;const a=t.filter(s=>{const o=m.category==="all"||s.category===m.category,n=m.status==="all"||s.status===m.status;return o&&n});e.innerHTML=`
      <div class="support-toolbar">
        <div class="support-filters">
          <span class="filter-pill ${m.category==="all"?"active":""}" data-cat="all">All</span>
          <span class="filter-pill ${m.category==="member_support"?"active":""}" data-cat="member_support">Member Support</span>
          <span class="filter-pill ${m.category==="website_bug"?"active":""}" data-cat="website_bug">Website Bug</span>
          <span class="filter-pill ${m.category==="feature_request"?"active":""}" data-cat="feature_request">Feature Request</span>
          <span style="width:1px;background:#e0e0e0;margin:0 4px;"></span>
          <span class="filter-pill ${m.status==="all"?"active":""}" data-status="all">Any Status</span>
          <span class="filter-pill ${m.status==="not_started"?"active":""}" data-status="not_started">Not Started</span>
          <span class="filter-pill ${m.status==="in_progress"?"active":""}" data-status="in_progress">In Progress</span>
          <span class="filter-pill ${m.status==="feedback_needed"?"active":""}" data-status="feedback_needed">Feedback Needed</span>
          <span class="filter-pill ${m.status==="complete"?"active":""}" data-status="complete">Complete</span>
          <span class="filter-pill ${m.status==="stalled"?"active":""}" data-status="stalled">Stalled</span>
        </div>
        <button class="admin-btn primary" id="new-task-btn">+ New Task</button>
      </div>

      ${a.length===0?'<div class="support-empty">No tasks yet.</div>':`<table class="admin-table" id="support-table">
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
              ${a.map(s=>pe(s)).join("")}
            </tbody>
          </table>`}
    `,e.querySelectorAll("[data-cat]").forEach(s=>{s.addEventListener("click",()=>{m.category=s.dataset.cat,w()})}),e.querySelectorAll("[data-status]").forEach(s=>{s.addEventListener("click",()=>{m.status=s.dataset.status,w()})}),(i=e.querySelector("#new-task-btn"))==null||i.addEventListener("click",()=>ve()),e.querySelectorAll(".task-expand-btn").forEach(s=>{s.addEventListener("click",()=>ue(s.dataset.taskId))}),e.querySelectorAll(".status-select").forEach(s=>{s.addEventListener("change",async o=>{const n=s.dataset.taskId,r=s.value,l=t.find(c=>c.id===n);await be(n,r,l),await w()})}),e.querySelectorAll(".task-edit-btn").forEach(s=>{s.addEventListener("click",()=>{const o=t.find(n=>n.id===s.dataset.taskId);o&&ge(o)})})}function pe(e){const t=e.support_task_comments||[];return`
      <tr>
        <td><span class="task-category ${e.category}">${M[e.category]||e.category}</span></td>
        <td class="time-cell">${C(e.created_at)}</td>
        <td>
          <div class="task-title-cell">${u(e.title)}</div>
          ${e.description?`<div class="task-desc">${u(e.description.substring(0,80))}${e.description.length>80?"…":""}</div>`:""}
        </td>
        <td>
          ${e.member_name?e.member_profile_url?`<a class="task-member-link" href="${e.member_profile_url}" target="_blank">${u(e.member_name)}</a>`:u(e.member_name):""}
        </td>
        <td>
          <select class="status-select" data-task-id="${e.id}">
            ${Object.entries(E).map(([a,i])=>`<option value="${a}" ${e.status===a?"selected":""}>${i}</option>`).join("")}
          </select>
        </td>
        <td>${e.hours!=null?e.hours:""}</td>
        <td style="white-space:nowrap;">
          <button class="action-btn task-expand-btn" data-task-id="${e.id}" style="margin-right:4px;">
            ${t.length>0?`Notes (${t.length})`:"Notes"}
          </button>
          <button class="action-btn task-edit-btn" data-task-id="${e.id}">Edit</button>
        </td>
      </tr>
      <tr class="task-row-expand" id="task-detail-${e.id}" style="display:none;">
        <td colspan="7">
          ${me(e)}
        </td>
      </tr>
    `}function me(e){const t=e.support_task_comments||[];return`
      <div class="task-detail-panel">
        ${e.description?`<div style="font-size:13px;line-height:1.6;margin-bottom:12px;">${u(e.description)}</div>`:""}
        ${e.notes?`<div style="font-size:12px;color:#666;border-top:1px solid #eee;padding-top:10px;margin-top:10px;">${u(e.notes)}</div>`:""}

        <div class="comments-section">
          <div class="comments-title">Comments (${t.length}/5)</div>
          ${t.map(a=>`
            <div class="comment-item">
              <div class="comment-author-badge ${a.author.toLowerCase()==="hannah"?"hannah":""}">${a.author.charAt(0).toUpperCase()}</div>
              <div class="comment-body">
                <div class="comment-meta">${u(a.author)} &middot; ${C(a.created_at)}</div>
                <div class="comment-text">${u(a.body)}</div>
              </div>
            </div>
          `).join("")}

          ${t.length<5?`
            <div class="comment-input-row">
              <textarea class="comment-textarea" id="comment-input-${e.id}" placeholder="Add a comment..."></textarea>
              <div style="display:flex;flex-direction:column;gap:6px;">
                <button class="admin-btn primary add-comment-btn" data-task-id="${e.id}" style="white-space:nowrap;">Add</button>
              </div>
            </div>
          `:'<div style="font-size:12px;color:#999;margin-top:8px;">Maximum 5 comments reached.</div>'}
        </div>
      </div>
    `}function ue(e){const t=document.getElementById(`task-detail-${e}`);if(!t)return;const a=t.style.display==="none";if(t.style.display=a?"table-row":"none",a){const i=t.querySelector(`.add-comment-btn[data-task-id="${e}"]`);i&&i.addEventListener("click",async()=>{const s=document.getElementById(`comment-input-${e}`),o=s==null?void 0:s.value.trim();o&&(i.disabled=!0,i.textContent="Saving...",await d.from("support_task_comments").insert({task_id:e,author:"Racket",body:o}),await w(),setTimeout(()=>{const n=document.getElementById(`task-detail-${e}`);n&&(n.style.display="table-row")},100))})}}async function be(e,t,a){await d.from("support_tasks").update({status:t}).eq("id",e),t==="feedback_needed"?await S("feedback_needed",a||{title:"(task)"}):t==="complete"&&await S("complete",a||{title:"(task)"})}async function S(e,t){const a=M[t.category]||t.category||"",i=t.member_name?`
Member: ${t.member_name}${t.member_profile_url?" — "+t.member_profile_url:""}`:"";let s,o,n;if(e==="created")s="contact@racket.net.au",o=`New MTNS MADE support task: ${t.title}`,n=`A new support task has been logged.

Category: ${a}${i}
Task: ${t.title}
${t.description?`
`+t.description:""}`;else if(e==="feedback_needed")s="hello@mtnsmade.com.au",o=`Feedback needed: ${t.title}`,n=`A support task requires your feedback.

Category: ${a}${i}
Task: ${t.title}
${t.description?`
`+t.description:""}

Please log in to the admin dashboard to respond.`;else if(e==="complete")s="hello@mtnsmade.com.au",o=`Task complete: ${t.title}`,n=`A support task has been marked complete.

Category: ${a}${i}
Task: ${t.title}`;else return;try{await fetch(`${g}/functions/v1/send-email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:s,subject:o,text:n,html:n.replace(/\n/g,"<br>")})})}catch(r){console.error("sendTaskNotification error:",r)}}let L=null;async function fe(e){if(!e||e.length<2)return[];const{data:t}=await d.from("members").select("id, name, slug").ilike("name",`%${e}%`).eq("subscription_status","active").limit(8);return t||[]}function ve(){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`
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
              <input type="text" class="form-input" id="st-member-search" placeholder="Search by name..." autocomplete="off">
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
          <div class="form-field">
            <label class="form-label">Status</label>
            <select class="form-input" id="st-status">
              ${Object.entries(E).map(([n,r])=>`<option value="${n}" ${n==="not_started"?"selected":""}>${r}</option>`).join("")}
            </select>
          </div>
          <div class="form-field">
            <label class="form-label">Hours</label>
            <input type="number" class="form-input" id="st-hours" placeholder="e.g. 0.25" step="0.25" min="0" style="max-width:120px;">
          </div>
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="st-cancel">Cancel</button>
          <button class="admin-btn primary" id="st-save">Create Task</button>
        </div>
      </div>
    `,document.body.appendChild(e);const t=e.querySelector("#st-category"),a=e.querySelector("#st-member-field"),i=()=>{a.style.display=t.value==="member_support"?"block":"none"};i(),t.addEventListener("change",i);const s=e.querySelector("#st-member-search"),o=e.querySelector("#st-member-suggestions");s.addEventListener("input",()=>{clearTimeout(L);const n=s.value.trim();if(n.length<2){o.style.display="none";return}L=setTimeout(async()=>{const r=await fe(n);if(r.length===0){o.style.display="none";return}o.innerHTML=r.map(l=>`<div class="member-suggestion-item" data-id="${l.id}" data-name="${u(l.name||"")}" data-slug="${l.slug||""}">${u(l.name||l.id)}</div>`).join(""),o.style.display="block",o.querySelectorAll(".member-suggestion-item").forEach(l=>{l.addEventListener("click",()=>{e.querySelector("#st-member-id").value=l.dataset.id,e.querySelector("#st-member-name").value=l.dataset.name,e.querySelector("#st-member-url").value=l.dataset.slug?`${x}/members/${l.dataset.slug}`:"",s.value=l.dataset.name,o.style.display="none"})})},250)}),e.querySelector(".modal-close").addEventListener("click",()=>e.remove()),e.querySelector("#st-cancel").addEventListener("click",()=>e.remove()),e.addEventListener("click",n=>{n.target===e&&e.remove()}),e.querySelector("#st-save").addEventListener("click",async()=>{const n=e.querySelector("#st-title").value.trim(),r=e.querySelector("#st-category").value;if(!n){alert("Please enter a task title.");return}const l=e.querySelector("#st-save");l.disabled=!0,l.textContent="Saving...";const c=e.querySelector("#st-hours").value,p=e.querySelector("#st-member-id").value,_={category:r,title:n,description:e.querySelector("#st-description").value.trim()||null,status:e.querySelector("#st-status").value,hours:c?parseFloat(c):null,member_id:p||null,member_name:e.querySelector("#st-member-name").value||null,member_profile_url:e.querySelector("#st-member-url").value||null},{data:f,error:v}=await d.from("support_tasks").insert(_).select().single();if(v){alert("Error creating task: "+v.message),l.disabled=!1,l.textContent="Create Task";return}e.remove(),await S("created",f),await w()})}function ge(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
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
              ${Object.entries(E).map(([a,i])=>`<option value="${a}" ${e.status===a?"selected":""}>${i}</option>`).join("")}
            </select>
          </div>
          <div class="form-field">
            <label class="form-label">Hours</label>
            <input type="number" class="form-input" id="et-hours" value="${e.hours!=null?e.hours:""}" step="0.25" min="0" style="max-width:120px;">
          </div>
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="et-cancel">Cancel</button>
          <button class="admin-btn primary" id="et-save">Save Changes</button>
        </div>
      </div>
    `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",()=>t.remove()),t.querySelector("#et-cancel").addEventListener("click",()=>t.remove()),t.addEventListener("click",a=>{a.target===t&&t.remove()}),t.querySelector("#et-save").addEventListener("click",async()=>{const a=t.querySelector("#et-save"),i=t.querySelector("#et-status").value,s=i!==e.status;a.disabled=!0,a.textContent="Saving...";const o=t.querySelector("#et-hours").value,{error:n}=await d.from("support_tasks").update({category:t.querySelector("#et-category").value,title:t.querySelector("#et-title").value.trim(),description:t.querySelector("#et-description").value.trim()||null,notes:t.querySelector("#et-notes").value.trim()||null,status:i,hours:o?parseFloat(o):null}).eq("id",e.id);if(n){alert("Error saving: "+n.message),a.disabled=!1,a.textContent="Save Changes";return}s&&await S(i==="feedback_needed"?"feedback_needed":i==="complete"?"complete":null,e),t.remove(),await w()})}function C(e){return e?new Date(e).toLocaleDateString("en-AU",{day:"2-digit",month:"2-digit",year:"2-digit"}):""}function u(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}async function y(e){const t=e.querySelector("#refresh-btn");t&&(t.disabled=!0,t.textContent="Loading...");try{$=await q(),j(e,$)}catch(a){console.error("Error refreshing dashboard:",a),t&&(t.disabled=!1,t.textContent="Refresh")}}async function A(){const e=document.querySelector(".dashboard-feed");if(!e){console.warn("Could not find .dashboard-feed container");return}if(typeof window.supabase>"u"){e.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error: Supabase library not loaded</div>
          </div>
        </div>
      `;return}if(d=window.supabase.createClient(g,b),!document.querySelector("#admin-dashboard-styles")){const t=document.createElement("style");t.id="admin-dashboard-styles",t.textContent=P,document.head.appendChild(t)}e.innerHTML=`
      <div class="admin-dashboard">
        <div class="admin-loading">
          <div class="loader"></div>
          <div class="loading-text">Loading system data...</div>
        </div>
      </div>
    `;try{$=await q(),j(e,$)}catch(t){console.error("Error loading dashboard:",t),e.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error loading dashboard</div>
            <div style="color: #666; font-size: 11px; margin-top: 8px;">${t.message}</div>
          </div>
        </div>
      `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",A):A()})();
