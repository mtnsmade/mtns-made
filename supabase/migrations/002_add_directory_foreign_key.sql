-- MTNS MADE Supabase Migration: Add Foreign Key Relationship
-- Links sub_directories to directories table properly

-- Step 1: Add directory_id column
ALTER TABLE sub_directories
ADD COLUMN IF NOT EXISTS directory_id UUID;

-- Step 2: Populate directory_id by matching on slug
UPDATE sub_directories sd
SET directory_id = d.id
FROM directories d
WHERE sd.directory_slug = d.slug;

-- Step 3: Add foreign key constraint
ALTER TABLE sub_directories
ADD CONSTRAINT fk_sub_directories_directory
FOREIGN KEY (directory_id)
REFERENCES directories(id)
ON DELETE CASCADE;

-- Step 4: Make directory_id NOT NULL (now that it's populated)
ALTER TABLE sub_directories
ALTER COLUMN directory_id SET NOT NULL;

-- Step 5: Add index for the foreign key
CREATE INDEX IF NOT EXISTS idx_sub_directories_directory_id
ON sub_directories(directory_id);

-- Step 6: Drop the text slug column (optional - keeping for reference during migration)
-- Uncomment this line if you want to remove the redundant column:
-- ALTER TABLE sub_directories DROP COLUMN directory_slug;

-- Verification: Check the relationship works
-- SELECT
--   d.name as directory,
--   COUNT(sd.id) as sub_directory_count
-- FROM directories d
-- LEFT JOIN sub_directories sd ON sd.directory_id = d.id
-- GROUP BY d.id, d.name
-- ORDER BY d.display_order;
