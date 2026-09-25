-- 046_member_payment_status.sql
--
-- Records WHEN a member's payment started failing, so a card that Stripe is
-- still retrying can be given a grace period instead of being treated as a
-- cancelled membership. Implements the "Member Non-Payment Lifecycle" SOP rule
-- that only a real CANCELED - never a REQUIRES_PAYMENT retry - archives anyone.
--
-- A row exists only while the member's plan is in a payment-failing state:
-- written the first time it's observed (memberstack-webhook member.updated, or
-- the daily subscription-reconcile), and deleted when the plan becomes active
-- again or genuinely ends. The ORIGINAL start date is kept across repeated
-- observations so the grace period can't be reset by a later event.
--
-- Deliberately a separate table, not a column on `members`: every column of
-- `members` is currently readable with the public anon key (2026-09-23
-- security review), and "this member's payment is failing" must not be public.
-- No grants and no RLS policies for anon/authenticated - only the service role
-- (edge functions) can read or write it.

CREATE TABLE IF NOT EXISTS public.member_payment_status (
  memberstack_id        TEXT PRIMARY KEY
                        REFERENCES public.members (memberstack_id) ON DELETE CASCADE,
  payment_failing_since TIMESTAMPTZ NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.member_payment_status IS
  'Members whose plan is currently in a payment-failing (retry) state, and since when. Service role only - never expose to anon.';

-- Supabase grants new public tables to anon/authenticated by default; undo that.
REVOKE ALL ON TABLE public.member_payment_status FROM anon, authenticated;
ALTER TABLE public.member_payment_status ENABLE ROW LEVEL SECURITY;
