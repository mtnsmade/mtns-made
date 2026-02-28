(function(){console.log("Member onboarding Supabase script loaded");const R="https://epszwomtxkpjegbjbixr.supabase.co",j="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",I="member-images",Y=["small-business","large-business","not-for-profit","spaces-suppliers"],Z="spaces-suppliers";let g=null,b=1,P=5,u=null,U=null,S={directories:[],subDirectories:[],spaceCategories:[],supplierCategories:[]},z=[],s={profileImageUrl:null,profileImageFile:null,featureImageUrl:null,featureImageFile:null,bio:"",businessName:"",suburb:null,spaceOrSupplier:null,chosenDirectories:[],spaceCategories:[],supplierCategories:[],businessAddress:"",displayAddress:!1,openingHours:{monday:"",tuesday:"",wednesday:"",thursday:"",friday:"",saturday:"",sunday:""},displayOpeningHours:!1,website:"",instagram:"",facebook:"",linkedin:"",tiktok:"",youtube:""};const F=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],W=`
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
  `;function G(){return new Promise((e,t)=>{let i=0;const o=50,a=setInterval(()=>{i++,window.$memberstackDom&&window.supabase?(clearInterval(a),e()):i>=o&&(clearInterval(a),t(new Error("Dependencies not loaded (Memberstack or Supabase)")))},100)})}function L(e){return Y.includes(e)}function X(e){return e===Z}function V(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").replace(/-+/g,"-")}async function J(e,t=null){if(!e||e.length<3)return{available:!1,error:"Slug must be at least 3 characters"};try{let i=g.from("members").select("id, slug").eq("slug",e);t&&(i=i.neq("id",t));const{data:o,error:a}=await i;return a?(console.error("Error checking slug:",a),{available:!0}):{available:!o||o.length===0,error:o&&o.length>0?"This name is already taken":null}}catch(i){return console.error("Error checking slug:",i),{available:!0}}}const A={instagram:{baseUrl:"https://www.instagram.com/",patterns:[/instagram\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},facebook:{baseUrl:"https://www.facebook.com/",patterns:[/facebook\.com\/([^\/\?]+)/i,/^([a-zA-Z0-9.]+)$/]},linkedin:{baseUrl:"https://www.linkedin.com/in/",patterns:[/linkedin\.com\/(in|company)\/([^\/\?]+)/i,/^([a-zA-Z0-9-]+)$/]},tiktok:{baseUrl:"https://www.tiktok.com/@",patterns:[/tiktok\.com\/@?([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},youtube:{baseUrl:"https://www.youtube.com/",patterns:[/youtube\.com\/(channel|c|user|@)\/([^\/\?]+)/i,/youtube\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9_-]+)$/]}};function O(e,t=null){if(!e||!e.trim())return{valid:!0,url:""};if(e=e.trim(),e.includes(" "))return{valid:!1,error:"Please enter only one URL (no spaces)"};if((e.match(/https?:\/\//gi)||[]).length>1)return{valid:!1,error:"Please enter only one URL"};if(/^https?:\/\//i.test(e))try{return new URL(e),{valid:!0,url:e}}catch{return{valid:!1,error:"Invalid URL format"}}if(t==="website")return/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/.test(e)?{valid:!0,url:"https://"+e}:{valid:!1,error:"Please enter a full website URL (e.g., https://example.com)"};if(t&&A[t]){const o=A[t];if(e.toLowerCase().includes(t.toLowerCase()+".com"))return{valid:!0,url:"https://"+e.replace(/^(https?:\/\/)?/i,"")};for(const a of o.patterns){const n=e.match(a);if(n){const r=n[n.length-1];return r.toLowerCase()===t.toLowerCase()?{valid:!1,error:`Please enter your ${t} profile URL or username`}:{valid:!0,url:o.baseUrl+r.replace(/^@/,"")}}}return{valid:!1,error:`Please enter a valid ${t} URL or username`}}return{valid:!1,error:"Invalid URL"}}function Q(){const e=[];return["website","instagram","facebook","linkedin","tiktok","youtube"].forEach(i=>{const o=s[i];if(o&&o.trim()){const a=O(o,i);a.valid?s[i]=a.url:e.push({platform:i,error:a.error})}}),e}async function K(){try{const{data:e,error:t}=await g.from("directories").select("id, name, slug").order("display_order");if(t)throw t;const{data:i,error:o}=await g.from("sub_directories").select("id, name, slug, directory_id").order("name");if(o)throw o;const{data:a,error:n}=await g.from("creative_space_categories").select("id, name, slug").order("name");if(n)throw n;const{data:r,error:l}=await g.from("supplier_categories").select("id, name, slug").order("name");if(l)throw l;return S={directories:e||[],subDirectories:i||[],spaceCategories:a||[],supplierCategories:r||[]},S}catch(e){throw console.error("Error loading categories:",e),e}}async function ee(){try{const{data:e,error:t}=await g.from("suburbs").select("id, name").order("name");if(t)throw t;return z=e||[],z}catch(e){return console.error("Error loading suburbs:",e),[]}}async function se(e){if(!e)return null;try{const{data:t,error:i}=await g.from("membership_types").select("id").eq("slug",e).single();return i||!t?(console.warn("Membership type not found for slug:",e),null):t.id}catch(t){return console.error("Error looking up membership type:",t),null}}const M=3*1024*1024,q=2e3;async function te(e){return e.size<=M?(console.log(`Image ${e.name} is ${(e.size/1024/1024).toFixed(2)}MB - no compression needed`),e):(console.log(`Compressing image ${e.name} from ${(e.size/1024/1024).toFixed(2)}MB...`),new Promise((t,i)=>{const o=new Image,a=document.createElement("canvas"),n=a.getContext("2d");o.onload=()=>{let{width:r,height:l}=o;if(r>q||l>q){const p=Math.min(q/r,q/l);r=Math.round(r*p),l=Math.round(l*p)}a.width=r,a.height=l,n.drawImage(o,0,0,r,l);const c=p=>{a.toBlob(d=>{if(!d){i(new Error("Failed to compress image"));return}if(console.log(`Compressed to ${(d.size/1024/1024).toFixed(2)}MB at quality ${p}`),d.size<=M||p<=.3){const m=new File([d],e.name,{type:"image/jpeg",lastModified:Date.now()});t(m)}else c(p-.1)},"image/jpeg",p)};c(.8)},o.onerror=()=>i(new Error("Failed to load image for compression")),o.src=URL.createObjectURL(e)}))}async function H(e,t,i){try{const o=await te(e),{data:a}=await g.storage.from(I).list(t);if(a&&a.length>0){const p=a.filter(d=>d.name.startsWith(`${i}_`)).map(d=>`${t}/${d.name}`);if(p.length>0){const{error:d}=await g.storage.from(I).remove(p);d?console.warn("Error deleting old images:",d):console.log(`Deleted ${p.length} old ${i} image(s)`)}}const n=`${i}_${Date.now()}.jpg`,r=`${t}/${n}`,{error:l}=await g.storage.from(I).upload(r,o,{cacheControl:"3600",upsert:!0});if(l)throw l;const{data:{publicUrl:c}}=g.storage.from(I).getPublicUrl(r);return c}catch(o){throw console.error(`Error uploading ${i} image:`,o),o}}async function re(){var t,i,o,a,n,r,l;const e=u.id;try{let c=s.profileImageUrl,p=s.featureImageUrl;s.profileImageFile&&(c=await H(s.profileImageFile,e,"profile")),s.featureImageFile&&(p=await H(s.featureImageFile,e,"feature"));const d=s.businessName||`${((t=u.customFields)==null?void 0:t["first-name"])||""} ${((i=u.customFields)==null?void 0:i["last-name"])||""}`.trim(),m=d.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),f=(o=u==null?void 0:u.customFields)==null?void 0:o["membership-type"],E=await se(f);console.log("Membership type:",f,"-> ID:",E);const y={membership_type_id:E,profile_image_url:c,header_image_url:p,bio:s.bio,slug:m,name:d,business_name:s.businessName||null,suburb_id:((a=s.suburb)==null?void 0:a.id)||null,business_address:s.businessAddress||null,show_address:s.displayAddress,show_opening_hours:s.displayOpeningHours,opening_monday:s.openingHours.monday||null,opening_tuesday:s.openingHours.tuesday||null,opening_wednesday:s.openingHours.wednesday||null,opening_thursday:s.openingHours.thursday||null,opening_friday:s.openingHours.friday||null,opening_saturday:s.openingHours.saturday||null,opening_sunday:s.openingHours.sunday||null,website:s.website||null,instagram:s.instagram||null,facebook:s.facebook||null,linkedin:s.linkedin||null,tiktok:s.tiktok||null,youtube:s.youtube||null,is_creative_space:s.spaceOrSupplier==="space",is_supplier:s.spaceOrSupplier==="supplier",profile_complete:!0},{data:k,error:w}=await g.from("members").upsert({memberstack_id:e,email:(n=u.auth)==null?void 0:n.email,first_name:((r=u.customFields)==null?void 0:r["first-name"])||null,last_name:((l=u.customFields)==null?void 0:l["last-name"])||null,...y},{onConflict:"memberstack_id"}).select().single();if(w)throw w;const v=k.id;if(await g.from("member_sub_directories").delete().eq("member_id",v),await g.from("member_space_categories").delete().eq("member_id",v),await g.from("member_supplier_categories").delete().eq("member_id",v),s.chosenDirectories.length>0){const $=s.chosenDirectories.map(_=>({member_id:v,sub_directory_id:_}));await g.from("member_sub_directories").insert($)}if(s.spaceCategories.length>0){const $=s.spaceCategories.map(_=>({member_id:v,space_category_id:_}));await g.from("member_space_categories").insert($)}if(s.supplierCategories.length>0){const $=s.supplierCategories.map(_=>({member_id:v,supplier_category_id:_}));await g.from("member_supplier_categories").insert($)}return await window.$memberstackDom.updateMember({customFields:{"onboarding-complete":"true"}}),console.log("Onboarding data saved successfully"),k}catch(c){throw console.error("Error saving onboarding data:",c),c}}function C(e){var o;const t=(o=u==null?void 0:u.customFields)==null?void 0:o["membership-type"];P=L(t)?5:4;let i='<div class="ms-progress">';for(let a=1;a<=P;a++){let n="ms-progress-step";a<b&&(n+=" completed"),a===b&&(n+=" active"),i+=`<div class="${n}"></div>`}return i+="</div>",i}function ie(e){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Let's set up your public profile. This should only take a few minutes.</p>
        </div>
        ${C()}
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
    `,oe(e)}function oe(e){const t=e.querySelector("#profile-upload"),i=e.querySelector("#feature-upload"),o=e.querySelector("#profile-file-input"),a=e.querySelector("#feature-file-input"),n=e.querySelector("#ms-next-btn"),r=e.querySelector("#ms-error-banner");function l(){s.profileImageUrl?(t.innerHTML=`
          <img src="${s.profileImageUrl}" class="ms-image-preview profile" alt="Profile preview">
          <button type="button" class="ms-image-remove" data-remove="profile">&times;</button>
        `,t.classList.add("has-image")):(t.innerHTML=`
          <input type="file" accept="image/*" id="profile-file-input">
          <div class="ms-image-upload-text">
            <strong>Click to upload</strong><br>
            Square image recommended
          </div>
        `,t.classList.remove("has-image"),t.querySelector("#profile-file-input").addEventListener("change",p))}function c(){s.featureImageUrl?(i.innerHTML=`
          <img src="${s.featureImageUrl}" class="ms-image-preview" alt="Feature preview">
          <button type="button" class="ms-image-remove" data-remove="feature">&times;</button>
        `,i.classList.add("has-image")):(i.innerHTML=`
          <input type="file" accept="image/*" id="feature-file-input">
          <div class="ms-image-upload-text">
            <strong>Click to upload</strong><br>
            Landscape image recommended
          </div>
        `,i.classList.remove("has-image"),i.querySelector("#feature-file-input").addEventListener("change",d))}function p(m){const f=m.target.files[0];f&&(s.profileImageFile=f,s.profileImageUrl=URL.createObjectURL(f),l(),r.style.display="none")}function d(m){const f=m.target.files[0];f&&(s.featureImageFile=f,s.featureImageUrl=URL.createObjectURL(f),c(),r.style.display="none")}o.addEventListener("change",p),a.addEventListener("change",d),t.addEventListener("click",m=>{m.target.dataset.remove==="profile"&&(m.stopPropagation(),s.profileImageUrl=null,s.profileImageFile=null,l())}),i.addEventListener("click",m=>{m.target.dataset.remove==="feature"&&(m.stopPropagation(),s.featureImageUrl=null,s.featureImageFile=null,c())}),l(),c(),n.addEventListener("click",()=>{if(!s.profileImageUrl){h(r,"Please upload a profile image");return}if(!s.featureImageUrl){h(r,"Please upload a feature image");return}b=2,x(e)})}function ae(e){var o;const t=(o=u==null?void 0:u.customFields)==null?void 0:o["membership-type"],i=L(t);e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Tell us about yourself${i?" and your business":""}.</p>
        </div>
        ${C()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 2: About You</h3>
          <p class="ms-step-description">This information will be displayed on your public profile.</p>

          ${i?`
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
            <div class="ms-char-count"><span id="ms-bio-count">${s.bio.length}</span> / 2000 characters</div>
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `,ne(e,i)}function ne(e,t){const i=e.querySelector("#ms-bio"),o=e.querySelector("#ms-bio-count"),a=t?e.querySelector("#ms-business-name"):null,n=t?e.querySelector("#ms-slug-preview"):null,r=t?e.querySelector("#ms-slug-status"):null,l=e.querySelector("#ms-back-btn"),c=e.querySelector("#ms-next-btn"),p=e.querySelector("#ms-error-banner");let d=null,m=!0;if(i.addEventListener("input",()=>{s.bio=i.value,o.textContent=i.value.length}),a&&r){const f=(y,k)=>{r.className="ms-slug-status "+y;const w=r.querySelector(".ms-slug-icon"),v=r.querySelector(".ms-slug-message");y==="available"?(w.textContent="✓",v.textContent=k||"This name is available",m=!0):y==="taken"?(w.textContent="✗",v.textContent=k||"This name is already taken",m=!1):y==="checking"?(w.textContent="...",v.textContent="Checking availability..."):y==="invalid"?(w.textContent="!",v.textContent=k||"Name must be at least 4 characters",m=!1):(r.className="ms-slug-status",m=!0)},E=async y=>{const k=V(y);if(n&&(n.textContent=k?`Your URL: mtnsmade.com.au/members/${k}`:""),y.trim().length<4){y.trim().length>0?f("invalid","Name must be at least 4 characters"):f("");return}f("checking");const w=await J(k,U==null?void 0:U.id);w.available?f("available"):f("taken",w.error)};a.addEventListener("input",()=>{s.businessName=a.value,d&&clearTimeout(d),d=setTimeout(()=>{E(a.value)},500)}),s.businessName&&E(s.businessName)}l.addEventListener("click",()=>{b=1,x(e)}),c.addEventListener("click",()=>{if(t&&!s.businessName.trim()){h(p,"Please enter your business name");return}if(t&&!m){h(p,"This business name is already taken. Please choose a different name.");return}if(!s.bio.trim()){h(p,"Please enter a bio");return}if(s.bio.trim().length<50){h(p,"Please enter at least 50 characters for your bio");return}b=3,x(e)})}function le(e){var o;const t=(o=u==null?void 0:u.customFields)==null?void 0:o["membership-type"],i=X(t);e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Select the categories that best describe your work.</p>
        </div>
        ${C()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 3: Categories</h3>
          <p class="ms-step-description">Choose categories so people can find you in the directory. Select at least one.</p>

          <div id="categories-container">
            ${i?ce():pe()}
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `,ue(e,i)}function ce(){return`
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
        ${s.spaceOrSupplier==="space"?D():""}
        ${s.spaceOrSupplier==="supplier"?N():""}
      </div>
    `}function D(){let e='<div class="ms-category-section"><div class="ms-category-header" style="font-weight:600;margin-bottom:12px;">Select Space Categories</div><div class="ms-category-grid">';return S.spaceCategories.forEach(t=>{const i=s.spaceCategories.includes(t.id);e+=`
        <label class="ms-category-item ${i?"selected":""}" data-id="${t.id}">
          <input type="checkbox" value="${t.id}" ${i?"checked":""}>
          ${t.name}
        </label>
      `}),e+='</div><div class="ms-selected-count"><span id="space-count">'+s.spaceCategories.length+"</span> selected</div></div>",e}function N(){let e='<div class="ms-category-section"><div class="ms-category-header" style="font-weight:600;margin-bottom:12px;">Select Supplier Categories</div><div class="ms-category-grid">';return S.supplierCategories.forEach(t=>{const i=s.supplierCategories.includes(t.id);e+=`
        <label class="ms-category-item ${i?"selected":""}" data-id="${t.id}">
          <input type="checkbox" value="${t.id}" ${i?"checked":""}>
          ${t.name}
        </label>
      `}),e+='</div><div class="ms-selected-count"><span id="supplier-count">'+s.supplierCategories.length+"</span> selected</div></div>",e}function de(e){const t=S.subDirectories.find(i=>i.id===e);return t?t.name:e}function pe(){let e='<div class="ms-category-selector">';return e+='<div class="ms-parent-categories">',S.directories.forEach(t=>{e+=`<button type="button" class="ms-parent-btn" data-parent="${t.id}">${t.name}</button>`}),e+="</div>",S.directories.forEach(t=>{const i=S.subDirectories.filter(o=>o.directory_id===t.id);e+=`<div class="ms-child-categories" data-parent="${t.id}">`,i.forEach(o=>{const a=s.chosenDirectories.includes(o.id);e+=`<button type="button" class="ms-child-btn ${a?"selected":""}" data-id="${o.id}">${o.name}</button>`}),e+="</div>"}),e+=`
      <div class="ms-selected-categories" id="ms-selected-section" style="${s.chosenDirectories.length?"":"display: none;"}">
        <h5>Selected Categories</h5>
        <div class="ms-selected-list" id="ms-selected-list"></div>
      </div>
    </div>`,e}function ue(e,t){const i=e.querySelector("#ms-back-btn"),o=e.querySelector("#ms-next-btn"),a=e.querySelector("#ms-error-banner");if(i.addEventListener("click",()=>{b=2,x(e)}),t){const n=e.querySelector("#radio-space"),r=e.querySelector("#radio-supplier"),l=e.querySelector("#space-supplier-categories");n.addEventListener("click",()=>{s.spaceOrSupplier="space",s.supplierCategories=[],n.classList.add("selected"),r.classList.remove("selected"),l.innerHTML=D(),l.style.display="block",T(e,"spaceCategories","space-count")}),r.addEventListener("click",()=>{s.spaceOrSupplier="supplier",s.spaceCategories=[],r.classList.add("selected"),n.classList.remove("selected"),l.innerHTML=N(),l.style.display="block",T(e,"supplierCategories","supplier-count")}),s.spaceOrSupplier==="space"?T(e,"spaceCategories","space-count"):s.spaceOrSupplier==="supplier"&&T(e,"supplierCategories","supplier-count"),o.addEventListener("click",()=>{if(!s.spaceOrSupplier){h(a,"Please select whether you are a Creative Space or Supplier");return}if((s.spaceOrSupplier==="space"?s.spaceCategories.length:s.supplierCategories.length)===0){h(a,"Please select at least one category");return}b=4,x(e)})}else me(e),o.addEventListener("click",()=>{var r;if(s.chosenDirectories.length===0){h(a,"Please select at least one category");return}const n=(r=u==null?void 0:u.customFields)==null?void 0:r["membership-type"];L(n)?b=4:b=5,x(e)})}function me(e){const t=e.querySelectorAll(".ms-parent-btn"),i=e.querySelectorAll(".ms-child-categories"),o=e.querySelector("#ms-selected-list"),a=e.querySelector("#ms-selected-section");function n(){!o||!a||(o.innerHTML=s.chosenDirectories.map(r=>`<span class="ms-selected-tag">${de(r)}<button type="button" data-id="${r}">&times;</button></span>`).join(""),a.style.display=s.chosenDirectories.length?"":"none",e.querySelectorAll(".ms-child-btn").forEach(r=>{const l=r.dataset.id;r.classList.toggle("selected",s.chosenDirectories.includes(l))}))}n(),t.forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.parent,c=r.classList.contains("active");t.forEach(p=>p.classList.remove("active")),i.forEach(p=>p.classList.remove("visible")),c||(r.classList.add("active"),e.querySelector(`.ms-child-categories[data-parent="${l}"]`).classList.add("visible"))})}),e.querySelectorAll(".ms-child-btn").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.id,c=s.chosenDirectories.indexOf(l);c===-1?s.chosenDirectories.push(l):s.chosenDirectories.splice(c,1),n()})}),o&&o.addEventListener("click",r=>{if(r.target.tagName==="BUTTON"){const l=r.target.dataset.id,c=s.chosenDirectories.indexOf(l);c!==-1&&(s.chosenDirectories.splice(c,1),n())}})}function T(e,t,i){e.querySelectorAll(".ms-category-item").forEach(o=>{o.addEventListener("click",a=>{a.preventDefault();const n=o.dataset.id,r=s[t].indexOf(n);r===-1?(s[t].push(n),o.classList.add("selected")):(s[t].splice(r,1),o.classList.remove("selected"));const l=e.querySelector("#"+i);l&&(l.textContent=s[t].length),t==="chosenDirectories"&&ge(e)})})}function ge(e){e.querySelectorAll(".ms-accordion").forEach(t=>{const i=t.dataset.parent,a=S.subDirectories.filter(r=>r.directory_id===i).filter(r=>s.chosenDirectories.includes(r.id)).length,n=t.querySelector(".ms-accordion-count");n.textContent=a>0?`(${a} selected)`:""})}function fe(e){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Add your business location and hours.</p>
        </div>
        ${C()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 4: Location & Hours</h3>
          <p class="ms-step-description">Select your suburb and optionally add address details.</p>

          <div class="ms-form-field">
            <label>Suburb <span class="required">*</span></label>
            <select class="ms-form-input" id="ms-suburb-select">
              <option value="">Select your suburb...</option>
              ${z.map(t=>{var i;return`<option value="${t.id}" ${((i=s.suburb)==null?void 0:i.id)===t.id?"selected":""}>${t.name}</option>`}).join("")}
            </select>
            <div class="ms-hint">This helps members find you in the directory</div>
          </div>

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
              ${F.map(t=>`
                <div class="ms-hours-row">
                  <span class="ms-hours-day">${t}</span>
                  <input type="text" class="ms-hours-input" id="ms-hours-${t.toLowerCase()}"
                    value="${s.openingHours[t.toLowerCase()]}"
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

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `,be(e)}function be(e){const t=e.querySelector("#ms-suburb-select"),i=e.querySelector("#ms-address"),o=e.querySelector("#ms-display-address"),a=e.querySelector("#ms-display-hours"),n=e.querySelector("#ms-back-btn"),r=e.querySelector("#ms-next-btn"),l=e.querySelector("#ms-error-banner");t.addEventListener("change",()=>{const c=t.options[t.selectedIndex];c.value?s.suburb={id:c.value,name:c.text}:s.suburb=null}),i.addEventListener("input",()=>{s.businessAddress=i.value}),o.addEventListener("change",()=>{s.displayAddress=o.checked}),a.addEventListener("change",()=>{s.displayOpeningHours=a.checked}),F.forEach(c=>{const p=e.querySelector(`#ms-hours-${c.toLowerCase()}`);p.addEventListener("input",()=>{s.openingHours[c.toLowerCase()]=p.value})}),n.addEventListener("click",()=>{b=3,x(e)}),r.addEventListener("click",()=>{if(!s.suburb){h(l,"Please select your suburb");return}b=5,x(e)})}function he(e){var o;const t=(o=u==null?void 0:u.customFields)==null?void 0:o["membership-type"],i=L(t)?5:4;e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Almost done! Add your online presence.</p>
        </div>
        ${C()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step ${i}: Links</h3>
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
    `,ye(e)}function ye(e){const t=e.querySelector("#ms-back-btn"),i=e.querySelector("#ms-submit-btn"),o=e.querySelector("#ms-error-banner"),a=["website","instagram","facebook","linkedin","tiktok","youtube"];a.forEach(n=>{const r=e.querySelector(`#ms-${n}`),l=r.closest(".ms-link-field");let c=l.querySelector(".ms-field-error");c||(c=document.createElement("div"),c.className="ms-field-error",c.style.cssText="grid-column: 2;",l.appendChild(c)),r.addEventListener("input",()=>{s[n]=r.value,r.classList.remove("error"),c.textContent=""}),r.addEventListener("blur",()=>{const p=r.value.trim();if(!p){r.classList.remove("error"),c.textContent="";return}const d=O(p,n);d.valid?(d.url!==p&&(r.value=d.url,s[n]=d.url),r.classList.remove("error"),c.textContent=""):(r.classList.add("error"),c.textContent=d.error)})}),t.addEventListener("click",()=>{var r;const n=(r=u==null?void 0:u.customFields)==null?void 0:r["membership-type"];L(n)?b=4:b=3,x(e)}),i.addEventListener("click",async()=>{const n=Q();if(n.length>0){n.forEach(({platform:r,error:l})=>{const c=e.querySelector(`#ms-${r}`),d=c.closest(".ms-link-field").querySelector(".ms-field-error");c.classList.add("error"),d&&(d.textContent=l)}),h(o,"Please fix the highlighted fields before continuing");return}a.forEach(r=>{const l=e.querySelector(`#ms-${r}`);s[r]&&(l.value=s[r])}),i.disabled=!0,i.textContent="Saving...";try{await re(),ve(e)}catch(r){console.error("Submit error:",r),i.disabled=!1,i.textContent="Complete Profile",h(o,"An error occurred. Please try again.")}})}function ve(e){var c,p;const o=`/members/${(s.businessName||`${((c=u.customFields)==null?void 0:c["first-name"])||""} ${((p=u.customFields)==null?void 0:p["last-name"])||""}`.trim()).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}`,a=[{text:"Creating your profile page",icon:"1",duration:800},{text:"Uploading profile images",icon:"2",duration:1200},{text:"Setting up your categories",icon:"3",duration:900},{text:"Finalizing your listing",icon:"4",duration:700}];e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form ms-loading-screen">
          <div class="ms-loading-spinner"></div>
          <h2 style="margin: 0 0 24px 0; color: #333;">Setting Up Your Profile</h2>
          <div class="ms-loading-steps">
            ${a.map((d,m)=>`
              <div class="ms-loading-step" data-step="${m}">
                <span class="ms-loading-step-icon">${d.icon}</span>
                <span>${d.text}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;const n=e.querySelectorAll(".ms-loading-step");let r=0;function l(){if(r>0&&n[r-1]){n[r-1].classList.remove("active"),n[r-1].classList.add("complete");const d=n[r-1].querySelector(".ms-loading-step-icon");d&&(d.textContent="✓")}if(r<n.length){n[r].classList.add("active");const d=a[r].duration;r++,setTimeout(l,d)}else setTimeout(()=>{xe(e,o)},500)}setTimeout(l,300)}function xe(e,t){e.innerHTML=`
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
    `}function x(e){switch(b){case 1:ie(e);break;case 2:ae(e);break;case 3:le(e);break;case 4:fe(e);break;case 5:he(e);break}}function h(e,t){e.textContent=t,e.style.display="block",e.scrollIntoView({behavior:"smooth",block:"center"})}function ke(e){e.innerHTML=`
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
    `}function we(e){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form" style="text-align: center; padding: 48px 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">&#10003;</div>
          <h2 style="margin: 0 0 8px 0;">Profile Already Complete</h2>
          <p style="color: #666; margin-bottom: 24px;">You've already completed your profile setup.</p>
          <a href="/profile/start" class="ms-btn" style="display: inline-block; text-decoration: none;">Go to Dashboard</a>
        </div>
      </div>
    `}function Se(e,t){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form">
          <div class="ms-error-banner" style="display: block;">${t}</div>
        </div>
      </div>
    `}async function B(){var i;const e=document.querySelector(".onboarding-form")||document.querySelector(".supabase-onboarding-container");if(!e){console.warn("Could not find onboarding container (.onboarding-form or .supabase-onboarding-container)");return}const t=document.createElement("style");t.textContent=W,document.head.appendChild(t),e.innerHTML='<div class="ms-loading">Loading...</div>';try{await G(),g=window.supabase.createClient(R,j);const{data:o}=await window.$memberstackDom.getCurrentMember();if(!o){ke(e);return}if(u=o,((i=o.customFields)==null?void 0:i["onboarding-complete"])==="true"){we(e);return}await K(),await ee(),x(e)}catch(o){console.error("Init error:",o),Se(e,"Error loading onboarding. Please refresh the page.")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",B):B()})();
