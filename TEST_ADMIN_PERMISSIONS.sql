-- TEST ADMIN PERMISSIONS
-- Run this query while logged in as the admin user (ronchimbo@gmail.com)
-- to verify that RLS policies allow updates

-- Step 1: Verify your authentication
SELECT
    'Current User' as check_type,
    auth.uid() as auth_user_id,
    (SELECT email FROM auth.users WHERE id = auth.uid()) as auth_email;

-- Step 2: Verify admin_users record exists
SELECT
    'Admin User Record' as check_type,
    id as admin_id,
    user_id,
    email,
    CASE
        WHEN user_id = auth.uid() THEN '✓ MATCH'
        ELSE '✗ MISMATCH'
    END as status
FROM admin_users
WHERE user_id = auth.uid();

-- Step 3: Check if you can read reports (SELECT policy test)
SELECT
    'Can Read Reports' as check_type,
    COUNT(*) as report_count,
    CASE
        WHEN COUNT(*) > 0 THEN '✓ SELECT policy working'
        ELSE '? No reports or policy failing'
    END as status
FROM generated_reports;

-- Step 4: Get a test report ID
SELECT
    'Test Report' as check_type,
    id as report_id,
    company_name,
    status,
    followed_up_by
FROM generated_reports
WHERE status = 'new'
AND deleted_at IS NULL
LIMIT 1;

-- Step 5: Test UPDATE policy (YOU MUST REPLACE THE ID BELOW)
-- Copy a report ID from Step 4 and paste it in the query below

/*
UPDATE generated_reports
SET admin_notes = 'Test note from SQL - ' || now()::text
WHERE id = 'PASTE-REPORT-ID-HERE'
RETURNING
    'Update Test' as check_type,
    id,
    company_name,
    admin_notes,
    '✓ UPDATE policy working' as status;
*/

-- Step 6: Verify the admin_users foreign key
SELECT
    'Admin FK Test' as check_type,
    id as admin_id,
    '✓ This is the ID to use in followed_up_by' as status
FROM admin_users
WHERE user_id = auth.uid();

-- Step 7: Full diagnostic - Check policy evaluation
SELECT
    'RLS Policy Check' as check_type,
    EXISTS (
        SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    ) as is_admin,
    CASE
        WHEN EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
        THEN '✓ Admin user found - policies should work'
        ELSE '✗ Admin user NOT found - policies will FAIL'
    END as status;

-- Expected Results:
-- All checks should show ✓ symbols
-- If any show ✗, that's the problem area
