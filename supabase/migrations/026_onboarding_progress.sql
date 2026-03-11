-- Migration: Track onboarding progress for save/resume functionality
-- Allows members to save progress and continue onboarding later

-- Add onboarding tracking fields to members table
ALTER TABLE members
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS onboarding_reminder_sent_at TIMESTAMPTZ;

-- Add comment
COMMENT ON COLUMN members.onboarding_step IS 'Current onboarding step (0=not started, 1-5=in progress, completed when profile_complete=true)';
COMMENT ON COLUMN members.onboarding_started_at IS 'When the member first started onboarding';
COMMENT ON COLUMN members.onboarding_reminder_sent_at IS 'When an onboarding reminder email was sent';

-- Index for finding members with incomplete onboarding
CREATE INDEX IF NOT EXISTS idx_members_onboarding_incomplete
ON members(onboarding_step, onboarding_started_at)
WHERE profile_complete = false AND onboarding_step > 0;
