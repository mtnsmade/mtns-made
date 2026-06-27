// Supabase Edge Function: Admin Tools
// Provides privileged admin actions not available via anon key:
//   - delete-project: soft-deletes a project (triggers sync-to-webflow to clean up Webflow)
//   - send-password-reset: sends a Memberstack password reset email to a member

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const MEMBERSTACK_API_KEY = Deno.env.get('MEMBERSTACK_API_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, projectId, memberstackId, opportunityId } = await req.json();

    if (action === 'delete-project') {
      if (!projectId) {
        return new Response(JSON.stringify({ error: 'projectId required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { error } = await supabase
        .from('projects')
        .update({ is_deleted: true })
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Project soft-deleted by admin:', projectId);
      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete-opportunity') {
      if (!opportunityId) {
        return new Response(JSON.stringify({ error: 'opportunityId required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      const { data: opp } = await supabase
        .from('opportunities')
        .select('id, name, webflow_id')
        .eq('id', opportunityId)
        .single();

      if (opp?.webflow_id) {
        const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';
        const WEBFLOW_OPPORTUNITIES_COLLECTION_ID = '64a9f30abaf5ea96e9180239';
        await fetch(
          `https://api.webflow.com/v2/collections/${WEBFLOW_OPPORTUNITIES_COLLECTION_ID}/items/${opp.webflow_id}`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${WEBFLOW_API_TOKEN}` },
          }
        );
      }

      const { error } = await supabase.from('opportunities').delete().eq('id', opportunityId);

      if (error) {
        console.error('Error deleting opportunity:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (opp?.webflow_id) {
        fetch(`${SUPABASE_URL}/functions/v1/publish-site`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
        }).catch(err => console.warn('publish-site error (non-fatal):', err));
      }

      console.log('Opportunity deleted by admin:', opp?.name, opportunityId);
      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'send-password-reset') {
      if (!memberstackId) {
        return new Response(JSON.stringify({ error: 'memberstackId required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const response = await fetch(
        `https://admin.memberstack.com/members/${memberstackId}/send-password-reset`,
        {
          method: 'POST',
          headers: {
            'X-API-KEY': MEMBERSTACK_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const responseText = await response.text();
      console.log('Memberstack password reset response:', response.status, responseText);

      if (!response.ok) {
        return new Response(JSON.stringify({ error: `Memberstack returned ${response.status}: ${responseText}` }), {
          status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('admin-tools error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
