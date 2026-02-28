// Supabase Edge Function: Memberstack Webhook Handler
// Handles member lifecycle events from Memberstack:
// - member.created: Create initial member record in Supabase
// - member.deleted: Soft delete in Supabase + delete from Webflow
// - member.updated: Sync subscription status changes

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';
const MEMBERSTACK_WEBHOOK_SECRET = Deno.env.get('MEMBERSTACK_WEBHOOK_SECRET') || '';
const RESEND_API_KEY = Deno.env.get('RESEND_API') || '';
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'hello@mtnsmade.com.au';
const FROM_EMAIL = 'MTNS MADE <support@mail.mtnsmade.com.au>';
const SITE_URL = 'https://www.mtnsmade.com.au';

// Webflow config
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';
const WEBFLOW_MEMBERS_COLLECTION_ID = '64a938756620ae4bee88df34';

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
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping welcome email');
    return;
  }

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
          <!-- Header -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Welcome to MTNS MADE</h1>
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

              <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                <strong>Your next steps:</strong>
              </p>

              <ul style="margin: 0 0 30px; padding-left: 20px; color: #555555; font-size: 16px; line-height: 1.8;">
                <li>Add your profile picture and header image</li>
                <li>Write a short bio about yourself</li>
                <li>Select your creative categories</li>
                <li>Add your first project to showcase your work</li>
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

Your next steps:
- Add your profile picture and header image
- Write a short bio about yourself
- Select your creative categories
- Add your first project to showcase your work

Complete your profile: ${SITE_URL}/profile/onboarding

Questions? Just reply to this email - we're here to help!

MTNS MADE
Blue Mountains Creative Community
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
        subject: 'Welcome to MTNS MADE!',
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Welcome email send error:', error);
      return;
    }

    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

// Notify admin of new member signup
async function notifyAdminNewMember(email: string, firstName: string, lastName: string): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping admin notification');
    return;
  }

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
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `New Member: ${memberName}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Admin notification send error:', error);
      return;
    }

    console.log('Admin notified of new member:', email);
  } catch (error) {
    console.error('Error notifying admin:', error);
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

// Create member in Supabase
async function createMember(memberData: MemberstackMemberData): Promise<void> {
  const supabase = getSupabaseClient();

  // Check if member already exists
  const existing = await getMemberByMemberstackId(memberData.id);
  if (existing) {
    console.log('Member already exists in Supabase:', memberData.id);
    return;
  }

  // Determine subscription status from plan connections
  let subscriptionStatus = 'pending';
  if (memberData.planConnections && memberData.planConnections.length > 0) {
    const activePlan = memberData.planConnections.find(p => p.status === 'ACTIVE');
    if (activePlan) {
      subscriptionStatus = 'active';
    }
  }

  const { error } = await supabase
    .from('members')
    .insert({
      memberstack_id: memberData.id,
      email: memberData.auth.email,
      first_name: memberData.customFields?.['first-name'] || null,
      last_name: memberData.customFields?.['last-name'] || null,
      subscription_status: subscriptionStatus,
      profile_complete: false,
      is_deleted: false,
    });

  if (error) {
    console.error('Error creating member:', error);
    throw error;
  }

  console.log('Member created in Supabase:', memberData.id);
}

// Soft delete member in Supabase
async function softDeleteMember(memberstackId: string): Promise<{ webflowId: string | null }> {
  const supabase = getSupabaseClient();

  // Get the member first to retrieve Webflow ID
  const member = await getMemberByMemberstackId(memberstackId);

  if (!member) {
    console.log('Member not found in Supabase:', memberstackId);
    return { webflowId: null };
  }

  // Soft delete by setting is_deleted flag
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

  return { webflowId: member.webflow_id };
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
        isArchived: true,
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

  // Publish the change
  await publishWebflowMember(webflowId);
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
  await createMember(data);

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

  // 1. Soft delete in Supabase and get Webflow ID
  const { webflowId } = await softDeleteMember(data.id);

  // 2. Delete from Webflow if has Webflow ID
  if (webflowId) {
    await deleteFromWebflow(webflowId);
  }

  // 3. Delete images from storage
  await deleteMemberImages(data.id);
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

  // Determine new status from plan connections
  let newStatus = previousStatus;
  if (data.planConnections && data.planConnections.length > 0) {
    const activePlan = data.planConnections.find(p => p.status === 'ACTIVE');
    newStatus = activePlan ? 'active' : 'lapsed';
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
        await logActivity(data.id, 'subscription_canceled');
      } else if (newStatus === 'active' && previousStatus === 'lapsed') {
        // Member resubscribed - unarchive in Webflow
        console.log('Unarchiving member in Webflow due to resubscription');
        await unarchiveInWebflow(member.webflow_id);
        await logActivity(data.id, 'subscription_reactivated');
      }
    } else {
      // No Webflow ID, but still log the activity
      if (newStatus === 'lapsed' && previousStatus === 'active') {
        await logActivity(data.id, 'subscription_canceled');
      } else if (newStatus === 'active' && previousStatus === 'lapsed') {
        await logActivity(data.id, 'subscription_reactivated');
      }
    }
  } else {
    console.log('Member status unchanged:', newStatus);
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
    // Verify webhook signature if secret is configured
    if (MEMBERSTACK_WEBHOOK_SECRET) {
      const signature = req.headers.get('x-memberstack-signature');
      if (!signature) {
        console.warn('Missing webhook signature');
        // For now, just log warning but continue
        // In production, you might want to reject unsigned requests
      }
      // TODO: Implement signature verification
    }

    const payload: MemberstackWebhookPayload = await req.json();
    console.log('Received Memberstack webhook:', payload.event);

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
        await handleMemberPlanCanceled(payload.payload);
        break;

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
