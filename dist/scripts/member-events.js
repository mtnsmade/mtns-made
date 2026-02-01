(function(){console.log("Member events script loaded");const q={create:"https://hooks.zapier.com/hooks/catch/20216239/ul9jvec/",update:"https://hooks.zapier.com/hooks/catch/20216239/ul5bmv5/",delete:"YOUR_DELETE_EVENT_WEBHOOK"},M="4ab46fc683f9c002ae8b",N=90,U=[{id:"64bfb65db1569eeda7582433",name:"Bell",slug:"bell"},{id:"64bfb65dc335367110321546",name:"Bilpin",slug:"bilpin"},{id:"64bfb65d757e05b74ba0e403",name:"Blackheath",slug:"blackheath"},{id:"64bfb65d6a8497d80eb5b5c6",name:"Blaxland",slug:"blaxland"},{id:"64bfb65d409f7c767042076c",name:"Bullaburra",slug:"bullaburra"},{id:"64bfb65d409f7c767042076d",name:"Faulconbridge",slug:"faulconbridge"},{id:"64bfb65d655ee21e8c72ee13",name:"Glenbrook",slug:"glenbrook"},{id:"64bfb65d2cc46c71a5be8efb",name:"Hazelbrook",slug:"hazelbrook"},{id:"64bfb65d7519806dd636ca2a",name:"Katoomba",slug:"katoomba"},{id:"64bfb65e2cc46c71a5be8f19",name:"Lapstone",slug:"lapstone"},{id:"64bfb65e57a4cc3165c39201",name:"Lawson",slug:"lawson"},{id:"64bfb65ec791453caa2f9d46",name:"Leura",slug:"leura"},{id:"64bfb65ec791453caa2f9d4f",name:"Linden",slug:"linden"},{id:"64bfb65e75299ea8759da3c3",name:"Medlow Bath",slug:"medlow-bath"},{id:"64bfb65ec016ed44dbb8add3",name:"Megalong Valley",slug:"megalong-valley"},{id:"64bfb65ec7c3a0d4663a1577",name:"Mount Irvine",slug:"mount-irvine"},{id:"64bfb65fafe29b2df8a63f02",name:"Mount Tomah",slug:"mount-tomah"},{id:"64bfb65f7519806dd636cccf",name:"Mount Victoria",slug:"mount-victoria"},{id:"64bfb65f2cc46c71a5be9045",name:"Mount Wilson",slug:"mount-wilson"},{id:"6733dfdf795b2df6a1573dd1",name:"Penrith",slug:"penrith"},{id:"64bfb65f2cc46c71a5be907d",name:"Springwood",slug:"springwood"},{id:"64bfb65feec6228116d7a9f3",name:"Sun Valley",slug:"sun-valley"},{id:"64bfb65f73964b051a9b6baf",name:"Valley Heights",slug:"valley-heights"},{id:"64bfb65fd304d7de5fc6ecf0",name:"Warrimoo",slug:"warrimoo"},{id:"64bfb65f9f89e1af537ca7e1",name:"Wentworth Falls",slug:"wentworth-falls"},{id:"64bfb65fc3353671103219b0",name:"Winmalee",slug:"winmalee"},{id:"64bfb65f363259218e7640bf",name:"Woodford",slug:"woodford"},{id:"64bfb66060c8908f983dd9e6",name:"Yellow Rock",slug:"yellow-rock"}];let g=null,r=[],_=!1;const u={DRAFT:"draft",PENDING_REVIEW:"pending_review",PUBLISHED:"published",CHANGES_REQUESTED:"changes_requested"},R=`
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

    /* Multi-select for members */
    .me-multiselect {
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #fff;
    }
    .me-multiselect-search {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    .me-multiselect-search input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .me-multiselect-options {
      max-height: 200px;
      overflow-y: auto;
    }
    .me-multiselect-option {
      padding: 10px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background 0.1s;
    }
    .me-multiselect-option:hover {
      background: #f5f5f5;
    }
    .me-multiselect-option.selected {
      background: #e8f4fc;
    }
    .me-multiselect-option input {
      margin: 0;
    }
    .me-multiselect-selected {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #eee;
      min-height: 48px;
    }
    .me-multiselect-selected:empty::before {
      content: 'No members selected';
      color: #999;
      font-size: 13px;
    }
    .me-selected-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #333;
      color: #fff;
      border-radius: 12px;
      font-size: 12px;
    }
    .me-selected-tag button {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 0;
      font-size: 14px;
      line-height: 1;
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
  `;function T(){return"evt_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}function O(e){return e?new Date(e).toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short",year:"numeric"}):""}function D(e){return e?new Date(e).toISOString().slice(0,10):""}function B(e){if(!e)return"";const t=new Date(e),a=new Date;return a.setDate(a.getDate()+N),(t>a?a:t).toISOString()}function A(){return new Promise(e=>{if(_||window.uploadcare){_=!0,e();return}const t=document.createElement("script");t.src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js",t.onload=()=>{_=!0,e()},document.head.appendChild(t)})}function W(e){if(!window.uploadcare){console.error("Uploadcare not loaded");return}uploadcare.openDialog(null,{publicKey:M,imagesOnly:!0,crop:"16:9",imageShrink:"1920x1080"}).done(a=>{a.promise().done(o=>{e(o.cdnUrl)})})}function v(e){return!e||typeof e!="string"?"":e.replace(/[\r\n]+/g," ").replace(/[\x00-\x1F\x7F]/g,"").replace(/\s+/g," ").trim()}function H(e){if(!e||e.trim()==="")return"";let t=e.trim();/^https?:\/\//i.test(t)||(t="https://"+t);try{return new URL(t),t}catch{return""}}function L(e){if(!e||e.trim()==="")return!0;const t=e.trim();if(!/^https?:\/\//i.test(t))return!1;try{const a=new URL(t);return!(!a.hostname||!a.hostname.includes("."))}catch{return!1}}function V(e){return{[u.DRAFT]:"Draft",[u.PENDING_REVIEW]:"Pending Review",[u.PUBLISHED]:"Published",[u.CHANGES_REQUESTED]:"Changes Requested"}[e]||e}async function $(e,t){var d,l;const a=q[e];if(!a||a.includes("YOUR_"))return console.warn(`Webhook not configured for action: ${e}`),{success:!1,error:"Webhook not configured"};const o=((d=g.customFields)==null?void 0:d["webflow-member-id"])||"",i={action:e,event_id:t.id,webflow_item_id:t.webflow_item_id||"",member_webflow_id:o,memberstack_id:g.id,member_email:((l=g.auth)==null?void 0:l.email)||"",name:v(t.name),slug:t.name?t.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""):"","date-event-starts":t.date_event_starts||"","date-event-ends":t.date_event_ends||"","event-expiry-date":t.event_expiry_date||"",time:v(t.time||""),"location-name":v(t.location_name||""),"location-full-street-address":v(t.location_full_address||""),"choose-suburb":t.suburb_id||"",description:t.description||"","feature-image":t.feature_image||"","eventbrite-event-id":v(t.eventbrite_id||""),"rsvp-link":H(t.rsvp_link||""),"members-involved-in-this-event":t.members_involved||[],status:t.status||u.PENDING_REVIEW,is_edit:e==="update"&&t.was_published===!0};console.log(`Sending ${e} webhook:`,i);try{return await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i),mode:"no-cors"}),console.log(`Webhook ${e} sent successfully`),{success:!0}}catch(n){return console.error(`Webhook ${e} failed:`,n),{success:!1,error:n.message}}}function j(){return new Promise(e=>{if(window.$memberstackDom)e();else{const t=setInterval(()=>{window.$memberstackDom&&(clearInterval(t),e())},100)}})}async function z(){try{const{data:e}=await window.$memberstackDom.getMemberJSON();r=e&&e.memberEvents||[],r.sort((t,a)=>new Date(a.created_at)-new Date(t.created_at)),console.log("Loaded events:",r.length)}catch(e){console.error("Error loading events:",e),r=[]}}async function I(){try{const{data:e}=await window.$memberstackDom.getMemberJSON(),t={...e,memberEvents:r};await window.$memberstackDom.updateMemberJSON({json:t}),console.log("Events saved")}catch(e){throw console.error("Error saving events:",e),e}}async function P(){const e=document.querySelector(".member-event-submission");if(!e){console.warn("Could not find .member-event-submission container");return}const t=document.createElement("style");t.textContent=R,document.head.appendChild(t);const a=document.createElement("div");a.className="me-container",a.innerHTML='<div class="me-loading">Loading your events...</div>',e.appendChild(a);try{await Promise.all([A(),j()]);const{data:o}=await window.$memberstackDom.getCurrentMember();if(!o){a.innerHTML='<div class="me-loading">Please log in to submit events.</div>';return}g=o,console.log("Current member:",g.id),await z(),E(a)}catch(o){console.error("Error initializing member events:",o),a.innerHTML='<div class="me-loading">Error loading events. Please refresh the page.</div>'}}function E(e){if(r.length===0){e.innerHTML=`
        <div class="me-empty">
          <p>You haven't submitted any events yet</p>
          <button class="me-btn" id="me-add-first">Submit an Event</button>
        </div>
      `,e.querySelector("#me-add-first").addEventListener("click",()=>S(null,e));return}let t=`
      <div class="me-header">
        <h2>My Events</h2>
        <button class="me-btn" id="me-add-event">Submit New Event</button>
      </div>
      <div class="me-events-grid">
    `;r.forEach(a=>{t+=F(a)}),t+="</div>",e.innerHTML=t,e.querySelector("#me-add-event").addEventListener("click",()=>S(null,e)),e.querySelectorAll(".me-event-card").forEach((a,o)=>{const i=r[o];Y(a,i,e)})}function F(e){const t=`me-status-${e.status||u.DRAFT}`;let a=e.date_event_starts?O(e.date_event_starts):"Date not set";return e.time&&(a+=` | ${e.time}`),`
      <div class="me-event-card" data-event-id="${e.id}">
        <div class="me-event-image">
          ${e.feature_image?`<img src="${e.feature_image}" alt="${e.name}">`:'<div class="me-no-image">No image</div>'}
          <span class="me-event-status ${t}">${V(e.status)}</span>
        </div>
        <div class="me-event-body">
          <h3 class="me-event-title">${e.name||"Untitled Event"}</h3>
          <div class="me-event-date">${a}</div>
          <div class="me-event-location">${e.location_name||"Location not set"}</div>
          <p class="me-event-description">${e.description||"No description"}</p>
        </div>
        <div class="me-event-actions">
          <button class="me-btn me-btn-secondary me-btn-small me-edit-btn">Edit</button>
          <button class="me-btn me-btn-danger me-btn-small me-delete-btn">Delete</button>
        </div>
      </div>
    `}function Y(e,t,a){const o=e.querySelector(".me-edit-btn"),i=e.querySelector(".me-delete-btn");o.addEventListener("click",()=>{S(t,a)}),i.addEventListener("click",async()=>{if(confirm("Are you sure you want to delete this event?")){i.disabled=!0,i.textContent="Deleting...";try{await z();const d=r.find(l=>l.id===t.id);d&&d.webflow_item_id&&await $("delete",d),r=r.filter(l=>l.id!==t.id),await I(),E(a)}catch(d){console.error("Error deleting event:",d),alert("Error deleting event. Please try again."),i.disabled=!1,i.textContent="Delete"}}})}function G(e){let t='<option value="">Select a suburb...</option>';return U.forEach(a=>{const o=a.id===e?"selected":"";t+=`<option value="${a.id}" ${o}>${a.name}</option>`}),`<select class="me-form-input" id="me-form-suburb">${t}</select>`}function S(e,t){const a=!!e,o=e||{},i={feature_image:o.feature_image||""},d=o.status===u.PUBLISHED,l=a&&d,n=document.createElement("div");n.className="me-modal-overlay",n.innerHTML=`
      <div class="me-modal">
        <div class="me-modal-header">
          <h3>${a?"Edit Event":"Submit an Event"}</h3>
        </div>
        <div class="me-modal-body">
          ${a?"":`
            <div class="me-info-box">
              <p><strong>How it works:</strong> Submit your event details and our team will review it within 48 hours. Once approved, your event will appear on the MTNS MADE events calendar.</p>
            </div>
          `}

          ${l?`
            <div class="me-info-box warning">
              <p><strong>Note:</strong> This event is currently published. Any changes you make will require re-approval and the event will be temporarily unpublished until reviewed.</p>
            </div>
          `:""}

          <div class="me-form-field full-width">
            <label>Event Name <span>*</span></label>
            <input type="text" class="me-form-input" id="me-form-name" value="${o.name||""}" required>
          </div>

          <div class="me-form-row">
            <div class="me-form-field">
              <label>Event Date Start <span>*</span></label>
              <input type="date" class="me-form-input" id="me-form-starts"
                     value="${D(o.date_event_starts)}" required>
            </div>
            <div class="me-form-field">
              <label>Event Date End</label>
              <input type="date" class="me-form-input" id="me-form-ends"
                     value="${D(o.date_event_ends)}">
              <div class="me-hint">Leave blank if single-day event</div>
            </div>
          </div>

          <div class="me-form-field full-width">
            <label>Time</label>
            <input type="text" class="me-form-input" id="me-form-time"
                   value="${o.time||""}" placeholder="e.g., 6pm - 8pm">
          </div>

          <div class="me-form-field full-width">
            <label>Location Name <span>*</span></label>
            <input type="text" class="me-form-input" id="me-form-location-name"
                   value="${o.location_name||""}" placeholder="e.g., Blue Mountains Cultural Centre">
          </div>

          <div class="me-form-row">
            <div class="me-form-field">
              <label>Full Street Address</label>
              <input type="text" class="me-form-input" id="me-form-address"
                     value="${o.location_full_address||""}" placeholder="e.g., 30 Parke Street">
            </div>
            <div class="me-form-field">
              <label>Suburb</label>
              ${G(o.suburb_id)}
            </div>
          </div>

          <div class="me-form-field full-width">
            <label>Event Description <span>*</span></label>
            <textarea class="me-form-input" id="me-form-description"
                      placeholder="Describe your event in detail...">${o.description||""}</textarea>
            <div class="me-hint">A short summary will be automatically generated from this description.</div>
          </div>

          <div class="me-form-field full-width">
            <label>Feature Image <span>*</span></label>
            <div class="me-image-upload ${i.feature_image?"has-image":""}" id="me-image-upload">
              ${i.feature_image?`<img src="${i.feature_image}" alt="Feature">`:""}
              <div class="me-upload-placeholder">
                <span>+</span>
                Click to upload image<br>
                <small>Recommended: 1920x1080px (16:9)</small>
              </div>
              <button type="button" class="me-remove-image">&times;</button>
            </div>
          </div>

          <div class="me-form-row">
            <div class="me-form-field">
              <label>RSVP / Tickets Link</label>
              <input type="text" class="me-form-input" id="me-form-rsvp"
                     value="${o.rsvp_link||""}" placeholder="https://...">
              <div class="me-hint">Link to tickets, registration, or RSVP page</div>
              <div class="me-error-msg" id="me-rsvp-error">Link must be complete and include https://</div>
            </div>
            <div class="me-form-field">
              <label>Eventbrite Event ID</label>
              <input type="text" class="me-form-input" id="me-form-eventbrite"
                     value="${o.eventbrite_id||""}" placeholder="e.g., 123456789">
              <div class="me-hint">Optional: For Eventbrite integration</div>
            </div>
          </div>

        </div>
        <div class="me-modal-footer">
          <button class="me-btn me-btn-secondary" id="me-modal-cancel">Cancel</button>
          ${a&&o.status===u.DRAFT?`
            <button class="me-btn me-btn-secondary" id="me-modal-save-draft">Save Draft</button>
          `:""}
          <button class="me-btn me-btn-success" id="me-modal-submit">
            ${a?d?"Submit for Re-Review":"Update & Submit":"Submit for Review"}
          </button>
        </div>
      </div>
    `,document.body.appendChild(n);const s=n.querySelector("#me-image-upload");s.addEventListener("click",c=>{if(c.target.classList.contains("me-remove-image")){c.stopPropagation(),i.feature_image="",s.classList.remove("has-image");const p=s.querySelector("img");p&&p.remove();return}W(p=>{i.feature_image=p,s.classList.add("has-image");let f=s.querySelector("img");f||(f=document.createElement("img"),s.insertBefore(f,s.firstChild)),f.src=p,f.alt="Feature"})});const m=n.querySelector("#me-form-rsvp"),y=n.querySelector("#me-rsvp-error");m.addEventListener("blur",()=>{const c=L(m.value);m.classList.toggle("error",!c&&m.value),m.classList.toggle("valid",c&&m.value),y.classList.toggle("visible",!c&&m.value)}),n.addEventListener("click",c=>{c.target===n&&n.remove()}),n.querySelector("#me-modal-cancel").addEventListener("click",()=>n.remove());const h=n.querySelector("#me-modal-save-draft");h&&h.addEventListener("click",async()=>{await C(n,o,i,t,!1)}),n.querySelector("#me-modal-submit").addEventListener("click",async()=>{await C(n,o,i,t,!0,d)})}async function C(e,t,a,o,i,d=!1){const l=!!t.id,n=e.querySelector("#me-form-name").value.trim(),s=e.querySelector("#me-form-starts").value,m=e.querySelector("#me-form-ends").value,y=e.querySelector("#me-form-location-name").value.trim(),h=e.querySelector("#me-form-description").value.trim(),c=a.feature_image;if(!n){alert("Please enter an event name");return}if(!s){alert("Please set when the event starts");return}if(i){if(!y){alert("Please enter a location name");return}if(!h){alert("Please enter an event description");return}if(!c){alert("Please upload a feature image");return}}const p=e.querySelector("#me-form-rsvp").value.trim();if(p&&!L(p)){alert("Please enter a valid RSVP link URL");return}const f=e.querySelector("#me-form-suburb"),K=f.tagName==="SELECT"?f.value:"",J=f.tagName==="INPUT"?f.value.trim():"",w=e.querySelector("#me-modal-submit"),k=e.querySelector("#me-modal-save-draft");w.disabled=!0,w.textContent=i?"Submitting...":"Saving...",k&&(k.disabled=!0);const x={id:t.id||T(),name:n,date_event_starts:s?new Date(s).toISOString():"",date_event_ends:m?new Date(m).toISOString():"",event_expiry_date:B(m||s),time:e.querySelector("#me-form-time").value.trim(),location_name:y,location_full_address:e.querySelector("#me-form-address").value.trim(),suburb_id:K,suburb_name:J,description:h,feature_image:c,rsvp_link:p,eventbrite_id:e.querySelector("#me-form-eventbrite").value.trim(),members_involved:[],status:i?u.PENDING_REVIEW:u.DRAFT,was_published:d,webflow_item_id:t.webflow_item_id||"",created_at:t.created_at||new Date().toISOString(),updated_at:new Date().toISOString()};try{if(l){const b=r.findIndex(Q=>Q.id===x.id);b>-1&&(r[b]=x)}else r.unshift(x);if(await I(),i){const b=x.webflow_item_id?"update":"create";await $(b,x)}e.remove(),E(o),i&&alert(l?"Your event has been updated and submitted for review.":"Your event has been submitted for review. We'll notify you once it's approved.")}catch(b){console.error("Error saving event:",b),alert("Error saving event. Please try again."),w.disabled=!1,w.textContent=i?"Submit for Review":"Save",k&&(k.disabled=!1)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",P):P()})();
