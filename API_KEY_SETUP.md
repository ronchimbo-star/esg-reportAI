# ⚠️ IMPORTANT: Google Gemini API Key Required

The ESG Report Generator requires a **Google Gemini API key** to generate reports.

## 🔑 How to Get Your FREE API Key

1. **Visit Google AI Studio**: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. **Sign in** with your Google account
3. **Click "Get API Key"** or "Create API Key"
4. **Copy** your API key

## ⚙️ How to Add Your API Key

### Step 1: Locate the .env file
The `.env` file is in the project root directory (same level as `package.json`)

### Step 2: Edit the .env file
Open `.env` and replace the placeholder:

**Before:**
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**After:**
```env
VITE_GEMINI_API_KEY=AIzaSyD_your_actual_key_here_1234567890
```

### Step 3: Restart the development server
If the dev server is running, stop it (Ctrl+C) and restart:
```bash
npm run dev
```

## ✅ Verify It's Working

1. Complete the 3-step form in the application
2. Click "Generate Report"
3. If you see the "What's Next?" modal, it's working!
4. If you see an error about API key, double-check your `.env` file

## 🔒 Security Notes

- ✅ Never commit your API key to version control
- ✅ The `.env` file is already in `.gitignore`
- ✅ Keep your API key confidential
- ✅ Don't share your `.env` file with others

## 💡 Troubleshooting

**Problem**: Still getting "API key" error
- Make sure there are no spaces before/after the key
- Ensure the key starts with `AIza`
- Verify you saved the `.env` file
- Try restarting the dev server

**Problem**: "Quota exceeded" error
- Gemini has free tier limits
- Wait a few minutes and try again
- Consider upgrading to a paid tier for higher limits

## 📞 Need Help?

If you're still having issues, contact: experts@esgreport.co.uk
