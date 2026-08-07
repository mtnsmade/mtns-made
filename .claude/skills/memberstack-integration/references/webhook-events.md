# Memberstack webhook events

Confirmed event names, sourced directly from Memberstack's developer docs
(2026-08-07), not guessed from naming conventions:

| Event | Fires when | Handled in this project? |
|---|---|---|
| `member.created` | New member account created | Yes — `createMember()` |
| `member.updated` | Member details/profile modified | Yes — `handleMemberUpdated()` |
| `member.plan.added` | A subscription plan is assigned to a member (including post-creation, e.g. after checkout) | Yes, as of 2026-08-07 — see incident below |
| `member.plan.canceled` | A member's subscription plan is canceled | Yes — `handleMemberPlanCanceled()` |
| `member.deleted` | Member account deleted | Yes — `handleMemberDeleted()` |

This list reflects what's documented publicly — if a webhook payload arrives with an
event name not in this table, treat that as new information worth updating this file
with, not a one-off to silently ignore.

## Incident: the missing `member.plan.added` case (2026-08-07)

`member-signup-2026.js` creates a member **without a plan first** (fast), then
redirects to Memberstack checkout to attach the plan. This means:

1. `member.created` fires immediately, with empty `planConnections` — correctly
   sets `membership_type_id` to null at that point, since there's genuinely no plan
   yet.
2. Checkout completes, plan gets attached — Memberstack fires `member.plan.added`.
   The webhook's switch statement had no case for this event at all, so nothing ever
   ran the membership-type lookup again. `membership_type_id` stayed null forever.

This wasn't caught by testing because the member's profile still worked, was still
publicly visible, and still showed the correct Memberstack plan when checked
directly — only the Supabase-side classification silently never got set. It surfaced
as members showing "Not set" for Type in the admin dashboard, weeks or months after
their actual signup.

**Two-layer fix applied:**
1. `check-consistency`'s missing-record auto-fix (already runs weekly) now also
   resolves `membership_type_id` on creation, using the same active-plan-name lookup
   pattern as the webhook. This is the real safety net — it doesn't depend on
   correctly guessing which event might be missing a handler; it just periodically
   reconciles actual Memberstack state regardless of cause.
2. `getOrCreateMember()` in `member-onboarding-supabase.js` (a separate fallback
   that creates a Supabase record when the signup webhook hasn't fired yet by the
   time a member reaches onboarding) also now resolves the type at creation.

**Lesson for next time:** when a webhook-driven field silently isn't set, don't
assume it's the specific event you're looking at — check every code path that can
create or update the record in question. This bug existed in three separate places
(the webhook itself, `getOrCreateMember`, and `check-consistency`'s auto-fix), and
only two of the three were obviously connected to "the webhook."
