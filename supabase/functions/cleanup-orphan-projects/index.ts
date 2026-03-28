/**
 * MTNS MADE - Cleanup Orphan Projects
 * Reconciles projects between Webflow and Supabase
 *
 * Actions:
 * - Deletes Webflow projects for lapsed/cancelled/unknown members
 * - Imports orphaned projects from active members into Supabase
 *
 * Run modes:
 * - POST { mode: 'dry-run' } - Report what would be done (default)
 * - POST { mode: 'execute' } - Actually perform cleanup
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN')!;

const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';
const WEBFLOW_SITE_ID = '64229aff3da29012f062753c';
const WEBFLOW_PROJECTS_COLLECTION = '64aa150f02bee661d503cf59';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface WebflowProject {
  id: string;
  fieldData: {
    name: string;
    slug: string;
    'memberstack-id'?: string;
    'supabase-id'?: string;
    member?: string;
    'project-description'?: string;
    'feature-image'?: { url: string };
    'project-multi-image'?: Array<{ url: string }>;
  };
}

interface CleanupResult {
  mode: string;
  webflowTotal: number;
  supabaseTotal: number;
  orphanedProjects: number;
  toDelete: Array<{ id: string; name: string; reason: string; memberName?: string }>;
  toImport: Array<{ id: string; name: string; memberName: string }>;
  deleted: number;
  imported: number;
  errors: string[];
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Fetch all projects from Webflow (handles pagination)
async function fetchAllWebflowProjects(): Promise<WebflowProject[]> {
  const allProjects: WebflowProject[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await fetch(
      `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION}/items?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Webflow API error: ${response.status}`);
    }

    const data = await response.json();
    allProjects.push(...data.items);

    if (data.items.length < limit || offset + limit >= data.pagination.total) {
      break;
    }

    offset += limit;
  }

  return allProjects;
}

// Get all Supabase projects (webflow_ids and names for duplicate detection)
interface SupabaseProjectInfo {
  webflowIds: Set<string>;
  projectsByMember: Map<string, Set<string>>; // memberstack_id -> Set of project names
}

async function getSupabaseProjectInfo(): Promise<SupabaseProjectInfo> {
  const { data, error } = await supabase
    .from('projects')
    .select('webflow_id, name, memberstack_id')
    .not('webflow_id', 'is', null);

  if (error) {
    throw new Error(`Supabase query error: ${error.message}`);
  }

  const webflowIds = new Set<string>();
  const projectsByMember = new Map<string, Set<string>>();

  for (const p of data || []) {
    if (p.webflow_id) {
      webflowIds.add(p.webflow_id);
    }
    if (p.memberstack_id && p.name) {
      if (!projectsByMember.has(p.memberstack_id)) {
        projectsByMember.set(p.memberstack_id, new Set());
      }
      projectsByMember.get(p.memberstack_id)!.add(p.name.toLowerCase());
    }
  }

  return { webflowIds, projectsByMember };
}

// Get member status by memberstack_id
async function getMemberStatuses(): Promise<Map<string, { status: string; name: string; id: string; isDeleted: boolean }>> {
  const { data, error } = await supabase
    .from('members')
    .select('id, memberstack_id, name, first_name, last_name, subscription_status, is_deleted');

  if (error) {
    throw new Error(`Supabase query error: ${error.message}`);
  }

  const statusMap = new Map();
  for (const member of data || []) {
    if (member.memberstack_id) {
      statusMap.set(member.memberstack_id, {
        status: member.subscription_status || 'unknown',
        name: member.name || `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unknown',
        id: member.id,
        isDeleted: member.is_deleted || false,
      });
    }
  }

  return statusMap;
}

// Delete project from Webflow
async function deleteWebflowProject(projectId: string): Promise<boolean> {
  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION}/items/${projectId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json',
      },
    }
  );

  return response.ok;
}

// Import project from Webflow to Supabase
async function importProjectToSupabase(
  webflowProject: WebflowProject,
  memberId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        member_id: memberId,
        name: webflowProject.fieldData.name,
        slug: webflowProject.fieldData.slug,
        description: webflowProject.fieldData['project-description'] || '',
        feature_image_url: webflowProject.fieldData['feature-image']?.url || null,
        webflow_id: webflowProject.id,
        is_archived: false,
      })
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
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
    const body = await req.json().catch(() => ({}));
    const mode = body.mode || 'dry-run';
    const execute = mode === 'execute';

    console.log(`Running cleanup in ${mode} mode`);

    const result: CleanupResult = {
      mode,
      webflowTotal: 0,
      supabaseTotal: 0,
      orphanedProjects: 0,
      toDelete: [],
      toImport: [],
      deleted: 0,
      imported: 0,
      errors: [],
    };

    // Fetch data from both systems
    console.log('Fetching Webflow projects...');
    const webflowProjects = await fetchAllWebflowProjects();
    result.webflowTotal = webflowProjects.length;

    console.log('Fetching Supabase project info...');
    const supabaseInfo = await getSupabaseProjectInfo();
    result.supabaseTotal = supabaseInfo.webflowIds.size;

    console.log('Fetching member statuses...');
    const memberStatuses = await getMemberStatuses();

    // Find orphaned projects (in Webflow but not Supabase by webflow_id)
    const orphanedProjects = webflowProjects.filter(p => !supabaseInfo.webflowIds.has(p.id));
    result.orphanedProjects = orphanedProjects.length;

    console.log(`Found ${orphanedProjects.length} orphaned projects`);

    // Helper to check if project is a duplicate (same name exists for member in Supabase)
    const isDuplicate = (memberstackId: string, projectName: string): boolean => {
      const memberProjects = supabaseInfo.projectsByMember.get(memberstackId);
      if (!memberProjects) return false;
      return memberProjects.has(projectName.toLowerCase());
    };

    // Categorize orphaned projects
    for (const project of orphanedProjects) {
      const memberstackId = project.fieldData['memberstack-id'];

      if (!memberstackId) {
        // No member reference - test data
        result.toDelete.push({
          id: project.id,
          name: project.fieldData.name,
          reason: 'no_member_reference',
        });
        continue;
      }

      const memberInfo = memberStatuses.get(memberstackId);

      if (!memberInfo) {
        // Member not in Supabase - legacy/cancelled
        result.toDelete.push({
          id: project.id,
          name: project.fieldData.name,
          reason: 'member_not_in_supabase',
        });
        continue;
      }

      if (memberInfo.isDeleted) {
        // Member is deleted
        result.toDelete.push({
          id: project.id,
          name: project.fieldData.name,
          reason: 'member_deleted',
          memberName: memberInfo.name,
        });
        continue;
      }

      // Check if this is a duplicate (same project name already exists with different webflow_id)
      if (isDuplicate(memberstackId, project.fieldData.name)) {
        result.toDelete.push({
          id: project.id,
          name: project.fieldData.name,
          reason: 'duplicate_webflow_item',
          memberName: memberInfo.name,
        });
        continue;
      }

      if (memberInfo.status === 'lapsed' || memberInfo.status === 'canceled') {
        // Member subscription lapsed or cancelled
        result.toDelete.push({
          id: project.id,
          name: project.fieldData.name,
          reason: `member_${memberInfo.status}`,
          memberName: memberInfo.name,
        });
        continue;
      }

      if (memberInfo.status === 'active' || memberInfo.status === 'trialing') {
        // Active member - import to Supabase
        result.toImport.push({
          id: project.id,
          name: project.fieldData.name,
          memberName: memberInfo.name,
        });
      }
    }

    console.log(`To delete: ${result.toDelete.length}, To import: ${result.toImport.length}`);

    // Execute if not dry-run
    if (execute) {
      // Delete projects
      for (const project of result.toDelete) {
        try {
          const success = await deleteWebflowProject(project.id);
          if (success) {
            result.deleted++;
            console.log(`Deleted: ${project.name}`);
          } else {
            result.errors.push(`Failed to delete: ${project.name}`);
          }
        } catch (err) {
          result.errors.push(`Error deleting ${project.name}: ${err.message}`);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Import projects
      for (const project of result.toImport) {
        const webflowProject = orphanedProjects.find(p => p.id === project.id)!;
        const memberstackId = webflowProject.fieldData['memberstack-id']!;
        const memberInfo = memberStatuses.get(memberstackId)!;

        try {
          const importResult = await importProjectToSupabase(webflowProject, memberInfo.id);
          if (importResult.success) {
            result.imported++;
            console.log(`Imported: ${project.name}`);
          } else {
            result.errors.push(`Failed to import ${project.name}: ${importResult.error}`);
          }
        } catch (err) {
          result.errors.push(`Error importing ${project.name}: ${err.message}`);
        }
      }
    }

    return new Response(JSON.stringify(result, null, 2), {
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
