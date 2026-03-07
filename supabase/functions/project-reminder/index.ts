/**
 * MTNS MADE - Project Reminder
 * Sends email reminders to members who completed their profile but haven't added projects
 *
 * Run modes:
 * - POST { mode: 'scheduled' } - Send to members who completed profile 7+ days ago, no projects, not yet reminded
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
  <title>Showcase Your Work on MTNS MADE</title>
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
                Your MTNS MADE profile is looking great! Now it's time to showcase your work.
              </p>

              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Adding projects helps other creatives and potential clients see what you do. It's one of the best ways to get discovered in the directory.
              </p>

              <p style="margin: 0 0 16px; color: #555555; font-size: 16px; line-height: 1.6;">
                <strong>Tips for great projects:</strong>
              </p>

              <ul style="margin: 0 0 30px; padding-left: 20px; color: #555555; font-size: 16px; line-height: 1.8;">
                <li>Use high-quality images that showcase your work</li>
                <li>Write a brief description of the project</li>
                <li>Include your role or contribution</li>
                <li>Add relevant categories to help people find you</li>
              </ul>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${SITE_URL}/profile/projects" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Add Your First Project
                    </a>
                  </td>
                </tr>
              </table>

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

function getEmailText(firstName: string): string {
  return `Hi ${firstName || 'there'},

Your MTNS MADE profile is looking great! Now it's time to showcase your work.

Adding projects helps other creatives and potential clients see what you do. It's one of the best ways to get discovered in the directory.

Tips for great projects:
- Use high-quality images that showcase your work
- Write a brief description of the project
- Include your role or contribution
- Add relevant categories to help people find you

Add your first project: ${SITE_URL}/profile/projects

Questions? Just reply to this email - we're here to help!

MTNS MADE
Blue Mountains Creative Community
${SITE_URL}
`;
}

async function sendEmail(to: string, firstName: string): Promise<{ success: boolean; id?: string; error?: string }> {
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
        subject: 'Showcase your work on MTNS MADE',
        html: getEmailHtml(firstName),
        text: getEmailText(firstName),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.message || 'Failed to send email' };
    }

    return { success: true, id: result.id };
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

    console.log(`Project reminder running in ${mode} mode`);

    // Test mode - send to specific email
    if (mode === 'test' && body.email) {
      const result = await sendEmail(body.email, body.firstName || 'Test');
      return new Response(
        JSON.stringify({ success: result.success, mode: 'test', result }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Scheduled mode - find eligible members
    // Find members who:
    // 1. Have profile_complete = true
    // 2. Completed their profile 7+ days ago
    // 3. Have no projects
    // 4. Haven't been sent a project reminder yet
    // 5. Are not deleted and have active subscription

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: eligibleMembers, error: fetchError } = await supabase
      .from('members')
      .select(`
        id, email, first_name, memberstack_id,
        profile_complete, profile_completed_at, project_reminder_sent_at,
        subscription_status, is_deleted
      `)
      .eq('profile_complete', true)
      .lte('profile_completed_at', sevenDaysAgo.toISOString())
      .is('project_reminder_sent_at', null)
      .eq('is_deleted', false)
      .in('subscription_status', ['active', 'trialing']);

    if (fetchError) {
      console.error('Error fetching eligible members:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${eligibleMembers?.length || 0} potential members`);

    // Filter to only those with no projects
    const membersWithoutProjects = [];
    for (const member of eligibleMembers || []) {
      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('member_id', member.id)
        .eq('is_archived', false);

      if (count === 0) {
        membersWithoutProjects.push(member);
      }
    }

    console.log(`${membersWithoutProjects.length} members have no projects`);

    // Send reminders
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const member of membersWithoutProjects) {
      if (!member.email) {
        results.failed++;
        results.errors.push(`${member.id}: No email`);
        continue;
      }

      const emailResult = await sendEmail(member.email, member.first_name);

      if (emailResult.success) {
        // Mark as reminded
        await supabase
          .from('members')
          .update({ project_reminder_sent_at: new Date().toISOString() })
          .eq('id', member.id);

        results.sent++;
        console.log(`Sent project reminder to ${member.email}`);
      } else {
        results.failed++;
        results.errors.push(`${member.email}: ${emailResult.error}`);
      }
    }

    // Send admin summary if any emails were sent
    if (results.sent > 0 && RESEND_API_KEY) {
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
            subject: `Project Reminder Summary: ${results.sent} sent`,
            text: `Project Reminder Summary\n\nSent: ${results.sent}\nFailed: ${results.failed}\n\n${results.errors.length > 0 ? 'Errors:\n' + results.errors.join('\n') : 'No errors'}`,
          }),
        });
        console.log('Admin summary email sent');
      } catch (error) {
        console.error('Failed to send admin summary:', error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        mode,
        results,
      }),
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
