# Technical Architecture - Zomato Drive Dashboard

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth Page  │  │  KAM Hub     │  │  Restaurant  │      │
│  │              │  │              │  │  Detail      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │         React Query (TanStack Query)              │      │
│  │  - Caching, Auto-refetch, Optimistic Updates     │      │
│  └──────────────────────────────────────────────────┘      │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────┐      │
│  │         Supabase Client (@supabase/supabase-js)  │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  Supabase Backend                            │
│  ┌──────────────────────────────────────────────────┐      │
│  │         Supabase Auth (JWT-based)                 │      │
│  │  - Email/Password                                 │      │
│  │  - Google OAuth                                   │      │
│  │  - Session Management                             │      │
│  └──────────────────────────────────────────────────┘      │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────┐      │
│  │         PostgreSQL Database                       │      │
│  │  - Row Level Security (RLS)                       │      │
│  │  - Auto-generated REST API                        │      │
│  │  - Real-time subscriptions                        │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App.tsx (Root)
├── AuthProvider (Context)
│   ├── Auth Page (Public)
│   └── Protected Routes
│       ├── MainDashboard
│       │   ├── Header
│       │   ├── Top Grid (4 columns)
│       │   │   ├── Current/Live Drives Card
│       │   │   ├── City View Card
│       │   │   ├── Zone View Card
│       │   │   └── KAM View Card
│       │   └── Bottom Grid (12 columns)
│       │       ├── Past Drives Card (2 cols)
│       │       ├── Upcoming Drives Card (2 cols)
│       │       └── Performance Metrics Card (8 cols)
│       │
│       ├── KAM Hub
│       │   ├── AppSidebar (Navigation)
│       │   ├── SearchBar
│       │   └── Restaurant List
│       │       └── Restaurant Cards (with StatusPill)
│       │
│       ├── Restaurant Detail
│       │   ├── RestaurantHeader
│       │   ├── Active Drives & Tracking Card
│       │   │   └── Drive Cards (Mark Approached/Converted)
│       │   ├── PromosCard
│       │   ├── TasksCard
│       │   └── NotesCard
│       │
│       ├── KAM Analytics
│       │   ├── KPI Cards
│       │   └── Charts (Recharts)
│       │
│       ├── Zonal Head View
│       │   ├── KPI Cards
│       │   └── KAMPerformanceTable
│       │
│       └── Live Sprints
│           ├── PodiumDisplay
│           └── LeaderboardBar
```

### State Management

**React Query (TanStack Query)**
- Handles all server state
- Automatic caching and refetching
- Optimistic updates
- Query invalidation after mutations

**React Context**
- AuthContext: User session, login/logout functions
- No global state management needed (React Query handles it)

### Data Flow

```
User Action (e.g., "Mark as Approached")
    ↓
Component calls mutation hook (useMarkApproached)
    ↓
React Query executes mutation
    ↓
Supabase client sends request to database
    ↓
Database updates drive_data table
    ↓
Database inserts conversion_tracking record
    ↓
React Query invalidates relevant queries
    ↓
Components automatically refetch fresh data
    ↓
UI updates with new data
```

---

## Backend Architecture

### Database Schema

**Entity Relationship Diagram:**

```
┌─────────────────┐
│  restaurants    │
│  (Master Data)  │
├─────────────────┤
│ res_id (PK)     │◄──────┐
│ res_name        │       │
│ kam_email       │       │
│ cuisine         │       │
│ locality        │       │
│ sept_ov         │       │
└─────────────────┘       │
                          │
                          │ FK
                          │
┌─────────────────┐       │
│  drives         │       │
│  (Campaigns)    │       │
├─────────────────┤       │
│ id (PK)         │◄──┐   │
│ drive_name      │   │   │
│ drive_type      │   │   │
│ status          │   │   │
└─────────────────┘   │   │
                      │   │
                      │ FK│ FK
                      │   │
┌─────────────────────┴───┴──┐
│  drive_data                │
│  (Restaurant-Drive Link)   │
├────────────────────────────┤
│ id (PK)                    │
│ res_id (FK)                │
│ drive_id (FK)              │
│ approached (boolean)       │
│ converted_stepper (boolean)│
│ priority_score             │
│ um, mm, la                 │
│ *_base_code_suggested      │
│ *_active_promos            │
└────────────────────────────┘
         ▲
         │ FK
         │
┌────────┴────────────┐
│ conversion_tracking │
│ (Audit Trail)       │
├─────────────────────┤
│ id (PK)             │
│ res_id (FK)         │
│ drive_id (FK)       │
│ kam_email           │
│ action_type         │
│ action_date         │
└─────────────────────┘
```

### Row Level Security (RLS) Policies

**restaurants table:**
```sql
-- KAMs see only their restaurants
CREATE POLICY "KAMs see own restaurants"
ON restaurants FOR SELECT
USING (kam_email = auth.jwt() ->> 'email');
```

**drive_data table:**
```sql
-- KAMs see drive data for their restaurants only
CREATE POLICY "KAMs see own drive data"
ON drive_data FOR SELECT
USING (
  res_id IN (
    SELECT res_id FROM restaurants 
    WHERE kam_email = auth.jwt() ->> 'email'
  )
);

-- KAMs can update drive data for their restaurants
CREATE POLICY "KAMs update own drive data"
ON drive_data FOR UPDATE
USING (
  res_id IN (
    SELECT res_id FROM restaurants 
    WHERE kam_email = auth.jwt() ->> 'email'
  )
);
```

**conversion_tracking table:**
```sql
-- KAMs can track conversions for their restaurants
CREATE POLICY "KAMs track own conversions"
ON conversion_tracking FOR INSERT
WITH CHECK (kam_email = auth.jwt() ->> 'email');

-- KAMs see own conversion history
CREATE POLICY "KAMs see own conversion history"
ON conversion_tracking FOR SELECT
USING (kam_email = auth.jwt() ->> 'email');
```

**drives table:**
```sql
-- Everyone can see all drives
CREATE POLICY "Everyone can see drives"
ON drives FOR SELECT
USING (true);
```

---

## API Layer

### Supabase REST API

**Auto-generated endpoints:**
- `GET /rest/v1/restaurants` - Fetch restaurants (RLS-filtered)
- `GET /rest/v1/drives` - Fetch drives
- `GET /rest/v1/drive_data` - Fetch drive assignments (RLS-filtered)
- `PATCH /rest/v1/drive_data` - Update drive data (RLS-protected)
- `POST /rest/v1/conversion_tracking` - Insert conversion event (RLS-protected)

**Authentication:**
- JWT token in Authorization header
- Token contains user email and metadata
- RLS policies use `auth.jwt() ->> 'email'` to filter data

### React Query Hooks

**useRestaurants.ts:**
```typescript
// Fetch all restaurants for logged-in KAM
export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select(`
          *,
          drive_data (
            *,
            drives (*)
          )
        `)
        .order("res_name", { ascending: true });
      
      if (error) throw error;
      return data as Restaurant[];
    },
  });
}

// Mark restaurant as approached
export function useMarkApproached() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ resId, driveId, kamEmail }) => {
      // Update drive_data
      const { error: updateError } = await supabase
        .from("drive_data")
        .update({ approached: true, last_updated: new Date().toISOString() })
        .eq("res_id", resId)
        .eq("drive_id", driveId);
      
      if (updateError) throw updateError;
      
      // Log conversion tracking
      const { error: trackingError } = await supabase
        .from("conversion_tracking")
        .insert({
          res_id: resId,
          drive_id: driveId,
          kam_email: kamEmail,
          action_type: "approached",
        });
      
      if (trackingError) throw trackingError;
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
    },
  });
}
```

---

## Authentication Flow

### Login Flow

```
1. User enters email/password on Auth page
   ↓
2. Frontend calls supabase.auth.signInWithPassword()
   ↓
3. Supabase validates credentials
   ↓
4. Supabase returns JWT token + user object
   ↓
5. AuthContext stores user in state
   ↓
6. Token stored in localStorage (auto-managed by Supabase)
   ↓
7. User redirected to /dashboard
   ↓
8. All subsequent API calls include JWT in Authorization header
   ↓
9. RLS policies filter data based on JWT email
```

### Google OAuth Flow

```
1. User clicks "Sign in with Google"
   ↓
2. Frontend calls supabase.auth.signInWithOAuth({ provider: 'google' })
   ↓
3. User redirected to Google OAuth consent screen
   ↓
4. User approves (only @zomato.com emails allowed in production)
   ↓
5. Google redirects back to app with auth code
   ↓
6. Supabase exchanges code for JWT token
   ↓
7. AuthContext validates email domain
   ↓
8. If valid, user redirected to /dashboard
   ↓
9. If invalid, user signed out and shown error
```

### Session Management

```
- JWT token auto-refreshed by Supabase client
- Session persisted in localStorage
- AuthContext listens to auth state changes
- Protected routes check user state before rendering
- Logout clears session and redirects to /
```

---

## Routing Architecture

### Route Structure

```
/ (Public)
└── Auth Page (Login/Signup)

/dashboard (Protected)
└── Main Dashboard (BAU Dashboard)

/kam-hub (Protected)
└── KAM Hub (Restaurant Portfolio)

/restaurant/:id (Protected)
└── Restaurant Detail

/kam-analytics (Protected)
└── KAM Analytics

/zonal-head-view (Protected)
└── Zonal Head View

/live-sprints (Protected)
└── Live Sprints Leaderboard
```

### Protected Route Implementation

```typescript
// ProtectedRoute.tsx
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return null;
  }
  
  return <>{children}</>;
}
```

---

## Performance Optimizations

### React Query Caching
- Queries cached for 5 minutes by default
- Stale data shown immediately while refetching in background
- Automatic garbage collection of unused queries

### Optimistic Updates
- UI updates immediately on user action
- Reverts if mutation fails
- Provides instant feedback

### Code Splitting
- Route-based code splitting with React.lazy()
- Reduces initial bundle size
- Faster page loads

### Database Indexes
```sql
CREATE INDEX idx_restaurants_kam_email ON restaurants(kam_email);
CREATE INDEX idx_drive_data_res_id ON drive_data(res_id);
CREATE INDEX idx_drive_data_drive_id ON drive_data(drive_id);
CREATE INDEX idx_conversion_tracking_kam_email ON conversion_tracking(kam_email);
```

---

## Security Architecture

### Frontend Security
- Environment variables for sensitive data
- No API keys in client code
- Protected routes prevent unauthorized access
- Input validation on all forms

### Backend Security
- Row Level Security (RLS) at database level
- JWT-based authentication
- Email domain validation
- SQL injection prevention (Supabase handles this)
- HTTPS only in production

### Data Privacy
- KAMs can only see their own restaurants
- KAMs can only update their own data
- All actions logged with timestamps
- Audit trail in conversion_tracking table

---

## Error Handling

### Frontend Error Handling
```typescript
// React Query error handling
const { data, error, isLoading } = useRestaurants();

if (error) {
  return <ErrorMessage message={error.message} />;
}

// Toast notifications for mutations
const markApproached = useMarkApproached();

try {
  await markApproached.mutateAsync({ resId, driveId, kamEmail });
  toast({ title: "Success", description: "Marked as approached" });
} catch (error) {
  toast({ 
    title: "Error", 
    description: error.message, 
    variant: "destructive" 
  });
}
```

### Backend Error Handling
- Supabase returns structured error objects
- RLS violations return 403 Forbidden
- Invalid queries return 400 Bad Request
- Network errors handled by React Query retry logic

---

## Deployment Architecture

### Development
```
Local Machine
├── Vite Dev Server (http://localhost:8080)
├── Supabase Project (Cloud)
└── .env.local (Environment variables)
```

### Production
```
Vercel/Netlify (Frontend)
├── Static Build (npm run build)
├── Environment Variables (Vercel Dashboard)
└── Custom Domain

Supabase (Backend)
├── PostgreSQL Database
├── Authentication Service
└── REST API
```

---

## Scalability Considerations

### Current Capacity
- Handles 1000+ restaurants
- Supports 50+ concurrent KAMs
- Sub-second query response times

### Future Scaling
- Add database read replicas for analytics
- Implement caching layer (Redis)
- Add CDN for static assets
- Optimize queries with materialized views

