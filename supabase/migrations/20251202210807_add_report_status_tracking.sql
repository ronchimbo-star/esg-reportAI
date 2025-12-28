/*
  # Add Report Status Tracking
  
  1. Schema Changes
    - Add `status` column to `generated_reports` table
      - Values: 'new', 'followed_up', 'archived'
      - Default: 'new'
    - Add `followed_up_at` timestamp column
    - Add `followed_up_by` column (references admin_users)
    - Add `archived_at` timestamp column
    - Add `archived_by` column (references admin_users)
    - Add `admin_notes` text field for admin comments
    
  2. Indexes
    - Add index on status for filtering
    - Add index on followed_up_at for sorting
    - Add composite index on (status, created_at) for efficient filtering
    
  3. Notes
    - Status allows admins to track lifecycle of reports
    - Timestamps help audit when actions were taken
    - Admin references help track who performed actions
*/

-- Add status tracking columns to generated_reports
DO $$
BEGIN
  -- Add status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generated_reports' AND column_name = 'status'
  ) THEN
    ALTER TABLE generated_reports ADD COLUMN status text DEFAULT 'new' NOT NULL
      CHECK (status IN ('new', 'followed_up', 'archived'));
  END IF;
  
  -- Add followed_up_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generated_reports' AND column_name = 'followed_up_at'
  ) THEN
    ALTER TABLE generated_reports ADD COLUMN followed_up_at timestamptz;
  END IF;
  
  -- Add followed_up_by column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generated_reports' AND column_name = 'followed_up_by'
  ) THEN
    ALTER TABLE generated_reports ADD COLUMN followed_up_by uuid REFERENCES admin_users(id);
  END IF;
  
  -- Add archived_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generated_reports' AND column_name = 'archived_at'
  ) THEN
    ALTER TABLE generated_reports ADD COLUMN archived_at timestamptz;
  END IF;
  
  -- Add archived_by column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generated_reports' AND column_name = 'archived_by'
  ) THEN
    ALTER TABLE generated_reports ADD COLUMN archived_by uuid REFERENCES admin_users(id);
  END IF;
  
  -- Add admin_notes column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generated_reports' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE generated_reports ADD COLUMN admin_notes text;
  END IF;
END $$;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_generated_reports_status ON generated_reports(status);
CREATE INDEX IF NOT EXISTS idx_generated_reports_status_created ON generated_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_reports_followed_up ON generated_reports(followed_up_at DESC);

-- Add foreign key indexes for performance
CREATE INDEX IF NOT EXISTS idx_generated_reports_followed_up_by ON generated_reports(followed_up_by);
CREATE INDEX IF NOT EXISTS idx_generated_reports_archived_by ON generated_reports(archived_by);
