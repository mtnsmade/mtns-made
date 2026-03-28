-- Schedule daily subscription reconciliation job
-- This runs the subscription-reconcile edge function daily at 6am AEST
-- Catches any mismatches between Memberstack and Supabase subscription statuses
-- and automatically restores members/projects that should be active

-- Schedule the subscription reconciliation job to run daily at 6am Sydney time
-- pg_cron uses UTC: 7pm UTC = 6am AEST (UTC+11) / 5am AEDT (UTC+10)
SELECT cron.schedule(
  'daily-subscription-reconcile',       -- job name
  '0 19 * * *',                         -- cron expression: 7pm UTC = 6am AEST daily
  $$
  SELECT net.http_post(
    url := 'https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/subscription-reconcile',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
