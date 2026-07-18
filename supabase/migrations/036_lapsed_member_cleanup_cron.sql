-- Schedule daily lapsed member cleanup job (Member Non-Payment Lifecycle SOP)
-- Day 20 since lapse: sends final retention warning email
-- Day 30 since lapse: hard-deletes the member's site data (Webflow + storage)
--
-- Scheduled 15 minutes after daily-subscription-reconcile (6:00am AEST) so any
-- members restored to active in that run are excluded before this one queries lapsed members.
-- pg_cron uses UTC: 19:15 UTC = 6:15 AM AEST (UTC+11) / 5:15 AEDT (UTC+10)
SELECT cron.schedule(
  'daily-lapsed-member-cleanup',
  '15 19 * * *',
  $$
  SELECT net.http_post(
    url := 'https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/lapsed-member-cleanup',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
