/**
 * MTNS MADE - Admin Member Management
 * Query members and complete profiles manually
 *
 * Modes:
 * - POST { emails: [...] } - Query member details
 * - POST { mode: 'complete-profile', email: '...' } - Complete a member's profile and sync to Webflow
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';
const WEBFLOW_MEMBERS_COLLECTION_ID = '64a938756620ae4bee88df34';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Check and publish a Webflow member
async function checkAndPublishWebflow(webflowId: string): Promise<{ success: boolean; item?: any; error?: string }> {
  if (!WEBFLOW_API_TOKEN) {
    return { success: false, error: 'WEBFLOW_API_TOKEN not configured' };
  }

  // Get item status
  const getResponse = await fetch(
    `https://api.webflow.com/v2/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/${webflowId}`,
    {
      headers: { 'Authorization': `Bearer ${WEBFLOW_API_TOKEN}` }
    }
  );

  if (!getResponse.ok) {
    const error = await getResponse.text();
    return { success: false, error: `Failed to get item: ${error}` };
  }

  const item = await getResponse.json();

  // Publish the item
  const publishResponse = await fetch(
    `https://api.webflow.com/v2/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/publish`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemIds: [webflowId] }),
    }
  );

  if (!publishResponse.ok) {
    const error = await publishResponse.text();
    return { success: false, item, error: `Failed to publish: ${error}` };
  }

  return { success: true, item };
}

// Complete a member's profile and trigger Webflow sync
async function completeProfile(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
  // Get the member
  const { data: member, error: fetchError } = await supabase
    .from('members')
    .select('*')
    .eq('email', email)
    .single();

  if (fetchError || !member) {
    return { success: false, error: fetchError?.message || 'Member not found' };
  }

  if (member.profile_complete) {
    return { success: false, error: 'Profile is already complete' };
  }

  // Check required fields
  if (!member.bio || member.bio.trim().length < 50) {
    return { success: false, error: 'Bio is missing or too short (min 50 characters)' };
  }
  if (!member.profile_image_url) {
    return { success: false, error: 'Profile image is missing' };
  }
  if (!member.header_image_url) {
    return { success: false, error: 'Header image is missing' };
  }
  if (!member.slug) {
    return { success: false, error: 'Slug is missing' };
  }

  // Update profile_complete
  const { error: updateError } = await supabase
    .from('members')
    .update({
      profile_complete: true,
      profile_completed_at: new Date().toISOString(),
    })
    .eq('id', member.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Trigger Webflow sync by calling sync-to-webflow function
  try {
    const syncPayload = {
      type: 'UPDATE',
      table: 'members',
      schema: 'public',
      record: { ...member, profile_complete: true },
      old_record: member,
    };

    const syncResponse = await fetch(`${SUPABASE_URL}/functions/v1/sync-to-webflow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify(syncPayload),
    });

    const syncResult = await syncResponse.json();

    if (!syncResult.success) {
      return {
        success: true,
        message: `Profile marked complete but Webflow sync failed: ${syncResult.error}. May need manual sync.`
      };
    }

    return {
      success: true,
      message: `Profile completed and synced to Webflow. Webflow ID: ${syncResult.webflow_id || 'pending'}`
    };
  } catch (syncError) {
    return {
      success: true,
      message: `Profile marked complete but Webflow sync error: ${syncError.message}. May need manual sync.`
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));

    // Complete profile mode
    if (body.mode === 'complete-profile' && body.email) {
      const result = await completeProfile(body.email);
      return new Response(
        JSON.stringify(result),
        { status: result.success ? 200 : 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Publish Webflow item mode
    if (body.mode === 'publish-webflow' && body.webflow_id) {
      const result = await checkAndPublishWebflow(body.webflow_id);
      return new Response(
        JSON.stringify(result),
        { status: result.success ? 200 : 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Query members by memberstack_id
    if (body.mode === 'query-by-memberstack' && body.memberstack_ids) {
      const { data: members, error } = await supabase
        .from('members')
        .select('memberstack_id, webflow_id, first_name, last_name, email')
        .in('memberstack_id', body.memberstack_ids);

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, members }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Query projects mode
    if (body.mode === 'query-projects') {
      let query = supabase.from('projects').select('id, name, webflow_id, slug, is_deleted, created_at, memberstack_id');

      if (body.memberstack_id) {
        query = query.eq('memberstack_id', body.memberstack_id);
      }
      if (body.project_ids) {
        query = query.in('id', body.project_ids);
      }

      const { data: projects, error } = await query;

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, projects }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fix a single project's member link
    if (body.mode === 'fix-project-member' && body.project_webflow_id && body.member_webflow_id) {
      if (!WEBFLOW_API_TOKEN) {
        return new Response(
          JSON.stringify({ success: false, error: 'WEBFLOW_API_TOKEN not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const WEBFLOW_PROJECTS_COLLECTION_ID = '64aa150f02bee661d503cf59';

      const response = await fetch(
        `https://api.webflow.com/v2/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/${body.project_webflow_id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fieldData: {
              'webflow-member-id': body.member_webflow_id,
              'member': body.member_webflow_id,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return new Response(
          JSON.stringify({ success: false, error }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Publish the project
      await fetch(
        `https://api.webflow.com/v2/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/publish`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemIds: [body.project_webflow_id] }),
        }
      );

      return new Response(
        JSON.stringify({ success: true, message: 'Project linked to member and published' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fix orphaned projects mode (link projects to their members in Webflow)
    if (body.mode === 'fix-orphaned-projects') {
      if (!WEBFLOW_API_TOKEN) {
        return new Response(
          JSON.stringify({ success: false, error: 'WEBFLOW_API_TOKEN not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const WEBFLOW_PROJECTS_COLLECTION_ID = '64aa150f02bee661d503cf59';

      // Get all projects that have a webflow_id
      const { data: projects, error: projError } = await supabase
        .from('projects')
        .select('id, name, webflow_id, memberstack_id')
        .not('webflow_id', 'is', null)
        .eq('is_deleted', false);

      if (projError) {
        return new Response(
          JSON.stringify({ success: false, error: projError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const results: Array<{ project: string; status: string }> = [];

      for (const project of projects || []) {
        // Get member's webflow_id
        const { data: member } = await supabase
          .from('members')
          .select('webflow_id, first_name, last_name')
          .eq('memberstack_id', project.memberstack_id)
          .single();

        if (!member?.webflow_id) {
          results.push({ project: project.name, status: 'Member has no webflow_id yet' });
          continue;
        }

        // Update project in Webflow
        const response = await fetch(
          `https://api.webflow.com/v2/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/${project.webflow_id}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fieldData: {
                'webflow-member-id': member.webflow_id,
                'member': member.webflow_id,
              },
            }),
          }
        );

        if (response.ok) {
          // Publish the project
          await fetch(
            `https://api.webflow.com/v2/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/publish`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ itemIds: [project.webflow_id] }),
            }
          );
          results.push({ project: project.name, status: `Linked to ${member.first_name} ${member.last_name}` });
        } else {
          const error = await response.text();
          results.push({ project: project.name, status: `Error: ${error}` });
        }
      }

      return new Response(
        JSON.stringify({ success: true, results }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Delete Webflow project mode (for cleanup)
    if (body.mode === 'delete-webflow-project' && body.webflow_id) {
      if (!WEBFLOW_API_TOKEN) {
        return new Response(
          JSON.stringify({ success: false, error: 'WEBFLOW_API_TOKEN not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const WEBFLOW_PROJECTS_COLLECTION_ID = '64aa150f02bee661d503cf59';
      const response = await fetch(
        `https://api.webflow.com/v2/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/${body.webflow_id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${WEBFLOW_API_TOKEN}` }
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return new Response(
          JSON.stringify({ success: false, error }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: `Deleted Webflow project ${body.webflow_id}` }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Query mode
    const emails = body.emails || [];

    if (!emails.length) {
      return new Response(
        JSON.stringify({ success: false, error: 'No emails provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: members, error } = await supabase
      .from('members')
      .select(`
        id, email, first_name, last_name,
        subscription_status,
        profile_complete, profile_completed_at,
        onboarding_step, onboarding_started_at, onboarding_reminder_sent_at,
        bio, header_image_url, profile_image_url, slug,
        webflow_id, memberstack_id,
        created_at
      `)
      .in('email', emails);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, members }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
