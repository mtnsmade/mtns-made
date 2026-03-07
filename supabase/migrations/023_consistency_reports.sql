-- Migration: Consistency Reports Table and Cron Job
-- Stores data consistency check reports for Memberstack/Supabase/Webflow comparison

-- ============================================
-- 1. CREATE CONSISTENCY REPORTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS consistency_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Summary counts
  memberstack_count INTEGER NOT NULL DEFAULT 0,
  supabase_count INTEGER NOT NULL DEFAULT 0,
  webflow_count INTEGER NOT NULL DEFAULT 0,

  -- Issue counts
  critical_issues INTEGER NOT NULL DEFAULT 0,
  warning_issues INTEGER NOT NULL DEFAULT 0,
  info_issues INTEGER NOT NULL DEFAULT 0,

  -- Full report JSON
  report_data JSONB NOT NULL
);

-- Index for querying recent reports
CREATE INDEX IF NOT EXISTS idx_consistency_reports_created_at
  ON consistency_reports(created_at DESC);

-- ============================================
-- 2. RLS POLICIES
-- ============================================

ALTER TABLE consistency_reports ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert reports
CREATE POLICY "Service role can insert reports"
  ON consistency_reports
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow authenticated users to read reports (for admin dashboard)
CREATE POLICY "Authenticated users can read reports"
  ON consistency_reports
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 3. CRON JOB (runs daily at 6am Sydney time)
-- ============================================

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;

-- Schedule daily consistency check at 6:00 AM Sydney time (AEST/AEDT)
-- pg_cron uses UTC: 19:00 UTC = 6am AEST (UTC+11)
SELECT cron.schedule(
  'daily-consistency-check',
  '0 19 * * *',  -- 19:00 UTC = 6:00 AM AEST
  $$
  SELECT net.http_post(
    url := 'https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/check-consistency',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"mode": "scheduled"}'::jsonb
  ) AS request_id;
  $$
);

-- Add comment
COMMENT ON TABLE consistency_reports IS 'Stores data consistency check reports comparing Memberstack, Supabase, and Webflow member data';
