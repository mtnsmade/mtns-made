(function(){console.log("Member opportunities Supabase script loaded");const g="https://epszwomtxkpjegbjbixr.supabase.co",b="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",k=[{value:"job",label:"Job / Employment"},{value:"commission",label:"Commission"},{value:"collaboration",label:"Collaboration"},{value:"call-for-entries",label:"Call for Entries"},{value:"residency",label:"Residency / Fellowship"},{value:"volunteer",label:"Volunteer"}];let u=null,l=null,d=[],S=[];const s={DRAFT:"draft",PENDING_REVIEW:"pending_review",PUBLISHED:"published",REJECTED:"rejected"},D=`
    .mo-container { font-family: inherit; width: 100%; }
    .mo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .mo-header h2 { margin: 0; font-size: 24px; color: #333; }
    .mo-btn { background: #333; color: #fff; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 14px; transition: background 0.2s; }
    .mo-btn:hover { background: #555; }
    .mo-btn:disabled { background: #999; cursor: not-allowed; }
    .mo-btn-secondary { background: #fff; color: #333; border: 1px solid #ddd; }
    .mo-btn-secondary:hover { background: #f5f5f5; }
    .mo-btn-danger { background: #dc3545; }
    .mo-btn-danger:hover { background: #c82333; }
    .mo-btn-success { background: #28a745; }
    .mo-btn-success:hover { background: #218838; }
    .mo-btn-small { padding: 8px 16px; font-size: 13px; }
    .mo-loading { text-align: center; padding: 60px 20px; color: #666; }
    .mo-empty { text-align: center; padding: 60px 20px; background: #f9f9f9; border-radius: 8px; border: 2px dashed #ddd; }
    .mo-empty p { margin: 0 0 20px 0; color: #666; font-size: 16px; }

    /* Opportunity Cards */
    .mo-list { display: flex; flex-direction: column; gap: 16px; }
    .mo-card { border: 1px solid #e0e0e0; border-radius: 8px; background: #fff; overflow: hidden; }
    .mo-card-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 20px; gap: 12px; }
    .mo-card-title { margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #333; }
    .mo-card-meta { font-size: 13px; color: #666; }
    .mo-card-status { flex-shrink: 0; }
    .mo-status { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .mo-status-draft { background: #6c757d; color: #fff; }
    .mo-status-pending_review { background: #ffc107; color: #333; }
    .mo-status-published { background: #28a745; color: #fff; }
    .mo-status-rejected { background: #dc3545; color: #fff; }
    .mo-card-body { padding: 0 20px 16px; }
    .mo-card-description { font-size: 14px; color: #666; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .mo-card-actions { display: flex; gap: 10px; padding: 16px 20px; border-top: 1px solid #e0e0e0; background: #fafafa; }
    .mo-card-actions .mo-btn { flex: 1; }

    /* Modal */
    .mo-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px; }
    .mo-modal { background: #fff; border-radius: 8px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; }
    .mo-modal-header { padding: 20px 24px; border-bottom: 1px solid #e0e0e0; position: sticky; top: 0; background: #fff; z-index: 1; }
    .mo-modal-header h3 { margin: 0; font-size: 20px; color: #333; }
    .mo-modal-body { padding: 24px; }
    .mo-modal-footer { padding: 20px 24px; border-top: 1px solid #e0e0e0; display: flex; gap: 12px; justify-content: flex-end; position: sticky; bottom: 0; background: #fff; }

    /* Form */
    .mo-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    @media (max-width: 600px) { .mo-form-row { grid-template-columns: 1fr; } }
    .mo-form-field { margin-bottom: 20px; }
    .mo-form-field.full-width { grid-column: 1 / -1; }
    .mo-form-field label { display: block; font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px; }
    .mo-form-field label span { color: #dc3545; }
    .mo-hint { font-size: 12px; color: #666; margin-top: 4px; }
    .mo-form-input { width: 100%; padding: 12px 14px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; font-family: inherit; box-sizing: border-box; transition: border-color 0.2s; }
    .mo-form-input:focus { outline: none; border-color: #333; }
    .mo-form-input.error { border-color: #dc3545; }
    textarea.mo-form-input { min-height: 120px; resize: vertical; }
    select.mo-form-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
    .mo-error-msg { font-size: 12px; color: #dc3545; margin-top: 4px; display: none; }
    .mo-error-msg.visible { display: block; }

    /* Info box */
    .mo-info-box { padding: 16px; background: #e8f4fc; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #007bff; }
    .mo-info-box p { margin: 0; font-size: 14px; color: #333; line-height: 1.5; }
    .mo-info-box.warning { background: #fff3cd; border-left-color: #ffc107; }

    /* Progress overlay */
    .mo-progress-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10001; }
    .mo-progress-container { text-align: center; max-width: 400px; padding: 40px; }
    .mo-progress-spinner { width: 48px; height: 48px; border: 4px solid #e0e0e0; border-top-color: #333; border-radius: 50%; animation: mo-spin 1s linear infinite; margin: 0 auto 20px; }
    @keyframes mo-spin { to { transform: rotate(360deg); } }
    .mo-progress-status { font-size: 16px; color: #333; margin-bottom: 8px; }
    .mo-progress-detail { font-size: 14px; color: #666; }

    @media (max-width: 480px) {
      .mo-header { flex-direction: column; align-items: stretch; }
      .mo-header h2 { text-align: center; }
      .mo-card-actions { flex-direction: column; }
      .mo-modal-footer { flex-direction: column; }
      .mo-modal-footer .mo-btn { width: 100%; }
    }
  `;function q(e){return e?new Date(e).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"}):""}function z(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,100)}async function O(e){const o=z(e),{data:t}=await u.from("opportunities").select("slug").eq("slug",o).maybeSingle();if(!t)return o;const{data:r}=await u.from("opportunities").select("slug").like("slug",`${o}-%`),i=new Set((r||[]).map(p=>p.slug));i.add(o);let n=2;for(;i.has(`${o}-${n}`);)n++;return`${o}-${n}`}function R(e){if(!e||e.trim()==="")return"";let o=e.trim();/^https?:\/\//i.test(o)||(o="https://"+o);try{return new URL(o),o}catch{return""}}function E(e){if(!e||e.trim()==="")return!0;const o=e.trim();if(!/^https?:\/\//i.test(o))return!1;try{const t=new URL(o);return!!(t.hostname&&t.hostname.includes("."))}catch{return!1}}function _(e){return e.is_archived===!0?s.REJECTED:e.is_draft===!1?s.PUBLISHED:e.is_draft===!0?s.PENDING_REVIEW:s.DRAFT}function N(e){return{[s.DRAFT]:"Draft",[s.PENDING_REVIEW]:"Pending Review",[s.PUBLISHED]:"Published",[s.REJECTED]:"Not Approved"}[e]||e||"Draft"}function $(e){var o;return((o=k.find(t=>t.value===e))==null?void 0:o.label)||e||""}function A(e,o=""){let t=document.querySelector(".mo-progress-overlay");t||(t=document.createElement("div"),t.className="mo-progress-overlay",t.innerHTML=`
        <div class="mo-progress-container">
          <div class="mo-progress-spinner"></div>
          <div class="mo-progress-status"></div>
          <div class="mo-progress-detail"></div>
        </div>`,document.body.appendChild(t)),t.querySelector(".mo-progress-status").textContent=e,t.querySelector(".mo-progress-detail").textContent=o,t.style.display="flex"}function L(){const e=document.querySelector(".mo-progress-overlay");e&&(e.style.display="none")}async function M(){const{data:e,error:o}=await u.from("suburbs").select("id, name").order("name");return o?(console.error("Error loading suburbs:",o),[]):e||[]}async function U(){const{data:e,error:o}=await u.from("opportunities").select("*").eq("memberstack_id",l.id).order("created_at",{ascending:!1});if(o)throw console.error("Error loading opportunities:",o),o;return e||[]}async function I(e){const{data:o,error:t}=await u.from("opportunities").insert([e]).select().single();if(t)throw console.error("Error creating opportunity:",t),t;return o}async function j(e,o){const{data:t,error:r}=await u.from("opportunities").update(o).eq("id",e).select().single();if(r)throw console.error("Error updating opportunity:",r),r;return t}async function H(e){var r,i;const o=d.find(n=>n.id===e);if(o!=null&&o.webflow_id)try{const n=((i=(r=await window.$memberstackDom.getMemberToken())==null?void 0:r.data)==null?void 0:i.token)||"";await fetch(`${g}/functions/v1/manage-opportunity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b,"X-Member-Token":n},body:JSON.stringify({opportunityId:e,action:"reject"})})}catch(n){console.warn("Webflow cleanup failed, proceeding with delete:",n)}const{error:t}=await u.from("opportunities").delete().eq("id",e);if(t)throw console.error("Error deleting opportunity:",t),t}async function P(e,o=null){try{const t={memberstack_id:l.id,activity_type:e};o&&(t.entity_type="opportunity",t.entity_id=o.id||null,t.entity_name=o.name||null),await fetch(`${g}/functions/v1/log-activity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b},body:JSON.stringify(t)})}catch(t){console.warn("Failed to log activity:",t)}}async function B(e,o=!1){var t,r,i;try{const n=(t=l.customFields)!=null&&t["first-name"]?`${l.customFields["first-name"]} ${l.customFields["last-name"]||""}`.trim():((r=l.auth)==null?void 0:r.email)||"Unknown Member";await fetch(`${g}/functions/v1/notify-opportunity-submission`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b},body:JSON.stringify({opportunityName:e.name,opportunityType:$(e.opportunity_type),memberName:n,memberEmail:((i=l.auth)==null?void 0:i.email)||"",isUpdate:o})})}catch(n){console.warn("Failed to notify admin:",n)}}async function F(){return new Promise(e=>{if(window.$memberstackDom)return e();const o=setInterval(()=>{window.$memberstackDom&&(clearInterval(o),e())},100)})}async function T(){const e=document.querySelector(".member-opportunity-submission");if(!e){console.warn("Could not find .member-opportunity-submission container");return}if(typeof window.supabase>"u"){e.innerHTML='<div class="mo-loading">Error: Supabase library not loaded. Please refresh the page.</div>';return}u=window.supabase.createClient(g,b);const o=document.createElement("style");o.textContent=D,document.head.appendChild(o);const t=document.createElement("div");t.className="mo-container",t.innerHTML='<div class="mo-loading">Loading your listings...</div>',e.appendChild(t);try{await F();const{data:r}=await window.$memberstackDom.getCurrentMember();if(!r){t.innerHTML='<div class="mo-loading">Please log in to manage listings.</div>';return}l=r;const[i,n]=await Promise.all([M(),U()]);S=i,d=n,x(t)}catch(r){console.error("Error initializing member opportunities:",r),t.innerHTML='<div class="mo-loading">Error loading listings. Please refresh the page.</div>'}}function x(e){if(d.length===0){e.innerHTML=`
        <div class="mo-empty">
          <p>You haven't posted any opportunities yet</p>
          <button class="mo-btn" id="mo-add-first">Post an Opportunity</button>
        </div>`,e.querySelector("#mo-add-first").addEventListener("click",()=>w(null,e));return}e.innerHTML=`
      <div class="mo-header">
        <h2>My Opportunities</h2>
        <button class="mo-btn" id="mo-add-opp">Post New Opportunity</button>
      </div>
      <div class="mo-list">
        ${d.map(o=>J(o)).join("")}
      </div>`,e.querySelector("#mo-add-opp").addEventListener("click",()=>w(null,e)),e.querySelectorAll(".mo-card").forEach(o=>{const t=d.find(r=>r.id===o.dataset.oppId);t&&Y(o,t,e)})}function J(e){const o=_(e),r=[$(e.opportunity_type),e.closing_date?`Closes ${q(e.closing_date)}`:""].filter(Boolean).join(" · ");return`
      <div class="mo-card" data-opp-id="${e.id}">
        <div class="mo-card-header">
          <div>
            <h3 class="mo-card-title">${e.name||"Untitled"}</h3>
            <div class="mo-card-meta">${r}</div>
          </div>
          <div class="mo-card-status">
            <span class="mo-status mo-status-${o}">${N(o)}</span>
          </div>
        </div>
        ${e.description?`<div class="mo-card-body"><p class="mo-card-description">${e.description}</p></div>`:""}
        <div class="mo-card-actions">
          <button class="mo-btn mo-btn-secondary mo-btn-small mo-edit-btn">Edit</button>
          <button class="mo-btn mo-btn-danger mo-btn-small mo-delete-btn">Delete</button>
        </div>
      </div>`}function Y(e,o,t){e.querySelector(".mo-edit-btn").addEventListener("click",()=>w(o,t)),e.querySelector(".mo-delete-btn").addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this listing?"))return;const r=e.querySelector(".mo-delete-btn");r.disabled=!0,r.textContent="Deleting...";try{await H(o.id),d=d.filter(i=>i.id!==o.id),x(t)}catch(i){console.error("Error deleting opportunity:",i),alert("Error deleting listing. Please try again."),r.disabled=!1,r.textContent="Delete"}})}function W(e){let o='<option value="">Select a suburb... (optional)</option>';return S.forEach(t=>{o+=`<option value="${t.id}" ${t.id===e?"selected":""}>${t.name}</option>`}),`<select class="mo-form-input" id="mo-form-suburb">${o}</select>`}function V(e){let o='<option value="">Select a type...</option>';return k.forEach(t=>{o+=`<option value="${t.value}" ${t.value===e?"selected":""}>${t.label}</option>`}),`<select class="mo-form-input" id="mo-form-type">${o}</select>`}function w(e,o){const t=!!e,r=e||{},i=t?_(r):s.DRAFT,n=i===s.PUBLISHED,p=i===s.REJECTED,y=t&&(n||p),a=document.createElement("div");a.className="mo-modal-overlay",a.innerHTML=`
      <div class="mo-modal">
        <div class="mo-modal-header">
          <h3>${t?"Edit Listing":"Post an Opportunity"}</h3>
        </div>
        <div class="mo-modal-body">
          ${t?"":`
            <div class="mo-info-box">
              <p><strong>How it works:</strong> Submit your listing and our team will review it within 48 hours. Once approved, it will appear on the MTNS MADE jobs and opportunities board.</p>
            </div>`}
          ${y?`
            <div class="mo-info-box warning">
              <p><strong>Note:</strong> ${p?"This listing was not approved. You can edit and resubmit it for review.":"This listing is currently published. Any changes will require re-approval."}</p>
            </div>`:""}

          <div class="mo-form-field full-width">
            <label>Listing Title <span>*</span></label>
            <input type="text" class="mo-form-input" id="mo-form-name" value="${r.name||""}" placeholder="e.g., Seeking textile artist for collaboration">
          </div>

          <div class="mo-form-row">
            <div class="mo-form-field">
              <label>Opportunity Type <span>*</span></label>
              ${V(r.opportunity_type)}
            </div>
            <div class="mo-form-field">
              <label>Organisation / Posted By</label>
              <input type="text" class="mo-form-input" id="mo-form-org" value="${r.organization||""}" placeholder="Your name or business">
            </div>
          </div>

          <div class="mo-form-field full-width">
            <label>Description <span>*</span></label>
            <textarea class="mo-form-input" id="mo-form-description" placeholder="Describe the opportunity, what you're looking for, and any requirements...">${r.description||""}</textarea>
          </div>

          <div class="mo-form-field full-width">
            <label>How to Apply</label>
            <textarea class="mo-form-input" id="mo-form-apply" style="min-height:80px" placeholder="e.g., Send a portfolio and short expression of interest to...">${r.how_to_apply||""}</textarea>
          </div>

          <div class="mo-form-row">
            <div class="mo-form-field">
              <label>Link to Full Details</label>
              <input type="text" class="mo-form-input" id="mo-form-url" value="${r.opportunity_url||""}" placeholder="https://...">
              <div class="mo-hint">External job listing, application form, etc.</div>
              <div class="mo-error-msg" id="mo-url-error">Link must be complete and include https://</div>
            </div>
            <div class="mo-form-field">
              <label>Closing Date</label>
              <input type="date" class="mo-form-input" id="mo-form-closing" value="${r.closing_date||""}">
              <div class="mo-hint">Leave blank if no closing date</div>
            </div>
          </div>

          <div class="mo-form-row">
            <div class="mo-form-field">
              <label>Suburb</label>
              ${W(r.suburb_id)}
            </div>
            <div class="mo-form-field" style="display:flex;align-items:center;padding-top:28px">
              <label style="display:flex;align-items:center;gap:8px;font-weight:400;cursor:pointer">
                <input type="checkbox" id="mo-form-remote" ${r.is_remote?"checked":""}>
                Remote / location flexible
              </label>
            </div>
          </div>

        </div>
        <div class="mo-modal-footer">
          <button class="mo-btn mo-btn-secondary" id="mo-modal-cancel">Cancel</button>
          <button class="mo-btn mo-btn-success" id="mo-modal-submit">
            ${t?n||p?"Submit for Re-Review":"Update & Submit":"Submit for Review"}
          </button>
        </div>
      </div>`,document.body.appendChild(a);const c=a.querySelector("#mo-form-url"),v=a.querySelector("#mo-url-error");c.addEventListener("blur",()=>{const f=E(c.value);c.classList.toggle("error",!f&&c.value),v.classList.toggle("visible",!f&&c.value)}),a.addEventListener("click",f=>{f.target===a&&a.remove()}),a.querySelector("#mo-modal-cancel").addEventListener("click",()=>a.remove()),a.querySelector("#mo-modal-submit").addEventListener("click",()=>G(a,r,o))}async function G(e,o,t,r){var v;const i=!!o.id,n=e.querySelector("#mo-form-name").value.trim(),p=e.querySelector("#mo-form-type").value,y=e.querySelector("#mo-form-description").value.trim(),a=e.querySelector("#mo-form-url").value.trim();if(!n){alert("Please enter a listing title");return}if(!p){alert("Please select an opportunity type");return}if(!y){alert("Please enter a description");return}if(a&&!E(a)){alert("Please enter a valid link URL");return}const c=e.querySelector("#mo-modal-submit");c.disabled=!0,c.textContent="Submitting...";try{A("Saving listing...","Please wait");const f=i?o.slug:await O(n),C={memberstack_id:l.id,member_contact_email:((v=l.auth)==null?void 0:v.email)||"",name:n,slug:f,opportunity_type:p||null,organization:e.querySelector("#mo-form-org").value.trim()||null,description:y||null,how_to_apply:e.querySelector("#mo-form-apply").value.trim()||null,opportunity_url:R(a)||null,closing_date:e.querySelector("#mo-form-closing").value||null,suburb_id:e.querySelector("#mo-form-suburb").value||null,is_remote:e.querySelector("#mo-form-remote").checked,is_draft:!0,is_archived:!1};let m;if(i){m=await j(o.id,C),await P("opportunity_update",{id:m.id,name:m.name});const h=d.findIndex(K=>K.id===o.id);h>-1&&(d[h]=m)}else m=await I(C),await P("opportunity_submit",{id:m.id,name:m.name}),d.unshift(m);L(),e.remove(),x(t),B(m,i).catch(h=>console.warn("Admin notification failed:",h)),alert(i?"Your listing has been updated and submitted for review.":"Your listing has been submitted for review. We'll notify you once it's approved.")}catch(f){console.error("Error saving opportunity:",f),L(),alert("Error saving listing. Please try again."),c.disabled=!1,c.textContent="Submit for Review"}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",T):T()})();
