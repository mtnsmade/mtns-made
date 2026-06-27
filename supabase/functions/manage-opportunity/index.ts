/**
 * MTNS MADE - Manage Opportunity (Approve/Reject)
 * Handles admin approval or rejection of member-submitted jobs and opportunities
 * - Updates opportunity status in Supabase
 * - Syncs approved opportunities to Webflow CMS (collection: 64a9f30abaf5ea96e9180239)
 * - Sends notification email to the submitting member
 * - Sends opportunity alert to all active members
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendEmail, FROM_HELLO } from '../_shared/gmail.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const MEMBERSTACK_API_KEY = Deno.env.get('MEMBERSTACK_API_KEY') || '';
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';
const WEBFLOW_OPPORTUNITIES_COLLECTION_ID = '64a9f30abaf5ea96e9180239';
const SITE_URL = 'https://www.mtnsmade.com.au';

interface ManageOpportunityRequest {
  opportunityId: string;
  action: 'approve' | 'reject';
  rejectionReason?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info, x-member-token, x-member-id',
};

function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

async function syncToWebflow(opportunity: Record<string, unknown>, memberName: string, memberWebflowId: string): Promise<string | null> {
  if (!WEBFLOW_API_TOKEN) {
    console.warn('WEBFLOW_API_TOKEN not set — skipping Webflow sync');
    return null;
  }

  const fieldData: Record<string, unknown> = {
    name: opportunity.name,
    slug: opportunity.slug,
    'item-id': opportunity.id,
    'memberstack-id': opportunity.memberstack_id,
    'member-webflow-id': memberWebflowId || '',
    'contact-name': memberName || '',
    'application-email-address': opportunity.member_contact_email || '',
    'company': opportunity.organization || '',
    'summary': opportunity.description || '',
    'criteria': opportunity.criteria || '',
    'budget-guide': opportunity.budget || '',
    'closing-date': opportunity.closing_date || '',
  };

  // Create item in Webflow CMS
  const createRes = await fetch(
    `https://api.webflow.com/v2/collections/${WEBFLOW_OPPORTUNITIES_COLLECTION_ID}/items`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({ fieldData, isDraft: false, isArchived: false }),
    }
  );

  if (!createRes.ok) {
    const err = await createRes.text();
    console.error('Webflow create item error:', createRes.status, err);
    return null;
  }

  const created = await createRes.json();
  const webflowId = created.id;
  console.log('Opportunity synced to Webflow:', webflowId);

  // Publish the item
  const publishRes = await fetch(
    `https://api.webflow.com/v2/collections/${WEBFLOW_OPPORTUNITIES_COLLECTION_ID}/items/publish`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({ itemIds: [webflowId] }),
    }
  );

  if (!publishRes.ok) {
    const err = await publishRes.text();
    console.warn('Webflow publish item warning:', publishRes.status, err);
    // Non-fatal — item exists in CMS even if publish fails
  } else {
    console.log('Webflow item published:', webflowId);
  }

  return webflowId;
}

async function sendApprovalEmail(email: string, opportunityName: string): Promise<void> {

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Opportunity Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="background-color: #1a1a1a; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Opportunity Approved!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Great news! Your listing <strong>"${opportunityName}"</strong> has been approved and is now live on the MTNS MADE jobs and opportunities board.
              </p>
              <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                Share it with your network and help spread the word!
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${SITE_URL}/opportunities" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      View Opportunities Board
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
</html>`;

  try {
    await sendEmail({
      to: email,
      subject: `Your listing "${opportunityName}" has been approved!`,
      html: emailHtml,
      text: `Great news! Your listing "${opportunityName}" has been approved and is now live on the MTNS MADE jobs and opportunities board.\n\nView the board: ${SITE_URL}/opportunities\n\nThank you for contributing to the MTNS MADE community!\n\nMTNS MADE\n${SITE_URL}`,
      from: FROM_HELLO,
    });
    console.log('Approval email sent to:', email);
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
}

async function sendRejectionEmail(email: string, opportunityName: string, reason?: string): Promise<void> {

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
  <title>Opportunity Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="background-color: #1a1a1a; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Listing Update</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Thank you for submitting your listing <strong>"${opportunityName}"</strong> to MTNS MADE.
              </p>
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Unfortunately, we weren't able to approve this listing at this time.
              </p>
              ${reasonText}
              <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                You're welcome to edit and resubmit your listing, or reach out if you have any questions.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${SITE_URL}/profile/opportunities" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Edit Your Listings
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
</html>`;

  try {
    await sendEmail({
      to: email,
      subject: `Update on your listing "${opportunityName}"`,
      html: emailHtml,
      text: `Thank you for submitting your listing "${opportunityName}" to MTNS MADE.\n\nUnfortunately, we weren't able to approve this listing at this time.\n${reasonPlain}\nYou're welcome to edit and resubmit, or reach out if you have any questions.\n\nEdit your listings: ${SITE_URL}/profile/opportunities\n\nMTNS MADE\n${SITE_URL}`,
      from: FROM_HELLO,
    });
    console.log('Rejection email sent to:', email);
  } catch (error) {
    console.error('Error sending rejection email:', error);
  }
}

interface ActiveMember {
  first_name: string;
  email: string;
  profile_complete: boolean;
}

function buildAlertEmailHtml(
  firstName: string,
  opportunity: Record<string, unknown>,
  typeLabel: string,
  closingFormatted: string,
  profileComplete: boolean,
): string {
  const oppUrl = `${SITE_URL}/opportunities/jobs`;
  const profileUrl = `${SITE_URL}/member-dashboard`;

  const profileNudge = profileComplete ? '' : `
          <tr>
            <td style="padding: 0 40px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                style="background-color: #f5f5f5; border-left: 3px solid #1a1a1a; border-radius: 2px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 8px; color: #1a1a1a; font-size: 14px; font-weight: 600;">
                      Your profile isn't complete yet
                    </p>
                    <p style="margin: 0 0 12px; color: #555555; font-size: 14px; line-height: 1.5;">
                      Completing your profile means you show up in the member directory and the community can find you. It only takes a few minutes.
                    </p>
                    <a href="${profileUrl}" style="color: #1a1a1a; font-size: 14px; font-weight: 600; text-decoration: underline;">
                      Complete your profile →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New opportunity on MTNS MADE</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 4px; overflow: hidden;">
          <tr>
            <td style="background-color: #1a1a1a; padding: 24px 40px;">
              <p style="margin: 0; color: #ffffff; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">
                MTNS MADE
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 40px 24px;">
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Hi ${firstName},
              </p>
              <p style="margin: 0 0 24px; color: #1a1a1a; font-size: 16px; line-height: 1.6;">
                A new opportunity has just been posted on the MTNS MADE board.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                style="border: 1px solid #e0e0e0; border-radius: 2px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    ${typeLabel ? `<p style="margin: 0 0 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #888888;">${typeLabel}</p>` : ''}
                    <p style="margin: 0 0 4px; font-size: 18px; font-weight: 600; color: #1a1a1a; line-height: 1.3;">
                      ${opportunity.name}
                    </p>
                    ${opportunity.organization ? `<p style="margin: 0 0 12px; font-size: 14px; color: #666666;">${opportunity.organization}</p>` : '<div style="margin-bottom: 12px;"></div>'}
                    <p style="margin: 0; font-size: 13px; color: #888888;">
                      ${closingFormatted ? `Closes ${closingFormatted}` : ''}
                      ${opportunity.budget ? ` · ${opportunity.budget}` : ''}
                    </p>
                  </td>
                </tr>
              </table>
              <a href="${oppUrl}"
                style="display: inline-block; background-color: #1a1a1a; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 2px;">
                View opportunity →
              </a>
            </td>
          </tr>
          ${profileNudge}
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 40px; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 6px; color: #aaaaaa; font-size: 12px; line-height: 1.6;">
                Browse all current listings at
                <a href="${oppUrl}" style="color: #888888;">${SITE_URL}/opportunities/jobs</a>
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
</html>`;
}

const OPPORTUNITY_TYPE_LABELS: Record<string, string> = {
  'job':              'Job / Employment',
  'commission':       'Commission',
  'collaboration':    'Collaboration',
  'call-for-entries': 'Call for Entries',
  'residency':        'Residency / Fellowship',
  'volunteer':        'Volunteer',
};

async function sendMemberAlerts(
  supabase: ReturnType<typeof createClient>,
  opportunity: Record<string, unknown>,
  submitterEmail: string,
): Promise<void> {
  // Fetch all active members
  const { data: members, error } = await supabase
    .from('members')
    .select('first_name, email, profile_complete')
    .eq('subscription_status', 'active')
    .eq('is_deleted', false)
    .not('email', 'is', null);

  if (error || !members?.length) {
    console.warn('Member alert fetch error or no members:', error);
    return;
  }

  const typeLabel = OPPORTUNITY_TYPE_LABELS[opportunity.opportunity_type as string] || '';
  const closingFormatted = opportunity.closing_date
    ? new Date(opportunity.closing_date as string).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const subject = `New opportunity: ${opportunity.name}`;

  const recipients = (members as ActiveMember[]).filter(m => m.email && m.email !== submitterEmail);

  if (!recipients.length) {
    console.log('No members to alert');
    return;
  }

  console.log(`Sending opportunity alert to ${recipients.length} members`);

  for (const m of recipients) {
    try {
      await sendEmail({
        to: m.email,
        subject,
        html: buildAlertEmailHtml(
          m.first_name || 'there',
          opportunity,
          typeLabel,
          closingFormatted,
          m.profile_complete,
        ),
        from: FROM_HELLO,
      });
    } catch (err) {
      console.error(`Alert send error for ${m.email}:`, err);
    }
  }

  console.log(`Opportunity alerts sent to ${recipients.length} members`);
}

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
    const body: ManageOpportunityRequest = await req.json();

    if (!body.opportunityId || !body.action) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: opportunityId, action' }),
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

    const { data: opportunity, error: fetchError } = await supabase
      .from('opportunities')
      .select('id, name, slug, memberstack_id, member_contact_email, organization, description, criteria, budget, closing_date, opportunity_url, is_draft, is_archived, webflow_id')
      .eq('id', body.opportunityId)
      .single();

    if (fetchError || !opportunity) {
      console.error('Opportunity fetch error:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Opportunity not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (body.action === 'approve') {
      // Fetch member details for Webflow sync
      let memberName = '';
      let memberWebflowId = '';
      if (opportunity.memberstack_id) {
        const { data: member } = await supabase
          .from('members')
          .select('first_name, last_name, name, webflow_id')
          .eq('memberstack_id', opportunity.memberstack_id)
          .single();
        if (member) {
          memberName = [member.first_name, member.last_name].filter(Boolean).join(' ') || member.name || '';
          memberWebflowId = member.webflow_id || '';
        }
      }

      // Sync to Webflow CMS (non-fatal if it fails)
      let webflowId = opportunity.webflow_id || null;
      if (!webflowId) {
        webflowId = await syncToWebflow(opportunity, memberName, memberWebflowId);
      }

      const { error: updateError } = await supabase
        .from('opportunities')
        .update({
          is_draft: false,
          ...(webflowId ? { webflow_id: webflowId } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.opportunityId);

      if (updateError) {
        console.error('Opportunity update error:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to approve opportunity' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Opportunity approved:', opportunity.name);

      if (opportunity.member_contact_email) {
        await sendApprovalEmail(opportunity.member_contact_email, opportunity.name);
      }

      // Alert all active members (non-fatal)
      sendMemberAlerts(supabase, opportunity, opportunity.member_contact_email as string ?? '').catch(err =>
        console.error('Member alert error:', err)
      );

      return new Response(
        JSON.stringify({ success: true, action: 'approved', opportunityId: body.opportunityId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      // If previously published, delete from Webflow CMS so it's removed from the live site
      if (opportunity.webflow_id) {
        try {
          await fetch(
            `https://api.webflow.com/v2/collections/${WEBFLOW_OPPORTUNITIES_COLLECTION_ID}/items/${opportunity.webflow_id}`,
            { method: 'DELETE', headers: { 'Authorization': `Bearer ${WEBFLOW_API_TOKEN}` } }
          );
        } catch (err) {
          console.warn('Webflow delete on reject failed (non-fatal):', err);
        }
      }

      const { error: updateError } = await supabase
        .from('opportunities')
        .update({ is_archived: true, updated_at: new Date().toISOString() })
        .eq('id', body.opportunityId);

      if (updateError) {
        console.error('Opportunity update error:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to reject opportunity' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Opportunity rejected:', opportunity.name);

      if (opportunity.webflow_id) {
        fetch(`${SUPABASE_URL}/functions/v1/publish-site`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
        }).catch(err => console.warn('publish-site error (non-fatal):', err));
      }

      if (opportunity.member_contact_email) {
        await sendRejectionEmail(opportunity.member_contact_email, opportunity.name, body.rejectionReason);
      }

      return new Response(
        JSON.stringify({ success: true, action: 'rejected', opportunityId: body.opportunityId }),
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
