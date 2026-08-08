// Supabase Edge Function: Memberstack Webhook Handler
// Handles member lifecycle events from Memberstack:
// - member.created: Create initial member record in Supabase
// - member.deleted: Soft delete in Supabase + delete from Webflow
// - member.updated: Sync subscription status changes
// - member.plan.added: A plan was attached post-creation (e.g. the two-step
//   signup flow's checkout step) - re-runs the same status/type resolution
//   as member.updated
// - member.plan.canceled: Plan canceled - archive in Webflow

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendEmail, FROM_HELLO, FROM_SUPPORT } from '../_shared/gmail.ts';
import { hasActivePlan, resolveMembershipTypeId } from '../_shared/memberstack.ts';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';
const MEMBERSTACK_WEBHOOK_SECRET = Deno.env.get('MEMBERSTACK_WEBHOOK_SECRET') || '';
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'support@mtnsmade.com.au';
const SITE_URL = 'https://www.mtnsmade.com.au';

// Webflow config
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';
const WEBFLOW_MEMBERS_COLLECTION_ID = '64a938756620ae4bee88df34';
const WEBFLOW_PROJECTS_COLLECTION_ID = '64aa150f02bee661d503cf59';

// Storage bucket for member images
const MEMBER_IMAGES_BUCKET = 'member-images';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-memberstack-signature',
};

// Log activity to activity_log table via Edge Function
async function logActivity(memberstackId: string, activityType: string): Promise<void> {
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/log-activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberstack_id: memberstackId,
        activity_type: activityType,
      }),
    });
    console.log('Activity logged:', activityType, memberstackId);
  } catch (error) {
    console.warn('Failed to log activity:', error);
  }
}

// Send welcome email to new member
async function sendWelcomeEmail(email: string, firstName: string): Promise<void> {
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to MTNS MADE</title>
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
                Hi ${firstName || 'there'}!
              </h2>

              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Welcome to MTNS MADE - the Blue Mountains creative community! We're thrilled to have you join us.
              </p>

              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                To get the most out of your membership, complete your profile so other creatives can discover you in our directory.
              </p>

              <p style="margin: 0 0 16px; color: #555555; font-size: 16px; line-height: 1.6;">
                <strong>To complete your profile you'll need to:</strong>
              </p>

              <ul style="margin: 0 0 30px; padding-left: 20px; color: #555555; font-size: 16px; line-height: 1.8;">
                <li>Add your profile picture and header image</li>
                <li>Write a short bio about yourself</li>
                <li>Select your creative categories</li>
                <li>Choose your suburb</li>
              </ul>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${SITE_URL}/profile/onboarding" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Complete Your Profile
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

  const emailText = `Hi ${firstName || 'there'}!

Welcome to MTNS MADE - the Blue Mountains creative community! We're thrilled to have you join us.

To get the most out of your membership, complete your profile so other creatives can discover you in our directory.

To complete your profile you'll need to:
- Add your profile picture and header image
- Write a short bio about yourself
- Select your creative categories
- Choose your suburb

Complete your profile: ${SITE_URL}/profile/onboarding

Questions? Just reply to this email - we're here to help!

MTNS MADE
Blue Mountains Creative Community
${SITE_URL}
`;

  try {
    await sendEmail({ to: email, subject: 'Welcome to MTNS MADE!', html: emailHtml, text: emailText, from: FROM_HELLO });
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

// Notify admin of new member signup
async function notifyAdminNewMember(email: string, firstName: string, lastName: string): Promise<void> {
  const memberName = [firstName, lastName].filter(Boolean).join(' ') || email;

  const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a1a1a; color: #fff; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 20px;">New MTNS MADE Member</h1>
  </div>
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="margin: 0 0 20px 0; color: #333;">
      A new member has joined MTNS MADE:
    </p>
    <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <p style="margin: 0 0 10px 0; color: #333;">
        <strong>Name:</strong> ${memberName}
      </p>
      <p style="margin: 0; color: #333;">
        <strong>Email:</strong> ${email}
      </p>
    </div>
    <p style="margin: 0; color: #666; font-size: 14px;">
      They will receive a welcome email with instructions to complete their profile.
    </p>
  </div>
</div>
`;

  try {
    await sendEmail({ to: ADMIN_EMAIL, subject: `New Member: ${memberName}`, html: emailHtml, from: FROM_SUPPORT });
    console.log('Admin notified of new member:', email);
  } catch (error) {
    console.error('Error notifying admin:', error);
  }
}

// Notify member their subscription has been cancelled and profile archived
async function sendCancellationEmail(email: string, firstName: string): Promise<void> {
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
                Your membership has ended
              </h2>
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Hi ${firstName || 'there'}, your MTNS MADE membership has been cancelled and your profile is no longer visible in the directory.
              </p>
              <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                If you'd like to rejoin the community and have your profile reinstated, you're welcome to resubscribe at any time.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 30px;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${resubscribeUrl}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Resubscribe
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

Your MTNS MADE membership has been cancelled and your profile is no longer visible in the directory.

If you'd like to rejoin, you're welcome to resubscribe at any time:
${resubscribeUrl}

Questions? Reply to this email and we'll be happy to help.

MTNS MADE
${SITE_URL}`;

  try {
    await sendEmail({ to: email, subject: 'Your MTNS MADE membership has ended', html: emailHtml, text: emailText, from: FROM_HELLO });
    console.log('Cancellation email sent to:', email);
  } catch (error) {
    console.error('Error sending cancellation email:', error);
  }
}

// Notify member their subscription has been reactivated and profile is live
async function sendReactivationEmail(email: string, firstName: string): Promise<void> {
  const profileUrl = SITE_URL + '/profile/dashboard';

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
                Welcome back to MTNS MADE!
              </h2>
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                Hi ${firstName || 'there'}, your MTNS MADE membership is now active again and your profile is back in the directory.
              </p>
              <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                Great to have you back in the community!
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 30px;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${profileUrl}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      View Your Profile
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

Your MTNS MADE membership is now active again and your profile is back in the directory.

Great to have you back in the community!

View your profile: ${profileUrl}

Questions? Reply to this email and we'll be happy to help.

MTNS MADE
${SITE_URL}`;

  try {
    await sendEmail({ to: email, subject: 'Welcome back to MTNS MADE!', html: emailHtml, text: emailText, from: FROM_HELLO });
    console.log('Reactivation email sent to:', email);
  } catch (error) {
    console.error('Error sending reactivation email:', error);
  }
}

// Memberstack webhook event types
interface MemberstackWebhookPayload {
  event: string;
  payload: MemberstackMemberData;  // Memberstack uses "payload" not "data"
}

interface MemberstackMemberData {
  id: string; // Memberstack ID (e.g., mem_xxx)
  auth: {
    email: string;
  };
  customFields?: {
    'first-name'?: string;
    'last-name'?: string;
    'membership-type'?: string;
    'webflow-member-id'?: string;
    'member-webflow-url'?: string;
    'onboarding-complete'?: string | boolean;
  };
  planConnections?: Array<{
    planId: string;
    planName: string;
    status: string;
  }>;
  createdAt?: string;
  verified?: boolean;
}

// Initialize Supabase client with service role key
function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// Get member from Supabase by Memberstack ID
async function getMemberByMemberstackId(memberstackId: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('memberstack_id', memberstackId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    console.error('Error fetching member:', error);
  }

  return data;
}

// Look up suburb Supabase UUID by Webflow ID
async function getSuburbIdByWebflowId(webflowId: string): Promise<string | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('suburbs')
    .select('id')
    .eq('webflow_id', webflowId)
    .single();

  if (error || !data) {
    console.warn('Could not find suburb by Webflow ID:', webflowId, error?.message);
    return null;
  }

  return data.id;
}

// Send failed signup alert to admin
async function sendFailedSignupAlert(email: string, memberstackId: string, error: unknown): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : String(error);
  try {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `⚠️ Failed Signup: ${email}`,
      from: FROM_SUPPORT,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #cc0000; color: #fff; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 20px;">⚠️ Member Signup Failed</h1>
  </div>
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="margin: 0 0 20px 0; color: #333;">
      A new member signed up but their Supabase record could not be created. They will not be able to complete onboarding until this is resolved.
    </p>
    <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <p style="margin: 0 0 10px 0; color: #333;"><strong>Email:</strong> ${email}</p>
      <p style="margin: 0 0 10px 0; color: #333;"><strong>Memberstack ID:</strong> ${memberstackId}</p>
      <p style="margin: 0; color: #cc0000;"><strong>Error:</strong> ${errorMessage}</p>
    </div>
    <p style="margin: 0; color: #666; font-size: 14px;">
      To fix: manually create a Supabase record for this member using their Memberstack ID and email.
    </p>
  </div>
</div>`,
    });
    console.log('Failed signup alert sent to admin for:', email);
  } catch (err) {
    console.error('Error sending failed signup alert:', err);
  }
}

// Create member in Supabase
async function createMember(memberData: MemberstackMemberData): Promise<void> {
  const supabase = getSupabaseClient();

  // member.created means "first time" - if this member already exists, this
  // is a redelivery (Memberstack retry, or a duplicate delivery) and should
  // be a no-op, not a merge. The previous unconditional upsert overwrote
  // profile_complete back to false (and name/slug/suburb_id from whatever
  // Memberstack's custom fields said at event time) on every redelivery,
  // which could silently reset a fully-onboarded member back to incomplete.
  // Any real state changes since creation come through member.updated /
  // member.plan.* events, which already merge carefully - this function has
  // nothing new to contribute for a member that already exists.
  const { data: existingMember } = await supabase
    .from('members')
    .select('id')
    .eq('memberstack_id', memberData.id)
    .maybeSingle();

  if (existingMember) {
    console.log('member.created redelivery for existing member, no-op:', memberData.id);
    return;
  }

  // Determine subscription status from plan connections. No planConnections at
  // all means the two-step signup flow (member created before checkout) -
  // default to 'active' since there's nothing to be pending on yet.
  let subscriptionStatus = 'active';
  if (memberData.planConnections && memberData.planConnections.length > 0) {
    subscriptionStatus = hasActivePlan(memberData.planConnections) ? 'active' : 'pending';
  }

  // Resolve membership_type_id via the shared two-tier lookup: active plan's
  // name first, falling back to customFields['membership-type'] (a slug set
  // by the signup form before any plan is attached). This fallback is what
  // was missing here - the two-step signup flow creates the member with an
  // empty planConnections array, so the old name-only lookup always resolved
  // to null at creation time and nothing ever revisited it (see the
  // member.plan.added case below, previously unhandled).
  const membershipTypeId = await resolveMembershipTypeId(supabase, memberData);
  console.log('Creating member — status:', subscriptionStatus, 'membership_type_id:', membershipTypeId);

  // Look up suburb from Memberstack custom fields (stored as Webflow ID)
  let suburbId: string | null = null;
  const suburbWebflowId = memberData.customFields?.['suburb-id'];
  if (suburbWebflowId) {
    suburbId = await getSuburbIdByWebflowId(suburbWebflowId);
    console.log('Suburb lookup:', suburbWebflowId, '->', suburbId);
  }

  // Build display name and slug from custom fields
  const firstName = memberData.customFields?.['first-name'] || '';
  const lastName = memberData.customFields?.['last-name'] || '';
  const displayName = [firstName, lastName].filter(Boolean).join(' ') || null;
  const slug = memberData.customFields?.['slug'] ||
    (displayName ? displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : null);

  console.log('Creating member with name:', displayName, 'slug:', slug);

  // Still an upsert (not a plain insert), but now ignoreDuplicates: true -
  // the existence check above handles the normal redelivery case, this is
  // just a safety net if two deliveries for the same new member land
  // concurrently (both could pass the check above before either commits).
  // In that race, the loser silently no-ops here instead of throwing a
  // duplicate-key error or overwriting the winner's row.
  const { error } = await supabase
    .from('members')
    .upsert({
      memberstack_id: memberData.id,
      email: memberData.auth.email,
      first_name: firstName || null,
      last_name: lastName || null,
      name: displayName,
      slug: slug,
      suburb_id: suburbId,
      subscription_status: subscriptionStatus,
      membership_type_id: membershipTypeId,
      profile_complete: false,
      is_deleted: false,
    }, { onConflict: 'memberstack_id', ignoreDuplicates: true });

  if (error) {
    console.error('Error creating member:', error);
    throw error;
  }

  console.log('Member created in Supabase:', memberData.id, 'with suburb:', suburbId);
}

// Soft delete member in Supabase
// Marks is_deleted in Supabase. Deliberately does NOT fetch the member or
// touch Webflow - callers must confirm the Webflow side is handled first.
// See handleMemberDeleted for why this ordering matters: setting
// is_deleted before the Webflow delete is confirmed would permanently
// exclude the member from future cleanup/consistency queries even if the
// Webflow delete then fails, silently orphaning their still-live Webflow
// profile forever - the inverse of the July 18 incident's failure shape.
async function markMemberDeletedInSupabase(memberstackId: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('members')
    .update({
      is_deleted: true,
      subscription_status: 'deleted',
      updated_at: new Date().toISOString()
    })
    .eq('memberstack_id', memberstackId);

  if (error) {
    console.error('Error soft deleting member:', error);
    throw error;
  }

  console.log('Member soft deleted in Supabase:', memberstackId);
}

// Delete member from Webflow CMS
async function deleteFromWebflow(webflowId: string): Promise<void> {
  if (!WEBFLOW_API_TOKEN) {
    console.log('WEBFLOW_API_TOKEN not configured, skipping Webflow delete');
    return;
  }

  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/${webflowId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    // 404 is OK - item might already be deleted
    if (response.status === 404) {
      console.log('Webflow item already deleted or not found:', webflowId);
      return;
    }
    console.error('Webflow delete error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  console.log('Member deleted from Webflow:', webflowId);
}

// Archive member in Webflow CMS (hides from directory but keeps data)
async function archiveInWebflow(webflowId: string): Promise<void> {
  if (!WEBFLOW_API_TOKEN) {
    console.log('WEBFLOW_API_TOKEN not configured, skipping Webflow archive');
    return;
  }

  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/${webflowId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        // Also set isDraft so this is a true mirror of unarchiveInWebflow
        // (which resets both flags) rather than leaving isDraft at whatever
        // it happened to be before - can only make the item more hidden,
        // never less, so this is safe regardless of prior isDraft state.
        isArchived: true,
        isDraft: true,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 404) {
      console.log('Webflow item not found for archiving:', webflowId);
      return;
    }
    console.error('Webflow archive error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  console.log('Member archived in Webflow:', webflowId);
  // Note: Archived items are automatically removed from the live site
  // No publish needed - Webflow handles this automatically
}

// Unarchive member in Webflow CMS (when they resubscribe)
async function unarchiveInWebflow(webflowId: string): Promise<void> {
  if (!WEBFLOW_API_TOKEN) {
    console.log('WEBFLOW_API_TOKEN not configured, skipping Webflow unarchive');
    return;
  }

  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/${webflowId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        isArchived: false,
        isDraft: false,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 404) {
      console.log('Webflow item not found for unarchiving:', webflowId);
      return;
    }
    console.error('Webflow unarchive error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  console.log('Member unarchived in Webflow:', webflowId);

  // Publish the change
  await publishWebflowMember(webflowId);
}

// Publish member in Webflow CMS
async function publishWebflowMember(webflowId: string): Promise<void> {
  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/publish`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        itemIds: [webflowId],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Webflow publish error:', response.status, errorText);
  } else {
    console.log('Webflow member published:', webflowId);
  }
}

// Unarchive all projects for a member when they are reactivated
async function unarchiveMemberProjects(memberstackId: string): Promise<void> {
  if (!WEBFLOW_API_TOKEN) {
    console.log('WEBFLOW_API_TOKEN not configured, skipping project unarchive');
    return;
  }

  const supabase = getSupabaseClient();

  // Get all projects for this member that have a Webflow ID
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, webflow_id')
    .eq('memberstack_id', memberstackId)
    .not('webflow_id', 'is', null)
    .eq('is_deleted', false);

  if (error) {
    console.error('Error fetching member projects:', error);
    return;
  }

  if (!projects || projects.length === 0) {
    console.log('No projects to unarchive for member:', memberstackId);
    return;
  }

  console.log(`Found ${projects.length} projects to unarchive for member:`, memberstackId);

  const projectIdsToPublish: string[] = [];

  for (const project of projects) {
    try {
      // Unarchive the project in Webflow
      const response = await fetch(
        `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/${project.webflow_id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify({
            isArchived: false,
            isDraft: false,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404) {
          console.log('Project not found in Webflow:', project.name, project.webflow_id);
          continue;
        }
        console.error('Error unarchiving project:', project.name, response.status, errorText);
        continue;
      }

      console.log('Project unarchived:', project.name);
      projectIdsToPublish.push(project.webflow_id);
    } catch (err) {
      console.error('Error unarchiving project:', project.name, err);
    }
  }

  // Publish all unarchived projects in one batch
  if (projectIdsToPublish.length > 0) {
    try {
      const publishResponse = await fetch(
        `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/publish`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify({
            itemIds: projectIdsToPublish,
          }),
        }
      );

      if (!publishResponse.ok) {
        const errorText = await publishResponse.text();
        console.error('Error publishing projects:', publishResponse.status, errorText);
      } else {
        console.log(`Published ${projectIdsToPublish.length} projects`);
      }
    } catch (err) {
      console.error('Error publishing projects:', err);
    }
  }
}

// Archive all projects for a member when they lapse
async function archiveMemberProjects(memberstackId: string): Promise<void> {
  if (!WEBFLOW_API_TOKEN) {
    console.log('WEBFLOW_API_TOKEN not configured, skipping project archive');
    return;
  }

  const supabase = getSupabaseClient();

  // Get all projects for this member that have a Webflow ID
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, webflow_id')
    .eq('memberstack_id', memberstackId)
    .not('webflow_id', 'is', null)
    .eq('is_deleted', false);

  if (error) {
    console.error('Error fetching member projects:', error);
    return;
  }

  if (!projects || projects.length === 0) {
    console.log('No projects to archive for member:', memberstackId);
    return;
  }

  console.log(`Found ${projects.length} projects to archive for member:`, memberstackId);

  for (const project of projects) {
    try {
      const response = await fetch(
        `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/${project.webflow_id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify({
            // Mirror unarchiveMemberProjects, which resets both flags -
            // see archiveInWebflow above for why this is safe.
            isArchived: true,
            isDraft: true,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404) {
          console.log('Project not found in Webflow:', project.name, project.webflow_id);
          continue;
        }
        console.error('Error archiving project:', project.name, response.status, errorText);
        continue;
      }

      console.log('Project archived:', project.name);
    } catch (err) {
      console.error('Error archiving project:', project.name, err);
    }
  }
}

// Delete member images from storage
async function deleteMemberImages(memberstackId: string): Promise<void> {
  const supabase = getSupabaseClient();

  try {
    // List all files in the member's folder
    const { data: files, error: listError } = await supabase.storage
      .from(MEMBER_IMAGES_BUCKET)
      .list(memberstackId);

    if (listError) {
      console.error('Error listing member images:', listError);
      return;
    }

    if (!files || files.length === 0) {
      console.log('No images to delete for member:', memberstackId);
      return;
    }

    // Build array of file paths to delete
    const filePaths = files.map(file => `${memberstackId}/${file.name}`);

    // Delete all files
    const { error: deleteError } = await supabase.storage
      .from(MEMBER_IMAGES_BUCKET)
      .remove(filePaths);

    if (deleteError) {
      console.error('Error deleting member images:', deleteError);
    } else {
      console.log(`Deleted ${filePaths.length} images for member:`, memberstackId);
    }
  } catch (error) {
    console.error('Error in deleteMemberImages:', error);
  }
}

// Update member subscription status
async function updateSubscriptionStatus(memberstackId: string, status: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('members')
    .update({
      subscription_status: status,
      subscription_lapsed_at: status === 'lapsed' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('memberstack_id', memberstackId);

  if (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }

  console.log('Member subscription status updated:', memberstackId, status);
}

// Handle member.created event
async function handleMemberCreated(data: MemberstackMemberData): Promise<void> {
  console.log('Handling member.created:', data.id);

  try {
    await createMember(data);
  } catch (error) {
    // Alert admin immediately — don't wait for the daily consistency check
    console.error('Failed to create member in Supabase, sending alert:', data.id);
    await sendFailedSignupAlert(data.auth?.email ?? 'unknown', data.id, error);
    throw error; // Re-throw so Memberstack receives a 500 and will retry
  }

  // Log the signup to activity feed
  await logActivity(data.id, 'member_signup');

  // Send welcome email to new member
  const firstName = data.customFields?.['first-name'] || '';
  const lastName = data.customFields?.['last-name'] || '';
  const email = data.auth.email;

  // Send emails in parallel (don't await to avoid slowing webhook response)
  Promise.all([
    sendWelcomeEmail(email, firstName),
    notifyAdminNewMember(email, firstName, lastName),
  ]).catch(err => console.warn('Email notification error:', err));
}

// Handle member.deleted event
async function handleMemberDeleted(data: MemberstackMemberData): Promise<void> {
  console.log('Handling member.deleted:', data.id);

  const member = await getMemberByMemberstackId(data.id);
  if (!member) {
    console.log('Member not found in Supabase for deletion:', data.id);
    return;
  }

  // 1. Delete member profile from Webflow FIRST, before marking anything
  // deleted in Supabase. If this throws, the whole handler throws before
  // is_deleted is ever set - the member stays fully visible/active in
  // Supabase (and Memberstack will retry the webhook delivery on the
  // non-2xx response) rather than being permanently excluded from future
  // cleanup queries while their Webflow profile silently stays live
  // forever.
  if (member.webflow_id) {
    await deleteFromWebflow(member.webflow_id);
  }

  // 2. Only now mark deleted in Supabase, since the Webflow side is done
  await markMemberDeletedInSupabase(data.id);

  // 3. Archive member's projects in Webflow
  await archiveMemberProjects(data.id);

  // 4. Trigger site publish so deleted member disappears from live site immediately
  fetch(`${SUPABASE_URL}/functions/v1/publish-site`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
  }).catch(err => console.warn('publish-site error after member delete:', err));

  // 5. Delete images from storage
  await deleteMemberImages(data.id);

  // 5. Log activity
  await logActivity(data.id, 'member_deleted');
}

// Handle member.updated event (for subscription changes)
async function handleMemberPlanCanceled(data: MemberstackMemberData): Promise<void> {
  console.log('Handling member.plan.canceled:', data.id);

  // Get current member data from Supabase
  const member = await getMemberByMemberstackId(data.id);
  if (!member) {
    console.log('Member not found in Supabase for plan cancellation:', data.id);
    return;
  }

  const previousStatus = member.subscription_status;

  // Plan was canceled - mark as lapsed
  if (previousStatus !== 'lapsed') {
    await updateSubscriptionStatus(data.id, 'lapsed');
    console.log(`Member status changed due to plan cancellation: ${previousStatus} -> lapsed`);

    // Archive in Webflow if member has a Webflow ID
    if (member.webflow_id) {
      console.log('Archiving member in Webflow due to plan cancellation');
      await archiveInWebflow(member.webflow_id);
    }

    // Also archive member's projects
    console.log('Archiving member projects due to plan cancellation');
    await archiveMemberProjects(data.id);

    // Trigger site publish so archived member disappears from live site immediately
    fetch(`${SUPABASE_URL}/functions/v1/publish-site`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
    }).catch(err => console.warn('publish-site error after plan cancellation:', err));

    // Notify member their profile is now archived
    const firstName = member.first_name || member.name?.split(' ')[0] || '';
    sendCancellationEmail(member.email, firstName).catch(err =>
      console.warn('Cancellation email error:', err)
    );

    // Log to activity feed
    await logActivity(data.id, 'subscription_canceled');
  } else {
    console.log('Member already lapsed, no change needed');
  }
}

async function handleMemberUpdated(data: MemberstackMemberData): Promise<void> {
  console.log('Handling member.updated:', data.id);

  // Get current member data from Supabase
  const member = await getMemberByMemberstackId(data.id);
  if (!member) {
    console.log('Member not found in Supabase for update:', data.id);
    return;
  }

  const previousStatus = member.subscription_status;

  // Determine new status and membership type from plan connections
  const supabase = getSupabaseClient();
  let newStatus = previousStatus;
  let newMembershipTypeId: string | null | undefined = undefined; // undefined = don't update
  if (data.planConnections && data.planConnections.length > 0) {
    // Was ACTIVE-only, which wrongly marked TRIALING members lapsed (and
    // archived their Webflow profile) on any unrelated member.updated event.
    newStatus = hasActivePlan(data.planConnections) ? 'active' : 'lapsed';

    // Only overwrite membership_type_id when something actually resolves -
    // preserve the undefined "don't touch" sentinel on a null result so an
    // unresolvable lookup (e.g. a renamed plan, no custom-field slug either)
    // doesn't wipe out an already-correct existing value.
    const resolved = await resolveMembershipTypeId(supabase, data);
    if (resolved !== null) {
      newMembershipTypeId = resolved;
    }
  }

  // Update membership type if we resolved one
  if (newMembershipTypeId !== undefined && newMembershipTypeId !== member.membership_type_id) {
    await supabase
      .from('members')
      .update({ membership_type_id: newMembershipTypeId })
      .eq('memberstack_id', data.id);
    console.log('Membership type updated:', member.membership_type_id, '->', newMembershipTypeId);
  }

  // Update Supabase if status changed
  if (newStatus !== previousStatus) {
    await updateSubscriptionStatus(data.id, newStatus);
    console.log(`Member status changed: ${previousStatus} -> ${newStatus}`);

    // Handle Webflow archive/unarchive if member has a Webflow ID
    if (member.webflow_id) {
      if (newStatus === 'lapsed' && previousStatus === 'active') {
        // Member cancelled - archive in Webflow
        console.log('Archiving member in Webflow due to cancellation');
        await archiveInWebflow(member.webflow_id);
        // Also archive member's projects
        console.log('Archiving member projects due to cancellation');
        await archiveMemberProjects(data.id);
        await logActivity(data.id, 'subscription_canceled');
      } else if (newStatus === 'active' && previousStatus === 'lapsed') {
        // Member resubscribed - unarchive in Webflow
        console.log('Unarchiving member in Webflow due to resubscription');
        await unarchiveInWebflow(member.webflow_id);
        // Also unarchive member's projects
        console.log('Unarchiving member projects due to resubscription');
        await unarchiveMemberProjects(data.id);
        await logActivity(data.id, 'subscription_reactivated');
        // Notify member they're back
        const firstName = member.first_name || member.name?.split(' ')[0] || '';
        sendReactivationEmail(member.email, firstName).catch(err =>
          console.warn('Reactivation email error:', err)
        );
      }
    } else {
      // No Webflow ID, but still archive/unarchive projects and log activity
      if (newStatus === 'lapsed' && previousStatus === 'active') {
        console.log('Archiving member projects (no Webflow profile)');
        await archiveMemberProjects(data.id);
        await logActivity(data.id, 'subscription_canceled');
        const firstName = member.first_name || member.name?.split(' ')[0] || '';
        sendCancellationEmail(member.email, firstName).catch(err =>
          console.warn('Cancellation email error:', err)
        );
      } else if (newStatus === 'active' && previousStatus === 'lapsed') {
        console.log('Unarchiving member projects (no Webflow profile)');
        await unarchiveMemberProjects(data.id);
        await logActivity(data.id, 'subscription_reactivated');
        const firstName = member.first_name || member.name?.split(' ')[0] || '';
        sendReactivationEmail(member.email, firstName).catch(err =>
          console.warn('Reactivation email error:', err)
        );
      }
    }
  } else {
    console.log('Member status unchanged:', newStatus);
  }
}

// Verify a Memberstack webhook signature. Memberstack signs webhooks via
// Svix (confirmed directly against Svix's own docs, not guessed): the
// signed content is `${svix-id}.${svix-timestamp}.${rawBody}`, HMAC-SHA256
// with the signing secret (the part after "whsec_", base64-decoded) as the
// key, base64-encoded output. The svix-signature header holds space-
// delimited "v1,<sig>" entries - Svix sends multiple candidates during
// secret rotation, so a match against any one of them is valid. Constant-
// time comparison avoids leaking timing information about a partial match.
//
// IMPORTANT: this must run against the RAW request body text, not a
// re-serialized JSON.parse(...) result - re-serializing can change
// whitespace/key order and silently break every signature check.
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function verifyWebhookSignature(
  rawBody: string,
  svixId: string | null,
  svixTimestamp: string | null,
  svixSignature: string | null
): Promise<{ valid: boolean; reason: string }> {
  if (!MEMBERSTACK_WEBHOOK_SECRET) {
    return { valid: false, reason: 'MEMBERSTACK_WEBHOOK_SECRET not configured' };
  }
  if (!svixId || !svixTimestamp || !svixSignature) {
    return { valid: false, reason: 'missing one or more svix-* headers' };
  }

  // Reject stale/future timestamps (5 minute tolerance) to guard against replay.
  const timestampSeconds = parseInt(svixTimestamp, 10);
  if (isNaN(timestampSeconds)) {
    return { valid: false, reason: 'svix-timestamp is not a valid number' };
  }
  const driftSeconds = Math.floor(Date.now() / 1000) - timestampSeconds;
  if (Math.abs(driftSeconds) > 5 * 60) {
    return { valid: false, reason: `svix-timestamp outside 5min tolerance (${driftSeconds}s off)` };
  }

  try {
    const secretPart = MEMBERSTACK_WEBHOOK_SECRET.startsWith('whsec_')
      ? MEMBERSTACK_WEBHOOK_SECRET.slice('whsec_'.length)
      : MEMBERSTACK_WEBHOOK_SECRET;
    const keyBytes = Uint8Array.from(atob(secretPart), c => c.charCodeAt(0));

    const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
    const key = await crypto.subtle.importKey(
      'raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const signatureBytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedContent));
    const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)));

    const candidates = svixSignature.split(' ').map(entry => entry.split(',')[1]).filter(Boolean);
    const valid = candidates.some(candidate => constantTimeEqual(candidate, expectedSignature));
    return { valid, reason: valid ? 'signature matched' : 'no candidate signature matched expected value' };
  } catch (err) {
    return { valid: false, reason: `verification error: ${err instanceof Error ? err.message : String(err)}` };
  }
}

// Main handler
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders
    });
  }

  // Check environment variables early
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required environment variables:', {
      hasSupabaseUrl: !!SUPABASE_URL,
      hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY,
    });
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Server configuration error: missing environment variables',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Read the raw body text first - signature verification needs the exact
    // bytes Memberstack signed, not a re-serialized JSON.parse(...) result.
    const rawBody = await req.text();

    // ENFORCING MODE (flipped 2026-08-08 after an observe-only rollout window
    // confirmed real Memberstack/Svix-signed deliveries verify correctly -
    // see the stabilization plan for the full verification history).
    //
    // Two valid ways to authenticate a request here:
    // 1. A genuine Svix signature from Memberstack.
    // 2. Our own service-role bearer token, for the one legitimate internal
    //    caller (lapsed-member-cleanup's hardDeleteMember, which replays a
    //    member.deleted event server-to-server and has no Svix signature of
    //    its own to present).
    // Reject only if NEITHER is valid.
    const internalAuth = req.headers.get('Authorization');
    const isTrustedInternalCall = !!internalAuth
      && internalAuth.startsWith('Bearer ')
      && constantTimeEqual(internalAuth.slice('Bearer '.length), SUPABASE_SERVICE_ROLE_KEY);

    if (!isTrustedInternalCall) {
      const verification = await verifyWebhookSignature(
        rawBody,
        req.headers.get('svix-id'),
        req.headers.get('svix-timestamp'),
        req.headers.get('svix-signature')
      );
      if (!verification.valid) {
        console.error(`Webhook signature verification FAILED - rejecting: ${verification.reason}`);
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid webhook signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('Webhook signature verification: valid -', verification.reason);
    } else {
      console.log('Webhook request authenticated as trusted internal call (service-role bearer token)');
    }

    const payload = JSON.parse(rawBody);
    console.log('Received Memberstack webhook:', payload.event);
    console.log('Payload structure:', JSON.stringify(payload, null, 2).substring(0, 500));

    switch (payload.event) {
      case 'member.created':
        await handleMemberCreated(payload.payload);
        break;

      case 'member.deleted':
        await handleMemberDeleted(payload.payload);
        break;

      case 'member.updated':
        await handleMemberUpdated(payload.payload);
        break;

      case 'member.plan.canceled':
        // member.plan.canceled has nested structure: payload.member contains member data
        const memberData = payload.payload?.member || payload.payload;
        console.log('Extracted member ID for plan.canceled:', memberData?.id);
        await handleMemberPlanCanceled(memberData);
        break;

      case 'member.plan.added': {
        // A plan was attached post-creation (e.g. the two-step signup flow's
        // checkout step, or an admin/self-service plan change). This case was
        // previously missing entirely, which is why members created without a
        // plan (empty planConnections at member.created time) never got their
        // membership_type_id resolved when the plan was attached moments
        // later - see .claude/skills/memberstack-integration/references/
        // webhook-events.md for the full incident writeup.
        // Same nested payload structure as member.plan.canceled, assumed by
        // convention rather than confirmed in Memberstack's docs - verify via
        // logs on the first real delivery.
        const planAddedMemberData = payload.payload?.member || payload.payload;
        console.log('Extracted member ID for plan.added:', planAddedMemberData?.id);
        await handleMemberUpdated(planAddedMemberData);
        break;
      }

      default:
        console.log('Unhandled event type:', payload.event);
    }

    return new Response(
      JSON.stringify({ success: true, event: payload.event }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    // Log detailed error information
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Webhook handler error:', {
      message: errorMessage,
      stack: errorStack,
      error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: errorStack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
