// Member Projects Script
// Displays, creates, edits, and deletes member projects using Memberstack JSON data
// Syncs to Webflow CMS via Zapier webhooks
// Includes Uploadcare for image uploads and category selection

(function() {
  console.log('Member projects script loaded');

  // ============================================
  // CONFIGURATION
  // ============================================
  const WEBHOOKS = {
    create: 'https://hooks.zapier.com/hooks/catch/20216239/uqpimju/',
    update: 'https://hooks.zapier.com/hooks/catch/20216239/uqpiw8v/',
    delete: 'https://hooks.zapier.com/hooks/catch/20216239/uqps33w/',
    migrate: 'https://hooks.zapier.com/hooks/catch/20216239/ulh6cmr/'
  };

  const UPLOADCARE_PUBLIC_KEY = '4ab46fc683f9c002ae8b';

  // Project limits by membership type
  const PROJECT_LIMITS = {
    'emerging': 2,
    'professional': 5,
    'small-business': 5,
    'not-for-profit': 5,
    'large-business': 8,
    'spaces-suppliers': 5  // default for this type
  };

  // Get project limit for a membership type
  function getProjectLimit(membershipType) {
    if (!membershipType) return 2; // default to emerging limit
    const type = membershipType.toLowerCase();
    return PROJECT_LIMITS[type] || 2;
  }

  // Category data - Parent directories
  const PARENT_CATEGORIES = [
    { name: 'Screen', slug: 'screen', id: '64ad5d25b6907c1bed526490' },
    { name: 'Visual Art', slug: 'visual-arts', id: '64ad5d2856cac56795029d2a' },
    { name: 'Design', slug: 'design', id: '64ad5d2dde2ea6eeaeb94003' },
    { name: 'Craft', slug: 'craft', id: '64ad5d31bf826ce4810f9b7a' },
    { name: 'Photography', slug: 'photography', id: '64ad5d37ab90d652594a17a8' },
    { name: 'Performing Arts', slug: 'performing-arts', id: '64ad5d3fde2ea6eeaeb95c9e' },
    { name: 'Cultural Work', slug: 'cultural-work', id: '64bfaf6a75299ea8759488fc' },
    { name: 'Creative Education', slug: 'creative-education', id: '64ad5d4b9a1e0e4717405adb' },
    { name: 'Publishing', slug: 'publishing', id: '64ad5d519e2a54f5aab831aa' },
    { name: 'Artisanal Products', slug: 'artisanal-products', id: '64ad5d5fff882df891ead372' }
  ];

  // Child categories grouped by parent slug
  const CHILD_CATEGORIES = {
    'screen': [
      { name: 'Animation', slug: 'animation', id: '64c32280ee36f5991d7b1952' },
      { name: 'Art Department', slug: 'art-department', id: '64c3228098f9b23832250411' },
      { name: 'Camera Operator', slug: 'camera-operator', id: '64c33e675e7e936176992daa' },
      { name: 'Cinematography', slug: 'cinematography', id: '64c31da3ee36f5991d75f179' },
      { name: 'Costume Design', slug: 'costume-design', id: '64c33ecb3c3e613167c5af80' },
      { name: 'Drone', slug: 'drone', id: '64c32280906b099337c72dd6' },
      { name: 'Location Scouting', slug: 'location-scouting', id: '64c322808561c58fd418867c' },
      { name: 'Post Production', slug: 'post-production', id: '64c32280ee36f5991d7b1928' },
      { name: 'Screen Acting', slug: 'screen-acting', id: '64c3227f1f3ad42037ca0282' },
      { name: 'Screen Direction', slug: 'screen-direction', id: '64c3227fea11fadfc1668683' },
      { name: 'Screen Editing', slug: 'screen-editing', id: '64c31dcf8561c58fd4138bfd' },
      { name: 'Screen Production', slug: 'screen-production', id: '64c322808e3559214f8c9fee' },
      { name: 'Screen Services', slug: 'screen-services', id: '64c3228016bbd436777b7429' },
      { name: 'Screen Writing', slug: 'screen-writing', id: '64c3227fe743d0c2d65012d2' },
      { name: 'Soundtrack', slug: 'soundtrack', id: '64c322808561c58fd41885e9' },
      { name: 'Videography', slug: 'videography', id: '64c3228089c8fd4d0e7cb947' }
    ],
    'visual-arts': [
      { name: 'Installation Art', slug: 'installation-art', id: '64c324a2892f531f780ed838' },
      { name: 'Interactive Art', slug: 'interactive-art', id: '64c337e9723e82f68fdcdbb8' },
      { name: 'Land Art', slug: 'land-art', id: '64c324a2761d2d11e129c478' },
      { name: 'Painting', slug: 'painting', id: '64c31e58892f531f780882ca' },
      { name: 'Photomedia', slug: 'photomedia', id: '64c324a18561c58fd41ae093' },
      { name: 'Printmedia', slug: 'printmedia', id: '64c324a14e1c7df81c3a7ac8' },
      { name: 'Public Art', slug: 'public-art', id: '64c324a24e1c7df81c3a7b5e' },
      { name: 'Sculpture', slug: 'sculpture', id: '64c324a1761d2d11e129c3f4' },
      { name: 'Sound Art', slug: 'sound-art', id: '64c324a2eb00d38a83f49380' },
      { name: 'Street Art', slug: 'street-art', id: '64c337b9723e82f68fdcb311' },
      { name: 'Textile Art', slug: 'textile-art', id: '64c324a21e2d449f6822b228' },
      { name: 'Video Art', slug: 'video-art', id: '64c324a2c8b5a5a8b31f4837' }
    ],
    'design': [
      { name: 'Architecture', slug: 'architecture', id: '64c322813b98e1ea07e8db25' },
      { name: 'Fabric Design', slug: 'fabric-design', id: '64c32281ea11fadfc16688ac' },
      { name: 'Fashion Design', slug: 'fashion-design', id: '64c32281686438dbe444b876' },
      { name: 'Furniture Design', slug: 'furniture-design', id: '64c322813b98e1ea07e8dae6' },
      { name: 'Game Design', slug: 'game-design', id: '64c3228298f9b238322506fa' },
      { name: 'Graphic Design', slug: 'graphic-design', id: '64c31e418e3559214f884254' },
      { name: 'Illustration', slug: 'illustration', id: '64c32281906b099337c72e36' },
      { name: 'Industrial Design', slug: 'industrial-design', id: '64c32281906b099337c72ed7' },
      { name: 'Interior Design', slug: 'interior-design', id: '64c32282efe376c79c3cf4dd' },
      { name: 'Landscape Design', slug: 'landscape-design', id: '64c32281e743d0c2d6501b23' },
      { name: 'Lighting Design', slug: 'lighting-design', id: '64c32282ee36f5991d7b1ccd' },
      { name: 'Murals', slug: 'murals', id: '64c322821f3ad42037ca043d' },
      { name: 'Signwriting', slug: 'signwriting', id: '64c322821e2d449f68203f5b' },
      { name: 'Sound Design', slug: 'sound-design', id: '64c32282686438dbe444b955' },
      { name: 'Website Design', slug: 'website-design', id: '64c322818e3559214f8ca311' }
    ],
    'craft': [
      { name: 'Ceramics', slug: 'ceramics', id: '64c31e4a1f3ad42037c53e42' },
      { name: 'Floristry', slug: 'floristry', id: '64c324a1ea11fadfc1691bac' },
      { name: 'Glass', slug: 'glass', id: '64c340b8723e82f68fe423ef' },
      { name: 'Jewellery', slug: 'jewellery', id: '64c324a116bbd436777da24a' },
      { name: 'Leather', slug: 'leather', id: '64c324a013204b77e3230c47' },
      { name: 'Metal', slug: 'metal', id: '64c324a1ea11fadfc1691bfa' },
      { name: 'Millenary', slug: 'millenary', id: '64c324a198f9b238322737d3' },
      { name: 'Paper', slug: 'paper', id: '64c324a113204b77e3230c68' },
      { name: 'Textiles', slug: 'textiles', id: '64c324a1ea11fadfc1691bf3' },
      { name: 'Wood', slug: 'wood', id: '64c324a08e3559214f8ef2ce' }
    ],
    'photography': [
      { name: 'Aerial Photography', slug: 'aerial-photography', id: '64c324a3e743d0c2d6522f5a' },
      { name: 'Animal Photography', slug: 'animal-photography', id: '64c324a489c8fd4d0e7f1320' },
      { name: 'Event Photography', slug: 'event-photography', id: '64c324a3c8b5a5a8b31f48f1' },
      { name: 'Fashion Photography', slug: 'fashion-photography', id: '64c324a3ea11fadfc1692102' },
      { name: 'Food Photography', slug: 'food-photography', id: '64c324a38561c58fd41ae133' },
      { name: 'Interior Photography', slug: 'interior-photography', id: '64c324a28e3559214f8ef399' },
      { name: 'Landscape Photography', slug: 'landscape-photography', id: '64c324a3eb00d38a83f494a1' },
      { name: 'Portraiture', slug: 'portraiture', id: '64c31e65906b099337c338cd' },
      { name: 'Product Photography', slug: 'product-photography', id: '64c324a3e743d0c2d6522ee7' },
      { name: 'Sports Photography', slug: 'sports-photography', id: '64c324a32af64bdc37a878ed' },
      { name: 'Travel Photography', slug: 'travel-photography', id: '64c324a3ee36f5991d7d4b0d' },
      { name: 'Wedding Photography', slug: 'wedding-photography', id: '64c324a216bbd436777da9b0' }
    ],
    'performing-arts': [
      { name: 'Circus', slug: 'circus', id: '64c324a41e2d449f6822b34d' },
      { name: 'Dance', slug: 'dance', id: '64c31e6f998d40df52d0c0d2' },
      { name: 'Dramaturgy', slug: 'dramaturgy', id: '64c33dbaa9c56afb61758f2b' },
      { name: 'Live Arts Production', slug: 'live-arts-production', id: '64c324a589c8fd4d0e7f13f5' },
      { name: 'Modelling', slug: 'modelling', id: '64c324a4686438dbe448d594' },
      { name: 'Music', slug: 'music', id: '64c324a4761d2d11e129c57a' },
      { name: 'Performance Art', slug: 'performance-art', id: '64c324a4e743d0c2d6522fa1' },
      { name: 'Playwriting', slug: 'playwriting', id: '64c342694a697ccad200d2d8' },
      { name: 'Projection', slug: 'projection', id: '64c324a413204b77e3231064' },
      { name: 'Set Design', slug: 'set-design', id: '64c324a4ea11fadfc16926de' },
      { name: 'Stage Acting', slug: 'stage-acting', id: '64c324a416bbd436777db291' },
      { name: 'Stage Direction', slug: 'stage-direction', id: '64c33d6ad8c53bbeff0ad758' },
      { name: 'Stage Lighting', slug: 'stage-lighting', id: '64c324a413204b77e323105b' }
    ],
    'cultural-work': [
      { name: 'Academic Research', slug: 'academic-research', id: '64c324a516bbd436777db338' },
      { name: 'Art Therapy', slug: 'art-therapy', id: '64c324a5ea11fadfc1692763' },
      { name: 'Arts Management', slug: 'arts-management', id: '64c324a5bbf8ad730a694e60' },
      { name: 'Arts Promotion', slug: 'arts-promotion', id: '64c324a5998d40df52d73c72' },
      { name: 'Curation', slug: 'curation', id: '64c324a5efe376c79c3f7c60' },
      { name: 'Event Production', slug: 'event-production', id: '64c324a5686438dbe448d693' },
      { name: 'First Nations Custodianship', slug: 'first-nations-custodianship', id: '64c3227ed94a307c093ebd3f' },
      { name: 'Grant Writing', slug: 'grant-writing', id: '64c324a5998d40df52d73caa' },
      { name: 'Social Media', slug: 'social-media', id: '64c324a598f9b23832273c36' },
      { name: 'Socially Engaged Practice', slug: 'socially-engaged-practice', id: '64c324a5761d2d11e129c625' }
    ],
    'creative-education': [
      { name: 'Dance Education', slug: 'dance-education', id: '64c31e8ceb00d38a83edc555' },
      { name: 'Drama Education', slug: 'drama-education', id: '64c324a6c8b5a5a8b31f4e60' },
      { name: 'Higher Degree Supervision', slug: 'higher-degree-supervision', id: '64c324a613204b77e3231205' },
      { name: 'Illustration Education', slug: 'illustration-education', id: '64c324a698f9b23832273cac' },
      { name: 'Music Education', slug: 'music-education', id: '64c324a58e3559214f8ef632' },
      { name: 'Photography Education', slug: 'photography-education', id: '64c324a6bbf8ad730a694fbb' },
      { name: 'Visual Arts Education', slug: 'visual-arts-education', id: '64c324a6ee36f5991d7d4d50' },
      { name: 'Writing Education', slug: 'writing-education', id: '64c324a6efe376c79c3f7d46' }
    ],
    'publishing': [
      { name: 'Copywriting', slug: 'copywriting', id: '64c324a6686438dbe448d885' },
      { name: 'Creative Writing', slug: 'creative-writing', id: '64c31e97906b099337c36aa8' },
      { name: 'Journalism', slug: 'journalism', id: '64c324a7892f531f780edd4e' },
      { name: 'Podcasting', slug: 'podcasting', id: '64c324a7e743d0c2d6523397' },
      { name: 'Poetry', slug: 'poetry', id: '64c324a698f9b23832273cc9' },
      { name: 'Proofreading', slug: 'proofreading', id: '64c324a61f3ad42037ccb81a' },
      { name: 'Technical Writing', slug: 'technical-writing', id: '64c324a6e743d0c2d6523345' },
      { name: 'Text Editing', slug: 'text-editing', id: '64c324a7efe376c79c3f7f4f' }
    ],
    'artisanal-products': [
      { name: 'Beverages', slug: 'beverages', id: '64c324a7eb00d38a83f4992a' },
      { name: 'Food', slug: 'food', id: '64c31ea2ea11fadfc162c4fc' },
      { name: 'Homewares', slug: 'homewares', id: '64c324a7892f531f780edd7c' },
      { name: 'Skincare', slug: 'skincare', id: '64c324a78561c58fd41ae32b' },
      { name: 'Toys', slug: 'toys', id: '64c324a7ee36f5991d7d4e61' }
    ]
  };

  let currentMember = null;
  let projects = [];
  let uploadcareLoaded = false;

  // Styles
  const styles = `
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
  `;

  // Text field definitions
  const TEXT_FIELDS = [
    { key: 'project_description', label: 'Project Description', type: 'textarea' },
    { key: 'external_link', label: 'Project External Link', type: 'url' },
    { key: 'showreel_link', label: 'Showreel Link', type: 'video' },
    { key: 'display_order', label: 'Display Order', type: 'number' }
  ];

  // Image field definitions
  const IMAGE_FIELDS = [
    { key: 'feature_image', label: 'Feature Image' },
    { key: 'image_1', label: 'Image 1' },
    { key: 'image_2', label: 'Image 2' },
    { key: 'image_3', label: 'Image 3' },
    { key: 'image_4', label: 'Image 4' },
    { key: 'image_5', label: 'Image 5' }
  ];

  // Generate unique ID
  function generateId() {
    return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Load Uploadcare script
  function loadUploadcare() {
    return new Promise((resolve) => {
      if (uploadcareLoaded) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js';
      script.onload = () => {
        uploadcareLoaded = true;
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  // Open Uploadcare dialog
  function openImageUpload(callback) {
    if (!window.uploadcare) {
      console.error('Uploadcare not loaded');
      return;
    }

    const dialog = uploadcare.openDialog(null, {
      publicKey: UPLOADCARE_PUBLIC_KEY,
      imagesOnly: true,
      crop: 'free',
      imageShrink: '1920x1920'
    });

    dialog.done((file) => {
      file.promise().done((fileInfo) => {
        callback(fileInfo.cdnUrl);
      });
    });
  }

  // Sanitize text for JSON/API compatibility
  // Removes control characters, normalizes whitespace, and ensures clean text
  function sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      // Replace line breaks with spaces
      .replace(/[\r\n]+/g, ' ')
      // Remove control characters (except space)
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Normalize multiple spaces to single space
      .replace(/\s+/g, ' ')
      // Trim leading/trailing whitespace
      .trim();
  }

  // Format URL for Webflow Link field
  function formatUrl(url) {
    if (!url || url.trim() === '') return '';
    let formatted = url.trim();
    // Add https:// if no protocol specified
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted;
    }
    // Basic URL validation
    try {
      new URL(formatted);
      return formatted;
    } catch {
      return ''; // Return empty if invalid
    }
  }

  // Validate URL and show error/success state
  function isValidUrl(url) {
    if (!url || url.trim() === '') return true; // Empty is OK (field is optional)
    let testUrl = url.trim();
    if (!/^https?:\/\//i.test(testUrl)) {
      testUrl = 'https://' + testUrl;
    }
    try {
      new URL(testUrl);
      return true;
    } catch {
      return false;
    }
  }

  // Setup URL validation on external link input
  function setupUrlValidation(container) {
    const input = container.querySelector('#mp-form-external_link');
    const errorMsg = container.querySelector('#mp-url-error');
    if (!input || !errorMsg) return;

    const validate = () => {
      const value = input.value.trim();
      if (value === '') {
        // Empty is fine, remove all states
        input.classList.remove('error', 'valid');
        errorMsg.classList.remove('visible');
      } else if (isValidUrl(value)) {
        input.classList.remove('error');
        input.classList.add('valid');
        errorMsg.classList.remove('visible');
      } else {
        input.classList.remove('valid');
        input.classList.add('error');
        errorMsg.classList.add('visible');
      }
    };

    input.addEventListener('blur', validate);
    input.addEventListener('input', () => {
      // Only remove error state while typing, don't show new errors until blur
      if (input.classList.contains('error') && isValidUrl(input.value)) {
        input.classList.remove('error');
        input.classList.add('valid');
        errorMsg.classList.remove('visible');
      }
    });

    // Validate on load if there's an existing value
    if (input.value.trim()) {
      validate();
    }
  }

  // Update a project with its Webflow Item ID (called after Zapier creates the item)
  // This can be triggered via URL parameter or called externally
  async function updateProjectWebflowId(projectId, webflowItemId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      console.error('Project not found:', projectId);
      return false;
    }

    project.webflow_item_id = webflowItemId;

    try {
      await saveProjects();
      console.log(`Updated project ${projectId} with Webflow ID: ${webflowItemId}`);
      return true;
    } catch (error) {
      console.error('Error saving Webflow ID:', error);
      return false;
    }
  }

  // Expose function globally for external calls (e.g., from Zapier webhook response)
  window.updateProjectWebflowId = updateProjectWebflowId;

  // Send webhook to Zapier
  async function sendWebhook(action, project) {
    const webhookUrl = WEBHOOKS[action];

    if (!webhookUrl || webhookUrl.includes('YOUR_ZAPIER')) {
      console.warn(`Webhook not configured for action: ${action}`);
      return { success: false, error: 'Webhook not configured' };
    }

    // Get member's Webflow ID from custom fields
    const memberWebflowId = currentMember.customFields?.['webflow-member-id'] || '';

    // Format category IDs as comma-separated quoted string for Webflow v2 multi-reference
    const categoryIds = (project.categories || []).map(id => `"${id}"`).join(',');

    // Format external link
    const externalLink = formatUrl(project.external_link);

    const payload = {
      action: action,
      project_id: project.id,
      webflow_item_id: project.webflow_item_id || '',
      member_webflow_id: memberWebflowId,
      memberstack_id: currentMember.id,
      // Project fields mapped to Webflow field names (sanitized for API compatibility)
      name: sanitizeText(project.project_name),
      'project-description-editable': sanitizeText(project.project_description || ''),
      'project-external-link': externalLink,
      'showreel-link': project.showreel_link || '',
      'display-order': project.display_order || 0,
      'portfolio-item-id': project.id,
      'memberstack-id': currentMember.id,
      // Categories (multi-reference IDs)
      'category-ids': categoryIds,
      // Images (empty string if not set)
      'feature-image': project.feature_image || '',
      'add-image-one': project.image_1 || '',
      'add-image-two': project.image_2 || '',
      'add-image-three': project.image_3 || '',
      'add-image-four': project.image_4 || '',
      'add-image-five': project.image_5 || '',
      // Flags for conditional handling in Zapier
      'has-feature-image': !!project.feature_image,
      'has-image-one': !!project.image_1,
      'has-image-two': !!project.image_2,
      'has-image-three': !!project.image_3,
      'has-image-four': !!project.image_4,
      'has-image-five': !!project.image_5,
      'has-external-link': !!externalLink
    };

    console.log(`Sending ${action} webhook:`, payload);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });

      console.log(`Webhook ${action} sent successfully`);
      return { success: true };
    } catch (error) {
      console.error(`Webhook ${action} failed:`, error);
      return { success: false, error: error.message };
    }
  }

  // Initialize migration UI
  function initMigrationUI() {
    const migrateContainer = document.querySelector('.migrate-projects');
    if (!migrateContainer) {
      console.log('No .migrate-projects container found');
      return;
    }

    // Don't show if member already has projects
    if (projects.length > 0) {
      migrateContainer.style.display = 'none';
      return;
    }

    migrateContainer.innerHTML = `
      <div class="mp-migrate-container">
        <h3>Migrate Your Existing Projects</h3>
        <p>If you have projects in the old system, click below to migrate them to your new portfolio manager.</p>
        <button class="mp-migrate-btn" id="mp-migrate-btn">Migrate My Projects</button>
        <div class="mp-migrate-countdown" id="mp-migrate-countdown">
          <p>Migration started! Refreshing in <span class="countdown-number" id="mp-countdown-number">10</span> seconds...</p>
        </div>
      </div>
    `;

    const migrateBtn = migrateContainer.querySelector('#mp-migrate-btn');
    const countdownDiv = migrateContainer.querySelector('#mp-migrate-countdown');
    const countdownNumber = migrateContainer.querySelector('#mp-countdown-number');

    migrateBtn.addEventListener('click', async () => {
      migrateBtn.disabled = true;
      migrateBtn.textContent = 'Starting migration...';

      try {
        // Send migration webhook
        const webhookUrl = WEBHOOKS.migrate;

        if (!webhookUrl || webhookUrl.includes('MIGRATE_WEBHOOK_ID')) {
          throw new Error('Migration webhook not configured');
        }

        const payload = {
          action: 'migrate',
          memberstack_id: currentMember.id,
          member_email: currentMember.auth?.email || '',
          webflow_member_id: currentMember.customFields?.['webflow-member-id'] || ''
        };

        console.log('Sending migration webhook:', payload);

        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          mode: 'no-cors'
        });

        // Show countdown
        migrateBtn.textContent = 'Migration started!';
        countdownDiv.classList.add('visible');

        // Start countdown
        let seconds = 10;
        const countdownInterval = setInterval(() => {
          seconds--;
          countdownNumber.textContent = seconds;

          if (seconds <= 0) {
            clearInterval(countdownInterval);
            window.location.reload();
          }
        }, 1000);

      } catch (error) {
        console.error('Migration error:', error);
        migrateBtn.disabled = false;
        migrateBtn.textContent = 'Migration failed - Try again';
        migrateBtn.classList.add('mp-migrate-error');
      }
    });
  }

  // Initialize
  async function init() {
    const container = document.querySelector('.vibe-test');
    if (!container) {
      console.warn('Could not find .vibe-test container');
      return;
    }

    // Add styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Create main container
    const wrapper = document.createElement('div');
    wrapper.className = 'mp-container';
    wrapper.innerHTML = '<div class="mp-loading">Loading projects...</div>';
    container.appendChild(wrapper);

    try {
      // Load Uploadcare
      await loadUploadcare();

      // Wait for Memberstack to be available
      await waitForMemberstack();

      // Get current member
      const { data: member } = await window.$memberstackDom.getCurrentMember();
      if (!member) {
        wrapper.innerHTML = '<div class="mp-loading">Please log in to view your projects.</div>';
        return;
      }
      currentMember = member;
      console.log('Current member:', currentMember.id);
      console.log('Member Webflow ID:', currentMember.customFields?.['webflow-member-id']);

      // Load projects from member JSON
      await loadProjects();

      // Check for Webflow ID callback in URL parameters
      // URL format: ?wf_project_id=proj_xxx&wf_item_id=xxx
      const urlParams = new URLSearchParams(window.location.search);
      const wfProjectId = urlParams.get('wf_project_id');
      const wfItemId = urlParams.get('wf_item_id');

      if (wfProjectId && wfItemId) {
        console.log('Received Webflow ID callback:', wfProjectId, wfItemId);
        await updateProjectWebflowId(wfProjectId, wfItemId);
        // Clean up URL parameters
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }

      // Render projects
      renderProjects(wrapper);

      // Initialize migration UI (only shows if no projects exist)
      initMigrationUI();
    } catch (error) {
      console.error('Error initializing member projects:', error);
      wrapper.innerHTML = '<div class="mp-loading">Error loading projects. Please refresh the page.</div>';
    }
  }

  // Wait for Memberstack to be ready
  function waitForMemberstack() {
    return new Promise((resolve) => {
      if (window.$memberstackDom) {
        resolve();
      } else {
        const check = setInterval(() => {
          if (window.$memberstackDom) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      }
    });
  }

  // Load projects from member JSON
  async function loadProjects() {
    try {
      const { data } = await window.$memberstackDom.getMemberJSON();
      projects = (data && data.projects) || [];
      projects.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      console.log('Loaded projects:', projects.length);
    } catch (error) {
      console.error('Error loading projects:', error);
      projects = [];
    }
  }

  // Save projects to member JSON
  async function saveProjects() {
    try {
      const { data: existingData } = await window.$memberstackDom.getMemberJSON();
      const mergedData = { ...existingData, projects: projects };

      const result = await window.$memberstackDom.updateMemberJSON({
        json: mergedData
      });
      console.log('Projects saved:', result);
    } catch (error) {
      console.error('Error saving projects:', error);
      throw error;
    }
  }

  // Render projects list
  function renderProjects(wrapper) {
    if (projects.length === 0) {
      wrapper.innerHTML = `
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
      `;
      wrapper.querySelector('#mp-add-first').addEventListener('click', () => openAddModal(wrapper));

      // Setup inline migrate button
      const migrateBtn = wrapper.querySelector('#mp-migrate-inline');
      const countdownDiv = wrapper.querySelector('#mp-migrate-countdown-inline');
      const countdownNumber = wrapper.querySelector('#mp-countdown-inline');

      migrateBtn.addEventListener('click', async () => {
        migrateBtn.disabled = true;
        migrateBtn.textContent = 'Starting migration...';

        try {
          const webhookUrl = WEBHOOKS.migrate;

          const payload = {
            action: 'migrate',
            memberstack_id: currentMember.id,
            member_email: currentMember.auth?.email || '',
            webflow_member_id: currentMember.customFields?.['webflow-member-id'] || ''
          };

          console.log('Sending migration webhook:', payload);

          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            mode: 'no-cors'
          });

          migrateBtn.textContent = 'Migration started!';
          countdownDiv.style.display = 'block';

          let seconds = 10;
          const interval = setInterval(() => {
            seconds--;
            countdownNumber.textContent = seconds;
            if (seconds <= 0) {
              clearInterval(interval);
              window.location.reload();
            }
          }, 1000);

        } catch (error) {
          console.error('Migration error:', error);
          migrateBtn.disabled = false;
          migrateBtn.textContent = 'Migration failed - Try again';
        }
      });

      return;
    }

    const membershipType = currentMember?.customFields?.['membership-type'];
    const limit = getProjectLimit(membershipType);
    const remaining = limit - projects.length;
    const atLimit = remaining <= 0;

    let html = `
      <div class="mp-header">
        <h2>My Projects</h2>
        <div class="mp-header-right">
          <span class="mp-project-count">${projects.length} of ${limit} projects</span>
          <button class="mp-btn ${atLimit ? 'mp-btn-disabled' : ''}" id="mp-add-project" ${atLimit ? 'disabled' : ''}>
            ${atLimit ? 'Limit Reached' : 'Add Another Project'}
          </button>
        </div>
      </div>
      <div class="mp-projects-list">
    `;

    projects.forEach((project, index) => {
      html += renderProjectCard(project, index);
    });

    html += '</div>';
    wrapper.innerHTML = html;

    wrapper.querySelector('#mp-add-project').addEventListener('click', () => {
      const membershipType = currentMember?.customFields?.['membership-type'];
      const limit = getProjectLimit(membershipType);

      if (projects.length >= limit) {
        showLimitReachedModal(limit, membershipType);
        return;
      }

      openAddModal(wrapper);
    });

    wrapper.querySelectorAll('.mp-project-card').forEach((card, index) => {
      const project = projects[index];
      setupProjectCard(card, project, wrapper);
    });
  }

  // Get category name by ID
  function getCategoryName(categoryId) {
    for (const parentSlug in CHILD_CATEGORIES) {
      const child = CHILD_CATEGORIES[parentSlug].find(c => c.id === categoryId);
      if (child) return child.name;
    }
    return categoryId;
  }

  // Render a single project card
  function renderProjectCard(project, index) {
    let fieldsHtml = '';

    // Text fields
    TEXT_FIELDS.forEach(field => {
      const value = project[field.key] || '';
      fieldsHtml += `
        <div class="mp-field" data-field="${field.key}">
          <div class="mp-field-label">${field.label}</div>
          <div class="mp-field-value ${!value ? 'empty' : ''}" data-type="${field.type}">
            ${value || 'Click to add...'}
          </div>
        </div>
      `;
    });

    // Categories display
    const categories = project.categories || [];
    fieldsHtml += `
      <div class="mp-field">
        <div class="mp-field-label">Categories</div>
        <div class="mp-categories-display">
          ${categories.length > 0
            ? categories.map(id => `<span class="mp-category-tag">${getCategoryName(id)}</span>`).join('')
            : '<span class="mp-field-value empty">Click Edit to add categories...</span>'
          }
        </div>
      </div>
    `;

    // Images display
    const hasImages = project.feature_image || project.image_1 || project.image_2 || project.image_3 || project.image_4 || project.image_5;
    if (hasImages) {
      fieldsHtml += `
        <div class="mp-field">
          <div class="mp-field-label">Images</div>
          <div class="mp-images-display">
            ${project.feature_image ? `<img src="${project.feature_image}" class="mp-feature-thumb" alt="Feature">` : ''}
            ${project.image_1 ? `<img src="${project.image_1}" alt="Image 1">` : ''}
            ${project.image_2 ? `<img src="${project.image_2}" alt="Image 2">` : ''}
            ${project.image_3 ? `<img src="${project.image_3}" alt="Image 3">` : ''}
            ${project.image_4 ? `<img src="${project.image_4}" alt="Image 4">` : ''}
            ${project.image_5 ? `<img src="${project.image_5}" alt="Image 5">` : ''}
          </div>
        </div>
      `;
    }

    return `
      <div class="mp-project-card" data-project-id="${project.id}">
        <div class="mp-project-header">
          <div class="mp-project-header-left mp-toggle-details">
            <span class="mp-toggle-icon">&#9654;</span>
            <h3 class="mp-project-title">${project.project_name || 'Untitled Project'}</h3>
          </div>
          <div class="mp-project-header-actions">
            <button class="mp-btn mp-btn-secondary mp-btn-small mp-edit-btn">Edit</button>
            <button class="mp-btn mp-btn-danger mp-btn-small mp-delete-btn">Delete</button>
          </div>
        </div>
        <div class="mp-project-content">
          <div class="mp-project-fields">
            ${fieldsHtml}
          </div>
        </div>
      </div>
    `;
  }

  // Setup event listeners for a project card
  function setupProjectCard(card, project, wrapper) {
    const content = card.querySelector('.mp-project-content');
    const toggleArea = card.querySelector('.mp-toggle-details');
    const toggleIcon = card.querySelector('.mp-toggle-icon');
    const editBtn = card.querySelector('.mp-edit-btn');
    const deleteBtn = card.querySelector('.mp-delete-btn');

    // Toggle details visibility
    toggleArea.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = content.classList.toggle('open');
      toggleIcon.classList.toggle('open', isOpen);
    });

    // Edit button opens modal
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal(project, wrapper);
    });

    // Delete
    deleteBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this project?')) {
        deleteBtn.disabled = true;
        deleteBtn.textContent = 'Deleting...';

        try {
          // Reload fresh data from Memberstack to get webflow_item_id
          // (which may have been added by Zapier after page load)
          await loadProjects();
          const freshProject = projects.find(p => p.id === project.id);

          if (freshProject) {
            await sendWebhook('delete', freshProject);
            projects = projects.filter(p => p.id !== project.id);
          } else {
            // Project already deleted from Memberstack
            projects = projects.filter(p => p.id !== project.id);
          }

          await saveProjects();
          renderProjects(wrapper);
        } catch (error) {
          console.error('Error deleting project:', error);
          alert('Error deleting project. Please try again.');
          deleteBtn.disabled = false;
          deleteBtn.textContent = 'Delete Project';
        }
      }
    });
  }

  // Start inline field editing
  function startFieldEdit(fieldValue, project, wrapper) {
    const field = fieldValue.closest('.mp-field');
    const fieldKey = field.dataset.field;
    if (!fieldKey) return; // Skip non-editable fields

    const fieldDef = TEXT_FIELDS.find(f => f.key === fieldKey);
    if (!fieldDef) return;

    const currentValue = project[fieldKey] || '';

    const isTextarea = fieldDef.type === 'textarea';
    const input = document.createElement(isTextarea ? 'textarea' : 'input');
    input.className = 'mp-field-input';
    input.value = currentValue;
    if (!isTextarea) {
      input.type = fieldDef.type === 'number' ? 'number' : 'text';
    }

    fieldValue.replaceWith(input);
    input.focus();

    const saveField = async () => {
      const newValue = input.value;
      const oldValue = project[fieldKey];
      project[fieldKey] = fieldDef.type === 'number' ? (parseInt(newValue) || 0) : newValue;

      const newFieldValue = document.createElement('div');
      newFieldValue.className = 'mp-field-value ' + (!newValue ? 'empty' : '');
      newFieldValue.dataset.type = fieldDef.type;
      newFieldValue.textContent = newValue || 'Click to add...';
      input.replaceWith(newFieldValue);

      newFieldValue.addEventListener('click', () => {
        startFieldEdit(newFieldValue, project, wrapper);
      });

      if (newValue !== oldValue) {
        try {
          await saveProjects();
          await sendWebhook('update', project);
        } catch (error) {
          console.error('Error updating field:', error);
        }
      }
    };

    input.addEventListener('blur', saveField);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !isTextarea) {
        input.blur();
      }
      if (e.key === 'Escape') {
        input.value = currentValue;
        input.blur();
      }
    });
  }

  // Create category selector HTML
  function createCategorySelector(selectedCategories = []) {
    let html = `
      <div class="mp-category-section">
        <h4>Choose Project Categories</h4>
        <p style="font-size: 12px; color: #666; margin: 0 0 12px 0;">Select a category to see subcategories. You can choose from multiple categories.</p>
        <div class="mp-parent-categories">
    `;

    PARENT_CATEGORIES.forEach(parent => {
      html += `<button type="button" class="mp-parent-btn" data-parent="${parent.slug}">${parent.name}</button>`;
    });

    html += `</div>`;

    // Child category containers
    PARENT_CATEGORIES.forEach(parent => {
      const children = CHILD_CATEGORIES[parent.slug] || [];
      html += `<div class="mp-child-categories" data-parent="${parent.slug}">`;
      children.forEach(child => {
        const isSelected = selectedCategories.includes(child.id);
        html += `<button type="button" class="mp-child-btn ${isSelected ? 'selected' : ''}" data-id="${child.id}">${child.name}</button>`;
      });
      html += `</div>`;
    });

    html += `
        <div class="mp-selected-categories" style="${selectedCategories.length ? '' : 'display: none;'}">
          <h5>Selected Categories</h5>
          <div class="mp-selected-list"></div>
        </div>
      </div>
    `;

    return html;
  }

  // Create image upload HTML
  function createImageUploader(project = {}) {
    return `
      <div class="mp-image-section">
        <h4>Project Images</h4>
        <div class="mp-image-grid">
          <div class="mp-image-upload mp-feature-image ${project.feature_image ? 'has-image' : ''}" data-field="feature_image">
            ${project.feature_image ? `<img src="${project.feature_image}" alt="Feature">` : ''}
            <div class="mp-upload-placeholder"><span>+</span>Feature Image</div>
            <button type="button" class="mp-remove-image">&times;</button>
          </div>
          ${IMAGE_FIELDS.slice(1).map(img => `
            <div class="mp-image-upload ${project[img.key] ? 'has-image' : ''}" data-field="${img.key}">
              ${project[img.key] ? `<img src="${project[img.key]}" alt="${img.label}">` : ''}
              <div class="mp-upload-placeholder"><span>+</span>${img.label}</div>
              <button type="button" class="mp-remove-image">&times;</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Setup category selector
  function setupCategorySelector(container, selectedCategories, onChange) {
    const parentBtns = container.querySelectorAll('.mp-parent-btn');
    const childContainers = container.querySelectorAll('.mp-child-categories');
    const selectedList = container.querySelector('.mp-selected-list');
    const selectedSection = container.querySelector('.mp-selected-categories');

    function updateSelectedDisplay() {
      selectedList.innerHTML = selectedCategories.map(id => {
        const name = getCategoryName(id);
        return `<span class="mp-selected-tag">${name}<button type="button" data-id="${id}">&times;</button></span>`;
      }).join('');

      selectedSection.style.display = selectedCategories.length ? '' : 'none';

      // Update child button states
      container.querySelectorAll('.mp-child-btn').forEach(btn => {
        btn.classList.toggle('selected', selectedCategories.includes(btn.dataset.id));
      });

      if (onChange) onChange(selectedCategories);
    }

    // Parent button clicks
    parentBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const parentSlug = btn.dataset.parent;
        const isActive = btn.classList.contains('active');

        // Toggle active state
        parentBtns.forEach(b => b.classList.remove('active'));
        childContainers.forEach(c => c.classList.remove('visible'));

        if (!isActive) {
          btn.classList.add('active');
          container.querySelector(`.mp-child-categories[data-parent="${parentSlug}"]`).classList.add('visible');
        }
      });
    });

    // Child button clicks
    container.querySelectorAll('.mp-child-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const index = selectedCategories.indexOf(id);
        if (index > -1) {
          selectedCategories.splice(index, 1);
        } else {
          selectedCategories.push(id);
        }
        updateSelectedDisplay();
      });
    });

    // Remove from selected list
    selectedList.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const id = e.target.dataset.id;
        const index = selectedCategories.indexOf(id);
        if (index > -1) {
          selectedCategories.splice(index, 1);
          updateSelectedDisplay();
        }
      }
    });

    updateSelectedDisplay();
  }

  // Setup image uploader
  function setupImageUploader(container, projectData, onChange) {
    container.querySelectorAll('.mp-image-upload').forEach(upload => {
      const field = upload.dataset.field;

      upload.addEventListener('click', (e) => {
        if (e.target.classList.contains('mp-remove-image')) {
          e.stopPropagation();
          projectData[field] = '';
          upload.classList.remove('has-image');
          const img = upload.querySelector('img');
          if (img) img.remove();
          upload.querySelector('.mp-upload-placeholder').style.display = '';
          if (onChange) onChange();
          return;
        }

        openImageUpload((url) => {
          projectData[field] = url;
          upload.classList.add('has-image');

          let img = upload.querySelector('img');
          if (!img) {
            img = document.createElement('img');
            upload.insertBefore(img, upload.firstChild);
          }
          img.src = url;
          img.alt = field;

          if (onChange) onChange();
        });
      });
    });
  }

  // Show limit reached modal
  function showLimitReachedModal(limit, membershipType) {
    const membershipName = membershipType ? membershipType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'your membership';

    const modal = document.createElement('div');
    modal.className = 'mp-modal-overlay';
    modal.innerHTML = `
      <div class="mp-modal" style="max-width: 450px;">
        <div class="mp-modal-header">
          <h3>Project Limit Reached</h3>
        </div>
        <div class="mp-modal-body" style="text-align: center; padding: 30px;">
          <p style="margin-bottom: 16px; font-size: 16px;">
            You've reached the maximum of <strong>${limit} projects</strong> for ${membershipName} members.
          </p>
          <p style="margin-bottom: 0; color: #666;">
            To add a new project, please delete an existing one or consider upgrading your membership.
          </p>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn" id="mp-modal-close">Got it</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#mp-modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  // Open add project modal
  function openAddModal(wrapper) {
    const selectedCategories = [];
    const projectData = {};

    const modal = document.createElement('div');
    modal.className = 'mp-modal-overlay';
    modal.innerHTML = `
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

          ${createCategorySelector(selectedCategories)}
          ${createImageUploader(projectData)}

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
    `;

    document.body.appendChild(modal);

    // Setup category selector
    setupCategorySelector(modal, selectedCategories, null);

    // Setup image uploader
    setupImageUploader(modal, projectData, null);

    // Setup word count for description
    const descriptionInput = modal.querySelector('#mp-form-project_description');
    const wordCountEl = modal.querySelector('#mp-word-count');
    const updateWordCount = () => {
      const text = descriptionInput.value.trim();
      const count = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
      wordCountEl.textContent = count;
      wordCountEl.style.color = count >= 50 ? '#28a745' : '#666';
      modal.querySelector('#mp-description-error').style.display = 'none';
    };
    descriptionInput.addEventListener('input', updateWordCount);
    updateWordCount();

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    modal.querySelector('#mp-modal-cancel').addEventListener('click', () => modal.remove());

    const saveBtn = modal.querySelector('#mp-modal-save');
    saveBtn.addEventListener('click', async () => {
      const projectName = modal.querySelector('#mp-form-project_name').value.trim();
      const projectDescription = modal.querySelector('#mp-form-project_description').value.trim();
      const wordCount = projectDescription ? projectDescription.split(/\s+/).filter(w => w.length > 0).length : 0;

      if (!projectName) {
        alert('Project name is required');
        return;
      }

      if (wordCount < 50) {
        const errorEl = modal.querySelector('#mp-description-error');
        if (errorEl) errorEl.style.display = 'block';
        modal.querySelector('#mp-form-project_description').focus();
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'Creating...';

      const newProject = {
        id: generateId(),
        project_name: projectName,
        project_description: modal.querySelector('#mp-form-project_description').value,
        external_link: modal.querySelector('#mp-form-external_link').value,
        showreel_link: modal.querySelector('#mp-form-showreel_link').value,
        display_order: parseInt(modal.querySelector('#mp-form-display_order').value) || 0,
        categories: [...selectedCategories],
        feature_image: projectData.feature_image || '',
        image_1: projectData.image_1 || '',
        image_2: projectData.image_2 || '',
        image_3: projectData.image_3 || '',
        image_4: projectData.image_4 || '',
        image_5: projectData.image_5 || '',
        created_at: new Date().toISOString()
      };

      try {
        projects.push(newProject);
        projects.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        await saveProjects();
        await sendWebhook('create', newProject);
        modal.remove();
        renderProjects(wrapper);
      } catch (error) {
        console.error('Error creating project:', error);
        projects.pop();
        alert('Error creating project. Please try again.');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Create Project';
      }
    });

    modal.querySelector('#mp-form-project_name').focus();

    // Setup URL validation
    setupUrlValidation(modal);
  }

  // Open edit project modal
  function openEditModal(project, wrapper) {
    const selectedCategories = [...(project.categories || [])];
    const projectData = {
      feature_image: project.feature_image || '',
      image_1: project.image_1 || '',
      image_2: project.image_2 || '',
      image_3: project.image_3 || '',
      image_4: project.image_4 || '',
      image_5: project.image_5 || ''
    };

    const modal = document.createElement('div');
    modal.className = 'mp-modal-overlay';
    modal.innerHTML = `
      <div class="mp-modal">
        <div class="mp-modal-header">
          <h3>Edit Project</h3>
        </div>
        <div class="mp-modal-body">
          <div class="mp-form-field">
            <label>Project Name <span>*</span></label>
            <input type="text" class="mp-form-input" id="mp-form-project_name" value="${project.project_name || ''}" required>
          </div>
          <div class="mp-form-field">
            <label>Project Description <span>*</span></label>
            <textarea class="mp-form-input" id="mp-form-project_description">${project.project_description || ''}</textarea>
            <div class="mp-input-hint">Minimum 50 words required (<span id="mp-word-count">0</span> words)</div>
            <div class="mp-input-error" id="mp-description-error">Please enter at least 50 words</div>
          </div>

          ${createCategorySelector(selectedCategories)}
          ${createImageUploader(projectData)}

          <div class="mp-form-field">
            <label>Showreel Link</label>
            <input type="text" class="mp-form-input" id="mp-form-showreel_link" value="${project.showreel_link || ''}" placeholder="https://youtube.com/watch?v=... or https://vimeo.com/...">
            <div class="mp-input-hint">YouTube or Vimeo URL only</div>
            <div class="mp-input-error" id="mp-video-error">Please enter a valid YouTube or Vimeo URL</div>
          </div>
          <div class="mp-form-field">
            <label>Project External Link</label>
            <input type="text" class="mp-form-input" id="mp-form-external_link" value="${project.external_link || ''}" placeholder="https://example.com">
            <div class="mp-input-hint">Enter a complete URL including https://</div>
            <div class="mp-input-error" id="mp-url-error">Please enter a valid URL (e.g., https://example.com)</div>
          </div>
          <div class="mp-form-field">
            <label>Display Order</label>
            <input type="number" class="mp-form-input" id="mp-form-display_order" value="${project.display_order || 0}">
          </div>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn mp-btn-secondary" id="mp-modal-cancel">Cancel</button>
          <button class="mp-btn" id="mp-modal-save">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    setupCategorySelector(modal, selectedCategories, null);
    setupImageUploader(modal, projectData, null);

    // Setup URL validation
    setupUrlValidation(modal);

    // Setup word count for description
    const descriptionInput = modal.querySelector('#mp-form-project_description');
    const wordCountEl = modal.querySelector('#mp-word-count');
    const updateWordCount = () => {
      const text = descriptionInput.value.trim();
      const count = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
      wordCountEl.textContent = count;
      wordCountEl.style.color = count >= 50 ? '#28a745' : '#666';
      modal.querySelector('#mp-description-error').style.display = 'none';
    };
    descriptionInput.addEventListener('input', updateWordCount);
    updateWordCount();

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    modal.querySelector('#mp-modal-cancel').addEventListener('click', () => modal.remove());

    const saveBtn = modal.querySelector('#mp-modal-save');
    saveBtn.addEventListener('click', async () => {
      const projectName = modal.querySelector('#mp-form-project_name').value.trim();
      const projectDescription = modal.querySelector('#mp-form-project_description').value.trim();
      const wordCount = projectDescription ? projectDescription.split(/\s+/).filter(w => w.length > 0).length : 0;

      if (!projectName) {
        alert('Project name is required');
        return;
      }

      if (wordCount < 50) {
        const errorEl = modal.querySelector('#mp-description-error');
        if (errorEl) errorEl.style.display = 'block';
        modal.querySelector('#mp-form-project_description').focus();
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      // Update project
      project.project_name = projectName;
      project.project_description = projectDescription;
      project.external_link = modal.querySelector('#mp-form-external_link').value;
      project.showreel_link = modal.querySelector('#mp-form-showreel_link').value;
      project.display_order = parseInt(modal.querySelector('#mp-form-display_order').value) || 0;
      project.categories = [...selectedCategories];
      project.feature_image = projectData.feature_image;
      project.image_1 = projectData.image_1;
      project.image_2 = projectData.image_2;
      project.image_3 = projectData.image_3;
      project.image_4 = projectData.image_4;
      project.image_5 = projectData.image_5;

      try {
        projects.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        await saveProjects();
        await sendWebhook('update', project);
        modal.remove();
        renderProjects(wrapper);
      } catch (error) {
        console.error('Error updating project:', error);
        alert('Error updating project. Please try again.');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
      }
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
