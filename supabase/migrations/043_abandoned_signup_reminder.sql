-- Abandoned signup reminder: members who created a Memberstack account via
-- the two-step signup flow but never completed checkout (no plan connection
-- ever attached). Tracking column to avoid re-sending; cron to run it daily.
-- See supabase/functions/abandoned-signup-reminder/index.ts for the full
-- reasoning - this is a real, distinct population from what
-- onboarding-reminder and profile-reminder already cover.

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS abandoned_signup_reminder_sent_at TIMESTAMPTZ;

COMMENT ON COLUMN members.abandoned_signup_reminder_sent_at IS
  'When the abandoned-signup-reminder email was sent (checkout never completed, no plan connection ever attached). NULL = not yet sent.';

SELECT cron.schedule(
  'daily-abandoned-signup-reminder',
  '0 21 * * *',  -- 9pm UTC daily - distinct from the 19:00/20:00 existing jobs
  $$
  SELECT net.http_post(
    url := 'https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/abandoned-signup-reminder',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"mode": "scheduled"}'::jsonb
  ) AS request_id;
  $$
);
