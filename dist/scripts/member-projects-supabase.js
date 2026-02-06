(function(){console.log("Member projects Supabase script loaded");const M="https://epszwomtxkpjegbjbixr.supabase.co",N="sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH",k="project-images",_=20,T={emerging:2,professional:5,"small-business":5,"not-for-profit":5,"large-business":8,"spaces-suppliers":5};let y=null,b=null,g=[],v={directories:[],subDirectories:[]};const R=`
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
  `;function D(){return window.supabase?(y=window.supabase.createClient(M,N),console.log("Supabase client initialized"),!0):(console.error("Supabase JS library not loaded"),!1)}function L(e){if(!e)return 2;const r=e.toLowerCase();return T[r]||2}function F(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").substring(0,50)+"-"+Date.now().toString(36)}function E(e){if(!e||e.trim()==="")return"";let r=e.trim();/^https?:\/\//i.test(r)||(r="https://"+r);try{return new URL(r),r}catch{return""}}function S(e){if(!e||e.trim()==="")return!0;let r=e.trim();/^https?:\/\//i.test(r)||(r="https://"+r);try{return new URL(r),!0}catch{return!1}}async function H(){try{const{data:e,error:r}=await y.from("directories").select("id, webflow_id, name, slug").order("display_order");if(r)throw r;const{data:o,error:t}=await y.from("sub_directories").select("id, webflow_id, name, slug, directory_slug").order("name");if(t)throw t;return console.log(`Loaded ${e.length} directories and ${o.length} sub-directories`),{directories:e,subDirectories:o}}catch(e){return console.error("Error loading categories:",e),{directories:[],subDirectories:[]}}}async function G(e){try{const{data:r,error:o}=await y.from("projects").select(`
          *,
          project_sub_directories (
            sub_directory_id
          )
        `).eq("memberstack_id",e).eq("is_deleted",!1).order("display_order",{ascending:!0});if(o)throw o;const t=r.map(a=>{var s;return{...a,categories:((s=a.project_sub_directories)==null?void 0:s.map(d=>d.sub_directory_id))||[],gallery_images:a.gallery_images||[]}});return console.log(`Loaded ${t.length} projects for member ${e}`),t}catch(r){return console.error("Error loading projects:",r),[]}}async function B(e){try{const{categories:r,...o}=e,{data:t,error:a}=await y.from("projects").insert({memberstack_id:b.id,name:o.name,slug:F(o.name),description:o.description,feature_image_url:o.feature_image_url||null,gallery_images:o.gallery_images||[],external_link:o.external_link||null,showreel_link:o.showreel_link||null,display_order:o.display_order||0,is_draft:!1,is_deleted:!1}).select().single();if(a)throw a;if(r&&r.length>0){const s=r.map(l=>({project_id:t.id,sub_directory_id:l})),{error:d}=await y.from("project_sub_directories").insert(s);d&&console.error("Error linking categories:",d)}return console.log("Project created:",t.id),{...t,categories:r||[],gallery_images:t.gallery_images||[]}}catch(r){throw console.error("Error creating project:",r),r}}async function O(e,r){try{const{categories:o,...t}=r,{data:a,error:s}=await y.from("projects").update({name:t.name,description:t.description,feature_image_url:t.feature_image_url||null,gallery_images:t.gallery_images||[],external_link:t.external_link||null,showreel_link:t.showreel_link||null,display_order:t.display_order||0}).eq("id",e).eq("memberstack_id",b.id).select().single();if(s)throw s;const{error:d}=await y.from("project_sub_directories").delete().eq("project_id",e);if(d&&console.error("Error deleting old categories:",d),o&&o.length>0){const l=o.map(n=>({project_id:e,sub_directory_id:n})),{error:i}=await y.from("project_sub_directories").insert(l);i&&console.error("Error linking categories:",i)}return console.log("Project updated:",e),{...a,categories:o||[],gallery_images:a.gallery_images||[]}}catch(o){throw console.error("Error updating project:",o),o}}async function Y(e){try{const{error:r}=await y.from("projects").update({is_deleted:!0}).eq("id",e).eq("memberstack_id",b.id);if(r)throw r;return console.log("Project deleted:",e),!0}catch(r){throw console.error("Error deleting project:",r),r}}async function j(e,r){const o=Date.now(),t=e.name.split(".").pop(),a=`${b.id}/${r||"new"}/${o}.${t}`,{data:s,error:d}=await y.storage.from(k).upload(a,e,{cacheControl:"3600",upsert:!1});if(d)throw d;const{data:{publicUrl:l}}=y.storage.from(k).getPublicUrl(a);return console.log("Image uploaded:",l),l}function q(e){const r=v.subDirectories.find(o=>o.id===e);return r?r.name:e}function V(e){return v.subDirectories.filter(r=>r.directory_slug===e)}function $(e){const r=e.querySelector("#mp-form-external_link"),o=e.querySelector("#mp-url-error");if(!r||!o)return;const t=()=>{const a=r.value.trim();a===""?(r.classList.remove("error","valid"),o.classList.remove("visible")):S(a)?(r.classList.remove("error"),r.classList.add("valid"),o.classList.remove("visible")):(r.classList.remove("valid"),r.classList.add("error"),o.classList.add("visible"))};r.addEventListener("blur",t),r.addEventListener("input",()=>{r.classList.contains("error")&&S(r.value)&&(r.classList.remove("error"),r.classList.add("valid"),o.classList.remove("visible"))}),r.value.trim()&&t()}function w(e){var d;if(g.length===0){e.innerHTML=`
        <div class="mp-empty">
          <p>You don't have any projects yet</p>
          <button class="mp-btn" id="mp-add-first">Add Your First Project</button>
        </div>
      `,e.querySelector("#mp-add-first").addEventListener("click",()=>I(e));return}const r=(d=b==null?void 0:b.customFields)==null?void 0:d["membership-type"],o=L(r),a=o-g.length<=0;let s=`
      <div class="mp-header">
        <h2>My Projects</h2>
        <div class="mp-header-right">
          <span class="mp-project-count">${g.length} of ${o} projects</span>
          <button class="mp-btn ${a?"mp-btn-disabled":""}" id="mp-add-project" ${a?"disabled":""}>
            ${a?"Limit Reached":"Add Another Project"}
          </button>
        </div>
      </div>
      <div class="mp-projects-list">
    `;g.forEach((l,i)=>{s+=W(l)}),s+="</div>",e.innerHTML=s,e.querySelector("#mp-add-project").addEventListener("click",()=>{var n;const l=(n=b==null?void 0:b.customFields)==null?void 0:n["membership-type"],i=L(l);if(g.length>=i){X(i,l);return}I(e)}),e.querySelectorAll(".mp-project-card").forEach((l,i)=>{const n=g[i];J(l,n,e)})}function W(e,r){let o="";const t=e.description||"";o+=`
      <div class="mp-field">
        <div class="mp-field-label">Description</div>
        <div class="mp-field-value ${t?"":"empty"}">
          ${t||"No description"}
        </div>
      </div>
    `;const a=e.categories||[];o+=`
      <div class="mp-field">
        <div class="mp-field-label">Categories</div>
        <div class="mp-categories-display">
          ${a.length>0?a.map(i=>`<span class="mp-category-tag">${q(i)}</span>`).join(""):'<span class="mp-field-value empty">No categories selected</span>'}
        </div>
      </div>
    `;const s=e.feature_image_url,d=e.gallery_images||[];return(s||d.length>0)&&(o+=`
        <div class="mp-field">
          <div class="mp-field-label">Images</div>
          <div class="mp-images-display">
            ${s?`<img src="${e.feature_image_url}" class="mp-feature-thumb" alt="Feature">`:""}
            ${d.map((i,n)=>`<img src="${i}" alt="Gallery ${n+1}">`).join("")}
          </div>
        </div>
      `),e.external_link&&(o+=`
        <div class="mp-field">
          <div class="mp-field-label">External Link</div>
          <div class="mp-field-value">
            <a href="${e.external_link}" target="_blank">${e.external_link}</a>
          </div>
        </div>
      `),e.showreel_link&&(o+=`
        <div class="mp-field">
          <div class="mp-field-label">Showreel</div>
          <div class="mp-field-value">
            <a href="${e.showreel_link}" target="_blank">${e.showreel_link}</a>
          </div>
        </div>
      `),`
      <div class="mp-project-card" data-project-id="${e.id}">
        <div class="mp-project-header">
          <div class="mp-project-header-left mp-toggle-details">
            <span class="mp-toggle-icon">&#9654;</span>
            <h3 class="mp-project-title">${e.name||"Untitled Project"}</h3>
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
    `}function J(e,r,o){const t=e.querySelector(".mp-project-content"),a=e.querySelector(".mp-toggle-details"),s=e.querySelector(".mp-toggle-icon"),d=e.querySelector(".mp-edit-btn"),l=e.querySelector(".mp-delete-btn");a.addEventListener("click",i=>{i.stopPropagation();const n=t.classList.toggle("open");s.classList.toggle("open",n)}),d.addEventListener("click",i=>{i.stopPropagation(),Q(r,o)}),l.addEventListener("click",async()=>{if(confirm("Are you sure you want to delete this project?")){l.disabled=!0,l.textContent="Deleting...";try{await Y(r.id),g=g.filter(i=>i.id!==r.id),w(o)}catch(i){console.error("Error deleting project:",i),alert("Error deleting project. Please try again."),l.disabled=!1,l.textContent="Delete"}}})}function C(e=[]){let r=`
      <div class="mp-category-section">
        <h4>Choose Project Categories</h4>
        <p style="font-size: 12px; color: #666; margin: 0 0 12px 0;">Select a category to see subcategories. You can choose from multiple categories.</p>
        <div class="mp-parent-categories">
    `;return v.directories.forEach(o=>{r+=`<button type="button" class="mp-parent-btn" data-parent="${o.slug}">${o.name}</button>`}),r+="</div>",v.directories.forEach(o=>{const t=V(o.slug);r+=`<div class="mp-child-categories" data-parent="${o.slug}">`,t.forEach(a=>{const s=e.includes(a.id);r+=`<button type="button" class="mp-child-btn ${s?"selected":""}" data-id="${a.id}">${a.name}</button>`}),r+="</div>"}),r+=`
        <div class="mp-selected-categories" style="${e.length?"":"display: none;"}">
          <h5>Selected Categories</h5>
          <div class="mp-selected-list"></div>
        </div>
      </div>
    `,r}function P(e,r,o){const t=e.querySelectorAll(".mp-parent-btn"),a=e.querySelectorAll(".mp-child-categories"),s=e.querySelector(".mp-selected-list"),d=e.querySelector(".mp-selected-categories");function l(){s.innerHTML=r.map(i=>`<span class="mp-selected-tag">${q(i)}<button type="button" data-id="${i}">&times;</button></span>`).join(""),d.style.display=r.length?"":"none",e.querySelectorAll(".mp-child-btn").forEach(i=>{i.classList.toggle("selected",r.includes(i.dataset.id))})}t.forEach(i=>{i.addEventListener("click",()=>{const n=i.dataset.parent,u=i.classList.contains("active");t.forEach(c=>c.classList.remove("active")),a.forEach(c=>c.classList.remove("visible")),u||(i.classList.add("active"),e.querySelector(`.mp-child-categories[data-parent="${n}"]`).classList.add("visible"))})}),e.querySelectorAll(".mp-child-btn").forEach(i=>{i.addEventListener("click",()=>{const n=i.dataset.id,u=r.indexOf(n);u>-1?r.splice(u,1):r.push(n),l()})}),s.addEventListener("click",i=>{if(i.target.tagName==="BUTTON"){const n=i.target.dataset.id,u=r.indexOf(n);u>-1&&(r.splice(u,1),l())}}),l()}function z(e={}){const r=(e.gallery_images||[]).length;return`
      <div class="mp-image-section">
        <div class="mp-feature-upload">
          <h4>Feature Image</h4>
          <div class="mp-feature-upload-area ${e.feature_image_url?"has-image":""}" id="mp-feature-upload">
            ${e.feature_image_url?`<img src="${e.feature_image_url}" alt="Feature">`:""}
            <div class="mp-upload-placeholder"><span>+</span>Click to upload feature image</div>
            <button type="button" class="mp-remove-image">&times;</button>
            <input type="file" accept="image/*" style="display: none;" id="mp-feature-input">
          </div>
        </div>

        <div class="mp-gallery-section">
          <div class="mp-gallery-header">
            <h4>Gallery Images</h4>
            <span class="mp-gallery-count"><span id="mp-gallery-count-num">${r}</span> / ${_}</span>
          </div>
          <div class="mp-gallery-grid" id="mp-gallery-grid">
            ${(e.gallery_images||[]).map((o,t)=>`
              <div class="mp-gallery-item has-image" data-index="${t}" draggable="true">
                <img src="${o}" alt="Gallery ${t+1}">
                <button type="button" class="mp-remove-image">&times;</button>
                <span class="mp-drag-handle">Drag</span>
              </div>
            `).join("")}
            ${r<_?`
              <div class="mp-gallery-item mp-gallery-add" id="mp-gallery-add">
                <div class="mp-upload-placeholder"><span>+</span>Add</div>
                <input type="file" accept="image/*" multiple style="display: none;" id="mp-gallery-input">
              </div>
            `:""}
          </div>
        </div>
      </div>
    `}function A(e,r,o){const t=e.querySelector("#mp-feature-upload"),a=e.querySelector("#mp-feature-input");t.addEventListener("click",s=>{if(s.target.classList.contains("mp-remove-image")){s.stopPropagation(),r.feature_image_url="",t.classList.remove("has-image");const d=t.querySelector("img");d&&d.remove();return}t.classList.contains("has-image")||a.click()}),a.addEventListener("change",async s=>{const d=s.target.files[0];if(d){try{t.style.opacity="0.5";const l=await j(d,r.id);r.feature_image_url=l,t.classList.add("has-image");let i=t.querySelector("img");i||(i=document.createElement("img"),t.insertBefore(i,t.firstChild)),i.src=l,i.alt="Feature",t.style.opacity="1"}catch(l){console.error("Error uploading feature image:",l),alert("Error uploading image. Please try again."),t.style.opacity="1"}a.value=""}}),K(e,r,o)}function K(e,r,o){const t=e.querySelector("#mp-gallery-grid"),a=e.querySelector("#mp-gallery-input"),s=e.querySelector("#mp-gallery-add"),d=e.querySelector("#mp-gallery-count-num");r.gallery_images||(r.gallery_images=[]);function l(){if(t.innerHTML="",r.gallery_images.forEach((c,m)=>{const p=document.createElement("div");p.className="mp-gallery-item has-image",p.dataset.index=m,p.draggable=!0,p.innerHTML=`
          <img src="${c}" alt="Gallery ${m+1}">
          <button type="button" class="mp-remove-image">&times;</button>
          <span class="mp-drag-handle">Drag</span>
        `,t.appendChild(p)}),r.gallery_images.length<_){const c=document.createElement("div");c.className="mp-gallery-item mp-gallery-add",c.id="mp-gallery-add",c.innerHTML=`
          <div class="mp-upload-placeholder"><span>+</span>Add</div>
          <input type="file" accept="image/*" multiple style="display: none;" id="mp-gallery-input">
        `,t.appendChild(c);const m=c.querySelector("#mp-gallery-input");c.addEventListener("click",()=>m.click()),m.addEventListener("change",u)}d.textContent=r.gallery_images.length,i(),n()}function i(){const c=t.querySelectorAll(".mp-gallery-item.has-image");let m=null;c.forEach(p=>{p.addEventListener("dragstart",f=>{m=p,p.classList.add("dragging")}),p.addEventListener("dragend",()=>{p.classList.remove("dragging"),t.querySelectorAll(".mp-gallery-item").forEach(f=>f.classList.remove("drag-over"))}),p.addEventListener("dragover",f=>{f.preventDefault(),p!==m&&p.classList.contains("has-image")&&p.classList.add("drag-over")}),p.addEventListener("dragleave",()=>{p.classList.remove("drag-over")}),p.addEventListener("drop",f=>{if(f.preventDefault(),p.classList.remove("drag-over"),m&&p!==m){const h=parseInt(m.dataset.index),x=parseInt(p.dataset.index),re=r.gallery_images[h];r.gallery_images[h]=r.gallery_images[x],r.gallery_images[x]=re,l()}})})}function n(){t.querySelectorAll(".mp-gallery-item.has-image .mp-remove-image").forEach(c=>{c.addEventListener("click",m=>{m.stopPropagation();const p=c.closest(".mp-gallery-item"),f=parseInt(p.dataset.index);r.gallery_images.splice(f,1),l()})})}async function u(c){const m=Array.from(c.target.files);if(!m.length)return;const p=_-r.gallery_images.length,f=m.slice(0,p);for(const h of f)try{const x=await j(h,r.id);r.gallery_images.push(x),l()}catch(x){console.error("Error uploading gallery image:",x),alert("Error uploading image: "+h.name)}c.target.value=""}s&&s.addEventListener("click",()=>a==null?void 0:a.click()),a&&a.addEventListener("change",u),i(),n()}function X(e,r){const o=r?r.replace(/-/g," ").replace(/\b\w/g,a=>a.toUpperCase()):"your membership",t=document.createElement("div");t.className="mp-modal-overlay",t.innerHTML=`
      <div class="mp-modal" style="max-width: 450px;">
        <div class="mp-modal-header">
          <h3>Project Limit Reached</h3>
        </div>
        <div class="mp-modal-body" style="text-align: center; padding: 30px;">
          <p style="margin-bottom: 16px; font-size: 16px;">
            You've reached the maximum of <strong>${e} projects</strong> for ${o} members.
          </p>
          <p style="margin-bottom: 0; color: #666;">
            To add a new project, please delete an existing one or consider upgrading your membership.
          </p>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn" id="mp-modal-close">Got it</button>
        </div>
      </div>
    `,document.body.appendChild(t),t.querySelector("#mp-modal-close").addEventListener("click",()=>t.remove()),t.addEventListener("click",a=>{a.target===t&&t.remove()})}function I(e){const r=[],o={feature_image_url:"",gallery_images:[]},t=document.createElement("div");t.className="mp-modal-overlay",t.innerHTML=`
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

          ${C(r)}
          ${z(o)}

          <div class="mp-form-field">
            <label>Showreel Link</label>
            <input type="text" class="mp-form-input" id="mp-form-showreel_link" placeholder="https://youtube.com/watch?v=... or https://vimeo.com/...">
            <div class="mp-input-hint">YouTube or Vimeo URL only</div>
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
    `,document.body.appendChild(t),P(t,r),A(t,o,null),$(t);const a=t.querySelector("#mp-form-description"),s=t.querySelector("#mp-word-count"),d=()=>{const i=a.value.trim(),n=i?i.split(/\s+/).filter(u=>u.length>0).length:0;s.textContent=n,s.style.color=n>=50?"#28a745":"#666",t.querySelector("#mp-description-error").style.display="none"};a.addEventListener("input",d),d(),t.addEventListener("click",i=>{i.target===t&&t.remove()}),t.querySelector("#mp-modal-cancel").addEventListener("click",()=>t.remove());const l=t.querySelector("#mp-modal-save");l.addEventListener("click",async()=>{const i=t.querySelector("#mp-form-name").value.trim(),n=t.querySelector("#mp-form-description").value.trim(),u=n?n.split(/\s+/).filter(c=>c.length>0).length:0;if(!i){alert("Project name is required");return}if(u<50){const c=t.querySelector("#mp-description-error");c&&(c.style.display="block"),t.querySelector("#mp-form-description").focus();return}l.disabled=!0,l.textContent="Creating...";try{const c=await B({name:i,description:n,external_link:E(t.querySelector("#mp-form-external_link").value),showreel_link:t.querySelector("#mp-form-showreel_link").value,display_order:parseInt(t.querySelector("#mp-form-display_order").value)||0,categories:[...r],feature_image_url:o.feature_image_url||"",gallery_images:o.gallery_images||[]});g.push(c),g.sort((m,p)=>(m.display_order||0)-(p.display_order||0)),t.remove(),w(e)}catch(c){console.error("Error creating project:",c),alert("Error creating project. Please try again."),l.disabled=!1,l.textContent="Create Project"}}),t.querySelector("#mp-form-name").focus()}function Q(e,r){const o=[...e.categories||[]],t={id:e.id,feature_image_url:e.feature_image_url||"",gallery_images:[...e.gallery_images||[]]},a=document.createElement("div");a.className="mp-modal-overlay",a.innerHTML=`
      <div class="mp-modal">
        <div class="mp-modal-header">
          <h3>Edit Project</h3>
        </div>
        <div class="mp-modal-body">
          <div class="mp-form-field">
            <label>Project Name <span>*</span></label>
            <input type="text" class="mp-form-input" id="mp-form-name" value="${e.name||""}" required>
          </div>
          <div class="mp-form-field">
            <label>Project Description <span>*</span></label>
            <textarea class="mp-form-input" id="mp-form-description">${e.description||""}</textarea>
            <div class="mp-input-hint">Minimum 50 words required (<span id="mp-word-count">0</span> words)</div>
            <div class="mp-input-error" id="mp-description-error">Please enter at least 50 words</div>
          </div>

          ${C(o)}
          ${z(t)}

          <div class="mp-form-field">
            <label>Showreel Link</label>
            <input type="text" class="mp-form-input" id="mp-form-showreel_link" value="${e.showreel_link||""}" placeholder="https://youtube.com/watch?v=... or https://vimeo.com/...">
            <div class="mp-input-hint">YouTube or Vimeo URL only</div>
          </div>
          <div class="mp-form-field">
            <label>Project External Link</label>
            <input type="text" class="mp-form-input" id="mp-form-external_link" value="${e.external_link||""}" placeholder="https://example.com">
            <div class="mp-input-hint">Enter a complete URL including https://</div>
            <div class="mp-input-error" id="mp-url-error">Please enter a valid URL (e.g., https://example.com)</div>
          </div>
          <div class="mp-form-field">
            <label>Display Order</label>
            <input type="number" class="mp-form-input" id="mp-form-display_order" value="${e.display_order||0}">
          </div>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn mp-btn-secondary" id="mp-modal-cancel">Cancel</button>
          <button class="mp-btn" id="mp-modal-save">Save Changes</button>
        </div>
      </div>
    `,document.body.appendChild(a),P(a,o),A(a,t,null),$(a);const s=a.querySelector("#mp-form-description"),d=a.querySelector("#mp-word-count"),l=()=>{const n=s.value.trim(),u=n?n.split(/\s+/).filter(c=>c.length>0).length:0;d.textContent=u,d.style.color=u>=50?"#28a745":"#666",a.querySelector("#mp-description-error").style.display="none"};s.addEventListener("input",l),l(),a.addEventListener("click",n=>{n.target===a&&a.remove()}),a.querySelector("#mp-modal-cancel").addEventListener("click",()=>a.remove());const i=a.querySelector("#mp-modal-save");i.addEventListener("click",async()=>{const n=a.querySelector("#mp-form-name").value.trim(),u=a.querySelector("#mp-form-description").value.trim(),c=u?u.split(/\s+/).filter(m=>m.length>0).length:0;if(!n){alert("Project name is required");return}if(c<50){const m=a.querySelector("#mp-description-error");m&&(m.style.display="block"),a.querySelector("#mp-form-description").focus();return}i.disabled=!0,i.textContent="Saving...";try{const m=await O(e.id,{name:n,description:u,external_link:E(a.querySelector("#mp-form-external_link").value),showreel_link:a.querySelector("#mp-form-showreel_link").value,display_order:parseInt(a.querySelector("#mp-form-display_order").value)||0,categories:[...o],feature_image_url:t.feature_image_url||"",gallery_images:t.gallery_images||[]}),p=g.findIndex(f=>f.id===e.id);p>-1&&(g[p]=m),g.sort((f,h)=>(f.display_order||0)-(h.display_order||0)),a.remove(),w(r)}catch(m){console.error("Error updating project:",m),alert("Error updating project. Please try again."),i.disabled=!1,i.textContent="Save Changes"}})}function Z(){return new Promise(e=>{if(window.$memberstackDom)e();else{const r=setInterval(()=>{window.$memberstackDom&&(clearInterval(r),e())},100)}})}function ee(){return new Promise((e,r)=>{if(window.supabase){e();return}let o=0;const t=50,a=setInterval(()=>{o++,window.supabase?(clearInterval(a),e()):o>=t&&(clearInterval(a),r(new Error("Supabase library not loaded")))},100)})}async function U(){const e=document.querySelector(".supabase-project-container");if(!e){console.warn("Could not find .supabase-project-container");return}const r=document.createElement("style");r.textContent=R,document.head.appendChild(r);const o=document.createElement("div");o.className="mp-container",o.innerHTML='<div class="mp-loading">Loading projects...</div>',e.appendChild(o);try{if(await ee(),await Z(),!D()){o.innerHTML='<div class="mp-loading">Error: Could not initialize Supabase</div>';return}const{data:t}=await window.$memberstackDom.getCurrentMember();if(!t){o.innerHTML='<div class="mp-loading">Please log in to view your projects.</div>';return}b=t,console.log("Current member:",b.id),v=await H(),console.log(`Categories loaded: ${v.directories.length} directories, ${v.subDirectories.length} sub-directories`),g=await G(t.id),w(o)}catch(t){console.error("Error initializing member projects:",t),o.innerHTML='<div class="mp-loading">Error loading projects. Please refresh the page.</div>'}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",U):U()})();
