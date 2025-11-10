# 🔐 Authentication Guide - Google OAuth Setup

**Last Updated:** November 10, 2025  
**Authentication Method:** Google OAuth (Primary) + Email/Password (Fallback)  
**Domain Restriction:** @zomato.com (Production) | Whitelist (Development)

---

## 📋 Overview

This dashboard uses **Google OAuth** as the primary authentication method with domain restriction to `@zomato.com` emails. Email/password authentication is available as a fallback option.

### Key Features

- ✅ **Google OAuth** - One-click sign-in with Google Workspace
- ✅ **Domain Restriction** - Only @zomato.com emails in production
- ✅ **Development Mode** - Test email whitelist for local development
- ✅ **Email/Password Fallback** - Traditional authentication still available
- ✅ **Row Level Security** - Database automatically filters data per user
- ✅ **Session Management** - Automatic session persistence and refresh

---

## 🚀 Quick Start

### For Developers (Local Setup)

1. **Get Google OAuth Credentials** (see detailed steps below)
2. **Configure Supabase** with Google provider
3. **Update `.env.local`** with credentials
4. **Add test emails** to whitelist (optional)
5. **Run dev server** and test

### For Production Deployment

1. **Set `VITE_RESTRICT_DOMAIN=true`** in environment variables
2. **Add production domain** to Google OAuth settings
3. **Deploy** - only @zomato.com emails will be allowed

---

## 🔧 Step-by-Step Setup

### Step 1: Google Cloud Console Configuration

#### 1.1 Create/Select Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on project dropdown (top left)
3. Click "New Project" or select existing project
4. Project name: `Zomato Drive Dashboard`
5. Click "Create"

#### 1.2 Enable Google+ API

1. Navigate to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it and click **"Enable"**
4. Wait for activation (~30 seconds)

#### 1.3 Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure OAuth consent screen:
   - User Type: **Internal** (for Zomato employees only)
   - App name: `Zomato Drive Dashboard`
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"
4. Application type: **"Web application"**
5. Name: `Zomato Dashboard OAuth Client`

#### 1.4 Configure Authorized URLs

**Authorized JavaScript origins:**
```
http://localhost:8080
http://localhost:5173
https://your-production-domain.com
```

**Authorized redirect URIs:**
```
http://localhost:8080/auth/callback
http://localhost:5173/auth/callback
https://[your-supabase-project-id].supabase.co/auth/v1/callback
https://your-production-domain.com/auth/callback
```

6. Click **"Create"**
7. **Copy the Client ID and Client Secret** (you'll need these next)

---

### Step 2: Supabase Configuration

#### 2.1 Enable Google Provider

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **"Authentication"** → **"Providers"**
4. Scroll down to find **"Google"**
5. Click to expand the Google provider section

#### 2.2 Configure Google OAuth

1. Toggle **"Enable Sign in with Google"** to ON
2. Enter your **Client ID** (from Step 1.4)
3. Enter your **Client Secret** (from Step 1.4)
4. **Copy the Redirect URL** shown by Supabase
   - It will look like: `https://xxxxx.supabase.co/auth/v1/callback`
5. Click **"Save"**

#### 2.3 Update Google OAuth Settings

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **"APIs & Services"** → **"Credentials"**
3. Click on your OAuth 2.0 Client ID
4. Add the Supabase redirect URL to **"Authorized redirect URIs"**
5. Click **"Save"**

---

### Step 3: Environment Variables

#### 3.1 Copy Environment Template

```bash
cp .env.example .env.local
```

#### 3.2 Update `.env.local`

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Development Mode
# Set to 'false' for development (allows test emails)
# Set to 'true' for production (only @zomato.com)
VITE_RESTRICT_DOMAIN=false
```

**Where to find these values:**

- **VITE_SUPABASE_URL**: Supabase Dashboard → Settings → API → Project URL
- **VITE_SUPABASE_ANON_KEY**: Supabase Dashboard → Settings → API → Project API keys → anon public
- **VITE_GOOGLE_CLIENT_ID**: Google Cloud Console → Credentials → Your OAuth Client ID

---

### Step 4: Development Mode Setup

#### 4.1 Add Test Emails to Whitelist

If you want to test with non-@zomato.com emails during development:

1. Open `src/contexts/AuthContext.tsx`
2. Find the `ALLOWED_TEST_EMAILS` array (around line 8)
3. Add your test Gmail accounts:

```typescript
const ALLOWED_TEST_EMAILS = [
  'yourname@gmail.com',
  'test.user@gmail.com',
  'developer@gmail.com',
];
```

4. Save the file
5. Vite will auto-reload the application

#### 4.2 Verify Development Mode

1. Start the dev server: `npm run dev`
2. Open the login page
3. You should see a yellow banner: **"🔧 Development Mode: Test emails allowed"**
4. This confirms `VITE_RESTRICT_DOMAIN=false` is working

---

### Step 5: Testing

#### 5.1 Test Google OAuth

1. Click **"Sign in with Google"** button
2. You'll be redirected to Google's sign-in page
3. Sign in with any Google account
4. **Expected behavior:**
   - ✅ @zomato.com email → Access granted, redirected to dashboard
   - ✅ Whitelisted email (dev mode) → Access granted
   - ❌ Non-whitelisted email → Access denied, error toast

#### 5.2 Test Email/Password Fallback

1. Use the email/password form below the Google button
2. Test credentials:
   - Email: `shiv.kumar@zomato.com`
   - Password: `zomato123`
3. Should work as before

#### 5.3 Test Data Filtering (RLS)

1. Sign in as `shiv.kumar@zomato.com`
2. Navigate to KAM Hub
3. You should only see Shiv's restaurants (R001, R002, R009)
4. Sign out and sign in as `amdeep.singh@zomato.com`
5. You should only see Amdeep's restaurants (R003, R004, R010)

---

## 🔒 Security Features

### Row Level Security (RLS)

The database automatically filters data based on the authenticated user's email:

```sql
-- Example RLS Policy
CREATE POLICY "Users can view their own restaurants"
ON restaurants FOR SELECT
USING (kam_email = auth.jwt() ->> 'email');
```

**What this means:**
- Each user only sees their own data
- No manual filtering needed in application code
- Database-level security enforcement
- Works automatically with Google OAuth

### Email Validation

Authentication flow includes multiple validation layers:

1. **Google OAuth** - Domain restriction via `hd` parameter (production)
2. **Frontend Validation** - Email check in `AuthContext.tsx`
3. **Database Validation** - RLS policies filter by email
4. **Session Validation** - Continuous email verification

---

## 🌍 Production Deployment

### Environment Variables for Production

```bash
# Production .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_RESTRICT_DOMAIN=true  # ← Important: Set to true
```

### Update Google OAuth for Production

1. Go to Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add production URLs:
   - **Authorized JavaScript origins**: `https://your-domain.com`
   - **Authorized redirect URIs**: `https://your-domain.com/auth/callback`
4. Save changes

### Deployment Checklist

- [ ] `VITE_RESTRICT_DOMAIN=true` in production environment
- [ ] Production domain added to Google OAuth settings
- [ ] Supabase redirect URL configured
- [ ] Test with @zomato.com email
- [ ] Verify non-@zomato.com emails are blocked
- [ ] Check RLS policies are active
- [ ] Test sign-out functionality

---

## 🐛 Troubleshooting

### Issue: "Redirect URI mismatch" error

**Cause:** The redirect URI in your request doesn't match Google OAuth settings

**Solution:**
1. Check your dev server port (8080 or 5173?)
2. Add the correct port to Google OAuth settings
3. Make sure Supabase redirect URL is added

### Issue: "Access Denied" toast appears

**Cause:** Email is not authorized

**Solution:**
- **Development:** Add email to `ALLOWED_TEST_EMAILS` in `AuthContext.tsx`
- **Production:** Only @zomato.com emails are allowed

### Issue: Google sign-in button doesn't work

**Cause:** Missing environment variables or incorrect configuration

**Solution:**
1. Check `.env.local` has `VITE_GOOGLE_CLIENT_ID`
2. Restart dev server after changing `.env.local`
3. Check browser console for errors (F12)
4. Verify Supabase Google provider is enabled

### Issue: User sees wrong data after login

**Cause:** RLS policies not working or email mismatch

**Solution:**
1. Check database RLS policies are enabled
2. Verify user's email matches `kam_email` in restaurants table
3. Check Supabase logs for policy errors

---

## 📚 Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎯 Summary

**Development:**
- Use `VITE_RESTRICT_DOMAIN=false`
- Add test emails to whitelist
- Test with any Google account

**Production:**
- Use `VITE_RESTRICT_DOMAIN=true`
- Only @zomato.com emails allowed
- Domain restriction enforced

**Security:**
- Row Level Security (RLS) filters data per user
- Email validation at multiple layers
- Session management with Supabase
- JWT-based authentication

---

For questions or issues, refer to the troubleshooting section or check the main [README.md](README.md).

