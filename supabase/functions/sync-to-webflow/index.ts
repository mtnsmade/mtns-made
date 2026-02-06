// Supabase Edge Function: Sync Projects to Webflow CMS
// Triggers on INSERT/UPDATE/DELETE from projects table via Database Webhook
// Maps project data to Webflow CMS API v2 format

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Environment variables (set in Supabase Dashboard → Edge Functions → Secrets)
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';
const WEBFLOW_SITE_ID = Deno.env.get('WEBFLOW_SITE_ID') || '6481b864324e32f8eb266e2f';
const WEBFLOW_COLLECTION_ID = Deno.env.get('WEBFLOW_COLLECTION_ID') || '64aa150f02bee661d503cf59';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Webflow API v2 base URL
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: ProjectRecord | null;
  old_record: ProjectRecord | null;
}

interface ProjectRecord {
  id: string;
  webflow_id: string | null;
  memberstack_id: string;
  name: string;
  slug: string;
  description: string | null;
  feature_image_url: string | null;
  gallery_images: string[] | null;
  external_link: string | null;
  showreel_link: string | null;
  display_order: number | null;
  is_draft: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface WebflowFieldData {
  name: string;
  slug: string;
  'project-description'?: string;
  'feature-image'?: { url: string };
  'project-multi-image'?: { url: string }[];
  'project-external-link'?: string;
  'showreel-link'?: string;
  'display-order'?: number;
  'portfolio-item-id'?: string;
  'memberstack-id'?: string;
}

// Initialize Supabase client with service role key (for updating webflow_id)
function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// Map Supabase project record to Webflow field data
function mapToWebflowFields(record: ProjectRecord): WebflowFieldData {
  const fieldData: WebflowFieldData = {
    name: record.name,
    slug: record.slug,
  };

  // Description
  if (record.description) {
    fieldData['project-description'] = record.description;
  }

  // Feature image (Webflow v2 image format)
  if (record.feature_image_url) {
    fieldData['feature-image'] = { url: record.feature_image_url };
  }

  // Gallery images (Webflow v2 multi-image format)
  if (record.gallery_images && record.gallery_images.length > 0) {
    fieldData['project-multi-image'] = record.gallery_images.map(url => ({ url }));
  }

  // External link
  if (record.external_link) {
    fieldData['project-external-link'] = record.external_link;
  }

  // Showreel link
  if (record.showreel_link) {
    fieldData['showreel-link'] = record.showreel_link;
  }

  // Display order
  if (record.display_order !== null) {
    fieldData['display-order'] = record.display_order;
  }

  // IDs for reference
  fieldData['portfolio-item-id'] = record.id;
  fieldData['memberstack-id'] = record.memberstack_id;

  return fieldData;
}

// Create item in Webflow CMS
async function createWebflowItem(record: ProjectRecord): Promise<string | null> {
  const fieldData = mapToWebflowFields(record);

  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_COLLECTION_ID}/items`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        fieldData,
        isArchived: record.is_deleted,
        isDraft: record.is_draft,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Webflow create error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log('Webflow item created:', result.id);
  return result.id;
}

// Update item in Webflow CMS
async function updateWebflowItem(webflowId: string, record: ProjectRecord): Promise<void> {
  const fieldData = mapToWebflowFields(record);

  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_COLLECTION_ID}/items/${webflowId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        fieldData,
        isArchived: record.is_deleted,
        isDraft: record.is_draft,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Webflow update error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  console.log('Webflow item updated:', webflowId);
}

// Delete (archive) item in Webflow CMS
async function deleteWebflowItem(webflowId: string): Promise<void> {
  // Webflow v2 uses archive instead of hard delete for CMS items
  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_COLLECTION_ID}/items/${webflowId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        isArchived: true,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Webflow delete/archive error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  console.log('Webflow item archived:', webflowId);
}

// Update Supabase project with Webflow ID
async function updateSupabaseWithWebflowId(projectId: string, webflowId: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('projects')
    .update({ webflow_id: webflowId })
    .eq('id', projectId);

  if (error) {
    console.error('Error updating Supabase with Webflow ID:', error);
    throw error;
  }

  console.log(`Updated project ${projectId} with Webflow ID: ${webflowId}`);
}

// Main handler
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Validate environment
    if (!WEBFLOW_API_TOKEN) {
      throw new Error('WEBFLOW_API_TOKEN not configured');
    }

    const payload: WebhookPayload = await req.json();
    console.log('Received webhook:', payload.type, payload.table);

    // Only process projects table
    if (payload.table !== 'projects') {
      return new Response(JSON.stringify({ message: 'Ignored: not projects table' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const record = payload.record;
    const oldRecord = payload.old_record;

    switch (payload.type) {
      case 'INSERT': {
        if (!record) {
          throw new Error('No record in INSERT payload');
        }

        // Skip if already has webflow_id (shouldn't happen, but safety check)
        if (record.webflow_id) {
          console.log('Project already has Webflow ID, skipping');
          break;
        }

        // Create in Webflow
        const webflowId = await createWebflowItem(record);

        // Update Supabase with the new Webflow ID
        if (webflowId) {
          await updateSupabaseWithWebflowId(record.id, webflowId);
        }

        break;
      }

      case 'UPDATE': {
        if (!record) {
          throw new Error('No record in UPDATE payload');
        }

        // If project is being soft-deleted
        if (record.is_deleted && record.webflow_id) {
          await deleteWebflowItem(record.webflow_id);
          break;
        }

        // If no Webflow ID, create new item
        if (!record.webflow_id) {
          const webflowId = await createWebflowItem(record);
          if (webflowId) {
            await updateSupabaseWithWebflowId(record.id, webflowId);
          }
          break;
        }

        // Otherwise update existing
        await updateWebflowItem(record.webflow_id, record);
        break;
      }

      case 'DELETE': {
        // Hard delete - archive in Webflow
        if (oldRecord?.webflow_id) {
          await deleteWebflowItem(oldRecord.webflow_id);
        }
        break;
      }

      default:
        console.log('Unknown webhook type:', payload.type);
    }

    return new Response(
      JSON.stringify({ success: true, type: payload.type }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
