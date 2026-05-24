(function(){const u="https://epszwomtxkpjegbjbixr.supabase.co",g="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTE5MzUsImV4cCI6MjA4NTg4NzkzNX0.TJPI5NQmWHR6F5eGVZH26Mzj601RDp5bgcpYZFVymwQ",l={job:"Job / Employment",commission:"Commission",collaboration:"Collaboration","call-for-entries":"Call for Entries",residency:"Residency / Fellowship",volunteer:"Volunteer"},m=`
    /* Opportunity card — no image, text-focused */
    .x-opp-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: #fff;
      overflow: hidden;
      transition: box-shadow 0.2s;
    }
    .x-opp-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

    .x-opp-card-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 12px;
    }

    .x-opp-type-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #555;
      background: #f0f0f0;
      border-radius: 2px;
      padding: 3px 8px;
      align-self: flex-start;
    }

    .x-opp-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 1.3;
    }

    .x-opp-org {
      font-size: 14px;
      color: #666;
      margin: 0;
    }

    .x-opp-description {
      font-size: 14px;
      color: #555;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin: 0;
    }

    .x-opp-card-footer {
      padding: 14px 24px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      background: #fafafa;
    }

    .x-opp-meta {
      font-size: 12px;
      color: #888;
    }
    .x-opp-meta strong { color: #555; font-weight: 600; }

    .x-opp-link {
      font-size: 13px;
      font-weight: 600;
      color: #1a1a1a;
      text-decoration: underline;
      white-space: nowrap;
    }
    .x-opp-link:hover { color: #555; }

    /* Filters */
    .x-opp-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 32px;
    }
    .x-opp-filter-btn {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 2px;
      padding: 8px 16px;
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

    .x-opp-count {
      font-size: 13px;
      color: #888;
      margin-bottom: 20px;
    }

    .x-opp-loading, .x-opp-empty {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .x-opp-empty h3 { margin: 0 0 8px; font-size: 18px; color: #333; }
  `;let d=null,a=[],s=null;function b(e){return e?new Date(e).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"}):null}function y(e){if(!e)return!1;const n=(new Date(e)-new Date)/(1e3*60*60*24);return n>=0&&n<=14}function v(e){const t=l[e.opportunity_type]||e.opportunity_type||"",i=b(e.closing_date),n=y(e.closing_date),o=e.opportunity_url;return`
      <div role="listitem" class="w-dyn-item">
        <div class="x-opp-card">
          <div class="x-opp-card-body">
            ${t?`<span class="x-opp-type-badge">${t}</span>`:""}
            <h2 class="x-opp-title">${e.name||"Untitled"}</h2>
            ${e.organization?`<p class="x-opp-org">${e.organization}</p>`:""}
            ${e.description?`<p class="x-opp-description">${e.description}</p>`:""}
          </div>
          <div class="x-opp-card-footer">
            <div>
              ${i?`<div class="x-opp-meta"><strong>Closes:</strong> ${i}${n?' <span style="color:#c0392b">· Closing soon</span>':""}</div>`:""}
              ${e.budget?`<div class="x-opp-meta"><strong>Budget:</strong> ${e.budget}</div>`:""}
            </div>
            ${o?`<a href="${e.opportunity_url}" target="_blank" rel="noopener" class="x-opp-link">More info →</a>`:""}
          </div>
        </div>
      </div>`}function c(e,t){if(t.length===0){e.innerHTML=`
        <div class="w-dyn-list">
          <div class="w-dyn-empty">
            <div class="x-opp-empty">
              <h3>No opportunities found</h3>
              <p>${s?"Try clearing the filter or check back soon.":"Check back soon — new listings are added regularly."}</p>
            </div>
          </div>
        </div>`;return}e.innerHTML=`
      <div class="w-dyn-list">
        <div role="list" class="x-member-grid w-dyn-items">
          ${t.map(v).join("")}
        </div>
      </div>`}function h(e,t){const i=[...new Set(t.map(o=>o.opportunity_type).filter(Boolean))];if(i.length<2){e.style.display="none";return}const n=i.map(o=>{const r=l[o]||o;return`<button class="x-opp-filter-btn" data-type="${o}">${r}</button>`}).join("");e.innerHTML=`
      <div class="x-opp-filters">
        ${n}
        <button class="x-opp-filter-btn active" data-type="">All</button>
      </div>`,e.querySelectorAll(".x-opp-filter-btn").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll(".x-opp-filter-btn").forEach(p=>p.classList.remove("active")),o.classList.add("active"),s=o.dataset.type||null;const r=s?a.filter(p=>p.opportunity_type===s):a,x=document.querySelector(".x-member-grid-container");x&&c(x,r)})})}async function f(){const e=document.querySelector(".x-member-grid-container");if(!e)return;if(!window.supabase){e.innerHTML='<div class="x-opp-loading">Error: Supabase not loaded. Please refresh.</div>';return}d=window.supabase.createClient(u,g);const t=document.createElement("style");t.textContent=m,document.head.appendChild(t),e.innerHTML='<div class="x-opp-loading">Loading opportunities...</div>';const{data:i,error:n}=await d.from("opportunities").select("id, name, slug, opportunity_type, organization, description, budget, closing_date, opportunity_url, is_remote, created_at").eq("is_draft",!1).eq("is_archived",!1).order("created_at",{ascending:!1});if(n){console.error("Opportunities display error:",n),e.innerHTML='<div class="x-opp-empty"><h3>Error loading opportunities</h3><p>Please refresh the page.</p></div>';return}a=i||[];const o=document.querySelector(".directory-filters")||(()=>{const r=document.createElement("div");return e.parentNode.insertBefore(r,e),r})();h(o,a),c(e,a)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f()})();
