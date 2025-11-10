# Component Structure - Complete Reference

## Overview

**Total Components**: 69
- **Custom Components**: 21 (in `src/components/`)
- **shadcn/ui Components**: 48 (in `src/components/ui/`)
- **Page Components**: 7 (in `src/pages/`)

---

## Page Components (7)

### 1. Auth.tsx
**Path**: `src/pages/Auth.tsx`
**Purpose**: Login/Signup page
**Route**: `/`

**Key Features**:
- Email/password login form
- Google OAuth button
- Email domain validation
- Error handling with toast notifications

**Code Structure**:
```typescript
export default function Auth() {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    // Email/password login logic
  };

  const handleGoogleLogin = async () => {
    // Google OAuth login logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <form onSubmit={handleEmailLogin}>
          <Input type="email" ... />
          <Input type="password" ... />
          <Button type="submit">Login</Button>
        </form>
        <Button onClick={handleGoogleLogin}>
          Sign in with Google
        </Button>
      </Card>
    </div>
  );
}
```

---

### 2. MainDashboard.tsx
**Path**: `src/pages/MainDashboard.tsx`
**Purpose**: BAU Dashboard with drive overview and metrics
**Route**: `/dashboard`

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  Header (Compact, no sidebar toggle)            │
├─────────────────────────────────────────────────┤
│  Top Grid (4 columns, equal width)              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │Current│ │City  │ │Zone  │ │KAM   │          │
│  │/Live │ │View  │ │View  │ │View  │          │
│  │Drives│ │      │ │      │ │      │          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
├─────────────────────────────────────────────────┤
│  Bottom Grid (12 columns)                       │
│  ┌────┐ ┌────┐ ┌──────────────────────┐       │
│  │Past│ │Upco│ │Performance Metrics   │       │
│  │Driv│ │ming│ │(Extended Section)    │       │
│  │es  │ │Driv│ │                      │       │
│  │(2) │ │es  │ │                      │       │
│  │    │ │(2) │ │        (8 cols)      │       │
│  └────┘ └────┘ └──────────────────────┘       │
└─────────────────────────────────────────────────┘
```

**Key Features**:
- Current/Live Drives with rankings
- City View, Zone View, KAM View cards
- Past Drives, Upcoming Drives
- Performance Metrics (extended section)
- Quick navigation to Live Sprints and Analytics

**Code Structure**:
```typescript
export default function MainDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <header className="bg-white border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <h1>Zomato Drive Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/live-sprints")}>
              Live Sprints
            </Button>
            <Button onClick={() => navigate("/kam-analytics")}>
              Analytics
            </Button>
          </div>
        </div>
      </header>

      {/* Top Grid - 4 equal columns */}
      <div className="grid grid-cols-4 gap-4 p-6">
        <Card>Current/Live Drives</Card>
        <Card>City View</Card>
        <Card>Zone View</Card>
        <Card>KAM View</Card>
      </div>

      {/* Bottom Grid - 12 columns */}
      <div className="grid grid-cols-12 gap-4 px-6 pb-6">
        <Card className="col-span-2">Past Drives</Card>
        <Card className="col-span-2">Upcoming Drives</Card>
        <Card className="col-span-8">Performance Metrics</Card>
      </div>
    </div>
  );
}
```

---

### 3. KAMHub.tsx
**Path**: `src/pages/KAMHub.tsx`
**Purpose**: Restaurant portfolio view for KAMs
**Route**: `/kam-hub`

**Key Features**:
- AppSidebar with navigation
- SearchBar for real-time filtering
- Restaurant cards with status pills
- Multi-drive badges
- Click to view restaurant details

**Code Structure**:
```typescript
export default function KAMHub() {
  const { data: restaurants, isLoading } = useRestaurants();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter restaurants based on search
  const filteredRestaurants = restaurants?.filter((r) =>
    r.res_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </header>
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants?.map((restaurant) => (
              <Card key={restaurant.res_id}>
                <CardHeader>
                  <CardTitle>{restaurant.res_name}</CardTitle>
                  <StatusPill restaurant={restaurant} />
                </CardHeader>
                <CardContent>
                  <p>{restaurant.locality}</p>
                  <p>{restaurant.cuisine}</p>
                  <Badge>{restaurant.drive_data?.length || 0} drives</Badge>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => navigate(`/restaurant/${restaurant.res_id}`)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

---

### 4. RestaurantDetail.tsx
**Path**: `src/pages/RestaurantDetail.tsx`
**Purpose**: Individual restaurant details with conversion tracking
**Route**: `/restaurant/:id`

**Key Features**:
- Restaurant header with key metrics
- Active drives tracking card
- "Mark as Approached" button for each drive
- "Mark as Converted" button for each drive
- Visual status badges (Pending → Approached → Converted)
- Promos card, Tasks card, Notes card

**Code Structure**:
```typescript
export default function RestaurantDetail() {
  const { id } = useParams();
  const { data: restaurant, isLoading } = useRestaurant(id!);
  const markApproached = useMarkApproached();
  const markConverted = useMarkConverted();
  const { user } = useAuth();

  const handleMarkApproached = async (driveId: number) => {
    await markApproached.mutateAsync({
      resId: id!,
      driveId,
      kamEmail: user?.email!,
    });
  };

  const handleMarkConverted = async (driveId: number) => {
    await markConverted.mutateAsync({
      resId: id!,
      driveId,
      kamEmail: user?.email!,
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="p-6">
          {/* Restaurant Header */}
          <RestaurantHeader restaurant={restaurant} />

          {/* Active Drives & Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Active Drives & Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              {restaurant?.drive_data?.map((dd) => (
                <div key={dd.id} className="border rounded-lg p-4 mb-4">
                  <h3>{dd.drives?.drive_name}</h3>
                  <div className="flex gap-2 mt-2">
                    {!dd.approached && (
                      <Button onClick={() => handleMarkApproached(dd.drive_id)}>
                        Mark as Approached
                      </Button>
                    )}
                    {dd.approached && !dd.converted_stepper && (
                      <Button onClick={() => handleMarkConverted(dd.drive_id)}>
                        Mark as Converted
                      </Button>
                    )}
                    {dd.converted_stepper && (
                      <Badge variant="success">Converted</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Promos, Tasks, Notes */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <PromosCard restaurant={restaurant} />
            <TasksCard restaurant={restaurant} />
            <NotesCard restaurant={restaurant} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

---

### 5. KAMAnalytics.tsx
**Path**: `src/pages/KAMAnalytics.tsx`
**Purpose**: Personal performance analytics for KAMs
**Route**: `/kam-analytics`

**Key Features**:
- KPI cards (Total Restaurants, Approached, Converted, Conversion Rate)
- Performance charts (Recharts)
- Currently uses mock data (real analytics pending)

**Code Structure**:
```typescript
export default function KAMAnalytics() {
  // TODO: Replace with real data from useRestaurants hook
  const mockData = {
    totalRestaurants: 200,
    approached: 150,
    converted: 75,
    conversionRate: 50,
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader>Total Restaurants</CardHeader>
              <CardContent>{mockData.totalRestaurants}</CardContent>
            </Card>
            <Card>
              <CardHeader>Approached</CardHeader>
              <CardContent>{mockData.approached}</CardContent>
            </Card>
            <Card>
              <CardHeader>Converted</CardHeader>
              <CardContent>{mockData.converted}</CardContent>
            </Card>
            <Card>
              <CardHeader>Conversion Rate</CardHeader>
              <CardContent>{mockData.conversionRate}%</CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Card>
            <CardHeader>Performance Trends</CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockChartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversions" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

---

### 6. ZonalHeadView.tsx
**Path**: `src/pages/ZonalHeadView.tsx`
**Purpose**: Team performance overview for Zonal Heads
**Route**: `/zonal-head-view`

**Key Features**:
- KPI cards (Total KAMs, Total Restaurants, Team Conversion Rate)
- KAM performance table with rankings
- Currently uses mock data (real analytics pending)

**Code Structure**:
```typescript
export default function ZonalHeadView() {
  // TODO: Replace with real data aggregated from all KAMs
  const mockKAMs = [
    { name: "Shiv Kumar", restaurants: 200, approached: 150, converted: 75, rate: 50 },
    { name: "Amdeep Singh", restaurants: 180, approached: 140, converted: 70, rate: 50 },
    // ...
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>Total KAMs: 5</Card>
            <Card>Total Restaurants: 900</Card>
            <Card>Team Conversion Rate: 48%</Card>
          </div>

          {/* KAM Performance Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>KAM Name</TableHead>
                  <TableHead>Restaurants</TableHead>
                  <TableHead>Approached</TableHead>
                  <TableHead>Converted</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockKAMs.map((kam, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{kam.name}</TableCell>
                    <TableCell>{kam.restaurants}</TableCell>
                    <TableCell>{kam.approached}</TableCell>
                    <TableCell>{kam.converted}</TableCell>
                    <TableCell>{kam.rate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

---

### 7. LiveSprints.tsx
**Path**: `src/pages/LiveSprints.tsx`
**Purpose**: Leaderboard with podium display
**Route**: `/live-sprints`

**Key Features**:
- Podium display for top 3 KAMs
- Leaderboard bars with rankings
- Achievement tracking visualization
- Currently uses mock data

**Code Structure**:
```typescript
export default function LiveSprints() {
  const mockLeaderboard = [
    { name: "Shiv Kumar", score: 95, rank: 1 },
    { name: "Amdeep Singh", score: 92, rank: 2 },
    { name: "Shrawani Patil", score: 88, rank: 3 },
    // ...
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1>Live Sprints Leaderboard</h1>

      {/* Podium Display */}
      <div className="flex justify-center items-end gap-4 mb-8">
        <div className="bg-gray-300 w-32 h-40 flex items-center justify-center">
          <div>
            <div className="text-4xl">🥈</div>
            <div>{mockLeaderboard[1].name}</div>
            <div>{mockLeaderboard[1].score}</div>
          </div>
        </div>
        <div className="bg-yellow-300 w-32 h-56 flex items-center justify-center">
          <div>
            <div className="text-4xl">🥇</div>
            <div>{mockLeaderboard[0].name}</div>
            <div>{mockLeaderboard[0].score}</div>
          </div>
        </div>
        <div className="bg-orange-300 w-32 h-32 flex items-center justify-center">
          <div>
            <div className="text-4xl">🥉</div>
            <div>{mockLeaderboard[2].name}</div>
            <div>{mockLeaderboard[2].score}</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Bars */}
      <Card>
        {mockLeaderboard.map((entry) => (
          <div key={entry.rank} className="flex items-center gap-4 p-4">
            <div className="text-2xl font-bold">{entry.rank}</div>
            <div className="flex-1">
              <div>{entry.name}</div>
              <div className="bg-gray-200 h-8 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full"
                  style={{ width: `${entry.score}%` }}
                />
              </div>
            </div>
            <div className="text-xl font-bold">{entry.score}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
```

---

## Custom Components (21)

### Navigation Components

#### AppSidebar.tsx
**Path**: `src/components/AppSidebar.tsx`
**Purpose**: Main navigation sidebar with logout

**Features**:
- Navigation links (KAM Hub, Analytics, Zonal Head View, Live Sprints)
- Logout button
- User email display

```typescript
export function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-sm text-gray-500">{user?.email}</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/kam-hub")}>
              <Home className="mr-2 h-4 w-4" />
              KAM Hub
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/kam-analytics")}>
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/zonal-head-view")}>
              <Users className="mr-2 h-4 w-4" />
              Zonal Head View
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/live-sprints")}>
              <Trophy className="mr-2 h-4 w-4" />
              Live Sprints
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
```

---

### Utility Components

#### SearchBar.tsx
**Path**: `src/components/SearchBar.tsx`
**Purpose**: Real-time search input

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
}
```

#### StatusPill.tsx
**Path**: `src/components/StatusPill.tsx`
**Purpose**: Visual status indicator for restaurants

**Status Logic**:
- **Best**: Converted in at least one drive (green)
- **Approached**: Approached but not converted (yellow)
- **Good**: High revenue (Sept OV > 60K) (blue)
- **Pending**: Not yet approached (gray)

```typescript
interface StatusPillProps {
  restaurant: Restaurant;
}

export function StatusPill({ restaurant }: StatusPillProps) {
  const hasConverted = restaurant.drive_data?.some((dd) => dd.converted_stepper);
  const hasApproached = restaurant.drive_data?.some((dd) => dd.approached);
  const isHighRevenue = (restaurant.sept_ov || 0) > 60000;

  let status = "Pending";
  let variant: "default" | "success" | "warning" | "secondary" = "default";

  if (hasConverted) {
    status = "Best";
    variant = "success";
  } else if (hasApproached) {
    status = "Approached";
    variant = "warning";
  } else if (isHighRevenue) {
    status = "Good";
    variant = "secondary";
  }

  return <Badge variant={variant}>{status}</Badge>;
}
```

---

## shadcn/ui Components (48)

All located in `src/components/ui/`. These are pre-built, accessible components from shadcn/ui library.

**Key Components Used**:
- `Button.tsx` - Buttons with variants
- `Card.tsx`, `CardHeader.tsx`, `CardContent.tsx`, `CardFooter.tsx` - Card layouts
- `Input.tsx` - Form inputs
- `Badge.tsx` - Status badges
- `Table.tsx`, `TableHeader.tsx`, `TableBody.tsx`, `TableRow.tsx`, `TableCell.tsx` - Tables
- `Sidebar.tsx`, `SidebarProvider.tsx`, `SidebarInset.tsx` - Sidebar navigation
- `Toast.tsx`, `Toaster.tsx` - Toast notifications
- `Dialog.tsx` - Modal dialogs
- `Select.tsx` - Dropdown selects
- `Tabs.tsx` - Tab navigation

Full list available in `src/components/ui/` directory.

---

## Component Dependencies

```
App.tsx
├── AuthProvider (Context)
├── QueryClientProvider (React Query)
└── TooltipProvider (shadcn/ui)
    ├── Auth Page
    └── Protected Routes
        ├── MainDashboard
        ├── KAMHub
        │   ├── AppSidebar
        │   ├── SearchBar
        │   └── StatusPill
        ├── RestaurantDetail
        │   ├── AppSidebar
        │   ├── RestaurantHeader
        │   ├── PromosCard
        │   ├── TasksCard
        │   └── NotesCard
        ├── KAMAnalytics
        │   └── AppSidebar
        ├── ZonalHeadView
        │   └── AppSidebar
        └── LiveSprints
```

