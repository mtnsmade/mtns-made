-- Member Non-Payment Lifecycle SOP
-- Repurpose the existing (previously unwired) retention_warning_sent flag as the
-- day-20 final-retention-warning idempotency guard, replacing its stale "2-week" comment.
-- subscription_lapsed_at (from 007_subscription_status.sql) is now actually stamped by
-- memberstack-webhook's updateSubscriptionStatus() and used as the grace-period clock start.

COMMENT ON COLUMN members.retention_warning_sent IS
  'True once the day-20 final retention warning email has been sent for the current lapse (Member Non-Payment Lifecycle SOP). Reset to false whenever a member is restored to active.';
