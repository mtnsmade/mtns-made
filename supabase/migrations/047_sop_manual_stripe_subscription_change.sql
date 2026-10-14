-- SOP: manually changing a member's subscription in Stripe (tier change).
-- Written from a live, fully verified change on 2026-10-14 (webhook logs, Stripe
-- invoice, Memberstack plan connection, Supabase and Webflow all checked).
-- Contains no member details on purpose: this repo is public.

INSERT INTO public.sops (title, category, content)
SELECT
  'Manually Changing a Member''s Subscription in Stripe (Tier Change)',
  'Billing & Retention',
$sop$WHAT THIS COVERS
Moving a current member to a different tier (for example Emerging to Small Business) by editing their existing subscription in the Stripe Dashboard, instead of cancelling and re-joining. Use it when someone picked the wrong tier at signup or wants to upgrade part way through the year. Verified end to end on a real change on 14 Oct 2026.

WHEN NOT TO USE THE OTHER OPTIONS
- Do NOT use the admin dashboard's "Manage Membership" tool with the billing change left on. Memberstack's add-plan only attaches free plans, so it would cancel the old plan, fail to add the paid one, and start the lapse flow (profile archived, "membership has ended" email).
- Do NOT cancel the old subscription first, for the same reason.
- Do NOT use "Add payment" / re-join as a new account: the member pays the full new price on top of what they already paid, and needs a refund.

BEFORE YOU START
1. Agree the tier and price with the member, and get their OK to the charge. The change bills their card on file immediately.
2. Check the target price in Stripe (Product catalogue) is the current active price for that tier, with the same billing interval as their current one. Each tier should have one active yearly and one active monthly price. Use the price that carries Memberstack's metadata (msPriceId).
3. Note the member's email and Memberstack ID for the checks at the end.

STEPS IN STRIPE
1. Customers > the member > Subscriptions > ... > Update subscription.
2. Add product: the new tier's price (same interval as now).
3. Remove the old tier's row (... menu > Remove).
4. Leave "Reset billing cycle anchor to now" UNTICKED. The renewal date stays the same.
5. Proration: tick "Bill for prorated change amount" and choose "Immediately after update". Stripe credits the unused time on the old tier, charges the remaining time on the new tier, and puts both on one invoice paid from the card on file.
6. Check "Free trial days" is empty. Leave the tax setting as it was.
7. Read the preview total, then press Update subscription.
Expect the member's total paid to land slightly under the new tier price, because the days already used on the old tier are not charged at the new rate.

WHAT HAPPENS AUTOMATICALLY (observed)
- Stripe: same subscription, item swapped, one invoice created and paid.
- Memberstack: the plan connection updates in place within seconds (new plan, new price, same renewal date). No cancel event, no lapse emails, no archiving.
- Our webhook: Memberstack sends member.plan.updated, but with an empty "reason" list, and the handler only acts when the reason says the plan or price changed. So it logs "nothing to do" and ignores it.
- Result: the membership-type custom field in Memberstack, the membership type in Supabase, and the member type in Webflow all STAY ON THE OLD TIER. No scheduled job corrects this later.
- The Stripe subscription's own metadata keeps the old plan label. This is cosmetic: nothing in our code reads it.

REQUIRED MANUAL STEP AFTERWARDS
Admin dashboard > the member > Manage Membership > choose the new type > TICK "Skip billing change (update label only)" > Update Membership. This updates the Memberstack custom field, Supabase and Webflow only. It does not touch billing.

VERIFY ALL FOUR
- Stripe: new invoice paid, one active subscription item on the new price.
- Memberstack: one plan connection showing the new plan and amount, and membership-type field set to the new tier.
- Supabase members: membership type is the new tier, subscription_status is active.
- Webflow: the member's type is the new tier, and the live profile shows the new layout after a hard refresh.

TELL THE MEMBER
- What they were charged today and when it renews (unchanged).
- If they moved to a business tier, they can now complete the Business Details section (trading name and so on) in Edit Profile.

OPEN ITEMS
- Fix the member.plan.updated handler so it does not depend on the "reason" list (re-read the member from Memberstack and re-resolve their type). Once shipped, the manual step becomes a check only, and this SOP should be updated.
- Not yet tested the same way: a billing-interval change on the same tier, and a downgrade. A downgrade should leave a credit on the customer rather than a refund. Check before promising a refund.
- The self-service Stripe portal does not currently show a "switch plan" option, so members cannot do this themselves.$sop$
WHERE NOT EXISTS (
  SELECT 1 FROM public.sops WHERE title LIKE 'Manually Changing a Member%'
);
