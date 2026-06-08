# MTNS MADE — Development Roadmap

> **How to use this file:**
> Review open items here before planning any new feature or infrastructure change. Dependencies and architectural decisions should factor in what's already planned — particularly the email provider migration (R-001) which will affect every email-sending function, and the Mailchimp integration (R-004) which will affect member lifecycle events.

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
