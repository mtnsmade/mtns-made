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

// Initialize Supabase client with service role key
function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
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

// Create item in Webflow CMS
async function createWebflowItem(record: ProjectRecord): Promise<string | null> {
  const fieldData = await mapToWebflowFields(record);

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
  console.log('Webflow item created:', itemId);

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

  return itemId;
}

// Update item in Webflow CMS
async function updateWebflowItem(webflowId: string, record: ProjectRecord): Promise<void> {
  const fieldData = await mapToWebflowFields(record);

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
  if (record.short_description) {
    fieldData['short-description'] = record.short_description;
  } else if (record.description) {
    // Auto-generate: first 150 chars
    fieldData['short-description'] = record.description.substring(0, 150) + (record.description.length > 150 ? '...' : '');
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

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Webflow publish event error:', response.status, errorText);
  } else {
    console.log('Webflow event published:', itemId);
  }
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

// Map Supabase member record to Webflow field data
async function mapMemberToWebflowFields(record: MemberRecord, includeSlug: boolean = true): Promise<Record<string, unknown>> {
  // Debug: log image URLs
  console.log('Member image URLs:', {
    profile_image_url: record.profile_image_url,
    header_image_url: record.header_image_url,
  });

  const fieldData: Record<string, unknown> = {
    name: record.name || record.email?.split('@')[0] || 'Member',
  };

  // Only include slug on create (not update) to avoid duplicate slug errors
  if (includeSlug) {
    // Business accounts use business_name, individuals use firstname-lastname
    let baseSlug: string;
    if (record.business_name) {
      baseSlug = generateSlug(record.business_name);
    } else if (record.slug) {
      baseSlug = record.slug;
    } else if (record.first_name && record.last_name) {
      baseSlug = generateSlug(`${record.first_name} ${record.last_name}`);
    } else if (record.name) {
      baseSlug = generateSlug(record.name);
    } else {
      baseSlug = 'member';
    }

    // Find an available slug
    fieldData.slug = await findAvailableSlug(baseSlug);
    console.log(`Generated slug: ${fieldData.slug} (base: ${baseSlug})`);
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

  // Business name
  if (record.business_name) {
    fieldData['trading-or-business-name'] = record.business_name;
  }

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
async function createWebflowMember(record: MemberRecord): Promise<string | null> {
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
  console.log('Webflow member created:', itemId);

  // Publish if active and profile complete
  if (record.subscription_status === 'active' && record.profile_complete) {
    await publishWebflowMember(itemId);
  }

  return itemId;
}

// Update member in Webflow CMS
async function updateWebflowMember(webflowId: string, record: MemberRecord): Promise<void> {
  const fieldData = await mapMemberToWebflowFields(record, false); // Don't update slug

  // Extract image fields to send separately (Webflow image update workaround)
  const imageFields: Record<string, unknown> = {};
  if (fieldData['profile-image']) {
    imageFields['profile-image'] = fieldData['profile-image'];
    delete fieldData['profile-image'];
  }
  if (fieldData['header-image']) {
    imageFields['header-image'] = fieldData['header-image'];
    delete fieldData['header-image'];
  }
  const hasImageUpdates = Object.keys(imageFields).length > 0;

  console.log('Updating member (images handled separately):', webflowId);
  console.log('Image fields to update:', JSON.stringify(imageFields));

  // Send main update WITHOUT images
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

  console.log('Webflow member updated (without images):', webflowId);

  // Now send images in a SEPARATE request (include name to satisfy Webflow validation)
  if (hasImageUpdates) {
    console.log('Sending image update separately...');
    const imageFieldsWithName = {
      name: record.name || record.email?.split('@')[0] || 'Member',
      ...imageFields,
    };
    console.log('Image request payload:', JSON.stringify(imageFieldsWithName));

    const imageResponse = await fetch(
      `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items/${webflowId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({ fieldData: imageFieldsWithName }),
      }
    );

    const imageResponseText = await imageResponse.text();
    console.log('Webflow image update response:', imageResponse.status, imageResponseText);

    if (!imageResponse.ok) {
      console.error('Webflow image update error:', imageResponse.status, imageResponseText);
    } else {
      // Parse and check what Webflow actually stored
      try {
        const imageResult = JSON.parse(imageResponseText);
        console.log('Webflow stored profile-image:', JSON.stringify(imageResult.fieldData?.['profile-image']));
        console.log('Webflow stored header-image:', JSON.stringify(imageResult.fieldData?.['header-image']));
      } catch (e) {
        console.log('Could not parse image response');
      }
    }
  }

  // Publish to apply all changes
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
async function updateMemberWithWebflowId(memberId: string, webflowId: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('members')
    .update({ webflow_id: webflowId })
    .eq('id', memberId);

  if (error) {
    console.error('Error updating member with Webflow ID:', error);
    throw error;
  }

  console.log(`Updated member ${memberId} with Webflow ID: ${webflowId}`);
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

      const webflowId = await createWebflowMember(record);

      if (webflowId) {
        await updateMemberWithWebflowId(record.id, webflowId);
        // Sync Webflow ID and URL back to Memberstack
        if (record.slug) {
          await updateMemberstack(record.memberstack_id, webflowId, record.slug);
        }
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
        const webflowId = await createWebflowMember(record);
        if (webflowId) {
          await updateMemberWithWebflowId(record.id, webflowId);
          // Sync Webflow ID and URL back to Memberstack
          if (record.slug) {
            await updateMemberstack(record.memberstack_id, webflowId, record.slug);
          }
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

        // Delete images from storage
        if (record.memberstack_id) {
          await deleteImagesFromStorage(EVENT_IMAGES_BUCKET, record.memberstack_id);
        }

        break;
      }

      if (!record.webflow_id) {
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

      // Delete images from storage
      if (oldRecord?.memberstack_id) {
        await deleteImagesFromStorage(EVENT_IMAGES_BUCKET, oldRecord.memberstack_id);
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
