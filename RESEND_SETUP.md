# Setting Up Resend API Key for Email Notifications

## Quick Setup Instructions

To enable email notifications to ronchimbo@gmail.com, you need to add your Resend API key to Supabase:

### Step 1: Get Your Resend API Key
1. Go to [resend.com](https://resend.com) and sign up (free tier includes 3,000 emails/month)
2. Create an API key from your dashboard
3. Copy the API key (starts with `re_`)

### Step 2: Add the API Key to Supabase

#### Option A: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref osfclmsaegbvqglllpww

# Set the secret
supabase secrets set RESEND_API_KEY=your_api_key_here
```

#### Option B: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** → **Settings**
3. Scroll down to **Secrets**
4. Add a new secret:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (e.g., `re_xxxxxxxxxxxxx`)
5. Save the secret

### Step 3: Verify Email Domain (For Production)

For production use, you need to verify your sending domain with Resend:

1. Go to your Resend dashboard
2. Navigate to **Domains**
3. Add your domain (e.g., `esgreportai.com`)
4. Add the DNS records provided by Resend to your domain
5. Wait for verification

**Note**: Until your domain is verified, emails will be sent from `onboarding@resend.dev` with some limitations.

### Step 4: Update the Edge Function (if needed)

If you want to use a custom domain, update the `from` field in:
`/supabase/functions/send-admin-notification/index.ts`

Change:
```typescript
from: "ESG Report AI <notifications@esgreportai.com>",
```

To your verified domain:
```typescript
from: "ESG Report AI <notifications@yourdomain.com>",
```

### What Gets Emailed

Once configured, you'll receive emails for:
- ✉️ Contact form submissions
- 📊 ESG report generations
- 💰 Pricing inquiries
- 📧 Newsletter subscriptions
- ✅ Professional service requests

All emails go to: **ronchimbo@gmail.com**

### Testing

After adding the API key, test by:
1. Submitting the contact form
2. Generating a test report
3. Subscribing to the newsletter

You should receive emails within seconds!
