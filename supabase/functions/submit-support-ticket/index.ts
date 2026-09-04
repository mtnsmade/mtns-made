/**
 * MTNS MADE - Member Support Ticket Submission
 *
 * Modes:
 * - POST { mode: 'create', memberstackId, memberName, memberEmail, title, description }
 *     Creates a support_tasks row (category: member_support) and emails the admin.
 * - POST { mode: 'list', memberstackId }
 *     Returns the member's own tickets.
 *
 * Runs server-side (service role) specifically so support_tasks - whose RLS is
 * wide open, same as messages, and only safe because the admin dashboard sits
 * behind a Webflow password gate - is never queried directly by the anon-key
 * client on a page any logged-in member can reach. See the plan file for the
 * full reasoning.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendEmail, FROM_SUPPORT } from '../_shared/gmail.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'support@mtnsmade.com.au';
const SITE_URL = 'https://www.mtnsmade.com.au';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
};

interface MemberRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  slug: string | null;
}

// Resolve a memberstackId to a real members row. Returns null if no matching
// row exists - the same "orphaned member" gap this codebase has hit for real
// support tickets before (a Memberstack account whose webhook never landed a
// Supabase row).
async function resolveMember(memberstackId: string): Promise<MemberRow | null> {
  const { data } = await supabase
    .from('members')
    .select('id, first_name, last_name, slug')
    .eq('memberstack_id', memberstackId)
    .maybeSingle();
  return data ?? null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();

    if (body.mode === 'list') {
      const { memberstackId } = body;
      if (!memberstackId) {
        return new Response(
          JSON.stringify({ success: false, error: 'Missing memberstackId' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const member = await resolveMember(memberstackId);
      if (!member) {
        return new Response(
          JSON.stringify({ success: true, tickets: [] }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: tickets, error } = await supabase
        .from('support_tasks')
        .select('id, title, description, status, created_at, updated_at')
        .eq('member_id', member.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, tickets: tickets || [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // mode: 'create' (default)
    const { memberstackId, memberName, memberEmail, title, description } = body;

    if (!memberstackId || !title || !description) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: memberstackId, title, description' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const member = await resolveMember(memberstackId);

    let insertPayload: Record<string, unknown>;
    if (member) {
      const resolvedName = [member.first_name, member.last_name].filter(Boolean).join(' ') || memberName || null;
      insertPayload = {
        category: 'member_support',
        title,
        description,
        member_id: member.id,
        member_name: resolvedName,
        member_profile_url: member.slug ? `${SITE_URL}/members/${member.slug}` : null,
      };
    } else {
      // Orphaned Memberstack account with no matching members row (seen for
      // real this session - Taru Tuohiniemi). Don't drop the ticket - create
      // it anyway using what the client already has from Memberstack, and
      // flag it so staff know member_id linkage failed (the completion email
      // in admin-dashboard.js needs a real member_id to ever fire for this one).
      insertPayload = {
        category: 'member_support',
        title,
        description,
        member_id: null,
        member_name: memberName || null,
        member_profile_url: null,
        notes: `⚠ member_id not resolved — memberstack_id ${memberstackId}, no matching members row. Contact: ${memberEmail || 'unknown'}.`,
      };
    }

    const { data: created, error } = await supabase
      .from('support_tasks')
      .insert(insertPayload)
      .select('id, status')
      .single();

    if (error) throw error;

    const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a1a1a; color: #fff; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 20px;">New Support Ticket</h1>
  </div>
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="margin: 0 0 20px 0; color: #333;">
      A member has submitted a support ticket:
    </p>
    <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <p style="margin: 0 0 10px 0; color: #333;"><strong>Subject:</strong> ${title}</p>
      <p style="margin: 0 0 10px 0; color: #333; white-space: pre-wrap;">${description}</p>
      <p style="margin: 0 0 10px 0; color: #333;"><strong>From:</strong> ${memberName || 'Unknown'}</p>
      <p style="margin: 0; color: #333;"><strong>Email:</strong> ${memberEmail || 'Unknown'}</p>
      ${!member ? '<p style="margin: 10px 0 0 0; color: #c0392b;"><strong>⚠ No matching member record found</strong> - this ticket isn\'t linked to a member profile.</p>' : ''}
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${SITE_URL}/admin/dashboard" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold;">
        View in Admin Dashboard
      </a>
    </div>
  </div>
</div>
`;

    const emailText = `New Support Ticket

Subject: ${title}
${description}

From: ${memberName || 'Unknown'}
Email: ${memberEmail || 'Unknown'}
${!member ? '\n⚠ No matching member record found - this ticket isn\'t linked to a member profile.\n' : ''}
View in Admin Dashboard: ${SITE_URL}/admin/dashboard
`;

    const emailResult = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New support ticket: ${title}`,
      html: emailHtml,
      text: emailText,
      from: FROM_SUPPORT,
    });

    if (!emailResult.success) {
      // Ticket is already created - don't fail the whole request over the
      // notification email, just log it so it's visible in function logs.
      console.error('Support ticket notification email failed:', emailResult.error);
    }

    return new Response(
      JSON.stringify({ success: true, id: created.id, status: created.status }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('submit-support-ticket error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
