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
    const { action, projectId, memberstackId } = await req.json();

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
