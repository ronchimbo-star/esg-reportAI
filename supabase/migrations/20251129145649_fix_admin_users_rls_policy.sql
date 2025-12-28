/*
  # Fix Admin Users RLS Policy for Login

  1. Changes
    - Drop the existing restrictive SELECT policy that creates circular dependency
    - Add new policy allowing authenticated users to read their own admin record
    - This allows login to check if user is admin without requiring them to already be verified as admin

  2. Security
    - Users can only read their own admin record (user_id = auth.uid())
    - Still requires authentication
    - Maintains security while fixing login flow
*/

-- Drop the circular dependency policy
DROP POLICY IF EXISTS "Admin users can read all admin accounts" ON admin_users;

-- Add policy allowing users to check if they are admin
CREATE POLICY "Users can read their own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Keep the update policy as is
-- "Admin users can update their own account" already exists and is correct
