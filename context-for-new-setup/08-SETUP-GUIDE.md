# Setup Guide - Step-by-Step Instructions

## Prerequisites

Before starting, ensure you have:
- **Node.js** 18+ installed
- **npm** 9+ installed
- **Git** installed
- **Supabase account** (free tier works)
- **Google Cloud account** (for OAuth, optional)
- **Code editor** (VS Code recommended)

---

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd zomato-loveable
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:
- React 18
- Vite
- Supabase client
- TanStack Query (React Query)
- shadcn/ui components
- Tailwind CSS
- Recharts
- And more...

---

## Step 3: Create Supabase Project

### 3.1 Sign Up for Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email

### 3.2 Create New Project

1. Click "New Project"
2. Choose organization (or create new)
3. Enter project details:
   - **Name**: zomato-drive-dashboard
   - **Database Password**: (generate strong password, save it)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for project to be ready

### 3.3 Get Project Credentials

1. Go to Project Settings → API
2. Copy the following:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## Step 4: Set Up Database

### 4.1 Open SQL Editor

1. In Supabase dashboard, go to SQL Editor
2. Click "New query"

### 4.2 Run Setup Script

1. Open `supabase-setup.sql` from the project
2. Copy entire contents
3. Paste into SQL Editor
4. Click "Run" (or press Ctrl+Enter)

This creates:
- 4 tables (restaurants, drives, drive_data, conversion_tracking)
- All indexes
- All RLS policies
- 10 sample restaurants
- 3 active drives
- 13 drive assignments

### 4.3 Verify Setup

Run this query to verify:

```sql
SELECT COUNT(*) FROM restaurants; -- Should return 10
SELECT COUNT(*) FROM drives; -- Should return 3
SELECT COUNT(*) FROM drive_data; -- Should return 13
```

---

## Step 5: Configure Environment Variables

### 5.1 Create .env.local File

In project root, create `.env.local`:

```bash
touch .env.local
```

### 5.2 Add Supabase Credentials

Open `.env.local` and add:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_RESTRICT_DOMAIN=false
```

Replace:
- `your-project.supabase.co` with your Project URL
- `your-anon-key-here` with your Anon/Public Key

**Important**: Set `VITE_RESTRICT_DOMAIN=false` for development. This allows test emails.

---

## Step 6: Create Test User Accounts

### 6.1 Option A: Use Pre-configured Test Accounts

The database already has 4 KAMs with restaurants assigned. Create auth accounts for them:

1. Go to Supabase dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Create these accounts:

```
Email: shiv.kumar@zomato.com
Password: zomato123
(Assigned 3 restaurants: Viraj, Snehil, Rakesh)

Email: amdeep.singh@zomato.com
Password: zomato123
(Assigned 3 restaurants: Priya, Ananya, Rohan)

Email: shrawani.patil@zomato.com
Password: zomato123
(Assigned 2 restaurants: Kavya, Arjun)

Email: rutuja.deshmukh@zomato.com
Password: zomato123
(Assigned 2 restaurants: Neha, Siddharth)
```

### 6.2 Option B: Use Your Own Email (Development)

1. Add your email to whitelist in `src/contexts/AuthContext.tsx`:

```typescript
const ALLOWED_TEST_EMAILS = [
  'virajshrivastav919@gmail.com',
  'your-email@example.com', // Add your email here
];
```

2. Sign up through the app (it will create the account)
3. Update a restaurant's `kam_email` to your email:

```sql
UPDATE restaurants 
SET kam_email = 'your-email@example.com' 
WHERE res_id = 'R001';
```

---

## Step 7: Run Development Server

```bash
npm run dev
```

This starts Vite dev server on `http://localhost:8080`

Open browser and navigate to `http://localhost:8080`

---

## Step 8: Test Core Features

### 8.1 Test Login

1. Go to `http://localhost:8080`
2. Enter test credentials:
   - Email: `shiv.kumar@zomato.com`
   - Password: `zomato123`
3. Click "Login"
4. Should redirect to `/dashboard`

### 8.2 Test KAM Hub

1. Click "KAM Hub" in sidebar
2. Should see 3 restaurants (Viraj, Snehil, Rakesh)
3. Try searching for "Viraj"
4. Should filter to show only Viraj

### 8.3 Test Restaurant Detail

1. Click on "Viraj" restaurant card
2. Should navigate to `/restaurant/R001`
3. Should see restaurant details
4. Should see 3 active drives (NCN, N2R, MRP)

### 8.4 Test Mark as Approached

1. On restaurant detail page
2. Click "Mark as Approached" for NCN drive
3. Should see success toast
4. Button should change to "Mark as Converted"
5. Status badge should update to "Approached"

### 8.5 Test Mark as Converted

1. Click "Mark as Converted" for NCN drive
2. Should see success toast
3. Button should disappear
4. Status badge should update to "Converted"

### 8.6 Test Logout

1. Click "Logout" in sidebar
2. Should redirect to `/` (login page)
3. Try accessing `/kam-hub` directly
4. Should redirect back to `/` (protected route working)

---

## Step 9: (Optional) Set Up Google OAuth

### 9.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Go to APIs & Services → Credentials
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen if prompted
6. Application type: Web application
7. Add authorized JavaScript origins:
   - `http://localhost:8080`
8. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
9. Click "Create"
10. Copy Client ID and Client Secret

### 9.2 Configure Supabase

1. Go to Supabase dashboard → Authentication → Providers
2. Find "Google" provider
3. Enable it
4. Paste Client ID and Client Secret
5. Click "Save"

### 9.3 Add Client ID to .env.local

```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 9.4 Test Google OAuth

1. Restart dev server (`npm run dev`)
2. Go to login page
3. Click "Sign in with Google"
4. Should redirect to Google consent screen
5. Sign in with @zomato.com email (or whitelisted email)
6. Should redirect back to `/dashboard`

---

## Step 10: Verify RLS Policies

### 10.1 Test Data Isolation

1. Log in as `shiv.kumar@zomato.com`
2. Go to KAM Hub
3. Should see only 3 restaurants (Viraj, Snehil, Rakesh)
4. Log out
5. Log in as `amdeep.singh@zomato.com`
6. Go to KAM Hub
7. Should see only 3 restaurants (Priya, Ananya, Rohan)

This confirms RLS is working correctly.

### 10.2 Test Update Permissions

1. Log in as `shiv.kumar@zomato.com`
2. Go to Viraj restaurant detail
3. Mark as approached for NCN drive
4. Should succeed (owns this restaurant)
5. Try to manually update another KAM's restaurant via SQL:

```sql
-- This should fail due to RLS
UPDATE drive_data 
SET approached = true 
WHERE res_id = 'R004'; -- Priya (owned by amdeep.singh)
```

Should return 0 rows updated (RLS blocked it).

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: 
- Check `.env.local` file exists in project root
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server after adding env variables

### Issue: "Only @zomato.com emails are allowed"

**Solution**:
- Set `VITE_RESTRICT_DOMAIN=false` in `.env.local`
- Add your email to `ALLOWED_TEST_EMAILS` in `src/contexts/AuthContext.tsx`
- Restart dev server

### Issue: "No restaurants showing in KAM Hub"

**Solution**:
- Verify you're logged in with correct email
- Check database has restaurants with matching `kam_email`:
  ```sql
  SELECT * FROM restaurants WHERE kam_email = 'your-email@zomato.com';
  ```
- Verify RLS policies are enabled:
  ```sql
  SELECT tablename, policyname FROM pg_policies WHERE tablename = 'restaurants';
  ```

### Issue: "Google OAuth not working"

**Solution**:
- Verify redirect URI in Google Cloud Console matches Supabase callback URL
- Check `VITE_GOOGLE_CLIENT_ID` is set in `.env.local`
- Ensure Google provider is enabled in Supabase dashboard
- Check browser console for errors

### Issue: "Mark as Approached not working"

**Solution**:
- Check browser console for errors
- Verify RLS policies allow updates:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'drive_data' AND cmd = 'UPDATE';
  ```
- Ensure you're logged in with correct email
- Check network tab for failed requests

---

## Development Workflow

### Running the App

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Previewing Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## Project Structure

```
zomato-loveable/
├── src/
│   ├── components/          # Custom + shadcn/ui components
│   │   ├── ui/             # shadcn/ui components (48)
│   │   ├── AppSidebar.tsx
│   │   ├── SearchBar.tsx
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication context
│   ├── hooks/
│   │   ├── useRestaurants.ts
│   │   ├── useDrives.ts
│   │   └── use-toast.ts
│   ├── pages/
│   │   ├── Auth.tsx
│   │   ├── MainDashboard.tsx
│   │   ├── KAMHub.tsx
│   │   ├── RestaurantDetail.tsx
│   │   ├── KAMAnalytics.tsx
│   │   ├── ZonalHeadView.tsx
│   │   └── LiveSprints.tsx
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client
│   │   └── utils.ts
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
├── supabase-setup.sql      # Database setup script
├── .env.local              # Environment variables (not in git)
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

---

## Next Steps After Setup

1. **Explore the App**
   - Test all 5 screens
   - Try different user accounts
   - Test search and filtering

2. **Customize Sample Data**
   - Add more restaurants
   - Add more drives
   - Assign restaurants to drives

3. **Set Up Google Sheets Integration** (Recommended)
   - See Sprint 2 documentation
   - Replace sample data with real data

4. **Deploy to Production**
   - See deployment guide
   - Set `VITE_RESTRICT_DOMAIN=true`
   - Configure custom domain

---

## Support

If you encounter issues:
1. Check troubleshooting section above
2. Check browser console for errors
3. Check Supabase logs in dashboard
4. Verify environment variables are set correctly
5. Ensure database setup script ran successfully

---

## Security Checklist

Before deploying to production:

- [ ] Set `VITE_RESTRICT_DOMAIN=true` in production environment
- [ ] Remove test emails from `ALLOWED_TEST_EMAILS` array
- [ ] Use strong passwords for all accounts
- [ ] Enable email confirmation in Supabase Auth settings
- [ ] Set up custom SMTP for email delivery
- [ ] Configure password strength requirements
- [ ] Review and test all RLS policies
- [ ] Enable MFA (Multi-Factor Authentication) if needed
- [ ] Set up monitoring and error tracking
- [ ] Configure session timeout settings
- [ ] Use HTTPS only (enforced by Supabase and Vercel/Netlify)
- [ ] Rotate Supabase anon key every 6 months
- [ ] Keep dependencies up to date

---

## Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Test production build with `npm run preview`
- [ ] Set up production Supabase project (or use same for dev/prod)
- [ ] Configure production environment variables
- [ ] Set up custom domain
- [ ] Configure SSL certificate (auto with Vercel/Netlify)
- [ ] Test all features in production environment
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Configure error tracking
- [ ] Set up analytics (Google Analytics, Mixpanel, etc.)
- [ ] Create backup strategy for database
- [ ] Document deployment process
- [ ] Train users on new system
- [ ] Plan rollout strategy

---

## Recommended Tools

### Development
- **VS Code** - Code editor
- **React Developer Tools** - Browser extension
- **Supabase CLI** - Local development (optional)

### Testing
- **Postman** - API testing
- **Chrome DevTools** - Debugging

### Deployment
- **Vercel** - Frontend hosting (recommended)
- **Netlify** - Alternative frontend hosting
- **Supabase** - Backend (already using)

### Monitoring
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - Usage analytics

---

## Conclusion

You should now have a fully functional local development environment!

**What you can do**:
- Log in with test accounts
- View restaurants in KAM Hub
- Track conversions (approached/converted)
- Search and filter restaurants
- View analytics (mock data)

**Next steps**:
1. Explore the codebase
2. Customize for your needs
3. Set up Google Sheets integration
4. Deploy to production

