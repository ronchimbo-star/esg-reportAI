/*
  # Create ESG Reports Storage System

  1. New Tables
    - `generated_reports`
      - `id` (uuid, primary key) - Unique identifier for each report
      - `company_name` (text) - Name of the company
      - `industries` (text array) - Industries the company operates in
      - `jurisdictions` (text array) - Jurisdictions the company operates in
      - `frameworks` (text array) - ESG frameworks selected
      - `report_content` (text) - The generated report markdown content
      - `user_email` (text) - Email address provided by the user
      - `user_ip` (text) - IP address of the user (for rate limiting)
      - `created_at` (timestamptz) - When the report was generated
      - `email_sent` (boolean) - Whether the email notification was sent
      
    - `report_rate_limits`
      - `id` (uuid, primary key) - Unique identifier
      - `ip_address` (text) - IP address
      - `last_report_at` (timestamptz) - Timestamp of last report generation
      - `report_count` (integer) - Number of reports generated in current window
      - `created_at` (timestamptz) - Record creation time
      - `updated_at` (timestamptz) - Last update time

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated access (service role for backend operations)
    
  3. Indexes
    - Add index on `user_ip` for efficient rate limit lookups
    - Add index on `ip_address` in rate_limits table
*/

-- Create generated_reports table
CREATE TABLE IF NOT EXISTS generated_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  industries text[] DEFAULT '{}',
  jurisdictions text[] DEFAULT '{}',
  frameworks text[] DEFAULT '{}',
  report_content text NOT NULL,
  user_email text,
  user_ip text NOT NULL,
  created_at timestamptz DEFAULT now(),
  email_sent boolean DEFAULT false
);

-- Create report_rate_limits table
CREATE TABLE IF NOT EXISTS report_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text UNIQUE NOT NULL,
  last_report_at timestamptz DEFAULT now(),
  report_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_generated_reports_user_ip ON generated_reports(user_ip);
CREATE INDEX IF NOT EXISTS idx_generated_reports_created_at ON generated_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_address ON report_rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limits_last_report ON report_rate_limits(last_report_at DESC);

-- Enable Row Level Security
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_rate_limits ENABLE ROW LEVEL SECURITY;

-- Policies for generated_reports (service role only for now)
CREATE POLICY "Service role can insert reports"
  ON generated_reports
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can read reports"
  ON generated_reports
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can update reports"
  ON generated_reports
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policies for report_rate_limits (service role only)
CREATE POLICY "Service role can manage rate limits"
  ON report_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
