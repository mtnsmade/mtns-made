-- Add 'pending' to subscription_status CHECK constraint
-- This is needed for new members who haven't completed their subscription yet

-- First drop the existing constraint
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_subscription_status_check;

-- Add new constraint with all valid statuses including 'pending'
ALTER TABLE members ADD CONSTRAINT members_subscription_status_check
CHECK (subscription_status IN ('active', 'trialling', 'lapsed', 'cancelled', 'deleted', 'pending'));
