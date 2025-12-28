/*
  # Add IP Whitelist Table

  1. New Tables
    - `whitelisted_ips`
      - `id` (uuid, primary key)
      - `ip_address` (text, unique) - The whitelisted IP address
      - `description` (text) - Description/reason for whitelist
      - `is_active` (boolean) - Whether the whitelist is active
      - `created_at` (timestamptz)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `whitelisted_ips` table
    - Add policies for admin users to manage whitelist

  3. Purpose
    - Allow certain IP addresses to bypass rate limiting
    - Useful for testing and admin access
*/

CREATE TABLE IF NOT EXISTS whitelisted_ips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE whitelisted_ips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read whitelisted IPs"
  ON whitelisted_ips
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admin users can insert whitelisted IPs"
  ON whitelisted_ips
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admin users can update whitelisted IPs"
  ON whitelisted_ips
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admin users can delete whitelisted IPs"
  ON whitelisted_ips
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = (select auth.uid())
    )
  );

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_whitelisted_ips_address 
ON whitelisted_ips(ip_address) WHERE is_active = true;
