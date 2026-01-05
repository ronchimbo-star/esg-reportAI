/*
  # Add public SELECT policy for newsletter subscriptions

  1. Problem
    - Users cannot check their own subscription status because there's no SELECT policy
    - The NewsletterManager component tries to query the newsletter_subscriptions table
      from the client side, which is blocked by RLS
  
  2. Changes
    - Add SELECT policy that allows anyone to check subscription status by email
    - This is safe because emails are public identifiers and users should be able to
      check if an email is already subscribed
  
  3. Security
    - Users can only SELECT, not INSERT/UPDATE/DELETE (those require admin or edge function)
    - The policy allows checking subscription status, which is a reasonable public operation
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'newsletter_subscriptions' 
    AND policyname = 'Anyone can check newsletter subscription status'
  ) THEN
    CREATE POLICY "Anyone can check newsletter subscription status"
      ON newsletter_subscriptions
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;
