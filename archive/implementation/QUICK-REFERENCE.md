# ⚡ Quick Reference Guide - Hybrid Approach

**For developers implementing the Zomato Drive Dashboard backend**

---

## 🎯 What to Copy, What to Build

### ✅ COPY from Atomic CRM (Patterns Only)

#### **1. Supabase Client Setup**
**File:** `src/lib/supabase.ts`

**Atomic CRM Pattern:**
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

**Your Implementation:**
- ✅ Copy this pattern exactly
- ✅ Update type import to match your schema
- ✅ Use same environment variable names

---

#### **2. React Query Hooks**
**File:** `src/hooks/useRestaurants.ts`

**Atomic CRM Pattern (from `useContacts.ts`):**
```typescript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data
    }
  })
}
```

**Your Implementation:**
```typescript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useRestaurants() {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('res_name')
      
      if (error) throw error
      return data
    }
  })
}

export function useRestaurantsByKAM(kamName: string) {
  return useQuery({
    queryKey: ['restaurants', 'kam', kamName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('kam_name', kamName)
        .order('res_name')
      
      if (error) throw error
      return data
    },
    enabled: !!kamName
  })
}
```

---

#### **3. Mutation Hooks**
**File:** `src/hooks/useConversions.ts`

**Atomic CRM Pattern (from `useMutations.ts`):**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useUpdateContact() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  })
}
```

**Your Implementation:**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useMarkAsApproached() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ resId, driveId, kamName }) => {
      // Update drive_data
      const { error: updateError } = await supabase
        .from('drive_data')
        .update({ approached: true })
        .eq('res_id', resId)
        .eq('drive_id', driveId)
      
      if (updateError) throw updateError
      
      // Insert audit trail
      const { error: auditError } = await supabase
        .from('conversion_tracking')
        .insert({
          res_id: resId,
          drive_id: driveId,
          kam_name: kamName,
          action_type: 'approached'
        })
      
      if (auditError) throw auditError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] })
      queryClient.invalidateQueries({ queryKey: ['drive_data'] })
    }
  })
}
```

---

#### **4. Optimistic Updates**
**Atomic CRM Pattern:**
```typescript
export function useUpdateContact() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      // ... mutation logic
    },
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['contacts'] })
      
      // Snapshot previous value
      const previousContacts = queryClient.getQueryData(['contacts'])
      
      // Optimistically update
      queryClient.setQueryData(['contacts'], (old) =>
        old.map(contact => contact.id === id ? { ...contact, ...updates } : contact)
      )
      
      return { previousContacts }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['contacts'], context.previousContacts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    }
  })
}
```

**Your Implementation:** Copy this pattern for instant UI updates

---

### 🔧 BUILD Custom (Zomato-Specific)

#### **1. Priority Scoring Algorithm**
**File:** `src/lib/priorityScore.ts`

```typescript
import type { Restaurant, DriveData } from '@/types/database'

export function calculatePriorityScore(
  restaurant: Restaurant,
  driveData: DriveData
): number {
  // OV component (0-100 scale)
  const ovScore = Math.min(restaurant.sept_ov / 10, 100) * 0.3
  
  // Segment component (UM + MM + LA)
  const totalSegments = driveData.um + driveData.mm + driveData.la
  const segmentScore = Math.min(totalSegments / 3, 100) * 0.4
  
  // Status component
  let statusScore = 0
  if (driveData.approached) statusScore += 50
  if (driveData.converted_stepper) statusScore += 50
  const statusTotal = statusScore * 0.3
  
  return Math.round(ovScore + segmentScore + statusTotal)
}

export function getPriorityLabel(score: number): string {
  if (score >= 80) return 'High'
  if (score >= 50) return 'Medium'
  return 'Low'
}

export function getPriorityColor(score: number): string {
  if (score >= 80) return 'text-red-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-green-600'
}
```

---

#### **2. KAM Performance Aggregation**
**File:** `src/hooks/useKAMStats.ts`

```typescript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useKAMStats() {
  return useQuery({
    queryKey: ['kam-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_kam_performance')
      
      if (error) throw error
      return data
    }
  })
}

// Create this function in Supabase SQL Editor:
/*
CREATE OR REPLACE FUNCTION get_kam_performance()
RETURNS TABLE (
  kam_name TEXT,
  total_restaurants BIGINT,
  approached_count BIGINT,
  converted_count BIGINT,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.kam_name,
    COUNT(DISTINCT dd.res_id) as total_restaurants,
    COUNT(DISTINCT CASE WHEN dd.approached = TRUE THEN dd.res_id END) as approached_count,
    COUNT(DISTINCT CASE WHEN dd.converted_stepper = TRUE THEN dd.res_id END) as converted_count,
    ROUND(
      100.0 * COUNT(DISTINCT CASE WHEN dd.converted_stepper = TRUE THEN dd.res_id END) / 
      NULLIF(COUNT(DISTINCT dd.res_id), 0), 
      2
    ) as conversion_rate
  FROM restaurants r
  LEFT JOIN drive_data dd ON r.res_id = dd.res_id
  GROUP BY r.kam_name
  ORDER BY conversion_rate DESC;
END;
$$ LANGUAGE plpgsql;
*/
```

---

### 📥 IMPORT from n8n (Direct Use)

#### **1. Google Sheets → Supabase Sync**
**Template:** https://n8n.io/workflows/2081

**Steps:**
1. Go to n8n.io/workflows/2081
2. Click "Use workflow"
3. Configure Google Sheets credentials
4. Configure Supabase credentials
5. Update column mappings:
   ```json
   {
     "res_id": "{{ $json.res_id }}",
     "res_name": "{{ $json.res_name }}",
     "kam_name": "{{ $json.kam_name }}",
     "sept_ov": "{{ parseInt($json.sept_ov) }}"
   }
   ```
6. Schedule: `0 6 * * *` (6 AM daily)
7. Activate workflow

---

#### **2. Email Summaries**
**Template:** Search "email schedule" in n8n workflows

**Customization:**
```javascript
// In n8n Code node
const stats = await fetch('https://your-supabase-url/rest/v1/rpc/get_kam_performance', {
  headers: {
    'apikey': 'your-anon-key',
    'Authorization': 'Bearer your-anon-key'
  }
})

const html = `
<h1>Daily KAM Performance</h1>
<table>
  <tr><th>KAM</th><th>Conversions</th><th>Rate</th></tr>
  ${stats.map(s => `
    <tr>
      <td>${s.kam_name}</td>
      <td>${s.converted_count}</td>
      <td>${s.conversion_rate}%</td>
    </tr>
  `).join('')}
</table>
`

return { html }
```

---

## 🗂️ File Organization

```
src/
├── lib/
│   ├── supabase.ts          ← COPY pattern from Atomic CRM
│   ├── priorityScore.ts     ← BUILD custom
│   └── aiPrioritization.ts  ← BUILD custom (optional)
│
├── types/
│   └── database.ts          ← COPY pattern, customize types
│
├── hooks/
│   ├── useRestaurants.ts    ← COPY pattern from useContacts.ts
│   ├── useDrives.ts         ← COPY pattern
│   ├── useDriveData.ts      ← COPY pattern
│   ├── useConversions.ts    ← COPY pattern, add custom logic
│   ├── useKAMStats.ts       ← BUILD custom
│   └── useZonalStats.ts     ← BUILD custom
│
├── components/
│   ├── EditableDiscount.tsx ← COPY pattern from Atomic CRM
│   └── PriorityList.tsx     ← BUILD custom
│
└── pages/ (UPDATE EXISTING)
    ├── KAMHub.tsx
    ├── RestaurantDetail.tsx
    ├── KAMAnalytics.tsx
    └── ZonalHeadView.tsx
```

---

## 🔗 Useful Links

### **Atomic CRM Reference**
- Repo: https://github.com/marmelab/atomic-crm
- Supabase setup: `src/lib/supabase.ts`
- React Query hooks: `src/hooks/useContacts.ts`
- Mutations: `src/hooks/useMutations.ts`

### **n8n Templates**
- Workflows: https://n8n.io/workflows/
- Google Sheets Sync: https://n8n.io/workflows/2081
- Docs: https://docs.n8n.io/

### **Documentation**
- Supabase: https://supabase.com/docs
- React Query: https://tanstack.com/query/latest
- Recharts: https://recharts.org/

---

## ⚡ Common Patterns

### **Pattern 1: Fetch with Filter**
```typescript
export function useRestaurantsByLocality(locality: string) {
  return useQuery({
    queryKey: ['restaurants', 'locality', locality],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('locality', locality)
      
      if (error) throw error
      return data
    },
    enabled: !!locality
  })
}
```

### **Pattern 2: Fetch with Join**
```typescript
export function useRestaurantWithDrives(resId: string) {
  return useQuery({
    queryKey: ['restaurant', resId, 'drives'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select(`
          *,
          drive_data (
            *,
            drives (*)
          )
        `)
        .eq('res_id', resId)
        .single()
      
      if (error) throw error
      return data
    }
  })
}
```

### **Pattern 3: Update with Audit Trail**
```typescript
export function useUpdateDiscount() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ resId, driveId, discount, kamName }) => {
      // Update discount
      await supabase
        .from('drive_data')
        .update({ la_base_code_suggested: discount })
        .eq('res_id', resId)
        .eq('drive_id', driveId)
      
      // Log action
      await supabase
        .from('conversion_tracking')
        .insert({
          res_id: resId,
          drive_id: driveId,
          kam_name: kamName,
          action_type: 'discount_updated',
          discount_applied: discount
        })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drive_data'] })
    }
  })
}
```

---

## 🎯 Quick Wins

### **Day 1: Get Data Showing**
1. Create Supabase project
2. Run database migrations
3. Insert sample data
4. Create `src/lib/supabase.ts`
5. Create `src/hooks/useRestaurants.ts`
6. Update `KAMHub.tsx` to use hook
7. See real data in browser! 🎉

### **Day 2: Enable Conversions**
1. Create `src/hooks/useConversions.ts`
2. Add "Mark as Approached" button
3. Test in browser
4. See audit trail in database! 🎉

### **Day 3: Add Charts**
1. Create `src/hooks/useConversionTrend.ts`
2. Create `src/components/ConversionTrendChart.tsx`
3. Add to KAM Analytics page
4. See live chart! 🎉

---

**Remember:** Copy patterns, build logic, import templates. Don't fork entire repos! 🚀

