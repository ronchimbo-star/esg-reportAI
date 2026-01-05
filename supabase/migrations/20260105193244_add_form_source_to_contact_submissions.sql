/*
  # Add form_source field to contact_submissions table

  1. Changes
    - Add form_source column to track which contact form was used
    - Defaults to 'contact_page' for existing records
  
  2. Security
    - No RLS changes needed, existing policies apply
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'form_source'
  ) THEN
    ALTER TABLE contact_submissions 
    ADD COLUMN form_source text DEFAULT 'contact_page';
  END IF;
END $$;

-- Add index for form_source queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_form_source ON contact_submissions(form_source);
