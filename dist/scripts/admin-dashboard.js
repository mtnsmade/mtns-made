(function(){console.log("Admin dashboard v2 loaded");const v="https://epszwomtxkpjegbjbixr.supabase.co",b="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",h="https://www.mtnsmade.com.au";let l=null,w=null,x=[];const M=`
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
  `;async function _(){var e;const t=await window.$memberstackDom.getMemberToken();return((e=t==null?void 0:t.data)==null?void 0:e.token)||(t==null?void 0:t.data)||""}function u(t){if(!t)return"--";const e=new Date(t),i=Math.floor((new Date-e)/1e3);return i<60?"now":i<3600?`${Math.floor(i/60)}m`:i<86400?`${Math.floor(i/3600)}h`:i<604800?`${Math.floor(i/86400)}d`:e.toLocaleDateString("en-AU",{day:"2-digit",month:"short"})}function A(){return new Date().toLocaleString("en-AU",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).toUpperCase()}function $(t){const e=[];return t.profile_image_url||e.push("Profile Image"),t.header_image_url||e.push("Header Image"),(!t.bio||t.bio.length<50)&&e.push("Bio"),t.suburb_id||e.push("Location"),e}function C(t,e){const a=t.first_name||t.name||"there",i=e.length>0?`

To complete your profile, you'll need:
${e.map(o=>`- ${o}`).join(`
`)}`:"";return`Hi ${a},

Thanks for being part of MTNS MADE! We noticed your profile isn't quite complete yet.

A complete profile helps other creatives find you in the directory and shows off your amazing work.${i}

Complete your profile here: ${h}/profile/start

Let us know if you need any help!

MTNS MADE Team`}async function S(){const[t,e,a,i,o,n,r,s,d,p,c,m]=await Promise.all([L(),q(),z(),I(),D(),O(),R(),U(),F(),N(),H(),P()]);return x=m,{recentMembers:t,memberStats:e,incompleteProfiles:a,failedSignups:i,recentEvents:o,eventStats:n,recentOpportunities:r,opportunityStats:s,recentProjects:d,messageStats:p,recentActivity:c,membershipTypes:m,loadedAt:new Date}}async function L(){const{data:t,error:e}=await l.from("members").select(`
        id, memberstack_id, name, email, first_name, last_name, slug,
        subscription_status, profile_complete, webflow_id,
        profile_image_url, header_image_url, bio, suburb_id,
        membership_type_id, membership_types(id, name),
        created_at, updated_at
      `).neq("is_deleted",!0).order("created_at",{ascending:!1}).limit(20);return e?(console.error("Error loading recent members:",e),[]):t||[]}async function q(){const{data:t}=await l.from("members").select("id, subscription_status, profile_complete, webflow_id").neq("is_deleted",!0),e=(t==null?void 0:t.length)||0,a=(t==null?void 0:t.filter(s=>s.subscription_status==="active").length)||0,i=(t==null?void 0:t.filter(s=>s.subscription_status==="lapsed").length)||0,o=(t==null?void 0:t.filter(s=>s.profile_complete).length)||0,n=(t==null?void 0:t.filter(s=>s.webflow_id).length)||0,r=(t==null?void 0:t.filter(s=>s.profile_complete&&!s.webflow_id&&s.subscription_status==="active").length)||0;return{total:e,active:a,lapsed:i,complete:o,synced:n,pendingSync:r}}async function P(){const{data:t,error:e}=await l.from("membership_types").select("id, name").order("name");return e?(console.error("Error loading membership types:",e),[]):t||[]}async function N(){try{const t=new Date,e=new Date(t.getFullYear(),t.getMonth(),1).toISOString(),{data:a}=await l.from("messages").select("id, is_read, created_at"),{data:i}=await l.from("messages").select("id").gte("created_at",e),o=(a==null?void 0:a.length)||0,n=(a==null?void 0:a.filter(s=>!s.is_read).length)||0,r=(i==null?void 0:i.length)||0;return{total:o,unread:n,thisMonth:r}}catch(t){return console.error("Error loading message stats:",t),{total:0,unread:0,thisMonth:0}}}async function z(){const{data:t,error:e}=await l.from("members").select(`
        id, memberstack_id, name, email, first_name, slug, subscription_status,
        profile_complete, profile_reminder_sent_at, created_at,
        profile_image_url, header_image_url, bio, suburb_id
      `).eq("profile_complete",!1).eq("subscription_status","active").neq("is_deleted",!0).order("created_at",{ascending:!0});return e?(console.error("Error loading incomplete profiles:",e),[]):t||[]}async function I(){const{data:t,error:e}=await l.from("members").select(`
        id, memberstack_id, name, email, first_name, slug,
        subscription_status, profile_complete, profile_reminder_sent_at, created_at
      `).not("subscription_status","in",'("active","lapsed","deleted")').neq("is_deleted",!0).order("created_at",{ascending:!1}).limit(30);return e?(console.error("Error loading failed signups:",e),[]):t||[]}async function D(){const{data:t,error:e}=await l.from("events").select("id, name, slug, memberstack_id, member_contact_email, is_draft, is_archived, webflow_id, created_at").order("is_draft",{ascending:!1}).order("created_at",{ascending:!1}).limit(50);return e?(console.error("Error loading recent events:",e),[]):t||[]}async function O(){const{data:t}=await l.from("events").select("id, is_draft, is_archived, webflow_id"),e=(t==null?void 0:t.length)||0,a=(t==null?void 0:t.filter(o=>o.is_draft&&!o.is_archived).length)||0,i=(t==null?void 0:t.filter(o=>!o.is_draft&&!o.is_archived).length)||0;return{total:e,pending:a,published:i}}async function R(){const{data:t,error:e}=await l.from("opportunities").select("id, name, slug, memberstack_id, member_contact_email, opportunity_type, is_draft, is_archived, webflow_id, created_at").order("is_draft",{ascending:!1}).order("created_at",{ascending:!1}).limit(50);return e?(console.error("Error loading recent opportunities:",e),[]):t||[]}async function U(){const{data:t}=await l.from("opportunities").select("id, is_draft, is_archived"),e=(t==null?void 0:t.length)||0,a=(t==null?void 0:t.filter(o=>o.is_draft&&!o.is_archived).length)||0,i=(t==null?void 0:t.filter(o=>!o.is_draft&&!o.is_archived).length)||0;return{total:e,pending:a,published:i}}async function F(){const{data:t,error:e}=await l.from("projects").select(`
        id, name, slug, member_id, webflow_id, is_draft, is_deleted,
        created_at, updated_at
      `).eq("is_deleted",!1).order("updated_at",{ascending:!1}).limit(15);return e?(console.error("Error loading recent projects:",e),[]):t||[]}async function H(){const{data:t,error:e}=await l.from("activity_log").select(`
        id, member_id, memberstack_id, activity_type, description,
        entity_type, entity_id, entity_name,
        member_webflow_url, entity_webflow_url, created_at
      `).order("created_at",{ascending:!1}).limit(50);if(e)return console.error("Error loading recent activity:",e),[];const a=[...new Set(t.filter(o=>o.member_id).map(o=>o.member_id))];let i={};if(a.length>0){const{data:o}=await l.from("members").select("id, name, first_name, last_name, profile_image_url").in("id",a);o&&o.forEach(n=>{i[n.id]={name:n.name||`${n.first_name||""} ${n.last_name||""}`.trim()||"Unknown Member",profile_image_url:n.profile_image_url||null}})}return t.map(o=>{var n,r;return{...o,member_name:o.member_id&&((n=i[o.member_id])==null?void 0:n.name)||"Unknown Member",member_profile_image:o.member_id&&((r=i[o.member_id])==null?void 0:r.profile_image_url)||null}})}function B(t){const e=$(t),a=C(t,e),i=document.createElement("div");i.className="modal-overlay",i.innerHTML=`
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Contact Member</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label class="form-label">To</label>
            <input type="text" class="form-input" id="modal-to" value="${t.email||""}" readonly>
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
          ${e.length>0?`
            <div class="form-field">
              <label class="form-label">Missing Fields Detected</label>
              <div class="missing-fields">
                ${e.map(o=>`<span class="missing-field">${o}</span>`).join("")}
              </div>
            </div>
          `:""}
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="modal-cancel">Cancel</button>
          <button class="admin-btn primary" id="modal-send">Send Email</button>
        </div>
      </div>
    `,document.body.appendChild(i),i.querySelector(".modal-close").addEventListener("click",()=>i.remove()),i.querySelector("#modal-cancel").addEventListener("click",()=>i.remove()),i.addEventListener("click",o=>{o.target===i&&i.remove()}),i.querySelector("#modal-send").addEventListener("click",async()=>{const o=i.querySelector("#modal-to").value,n=i.querySelector("#modal-subject").value,r=i.querySelector("#modal-body").value;if(!o){alert("No email address available for this member");return}const s=i.querySelector("#modal-send");s.disabled=!0,s.textContent="Sending...";try{const p=await(await fetch(`${v}/functions/v1/send-email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:o,subject:n,text:r,html:r.replace(/\n/g,"<br>")})})).json();if(p.success){await l.from("members").update({profile_reminder_sent_at:new Date().toISOString()}).eq("id",t.id),alert("Email sent successfully!"),i.remove();const c=document.querySelector(".dashboard-feed");c&&f(c)}else alert("Failed to send email: "+(p.error||"Unknown error")),s.disabled=!1,s.textContent="Send Email"}catch(d){console.error("Error sending email:",d),alert("Error sending email. Check console for details."),s.disabled=!1,s.textContent="Send Email"}})}function W(t,e,a){var n;const i=((n=x.find(r=>r.id===a))==null?void 0:n.name)||"Not set",o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Edit Member</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label class="form-label">Member</label>
            <input type="text" class="form-input" value="${e}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">Current Type</label>
            <input type="text" class="form-input" value="${i}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">New Membership Type</label>
            <select class="form-input" id="modal-membership-type">
              <option value="">-- Select New Type --</option>
              ${x.map(r=>`
                <option value="${r.id}" ${r.id===a?"disabled":""}>
                  ${r.name}${r.id===a?" (current)":""}
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
    `,document.body.appendChild(o),o.querySelector(".modal-close").addEventListener("click",()=>o.remove()),o.querySelector("#modal-cancel").addEventListener("click",()=>o.remove()),o.addEventListener("click",r=>{r.target===o&&o.remove()}),o.querySelector("#modal-save").addEventListener("click",async()=>{var m;const r=o.querySelector("#modal-membership-type").value,s=o.querySelector("#modal-skip-billing").checked;if(!r){alert("Please select a new membership type");return}const d=((m=x.find(g=>g.id===r))==null?void 0:m.name)||"Unknown",p=s?`Change ${e}'s type from "${i}" to "${d}"?

This will update the label only (no billing change).`:`Change ${e}'s type from "${i}" to "${d}"?

This WILL change their Stripe subscription and billing.`;if(!confirm(p))return;const c=o.querySelector("#modal-save");c.disabled=!0,c.textContent="Updating Memberstack...";try{const g=await fetch(`${v}/functions/v1/admin-update-member`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({memberId:t,newMembershipTypeId:r,skipPlanChange:s})}),y=await g.json();if(!g.ok)throw new Error(y.error||"Update failed");let T=`Membership type updated!

${y.change.from} → ${y.change.to}`;y.results.warnings&&y.results.warnings.length>0&&(T+=`

Warnings:
- ${y.results.warnings.join(`
- `)}`),alert(T),o.remove();const j=document.querySelector(".dashboard-feed");j&&f(j)}catch(g){console.error("Error updating membership type:",g),alert("Error updating membership type: "+g.message),c.disabled=!1,c.textContent="Update Membership"}})}async function J(t){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`
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
    `,document.body.appendChild(e),e.querySelector(".modal-close").addEventListener("click",()=>e.remove()),e.addEventListener("click",r=>{r.target===e&&e.remove()});const{data:a,error:i}=await l.from("events").select("*").eq("id",t).single();if(i||!a){e.querySelector(".modal-body").innerHTML='<div style="padding: 24px; color: #dc3545;">Failed to load event details.</div>';return}const o=r=>r?new Date(r).toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):"--",n=[a.location_name,a.location_address].filter(Boolean).join(", ")||"--";e.querySelector(".modal-title").textContent=a.name||"Event Preview",e.querySelector(".modal-body").innerHTML=`
      ${a.feature_image_url?`<img src="${a.feature_image_url}" class="event-preview-image" alt="${a.name}">`:""}
      <div class="preview-grid">
        <div class="preview-field">
          <div class="preview-label">Start</div>
          <div class="preview-value">${o(a.date_start)}</div>
        </div>
        <div class="preview-field">
          <div class="preview-label">End</div>
          <div class="preview-value">${o(a.date_end)}</div>
        </div>
      </div>
      <div class="preview-field">
        <div class="preview-label">Location</div>
        <div class="preview-value">${n}</div>
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
    `}async function V(t){const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`
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
    `,document.body.appendChild(e),e.querySelector(".modal-close").addEventListener("click",()=>e.remove()),e.addEventListener("click",n=>{n.target===e&&e.remove()});const{data:a,error:i}=await l.from("opportunities").select("*").eq("id",t).single();if(i||!a){e.querySelector(".modal-body").innerHTML='<div style="padding: 24px; color: #dc3545;">Failed to load opportunity details.</div>';return}const o=n=>n?new Date(n).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"}):"--";e.querySelector(".modal-title").textContent=a.name||"Opportunity Preview",e.querySelector(".modal-body").innerHTML=`
      <div class="preview-grid">
        <div class="preview-field">
          <div class="preview-label">Type</div>
          <div class="preview-value">${a.opportunity_type||"--"}</div>
        </div>
        <div class="preview-field">
          <div class="preview-label">Closes</div>
          <div class="preview-value">${o(a.closing_date)}</div>
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
        <div class="preview-value">${a.member_contact_email||"--"}</div>
      </div>
    `}function k(t,e){const a=e.incompleteProfiles.length,i=e.eventStats.pending,o=e.opportunityStats.pending;t.innerHTML=`
      <div class="admin-dashboard">
        <div class="admin-header">
          <h1>MTNS MADE // System Dashboard</h1>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span class="admin-timestamp">Updated: ${A()}</span>
            <button class="admin-btn" id="refresh-btn">Refresh</button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-cell">
            <div class="stat-value">${e.memberStats.total}</div>
            <div class="stat-label">Total Members</div>
          </div>
          <div class="stat-cell success">
            <div class="stat-value">${e.memberStats.active}</div>
            <div class="stat-label">Active</div>
          </div>
          <div class="stat-cell ${a>5?"alert":""}">
            <div class="stat-value">${e.memberStats.complete}/${e.memberStats.total}</div>
            <div class="stat-label">Profiles Complete</div>
          </div>
          <div class="stat-cell">
            <div class="stat-value">${e.messageStats.thisMonth}</div>
            <div class="stat-label">Messages This Month</div>
          </div>
        </div>

        <!-- Issues Section -->
        ${X(e)}

        <!-- Activity Tabs -->
        <div class="admin-section">
          <div class="tabs-container">
            <button class="tab-btn active" data-tab="activity">Activity</button>
            <button class="tab-btn" data-tab="members">Recent Members</button>
            <button class="tab-btn" data-tab="incomplete">Incomplete (${a})</button>
            <button class="tab-btn" data-tab="failed">Failed Signups (${e.failedSignups.length})</button>
            <button class="tab-btn" data-tab="events">Events ${i>0?`(${i})`:""}</button>
            <button class="tab-btn" data-tab="opportunities">Opportunities ${o>0?`(${o})`:""}</button>
            <button class="tab-btn" data-tab="projects">Projects</button>
          </div>

          <div class="tab-content active" id="tab-activity">
            ${te(e.recentActivity)}
          </div>

          <div class="tab-content" id="tab-members">
            ${Y(e.recentMembers)}
          </div>

          <div class="tab-content" id="tab-incomplete">
            ${G(e.incompleteProfiles)}
          </div>

          <div class="tab-content" id="tab-failed">
            ${K(e.failedSignups)}
          </div>

          <div class="tab-content" id="tab-events">
            ${Q(e.recentEvents,e.eventStats)}
          </div>

          <div class="tab-content" id="tab-opportunities">
            ${Z(e.recentOpportunities,e.opportunityStats)}
          </div>

          <div class="tab-content" id="tab-projects">
            ${ee(e.recentProjects)}
          </div>
        </div>
      </div>
    `,t.querySelectorAll(".tab-btn").forEach(n=>{n.addEventListener("click",()=>{t.querySelectorAll(".tab-btn").forEach(r=>r.classList.remove("active")),t.querySelectorAll(".tab-content").forEach(r=>r.classList.remove("active")),n.classList.add("active"),t.querySelector(`#tab-${n.dataset.tab}`).classList.add("active")})}),t.querySelector("#refresh-btn").addEventListener("click",()=>f(t)),t.querySelectorAll(".contact-btn").forEach(n=>{n.addEventListener("click",()=>{const r=n.dataset.memberId,s=e.incompleteProfiles.find(d=>d.id===r)||e.recentMembers.find(d=>d.id===r)||e.failedSignups.find(d=>d.id===r);s&&B(s)})}),t.querySelectorAll(".approve-btn").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.eventId,s=n.dataset.eventName;if(confirm(`Approve event "${s}"?

This will publish the event and notify the member.`)){n.disabled=!0,n.textContent="Approving...";try{const d=await _(),c=await(await fetch(`${v}/functions/v1/manage-event`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b,"X-Member-Token":d},body:JSON.stringify({eventId:r,action:"approve"})})).json();c.success?(alert(`Event "${s}" has been approved!

The member will be notified and the event will sync to Webflow.`),f(t)):(alert(`Failed to approve event: ${c.error}`),n.disabled=!1,n.textContent="Approve")}catch(d){console.error("Approve error:",d),alert("Error approving event. Please try again."),n.disabled=!1,n.textContent="Approve"}}})}),t.querySelectorAll(".reject-btn").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.eventId,s=n.dataset.eventName,d=prompt(`Reject event "${s}"?

Optionally enter a reason (or leave blank):`);if(d!==null){n.disabled=!0,n.textContent="Rejecting...";try{const p=await _(),m=await(await fetch(`${v}/functions/v1/manage-event`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b,"X-Member-Token":p},body:JSON.stringify({eventId:r,action:"reject",rejectionReason:d||void 0})})).json();m.success?(alert(`Event "${s}" has been rejected.

The member will be notified.`),f(t)):(alert(`Failed to reject event: ${m.error}`),n.disabled=!1,n.textContent="Reject")}catch(p){console.error("Reject error:",p),alert("Error rejecting event. Please try again."),n.disabled=!1,n.textContent="Reject"}}})}),t.querySelectorAll(".preview-btn").forEach(n=>{n.addEventListener("click",()=>{J(n.dataset.eventId)})}),t.querySelectorAll(".preview-opp-btn").forEach(n=>{n.addEventListener("click",()=>{V(n.dataset.oppId)})}),t.querySelectorAll(".approve-opp-btn").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.oppId,s=n.dataset.oppName;if(confirm(`Approve opportunity "${s}"?

This will publish it and notify the member.`)){n.disabled=!0,n.textContent="Approving...";try{const d=await _(),c=await(await fetch(`${v}/functions/v1/manage-opportunity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b,"X-Member-Token":d},body:JSON.stringify({opportunityId:r,action:"approve"})})).json();c.success?(alert(`Opportunity "${s}" has been approved!

The member will be notified.`),f(t)):(alert(`Failed to approve opportunity: ${c.error}`),n.disabled=!1,n.textContent="Approve")}catch(d){console.error("Opportunity approve error:",d),alert("Error approving opportunity. Please try again."),n.disabled=!1,n.textContent="Approve"}}})}),t.querySelectorAll(".reject-opp-btn").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.oppId,s=n.dataset.oppName,d=prompt(`Reject opportunity "${s}"?

Optionally enter a reason (or leave blank):`);if(d!==null){n.disabled=!0,n.textContent="Rejecting...";try{const p=await _(),m=await(await fetch(`${v}/functions/v1/manage-opportunity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b,"X-Member-Token":p},body:JSON.stringify({opportunityId:r,action:"reject",rejectionReason:d||void 0})})).json();m.success?(alert(`Opportunity "${s}" has been rejected.

The member will be notified.`),f(t)):(alert(`Failed to reject opportunity: ${m.error}`),n.disabled=!1,n.textContent="Reject")}catch(p){console.error("Opportunity reject error:",p),alert("Error rejecting opportunity. Please try again."),n.disabled=!1,n.textContent="Reject"}}})}),t.querySelectorAll(".edit-btn").forEach(n=>{n.addEventListener("click",()=>{const r=n.dataset.memberId,s=n.dataset.memberName,d=n.dataset.currentType;W(r,s,d)})}),t.querySelectorAll(".delete-btn").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.memberId,s=n.dataset.memberName;if(confirm(`Delete "${s}"?

This will remove them from the dashboard and Webflow directory. This action cannot be undone.`)){n.disabled=!0,n.textContent="Deleting...";try{const{error:d}=await l.from("members").update({is_deleted:!0,subscription_status:"deleted",updated_at:new Date().toISOString()}).eq("id",r);if(d)throw d;alert(`"${s}" has been deleted.`),f(t)}catch(d){console.error("Delete error:",d),alert("Error deleting member. Please try again."),n.disabled=!1,n.textContent="Delete"}}})})}function X(t){const e=[];t.memberStats.pendingSync>0&&e.push({type:"warning",text:"Members pending Webflow sync",count:t.memberStats.pendingSync});const a=t.incompleteProfiles.filter(i=>(Date.now()-new Date(i.created_at))/864e5>7&&!i.profile_reminder_sent_at);return a.length>0&&e.push({type:"info",text:"Incomplete profiles (7+ days, no reminder sent)",count:a.length}),t.eventStats.pending>0&&e.push({type:"info",text:"Events pending review",count:t.eventStats.pending}),t.opportunityStats.pending>0&&e.push({type:"info",text:"Opportunities pending review",count:t.opportunityStats.pending}),t.memberStats.lapsed>0&&e.push({type:"error",text:"Lapsed subscriptions",count:t.memberStats.lapsed}),e.length===0?`
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
          <span class="section-badge alert">${e.length} Issue${e.length>1?"s":""}</span>
        </div>
        <div class="issues-list">
          ${e.map(i=>`
            <div class="issue-item">
              <div class="issue-icon ${i.type}"></div>
              <div class="issue-text">${i.text}</div>
              <div class="issue-count">${i.count}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `}function Y(t){return t.length===0?'<div class="empty-state">No members found</div>':`
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
          ${t.map(e=>{var a;return`
            <tr>
              <td>
                <div class="name-cell">${e.name||e.first_name||"No name"}</div>
                <div class="email-cell">${e.email||"--"}</div>
              </td>
              <td>
                <span class="type-cell">${((a=e.membership_types)==null?void 0:a.name)||"Not set"}</span>
              </td>
              <td>
                <span class="status ${e.subscription_status||"active"}">
                  ${e.subscription_status||"active"}
                </span>
              </td>
              <td>
                <span class="status ${e.profile_complete?"complete":"incomplete"}">
                  ${e.profile_complete?"Complete":"Incomplete"}
                </span>
              </td>
              <td class="time-cell">${u(e.created_at)}</td>
              <td>
                <div class="action-btns">
                  <button class="action-btn edit-btn" data-member-id="${e.id}" data-member-name="${e.name||e.first_name||"this member"}" data-current-type="${e.membership_type_id||""}">Edit</button>
                  ${e.webflow_id&&e.slug?`
                    <a href="${h}/members/${e.slug}" target="_blank" class="action-btn view-btn">View</a>
                  `:""}
                  <button class="action-btn delete-btn" data-member-id="${e.id}" data-member-name="${e.name||e.first_name||"this member"}">Delete</button>
                </div>
              </td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    `}function G(t){return t.length===0?'<div class="empty-state">All active members have complete profiles</div>':`
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
          ${t.map(e=>{const a=$(e);return`
              <tr>
                <td>
                  <div class="name-cell">${e.name||e.first_name||"No name"}</div>
                  <div class="email-cell">${e.email||"--"}</div>
                </td>
                <td>
                  <div class="missing-fields">
                    ${a.slice(0,3).map(i=>`<span class="missing-field">${i}</span>`).join("")}
                    ${a.length>3?`<span class="missing-field">+${a.length-3}</span>`:""}
                  </div>
                </td>
                <td class="time-cell">
                  ${e.profile_reminder_sent_at?u(e.profile_reminder_sent_at):"--"}
                </td>
                <td class="time-cell">${u(e.created_at)}</td>
                <td>
                  <div class="action-btns">
                    ${e.profile_reminder_sent_at?`
                      <button class="action-btn contacted" disabled>Contacted</button>
                    `:`
                      <button class="action-btn contact-btn" data-member-id="${e.id}">Contact</button>
                    `}
                    ${e.webflow_id&&e.slug?`
                      <a href="${h}/members/${e.slug}" target="_blank" class="action-btn">View</a>
                    `:""}
                  </div>
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    `}function K(t){return t.length===0?'<div class="empty-state">No failed signups found</div>':`
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
          ${t.map(e=>`
            <tr>
              <td>
                <div class="name-cell">${e.name||e.first_name||"No name"}</div>
                <div class="email-cell">${e.email||"--"}</div>
              </td>
              <td>
                <span class="status pending">
                  ${e.subscription_status||"no status"}
                </span>
              </td>
              <td class="time-cell">${u(e.created_at)}</td>
              <td>
                <div class="action-btns">
                  ${e.profile_reminder_sent_at?`
                    <button class="action-btn contacted" disabled>Contacted</button>
                  `:`
                    <button class="action-btn contact-btn" data-member-id="${e.id}">Contact</button>
                  `}
                  <button class="action-btn delete-btn" data-member-id="${e.id}" data-member-name="${e.name||e.first_name||"this member"}">Delete</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}function Q(t,e){return`
      <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; font-size: 11px; color: #666;">
        <span style="margin-right: 24px;"><strong style="color: #f59f00;">${e.pending}</strong> Pending</span>
        <span><strong style="color: #1a1a1a;">${e.published}</strong> Published</span>
      </div>
      ${t.length===0?'<div class="empty-state">No events found</div>':`
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
            ${t.map(a=>{let i="draft";return a.is_archived?i="archived":a.is_draft?i="pending":i="published",`
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
                  <td class="time-cell">${u(a.created_at)}</td>
                  <td>
                    <div class="action-btns">
                      ${i==="pending"?`
                        <button class="action-btn preview-btn" data-event-id="${a.id}">Preview</button>
                        <button class="action-btn approve-btn" data-event-id="${a.id}" data-event-name="${a.name}">Approve</button>
                        <button class="action-btn reject-btn" data-event-id="${a.id}" data-event-name="${a.name}">Reject</button>
                      `:""}
                      ${a.webflow_id&&a.slug?`
                        <a href="${h}/event/${a.slug}" target="_blank" class="action-btn view-btn">View</a>
                      `:""}
                    </div>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      `}
    `}function Z(t,e){return`
      <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; font-size: 11px; color: #666;">
        <span style="margin-right: 24px;"><strong style="color: #f59f00;">${e.pending}</strong> Pending</span>
        <span><strong style="color: #1a1a1a;">${e.published}</strong> Published</span>
      </div>
      ${t.length===0?'<div class="empty-state">No opportunities found</div>':`
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
            ${t.map(a=>{let i="draft";return a.is_archived?i="archived":a.is_draft?i="pending":i="published",`
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
                  <td class="time-cell">${u(a.created_at)}</td>
                  <td>
                    <div class="action-btns">
                      ${i==="pending"?`
                        <button class="action-btn preview-opp-btn" data-opp-id="${a.id}">Preview</button>
                        <button class="action-btn approve-opp-btn" data-opp-id="${a.id}" data-opp-name="${a.name}">Approve</button>
                        <button class="action-btn reject-opp-btn" data-opp-id="${a.id}" data-opp-name="${a.name}">Reject</button>
                      `:""}
                      ${a.webflow_id&&a.slug?`
                        <a href="${h}/opportunities/${a.slug}" target="_blank" class="action-btn view-btn">View</a>
                      `:""}
                    </div>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      `}
    `}function ee(t){return t.length===0?'<div class="empty-state">No projects found</div>':`
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
          ${t.map(e=>`
            <tr>
              <td>
                <div class="name-cell">${e.name||"Untitled"}</div>
              </td>
              <td>
                <span class="status ${e.webflow_id?"synced":"pending"}">
                  ${e.webflow_id?"Synced":"Pending"}
                </span>
              </td>
              <td class="time-cell">${u(e.updated_at)}</td>
              <td>
                ${e.webflow_id&&e.slug?`
                  <a href="${h}/projects/${e.slug}" target="_blank" class="action-btn view-btn">View</a>
                `:"--"}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}function te(t){if(!t||t.length===0)return'<div class="empty-state">No recent activity</div>';const e=i=>i==="member_signup"?{class:"signup",icon:"🎉"}:i==="profile_update"?{class:"profile",icon:"👤"}:i.startsWith("project_")?{class:"project",icon:"📁"}:i.startsWith("event_")?{class:"event",icon:"📅"}:i.startsWith("opportunity_")?{class:"event",icon:"💼"}:i==="subscription_canceled"?{class:"canceled",icon:"🚫"}:i==="subscription_reactivated"?{class:"reactivated",icon:"✅"}:{class:"",icon:"📝"},a=i=>i.activity_type==="member_signup"?null:i.entity_webflow_url?i.entity_webflow_url:i.member_webflow_url?i.member_webflow_url:null;return`
      <div class="activity-feed">
        ${t.map(i=>{const o=e(i.activity_type),n=a(i);return`
            <div class="activity-item">
              ${i.member_profile_image?`
                <div class="activity-avatar">
                  <img src="${i.member_profile_image}" alt="${i.member_name}">
                </div>
              `:`
                <div class="activity-icon ${o.class}">${o.icon}</div>
              `}
              <div class="activity-content">
                <div class="activity-text">
                  <strong>${i.member_name}</strong> ${i.description}
                </div>
                <div class="activity-meta">
                  <span class="activity-time">${u(i.created_at)}</span>
                </div>
              </div>
              <div class="activity-action">
                ${n?`
                  <a href="${n}" target="_blank" class="action-btn">View</a>
                `:""}
              </div>
            </div>
          `}).join("")}
      </div>
    `}async function f(t){const e=t.querySelector("#refresh-btn");e&&(e.disabled=!0,e.textContent="Loading...");try{w=await S(),k(t,w)}catch(a){console.error("Error refreshing dashboard:",a),e&&(e.disabled=!1,e.textContent="Refresh")}}async function E(){const t=document.querySelector(".dashboard-feed");if(!t){console.warn("Could not find .dashboard-feed container");return}if(typeof window.supabase>"u"){t.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error: Supabase library not loaded</div>
          </div>
        </div>
      `;return}if(l=window.supabase.createClient(v,b),!document.querySelector("#admin-dashboard-styles")){const e=document.createElement("style");e.id="admin-dashboard-styles",e.textContent=M,document.head.appendChild(e)}t.innerHTML=`
      <div class="admin-dashboard">
        <div class="admin-loading">
          <div class="loader"></div>
          <div class="loading-text">Loading system data...</div>
        </div>
      </div>
    `;try{w=await S(),k(t,w)}catch(e){console.error("Error loading dashboard:",e),t.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error loading dashboard</div>
            <div style="color: #666; font-size: 11px; margin-top: 8px;">${e.message}</div>
          </div>
        </div>
      `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",E):E()})();
