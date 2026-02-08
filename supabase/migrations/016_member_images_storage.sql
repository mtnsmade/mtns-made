-- Migration: Create member-images storage bucket
-- Creates a public bucket for member profile and feature images

-- Note: Storage bucket creation is done via Dashboard or CLI, not SQL
-- This migration documents the expected bucket configuration and RLS policies

-- ============================================
-- STORAGE BUCKET SETTINGS
-- ============================================
-- Name: member-images
-- Public: true (for public CDN URLs)
-- File size limit: 5MB
-- Allowed MIME types: image/*

-- ============================================
-- RLS POLICIES FOR member-images BUCKET
-- ============================================

-- Policy: Allow anyone to read (public bucket)
CREATE POLICY "Allow public read member-images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'member-images');

-- Policy: Allow anon to upload (for client-side uploads with memberstack auth)
CREATE POLICY "Allow upload member-images"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'member-images');

-- Policy: Allow anon to update (for overwriting images)
CREATE POLICY "Allow update member-images"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'member-images');

-- Policy: Allow anon to delete (for removing old images)
CREATE POLICY "Allow delete member-images"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'member-images');

-- ============================================
-- FOLDER STRUCTURE
-- ============================================
-- Images are stored in folders by memberstack_id:
-- {memberstack_id}/profile_{timestamp}.{ext}
-- {memberstack_id}/feature_{timestamp}.{ext}
--
-- Example:
-- mem_abc123/profile_1704067200000.jpg
-- mem_abc123/feature_1704067200000.jpg

-- ============================================
-- CREATE BUCKET VIA CLI (if not using Dashboard)
-- ============================================
-- Run in Supabase CLI:
-- supabase storage create member-images --public
