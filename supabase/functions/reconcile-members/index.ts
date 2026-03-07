// Supabase Edge Function: Member Reconciliation
// Synchronizes member data across Memberstack, Supabase, and Webflow
// Modes:
//   - dry-run (default): Report what would be changed
//   - execute: Actually make the changes

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const MEMBERSTACK_API_KEY = Deno.env.get('MEMBERSTACK_API_KEY') || '';
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';

// Webflow config
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';
const WEBFLOW_MEMBERS_COLLECTION_ID = '64a938756620ae4bee88df34';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface MemberstackMember {
  id: string;
  auth: { email: string };
  planConnections?: Array<{ status: string }>;
}

interface SupabaseMember {
  id: string;
  memberstack_id: string;
  webflow_id: string | null;
  email: string | null;
  name: string | null;
  subscription_status: string;
  is_deleted: boolean;
  profile_complete: boolean;
}

interface WebflowMember {
  id: string;
  fieldData: {
    'memberstack-id'?: string;
    'email-address'?: string;
    name?: string;
  };
  isArchived: boolean;
  isDraft: boolean;
}

interface ReconciliationResult {
  mode: string;
  timestamp: string;
  summary: {
    memberstack_total: number;
    supabase_total: number;
    webflow_total: number;
  };
  actions: {
    supabase_to_delete: Array<{ id: string; email: string | null; reason: string }>;
    supabase_to_update_status: Array<{ id: string; email: string | null; from: string; to: string }>;
    webflow_to_archive: Array<{ id: string; name: string | null; reason: string }>;
    webflow_to_unarchive: Array<{ id: string; name: string | null; reason: string }>;
    webflow_to_publish: Array<{ id: string; name: string | null; reason: string }>;
  };
  executed: {
    supabase_deleted: number;
    supabase_status_updated: number;
    webflow_archived: number;
    webflow_unarchived: number;
    webflow_published: number;
    errors: string[];
  };
}

function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// Fetch all members from Memberstack
async function fetchMemberstackMembers(): Promise<MemberstackMember[]> {
  const allMembers: MemberstackMember[] = [];
  let hasNextPage = true;
  let endCursor: string | undefined;

  while (hasNextPage) {
    const url = new URL('https://admin.memberstack.com/members');
    url.searchParams.set('limit', '100');
    if (endCursor) {
      url.searchParams.set('after', endCursor);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'X-API-KEY': MEMBERSTACK_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Memberstack API error: ${response.status}`);
    }

    const data = await response.json();
    const members = data.data || [];
    allMembers.push(...members);

    if (data.hasNextPage && members.length > 0) {
      endCursor = data.endCursor || members[members.length - 1].id;
    } else {
      hasNextPage = false;
    }
  }

  return allMembers;
}

// Fetch all members from Supabase
async function fetchSupabaseMembers(): Promise<SupabaseMember[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('members')
    .select('id, memberstack_id, webflow_id, email, name, subscription_status, is_deleted, profile_complete');

  if (error) throw error;
  return data || [];
}

// Fetch all members from Webflow
async function fetchWebflowMembers(): Promise<WebflowMember[]> {
  const allItems: WebflowMember[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await fetch(
      `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items?limit=${limit}&offset=${offset}`,
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
    const items = data.items || [];
    allItems.push(...items);

    if (items.length < limit) break;
    offset += limit;
  }

  return allItems;
}

// Check if Memberstack member is active
function isMemberstackActive(member: MemberstackMember): boolean {
  return member.planConnections?.some(p => p.status === 'ACTIVE') || false;
}

// Archive a Webflow member
async function archiveWebflowMember(webflowId: string): Promise<void> {
  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/${webflowId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({ isArchived: true }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to archive ${webflowId}: ${error}`);
  }
}

// Unarchive a Webflow member
async function unarchiveWebflowMember(webflowId: string): Promise<void> {
  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/${webflowId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({ isArchived: false }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to unarchive ${webflowId}: ${error}`);
  }
}

// Publish a Webflow member (make live)
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
      body: JSON.stringify({ itemIds: [webflowId] }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to publish ${webflowId}: ${error}`);
  }
}

// Main reconciliation logic
async function reconcile(execute: boolean): Promise<ReconciliationResult> {
  console.log(`Starting reconciliation (mode: ${execute ? 'execute' : 'dry-run'})...`);

  // Fetch data from all systems
  const [memberstackMembers, supabaseMembers, webflowMembers] = await Promise.all([
    fetchMemberstackMembers(),
    fetchSupabaseMembers(),
    fetchWebflowMembers(),
  ]);

  console.log(`Fetched: Memberstack=${memberstackMembers.length}, Supabase=${supabaseMembers.length}, Webflow=${webflowMembers.length}`);

  // Build lookup maps
  const memberstackById = new Map(memberstackMembers.map(m => [m.id, m]));
  const memberstackIds = new Set(memberstackMembers.map(m => m.id));

  const supabaseByMemberstackId = new Map(supabaseMembers.map(m => [m.memberstack_id, m]));

  const webflowByMemberstackId = new Map<string, WebflowMember>();
  for (const wf of webflowMembers) {
    const msId = wf.fieldData?.['memberstack-id'];
    if (msId) {
      webflowByMemberstackId.set(msId, wf);
    }
  }

  const result: ReconciliationResult = {
    mode: execute ? 'execute' : 'dry-run',
    timestamp: new Date().toISOString(),
    summary: {
      memberstack_total: memberstackMembers.length,
      supabase_total: supabaseMembers.length,
      webflow_total: webflowMembers.length,
    },
    actions: {
      supabase_to_delete: [],
      supabase_to_update_status: [],
      webflow_to_archive: [],
      webflow_to_unarchive: [],
      webflow_to_publish: [],
    },
    executed: {
      supabase_deleted: 0,
      supabase_status_updated: 0,
      webflow_archived: 0,
      webflow_unarchived: 0,
      webflow_published: 0,
      errors: [],
    },
  };

  const supabase = getSupabaseClient();

  // 1. Find Supabase members not in Memberstack (orphaned)
  for (const sbMember of supabaseMembers) {
    if (sbMember.is_deleted) continue; // Already deleted

    if (!memberstackIds.has(sbMember.memberstack_id)) {
      result.actions.supabase_to_delete.push({
        id: sbMember.id,
        email: sbMember.email,
        reason: 'Not found in Memberstack',
      });

      if (execute) {
        try {
          await supabase
            .from('members')
            .update({ is_deleted: true, subscription_status: 'cancelled' })
            .eq('id', sbMember.id);
          result.executed.supabase_deleted++;
        } catch (e) {
          result.executed.errors.push(`Failed to soft-delete Supabase ${sbMember.id}: ${e}`);
        }
      }
    }
  }

  // 2. Update Supabase subscription status based on Memberstack
  for (const sbMember of supabaseMembers) {
    if (sbMember.is_deleted) continue;

    const msMember = memberstackById.get(sbMember.memberstack_id);
    if (!msMember) continue;

    const isActive = isMemberstackActive(msMember);
    const expectedStatus = isActive ? 'active' : 'lapsed';

    if (sbMember.subscription_status !== expectedStatus) {
      result.actions.supabase_to_update_status.push({
        id: sbMember.id,
        email: sbMember.email,
        from: sbMember.subscription_status,
        to: expectedStatus,
      });

      if (execute) {
        try {
          await supabase
            .from('members')
            .update({ subscription_status: expectedStatus })
            .eq('id', sbMember.id);
          result.executed.supabase_status_updated++;
        } catch (e) {
          result.executed.errors.push(`Failed to update status for ${sbMember.id}: ${e}`);
        }
      }
    }
  }

  // 3. Archive Webflow members that are lapsed/cancelled in Memberstack
  for (const wfMember of webflowMembers) {
    const msId = wfMember.fieldData?.['memberstack-id'];
    if (!msId) continue;

    const msMember = memberstackById.get(msId);
    const sbMember = supabaseByMemberstackId.get(msId);

    // If not in Memberstack or not active, should be archived
    const shouldBeArchived = !msMember || !isMemberstackActive(msMember);

    if (shouldBeArchived && !wfMember.isArchived) {
      result.actions.webflow_to_archive.push({
        id: wfMember.id,
        name: wfMember.fieldData?.name || null,
        reason: !msMember ? 'Not found in Memberstack' : 'Memberstack subscription inactive',
      });

      if (execute) {
        try {
          await archiveWebflowMember(wfMember.id);
          result.executed.webflow_archived++;
          await new Promise(r => setTimeout(r, 200)); // Rate limit
        } catch (e) {
          result.executed.errors.push(`Failed to archive Webflow ${wfMember.id}: ${e}`);
        }
      }
    }

    // If active in Memberstack but archived in Webflow, should be unarchived
    if (!shouldBeArchived && wfMember.isArchived) {
      result.actions.webflow_to_unarchive.push({
        id: wfMember.id,
        name: wfMember.fieldData?.name || null,
        reason: 'Memberstack subscription is active',
      });

      if (execute) {
        try {
          await unarchiveWebflowMember(wfMember.id);
          result.executed.webflow_unarchived++;
          await new Promise(r => setTimeout(r, 200)); // Rate limit
        } catch (e) {
          result.executed.errors.push(`Failed to unarchive Webflow ${wfMember.id}: ${e}`);
        }
      }
    }

    // If active with complete profile but in draft, should be published
    if (!shouldBeArchived && sbMember?.profile_complete && wfMember.isDraft && !wfMember.isArchived) {
      result.actions.webflow_to_publish.push({
        id: wfMember.id,
        name: wfMember.fieldData?.name || null,
        reason: 'Active member with complete profile should be live',
      });

      if (execute) {
        try {
          await publishWebflowMember(wfMember.id);
          result.executed.webflow_published++;
          await new Promise(r => setTimeout(r, 200)); // Rate limit
        } catch (e) {
          result.executed.errors.push(`Failed to publish Webflow ${wfMember.id}: ${e}`);
        }
      }
    }
  }

  console.log('Reconciliation complete:', {
    supabase_to_delete: result.actions.supabase_to_delete.length,
    supabase_to_update_status: result.actions.supabase_to_update_status.length,
    webflow_to_archive: result.actions.webflow_to_archive.length,
    webflow_to_unarchive: result.actions.webflow_to_unarchive.length,
    webflow_to_publish: result.actions.webflow_to_publish.length,
  });

  return result;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const execute = body.mode === 'execute';

    const result = await reconcile(execute);

    return new Response(JSON.stringify(result, null, 2), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Reconciliation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
