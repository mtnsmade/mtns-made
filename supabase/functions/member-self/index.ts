/**
 * MTNS MADE - Member Self
 *
 * The logged-in member's own record, for Onboarding, Edit Profile and the
 * profile checklist. The member's Memberstack token (X-Member-Token) is
 * verified server-side and every read and write is limited to that member's
 * own row.
 *
 * POST { action: 'get' }                 own row (or null if none yet)
 * POST { action: 'ensure' }              own row, creating it if missing
 * POST { action: 'save', fields }        update own row (allowlisted fields)
 * POST { action: 'slug-check', slug }    { available } for this member
 *
 * Email, Memberstack id, membership type and profile_completed_at are set
 * here from the verified login, never taken from the request.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verifyMember, authErrorResponse, VerifiedMember } from '../_shared/auth.ts';
import { resolveMembershipTypeId, hasActivePlan } from '../_shared/memberstack.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info, x-member-token',
};

const ROW_SELECT = '*, membership_type:membership_types(id, name, slug)';

// Fields a member may set on their own record.
const TEXT_FIELDS = [
  'first_name', 'last_name', 'name', 'slug', 'profile_image_url', 'header_image_url',
  'bio', 'business_name', 'suburb_id', 'business_address',
  'opening_monday', 'opening_tuesday', 'opening_wednesday', 'opening_thursday',
  'opening_friday', 'opening_saturday', 'opening_sunday',
  'website', 'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube',
  'onboarding_started_at',
];
const BOOL_FIELDS = ['show_address', 'show_opening_hours', 'is_creative_space', 'is_supplier', 'profile_complete'];
const MAX_TEXT = 10000;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function cleanFields(input: unknown): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!input || typeof input !== 'object') return out;
  const f = input as Record<string, unknown>;
  for (const k of TEXT_FIELDS) {
    if (!(k in f)) continue;
    const v = f[k];
    if (v === null || v === '') out[k] = null;
    else if (typeof v === 'string') out[k] = v.slice(0, MAX_TEXT);
  }
  for (const k of BOOL_FIELDS) {
    if (k in f && typeof f[k] === 'boolean') out[k] = f[k];
  }
  if ('onboarding_step' in f && Number.isInteger(f.onboarding_step)) {
    const step = f.onboarding_step as number;
    if (step >= 0 && step <= 20) out.onboarding_step = step;
  }
  return out;
}

function customField(member: VerifiedMember, key: string): string | null {
  const v = member.customFields?.[key];
  return typeof v === 'string' && v ? v : null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  try {
    const member = await verifyMember(req);
    const body = await req.json().catch(() => ({}));
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const getOwn = async () => {
      const { data, error } = await supabase
        .from('members')
        .select(ROW_SELECT)
        .eq('memberstack_id', member.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    };

    const createOwn = async (extra: Record<string, unknown> = {}) => {
      const membershipTypeId = await resolveMembershipTypeId(supabase, member);
      const { error } = await supabase.from('members').insert({
        memberstack_id: member.id,
        email: member.email || null,
        first_name: customField(member, 'first-name'),
        last_name: customField(member, 'last-name'),
        subscription_status: hasActivePlan(member.planConnections) ? 'active' : null,
        membership_type_id: membershipTypeId,
        profile_complete: false,
        is_deleted: false,
        ...extra,
      });
      if (error) throw error;
      console.warn('member-self: member record created from the browser flow:', member.id);
      return await getOwn();
    };

    switch (body?.action) {
      case 'get':
        return json({ member: await getOwn() });

      case 'ensure':
        return json({ member: (await getOwn()) || (await createOwn()) });

      case 'slug-check': {
        const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
        if (!slug) return json({ error: 'slug required' }, 400);
        const { data, error } = await supabase
          .from('members')
          .select('memberstack_id')
          .eq('slug', slug)
          .limit(1);
        if (error) throw error;
        const owner = data?.[0]?.memberstack_id;
        return json({ available: !owner || owner === member.id });
      }

      case 'save': {
        const fields = cleanFields(body.fields);
        const existing = await getOwn();

        // Server-managed values
        if (member.email) fields.email = member.email;
        const membershipTypeId = await resolveMembershipTypeId(supabase, member);
        if (membershipTypeId) fields.membership_type_id = membershipTypeId;
        if (fields.profile_complete === true) {
          fields.profile_completed_at = existing?.profile_completed_at || new Date().toISOString();
        }
        fields.updated_at = new Date().toISOString();

        if (!existing) {
          return json({ member: await createOwn(fields) });
        }
        const { error } = await supabase
          .from('members')
          .update(fields)
          .eq('memberstack_id', member.id);
        if (error) throw error;
        return json({ member: await getOwn() });
      }

      default:
        return json({ error: 'unknown action' }, 400);
    }
  } catch (err) {
    const authResponse = authErrorResponse(err, corsHeaders);
    if (authResponse) return authResponse;
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message;
    console.error('member-self error:', message || err);
    // Pass through a duplicate-slug style conflict so the page can show it
    const code = (err as { code?: string })?.code;
    if (code === '23505') return json({ error: 'conflict' }, 409);
    return json({ error: 'server error' }, 500);
  }
});
