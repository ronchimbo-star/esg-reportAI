# Quick Start Guide - ESG Report Generator

## 🚀 Deploy in 5 Minutes

### Step 1: Deploy to Netlify (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

When prompted:
- Build command: `npm run build`
- Publish directory: `dist`

### Step 2: Set Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables:

```

```

### Step 3: Configure Custom Domain

In Netlify Dashboard → Domain Management:
1. Add domain: `esgreport.co.uk`
2. Update DNS at your registrar:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```
3. Wait for DNS propagation (5-30 minutes)
4. HTTPS automatically enabled

### Step 4: Test Everything

**Main App:**
- Visit: https://esgreport.co.uk
- Generate a test report
- Verify email notifications

**Admin Dashboard:**
- Visit: https://esgreport.co.uk/6l$CX9VI1&Hb#O0
- Login: ronchimbo@gmail.com
- Password: Rmgc6983AD!
- Test all admin features

## ✅ You're Live!

Your ESG Report Generator is now live at https://esgreport.co.uk

---

## 📋 Important URLs

**Main Site:** https://esgreport.co.uk
**Admin Dashboard:** https://esgreport.co.uk/6l$CX9VI1&Hb#O0
**Supabase Dashboard:** https://supabase.com/dashboard
**Netlify Dashboard:** https://app.netlify.com

---

## 🔑 Key Features

### For Users
- Generate ESG reports with AI
- Multiple frameworks (GRI, SASB, TCFD, etc.)
- Download as PDF/HTML
- Email delivery
- Mobile-friendly

### For Admin
- View all reports
- Export database
- Manage IP bans
- Configure SEO
- Monitor activity

---

## 📊 What's Included

✅ Optimized production build (130 KB gzipped)
✅ Code splitting & lazy loading
✅ Mobile responsive design
✅ Rate limiting (1 report/hour/IP)
✅ IP banning system
✅ Email notifications
✅ SEO optimized
✅ Secure admin dashboard
✅ Database backups
✅ Performance monitoring ready

---

## 🛠️ Troubleshooting

**Reports not generating?**
→ Check Gemini API key in environment variables

**Can't login to admin?**
→ URL is `/6l$CX9VI1&Hb#O0` (note special characters)

**Emails not working?**
→ Check Supabase Edge Function logs

**Rate limited?**
→ Wait 1 hour or clear `report_rate_limits` table

---

## 📚 Full Documentation

- **PRODUCTION_READY.md** - Complete overview
- **DEPLOYMENT.md** - Detailed deployment guide
- **PERFORMANCE.md** - Performance metrics
- **API_KEY_SETUP.md** - API configuration

---

## 💡 Tips

1. **Monitor regularly:** Check Supabase dashboard weekly
2. **Backup database:** Use admin export monthly
3. **Update dependencies:** Run `npm update` quarterly
4. **Review performance:** Run Lighthouse tests
5. **Check logs:** Review error logs in hosting dashboard

---

## 🎯 Success Metrics

Track these to measure success:
- Reports generated per day
- User engagement
- Page load times
- Error rates
- Mobile vs desktop usage

---

## 📞 Support

**Email:** ronchimbo@gmail.com

Need help? Check the documentation files or contact support.

---

**Status: PRODUCTION READY** ✅

Deploy with confidence!
