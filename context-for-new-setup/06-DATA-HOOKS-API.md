# Data Hooks & API Reference

## Overview

All data fetching and mutations are handled by custom React Query hooks. These hooks provide:
- Automatic caching and refetching
- Loading and error states
- Optimistic UI updates
- Type safety with TypeScript

---

## Hook Files

### 1. useRestaurants.ts
**Path**: `src/hooks/useRestaurants.ts`
**Purpose**: Restaurant data operations

### 2. useDrives.ts
**Path**: `src/hooks/useDrives.ts`
**Purpose**: Drive data operations

### 3. use-toast.ts
**Path**: `src/hooks/use-toast.ts`
**Purpose**: Toast notification system

---

## TypeScript Interfaces

### Restaurant Interface

```typescript
export interface Restaurant {
  res_id: string;
  res_name: string;
  kam_name: string | null;
  kam_email: string | null;
  tl_email: string | null;
  cuisine: string | null;
  locality: string | null;
  concat_field: string | null;
  account_type: string | null;
  sept_ov: number | null;
  created_at: string;
  updated_at: string;
  drive_data?: DriveData[];
}
```

### DriveData Interface

```typescript
export interface DriveData {
  id: number;
  res_id: string;
  drive_id: number;
  um: number | null;
  mm: number | null;
  la: number | null;
  la_base_code_suggested: string | null;
  mm_base_code_suggested: string | null;
  um_base_code_suggested: string | null;
  la_active_promos: string | null;
  mm_active_promos: string | null;
  um_active_promos: string | null;
  approached: boolean;
  converted_stepper: boolean;
  priority_score: number | null;
  last_updated: string;
  created_at: string;
  drives?: Drive;
}
```

### Drive Interface

```typescript
export interface Drive {
  id: number;
  drive_name: string;
  drive_type: string | null;
  city: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
}
```

---

## Query Hooks (Read Operations)

### useRestaurants()

**Purpose**: Fetch all restaurants for logged-in KAM (RLS-filtered)

**Returns**: `UseQueryResult<Restaurant[], Error>`

**Usage**:
```typescript
import { useRestaurants } from "@/hooks/useRestaurants";

function KAMHub() {
  const { data: restaurants, isLoading, error } = useRestaurants();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {restaurants?.map((r) => (
        <div key={r.res_id}>{r.res_name}</div>
      ))}
    </div>
  );
}
```

**Implementation**:
```typescript
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
```

**Query Details**:
- **Query Key**: `["restaurants"]`
- **Supabase Query**: Fetches restaurants with nested drive_data and drives
- **RLS**: Automatically filters by `kam_email = auth.jwt() ->> 'email'`
- **Ordering**: Alphabetical by restaurant name
- **Caching**: 5 minutes (React Query default)

---

### useRestaurant(resId: string)

**Purpose**: Fetch single restaurant by ID

**Parameters**:
- `resId` (string): Restaurant ID

**Returns**: `UseQueryResult<Restaurant, Error>`

**Usage**:
```typescript
import { useRestaurant } from "@/hooks/useRestaurants";
import { useParams } from "react-router-dom";

function RestaurantDetail() {
  const { id } = useParams();
  const { data: restaurant, isLoading, error } = useRestaurant(id!);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{restaurant?.res_name}</div>;
}
```

**Implementation**:
```typescript
export function useRestaurant(resId: string) {
  return useQuery({
    queryKey: ["restaurant", resId],
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
        .eq("res_id", resId)
        .single();
      
      if (error) throw error;
      return data as Restaurant;
    },
    enabled: !!resId,
  });
}
```

**Query Details**:
- **Query Key**: `["restaurant", resId]`
- **Supabase Query**: Fetches single restaurant with nested data
- **RLS**: Automatically filters by `kam_email`
- **Enabled**: Only runs if `resId` is provided

---

### useDrives()

**Purpose**: Fetch all active drives

**Returns**: `UseQueryResult<Drive[], Error>`

**Usage**:
```typescript
import { useDrives } from "@/hooks/useDrives";

function DrivesList() {
  const { data: drives, isLoading, error } = useDrives();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {drives?.map((d) => (
        <div key={d.id}>{d.drive_name}</div>
      ))}
    </div>
  );
}
```

**Implementation**:
```typescript
export function useDrives() {
  return useQuery({
    queryKey: ["drives"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drives")
        .select("*")
        .eq("status", "active")
        .order("start_date", { ascending: false });
      
      if (error) throw error;
      return data as Drive[];
    },
  });
}
```

**Query Details**:
- **Query Key**: `["drives"]`
- **Supabase Query**: Fetches only active drives
- **RLS**: Everyone can see all drives
- **Ordering**: Most recent first

---

## Mutation Hooks (Write Operations)

### useMarkApproached()

**Purpose**: Mark restaurant as approached for a specific drive

**Returns**: `UseMutationResult<void, Error, MarkApproachedParams>`

**Parameters**:
```typescript
interface MarkApproachedParams {
  resId: string;
  driveId: number;
  kamEmail: string;
}
```

**Usage**:
```typescript
import { useMarkApproached } from "@/hooks/useRestaurants";
import { useAuth } from "@/contexts/AuthContext";

function RestaurantDetail() {
  const { user } = useAuth();
  const markApproached = useMarkApproached();

  const handleMarkApproached = async (driveId: number) => {
    try {
      await markApproached.mutateAsync({
        resId: "R001",
        driveId: driveId,
        kamEmail: user?.email!,
      });
      toast({ title: "Success", description: "Marked as approached" });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <Button 
      onClick={() => handleMarkApproached(1)}
      disabled={markApproached.isPending}
    >
      {markApproached.isPending ? "Saving..." : "Mark as Approached"}
    </Button>
  );
}
```

**Implementation**:
```typescript
export function useMarkApproached() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ resId, driveId, kamEmail }: MarkApproachedParams) => {
      // Step 1: Update drive_data table
      const { error: updateError } = await supabase
        .from("drive_data")
        .update({ 
          approached: true, 
          last_updated: new Date().toISOString() 
        })
        .eq("res_id", resId)
        .eq("drive_id", driveId);
      
      if (updateError) throw updateError;
      
      // Step 2: Log to conversion_tracking table
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

**Mutation Details**:
- **Updates**: `drive_data.approached = true`
- **Logs**: Inserts record in `conversion_tracking`
- **Invalidates**: `["restaurants"]` and `["restaurant"]` queries
- **RLS**: Automatically enforces KAM can only update their restaurants

---

### useMarkConverted()

**Purpose**: Mark restaurant as converted for a specific drive

**Returns**: `UseMutationResult<void, Error, MarkConvertedParams>`

**Parameters**:
```typescript
interface MarkConvertedParams {
  resId: string;
  driveId: number;
  kamEmail: string;
}
```

**Usage**:
```typescript
import { useMarkConverted } from "@/hooks/useRestaurants";
import { useAuth } from "@/contexts/AuthContext";

function RestaurantDetail() {
  const { user } = useAuth();
  const markConverted = useMarkConverted();

  const handleMarkConverted = async (driveId: number) => {
    try {
      await markConverted.mutateAsync({
        resId: "R001",
        driveId: driveId,
        kamEmail: user?.email!,
      });
      toast({ title: "Success", description: "Marked as converted" });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <Button 
      onClick={() => handleMarkConverted(1)}
      disabled={markConverted.isPending}
    >
      {markConverted.isPending ? "Saving..." : "Mark as Converted"}
    </Button>
  );
}
```

**Implementation**:
```typescript
export function useMarkConverted() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ resId, driveId, kamEmail }: MarkConvertedParams) => {
      // Step 1: Update drive_data table
      const { error: updateError } = await supabase
        .from("drive_data")
        .update({ 
          converted_stepper: true, 
          last_updated: new Date().toISOString() 
        })
        .eq("res_id", resId)
        .eq("drive_id", driveId);
      
      if (updateError) throw updateError;
      
      // Step 2: Log to conversion_tracking table
      const { error: trackingError } = await supabase
        .from("conversion_tracking")
        .insert({
          res_id: resId,
          drive_id: driveId,
          kam_email: kamEmail,
          action_type: "converted",
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

**Mutation Details**:
- **Updates**: `drive_data.converted_stepper = true`
- **Logs**: Inserts record in `conversion_tracking`
- **Invalidates**: `["restaurants"]` and `["restaurant"]` queries
- **RLS**: Automatically enforces KAM can only update their restaurants

---

## Toast Notifications

### useToast()

**Purpose**: Show toast notifications

**Returns**: `{ toast: (options: ToastOptions) => void, toasts: Toast[] }`

**Usage**:
```typescript
import { useToast } from "@/hooks/use-toast";

function MyComponent() {
  const { toast } = useToast();

  const showSuccess = () => {
    toast({
      title: "Success",
      description: "Operation completed successfully",
    });
  };

  const showError = () => {
    toast({
      title: "Error",
      description: "Something went wrong",
      variant: "destructive",
    });
  };

  return (
    <div>
      <Button onClick={showSuccess}>Show Success</Button>
      <Button onClick={showError}>Show Error</Button>
    </div>
  );
}
```

**Toast Options**:
```typescript
interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number; // milliseconds, default 5000
}
```

---

## React Query Configuration

**File**: `src/App.tsx`

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ... */}
    </QueryClientProvider>
  );
}
```

**Configuration Details**:
- **staleTime**: Data considered fresh for 5 minutes
- **gcTime**: Unused data garbage collected after 10 minutes
- **retry**: Retry failed queries once
- **refetchOnWindowFocus**: Don't refetch when window regains focus

---

## Query Invalidation

### When to Invalidate

Invalidate queries after mutations to refetch fresh data:

```typescript
// After marking as approached
queryClient.invalidateQueries({ queryKey: ["restaurants"] });
queryClient.invalidateQueries({ queryKey: ["restaurant"] });

// After marking as converted
queryClient.invalidateQueries({ queryKey: ["restaurants"] });
queryClient.invalidateQueries({ queryKey: ["restaurant"] });
```

### Manual Invalidation

```typescript
import { useQueryClient } from "@tanstack/react-query";

function MyComponent() {
  const queryClient = useQueryClient();

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["restaurants"] });
  };

  return <Button onClick={refreshData}>Refresh</Button>;
}
```

---

## Error Handling

### Query Errors

```typescript
const { data, error, isLoading } = useRestaurants();

if (error) {
  return (
    <div className="text-red-500">
      Error loading restaurants: {error.message}
    </div>
  );
}
```

### Mutation Errors

```typescript
const markApproached = useMarkApproached();

try {
  await markApproached.mutateAsync({ resId, driveId, kamEmail });
} catch (error: any) {
  console.error("Mutation failed:", error);
  toast({
    title: "Error",
    description: error.message,
    variant: "destructive",
  });
}
```

---

## Loading States

### Query Loading

```typescript
const { data, isLoading } = useRestaurants();

if (isLoading) {
  return <div>Loading restaurants...</div>;
}
```

### Mutation Loading

```typescript
const markApproached = useMarkApproached();

return (
  <Button 
    onClick={handleClick}
    disabled={markApproached.isPending}
  >
    {markApproached.isPending ? "Saving..." : "Mark as Approached"}
  </Button>
);
```

---

## Best Practices

### 1. Always Handle Loading and Error States

```typescript
const { data, isLoading, error } = useRestaurants();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <RestaurantList restaurants={data} />;
```

### 2. Use Optimistic Updates for Better UX

```typescript
const markApproached = useMarkApproached();

// UI updates immediately, reverts if mutation fails
await markApproached.mutateAsync({ resId, driveId, kamEmail });
```

### 3. Invalidate Related Queries

```typescript
// Invalidate both list and detail queries
queryClient.invalidateQueries({ queryKey: ["restaurants"] });
queryClient.invalidateQueries({ queryKey: ["restaurant"] });
```

### 4. Use TypeScript Interfaces

```typescript
// Always type your data
const { data: restaurants } = useRestaurants();
// restaurants is typed as Restaurant[] | undefined
```

### 5. Show User Feedback

```typescript
try {
  await mutation.mutateAsync(params);
  toast({ title: "Success", description: "Saved successfully" });
} catch (error: any) {
  toast({ title: "Error", description: error.message, variant: "destructive" });
}
```

