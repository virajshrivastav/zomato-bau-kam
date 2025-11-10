# START HERE - Zomato Drive Dashboard Context

## Purpose of This Folder

This folder contains **comprehensive technical context** for the Zomato Drive Dashboard MVP. Use these files to:
1. Understand what has been built
2. Understand how it works technically
3. Set up the project from scratch
4. Continue building new features

---

## How to Use These Files

### If You're New to This Project

**Read in this order**:
1. **00-START-HERE.md** (this file) - Overview
2. **01-PROJECT-OVERVIEW.md** - What the system is and why it exists
3. **08-SETUP-GUIDE.md** - Get the project running locally
4. **07-CURRENT-STATUS.md** - What has been built

### If You're Understanding the System

**Read in this order**:
1. **07-CURRENT-STATUS.md** - What's been implemented
2. **02-TECHNICAL-ARCHITECTURE.md** - How the system works
3. **06-DATA-HOOKS-API.md** - How to fetch and mutate data
4. **05-COMPONENT-STRUCTURE.md** - Existing components

### If You're Setting Up Authentication

**Read**:
- **04-AUTHENTICATION-SETUP.md** - Complete auth guide

### If You're Working with Database

**Read**:
- **03-DATABASE-SCHEMA.md** - Complete schema reference

---

## File Descriptions

### 00-START-HERE.md (This File)
- Overview of all context files
- How to use this documentation
- Quick reference guide

### 01-PROJECT-OVERVIEW.md
- **What**: Business context and project goals
- **Why**: Problem being solved
- **Who**: User roles and needs
- **What's Built**: Current implementation
- **Final Goal**: Target system state
- **Tech Stack**: High-level overview

### 02-TECHNICAL-ARCHITECTURE.md
- **System Architecture**: Frontend + Backend diagram
- **Component Hierarchy**: How components are organized
- **Data Flow**: How data moves through the system
- **Database Schema**: Entity relationships
- **RLS Policies**: Row Level Security implementation
- **API Layer**: Supabase REST API
- **Authentication Flow**: Login/logout process
- **Routing**: Protected routes implementation
- **Performance**: Optimizations and caching
- **Security**: Best practices

### 03-DATABASE-SCHEMA.md
- **4 Tables**: Complete schema for each
- **Column Descriptions**: What each field means
- **Sample Data**: 10 restaurants, 3 drives, 13 assignments
- **RLS Policies**: Security rules for each table
- **Indexes**: Performance optimization
- **Relationships**: Foreign keys and constraints
- **Query Examples**: Common SQL queries

### 04-AUTHENTICATION-SETUP.md
- **Authentication Flow**: Step-by-step login process
- **Supabase Configuration**: Environment variables
- **AuthContext Implementation**: Code walkthrough
- **Protected Routes**: How to protect pages
- **Google OAuth Setup**: Complete guide
- **JWT Token Structure**: What's in the token
- **Session Management**: Auto-refresh and persistence
- **Logout Implementation**: How to sign out
- **Security Best Practices**: Production checklist
- **Troubleshooting**: Common issues and fixes

### 05-COMPONENT-STRUCTURE.md
- **7 Page Components**: Auth, MainDashboard, KAMHub, RestaurantDetail, KAMAnalytics, ZonalHeadView, LiveSprints
- **21 Custom Components**: AppSidebar, SearchBar, StatusPill, etc.
- **48 shadcn/ui Components**: Button, Card, Input, Table, etc.
- **Code Examples**: How each component works
- **Component Dependencies**: What uses what

### 06-DATA-HOOKS-API.md
- **TypeScript Interfaces**: Restaurant, DriveData, Drive
- **Query Hooks**: useRestaurants, useRestaurant, useDrives
- **Mutation Hooks**: useMarkApproached, useMarkConverted
- **Toast Notifications**: useToast
- **React Query Configuration**: Caching and refetching
- **Query Invalidation**: When to refetch data
- **Error Handling**: How to handle errors
- **Loading States**: How to show loading
- **Best Practices**: Code patterns to follow

### 07-CURRENT-STATUS.md
- **What's Complete**: Features fully functional
- **What's Using Mock Data**: Features with UI but sample data
- **Current Limitations**: System limitations
- **Testing Status**: What has been tested
- **Deployment Status**: Current deployment state
- **Final Goal**: Target system state

### 08-SETUP-GUIDE.md
- **Prerequisites**: What you need installed
- **Step-by-Step Setup**: 10 steps to get running
- **Create Supabase Project**: Complete guide
- **Set Up Database**: Run SQL script
- **Configure Environment**: .env.local setup
- **Create Test Accounts**: 4 pre-configured KAMs
- **Run Development Server**: npm run dev
- **Test Core Features**: Verify everything works
- **Google OAuth Setup**: Optional but recommended
- **Troubleshooting**: Common issues and fixes
- **Deployment Checklist**: Production readiness

---

## Quick Reference

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: TanStack Query (React Query)
- **UI Components**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router v6

### Project Status
- **Completion**: ~70%
- **Production Ready**: Yes (for core workflows)
- **Recommended Next Step**: Google Sheets integration (2-3 days)

### Key Features
- ✅ Authentication (Email/Password + Google OAuth)
- ✅ Row Level Security (RLS)
- ✅ KAM Hub (Restaurant portfolio)
- ✅ Restaurant Detail (Conversion tracking)
- ✅ Main Dashboard (BAU Dashboard)
- ✅ Real-time search
- ✅ Status indicators
- 📊 Analytics (UI complete, using mock data)

### Test Accounts
```
shiv.kumar@zomato.com / zomato123 (3 restaurants)
amdeep.singh@zomato.com / zomato123 (3 restaurants)
shrawani.patil@zomato.com / zomato123 (2 restaurants)
rutuja.deshmukh@zomato.com / zomato123 (2 restaurants)
```

### Database Tables
1. **restaurants** - Master restaurant data (10 rows)
2. **drives** - Marketing campaigns (3 rows)
3. **drive_data** - Restaurant-drive assignments (13 rows)
4. **conversion_tracking** - Audit trail (empty initially)

### Key Files
- `src/App.tsx` - Main app with routing
- `src/contexts/AuthContext.tsx` - Authentication
- `src/hooks/useRestaurants.ts` - Restaurant data
- `src/pages/KAMHub.tsx` - Main KAM interface
- `src/pages/RestaurantDetail.tsx` - Conversion tracking
- `supabase-setup.sql` - Database setup script

---

## Common Tasks

### How to Add a New Page

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Wrap with `<ProtectedRoute>` if auth required
4. Add navigation link in `src/components/AppSidebar.tsx`

### How to Fetch Data

1. Create custom hook in `src/hooks/`
2. Use `useQuery` from React Query
3. Call Supabase client to fetch data
4. Return typed data with loading/error states

### How to Mutate Data

1. Create mutation hook in `src/hooks/`
2. Use `useMutation` from React Query
3. Call Supabase client to update data
4. Invalidate related queries on success

### How to Add a New Component

1. Create component in `src/components/`
2. Use TypeScript for props interface
3. Use shadcn/ui components for UI
4. Import and use in page components

### How to Add RLS Policy

1. Write SQL policy in Supabase SQL Editor
2. Test with different user accounts
3. Verify data isolation works correctly

---

## Development Workflow

### Initial Setup (One-time)
```bash
# Clone repo
git clone <repo-url>
cd zomato-loveable

# Install dependencies
npm install

# Create .env.local with Supabase credentials
# Run supabase-setup.sql in Supabase SQL Editor

# Start dev server
npm run dev
```

### Daily Development
```bash
# Start dev server
npm run dev

# Make changes to code
# Browser auto-refreshes

# Test changes
# Commit when ready
```

### Before Deploying
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Test thoroughly
# Deploy to Vercel/Netlify
```

---

## Architecture Patterns

### Data Fetching Pattern
```typescript
// 1. Define interface
interface Restaurant { ... }

// 2. Create query hook
export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*");
      if (error) throw error;
      return data as Restaurant[];
    },
  });
}

// 3. Use in component
const { data, isLoading, error } = useRestaurants();
```

### Mutation Pattern
```typescript
// 1. Create mutation hook
export function useMarkApproached() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ resId, driveId }) => {
      const { error } = await supabase
        .from("drive_data")
        .update({ approached: true })
        .eq("res_id", resId)
        .eq("drive_id", driveId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
}

// 2. Use in component
const mutation = useMarkApproached();
await mutation.mutateAsync({ resId, driveId });
```

### Protected Route Pattern
```typescript
// Wrap route with ProtectedRoute
<Route 
  path="/kam-hub" 
  element={
    <ProtectedRoute>
      <KAMHub />
    </ProtectedRoute>
  } 
/>
```

### RLS Policy Pattern
```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "policy_name"
ON table_name FOR SELECT
USING (kam_email = auth.jwt() ->> 'email');
```

---

## Important Concepts

### Row Level Security (RLS)
- **What**: Database-level security filtering
- **Why**: KAMs see only their data
- **How**: Policies use JWT email claim to filter rows
- **Where**: All 4 tables have RLS enabled

### React Query Caching
- **What**: Automatic data caching
- **Why**: Faster UI, less API calls
- **How**: Queries cached for 5 minutes
- **Where**: All data fetching uses React Query

### Optimistic Updates
- **What**: UI updates before server confirms
- **Why**: Instant feedback to user
- **How**: React Query invalidation
- **Where**: Mark approached/converted actions

### Protected Routes
- **What**: Pages requiring authentication
- **Why**: Prevent unauthorized access
- **How**: ProtectedRoute wrapper checks user state
- **Where**: All pages except Auth page

---

## Next Steps

### For New Developers
1. Read 01-PROJECT-OVERVIEW.md
2. Follow 08-SETUP-GUIDE.md to get running
3. Test all features with test accounts
4. Read 02-TECHNICAL-ARCHITECTURE.md to understand how it works
5. Start building new features

### For Continuing Development
1. Read 07-CURRENT-STATUS.md to see what's done
2. Choose next feature to build (Google Sheets integration recommended)
3. Read relevant context files (02, 03, 06)
4. Write code following existing patterns
5. Test thoroughly
6. Deploy

### For Production Deployment
1. Complete Google Sheets integration (recommended)
2. Follow deployment checklist in 08-SETUP-GUIDE.md
3. Set `VITE_RESTRICT_DOMAIN=true`
4. Test with real users
5. Monitor and iterate

---

## Support

If you need help:
1. Check relevant context file above
2. Check troubleshooting sections
3. Check browser console for errors
4. Check Supabase logs
5. Verify environment variables

---

## Conclusion

**This context folder contains everything you need to understand, set up, and continue building the Zomato Drive Dashboard.**

**The system is ~70% complete and production-ready for core workflows.**

**Recommended next step: Google Sheets integration (2-3 days)**

Start with **01-PROJECT-OVERVIEW.md** to understand the business context, then follow **08-SETUP-GUIDE.md** to get the project running locally.

Good luck! 🚀

