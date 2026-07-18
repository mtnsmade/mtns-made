-- Member Non-Payment Lifecycle SOP — safety hardening after 2026-07-18 incident.
-- Add a real timestamp for when the day-20 warning was sent, so hard-delete timing
-- is gated by OUR OWN recorded action (a minimum buffer since the warning went out),
-- not by a potentially stale/historical subscription_lapsed_at value.
-- Matches the existing *_reminder_sent_at naming convention (profile_reminder_sent_at,
-- project_reminder_sent_at, onboarding_reminder_sent_at).

ALTER TABLE members
ADD COLUMN IF NOT EXISTS retention_warning_sent_at TIMESTAMPTZ;

COMMENT ON COLUMN members.retention_warning_sent_at IS
  'When the day-20 final retention warning email was actually sent. Hard delete requires this to be set and at least 10 days old — never based on subscription_lapsed_at alone, since that value can be stale or historical.';
