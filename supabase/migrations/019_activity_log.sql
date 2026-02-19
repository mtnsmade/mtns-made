-- MTNS MADE Supabase Migration: Activity Log Table
-- Tracks member actions for admin dashboard activity feed

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  memberstack_id TEXT NOT NULL,

  -- Activity details
  activity_type TEXT NOT NULL,  -- 'profile_update', 'project_create', 'project_update', 'project_delete', 'event_submit', 'event_update'
  description TEXT NOT NULL,    -- Human-readable: "updated their profile"

  -- Related entity (optional)
  entity_type TEXT,             -- 'project', 'event', null for profile
  entity_id UUID,               -- ID of related project/event
  entity_name TEXT,             -- Name for display without extra query

  -- Webflow links for "View" button
  member_webflow_url TEXT,
  entity_webflow_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast dashboard queries (most recent first)
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- Index for member lookups
CREATE INDEX idx_activity_log_member ON activity_log(member_id);

-- Index for memberstack_id lookups
CREATE INDEX idx_activity_log_memberstack ON activity_log(memberstack_id);

-- Index for activity type filtering
CREATE INDEX idx_activity_log_type ON activity_log(activity_type);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for client-side logging via Edge Function)
-- The Edge Function handles validation
CREATE POLICY "Allow insert for all" ON activity_log
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read (admin dashboard needs this)
CREATE POLICY "Allow read for all" ON activity_log
  FOR SELECT
  USING (true);

-- No update or delete policies - activity log is append-only
