(function(){const g="https://epszwomtxkpjegbjbixr.supabase.co",u="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",d={job:"Job / Employment",commission:"Commission",collaboration:"Collaboration","call-for-entries":"Call for Entries",residency:"Residency / Fellowship",volunteer:"Volunteer"},b=`
    /* ── Summary cards ── */
    .x-opp-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .x-opp-row {
      display: flex;
      align-items: baseline;
      gap: 16px;
      padding: 20px 24px;
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s;
      text-align: left;
      width: 100%;
      font-family: inherit;
      position: relative;
    }
    .x-opp-row:hover {
      border-color: #1a1a1a;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .x-opp-row-left {
      flex: 1;
      min-width: 0;
    }
    .x-opp-row-right {
      flex-shrink: 0;
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .x-opp-type-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: #666;
      background: #f2f2f2;
      border-radius: 2px;
      padding: 2px 7px;
      margin-bottom: 6px;
    }

    .x-opp-row-title {
      margin: 0 0 3px;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .x-opp-row-org {
      font-size: 13px;
      color: #777;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .x-opp-row-meta {
      font-size: 12px;
      color: #999;
      white-space: nowrap;
    }
    .x-opp-row-meta strong { color: #666; font-weight: 600; }

    .x-opp-closing-soon {
      font-size: 11px;
      font-weight: 600;
      color: #c0392b;
      letter-spacing: 0.03em;
    }

    .x-opp-row-arrow {
      font-size: 16px;
      color: #ccc;
      margin-left: 8px;
      flex-shrink: 0;
      align-self: center;
    }
    .x-opp-row:hover .x-opp-row-arrow { color: #1a1a1a; }

    /* ── Overlay ── */
    .x-opp-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 9999;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 40px 20px;
      overflow-y: auto;
    }

    .x-opp-modal {
      background: #fff;
      border-radius: 6px;
      width: 100%;
      max-width: 720px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      position: relative;
      padding: 48px 52px;
      margin: auto;
    }

    .x-opp-modal-close {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      font-size: 22px;
      color: #aaa;
      cursor: pointer;
      line-height: 1;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: inherit;
    }
    .x-opp-modal-close:hover { color: #1a1a1a; background: #f5f5f5; }

    .x-opp-modal-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: #666;
      background: #f2f2f2;
      border-radius: 2px;
      padding: 3px 8px;
      margin-bottom: 14px;
    }

    .x-opp-modal-title {
      margin: 0 0 6px;
      font-size: 26px;
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1.25;
    }

    .x-opp-modal-org {
      font-size: 15px;
      color: #777;
      margin: 0 0 24px;
    }

    .x-opp-modal-meta-row {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      padding: 16px 0;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 28px;
    }
    .x-opp-modal-meta-item {
      font-size: 13px;
      color: #666;
    }
    .x-opp-modal-meta-item strong {
      display: block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #aaa;
      margin-bottom: 2px;
    }

    .x-opp-modal-section {
      margin-bottom: 24px;
    }
    .x-opp-modal-section h3 {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #aaa;
      margin: 0 0 8px;
    }
    .x-opp-modal-section p {
      font-size: 15px;
      color: #333;
      line-height: 1.7;
      margin: 0;
      white-space: pre-line;
    }

    .x-opp-modal-actions {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .x-opp-modal-apply {
      display: inline-block;
      background: #1a1a1a;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 4px;
      letter-spacing: 0.02em;
    }
    .x-opp-modal-apply:hover { background: #333; color: #fff; }

    .x-opp-modal-contact {
      font-size: 13px;
      color: #888;
    }
    .x-opp-modal-contact a { color: #555; }

    /* ── Filters ── */
    .x-opp-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 28px;
    }
    .x-opp-filter-btn {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 2px;
      padding: 7px 16px;
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      color: #333;
      transition: all 0.15s;
    }
    .x-opp-filter-btn:hover { border-color: #333; }
    .x-opp-filter-btn.active {
      background: #1a1a1a;
      border-color: #1a1a1a;
      color: #fff;
    }

    .x-opp-loading, .x-opp-empty {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .x-opp-empty h3 { margin: 0 0 8px; font-size: 18px; color: #333; }

    @media (max-width: 600px) {
      .x-opp-row { flex-wrap: wrap; }
      .x-opp-row-right { flex-direction: row; align-items: center; gap: 12px; }
      .x-opp-modal { padding: 32px 24px; }
      .x-opp-modal-title { font-size: 22px; }
    }
  `;let l=[],s=null;function c(o){return o?new Date(o).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"}):null}function x(o){if(!o)return!1;const t=(new Date(o)-new Date)/(1e3*60*60*24);return t>=0&&t<=14}function y(o){const t=d[o.opportunity_type]||o.opportunity_type||"",i=c(o.closing_date),a=x(o.closing_date);return`
      <button class="x-opp-row" data-id="${o.id}" type="button" aria-label="View ${o.name}">
        <div class="x-opp-row-left">
          ${t?`<span class="x-opp-type-badge">${t}</span>`:""}
          <h2 class="x-opp-row-title">${o.name||"Untitled"}</h2>
          ${o.organization?`<p class="x-opp-row-org">${o.organization}</p>`:""}
        </div>
        <div class="x-opp-row-right">
          ${i?`<div class="x-opp-row-meta"><strong>Closes</strong> ${i}</div>`:""}
          ${a?'<div class="x-opp-closing-soon">Closing soon</div>':""}
          ${o.budget?`<div class="x-opp-row-meta">${o.budget}</div>`:""}
        </div>
        <span class="x-opp-row-arrow">›</span>
      </button>`}function h(o){const t=d[o.opportunity_type]||o.opportunity_type||"",i=c(o.closing_date),a=x(o.closing_date),e=document.createElement("div");e.className="x-opp-overlay",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.innerHTML=`
      <div class="x-opp-modal">
        <button class="x-opp-modal-close" aria-label="Close">✕</button>

        ${t?`<span class="x-opp-modal-badge">${t}</span>`:""}
        <h2 class="x-opp-modal-title">${o.name||"Untitled"}</h2>
        ${o.organization?`<p class="x-opp-modal-org">${o.organization}</p>`:""}

        <div class="x-opp-modal-meta-row">
          ${i?`
            <div class="x-opp-modal-meta-item">
              <strong>Closes</strong>
              ${i}${a?' <span style="color:#c0392b;font-weight:600"> · Closing soon</span>':""}
            </div>`:""}
          ${o.budget?`
            <div class="x-opp-modal-meta-item">
              <strong>Budget / Rate</strong>
              ${o.budget}
            </div>`:""}
          ${o.is_remote?`
            <div class="x-opp-modal-meta-item">
              <strong>Location</strong>
              Remote / location flexible
            </div>`:""}
        </div>

        ${o.description?`
          <div class="x-opp-modal-section">
            <h3>About this opportunity</h3>
            <p>${o.description}</p>
          </div>`:""}

        ${o.criteria?`
          <div class="x-opp-modal-section">
            <h3>Criteria</h3>
            <p>${o.criteria}</p>
          </div>`:""}

        <div class="x-opp-modal-actions">
          ${o.opportunity_url?`<a href="${o.opportunity_url}" target="_blank" rel="noopener" class="x-opp-modal-apply">Apply / More info →</a>`:""}
          ${o.member_contact_email?`<span class="x-opp-modal-contact">or email <a href="mailto:${o.member_contact_email}">${o.member_contact_email}</a></span>`:""}
        </div>
      </div>`,document.body.appendChild(e),document.body.style.overflow="hidden",e.querySelector(".x-opp-modal-close").addEventListener("click",r),e.addEventListener("click",p=>{p.target===e&&r()}),document.addEventListener("keydown",n);function r(){e.remove(),document.body.style.overflow="",document.removeEventListener("keydown",n)}function n(p){p.key==="Escape"&&r()}}function m(o,t){if(t.length===0){o.innerHTML=`
        <div class="x-opp-empty">
          <h3>No opportunities found</h3>
          <p>${s?"Try clearing the filter or check back soon.":"Check back soon — new listings are added regularly."}</p>
        </div>`;return}o.innerHTML=`<div class="x-opp-list">${t.map(y).join("")}</div>`,o.querySelectorAll(".x-opp-row").forEach(i=>{i.addEventListener("click",()=>{const a=l.find(e=>e.id===i.dataset.id);a&&h(a)})})}function w(o,t){const i=[...new Set(t.map(e=>e.opportunity_type).filter(Boolean))];if(i.length<2){o.style.display="none";return}const a=i.map(e=>{const r=d[e]||e;return`<button class="x-opp-filter-btn" data-type="${e}">${r}</button>`}).join("");o.innerHTML=`
      <div class="x-opp-filters">
        ${a}
        <button class="x-opp-filter-btn active" data-type="">All</button>
      </div>`,o.querySelectorAll(".x-opp-filter-btn").forEach(e=>{e.addEventListener("click",()=>{o.querySelectorAll(".x-opp-filter-btn").forEach(p=>p.classList.remove("active")),e.classList.add("active"),s=e.dataset.type||null;const r=s?l.filter(p=>p.opportunity_type===s):l,n=document.querySelector(".x-member-grid-container");n&&m(n,r)})})}async function f(){const o=document.querySelector(".x-member-grid-container");if(!o)return;if(!window.supabase){o.innerHTML='<div class="x-opp-loading">Error: Supabase not loaded. Please refresh.</div>';return}const t=window.supabase.createClient(g,u),i=document.createElement("style");i.textContent=b,document.head.appendChild(i),o.innerHTML='<div class="x-opp-loading">Loading opportunities...</div>';const{data:a,error:e}=await t.from("opportunities").select("id, name, slug, opportunity_type, organization, description, criteria, budget, closing_date, opportunity_url, member_contact_email, is_remote, created_at").eq("is_draft",!1).eq("is_archived",!1).order("created_at",{ascending:!1});if(e){console.error("Opportunities display error:",e),o.innerHTML='<div class="x-opp-empty"><h3>Error loading opportunities</h3><p>Please refresh the page.</p></div>';return}l=a||[];const r=document.querySelector(".directory-filters")||(()=>{const n=document.createElement("div");return o.parentNode.insertBefore(n,o),n})();w(r,l),m(o,l)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f()})();
