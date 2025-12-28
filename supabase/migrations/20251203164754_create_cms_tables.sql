/*
  # Create CMS Tables for Content Management System
  
  1. New Tables
    - `cms_pages`
      - Static pages (About, Contact, Privacy Policy, Terms, etc)
      - Includes SEO metadata, HTML content, slug for URLs
      - Published status and timestamps
    
    - `esg_templates`
      - ESG report templates for different industries/frameworks
      - Featured images, download counters, SEO metadata
      - Filterable by industry, framework, jurisdiction
      - HTML content for templates
    
    - `news_articles`
      - Blog/news system for ESG insights
      - Featured images, SEO metadata, HTML content
      - Published status and categories
    
    - `media_library`
      - Centralized image/media management
      - SEO metadata for each media item
      - Alt text, captions, file information
    
    - `sitemap_entries`
      - Automatic sitemap generation
      - URLs, priorities, change frequencies
      - Last modified timestamps
  
  2. Security
    - Enable RLS on all tables
    - Public read access for published content
    - Admin-only write access
  
  3. Indexes
    - Add indexes for slug lookups, published status, created dates
    - Optimize for common query patterns
*/

-- CMS Pages Table
CREATE TABLE IF NOT EXISTS cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_description text,
  meta_keywords text[],
  og_title text,
  og_description text,
  og_image text,
  content text NOT NULL,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id),
  updated_by uuid REFERENCES admin_users(id)
);

-- ESG Templates Table
CREATE TABLE IF NOT EXISTS esg_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  featured_image text,
  industries text[],
  frameworks text[],
  jurisdictions text[],
  content text NOT NULL,
  download_count integer DEFAULT 0,
  meta_description text,
  meta_keywords text[],
  og_title text,
  og_description text,
  og_image text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id),
  updated_by uuid REFERENCES admin_users(id)
);

-- News Articles Table
CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  featured_image text,
  content text NOT NULL,
  categories text[],
  tags text[],
  meta_description text,
  meta_keywords text[],
  og_title text,
  og_description text,
  og_image text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id),
  updated_by uuid REFERENCES admin_users(id)
);

-- Media Library Table
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  mime_type text,
  alt_text text,
  caption text,
  title text,
  description text,
  width integer,
  height integer,
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES admin_users(id)
);

-- Sitemap Entries Table
CREATE TABLE IF NOT EXISTS sitemap_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text UNIQUE NOT NULL,
  priority decimal(2,1) DEFAULT 0.5,
  change_frequency text DEFAULT 'monthly',
  last_modified timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE esg_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE sitemap_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cms_pages
CREATE POLICY "Anyone can view published pages"
  ON cms_pages FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all pages"
  ON cms_pages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert pages"
  ON cms_pages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update pages"
  ON cms_pages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete pages"
  ON cms_pages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

-- RLS Policies for esg_templates
CREATE POLICY "Anyone can view published templates"
  ON esg_templates FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all templates"
  ON esg_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert templates"
  ON esg_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update templates"
  ON esg_templates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete templates"
  ON esg_templates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

-- RLS Policies for news_articles
CREATE POLICY "Anyone can view published articles"
  ON news_articles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all articles"
  ON news_articles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert articles"
  ON news_articles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update articles"
  ON news_articles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete articles"
  ON news_articles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

-- RLS Policies for media_library
CREATE POLICY "Anyone can view media"
  ON media_library FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert media"
  ON media_library FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update media"
  ON media_library FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete media"
  ON media_library FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

-- RLS Policies for sitemap_entries
CREATE POLICY "Anyone can view active sitemap entries"
  ON sitemap_entries FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage sitemap entries"
  ON sitemap_entries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_published ON cms_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_esg_templates_slug ON esg_templates(slug);
CREATE INDEX IF NOT EXISTS idx_esg_templates_published ON esg_templates(is_published);
CREATE INDEX IF NOT EXISTS idx_esg_templates_industries ON esg_templates USING gin(industries);
CREATE INDEX IF NOT EXISTS idx_esg_templates_frameworks ON esg_templates USING gin(frameworks);
CREATE INDEX IF NOT EXISTS idx_esg_templates_jurisdictions ON esg_templates USING gin(jurisdictions);
CREATE INDEX IF NOT EXISTS idx_news_articles_slug ON news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_news_articles_published ON news_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_categories ON news_articles USING gin(categories);
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_at ON media_library(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_sitemap_entries_active ON sitemap_entries(is_active);
