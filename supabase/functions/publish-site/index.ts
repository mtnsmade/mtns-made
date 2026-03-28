import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';
const SITE_ID = '6481b864324e32f8eb266e2f';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const response = await fetch(
      `https://api.webflow.com/v2/sites/${SITE_ID}/publish`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publishToWebflowSubdomain: false,
        }),
      }
    );

    const result = await response.json();
    
    return new Response(
      JSON.stringify({ success: response.ok, status: response.status, result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
