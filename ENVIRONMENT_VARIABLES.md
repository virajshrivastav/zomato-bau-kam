# Environment Variables Guide - Zomato BAU KAM Dashboard

## 📋 Quick Setup

### 1. Create `.env.local` file in the root directory

```bash
# Copy the example file
cp .env.example .env.local
```

### 2. Fill in the values from the sections below

---

## 🔑 Required Environment Variables

### **Supabase Configuration**

```env
VITE_SUPABASE_URL=https://npmnpncyuqzluhqralkb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbW5wbmN5dXF6bHVocXJhbGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NDgyMzAsImV4cCI6MjA3ODMyNDIzMH0.v3QI0O6kLb40h88hgih1EqtugI_jHVHOScSHjieQ9Hk
```

**Where to find:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `zomato-drive-dashboard`
3. Navigate to **Settings → API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

### **Google OAuth Configuration**

```env
VITE_GOOGLE_CLIENT_ID=201674623022-c1qkua2u896525g5b115at92h1tbtsrm.apps.googleusercontent.com
```

**Where to find:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services → Credentials**
4. Create **OAuth 2.0 Client ID** (if not exists):
   - Application type: **Web application**
   - Name: `Zomato BAU KAM Dashboard`
   - Authorized JavaScript origins:
     - `http://localhost:8080` (development)
     - `https://your-production-domain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:8080/dashboard` (development)
     - `https://your-production-domain.com/dashboard` (production)
5. Copy the **Client ID** → `VITE_GOOGLE_CLIENT_ID`

**Supabase OAuth Setup:**
1. In Supabase Dashboard → **Authentication → Providers**
2. Enable **Google** provider
3. Add the Google Client ID and Client Secret
4. Copy the **Callback URL** from Supabase
5. Add this callback URL to Google Cloud Console authorized redirect URIs

---

### **Authentication Settings**

```env
# Development Mode (allows test emails)
VITE_RESTRICT_DOMAIN=false

# Production Mode (only @zomato.com emails)
# VITE_RESTRICT_DOMAIN=true
```

**Options:**
- `false` - Development mode: Allows whitelisted test emails + @zomato.com emails
- `true` - Production mode: Only @zomato.com emails allowed

**Whitelisted Test Emails** (defined in `src/contexts/AuthContext.tsx`):
- `virajshrivastav919@gmail.com`
- Add more in the `ALLOWED_TEST_EMAILS` array

---

## 📝 Complete `.env.local` Template

```env
# ============================================
# Zomato BAU KAM Dashboard - Environment Variables
# ============================================

# Supabase Configuration
VITE_SUPABASE_URL=https://npmnpncyuqzluhqralkb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbW5wbmN5dXF6bHVocXJhbGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NDgyMzAsImV4cCI6MjA3ODMyNDIzMH0.v3QI0O6kLb40h88hgih1EqtugI_jHVHOScSHjieQ9Hk

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=201674623022-c1qkua2u896525g5b115at92h1tbtsrm.apps.googleusercontent.com

# Authentication Settings
VITE_RESTRICT_DOMAIN=false
```

---

## 🚀 Deployment Environment Variables

### **Vercel Deployment**

Add these in **Vercel Dashboard → Settings → Environment Variables**:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://npmnpncyuqzluhqralkb.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
| `VITE_GOOGLE_CLIENT_ID` | `201674623022-c1qkua2u896525g5b115at92h1tbtsrm.apps.googleusercontent.com` | Production, Preview, Development |
| `VITE_RESTRICT_DOMAIN` | `true` | Production |
| `VITE_RESTRICT_DOMAIN` | `false` | Preview, Development |

### **Netlify Deployment**

Add these in **Netlify Dashboard → Site Settings → Environment Variables**:

Same variables as Vercel above.

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Keep `.env.local` in `.gitignore` (already configured)
- ✅ Use different credentials for development and production
- ✅ Rotate keys periodically
- ✅ Use `VITE_RESTRICT_DOMAIN=true` in production
- ✅ Store production secrets in deployment platform (Vercel/Netlify)

### ❌ DON'T:
- ❌ Never commit `.env.local` to git
- ❌ Never share credentials in public channels
- ❌ Never use production credentials in development
- ❌ Never hardcode credentials in source code

---

## 🧪 Testing Environment Variables

### Check if variables are loaded:

```bash
# Start development server
npm run dev

# Open browser console and check:
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)
console.log(import.meta.env.VITE_RESTRICT_DOMAIN)
```

### Verify Supabase Connection:

```typescript
// In browser console
import { supabase } from '@/lib/supabase'
const { data, error } = await supabase.from('restaurants').select('count')
console.log(data, error)
```

---

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:**
1. Ensure `.env.local` exists in root directory
2. Verify all variables start with `VITE_`
3. Restart development server after creating/modifying `.env.local`

### Issue: "Access Denied" on login

**Solution:**
1. Check `VITE_RESTRICT_DOMAIN` setting
2. If `true`, only @zomato.com emails work
3. If `false`, check if your email is in `ALLOWED_TEST_EMAILS` array
4. Add your test email to `src/contexts/AuthContext.tsx`

### Issue: Google OAuth not working

**Solution:**
1. Verify `VITE_GOOGLE_CLIENT_ID` is correct
2. Check authorized redirect URIs in Google Cloud Console
3. Ensure Supabase callback URL is added to Google OAuth
4. Verify Google provider is enabled in Supabase

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## 🔄 Environment Variable Updates

**Last Updated:** 2025-01-12

**Current Configuration:**
- Supabase Project: `npmnpncyuqzluhqralkb`
- Google OAuth Client: `201674623022-c1qkua2u896525g5b115at92h1tbtsrm`
- Development Mode: Enabled (test emails allowed)

