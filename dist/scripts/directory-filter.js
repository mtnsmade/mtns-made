(function(){const D="https://epszwomtxkpjegbjbixr.supabase.co",$="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTE5MzUsImV4cCI6MjA4NTg4NzkzNX0.TJPI5NQmWHR6F5eGVZH26Mzj601RDp5bgcpYZFVymwQ";let p,b=[],u=[],g={},l=new Set;const q=`
    .directory-filters {
      margin-bottom: 32px;
    }

    /* Active filter button state */
    .directory-filter-btn.active {
      background-color: #F05D61 !important;
      border-color: #F05D61 !important;
      color: #fff !important;
    }
    .directory-filter-btn.active:hover {
      background-color: #d94d51 !important;
      border-color: #d94d51 !important;
    }

    /* Clear button - same size, reversed colors */
    .directory-filter-clear {
      background-color: #fff !important;
      border: 1px solid #333 !important;
      color: #333 !important;
    }
    .directory-filter-clear:hover {
      background-color: #333 !important;
      color: #fff !important;
    }

    .directory-member-count {
      margin-top: 16px;
      font-size: 14px;
      color: #666;
      text-align: center;
    }
    .directory-loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .directory-empty {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .directory-empty h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      color: #333;
    }

    /* Mobile dropdown */
    .directory-filter-mobile {
      display: none;
      position: relative;
      margin-bottom: 16px;
    }
    .directory-filter-mobile-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 12px 16px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      color: #333;
      cursor: pointer;
      transition: border-color 0.15s ease;
    }
    .directory-filter-mobile-trigger:hover {
      border-color: #ccc;
    }
    .directory-filter-mobile-trigger svg {
      width: 16px;
      height: 16px;
      opacity: 0.5;
      transition: transform 0.2s ease;
    }
    .directory-filter-mobile-trigger[aria-expanded="true"] svg {
      transform: rotate(180deg);
    }
    .directory-filter-mobile-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      max-height: 300px;
      overflow-y: auto;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      padding: 4px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-4px);
      transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
      z-index: 50;
    }
    .directory-filter-mobile-dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .directory-filter-mobile-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 12px;
      background: transparent;
      border: none;
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
      color: #333;
      cursor: pointer;
      text-align: left;
      transition: background 0.15s ease;
    }
    .directory-filter-mobile-item:hover {
      background: #DCF1EF;
    }
    .directory-filter-mobile-item.active {
      background: #F05D61;
      color: #fff;
    }
    .directory-filter-mobile-item.active:hover {
      background: #d94d51;
    }
    .directory-filter-mobile-item .checkmark {
      display: none;
      width: 16px;
      height: 16px;
    }
    .directory-filter-mobile-item.active .checkmark {
      display: block;
    }
    .directory-filter-mobile-clear {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 10px 12px;
      margin-top: 4px;
      background: transparent;
      border: none;
      border-top: 1px solid #e2e8f0;
      border-radius: 0;
      font-family: inherit;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      text-align: center;
      transition: color 0.15s ease;
    }
    .directory-filter-mobile-clear:hover {
      color: #333;
    }

    /* Desktop: show buttons, hide dropdown */
    .directory-filter-desktop {
      display: block;
    }

    /* Mobile: hide buttons, show dropdown */
    @media (max-width: 767px) {
      .directory-filter-desktop {
        display: none;
      }
      .directory-filter-mobile {
        display: block;
      }
    }
  `;function z(){if(!document.getElementById("directory-filter-styles")){const e=document.createElement("style");e.id="directory-filter-styles",e.textContent=q,document.head.appendChild(e)}}function L(){const r=window.location.pathname.match(/\/directories\/([^\/]+)/);return r?r[1]:null}async function _(){const e=L();if(!e){console.log("Directory filter: Not on a directory page");return}const r=document.querySelector(".x-member-grid-container")||document.querySelector(".directory-members-grid"),i=document.querySelector(".directory-filters");if(!r){console.log("Directory filter: No members grid container found (.x-member-grid-container or .directory-members-grid)");return}if(z(),!window.supabase){console.error("Directory filter: Supabase library not loaded");return}p=window.supabase.createClient(D,$),r.innerHTML='<div class="w-dyn-list"><div class="directory-loading">Loading members...</div></div>';try{await I(e),i&&F(i),x(r,u)}catch(o){console.error("Directory filter error:",o),r.innerHTML='<div class="directory-empty"><h3>Error loading members</h3><p>Please refresh the page.</p></div>'}}async function I(e){console.log("Directory filter: Loading data for",e);const{data:r,error:i}=await p.from("directories").select("id, name, slug").eq("slug",e).single();if(i||!r)throw new Error("Directory not found: "+e);console.log("Directory filter: Found directory",r.name,r.id);const{data:o,error:d}=await p.from("sub_directories").select("id, name, slug").eq("directory_id",r.id).order("name");if(d)throw d;b=o||[],console.log("Directory filter: Found",b.length,"sub-directories");const t=new Set;g={};const{data:c,error:m}=await p.from("member_directories").select("member_id").eq("directory_id",r.id);m?console.log("Directory filter: Error fetching parent directory members:",m):(console.log("Directory filter: Found",(c||[]).length,"members via parent directory"),(c||[]).forEach(a=>t.add(a.member_id)));const n=b.map(a=>a.id);if(n.length>0){const{data:a,error:w}=await p.from("member_sub_directories").select("member_id, sub_directory_id").in("sub_directory_id",n);w?console.log("Directory filter: Error fetching sub-directory members:",w):(console.log("Directory filter: Found",(a||[]).length,"member-subdirectory links"),(a||[]).forEach(f=>{t.add(f.member_id),g[f.member_id]||(g[f.member_id]=[]),g[f.member_id].push(f.sub_directory_id)}))}if(console.log("Directory filter: Found",t.size,"unique members total"),t.size===0){u=[];return}const{data:s,error:y}=await p.from("members").select(`
        id, name, slug, business_name, memberstack_id, webflow_id,
        profile_image_url, header_image_url, short_summary,
        suburb_id, suburbs(name, slug),
        status, subscription_status, membership_type_id,
        membership_types(name)
      `).in("id",Array.from(t)).not("memberstack_id","is",null).not("webflow_id","is",null).in("subscription_status",["active","trialing"]).order("name");if(y)throw y;console.log("Directory filter: Fetched",(s||[]).length,"members from database");const h={},v={};(s||[]).forEach(a=>{h[a.status||"null"]=(h[a.status||"null"]||0)+1,v[a.subscription_status||"null"]=(v[a.subscription_status||"null"]||0)+1}),console.log("Directory filter: Status breakdown:",h),console.log("Directory filter: Subscription status breakdown:",v),u=(s||[]).filter(a=>!(!a.memberstack_id||!a.webflow_id||a.subscription_status!=="active"&&a.subscription_status!=="trialing")).map(a=>({...a,subDirectoryIds:g[a.id]||[],subDirectoryNames:(g[a.id]||[]).map(w=>{var f;return(f=b.find(C=>C.id===w))==null?void 0:f.name}).filter(Boolean)})),console.log("Directory filter: Loaded",u.length,"members after filtering")}function F(e){var m,n;if(b.length===0){e.innerHTML="";return}const r='<svg class="checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',i='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>',o=b.map(s=>`
      <div role="listitem" class="w-dyn-item">
        <button class="button w-button directory-filter-btn" data-sub-id="${s.id}" data-sub-slug="${s.slug}">
          ${s.name}
        </button>
      </div>
    `).join(""),d=b.map(s=>`
      <button class="directory-filter-mobile-item" data-sub-id="${s.id}" data-sub-slug="${s.slug}">
        <span>${s.name}</span>
        ${r}
      </button>
    `).join("");e.innerHTML=`
      <!-- Mobile dropdown -->
      <div class="directory-filter-mobile">
        <button class="directory-filter-mobile-trigger" aria-expanded="false">
          <span class="directory-filter-mobile-label">Filter by specialty</span>
          ${i}
        </button>
        <div class="directory-filter-mobile-dropdown">
          ${d}
          <button class="directory-filter-mobile-clear" style="display: none;">Clear all filters</button>
        </div>
      </div>

      <!-- Desktop buttons -->
      <div class="directory-filter-desktop">
        <div class="max-width-large">
          <div class="margin-top">
            <div class="w-dyn-list">
              <div role="list" class="member-categories subdirectory w-dyn-items">
                ${o}
                <div role="listitem" class="w-dyn-item directory-clear-item" style="display: none;">
                  <button class="button w-button directory-filter-clear">Clear filters</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="directory-member-count">${u.length} members</p>
    `,e.querySelectorAll(".directory-filter-desktop .directory-filter-btn").forEach(s=>{s.addEventListener("click",()=>A(s,e))}),(m=e.querySelector(".directory-filter-clear"))==null||m.addEventListener("click",()=>{S(e)});const t=e.querySelector(".directory-filter-mobile-trigger"),c=e.querySelector(".directory-filter-mobile-dropdown");t==null||t.addEventListener("click",()=>{const s=c.classList.contains("open");c.classList.toggle("open",!s),t.setAttribute("aria-expanded",!s)}),document.addEventListener("click",s=>{var y;(y=e.querySelector(".directory-filter-mobile"))!=null&&y.contains(s.target)||(c==null||c.classList.remove("open"),t==null||t.setAttribute("aria-expanded","false"))}),e.querySelectorAll(".directory-filter-mobile-item").forEach(s=>{s.addEventListener("click",()=>M(s,e))}),(n=e.querySelector(".directory-filter-mobile-clear"))==null||n.addEventListener("click",()=>{S(e),c==null||c.classList.remove("open"),t==null||t.setAttribute("aria-expanded","false")})}function M(e,r){const i=e.dataset.subId;l.has(i)?(l.delete(i),e.classList.remove("active")):(l.add(i),e.classList.add("active")),r.querySelectorAll(`.directory-filter-desktop .directory-filter-btn[data-sub-id="${i}"]`).forEach(n=>{n.classList.toggle("active",l.has(i))}),k(r);const o=r.querySelector(".directory-clear-item"),d=r.querySelector(".directory-filter-mobile-clear");o&&(o.style.display=l.size>0?"":"none"),d&&(d.style.display=l.size>0?"":"none");const t=E(),c=document.querySelector(".x-member-grid-container")||document.querySelector(".directory-members-grid");c&&x(c,t);const m=r.querySelector(".directory-member-count");if(m){const n=l.size>0?` (filtered from ${u.length})`:"";m.textContent=`${t.length} members${n}`}}function k(e){const r=e.querySelector(".directory-filter-mobile-label");if(r)if(l.size===0)r.textContent="Filter by specialty";else if(l.size===1){const i=b.find(o=>l.has(o.id));r.textContent=(i==null?void 0:i.name)||"1 filter selected"}else r.textContent=`${l.size} filters selected`}function A(e,r){const i=e.dataset.subId;l.has(i)?(l.delete(i),e.classList.remove("active")):(l.add(i),e.classList.add("active")),r.querySelectorAll(`.directory-filter-mobile-item[data-sub-id="${i}"]`).forEach(n=>{n.classList.toggle("active",l.has(i))}),k(r);const o=r.querySelector(".directory-clear-item"),d=r.querySelector(".directory-filter-mobile-clear");o&&(o.style.display=l.size>0?"":"none"),d&&(d.style.display=l.size>0?"":"none");const t=E(),c=document.querySelector(".x-member-grid-container")||document.querySelector(".directory-members-grid");c&&x(c,t);const m=r.querySelector(".directory-member-count");if(m){const n=l.size>0?` (filtered from ${u.length})`:"";m.textContent=`${t.length} members${n}`}}function S(e){l.clear(),e.querySelectorAll(".directory-filter-btn").forEach(t=>{t.classList.remove("active")}),e.querySelectorAll(".directory-filter-mobile-item").forEach(t=>{t.classList.remove("active")});const r=e.querySelector(".directory-clear-item"),i=e.querySelector(".directory-filter-mobile-clear");r&&(r.style.display="none"),i&&(i.style.display="none"),k(e);const o=document.querySelector(".x-member-grid-container")||document.querySelector(".directory-members-grid");o&&x(o,u);const d=e.querySelector(".directory-member-count");d&&(d.textContent=`${u.length} members`)}function E(){return l.size===0?u:u.filter(e=>e.subDirectoryIds.some(r=>l.has(r)))}function x(e,r){if(r.length===0){e.innerHTML=`
        <div class="w-dyn-list">
          <div class="w-dyn-empty">
            <div class="directory-empty">
              <h3>No members found</h3>
              <p>Try clearing your filters or check back later.</p>
            </div>
          </div>
        </div>
      `;return}const i=r.map(o=>{var y,h,v;const d=o.header_image_url||o.profile_image_url||"",t=o.profile_image_url||"",c=((y=o.suburbs)==null?void 0:y.name)||"",m=((h=o.suburbs)==null?void 0:h.slug)||"",n=((v=o.membership_types)==null?void 0:v.name)||"Professional",s=o.business_name||o.name;return`
        <div role="listitem" class="w-dyn-item">
          <div class="x-member-card">
            <div class="x-member-feature-image-container">
              <div class="x-member-type hide">
                <img src="https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/681ac65056f48d463096333e_Status%3DProfessional.svg" loading="lazy" alt="" class="x-member-type-image">
                <div class="text-style-allcaps text-color-white small">${n}</div>
                <div>${n}</div>
              </div>
              <a href="/members/${o.slug}" class="x-member-feature-image w-inline-block">
                <img src="${d}" loading="lazy" alt="${s}" class="x-member-feature-image" onerror="this.style.display='none'">
              </a>
            </div>
            <div class="x-member-card-text-container">
              <div class="x-member-name">
                <div class="x-member-profile-image">
                  <img src="${t}" loading="lazy" alt="${s}" onerror="this.style.display='none'">
                </div>
                <a href="/members/${o.slug}" class="heading-style-h4 member-name">${s}</a>
              </div>
              <div class="x-member-location">
                ${m?`<a href="/suburb/${m}" class="text-style-allcaps text-weight-light small">${c}</a>`:`<span class="text-style-allcaps text-weight-light small">${c}</span>`}
              </div>
            </div>
          </div>
        </div>
      `}).join("");e.innerHTML=`
      <div class="w-dyn-list">
        <div role="list" class="x-member-grid w-dyn-items">
          ${i}
        </div>
      </div>
    `}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",_):_()})();
