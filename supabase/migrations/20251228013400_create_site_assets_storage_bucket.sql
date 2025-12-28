/*
  # Create Site Assets Storage Bucket
  
  ## Purpose
  This migration creates the 'site-assets' storage bucket for storing images and media files
  that are uploaded through the admin CMS media library.
  
  ## Changes
  1. Create 'site-assets' bucket with public access enabled
  2. Set appropriate file size limits and allowed mime types
  
  ## Security
  - Bucket is public for read access (needed for displaying images on the site)
  - Write/upload access is restricted via RLS policies (already set in previous migration)
*/

-- Create the site-assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/x-icon']::text[]
)
ON CONFLICT (id) DO NOTHING;
