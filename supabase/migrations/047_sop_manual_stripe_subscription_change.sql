-- SOP: manually changing a member's subscription in Stripe (tier change).
-- Written from a live, fully verified change on 2026-10-14 (webhook logs, Stripe
-- invoice, Memberstack plan connection, Supabase and Webflow all checked), then
-- extended the next day with the profile URL (slug) and redirect handling for
-- moves between the individual and business tiers.
-- Contains no member details on purpose: this repo is public.
-- Re-runnable: replaces its own earlier row so the text can be revised here.

DELETE FROM public.sops WHERE title LIKE 'Manually Changing a Member%';

INSERT INTO public.sops (title, category, content) VALUES (
  'Manually Changing a Member''s Subscription in Stripe (Tier Change)',
  'Billing & Retention',
$sop$WHAT THIS COVERS
Moving a current member to a different tier (for example Emerging to Small Business) by editing their existing subscription in the Stripe Dashboard, instead of cancelling and re-joining. Use it when someone picked the wrong tier at signup or wants to upgrade part way through the year. Verified end to end on a real change on 14 Oct 2026.

If the move crosses between the individual tiers (Emerging, Professional) and the business tiers (Small Business, Large Business, Not For Profit, Spaces & Suppliers, Partner), also follow PART 2 below. The profile URL does not change by itself.

WHEN NOT TO USE THE OTHER OPTIONS
- Do NOT use the admin dashboard's "Manage Membership" tool with the billing change left on. Memberstack's add-plan only attaches free plans, so it would cancel the old plan, fail to add the paid one, and start the lapse flow (profile archived, "membership has ended" email).
- Do NOT cancel the old subscription first, for the same reason.
- Do NOT have the member re-join as a new account: they pay the full new price on top of what they already paid, and need a refund.

PART 1: THE BILLING CHANGE

Before you start
1. Agree the tier and price with the member, and get their OK to the charge. The change bills their card on file immediately.
2. Check the target price in Stripe (Product catalogue) is the current active price for that tier, with the same billing interval as their current one. Each tier should have one active yearly and one active monthly price. Use the price that carries Memberstack's metadata (msPriceId).
3. Note the member's email and Memberstack ID for the checks at the end.

Steps in Stripe
1. Customers > the member > Subscriptions > ... > Update subscription.
2. Add product: the new tier's price (same interval as now).
3. Remove the old tier's row (... menu > Remove).
4. Leave "Reset billing cycle anchor to now" UNTICKED. The renewal date stays the same.
5. Proration: tick "Bill for prorated change amount" and choose "Immediately after update". Stripe credits the unused time on the old tier, charges the remaining time on the new tier, and puts both on one invoice paid from the card on file.
6. Check "Free trial days" is empty. Leave the tax setting as it was.
7. Read the preview total, then press Update subscription.
Expect the member's total paid to land slightly under the new tier price, because the days already used on the old tier are not charged at the new rate.

What happens automatically (observed)
- Stripe: same subscription, item swapped, one invoice created and paid.
- Memberstack: the plan connection updates in place within seconds (new plan, new price, same renewal date). No cancel event, no lapse emails, no archiving.
- Our webhook: Memberstack sends member.plan.updated, but with an empty "reason" list, and the handler only acts when the reason says the plan or price changed. So it logs "nothing to do" and ignores it.
- Result: the membership-type custom field in Memberstack, the membership type in Supabase, and the member type in Webflow all STAY ON THE OLD TIER. No scheduled job corrects this later.
- The Stripe subscription's own metadata keeps the old plan label. This is cosmetic: nothing in our code reads it.

Required manual step afterwards
Admin dashboard > the member > Manage Membership > choose the new type > TICK "Skip billing change (update label only)" > Update Membership. This updates the Memberstack custom field, Supabase and Webflow only. It does not touch billing. The profile page then shows the new tier's layout.

PART 2: PROFILE URL WHEN CROSSING THE INDIVIDUAL / BUSINESS LINE

Why this needs its own steps
Emerging and Professional profiles live at /members/first-last. The business tiers use the business name instead. Changing the tier does NOT change the URL. Slugs are set once, at onboarding, and our sync deliberately never updates them. So after the label update the profile shows the business layout but is still at the personal-name URL, and the old URL keeps working until someone changes it. Nothing breaks if you leave it, but the profile will not match other business listings. Decide with the member and the team whether to move it. We recommend moving it.

The same steps apply in reverse (business to individual), using the personal-name slug.

Steps, in this order
1. Business name first. Best: the member completes Business Details in Edit Profile, because saving there sets BOTH business_name and the display name (the profile's "name", which becomes the page heading and title) in one go. If you enter it by hand instead, set both business_name AND name in Supabase (business members have name equal to the business name). Setting only business_name leaves the page heading and browser title on the personal name. Either way the change reaches Webflow within seconds and publishes itself. Confirm: Supabase business_name and name, and the Webflow "Trading or business name" field and item name. The Memberstack trading-name field does not need updating: the profile form never writes it. Do not pick a slug until the name is there, because the name they use may differ from what we assumed.
2. Choose the new slug: the business name, lowercase, letters and numbers with single hyphens, no punctuation (the same rule onboarding uses). Check it is free: no other row in Supabase members.slug, no other Webflow member with that slug (add -2 if taken), and no static page at that address.
3. Webflow CMS: change the member item's slug to the new one (CMS editor, or the Webflow API).
4. Redirect: Webflow site settings > Publishing > 301 Redirects. Add /members/old-slug pointing to /members/new-slug. This has to be done by hand: Webflow's redirect API is Enterprise only and our site is not on that plan (confirmed). Redirects only take effect when the site is published.
5. Publish the site from Webflow. Do the slug change and the redirect in the same publish, so there is no window where the old link shows a 404.
6. Supabase: set members.slug to the new slug. The query-members "sync-member-slugs" mode copies slugs from Webflow into Supabase for every member, which is fine because it only reads from Webflow. Check afterwards that only this one member changed.
7. Memberstack custom fields: set slug, and set member-webflow-url to https://www.mtnsmade.com.au/members/new-slug. The nav's "My profile" link reads member-webflow-url, so if it is left stale the member's own link goes via the redirect instead of straight to the page.
8. Tell the member their new URL, and use it for anything shared from now on (event lists, social posts, emails).

About the redirect
- Old links in emails, social posts, search results and printed material keep working through the 301, and search engines pass the old page's standing to the new one.
- Keep redirects permanently. Do not remove them later.
- If the same member's URL ever changes again, edit the existing redirect so it points at the newest URL, rather than adding a second one. That avoids chains of redirects.

VERIFY ALL OF THESE
- Stripe: new invoice paid, one active subscription item on the new price.
- Memberstack: one plan connection showing the new plan and amount, and membership-type set to the new tier.
- Supabase members: membership type is the new tier, subscription_status is active.
- Webflow: the member's type is the new tier, and the live profile shows the new layout after a hard refresh. For a business tier, the page heading and browser title show the business name, not the personal name.
- If the URL was moved: the old URL answers with a 301 to the new one (check with curl -I), the new URL answers 200 and shows the business name, the nav "My profile" link goes to the new URL, and Supabase slug, Memberstack slug and Webflow slug all match.

TELL THE MEMBER
- What they were charged today and when it renews (unchanged).
- If they moved to a business tier, they can now complete the Business Details section (trading name and so on) in Edit Profile, and what their new profile URL is.

OPEN ITEMS
- Fix the member.plan.updated handler so it does not depend on the "reason" list (re-read the member from Memberstack and re-resolve their type). Once shipped, the label step becomes a check only, and this SOP should be updated.
- Steps 6 and 7 of PART 2 are separate manual jobs today. A small admin action that sets the slug in Supabase, Memberstack and Webflow together would remove most of the risk.
- Not yet tested the same way: a billing-interval change on the same tier, and a downgrade. A downgrade should leave a credit on the customer rather than a refund. Check before promising a refund.
- The self-service Stripe portal does not currently show a "switch plan" option, so members cannot do this themselves.$sop$
);
