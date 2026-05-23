(function(){console.log("Member onboarding Supabase script loaded");const z="https://epszwomtxkpjegbjbixr.supabase.co",A="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",T="member-images",te=["small-business","large-business","not-for-profit","partner","spaces-suppliers"],re="spaces-suppliers";let g=null,f=1,H=5,u=null,O=null,k={directories:[],subDirectories:[],spaceCategories:[],supplierCategories:[]},E=[],s={profileImageUrl:null,profileImageFile:null,featureImageUrl:null,featureImageFile:null,bio:"",businessName:"",suburb:null,spaceOrSupplier:null,chosenDirectories:[],spaceCategories:[],supplierCategories:[],businessAddress:"",displayAddress:!1,openingHours:{monday:"",tuesday:"",wednesday:"",thursday:"",friday:"",saturday:"",sunday:""},displayOpeningHours:!1,website:"",instagram:"",facebook:"",linkedin:"",tiktok:"",youtube:""};const M=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],ie=`
    .ms-container {
      font-family: inherit;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
    }
    .ms-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .ms-header h2 {
      margin: 0 0 8px 0;
      font-size: 28px;
      color: #333;
    }
    .ms-header p {
      margin: 0;
      color: #666;
      font-size: 16px;
      line-height: 1.5;
    }
    .ms-progress {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 32px;
    }
    .ms-progress-step {
      width: 40px;
      height: 4px;
      background: #e0e0e0;
      border-radius: 2px;
      transition: background 0.3s;
    }
    .ms-progress-step.active {
      background: #333;
    }
    .ms-progress-step.completed {
      background: #28a745;
    }
    .ms-form {
      background: #fff;
      border-radius: 8px;
      padding: 32px;
      border: 1px solid #e0e0e0;
    }
    @media (max-width: 600px) {
      .ms-form {
        padding: 24px 16px;
      }
    }
    .ms-step-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }
    .ms-step-description {
      font-size: 14px;
      color: #666;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }
    .ms-form-field {
      margin-bottom: 20px;
    }
    .ms-form-field label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      text-align: left;
    }
    .ms-form-field label span.required {
      color: #dc3545;
    }
    .ms-form-field .ms-hint {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    .ms-form-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .ms-form-input:focus {
      outline: none;
      border-color: #333;
    }
    .ms-form-input.error {
      border-color: #dc3545;
    }
    textarea.ms-form-input {
      min-height: 120px;
      resize: vertical;
    }
    .ms-image-upload {
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      position: relative;
    }
    .ms-image-upload:hover {
      border-color: #999;
      background: #fafafa;
    }
    .ms-image-upload.has-image {
      padding: 0;
      border-style: solid;
    }
    .ms-image-upload input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
    .ms-image-upload-text {
      color: #666;
      font-size: 14px;
    }
    .ms-image-upload-text strong {
      color: #333;
    }
    .ms-image-preview {
      width: 100%;
      max-height: 200px;
      object-fit: cover;
      border-radius: 6px;
    }
    .ms-image-preview.profile {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: 0 auto;
      display: block;
    }
    .ms-image-remove {
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
    .ms-image-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 600px) {
      .ms-image-row {
        grid-template-columns: 1fr;
      }
    }
    .ms-category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 8px;
    }
    .ms-category-item {
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
    .ms-category-item:hover {
      background: #f5f5f5;
    }
    .ms-category-item.selected {
      background: #333;
      color: #fff;
      border-color: #333;
    }
    .ms-category-item input {
      display: none;
    }
    .ms-radio-group {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }
    .ms-radio-item {
      flex: 1;
      padding: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    .ms-radio-item:hover {
      border-color: #999;
    }
    .ms-radio-item.selected {
      border-color: #333;
      background: #f5f5f5;
    }
    .ms-radio-item input {
      display: none;
    }
    .ms-radio-item-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }
    .ms-radio-item-desc {
      font-size: 12px;
      color: #666;
    }
    .ms-hours-grid {
      display: grid;
      gap: 12px;
    }
    .ms-hours-row {
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 12px;
      align-items: center;
    }
    .ms-hours-day {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    .ms-hours-input {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
    }
    .ms-toggle-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .ms-toggle-label {
      font-size: 14px;
      color: #333;
    }
    .ms-toggle {
      position: relative;
      width: 48px;
      height: 26px;
    }
    .ms-toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .ms-toggle-slider {
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
    .ms-toggle-slider:before {
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
    .ms-toggle input:checked + .ms-toggle-slider {
      background-color: #333;
    }
    .ms-toggle input:checked + .ms-toggle-slider:before {
      transform: translateX(22px);
    }
    .ms-links-grid {
      display: grid;
      gap: 16px;
    }
    .ms-link-field {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 12px;
      align-items: center;
    }
    .ms-link-label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    .ms-btn-row {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
    .ms-btn {
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
    .ms-btn:hover {
      background: #555;
    }
    .ms-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .ms-btn-secondary {
      background: #fff;
      color: #333;
      border: 1px solid #333;
    }
    .ms-btn-secondary:hover {
      background: #f5f5f5;
    }
    .ms-loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .ms-error-banner {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .ms-char-count {
      font-size: 12px;
      color: #666;
      text-align: right;
      margin-top: 4px;
    }
    .ms-selected-count {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }
    .ms-parent-categories {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
    .ms-parent-btn {
      padding: 8px 16px;
      border: 1px solid #333;
      border-radius: 20px;
      background: #fff;
      color: #333;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }
    .ms-parent-btn:hover {
      background: #f5f5f5;
    }
    .ms-parent-btn.active {
      background: #333;
      color: #fff;
    }
    .ms-child-categories {
      display: none;
      flex-wrap: wrap;
      gap: 8px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .ms-child-categories.visible {
      display: flex;
    }
    .ms-child-btn {
      padding: 6px 14px;
      border: 1px solid #ddd;
      border-radius: 16px;
      background: #fff;
      color: #333;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
    }
    .ms-child-btn:hover {
      border-color: #999;
    }
    .ms-child-btn.selected {
      border-color: #007bff;
      color: #007bff;
    }
    .ms-selected-categories {
      margin-top: 16px;
      padding: 12px;
      background: #f0f0f0;
      border-radius: 8px;
    }
    .ms-selected-categories h5 {
      margin: 0 0 8px 0;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
    }
    .ms-selected-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .ms-selected-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #333;
      color: #fff;
      border-radius: 12px;
      font-size: 12px;
    }
    .ms-selected-tag button {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 0;
      font-size: 14px;
      line-height: 1;
    }
    .ms-suburb-search {
      position: relative;
    }
    .ms-suburb-dropdown {
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
    .ms-suburb-dropdown.visible {
      display: block;
    }
    .ms-suburb-option {
      padding: 10px 14px;
      cursor: pointer;
      font-size: 14px;
    }
    .ms-suburb-option:hover {
      background: #f5f5f5;
    }
    .ms-field-error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }
    .ms-slug-status {
      display: none;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      margin-top: 6px;
      padding: 6px 10px;
      border-radius: 4px;
    }
    .ms-slug-status.available {
      display: flex;
      background: #d4edda;
      color: #155724;
    }
    .ms-slug-status.taken {
      display: flex;
      background: #f8d7da;
      color: #721c24;
    }
    .ms-slug-status.checking {
      display: flex;
      background: #fff3cd;
      color: #856404;
    }
    .ms-slug-status.invalid {
      display: flex;
      background: #f8d7da;
      color: #721c24;
    }
    .ms-slug-preview {
      font-size: 11px;
      color: #666;
      margin-top: 4px;
    }
    /* Loading animation styles */
    .ms-loading-screen {
      text-align: center;
      padding: 60px 32px;
    }
    .ms-loading-spinner {
      width: 48px;
      height: 48px;
      border: 3px solid #e0e0e0;
      border-top-color: #333;
      border-radius: 50%;
      animation: ms-spin 0.8s linear infinite;
      margin: 0 auto 24px;
    }
    @keyframes ms-spin {
      to { transform: rotate(360deg); }
    }
    .ms-loading-steps {
      max-width: 300px;
      margin: 0 auto;
      text-align: left;
    }
    .ms-loading-step {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      color: #999;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    .ms-loading-step.active {
      color: #333;
    }
    .ms-loading-step.complete {
      color: #28a745;
    }
    .ms-loading-step-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      flex-shrink: 0;
      background: #e0e0e0;
      color: #999;
      transition: all 0.3s ease;
    }
    .ms-loading-step.active .ms-loading-step-icon {
      background: #333;
      color: #fff;
    }
    .ms-loading-step.complete .ms-loading-step-icon {
      background: #28a745;
      color: #fff;
    }
    .ms-success-screen {
      text-align: center;
      padding: 60px 32px;
      animation: ms-fade-in 0.5s ease;
    }
    @keyframes ms-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .ms-success-icon {
      width: 80px;
      height: 80px;
      background: #28a745;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 40px;
      color: #fff;
    }
    .ms-success-title {
      font-size: 28px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }
    .ms-success-subtitle {
      color: #666;
      font-size: 16px;
      margin: 0 0 32px 0;
    }
    .ms-success-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .ms-success-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 28px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      min-width: 200px;
    }
    .ms-success-btn-primary {
      background: #333;
      color: #fff;
      border: 2px solid #333;
    }
    .ms-success-btn-primary:hover {
      background: #555;
      border-color: #555;
    }
    .ms-success-btn-secondary {
      background: #fff;
      color: #333;
      border: 2px solid #333;
    }
    .ms-success-btn-secondary:hover {
      background: #f5f5f5;
    }
  `;function oe(){return new Promise((e,t)=>{let o=0;const r=50,a=setInterval(()=>{o++,window.$memberstackDom&&window.supabase?(clearInterval(a),e()):o>=r&&(clearInterval(a),t(new Error("Dependencies not loaded (Memberstack or Supabase)")))},100)})}function N(e){return te.includes(e)}function ae(e){return e===re}function ne(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").replace(/-+/g,"-")}async function le(e,t=null){if(!e||e.length<3)return{available:!1,error:"Slug must be at least 3 characters"};try{let o=g.from("members").select("id, slug").eq("slug",e);t&&(o=o.neq("id",t));const{data:r,error:a}=await o;return a?(console.error("Error checking slug:",a),{available:!0}):{available:!r||r.length===0,error:r&&r.length>0?"This name is already taken":null}}catch(o){return console.error("Error checking slug:",o),{available:!0}}}const D={instagram:{baseUrl:"https://www.instagram.com/",patterns:[/instagram\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},facebook:{baseUrl:"https://www.facebook.com/",patterns:[/facebook\.com\/([^\/\?]+)/i,/^([a-zA-Z0-9.]+)$/]},linkedin:{baseUrl:"https://www.linkedin.com/in/",patterns:[/linkedin\.com\/(in|company)\/([^\/\?]+)/i,/^([a-zA-Z0-9-]+)$/]},tiktok:{baseUrl:"https://www.tiktok.com/@",patterns:[/tiktok\.com\/@?([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},youtube:{baseUrl:"https://www.youtube.com/",patterns:[/youtube\.com\/(channel|c|user|@)\/([^\/\?]+)/i,/youtube\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9_-]+)$/]}};function B(e,t=null){if(!e||!e.trim())return{valid:!0,url:""};if(e=e.trim(),e.includes(" "))return{valid:!1,error:"Please enter only one URL (no spaces)"};if((e.match(/https?:\/\//gi)||[]).length>1)return{valid:!1,error:"Please enter only one URL"};if(/^https?:\/\//i.test(e))try{return new URL(e),{valid:!0,url:e}}catch{return{valid:!1,error:"Invalid URL format"}}if(t==="website")return/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/.test(e)?{valid:!0,url:"https://"+e}:{valid:!1,error:"Please enter a full website URL (e.g., https://example.com)"};if(t&&D[t]){const r=D[t];if(e.toLowerCase().includes(t.toLowerCase()+".com"))return{valid:!0,url:"https://"+e.replace(/^(https?:\/\/)?/i,"")};for(const a of r.patterns){const n=e.match(a);if(n){const i=n[n.length-1];return i.toLowerCase()===t.toLowerCase()?{valid:!1,error:`Please enter your ${t} profile URL or username`}:{valid:!0,url:r.baseUrl+i.replace(/^@/,"")}}}return{valid:!1,error:`Please enter a valid ${t} URL or username`}}return{valid:!1,error:"Invalid URL"}}function de(){const e=[];return["website","instagram","facebook","linkedin","tiktok","youtube"].forEach(o=>{const r=s[o];if(r&&r.trim()){const a=B(r,o);a.valid?s[o]=a.url:e.push({platform:o,error:a.error})}}),e}async function ce(){try{const{data:e,error:t}=await g.from("directories").select("id, name, slug").order("display_order");if(t)throw t;const{data:o,error:r}=await g.from("sub_directories").select("id, name, slug, directory_id").order("name");if(r)throw r;const{data:a,error:n}=await g.from("creative_space_categories").select("id, name, slug").order("name");if(n)throw n;const{data:i,error:l}=await g.from("supplier_categories").select("id, name, slug").order("name");if(l)throw l;return k={directories:e||[],subDirectories:o||[],spaceCategories:a||[],supplierCategories:i||[]},k}catch(e){throw console.error("Error loading categories:",e),e}}async function pe(){try{const{data:e,error:t}=await g.from("suburbs").select("id, name, webflow_id").order("name");if(t)throw t;return E=e||[],E}catch(e){return console.error("Error loading suburbs:",e),[]}}async function ue(e){if(!e)return null;try{const{data:t,error:o}=await g.from("membership_types").select("id").eq("slug",e).single();return o||!t?(console.warn("Membership type not found for slug:",e),null):t.id}catch(t){return console.error("Error looking up membership type:",t),null}}async function me(e,t){if(!e)return null;let o=e,r=1;for(;;){const{data:a,error:n}=await g.from("members").select("memberstack_id").eq("slug",o).maybeSingle();if(n)return console.error("Error checking slug:",n),o;if(!a||a.memberstack_id===t)return o;r++,o=`${e}-${r}`,console.log(`Slug conflict, trying: ${o}`)}}const R=3*1024*1024,F=2e3;async function ge(e){return e.size<=R?(console.log(`Image ${e.name} is ${(e.size/1024/1024).toFixed(2)}MB - no compression needed`),e):(console.log(`Compressing image ${e.name} from ${(e.size/1024/1024).toFixed(2)}MB...`),new Promise((t,o)=>{const r=new Image,a=document.createElement("canvas"),n=a.getContext("2d");r.onload=()=>{let{width:i,height:l}=r;if(i>F||l>F){const c=Math.min(F/i,F/l);i=Math.round(i*c),l=Math.round(l*c)}a.width=i,a.height=l,n.drawImage(r,0,0,i,l);const d=c=>{a.toBlob(p=>{if(!p){o(new Error("Failed to compress image"));return}if(console.log(`Compressed to ${(p.size/1024/1024).toFixed(2)}MB at quality ${c}`),p.size<=R||c<=.3){const m=new File([p],e.name,{type:"image/jpeg",lastModified:Date.now()});t(m)}else d(c-.1)},"image/jpeg",c)};d(.8)},r.onerror=()=>o(new Error("Failed to load image for compression")),r.src=URL.createObjectURL(e)}))}async function $(e,t,o){try{const r=await ge(e),{data:a}=await g.storage.from(T).list(t);if(a&&a.length>0){const c=a.filter(p=>p.name.startsWith(`${o}_`)).map(p=>`${t}/${p.name}`);if(c.length>0){const{error:p}=await g.storage.from(T).remove(c);p?console.warn("Error deleting old images:",p):console.log(`Deleted ${c.length} old ${o} image(s)`)}}const n=`${o}_${Date.now()}.jpg`,i=`${t}/${n}`,{error:l}=await g.storage.from(T).upload(i,r,{cacheControl:"3600",upsert:!0});if(l)throw l;const{data:{publicUrl:d}}=g.storage.from(T).getPublicUrl(i);return d}catch(r){throw console.error(`Error uploading ${o} image:`,r),r}}async function L(e){var t;if(!(!(u!=null&&u.id)||!g))try{const o=u.id,r={onboarding_step:e,onboarding_started_at:new Date().toISOString()};if(s.profileImageFile){const n=await $(s.profileImageFile,o,"profile");r.profile_image_url=n,s.profileImageUrl=n,s.profileImageFile=null}else s.profileImageUrl&&(r.profile_image_url=s.profileImageUrl);if(s.featureImageFile){const n=await $(s.featureImageFile,o,"feature");r.header_image_url=n,s.featureImageUrl=n,s.featureImageFile=null}else s.featureImageUrl&&(r.header_image_url=s.featureImageUrl);s.bio&&(r.bio=s.bio),s.businessName&&(r.business_name=s.businessName),(t=s.suburb)!=null&&t.id&&(r.suburb_id=s.suburb.id),s.businessAddress&&(r.business_address=s.businessAddress),r.show_address=s.displayAddress,r.show_opening_hours=s.displayOpeningHours,s.openingHours.monday&&(r.opening_monday=s.openingHours.monday),s.openingHours.tuesday&&(r.opening_tuesday=s.openingHours.tuesday),s.openingHours.wednesday&&(r.opening_wednesday=s.openingHours.wednesday),s.openingHours.thursday&&(r.opening_thursday=s.openingHours.thursday),s.openingHours.friday&&(r.opening_friday=s.openingHours.friday),s.openingHours.saturday&&(r.opening_saturday=s.openingHours.saturday),s.openingHours.sunday&&(r.opening_sunday=s.openingHours.sunday),s.website&&(r.website=s.website),s.instagram&&(r.instagram=s.instagram),s.facebook&&(r.facebook=s.facebook),s.linkedin&&(r.linkedin=s.linkedin),s.tiktok&&(r.tiktok=s.tiktok),s.youtube&&(r.youtube=s.youtube);const{error:a}=await g.from("members").update(r).eq("memberstack_id",o);a?console.warn("Error saving progress:",a):console.log(`Progress saved at step ${e}`)}catch(o){console.warn("Error saving progress:",o)}}async function fe(){if(!(u!=null&&u.id)||!g)return null;try{const{data:e,error:t}=await g.from("members").select("*").eq("memberstack_id",u.id).single();if(t||!e)return null;if(e.onboarding_step&&e.onboarding_step>0){if(console.log("Restoring progress from step",e.onboarding_step),e.profile_image_url&&(s.profileImageUrl=e.profile_image_url),e.header_image_url&&(s.featureImageUrl=e.header_image_url),e.bio&&(s.bio=e.bio),e.business_name&&(s.businessName=e.business_name),e.suburb_id){const i=E.find(l=>l.id===e.suburb_id);i&&(s.suburb={id:i.id,name:i.name})}e.business_address&&(s.businessAddress=e.business_address),s.displayAddress=e.show_address||!1,s.displayOpeningHours=e.show_opening_hours||!1,s.openingHours={monday:e.opening_monday||"",tuesday:e.opening_tuesday||"",wednesday:e.opening_wednesday||"",thursday:e.opening_thursday||"",friday:e.opening_friday||"",saturday:e.opening_saturday||"",sunday:e.opening_sunday||""},e.website&&(s.website=e.website),e.instagram&&(s.instagram=e.instagram),e.facebook&&(s.facebook=e.facebook),e.linkedin&&(s.linkedin=e.linkedin),e.tiktok&&(s.tiktok=e.tiktok),e.youtube&&(s.youtube=e.youtube),e.is_creative_space?s.spaceOrSupplier="space":e.is_supplier&&(s.spaceOrSupplier="supplier");const o=e.id,{data:r}=await g.from("member_sub_directories").select("sub_directory_id").eq("member_id",o);r&&(s.chosenDirectories=r.map(i=>i.sub_directory_id));const{data:a}=await g.from("member_space_categories").select("space_category_id").eq("member_id",o);a&&(s.spaceCategories=a.map(i=>i.space_category_id));const{data:n}=await g.from("member_supplier_categories").select("supplier_category_id").eq("member_id",o);return n&&(s.supplierCategories=n.map(i=>i.supplier_category_id)),e.onboarding_step}return null}catch(e){return console.warn("Error loading saved progress:",e),null}}async function be(){var t,o,r,a,n,i,l,d;const e=u.id;try{let c=s.profileImageUrl,p=s.featureImageUrl;s.profileImageFile&&(c=await $(s.profileImageFile,e,"profile")),s.featureImageFile&&(p=await $(s.featureImageFile,e,"feature"));const m=(t=u==null?void 0:u.customFields)==null?void 0:t["membership-type"],b=await ue(m);console.log("Membership type:",m,"-> ID:",b);const h=["small-business","large-business","not-for-profit","partner","spaces-suppliers"],v=(m==null?void 0:m.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""))||"",w=h.includes(v)&&s.businessName,S=`${((o=u.customFields)==null?void 0:o["first-name"])||""} ${((r=u.customFields)==null?void 0:r["last-name"])||""}`.trim(),_=w?s.businessName:S||s.businessName||"member",He=_.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),Z=await me(He,e);console.log("Slug generation:",{membershipType:m,useBusinessName:w,displayName:_,slug:Z});const G=!!c,X=!!p,V=s.bio&&s.bio.length>=50,J=s.chosenDirectories.length>0||s.spaceCategories.length>0||s.supplierCategories.length>0,Q=!!((a=s.suburb)!=null&&a.id),K=G&&X&&V&&J&&Q;console.log("Profile completion check:",{hasProfileImage:G,hasFeatureImage:X,hasBio:V,hasCategories:J,hasLocation:Q,isProfileComplete:K});const Me={membership_type_id:b,profile_image_url:c,header_image_url:p,bio:s.bio,slug:Z,name:_,business_name:s.businessName||null,suburb_id:((n=s.suburb)==null?void 0:n.id)||null,business_address:s.businessAddress||null,show_address:s.displayAddress,show_opening_hours:s.displayOpeningHours,opening_monday:s.openingHours.monday||null,opening_tuesday:s.openingHours.tuesday||null,opening_wednesday:s.openingHours.wednesday||null,opening_thursday:s.openingHours.thursday||null,opening_friday:s.openingHours.friday||null,opening_saturday:s.openingHours.saturday||null,opening_sunday:s.openingHours.sunday||null,website:s.website||null,instagram:s.instagram||null,facebook:s.facebook||null,linkedin:s.linkedin||null,tiktok:s.tiktok||null,youtube:s.youtube||null,is_creative_space:s.spaceOrSupplier==="space",is_supplier:s.spaceOrSupplier==="supplier",profile_complete:K},{data:ee,error:se}=await g.from("members").upsert({memberstack_id:e,email:(i=u.auth)==null?void 0:i.email,first_name:((l=u.customFields)==null?void 0:l["first-name"])||null,last_name:((d=u.customFields)==null?void 0:d["last-name"])||null,...Me},{onConflict:"memberstack_id"}).select().single();if(se)throw se;const C=ee.id;if(await g.from("member_sub_directories").delete().eq("member_id",C),await g.from("member_space_categories").delete().eq("member_id",C),await g.from("member_supplier_categories").delete().eq("member_id",C),s.chosenDirectories.length>0){const q=s.chosenDirectories.map(U=>({member_id:C,sub_directory_id:U}));await g.from("member_sub_directories").insert(q)}if(s.spaceCategories.length>0){const q=s.spaceCategories.map(U=>({member_id:C,space_category_id:U}));await g.from("member_space_categories").insert(q)}if(s.supplierCategories.length>0){const q=s.supplierCategories.map(U=>({member_id:C,supplier_category_id:U}));await g.from("member_supplier_categories").insert(q)}return await window.$memberstackDom.updateMember({customFields:{"onboarding-complete":"true"}}),console.log("Onboarding data saved to Supabase successfully"),await ye(C),console.log("Onboarding data synced to Webflow successfully"),ee}catch(c){throw console.error("Error saving onboarding data:",c),c}}async function ye(e){try{const{data:t,error:o}=await g.from("members").select("*").eq("id",e).single();if(o){console.warn("Failed to fetch member for Webflow sync:",o);return}const r=await fetch(`${z}/functions/v1/sync-to-webflow`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${A}`,apikey:A},body:JSON.stringify({type:"UPDATE",table:"members",schema:"public",record:t,old_record:null})});if(r.ok)console.log("Webflow sync completed");else{const a=await r.text();console.warn("Webflow sync returned error:",r.status,a)}}catch(t){console.warn("Failed to sync to Webflow:",t)}}function I(e){var o;(o=u==null?void 0:u.customFields)==null||o["membership-type"],H=5;let t='<div class="ms-progress">';for(let r=1;r<=H;r++){let a="ms-progress-step";r<f&&(a+=" completed"),r===f&&(a+=" active"),t+=`<div class="${a}"></div>`}return t+="</div>",t}function he(e){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Let's set up your public profile. This should only take a few minutes.</p>
        </div>
        ${I()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 1: Profile Images</h3>
          <p class="ms-step-description">Upload images that will appear on your public profile.</p>

          <div class="ms-image-row">
            <div class="ms-form-field">
              <label>Profile Image <span class="required">*</span></label>
              <div class="ms-image-upload" id="profile-upload">
                <input type="file" accept="image/*" id="profile-file-input">
                <div class="ms-image-upload-text" id="profile-upload-text">
                  <strong>Click to upload</strong><br>
                  Square image recommended
                </div>
              </div>
              <div class="ms-hint">This will be your profile photo</div>
            </div>

            <div class="ms-form-field">
              <label>Feature Image <span class="required">*</span></label>
              <div class="ms-image-upload" id="feature-upload">
                <input type="file" accept="image/*" id="feature-file-input">
                <div class="ms-image-upload-text" id="feature-upload-text">
                  <strong>Click to upload</strong><br>
                  Landscape image recommended
                </div>
              </div>
              <div class="ms-hint">This appears as the header on your profile page</div>
            </div>
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `,ve(e)}function ve(e){const t=e.querySelector("#profile-upload"),o=e.querySelector("#feature-upload"),r=e.querySelector("#profile-file-input"),a=e.querySelector("#feature-file-input"),n=e.querySelector("#ms-next-btn"),i=e.querySelector("#ms-error-banner");function l(){s.profileImageUrl?(t.innerHTML=`
          <img src="${s.profileImageUrl}" class="ms-image-preview profile" alt="Profile preview">
          <button type="button" class="ms-image-remove" data-remove="profile">&times;</button>
        `,t.classList.add("has-image")):(t.innerHTML=`
          <input type="file" accept="image/*" id="profile-file-input">
          <div class="ms-image-upload-text">
            <strong>Click to upload</strong><br>
            Square image recommended
          </div>
        `,t.classList.remove("has-image"),t.querySelector("#profile-file-input").addEventListener("change",c))}function d(){s.featureImageUrl?(o.innerHTML=`
          <img src="${s.featureImageUrl}" class="ms-image-preview" alt="Feature preview">
          <button type="button" class="ms-image-remove" data-remove="feature">&times;</button>
        `,o.classList.add("has-image")):(o.innerHTML=`
          <input type="file" accept="image/*" id="feature-file-input">
          <div class="ms-image-upload-text">
            <strong>Click to upload</strong><br>
            Landscape image recommended
          </div>
        `,o.classList.remove("has-image"),o.querySelector("#feature-file-input").addEventListener("change",p))}async function c(m){const b=m.target.files[0];if(b){s.profileImageFile=b,s.profileImageUrl=URL.createObjectURL(b),l(),i.style.display="none";try{const h=await $(b,u.id,"profile");s.profileImageUrl=h,s.profileImageFile=null,l(),await L(1),console.log("Profile image auto-saved")}catch(h){console.error("Auto-save profile image failed:",h)}}}async function p(m){const b=m.target.files[0];if(b){s.featureImageFile=b,s.featureImageUrl=URL.createObjectURL(b),d(),i.style.display="none";try{const h=await $(b,u.id,"feature");s.featureImageUrl=h,s.featureImageFile=null,d(),await L(1),console.log("Feature image auto-saved")}catch(h){console.error("Auto-save feature image failed:",h)}}}r.addEventListener("change",c),a.addEventListener("change",p),t.addEventListener("click",m=>{m.target.dataset.remove==="profile"&&(m.stopPropagation(),s.profileImageUrl=null,s.profileImageFile=null,l())}),o.addEventListener("click",m=>{m.target.dataset.remove==="feature"&&(m.stopPropagation(),s.featureImageUrl=null,s.featureImageFile=null,d())}),l(),d(),n.addEventListener("click",async()=>{if(!s.profileImageUrl){y(i,"Please upload a profile image");return}if(!s.featureImageUrl){y(i,"Please upload a feature image");return}f=2,await L(f),x(e)})}function xe(e){var r;const t=(r=u==null?void 0:u.customFields)==null?void 0:r["membership-type"],o=N(t);e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Tell us about yourself${o?" and your business":""}.</p>
        </div>
        ${I()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 2: About You</h3>
          <p class="ms-step-description">This information will be displayed on your public profile.</p>

          ${o?`
            <div class="ms-form-field">
              <label>Business / Trading Name <span class="required">*</span></label>
              <input type="text" class="ms-form-input" id="ms-business-name" value="${s.businessName}" placeholder="Enter your business or trading name">
              <div class="ms-slug-preview" id="ms-slug-preview"></div>
              <div class="ms-slug-status" id="ms-slug-status">
                <span class="ms-slug-icon"></span>
                <span class="ms-slug-message"></span>
              </div>
            </div>
          `:""}

          <div class="ms-form-field">
            <label>Bio <span class="required">*</span></label>
            <textarea class="ms-form-input" id="ms-bio" maxlength="2000" placeholder="Tell us about your creative practice, skills, and what you offer...">${s.bio}</textarea>
            <div class="ms-char-count"><span id="ms-bio-count">${s.bio.length}</span> / 2000 characters (minimum 50)</div>
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `,we(e,o)}function we(e,t){const o=e.querySelector("#ms-bio"),r=e.querySelector("#ms-bio-count"),a=t?e.querySelector("#ms-business-name"):null,n=t?e.querySelector("#ms-slug-preview"):null,i=t?e.querySelector("#ms-slug-status"):null,l=e.querySelector("#ms-back-btn"),d=e.querySelector("#ms-next-btn"),c=e.querySelector("#ms-error-banner");let p=null,m=!0;if(o.addEventListener("input",()=>{s.bio=o.value,r.textContent=o.value.length}),a&&i){const b=(v,w)=>{i.className="ms-slug-status "+v;const S=i.querySelector(".ms-slug-icon"),_=i.querySelector(".ms-slug-message");v==="available"?(S.textContent="✓",_.textContent=w||"This name is available",m=!0):v==="taken"?(S.textContent="✗",_.textContent=w||"This name is already taken",m=!1):v==="checking"?(S.textContent="...",_.textContent="Checking availability..."):v==="invalid"?(S.textContent="!",_.textContent=w||"Name must be at least 4 characters",m=!1):(i.className="ms-slug-status",m=!0)},h=async v=>{const w=ne(v);if(n&&(n.textContent=w?`Your URL: mtnsmade.com.au/members/${w}`:""),v.trim().length<4){v.trim().length>0?b("invalid","Name must be at least 4 characters"):b("");return}b("checking");const S=await le(w,O==null?void 0:O.id);S.available?b("available"):b("taken",S.error)};a.addEventListener("input",()=>{s.businessName=a.value,p&&clearTimeout(p),p=setTimeout(()=>{h(a.value)},500)}),s.businessName&&h(s.businessName)}l.addEventListener("click",()=>{f=1,x(e)}),d.addEventListener("click",async()=>{if(t&&!s.businessName.trim()){y(c,"Please enter your business name");return}if(t&&!m){y(c,"This business name is already taken. Please choose a different name.");return}if(!s.bio.trim()){y(c,"Please enter a bio");return}if(s.bio.trim().length<50){y(c,"Please enter at least 50 characters for your bio");return}f=3,await L(f),x(e)})}function ke(e){var r;const t=(r=u==null?void 0:u.customFields)==null?void 0:r["membership-type"],o=ae(t);e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Select the categories that best describe your work.</p>
        </div>
        ${I()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 3: Categories</h3>
          <p class="ms-step-description">Choose categories so people can find you in the directory. Select at least one.</p>

          <div id="categories-container">
            ${o?Se():Le()}
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `,Ce(e,o)}function Se(){return`
      <div class="ms-form-field">
        <label>What type of listing are you? <span class="required">*</span></label>
        <div class="ms-radio-group">
          <label class="ms-radio-item ${s.spaceOrSupplier==="space"?"selected":""}" id="radio-space">
            <input type="radio" name="space-supplier" value="space" ${s.spaceOrSupplier==="space"?"checked":""}>
            <div class="ms-radio-item-title">Creative Space</div>
            <div class="ms-radio-item-desc">Studios, venues, galleries, etc.</div>
          </label>
          <label class="ms-radio-item ${s.spaceOrSupplier==="supplier"?"selected":""}" id="radio-supplier">
            <input type="radio" name="space-supplier" value="supplier" ${s.spaceOrSupplier==="supplier"?"checked":""}>
            <div class="ms-radio-item-title">Supplier</div>
            <div class="ms-radio-item-desc">Materials, services, equipment, etc.</div>
          </label>
        </div>
      </div>
      <div id="space-supplier-categories" style="${s.spaceOrSupplier?"":"display: none;"}">
        ${s.spaceOrSupplier==="space"?j():""}
        ${s.spaceOrSupplier==="supplier"?Y():""}
      </div>
    `}function j(){let e='<div class="ms-category-section"><div class="ms-category-header" style="font-weight:600;margin-bottom:12px;">Select Space Categories</div><div class="ms-category-grid">';return k.spaceCategories.forEach(t=>{const o=s.spaceCategories.includes(t.id);e+=`
        <label class="ms-category-item ${o?"selected":""}" data-id="${t.id}">
          <input type="checkbox" value="${t.id}" ${o?"checked":""}>
          ${t.name}
        </label>
      `}),e+='</div><div class="ms-selected-count"><span id="space-count">'+s.spaceCategories.length+"</span> selected</div></div>",e}function Y(){let e='<div class="ms-category-section"><div class="ms-category-header" style="font-weight:600;margin-bottom:12px;">Select Supplier Categories</div><div class="ms-category-grid">';return k.supplierCategories.forEach(t=>{const o=s.supplierCategories.includes(t.id);e+=`
        <label class="ms-category-item ${o?"selected":""}" data-id="${t.id}">
          <input type="checkbox" value="${t.id}" ${o?"checked":""}>
          ${t.name}
        </label>
      `}),e+='</div><div class="ms-selected-count"><span id="supplier-count">'+s.supplierCategories.length+"</span> selected</div></div>",e}function _e(e){const t=k.subDirectories.find(o=>o.id===e);return t?t.name:e}function Le(){let e='<div class="ms-category-selector">';return e+='<div class="ms-parent-categories">',k.directories.forEach(t=>{e+=`<button type="button" class="ms-parent-btn" data-parent="${t.id}">${t.name}</button>`}),e+="</div>",k.directories.forEach(t=>{const o=k.subDirectories.filter(r=>r.directory_id===t.id);e+=`<div class="ms-child-categories" data-parent="${t.id}">`,o.forEach(r=>{const a=s.chosenDirectories.includes(r.id);e+=`<button type="button" class="ms-child-btn ${a?"selected":""}" data-id="${r.id}">${r.name}</button>`}),e+="</div>"}),e+=`
      <div class="ms-selected-categories" id="ms-selected-section" style="${s.chosenDirectories.length?"":"display: none;"}">
        <h5>Selected Categories</h5>
        <div class="ms-selected-list" id="ms-selected-list"></div>
      </div>
    </div>`,e}function Ce(e,t){const o=e.querySelector("#ms-back-btn"),r=e.querySelector("#ms-next-btn"),a=e.querySelector("#ms-error-banner");if(o.addEventListener("click",()=>{f=2,x(e)}),t){const n=e.querySelector("#radio-space"),i=e.querySelector("#radio-supplier"),l=e.querySelector("#space-supplier-categories");n.addEventListener("click",()=>{s.spaceOrSupplier="space",s.supplierCategories=[],n.classList.add("selected"),i.classList.remove("selected"),l.innerHTML=j(),l.style.display="block",P(e,"spaceCategories","space-count")}),i.addEventListener("click",()=>{s.spaceOrSupplier="supplier",s.spaceCategories=[],i.classList.add("selected"),n.classList.remove("selected"),l.innerHTML=Y(),l.style.display="block",P(e,"supplierCategories","supplier-count")}),s.spaceOrSupplier==="space"?P(e,"spaceCategories","space-count"):s.spaceOrSupplier==="supplier"&&P(e,"supplierCategories","supplier-count"),r.addEventListener("click",async()=>{if(!s.spaceOrSupplier){y(a,"Please select whether you are a Creative Space or Supplier");return}if((s.spaceOrSupplier==="space"?s.spaceCategories.length:s.supplierCategories.length)===0){y(a,"Please select at least one category");return}f=4,await L(f),x(e)})}else Ee(e),r.addEventListener("click",async()=>{if(s.chosenDirectories.length===0){y(a,"Please select at least one category");return}f=4,await L(f),x(e)})}function Ee(e){const t=e.querySelectorAll(".ms-parent-btn"),o=e.querySelectorAll(".ms-child-categories"),r=e.querySelector("#ms-selected-list"),a=e.querySelector("#ms-selected-section");function n(){!r||!a||(r.innerHTML=s.chosenDirectories.map(i=>`<span class="ms-selected-tag">${_e(i)}<button type="button" data-id="${i}">&times;</button></span>`).join(""),a.style.display=s.chosenDirectories.length?"":"none",e.querySelectorAll(".ms-child-btn").forEach(i=>{const l=i.dataset.id;i.classList.toggle("selected",s.chosenDirectories.includes(l))}))}n(),t.forEach(i=>{i.addEventListener("click",()=>{const l=i.dataset.parent,d=i.classList.contains("active");t.forEach(c=>c.classList.remove("active")),o.forEach(c=>c.classList.remove("visible")),d||(i.classList.add("active"),e.querySelector(`.ms-child-categories[data-parent="${l}"]`).classList.add("visible"))})}),e.querySelectorAll(".ms-child-btn").forEach(i=>{i.addEventListener("click",()=>{const l=i.dataset.id,d=s.chosenDirectories.indexOf(l);d===-1?s.chosenDirectories.push(l):s.chosenDirectories.splice(d,1),n()})}),r&&r.addEventListener("click",i=>{if(i.target.tagName==="BUTTON"){const l=i.target.dataset.id,d=s.chosenDirectories.indexOf(l);d!==-1&&(s.chosenDirectories.splice(d,1),n())}})}function P(e,t,o){e.querySelectorAll(".ms-category-item").forEach(r=>{r.addEventListener("click",a=>{a.preventDefault();const n=r.dataset.id,i=s[t].indexOf(n);i===-1?(s[t].push(n),r.classList.add("selected")):(s[t].splice(i,1),r.classList.remove("selected"));const l=e.querySelector("#"+o);l&&(l.textContent=s[t].length),t==="chosenDirectories"&&$e(e)})})}function $e(e){e.querySelectorAll(".ms-accordion").forEach(t=>{const o=t.dataset.parent,a=k.subDirectories.filter(i=>i.directory_id===o).filter(i=>s.chosenDirectories.includes(i.id)).length,n=t.querySelector(".ms-accordion-count");n.textContent=a>0?`(${a} selected)`:""})}function Ie(e){var n;const t=(n=u==null?void 0:u.customFields)==null?void 0:n["membership-type"],o=N(t),r=o?"Step 4: Location & Hours":"Step 4: Location",a=o?"Select your suburb and optionally add address details.":"Select your suburb so members can find you in the directory.";e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>${o?"Add your business location and hours.":"Add your location."}</p>
        </div>
        ${I()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">${r}</h3>
          <p class="ms-step-description">${a}</p>

          <div class="ms-form-field">
            <label>Suburb <span class="required">*</span></label>
            <select class="ms-form-input" id="ms-suburb-select">
              <option value="">Select your suburb...</option>
              ${E.map(i=>{var l;return`<option value="${i.id}" ${((l=s.suburb)==null?void 0:l.id)===i.id?"selected":""}>${i.name}</option>`}).join("")}
            </select>
            <div class="ms-hint">This helps members find you in the directory</div>
          </div>

          ${o?`
          <div class="ms-form-field">
            <label>Business Address</label>
            <input type="text" class="ms-form-input" id="ms-address" value="${s.businessAddress}" placeholder="Enter your business address (optional)">
            <div class="ms-hint">This is where customers can find you</div>
          </div>

          <div class="ms-toggle-field">
            <span class="ms-toggle-label">Display address publicly on my profile</span>
            <label class="ms-toggle">
              <input type="checkbox" id="ms-display-address" ${s.displayAddress?"checked":""}>
              <span class="ms-toggle-slider"></span>
            </label>
          </div>

          <div class="ms-form-field">
            <label>Opening Hours</label>
            <div class="ms-hours-grid">
              ${M.map(i=>`
                <div class="ms-hours-row">
                  <span class="ms-hours-day">${i}</span>
                  <input type="text" class="ms-hours-input" id="ms-hours-${i.toLowerCase()}"
                    value="${s.openingHours[i.toLowerCase()]}"
                    placeholder="e.g., 9am - 5pm or Closed">
                </div>
              `).join("")}
            </div>
          </div>

          <div class="ms-toggle-field">
            <span class="ms-toggle-label">Display opening hours publicly on my profile</span>
            <label class="ms-toggle">
              <input type="checkbox" id="ms-display-hours" ${s.displayOpeningHours?"checked":""}>
              <span class="ms-toggle-slider"></span>
            </label>
          </div>
          `:""}

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `,qe(e)}function qe(e){const t=e.querySelector("#ms-suburb-select"),o=e.querySelector("#ms-address"),r=e.querySelector("#ms-display-address"),a=e.querySelector("#ms-display-hours"),n=e.querySelector("#ms-back-btn"),i=e.querySelector("#ms-next-btn"),l=e.querySelector("#ms-error-banner");t.addEventListener("change",()=>{const d=t.options[t.selectedIndex];d.value?s.suburb={id:d.value,name:d.text}:s.suburb=null}),o&&o.addEventListener("input",()=>{s.businessAddress=o.value}),r&&r.addEventListener("change",()=>{s.displayAddress=r.checked}),a&&a.addEventListener("change",()=>{s.displayOpeningHours=a.checked}),M.forEach(d=>{const c=e.querySelector(`#ms-hours-${d.toLowerCase()}`);c&&c.addEventListener("input",()=>{s.openingHours[d.toLowerCase()]=c.value})}),n.addEventListener("click",()=>{f=3,x(e)}),i.addEventListener("click",async()=>{if(!s.suburb){y(l,"Please select your suburb");return}f=5,await L(f),x(e)})}function Ue(e){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Almost done! Add your online presence.</p>
        </div>
        ${I()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 5: Links</h3>
          <p class="ms-step-description">Add your website and social media links. All fields are optional.</p>

          <div class="ms-links-grid">
            <div class="ms-link-field">
              <span class="ms-link-label">Website</span>
              <input type="url" class="ms-form-input" id="ms-website" value="${s.website}" placeholder="https://yourwebsite.com">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">Instagram</span>
              <input type="url" class="ms-form-input" id="ms-instagram" value="${s.instagram}" placeholder="https://instagram.com/username">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">Facebook</span>
              <input type="url" class="ms-form-input" id="ms-facebook" value="${s.facebook}" placeholder="https://facebook.com/page">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">LinkedIn</span>
              <input type="url" class="ms-form-input" id="ms-linkedin" value="${s.linkedin}" placeholder="https://linkedin.com/in/username">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">TikTok</span>
              <input type="url" class="ms-form-input" id="ms-tiktok" value="${s.tiktok}" placeholder="https://tiktok.com/@username">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">YouTube</span>
              <input type="url" class="ms-form-input" id="ms-youtube" value="${s.youtube}" placeholder="https://youtube.com/channel">
            </div>
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-submit-btn">Complete Profile</button>
          </div>
        </div>
      </div>
    `,Te(e)}function Te(e){const t=e.querySelector("#ms-back-btn"),o=e.querySelector("#ms-submit-btn"),r=e.querySelector("#ms-error-banner"),a=["website","instagram","facebook","linkedin","tiktok","youtube"];a.forEach(n=>{const i=e.querySelector(`#ms-${n}`),l=i.closest(".ms-link-field");let d=l.querySelector(".ms-field-error");d||(d=document.createElement("div"),d.className="ms-field-error",d.style.cssText="grid-column: 2;",l.appendChild(d)),i.addEventListener("input",()=>{s[n]=i.value,i.classList.remove("error"),d.textContent=""}),i.addEventListener("blur",()=>{const c=i.value.trim();if(!c){i.classList.remove("error"),d.textContent="";return}const p=B(c,n);p.valid?(p.url!==c&&(i.value=p.url,s[n]=p.url),i.classList.remove("error"),d.textContent=""):(i.classList.add("error"),d.textContent=p.error)})}),t.addEventListener("click",()=>{f=4,x(e)}),o.addEventListener("click",async()=>{const n=de();if(n.length>0){n.forEach(({platform:i,error:l})=>{const d=e.querySelector(`#ms-${i}`),p=d.closest(".ms-link-field").querySelector(".ms-field-error");d.classList.add("error"),p&&(p.textContent=l)}),y(r,"Please fix the highlighted fields before continuing");return}a.forEach(i=>{const l=e.querySelector(`#ms-${i}`);s[i]&&(l.value=s[i])}),o.disabled=!0,o.textContent="Saving...";try{await be(),Fe(e)}catch(i){console.error("Submit error:",i),o.disabled=!1,o.textContent="Complete Profile",y(r,"An error occurred. Please try again.")}})}function Fe(e){var d,c;const r=`/members/${(s.businessName||`${((d=u.customFields)==null?void 0:d["first-name"])||""} ${((c=u.customFields)==null?void 0:c["last-name"])||""}`.trim()).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}`,a=[{text:"Creating your profile page",icon:"1",duration:800},{text:"Uploading profile images",icon:"2",duration:1200},{text:"Setting up your categories",icon:"3",duration:900},{text:"Finalizing your listing",icon:"4",duration:700}];e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form ms-loading-screen">
          <div class="ms-loading-spinner"></div>
          <h2 style="margin: 0 0 24px 0; color: #333;">Setting Up Your Profile</h2>
          <div class="ms-loading-steps">
            ${a.map((p,m)=>`
              <div class="ms-loading-step" data-step="${m}">
                <span class="ms-loading-step-icon">${p.icon}</span>
                <span>${p.text}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;const n=e.querySelectorAll(".ms-loading-step");let i=0;function l(){if(i>0&&n[i-1]){n[i-1].classList.remove("active"),n[i-1].classList.add("complete");const p=n[i-1].querySelector(".ms-loading-step-icon");p&&(p.textContent="✓")}if(i<n.length){n[i].classList.add("active");const p=a[i].duration;i++,setTimeout(l,p)}else setTimeout(()=>{Pe(e,r)},500)}setTimeout(l,300)}function Pe(e,t){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form ms-success-screen">
          <div class="ms-success-icon">✓</div>
          <h2 class="ms-success-title">Profile Complete!</h2>
          <p class="ms-success-subtitle">Your MTNS MADE profile is now live and ready to be discovered.</p>
          <div class="ms-success-buttons">
            <a href="${t}" class="ms-success-btn ms-success-btn-primary">View my MTNS MADE Profile</a>
            <a href="/profile/start" class="ms-success-btn ms-success-btn-secondary">Go to my Dashboard</a>
          </div>
        </div>
      </div>
    `}function x(e){switch(f){case 1:he(e);break;case 2:xe(e);break;case 3:ke(e);break;case 4:Ie(e);break;case 5:Ue(e);break}}function y(e,t){e.textContent=t,e.style.display="block",e.scrollIntoView({behavior:"smooth",block:"center"})}function Ae(e){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form">
          <div class="ms-error-banner" style="display: block;">
            Please log in to complete your profile.
          </div>
          <p style="text-align: center; margin-top: 20px;">
            <a href="/login" style="color: #333; font-weight: 600;">Log in</a>
          </p>
        </div>
      </div>
    `}function Oe(e){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form" style="text-align: center; padding: 48px 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">&#10003;</div>
          <h2 style="margin: 0 0 8px 0;">Profile Already Complete</h2>
          <p style="color: #666; margin-bottom: 24px;">You've already completed your profile setup.</p>
          <a href="/profile/start" class="ms-btn" style="display: inline-block; text-decoration: none;">Go to Dashboard</a>
        </div>
      </div>
    `}function ze(e,t){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form">
          <div class="ms-error-banner" style="display: block;">${t}</div>
        </div>
      </div>
    `}async function W(){var o,r,a;const e=document.querySelector(".onboarding-form")||document.querySelector(".supabase-onboarding-container");if(!e){console.warn("Could not find onboarding container (.onboarding-form or .supabase-onboarding-container)");return}const t=document.createElement("style");t.textContent=ie,document.head.appendChild(t),e.innerHTML='<div class="ms-loading">Loading...</div>';try{await oe(),g=window.supabase.createClient(z,A);const{data:n}=await window.$memberstackDom.getCurrentMember();if(!n){Ae(e);return}if(u=n,((o=n.customFields)==null?void 0:o["onboarding-complete"])==="true"){Oe(e);return}await ce(),await pe();const i=(r=n.customFields)==null?void 0:r["suburb-id"],l=(a=n.customFields)==null?void 0:a.suburb;if(i&&l){const c=E.find(p=>p.webflow_id===i);if(c)s.suburb={id:c.id,name:c.name},console.log("Pre-populated suburb from signup (matched to Supabase):",s.suburb);else{const p=E.find(m=>m.name===l);p?(s.suburb={id:p.id,name:p.name},console.log("Pre-populated suburb from signup (matched by name):",s.suburb)):console.warn("Could not find suburb in Supabase:",i,l)}}const d=await fe();d&&d>1&&(f=d,console.log("Resuming onboarding from step",f)),x(e)}catch(n){console.error("Init error:",n),ze(e,"Error loading onboarding. Please refresh the page.")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",W):W()})();
