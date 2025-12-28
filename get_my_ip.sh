#!/bin/bash
# Quick script to get your current IP address

echo "Fetching your current IP address..."
echo ""

# Method 1: Using ipify API
IP=$(curl -s https://api.ipify.org)
if [ ! -z "$IP" ]; then
    echo "Your IP address is: $IP"
    echo ""
    echo "To whitelist this IP, run this SQL in Supabase:"
    echo ""
    echo "INSERT INTO whitelisted_ips (ip_address, description, is_active)"
    echo "VALUES ('$IP', 'My Development IP', true)"
    echo "ON CONFLICT (ip_address) DO UPDATE SET is_active = true;"
    echo ""
else
    echo "Failed to fetch IP address. Try visiting: https://api.ipify.org"
fi
