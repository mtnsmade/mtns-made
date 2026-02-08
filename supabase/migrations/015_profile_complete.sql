-- MTNS MADE Supabase Migration: Profile Completeness Tracking
-- Adds profile_complete boolean to track members who have completed onboarding

-- ============================================
-- 1. ADD PROFILE_COMPLETE COLUMN
-- ============================================

ALTER TABLE members
ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT false;

-- ============================================
-- 2. BACKFILL EXISTING MEMBERS
-- ============================================

-- A profile is considered complete if:
-- 1. Has a profile image
-- 2. Has a header/feature image
-- 3. Has a bio with at least 50 characters
-- 4. Name is set (and not just an email address)
-- 5. Has at least one sub-directory selected

UPDATE members
SET profile_complete = (
  -- Has profile image
  profile_image_url IS NOT NULL
  AND profile_image_url != ''
  -- Has header/feature image
  AND header_image_url IS NOT NULL
  AND header_image_url != ''
  -- Has bio with minimum length
  AND bio IS NOT NULL
  AND bio != ''
  AND LENGTH(bio) >= 50
  -- Has a proper name (not email)
  AND name IS NOT NULL
  AND name != ''
  AND name NOT LIKE '%@%'
  -- Has at least one category selected
  AND EXISTS (
    SELECT 1 FROM member_sub_directories
    WHERE member_id = members.id
  )
);

-- ============================================
-- 3. INDEX FOR QUERIES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_members_profile_complete
ON members(profile_complete);

-- ============================================
-- 4. ADD COMMENT
-- ============================================

COMMENT ON COLUMN members.profile_complete IS
'True when member has completed all required profile fields (images, bio, categories). Set by onboarding flow or backfill.';

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to check the backfill results:
--
-- SELECT
--   profile_complete,
--   COUNT(*) as count
-- FROM members
-- WHERE subscription_status = 'active'
-- GROUP BY profile_complete;
--
-- To see incomplete active members:
-- SELECT name, email,
--   CASE WHEN profile_image_url IS NULL OR profile_image_url = '' THEN 'missing profile image' END,
--   CASE WHEN header_image_url IS NULL OR header_image_url = '' THEN 'missing header image' END,
--   CASE WHEN bio IS NULL OR bio = '' OR LENGTH(bio) < 50 THEN 'missing/short bio' END
-- FROM members
-- WHERE subscription_status = 'active'
-- AND profile_complete = false;
