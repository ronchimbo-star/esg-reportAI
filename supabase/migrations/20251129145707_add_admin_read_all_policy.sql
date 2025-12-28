/*
  # Add Policy for Admins to Read All Admin Accounts

  1. Changes
    - Add policy allowing verified admins to read all admin accounts
    - This is safe because it only applies AFTER successful login
    - Users can still read their own record to verify admin status during login

  2. Security
    - Requires user to be authenticated
    - Requires user_id to exist in admin_users table
    - Two policies work together: one for login check, one for dashboard access
*/

-- Add policy for admins to read all admin accounts (for admin dashboard)
CREATE POLICY "Verified admins can read all admin accounts"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );
