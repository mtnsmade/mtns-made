(function(){console.log("Member onboarding script loaded");const I=["small-business","large-business","not-for-profit","spaces-suppliers"],O="spaces-suppliers",U="https://hooks.zapier.com/hooks/catch/20216239/ulr09fx/",D="4ab46fc683f9c002ae8b";let v=!1;const q=[{id:"64ad5d2856cac56795029d2a",name:"Visual Arts",slug:"visual-arts"},{id:"64ad5d2dde2ea6eeaeb94003",name:"Design",slug:"design"},{id:"64ad5d37ab90d652594a17a8",name:"Photography",slug:"photography"},{id:"64ad5d31bf826ce4810f9b7a",name:"Craft",slug:"craft"},{id:"64ad5d3fde2ea6eeaeb95c9e",name:"Performing Arts",slug:"performing-arts"},{id:"64ad5d25b6907c1bed526490",name:"Screen",slug:"screen"},{id:"64ad5d519e2a54f5aab831aa",name:"Publishing",slug:"publishing"},{id:"64ad5d4b9a1e0e4717405adb",name:"Creative Education",slug:"creative-education"},{id:"64bfaf6a75299ea8759488fc",name:"Cultural Work",slug:"cultural-work"},{id:"64ad5d5fff882df891ead372",name:"Artisanal Products",slug:"artisanal-products"}],k=[{id:"64c324a2892f531f780ed838",name:"Installation Art",parent:"visual-arts"},{id:"64c337e9723e82f68fdcdbb8",name:"Interactive Art",parent:"visual-arts"},{id:"64c324a2761d2d11e129c478",name:"Land Art",parent:"visual-arts"},{id:"64c31e58892f531f780882ca",name:"Painting",parent:"visual-arts"},{id:"64c324a18561c58fd41ae093",name:"Photomedia",parent:"visual-arts"},{id:"64c324a14e1c7df81c3a7ac8",name:"Printmedia",parent:"visual-arts"},{id:"64c324a24e1c7df81c3a7b5e",name:"Public Art",parent:"visual-arts"},{id:"64c324a1761d2d11e129c3f4",name:"Sculpture",parent:"visual-arts"},{id:"64c324a2eb00d38a83f49380",name:"Sound Art",parent:"visual-arts"},{id:"64c337b9723e82f68fdcb311",name:"Street Art",parent:"visual-arts"},{id:"64c324a21e2d449f6822b228",name:"Textile Art",parent:"visual-arts"},{id:"64c324a2c8b5a5a8b31f4837",name:"Video Art",parent:"visual-arts"},{id:"64c322813b98e1ea07e8db25",name:"Architecture",parent:"design"},{id:"64c32281ea11fadfc16688ac",name:"Fabric Design",parent:"design"},{id:"64c32281686438dbe444b876",name:"Fashion Design",parent:"design"},{id:"64c322813b98e1ea07e8dae6",name:"Furniture Design",parent:"design"},{id:"64c3228298f9b238322506fa",name:"Game Design",parent:"design"},{id:"64c31e418e3559214f884254",name:"Graphic Design",parent:"design"},{id:"64c32281906b099337c72e36",name:"Illustration",parent:"design"},{id:"64c32281906b099337c72ed7",name:"Industrial Design",parent:"design"},{id:"64c32282efe376c79c3cf4dd",name:"Interior Design",parent:"design"},{id:"64c32281e743d0c2d6501b23",name:"Landscape Design",parent:"design"},{id:"64c32282ee36f5991d7b1ccd",name:"Lighting Design",parent:"design"},{id:"64c322821f3ad42037ca043d",name:"Murals",parent:"design"},{id:"64c322821e2d449f68203f5b",name:"Signwriting",parent:"design"},{id:"64c32282686438dbe444b955",name:"Sound Design",parent:"design"},{id:"64c322818e3559214f8ca311",name:"Website Design",parent:"design"},{id:"64c324a3e743d0c2d6522f5a",name:"Aerial Photography",parent:"photography"},{id:"64c324a489c8fd4d0e7f1320",name:"Animal Photography",parent:"photography"},{id:"64c324a3c8b5a5a8b31f48f1",name:"Event Photography",parent:"photography"},{id:"64c324a3ea11fadfc1692102",name:"Fashion Photography",parent:"photography"},{id:"64c324a38561c58fd41ae133",name:"Food Photography",parent:"photography"},{id:"64c324a28e3559214f8ef399",name:"Interior Photography",parent:"photography"},{id:"64c324a3eb00d38a83f494a1",name:"Landscape Photography",parent:"photography"},{id:"64c31e65906b099337c338cd",name:"Portraiture",parent:"photography"},{id:"64c324a3e743d0c2d6522ee7",name:"Product Photography",parent:"photography"},{id:"64c324a32af64bdc37a878ed",name:"Sports Photography",parent:"photography"},{id:"64c324a3ee36f5991d7d4b0d",name:"Travel Photography",parent:"photography"},{id:"64c324a216bbd436777da9b0",name:"Wedding Photography",parent:"photography"},{id:"64c31e4a1f3ad42037c53e42",name:"Ceramics",parent:"craft"},{id:"64c324a1ea11fadfc1691bac",name:"Floristry",parent:"craft"},{id:"64c340b8723e82f68fe423ef",name:"Glass",parent:"craft"},{id:"64c324a116bbd436777da24a",name:"Jewellery",parent:"craft"},{id:"64c324a013204b77e3230c47",name:"Leather",parent:"craft"},{id:"64c324a1ea11fadfc1691bfa",name:"Metal",parent:"craft"},{id:"64c324a198f9b238322737d3",name:"Millenary",parent:"craft"},{id:"64c324a113204b77e3230c68",name:"Paper",parent:"craft"},{id:"64c324a1ea11fadfc1691bf3",name:"Textiles",parent:"craft"},{id:"64c324a08e3559214f8ef2ce",name:"Wood",parent:"craft"},{id:"64c324a41e2d449f6822b34d",name:"Circus",parent:"performing-arts"},{id:"64c31e6f998d40df52d0c0d2",name:"Dance",parent:"performing-arts"},{id:"64c33dbaa9c56afb61758f2b",name:"Dramaturgy",parent:"performing-arts"},{id:"64c324a589c8fd4d0e7f13f5",name:"Live Arts Production",parent:"performing-arts"},{id:"64c324a4686438dbe448d594",name:"Modelling",parent:"performing-arts"},{id:"64c324a4761d2d11e129c57a",name:"Music",parent:"performing-arts"},{id:"64c324a4e743d0c2d6522fa1",name:"Performance Art",parent:"performing-arts"},{id:"64c342694a697ccad200d2d8",name:"Playwriting",parent:"performing-arts"},{id:"64c324a413204b77e3231064",name:"Projection",parent:"performing-arts"},{id:"64c324a4ea11fadfc16926de",name:"Set Design",parent:"performing-arts"},{id:"64c324a416bbd436777db291",name:"Stage Acting",parent:"performing-arts"},{id:"64c33d6ad8c53bbeff0ad758",name:"Stage Direction",parent:"performing-arts"},{id:"64c324a413204b77e323105b",name:"Stage Lighting",parent:"performing-arts"},{id:"64c32280ee36f5991d7b1952",name:"Animation",parent:"screen"},{id:"64c3228098f9b23832250411",name:"Art Department",parent:"screen"},{id:"64c33e675e7e936176992daa",name:"Camera Operator",parent:"screen"},{id:"64c31da3ee36f5991d75f179",name:"Cinematography",parent:"screen"},{id:"64c33ecb3c3e613167c5af80",name:"Costume Design",parent:"screen"},{id:"64c32280906b099337c72dd6",name:"Drone",parent:"screen"},{id:"64c322808561c58fd418867c",name:"Location Scouting",parent:"screen"},{id:"64c32280ee36f5991d7b1928",name:"Post Production",parent:"screen"},{id:"64c3227f1f3ad42037ca0282",name:"Screen Acting",parent:"screen"},{id:"64c3227fea11fadfc1668683",name:"Screen Direction",parent:"screen"},{id:"64c31dcf8561c58fd4138bfd",name:"Screen Editing",parent:"screen"},{id:"64c322808e3559214f8c9fee",name:"Screen Production",parent:"screen"},{id:"64c3228016bbd436777b7429",name:"Screen Services",parent:"screen"},{id:"64c3227fe743d0c2d65012d2",name:"Screen Writing",parent:"screen"},{id:"64c322808561c58fd41885e9",name:"Soundtrack",parent:"screen"},{id:"64c3228089c8fd4d0e7cb947",name:"Videography",parent:"screen"},{id:"64c324a6686438dbe448d885",name:"Copywriting",parent:"publishing"},{id:"64c31e97906b099337c36aa8",name:"Creative Writing",parent:"publishing"},{id:"64c324a7892f531f780edd4e",name:"Journalism",parent:"publishing"},{id:"64c324a7e743d0c2d6523397",name:"Podcasting",parent:"publishing"},{id:"64c324a698f9b23832273cc9",name:"Poetry",parent:"publishing"},{id:"64c324a61f3ad42037ccb81a",name:"Proofreading",parent:"publishing"},{id:"64c324a6e743d0c2d6523345",name:"Technical Writing",parent:"publishing"},{id:"64c324a7efe376c79c3f7f4f",name:"Text Editing",parent:"publishing"},{id:"64c31e8ceb00d38a83edc555",name:"Dance Education",parent:"creative-education"},{id:"64c324a6c8b5a5a8b31f4e60",name:"Drama Education",parent:"creative-education"},{id:"64c324a613204b77e3231205",name:"Higher Degree Supervision",parent:"creative-education"},{id:"64c324a698f9b23832273cac",name:"Illustration Education",parent:"creative-education"},{id:"64c324a58e3559214f8ef632",name:"Music Education",parent:"creative-education"},{id:"64c324a6bbf8ad730a694fbb",name:"Photography Education",parent:"creative-education"},{id:"64c324a6ee36f5991d7d4d50",name:"Visual Arts Education",parent:"creative-education"},{id:"64c324a6efe376c79c3f7d46",name:"Writing Education",parent:"creative-education"},{id:"64c324a516bbd436777db338",name:"Academic Research",parent:"cultural-work"},{id:"64c324a5ea11fadfc1692763",name:"Art Therapy",parent:"cultural-work"},{id:"64c324a5bbf8ad730a694e60",name:"Arts Management",parent:"cultural-work"},{id:"64c324a5998d40df52d73c72",name:"Arts Promotion",parent:"cultural-work"},{id:"64c324a5efe376c79c3f7c60",name:"Curation",parent:"cultural-work"},{id:"64c324a5686438dbe448d693",name:"Event Production",parent:"cultural-work"},{id:"64c3227ed94a307c093ebd3f",name:"First Nations Custodianship",parent:"cultural-work"},{id:"64c324a5998d40df52d73caa",name:"Grant Writing",parent:"cultural-work"},{id:"64c324a598f9b23832273c36",name:"Social Media",parent:"cultural-work"},{id:"64c324a5761d2d11e129c625",name:"Socially Engaged Practice",parent:"cultural-work"},{id:"64c324a7eb00d38a83f4992a",name:"Beverages",parent:"artisanal-products"},{id:"64c31ea2ea11fadfc162c4fc",name:"Food",parent:"artisanal-products"},{id:"64c324a7892f531f780edd7c",name:"Homewares",parent:"artisanal-products"},{id:"64c324a78561c58fd41ae32b",name:"Skincare",parent:"artisanal-products"},{id:"64c324a7ee36f5991d7d4e61",name:"Toys",parent:"artisanal-products"}],H=[{id:"64f1da35f675358d75b91b1d",name:"Writing Residency"},{id:"64f1da2d7d6477504d516cbe",name:"Workshop Venue"},{id:"64f1da274eb35585095da19d",name:"Theatre"},{id:"64f1da2002940058e3edd5fe",name:"Retail Space"},{id:"64f1da189d95e948bba862e6",name:"Rehearsal Space"},{id:"64f1da1112dd56d3752546e5",name:"Recording Studio"},{id:"64f1da09e36d896066188137",name:"Photographic Studio"},{id:"64f1da02dbd420ebdcbbdbe0",name:"Music Venue"},{id:"64f1d9fb72f97d02aed69114",name:"Gallery"},{id:"64f1d9f3ba4f53a0a58913a0",name:"Darkroom"},{id:"64f1d9ed2cf058e9ad97a1aa",name:"Dance Studio"},{id:"64f1d9e487b976f53293536b",name:"Co-Working Space"},{id:"64f1d9d841906b7dee94da37",name:"Cinema"},{id:"64ededcde4500853d75fe7e0",name:"Artist Run Initiative"},{id:"64ededc756e09fc697df87bd",name:"Art Studio"},{id:"64ededbe04bc1f5d88f1cb04",name:"Art Residency"}],M=[{id:"64dc99567a4ece99563eb6e7",name:"Hardware Supplies"},{id:"64dc992bfff2b7132e358226",name:"Engineering"},{id:"64dc991159bcce300f33a9b4",name:"IT Services"},{id:"64dc98f99d53cdd25ecb4092",name:"Plant Nursery"},{id:"64dc98df260c6f155a45fce4",name:"CAD Modelling"},{id:"64dc98c3fff2b7132e34e127",name:"Framing"},{id:"64dc98b2fff2b7132e34c878",name:"Drafting"},{id:"64dc98968e1db3580f5eb587",name:"Search Engine Optimisation"},{id:"64dc9877b39b4a82e4b00172",name:"Music Supplies"},{id:"64dc9852c843c0e96d30c7d5",name:"Sewing Supplies"},{id:"64dc981259bcce300f3319b5",name:"Art & Craft Supplies"},{id:"64dc97f42e4ce3b17fd788ba",name:"CNC Cutting"},{id:"64dc97d8b39b4a82e4af7561",name:"Laser Cutting"},{id:"64dc97bca8135e1414e5e8bc",name:"Metal Fabrication"},{id:"64dc97a2a8135e1414e5d040",name:"3D Printing"},{id:"64dc9788f9556b85f083d5e8",name:"Digital Printing"},{id:"64dc976ebf5b1edb1f42010c",name:"Offset Printing"},{id:"64dc974e2e4ce3b17fd6b9b4",name:"Letterpress"}],x=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],z=`
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
    .ms-category-section {
      margin-bottom: 24px;
    }
    .ms-category-header {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
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
    .ms-success-banner {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
      text-align: center;
    }
    .ms-char-count {
      font-size: 12px;
      color: #666;
      text-align: right;
      margin-top: 4px;
    }
    .ms-char-count.over-limit {
      color: #dc3545;
    }
    .ms-selected-count {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }
    .ms-accordion {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 12px;
      overflow: hidden;
    }
    .ms-accordion-header {
      padding: 14px 16px;
      background: #f8f9fa;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      font-size: 14px;
    }
    .ms-accordion-header:hover {
      background: #f0f0f0;
    }
    .ms-accordion-arrow {
      transition: transform 0.2s;
    }
    .ms-accordion.open .ms-accordion-arrow {
      transform: rotate(180deg);
    }
    .ms-accordion-content {
      display: none;
      padding: 16px;
    }
    .ms-accordion.open .ms-accordion-content {
      display: block;
    }
    .ms-accordion-count {
      font-size: 12px;
      color: #666;
      font-weight: normal;
    }
  `;let p=1,S=5,l=null,a={profileImageUrl:null,profileImagePreview:null,featureImageUrl:null,featureImagePreview:null,bio:"",businessName:"",spaceOrSupplier:null,chosenDirectories:[],spaceCategories:[],supplierCategories:[],businessAddress:"",displayAddress:!1,openingHours:{monday:"",tuesday:"",wednesday:"",thursday:"",friday:"",saturday:"",sunday:""},displayOpeningHours:!1,website:"",instagram:"",facebook:"",linkedin:"",tiktok:"",youtube:""};function F(){return new Promise((e,s)=>{let r=0;const t=50,o=setInterval(()=>{r++,window.$memberstackDom?(clearInterval(o),e()):r>=t&&(clearInterval(o),s(new Error("Memberstack not loaded")))},100)})}function b(e){return I.includes(e)}function w(e){return e===O}const L={instagram:{baseUrl:"https://www.instagram.com/",patterns:[/instagram\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},facebook:{baseUrl:"https://www.facebook.com/",patterns:[/facebook\.com\/([^\/\?]+)/i,/^([a-zA-Z0-9.]+)$/]},linkedin:{baseUrl:"https://www.linkedin.com/in/",patterns:[/linkedin\.com\/(in|company)\/([^\/\?]+)/i,/^([a-zA-Z0-9-]+)$/]},tiktok:{baseUrl:"https://www.tiktok.com/@",patterns:[/tiktok\.com\/@?([^\/\?]+)/i,/^@?([a-zA-Z0-9._]+)$/]},youtube:{baseUrl:"https://www.youtube.com/",patterns:[/youtube\.com\/(channel|c|user|@)\/([^\/\?]+)/i,/youtube\.com\/([^\/\?]+)/i,/^@?([a-zA-Z0-9_-]+)$/]}};function C(e,s=null){if(!e||!e.trim())return{valid:!0,url:""};if(e=e.trim(),/^https?:\/\//i.test(e))try{return new URL(e),{valid:!0,url:e}}catch{return{valid:!1,error:"Invalid URL format"}}if(s==="website")return/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/.test(e)?{valid:!0,url:"https://"+e}:{valid:!1,error:"Please enter a full website URL (e.g., https://example.com)"};if(s&&L[s]){const r=L[s];if(e.toLowerCase().includes(s.toLowerCase()+".com"))return{valid:!0,url:"https://"+e.replace(/^(https?:\/\/)?/i,"")};for(const t of r.patterns){const o=e.match(t);if(o){const i=o[o.length-1];return i.toLowerCase()===s.toLowerCase()?{valid:!1,error:`Please enter your ${s} profile URL or username`}:{valid:!0,url:r.baseUrl+i.replace(/^@/,"")}}}return{valid:!1,error:`Please enter a valid ${s} URL or username`}}return{valid:!1,error:"Invalid URL"}}function R(){const e=[];return["website","instagram","facebook","linkedin","tiktok","youtube"].forEach(r=>{const t=a[r];if(t&&t.trim()){const o=C(t,r);o.valid?a[r]=o.url:e.push({platform:r,error:o.error})}}),e}function E(){return new Promise(e=>{if(v||window.uploadcare){v=!0,e();return}const s=document.createElement("script");s.src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js",s.onload=()=>{v=!0,e()},document.head.appendChild(s)})}function P(e={}){return new Promise((s,r)=>{if(!window.uploadcare){r(new Error("Uploadcare not loaded"));return}uploadcare.openDialog(null,{publicKey:D,imagesOnly:!0,crop:e.crop||"free",tabs:"file camera",...e}).done(o=>{o.promise().done(i=>{s(i.cdnUrl)}).fail(i=>{r(i)})})})}function g(e){var t;const s=(t=l==null?void 0:l.customFields)==null?void 0:t["membership-type"];S=b(s)?5:4;let r='<div class="ms-progress">';for(let o=1;o<=S;o++){let i="ms-progress-step";o<p&&(i+=" completed"),o===p&&(i+=" active"),r+=`<div class="${i}"></div>`}return r+="</div>",r}function B(e){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Let's set up your public profile. This should only take a few minutes.</p>
        </div>
        ${g()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 1: Profile Images</h3>
          <p class="ms-step-description">Upload images that will appear on your public profile.</p>

          <div class="ms-image-row">
            <div class="ms-form-field">
              <label>Profile Image <span class="required">*</span></label>
              <div class="ms-image-upload" id="profile-upload">
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
    `,N(e)}function N(e){const s=e.querySelector("#profile-upload"),r=e.querySelector("#feature-upload"),t=e.querySelector("#ms-next-btn"),o=e.querySelector("#ms-error-banner");function i(){a.profileImageUrl?(s.innerHTML=`
          <img src="${a.profileImageUrl}" class="ms-image-preview profile" alt="Profile preview">
          <button type="button" class="ms-image-remove" data-remove="profile">&times;</button>
        `,s.classList.add("has-image")):(s.innerHTML=`
          <div class="ms-image-upload-text">
            <strong>Click to upload</strong><br>
            Square image recommended
          </div>
        `,s.classList.remove("has-image"))}function n(){a.featureImageUrl?(r.innerHTML=`
          <img src="${a.featureImageUrl}" class="ms-image-preview" alt="Feature preview">
          <button type="button" class="ms-image-remove" data-remove="feature">&times;</button>
        `,r.classList.add("has-image")):(r.innerHTML=`
          <div class="ms-image-upload-text">
            <strong>Click to upload</strong><br>
            Landscape image recommended
          </div>
        `,r.classList.remove("has-image"))}i(),n(),s.addEventListener("click",async d=>{if(d.target.dataset.remove==="profile"){d.stopPropagation(),a.profileImageUrl=null,i();return}if(!a.profileImageUrl)try{await E();const c=await P({crop:"1:1"});a.profileImageUrl=c,i(),o.style.display="none"}catch(c){c&&c!=="cancel"&&c.message!=="cancelled"&&(console.error("Profile upload error:",c),m(o,"Failed to upload profile image. Please try again."))}}),r.addEventListener("click",async d=>{if(d.target.dataset.remove==="feature"){d.stopPropagation(),a.featureImageUrl=null,n();return}if(!a.featureImageUrl)try{await E();const c=await P({crop:"16:9"});a.featureImageUrl=c,n(),o.style.display="none"}catch(c){c&&c!=="cancel"&&c.message!=="cancelled"&&(console.error("Feature upload error:",c),m(o,"Failed to upload feature image. Please try again."))}}),t.addEventListener("click",()=>{if(!a.profileImageUrl){m(o,"Please upload a profile image");return}if(!a.featureImageUrl){m(o,"Please upload a feature image");return}p=2,u(e)})}function W(e){var t;const s=(t=l==null?void 0:l.customFields)==null?void 0:t["membership-type"],r=b(s);e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Tell us about yourself${r?" and your business":""}.</p>
        </div>
        ${g()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 2: About You</h3>
          <p class="ms-step-description">This information will be displayed on your public profile.</p>

          ${r?`
            <div class="ms-form-field">
              <label>Business / Trading Name <span class="required">*</span></label>
              <input type="text" class="ms-form-input" id="ms-business-name" value="${a.businessName}" placeholder="Enter your business or trading name">
            </div>
          `:""}

          <div class="ms-form-field">
            <label>Bio <span class="required">*</span></label>
            <textarea class="ms-form-input" id="ms-bio" maxlength="2000" placeholder="Tell us about your creative practice, skills, and what you offer...">${a.bio}</textarea>
            <div class="ms-char-count"><span id="ms-bio-count">${a.bio.length}</span> / 2000 characters</div>
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `,_(e,r)}function _(e,s){const r=e.querySelector("#ms-bio"),t=e.querySelector("#ms-bio-count"),o=s?e.querySelector("#ms-business-name"):null,i=e.querySelector("#ms-back-btn"),n=e.querySelector("#ms-next-btn"),d=e.querySelector("#ms-error-banner");r.addEventListener("input",()=>{a.bio=r.value,t.textContent=r.value.length}),o&&o.addEventListener("input",()=>{a.businessName=o.value}),i.addEventListener("click",()=>{p=1,u(e)}),n.addEventListener("click",()=>{if(s&&!a.businessName.trim()){m(d,"Please enter your business name");return}if(!a.bio.trim()){m(d,"Please enter a bio");return}if(a.bio.trim().length<50){m(d,"Please enter at least 50 characters for your bio");return}p=3,u(e)})}function Y(e){var t;const s=(t=l==null?void 0:l.customFields)==null?void 0:t["membership-type"],r=w(s);e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Select the categories that best describe your work.</p>
        </div>
        ${g()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 3: Categories</h3>
          <p class="ms-step-description">Choose categories so people can find you in the directory. Select at least one.</p>

          <div id="categories-container">
            ${r?G():j()}
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `,Z(e,r)}function G(){return`
      <div class="ms-form-field">
        <label>What type of listing are you? <span class="required">*</span></label>
        <div class="ms-radio-group">
          <label class="ms-radio-item ${a.spaceOrSupplier==="space"?"selected":""}" id="radio-space">
            <input type="radio" name="space-supplier" value="space" ${a.spaceOrSupplier==="space"?"checked":""}>
            <div class="ms-radio-item-title">Creative Space</div>
            <div class="ms-radio-item-desc">Studios, venues, galleries, etc.</div>
          </label>
          <label class="ms-radio-item ${a.spaceOrSupplier==="supplier"?"selected":""}" id="radio-supplier">
            <input type="radio" name="space-supplier" value="supplier" ${a.spaceOrSupplier==="supplier"?"checked":""}>
            <div class="ms-radio-item-title">Supplier</div>
            <div class="ms-radio-item-desc">Materials, services, equipment, etc.</div>
          </label>
        </div>
      </div>
      <div id="space-supplier-categories" style="${a.spaceOrSupplier?"":"display: none;"}">
        ${a.spaceOrSupplier==="space"?A():""}
        ${a.spaceOrSupplier==="supplier"?$():""}
      </div>
    `}function A(){let e='<div class="ms-category-section"><div class="ms-category-header">Select Space Categories</div><div class="ms-category-grid">';return H.forEach(s=>{const r=a.spaceCategories.includes(s.id);e+=`
        <label class="ms-category-item ${r?"selected":""}" data-id="${s.id}">
          <input type="checkbox" value="${s.id}" ${r?"checked":""}>
          ${s.name}
        </label>
      `}),e+='</div><div class="ms-selected-count"><span id="space-count">'+a.spaceCategories.length+"</span> selected</div></div>",e}function $(){let e='<div class="ms-category-section"><div class="ms-category-header">Select Supplier Categories</div><div class="ms-category-grid">';return M.forEach(s=>{const r=a.supplierCategories.includes(s.id);e+=`
        <label class="ms-category-item ${r?"selected":""}" data-id="${s.id}">
          <input type="checkbox" value="${s.id}" ${r?"checked":""}>
          ${s.name}
        </label>
      `}),e+='</div><div class="ms-selected-count"><span id="supplier-count">'+a.supplierCategories.length+"</span> selected</div></div>",e}function j(){let e="";return q.forEach(s=>{const r=k.filter(i=>i.parent===s.slug);if(r.length===0)return;const t=r.filter(i=>a.chosenDirectories.includes(i.id)).length,o=t>0;e+=`
        <div class="ms-accordion ${o?"open":""}" data-parent="${s.slug}">
          <div class="ms-accordion-header">
            ${s.name}
            <span>
              <span class="ms-accordion-count">${t>0?`(${t} selected)`:""}</span>
              <span class="ms-accordion-arrow">▼</span>
            </span>
          </div>
          <div class="ms-accordion-content">
            <div class="ms-category-grid">
      `,r.forEach(i=>{const n=a.chosenDirectories.includes(i.id);e+=`
          <label class="ms-category-item ${n?"selected":""}" data-id="${i.id}">
            <input type="checkbox" value="${i.id}" ${n?"checked":""}>
            ${i.name}
          </label>
        `}),e+=`
            </div>
          </div>
        </div>
      `}),e+=`<div class="ms-selected-count"><span id="directory-count">${a.chosenDirectories.length}</span> categories selected</div>`,e}function Z(e,s){const r=e.querySelector("#ms-back-btn"),t=e.querySelector("#ms-next-btn"),o=e.querySelector("#ms-error-banner");if(r.addEventListener("click",()=>{p=2,u(e)}),s){const i=e.querySelector("#radio-space"),n=e.querySelector("#radio-supplier"),d=e.querySelector("#space-supplier-categories");i.addEventListener("click",()=>{a.spaceOrSupplier="space",a.supplierCategories=[],i.classList.add("selected"),n.classList.remove("selected"),d.innerHTML=A(),d.style.display="block",h(e,"spaceCategories","space-count")}),n.addEventListener("click",()=>{a.spaceOrSupplier="supplier",a.spaceCategories=[],n.classList.add("selected"),i.classList.remove("selected"),d.innerHTML=$(),d.style.display="block",h(e,"supplierCategories","supplier-count")}),a.spaceOrSupplier==="space"?h(e,"spaceCategories","space-count"):a.spaceOrSupplier==="supplier"&&h(e,"supplierCategories","supplier-count"),t.addEventListener("click",()=>{if(!a.spaceOrSupplier){m(o,"Please select whether you are a Creative Space or Supplier");return}if((a.spaceOrSupplier==="space"?a.spaceCategories.length:a.supplierCategories.length)===0){m(o,"Please select at least one category");return}p=4,u(e)})}else e.querySelectorAll(".ms-accordion-header").forEach(i=>{i.addEventListener("click",()=>{i.parentElement.classList.toggle("open")})}),h(e,"chosenDirectories","directory-count"),t.addEventListener("click",()=>{var n;if(a.chosenDirectories.length===0){m(o,"Please select at least one category");return}const i=(n=l==null?void 0:l.customFields)==null?void 0:n["membership-type"];b(i)?p=4:p=5,u(e)})}function h(e,s,r){e.querySelectorAll(".ms-category-item").forEach(t=>{t.addEventListener("click",o=>{o.preventDefault();const i=t.dataset.id,n=a[s].indexOf(i);n===-1?(a[s].push(i),t.classList.add("selected")):(a[s].splice(n,1),t.classList.remove("selected"));const d=e.querySelector("#"+r);d&&(d.textContent=a[s].length),s==="chosenDirectories"&&V(e)})})}function V(e){e.querySelectorAll(".ms-accordion").forEach(s=>{const r=s.dataset.parent,o=k.filter(n=>n.parent===r).filter(n=>a.chosenDirectories.includes(n.id)).length,i=s.querySelector(".ms-accordion-count");i.textContent=o>0?`(${o} selected)`:""})}function J(e){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Add your business location and hours.</p>
        </div>
        ${g()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step 4: Location & Hours</h3>
          <p class="ms-step-description">This information is optional. You can control what's displayed publicly.</p>

          <div class="ms-form-field">
            <label>Business Address</label>
            <input type="text" class="ms-form-input" id="ms-address" value="${a.businessAddress}" placeholder="Enter your business address">
            <div class="ms-hint">This is where customers can find you</div>
          </div>

          <div class="ms-toggle-field">
            <span class="ms-toggle-label">Display address publicly on my profile</span>
            <label class="ms-toggle">
              <input type="checkbox" id="ms-display-address" ${a.displayAddress?"checked":""}>
              <span class="ms-toggle-slider"></span>
            </label>
          </div>

          <div class="ms-form-field">
            <label>Opening Hours</label>
            <div class="ms-hours-grid">
              ${x.map(s=>`
                <div class="ms-hours-row">
                  <span class="ms-hours-day">${s}</span>
                  <input type="text" class="ms-hours-input" id="ms-hours-${s.toLowerCase()}"
                    value="${a.openingHours[s.toLowerCase()]}"
                    placeholder="e.g., 9am - 5pm or Closed">
                </div>
              `).join("")}
            </div>
          </div>

          <div class="ms-toggle-field">
            <span class="ms-toggle-label">Display opening hours publicly on my profile</span>
            <label class="ms-toggle">
              <input type="checkbox" id="ms-display-hours" ${a.displayOpeningHours?"checked":""}>
              <span class="ms-toggle-slider"></span>
            </label>
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-next-btn">Next</button>
          </div>
        </div>
      </div>
    `,X(e)}function X(e){const s=e.querySelector("#ms-address"),r=e.querySelector("#ms-display-address"),t=e.querySelector("#ms-display-hours"),o=e.querySelector("#ms-back-btn"),i=e.querySelector("#ms-next-btn");s.addEventListener("input",()=>{a.businessAddress=s.value}),r.addEventListener("change",()=>{a.displayAddress=r.checked}),t.addEventListener("change",()=>{a.displayOpeningHours=t.checked}),x.forEach(n=>{const d=e.querySelector(`#ms-hours-${n.toLowerCase()}`);d.addEventListener("input",()=>{a.openingHours[n.toLowerCase()]=d.value})}),o.addEventListener("click",()=>{p=3,u(e)}),i.addEventListener("click",()=>{p=5,u(e)})}function K(e){var t;const s=(t=l==null?void 0:l.customFields)==null?void 0:t["membership-type"],r=b(s)?5:4;e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>COMPLETE YOUR PROFILE</h2>
          <p>Almost done! Add your online presence.</p>
        </div>
        ${g()}
        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <h3 class="ms-step-title">Step ${r}: Links</h3>
          <p class="ms-step-description">Add your website and social media links. All fields are optional.</p>

          <div class="ms-links-grid">
            <div class="ms-link-field">
              <span class="ms-link-label">Website</span>
              <input type="url" class="ms-form-input" id="ms-website" value="${a.website}" placeholder="https://yourwebsite.com">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">Instagram</span>
              <input type="url" class="ms-form-input" id="ms-instagram" value="${a.instagram}" placeholder="https://instagram.com/username">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">Facebook</span>
              <input type="url" class="ms-form-input" id="ms-facebook" value="${a.facebook}" placeholder="https://facebook.com/page">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">LinkedIn</span>
              <input type="url" class="ms-form-input" id="ms-linkedin" value="${a.linkedin}" placeholder="https://linkedin.com/in/username">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">TikTok</span>
              <input type="url" class="ms-form-input" id="ms-tiktok" value="${a.tiktok}" placeholder="https://tiktok.com/@username">
            </div>
            <div class="ms-link-field">
              <span class="ms-link-label">YouTube</span>
              <input type="url" class="ms-form-input" id="ms-youtube" value="${a.youtube}" placeholder="https://youtube.com/channel">
            </div>
          </div>

          <div class="ms-btn-row">
            <button type="button" class="ms-btn ms-btn-secondary" id="ms-back-btn">Back</button>
            <button type="button" class="ms-btn" id="ms-submit-btn">Complete Profile</button>
          </div>
        </div>
      </div>
    `,Q(e)}function Q(e){const s=e.querySelector("#ms-back-btn"),r=e.querySelector("#ms-submit-btn"),t=e.querySelector("#ms-error-banner"),o=["website","instagram","facebook","linkedin","tiktok","youtube"];o.forEach(i=>{const n=e.querySelector(`#ms-${i}`),d=n.closest(".ms-link-field");let c=d.querySelector(".ms-field-error");c||(c=document.createElement("div"),c.className="ms-field-error",c.style.cssText="color: #dc3545; font-size: 12px; margin-top: 4px; grid-column: 2;",d.appendChild(c)),n.addEventListener("input",()=>{a[i]=n.value,n.classList.remove("error"),c.textContent=""}),n.addEventListener("blur",()=>{const y=n.value.trim();if(!y){n.classList.remove("error"),c.textContent="";return}const f=C(y,i);f.valid?(f.url!==y&&(n.value=f.url,a[i]=f.url),n.classList.remove("error"),c.textContent=""):(n.classList.add("error"),c.textContent=f.error)})}),s.addEventListener("click",()=>{var n;const i=(n=l==null?void 0:l.customFields)==null?void 0:n["membership-type"];b(i)?p=4:p=3,u(e)}),r.addEventListener("click",async()=>{const i=R();if(i.length>0){i.forEach(({platform:n,error:d})=>{const c=e.querySelector(`#ms-${n}`),f=c.closest(".ms-link-field").querySelector(".ms-field-error");c.classList.add("error"),f&&(f.textContent=d)}),m(t,"Please fix the highlighted fields before continuing");return}o.forEach(n=>{const d=e.querySelector(`#ms-${n}`);a[n]&&(d.value=a[n])}),r.disabled=!0,r.textContent="Saving...";try{await ee(e)}catch(n){console.error("Submit error:",n),r.disabled=!1,r.textContent="Complete Profile",m(t,"An error occurred. Please try again.")}})}async function ee(e){var o,i;const s=(o=l==null?void 0:l.customFields)==null?void 0:o["membership-type"],r={bio:a.bio,"onboarding-complete":"true"};b(s)&&a.businessName&&(r["business-name"]=a.businessName,r.slug=a.businessName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")),b(s)&&(a.businessAddress&&(r["business-address"]=a.businessAddress),r["display-address"]=a.displayAddress?"true":"false",r["display-opening-hours"]=a.displayOpeningHours?"true":"false",x.forEach(n=>{const d=a.openingHours[n.toLowerCase()];d&&(r[`opening-${n.toLowerCase()}`]=d)})),a.website&&(r.website=a.website),a.instagram&&(r.instagram=a.instagram),a.facebook&&(r.facebook=a.facebook),a.linkedin&&(r.linkedin=a.linkedin),a.tiktok&&(r.tiktok=a.tiktok),a.youtube&&(r.youtube=a.youtube),w(s)&&(r["is-creative-space"]=a.spaceOrSupplier==="space"?"true":"false",r["is-supplier"]=a.spaceOrSupplier==="supplier"?"true":"false"),await window.$memberstackDom.updateMember({customFields:r});const t={memberId:l.id,memberEmail:((i=l.auth)==null?void 0:i.email)||"",membershipType:s,bio:a.bio,businessName:a.businessName||"",businessAddress:a.businessAddress||"",displayAddress:a.displayAddress?"true":"false",displayOpeningHours:a.displayOpeningHours?"true":"false",openingMonday:a.openingHours.monday||"",openingTuesday:a.openingHours.tuesday||"",openingWednesday:a.openingHours.wednesday||"",openingThursday:a.openingHours.thursday||"",openingFriday:a.openingHours.friday||"",openingSaturday:a.openingHours.saturday||"",openingSunday:a.openingHours.sunday||"",website:a.website||"",instagram:a.instagram||"",facebook:a.facebook||"",linkedin:a.linkedin||"",tiktok:a.tiktok||"",youtube:a.youtube||"",chosenDirectories:a.chosenDirectories.join(","),spaceCategories:a.spaceCategories.join(","),supplierCategories:a.supplierCategories.join(","),isCreativeSpace:a.spaceOrSupplier==="space"?"true":"false",isSupplier:a.spaceOrSupplier==="supplier"?"true":"false",profileImageUrl:a.profileImageUrl||"",featureImageUrl:a.featureImageUrl||"",timestamp:new Date().toISOString()};try{console.log("Sending onboarding webhook...",t);const n=new URLSearchParams(t).toString(),d=await fetch(U,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:n});console.log("Webhook response:",d.status,d.ok)}catch(n){console.warn("Webhook error (non-blocking):",n)}ae(e)}function ae(e){let s=5;e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form" style="text-align: center; padding: 48px 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">✓</div>
          <h2 style="margin: 0 0 8px 0;">Profile Complete!</h2>
          <p style="color: #666; margin-bottom: 16px;">Your profile is now set up and ready to go.</p>
          <p style="color: #999; font-size: 14px;">Transferring you to your dashboard in <span id="countdown">${s}</span> seconds...</p>
          <a href="/profile/start" class="ms-btn" style="display: inline-block; text-decoration: none; margin-top: 16px;">Go to Dashboard Now</a>
        </div>
      </div>
    `;const r=e.querySelector("#countdown"),t=setInterval(()=>{s--,r&&(r.textContent=s),s<=0&&(clearInterval(t),window.location.href="/profile/start")},1e3)}function u(e){switch(p){case 1:B(e);break;case 2:W(e);break;case 3:Y(e);break;case 4:J(e);break;case 5:K(e);break}}function m(e,s){e.textContent=s,e.style.display="block",e.scrollIntoView({behavior:"smooth",block:"center"})}function se(e){e.innerHTML=`
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
    `}function re(e){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form" style="text-align: center; padding: 48px 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">✓</div>
          <h2 style="margin: 0 0 8px 0;">Profile Already Complete</h2>
          <p style="color: #666; margin-bottom: 24px;">You've already completed your profile setup.</p>
          <a href="/profile/start" class="ms-btn" style="display: inline-block; text-decoration: none;">Go to Dashboard</a>
        </div>
      </div>
    `}function te(e,s){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form">
          <div class="ms-error-banner" style="display: block;">${s}</div>
        </div>
      </div>
    `}async function T(){var r;const e=document.querySelector(".onboarding-form");if(!e){console.warn("Could not find .onboarding-form container");return}const s=document.createElement("style");s.textContent=z,document.head.appendChild(s),e.innerHTML='<div class="ms-loading">Loading...</div>';try{await F();const{data:t}=await window.$memberstackDom.getCurrentMember();if(!t){se(e);return}if(l=t,((r=t.customFields)==null?void 0:r["onboarding-complete"])==="true"){re(e);return}u(e)}catch(t){console.error("Init error:",t),te(e,"Error loading onboarding. Please refresh the page.")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",T):T()})();
