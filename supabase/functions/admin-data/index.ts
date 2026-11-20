/**
 * MTNS MADE - Admin Data
 *
 * Member reads and writes for the admin dashboard. Every call needs a staff
 * login: the caller's Memberstack token (X-Member-Token) must belong to a
 * member with an active admin plan. Each action is a fixed query; the request
 * only supplies values (ids, a search term), never columns or tables.
 *
 * POST { action, ...params }
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verifyStaff, authErrorResponse } from '../_shared/auth.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info, x-member-token',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function idList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v) => typeof v === 'string' && v.length > 0 && v.length < 100).slice(0, 500);
}

function oneId(value: unknown): string {
  return typeof value === 'string' && value.length > 0 && value.length < 100 ? value : '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  try {
    await verifyStaff(req);
    const body = await req.json().catch(() => ({}));
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const done = (data: unknown, error: { message: string } | null) => {
      if (error) throw error;
      return json({ data: data ?? null });
    };

    switch (body?.action) {
      case 'whoami':
        return json({ data: { staff: true } });

      case 'recent-members': {
        const { data, error } = await supabase
          .from('members')
          .select(`
            id, memberstack_id, name, email, first_name, last_name, slug,
            subscription_status, profile_complete, webflow_id,
            profile_image_url, header_image_url, bio, suburb_id,
            membership_type_id, membership_types(id, name),
            created_at, updated_at
          `)
          .neq('is_deleted', true)
          .order('created_at', { ascending: false })
          .limit(20);
        return done(data, error);
      }

      case 'member-stats': {
        const { data, error } = await supabase
          .from('members')
          .select('id, subscription_status, profile_complete, webflow_id')
          .neq('is_deleted', true);
        return done(data, error);
      }

      case 'incomplete-profiles': {
        const { data, error } = await supabase
          .from('members')
          .select(`
            id, memberstack_id, name, email, first_name, slug, subscription_status,
            profile_complete, profile_reminder_sent_at, created_at,
            profile_image_url, header_image_url, bio, suburb_id
          `)
          .eq('profile_complete', false)
          .eq('subscription_status', 'active')
          .neq('is_deleted', true)
          .order('created_at', { ascending: true });
        return done(data, error);
      }

      case 'failed-signups': {
        const { data, error } = await supabase
          .from('members')
          .select(`
            id, memberstack_id, name, email, first_name, slug,
            subscription_status, profile_complete, profile_reminder_sent_at, created_at
          `)
          .not('subscription_status', 'in', '("active","lapsed","deleted")')
          .neq('is_deleted', true)
          .order('created_at', { ascending: false })
          .limit(30);
        return done(data, error);
      }

      case 'names-by-memberstack-id': {
        const ids = idList(body.ids);
        if (!ids.length) return json({ data: [] });
        const { data, error } = await supabase
          .from('members')
          .select('memberstack_id, first_name, last_name, name')
          .in('memberstack_id', ids);
        return done(data, error);
      }

      case 'names-by-member-id': {
        const ids = idList(body.ids);
        if (!ids.length) return json({ data: [] });
        const { data, error } = await supabase
          .from('members')
          .select('id, name, first_name, last_name, profile_image_url')
          .in('id', ids);
        return done(data, error);
      }

      case 'member-email': {
        const id = oneId(body.id);
        if (!id) return json({ error: 'id required' }, 400);
        const { data, error } = await supabase
          .from('members')
          .select('email, name')
          .eq('id', id)
          .maybeSingle();
        return done(data, error);
      }

      case 'search-members': {
        const q = typeof body.query === 'string' ? body.query.trim().slice(0, 60) : '';
        if (q.length < 2) return json({ data: [] });
        // Strip characters that have meaning in a PostgREST filter string
        const safe = q.replace(/[%,()*\\:."']/g, ' ');
        const { data, error } = await supabase
          .from('members')
          .select('id, name, slug, business_name')
          .or(`name.ilike.%${safe}%,business_name.ilike.%${safe}%`)
          .eq('subscription_status', 'active')
          .limit(8);
        return done(data, error);
      }

      case 'mark-reminder-sent': {
        const id = oneId(body.id);
        if (!id) return json({ error: 'id required' }, 400);
        const { error } = await supabase
          .from('members')
          .update({ profile_reminder_sent_at: new Date().toISOString() })
          .eq('id', id);
        return done({ ok: true }, error);
      }

      case 'soft-delete-member': {
        const id = oneId(body.id);
        if (!id) return json({ error: 'id required' }, 400);
        const { error } = await supabase
          .from('members')
          .update({
            is_deleted: true,
            subscription_status: 'deleted',
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
        return done({ ok: true }, error);
      }

      default:
        return json({ error: 'unknown action' }, 400);
    }
  } catch (err) {
    const authResponse = authErrorResponse(err, corsHeaders);
    if (authResponse) return authResponse;
    console.error('admin-data error:', err instanceof Error ? err.message : err);
    return json({ error: 'server error' }, 500);
  }
});
