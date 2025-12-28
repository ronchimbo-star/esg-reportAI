# Security Setup Instructions

## Database Security Fixes Applied ✅

### Foreign Key Indexes (COMPLETED)
The following indexes have been automatically created to improve query performance:

- **`idx_banned_ips_banned_by`** - Index on `banned_ips.banned_by` foreign key
- **`idx_whitelisted_ips_created_by`** - Index on `whitelisted_ips.created_by` foreign key

These indexes prevent slow queries when filtering or joining on these foreign key columns.

---

## Manual Security Configuration Required

### Enable Leaked Password Protection

Supabase Auth can prevent users from using compromised passwords by checking against HaveIBeenPwned.org's database of leaked passwords.

**To Enable:**

1. **Log into Supabase Dashboard**
   - Go to https://supabase.com/dashboard

2. **Navigate to Authentication Settings**
   - Select your project
   - Go to **Authentication** → **Policies** (or **Configuration**)

3. **Enable Password Protection**
   - Look for the setting: **"Check for leaked passwords using HaveIBeenPwned"**
   - Toggle it **ON**
   - Save changes

**What This Does:**
- When users create accounts or change passwords, Supabase will check if the password appears in known data breaches
- If a compromised password is detected, the user will be required to choose a different password
- This significantly improves account security

**Note:** This setting cannot be configured via SQL migrations and must be manually enabled through the Supabase Dashboard.

---

## Security Best Practices

### Already Implemented ✅
- Row Level Security (RLS) enabled on all tables
- Restrictive RLS policies requiring authentication
- Foreign key constraints for referential integrity
- Indexed foreign keys for performance
- IP whitelisting system
- IP banning system
- Rate limiting on report generation

### Recommended Additional Security
1. **Enable Leaked Password Protection** (see above)
2. **Require Email Verification** (Authentication → Email Auth)
3. **Set Password Strength Requirements** (Authentication → Password Settings)
4. **Enable MFA for Admin Accounts** (when available)
5. **Regular Security Audits** of RLS policies and admin access

---

## Verification

### Check Indexes Are Created
Run this query in the Supabase SQL Editor:

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN ('idx_banned_ips_banned_by', 'idx_whitelisted_ips_created_by');
```

Expected output: 2 rows showing both indexes.

### Check RLS Status
```sql
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

All tables should show `rowsecurity = true`.

---

## Support

If you encounter any issues with these security settings, please contact your Supabase support team or refer to the [Supabase Security Documentation](https://supabase.com/docs/guides/auth/security).
