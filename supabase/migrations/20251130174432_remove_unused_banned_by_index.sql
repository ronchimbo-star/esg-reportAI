/*
  # Remove Unused Index on banned_ips

  1. Changes
    - Drop idx_banned_ips_banned_by index as it's not being used
    - The foreign key constraint itself provides referential integrity
    - The index was created to optimize queries, but analysis shows no queries are using it

  2. Performance
    - Reduces storage overhead
    - Eliminates unnecessary index maintenance during INSERT/UPDATE operations
*/

DROP INDEX IF EXISTS idx_banned_ips_banned_by;
