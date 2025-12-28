-- Quick command to whitelist your IP address
-- Replace 'YOUR_IP_ADDRESS' with your actual IP

-- Method 1: Simple insert (recommended)
INSERT INTO whitelisted_ips (ip_address, description, is_active)
VALUES ('YOUR_IP_ADDRESS', 'My Development IP', true)
ON CONFLICT (ip_address) DO UPDATE SET is_active = true;

-- Method 2: Find your current IP from rate limits table and whitelist it
INSERT INTO whitelisted_ips (ip_address, description, is_active)
SELECT DISTINCT ip_address, 'Auto-whitelisted from rate limits', true
FROM report_rate_limits
WHERE ip_address = 'YOUR_IP_ADDRESS'
ON CONFLICT (ip_address) DO UPDATE SET is_active = true;

-- Check what IPs are currently whitelisted
SELECT ip_address, description, is_active, created_at
FROM whitelisted_ips
ORDER BY created_at DESC;

-- To find what IP addresses have generated reports recently:
SELECT ip_address, report_count, last_report_at
FROM report_rate_limits
ORDER BY last_report_at DESC
LIMIT 10;
