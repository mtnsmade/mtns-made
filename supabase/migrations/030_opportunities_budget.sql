-- Migration: Add budget field to opportunities table
-- Also adds criteria as a distinct field from how_to_apply

ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS budget TEXT,
  ADD COLUMN IF NOT EXISTS criteria TEXT;

COMMENT ON COLUMN opportunities.budget IS 'Budget or remuneration for the opportunity (free text, e.g. "$500-1000 AUD")';
COMMENT ON COLUMN opportunities.criteria IS 'Required attributes/selection criteria the candidate must have';
