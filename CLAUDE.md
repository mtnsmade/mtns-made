# MTNS MADE - Project Memory

## Plan Mode Instructions
When entering plan mode for any task, identify repeatable parts of the plan and build skills for them using the `/skill-creator` skill before executing.

## Project Overview
MTNS MADE is a Blue Mountains creative community platform with:
- **Memberstack** for authentication/payments
- **Supabase** for database and storage
- **Webflow** for CMS and frontend

## Credentials
All API keys and tokens are in `cred.env` (gitignored). **Always read this file first** before searching elsewhere for keys, URLs, or tokens:
```
/Users/paulmosig/Desktop/MTNS MADE TEMP/warp/mtns-made/cred.env
```
Contains: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `WEBFLOW_API_TOKEN`, `WEBFLOW_*_COLLECTION_ID`, `WEBFLOW_SITE_ID`, `MAILCHIMP_*`.
Anthropic API key is in `scripts/populate-subdirectories/.env` — model must be from the Claude 4 series (key has no access to Claude 3).
Supabase Management API personal access token is in macOS keychain (`security find-generic-password -s "Supabase CLI" -w | sed 's/go-keyring-base64://' | base64 -d`).

## Key Files
- `supabase/functions/memberstack-webhook/index.ts` - Member lifecycle events
- `supabase/functions/sync-member/index.ts` - Sync member to Webflow
- `src/scripts/member-edit-profile-supabase.js` - Profile editing
- `src/scripts/member-projects-supabase.js` - Project CRUD
- `src/scripts/member-events-supabase.js` - Event submissions
- `src/scripts/admin-dashboard.js` - Admin interface

## Pending Tasks

See `ROADMAP.md` for all planned work, priorities, and implementation notes.

Key open items:
- **R-001** — Migrate email sending to Gmail API (replacing Resend, hitting 100/day limit)
- **R-002** — Missing emails + admin address consistency (best after R-001)
- **R-003** — Workflow CRUD analysis (`"run the workflow CRUD analysis"`)
- **R-004** — Mailchimp member lifecycle sequences
- **R-005** — Intermittent `profile_complete` evaluation bug
- **R-006** — Webflow auto-publish (blocked on API token scope)

---

## Known Issues
- Webflow API token missing `sites:write` scope (can't auto-publish after archiving)
- Archived members require manual site publish to disappear from live site

## Bugs Fixed (March 2026)

### profile_complete Bug (FIXED)
**Issue:** Members had all profile requirements but `profile_complete` stayed `false`.

**Root Causes Found:**
1. `member-onboarding-supabase.js` was setting `profile_complete: true` unconditionally without validation
2. Some members could bypass step validation and submit without all fields

**Fixes Applied:**
- Added proper `isProfileComplete` calculation to onboarding script (same logic as edit profile)
- Fixed 12 members whose `profile_complete` was incorrectly `false`
- Fixed 9 members who had `profile_complete: true` but no suburb selected

**Remaining Issue:** Intermittent bug in `member-edit-profile-supabase.js` where completion check fails despite all requirements being met. Needs browser console logging to diagnose. The check at lines 1009-1018 is correct but sometimes evaluates wrong.

## Automated Systems

### Data Consistency Check
**Edge Function:** `check-consistency`
**Schedule:** Daily at 6:00 AM AEST (via pg_cron)

Compares member data across Memberstack, Supabase, and Webflow to identify:
- **Missing from Supabase:** Active Memberstack members not in database
- **Missing from Webflow:** Complete profiles not synced to CMS
- **Status Mismatches:** Subscription status differs between systems
- **Orphaned Records:** Records in Supabase/Webflow but not in Memberstack

**Manual Trigger:**
```bash
curl -X POST "https://epszwomtxkpjegbjbixr.supabase.co/functions/v1/check-consistency" \
  -H "Content-Type: application/json" -d "{}"
```

**Last Check Results (March 2026):**
- 212 status mismatches (Memberstack inactive, Supabase active)
- 237 orphaned records (in Supabase but not in Memberstack)
- 0 critical issues

**Note:** Run migration `023_consistency_reports.sql` in Supabase SQL Editor to enable report storage and daily cron.

---

## Credentials Location
- Supabase URL: `https://epszwomtxkpjegbjbixr.supabase.co`
- Edge functions deployed via `supabase functions deploy <name> --no-verify-jwt`
