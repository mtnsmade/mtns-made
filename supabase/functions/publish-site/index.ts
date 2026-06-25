import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const WEBFLOW_API_TOKEN = Deno.env.get('MTNSMADE_NEW_API') || '';
const SITE_ID = '64229aff3da29012f062753c';

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
          customDomains: [
            '66873ae48d8905f8678e4662',
            '66873ae48d8905f8678e4654',
            '66866362c9e911a4e364084f',
            '66866362c9e911a4e3640839',
          ],
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
