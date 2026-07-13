-- Change daily-consistency-check cron job to weekly (Monday 6am AEST)
SELECT cron.schedule(
  'daily-consistency-check',
  '0 19 * * 1',  -- 19:00 UTC Monday = 6:00 AM AEST Monday
  $$
  SELECT net.http_post(
    url := 'https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/check-consistency',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"mode": "scheduled"}'::jsonb
  ) AS request_id;
  $$
);
