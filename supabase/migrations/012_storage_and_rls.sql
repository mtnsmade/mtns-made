-- MTNS MADE Supabase Migration: Storage Bucket and RLS Policies
-- Creates project-images storage bucket and Row Level Security policies

-- ============================================
-- STORAGE BUCKET
-- ============================================

-- Create public bucket for project images
-- Folder structure: {memberstack_id}/{project_id}/{filename}
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,  -- Public bucket for CDN-style URLs
  10485760,  -- 10MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Allow anyone to read images (public bucket)
CREATE POLICY "Public read access for project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Allow authenticated users to upload images
-- Note: In practice, uploads will go through application code
-- that validates memberstack_id ownership
CREATE POLICY "Allow uploads to project-images bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-images');

-- Allow updates (for upsert operations)
CREATE POLICY "Allow updates to project-images bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-images');

-- Allow deletes
CREATE POLICY "Allow deletes from project-images bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images');

-- ============================================
-- PROJECT TABLE RLS POLICIES
-- ============================================

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Anyone can read published (non-deleted, non-draft) projects
CREATE POLICY "read_published_projects"
ON projects FOR SELECT
USING (is_deleted = false AND is_draft = false);

-- For member-specific write operations, the application code
-- will filter by memberstack_id. We allow all writes with anon key
-- since the app validates ownership before making changes.
CREATE POLICY "allow_insert_projects"
ON projects FOR INSERT
WITH CHECK (true);

CREATE POLICY "allow_update_projects"
ON projects FOR UPDATE
USING (true);

CREATE POLICY "allow_delete_projects"
ON projects FOR DELETE
USING (true);

-- ============================================
-- PROJECT_SUB_DIRECTORIES RLS
-- ============================================

ALTER TABLE project_sub_directories ENABLE ROW LEVEL SECURITY;

-- Anyone can read project categories
CREATE POLICY "read_project_categories"
ON project_sub_directories FOR SELECT
USING (true);

-- Allow modifications (app validates ownership)
CREATE POLICY "allow_insert_project_categories"
ON project_sub_directories FOR INSERT
WITH CHECK (true);

CREATE POLICY "allow_delete_project_categories"
ON project_sub_directories FOR DELETE
USING (true);

-- ============================================
-- REFERENCE TABLES RLS (Read-only)
-- ============================================

-- Enable RLS and allow public read for reference tables
ALTER TABLE directories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_directories" ON directories FOR SELECT USING (true);

ALTER TABLE sub_directories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_sub_directories" ON sub_directories FOR SELECT USING (true);

ALTER TABLE membership_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_membership_types" ON membership_types FOR SELECT USING (true);
