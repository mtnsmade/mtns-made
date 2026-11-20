-- 050_support_report_cron_auth.sql
-- The support-report function now accepts internal callers only. The cron job
-- sends the shared internal secret, read from Supabase Vault at run time, so
-- the value never appears in this repo or in the job definition.
--
-- Prerequisite (run once, out of band, with the real value):
--   SELECT vault.create_secret('<INTERNAL_FN_SECRET value>', 'internal_fn_secret');

SELECT cron.alter_job(
  (SELECT jobid FROM cron.job WHERE jobname = 'biweekly-support-report'),
  command := $cmd$
  SELECT net.http_post(
    url := 'https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/support-report',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-internal-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'internal_fn_secret')
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $cmd$
);
