/**
 * MTNS MADE - Onboarding Reminder
 * Sends email reminders to members who started but didn't complete onboarding
 *
 * Run modes:
 * - POST { mode: 'scheduled' } - Send to members who started 24+ hours ago, not complete
 * - POST { mode: 'test', email: 'test@example.com' } - Send test email
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API') || '';

const FROM_EMAIL = 'MTNS MADE <support@mail.mtnsmade.com.au>';
const ADMIN_EMAIL = 'support@mtnsmade.com.au';
const SITE_URL = 'https://www.mtnsmade.com.au';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Delay helper for rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Email template
function getEmailHtml(firstName: string, currentStep: number): string {
  const stepDescriptions: Record<number, string> = {
    1: 'uploading your profile images',
    2: 'telling us about yourself',
    3: 'selecting your categories',
    4: 'choosing your location',
    5: 'adding your final details',
  };

  const nextStepDesc = stepDescriptions[currentStep] || 'completing your profile';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Continue Setting Up Your MTNS MADE Profile</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 32px 40px; text-align: center;">
              <img src="https://cdn.prod.website-files.com/64229aff3da29012f062753c/64c8c73cbe927ed3e4ade8df_mtns-made-white.svg" alt="MTNS MADE" width="180" style="display: block; margin: 0 auto;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 22px; font-weight: 600;">
                Hi ${firstName || 'there'},
              </h2>

              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                You're almost there! We noticed you started setting up your MTNS MADE profile but haven't finished yet.
              </p>

              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Your next step: <strong>${nextStepDesc}</strong>
              </p>

              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Your progress has been saved, so you can pick up right where you left off.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 30px auto;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${SITE_URL}/profile/setup" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Continue Setup
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0; color: #555555; font-size: 16px; line-height: 1.6;">
                Once complete, your profile will be live in our creative directory where other members and potential clients can find you.
              </p>

              <p style="margin: 30px 0 0; color: #888888; font-size: 14px; line-height: 1.6;">
                Questions? Just reply to this email - we're here to help!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 24px 40px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 8px; color: #888888; font-size: 14px;">
                Blue Mountains Creative Community
              </p>
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
</html>
`;
}

function getEmailText(firstName: string, currentStep: number): string {
  const stepDescriptions: Record<number, string> = {
    1: 'uploading your profile images',
    2: 'telling us about yourself',
    3: 'selecting your categories',
    4: 'choosing your location',
    5: 'adding your final details',
  };

  const nextStepDesc = stepDescriptions[currentStep] || 'completing your profile';

  return `Hi ${firstName || 'there'},

You're almost there! We noticed you started setting up your MTNS MADE profile but haven't finished yet.

Your next step: ${nextStepDesc}

Your progress has been saved, so you can pick up right where you left off.

Continue setup: ${SITE_URL}/profile/setup

Once complete, your profile will be live in our creative directory where other members and potential clients can find you.

Questions? Just reply to this email - we're here to help!

MTNS MADE
Blue Mountains Creative Community
${SITE_URL}
`;
}

async function sendEmail(to: string, firstName: string, currentStep: number): Promise<{ success: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: 'Continue setting up your MTNS MADE profile',
        html: getEmailHtml(firstName, currentStep),
        text: getEmailText(firstName, currentStep),
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      return { success: false, error: result.message || 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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
    const body = await req.json().catch(() => ({}));
    const mode = body.mode || 'scheduled';

    console.log(`Onboarding reminder running in ${mode} mode`);

    // Test mode - send to specific email
    if (mode === 'test' && body.email) {
      const result = await sendEmail(body.email, body.firstName || 'Test', body.step || 2);
      return new Response(
        JSON.stringify({ success: result.success, mode: 'test', result }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Scheduled mode - find eligible members
    // Members who:
    // 1. Started onboarding (onboarding_step > 0)
    // 2. Haven't completed (profile_complete = false)
    // 3. Started more than 24 hours ago
    // 4. Haven't been sent an onboarding reminder yet
    // 5. Have an active subscription

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const { data: eligibleMembers, error: fetchError } = await supabase
      .from('members')
      .select('id, email, first_name, onboarding_step, onboarding_started_at, onboarding_reminder_sent_at')
      .eq('profile_complete', false)
      .gt('onboarding_step', 0)
      .lte('onboarding_started_at', twentyFourHoursAgo.toISOString())
      .is('onboarding_reminder_sent_at', null)
      .eq('is_deleted', false)
      .in('subscription_status', ['active', 'trialing']);

    if (fetchError) {
      console.error('Error fetching eligible members:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${eligibleMembers?.length || 0} members to remind`);

    // Send reminders
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (let i = 0; i < (eligibleMembers || []).length; i++) {
      const member = eligibleMembers![i];

      if (!member.email) {
        results.failed++;
        results.errors.push(`${member.id}: No email`);
        continue;
      }

      // Rate limit: 500ms between emails
      if (i > 0) {
        await delay(500);
      }

      const emailResult = await sendEmail(member.email, member.first_name, member.onboarding_step);

      if (emailResult.success) {
        // Mark as reminded
        await supabase
          .from('members')
          .update({ onboarding_reminder_sent_at: new Date().toISOString() })
          .eq('id', member.id);

        results.sent++;
        console.log(`Sent onboarding reminder to ${member.email} (step ${member.onboarding_step})`);
      } else {
        results.failed++;
        results.errors.push(`${member.email}: ${emailResult.error}`);
      }
    }

    // Send admin summary if any emails were sent or failed
    if ((results.sent > 0 || results.failed > 0) && RESEND_API_KEY) {
      await delay(500);
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [ADMIN_EMAIL],
            subject: `Onboarding Reminder Summary: ${results.sent} sent`,
            text: `Onboarding Reminder Summary\n\nSent: ${results.sent}\nFailed: ${results.failed}\n\n${results.errors.length > 0 ? 'Errors:\n' + results.errors.join('\n') : 'No errors'}`,
          }),
        });
      } catch (error) {
        console.error('Failed to send admin summary:', error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, mode, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Handler error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
