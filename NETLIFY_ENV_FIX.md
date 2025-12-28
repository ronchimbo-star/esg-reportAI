# Fix Gemini API Key Error in Production

## Problem
Your production site (esgreportingai.com) is showing:
```
Failed to generate report.
REQUIRED: Google Gemini API Key
```

## Root Cause
Environment variables are not configured in Netlify. The app works locally because you have a `.env` file, but production deployments don't have access to local files.

## Solution: Add Environment Variables to Netlify

### Step 1: Access Netlify Dashboard
1. Go to https://app.netlify.com/
2. Login to your account
3. Select your site: **esgreportingai.com**

### Step 2: Add Environment Variables
1. In your site dashboard, click **Site Configuration** (or **Site Settings**)
2. Scroll down and click **Environment Variables** in the left sidebar
3. Click the **Add a variable** button
4. Add these **THREE** variables one by one:

#### Variable 1: Gemini API Key
```
Key:   VITE_GEMINI_API_KEY
Value: your-actual-gemini-api-key-here
```

#### Variable 2: Supabase URL
```
Key:   VITE_SUPABASE_URL
Value: your-supabase-project-url-here
```

#### Variable 3: Supabase Anon Key
```
Key:   VITE_SUPABASE_ANON_KEY
Value: your-supabase-anon-key-here
```

5. Click **Save** after adding all three variables

### Step 3: Redeploy Your Site
1. Go to the **Deploys** tab
2. Click **Trigger Deploy** button (top right)
3. Select **Deploy Site**
4. Wait for the deployment to complete (usually 1-2 minutes)

### Step 4: Test Your Site
1. Visit https://esgreportingai.com
2. Complete the form and try generating a report
3. The error should be gone!

## Visual Guide

**Finding Environment Variables:**
```
Netlify Dashboard
  └── Your Site (esgreportingai.com)
      └── Site Configuration
          └── Environment Variables (left sidebar)
              └── Add a variable (button)
```

**Setting Each Variable:**
```
┌─────────────────────────────────────────┐
│ Add environment variable                │
├─────────────────────────────────────────┤
│ Key:   [VITE_GEMINI_API_KEY          ] │
│ Value: [your-api-key-here...         ] │
│                                          │
│ Scopes: ☑ Builds  ☑ Functions          │
│                                          │
│        [Cancel]  [Create variable]      │
└─────────────────────────────────────────┘
```

## Important Notes

⚠️ **Variable Prefix:** All variables MUST start with `VITE_` to be accessible in the frontend application.

⚠️ **Exact Match:** Copy the variable names exactly as shown (case-sensitive).

⚠️ **Redeploy Required:** Changes to environment variables only take effect after redeploying.

⚠️ **Build vs Runtime:** These are build-time variables, not runtime secrets. They're embedded in the built JavaScript.

## Verification

After redeploying, you can verify the environment variables are set:

1. Open your browser's Developer Tools (F12)
2. Go to Console tab
3. Type: `import.meta.env`
4. You should see your variables listed

## Troubleshooting

### Still Getting Error After Redeployment?
1. **Clear Browser Cache:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check Variable Names:** Ensure they start with `VITE_` and match exactly
3. **Check Deploy Logs:** In Netlify, view the build log to confirm no errors
4. **Wait for DNS:** Sometimes takes a few minutes for changes to propagate

### Variables Not Showing Up?
- Make sure you clicked **Save** after adding variables
- Ensure you triggered a **new deploy** (not just saved settings)
- Check you're on the correct Netlify site

### API Key Invalid?
- The key shown is your actual working key from `.env`
- If you want a fresh key, get one from: https://makersuite.google.com/app/apikey

## Alternative: Deploy via CLI

If you prefer command-line deployment:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to your site
netlify link

# Set environment variables
netlify env:set VITE_GEMINI_API_KEY "your-actual-gemini-api-key-here"
netlify env:set VITE_SUPABASE_URL "your-supabase-project-url-here"
netlify env:set VITE_SUPABASE_ANON_KEY "your-supabase-anon-key-here"

# Deploy
netlify deploy --prod
```

## Need Help?

If you're still experiencing issues:
1. Check the Netlify deploy logs for specific errors
2. Verify your Gemini API key works at: https://makersuite.google.com/app/apikey
3. Contact support with your deploy log

---

**Quick Summary:**
1. ✅ Add 3 environment variables to Netlify
2. ✅ Redeploy the site
3. ✅ Test report generation

That's it! Your production site will work once the environment variables are configured.
