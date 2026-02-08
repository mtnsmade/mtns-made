-- Migration: Add retention tracking columns
-- Run this before implementing the retention warning system

-- Track if we've sent the 2-week warning email
ALTER TABLE members
ADD COLUMN IF NOT EXISTS retention_warning_sent BOOLEAN DEFAULT false;

-- Index for efficient queries on lapsed members
CREATE INDEX IF NOT EXISTS idx_members_lapsed
ON members (subscription_status, subscription_lapsed_at)
WHERE subscription_status = 'lapsed';

-- Comment for documentation
COMMENT ON COLUMN members.retention_warning_sent IS
'True if we have sent the 2-week retention warning email before deletion';
