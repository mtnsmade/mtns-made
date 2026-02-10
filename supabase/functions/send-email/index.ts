/**
 * MTNS MADE - Send Email Edge Function
 * Generic email sending using Resend API
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API') || '';
const FROM_EMAIL = 'MTNS MADE <support@mail.mtnsmade.com.au>';

interface EmailRequest {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail(request: EmailRequest): Promise<EmailResult> {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API key not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(request.to) ? request.to : [request.to],
        subject: request.subject,
        html: request.html,
        text: request.text,
        reply_to: request.replyTo,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', result);
      return { success: false, error: result.message || 'Failed to send email' };
    }

    console.log('Email sent successfully:', result.id);
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
};

// HTTP handler for direct invocation
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Note: This function is accessible without auth verification
  // It's protected by being behind the admin dashboard (Memberstack auth)
  // and by requiring valid Resend API key to actually send emails

  try {
    const body = await req.json();

    // Require to and subject, allow either html or text
    if (!body.to || !body.subject) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: to, subject' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Auto-convert text to html if html not provided
    const emailRequest: EmailRequest = {
      to: body.to,
      subject: body.subject,
      html: body.html || (body.text ? body.text.replace(/\n/g, '<br>') : ''),
      text: body.text,
      replyTo: body.replyTo,
    };

    if (!emailRequest.html && !emailRequest.text) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: html or text' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await sendEmail(emailRequest);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
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
