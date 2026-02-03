// Member Edit Profile Script
// Single-page form for editing member profile information
// Loads existing data from Memberstack, allows editing, saves to Memberstack and Webflow CMS

(function() {
  console.log('Member edit profile script loaded');

  // ============================================
  // CONFIGURATION
  // ============================================

  // Membership type classifications
  const BUSINESS_TYPES = ['small-business', 'large-business', 'not-for-profit', 'spaces-suppliers'];
  const INDIVIDUAL_TYPES = ['emerging', 'professional'];
  const SPACES_SUPPLIERS_TYPE = 'spaces-suppliers';

  // Webhook URL for updating Webflow CMS (via Zapier)
  const EDIT_PROFILE_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/20216239/ulr09fx/';

  // Uploadcare public key for image uploads
  const UPLOADCARE_PUBLIC_KEY = '4ab46fc683f9c002ae8b';

  // Uploadcare widget loaded flag
  let uploadcareLoaded = false;

  // Parent Directories (for grouping sub-directories)
  const PARENT_DIRECTORIES = [
    { id: '64ad5d2856cac56795029d2a', name: 'Visual Arts', slug: 'visual-arts' },
    { id: '64ad5d2dde2ea6eeaeb94003', name: 'Design', slug: 'design' },
    { id: '64ad5d37ab90d652594a17a8', name: 'Photography', slug: 'photography' },
    { id: '64ad5d31bf826ce4810f9b7a', name: 'Craft', slug: 'craft' },
    { id: '64ad5d3fde2ea6eeaeb95c9e', name: 'Performing Arts', slug: 'performing-arts' },
    { id: '64ad5d25b6907c1bed526490', name: 'Screen', slug: 'screen' },
    { id: '64ad5d519e2a54f5aab831aa', name: 'Publishing', slug: 'publishing' },
    { id: '64ad5d4b9a1e0e4717405adb', name: 'Creative Education', slug: 'creative-education' },
    { id: '64bfaf6a75299ea8759488fc', name: 'Cultural Work', slug: 'cultural-work' },
    { id: '64ad5d5fff882df891ead372', name: 'Artisanal Products', slug: 'artisanal-products' }
  ];

  // Sub Directories (Chosen Directories) - grouped by parent
  const SUB_DIRECTORIES = [
    // Visual Arts
    { id: '64c324a2892f531f780ed838', name: 'Installation Art', parent: 'visual-arts' },
    { id: '64c337e9723e82f68fdcdbb8', name: 'Interactive Art', parent: 'visual-arts' },
    { id: '64c324a2761d2d11e129c478', name: 'Land Art', parent: 'visual-arts' },
    { id: '64c31e58892f531f780882ca', name: 'Painting', parent: 'visual-arts' },
    { id: '64c324a18561c58fd41ae093', name: 'Photomedia', parent: 'visual-arts' },
    { id: '64c324a14e1c7df81c3a7ac8', name: 'Printmedia', parent: 'visual-arts' },
    { id: '64c324a24e1c7df81c3a7b5e', name: 'Public Art', parent: 'visual-arts' },
    { id: '64c324a1761d2d11e129c3f4', name: 'Sculpture', parent: 'visual-arts' },
    { id: '64c324a2eb00d38a83f49380', name: 'Sound Art', parent: 'visual-arts' },
    { id: '64c337b9723e82f68fdcb311', name: 'Street Art', parent: 'visual-arts' },
    { id: '64c324a21e2d449f6822b228', name: 'Textile Art', parent: 'visual-arts' },
    { id: '64c324a2c8b5a5a8b31f4837', name: 'Video Art', parent: 'visual-arts' },

    // Design
    { id: '64c322813b98e1ea07e8db25', name: 'Architecture', parent: 'design' },
    { id: '64c32281ea11fadfc16688ac', name: 'Fabric Design', parent: 'design' },
    { id: '64c32281686438dbe444b876', name: 'Fashion Design', parent: 'design' },
    { id: '64c322813b98e1ea07e8dae6', name: 'Furniture Design', parent: 'design' },
    { id: '64c3228298f9b238322506fa', name: 'Game Design', parent: 'design' },
    { id: '64c31e418e3559214f884254', name: 'Graphic Design', parent: 'design' },
    { id: '64c32281906b099337c72e36', name: 'Illustration', parent: 'design' },
    { id: '64c32281906b099337c72ed7', name: 'Industrial Design', parent: 'design' },
    { id: '64c32282efe376c79c3cf4dd', name: 'Interior Design', parent: 'design' },
    { id: '64c32281e743d0c2d6501b23', name: 'Landscape Design', parent: 'design' },
    { id: '64c32282ee36f5991d7b1ccd', name: 'Lighting Design', parent: 'design' },
    { id: '64c322821f3ad42037ca043d', name: 'Murals', parent: 'design' },
    { id: '64c322821e2d449f68203f5b', name: 'Signwriting', parent: 'design' },
    { id: '64c32282686438dbe444b955', name: 'Sound Design', parent: 'design' },
    { id: '64c322818e3559214f8ca311', name: 'Website Design', parent: 'design' },

    // Photography
    { id: '64c324a3e743d0c2d6522f5a', name: 'Aerial Photography', parent: 'photography' },
    { id: '64c324a489c8fd4d0e7f1320', name: 'Animal Photography', parent: 'photography' },
    { id: '64c324a3c8b5a5a8b31f48f1', name: 'Event Photography', parent: 'photography' },
    { id: '64c324a3ea11fadfc1692102', name: 'Fashion Photography', parent: 'photography' },
    { id: '64c324a38561c58fd41ae133', name: 'Food Photography', parent: 'photography' },
    { id: '64c324a28e3559214f8ef399', name: 'Interior Photography', parent: 'photography' },
    { id: '64c324a3eb00d38a83f494a1', name: 'Landscape Photography', parent: 'photography' },
    { id: '64c31e65906b099337c338cd', name: 'Portraiture', parent: 'photography' },
    { id: '64c324a3e743d0c2d6522ee7', name: 'Product Photography', parent: 'photography' },
    { id: '64c324a32af64bdc37a878ed', name: 'Sports Photography', parent: 'photography' },
    { id: '64c324a3ee36f5991d7d4b0d', name: 'Travel Photography', parent: 'photography' },
    { id: '64c324a216bbd436777da9b0', name: 'Wedding Photography', parent: 'photography' },

    // Craft
    { id: '64c31e4a1f3ad42037c53e42', name: 'Ceramics', parent: 'craft' },
    { id: '64c324a1ea11fadfc1691bac', name: 'Floristry', parent: 'craft' },
    { id: '64c340b8723e82f68fe423ef', name: 'Glass', parent: 'craft' },
    { id: '64c324a116bbd436777da24a', name: 'Jewellery', parent: 'craft' },
    { id: '64c324a013204b77e3230c47', name: 'Leather', parent: 'craft' },
    { id: '64c324a1ea11fadfc1691bfa', name: 'Metal', parent: 'craft' },
    { id: '64c324a198f9b238322737d3', name: 'Millenary', parent: 'craft' },
    { id: '64c324a113204b77e3230c68', name: 'Paper', parent: 'craft' },
    { id: '64c324a1ea11fadfc1691bf3', name: 'Textiles', parent: 'craft' },
    { id: '64c324a08e3559214f8ef2ce', name: 'Wood', parent: 'craft' },

    // Performing Arts
    { id: '64c324a41e2d449f6822b34d', name: 'Circus', parent: 'performing-arts' },
    { id: '64c31e6f998d40df52d0c0d2', name: 'Dance', parent: 'performing-arts' },
    { id: '64c33dbaa9c56afb61758f2b', name: 'Dramaturgy', parent: 'performing-arts' },
    { id: '64c324a589c8fd4d0e7f13f5', name: 'Live Arts Production', parent: 'performing-arts' },
    { id: '64c324a4686438dbe448d594', name: 'Modelling', parent: 'performing-arts' },
    { id: '64c324a4761d2d11e129c57a', name: 'Music', parent: 'performing-arts' },
    { id: '64c324a4e743d0c2d6522fa1', name: 'Performance Art', parent: 'performing-arts' },
    { id: '64c342694a697ccad200d2d8', name: 'Playwriting', parent: 'performing-arts' },
    { id: '64c324a413204b77e3231064', name: 'Projection', parent: 'performing-arts' },
    { id: '64c324a4ea11fadfc16926de', name: 'Set Design', parent: 'performing-arts' },
    { id: '64c324a416bbd436777db291', name: 'Stage Acting', parent: 'performing-arts' },
    { id: '64c33d6ad8c53bbeff0ad758', name: 'Stage Direction', parent: 'performing-arts' },
    { id: '64c324a413204b77e323105b', name: 'Stage Lighting', parent: 'performing-arts' },

    // Screen
    { id: '64c32280ee36f5991d7b1952', name: 'Animation', parent: 'screen' },
    { id: '64c3228098f9b23832250411', name: 'Art Department', parent: 'screen' },
    { id: '64c33e675e7e936176992daa', name: 'Camera Operator', parent: 'screen' },
    { id: '64c31da3ee36f5991d75f179', name: 'Cinematography', parent: 'screen' },
    { id: '64c33ecb3c3e613167c5af80', name: 'Costume Design', parent: 'screen' },
    { id: '64c32280906b099337c72dd6', name: 'Drone', parent: 'screen' },
    { id: '64c322808561c58fd418867c', name: 'Location Scouting', parent: 'screen' },
    { id: '64c32280ee36f5991d7b1928', name: 'Post Production', parent: 'screen' },
    { id: '64c3227f1f3ad42037ca0282', name: 'Screen Acting', parent: 'screen' },
    { id: '64c3227fea11fadfc1668683', name: 'Screen Direction', parent: 'screen' },
    { id: '64c31dcf8561c58fd4138bfd', name: 'Screen Editing', parent: 'screen' },
    { id: '64c322808e3559214f8c9fee', name: 'Screen Production', parent: 'screen' },
    { id: '64c3228016bbd436777b7429', name: 'Screen Services', parent: 'screen' },
    { id: '64c3227fe743d0c2d65012d2', name: 'Screen Writing', parent: 'screen' },
    { id: '64c322808561c58fd41885e9', name: 'Soundtrack', parent: 'screen' },
    { id: '64c3228089c8fd4d0e7cb947', name: 'Videography', parent: 'screen' },

    // Publishing
    { id: '64c324a6686438dbe448d885', name: 'Copywriting', parent: 'publishing' },
    { id: '64c31e97906b099337c36aa8', name: 'Creative Writing', parent: 'publishing' },
    { id: '64c324a7892f531f780edd4e', name: 'Journalism', parent: 'publishing' },
    { id: '64c324a7e743d0c2d6523397', name: 'Podcasting', parent: 'publishing' },
    { id: '64c324a698f9b23832273cc9', name: 'Poetry', parent: 'publishing' },
    { id: '64c324a61f3ad42037ccb81a', name: 'Proofreading', parent: 'publishing' },
    { id: '64c324a6e743d0c2d6523345', name: 'Technical Writing', parent: 'publishing' },
    { id: '64c324a7efe376c79c3f7f4f', name: 'Text Editing', parent: 'publishing' },

    // Creative Education
    { id: '64c31e8ceb00d38a83edc555', name: 'Dance Education', parent: 'creative-education' },
    { id: '64c324a6c8b5a5a8b31f4e60', name: 'Drama Education', parent: 'creative-education' },
    { id: '64c324a613204b77e3231205', name: 'Higher Degree Supervision', parent: 'creative-education' },
    { id: '64c324a698f9b23832273cac', name: 'Illustration Education', parent: 'creative-education' },
    { id: '64c324a58e3559214f8ef632', name: 'Music Education', parent: 'creative-education' },
    { id: '64c324a6bbf8ad730a694fbb', name: 'Photography Education', parent: 'creative-education' },
    { id: '64c324a6ee36f5991d7d4d50', name: 'Visual Arts Education', parent: 'creative-education' },
    { id: '64c324a6efe376c79c3f7d46', name: 'Writing Education', parent: 'creative-education' },

    // Cultural Work
    { id: '64c324a516bbd436777db338', name: 'Academic Research', parent: 'cultural-work' },
    { id: '64c324a5ea11fadfc1692763', name: 'Art Therapy', parent: 'cultural-work' },
    { id: '64c324a5bbf8ad730a694e60', name: 'Arts Management', parent: 'cultural-work' },
    { id: '64c324a5998d40df52d73c72', name: 'Arts Promotion', parent: 'cultural-work' },
    { id: '64c324a5efe376c79c3f7c60', name: 'Curation', parent: 'cultural-work' },
    { id: '64c324a5686438dbe448d693', name: 'Event Production', parent: 'cultural-work' },
    { id: '64c3227ed94a307c093ebd3f', name: 'First Nations Custodianship', parent: 'cultural-work' },
    { id: '64c324a5998d40df52d73caa', name: 'Grant Writing', parent: 'cultural-work' },
    { id: '64c324a598f9b23832273c36', name: 'Social Media', parent: 'cultural-work' },
    { id: '64c324a5761d2d11e129c625', name: 'Socially Engaged Practice', parent: 'cultural-work' },

    // Artisanal Products
    { id: '64c324a7eb00d38a83f4992a', name: 'Beverages', parent: 'artisanal-products' },
    { id: '64c31ea2ea11fadfc162c4fc', name: 'Food', parent: 'artisanal-products' },
    { id: '64c324a7892f531f780edd7c', name: 'Homewares', parent: 'artisanal-products' },
    { id: '64c324a78561c58fd41ae32b', name: 'Skincare', parent: 'artisanal-products' },
    { id: '64c324a7ee36f5991d7d4e61', name: 'Toys', parent: 'artisanal-products' }
  ];

  // Creative Space Categories
  const SPACE_CATEGORIES = [
    { id: '64f1da35f675358d75b91b1d', name: 'Writing Residency' },
    { id: '64f1da2d7d6477504d516cbe', name: 'Workshop Venue' },
    { id: '64f1da274eb35585095da19d', name: 'Theatre' },
    { id: '64f1da2002940058e3edd5fe', name: 'Retail Space' },
    { id: '64f1da189d95e948bba862e6', name: 'Rehearsal Space' },
    { id: '64f1da1112dd56d3752546e5', name: 'Recording Studio' },
    { id: '64f1da09e36d896066188137', name: 'Photographic Studio' },
    { id: '64f1da02dbd420ebdcbbdbe0', name: 'Music Venue' },
    { id: '64f1d9fb72f97d02aed69114', name: 'Gallery' },
    { id: '64f1d9f3ba4f53a0a58913a0', name: 'Darkroom' },
    { id: '64f1d9ed2cf058e9ad97a1aa', name: 'Dance Studio' },
    { id: '64f1d9e487b976f53293536b', name: 'Co-Working Space' },
    { id: '64f1d9d841906b7dee94da37', name: 'Cinema' },
    { id: '64ededcde4500853d75fe7e0', name: 'Artist Run Initiative' },
    { id: '64ededc756e09fc697df87bd', name: 'Art Studio' },
    { id: '64ededbe04bc1f5d88f1cb04', name: 'Art Residency' }
  ];

  // Supplier Categories
  const SUPPLIER_CATEGORIES = [
    { id: '64dc99567a4ece99563eb6e7', name: 'Hardware Supplies' },
    { id: '64dc992bfff2b7132e358226', name: 'Engineering' },
    { id: '64dc991159bcce300f33a9b4', name: 'IT Services' },
    { id: '64dc98f99d53cdd25ecb4092', name: 'Plant Nursery' },
    { id: '64dc98df260c6f155a45fce4', name: 'CAD Modelling' },
    { id: '64dc98c3fff2b7132e34e127', name: 'Framing' },
    { id: '64dc98b2fff2b7132e34c878', name: 'Drafting' },
    { id: '64dc98968e1db3580f5eb587', name: 'Search Engine Optimisation' },
    { id: '64dc9877b39b4a82e4b00172', name: 'Music Supplies' },
    { id: '64dc9852c843c0e96d30c7d5', name: 'Sewing Supplies' },
    { id: '64dc981259bcce300f3319b5', name: 'Art & Craft Supplies' },
    { id: '64dc97f42e4ce3b17fd788ba', name: 'CNC Cutting' },
    { id: '64dc97d8b39b4a82e4af7561', name: 'Laser Cutting' },
    { id: '64dc97bca8135e1414e5e8bc', name: 'Metal Fabrication' },
    { id: '64dc97a2a8135e1414e5d040', name: '3D Printing' },
    { id: '64dc9788f9556b85f083d5e8', name: 'Digital Printing' },
    { id: '64dc976ebf5b1edb1f42010c', name: 'Offset Printing' },
    { id: '64dc974e2e4ce3b17fd6b9b4', name: 'Letterpress' }
  ];

  // Days of the week for opening hours
  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // ============================================
  // STYLES
  // ============================================

  const styles = `
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
    .ep-accordion {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 12px;
      overflow: hidden;
    }
    .ep-accordion-header {
      padding: 14px 16px;
      background: #f8f9fa;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      font-size: 14px;
    }
    .ep-accordion-header:hover {
      background: #f0f0f0;
    }
    .ep-accordion-arrow {
      transition: transform 0.2s;
    }
    .ep-accordion.open .ep-accordion-arrow {
      transform: rotate(180deg);
    }
    .ep-accordion-content {
      display: none;
      padding: 16px;
    }
    .ep-accordion.open .ep-accordion-content {
      display: block;
    }
    .ep-accordion-count {
      font-size: 12px;
      color: #666;
      font-weight: normal;
    }
    .ep-field-error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }
  `;

  // ============================================
  // STATE
  // ============================================

  let memberData = null;
  let formData = {
    firstName: '',
    lastName: '',
    email: '',
    profileImageUrl: '',
    featureImageUrl: '',
    bio: '',
    businessName: '',
    businessAddress: '',
    displayAddress: false,
    openingHours: {
      monday: '', tuesday: '', wednesday: '', thursday: '',
      friday: '', saturday: '', sunday: ''
    },
    displayOpeningHours: false,
    spaceOrSupplier: null, // 'space' or 'supplier'
    chosenDirectories: [],
    spaceCategories: [],
    supplierCategories: [],
    website: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    tiktok: '',
    youtube: ''
  };

  // Store original data for change detection
  let originalData = null;

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  function waitForMemberstack() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50;
      const check = setInterval(() => {
        attempts++;
        if (window.$memberstackDom) {
          clearInterval(check);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(check);
          reject(new Error('Memberstack not loaded'));
        }
      }, 100);
    });
  }

  function isBusinessType(type) {
    return BUSINESS_TYPES.includes(type);
  }

  function isSpacesSuppliers(type) {
    return type === SPACES_SUPPLIERS_TYPE;
  }

  // Social media URL patterns and base URLs
  const SOCIAL_PLATFORMS = {
    instagram: {
      baseUrl: 'https://www.instagram.com/',
      patterns: [/instagram\.com\/([^\/\?]+)/i, /^@?([a-zA-Z0-9._]+)$/]
    },
    facebook: {
      baseUrl: 'https://www.facebook.com/',
      patterns: [/facebook\.com\/([^\/\?]+)/i, /^([a-zA-Z0-9.]+)$/]
    },
    linkedin: {
      baseUrl: 'https://www.linkedin.com/in/',
      patterns: [/linkedin\.com\/(in|company)\/([^\/\?]+)/i, /^([a-zA-Z0-9-]+)$/]
    },
    tiktok: {
      baseUrl: 'https://www.tiktok.com/@',
      patterns: [/tiktok\.com\/@?([^\/\?]+)/i, /^@?([a-zA-Z0-9._]+)$/]
    },
    youtube: {
      baseUrl: 'https://www.youtube.com/',
      patterns: [/youtube\.com\/(channel|c|user|@)\/([^\/\?]+)/i, /youtube\.com\/([^\/\?]+)/i, /^@?([a-zA-Z0-9_-]+)$/]
    }
  };

  // Validate and normalize a URL
  function normalizeUrl(value, platform = null) {
    if (!value || !value.trim()) {
      return { valid: true, url: '' };
    }

    value = value.trim();

    // Reject if contains spaces (multiple URLs or invalid format)
    if (value.includes(' ')) {
      return { valid: false, error: 'Please enter only one URL (no spaces)' };
    }

    // Reject if contains multiple http:// or https:// (multiple URLs pasted)
    const httpCount = (value.match(/https?:\/\//gi) || []).length;
    if (httpCount > 1) {
      return { valid: false, error: 'Please enter only one URL' };
    }

    // If it's already a valid URL, return it
    if (/^https?:\/\//i.test(value)) {
      try {
        new URL(value);
        return { valid: true, url: value };
      } catch {
        return { valid: false, error: 'Invalid URL format' };
      }
    }

    // For website field, require full URL
    if (platform === 'website') {
      // Try adding https://
      if (/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/.test(value)) {
        return { valid: true, url: 'https://' + value };
      }
      return { valid: false, error: 'Please enter a full website URL (e.g., https://example.com)' };
    }

    // For social platforms, try to extract username and build URL
    if (platform && SOCIAL_PLATFORMS[platform]) {
      const config = SOCIAL_PLATFORMS[platform];

      // Check if it contains the platform domain (partial URL)
      if (value.toLowerCase().includes(platform.toLowerCase() + '.com')) {
        return { valid: true, url: 'https://' + value.replace(/^(https?:\/\/)?/i, '') };
      }

      // Check if it's just a username
      for (const pattern of config.patterns) {
        const match = value.match(pattern);
        if (match) {
          const username = match[match.length - 1]; // Get last capture group
          // Don't convert if it looks like a generic word
          if (username.toLowerCase() === platform.toLowerCase()) {
            return { valid: false, error: `Please enter your ${platform} profile URL or username` };
          }
          return { valid: true, url: config.baseUrl + username.replace(/^@/, '') };
        }
      }

      return { valid: false, error: `Please enter a valid ${platform} URL or username` };
    }

    return { valid: false, error: 'Invalid URL' };
  }

  // Validate all social links and return errors
  function validateSocialLinks() {
    const errors = [];
    const platforms = ['website', 'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube'];

    platforms.forEach(platform => {
      const value = formData[platform];
      if (value && value.trim()) {
        const result = normalizeUrl(value, platform);
        if (!result.valid) {
          errors.push({ platform, error: result.error });
        } else {
          // Update formData with normalized URL
          formData[platform] = result.url;
        }
      }
    });

    return errors;
  }

  // Load Uploadcare widget script
  function loadUploadcare() {
    return new Promise((resolve) => {
      if (uploadcareLoaded || window.uploadcare) {
        uploadcareLoaded = true;
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

  // Open Uploadcare dialog and return CDN URL
  function openUploadcareDialog(options = {}) {
    return new Promise((resolve, reject) => {
      if (!window.uploadcare) {
        reject(new Error('Uploadcare not loaded'));
        return;
      }

      const dialog = uploadcare.openDialog(null, {
        publicKey: UPLOADCARE_PUBLIC_KEY,
        imagesOnly: true,
        crop: options.crop || 'free',
        tabs: 'file camera',
        ...options
      });

      dialog.done((file) => {
        file.promise().done((fileInfo) => {
          resolve(fileInfo.cdnUrl);
        }).fail((error) => {
          reject(error);
        });
      });

      // Don't reject on dialog close/cancel - just do nothing
    });
  }

  // Parse JSON safely
  function safeParseJSON(value, fallback = []) {
    if (!value) return fallback;
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  // Parse category IDs from Memberstack format
  // Data is stored as: "id1","id2","id3" (not a proper JSON array)
  function parseCategoryIds(value) {
    if (!value || typeof value !== 'string') return [];

    // First try JSON parse (in case it's a proper array)
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Not valid JSON, continue with string parsing
    }

    // Parse the comma-separated quoted format: "id1","id2","id3"
    const matches = value.match(/"([^"]+)"/g);
    if (matches) {
      return matches.map(m => m.replace(/"/g, ''));
    }

    // Fallback: try splitting by comma
    return value.split(',').map(s => s.trim().replace(/"/g, '')).filter(Boolean);
  }

  // ============================================
  // DATA LOADING
  // ============================================

  async function loadMemberData() {
    const { data: member } = await window.$memberstackDom.getCurrentMember();

    if (!member) {
      return null;
    }

    memberData = member;
    const cf = member.customFields || {};

    // Populate formData from member custom fields
    formData.firstName = cf['first-name'] || '';
    formData.lastName = cf['last-name'] || '';
    formData.email = member.auth?.email || '';
    formData.profileImageUrl = cf['profile-pic-url'] || cf['profile-image'] || '';
    formData.featureImageUrl = cf['feature-image'] || '';
    formData.bio = cf['public-bio'] || cf['bio'] || '';
    formData.businessName = cf['trading-name'] || cf['business-name'] || '';
    formData.businessAddress = cf['street-address'] || cf['business-address'] || '';
    formData.displayAddress = cf['display-address'] === 'true';
    formData.displayOpeningHours = cf['display-opening-hours'] === 'true';

    // Opening hours - check both 'open-day' and 'opening-day' formats
    DAYS_OF_WEEK.forEach(day => {
      const dayLower = day.toLowerCase();
      formData.openingHours[dayLower] = cf[`open-${dayLower}`] || cf[`opening-${dayLower}`] || '';
    });

    // Space/Supplier selection
    if (cf['space'] === 'true' || cf['is-creative-space'] === 'true') {
      formData.spaceOrSupplier = 'space';
    } else if (cf['supplier'] === 'true' || cf['is-supplier'] === 'true') {
      formData.spaceOrSupplier = 'supplier';
    }

    // Categories - parse from Memberstack format ("id1","id2","id3")
    formData.chosenDirectories = parseCategoryIds(cf['categories'] || cf['chosen-directories']);
    formData.spaceCategories = parseCategoryIds(cf['space-category'] || cf['space-categories']);
    formData.supplierCategories = parseCategoryIds(cf['supplier-categories']);

    // Links
    formData.website = cf['website'] || '';
    formData.instagram = cf['instagram'] || '';
    formData.facebook = cf['facebook'] || '';
    formData.linkedin = cf['linkedin'] || '';
    formData.tiktok = cf['tiktok'] || '';
    formData.youtube = cf['youtube'] || '';

    // Store original data for change detection
    originalData = JSON.parse(JSON.stringify(formData));

    return member;
  }

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  function renderEditForm(container) {
    const membershipType = memberData?.customFields?.['membership-type'];
    const isBusinessMember = isBusinessType(membershipType);
    const isSpaceSupplier = isSpacesSuppliers(membershipType);

    container.innerHTML = `
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" id="ep-error-banner" style="display: none;"></div>
          <div class="ep-success-banner" id="ep-success-banner" style="display: none;"></div>

          ${renderAboutYouSection()}
          ${isBusinessMember ? renderBusinessDetailsSection() : ''}
          ${renderCategoriesSection(isSpaceSupplier)}
          ${renderLinksSection()}

          <div class="ep-btn-row">
            <a href="/profile/start" class="ep-btn ep-btn-secondary" style="text-decoration: none; text-align: center;">Cancel</a>
            <button type="button" class="ep-btn" id="ep-save-btn">Save Changes</button>
          </div>
        </div>
      </div>
    `;

    setupFormHandlers(container, isBusinessMember, isSpaceSupplier);
  }

  function renderAboutYouSection() {
    return `
      <div class="ep-section">
        <h3 class="ep-section-title">About You</h3>
        <p class="ep-section-description">Basic information about you and your creative practice.</p>

        <div class="ep-image-row">
          <div class="ep-form-field">
            <label>Profile Image <span class="required">*</span></label>
            <div class="ep-image-upload" id="profile-upload">
              ${formData.profileImageUrl
                ? `<img src="${formData.profileImageUrl}" class="ep-image-preview profile" alt="Profile preview">
                   <button type="button" class="ep-image-remove" data-remove="profile">&times;</button>`
                : `<div class="ep-image-upload-text">
                    <strong>Click to upload</strong><br>
                    Square image recommended
                  </div>`
              }
            </div>
            <div class="ep-hint">This will be your profile photo</div>
          </div>

          <div class="ep-form-field">
            <label>Feature Image <span class="required">*</span></label>
            <div class="ep-image-upload" id="feature-upload">
              ${formData.featureImageUrl
                ? `<img src="${formData.featureImageUrl}" class="ep-image-preview" alt="Feature preview">
                   <button type="button" class="ep-image-remove" data-remove="feature">&times;</button>`
                : `<div class="ep-image-upload-text">
                    <strong>Click to upload</strong><br>
                    Landscape image recommended
                  </div>`
              }
            </div>
            <div class="ep-hint">This appears as the header on your profile page</div>
          </div>
        </div>

        <div class="ep-form-field">
          <label>First Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-first-name" value="${escapeHtml(formData.firstName)}" placeholder="Enter your first name">
        </div>

        <div class="ep-form-field">
          <label>Last Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-last-name" value="${escapeHtml(formData.lastName)}" placeholder="Enter your last name">
        </div>

        <div class="ep-form-field">
          <label>Email Address</label>
          <input type="email" class="ep-form-input" id="ep-email" value="${escapeHtml(formData.email)}" readonly>
          <div class="ep-hint">Email cannot be changed here. Contact support if you need to update it.</div>
        </div>

        <div class="ep-form-field">
          <label>Public Bio <span class="required">*</span></label>
          <textarea class="ep-form-input" id="ep-bio" maxlength="2000" placeholder="Tell us about your creative practice, skills, and what you offer...">${escapeHtml(formData.bio)}</textarea>
          <div class="ep-char-count"><span id="ep-bio-count">${formData.bio.length}</span> / 2000 characters</div>
        </div>
      </div>
    `;
  }

  function renderBusinessDetailsSection() {
    return `
      <div class="ep-section">
        <h3 class="ep-section-title">Business Details</h3>
        <p class="ep-section-description">Information about your business or organization.</p>

        <div class="ep-form-field">
          <label>Business / Trading Name <span class="required">*</span></label>
          <input type="text" class="ep-form-input" id="ep-business-name" value="${escapeHtml(formData.businessName)}" placeholder="Enter your business or trading name">
        </div>

        <div class="ep-form-field">
          <label>Business Address</label>
          <input type="text" class="ep-form-input" id="ep-address" value="${escapeHtml(formData.businessAddress)}" placeholder="Enter your business address">
          <div class="ep-hint">This is where customers can find you</div>
        </div>

        <div class="ep-toggle-field">
          <span class="ep-toggle-label">Display address publicly on my profile</span>
          <label class="ep-toggle">
            <input type="checkbox" id="ep-display-address" ${formData.displayAddress ? 'checked' : ''}>
            <span class="ep-toggle-slider"></span>
          </label>
        </div>

        <div class="ep-form-field">
          <label>Opening Hours</label>
          <div class="ep-hours-grid">
            ${DAYS_OF_WEEK.map(day => `
              <div class="ep-hours-row">
                <span class="ep-hours-day">${day}</span>
                <input type="text" class="ep-hours-input" id="ep-hours-${day.toLowerCase()}"
                  value="${escapeHtml(formData.openingHours[day.toLowerCase()])}"
                  placeholder="e.g., 9am - 5pm or Closed">
              </div>
            `).join('')}
          </div>
        </div>

        <div class="ep-toggle-field">
          <span class="ep-toggle-label">Display opening hours publicly on my profile</span>
          <label class="ep-toggle">
            <input type="checkbox" id="ep-display-hours" ${formData.displayOpeningHours ? 'checked' : ''}>
            <span class="ep-toggle-slider"></span>
          </label>
        </div>
      </div>
    `;
  }

  function renderCategoriesSection(isSpaceSupplier) {
    return `
      <div class="ep-section">
        <h3 class="ep-section-title">Categories</h3>
        <p class="ep-section-description">Select the categories that best describe your work. This helps people find you in the directory.</p>

        <div id="categories-container">
          ${isSpaceSupplier ? renderSpaceSupplierSelector() : renderDirectoriesSelector()}
        </div>
      </div>
    `;
  }

  function renderSpaceSupplierSelector() {
    return `
      <div class="ep-form-field">
        <label>What type of listing are you? <span class="required">*</span></label>
        <div class="ep-radio-group">
          <label class="ep-radio-item ${formData.spaceOrSupplier === 'space' ? 'selected' : ''}" id="radio-space">
            <input type="radio" name="space-supplier" value="space" ${formData.spaceOrSupplier === 'space' ? 'checked' : ''}>
            <div class="ep-radio-item-title">Creative Space</div>
            <div class="ep-radio-item-desc">Studios, venues, galleries, etc.</div>
          </label>
          <label class="ep-radio-item ${formData.spaceOrSupplier === 'supplier' ? 'selected' : ''}" id="radio-supplier">
            <input type="radio" name="space-supplier" value="supplier" ${formData.spaceOrSupplier === 'supplier' ? 'checked' : ''}>
            <div class="ep-radio-item-title">Supplier</div>
            <div class="ep-radio-item-desc">Materials, services, equipment, etc.</div>
          </label>
        </div>
      </div>
      <div id="space-supplier-categories" style="${formData.spaceOrSupplier ? '' : 'display: none;'}">
        ${formData.spaceOrSupplier === 'space' ? renderSpaceCategories() : ''}
        ${formData.spaceOrSupplier === 'supplier' ? renderSupplierCategories() : ''}
      </div>
    `;
  }

  function renderSpaceCategories() {
    let html = '<div class="ep-category-section"><div class="ep-category-header">Select Space Categories</div><div class="ep-category-grid">';
    SPACE_CATEGORIES.forEach(cat => {
      const selected = formData.spaceCategories.includes(cat.id);
      html += `
        <label class="ep-category-item ${selected ? 'selected' : ''}" data-id="${cat.id}">
          <input type="checkbox" value="${cat.id}" ${selected ? 'checked' : ''}>
          ${cat.name}
        </label>
      `;
    });
    html += '</div><div class="ep-selected-count"><span id="space-count">' + formData.spaceCategories.length + '</span> selected</div></div>';
    return html;
  }

  function renderSupplierCategories() {
    let html = '<div class="ep-category-section"><div class="ep-category-header">Select Supplier Categories</div><div class="ep-category-grid">';
    SUPPLIER_CATEGORIES.forEach(cat => {
      const selected = formData.supplierCategories.includes(cat.id);
      html += `
        <label class="ep-category-item ${selected ? 'selected' : ''}" data-id="${cat.id}">
          <input type="checkbox" value="${cat.id}" ${selected ? 'checked' : ''}>
          ${cat.name}
        </label>
      `;
    });
    html += '</div><div class="ep-selected-count"><span id="supplier-count">' + formData.supplierCategories.length + '</span> selected</div></div>';
    return html;
  }

  function renderDirectoriesSelector() {
    let html = '';

    PARENT_DIRECTORIES.forEach(parent => {
      const subDirs = SUB_DIRECTORIES.filter(d => d.parent === parent.slug);
      if (subDirs.length === 0) return;

      const selectedInGroup = subDirs.filter(d => formData.chosenDirectories.includes(d.id)).length;
      const isOpen = selectedInGroup > 0;

      html += `
        <div class="ep-accordion ${isOpen ? 'open' : ''}" data-parent="${parent.slug}">
          <div class="ep-accordion-header">
            ${parent.name}
            <span>
              <span class="ep-accordion-count">${selectedInGroup > 0 ? `(${selectedInGroup} selected)` : ''}</span>
              <span class="ep-accordion-arrow">▼</span>
            </span>
          </div>
          <div class="ep-accordion-content">
            <div class="ep-category-grid">
      `;

      subDirs.forEach(dir => {
        const selected = formData.chosenDirectories.includes(dir.id);
        html += `
          <label class="ep-category-item ${selected ? 'selected' : ''}" data-id="${dir.id}">
            <input type="checkbox" value="${dir.id}" ${selected ? 'checked' : ''}>
            ${dir.name}
          </label>
        `;
      });

      html += `
            </div>
          </div>
        </div>
      `;
    });

    html += `<div class="ep-selected-count"><span id="directory-count">${formData.chosenDirectories.length}</span> categories selected</div>`;
    return html;
  }

  function renderLinksSection() {
    return `
      <div class="ep-section">
        <h3 class="ep-section-title">External Links</h3>
        <p class="ep-section-description">Add your website and social media links. All fields are optional.</p>

        <div class="ep-links-grid">
          <div class="ep-link-field">
            <span class="ep-link-label">Website</span>
            <input type="url" class="ep-form-input" id="ep-website" value="${escapeHtml(formData.website)}" placeholder="https://yourwebsite.com">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">Instagram</span>
            <input type="url" class="ep-form-input" id="ep-instagram" value="${escapeHtml(formData.instagram)}" placeholder="https://instagram.com/username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">Facebook</span>
            <input type="url" class="ep-form-input" id="ep-facebook" value="${escapeHtml(formData.facebook)}" placeholder="https://facebook.com/page">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">LinkedIn</span>
            <input type="url" class="ep-form-input" id="ep-linkedin" value="${escapeHtml(formData.linkedin)}" placeholder="https://linkedin.com/in/username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">TikTok</span>
            <input type="url" class="ep-form-input" id="ep-tiktok" value="${escapeHtml(formData.tiktok)}" placeholder="https://tiktok.com/@username">
          </div>
          <div class="ep-link-field">
            <span class="ep-link-label">YouTube</span>
            <input type="url" class="ep-form-input" id="ep-youtube" value="${escapeHtml(formData.youtube)}" placeholder="https://youtube.com/channel">
          </div>
        </div>
      </div>
    `;
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // SETUP HANDLERS
  // ============================================

  function setupFormHandlers(container, isBusinessMember, isSpaceSupplier) {
    const errorBanner = container.querySelector('#ep-error-banner');
    const successBanner = container.querySelector('#ep-success-banner');
    const saveBtn = container.querySelector('#ep-save-btn');

    // About You section handlers
    setupAboutYouHandlers(container);

    // Business Details handlers (if applicable)
    if (isBusinessMember) {
      setupBusinessDetailsHandlers(container);
    }

    // Categories handlers
    setupCategoriesHandlers(container, isSpaceSupplier);

    // Links handlers
    setupLinksHandlers(container);

    // Save button
    saveBtn.addEventListener('click', async () => {
      errorBanner.style.display = 'none';
      successBanner.style.display = 'none';

      // Validate required fields
      if (!formData.firstName.trim()) {
        showError(errorBanner, 'Please enter your first name');
        return;
      }
      if (!formData.lastName.trim()) {
        showError(errorBanner, 'Please enter your last name');
        return;
      }
      if (!formData.profileImageUrl) {
        showError(errorBanner, 'Please upload a profile image');
        return;
      }
      if (!formData.featureImageUrl) {
        showError(errorBanner, 'Please upload a feature image');
        return;
      }
      if (!formData.bio.trim()) {
        showError(errorBanner, 'Please enter a bio');
        return;
      }
      if (formData.bio.trim().length < 50) {
        showError(errorBanner, 'Please enter at least 50 characters for your bio');
        return;
      }

      // Business validation
      if (isBusinessMember && !formData.businessName.trim()) {
        showError(errorBanner, 'Please enter your business name');
        return;
      }

      // Category validation
      if (isSpaceSupplier) {
        if (!formData.spaceOrSupplier) {
          showError(errorBanner, 'Please select whether you are a Creative Space or Supplier');
          return;
        }
        const categoryCount = formData.spaceOrSupplier === 'space'
          ? formData.spaceCategories.length
          : formData.supplierCategories.length;
        if (categoryCount === 0) {
          showError(errorBanner, 'Please select at least one category');
          return;
        }
      } else {
        if (formData.chosenDirectories.length === 0) {
          showError(errorBanner, 'Please select at least one category');
          return;
        }
      }

      // Validate links
      const linkErrors = validateSocialLinks();
      if (linkErrors.length > 0) {
        // Highlight error fields
        linkErrors.forEach(({ platform, error }) => {
          const input = container.querySelector(`#ep-${platform}`);
          const field = input.closest('.ep-link-field');
          let errorEl = field.querySelector('.ep-field-error');
          if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'ep-field-error';
            field.appendChild(errorEl);
          }
          input.classList.add('error');
          errorEl.textContent = error;
        });
        showError(errorBanner, 'Please fix the highlighted fields before saving');
        return;
      }

      // Save
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      try {
        await saveProfile();
        successBanner.textContent = 'Profile updated successfully!';
        successBanner.style.display = 'block';
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        saveBtn.textContent = 'Save Changes';
        saveBtn.disabled = false;
      } catch (error) {
        console.error('Save error:', error);
        showError(errorBanner, 'An error occurred while saving. Please try again.');
        saveBtn.textContent = 'Save Changes';
        saveBtn.disabled = false;
      }
    });
  }

  function setupAboutYouHandlers(container) {
    // First name
    const firstNameInput = container.querySelector('#ep-first-name');
    firstNameInput.addEventListener('input', () => {
      formData.firstName = firstNameInput.value;
    });

    // Last name
    const lastNameInput = container.querySelector('#ep-last-name');
    lastNameInput.addEventListener('input', () => {
      formData.lastName = lastNameInput.value;
    });

    // Bio
    const bioInput = container.querySelector('#ep-bio');
    const bioCount = container.querySelector('#ep-bio-count');
    bioInput.addEventListener('input', () => {
      formData.bio = bioInput.value;
      bioCount.textContent = bioInput.value.length;
    });

    // Profile image upload
    const profileUpload = container.querySelector('#profile-upload');

    function renderProfileState() {
      if (formData.profileImageUrl) {
        profileUpload.innerHTML = `
          <img src="${formData.profileImageUrl}" class="ep-image-preview profile" alt="Profile preview">
          <button type="button" class="ep-image-remove" data-remove="profile">&times;</button>
        `;
        profileUpload.classList.add('has-image');
      } else {
        profileUpload.innerHTML = `
          <div class="ep-image-upload-text">
            <strong>Click to upload</strong><br>
            Square image recommended
          </div>
        `;
        profileUpload.classList.remove('has-image');
      }
    }

    profileUpload.addEventListener('click', async (e) => {
      if (e.target.dataset.remove === 'profile') {
        e.stopPropagation();
        formData.profileImageUrl = '';
        renderProfileState();
        return;
      }

      if (formData.profileImageUrl) return;

      try {
        await loadUploadcare();
        const cdnUrl = await openUploadcareDialog({ crop: '1:1' });
        formData.profileImageUrl = cdnUrl;
        renderProfileState();
      } catch (error) {
        if (error && error !== 'cancel' && error.message !== 'cancelled') {
          console.error('Profile upload error:', error);
        }
      }
    });

    // Feature image upload
    const featureUpload = container.querySelector('#feature-upload');

    function renderFeatureState() {
      if (formData.featureImageUrl) {
        featureUpload.innerHTML = `
          <img src="${formData.featureImageUrl}" class="ep-image-preview" alt="Feature preview">
          <button type="button" class="ep-image-remove" data-remove="feature">&times;</button>
        `;
        featureUpload.classList.add('has-image');
      } else {
        featureUpload.innerHTML = `
          <div class="ep-image-upload-text">
            <strong>Click to upload</strong><br>
            Landscape image recommended
          </div>
        `;
        featureUpload.classList.remove('has-image');
      }
    }

    featureUpload.addEventListener('click', async (e) => {
      if (e.target.dataset.remove === 'feature') {
        e.stopPropagation();
        formData.featureImageUrl = '';
        renderFeatureState();
        return;
      }

      if (formData.featureImageUrl) return;

      try {
        await loadUploadcare();
        const cdnUrl = await openUploadcareDialog({ crop: '16:9' });
        formData.featureImageUrl = cdnUrl;
        renderFeatureState();
      } catch (error) {
        if (error && error !== 'cancel' && error.message !== 'cancelled') {
          console.error('Feature upload error:', error);
        }
      }
    });
  }

  function setupBusinessDetailsHandlers(container) {
    // Business name
    const businessNameInput = container.querySelector('#ep-business-name');
    if (businessNameInput) {
      businessNameInput.addEventListener('input', () => {
        formData.businessName = businessNameInput.value;
      });
    }

    // Business address
    const addressInput = container.querySelector('#ep-address');
    if (addressInput) {
      addressInput.addEventListener('input', () => {
        formData.businessAddress = addressInput.value;
      });
    }

    // Display address toggle
    const displayAddressToggle = container.querySelector('#ep-display-address');
    if (displayAddressToggle) {
      displayAddressToggle.addEventListener('change', () => {
        formData.displayAddress = displayAddressToggle.checked;
      });
    }

    // Display hours toggle
    const displayHoursToggle = container.querySelector('#ep-display-hours');
    if (displayHoursToggle) {
      displayHoursToggle.addEventListener('change', () => {
        formData.displayOpeningHours = displayHoursToggle.checked;
      });
    }

    // Hours inputs
    DAYS_OF_WEEK.forEach(day => {
      const input = container.querySelector(`#ep-hours-${day.toLowerCase()}`);
      if (input) {
        input.addEventListener('input', () => {
          formData.openingHours[day.toLowerCase()] = input.value;
        });
      }
    });
  }

  function setupCategoriesHandlers(container, isSpaceSupplier) {
    if (isSpaceSupplier) {
      // Space/Supplier radio handlers
      const radioSpace = container.querySelector('#radio-space');
      const radioSupplier = container.querySelector('#radio-supplier');
      const categoriesContainer = container.querySelector('#space-supplier-categories');

      if (radioSpace) {
        radioSpace.addEventListener('click', () => {
          formData.spaceOrSupplier = 'space';
          formData.supplierCategories = [];
          radioSpace.classList.add('selected');
          radioSupplier.classList.remove('selected');
          categoriesContainer.innerHTML = renderSpaceCategories();
          categoriesContainer.style.display = 'block';
          setupCategoryCheckboxes(container, 'spaceCategories', 'space-count');
        });
      }

      if (radioSupplier) {
        radioSupplier.addEventListener('click', () => {
          formData.spaceOrSupplier = 'supplier';
          formData.spaceCategories = [];
          radioSupplier.classList.add('selected');
          radioSpace.classList.remove('selected');
          categoriesContainer.innerHTML = renderSupplierCategories();
          categoriesContainer.style.display = 'block';
          setupCategoryCheckboxes(container, 'supplierCategories', 'supplier-count');
        });
      }

      // Setup checkboxes for current selection
      if (formData.spaceOrSupplier === 'space') {
        setupCategoryCheckboxes(container, 'spaceCategories', 'space-count');
      } else if (formData.spaceOrSupplier === 'supplier') {
        setupCategoryCheckboxes(container, 'supplierCategories', 'supplier-count');
      }
    } else {
      // Accordion handlers
      container.querySelectorAll('.ep-accordion-header').forEach(header => {
        header.addEventListener('click', () => {
          header.parentElement.classList.toggle('open');
        });
      });

      // Directory checkbox handlers
      setupCategoryCheckboxes(container, 'chosenDirectories', 'directory-count');
    }
  }

  function setupCategoryCheckboxes(container, dataKey, countId) {
    container.querySelectorAll('.ep-category-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const id = item.dataset.id;
        if (!id) return;

        const index = formData[dataKey].indexOf(id);

        if (index === -1) {
          formData[dataKey].push(id);
          item.classList.add('selected');
        } else {
          formData[dataKey].splice(index, 1);
          item.classList.remove('selected');
        }

        const countEl = container.querySelector('#' + countId);
        if (countEl) {
          countEl.textContent = formData[dataKey].length;
        }

        // Update accordion count if applicable
        if (dataKey === 'chosenDirectories') {
          updateAccordionCounts(container);
        }
      });
    });
  }

  function updateAccordionCounts(container) {
    container.querySelectorAll('.ep-accordion').forEach(accordion => {
      const parent = accordion.dataset.parent;
      const subDirs = SUB_DIRECTORIES.filter(d => d.parent === parent);
      const selectedCount = subDirs.filter(d => formData.chosenDirectories.includes(d.id)).length;
      const countSpan = accordion.querySelector('.ep-accordion-count');
      if (countSpan) {
        countSpan.textContent = selectedCount > 0 ? `(${selectedCount} selected)` : '';
      }
    });
  }

  function setupLinksHandlers(container) {
    const linkInputs = ['website', 'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube'];

    linkInputs.forEach(platform => {
      const input = container.querySelector(`#ep-${platform}`);
      if (!input) return;

      const field = input.closest('.ep-link-field');

      // Create error element if not exists
      let errorEl = field.querySelector('.ep-field-error');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'ep-field-error';
        errorEl.style.cssText = 'grid-column: 2;';
        field.appendChild(errorEl);
      }

      // Update formData on input
      input.addEventListener('input', () => {
        formData[platform] = input.value;
        input.classList.remove('error');
        errorEl.textContent = '';
      });

      // Validate and auto-fix on blur
      input.addEventListener('blur', () => {
        const value = input.value.trim();
        if (!value) {
          input.classList.remove('error');
          errorEl.textContent = '';
          return;
        }

        const result = normalizeUrl(value, platform);
        if (result.valid) {
          // Auto-fix the URL
          if (result.url !== value) {
            input.value = result.url;
            formData[platform] = result.url;
          }
          input.classList.remove('error');
          errorEl.textContent = '';
        } else {
          input.classList.add('error');
          errorEl.textContent = result.error;
        }
      });
    });
  }

  // ============================================
  // SAVE FUNCTION
  // ============================================

  async function saveProfile() {
    const membershipType = memberData?.customFields?.['membership-type'];

    // Build custom fields for Memberstack
    const customFields = {
      'first-name': formData.firstName,
      'last-name': formData.lastName,
      'public-bio': formData.bio,
      'bio': formData.bio,
      'profile-pic-url': formData.profileImageUrl || '',
      'feature-image': formData.featureImageUrl || ''
    };

    // Business fields
    if (isBusinessType(membershipType)) {
      customFields['trading-name'] = formData.businessName;
      customFields['slug'] = formData.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      customFields['street-address'] = formData.businessAddress || '';
      customFields['display-address'] = formData.displayAddress ? 'true' : 'false';
      customFields['display-opening-hours'] = formData.displayOpeningHours ? 'true' : 'false';

      // Opening hours
      DAYS_OF_WEEK.forEach(day => {
        customFields[`open-${day.toLowerCase()}`] = formData.openingHours[day.toLowerCase()] || '';
      });
    }

    // Links
    customFields['website'] = formData.website || '';
    customFields['instagram'] = formData.instagram || '';
    customFields['facebook'] = formData.facebook || '';
    customFields['linkedin'] = formData.linkedin || '';
    customFields['tiktok'] = formData.tiktok || '';
    customFields['youtube'] = formData.youtube || '';

    // Categories - save as comma-separated quoted IDs (Memberstack format)
    if (formData.chosenDirectories.length > 0) {
      customFields['categories'] = formData.chosenDirectories.map(id => `"${id}"`).join(',');
    } else {
      customFields['categories'] = '';
    }

    // Space/Supplier
    if (isSpacesSuppliers(membershipType)) {
      customFields['space'] = formData.spaceOrSupplier === 'space' ? 'true' : 'false';
      customFields['supplier'] = formData.spaceOrSupplier === 'supplier' ? 'true' : 'false';
      customFields['space-category'] = formData.spaceCategories.length > 0
        ? formData.spaceCategories.map(id => `"${id}"`).join(',')
        : '';
      customFields['supplier-categories'] = formData.supplierCategories.length > 0
        ? formData.supplierCategories.map(id => `"${id}"`).join(',')
        : '';
    }

    // Update Memberstack
    await window.$memberstackDom.updateMember({
      customFields: customFields
    });

    // Prepare webhook data for Webflow CMS update
    const memberWebflowId = memberData.customFields?.['webflow-member-id'] || '';
    const suburb = memberData.customFields?.['suburb'] || '';
    const suburbId = memberData.customFields?.['suburb-id'] || '';
    const billingFrequency = memberData.customFields?.['billing-frequency'] || '';

    const webhookData = {
      // Member identification
      action: 'update',
      memberId: memberData.id,
      memberWebflowId: memberWebflowId,
      memberEmail: memberData.auth?.email || '',
      // Profile info
      firstName: formData.firstName,
      lastName: formData.lastName,
      slug: customFields['slug'] || memberData.customFields?.['slug'] || '',
      suburb: suburb,
      suburbId: suburbId,
      membershipType: membershipType,
      billingFrequency: billingFrequency,
      bio: formData.bio,
      businessName: formData.businessName || '',
      businessAddress: formData.businessAddress || '',
      displayAddress: formData.displayAddress,
      displayOpeningHours: formData.displayOpeningHours,
      // Opening hours
      openingHours: {
        monday: formData.openingHours.monday || '',
        tuesday: formData.openingHours.tuesday || '',
        wednesday: formData.openingHours.wednesday || '',
        thursday: formData.openingHours.thursday || '',
        friday: formData.openingHours.friday || '',
        saturday: formData.openingHours.saturday || '',
        sunday: formData.openingHours.sunday || ''
      },
      // Links
      website: formData.website || '',
      instagram: formData.instagram || '',
      facebook: formData.facebook || '',
      linkedin: formData.linkedin || '',
      tiktok: formData.tiktok || '',
      youtube: formData.youtube || '',
      // Categories as quoted comma-separated string (matches onboarding format)
      chosenDirectories: formData.chosenDirectories.map(id => `"${id}"`).join(','),
      spaceCategories: formData.spaceCategories.map(id => `"${id}"`).join(','),
      supplierCategories: formData.supplierCategories.map(id => `"${id}"`).join(','),
      // Membership type flags
      isSmallBusiness: membershipType === 'small-business',
      isLargeBusiness: membershipType === 'large-business',
      isNotForProfit: membershipType === 'not-for-profit',
      isCreativeSpace: formData.spaceOrSupplier === 'space',
      isSupplier: formData.spaceOrSupplier === 'supplier',
      // Images
      profileImageUrl: formData.profileImageUrl || '',
      featureImageUrl: formData.featureImageUrl || '',
      timestamp: new Date().toISOString()
    };

    // Send to webhook
    try {
      console.log('Sending profile update webhook...', webhookData);
      await fetch(EDIT_PROFILE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData),
        mode: 'no-cors'
      });
      console.log('Webhook sent successfully');
    } catch (e) {
      console.warn('Webhook error (non-blocking):', e);
    }

    // Update original data to reflect saved state
    originalData = JSON.parse(JSON.stringify(formData));
  }

  // ============================================
  // ERROR/STATE RENDERING
  // ============================================

  function showError(banner, message) {
    banner.textContent = message;
    banner.style.display = 'block';
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function renderNotLoggedIn(container) {
    container.innerHTML = `
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
    `;
  }

  function renderError(container, message) {
    container.innerHTML = `
      <div class="ep-container">
        <div class="ep-form">
          <div class="ep-error-banner" style="display: block;">${message}</div>
        </div>
      </div>
    `;
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async function init() {
    const container = document.querySelector('.all-types-profile-edit');
    if (!container) {
      console.warn('Could not find .all-types-profile-edit container');
      return;
    }

    // Add styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Show loading
    container.innerHTML = '<div class="ep-loading">Loading your profile...</div>';

    try {
      await waitForMemberstack();

      const member = await loadMemberData();

      if (!member) {
        renderNotLoggedIn(container);
        return;
      }

      // Render the edit form
      renderEditForm(container);

    } catch (error) {
      console.error('Init error:', error);
      renderError(container, 'Error loading profile. Please refresh the page.');
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
