(function(){console.log("Profile checklist Supabase script loaded");const p="https://epszwomtxkpjegbjbixr.supabase.co",d="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH";let l=null;const m=`
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
  `;function u(){return new Promise((o,e)=>{let t=0;const i=50,c=setInterval(()=>{t++,window.$memberstackDom&&window.supabase?(clearInterval(c),o()):t>=i&&(clearInterval(c),e(new Error("Dependencies not loaded")))},100)})}async function f(o){try{const{data:e,error:t}=await l.from("members").select(`
          id,
          profile_image_url,
          header_image_url,
          bio,
          profile_complete,
          suburb_id
        `).eq("memberstack_id",o).single();if(t)throw t;if(!e)return null;const{count:i}=await l.from("member_sub_directories").select("*",{count:"exact",head:!0}).eq("member_id",e.id),{count:c}=await l.from("projects").select("*",{count:"exact",head:!0}).eq("memberstack_id",o).eq("is_deleted",!1);return{...e,hasCategories:i>0,projectCount:c||0}}catch(e){return console.error("Error loading member profile:",e),null}}function g(o,e){if(!e){o.innerHTML='<div class="pc-loading">Unable to load profile data.</div>';return}const t=[{name:"Profile Picture",complete:!!e.profile_image_url,link:"/profile/edit-profile",completeText:"Profile picture added",incompleteText:"No profile picture"},{name:"Feature Image",complete:!!e.header_image_url,link:"/profile/edit-profile",completeText:"Feature image added",incompleteText:"No feature image"},{name:"Bio",complete:e.bio&&e.bio.length>=50,link:"/profile/edit-profile",completeText:"Bio added",incompleteText:"No bio added"},{name:"Categories",complete:e.hasCategories,link:"/profile/edit-profile",completeText:"Categories selected",incompleteText:"No categories selected"},{name:"Location",complete:!!e.suburb_id,link:"/profile/edit-profile",completeText:"Location set",incompleteText:"No location set"},{name:"Projects",complete:e.projectCount>0,link:"/profile/edit-portfolio",completeText:`${e.projectCount} project${e.projectCount!==1?"s":""} added`,incompleteText:"No projects added"}],i=t.filter(r=>r.complete).length,c=t.length,x=i===c,s=Math.round(i/c*100);let n='<div class="pc-container">';x?n+=`
        <div class="pc-complete-banner">
          <span class="pc-complete-icon">&#10003;</span>
          <span class="pc-complete-text">Your profile is complete! You're all set.</span>
        </div>
      `:n+=`
        <div class="pc-progress">
          <div class="pc-progress-bar">
            <div class="pc-progress-fill" style="width: ${s}%"></div>
          </div>
          <div class="pc-progress-text">${i} of ${c} complete (${s}%)</div>
        </div>
      `,n+='<div class="pc-items">',t.forEach(r=>{r.complete?n+=`
          <div class="pc-item complete">
            <span class="pc-item-icon">&#10003;</span>
            <span class="pc-item-text">${r.completeText}</span>
          </div>
        `:n+=`
          <div class="pc-item incomplete">
            <span class="pc-item-icon">&#10007;</span>
            <span class="pc-item-text">${r.incompleteText} - <a href="${r.link}" class="pc-item-link">Add now</a></span>
          </div>
        `}),n+="</div></div>",o.innerHTML=n}async function a(){const o=document.querySelector(".profile-completeness");if(!o){console.log("No checklist container found");return}const e=document.createElement("style");e.textContent=m,document.head.appendChild(e),o.innerHTML='<div class="pc-loading">Loading profile...</div>';try{await u(),l=window.supabase.createClient(p,d);const{data:t}=await window.$memberstackDom.getCurrentMember();if(!t){o.innerHTML='<div class="pc-loading">Please log in to view your profile.</div>';return}const i=await f(t.id);g(o,i)}catch(t){console.error("Checklist init error:",t),o.innerHTML='<div class="pc-loading">Error loading profile checklist.</div>'}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a):a()})();
