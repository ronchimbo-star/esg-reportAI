/*
  # Fix CMS Admin RLS Policies

  1. Changes
    - Drop and recreate all admin policies for CMS tables
    - Fix admin check to use `admin_users.user_id = auth.uid()` instead of `admin_users.id = auth.uid()`
    - This allows admins to properly perform CRUD operations on:
      - cms_pages
      - esg_templates
      - news_articles
      - media_library
      - sitemap_entries

  2. Tables Affected
    - cms_pages
    - esg_templates
    - news_articles
    - media_library
    - sitemap_entries
*/

-- Fix cms_pages policies
DROP POLICY IF EXISTS "Admins can view all pages" ON cms_pages;
DROP POLICY IF EXISTS "Admins can insert pages" ON cms_pages;
DROP POLICY IF EXISTS "Admins can update pages" ON cms_pages;
DROP POLICY IF EXISTS "Admins can delete pages" ON cms_pages;

CREATE POLICY "Admins can view all pages"
  ON cms_pages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert pages"
  ON cms_pages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update pages"
  ON cms_pages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete pages"
  ON cms_pages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

-- Fix esg_templates policies
DROP POLICY IF EXISTS "Admins can view all templates" ON esg_templates;
DROP POLICY IF EXISTS "Admins can insert templates" ON esg_templates;
DROP POLICY IF EXISTS "Admins can update templates" ON esg_templates;
DROP POLICY IF EXISTS "Admins can delete templates" ON esg_templates;

CREATE POLICY "Admins can view all templates"
  ON esg_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert templates"
  ON esg_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update templates"
  ON esg_templates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete templates"
  ON esg_templates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

-- Fix news_articles policies
DROP POLICY IF EXISTS "Admins can view all articles" ON news_articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON news_articles;
DROP POLICY IF EXISTS "Admins can update articles" ON news_articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON news_articles;

CREATE POLICY "Admins can view all articles"
  ON news_articles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert articles"
  ON news_articles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update articles"
  ON news_articles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete articles"
  ON news_articles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

-- Fix media_library policies
DROP POLICY IF EXISTS "Admins can insert media" ON media_library;
DROP POLICY IF EXISTS "Admins can update media" ON media_library;
DROP POLICY IF EXISTS "Admins can delete media" ON media_library;

CREATE POLICY "Admins can insert media"
  ON media_library FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update media"
  ON media_library FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete media"
  ON media_library FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

-- Fix sitemap_entries policies
DROP POLICY IF EXISTS "Admins can manage sitemap entries" ON sitemap_entries;

CREATE POLICY "Admins can manage sitemap entries"
  ON sitemap_entries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );
