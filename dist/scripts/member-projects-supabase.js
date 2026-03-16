(function(){console.log("Member projects Supabase script loaded");const P="https://epszwomtxkpjegbjbixr.supabase.co",j="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",z="project-images",w=20,V={emerging:2,professional:5,"small-business":5,"not-for-profit":5,"large-business":8,"spaces-suppliers":5};let f=null,v=null,y=[],x={directories:[],subDirectories:[]},q=!1;const W=`
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
  `;function J(){return window.supabase?(f=window.supabase.createClient(P,j),console.log("Supabase client initialized"),!0):(console.error("Supabase JS library not loaded"),!1)}function I(t){if(!t)return 2;const e=t.toLowerCase();return V[e]||2}function X(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,80)}async function K(t){const e=X(t),{data:o}=await f.from("projects").select("slug").eq("slug",e).maybeSingle();if(!o)return e;const{data:r}=await f.from("projects").select("slug").like("slug",`${e}-%`),i=new Set((r||[]).map(p=>p.slug));i.add(e);let s=2;for(;i.has(`${e}-${s}`);)s++;return`${e}-${s}`}function _(t){if(!t||t.trim()==="")return"";let e=t.trim();/^https?:\/\//i.test(e)||(e="https://"+e);try{return new URL(e),e}catch{return""}}function k(t){if(!t||t.trim()==="")return!0;let e=t.trim();/^https?:\/\//i.test(e)||(e="https://"+e);try{const o=new URL(e);if(!o.hostname||!o.hostname.includes("."))return!1;const r=o.hostname.split(".");return!(r[r.length-1].length<2)}catch{return!1}}function L(t){if(!t||t.trim()==="")return!0;let e=t.trim();/^https?:\/\//i.test(e)||(e="https://"+e);try{const r=new URL(e).hostname.toLowerCase();return!!(r.includes("youtube.com")||r.includes("youtu.be")||r.includes("vimeo.com"))}catch{return!1}}async function Z(){try{const{data:t,error:e}=await f.from("directories").select("id, webflow_id, name, slug").order("display_order");if(e)throw e;const{data:o,error:r}=await f.from("sub_directories").select("id, webflow_id, name, slug, directory_slug").order("name");if(r)throw r;return console.log(`Loaded ${t.length} directories and ${o.length} sub-directories`),{directories:t,subDirectories:o}}catch(t){return console.error("Error loading categories:",t),{directories:[],subDirectories:[]}}}async function Q(t){try{const{data:e,error:o}=await f.from("projects").select(`
          *,
          project_sub_directories (
            sub_directory_id
          )
        `).eq("memberstack_id",t).eq("is_deleted",!1).order("display_order",{ascending:!0});if(o)throw o;const r=e.map(i=>{var s;return{...i,categories:((s=i.project_sub_directories)==null?void 0:s.map(p=>p.sub_directory_id))||[],gallery_images:i.gallery_images||[]}});return console.log(`Loaded ${r.length} projects for member ${t}`),r}catch(e){return console.error("Error loading projects:",e),[]}}async function ee(t){try{const{categories:e,...o}=t,r=await K(o.name),{data:i,error:s}=await f.from("projects").insert({memberstack_id:v.id,name:o.name,slug:r,description:o.description,feature_image_url:o.feature_image_url||null,gallery_images:o.gallery_images||[],external_link:o.external_link||null,showreel_link:o.showreel_link||null,display_order:o.display_order||0,is_draft:!1,is_deleted:!1}).select().single();if(s)throw s;if(e&&e.length>0){const p=e.map(a=>({project_id:i.id,sub_directory_id:a})),{error:l}=await f.from("project_sub_directories").insert(p);l&&console.error("Error linking categories:",l)}return console.log("Project created:",i.id),{...i,categories:e||[],gallery_images:i.gallery_images||[]}}catch(e){throw console.error("Error creating project:",e),e}}async function te(t,e){try{const{categories:o,...r}=e,{data:i,error:s}=await f.from("projects").update({name:r.name,description:r.description,feature_image_url:r.feature_image_url||null,gallery_images:r.gallery_images||[],external_link:r.external_link||null,showreel_link:r.showreel_link||null,display_order:r.display_order||0}).eq("id",t).eq("memberstack_id",v.id).select().single();if(s)throw s;const{error:p}=await f.from("project_sub_directories").delete().eq("project_id",t);if(p&&console.error("Error deleting old categories:",p),o&&o.length>0){const l=o.map(d=>({project_id:t,sub_directory_id:d})),{error:a}=await f.from("project_sub_directories").insert(l);a&&console.error("Error linking categories:",a)}return console.log("Project updated:",t),{...i,categories:o||[],gallery_images:i.gallery_images||[]}}catch(o){throw console.error("Error updating project:",o),o}}async function re(t){try{const{error:e}=await f.from("projects").update({is_deleted:!0}).eq("id",t).eq("memberstack_id",v.id);if(e)throw e;return console.log("Project deleted:",t),!0}catch(e){throw console.error("Error deleting project:",e),e}}async function $(t,e=null){try{const o={memberstack_id:v.id,activity_type:t};e&&(o.entity_type="project",o.entity_id=e.id||null,o.entity_name=e.name||null),await fetch(`${P}/functions/v1/log-activity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${j}`,apikey:j},body:JSON.stringify(o)})}catch(o){console.warn("Failed to log activity:",o)}}const M=3*1024*1024,S=2e3;async function oe(t){const e=(t.size/1024/1024).toFixed(1);return t.size<=M?(console.log(`Image ${t.name} is ${e}MB - no compression needed`),t):(console.log(`Compressing image ${t.name} from ${e}MB...`),new Promise((o,r)=>{const i=new Image,s=document.createElement("canvas"),p=s.getContext("2d");i.onload=()=>{let{width:l,height:a}=i;if(l>S||a>S){const m=Math.min(S/l,S/a);l=Math.round(l*m),a=Math.round(a*m)}s.width=l,s.height=a,p.drawImage(i,0,0,l,a);const d=m=>{s.toBlob(c=>{if(!c){r(new Error("Failed to compress image"));return}const g=(c.size/1024/1024).toFixed(1);if(console.log(`Compressed to ${g}MB at quality ${m}`),c.size<=M||m<=.3){const n=new File([c],t.name,{type:"image/jpeg",lastModified:Date.now()});o(n)}else d(m-.1)},"image/jpeg",m)};d(.8)},i.onerror=()=>r(new Error("Failed to load image for compression")),i.src=URL.createObjectURL(t)}))}async function A(t,e){const o=await oe(t),r=Date.now(),i=o.type==="image/jpeg"?"jpg":t.name.split(".").pop(),s=`${v.id}/${e||"new"}/${r}.${i}`,{data:p,error:l}=await f.storage.from(z).upload(s,o,{cacheControl:"3600",upsert:!1});if(l)throw l;const{data:{publicUrl:a}}=f.storage.from(z).getPublicUrl(s);return console.log("Image uploaded:",a),a}function U(t){const e=x.subDirectories.find(o=>o.id===t);return e?e.name:t}function ie(t){return x.subDirectories.filter(e=>e.directory_slug===t)}function T(t){const e=t.querySelector("#mp-form-external_link"),o=t.querySelector("#mp-url-error");if(!e||!o)return;const r=()=>{const i=e.value.trim();i===""?(e.classList.remove("error","valid"),o.classList.remove("visible")):k(i)?(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible")):(e.classList.remove("valid"),e.classList.add("error"),o.classList.add("visible"))};e.addEventListener("blur",r),e.addEventListener("input",()=>{e.classList.contains("error")&&k(e.value)&&(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible"))}),e.value.trim()&&r()}function N(t){const e=t.querySelector("#mp-form-showreel_link"),o=t.querySelector("#mp-showreel-error");if(!e||!o)return;const r=()=>{const i=e.value.trim();i===""?(e.classList.remove("error","valid"),o.classList.remove("visible")):L(i)?(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible")):(e.classList.remove("valid"),e.classList.add("error"),o.classList.add("visible"))};e.addEventListener("blur",r),e.addEventListener("input",()=>{e.classList.contains("error")&&L(e.value)&&(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible"))}),e.value.trim()&&r()}const F=[{text:"Preparing project...",progress:10},{text:"Optimising images...",progress:25},{text:"Compiling data...",progress:45},{text:"Populating categories...",progress:60},{text:"Syncing to portfolio...",progress:80},{text:"Finalising...",progress:95}];function ae(t="Creating Project"){const e=document.createElement("div");return e.className="mp-progress-overlay",e.id="mp-progress-overlay",e.innerHTML=`
      <div class="mp-progress-container">
        <div class="mp-progress-spinner"></div>
        <div class="mp-progress-title">${t}</div>
        <div class="mp-progress-bar-wrapper">
          <div class="mp-progress-bar-fill" style="width: 5%;"></div>
        </div>
        <div class="mp-progress-status">Initialising...</div>
      </div>
    `,document.body.appendChild(e),e}function se(t,e){if(!t)return;const o=F[e];if(!o)return;const r=t.querySelector(".mp-progress-bar-fill"),i=t.querySelector(".mp-progress-status");r&&(r.style.width=o.progress+"%"),i&&(i.classList.add("fade"),setTimeout(()=>{i.textContent=o.text,i.classList.remove("fade")},150))}function le(){const t=document.getElementById("mp-progress-overlay");if(t){const e=t.querySelector(".mp-progress-bar-fill"),o=t.querySelector(".mp-progress-status");e&&(e.style.width="100%"),o&&(o.textContent="Complete!"),setTimeout(()=>{t.remove()},500)}}async function R(t,e="Creating Project"){const o=ae(e);let r=0;const i=setInterval(()=>{r<F.length&&(se(o,r),r++)},600);try{const s=await t();return clearInterval(i),le(),s}catch(s){clearInterval(i);const p=document.getElementById("mp-progress-overlay");throw p&&p.remove(),s}}function E(t){var p;if(!q){t.innerHTML=`
        <div class="mp-empty">
          <p>Complete your profile to start adding projects to your portfolio.</p>
          <a href="/profile/onboarding" class="mp-btn">Complete Profile</a>
        </div>
      `;return}if(y.length===0){t.innerHTML=`
        <div class="mp-empty">
          <p>You don't have any projects yet</p>
          <button class="mp-btn" id="mp-add-first">Add Your First Project</button>
        </div>
      `,t.querySelector("#mp-add-first").addEventListener("click",()=>G(t));return}const e=(p=v==null?void 0:v.customFields)==null?void 0:p["membership-type"],o=I(e),i=o-y.length<=0;let s=`
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
    `;y.forEach((l,a)=>{s+=ne(l)}),s+="</div>",t.innerHTML=s,t.querySelector("#mp-add-project").addEventListener("click",()=>{var d;const l=(d=v==null?void 0:v.customFields)==null?void 0:d["membership-type"],a=I(l);if(y.length>=a){ce(a,l);return}G(t)}),t.querySelectorAll(".mp-project-card").forEach((l,a)=>{const d=y[a];de(l,d,t)})}function ne(t,e){let o="";const r=t.description||"";o+=`
      <div class="mp-field">
        <div class="mp-field-label">Description</div>
        <div class="mp-field-value ${r?"":"empty"}">
          ${r||"No description"}
        </div>
      </div>
    `;const i=t.categories||[];o+=`
      <div class="mp-field">
        <div class="mp-field-label">Categories</div>
        <div class="mp-categories-display">
          ${i.length>0?i.map(a=>`<span class="mp-category-tag">${U(a)}</span>`).join(""):'<span class="mp-field-value empty">No categories selected</span>'}
        </div>
      </div>
    `;const s=t.feature_image_url,p=t.gallery_images||[];return(s||p.length>0)&&(o+=`
        <div class="mp-field">
          <div class="mp-field-label">Images</div>
          <div class="mp-images-display">
            ${s?`<img src="${t.feature_image_url}" class="mp-feature-thumb" alt="Feature">`:""}
            ${p.map((a,d)=>`<img src="${a}" alt="Gallery ${d+1}">`).join("")}
          </div>
        </div>
      `),t.external_link&&(o+=`
        <div class="mp-field">
          <div class="mp-field-label">External Link</div>
          <div class="mp-field-value">
            <a href="${t.external_link}" target="_blank">${t.external_link}</a>
          </div>
        </div>
      `),t.showreel_link&&(o+=`
        <div class="mp-field">
          <div class="mp-field-label">Showreel</div>
          <div class="mp-field-value">
            <a href="${t.showreel_link}" target="_blank">${t.showreel_link}</a>
          </div>
        </div>
      `),`
      <div class="mp-project-card" data-project-id="${t.id}">
        <div class="mp-project-header">
          <div class="mp-project-header-left mp-toggle-details">
            <span class="mp-toggle-icon">&#9654;</span>
            <h3 class="mp-project-title">${t.name||"Untitled Project"}</h3>
          </div>
          <div class="mp-project-header-actions">
            ${t.webflow_id?`<a href="/projects/${t.slug}" target="_blank" class="mp-btn mp-btn-secondary mp-btn-small mp-view-btn">View</a>`:""}
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
    `}function de(t,e,o){const r=t.querySelector(".mp-project-content"),i=t.querySelector(".mp-toggle-details"),s=t.querySelector(".mp-toggle-icon"),p=t.querySelector(".mp-edit-btn"),l=t.querySelector(".mp-delete-btn");i.addEventListener("click",a=>{a.stopPropagation();const d=r.classList.toggle("open");s.classList.toggle("open",d)}),p.addEventListener("click",a=>{a.stopPropagation(),me(e,o)}),l.addEventListener("click",async()=>{if(confirm("Are you sure you want to delete this project?")){l.disabled=!0,l.textContent="Deleting...";try{const a=e.name,d=e.id;await re(d),await $("project_delete",{id:d,name:a}),y=y.filter(m=>m.id!==d),E(o)}catch(a){console.error("Error deleting project:",a),alert("Error deleting project. Please try again."),l.disabled=!1,l.textContent="Delete"}}})}function O(t=[]){let e=`
      <div class="mp-category-section">
        <h4>Choose Project Categories</h4>
        <p style="font-size: 12px; color: #666; margin: 0 0 12px 0;">Select a category to see subcategories. You can choose from multiple categories.</p>
        <div class="mp-parent-categories">
    `;return x.directories.forEach(o=>{e+=`<button type="button" class="mp-parent-btn" data-parent="${o.slug}">${o.name}</button>`}),e+="</div>",x.directories.forEach(o=>{const r=ie(o.slug);e+=`<div class="mp-child-categories" data-parent="${o.slug}">`,r.forEach(i=>{const s=t.includes(i.id);e+=`<button type="button" class="mp-child-btn ${s?"selected":""}" data-id="${i.id}">${i.name}</button>`}),e+="</div>"}),e+=`
        <div class="mp-selected-categories" style="${t.length?"":"display: none;"}">
          <h5>Selected Categories</h5>
          <div class="mp-selected-list"></div>
        </div>
      </div>
    `,e}function B(t,e,o){const r=t.querySelectorAll(".mp-parent-btn"),i=t.querySelectorAll(".mp-child-categories"),s=t.querySelector(".mp-selected-list"),p=t.querySelector(".mp-selected-categories");function l(){s.innerHTML=e.map(a=>`<span class="mp-selected-tag">${U(a)}<button type="button" data-id="${a}">&times;</button></span>`).join(""),p.style.display=e.length?"":"none",t.querySelectorAll(".mp-child-btn").forEach(a=>{a.classList.toggle("selected",e.includes(a.dataset.id))})}r.forEach(a=>{a.addEventListener("click",()=>{const d=a.dataset.parent,m=a.classList.contains("active");r.forEach(c=>c.classList.remove("active")),i.forEach(c=>c.classList.remove("visible")),m||(a.classList.add("active"),t.querySelector(`.mp-child-categories[data-parent="${d}"]`).classList.add("visible"))})}),t.querySelectorAll(".mp-child-btn").forEach(a=>{a.addEventListener("click",()=>{const d=a.dataset.id,m=e.indexOf(d);m>-1?e.splice(m,1):e.push(d),l()})}),s.addEventListener("click",a=>{if(a.target.tagName==="BUTTON"){const d=a.target.dataset.id,m=e.indexOf(d);m>-1&&(e.splice(m,1),l())}}),l()}function H(t={}){const e=(t.gallery_images||[]).length;return`
      <div class="mp-image-section">
        <div class="mp-feature-upload">
          <h4>Feature Image</h4>
          <div class="mp-feature-upload-area ${t.feature_image_url?"has-image":""}" id="mp-feature-upload">
            ${t.feature_image_url?`<img src="${t.feature_image_url}" alt="Feature">`:""}
            <div class="mp-upload-placeholder"><span>+</span>Click to upload feature image</div>
            <button type="button" class="mp-remove-image">&times;</button>
            <input type="file" accept="image/*" style="display: none;" id="mp-feature-input">
          </div>
        </div>

        <div class="mp-gallery-section">
          <div class="mp-gallery-header">
            <h4>Gallery Images</h4>
            <span class="mp-gallery-count"><span id="mp-gallery-count-num">${e}</span> / ${w}</span>
          </div>
          <div class="mp-gallery-grid" id="mp-gallery-grid">
            ${(t.gallery_images||[]).map((o,r)=>`
              <div class="mp-gallery-item has-image" data-index="${r}" draggable="true">
                <img src="${o}" alt="Gallery ${r+1}">
                <button type="button" class="mp-remove-image">&times;</button>
                <span class="mp-drag-handle">Drag</span>
              </div>
            `).join("")}
            ${e<w?`
              <div class="mp-gallery-item mp-gallery-add" id="mp-gallery-add">
                <div class="mp-upload-placeholder"><span>+</span>Add</div>
                <input type="file" accept="image/*" multiple style="display: none;" id="mp-gallery-input">
              </div>
            `:""}
          </div>
        </div>
      </div>
    `}function D(t,e,o){const r=t.querySelector("#mp-feature-upload"),i=t.querySelector("#mp-feature-input");r.addEventListener("click",s=>{if(s.target.classList.contains("mp-remove-image")){s.stopPropagation(),e.feature_image_url="",r.classList.remove("has-image");const p=r.querySelector("img");p&&p.remove();return}r.classList.contains("has-image")||i.click()}),i.addEventListener("change",async s=>{const p=s.target.files[0];if(p){try{r.style.opacity="0.5";const l=await A(p,e.id);e.feature_image_url=l,r.classList.add("has-image");let a=r.querySelector("img");a||(a=document.createElement("img"),r.insertBefore(a,r.firstChild)),a.src=l,a.alt="Feature",r.style.opacity="1"}catch(l){console.error("Error uploading feature image:",l),alert("Error uploading image. Please try again."),r.style.opacity="1"}i.value=""}}),pe(t,e,o)}function pe(t,e,o){const r=t.querySelector("#mp-gallery-grid"),i=t.querySelector("#mp-gallery-input"),s=t.querySelector("#mp-gallery-add"),p=t.querySelector("#mp-gallery-count-num");e.gallery_images||(e.gallery_images=[]);function l(){if(r.innerHTML="",e.gallery_images.forEach((c,g)=>{const n=document.createElement("div");n.className="mp-gallery-item has-image",n.dataset.index=g,n.draggable=!0,n.innerHTML=`
          <img src="${c}" alt="Gallery ${g+1}">
          <button type="button" class="mp-remove-image">&times;</button>
          <span class="mp-drag-handle">Drag</span>
        `,r.appendChild(n)}),e.gallery_images.length<w){const c=document.createElement("div");c.className="mp-gallery-item mp-gallery-add",c.id="mp-gallery-add",c.innerHTML=`
          <div class="mp-upload-placeholder"><span>+</span>Add</div>
          <input type="file" accept="image/*" multiple style="display: none;" id="mp-gallery-input">
        `,r.appendChild(c);const g=c.querySelector("#mp-gallery-input");c.addEventListener("click",()=>g.click()),g.addEventListener("change",m)}p.textContent=e.gallery_images.length,a(),d()}function a(){const c=r.querySelectorAll(".mp-gallery-item.has-image");let g=null;c.forEach(n=>{n.addEventListener("dragstart",u=>{g=n,n.classList.add("dragging")}),n.addEventListener("dragend",()=>{n.classList.remove("dragging"),r.querySelectorAll(".mp-gallery-item").forEach(u=>u.classList.remove("drag-over"))}),n.addEventListener("dragover",u=>{u.preventDefault(),n!==g&&n.classList.contains("has-image")&&n.classList.add("drag-over")}),n.addEventListener("dragleave",()=>{n.classList.remove("drag-over")}),n.addEventListener("drop",u=>{if(u.preventDefault(),n.classList.remove("drag-over"),g&&n!==g){const b=parseInt(g.dataset.index),h=parseInt(n.dataset.index),C=e.gallery_images[b];e.gallery_images[b]=e.gallery_images[h],e.gallery_images[h]=C,l()}})})}function d(){r.querySelectorAll(".mp-gallery-item.has-image .mp-remove-image").forEach(c=>{c.addEventListener("click",g=>{g.stopPropagation();const n=c.closest(".mp-gallery-item"),u=parseInt(n.dataset.index);e.gallery_images.splice(u,1),l()})})}async function m(c){const g=Array.from(c.target.files);if(!g.length)return;const n=w-e.gallery_images.length,u=g.slice(0,n);for(const b of u)try{const h=await A(b,e.id);e.gallery_images.push(h),l()}catch(h){console.error("Error uploading gallery image:",h),alert("Error uploading image: "+b.name)}c.target.value=""}s&&s.addEventListener("click",()=>i==null?void 0:i.click()),i&&i.addEventListener("change",m),a(),d()}function ce(t,e){const o=e?e.replace(/-/g," ").replace(/\b\w/g,i=>i.toUpperCase()):"your membership",r=document.createElement("div");r.className="mp-modal-overlay",r.innerHTML=`
      <div class="mp-modal" style="max-width: 450px;">
        <div class="mp-modal-header">
          <h3>Project Limit Reached</h3>
        </div>
        <div class="mp-modal-body" style="text-align: center; padding: 30px;">
          <p style="margin-bottom: 16px; font-size: 16px;">
            You've reached the maximum of <strong>${t} projects</strong> for ${o} members.
          </p>
          <p style="margin-bottom: 0; color: #666;">
            To add a new project, please delete an existing one or consider upgrading your membership.
          </p>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn" id="mp-modal-close">Got it</button>
        </div>
      </div>
    `,document.body.appendChild(r),r.querySelector("#mp-modal-close").addEventListener("click",()=>r.remove()),r.addEventListener("click",i=>{i.target===r&&r.remove()})}function G(t){const e=[],o={feature_image_url:"",gallery_images:[]},r=document.createElement("div");r.className="mp-modal-overlay",r.innerHTML=`
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

          ${O(e)}
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
    `,document.body.appendChild(r),B(r,e),D(r,o,null),T(r),N(r);const i=r.querySelector("#mp-form-description"),s=r.querySelector("#mp-word-count"),p=()=>{const a=i.value.trim(),d=a?a.split(/\s+/).filter(m=>m.length>0).length:0;s.textContent=d,s.style.color=d>=20?"#28a745":"#666",r.querySelector("#mp-description-error").style.display="none"};i.addEventListener("input",p),p(),r.addEventListener("click",a=>{a.target===r&&r.remove()}),r.querySelector("#mp-modal-cancel").addEventListener("click",()=>r.remove());const l=r.querySelector("#mp-modal-save");l.addEventListener("click",async()=>{const a=r.querySelector("#mp-form-name").value.trim(),d=r.querySelector("#mp-form-description").value.trim(),m=d?d.split(/\s+/).filter(n=>n.length>0).length:0;if(!a){alert("Project name is required");return}if(m<20){const n=r.querySelector("#mp-description-error");n&&(n.style.display="block"),r.querySelector("#mp-form-description").focus();return}const c=r.querySelector("#mp-form-showreel_link").value.trim();if(c&&!L(c)){const n=r.querySelector("#mp-showreel-error");n&&n.classList.add("visible"),r.querySelector("#mp-form-showreel_link").classList.add("error"),r.querySelector("#mp-form-showreel_link").focus();return}const g=r.querySelector("#mp-form-external_link").value.trim();if(g&&!k(g)){const n=r.querySelector("#mp-url-error");n&&n.classList.add("visible"),r.querySelector("#mp-form-external_link").classList.add("error"),r.querySelector("#mp-form-external_link").focus();return}l.disabled=!0,l.textContent="Creating...",r.style.display="none";try{const n=await R(async()=>await ee({name:a,description:d,external_link:_(r.querySelector("#mp-form-external_link").value),showreel_link:_(r.querySelector("#mp-form-showreel_link").value),display_order:parseInt(r.querySelector("#mp-form-display_order").value)||0,categories:[...e],feature_image_url:o.feature_image_url||"",gallery_images:o.gallery_images||[]}),"Creating Project");await $("project_create",{id:n.id,name:n.name}),y.push(n),y.sort((u,b)=>(u.display_order||0)-(b.display_order||0)),r.remove(),E(t)}catch(n){console.error("Error creating project:",n),r.style.display="",alert("Error creating project. Please try again."),l.disabled=!1,l.textContent="Create Project"}}),r.querySelector("#mp-form-name").focus()}function me(t,e){const o=[...t.categories||[]],r={id:t.id,feature_image_url:t.feature_image_url||"",gallery_images:[...t.gallery_images||[]]},i=document.createElement("div");i.className="mp-modal-overlay",i.innerHTML=`
      <div class="mp-modal">
        <div class="mp-modal-header">
          <h3>Edit Project</h3>
        </div>
        <div class="mp-modal-body">
          <div class="mp-form-field">
            <label>Project Name <span>*</span></label>
            <input type="text" class="mp-form-input" id="mp-form-name" value="${t.name||""}" required>
          </div>
          <div class="mp-form-field">
            <label>Project Description <span>*</span></label>
            <textarea class="mp-form-input" id="mp-form-description">${t.description||""}</textarea>
            <div class="mp-input-hint">Minimum 20 words required (<span id="mp-word-count">0</span> words)</div>
            <div class="mp-input-error" id="mp-description-error">Please enter at least 20 words</div>
          </div>

          ${O(o)}
          ${H(r)}

          <div class="mp-form-field">
            <label>Showreel Link</label>
            <input type="text" class="mp-form-input" id="mp-form-showreel_link" value="${t.showreel_link||""}" placeholder="https://youtube.com/watch?v=... or https://vimeo.com/...">
            <div class="mp-input-hint">YouTube or Vimeo URL only</div>
            <div class="mp-input-error" id="mp-showreel-error">Please enter a valid YouTube or Vimeo URL</div>
          </div>
          <div class="mp-form-field">
            <label>Project External Link</label>
            <input type="text" class="mp-form-input" id="mp-form-external_link" value="${t.external_link||""}" placeholder="https://example.com">
            <div class="mp-input-hint">Enter a complete URL including https://</div>
            <div class="mp-input-error" id="mp-url-error">Please enter a valid URL (e.g., https://example.com)</div>
          </div>
          <div class="mp-form-field">
            <label>Display Order</label>
            <input type="number" class="mp-form-input" id="mp-form-display_order" value="${t.display_order||0}">
          </div>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn mp-btn-secondary" id="mp-modal-cancel">Cancel</button>
          <button class="mp-btn" id="mp-modal-save">Save Changes</button>
        </div>
      </div>
    `,document.body.appendChild(i),B(i,o),D(i,r,null),T(i),N(i);const s=i.querySelector("#mp-form-description"),p=i.querySelector("#mp-word-count"),l=()=>{const d=s.value.trim(),m=d?d.split(/\s+/).filter(c=>c.length>0).length:0;p.textContent=m,p.style.color=m>=20?"#28a745":"#666",i.querySelector("#mp-description-error").style.display="none"};s.addEventListener("input",l),l(),i.addEventListener("click",d=>{d.target===i&&i.remove()}),i.querySelector("#mp-modal-cancel").addEventListener("click",()=>i.remove());const a=i.querySelector("#mp-modal-save");a.addEventListener("click",async()=>{const d=i.querySelector("#mp-form-name").value.trim(),m=i.querySelector("#mp-form-description").value.trim(),c=m?m.split(/\s+/).filter(u=>u.length>0).length:0;if(!d){alert("Project name is required");return}if(c<20){const u=i.querySelector("#mp-description-error");u&&(u.style.display="block"),i.querySelector("#mp-form-description").focus();return}const g=i.querySelector("#mp-form-showreel_link").value.trim();if(g&&!L(g)){const u=i.querySelector("#mp-showreel-error");u&&u.classList.add("visible"),i.querySelector("#mp-form-showreel_link").classList.add("error"),i.querySelector("#mp-form-showreel_link").focus();return}const n=i.querySelector("#mp-form-external_link").value.trim();if(n&&!k(n)){const u=i.querySelector("#mp-url-error");u&&u.classList.add("visible"),i.querySelector("#mp-form-external_link").classList.add("error"),i.querySelector("#mp-form-external_link").focus();return}a.disabled=!0,a.textContent="Saving...",i.style.display="none";try{const u=await R(async()=>await te(t.id,{name:d,description:m,external_link:_(i.querySelector("#mp-form-external_link").value),showreel_link:_(i.querySelector("#mp-form-showreel_link").value),display_order:parseInt(i.querySelector("#mp-form-display_order").value)||0,categories:[...o],feature_image_url:r.feature_image_url||"",gallery_images:r.gallery_images||[]}),"Saving Changes");await $("project_update",{id:u.id,name:u.name});const b=y.findIndex(h=>h.id===t.id);b>-1&&(y[b]=u),y.sort((h,C)=>(h.display_order||0)-(C.display_order||0)),i.remove(),E(e)}catch(u){console.error("Error updating project:",u),i.style.display="",alert("Error updating project. Please try again."),a.disabled=!1,a.textContent="Save Changes"}})}function ue(){return new Promise(t=>{if(window.$memberstackDom)t();else{const e=setInterval(()=>{window.$memberstackDom&&(clearInterval(e),t())},100)}})}function ge(){return new Promise((t,e)=>{if(window.supabase){t();return}let o=0;const r=50,i=setInterval(()=>{o++,window.supabase?(clearInterval(i),t()):o>=r&&(clearInterval(i),e(new Error("Supabase library not loaded")))},100)})}async function Y(){const t=document.querySelector(".supabase-project-container");if(!t){console.warn("Could not find .supabase-project-container");return}const e=document.createElement("style");e.textContent=W,document.head.appendChild(e);const o=document.createElement("div");o.className="mp-container",o.innerHTML='<div class="mp-loading">Loading projects...</div>',t.appendChild(o);try{if(await ge(),await ue(),!J()){o.innerHTML='<div class="mp-loading">Error: Could not initialize Supabase</div>';return}const{data:r}=await window.$memberstackDom.getCurrentMember();if(!r){o.innerHTML='<div class="mp-loading">Please log in to view your projects.</div>';return}v=r,console.log("Current member:",v.id);const{data:i}=await f.from("members").select("profile_complete").eq("memberstack_id",r.id).single();q=(i==null?void 0:i.profile_complete)||!1,console.log("Profile complete:",q),x=await Z(),console.log(`Categories loaded: ${x.directories.length} directories, ${x.subDirectories.length} sub-directories`),y=await Q(r.id),E(o)}catch(r){console.error("Error initializing member projects:",r),o.innerHTML='<div class="mp-loading">Error loading projects. Please refresh the page.</div>'}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Y):Y()})();
