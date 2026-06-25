// Supabase Edge Function: Subscription Reconciliation
// Runs daily to catch any mismatches between Memberstack and Supabase subscription statuses
// Automatically fixes discrepancies and restores members/projects that should be active
//
// Trigger: Scheduled via cron or manual invocation
// POST {} - Run reconciliation and fix any issues

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendEmail, FROM_SUPPORT } from '../_shared/gmail.ts';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const MEMBERSTACK_API_KEY = Deno.env.get('MEMBERSTACK_API_KEY') || '';
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'support@mtnsmade.com.au';

// Webflow config
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';
const WEBFLOW_MEMBERS_COLLECTION_ID = '64a938756620ae4bee88df34';
const WEBFLOW_PROJECTS_COLLECTION_ID = '64aa150f02bee661d503cf59';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface MemberstackMember {
  id: string;
  auth: { email: string };
  planConnections?: Array<{ status: string; planName?: string }>;
  customFields?: Record<string, string>;
}

interface SupabaseMember {
  id: string;
  memberstack_id: string;
  email: string | null;
  name: string | null;
  subscription_status: string;
  webflow_id: string | null;
  profile_complete: boolean;
}

interface ReconciliationFix {
  memberstackId: string;
  email: string;
  name: string | null;
  issue: string;
  action: string;
  success: boolean;
  error?: string;
}

function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// Fetch all members from Memberstack
async function fetchMemberstackMembers(): Promise<MemberstackMember[]> {
  if (!MEMBERSTACK_API_KEY) {
    throw new Error('MEMBERSTACK_API_KEY not configured');
  }

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
      method: 'GET',
      headers: {
        'X-API-KEY': MEMBERSTACK_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Memberstack API error: ${response.status} - ${errorText}`);
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
    .select('id, memberstack_id, email, name, subscription_status, webflow_id, profile_complete')
    .eq('is_deleted', false);

  if (error) throw error;
  return data || [];
}

// Update subscription status in Supabase
async function updateSubscriptionStatus(memberstackId: string, status: string): Promise<void> {
  const supabase = getSupabaseClient();
  const updateData: Record<string, unknown> = {
    subscription_status: status,
  };

  if (status === 'active') {
    updateData.subscription_lapsed_at = null;
  } else if (status === 'lapsed') {
    updateData.subscription_lapsed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('members')
    .update(updateData)
    .eq('memberstack_id', memberstackId);

  if (error) throw error;
}

// Unarchive member in Webflow
async function unarchiveInWebflow(webflowId: string): Promise<void> {
  if (!WEBFLOW_API_TOKEN) return;

  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/${webflowId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isArchived: false }),
    }
  );

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text();
    throw new Error(`Webflow unarchive error: ${response.status} - ${errorText}`);
  }

  // Publish the change
  await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/publish`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemIds: [webflowId] }),
    }
  );
}

// Unarchive all projects for a member
async function unarchiveMemberProjects(memberstackId: string): Promise<number> {
  if (!WEBFLOW_API_TOKEN) return 0;

  const supabase = getSupabaseClient();
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, webflow_id')
    .eq('memberstack_id', memberstackId)
    .not('webflow_id', 'is', null)
    .eq('is_deleted', false);

  if (error || !projects || projects.length === 0) return 0;

  const projectIdsToPublish: string[] = [];

  for (const project of projects) {
    try {
      const response = await fetch(
        `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/${project.webflow_id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isArchived: false, isDraft: false }),
        }
      );

      if (response.ok) {
        projectIdsToPublish.push(project.webflow_id);
      }
    } catch (err) {
      console.error('Error unarchiving project:', project.name, err);
    }
  }

  // Publish all unarchived projects
  if (projectIdsToPublish.length > 0) {
    await fetch(
      `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/publish`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemIds: projectIdsToPublish }),
      }
    );
  }

  return projectIdsToPublish.length;
}

// Log activity
async function logActivity(memberstackId: string, activityType: string): Promise<void> {
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/log-activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberstack_id: memberstackId,
        activity_type: activityType,
      }),
    });
  } catch (error) {
    console.warn('Failed to log activity:', error);
  }
}

// Send reconciliation report email
async function sendReconciliationReport(fixes: ReconciliationFix[]): Promise<void> {
  if (fixes.length === 0) return;

  const successfulFixes = fixes.filter(f => f.success);
  const failedFixes = fixes.filter(f => !f.success);

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Subscription Reconciliation Report</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
    <h2 style="margin: 0 0 20px; color: #333;">Subscription Reconciliation Report</h2>
    <p style="color: #666;">The daily reconciliation job found and fixed ${successfulFixes.length} subscription mismatches.</p>

    ${successfulFixes.length > 0 ? `
    <h3 style="color: #28a745; margin-top: 30px;">✓ Fixed (${successfulFixes.length})</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <tr style="background: #f8f9fa;">
        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #dee2e6;">Member</th>
        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #dee2e6;">Issue</th>
        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #dee2e6;">Action</th>
      </tr>
      ${successfulFixes.map(fix => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${fix.name || fix.email}</td>
        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${fix.issue}</td>
        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${fix.action}</td>
      </tr>
      `).join('')}
    </table>
    ` : ''}

    ${failedFixes.length > 0 ? `
    <h3 style="color: #dc3545; margin-top: 30px;">✗ Failed (${failedFixes.length})</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <tr style="background: #f8f9fa;">
        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #dee2e6;">Member</th>
        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #dee2e6;">Error</th>
      </tr>
      ${failedFixes.map(fix => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${fix.name || fix.email}</td>
        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${fix.error}</td>
      </tr>
      `).join('')}
    </table>
    ` : ''}

    <p style="color: #999; font-size: 12px; margin-top: 30px;">
      Generated at ${new Date().toISOString()}
    </p>
  </div>
</body>
</html>
`;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `[MTNS MADE] Subscription Reconciliation: ${successfulFixes.length} fixes applied`,
    html: emailHtml,
    from: FROM_SUPPORT,
  });
}

// Main reconciliation logic
async function runReconciliation(): Promise<{ fixes: ReconciliationFix[]; summary: string }> {
  console.log('Starting subscription reconciliation...');

  const fixes: ReconciliationFix[] = [];

  // Fetch all members from both systems
  const [memberstackMembers, supabaseMembers] = await Promise.all([
    fetchMemberstackMembers(),
    fetchSupabaseMembers(),
  ]);

  console.log(`Fetched ${memberstackMembers.length} Memberstack members, ${supabaseMembers.length} Supabase members`);

  // Create lookup maps
  const supabaseByMemberstackId = new Map<string, SupabaseMember>();
  for (const member of supabaseMembers) {
    if (member.memberstack_id) {
      supabaseByMemberstackId.set(member.memberstack_id, member);
    }
  }

  // Check each Memberstack member
  for (const msMember of memberstackMembers) {
    // Check for ACTIVE or TRIALING status (both are valid paying states)
    const hasActivePlan = msMember.planConnections?.some(
      p => p.status === 'ACTIVE' || p.status === 'TRIALING'
    ) ?? false;
    const msStatus = hasActivePlan ? 'active' : 'lapsed';
    const supabaseMember = supabaseByMemberstackId.get(msMember.id);

    if (!supabaseMember) {
      // Member exists in Memberstack but not Supabase - skip (handled by webhook)
      continue;
    }

    const sbStatus = supabaseMember.subscription_status;

    // ONLY restore members from lapsed to active (safe direction)
    // We do NOT automatically lapse active members - that's too dangerous
    // If Memberstack API has a glitch or incomplete data, we don't want to break active members
    if (msStatus === 'active' && sbStatus === 'lapsed') {
      console.log(`Found mismatch: ${supabaseMember.email} - MS: active, SB: lapsed`);

      const fix: ReconciliationFix = {
        memberstackId: msMember.id,
        email: supabaseMember.email || msMember.auth.email,
        name: supabaseMember.name,
        issue: 'Memberstack shows ACTIVE but Supabase shows lapsed',
        action: 'Restored to active',
        success: false,
      };

      try {
        // Update Supabase status
        await updateSubscriptionStatus(msMember.id, 'active');

        // Unarchive in Webflow if has profile
        if (supabaseMember.webflow_id) {
          await unarchiveInWebflow(supabaseMember.webflow_id);
          fix.action += ', unarchived profile';
        }

        // Unarchive projects
        const projectsRestored = await unarchiveMemberProjects(msMember.id);
        if (projectsRestored > 0) {
          fix.action += `, restored ${projectsRestored} projects`;
        }

        // Log activity
        await logActivity(msMember.id, 'subscription_reconciled');

        fix.success = true;
        console.log(`Fixed: ${supabaseMember.email}`);
      } catch (err) {
        fix.error = err instanceof Error ? err.message : String(err);
        console.error(`Failed to fix ${supabaseMember.email}:`, err);
      }

      fixes.push(fix);
    }

    // Log potential issues where MS shows lapsed but SB shows active
    // But do NOT automatically change - just report for manual review
    if (msStatus === 'lapsed' && sbStatus === 'active') {
      console.log(`INFO: ${supabaseMember.email} - MS: lapsed, SB: active - NOT auto-fixing (manual review needed)`);
      // Don't add to fixes - this needs manual review, not auto-fix
    }
  }

  // Send report if any fixes were made
  if (fixes.length > 0) {
    await sendReconciliationReport(fixes);
  }

  const summary = `Reconciliation complete. Found ${fixes.length} mismatches, fixed ${fixes.filter(f => f.success).length}.`;
  console.log(summary);

  return { fixes, summary };
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
      headers: corsHeaders,
    });
  }

  try {
    const result = await runReconciliation();

    return new Response(
      JSON.stringify({
        success: true,
        summary: result.summary,
        fixes: result.fixes,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Reconciliation error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
