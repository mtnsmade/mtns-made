-- 048_admin_message_stats_rpc.sql
-- Message counts for the admin dashboard, without reading message rows.
-- Returns totals only (no names, addresses or content), so the dashboard's
-- stats panel keeps working once message rows are only reachable through the
-- member-messages edge function.

CREATE OR REPLACE FUNCTION public.admin_message_stats(month_start timestamptz)
RETURNS TABLE (total bigint, unread bigint, this_month bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    count(*)                                       AS total,
    count(*) FILTER (WHERE NOT coalesce(is_read, false)) AS unread,
    count(*) FILTER (WHERE created_at >= month_start)    AS this_month
  FROM public.messages;
$$;

REVOKE ALL ON FUNCTION public.admin_message_stats(timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_message_stats(timestamptz) TO anon, authenticated;
