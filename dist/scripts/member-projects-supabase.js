(function(){console.log("Member projects Supabase script loaded");const R="https://epszwomtxkpjegbjbixr.supabase.co",D="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",q="project-images",_=20,F={emerging:2,professional:5,"small-business":5,"not-for-profit":5,"large-business":8,"spaces-suppliers":5};let y=null,v=null,f=[],x={directories:[],subDirectories:[]};const H=`
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
  `;function G(){return window.supabase?(y=window.supabase.createClient(R,D),console.log("Supabase client initialized"),!0):(console.error("Supabase JS library not loaded"),!1)}function j(r){if(!r)return 2;const e=r.toLowerCase();return F[e]||2}function B(r){return r.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,50)+"-"+Date.now().toString(36)}function w(r){if(!r||r.trim()==="")return"";let e=r.trim();/^https?:\/\//i.test(e)||(e="https://"+e);try{return new URL(e),e}catch{return""}}function L(r){if(!r||r.trim()==="")return!0;let e=r.trim();/^https?:\/\//i.test(e)||(e="https://"+e);try{return new URL(e),!0}catch{return!1}}function k(r){if(!r||r.trim()==="")return!0;let e=r.trim();/^https?:\/\//i.test(e)||(e="https://"+e);try{const t=new URL(e).hostname.toLowerCase();return!!(t.includes("youtube.com")||t.includes("youtu.be")||t.includes("vimeo.com"))}catch{return!1}}async function O(){try{const{data:r,error:e}=await y.from("directories").select("id, webflow_id, name, slug").order("display_order");if(e)throw e;const{data:o,error:t}=await y.from("sub_directories").select("id, webflow_id, name, slug, directory_slug").order("name");if(t)throw t;return console.log(`Loaded ${r.length} directories and ${o.length} sub-directories`),{directories:r,subDirectories:o}}catch(r){return console.error("Error loading categories:",r),{directories:[],subDirectories:[]}}}async function Y(r){try{const{data:e,error:o}=await y.from("projects").select(`
          *,
          project_sub_directories (
            sub_directory_id
          )
        `).eq("memberstack_id",r).eq("is_deleted",!1).order("display_order",{ascending:!0});if(o)throw o;const t=e.map(i=>{var n;return{...i,categories:((n=i.project_sub_directories)==null?void 0:n.map(c=>c.sub_directory_id))||[],gallery_images:i.gallery_images||[]}});return console.log(`Loaded ${t.length} projects for member ${r}`),t}catch(e){return console.error("Error loading projects:",e),[]}}async function V(r){try{const{categories:e,...o}=r,{data:t,error:i}=await y.from("projects").insert({memberstack_id:v.id,name:o.name,slug:B(o.name),description:o.description,feature_image_url:o.feature_image_url||null,gallery_images:o.gallery_images||[],external_link:o.external_link||null,showreel_link:o.showreel_link||null,display_order:o.display_order||0,is_draft:!1,is_deleted:!1}).select().single();if(i)throw i;if(e&&e.length>0){const n=e.map(s=>({project_id:t.id,sub_directory_id:s})),{error:c}=await y.from("project_sub_directories").insert(n);c&&console.error("Error linking categories:",c)}return console.log("Project created:",t.id),{...t,categories:e||[],gallery_images:t.gallery_images||[]}}catch(e){throw console.error("Error creating project:",e),e}}async function W(r,e){try{const{categories:o,...t}=e,{data:i,error:n}=await y.from("projects").update({name:t.name,description:t.description,feature_image_url:t.feature_image_url||null,gallery_images:t.gallery_images||[],external_link:t.external_link||null,showreel_link:t.showreel_link||null,display_order:t.display_order||0}).eq("id",r).eq("memberstack_id",v.id).select().single();if(n)throw n;const{error:c}=await y.from("project_sub_directories").delete().eq("project_id",r);if(c&&console.error("Error deleting old categories:",c),o&&o.length>0){const s=o.map(d=>({project_id:r,sub_directory_id:d})),{error:a}=await y.from("project_sub_directories").insert(s);a&&console.error("Error linking categories:",a)}return console.log("Project updated:",r),{...i,categories:o||[],gallery_images:i.gallery_images||[]}}catch(o){throw console.error("Error updating project:",o),o}}async function J(r){try{const{error:e}=await y.from("projects").update({is_deleted:!0}).eq("id",r).eq("memberstack_id",v.id);if(e)throw e;return console.log("Project deleted:",r),!0}catch(e){throw console.error("Error deleting project:",e),e}}async function $(r,e){const o=Date.now(),t=r.name.split(".").pop(),i=`${v.id}/${e||"new"}/${o}.${t}`,{data:n,error:c}=await y.storage.from(q).upload(i,r,{cacheControl:"3600",upsert:!1});if(c)throw c;const{data:{publicUrl:s}}=y.storage.from(q).getPublicUrl(i);return console.log("Image uploaded:",s),s}function C(r){const e=x.subDirectories.find(o=>o.id===r);return e?e.name:r}function K(r){return x.subDirectories.filter(e=>e.directory_slug===r)}function P(r){const e=r.querySelector("#mp-form-external_link"),o=r.querySelector("#mp-url-error");if(!e||!o)return;const t=()=>{const i=e.value.trim();i===""?(e.classList.remove("error","valid"),o.classList.remove("visible")):L(i)?(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible")):(e.classList.remove("valid"),e.classList.add("error"),o.classList.add("visible"))};e.addEventListener("blur",t),e.addEventListener("input",()=>{e.classList.contains("error")&&L(e.value)&&(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible"))}),e.value.trim()&&t()}function z(r){const e=r.querySelector("#mp-form-showreel_link"),o=r.querySelector("#mp-showreel-error");if(!e||!o)return;const t=()=>{const i=e.value.trim();i===""?(e.classList.remove("error","valid"),o.classList.remove("visible")):k(i)?(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible")):(e.classList.remove("valid"),e.classList.add("error"),o.classList.add("visible"))};e.addEventListener("blur",t),e.addEventListener("input",()=>{e.classList.contains("error")&&k(e.value)&&(e.classList.remove("error"),e.classList.add("valid"),o.classList.remove("visible"))}),e.value.trim()&&t()}function S(r){var c;if(f.length===0){r.innerHTML=`
        <div class="mp-empty">
          <p>You don't have any projects yet</p>
          <button class="mp-btn" id="mp-add-first">Add Your First Project</button>
        </div>
      `,r.querySelector("#mp-add-first").addEventListener("click",()=>T(r));return}const e=(c=v==null?void 0:v.customFields)==null?void 0:c["membership-type"],o=j(e),i=o-f.length<=0;let n=`
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
    `;f.forEach((s,a)=>{n+=X(s)}),n+="</div>",r.innerHTML=n,r.querySelector("#mp-add-project").addEventListener("click",()=>{var d;const s=(d=v==null?void 0:v.customFields)==null?void 0:d["membership-type"],a=j(s);if(f.length>=a){ee(a,s);return}T(r)}),r.querySelectorAll(".mp-project-card").forEach((s,a)=>{const d=f[a];Q(s,d,r)})}function X(r,e){let o="";const t=r.description||"";o+=`
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
          ${i.length>0?i.map(a=>`<span class="mp-category-tag">${C(a)}</span>`).join(""):'<span class="mp-field-value empty">No categories selected</span>'}
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
    `}function Q(r,e,o){const t=r.querySelector(".mp-project-content"),i=r.querySelector(".mp-toggle-details"),n=r.querySelector(".mp-toggle-icon"),c=r.querySelector(".mp-edit-btn"),s=r.querySelector(".mp-delete-btn");i.addEventListener("click",a=>{a.stopPropagation();const d=t.classList.toggle("open");n.classList.toggle("open",d)}),c.addEventListener("click",a=>{a.stopPropagation(),re(e,o)}),s.addEventListener("click",async()=>{if(confirm("Are you sure you want to delete this project?")){s.disabled=!0,s.textContent="Deleting...";try{await J(e.id),f=f.filter(a=>a.id!==e.id),S(o)}catch(a){console.error("Error deleting project:",a),alert("Error deleting project. Please try again."),s.disabled=!1,s.textContent="Delete"}}})}function U(r=[]){let e=`
      <div class="mp-category-section">
        <h4>Choose Project Categories</h4>
        <p style="font-size: 12px; color: #666; margin: 0 0 12px 0;">Select a category to see subcategories. You can choose from multiple categories.</p>
        <div class="mp-parent-categories">
    `;return x.directories.forEach(o=>{e+=`<button type="button" class="mp-parent-btn" data-parent="${o.slug}">${o.name}</button>`}),e+="</div>",x.directories.forEach(o=>{const t=K(o.slug);e+=`<div class="mp-child-categories" data-parent="${o.slug}">`,t.forEach(i=>{const n=r.includes(i.id);e+=`<button type="button" class="mp-child-btn ${n?"selected":""}" data-id="${i.id}">${i.name}</button>`}),e+="</div>"}),e+=`
        <div class="mp-selected-categories" style="${r.length?"":"display: none;"}">
          <h5>Selected Categories</h5>
          <div class="mp-selected-list"></div>
        </div>
      </div>
    `,e}function A(r,e,o){const t=r.querySelectorAll(".mp-parent-btn"),i=r.querySelectorAll(".mp-child-categories"),n=r.querySelector(".mp-selected-list"),c=r.querySelector(".mp-selected-categories");function s(){n.innerHTML=e.map(a=>`<span class="mp-selected-tag">${C(a)}<button type="button" data-id="${a}">&times;</button></span>`).join(""),c.style.display=e.length?"":"none",r.querySelectorAll(".mp-child-btn").forEach(a=>{a.classList.toggle("selected",e.includes(a.dataset.id))})}t.forEach(a=>{a.addEventListener("click",()=>{const d=a.dataset.parent,g=a.classList.contains("active");t.forEach(p=>p.classList.remove("active")),i.forEach(p=>p.classList.remove("visible")),g||(a.classList.add("active"),r.querySelector(`.mp-child-categories[data-parent="${d}"]`).classList.add("visible"))})}),r.querySelectorAll(".mp-child-btn").forEach(a=>{a.addEventListener("click",()=>{const d=a.dataset.id,g=e.indexOf(d);g>-1?e.splice(g,1):e.push(d),s()})}),n.addEventListener("click",a=>{if(a.target.tagName==="BUTTON"){const d=a.target.dataset.id,g=e.indexOf(d);g>-1&&(e.splice(g,1),s())}}),s()}function I(r={}){const e=(r.gallery_images||[]).length;return`
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
    `}function M(r,e,o){const t=r.querySelector("#mp-feature-upload"),i=r.querySelector("#mp-feature-input");t.addEventListener("click",n=>{if(n.target.classList.contains("mp-remove-image")){n.stopPropagation(),e.feature_image_url="",t.classList.remove("has-image");const c=t.querySelector("img");c&&c.remove();return}t.classList.contains("has-image")||i.click()}),i.addEventListener("change",async n=>{const c=n.target.files[0];if(c){try{t.style.opacity="0.5";const s=await $(c,e.id);e.feature_image_url=s,t.classList.add("has-image");let a=t.querySelector("img");a||(a=document.createElement("img"),t.insertBefore(a,t.firstChild)),a.src=s,a.alt="Feature",t.style.opacity="1"}catch(s){console.error("Error uploading feature image:",s),alert("Error uploading image. Please try again."),t.style.opacity="1"}i.value=""}}),Z(r,e,o)}function Z(r,e,o){const t=r.querySelector("#mp-gallery-grid"),i=r.querySelector("#mp-gallery-input"),n=r.querySelector("#mp-gallery-add"),c=r.querySelector("#mp-gallery-count-num");e.gallery_images||(e.gallery_images=[]);function s(){if(t.innerHTML="",e.gallery_images.forEach((p,u)=>{const l=document.createElement("div");l.className="mp-gallery-item has-image",l.dataset.index=u,l.draggable=!0,l.innerHTML=`
          <img src="${p}" alt="Gallery ${u+1}">
          <button type="button" class="mp-remove-image">&times;</button>
          <span class="mp-drag-handle">Drag</span>
        `,t.appendChild(l)}),e.gallery_images.length<_){const p=document.createElement("div");p.className="mp-gallery-item mp-gallery-add",p.id="mp-gallery-add",p.innerHTML=`
          <div class="mp-upload-placeholder"><span>+</span>Add</div>
          <input type="file" accept="image/*" multiple style="display: none;" id="mp-gallery-input">
        `,t.appendChild(p);const u=p.querySelector("#mp-gallery-input");p.addEventListener("click",()=>u.click()),u.addEventListener("change",g)}c.textContent=e.gallery_images.length,a(),d()}function a(){const p=t.querySelectorAll(".mp-gallery-item.has-image");let u=null;p.forEach(l=>{l.addEventListener("dragstart",m=>{u=l,l.classList.add("dragging")}),l.addEventListener("dragend",()=>{l.classList.remove("dragging"),t.querySelectorAll(".mp-gallery-item").forEach(m=>m.classList.remove("drag-over"))}),l.addEventListener("dragover",m=>{m.preventDefault(),l!==u&&l.classList.contains("has-image")&&l.classList.add("drag-over")}),l.addEventListener("dragleave",()=>{l.classList.remove("drag-over")}),l.addEventListener("drop",m=>{if(m.preventDefault(),l.classList.remove("drag-over"),u&&l!==u){const b=parseInt(u.dataset.index),h=parseInt(l.dataset.index),E=e.gallery_images[b];e.gallery_images[b]=e.gallery_images[h],e.gallery_images[h]=E,s()}})})}function d(){t.querySelectorAll(".mp-gallery-item.has-image .mp-remove-image").forEach(p=>{p.addEventListener("click",u=>{u.stopPropagation();const l=p.closest(".mp-gallery-item"),m=parseInt(l.dataset.index);e.gallery_images.splice(m,1),s()})})}async function g(p){const u=Array.from(p.target.files);if(!u.length)return;const l=_-e.gallery_images.length,m=u.slice(0,l);for(const b of m)try{const h=await $(b,e.id);e.gallery_images.push(h),s()}catch(h){console.error("Error uploading gallery image:",h),alert("Error uploading image: "+b.name)}p.target.value=""}n&&n.addEventListener("click",()=>i==null?void 0:i.click()),i&&i.addEventListener("change",g),a(),d()}function ee(r,e){const o=e?e.replace(/-/g," ").replace(/\b\w/g,i=>i.toUpperCase()):"your membership",t=document.createElement("div");t.className="mp-modal-overlay",t.innerHTML=`
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
    `,document.body.appendChild(t),t.querySelector("#mp-modal-close").addEventListener("click",()=>t.remove()),t.addEventListener("click",i=>{i.target===t&&t.remove()})}function T(r){const e=[],o={feature_image_url:"",gallery_images:[]},t=document.createElement("div");t.className="mp-modal-overlay",t.innerHTML=`
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

          ${U(e)}
          ${I(o)}

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
    `,document.body.appendChild(t),A(t,e),M(t,o,null),P(t),z(t);const i=t.querySelector("#mp-form-description"),n=t.querySelector("#mp-word-count"),c=()=>{const a=i.value.trim(),d=a?a.split(/\s+/).filter(g=>g.length>0).length:0;n.textContent=d,n.style.color=d>=50?"#28a745":"#666",t.querySelector("#mp-description-error").style.display="none"};i.addEventListener("input",c),c(),t.addEventListener("click",a=>{a.target===t&&t.remove()}),t.querySelector("#mp-modal-cancel").addEventListener("click",()=>t.remove());const s=t.querySelector("#mp-modal-save");s.addEventListener("click",async()=>{const a=t.querySelector("#mp-form-name").value.trim(),d=t.querySelector("#mp-form-description").value.trim(),g=d?d.split(/\s+/).filter(l=>l.length>0).length:0;if(!a){alert("Project name is required");return}if(g<50){const l=t.querySelector("#mp-description-error");l&&(l.style.display="block"),t.querySelector("#mp-form-description").focus();return}const p=t.querySelector("#mp-form-showreel_link").value.trim();if(p&&!k(p)){const l=t.querySelector("#mp-showreel-error");l&&l.classList.add("visible"),t.querySelector("#mp-form-showreel_link").classList.add("error"),t.querySelector("#mp-form-showreel_link").focus();return}const u=t.querySelector("#mp-form-external_link").value.trim();if(u&&!L(u)){const l=t.querySelector("#mp-url-error");l&&l.classList.add("visible"),t.querySelector("#mp-form-external_link").classList.add("error"),t.querySelector("#mp-form-external_link").focus();return}s.disabled=!0,s.textContent="Creating...";try{const l=await V({name:a,description:d,external_link:w(t.querySelector("#mp-form-external_link").value),showreel_link:w(t.querySelector("#mp-form-showreel_link").value),display_order:parseInt(t.querySelector("#mp-form-display_order").value)||0,categories:[...e],feature_image_url:o.feature_image_url||"",gallery_images:o.gallery_images||[]});f.push(l),f.sort((m,b)=>(m.display_order||0)-(b.display_order||0)),t.remove(),S(r)}catch(l){console.error("Error creating project:",l),alert("Error creating project. Please try again."),s.disabled=!1,s.textContent="Create Project"}}),t.querySelector("#mp-form-name").focus()}function re(r,e){const o=[...r.categories||[]],t={id:r.id,feature_image_url:r.feature_image_url||"",gallery_images:[...r.gallery_images||[]]},i=document.createElement("div");i.className="mp-modal-overlay",i.innerHTML=`
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

          ${U(o)}
          ${I(t)}

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
    `,document.body.appendChild(i),A(i,o),M(i,t,null),P(i),z(i);const n=i.querySelector("#mp-form-description"),c=i.querySelector("#mp-word-count"),s=()=>{const d=n.value.trim(),g=d?d.split(/\s+/).filter(p=>p.length>0).length:0;c.textContent=g,c.style.color=g>=50?"#28a745":"#666",i.querySelector("#mp-description-error").style.display="none"};n.addEventListener("input",s),s(),i.addEventListener("click",d=>{d.target===i&&i.remove()}),i.querySelector("#mp-modal-cancel").addEventListener("click",()=>i.remove());const a=i.querySelector("#mp-modal-save");a.addEventListener("click",async()=>{const d=i.querySelector("#mp-form-name").value.trim(),g=i.querySelector("#mp-form-description").value.trim(),p=g?g.split(/\s+/).filter(m=>m.length>0).length:0;if(!d){alert("Project name is required");return}if(p<50){const m=i.querySelector("#mp-description-error");m&&(m.style.display="block"),i.querySelector("#mp-form-description").focus();return}const u=i.querySelector("#mp-form-showreel_link").value.trim();if(u&&!k(u)){const m=i.querySelector("#mp-showreel-error");m&&m.classList.add("visible"),i.querySelector("#mp-form-showreel_link").classList.add("error"),i.querySelector("#mp-form-showreel_link").focus();return}const l=i.querySelector("#mp-form-external_link").value.trim();if(l&&!L(l)){const m=i.querySelector("#mp-url-error");m&&m.classList.add("visible"),i.querySelector("#mp-form-external_link").classList.add("error"),i.querySelector("#mp-form-external_link").focus();return}a.disabled=!0,a.textContent="Saving...";try{const m=await W(r.id,{name:d,description:g,external_link:w(i.querySelector("#mp-form-external_link").value),showreel_link:w(i.querySelector("#mp-form-showreel_link").value),display_order:parseInt(i.querySelector("#mp-form-display_order").value)||0,categories:[...o],feature_image_url:t.feature_image_url||"",gallery_images:t.gallery_images||[]}),b=f.findIndex(h=>h.id===r.id);b>-1&&(f[b]=m),f.sort((h,E)=>(h.display_order||0)-(E.display_order||0)),i.remove(),S(e)}catch(m){console.error("Error updating project:",m),alert("Error updating project. Please try again."),a.disabled=!1,a.textContent="Save Changes"}})}function te(){return new Promise(r=>{if(window.$memberstackDom)r();else{const e=setInterval(()=>{window.$memberstackDom&&(clearInterval(e),r())},100)}})}function oe(){return new Promise((r,e)=>{if(window.supabase){r();return}let o=0;const t=50,i=setInterval(()=>{o++,window.supabase?(clearInterval(i),r()):o>=t&&(clearInterval(i),e(new Error("Supabase library not loaded")))},100)})}async function N(){const r=document.querySelector(".supabase-project-container");if(!r){console.warn("Could not find .supabase-project-container");return}const e=document.createElement("style");e.textContent=H,document.head.appendChild(e);const o=document.createElement("div");o.className="mp-container",o.innerHTML='<div class="mp-loading">Loading projects...</div>',r.appendChild(o);try{if(await oe(),await te(),!G()){o.innerHTML='<div class="mp-loading">Error: Could not initialize Supabase</div>';return}const{data:t}=await window.$memberstackDom.getCurrentMember();if(!t){o.innerHTML='<div class="mp-loading">Please log in to view your projects.</div>';return}v=t,console.log("Current member:",v.id),x=await O(),console.log(`Categories loaded: ${x.directories.length} directories, ${x.subDirectories.length} sub-directories`),f=await Y(t.id),S(o)}catch(t){console.error("Error initializing member projects:",t),o.innerHTML='<div class="mp-loading">Error loading projects. Please refresh the page.</div>'}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",N):N()})();
