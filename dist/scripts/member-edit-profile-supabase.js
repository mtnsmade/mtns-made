(function(){console.log("Member edit profile Supabase script loaded");const U="https://epszwomtxkpjegbjbixr.supabase.co",E="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",S="member-images",T=["small-business","large-business","not-for-profit","spaces-suppliers"],M="spaces-suppliers",I=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];let c=null,y=null,z=null,v={directories:[],subDirectories:[],spaceCategories:[],supplierCategories:[]},_=[],e={firstName:"",lastName:"",email:"",profileImageUrl:"",profileImageFile:null,featureImageUrl:"",featureImageFile:null,bio:"",businessName:"",suburb:null,businessAddress:"",displayAddress:!1,openingHours:{monday:"",tuesday:"",wednesday:"",thursday:"",friday:"",saturday:"",sunday:""},displayOpeningHours:!1,spaceOrSupplier:null,chosenDirectories:[],spaceCategories:[],supplierCategories:[],website:"",instagram:"",facebook:"",linkedin:"",tiktok:"",youtube:""};const B=`
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
  `;function R(){return new Promise((i,t)=>{let r=0;const s=50,n=setInterval(()=>{r++,window.$memberstackDom&&window.supabase?(clearInterval(n),i()):r>=s&&(clearInterval(n),t(new Error("Dependencies not loaded")))},100)})}function j(i){return T.includes(i)}function Z(i){return i===M}const A={instagram:{baseUrl:"https://www.instagram.com/",patterns:[/instagram\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},facebook:{baseUrl:"https://www.facebook.com/",patterns:[/facebook\.com\/([^\/\?]+)/i,/^([a-zA-Z0-9.]+)$/]},linkedin:{baseUrl:"https://www.linkedin.com/in/",patterns:[/linkedin\.com\/(in|company)\/([^\/\?]+)/i,/^([a-zA-Z0-9-]+)$/]},tiktok:{baseUrl:"https://www.tiktok.com/@",patterns:[/tiktok\.com\/@?([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},youtube:{baseUrl:"https://www.youtube.com/",patterns:[/youtube\.com\/(channel|c|user|@)\/([^\/\?]+)/i,/youtube\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9_-]+)$/]}};function P(i,t=null){if(!i||!i.trim())return{valid:!0,url:""};if(i=i.trim(),i.includes(" "))return{valid:!1,error:"Please enter only one URL (no spaces)"};if((i.match(/https?:\/\//gi)||[]).length>1)return{valid:!1,error:"Please enter only one URL"};if(/^https?:\/\//i.test(i))try{return new URL(i),{valid:!0,url:i}}catch{return{valid:!1,error:"Invalid URL format"}}if(t==="website")return/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/.test(i)?{valid:!0,url:"https://"+i}:{valid:!1,error:"Please enter a full website URL"};if(t&&A[t]){const s=A[t];if(i.toLowerCase().includes(t.toLowerCase()+".com"))return{valid:!0,url:"https://"+i.replace(/^(https?:\/\/)?/i,"")};for(const n of s.patterns){const a=i.match(n);if(a){const o=a[a.length-1];return o.toLowerCase()===t.toLowerCase()?{valid:!1,error:`Please enter your ${t} profile URL or username`}:{valid:!0,url:s.baseUrl+o.replace(/^@/,"")}}}return{valid:!1,error:`Please enter a valid ${t} URL or username`}}return{valid:!1,error:"Invalid URL"}}function Y(){const i=[];return["website","instagram","facebook","linkedin","tiktok","youtube"].forEach(r=>{const s=e[r];if(s&&s.trim()){const n=P(s,r);n.valid?e[r]=n.url:i.push({platform:r,error:n.error})}}),i}function g(i){if(!i)return"";const t=document.createElement("div");return t.textContent=i,t.innerHTML}async function W(){try{const{data:i}=await c.from("directories").select("id, name, slug").order("display_order"),{data:t}=await c.from("sub_directories").select("id, name, slug, directory_id").order("name"),{data:r}=await c.from("creative_space_categories").select("id, name, slug").order("name"),{data:s}=await c.from("supplier_categories").select("id, name, slug").order("name");return v={directories:i||[],subDirectories:t||[],spaceCategories:r||[],supplierCategories:s||[]},v}catch(i){throw console.error("Error loading categories:",i),i}}async function X(){try{const{data:i,error:t}=await c.from("suburbs").select("id, name").order("name");if(t)throw t;return _=i||[],_}catch(i){return console.error("Error loading suburbs:",i),[]}}async function V(i){try{const{data:t,error:r}=await c.from("members").select("*").eq("memberstack_id",i).single();if(console.log("Loaded member data:",t,r),r)throw console.error("Error loading member:",r),r;if(r)throw r;if(!t)return null;z=t;const{data:s}=await c.from("member_sub_directories").select("sub_directory_id").eq("member_id",t.id),{data:n}=await c.from("member_space_categories").select("space_category_id").eq("member_id",t.id),{data:a}=await c.from("member_supplier_categories").select("supplier_category_id").eq("member_id",t.id);if(e.firstName=t.first_name||"",e.lastName=t.last_name||"",e.email=t.email||"",e.profileImageUrl=t.profile_image_url||"",e.featureImageUrl=t.header_image_url||"",e.bio=t.bio||"",e.businessName=t.business_name||"",e.businessAddress=t.business_address||"",e.displayAddress=t.show_address||!1,e.displayOpeningHours=t.show_opening_hours||!1,t.suburb_id){const o=_.find(l=>l.id===t.suburb_id);o&&(e.suburb={id:o.id,name:o.name})}return I.forEach(o=>{e.openingHours[o.toLowerCase()]=t[`opening_${o.toLowerCase()}`]||""}),t.is_creative_space?e.spaceOrSupplier="space":t.is_supplier&&(e.spaceOrSupplier="supplier"),e.chosenDirectories=(s||[]).map(o=>o.sub_directory_id),e.spaceCategories=(n||[]).map(o=>o.space_category_id),e.supplierCategories=(a||[]).map(o=>o.supplier_category_id),e.website=t.website||"",e.instagram=t.instagram||"",e.facebook=t.facebook||"",e.linkedin=t.linkedin||"",e.tiktok=t.tiktok||"",e.youtube=t.youtube||"",t}catch(t){return console.error("Error loading member data:",t),null}}const N=3*1024*1024,C=2e3;function q(i,t,r){const s=document.getElementById(`${i}-compression-status`);s&&(s.textContent=t,s.className="ep-compression-status"+(r?` ${r}`:""))}async function G(i,t){const r=(i.size/1024/1024).toFixed(1);return i.size<=N?(console.log(`Image ${i.name} is ${r}MB - no compression needed`),{file:i,compressed:!1,originalSize:r,finalSize:r}):(console.log(`Compressing image ${i.name} from ${r}MB...`),q(t,`Compressing image (${r}MB)...`,"compressing"),new Promise((s,n)=>{const a=new Image,o=document.createElement("canvas"),l=o.getContext("2d");a.onload=()=>{let{width:d,height:p}=a;if(d>C||p>C){const m=Math.min(C/d,C/p);d=Math.round(d*m),p=Math.round(p*m)}o.width=d,o.height=p,l.drawImage(a,0,0,d,p);const u=m=>{o.toBlob(b=>{if(!b){n(new Error("Failed to compress image"));return}const h=(b.size/1024/1024).toFixed(1);if(console.log(`Compressed to ${h}MB at quality ${m}`),b.size<=N||m<=.3){const $=new File([b],i.name,{type:"image/jpeg",lastModified:Date.now()});s({file:$,compressed:!0,originalSize:r,finalSize:h})}else u(m-.1)},"image/jpeg",m)};u(.8)},a.onerror=()=>n(new Error("Failed to load image for compression")),a.src=URL.createObjectURL(i)}))}async function D(i,t,r){try{const{file:s,compressed:n,originalSize:a,finalSize:o}=await G(i,r);n?q(r,`Compressed from ${a}MB to ${o}MB`,"success"):q(r,"","");const{data:l}=await c.storage.from(S).list(t);if(l&&l.length>0){const b=l.filter(h=>h.name.startsWith(`${r}_`)).map(h=>`${t}/${h.name}`);if(b.length>0){const{error:h}=await c.storage.from(S).remove(b);h?console.warn("Error deleting old images:",h):console.log(`Deleted ${b.length} old ${r} image(s)`)}}const d=`${r}_${Date.now()}.jpg`,p=`${t}/${d}`,{error:u}=await c.storage.from(S).upload(p,s,{cacheControl:"3600",upsert:!0});if(u)throw u;const{data:{publicUrl:m}}=c.storage.from(S).getPublicUrl(p);return m}catch(s){throw console.error(`Error uploading ${r} image:`,s),s}}async function J(){var t,r;const i=y.id;try{let s=e.profileImageUrl,n=e.featureImageUrl;e.profileImageFile&&(s=await D(e.profileImageFile,i,"profile")),e.featureImageFile&&(n=await D(e.featureImageFile,i,"feature"));const a=e.businessName||`${e.firstName} ${e.lastName}`.trim(),o=a.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),l=!!s,d=!!n,p=e.bio&&e.bio.length>=50,u=e.chosenDirectories.length>0||e.spaceCategories.length>0||e.supplierCategories.length>0,m=!!((t=e.suburb)!=null&&t.id),b=l&&d&&p&&u&&m;console.log("Profile completion check:",{hasProfileImage:l,hasFeatureImage:d,hasBio:p,hasCategories:u,hasLocation:m,isProfileComplete:b});const h={first_name:e.firstName,last_name:e.lastName,name:a,slug:o,profile_image_url:s,header_image_url:n,bio:e.bio,business_name:e.businessName||null,suburb_id:((r=e.suburb)==null?void 0:r.id)||null,show_address:e.displayAddress,show_opening_hours:e.displayOpeningHours,opening_monday:e.openingHours.monday||null,opening_tuesday:e.openingHours.tuesday||null,opening_wednesday:e.openingHours.wednesday||null,opening_thursday:e.openingHours.thursday||null,opening_friday:e.openingHours.friday||null,opening_saturday:e.openingHours.saturday||null,opening_sunday:e.openingHours.sunday||null,website:e.website||null,instagram:e.instagram||null,facebook:e.facebook||null,linkedin:e.linkedin||null,tiktok:e.tiktok||null,youtube:e.youtube||null,is_creative_space:e.spaceOrSupplier==="space",is_supplier:e.spaceOrSupplier==="supplier",profile_complete:b},{error:$}=await c.from("members").update(h).eq("memberstack_id",i);if($)throw $;const x=z.id;if(await c.from("member_sub_directories").delete().eq("member_id",x),await c.from("member_space_categories").delete().eq("member_id",x),await c.from("member_supplier_categories").delete().eq("member_id",x),e.chosenDirectories.length>0){const w=e.chosenDirectories.map(k=>({member_id:x,sub_directory_id:k}));await c.from("member_sub_directories").insert(w)}if(e.spaceCategories.length>0){const w=e.spaceCategories.map(k=>({member_id:x,space_category_id:k}));await c.from("member_space_categories").insert(w)}if(e.supplierCategories.length>0){const w=e.supplierCategories.map(k=>({member_id:x,supplier_category_id:k}));await c.from("member_supplier_categories").insert(w)}console.log("Profile saved successfully")}catch(s){throw console.error("Error saving profile:",s),s}}async function K(i,t=null){try{const r={memberstack_id:y.id,activity_type:i};t&&(r.entity_type=t.type||null,r.entity_id=t.id||null,r.entity_name=t.name||null),await fetch(`${U}/functions/v1/log-activity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${E}`,apikey:E},body:JSON.stringify(r)})}catch(r){console.warn("Failed to log activity:",r)}}function Q(i){var n;const t=(n=y==null?void 0:y.customFields)==null?void 0:n["membership-type"],r=j(t),s=Z(t);i.innerHTML=`
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" id="ep-error-banner" style="display: none;"></div>
          <div class="ep-success-banner" id="ep-success-banner" style="display: none;"></div>

          ${ee()}
          ${r?ie():""}
          ${te(s)}
          ${ae()}

          <div class="ep-btn-row">
            <a href="/profile/start" class="ep-btn ep-btn-secondary" style="text-decoration: none; text-align: center;">Cancel</a>
            <button type="button" class="ep-btn" id="ep-save-btn">Save Changes</button>
          </div>
        </div>
      </div>
    `,ne(i,r,s)}function ee(){return`
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
          <input type="text" class="ep-form-input" id="ep-first-name" value="${g(e.firstName)}" placeholder="Enter your first name">
        </div>

        <div class="ep-form-field">
          <label>Last Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-last-name" value="${g(e.lastName)}" placeholder="Enter your last name">
        </div>

        <div class="ep-form-field">
          <label>Email Address</label>
          <input type="email" class="ep-form-input" id="ep-email" value="${g(e.email)}" readonly>
          <div class="ep-hint">Email cannot be changed here. Contact support if you need to update it.</div>
        </div>

        <div class="ep-form-field">
          <label>Location <span class="required">*</span></label>
          <select class="ep-form-input" id="ep-suburb-select">
            <option value="">Select your suburb...</option>
            ${_.map(i=>{var t;return`<option value="${i.id}" ${((t=e.suburb)==null?void 0:t.id)===i.id?"selected":""}>${i.name}</option>`}).join("")}
          </select>
        </div>

        <div class="ep-form-field">
          <label>Public Bio <span class="required">*</span></label>
          <textarea class="ep-form-input" id="ep-bio" maxlength="2000" placeholder="Tell us about your creative practice, skills, and what you offer...">${g(e.bio)}</textarea>
          <div class="ep-char-count"><span id="ep-bio-count">${e.bio.length}</span> / 2000 characters</div>
        </div>
      </div>
    `}function ie(){return`
      <div class="ep-section">
        <h3 class="ep-section-title">Business Details</h3>
        <p class="ep-section-description">Information about your business or organization.</p>

        <div class="ep-form-field">
          <label>Business / Trading Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-business-name" value="${g(e.businessName)}" placeholder="Enter your business or trading name">
        </div>

        <div class="ep-form-field">
          <label>Business Address</label>
          <input type="text" class="ep-form-input" id="ep-address" value="${g(e.businessAddress)}" placeholder="Enter your business address">
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
            ${I.map(i=>`
              <div class="ep-hours-row">
                <span class="ep-hours-day">${i}</span>
                <input type="text" class="ep-hours-input" id="ep-hours-${i.toLowerCase()}"
                  value="${g(e.openingHours[i.toLowerCase()])}"
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
    `}function te(i){return`
      <div class="ep-section">
        <h3 class="ep-section-title">Categories</h3>
        <p class="ep-section-description">Select the categories that best describe your work.</p>

        <div id="categories-container">
          ${i?re():oe()}
        </div>
      </div>
    `}function re(){return`
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
        ${e.spaceOrSupplier==="space"?O():""}
        ${e.spaceOrSupplier==="supplier"?F():""}
      </div>
    `}function O(){let i='<div class="ep-category-section"><div style="font-weight:600;margin-bottom:12px;">Select Space Categories</div><div class="ep-category-grid">';return v.spaceCategories.forEach(t=>{const r=e.spaceCategories.includes(t.id);i+=`
        <label class="ep-category-item ${r?"selected":""}" data-id="${t.id}">
          <input type="checkbox" value="${t.id}" ${r?"checked":""}>
          ${t.name}
        </label>
      `}),i+='</div><div class="ep-selected-count"><span id="space-count">'+e.spaceCategories.length+"</span> selected</div></div>",i}function F(){let i='<div class="ep-category-section"><div style="font-weight:600;margin-bottom:12px;">Select Supplier Categories</div><div class="ep-category-grid">';return v.supplierCategories.forEach(t=>{const r=e.supplierCategories.includes(t.id);i+=`
        <label class="ep-category-item ${r?"selected":""}" data-id="${t.id}">
          <input type="checkbox" value="${t.id}" ${r?"checked":""}>
          ${t.name}
        </label>
      `}),i+='</div><div class="ep-selected-count"><span id="supplier-count">'+e.supplierCategories.length+"</span> selected</div></div>",i}function se(i){const t=v.subDirectories.find(r=>r.id===i);return t?t.name:i}function oe(){let i='<div class="ep-category-selector">';return i+='<div class="ep-parent-categories">',v.directories.forEach(t=>{i+=`<button type="button" class="ep-parent-btn" data-parent="${t.id}">${t.name}</button>`}),i+="</div>",v.directories.forEach(t=>{const r=v.subDirectories.filter(s=>s.directory_id===t.id);i+=`<div class="ep-child-categories" data-parent="${t.id}">`,r.forEach(s=>{const n=e.chosenDirectories.includes(s.id);i+=`<button type="button" class="ep-child-btn ${n?"selected":""}" data-id="${s.id}">${s.name}</button>`}),i+="</div>"}),i+=`
      <div class="ep-selected-categories" id="ep-selected-section" style="${e.chosenDirectories.length?"":"display: none;"}">
        <h5>Selected Categories</h5>
        <div class="ep-selected-list" id="ep-selected-list"></div>
      </div>
    </div>`,i}function ae(){return`
      <div class="ep-section">
        <h3 class="ep-section-title">External Links</h3>
        <p class="ep-section-description">Add your website and social media links. All fields are optional.</p>

        <div class="ep-links-grid">
          <div class="ep-link-field">
            <span class="ep-link-label">Website</span>
            <input type="url" class="ep-form-input" id="ep-website" value="${g(e.website)}" placeholder="https://yourwebsite.com">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">Instagram</span>
            <input type="url" class="ep-form-input" id="ep-instagram" value="${g(e.instagram)}" placeholder="https://instagram.com/username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">Facebook</span>
            <input type="url" class="ep-form-input" id="ep-facebook" value="${g(e.facebook)}" placeholder="https://facebook.com/page">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">LinkedIn</span>
            <input type="url" class="ep-form-input" id="ep-linkedin" value="${g(e.linkedin)}" placeholder="https://linkedin.com/in/username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">TikTok</span>
            <input type="url" class="ep-form-input" id="ep-tiktok" value="${g(e.tiktok)}" placeholder="https://tiktok.com/@username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">YouTube</span>
            <input type="url" class="ep-form-input" id="ep-youtube" value="${g(e.youtube)}" placeholder="https://youtube.com/channel">
          </div>
        </div>
      </div>
    `}function ne(i,t,r){const s=i.querySelector("#ep-error-banner"),n=i.querySelector("#ep-success-banner"),a=i.querySelector("#ep-save-btn");le(i),t&&de(i),ce(i,r),me(i),a.addEventListener("click",async()=>{if(s.style.display="none",n.style.display="none",!e.firstName.trim()){f(s,"Please enter your first name");return}if(!e.lastName.trim()){f(s,"Please enter your last name");return}if(!e.profileImageUrl){f(s,"Please upload a profile image");return}if(!e.featureImageUrl){f(s,"Please upload a feature image");return}if(!e.suburb){f(s,"Please select your location");return}if(!e.bio.trim()){f(s,"Please enter a bio");return}if(e.bio.trim().length<50){f(s,"Please enter at least 50 characters for your bio");return}if(t&&!e.businessName.trim()){f(s,"Please enter your business name");return}if(r){if(!e.spaceOrSupplier){f(s,"Please select whether you are a Creative Space or Supplier");return}if((e.spaceOrSupplier==="space"?e.spaceCategories.length:e.supplierCategories.length)===0){f(s,"Please select at least one category");return}}else if(e.chosenDirectories.length===0){f(s,"Please select at least one category");return}const o=Y();if(o.length>0){o.forEach(({platform:l,error:d})=>{const p=i.querySelector(`#ep-${l}`),u=p.closest(".ep-link-field");let m=u.querySelector(".ep-field-error");m||(m=document.createElement("div"),m.className="ep-field-error",u.appendChild(m)),p.classList.add("error"),m.textContent=d}),f(s,"Please fix the highlighted fields before saving");return}a.disabled=!0,a.textContent="Saving...";try{await J(),await K("profile_update"),n.textContent="Profile updated successfully!",n.style.display="block",n.scrollIntoView({behavior:"smooth",block:"center"}),a.textContent="Save Changes",a.disabled=!1}catch(l){console.error("Save error:",l),f(s,"An error occurred while saving. Please try again."),a.textContent="Save Changes",a.disabled=!1}})}function le(i){const t=i.querySelector("#ep-first-name"),r=i.querySelector("#ep-last-name"),s=i.querySelector("#ep-bio"),n=i.querySelector("#ep-bio-count"),a=i.querySelector("#ep-suburb-select");t.addEventListener("input",()=>{e.firstName=t.value}),r.addEventListener("input",()=>{e.lastName=r.value}),s.addEventListener("input",()=>{e.bio=s.value,n.textContent=s.value.length}),a.addEventListener("change",()=>{const o=a.options[a.selectedIndex];o.value?e.suburb={id:o.value,name:o.text.split(",")[0].trim()}:e.suburb=null}),pe(i)}function pe(i){const t=i.querySelector("#profile-upload"),r=i.querySelector("#feature-upload");function s(){e.profileImageUrl?(t.innerHTML=`
          <img src="${e.profileImageUrl}" class="ep-image-preview profile" alt="Profile preview">
          <button type="button" class="ep-image-remove" data-remove="profile">&times;</button>
        `,t.classList.add("has-image")):(t.innerHTML=`
          <input type="file" accept="image/*" id="profile-file-input">
          <div class="ep-image-upload-text">
            <strong>Click to upload</strong><br>
            Square image recommended
          </div>
        `,t.classList.remove("has-image"),t.querySelector("#profile-file-input").addEventListener("change",a))}function n(){e.featureImageUrl?(r.innerHTML=`
          <img src="${e.featureImageUrl}" class="ep-image-preview" alt="Feature preview">
          <button type="button" class="ep-image-remove" data-remove="feature">&times;</button>
        `,r.classList.add("has-image")):(r.innerHTML=`
          <input type="file" accept="image/*" id="feature-file-input">
          <div class="ep-image-upload-text">
            <strong>Click to upload</strong><br>
            Landscape image recommended
          </div>
        `,r.classList.remove("has-image"),r.querySelector("#feature-file-input").addEventListener("change",o))}function a(p){const u=p.target.files[0];u&&(e.profileImageFile=u,e.profileImageUrl=URL.createObjectURL(u),s())}function o(p){const u=p.target.files[0];u&&(e.featureImageFile=u,e.featureImageUrl=URL.createObjectURL(u),n())}const l=t.querySelector("#profile-file-input"),d=r.querySelector("#feature-file-input");l&&l.addEventListener("change",a),d&&d.addEventListener("change",o),t.addEventListener("click",p=>{p.target.dataset.remove==="profile"&&(p.stopPropagation(),e.profileImageUrl="",e.profileImageFile=null,s())}),r.addEventListener("click",p=>{p.target.dataset.remove==="feature"&&(p.stopPropagation(),e.featureImageUrl="",e.featureImageFile=null,n())})}function de(i){const t=i.querySelector("#ep-business-name"),r=i.querySelector("#ep-address"),s=i.querySelector("#ep-display-address"),n=i.querySelector("#ep-display-hours");t&&t.addEventListener("input",()=>{e.businessName=t.value}),r&&r.addEventListener("input",()=>{e.businessAddress=r.value}),s&&s.addEventListener("change",()=>{e.displayAddress=s.checked}),n&&n.addEventListener("change",()=>{e.displayOpeningHours=n.checked}),I.forEach(a=>{const o=i.querySelector(`#ep-hours-${a.toLowerCase()}`);o&&o.addEventListener("input",()=>{e.openingHours[a.toLowerCase()]=o.value})})}function ce(i,t){if(t){const r=i.querySelector("#radio-space"),s=i.querySelector("#radio-supplier"),n=i.querySelector("#space-supplier-categories");r&&r.addEventListener("click",()=>{e.spaceOrSupplier="space",e.supplierCategories=[],r.classList.add("selected"),s.classList.remove("selected"),n.innerHTML=O(),n.style.display="block",L(i,"spaceCategories","space-count")}),s&&s.addEventListener("click",()=>{e.spaceOrSupplier="supplier",e.spaceCategories=[],s.classList.add("selected"),r.classList.remove("selected"),n.innerHTML=F(),n.style.display="block",L(i,"supplierCategories","supplier-count")}),e.spaceOrSupplier==="space"?L(i,"spaceCategories","space-count"):e.spaceOrSupplier==="supplier"&&L(i,"supplierCategories","supplier-count")}else ue(i)}function ue(i){const t=i.querySelectorAll(".ep-parent-btn"),r=i.querySelectorAll(".ep-child-categories"),s=i.querySelector("#ep-selected-list"),n=i.querySelector("#ep-selected-section");function a(){!s||!n||(s.innerHTML=e.chosenDirectories.map(o=>`<span class="ep-selected-tag">${se(o)}<button type="button" data-id="${o}">&times;</button></span>`).join(""),n.style.display=e.chosenDirectories.length?"":"none",i.querySelectorAll(".ep-child-btn").forEach(o=>{const l=o.dataset.id;o.classList.toggle("selected",e.chosenDirectories.includes(l))}))}a(),t.forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.parent,d=o.classList.contains("active");t.forEach(p=>p.classList.remove("active")),r.forEach(p=>p.classList.remove("visible")),d||(o.classList.add("active"),i.querySelector(`.ep-child-categories[data-parent="${l}"]`).classList.add("visible"))})}),i.querySelectorAll(".ep-child-btn").forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.id,d=e.chosenDirectories.indexOf(l);d===-1?e.chosenDirectories.push(l):e.chosenDirectories.splice(d,1),a()})}),s&&s.addEventListener("click",o=>{if(o.target.tagName==="BUTTON"){const l=o.target.dataset.id,d=e.chosenDirectories.indexOf(l);d!==-1&&(e.chosenDirectories.splice(d,1),a())}})}function L(i,t,r){i.querySelectorAll(".ep-category-item").forEach(s=>{s.addEventListener("click",n=>{n.preventDefault();const a=s.dataset.id;if(!a)return;const o=e[t].indexOf(a);o===-1?(e[t].push(a),s.classList.add("selected")):(e[t].splice(o,1),s.classList.remove("selected"));const l=i.querySelector("#"+r);l&&(l.textContent=e[t].length)})})}function me(i){["website","instagram","facebook","linkedin","tiktok","youtube"].forEach(r=>{const s=i.querySelector(`#ep-${r}`);if(!s)return;const n=s.closest(".ep-link-field");let a=n.querySelector(".ep-field-error");a||(a=document.createElement("div"),a.className="ep-field-error",a.style.cssText="grid-column: 2;",n.appendChild(a)),s.addEventListener("input",()=>{e[r]=s.value,s.classList.remove("error"),a.textContent=""}),s.addEventListener("blur",()=>{const o=s.value.trim();if(!o){s.classList.remove("error"),a.textContent="";return}const l=P(o,r);l.valid?(l.url!==o&&(s.value=l.url,e[r]=l.url),s.classList.remove("error"),a.textContent=""):(s.classList.add("error"),a.textContent=l.error)})})}function f(i,t){i.textContent=t,i.style.display="block",i.scrollIntoView({behavior:"smooth",block:"center"})}function ge(i){i.innerHTML=`
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
    `}function fe(i,t){i.innerHTML=`
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" style="display: block;">${t}</div>
        </div>
      </div>
    `}async function H(){const i=document.querySelector(".all-types-profile-edit")||document.querySelector(".supabase-edit-profile-container");if(!i){console.warn("Could not find edit profile container");return}const t=document.createElement("style");t.textContent=B,document.head.appendChild(t),i.innerHTML='<div class="ep-loading">Loading your profile...</div>';try{await R(),c=window.supabase.createClient(U,E);const{data:r}=await window.$memberstackDom.getCurrentMember();if(!r){ge(i);return}y=r,await W(),await X(),await V(r.id),Q(i)}catch(r){console.error("Init error:",r),fe(i,"Error loading profile. Please refresh the page.")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",H):H()})();
