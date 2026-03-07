-- MTNS MADE Supabase Migration: Project Reminder
-- Adds tracking for project reminder emails
-- Runs weekly, 7 days after profile completion, for members with no projects

-- Add column to track when project reminder was sent
ALTER TABLE members
ADD COLUMN IF NOT EXISTS project_reminder_sent_at TIMESTAMPTZ;

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_members_project_reminder
ON members(profile_complete, profile_completed_at, project_reminder_sent_at)
WHERE profile_complete = true AND project_reminder_sent_at IS NULL;

-- Schedule weekly cron job (runs every Monday at 10am Sydney time)
-- Using pg_cron extension
SELECT cron.schedule(
  'project-reminder-weekly',
  '0 23 * * 0',  -- 10am Monday Sydney = 11pm Sunday UTC (during daylight saving)
  $$
  SELECT net.http_post(
    url := 'https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/project-reminder',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := '{"mode": "scheduled"}'::jsonb
  );
  $$
);

-- Comment describing the job
COMMENT ON COLUMN members.project_reminder_sent_at IS 'Timestamp when project reminder email was sent to member';
