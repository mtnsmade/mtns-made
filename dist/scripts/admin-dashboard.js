(function(){console.log("Admin dashboard v2 loaded");const m="https://epszwomtxkpjegbjbixr.supabase.co",_="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",c="https://www.mtnsmade.com.au";let d=null,p=null;const w=`
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
  `;function l(e){if(!e)return"--";const t=new Date(e),a=Math.floor((new Date-t)/1e3);return a<60?"now":a<3600?`${Math.floor(a/60)}m`:a<86400?`${Math.floor(a/3600)}h`:a<604800?`${Math.floor(a/86400)}d`:t.toLocaleDateString("en-AU",{day:"2-digit",month:"short"})}function $(){return new Date().toLocaleString("en-AU",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).toUpperCase()}function b(e){const t=[];return e.profile_image_url||t.push("Profile Image"),e.header_image_url||t.push("Header Image"),(!e.bio||e.bio.length<50)&&t.push("Bio"),e.suburb_id||t.push("Location"),t}function S(e,t){const i=e.first_name||e.name||"there",a=t.length>0?`

To complete your profile, you'll need:
${t.map(n=>`- ${n}`).join(`
`)}`:"";return`Hi ${i},

Thanks for being part of MTNS MADE! We noticed your profile isn't quite complete yet.

A complete profile helps other creatives find you in the directory and shows off your amazing work.${a}

Complete your profile here: ${c}/profile/start

Let us know if you need any help!

MTNS MADE Team`}async function u(){const[e,t,i,a,n,o,r,s,f]=await Promise.all([k(),E(),A(),z(),j(),T(),L(),M(),C()]);return{recentMembers:e,memberStats:t,incompleteProfiles:i,failedSignups:a,recentEvents:n,eventStats:o,recentProjects:r,messageStats:s,recentActivity:f,loadedAt:new Date}}async function k(){const{data:e,error:t}=await d.from("members").select(`
        id, memberstack_id, name, email, first_name, last_name, slug,
        subscription_status, profile_complete, webflow_id,
        profile_image_url, header_image_url, bio, suburb_id,
        created_at, updated_at
      `).order("created_at",{ascending:!1}).limit(20);return t?(console.error("Error loading recent members:",t),[]):e||[]}async function E(){const{data:e}=await d.from("members").select("id, subscription_status, profile_complete, webflow_id"),t=(e==null?void 0:e.length)||0,i=(e==null?void 0:e.filter(s=>s.subscription_status==="active").length)||0,a=(e==null?void 0:e.filter(s=>s.subscription_status==="lapsed").length)||0,n=(e==null?void 0:e.filter(s=>s.profile_complete).length)||0,o=(e==null?void 0:e.filter(s=>s.webflow_id).length)||0,r=(e==null?void 0:e.filter(s=>s.profile_complete&&!s.webflow_id&&s.subscription_status==="active").length)||0;return{total:t,active:i,lapsed:a,complete:n,synced:o,pendingSync:r}}async function M(){try{const e=new Date,t=new Date(e.getFullYear(),e.getMonth(),1).toISOString(),{data:i}=await d.from("messages").select("id, is_read, created_at"),{data:a}=await d.from("messages").select("id").gte("created_at",t),n=(i==null?void 0:i.length)||0,o=(i==null?void 0:i.filter(s=>!s.is_read).length)||0,r=(a==null?void 0:a.length)||0;return{total:n,unread:o,thisMonth:r}}catch(e){return console.error("Error loading message stats:",e),{total:0,unread:0,thisMonth:0}}}async function A(){const{data:e,error:t}=await d.from("members").select(`
        id, memberstack_id, name, email, first_name, slug, subscription_status,
        profile_complete, profile_reminder_sent_at, created_at,
        profile_image_url, header_image_url, bio, suburb_id
      `).eq("profile_complete",!1).eq("subscription_status","active").order("created_at",{ascending:!0});return t?(console.error("Error loading incomplete profiles:",t),[]):e||[]}async function z(){const{data:e,error:t}=await d.from("members").select(`
        id, memberstack_id, name, email, first_name, slug,
        subscription_status, profile_complete, profile_reminder_sent_at, created_at
      `).not("subscription_status","in",'("active","lapsed")').order("created_at",{ascending:!1}).limit(30);return t?(console.error("Error loading failed signups:",t),[]):e||[]}async function j(){const{data:e,error:t}=await d.from("events").select("id, name, slug, memberstack_id, member_contact_email, is_draft, is_archived, webflow_id, created_at").order("created_at",{ascending:!1}).limit(15);return t?(console.error("Error loading recent events:",t),[]):e||[]}async function T(){const{data:e}=await d.from("events").select("id, is_draft, is_archived, webflow_id"),t=(e==null?void 0:e.length)||0,i=(e==null?void 0:e.filter(n=>n.is_draft&&!n.is_archived).length)||0,a=(e==null?void 0:e.filter(n=>!n.is_draft&&!n.is_archived).length)||0;return{total:t,pending:i,published:a}}async function L(){const{data:e,error:t}=await d.from("projects").select(`
        id, name, slug, member_id, webflow_id, is_draft, is_deleted,
        created_at, updated_at
      `).eq("is_deleted",!1).order("updated_at",{ascending:!1}).limit(15);return t?(console.error("Error loading recent projects:",t),[]):e||[]}async function C(){const{data:e,error:t}=await d.from("activity_log").select(`
        id, member_id, memberstack_id, activity_type, description,
        entity_type, entity_id, entity_name,
        member_webflow_url, entity_webflow_url, created_at
      `).order("created_at",{ascending:!1}).limit(50);if(t)return console.error("Error loading recent activity:",t),[];const i=[...new Set(e.filter(n=>n.member_id).map(n=>n.member_id))];let a={};if(i.length>0){const{data:n}=await d.from("members").select("id, name, first_name, last_name, profile_image_url").in("id",i);n&&n.forEach(o=>{a[o.id]={name:o.name||`${o.first_name||""} ${o.last_name||""}`.trim()||"Unknown Member",profile_image_url:o.profile_image_url||null}})}return e.map(n=>{var o,r;return{...n,member_name:n.member_id&&((o=a[n.member_id])==null?void 0:o.name)||"Unknown Member",member_profile_image:n.member_id&&((r=a[n.member_id])==null?void 0:r.profile_image_url)||null}})}function P(e){const t=b(e),i=S(e,t),a=document.createElement("div");a.className="modal-overlay",a.innerHTML=`
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
                ${t.map(n=>`<span class="missing-field">${n}</span>`).join("")}
              </div>
            </div>
          `:""}
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="modal-cancel">Cancel</button>
          <button class="admin-btn primary" id="modal-send">Send Email</button>
        </div>
      </div>
    `,document.body.appendChild(a),a.querySelector(".modal-close").addEventListener("click",()=>a.remove()),a.querySelector("#modal-cancel").addEventListener("click",()=>a.remove()),a.addEventListener("click",n=>{n.target===a&&a.remove()}),a.querySelector("#modal-send").addEventListener("click",async()=>{const n=a.querySelector("#modal-to").value,o=a.querySelector("#modal-subject").value,r=a.querySelector("#modal-body").value;if(!n){alert("No email address available for this member");return}const s=a.querySelector("#modal-send");s.disabled=!0,s.textContent="Sending...";try{const x=await(await fetch(`${m}/functions/v1/send-email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:n,subject:o,text:r,html:r.replace(/\n/g,"<br>")})})).json();if(x.success){await d.from("members").update({profile_reminder_sent_at:new Date().toISOString()}).eq("id",e.id),alert("Email sent successfully!"),a.remove();const y=document.querySelector(".dashboard-feed");y&&v(y)}else alert("Failed to send email: "+(x.error||"Unknown error")),s.disabled=!1,s.textContent="Send Email"}catch(f){console.error("Error sending email:",f),alert("Error sending email. Check console for details."),s.disabled=!1,s.textContent="Send Email"}})}function g(e,t){const i=t.incompleteProfiles.length;t.eventStats.pending,e.innerHTML=`
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
        ${q(t)}

        <!-- Activity Tabs -->
        <div class="admin-section">
          <div class="tabs-container">
            <button class="tab-btn active" data-tab="members">Recent Members</button>
            <button class="tab-btn" data-tab="incomplete">Incomplete (${i})</button>
            <button class="tab-btn" data-tab="failed">Failed Signups (${t.failedSignups.length})</button>
            <button class="tab-btn" data-tab="events">Events</button>
            <button class="tab-btn" data-tab="projects">Projects</button>
            <button class="tab-btn" data-tab="activity">Activity</button>
          </div>

          <div class="tab-content active" id="tab-members">
            ${D(t.recentMembers)}
          </div>

          <div class="tab-content" id="tab-incomplete">
            ${I(t.incompleteProfiles)}
          </div>

          <div class="tab-content" id="tab-failed">
            ${N(t.failedSignups)}
          </div>

          <div class="tab-content" id="tab-events">
            ${U(t.recentEvents,t.eventStats)}
          </div>

          <div class="tab-content" id="tab-projects">
            ${R(t.recentProjects)}
          </div>

          <div class="tab-content" id="tab-activity">
            ${F(t.recentActivity)}
          </div>
        </div>
      </div>
    `,e.querySelectorAll(".tab-btn").forEach(a=>{a.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(n=>n.classList.remove("active")),e.querySelectorAll(".tab-content").forEach(n=>n.classList.remove("active")),a.classList.add("active"),e.querySelector(`#tab-${a.dataset.tab}`).classList.add("active")})}),e.querySelector("#refresh-btn").addEventListener("click",()=>v(e)),e.querySelectorAll(".contact-btn").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.memberId,o=t.incompleteProfiles.find(r=>r.id===n)||t.recentMembers.find(r=>r.id===n)||t.failedSignups.find(r=>r.id===n);o&&P(o)})})}function q(e){const t=[];e.memberStats.pendingSync>0&&t.push({type:"warning",text:"Members pending Webflow sync",count:e.memberStats.pendingSync});const i=e.incompleteProfiles.filter(a=>(Date.now()-new Date(a.created_at))/864e5>7&&!a.profile_reminder_sent_at);return i.length>0&&t.push({type:"info",text:"Incomplete profiles (7+ days, no reminder sent)",count:i.length}),e.eventStats.pending>0&&t.push({type:"info",text:"Events pending review",count:e.eventStats.pending}),e.memberStats.lapsed>0&&t.push({type:"error",text:"Lapsed subscriptions",count:e.memberStats.lapsed}),t.length===0?`
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
          ${t.map(a=>`
            <div class="issue-item">
              <div class="issue-icon ${a.type}"></div>
              <div class="issue-text">${a.text}</div>
              <div class="issue-count">${a.count}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `}function D(e){return e.length===0?'<div class="empty-state">No members found</div>':`
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
          ${e.map(t=>`
            <tr>
              <td>
                <div class="name-cell">${t.name||t.first_name||"No name"}</div>
                <div class="email-cell">${t.email||"--"}</div>
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
              <td>
                <span class="status ${t.webflow_id?"synced":"pending"}">
                  ${t.webflow_id?"Synced":"Pending"}
                </span>
              </td>
              <td class="time-cell">${l(t.created_at)}</td>
              <td>
                ${t.webflow_id&&t.slug?`
                  <a href="${c}/members/${t.slug}" target="_blank" class="action-btn view-btn">View</a>
                `:"--"}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}function I(e){return e.length===0?'<div class="empty-state">All active members have complete profiles</div>':`
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
          ${e.map(t=>{const i=b(t);return`
              <tr>
                <td>
                  <div class="name-cell">${t.name||t.first_name||"No name"}</div>
                  <div class="email-cell">${t.email||"--"}</div>
                </td>
                <td>
                  <div class="missing-fields">
                    ${i.slice(0,3).map(a=>`<span class="missing-field">${a}</span>`).join("")}
                    ${i.length>3?`<span class="missing-field">+${i.length-3}</span>`:""}
                  </div>
                </td>
                <td class="time-cell">
                  ${t.profile_reminder_sent_at?l(t.profile_reminder_sent_at):"--"}
                </td>
                <td class="time-cell">${l(t.created_at)}</td>
                <td>
                  <div class="action-btns">
                    ${t.profile_reminder_sent_at?`
                      <button class="action-btn contacted" disabled>Contacted</button>
                    `:`
                      <button class="action-btn contact-btn" data-member-id="${t.id}">Contact</button>
                    `}
                    ${t.webflow_id&&t.slug?`
                      <a href="${c}/members/${t.slug}" target="_blank" class="action-btn">View</a>
                    `:""}
                  </div>
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    `}function N(e){return e.length===0?'<div class="empty-state">No failed signups found</div>':`
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
              <td class="time-cell">${l(t.created_at)}</td>
              <td>
                ${t.profile_reminder_sent_at?`
                  <button class="action-btn contacted" disabled>Contacted</button>
                `:`
                  <button class="action-btn contact-btn" data-member-id="${t.id}">Contact</button>
                `}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}function U(e,t){return`
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
            ${e.map(i=>{let a="draft";return i.is_archived?a="archived":i.is_draft?a="pending":a="published",`
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
                    ${i.webflow_id&&i.slug?`
                      <a href="${c}/event/${i.slug}" target="_blank" class="action-btn view-btn">View</a>
                    `:"--"}
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      `}
    `}function R(e){return e.length===0?'<div class="empty-state">No projects found</div>':`
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
              <td class="time-cell">${l(t.updated_at)}</td>
              <td>
                ${t.webflow_id&&t.slug?`
                  <a href="${c}/projects/${t.slug}" target="_blank" class="action-btn view-btn">View</a>
                `:"--"}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}function F(e){if(!e||e.length===0)return'<div class="empty-state">No recent activity</div>';const t=a=>a==="profile_update"?{class:"profile",icon:"👤"}:a.startsWith("project_")?{class:"project",icon:"📁"}:a.startsWith("event_")?{class:"event",icon:"📅"}:a==="subscription_canceled"?{class:"canceled",icon:"🚫"}:a==="subscription_reactivated"?{class:"reactivated",icon:"✅"}:{class:"",icon:"📝"},i=a=>a.entity_webflow_url?a.entity_webflow_url:a.member_webflow_url?a.member_webflow_url:null;return`
      <div class="activity-feed">
        ${e.map(a=>{const n=t(a.activity_type),o=i(a);return`
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
    `}async function v(e){const t=e.querySelector("#refresh-btn");t&&(t.disabled=!0,t.textContent="Loading...");try{p=await u(),g(e,p)}catch(i){console.error("Error refreshing dashboard:",i),t&&(t.disabled=!1,t.textContent="Refresh")}}async function h(){const e=document.querySelector(".dashboard-feed");if(!e){console.warn("Could not find .dashboard-feed container");return}if(typeof window.supabase>"u"){e.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error: Supabase library not loaded</div>
          </div>
        </div>
      `;return}if(d=window.supabase.createClient(m,_),!document.querySelector("#admin-dashboard-styles")){const t=document.createElement("style");t.id="admin-dashboard-styles",t.textContent=w,document.head.appendChild(t)}e.innerHTML=`
      <div class="admin-dashboard">
        <div class="admin-loading">
          <div class="loader"></div>
          <div class="loading-text">Loading system data...</div>
        </div>
      </div>
    `;try{p=await u(),g(e,p)}catch(t){console.error("Error loading dashboard:",t),e.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error loading dashboard</div>
            <div style="color: #666; font-size: 11px; margin-top: 8px;">${t.message}</div>
          </div>
        </div>
      `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",h):h()})();
