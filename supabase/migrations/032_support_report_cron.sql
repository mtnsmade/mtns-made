-- Schedule daily support report at 8:00 AM AEST (22:00 UTC)
-- Sends an email to contact@racket.net.au with new tasks, active backlog, and pattern analysis

SELECT cron.schedule(
  'biweekly-support-report',
  '0 22 * * 2,4',  -- 22:00 UTC = 8:00 AM AEST, Tuesdays and Thursdays
  $$
  SELECT net.http_post(
    url := 'https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/support-report',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
