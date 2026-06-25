/**
 * One-off script: send member alerts for an already-approved opportunity.
 * Usage: node scripts/send-opportunity-alert.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load cred.env
const credPath = resolve(__dirname, '../cred.env');
const creds = readFileSync(credPath, 'utf8');
const env = {};
for (const line of creds.split('\n')) {
  const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
}

const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = env.RESEND_API;
const FROM_EMAIL = 'MTNS MADE <support@mail.mtnsmade.com.au>';
const SITE_URL = 'https://www.mtnsmade.com.au';

const OPPORTUNITY = {
  id: '52e9a83d-2e4c-44b3-8e34-971e43923fe4',
  name: 'Post-Production & Technical Coordinator',
  organization: 'Studio Goose',
  opportunity_type: 'job',
  closing_date: '2026-06-12',
  budget: '80-90k inclusive of Super, In line with experience)',
  member_contact_email: 'keatonstewart@gmail.com',
};

const TYPE_LABELS = {
  'job': 'Job / Employment',
  'commission': 'Commission',
  'collaboration': 'Collaboration',
  'call-for-entries': 'Call for Entries',
  'residency': 'Residency / Fellowship',
  'volunteer': 'Volunteer',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function buildHtml(firstName, opp, profileComplete) {
  const oppUrl = `${SITE_URL}/opportunities/jobs`;
  const profileUrl = `${SITE_URL}/member-dashboard`;
  const typeLabel = TYPE_LABELS[opp.opportunity_type] || '';
  const closing = opp.closing_date ? formatDate(opp.closing_date) : '';

  const profileNudge = profileComplete ? '' : `
          <tr>
            <td style="padding: 0 40px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                style="background-color: #f5f5f5; border-left: 3px solid #1a1a1a; border-radius: 2px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 8px; color: #1a1a1a; font-size: 14px; font-weight: 600;">
                      Your profile isn't complete yet
                    </p>
                    <p style="margin: 0 0 12px; color: #555555; font-size: 14px; line-height: 1.5;">
                      Completing your profile means you show up in the member directory and the community can find you. It only takes a few minutes.
                    </p>
                    <a href="${profileUrl}" style="color: #1a1a1a; font-size: 14px; font-weight: 600; text-decoration: underline;">
                      Complete your profile →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New opportunity on MTNS MADE</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 4px; overflow: hidden;">
          <tr>
            <td style="background-color: #1a1a1a; padding: 24px 40px;">
              <p style="margin: 0; color: #ffffff; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">MTNS MADE</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 40px 24px;">
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>
              <p style="margin: 0 0 24px; color: #1a1a1a; font-size: 16px; line-height: 1.6;">
                A new opportunity has just been posted on the MTNS MADE board.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                style="border: 1px solid #e0e0e0; border-radius: 2px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    ${typeLabel ? `<p style="margin: 0 0 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #888888;">${typeLabel}</p>` : ''}
                    <p style="margin: 0 0 4px; font-size: 18px; font-weight: 600; color: #1a1a1a; line-height: 1.3;">${opp.name}</p>
                    ${opp.organization ? `<p style="margin: 0 0 12px; font-size: 14px; color: #666666;">${opp.organization}</p>` : '<div style="margin-bottom: 12px;"></div>'}
                    <p style="margin: 0; font-size: 13px; color: #888888;">
                      ${closing ? `Closes ${closing}` : ''}${opp.budget ? ` · ${opp.budget}` : ''}
                    </p>
                  </td>
                </tr>
              </table>
              <a href="${oppUrl}"
                style="display: inline-block; background-color: #1a1a1a; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 2px;">
                View opportunity →
              </a>
            </td>
          </tr>
          ${profileNudge}
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 40px; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 6px; color: #aaaaaa; font-size: 12px; line-height: 1.6;">
                Browse all current listings at <a href="${oppUrl}" style="color: #888888;">${SITE_URL}/opportunities/jobs</a>
              </p>
              <p style="margin: 0; color: #aaaaaa; font-size: 12px;">
                <a href="${SITE_URL}" style="color: #888888;">mtnsmade.com.au</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function main() {
  // Optional offset/limit via args: node script.mjs <offset> <limit>
  const offset = parseInt(process.argv[2] ?? '0', 10);
  const limit  = parseInt(process.argv[3] ?? '9999', 10);

  // Fetch active members — consistent order by created_at so offset is stable
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/members?select=first_name,email,profile_complete&subscription_status=eq.active&is_deleted=eq.false&email=not.is.null&order=created_at.asc`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
  const allMembers = await res.json();
  console.log(`Total active members: ${allMembers.length}`);

  const subject = `New opportunity: ${OPPORTUNITY.name}`;
  const submitterEmail = OPPORTUNITY.member_contact_email;

  const eligible = allMembers.filter(m => m.email && m.email !== submitterEmail);
  const slice = eligible.slice(offset, offset + limit);

  console.log(`Sending to ${slice.length} members (offset ${offset}, limit ${limit})`);

  if (!slice.length) {
    console.log('Nothing to send.');
    return;
  }

  const batch = slice.map(m => ({
    from: FROM_EMAIL,
    to: [m.email],
    subject,
    html: buildHtml(m.first_name || 'there', OPPORTUNITY, m.profile_complete),
  }));

  // Send in chunks of 80 (staying within daily limit)
  const chunkSize = 80;
  for (let i = 0; i < batch.length; i += chunkSize) {
    const chunk = batch.slice(i, i + chunkSize);
    const sendRes = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chunk),
    });
    const result = await sendRes.json();
    if (!sendRes.ok) {
      console.error(`Chunk failed:`, result);
    } else {
      console.log(`Sent ${chunk.length} emails (offset ${offset + i}–${offset + i + chunk.length - 1})`);
    }
  }

  console.log('Done.');
}

main().catch(console.error);
