# Admin Dashboard Debugging Guide

## Updates Made

The Admin Reports Dashboard has been enhanced with comprehensive debugging and error tracking. All action buttons now include:

1. **Console logging** for every action
2. **Detailed error messages** with database error details
3. **Loading states** on buttons during actions
4. **Visual feedback** showing admin user status
5. **Better error handling** with specific error details

---

## Visual Debug Panel

When you open the Reports dashboard, you'll now see:

✅ **Green banner** if admin user is loaded correctly:
```
✓ Admin user loaded: ID abcd1234... (Check console for full details)
```

⚠️ **Red banner** if admin user is NOT loaded:
```
⚠ Admin user not loaded. Action buttons will not work. Check console for errors.
```

---

## How to Debug Issues

### Step 1: Open Browser Console

1. Open the Admin Dashboard at `/admin`
2. Go to Reports tab
3. Open browser console (F12 or Right-click → Inspect → Console tab)

### Step 2: Check Initial Load Messages

You should see these console messages when the page loads:

```
[ReportsView] Component mounted, loading admin user...
[ReportsView] Loading admin user...
[ReportsView] Authenticated user: ronchimbo@gmail.com ID: [user-id]
[ReportsView] Admin user loaded successfully: {id: "...", user_id: "..."}
[ReportsView] Status filter changed to: all
```

### Step 3: Click Any Action Button

When you click a button, you'll see:

```
[ReportsView] Button clicked: Mark as Followed Up [report-id]
[ReportsView] updateReportStatus called {reportId: "...", newStatus: "...", adminUser: "...", hasAdminUser: true}
[ReportsView] Updating report with data: {status: "...", followed_up_at: "...", followed_up_by: "..."}
```

### Step 4: Check for Errors

If there's an error, you'll see detailed information:

```
[ReportsView] Database error updating report: {
  error: {...},
  message: "...",
  details: "...",
  hint: "...",
  code: "..."
}
```

---

## Common Issues & Solutions

### Issue 1: Admin User Not Loading

**Symptoms:**
- Red warning banner at top
- Console shows: `[ReportsView] No admin user record found`

**Solution:**
1. Check that you're logged in with the correct admin email
2. Verify admin user exists in database:
   ```sql
   SELECT * FROM admin_users WHERE user_id = '[your-auth-user-id]';
   ```
3. If no record exists, create one using the `create-admin-user` edge function

### Issue 2: Permission Errors

**Symptoms:**
- Error message: "permission denied" or "insufficient privileges"
- Console shows database error with code 42501

**Solution:**
1. Check RLS policies on `generated_reports` table
2. Verify your user is in the `admin_users` table
3. Check that admin policies allow updates:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'generated_reports';
   ```

### Issue 3: Buttons Don't Respond

**Symptoms:**
- Clicking buttons does nothing
- No console logs appear

**Solution:**
1. Check browser console for JavaScript errors
2. Verify the page loaded completely (no 404 errors)
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
4. Clear browser cache and reload

### Issue 4: Network Errors

**Symptoms:**
- Console shows: "Failed to fetch" or network errors
- Timeouts

**Solution:**
1. Check your internet connection
2. Verify Supabase URL in `.env` file is correct
3. Check Supabase project status
4. Look for CORS errors in console

---

## Action Button Details

### Mark as Followed Up
- **Console:** `[ReportsView] Button clicked: Mark as Followed Up`
- **Updates:** `status`, `followed_up_at`, `followed_up_by`
- **Visible on:** Reports with status = 'new'

### Archive
- **Console:** `[ReportsView] Button clicked: Archive`
- **Updates:** `status`, `archived_at`, `archived_by`
- **Visible on:** All reports except archived ones

### Add/Edit Notes
- **Console:** `[ReportsView] Button clicked: Notes`
- **Opens:** Modal for entering notes
- **Updates:** `admin_notes`
- **Visible on:** All reports

### Delete
- **Console:** `[ReportsView] Button clicked: Delete`
- **Opens:** Confirmation dialog
- **Updates:** `deleted_at`, `deleted_by` (soft delete)
- **Visible on:** All reports

### Download
- **Console:** `[ReportsView] Button clicked: Download`
- **Action:** Creates and downloads HTML file
- **Visible on:** All reports

---

## Database Policies Check

Run this query to verify admin policies exist:

```sql
SELECT
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'generated_reports'
  AND policyname LIKE '%admin%';
```

Expected policies:
1. ✅ "Admins can read all reports" (SELECT)
2. ✅ "Admins can update all reports" (UPDATE)
3. ✅ "Admins can delete reports" (UPDATE for soft delete)

---

## Test Database Access

You can test if your admin user has proper access:

```sql
-- Check if you're authenticated as admin
SELECT * FROM admin_users WHERE user_id = auth.uid();

-- Test reading reports
SELECT id, company_name, status FROM generated_reports LIMIT 5;

-- Test updating a report (replace with actual report ID)
UPDATE generated_reports
SET admin_notes = 'Test note from debug'
WHERE id = '[report-id]';
```

---

## Expected Console Output Flow

### Normal Operation:

1. **Page Load:**
   ```
   [ReportsView] Component mounted, loading admin user...
   [ReportsView] Loading admin user...
   [ReportsView] Authenticated user: your@email.com ID: xxx
   [ReportsView] Admin user loaded successfully: {id: "...", user_id: "..."}
   ```

2. **Button Click:**
   ```
   [ReportsView] Button clicked: Archive [report-id]
   [ReportsView] updateReportStatus called {...}
   [ReportsView] Updating report with data: {...}
   ```

3. **Success:**
   ```
   [ReportsView] Report updated successfully: [...]
   ```
   + Alert: "Report status updated to archived"

---

## Emergency Troubleshooting

If nothing works:

1. **Clear everything:**
   ```bash
   # Clear browser cache
   # Then hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
   ```

2. **Check Supabase connection:**
   ```javascript
   // In browser console:
   console.log(import.meta.env.VITE_SUPABASE_URL);
   console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```

3. **Verify authentication:**
   ```javascript
   // In browser console (after importing supabase):
   const { data, error } = await supabase.auth.getUser();
   console.log('Current user:', data.user?.email);
   ```

4. **Test database directly:**
   - Go to Supabase dashboard
   - Open SQL editor
   - Run test queries from this document

---

## Getting More Help

When reporting issues, include:

1. **Console logs** (copy all [ReportsView] messages)
2. **Error details** (full error object from console)
3. **Admin user status** (from green/red banner)
4. **Which button was clicked**
5. **Database query results** (if you ran any)
6. **Browser and version** (Chrome 120, Firefox 121, etc.)

---

## Success Indicators

✅ Everything is working if you see:
- Green banner "Admin user loaded"
- Console shows successful load messages
- Buttons show loading spinners when clicked
- Success alerts appear after actions
- Reports list refreshes after actions
- No red errors in console

---

**Last Updated:** January 31, 2026
**Component:** src/components/admin/ReportsView.tsx
