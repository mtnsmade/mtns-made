-- MTNS MADE Supabase Migration: Projects Table
-- Member portfolio items

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  webflow_id TEXT UNIQUE,

  -- Content
  name TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,

  -- Feature Image
  feature_image_url TEXT,

  -- Gallery Images (JSONB array for Webflow multi-image compatibility)
  -- Format: [{"url": "https://...", "alt": "...", "order": 0}, ...]
  -- Maximum: 15 images per project
  images JSONB DEFAULT '[]',

  -- Links
  showreel_link TEXT,            -- YouTube/Vimeo only
  external_link TEXT,            -- Project external link

  -- Categories (array of Webflow sub-directory IDs)
  categories TEXT[],

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_member ON projects(member_id);
CREATE INDEX IF NOT EXISTS idx_projects_webflow ON projects(webflow_id);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(member_id, display_order);

-- Updated_at trigger (reuses function from members migration)
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Verification
-- SELECT
--   m.name as member_name,
--   COUNT(p.id) as project_count
-- FROM members m
-- LEFT JOIN projects p ON p.member_id = m.id
-- GROUP BY m.id, m.name
-- ORDER BY project_count DESC
-- LIMIT 10;
