-- MTNS MADE Supabase Migration: Reference Tables
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
--
-- This creates and populates the static reference tables:
-- 1. membership_types
-- 2. directories (parent categories)
-- 3. sub_directories (child categories)
-- 4. suburbs

-- ============================================
-- 1. MEMBERSHIP TYPES
-- ============================================

CREATE TABLE IF NOT EXISTS membership_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webflow_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert membership types data
INSERT INTO membership_types (webflow_id, name, slug, icon_url) VALUES
  ('66f3887b2f72499295998002', 'Emerging', 'emerging', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/681ac65bd23ceea26b913538_Status%3DEmerging.svg'),
  ('66f388a2c62648c332072ce5', 'Large Business', 'large-business', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/681ac637a044554efcfa5ad1_Status%3DLarge%20Business.svg'),
  ('66f3888fbc771ba2f80cdbb7', 'Not For Profit', 'not-for-profit', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/681ac6480931f90eee7d1355_Status%3DNot%20For%20Profit.svg'),
  ('66f388ad06d16f7bebd43a58', 'Partner', 'partner', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/681ac623eb583c47bc3095df_Status%3DPartner.svg'),
  ('66f3888435288044a929ada4', 'Professional', 'professional', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/681ac65056f48d463096333e_Status%3DProfessional.svg'),
  ('66f38899e225ed5c2aa134e8', 'Small Business', 'small-business', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/681ac63f15497262ba7931fd_Small%20Business.svg'),
  ('6959f804804949ba1ca9e286', 'Spaces / Suppliers', 'spaces-suppliers', NULL)
ON CONFLICT (webflow_id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  icon_url = EXCLUDED.icon_url;

-- ============================================
-- 2. DIRECTORIES (Parent Categories)
-- ============================================

CREATE TABLE IF NOT EXISTS directories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webflow_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  feature_image_url TEXT,
  display_order INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert directories data
INSERT INTO directories (webflow_id, name, slug, feature_image_url, display_order) VALUES
  ('64ad5d5fff882df891ead372', 'Artisanal Products', 'artisanal-products', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/66f1243e8745455d7c33cab2_4.avif', 1),
  ('64ad5d31bf826ce4810f9b7a', 'Craft', 'craft', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/66f1242267887dcc2dc8a8b5_6.avif', 2),
  ('64ad5d4b9a1e0e4717405adb', 'Creative Education', 'creative-education', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/687ae3b0954cf355a9c645c9_685b422c3a144de048a13d39_10340ab9-815e-42c0-a3ff-7f9463965393.jpeg', 3),
  ('64bfaf6a75299ea8759488fc', 'Cultural Work', 'cultural-work', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/66f12414f6e59c188a8db854_1.avif', 4),
  ('64ad5d2dde2ea6eeaeb94003', 'Design', 'design', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/66f1246ae5cecad0be1b6bd6_2.avif', 5),
  ('64ad5d3fde2ea6eeaeb95c9e', 'Performing Arts', 'performing-arts', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/66fbe1af291aa644043f2033_perofrming-arts.avif', 6),
  ('64ad5d37ab90d652594a17a8', 'Photography', 'photography', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/66fbe07624087812c74494b7_photography.avif', 7),
  ('64ad5d519e2a54f5aab831aa', 'Publishing', 'publishing', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/66f1245ec697985c59b3f7d8_5.avif', 8),
  ('64ad5d25b6907c1bed526490', 'Screen', 'screen', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/66fbe0e44d0aa420725e341b_screen.avif', 9),
  ('64ad5d2856cac56795029d2a', 'Visual Arts', 'visual-arts', 'https://cdn.prod.website-files.com/6481b864324e32f8eb266e31/66fbe0c37e474bee648ff96f_visual-art.avif', 10)
ON CONFLICT (webflow_id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  feature_image_url = EXCLUDED.feature_image_url,
  display_order = EXCLUDED.display_order;

-- ============================================
-- 3. SUB DIRECTORIES (Child Categories)
-- ============================================

CREATE TABLE IF NOT EXISTS sub_directories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webflow_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  directory_slug TEXT NOT NULL,  -- References directories.slug
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sub_directories data
INSERT INTO sub_directories (webflow_id, name, slug, directory_slug) VALUES
  -- Artisanal Products
  ('64c324a7eb00d38a83f4992a', 'Beverages', 'beverages', 'artisanal-products'),
  ('64c31ea2ea11fadfc162c4fc', 'Food', 'food', 'artisanal-products'),
  ('64c324a7892f531f780edd7c', 'Homewares', 'homewares', 'artisanal-products'),
  ('64c324a78561c58fd41ae32b', 'Skincare', 'skincare', 'artisanal-products'),
  ('64c324a7ee36f5991d7d4e61', 'Toys', 'toys', 'artisanal-products'),

  -- Craft
  ('64c31e4a1f3ad42037c53e42', 'Ceramics', 'ceramics', 'craft'),
  ('64c324a1ea11fadfc1691bac', 'Floristry', 'floristry', 'craft'),
  ('64c340b8723e82f68fe423ef', 'Glass', 'glass', 'craft'),
  ('64c324a116bbd436777da24a', 'Jewellery', 'jewellery', 'craft'),
  ('64c324a013204b77e3230c47', 'Leather', 'leather', 'craft'),
  ('64c324a1ea11fadfc1691bfa', 'Metal', 'metal', 'craft'),
  ('64c324a198f9b238322737d3', 'Millenary', 'millenary', 'craft'),
  ('64c324a113204b77e3230c68', 'Paper', 'paper', 'craft'),
  ('64c324a1ea11fadfc1691bf3', 'Textiles', 'textiles', 'craft'),
  ('64c324a08e3559214f8ef2ce', 'Wood', 'wood', 'craft'),

  -- Creative Education
  ('64c31e8ceb00d38a83edc555', 'Dance Education', 'dance-education', 'creative-education'),
  ('64c324a6c8b5a5a8b31f4e60', 'Drama Education', 'drama-education', 'creative-education'),
  ('64c324a613204b77e3231205', 'Higher Degree Supervision', 'higher-degree-supervision', 'creative-education'),
  ('64c324a698f9b23832273cac', 'Illustration Education', 'illustration-education', 'creative-education'),
  ('64c324a58e3559214f8ef632', 'Music Education', 'music-education', 'creative-education'),
  ('64c324a6bbf8ad730a694fbb', 'Photography Education', 'photography-education', 'creative-education'),
  ('64c324a6ee36f5991d7d4d50', 'Visual Arts Education', 'visual-arts-education', 'creative-education'),
  ('64c324a6efe376c79c3f7d46', 'Writing Education', 'writing-education', 'creative-education'),

  -- Cultural Work
  ('64c324a516bbd436777db338', 'Academic Research', 'academic-research', 'cultural-work'),
  ('64c324a5ea11fadfc1692763', 'Art Therapy', 'art-therapy', 'cultural-work'),
  ('64c324a5bbf8ad730a694e60', 'Arts Management', 'arts-management', 'cultural-work'),
  ('64c324a5998d40df52d73c72', 'Arts Promotion', 'arts-promotion', 'cultural-work'),
  ('64c324a5efe376c79c3f7c60', 'Curation', 'curation', 'cultural-work'),
  ('64c324a5686438dbe448d693', 'Event Production', 'event-production', 'cultural-work'),
  ('64c3227ed94a307c093ebd3f', 'First Nations Custodianship', 'first-nations-custodianship', 'cultural-work'),
  ('64c324a5998d40df52d73caa', 'Grant Writing', 'grant-writing', 'cultural-work'),
  ('64c324a598f9b23832273c36', 'Social Media', 'social-media', 'cultural-work'),
  ('64c324a5761d2d11e129c625', 'Socially Engaged Practice', 'socially-engaged-practice', 'cultural-work'),

  -- Design
  ('64c322813b98e1ea07e8db25', 'Architecture', 'architecture', 'design'),
  ('64c32281ea11fadfc16688ac', 'Fabric Design', 'fabric-design', 'design'),
  ('64c32281686438dbe444b876', 'Fashion Design', 'fashion-design', 'design'),
  ('64c322813b98e1ea07e8dae6', 'Furniture Design', 'furniture-design', 'design'),
  ('64c3228298f9b238322506fa', 'Game Design', 'game-design', 'design'),
  ('64c31e418e3559214f884254', 'Graphic Design', 'graphic-design', 'design'),
  ('64c32281906b099337c72e36', 'Illustration', 'illustration', 'design'),
  ('64c32281906b099337c72ed7', 'Industrial Design', 'industrial-design', 'design'),
  ('64c32282efe376c79c3cf4dd', 'Interior Design', 'interior-design', 'design'),
  ('64c32281e743d0c2d6501b23', 'Landscape Design', 'landscape-design', 'design'),
  ('64c32282ee36f5991d7b1ccd', 'Lighting Design', 'lighting-design', 'design'),
  ('64c322821f3ad42037ca043d', 'Murals', 'murals', 'design'),
  ('64c322821e2d449f68203f5b', 'Signwriting', 'signwriting', 'design'),
  ('64c32282686438dbe444b955', 'Sound Design', 'sound-design', 'design'),
  ('64c322818e3559214f8ca311', 'Website Design', 'website-design', 'design'),

  -- Performing Arts
  ('64c324a41e2d449f6822b34d', 'Circus', 'circus', 'performing-arts'),
  ('64c31e6f998d40df52d0c0d2', 'Dance', 'dance', 'performing-arts'),
  ('64c33dbaa9c56afb61758f2b', 'Dramaturgy', 'dramaturgy', 'performing-arts'),
  ('64c324a589c8fd4d0e7f13f5', 'Live Arts Production', 'live-arts-production', 'performing-arts'),
  ('64c324a4686438dbe448d594', 'Modelling', 'modelling', 'performing-arts'),
  ('64c324a4761d2d11e129c57a', 'Music', 'music', 'performing-arts'),
  ('64c324a4e743d0c2d6522fa1', 'Performance Art', 'performance-art', 'performing-arts'),
  ('64c342694a697ccad200d2d8', 'Playwriting', 'playwriting', 'performing-arts'),
  ('64c324a413204b77e3231064', 'Projection', 'projection', 'performing-arts'),
  ('64c324a4ea11fadfc16926de', 'Set Design', 'set-design', 'performing-arts'),
  ('64c324a416bbd436777db291', 'Stage Acting', 'stage-acting', 'performing-arts'),
  ('64c33d6ad8c53bbeff0ad758', 'Stage Direction', 'stage-direction', 'performing-arts'),
  ('64c324a413204b77e323105b', 'Stage Lighting', 'stage-lighting', 'performing-arts'),

  -- Photography
  ('64c324a3e743d0c2d6522f5a', 'Aerial Photography', 'aerial-photography', 'photography'),
  ('64c324a489c8fd4d0e7f1320', 'Animal Photography', 'animal-photography', 'photography'),
  ('64c324a3c8b5a5a8b31f48f1', 'Event Photography', 'event-photography', 'photography'),
  ('64c324a3ea11fadfc1692102', 'Fashion Photography', 'fashion-photography', 'photography'),
  ('64c324a38561c58fd41ae133', 'Food Photography', 'food-photography', 'photography'),
  ('64c324a28e3559214f8ef399', 'Interior Photography', 'interior-photography', 'photography'),
  ('64c324a3eb00d38a83f494a1', 'Landscape Photography', 'landscape-photography', 'photography'),
  ('64c31e65906b099337c338cd', 'Portraiture', 'portraiture', 'photography'),
  ('64c324a3e743d0c2d6522ee7', 'Product Photography', 'product-photography', 'photography'),
  ('64c324a32af64bdc37a878ed', 'Sports Photography', 'sports-photography', 'photography'),
  ('64c324a3ee36f5991d7d4b0d', 'Travel Photography', 'travel-photography', 'photography'),
  ('64c324a216bbd436777da9b0', 'Wedding Photography', 'wedding-photography', 'photography'),

  -- Publishing
  ('64c324a6686438dbe448d885', 'Copywriting', 'copywriting', 'publishing'),
  ('64c31e97906b099337c36aa8', 'Creative Writing', 'creative-writing', 'publishing'),
  ('64c324a7892f531f780edd4e', 'Journalism', 'journalism', 'publishing'),
  ('64c324a7e743d0c2d6523397', 'Podcasting', 'podcasting', 'publishing'),
  ('64c324a698f9b23832273cc9', 'Poetry', 'poetry', 'publishing'),
  ('64c324a61f3ad42037ccb81a', 'Proofreading', 'proofreading', 'publishing'),
  ('64c324a6e743d0c2d6523345', 'Technical Writing', 'technical-writing', 'publishing'),
  ('64c324a7efe376c79c3f7f4f', 'Text Editing', 'text-editing', 'publishing'),

  -- Screen
  ('64c32280ee36f5991d7b1952', 'Animation', 'animation', 'screen'),
  ('64c3228098f9b23832250411', 'Art Department', 'art-department', 'screen'),
  ('64c33e675e7e936176992daa', 'Camera Operator', 'camera-operator', 'screen'),
  ('64c31da3ee36f5991d75f179', 'Cinematography', 'cinematography', 'screen'),
  ('64c33ecb3c3e613167c5af80', 'Costume Design', 'costume-design', 'screen'),
  ('64c32280906b099337c72dd6', 'Drone', 'drone', 'screen'),
  ('64c322808561c58fd418867c', 'Location Scouting', 'location-scouting', 'screen'),
  ('64c32280ee36f5991d7b1928', 'Post Production', 'post-production', 'screen'),
  ('64c3227f1f3ad42037ca0282', 'Screen Acting', 'screen-acting', 'screen'),
  ('64c3227fea11fadfc1668683', 'Screen Direction', 'screen-direction', 'screen'),
  ('64c31dcf8561c58fd4138bfd', 'Screen Editing', 'screen-editing', 'screen'),
  ('64c322808e3559214f8c9fee', 'Screen Production', 'screen-production', 'screen'),
  ('64c3228016bbd436777b7429', 'Screen Services', 'screen-services', 'screen'),
  ('64c3227fe743d0c2d65012d2', 'Screen Writing', 'screen-writing', 'screen'),
  ('64c322808561c58fd41885e9', 'Soundtrack', 'soundtrack', 'screen'),
  ('64c3228089c8fd4d0e7cb947', 'Videography', 'videography', 'screen'),

  -- Visual Arts
  ('64c324a2892f531f780ed838', 'Installation Art', 'installation-art', 'visual-arts'),
  ('64c337e9723e82f68fdcdbb8', 'Interactive Art', 'interactive-art', 'visual-arts'),
  ('64c324a2761d2d11e129c478', 'Land Art', 'land-art', 'visual-arts'),
  ('64c31e58892f531f780882ca', 'Painting', 'painting', 'visual-arts'),
  ('64c324a18561c58fd41ae093', 'Photomedia', 'photomedia', 'visual-arts'),
  ('64c324a14e1c7df81c3a7ac8', 'Printmedia', 'printmedia', 'visual-arts'),
  ('64c324a24e1c7df81c3a7b5e', 'Public Art', 'public-art', 'visual-arts'),
  ('64c324a1761d2d11e129c3f4', 'Sculpture', 'sculpture', 'visual-arts'),
  ('64c324a2eb00d38a83f49380', 'Sound Art', 'sound-art', 'visual-arts'),
  ('64c337b9723e82f68fdcb311', 'Street Art', 'street-art', 'visual-arts'),
  ('64c324a21e2d449f6822b228', 'Textile Art', 'textile-art', 'visual-arts'),
  ('64c324a2c8b5a5a8b31f4837', 'Video Art', 'video-art', 'visual-arts')
ON CONFLICT (webflow_id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  directory_slug = EXCLUDED.directory_slug;

-- Add foreign key constraint after data is loaded
-- (Using slug reference for simplicity, could use UUID if preferred)

-- ============================================
-- 4. SUBURBS
-- ============================================

CREATE TABLE IF NOT EXISTS suburbs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webflow_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert suburbs data
INSERT INTO suburbs (webflow_id, name, slug) VALUES
  ('64bfb65db1569eeda7582433', 'Bell', 'bell'),
  ('64bfb65dc335367110321546', 'Bilpin', 'bilpin'),
  ('64bfb65d757e05b74ba0e403', 'Blackheath', 'blackheath'),
  ('64bfb65d6a8497d80eb5b5c6', 'Blaxland', 'blaxland'),
  ('64bfb65d409f7c767042076c', 'Bullaburra', 'bullaburra'),
  ('64bfb65d409f7c767042076d', 'Faulconbridge', 'faulconbridge'),
  ('64bfb65d655ee21e8c72ee13', 'Glenbrook', 'glenbrook'),
  ('64bfb65d2cc46c71a5be8efb', 'Hazelbrook', 'hazelbrook'),
  ('64bfb65d7519806dd636ca2a', 'Katoomba', 'katoomba'),
  ('64bfb65e2cc46c71a5be8f19', 'Lapstone', 'lapstone'),
  ('64bfb65e57a4cc3165c39201', 'Lawson', 'lawson'),
  ('64bfb65ec791453caa2f9d46', 'Leura', 'leura'),
  ('64bfb65ec791453caa2f9d4f', 'Linden', 'linden'),
  ('64bfb65e75299ea8759da3c3', 'Medlow Bath', 'medlow-bath'),
  ('64bfb65ec016ed44dbb8add3', 'Megalong Valley', 'megalong-valley'),
  ('64bfb65ec7c3a0d4663a1577', 'Mount Irvine', 'mount-irvine'),
  ('64bfb65fafe29b2df8a63f02', 'Mount Tomah', 'mount-tomah'),
  ('64bfb65f7519806dd636cccf', 'Mount Victoria', 'mount-victoria'),
  ('64bfb65f2cc46c71a5be9045', 'Mount Wilson', 'mount-wilson'),
  ('6733dfdf795b2df6a1573dd1', 'Penrith', 'penrith'),
  ('64bfb65f2cc46c71a5be907d', 'Springwood', 'springwood'),
  ('64bfb65feec6228116d7a9f3', 'Sun Valley', 'sun-valley'),
  ('64bfb65f73964b051a9b6baf', 'Valley Heights', 'valley-heights'),
  ('64bfb65fd304d7de5fc6ecf0', 'Warrimoo', 'warrimoo'),
  ('64bfb65f9f89e1af537ca7e1', 'Wentworth Falls', 'wentworth-falls'),
  ('64bfb65fc3353671103219b0', 'Winmalee', 'winmalee'),
  ('64bfb65f363259218e7640bf', 'Woodford', 'woodford'),
  ('64bfb66060c8908f983dd9e6', 'Yellow Rock', 'yellow-rock')
ON CONFLICT (webflow_id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug;

-- ============================================
-- 5. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_membership_types_slug ON membership_types(slug);
CREATE INDEX IF NOT EXISTS idx_directories_slug ON directories(slug);
CREATE INDEX IF NOT EXISTS idx_sub_directories_slug ON sub_directories(slug);
CREATE INDEX IF NOT EXISTS idx_sub_directories_parent ON sub_directories(directory_slug);
CREATE INDEX IF NOT EXISTS idx_suburbs_slug ON suburbs(slug);

-- ============================================
-- 6. VERIFICATION QUERIES
-- ============================================

-- Run these after migration to verify data loaded correctly:
-- SELECT 'membership_types' as table_name, COUNT(*) as count FROM membership_types
-- UNION ALL SELECT 'directories', COUNT(*) FROM directories
-- UNION ALL SELECT 'suburbs', COUNT(*) FROM suburbs
-- UNION ALL SELECT 'sub_directories', COUNT(*) FROM sub_directories;

-- Expected results:
-- membership_types: 7
-- directories: 10
-- suburbs: 28
-- sub_directories: 109
