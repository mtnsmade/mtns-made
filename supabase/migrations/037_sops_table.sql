-- SOPs table for MTNS MADE admin dashboard
-- Read-only reference documentation, visible to the team. Seeded via migration for now;
-- an add/edit UI is a planned fast-follow, not built in this pass.

CREATE TABLE public.sops (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  category    text,
  content     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS: open read for anon (dashboard is behind Webflow password protection, matching support_tasks).
-- Read-only for now — no write policy, since this table is authored via migration/service role only.
ALTER TABLE public.sops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read SOPs" ON public.sops
  FOR SELECT TO anon USING (true);

CREATE OR REPLACE FUNCTION public.touch_sop()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER sop_updated
  BEFORE UPDATE ON public.sops
  FOR EACH ROW EXECUTE FUNCTION public.touch_sop();

-- Seed: Member Non-Payment Lifecycle SOP
INSERT INTO public.sops (title, category, content) VALUES (
  'Member Non-Payment Lifecycle',
  'Billing & Retention',
$sop$WHAT THIS COVERS
What happens, automatically, when a member's Memberstack subscription is genuinely cancelled (not just a temporary failed-payment retry).

TIMELINE (30 days total, matching the policy already promised on the site)

Day 0 — Memberstack plan flips to CANCELED
- Only a real cancellation triggers this, never a "REQUIRES_PAYMENT" retry state. Stripe/Memberstack may retry a failed card several times first — we deliberately leave those members untouched until Memberstack confirms CANCELED, so a member never gets wrongly archived over a card that's mid-retry.
- Profile is archived in Webflow (hidden from the public directory, not deleted).
- Projects are archived.
- Site is republished so the change goes live.
- Immediate email: "Your MTNS MADE membership has ended" — includes a resubscribe link.

Days 1-19 — Silent period
- No further emails sent. This is intentional: it gives the member time to notice their profile is gone and reactivate on their own, without repeated nagging.
- If they resubscribe during this window, the daily reconciliation job automatically restores everything — profile, projects, and the archived flag — with no data loss and no email needed to confirm it (this already happens today, unchanged by this SOP).

Day 20 — Final retention warning
- One email: "Your profile data will be removed soon", naming the exact removal date (day 30) and linking to reactivation.
- Sent once — guarded so it can't be sent twice for the same lapse.

Day 30 — Hard delete
- Webflow profile and project CMS items are permanently deleted (not just archived).
- All uploaded images in storage are permanently deleted.
- The Supabase database record is marked deleted (kept for our own audit trail, not visible anywhere on the site).
- Site is republished.
- This does NOT touch the member's Memberstack or Stripe account/billing history — only their site presence and portfolio data.

OPEN ITEMS / THINGS TO WATCH
- Webflow's API token is currently missing the "sites:write" permission scope, so the automatic site republish after archiving or deleting a member does not actually take effect yet — until that's fixed, Hannah needs to manually click Publish in Webflow after any archive/delete event.
- We don't have direct access to Stripe's own billing settings, and Memberstack's own transactional email list doesn't include a "payment failed" type — so any card-retry emails a member gets during the pre-cancellation period come directly from Stripe's own dunning settings, which we can't see. Worth confirming directly with the client (Stripe Dashboard → Settings → Billing → Subscriptions and emails) so our Day 0 and Day 20 emails don't duplicate or contradict whatever Stripe is already sending.
- A planned Mailchimp automation (marking cancelled members with a lifecycle tag) is a separate future project — when that's built, it needs to avoid sending its own competing emails on the same Day 0/Day 20 touchpoints this SOP already owns.
- An exit survey ("why are you leaving?") on the Day 0 email is a natural next addition, not yet built.$sop$
);
