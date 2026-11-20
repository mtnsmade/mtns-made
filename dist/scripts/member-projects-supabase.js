(function(){console.log("Member projects Supabase script loaded");const q="https://epszwomtxkpjegbjbixr.supabase.co",w="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH";async function J(r,e={}){try{const o=window.$memberstackDom,t=(o&&typeof o.getMemberCookie=="function"?await o.getMemberCookie():"")||"",i=await fetch(`${q}/functions/v1/member-self`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`,apikey:w,"X-Member-Token":t},body:JSON.stringify({action:r,...e})}),s=await i.json().catch(()=>({}));return i.ok?{data:"member"in s?s.member:s,error:null}:{data:null,error:{message:s.error||`member-self ${r} failed`,status:i.status}}}catch(o){return{data:null,error:o}}}const I="project-images",_=20,W={emerging:2,professional:5,"small-business":5,"not-for-profit":5,"large-business":8,"spaces-suppliers":5};let f=null,b=null,y=[],x={directories:[],subDirectories:[]},$=!1;const X=`
    .mp-container {
      font-family: inherit;
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      overflow-x: visible !important;
      overflow: visible !important;
    }
    .mp-container * {
      box-sizing: border-box !important;
    }
    .mp-projects-list {
      width: 100% !important;
      max-width: 100% !important;
    }
    .mp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .mp-header h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
    .mp-header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .mp-project-count {
      font-size: 14px;
      color: #666;
    }
    .mp-btn-disabled {
      background: #ccc !important;
      cursor: not-allowed !important;
    }
    .mp-btn-disabled:hover {
      background: #ccc !important;
    }
    .mp-btn {
      background: #333;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .mp-btn:hover {
      background: #555;
    }
    .mp-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .mp-btn-secondary {
      background: #fff;
      color: #333;
      border: 1px solid #ddd;
    }
    .mp-btn-secondary:hover {
      background: #f5f5f5;
    }
    .mp-btn-danger {
      background: #dc3545;
    }
    .mp-btn-danger:hover {
      background: #c82333;
    }
    .mp-btn-small {
      padding: 6px 12px;
      font-size: 12px;
    }
    a.mp-btn {
      text-decoration: none !important;
      display: inline-block;
    }
    .mp-view-btn {
      background: #007bff !important;
      color: #fff !important;
      border: none !important;
    }
    .mp-view-btn:hover {
      background: #0056b3 !important;
    }
    .mp-loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    .mp-empty {
      text-align: center;
      padding: 40px;
      background: #f9f9f9;
      border-radius: 8px;
      border: 2px dashed #ddd;
    }
    .mp-empty p {
      margin: 0 0 16px 0;
      color: #666;
    }
    .mp-project-card {
      border: 1px solid #e0e0e0 !important;
      border-radius: 8px !important;
      margin-bottom: 12px !important;
      background: #fff !important;
      overflow: visible !important;
      position: relative !important;
      box-sizing: border-box !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    .mp-project-card * {
      box-sizing: border-box;
    }
    .mp-project-header {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 16px 20px !important;
      flex-wrap: nowrap !important;
    }
    .mp-project-header-left {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      cursor: pointer;
      flex: 1;
      min-width: 0;
    }
    .mp-project-header-left:hover .mp-project-title {
      color: #555;
    }
    .mp-project-header-actions {
      display: flex !important;
      gap: 8px !important;
      flex-shrink: 0 !important;
      visibility: visible !important;
      opacity: 1 !important;
      margin-left: auto !important;
      position: relative !important;
      z-index: 10 !important;
    }
    .mp-project-header-actions button,
    .mp-project-header-actions a {
      display: inline-flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      white-space: nowrap !important;
    }
    .mp-toggle-icon {
      font-size: 10px;
      color: #999;
      transition: transform 0.2s;
    }
    .mp-toggle-icon.open {
      transform: rotate(90deg);
    }
    .mp-project-title {
      margin: 0 !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      color: #333 !important;
      text-transform: none !important;
      letter-spacing: normal !important;
    }
    .mp-project-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s ease-out;
      border-top: 0 solid #e0e0e0;
    }
    .mp-project-content.open {
      max-height: 2000px;
      border-top-width: 1px;
    }
    .mp-project-fields {
      padding: 20px;
    }
    .mp-field {
      margin-bottom: 16px;
    }
    .mp-field:last-child {
      margin-bottom: 0;
    }
    .mp-field-label {
      font-size: 12px;
      font-weight: 600;
      color: #666;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .mp-field-value {
      padding: 8px 12px;
      background: #f5f5f5;
      border-radius: 4px;
      min-height: 20px;
      color: #333;
    }
    .mp-field-value.empty {
      color: #999;
      font-style: italic;
    }
    .mp-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    .mp-modal {
      background: #fff;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .mp-modal-header {
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
    }
    .mp-modal-header h3 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }
    .mp-modal-body {
      padding: 20px;
    }
    .mp-modal-footer {
      padding: 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    .mp-form-field {
      margin-bottom: 20px;
    }
    .mp-form-field label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
    }
    .mp-form-field label span {
      color: #dc3545;
    }
    .mp-form-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
    }
    .mp-form-input:focus {
      outline: none;
      border-color: #333;
    }
    textarea.mp-form-input {
      min-height: 80px;
      resize: vertical;
    }
    .mp-form-input.error {
      border-color: #dc3545;
    }
    .mp-form-input.valid {
      border-color: #28a745;
    }
    .mp-input-hint {
      font-size: 11px;
      color: #666;
      margin-top: 4px;
    }
    .mp-input-error {
      font-size: 11px;
      color: #dc3545;
      margin-top: 4px;
      display: none;
    }
    .mp-input-error.visible {
      display: block;
    }

    /* Category Selector Styles */
    .mp-category-section {
      margin-bottom: 20px;
    }
    .mp-category-section h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
    .mp-parent-categories {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
    .mp-parent-btn {
      padding: 8px 16px;
      border: 1px solid #333;
      border-radius: 20px;
      background: #fff;
      color: #333;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .mp-parent-btn:hover {
      background: #f5f5f5;
    }
    .mp-parent-btn.active {
      background: #333;
      color: #fff;
    }
    .mp-child-categories {
      display: none;
      flex-wrap: wrap;
      gap: 8px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      margin-top: 12px;
    }
    .mp-child-categories.visible {
      display: flex;
    }
    .mp-child-btn {
      padding: 6px 14px;
      border: 1px solid #ddd;
      border-radius: 16px;
      background: #fff;
      color: #666;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .mp-child-btn:hover {
      border-color: #333;
      color: #333;
    }
    .mp-child-btn.selected {
      background: #e8f4fc;
      border-color: #007bff;
      color: #007bff;
    }
    .mp-selected-categories {
      margin-top: 16px;
      padding: 12px;
      background: #f0f0f0;
      border-radius: 8px;
    }
    .mp-selected-categories h5 {
      margin: 0 0 8px 0;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
    }
    .mp-selected-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .mp-selected-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #333;
      color: #fff;
      border-radius: 12px;
      font-size: 12px;
    }
    .mp-selected-tag button {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 0;
      font-size: 14px;
      line-height: 1;
    }

    /* Image Upload Styles */
    .mp-image-section {
      margin-bottom: 20px;
    }
    .mp-image-section h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    /* Feature Image */
    .mp-feature-upload {
      margin-bottom: 20px;
    }
    .mp-feature-upload-area {
      aspect-ratio: 16/9;
      border: 2px dashed #ddd;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafafa;
      position: relative;
      overflow: hidden;
    }
    .mp-feature-upload-area:hover {
      border-color: #333;
      background: #f5f5f5;
    }
    .mp-feature-upload-area.has-image {
      border-style: solid;
      border-color: #ddd;
    }
    .mp-feature-upload-area img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }
    .mp-feature-upload-area .mp-upload-placeholder {
      text-align: center;
      color: #999;
      font-size: 14px;
    }
    .mp-feature-upload-area .mp-upload-placeholder span {
      display: block;
      font-size: 32px;
      margin-bottom: 8px;
    }
    .mp-feature-upload-area .mp-remove-image {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(220, 53, 69, 0.9);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      display: none;
    }
    .mp-feature-upload-area.has-image .mp-remove-image {
      display: block;
    }
    .mp-feature-upload-area.has-image .mp-upload-placeholder {
      display: none;
    }

    /* Gallery Grid */
    .mp-gallery-section {
      margin-top: 20px;
    }
    .mp-gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .mp-gallery-header h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
    .mp-gallery-count {
      font-size: 12px;
      color: #666;
    }
    .mp-gallery-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .mp-gallery-item {
      aspect-ratio: 1;
      border: 2px dashed #ddd;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafafa;
      position: relative;
      overflow: hidden;
    }
    .mp-gallery-item:hover {
      border-color: #333;
      background: #f5f5f5;
    }
    .mp-gallery-item.has-image {
      border-style: solid;
      border-color: #ddd;
      cursor: grab;
    }
    .mp-gallery-item.has-image:active {
      cursor: grabbing;
    }
    .mp-gallery-item.dragging {
      opacity: 0.5;
    }
    .mp-gallery-item.drag-over {
      border-color: #007bff;
      border-width: 3px;
    }
    .mp-gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }
    .mp-gallery-item .mp-upload-placeholder {
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    .mp-gallery-item .mp-upload-placeholder span {
      display: block;
      font-size: 24px;
      margin-bottom: 4px;
    }
    .mp-gallery-item .mp-remove-image {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(220, 53, 69, 0.9);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      display: none;
      z-index: 10;
    }
    .mp-gallery-item.has-image .mp-remove-image {
      display: block;
    }
    .mp-gallery-item.has-image .mp-upload-placeholder {
      display: none;
    }
    .mp-gallery-item .mp-drag-handle {
      position: absolute;
      bottom: 4px;
      left: 4px;
      background: rgba(0,0,0,0.5);
      color: #fff;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 10px;
      display: none;
    }
    .mp-gallery-item.has-image .mp-drag-handle {
      display: block;
    }

    /* Upload Progress */
    .mp-upload-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: #e0e0e0;
    }
    .mp-upload-progress-bar {
      height: 100%;
      background: #007bff;
      transition: width 0.3s;
    }

    /* Display styles for project card */
    .mp-categories-display {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .mp-category-tag {
      padding: 4px 10px;
      background: #e8f4fc;
      color: #007bff;
      border-radius: 12px;
      font-size: 11px;
    }
    .mp-images-display {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .mp-images-display img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 4px;
    }
    .mp-images-display .mp-feature-thumb {
      grid-column: span 4;
      aspect-ratio: 16/9;
    }

    /* Progress Bar Styles */
    .mp-progress-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10001;
    }
    .mp-progress-container {
      width: 320px;
      text-align: center;
    }
    .mp-progress-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 24px;
    }
    .mp-progress-bar-wrapper {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 16px;
    }
    .mp-progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #333 0%, #555 50%, #333 100%);
      background-size: 200% 100%;
      border-radius: 4px;
      transition: width 0.5s ease-out;
      animation: mp-progress-shimmer 1.5s infinite;
    }
    @keyframes mp-progress-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .mp-progress-status {
      font-size: 14px;
      color: #666;
      min-height: 20px;
      transition: opacity 0.3s;
    }
    .mp-progress-status.fade {
      opacity: 0;
    }
    .mp-progress-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e0e0e0;
      border-top-color: #333;
      border-radius: 50%;
      animation: mp-spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes mp-spin {
      to { transform: rotate(360deg); }
    }
  `;function K(){return window.supabase?(f=window.supabase.createClient(q,w),console.log("Supabase client initialized"),!0):(console.error("Supabase JS library not loaded"),!1)}function M(r){if(!r)return 2;const e=r.toLowerCase();return W[e]||2}function Q(r){return r.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,80)}async function Z(r){const e=Q(r),{data:o}=await f.from("projects").select("slug").eq("slug",e).maybeSingle();if(!o)return e;const{data:t}=await f.from("projects").select("slug").like("slug",`${e}-%`),i=new Set((t||[]).map(p=>p.slug));i.add(e);let s=2;for(;i.has(`${e}-${s}`);)s++;return`${e}-${s}`}function k(r){if(!r||r.trim()==="")return"";let e=r.trim();/^https?:\/\//i.test(e)||(e="https://"+e);try{return new URL(e),e}catch{return""}}function L(r){if(!r||r.trim()==="")return!0;let e=r.trim();/^https?:\/\//i.test(e)||(e="https://"+e);try{const o=new URL(e);if(!o.hostname||!o.hostname.includes("."))return!1;const t=o.hostname.split(".");return!(t[t.length-1].length<2)}catch{return!1}}function S(r){if(!r||r.trim()==="")return!0;let e=r.trim();/^https?:\/\//i.test(e)||(e="https://"+e);try{const t=new URL(e).hostname.toLowerCase();return!!(t.includes("youtube.com")||t.includes("youtu.be")||t.includes("vimeo.com"))}catch{return!1}}async function ee(){try{const{data:r,error:e}=await f.from("directories").select("id, webflow_id, name, slug").order("display_order");if(e)throw e;const{data:o,error:t}=await f.from("sub_directories").select("id, webflow_id, name, slug, directory_slug").order("name");if(t)throw t;return console.log(`Loaded ${r.length} directories and ${o.length} sub-directories`),{directories:r,subDirectories:o}}catch(r){return console.error("Error loading categories:",r),{directories:[],subDirectories:[]}}}async function re(r){try{const{data:e,error:o}=await f.from("projects").select(`
          *,
          project_sub_directories (
            sub_directory_id
          )
        `).eq("memberstack_id",r).eq("is_deleted",!1).order("display_order",{ascending:!0});if(o)throw o;const t=e.map(i=>{var s;return{...i,categories:((s=i.project_sub_directories)==null?void 0:s.map(p=>p.sub_directory_id))||[],gallery_images:i.gallery_images||[]}});return console.log(`Loaded ${t.length} projects for member ${r}`),t}catch(e){return console.error("Error loading projects:",e),[]}}async function te(r){try{const{categories:e,...o}=r,t=await Z(o.name),{data:i,error:s}=await f.from("projects").insert({memberstack_id:b.id,name:o.name,slug:t,description:o.description,feature_image_url:o.feature_image_url||null,gallery_images:o.gallery_images||[],external_link:o.external_link||null,showreel_link:o.showreel_link||null,display_order:o.display_order||0,is_draft:!1,is_deleted:!1}).select().single();if(s)throw s;if(e&&e.length>0){const p=e.map(a=>({project_id:i.id,sub_directory_id:a})),{error:n}=await f.from("project_sub_directories").insert(p);n&&console.error("Error linking categories:",n)}return console.log("Project created:",i.id),{...i,categories:e||[],gallery_images:i.gallery_images||[]}}catch(e){throw console.error("Error creating project:",e),e}}async function oe(r,e){try{const{categories:o,...t}=e,{data:i,error:s}=await f.from("projects").update({name:t.name,description:t.description,feature_image_url:t.feature_image_url||null,gallery_images:t.gallery_images||[],external_link:t.external_link||null,showreel_link:t.showreel_link||null,display_order:t.display_order||0}).eq("id",r).eq("memberstack_id",b.id).select().single();if(s)throw s;const{error:p}=await f.from("project_sub_directories").delete().eq("project_id",r);if(p&&console.error("Error deleting old categories:",p),o&&o.length>0){const n=o.map(d=>({project_id:r,sub_directory_id:d})),{error:a}=await f.from("project_sub_directories").insert(n);a&&console.error("Error linking categories:",a)}return console.log("Project updated:",r),{...i,categories:o||[],gallery_images:i.gallery_images||[]}}catch(o){throw console.error("Error updating project:",o),o}}async function ie(r){try{const{error:e}=await f.from("projects").update({is_deleted:!0}).eq("id",r).eq("memberstack_id",b.id);if(e)throw e;return console.log("Project deleted:",r),!0}catch(e){throw console.error("Error deleting project:",e),e}}async function C(r,e=null){try{const o={memberstack_id:b.id,activity_type:r};e&&(o.entity_type="project",o.entity_id=e.id||null,o.entity_name=e.name||null),await fetch(`${q}/functions/v1/log-activity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${w}`,apikey:w},body:JSON.stringify(o)})}catch(o){console.warn("Failed to log activity:",o)}}const U=3*1024*1024,E=2e3;async function ae(r){const e=(r.size/1024/1024).toFixed(1);return r.size<=U?(console.log(`Image ${r.name} is ${e}MB - no compression needed`),r):(console.log(`Compressing image ${r.name} from ${e}MB...`),new Promise((o,t)=>{const i=new Image,s=document.createElement("canvas"),p=s.getContext("2d");i.onload=()=>{let{width:n,height:a}=i;if(n>E||a>E){const m=Math.min(E/n,E/a);n=Math.round(n*m),a=Math.round(a*m)}s.width=n,s.height=a,p.drawImage(i,0,0,n,a);const d=m=>{s.toBlob(c=>{if(!c){t(new Error("Failed to compress image"));return}const g=(c.size/1024/1024).toFixed(1);if(console.log(`Compressed to ${g}MB at quality ${m}`),c.size<=U||m<=.3){const l=new File([c],r.name,{type:"image/jpeg",lastModified:Date.now()});o(l)}else d(m-.1)},"image/jpeg",m)};d(.8)},i.onerror=()=>t(new Error("Failed to load image for compression")),i.src=URL.createObjectURL(r)}))}async function A(r,e){const o=await ae(r),t=Date.now(),i=o.type==="image/jpeg"?"jpg":r.name.split(".").pop(),s=`${b.id}/${e||"new"}/${t}.${i}`,{data:p,error:n}=await f.storage.from(I).upload(s,o,{cacheControl:"3600",upsert:!1});if(n)throw n;const{data:{publicUrl:a}}=f.storage.from(I).getPublicUrl(s);return console.log("Image uploaded:",a),a}function T(r){const e=x.subDirectories.find(o=>o.id===r);return e?e.name:r}function se(r){return x.subDirectories.filter(e=>e.directory_slug===r)}function N(r){const e=r.querySelector("#mp-form-external_link"),o=r.querySelector("#mp-url-error");if(!e||!o)return;const t=()=>{const i=e.value.trim();i===""?(e.classList.remove("error","valid"),o.classList.remove("visible")):L(i)?(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible")):(e.classList.remove("valid"),e.classList.add("error"),o.classList.add("visible"))};e.addEventListener("blur",t),e.addEventListener("input",()=>{e.classList.contains("error")&&L(e.value)&&(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible"))}),e.value.trim()&&t()}function F(r){const e=r.querySelector("#mp-form-showreel_link"),o=r.querySelector("#mp-showreel-error");if(!e||!o)return;const t=()=>{const i=e.value.trim();i===""?(e.classList.remove("error","valid"),o.classList.remove("visible")):S(i)?(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible")):(e.classList.remove("valid"),e.classList.add("error"),o.classList.add("visible"))};e.addEventListener("blur",t),e.addEventListener("input",()=>{e.classList.contains("error")&&S(e.value)&&(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible"))}),e.value.trim()&&t()}const O=[{text:"Preparing project...",progress:10},{text:"Optimising images...",progress:25},{text:"Compiling data...",progress:45},{text:"Populating categories...",progress:60},{text:"Syncing to portfolio...",progress:80},{text:"Finalising...",progress:95}];function ne(r="Creating Project"){const e=document.createElement("div");return e.className="mp-progress-overlay",e.id="mp-progress-overlay",e.innerHTML=`
      <div class="mp-progress-container">
        <div class="mp-progress-spinner"></div>
        <div class="mp-progress-title">${r}</div>
        <div class="mp-progress-bar-wrapper">
          <div class="mp-progress-bar-fill" style="width: 5%;"></div>
        </div>
        <div class="mp-progress-status">Initialising...</div>
      </div>
    `,document.body.appendChild(e),e}function le(r,e){if(!r)return;const o=O[e];if(!o)return;const t=r.querySelector(".mp-progress-bar-fill"),i=r.querySelector(".mp-progress-status");t&&(t.style.width=o.progress+"%"),i&&(i.classList.add("fade"),setTimeout(()=>{i.textContent=o.text,i.classList.remove("fade")},150))}function de(){const r=document.getElementById("mp-progress-overlay");if(r){const e=r.querySelector(".mp-progress-bar-fill"),o=r.querySelector(".mp-progress-status");e&&(e.style.width="100%"),o&&(o.textContent="Complete!"),setTimeout(()=>{r.remove()},500)}}async function R(r,e="Creating Project"){const o=ne(e);let t=0;const i=setInterval(()=>{t<O.length&&(le(o,t),t++)},600);try{const s=await r();return clearInterval(i),de(),s}catch(s){clearInterval(i);const p=document.getElementById("mp-progress-overlay");throw p&&p.remove(),s}}function j(r){var p;if(!$){r.innerHTML=`
        <div class="mp-empty">
          <p>Complete your profile to start adding projects to your portfolio.</p>
          <a href="/profile/onboarding" class="mp-btn">Complete Profile</a>
        </div>
      `;return}if(y.length===0){r.innerHTML=`
        <div class="mp-empty">
          <p>You don't have any projects yet</p>
          <button class="mp-btn" id="mp-add-first">Add Your First Project</button>
        </div>
      `,r.querySelector("#mp-add-first").addEventListener("click",()=>Y(r));return}const e=(p=b==null?void 0:b.customFields)==null?void 0:p["membership-type"],o=M(e),i=o-y.length<=0;let s=`
      <div class="mp-header">
        <h2>My Projects</h2>
        <div class="mp-header-right">
          <span class="mp-project-count">${y.length} of ${o} projects</span>
          <button class="mp-btn ${i?"mp-btn-disabled":""}" id="mp-add-project" ${i?"disabled":""}>
            ${i?"Limit Reached":"Add Another Project"}
          </button>
        </div>
      </div>
      <div class="mp-projects-list">
    `;y.forEach((n,a)=>{s+=pe(n)}),s+="</div>",r.innerHTML=s,r.querySelector("#mp-add-project").addEventListener("click",()=>{var d;const n=(d=b==null?void 0:b.customFields)==null?void 0:d["membership-type"],a=M(n);if(y.length>=a){ue(a,n);return}Y(r)}),r.querySelectorAll(".mp-project-card").forEach((n,a)=>{const d=y[a];ce(n,d,r)})}function pe(r,e){let o="";const t=r.description||"";o+=`
      <div class="mp-field">
        <div class="mp-field-label">Description</div>
        <div class="mp-field-value ${t?"":"empty"}">
          ${t||"No description"}
        </div>
      </div>
    `;const i=r.categories||[];o+=`
      <div class="mp-field">
        <div class="mp-field-label">Categories</div>
        <div class="mp-categories-display">
          ${i.length>0?i.map(a=>`<span class="mp-category-tag">${T(a)}</span>`).join(""):'<span class="mp-field-value empty">No categories selected</span>'}
        </div>
      </div>
    `;const s=r.feature_image_url,p=r.gallery_images||[];return(s||p.length>0)&&(o+=`
        <div class="mp-field">
          <div class="mp-field-label">Images</div>
          <div class="mp-images-display">
            ${s?`<img src="${r.feature_image_url}" class="mp-feature-thumb" alt="Feature">`:""}
            ${p.map((a,d)=>`<img src="${a}" alt="Gallery ${d+1}">`).join("")}
          </div>
        </div>
      `),r.external_link&&(o+=`
        <div class="mp-field">
          <div class="mp-field-label">External Link</div>
          <div class="mp-field-value">
            <a href="${r.external_link}" target="_blank">${r.external_link}</a>
          </div>
        </div>
      `),r.showreel_link&&(o+=`
        <div class="mp-field">
          <div class="mp-field-label">Showreel</div>
          <div class="mp-field-value">
            <a href="${r.showreel_link}" target="_blank">${r.showreel_link}</a>
          </div>
        </div>
      `),`
      <div class="mp-project-card" data-project-id="${r.id}">
        <div class="mp-project-header">
          <div class="mp-project-header-left mp-toggle-details">
            <span class="mp-toggle-icon">&#9654;</span>
            <h3 class="mp-project-title">${r.name||"Untitled Project"}</h3>
          </div>
          <div class="mp-project-header-actions">
            ${r.webflow_id?`<a href="/projects/${r.slug}" target="_blank" class="mp-btn mp-btn-secondary mp-btn-small mp-view-btn">View</a>`:""}
            <button class="mp-btn mp-btn-secondary mp-btn-small mp-edit-btn">Edit</button>
            <button class="mp-btn mp-btn-danger mp-btn-small mp-delete-btn">Delete</button>
          </div>
        </div>
        <div class="mp-project-content">
          <div class="mp-project-fields">
            ${o}
          </div>
        </div>
      </div>
    `}function ce(r,e,o){const t=r.querySelector(".mp-project-content"),i=r.querySelector(".mp-toggle-details"),s=r.querySelector(".mp-toggle-icon"),p=r.querySelector(".mp-edit-btn"),n=r.querySelector(".mp-delete-btn");i.addEventListener("click",a=>{a.stopPropagation();const d=t.classList.toggle("open");s.classList.toggle("open",d)}),p.addEventListener("click",a=>{a.stopPropagation(),ge(e,o)}),n.addEventListener("click",async()=>{if(confirm("Are you sure you want to delete this project?")){n.disabled=!0,n.textContent="Deleting...";try{const a=e.name,d=e.id;await ie(d),await C("project_delete",{id:d,name:a}),y=y.filter(m=>m.id!==d),j(o)}catch(a){console.error("Error deleting project:",a),alert("Error deleting project. Please try again."),n.disabled=!1,n.textContent="Delete"}}})}function B(r=[]){let e=`
      <div class="mp-category-section">
        <h4>Choose Project Categories</h4>
        <p style="font-size: 12px; color: #666; margin: 0 0 12px 0;">Select a category to see subcategories. You can choose from multiple categories.</p>
        <div class="mp-parent-categories">
    `;return x.directories.forEach(o=>{e+=`<button type="button" class="mp-parent-btn" data-parent="${o.slug}">${o.name}</button>`}),e+="</div>",x.directories.forEach(o=>{const t=se(o.slug);e+=`<div class="mp-child-categories" data-parent="${o.slug}">`,t.forEach(i=>{const s=r.includes(i.id);e+=`<button type="button" class="mp-child-btn ${s?"selected":""}" data-id="${i.id}">${i.name}</button>`}),e+="</div>"}),e+=`
        <div class="mp-selected-categories" style="${r.length?"":"display: none;"}">
          <h5>Selected Categories</h5>
          <div class="mp-selected-list"></div>
        </div>
      </div>
    `,e}function D(r,e,o){const t=r.querySelectorAll(".mp-parent-btn"),i=r.querySelectorAll(".mp-child-categories"),s=r.querySelector(".mp-selected-list"),p=r.querySelector(".mp-selected-categories");function n(){s.innerHTML=e.map(a=>`<span class="mp-selected-tag">${T(a)}<button type="button" data-id="${a}">&times;</button></span>`).join(""),p.style.display=e.length?"":"none",r.querySelectorAll(".mp-child-btn").forEach(a=>{a.classList.toggle("selected",e.includes(a.dataset.id))})}t.forEach(a=>{a.addEventListener("click",()=>{const d=a.dataset.parent,m=a.classList.contains("active");t.forEach(c=>c.classList.remove("active")),i.forEach(c=>c.classList.remove("visible")),m||(a.classList.add("active"),r.querySelector(`.mp-child-categories[data-parent="${d}"]`).classList.add("visible"))})}),r.querySelectorAll(".mp-child-btn").forEach(a=>{a.addEventListener("click",()=>{const d=a.dataset.id,m=e.indexOf(d);m>-1?e.splice(m,1):e.push(d),n()})}),s.addEventListener("click",a=>{if(a.target.tagName==="BUTTON"){const d=a.target.dataset.id,m=e.indexOf(d);m>-1&&(e.splice(m,1),n())}}),n()}function H(r={}){const e=(r.gallery_images||[]).length;return`
      <div class="mp-image-section">
        <div class="mp-feature-upload">
          <h4>Feature Image</h4>
          <div class="mp-feature-upload-area ${r.feature_image_url?"has-image":""}" id="mp-feature-upload">
            ${r.feature_image_url?`<img src="${r.feature_image_url}" alt="Feature">`:""}
            <div class="mp-upload-placeholder"><span>+</span>Click to upload feature image</div>
            <button type="button" class="mp-remove-image">&times;</button>
            <input type="file" accept="image/*" style="display: none;" id="mp-feature-input">
          </div>
        </div>

        <div class="mp-gallery-section">
          <div class="mp-gallery-header">
            <h4>Gallery Images</h4>
            <span class="mp-gallery-count"><span id="mp-gallery-count-num">${e}</span> / ${_}</span>
          </div>
          <div class="mp-gallery-grid" id="mp-gallery-grid">
            ${(r.gallery_images||[]).map((o,t)=>`
              <div class="mp-gallery-item has-image" data-index="${t}" draggable="true">
                <img src="${o}" alt="Gallery ${t+1}">
                <button type="button" class="mp-remove-image">&times;</button>
                <span class="mp-drag-handle">Drag</span>
              </div>
            `).join("")}
            ${e<_?`
              <div class="mp-gallery-item mp-gallery-add" id="mp-gallery-add">
                <div class="mp-upload-placeholder"><span>+</span>Add</div>
                <input type="file" accept="image/*" multiple style="display: none;" id="mp-gallery-input">
              </div>
            `:""}
          </div>
        </div>
      </div>
    `}function G(r,e,o){const t=r.querySelector("#mp-feature-upload"),i=r.querySelector("#mp-feature-input");t.addEventListener("click",s=>{if(s.target.classList.contains("mp-remove-image")){s.stopPropagation(),e.feature_image_url="",t.classList.remove("has-image");const p=t.querySelector("img");p&&p.remove();return}t.classList.contains("has-image")||i.click()}),i.addEventListener("change",async s=>{const p=s.target.files[0];if(p){try{t.style.opacity="0.5";const n=await A(p,e.id);e.feature_image_url=n,t.classList.add("has-image");let a=t.querySelector("img");a||(a=document.createElement("img"),t.insertBefore(a,t.firstChild)),a.src=n,a.alt="Feature",t.style.opacity="1"}catch(n){console.error("Error uploading feature image:",n),alert("Error uploading image. Please try again."),t.style.opacity="1"}i.value=""}}),me(r,e,o)}function me(r,e,o){const t=r.querySelector("#mp-gallery-grid"),i=r.querySelector("#mp-gallery-input"),s=r.querySelector("#mp-gallery-add"),p=r.querySelector("#mp-gallery-count-num");e.gallery_images||(e.gallery_images=[]);function n(){if(t.innerHTML="",e.gallery_images.forEach((c,g)=>{const l=document.createElement("div");l.className="mp-gallery-item has-image",l.dataset.index=g,l.draggable=!0,l.innerHTML=`
          <img src="${c}" alt="Gallery ${g+1}">
          <button type="button" class="mp-remove-image">&times;</button>
          <span class="mp-drag-handle">Drag</span>
        `,t.appendChild(l)}),e.gallery_images.length<_){const c=document.createElement("div");c.className="mp-gallery-item mp-gallery-add",c.id="mp-gallery-add",c.innerHTML=`
          <div class="mp-upload-placeholder"><span>+</span>Add</div>
          <input type="file" accept="image/*" multiple style="display: none;" id="mp-gallery-input">
        `,t.appendChild(c);const g=c.querySelector("#mp-gallery-input");c.addEventListener("click",()=>g.click()),g.addEventListener("change",m)}p.textContent=e.gallery_images.length,a(),d()}function a(){const c=t.querySelectorAll(".mp-gallery-item.has-image");let g=null;c.forEach(l=>{l.addEventListener("dragstart",u=>{g=l,l.classList.add("dragging")}),l.addEventListener("dragend",()=>{l.classList.remove("dragging"),t.querySelectorAll(".mp-gallery-item").forEach(u=>u.classList.remove("drag-over"))}),l.addEventListener("dragover",u=>{u.preventDefault(),l!==g&&l.classList.contains("has-image")&&l.classList.add("drag-over")}),l.addEventListener("dragleave",()=>{l.classList.remove("drag-over")}),l.addEventListener("drop",u=>{if(u.preventDefault(),l.classList.remove("drag-over"),g&&l!==g){const v=parseInt(g.dataset.index),h=parseInt(l.dataset.index),z=e.gallery_images[v];e.gallery_images[v]=e.gallery_images[h],e.gallery_images[h]=z,n()}})})}function d(){t.querySelectorAll(".mp-gallery-item.has-image .mp-remove-image").forEach(c=>{c.addEventListener("click",g=>{g.stopPropagation();const l=c.closest(".mp-gallery-item"),u=parseInt(l.dataset.index);e.gallery_images.splice(u,1),n()})})}async function m(c){const g=Array.from(c.target.files);if(!g.length)return;const l=_-e.gallery_images.length,u=g.slice(0,l);for(const v of u)try{const h=await A(v,e.id);e.gallery_images.push(h),n()}catch(h){console.error("Error uploading gallery image:",h),alert("Error uploading image: "+v.name)}c.target.value=""}s&&s.addEventListener("click",()=>i==null?void 0:i.click()),i&&i.addEventListener("change",m),a(),d()}function ue(r,e){const o=e?e.replace(/-/g," ").replace(/\b\w/g,i=>i.toUpperCase()):"your membership",t=document.createElement("div");t.className="mp-modal-overlay",t.innerHTML=`
      <div class="mp-modal" style="max-width: 450px;">
        <div class="mp-modal-header">
          <h3>Project Limit Reached</h3>
        </div>
        <div class="mp-modal-body" style="text-align: center; padding: 30px;">
          <p style="margin-bottom: 16px; font-size: 16px;">
            You've reached the maximum of <strong>${r} projects</strong> for ${o} members.
          </p>
          <p style="margin-bottom: 0; color: #666;">
            To add a new project, please delete an existing one or consider upgrading your membership.
          </p>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn" id="mp-modal-close">Got it</button>
        </div>
      </div>
    `,document.body.appendChild(t),t.querySelector("#mp-modal-close").addEventListener("click",()=>t.remove()),t.addEventListener("click",i=>{i.target===t&&t.remove()})}function Y(r){const e=[],o={feature_image_url:"",gallery_images:[]},t=document.createElement("div");t.className="mp-modal-overlay",t.innerHTML=`
      <div class="mp-modal">
        <div class="mp-modal-header">
          <h3>Add New Project</h3>
        </div>
        <div class="mp-modal-body">
          <div class="mp-form-field">
            <label>Project Name <span>*</span></label>
            <input type="text" class="mp-form-input" id="mp-form-name" required>
          </div>
          <div class="mp-form-field">
            <label>Project Description <span>*</span></label>
            <textarea class="mp-form-input" id="mp-form-description"></textarea>
            <div class="mp-input-hint">Minimum 20 words required (<span id="mp-word-count">0</span> words)</div>
            <div class="mp-input-error" id="mp-description-error">Please enter at least 20 words</div>
          </div>

          ${B(e)}
          ${H(o)}

          <div class="mp-form-field">
            <label>Showreel Link</label>
            <input type="text" class="mp-form-input" id="mp-form-showreel_link" placeholder="https://youtube.com/watch?v=... or https://vimeo.com/...">
            <div class="mp-input-hint">YouTube or Vimeo URL only</div>
            <div class="mp-input-error" id="mp-showreel-error">Please enter a valid YouTube or Vimeo URL</div>
          </div>
          <div class="mp-form-field">
            <label>Project External Link</label>
            <input type="text" class="mp-form-input" id="mp-form-external_link" placeholder="https://example.com">
            <div class="mp-input-hint">Enter a complete URL including https://</div>
            <div class="mp-input-error" id="mp-url-error">Please enter a valid URL (e.g., https://example.com)</div>
          </div>
          <div class="mp-form-field">
            <label>Display Order</label>
            <input type="number" class="mp-form-input" id="mp-form-display_order" value="0">
          </div>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn mp-btn-secondary" id="mp-modal-cancel">Cancel</button>
          <button class="mp-btn" id="mp-modal-save">Create Project</button>
        </div>
      </div>
    `,document.body.appendChild(t),D(t,e),G(t,o,null),N(t),F(t);const i=t.querySelector("#mp-form-description"),s=t.querySelector("#mp-word-count"),p=()=>{const a=i.value.trim(),d=a?a.split(/\s+/).filter(m=>m.length>0).length:0;s.textContent=d,s.style.color=d>=20?"#28a745":"#666",t.querySelector("#mp-description-error").style.display="none"};i.addEventListener("input",p),p(),t.addEventListener("click",a=>{a.target===t&&t.remove()}),t.querySelector("#mp-modal-cancel").addEventListener("click",()=>t.remove());const n=t.querySelector("#mp-modal-save");n.addEventListener("click",async()=>{const a=t.querySelector("#mp-form-name").value.trim(),d=t.querySelector("#mp-form-description").value.trim(),m=d?d.split(/\s+/).filter(l=>l.length>0).length:0;if(!a){alert("Project name is required");return}if(m<20){const l=t.querySelector("#mp-description-error");l&&(l.style.display="block"),t.querySelector("#mp-form-description").focus();return}const c=t.querySelector("#mp-form-showreel_link").value.trim();if(c&&!S(c)){const l=t.querySelector("#mp-showreel-error");l&&l.classList.add("visible"),t.querySelector("#mp-form-showreel_link").classList.add("error"),t.querySelector("#mp-form-showreel_link").focus();return}const g=t.querySelector("#mp-form-external_link").value.trim();if(g&&!L(g)){const l=t.querySelector("#mp-url-error");l&&l.classList.add("visible"),t.querySelector("#mp-form-external_link").classList.add("error"),t.querySelector("#mp-form-external_link").focus();return}n.disabled=!0,n.textContent="Creating...",t.style.display="none";try{const l=await R(async()=>await te({name:a,description:d,external_link:k(t.querySelector("#mp-form-external_link").value),showreel_link:k(t.querySelector("#mp-form-showreel_link").value),display_order:parseInt(t.querySelector("#mp-form-display_order").value)||0,categories:[...e],feature_image_url:o.feature_image_url||"",gallery_images:o.gallery_images||[]}),"Creating Project");await C("project_create",{id:l.id,name:l.name}),y.push(l),y.sort((u,v)=>(u.display_order||0)-(v.display_order||0)),t.remove(),j(r)}catch(l){console.error("Error creating project:",l),t.style.display="",alert("Error creating project. Please try again."),n.disabled=!1,n.textContent="Create Project"}}),t.querySelector("#mp-form-name").focus()}function ge(r,e){const o=[...r.categories||[]],t={id:r.id,feature_image_url:r.feature_image_url||"",gallery_images:[...r.gallery_images||[]]},i=document.createElement("div");i.className="mp-modal-overlay",i.innerHTML=`
      <div class="mp-modal">
        <div class="mp-modal-header">
          <h3>Edit Project</h3>
        </div>
        <div class="mp-modal-body">
          <div class="mp-form-field">
            <label>Project Name <span>*</span></label>
            <input type="text" class="mp-form-input" id="mp-form-name" value="${r.name||""}" required>
          </div>
          <div class="mp-form-field">
            <label>Project Description <span>*</span></label>
            <textarea class="mp-form-input" id="mp-form-description">${r.description||""}</textarea>
            <div class="mp-input-hint">Minimum 20 words required (<span id="mp-word-count">0</span> words)</div>
            <div class="mp-input-error" id="mp-description-error">Please enter at least 20 words</div>
          </div>

          ${B(o)}
          ${H(t)}

          <div class="mp-form-field">
            <label>Showreel Link</label>
            <input type="text" class="mp-form-input" id="mp-form-showreel_link" value="${r.showreel_link||""}" placeholder="https://youtube.com/watch?v=... or https://vimeo.com/...">
            <div class="mp-input-hint">YouTube or Vimeo URL only</div>
            <div class="mp-input-error" id="mp-showreel-error">Please enter a valid YouTube or Vimeo URL</div>
          </div>
          <div class="mp-form-field">
            <label>Project External Link</label>
            <input type="text" class="mp-form-input" id="mp-form-external_link" value="${r.external_link||""}" placeholder="https://example.com">
            <div class="mp-input-hint">Enter a complete URL including https://</div>
            <div class="mp-input-error" id="mp-url-error">Please enter a valid URL (e.g., https://example.com)</div>
          </div>
          <div class="mp-form-field">
            <label>Display Order</label>
            <input type="number" class="mp-form-input" id="mp-form-display_order" value="${r.display_order||0}">
          </div>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn mp-btn-secondary" id="mp-modal-cancel">Cancel</button>
          <button class="mp-btn" id="mp-modal-save">Save Changes</button>
        </div>
      </div>
    `,document.body.appendChild(i),D(i,o),G(i,t,null),N(i),F(i);const s=i.querySelector("#mp-form-description"),p=i.querySelector("#mp-word-count"),n=()=>{const d=s.value.trim(),m=d?d.split(/\s+/).filter(c=>c.length>0).length:0;p.textContent=m,p.style.color=m>=20?"#28a745":"#666",i.querySelector("#mp-description-error").style.display="none"};s.addEventListener("input",n),n(),i.addEventListener("click",d=>{d.target===i&&i.remove()}),i.querySelector("#mp-modal-cancel").addEventListener("click",()=>i.remove());const a=i.querySelector("#mp-modal-save");a.addEventListener("click",async()=>{const d=i.querySelector("#mp-form-name").value.trim(),m=i.querySelector("#mp-form-description").value.trim(),c=m?m.split(/\s+/).filter(u=>u.length>0).length:0;if(!d){alert("Project name is required");return}if(c<20){const u=i.querySelector("#mp-description-error");u&&(u.style.display="block"),i.querySelector("#mp-form-description").focus();return}const g=i.querySelector("#mp-form-showreel_link").value.trim();if(g&&!S(g)){const u=i.querySelector("#mp-showreel-error");u&&u.classList.add("visible"),i.querySelector("#mp-form-showreel_link").classList.add("error"),i.querySelector("#mp-form-showreel_link").focus();return}const l=i.querySelector("#mp-form-external_link").value.trim();if(l&&!L(l)){const u=i.querySelector("#mp-url-error");u&&u.classList.add("visible"),i.querySelector("#mp-form-external_link").classList.add("error"),i.querySelector("#mp-form-external_link").focus();return}a.disabled=!0,a.textContent="Saving...",i.style.display="none";try{const u=await R(async()=>await oe(r.id,{name:d,description:m,external_link:k(i.querySelector("#mp-form-external_link").value),showreel_link:k(i.querySelector("#mp-form-showreel_link").value),display_order:parseInt(i.querySelector("#mp-form-display_order").value)||0,categories:[...o],feature_image_url:t.feature_image_url||"",gallery_images:t.gallery_images||[]}),"Saving Changes");await C("project_update",{id:u.id,name:u.name});const v=y.findIndex(h=>h.id===r.id);v>-1&&(y[v]=u),y.sort((h,z)=>(h.display_order||0)-(z.display_order||0)),i.remove(),j(e)}catch(u){console.error("Error updating project:",u),i.style.display="",alert("Error updating project. Please try again."),a.disabled=!1,a.textContent="Save Changes"}})}let P=!1;function fe(){return new Promise(r=>{if(window.$memberstackDom)r();else{const e=setInterval(()=>{window.$memberstackDom&&(clearInterval(e),r())},100)}})}function ye(){return new Promise((r,e)=>{if(window.supabase){r();return}let o=0;const t=50,i=setInterval(()=>{o++,window.supabase?(clearInterval(i),r()):o>=t&&(clearInterval(i),e(new Error("Supabase library not loaded")))},100)})}async function V(){if(P){console.log("Member projects already initialized, skipping");return}const r=document.querySelector(".supabase-project-container");if(!r){console.warn("Could not find .supabase-project-container");return}if(r.querySelector(".mp-container")){console.log("Member projects container already exists, skipping initialization"),P=!0;return}P=!0;const e=document.createElement("style");e.textContent=X,document.head.appendChild(e);const o=document.createElement("div");o.className="mp-container",o.innerHTML='<div class="mp-loading">Loading projects...</div>',r.appendChild(o);try{if(await ye(),await fe(),!K()){o.innerHTML='<div class="mp-loading">Error: Could not initialize Supabase</div>';return}const{data:t}=await window.$memberstackDom.getCurrentMember();if(!t){o.innerHTML='<div class="mp-loading">Please log in to view your projects.</div>';return}b=t,console.log("Current member:",b.id);const{data:i}=await J("get");$=(i==null?void 0:i.profile_complete)||!1,console.log("Profile complete:",$),x=await ee(),console.log(`Categories loaded: ${x.directories.length} directories, ${x.subDirectories.length} sub-directories`),y=await re(t.id),j(o)}catch(t){console.error("Error initializing member projects:",t),o.innerHTML='<div class="mp-loading">Error loading projects. Please refresh the page.</div>'}}window.addEventListener("error",r=>{console.error("Member Projects - Unhandled error:",r.error)}),window.addEventListener("unhandledrejection",r=>{console.error("Member Projects - Unhandled promise rejection:",r.reason)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",V):V()})();
