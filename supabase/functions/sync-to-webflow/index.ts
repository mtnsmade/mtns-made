// Supabase Edge Function: Sync Members, Projects & Events to Webflow CMS
// Triggers on INSERT/UPDATE/DELETE from members/projects/events table via Database Webhook
// Maps data to Webflow CMS API v2 format

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Environment variables (set in Supabase Dashboard → Edge Functions → Secrets)
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';
const WEBFLOW_SITE_ID = Deno.env.get('WEBFLOW_SITE_ID') || '6481b864324e32f8eb266e2f';
const WEBFLOW_PROJECTS_COLLECTION_ID = Deno.env.get('WEBFLOW_PROJECTS_COLLECTION_ID') || '64aa150f02bee661d503cf59';
const WEBFLOW_EVENTS_COLLECTION_ID = '64aa21e9193adf43b765fcf1';
const WEBFLOW_MEMBERS_COLLECTION_ID = '64a938756620ae4bee88df34';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const MEMBERSTACK_API_KEY = Deno.env.get('MEMBERSTACK_API_KEY') || '';

// Site URL for building Webflow member URLs
const SITE_URL = 'https://www.mtnsmade.com.au';

// Storage bucket names
const PROJECT_IMAGES_BUCKET = 'project-images';
const EVENT_IMAGES_BUCKET = 'event-images';

// Webflow API v2 base URL
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: ProjectRecord | EventRecord | MemberRecord | null;
  old_record: ProjectRecord | EventRecord | MemberRecord | null;
}

interface MemberRecord {
  id: string;
  memberstack_id: string;
  webflow_id: string | null;
  email: string | null;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  slug: string | null;
  business_name: string | null;
  bio: string | null;
  profile_image_url: string | null;
  header_image_url: string | null;
  suburb_id: string | null;
  membership_type_id: string | null;
  business_address: string | null;
  show_address: boolean;
  show_opening_hours: boolean;
  opening_monday: string | null;
  opening_tuesday: string | null;
  opening_wednesday: string | null;
  opening_thursday: string | null;
  opening_friday: string | null;
  opening_saturday: string | null;
  opening_sunday: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  tiktok: string | null;
  youtube: string | null;
  subscription_status: string;
  is_creative_space: boolean;
  is_supplier: boolean;
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
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

interface EventRecord {
  id: string;
  webflow_id: string | null;
  memberstack_id: string | null;
  eventbrite_id: string | null;
  name: string;
  slug: string | null;
  member_id: string | null;
  member_contact_email: string | null;
  time_display: string | null;
  date_display: string | null;
  date_start: string | null;
  date_end: string | null;
  date_expiry: string | null;
  location_name: string | null;
  location_address: string | null;
  suburb_id: string | null;
  short_description: string | null;
  description: string | null;
  feature_image_url: string | null;
  rsvp_link: string | null;
  is_mtns_made_event: boolean;
  is_featured: boolean;
  is_past: boolean;
  is_archived: boolean;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

interface CategoryData {
  webflow_id: string;
}

import { sendEmail, FROM_HELLO } from '../_shared/gmail.ts';

// Initialize Supabase client with service role key
function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// Delete a single event image by extracting its storage path from the public URL.
// More precise than deleting the whole member folder — avoids wiping images from
// other events belonging to the same member.
async function deleteEventImageByUrl(imageUrl: string): Promise<void> {
  if (!imageUrl) return;
  const supabase = getSupabaseClient();
  const marker = `/storage/v1/object/public/${EVENT_IMAGES_BUCKET}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) {
    console.warn('Could not extract storage path from URL:', imageUrl);
    return;
  }
  const filePath = decodeURIComponent(imageUrl.substring(idx + marker.length));
  const { error } = await supabase.storage.from(EVENT_IMAGES_BUCKET).remove([filePath]);
  if (error) {
    console.error('Error deleting event image:', filePath, error);
  } else {
    console.log('Deleted event image:', filePath);
  }
}

// Delete all images from storage
async function deleteImagesFromStorage(bucket: string, folderPath: string): Promise<void> {
  const supabase = getSupabaseClient();

  try {
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list(folderPath);

    if (listError) {
      console.error(`Error listing images in ${bucket}:`, listError);
      return;
    }

    if (!files || files.length === 0) {
      console.log(`No images to delete in ${bucket}/${folderPath}`);
      return;
    }

    const filePaths = files.map(file => `${folderPath}/${file.name}`);

    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove(filePaths);

    if (deleteError) {
      console.error(`Error deleting images from ${bucket}:`, deleteError);
    } else {
      console.log(`Deleted ${filePaths.length} images from ${bucket}/${folderPath}`);
    }
  } catch (error) {
    console.error('Error in deleteImagesFromStorage:', error);
  }
}

// Delete all images for a project from storage
async function deleteProjectImages(memberstackId: string, projectId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const folderPath = `${memberstackId}/${projectId}`;

  try {
    // List all files in the project folder
    const { data: files, error: listError } = await supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
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
      .from(PROJECT_IMAGES_BUCKET)
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
// includeSlug: only include slug on create, not update (to avoid creating redirects/aliases)
async function mapToWebflowFields(record: ProjectRecord, includeSlug: boolean = true): Promise<Record<string, unknown>> {
  const fieldData: Record<string, unknown> = {
    name: record.name,
  };

  // Only include slug on create (not update) to avoid duplicate slug issues
  if (includeSlug) {
    fieldData.slug = record.slug;
  }

  // Description
  if (record.description) {
    fieldData['project-description'] = record.description;
  }

  // Short description (AI-generated summary)
  if (record.short_description) {
    fieldData['project-short-description'] = record.short_description;
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
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/publish`,
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

// Check if a Webflow item with the same supabase-id already exists.
// Paginates through the full collection (Webflow max 100/page).
// Falls back to matching by memberstack-id + name for pre-2026 items
// that were created before the supabase-id field existed.
async function findExistingWebflowItem(
  supabaseId: string,
  memberstackId?: string,
  projectName?: string,
): Promise<{ id: string; slug: string } | null> {
  try {
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await fetch(
        `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('Error checking for existing Webflow item:', response.status);
        return null;
      }

      const data = await response.json();
      const items: Array<{ id: string; fieldData: Record<string, unknown> }> = data.items ?? [];

      // Primary match: supabase-id (set on all items created since ~2026)
      const bySupabaseId = items.find(item => item.fieldData['supabase-id'] === supabaseId);
      if (bySupabaseId) {
        console.log(`Found existing Webflow item by supabase-id ${supabaseId}: ${bySupabaseId.id}`);
        return { id: bySupabaseId.id, slug: bySupabaseId.fieldData['slug'] as string };
      }

      // Fallback: match by memberstack-id + name for pre-supabase-id items
      if (memberstackId && projectName) {
        const byMemberAndName = items.find(item =>
          item.fieldData['memberstack-id'] === memberstackId &&
          (item.fieldData['name'] as string)?.trim().toLowerCase() === projectName.trim().toLowerCase()
        );
        if (byMemberAndName) {
          console.log(`Found existing Webflow item by memberstack-id+name for "${projectName}": ${byMemberAndName.id}`);
          return { id: byMemberAndName.id, slug: byMemberAndName.fieldData['slug'] as string };
        }
      }

      const total: number = data.pagination?.total ?? 0;
      offset += items.length;
      if (offset >= total || items.length === 0) break;
    }

    return null;
  } catch (error) {
    console.error('Error in findExistingWebflowItem:', error);
    return null;
  }
}

// Create item in Webflow CMS
// Returns { id, slug } where slug is the actual slug assigned by Webflow
async function createWebflowItem(record: ProjectRecord): Promise<{ id: string; slug: string } | null> {
  // DUPLICATE PREVENTION: Check Webflow directly for existing item
  const existingItem = await findExistingWebflowItem(record.id, record.memberstack_id, record.name);
  if (existingItem) {
    console.log(`Duplicate prevention: Webflow item already exists for project ${record.id}, returning existing`);
    // Update Supabase with the existing Webflow ID if it doesn't have it
    const supabase = getSupabaseClient();
    await supabase
      .from('projects')
      .update({ webflow_id: existingItem.id })
      .eq('id', record.id)
      .is('webflow_id', null);
    return existingItem;
  }

  const fieldData = await mapToWebflowFields(record, true); // Include slug on create

  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items`,
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
  // Get the actual slug assigned by Webflow (may differ from what we sent)
  const actualSlug = result.fieldData?.slug || fieldData.slug;
  console.log('Webflow item created:', itemId, 'slug:', actualSlug);

  // Update the item to set portfolio-item-id to its own Webflow ID
  await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/${itemId}`,
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

  return { id: itemId, slug: actualSlug };
}

// Update item in Webflow CMS
async function updateWebflowItem(webflowId: string, record: ProjectRecord): Promise<void> {
  const fieldData = await mapToWebflowFields(record, false); // Don't update slug

  // Include portfolio-item-id in updates
  fieldData['portfolio-item-id'] = webflowId;

  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/${webflowId}`,
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
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/${webflowId}`,
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

// Update member reference on all existing projects for a member
async function updateProjectsWithMemberWebflowId(memberstackId: string, memberWebflowId: string): Promise<void> {
  const supabase = getSupabaseClient();

  // Get all projects for this member that have a webflow_id
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, webflow_id, name')
    .eq('memberstack_id', memberstackId)
    .not('webflow_id', 'is', null);

  if (error) {
    console.error('Error fetching member projects:', error);
    return;
  }

  if (!projects || projects.length === 0) {
    console.log('No existing projects to update for member');
    return;
  }

  console.log(`Updating ${projects.length} projects with member Webflow ID: ${memberWebflowId}`);

  for (const project of projects) {
    try {
      const response = await fetch(
        `${WEBFLOW_API_BASE}/collections/${WEBFLOW_PROJECTS_COLLECTION_ID}/items/${project.webflow_id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fieldData: {
              'webflow-member-id': memberWebflowId,
              'member': memberWebflowId,
            },
          }),
        }
      );

      if (response.ok) {
        console.log(`Updated project "${project.name}" with member reference`);
        // Re-publish the project
        await publishWebflowItem(project.webflow_id);
      } else {
        const errorText = await response.text();
        console.error(`Failed to update project "${project.name}":`, errorText);
      }
    } catch (err) {
      console.error(`Error updating project "${project.name}":`, err);
    }
  }
}

// Update Supabase project with Webflow ID and actual slug
async function updateSupabaseWithWebflowId(projectId: string, webflowId: string, actualSlug?: string): Promise<void> {
  const supabase = getSupabaseClient();

  const updateData: { webflow_id: string; slug?: string } = { webflow_id: webflowId };
  if (actualSlug) {
    updateData.slug = actualSlug;
  }

  const { error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', projectId);

  if (error) {
    console.error('Error updating Supabase with Webflow ID:', error);
    throw error;
  }

  console.log(`Updated project ${projectId} with Webflow ID: ${webflowId}${actualSlug ? `, slug: ${actualSlug}` : ''}`);
}

// ============================================
// EVENT FUNCTIONS
// ============================================

// Get suburb Webflow ID
async function getSuburbWebflowId(suburbId: string): Promise<string | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('suburbs')
    .select('webflow_id')
    .eq('id', suburbId)
    .single();

  if (error) {
    console.error('Error fetching suburb:', error);
    return null;
  }

  return data?.webflow_id || null;
}

// Map Supabase event record to Webflow field data
async function mapEventToWebflowFields(record: EventRecord): Promise<Record<string, unknown>> {
  const fieldData: Record<string, unknown> = {
    name: record.name,
    slug: record.slug || record.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  };

  // Description
  if (record.description) {
    fieldData['description'] = record.description;
  }

  // Short description (auto-generate if not provided)
  // Must be single-line for Webflow - strip newlines
  if (record.short_description) {
    fieldData['short-description'] = record.short_description.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  } else if (record.description) {
    // Auto-generate: strip newlines, take first 150 chars
    const cleanDesc = record.description.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    fieldData['short-description'] = cleanDesc.substring(0, 150) + (cleanDesc.length > 150 ? '...' : '');
  }

  // Date & Time
  if (record.date_start) {
    fieldData['date-event-starts'] = record.date_start;
  }
  if (record.date_end) {
    fieldData['date-event-ends'] = record.date_end;
  }
  if (record.date_expiry) {
    fieldData['event-expiry-date'] = record.date_expiry;
  }
  if (record.time_display) {
    fieldData['time'] = record.time_display;
  }

  // Location - Webflow uses 'street-address' for location name
  if (record.location_name) {
    fieldData['street-address'] = record.location_name;
  }
  if (record.location_address) {
    fieldData['location-full-street-address'] = record.location_address;
  }

  // Suburb reference
  if (record.suburb_id) {
    const suburbWebflowId = await getSuburbWebflowId(record.suburb_id);
    if (suburbWebflowId) {
      fieldData['choose-suburb'] = suburbWebflowId;
    }
  }

  // Feature image - Webflow uses 'image' not 'feature-image'
  if (record.feature_image_url) {
    fieldData['image'] = { url: record.feature_image_url };
  }

  // Links
  if (record.rsvp_link) {
    fieldData['rsvp-link'] = record.rsvp_link;
  }
  if (record.eventbrite_id) {
    fieldData['eventbrite-event-id'] = record.eventbrite_id;
  }

  // Memberstack ID
  if (record.memberstack_id) {
    fieldData['memberstack-id'] = record.memberstack_id;

    // Get the submitting member's Webflow ID for members-mentioned
    const memberWebflowId = await getMemberWebflowId(record.memberstack_id);
    if (memberWebflowId) {
      fieldData['members-involved-in-this-event'] = [memberWebflowId];
    }
  }

  // Member contact email
  if (record.member_contact_email) {
    fieldData['member-contact-email'] = record.member_contact_email;
  }

  return fieldData;
}

// Create event in Webflow CMS
async function createWebflowEvent(record: EventRecord): Promise<string | null> {
  const fieldData = await mapEventToWebflowFields(record);

  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_EVENTS_COLLECTION_ID}/items`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        fieldData,
        isDraft: record.is_draft,
        isArchived: record.is_archived,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Webflow create event error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  const itemId = result.id;
  console.log('Webflow event created:', itemId);

  // Publish if not draft
  if (!record.is_draft) {
    await publishWebflowEvent(itemId);
  }

  return itemId;
}

// Update event in Webflow CMS
async function updateWebflowEvent(webflowId: string, record: EventRecord): Promise<void> {
  const fieldData = await mapEventToWebflowFields(record);

  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_EVENTS_COLLECTION_ID}/items/${webflowId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        fieldData,
        isDraft: record.is_draft,
        isArchived: record.is_archived,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Webflow update event error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  console.log('Webflow event updated:', webflowId);

  // Re-publish if not draft
  if (!record.is_draft) {
    await publishWebflowEvent(webflowId);
  }
}

// Delete event from Webflow CMS
async function deleteWebflowEvent(webflowId: string): Promise<void> {
  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_EVENTS_COLLECTION_ID}/items/${webflowId}`,
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
    console.error('Webflow delete event error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  console.log('Webflow event deleted:', webflowId);
}

// Publish event in Webflow CMS
async function publishWebflowEvent(itemId: string): Promise<void> {
  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_EVENTS_COLLECTION_ID}/items/publish`,
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

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error('Webflow publish event HTTP error:', response.status, result);
    throw new Error(`Webflow publish failed (HTTP ${response.status})`);
  }

  // The publish endpoint returns 202 even for validation errors — check the body
  const errors: string[] = (result as { errors?: string[] }).errors ?? [];
  if (errors.length > 0) {
    console.error('Webflow publish event validation errors:', errors, 'itemId:', itemId);
    throw new Error(`Webflow publish validation error: ${errors.join(', ')}`);
  }

  console.log('Webflow event published:', itemId);
}

// Update Supabase event with Webflow ID
async function updateEventWithWebflowId(eventId: string, webflowId: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('events')
    .update({ webflow_id: webflowId })
    .eq('id', eventId);

  if (error) {
    console.error('Error updating event with Webflow ID:', error);
    throw error;
  }

  console.log(`Updated event ${eventId} with Webflow ID: ${webflowId}`);
}

// ============================================
// MEMBERSTACK SYNC FUNCTIONS
// ============================================

// Update Memberstack member with Webflow ID and URL
async function updateMemberstack(memberstackId: string, webflowId: string, slug: string): Promise<void> {
  if (!MEMBERSTACK_API_KEY) {
    console.log('MEMBERSTACK_API_KEY not configured, skipping Memberstack sync');
    return;
  }

  const webflowUrl = `${SITE_URL}/members/${slug}`;

  try {
    const response = await fetch(
      `https://admin.memberstack.com/members/${memberstackId}`,
      {
        method: 'PATCH',
        headers: {
          'X-API-KEY': MEMBERSTACK_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customFields: {
            'webflow-member-id': webflowId,
            'member-webflow-url': webflowUrl,
            'onboarding-complete': true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Memberstack update error:', response.status, errorText);
    } else {
      console.log('Memberstack updated with Webflow ID and URL:', memberstackId);
    }
  } catch (error) {
    console.error('Error updating Memberstack:', error);
  }
}

// ============================================
// MEMBER FUNCTIONS
// ============================================

// Get member's category Webflow IDs
async function getMemberCategoryWebflowIds(memberId: string): Promise<string[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('member_sub_directories')
    .select(`
      sub_directories (
        webflow_id
      )
    `)
    .eq('member_id', memberId);

  if (error) {
    console.error('Error fetching member categories:', error);
    return [];
  }

  const webflowIds: string[] = [];
  if (data) {
    for (const item of data) {
      const subDir = item.sub_directories as unknown as CategoryData;
      if (subDir?.webflow_id) {
        webflowIds.push(subDir.webflow_id);
      }
    }
  }

  return webflowIds;
}

// Generate a clean slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/-+/g, '-');
}

// Check if a slug exists in Webflow
async function checkWebflowSlugExists(slug: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items?slug=${encodeURIComponent(slug)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.items && result.items.length > 0;
  } catch {
    return false;
  }
}

// Find an available slug by appending numbers if needed
async function findAvailableSlug(baseSlug: string): Promise<string> {
  // First try the base slug
  const exists = await checkWebflowSlugExists(baseSlug);
  if (!exists) {
    return baseSlug;
  }

  // Try appending numbers: -2, -3, etc.
  for (let i = 2; i <= 99; i++) {
    const candidateSlug = `${baseSlug}-${i}`;
    const candidateExists = await checkWebflowSlugExists(candidateSlug);
    if (!candidateExists) {
      return candidateSlug;
    }
  }

  // Fallback: append timestamp
  return `${baseSlug}-${Date.now().toString(36)}`;
}

// Get membership type Webflow ID from Supabase
async function getMembershipTypeWebflowId(membershipTypeId: string): Promise<string | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('membership_types')
    .select('webflow_id')
    .eq('id', membershipTypeId)
    .single();

  if (error || !data) {
    console.error('Error fetching membership type:', error);
    return null;
  }

  return data.webflow_id;
}

// Get membership type slug from Supabase
async function getMembershipTypeSlug(membershipTypeId: string): Promise<string | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('membership_types')
    .select('slug')
    .eq('id', membershipTypeId)
    .single();

  if (error || !data) {
    console.error('Error fetching membership type slug:', error);
    return null;
  }

  return data.slug;
}

// Check if membership type should use business name for slug
function isBusinessMembershipType(membershipSlug: string | null): boolean {
  const businessTypes = ['small-business', 'large-business', 'not-for-profit', 'partner', 'spaces-suppliers'];
  return membershipSlug ? businessTypes.includes(membershipSlug) : false;
}

// Map Supabase member record to Webflow field data
async function mapMemberToWebflowFields(record: MemberRecord, includeSlug: boolean = true): Promise<Record<string, unknown>> {
  // Debug: log image URLs
  console.log('Member image URLs:', {
    profile_image_url: record.profile_image_url,
    header_image_url: record.header_image_url,
  });

  const displayName = [record.first_name, record.last_name].filter(Boolean).join(' ')
    || record.name
    || record.email?.split('@')[0]
    || 'Member';
  const fieldData: Record<string, unknown> = {
    name: displayName,
  };

  // Only include slug on create (not update) to avoid duplicate slug errors
  if (includeSlug) {
    // Determine if this is a business membership type
    // Business types (small-business, large-business, not-for-profit, partner, spaces-suppliers): use business name
    // Individual types (emerging, professional): use first name + last name
    const membershipSlug = record.membership_type_id
      ? await getMembershipTypeSlug(record.membership_type_id)
      : null;
    const useBusinessName = isBusinessMembershipType(membershipSlug) && record.business_name;

    let baseSlug: string;
    if (useBusinessName) {
      baseSlug = generateSlug(record.business_name!);
    } else if (record.slug) {
      // Use existing slug from Supabase if available
      baseSlug = record.slug;
    } else if (record.first_name && record.last_name) {
      baseSlug = generateSlug(`${record.first_name} ${record.last_name}`);
    } else if (record.first_name) {
      // Partial name — use first name only rather than falling back to business name
      baseSlug = generateSlug(record.first_name);
    } else {
      // No personal name available — use email prefix as a safe fallback.
      // NOTE: This should be rare. If it happens, the member's profile is incomplete
      // at sync time. The slug will be based on the email prefix, not the business name.
      // Do NOT fall back to record.name — for individual types (emerging, professional)
      // record.name may hold the business name, which creates a misleading slug.
      const emailPrefix = record.email?.split('@')[0];
      baseSlug = emailPrefix ? generateSlug(emailPrefix) : 'member';
      console.warn(`Slug fallback to email prefix for member ${record.id} (${record.email}): first/last name not set at sync time. Membership type: ${membershipSlug}`);
    }

    // Find an available slug
    fieldData.slug = await findAvailableSlug(baseSlug);
    console.log(`Generated slug: ${fieldData.slug} (base: ${baseSlug}, membershipType: ${membershipSlug}, useBusinessName: ${useBusinessName})`);
  }

  // Memberstack ID
  fieldData['memberstack-id'] = record.memberstack_id;

  // Names
  if (record.first_name) {
    fieldData['first-name'] = record.first_name;
  }
  if (record.last_name) {
    fieldData['last-name'] = record.last_name;
  }

  // Email
  if (record.email) {
    fieldData['email-address'] = record.email;
  }

  // Bio
  if (record.bio) {
    fieldData['member-bio'] = record.bio;
  }

  // Profile image
  if (record.profile_image_url) {
    fieldData['profile-image'] = { url: record.profile_image_url };
  }

  // Header/feature image
  if (record.header_image_url) {
    fieldData['header-image'] = { url: record.header_image_url };
  }

  // Business name - always include to allow clearing
  fieldData['trading-or-business-name'] = record.business_name || '';

  // Suburb reference
  if (record.suburb_id) {
    const suburbWebflowId = await getSuburbWebflowId(record.suburb_id);
    if (suburbWebflowId) {
      fieldData['suburb'] = suburbWebflowId;
    }
  }

  // Membership type reference
  if (record.membership_type_id) {
    const membershipTypeWebflowId = await getMembershipTypeWebflowId(record.membership_type_id);
    if (membershipTypeWebflowId) {
      fieldData['choose-membership-type'] = membershipTypeWebflowId;
      console.log(`Set membership type: ${membershipTypeWebflowId}`);
    }
  }

  // Social links - always include to allow clearing values
  fieldData['website'] = record.website || '';
  fieldData['instagram'] = record.instagram || '';
  fieldData['fcaebook'] = record.facebook || ''; // Note: typo in Webflow field name
  fieldData['linkedin'] = record.linkedin || '';
  fieldData['tiktok'] = record.tiktok || '';
  fieldData['youtube'] = record.youtube || '';

  // Opening hours
  if (record.opening_monday) {
    fieldData['opening-monday'] = record.opening_monday;
  }
  if (record.opening_tuesday) {
    fieldData['opening-tuesday'] = record.opening_tuesday;
  }
  if (record.opening_wednesday) {
    fieldData['opening-wednesday'] = record.opening_wednesday;
  }
  if (record.opening_thursday) {
    fieldData['opening-thursday'] = record.opening_thursday;
  }
  if (record.opening_friday) {
    fieldData['opening-friday'] = record.opening_friday;
  }
  if (record.opening_saturday) {
    fieldData['opening-saturday'] = record.opening_saturday;
  }
  if (record.opening_sunday) {
    fieldData['opening-sunday'] = record.opening_sunday;
  }

  // Display preferences
  fieldData['member-wants-to-display-public-address'] = record.show_address || false;
  fieldData['member-wants-to-display-public-opening-hours'] = record.show_opening_hours || false;

  // Categories (sub-directories)
  const categoryWebflowIds = await getMemberCategoryWebflowIds(record.id);
  if (categoryWebflowIds.length > 0) {
    fieldData['chosen-directories'] = categoryWebflowIds;
  }

  // Space/Supplier flags
  fieldData['member-is-creative-space'] = record.is_creative_space || false;
  fieldData['member-is-supplier'] = record.is_supplier || false;

  // Debug: log what we're sending to Webflow
  console.log('Webflow fieldData images:', {
    'profile-image': fieldData['profile-image'],
    'header-image': fieldData['header-image'],
  });

  return fieldData;
}

// Create member in Webflow CMS
// Returns { id, slug } where slug is the actual slug assigned by Webflow
async function createWebflowMember(record: MemberRecord): Promise<{ id: string; slug: string } | null> {
  const fieldData = await mapMemberToWebflowFields(record, true); // Include slug on create

  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        fieldData,
        isDraft: record.subscription_status !== 'active' || !record.profile_complete,
        isArchived: record.subscription_status === 'lapsed',
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Webflow create member error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  const itemId = result.id;
  // Get the actual slug assigned by Webflow (may be truncated/modified)
  const actualSlug = result.fieldData?.slug || fieldData.slug;
  console.log('Webflow member created:', itemId, 'slug:', actualSlug);

  // Publish if active and profile complete
  if (record.subscription_status === 'active' && record.profile_complete) {
    await publishWebflowMember(itemId);

    // Send "profile is live" email for new members
    if (record.email && actualSlug) {
      await sendProfileLiveEmail(record, actualSlug);
    }
  }

  return { id: itemId, slug: actualSlug };
}

// Update member in Webflow CMS
async function updateWebflowMember(webflowId: string, record: MemberRecord): Promise<void> {
  const fieldData = await mapMemberToWebflowFields(record, false); // Don't update slug

  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/${webflowId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        fieldData,
        isDraft: record.subscription_status !== 'active' || !record.profile_complete,
        isArchived: record.subscription_status === 'lapsed',
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Webflow update member error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  console.log('Webflow member updated:', webflowId);

  // Publish to apply changes
  console.log('Publishing member after update...');
  await publishWebflowMember(webflowId);
}

// Delete member from Webflow CMS
async function deleteWebflowMember(webflowId: string): Promise<void> {
  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/${webflowId}`,
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
    console.error('Webflow delete member error:', response.status, errorText);
    throw new Error(`Webflow API error: ${response.status} - ${errorText}`);
  }

  console.log('Webflow member deleted:', webflowId);
}

// Send "Your Profile is Live" email
async function sendProfileLiveEmail(record: MemberRecord, slug: string): Promise<void> {
  const firstName = record.first_name || record.name?.split(' ')[0] || 'there';
  const profileUrl = `${SITE_URL}/members/${slug}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 24px;">Your profile is now live!</h1>

      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        Hi ${firstName},
      </p>

      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        Great news! Your MTNS MADE profile has been published and is now visible in our creative directory.
      </p>

      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        <a href="${profileUrl}" style="color: #0066cc; text-decoration: underline;">View your profile</a>
      </p>

      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        <strong>What's next?</strong>
      </p>

      <ul style="color: #333; font-size: 16px; line-height: 1.8;">
        <li>Add projects to showcase your work</li>
        <li>Share your profile link on social media</li>
        <li>Connect with other creatives in the Blue Mountains</li>
      </ul>

      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        Welcome to the MTNS MADE community!
      </p>

      <p style="color: #888; font-size: 14px; margin-top: 40px;">
        — The MTNS MADE Team
      </p>
    </div>
  `;

  try {
    const result = await sendEmail({
      to: record.email!,
      subject: 'Your MTNS MADE profile is now live!',
      html,
      from: FROM_HELLO,
    });

    if (result.success) {
      console.log('Profile live email sent to:', record.email);
    } else {
      console.error('Failed to send profile live email:', result.error);
    }
  } catch (error) {
    console.error('Error sending profile live email:', error);
  }
}

// Publish member in Webflow CMS
async function publishWebflowMember(itemId: string): Promise<void> {
  console.log('Attempting to publish member:', itemId);

  const response = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/publish`,
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

  const responseText = await response.text();

  if (!response.ok) {
    console.error('Webflow publish member error:', response.status, responseText);
  } else {
    console.log('Webflow member published successfully:', itemId, responseText);
  }
}

// Update Supabase member with Webflow ID
async function updateMemberWithWebflowId(memberId: string, webflowId: string, actualSlug?: string): Promise<void> {
  const supabase = getSupabaseClient();

  const updateData: { webflow_id: string; slug?: string } = { webflow_id: webflowId };
  if (actualSlug) {
    updateData.slug = actualSlug;
  }

  const { error } = await supabase
    .from('members')
    .update(updateData)
    .eq('id', memberId);

  if (error) {
    console.error('Error updating member with Webflow ID:', error);
    throw error;
  }

  console.log(`Updated member ${memberId} with Webflow ID: ${webflowId}${actualSlug ? `, slug: ${actualSlug}` : ''}`);
}

// Handle member webhook
async function handleMemberWebhook(payload: WebhookPayload): Promise<void> {
  const record = payload.record as MemberRecord | null;
  const oldRecord = payload.old_record as MemberRecord | null;

  switch (payload.type) {
    case 'INSERT': {
      if (!record) {
        throw new Error('No record in INSERT payload');
      }

      // Skip if already has Webflow ID
      if (record.webflow_id) {
        console.log('Member already has Webflow ID, skipping');
        break;
      }

      // Only create in Webflow if profile is complete
      if (!record.profile_complete) {
        console.log('Member profile not complete, skipping Webflow sync');
        break;
      }

      const webflowResult = await createWebflowMember(record);

      if (webflowResult) {
        // Update Supabase with Webflow ID and actual slug (may differ from what we sent)
        await updateMemberWithWebflowId(record.id, webflowResult.id, webflowResult.slug);
        // Sync Webflow ID and URL back to Memberstack using actual slug
        await updateMemberstack(record.memberstack_id, webflowResult.id, webflowResult.slug);
        // Update any existing projects to link them to this member
        await updateProjectsWithMemberWebflowId(record.memberstack_id, webflowResult.id);
      }

      break;
    }

    case 'UPDATE': {
      if (!record) {
        throw new Error('No record in UPDATE payload');
      }

      // If member is lapsed, archive in Webflow
      if (record.subscription_status === 'lapsed' && record.webflow_id) {
        await updateWebflowMember(record.webflow_id, record);
        break;
      }

      // If no Webflow ID yet and profile is complete, create
      if (!record.webflow_id && record.profile_complete) {
        const webflowResult = await createWebflowMember(record);
        if (webflowResult) {
          // Update Supabase with Webflow ID and actual slug (may differ from what we sent)
          await updateMemberWithWebflowId(record.id, webflowResult.id, webflowResult.slug);
          // Sync Webflow ID and URL back to Memberstack using actual slug
          await updateMemberstack(record.memberstack_id, webflowResult.id, webflowResult.slug);
          // Update any existing projects to link them to this member
          await updateProjectsWithMemberWebflowId(record.memberstack_id, webflowResult.id);
        }
        break;
      }

      // If has Webflow ID, update
      if (record.webflow_id) {
        await updateWebflowMember(record.webflow_id, record);
      }

      break;
    }

    case 'DELETE': {
      if (oldRecord?.webflow_id) {
        await deleteWebflowMember(oldRecord.webflow_id);
      }
      break;
    }

    default:
      console.log('Unknown webhook type:', payload.type);
  }
}

// Handle event webhook
async function handleEventWebhook(payload: WebhookPayload): Promise<void> {
  const record = payload.record as EventRecord | null;
  const oldRecord = payload.old_record as EventRecord | null;

  switch (payload.type) {
    case 'INSERT': {
      if (!record) {
        throw new Error('No record in INSERT payload');
      }

      if (record.webflow_id) {
        console.log('Event already has Webflow ID, skipping');
        break;
      }

      const webflowId = await createWebflowEvent(record);

      if (webflowId) {
        await updateEventWithWebflowId(record.id, webflowId);
      }

      break;
    }

    case 'UPDATE': {
      if (!record) {
        throw new Error('No record in UPDATE payload');
      }

      // If event is being archived/deleted
      if (record.is_archived && record.webflow_id) {
        await deleteWebflowEvent(record.webflow_id);

        // Delete only this event's image (not the entire member folder)
        if (record.feature_image_url) {
          await deleteEventImageByUrl(record.feature_image_url);
        }

        break;
      }

      if (!record.webflow_id) {
        // Re-check Supabase for webflow_id to prevent duplicates from race conditions
        const supabase = getSupabaseClient();
        const { data: currentEvent } = await supabase
          .from('events')
          .select('webflow_id')
          .eq('id', record.id)
          .single();

        if (currentEvent?.webflow_id) {
          console.log('Event already has Webflow ID (race condition prevented), updating instead');
          await updateWebflowEvent(currentEvent.webflow_id, record);
          break;
        }

        const webflowId = await createWebflowEvent(record);
        if (webflowId) {
          await updateEventWithWebflowId(record.id, webflowId);
        }
        break;
      }

      await updateWebflowEvent(record.webflow_id, record);
      break;
    }

    case 'DELETE': {
      if (oldRecord?.webflow_id) {
        await deleteWebflowEvent(oldRecord.webflow_id);
      }

      // Delete only this event's image (not the entire member folder)
      if (oldRecord?.feature_image_url) {
        await deleteEventImageByUrl(oldRecord.feature_image_url);
      }

      break;
    }

    default:
      console.log('Unknown webhook type:', payload.type);
  }
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

    // Handle members table
    if (payload.table === 'members') {
      await handleMemberWebhook(payload);
      return new Response(
        JSON.stringify({ success: true, type: payload.type, table: 'members' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Handle events table
    if (payload.table === 'events') {
      await handleEventWebhook(payload);
      return new Response(
        JSON.stringify({ success: true, type: payload.type, table: 'events' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Handle projects table
    if (payload.table !== 'projects') {
      return new Response(JSON.stringify({ message: `Ignored: ${payload.table} table not handled` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const record = payload.record as ProjectRecord | null;
    const oldRecord = payload.old_record as ProjectRecord | null;

    switch (payload.type) {
      case 'INSERT': {
        if (!record) {
          throw new Error('No record in INSERT payload');
        }

        if (record.webflow_id) {
          console.log('Project already has Webflow ID, skipping');
          break;
        }

        // Re-check Supabase for webflow_id to prevent duplicates from race conditions
        // (another webhook might have already created the Webflow item)
        const supabase = getSupabaseClient();
        const { data: currentProject } = await supabase
          .from('projects')
          .select('webflow_id')
          .eq('id', record.id)
          .single();

        if (currentProject?.webflow_id) {
          console.log('Project already has Webflow ID (race condition prevented in INSERT), skipping');
          break;
        }

        const webflowResult = await createWebflowItem(record);

        if (webflowResult) {
          await updateSupabaseWithWebflowId(record.id, webflowResult.id, webflowResult.slug);
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
          // Skip: the INSERT webhook is solely responsible for creating new Webflow items.
          // A common race: the `generate-project-summary` trigger writes `short_description`
          // to Supabase within seconds of project creation, firing this UPDATE webhook before
          // the INSERT webhook has finished writing `webflow_id`. If we try to create here we
          // get duplicate Webflow items. The INSERT webhook will write `webflow_id` shortly
          // after, triggering another UPDATE webhook at which point the item already exists
          // and `updateWebflowItem` below handles it correctly.
          // Legacy items with missing webflow_id are handled by the check-consistency function.
          console.log(`Project ${record.id} has no webflow_id in UPDATE — skipping (INSERT webhook handles creation)`);
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
