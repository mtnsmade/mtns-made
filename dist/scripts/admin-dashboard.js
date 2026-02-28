(function(){console.log("Admin dashboard v2 loaded");const m="https://epszwomtxkpjegbjbixr.supabase.co",p="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",f="https://www.mtnsmade.com.au";let d=null,b=null;const w=`
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
      flex-wrap: wrap;
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
  `;function l(t){if(!t)return"--";const e=new Date(t),a=Math.floor((new Date-e)/1e3);return a<60?"now":a<3600?`${Math.floor(a/60)}m`:a<86400?`${Math.floor(a/3600)}h`:a<604800?`${Math.floor(a/86400)}d`:e.toLocaleDateString("en-AU",{day:"2-digit",month:"short"})}function $(){return new Date().toLocaleString("en-AU",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).toUpperCase()}function v(t){const e=[];return t.profile_image_url||e.push("Profile Image"),t.header_image_url||e.push("Header Image"),(!t.bio||t.bio.length<50)&&e.push("Bio"),t.suburb_id||e.push("Location"),e}function S(t,e){const i=t.first_name||t.name||"there",a=e.length>0?`

To complete your profile, you'll need:
${e.map(n=>`- ${n}`).join(`
`)}`:"";return`Hi ${i},

Thanks for being part of MTNS MADE! We noticed your profile isn't quite complete yet.

A complete profile helps other creatives find you in the directory and shows off your amazing work.${a}

Complete your profile here: ${f}/profile/start

Let us know if you need any help!

MTNS MADE Team`}async function g(){const[t,e,i,a,n,o,r,s,c]=await Promise.all([k(),E(),A(),M(),z(),T(),C(),j(),L()]);return{recentMembers:t,memberStats:e,incompleteProfiles:i,failedSignups:a,recentEvents:n,eventStats:o,recentProjects:r,messageStats:s,recentActivity:c,loadedAt:new Date}}async function k(){const{data:t,error:e}=await d.from("members").select(`
        id, memberstack_id, name, email, first_name, last_name, slug,
        subscription_status, profile_complete, webflow_id,
        profile_image_url, header_image_url, bio, suburb_id,
        created_at, updated_at
      `).order("created_at",{ascending:!1}).limit(20);return e?(console.error("Error loading recent members:",e),[]):t||[]}async function E(){const{data:t}=await d.from("members").select("id, subscription_status, profile_complete, webflow_id"),e=(t==null?void 0:t.length)||0,i=(t==null?void 0:t.filter(s=>s.subscription_status==="active").length)||0,a=(t==null?void 0:t.filter(s=>s.subscription_status==="lapsed").length)||0,n=(t==null?void 0:t.filter(s=>s.profile_complete).length)||0,o=(t==null?void 0:t.filter(s=>s.webflow_id).length)||0,r=(t==null?void 0:t.filter(s=>s.profile_complete&&!s.webflow_id&&s.subscription_status==="active").length)||0;return{total:e,active:i,lapsed:a,complete:n,synced:o,pendingSync:r}}async function j(){try{const t=new Date,e=new Date(t.getFullYear(),t.getMonth(),1).toISOString(),{data:i}=await d.from("messages").select("id, is_read, created_at"),{data:a}=await d.from("messages").select("id").gte("created_at",e),n=(i==null?void 0:i.length)||0,o=(i==null?void 0:i.filter(s=>!s.is_read).length)||0,r=(a==null?void 0:a.length)||0;return{total:n,unread:o,thisMonth:r}}catch(t){return console.error("Error loading message stats:",t),{total:0,unread:0,thisMonth:0}}}async function A(){const{data:t,error:e}=await d.from("members").select(`
        id, memberstack_id, name, email, first_name, slug, subscription_status,
        profile_complete, profile_reminder_sent_at, created_at,
        profile_image_url, header_image_url, bio, suburb_id
      `).eq("profile_complete",!1).eq("subscription_status","active").order("created_at",{ascending:!0});return e?(console.error("Error loading incomplete profiles:",e),[]):t||[]}async function M(){const{data:t,error:e}=await d.from("members").select(`
        id, memberstack_id, name, email, first_name, slug,
        subscription_status, profile_complete, profile_reminder_sent_at, created_at
      `).not("subscription_status","in",'("active","lapsed")').order("created_at",{ascending:!1}).limit(30);return e?(console.error("Error loading failed signups:",e),[]):t||[]}async function z(){const{data:t,error:e}=await d.from("events").select("id, name, slug, memberstack_id, member_contact_email, is_draft, is_archived, webflow_id, created_at").order("created_at",{ascending:!1}).limit(15);return e?(console.error("Error loading recent events:",e),[]):t||[]}async function T(){const{data:t}=await d.from("events").select("id, is_draft, is_archived, webflow_id"),e=(t==null?void 0:t.length)||0,i=(t==null?void 0:t.filter(n=>n.is_draft&&!n.is_archived).length)||0,a=(t==null?void 0:t.filter(n=>!n.is_draft&&!n.is_archived).length)||0;return{total:e,pending:i,published:a}}async function C(){const{data:t,error:e}=await d.from("projects").select(`
        id, name, slug, member_id, webflow_id, is_draft, is_deleted,
        created_at, updated_at
      `).eq("is_deleted",!1).order("updated_at",{ascending:!1}).limit(15);return e?(console.error("Error loading recent projects:",e),[]):t||[]}async function L(){const{data:t,error:e}=await d.from("activity_log").select(`
        id, member_id, memberstack_id, activity_type, description,
        entity_type, entity_id, entity_name,
        member_webflow_url, entity_webflow_url, created_at
      `).order("created_at",{ascending:!1}).limit(50);if(e)return console.error("Error loading recent activity:",e),[];const i=[...new Set(t.filter(n=>n.member_id).map(n=>n.member_id))];let a={};if(i.length>0){const{data:n}=await d.from("members").select("id, name, first_name, last_name, profile_image_url").in("id",i);n&&n.forEach(o=>{a[o.id]={name:o.name||`${o.first_name||""} ${o.last_name||""}`.trim()||"Unknown Member",profile_image_url:o.profile_image_url||null}})}return t.map(n=>{var o,r;return{...n,member_name:n.member_id&&((o=a[n.member_id])==null?void 0:o.name)||"Unknown Member",member_profile_image:n.member_id&&((r=a[n.member_id])==null?void 0:r.profile_image_url)||null}})}function P(t){const e=v(t),i=S(t,e),a=document.createElement("div");a.className="modal-overlay",a.innerHTML=`
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
            <textarea class="form-input" id="modal-body">${i}</textarea>
            <div class="form-hint">Edit the message above as needed</div>
          </div>
          ${e.length>0?`
            <div class="form-field">
              <label class="form-label">Missing Fields Detected</label>
              <div class="missing-fields">
                ${e.map(n=>`<span class="missing-field">${n}</span>`).join("")}
              </div>
            </div>
          `:""}
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="modal-cancel">Cancel</button>
          <button class="admin-btn primary" id="modal-send">Send Email</button>
        </div>
      </div>
    `,document.body.appendChild(a),a.querySelector(".modal-close").addEventListener("click",()=>a.remove()),a.querySelector("#modal-cancel").addEventListener("click",()=>a.remove()),a.addEventListener("click",n=>{n.target===a&&a.remove()}),a.querySelector("#modal-send").addEventListener("click",async()=>{const n=a.querySelector("#modal-to").value,o=a.querySelector("#modal-subject").value,r=a.querySelector("#modal-body").value;if(!n){alert("No email address available for this member");return}const s=a.querySelector("#modal-send");s.disabled=!0,s.textContent="Sending...";try{const x=await(await fetch(`${m}/functions/v1/send-email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:n,subject:o,text:r,html:r.replace(/\n/g,"<br>")})})).json();if(x.success){await d.from("members").update({profile_reminder_sent_at:new Date().toISOString()}).eq("id",t.id),alert("Email sent successfully!"),a.remove();const _=document.querySelector(".dashboard-feed");_&&u(_)}else alert("Failed to send email: "+(x.error||"Unknown error")),s.disabled=!1,s.textContent="Send Email"}catch(c){console.error("Error sending email:",c),alert("Error sending email. Check console for details."),s.disabled=!1,s.textContent="Send Email"}})}function h(t,e){const i=e.incompleteProfiles.length;e.eventStats.pending,t.innerHTML=`
      <div class="admin-dashboard">
        <div class="admin-header">
          <h1>MTNS MADE // System Dashboard</h1>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span class="admin-timestamp">Updated: ${$()}</span>
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
          <div class="stat-cell ${i>5?"alert":""}">
            <div class="stat-value">${e.memberStats.complete}/${e.memberStats.total}</div>
            <div class="stat-label">Profiles Complete</div>
          </div>
          <div class="stat-cell">
            <div class="stat-value">${e.messageStats.thisMonth}</div>
            <div class="stat-label">Messages This Month</div>
          </div>
        </div>

        <!-- Issues Section -->
        ${I(e)}

        <!-- Activity Tabs -->
        <div class="admin-section">
          <div class="tabs-container">
            <button class="tab-btn active" data-tab="members">Recent Members</button>
            <button class="tab-btn" data-tab="incomplete">Incomplete (${i})</button>
            <button class="tab-btn" data-tab="failed">Failed Signups (${e.failedSignups.length})</button>
            <button class="tab-btn" data-tab="events">Events</button>
            <button class="tab-btn" data-tab="projects">Projects</button>
            <button class="tab-btn" data-tab="activity">Activity</button>
          </div>

          <div class="tab-content active" id="tab-members">
            ${N(e.recentMembers)}
          </div>

          <div class="tab-content" id="tab-incomplete">
            ${q(e.incompleteProfiles)}
          </div>

          <div class="tab-content" id="tab-failed">
            ${D(e.failedSignups)}
          </div>

          <div class="tab-content" id="tab-events">
            ${R(e.recentEvents,e.eventStats)}
          </div>

          <div class="tab-content" id="tab-projects">
            ${U(e.recentProjects)}
          </div>

          <div class="tab-content" id="tab-activity">
            ${F(e.recentActivity)}
          </div>
        </div>
      </div>
    `,t.querySelectorAll(".tab-btn").forEach(a=>{a.addEventListener("click",()=>{t.querySelectorAll(".tab-btn").forEach(n=>n.classList.remove("active")),t.querySelectorAll(".tab-content").forEach(n=>n.classList.remove("active")),a.classList.add("active"),t.querySelector(`#tab-${a.dataset.tab}`).classList.add("active")})}),t.querySelector("#refresh-btn").addEventListener("click",()=>u(t)),t.querySelectorAll(".contact-btn").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.memberId,o=e.incompleteProfiles.find(r=>r.id===n)||e.recentMembers.find(r=>r.id===n)||e.failedSignups.find(r=>r.id===n);o&&P(o)})}),t.querySelectorAll(".approve-btn").forEach(a=>{a.addEventListener("click",async()=>{const n=a.dataset.eventId,o=a.dataset.eventName;if(confirm(`Approve event "${o}"?

This will publish the event and notify the member.`)){a.disabled=!0,a.textContent="Approving...";try{const s=await(await fetch(`${m}/functions/v1/manage-event`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${p}`,apikey:p},body:JSON.stringify({eventId:n,action:"approve"})})).json();s.success?(alert(`Event "${o}" has been approved!

The member will be notified and the event will sync to Webflow.`),u(t)):(alert(`Failed to approve event: ${s.error}`),a.disabled=!1,a.textContent="Approve")}catch(r){console.error("Approve error:",r),alert("Error approving event. Please try again."),a.disabled=!1,a.textContent="Approve"}}})}),t.querySelectorAll(".reject-btn").forEach(a=>{a.addEventListener("click",async()=>{const n=a.dataset.eventId,o=a.dataset.eventName,r=prompt(`Reject event "${o}"?

Optionally enter a reason (or leave blank):`);if(r!==null){a.disabled=!0,a.textContent="Rejecting...";try{const c=await(await fetch(`${m}/functions/v1/manage-event`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${p}`,apikey:p},body:JSON.stringify({eventId:n,action:"reject",rejectionReason:r||void 0})})).json();c.success?(alert(`Event "${o}" has been rejected.

The member will be notified.`),u(t)):(alert(`Failed to reject event: ${c.error}`),a.disabled=!1,a.textContent="Reject")}catch(s){console.error("Reject error:",s),alert("Error rejecting event. Please try again."),a.disabled=!1,a.textContent="Reject"}}})})}function I(t){const e=[];t.memberStats.pendingSync>0&&e.push({type:"warning",text:"Members pending Webflow sync",count:t.memberStats.pendingSync});const i=t.incompleteProfiles.filter(a=>(Date.now()-new Date(a.created_at))/864e5>7&&!a.profile_reminder_sent_at);return i.length>0&&e.push({type:"info",text:"Incomplete profiles (7+ days, no reminder sent)",count:i.length}),t.eventStats.pending>0&&e.push({type:"info",text:"Events pending review",count:t.eventStats.pending}),t.memberStats.lapsed>0&&e.push({type:"error",text:"Lapsed subscriptions",count:t.memberStats.lapsed}),e.length===0?`
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
          ${e.map(a=>`
            <div class="issue-item">
              <div class="issue-icon ${a.type}"></div>
              <div class="issue-text">${a.text}</div>
              <div class="issue-count">${a.count}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `}function N(t){return t.length===0?'<div class="empty-state">No members found</div>':`
      <table class="admin-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Status</th>
            <th>Profile</th>
            <th>Webflow</th>
            <th>Joined</th>
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
                <span class="status ${e.subscription_status||"active"}">
                  ${e.subscription_status||"active"}
                </span>
              </td>
              <td>
                <span class="status ${e.profile_complete?"complete":"incomplete"}">
                  ${e.profile_complete?"Complete":"Incomplete"}
                </span>
              </td>
              <td>
                <span class="status ${e.webflow_id?"synced":"pending"}">
                  ${e.webflow_id?"Synced":"Pending"}
                </span>
              </td>
              <td class="time-cell">${l(e.created_at)}</td>
              <td>
                ${e.webflow_id&&e.slug?`
                  <a href="${f}/members/${e.slug}" target="_blank" class="action-btn view-btn">View</a>
                `:"--"}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}function q(t){return t.length===0?'<div class="empty-state">All active members have complete profiles</div>':`
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
          ${t.map(e=>{const i=v(e);return`
              <tr>
                <td>
                  <div class="name-cell">${e.name||e.first_name||"No name"}</div>
                  <div class="email-cell">${e.email||"--"}</div>
                </td>
                <td>
                  <div class="missing-fields">
                    ${i.slice(0,3).map(a=>`<span class="missing-field">${a}</span>`).join("")}
                    ${i.length>3?`<span class="missing-field">+${i.length-3}</span>`:""}
                  </div>
                </td>
                <td class="time-cell">
                  ${e.profile_reminder_sent_at?l(e.profile_reminder_sent_at):"--"}
                </td>
                <td class="time-cell">${l(e.created_at)}</td>
                <td>
                  <div class="action-btns">
                    ${e.profile_reminder_sent_at?`
                      <button class="action-btn contacted" disabled>Contacted</button>
                    `:`
                      <button class="action-btn contact-btn" data-member-id="${e.id}">Contact</button>
                    `}
                    ${e.webflow_id&&e.slug?`
                      <a href="${f}/members/${e.slug}" target="_blank" class="action-btn">View</a>
                    `:""}
                  </div>
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    `}function D(t){return t.length===0?'<div class="empty-state">No failed signups found</div>':`
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
              <td class="time-cell">${l(e.created_at)}</td>
              <td>
                ${e.profile_reminder_sent_at?`
                  <button class="action-btn contacted" disabled>Contacted</button>
                `:`
                  <button class="action-btn contact-btn" data-member-id="${e.id}">Contact</button>
                `}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}function R(t,e){return`
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
            ${t.map(i=>{let a="draft";return i.is_archived?a="archived":i.is_draft?a="pending":a="published",`
                <tr>
                  <td>
                    <div class="name-cell">${i.name||"Untitled"}</div>
                    <div class="email-cell">${i.member_contact_email||"--"}</div>
                  </td>
                  <td>
                    <span class="status ${a==="published"?"complete":a==="pending"?"pending":"draft"}">
                      ${a}
                    </span>
                  </td>
                  <td>
                    <span class="status ${i.webflow_id?"synced":"pending"}">
                      ${i.webflow_id?"Synced":"--"}
                    </span>
                  </td>
                  <td class="time-cell">${l(i.created_at)}</td>
                  <td>
                    <div class="action-btns">
                      ${a==="pending"?`
                        <button class="action-btn approve-btn" data-event-id="${i.id}" data-event-name="${i.name}">Approve</button>
                        <button class="action-btn reject-btn" data-event-id="${i.id}" data-event-name="${i.name}">Reject</button>
                      `:""}
                      ${i.webflow_id&&i.slug?`
                        <a href="${f}/event/${i.slug}" target="_blank" class="action-btn view-btn">View</a>
                      `:""}
                    </div>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      `}
    `}function U(t){return t.length===0?'<div class="empty-state">No projects found</div>':`
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
              <td class="time-cell">${l(e.updated_at)}</td>
              <td>
                ${e.webflow_id&&e.slug?`
                  <a href="${f}/projects/${e.slug}" target="_blank" class="action-btn view-btn">View</a>
                `:"--"}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}function F(t){if(!t||t.length===0)return'<div class="empty-state">No recent activity</div>';const e=a=>a==="profile_update"?{class:"profile",icon:"👤"}:a.startsWith("project_")?{class:"project",icon:"📁"}:a.startsWith("event_")?{class:"event",icon:"📅"}:a==="subscription_canceled"?{class:"canceled",icon:"🚫"}:a==="subscription_reactivated"?{class:"reactivated",icon:"✅"}:{class:"",icon:"📝"},i=a=>a.entity_webflow_url?a.entity_webflow_url:a.member_webflow_url?a.member_webflow_url:null;return`
      <div class="activity-feed">
        ${t.map(a=>{const n=e(a.activity_type),o=i(a);return`
            <div class="activity-item">
              ${a.member_profile_image?`
                <div class="activity-avatar">
                  <img src="${a.member_profile_image}" alt="${a.member_name}">
                </div>
              `:`
                <div class="activity-icon ${n.class}">${n.icon}</div>
              `}
              <div class="activity-content">
                <div class="activity-text">
                  <strong>${a.member_name}</strong> ${a.description}
                </div>
                <div class="activity-meta">
                  <span class="activity-time">${l(a.created_at)}</span>
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
    `}async function u(t){const e=t.querySelector("#refresh-btn");e&&(e.disabled=!0,e.textContent="Loading...");try{b=await g(),h(t,b)}catch(i){console.error("Error refreshing dashboard:",i),e&&(e.disabled=!1,e.textContent="Refresh")}}async function y(){const t=document.querySelector(".dashboard-feed");if(!t){console.warn("Could not find .dashboard-feed container");return}if(typeof window.supabase>"u"){t.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error: Supabase library not loaded</div>
          </div>
        </div>
      `;return}if(d=window.supabase.createClient(m,p),!document.querySelector("#admin-dashboard-styles")){const e=document.createElement("style");e.id="admin-dashboard-styles",e.textContent=w,document.head.appendChild(e)}t.innerHTML=`
      <div class="admin-dashboard">
        <div class="admin-loading">
          <div class="loader"></div>
          <div class="loading-text">Loading system data...</div>
        </div>
      </div>
    `;try{b=await g(),h(t,b)}catch(e){console.error("Error loading dashboard:",e),t.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error loading dashboard</div>
            <div style="color: #666; font-size: 11px; margin-top: 8px;">${e.message}</div>
          </div>
        </div>
      `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",y):y()})();
