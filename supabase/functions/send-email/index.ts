/**
 * MTNS MADE - Send Email Edge Function
 * Generic email sending via Gmail API (service account + domain-wide delegation)
 *
 * SECURITY (added 2026-09-23 after the security review)
 * -----------------------------------------------------
 * This function used to accept `to`, `from`, `subject`, `html` and `cc` from any
 * caller, with no authentication and `verify_jwt: false`. Because the Gmail
 * service account has domain-wide delegation, that made it an open relay that
 * could send DKIM-valid mail as ANY @mtnsmade.com.au address, to anyone.
 *
 * Two things now constrain it:
 *
 * 1. `from` is allowlisted in _shared/gmail.ts (hello@ / support@ only), so
 *    impersonating another staff mailbox is no longer possible from anywhere.
 *
 * 2. Recipients are gated here. A caller presenting the shared internal secret
 *    is trusted and may mail anyone (server-to-server: support-report, cron).
 *    Everyone else - which means the browser, since admin-dashboard.js and
 *    member-messages.js both call this directly - may only mail an address that
 *    already exists in our own data: a member, someone who has sent us an
 *    enquiry, or one of our own inboxes. That turns a global spam relay into a
 *    closed loop over addresses we already hold.
 *
 * KNOWN RESIDUAL RISK: browser mode is still unauthenticated, so an attacker can
 * still send arbitrary *content* to a known member from hello@. Closing that
 * needs real admin/member identity on the edge functions (there is none today -
 * admin-dashboard.js has no auth at all) and is tracked as follow-up work. Do
 * not treat this function as safe to widen again.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendEmail } from '../_shared/gmail.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const INTERNAL_FN_SECRET = Deno.env.get('INTERNAL_FN_SECRET') || '';

// Addresses we always permit: our own inboxes, plus standing operational
// notification recipients. contact@racket.net.au is where admin-dashboard.js
// sends new-support-task notifications - it happens to also appear in
// `messages`, but relying on that coincidence would silently break the
// notification the day that row is deleted, so it is listed explicitly.
const INTERNAL_RECIPIENTS = new Set([
  'hello@mtnsmade.com.au',
  'support@mtnsmade.com.au',
  'contact@racket.net.au',
]);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info, x-internal-secret',
};

/** Length-safe constant-time compare, so the secret can't be recovered by timing. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function normaliseRecipients(to: unknown): string[] {
  const list = Array.isArray(to) ? to : [to];
  return list
    .filter((v): v is string => typeof v === 'string')
    // strip any "Name <addr>" wrapper and normalise for comparison
    .map((v) => (v.match(/<(.+)>/)?.[1] ?? v).trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Untrusted callers may only mail addresses we already hold. Checked against the
 * DB with the service role so RLS can't be used to widen the answer.
 */
async function allRecipientsKnown(recipients: string[]): Promise<{ ok: boolean; unknown: string[] }> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const unknown: string[] = [];

  for (const addr of recipients) {
    if (INTERNAL_RECIPIENTS.has(addr)) continue;

    const { data: member } = await supabase
      .from('members')
      .select('id')
      .ilike('email', addr)
      .limit(1)
      .maybeSingle();
    if (member) continue;

    // People who have contacted a member through the site get replies here.
    const { data: enquirer } = await supabase
      .from('messages')
      .select('id')
      .ilike('sender_email', addr)
      .limit(1)
      .maybeSingle();
    if (enquirer) continue;

    // Support tickets can be filed by someone with no members row (the
    // "orphaned Memberstack account" case submit-support-ticket handles), and
    // staff reply to those from the dashboard.
    const { data: ticketSubmitter } = await supabase
      .from('support_tasks')
      .select('id')
      .ilike('submitted_email', addr)
      .limit(1)
      .maybeSingle();
    if (ticketSubmitter) continue;

    unknown.push(addr);
  }

  return { ok: unknown.length === 0, unknown };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    if (!body.to || !body.subject) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: to, subject' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body.html && !body.text) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: html or text' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Trusted server-to-server callers present the shared secret and skip the
    // recipient gate. Everything else is treated as coming from the browser.
    const presented = req.headers.get('x-internal-secret') || '';
    const isInternal =
      INTERNAL_FN_SECRET.length > 0 && constantTimeEqual(presented, INTERNAL_FN_SECRET);

    if (!isInternal) {
      const recipients = normaliseRecipients(body.to).concat(normaliseRecipients(body.cc ?? []));
      if (recipients.length === 0) {
        return new Response(
          JSON.stringify({ success: false, error: 'No valid recipient address supplied' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { ok, unknown } = await allRecipientsKnown(recipients);
      if (!ok) {
        // Deliberately vague to the caller; the detail goes to our logs only, so
        // this can't be used to probe whether a given address is a member.
        console.warn(`send-email: blocked unknown recipient(s): ${unknown.join(', ')}`);
        return new Response(
          JSON.stringify({ success: false, error: 'Recipient not permitted' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const result = await sendEmail({
      to: body.to,
      subject: body.subject,
      html: body.html || body.text.replace(/\n/g, '<br>'),
      text: body.text,
      // `from` is allowlisted inside _shared/gmail.ts - anything not hello@ or
      // support@ is coerced to hello@ there, so a caller cannot impersonate.
      from: body.from,
      replyTo: body.replyTo,
      cc: body.cc,
    });

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Handler error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
