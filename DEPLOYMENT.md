# ESG Report Generator - Deployment Guide

## Custom Domain Setup: esgreport.co.uk

### Prerequisites
- Domain registered and DNS accessible
- Hosting platform account (Netlify, Vercel, or Cloudflare Pages recommended)
- Supabase project configured
- Google Gemini API key

## Deployment Steps

### 1. Configure Environment Variables

In your hosting platform (Netlify Dashboard), set these environment variables:

```
VITE_GEMINI_API_KEY=your-actual-gemini-api-key-here
VITE_SUPABASE_URL=your-supabase-project-url-here
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

**How to Set in Netlify:**
1. Go to your Netlify Dashboard
2. Select your project: **esgreportingai.com**
3. Go to **Site Configuration** > **Environment Variables**
4. Click **Add a variable** and add each of the above variables
5. After adding all variables, click **Save**
6. Redeploy your site: Go to **Deploys** > **Trigger Deploy** > **Deploy Site**

### 2. DNS Configuration

**Option A: Using Netlify**

1. Add these DNS records at your domain registrar:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

**Option B: Using Vercel**

1. Add these DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Option C: Using Cloudflare Pages**

1. Point nameservers to Cloudflare
2. Add project in Cloudflare Pages
3. Configure custom domain in Pages settings

### 3. Build Configuration

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Node Version:**
```
18.x or higher
```

### 4. Netlify Deployment (Recommended)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize site:
```bash
netlify init
```

4. Deploy:
```bash
netlify deploy --prod
```

5. Configure custom domain in Netlify dashboard:
   - Go to Domain Settings
   - Add custom domain: esgreport.co.uk
   - Configure DNS as shown above
   - Enable HTTPS (automatic with Netlify)

### 5. Vercel Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Add custom domain in Vercel dashboard:
   - Go to Project Settings > Domains
   - Add domain: esgreport.co.uk
   - Configure DNS records
   - HTTPS configured automatically

### 6. Environment-Specific Configuration

The application uses different configurations based on environment:

- **Development:** `.env` file (local only)
- **Production:** Platform environment variables

### 7. Admin Access



**Important:** Keep this URL private and secure. Do not share publicly.

### 8. Performance Optimizations Applied

- **Code Splitting:** Vendor chunks separated for better caching
- **Lazy Loading:** Admin and main app loaded on demand
- **Minification:** Terser with console.log removal in production
- **Tree Shaking:** Unused code eliminated
- **Gzip Compression:** Enabled by default on most platforms
- **Asset Optimization:** Images and fonts optimized

### 9. Security Checklist

- [x] Environment variables configured on hosting platform
- [x] Admin URL is obfuscated and secure
- [x] RLS policies enabled on all Supabase tables
- [x] Rate limiting implemented (1 report per hour per IP)
- [x] HTTPS enabled (automatic with hosting platforms)
- [x] CORS headers configured in Edge Functions
- [x] IP banning system in place
- [x] Admin authentication required for dashboard access

### 10. Post-Deployment Verification

1. **Test Main Application:**
   - Visit https://esgreport.co.uk
   - Complete report generation flow
   - Verify email notifications
   - Test rate limiting

2. **Test Admin Dashboard:**
   - Visit admin URL
   - Login with credentials
   - Test all admin features
   - Verify data exports

3. **Test Mobile Responsiveness:**
   - Check on mobile devices
   - Verify touch interactions
   - Test all breakpoints

4. **Performance Testing:**
   - Run Lighthouse audit (target: 90+ score)
   - Check page load times (target: < 3s)
   - Verify bundle sizes
   - Test on slow connections

### 11. Monitoring & Maintenance

**Supabase Dashboard:**
- Monitor database usage
- Check Edge Function logs
- Review rate limit data
- Monitor storage

**Hosting Platform:**
- Check deployment logs
- Monitor bandwidth usage
- Review error logs
- Track performance metrics

### 12. Backup & Recovery

**Database Backups:**
- Use admin dashboard to export database regularly
- Supabase provides automatic backups
- Download exports monthly for safekeeping

**Code Repository:**
- Ensure GitHub/GitLab repo is up to date
- Tag releases for version control
- Document major changes

### 13. Troubleshooting

**Issue:** Reports not generating
- Check Gemini API key is valid
- Verify API quota not exceeded
- Check browser console for errors

**Issue:** Admin login fails
- Verify credentials
- Check Supabase authentication is working
- Ensure admin user exists in database

**Issue:** Emails not sending
- Check Edge Function logs in Supabase
- Verify email addresses are valid
- Check Supabase service role key

**Issue:** Rate limiting too strict
- Adjust time window in Edge Function
- Consider IP whitelist for testing
- Check banned IPs list

### 14. Scaling Considerations

**Current Limits:**
- Rate Limit: 1 report per hour per IP
- Database: Supabase free tier supports 500MB
- Edge Functions: 500K invocations/month free

**If scaling needed:**
- Upgrade Supabase plan for more resources
- Implement Redis for rate limiting
- Add CDN for static assets
- Consider horizontal scaling

### 15. SEO Configuration

The application includes:
- Dynamic meta tags (configurable in admin)
- robots.txt for crawlers
- Sitemap generator (URLs in admin)
- Semantic HTML structure
- Mobile-friendly design


## Support

For issues or questions:
- Email: ronchimbo@gmail.com
- Check Supabase logs for backend issues
- Review hosting platform logs for deployment issues

## Version Information

- Node.js: v18+ required
- React: v18.3.1
- Vite: v5.4.8
- Supabase: v2.57.4
