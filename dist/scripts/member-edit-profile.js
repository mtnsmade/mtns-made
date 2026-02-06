(function(){console.log("Member edit profile script loaded");const T=["small-business","large-business","not-for-profit","spaces-suppliers"],N="spaces-suppliers",q="https://hooks.zapier.com/hooks/catch/20216239/ulr09fx/",H="4ab46fc683f9c002ae8b";let v=!1;const k=[{id:"64ad5d2856cac56795029d2a",name:"Visual Arts",slug:"visual-arts"},{id:"64ad5d2dde2ea6eeaeb94003",name:"Design",slug:"design"},{id:"64ad5d37ab90d652594a17a8",name:"Photography",slug:"photography"},{id:"64ad5d31bf826ce4810f9b7a",name:"Craft",slug:"craft"},{id:"64ad5d3fde2ea6eeaeb95c9e",name:"Performing Arts",slug:"performing-arts"},{id:"64ad5d25b6907c1bed526490",name:"Screen",slug:"screen"},{id:"64ad5d519e2a54f5aab831aa",name:"Publishing",slug:"publishing"},{id:"64ad5d4b9a1e0e4717405adb",name:"Creative Education",slug:"creative-education"},{id:"64bfaf6a75299ea8759488fc",name:"Cultural Work",slug:"cultural-work"},{id:"64ad5d5fff882df891ead372",name:"Artisanal Products",slug:"artisanal-products"}],S=[{id:"64c324a2892f531f780ed838",name:"Installation Art",parent:"visual-arts"},{id:"64c337e9723e82f68fdcdbb8",name:"Interactive Art",parent:"visual-arts"},{id:"64c324a2761d2d11e129c478",name:"Land Art",parent:"visual-arts"},{id:"64c31e58892f531f780882ca",name:"Painting",parent:"visual-arts"},{id:"64c324a18561c58fd41ae093",name:"Photomedia",parent:"visual-arts"},{id:"64c324a14e1c7df81c3a7ac8",name:"Printmedia",parent:"visual-arts"},{id:"64c324a24e1c7df81c3a7b5e",name:"Public Art",parent:"visual-arts"},{id:"64c324a1761d2d11e129c3f4",name:"Sculpture",parent:"visual-arts"},{id:"64c324a2eb00d38a83f49380",name:"Sound Art",parent:"visual-arts"},{id:"64c337b9723e82f68fdcb311",name:"Street Art",parent:"visual-arts"},{id:"64c324a21e2d449f6822b228",name:"Textile Art",parent:"visual-arts"},{id:"64c324a2c8b5a5a8b31f4837",name:"Video Art",parent:"visual-arts"},{id:"64c322813b98e1ea07e8db25",name:"Architecture",parent:"design"},{id:"64c32281ea11fadfc16688ac",name:"Fabric Design",parent:"design"},{id:"64c32281686438dbe444b876",name:"Fashion Design",parent:"design"},{id:"64c322813b98e1ea07e8dae6",name:"Furniture Design",parent:"design"},{id:"64c3228298f9b238322506fa",name:"Game Design",parent:"design"},{id:"64c31e418e3559214f884254",name:"Graphic Design",parent:"design"},{id:"64c32281906b099337c72e36",name:"Illustration",parent:"design"},{id:"64c32281906b099337c72ed7",name:"Industrial Design",parent:"design"},{id:"64c32282efe376c79c3cf4dd",name:"Interior Design",parent:"design"},{id:"64c32281e743d0c2d6501b23",name:"Landscape Design",parent:"design"},{id:"64c32282ee36f5991d7b1ccd",name:"Lighting Design",parent:"design"},{id:"64c322821f3ad42037ca043d",name:"Murals",parent:"design"},{id:"64c322821e2d449f68203f5b",name:"Signwriting",parent:"design"},{id:"64c32282686438dbe444b955",name:"Sound Design",parent:"design"},{id:"64c322818e3559214f8ca311",name:"Website Design",parent:"design"},{id:"64c324a3e743d0c2d6522f5a",name:"Aerial Photography",parent:"photography"},{id:"64c324a489c8fd4d0e7f1320",name:"Animal Photography",parent:"photography"},{id:"64c324a3c8b5a5a8b31f48f1",name:"Event Photography",parent:"photography"},{id:"64c324a3ea11fadfc1692102",name:"Fashion Photography",parent:"photography"},{id:"64c324a38561c58fd41ae133",name:"Food Photography",parent:"photography"},{id:"64c324a28e3559214f8ef399",name:"Interior Photography",parent:"photography"},{id:"64c324a3eb00d38a83f494a1",name:"Landscape Photography",parent:"photography"},{id:"64c31e65906b099337c338cd",name:"Portraiture",parent:"photography"},{id:"64c324a3e743d0c2d6522ee7",name:"Product Photography",parent:"photography"},{id:"64c324a32af64bdc37a878ed",name:"Sports Photography",parent:"photography"},{id:"64c324a3ee36f5991d7d4b0d",name:"Travel Photography",parent:"photography"},{id:"64c324a216bbd436777da9b0",name:"Wedding Photography",parent:"photography"},{id:"64c31e4a1f3ad42037c53e42",name:"Ceramics",parent:"craft"},{id:"64c324a1ea11fadfc1691bac",name:"Floristry",parent:"craft"},{id:"64c340b8723e82f68fe423ef",name:"Glass",parent:"craft"},{id:"64c324a116bbd436777da24a",name:"Jewellery",parent:"craft"},{id:"64c324a013204b77e3230c47",name:"Leather",parent:"craft"},{id:"64c324a1ea11fadfc1691bfa",name:"Metal",parent:"craft"},{id:"64c324a198f9b238322737d3",name:"Millenary",parent:"craft"},{id:"64c324a113204b77e3230c68",name:"Paper",parent:"craft"},{id:"64c324a1ea11fadfc1691bf3",name:"Textiles",parent:"craft"},{id:"64c324a08e3559214f8ef2ce",name:"Wood",parent:"craft"},{id:"64c324a41e2d449f6822b34d",name:"Circus",parent:"performing-arts"},{id:"64c31e6f998d40df52d0c0d2",name:"Dance",parent:"performing-arts"},{id:"64c33dbaa9c56afb61758f2b",name:"Dramaturgy",parent:"performing-arts"},{id:"64c324a589c8fd4d0e7f13f5",name:"Live Arts Production",parent:"performing-arts"},{id:"64c324a4686438dbe448d594",name:"Modelling",parent:"performing-arts"},{id:"64c324a4761d2d11e129c57a",name:"Music",parent:"performing-arts"},{id:"64c324a4e743d0c2d6522fa1",name:"Performance Art",parent:"performing-arts"},{id:"64c342694a697ccad200d2d8",name:"Playwriting",parent:"performing-arts"},{id:"64c324a413204b77e3231064",name:"Projection",parent:"performing-arts"},{id:"64c324a4ea11fadfc16926de",name:"Set Design",parent:"performing-arts"},{id:"64c324a416bbd436777db291",name:"Stage Acting",parent:"performing-arts"},{id:"64c33d6ad8c53bbeff0ad758",name:"Stage Direction",parent:"performing-arts"},{id:"64c324a413204b77e323105b",name:"Stage Lighting",parent:"performing-arts"},{id:"64c32280ee36f5991d7b1952",name:"Animation",parent:"screen"},{id:"64c3228098f9b23832250411",name:"Art Department",parent:"screen"},{id:"64c33e675e7e936176992daa",name:"Camera Operator",parent:"screen"},{id:"64c31da3ee36f5991d75f179",name:"Cinematography",parent:"screen"},{id:"64c33ecb3c3e613167c5af80",name:"Costume Design",parent:"screen"},{id:"64c32280906b099337c72dd6",name:"Drone",parent:"screen"},{id:"64c322808561c58fd418867c",name:"Location Scouting",parent:"screen"},{id:"64c32280ee36f5991d7b1928",name:"Post Production",parent:"screen"},{id:"64c3227f1f3ad42037ca0282",name:"Screen Acting",parent:"screen"},{id:"64c3227fea11fadfc1668683",name:"Screen Direction",parent:"screen"},{id:"64c31dcf8561c58fd4138bfd",name:"Screen Editing",parent:"screen"},{id:"64c322808e3559214f8c9fee",name:"Screen Production",parent:"screen"},{id:"64c3228016bbd436777b7429",name:"Screen Services",parent:"screen"},{id:"64c3227fe743d0c2d65012d2",name:"Screen Writing",parent:"screen"},{id:"64c322808561c58fd41885e9",name:"Soundtrack",parent:"screen"},{id:"64c3228089c8fd4d0e7cb947",name:"Videography",parent:"screen"},{id:"64c324a6686438dbe448d885",name:"Copywriting",parent:"publishing"},{id:"64c31e97906b099337c36aa8",name:"Creative Writing",parent:"publishing"},{id:"64c324a7892f531f780edd4e",name:"Journalism",parent:"publishing"},{id:"64c324a7e743d0c2d6523397",name:"Podcasting",parent:"publishing"},{id:"64c324a698f9b23832273cc9",name:"Poetry",parent:"publishing"},{id:"64c324a61f3ad42037ccb81a",name:"Proofreading",parent:"publishing"},{id:"64c324a6e743d0c2d6523345",name:"Technical Writing",parent:"publishing"},{id:"64c324a7efe376c79c3f7f4f",name:"Text Editing",parent:"publishing"},{id:"64c31e8ceb00d38a83edc555",name:"Dance Education",parent:"creative-education"},{id:"64c324a6c8b5a5a8b31f4e60",name:"Drama Education",parent:"creative-education"},{id:"64c324a613204b77e3231205",name:"Higher Degree Supervision",parent:"creative-education"},{id:"64c324a698f9b23832273cac",name:"Illustration Education",parent:"creative-education"},{id:"64c324a58e3559214f8ef632",name:"Music Education",parent:"creative-education"},{id:"64c324a6bbf8ad730a694fbb",name:"Photography Education",parent:"creative-education"},{id:"64c324a6ee36f5991d7d4d50",name:"Visual Arts Education",parent:"creative-education"},{id:"64c324a6efe376c79c3f7d46",name:"Writing Education",parent:"creative-education"},{id:"64c324a516bbd436777db338",name:"Academic Research",parent:"cultural-work"},{id:"64c324a5ea11fadfc1692763",name:"Art Therapy",parent:"cultural-work"},{id:"64c324a5bbf8ad730a694e60",name:"Arts Management",parent:"cultural-work"},{id:"64c324a5998d40df52d73c72",name:"Arts Promotion",parent:"cultural-work"},{id:"64c324a5efe376c79c3f7c60",name:"Curation",parent:"cultural-work"},{id:"64c324a5686438dbe448d693",name:"Event Production",parent:"cultural-work"},{id:"64c3227ed94a307c093ebd3f",name:"First Nations Custodianship",parent:"cultural-work"},{id:"64c324a5998d40df52d73caa",name:"Grant Writing",parent:"cultural-work"},{id:"64c324a598f9b23832273c36",name:"Social Media",parent:"cultural-work"},{id:"64c324a5761d2d11e129c625",name:"Socially Engaged Practice",parent:"cultural-work"},{id:"64c324a7eb00d38a83f4992a",name:"Beverages",parent:"artisanal-products"},{id:"64c31ea2ea11fadfc162c4fc",name:"Food",parent:"artisanal-products"},{id:"64c324a7892f531f780edd7c",name:"Homewares",parent:"artisanal-products"},{id:"64c324a78561c58fd41ae32b",name:"Skincare",parent:"artisanal-products"},{id:"64c324a7ee36f5991d7d4e61",name:"Toys",parent:"artisanal-products"}],z=[{id:"64f1da35f675358d75b91b1d",name:"Writing Residency"},{id:"64f1da2d7d6477504d516cbe",name:"Workshop Venue"},{id:"64f1da274eb35585095da19d",name:"Theatre"},{id:"64f1da2002940058e3edd5fe",name:"Retail Space"},{id:"64f1da189d95e948bba862e6",name:"Rehearsal Space"},{id:"64f1da1112dd56d3752546e5",name:"Recording Studio"},{id:"64f1da09e36d896066188137",name:"Photographic Studio"},{id:"64f1da02dbd420ebdcbbdbe0",name:"Music Venue"},{id:"64f1d9fb72f97d02aed69114",name:"Gallery"},{id:"64f1d9f3ba4f53a0a58913a0",name:"Darkroom"},{id:"64f1d9ed2cf058e9ad97a1aa",name:"Dance Studio"},{id:"64f1d9e487b976f53293536b",name:"Co-Working Space"},{id:"64f1d9d841906b7dee94da37",name:"Cinema"},{id:"64ededcde4500853d75fe7e0",name:"Artist Run Initiative"},{id:"64ededc756e09fc697df87bd",name:"Art Studio"},{id:"64ededbe04bc1f5d88f1cb04",name:"Art Residency"}],F=[{id:"64dc99567a4ece99563eb6e7",name:"Hardware Supplies"},{id:"64dc992bfff2b7132e358226",name:"Engineering"},{id:"64dc991159bcce300f33a9b4",name:"IT Services"},{id:"64dc98f99d53cdd25ecb4092",name:"Plant Nursery"},{id:"64dc98df260c6f155a45fce4",name:"CAD Modelling"},{id:"64dc98c3fff2b7132e34e127",name:"Framing"},{id:"64dc98b2fff2b7132e34c878",name:"Drafting"},{id:"64dc98968e1db3580f5eb587",name:"Search Engine Optimisation"},{id:"64dc9877b39b4a82e4b00172",name:"Music Supplies"},{id:"64dc9852c843c0e96d30c7d5",name:"Sewing Supplies"},{id:"64dc981259bcce300f3319b5",name:"Art & Craft Supplies"},{id:"64dc97f42e4ce3b17fd788ba",name:"CNC Cutting"},{id:"64dc97d8b39b4a82e4af7561",name:"Laser Cutting"},{id:"64dc97bca8135e1414e5e8bc",name:"Metal Fabrication"},{id:"64dc97a2a8135e1414e5d040",name:"3D Printing"},{id:"64dc9788f9556b85f083d5e8",name:"Digital Printing"},{id:"64dc976ebf5b1edb1f42010c",name:"Offset Printing"},{id:"64dc974e2e4ce3b17fd6b9b4",name:"Letterpress"}],h=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],M=`
    .ep-container {
      font-family: inherit;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
    }
    .ep-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .ep-header h2 {
      margin: 0 0 8px 0;
      font-size: 28px;
      color: #333;
    }
    .ep-header p {
      margin: 0;
      color: #666;
      font-size: 16px;
      line-height: 1.5;
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
    .ep-category-section {
      margin-bottom: 24px;
    }
    .ep-category-header {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
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
    .ep-char-count.over-limit {
      color: #dc3545;
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
  `;let f=null,e={firstName:"",lastName:"",email:"",profileImageUrl:"",featureImageUrl:"",bio:"",businessName:"",businessAddress:"",displayAddress:!1,openingHours:{monday:"",tuesday:"",wednesday:"",thursday:"",friday:"",saturday:"",sunday:""},displayOpeningHours:!1,spaceOrSupplier:null,chosenDirectories:[],spaceCategories:[],supplierCategories:[],website:"",instagram:"",facebook:"",linkedin:"",tiktok:"",youtube:""};function R(){return new Promise((a,r)=>{let t=0;const i=50,s=setInterval(()=>{t++,window.$memberstackDom?(clearInterval(s),a()):t>=i&&(clearInterval(s),r(new Error("Memberstack not loaded")))},100)})}function w(a){return T.includes(a)}function C(a){return a===N}const L={instagram:{baseUrl:"https://www.instagram.com/",patterns:[/instagram\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},facebook:{baseUrl:"https://www.facebook.com/",patterns:[/facebook\.com\/([^\/\?]+)/i,/^([a-zA-Z0-9.]+)$/]},linkedin:{baseUrl:"https://www.linkedin.com/in/",patterns:[/linkedin\.com\/(in|company)\/([^\/\?]+)/i,/^([a-zA-Z0-9-]+)$/]},tiktok:{baseUrl:"https://www.tiktok.com/@",patterns:[/tiktok\.com\/@?([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},youtube:{baseUrl:"https://www.youtube.com/",patterns:[/youtube\.com\/(channel|c|user|@)\/([^\/\?]+)/i,/youtube\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9_-]+)$/]}};function E(a,r=null){if(!a||!a.trim())return{valid:!0,url:""};if(a=a.trim(),a.includes(" "))return{valid:!1,error:"Please enter only one URL (no spaces)"};if((a.match(/https?:\/\//gi)||[]).length>1)return{valid:!1,error:"Please enter only one URL"};if(/^https?:\/\//i.test(a))try{return new URL(a),{valid:!0,url:a}}catch{return{valid:!1,error:"Invalid URL format"}}if(r==="website")return/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/.test(a)?{valid:!0,url:"https://"+a}:{valid:!1,error:"Please enter a full website URL (e.g., https://example.com)"};if(r&&L[r]){const i=L[r];if(a.toLowerCase().includes(r.toLowerCase()+".com"))return{valid:!0,url:"https://"+a.replace(/^(https?:\/\/)?/i,"")};for(const s of i.patterns){const n=a.match(s);if(n){const o=n[n.length-1];return o.toLowerCase()===r.toLowerCase()?{valid:!1,error:`Please enter your ${r} profile URL or username`}:{valid:!0,url:i.baseUrl+o.replace(/^@/,"")}}}return{valid:!1,error:`Please enter a valid ${r} URL or username`}}return{valid:!1,error:"Invalid URL"}}function B(){const a=[];return["website","instagram","facebook","linkedin","tiktok","youtube"].forEach(t=>{const i=e[t];if(i&&i.trim()){const s=E(i,t);s.valid?e[t]=s.url:a.push({platform:t,error:s.error})}}),a}function P(){return new Promise(a=>{if(v||window.uploadcare){v=!0,a();return}const r=document.createElement("script");r.src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js",r.onload=()=>{v=!0,a()},document.head.appendChild(r)})}function $(a={}){return new Promise((r,t)=>{if(!window.uploadcare){t(new Error("Uploadcare not loaded"));return}uploadcare.openDialog(null,{publicKey:H,imagesOnly:!0,crop:a.crop||"free",tabs:"file camera",...a}).done(s=>{s.promise().done(n=>{r(n.cdnUrl)}).fail(n=>{t(n)})})})}function x(a){if(!a||typeof a!="string")return[];try{const t=JSON.parse(a);if(Array.isArray(t))return t}catch{}const r=a.match(/"([^"]+)"/g);return r?r.map(t=>t.replace(/"/g,"")):a.split(",").map(t=>t.trim().replace(/"/g,"")).filter(Boolean)}async function W(){var t;const{data:a}=await window.$memberstackDom.getCurrentMember();if(!a)return null;f=a;const r=a.customFields||{};return e.firstName=r["first-name"]||"",e.lastName=r["last-name"]||"",e.email=((t=a.auth)==null?void 0:t.email)||"",e.profileImageUrl=r["profile-pic-url"]||r["profile-image"]||"",e.featureImageUrl=r["feature-image"]||"",e.bio=r["public-bio"]||r.bio||"",e.businessName=r["trading-name"]||r["business-name"]||"",e.businessAddress=r["street-address"]||r["business-address"]||"",e.displayAddress=r["display-address"]==="true",e.displayOpeningHours=r["display-opening-hours"]==="true",h.forEach(i=>{const s=i.toLowerCase();e.openingHours[s]=r[`open-${s}`]||r[`opening-${s}`]||""}),r.space==="true"||r["is-creative-space"]==="true"?e.spaceOrSupplier="space":(r.supplier==="true"||r["is-supplier"]==="true")&&(e.spaceOrSupplier="supplier"),e.chosenDirectories=x(r.categories||r["chosen-directories"]),e.spaceCategories=x(r["space-category"]||r["space-categories"]),e.supplierCategories=x(r["supplier-categories"]),e.website=r.website||"",e.instagram=r.instagram||"",e.facebook=r.facebook||"",e.linkedin=r.linkedin||"",e.tiktok=r.tiktok||"",e.youtube=r.youtube||"",JSON.parse(JSON.stringify(e)),a}function _(a){var s;const r=(s=f==null?void 0:f.customFields)==null?void 0:s["membership-type"],t=w(r),i=C(r);a.innerHTML=`
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" id="ep-error-banner" style="display: none;"></div>
          <div class="ep-success-banner" id="ep-success-banner" style="display: none;"></div>

          ${j()}
          ${t?J():""}
          ${V(i)}
          ${K()}

          <div class="ep-btn-row">
            <a href="/profile/start" class="ep-btn ep-btn-secondary" style="text-decoration: none; text-align: center;">Cancel</a>
            <button type="button" class="ep-btn" id="ep-save-btn">Save Changes</button>
          </div>
        </div>
      </div>
    `,X(a,t,i)}function j(){return`
      <div class="ep-section">
        <h3 class="ep-section-title">About You</h3>
        <p class="ep-section-description">Basic information about you and your creative practice.</p>

        <div class="ep-image-row">
          <div class="ep-form-field">
            <label>Profile Image <span class="required">*</span></label>
            <div class="ep-image-upload" id="profile-upload">
              ${e.profileImageUrl?`<img src="${e.profileImageUrl}" class="ep-image-preview profile" alt="Profile preview">
                   <button type="button" class="ep-image-remove" data-remove="profile">&times;</button>`:`<div class="ep-image-upload-text">
                    <strong>Click to upload</strong><br>
                    Square image recommended
                  </div>`}
            </div>
            <div class="ep-hint">This will be your profile photo</div>
          </div>

          <div class="ep-form-field">
            <label>Feature Image <span class="required">*</span></label>
            <div class="ep-image-upload" id="feature-upload">
              ${e.featureImageUrl?`<img src="${e.featureImageUrl}" class="ep-image-preview" alt="Feature preview">
                   <button type="button" class="ep-image-remove" data-remove="feature">&times;</button>`:`<div class="ep-image-upload-text">
                    <strong>Click to upload</strong><br>
                    Landscape image recommended
                  </div>`}
            </div>
            <div class="ep-hint">This appears as the header on your profile page</div>
          </div>
        </div>

        <div class="ep-form-field">
          <label>First Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-first-name" value="${m(e.firstName)}" placeholder="Enter your first name">
        </div>

        <div class="ep-form-field">
          <label>Last Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-last-name" value="${m(e.lastName)}" placeholder="Enter your last name">
        </div>

        <div class="ep-form-field">
          <label>Email Address</label>
          <input type="email" class="ep-form-input" id="ep-email" value="${m(e.email)}" readonly>
          <div class="ep-hint">Email cannot be changed here. Contact support if you need to update it.</div>
        </div>

        <div class="ep-form-field">
          <label>Public Bio <span class="required">*</span></label>
          <textarea class="ep-form-input" id="ep-bio" maxlength="2000" placeholder="Tell us about your creative practice, skills, and what you offer...">${m(e.bio)}</textarea>
          <div class="ep-char-count"><span id="ep-bio-count">${e.bio.length}</span> / 2000 characters</div>
        </div>
      </div>
    `}function J(){return`
      <div class="ep-section">
        <h3 class="ep-section-title">Business Details</h3>
        <p class="ep-section-description">Information about your business or organization.</p>

        <div class="ep-form-field">
          <label>Business / Trading Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-business-name" value="${m(e.businessName)}" placeholder="Enter your business or trading name">
        </div>

        <div class="ep-form-field">
          <label>Business Address</label>
          <input type="text" class="ep-form-input" id="ep-address" value="${m(e.businessAddress)}" placeholder="Enter your business address">
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
            ${h.map(a=>`
              <div class="ep-hours-row">
                <span class="ep-hours-day">${a}</span>
                <input type="text" class="ep-hours-input" id="ep-hours-${a.toLowerCase()}"
                  value="${m(e.openingHours[a.toLowerCase()])}"
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
    `}function V(a){return`
      <div class="ep-section">
        <h3 class="ep-section-title">Categories</h3>
        <p class="ep-section-description">Select the categories that best describe your work. This helps people find you in the directory.</p>

        <div id="categories-container">
          ${a?Y():G()}
        </div>
      </div>
    `}function Y(){return`
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
        ${e.spaceOrSupplier==="space"?A():""}
        ${e.spaceOrSupplier==="supplier"?I():""}
      </div>
    `}function A(){let a='<div class="ep-category-section"><div class="ep-category-header">Select Space Categories</div><div class="ep-category-grid">';return z.forEach(r=>{const t=e.spaceCategories.includes(r.id);a+=`
        <label class="ep-category-item ${t?"selected":""}" data-id="${r.id}">
          <input type="checkbox" value="${r.id}" ${t?"checked":""}>
          ${r.name}
        </label>
      `}),a+='</div><div class="ep-selected-count"><span id="space-count">'+e.spaceCategories.length+"</span> selected</div></div>",a}function I(){let a='<div class="ep-category-section"><div class="ep-category-header">Select Supplier Categories</div><div class="ep-category-grid">';return F.forEach(r=>{const t=e.supplierCategories.includes(r.id);a+=`
        <label class="ep-category-item ${t?"selected":""}" data-id="${r.id}">
          <input type="checkbox" value="${r.id}" ${t?"checked":""}>
          ${r.name}
        </label>
      `}),a+='</div><div class="ep-selected-count"><span id="supplier-count">'+e.supplierCategories.length+"</span> selected</div></div>",a}function Z(a){const r=S.find(t=>t.id===a);return r?r.name:a}function G(){let a='<div class="ep-category-selector">';return a+='<div class="ep-parent-categories">',k.forEach(r=>{a+=`<button type="button" class="ep-parent-btn" data-parent="${r.slug}">${r.name}</button>`}),a+="</div>",k.forEach(r=>{const t=S.filter(i=>i.parent===r.slug);a+=`<div class="ep-child-categories" data-parent="${r.slug}">`,t.forEach(i=>{const s=e.chosenDirectories.includes(i.id);a+=`<button type="button" class="ep-child-btn ${s?"selected":""}" data-id="${i.id}">${i.name}</button>`}),a+="</div>"}),a+=`
      <div class="ep-selected-categories" id="ep-selected-section" style="${e.chosenDirectories.length?"":"display: none;"}">
        <h5>Selected Categories</h5>
        <div class="ep-selected-list" id="ep-selected-list"></div>
      </div>
    </div>`,a}function K(){return`
      <div class="ep-section">
        <h3 class="ep-section-title">External Links</h3>
        <p class="ep-section-description">Add your website and social media links. All fields are optional.</p>

        <div class="ep-links-grid">
          <div class="ep-link-field">
            <span class="ep-link-label">Website</span>
            <input type="url" class="ep-form-input" id="ep-website" value="${m(e.website)}" placeholder="https://yourwebsite.com">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">Instagram</span>
            <input type="url" class="ep-form-input" id="ep-instagram" value="${m(e.instagram)}" placeholder="https://instagram.com/username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">Facebook</span>
            <input type="url" class="ep-form-input" id="ep-facebook" value="${m(e.facebook)}" placeholder="https://facebook.com/page">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">LinkedIn</span>
            <input type="url" class="ep-form-input" id="ep-linkedin" value="${m(e.linkedin)}" placeholder="https://linkedin.com/in/username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">TikTok</span>
            <input type="url" class="ep-form-input" id="ep-tiktok" value="${m(e.tiktok)}" placeholder="https://tiktok.com/@username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">YouTube</span>
            <input type="url" class="ep-form-input" id="ep-youtube" value="${m(e.youtube)}" placeholder="https://youtube.com/channel">
          </div>
        </div>
      </div>
    `}function m(a){if(!a)return"";const r=document.createElement("div");return r.textContent=a,r.innerHTML}function X(a,r,t){const i=a.querySelector("#ep-error-banner"),s=a.querySelector("#ep-success-banner"),n=a.querySelector("#ep-save-btn");Q(a),r&&ee(a),ae(a,t),ie(a),n.addEventListener("click",async()=>{if(i.style.display="none",s.style.display="none",!e.firstName.trim()){g(i,"Please enter your first name");return}if(!e.lastName.trim()){g(i,"Please enter your last name");return}if(!e.profileImageUrl){g(i,"Please upload a profile image");return}if(!e.featureImageUrl){g(i,"Please upload a feature image");return}if(!e.bio.trim()){g(i,"Please enter a bio");return}if(e.bio.trim().length<50){g(i,"Please enter at least 50 characters for your bio");return}if(r&&!e.businessName.trim()){g(i,"Please enter your business name");return}if(t){if(!e.spaceOrSupplier){g(i,"Please select whether you are a Creative Space or Supplier");return}if((e.spaceOrSupplier==="space"?e.spaceCategories.length:e.supplierCategories.length)===0){g(i,"Please select at least one category");return}}else if(e.chosenDirectories.length===0){g(i,"Please select at least one category");return}const o=B();if(o.length>0){o.forEach(({platform:d,error:l})=>{const u=a.querySelector(`#ep-${d}`),c=u.closest(".ep-link-field");let b=c.querySelector(".ep-field-error");b||(b=document.createElement("div"),b.className="ep-field-error",c.appendChild(b)),u.classList.add("error"),b.textContent=l}),g(i,"Please fix the highlighted fields before saving");return}n.disabled=!0,n.textContent="Saving...";try{await te(),s.textContent="Profile updated successfully!",s.style.display="block",s.scrollIntoView({behavior:"smooth",block:"center"}),n.textContent="Save Changes",n.disabled=!1}catch(d){console.error("Save error:",d),g(i,"An error occurred while saving. Please try again."),n.textContent="Save Changes",n.disabled=!1}})}function Q(a){const r=a.querySelector("#ep-first-name");r.addEventListener("input",()=>{e.firstName=r.value});const t=a.querySelector("#ep-last-name");t.addEventListener("input",()=>{e.lastName=t.value});const i=a.querySelector("#ep-bio"),s=a.querySelector("#ep-bio-count");i.addEventListener("input",()=>{e.bio=i.value,s.textContent=i.value.length});const n=a.querySelector("#profile-upload");function o(){e.profileImageUrl?(n.innerHTML=`
          <img src="${e.profileImageUrl}" class="ep-image-preview profile" alt="Profile preview">
          <button type="button" class="ep-image-remove" data-remove="profile">&times;</button>
        `,n.classList.add("has-image")):(n.innerHTML=`
          <div class="ep-image-upload-text">
            <strong>Click to upload</strong><br>
            Square image recommended
          </div>
        `,n.classList.remove("has-image"))}n.addEventListener("click",async u=>{if(u.target.dataset.remove==="profile"){u.stopPropagation(),e.profileImageUrl="",o();return}if(!e.profileImageUrl)try{await P();const c=await $({crop:"1:1"});e.profileImageUrl=c,o()}catch(c){c&&c!=="cancel"&&c.message!=="cancelled"&&console.error("Profile upload error:",c)}});const d=a.querySelector("#feature-upload");function l(){e.featureImageUrl?(d.innerHTML=`
          <img src="${e.featureImageUrl}" class="ep-image-preview" alt="Feature preview">
          <button type="button" class="ep-image-remove" data-remove="feature">&times;</button>
        `,d.classList.add("has-image")):(d.innerHTML=`
          <div class="ep-image-upload-text">
            <strong>Click to upload</strong><br>
            Landscape image recommended
          </div>
        `,d.classList.remove("has-image"))}d.addEventListener("click",async u=>{if(u.target.dataset.remove==="feature"){u.stopPropagation(),e.featureImageUrl="",l();return}if(!e.featureImageUrl)try{await P();const c=await $({crop:"16:9"});e.featureImageUrl=c,l()}catch(c){c&&c!=="cancel"&&c.message!=="cancelled"&&console.error("Feature upload error:",c)}})}function ee(a){const r=a.querySelector("#ep-business-name");r&&r.addEventListener("input",()=>{e.businessName=r.value});const t=a.querySelector("#ep-address");t&&t.addEventListener("input",()=>{e.businessAddress=t.value});const i=a.querySelector("#ep-display-address");i&&i.addEventListener("change",()=>{e.displayAddress=i.checked});const s=a.querySelector("#ep-display-hours");s&&s.addEventListener("change",()=>{e.displayOpeningHours=s.checked}),h.forEach(n=>{const o=a.querySelector(`#ep-hours-${n.toLowerCase()}`);o&&o.addEventListener("input",()=>{e.openingHours[n.toLowerCase()]=o.value})})}function ae(a,r){if(r){const t=a.querySelector("#radio-space"),i=a.querySelector("#radio-supplier"),s=a.querySelector("#space-supplier-categories");t&&t.addEventListener("click",()=>{e.spaceOrSupplier="space",e.supplierCategories=[],t.classList.add("selected"),i.classList.remove("selected"),s.innerHTML=A(),s.style.display="block",y(a,"spaceCategories","space-count")}),i&&i.addEventListener("click",()=>{e.spaceOrSupplier="supplier",e.spaceCategories=[],i.classList.add("selected"),t.classList.remove("selected"),s.innerHTML=I(),s.style.display="block",y(a,"supplierCategories","supplier-count")}),e.spaceOrSupplier==="space"?y(a,"spaceCategories","space-count"):e.spaceOrSupplier==="supplier"&&y(a,"supplierCategories","supplier-count")}else re(a)}function re(a){const r=a.querySelectorAll(".ep-parent-btn"),t=a.querySelectorAll(".ep-child-categories"),i=a.querySelector("#ep-selected-list"),s=a.querySelector("#ep-selected-section");function n(){!i||!s||(i.innerHTML=e.chosenDirectories.map(o=>`<span class="ep-selected-tag">${Z(o)}<button type="button" data-id="${o}">&times;</button></span>`).join(""),s.style.display=e.chosenDirectories.length?"":"none",a.querySelectorAll(".ep-child-btn").forEach(o=>{const d=o.dataset.id;o.classList.toggle("selected",e.chosenDirectories.includes(d))}))}n(),r.forEach(o=>{o.addEventListener("click",()=>{const d=o.dataset.parent,l=o.classList.contains("active");r.forEach(u=>u.classList.remove("active")),t.forEach(u=>u.classList.remove("visible")),l||(o.classList.add("active"),a.querySelector(`.ep-child-categories[data-parent="${d}"]`).classList.add("visible"))})}),a.querySelectorAll(".ep-child-btn").forEach(o=>{o.addEventListener("click",()=>{const d=o.dataset.id,l=e.chosenDirectories.indexOf(d);l===-1?e.chosenDirectories.push(d):e.chosenDirectories.splice(l,1),n()})}),i&&i.addEventListener("click",o=>{if(o.target.tagName==="BUTTON"){const d=o.target.dataset.id,l=e.chosenDirectories.indexOf(d);l!==-1&&(e.chosenDirectories.splice(l,1),n())}})}function y(a,r,t){a.querySelectorAll(".ep-category-item").forEach(i=>{i.addEventListener("click",s=>{s.preventDefault();const n=i.dataset.id;if(!n)return;const o=e[r].indexOf(n);o===-1?(e[r].push(n),i.classList.add("selected")):(e[r].splice(o,1),i.classList.remove("selected"));const d=a.querySelector("#"+t);d&&(d.textContent=e[r].length)})})}function ie(a){["website","instagram","facebook","linkedin","tiktok","youtube"].forEach(t=>{const i=a.querySelector(`#ep-${t}`);if(!i)return;const s=i.closest(".ep-link-field");let n=s.querySelector(".ep-field-error");n||(n=document.createElement("div"),n.className="ep-field-error",n.style.cssText="grid-column: 2;",s.appendChild(n)),i.addEventListener("input",()=>{e[t]=i.value,i.classList.remove("error"),n.textContent=""}),i.addEventListener("blur",()=>{const o=i.value.trim();if(!o){i.classList.remove("error"),n.textContent="";return}const d=E(o,t);d.valid?(d.url!==o&&(i.value=d.url,e[t]=d.url),i.classList.remove("error"),n.textContent=""):(i.classList.add("error"),n.textContent=d.error)})})}async function te(){var d,l,u,c,b,U,O;const a=(d=f==null?void 0:f.customFields)==null?void 0:d["membership-type"],r={"first-name":e.firstName,"last-name":e.lastName,"public-bio":e.bio,bio:e.bio,"profile-pic-url":e.profileImageUrl||"","feature-image":e.featureImageUrl||""};w(a)&&(r["trading-name"]=e.businessName,r.slug=e.businessName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),r["street-address"]=e.businessAddress||"",r["display-address"]=e.displayAddress?"true":"false",r["display-opening-hours"]=e.displayOpeningHours?"true":"false",h.forEach(p=>{r[`open-${p.toLowerCase()}`]=e.openingHours[p.toLowerCase()]||""})),r.website=e.website||"",r.instagram=e.instagram||"",r.facebook=e.facebook||"",r.linkedin=e.linkedin||"",r.tiktok=e.tiktok||"",r.youtube=e.youtube||"",e.chosenDirectories.length>0?r.categories=e.chosenDirectories.map(p=>`"${p}"`).join(","):r.categories="",C(a)&&(r.space=e.spaceOrSupplier==="space"?"true":"false",r.supplier=e.spaceOrSupplier==="supplier"?"true":"false",r["space-category"]=e.spaceCategories.length>0?e.spaceCategories.map(p=>`"${p}"`).join(","):"",r["supplier-categories"]=e.supplierCategories.length>0?e.supplierCategories.map(p=>`"${p}"`).join(","):""),await window.$memberstackDom.updateMember({customFields:r});const t=((l=f.customFields)==null?void 0:l["webflow-member-id"])||"",i=((u=f.customFields)==null?void 0:u.suburb)||"",s=((c=f.customFields)==null?void 0:c["suburb-id"])||"",n=((b=f.customFields)==null?void 0:b["billing-frequency"])||"",o={action:"update",memberId:f.id,memberWebflowId:t,memberEmail:((U=f.auth)==null?void 0:U.email)||"",firstName:e.firstName,lastName:e.lastName,slug:r.slug||((O=f.customFields)==null?void 0:O.slug)||"",suburb:i,suburbId:s,membershipType:a,billingFrequency:n,bio:e.bio,businessName:e.businessName||"",businessAddress:e.businessAddress||"",displayAddress:e.displayAddress,displayOpeningHours:e.displayOpeningHours,openingHours:{monday:e.openingHours.monday||"",tuesday:e.openingHours.tuesday||"",wednesday:e.openingHours.wednesday||"",thursday:e.openingHours.thursday||"",friday:e.openingHours.friday||"",saturday:e.openingHours.saturday||"",sunday:e.openingHours.sunday||""},website:e.website||"",instagram:e.instagram||"",facebook:e.facebook||"",linkedin:e.linkedin||"",tiktok:e.tiktok||"",youtube:e.youtube||"",chosenDirectories:e.chosenDirectories.map(p=>`"${p}"`).join(","),spaceCategories:e.spaceCategories.map(p=>`"${p}"`).join(","),supplierCategories:e.supplierCategories.map(p=>`"${p}"`).join(","),isSmallBusiness:a==="small-business",isLargeBusiness:a==="large-business",isNotForProfit:a==="not-for-profit",isCreativeSpace:e.spaceOrSupplier==="space",isSupplier:e.spaceOrSupplier==="supplier",profileImageUrl:e.profileImageUrl||"",featureImageUrl:e.featureImageUrl||"",timestamp:new Date().toISOString()};try{console.log("Sending profile update webhook...",o),await fetch(q,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o),mode:"no-cors"}),console.log("Webhook sent successfully")}catch(p){console.warn("Webhook error (non-blocking):",p)}JSON.parse(JSON.stringify(e))}function g(a,r){a.textContent=r,a.style.display="block",a.scrollIntoView({behavior:"smooth",block:"center"})}function se(a){a.innerHTML=`
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
    `}function ne(a,r){a.innerHTML=`
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" style="display: block;">${r}</div>
        </div>
      </div>
    `}async function D(){const a=document.querySelector(".all-types-profile-edit");if(!a){console.warn("Could not find .all-types-profile-edit container");return}const r=document.createElement("style");r.textContent=M,document.head.appendChild(r),a.innerHTML='<div class="ep-loading">Loading your profile...</div>';try{if(await R(),!await W()){se(a);return}_(a)}catch(t){console.error("Init error:",t),ne(a,"Error loading profile. Please refresh the page.")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",D):D()})();
