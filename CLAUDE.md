# MTNS MADE - Project Memory

## Project Overview
MTNS MADE is a Blue Mountains creative community platform with:
- **Memberstack** for authentication/payments
- **Supabase** for database and storage
- **Webflow** for CMS and frontend

## Key Files
- `supabase/functions/memberstack-webhook/index.ts` - Member lifecycle events
- `supabase/functions/sync-member/index.ts` - Sync member to Webflow
- `src/scripts/member-edit-profile-supabase.js` - Profile editing
- `src/scripts/member-projects-supabase.js` - Project CRUD
- `src/scripts/member-events-supabase.js` - Event submissions
- `src/scripts/admin-dashboard.js` - Admin interface

## Pending Tasks

### Workflow CRUD Analysis
**Command:** "run the workflow CRUD analysis"

Comprehensive analysis of Members, Projects, and Events workflows covering:

**Files to Review:**
| Entity | Files |
|--------|-------|
| Members | `memberstack-webhook/index.ts`, `member-edit-profile-supabase.js`, `sync-member/index.ts`, `admin-dashboard.js` |
| Projects | `member-projects-supabase.js` |
| Events | `member-events-supabase.js`, `manage-event/index.ts`, `notify-event-submission/index.ts` |

**Analysis Criteria:**
- CRUD Completeness - Are all operations properly implemented?
- Data Consistency - Does Supabase stay in sync with Webflow?
- Error Handling - Are failures caught, logged, recovered?
- Cleanup/Cascading - Are children (images, related records) cleaned up on delete?
- Validation - Is input validated before database writes?
- Activity Logging - Are actions tracked for admin dashboard?
- Edge Cases - Partial failures, duplicate requests, etc.

**Output:** Table per entity showing each CRUD operation, implementation status, gaps, severity, and recommended fixes.

---

### Email System Improvements
**Command:** "run the email system task"

#### Current Emails

| # | Email Type | Trigger | Recipient | Subject | Edge Function |
|---|------------|---------|-----------|---------|---------------|
| 1 | Welcome Email | `member.created` webhook | New member | "Welcome to MTNS MADE!" | `memberstack-webhook` |
| 2 | Admin: New Signup | `member.created` webhook | `hello@mtnsmade.com.au` | "New Member: {name}" | `memberstack-webhook` |
| 3 | Profile Reminder | Weekly cron (Mon 9am AEST) | Incomplete profiles | "Complete your MTNS MADE profile" | `profile-reminder` |
| 4 | Admin: Reminder Summary | Weekly cron | `support@mtnsmade.com.au` | "Weekly Profile Reminder: X sent" | `profile-reminder` |
| 5 | Admin: Event Submission | Member submits event | `hello@mtnsmade.com.au` | "New Event for Review: {name}" | `notify-event-submission` |
| 6 | Event Approved | Admin approves | Event submitter | "Your event has been approved!" | `manage-event` |
| 7 | Event Rejected | Admin rejects | Event submitter | "Update on your event" | `manage-event` |
| 8 | Contact Member | Contact form submit | Member | "New MTNS MADE Enquiry: {subject}" | `contact-member` |

#### Process Flow
```
MEMBER SIGNUP
├─► Welcome Email → Member
└─► New Signup Notification → Admin

INCOMPLETE PROFILE (Weekly Cron)
├─► Profile Reminder → Member
└─► Weekly Summary → Admin

EVENT SUBMISSION
└─► Event Submission Notice → Admin
    ├─► [Approve] → Approval Email → Member
    └─► [Reject] → Rejection Email → Member

CONTACT FORM
└─► Contact Enquiry → Member
```

#### Gaps / Missing Emails
| Missing Email | Trigger | Priority |
|---------------|---------|----------|
| Subscription Cancelled | `member.plan.canceled` | Medium |
| Subscription Reactivated | Member resubscribes | Low |
| Member Deleted | `member.deleted` | Low |
| Project Published | First project synced | Low |
| Failed Signup Alert | Signup fails | High |

#### Issues to Fix
- Admin email inconsistent: `hello@` (signups, events) vs `support@` (reminders)
- No email on subscription cancellation (member doesn't know they're archived)
- No alert when signup fails to create in Supabase

---

## Known Issues
- Webflow API token missing `sites:write` scope (can't auto-publish after archiving)
- Archived members require manual site publish to disappear from live site

## Credentials Location
- Supabase URL: `https://epszwomtxkpjegbjbixr.supabase.co`
- Edge functions deployed via `supabase functions deploy <name> --no-verify-jwt`
