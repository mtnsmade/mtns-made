-- MTNS MADE Migration: Drop redundant member_directories table
-- Parent directories can be derived from member_sub_directories via sub_directories.directory_id

-- Drop the index first
DROP INDEX IF EXISTS idx_member_directories_directory;

-- Drop the table
DROP TABLE IF EXISTS member_directories;

-- ============================================
-- HELPER VIEW (optional - for convenience)
-- ============================================

-- Create a view to easily get member's parent directories
CREATE OR REPLACE VIEW member_directories_derived AS
SELECT DISTINCT
  msd.member_id,
  d.id AS directory_id,
  d.name AS directory_name,
  d.slug AS directory_slug
FROM member_sub_directories msd
JOIN sub_directories sd ON sd.id = msd.sub_directory_id
JOIN directories d ON d.id = sd.directory_id;

COMMENT ON VIEW member_directories_derived IS
'Derived view showing which parent directories each member belongs to, based on their sub_directory selections';
