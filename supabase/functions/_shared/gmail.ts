/**
 * MTNS MADE - Gmail API email sender
 * Uses a Google service account with domain-wide delegation to send email
 * as hello@mtnsmade.com.au or support@mtnsmade.com.au.
 */

export const FROM_HELLO = 'MTNS MADE <hello@mtnsmade.com.au>';
export const FROM_SUPPORT = 'MTNS MADE <support@mtnsmade.com.au>';

export interface EmailRequest {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;       // defaults to FROM_HELLO
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function base64url(data: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(data)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64urlStr(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getAccessToken(serviceAccount: ServiceAccount, impersonateAs: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header = base64urlStr(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64urlStr(JSON.stringify({
    iss: serviceAccount.client_email,
    sub: impersonateAs,
    scope: 'https://www.googleapis.com/auth/gmail.send',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));

  const signingInput = `${header}.${payload}`;
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(serviceAccount.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const jwt = `${signingInput}.${base64url(signature)}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  if (!tokenResponse.ok) {
    const err = await tokenResponse.text();
    throw new Error(`Failed to get Gmail access token: ${err}`);
  }

  const { access_token } = await tokenResponse.json();
  return access_token;
}

function buildRfc2822(options: {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): string {
  const lines: string[] = [
    `From: ${options.from}`,
    `To: ${options.to.join(', ')}`,
    `Subject: ${options.subject}`,
    'MIME-Version: 1.0',
  ];

  if (options.replyTo) {
    lines.push(`Reply-To: ${options.replyTo}`);
  }

  if (options.text && options.html) {
    const boundary = `boundary_${Date.now()}`;
    lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`, '');
    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/plain; charset=utf-8', '');
    lines.push(options.text, '');
    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/html; charset=utf-8', '');
    lines.push(options.html, '');
    lines.push(`--${boundary}--`);
  } else {
    lines.push('Content-Type: text/html; charset=utf-8', '');
    lines.push(options.html || options.text?.replace(/\n/g, '<br>') || '');
  }

  return lines.join('\r\n');
}

export async function sendEmail(request: EmailRequest): Promise<EmailResult> {
  const serviceAccountJson = Deno.env.get('GMAIL_SERVICE_ACCOUNT_JSON');
  if (!serviceAccountJson) {
    console.error('GMAIL_SERVICE_ACCOUNT_JSON not configured');
    return { success: false, error: 'Email service not configured' };
  }

  let serviceAccount: ServiceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch {
    return { success: false, error: 'Invalid GMAIL_SERVICE_ACCOUNT_JSON' };
  }

  const fromField = request.from ?? FROM_HELLO;
  // Extract bare email address for impersonation (strips "Name <email>" format)
  const fromEmail = fromField.match(/<(.+)>/)?.[1] ?? fromField;
  const toArray = Array.isArray(request.to) ? request.to : [request.to];
  const html = request.html || (request.text ? request.text.replace(/\n/g, '<br>') : '');

  try {
    const accessToken = await getAccessToken(serviceAccount, fromEmail);

    const rawMessage = buildRfc2822({
      from: fromField,
      to: toArray,
      subject: request.subject,
      html,
      text: request.text,
      replyTo: request.replyTo,
    });

    const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)))
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(fromEmail)}/messages/send`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: encodedMessage }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gmail API error:', response.status, err);
      return { success: false, error: `Gmail API error: ${response.status}` };
    }

    const result = await response.json();
    console.log('Email sent via Gmail:', result.id);
    return { success: true, id: result.id };
  } catch (error) {
    console.error('sendEmail error:', error);
    return { success: false, error: error.message };
  }
}
