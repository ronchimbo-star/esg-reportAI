# Reports Dashboard Troubleshooting Guide

## Issue: Action Buttons Not Working

If the action buttons (Mark as Followed Up, Archive, Delete, Notes) don't respond when clicked, follow this diagnostic guide.

---

## Quick Fix Steps

### Step 1: Use the Built-in Permission Tester

1. Go to `/admin` and click on the **Reports** tab
2. Look for the status banner at the top:
   - **Green banner**: "✓ Admin user loaded"
   - **Red banner**: "⚠ Admin user not loaded"
3. Click the **"Test Permissions"** button
4. Review the test results that appear

The test will show:
- ✓ Your authenticated user email and ID
- ✓ Your admin user record
- ✓ Whether you can read reports
- ✓ Whether you can update reports
- ✗ Any errors encountered

### Step 2: Check Console Logs

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for messages starting with `[ReportsView]`

**What to look for:**
- `[ReportsView] Admin user loaded successfully` ✓
- `[ReportsView] No admin user record found` ✗
- `[ReportsView] Button clicked:` when you click buttons
- Any database errors with details

### Step 3: Fix Common Issues

Based on the test results, follow the appropriate fix:

---

## Common Issues & Solutions

### Issue A: "No admin user record found"

**Symptoms:**
- Red warning banner
- Test shows: "✗ ERROR: No admin_users record"
- Console: `[ReportsView] No admin user record found for: your@email.com`

**Solution:**
You need to create an admin user record. Run this in Supabase SQL Editor:

```sql
-- Get your auth user ID first
SELECT id, email FROM auth.users WHERE email = 'ronchimbo@gmail.com';

-- Create admin user (replace USER_ID with the ID from above)
INSERT INTO admin_users (user_id, email)
VALUES ('YOUR-USER-ID-HERE', 'ronchimbo@gmail.com');
```

### Issue B: "UPDATE ERROR: permission denied"

**Symptoms:**
- Test shows: "✗ UPDATE ERROR: permission denied"
- Buttons don't work even though admin user is loaded

**Solution:**
RLS policies may not be working correctly. Check them:

```sql
-- Check current policies
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'generated_reports';
```

Expected policies:
1. "Admin users can read all reports" (SELECT)
2. "Admin users can update reports" (UPDATE)

If missing, run:

```sql
-- Enable RLS
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;

-- Admin can read
CREATE POLICY "Admin users can read all reports"
ON generated_reports FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  )
);

-- Admin can update
CREATE POLICY "Admin users can update reports"
ON generated_reports FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  )
);
```

### Issue C: Session Not Authenticated

**Symptoms:**
- Test shows: "✗ ERROR: No authenticated user"
- Red banner always showing
- Can't access admin dashboard

**Solution:**
1. Log out completely from `/admin`
2. Clear browser cookies/local storage
3. Log back in at `/admin/login`
4. If still failing, check Supabase project settings:
   - Go to Authentication → Settings
   - Verify auth is enabled
   - Check if email/password auth is enabled

### Issue D: Foreign Key Constraint Error

**Symptoms:**
- Test shows: "✗ UPDATE ERROR: foreign key constraint"
- Error mentions `followed_up_by_fkey` or similar

**Solution:**
The foreign key is expecting a valid admin_users.id. Verify:

```sql
-- Check your admin ID
SELECT id FROM admin_users WHERE email = 'ronchimbo@gmail.com';

-- Verify the foreign keys exist
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'generated_reports'
    AND tc.constraint_type = 'FOREIGN KEY';
```

Expected foreign keys:
- `followed_up_by` → `admin_users.id`
- `archived_by` → `admin_users.id`
- `deleted_by` → `admin_users.id`

---

## Testing Manually

You can test updates directly in Supabase SQL Editor:

```sql
-- 1. Find a test report
SELECT id, company_name, status
FROM generated_reports
WHERE deleted_at IS NULL
LIMIT 1;

-- 2. Get your admin ID
SELECT id FROM admin_users WHERE email = 'ronchimbo@gmail.com';

-- 3. Try updating (replace IDs)
UPDATE generated_reports
SET
    status = 'followed_up',
    followed_up_at = now(),
    followed_up_by = 'YOUR-ADMIN-ID'
WHERE id = 'REPORT-ID'
RETURNING *;
```

If this works in SQL but not in the app:
- Session issue: Clear cookies and re-login
- Client issue: Check browser console for errors
- Network issue: Check Supabase project is active

---

## Advanced Diagnostics

### Check Auth Session

In browser console:

```javascript
// Check if user is authenticated
const { data, error } = await supabase.auth.getUser();
console.log('User:', data.user?.email);

// Check session
const { data: session } = await supabase.auth.getSession();
console.log('Session:', session?.access_token ? 'Active' : 'None');
```

### Verify RLS is Working

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'generated_reports';

-- Should return: rowsecurity = true
```

### Test Policy Evaluation

```sql
-- This should return true if you're an admin
SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
) as am_i_admin;
```

---

## Still Not Working?

### Collect This Information:

1. **Test Results** (from "Test Permissions" button)
2. **Console Logs** (all [ReportsView] messages)
3. **Database Queries**:
   ```sql
   -- Run these and share results:
   SELECT * FROM admin_users WHERE email = 'ronchimbo@gmail.com';

   SELECT COUNT(*) FROM generated_reports WHERE deleted_at IS NULL;

   SELECT policyname FROM pg_policies WHERE tablename = 'generated_reports';
   ```

4. **Browser Info**: Chrome/Firefox/Safari version
5. **What happens** when you click a button:
   - Nothing at all?
   - Error message?
   - Loading spinner?

### Emergency Reset

If nothing else works:

```sql
-- 1. Drop and recreate policies
DROP POLICY IF EXISTS "Admin users can read all reports" ON generated_reports;
DROP POLICY IF EXISTS "Admin users can update reports" ON generated_reports;

-- 2. Recreate them (see Issue B above)

-- 3. Verify admin user exists
DELETE FROM admin_users WHERE email = 'ronchimbo@gmail.com';
INSERT INTO admin_users (user_id, email)
SELECT id, email FROM auth.users WHERE email = 'ronchimbo@gmail.com';

-- 4. Test again
SELECT * FROM admin_users WHERE email = 'ronchimbo@gmail.com';
```

---

## Prevention

To avoid issues in the future:

1. **Always use the Test button** after logging in
2. **Check console** for errors regularly
3. **Don't modify** admin_users or generated_reports tables manually
4. **Keep session active** (don't let it timeout during testing)

---

**Last Updated:** January 31, 2026
**File:** src/components/admin/ReportsView.tsx
**Related:** TEST_ADMIN_PERMISSIONS.sql, ADMIN_DASHBOARD_DEBUG.md
