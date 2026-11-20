-- 051_members_public_columns.sql
-- Member records: the browser now reads and writes a member's own row through
-- the member-self edge function (verified Memberstack login, service role),
-- and the admin dashboard through admin-data. Direct access with the public
-- key is limited to the columns the public site displays.
--
-- Apply only after member-self is deployed and the updated onboarding,
-- edit profile, profile checklist, projects and directory scripts are live.

BEGIN;

REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.members FROM anon, authenticated;

GRANT SELECT (
  id, name, slug, business_name, webflow_id,
  suburb_id, bio, short_summary, profile_image_url, header_image_url,
  membership_type_id, status, subscription_status, profile_complete, is_deleted,
  is_creative_space, is_supplier, show_opening_hours,
  opening_monday, opening_tuesday, opening_wednesday, opening_thursday,
  opening_friday, opening_saturday, opening_sunday,
  website, instagram, facebook, linkedin, tiktok, youtube,
  created_at, updated_at
) ON TABLE public.members TO anon, authenticated;

COMMIT;
