-- Enable pg_cron extension and schedule weekly profile reminder job
-- This runs the profile-reminder edge function weekly on Monday at 9am AEST
-- Also sends a summary email to support@mtnsmade.com.au

-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;

-- Schedule the profile reminder job to run weekly on Monday 9am Sydney time
-- pg_cron uses UTC: Sunday 22:00 UTC = Monday 9am AEST (UTC+11)
SELECT cron.schedule(
  'weekly-profile-reminder',          -- job name
  '0 22 * * 0',                       -- cron expression: Sunday 10pm UTC = Monday 9am AEST
  $$
  SELECT net.http_post(
    url := 'https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/profile-reminder',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"mode": "scheduled"}'::jsonb
  ) AS request_id;
  $$
);

-- Note: pg_net extension is required for HTTP calls from cron jobs
-- This should already be enabled in Supabase by default
