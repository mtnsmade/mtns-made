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

// Storage bucket name
const STORAGE_BUCKET = 'project-images';

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
  member_id: string | null;
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

interface CategoryData {
  webflow_id: string;
}

// Initialize Supabase client with service role key
function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// Delete all images for a project from storage
async function deleteProjectImages(memberstackId: string, projectId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const folderPath = `${memberstackId}/${projectId}`;

  try {
    // List all files in the project folder
    const { data: files, error: listError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folderPath);

    if (listError) {
      console.error('Error listing project images:', listError);
      return;
    }

    if (!files || files.length === 0) {
      console.log('No images to delete for project:', projectId);
      return;
    }

    // Build array of file paths to delete
    const filePaths = files.map(file => `${folderPath}/${file.name}`);

    // Delete all files
    const { error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(filePaths);

    if (deleteError) {
      console.error('Error deleting project images:', deleteError);
    } else {
      console.log(`Deleted ${filePaths.length} images for project:`, projectId);
    }
  } catch (error) {
    console.error('Error in deleteProjectImages:', error);
  }
}

// Get member's Webflow ID from members table
async function getMemberWebflowId(memberstackId: string): Promise<string | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('members')
    .select('webflow_id')
    .eq('memberstack_id', memberstackId)
    .single();

  if (error) {
    console.error('Error fetching member:', error);
    return null;
  }

  return data?.webflow_id || null;
}

// Get category Webflow IDs for a project
async function getCategoryWebflowIds(projectId: string): Promise<string[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('project_sub_directories')
    .select(`
      sub_directories (
        webflow_id
      )
    `)
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  // Extract webflow_ids from the joined data
  const webflowIds: string[] = [];
  if (data) {
    for (const item of data) {
      const subDir = item.sub_directories as unknown as CategoryData;
      if (subDir?.webflow_id) {
        webflowIds.push(subDir.webflow_id);
      }
    }
  }

  console.log('Category Webflow IDs:', webflowIds);
  return webflowIds;
}

// Map Supabase project record to Webflow field data
async function mapToWebflowFields(record: ProjectRecord): Promise<Record<string, unknown>> {
  const fieldData: Record<string, unknown> = {
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

  // Supabase ID
  fieldData['supabase-id'] = record.id;

  // Memberstack ID
  fieldData['memberstack-id'] = record.memberstack_id;

  // Get member's Webflow ID and set both the text field and reference
  const memberWebflowId = await getMemberWebflowId(record.memberstack_id);
  if (memberWebflowId) {
    fieldData['webflow-member-id'] = memberWebflowId;
    fieldData['member'] = memberWebflowId;
  }

  // Get category Webflow IDs for multi-reference
  const categoryWebflowIds = await getCategoryWebflowIds(record.id);
  if (categoryWebflowIds.length > 0) {
    fieldData['relevant-directory-categories'] = categoryWebflowIds;
  }

  return fieldData;
}

// Publish a single item in Webflow CMS
async function publishWebflowItem(itemId: string): Promise<void> {
  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_COLLECTION_ID}/items/publish`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        itemIds: [itemId],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Webflow publish error:', response.status, errorText);
  } else {
    console.log('Webflow item published:', itemId);
  }
}

// Create item in Webflow CMS
async function createWebflowItem(record: ProjectRecord): Promise<string | null> {
  const fieldData = await mapToWebflowFields(record);

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
        isDraft: false,
        isArchived: false,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Webflow create error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  const itemId = result.id;
  console.log('Webflow item created:', itemId);

  // Update the item to set portfolio-item-id to its own Webflow ID
  await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_COLLECTION_ID}/items/${itemId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        fieldData: {
          'portfolio-item-id': itemId,
        },
      }),
    }
  );
  console.log('Portfolio item ID set:', itemId);

  // Publish the item
  await publishWebflowItem(itemId);

  return itemId;
}

// Update item in Webflow CMS
async function updateWebflowItem(webflowId: string, record: ProjectRecord): Promise<void> {
  const fieldData = await mapToWebflowFields(record);

  // Include portfolio-item-id in updates
  fieldData['portfolio-item-id'] = webflowId;

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
        isDraft: false,
        isArchived: false,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Webflow update error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  console.log('Webflow item updated:', webflowId);

  // Re-publish after update
  await publishWebflowItem(webflowId);
}

// Hard delete item from Webflow CMS
async function deleteWebflowItem(webflowId: string): Promise<void> {
  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_COLLECTION_ID}/items/${webflowId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Webflow delete error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  console.log('Webflow item deleted:', webflowId);
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    if (!WEBFLOW_API_TOKEN) {
      throw new Error('WEBFLOW_API_TOKEN not configured');
    }

    const payload: WebhookPayload = await req.json();
    console.log('Received webhook:', payload.type, payload.table);

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

        if (record.webflow_id) {
          console.log('Project already has Webflow ID, skipping');
          break;
        }

        const webflowId = await createWebflowItem(record);

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
          // Delete from Webflow
          await deleteWebflowItem(record.webflow_id);

          // Delete images from storage
          await deleteProjectImages(record.memberstack_id, record.id);

          break;
        }

        if (!record.webflow_id) {
          const webflowId = await createWebflowItem(record);
          if (webflowId) {
            await updateSupabaseWithWebflowId(record.id, webflowId);
          }
          break;
        }

        await updateWebflowItem(record.webflow_id, record);
        break;
      }

      case 'DELETE': {
        // Hard delete - delete from Webflow and storage
        if (oldRecord?.webflow_id) {
          await deleteWebflowItem(oldRecord.webflow_id);
        }

        // Delete images from storage
        if (oldRecord) {
          await deleteProjectImages(oldRecord.memberstack_id, oldRecord.id);
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
