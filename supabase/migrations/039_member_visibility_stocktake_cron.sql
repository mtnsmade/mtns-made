-- Schedule weekly member visibility stocktake (Hannah's request after the
-- Lucas Corroto / Theatre Technician visibility investigation)
-- Runs Monday 6:30am AEST, after daily-consistency-check (6:00am) and
-- daily-lapsed-member-cleanup (6:15am) to keep report emails staggered.
-- pg_cron uses UTC: 19:30 UTC = 6:30 AM AEST (UTC+11) / 5:30 AEDT (UTC+10)
SELECT cron.schedule(
  'weekly-member-visibility-stocktake',
  '30 19 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/member-visibility-stocktake',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
