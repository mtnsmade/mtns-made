# MTNS MADE — Digital Comms Strategy
## Member Profile Health & Quality Program

_Prepared by Studio Racket — May 2026_

---

## Current State Snapshot

### Platform (Supabase + Webflow + Memberstack)
- ~389 active paying members receiving the monthly newsletter
- Profile completion tracked via `profile_complete` boolean in Supabase
- Weekly profile reminder email exists (`profile-reminder` edge function) but is a generic nudge with no segmentation
- Known bug: some members meet all requirements but `profile_complete` stays `false`

### Mailchimp
| Metric | Value | Industry Avg |
|--------|-------|--------------|
| Main list subscribers | 1,576 | — |
| Active members segment | ~391 | — |
| Member newsletter open rate | **65–75%** | ~27% |
| Member newsletter click rate | **6–15%** | ~2.2% |
| Unsubscribes (all time) | 1,009 | — |
| Net subscriber growth/month | -2 (avg unsub > sub) | — |

**Key finding:** The member audience is extraordinarily engaged — 65–75% open rates are 2–3x the Arts & Artists industry average. This is an asset. It means well-crafted, targeted emails will land. The risk is over-emailing and burning this goodwill.

**Two-speed list in use:**
- ~391 tagged "Members" → monthly newsletter + program comms
- ~1,592 untagged general Blue Mountains audience → quarterly "Creative Industries" broadcast

**Micro-segments active:** Film & Screen Cluster (49), Retail Ready cohort (13) — showing appetite for targeted discipline-specific comms.

**Automations built but dormant:** "MTNS MADE Onboarding series" exists in Mailchimp in draft status — has never sent a single email.

### Instagram (@mtnsmade)
- 842 posts / 6,086 followers / 2,472 following
- Content is almost entirely event promotion and recaps — zero member spotlights or profile showcases
- Monthly salon events are the core engagement driver
- Strong venue partnerships visible (The Carrington, On The Soul Side, New Ivanhoe Hotel, Rosey Ravelston Books)
- Story highlights suggest active sub-communities: Textiles, Film, Salons & Events

---

## Strategic Goals

1. **Phase 1 — Profile Completion:** Get all active members to 90%+ completion rate
2. **Phase 2 — Profile Quality:** Improve the actual content of completed profiles (bio, categorisation, imagery)
3. **Coordination:** Align website UX, Mailchimp sequencing, and Instagram content into a single coherent member journey

---

## Phase 1: Profile Completion to 90%+

### What "complete" means (current platform logic)
- Display name set
- Suburb selected
- Discipline/category selected
- Short bio written
- At least one profile image uploaded

### Why members leave profiles incomplete
Based on the platform patterns, the likely reasons are:
1. They signed up, hit a friction point (image upload, bio writing) and stopped
2. They don't know their profile is incomplete — the platform doesn't surface this clearly
3. They don't understand what benefit a complete profile gives them

### Activation sequence (Mailchimp)

**Activate the dormant onboarding series.** It's already built in Mailchimp — just needs content and activation.

Proposed 4-email onboarding flow triggered on `member.created`:

| # | Timing | Subject | Goal |
|---|--------|---------|------|
| 1 | Day 0 (welcome) | "Welcome to MTNS MADE — you're in." | Warm welcome, set expectations. Existing email exists. |
| 2 | Day 3 | "Your profile is your MTNS MADE listing — here's what to include" | Explain what a profile page looks like publicly, link to their page |
| 3 | Day 7 | "One thing missing from your profile" | If incomplete: specific call out of which field(s) are missing. If complete: celebrate + show what's next. |
| 4 | Day 14 | "You're listed in the MTNS MADE directory" | Confirmation their listing is live. Show how people find them. |

**Technical requirement:** Email 3 requires Mailchimp to know which profile fields are missing per member. Two approaches:
- **Simple (now):** Send the email to all incomplete members with a generic "finish your profile" CTA. Already possible with the `Members` tag + a Supabase query.
- **Sophisticated (later):** Sync profile completion fields as Mailchimp merge fields, enabling personalised field-specific messaging.

### Targeted re-engagement for existing incomplete members

Don't wait for new signups. Run a one-off targeted campaign to the existing incomplete member cohort:

1. Query Supabase: `SELECT email FROM members WHERE profile_complete = false AND status = 'active'`
2. Upload as a static segment in Mailchimp
3. Send a 2-email sequence:
   - Email 1: "Your MTNS MADE profile isn't visible yet — here's how to fix it in 5 minutes"
   - Email 2 (1 week later, to non-openers/non-clickers): "Last reminder — complete your listing"

### Platform UX changes to support completion

The email campaign will fail unless the profile completion experience on the website is smooth. Recommended platform changes (to build):

- **Profile completion indicator on the dashboard** — a progress bar or checklist showing which fields are missing, visible when a member logs in
- **Fix the `profile_complete` bug** — some members satisfy all requirements but the flag stays false (known issue in `member-edit-profile-supabase.js`)
- **Better image upload guidance** — show the expected dimensions/format before they attempt the upload, not after failure
- **"Your listing is live" moment** — a confirmation state when all fields are complete, with a link to their public page

---

## Phase 2: Profile Quality Improvement

Completion is a binary — quality is a spectrum. The goal here is to move from "field filled in" to "field filled in well."

### The quality dimensions

| Dimension | Common problem | Target state |
|-----------|---------------|--------------|
| **Written bio** | One sentence, no personality, no context | 2–3 sentences: who they are, what they make, what makes them Blue Mountains |
| **Categorisation** | Wrong discipline selected, or too broad | Accurate primary category, secondary tags where applicable |
| **Profile image** | No image, blurry, wrong crop | Clean headshot or branded portrait, square, good contrast |
| **Work images** | No project images uploaded | At least 2–3 images showing actual work |
| **Website/social links** | Blank or broken | Current website, Instagram at minimum |

### Resources to build (website)

A "Member Resources" section (can live at `/profile/resources` or similar):

1. **"Writing your MTNS MADE bio"** — a short guide with examples. Show three real member bios (good ones, with permission) and explain what makes them work. Template: _I'm a [discipline] based in [suburb]. I [what you make/do]. [One sentence about your practice or approach]._
2. **"Getting your profile photo right"** — image spec card. Dimensions, file format, size limit. Example of a good vs. poor crop. Offer: "We can help — email us a photo and we'll crop it for you."
3. **"Choosing your category"** — explain each discipline category, what it covers, who should use it. Prevents misfiling.
4. **Categorisation FAQ** — common questions: "I do more than one thing — which do I pick?" / "My work doesn't fit any category — what do I do?"

### 1:1 support program

For members who are clearly stuck (profile still incomplete after 30 days, or complete but sparse):

- **Monthly profile clinic** — a Zoom or in-person drop-in (30 min) where members can share their screen and get help with their listing. Position it as a members-only benefit, not a remediation.
- **"Profile check" email offer** — invite members to reply to a newsletter with their profile link and get a personalised 3-line written critique within the week.
- **Peer examples in the newsletter** — each month, feature one "profile of the month" with a callout on what they did well. This creates aspiration and a model for others to follow.

### Discipline-specific outreach

The Film & Screen Cluster micro-segment (49 members) shows this already works. Extend to other disciplines:

- Run a "is your Textiles listing right?" email to the textiles sub-segment
- Partner the email with an Instagram post in the same week (Textiles Events highlight)
- This creates the cross-channel coordination: the email and the social post reinforce each other

---

## Member Offboarding & Re-engagement Flow

Today, a member who cancels simply stops. There's no farewell, no retention attempt, and no clear policy on what happens to their data. This is both a missed retention moment and an unaddressed privacy obligation (the Australian Privacy Act gives members a right to access their personal data).

The proposed flow turns cancellation into a structured re-engagement arc, and turns the data we currently rush to delete into the asset that makes rejoining frictionless.

### The flow

```
Member self-cancels (member.plan.canceled)
        │
        ▼
   Archive state — profile offline, data retained, 90-day clock starts
        │
        ├─ re-subscribes anytime in window ──► profile auto-rebuilds, back live
        │
        ▼
   90 days later: "Final call" email
        │
        ├─ [Rejoin] ──────────────► profile auto-rebuilds from retained data
        │
        └─ [Delete + send my data] ─► zip of their material emailed, then hard delete
        │
        ▼
   No response ──► one reminder, further grace period, then delete (export auto-sent)
```

### Why it works

- The retained profile data becomes the reason to rejoin — "your profile rebuilds automatically, nothing to redo"
- The data export stops being a pure compliance cost and becomes the graceful side of a fork the member chooses
- It gives a defensible reason to retain data through the archive window rather than deleting eagerly

### What it depends on (build)

1. **90-day timer** — a scheduled job (pg_cron) that scans for members archived ≥90 days and triggers the final-call email. New infrastructure.
2. **Reliable archive → live rebuild** — re-subscribing must cleanly restore the profile to Webflow and reset `is_deleted` / `subscription_status`. Current resubscribe path needs to be confirmed as a full rebuild, not partial.
3. **Data export** — collect profile + projects + images and package into a zip, emailed on the member's explicit "delete + send my data" choice. Must run *before* the current `deleteMemberImages` step, which permanently wipes storage. Edge-function memory/timeout limits mean image-heavy accounts may need a signed download link rather than an attachment.
4. **The fork actions** — the final email needs two working links: rejoin, and delete-and-export. The delete link is destructive and must route through a confirmation step, not a one-click wipe.

### Open policy questions (for the workshop)

- **No-response default:** hard-delete after grace period (clean, irreversible) vs. retain indefinitely (safe, defeats the purpose). Leaning toward delete-with-auto-export after a reminder.
- **Retention window:** is 90 days right? No legal mandate, but indefinite retention of cancelled members' data should be avoided.
- **Export availability:** only on explicit delete, or auto-attached to the final email regardless of choice.

> **Note:** This flow also closes two gaps already identified — the missing subscription-cancellation email and the missing member-deleted email. Best treated as one "member offboarding" piece of work rather than three separate ones.

---

## Channel Coordination Framework

The problem today: Mailchimp, Instagram, and the website platform operate in silos. The member journey is fragmented.

### Proposed content cadence

| Week | Website | Mailchimp | Instagram |
|------|---------|-----------|-----------|
| Week 1 (of month) | — | Monthly member newsletter | Event promotion for upcoming salon |
| Week 2 | Profile tip added to resources section | — | Member spotlight post (links to directory listing) |
| Week 3 | — | Discipline-specific targeted email (rotating) | Discipline-specific content (matches email segment) |
| Week 4 | — | Event recap or program announcement | Post-event recap + thank you |

**Key principle:** When Mailchimp targets the Film segment, Instagram runs film content that same week. The member receives a consistent signal — "MTNS MADE is paying attention to my world."

### Instagram as a profile discovery driver

Currently Instagram drives no traffic to member profiles. This is an untapped loop:

- **Member spotlight posts:** Feature a member's work (with their permission), tag them, and include "Find [name] in the MTNS MADE directory — link in bio"
- **"Meet a member" Reels/Stories:** Short 30-second video or carousel — who they are, what they make, where they're based
- **Category showcases:** "This week: Blue Mountains textile artists" — grid of 3–4 member profiles, all with directory links

This creates a virtuous loop: better profiles → more Instagram-worthy content → more directory traffic → more value from membership → more complete profiles.

### Metrics to track

| Goal | Metric | Source | Target |
|------|--------|--------|--------|
| Profile completion | % members with `profile_complete = true` | Supabase | 90% |
| Profile quality | Avg fields filled per member | Supabase | All 5 fields filled |
| Newsletter health | Member open rate maintained | Mailchimp | >60% |
| Directory traffic | Clicks to member profile pages | Webflow analytics | +30% QoQ |
| Instagram → site | Link-in-bio clicks to directory | Instagram Insights | Baseline then grow |
| New member retention | Profiles complete within 14 days of signup | Supabase | >75% |

---

## Recommended Immediate Actions (Before Next Month)

| Priority | Action | Owner | Effort |
|----------|--------|-------|--------|
| 1 | Activate Mailchimp onboarding sequence (4 emails) | Racket + MTNS MADE | 1 day |
| 2 | Query incomplete members, run targeted 2-email campaign | Racket | 2 hrs |
| 3 | Fix `profile_complete` bug in edit profile script | Racket | 2 hrs |
| 4 | Add profile completion indicator to member dashboard | Racket | 1 day |
| 5 | Write "bio guide" and "photo guide" resource pages | MTNS MADE (content), Racket (build) | 1 day each |
| 6 | Run first member spotlight on Instagram (existing great profiles) | MTNS MADE | 30 min |
| 7 | Standardise admin email to `hello@mtnsmade.com.au` across all edge functions | Racket | 30 min |

---

## What We Need From MTNS MADE

- Sign-off on the onboarding email copy (we draft, they approve)
- 3–5 members who consent to being featured in Instagram spotlights
- Decision on whether to offer the monthly profile clinic (in-person at 2 Civic Place vs Zoom)
- Content for the bio/photo resource guides (examples of good bios from existing members)
