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
const MEMBERSTACK_API_KEY = Deno.env.get('MEMBERSTACK_API_KEY') || '';
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

    // Sync project slugs from Webflow to Supabase
    if (body.mode === 'sync-project-slugs') {
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
        .select('id, name, slug, webflow_id')
        .not('webflow_id', 'is', null)
        .eq('is_deleted', false);

      if (projError) {
        return new Response(
          JSON.stringify({ success: false, error: projError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const results: Array<{ project: string; oldSlug: string; newSlug: string; status: string }> = [];

      for (const project of projects || []) {
        try {
          // Get the actual slug from Webflow
          const response = await fetch(
            `https://api.webflow.com/v2/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/${project.webflow_id}`,
            {
              headers: { 'Authorization': `Bearer ${WEBFLOW_API_TOKEN}` }
            }
          );

          if (!response.ok) {
            results.push({
              project: project.name,
              oldSlug: project.slug || '',
              newSlug: '',
              status: `Error fetching from Webflow: ${response.status}`
            });
            continue;
          }

          const webflowItem = await response.json();
          const webflowSlug = webflowItem.fieldData?.slug;

          if (!webflowSlug) {
            results.push({
              project: project.name,
              oldSlug: project.slug || '',
              newSlug: '',
              status: 'No slug in Webflow'
            });
            continue;
          }

          if (webflowSlug === project.slug) {
            results.push({
              project: project.name,
              oldSlug: project.slug || '',
              newSlug: webflowSlug,
              status: 'Already in sync'
            });
            continue;
          }

          // Update Supabase with the Webflow slug
          const { error: updateError } = await supabase
            .from('projects')
            .update({ slug: webflowSlug })
            .eq('id', project.id);

          if (updateError) {
            results.push({
              project: project.name,
              oldSlug: project.slug || '',
              newSlug: webflowSlug,
              status: `Error updating: ${updateError.message}`
            });
          } else {
            results.push({
              project: project.name,
              oldSlug: project.slug || '',
              newSlug: webflowSlug,
              status: 'Updated'
            });
          }
        } catch (err) {
          results.push({
            project: project.name,
            oldSlug: project.slug || '',
            newSlug: '',
            status: `Error: ${err.message}`
          });
        }
      }

      return new Response(
        JSON.stringify({ success: true, results }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sync member slugs from Webflow to Supabase
    if (body.mode === 'sync-member-slugs') {
      if (!WEBFLOW_API_TOKEN) {
        return new Response(
          JSON.stringify({ success: false, error: 'WEBFLOW_API_TOKEN not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get all members that have a webflow_id
      const { data: members, error: memError } = await supabase
        .from('members')
        .select('id, name, slug, webflow_id')
        .not('webflow_id', 'is', null)
        .eq('is_deleted', false);

      if (memError) {
        return new Response(
          JSON.stringify({ success: false, error: memError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const results: Array<{ member: string; oldSlug: string; newSlug: string; status: string }> = [];

      for (const member of members || []) {
        try {
          // Get the actual slug from Webflow
          const response = await fetch(
            `https://api.webflow.com/v2/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/${member.webflow_id}`,
            {
              headers: { 'Authorization': `Bearer ${WEBFLOW_API_TOKEN}` }
            }
          );

          if (!response.ok) {
            results.push({
              member: member.name || member.id,
              oldSlug: member.slug || '',
              newSlug: '',
              status: `Error fetching from Webflow: ${response.status}`
            });
            continue;
          }

          const webflowItem = await response.json();
          const webflowSlug = webflowItem.fieldData?.slug;

          if (!webflowSlug) {
            results.push({
              member: member.name || member.id,
              oldSlug: member.slug || '',
              newSlug: '',
              status: 'No slug in Webflow'
            });
            continue;
          }

          if (webflowSlug === member.slug) {
            results.push({
              member: member.name || member.id,
              oldSlug: member.slug || '',
              newSlug: webflowSlug,
              status: 'Already in sync'
            });
            continue;
          }

          // Update Supabase with the Webflow slug
          const { error: updateError } = await supabase
            .from('members')
            .update({ slug: webflowSlug })
            .eq('id', member.id);

          if (updateError) {
            results.push({
              member: member.name || member.id,
              oldSlug: member.slug || '',
              newSlug: webflowSlug,
              status: `Error updating: ${updateError.message}`
            });
          } else {
            results.push({
              member: member.name || member.id,
              oldSlug: member.slug || '',
              newSlug: webflowSlug,
              status: 'Updated'
            });
          }
        } catch (err) {
          results.push({
            member: member.name || member.id,
            oldSlug: member.slug || '',
            newSlug: '',
            status: `Error: ${err.message}`
          });
        }
      }

      return new Response(
        JSON.stringify({ success: true, results }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Memberstack member data
    if (body.mode === 'get-memberstack' && body.memberstack_id) {
      if (!MEMBERSTACK_API_KEY) {
        return new Response(
          JSON.stringify({ success: false, error: 'MEMBERSTACK_API_KEY not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch(
        `https://admin.memberstack.com/members/${body.memberstack_id}`,
        {
          headers: {
            'X-API-KEY': MEMBERSTACK_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return new Response(
          JSON.stringify({ success: false, error: `Memberstack API error: ${error}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const memberstackData = await response.json();
      return new Response(
        JSON.stringify({ success: true, memberstack: memberstackData }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find and create missing members from Memberstack (by email)
    if (body.mode === 'create-missing-members' && body.emails && Array.isArray(body.emails)) {
      if (!MEMBERSTACK_API_KEY) {
        return new Response(
          JSON.stringify({ success: false, error: 'MEMBERSTACK_API_KEY not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const results: Array<{ email: string; status: string; memberstackId?: string }> = [];

      // Fetch all Memberstack members (paginated)
      const allMsMembers: Array<{ id: string; auth: { email: string }; customFields?: Record<string, string>; planConnections?: Array<{ status: string }> }> = [];
      let hasNextPage = true;
      let endCursor: string | undefined;

      while (hasNextPage) {
        const url = new URL('https://admin.memberstack.com/members');
        url.searchParams.set('limit', '100');
        if (endCursor) url.searchParams.set('after', endCursor);

        const resp = await fetch(url.toString(), {
          headers: { 'X-API-KEY': MEMBERSTACK_API_KEY, 'Content-Type': 'application/json' }
        });

        if (!resp.ok) break;
        const data = await resp.json();
        allMsMembers.push(...(data.data || []));
        if (data.hasNextPage && data.data?.length > 0) {
          endCursor = data.endCursor || data.data[data.data.length - 1].id;
        } else {
          hasNextPage = false;
        }
      }

      // Find requested emails in Memberstack
      const emailsLower = body.emails.map((e: string) => e.toLowerCase());
      const msMembers = allMsMembers.filter(m => emailsLower.includes(m.auth.email.toLowerCase()));

      for (const msMember of msMembers) {
        // Check if already in Supabase
        const { data: existing } = await supabase
          .from('members')
          .select('id')
          .eq('memberstack_id', msMember.id)
          .single();

        if (existing) {
          results.push({ email: msMember.auth.email, status: 'Already exists', memberstackId: msMember.id });
          continue;
        }

        // Create the member
        const cf = msMember.customFields || {};
        const firstName = cf['first-name'] || '';
        const lastName = cf['last-name'] || '';
        const displayName = [firstName, lastName].filter(Boolean).join(' ') || null;
        const slug = cf['slug'] || (displayName ? displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : null);

        let suburbId: string | null = null;
        if (cf['suburb']) {
          const { data: suburb } = await supabase.from('suburbs').select('id').eq('name', cf['suburb']).single();
          suburbId = suburb?.id || null;
        }

        const hasActivePlan = (msMember.planConnections || []).some(
          (p: { status: string }) => p.status === 'ACTIVE' || p.status === 'TRIALING'
        );

        const { error: createError } = await supabase.from('members').insert({
          memberstack_id: msMember.id,
          email: msMember.auth.email,
          first_name: firstName || null,
          last_name: lastName || null,
          name: displayName,
          slug: slug,
          suburb_id: suburbId,
          subscription_status: hasActivePlan ? 'active' : 'pending',
          profile_complete: false,
          is_deleted: false,
        });

        if (createError) {
          results.push({ email: msMember.auth.email, status: `Error: ${createError.message}`, memberstackId: msMember.id });
        } else {
          results.push({ email: msMember.auth.email, status: 'Created', memberstackId: msMember.id });
        }
      }

      // Report emails not found in Memberstack
      for (const email of body.emails) {
        if (!msMembers.some(m => m.auth.email.toLowerCase() === email.toLowerCase())) {
          results.push({ email, status: 'Not found in Memberstack' });
        }
      }

      return new Response(
        JSON.stringify({ success: true, results }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create member from Memberstack data (for webhook failures)
    if (body.mode === 'create-from-memberstack' && body.memberstack_id) {
      if (!MEMBERSTACK_API_KEY) {
        return new Response(
          JSON.stringify({ success: false, error: 'MEMBERSTACK_API_KEY not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if member already exists
      const { data: existing } = await supabase
        .from('members')
        .select('id')
        .eq('memberstack_id', body.memberstack_id)
        .single();

      if (existing) {
        return new Response(
          JSON.stringify({ success: false, error: 'Member already exists in Supabase' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Fetch from Memberstack
      const msResponse = await fetch(
        `https://admin.memberstack.com/members/${body.memberstack_id}`,
        {
          headers: {
            'X-API-KEY': MEMBERSTACK_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!msResponse.ok) {
        const error = await msResponse.text();
        return new Response(
          JSON.stringify({ success: false, error: `Memberstack API error: ${error}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const msData = await msResponse.json();
      const member = msData.data;
      const cf = member.customFields || {};

      // Look up suburb ID if suburb name provided
      let suburbId: string | null = null;
      if (cf['suburb']) {
        const { data: suburb } = await supabase
          .from('suburbs')
          .select('id')
          .eq('name', cf['suburb'])
          .single();
        suburbId = suburb?.id || null;
      }

      // Build name and slug
      const firstName = cf['first-name'] || '';
      const lastName = cf['last-name'] || '';
      const displayName = [firstName, lastName].filter(Boolean).join(' ') || null;
      const slug = cf['slug'] ||
        (displayName ? displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : null);

      // Determine status (ACTIVE or TRIALING both count as active)
      const planConnections = member.planConnections || [];
      const hasActivePlan = planConnections.some(
        (p: { status: string }) => p.status === 'ACTIVE' || p.status === 'TRIALING'
      );

      // Create the member
      const { data: newMember, error: createError } = await supabase
        .from('members')
        .insert({
          memberstack_id: body.memberstack_id,
          email: member.auth?.email,
          first_name: firstName || null,
          last_name: lastName || null,
          name: displayName,
          slug: slug,
          suburb_id: suburbId,
          subscription_status: hasActivePlan ? 'active' : 'pending',
          profile_complete: false,
          is_deleted: false,
        })
        .select()
        .single();

      if (createError) {
        return new Response(
          JSON.stringify({ success: false, error: createError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, member: newMember }),
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
