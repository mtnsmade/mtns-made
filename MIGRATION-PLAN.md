# MTNS MADE - Supabase Migration Plan

**Date:** 2026-02-09 (Tomorrow)
**Status:** Ready to execute

---

## Overview

Complete migration from Zapier/Uploadcare to Supabase, plus data cleanup for lapsed members.

### Architecture Change

```
BEFORE:
UI → Memberstack JSON → Zapier Webhooks → Webflow CMS
                      → Uploadcare (images, 24hr expiry issue)

AFTER:
UI → Supabase Database → Edge Functions → Webflow CMS
   → Supabase Storage (images, permanent URLs)
```

### Key Decisions

| Decision | Choice |
|----------|--------|
| Delete after 3 months | **Hard delete** (remove from Supabase + Webflow) |
| Email notification | **Yes** - send warning before deletion |
| Projects/events from deleted members | **Delete completely** |

---

## Phase 1: Data Cleanup (Morning)

Clean Webflow CMS of lapsed members before building new sync workflows.

### Step 1.1: Export Active Members from Memberstack

1. Go to Memberstack Dashboard → Members
2. Filter: Status = `active` OR `trialling`
3. Export CSV
4. Save to `/Users/paulmosig/Downloads/`

### Step 1.2: Create Cleanup Script

**File:** `/supabase/scripts/cleanup-webflow-lapsed.js`

**Functionality:**
- Load active member IDs from Memberstack CSV
- Fetch all members from Webflow CMS
- Compare lists to find lapsed members
- Unpublish lapsed members in Webflow (don't delete yet - 3 month policy)
- Unpublish all projects belonging to lapsed members
- Update Supabase: set `subscription_status = 'lapsed'`, `subscription_lapsed_at = NOW()`

**API Endpoints:**
- Webflow: `PATCH /collections/{id}/items/{id}` with `{ isDraft: true }`
- Supabase: Update members table

### Step 1.3: Execute Cleanup

```bash
cd /supabase/scripts
node cleanup-webflow-lapsed.js --dry-run  # Preview first
node cleanup-webflow-lapsed.js            # Execute
```

### Step 1.4: Verify Results

- Check Webflow CMS: lapsed members should be unpublished
- Check Supabase: `subscription_status` should be updated
- Spot check a few member profile URLs (should 404 or redirect)

---

## Phase 2: Complete Projects Migration (Afternoon)

Replace Zapier-based project workflow with Supabase.

### Step 2.1: Finish `member-projects-supabase.js`

**File:** `/src/scripts/member-projects-supabase.js`

**Features to implement:**
- [x] Supabase client setup (inline)
- [ ] Load projects from Supabase by `memberstack_id`
- [ ] Load categories from `directories` + `sub_directories` tables
- [ ] Create project → insert to Supabase (Edge Function auto-syncs to Webflow)
- [ ] Update project → update in Supabase
- [ ] Delete project → soft delete in Supabase
- [ ] Image upload via Supabase Storage
- [ ] Multi-image gallery (max 20 images)
- [ ] Reuse UI patterns from existing `member-projects.js`

**Remove:**
- Zapier webhook calls
- Uploadcare integration
- Memberstack JSON storage

### Step 2.2: Test Edge Function

The Edge Function `/supabase/functions/sync-to-webflow/index.ts` already exists.

**Verify it handles:**
- INSERT → Create Webflow CMS item
- UPDATE → Update Webflow CMS item
- DELETE → Delete from Webflow CMS

**Test via Supabase Dashboard:**
1. Insert test project directly in SQL editor
2. Check Webflow CMS for new item
3. Update project, verify Webflow updates
4. Delete project, verify Webflow removes

### Step 2.3: Deploy to Test Page

**Test URL:** https://www.mtnsmade.com.au/profile/edit-portfolio-supabase

1. Update page to load new script
2. Test full flow as a member:
   - Create project with images
   - Edit project
   - Delete project
3. Verify Webflow CMS updates correctly

---

## Phase 3: Events Migration (If Time Permits)

### Step 3.1: Create `member-events-supabase.js`

Similar pattern to projects:
- Load events from Supabase
- CRUD operations write to Supabase
- Edge Function syncs to Webflow

### Step 3.2: Extend Edge Function

Add event handling to `sync-to-webflow/index.ts` or create separate function.

---

## Phase 4: 3-Month Retention Automation

### Step 4.1: Create Scheduled Cleanup Function

**File:** `/supabase/functions/retention-cleanup/index.ts`

**Trigger:** Supabase pg_cron (daily at 2am AEST)

**Logic:**
```
1. Query members WHERE subscription_status = 'lapsed'
   AND subscription_lapsed_at < NOW() - INTERVAL '3 months'

2. For each member:
   a. Delete all their projects from Webflow CMS
   b. Delete all their events from Webflow CMS
   c. Delete member from Webflow CMS
   d. Hard delete from Supabase (CASCADE deletes projects/events)

3. Log deletions for audit trail
```

### Step 4.2: Create Warning Email Function

**File:** `/supabase/functions/retention-warning/index.ts`

**Trigger:** Daily at 9am AEST

**Logic:**
```
1. Query members WHERE subscription_status = 'lapsed'
   AND subscription_lapsed_at BETWEEN (NOW() - 2.5 months) AND (NOW() - 2.5 months + 1 day)
   AND retention_warning_sent = false

2. For each member:
   a. Send email via Resend/Postmark
   b. Set retention_warning_sent = true
```

**Email Template:** (TODO: Customize messaging)
```
Subject: Your MTNS MADE profile will be removed soon

Hi {first_name},

We noticed your MTNS MADE membership lapsed on {lapsed_date}.

Your profile and projects will be permanently removed on {deletion_date}
(3 months after your subscription ended).

To keep your profile active, please renew your membership:
{renewal_link}

If you have any questions, reply to this email.

Thanks,
The MTNS MADE Team
```

### Step 4.3: Database Changes

Add column for tracking warning email:
```sql
ALTER TABLE members ADD COLUMN retention_warning_sent BOOLEAN DEFAULT false;
```

---

## Environment Variables Needed

Add to `/supabase/scripts/.env`:
```
# Already configured
SUPABASE_URL=https://epszwomtxkpjegbjbixr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# Add for Webflow API
WEBFLOW_API_TOKEN=your_webflow_token
WEBFLOW_SITE_ID=6481b864324e32f8eb266e2f
WEBFLOW_MEMBERS_COLLECTION_ID=64a938756620ae4bee88df34
WEBFLOW_PROJECTS_COLLECTION_ID=64aa150f02bee661d503cf59
WEBFLOW_EVENTS_COLLECTION_ID=64aa21e9193adf43b765fcf1

# Add for email (retention warnings)
RESEND_API_KEY=your_resend_key  # or Postmark
```

---

## Rollback Plan

If issues arise:
1. Keep old scripts (`member-projects.js`) intact
2. Revert Webflow page to load old script
3. Zapier webhooks still configured (just not called)

---

## Success Criteria

- [ ] All lapsed members unpublished from Webflow
- [ ] All projects from lapsed members unpublished
- [ ] Supabase `subscription_status` accurate for all members
- [ ] Memberstack webhooks configured and tested
- [ ] New signups automatically create Supabase record
- [ ] Cancellations automatically trigger lapsed workflow
- [ ] New project creation works via Supabase (not Zapier)
- [ ] Projects appear in Webflow CMS within 5 seconds
- [ ] Images upload to Supabase Storage successfully
- [ ] No more Uploadcare 24hr expiry issues

---

## Recommended Sequence for Tomorrow

```
Morning:
├── 1. Data cleanup (Phase 1)
│   ├── Export Memberstack active members CSV
│   ├── Build cleanup-webflow-lapsed.js script
│   └── Execute (dry-run first, then live)
│
├── 2. Memberstack webhooks (Phase 5-6) ⚠️ DO THIS EARLY
│   ├── Create memberstack-webhook Edge Function
│   ├── Deploy to Supabase
│   ├── Configure webhooks in Memberstack Dashboard
│   └── Test with a test member (prevents future inconsistency)
│
Afternoon:
├── 3. Projects migration (Phase 2)
│   ├── Complete member-projects-supabase.js
│   ├── Test Edge Function sync
│   └── Deploy to test page
│
└── 4. If time permits:
    ├── Update onboarding script to use Supabase
    └── Start events migration
```

**Why webhooks early?** Once cleanup is done, webhooks must be active immediately so any new signups or cancellations go straight to Supabase. Otherwise we'll create new data inconsistencies while working on the rest.

---

## Phase 5: New Member Signup Workflow

Prevent future data inconsistency by syncing new signups immediately.

### Memberstack Redirects (Already Configured)

| Event | Current Redirect | Purpose |
|-------|------------------|---------|
| On Signup / On Purchase | `/profile/start` | Onboarding flow |
| On Login | `/profile/start` | Check if onboarding complete |
| On Logout | `#` | Stay on current page |

### Step 5.1: Create Supabase Record on Signup

**Trigger:** Member completes payment in Memberstack

**Option A: Memberstack Webhook → Supabase Edge Function**
- Memberstack sends webhook on `member.created`
- Edge Function creates member record in Supabase
- No code changes needed on frontend

**Option B: Frontend creates record on first page load**
- `/profile/start` page checks if member exists in Supabase
- If not, creates record with basic info from Memberstack
- Then proceeds to onboarding

**Recommended:** Option A (webhook) - more reliable, happens immediately

### Step 5.2: Update Onboarding to Use Supabase

**Current flow:**
1. Member redirected to `/profile/start`
2. Multi-step form collects profile data
3. Data saved to Memberstack custom fields
4. Zapier webhook syncs to Webflow

**New flow:**
1. Member redirected to `/profile/start`
2. Edge Function already created member record (from webhook)
3. Multi-step form collects profile data
4. Data saved directly to Supabase
5. Edge Function syncs to Webflow CMS
6. Redirect to `/profile` when complete

### Step 5.3: Memberstack Webhook Setup

In Memberstack Dashboard → Webhooks:

| Event | Endpoint |
|-------|----------|
| `member.created` | `https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/memberstack-webhook` |
| `member.updated` | Same endpoint |
| `member.deleted` | Same endpoint |
| `subscription.canceled` | Same endpoint |

**Edge Function:** `/supabase/functions/memberstack-webhook/index.ts`

---

## Phase 6: Member Cancellation Workflow

Handle subscription cancellations to maintain data consistency.

### Step 6.1: Subscription Cancelled Webhook

**Trigger:** `subscription.canceled` event from Memberstack

**Actions:**
1. Update Supabase: `subscription_status = 'lapsed'`, `subscription_lapsed_at = NOW()`
2. Unpublish member in Webflow CMS
3. Unpublish all member's projects in Webflow CMS
4. Start 3-month retention countdown

### Step 6.2: Member Deletes Account (Optional)

If member explicitly deletes their account (not just cancels subscription):

**Trigger:** `member.deleted` event from Memberstack

**Actions:**
1. Immediately delete from Webflow CMS (member + projects + events)
2. Hard delete from Supabase (or soft delete with `is_deleted = true`)
3. No retention period (they explicitly requested deletion)

### Cancellation vs Deletion

| Scenario | Retention | Webflow | Supabase |
|----------|-----------|---------|----------|
| Subscription lapses | 3 months | Unpublish | Keep, mark lapsed |
| Subscription cancelled | 3 months | Unpublish | Keep, mark lapsed |
| Member deletes account | None | Delete immediately | Delete immediately |

---

## Updated Files to Create

| File | Purpose | Priority |
|------|---------|----------|
| `/supabase/scripts/cleanup-webflow-lapsed.js` | One-time cleanup | P1 |
| `/src/scripts/member-projects-supabase.js` | Replace Zapier projects | P1 |
| `/supabase/functions/memberstack-webhook/index.ts` | Handle signup/cancel events | P1 |
| `/supabase/functions/retention-cleanup/index.ts` | Auto-delete after 3 months | P2 |
| `/supabase/functions/retention-warning/index.ts` | Email warning | P2 |
| `/src/scripts/member-onboarding-supabase.js` | New onboarding flow | P2 |
| `/src/scripts/member-events-supabase.js` | Replace Zapier events | P3 |

---

## Memberstack Webhook Events Reference

| Event | When | Our Action |
|-------|------|------------|
| `member.created` | New signup | Create Supabase record |
| `member.updated` | Profile change | Sync to Supabase (if needed) |
| `member.deleted` | Account deleted | Hard delete everywhere |
| `subscription.created` | New subscription | Set status = active |
| `subscription.updated` | Plan change | Update membership_type |
| `subscription.canceled` | Cancellation | Mark lapsed, start retention |

---

## Notes

- **Memberstack stays** for authentication only
- **Webflow CMS stays** as the public-facing data store
- **Supabase becomes** the source of truth for member data
- **Edge Functions replace** Zapier for all sync operations
- **Memberstack webhooks** trigger Edge Functions for signup/cancel events
- **Memberstack redirects** control user flow (already configured)

---

## TODO: Email Messaging Customization

The retention warning email needs custom copy. Consider:
- Tone (friendly but clear about consequences)
- Include benefits of staying a member
- Easy renewal link
- Support contact info
- Maybe offer a discount to win back?

Draft email copy before implementing the warning function.
