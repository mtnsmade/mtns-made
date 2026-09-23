-- 044_revoke_anon_write_grants.sql
-- Security review 2026-09-23, P0 #1 (partial remediation).
--
-- CONTEXT
-- RLS is enabled on all 22 public tables, but every policy evaluates to
-- `USING (true)` / `WITH CHECK (true)` for anon, and anon holds full
-- arwdDxtm (INSERT/SELECT/UPDATE/DELETE) grants. The Supabase anon key is
-- embedded in client JS in a PUBLIC GitHub repo, so anyone can read, modify
-- and delete any row in the database.
--
-- Table GRANTs are checked BEFORE RLS policies, so revoking a grant is a hard
-- stop regardless of how permissive the policy is. That makes this the fastest
-- way to cut the blast radius without rewriting every policy first.
--
-- SCOPE OF THIS MIGRATION
-- Writes are revoked ONLY where the browser demonstrably never performs them.
-- Every `.from('<table>').insert/update/delete/upsert(...)` call in both
-- src/scripts/*.js and dist/scripts/*.js (dist is what the live site actually
-- serves) was enumerated first; anything the client genuinely uses is left
-- alone so no member-facing flow breaks.
--
-- All 27 edge functions use the service role key, which bypasses both grants
-- and RLS, so none of them are affected by this migration. Verified: no edge
-- function constructs a client with the anon key.
--
-- `authenticated` is revoked identically. Supabase Auth is unused here
-- (auth.users is empty - Memberstack is the identity provider), but that role
-- carries the same full grants, so leaving it would let anyone who can obtain
-- an authenticated token walk straight around these revokes.
--
-- WHAT THIS DOES *NOT* FIX
-- SELECT is untouched, so all 421 member rows (incl. email) and all private
-- messages remain readable by anyone holding the public anon key. Column-
-- scoping members.SELECT was attempted and rejected for now: profile editing
-- and onboarding both call .select('*') on the member's own row, which would
-- break under column-level grants. That needs client changes first.
-- events, opportunities and support_tasks keep all three write grants because
-- the browser genuinely performs all of them.
-- The real fix remains per-member identity in RLS (Memberstack -> Supabase JWT
-- exchange, or routing writes through authenticated edge functions).

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Tables the browser never writes to. Reference/lookup data, join tables
--    maintained server-side, and internal logs. Reads are left intact.
-- ---------------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE ON TABLE
    public.activity_log,
    public.consistency_reports,
    public.creative_space_categories,
    public.directories,
    public.event_members,
    public.member_directories,
    public.membership_types,
    public.sops,
    public.sub_directories,
    public.suburbs,
    public.supplier_categories
  FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Tables the browser writes, but not with every verb.
-- ---------------------------------------------------------------------------

-- Members are only ever created/updated from onboarding and profile editing.
-- Deletion is handled server-side (lapsed-member-cleanup, memberstack-webhook).
REVOKE DELETE ON TABLE public.members FROM anon, authenticated;

-- Projects are created/updated by their owner in the browser; deletion goes
-- through admin-tools' delete-project action on the service role.
REVOKE DELETE ON TABLE public.projects FROM anon, authenticated;

-- Messages are written by contact-member (service role). The browser only
-- marks them read and appends replies, both UPDATEs.
REVOKE INSERT, DELETE ON TABLE public.messages FROM anon, authenticated;

-- The category/join tables are maintained delete-then-insert; UPDATE is never
-- used against them from the client.
REVOKE UPDATE ON TABLE
    public.member_space_categories,
    public.member_sub_directories,
    public.member_supplier_categories,
    public.project_sub_directories,
    public.support_task_comments
  FROM anon, authenticated;

COMMIT;
