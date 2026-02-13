-- ============================================
-- Messages Table for Member Contact System
-- ============================================

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Member being contacted
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  memberstack_id TEXT NOT NULL,
  
  -- Sender details
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  
  -- Message content
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  is_archived BOOLEAN DEFAULT FALSE,
  
  -- Replies stored as JSONB array
  -- Format: [{ "created_at": "...", "message": "...", "from": "member" | "sender" }]
  replies JSONB DEFAULT '[]'::jsonb
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_messages_member_id ON messages(member_id);
CREATE INDEX IF NOT EXISTS idx_messages_memberstack_id ON messages(memberstack_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read) WHERE is_read = FALSE;

-- RLS Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow insert from Edge Functions (service role)
CREATE POLICY "Service role can insert messages" ON messages
  FOR INSERT
  WITH CHECK (true);

-- Allow select for the member who received the message
CREATE POLICY "Members can view their messages" ON messages
  FOR SELECT
  USING (true);  -- We'll filter by memberstack_id in application code

-- Allow update for marking as read, archiving, adding replies
CREATE POLICY "Members can update their messages" ON messages
  FOR UPDATE
  USING (true);

-- Comment for documentation
COMMENT ON TABLE messages IS 'Stores contact enquiries sent to members via their MTNS MADE profiles';
COMMENT ON COLUMN messages.replies IS 'JSON array of replies: [{ created_at, message, from: "member"|"sender" }]';
