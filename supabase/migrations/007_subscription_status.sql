-- MTNS MADE Supabase Migration: Subscription Status Tracking
-- Adds fields to track member subscription status and implement retention policy

-- ============================================
-- 1. ADD SUBSCRIPTION STATUS FIELDS
-- ============================================

-- Subscription status: tracks current state
ALTER TABLE members
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active'
CHECK (subscription_status IN ('active', 'trialling', 'lapsed', 'cancelled'));

-- When the subscription lapsed (null if active/trialling)
ALTER TABLE members
ADD COLUMN IF NOT EXISTS subscription_lapsed_at TIMESTAMPTZ;

-- ============================================
-- 2. INDEX FOR CLEANUP QUERIES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_members_subscription_status
ON members(subscription_status);

CREATE INDEX IF NOT EXISTS idx_members_lapsed_at
ON members(subscription_lapsed_at)
WHERE subscription_lapsed_at IS NOT NULL;

-- ============================================
-- 3. COMMENTS
-- ============================================

COMMENT ON COLUMN members.subscription_status IS
'Current subscription state: active, trialling, lapsed, or cancelled';

COMMENT ON COLUMN members.subscription_lapsed_at IS
'Timestamp when subscription lapsed. Used for 3-month retention policy before deletion.';

-- ============================================
-- RETENTION POLICY
-- ============================================
--
-- Members with lapsed subscriptions are retained for 3 months.
-- After 3 months, they can be permanently deleted.
--
-- To find members eligible for deletion:
--   SELECT * FROM members
--   WHERE subscription_status = 'lapsed'
--   AND subscription_lapsed_at < NOW() - INTERVAL '3 months';
--
-- This should be run via a scheduled job or manual cleanup script.
-- ============================================
