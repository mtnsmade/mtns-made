(function(){const g="https://epszwomtxkpjegbjbixr.supabase.co",y="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTE5MzUsImV4cCI6MjA4NTg4NzkzNX0.TJPI5NQmWHR6F5eGVZH26Mzj601RDp5bgcpYZFVymwQ";let c,l=null,o=[];const b=`
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
  `;function h(){if(!document.getElementById("messages-styles")){const e=document.createElement("style");e.id="messages-styles",e.textContent=b,document.head.appendChild(e)}}async function m(){const e=document.querySelector(".messages-container")||document.getElementById("messages-container");if(!e){console.log("Messages container not found");return}if(h(),!window.supabase){console.error("Supabase library not loaded. Make sure to include the Supabase JS script."),e.innerHTML="<p>Error: Required library not loaded. Please refresh the page.</p>";return}c=window.supabase.createClient(g,y),console.log("Messages: Supabase client initialized");try{const s=window.$memberstackDom;if(!s){e.innerHTML="<p>Please log in to view your messages.</p>";return}const{data:t}=await s.getCurrentMember();if(!t){e.innerHTML="<p>Please log in to view your messages.</p>";return}l=t,console.log("Messages: Member loaded:",t.id),e.innerHTML='<div class="loading-spinner">Loading messages...</div>',await x(e)}catch(s){console.error("Messages init error:",s),e.innerHTML="<p>Error loading messages. Please refresh the page.</p>"}}async function x(e){try{console.log("Messages: Loading for memberstack_id:",l.id);const{data:s,error:t,status:r}=await c.from("messages").select("*").eq("memberstack_id",l.id).eq("is_archived",!1).order("created_at",{ascending:!1});if(console.log("Messages: Query response - status:",r,"error:",t,"data count:",s==null?void 0:s.length),t)throw console.error("Messages: Supabase error details:",{message:t.message,code:t.code,details:t.details,hint:t.hint}),t;o=s||[],p(e)}catch(s){console.error("Error loading messages:",s),e.innerHTML="<p>Error loading messages. Please try again.</p>"}}function p(e){const s=o.filter(r=>!r.is_read).length;if(s>0){const r=document.querySelector(".messages-page-title, h1");r&&!r.querySelector(".messages-badge")&&r.insertAdjacentHTML("beforeend",` <span class="messages-badge">${s} new</span>`)}let t=`
      <div class="messages-section">
    `;o.length===0?t+=`
        <div class="messages-empty">
          <div class="messages-empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24"><path fill="currentColor" d="M7 7h10v2H7zm0 4h7v2H7z"></path><path fill="currentColor" d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2m0 14H6.667L4 18V4h16z"></path></svg>
          </div>
          <h3>No messages yet</h3>
          <p>When someone contacts you through your MTNS MADE profile, their messages will appear here.</p>
        </div>
      `:(t+='<div class="messages-list">',o.forEach(r=>{t+=v(r)}),t+="</div>"),t+="</div>",e.innerHTML=t,w(e)}function v(e){const s=new Date(e.created_at),t=s.toLocaleDateString("en-AU",{day:"numeric",month:"short",year:s.getFullYear()!==new Date().getFullYear()?"numeric":void 0}),r=s.toLocaleTimeString("en-AU",{hour:"2-digit",minute:"2-digit"}),a=e.replies||[];return`
      <div class="message-card ${e.is_read?"":"unread"}" data-message-id="${e.id}">
        <div class="message-card-header">
          <div>
            <p class="message-sender">${i(e.sender_name)}</p>
            <p class="message-subject">${i(e.subject)}</p>
          </div>
          <div class="message-meta">
            <span class="message-date">${t} ${r}</span>
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
              ${a.map(n=>`
                <div class="reply-item ${n.from==="member"?"from-member":""}">
                  <div class="reply-header">
                    <span>${n.from==="member"?"You":e.sender_name}</span>
                    <span>${new Date(n.created_at).toLocaleString("en-AU")}</span>
                  </div>
                  <div class="reply-content">${i(n.message)}</div>
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
    `}function w(e){e.querySelectorAll(".message-card-header").forEach(s=>{s.addEventListener("click",async function(){var n;const t=this.closest(".message-card"),r=t.dataset.messageId,a=document.getElementById("message-body-"+r);a.classList.contains("expanded")?a.classList.remove("expanded"):(a.classList.add("expanded"),t.classList.contains("unread")&&(await M(r),t.classList.remove("unread"),(n=t.querySelector(".message-unread-dot"))==null||n.remove(),S()))})})}async function M(e){try{await c.from("messages").update({is_read:!0,read_at:new Date().toISOString()}).eq("id",e);const s=o.find(t=>t.id===e);s&&(s.is_read=!0)}catch(s){console.error("Error marking message as read:",s)}}function S(){const e=o.filter(t=>!t.is_read).length,s=document.querySelector(".messages-badge");e>0?s&&(s.textContent=e+" new"):s==null||s.remove()}window.toggleReplyForm=function(e){const s=document.getElementById("reply-form-"+e);s.classList.toggle("visible"),s.classList.contains("visible")&&document.getElementById("reply-text-"+e).focus()},window.sendReply=async function(e){var u;const t=document.getElementById("reply-text-"+e).value.trim();if(!t){alert("Please enter a reply message.");return}const r=o.find(d=>d.id===e);if(!r)return;const a={created_at:new Date().toISOString(),message:t,from:"member"},n=[...r.replies||[],a];try{const{error:d}=await c.from("messages").update({replies:n}).eq("id",e);if(d)throw d;await fetch(g+"/functions/v1/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:r.sender_email,subject:"Re: "+r.subject+" - Reply from MTNS MADE",html:`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #333; color: #fff; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Reply from MTNS MADE</h1>
              </div>
              <div style="padding: 30px; background: #f9f9f9;">
                <p>Hi ${r.sender_name},</p>
                <p>You've received a reply to your enquiry:</p>
                <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <p style="white-space: pre-wrap;">${t.replace(/\n/g,"<br>")}</p>
                </div>
                <p style="color: #666; font-size: 14px;">You can reply directly to this email to continue the conversation.</p>
              </div>
            </div>
          `,replyTo:(u=l.auth)==null?void 0:u.email})}),r.replies=n;const E=document.querySelector(".messages-container")||document.getElementById("messages-container");p(E);const f=document.getElementById("message-body-"+e);f&&f.classList.add("expanded")}catch(d){console.error("Error sending reply:",d),alert("Error sending reply. Please try again.")}},window.archiveMessage=async function(e){if(confirm("Archive this message? You can find it in your archived messages later."))try{await c.from("messages").update({is_archived:!0}).eq("id",e),o=o.filter(t=>t.id!==e);const s=document.querySelector(".messages-container")||document.getElementById("messages-container");p(s)}catch(s){console.error("Error archiving message:",s),alert("Error archiving message. Please try again.")}};function i(e){if(!e)return"";const s=document.createElement("div");return s.textContent=e,s.innerHTML}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m()})();
