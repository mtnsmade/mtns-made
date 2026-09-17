/**
 * MTNS MADE - Abandoned Signup Reminder
 *
 * Targets a population none of the other reminder jobs actually cover:
 * members created via the two-step signup flow (signupMemberEmailPassword,
 * then a separate purchasePlansWithCheckout redirect) who never completed
 * checkout at all - no plan connection was ever attached, not even one
 * that later lapsed. Confirmed real via a live case, Misty McPhail,
 * 2026-09-17.
 *
 * This is a genuinely different population from the ones onboarding-reminder
 * and profile-reminder cover:
 * - onboarding-reminder requires onboarding_step > 0 - these members never
 *   got there, checkout never redirected them to /profile/onboarding.
 * - profile-reminder's "finish your profile" framing is actively misleading
 *   here - the member's real blocker is payment, not their bio/images.
 *
 * subscription-reconcile already detects the underlying Memberstack/Supabase
 * mismatch (MS: lapsed, SB: active) but deliberately does nothing with it
 * beyond a console.log ("needs manual review") - that review never actually
 * happens because nothing surfaces it. This function is that missing half,
 * scoped specifically to "never had a plan at all" (checked via a live
 * Memberstack planConnections.length === 0, not just "not currently active" -
 * a member whose plan later lapsed is a different, more sensitive case and
 * should not get a "did you mean to sign up?" email).
 *
 * Run modes:
 * - POST { mode: 'scheduled' } - find and remind eligible members
 * - POST { mode: 'test', email: 'test@example.com' } - send a test email
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendEmail, FROM_HELLO, FROM_SUPPORT } from '../_shared/gmail.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MEMBERSTACK_API_KEY = Deno.env.get('MEMBERSTACK_API_KEY') || '';

const ADMIN_EMAIL = 'support@mtnsmade.com.au';
const SITE_URL = 'https://www.mtnsmade.com.au';

// How long to wait before nudging - longer than onboarding/profile reminders
// (24h) since "come back and pay" is a bigger ask than "finish your bio",
// and to give real in-progress checkouts room to complete on their own.
const GRACE_PERIOD_HOURS = 48;

// Upper bound too, not just a lower one - discovered live 2026-09-17 that
// without this, the query also matches old dormant/duplicate accounts that
// have nothing to do with a recent abandoned checkout (e.g. a 5-week-old
// typo'd duplicate signup, already known and handled via a support ticket).
// This function's whole point is "did you mean to finish signing up a
// couple of days ago", not resurfacing month-old dead records.
const MAX_AGE_DAYS = 14;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface Candidate {
  id: string;
  email: string;
  first_name: string | null;
  memberstack_id: string;
  created_at: string;
}

interface MemberstackMember {
  planConnections?: Array<{ status: string }>;
  customFields?: Record<string, string>;
}

async function getMemberstackMember(memberstackId: string): Promise<MemberstackMember | null> {
  if (!MEMBERSTACK_API_KEY) return null;
  try {
    const response = await fetch(`https://admin.memberstack.com/members/${memberstackId}`, {
      headers: { 'X-API-KEY': MEMBERSTACK_API_KEY, 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      console.error(`Memberstack lookup failed for ${memberstackId}: ${response.status}`);
      return null;
    }
    const body = await response.json();
    return body?.data || null;
  } catch (error) {
    console.error(`Memberstack lookup error for ${memberstackId}:`, error);
    return null;
  }
}

// Build a checkout link that drops the member back exactly where they left
// off when we know it (their selected tier/billing from the signup form's
// custom fields), falling back to the general type-picker otherwise.
function buildCheckoutUrl(customFields: Record<string, string> | undefined): string {
  const type = customFields?.['membership-type'];
  const billing = customFields?.['billing-frequency'] || 'monthly';
  if (type) {
    return `${SITE_URL}/join/signup/2026?type=${encodeURIComponent(type)}&billing=${encodeURIComponent(billing)}`;
  }
  return `${SITE_URL}/join/type`;
}

function getEmailHtml(firstName: string, checkoutUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Finish setting up your MTNS MADE membership</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="background-color: #1a1a1a; padding: 32px 40px; text-align: center;">
              <img src="https://cdn.prod.website-files.com/64229aff3da29012f062753c/64c8c73cbe927ed3e4ade8df_mtns-made-white.svg" alt="MTNS MADE" width="180" style="display: block; margin: 0 auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 22px; font-weight: 600;">
                Hi ${firstName || 'there'},
              </h2>
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                You started creating an MTNS MADE account, but it looks like checkout was never completed - your card was never charged and your membership isn't active yet.
              </p>
              <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                If that was intentional, no action needed - feel free to ignore this. If you'd still like to join, you can pick up right where you left off.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 30px;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${checkoutUrl}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Finish joining MTNS MADE
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #888888; font-size: 14px; line-height: 1.6;">
                Questions? Reply to this email and we'll be happy to help.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 24px 40px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="margin: 0; color: #aaaaaa; font-size: 12px;">
                <a href="${SITE_URL}" style="color: #888888;">mtnsmade.com.au</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function getEmailText(firstName: string, checkoutUrl: string): string {
  return `Hi ${firstName || 'there'},

You started creating an MTNS MADE account, but it looks like checkout was never completed - your card was never charged and your membership isn't active yet.

If that was intentional, no action needed - feel free to ignore this. If you'd still like to join, you can pick up right where you left off:

${checkoutUrl}

Questions? Reply to this email and we'll be happy to help.

MTNS MADE
Blue Mountains Creative Community
${SITE_URL}
`;
}

async function sendReminderEmail(to: string, firstName: string, checkoutUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await sendEmail({
      to,
      subject: 'Finish setting up your MTNS MADE membership',
      html: getEmailHtml(firstName, checkoutUrl),
      text: getEmailText(firstName, checkoutUrl),
      from: FROM_HELLO,
    });
    if (!result.success) return { success: false, error: result.error };
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

async function getCandidates(): Promise<Candidate[]> {
  const graceCutoff = new Date();
  graceCutoff.setHours(graceCutoff.getHours() - GRACE_PERIOD_HOURS);

  const maxAgeCutoff = new Date();
  maxAgeCutoff.setDate(maxAgeCutoff.getDate() - MAX_AGE_DAYS);

  const { data, error } = await supabase
    .from('members')
    .select('id, email, first_name, memberstack_id, created_at')
    .eq('is_deleted', false)
    .eq('profile_complete', false)
    .eq('subscription_status', 'active')
    .eq('onboarding_step', 0)
    .is('onboarding_started_at', null)
    .is('abandoned_signup_reminder_sent_at', null)
    .not('email', 'is', null)
    .not('memberstack_id', 'is', null)
    .lte('created_at', graceCutoff.toISOString())
    .gte('created_at', maxAgeCutoff.toISOString());

  if (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }

  return data || [];
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const mode = body.mode || 'scheduled';

    if (mode === 'test') {
      const testEmail = body.email;
      if (!testEmail) {
        return new Response(
          JSON.stringify({ success: false, error: 'Test mode requires email parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const result = await sendReminderEmail(testEmail, body.firstName || 'there', `${SITE_URL}/join/type`);
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Abandoned signup reminder running in scheduled mode');

    const candidates = await getCandidates();
    console.log(`Found ${candidates.length} candidate(s) past the ${GRACE_PERIOD_HOURS}h grace period`);

    const results = {
      sent: [] as Array<{ email: string; first_name: string | null }>,
      skippedHasPlan: [] as string[],
      failed: [] as string[],
    };

    for (let i = 0; i < candidates.length; i++) {
      const member = candidates[i];
      if (i > 0) await delay(500);

      // Authoritative check, not the Supabase heuristic above: only act on
      // members who NEVER had any plan connection at all. A member whose
      // plan later lapsed/canceled is a different population (real former
      // subscriber, not an abandoned signup) and must not get this email.
      const msMember = await getMemberstackMember(member.memberstack_id);
      if (msMember === null) {
        results.failed.push(`${member.email}: Memberstack lookup failed`);
        continue;
      }
      if ((msMember.planConnections?.length || 0) > 0) {
        console.log(`Skipping ${member.email} - has plan connection history, not an abandoned signup`);
        results.skippedHasPlan.push(member.email);
        continue;
      }

      const checkoutUrl = buildCheckoutUrl(msMember.customFields);
      const emailResult = await sendReminderEmail(member.email, member.first_name || '', checkoutUrl);

      if (emailResult.success) {
        await supabase
          .from('members')
          .update({ abandoned_signup_reminder_sent_at: new Date().toISOString() })
          .eq('id', member.id);
        results.sent.push({ email: member.email, first_name: member.first_name });
        console.log(`Sent abandoned-signup reminder to ${member.email}`);
      } else {
        results.failed.push(`${member.email}: ${emailResult.error}`);
      }
    }

    // Admin visibility - the one thing subscription-reconcile's equivalent
    // detection never got: an actual notification, not just a log line.
    if (results.sent.length > 0 || results.failed.length > 0 || results.skippedHasPlan.length > 0) {
      await delay(500);
      const sentList = results.sent.length > 0
        ? results.sent.map((m) => `- ${m.first_name || 'Unknown'} (${m.email})`).join('\n')
        : '- None';
      const summaryText = `Abandoned Signup Reminder Summary

Reminders sent: ${results.sent.length}
Skipped (has plan history, needs manual review instead): ${results.skippedHasPlan.length}
Failed: ${results.failed.length}

Members reminded:
${sentList}
${results.skippedHasPlan.length > 0 ? `\nSkipped (check these manually - Memberstack shows a plan but Supabase status may be stale):\n${results.skippedHasPlan.map((e) => `- ${e}`).join('\n')}` : ''}
${results.failed.length > 0 ? `\nFailed:\n${results.failed.map((e) => `- ${e}`).join('\n')}` : ''}

View Admin Dashboard: ${SITE_URL}/admin/dashboard`;

      try {
        await sendEmail({
          to: ADMIN_EMAIL,
          subject: `Abandoned Signup Reminder: ${results.sent.length} sent`,
          html: summaryText.replace(/\n/g, '<br>'),
          text: summaryText,
          from: FROM_SUPPORT,
        });
      } catch (error) {
        console.error('Failed to send admin summary:', error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: results.sent.length,
        skippedHasPlan: results.skippedHasPlan.length,
        failed: results.failed.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('abandoned-signup-reminder error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
