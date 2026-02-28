/**
 * MTNS MADE - Manage Event (Approve/Reject)
 * Handles admin approval or rejection of member-submitted events
 * - Updates event status in Supabase
 * - Triggers Webflow sync for approved events
 * - Sends notification email to member
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const RESEND_API_KEY = Deno.env.get('RESEND_API') || '';
const FROM_EMAIL = 'MTNS MADE <support@mail.mtnsmade.com.au>';
const SITE_URL = 'https://www.mtnsmade.com.au';

interface ManageEventRequest {
  eventId: string;
  action: 'approve' | 'reject';
  rejectionReason?: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
};

function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// Send approval email to member
async function sendApprovalEmail(email: string, eventName: string, eventSlug: string): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return;
  }

  const eventUrl = `${SITE_URL}/event/${eventSlug}`;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="background-color: #1a1a1a; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Event Approved!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Great news! Your event <strong>"${eventName}"</strong> has been approved and is now live on the MTNS MADE events calendar.
              </p>
              <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                Share it with your community and help spread the word!
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${eventUrl}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      View Your Event
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 30px 0 0; color: #888888; font-size: 14px; line-height: 1.6;">
                Thank you for contributing to the MTNS MADE community!
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
</html>
`;

  const emailText = `Great news! Your event "${eventName}" has been approved and is now live on the MTNS MADE events calendar.

View your event: ${eventUrl}

Share it with your community and help spread the word!

Thank you for contributing to the MTNS MADE community!

MTNS MADE
${SITE_URL}
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
        to: [email],
        subject: `Your event "${eventName}" has been approved!`,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Email send error:', error);
    } else {
      console.log('Approval email sent to:', email);
    }
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
}

// Send rejection email to member
async function sendRejectionEmail(email: string, eventName: string, reason?: string): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return;
  }

  const reasonText = reason
    ? `<p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;"><strong>Reason:</strong> ${reason}</p>`
    : '';

  const reasonPlain = reason ? `\nReason: ${reason}\n` : '';

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Not Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="background-color: #1a1a1a; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Event Update</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Thank you for submitting your event <strong>"${eventName}"</strong> to MTNS MADE.
              </p>
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Unfortunately, we weren't able to approve this event at this time.
              </p>
              ${reasonText}
              <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                You're welcome to edit and resubmit your event, or reach out if you have any questions.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${SITE_URL}/profile/events" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Edit Your Events
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 30px 0 0; color: #888888; font-size: 14px; line-height: 1.6;">
                Reply to this email if you have any questions.
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
</html>
`;

  const emailText = `Thank you for submitting your event "${eventName}" to MTNS MADE.

Unfortunately, we weren't able to approve this event at this time.
${reasonPlain}
You're welcome to edit and resubmit your event, or reach out if you have any questions.

Edit your events: ${SITE_URL}/profile/events

Reply to this email if you have any questions.

MTNS MADE
${SITE_URL}
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
        to: [email],
        subject: `Update on your event "${eventName}"`,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Email send error:', error);
    } else {
      console.log('Rejection email sent to:', email);
    }
  } catch (error) {
    console.error('Error sending rejection email:', error);
  }
}

serve(async (req) => {
  // Handle CORS preflight
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
    const body: ManageEventRequest = await req.json();

    if (!body.eventId || !body.action) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: eventId, action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['approve', 'reject'].includes(body.action)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid action. Must be "approve" or "reject"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getSupabaseClient();

    // Get the event details
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('id, name, slug, member_contact_email, is_draft, is_archived')
      .eq('id', body.eventId)
      .single();

    if (fetchError || !event) {
      console.error('Event fetch error:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Event not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (body.action === 'approve') {
      // Approve: Set is_draft to false (this triggers Webflow sync via database trigger)
      const { error: updateError } = await supabase
        .from('events')
        .update({
          is_draft: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.eventId);

      if (updateError) {
        console.error('Event update error:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to approve event' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Event approved:', event.name);

      // Send approval email to member
      if (event.member_contact_email) {
        await sendApprovalEmail(event.member_contact_email, event.name, event.slug);
      }

      return new Response(
        JSON.stringify({ success: true, action: 'approved', eventId: body.eventId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      // Reject: Archive the event
      const { error: updateError } = await supabase
        .from('events')
        .update({
          is_archived: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.eventId);

      if (updateError) {
        console.error('Event update error:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to reject event' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Event rejected:', event.name);

      // Send rejection email to member
      if (event.member_contact_email) {
        await sendRejectionEmail(event.member_contact_email, event.name, body.rejectionReason);
      }

      return new Response(
        JSON.stringify({ success: true, action: 'rejected', eventId: body.eventId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Handler error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
