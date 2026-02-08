/**
 * MTNS MADE - Memberstack Webhook Handler
 *
 * Handles Memberstack webhook events to keep Supabase in sync:
 * - member.created → Create Supabase record
 * - member.deleted → Hard delete from Supabase + Webflow
 * - subscription.canceled → Mark lapsed, unpublish from Webflow
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN')!;
const MEMBERSTACK_WEBHOOK_SECRET = Deno.env.get('MEMBERSTACK_WEBHOOK_SECRET');

// Webflow collection IDs
const WEBFLOW_MEMBERS_COLLECTION_ID = '64a938756620ae4bee88df34';
const WEBFLOW_PROJECTS_COLLECTION_ID = '64aa150f02bee661d503cf59';
const WEBFLOW_EVENTS_COLLECTION_ID = '64aa21e9193adf43b765fcf1';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ============================================
// WEBFLOW API HELPERS
// ============================================

async function webflowRequest(endpoint: string, options: RequestInit = {}) {
  const url = `https://api.webflow.com/v2${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Webflow API error (${response.status}): ${error}`);
  }

  return response.json();
}

async function unpublishWebflowItem(collectionId: string, itemId: string) {
  return webflowRequest(`/collections/${collectionId}/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ isDraft: true }),
  });
}

async function deleteWebflowItem(collectionId: string, itemId: string) {
  return webflowRequest(`/collections/${collectionId}/items/${itemId}`, {
    method: 'DELETE',
  });
}

// ============================================
// EVENT HANDLERS
// ============================================

async function handleMemberCreated(data: any) {
  // Memberstack sends: { event, payload: { id, auth: { email }, customFields, ... } }
  const payload = data.payload || data;
  const memberstackId = payload.id;
  const email = payload.auth?.email || payload.email;
  const customFields = payload.customFields || {};

  console.log(`Creating member: ${email} (${memberstackId})`);
  console.log(`Custom fields:`, JSON.stringify(customFields));

  // Check if member already exists
  const { data: existing } = await supabase
    .from('members')
    .select('id')
    .eq('memberstack_id', memberstackId)
    .single();

  if (existing) {
    console.log(`Member already exists in Supabase: ${memberstackId}`);
    return { action: 'skipped', reason: 'already_exists' };
  }

  // Get membership type from custom fields and look up ID
  const membershipTypeSlug = customFields['membership-type'] || customFields.membershipType || null;
  let membershipTypeId = null;

  if (membershipTypeSlug) {
    const { data: membershipType } = await supabase
      .from('membership_types')
      .select('id')
      .eq('slug', membershipTypeSlug)
      .single();

    if (membershipType) {
      membershipTypeId = membershipType.id;
      console.log(`Found membership type: ${membershipTypeSlug} -> ${membershipTypeId}`);
    } else {
      console.log(`Membership type not found for slug: ${membershipTypeSlug}`);
    }
  }

  // Get suburb from custom fields and look up ID
  const suburbName = customFields['suburb'] || customFields.suburb || null;
  let suburbId = null;

  if (suburbName) {
    const { data: suburb } = await supabase
      .from('suburbs')
      .select('id')
      .ilike('name', suburbName)
      .single();

    if (suburb) {
      suburbId = suburb.id;
      console.log(`Found suburb: ${suburbName} -> ${suburbId}`);
    }
  }

  // Create member record
  const { error } = await supabase.from('members').insert({
    memberstack_id: memberstackId,
    email: email,
    first_name: customFields['first-name'] || customFields.firstName || null,
    last_name: customFields['last-name'] || customFields.lastName || null,
    name: customFields['first-name'] && customFields['last-name']
      ? `${customFields['first-name']} ${customFields['last-name']}`
      : email?.split('@')[0] || 'New Member',
    membership_type_id: membershipTypeId,
    suburb_id: suburbId,
    subscription_status: 'active',
  });

  if (error) {
    console.error(`Error creating member: ${error.message}`);
    throw error;
  }

  console.log(`Member created: ${memberstackId}`);
  return { action: 'created', memberstackId, membershipTypeId, suburbId };
}

async function handleMemberDeleted(data: any) {
  const payload = data.payload || data;
  const memberstackId = payload.id;

  console.log(`Deleting member: ${memberstackId}`);

  // Get member from Supabase (need webflow_id)
  const { data: supabaseMember } = await supabase
    .from('members')
    .select('id, webflow_id, name')
    .eq('memberstack_id', memberstackId)
    .single();

  if (!supabaseMember) {
    console.log(`Member not found in Supabase: ${memberstackId}`);
    return { action: 'skipped', reason: 'not_found' };
  }

  // Delete from Webflow if we have the webflow_id
  if (supabaseMember.webflow_id) {
    try {
      // Delete member's projects first
      const { data: projects } = await supabase
        .from('projects')
        .select('webflow_id')
        .eq('member_id', supabaseMember.id);

      for (const project of projects || []) {
        if (project.webflow_id) {
          try {
            await deleteWebflowItem(WEBFLOW_PROJECTS_COLLECTION_ID, project.webflow_id);
          } catch (e) {
            console.error(`Error deleting project from Webflow: ${e}`);
          }
        }
      }

      // Delete member's events
      const { data: events } = await supabase
        .from('events')
        .select('webflow_id')
        .eq('member_id', supabaseMember.id);

      for (const event of events || []) {
        if (event.webflow_id) {
          try {
            await deleteWebflowItem(WEBFLOW_EVENTS_COLLECTION_ID, event.webflow_id);
          } catch (e) {
            console.error(`Error deleting event from Webflow: ${e}`);
          }
        }
      }

      // Delete member
      await deleteWebflowItem(WEBFLOW_MEMBERS_COLLECTION_ID, supabaseMember.webflow_id);
      console.log(`Deleted from Webflow: ${supabaseMember.webflow_id}`);
    } catch (e) {
      console.error(`Error deleting from Webflow: ${e}`);
    }
  }

  // Hard delete from Supabase (CASCADE will delete projects/events)
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('memberstack_id', memberstackId);

  if (error) {
    console.error(`Error deleting from Supabase: ${error.message}`);
    throw error;
  }

  console.log(`Member deleted: ${memberstackId}`);
  return { action: 'deleted', memberstackId };
}

async function handleSubscriptionCanceled(data: any) {
  const payload = data.payload || data;
  const memberstackId = payload.id || payload.memberId;

  console.log(`Subscription canceled: ${memberstackId}`);

  // Get member from Supabase
  const { data: supabaseMember } = await supabase
    .from('members')
    .select('id, webflow_id, name')
    .eq('memberstack_id', memberstackId)
    .single();

  if (!supabaseMember) {
    console.log(`Member not found in Supabase: ${memberstackId}`);
    return { action: 'skipped', reason: 'not_found' };
  }

  // Update Supabase status
  const { error } = await supabase
    .from('members')
    .update({
      subscription_status: 'lapsed',
      subscription_lapsed_at: new Date().toISOString(),
    })
    .eq('memberstack_id', memberstackId);

  if (error) {
    console.error(`Error updating Supabase: ${error.message}`);
    throw error;
  }

  // Unpublish from Webflow
  if (supabaseMember.webflow_id) {
    try {
      // Unpublish member
      await unpublishWebflowItem(WEBFLOW_MEMBERS_COLLECTION_ID, supabaseMember.webflow_id);

      // Unpublish member's projects
      const { data: projects } = await supabase
        .from('projects')
        .select('webflow_id')
        .eq('member_id', supabaseMember.id);

      for (const project of projects || []) {
        if (project.webflow_id) {
          try {
            await unpublishWebflowItem(WEBFLOW_PROJECTS_COLLECTION_ID, project.webflow_id);
          } catch (e) {
            console.error(`Error unpublishing project: ${e}`);
          }
        }
      }

      console.log(`Unpublished from Webflow: ${supabaseMember.webflow_id}`);
    } catch (e) {
      console.error(`Error unpublishing from Webflow: ${e}`);
    }
  }

  console.log(`Member marked as lapsed: ${memberstackId}`);
  return { action: 'lapsed', memberstackId };
}

// ============================================
// MAIN HANDLER
// ============================================

serve(async (req) => {
  // Handle CORS preflight
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
    const body = await req.json();

    // Log the webhook event
    console.log('Received webhook:', JSON.stringify(body, null, 2));

    const event = body.event || body.type;
    let result;

    switch (event) {
      case 'member.created':
        result = await handleMemberCreated(body);
        break;

      case 'member.deleted':
        result = await handleMemberDeleted(body);
        break;

      case 'member.plan.canceled':
      case 'member.plan.cancelled':
      case 'subscription.canceled':
      case 'subscription.cancelled':
        result = await handleSubscriptionCanceled(body);
        break;

      default:
        console.log(`Unhandled event type: ${event}`);
        result = { action: 'ignored', event };
    }

    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
