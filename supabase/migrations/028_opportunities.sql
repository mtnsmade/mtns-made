-- Migration 028: Jobs & Opportunities
-- Creates the opportunities table mirroring the events workflow

CREATE TABLE IF NOT EXISTS opportunities (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memberstack_id      TEXT NOT NULL,
  member_contact_email TEXT,

  -- Listing content
  name                TEXT NOT NULL,
  slug                TEXT UNIQUE,
  opportunity_type    TEXT,        -- 'job', 'commission', 'collaboration', 'call-for-entries', 'residency', 'volunteer'
  discipline          TEXT,        -- free-text or category slug
  organization        TEXT,
  description         TEXT,
  how_to_apply        TEXT,
  opportunity_url     TEXT,
  suburb_id           UUID REFERENCES suburbs(id),
  is_remote           BOOLEAN NOT NULL DEFAULT false,
  closing_date        DATE,
  feature_image_url   TEXT,

  -- Workflow state (mirrors events)
  is_draft            BOOLEAN NOT NULL DEFAULT true,   -- true = pending review
  is_archived         BOOLEAN NOT NULL DEFAULT false,  -- true = rejected or expired

  -- Webflow sync
  webflow_id          TEXT,

  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for member lookups
CREATE INDEX IF NOT EXISTS opportunities_memberstack_id_idx ON opportunities(memberstack_id);

-- Index for pending review queries
CREATE INDEX IF NOT EXISTS opportunities_pending_idx ON opportunities(is_draft, is_archived);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_opportunities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_opportunities_updated_at();
