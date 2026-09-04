// MTNS MADE - Shared Memberstack helpers
//
// Single source of truth for two pieces of logic that were independently
// (and inconsistently, sometimes wrongly) reimplemented across 5+ edge
// functions: "is this member active?" and "what's their membership_type_id?".
// See .claude/skills/memberstack-integration/ for the broader Memberstack
// integration reference, and the 2026-08-08 stabilization plan for why this
// module exists.

// slug -> Memberstack plan ID for the 6 billed tiers. Previously duplicated
// only in admin-update-member/index.ts; centralized here 2026-08-19 so a
// webhook handler needing the reverse lookup (planId -> slug, below) has one
// definition to stay in sync with, not a second copy that can drift.
// Partner has no plan - it's manually assigned, never appears here.
export const MEMBERSTACK_PLAN_IDS: Record<string, string> = {
  'emerging': 'pln_emerging-i59k0l22',
  'professional': 'pln_professional-ic970osr',
  'not-for-profit': 'pln_not-for-profit-qaa106a4',
  'small-business': 'pln_small-business-qsa506lc',
  'large-business': 'pln_medium-large-business-9qa706pj',
  'spaces-suppliers': 'pln_creative-spaces-suppliers-ck5s08g3',
};

const MEMBERSTACK_PLAN_SLUGS_BY_ID: Record<string, string> = Object.fromEntries(
  Object.entries(MEMBERSTACK_PLAN_IDS).map(([slug, planId]) => [planId, slug])
);

export function getMembershipTypeSlugByPlanId(planId: string | undefined | null): string | null {
  if (!planId) return null;
  return MEMBERSTACK_PLAN_SLUGS_BY_ID[planId] || null;
}

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

// Keep Memberstack's customFields['membership-type'] in sync with a member's
// actual active plan. Added 2026-08-19 after Erin McCoy's upgrade (Emerging ->
// Professional) went through correctly on Stripe/Memberstack, but her profile
// kept showing Emerging - the custom field is only ever set once, at initial
// signup, and nothing had ever updated it since. resolveMembershipTypeId()'s
// fallback tier reads this exact field when it can't resolve via the active
// plan name, so a stale field silently produces a wrong result the next time
// that fallback tier is hit (as happened here). Call this ONLY from a context
// that just resolved the member's type via their real active plan (the
// authoritative source) - not from read-only/reporting callers of
// resolveMembershipTypeId (check-consistency, reconcile-members, etc.), which
// should stay side-effect-free.
export async function syncMembershipTypeCustomField(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  memberstackId: string,
  membershipTypeId: string,
  currentCustomFieldValue: string | undefined | null
): Promise<void> {
  const { data, error } = await supabase
    .from('membership_types')
    .select('slug')
    .eq('id', membershipTypeId)
    .maybeSingle();

  if (error || !data?.slug || data.slug === currentCustomFieldValue) return;

  const MEMBERSTACK_API_KEY = Deno.env.get('MEMBERSTACK_API_KEY') || '';
  if (!MEMBERSTACK_API_KEY) return;

  try {
    const response = await fetch(`https://admin.memberstack.com/members/${memberstackId}`, {
      method: 'PATCH',
      headers: { 'X-API-KEY': MEMBERSTACK_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ customFields: { 'membership-type': data.slug } }),
    });
    if (!response.ok) {
      console.error('syncMembershipTypeCustomField failed:', response.status, await response.text());
    } else {
      console.log('Synced Memberstack membership-type custom field:', currentCustomFieldValue, '->', data.slug);
    }
  } catch (err) {
    console.error('syncMembershipTypeCustomField error:', err);
  }
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
