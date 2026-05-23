(function(){console.log("Member opportunities Supabase script loaded");const g="https://epszwomtxkpjegbjbixr.supabase.co",b="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",E=[{value:"job",label:"Job / Employment"},{value:"commission",label:"Commission"},{value:"collaboration",label:"Collaboration"},{value:"call-for-entries",label:"Call for Entries"},{value:"residency",label:"Residency / Fellowship"},{value:"volunteer",label:"Volunteer"}];let m=null,l=null,d=[],$=[];const s={DRAFT:"draft",PENDING_REVIEW:"pending_review",PUBLISHED:"published",REJECTED:"rejected"},N=`
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
  `;function O(e){return e?new Date(e).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"}):""}function R(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,100)}async function A(e){const t=R(e),{data:o}=await m.from("opportunities").select("slug").eq("slug",t).maybeSingle();if(!o)return t;const{data:r}=await m.from("opportunities").select("slug").like("slug",`${t}-%`),i=new Set((r||[]).map(u=>u.slug));i.add(t);let n=2;for(;i.has(`${t}-${n}`);)n++;return`${t}-${n}`}function M(e){if(!e||e.trim()==="")return"";let t=e.trim();/^https?:\/\//i.test(t)||(t="https://"+t);try{return new URL(t),t}catch{return""}}function _(e){if(!e||e.trim()==="")return!0;const t=e.trim();if(!/^https?:\/\//i.test(t))return!1;try{const o=new URL(t);return!!(o.hostname&&o.hostname.includes("."))}catch{return!1}}function L(e){return e.is_archived===!0?s.REJECTED:e.is_draft===!1?s.PUBLISHED:e.is_draft===!0?s.PENDING_REVIEW:s.DRAFT}function U(e){return{[s.DRAFT]:"Draft",[s.PENDING_REVIEW]:"Pending Review",[s.PUBLISHED]:"Published",[s.REJECTED]:"Not Approved"}[e]||e||"Draft"}function P(e){var t;return((t=E.find(o=>o.value===e))==null?void 0:t.label)||e||""}function I(e,t=""){let o=document.querySelector(".mo-progress-overlay");o||(o=document.createElement("div"),o.className="mo-progress-overlay",o.innerHTML=`
        <div class="mo-progress-container">
          <div class="mo-progress-spinner"></div>
          <div class="mo-progress-status"></div>
          <div class="mo-progress-detail"></div>
        </div>`,document.body.appendChild(o)),o.querySelector(".mo-progress-status").textContent=e,o.querySelector(".mo-progress-detail").textContent=t,o.style.display="flex"}function T(){const e=document.querySelector(".mo-progress-overlay");e&&(e.style.display="none")}async function j(){const{data:e,error:t}=await m.from("suburbs").select("id, name").order("name");return t?(console.error("Error loading suburbs:",t),[]):e||[]}async function B(){const{data:e,error:t}=await m.from("opportunities").select("*").eq("memberstack_id",l.id).order("created_at",{ascending:!1});if(t)throw console.error("Error loading opportunities:",t),t;return e||[]}async function F(e){const{data:t,error:o}=await m.from("opportunities").insert([e]).select().single();if(o)throw console.error("Error creating opportunity:",o),o;return t}async function H(e,t){const{data:o,error:r}=await m.from("opportunities").update(t).eq("id",e).select().single();if(r)throw console.error("Error updating opportunity:",r),r;return o}async function J(e){var r,i;const t=d.find(n=>n.id===e);if(t!=null&&t.webflow_id)try{const n=((i=(r=await window.$memberstackDom.getMemberToken())==null?void 0:r.data)==null?void 0:i.token)||"";await fetch(`${g}/functions/v1/manage-opportunity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b,"X-Member-Token":n},body:JSON.stringify({opportunityId:e,action:"reject"})})}catch(n){console.warn("Webflow cleanup failed, proceeding with delete:",n)}const{error:o}=await m.from("opportunities").delete().eq("id",e);if(o)throw console.error("Error deleting opportunity:",o),o}async function C(e,t=null){try{const o={memberstack_id:l.id,activity_type:e};t&&(o.entity_type="opportunity",o.entity_id=t.id||null,o.entity_name=t.name||null),await fetch(`${g}/functions/v1/log-activity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b},body:JSON.stringify(o)})}catch(o){console.warn("Failed to log activity:",o)}}async function Y(e,t=!1){var o,r,i;try{const n=(o=l.customFields)!=null&&o["first-name"]?`${l.customFields["first-name"]} ${l.customFields["last-name"]||""}`.trim():((r=l.auth)==null?void 0:r.email)||"Unknown Member";await fetch(`${g}/functions/v1/notify-opportunity-submission`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,apikey:b},body:JSON.stringify({opportunityName:e.name,opportunityType:P(e.opportunity_type),memberName:n,memberEmail:((i=l.auth)==null?void 0:i.email)||"",isUpdate:t})})}catch(n){console.warn("Failed to notify admin:",n)}}async function W(){return new Promise(e=>{if(window.$memberstackDom)return e();const t=setInterval(()=>{window.$memberstackDom&&(clearInterval(t),e())},100)})}async function q(){const e=document.querySelector(".member-opportunity-submission");if(!e){console.warn("Could not find .member-opportunity-submission container");return}if(typeof window.supabase>"u"){e.innerHTML='<div class="mo-loading">Error: Supabase library not loaded. Please refresh the page.</div>';return}m=window.supabase.createClient(g,b);const t=document.createElement("style");t.textContent=N,document.head.appendChild(t);const o=document.createElement("div");o.className="mo-container",o.innerHTML='<div class="mo-loading">Loading your listings...</div>',e.appendChild(o);try{await W();const{data:r}=await window.$memberstackDom.getCurrentMember();if(!r){o.innerHTML='<div class="mo-loading">Please log in to manage listings.</div>';return}l=r;const[i,n]=await Promise.all([j(),B()]);$=i,d=n,w(o)}catch(r){console.error("Error initializing member opportunities:",r),o.innerHTML='<div class="mo-loading">Error loading listings. Please refresh the page.</div>'}}function w(e){if(d.length===0){e.innerHTML=`
        <div class="mo-empty">
          <p>You haven't posted any opportunities yet</p>
          <button class="mo-btn" id="mo-add-first">Post an Opportunity</button>
        </div>`,e.querySelector("#mo-add-first").addEventListener("click",()=>k(null,e));return}e.innerHTML=`
      <div class="mo-header">
        <h2>My Opportunities</h2>
        <button class="mo-btn" id="mo-add-opp">Post New Opportunity</button>
      </div>
      <div class="mo-list">
        ${d.map(t=>V(t)).join("")}
      </div>`,e.querySelector("#mo-add-opp").addEventListener("click",()=>k(null,e)),e.querySelectorAll(".mo-card").forEach(t=>{const o=d.find(r=>r.id===t.dataset.oppId);o&&G(t,o,e)})}function V(e){const t=L(e),r=[P(e.opportunity_type),e.closing_date?`Closes ${O(e.closing_date)}`:""].filter(Boolean).join(" · ");return`
      <div class="mo-card" data-opp-id="${e.id}">
        <div class="mo-card-header">
          <div>
            <h3 class="mo-card-title">${e.name||"Untitled"}</h3>
            <div class="mo-card-meta">${r}</div>
          </div>
          <div class="mo-card-status">
            <span class="mo-status mo-status-${t}">${U(t)}</span>
          </div>
        </div>
        ${e.description?`<div class="mo-card-body"><p class="mo-card-description">${e.description}</p></div>`:""}
        <div class="mo-card-actions">
          <button class="mo-btn mo-btn-secondary mo-btn-small mo-edit-btn">Edit</button>
          <button class="mo-btn mo-btn-danger mo-btn-small mo-delete-btn">Delete</button>
        </div>
      </div>`}function G(e,t,o){e.querySelector(".mo-edit-btn").addEventListener("click",()=>k(t,o)),e.querySelector(".mo-delete-btn").addEventListener("click",async()=>{if(!confirm("Are you sure you want to delete this listing?"))return;const r=e.querySelector(".mo-delete-btn");r.disabled=!0,r.textContent="Deleting...";try{await J(t.id),d=d.filter(i=>i.id!==t.id),w(o)}catch(i){console.error("Error deleting opportunity:",i),alert("Error deleting listing. Please try again."),r.disabled=!1,r.textContent="Delete"}})}function K(e){let t='<option value="">Select a suburb... (optional)</option>';return $.forEach(o=>{t+=`<option value="${o.id}" ${o.id===e?"selected":""}>${o.name}</option>`}),`<select class="mo-form-input" id="mo-form-suburb">${t}</select>`}function X(e){let t='<option value="">Select a type...</option>';return E.forEach(o=>{t+=`<option value="${o.value}" ${o.value===e?"selected":""}>${o.label}</option>`}),`<select class="mo-form-input" id="mo-form-type">${t}</select>`}function k(e,t){const o=!!e,r=e||{},i=o?L(r):s.DRAFT,n=i===s.PUBLISHED,u=i===s.REJECTED,y=o&&(n||u),a=document.createElement("div");a.className="mo-modal-overlay",a.innerHTML=`
      <div class="mo-modal">
        <div class="mo-modal-header">
          <h3>${o?"Edit Listing":"Post an Opportunity"}</h3>
        </div>
        <div class="mo-modal-body">
          ${o?"":`
            <div class="mo-info-box">
              <p><strong>How it works:</strong> Submit your listing and our team will review it within 48 hours. Once approved, it will appear on the MTNS MADE jobs and opportunities board.</p>
            </div>`}
          ${y?`
            <div class="mo-info-box warning">
              <p><strong>Note:</strong> ${u?"This listing was not approved. You can edit and resubmit it for review.":"This listing is currently published. Any changes will require re-approval."}</p>
            </div>`:""}

          <div class="mo-form-field full-width">
            <label>Job / Opportunity Title <span>*</span></label>
            <input type="text" class="mo-form-input" id="mo-form-name" value="${r.name||""}" placeholder="e.g., Seeking textile artist for collaboration">
          </div>

          <div class="mo-form-row">
            <div class="mo-form-field">
              <label>Opportunity Type <span>*</span></label>
              ${X(r.opportunity_type)}
            </div>
            <div class="mo-form-field">
              <label>Trading Name / Business Name</label>
              <input type="text" class="mo-form-input" id="mo-form-org" value="${r.organization||""}" placeholder="Your name or business">
            </div>
          </div>

          <div class="mo-form-row">
            <div class="mo-form-field">
              <label>Closing Date <span>*</span></label>
              <input type="date" class="mo-form-input" id="mo-form-closing" value="${r.closing_date||""}">
            </div>
            <div class="mo-form-field">
              <label>Budget <span>*</span></label>
              <input type="text" class="mo-form-input" id="mo-form-budget" value="${r.budget||""}" placeholder="e.g. $500–1000 AUD">
            </div>
          </div>

          <div class="mo-form-field full-width">
            <label>Summary of Job or Opportunity <span>*</span></label>
            <textarea class="mo-form-input" id="mo-form-description" placeholder="Describe the opportunity, what you're looking for, and any key details...">${r.description||""}</textarea>
          </div>

          <div class="mo-form-field full-width">
            <label>Criteria <span>*</span></label>
            <textarea class="mo-form-input" id="mo-form-criteria" style="min-height:100px" placeholder="List the required or desired attributes for applicants...">${r.criteria||""}</textarea>
            <div class="mo-hint">Required or desired attributes the applicant should have</div>
          </div>

          <div class="mo-form-row">
            <div class="mo-form-field">
              <label>Link to Full Details</label>
              <input type="text" class="mo-form-input" id="mo-form-url" value="${r.opportunity_url||""}" placeholder="https://...">
              <div class="mo-hint">External job listing, application form, etc.</div>
              <div class="mo-error-msg" id="mo-url-error">Link must be complete and include https://</div>
            </div>
            <div class="mo-form-field">
              <label>Suburb</label>
              ${K(r.suburb_id)}
            </div>
          </div>

          <div class="mo-form-field">
            <label style="display:flex;align-items:center;gap:8px;font-weight:400;cursor:pointer">
              <input type="checkbox" id="mo-form-remote" ${r.is_remote?"checked":""}>
              Remote / location flexible
            </label>
          </div>

        </div>
        <div class="mo-modal-footer">
          <button class="mo-btn mo-btn-secondary" id="mo-modal-cancel">Cancel</button>
          <button class="mo-btn mo-btn-success" id="mo-modal-submit">
            ${o?n||u?"Submit for Re-Review":"Update & Submit":"Submit for Review"}
          </button>
        </div>
      </div>`,document.body.appendChild(a);const p=a.querySelector("#mo-form-url"),v=a.querySelector("#mo-url-error");p.addEventListener("blur",()=>{const f=_(p.value);p.classList.toggle("error",!f&&p.value),v.classList.toggle("visible",!f&&p.value)}),a.addEventListener("click",f=>{f.target===a&&a.remove()}),a.querySelector("#mo-modal-cancel").addEventListener("click",()=>a.remove()),a.querySelector("#mo-modal-submit").addEventListener("click",()=>Q(a,r,t))}async function Q(e,t,o,r){var D;const i=!!t.id,n=e.querySelector("#mo-form-name").value.trim(),u=e.querySelector("#mo-form-type").value,y=e.querySelector("#mo-form-description").value.trim(),a=e.querySelector("#mo-form-budget").value.trim(),p=e.querySelector("#mo-form-criteria").value.trim(),v=e.querySelector("#mo-form-closing").value,f=e.querySelector("#mo-form-url").value.trim();if(!n){alert("Please enter a listing title");return}if(!u){alert("Please select an opportunity type");return}if(!v){alert("Please enter a closing date");return}if(!a){alert("Please enter a budget or remuneration");return}if(!y){alert("Please enter a summary of the opportunity");return}if(!p){alert("Please enter the criteria for applicants");return}if(f&&!_(f)){alert("Please enter a valid link URL");return}const h=e.querySelector("#mo-modal-submit");h.disabled=!0,h.textContent="Submitting...";try{I("Saving listing...","Please wait");const S=i?t.slug:await A(n),z={memberstack_id:l.id,member_contact_email:((D=l.auth)==null?void 0:D.email)||"",name:n,slug:S,opportunity_type:u||null,organization:e.querySelector("#mo-form-org").value.trim()||null,description:y||null,budget:a||null,criteria:p||null,how_to_apply:null,opportunity_url:M(f)||null,closing_date:v||null,suburb_id:e.querySelector("#mo-form-suburb").value||null,is_remote:e.querySelector("#mo-form-remote").checked,is_draft:!0,is_archived:!1};let c;if(i){c=await H(t.id,z),await C("opportunity_update",{id:c.id,name:c.name});const x=d.findIndex(Z=>Z.id===t.id);x>-1&&(d[x]=c)}else c=await F(z),await C("opportunity_submit",{id:c.id,name:c.name}),d.unshift(c);T(),e.remove(),w(o),Y(c,i).catch(x=>console.warn("Admin notification failed:",x)),alert(i?"Your listing has been updated and submitted for review.":"Your listing has been submitted for review. We'll notify you once it's approved.")}catch(S){console.error("Error saving opportunity:",S),T(),alert("Error saving listing. Please try again."),h.disabled=!1,h.textContent="Submit for Review"}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",q):q()})();
