/**
 * MTNS MADE - Notify Event Submission
 * Sends email notification to admin when a member submits an event for approval
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API') || '';
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'hello@mtnsmade.com.au';
const FROM_EMAIL = 'MTNS MADE <support@mail.mtnsmade.com.au>';
const SITE_URL = 'https://www.mtnsmade.com.au';

interface EventSubmissionRequest {
  eventName: string;
  eventDate?: string;
  memberName: string;
  memberEmail: string;
  isUpdate?: boolean;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
};

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

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return new Response(
      JSON.stringify({ success: false, error: 'Email service not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body: EventSubmissionRequest = await req.json();

    if (!body.eventName || !body.memberName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: eventName, memberName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const actionText = body.isUpdate ? 'updated and resubmitted' : 'submitted';
    const subjectAction = body.isUpdate ? 'Updated' : 'New';

    const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a1a1a; color: #fff; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 20px;">${subjectAction} Event Submission</h1>
  </div>
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="margin: 0 0 20px 0; color: #333;">
      A member has ${actionText} an event for approval:
    </p>
    <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <p style="margin: 0 0 10px 0; color: #333;">
        <strong>Event:</strong> ${body.eventName}
      </p>
      ${body.eventDate ? `<p style="margin: 0 0 10px 0; color: #333;"><strong>Date:</strong> ${body.eventDate}</p>` : ''}
      <p style="margin: 0 0 10px 0; color: #333;">
        <strong>Submitted by:</strong> ${body.memberName}
      </p>
      <p style="margin: 0; color: #333;">
        <strong>Email:</strong> ${body.memberEmail}
      </p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${SITE_URL}/admin" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold;">
        Review in Admin Dashboard
      </a>
    </div>
    <p style="margin: 0; color: #666; font-size: 14px;">
      Please review and approve or reject this event within 48 hours.
    </p>
  </div>
</div>
`;

    const emailText = `${subjectAction} Event Submission

A member has ${actionText} an event for approval:

Event: ${body.eventName}
${body.eventDate ? `Date: ${body.eventDate}\n` : ''}Submitted by: ${body.memberName}
Email: ${body.memberEmail}

Review in Admin Dashboard: ${SITE_URL}/admin

Please review and approve or reject this event within 48 hours.
`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `${subjectAction} Event for Review: ${body.eventName}`,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message || 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    console.log('Event submission notification sent:', result.id);

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
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
