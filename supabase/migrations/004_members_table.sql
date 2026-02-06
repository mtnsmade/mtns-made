-- MTNS MADE Supabase Migration: Members Table
-- Core table linking to Memberstack auth and Webflow CMS

CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- System IDs (for sync)
  memberstack_id TEXT UNIQUE NOT NULL,
  webflow_id TEXT UNIQUE,

  -- Basic Info
  name TEXT,                     -- Display name
  slug TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,

  -- Business Info
  business_name TEXT,            -- "Trading or Business Name"
  suburb_id UUID REFERENCES suburbs(id),

  -- Profile Content
  bio TEXT,                      -- "Member Bio"
  short_summary TEXT,            -- "Member short summary" (AI generated)

  -- Images (URLs - will be Supabase Storage)
  profile_image_url TEXT,
  header_image_url TEXT,

  -- Membership & Status
  membership_type_id UUID REFERENCES membership_types(id),
  status TEXT,                   -- e.g., 'active', 'pending', 'inactive'

  -- Member Type Flags
  is_business BOOLEAN DEFAULT false,
  is_creative_space BOOLEAN DEFAULT false,
  is_supplier BOOLEAN DEFAULT false,

  -- Display Preferences
  show_address BOOLEAN DEFAULT false,
  show_opening_hours BOOLEAN DEFAULT false,

  -- Opening Hours
  opening_monday TEXT,
  opening_tuesday TEXT,
  opening_wednesday TEXT,
  opening_thursday TEXT,
  opening_friday TEXT,
  opening_saturday TEXT,
  opening_sunday TEXT,

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

-- ============================================
-- JUNCTION TABLES (Many-to-Many Relationships)
-- ============================================

-- Member ↔ Directories (main/parent directories)
CREATE TABLE IF NOT EXISTS member_directories (
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  directory_id UUID NOT NULL REFERENCES directories(id) ON DELETE CASCADE,
  PRIMARY KEY (member_id, directory_id)
);

-- Member ↔ Sub-Directories (chosen directories / categories)
CREATE TABLE IF NOT EXISTS member_sub_directories (
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  sub_directory_id UUID NOT NULL REFERENCES sub_directories(id) ON DELETE CASCADE,
  PRIMARY KEY (member_id, sub_directory_id)
);

-- Member ↔ Supplier Categories
CREATE TABLE IF NOT EXISTS member_supplier_categories (
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  supplier_category_id UUID NOT NULL REFERENCES supplier_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (member_id, supplier_category_id)
);

-- Member ↔ Creative Space Categories
CREATE TABLE IF NOT EXISTS member_space_categories (
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  space_category_id UUID NOT NULL REFERENCES creative_space_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (member_id, space_category_id)
);

-- ============================================
-- INDEXES
-- ============================================

-- Members table indexes
CREATE INDEX IF NOT EXISTS idx_members_memberstack ON members(memberstack_id);
CREATE INDEX IF NOT EXISTS idx_members_webflow ON members(webflow_id);
CREATE INDEX IF NOT EXISTS idx_members_slug ON members(slug);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_membership_type ON members(membership_type_id);
CREATE INDEX IF NOT EXISTS idx_members_suburb ON members(suburb_id);

-- Junction table indexes (for reverse lookups)
CREATE INDEX IF NOT EXISTS idx_member_directories_directory ON member_directories(directory_id);
CREATE INDEX IF NOT EXISTS idx_member_sub_directories_sub ON member_sub_directories(sub_directory_id);
CREATE INDEX IF NOT EXISTS idx_member_supplier_categories_cat ON member_supplier_categories(supplier_category_id);
CREATE INDEX IF NOT EXISTS idx_member_space_categories_cat ON member_space_categories(space_category_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- VERIFICATION & EXAMPLE QUERIES
-- ============================================

-- Get member with all their categories:
-- SELECT
--   m.name,
--   m.email,
--   array_agg(DISTINCT d.name) as main_directories,
--   array_agg(DISTINCT sd.name) as chosen_directories
-- FROM members m
-- LEFT JOIN member_directories md ON md.member_id = m.id
-- LEFT JOIN directories d ON d.id = md.directory_id
-- LEFT JOIN member_sub_directories msd ON msd.member_id = m.id
-- LEFT JOIN sub_directories sd ON sd.id = msd.sub_directory_id
-- GROUP BY m.id, m.name, m.email;

-- Get all members in a specific sub-directory:
-- SELECT m.name, m.slug
-- FROM members m
-- JOIN member_sub_directories msd ON msd.member_id = m.id
-- JOIN sub_directories sd ON sd.id = msd.sub_directory_id
-- WHERE sd.slug = 'graphic-design';
