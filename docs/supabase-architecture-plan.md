# MTNS MADE - Supabase Architecture Plan

## Current Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Memberstack   │     │   Uploadcare    │     │     Zapier      │
│                 │     │                 │     │                 │
│ - Auth          │     │ - Temp uploads  │     │ - Webhooks      │
│ - Member fields │     │ - 24hr expiry   │     │ - Sync to       │
│ - JSON blobs:   │     │                 │     │   Webflow       │
│   - projects    │     └─────────────────┘     └────────┬────────┘
│   - events      │                                      │
└─────────────────┘                                      │
                                                         ▼
                                              ┌─────────────────┐
                                              │   Webflow CMS   │
                                              │                 │
                                              │ - Members       │
                                              │ - Projects      │
                                              │ - Events        │
                                              └─────────────────┘
```

**Problems:**
- Uploadcare URLs expire after 24hrs
- JSON blobs in Memberstack are hard to update partially
- Complex Zapier logic to parse/update JSON
- No proper relational data model

---

## Proposed Architecture with Supabase

```
┌─────────────────┐     ┌─────────────────────────────────────────┐
│   Memberstack   │     │              Supabase                    │
│                 │     │                                          │
│ - Auth only     │     │  ┌─────────────┐    ┌─────────────────┐ │
│ - Basic profile │◄───►│  │  Database   │    │    Storage      │ │
│ - Supabase link │     │  │             │    │                 │ │
└─────────────────┘     │  │ - members   │    │ - Permanent     │ │
                        │  │ - projects  │    │   image hosting │ │
                        │  │ - events    │    │ - Organized by  │ │
                        │  │             │    │   member/project│ │
                        │  └──────┬──────┘    └─────────────────┘ │
                        │         │                                │
                        │  ┌──────▼──────┐                        │
                        │  │   Edge      │                        │
                        │  │  Functions  │                        │
                        │  │             │                        │
                        │  │ - Sync to   │                        │
                        │  │   Webflow   │                        │
                        │  └──────┬──────┘                        │
                        └─────────┼────────────────────────────────┘
                                  │
                                  ▼
                        ┌─────────────────┐
                        │   Webflow CMS   │
                        │                 │
                        │ - Members       │
                        │ - Projects      │
                        │ - Events        │
                        └─────────────────┘
```

---

## Database Schema

### Webflow → Supabase Field Mapping (Members)

| Webflow Field | Webflow Type | Supabase Column | Supabase Type |
|---------------|--------------|-----------------|---------------|
| Name | Plain text | `name` | TEXT |
| Slug | Plain text | `slug` | TEXT |
| First name | Plain text | `first_name` | TEXT |
| Last Name | Plain text | `last_name` | TEXT |
| Trading or Business Name | Plain text | `business_name` | TEXT |
| Email Address | Email | `email` | TEXT |
| Profile Image | Image | `profile_image_url` | TEXT |
| Header Image | Image | `header_image_url` | TEXT |
| Suburb | Reference | `suburb_id` | TEXT |
| Member Bio | Plain text | `bio` | TEXT |
| Member short summary | Plain text | `short_summary` | TEXT |
| Status | Option | `status` | TEXT |
| Choose Membership Type | Reference | `membership_type_id` | TEXT |
| Webflow ID | Plain text | `webflow_id` | TEXT |
| Memberstack ID | Plain text | `memberstack_id` | TEXT |
| ~~Airtable ID~~ | ~~Plain text~~ | — | *Redundant* |
| ~~Zapier Table ID~~ | ~~Plain text~~ | — | *Redundant* |
| Main Directories | Multi-reference | `main_directories` | TEXT[] |
| Chosen directories | Multi-reference | `chosen_directories` | TEXT[] |
| Supplier Categories | Multi-reference | `supplier_categories` | TEXT[] |
| Space Category | Multi-reference | `space_categories` | TEXT[] |
| Portfolio Items | Multi-reference | — | *Managed via projects table* |
| ~~Portfolio Item One~~ | ~~Reference~~ | — | *Redundant* |
| ~~Member Links~~ | ~~Multi-reference~~ | — | *Redundant* |
| Member is small business... | Switch | `is_business` | BOOLEAN |
| Member is Creative Space | Switch | `is_creative_space` | BOOLEAN |
| Member is Supplier | Switch | `is_supplier` | BOOLEAN |
| Member wants to display public address | Switch | `show_address` | BOOLEAN |
| Member wants to display public opening hours | Switch | `show_opening_hours` | BOOLEAN |
| Opening Monday | Plain text | `opening_monday` | TEXT |
| Opening Tuesday | Plain text | `opening_tuesday` | TEXT |
| Opening Wednesday | Plain text | `opening_wednesday` | TEXT |
| Opening Thursday | Plain text | `opening_thursday` | TEXT |
| Opening Friday | Plain text | `opening_friday` | TEXT |
| Opening Saturday | Plain text | `opening_saturday` | TEXT |
| Opening Sunday | Plain text | `opening_sunday` | TEXT |
| Website | Link | `website` | TEXT |
| Instagram | Link | `instagram` | TEXT |
| Facebook | Link | `facebook` | TEXT |
| LinkedIn | Link | `linkedin` | TEXT |
| Tiktok | Link | `tiktok` | TEXT |
| Youtube | Link | `youtube` | TEXT |

### Members Table
```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- System IDs (for sync)
  memberstack_id TEXT UNIQUE NOT NULL,
  webflow_id TEXT UNIQUE,

  -- Basic Info (Webflow: Name, Slug)
  name TEXT,                     -- Display name (computed or manual)
  slug TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,

  -- Business Info
  business_name TEXT,            -- "Trading or Business Name"
  suburb_id TEXT,                -- Reference to Suburbs collection

  -- Profile Content
  bio TEXT,                      -- "Member Bio"
  short_summary TEXT,            -- "Member short summary" (AI generated)

  -- Images (Supabase Storage URLs)
  profile_image_url TEXT,        -- "Profile Image"
  header_image_url TEXT,         -- "Header Image"

  -- Membership & Status
  membership_type_id TEXT,       -- Reference: "Choose Membership Type"
  status TEXT,                   -- Option: Status field

  -- Member Type Flags
  is_business BOOLEAN DEFAULT false,        -- "Member is small business, large business or not for profit"
  is_creative_space BOOLEAN DEFAULT false,  -- "Member is Creative Space"
  is_supplier BOOLEAN DEFAULT false,        -- "Member is Supplier"

  -- Display Preferences
  show_address BOOLEAN DEFAULT false,       -- "Member wants to display public address"
  show_opening_hours BOOLEAN DEFAULT false, -- "Member wants to display public opening hours"

  -- Opening Hours (individual fields to match Webflow)
  opening_monday TEXT,
  opening_tuesday TEXT,
  opening_wednesday TEXT,
  opening_thursday TEXT,
  opening_friday TEXT,
  opening_saturday TEXT,
  opening_sunday TEXT,

  -- Categories (Multi-reference → TEXT arrays of Webflow IDs)
  main_directories TEXT[],       -- "Main Directories"
  chosen_directories TEXT[],     -- "Chosen directories" (sub-directories)
  supplier_categories TEXT[],    -- "Supplier Categories"
  space_categories TEXT[],       -- "Space Category"

  -- Portfolio: Managed via projects table (foreign key relationship)
  -- No need to store Webflow refs - projects table handles this

  -- Social Links
  website TEXT,
  instagram TEXT,
  facebook TEXT,
  linkedin TEXT,
  tiktok TEXT,
  youtube TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_members_memberstack ON members(memberstack_id);
CREATE INDEX idx_members_webflow ON members(webflow_id);
CREATE INDEX idx_members_slug ON members(slug);
CREATE INDEX idx_members_status ON members(status);
```

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  webflow_id TEXT,

  -- Content
  name TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,

  -- Images (Supabase Storage URLs)
  feature_image_url TEXT,
  images JSONB DEFAULT '[]',
  -- Format: [{"url": "https://...", "alt": "...", "order": 0}, ...]
  -- Maps directly to Webflow multi-image field
  -- Maximum: 15 images per project (enforced in application)

  -- Links
  showreel_link TEXT,
  external_link TEXT,

  -- Categories
  categories TEXT[],

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_projects_member ON projects(member_id);
```

### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  webflow_id TEXT,

  -- Content
  name TEXT NOT NULL,
  description TEXT,
  feature_image_url TEXT,

  -- Event Details
  event_date DATE,
  event_time TEXT,
  location TEXT,
  ticket_url TEXT,

  -- Metadata
  status TEXT DEFAULT 'pending',  -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_member ON events(member_id);
```

---

## Storage Structure

```
supabase-storage/
├── members/
│   └── {memberstack_id}/
│       ├── profile.jpg
│       └── feature.jpg
├── projects/
│   └── {project_id}/
│       ├── feature.jpg
│       └── images/
│           ├── 0.jpg
│           ├── 1.jpg
│           └── ...  (flexible number of images)
└── events/
    └── {event_id}/
        └── feature.jpg
```

**Storage Policies:**
- Public read access for all images (they display on public site)
- Write access only for authenticated members (to their own folders)

---

## Row Level Security (RLS)

RLS restricts what the frontend (using anon key) can access. Set up BEFORE importing data.

### Enable RLS on All Tables
```sql
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
```

### Helper Function for Memberstack Auth
Since Memberstack handles auth (not Supabase Auth), we pass the memberstack_id via a custom setting:

```sql
-- Function to set current member context
CREATE OR REPLACE FUNCTION set_memberstack_id(memberstack_id TEXT)
RETURNS void AS $$
  SELECT set_config('app.memberstack_id', memberstack_id, false);
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to get current member context
CREATE OR REPLACE FUNCTION get_memberstack_id()
RETURNS TEXT AS $$
  SELECT current_setting('app.memberstack_id', true);
$$ LANGUAGE sql STABLE;

-- Grant execute to anon role
GRANT EXECUTE ON FUNCTION set_memberstack_id(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_memberstack_id() TO anon;
```

### Members Table Policies
```sql
-- Public read (members display on public site)
CREATE POLICY "Members are publicly readable"
  ON members FOR SELECT
  USING (true);

-- Members can update their own record only
CREATE POLICY "Members can update own record"
  ON members FOR UPDATE
  USING (memberstack_id = get_memberstack_id());

-- No direct insert/delete via anon key (handled by Edge Functions)
```

### Projects Table Policies
```sql
-- Public read (projects display on public site)
CREATE POLICY "Projects are publicly readable"
  ON projects FOR SELECT
  USING (true);

-- Members can insert projects for themselves only
CREATE POLICY "Members can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM members
      WHERE memberstack_id = get_memberstack_id()
    )
  );

-- Members can update their own projects only
CREATE POLICY "Members can update own projects"
  ON projects FOR UPDATE
  USING (
    member_id IN (
      SELECT id FROM members
      WHERE memberstack_id = get_memberstack_id()
    )
  );

-- Members can delete their own projects only
CREATE POLICY "Members can delete own projects"
  ON projects FOR DELETE
  USING (
    member_id IN (
      SELECT id FROM members
      WHERE memberstack_id = get_memberstack_id()
    )
  );
```

### Events Table Policies
```sql
-- Public read (approved events display on public site)
CREATE POLICY "Events are publicly readable"
  ON events FOR SELECT
  USING (true);

-- Members can insert events for themselves
CREATE POLICY "Members can insert own events"
  ON events FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM members
      WHERE memberstack_id = get_memberstack_id()
    )
  );

-- Members can update their own events
CREATE POLICY "Members can update own events"
  ON events FOR UPDATE
  USING (
    member_id IN (
      SELECT id FROM members
      WHERE memberstack_id = get_memberstack_id()
    )
  );

-- Members can delete their own events
CREATE POLICY "Members can delete own events"
  ON events FOR DELETE
  USING (
    member_id IN (
      SELECT id FROM members
      WHERE memberstack_id = get_memberstack_id()
    )
  );
```

### Storage Bucket Policies
```sql
-- Create the images bucket (if not exists via dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Public read for all images
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Members can upload to their own folders
CREATE POLICY "Members can upload own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    (
      -- Members folder: members/{memberstack_id}/*
      (storage.foldername(name))[1] = 'members' AND
      (storage.foldername(name))[2] = get_memberstack_id()
    ) OR (
      -- Projects folder: projects/{project_id}/*
      -- (verify project belongs to member via DB check)
      (storage.foldername(name))[1] = 'projects' AND
      EXISTS (
        SELECT 1 FROM projects p
        JOIN members m ON p.member_id = m.id
        WHERE p.id::text = (storage.foldername(name))[2]
        AND m.memberstack_id = get_memberstack_id()
      )
    ) OR (
      -- Events folder: events/{event_id}/*
      (storage.foldername(name))[1] = 'events' AND
      EXISTS (
        SELECT 1 FROM events e
        JOIN members m ON e.member_id = m.id
        WHERE e.id::text = (storage.foldername(name))[2]
        AND m.memberstack_id = get_memberstack_id()
      )
    )
  );

-- Members can update/delete their own images (same logic)
CREATE POLICY "Members can update own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'images' AND
    (
      (storage.foldername(name))[1] = 'members' AND
      (storage.foldername(name))[2] = get_memberstack_id()
    ) OR (
      (storage.foldername(name))[1] = 'projects' AND
      EXISTS (
        SELECT 1 FROM projects p
        JOIN members m ON p.member_id = m.id
        WHERE p.id::text = (storage.foldername(name))[2]
        AND m.memberstack_id = get_memberstack_id()
      )
    ) OR (
      (storage.foldername(name))[1] = 'events' AND
      EXISTS (
        SELECT 1 FROM events e
        JOIN members m ON e.member_id = m.id
        WHERE e.id::text = (storage.foldername(name))[2]
        AND m.memberstack_id = get_memberstack_id()
      )
    )
  );

CREATE POLICY "Members can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images' AND
    (
      (storage.foldername(name))[1] = 'members' AND
      (storage.foldername(name))[2] = get_memberstack_id()
    ) OR (
      (storage.foldername(name))[1] = 'projects' AND
      EXISTS (
        SELECT 1 FROM projects p
        JOIN members m ON p.member_id = m.id
        WHERE p.id::text = (storage.foldername(name))[2]
        AND m.memberstack_id = get_memberstack_id()
      )
    ) OR (
      (storage.foldername(name))[1] = 'events' AND
      EXISTS (
        SELECT 1 FROM events e
        JOIN members m ON e.member_id = m.id
        WHERE e.id::text = (storage.foldername(name))[2]
        AND m.memberstack_id = get_memberstack_id()
      )
    )
  );
```

### Frontend: Initialize Memberstack Context
```javascript
// Call this after Memberstack loads, before any Supabase operations
async function initSupabaseAuth() {
  const { data: member } = await window.$memberstackDom.getCurrentMember();

  if (member) {
    // Set memberstack_id for RLS policies
    const { error } = await supabase.rpc('set_memberstack_id', {
      memberstack_id: member.id
    });

    if (error) {
      console.error('Failed to set member context:', error);
    } else {
      console.log('Supabase auth context set for:', member.id);
    }
  }
}

// Initialize on page load
window.addEventListener('memberstack:ready', initSupabaseAuth);
```

### Testing RLS

After setup, test with anon key:
```javascript
// Should work: Read any member
const { data } = await supabase.from('members').select('*').limit(10);

// Should work: Update own record (after setting context)
await supabase.rpc('set_memberstack_id', { memberstack_id: 'mem_abc123' });
await supabase.from('members').update({ bio: 'New bio' }).eq('memberstack_id', 'mem_abc123');

// Should fail: Update someone else's record
await supabase.from('members').update({ bio: 'Hacked' }).eq('memberstack_id', 'mem_xyz789');
// Returns: { data: null, error: null, count: 0 } - silently does nothing
```

---

## JS Script Changes

### New Dependencies
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Initialization
```javascript
const supabase = supabase.createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);

// Link to Memberstack member
const memberstackId = currentMember.id;
```

### Image Upload (replaces Uploadcare)
```javascript
async function uploadImage(file, path) {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(path);

  return publicUrl;
}
```

### Project Image Upload Interface

With Supabase, we build a custom upload UI (no third-party widget like Uploadcare):

```html
<!-- HTML structure in Webflow -->
<div class="image-upload-area" data-max-images="15">
  <input type="file" id="project-images" multiple accept="image/*" hidden>
  <button type="button" class="upload-trigger">
    <span class="icon">+</span>
    <span>Add Images (max 15)</span>
  </button>

  <!-- Preview grid populated by JS -->
  <div class="image-preview-grid"></div>

  <p class="image-count">0 of 15 images</p>
</div>
```

```javascript
// Upload UI interaction
const MAX_IMAGES = 15;
let projectImages = []; // Holds current images

function setupImageUpload() {
  const input = document.getElementById('project-images');
  const trigger = document.querySelector('.upload-trigger');
  const previewGrid = document.querySelector('.image-preview-grid');

  // Click trigger to open file picker
  trigger.addEventListener('click', () => {
    if (projectImages.length >= MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    input.click();
  });

  // Handle file selection
  input.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - projectImages.length;
    const filesToUpload = files.slice(0, remaining);

    for (const file of filesToUpload) {
      // Show loading state
      const preview = createPreviewElement(file, 'uploading');
      previewGrid.appendChild(preview);

      // Upload to Supabase
      const url = await uploadToSupabase(file);

      // Update preview with actual URL
      preview.dataset.url = url;
      preview.classList.remove('uploading');

      projectImages.push({ url, alt: '', order: projectImages.length });
    }

    updateImageCount();
    input.value = ''; // Reset for next selection
  });
}

// Create draggable preview element
function createPreviewElement(file, status = '') {
  const div = document.createElement('div');
  div.className = `image-preview ${status}`;
  div.draggable = true;
  div.innerHTML = `
    <img src="${URL.createObjectURL(file)}" alt="Preview">
    <button type="button" class="remove-image">&times;</button>
    <div class="upload-spinner"></div>
  `;

  // Remove button handler
  div.querySelector('.remove-image').addEventListener('click', () => {
    const index = Array.from(div.parentNode.children).indexOf(div);
    projectImages.splice(index, 1);
    div.remove();
    updateImageCount();
  });

  return div;
}

// Drag and drop reordering
function setupDragReorder() {
  const grid = document.querySelector('.image-preview-grid');

  grid.addEventListener('dragstart', (e) => {
    e.target.classList.add('dragging');
  });

  grid.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(grid, e.clientX);
    if (afterElement) {
      grid.insertBefore(dragging, afterElement);
    } else {
      grid.appendChild(dragging);
    }
  });

  grid.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
    // Update order in projectImages array
    reorderImages();
  });
}

function updateImageCount() {
  document.querySelector('.image-count').textContent =
    `${projectImages.length} of ${MAX_IMAGES} images`;
}
```

```css
/* Basic styles for upload UI */
.image-upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 15px;
}

.image-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  cursor: grab;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-preview.uploading {
  opacity: 0.5;
}

.image-preview .remove-image {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.image-preview.dragging {
  opacity: 0.5;
}
```

### Project Multi-Image Upload
```javascript
// Upload multiple project images and save as JSONB array
async function uploadProjectImages(projectId, imageFiles) {
  const images = [];

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const path = `projects/${projectId}/images/${i}.jpg`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('images')
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(path);

    images.push({
      url: publicUrl,
      alt: `Project image ${i + 1}`,
      order: i
    });
  }

  // Save JSONB array to database
  const { data, error } = await supabase
    .from('projects')
    .update({ images })
    .eq('id', projectId)
    .select()
    .single();

  return data;
}

// Delete a specific image from project
async function deleteProjectImage(projectId, imageIndex) {
  // Get current images
  const { data: project } = await supabase
    .from('projects')
    .select('images')
    .eq('id', projectId)
    .single();

  // Remove from storage
  const path = `projects/${projectId}/images/${imageIndex}.jpg`;
  await supabase.storage.from('images').remove([path]);

  // Update JSONB array (filter out deleted image, reorder)
  const updatedImages = project.images
    .filter((_, i) => i !== imageIndex)
    .map((img, i) => ({ ...img, order: i }));

  await supabase
    .from('projects')
    .update({ images: updatedImages })
    .eq('id', projectId);
}
```

### Project CRUD (replaces Memberstack JSON)
```javascript
// Create project
async function createProject(projectData) {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      member_id: memberId,
      name: projectData.name,
      description: projectData.description,
      // ... other fields
    })
    .select()
    .single();

  return data;
}

// Update project
async function updateProject(projectId, updates) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();

  return data;
}

// Delete project
async function deleteProject(projectId) {
  // Delete images from storage first
  await supabase.storage
    .from('images')
    .remove([`projects/${projectId}`]);

  // Delete from database
  await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);
}

// Get member's projects
async function getProjects(memberId) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('member_id', memberId)
    .order('display_order');

  return data;
}
```

---

## Webflow Sync Options

### Option A: Edge Functions (Recommended)
Supabase Edge Functions triggered by database changes:

```typescript
// supabase/functions/sync-to-webflow/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { type, table, record } = await req.json()

  if (table === 'projects') {
    if (type === 'INSERT') {
      // Create in Webflow
      await createWebflowItem(record)
    } else if (type === 'UPDATE') {
      // Update in Webflow
      await updateWebflowItem(record)
    } else if (type === 'DELETE') {
      // Delete from Webflow
      await deleteWebflowItem(record.webflow_id)
    }
  }

  return new Response(JSON.stringify({ success: true }))
})

// Build Webflow payload from Supabase record
function buildWebflowPayload(record) {
  return {
    name: record.name,
    slug: generateSlug(record.name),
    description: record.description,
    'feature-image': { url: record.feature_image_url },
    // JSONB images array maps directly to Webflow multi-image field
    'project-images': record.images || [],
    'showreel-link': record.showreel_link,
    'external-link': record.external_link,
    // ... other fields
  };
}
```

**Pros:**
- Real-time sync
- Full control over logic
- Cheaper than Zapier at scale
- All code in one place

### Option B: Keep Zapier
Use Supabase webhooks to trigger Zapier:

1. Set up Supabase database webhook on INSERT/UPDATE/DELETE
2. Webhook calls Zapier
3. Zapier updates Webflow

**Pros:**
- Familiar workflow
- No code for sync logic
- Visual debugging in Zapier

---

## Migration Plan

### Parallel Development Strategy

Run new Supabase system alongside existing Zapier workflow during development:

```
PRODUCTION (Live)                    DEVELOPMENT (Beta)
─────────────────                    ──────────────────
/profile/projects                    /profile/projects-beta
/profile/edit-profile                /profile/edit-profile-beta
/profile/suggest-an-event            /profile/suggest-an-event-beta

member-projects.js                   member-projects-sb.js
member-edit-profile.js               member-edit-profile-sb.js
member-events.js                     member-events-sb.js

Memberstack JSON + Zapier            Supabase + Edge Functions
```

**Setup:**
1. Create beta pages in Webflow (duplicate existing, hide from nav)
2. Create new `-sb.js` script files for Supabase versions
3. Beta pages load Supabase scripts, production pages keep current scripts
4. Both systems write to Webflow CMS (so public site stays consistent)

**Data Sync During Development:**
```
Option A: One-time import (simpler)
─────────────────────────────────
- Import Webflow data to Supabase once
- Test with that snapshot
- Re-import before launch to catch any changes

Option B: Periodic sync (more accurate)
──────────────────────────────────────
- Run import script weekly/daily during dev
- Test data stays current with production
- More complex but useful for longer dev cycles

Option C: Dual-write during transition
─────────────────────────────────────
- Production continues writing to Memberstack + Zapier
- Also write to Supabase (shadow writes)
- Both systems stay in sync
- Most complex but safest for gradual rollout
```

**Cutover Process:**
1. Final data sync (Webflow → Supabase)
2. Verify record counts match
3. Update production pages to load Supabase scripts
4. Monitor for issues
5. Keep old scripts for 1 week (easy rollback)
6. Remove beta pages and old scripts

**Rollback Plan:**
If issues after cutover:
1. Revert page scripts to old versions (1 line change)
2. Members immediately back on Zapier workflow
3. Investigate and fix Supabase issues
4. Re-attempt cutover when ready

### Phase 1: Setup
1. Create Supabase project
2. Run database migrations (create tables)
3. Set up storage buckets with policies
4. Create Edge Functions for Webflow sync

### Phase 2: Update Scripts (4-6 hours)
1. Add Supabase client to all scripts
2. Replace Uploadcare with Supabase Storage uploads
3. Replace Memberstack JSON with Supabase DB calls
4. Test each workflow:
   - Member onboarding
   - Edit profile
   - Projects CRUD
   - Events CRUD

### Phase 3: Data Migration

**Source: Webflow CMS** (not Memberstack/Uploadcare - Webflow has the canonical data)

#### Step 1: Export from Webflow API
```javascript
// Migration script: export-webflow-data.js
const WEBFLOW_API_TOKEN = 'your-token';
const SITE_ID = 'your-site-id';

const COLLECTIONS = {
  members: 'collection-id-for-members',
  projects: 'collection-id-for-projects', // "Portfolio Items"
  events: 'collection-id-for-events',
};

async function exportCollection(collectionId, name) {
  const items = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items?offset=${offset}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${WEBFLOW_API_TOKEN}` } }
    );
    const data = await response.json();
    items.push(...data.items);

    if (data.items.length < limit) break;
    offset += limit;
  }

  // Save to JSON file
  fs.writeFileSync(`./exports/${name}.json`, JSON.stringify(items, null, 2));
  console.log(`Exported ${items.length} ${name}`);
  return items;
}
```

#### Step 2: Transform Data to Supabase Schema
```javascript
// Migration script: transform-members.js
function transformMember(webflowItem) {
  const fields = webflowItem.fieldData;

  return {
    webflow_id: webflowItem.id,
    memberstack_id: fields['memberstack-id'],
    name: fields.name,
    slug: fields.slug,
    first_name: fields['first-name'],
    last_name: fields['last-name'],
    email: fields['email-address'],
    business_name: fields['trading-or-business-name'],
    bio: fields['member-bio'],
    short_summary: fields['member-short-summary'],

    // Images - store Webflow URLs temporarily, will migrate to Storage
    profile_image_url: fields['profile-image']?.url || null,
    header_image_url: fields['header-image']?.url || null,

    // References - store Webflow IDs
    suburb_id: fields.suburb,
    membership_type_id: fields['choose-membership-type'],
    status: fields.status,

    // Multi-references - arrays of Webflow IDs
    main_directories: fields['main-directories'] || [],
    chosen_directories: fields['chosen-directories'] || [],
    supplier_categories: fields['supplier-categories'] || [],
    space_categories: fields['space-category'] || [],

    // Booleans
    is_business: fields['member-is-small-business-large-business-or-not-for-profit'] || false,
    is_creative_space: fields['member-is-creative-space'] || false,
    is_supplier: fields['member-is-supplier'] || false,
    show_address: fields['member-wants-to-display-public-address'] || false,
    show_opening_hours: fields['member-wants-to-display-public-opening-hours'] || false,

    // Opening hours
    opening_monday: fields['opening-monday'],
    opening_tuesday: fields['opening-tuesday'],
    opening_wednesday: fields['opening-wednesday'],
    opening_thursday: fields['opening-thursday'],
    opening_friday: fields['opening-friday'],
    opening_saturday: fields['opening-saturday'],
    opening_sunday: fields['opening-sunday'],

    // Social links
    website: fields.website,
    instagram: fields.instagram,
    facebook: fields.facebook || fields.fcaebook, // typo in Webflow
    linkedin: fields.linkedin,
    tiktok: fields.tiktok,
    youtube: fields.youtube,
  };
}
```

#### Step 3: Import to Supabase
```javascript
// Migration script: import-to-supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-service-role-key' // Use service role for migration
);

async function importMembers(transformedMembers) {
  // Batch insert (Supabase handles up to 1000 at a time)
  const batchSize = 500;

  for (let i = 0; i < transformedMembers.length; i += batchSize) {
    const batch = transformedMembers.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from('members')
      .upsert(batch, { onConflict: 'webflow_id' });

    if (error) {
      console.error(`Batch ${i / batchSize} failed:`, error);
    } else {
      console.log(`Imported batch ${i / batchSize + 1}`);
    }
  }
}
```

#### Step 4: Migrate Images to Supabase Storage
```javascript
// Migration script: migrate-images.js
async function migrateImages() {
  // Get all members with image URLs
  const { data: members } = await supabase
    .from('members')
    .select('id, memberstack_id, profile_image_url, header_image_url')
    .not('profile_image_url', 'is', null);

  for (const member of members) {
    // Download from Webflow CDN
    if (member.profile_image_url) {
      const imageBuffer = await downloadImage(member.profile_image_url);
      const path = `members/${member.memberstack_id}/profile.jpg`;

      // Upload to Supabase Storage
      await supabase.storage
        .from('images')
        .upload(path, imageBuffer, { contentType: 'image/jpeg', upsert: true });

      // Update member with new URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(path);

      await supabase
        .from('members')
        .update({ profile_image_url: publicUrl })
        .eq('id', member.id);
    }

    // Same for header_image_url...
  }
}

async function downloadImage(url) {
  const response = await fetch(url);
  return Buffer.from(await response.arrayBuffer());
}
```

#### Migration Checklist
- [ ] Get Webflow API token (Site Settings → Integrations → API Access)
- [ ] Get Webflow Collection IDs (CMS → Collection Settings → ID in URL)
- [ ] Create Supabase project
- [ ] Run database migrations (create tables)
- [ ] Create storage buckets with policies
- [ ] Run export script (Webflow → JSON files)
- [ ] Run transform script (Webflow format → Supabase format)
- [ ] Run import script (JSON → Supabase tables)
- [ ] Run image migration script (Webflow CDN → Supabase Storage)
- [ ] Verify record counts match
- [ ] Verify images accessible
- [ ] Test a few member profiles end-to-end

### Phase 4: Cleanup
1. Remove Uploadcare integration
2. Remove JSON fields from Memberstack (keep for backup initially)
3. Update/remove old Zapier zaps

---

## Cost Comparison

| Service | Current | With Supabase |
|---------|---------|---------------|
| Memberstack | $25/mo | $25/mo (reduced usage) |
| Uploadcare | Free (with limits) | $0 (removed) |
| Zapier | ~$20-50/mo | $0-20/mo (reduced/removed) |
| Supabase | $0 | $0 (free tier) |
| **Total** | ~$45-75/mo | ~$25-45/mo |

**Supabase Free Tier includes:**
- 500MB database
- 1GB storage
- 2GB bandwidth
- 500K Edge Function invocations
- Unlimited API requests

---

## Benefits Summary

1. **Permanent image storage** - No more 24hr expiry
2. **Proper data model** - Relational DB vs JSON blobs
3. **Easier updates** - Update single field, not entire JSON
4. **Better performance** - Indexed queries vs JSON parsing
5. **Cost savings** - Potentially cheaper than current setup
6. **More control** - Full access to data, no vendor lock-in
7. **Scalability** - PostgreSQL scales well
8. **Developer experience** - Great dashboard, logs, debugging

---

## Email, Notifications & AI Workflows

### Current Zapier Workflows

| Workflow | Trigger | Actions |
|----------|---------|---------|
| New Member Welcome | Memberstack signup | Send welcome email to member |
| Admin Notification | New member/project/event | Email admin about new content |
| Content Summary | New project/event created | ChatGPT summarizes description → store back |
| Webflow Sync | Data changes | Create/update Webflow CMS items |

### Options for Migration

#### Option A: Full Edge Functions (Most Control)

Replace Zapier entirely with Supabase Edge Functions + external services:

**Email Service Options:**
- **Resend** - Modern, developer-friendly, great free tier (100 emails/day)
- **Postmark** - Excellent deliverability, transactional focus
- **SendGrid** - Popular, generous free tier (100 emails/day)

**Example: Welcome Email Edge Function**
```typescript
// supabase/functions/send-welcome-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  const { record } = await req.json()

  // Send welcome email to new member
  await resend.emails.send({
    from: 'MTNS MADE <hello@mtnsmade.com>',
    to: record.email,
    subject: 'Welcome to MTNS MADE!',
    html: `<h1>Welcome ${record.first_name}!</h1>
           <p>Your creative journey starts here...</p>`
  })

  // Notify admin
  await resend.emails.send({
    from: 'MTNS MADE <notifications@mtnsmade.com>',
    to: 'admin@mtnsmade.com',
    subject: `New Member: ${record.first_name} ${record.last_name}`,
    html: `<p>A new ${record.membership_type} member has joined.</p>`
  })

  return new Response(JSON.stringify({ success: true }))
})
```

**Example: AI Content Summary Edge Function**
```typescript
// supabase/functions/summarize-content/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { record, table } = await req.json()

  // Call OpenAI/Anthropic API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Summarize this ${table} description in 2 sentences: ${record.description}`
      }]
    })
  })

  const data = await response.json()
  const summary = data.choices[0].message.content

  // Update record with summary
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  await supabase
    .from(table)
    .update({ ai_summary: summary })
    .eq('id', record.id)

  return new Response(JSON.stringify({ success: true, summary }))
})
```

**Pros:**
- Full control over logic
- Cheaper at scale
- All code in one place
- No external dependencies beyond email/AI APIs

**Cons:**
- More upfront development
- Need to handle email templates yourself

#### Option B: Hybrid Approach (Recommended for Migration)

Keep Zapier for emails/notifications, use Supabase for data + storage:

```
┌─────────────────┐     ┌─────────────────────────────────────────┐
│   Supabase      │     │              Zapier                      │
│                 │     │                                          │
│ - Database      │────►│ Webhook triggers:                       │
│ - Storage       │     │ - New member → Welcome email            │
│ - Edge Funcs    │     │ - New content → Admin notification      │
│   (Webflow sync)│     │ - New project → ChatGPT summary         │
└─────────────────┘     └─────────────────────────────────────────┘
```

**Database Triggers for Zapier:**
```sql
-- Create webhook function
CREATE OR REPLACE FUNCTION notify_zapier()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://hooks.zapier.com/hooks/catch/xxx/yyy',
    body := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'record', NEW
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on new members
CREATE TRIGGER on_member_insert
AFTER INSERT ON members
FOR EACH ROW EXECUTE FUNCTION notify_zapier();
```

**Pros:**
- Incremental migration (don't have to rebuild everything)
- Keep familiar Zapier workflows for emails
- Visual debugging in Zapier
- Email templates already built

**Cons:**
- Still paying for Zapier
- Data flows through two systems

### Recommendation

**Start with Hybrid (Option B):**
1. Move data + images to Supabase first
2. Keep Zapier for emails/notifications during transition
3. Later, migrate email workflows to Edge Functions if desired

**Migration Timeline:**
- Phase 1: Supabase for data + storage + Webflow sync
- Phase 2: Keep Zapier webhooks for emails/AI summaries
- Phase 3 (optional): Move emails to Edge Functions + Resend

---

## Next Steps

1. [ ] Create Supabase project
2. [ ] Set up database schema
3. [ ] Configure storage buckets
4. [ ] Create proof-of-concept with one workflow (e.g., projects)
5. [ ] Test and iterate
6. [ ] Roll out to other workflows
7. [ ] Migrate existing data
8. [ ] Set up Zapier webhook triggers from Supabase
9. [ ] (Future) Evaluate moving emails to Edge Functions
