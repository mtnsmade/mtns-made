/**
 * MTNS MADE - Log Activity Edge Function
 * Records member activity for admin dashboard feed
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const SITE_URL = 'https://www.mtnsmade.com.au';

interface ActivityRequest {
  memberstack_id: string;
  activity_type: 'profile_update' | 'project_create' | 'project_update' | 'project_delete' | 'event_submit' | 'event_update';
  entity_type?: 'project' | 'event' | null;
  entity_id?: string;
  entity_name?: string;
}

interface ActivityResult {
  success: boolean;
  id?: string;
  error?: string;
}

// Generate human-readable description based on activity type
function generateDescription(activityType: string, entityName?: string): string {
  switch (activityType) {
    case 'profile_update':
      return 'updated their profile';
    case 'project_create':
      return entityName ? `added the project '${entityName}'` : 'added a new project';
    case 'project_update':
      return entityName ? `updated the project '${entityName}'` : 'updated a project';
    case 'project_delete':
      return entityName ? `removed the project '${entityName}'` : 'removed a project';
    case 'event_submit':
      return entityName ? `submitted an event '${entityName}'` : 'submitted a new event';
    case 'event_update':
      return entityName ? `updated the event '${entityName}'` : 'updated an event';
    default:
      return 'performed an action';
  }
}

// Generate Webflow URL for member profile
function getMemberWebflowUrl(slug: string | null): string | null {
  if (!slug) return null;
  return `${SITE_URL}/members/${slug}`;
}

// Generate Webflow URL for entity
function getEntityWebflowUrl(entityType: string | null, slug: string | null): string | null {
  if (!entityType || !slug) return null;

  switch (entityType) {
    case 'project':
      return `${SITE_URL}/projects/${slug}`;
    case 'event':
      return `${SITE_URL}/event/${slug}`;
    default:
      return null;
  }
}

// CORS headers for all responses
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

  try {
    const body: ActivityRequest = await req.json();

    // Validate required fields
    if (!body.memberstack_id || !body.activity_type) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: memberstack_id, activity_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate activity type
    const validTypes = ['profile_update', 'project_create', 'project_update', 'project_delete', 'event_submit', 'event_update'];
    if (!validTypes.includes(body.activity_type)) {
      return new Response(
        JSON.stringify({ success: false, error: `Invalid activity_type. Must be one of: ${validTypes.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role for full access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Look up member details
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('id, name, slug, first_name, last_name')
      .eq('memberstack_id', body.memberstack_id)
      .single();

    if (memberError) {
      console.error('Error looking up member:', memberError);
      // Continue anyway - we can still log with memberstack_id
    }

    // Generate description
    const description = generateDescription(body.activity_type, body.entity_name);

    // Get member Webflow URL
    const memberWebflowUrl = member?.slug ? getMemberWebflowUrl(member.slug) : null;

    // For entity URL, we need to look up the entity's slug
    let entityWebflowUrl: string | null = null;
    if (body.entity_type && body.entity_id) {
      const tableName = body.entity_type === 'project' ? 'projects' : 'events';
      const { data: entity } = await supabase
        .from(tableName)
        .select('slug')
        .eq('id', body.entity_id)
        .single();

      if (entity?.slug) {
        entityWebflowUrl = getEntityWebflowUrl(body.entity_type, entity.slug);
      }
    }

    // Insert activity record
    const { data: activity, error: insertError } = await supabase
      .from('activity_log')
      .insert({
        member_id: member?.id || null,
        memberstack_id: body.memberstack_id,
        activity_type: body.activity_type,
        description: description,
        entity_type: body.entity_type || null,
        entity_id: body.entity_id || null,
        entity_name: body.entity_name || null,
        member_webflow_url: memberWebflowUrl,
        entity_webflow_url: entityWebflowUrl,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Error inserting activity:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Activity logged:', activity.id, body.activity_type);

    const result: ActivityResult = {
      success: true,
      id: activity.id,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Handler error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
