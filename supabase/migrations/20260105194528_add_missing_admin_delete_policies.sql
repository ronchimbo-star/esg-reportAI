/*
  # Add missing admin DELETE policies

  1. Changes
    - Add DELETE policy for contact_submissions table (admins)
    - Ensure all admin CRUD operations are covered

  2. Security
    - Only authenticated admin users can delete contact submissions
*/

-- Add DELETE policy for contact_submissions if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'contact_submissions' 
    AND policyname = 'Admins can delete contact submissions'
  ) THEN
    CREATE POLICY "Admins can delete contact submissions"
      ON contact_submissions
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.user_id = auth.uid()
        )
      );
  END IF;
END $$;
