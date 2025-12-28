/*
  # Simplify Admin Users RLS Policy

  1. Changes
    - Remove both existing SELECT policies
    - Create single unified policy that allows authenticated users to read their own admin record
    - This is simpler and avoids policy conflicts

  2. Security
    - Users can only read their own admin record (user_id = auth.uid())
    - Requires authentication
    - No circular dependencies
*/

-- Drop both existing SELECT policies
DROP POLICY IF EXISTS "Users can read their own admin record" ON admin_users;
DROP POLICY IF EXISTS "Verified admins can read all admin accounts" ON admin_users;

-- Create single simple policy for reading admin records
CREATE POLICY "Authenticated users can read own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
