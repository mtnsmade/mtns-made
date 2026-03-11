/**
 * MTNS MADE - Generate Project Summary
 * Uses Claude API to generate short descriptions for projects
 *
 * Modes:
 * - POST { project_id } - Generate for single project
 * - POST { mode: 'backfill', limit: 10 } - Backfill projects without short descriptions
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const ANTHROPIC_API_KEY = Deno.env.get('CLAUDE') || Deno.env.get('ANTHROPIC_API_KEY') || '';
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';

const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';
const WEBFLOW_PROJECTS_COLLECTION_ID = '64e707a6e743e15e48a76b24';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// Generate short description using Claude
async function generateShortDescription(description: string): Promise<string | null> {
  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not configured');
    return null;
  }

  if (!description || description.trim().length < 20) {
    console.log('Description too short to summarize');
    return null;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: `Write a concise meta description (maximum 155 characters) for this creative project. Focus on what the project is and its key appeal. Be direct and descriptive, avoiding generic marketing language. Do not use quotes around the response.

Project description:
${description}

Respond with ONLY the short description, nothing else.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', response.status, error);
      return null;
    }

    const result = await response.json();
    let shortDesc = result.content?.[0]?.text?.trim() || null;

    // Ensure it's under 160 characters
    if (shortDesc && shortDesc.length > 160) {
      // Truncate at last complete word under 157 chars, add ellipsis
      shortDesc = shortDesc.substring(0, 157).replace(/\s+\S*$/, '') + '...';
    }

    return shortDesc;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return null;
  }
}

// Update Webflow project with short description
async function updateWebflowProject(webflowId: string, shortDescription: string): Promise<void> {
  if (!WEBFLOW_API_TOKEN || !webflowId) return;

  try {
    const response = await fetch(
      `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/${webflowId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldData: {
            'project-short-description': shortDescription,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Webflow update error:', response.status, error);
    } else {
      console.log('Updated Webflow project:', webflowId);
    }
  } catch (error) {
    console.error('Error updating Webflow:', error);
  }
}

// Process a single project
async function processProject(projectId: string): Promise<{ success: boolean; shortDescription?: string; error?: string }> {
  const supabase = getSupabaseClient();

  // Get project
  const { data: project, error: fetchError } = await supabase
    .from('projects')
    .select('id, name, description, short_description, webflow_id')
    .eq('id', projectId)
    .single();

  if (fetchError || !project) {
    return { success: false, error: fetchError?.message || 'Project not found' };
  }

  if (!project.description) {
    return { success: false, error: 'No description to summarize' };
  }

  // Generate short description
  const shortDescription = await generateShortDescription(project.description);

  if (!shortDescription) {
    return { success: false, error: 'Failed to generate short description' };
  }

  // Update Supabase
  const { error: updateError } = await supabase
    .from('projects')
    .update({ short_description: shortDescription })
    .eq('id', projectId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  console.log(`Updated project ${project.name}: "${shortDescription}"`);

  // Update Webflow if project has webflow_id
  if (project.webflow_id) {
    await updateWebflowProject(project.webflow_id, shortDescription);
  }

  return { success: true, shortDescription };
}

// Backfill projects without short descriptions
async function backfillProjects(limit: number): Promise<{ processed: number; success: number; failed: number; results: Array<{ name: string; result: string }> }> {
  const supabase = getSupabaseClient();

  // Get projects without short descriptions
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, description, webflow_id')
    .is('short_description', null)
    .not('description', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !projects) {
    console.error('Error fetching projects:', error);
    return { processed: 0, success: 0, failed: 0, results: [] };
  }

  const results: Array<{ name: string; result: string }> = [];
  let success = 0;
  let failed = 0;

  for (const project of projects) {
    // Rate limit: Claude has generous limits but let's be safe
    if (results.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const shortDescription = await generateShortDescription(project.description);

    if (shortDescription) {
      // Update Supabase
      const { error: updateError } = await supabase
        .from('projects')
        .update({ short_description: shortDescription })
        .eq('id', project.id);

      if (!updateError) {
        success++;
        results.push({ name: project.name, result: shortDescription });

        // Update Webflow
        if (project.webflow_id) {
          await updateWebflowProject(project.webflow_id, shortDescription);
          await new Promise(resolve => setTimeout(resolve, 100)); // Webflow rate limit
        }
      } else {
        failed++;
        results.push({ name: project.name, result: `Error: ${updateError.message}` });
      }
    } else {
      failed++;
      results.push({ name: project.name, result: 'Failed to generate' });
    }
  }

  return { processed: projects.length, success, failed, results };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Check API key
  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ success: false, error: 'ANTHROPIC_API_KEY not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));

    // Backfill mode
    if (body.mode === 'backfill') {
      const limit = body.limit || 10;
      console.log(`Backfilling ${limit} projects...`);

      const result = await backfillProjects(limit);

      return new Response(
        JSON.stringify({ success: true, ...result }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Single project mode
    if (body.project_id) {
      const result = await processProject(body.project_id);

      return new Response(
        JSON.stringify(result),
        { status: result.success ? 200 : 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Trigger mode (from database trigger via pg_net)
    if (body.record?.id && body.record?.description) {
      // Only generate if short_description is null or empty
      if (!body.record.short_description) {
        const result = await processProject(body.record.id);
        return new Response(
          JSON.stringify(result),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ success: true, message: 'Short description already exists' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Missing project_id or mode' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Handler error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
