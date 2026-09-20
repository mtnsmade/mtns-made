(function(){const p="https://epszwomtxkpjegbjbixr.supabase.co",i="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTE5MzUsImV4cCI6MjA4NTg4NzkzNX0.TJPI5NQmWHR6F5eGVZH26Mzj601RDp5bgcpYZFVymwQ";let s=null;const h=`
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

    .support-faq {
      margin-top: 32px;
    }
    .support-faq-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
    .support-faq details {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .support-faq summary {
      cursor: pointer;
      list-style: none;
      padding: 14px 44px 14px 16px;
      font-weight: 600;
      font-size: 15px;
      color: #333;
      position: relative;
    }
    .support-faq summary::-webkit-details-marker {
      display: none;
    }
    .support-faq summary::after {
      content: '+';
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      font-weight: 400;
      line-height: 1;
    }
    .support-faq details[open] summary::after {
      content: '\\2212';
    }
    .support-faq-answer {
      padding: 0 16px 16px 16px;
      font-size: 14px;
      line-height: 1.6;
      color: #444;
    }
    .support-faq-answer h2 {
      font-size: 16px;
      margin: 0 0 8px 0;
    }
    .support-faq-answer h3 {
      font-size: 14px;
      margin: 16px 0 4px 0;
    }
    .support-faq-answer p {
      margin: 0 0 8px 0;
    }
    .support-faq-answer ul {
      margin: 0 0 8px 0;
      padding-left: 20px;
    }
  `,k={not_started:"Not Started",in_progress:"In Progress",feedback_needed:"Feedback Needed",complete:"Complete",stalled:"Stalled"};function w(){if(!document.getElementById("support-form-styles")){const t=document.createElement("style");t.id="support-form-styles",t.textContent=h,document.head.appendChild(t)}}function a(t){if(!t)return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML}async function c(){const t=document.getElementById("support-form-root");if(!t){console.log("Support form container not found");return}w();const e=window.$memberstackDom;if(!e){t.innerHTML="<p>Please log in to submit a support ticket.</p>";return}const{data:o}=await e.getCurrentMember();if(!o){t.innerHTML="<p>Please log in to submit a support ticket.</p>";return}s=o,v(t),await u(),z()}function v(t){t.innerHTML=`
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
        <div id="support-faq-container"></div>
      </div>
    `,document.getElementById("support-form").addEventListener("submit",async e=>{e.preventDefault(),await I(t)})}async function I(t){var l,f,b,g;const e=document.getElementById("support-title"),o=document.getElementById("support-description"),r=document.getElementById("support-submit-btn"),n=document.getElementById("support-form-message"),d=e.value.trim(),m=o.value.trim();if(!(!d||!m)){r.disabled=!0,r.textContent="Submitting...",n.innerHTML="";try{const y=await(await fetch(`${p}/functions/v1/submit-support-ticket`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`,apikey:i},body:JSON.stringify({mode:"create",memberstackId:s.id,memberName:[(l=s.customFields)==null?void 0:l["first-name"],(f=s.customFields)==null?void 0:f["last-name"]].filter(Boolean).join(" ")||((b=s.auth)==null?void 0:b.email)||"",memberEmail:((g=s.auth)==null?void 0:g.email)||"",title:d,description:m})})).json();if(!y.success)throw new Error(y.error||"Failed to submit ticket");n.innerHTML=`<div class="support-form-message success">Your ticket has been submitted. We'll be in touch soon.</div>`,e.value="",o.value="",await u(t)}catch(x){console.error("Error submitting support ticket:",x),n.innerHTML='<div class="support-form-message error">Something went wrong submitting your ticket. Please try again.</div>'}finally{r.disabled=!1,r.textContent="Submit Ticket"}}}async function u(t){const e=document.getElementById("support-tickets-container");if(e)try{const r=await(await fetch(`${p}/functions/v1/submit-support-ticket`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`,apikey:i},body:JSON.stringify({mode:"list",memberstackId:s.id})})).json();if(!r.success)throw new Error(r.error||"Failed to load tickets");E(e,r.tickets||[])}catch(o){console.error("Error loading support tickets:",o),e.innerHTML='<p class="support-tickets-empty">Error loading your tickets.</p>'}}async function z(){const t=document.getElementById("support-faq-container");if(t)try{const o=await(await fetch(`${p}/functions/v1/get-member-faqs`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`,apikey:i},body:"{}"})).json();if(!o.success||!o.faqs||o.faqs.length===0)return;t.innerHTML=`
        <div class="support-faq">
          <div class="support-faq-title">Member FAQs</div>
          ${o.faqs.map(r=>`
            <details>
              <summary>${a(r.question)}</summary>
              <div class="support-faq-answer">${r.answer}</div>
            </details>
          `).join("")}
        </div>
      `}catch(e){console.error("Error loading member FAQs:",e)}}function E(t,e){if(e.length===0){t.innerHTML=`<p class="support-tickets-empty">You haven't submitted any support tickets yet.</p>`;return}t.innerHTML=e.map(o=>{const r=new Date(o.created_at).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"}),n=k[o.status]||o.status;return`
        <div class="support-ticket-item">
          <div class="support-ticket-header">
            <p class="support-ticket-title">${a(o.title)}</p>
            <span class="support-ticket-status">${a(n)}</span>
          </div>
          <div class="support-ticket-date">Submitted ${r}</div>
        </div>
      `}).join("")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",c):c()})();
