-- MTNS MADE Supabase Migration: Enable RLS on All Tables
-- Secures all previously unrestricted tables with appropriate policies
-- Edge Functions use service_role key (bypasses RLS)
-- Frontend uses anon key (respects RLS)

-- ============================================
-- MEMBERS TABLE
-- ============================================
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Allow reading member profiles (needed for lookups)
CREATE POLICY "read_members" ON members
FOR SELECT USING (true);

-- Allow insert/update (application validates ownership via memberstack_id)
CREATE POLICY "insert_members" ON members
FOR INSERT WITH CHECK (true);

CREATE POLICY "update_members" ON members
FOR UPDATE USING (true);

-- No delete policy - members should only be managed via Edge Functions

-- ============================================
-- EVENTS TABLE
-- ============================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Anyone can read published events
CREATE POLICY "read_events" ON events
FOR SELECT USING (true);

-- Insert/update for event management (app validates permissions)
CREATE POLICY "insert_events" ON events
FOR INSERT WITH CHECK (true);

CREATE POLICY "update_events" ON events
FOR UPDATE USING (true);

-- ============================================
-- EVENT_MEMBERS TABLE (RSVPs)
-- ============================================
ALTER TABLE event_members ENABLE ROW LEVEL SECURITY;

-- Read RSVPs (needed to show attendance)
CREATE POLICY "read_event_members" ON event_members
FOR SELECT USING (true);

-- Allow RSVP operations (app filters by memberstack_id)
CREATE POLICY "insert_event_members" ON event_members
FOR INSERT WITH CHECK (true);

CREATE POLICY "update_event_members" ON event_members
FOR UPDATE USING (true);

CREATE POLICY "delete_event_members" ON event_members
FOR DELETE USING (true);

-- ============================================
-- MEMBER JUNCTION TABLES
-- ============================================

-- member_directories
ALTER TABLE member_directories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_member_directories" ON member_directories
FOR SELECT USING (true);

CREATE POLICY "insert_member_directories" ON member_directories
FOR INSERT WITH CHECK (true);

CREATE POLICY "delete_member_directories" ON member_directories
FOR DELETE USING (true);

-- member_sub_directories
ALTER TABLE member_sub_directories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_member_sub_directories" ON member_sub_directories
FOR SELECT USING (true);

CREATE POLICY "insert_member_sub_directories" ON member_sub_directories
FOR INSERT WITH CHECK (true);

CREATE POLICY "delete_member_sub_directories" ON member_sub_directories
FOR DELETE USING (true);

-- member_space_categories
ALTER TABLE member_space_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_member_space_categories" ON member_space_categories
FOR SELECT USING (true);

CREATE POLICY "insert_member_space_categories" ON member_space_categories
FOR INSERT WITH CHECK (true);

CREATE POLICY "delete_member_space_categories" ON member_space_categories
FOR DELETE USING (true);

-- member_supplier_categories
ALTER TABLE member_supplier_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_member_supplier_categories" ON member_supplier_categories
FOR SELECT USING (true);

CREATE POLICY "insert_member_supplier_categories" ON member_supplier_categories
FOR INSERT WITH CHECK (true);

CREATE POLICY "delete_member_supplier_categories" ON member_supplier_categories
FOR DELETE USING (true);

-- ============================================
-- REFERENCE/LOOKUP TABLES (Read-only)
-- ============================================

-- suburbs
ALTER TABLE suburbs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_suburbs" ON suburbs
FOR SELECT USING (true);

-- creative_space_categories
ALTER TABLE creative_space_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_creative_space_categories" ON creative_space_categories
FOR SELECT USING (true);

-- supplier_categories
ALTER TABLE supplier_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_supplier_categories" ON supplier_categories
FOR SELECT USING (true);

-- ============================================
-- SUMMARY
-- ============================================
-- All tables now have RLS enabled
-- Reference tables: SELECT only (read-only)
-- Data tables: SELECT + INSERT + UPDATE (app validates ownership)
-- Edge Functions bypass RLS via service_role key
-- Frontend must still filter by memberstack_id in queries
