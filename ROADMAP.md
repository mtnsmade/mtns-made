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

### R-011 — `profile_completed_at` never set by either real member-facing path
**Priority:** Medium (silently breaks a downstream feature, not just an unused column)
**Effort:** Small
**Affects:** `member-edit-profile-supabase.js` (line ~1080), `member-onboarding-supabase.js` (line ~1414)

**Background:** Found while checking onboarding-completion patterns for R-010. Both real paths that flip `profile_complete` to `true` (`member-edit-profile-supabase.js:1080`, `member-onboarding-supabase.js:1414`) never also set `profile_completed_at` - only `query-members/index.ts:106` (an admin/manual path) actually stamps it. Confirmed via a sample of 25 recent real members: `profile_completed_at` was `null` on every single row, including ones with `profile_complete: true`.

This isn't just an unused column - `project-reminder/index.ts` filters on `profile_completed_at` (`.lte('profile_completed_at', sevenDaysAgo...)`, per the index in migration `024_project_reminder.sql`) to find members who completed their profile 7+ days ago and nudge them to add a project. Since the two real completion paths never set it, this targeting has likely never correctly caught anyone who completed onboarding through normal usage.

**Fix:** in both files, when a save transitions `profile_complete` from false to true, also stamp `profile_completed_at` to now - needs the existing value checked first (e.g. fetch the current row, or use a conditional update) so it's set once on the genuine transition, not overwritten on every subsequent save while already complete. `query-members`' existing stamp is a simpler one-shot admin action and doesn't need to handle this, so it isn't a direct template for the condition, only for the value being set.

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
