/*
  # Create Admin Dashboard Tables

  1. New Tables
    - `seo_settings`
      - `id` (uuid, primary key) - Unique identifier
      - `meta_title` (text) - Site meta title
      - `meta_description` (text) - Site meta description
      - `meta_keywords` (text) - Site meta keywords
      - `favicon_url` (text) - URL to favicon
      - `sitemap_urls` (jsonb) - Array of URLs for sitemap generation
      - `updated_at` (timestamptz) - Last update timestamp
      - `updated_by` (uuid) - Admin user who made the update
      
    - `admin_users`
      - `id` (uuid, primary key) - Unique identifier (links to auth.users)
      - `email` (text) - Admin email
      - `full_name` (text) - Admin full name
      - `role` (text) - Admin role (super_admin, admin)
      - `created_at` (timestamptz) - Account creation time
      - `last_login` (timestamptz) - Last login time
      
    - `banned_ips`
      - `id` (uuid, primary key) - Unique identifier
      - `ip_address` (text) - Banned IP address
      - `reason` (text) - Reason for ban
      - `banned_by` (uuid) - Admin user who banned the IP
      - `banned_at` (timestamptz) - Ban timestamp
      - `is_active` (boolean) - Whether ban is currently active

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users
    
  3. Indexes
    - Add indexes for efficient queries
*/

-- Create seo_settings table
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_title text DEFAULT 'AI ESG Report Generator',
  meta_description text DEFAULT 'Generate professional ESG reports aligned with global standards',
  meta_keywords text DEFAULT 'ESG, reporting, sustainability, compliance',
  favicon_url text DEFAULT '/esgReport Icon.png',
  sitemap_urls jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Create banned_ips table
CREATE TABLE IF NOT EXISTS banned_ips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text UNIQUE NOT NULL,
  reason text NOT NULL,
  banned_by uuid REFERENCES admin_users(id),
  banned_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Insert default SEO settings if none exist
INSERT INTO seo_settings (meta_title, meta_description, meta_keywords, favicon_url)
SELECT 
  'AI ESG Report Generator',
  'Generate professional ESG reports aligned with global standards',
  'ESG, reporting, sustainability, compliance',
  '/esgReport Icon.png'
WHERE NOT EXISTS (SELECT 1 FROM seo_settings LIMIT 1);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_banned_ips_address ON banned_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_banned_ips_active ON banned_ips(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_ips ENABLE ROW LEVEL SECURITY;

-- Policies for seo_settings (authenticated admin users only)
CREATE POLICY "Admin users can read SEO settings"
  ON seo_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin users can update SEO settings"
  ON seo_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Policies for admin_users
CREATE POLICY "Admin users can read all admin accounts"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin users can update their own account"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policies for banned_ips
CREATE POLICY "Admin users can read banned IPs"
  ON banned_ips
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin users can insert banned IPs"
  ON banned_ips
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin users can update banned IPs"
  ON banned_ips
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin users can delete banned IPs"
  ON banned_ips
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Service role policies for reports access
CREATE POLICY "Admin users can read all reports"
  ON generated_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );
