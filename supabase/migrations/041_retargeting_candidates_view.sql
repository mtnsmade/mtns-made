-- Retargeting candidates: past members no longer active, for future win-back
-- campaigns (Mailchimp or otherwise - not wired to anything yet, this is just
-- the queryable list). A view, not a table, so it always reflects current
-- members data with no separate sync step to maintain.
--
-- Scope: every member whose subscription_status is currently 'lapsed' or
-- 'deleted' (i.e. not an active member right now), regardless of how long
-- ago they lapsed - no recency cutoff, per explicit instruction.

CREATE OR REPLACE VIEW retargeting_candidates AS
SELECT
  m.id,
  m.email,
  m.first_name,
  m.last_name,
  m.name,
  m.business_name,
  mt.name AS membership_type,
  s.name AS suburb,
  m.subscription_status,
  m.subscription_lapsed_at,
  m.is_deleted,
  m.created_at AS member_since,
  m.updated_at AS last_status_change
FROM members m
LEFT JOIN membership_types mt ON mt.id = m.membership_type_id
LEFT JOIN suburbs s ON s.id = m.suburb_id
WHERE m.subscription_status IN ('lapsed', 'deleted')
ORDER BY m.subscription_lapsed_at DESC NULLS LAST;

COMMENT ON VIEW retargeting_candidates IS
  'Past members (lapsed or deleted) for future win-back/retargeting campaigns. Read-only view, no recency filter. See ROADMAP.md R-016.';

-- Views bypass the base table's RLS by default (they run with the creator's
-- privileges, not the querying role's) - members has RLS enabled specifically
-- because it holds real PII, so without this the view would be silently
-- world-readable through PostgREST's default anon/authenticated grants.
-- Confirmed and fixed live 2026-08-12: the view was briefly exposing real
-- member emails via the anon key before this ran.
REVOKE ALL ON retargeting_candidates FROM anon, authenticated;
GRANT SELECT ON retargeting_candidates TO service_role;
