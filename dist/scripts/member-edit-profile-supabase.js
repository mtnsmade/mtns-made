(function(){console.log("Member edit profile Supabase script loaded");const I="https://epszwomtxkpjegbjbixr.supabase.co",w="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",_="member-images",M=["small-business","large-business","not-for-profit","spaces-suppliers"],H="spaces-suppliers",A=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];let d=null,x=null,P=null,y={directories:[],subDirectories:[],spaceCategories:[],supplierCategories:[]},E=[],e={firstName:"",lastName:"",email:"",profileImageUrl:"",profileImageFile:null,featureImageUrl:"",featureImageFile:null,bio:"",businessName:"",suburb:null,businessAddress:"",displayAddress:!1,openingHours:{monday:"",tuesday:"",wednesday:"",thursday:"",friday:"",saturday:"",sunday:""},displayOpeningHours:!1,spaceOrSupplier:null,chosenDirectories:[],spaceCategories:[],supplierCategories:[],website:"",instagram:"",facebook:"",linkedin:"",tiktok:"",youtube:""};const B=`
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
  `;function R(){return new Promise((r,t)=>{let i=0;const s=50,n=setInterval(()=>{i++,window.$memberstackDom&&window.supabase?(clearInterval(n),r()):i>=s&&(clearInterval(n),t(new Error("Dependencies not loaded")))},100)})}function j(r){return M.includes(r)}function W(r){return r===H}const q={instagram:{baseUrl:"https://www.instagram.com/",patterns:[/instagram\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},facebook:{baseUrl:"https://www.facebook.com/",patterns:[/facebook\.com\/([^\/\?]+)/i,/^([a-zA-Z0-9.]+)$/]},linkedin:{baseUrl:"https://www.linkedin.com/in/",patterns:[/linkedin\.com\/(in|company)\/([^\/\?]+)/i,/^([a-zA-Z0-9-]+)$/]},tiktok:{baseUrl:"https://www.tiktok.com/@",patterns:[/tiktok\.com\/@?([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},youtube:{baseUrl:"https://www.youtube.com/",patterns:[/youtube\.com\/(channel|c|user|@)\/([^\/\?]+)/i,/youtube\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9_-]+)$/]}};function O(r,t=null){if(!r||!r.trim())return{valid:!0,url:""};if(r=r.trim(),r.includes(" "))return{valid:!1,error:"Please enter only one URL (no spaces)"};if((r.match(/https?:\/\//gi)||[]).length>1)return{valid:!1,error:"Please enter only one URL"};if(/^https?:\/\//i.test(r))try{return new URL(r),{valid:!0,url:r}}catch{return{valid:!1,error:"Invalid URL format"}}if(t==="website")return/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/.test(r)?{valid:!0,url:"https://"+r}:{valid:!1,error:"Please enter a full website URL"};if(t&&q[t]){const s=q[t];if(r.toLowerCase().includes(t.toLowerCase()+".com"))return{valid:!0,url:"https://"+r.replace(/^(https?:\/\/)?/i,"")};for(const n of s.patterns){const a=r.match(n);if(a){const o=a[a.length-1];return o.toLowerCase()===t.toLowerCase()?{valid:!1,error:`Please enter your ${t} profile URL or username`}:{valid:!0,url:s.baseUrl+o.replace(/^@/,"")}}}return{valid:!1,error:`Please enter a valid ${t} URL or username`}}return{valid:!1,error:"Invalid URL"}}function Z(){const r=[];return["website","instagram","facebook","linkedin","tiktok","youtube"].forEach(i=>{const s=e[i];if(s&&s.trim()){const n=O(s,i);n.valid?e[i]=n.url:r.push({platform:i,error:n.error})}}),r}function f(r){if(!r)return"";const t=document.createElement("div");return t.textContent=r,t.innerHTML}async function G(){try{const{data:r}=await d.from("directories").select("id, name, slug").order("display_order"),{data:t}=await d.from("sub_directories").select("id, name, slug, directory_id").order("name"),{data:i}=await d.from("creative_space_categories").select("id, name, slug").order("name"),{data:s}=await d.from("supplier_categories").select("id, name, slug").order("name");return y={directories:r||[],subDirectories:t||[],spaceCategories:i||[],supplierCategories:s||[]},y}catch(r){throw console.error("Error loading categories:",r),r}}async function Y(){try{const{data:r,error:t}=await d.from("suburbs").select("id, name").order("name");if(t)throw t;return E=r||[],E}catch(r){return console.error("Error loading suburbs:",r),[]}}async function V(r){try{const{data:t,error:i}=await d.from("members").select("*").eq("memberstack_id",r).single();if(console.log("Loaded member data:",t,i),i)throw console.error("Error loading member:",i),i;if(i)throw i;if(!t)return null;P=t;const{data:s}=await d.from("member_sub_directories").select("sub_directory_id").eq("member_id",t.id),{data:n}=await d.from("member_space_categories").select("space_category_id").eq("member_id",t.id),{data:a}=await d.from("member_supplier_categories").select("supplier_category_id").eq("member_id",t.id);if(e.firstName=t.first_name||"",e.lastName=t.last_name||"",e.email=t.email||"",e.profileImageUrl=t.profile_image_url||"",e.featureImageUrl=t.header_image_url||"",e.bio=t.bio||"",e.businessName=t.business_name||"",e.businessAddress=t.business_address||"",e.displayAddress=t.show_address||!1,e.displayOpeningHours=t.show_opening_hours||!1,t.suburb_id){const o=E.find(l=>l.id===t.suburb_id);o&&(e.suburb={id:o.id,name:o.name})}return A.forEach(o=>{e.openingHours[o.toLowerCase()]=t[`opening_${o.toLowerCase()}`]||""}),t.is_creative_space?e.spaceOrSupplier="space":t.is_supplier&&(e.spaceOrSupplier="supplier"),e.chosenDirectories=(s||[]).map(o=>o.sub_directory_id),e.spaceCategories=(n||[]).map(o=>o.space_category_id),e.supplierCategories=(a||[]).map(o=>o.supplier_category_id),e.website=t.website||"",e.instagram=t.instagram||"",e.facebook=t.facebook||"",e.linkedin=t.linkedin||"",e.tiktok=t.tiktok||"",e.youtube=t.youtube||"",t}catch(t){return console.error("Error loading member data:",t),null}}const z=3*1024*1024,L=2e3;function U(r,t,i){const s=document.getElementById(`${r}-compression-status`);s&&(s.textContent=t,s.className="ep-compression-status"+(i?` ${i}`:""))}async function Q(r,t){const i=(r.size/1024/1024).toFixed(1);return r.size<=z?(console.log(`Image ${r.name} is ${i}MB - no compression needed`),{file:r,compressed:!1,originalSize:i,finalSize:i}):(console.log(`Compressing image ${r.name} from ${i}MB...`),U(t,`Compressing image (${i}MB)...`,"compressing"),new Promise((s,n)=>{const a=new Image,o=document.createElement("canvas"),l=o.getContext("2d");a.onload=()=>{let{width:c,height:p}=a;if(c>L||p>L){const m=Math.min(L/c,L/p);c=Math.round(c*m),p=Math.round(p*m)}o.width=c,o.height=p,l.drawImage(a,0,0,c,p);const u=m=>{o.toBlob(b=>{if(!b){n(new Error("Failed to compress image"));return}const h=(b.size/1024/1024).toFixed(1);if(console.log(`Compressed to ${h}MB at quality ${m}`),b.size<=z||m<=.3){const $=new File([b],r.name,{type:"image/jpeg",lastModified:Date.now()});s({file:$,compressed:!0,originalSize:i,finalSize:h})}else u(m-.1)},"image/jpeg",m)};u(.8)},a.onerror=()=>n(new Error("Failed to load image for compression")),a.src=URL.createObjectURL(r)}))}async function D(r,t,i){try{const{file:s,compressed:n,originalSize:a,finalSize:o}=await Q(r,i);n?U(i,`Compressed from ${a}MB to ${o}MB`,"success"):U(i,"","");const{data:l}=await d.storage.from(_).list(t);if(l&&l.length>0){const b=l.filter(h=>h.name.startsWith(`${i}_`)).map(h=>`${t}/${h.name}`);if(b.length>0){const{error:h}=await d.storage.from(_).remove(b);h?console.warn("Error deleting old images:",h):console.log(`Deleted ${b.length} old ${i} image(s)`)}}const c=`${i}_${Date.now()}.jpg`,p=`${t}/${c}`,{error:u}=await d.storage.from(_).upload(p,s,{cacheControl:"3600",upsert:!0});if(u)throw u;const{data:{publicUrl:m}}=d.storage.from(_).getPublicUrl(p);return m}catch(s){throw console.error(`Error uploading ${i} image:`,s),s}}async function X(){var s,n;const r=x.id;let t=e.profileImageUrl,i=e.featureImageUrl;if(e.profileImageFile)try{t=await D(e.profileImageFile,r,"profile")}catch(a){console.error("Profile image upload failed:",a);const o=a.message||"";throw o.includes("quota")||o.includes("storage")||o.includes("limit")?new Error("STORAGE_QUOTA"):new Error("PROFILE_IMAGE_UPLOAD")}if(e.featureImageFile)try{i=await D(e.featureImageFile,r,"feature")}catch(a){console.error("Feature image upload failed:",a);const o=a.message||"";throw o.includes("quota")||o.includes("storage")||o.includes("limit")?new Error("STORAGE_QUOTA"):new Error("FEATURE_IMAGE_UPLOAD")}try{const a=e.businessName||`${e.firstName} ${e.lastName}`.trim(),o=a.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),l=!!t,c=!!i,p=e.bio&&e.bio.length>=20,u=e.chosenDirectories.length>0||e.spaceCategories.length>0||e.supplierCategories.length>0,m=!!((s=e.suburb)!=null&&s.id),b=l&&c&&p&&u&&m;console.log("Profile completion check:",{hasProfileImage:l,hasFeatureImage:c,hasBio:p,hasCategories:u,hasLocation:m,isProfileComplete:b});const h={first_name:e.firstName,last_name:e.lastName,name:a,slug:o,profile_image_url:t,header_image_url:i,bio:e.bio,business_name:e.businessName||null,suburb_id:((n=e.suburb)==null?void 0:n.id)||null,show_address:e.displayAddress,show_opening_hours:e.displayOpeningHours,opening_monday:e.openingHours.monday||null,opening_tuesday:e.openingHours.tuesday||null,opening_wednesday:e.openingHours.wednesday||null,opening_thursday:e.openingHours.thursday||null,opening_friday:e.openingHours.friday||null,opening_saturday:e.openingHours.saturday||null,opening_sunday:e.openingHours.sunday||null,website:e.website||null,instagram:e.instagram||null,facebook:e.facebook||null,linkedin:e.linkedin||null,tiktok:e.tiktok||null,youtube:e.youtube||null,is_creative_space:e.spaceOrSupplier==="space",is_supplier:e.spaceOrSupplier==="supplier",profile_complete:b},{error:$}=await d.from("members").update(h).eq("memberstack_id",r);if($)throw $;const v=P.id;if(await d.from("member_sub_directories").delete().eq("member_id",v),await d.from("member_space_categories").delete().eq("member_id",v),await d.from("member_supplier_categories").delete().eq("member_id",v),e.chosenDirectories.length>0){const k=e.chosenDirectories.map(S=>({member_id:v,sub_directory_id:S}));await d.from("member_sub_directories").insert(k)}if(e.spaceCategories.length>0){const k=e.spaceCategories.map(S=>({member_id:v,space_category_id:S}));await d.from("member_space_categories").insert(k)}if(e.supplierCategories.length>0){const k=e.supplierCategories.map(S=>({member_id:v,supplier_category_id:S}));await d.from("member_supplier_categories").insert(k)}console.log("Profile saved to Supabase successfully"),await J(v),console.log("Profile synced to Webflow successfully")}catch(a){throw console.error("Error saving profile:",a),new Error("DATABASE_SAVE")}}async function J(r){try{const{data:t,error:i}=await d.from("members").select("*").eq("id",r).single();if(i){console.warn("Failed to fetch member for Webflow sync:",i);return}const s=await fetch(`${I}/functions/v1/sync-to-webflow`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`,apikey:w},body:JSON.stringify({type:"UPDATE",table:"members",schema:"public",record:t,old_record:null})});if(s.ok)console.log("Webflow sync completed");else{const n=await s.text();console.warn("Webflow sync returned error:",s.status,n)}}catch(t){console.warn("Failed to sync to Webflow:",t)}}async function K(r,t=null){try{const i={memberstack_id:x.id,activity_type:r};t&&(i.entity_type=t.type||null,i.entity_id=t.id||null,i.entity_name=t.name||null),await fetch(`${I}/functions/v1/log-activity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`,apikey:w},body:JSON.stringify(i)})}catch(i){console.warn("Failed to log activity:",i)}}function ee(r){var n;const t=(n=x==null?void 0:x.customFields)==null?void 0:n["membership-type"],i=j(t),s=W(t);r.innerHTML=`
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" id="ep-error-banner" style="display: none;"></div>
          <div class="ep-success-banner" id="ep-success-banner" style="display: none;"></div>

          ${re()}
          ${i?te():""}
          ${ie(s)}
          ${ne()}

          <div class="ep-btn-row">
            <a href="/profile/start" class="ep-btn ep-btn-secondary" style="text-decoration: none; text-align: center;">Cancel</a>
            <button type="button" class="ep-btn" id="ep-save-btn">Save Changes</button>
          </div>
        </div>
      </div>
    `,le(r,i,s)}function re(){return`
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
            ${E.map(r=>{var t;return`<option value="${r.id}" ${((t=e.suburb)==null?void 0:t.id)===r.id?"selected":""}>${r.name}</option>`}).join("")}
          </select>
        </div>

        <div class="ep-form-field">
          <label>Public Bio <span class="required">*</span></label>
          <textarea class="ep-form-input" id="ep-bio" maxlength="2000" placeholder="Tell us about your creative practice, skills, and what you offer...">${f(e.bio)}</textarea>
          <div class="ep-char-count"><span id="ep-bio-count">${e.bio.length}</span> / 2000 characters</div>
        </div>
      </div>
    `}function te(){return`
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
            ${A.map(r=>`
              <div class="ep-hours-row">
                <span class="ep-hours-day">${r}</span>
                <input type="text" class="ep-hours-input" id="ep-hours-${r.toLowerCase()}"
                  value="${f(e.openingHours[r.toLowerCase()])}"
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
    `}function ie(r){return`
      <div class="ep-section">
        <h3 class="ep-section-title">Categories</h3>
        <p class="ep-section-description">Select the categories that best describe your work.</p>

        <div id="categories-container">
          ${r?se():ae()}
        </div>
      </div>
    `}function se(){return`
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
        ${e.spaceOrSupplier==="space"?T():""}
        ${e.spaceOrSupplier==="supplier"?F():""}
      </div>
    `}function T(){let r='<div class="ep-category-section"><div style="font-weight:600;margin-bottom:12px;">Select Space Categories</div><div class="ep-category-grid">';return y.spaceCategories.forEach(t=>{const i=e.spaceCategories.includes(t.id);r+=`
        <label class="ep-category-item ${i?"selected":""}" data-id="${t.id}">
          <input type="checkbox" value="${t.id}" ${i?"checked":""}>
          ${t.name}
        </label>
      `}),r+='</div><div class="ep-selected-count"><span id="space-count">'+e.spaceCategories.length+"</span> selected</div></div>",r}function F(){let r='<div class="ep-category-section"><div style="font-weight:600;margin-bottom:12px;">Select Supplier Categories</div><div class="ep-category-grid">';return y.supplierCategories.forEach(t=>{const i=e.supplierCategories.includes(t.id);r+=`
        <label class="ep-category-item ${i?"selected":""}" data-id="${t.id}">
          <input type="checkbox" value="${t.id}" ${i?"checked":""}>
          ${t.name}
        </label>
      `}),r+='</div><div class="ep-selected-count"><span id="supplier-count">'+e.supplierCategories.length+"</span> selected</div></div>",r}function oe(r){const t=y.subDirectories.find(i=>i.id===r);return t?t.name:r}function ae(){let r='<div class="ep-category-selector">';return r+='<div class="ep-parent-categories">',y.directories.forEach(t=>{r+=`<button type="button" class="ep-parent-btn" data-parent="${t.id}">${t.name}</button>`}),r+="</div>",y.directories.forEach(t=>{const i=y.subDirectories.filter(s=>s.directory_id===t.id);r+=`<div class="ep-child-categories" data-parent="${t.id}">`,i.forEach(s=>{const n=e.chosenDirectories.includes(s.id);r+=`<button type="button" class="ep-child-btn ${n?"selected":""}" data-id="${s.id}">${s.name}</button>`}),r+="</div>"}),r+=`
      <div class="ep-selected-categories" id="ep-selected-section" style="${e.chosenDirectories.length?"":"display: none;"}">
        <h5>Selected Categories</h5>
        <div class="ep-selected-list" id="ep-selected-list"></div>
      </div>
    </div>`,r}function ne(){return`
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
    `}function le(r,t,i){const s=r.querySelector("#ep-error-banner"),n=r.querySelector("#ep-success-banner"),a=r.querySelector("#ep-save-btn");pe(r),t&&de(r),ue(r,i),fe(r),a.addEventListener("click",async()=>{if(s.style.display="none",n.style.display="none",!e.firstName.trim()){g(s,"Please enter your first name");return}if(!e.lastName.trim()){g(s,"Please enter your last name");return}if(!e.profileImageUrl){g(s,"Please upload a profile image");return}if(!e.featureImageUrl){g(s,"Please upload a feature image");return}if(!e.suburb){g(s,"Please select your location");return}if(!e.bio.trim()){g(s,"Please enter a bio");return}if(e.bio.trim().length<20){g(s,"Please enter at least 20 characters for your bio");return}if(t&&!e.businessName.trim()){g(s,"Please enter your business name");return}if(i){if(!e.spaceOrSupplier){g(s,"Please select whether you are a Creative Space or Supplier");return}if((e.spaceOrSupplier==="space"?e.spaceCategories.length:e.supplierCategories.length)===0){g(s,"Please select at least one category");return}}else if(e.chosenDirectories.length===0){g(s,"Please select at least one category");return}const o=Z();if(o.length>0){o.forEach(({platform:l,error:c})=>{const p=r.querySelector(`#ep-${l}`),u=p.closest(".ep-link-field");let m=u.querySelector(".ep-field-error");m||(m=document.createElement("div"),m.className="ep-field-error",u.appendChild(m)),p.classList.add("error"),m.textContent=c}),g(s,"Please fix the highlighted fields before saving");return}a.disabled=!0,a.textContent="Saving...";try{await X(),await K("profile_update"),n.textContent="Profile updated successfully!",n.style.display="block",n.scrollIntoView({behavior:"smooth",block:"center"}),a.textContent="Save Changes",a.disabled=!1}catch(l){console.error("Save error:",l);let c="An error occurred while saving. Please try again.";l.message==="STORAGE_QUOTA"?c="Unable to upload images - storage limit reached. Please contact support.":l.message==="PROFILE_IMAGE_UPLOAD"?c="Failed to upload profile image. Please try a smaller image or try again.":l.message==="FEATURE_IMAGE_UPLOAD"?c="Failed to upload feature image. Please try a smaller image or try again.":l.message==="DATABASE_SAVE"&&(c="Failed to save profile data. Please try again."),g(s,c),a.textContent="Save Changes",a.disabled=!1}})}function pe(r){const t=r.querySelector("#ep-first-name"),i=r.querySelector("#ep-last-name"),s=r.querySelector("#ep-bio"),n=r.querySelector("#ep-bio-count"),a=r.querySelector("#ep-suburb-select");t.addEventListener("input",()=>{e.firstName=t.value}),i.addEventListener("input",()=>{e.lastName=i.value}),s.addEventListener("input",()=>{e.bio=s.value,n.textContent=s.value.length}),a.addEventListener("change",()=>{const o=a.options[a.selectedIndex];o.value?e.suburb={id:o.value,name:o.text.split(",")[0].trim()}:e.suburb=null}),ce(r)}function ce(r){const t=r.querySelector("#profile-upload"),i=r.querySelector("#feature-upload");function s(){e.profileImageUrl?(t.innerHTML=`
          <img src="${e.profileImageUrl}" class="ep-image-preview profile" alt="Profile preview">
          <button type="button" class="ep-image-remove" data-remove="profile">&times;</button>
        `,t.classList.add("has-image")):(t.innerHTML=`
          <input type="file" accept="image/*" id="profile-file-input">
          <div class="ep-image-upload-text">
            <strong>Click to upload</strong><br>
            Square image recommended
          </div>
        `,t.classList.remove("has-image"),t.querySelector("#profile-file-input").addEventListener("change",a))}function n(){e.featureImageUrl?(i.innerHTML=`
          <img src="${e.featureImageUrl}" class="ep-image-preview" alt="Feature preview">
          <button type="button" class="ep-image-remove" data-remove="feature">&times;</button>
        `,i.classList.add("has-image")):(i.innerHTML=`
          <input type="file" accept="image/*" id="feature-file-input">
          <div class="ep-image-upload-text">
            <strong>Click to upload</strong><br>
            Landscape image recommended
          </div>
        `,i.classList.remove("has-image"),i.querySelector("#feature-file-input").addEventListener("change",o))}function a(p){const u=p.target.files[0];u&&(e.profileImageFile=u,e.profileImageUrl=URL.createObjectURL(u),s())}function o(p){const u=p.target.files[0];u&&(e.featureImageFile=u,e.featureImageUrl=URL.createObjectURL(u),n())}const l=t.querySelector("#profile-file-input"),c=i.querySelector("#feature-file-input");l&&l.addEventListener("change",a),c&&c.addEventListener("change",o),t.addEventListener("click",p=>{p.target.dataset.remove==="profile"&&(p.stopPropagation(),e.profileImageUrl="",e.profileImageFile=null,s())}),i.addEventListener("click",p=>{p.target.dataset.remove==="feature"&&(p.stopPropagation(),e.featureImageUrl="",e.featureImageFile=null,n())})}function de(r){const t=r.querySelector("#ep-business-name"),i=r.querySelector("#ep-address"),s=r.querySelector("#ep-display-address"),n=r.querySelector("#ep-display-hours");t&&t.addEventListener("input",()=>{e.businessName=t.value}),i&&i.addEventListener("input",()=>{e.businessAddress=i.value}),s&&s.addEventListener("change",()=>{e.displayAddress=s.checked}),n&&n.addEventListener("change",()=>{e.displayOpeningHours=n.checked}),A.forEach(a=>{const o=r.querySelector(`#ep-hours-${a.toLowerCase()}`);o&&o.addEventListener("input",()=>{e.openingHours[a.toLowerCase()]=o.value})})}function ue(r,t){if(t){const i=r.querySelector("#radio-space"),s=r.querySelector("#radio-supplier"),n=r.querySelector("#space-supplier-categories");i&&i.addEventListener("click",()=>{e.spaceOrSupplier="space",e.supplierCategories=[],i.classList.add("selected"),s.classList.remove("selected"),n.innerHTML=T(),n.style.display="block",C(r,"spaceCategories","space-count")}),s&&s.addEventListener("click",()=>{e.spaceOrSupplier="supplier",e.spaceCategories=[],s.classList.add("selected"),i.classList.remove("selected"),n.innerHTML=F(),n.style.display="block",C(r,"supplierCategories","supplier-count")}),e.spaceOrSupplier==="space"?C(r,"spaceCategories","space-count"):e.spaceOrSupplier==="supplier"&&C(r,"supplierCategories","supplier-count")}else me(r)}function me(r){const t=r.querySelectorAll(".ep-parent-btn"),i=r.querySelectorAll(".ep-child-categories"),s=r.querySelector("#ep-selected-list"),n=r.querySelector("#ep-selected-section");function a(){!s||!n||(s.innerHTML=e.chosenDirectories.map(o=>`<span class="ep-selected-tag">${oe(o)}<button type="button" data-id="${o}">&times;</button></span>`).join(""),n.style.display=e.chosenDirectories.length?"":"none",r.querySelectorAll(".ep-child-btn").forEach(o=>{const l=o.dataset.id;o.classList.toggle("selected",e.chosenDirectories.includes(l))}))}a(),t.forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.parent,c=o.classList.contains("active");t.forEach(p=>p.classList.remove("active")),i.forEach(p=>p.classList.remove("visible")),c||(o.classList.add("active"),r.querySelector(`.ep-child-categories[data-parent="${l}"]`).classList.add("visible"))})}),r.querySelectorAll(".ep-child-btn").forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.id,c=e.chosenDirectories.indexOf(l);c===-1?e.chosenDirectories.push(l):e.chosenDirectories.splice(c,1),a()})}),s&&s.addEventListener("click",o=>{if(o.target.tagName==="BUTTON"){const l=o.target.dataset.id,c=e.chosenDirectories.indexOf(l);c!==-1&&(e.chosenDirectories.splice(c,1),a())}})}function C(r,t,i){r.querySelectorAll(".ep-category-item").forEach(s=>{s.addEventListener("click",n=>{n.preventDefault();const a=s.dataset.id;if(!a)return;const o=e[t].indexOf(a);o===-1?(e[t].push(a),s.classList.add("selected")):(e[t].splice(o,1),s.classList.remove("selected"));const l=r.querySelector("#"+i);l&&(l.textContent=e[t].length)})})}function fe(r){["website","instagram","facebook","linkedin","tiktok","youtube"].forEach(i=>{const s=r.querySelector(`#ep-${i}`);if(!s)return;const n=s.closest(".ep-link-field");let a=n.querySelector(".ep-field-error");a||(a=document.createElement("div"),a.className="ep-field-error",a.style.cssText="grid-column: 2;",n.appendChild(a)),s.addEventListener("input",()=>{e[i]=s.value,s.classList.remove("error"),a.textContent=""}),s.addEventListener("blur",()=>{const o=s.value.trim();if(!o){s.classList.remove("error"),a.textContent="";return}const l=O(o,i);l.valid?(l.url!==o&&(s.value=l.url,e[i]=l.url),s.classList.remove("error"),a.textContent=""):(s.classList.add("error"),a.textContent=l.error)})})}function g(r,t){r.textContent=t,r.style.display="block",r.scrollIntoView({behavior:"smooth",block:"center"})}function ge(r){r.innerHTML=`
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
    `}function be(r,t){r.innerHTML=`
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" style="display: block;">${t}</div>
        </div>
      </div>
    `}async function N(){const r=document.querySelector(".all-types-profile-edit")||document.querySelector(".supabase-edit-profile-container");if(!r){console.warn("Could not find edit profile container");return}const t=document.createElement("style");t.textContent=B,document.head.appendChild(t),r.innerHTML='<div class="ep-loading">Loading your profile...</div>';try{await R(),d=window.supabase.createClient(I,w);const{data:i}=await window.$memberstackDom.getCurrentMember();if(!i){ge(r);return}x=i,await G(),await Y(),await V(i.id),ee(r)}catch(i){console.error("Init error:",i),be(r,"Error loading profile. Please refresh the page.")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",N):N()})();
