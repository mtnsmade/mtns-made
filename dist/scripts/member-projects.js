(function(){console.log("Member projects script loaded");const y={create:"https://hooks.zapier.com/hooks/catch/20216239/uqpimju/",update:"https://hooks.zapier.com/hooks/catch/20216239/uqpiw8v/",delete:"https://hooks.zapier.com/hooks/catch/20216239/uqps33w/",migrate:"https://hooks.zapier.com/hooks/catch/20216239/ulh6cmr/"},T="4ab46fc683f9c002ae8b",U={emerging:2,professional:5,"small-business":5,"not-for-profit":5,"large-business":8,"spaces-suppliers":5};function _(e){if(!e)return 2;const t=e.toLowerCase();return U[t]||2}const k=[{name:"Screen",slug:"screen",id:"64ad5d25b6907c1bed526490"},{name:"Visual Art",slug:"visual-arts",id:"64ad5d2856cac56795029d2a"},{name:"Design",slug:"design",id:"64ad5d2dde2ea6eeaeb94003"},{name:"Craft",slug:"craft",id:"64ad5d31bf826ce4810f9b7a"},{name:"Photography",slug:"photography",id:"64ad5d37ab90d652594a17a8"},{name:"Performing Arts",slug:"performing-arts",id:"64ad5d3fde2ea6eeaeb95c9e"},{name:"Cultural Work",slug:"cultural-work",id:"64bfaf6a75299ea8759488fc"},{name:"Creative Education",slug:"creative-education",id:"64ad5d4b9a1e0e4717405adb"},{name:"Publishing",slug:"publishing",id:"64ad5d519e2a54f5aab831aa"},{name:"Artisanal Products",slug:"artisanal-products",id:"64ad5d5fff882df891ead372"}],v={screen:[{name:"Animation",slug:"animation",id:"64c32280ee36f5991d7b1952"},{name:"Art Department",slug:"art-department",id:"64c3228098f9b23832250411"},{name:"Camera Operator",slug:"camera-operator",id:"64c33e675e7e936176992daa"},{name:"Cinematography",slug:"cinematography",id:"64c31da3ee36f5991d75f179"},{name:"Costume Design",slug:"costume-design",id:"64c33ecb3c3e613167c5af80"},{name:"Drone",slug:"drone",id:"64c32280906b099337c72dd6"},{name:"Location Scouting",slug:"location-scouting",id:"64c322808561c58fd418867c"},{name:"Post Production",slug:"post-production",id:"64c32280ee36f5991d7b1928"},{name:"Screen Acting",slug:"screen-acting",id:"64c3227f1f3ad42037ca0282"},{name:"Screen Direction",slug:"screen-direction",id:"64c3227fea11fadfc1668683"},{name:"Screen Editing",slug:"screen-editing",id:"64c31dcf8561c58fd4138bfd"},{name:"Screen Production",slug:"screen-production",id:"64c322808e3559214f8c9fee"},{name:"Screen Services",slug:"screen-services",id:"64c3228016bbd436777b7429"},{name:"Screen Writing",slug:"screen-writing",id:"64c3227fe743d0c2d65012d2"},{name:"Soundtrack",slug:"soundtrack",id:"64c322808561c58fd41885e9"},{name:"Videography",slug:"videography",id:"64c3228089c8fd4d0e7cb947"}],"visual-arts":[{name:"Installation Art",slug:"installation-art",id:"64c324a2892f531f780ed838"},{name:"Interactive Art",slug:"interactive-art",id:"64c337e9723e82f68fdcdbb8"},{name:"Land Art",slug:"land-art",id:"64c324a2761d2d11e129c478"},{name:"Painting",slug:"painting",id:"64c31e58892f531f780882ca"},{name:"Photomedia",slug:"photomedia",id:"64c324a18561c58fd41ae093"},{name:"Printmedia",slug:"printmedia",id:"64c324a14e1c7df81c3a7ac8"},{name:"Public Art",slug:"public-art",id:"64c324a24e1c7df81c3a7b5e"},{name:"Sculpture",slug:"sculpture",id:"64c324a1761d2d11e129c3f4"},{name:"Sound Art",slug:"sound-art",id:"64c324a2eb00d38a83f49380"},{name:"Street Art",slug:"street-art",id:"64c337b9723e82f68fdcb311"},{name:"Textile Art",slug:"textile-art",id:"64c324a21e2d449f6822b228"},{name:"Video Art",slug:"video-art",id:"64c324a2c8b5a5a8b31f4837"}],design:[{name:"Architecture",slug:"architecture",id:"64c322813b98e1ea07e8db25"},{name:"Fabric Design",slug:"fabric-design",id:"64c32281ea11fadfc16688ac"},{name:"Fashion Design",slug:"fashion-design",id:"64c32281686438dbe444b876"},{name:"Furniture Design",slug:"furniture-design",id:"64c322813b98e1ea07e8dae6"},{name:"Game Design",slug:"game-design",id:"64c3228298f9b238322506fa"},{name:"Graphic Design",slug:"graphic-design",id:"64c31e418e3559214f884254"},{name:"Illustration",slug:"illustration",id:"64c32281906b099337c72e36"},{name:"Industrial Design",slug:"industrial-design",id:"64c32281906b099337c72ed7"},{name:"Interior Design",slug:"interior-design",id:"64c32282efe376c79c3cf4dd"},{name:"Landscape Design",slug:"landscape-design",id:"64c32281e743d0c2d6501b23"},{name:"Lighting Design",slug:"lighting-design",id:"64c32282ee36f5991d7b1ccd"},{name:"Murals",slug:"murals",id:"64c322821f3ad42037ca043d"},{name:"Signwriting",slug:"signwriting",id:"64c322821e2d449f68203f5b"},{name:"Sound Design",slug:"sound-design",id:"64c32282686438dbe444b955"},{name:"Website Design",slug:"website-design",id:"64c322818e3559214f8ca311"}],craft:[{name:"Ceramics",slug:"ceramics",id:"64c31e4a1f3ad42037c53e42"},{name:"Floristry",slug:"floristry",id:"64c324a1ea11fadfc1691bac"},{name:"Glass",slug:"glass",id:"64c340b8723e82f68fe423ef"},{name:"Jewellery",slug:"jewellery",id:"64c324a116bbd436777da24a"},{name:"Leather",slug:"leather",id:"64c324a013204b77e3230c47"},{name:"Metal",slug:"metal",id:"64c324a1ea11fadfc1691bfa"},{name:"Millenary",slug:"millenary",id:"64c324a198f9b238322737d3"},{name:"Paper",slug:"paper",id:"64c324a113204b77e3230c68"},{name:"Textiles",slug:"textiles",id:"64c324a1ea11fadfc1691bf3"},{name:"Wood",slug:"wood",id:"64c324a08e3559214f8ef2ce"}],photography:[{name:"Aerial Photography",slug:"aerial-photography",id:"64c324a3e743d0c2d6522f5a"},{name:"Animal Photography",slug:"animal-photography",id:"64c324a489c8fd4d0e7f1320"},{name:"Event Photography",slug:"event-photography",id:"64c324a3c8b5a5a8b31f48f1"},{name:"Fashion Photography",slug:"fashion-photography",id:"64c324a3ea11fadfc1692102"},{name:"Food Photography",slug:"food-photography",id:"64c324a38561c58fd41ae133"},{name:"Interior Photography",slug:"interior-photography",id:"64c324a28e3559214f8ef399"},{name:"Landscape Photography",slug:"landscape-photography",id:"64c324a3eb00d38a83f494a1"},{name:"Portraiture",slug:"portraiture",id:"64c31e65906b099337c338cd"},{name:"Product Photography",slug:"product-photography",id:"64c324a3e743d0c2d6522ee7"},{name:"Sports Photography",slug:"sports-photography",id:"64c324a32af64bdc37a878ed"},{name:"Travel Photography",slug:"travel-photography",id:"64c324a3ee36f5991d7d4b0d"},{name:"Wedding Photography",slug:"wedding-photography",id:"64c324a216bbd436777da9b0"}],"performing-arts":[{name:"Circus",slug:"circus",id:"64c324a41e2d449f6822b34d"},{name:"Dance",slug:"dance",id:"64c31e6f998d40df52d0c0d2"},{name:"Dramaturgy",slug:"dramaturgy",id:"64c33dbaa9c56afb61758f2b"},{name:"Live Arts Production",slug:"live-arts-production",id:"64c324a589c8fd4d0e7f13f5"},{name:"Modelling",slug:"modelling",id:"64c324a4686438dbe448d594"},{name:"Music",slug:"music",id:"64c324a4761d2d11e129c57a"},{name:"Performance Art",slug:"performance-art",id:"64c324a4e743d0c2d6522fa1"},{name:"Playwriting",slug:"playwriting",id:"64c342694a697ccad200d2d8"},{name:"Projection",slug:"projection",id:"64c324a413204b77e3231064"},{name:"Set Design",slug:"set-design",id:"64c324a4ea11fadfc16926de"},{name:"Stage Acting",slug:"stage-acting",id:"64c324a416bbd436777db291"},{name:"Stage Direction",slug:"stage-direction",id:"64c33d6ad8c53bbeff0ad758"},{name:"Stage Lighting",slug:"stage-lighting",id:"64c324a413204b77e323105b"}],"cultural-work":[{name:"Academic Research",slug:"academic-research",id:"64c324a516bbd436777db338"},{name:"Art Therapy",slug:"art-therapy",id:"64c324a5ea11fadfc1692763"},{name:"Arts Management",slug:"arts-management",id:"64c324a5bbf8ad730a694e60"},{name:"Arts Promotion",slug:"arts-promotion",id:"64c324a5998d40df52d73c72"},{name:"Curation",slug:"curation",id:"64c324a5efe376c79c3f7c60"},{name:"Event Production",slug:"event-production",id:"64c324a5686438dbe448d693"},{name:"First Nations Custodianship",slug:"first-nations-custodianship",id:"64c3227ed94a307c093ebd3f"},{name:"Grant Writing",slug:"grant-writing",id:"64c324a5998d40df52d73caa"},{name:"Social Media",slug:"social-media",id:"64c324a598f9b23832273c36"},{name:"Socially Engaged Practice",slug:"socially-engaged-practice",id:"64c324a5761d2d11e129c625"}],"creative-education":[{name:"Dance Education",slug:"dance-education",id:"64c31e8ceb00d38a83edc555"},{name:"Drama Education",slug:"drama-education",id:"64c324a6c8b5a5a8b31f4e60"},{name:"Higher Degree Supervision",slug:"higher-degree-supervision",id:"64c324a613204b77e3231205"},{name:"Illustration Education",slug:"illustration-education",id:"64c324a698f9b23832273cac"},{name:"Music Education",slug:"music-education",id:"64c324a58e3559214f8ef632"},{name:"Photography Education",slug:"photography-education",id:"64c324a6bbf8ad730a694fbb"},{name:"Visual Arts Education",slug:"visual-arts-education",id:"64c324a6ee36f5991d7d4d50"},{name:"Writing Education",slug:"writing-education",id:"64c324a6efe376c79c3f7d46"}],publishing:[{name:"Copywriting",slug:"copywriting",id:"64c324a6686438dbe448d885"},{name:"Creative Writing",slug:"creative-writing",id:"64c31e97906b099337c36aa8"},{name:"Journalism",slug:"journalism",id:"64c324a7892f531f780edd4e"},{name:"Podcasting",slug:"podcasting",id:"64c324a7e743d0c2d6523397"},{name:"Poetry",slug:"poetry",id:"64c324a698f9b23832273cc9"},{name:"Proofreading",slug:"proofreading",id:"64c324a61f3ad42037ccb81a"},{name:"Technical Writing",slug:"technical-writing",id:"64c324a6e743d0c2d6523345"},{name:"Text Editing",slug:"text-editing",id:"64c324a7efe376c79c3f7f4f"}],"artisanal-products":[{name:"Beverages",slug:"beverages",id:"64c324a7eb00d38a83f4992a"},{name:"Food",slug:"food",id:"64c31ea2ea11fadfc162c4fc"},{name:"Homewares",slug:"homewares",id:"64c324a7892f531f780edd7c"},{name:"Skincare",slug:"skincare",id:"64c324a78561c58fd41ae32b"},{name:"Toys",slug:"toys",id:"64c324a7ee36f5991d7d4e61"}]};let g=null,c=[],S=!1;const O=`
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
    .mp-field-input {
      width: 100%;
      padding: 8px 12px;
      border: 2px solid #333;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
    }
    .mp-field-input:focus {
      outline: none;
      border-color: #555;
    }
    textarea.mp-field-input {
      min-height: 80px;
      resize: vertical;
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
    .mp-image-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .mp-image-upload {
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
    .mp-image-upload:hover {
      border-color: #333;
      background: #f5f5f5;
    }
    .mp-image-upload.has-image {
      border-style: solid;
      border-color: #ddd;
    }
    .mp-image-upload img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }
    .mp-image-upload .mp-upload-placeholder {
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    .mp-image-upload .mp-upload-placeholder span {
      display: block;
      font-size: 24px;
      margin-bottom: 4px;
    }
    .mp-image-upload .mp-remove-image {
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
    }
    .mp-image-upload.has-image .mp-remove-image {
      display: block;
    }
    .mp-image-upload.has-image .mp-upload-placeholder {
      display: none;
    }
    .mp-feature-image {
      grid-column: span 3;
      aspect-ratio: 16/9;
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
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .mp-images-display img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 4px;
    }
    .mp-images-display .mp-feature-thumb {
      grid-column: span 3;
      aspect-ratio: 16/9;
    }

    /* Migration UI Styles */
    .mp-migrate-container {
      font-family: inherit;
      max-width: 500px;
      padding: 24px;
      background: #f9f9f9;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      text-align: center;
    }
    .mp-migrate-container h3 {
      margin: 0 0 12px 0;
      font-size: 18px;
      color: #333;
    }
    .mp-migrate-container p {
      margin: 0 0 20px 0;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }
    .mp-migrate-btn {
      background: #007bff;
      color: #fff;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: background 0.2s;
    }
    .mp-migrate-btn:hover {
      background: #0056b3;
    }
    .mp-migrate-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .mp-migrate-countdown {
      margin-top: 16px;
      padding: 16px;
      background: #e8f4fc;
      border-radius: 4px;
      display: none;
    }
    .mp-migrate-countdown.visible {
      display: block;
    }
    .mp-migrate-countdown p {
      margin: 0;
      color: #007bff;
      font-weight: 500;
    }
    .mp-migrate-countdown .countdown-number {
      font-size: 24px;
      font-weight: 700;
    }
    .mp-migrate-success {
      color: #28a745;
    }
    .mp-migrate-error {
      color: #dc3545;
    }
  `,R=[{key:"project_description",label:"Project Description",type:"textarea"},{key:"external_link",label:"Project External Link",type:"url"},{key:"showreel_link",label:"Showreel Link",type:"video"},{key:"display_order",label:"Display Order",type:"number"}],W=[{key:"feature_image",label:"Feature Image"},{key:"image_1",label:"Image 1"},{key:"image_2",label:"Image 2"},{key:"image_3",label:"Image 3"},{key:"image_4",label:"Image 4"},{key:"image_5",label:"Image 5"}];function F(){return"proj_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}function N(){return new Promise(e=>{if(S){e();return}const t=document.createElement("script");t.src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js",t.onload=()=>{S=!0,e()},document.head.appendChild(t)})}function H(e){if(!window.uploadcare){console.error("Uploadcare not loaded");return}uploadcare.openDialog(null,{publicKey:T,imagesOnly:!0,crop:"free",imageShrink:"1920x1920"}).done(i=>{i.promise().done(a=>{e(a.cdnUrl)})})}function L(e){return!e||typeof e!="string"?"":e.replace(/[\r\n]+/g," ").replace(/[\x00-\x1F\x7F]/g,"").replace(/\s+/g," ").trim()}function B(e){if(!e||e.trim()==="")return"";let t=e.trim();/^https?:\/\//i.test(t)||(t="https://"+t);try{return new URL(t),t}catch{return""}}function P(e){if(!e||e.trim()==="")return!0;let t=e.trim();/^https?:\/\//i.test(t)||(t="https://"+t);try{return new URL(t),!0}catch{return!1}}function E(e){const t=e.querySelector("#mp-form-external_link"),i=e.querySelector("#mp-url-error");if(!t||!i)return;const a=()=>{const o=t.value.trim();o===""?(t.classList.remove("error","valid"),i.classList.remove("visible")):P(o)?(t.classList.remove("error"),t.classList.add("valid"),i.classList.remove("visible")):(t.classList.remove("valid"),t.classList.add("error"),i.classList.add("visible"))};t.addEventListener("blur",a),t.addEventListener("input",()=>{t.classList.contains("error")&&P(t.value)&&(t.classList.remove("error"),t.classList.add("valid"),i.classList.remove("visible"))}),t.value.trim()&&a()}async function C(e,t){const i=c.find(a=>a.id===e);if(!i)return console.error("Project not found:",e),!1;i.webflow_item_id=t;try{return await b(),console.log(`Updated project ${e} with Webflow ID: ${t}`),!0}catch(a){return console.error("Error saving Webflow ID:",a),!1}}window.updateProjectWebflowId=C;async function x(e,t){var n;const i=y[e];if(!i||i.includes("YOUR_ZAPIER"))return console.warn(`Webhook not configured for action: ${e}`),{success:!1,error:"Webhook not configured"};const a=((n=g.customFields)==null?void 0:n["webflow-member-id"])||"",o=(t.categories||[]).map(r=>`"${r}"`).join(","),s=B(t.external_link),l={action:e,project_id:t.id,webflow_item_id:t.webflow_item_id||"",member_webflow_id:a,memberstack_id:g.id,name:L(t.project_name),"project-description-editable":L(t.project_description||""),"project-external-link":s,"showreel-link":t.showreel_link||"","display-order":t.display_order||0,"portfolio-item-id":t.id,"memberstack-id":g.id,"category-ids":o,"feature-image":t.feature_image||"","add-image-one":t.image_1||"","add-image-two":t.image_2||"","add-image-three":t.image_3||"","add-image-four":t.image_4||"","add-image-five":t.image_5||"","has-feature-image":!!t.feature_image,"has-image-one":!!t.image_1,"has-image-two":!!t.image_2,"has-image-three":!!t.image_3,"has-image-four":!!t.image_4,"has-image-five":!!t.image_5,"has-external-link":!!s};console.log(`Sending ${e} webhook:`,l);try{const r=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l),mode:"no-cors"});return console.log(`Webhook ${e} sent successfully`),{success:!0}}catch(r){return console.error(`Webhook ${e} failed:`,r),{success:!1,error:r.message}}}function Y(){const e=document.querySelector(".migrate-projects");if(!e){console.log("No .migrate-projects container found");return}if(c.length>0){e.style.display="none";return}e.innerHTML=`
      <div class="mp-migrate-container">
        <h3>Migrate Your Existing Projects</h3>
        <p>If you have projects in the old system, click below to migrate them to your new portfolio manager.</p>
        <button class="mp-migrate-btn" id="mp-migrate-btn">Migrate My Projects</button>
        <div class="mp-migrate-countdown" id="mp-migrate-countdown">
          <p>Migration started! Refreshing in <span class="countdown-number" id="mp-countdown-number">10</span> seconds...</p>
        </div>
      </div>
    `;const t=e.querySelector("#mp-migrate-btn"),i=e.querySelector("#mp-migrate-countdown"),a=e.querySelector("#mp-countdown-number");t.addEventListener("click",async()=>{var o,s;t.disabled=!0,t.textContent="Starting migration...";try{const l=y.migrate;if(!l||l.includes("MIGRATE_WEBHOOK_ID"))throw new Error("Migration webhook not configured");const n={action:"migrate",memberstack_id:g.id,member_email:((o=g.auth)==null?void 0:o.email)||"",webflow_member_id:((s=g.customFields)==null?void 0:s["webflow-member-id"])||""};console.log("Sending migration webhook:",n),await fetch(l,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n),mode:"no-cors"}),t.textContent="Migration started!",i.classList.add("visible");let r=10;const d=setInterval(()=>{r--,a.textContent=r,r<=0&&(clearInterval(d),window.location.reload())},1e3)}catch(l){console.error("Migration error:",l),t.disabled=!1,t.textContent="Migration failed - Try again",t.classList.add("mp-migrate-error")}})}async function j(){var a;const e=document.querySelector(".vibe-test");if(!e){console.warn("Could not find .vibe-test container");return}const t=document.createElement("style");t.textContent=O,document.head.appendChild(t);const i=document.createElement("div");i.className="mp-container",i.innerHTML='<div class="mp-loading">Loading projects...</div>',e.appendChild(i);try{await N(),await V();const{data:o}=await window.$memberstackDom.getCurrentMember();if(!o){i.innerHTML='<div class="mp-loading">Please log in to view your projects.</div>';return}g=o,console.log("Current member:",g.id),console.log("Member Webflow ID:",(a=g.customFields)==null?void 0:a["webflow-member-id"]),await $();const s=new URLSearchParams(window.location.search),l=s.get("wf_project_id"),n=s.get("wf_item_id");if(l&&n){console.log("Received Webflow ID callback:",l,n),await C(l,n);const r=window.location.pathname;window.history.replaceState({},document.title,r)}h(i),Y()}catch(o){console.error("Error initializing member projects:",o),i.innerHTML='<div class="mp-loading">Error loading projects. Please refresh the page.</div>'}}function V(){return new Promise(e=>{if(window.$memberstackDom)e();else{const t=setInterval(()=>{window.$memberstackDom&&(clearInterval(t),e())},100)}})}async function $(){try{const{data:e}=await window.$memberstackDom.getMemberJSON();c=e&&e.projects||[],c.sort((t,i)=>(t.display_order||0)-(i.display_order||0)),console.log("Loaded projects:",c.length)}catch(e){console.error("Error loading projects:",e),c=[]}}async function b(){try{const{data:e}=await window.$memberstackDom.getMemberJSON(),t={...e,projects:c},i=await window.$memberstackDom.updateMemberJSON({json:t});console.log("Projects saved:",i)}catch(e){throw console.error("Error saving projects:",e),e}}function h(e){var l;if(c.length===0){e.innerHTML=`
        <div class="mp-empty">
          <p>You don't have any projects yet</p>
          <button class="mp-btn" id="mp-add-first">Add Your First Project</button>
          <div style="margin: 20px 0; color: #999; font-size: 14px;">— or —</div>
          <p style="font-size: 14px; color: #666; margin-bottom: 12px;">Have existing projects in your portfolio?</p>
          <button class="mp-btn mp-btn-secondary" id="mp-migrate-inline">Migrate My Projects</button>
          <div class="mp-migrate-countdown" id="mp-migrate-countdown-inline" style="margin-top: 16px; display: none;">
            <p style="color: #007bff; font-weight: 500;">Migration started! Refreshing in <span class="countdown-number" id="mp-countdown-inline">10</span> seconds...</p>
          </div>
        </div>
      `,e.querySelector("#mp-add-first").addEventListener("click",()=>z(e));const n=e.querySelector("#mp-migrate-inline"),r=e.querySelector("#mp-migrate-countdown-inline"),d=e.querySelector("#mp-countdown-inline");n.addEventListener("click",async()=>{var m,u;n.disabled=!0,n.textContent="Starting migration...";try{const p=y.migrate,f={action:"migrate",memberstack_id:g.id,member_email:((m=g.auth)==null?void 0:m.email)||"",webflow_member_id:((u=g.customFields)==null?void 0:u["webflow-member-id"])||""};console.log("Sending migration webhook:",f),await fetch(p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f),mode:"no-cors"}),n.textContent="Migration started!",r.style.display="block";let w=10;const Z=setInterval(()=>{w--,d.textContent=w,w<=0&&(clearInterval(Z),window.location.reload())},1e3)}catch(p){console.error("Migration error:",p),n.disabled=!1,n.textContent="Migration failed - Try again"}});return}const t=(l=g==null?void 0:g.customFields)==null?void 0:l["membership-type"],i=_(t),o=i-c.length<=0;let s=`
      <div class="mp-header">
        <h2>My Projects</h2>
        <div class="mp-header-right">
          <span class="mp-project-count">${c.length} of ${i} projects</span>
          <button class="mp-btn ${o?"mp-btn-disabled":""}" id="mp-add-project" ${o?"disabled":""}>
            ${o?"Limit Reached":"Add Another Project"}
          </button>
        </div>
      </div>
      <div class="mp-projects-list">
    `;c.forEach((n,r)=>{s+=G(n)}),s+="</div>",e.innerHTML=s,e.querySelector("#mp-add-project").addEventListener("click",()=>{var d;const n=(d=g==null?void 0:g.customFields)==null?void 0:d["membership-type"],r=_(n);if(c.length>=r){K(r,n);return}z(e)}),e.querySelectorAll(".mp-project-card").forEach((n,r)=>{const d=c[r];J(n,d,e)})}function q(e){for(const t in v){const i=v[t].find(a=>a.id===e);if(i)return i.name}return e}function G(e,t){let i="";R.forEach(s=>{const l=e[s.key]||"";i+=`
        <div class="mp-field" data-field="${s.key}">
          <div class="mp-field-label">${s.label}</div>
          <div class="mp-field-value ${l?"":"empty"}" data-type="${s.type}">
            ${l||"Click to add..."}
          </div>
        </div>
      `});const a=e.categories||[];return i+=`
      <div class="mp-field">
        <div class="mp-field-label">Categories</div>
        <div class="mp-categories-display">
          ${a.length>0?a.map(s=>`<span class="mp-category-tag">${q(s)}</span>`).join(""):'<span class="mp-field-value empty">Click Edit to add categories...</span>'}
        </div>
      </div>
    `,(e.feature_image||e.image_1||e.image_2||e.image_3||e.image_4||e.image_5)&&(i+=`
        <div class="mp-field">
          <div class="mp-field-label">Images</div>
          <div class="mp-images-display">
            ${e.feature_image?`<img src="${e.feature_image}" class="mp-feature-thumb" alt="Feature">`:""}
            ${e.image_1?`<img src="${e.image_1}" alt="Image 1">`:""}
            ${e.image_2?`<img src="${e.image_2}" alt="Image 2">`:""}
            ${e.image_3?`<img src="${e.image_3}" alt="Image 3">`:""}
            ${e.image_4?`<img src="${e.image_4}" alt="Image 4">`:""}
            ${e.image_5?`<img src="${e.image_5}" alt="Image 5">`:""}
          </div>
        </div>
      `),`
      <div class="mp-project-card" data-project-id="${e.id}">
        <div class="mp-project-header">
          <div class="mp-project-header-left mp-toggle-details">
            <span class="mp-toggle-icon">&#9654;</span>
            <h3 class="mp-project-title">${e.project_name||"Untitled Project"}</h3>
          </div>
          <div class="mp-project-header-actions">
            <button class="mp-btn mp-btn-secondary mp-btn-small mp-edit-btn">Edit</button>
            <button class="mp-btn mp-btn-danger mp-btn-small mp-delete-btn">Delete</button>
          </div>
        </div>
        <div class="mp-project-content">
          <div class="mp-project-fields">
            ${i}
          </div>
        </div>
      </div>
    `}function J(e,t,i){const a=e.querySelector(".mp-project-content"),o=e.querySelector(".mp-toggle-details"),s=e.querySelector(".mp-toggle-icon"),l=e.querySelector(".mp-edit-btn"),n=e.querySelector(".mp-delete-btn");o.addEventListener("click",r=>{r.stopPropagation();const d=a.classList.toggle("open");s.classList.toggle("open",d)}),l.addEventListener("click",r=>{r.stopPropagation(),X(t,i)}),n.addEventListener("click",async()=>{if(confirm("Are you sure you want to delete this project?")){n.disabled=!0,n.textContent="Deleting...";try{await $();const r=c.find(d=>d.id===t.id);r?(await x("delete",r),c=c.filter(d=>d.id!==t.id)):c=c.filter(d=>d.id!==t.id),await b(),h(i)}catch(r){console.error("Error deleting project:",r),alert("Error deleting project. Please try again."),n.disabled=!1,n.textContent="Delete Project"}}})}function I(e=[]){let t=`
      <div class="mp-category-section">
        <h4>Choose Project Categories</h4>
        <p style="font-size: 12px; color: #666; margin: 0 0 12px 0;">Select a category to see subcategories. You can choose from multiple categories.</p>
        <div class="mp-parent-categories">
    `;return k.forEach(i=>{t+=`<button type="button" class="mp-parent-btn" data-parent="${i.slug}">${i.name}</button>`}),t+="</div>",k.forEach(i=>{const a=v[i.slug]||[];t+=`<div class="mp-child-categories" data-parent="${i.slug}">`,a.forEach(o=>{const s=e.includes(o.id);t+=`<button type="button" class="mp-child-btn ${s?"selected":""}" data-id="${o.id}">${o.name}</button>`}),t+="</div>"}),t+=`
        <div class="mp-selected-categories" style="${e.length?"":"display: none;"}">
          <h5>Selected Categories</h5>
          <div class="mp-selected-list"></div>
        </div>
      </div>
    `,t}function D(e={}){return`
      <div class="mp-image-section">
        <h4>Project Images</h4>
        <div class="mp-image-grid">
          <div class="mp-image-upload mp-feature-image ${e.feature_image?"has-image":""}" data-field="feature_image">
            ${e.feature_image?`<img src="${e.feature_image}" alt="Feature">`:""}
            <div class="mp-upload-placeholder"><span>+</span>Feature Image</div>
            <button type="button" class="mp-remove-image">&times;</button>
          </div>
          ${W.slice(1).map(t=>`
            <div class="mp-image-upload ${e[t.key]?"has-image":""}" data-field="${t.key}">
              ${e[t.key]?`<img src="${e[t.key]}" alt="${t.label}">`:""}
              <div class="mp-upload-placeholder"><span>+</span>${t.label}</div>
              <button type="button" class="mp-remove-image">&times;</button>
            </div>
          `).join("")}
        </div>
      </div>
    `}function M(e,t,i){const a=e.querySelectorAll(".mp-parent-btn"),o=e.querySelectorAll(".mp-child-categories"),s=e.querySelector(".mp-selected-list"),l=e.querySelector(".mp-selected-categories");function n(){s.innerHTML=t.map(r=>`<span class="mp-selected-tag">${q(r)}<button type="button" data-id="${r}">&times;</button></span>`).join(""),l.style.display=t.length?"":"none",e.querySelectorAll(".mp-child-btn").forEach(r=>{r.classList.toggle("selected",t.includes(r.dataset.id))})}a.forEach(r=>{r.addEventListener("click",()=>{const d=r.dataset.parent,m=r.classList.contains("active");a.forEach(u=>u.classList.remove("active")),o.forEach(u=>u.classList.remove("visible")),m||(r.classList.add("active"),e.querySelector(`.mp-child-categories[data-parent="${d}"]`).classList.add("visible"))})}),e.querySelectorAll(".mp-child-btn").forEach(r=>{r.addEventListener("click",()=>{const d=r.dataset.id,m=t.indexOf(d);m>-1?t.splice(m,1):t.push(d),n()})}),s.addEventListener("click",r=>{if(r.target.tagName==="BUTTON"){const d=r.target.dataset.id,m=t.indexOf(d);m>-1&&(t.splice(m,1),n())}}),n()}function A(e,t,i){e.querySelectorAll(".mp-image-upload").forEach(a=>{const o=a.dataset.field;a.addEventListener("click",s=>{if(s.target.classList.contains("mp-remove-image")){s.stopPropagation(),t[o]="",a.classList.remove("has-image");const l=a.querySelector("img");l&&l.remove(),a.querySelector(".mp-upload-placeholder").style.display="";return}H(l=>{t[o]=l,a.classList.add("has-image");let n=a.querySelector("img");n||(n=document.createElement("img"),a.insertBefore(n,a.firstChild)),n.src=l,n.alt=o})})})}function K(e,t){const i=t?t.replace(/-/g," ").replace(/\b\w/g,o=>o.toUpperCase()):"your membership",a=document.createElement("div");a.className="mp-modal-overlay",a.innerHTML=`
      <div class="mp-modal" style="max-width: 450px;">
        <div class="mp-modal-header">
          <h3>Project Limit Reached</h3>
        </div>
        <div class="mp-modal-body" style="text-align: center; padding: 30px;">
          <p style="margin-bottom: 16px; font-size: 16px;">
            You've reached the maximum of <strong>${e} projects</strong> for ${i} members.
          </p>
          <p style="margin-bottom: 0; color: #666;">
            To add a new project, please delete an existing one or consider upgrading your membership.
          </p>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn" id="mp-modal-close">Got it</button>
        </div>
      </div>
    `,document.body.appendChild(a),a.querySelector("#mp-modal-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",o=>{o.target===a&&a.remove()})}function z(e){const t=[],i={},a=document.createElement("div");a.className="mp-modal-overlay",a.innerHTML=`
      <div class="mp-modal">
        <div class="mp-modal-header">
          <h3>Add New Project</h3>
        </div>
        <div class="mp-modal-body">
          <div class="mp-form-field">
            <label>Project Name <span>*</span></label>
            <input type="text" class="mp-form-input" id="mp-form-project_name" required>
          </div>
          <div class="mp-form-field">
            <label>Project Description <span>*</span></label>
            <textarea class="mp-form-input" id="mp-form-project_description"></textarea>
            <div class="mp-input-hint">Minimum 50 words required (<span id="mp-word-count">0</span> words)</div>
            <div class="mp-input-error" id="mp-description-error">Please enter at least 50 words</div>
          </div>

          ${I(t)}
          ${D(i)}

          <div class="mp-form-field">
            <label>Showreel Link</label>
            <input type="text" class="mp-form-input" id="mp-form-showreel_link" placeholder="https://youtube.com/watch?v=... or https://vimeo.com/...">
            <div class="mp-input-hint">YouTube or Vimeo URL only</div>
            <div class="mp-input-error" id="mp-video-error">Please enter a valid YouTube or Vimeo URL</div>
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
    `,document.body.appendChild(a),M(a,t),A(a,i);const o=a.querySelector("#mp-form-project_description"),s=a.querySelector("#mp-word-count"),l=()=>{const r=o.value.trim(),d=r?r.split(/\s+/).filter(m=>m.length>0).length:0;s.textContent=d,s.style.color=d>=50?"#28a745":"#666",a.querySelector("#mp-description-error").style.display="none"};o.addEventListener("input",l),l(),a.addEventListener("click",r=>{r.target===a&&a.remove()}),a.querySelector("#mp-modal-cancel").addEventListener("click",()=>a.remove());const n=a.querySelector("#mp-modal-save");n.addEventListener("click",async()=>{const r=a.querySelector("#mp-form-project_name").value.trim(),d=a.querySelector("#mp-form-project_description").value.trim(),m=d?d.split(/\s+/).filter(p=>p.length>0).length:0;if(!r){alert("Project name is required");return}if(m<50){const p=a.querySelector("#mp-description-error");p&&(p.style.display="block"),a.querySelector("#mp-form-project_description").focus();return}n.disabled=!0,n.textContent="Creating...";const u={id:F(),project_name:r,project_description:a.querySelector("#mp-form-project_description").value,external_link:a.querySelector("#mp-form-external_link").value,showreel_link:a.querySelector("#mp-form-showreel_link").value,display_order:parseInt(a.querySelector("#mp-form-display_order").value)||0,categories:[...t],feature_image:i.feature_image||"",image_1:i.image_1||"",image_2:i.image_2||"",image_3:i.image_3||"",image_4:i.image_4||"",image_5:i.image_5||"",created_at:new Date().toISOString()};try{c.push(u),c.sort((p,f)=>(p.display_order||0)-(f.display_order||0)),await b(),await x("create",u),a.remove(),h(e)}catch(p){console.error("Error creating project:",p),c.pop(),alert("Error creating project. Please try again."),n.disabled=!1,n.textContent="Create Project"}}),a.querySelector("#mp-form-project_name").focus(),E(a)}function X(e,t){const i=[...e.categories||[]],a={feature_image:e.feature_image||"",image_1:e.image_1||"",image_2:e.image_2||"",image_3:e.image_3||"",image_4:e.image_4||"",image_5:e.image_5||""},o=document.createElement("div");o.className="mp-modal-overlay",o.innerHTML=`
      <div class="mp-modal">
        <div class="mp-modal-header">
          <h3>Edit Project</h3>
        </div>
        <div class="mp-modal-body">
          <div class="mp-form-field">
            <label>Project Name <span>*</span></label>
            <input type="text" class="mp-form-input" id="mp-form-project_name" value="${e.project_name||""}" required>
          </div>
          <div class="mp-form-field">
            <label>Project Description <span>*</span></label>
            <textarea class="mp-form-input" id="mp-form-project_description">${e.project_description||""}</textarea>
            <div class="mp-input-hint">Minimum 50 words required (<span id="mp-word-count">0</span> words)</div>
            <div class="mp-input-error" id="mp-description-error">Please enter at least 50 words</div>
          </div>

          ${I(i)}
          ${D(a)}

          <div class="mp-form-field">
            <label>Showreel Link</label>
            <input type="text" class="mp-form-input" id="mp-form-showreel_link" value="${e.showreel_link||""}" placeholder="https://youtube.com/watch?v=... or https://vimeo.com/...">
            <div class="mp-input-hint">YouTube or Vimeo URL only</div>
            <div class="mp-input-error" id="mp-video-error">Please enter a valid YouTube or Vimeo URL</div>
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
    `,document.body.appendChild(o),M(o,i),A(o,a),E(o);const s=o.querySelector("#mp-form-project_description"),l=o.querySelector("#mp-word-count"),n=()=>{const d=s.value.trim(),m=d?d.split(/\s+/).filter(u=>u.length>0).length:0;l.textContent=m,l.style.color=m>=50?"#28a745":"#666",o.querySelector("#mp-description-error").style.display="none"};s.addEventListener("input",n),n(),o.addEventListener("click",d=>{d.target===o&&o.remove()}),o.querySelector("#mp-modal-cancel").addEventListener("click",()=>o.remove());const r=o.querySelector("#mp-modal-save");r.addEventListener("click",async()=>{const d=o.querySelector("#mp-form-project_name").value.trim(),m=o.querySelector("#mp-form-project_description").value.trim(),u=m?m.split(/\s+/).filter(p=>p.length>0).length:0;if(!d){alert("Project name is required");return}if(u<50){const p=o.querySelector("#mp-description-error");p&&(p.style.display="block"),o.querySelector("#mp-form-project_description").focus();return}r.disabled=!0,r.textContent="Saving...",e.project_name=d,e.project_description=m,e.external_link=o.querySelector("#mp-form-external_link").value,e.showreel_link=o.querySelector("#mp-form-showreel_link").value,e.display_order=parseInt(o.querySelector("#mp-form-display_order").value)||0,e.categories=[...i],e.feature_image=a.feature_image,e.image_1=a.image_1,e.image_2=a.image_2,e.image_3=a.image_3,e.image_4=a.image_4,e.image_5=a.image_5;try{c.sort((p,f)=>(p.display_order||0)-(f.display_order||0)),await b(),await x("update",e),o.remove(),h(t)}catch(p){console.error("Error updating project:",p),alert("Error updating project. Please try again."),r.disabled=!1,r.textContent="Save Changes"}})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",j):j()})();
