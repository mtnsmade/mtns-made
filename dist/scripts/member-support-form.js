(function(){const p="https://epszwomtxkpjegbjbixr.supabase.co",n="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTE5MzUsImV4cCI6MjA4NTg4NzkzNX0.TJPI5NQmWHR6F5eGVZH26Mzj601RDp5bgcpYZFVymwQ";let s=null;const x=`
    .support-form-section {
      font-family: inherit;
    }
    .support-form input[type="text"],
    .support-form textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      box-sizing: border-box;
      margin-bottom: 16px;
    }
    .support-form textarea {
      min-height: 140px;
      resize: vertical;
    }
    .support-form label {
      display: block;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
      font-size: 14px;
    }
    .support-form-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      background: #333;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .support-form-btn:hover {
      background: #555;
    }
    .support-form-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .support-form-message {
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;
    }
    .support-form-message.success {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .support-form-message.error {
      background: #fdecea;
      color: #c0392b;
    }
    .support-tickets-list {
      margin-top: 32px;
    }
    .support-tickets-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
    .support-ticket-item {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .support-ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }
    .support-ticket-title {
      font-weight: 600;
      color: #333;
      margin: 0;
    }
    .support-ticket-status {
      font-size: 12px;
      font-weight: 600;
      color: #666;
      white-space: nowrap;
    }
    .support-ticket-date {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
    }
    .support-tickets-empty {
      color: #666;
      font-size: 14px;
    }
  `,h={not_started:"Not Started",in_progress:"In Progress",feedback_needed:"Feedback Needed",complete:"Complete",stalled:"Stalled"};function v(){if(!document.getElementById("support-form-styles")){const t=document.createElement("style");t.id="support-form-styles",t.textContent=x,document.head.appendChild(t)}}function a(t){if(!t)return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML}async function c(){const t=document.getElementById("support-form-root");if(!t){console.log("Support form container not found");return}v();const e=window.$memberstackDom;if(!e){t.innerHTML="<p>Please log in to submit a support ticket.</p>";return}const{data:o}=await e.getCurrentMember();if(!o){t.innerHTML="<p>Please log in to submit a support ticket.</p>";return}s=o,w(t),await u()}function w(t){t.innerHTML=`
      <div class="support-form-section">
        <div id="support-form-message"></div>
        <form class="support-form" id="support-form">
          <label for="support-title">Subject</label>
          <input type="text" id="support-title" required maxlength="200">
          <label for="support-description">Message</label>
          <textarea id="support-description" required></textarea>
          <button type="submit" class="support-form-btn" id="support-submit-btn">Submit Ticket</button>
        </form>
        <div class="support-tickets-list">
          <div class="support-tickets-title">My Support Tickets</div>
          <div id="support-tickets-container">Loading...</div>
        </div>
      </div>
    `,document.getElementById("support-form").addEventListener("submit",async e=>{e.preventDefault(),await I(t)})}async function I(t){var l,f,b,g;const e=document.getElementById("support-title"),o=document.getElementById("support-description"),r=document.getElementById("support-submit-btn"),i=document.getElementById("support-form-message"),d=e.value.trim(),m=o.value.trim();if(!(!d||!m)){r.disabled=!0,r.textContent="Submitting...",i.innerHTML="";try{const y=await(await fetch(`${p}/functions/v1/submit-support-ticket`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`,apikey:n},body:JSON.stringify({mode:"create",memberstackId:s.id,memberName:[(l=s.customFields)==null?void 0:l["first-name"],(f=s.customFields)==null?void 0:f["last-name"]].filter(Boolean).join(" ")||((b=s.auth)==null?void 0:b.email)||"",memberEmail:((g=s.auth)==null?void 0:g.email)||"",title:d,description:m})})).json();if(!y.success)throw new Error(y.error||"Failed to submit ticket");i.innerHTML=`<div class="support-form-message success">Your ticket has been submitted. We'll be in touch soon.</div>`,e.value="",o.value="",await u(t)}catch(k){console.error("Error submitting support ticket:",k),i.innerHTML='<div class="support-form-message error">Something went wrong submitting your ticket. Please try again.</div>'}finally{r.disabled=!1,r.textContent="Submit Ticket"}}}async function u(t){const e=document.getElementById("support-tickets-container");if(e)try{const r=await(await fetch(`${p}/functions/v1/submit-support-ticket`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`,apikey:n},body:JSON.stringify({mode:"list",memberstackId:s.id})})).json();if(!r.success)throw new Error(r.error||"Failed to load tickets");E(e,r.tickets||[])}catch(o){console.error("Error loading support tickets:",o),e.innerHTML='<p class="support-tickets-empty">Error loading your tickets.</p>'}}function E(t,e){if(e.length===0){t.innerHTML=`<p class="support-tickets-empty">You haven't submitted any support tickets yet.</p>`;return}t.innerHTML=e.map(o=>{const r=new Date(o.created_at).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"}),i=h[o.status]||o.status;return`
        <div class="support-ticket-item">
          <div class="support-ticket-header">
            <p class="support-ticket-title">${a(o.title)}</p>
            <span class="support-ticket-status">${a(i)}</span>
          </div>
          <div class="support-ticket-date">Submitted ${r}</div>
        </div>
      `}).join("")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",c):c()})();
