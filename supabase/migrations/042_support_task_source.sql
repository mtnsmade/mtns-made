-- Differentiate internally-created support tickets (Hannah/Paul relaying an
-- email via the admin dashboard's "New Task" form) from ones a member
-- actually submitted themselves via /profile/support (submit-support-ticket
-- edge function). Needed so the admin dashboard's reply action can route a
-- reply to the right place: the member's own inbox for member-submitted
-- tickets, vs. the existing internal-only hello@ notification for everything
-- else. member_id alone isn't a reliable signal - plenty of internally
-- relayed tickets are already linked to a real member record too.
--
-- submitted_email captures the email address given at submission time,
-- independent of member_id linkage - needed for the "orphaned Memberstack
-- account" fallback case in submit-support-ticket where member_id can be
-- null even though the ticket is genuinely member-submitted.

alter table support_tasks
  add column if not exists source text not null default 'internal',
  add column if not exists submitted_email text;

alter table support_tasks
  drop constraint if exists support_tasks_source_check;

alter table support_tasks
  add constraint support_tasks_source_check check (source in ('member', 'internal'));

-- Backfill the one real member-submitted ticket that already exists (Daniel
-- Conway, 2026-09-16, submitted before this column existed).
update support_tasks
set source = 'member',
    submitted_email = 'daniel@danielconway.com.au'
where id = 'b41c0609-08b2-42b8-99ff-972bd1b5aa17';
