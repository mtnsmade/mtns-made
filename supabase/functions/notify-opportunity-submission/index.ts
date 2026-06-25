/**
 * MTNS MADE - Notify Opportunity Submission
 * Sends email notification to admin when a member submits a job/opportunity for approval
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { sendEmail, FROM_SUPPORT } from '../_shared/gmail.ts';

const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'support@mtnsmade.com.au';
const SITE_URL = 'https://www.mtnsmade.com.au';

interface OpportunitySubmissionRequest {
  opportunityName: string;
  opportunityType?: string;
  memberName: string;
  memberEmail: string;
  isUpdate?: boolean;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
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
    const body: OpportunitySubmissionRequest = await req.json();

    if (!body.opportunityName || !body.memberName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: opportunityName, memberName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const actionText = body.isUpdate ? 'updated and resubmitted' : 'submitted';
    const subjectAction = body.isUpdate ? 'Updated' : 'New';

    const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a1a1a; color: #fff; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 20px;">${subjectAction} Opportunity Submission</h1>
  </div>
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="margin: 0 0 20px 0; color: #333;">
      A member has ${actionText} a job/opportunity for approval:
    </p>
    <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <p style="margin: 0 0 10px 0; color: #333;">
        <strong>Opportunity:</strong> ${body.opportunityName}
      </p>
      ${body.opportunityType ? `<p style="margin: 0 0 10px 0; color: #333;"><strong>Type:</strong> ${body.opportunityType}</p>` : ''}
      <p style="margin: 0 0 10px 0; color: #333;">
        <strong>Submitted by:</strong> ${body.memberName}
      </p>
      <p style="margin: 0; color: #333;">
        <strong>Email:</strong> ${body.memberEmail}
      </p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${SITE_URL}/admin/dashboard" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold;">
        Review in Admin Dashboard
      </a>
    </div>
    <p style="margin: 0; color: #666; font-size: 14px;">
      Please review and approve or reject this opportunity within 48 hours.
    </p>
  </div>
</div>`;

    const emailText = `${subjectAction} Opportunity Submission

A member has ${actionText} a job/opportunity for approval:

Opportunity: ${body.opportunityName}
${body.opportunityType ? `Type: ${body.opportunityType}\n` : ''}Submitted by: ${body.memberName}
Email: ${body.memberEmail}

Review in Admin Dashboard: ${SITE_URL}/admin/dashboard

Please review and approve or reject this opportunity within 48 hours.
`;

    const result = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `${subjectAction} Opportunity for Review: ${body.opportunityName}`,
      html: emailHtml,
      text: emailText,
      from: FROM_SUPPORT,
    });

    if (!result.success) {
      console.error('Email send error:', result.error);
      return new Response(
        JSON.stringify({ success: false, error: result.error || 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Opportunity submission notification sent:', result.id);

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
