import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const REPORT_TO = 'contact@racket.net.au';
const RETAINER_HOURS = 7;

const PATTERNS: { label: string; keywords: string[] }[] = [
  { label: 'Project duplication', keywords: ['duplicate', 'double', 'duplication', 'duplicated', 'two of', 'appearing twice'] },
  { label: 'Password / access lockout', keywords: ['password', 'locked out', 'lock out', 'can\'t access', 'cannot access', 'reset', 'login', 'log in', 'sign in'] },
  { label: 'Webflow sync / not showing', keywords: ['not showing', 'still showing', 'not appearing', 'not visible', 'not live', 'not on the website', 'not updated', 'not synced'] },
  { label: 'Events issues', keywords: ['event', 'eventbrite', 'rsvp', 'ticket'] },
  { label: 'Image / media upload', keywords: ['image', 'photo', 'upload', 'picture', 'display order', 'order'] },
  { label: 'Opportunities / jobs', keywords: ['opportunit', 'job', 'listing', 'jobs page'] },
  { label: 'Profile incomplete / not live', keywords: ['profile', 'not back online', 'not online', 'go back online', 'missing from'] },
];

function matchesPattern(task: { title: string; description: string | null }, pattern: { keywords: string[] }): boolean {
  const text = `${task.title} ${task.description || ''}`.toLowerCase();
  return pattern.keywords.some(k => text.includes(k.toLowerCase()));
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Australia/Sydney' });
}

function categoryLabel(cat: string): string {
  if (cat === 'member_support') return 'Member Support';
  if (cat === 'website_bug') return 'Bug';
  if (cat === 'feature_request') return 'Feature Request';
  return cat;
}

function statusLabel(s: string): string {
  return { not_started: 'Not Started', in_progress: 'In Progress', feedback_needed: 'Feedback Needed', stalled: 'Stalled', complete: 'Complete' }[s] || s;
}

const ACTIVE_STATUSES = new Set(['not_started', 'in_progress', 'feedback_needed', 'stalled']);

serve(async (req: Request) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: allTasks, error } = await supabase
    .from('support_tasks')
    .select('id, category, title, description, status, hours, member_name, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load tasks:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const tasks = allTasks || [];
  const now = new Date();

  // New tasks in the last 24h
  const cutoff24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const newTasks = tasks.filter(t => new Date(t.created_at) > cutoff24h);

  // Active backlog
  const activeTasks = tasks.filter(t => ACTIVE_STATUSES.has(t.status));

  // This month's hours (all tasks created in current calendar month)
  const thisMonth = monthKey(now);
  const monthHours = tasks
    .filter(t => monthKey(new Date(t.created_at)) === thisMonth)
    .reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0);

  // Pattern analysis across all tasks (last 90 days)
  const cutoff90d = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const recentTasks = tasks.filter(t => new Date(t.created_at) > cutoff90d);
  const patternCounts = PATTERNS.map(p => ({
    label: p.label,
    count: recentTasks.filter(t => matchesPattern(t, p)).length,
  })).filter(p => p.count > 0).sort((a, b) => b.count - a.count);

  // Longest-waiting active tasks (no hours, oldest first)
  const stalledOpen = activeTasks
    .filter(t => t.status === 'not_started' || t.status === 'stalled')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(0, 5);

  // Build email
  const hoursUsed = monthHours % 1 === 0 ? monthHours : monthHours.toFixed(1);
  const remaining = RETAINER_HOURS - monthHours;
  const hoursStatus = monthHours > RETAINER_HOURS
    ? `<span style="color:#c62828;font-weight:600">${hoursUsed}h used — ${(monthHours - RETAINER_HOURS).toFixed(1)}h over limit</span>`
    : monthHours >= 5
      ? `<span style="color:#e65100;font-weight:600">${hoursUsed}h used — ${remaining.toFixed(1)}h remaining (approaching limit)</span>`
      : `<span style="color:#2e7d32">${hoursUsed}h used — ${remaining.toFixed(1)}h remaining</span>`;

  const monthName = now.toLocaleDateString('en-AU', { month: 'long', year: 'numeric', timeZone: 'Australia/Sydney' });
  const todayStr = now.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Australia/Sydney' });

  function taskRow(t: typeof tasks[0], highlight = false): string {
    return `
      <tr style="${highlight ? 'background:#fffde7;' : ''}">
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#1a1a1a">${t.title.slice(0, 80)}${t.title.length > 80 ? '…' : ''}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#555;white-space:nowrap">${categoryLabel(t.category)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#555;white-space:nowrap">${statusLabel(t.status)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#555;white-space:nowrap">${t.member_name || '-'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#555;white-space:nowrap">${formatDate(t.created_at)}</td>
      </tr>`;
  }

  const newTasksSection = newTasks.length > 0 ? `
    <h3 style="margin:24px 0 8px;font-size:14px;font-weight:700;color:#1a1a1a">New Today (${newTasks.length})</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <thead><tr style="background:#f5f5f5">
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#888;font-weight:600;text-transform:uppercase">Task</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#888;font-weight:600;text-transform:uppercase">Category</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#888;font-weight:600;text-transform:uppercase">Status</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#888;font-weight:600;text-transform:uppercase">Member</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#888;font-weight:600;text-transform:uppercase">Logged</th>
      </tr></thead>
      <tbody>${newTasks.map(t => taskRow(t, true)).join('')}</tbody>
    </table>` : `
    <p style="color:#888;font-size:13px;margin:16px 0 24px">No new tasks in the last 24 hours.</p>`;

  const activeSection = activeTasks.length > 0 ? `
    <h3 style="margin:24px 0 8px;font-size:14px;font-weight:700;color:#1a1a1a">Active Backlog (${activeTasks.length})</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <thead><tr style="background:#f5f5f5">
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#888;font-weight:600;text-transform:uppercase">Task</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#888;font-weight:600;text-transform:uppercase">Category</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#888;font-weight:600;text-transform:uppercase">Status</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#888;font-weight:600;text-transform:uppercase">Member</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#888;font-weight:600;text-transform:uppercase">Added</th>
      </tr></thead>
      <tbody>${activeTasks.map(t => taskRow(t)).join('')}</tbody>
    </table>` : `
    <p style="color:#2e7d32;font-size:13px;margin:16px 0 24px">No active tasks — backlog clear.</p>`;

  const patternsSection = patternCounts.length > 0 ? `
    <h3 style="margin:24px 0 8px;font-size:14px;font-weight:700;color:#1a1a1a">Recurring Patterns (last 90 days)</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      ${patternCounts.map(p => `
        <tr>
          <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#1a1a1a">${p.label}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;font-weight:600;color:${p.count >= 3 ? '#c62828' : p.count >= 2 ? '#e65100' : '#555'};text-align:right">${p.count} task${p.count !== 1 ? 's' : ''}</td>
        </tr>`).join('')}
    </table>
    ${patternCounts[0]?.count >= 3 ? `<p style="font-size:12px;color:#c62828;margin-bottom:20px">&#9888; "${patternCounts[0].label}" has occurred ${patternCounts[0].count} times in 90 days — candidate for a code fix.</p>` : ''}` : '';

  const stalledSection = stalledOpen.length > 0 ? `
    <h3 style="margin:24px 0 8px;font-size:14px;font-weight:700;color:#1a1a1a">Waiting Longest (oldest unstarted / stalled)</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      ${stalledOpen.map(t => `
        <tr>
          <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#1a1a1a">${t.title.slice(0, 80)}${t.title.length > 80 ? '…' : ''}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#888;text-align:right;white-space:nowrap">${formatDate(t.created_at)}</td>
        </tr>`).join('')}
    </table>` : '';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#1a1a1a">
      <div style="border-bottom:2px solid #1a1a1a;padding-bottom:12px;margin-bottom:20px">
        <h2 style="margin:0 0 4px;font-size:16px;font-weight:700">MTNS MADE - Support Report</h2>
        <div style="font-size:12px;color:#888">${todayStr}</div>
      </div>

      <table style="width:100%;border-collapse:collapse;background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px;margin-bottom:24px">
        <tr>
          <td style="padding:12px 16px;border-right:1px solid #e0e0e0">
            <span style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;display:block;margin-bottom:4px">${monthName} Retainer</span>
            <span style="font-size:13px">${hoursStatus} / ${RETAINER_HOURS}h</span>
          </td>
          <td style="padding:12px 16px;width:120px;border-right:1px solid #e0e0e0">
            <span style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;display:block;margin-bottom:4px">Active Tasks</span>
            <span style="font-size:18px;font-weight:700;color:#1a1a1a">${activeTasks.length}</span>
          </td>
          <td style="padding:12px 16px;width:100px">
            <span style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;display:block;margin-bottom:4px">New Today</span>
            <span style="font-size:18px;font-weight:700;color:${newTasks.length > 0 ? '#e65100' : '#1a1a1a'}">${newTasks.length}</span>
          </td>
        </tr>
      </table>

      ${newTasksSection}
      ${activeSection}
      ${patternsSection}
      ${stalledSection}

      <div style="border-top:1px solid #e0e0e0;padding-top:16px;margin-top:24px;font-size:11px;color:#aaa">
        Sent automatically by MTNS MADE support tracker. <a href="https://mtnsmade.com.au" style="color:#aaa">mtnsmade.com.au</a>
      </div>
    </body>
    </html>`;

  // Send via existing send-email function
  const emailResp = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: REPORT_TO,
      subject: `MTNS MADE Support - ${todayStr}`,
      html,
    }),
  });

  const emailResult = await emailResp.json();
  console.log('support-report email sent:', emailResult);

  return new Response(JSON.stringify({ success: true, newTasks: newTasks.length, activeTasks: activeTasks.length, monthHours }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
