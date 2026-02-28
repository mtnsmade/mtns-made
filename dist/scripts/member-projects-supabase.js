(function(){console.log("Member projects Supabase script loaded");const $="https://epszwomtxkpjegbjbixr.supabase.co",E="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",P="project-images",_=20,H={emerging:2,professional:5,"small-business":5,"not-for-profit":5,"large-business":8,"spaces-suppliers":5};let v=null,y=null,f=[],x={directories:[],subDirectories:[]};const G=`
    .mp-container {
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      overflow-x: visible;
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
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 12px;
      background: #fff;
      overflow: hidden;
    }
    .mp-project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
    }
    .mp-project-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .mp-project-header-left:hover .mp-project-title {
      color: #555;
    }
    .mp-project-header-actions {
      display: flex;
      gap: 8px;
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
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
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
  `;function Y(){return window.supabase?(v=window.supabase.createClient($,E),console.log("Supabase client initialized"),!0):(console.error("Supabase JS library not loaded"),!1)}function C(r){if(!r)return 2;const e=r.toLowerCase();return H[e]||2}function V(r){return r.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,50)+"-"+Date.now().toString(36)}function w(r){if(!r||r.trim()==="")return"";let e=r.trim();/^https?:\/\//i.test(e)||(e="https://"+e);try{return new URL(e),e}catch{return""}}function k(r){if(!r||r.trim()==="")return!0;let e=r.trim();/^https?:\/\//i.test(e)||(e="https://"+e);try{const o=new URL(e);if(!o.hostname||!o.hostname.includes("."))return!1;const t=o.hostname.split(".");return!(t[t.length-1].length<2)}catch{return!1}}function L(r){if(!r||r.trim()==="")return!0;let e=r.trim();/^https?:\/\//i.test(e)||(e="https://"+e);try{const t=new URL(e).hostname.toLowerCase();return!!(t.includes("youtube.com")||t.includes("youtu.be")||t.includes("vimeo.com"))}catch{return!1}}async function W(){try{const{data:r,error:e}=await v.from("directories").select("id, webflow_id, name, slug").order("display_order");if(e)throw e;const{data:o,error:t}=await v.from("sub_directories").select("id, webflow_id, name, slug, directory_slug").order("name");if(t)throw t;return console.log(`Loaded ${r.length} directories and ${o.length} sub-directories`),{directories:r,subDirectories:o}}catch(r){return console.error("Error loading categories:",r),{directories:[],subDirectories:[]}}}async function J(r){try{const{data:e,error:o}=await v.from("projects").select(`
          *,
          project_sub_directories (
            sub_directory_id
          )
        `).eq("memberstack_id",r).eq("is_deleted",!1).order("display_order",{ascending:!0});if(o)throw o;const t=e.map(i=>{var n;return{...i,categories:((n=i.project_sub_directories)==null?void 0:n.map(c=>c.sub_directory_id))||[],gallery_images:i.gallery_images||[]}});return console.log(`Loaded ${t.length} projects for member ${r}`),t}catch(e){return console.error("Error loading projects:",e),[]}}async function K(r){try{const{categories:e,...o}=r,{data:t,error:i}=await v.from("projects").insert({memberstack_id:y.id,name:o.name,slug:V(o.name),description:o.description,feature_image_url:o.feature_image_url||null,gallery_images:o.gallery_images||[],external_link:o.external_link||null,showreel_link:o.showreel_link||null,display_order:o.display_order||0,is_draft:!1,is_deleted:!1}).select().single();if(i)throw i;if(e&&e.length>0){const n=e.map(l=>({project_id:t.id,sub_directory_id:l})),{error:c}=await v.from("project_sub_directories").insert(n);c&&console.error("Error linking categories:",c)}return console.log("Project created:",t.id),{...t,categories:e||[],gallery_images:t.gallery_images||[]}}catch(e){throw console.error("Error creating project:",e),e}}async function X(r,e){try{const{categories:o,...t}=e,{data:i,error:n}=await v.from("projects").update({name:t.name,description:t.description,feature_image_url:t.feature_image_url||null,gallery_images:t.gallery_images||[],external_link:t.external_link||null,showreel_link:t.showreel_link||null,display_order:t.display_order||0}).eq("id",r).eq("memberstack_id",y.id).select().single();if(n)throw n;const{error:c}=await v.from("project_sub_directories").delete().eq("project_id",r);if(c&&console.error("Error deleting old categories:",c),o&&o.length>0){const l=o.map(d=>({project_id:r,sub_directory_id:d})),{error:a}=await v.from("project_sub_directories").insert(l);a&&console.error("Error linking categories:",a)}return console.log("Project updated:",r),{...i,categories:o||[],gallery_images:i.gallery_images||[]}}catch(o){throw console.error("Error updating project:",o),o}}async function Q(r){try{const{error:e}=await v.from("projects").update({is_deleted:!0}).eq("id",r).eq("memberstack_id",y.id);if(e)throw e;return console.log("Project deleted:",r),!0}catch(e){throw console.error("Error deleting project:",e),e}}async function q(r,e=null){try{const o={memberstack_id:y.id,activity_type:r};e&&(o.entity_type="project",o.entity_id=e.id||null,o.entity_name=e.name||null),await fetch(`${$}/functions/v1/log-activity`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${E}`,apikey:E},body:JSON.stringify(o)})}catch(o){console.warn("Failed to log activity:",o)}}async function z(r,e){const o=Date.now(),t=r.name.split(".").pop(),i=`${y.id}/${e||"new"}/${o}.${t}`,{data:n,error:c}=await v.storage.from(P).upload(i,r,{cacheControl:"3600",upsert:!1});if(c)throw c;const{data:{publicUrl:l}}=v.storage.from(P).getPublicUrl(i);return console.log("Image uploaded:",l),l}function I(r){const e=x.subDirectories.find(o=>o.id===r);return e?e.name:r}function Z(r){return x.subDirectories.filter(e=>e.directory_slug===r)}function A(r){const e=r.querySelector("#mp-form-external_link"),o=r.querySelector("#mp-url-error");if(!e||!o)return;const t=()=>{const i=e.value.trim();i===""?(e.classList.remove("error","valid"),o.classList.remove("visible")):k(i)?(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible")):(e.classList.remove("valid"),e.classList.add("error"),o.classList.add("visible"))};e.addEventListener("blur",t),e.addEventListener("input",()=>{e.classList.contains("error")&&k(e.value)&&(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible"))}),e.value.trim()&&t()}function U(r){const e=r.querySelector("#mp-form-showreel_link"),o=r.querySelector("#mp-showreel-error");if(!e||!o)return;const t=()=>{const i=e.value.trim();i===""?(e.classList.remove("error","valid"),o.classList.remove("visible")):L(i)?(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible")):(e.classList.remove("valid"),e.classList.add("error"),o.classList.add("visible"))};e.addEventListener("blur",t),e.addEventListener("input",()=>{e.classList.contains("error")&&L(e.value)&&(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible"))}),e.value.trim()&&t()}const T=[{text:"Preparing project...",progress:10},{text:"Optimising images...",progress:25},{text:"Compiling data...",progress:45},{text:"Populating categories...",progress:60},{text:"Syncing to portfolio...",progress:80},{text:"Finalising...",progress:95}];function ee(r="Creating Project"){const e=document.createElement("div");return e.className="mp-progress-overlay",e.id="mp-progress-overlay",e.innerHTML=`
      <div class="mp-progress-container">
        <div class="mp-progress-spinner"></div>
        <div class="mp-progress-title">${r}</div>
        <div class="mp-progress-bar-wrapper">
          <div class="mp-progress-bar-fill" style="width: 5%;"></div>
        </div>
        <div class="mp-progress-status">Initialising...</div>
      </div>
    `,document.body.appendChild(e),e}function re(r,e){if(!r)return;const o=T[e];if(!o)return;const t=r.querySelector(".mp-progress-bar-fill"),i=r.querySelector(".mp-progress-status");t&&(t.style.width=o.progress+"%"),i&&(i.classList.add("fade"),setTimeout(()=>{i.textContent=o.text,i.classList.remove("fade")},150))}function te(){const r=document.getElementById("mp-progress-overlay");if(r){const e=r.querySelector(".mp-progress-bar-fill"),o=r.querySelector(".mp-progress-status");e&&(e.style.width="100%"),o&&(o.textContent="Complete!"),setTimeout(()=>{r.remove()},500)}}async function M(r,e="Creating Project"){const o=ee(e);let t=0;const i=setInterval(()=>{t<T.length&&(re(o,t),t++)},600);try{const n=await r();return clearInterval(i),te(),n}catch(n){clearInterval(i);const c=document.getElementById("mp-progress-overlay");throw c&&c.remove(),n}}function S(r){var c;if(f.length===0){r.innerHTML=`
        <div class="mp-empty">
          <p>You don't have any projects yet</p>
          <button class="mp-btn" id="mp-add-first">Add Your First Project</button>
        </div>
      `,r.querySelector("#mp-add-first").addEventListener("click",()=>F(r));return}const e=(c=y==null?void 0:y.customFields)==null?void 0:c["membership-type"],o=C(e),i=o-f.length<=0;let n=`
      <div class="mp-header">
        <h2>My Projects</h2>
        <div class="mp-header-right">
          <span class="mp-project-count">${f.length} of ${o} projects</span>
          <button class="mp-btn ${i?"mp-btn-disabled":""}" id="mp-add-project" ${i?"disabled":""}>
            ${i?"Limit Reached":"Add Another Project"}
          </button>
        </div>
      </div>
      <div class="mp-projects-list">
    `;f.forEach((l,a)=>{n+=oe(l)}),n+="</div>",r.innerHTML=n,r.querySelector("#mp-add-project").addEventListener("click",()=>{var d;const l=(d=y==null?void 0:y.customFields)==null?void 0:d["membership-type"],a=C(l);if(f.length>=a){se(a,l);return}F(r)}),r.querySelectorAll(".mp-project-card").forEach((l,a)=>{const d=f[a];ie(l,d,r)})}function oe(r,e){let o="";const t=r.description||"";o+=`
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
          ${i.length>0?i.map(a=>`<span class="mp-category-tag">${I(a)}</span>`).join(""):'<span class="mp-field-value empty">No categories selected</span>'}
        </div>
      </div>
    `;const n=r.feature_image_url,c=r.gallery_images||[];return(n||c.length>0)&&(o+=`
        <div class="mp-field">
          <div class="mp-field-label">Images</div>
          <div class="mp-images-display">
            ${n?`<img src="${r.feature_image_url}" class="mp-feature-thumb" alt="Feature">`:""}
            ${c.map((a,d)=>`<img src="${a}" alt="Gallery ${d+1}">`).join("")}
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
    `}function ie(r,e,o){const t=r.querySelector(".mp-project-content"),i=r.querySelector(".mp-toggle-details"),n=r.querySelector(".mp-toggle-icon"),c=r.querySelector(".mp-edit-btn"),l=r.querySelector(".mp-delete-btn");i.addEventListener("click",a=>{a.stopPropagation();const d=t.classList.toggle("open");n.classList.toggle("open",d)}),c.addEventListener("click",a=>{a.stopPropagation(),le(e,o)}),l.addEventListener("click",async()=>{if(confirm("Are you sure you want to delete this project?")){l.disabled=!0,l.textContent="Deleting...";try{const a=e.name,d=e.id;await Q(d),await q("project_delete",{id:d,name:a}),f=f.filter(u=>u.id!==d),S(o)}catch(a){console.error("Error deleting project:",a),alert("Error deleting project. Please try again."),l.disabled=!1,l.textContent="Delete"}}})}function N(r=[]){let e=`
      <div class="mp-category-section">
        <h4>Choose Project Categories</h4>
        <p style="font-size: 12px; color: #666; margin: 0 0 12px 0;">Select a category to see subcategories. You can choose from multiple categories.</p>
        <div class="mp-parent-categories">
    `;return x.directories.forEach(o=>{e+=`<button type="button" class="mp-parent-btn" data-parent="${o.slug}">${o.name}</button>`}),e+="</div>",x.directories.forEach(o=>{const t=Z(o.slug);e+=`<div class="mp-child-categories" data-parent="${o.slug}">`,t.forEach(i=>{const n=r.includes(i.id);e+=`<button type="button" class="mp-child-btn ${n?"selected":""}" data-id="${i.id}">${i.name}</button>`}),e+="</div>"}),e+=`
        <div class="mp-selected-categories" style="${r.length?"":"display: none;"}">
          <h5>Selected Categories</h5>
          <div class="mp-selected-list"></div>
        </div>
      </div>
    `,e}function R(r,e,o){const t=r.querySelectorAll(".mp-parent-btn"),i=r.querySelectorAll(".mp-child-categories"),n=r.querySelector(".mp-selected-list"),c=r.querySelector(".mp-selected-categories");function l(){n.innerHTML=e.map(a=>`<span class="mp-selected-tag">${I(a)}<button type="button" data-id="${a}">&times;</button></span>`).join(""),c.style.display=e.length?"":"none",r.querySelectorAll(".mp-child-btn").forEach(a=>{a.classList.toggle("selected",e.includes(a.dataset.id))})}t.forEach(a=>{a.addEventListener("click",()=>{const d=a.dataset.parent,u=a.classList.contains("active");t.forEach(m=>m.classList.remove("active")),i.forEach(m=>m.classList.remove("visible")),u||(a.classList.add("active"),r.querySelector(`.mp-child-categories[data-parent="${d}"]`).classList.add("visible"))})}),r.querySelectorAll(".mp-child-btn").forEach(a=>{a.addEventListener("click",()=>{const d=a.dataset.id,u=e.indexOf(d);u>-1?e.splice(u,1):e.push(d),l()})}),n.addEventListener("click",a=>{if(a.target.tagName==="BUTTON"){const d=a.target.dataset.id,u=e.indexOf(d);u>-1&&(e.splice(u,1),l())}}),l()}function O(r={}){const e=(r.gallery_images||[]).length;return`
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
    `}function B(r,e,o){const t=r.querySelector("#mp-feature-upload"),i=r.querySelector("#mp-feature-input");t.addEventListener("click",n=>{if(n.target.classList.contains("mp-remove-image")){n.stopPropagation(),e.feature_image_url="",t.classList.remove("has-image");const c=t.querySelector("img");c&&c.remove();return}t.classList.contains("has-image")||i.click()}),i.addEventListener("change",async n=>{const c=n.target.files[0];if(c){try{t.style.opacity="0.5";const l=await z(c,e.id);e.feature_image_url=l,t.classList.add("has-image");let a=t.querySelector("img");a||(a=document.createElement("img"),t.insertBefore(a,t.firstChild)),a.src=l,a.alt="Feature",t.style.opacity="1"}catch(l){console.error("Error uploading feature image:",l),alert("Error uploading image. Please try again."),t.style.opacity="1"}i.value=""}}),ae(r,e,o)}function ae(r,e,o){const t=r.querySelector("#mp-gallery-grid"),i=r.querySelector("#mp-gallery-input"),n=r.querySelector("#mp-gallery-add"),c=r.querySelector("#mp-gallery-count-num");e.gallery_images||(e.gallery_images=[]);function l(){if(t.innerHTML="",e.gallery_images.forEach((m,g)=>{const s=document.createElement("div");s.className="mp-gallery-item has-image",s.dataset.index=g,s.draggable=!0,s.innerHTML=`
          <img src="${m}" alt="Gallery ${g+1}">
          <button type="button" class="mp-remove-image">&times;</button>
          <span class="mp-drag-handle">Drag</span>
        `,t.appendChild(s)}),e.gallery_images.length<_){const m=document.createElement("div");m.className="mp-gallery-item mp-gallery-add",m.id="mp-gallery-add",m.innerHTML=`
          <div class="mp-upload-placeholder"><span>+</span>Add</div>
          <input type="file" accept="image/*" multiple style="display: none;" id="mp-gallery-input">
        `,t.appendChild(m);const g=m.querySelector("#mp-gallery-input");m.addEventListener("click",()=>g.click()),g.addEventListener("change",u)}c.textContent=e.gallery_images.length,a(),d()}function a(){const m=t.querySelectorAll(".mp-gallery-item.has-image");let g=null;m.forEach(s=>{s.addEventListener("dragstart",p=>{g=s,s.classList.add("dragging")}),s.addEventListener("dragend",()=>{s.classList.remove("dragging"),t.querySelectorAll(".mp-gallery-item").forEach(p=>p.classList.remove("drag-over"))}),s.addEventListener("dragover",p=>{p.preventDefault(),s!==g&&s.classList.contains("has-image")&&s.classList.add("drag-over")}),s.addEventListener("dragleave",()=>{s.classList.remove("drag-over")}),s.addEventListener("drop",p=>{if(p.preventDefault(),s.classList.remove("drag-over"),g&&s!==g){const b=parseInt(g.dataset.index),h=parseInt(s.dataset.index),j=e.gallery_images[b];e.gallery_images[b]=e.gallery_images[h],e.gallery_images[h]=j,l()}})})}function d(){t.querySelectorAll(".mp-gallery-item.has-image .mp-remove-image").forEach(m=>{m.addEventListener("click",g=>{g.stopPropagation();const s=m.closest(".mp-gallery-item"),p=parseInt(s.dataset.index);e.gallery_images.splice(p,1),l()})})}async function u(m){const g=Array.from(m.target.files);if(!g.length)return;const s=_-e.gallery_images.length,p=g.slice(0,s);for(const b of p)try{const h=await z(b,e.id);e.gallery_images.push(h),l()}catch(h){console.error("Error uploading gallery image:",h),alert("Error uploading image: "+b.name)}m.target.value=""}n&&n.addEventListener("click",()=>i==null?void 0:i.click()),i&&i.addEventListener("change",u),a(),d()}function se(r,e){const o=e?e.replace(/-/g," ").replace(/\b\w/g,i=>i.toUpperCase()):"your membership",t=document.createElement("div");t.className="mp-modal-overlay",t.innerHTML=`
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
    `,document.body.appendChild(t),t.querySelector("#mp-modal-close").addEventListener("click",()=>t.remove()),t.addEventListener("click",i=>{i.target===t&&t.remove()})}function F(r){const e=[],o={feature_image_url:"",gallery_images:[]},t=document.createElement("div");t.className="mp-modal-overlay",t.innerHTML=`
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
            <div class="mp-input-hint">Minimum 50 words required (<span id="mp-word-count">0</span> words)</div>
            <div class="mp-input-error" id="mp-description-error">Please enter at least 50 words</div>
          </div>

          ${N(e)}
          ${O(o)}

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
    `,document.body.appendChild(t),R(t,e),B(t,o,null),A(t),U(t);const i=t.querySelector("#mp-form-description"),n=t.querySelector("#mp-word-count"),c=()=>{const a=i.value.trim(),d=a?a.split(/\s+/).filter(u=>u.length>0).length:0;n.textContent=d,n.style.color=d>=50?"#28a745":"#666",t.querySelector("#mp-description-error").style.display="none"};i.addEventListener("input",c),c(),t.addEventListener("click",a=>{a.target===t&&t.remove()}),t.querySelector("#mp-modal-cancel").addEventListener("click",()=>t.remove());const l=t.querySelector("#mp-modal-save");l.addEventListener("click",async()=>{const a=t.querySelector("#mp-form-name").value.trim(),d=t.querySelector("#mp-form-description").value.trim(),u=d?d.split(/\s+/).filter(s=>s.length>0).length:0;if(!a){alert("Project name is required");return}if(u<50){const s=t.querySelector("#mp-description-error");s&&(s.style.display="block"),t.querySelector("#mp-form-description").focus();return}const m=t.querySelector("#mp-form-showreel_link").value.trim();if(m&&!L(m)){const s=t.querySelector("#mp-showreel-error");s&&s.classList.add("visible"),t.querySelector("#mp-form-showreel_link").classList.add("error"),t.querySelector("#mp-form-showreel_link").focus();return}const g=t.querySelector("#mp-form-external_link").value.trim();if(g&&!k(g)){const s=t.querySelector("#mp-url-error");s&&s.classList.add("visible"),t.querySelector("#mp-form-external_link").classList.add("error"),t.querySelector("#mp-form-external_link").focus();return}l.disabled=!0,l.textContent="Creating...",t.style.display="none";try{const s=await M(async()=>await K({name:a,description:d,external_link:w(t.querySelector("#mp-form-external_link").value),showreel_link:w(t.querySelector("#mp-form-showreel_link").value),display_order:parseInt(t.querySelector("#mp-form-display_order").value)||0,categories:[...e],feature_image_url:o.feature_image_url||"",gallery_images:o.gallery_images||[]}),"Creating Project");await q("project_create",{id:s.id,name:s.name}),f.push(s),f.sort((p,b)=>(p.display_order||0)-(b.display_order||0)),t.remove(),S(r)}catch(s){console.error("Error creating project:",s),t.style.display="",alert("Error creating project. Please try again."),l.disabled=!1,l.textContent="Create Project"}}),t.querySelector("#mp-form-name").focus()}function le(r,e){const o=[...r.categories||[]],t={id:r.id,feature_image_url:r.feature_image_url||"",gallery_images:[...r.gallery_images||[]]},i=document.createElement("div");i.className="mp-modal-overlay",i.innerHTML=`
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
            <div class="mp-input-hint">Minimum 50 words required (<span id="mp-word-count">0</span> words)</div>
            <div class="mp-input-error" id="mp-description-error">Please enter at least 50 words</div>
          </div>

          ${N(o)}
          ${O(t)}

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
    `,document.body.appendChild(i),R(i,o),B(i,t,null),A(i),U(i);const n=i.querySelector("#mp-form-description"),c=i.querySelector("#mp-word-count"),l=()=>{const d=n.value.trim(),u=d?d.split(/\s+/).filter(m=>m.length>0).length:0;c.textContent=u,c.style.color=u>=50?"#28a745":"#666",i.querySelector("#mp-description-error").style.display="none"};n.addEventListener("input",l),l(),i.addEventListener("click",d=>{d.target===i&&i.remove()}),i.querySelector("#mp-modal-cancel").addEventListener("click",()=>i.remove());const a=i.querySelector("#mp-modal-save");a.addEventListener("click",async()=>{const d=i.querySelector("#mp-form-name").value.trim(),u=i.querySelector("#mp-form-description").value.trim(),m=u?u.split(/\s+/).filter(p=>p.length>0).length:0;if(!d){alert("Project name is required");return}if(m<50){const p=i.querySelector("#mp-description-error");p&&(p.style.display="block"),i.querySelector("#mp-form-description").focus();return}const g=i.querySelector("#mp-form-showreel_link").value.trim();if(g&&!L(g)){const p=i.querySelector("#mp-showreel-error");p&&p.classList.add("visible"),i.querySelector("#mp-form-showreel_link").classList.add("error"),i.querySelector("#mp-form-showreel_link").focus();return}const s=i.querySelector("#mp-form-external_link").value.trim();if(s&&!k(s)){const p=i.querySelector("#mp-url-error");p&&p.classList.add("visible"),i.querySelector("#mp-form-external_link").classList.add("error"),i.querySelector("#mp-form-external_link").focus();return}a.disabled=!0,a.textContent="Saving...",i.style.display="none";try{const p=await M(async()=>await X(r.id,{name:d,description:u,external_link:w(i.querySelector("#mp-form-external_link").value),showreel_link:w(i.querySelector("#mp-form-showreel_link").value),display_order:parseInt(i.querySelector("#mp-form-display_order").value)||0,categories:[...o],feature_image_url:t.feature_image_url||"",gallery_images:t.gallery_images||[]}),"Saving Changes");await q("project_update",{id:p.id,name:p.name});const b=f.findIndex(h=>h.id===r.id);b>-1&&(f[b]=p),f.sort((h,j)=>(h.display_order||0)-(j.display_order||0)),i.remove(),S(e)}catch(p){console.error("Error updating project:",p),i.style.display="",alert("Error updating project. Please try again."),a.disabled=!1,a.textContent="Save Changes"}})}function ne(){return new Promise(r=>{if(window.$memberstackDom)r();else{const e=setInterval(()=>{window.$memberstackDom&&(clearInterval(e),r())},100)}})}function de(){return new Promise((r,e)=>{if(window.supabase){r();return}let o=0;const t=50,i=setInterval(()=>{o++,window.supabase?(clearInterval(i),r()):o>=t&&(clearInterval(i),e(new Error("Supabase library not loaded")))},100)})}async function D(){const r=document.querySelector(".supabase-project-container");if(!r){console.warn("Could not find .supabase-project-container");return}const e=document.createElement("style");e.textContent=G,document.head.appendChild(e);const o=document.createElement("div");o.className="mp-container",o.innerHTML='<div class="mp-loading">Loading projects...</div>',r.appendChild(o);try{if(await de(),await ne(),!Y()){o.innerHTML='<div class="mp-loading">Error: Could not initialize Supabase</div>';return}const{data:t}=await window.$memberstackDom.getCurrentMember();if(!t){o.innerHTML='<div class="mp-loading">Please log in to view your projects.</div>';return}y=t,console.log("Current member:",y.id),x=await W(),console.log(`Categories loaded: ${x.directories.length} directories, ${x.subDirectories.length} sub-directories`),f=await J(t.id),S(o)}catch(t){console.error("Error initializing member projects:",t),o.innerHTML='<div class="mp-loading">Error loading projects. Please refresh the page.</div>'}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",D):D()})();
