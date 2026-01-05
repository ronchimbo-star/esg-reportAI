/*
  # Add Updated At Trigger for Site Settings

  1. Changes
    - Create a function to automatically update the `updated_at` timestamp
    - Add a trigger to the `site_settings` table that calls this function on UPDATE
  
  2. Purpose
    - Ensures `updated_at` is automatically set to the current timestamp whenever a row is updated
    - No need to manually set `updated_at` in application code
*/

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to site_settings table
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
