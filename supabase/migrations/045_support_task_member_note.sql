-- 045_support_task_member_note.sql
--
-- A staff-written message to the member, included in the "your support
-- request has been resolved" email that admin-dashboard.js sends when a
-- Member Support task is marked Complete.
--
-- Deliberately separate from `notes`, which the dashboard labels "internal
-- only, not sent to the member" and which staff use for resolution details
-- that were never meant for the member's inbox. Reusing `notes` would have
-- silently started emailing those to members.
--
-- Members never see tickets on the site (they only submit them, via the
-- submit-support-ticket edge function), so the resolution email is the only
-- place this text reaches them.
--
-- Additive and nullable: existing rows and every existing query are unaffected.

ALTER TABLE public.support_tasks
  ADD COLUMN IF NOT EXISTS member_note TEXT;

COMMENT ON COLUMN public.support_tasks.member_note IS
  'Message to the member, included in the resolution email when a member_support task is marked complete. Not internal - see notes for that.';
