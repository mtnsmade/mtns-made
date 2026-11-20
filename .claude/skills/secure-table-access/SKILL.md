---
name: secure-table-access
description: MTNS MADE checklist for moving a browser-side Supabase table call (members, messages, support_tasks, events, opportunities, projects, storage) behind a Memberstack-verified edge function and then revoking the public key's grant on that table. Use whenever work involves tightening Supabase grants or RLS, replacing `supabase.from(...)` calls in src/scripts with edge-function calls, adding `verifyMember` / `verifyStaff` checks, the admin dashboard's data access, or any "lock down", "revoke anon", "move behind a function" or access-control change in this project, even if the user only names one table or one script.
---

# Secure table access (MTNS MADE)

Members log in through Memberstack, and Supabase cannot see that login, so RLS cannot express "own rows only". The safe pattern is: the browser sends its Memberstack token to an edge function, the function verifies it server-side and works with the service role, scoped to the verified member, and the public key loses its grant on the table.

The order of steps matters more than anything else here. Revoking a grant before the replacement path is live breaks the site for every member at once.

## 1. Enumerate every client call first

Search both `src/scripts/` and `dist/scripts/` (dist is what the live site serves; they can differ) for every call on the table:

```bash
grep -rn -E "from\(['\"]<table>['\"]\)" src/scripts dist/scripts
```

For each hit, record the verb (select, insert, update, delete, upsert), the columns, and the filter. A fixed-width regex window misses chained calls, so read each one. Also check `.rpc(` calls and direct `fetch` to `/rest/v1/<table>`. Edge functions use the service role and are not affected by grant changes.

Decide per call: stays public (only public columns, no private data), or moves behind a function.

## 2. Server side: verify, then scope

Use `supabase/functions/_shared/auth.ts`:

- `verifyMember(req)`: reads the `X-Member-Token` header, verifies it with `POST https://admin.memberstack.com/members/verify-token` (body `{"token": ...}`, header `X-API-KEY`, and `User-Agent: curl/8.7.1` because Memberstack's edge rejects default runtime user agents). An invalid token returns HTTP 400 `INVALID_TOKEN`.
- `verifyStaff(req)`: `verifyMember` plus an active `pln_admin-o4hk0j5b` plan connection.

Both fail closed: any error is a 401, never a fallback to trusting the request.

Every query uses the verified member ID. A `memberstack_id` or member ID in the request body is a claim, not proof, so ignore it for scoping. For updates, apply an allowlist of editable fields rather than passing the body through.

## 3. Client side

Get the token with `(await window.$memberstackDom.getMemberToken())?.data?.token` and send it as `X-Member-Token` with the public key headers. Handle a 401 with a clear message (log in again) rather than a silent empty state. Rebuild `dist/scripts` after editing `src/scripts`.

## 4. Deploy in this order

1. Deploy the edge function (`supabase functions deploy <name> --no-verify-jwt`). Check first that no unrelated uncommitted change under `supabase/functions/_shared/` would go live with it.
2. Commit and push the front end (Webflow serves scripts from GitHub).
3. Confirm the live site works through the new path (browser test as a real member, and staff where relevant).
4. Only then apply the revoke migration.

## 5. Revoke migration

Follow `supabase/migrations/044_revoke_anon_write_grants.sql`: table grants are checked before RLS, so a revoke is a hard stop. Revoke from both `anon` and `authenticated` (Supabase Auth is unused, but `authenticated` carries the same grants). For column-level access, revoke SELECT on the table and grant SELECT on the public column list.

Write the matching re-grant SQL to `security-private/` (gitignored) before applying, so a breakage can be reverted in one statement.

## 6. Verify

- Curl with the public key: the table returns a permission error, or only the public columns.
- Browser: every flow found in step 1 still works.
- Edge function logs for 401s and permission errors over the next 48 hours; scheduled jobs (consistency check, stocktake, reconcile) complete normally.

## 7. Commit

The repo is public. Commit messages, migration comments and docs describe the change neutrally ("move inbox reads to a verified function", "restrict member columns readable by the public key"), never what was exposed or how. Findings and test results stay in gitignored folders.
