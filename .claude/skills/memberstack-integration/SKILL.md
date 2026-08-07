---
name: memberstack-integration
description: MTNS MADE's Memberstack integration knowledge — Admin REST API patterns actually proven in this codebase, the confirmed webhook event list, and the data-ms-* Webflow attribute reference. Use this whenever working on anything touching Memberstack in this project — member signup/checkout flow, the memberstack-webhook edge function, the join/type page's price buttons, admin-update-member, subscription/plan changes, or any Webflow page with data-ms-* attributes. Also consult it before assuming a Memberstack capability doesn't exist (e.g. Plans/Prices aren't on the raw REST API, but that's a real, confirmed limit, not a guess) or before guessing at a webhook event name — check references/webhook-events.md first instead of re-deriving it from scratch.
---

# MTNS MADE — Memberstack Integration

This project's Memberstack usage is entirely server-side (Deno edge functions calling
the raw Admin REST API via `fetch()`) plus client-side DOM package calls and Webflow
`data-ms-*` attributes. There is no `@memberstack/admin` or `@memberstack/dom` npm
package in this codebase — everything is hand-rolled `fetch()` calls. Keep that in
mind before assuming an SDK method is available.

## Admin REST API — proven patterns

Base URL: `https://admin.memberstack.com`. Auth: `X-API-KEY: <SECRET_KEY>` header
(the key lives in `cred.env`, never in Memberstack's own docs — the header name is
`X-API-KEY`, not `Authorization: Bearer`).

Endpoints actually used and confirmed working in this codebase:
- `GET /members` — paginate with `?limit=100&after=<cursor>`. Each member includes
  `planConnections` (with `planName`, `status`, `payment.nextBillingDate` — useful
  for any future "act at renewal" scheduling) and `customFields` (a flat object,
  includes things like `membership-type`, `first-name`, `trading-name`).
- `GET /members/{id}` — single member, same shape.
- `POST /members/{id}/add-plan`, `POST /members/{id}/remove-plan` — the pattern this
  project uses for plan changes (`admin-update-member`, `lapsed-member-cleanup`).
  Sequencing matters when swapping plans: removing the old one before adding the new
  avoids a same-cycle double-charge — this hasn't been rigorously tested end-to-end
  in this codebase yet, verify before trusting it on a real batch.
- `POST /members/{id}/send-password-reset`

**Confirmed NOT available on the raw REST API: Plans and Prices.** `GET /plans`
returns a genuine 404 (tested directly, not assumed) — there is no way to read or
write Plan/Price configuration via `fetch()` calls the way this codebase is built.
`getPlans()`/`createPrice()` exist, but only on the separate `@memberstack/admin`
Node.js package, which isn't used here. Plan and Price setup is dashboard-only for
this project — see [[project_pricing_migration_2026]] for the actual workflow used
(the account owner attaches new Stripe prices to Plans directly in the Memberstack
dashboard; no API shortcut exists for this).

## Webhook events

`supabase/functions/memberstack-webhook/index.ts` handles exactly four event types
today: `member.created`, `member.updated`, `member.deleted`, `member.plan.canceled`.
See `references/webhook-events.md` for the confirmed full event list and a real
example of what goes wrong when one isn't handled — `member.plan.added` was missing
until 2026-08-07, which caused new signups' `membership_type_id` to silently stay
null. Check that reference before assuming an event isn't handled, or before adding
a new case — don't re-derive the event names from scratch each time.

## Resolving data conflicts across Memberstack / Supabase / Webflow

See [[feedback_memberstack_source_of_truth]] — always start from Memberstack (Plan
connections, then custom fields) as the authoritative source when Supabase's or
Webflow's stored value disagrees with reality. Supabase is the site's source of
truth going forward, but that doesn't mean its historical data is always correct —
several real bugs this project has hit were exactly this: Supabase holding a stale
or never-set value that Memberstack's live data would have caught immediately.

## Webflow data-ms-* attributes

Full reference: `references/data-attributes.md`. The ones actually in use on this
site, worth knowing without opening the reference file:

- **`data-ms-price:update`** — on the join/type page's plan buttons (a `Link`
  element per membership type per billing interval). Controls what gets charged at
  checkout. Does **not** control the visible price text on the page — that's a
  separate static text element. Both need updating together when prices change, or
  the page will show one price and charge another. This was a real incident
  (2026-08-04) — see [[project_pricing_migration_2026]].
- **`data-ms-action:customer-portal`** — launches the Stripe Customer Portal. If a
  member reports their "manage subscription" / portal link is unresponsive, check
  this attribute is actually present and correctly bound before assuming it's a
  Stripe-side issue.
- **`data-ms-content:has-failed-payment`** — relevant to the Non-Payment Lifecycle
  SOP work; could be used to show in-page payment-recovery messaging without waiting
  for the day-20 email, worth considering as a fast-follow.
