# MTNS MADE - Migration Steps (Sequential)

**Date:** 2026-02-09

Legend:
- 🧑 = **You** (Paul) - action required
- 🤖 = **Claude** - I'll build this
- ✅ = Checkpoint - verify before continuing

---

## Deployment Strategy

**Recommended approach:** Test pages first, then swap to live

```
Phase 1: Build & test on separate test pages
Phase 2: Verify everything works
Phase 3: Update live pages to use new scripts
Phase 4: Remove old script references
```

**Why this approach:**
- Zero risk to live site during development
- Can test with real member accounts
- Easy rollback (just revert script URL)
- Clean cutover with no dual-system complexity

---

## MORNING SESSION

### Step 1: Export Active Members from Memberstack
**🧑 You do this**

1. Go to Memberstack Dashboard → Members
2. Click "Filter" → Status = `active` OR `trialling`
3. Click "Export" → Download CSV
4. Save to: `/Users/paulmosig/Downloads/memberstack-active-export.csv`
5. Note the filename - tell me when ready

✅ **Checkpoint:** You have the CSV file

---

### Step 2: Build & Run Cleanup Script
**🤖 I'll build this**

I'll create `/supabase/scripts/cleanup-webflow-lapsed.js` that:
- Reads your Memberstack export
- Fetches all members from Webflow CMS
- Identifies lapsed members (in Webflow but not in active export)
- Unpublishes lapsed members in Webflow
- Unpublishes their projects in Webflow
- Updates Supabase with lapsed status

**🧑 You run it:**
```bash
cd ~/Desktop/MTNS\ MADE\ TEMP/warp/mtns-made/supabase/scripts
node cleanup-webflow-lapsed.js --dry-run   # Preview first
node cleanup-webflow-lapsed.js             # Execute
```

✅ **Checkpoint:** Lapsed members unpublished, Supabase updated

---

### Step 3: Create Memberstack Webhook Edge Function
**🤖 I'll build this**

I'll create `/supabase/functions/memberstack-webhook/index.ts` that handles:
- `member.created` → Create Supabase record
- `member.deleted` → Hard delete from Supabase + Webflow
- `subscription.canceled` → Mark lapsed, unpublish from Webflow

**🧑 You deploy it:**
```bash
cd ~/Desktop/MTNS\ MADE\ TEMP/warp/mtns-made
supabase functions deploy memberstack-webhook
```

✅ **Checkpoint:** Function deployed to Supabase

---

### Step 4: Configure Memberstack Webhooks
**🧑 You do this**

1. Go to Memberstack Dashboard → Dev Tools → Webhooks
2. Add webhooks:

| Event | URL |
|-------|-----|
| `member.created` | `https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/memberstack-webhook` |
| `member.deleted` | Same URL |
| `subscription.canceled` | Same URL |

3. Copy the webhook signing secret
4. Add to Supabase Dashboard → Edge Functions → memberstack-webhook → Secrets:
   - `MEMBERSTACK_WEBHOOK_SECRET` = (the secret)

✅ **Checkpoint:** Webhooks configured in Memberstack

---

### Step 5: Test Webhook with Test Member
**🧑 You do this**

1. Create a test member in Memberstack (use a test email)
2. Check Supabase → members table → new record should appear
3. Delete the test member in Memberstack
4. Check Supabase → record should be deleted

✅ **Checkpoint:** Webhooks working - new signups/cancellations will sync automatically

---

## AFTERNOON SESSION

### Step 6: Complete Projects Supabase Script
**🤖 I'll build this**

I'll finish `/src/scripts/member-projects-supabase.js`:
- Load/save projects to Supabase (not Memberstack JSON)
- Upload images to Supabase Storage (not Uploadcare)
- No Zapier webhooks - Edge Function syncs to Webflow automatically

---

### Step 7: Deploy to Test Page
**🧑 You do this (in Webflow)**

The test page already exists: `/profile/edit-portfolio-supabase`

1. In Webflow Designer, go to that page
2. In page settings → Custom Code → Before </body>:

```html
<script>window.pageScript = 'member-projects-supabase';</script>
```

3. Make sure the page has the container: `.supabase-project-container`
4. Publish the site

---

### Step 8: Test Projects Flow
**🧑 You do this**

1. Log in as a test member
2. Go to `/profile/edit-portfolio-supabase`
3. Test:
   - [ ] Create a new project with images
   - [ ] Edit the project
   - [ ] Check Webflow CMS - project should appear within 5 seconds
   - [ ] Delete the project
   - [ ] Check Webflow CMS - project should be removed

✅ **Checkpoint:** Projects workflow working via Supabase

---

### Step 9: Swap Live Page to New Script
**🧑 You do this (in Webflow)**

Once testing passes, update the live page:

1. Go to `/profile/edit-portfolio` page in Webflow
2. In page settings → Custom Code → Before </body>:

**Change FROM:**
```html
<script>window.pageScript = 'member-projects';</script>
```

**Change TO:**
```html
<script>window.pageScript = 'member-projects-supabase';</script>
```

3. Publish the site

✅ **Checkpoint:** Live page now uses Supabase workflow

---

### Step 10: Remove Old Script References
**🧑 You do this (in Webflow)**

After confirming live page works:

1. Go to Webflow Site Settings → Custom Code
2. Find and remove the old script tags that load:
   - `member-projects.js` (old Zapier version)
   - Any Uploadcare scripts
   - Any Zapier-related scripts

**Scripts to keep:**
- `member-projects-supabase.js` (new version)
- `nav-2025.js`
- `page-loader.js`
- Core utilities

---

## LATER (Phase 2 - Can Do Another Day)

### Step 11: Update Onboarding Script
**🤖 I'll build:** `/src/scripts/member-onboarding-supabase.js`

Same pattern:
1. Build new script that saves to Supabase
2. Test on a test page
3. Swap live page to use new script
4. Remove old script references

**Test page:** Create `/profile/start-supabase` for testing

---

### Step 12: Update Events Script
**🤖 I'll build:** `/src/scripts/member-events-supabase.js`

Same pattern as above.

**Test page:** Create `/profile/my-events-supabase` for testing

---

### Step 13: Update Edit Profile Script
**🤖 I'll build:** `/src/scripts/member-edit-profile-supabase.js`

Same pattern as above.

---

### Step 14: Set Up Retention Automation
**🤖 I'll build:**
- `/supabase/functions/retention-cleanup/index.ts`
- `/supabase/functions/retention-warning/index.ts`

**🧑 You do:**
- Draft email copy for the warning email
- Set up Resend/Postmark account for sending
- Configure pg_cron schedule in Supabase

---

## Current JS Files Audit

**All scripts in `/src/scripts/`:**

| File | Purpose | Status | Action |
|------|---------|--------|--------|
| `member-projects.js` | Projects (Zapier/Uploadcare) | OLD | Remove after Step 9 |
| `member-projects-supabase.js` | Projects (Supabase) | NEW | Keep - use this |
| `member-projects-test.js` | Testing variant | OLD | Delete |
| `member-events.js` | Events (Zapier) | OLD | Remove after events migration |
| `member-onboarding.js` | Onboarding (Zapier) | OLD | Remove after onboarding migration |
| `member-edit-profile.js` | Edit profile (Zapier) | OLD | Remove after profile migration |
| `member-signup-2026.js` | Signup flow | Review | May need Supabase version |
| `nav-2025.js` | Navigation | CURRENT | Keep |
| `nav-responsive.js` | Old navigation | OLD | Remove if not used |
| `page-loader.js` | Page loader | CURRENT | Keep |
| `alert.js` | Alert component | CURRENT | Keep |

**🧑 Action after each migration:**
1. Update Webflow page to use new script
2. Remove old script reference from jsDelivr/CDN links
3. Git: Can keep old files for rollback, or delete after confirming stable

**Webflow Custom Code locations to check:**
- Site Settings → Custom Code (global scripts)
- Each page → Page Settings → Custom Code (page-specific scripts)

---

## Rollback Plan

If something breaks after going live:

1. In Webflow, change script back:
```html
<script>window.pageScript = 'member-projects';</script>
```

2. Publish immediately

The old Zapier webhooks are still configured (just not being called), so the old system will work.

---

## Summary Checklist

### Tomorrow's Must-Complete:
- [ ] Step 1: Export Memberstack active members
- [ ] Step 2: Run cleanup script
- [ ] Step 3: Deploy webhook Edge Function
- [ ] Step 4: Configure Memberstack webhooks
- [ ] Step 5: Test webhook with test member
- [ ] Step 6: Complete projects script
- [ ] Step 7: Deploy to test page
- [ ] Step 8: Test projects flow
- [ ] Step 9: Swap live page
- [ ] Step 10: Remove old script references

### Future Sessions:
- [ ] Step 11: Onboarding migration
- [ ] Step 12: Events migration
- [ ] Step 13: Edit profile migration
- [ ] Step 14: Retention automation

---

## Quick Reference: Test Pages

| Workflow | Test Page URL | Live Page URL | New Script |
|----------|---------------|---------------|------------|
| Signup | `/join/signup/signup-supabase` | `/join/signup` | `member-signup-supabase` |
| Onboarding | `/profile/onboarding` | `/profile/start` | `member-onboarding-supabase` |
| Projects | `/profile/edit-portfolio-supabase` | `/profile/edit-portfolio` | `member-projects-supabase` |
| Events | `/profile/suggest-an-event-supabase` | `/profile/suggest-an-event` | `member-events-supabase` |
| Edit Profile | `/profile/edit-profile-supabase` (create if needed) | `/profile/edit-profile` | `member-edit-profile-supabase` |

**Note:** `/profile/onboarding` currently loads old script - change to new script when ready to test.
