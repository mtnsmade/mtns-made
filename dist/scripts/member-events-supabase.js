(function(){console.log("Member events Supabase script loaded");const L="https://epszwomtxkpjegbjbixr.supabase.co",w="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",F=90;let g=null,l=null,m=[],$=[];const c={DRAFT:"draft",PENDING_REVIEW:"pending_review",PUBLISHED:"published",CHANGES_REQUESTED:"changes_requested"},B=`
    .me-container {
      font-family: inherit;
      width: 100%;
    }
    .me-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .me-header h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
    .me-btn {
      background: #333;
      color: #fff;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .me-btn:hover {
      background: #555;
    }
    .me-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .me-btn-secondary {
      background: #fff;
      color: #333;
      border: 1px solid #ddd;
    }
    .me-btn-secondary:hover {
      background: #f5f5f5;
    }
    .me-btn-danger {
      background: #dc3545;
    }
    .me-btn-danger:hover {
      background: #c82333;
    }
    .me-btn-success {
      background: #28a745;
    }
    .me-btn-success:hover {
      background: #218838;
    }
    .me-btn-small {
      padding: 8px 16px;
      font-size: 13px;
    }
    .me-loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .me-empty {
      text-align: center;
      padding: 60px 20px;
      background: #f9f9f9;
      border-radius: 8px;
      border: 2px dashed #ddd;
    }
    .me-empty p {
      margin: 0 0 20px 0;
      color: #666;
      font-size: 16px;
    }

    /* Event Cards */
    .me-events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    .me-event-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fff;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .me-event-image {
      width: 100%;
      aspect-ratio: 16/9;
      background: #f0f0f0;
      position: relative;
      overflow: hidden;
    }
    .me-event-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .me-event-image .me-no-image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #999;
      font-size: 14px;
    }
    .me-event-status {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .me-status-draft {
      background: #6c757d;
      color: #fff;
    }
    .me-status-pending_review {
      background: #ffc107;
      color: #333;
    }
    .me-status-published {
      background: #28a745;
      color: #fff;
    }
    .me-status-changes_requested {
      background: #dc3545;
      color: #fff;
    }
    .me-event-body {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .me-event-title {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .me-event-date {
      font-size: 14px;
      color: #007bff;
      margin-bottom: 8px;
    }
    .me-event-location {
      font-size: 13px;
      color: #666;
      margin-bottom: 12px;
    }
    .me-event-description {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      flex: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .me-event-actions {
      display: flex;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid #e0e0e0;
      background: #fafafa;
    }
    .me-event-actions .me-btn {
      flex: 1;
    }

    /* Modal */
    .me-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    }
    .me-modal {
      background: #fff;
      border-radius: 8px;
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .me-modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e0e0e0;
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 1;
    }
    .me-modal-header h3 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }
    .me-modal-body {
      padding: 24px;
    }
    .me-modal-footer {
      padding: 20px 24px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      position: sticky;
      bottom: 0;
      background: #fff;
    }

    /* Form Fields */
    .me-form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 600px) {
      .me-form-row {
        grid-template-columns: 1fr;
      }
    }
    .me-form-field {
      margin-bottom: 20px;
    }
    .me-form-field.full-width {
      grid-column: 1 / -1;
    }
    .me-form-field label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    .me-form-field label span {
      color: #dc3545;
    }
    .me-form-field .me-hint {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    .me-form-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .me-form-input:focus {
      outline: none;
      border-color: #333;
    }
    .me-form-input.error {
      border-color: #dc3545;
    }
    .me-form-input.valid {
      border-color: #28a745;
    }
    textarea.me-form-input {
      min-height: 120px;
      resize: vertical;
    }
    select.me-form-input {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
    }
    .me-error-msg {
      font-size: 12px;
      color: #dc3545;
      margin-top: 4px;
      display: none;
    }
    .me-error-msg.visible {
      display: block;
    }

    /* Image Upload */
    .me-image-upload {
      width: 100%;
      aspect-ratio: 16/9;
      border: 2px dashed #ddd;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafafa;
      position: relative;
      overflow: hidden;
    }
    .me-image-upload:hover {
      border-color: #333;
      background: #f5f5f5;
    }
    .me-image-upload.has-image {
      border-style: solid;
      border-color: #ddd;
    }
    .me-image-upload img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }
    .me-image-upload .me-upload-placeholder {
      text-align: center;
      color: #999;
      font-size: 14px;
      padding: 20px;
    }
    .me-image-upload .me-upload-placeholder span {
      display: block;
      font-size: 32px;
      margin-bottom: 8px;
    }
    .me-image-upload .me-remove-image {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(220, 53, 69, 0.9);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      display: none;
    }
    .me-image-upload.has-image .me-remove-image {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .me-image-upload.has-image .me-upload-placeholder {
      display: none;
    }
    .me-image-upload input[type="file"] {
      display: none;
    }

    /* Info box */
    .me-info-box {
      padding: 16px;
      background: #e8f4fc;
      border-radius: 8px;
      margin-bottom: 24px;
      border-left: 4px solid #007bff;
    }
    .me-info-box p {
      margin: 0;
      font-size: 14px;
      color: #333;
      line-height: 1.5;
    }
    .me-info-box.warning {
      background: #fff3cd;
      border-left-color: #ffc107;
    }

    /* Progress overlay */
    .me-progress-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10001;
    }
    .me-progress-container {
      text-align: center;
      max-width: 400px;
      padding: 40px;
    }
    .me-progress-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e0e0e0;
      border-top-color: #333;
      border-radius: 50%;
      animation: me-spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes me-spin {
      to { transform: rotate(360deg); }
    }
    .me-progress-status {
      font-size: 16px;
      color: #333;
      margin-bottom: 8px;
    }
    .me-progress-detail {
      font-size: 14px;
      color: #666;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .me-header {
        flex-direction: column;
        align-items: stretch;
      }
      .me-header h2 {
        text-align: center;
      }
      .me-events-grid {
        grid-template-columns: 1fr;
      }
      .me-event-actions {
        flex-direction: column;
      }
      .me-modal-footer {
        flex-direction: column;
      }
      .me-modal-footer .me-btn {
        width: 100%;
      }
    }
  `;function H(e){return e?new Date(e).toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short",year:"numeric"}):""}function I(e){return e?new Date(e).toISOString().slice(0,10):""}function O(e){if(!e)return null;const r=new Date(e),t=new Date;return t.setDate(t.getDate()+F),(r>t?t:r).toISOString()}function j(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,100)}function V(e){if(!e||e.trim()==="")return"";let r=e.trim();/^https?:\/\//i.test(r)||(r="https://"+r);try{return new URL(r),r}catch{return""}}function z(e){if(!e||e.trim()==="")return!0;const r=e.trim();if(!/^https?:\/\//i.test(r))return!1;try{const t=new URL(r);return!(!t.hostname||!t.hostname.includes("."))}catch{return!1}}function W(e){return{[c.DRAFT]:"Draft",[c.PENDING_REVIEW]:"Pending Review",[c.PUBLISHED]:"Published",[c.CHANGES_REQUESTED]:"Changes Requested"}[e]||e||"Draft"}function U(e){return e.is_draft===!1&&e.is_archived===!1?c.PUBLISHED:e.is_draft===!0?c.PENDING_REVIEW:c.DRAFT}function P(e,r=""){let t=document.querySelector(".me-progress-overlay");return t||(t=document.createElement("div"),t.className="me-progress-overlay",t.innerHTML=`
        <div class="me-progress-container">
          <div class="me-progress-spinner"></div>
          <div class="me-progress-status"></div>
          <div class="me-progress-detail"></div>
        </div>
      `,document.body.appendChild(t)),t.querySelector(".me-progress-status").textContent=e,t.querySelector(".me-progress-detail").textContent=r,t.style.display="flex",t}function A(){const e=document.querySelector(".me-progress-overlay");e&&(e.style.display="none")}async function Y(){const{data:e,error:r}=await g.from("suburbs").select("id, webflow_id, name, slug").order("name");return r?(console.error("Error loading suburbs:",r),[]):e||[]}async function G(){const{data:e,error:r}=await g.from("events").select("*").eq("memberstack_id",l.id).order("created_at",{ascending:!1});if(r)throw console.error("Error loading events:",r),r;return e||[]}async function J(e){const{data:r,error:t}=await g.from("events").insert([e]).select().single();if(t)throw console.error("Error creating event:",t),t;return r}async function Q(e,r){const{data:t,error:n}=await g.from("events").update(r).eq("id",e).select().single();if(n)throw console.error("Error updating event:",n),n;return t}async function X(e){const{error:r}=await g.from("events").delete().eq("id",e);if(r)throw console.error("Error deleting event:",r),r}async function K(e){const r=e.name.split(".").pop(),t=`${l.id}/${Date.now()}.${r}`,{error:n}=await g.storage.from("event-images").upload(t,e,{cacheControl:"3600",upsert:!1});if(n)throw console.error("Error uploading image:",n),n;const{data:{publicUrl:a}}=g.storage.from("event-images").getPublicUrl(t);return a}async function N(e,r=null){try{const t={memberstack_id:l.id,activity_type:e};r&&(t.entity_type="event",t.entity_id=r.id||null,t.entity_name=r.name||null),await fetch(`${L}/functions/v1/log-activity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`,apikey:w},body:JSON.stringify(t)})}catch(t){console.warn("Failed to log activity:",t)}}async function Z(e,r=!1){var t,n,a;try{const o=(t=l.customFields)!=null&&t["first-name"]?`${l.customFields["first-name"]} ${l.customFields["last-name"]||""}`.trim():((n=l.auth)==null?void 0:n.email)||"Unknown Member",p=e.date_start?new Date(e.date_start).toLocaleDateString("en-AU",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):null;await fetch(`${L}/functions/v1/notify-event-submission`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`,apikey:w},body:JSON.stringify({eventName:e.name,eventDate:p,memberName:o,memberEmail:((a=l.auth)==null?void 0:a.email)||"",isUpdate:r})}),console.log("Admin notified of event submission")}catch(o){console.warn("Failed to notify admin of event submission:",o)}}async function ee(){return new Promise(e=>{if(window.$memberstackDom)e();else{const r=setInterval(()=>{window.$memberstackDom&&(clearInterval(r),e())},100)}})}async function T(){const e=document.querySelector(".member-event-submission");if(!e){console.warn("Could not find .member-event-submission container");return}if(typeof window.supabase>"u"){console.error("Supabase library not loaded"),e.innerHTML='<div class="me-loading">Error: Supabase library not loaded. Please refresh the page.</div>';return}g=window.supabase.createClient(L,w);const r=document.createElement("style");r.textContent=B,document.head.appendChild(r);const t=document.createElement("div");t.className="me-container",t.innerHTML='<div class="me-loading">Loading your events...</div>',e.appendChild(t);try{await ee();const{data:n}=await window.$memberstackDom.getCurrentMember();if(!n){t.innerHTML='<div class="me-loading">Please log in to submit events.</div>';return}l=n,console.log("Current member:",l.id);const[a,o]=await Promise.all([Y(),G()]);$=a,m=o,console.log("Loaded suburbs:",$.length),console.log("Loaded events:",m.length),q(t)}catch(n){console.error("Error initializing member events:",n),t.innerHTML='<div class="me-loading">Error loading events. Please refresh the page.</div>'}}function q(e){if(m.length===0){e.innerHTML=`
        <div class="me-empty">
          <p>You haven't submitted any events yet</p>
          <button class="me-btn" id="me-add-first">Submit an Event</button>
        </div>
      `,e.querySelector("#me-add-first").addEventListener("click",()=>C(null,e));return}let r=`
      <div class="me-header">
        <h2>My Events</h2>
        <button class="me-btn" id="me-add-event">Submit New Event</button>
      </div>
      <div class="me-events-grid">
    `;m.forEach(t=>{r+=te(t)}),r+="</div>",e.innerHTML=r,e.querySelector("#me-add-event").addEventListener("click",()=>C(null,e)),e.querySelectorAll(".me-event-card").forEach(t=>{const n=t.dataset.eventId,a=m.find(o=>o.id===n);a&&re(t,a,e)})}function te(e){const r=U(e),t=`me-status-${r}`;let n=e.date_start?H(e.date_start):"Date not set";return e.time_display&&(n+=` | ${e.time_display}`),`
      <div class="me-event-card" data-event-id="${e.id}">
        <div class="me-event-image">
          ${e.feature_image_url?`<img src="${e.feature_image_url}" alt="${e.name}">`:'<div class="me-no-image">No image</div>'}
          <span class="me-event-status ${t}">${W(r)}</span>
        </div>
        <div class="me-event-body">
          <h3 class="me-event-title">${e.name||"Untitled Event"}</h3>
          <div class="me-event-date">${n}</div>
          <div class="me-event-location">${e.location_name||"Location not set"}</div>
          <p class="me-event-description">${e.description||"No description"}</p>
        </div>
        <div class="me-event-actions">
          <button class="me-btn me-btn-secondary me-btn-small me-edit-btn">Edit</button>
          <button class="me-btn me-btn-danger me-btn-small me-delete-btn">Delete</button>
        </div>
      </div>
    `}function re(e,r,t){const n=e.querySelector(".me-edit-btn"),a=e.querySelector(".me-delete-btn");n.addEventListener("click",()=>{C(r,t)}),a.addEventListener("click",async()=>{if(confirm("Are you sure you want to delete this event?")){a.disabled=!0,a.textContent="Deleting...";try{await X(r.id),m=m.filter(o=>o.id!==r.id),q(t)}catch(o){console.error("Error deleting event:",o),alert("Error deleting event. Please try again."),a.disabled=!1,a.textContent="Delete"}}})}function ne(e){let r='<option value="">Select a suburb...</option>';return $.forEach(t=>{const n=t.id===e?"selected":"";r+=`<option value="${t.id}" ${n}>${t.name}</option>`}),`<select class="me-form-input" id="me-form-suburb">${r}</select>`}function C(e,r){const t=!!e,n=e||{},a={feature_image_url:n.feature_image_url||""},o=t?U(n):c.DRAFT,p=o===c.PUBLISHED,E=t&&p,i=document.createElement("div");i.className="me-modal-overlay",i.innerHTML=`
      <div class="me-modal">
        <div class="me-modal-header">
          <h3>${t?"Edit Event":"Submit an Event"}</h3>
        </div>
        <div class="me-modal-body">
          ${t?"":`
            <div class="me-info-box">
              <p><strong>How it works:</strong> Submit your event details and our team will review it within 48 hours. Once approved, your event will appear on the MTNS MADE events calendar.</p>
            </div>
          `}

          ${E?`
            <div class="me-info-box warning">
              <p><strong>Note:</strong> This event is currently published. Any changes you make will require re-approval and the event will be temporarily unpublished until reviewed.</p>
            </div>
          `:""}

          <div class="me-form-field full-width">
            <label>Event Name <span>*</span></label>
            <input type="text" class="me-form-input" id="me-form-name" value="${n.name||""}" required>
          </div>

          <div class="me-form-row">
            <div class="me-form-field">
              <label>Event Date Start <span>*</span></label>
              <input type="date" class="me-form-input" id="me-form-starts"
                     value="${I(n.date_start)}" required>
            </div>
            <div class="me-form-field">
              <label>Event Date End</label>
              <input type="date" class="me-form-input" id="me-form-ends"
                     value="${I(n.date_end)}">
              <div class="me-hint">Leave blank if single-day event</div>
            </div>
          </div>

          <div class="me-form-field full-width">
            <label>Time</label>
            <input type="text" class="me-form-input" id="me-form-time"
                   value="${n.time_display||""}" placeholder="e.g., 6pm - 8pm">
          </div>

          <div class="me-form-field full-width">
            <label>Location Name <span>*</span></label>
            <input type="text" class="me-form-input" id="me-form-location-name"
                   value="${n.location_name||""}" placeholder="e.g., Blue Mountains Cultural Centre">
          </div>

          <div class="me-form-row">
            <div class="me-form-field">
              <label>Full Street Address</label>
              <input type="text" class="me-form-input" id="me-form-address"
                     value="${n.location_address||""}" placeholder="e.g., 30 Parke Street">
            </div>
            <div class="me-form-field">
              <label>Suburb</label>
              ${ne(n.suburb_id)}
            </div>
          </div>

          <div class="me-form-field full-width">
            <label>Event Description <span>*</span></label>
            <textarea class="me-form-input" id="me-form-description"
                      placeholder="Describe your event in detail...">${n.description||""}</textarea>
            <div class="me-hint">A short summary will be automatically generated from this description.</div>
          </div>

          <div class="me-form-field full-width">
            <label>Feature Image <span>*</span></label>
            <div class="me-image-upload ${a.feature_image_url?"has-image":""}" id="me-image-upload">
              ${a.feature_image_url?`<img src="${a.feature_image_url}" alt="Feature">`:""}
              <div class="me-upload-placeholder">
                <span>+</span>
                Click to upload image<br>
                <small>Recommended: 1920x1080px (16:9)</small>
              </div>
              <button type="button" class="me-remove-image">&times;</button>
              <input type="file" id="me-image-input" accept="image/*">
            </div>
          </div>

          <div class="me-form-row">
            <div class="me-form-field">
              <label>RSVP / Tickets Link</label>
              <input type="text" class="me-form-input" id="me-form-rsvp"
                     value="${n.rsvp_link||""}" placeholder="https://...">
              <div class="me-hint">Link to tickets, registration, or RSVP page</div>
              <div class="me-error-msg" id="me-rsvp-error">Link must be complete and include https://</div>
            </div>
            <div class="me-form-field">
              <label>Eventbrite Event ID</label>
              <input type="text" class="me-form-input" id="me-form-eventbrite"
                     value="${n.eventbrite_id||""}" placeholder="e.g., 123456789">
              <div class="me-hint">Optional: For Eventbrite integration</div>
            </div>
          </div>

        </div>
        <div class="me-modal-footer">
          <button class="me-btn me-btn-secondary" id="me-modal-cancel">Cancel</button>
          ${t&&o===c.DRAFT?`
            <button class="me-btn me-btn-secondary" id="me-modal-save-draft">Save Draft</button>
          `:""}
          <button class="me-btn me-btn-success" id="me-modal-submit">
            ${t?p?"Submit for Re-Review":"Update & Submit":"Submit for Review"}
          </button>
        </div>
      </div>
    `,document.body.appendChild(i);const d=i.querySelector("#me-image-upload"),S=i.querySelector("#me-image-input");d.addEventListener("click",s=>{if(s.target.classList.contains("me-remove-image")){s.stopPropagation(),a.feature_image_url="",a.newImageFile=null,d.classList.remove("has-image");const v=d.querySelector("img");v&&v.remove();return}S.click()}),S.addEventListener("change",async s=>{const v=s.target.files[0];if(!v)return;const h=new FileReader;h.onload=x=>{a.newImageFile=v,d.classList.add("has-image");let b=d.querySelector("img");b||(b=document.createElement("img"),d.insertBefore(b,d.firstChild)),b.src=x.target.result,b.alt="Feature"},h.readAsDataURL(v)});const u=i.querySelector("#me-form-rsvp"),_=i.querySelector("#me-rsvp-error");u.addEventListener("blur",()=>{const s=z(u.value);u.classList.toggle("error",!s&&u.value),u.classList.toggle("valid",s&&u.value),_.classList.toggle("visible",!s&&u.value)}),i.addEventListener("click",s=>{s.target===i&&i.remove()}),i.querySelector("#me-modal-cancel").addEventListener("click",()=>i.remove());const y=i.querySelector("#me-modal-save-draft");y&&y.addEventListener("click",async()=>{await R(i,n,a,r,!1)}),i.querySelector("#me-modal-submit").addEventListener("click",async()=>{await R(i,n,a,r,!0,p)})}async function R(e,r,t,n,a,o=!1){var b;const p=!!r.id,E=e.querySelector("#me-form-name").value.trim(),i=e.querySelector("#me-form-starts").value,d=e.querySelector("#me-form-ends").value,S=e.querySelector("#me-form-location-name").value.trim(),u=e.querySelector("#me-form-description").value.trim(),_=t.feature_image_url,y=t.newImageFile;if(!E){alert("Please enter an event name");return}if(!i){alert("Please set when the event starts");return}if(a){if(!S){alert("Please enter a location name");return}if(!u){alert("Please enter an event description");return}if(!_&&!y){alert("Please upload a feature image");return}}const s=e.querySelector("#me-form-rsvp").value.trim();if(s&&!z(s)){alert("Please enter a valid RSVP link URL");return}const v=e.querySelector("#me-form-suburb").value||null,h=e.querySelector("#me-modal-submit"),x=e.querySelector("#me-modal-save-draft");h.disabled=!0,h.textContent=a?"Submitting...":"Saving...",x&&(x.disabled=!0);try{P("Saving event...","Please wait");let k=_;y&&(P("Uploading image...","Please wait"),k=await K(y));const M={memberstack_id:l.id,member_contact_email:((b=l.auth)==null?void 0:b.email)||"",name:E,slug:j(E),date_start:i?new Date(i).toISOString():null,date_end:d?new Date(d).toISOString():null,date_expiry:O(d||i),time_display:e.querySelector("#me-form-time").value.trim()||null,location_name:S||null,location_address:e.querySelector("#me-form-address").value.trim()||null,suburb_id:v,description:u||null,feature_image_url:k||null,rsvp_link:V(s)||null,eventbrite_id:e.querySelector("#me-form-eventbrite").value.trim()||null,is_draft:!0,is_archived:!1};P("Saving to database...","Please wait");let f;if(p){f=await Q(r.id,M),await N("event_update",{id:f.id,name:f.name});const D=m.findIndex(ae=>ae.id===r.id);D>-1&&(m[D]=f)}else f=await J(M),await N("event_submit",{id:f.id,name:f.name}),m.unshift(f);A(),e.remove(),q(n),a&&(Z(f,p).catch(D=>console.warn("Admin notification failed:",D)),alert(p?"Your event has been updated and submitted for review.":"Your event has been submitted for review. We'll notify you once it's approved."))}catch(k){console.error("Error saving event:",k),A(),alert("Error saving event. Please try again."),h.disabled=!1,h.textContent=a?"Submit for Review":"Save",x&&(x.disabled=!1)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",T):T()})();
