/**
 * MTNS MADE - Contact Member Edge Function
 * Receives enquiry form submissions, stores in database, and notifies member
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const RESEND_API_KEY = Deno.env.get('RESEND_API') || '';
const FROM_EMAIL = 'MTNS MADE <support@mail.mtnsmade.com.au>';
const SITE_URL = 'https://www.mtnsmade.com.au';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

interface ContactFormData {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  message: string;
  memberstackId: string;
  memberName: string;
}

function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

async function getMember(memberstackId: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('members')
    .select('id, email, name, first_name')
    .eq('memberstack_id', memberstackId)
    .single();

  if (error) {
    console.error('Error fetching member:', error);
    return null;
  }

  return data;
}

async function storeMessage(
  memberId: string,
  memberstackId: string,
  data: ContactFormData
): Promise<string | null> {
  const supabase = getSupabaseClient();

  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      member_id: memberId,
      memberstack_id: memberstackId,
      sender_name: data.senderName,
      sender_email: data.senderEmail,
      sender_phone: data.senderPhone || null,
      subject: data.subject,
      message: data.message,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error storing message:', error);
    return null;
  }

  return message.id;
}

async function sendNotificationEmail(
  memberEmail: string,
  memberName: string,
  senderName: string,
  subject: string
): Promise<boolean> {
  const dashboardUrl = SITE_URL + '/profile/start';

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #333; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">New Message on MTNS MADE</h1>
      </div>

      <div style="padding: 30px; background: #f9f9f9;">
        <p style="margin: 0 0 20px 0; color: #333;">
          Hi ${memberName},
        </p>

        <p style="margin: 0 0 20px 0; color: #333;">
          You've received a new enquiry through your MTNS MADE profile from <strong>${senderName}</strong>:
        </p>

        <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <p style="margin: 0; color: #333;">
            <strong>Subject:</strong> ${subject}
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="display: inline-block; background: #333; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Message in Dashboard
          </a>
        </div>

        <p style="margin: 0; color: #666; font-size: 14px;">
          Log in to your MTNS MADE dashboard to read the full message and reply.
        </p>
      </div>

      <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
        <p style="margin: 0;">
          This notification was sent from <a href="${SITE_URL}" style="color: #666;">MTNS MADE</a>.
        </p>
      </div>
    </div>
  `;

  const emailText = `Hi ${memberName},

You've received a new enquiry through your MTNS MADE profile from ${senderName}:

Subject: ${subject}

Log in to your MTNS MADE dashboard to read the full message and reply:
${dashboardUrl}`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [memberEmail],
        subject: 'New MTNS MADE Enquiry: ' + subject,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return false;
    }

    console.log('Notification email sent to:', memberEmail);
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}

serve(async (req: Request) => {
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
    const data: ContactFormData = await req.json();
    console.log('Received contact form:', data.memberstackId, data.subject);

    if (!data.senderName || !data.senderEmail || !data.subject || !data.message || !data.memberstackId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const member = await getMember(data.memberstackId);
    if (!member) {
      return new Response(
        JSON.stringify({ success: false, error: 'Member not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const messageId = await storeMessage(member.id, data.memberstackId, data);
    if (!messageId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to store message' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Message stored:', messageId);

    const memberDisplayName = member.name || member.first_name || 'there';
    await sendNotificationEmail(
      member.email,
      memberDisplayName,
      data.senderName,
      data.subject
    );

    return new Response(
      JSON.stringify({ success: true, messageId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Contact member error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
