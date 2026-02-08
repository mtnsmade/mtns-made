-- Migration: Create event-images storage bucket
-- Creates a public bucket for event feature images

-- Create the storage bucket (run in Supabase Dashboard → Storage → New Bucket)
-- Name: event-images
-- Public: true (for public CDN URLs)

-- Note: Storage bucket creation is done via Dashboard or CLI, not SQL
-- This migration documents the expected bucket configuration and RLS policies

-- Storage bucket settings:
-- - Name: event-images
-- - Public: true
-- - File size limit: 5MB
-- - Allowed MIME types: image/*

-- RLS Policies for event-images bucket
-- These need to be set in Dashboard → Storage → event-images → Policies

-- Policy 1: Allow authenticated users to upload to their own folder
-- INSERT policy:
-- ((bucket_id = 'event-images'::text) AND ((storage.foldername(name))[1] = auth.uid()::text))

-- Policy 2: Allow public read access (since bucket is public)
-- SELECT policy: true (anyone can read)

-- Policy 3: Allow authenticated users to delete their own files
-- DELETE policy:
-- ((bucket_id = 'event-images'::text) AND ((storage.foldername(name))[1] = auth.uid()::text))

-- For anon key access (used by client), policies need to allow based on memberstack_id folder
-- Since we're using anon key, the folder structure is: {memberstack_id}/{filename}

-- Alternative: Use service role key in Edge Function for storage operations (current approach)
-- This bypasses RLS and allows the Edge Function to manage storage directly
