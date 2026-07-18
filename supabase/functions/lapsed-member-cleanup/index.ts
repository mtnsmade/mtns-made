// Supabase Edge Function: Lapsed Member Cleanup
// Member Non-Payment Lifecycle SOP — runs daily.
// Day 20 since lapse: sends a final retention warning email (once, guarded by retention_warning_sent).
// Day 30 since lapse: hard-deletes the member's site data by replaying the existing
// memberstack-webhook `member.deleted` handler (Webflow item + storage images deleted,
// Supabase row soft-deleted, projects archived, site republished) — this does NOT touch
// the member's actual Memberstack/Stripe account, only their site presence and data.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendEmail, FROM_HELLO } from '../_shared/gmail.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const SITE_URL = 'https://www.mtnsmade.com.au';

const FINAL_WARNING_DAY = 20;
const HARD_DELETE_DAY = 30;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

interface LapsedMember {
  id: string;
  memberstack_id: string;
  email: string | null;
  first_name: string | null;
  name: string | null;
  subscription_lapsed_at: string;
  retention_warning_sent: boolean;
}

async function sendFinalRetentionWarningEmail(email: string, firstName: string, deleteDate: string): Promise<void> {
  const resubscribeUrl = SITE_URL + '/members/plans';

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                Your profile data will be removed soon
              </h2>
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Hi ${firstName || 'there'}, your MTNS MADE profile has been archived since your membership payment lapsed. We haven't heard from you, so this is a reminder that your profile and portfolio data will be permanently removed on <strong>${deleteDate}</strong> unless you reactivate before then.
              </p>
              <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                Reactivate any time before that date to keep your profile and everything on it exactly as it was.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 30px;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${resubscribeUrl}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Reactivate my profile
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

  const emailText = `Hi ${firstName || 'there'},

Your MTNS MADE profile has been archived since your membership payment lapsed. We haven't heard from you, so this is a reminder that your profile and portfolio data will be permanently removed on ${deleteDate} unless you reactivate before then.

Reactivate any time before that date to keep your profile and everything on it exactly as it was:
${resubscribeUrl}

Questions? Reply to this email and we'll be happy to help.

MTNS MADE
${SITE_URL}`;

  try {
    await sendEmail({
      to: email,
      subject: 'Your MTNS MADE profile data will be removed soon',
      html: emailHtml,
      text: emailText,
      from: FROM_HELLO,
    });
    console.log('Final retention warning email sent to:', email);
  } catch (error) {
    console.error('Error sending final retention warning email:', error);
  }
}

async function hardDeleteMember(memberstackId: string): Promise<void> {
  // Replay the existing member.deleted handler in memberstack-webhook — it only touches
  // our own Supabase/Webflow/storage records for this memberstack_id, it does not call
  // Memberstack or Stripe, so it's safe to trigger ourselves without an actual account deletion.
  const response = await fetch(`${SUPABASE_URL}/functions/v1/memberstack-webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'member.deleted', payload: { id: memberstackId } }),
  });
  if (!response.ok) {
    console.error('hardDeleteMember: memberstack-webhook call failed', memberstackId, await response.text());
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseClient();

    const { data: lapsedMembers, error } = await supabase
      .from('members')
      .select('id, memberstack_id, email, first_name, name, subscription_lapsed_at, retention_warning_sent')
      .eq('subscription_status', 'lapsed')
      .eq('is_deleted', false)
      .not('subscription_lapsed_at', 'is', null);

    if (error) throw error;

    const now = Date.now();
    let warningsSent = 0;
    let deletedCount = 0;

    for (const member of (lapsedMembers || []) as LapsedMember[]) {
      const lapsedAt = new Date(member.subscription_lapsed_at).getTime();
      const daysSinceLapse = Math.floor((now - lapsedAt) / (1000 * 60 * 60 * 24));

      if (daysSinceLapse >= HARD_DELETE_DAY) {
        await hardDeleteMember(member.memberstack_id);
        deletedCount++;
      } else if (daysSinceLapse >= FINAL_WARNING_DAY && !member.retention_warning_sent) {
        const deleteDate = new Date(lapsedAt + HARD_DELETE_DAY * 24 * 60 * 60 * 1000)
          .toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

        if (member.email) {
          await sendFinalRetentionWarningEmail(member.email, member.first_name || member.name?.split(' ')[0] || '', deleteDate);
        }

        await supabase
          .from('members')
          .update({ retention_warning_sent: true })
          .eq('id', member.id);

        warningsSent++;
      }
    }

    console.log(`lapsed-member-cleanup: ${warningsSent} warnings sent, ${deletedCount} members hard-deleted`);

    return new Response(
      JSON.stringify({ success: true, warningsSent, deletedCount }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('lapsed-member-cleanup error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
