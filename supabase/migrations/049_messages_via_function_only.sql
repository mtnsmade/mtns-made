-- 049_messages_via_function_only.sql
-- Member inbox reads and writes now go through the member-messages edge
-- function (service role, verified Memberstack login), and the admin
-- dashboard's counts through admin_message_stats(). The browser no longer
-- touches the messages table directly, so its remaining grants are removed.
--
-- Apply only after the member-messages function and the updated
-- member-messages.js / admin-dashboard.js are live.

BEGIN;
REVOKE SELECT, UPDATE ON TABLE public.messages FROM anon, authenticated;
COMMIT;
