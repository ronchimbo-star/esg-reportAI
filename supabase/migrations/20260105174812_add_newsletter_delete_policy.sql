/*
  # Add DELETE policy for newsletter subscriptions

  1. Changes
    - Add DELETE policy for admin users to delete newsletter subscriptions
  
  2. Security
    - Only authenticated admin users can delete newsletter subscriptions
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'newsletter_subscriptions' 
    AND policyname = 'Admins can delete newsletter subscriptions'
  ) THEN
    CREATE POLICY "Admins can delete newsletter subscriptions"
      ON newsletter_subscriptions
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
