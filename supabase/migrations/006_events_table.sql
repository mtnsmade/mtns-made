-- MTNS MADE Supabase Migration: Events Table
-- Member submitted events

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  webflow_id TEXT UNIQUE,

  -- Content
  name TEXT NOT NULL,
  description TEXT,
  feature_image_url TEXT,

  -- Event Details
  event_date DATE,
  event_time TEXT,
  location TEXT,
  ticket_url TEXT,

  -- Status (for approval workflow)
  status TEXT DEFAULT 'pending',  -- pending, approved, rejected

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_member ON events(member_id);
CREATE INDEX IF NOT EXISTS idx_events_webflow ON events(webflow_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);

-- Updated_at trigger
CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Verification
-- SELECT status, COUNT(*) as count
-- FROM events
-- GROUP BY status;
