-- MTNS MADE Supabase Migration: Creative Space & Supplier Categories
-- Run BEFORE members table

-- ============================================
-- 1. CREATIVE SPACE CATEGORIES
-- ============================================

CREATE TABLE IF NOT EXISTS creative_space_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webflow_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO creative_space_categories (webflow_id, name, slug) VALUES
  ('64ededbe04bc1f5d88f1cb04', 'Art Residency', 'art-residency'),
  ('64ededc756e09fc697df87bd', 'Art Studio', 'art-studio'),
  ('64ededcde4500853d75fe7e0', 'Artist Run Initiative', 'artist-run-initiative'),
  ('64f1d9d841906b7dee94da37', 'Cinema', 'cinema'),
  ('64f1d9e487b976f53293536b', 'Co-Working Space', 'co-working-space'),
  ('64f1d9ed2cf058e9ad97a1aa', 'Dance Studio', 'dance-studio'),
  ('64f1d9f3ba4f53a0a58913a0', 'Darkroom', 'darkroom'),
  ('64f1d9fb72f97d02aed69114', 'Gallery', 'gallery'),
  ('64f1da02dbd420ebdcbbdbe0', 'Music Venue', 'music-venue'),
  ('64f1da09e36d896066188137', 'Photographic Studio', 'photographic-studio'),
  ('64f1da1112dd56d3752546e5', 'Recording Studio', 'recording-studio'),
  ('64f1da189d95e948bba862e6', 'Rehearsal Space', 'rehearsal-space'),
  ('64f1da2002940058e3edd5fe', 'Retail Space', 'retail-space'),
  ('64f1da274eb35585095da19d', 'Theatre', 'theatre'),
  ('64f1da2d7d6477504d516cbe', 'Workshop Venue', 'workshop-venue'),
  ('64f1da35f675358d75b91b1d', 'Writing Residency', 'writing-residency')
ON CONFLICT (webflow_id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug;

-- ============================================
-- 2. SUPPLIER CATEGORIES
-- ============================================

CREATE TABLE IF NOT EXISTS supplier_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webflow_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO supplier_categories (webflow_id, name, slug) VALUES
  ('64dc97a2a8135e1414e5d040', '3D Printing', '3d-printing'),
  ('64dc981259bcce300f3319b5', 'Art & Craft Supplies', 'art-craft-supplies'),
  ('64dc98df260c6f155a45fce4', 'CAD Modelling', 'cad-modelling'),
  ('64dc97f42e4ce3b17fd788ba', 'CNC Cutting', 'cnc-cutting'),
  ('64dc9788f9556b85f083d5e8', 'Digital Printing', 'digital-printing'),
  ('64dc98b2fff2b7132e34c878', 'Drafting', 'drafting'),
  ('64dc992bfff2b7132e358226', 'Engineering', 'engineering'),
  ('64dc98c3fff2b7132e34e127', 'Framing', 'framing'),
  ('64dc99567a4ece99563eb6e7', 'Hardware Supplies', 'hardware-supplies'),
  ('64dc991159bcce300f33a9b4', 'IT Services', 'it-services'),
  ('64dc97d8b39b4a82e4af7561', 'Laser Cutting', 'laser-cutting'),
  ('64dc974e2e4ce3b17fd6b9b4', 'Letterpress', 'letterpress'),
  ('64dc97bca8135e1414e5e8bc', 'Metal Fabrication', 'metal-fabrication'),
  ('64dc9877b39b4a82e4b00172', 'Music Supplies', 'music-supplies'),
  ('64dc976ebf5b1edb1f42010c', 'Offset Printing', 'offset-printing'),
  ('64dc98f99d53cdd25ecb4092', 'Plant Nursery', 'plant-nursery'),
  ('64dc98968e1db3580f5eb587', 'Search Engine Optimisation', 'search-engine-optimisation'),
  ('64dc9852c843c0e96d30c7d5', 'Sewing Supplies', 'sewing-supplies')
ON CONFLICT (webflow_id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug;

-- ============================================
-- 3. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_creative_space_categories_slug ON creative_space_categories(slug);
CREATE INDEX IF NOT EXISTS idx_supplier_categories_slug ON supplier_categories(slug);

-- ============================================
-- 4. VERIFICATION
-- ============================================

-- SELECT 'creative_space_categories' as table_name, COUNT(*) as count FROM creative_space_categories
-- UNION ALL SELECT 'supplier_categories', COUNT(*) FROM supplier_categories;

-- Expected:
-- creative_space_categories: 16
-- supplier_categories: 18
