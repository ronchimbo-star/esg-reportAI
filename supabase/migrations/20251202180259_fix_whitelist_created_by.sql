/*
  # Fix Whitelist Created By Column

  1. Changes
    - Make created_by nullable to allow inserts without requiring the field
    - This allows the insert to succeed even if created_by is not provided

  2. Reason
    - The previous migration required created_by but the component wasn't setting it
    - Making it nullable allows the component to work while still tracking who created entries when provided
*/

ALTER TABLE whitelisted_ips 
ALTER COLUMN created_by DROP NOT NULL;
