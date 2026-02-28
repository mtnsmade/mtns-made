-- Add is_deleted column to members table for soft deletion
-- This is used by the memberstack-webhook to soft delete members

ALTER TABLE members ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- Index for filtering out deleted members
CREATE INDEX IF NOT EXISTS idx_members_is_deleted ON members(is_deleted);
