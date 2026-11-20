(function(){console.log("Profile checklist Supabase script loaded");const p="https://epszwomtxkpjegbjbixr.supabase.co",s="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH";async function f(o,e={}){try{const t=window.$memberstackDom,i=(t&&typeof t.getMemberCookie=="function"?await t.getMemberCookie():"")||"",n=await fetch(`${p}/functions/v1/member-self`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`,apikey:s,"X-Member-Token":i},body:JSON.stringify({action:o,...e})}),r=await n.json().catch(()=>({}));return n.ok?{data:"member"in r?r.member:r,error:null}:{data:null,error:{message:r.error||`member-self ${o} failed`,status:n.status}}}catch(t){return{data:null,error:t}}}let l=null;const u=`
    .pc-container {
      font-family: inherit;
    }
    .pc-loading {
      padding: 20px;
      text-align: center;
      color: #666;
    }
    .pc-complete-banner {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .pc-complete-icon {
      font-size: 24px;
    }
    .pc-complete-text {
      font-size: 16px;
      font-weight: 500;
    }
    .pc-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .pc-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
    }
    .pc-item.complete {
      background: #d4edda;
      color: #155724;
    }
    .pc-item.incomplete {
      background: #f8d7da;
      color: #721c24;
    }
    .pc-item-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }
    .pc-item.complete .pc-item-icon {
      background: #28a745;
      color: #fff;
    }
    .pc-item.incomplete .pc-item-icon {
      background: #dc3545;
      color: #fff;
    }
    .pc-item-text {
      flex: 1;
    }
    .pc-item-link {
      color: inherit;
      text-decoration: underline;
      font-weight: 600;
    }
    .pc-item-link:hover {
      opacity: 0.8;
    }
    .pc-progress {
      margin-bottom: 20px;
    }
    .pc-progress-bar {
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }
    .pc-progress-fill {
      height: 100%;
      background: #28a745;
      transition: width 0.3s ease;
    }
    .pc-progress-text {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }

    .pc-faq {
      margin-top: 32px;
      font-family: inherit;
    }
    .pc-faq-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 12px 0;
    }
    .pc-faq details {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 8px;
      background: #fff;
    }
    .pc-faq summary {
      cursor: pointer;
      list-style: none;
      padding: 14px 44px 14px 16px;
      font-weight: 600;
      font-size: 15px;
      position: relative;
    }
    .pc-faq summary::-webkit-details-marker {
      display: none;
    }
    .pc-faq summary::after {
      content: '+';
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      font-weight: 400;
      line-height: 1;
    }
    .pc-faq details[open] summary::after {
      content: '\\2212';
    }
    .pc-faq-answer {
      padding: 0 16px 16px 16px;
      font-size: 14px;
      line-height: 1.6;
    }
    .pc-faq-answer h2 {
      font-size: 16px;
      margin: 0 0 8px 0;
    }
    .pc-faq-answer h3 {
      font-size: 14px;
      margin: 16px 0 4px 0;
    }
    .pc-faq-answer p {
      margin: 0 0 8px 0;
    }
    .pc-faq-answer ul {
      margin: 0 0 8px 0;
      padding-left: 20px;
    }
  `;function g(){return new Promise((o,e)=>{let t=0;const i=50,n=setInterval(()=>{t++,window.$memberstackDom&&window.supabase?(clearInterval(n),o()):t>=i&&(clearInterval(n),e(new Error("Dependencies not loaded")))},100)})}async function x(o){try{let{data:e,error:t}=await f("get");if(!t&&!e&&(t={message:"Member record not found"}),t)throw t;if(!e)return null;const{count:i}=await l.from("member_sub_directories").select("*",{count:"exact",head:!0}).eq("member_id",e.id),{count:n}=await l.from("projects").select("*",{count:"exact",head:!0}).eq("memberstack_id",o).eq("is_deleted",!1);return{...e,hasCategories:i>0,projectCount:n||0}}catch(e){return console.error("Error loading member profile:",e),null}}function b(o,e){if(!e){o.innerHTML='<div class="pc-loading">Unable to load profile data.</div>';return}const t=[{name:"Profile Picture",complete:!!e.profile_image_url,link:"/profile/edit-profile",completeText:"Profile picture added",incompleteText:"No profile picture"},{name:"Feature Image",complete:!!e.header_image_url,link:"/profile/edit-profile",completeText:"Feature image added",incompleteText:"No feature image"},{name:"Bio",complete:e.bio&&e.bio.length>=50,link:"/profile/edit-profile",completeText:"Bio added",incompleteText:"No bio added"},{name:"Categories",complete:e.hasCategories,link:"/profile/edit-profile",completeText:"Categories selected",incompleteText:"No categories selected"},{name:"Location",complete:!!e.suburb_id,link:"/profile/edit-profile",completeText:"Location set",incompleteText:"No location set"},{name:"Projects",complete:e.projectCount>0,link:"/profile/edit-portfolio",completeText:`${e.projectCount} project${e.projectCount!==1?"s":""} added`,incompleteText:"No projects added"}],i=t.filter(c=>c.complete).length,n=t.length,r=i===n,m=Math.round(i/n*100);let a='<div class="pc-container">';r?a+=`
        <div class="pc-complete-banner">
          <span class="pc-complete-icon">&#10003;</span>
          <span class="pc-complete-text">Your profile is complete! You're all set.</span>
        </div>
      `:a+=`
        <div class="pc-progress">
          <div class="pc-progress-bar">
            <div class="pc-progress-fill" style="width: ${m}%"></div>
          </div>
          <div class="pc-progress-text">${i} of ${n} complete (${m}%)</div>
        </div>
      `,a+='<div class="pc-items">',t.forEach(c=>{c.complete?a+=`
          <div class="pc-item complete">
            <span class="pc-item-icon">&#10003;</span>
            <span class="pc-item-text">${c.completeText}</span>
          </div>
        `:a+=`
          <div class="pc-item incomplete">
            <span class="pc-item-icon">&#10007;</span>
            <span class="pc-item-text">${c.incompleteText} - <a href="${c.link}" class="pc-item-link">Add now</a></span>
          </div>
        `}),a+="</div></div>",o.innerHTML=a}function h(o){if(!o)return"";const e=document.createElement("div");return e.textContent=o,e.innerHTML}async function w(o){try{const t=await(await fetch(`${p}/functions/v1/get-member-faqs`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`,apikey:s},body:"{}"})).json();if(!t.success||!t.faqs||t.faqs.length===0)return;const i=document.querySelector(".pc-faq");i&&i.remove();const n=document.createElement("div");n.className="pc-faq",n.innerHTML=`
        <h3 class="pc-faq-title">Member FAQs</h3>
        ${t.faqs.map(r=>`
          <details>
            <summary>${h(r.question)}</summary>
            <div class="pc-faq-answer">${r.answer}</div>
          </details>
        `).join("")}
      `,o.insertAdjacentElement("afterend",n)}catch(e){console.error("Member FAQ load error:",e)}}async function d(){const o=document.querySelector(".profile-completeness");if(!o){console.log("No checklist container found");return}const e=document.createElement("style");e.textContent=u,document.head.appendChild(e),o.innerHTML='<div class="pc-loading">Loading profile...</div>';try{await g(),l=window.supabase.createClient(p,s);const{data:t}=await window.$memberstackDom.getCurrentMember();if(!t){o.innerHTML='<div class="pc-loading">Please log in to view your profile.</div>';return}const i=await x(t.id);b(o,i),w(o)}catch(t){console.error("Checklist init error:",t),o.innerHTML='<div class="pc-loading">Error loading profile checklist.</div>'}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d()})();
