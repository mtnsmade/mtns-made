-- Support admin-created opportunities (no submitting member).
-- Root cause of the Propel Projects incident (2026-08-07): the admin dashboard had
-- no way to create an opportunity, so Webflow's own CMS editor was used instead,
-- which never propagates to Supabase (the live site's actual data source).
-- This migration + the paired admin-dashboard.js change close that gap.

-- memberstack_id was NOT NULL because every opportunity used to come from a
-- member's own submission. Admin-authored opportunities (e.g. a council program
-- posted on a member's behalf) have no member to attach.
ALTER TABLE opportunities
ALTER COLUMN memberstack_id DROP NOT NULL;

-- Webflow's "contact-name" field is normally derived from the submitting member's
-- name. Admin-created opportunities need their own free-text contact name instead.
ALTER TABLE opportunities
ADD COLUMN IF NOT EXISTS contact_name TEXT;

COMMENT ON COLUMN opportunities.contact_name IS
  'Free-text contact name for admin-created opportunities with no submitting member. Ignored when memberstack_id is set (the member''s own name is used instead).';
