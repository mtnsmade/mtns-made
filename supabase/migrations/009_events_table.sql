-- MTNS MADE Supabase Migration: Events Table
-- Community events (can be MTNS MADE events or member-submitted)

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- System IDs
  webflow_id TEXT UNIQUE,
  memberstack_id TEXT,        -- Submitter's memberstack ID
  eventbrite_id TEXT,

  -- Basic Info
  name TEXT NOT NULL,
  slug TEXT UNIQUE,

  -- Owner/Submitter (optional - some events are MTNS MADE events)
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  member_contact_email TEXT,

  -- Date & Time
  time_display TEXT,          -- Human-readable time string
  date_display TEXT,          -- Human-readable date string
  date_start TIMESTAMPTZ,
  date_end TIMESTAMPTZ,
  date_expiry TIMESTAMPTZ,    -- When to stop showing the event

  -- Location
  location_name TEXT,
  location_address TEXT,
  suburb_id UUID REFERENCES suburbs(id),

  -- Content
  short_description TEXT,
  description TEXT,           -- Full description (may contain HTML)
  feature_image_url TEXT,

  -- Links
  rsvp_link TEXT,

  -- Display Options
  is_mtns_made_event BOOLEAN DEFAULT false,  -- Official MTNS MADE event
  is_featured BOOLEAN DEFAULT false,
  is_past BOOLEAN DEFAULT false,

  -- Status
  is_archived BOOLEAN DEFAULT false,
  is_draft BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EVENT MEMBERS (Many-to-Many)
-- ============================================

-- Events can involve multiple members
CREATE TABLE IF NOT EXISTS event_members (
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, member_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_events_webflow ON events(webflow_id);
CREATE INDEX IF NOT EXISTS idx_events_member ON events(member_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_date_start ON events(date_start);
CREATE INDEX IF NOT EXISTS idx_events_suburb ON events(suburb_id);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_events_upcoming ON events(date_expiry) WHERE is_past = false;
CREATE INDEX IF NOT EXISTS idx_event_members_member ON event_members(member_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE events IS 'Community events - both MTNS MADE official and member-submitted';
COMMENT ON COLUMN events.is_mtns_made_event IS 'True if this is an official MTNS MADE event';
COMMENT ON COLUMN events.date_expiry IS 'When to stop displaying the event (usually same as date_end)';
