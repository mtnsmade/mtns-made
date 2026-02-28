-- Enable pg_cron extension and schedule daily profile reminder job
-- This runs the profile-reminder edge function daily at 9am AEST

-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;

-- Schedule the profile reminder job to run daily at 9am Sydney time (AEST/AEDT)
-- pg_cron uses UTC, so we use 22:00 UTC (previous day) = 9am AEST (or 23:00 UTC for AEDT)
-- Using 22:00 UTC as a reasonable middle ground
SELECT cron.schedule(
  'daily-profile-reminder',           -- job name
  '0 22 * * *',                       -- cron expression: 10pm UTC = 9am AEST+11 / 8am AEDT+10
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
