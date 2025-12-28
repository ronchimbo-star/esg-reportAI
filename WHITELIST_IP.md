# Whitelist Your IP Address

To bypass rate limiting for your IP address, you can add it to the whitelist table.

## Method 1: Using Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Run the following SQL query (replace `YOUR_IP_ADDRESS` with your actual IP):

```sql
-- Add your IP to the whitelist
INSERT INTO whitelisted_ips (ip_address, description, is_active)
VALUES ('YOUR_IP_ADDRESS', 'Development/Testing IP', true);
```

## Method 2: Using the Admin Dashboard

1. Log in to the admin dashboard at `/admin`
2. Navigate to the IP Whitelist section (you may need to add this feature)
3. Add your IP address manually

## How to Find Your IP Address

Run this command in your terminal or visit https://whatismyipaddress.com:

```bash
curl https://api.ipify.org
```

Or check the browser console when you try to generate a report - the rate limit response includes your IP address.

## Example SQL Commands

### Add an IP to whitelist
```sql
INSERT INTO whitelisted_ips (ip_address, description, is_active)
VALUES ('192.168.1.100', 'Development machine', true);
```

### View all whitelisted IPs
```sql
SELECT * FROM whitelisted_ips WHERE is_active = true;
```

### Remove an IP from whitelist (soft delete)
```sql
UPDATE whitelisted_ips
SET is_active = false
WHERE ip_address = '192.168.1.100';
```

### Permanently delete a whitelisted IP
```sql
DELETE FROM whitelisted_ips
WHERE ip_address = '192.168.1.100';
```

## Notes

- Whitelisted IPs completely bypass rate limiting
- Only active (`is_active = true`) whitelist entries are checked
- The whitelist is checked before banned IPs, so a whitelisted IP can't be banned
- You need to be an authenticated admin user to manage the whitelist via the UI
