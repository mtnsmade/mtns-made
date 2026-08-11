// MTNS MADE - Shared Memberstack helpers
//
// Single source of truth for two pieces of logic that were independently
// (and inconsistently, sometimes wrongly) reimplemented across 5+ edge
// functions: "is this member active?" and "what's their membership_type_id?".
// See .claude/skills/memberstack-integration/ for the broader Memberstack
// integration reference, and the 2026-08-08 stabilization plan for why this
// module exists.

export interface PlanConnection {
  status: string;
  planName?: string;
  planId?: string;
  payment?: {
    nextBillingDate?: string | null;
  };
}

export interface MemberstackCustomFields {
  [key: string]: string | boolean | undefined;
}

// ACTIVE = paying member. TRIALING = in trial period, also a live subscription.
// REQUIRES_PAYMENT is a mid-retry state (Stripe is still trying the card) and
// must NEVER be treated as lapsed here - a member archived during a retry
// window that then succeeds is exactly the kind of bug this module exists to
// stop. CANCELED and anything else count as not active.
const ACTIVE_STATUSES = ['ACTIVE', 'TRIALING'];

export function isActiveStatus(status: string | undefined | null): boolean {
  return !!status && ACTIVE_STATUSES.includes(status);
}

export function hasActivePlan(planConnections: PlanConnection[] | undefined | null): boolean {
  if (!planConnections || planConnections.length === 0) return false;
  return planConnections.some((p) => isActiveStatus(p.status));
}

export function getActivePlanConnection(
  planConnections: PlanConnection[] | undefined | null
): PlanConnection | undefined {
  return planConnections?.find((p) => isActiveStatus(p.status));
}

// Resolve a Memberstack member's membership_type_id via a two-tier lookup:
//
// 1. The active plan's planName, matched against membership_types.name.
// 2. customFields['membership-type'] - a SLUG set by the signup form at
//    account-creation time, before any plan is attached - matched against
//    membership_types.slug.
//
// These are genuinely different columns holding genuinely different value
// formats (e.g. name "Large Business" vs slug "large-business"). Comparing
// the slug against .name (or vice versa) is the exact bug this module exists
// to stop being reintroduced - it's happened independently in at least two
// places already.
export async function resolveMembershipTypeId(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  member: {
    planConnections?: PlanConnection[] | null;
    customFields?: MemberstackCustomFields | null;
  }
): Promise<string | null> {
  const activePlan = getActivePlanConnection(member.planConnections);
  if (activePlan?.planName) {
    const { data } = await supabase
      .from('membership_types')
      .select('id')
      .ilike('name', activePlan.planName)
      .maybeSingle();
    if (data?.id) return data.id;
  }

  const slug = member.customFields?.['membership-type'];
  if (typeof slug === 'string' && slug) {
    return getMembershipTypeIdBySlug(supabase, slug);
  }

  return null;
}

// For callers that already have the slug in hand (e.g. the signup-time custom
// field value) rather than a full Memberstack member object.
export async function getMembershipTypeIdBySlug(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  slug: string | null | undefined
): Promise<string | null> {
  if (!slug) return null;

  const { data, error } = await supabase
    .from('membership_types')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;
  return data.id;
}

// Find a slug that doesn't collide with an existing member. Added 2026-08-11
// after createMember (memberstack-webhook) had no uniqueness handling at all -
// two real, different members sharing a name (both "Reece McMillan") produced
// the same slug, and the second signup's insert hard-failed on
// members_slug_key with no fallback, completely blocking that member's
// account creation. Shared here (not duplicated per-caller) specifically so
// every member-creation code path - the real-time webhook, and the
// admin/manual recovery paths in query-members that exist for exactly the
// case where the webhook already failed once - stays consistent. Mirrors the
// existing pattern already used for opportunity and project slugs (try base,
// then -2, -3, ..., then a timestamp suffix as a last resort).
export async function findAvailableMemberSlug(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  baseSlug: string
): Promise<string> {
  const { data: existing } = await supabase
    .from('members')
    .select('slug')
    .eq('slug', baseSlug)
    .maybeSingle();
  if (!existing) return baseSlug;

  for (let i = 2; i <= 99; i++) {
    const candidate = `${baseSlug}-${i}`;
    const { data: candidateExisting } = await supabase
      .from('members')
      .select('slug')
      .eq('slug', candidate)
      .maybeSingle();
    if (!candidateExisting) return candidate;
  }

  return `${baseSlug}-${Date.now().toString(36)}`;
}
