(function(){console.log("Member edit profile Supabase script loaded");const $="https://epszwomtxkpjegbjbixr.supabase.co",_="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",x="member-images",D=["small-business","large-business","not-for-profit","spaces-suppliers"],O="spaces-suppliers",C=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];let u=null,y=null,E=null,h={directories:[],subDirectories:[],spaceCategories:[],supplierCategories:[]},w=[],e={firstName:"",lastName:"",email:"",profileImageUrl:"",profileImageFile:null,featureImageUrl:"",featureImageFile:null,bio:"",businessName:"",suburb:null,businessAddress:"",displayAddress:!1,openingHours:{monday:"",tuesday:"",wednesday:"",thursday:"",friday:"",saturday:"",sunday:""},displayOpeningHours:!1,spaceOrSupplier:null,chosenDirectories:[],spaceCategories:[],supplierCategories:[],website:"",instagram:"",facebook:"",linkedin:"",tiktok:"",youtube:""};const F=`
    .ep-container {
      font-family: inherit;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
    }
    .ep-form {
      background: #fff;
      border-radius: 8px;
      padding: 32px;
      border: 1px solid #e0e0e0;
    }
    @media (max-width: 600px) {
      .ep-form {
        padding: 24px 16px;
      }
    }
    .ep-section {
      margin-bottom: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid #e0e0e0;
    }
    .ep-section:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .ep-section-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }
    .ep-section-description {
      font-size: 14px;
      color: #666;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }
    .ep-form-field {
      margin-bottom: 20px;
    }
    .ep-form-field label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      text-align: left;
    }
    .ep-form-field label span.required {
      color: #dc3545;
    }
    .ep-form-field .ep-hint {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    .ep-compression-status {
      font-size: 12px;
      margin-top: 4px;
      min-height: 18px;
    }
    .ep-compression-status.compressing {
      color: #0066cc;
    }
    .ep-compression-status.success {
      color: #28a745;
    }
    .ep-form-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .ep-form-input:focus {
      outline: none;
      border-color: #333;
    }
    .ep-form-input.error {
      border-color: #dc3545;
    }
    .ep-form-input[readonly] {
      background: #f5f5f5;
      color: #666;
      cursor: not-allowed;
    }
    textarea.ep-form-input {
      min-height: 120px;
      resize: vertical;
    }
    .ep-image-upload {
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      position: relative;
    }
    .ep-image-upload:hover {
      border-color: #999;
      background: #fafafa;
    }
    .ep-image-upload.has-image {
      padding: 0;
      border-style: solid;
    }
    .ep-image-upload input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
    .ep-image-upload-text {
      color: #666;
      font-size: 14px;
    }
    .ep-image-upload-text strong {
      color: #333;
    }
    .ep-image-preview {
      width: 100%;
      max-height: 200px;
      object-fit: cover;
      border-radius: 6px;
    }
    .ep-image-preview.profile {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: 0 auto;
      display: block;
    }
    .ep-image-remove {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0,0,0,0.7);
      color: #fff;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    }
    .ep-image-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 600px) {
      .ep-image-row {
        grid-template-columns: 1fr;
      }
    }
    .ep-category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 8px;
    }
    .ep-category-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 13px;
    }
    .ep-category-item:hover {
      background: #f5f5f5;
    }
    .ep-category-item.selected {
      background: #333;
      color: #fff;
      border-color: #333;
    }
    .ep-category-item input {
      display: none;
    }
    .ep-radio-group {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }
    .ep-radio-item {
      flex: 1;
      padding: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    .ep-radio-item:hover {
      border-color: #999;
    }
    .ep-radio-item.selected {
      border-color: #333;
      background: #f5f5f5;
    }
    .ep-radio-item input {
      display: none;
    }
    .ep-radio-item-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }
    .ep-radio-item-desc {
      font-size: 12px;
      color: #666;
    }
    .ep-hours-grid {
      display: grid;
      gap: 12px;
    }
    .ep-hours-row {
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 12px;
      align-items: center;
    }
    .ep-hours-day {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    .ep-hours-input {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
    }
    .ep-toggle-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .ep-toggle-label {
      font-size: 14px;
      color: #333;
    }
    .ep-toggle {
      position: relative;
      width: 48px;
      height: 26px;
    }
    .ep-toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .ep-toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.3s;
      border-radius: 26px;
    }
    .ep-toggle-slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
    .ep-toggle input:checked + .ep-toggle-slider {
      background-color: #333;
    }
    .ep-toggle input:checked + .ep-toggle-slider:before {
      transform: translateX(22px);
    }
    .ep-links-grid {
      display: grid;
      gap: 16px;
    }
    .ep-link-field {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 12px;
      align-items: center;
    }
    .ep-link-label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    .ep-btn-row {
      display: flex;
      gap: 12px;
      margin-top: 32px;
    }
    .ep-btn {
      background: #333;
      color: #fff;
      border: none;
      padding: 14px 28px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: background 0.2s;
      flex: 1;
    }
    .ep-btn:hover {
      background: #555;
    }
    .ep-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .ep-btn-secondary {
      background: #fff;
      color: #333;
      border: 1px solid #333;
    }
    .ep-btn-secondary:hover {
      background: #f5f5f5;
    }
    .ep-loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .ep-error-banner {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .ep-success-banner {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
      text-align: center;
    }
    .ep-char-count {
      font-size: 12px;
      color: #666;
      text-align: right;
      margin-top: 4px;
    }
    .ep-selected-count {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }
    .ep-parent-categories {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
    .ep-parent-btn {
      padding: 8px 16px;
      border: 1px solid #333;
      border-radius: 20px;
      background: #fff;
      color: #333;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }
    .ep-parent-btn:hover {
      background: #f5f5f5;
    }
    .ep-parent-btn.active {
      background: #333;
      color: #fff;
    }
    .ep-child-categories {
      display: none;
      flex-wrap: wrap;
      gap: 8px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      margin-top: 12px;
    }
    .ep-child-categories.visible {
      display: flex;
    }
    .ep-child-btn {
      padding: 6px 14px;
      border: 1px solid #ddd;
      border-radius: 16px;
      background: #fff;
      color: #333;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
    }
    .ep-child-btn:hover {
      border-color: #999;
    }
    .ep-child-btn.selected {
      border-color: #007bff;
      color: #007bff;
    }
    .ep-selected-categories {
      margin-top: 16px;
      padding: 12px;
      background: #f0f0f0;
      border-radius: 8px;
    }
    .ep-selected-categories h5 {
      margin: 0 0 8px 0;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
    }
    .ep-selected-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .ep-selected-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #333;
      color: #fff;
      border-radius: 12px;
      font-size: 12px;
    }
    .ep-selected-tag button {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 0;
      font-size: 14px;
      line-height: 1;
    }
    .ep-field-error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }
    .ep-suburb-search {
      position: relative;
    }
    .ep-suburb-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      max-height: 200px;
      overflow-y: auto;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      z-index: 100;
      display: none;
    }
    .ep-suburb-dropdown.visible {
      display: block;
    }
    .ep-suburb-option {
      padding: 10px 14px;
      cursor: pointer;
      font-size: 14px;
    }
    .ep-suburb-option:hover {
      background: #f5f5f5;
    }
  `;function H(){return new Promise((i,r)=>{let t=0;const s=50,n=setInterval(()=>{t++,window.$memberstackDom&&window.supabase?(clearInterval(n),i()):t>=s&&(clearInterval(n),r(new Error("Dependencies not loaded")))},100)})}function T(i){return D.includes(i)}function M(i){return i===O}const I={instagram:{baseUrl:"https://www.instagram.com/",patterns:[/instagram\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},facebook:{baseUrl:"https://www.facebook.com/",patterns:[/facebook\.com\/([^\/\?]+)/i,/^([a-zA-Z0-9.]+)$/]},linkedin:{baseUrl:"https://www.linkedin.com/in/",patterns:[/linkedin\.com\/(in|company)\/([^\/\?]+)/i,/^([a-zA-Z0-9-]+)$/]},tiktok:{baseUrl:"https://www.tiktok.com/@",patterns:[/tiktok\.com\/@?([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},youtube:{baseUrl:"https://www.youtube.com/",patterns:[/youtube\.com\/(channel|c|user|@)\/([^\/\?]+)/i,/youtube\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9_-]+)$/]}};function q(i,r=null){if(!i||!i.trim())return{valid:!0,url:""};if(i=i.trim(),i.includes(" "))return{valid:!1,error:"Please enter only one URL (no spaces)"};if((i.match(/https?:\/\//gi)||[]).length>1)return{valid:!1,error:"Please enter only one URL"};if(/^https?:\/\//i.test(i))try{return new URL(i),{valid:!0,url:i}}catch{return{valid:!1,error:"Invalid URL format"}}if(r==="website")return/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/.test(i)?{valid:!0,url:"https://"+i}:{valid:!1,error:"Please enter a full website URL"};if(r&&I[r]){const s=I[r];if(i.toLowerCase().includes(r.toLowerCase()+".com"))return{valid:!0,url:"https://"+i.replace(/^(https?:\/\/)?/i,"")};for(const n of s.patterns){const a=i.match(n);if(a){const o=a[a.length-1];return o.toLowerCase()===r.toLowerCase()?{valid:!1,error:`Please enter your ${r} profile URL or username`}:{valid:!0,url:s.baseUrl+o.replace(/^@/,"")}}}return{valid:!1,error:`Please enter a valid ${r} URL or username`}}return{valid:!1,error:"Invalid URL"}}function B(){const i=[];return["website","instagram","facebook","linkedin","tiktok","youtube"].forEach(t=>{const s=e[t];if(s&&s.trim()){const n=q(s,t);n.valid?e[t]=n.url:i.push({platform:t,error:n.error})}}),i}function f(i){if(!i)return"";const r=document.createElement("div");return r.textContent=i,r.innerHTML}async function R(){try{const{data:i}=await u.from("directories").select("id, name, slug").order("display_order"),{data:r}=await u.from("sub_directories").select("id, name, slug, directory_id").order("name"),{data:t}=await u.from("creative_space_categories").select("id, name, slug").order("name"),{data:s}=await u.from("supplier_categories").select("id, name, slug").order("name");return h={directories:i||[],subDirectories:r||[],spaceCategories:t||[],supplierCategories:s||[]},h}catch(i){throw console.error("Error loading categories:",i),i}}async function j(){try{const{data:i,error:r}=await u.from("suburbs").select("id, name").order("name");if(r)throw r;return w=i||[],w}catch(i){return console.error("Error loading suburbs:",i),[]}}async function Z(i){try{const{data:r,error:t}=await u.from("members").select("*").eq("memberstack_id",i).single();if(console.log("Loaded member data:",r,t),t)throw console.error("Error loading member:",t),t;if(t)throw t;if(!r)return null;E=r;const{data:s}=await u.from("member_sub_directories").select("sub_directory_id").eq("member_id",r.id),{data:n}=await u.from("member_space_categories").select("space_category_id").eq("member_id",r.id),{data:a}=await u.from("member_supplier_categories").select("supplier_category_id").eq("member_id",r.id);if(e.firstName=r.first_name||"",e.lastName=r.last_name||"",e.email=r.email||"",e.profileImageUrl=r.profile_image_url||"",e.featureImageUrl=r.header_image_url||"",e.bio=r.bio||"",e.businessName=r.business_name||"",e.businessAddress=r.business_address||"",e.displayAddress=r.show_address||!1,e.displayOpeningHours=r.show_opening_hours||!1,r.suburb_id){const o=w.find(l=>l.id===r.suburb_id);o&&(e.suburb={id:o.id,name:o.name})}return C.forEach(o=>{e.openingHours[o.toLowerCase()]=r[`opening_${o.toLowerCase()}`]||""}),r.is_creative_space?e.spaceOrSupplier="space":r.is_supplier&&(e.spaceOrSupplier="supplier"),e.chosenDirectories=(s||[]).map(o=>o.sub_directory_id),e.spaceCategories=(n||[]).map(o=>o.space_category_id),e.supplierCategories=(a||[]).map(o=>o.supplier_category_id),e.website=r.website||"",e.instagram=r.instagram||"",e.facebook=r.facebook||"",e.linkedin=r.linkedin||"",e.tiktok=r.tiktok||"",e.youtube=r.youtube||"",r}catch(r){return console.error("Error loading member data:",r),null}}const U=3*1024*1024,k=2e3;function L(i,r,t){const s=document.getElementById(`${i}-compression-status`);s&&(s.textContent=r,s.className="ep-compression-status"+(t?` ${t}`:""))}async function Y(i,r){const t=(i.size/1024/1024).toFixed(1);return i.size<=U?(console.log(`Image ${i.name} is ${t}MB - no compression needed`),{file:i,compressed:!1,originalSize:t,finalSize:t}):(console.log(`Compressing image ${i.name} from ${t}MB...`),L(r,`Compressing image (${t}MB)...`,"compressing"),new Promise((s,n)=>{const a=new Image,o=document.createElement("canvas"),l=o.getContext("2d");a.onload=()=>{let{width:d,height:p}=a;if(d>k||p>k){const m=Math.min(k/d,k/p);d=Math.round(d*m),p=Math.round(p*m)}o.width=d,o.height=p,l.drawImage(a,0,0,d,p);const c=m=>{o.toBlob(v=>{if(!v){n(new Error("Failed to compress image"));return}const b=(v.size/1024/1024).toFixed(1);if(console.log(`Compressed to ${b}MB at quality ${m}`),v.size<=U||m<=.3){const ue=new File([v],i.name,{type:"image/jpeg",lastModified:Date.now()});s({file:ue,compressed:!0,originalSize:t,finalSize:b})}else c(m-.1)},"image/jpeg",m)};c(.8)},a.onerror=()=>n(new Error("Failed to load image for compression")),a.src=URL.createObjectURL(i)}))}async function z(i,r,t){try{const{file:s,compressed:n,originalSize:a,finalSize:o}=await Y(i,t);n?L(t,`Compressed from ${a}MB to ${o}MB`,"success"):L(t,"","");const{data:l}=await u.storage.from(x).list(r);if(l&&l.length>0){const v=l.filter(b=>b.name.startsWith(`${t}_`)).map(b=>`${r}/${b.name}`);if(v.length>0){const{error:b}=await u.storage.from(x).remove(v);b?console.warn("Error deleting old images:",b):console.log(`Deleted ${v.length} old ${t} image(s)`)}}const d=`${t}_${Date.now()}.jpg`,p=`${r}/${d}`,{error:c}=await u.storage.from(x).upload(p,s,{cacheControl:"3600",upsert:!0});if(c)throw c;const{data:{publicUrl:m}}=u.storage.from(x).getPublicUrl(p);return m}catch(s){throw console.error(`Error uploading ${t} image:`,s),s}}async function W(){var r;const i=y.id;try{let t=e.profileImageUrl,s=e.featureImageUrl;e.profileImageFile&&(t=await z(e.profileImageFile,i,"profile")),e.featureImageFile&&(s=await z(e.featureImageFile,i,"feature"));const n=e.businessName||`${e.firstName} ${e.lastName}`.trim(),a=n.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),o={first_name:e.firstName,last_name:e.lastName,name:n,slug:a,profile_image_url:t,header_image_url:s,bio:e.bio,business_name:e.businessName||null,suburb_id:((r=e.suburb)==null?void 0:r.id)||null,show_address:e.displayAddress,show_opening_hours:e.displayOpeningHours,opening_monday:e.openingHours.monday||null,opening_tuesday:e.openingHours.tuesday||null,opening_wednesday:e.openingHours.wednesday||null,opening_thursday:e.openingHours.thursday||null,opening_friday:e.openingHours.friday||null,opening_saturday:e.openingHours.saturday||null,opening_sunday:e.openingHours.sunday||null,website:e.website||null,instagram:e.instagram||null,facebook:e.facebook||null,linkedin:e.linkedin||null,tiktok:e.tiktok||null,youtube:e.youtube||null,is_creative_space:e.spaceOrSupplier==="space",is_supplier:e.spaceOrSupplier==="supplier"},{error:l}=await u.from("members").update(o).eq("memberstack_id",i);if(l)throw l;const d=E.id;if(await u.from("member_sub_directories").delete().eq("member_id",d),await u.from("member_space_categories").delete().eq("member_id",d),await u.from("member_supplier_categories").delete().eq("member_id",d),e.chosenDirectories.length>0){const p=e.chosenDirectories.map(c=>({member_id:d,sub_directory_id:c}));await u.from("member_sub_directories").insert(p)}if(e.spaceCategories.length>0){const p=e.spaceCategories.map(c=>({member_id:d,space_category_id:c}));await u.from("member_space_categories").insert(p)}if(e.supplierCategories.length>0){const p=e.supplierCategories.map(c=>({member_id:d,supplier_category_id:c}));await u.from("member_supplier_categories").insert(p)}console.log("Profile saved successfully")}catch(t){throw console.error("Error saving profile:",t),t}}async function X(i,r=null){try{const t={memberstack_id:y.id,activity_type:i};r&&(t.entity_type=r.type||null,t.entity_id=r.id||null,t.entity_name=r.name||null),await fetch(`${$}/functions/v1/log-activity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${_}`,apikey:_},body:JSON.stringify(t)})}catch(t){console.warn("Failed to log activity:",t)}}function V(i){var n;const r=(n=y==null?void 0:y.customFields)==null?void 0:n["membership-type"],t=T(r),s=M(r);i.innerHTML=`
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" id="ep-error-banner" style="display: none;"></div>
          <div class="ep-success-banner" id="ep-success-banner" style="display: none;"></div>

          ${G()}
          ${t?J():""}
          ${K(s)}
          ${re()}

          <div class="ep-btn-row">
            <a href="/profile/start" class="ep-btn ep-btn-secondary" style="text-decoration: none; text-align: center;">Cancel</a>
            <button type="button" class="ep-btn" id="ep-save-btn">Save Changes</button>
          </div>
        </div>
      </div>
    `,te(i,t,s)}function G(){return`
      <div class="ep-section">
        <h3 class="ep-section-title">About You</h3>
        <p class="ep-section-description">Basic information about you and your creative practice.</p>

        <div class="ep-image-row">
          <div class="ep-form-field">
            <label>Profile Image <span class="required">*</span></label>
            <div class="ep-image-upload" id="profile-upload">
              ${e.profileImageUrl?`<img src="${e.profileImageUrl}" class="ep-image-preview profile" alt="Profile preview">
                   <button type="button" class="ep-image-remove" data-remove="profile">&times;</button>`:`<input type="file" accept="image/*" id="profile-file-input">
                   <div class="ep-image-upload-text">
                    <strong>Click to upload</strong><br>
                    Square image recommended
                  </div>`}
            </div>
            <div class="ep-hint">Square image recommended. Large images will be automatically compressed.</div>
            <div class="ep-compression-status" id="profile-compression-status"></div>
          </div>

          <div class="ep-form-field">
            <label>Feature Image <span class="required">*</span></label>
            <div class="ep-image-upload" id="feature-upload">
              ${e.featureImageUrl?`<img src="${e.featureImageUrl}" class="ep-image-preview" alt="Feature preview">
                   <button type="button" class="ep-image-remove" data-remove="feature">&times;</button>`:`<input type="file" accept="image/*" id="feature-file-input">
                   <div class="ep-image-upload-text">
                    <strong>Click to upload</strong><br>
                    Landscape image recommended
                  </div>`}
            </div>
            <div class="ep-hint">Landscape image recommended. Large images will be automatically compressed.</div>
            <div class="ep-compression-status" id="feature-compression-status"></div>
          </div>
        </div>

        <div class="ep-form-field">
          <label>First Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-first-name" value="${f(e.firstName)}" placeholder="Enter your first name">
        </div>

        <div class="ep-form-field">
          <label>Last Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-last-name" value="${f(e.lastName)}" placeholder="Enter your last name">
        </div>

        <div class="ep-form-field">
          <label>Email Address</label>
          <input type="email" class="ep-form-input" id="ep-email" value="${f(e.email)}" readonly>
          <div class="ep-hint">Email cannot be changed here. Contact support if you need to update it.</div>
        </div>

        <div class="ep-form-field">
          <label>Location <span class="required">*</span></label>
          <select class="ep-form-input" id="ep-suburb-select">
            <option value="">Select your suburb...</option>
            ${w.map(i=>{var r;return`<option value="${i.id}" ${((r=e.suburb)==null?void 0:r.id)===i.id?"selected":""}>${i.name}</option>`}).join("")}
          </select>
        </div>

        <div class="ep-form-field">
          <label>Public Bio <span class="required">*</span></label>
          <textarea class="ep-form-input" id="ep-bio" maxlength="2000" placeholder="Tell us about your creative practice, skills, and what you offer...">${f(e.bio)}</textarea>
          <div class="ep-char-count"><span id="ep-bio-count">${e.bio.length}</span> / 2000 characters</div>
        </div>
      </div>
    `}function J(){return`
      <div class="ep-section">
        <h3 class="ep-section-title">Business Details</h3>
        <p class="ep-section-description">Information about your business or organization.</p>

        <div class="ep-form-field">
          <label>Business / Trading Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-business-name" value="${f(e.businessName)}" placeholder="Enter your business or trading name">
        </div>

        <div class="ep-form-field">
          <label>Business Address</label>
          <input type="text" class="ep-form-input" id="ep-address" value="${f(e.businessAddress)}" placeholder="Enter your business address">
          <div class="ep-hint">This is where customers can find you</div>
        </div>

        <div class="ep-toggle-field">
          <span class="ep-toggle-label">Display address publicly on my profile</span>
          <label class="ep-toggle">
            <input type="checkbox" id="ep-display-address" ${e.displayAddress?"checked":""}>
            <span class="ep-toggle-slider"></span>
          </label>
        </div>

        <div class="ep-form-field">
          <label>Opening Hours</label>
          <div class="ep-hours-grid">
            ${C.map(i=>`
              <div class="ep-hours-row">
                <span class="ep-hours-day">${i}</span>
                <input type="text" class="ep-hours-input" id="ep-hours-${i.toLowerCase()}"
                  value="${f(e.openingHours[i.toLowerCase()])}"
                  placeholder="e.g., 9am - 5pm or Closed">
              </div>
            `).join("")}
          </div>
        </div>

        <div class="ep-toggle-field">
          <span class="ep-toggle-label">Display opening hours publicly on my profile</span>
          <label class="ep-toggle">
            <input type="checkbox" id="ep-display-hours" ${e.displayOpeningHours?"checked":""}>
            <span class="ep-toggle-slider"></span>
          </label>
        </div>
      </div>
    `}function K(i){return`
      <div class="ep-section">
        <h3 class="ep-section-title">Categories</h3>
        <p class="ep-section-description">Select the categories that best describe your work.</p>

        <div id="categories-container">
          ${i?Q():ie()}
        </div>
      </div>
    `}function Q(){return`
      <div class="ep-form-field">
        <label>What type of listing are you? <span class="required">*</span></label>
        <div class="ep-radio-group">
          <label class="ep-radio-item ${e.spaceOrSupplier==="space"?"selected":""}" id="radio-space">
            <input type="radio" name="space-supplier" value="space" ${e.spaceOrSupplier==="space"?"checked":""}>
            <div class="ep-radio-item-title">Creative Space</div>
            <div class="ep-radio-item-desc">Studios, venues, galleries, etc.</div>
          </label>
          <label class="ep-radio-item ${e.spaceOrSupplier==="supplier"?"selected":""}" id="radio-supplier">
            <input type="radio" name="space-supplier" value="supplier" ${e.spaceOrSupplier==="supplier"?"checked":""}>
            <div class="ep-radio-item-title">Supplier</div>
            <div class="ep-radio-item-desc">Materials, services, equipment, etc.</div>
          </label>
        </div>
      </div>
      <div id="space-supplier-categories" style="${e.spaceOrSupplier?"":"display: none;"}">
        ${e.spaceOrSupplier==="space"?A():""}
        ${e.spaceOrSupplier==="supplier"?N():""}
      </div>
    `}function A(){let i='<div class="ep-category-section"><div style="font-weight:600;margin-bottom:12px;">Select Space Categories</div><div class="ep-category-grid">';return h.spaceCategories.forEach(r=>{const t=e.spaceCategories.includes(r.id);i+=`
        <label class="ep-category-item ${t?"selected":""}" data-id="${r.id}">
          <input type="checkbox" value="${r.id}" ${t?"checked":""}>
          ${r.name}
        </label>
      `}),i+='</div><div class="ep-selected-count"><span id="space-count">'+e.spaceCategories.length+"</span> selected</div></div>",i}function N(){let i='<div class="ep-category-section"><div style="font-weight:600;margin-bottom:12px;">Select Supplier Categories</div><div class="ep-category-grid">';return h.supplierCategories.forEach(r=>{const t=e.supplierCategories.includes(r.id);i+=`
        <label class="ep-category-item ${t?"selected":""}" data-id="${r.id}">
          <input type="checkbox" value="${r.id}" ${t?"checked":""}>
          ${r.name}
        </label>
      `}),i+='</div><div class="ep-selected-count"><span id="supplier-count">'+e.supplierCategories.length+"</span> selected</div></div>",i}function ee(i){const r=h.subDirectories.find(t=>t.id===i);return r?r.name:i}function ie(){let i='<div class="ep-category-selector">';return i+='<div class="ep-parent-categories">',h.directories.forEach(r=>{i+=`<button type="button" class="ep-parent-btn" data-parent="${r.id}">${r.name}</button>`}),i+="</div>",h.directories.forEach(r=>{const t=h.subDirectories.filter(s=>s.directory_id===r.id);i+=`<div class="ep-child-categories" data-parent="${r.id}">`,t.forEach(s=>{const n=e.chosenDirectories.includes(s.id);i+=`<button type="button" class="ep-child-btn ${n?"selected":""}" data-id="${s.id}">${s.name}</button>`}),i+="</div>"}),i+=`
      <div class="ep-selected-categories" id="ep-selected-section" style="${e.chosenDirectories.length?"":"display: none;"}">
        <h5>Selected Categories</h5>
        <div class="ep-selected-list" id="ep-selected-list"></div>
      </div>
    </div>`,i}function re(){return`
      <div class="ep-section">
        <h3 class="ep-section-title">External Links</h3>
        <p class="ep-section-description">Add your website and social media links. All fields are optional.</p>

        <div class="ep-links-grid">
          <div class="ep-link-field">
            <span class="ep-link-label">Website</span>
            <input type="url" class="ep-form-input" id="ep-website" value="${f(e.website)}" placeholder="https://yourwebsite.com">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">Instagram</span>
            <input type="url" class="ep-form-input" id="ep-instagram" value="${f(e.instagram)}" placeholder="https://instagram.com/username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">Facebook</span>
            <input type="url" class="ep-form-input" id="ep-facebook" value="${f(e.facebook)}" placeholder="https://facebook.com/page">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">LinkedIn</span>
            <input type="url" class="ep-form-input" id="ep-linkedin" value="${f(e.linkedin)}" placeholder="https://linkedin.com/in/username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">TikTok</span>
            <input type="url" class="ep-form-input" id="ep-tiktok" value="${f(e.tiktok)}" placeholder="https://tiktok.com/@username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">YouTube</span>
            <input type="url" class="ep-form-input" id="ep-youtube" value="${f(e.youtube)}" placeholder="https://youtube.com/channel">
          </div>
        </div>
      </div>
    `}function te(i,r,t){const s=i.querySelector("#ep-error-banner"),n=i.querySelector("#ep-success-banner"),a=i.querySelector("#ep-save-btn");se(i),r&&ae(i),ne(i,t),pe(i),a.addEventListener("click",async()=>{if(s.style.display="none",n.style.display="none",!e.firstName.trim()){g(s,"Please enter your first name");return}if(!e.lastName.trim()){g(s,"Please enter your last name");return}if(!e.profileImageUrl){g(s,"Please upload a profile image");return}if(!e.featureImageUrl){g(s,"Please upload a feature image");return}if(!e.suburb){g(s,"Please select your location");return}if(!e.bio.trim()){g(s,"Please enter a bio");return}if(e.bio.trim().length<50){g(s,"Please enter at least 50 characters for your bio");return}if(r&&!e.businessName.trim()){g(s,"Please enter your business name");return}if(t){if(!e.spaceOrSupplier){g(s,"Please select whether you are a Creative Space or Supplier");return}if((e.spaceOrSupplier==="space"?e.spaceCategories.length:e.supplierCategories.length)===0){g(s,"Please select at least one category");return}}else if(e.chosenDirectories.length===0){g(s,"Please select at least one category");return}const o=B();if(o.length>0){o.forEach(({platform:l,error:d})=>{const p=i.querySelector(`#ep-${l}`),c=p.closest(".ep-link-field");let m=c.querySelector(".ep-field-error");m||(m=document.createElement("div"),m.className="ep-field-error",c.appendChild(m)),p.classList.add("error"),m.textContent=d}),g(s,"Please fix the highlighted fields before saving");return}a.disabled=!0,a.textContent="Saving...";try{await W(),await X("profile_update"),n.textContent="Profile updated successfully!",n.style.display="block",n.scrollIntoView({behavior:"smooth",block:"center"}),a.textContent="Save Changes",a.disabled=!1}catch(l){console.error("Save error:",l),g(s,"An error occurred while saving. Please try again."),a.textContent="Save Changes",a.disabled=!1}})}function se(i){const r=i.querySelector("#ep-first-name"),t=i.querySelector("#ep-last-name"),s=i.querySelector("#ep-bio"),n=i.querySelector("#ep-bio-count"),a=i.querySelector("#ep-suburb-select");r.addEventListener("input",()=>{e.firstName=r.value}),t.addEventListener("input",()=>{e.lastName=t.value}),s.addEventListener("input",()=>{e.bio=s.value,n.textContent=s.value.length}),a.addEventListener("change",()=>{const o=a.options[a.selectedIndex];o.value?e.suburb={id:o.value,name:o.text.split(",")[0].trim()}:e.suburb=null}),oe(i)}function oe(i){const r=i.querySelector("#profile-upload"),t=i.querySelector("#feature-upload");function s(){e.profileImageUrl?(r.innerHTML=`
          <img src="${e.profileImageUrl}" class="ep-image-preview profile" alt="Profile preview">
          <button type="button" class="ep-image-remove" data-remove="profile">&times;</button>
        `,r.classList.add("has-image")):(r.innerHTML=`
          <input type="file" accept="image/*" id="profile-file-input">
          <div class="ep-image-upload-text">
            <strong>Click to upload</strong><br>
            Square image recommended
          </div>
        `,r.classList.remove("has-image"),r.querySelector("#profile-file-input").addEventListener("change",a))}function n(){e.featureImageUrl?(t.innerHTML=`
          <img src="${e.featureImageUrl}" class="ep-image-preview" alt="Feature preview">
          <button type="button" class="ep-image-remove" data-remove="feature">&times;</button>
        `,t.classList.add("has-image")):(t.innerHTML=`
          <input type="file" accept="image/*" id="feature-file-input">
          <div class="ep-image-upload-text">
            <strong>Click to upload</strong><br>
            Landscape image recommended
          </div>
        `,t.classList.remove("has-image"),t.querySelector("#feature-file-input").addEventListener("change",o))}function a(p){const c=p.target.files[0];c&&(e.profileImageFile=c,e.profileImageUrl=URL.createObjectURL(c),s())}function o(p){const c=p.target.files[0];c&&(e.featureImageFile=c,e.featureImageUrl=URL.createObjectURL(c),n())}const l=r.querySelector("#profile-file-input"),d=t.querySelector("#feature-file-input");l&&l.addEventListener("change",a),d&&d.addEventListener("change",o),r.addEventListener("click",p=>{p.target.dataset.remove==="profile"&&(p.stopPropagation(),e.profileImageUrl="",e.profileImageFile=null,s())}),t.addEventListener("click",p=>{p.target.dataset.remove==="feature"&&(p.stopPropagation(),e.featureImageUrl="",e.featureImageFile=null,n())})}function ae(i){const r=i.querySelector("#ep-business-name"),t=i.querySelector("#ep-address"),s=i.querySelector("#ep-display-address"),n=i.querySelector("#ep-display-hours");r&&r.addEventListener("input",()=>{e.businessName=r.value}),t&&t.addEventListener("input",()=>{e.businessAddress=t.value}),s&&s.addEventListener("change",()=>{e.displayAddress=s.checked}),n&&n.addEventListener("change",()=>{e.displayOpeningHours=n.checked}),C.forEach(a=>{const o=i.querySelector(`#ep-hours-${a.toLowerCase()}`);o&&o.addEventListener("input",()=>{e.openingHours[a.toLowerCase()]=o.value})})}function ne(i,r){if(r){const t=i.querySelector("#radio-space"),s=i.querySelector("#radio-supplier"),n=i.querySelector("#space-supplier-categories");t&&t.addEventListener("click",()=>{e.spaceOrSupplier="space",e.supplierCategories=[],t.classList.add("selected"),s.classList.remove("selected"),n.innerHTML=A(),n.style.display="block",S(i,"spaceCategories","space-count")}),s&&s.addEventListener("click",()=>{e.spaceOrSupplier="supplier",e.spaceCategories=[],s.classList.add("selected"),t.classList.remove("selected"),n.innerHTML=N(),n.style.display="block",S(i,"supplierCategories","supplier-count")}),e.spaceOrSupplier==="space"?S(i,"spaceCategories","space-count"):e.spaceOrSupplier==="supplier"&&S(i,"supplierCategories","supplier-count")}else le(i)}function le(i){const r=i.querySelectorAll(".ep-parent-btn"),t=i.querySelectorAll(".ep-child-categories"),s=i.querySelector("#ep-selected-list"),n=i.querySelector("#ep-selected-section");function a(){!s||!n||(s.innerHTML=e.chosenDirectories.map(o=>`<span class="ep-selected-tag">${ee(o)}<button type="button" data-id="${o}">&times;</button></span>`).join(""),n.style.display=e.chosenDirectories.length?"":"none",i.querySelectorAll(".ep-child-btn").forEach(o=>{const l=o.dataset.id;o.classList.toggle("selected",e.chosenDirectories.includes(l))}))}a(),r.forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.parent,d=o.classList.contains("active");r.forEach(p=>p.classList.remove("active")),t.forEach(p=>p.classList.remove("visible")),d||(o.classList.add("active"),i.querySelector(`.ep-child-categories[data-parent="${l}"]`).classList.add("visible"))})}),i.querySelectorAll(".ep-child-btn").forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.id,d=e.chosenDirectories.indexOf(l);d===-1?e.chosenDirectories.push(l):e.chosenDirectories.splice(d,1),a()})}),s&&s.addEventListener("click",o=>{if(o.target.tagName==="BUTTON"){const l=o.target.dataset.id,d=e.chosenDirectories.indexOf(l);d!==-1&&(e.chosenDirectories.splice(d,1),a())}})}function S(i,r,t){i.querySelectorAll(".ep-category-item").forEach(s=>{s.addEventListener("click",n=>{n.preventDefault();const a=s.dataset.id;if(!a)return;const o=e[r].indexOf(a);o===-1?(e[r].push(a),s.classList.add("selected")):(e[r].splice(o,1),s.classList.remove("selected"));const l=i.querySelector("#"+t);l&&(l.textContent=e[r].length)})})}function pe(i){["website","instagram","facebook","linkedin","tiktok","youtube"].forEach(t=>{const s=i.querySelector(`#ep-${t}`);if(!s)return;const n=s.closest(".ep-link-field");let a=n.querySelector(".ep-field-error");a||(a=document.createElement("div"),a.className="ep-field-error",a.style.cssText="grid-column: 2;",n.appendChild(a)),s.addEventListener("input",()=>{e[t]=s.value,s.classList.remove("error"),a.textContent=""}),s.addEventListener("blur",()=>{const o=s.value.trim();if(!o){s.classList.remove("error"),a.textContent="";return}const l=q(o,t);l.valid?(l.url!==o&&(s.value=l.url,e[t]=l.url),s.classList.remove("error"),a.textContent=""):(s.classList.add("error"),a.textContent=l.error)})})}function g(i,r){i.textContent=r,i.style.display="block",i.scrollIntoView({behavior:"smooth",block:"center"})}function de(i){i.innerHTML=`
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" style="display: block;">
            Please log in to edit your profile.
          </div>
          <p style="text-align: center; margin-top: 20px;">
            <a href="/login" style="color: #333; font-weight: 600;">Log in</a>
          </p>
        </div>
      </div>
    `}function ce(i,r){i.innerHTML=`
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" style="display: block;">${r}</div>
        </div>
      </div>
    `}async function P(){const i=document.querySelector(".all-types-profile-edit")||document.querySelector(".supabase-edit-profile-container");if(!i){console.warn("Could not find edit profile container");return}const r=document.createElement("style");r.textContent=F,document.head.appendChild(r),i.innerHTML='<div class="ep-loading">Loading your profile...</div>';try{await H(),u=window.supabase.createClient($,_);const{data:t}=await window.$memberstackDom.getCurrentMember();if(!t){de(i);return}y=t,await R(),await j(),await Z(t.id),V(i)}catch(t){console.error("Init error:",t),ce(i,"Error loading profile. Please refresh the page.")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",P):P()})();
