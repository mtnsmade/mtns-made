# MTNS MADE — Development Roadmap

> **How to use this file:**
> Review open items here before planning any new feature or infrastructure change. Dependencies and architectural decisions should factor in what's already planned — particularly the email provider migration (R-001) which will affect every email-sending function, the Mailchimp integration (R-004) which will affect member lifecycle events, the lapsed member grace period (R-007 + R-008) which touches the cancellation flow, and the AI Profile Builder (R-009) which touches onboarding, edit profile, and requires the Anthropic API key as a Supabase secret.

---

## Open

### R-001 — Migrate email sending from Resend to Gmail API
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

### R-002 — Email system: missing emails + address consistency
**Priority:** Medium
**Effort:** Small
**Affects:** `memberstack-webhook`, `profile-reminder` edge functions
**Dependency:** Best done after R-001 (so the correct `from` addresses are in place)

**Missing emails to add:**
| Email | Trigger | Priority |
|-------|---------|----------|
| Subscription cancelled | `member.plan.canceled` | Medium — member currently gets no notification they've been archived |
| Failed signup alert | Signup fails to create in Supabase | High — silent failures are invisible |
| Subscription reactivated | Member resubscribes | Low |
| Member deleted | `member.deleted` | Low |
| First project published | First sync to Webflow | Low |

**Consistency fix:**
Admin notification address is currently split — `hello@` for signups/events, `support@` for reminders. Standardise to `support@` for all admin/internal emails.

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

### R-007 — 30-day grace period for lapsed members
**Priority:** Medium
**Effort:** Medium
**Affects:** `memberstack-webhook`, new `lapsed-member-cleanup` edge function (cron), Supabase schema
**Dependency:** R-001 (Gmail API) should be live first — this flow involves 3 emails per cancelled member
**Ships with:** R-008 (exit survey — same trigger, same archival email)

**Client brief:**
> "We will hold your profile in the archive for a 30-day period in which time the payment needs to be made. Following this time the archive will be removed."

**What's needed:**

**1. Database change**
Add `lapsed_at` timestamp column to `members` table. Set when `member.plan.canceled` fires. This is the clock start for the 30-day window.

**2. Email sequence (3 emails)**
| Email | Timing | Content |
|-------|--------|---------|
| Archival notice | Immediately on cancellation | Profile archived, 30-day window explained, payment link, exit survey button (R-008) |
| Reminder | Day 20 | "10 days left to reactivate your profile" |
| Final notice | Day 29 | "Your profile will be permanently removed tomorrow" |

**3. New daily cron job — `lapsed-member-cleanup`**
Runs daily, finds all `lapsed` members where `lapsed_at` > 30 days ago, then:
- Hard-deletes their Webflow profile and projects
- Marks them `deleted` in Supabase
- Sends final removal confirmation email

**4. Reactivation within the window**
Verify the existing `member.plan.updated` webhook path correctly un-archives the member profile and projects if they resubscribe within 30 days.

**Note:** Coordinate with R-004 (Mailchimp) — the `subscription-cancelled` winback sequence should not overlap with the day-20/day-29 reminder emails.

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
| — | `profile_complete` bug: fixed 12 members false-negative, 9 members false-positive | Mar 2026 |
