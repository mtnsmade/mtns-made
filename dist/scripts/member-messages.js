(function(){const g="https://epszwomtxkpjegbjbixr.supabase.co",l="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTE5MzUsImV4cCI6MjA4NTg4NzkzNX0.TJPI5NQmWHR6F5eGVZH26Mzj601RDp5bgcpYZFVymwQ";let u=null,o=[];const f=`
    .messages-section {
      font-family: inherit;
    }
    .messages-badge {
      background: #dc3545;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
      margin-left: 8px;
    }
    .messages-empty {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .messages-empty-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
      color: #666;
    }
    .messages-empty-icon svg {
      width: 100%;
      height: 100%;
    }
    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .message-card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      transition: box-shadow 0.2s;
    }
    .message-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .message-card.unread {
      border-left: 4px solid #333;
    }
    .message-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px;
      cursor: pointer;
    }
    .message-sender {
      font-weight: 600;
      color: #333;
      margin: 0 0 4px 0;
    }
    .message-subject {
      color: #666;
      margin: 0;
      font-size: 14px;
    }
    .message-meta {
      text-align: right;
      flex-shrink: 0;
      margin-left: 16px;
    }
    .message-date {
      font-size: 12px;
      color: #999;
    }
    .message-unread-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #333;
      border-radius: 50%;
      margin-left: 8px;
    }
    .message-body {
      display: none;
      padding: 0 16px 16px;
      border-top: 1px solid #eee;
    }
    .message-body.expanded {
      display: block;
    }
    .message-content {
      background: #f9f9f9;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
      white-space: pre-wrap;
    }
    .message-contact-info {
      margin-top: 16px;
      padding: 12px;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 8px;
      font-size: 14px;
    }
    .message-contact-info p {
      margin: 4px 0;
    }
    .message-contact-info a {
      color: #0066cc;
    }
    .message-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
    .message-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }
    .message-btn-primary {
      background: #333;
      color: #fff;
    }
    .message-btn-primary:hover {
      background: #555;
    }
    .message-btn-secondary {
      background: #f0f0f0;
      color: #333;
    }
    .message-btn-secondary:hover {
      background: #e0e0e0;
    }
    .reply-form {
      margin-top: 16px;
      display: none;
    }
    .reply-form.visible {
      display: block;
    }
    .reply-textarea {
      width: 100%;
      min-height: 120px;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
      box-sizing: border-box;
    }
    .reply-actions {
      display: flex;
      gap: 12px;
      margin-top: 12px;
    }
    .replies-section {
      margin-top: 16px;
      border-top: 1px solid #eee;
      padding-top: 16px;
    }
    .replies-title {
      font-size: 14px;
      font-weight: 600;
      color: #666;
      margin-bottom: 12px;
    }
    .reply-item {
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .reply-item.from-member {
      background: #e8f4f8;
      margin-left: 20px;
    }
    .reply-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12px;
      color: #666;
    }
    .reply-content {
      white-space: pre-wrap;
      font-size: 14px;
    }
    .loading-spinner {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `;function y(){if(!document.getElementById("messages-styles")){const e=document.createElement("style");e.id="messages-styles",e.textContent=f,document.head.appendChild(e)}}async function d(e,s={}){const t=window.$memberstackDom,n=(typeof t.getMemberCookie=="function"?await t.getMemberCookie():"")||"",a=await fetch(g+"/functions/v1/member-messages",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+l,apikey:l,"X-Member-Token":n},body:JSON.stringify({action:e,...s})}),r=await a.json().catch(()=>({}));if(a.status===401)throw new Error("Your login has expired. Please log out and log in again.");if(!a.ok)throw new Error(r.error||"Request failed");return r}async function p(){const e=document.querySelector(".messages-container")||document.getElementById("messages-container");if(!e){console.log("Messages container not found");return}y();try{const s=window.$memberstackDom;if(!s){e.innerHTML="<p>Please log in to view your messages.</p>";return}const{data:t}=await s.getCurrentMember();if(!t){e.innerHTML="<p>Please log in to view your messages.</p>";return}u=t,console.log("Messages: Member loaded:",t.id),e.innerHTML='<div class="loading-spinner">Loading messages...</div>',await b(e)}catch(s){console.error("Messages init error:",s),e.innerHTML="<p>Error loading messages. Please refresh the page.</p>"}}async function b(e){try{const{messages:s}=await d("list");o=s||[],c(e)}catch(s){console.error("Error loading messages:",s),e.innerHTML="<p>Error loading messages. Please try again.</p>"}}function c(e){const s=o.filter(n=>!n.is_read).length;if(s>0){const n=document.querySelector(".messages-page-title, h1");n&&!n.querySelector(".messages-badge")&&n.insertAdjacentHTML("beforeend",` <span class="messages-badge">${s} new</span>`)}let t=`
      <div class="messages-section">
    `;o.length===0?t+=`
        <div class="messages-empty">
          <div class="messages-empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24"><path fill="currentColor" d="M7 7h10v2H7zm0 4h7v2H7z"></path><path fill="currentColor" d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2m0 14H6.667L4 18V4h16z"></path></svg>
          </div>
          <h3>No messages yet</h3>
          <p>When someone contacts you through your MTNS MADE profile, their messages will appear here.</p>
        </div>
      `:(t+='<div class="messages-list">',o.forEach(n=>{t+=x(n)}),t+="</div>"),t+="</div>",e.innerHTML=t,h(e)}function x(e){const s=new Date(e.created_at),t=s.toLocaleDateString("en-AU",{day:"numeric",month:"short",year:s.getFullYear()!==new Date().getFullYear()?"numeric":void 0}),n=s.toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"}),a=e.replies||[];return`
      <div class="message-card ${e.is_read?"":"unread"}" data-message-id="${e.id}">
        <div class="message-card-header">
          <div>
            <p class="message-sender">${i(e.sender_name)}</p>
            <p class="message-subject">${i(e.subject)}</p>
          </div>
          <div class="message-meta">
            <span class="message-date">${t} ${n}</span>
            ${e.is_read?"":'<span class="message-unread-dot"></span>'}
          </div>
        </div>
        <div class="message-body" id="message-body-${e.id}">
          <div class="message-content">${i(e.message)}</div>

          <div class="message-contact-info">
            <p><strong>From:</strong> ${i(e.sender_name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${i(e.sender_email)}">${i(e.sender_email)}</a></p>
            ${e.sender_phone?`<p><strong>Phone:</strong> <a href="tel:${i(e.sender_phone)}">${i(e.sender_phone)}</a></p>`:""}
          </div>

          ${a.length>0?`
            <div class="replies-section">
              <p class="replies-title">Conversation (${a.length} ${a.length===1?"reply":"replies"})</p>
              ${a.map(r=>`
                <div class="reply-item ${r.from==="member"?"from-member":""}">
                  <div class="reply-header">
                    <span>${r.from==="member"?"You":e.sender_name}</span>
                    <span>${new Date(r.created_at).toLocaleString("en-AU")}</span>
                  </div>
                  <div class="reply-content">${i(r.message)}</div>
                </div>
              `).join("")}
            </div>
          `:""}

          <div class="message-actions">
            <button class="message-btn message-btn-primary" onclick="toggleReplyForm('${e.id}')">
              Reply
            </button>
            <button class="message-btn message-btn-secondary" onclick="archiveMessage('${e.id}')">
              Archive
            </button>
          </div>

          <div class="reply-form" id="reply-form-${e.id}">
            <textarea class="reply-textarea" id="reply-text-${e.id}" placeholder="Write your reply..."></textarea>
            <div class="reply-actions">
              <button class="message-btn message-btn-primary" onclick="sendReply('${e.id}')">
                Send Reply
              </button>
              <button class="message-btn message-btn-secondary" onclick="toggleReplyForm('${e.id}')">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `}function h(e){e.querySelectorAll(".message-card-header").forEach(s=>{s.addEventListener("click",async function(){var r;const t=this.closest(".message-card"),n=t.dataset.messageId,a=document.getElementById("message-body-"+n);a.classList.contains("expanded")?a.classList.remove("expanded"):(a.classList.add("expanded"),t.classList.contains("unread")&&(await v(n),t.classList.remove("unread"),(r=t.querySelector(".message-unread-dot"))==null||r.remove(),w()))})})}async function v(e){try{await d("mark-read",{messageId:e});const s=o.find(t=>t.id===e);s&&(s.is_read=!0)}catch(s){console.error("Error marking message as read:",s)}}function w(){const e=o.filter(t=>!t.is_read).length,s=document.querySelector(".messages-badge");e>0?s&&(s.textContent=e+" new"):s==null||s.remove()}window.toggleReplyForm=function(e){const s=document.getElementById("reply-form-"+e);s.classList.toggle("visible"),s.classList.contains("visible")&&document.getElementById("reply-text-"+e).focus()},window.sendReply=async function(e){const t=document.getElementById("reply-text-"+e).value.trim();if(!t){alert("Please enter a reply message.");return}const n=o.find(r=>r.id===e);if(!n)return;const a={created_at:new Date().toISOString(),message:t,from:"member"};try{const{replies:r}=await d("reply",{messageId:e,text:t});n.replies=r||[...n.replies||[],a];const k=document.querySelector(".messages-container")||document.getElementById("messages-container");c(k);const m=document.getElementById("message-body-"+e);m&&m.classList.add("expanded")}catch(r){console.error("Error sending reply:",r),alert("Error sending reply. Please try again.")}},window.archiveMessage=async function(e){if(confirm("Archive this message? You can find it in your archived messages later."))try{await d("archive",{messageId:e}),o=o.filter(t=>t.id!==e);const s=document.querySelector(".messages-container")||document.getElementById("messages-container");c(s)}catch(s){console.error("Error archiving message:",s),alert("Error archiving message. Please try again.")}};function i(e){if(!e)return"";const s=document.createElement("div");return s.textContent=e,s.innerHTML}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",p):p()})();
