(function(){console.log("Member onboarding Supabase script loaded");const z="https://epszwomtxkpjegbjbixr.supabase.co",U="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH";async function _(e,r={}){try{const i=window.$memberstackDom,t=(i&&typeof i.getMemberCookie=="function"?await i.getMemberCookie():"")||"",a=await fetch(`${z}/functions/v1/member-self`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${U}`,apikey:U,"X-Member-Token":t},body:JSON.stringify({action:e,...r})}),n=await a.json().catch(()=>({}));return a.ok?{data:"member"in n?n.member:n,error:null}:{data:null,error:{message:n.error||`member-self ${e} failed`,status:a.status}}}catch(i){return{data:null,error:i}}}const O="member-images",ae=["small-business","large-business","not-for-profit","partner","spaces-suppliers"],ne="spaces-suppliers",le=["Bilpin","Penrith"];let g=null,f=1,D=5,u=null,H=null,k={directories:[],subDirectories:[],spaceCategories:[],supplierCategories:[]},E=[],s={profileImageUrl:null,profileImageFile:null,featureImageUrl:null,featureImageFile:null,bio:"",businessName:"",suburb:null,spaceOrSupplier:null,chosenDirectories:[],spaceCategories:[],supplierCategories:[],businessAddress:"",displayAddress:!1,openingHours:{monday:"",tuesday:"",wednesday:"",thursday:"",friday:"",saturday:"",sunday:""},displayOpeningHours:!1,website:"",instagram:"",facebook:"",linkedin:"",tiktok:"",youtube:""};const B=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],de=`
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
  `;function ce(){return new Promise((e,r)=>{let i=0;const t=50,a=setInterval(()=>{i++,window.$memberstackDom&&window.supabase?(clearInterval(a),e()):i>=t&&(clearInterval(a),r(new Error("Dependencies not loaded (Memberstack or Supabase)")))},100)})}function R(e){return ae.includes(e)}function pe(e){return e===ne}function ue(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").replace(/-+/g,"-")}async function me(e,r=null){if(!e||e.length<3)return{available:!1,error:"Slug must be at least 3 characters"};try{let i=g.from("members").select("id, slug").eq("slug",e);r&&(i=i.neq("id",r));const{data:t,error:a}=await i;return a?(console.error("Error checking slug:",a),{available:!0}):{available:!t||t.length===0,error:t&&t.length>0?"This name is already taken":null}}catch(i){return console.error("Error checking slug:",i),{available:!0}}}const j={instagram:{baseUrl:"https://www.instagram.com/",patterns:[/instagram\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},facebook:{baseUrl:"https://www.facebook.com/",patterns:[/facebook\.com\/([^\/\?]+)/i,/^([a-zA-Z0-9.]+)$/]},linkedin:{baseUrl:"https://www.linkedin.com/in/",patterns:[/linkedin\.com\/(in|company)\/([^\/\?]+)/i,/^([a-zA-Z0-9-]+)$/]},tiktok:{baseUrl:"https://www.tiktok.com/@",patterns:[/tiktok\.com\/@?([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},youtube:{baseUrl:"https://www.youtube.com/",patterns:[/youtube\.com\/(channel|c|user|@)\/([^\/\?]+)/i,/youtube\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9_-]+)$/]}};function Y(e,r=null){if(!e||!e.trim())return{valid:!0,url:""};if(e=e.trim(),e.includes(" "))return{valid:!1,error:"Please enter only one URL (no spaces)"};if((e.match(/https?:\/\//gi)||[]).length>1)return{valid:!1,error:"Please enter only one URL"};if(/^https?:\/\//i.test(e))try{return new URL(e),{valid:!0,url:e}}catch{return{valid:!1,error:"Invalid URL format"}}if(r==="website")return/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/.test(e)?{valid:!0,url:"https://"+e}:{valid:!1,error:"Please enter a full website URL (e.g., https://example.com)"};if(r&&j[r]){const t=j[r];if(e.toLowerCase().includes(r.toLowerCase()+".com"))return{valid:!0,url:"https://"+e.replace(/^(https?:\/\/)?/i,"")};for(const a of t.patterns){const n=e.match(a);if(n){const o=n[n.length-1];return o.toLowerCase()===r.toLowerCase()?{valid:!1,error:`Please enter your ${r} profile URL or username`}:{valid:!0,url:t.baseUrl+o.replace(/^@/,"")}}}return{valid:!1,error:`Please enter a valid ${r} URL or username`}}return{valid:!1,error:"Invalid URL"}}function ge(){const e=[];return["website","instagram","facebook","linkedin","tiktok","youtube"].forEach(i=>{const t=s[i];if(t&&t.trim()){const a=Y(t,i);a.valid?s[i]=a.url:e.push({platform:i,error:a.error})}}),e}async function fe(){try{const{data:e,error:r}=await g.from("directories").select("id, name, slug").order("display_order");if(r)throw r;const{data:i,error:t}=await g.from("sub_directories").select("id, name, slug, directory_id").order("name");if(t)throw t;const{data:a,error:n}=await g.from("creative_space_categories").select("id, name, slug").order("name");if(n)throw n;const{data:o,error:l}=await g.from("supplier_categories").select("id, name, slug").order("name");if(l)throw l;return k={directories:e||[],subDirectories:i||[],spaceCategories:a||[],supplierCategories:o||[]},k}catch(e){throw console.error("Error loading categories:",e),e}}async function be(){try{const{data:e,error:r}=await g.from("suburbs").select("id, name, webflow_id").order("name");if(r)throw r;return E=e||[],E}catch(e){return console.error("Error loading suburbs:",e),[]}}async function ye(e){const{data:r,error:i}=await _("ensure");return r||(console.error("getOrCreateMember failed:",i),null)}async function he(e){if(!e)return null;try{const{data:r,error:i}=await g.from("membership_types").select("id").eq("slug",e).single();return i||!r?(console.warn("Membership type not found for slug:",e),null):r.id}catch(r){return console.error("Error looking up membership type:",r),null}}async function ve(e,r){if(!e)return null;let i=e,t=1;for(;;){const{data:a,error:n}=await _("slug-check",{slug:i});if(n)return console.error("Error checking slug:",n),i;if(a!=null&&a.available)return i;t++,i=`${e}-${t}`,console.log(`Slug conflict, trying: ${i}`)}}const W=3*1024*1024,F=2e3;async function xe(e){return e.size<=W?(console.log(`Image ${e.name} is ${(e.size/1024/1024).toFixed(2)}MB - no compression needed`),e):(console.log(`Compressing image ${e.name} from ${(e.size/1024/1024).toFixed(2)}MB...`),new Promise((r,i)=>{const t=new Image,a=document.createElement("canvas"),n=a.getContext("2d");t.onload=()=>{let{width:o,height:l}=t;if(o>F||l>F){const p=Math.min(F/o,F/l);o=Math.round(o*p),l=Math.round(l*p)}a.width=o,a.height=l,n.drawImage(t,0,0,o,l);const d=p=>{a.toBlob(c=>{if(!c){i(new Error("Failed to compress image"));return}if(console.log(`Compressed to ${(c.size/1024/1024).toFixed(2)}MB at quality ${p}`),c.size<=W||p<=.3){const m=new File([c],e.name,{type:"image/jpeg",lastModified:Date.now()});r(m)}else d(p-.1)},"image/jpeg",p)};d(.8)},t.onerror=()=>i(new Error("Failed to load image for compression")),t.src=URL.createObjectURL(e)}))}async function $(e,r,i){try{const t=await xe(e),{data:a}=await g.storage.from(O).list(r);if(a&&a.length>0){const p=a.filter(c=>c.name.startsWith(`${i}_`)).map(c=>`${r}/${c.name}`);if(p.length>0){const{error:c}=await g.storage.from(O).remove(p);c?console.warn("Error deleting old images:",c):console.log(`Deleted ${p.length} old ${i} image(s)`)}}const n=`${i}_${Date.now()}.jpg`,o=`${r}/${n}`,{error:l}=await g.storage.from(O).upload(o,t,{cacheControl:"3600",upsert:!0});if(l)throw l;const{data:{publicUrl:d}}=g.storage.from(O).getPublicUrl(o);return d}catch(t){throw console.error(`Error uploading ${i} image:`,t),t}}async function C(e){var r;if(!(!(u!=null&&u.id)||!g))try{const i=u.id,t={onboarding_step:e,onboarding_started_at:new Date().toISOString()};if(s.profileImageFile){const n=await $(s.profileImageFile,i,"profile");t.profile_image_url=n,s.profileImageUrl=n,s.profileImageFile=null}else s.profileImageUrl&&(t.profile_image_url=s.profileImageUrl);if(s.featureImageFile){const n=await $(s.featureImageFile,i,"feature");t.header_image_url=n,s.featureImageUrl=n,s.featureImageFile=null}else s.featureImageUrl&&(t.header_image_url=s.featureImageUrl);s.bio&&(t.bio=s.bio),s.businessName&&(t.business_name=s.businessName),(r=s.suburb)!=null&&r.id&&(t.suburb_id=s.suburb.id),s.businessAddress&&(t.business_address=s.businessAddress),t.show_address=s.displayAddress,t.show_opening_hours=s.displayOpeningHours,s.openingHours.monday&&(t.opening_monday=s.openingHours.monday),s.openingHours.tuesday&&(t.opening_tuesday=s.openingHours.tuesday),s.openingHours.wednesday&&(t.opening_wednesday=s.openingHours.wednesday),s.openingHours.thursday&&(t.opening_thursday=s.openingHours.thursday),s.openingHours.friday&&(t.opening_friday=s.openingHours.friday),s.openingHours.saturday&&(t.opening_saturday=s.openingHours.saturday),s.openingHours.sunday&&(t.opening_sunday=s.openingHours.sunday),s.website&&(t.website=s.website),s.instagram&&(t.instagram=s.instagram),s.facebook&&(t.facebook=s.facebook),s.linkedin&&(t.linkedin=s.linkedin),s.tiktok&&(t.tiktok=s.tiktok),s.youtube&&(t.youtube=s.youtube);const{error:a}=await _("save",{fields:t});a?console.warn("Error saving progress:",a):console.log(`Progress saved at step ${e}`)}catch(i){console.warn("Error saving progress:",i)}}async function we(){if(!(u!=null&&u.id)||!g)return null;try{const{data:e,error:r}=await _("get");if(r||!e)return null;if(e.onboarding_step&&e.onboarding_step>0){if(console.log("Restoring progress from step",e.onboarding_step),e.profile_image_url&&(s.profileImageUrl=e.profile_image_url),e.header_image_url&&(s.featureImageUrl=e.header_image_url),e.bio&&(s.bio=e.bio),e.business_name&&(s.businessName=e.business_name),e.suburb_id){const o=E.find(l=>l.id===e.suburb_id);o&&(s.suburb={id:o.id,name:o.name})}e.business_address&&(s.businessAddress=e.business_address),s.displayAddress=e.show_address||!1,s.displayOpeningHours=e.show_opening_hours||!1,s.openingHours={monday:e.opening_monday||"",tuesday:e.opening_tuesday||"",wednesday:e.opening_wednesday||"",thursday:e.opening_thursday||"",friday:e.opening_friday||"",saturday:e.opening_saturday||"",sunday:e.opening_sunday||""},e.website&&(s.website=e.website),e.instagram&&(s.instagram=e.instagram),e.facebook&&(s.facebook=e.facebook),e.linkedin&&(s.linkedin=e.linkedin),e.tiktok&&(s.tiktok=e.tiktok),e.youtube&&(s.youtube=e.youtube),e.is_creative_space?s.spaceOrSupplier="space":e.is_supplier&&(s.spaceOrSupplier="supplier");const i=e.id,{data:t}=await g.from("member_sub_directories").select("sub_directory_id").eq("member_id",i);t&&(s.chosenDirectories=t.map(o=>o.sub_directory_id));const{data:a}=await g.from("member_space_categories").select("space_category_id").eq("member_id",i);a&&(s.spaceCategories=a.map(o=>o.space_category_id));const{data:n}=await g.from("member_supplier_categories").select("supplier_category_id").eq("member_id",i);return n&&(s.supplierCategories=n.map(o=>o.supplier_category_id)),e.onboarding_step}return null}catch(e){return console.warn("Error loading saved progress:",e),null}}async function ke(){var r,i,t,a,n,o,l;const e=u.id;try{let d=s.profileImageUrl,p=s.featureImageUrl;s.profileImageFile&&(d=await $(s.profileImageFile,e,"profile")),s.featureImageFile&&(p=await $(s.featureImageFile,e,"feature"));const c=(r=u==null?void 0:u.customFields)==null?void 0:r["membership-type"],m=await he(c);console.log("Membership type:",c,"-> ID:",m);const b=["small-business","large-business","not-for-profit","partner","spaces-suppliers"],h=(c==null?void 0:c.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""))||"",v=b.includes(h)&&s.businessName,S=`${((i=u.customFields)==null?void 0:i["first-name"])||""} ${((t=u.customFields)==null?void 0:t["last-name"])||""}`.trim(),x=v?s.businessName:S||s.businessName||"member",I=x.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),V=await ve(I,e);console.log("Slug generation:",{membershipType:c,useBusinessName:v,displayName:x,slug:V});const Q=!!d,K=!!p,ee=s.bio&&s.bio.length>=50,se=s.chosenDirectories.length>0||s.spaceCategories.length>0||s.supplierCategories.length>0,re=!!((a=s.suburb)!=null&&a.id),M=Q&&K&&ee&&se&&re,{data:N}=await _("get"),te=(N==null?void 0:N.profile_completed_at)||(M?new Date().toISOString():null);console.log("Profile completion check:",{hasProfileImage:Q,hasFeatureImage:K,hasBio:ee,hasCategories:se,hasLocation:re,isProfileComplete:M,profileCompletedAt:te});const Re={membership_type_id:m,profile_image_url:d,header_image_url:p,bio:s.bio,slug:V,name:x,business_name:s.businessName||null,suburb_id:((n=s.suburb)==null?void 0:n.id)||null,business_address:s.businessAddress||null,show_address:s.displayAddress,show_opening_hours:s.displayOpeningHours,opening_monday:s.openingHours.monday||null,opening_tuesday:s.openingHours.tuesday||null,opening_wednesday:s.openingHours.wednesday||null,opening_thursday:s.openingHours.thursday||null,opening_friday:s.openingHours.friday||null,opening_saturday:s.openingHours.saturday||null,opening_sunday:s.openingHours.sunday||null,website:s.website||null,instagram:s.instagram||null,facebook:s.facebook||null,linkedin:s.linkedin||null,tiktok:s.tiktok||null,youtube:s.youtube||null,is_creative_space:s.spaceOrSupplier==="space",is_supplier:s.spaceOrSupplier==="supplier",profile_complete:M,profile_completed_at:te},{data:ie,error:oe}=await _("save",{fields:{first_name:((o=u.customFields)==null?void 0:o["first-name"])||null,last_name:((l=u.customFields)==null?void 0:l["last-name"])||null,...Re}});if(oe)throw oe;const L=ie.id;if(await g.from("member_sub_directories").delete().eq("member_id",L),await g.from("member_space_categories").delete().eq("member_id",L),await g.from("member_supplier_categories").delete().eq("member_id",L),s.chosenDirectories.length>0){const T=s.chosenDirectories.map(P=>({member_id:L,sub_directory_id:P}));await g.from("member_sub_directories").insert(T)}if(s.spaceCategories.length>0){const T=s.spaceCategories.map(P=>({member_id:L,space_category_id:P}));await g.from("member_space_categories").insert(T)}if(s.supplierCategories.length>0){const T=s.supplierCategories.map(P=>({member_id:L,supplier_category_id:P}));await g.from("member_supplier_categories").insert(T)}return await window.$memberstackDom.updateMember({customFields:{"onboarding-complete":"true"}}),console.log("Onboarding data saved to Supabase successfully"),await Se(L),console.log("Onboarding data synced to Webflow successfully"),ie}catch(d){throw console.error("Error saving onboarding data:",d),d}}async function Se(e){try{const{data:r,error:i}=await _("get");if(i||!r){console.warn("Failed to fetch member for Webflow sync:",i);return}const t=await fetch(`${z}/functions/v1/sync-to-webflow`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${U}`,apikey:U},body:JSON.stringify({type:"UPDATE",table:"members",schema:"public",record:r,old_record:null})});if(t.ok)console.log("Webflow sync completed");else{const a=await t.text();console.warn("Webflow sync returned error:",t.status,a)}}catch(r){console.warn("Failed to sync to Webflow:",r)}}function q(e){var i;(i=u==null?void 0:u.customFields)==null||i["membership-type"],D=5;let r='<div class="ms-progress">';for(let t=1;t<=D;t++){let a="ms-progress-step";t<f&&(a+=" completed"),t===f&&(a+=" active"),r+=`<div class="${a}"></div>`}return r+="</div>",r}function _e(e){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Let's set up your public profile. This should only take a few minutes.</p>
        </div>
        ${q()}
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
    `,Ce(e)}function Ce(e){const r=e.querySelector("#profile-upload"),i=e.querySelector("#feature-upload"),t=e.querySelector("#profile-file-input"),a=e.querySelector("#feature-file-input"),n=e.querySelector("#ms-next-btn"),o=e.querySelector("#ms-error-banner");function l(){s.profileImageUrl?(r.innerHTML=`
          <img src="${s.profileImageUrl}" class="ms-image-preview profile" alt="Profile preview">
          <button type="button" class="ms-image-remove" data-remove="profile">&times;</button>
        `,r.classList.add("has-image")):(r.innerHTML=`
          <input type="file" accept="image/*" id="profile-file-input">
          <div class="ms-image-upload-text">
            <strong>Click to upload</strong><br>
            Square image recommended
          </div>
        `,r.classList.remove("has-image"),r.querySelector("#profile-file-input").addEventListener("change",p))}function d(){s.featureImageUrl?(i.innerHTML=`
          <img src="${s.featureImageUrl}" class="ms-image-preview" alt="Feature preview">
          <button type="button" class="ms-image-remove" data-remove="feature">&times;</button>
        `,i.classList.add("has-image")):(i.innerHTML=`
          <input type="file" accept="image/*" id="feature-file-input">
          <div class="ms-image-upload-text">
            <strong>Click to upload</strong><br>
            Landscape image recommended
          </div>
        `,i.classList.remove("has-image"),i.querySelector("#feature-file-input").addEventListener("change",c))}async function p(m){const b=m.target.files[0];if(b){s.profileImageFile=b,s.profileImageUrl=URL.createObjectURL(b),l(),o.style.display="none";try{const h=await $(b,u.id,"profile");s.profileImageUrl=h,s.profileImageFile=null,l(),await C(1),console.log("Profile image auto-saved")}catch(h){console.error("Auto-save profile image failed:",h)}}}async function c(m){const b=m.target.files[0];if(b){s.featureImageFile=b,s.featureImageUrl=URL.createObjectURL(b),d(),o.style.display="none";try{const h=await $(b,u.id,"feature");s.featureImageUrl=h,s.featureImageFile=null,d(),await C(1),console.log("Feature image auto-saved")}catch(h){console.error("Auto-save feature image failed:",h)}}}t.addEventListener("change",p),a.addEventListener("change",c),r.addEventListener("click",m=>{m.target.dataset.remove==="profile"&&(m.stopPropagation(),s.profileImageUrl=null,s.profileImageFile=null,l())}),i.addEventListener("click",m=>{m.target.dataset.remove==="feature"&&(m.stopPropagation(),s.featureImageUrl=null,s.featureImageFile=null,d())}),l(),d(),n.addEventListener("click",async()=>{if(!s.profileImageUrl){y(o,"Please upload a profile image");return}if(!s.featureImageUrl){y(o,"Please upload a feature image");return}f=2,await C(f),w(e)})}function Le(e){var t;const r=(t=u==null?void 0:u.customFields)==null?void 0:t["membership-type"],i=R(r);e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Tell us about yourself${i?" and your business":""}.</p>
        </div>
        ${q()}
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
            <div class="ms-char-count"><span id="ms-bio-count">${s.bio.length}</span> / 2000 characters (minimum 50)</div>
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `,Ee(e,i)}function Ee(e,r){const i=e.querySelector("#ms-bio"),t=e.querySelector("#ms-bio-count"),a=r?e.querySelector("#ms-business-name"):null,n=r?e.querySelector("#ms-slug-preview"):null,o=r?e.querySelector("#ms-slug-status"):null,l=e.querySelector("#ms-back-btn"),d=e.querySelector("#ms-next-btn"),p=e.querySelector("#ms-error-banner");let c=null,m=!0;if(i.addEventListener("input",()=>{s.bio=i.value,t.textContent=i.value.length}),a&&o){const b=(v,S)=>{o.className="ms-slug-status "+v;const x=o.querySelector(".ms-slug-icon"),I=o.querySelector(".ms-slug-message");v==="available"?(x.textContent="✓",I.textContent=S||"This name is available",m=!0):v==="taken"?(x.textContent="✗",I.textContent=S||"This name is already taken",m=!1):v==="checking"?(x.textContent="...",I.textContent="Checking availability..."):v==="invalid"?(x.textContent="!",I.textContent=S||"Name must be at least 4 characters",m=!1):(o.className="ms-slug-status",m=!0)},h=async v=>{const S=ue(v);if(n&&(n.textContent=S?`Your URL: mtnsmade.com.au/members/${S}`:""),v.trim().length<4){v.trim().length>0?b("invalid","Name must be at least 4 characters"):b("");return}b("checking");const x=await me(S,H==null?void 0:H.id);x.available?b("available"):b("taken",x.error)};a.addEventListener("input",()=>{s.businessName=a.value,c&&clearTimeout(c),c=setTimeout(()=>{h(a.value)},500)}),s.businessName&&h(s.businessName)}l.addEventListener("click",()=>{f=1,w(e)}),d.addEventListener("click",async()=>{if(r&&!s.businessName.trim()){y(p,"Please enter your business name");return}if(r&&!m){y(p,"This business name is already taken. Please choose a different name.");return}if(!s.bio.trim()){y(p,"Please enter a bio");return}if(s.bio.trim().length<50){y(p,"Please enter at least 50 characters for your bio");return}f=3,await C(f),w(e)})}function $e(e){var t;const r=(t=u==null?void 0:u.customFields)==null?void 0:t["membership-type"],i=pe(r);e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Select the categories that best describe your work.</p>
        </div>
        ${q()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 3: Categories</h3>
          <p class="ms-step-description">Choose categories so people can find you in the directory. Select at least one.</p>

          <div id="categories-container">
            ${i?Ie():qe()}
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `,Te(e,i)}function Ie(){return`
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
        ${s.spaceOrSupplier==="space"?Z():""}
        ${s.spaceOrSupplier==="supplier"?X():""}
      </div>
    `}function Z(){let e='<div class="ms-category-section"><div class="ms-category-header" style="font-weight:600;margin-bottom:12px;">Select Space Categories</div><div class="ms-category-grid">';return k.spaceCategories.forEach(r=>{const i=s.spaceCategories.includes(r.id);e+=`
        <label class="ms-category-item ${i?"selected":""}" data-id="${r.id}">
          <input type="checkbox" value="${r.id}" ${i?"checked":""}>
          ${r.name}
        </label>
      `}),e+='</div><div class="ms-selected-count"><span id="space-count">'+s.spaceCategories.length+"</span> selected</div></div>",e}function X(){let e='<div class="ms-category-section"><div class="ms-category-header" style="font-weight:600;margin-bottom:12px;">Select Supplier Categories</div><div class="ms-category-grid">';return k.supplierCategories.forEach(r=>{const i=s.supplierCategories.includes(r.id);e+=`
        <label class="ms-category-item ${i?"selected":""}" data-id="${r.id}">
          <input type="checkbox" value="${r.id}" ${i?"checked":""}>
          ${r.name}
        </label>
      `}),e+='</div><div class="ms-selected-count"><span id="supplier-count">'+s.supplierCategories.length+"</span> selected</div></div>",e}function Ue(e){const r=k.subDirectories.find(i=>i.id===e);return r?r.name:e}function qe(){let e='<div class="ms-category-selector">';return e+='<div class="ms-parent-categories">',k.directories.forEach(r=>{e+=`<button type="button" class="ms-parent-btn" data-parent="${r.id}">${r.name}</button>`}),e+="</div>",k.directories.forEach(r=>{const i=k.subDirectories.filter(t=>t.directory_id===r.id);e+=`<div class="ms-child-categories" data-parent="${r.id}">`,i.forEach(t=>{const a=s.chosenDirectories.includes(t.id);e+=`<button type="button" class="ms-child-btn ${a?"selected":""}" data-id="${t.id}">${t.name}</button>`}),e+="</div>"}),e+=`
      <div class="ms-selected-categories" id="ms-selected-section" style="${s.chosenDirectories.length?"":"display: none;"}">
        <h5>Selected Categories</h5>
        <div class="ms-selected-list" id="ms-selected-list"></div>
      </div>
    </div>`,e}function Te(e,r){const i=e.querySelector("#ms-back-btn"),t=e.querySelector("#ms-next-btn"),a=e.querySelector("#ms-error-banner");if(i.addEventListener("click",()=>{f=2,w(e)}),r){const n=e.querySelector("#radio-space"),o=e.querySelector("#radio-supplier"),l=e.querySelector("#space-supplier-categories");n.addEventListener("click",()=>{s.spaceOrSupplier="space",s.supplierCategories=[],n.classList.add("selected"),o.classList.remove("selected"),l.innerHTML=Z(),l.style.display="block",A(e,"spaceCategories","space-count")}),o.addEventListener("click",()=>{s.spaceOrSupplier="supplier",s.spaceCategories=[],o.classList.add("selected"),n.classList.remove("selected"),l.innerHTML=X(),l.style.display="block",A(e,"supplierCategories","supplier-count")}),s.spaceOrSupplier==="space"?A(e,"spaceCategories","space-count"):s.spaceOrSupplier==="supplier"&&A(e,"supplierCategories","supplier-count"),t.addEventListener("click",async()=>{if(!s.spaceOrSupplier){y(a,"Please select whether you are a Creative Space or Supplier");return}if((s.spaceOrSupplier==="space"?s.spaceCategories.length:s.supplierCategories.length)===0){y(a,"Please select at least one category");return}f=4,await C(f),w(e)})}else Pe(e),t.addEventListener("click",async()=>{if(s.chosenDirectories.length===0){y(a,"Please select at least one category");return}f=4,await C(f),w(e)})}function Pe(e){const r=e.querySelectorAll(".ms-parent-btn"),i=e.querySelectorAll(".ms-child-categories"),t=e.querySelector("#ms-selected-list"),a=e.querySelector("#ms-selected-section");function n(){!t||!a||(t.innerHTML=s.chosenDirectories.map(o=>`<span class="ms-selected-tag">${Ue(o)}<button type="button" data-id="${o}">&times;</button></span>`).join(""),a.style.display=s.chosenDirectories.length?"":"none",e.querySelectorAll(".ms-child-btn").forEach(o=>{const l=o.dataset.id;o.classList.toggle("selected",s.chosenDirectories.includes(l))}))}n(),r.forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.parent,d=o.classList.contains("active");r.forEach(p=>p.classList.remove("active")),i.forEach(p=>p.classList.remove("visible")),d||(o.classList.add("active"),e.querySelector(`.ms-child-categories[data-parent="${l}"]`).classList.add("visible"))})}),e.querySelectorAll(".ms-child-btn").forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.id,d=s.chosenDirectories.indexOf(l);d===-1?s.chosenDirectories.push(l):s.chosenDirectories.splice(d,1),n()})}),t&&t.addEventListener("click",o=>{if(o.target.tagName==="BUTTON"){const l=o.target.dataset.id,d=s.chosenDirectories.indexOf(l);d!==-1&&(s.chosenDirectories.splice(d,1),n())}})}function A(e,r,i){e.querySelectorAll(".ms-category-item").forEach(t=>{t.addEventListener("click",a=>{a.preventDefault();const n=t.dataset.id,o=s[r].indexOf(n);o===-1?(s[r].push(n),t.classList.add("selected")):(s[r].splice(o,1),t.classList.remove("selected"));const l=e.querySelector("#"+i);l&&(l.textContent=s[r].length),r==="chosenDirectories"&&Oe(e)})})}function Oe(e){e.querySelectorAll(".ms-accordion").forEach(r=>{const i=r.dataset.parent,a=k.subDirectories.filter(o=>o.directory_id===i).filter(o=>s.chosenDirectories.includes(o.id)).length,n=r.querySelector(".ms-accordion-count");n.textContent=a>0?`(${a} selected)`:""})}function Fe(e){var n;const r=(n=u==null?void 0:u.customFields)==null?void 0:n["membership-type"],i=R(r),t=i?"Step 4: Location & Hours":"Step 4: Location",a=i?"Select your suburb and optionally add address details.":"Select your suburb so members can find you in the directory.";e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>${i?"Add your business location and hours.":"Add your location."}</p>
        </div>
        ${q()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">${t}</h3>
          <p class="ms-step-description">${a}</p>

          <div class="ms-form-field">
            <label>Suburb <span class="required">*</span></label>
            <select class="ms-form-input" id="ms-suburb-select">
              <option value="">Select your suburb...</option>
              ${E.filter(o=>{var l;return!le.includes(o.name)||((l=s.suburb)==null?void 0:l.id)===o.id}).map(o=>{var l;return`<option value="${o.id}" ${((l=s.suburb)==null?void 0:l.id)===o.id?"selected":""}>${o.name}</option>`}).join("")}
            </select>
            <div class="ms-hint">This helps members find you in the directory</div>
          </div>

          ${i?`
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
              ${B.map(o=>`
                <div class="ms-hours-row">
                  <span class="ms-hours-day">${o}</span>
                  <input type="text" class="ms-hours-input" id="ms-hours-${o.toLowerCase()}"
                    value="${s.openingHours[o.toLowerCase()]}"
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
    `,Ae(e)}function Ae(e){const r=e.querySelector("#ms-suburb-select"),i=e.querySelector("#ms-address"),t=e.querySelector("#ms-display-address"),a=e.querySelector("#ms-display-hours"),n=e.querySelector("#ms-back-btn"),o=e.querySelector("#ms-next-btn"),l=e.querySelector("#ms-error-banner");r.addEventListener("change",()=>{const d=r.options[r.selectedIndex];d.value?s.suburb={id:d.value,name:d.text}:s.suburb=null}),i&&i.addEventListener("input",()=>{s.businessAddress=i.value}),t&&t.addEventListener("change",()=>{s.displayAddress=t.checked}),a&&a.addEventListener("change",()=>{s.displayOpeningHours=a.checked}),B.forEach(d=>{const p=e.querySelector(`#ms-hours-${d.toLowerCase()}`);p&&p.addEventListener("input",()=>{s.openingHours[d.toLowerCase()]=p.value})}),n.addEventListener("click",()=>{f=3,w(e)}),o.addEventListener("click",async()=>{if(!s.suburb){y(l,"Please select your suburb");return}f=5,await C(f),w(e)})}function ze(e){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Almost done! Add your online presence.</p>
        </div>
        ${q()}
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
    `,He(e)}function He(e){const r=e.querySelector("#ms-back-btn"),i=e.querySelector("#ms-submit-btn"),t=e.querySelector("#ms-error-banner"),a=["website","instagram","facebook","linkedin","tiktok","youtube"];a.forEach(n=>{const o=e.querySelector(`#ms-${n}`),l=o.closest(".ms-link-field");let d=l.querySelector(".ms-field-error");d||(d=document.createElement("div"),d.className="ms-field-error",d.style.cssText="grid-column: 2;",l.appendChild(d)),o.addEventListener("input",()=>{s[n]=o.value,o.classList.remove("error"),d.textContent=""}),o.addEventListener("blur",()=>{const p=o.value.trim();if(!p){o.classList.remove("error"),d.textContent="";return}const c=Y(p,n);c.valid?(c.url!==p&&(o.value=c.url,s[n]=c.url),o.classList.remove("error"),d.textContent=""):(o.classList.add("error"),d.textContent=c.error)})}),r.addEventListener("click",()=>{f=4,w(e)}),i.addEventListener("click",async()=>{const n=ge();if(n.length>0){n.forEach(({platform:o,error:l})=>{const d=e.querySelector(`#ms-${o}`),c=d.closest(".ms-link-field").querySelector(".ms-field-error");d.classList.add("error"),c&&(c.textContent=l)}),y(t,"Please fix the highlighted fields before continuing");return}a.forEach(o=>{const l=e.querySelector(`#ms-${o}`);s[o]&&(l.value=s[o])}),i.disabled=!0,i.textContent="Saving...";try{await ke(),Me(e)}catch(o){console.error("Submit error:",o),i.disabled=!1,i.textContent="Complete Profile",y(t,"An error occurred. Please try again.")}})}function Me(e){var d,p;const t=`/members/${(s.businessName||`${((d=u.customFields)==null?void 0:d["first-name"])||""} ${((p=u.customFields)==null?void 0:p["last-name"])||""}`.trim()).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}`,a=[{text:"Creating your profile page",icon:"1",duration:800},{text:"Uploading profile images",icon:"2",duration:1200},{text:"Setting up your categories",icon:"3",duration:900},{text:"Finalizing your listing",icon:"4",duration:700}];e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form ms-loading-screen">
          <div class="ms-loading-spinner"></div>
          <h2 style="margin: 0 0 24px 0; color: #333;">Setting Up Your Profile</h2>
          <div class="ms-loading-steps">
            ${a.map((c,m)=>`
              <div class="ms-loading-step" data-step="${m}">
                <span class="ms-loading-step-icon">${c.icon}</span>
                <span>${c.text}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;const n=e.querySelectorAll(".ms-loading-step");let o=0;function l(){if(o>0&&n[o-1]){n[o-1].classList.remove("active"),n[o-1].classList.add("complete");const c=n[o-1].querySelector(".ms-loading-step-icon");c&&(c.textContent="✓")}if(o<n.length){n[o].classList.add("active");const c=a[o].duration;o++,setTimeout(l,c)}else setTimeout(()=>{Ne(e,t)},500)}setTimeout(l,300)}function Ne(e,r){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form ms-success-screen">
          <div class="ms-success-icon">✓</div>
          <h2 class="ms-success-title">Profile Complete!</h2>
          <p class="ms-success-subtitle">Your MTNS MADE profile is now live and ready to be discovered.</p>
          <div class="ms-success-buttons">
            <a href="${r}" class="ms-success-btn ms-success-btn-primary">View my MTNS MADE Profile</a>
            <a href="/profile/start" class="ms-success-btn ms-success-btn-secondary">Go to my Dashboard</a>
          </div>
        </div>
      </div>
    `}function w(e){switch(f){case 1:_e(e);break;case 2:Le(e);break;case 3:$e(e);break;case 4:Fe(e);break;case 5:ze(e);break}}function y(e,r){e.textContent=r,e.style.display="block",e.scrollIntoView({behavior:"smooth",block:"center"})}function De(e){e.innerHTML=`
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
    `}function Be(e){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form" style="text-align: center; padding: 48px 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">&#10003;</div>
          <h2 style="margin: 0 0 8px 0;">Profile Already Complete</h2>
          <p style="color: #666; margin-bottom: 24px;">You've already completed your profile setup.</p>
          <a href="/profile/start" class="ms-btn" style="display: inline-block; text-decoration: none;">Go to Dashboard</a>
        </div>
      </div>
    `}function G(e,r){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form">
          <div class="ms-error-banner" style="display: block;">${r}</div>
        </div>
      </div>
    `}async function J(){var i,t,a;const e=document.querySelector(".onboarding-form")||document.querySelector(".supabase-onboarding-container");if(!e){console.warn("Could not find onboarding container (.onboarding-form or .supabase-onboarding-container)");return}const r=document.createElement("style");r.textContent=de,document.head.appendChild(r),e.innerHTML='<div class="ms-loading">Loading...</div>';try{await ce(),g=window.supabase.createClient(z,U);const{data:n}=await window.$memberstackDom.getCurrentMember();if(!n){De(e);return}if(u=n,!await ye(u.id)){G(e,"Unable to load your profile. Please refresh or contact support.");return}if(((i=n.customFields)==null?void 0:i["onboarding-complete"])==="true"){Be(e);return}await fe(),await be();const l=(t=n.customFields)==null?void 0:t["suburb-id"],d=(a=n.customFields)==null?void 0:a.suburb;if(l&&d){const c=E.find(m=>m.webflow_id===l);if(c)s.suburb={id:c.id,name:c.name},console.log("Pre-populated suburb from signup (matched to Supabase):",s.suburb);else{const m=E.find(b=>b.name===d);m?(s.suburb={id:m.id,name:m.name},console.log("Pre-populated suburb from signup (matched by name):",s.suburb)):console.warn("Could not find suburb in Supabase:",l,d)}}const p=await we();p&&p>1&&(f=p,console.log("Resuming onboarding from step",f)),w(e)}catch(n){console.error("Init error:",n),G(e,"Error loading onboarding. Please refresh the page.")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",J):J()})();
