/**
 * MTNS MADE - Profile Completion Reminder
 * Sends email reminders to members with incomplete profiles
 *
 * Run modes:
 * - POST { mode: 'scheduled' } - Send to members 1+ day old, not yet reminded
 * - POST { mode: 'batch' } - Send to ALL incomplete profiles (one-time catch-up)
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

// Email template
function getEmailHtml(firstName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Your MTNS MADE Profile</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">MTNS MADE</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 22px; font-weight: 600;">
                Hi ${firstName || 'there'},
              </h2>

              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Thanks for joining MTNS MADE! We noticed your profile isn't complete yet.
              </p>

              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                A complete profile helps other creatives find you in the directory and shows off your amazing work. It only takes a few minutes!
              </p>

              <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                <strong>Here's what you need:</strong>
              </p>

              <ul style="margin: 0 0 30px; padding-left: 20px; color: #555555; font-size: 16px; line-height: 1.8;">
                <li>Profile picture</li>
                <li>Feature/header image</li>
                <li>A short bio (50+ characters)</li>
                <li>Your location</li>
                <li>At least one category</li>
                <li>At least one project</li>
              </ul>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${SITE_URL}/profile/start" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Complete Your Profile
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #888888; font-size: 14px; line-height: 1.6;">
                If you have any questions, just reply to this email - we're here to help!
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

function getEmailText(firstName: string): string {
  return `
Hi ${firstName || 'there'},

Thanks for joining MTNS MADE! We noticed your profile isn't complete yet.

A complete profile helps other creatives find you in the directory and shows off your amazing work. It only takes a few minutes!

Here's what you need:
- Profile picture
- Feature/header image
- A short bio (50+ characters)
- Your location
- At least one category
- At least one project

Complete your profile: ${SITE_URL}/profile/start

If you have any questions, just reply to this email - we're here to help!

MTNS MADE
Blue Mountains Creative Community
${SITE_URL}
`;
}

async function sendEmail(to: string, firstName: string): Promise<boolean> {
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
        subject: 'Complete your MTNS MADE profile',
        html: getEmailHtml(firstName),
        text: getEmailText(firstName),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`Failed to send to ${to}:`, error);
      return false;
    }

    const result = await response.json();
    console.log(`Email sent to ${to}: ${result.id}`);
    return true;
  } catch (error) {
    console.error(`Error sending to ${to}:`, error);
    return false;
  }
}

async function getIncompleteMembers(mode: 'scheduled' | 'batch') {
  let query = supabase
    .from('members')
    .select('id, email, first_name, created_at, profile_reminder_sent_at')
    .eq('profile_complete', false)
    .eq('subscription_status', 'active')
    .not('email', 'is', null);

  if (mode === 'scheduled') {
    // Only members created more than 1 day ago who haven't been reminded
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    query = query
      .lt('created_at', oneDayAgo)
      .is('profile_reminder_sent_at', null);
  } else {
    // Batch mode: all incomplete profiles not yet reminded
    query = query.is('profile_reminder_sent_at', null);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching members:', error);
    throw error;
  }

  return data || [];
}

async function markReminderSent(memberId: string) {
  const { error } = await supabase
    .from('members')
    .update({ profile_reminder_sent_at: new Date().toISOString() })
    .eq('id', memberId);

  if (error) {
    console.error(`Error marking reminder sent for ${memberId}:`, error);
  }
}

// Send weekly summary to admin
async function sendAdminSummary(
  sentMembers: Array<{ email: string; first_name: string }>,
  failedCount: number
): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping admin summary');
    return;
  }

  const totalSent = sentMembers.length;
  const membersList = sentMembers.length > 0
    ? sentMembers.map(m => `- ${m.first_name || 'Unknown'} (${m.email})`).join('\n')
    : '- None';

  const membersListHtml = sentMembers.length > 0
    ? sentMembers.map(m => `<li>${m.first_name || 'Unknown'} (${m.email})</li>`).join('')
    : '<li>None</li>';

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Profile Reminder Summary</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="background-color: #1a1a1a; padding: 24px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">Weekly Profile Reminder Summary</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin: 0 0 24px; color: #333; font-size: 16px;">
                The weekly profile reminder job has completed.
              </p>

              <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Reminders sent:</td>
                    <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${totalSent}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Failed:</td>
                    <td style="padding: 8px 0; color: ${failedCount > 0 ? '#dc3545' : '#1a1a1a'}; font-size: 14px; font-weight: 600; text-align: right;">${failedCount}</td>
                  </tr>
                </table>
              </div>

              ${totalSent > 0 ? `
              <p style="margin: 0 0 12px; color: #333; font-size: 14px; font-weight: 600;">Members contacted:</p>
              <ul style="margin: 0 0 24px; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
                ${membersListHtml}
              </ul>
              ` : '<p style="margin: 0 0 24px; color: #666; font-size: 14px;">No members needed reminding this week.</p>'}

              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${SITE_URL}/admin" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600;">
                      View Admin Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 16px 40px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                This is an automated summary from MTNS MADE
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

  const emailText = `Weekly Profile Reminder Summary

The weekly profile reminder job has completed.

Reminders sent: ${totalSent}
Failed: ${failedCount}

Members contacted:
${membersList}

View Admin Dashboard: ${SITE_URL}/admin

---
This is an automated summary from MTNS MADE
`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `Weekly Profile Reminder: ${totalSent} sent, ${failedCount} failed`,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Admin summary email error:', error);
    } else {
      console.log('Admin summary email sent to:', ADMIN_EMAIL);
    }
  } catch (error) {
    console.error('Error sending admin summary:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const mode = body.mode || 'scheduled';

    console.log(`Profile reminder running in ${mode} mode`);

    // Test mode
    if (mode === 'test') {
      const testEmail = body.email;
      if (!testEmail) {
        return new Response(
          JSON.stringify({ success: false, error: 'Test mode requires email parameter' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const sent = await sendEmail(testEmail, 'Test User');
      return new Response(
        JSON.stringify({ success: sent, mode: 'test', email: testEmail }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get members to email
    const members = await getIncompleteMembers(mode);
    console.log(`Found ${members.length} members to remind`);

    // Send emails
    let sent = 0;
    let failed = 0;
    const sentMembers: Array<{ email: string; first_name: string }> = [];

    for (const member of members) {
      const success = await sendEmail(member.email, member.first_name);

      if (success) {
        await markReminderSent(member.id);
        sent++;
        sentMembers.push({ email: member.email, first_name: member.first_name });
      } else {
        failed++;
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Reminder complete: ${sent} sent, ${failed} failed`);

    // Send admin summary (always, even if no reminders sent)
    await sendAdminSummary(sentMembers, failed);

    return new Response(
      JSON.stringify({ success: true, mode, sent, failed, total: members.length }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Profile reminder error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
