// Supabase Edge Function: Member Visibility Stocktake
// Runs weekly. Checks that every currently active, paying member is actually
// visible on the live site — not just correctly flagged in our own database.
//
// Built after the 2026-07-28/29 investigation into Lucas Corroto and Theatre
// Technician both being invisible on the site despite being fully correct in
// Webflow: the root cause was a stale full-site publish, not bad member data.
// This job targets exactly that class of bug:
//
//  1. Active members whose Webflow item is unexpectedly isDraft/isArchived
//     (a real data inconsistency, distinct from the publish-staleness issue).
//  2. Active members with zero category assignments (invisible from every
//     category/sub-directory page by definition).
//  3. Any active member updated more recently than the site's last successful
//     publish — the exact bug found this week. If detected, this job
//     auto-triggers a fresh publish rather than just reporting it.
//
// Deliberately does NOT attempt to verify a member visually appears in the
// rendered "Find a Creative" / category page HTML — those pages are Finsweet
// CMS-Load driven (client-side JS), so confirming that needs real browser
// automation, a separate and much larger piece of work. The publish-staleness
// check above targets the same root cause far more reliably.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendEmail, FROM_SUPPORT } from '../_shared/gmail.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'support@mtnsmade.com.au';

const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';
const WEBFLOW_MEMBERS_COLLECTION_ID = '64a938756620ae4bee88df34';
const WEBFLOW_SITE_ID = '64229aff3da29012f062753c';

function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

interface WebflowMemberItem {
  id: string;
  isDraft: boolean;
  isArchived: boolean;
}

async function fetchWebflowMembers(): Promise<Map<string, WebflowMemberItem>> {
  const map = new Map<string, WebflowMemberItem>();
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await fetch(
      `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items?limit=${limit}&offset=${offset}`,
      { headers: { 'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`, 'accept': 'application/json' } }
    );
    if (!response.ok) throw new Error(`Webflow API error: ${response.status}`);
    const data = await response.json();
    const items = data.items || [];
    for (const item of items) {
      map.set(item.id, { id: item.id, isDraft: item.isDraft, isArchived: item.isArchived });
    }
    if (items.length < limit) break;
    offset += limit;
  }

  return map;
}

async function getSiteLastPublished(): Promise<string | null> {
  const response = await fetch(`${WEBFLOW_API_BASE}/sites/${WEBFLOW_SITE_ID}`, {
    headers: { 'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`, 'accept': 'application/json' },
  });
  if (!response.ok) throw new Error(`Webflow site fetch error: ${response.status}`);
  const data = await response.json();
  const domains = data.customDomains || [];
  const timestamps = domains.map((d: { lastPublished?: string }) => d.lastPublished).filter(Boolean);
  if (timestamps.length === 0) return null;
  return timestamps.sort().reverse()[0];
}

async function sendStocktakeReport(
  hiddenActiveMembers: Array<{ name: string; email: string | null }>,
  noCategoryMembers: Array<{ name: string; email: string | null }>,
  publishTriggered: boolean,
  totalActive: number
): Promise<void> {
  const hasIssues = hiddenActiveMembers.length > 0 || noCategoryMembers.length > 0 || publishTriggered;
  if (!hasIssues) {
    console.log('No visibility issues found, skipping report email');
    return;
  }

  const hiddenRows = hiddenActiveMembers.map(m => `
    <tr><td style="padding:8px;border:1px solid #ddd;">${m.name}</td><td style="padding:8px;border:1px solid #ddd;">${m.email || 'N/A'}</td></tr>
  `).join('');

  const noCategoryRows = noCategoryMembers.map(m => `
    <tr><td style="padding:8px;border:1px solid #ddd;">${m.name}</td><td style="padding:8px;border:1px solid #ddd;">${m.email || 'N/A'}</td></tr>
  `).join('');

  const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>MTNS MADE - Member Visibility Stocktake</title></head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5;">
  <div style="max-width: 700px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden;">
    <div style="background: #1a1a1a; color: #fff; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 20px;">Weekly Member Visibility Stocktake</h1>
    </div>
    <div style="padding: 20px;">
      <p style="color:#555;">Checked ${totalActive} active members.</p>

      ${publishTriggered ? `<p style="background:#fff3e0;color:#f57c00;padding:12px;border-radius:6px;">A member was updated more recently than the site's last publish — a fresh full-site publish was triggered automatically.</p>` : ''}

      ${hiddenActiveMembers.length > 0 ? `
      <h3 style="color:#d32f2f;">Active members hidden in Webflow (${hiddenActiveMembers.length})</h3>
      <p style="color:#555;font-size:13px;">These members are active/paying but their Webflow profile is currently draft or archived — a real inconsistency, not a publish delay.</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><th style="padding:8px;border:1px solid #ddd;text-align:left;">Name</th><th style="padding:8px;border:1px solid #ddd;text-align:left;">Email</th></tr>
        ${hiddenRows}
      </table>` : ''}

      ${noCategoryMembers.length > 0 ? `
      <h3 style="color:#f57c00;">Active members with no category assigned (${noCategoryMembers.length})</h3>
      <p style="color:#555;font-size:13px;">These members won't appear on any category/sub-directory page since they haven't selected one.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><th style="padding:8px;border:1px solid #ddd;text-align:left;">Name</th><th style="padding:8px;border:1px solid #ddd;text-align:left;">Email</th></tr>
        ${noCategoryRows}
      </table>` : ''}
    </div>
  </div>
</body>
</html>`;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: 'MTNS MADE - Weekly Member Visibility Stocktake',
    html: emailHtml,
    text: `Checked ${totalActive} active members. Hidden: ${hiddenActiveMembers.length}. No category: ${noCategoryMembers.length}. Publish triggered: ${publishTriggered}.`,
    from: FROM_SUPPORT,
  });
  console.log('Stocktake report sent to:', ADMIN_EMAIL);
}

serve(async (req: Request) => {
  try {
    const supabase = getSupabaseClient();

    const { data: activeMembers, error } = await supabase
      .from('members')
      .select('id, name, email, webflow_id, updated_at')
      .eq('subscription_status', 'active')
      .eq('is_deleted', false)
      .not('webflow_id', 'is', null);

    if (error) throw error;

    const webflowMembers = await fetchWebflowMembers();

    const hiddenActiveMembers: Array<{ name: string; email: string | null }> = [];

    for (const member of activeMembers || []) {
      const wfItem = webflowMembers.get(member.webflow_id);
      if (wfItem && (wfItem.isDraft || wfItem.isArchived)) {
        hiddenActiveMembers.push({ name: member.name, email: member.email });
      }
    }

    // Members with zero category assignments
    const { data: categorized, error: catError } = await supabase
      .from('member_sub_directories')
      .select('member_id');
    if (catError) throw catError;

    const categorizedIds = new Set((categorized || []).map(c => c.member_id));
    const noCategoryMembers = (activeMembers || [])
      .filter(m => !categorizedIds.has(m.id))
      .map(m => ({ name: m.name, email: m.email }));

    // Publish-staleness check — the actual root cause found this week
    const lastPublished = await getSiteLastPublished();
    const mostRecentUpdate = (activeMembers || [])
      .map(m => m.updated_at)
      .sort()
      .reverse()[0];

    let publishTriggered = false;
    if (lastPublished && mostRecentUpdate && mostRecentUpdate > lastPublished) {
      publishTriggered = true;
      fetch(`${SUPABASE_URL}/functions/v1/publish-site`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
      }).catch(err => console.warn('publish-site trigger error (non-fatal):', err));
    }

    await sendStocktakeReport(hiddenActiveMembers, noCategoryMembers, publishTriggered, (activeMembers || []).length);

    return new Response(
      JSON.stringify({
        success: true,
        totalActive: (activeMembers || []).length,
        hiddenActiveMembers: hiddenActiveMembers.length,
        noCategoryMembers: noCategoryMembers.length,
        publishTriggered,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('member-visibility-stocktake error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
