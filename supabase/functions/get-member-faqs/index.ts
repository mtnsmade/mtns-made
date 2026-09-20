/**
 * MTNS MADE - Member FAQs
 *
 * Returns the PUBLISHED "Member FAQ" items from the Webflow Frequently Asked
 * Questions collection, ordered by display-order, for the accordion under the
 * profile checklist on the member dashboard (profile-checklist-supabase.js).
 *
 * Runs server-side because Webflow's CMS API needs a secret token. Reads the
 * LIVE items endpoint, so nothing draft/unpublished can leak, and edits made
 * in the Webflow CMS show up here after they are published.
 *
 * POST/GET {} -> { success: true, faqs: [{ id, question, answer, order }] }
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';
const FAQ_COLLECTION_ID = '64f3108083410178f76995ee';
// Option ids of the collection's "faq-type" select
const MEMBER_FAQ_OPTION_ID = '2579ad84be9055d419468016e2c03aec';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!WEBFLOW_API_TOKEN) throw new Error('WEBFLOW_API_TOKEN not configured');

    const faqs: Array<{ id: string; question: string; answer: string; order: number }> = [];
    let offset = 0;
    let total = 0;

    do {
      const res = await fetch(
        `https://api.webflow.com/v2/collections/${FAQ_COLLECTION_ID}/items/live?limit=100&offset=${offset}`,
        { headers: { Authorization: `Bearer ${WEBFLOW_API_TOKEN}` } }
      );
      if (!res.ok) throw new Error(`Webflow API error: ${res.status}`);
      const page = await res.json();
      total = page.pagination?.total ?? page.items.length;

      for (const item of page.items) {
        const f = item.fieldData || {};
        if (item.isDraft || item.isArchived) continue;
        if (f['faq-type'] !== MEMBER_FAQ_OPTION_ID) continue;
        if (!f.question || !f.answer) continue;
        faqs.push({
          id: item.id,
          question: f.question,
          answer: f.answer,
          order: typeof f['display-order'] === 'number' ? f['display-order'] : 9999,
        });
      }
      offset += 100;
    } while (offset < total);

    faqs.sort((a, b) => a.order - b.order);

    return new Response(JSON.stringify({ success: true, faqs }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('get-member-faqs error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
