-- MTNS MADE Supabase Migration: Projects Gallery Images Update
-- Adds JSONB array for gallery images (up to 20 images)
-- Replaces fixed image_one_url through image_five_url columns

-- ============================================
-- ADD GALLERY_IMAGES COLUMN
-- ============================================

-- Add JSONB array for flexible gallery storage (max 20 images)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]';

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON COLUMN projects.gallery_images IS 'Array of gallery image URLs (max 20). Format: ["url1", "url2", ...]. feature_image_url remains separate.';

-- ============================================
-- MIGRATION NOTE
-- ============================================
-- The old columns (image_one_url through image_five_url) are kept for backwards
-- compatibility with existing data. New projects will use gallery_images.
-- To migrate existing data, run:
--
-- UPDATE projects SET gallery_images = jsonb_build_array(
--   COALESCE(image_one_url, ''),
--   COALESCE(image_two_url, ''),
--   COALESCE(image_three_url, ''),
--   COALESCE(image_four_url, ''),
--   COALESCE(image_five_url, '')
-- ) - '' WHERE image_one_url IS NOT NULL;
