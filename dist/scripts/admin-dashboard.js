(function(){console.log("Admin dashboard v2 loaded");const v="https://epszwomtxkpjegbjbixr.supabase.co",g="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",h="https://www.mtnsmade.com.au";let d=null,y=null,x=[];const j=`
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
  `;function c(a){if(!a)return"--";const e=new Date(a),t=Math.floor((new Date-e)/1e3);return t<60?"now":t<3600?`${Math.floor(t/60)}m`:t<86400?`${Math.floor(t/3600)}h`:t<604800?`${Math.floor(t/86400)}d`:e.toLocaleDateString("en-AU",{day:"2-digit",month:"short"})}function T(){return new Date().toLocaleString("en-AU",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).toUpperCase()}function _(a){const e=[];return a.profile_image_url||e.push("Profile Image"),a.header_image_url||e.push("Header Image"),(!a.bio||a.bio.length<50)&&e.push("Bio"),a.suburb_id||e.push("Location"),e}function A(a,e){const n=a.first_name||a.name||"there",t=e.length>0?`

To complete your profile, you'll need:
${e.map(i=>`- ${i}`).join(`
`)}`:"";return`Hi ${n},

Thanks for being part of MTNS MADE! We noticed your profile isn't quite complete yet.

A complete profile helps other creatives find you in the directory and shows off your amazing work.${t}

Complete your profile here: ${h}/profile/start

Let us know if you need any help!

MTNS MADE Team`}async function w(){const[a,e,n,t,i,s,o,r,l,p]=await Promise.all([C(),q(),I(),N(),P(),D(),U(),L(),R(),z()]);return x=p,{recentMembers:a,memberStats:e,incompleteProfiles:n,failedSignups:t,recentEvents:i,eventStats:s,recentProjects:o,messageStats:r,recentActivity:l,membershipTypes:p,loadedAt:new Date}}async function C(){const{data:a,error:e}=await d.from("members").select(`
        id, memberstack_id, name, email, first_name, last_name, slug,
        subscription_status, profile_complete, webflow_id,
        profile_image_url, header_image_url, bio, suburb_id,
        membership_type_id, membership_types(id, name),
        created_at, updated_at
      `).neq("is_deleted",!0).order("created_at",{ascending:!1}).limit(20);return e?(console.error("Error loading recent members:",e),[]):a||[]}async function q(){const{data:a}=await d.from("members").select("id, subscription_status, profile_complete, webflow_id").neq("is_deleted",!0),e=(a==null?void 0:a.length)||0,n=(a==null?void 0:a.filter(r=>r.subscription_status==="active").length)||0,t=(a==null?void 0:a.filter(r=>r.subscription_status==="lapsed").length)||0,i=(a==null?void 0:a.filter(r=>r.profile_complete).length)||0,s=(a==null?void 0:a.filter(r=>r.webflow_id).length)||0,o=(a==null?void 0:a.filter(r=>r.profile_complete&&!r.webflow_id&&r.subscription_status==="active").length)||0;return{total:e,active:n,lapsed:t,complete:i,synced:s,pendingSync:o}}async function z(){const{data:a,error:e}=await d.from("membership_types").select("id, name").order("name");return e?(console.error("Error loading membership types:",e),[]):a||[]}async function L(){try{const a=new Date,e=new Date(a.getFullYear(),a.getMonth(),1).toISOString(),{data:n}=await d.from("messages").select("id, is_read, created_at"),{data:t}=await d.from("messages").select("id").gte("created_at",e),i=(n==null?void 0:n.length)||0,s=(n==null?void 0:n.filter(r=>!r.is_read).length)||0,o=(t==null?void 0:t.length)||0;return{total:i,unread:s,thisMonth:o}}catch(a){return console.error("Error loading message stats:",a),{total:0,unread:0,thisMonth:0}}}async function I(){const{data:a,error:e}=await d.from("members").select(`
        id, memberstack_id, name, email, first_name, slug, subscription_status,
        profile_complete, profile_reminder_sent_at, created_at,
        profile_image_url, header_image_url, bio, suburb_id
      `).eq("profile_complete",!1).eq("subscription_status","active").neq("is_deleted",!0).order("created_at",{ascending:!0});return e?(console.error("Error loading incomplete profiles:",e),[]):a||[]}async function N(){const{data:a,error:e}=await d.from("members").select(`
        id, memberstack_id, name, email, first_name, slug,
        subscription_status, profile_complete, profile_reminder_sent_at, created_at
      `).not("subscription_status","in",'("active","lapsed","deleted")').neq("is_deleted",!0).order("created_at",{ascending:!1}).limit(30);return e?(console.error("Error loading failed signups:",e),[]):a||[]}async function P(){const{data:a,error:e}=await d.from("events").select("id, name, slug, memberstack_id, member_contact_email, is_draft, is_archived, webflow_id, created_at").order("created_at",{ascending:!1}).limit(15);return e?(console.error("Error loading recent events:",e),[]):a||[]}async function D(){const{data:a}=await d.from("events").select("id, is_draft, is_archived, webflow_id"),e=(a==null?void 0:a.length)||0,n=(a==null?void 0:a.filter(i=>i.is_draft&&!i.is_archived).length)||0,t=(a==null?void 0:a.filter(i=>!i.is_draft&&!i.is_archived).length)||0;return{total:e,pending:n,published:t}}async function U(){const{data:a,error:e}=await d.from("projects").select(`
        id, name, slug, member_id, webflow_id, is_draft, is_deleted,
        created_at, updated_at
      `).eq("is_deleted",!1).order("updated_at",{ascending:!1}).limit(15);return e?(console.error("Error loading recent projects:",e),[]):a||[]}async function R(){const{data:a,error:e}=await d.from("activity_log").select(`
        id, member_id, memberstack_id, activity_type, description,
        entity_type, entity_id, entity_name,
        member_webflow_url, entity_webflow_url, created_at
      `).order("created_at",{ascending:!1}).limit(50);if(e)return console.error("Error loading recent activity:",e),[];const n=[...new Set(a.filter(i=>i.member_id).map(i=>i.member_id))];let t={};if(n.length>0){const{data:i}=await d.from("members").select("id, name, first_name, last_name, profile_image_url").in("id",n);i&&i.forEach(s=>{t[s.id]={name:s.name||`${s.first_name||""} ${s.last_name||""}`.trim()||"Unknown Member",profile_image_url:s.profile_image_url||null}})}return a.map(i=>{var s,o;return{...i,member_name:i.member_id&&((s=t[i.member_id])==null?void 0:s.name)||"Unknown Member",member_profile_image:i.member_id&&((o=t[i.member_id])==null?void 0:o.profile_image_url)||null}})}function O(a){const e=_(a),n=A(a,e),t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Contact Member</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label class="form-label">To</label>
            <input type="text" class="form-input" id="modal-to" value="${a.email||""}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">Subject</label>
            <input type="text" class="form-input" id="modal-subject" value="Complete your MTNS MADE profile">
          </div>
          <div class="form-field">
            <label class="form-label">Message</label>
            <textarea class="form-input" id="modal-body">${n}</textarea>
            <div class="form-hint">Edit the message above as needed</div>
          </div>
          ${e.length>0?`
            <div class="form-field">
              <label class="form-label">Missing Fields Detected</label>
              <div class="missing-fields">
                ${e.map(i=>`<span class="missing-field">${i}</span>`).join("")}
              </div>
            </div>
          `:""}
        </div>
        <div class="modal-footer">
          <button class="admin-btn" id="modal-cancel">Cancel</button>
          <button class="admin-btn primary" id="modal-send">Send Email</button>
        </div>
      </div>
    `,document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",()=>t.remove()),t.querySelector("#modal-cancel").addEventListener("click",()=>t.remove()),t.addEventListener("click",i=>{i.target===t&&t.remove()}),t.querySelector("#modal-send").addEventListener("click",async()=>{const i=t.querySelector("#modal-to").value,s=t.querySelector("#modal-subject").value,o=t.querySelector("#modal-body").value;if(!i){alert("No email address available for this member");return}const r=t.querySelector("#modal-send");r.disabled=!0,r.textContent="Sending...";try{const p=await(await fetch(`${v}/functions/v1/send-email`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:i,subject:s,text:o,html:o.replace(/\n/g,"<br>")})})).json();if(p.success){await d.from("members").update({profile_reminder_sent_at:new Date().toISOString()}).eq("id",a.id),alert("Email sent successfully!"),t.remove();const m=document.querySelector(".dashboard-feed");m&&f(m)}else alert("Failed to send email: "+(p.error||"Unknown error")),r.disabled=!1,r.textContent="Send Email"}catch(l){console.error("Error sending email:",l),alert("Error sending email. Check console for details."),r.disabled=!1,r.textContent="Send Email"}})}function F(a,e,n){var s;const t=((s=x.find(o=>o.id===n))==null?void 0:s.name)||"Not set",i=document.createElement("div");i.className="modal-overlay",i.innerHTML=`
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
            <input type="text" class="form-input" value="${t}" readonly>
          </div>
          <div class="form-field">
            <label class="form-label">New Membership Type</label>
            <select class="form-input" id="modal-membership-type">
              <option value="">-- Select New Type --</option>
              ${x.map(o=>`
                <option value="${o.id}" ${o.id===n?"disabled":""}>
                  ${o.name}${o.id===n?" (current)":""}
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
    `,document.body.appendChild(i),i.querySelector(".modal-close").addEventListener("click",()=>i.remove()),i.querySelector("#modal-cancel").addEventListener("click",()=>i.remove()),i.addEventListener("click",o=>{o.target===i&&i.remove()}),i.querySelector("#modal-save").addEventListener("click",async()=>{var k;const o=i.querySelector("#modal-membership-type").value,r=i.querySelector("#modal-skip-billing").checked;if(!o){alert("Please select a new membership type");return}const l=((k=x.find(b=>b.id===o))==null?void 0:k.name)||"Unknown",p=r?`Change ${e}'s type from "${t}" to "${l}"?

This will update the label only (no billing change).`:`Change ${e}'s type from "${t}" to "${l}"?

This WILL change their Stripe subscription and billing.`;if(!confirm(p))return;const m=i.querySelector("#modal-save");m.disabled=!0,m.textContent="Updating Memberstack...";try{const b=await fetch(`${v}/functions/v1/admin-update-member`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({memberId:a,newMembershipTypeId:o,skipPlanChange:r})}),u=await b.json();if(!b.ok)throw new Error(u.error||"Update failed");let E=`Membership type updated!

${u.change.from} → ${u.change.to}`;u.results.warnings&&u.results.warnings.length>0&&(E+=`

Warnings:
- ${u.results.warnings.join(`
- `)}`),alert(E),i.remove();const M=document.querySelector(".dashboard-feed");M&&f(M)}catch(b){console.error("Error updating membership type:",b),alert("Error updating membership type: "+b.message),m.disabled=!1,m.textContent="Update Membership"}})}function $(a,e){const n=e.incompleteProfiles.length;e.eventStats.pending,a.innerHTML=`
      <div class="admin-dashboard">
        <div class="admin-header">
          <h1>MTNS MADE // System Dashboard</h1>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span class="admin-timestamp">Updated: ${T()}</span>
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
          <div class="stat-cell ${n>5?"alert":""}">
            <div class="stat-value">${e.memberStats.complete}/${e.memberStats.total}</div>
            <div class="stat-label">Profiles Complete</div>
          </div>
          <div class="stat-cell">
            <div class="stat-value">${e.messageStats.thisMonth}</div>
            <div class="stat-label">Messages This Month</div>
          </div>
        </div>

        <!-- Issues Section -->
        ${W(e)}

        <!-- Activity Tabs -->
        <div class="admin-section">
          <div class="tabs-container">
            <button class="tab-btn active" data-tab="activity">Activity</button>
            <button class="tab-btn" data-tab="members">Recent Members</button>
            <button class="tab-btn" data-tab="incomplete">Incomplete (${n})</button>
            <button class="tab-btn" data-tab="failed">Failed Signups (${e.failedSignups.length})</button>
            <button class="tab-btn" data-tab="events">Events</button>
            <button class="tab-btn" data-tab="projects">Projects</button>
          </div>

          <div class="tab-content active" id="tab-activity">
            ${Y(e.recentActivity)}
          </div>

          <div class="tab-content" id="tab-members">
            ${B(e.recentMembers)}
          </div>

          <div class="tab-content" id="tab-incomplete">
            ${H(e.incompleteProfiles)}
          </div>

          <div class="tab-content" id="tab-failed">
            ${J(e.failedSignups)}
          </div>

          <div class="tab-content" id="tab-events">
            ${V(e.recentEvents,e.eventStats)}
          </div>

          <div class="tab-content" id="tab-projects">
            ${G(e.recentProjects)}
          </div>
        </div>
      </div>
    `,a.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",()=>{a.querySelectorAll(".tab-btn").forEach(i=>i.classList.remove("active")),a.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active")),t.classList.add("active"),a.querySelector(`#tab-${t.dataset.tab}`).classList.add("active")})}),a.querySelector("#refresh-btn").addEventListener("click",()=>f(a)),a.querySelectorAll(".contact-btn").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.memberId,s=e.incompleteProfiles.find(o=>o.id===i)||e.recentMembers.find(o=>o.id===i)||e.failedSignups.find(o=>o.id===i);s&&O(s)})}),a.querySelectorAll(".approve-btn").forEach(t=>{t.addEventListener("click",async()=>{const i=t.dataset.eventId,s=t.dataset.eventName;if(confirm(`Approve event "${s}"?

This will publish the event and notify the member.`)){t.disabled=!0,t.textContent="Approving...";try{const r=await(await fetch(`${v}/functions/v1/manage-event`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`,apikey:g},body:JSON.stringify({eventId:i,action:"approve"})})).json();r.success?(alert(`Event "${s}" has been approved!

The member will be notified and the event will sync to Webflow.`),f(a)):(alert(`Failed to approve event: ${r.error}`),t.disabled=!1,t.textContent="Approve")}catch(o){console.error("Approve error:",o),alert("Error approving event. Please try again."),t.disabled=!1,t.textContent="Approve"}}})}),a.querySelectorAll(".reject-btn").forEach(t=>{t.addEventListener("click",async()=>{const i=t.dataset.eventId,s=t.dataset.eventName,o=prompt(`Reject event "${s}"?

Optionally enter a reason (or leave blank):`);if(o!==null){t.disabled=!0,t.textContent="Rejecting...";try{const l=await(await fetch(`${v}/functions/v1/manage-event`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${g}`,apikey:g},body:JSON.stringify({eventId:i,action:"reject",rejectionReason:o||void 0})})).json();l.success?(alert(`Event "${s}" has been rejected.

The member will be notified.`),f(a)):(alert(`Failed to reject event: ${l.error}`),t.disabled=!1,t.textContent="Reject")}catch(r){console.error("Reject error:",r),alert("Error rejecting event. Please try again."),t.disabled=!1,t.textContent="Reject"}}})}),a.querySelectorAll(".edit-btn").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.memberId,s=t.dataset.memberName,o=t.dataset.currentType;F(i,s,o)})}),a.querySelectorAll(".delete-btn").forEach(t=>{t.addEventListener("click",async()=>{const i=t.dataset.memberId,s=t.dataset.memberName;if(confirm(`Delete "${s}"?

This will remove them from the dashboard and Webflow directory. This action cannot be undone.`)){t.disabled=!0,t.textContent="Deleting...";try{const{error:o}=await d.from("members").update({is_deleted:!0,subscription_status:"deleted",updated_at:new Date().toISOString()}).eq("id",i);if(o)throw o;alert(`"${s}" has been deleted.`),f(a)}catch(o){console.error("Delete error:",o),alert("Error deleting member. Please try again."),t.disabled=!1,t.textContent="Delete"}}})})}function W(a){const e=[];a.memberStats.pendingSync>0&&e.push({type:"warning",text:"Members pending Webflow sync",count:a.memberStats.pendingSync});const n=a.incompleteProfiles.filter(t=>(Date.now()-new Date(t.created_at))/864e5>7&&!t.profile_reminder_sent_at);return n.length>0&&e.push({type:"info",text:"Incomplete profiles (7+ days, no reminder sent)",count:n.length}),a.eventStats.pending>0&&e.push({type:"info",text:"Events pending review",count:a.eventStats.pending}),a.memberStats.lapsed>0&&e.push({type:"error",text:"Lapsed subscriptions",count:a.memberStats.lapsed}),e.length===0?`
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
          ${e.map(t=>`
            <div class="issue-item">
              <div class="issue-icon ${t.type}"></div>
              <div class="issue-text">${t.text}</div>
              <div class="issue-count">${t.count}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `}function B(a){return a.length===0?'<div class="empty-state">No members found</div>':`
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
          ${a.map(e=>{var n;return`
            <tr>
              <td>
                <div class="name-cell">${e.name||e.first_name||"No name"}</div>
                <div class="email-cell">${e.email||"--"}</div>
              </td>
              <td>
                <span class="type-cell">${((n=e.membership_types)==null?void 0:n.name)||"Not set"}</span>
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
              <td class="time-cell">${c(e.created_at)}</td>
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
    `}function H(a){return a.length===0?'<div class="empty-state">All active members have complete profiles</div>':`
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
          ${a.map(e=>{const n=_(e);return`
              <tr>
                <td>
                  <div class="name-cell">${e.name||e.first_name||"No name"}</div>
                  <div class="email-cell">${e.email||"--"}</div>
                </td>
                <td>
                  <div class="missing-fields">
                    ${n.slice(0,3).map(t=>`<span class="missing-field">${t}</span>`).join("")}
                    ${n.length>3?`<span class="missing-field">+${n.length-3}</span>`:""}
                  </div>
                </td>
                <td class="time-cell">
                  ${e.profile_reminder_sent_at?c(e.profile_reminder_sent_at):"--"}
                </td>
                <td class="time-cell">${c(e.created_at)}</td>
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
    `}function J(a){return a.length===0?'<div class="empty-state">No failed signups found</div>':`
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
          ${a.map(e=>`
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
              <td class="time-cell">${c(e.created_at)}</td>
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
    `}function V(a,e){return`
      <div style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; font-size: 11px; color: #666;">
        <span style="margin-right: 24px;"><strong style="color: #f59f00;">${e.pending}</strong> Pending</span>
        <span><strong style="color: #1a1a1a;">${e.published}</strong> Published</span>
      </div>
      ${a.length===0?'<div class="empty-state">No events found</div>':`
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
            ${a.map(n=>{let t="draft";return n.is_archived?t="archived":n.is_draft?t="pending":t="published",`
                <tr>
                  <td>
                    <div class="name-cell">${n.name||"Untitled"}</div>
                    <div class="email-cell">${n.member_contact_email||"--"}</div>
                  </td>
                  <td>
                    <span class="status ${t==="published"?"complete":t==="pending"?"pending":"draft"}">
                      ${t}
                    </span>
                  </td>
                  <td>
                    <span class="status ${n.webflow_id?"synced":"pending"}">
                      ${n.webflow_id?"Synced":"--"}
                    </span>
                  </td>
                  <td class="time-cell">${c(n.created_at)}</td>
                  <td>
                    <div class="action-btns">
                      ${t==="pending"?`
                        <button class="action-btn approve-btn" data-event-id="${n.id}" data-event-name="${n.name}">Approve</button>
                        <button class="action-btn reject-btn" data-event-id="${n.id}" data-event-name="${n.name}">Reject</button>
                      `:""}
                      ${n.webflow_id&&n.slug?`
                        <a href="${h}/event/${n.slug}" target="_blank" class="action-btn view-btn">View</a>
                      `:""}
                    </div>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      `}
    `}function G(a){return a.length===0?'<div class="empty-state">No projects found</div>':`
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
          ${a.map(e=>`
            <tr>
              <td>
                <div class="name-cell">${e.name||"Untitled"}</div>
              </td>
              <td>
                <span class="status ${e.webflow_id?"synced":"pending"}">
                  ${e.webflow_id?"Synced":"Pending"}
                </span>
              </td>
              <td class="time-cell">${c(e.updated_at)}</td>
              <td>
                ${e.webflow_id&&e.slug?`
                  <a href="${h}/projects/${e.slug}" target="_blank" class="action-btn view-btn">View</a>
                `:"--"}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}function Y(a){if(!a||a.length===0)return'<div class="empty-state">No recent activity</div>';const e=t=>t==="member_signup"?{class:"signup",icon:"🎉"}:t==="profile_update"?{class:"profile",icon:"👤"}:t.startsWith("project_")?{class:"project",icon:"📁"}:t.startsWith("event_")?{class:"event",icon:"📅"}:t==="subscription_canceled"?{class:"canceled",icon:"🚫"}:t==="subscription_reactivated"?{class:"reactivated",icon:"✅"}:{class:"",icon:"📝"},n=t=>t.activity_type==="member_signup"?null:t.entity_webflow_url?t.entity_webflow_url:t.member_webflow_url?t.member_webflow_url:null;return`
      <div class="activity-feed">
        ${a.map(t=>{const i=e(t.activity_type),s=n(t);return`
            <div class="activity-item">
              ${t.member_profile_image?`
                <div class="activity-avatar">
                  <img src="${t.member_profile_image}" alt="${t.member_name}">
                </div>
              `:`
                <div class="activity-icon ${i.class}">${i.icon}</div>
              `}
              <div class="activity-content">
                <div class="activity-text">
                  <strong>${t.member_name}</strong> ${t.description}
                </div>
                <div class="activity-meta">
                  <span class="activity-time">${c(t.created_at)}</span>
                </div>
              </div>
              <div class="activity-action">
                ${s?`
                  <a href="${s}" target="_blank" class="action-btn">View</a>
                `:""}
              </div>
            </div>
          `}).join("")}
      </div>
    `}async function f(a){const e=a.querySelector("#refresh-btn");e&&(e.disabled=!0,e.textContent="Loading...");try{y=await w(),$(a,y)}catch(n){console.error("Error refreshing dashboard:",n),e&&(e.disabled=!1,e.textContent="Refresh")}}async function S(){const a=document.querySelector(".dashboard-feed");if(!a){console.warn("Could not find .dashboard-feed container");return}if(typeof window.supabase>"u"){a.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error: Supabase library not loaded</div>
          </div>
        </div>
      `;return}if(d=window.supabase.createClient(v,g),!document.querySelector("#admin-dashboard-styles")){const e=document.createElement("style");e.id="admin-dashboard-styles",e.textContent=j,document.head.appendChild(e)}a.innerHTML=`
      <div class="admin-dashboard">
        <div class="admin-loading">
          <div class="loader"></div>
          <div class="loading-text">Loading system data...</div>
        </div>
      </div>
    `;try{y=await w(),$(a,y)}catch(e){console.error("Error loading dashboard:",e),a.innerHTML=`
        <div class="admin-dashboard">
          <div class="admin-loading">
            <div class="loading-text">Error loading dashboard</div>
            <div style="color: #666; font-size: 11px; margin-top: 8px;">${e.message}</div>
          </div>
        </div>
      `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",S):S()})();
