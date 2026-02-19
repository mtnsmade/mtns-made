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
      } else if (newStatus === 'active' && previousStatus === 'lapsed') {
        // Member resubscribed - unarchive in Webflow
        console.log('Unarchiving member in Webflow due to resubscription');
        await unarchiveInWebflow(member.webflow_id);
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
    console.error('Webhook handler error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
