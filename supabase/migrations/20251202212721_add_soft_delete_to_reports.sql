/*
  # Add Soft Delete Support to Reports
  
  1. Schema Changes
    - Add `deleted_at` column to `generated_reports` table
      - Allows soft deletion of reports (they remain in database but marked as deleted)
    - Add `deleted_by` column (references admin_users)
      - Tracks which admin deleted the report
    
  2. Indexes
    - Add index on deleted_at for filtering
    - Add index on deleted_by for tracking
    
  3. Notes
    - Deleted reports will have deleted_at timestamp set
    - Admins can permanently delete via direct database access
    - This provides a safety net for accidental deletions
*/

-- Add soft delete columns to generated_reports
DO $$
BEGIN
  -- Add deleted_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generated_reports' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE generated_reports ADD COLUMN deleted_at timestamptz;
  END IF;
  
  -- Add deleted_by column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generated_reports' AND column_name = 'deleted_by'
  ) THEN
    ALTER TABLE generated_reports ADD COLUMN deleted_by uuid REFERENCES admin_users(id);
  END IF;
END $$;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_generated_reports_deleted_at ON generated_reports(deleted_at);
CREATE INDEX IF NOT EXISTS idx_generated_reports_deleted_by ON generated_reports(deleted_by);
