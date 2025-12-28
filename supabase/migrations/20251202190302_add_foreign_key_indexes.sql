/*
  # Add Foreign Key Indexes for Performance

  ## Changes Made
  
  1. **Performance Improvements:**
     - Add index on `banned_ips.banned_by` foreign key
     - Add index on `whitelisted_ips.created_by` foreign key
     
  2. **Why This Matters:**
     - Foreign key columns without indexes can cause slow queries during JOINs
     - These indexes significantly improve query performance when:
       - Filtering by the foreign key column
       - Joining tables on these relationships
       - Enforcing referential integrity
  
  ## Security Note
  - Leaked Password Protection must be enabled via Supabase Dashboard:
    - Navigate to: Authentication > Policies
    - Enable "Check for leaked passwords using HaveIBeenPwned"
    - This cannot be set via SQL migrations
*/

-- Add index for banned_ips.banned_by foreign key
CREATE INDEX IF NOT EXISTS idx_banned_ips_banned_by 
  ON public.banned_ips(banned_by);

-- Add index for whitelisted_ips.created_by foreign key
CREATE INDEX IF NOT EXISTS idx_whitelisted_ips_created_by 
  ON public.whitelisted_ips(created_by);

-- Add comment documenting the indexes
COMMENT ON INDEX idx_banned_ips_banned_by IS 
  'Index to improve performance of queries filtering or joining by banned_by column';

COMMENT ON INDEX idx_whitelisted_ips_created_by IS 
  'Index to improve performance of queries filtering or joining by created_by column';
