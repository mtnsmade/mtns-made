-- Add image_url to support task comments and create screenshot storage bucket

ALTER TABLE support_task_comments ADD COLUMN IF NOT EXISTS image_url TEXT;

INSERT INTO storage.buckets (id, name, public)
VALUES ('support-screenshots', 'support-screenshots', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public read support screenshots' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Public read support screenshots"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'support-screenshots');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anon upload support screenshots' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Anon upload support screenshots"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'support-screenshots');
  END IF;
END $$;
