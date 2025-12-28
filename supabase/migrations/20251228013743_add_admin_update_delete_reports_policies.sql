/*
  # Add Admin Update and Delete Policies for Reports
  
  ## Problem
  Admin users can only read reports but cannot update or delete them.
  This prevents actions like:
  - Marking reports as followed up
  - Archiving reports
  - Soft deleting reports
  - Adding/updating admin notes
  
  ## Changes
  Add UPDATE policy for authenticated admin users on generated_reports table
  to allow all report management actions.
  
  ## Security
  - Only authenticated users who are in the admin_users table can update reports
  - Uses user_id foreign key check
*/

-- Add policy for admins to update reports
CREATE POLICY "Admin users can update reports"
  ON generated_reports
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
