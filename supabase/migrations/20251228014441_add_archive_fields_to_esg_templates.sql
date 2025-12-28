/*
  # Add Archive Fields to ESG Templates

  ## Changes
  Add soft delete support to esg_templates table by adding:
  - archived_at (timestamptz) - Timestamp when template was archived
  - archived_by (uuid) - Admin user who archived the template
  - category (text) - Template category field

  ## Security
  No changes to RLS policies needed
*/

-- Add archived_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'esg_templates' AND column_name = 'archived_at'
  ) THEN
    ALTER TABLE esg_templates ADD COLUMN archived_at timestamptz;
  END IF;
END $$;

-- Add archived_by column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'esg_templates' AND column_name = 'archived_by'
  ) THEN
    ALTER TABLE esg_templates ADD COLUMN archived_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Add category column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'esg_templates' AND column_name = 'category'
  ) THEN
    ALTER TABLE esg_templates ADD COLUMN category text NOT NULL DEFAULT 'General';
  END IF;
END $$;

-- Update existing published policy to exclude archived templates
DROP POLICY IF EXISTS "Public can view published templates" ON esg_templates;

CREATE POLICY "Public can view published templates"
  ON esg_templates
  FOR SELECT
  TO public
  USING (is_published = true AND archived_at IS NULL);
