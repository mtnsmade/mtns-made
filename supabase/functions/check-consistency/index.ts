// Supabase Edge Function: Data Consistency Check
// Compares member data across Memberstack, Supabase, and Webflow
// Can be triggered manually or via cron job

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const MEMBERSTACK_API_KEY = Deno.env.get('MEMBERSTACK_API_KEY') || '';
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';
const RESEND_API_KEY = Deno.env.get('RESEND_API') || '';
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'support@mtnsmade.com.au';
const FROM_EMAIL = 'MTNS MADE <support@mail.mtnsmade.com.au>';

// Webflow config
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';
const WEBFLOW_MEMBERS_COLLECTION_ID = '64a938756620ae4bee88df34';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Types
interface MemberstackMember {
  id: string;
  auth: {
    email: string;
  };
  customFields?: {
    'first-name'?: string;
    'last-name'?: string;
    'webflow-member-id'?: string;
    'onboarding-complete'?: string | boolean;
  };
  planConnections?: Array<{
    status: string;
  }>;
}

interface SupabaseMember {
  id: string;
  memberstack_id: string;
  webflow_id: string | null;
  email: string | null;
  name: string | null;
  subscription_status: string;
  profile_complete: boolean;
  is_deleted: boolean;
}

interface WebflowMember {
  id: string;
  fieldData: {
    'memberstack-id'?: string;
    'email-address'?: string;
    name?: string;
  };
  isArchived?: boolean;
  isDraft?: boolean;
}

interface ConsistencyIssue {
  type: 'missing_supabase' | 'missing_webflow' | 'orphaned_supabase' | 'orphaned_webflow' | 'status_mismatch' | 'profile_mismatch';
  severity: 'critical' | 'warning' | 'info';
  memberstackId?: string;
  supabaseId?: string;
  webflowId?: string;
  email?: string;
  details: string;
}

interface ConsistencyReport {
  timestamp: string;
  summary: {
    memberstack_total: number;
    supabase_total: number;
    webflow_total: number;
    issues_critical: number;
    issues_warning: number;
    issues_info: number;
  };
  issues: ConsistencyIssue[];
}

// Initialize Supabase client
function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// Fetch all members from Memberstack
async function fetchMemberstackMembers(): Promise<MemberstackMember[]> {
  if (!MEMBERSTACK_API_KEY) {
    console.log('MEMBERSTACK_API_KEY not configured');
    return [];
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
      console.error('Memberstack API error:', response.status, errorText);
      throw new Error(`Memberstack API error: ${response.status}`);
    }

    const data = await response.json();
    const members = data.data || [];
    allMembers.push(...members);

    console.log(`Fetched page with ${members.length} members, total so far: ${allMembers.length}`);

    // Memberstack 2.0 uses hasNextPage and endCursor for pagination
    if (data.hasNextPage && members.length > 0) {
      // Use endCursor if provided, otherwise fall back to last member ID
      endCursor = data.endCursor || members[members.length - 1].id;
    } else {
      hasNextPage = false;
    }
  }

  console.log(`Fetched ${allMembers.length} total members from Memberstack`);
  return allMembers;
}

// Fetch all members from Supabase
async function fetchSupabaseMembers(): Promise<SupabaseMember[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('members')
    .select('id, memberstack_id, webflow_id, email, name, subscription_status, profile_complete, is_deleted');

  if (error) {
    console.error('Supabase query error:', error);
    throw error;
  }

  console.log(`Fetched ${data?.length || 0} members from Supabase`);
  return data || [];
}

// Fetch all members from Webflow
async function fetchWebflowMembers(): Promise<WebflowMember[]> {
  if (!WEBFLOW_API_TOKEN) {
    console.log('WEBFLOW_API_TOKEN not configured');
    return [];
  }

  const allItems: WebflowMember[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webflow API error:', response.status, errorText);
      throw new Error(`Webflow API error: ${response.status}`);
    }

    const data = await response.json();
    const items = data.items || [];
    allItems.push(...items);

    // Check for more pages
    if (items.length < limit) {
      hasMore = false;
    } else {
      offset += limit;
    }
  }

  console.log(`Fetched ${allItems.length} members from Webflow`);
  return allItems;
}

// Check if a Memberstack member is active (has active plan)
function isMemberstackActive(member: MemberstackMember): boolean {
  if (!member.planConnections || member.planConnections.length === 0) {
    return false;
  }
  return member.planConnections.some(p => p.status === 'ACTIVE');
}

// Run consistency check
async function runConsistencyCheck(): Promise<ConsistencyReport> {
  console.log('Starting consistency check...');

  // Fetch data from all three systems
  const [memberstackMembers, supabaseMembers, webflowMembers] = await Promise.all([
    fetchMemberstackMembers(),
    fetchSupabaseMembers(),
    fetchWebflowMembers(),
  ]);

  // Build lookup maps
  const supabaseByMemberstackId = new Map<string, SupabaseMember>();
  const supabaseByWebflowId = new Map<string, SupabaseMember>();

  for (const member of supabaseMembers) {
    if (member.memberstack_id) {
      supabaseByMemberstackId.set(member.memberstack_id, member);
    }
    if (member.webflow_id) {
      supabaseByWebflowId.set(member.webflow_id, member);
    }
  }

  const webflowByMemberstackId = new Map<string, WebflowMember>();
  const webflowById = new Map<string, WebflowMember>();

  for (const item of webflowMembers) {
    webflowById.set(item.id, item);
    const msId = item.fieldData?.['memberstack-id'];
    if (msId) {
      webflowByMemberstackId.set(msId, item);
    }
  }

  const issues: ConsistencyIssue[] = [];

  // 1. Check Memberstack members exist in Supabase
  for (const msMember of memberstackMembers) {
    const isActive = isMemberstackActive(msMember);
    const supabaseMember = supabaseByMemberstackId.get(msMember.id);

    if (!supabaseMember) {
      // Active Memberstack member not in Supabase
      if (isActive) {
        issues.push({
          type: 'missing_supabase',
          severity: 'critical',
          memberstackId: msMember.id,
          email: msMember.auth?.email,
          details: `Active Memberstack member not found in Supabase`,
        });
      }
      continue;
    }

    // Check status consistency
    if (isActive && supabaseMember.subscription_status === 'lapsed') {
      issues.push({
        type: 'status_mismatch',
        severity: 'warning',
        memberstackId: msMember.id,
        supabaseId: supabaseMember.id,
        email: msMember.auth?.email,
        details: `Memberstack shows ACTIVE but Supabase shows lapsed`,
      });
    } else if (!isActive && supabaseMember.subscription_status === 'active' && !supabaseMember.is_deleted) {
      issues.push({
        type: 'status_mismatch',
        severity: 'warning',
        memberstackId: msMember.id,
        supabaseId: supabaseMember.id,
        email: msMember.auth?.email,
        details: `Memberstack shows inactive but Supabase shows active`,
      });
    }

    // Check Webflow consistency for active, profile-complete members
    if (isActive && supabaseMember.profile_complete && !supabaseMember.webflow_id) {
      issues.push({
        type: 'missing_webflow',
        severity: 'critical',
        memberstackId: msMember.id,
        supabaseId: supabaseMember.id,
        email: msMember.auth?.email,
        details: `Active member with complete profile missing from Webflow`,
      });
    }

    // Check Webflow record exists if we have a webflow_id
    if (supabaseMember.webflow_id) {
      const webflowMember = webflowById.get(supabaseMember.webflow_id);
      if (!webflowMember) {
        issues.push({
          type: 'missing_webflow',
          severity: 'critical',
          memberstackId: msMember.id,
          supabaseId: supabaseMember.id,
          webflowId: supabaseMember.webflow_id,
          email: msMember.auth?.email,
          details: `Supabase references Webflow ID that doesn't exist`,
        });
      } else {
        // Check archive status consistency
        if (isActive && !supabaseMember.is_deleted && webflowMember.isArchived) {
          issues.push({
            type: 'status_mismatch',
            severity: 'warning',
            memberstackId: msMember.id,
            supabaseId: supabaseMember.id,
            webflowId: supabaseMember.webflow_id,
            email: msMember.auth?.email,
            details: `Active member is archived in Webflow`,
          });
        }
      }
    }
  }

  // 2. Check for orphaned Supabase records (not in Memberstack)
  const memberstackIds = new Set(memberstackMembers.map(m => m.id));

  for (const supabaseMember of supabaseMembers) {
    if (supabaseMember.is_deleted) continue; // Skip deleted members

    if (!memberstackIds.has(supabaseMember.memberstack_id)) {
      issues.push({
        type: 'orphaned_supabase',
        severity: 'info',
        memberstackId: supabaseMember.memberstack_id,
        supabaseId: supabaseMember.id,
        email: supabaseMember.email || undefined,
        details: `Supabase member not found in Memberstack (may have been deleted)`,
      });
    }
  }

  // 3. Check for orphaned Webflow records
  for (const webflowMember of webflowMembers) {
    if (webflowMember.isArchived) continue; // Skip archived

    const msId = webflowMember.fieldData?.['memberstack-id'];
    if (msId && !memberstackIds.has(msId)) {
      issues.push({
        type: 'orphaned_webflow',
        severity: 'warning',
        memberstackId: msId,
        webflowId: webflowMember.id,
        email: webflowMember.fieldData?.['email-address'],
        details: `Webflow member not found in Memberstack (should be archived)`,
      });
    }
  }

  // Build report
  const report: ConsistencyReport = {
    timestamp: new Date().toISOString(),
    summary: {
      memberstack_total: memberstackMembers.length,
      supabase_total: supabaseMembers.length,
      webflow_total: webflowMembers.length,
      issues_critical: issues.filter(i => i.severity === 'critical').length,
      issues_warning: issues.filter(i => i.severity === 'warning').length,
      issues_info: issues.filter(i => i.severity === 'info').length,
    },
    issues,
  };

  console.log('Consistency check complete:', report.summary);

  return report;
}

// Save report to Supabase
async function saveReport(report: ConsistencyReport): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('consistency_reports')
    .insert({
      report_data: report,
      memberstack_count: report.summary.memberstack_total,
      supabase_count: report.summary.supabase_total,
      webflow_count: report.summary.webflow_total,
      critical_issues: report.summary.issues_critical,
      warning_issues: report.summary.issues_warning,
      info_issues: report.summary.issues_info,
    });

  if (error) {
    console.error('Error saving report:', error);
    // Don't throw - report still succeeded
  } else {
    console.log('Report saved to database');
  }
}

// Send email alert if there are critical issues
async function sendAlertEmail(report: ConsistencyReport): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping alert email');
    return;
  }

  // Only send if there are critical or warning issues
  if (report.summary.issues_critical === 0 && report.summary.issues_warning === 0) {
    console.log('No critical/warning issues, skipping alert email');
    return;
  }

  const criticalIssues = report.issues.filter(i => i.severity === 'critical');
  const warningIssues = report.issues.filter(i => i.severity === 'warning');

  const issueRows = [...criticalIssues, ...warningIssues].slice(0, 20).map(issue => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${issue.severity === 'critical' ? '🔴' : '🟡'} ${issue.severity}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${issue.email || issue.memberstackId || 'N/A'}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${issue.details}</td>
    </tr>
  `).join('');

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MTNS MADE - Data Consistency Alert</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5;">
  <div style="max-width: 800px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden;">
    <div style="background: #1a1a1a; color: #fff; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 20px;">Data Consistency Alert</h1>
    </div>
    <div style="padding: 20px;">
      <h2 style="margin-top: 0;">Summary</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px; background: #f9f9f9;">Memberstack Members</td>
          <td style="padding: 8px; background: #f9f9f9;"><strong>${report.summary.memberstack_total}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px;">Supabase Members</td>
          <td style="padding: 8px;"><strong>${report.summary.supabase_total}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px; background: #f9f9f9;">Webflow Members</td>
          <td style="padding: 8px; background: #f9f9f9;"><strong>${report.summary.webflow_total}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px; color: #d32f2f;">Critical Issues</td>
          <td style="padding: 8px; color: #d32f2f;"><strong>${report.summary.issues_critical}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px; background: #f9f9f9; color: #f57c00;">Warning Issues</td>
          <td style="padding: 8px; background: #f9f9f9; color: #f57c00;"><strong>${report.summary.issues_warning}</strong></td>
        </tr>
      </table>

      ${report.issues.length > 0 ? `
      <h2>Issues Found</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f0f0f0;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Severity</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Member</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Details</th>
          </tr>
        </thead>
        <tbody>
          ${issueRows}
        </tbody>
      </table>
      ${report.issues.length > 20 ? `<p style="color: #666; font-size: 14px;">... and ${report.issues.length - 20} more issues</p>` : ''}
      ` : ''}

      <p style="margin-top: 20px; color: #666; font-size: 14px;">
        Report generated: ${new Date(report.timestamp).toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}
      </p>
    </div>
  </div>
</body>
</html>
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
        subject: `[MTNS MADE] Data Consistency Alert - ${report.summary.issues_critical} critical, ${report.summary.issues_warning} warnings`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Email send error:', error);
    } else {
      console.log('Alert email sent to:', ADMIN_EMAIL);
    }
  } catch (error) {
    console.error('Error sending alert email:', error);
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
      headers: corsHeaders,
    });
  }

  // Check environment variables
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ success: false, error: 'Missing Supabase configuration' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Run consistency check
    const report = await runConsistencyCheck();

    // Save report to database (if table exists)
    try {
      await saveReport(report);
    } catch {
      console.log('consistency_reports table may not exist, skipping save');
    }

    // Send alert email if needed
    await sendAlertEmail(report);

    return new Response(
      JSON.stringify({
        success: true,
        report,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Consistency check error:', errorMessage);

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
