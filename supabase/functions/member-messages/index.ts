/**
 * MTNS MADE - Member Messages
 *
 * The member dashboard inbox. The logged-in member's Memberstack token
 * (X-Member-Token) is verified server-side, and every read and write is
 * limited to that member's own messages.
 *
 * POST { action: 'list' }
 * POST { action: 'mark-read', messageId }
 * POST { action: 'archive', messageId }
 * POST { action: 'reply', messageId, text }   also emails the sender
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verifyMember, authErrorResponse } from '../_shared/auth.ts';
import { sendEmail, FROM_HELLO } from '../_shared/gmail.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info, x-member-token',
};

const LIST_COLUMNS =
  'id, created_at, sender_name, sender_email, sender_phone, subject, message, is_read, read_at, is_archived, replies';
const MAX_REPLY_LENGTH = 5000;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  try {
    const member = await verifyMember(req);
    const body = await req.json().catch(() => ({}));
    const action = body?.action;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (action === 'list') {
      const { data, error } = await supabase
        .from('messages')
        .select(LIST_COLUMNS)
        .eq('memberstack_id', member.id)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return json({ messages: data || [] });
    }

    const messageId = typeof body?.messageId === 'string' ? body.messageId : '';
    if (!messageId) return json({ error: 'messageId required' }, 400);

    // Every action below works only on a message addressed to this member.
    const { data: msg, error: msgError } = await supabase
      .from('messages')
      .select('id, memberstack_id, sender_name, sender_email, subject, replies')
      .eq('id', messageId)
      .eq('memberstack_id', member.id)
      .maybeSingle();
    if (msgError) throw msgError;
    if (!msg) return json({ error: 'not found' }, 404);

    if (action === 'mark-read') {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', msg.id)
        .eq('memberstack_id', member.id);
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === 'archive') {
      const { error } = await supabase
        .from('messages')
        .update({ is_archived: true })
        .eq('id', msg.id)
        .eq('memberstack_id', member.id);
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === 'reply') {
      const text = typeof body?.text === 'string' ? body.text.trim() : '';
      if (!text) return json({ error: 'reply text required' }, 400);
      if (text.length > MAX_REPLY_LENGTH) return json({ error: 'reply too long' }, 400);

      const reply = { created_at: new Date().toISOString(), message: text, from: 'member' };
      const replies = [...(Array.isArray(msg.replies) ? msg.replies : []), reply];
      const { error } = await supabase
        .from('messages')
        .update({ replies })
        .eq('id', msg.id)
        .eq('memberstack_id', member.id);
      if (error) throw error;

      const result = await sendEmail({
        to: msg.sender_email,
        from: FROM_HELLO,
        subject: 'Re: ' + msg.subject + ' - Reply from MTNS MADE',
        replyTo: member.email || undefined,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #333; color: #fff; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Reply from MTNS MADE</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <p>Hi ${escapeHtml(msg.sender_name || '')},</p>
              <p>You've received a reply to your enquiry:</p>
              <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="white-space: pre-wrap;">${escapeHtml(text).replace(/\n/g, '<br>')}</p>
              </div>
              <p style="color: #666; font-size: 14px;">You can reply directly to this email to continue the conversation.</p>
            </div>
          </div>
        `,
      });
      if (!result.success) console.error('member-messages: reply email failed', result.error);
      return json({ ok: true, replies, emailSent: result.success });
    }

    return json({ error: 'unknown action' }, 400);
  } catch (err) {
    const authResponse = authErrorResponse(err, corsHeaders);
    if (authResponse) return authResponse;
    console.error('member-messages error:', err instanceof Error ? err.message : err);
    return json({ error: 'server error' }, 500);
  }
});
