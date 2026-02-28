(function(){console.log("Member events Supabase script loaded");const $="https://epszwomtxkpjegbjbixr.supabase.co",_="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",j=90;let b=null,c=null,f=[],I=[];const g={DRAFT:"draft",PENDING_REVIEW:"pending_review",PUBLISHED:"published",CHANGES_REQUESTED:"changes_requested"},O=`
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
  `;function H(e){return e?new Date(e).toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short",year:"numeric"}):""}function z(e){return e?new Date(e).toISOString().slice(0,10):""}function V(e){if(!e)return null;const t=new Date(e),n=new Date;return n.setDate(n.getDate()+j),(t>n?n:t).toISOString()}function W(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,100)}function Y(e){if(!e||e.trim()==="")return"";let t=e.trim();/^https?:\/\//i.test(t)||(t="https://"+t);try{return new URL(t),t}catch{return""}}function M(e){if(!e||e.trim()==="")return!0;const t=e.trim();if(!/^https?:\/\//i.test(t))return!1;try{const n=new URL(t);return!(!n.hostname||!n.hostname.includes("."))}catch{return!1}}function G(e){return{[g.DRAFT]:"Draft",[g.PENDING_REVIEW]:"Pending Review",[g.PUBLISHED]:"Published",[g.CHANGES_REQUESTED]:"Changes Requested"}[e]||e||"Draft"}function U(e){return e.is_draft===!1&&e.is_archived===!1?g.PUBLISHED:e.is_draft===!0?g.PENDING_REVIEW:g.DRAFT}function P(e,t=""){let n=document.querySelector(".me-progress-overlay");return n||(n=document.createElement("div"),n.className="me-progress-overlay",n.innerHTML=`
        <div class="me-progress-container">
          <div class="me-progress-spinner"></div>
          <div class="me-progress-status"></div>
          <div class="me-progress-detail"></div>
        </div>
      `,document.body.appendChild(n)),n.querySelector(".me-progress-status").textContent=e,n.querySelector(".me-progress-detail").textContent=t,n.style.display="flex",n}function A(){const e=document.querySelector(".me-progress-overlay");e&&(e.style.display="none")}async function X(){const{data:e,error:t}=await b.from("suburbs").select("id, webflow_id, name, slug").order("name");return t?(console.error("Error loading suburbs:",t),[]):e||[]}async function J(){const{data:e,error:t}=await b.from("events").select("*").eq("memberstack_id",c.id).order("created_at",{ascending:!1});if(t)throw console.error("Error loading events:",t),t;return e||[]}async function Q(e){const{data:t,error:n}=await b.from("events").insert([e]).select().single();if(n)throw console.error("Error creating event:",n),n;return t}async function K(e,t){const{data:n,error:r}=await b.from("events").update(t).eq("id",e).select().single();if(r)throw console.error("Error updating event:",r),r;return n}async function Z(e){const{error:t}=await b.from("events").delete().eq("id",e);if(t)throw console.error("Error deleting event:",t),t}const N=3*1024*1024,k=2e3;async function ee(e){const t=(e.size/1024/1024).toFixed(1);return e.size<=N?(console.log(`Image ${e.name} is ${t}MB - no compression needed`),e):(console.log(`Compressing image ${e.name} from ${t}MB...`),new Promise((n,r)=>{const a=new Image,o=document.createElement("canvas"),p=o.getContext("2d");a.onload=()=>{let{width:u,height:i}=a;if(u>k||i>k){const m=Math.min(k/u,k/i);u=Math.round(u*m),i=Math.round(i*m)}o.width=u,o.height=i,p.drawImage(a,0,0,u,i);const l=m=>{o.toBlob(s=>{if(!s){r(new Error("Failed to compress image"));return}const E=(s.size/1024/1024).toFixed(1);if(console.log(`Compressed to ${E}MB at quality ${m}`),s.size<=N||m<=.3){const h=new File([s],e.name,{type:"image/jpeg",lastModified:Date.now()});n(h)}else l(m-.1)},"image/jpeg",m)};l(.8)},a.onerror=()=>r(new Error("Failed to load image for compression")),a.src=URL.createObjectURL(e)}))}async function te(e){const t=await ee(e),n=t.type==="image/jpeg"?"jpg":e.name.split(".").pop(),r=`${c.id}/${Date.now()}.${n}`,{error:a}=await b.storage.from("event-images").upload(r,t,{cacheControl:"3600",upsert:!1});if(a)throw console.error("Error uploading image:",a),a;const{data:{publicUrl:o}}=b.storage.from("event-images").getPublicUrl(r);return o}async function F(e,t=null){try{const n={memberstack_id:c.id,activity_type:e};t&&(n.entity_type="event",n.entity_id=t.id||null,n.entity_name=t.name||null),await fetch(`${$}/functions/v1/log-activity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${_}`,apikey:_},body:JSON.stringify(n)})}catch(n){console.warn("Failed to log activity:",n)}}async function ne(e,t=!1){var n,r,a;try{const o=(n=c.customFields)!=null&&n["first-name"]?`${c.customFields["first-name"]} ${c.customFields["last-name"]||""}`.trim():((r=c.auth)==null?void 0:r.email)||"Unknown Member",p=e.date_start?new Date(e.date_start).toLocaleDateString("en-AU",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):null;await fetch(`${$}/functions/v1/notify-event-submission`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${_}`,apikey:_},body:JSON.stringify({eventName:e.name,eventDate:p,memberName:o,memberEmail:((a=c.auth)==null?void 0:a.email)||"",isUpdate:t})}),console.log("Admin notified of event submission")}catch(o){console.warn("Failed to notify admin of event submission:",o)}}async function re(){return new Promise(e=>{if(window.$memberstackDom)e();else{const t=setInterval(()=>{window.$memberstackDom&&(clearInterval(t),e())},100)}})}async function R(){const e=document.querySelector(".member-event-submission");if(!e){console.warn("Could not find .member-event-submission container");return}if(typeof window.supabase>"u"){console.error("Supabase library not loaded"),e.innerHTML='<div class="me-loading">Error: Supabase library not loaded. Please refresh the page.</div>';return}b=window.supabase.createClient($,_);const t=document.createElement("style");t.textContent=O,document.head.appendChild(t);const n=document.createElement("div");n.className="me-container",n.innerHTML='<div class="me-loading">Loading your events...</div>',e.appendChild(n);try{await re();const{data:r}=await window.$memberstackDom.getCurrentMember();if(!r){n.innerHTML='<div class="me-loading">Please log in to submit events.</div>';return}c=r,console.log("Current member:",c.id);const[a,o]=await Promise.all([X(),J()]);I=a,f=o,console.log("Loaded suburbs:",I.length),console.log("Loaded events:",f.length),C(n)}catch(r){console.error("Error initializing member events:",r),n.innerHTML='<div class="me-loading">Error loading events. Please refresh the page.</div>'}}function C(e){if(f.length===0){e.innerHTML=`
        <div class="me-empty">
          <p>You haven't submitted any events yet</p>
          <button class="me-btn" id="me-add-first">Submit an Event</button>
        </div>
      `,e.querySelector("#me-add-first").addEventListener("click",()=>q(null,e));return}let t=`
      <div class="me-header">
        <h2>My Events</h2>
        <button class="me-btn" id="me-add-event">Submit New Event</button>
      </div>
      <div class="me-events-grid">
    `;f.forEach(n=>{t+=ae(n)}),t+="</div>",e.innerHTML=t,e.querySelector("#me-add-event").addEventListener("click",()=>q(null,e)),e.querySelectorAll(".me-event-card").forEach(n=>{const r=n.dataset.eventId,a=f.find(o=>o.id===r);a&&ie(n,a,e)})}function ae(e){const t=U(e),n=`me-status-${t}`;let r=e.date_start?H(e.date_start):"Date not set";return e.time_display&&(r+=` | ${e.time_display}`),`
      <div class="me-event-card" data-event-id="${e.id}">
        <div class="me-event-image">
          ${e.feature_image_url?`<img src="${e.feature_image_url}" alt="${e.name}">`:'<div class="me-no-image">No image</div>'}
          <span class="me-event-status ${n}">${G(t)}</span>
        </div>
        <div class="me-event-body">
          <h3 class="me-event-title">${e.name||"Untitled Event"}</h3>
          <div class="me-event-date">${r}</div>
          <div class="me-event-location">${e.location_name||"Location not set"}</div>
          <p class="me-event-description">${e.description||"No description"}</p>
        </div>
        <div class="me-event-actions">
          <button class="me-btn me-btn-secondary me-btn-small me-edit-btn">Edit</button>
          <button class="me-btn me-btn-danger me-btn-small me-delete-btn">Delete</button>
        </div>
      </div>
    `}function ie(e,t,n){const r=e.querySelector(".me-edit-btn"),a=e.querySelector(".me-delete-btn");r.addEventListener("click",()=>{q(t,n)}),a.addEventListener("click",async()=>{if(confirm("Are you sure you want to delete this event?")){a.disabled=!0,a.textContent="Deleting...";try{await Z(t.id),f=f.filter(o=>o.id!==t.id),C(n)}catch(o){console.error("Error deleting event:",o),alert("Error deleting event. Please try again."),a.disabled=!1,a.textContent="Delete"}}})}function oe(e){let t='<option value="">Select a suburb...</option>';return I.forEach(n=>{const r=n.id===e?"selected":"";t+=`<option value="${n.id}" ${r}>${n.name}</option>`}),`<select class="me-form-input" id="me-form-suburb">${t}</select>`}function q(e,t){const n=!!e,r=e||{},a={feature_image_url:r.feature_image_url||""},o=n?U(r):g.DRAFT,p=o===g.PUBLISHED,u=n&&p,i=document.createElement("div");i.className="me-modal-overlay",i.innerHTML=`
      <div class="me-modal">
        <div class="me-modal-header">
          <h3>${n?"Edit Event":"Submit an Event"}</h3>
        </div>
        <div class="me-modal-body">
          ${n?"":`
            <div class="me-info-box">
              <p><strong>How it works:</strong> Submit your event details and our team will review it within 48 hours. Once approved, your event will appear on the MTNS MADE events calendar.</p>
            </div>
          `}

          ${u?`
            <div class="me-info-box warning">
              <p><strong>Note:</strong> This event is currently published. Any changes you make will require re-approval and the event will be temporarily unpublished until reviewed.</p>
            </div>
          `:""}

          <div class="me-form-field full-width">
            <label>Event Name <span>*</span></label>
            <input type="text" class="me-form-input" id="me-form-name" value="${r.name||""}" required>
          </div>

          <div class="me-form-row">
            <div class="me-form-field">
              <label>Event Date Start <span>*</span></label>
              <input type="date" class="me-form-input" id="me-form-starts"
                     value="${z(r.date_start)}" required>
            </div>
            <div class="me-form-field">
              <label>Event Date End</label>
              <input type="date" class="me-form-input" id="me-form-ends"
                     value="${z(r.date_end)}">
              <div class="me-hint">Leave blank if single-day event</div>
            </div>
          </div>

          <div class="me-form-field full-width">
            <label>Time</label>
            <input type="text" class="me-form-input" id="me-form-time"
                   value="${r.time_display||""}" placeholder="e.g., 6pm - 8pm">
          </div>

          <div class="me-form-field full-width">
            <label>Location Name <span>*</span></label>
            <input type="text" class="me-form-input" id="me-form-location-name"
                   value="${r.location_name||""}" placeholder="e.g., Blue Mountains Cultural Centre">
          </div>

          <div class="me-form-row">
            <div class="me-form-field">
              <label>Full Street Address</label>
              <input type="text" class="me-form-input" id="me-form-address"
                     value="${r.location_address||""}" placeholder="e.g., 30 Parke Street">
            </div>
            <div class="me-form-field">
              <label>Suburb</label>
              ${oe(r.suburb_id)}
            </div>
          </div>

          <div class="me-form-field full-width">
            <label>Event Description <span>*</span></label>
            <textarea class="me-form-input" id="me-form-description"
                      placeholder="Describe your event in detail...">${r.description||""}</textarea>
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
                     value="${r.rsvp_link||""}" placeholder="https://...">
              <div class="me-hint">Link to tickets, registration, or RSVP page</div>
              <div class="me-error-msg" id="me-rsvp-error">Link must be complete and include https://</div>
            </div>
            <div class="me-form-field">
              <label>Eventbrite Event ID</label>
              <input type="text" class="me-form-input" id="me-form-eventbrite"
                     value="${r.eventbrite_id||""}" placeholder="e.g., 123456789">
              <div class="me-hint">Optional: For Eventbrite integration</div>
            </div>
          </div>

        </div>
        <div class="me-modal-footer">
          <button class="me-btn me-btn-secondary" id="me-modal-cancel">Cancel</button>
          ${n&&o===g.DRAFT?`
            <button class="me-btn me-btn-secondary" id="me-modal-save-draft">Save Draft</button>
          `:""}
          <button class="me-btn me-btn-success" id="me-modal-submit">
            ${n?p?"Submit for Re-Review":"Update & Submit":"Submit for Review"}
          </button>
        </div>
      </div>
    `,document.body.appendChild(i);const l=i.querySelector("#me-image-upload"),m=i.querySelector("#me-image-input");l.addEventListener("click",d=>{if(d.target.classList.contains("me-remove-image")){d.stopPropagation(),a.feature_image_url="",a.newImageFile=null,l.classList.remove("has-image");const y=l.querySelector("img");y&&y.remove();return}m.click()}),m.addEventListener("change",async d=>{const y=d.target.files[0];if(!y)return;const w=new FileReader;w.onload=S=>{a.newImageFile=y,l.classList.add("has-image");let x=l.querySelector("img");x||(x=document.createElement("img"),l.insertBefore(x,l.firstChild)),x.src=S.target.result,x.alt="Feature"},w.readAsDataURL(y)});const s=i.querySelector("#me-form-rsvp"),E=i.querySelector("#me-rsvp-error");s.addEventListener("blur",()=>{const d=M(s.value);s.classList.toggle("error",!d&&s.value),s.classList.toggle("valid",d&&s.value),E.classList.toggle("visible",!d&&s.value)}),i.addEventListener("click",d=>{d.target===i&&i.remove()}),i.querySelector("#me-modal-cancel").addEventListener("click",()=>i.remove());const h=i.querySelector("#me-modal-save-draft");h&&h.addEventListener("click",async()=>{await T(i,r,a,t,!1)}),i.querySelector("#me-modal-submit").addEventListener("click",async()=>{await T(i,r,a,t,!0,p)})}async function T(e,t,n,r,a,o=!1){var x;const p=!!t.id,u=e.querySelector("#me-form-name").value.trim(),i=e.querySelector("#me-form-starts").value,l=e.querySelector("#me-form-ends").value,m=e.querySelector("#me-form-location-name").value.trim(),s=e.querySelector("#me-form-description").value.trim(),E=n.feature_image_url,h=n.newImageFile;if(!u){alert("Please enter an event name");return}if(!i){alert("Please set when the event starts");return}if(a){if(!m){alert("Please enter a location name");return}if(!s){alert("Please enter an event description");return}if(!E&&!h){alert("Please upload a feature image");return}}const d=e.querySelector("#me-form-rsvp").value.trim();if(d&&!M(d)){alert("Please enter a valid RSVP link URL");return}const y=e.querySelector("#me-form-suburb").value||null,w=e.querySelector("#me-modal-submit"),S=e.querySelector("#me-modal-save-draft");w.disabled=!0,w.textContent=a?"Submitting...":"Saving...",S&&(S.disabled=!0);try{P("Saving event...","Please wait");let D=E;h&&(P("Uploading image...","Please wait"),D=await te(h));const B={memberstack_id:c.id,member_contact_email:((x=c.auth)==null?void 0:x.email)||"",name:u,slug:W(u),date_start:i?new Date(i).toISOString():null,date_end:l?new Date(l).toISOString():null,date_expiry:V(l||i),time_display:e.querySelector("#me-form-time").value.trim()||null,location_name:m||null,location_address:e.querySelector("#me-form-address").value.trim()||null,suburb_id:y,description:s||null,feature_image_url:D||null,rsvp_link:Y(d)||null,eventbrite_id:e.querySelector("#me-form-eventbrite").value.trim()||null,is_draft:!0,is_archived:!1};P("Saving to database...","Please wait");let v;if(p){v=await K(t.id,B),await F("event_update",{id:v.id,name:v.name});const L=f.findIndex(se=>se.id===t.id);L>-1&&(f[L]=v)}else v=await Q(B),await F("event_submit",{id:v.id,name:v.name}),f.unshift(v);A(),e.remove(),C(r),a&&(ne(v,p).catch(L=>console.warn("Admin notification failed:",L)),alert(p?"Your event has been updated and submitted for review.":"Your event has been submitted for review. We'll notify you once it's approved."))}catch(D){console.error("Error saving event:",D),A(),alert("Error saving event. Please try again."),w.disabled=!1,w.textContent=a?"Submit for Review":"Save",S&&(S.disabled=!1)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",R):R()})();
