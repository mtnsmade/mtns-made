-- MTNS MADE Supabase Migration: Projects Table
-- Member portfolio projects

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- System IDs
  webflow_id TEXT UNIQUE,
  memberstack_id TEXT,  -- Owner's memberstack ID (for linking)
  airtable_id TEXT,

  -- Basic Info
  name TEXT NOT NULL,
  slug TEXT UNIQUE,

  -- Owner (FK to members)
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,

  -- Content
  key_detail TEXT,           -- Brief outcome/tagline
  short_description TEXT,    -- For cards/listings
  description TEXT,          -- Full description (may contain HTML)

  -- Media
  feature_image_url TEXT,
  showreel_link TEXT,        -- Vimeo/YouTube embed URL

  -- Gallery Images (up to 5)
  image_one_url TEXT,
  image_two_url TEXT,
  image_three_url TEXT,
  image_four_url TEXT,
  image_five_url TEXT,

  -- External Link
  external_link TEXT,

  -- Display Options
  homepage_feature BOOLEAN DEFAULT false,
  display_order INTEGER,

  -- Status
  is_archived BOOLEAN DEFAULT false,
  is_draft BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECT CATEGORIES (Many-to-Many)
-- ============================================

-- Projects can have multiple directory categories
CREATE TABLE IF NOT EXISTS project_sub_directories (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sub_directory_id UUID NOT NULL REFERENCES sub_directories(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, sub_directory_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_projects_webflow ON projects(webflow_id);
CREATE INDEX IF NOT EXISTS idx_projects_member ON projects(member_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_memberstack ON projects(memberstack_id);
CREATE INDEX IF NOT EXISTS idx_projects_homepage_feature ON projects(homepage_feature) WHERE homepage_feature = true;
CREATE INDEX IF NOT EXISTS idx_project_sub_directories_sub ON project_sub_directories(sub_directory_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE projects IS 'Member portfolio projects imported from Webflow CMS';
COMMENT ON COLUMN projects.member_id IS 'FK to members table - projects belong to members';
COMMENT ON COLUMN projects.memberstack_id IS 'Original memberstack ID for import linking';
