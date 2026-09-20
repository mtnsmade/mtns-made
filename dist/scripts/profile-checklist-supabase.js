(function(){console.log("Profile checklist Supabase script loaded");const l="https://epszwomtxkpjegbjbixr.supabase.co",p="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH";let c=null;const f=`
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
  `;function u(){return new Promise((t,e)=>{let o=0;const i=50,n=setInterval(()=>{o++,window.$memberstackDom&&window.supabase?(clearInterval(n),t()):o>=i&&(clearInterval(n),e(new Error("Dependencies not loaded")))},100)})}async function g(t){try{const{data:e,error:o}=await c.from("members").select(`
          id,
          profile_image_url,
          header_image_url,
          bio,
          profile_complete,
          suburb_id
        `).eq("memberstack_id",t).single();if(o)throw o;if(!e)return null;const{count:i}=await c.from("member_sub_directories").select("*",{count:"exact",head:!0}).eq("member_id",e.id),{count:n}=await c.from("projects").select("*",{count:"exact",head:!0}).eq("memberstack_id",t).eq("is_deleted",!1);return{...e,hasCategories:i>0,projectCount:n||0}}catch(e){return console.error("Error loading member profile:",e),null}}function x(t,e){if(!e){t.innerHTML='<div class="pc-loading">Unable to load profile data.</div>';return}const o=[{name:"Profile Picture",complete:!!e.profile_image_url,link:"/profile/edit-profile",completeText:"Profile picture added",incompleteText:"No profile picture"},{name:"Feature Image",complete:!!e.header_image_url,link:"/profile/edit-profile",completeText:"Feature image added",incompleteText:"No feature image"},{name:"Bio",complete:e.bio&&e.bio.length>=50,link:"/profile/edit-profile",completeText:"Bio added",incompleteText:"No bio added"},{name:"Categories",complete:e.hasCategories,link:"/profile/edit-profile",completeText:"Categories selected",incompleteText:"No categories selected"},{name:"Location",complete:!!e.suburb_id,link:"/profile/edit-profile",completeText:"Location set",incompleteText:"No location set"},{name:"Projects",complete:e.projectCount>0,link:"/profile/edit-portfolio",completeText:`${e.projectCount} project${e.projectCount!==1?"s":""} added`,incompleteText:"No projects added"}],i=o.filter(a=>a.complete).length,n=o.length,s=i===n,m=Math.round(i/n*100);let r='<div class="pc-container">';s?r+=`
        <div class="pc-complete-banner">
          <span class="pc-complete-icon">&#10003;</span>
          <span class="pc-complete-text">Your profile is complete! You're all set.</span>
        </div>
      `:r+=`
        <div class="pc-progress">
          <div class="pc-progress-bar">
            <div class="pc-progress-fill" style="width: ${m}%"></div>
          </div>
          <div class="pc-progress-text">${i} of ${n} complete (${m}%)</div>
        </div>
      `,r+='<div class="pc-items">',o.forEach(a=>{a.complete?r+=`
          <div class="pc-item complete">
            <span class="pc-item-icon">&#10003;</span>
            <span class="pc-item-text">${a.completeText}</span>
          </div>
        `:r+=`
          <div class="pc-item incomplete">
            <span class="pc-item-icon">&#10007;</span>
            <span class="pc-item-text">${a.incompleteText} - <a href="${a.link}" class="pc-item-link">Add now</a></span>
          </div>
        `}),r+="</div></div>",t.innerHTML=r}function b(t){if(!t)return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML}async function h(t){try{const o=await(await fetch(`${l}/functions/v1/get-member-faqs`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${p}`,apikey:p},body:"{}"})).json();if(!o.success||!o.faqs||o.faqs.length===0)return;const i=document.querySelector(".pc-faq");i&&i.remove();const n=document.createElement("div");n.className="pc-faq",n.innerHTML=`
        <h3 class="pc-faq-title">Member FAQs</h3>
        ${o.faqs.map(s=>`
          <details>
            <summary>${b(s.question)}</summary>
            <div class="pc-faq-answer">${s.answer}</div>
          </details>
        `).join("")}
      `,t.insertAdjacentElement("afterend",n)}catch(e){console.error("Member FAQ load error:",e)}}async function d(){const t=document.querySelector(".profile-completeness");if(!t){console.log("No checklist container found");return}const e=document.createElement("style");e.textContent=f,document.head.appendChild(e),t.innerHTML='<div class="pc-loading">Loading profile...</div>';try{await u(),c=window.supabase.createClient(l,p);const{data:o}=await window.$memberstackDom.getCurrentMember();if(!o){t.innerHTML='<div class="pc-loading">Please log in to view your profile.</div>';return}const i=await g(o.id);x(t,i),h(t)}catch(o){console.error("Checklist init error:",o),t.innerHTML='<div class="pc-loading">Error loading profile checklist.</div>'}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d()})();
