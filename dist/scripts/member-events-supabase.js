(function(){console.log("Member events Supabase script loaded");const _="https://epszwomtxkpjegbjbixr.supabase.co",w="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",B=90;let b=null,c=null,g=[],P=[];const u={DRAFT:"draft",PENDING_REVIEW:"pending_review",PUBLISHED:"published",REJECTED:"rejected"},O=`
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
    .me-status-rejected {
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
  `;function H(e){return e?new Date(e).toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short",year:"numeric"}):""}function q(e){return e?new Date(e).toISOString().slice(0,10):""}function V(e){if(!e)return null;const t=new Date(e),n=new Date;return n.setDate(n.getDate()+B),(t>n?n:t).toISOString()}function J(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,100)}async function W(e){const t=J(e),{data:n}=await b.from("events").select("slug").eq("slug",t).maybeSingle();if(!n)return t;const{data:r}=await b.from("events").select("slug").like("slug",`${t}-%`),a=new Set((r||[]).map(l=>l.slug));a.add(t);let i=2;for(;a.has(`${t}-${i}`);)i++;return`${t}-${i}`}function Y(e){if(!e||e.trim()==="")return"";let t=e.trim();/^https?:\/\//i.test(t)||(t="https://"+t);try{return new URL(t),t}catch{return""}}function M(e){if(!e||e.trim()==="")return!0;const t=e.trim();if(!/^https?:\/\//i.test(t))return!1;try{const n=new URL(t);return!(!n.hostname||!n.hostname.includes("."))}catch{return!1}}function X(e){return{[u.DRAFT]:"Draft",[u.PENDING_REVIEW]:"Pending Review",[u.PUBLISHED]:"Published",[u.REJECTED]:"Not Approved"}[e]||e||"Draft"}function T(e){return e.is_archived===!0?u.REJECTED:e.is_draft===!1?u.PUBLISHED:e.is_draft===!0?u.PENDING_REVIEW:u.DRAFT}function C(e,t=""){let n=document.querySelector(".me-progress-overlay");return n||(n=document.createElement("div"),n.className="me-progress-overlay",n.innerHTML=`
        <div class="me-progress-container">
          <div class="me-progress-spinner"></div>
          <div class="me-progress-status"></div>
          <div class="me-progress-detail"></div>
        </div>
      `,document.body.appendChild(n)),n.querySelector(".me-progress-status").textContent=e,n.querySelector(".me-progress-detail").textContent=t,n.style.display="flex",n}function A(){const e=document.querySelector(".me-progress-overlay");e&&(e.style.display="none")}async function G(){const{data:e,error:t}=await b.from("suburbs").select("id, webflow_id, name, slug").order("name");return t?(console.error("Error loading suburbs:",t),[]):e||[]}async function K(){const{data:e,error:t}=await b.from("events").select("*").eq("memberstack_id",c.id).order("created_at",{ascending:!1});if(t)throw console.error("Error loading events:",t),t;return e||[]}async function Z(e){const{data:t,error:n}=await b.from("events").insert([e]).select().single();if(n)throw console.error("Error creating event:",n),n;return t}async function Q(e,t){const{data:n,error:r}=await b.from("events").update(t).eq("id",e).select().single();if(r)throw console.error("Error updating event:",r),r;return n}async function ee(e){var r,a;const t=g.find(i=>i.id===e);if(t!=null&&t.webflow_id)try{await fetch(`${_}/functions/v1/manage-event`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`,apikey:w,"X-Member-Token":((a=(r=await window.$memberstackDom.getMemberToken())==null?void 0:r.data)==null?void 0:a.token)||""},body:JSON.stringify({eventId:e,action:"reject"})})}catch(i){console.warn("Webflow cleanup failed, proceeding with delete:",i)}const{error:n}=await b.from("events").delete().eq("id",e);if(n)throw console.error("Error deleting event:",n),n}const N=3*1024*1024,$=2e3;async function te(e){const t=(e.size/1024/1024).toFixed(1);return e.size<=N?(console.log(`Image ${e.name} is ${t}MB - no compression needed`),e):(console.log(`Compressing image ${e.name} from ${t}MB...`),new Promise((n,r)=>{const a=new Image,i=document.createElement("canvas"),l=i.getContext("2d");a.onload=()=>{let{width:d,height:m}=a;if(d>$||m>$){const s=Math.min($/d,$/m);d=Math.round(d*s),m=Math.round(m*s)}i.width=d,i.height=m,l.drawImage(a,0,0,d,m);const o=s=>{i.toBlob(h=>{if(!h){r(new Error("Failed to compress image"));return}const p=(h.size/1024/1024).toFixed(1);if(console.log(`Compressed to ${p}MB at quality ${s}`),h.size<=N||s<=.3){const E=new File([h],e.name,{type:"image/jpeg",lastModified:Date.now()});n(E)}else o(s-.1)},"image/jpeg",s)};o(.8)},a.onerror=()=>r(new Error("Failed to load image for compression")),a.src=URL.createObjectURL(e)}))}async function ne(e){const t=await te(e),n=t.type==="image/jpeg"?"jpg":e.name.split(".").pop(),r=`${c.id}/${Date.now()}.${n}`,{error:a}=await b.storage.from("event-images").upload(r,t,{cacheControl:"3600",upsert:!1});if(a)throw console.error("Error uploading image:",a),a;const{data:{publicUrl:i}}=b.storage.from("event-images").getPublicUrl(r);return i}async function U(e,t=null){try{const n={memberstack_id:c.id,activity_type:e};t&&(n.entity_type="event",n.entity_id=t.id||null,n.entity_name=t.name||null),await fetch(`${_}/functions/v1/log-activity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`,apikey:w},body:JSON.stringify(n)})}catch(n){console.warn("Failed to log activity:",n)}}async function re(e,t=!1){var n,r,a;try{const i=(n=c.customFields)!=null&&n["first-name"]?`${c.customFields["first-name"]} ${c.customFields["last-name"]||""}`.trim():((r=c.auth)==null?void 0:r.email)||"Unknown Member",l=e.date_start?new Date(e.date_start).toLocaleDateString("en-AU",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):null;await fetch(`${_}/functions/v1/notify-event-submission`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`,apikey:w},body:JSON.stringify({eventName:e.name,eventDate:l,memberName:i,memberEmail:((a=c.auth)==null?void 0:a.email)||"",isUpdate:t})}),console.log("Admin notified of event submission")}catch(i){console.warn("Failed to notify admin of event submission:",i)}}async function ae(){return new Promise(e=>{if(window.$memberstackDom)e();else{const t=setInterval(()=>{window.$memberstackDom&&(clearInterval(t),e())},100)}})}async function R(){const e=document.querySelector(".member-event-submission");if(!e){console.warn("Could not find .member-event-submission container");return}if(typeof window.supabase>"u"){console.error("Supabase library not loaded"),e.innerHTML='<div class="me-loading">Error: Supabase library not loaded. Please refresh the page.</div>';return}b=window.supabase.createClient(_,w);const t=document.createElement("style");t.textContent=O,document.head.appendChild(t);const n=document.createElement("div");n.className="me-container",n.innerHTML='<div class="me-loading">Loading your events...</div>',e.appendChild(n);try{await ae();const{data:r}=await window.$memberstackDom.getCurrentMember();if(!r){n.innerHTML='<div class="me-loading">Please log in to submit events.</div>';return}c=r,console.log("Current member:",c.id);const[a,i]=await Promise.all([G(),K()]);P=a,g=i,console.log("Loaded suburbs:",P.length),console.log("Loaded events:",g.length),I(n)}catch(r){console.error("Error initializing member events:",r),n.innerHTML='<div class="me-loading">Error loading events. Please refresh the page.</div>'}}function I(e){if(g.length===0){e.innerHTML=`
        <div class="me-empty">
          <p>You haven't submitted any events yet</p>
          <button class="me-btn" id="me-add-first">Submit an Event</button>
        </div>
      `,e.querySelector("#me-add-first").addEventListener("click",()=>z(null,e));return}let t=`
      <div class="me-header">
        <h2>My Events</h2>
        <button class="me-btn" id="me-add-event">Submit New Event</button>
      </div>
      <div class="me-events-grid">
    `;g.forEach(n=>{t+=ie(n)}),t+="</div>",e.innerHTML=t,e.querySelector("#me-add-event").addEventListener("click",()=>z(null,e)),e.querySelectorAll(".me-event-card").forEach(n=>{const r=n.dataset.eventId,a=g.find(i=>i.id===r);a&&oe(n,a,e)})}function ie(e){const t=T(e),n=`me-status-${t}`;let r=e.date_start?H(e.date_start):"Date not set";return e.time_display&&(r+=` | ${e.time_display}`),`
      <div class="me-event-card" data-event-id="${e.id}">
        <div class="me-event-image">
          ${e.feature_image_url?`<img src="${e.feature_image_url}" alt="${e.name}">`:'<div class="me-no-image">No image</div>'}
          <span class="me-event-status ${n}">${X(t)}</span>
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
    `}function oe(e,t,n){const r=e.querySelector(".me-edit-btn"),a=e.querySelector(".me-delete-btn");r.addEventListener("click",()=>{z(t,n)}),a.addEventListener("click",async()=>{if(confirm("Are you sure you want to delete this event?")){a.disabled=!0,a.textContent="Deleting...";try{await ee(t.id),g=g.filter(i=>i.id!==t.id),I(n)}catch(i){console.error("Error deleting event:",i),alert("Error deleting event. Please try again."),a.disabled=!1,a.textContent="Delete"}}})}function se(e){let t='<option value="">Select a suburb...</option>';return P.forEach(n=>{const r=n.id===e?"selected":"";t+=`<option value="${n.id}" ${r}>${n.name}</option>`}),`<select class="me-form-input" id="me-form-suburb">${t}</select>`}function z(e,t){const n=!!e,r=e||{},a={feature_image_url:r.feature_image_url||""},i=n?T(r):u.DRAFT,l=i===u.PUBLISHED,d=i===u.REJECTED,m=n&&(l||d),o=document.createElement("div");o.className="me-modal-overlay",o.innerHTML=`
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

          ${m?`
            <div class="me-info-box warning">
              <p><strong>Note:</strong> ${d?"This event was not approved. You can edit and resubmit it for review.":"This event is currently published. Any changes you make will require re-approval."}</p>
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
                     value="${q(r.date_start)}" required>
            </div>
            <div class="me-form-field">
              <label>Event Date End</label>
              <input type="date" class="me-form-input" id="me-form-ends"
                     value="${q(r.date_end)}">
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
              ${se(r.suburb_id)}
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
          ${n&&i===u.DRAFT?`
            <button class="me-btn me-btn-secondary" id="me-modal-save-draft">Save Draft</button>
          `:""}
          <button class="me-btn me-btn-success" id="me-modal-submit">
            ${n?l||d?"Submit for Re-Review":"Update & Submit":"Submit for Review"}
          </button>
        </div>
      </div>
    `,document.body.appendChild(o);const s=o.querySelector("#me-image-upload"),h=o.querySelector("#me-image-input");s.addEventListener("click",f=>{if(f.target.classList.contains("me-remove-image")){f.stopPropagation(),a.feature_image_url="",a.newImageFile=null,s.classList.remove("has-image");const v=s.querySelector("img");v&&v.remove();return}h.click()}),h.addEventListener("change",async f=>{const v=f.target.files[0];if(!v)return;const S=new FileReader;S.onload=D=>{a.newImageFile=v,s.classList.add("has-image");let y=s.querySelector("img");y||(y=document.createElement("img"),s.insertBefore(y,s.firstChild)),y.src=D.target.result,y.alt="Feature"},S.readAsDataURL(v)});const p=o.querySelector("#me-form-rsvp"),E=o.querySelector("#me-rsvp-error");p.addEventListener("blur",()=>{const f=M(p.value);p.classList.toggle("error",!f&&p.value),p.classList.toggle("valid",f&&p.value),E.classList.toggle("visible",!f&&p.value)}),o.addEventListener("click",f=>{f.target===o&&o.remove()}),o.querySelector("#me-modal-cancel").addEventListener("click",()=>o.remove());const k=o.querySelector("#me-modal-save-draft");k&&k.addEventListener("click",async()=>{await F(o,r,a,t,!1)}),o.querySelector("#me-modal-submit").addEventListener("click",async()=>{await F(o,r,a,t,!0,l)})}async function F(e,t,n,r,a,i=!1){var D;const l=!!t.id,d=e.querySelector("#me-form-name").value.trim(),m=e.querySelector("#me-form-starts").value,o=e.querySelector("#me-form-ends").value,s=e.querySelector("#me-form-location-name").value.trim(),h=e.querySelector("#me-form-description").value.trim(),p=n.feature_image_url,E=n.newImageFile;if(!d){alert("Please enter an event name");return}if(!m){alert("Please set when the event starts");return}if(a){if(!s){alert("Please enter a location name");return}if(!h){alert("Please enter an event description");return}if(!p&&!E){alert("Please upload a feature image");return}}const k=e.querySelector("#me-form-rsvp").value.trim();if(k&&!M(k)){alert("Please enter a valid RSVP link URL");return}const f=e.querySelector("#me-form-suburb").value||null,v=e.querySelector("#me-modal-submit"),S=e.querySelector("#me-modal-save-draft");v.disabled=!0,v.textContent=a?"Submitting...":"Saving...",S&&(S.disabled=!0);try{C("Saving event...","Please wait");let y=p;E&&(C("Uploading image...","Please wait"),y=await ne(E));const le=l?t.slug:await W(d),j={memberstack_id:c.id,member_contact_email:((D=c.auth)==null?void 0:D.email)||"",name:d,slug:le,date_start:m?new Date(m).toISOString():null,date_end:o?new Date(o).toISOString():null,date_expiry:V(o||m),time_display:e.querySelector("#me-form-time").value.trim()||null,location_name:s||null,location_address:e.querySelector("#me-form-address").value.trim()||null,suburb_id:f,description:h||null,feature_image_url:y||null,rsvp_link:Y(k)||null,eventbrite_id:e.querySelector("#me-form-eventbrite").value.trim()||null,is_draft:!0,is_archived:!1};C("Saving to database...","Please wait");let x;if(l){x=await Q(t.id,j),await U("event_update",{id:x.id,name:x.name});const L=g.findIndex(de=>de.id===t.id);L>-1&&(g[L]=x)}else x=await Z(j),await U("event_submit",{id:x.id,name:x.name}),g.unshift(x);A(),e.remove(),I(r),a&&(re(x,l).catch(L=>console.warn("Admin notification failed:",L)),alert(l?"Your event has been updated and submitted for review.":"Your event has been submitted for review. We'll notify you once it's approved."))}catch(y){console.error("Error saving event:",y),A(),alert("Error saving event. Please try again."),v.disabled=!1,v.textContent=a?"Submit for Review":"Save",S&&(S.disabled=!1)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",R):R()})();
