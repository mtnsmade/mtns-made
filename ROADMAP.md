# MTNS MADE — Development Roadmap

> **How to use this file:**
> Review open items here before planning any new feature or infrastructure change. Dependencies and architectural decisions should factor in what's already planned — particularly the email provider migration (R-001) which will affect every email-sending function, the Mailchimp integration (R-004) which will affect member lifecycle events, the lapsed member grace period (R-007 + R-008) which touches the cancellation flow, and the AI Profile Builder (R-009) which touches onboarding, edit profile, and requires the Anthropic API key as a Supabase secret.

---

## Open

### R-001 — Migrate email sending from Resend to Gmail API *(code complete — needs production test)*
**Priority:** High
**Effort:** Medium
**Affects:** `send-email` edge function, all edge functions that call it

**Background:**
Hitting Resend's free tier limit of 100 emails/day. Google Workspace (Google Apps) is already paid for and supports 2,000 emails/day via the Gmail REST API.

**Planned approach:**
- Use Gmail API with a Google Cloud service account + domain-wide delegation
- Service account impersonates any `@mtnsmade.com.au` address — no extra cost or config per address
- Rewrite the `send-email` edge function to call the Gmail API instead of Resend
- Add a `from` field to the payload so callers can specify the sending address

**Sending address strategy (once live):**
| Type | From address |
|------|-------------|
| Member-facing (welcome, approvals, reminders, support resolved) | `hello@mtnsmade.com.au` |
| Internal/admin (new signups, event submissions, weekly summaries) | `support@mtnsmade.com.au` |

**Setup steps (Google side):**
1. Create a Google Cloud project
2. Enable the Gmail API
3. Create a service account, generate a JSON key
4. In Google Workspace Admin: enable domain-wide delegation for the service account
5. Grant scope: `https://www.googleapis.com/auth/gmail.send`
6. Store service account JSON as a Supabase edge function secret

**Implementation notes:**
- JWT generation for service account auth needs to be written in Deno (no external library)
- All existing callers of `send-email` need a `from` field added — default to `hello@mtnsmade.com.au` if omitted
- Resend custom domain `mail.mtnsmade.com.au` can be decommissioned after cutover

---

### R-002 — Email system: missing emails + address consistency *(mostly done — low-priority items remain)*
**Priority:** Medium
**Effort:** Small
**Affects:** `memberstack-webhook`, `profile-reminder` edge functions
**Dependency:** Best done after R-001 (so the correct `from` addresses are in place)

**Missing emails — status:**
| Email | Trigger | Status |
|-------|---------|--------|
| Subscription cancelled | `member.plan.canceled` | ✓ Done (Jun 2026) |
| Failed signup alert | Signup fails to create in Supabase | ✓ Done |
| Subscription reactivated | Member resubscribes | ✓ Done (Jun 2026) |
| Member deleted | `member.deleted` | Low — defer to R-007 |
| First project published | First sync to Webflow | Low — skip |

**Consistency fix:**
✓ `ADMIN_EMAIL` default standardised to `support@mtnsmade.com.au` in `memberstack-webhook` (Jun 2026). All admin/internal emails now use `FROM_SUPPORT`.

---

### R-003 — Workflow CRUD analysis
**Priority:** Medium
**Effort:** Analysis only (no code changes until findings reviewed)
**Command:** "run the workflow CRUD analysis"

Comprehensive review of Members, Projects, and Events workflows. Output is a gap table per entity covering: CRUD completeness, Supabase/Webflow data consistency, error handling, cascading deletes, input validation, activity logging, and edge cases.

**Files to review:**
| Entity | Files |
|--------|-------|
| Members | `memberstack-webhook/index.ts`, `member-edit-profile-supabase.js`, `sync-member/index.ts`, `admin-dashboard.js` |
| Projects | `member-projects-supabase.js` |
| Events | `member-events-supabase.js`, `manage-event/index.ts`, `notify-event-submission/index.ts` |

---

### R-004 — Mailchimp: connect member lifecycle events to email sequences
**Priority:** Medium
**Effort:** Medium
**Affects:** `memberstack-webhook` edge function
**Dependency:** Coordinate with R-001 (avoid double-sending welcome emails once sequences are live)

**Planned approach:**
- Call Mailchimp API from the webhook on key member events
- Upsert contact to audience, then apply a tag to trigger a Customer Journey sequence
- Tags act as entry points — each tag maps to one automation

**Trigger map:**
| Event | Tag | Sequence purpose |
|-------|-----|-----------------|
| `member.created` | `new-member` | Welcome series — intro to community, profile setup, adding projects |
| `member.plan.canceled` | `subscription-cancelled` | Winback / offboarding |
| Profile marked complete | `profile-complete` | "You're live!" — how to get found in the directory |
| First project published | `first-project` | Celebrate the milestone, prompt them to share it |

**Credentials:** `MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_LIST_ID_MAIN` already in `cred.env` and need to be added as Supabase edge function secrets.

**Note:** Once sequences are live, review whether the existing one-off welcome email in `memberstack-webhook` should be retired in favour of the Mailchimp sequence — avoid sending both.

---

### R-005 — Fix: intermittent `profile_complete` evaluation failure
**Priority:** Low
**Effort:** Small (diagnosis required first)
**Affects:** `src/scripts/member-edit-profile-supabase.js`

The completion check at lines 1009–1018 is logically correct but occasionally evaluates to `false` despite all requirements being met. Needs browser console logging added to capture the state at evaluation time and identify the race condition or field mismatch causing it.

---

### R-006 — Webflow auto-publish after member/project changes
**Priority:** Low
**Effort:** Small (blocked on external action)
**Affects:** `sync-member`, `memberstack-webhook` edge functions

Currently the Webflow API token is missing the `sites:write` scope. This means archived or deleted members remain visible on the live site until Hannah manually publishes. Adding the scope to the token would allow edge functions to trigger a publish automatically after archiving.

**Blocked by:** Webflow API token needs to be regenerated with `sites:write` scope included.

---

### R-009 — AI Profile Builder & Profile Enhancer
**Priority:** High
**Effort:** Large
**Affects:** `member-onboarding-supabase.js`, `member-edit-profile-supabase.js`, new `generate-bio` edge function, new proactive email cron, Webflow (new `/profile-builder` page or embedded in existing profile flow)
**Dependency:** R-001 (Gmail API) for the proactive outreach email. Anthropic API key needs to be added as a Supabase edge function secret (currently only lives in `scripts/populate-subdirectories/.env`).

**Background:**
Members consistently submit weak bios — too short, too vague, or too generic — despite the workshop document (Member-Document-Bio.pdf) providing clear guidance. The solution is to replace the blank textarea with a structured interview that extracts the right information, then generates a polished bio using Claude.

**The four entry points:**

| Entry point | Surface | Trigger |
|-------------|---------|---------|
| New member onboarding | Choice at bio step | "Write my own" vs "Use Profile Builder" |
| Existing member dashboard | "Enhance my bio" button | Member-initiated |
| Admin dashboard | "Send profile enhancer" action | Admin-initiated for a specific member |
| Proactive email | Automated | Members with bio < 50 words receive nudge email with link |

---

**The interview — 5 steps (based on Member-Document-Bio.pdf structure):**

*Step 1 — Who are you*
- Name and suburb pre-filled from profile
- "In one sentence, describe your creative practice or profession" *(maps to opening sentence)*

*Step 2 — What you do & how you work*
- "What are your main mediums, services, or areas of focus?" (e.g. hand embroidery, graphic design, performance)
- "What makes your approach or process distinctive?" (aesthetic, philosophy, themes, methods)
- "Any specific techniques, tools, or technologies you use regularly?"

*Step 3 — Achievements & experience*
- "Notable clients, organisations, or collaborators you've worked with?"
- "Any exhibitions, festivals, publications, or stockists worth mentioning?"
- "Awards, grants, or residencies?"

*Step 4 — Current work & future direction*
- "What are you working on right now?"
- "Any evolving interests, research directions, or community involvement?"

*Step 5 — Tone preference*
- Dropdown: **Professional** · **Smart Casual** · **Warm & Conversational**
- Note: all bios written in third person per MTNS MADE guidelines

---

**Generation step:**

On submit → `generate-bio` edge function:
1. Sends structured answers + tone preference to Claude API (claude-sonnet-4-5 or later)
2. Generates two outputs:
   - **Full bio** (~150–200 words) — maps to `bio` field in Supabase
   - **Short bio** (~40–50 words) — maps to `short_bio` field in Supabase
3. Returns both to the member for **review before saving**

Member sees a preview with two options: **Accept & save** or **Edit** (editable text area). No silent writes — member always reviews first. A "Regenerate" button optionally lets them try a different tone.

On accept → saves to Supabase → triggers Webflow sync via existing `sync-member` flow.

---

**Claude prompt design (to be refined during implementation):**

```
You are writing a professional bio for a member of MTNS MADE, a Blue Mountains creative community directory.

Write in third person. Tone: {tone}.
Be specific — name actual mediums, clients, techniques. Avoid generic descriptors.
Structure: opening identity sentence → practice/approach → achievements → current direction.

Member answers:
- Name & location: {name}, {suburb}
- Practice summary: {practice}
- Mediums & services: {mediums}
- Distinctive approach: {approach}
- Techniques/tools: {tools}
- Notable clients/orgs: {clients}
- Exhibitions/publications/stockists: {exhibitions}
- Awards/grants/residencies: {awards}
- Current work: {current}
- Future direction: {future}

Output two versions:
1. FULL BIO (150–200 words)
2. SHORT BIO (40–50 words)
```

---

**Proactive outreach cron:**

A daily (or weekly) scheduled function that:
- Queries members where `LENGTH(bio) < 50` (or bio is null) and `subscription_status = 'active'`
- Sends a single nudge email with a personalised link to `/profile-builder?id={memberstack_id}`
- Sets a `profile_enhancer_sent_at` timestamp so they're not re-emailed
- Email copy: "Your profile is live but your bio could work harder for you — let us help."

---

**Webflow page: `/profile-builder`**

Custom-coded multi-step form page (not a CMS template). Member ID passed via URL param to pre-fill name, suburb, existing bio (if any) as starting point for existing members. Progress indicator showing steps 1–5. Mobile-friendly — many members will use this on their phone.

---

**Decisions needed before implementation:**
- Confirm Claude model to use (check API key access — must be Claude 4 series per project notes)
- Does the tone dropdown need a 4th option? (Client to confirm)
- Should "Regenerate" cost count toward anything? (Probably fine — bio generation is cheap)
- Should generated bios be flagged differently in the admin dashboard so Hannah can spot AI-assisted profiles?

---

### R-007 — Lapsed member grace period *(shipped, code-complete — cron intentionally OFF pending decision below)*
**Priority:** Medium
**Effort:** Medium
**Affects:** `memberstack-webhook`, `lapsed-member-cleanup` edge function (cron), Supabase schema
**Ships with:** R-008 (exit survey — not yet built, still an open item on top of this)

**Client brief:**
> "We will hold your profile in the archive for a 30-day period in which time the payment needs to be made. Following this time the archive will be removed."

**What actually shipped (2026-07-18 → 2026-08-08), superseding the original 3-email/`lapsed_at` spec above:**
- Day 0 (real `CANCELED`, never a `REQUIRES_PAYMENT` retry): profile + projects archived, immediate "membership ended" email.
- Days 1–19: silent. Daily `subscription-reconcile` auto-restores if they resubscribe.
- Day 20+: one final retention-warning email, re-verified live against Memberstack immediately before sending. The timestamp this is actually sent (`retention_warning_sent_at`), not the original lapse date, starts the delete countdown.
- 10+ days after that: hard delete (Webflow profile + projects + storage images), re-verified live again immediately before deleting.
- Full incident history, safety design, and current open items are documented in the **SOPs tab** on the admin dashboard ("Member Non-Payment Lifecycle") — that's the canonical writeup, not this roadmap entry.
- `lapsed-member-cleanup`'s two known bugs (active-check missing TRIALING; hard-delete failures silently reported as success) were fixed and verified 2026-08-08 as part of the stabilization pass.

**Open decision — re-enabling the daily cron:**
The cron for `lapsed-member-cleanup` was deliberately left unscheduled after the July 18 incident and still is (confirmed directly against `cron.job`, 2026-08-08 — nothing references this function). Re-enabling it means real, ongoing warning/delete emails to real members, so it should not just be silently switched back on. Needs a decision involving Hannah covering, at minimum:
1. Confirm Stripe's own dunning/retry email settings so the Day 0/Day 20 copy doesn't duplicate or contradict them (Stripe Dashboard → Settings → Billing → Subscriptions and emails — we have no API visibility into this).
2. Coordinate with R-004 (Mailchimp) so its planned cancellation-tag automation doesn't compete on the same Day 0/Day 20 touchpoints this SOP already owns.
3. Decide whether R-008 (exit survey) should ship before or alongside re-enabling.
4. Only once the above are settled: re-add the cron (`supabase/migrations` — a `cron.schedule('lapsed-member-cleanup', ...)` entry, none currently exists) and communicate the policy to affected members proactively rather than have it surface as a surprise.

---

### R-008 — Exit survey on membership cancellation
**Priority:** Medium
**Effort:** Small–Medium
**Affects:** New Webflow page, new `member-feedback` edge function
**Dependency:** R-001 (Gmail API), R-007 (archival email is the delivery mechanism)
**Ships with:** R-007

**Client brief:**
> "Adding an outgoing message for members asking why they're leaving — could it be automated and then sent to hello@?"

**Planned approach:**
A button in the R-007 archival email links to `/member-feedback?id={memberstack_id}&name={name}` on the Webflow site. The page is a simple form with:
- Pre-selected reason checkboxes: Cost · Moving away from the Mountains · Not using it enough · Starting a new business · Other
- Free-text "Anything else you'd like to share?" field
- Member name/email pre-populated from URL params (hidden fields)
- Submit button

On submit → Webflow form webhook → `member-feedback` edge function → formatted email to `hello@mtnsmade.com.au`.

Responses also stored in a new `member_feedback` Supabase table for trend analysis (e.g. spot if "Cost" spikes after a price change).

**Flow:**
```
member.plan.canceled
       ↓
Archival email (R-007)
  └─► "Before you go — tell us why you're leaving" [button]
                    ↓
         /member-feedback?id=xxx (Webflow page)
                    ↓
         member-feedback edge function
                    ↓
         → Email to hello@mtnsmade.com.au (formatted response)
         → INSERT into member_feedback table (Supabase)
```

**Content note:** Hannah/Rachel to supply the copy for the form intro and the reason checkbox options before implementation.

---

### R-010 — Active monitoring: week following the 2026-08-08 stabilization pass
**Priority:** High (time-boxed — remove this item once the week has passed with nothing found)
**Effort:** Small, ~5 min/day
**Affects:** N/A — a watch-list, not a code change
**Background:** [[project_stabilization_pass_2026_08_08]] in project memory has the full record of what shipped that day (10 batches: shared active/membership-type logic, webhook signature verification now enforcing, `lapsed-member-cleanup` hardening, `admin-update-member` double-billing fix, `createMember` redelivery fix, and more). No new monitoring infrastructure was judged necessary — this is a checklist of things already visible that are worth actively watching for about a week, not a new dashboard.

**Checklist:**
1. **Memberstack webhook endpoint delivery rate** — check the Message Attempts success rate on the endpoint in Memberstack's dashboard daily. Signature verification is now enforcing (as of that pass); a drop from ~100% success would mean real traffic is failing signature checks for a reason testing didn't cover, and would silently stop member sync if unnoticed.
2. **`check-consistency`'s weekly report** — now also checks opportunities/events/projects, not just members. Actually read the next report or two to confirm the new checks are finding real things (or genuinely nothing) rather than skimming past false positives.
3. **Any real `admin-update-member` plan change this week** — Batch 6's double-billing fix never got a live-money test. If a real membership tier change happens, spot-check Memberstack/Stripe afterward that only one plan ended up active.
4. **Billing-mismatch / failed-signup alert emails** — now fire correctly for the first time. Treat one arriving this week as real signal, not noise.
5. **`member.plan.updated` volume** — fires in real production traffic but has no handler yet (falls through to a harmless log-and-200). After a week, check Svix's Event Catalog/delivery stats for how often it actually fires, to decide whether it's worth building real handling for.

**Resolution:** once a week has passed with nothing found on this list, delete this entry rather than let it linger as a stale "Open" item.

---

### R-011 — `profile_completed_at` never set by either real member-facing path *(fixed 2026-08-10)*
**Priority:** Medium (silently breaks a downstream feature, not just an unused column)
**Effort:** Small
**Affects:** `member-edit-profile-supabase.js` (line ~1080), `member-onboarding-supabase.js` (line ~1414)

**Background:** Found while checking onboarding-completion patterns for R-010. Both real paths that flip `profile_complete` to `true` (`member-edit-profile-supabase.js:1080`, `member-onboarding-supabase.js:1414`) never also set `profile_completed_at` - only `query-members/index.ts:106` (an admin/manual path) actually stamps it. Confirmed via a sample of 25 recent real members: `profile_completed_at` was `null` on every single row, including ones with `profile_complete: true`.

This isn't just an unused column - `project-reminder/index.ts` filters on `profile_completed_at` (`.lte('profile_completed_at', sevenDaysAgo...)`, per the index in migration `024_project_reminder.sql`) to find members who completed their profile 7+ days ago and nudge them to add a project. Since the two real completion paths never set it, this targeting has likely never correctly caught anyone who completed onboarding through normal usage.

**Fix applied:** both files now stamp `profile_completed_at` once, on the genuine first transition to complete - fetching the existing value first (already held in `member-edit-profile-supabase.js`'s loaded `supabaseMember`; needed a small targeted fetch in `member-onboarding-supabase.js`, since its own `supabaseMember` variable turned out to be declared but never actually populated) and preserving it on later saves rather than re-stamping. Verified directly against Supabase with a throwaway test row: a second save 2+ seconds after the first left the original timestamp completely unchanged.

**Related, deferred - backfill for existing members:** the fix is forward-only. Every member who completed their profile *before* 2026-08-10 (confirmed on real member Claire Nakazawa, `mem_cmsn56qiv0dtq0srmazm157ot`, who onboarded the same day just before the fix shipped) still has `profile_completed_at: null` despite `profile_complete: true`, and will keep failing `project-reminder`'s targeting until backfilled. Not done as part of this fix, and needs a decision, not just a script: there's no true historical completion date recorded anywhere to backfill from (no audit trail), so any backfill is necessarily an estimate - the honest options are leaving it null for everyone who completed before today (accept the gap, only new completions get accurate dates), or using each member's `updated_at` as a best-effort approximation (acknowledging it's "some date on or after completion," not the real one). Explicitly not implemented - flagged for a deliberate decision later, not a default to reach for.

---

### R-012 — Add Stories to the primary nav *(shipped 2026-08-18)*
**Priority:** TBD
**Effort:** Small
**Affects:** `nav-2025.js` (desktop nav)

**Background:** "Stories" already existed as a page and was already linked in the **footer** nav, just missing from the primary/header nav. Added between Jobs and Resources per instruction. Mobile overlay nav already had a Stories link (in a different position, between Resources and Magazine) - left that as-is, not part of this request.

---

### R-013 — Kate Sutton: image cropping control + override for AI-generated project summary
**Priority:** TBD
**Effort:** Medium (two genuinely separate asks, see below)
**Affects:** Project image display (Webflow), `short_description` field / `generate-project-summary` edge function, `member-projects-supabase.js`

**Client request (from Kate, via screenshot of her project preview):**
> "The images are being cropped. This seems to be automatic, is there a way to 'pick' which crop is being shown? Also the copy here seems to be autogenerated - presumably by AI - if there is a way to override this with my words can you let me know please."

**Part 1 - image cropping:** Confirmed there is no cropping or focal-point control anywhere in the current upload flow (`member-projects-supabase.js`, `member-edit-profile-supabase.js`, `member-onboarding-supabase.js`) - images are uploaded and stored as-is; whatever cropping Kate is seeing is purely a display-side effect (a fixed-aspect-ratio container with `object-fit: cover` or similar in the Webflow template), not anything driven by our data model. Two realistic paths, needing investigation before picking one: (a) Webflow's native per-image focal-point control, if that survives images being pushed via the API rather than uploaded directly in the Designer/Editor - would need checking; (b) a custom crop tool built into our own upload flow (crop-before-upload UI, storing focal point or a pre-cropped image) - a real build, not a quick toggle.

**Part 2 - overriding the AI-generated summary:** Confirmed `short_description` is written entirely by `generate-project-summary` (a Claude API call, see its own file header: "Uses Claude API to generate short descriptions for projects") and is never exposed anywhere in the member-facing project form for editing - members currently have no way to see or override it at all. Fix is smaller than it first looks: the function's own database-trigger path already guards against overwriting (`if (!body.record.short_description)` - only generates when empty), so no edge-function change is needed. Just add a `short_description` field to `member-projects-supabase.js`'s project form - once a member has written their own value, the existing guard will already leave it alone on future edits.

---

### R-014 — Complete the Track 2 member pricing migration + member notice email
**Priority:** High (has been "in progress, not yet built" since 2026-08-04 per project memory - this is where that work actually gets tracked now, it wasn't in this file before)
**Effort:** Large (real migration mechanism + two distinct member populations + a client-facing email)
**Affects:** New migration mechanism (likely reusing `admin-update-member`'s existing add-plan/remove-plan pattern), member notice email, `pricing-migration/stripe-price-audit.md` (gitignored, has the full price-ID audit)

**Where this actually stands (pulled forward from project memory, not previously in this file):**
Two genuinely separate populations, confirmed via a real Stripe price audit - don't conflate them:
1. **Repricing group (~127 members):** already correctly classified into one of the 6 new tiers, just still paying the old dollar amount for that same tier. A simple in-place price swap.
2. **Pre-split legacy plan (154 active subs):** never migrated onto the 6-tier system at all - still on the single original flat "MTNS MADE Membership" plan. Every one of these 154 is paying exactly **$40/year or $5/month**, no variance (confirmed from the Stripe price audit - two duplicate price objects at each amount, explained as a launch-era "free trial reward" variant vs the regular price, not an actual price difference). This group needs actual reclassification into one of the 6 tiers (not just a price bump) - classification is done for all but 2 people (Rick Turnock, Ian Brown - no signal in any system, flagged rather than guessed).

**Not yet built:** the actual migration mechanism itself (add the new plan/price via Memberstack admin API, verify, then remove the old plan connection - reusing the existing add-plan/remove-plan pattern already proven in `admin-update-member`, mindful of the double-billing-sequencing lesson from Batch 6 of the 2026-08-08 stabilization pass), the member notice email, and Hannah's sign-off on notice period + whether to run both populations together or staggered.

**Hannah's draft notice email (verbatim, for population 2 - the reclassification group):**
> Hello (member first name),
>
> We're getting in touch to let you know about an update to the MTNS MADE membership fee structure.
>
> As part of the move to the tiered membership model, we have transitioned your membership to the Professional tier, which we believe is the best fit based on the information we have taken from your MTNS MADE Profile.
>
> Your membership fee will be updated to reflect this change:
> - Monthly Professional memberships: The new $5 fee will apply from your next monthly payment.
> - Annual Professional memberships: The new $50 fee will apply when your membership renews at the end of your current subscription period.
>
> If you feel a different membership tier would be a better fit, or if you have any questions, please contact us via email: support@mtnsmade.com.au and we'll be happy to review your membership with you.
>
> Thank you for your continued support of MTNS MADE.
> Kind regards,
> The MTNS MADE Team

**Suggested improvements, to incorporate before this gets built into an actual sending template:**
1. **"No action needed" up front.** Someone scanning a "fee update" email wants to know first whether they need to do anything - lead with the reassurance, don't bury it after the mechanism explanation.
2. **Show the *from* price, not just the new one.** Every population-2 member is on exactly $40/yr or $5/mo (real, confirmed figures - see above), so the email can say precisely "changing from $40/year to $50/year" instead of stating the new number in isolation. More transparent, and pre-empts the "wait, what was I paying before?" reply.
3. **The tier name and fee need to be real per-member merge values, not hardcoded "Professional"/"$5"/"$50".** Hannah's draft reads as a worked example for one member, not a template - most recipients will land on a different one of the 6 tiers with different figures.
4. **Use a real renewal-date merge value** instead of "at the end of your current subscription period" - Memberstack's `payment.nextBillingDate` is already a proven, available field (used elsewhere in this project), so the actual date can be stated rather than left vague.
5. **Only show the line matching the member's actual billing interval**, not both the monthly and annual bullets to everyone - showing both to someone already on annual billing risks reading as "do I now pay both?"
6. Match this project's existing branded HTML email template style (see `_shared/gmail.ts` and any of the existing member-facing emails, e.g. the retention warning email) rather than plain text, and send from whichever address is appropriate for a reply-expecting notice (`FROM_SUPPORT`, matching the existing convention for anything inviting a response).

---

### R-015 — Signup-time slug preview has no uniqueness check (real-time "username checker" question)
**Priority:** TBD — depends on how often name collisions actually occur; the downstream systems now handle them safely, so this is a UX/expectation-setting gap, not a data-integrity risk
**Effort:** Small–Medium
**Affects:** `src/scripts/member-signup-2026.js` (`generateSlug`, ~line 328-547)

**Background:** Prompted by "there has been issues previously with username inconsistencies so i want to make all systems consistent always" (2026-08-11, after the Reece McMillan incident) and the linked Memberstack `validate-original-values` script question. Full audit of every member-creation/slug-generation path is now complete:

| Path | Status |
|---|---|
| `memberstack-webhook`'s `createMember` (real-time webhook) | **Fixed 2026-08-11** — now uses shared `findAvailableMemberSlug` |
| `query-members`'s two admin/manual recovery paths | **Fixed 2026-08-11** — same shared function |
| `member-onboarding-supabase.js` | Already safe — pre-existing `checkSlugAvailable`/`generateUniqueSlug` with live UI feedback |
| `member-edit-profile-supabase.js` | Safe by design — never regenerates `slug` after creation (explicit code comment) |
| `member-signup-2026.js` (this entry) | **Gap found, not yet fixed** — see below |

**The remaining gap:** for individual membership types, `member-signup-2026.js` generates `slug = generateSlug(firstName, lastName)` at initial signup and sends it to Memberstack as a custom field, with **no uniqueness check at that point**. This value later becomes the `baseSlug` that `createMember` reads off the webhook payload - so a same-named collision is now handled safely downstream (the member gets `-2` appended, no failed signup), but the member never sees that happen. They see/expect one slug at signup and could end up with a silently different one live on their profile.

**On the Memberstack script itself (`MemberScript #229`, `validate-original-values`):** not recommending adopting this - it validates uniqueness against Memberstack's own **Data Tables** feature, a separate store this project doesn't use anywhere (Supabase is the actual source of truth for slugs/members). Adopting it would mean maintaining a second, parallel uniqueness index that has no relationship to the one that actually matters.

**Recommended alternative, if this is worth closing:** a small real-time check at the signup-form stage, same UX pattern already proven in `member-onboarding-supabase.js` (`checkSlugAvailable` + live `.ms-slug-status` indicator) but querying Supabase directly instead of Memberstack Data Tables - reusing `findAvailableMemberSlug`'s logic via a thin public read (or a small edge-function endpoint) rather than duplicating it. This is the one open question from the user's original ask that still needs a decision: build this now, or leave it (the collision is already handled safely, just invisibly).

---

### R-016 — Retargeting list for lapsed/deleted members *(view shipped 2026-08-12, Mailchimp sync not built)*
**Priority:** Low
**Effort:** Small (done) for the view; Medium if/when a Mailchimp sync is wanted
**Affects:** New `retargeting_candidates` view (migration `041_retargeting_candidates_view.sql`)

**What shipped:** a read-only Postgres view over `members`, scoped to everyone currently `subscription_status IN ('lapsed', 'deleted')` — no recency cutoff, per instruction. Currently **88 candidates** (80 lapsed + 8 deleted). Supabase-only for now, not synced to Mailchimp (`MAILCHIMP_LIST_ID_MEMBERS_TRANSFER` already exists in `cred.env` but nothing in the codebase calls Mailchimp yet — this is the same unbuilt integration as R-004).

**Security note:** views bypass the base table's RLS by default (they run with the creator's privileges, not the querying role's). `members` has RLS specifically because it holds real PII, so the view was briefly world-readable through PostgREST's default anon grants immediately after creation — caught and fixed live in the same session with an explicit `REVOKE ... FROM anon, authenticated` baked into the migration. Worth remembering for any future view over a PII-bearing table.

**Known data quality issue surfaced along the way:** `mikenjo@iprimus.com.au` and `sifumikewoo@gmail.com` are almost certainly the same real person (Mike Wall) — identical name, identical suburb, business name "Mike Wall Photographer" on one, account-creation timestamps 49ms apart (both part of the original Feb 2026 bulk import). Both already lapsed, so no live-site impact, but they'll show as two separate rows in this view and in any future Mailchimp sync. Flagged, not merged — deciding which record is canonical needs a person to look, not an automated guess.

---

### R-017 — Events page has no real "hide past events" mechanism
**Priority:** Medium
**Effort:** Small
**Affects:** Webflow "What's On" Collection List config, or a new scheduled function

**Background:** discovered 2026-08-18 during cleanup of a live incident (see Completed table). The `events.is_past` column exists but is dead — grepped the whole sync pipeline, it's declared in one type definition and never read or written anywhere. No scheduled job auto-archives events once their date passes. The live "What's On" Collection List sorts **oldest-first, ascending**, with no date filter — so a published old event doesn't quietly sit at the bottom, it leads the page.

This has never surfaced before purely because no one has ever published a batch of old events at once — not because anything was protecting against it. If it happens again (another bulk import, another sync bug, anyone unpublishing/republishing in bulk), the exact same thing recurs with nothing to catch it.

**Fix, either one closes the gap:**
1. Add a real date filter to the Collection List directly in Webflow ("only show events where date is today or later") — no code change, a Designer-side config fix.
2. Or build a small scheduled function that auto-archives events once `date_end` (or `date_start` if no end) has passed.

---

## Completed

| ID | Item | Date |
|----|------|------|
| — | Duplicate project prevention: `findExistingWebflowItem` pagination + memberstack-id fallback | Jun 2026 |
| — | Support tracker redesign: toolbar, archive view, monthly cards | Jun 2026 |
| — | Resolve duplicate projects: Daniel Conway, Jacqueline Forster, Sophia Long, Pat (Padel Point) | Jun 2026 |
| — | Delete Weekday (mem_cmb5qshuu00co0wr671tn07i6) from all systems | Jun 2026 |
| — | `handleMemberDeleted` webhook: auto-archive projects on member deletion | Jun 2026 |
| — | Support tracker: comment notifications to `hello@`, delete task, member completion email | Jun 2026 |
| — | Member search: search by trading name (`business_name`) as well as personal name | Jun 2026 |
| — | Event submission email: fix dashboard link to `/admin/dashboard` | Jun 2026 |
| R-001 | Gmail API migration — all 13 edge functions migrated from Resend | Jun 2026 |
| R-002 | Missing emails (cancellation, reactivation) + admin address consistency | Jun 2026 |
| — | `profile_complete` bug: fixed 12 members false-negative, 9 members false-positive | Mar 2026 |
| — | Reece McMillan incident: fixed `createMember` slug-collision handling + `[object Object]` error masking; audited and fixed the same gap in `query-members` (R-015 tracks the one remaining signup-time nuance) | Aug 2026 |
| — | Events "What's On" page incident: bulk-correcting 46 stuck-pending imported events wrongly published them live (wrong assumption that `webflow_id` present meant already-live). Fixed data on both sides, then hit a stuck Webflow publish queue (API-driven publishes silently not completing — `lastPublished` frozen 10h despite repeated accepted publish calls) that needed manual per-item unpublishing in the Designer to resolve before a client presentation. R-017 tracks the real structural gap it surfaced. | Aug 2026 |
| R-012 | Add Stories to primary nav + "Change Account Type" added to member account dropdown (deep-links to the Membership Type section shipped earlier) | Aug 2026 |
