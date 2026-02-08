-- Add profile reminder tracking column to members table
-- Tracks when a profile completion reminder email was sent

ALTER TABLE members
ADD COLUMN IF NOT EXISTS profile_reminder_sent_at TIMESTAMPTZ;

-- Index for querying members who need reminders
CREATE INDEX IF NOT EXISTS idx_members_profile_reminder
ON members(profile_complete, subscription_status, profile_reminder_sent_at)
WHERE profile_complete = false AND subscription_status = 'active';

COMMENT ON COLUMN members.profile_reminder_sent_at IS 'Timestamp when profile completion reminder email was sent';
