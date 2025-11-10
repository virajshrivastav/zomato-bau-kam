# 🎯 Hybrid Approach Implementation Plan

**Strategy:** Keep existing UI, copy best patterns, build custom business logic  
**Timeline:** 1.5-2 weeks (12-16 days)  
**Effort Savings:** 66% reduction vs. building from scratch or forking Atomic CRM

---

## 📋 Executive Summary

### **What We're NOT Doing**
- ❌ Forking Atomic CRM (domain mismatch, high customization overhead)
- ❌ Building everything from scratch (reinventing the wheel)
- ❌ Throwing away existing UI (already 80% complete)

### **What We ARE Doing**
- ✅ **Keep existing UI** - All 5 pages, 21 custom components, 70+ shadcn/ui components
- ✅ **Copy proven patterns** - Supabase setup, React Query hooks from Atomic CRM
- ✅ **Use n8n templates** - Google Sheets sync workflow (direct import)
- ✅ **Build custom logic** - Zomato-specific drives, conversions, priority scoring

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  EXISTING UI (Keep As-Is)                                   │
│  ✅ MainDashboard.tsx                                       │
│  ✅ KAMHub.tsx                                              │
│  ✅ RestaurantDetail.tsx                                    │
│  ✅ KAMAnalytics.tsx                                        │
│  ✅ ZonalHeadView.tsx                                       │
│  ✅ 21 custom components + 70+ shadcn/ui components         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  NEW API LAYER (Copy Patterns from Atomic CRM)              │
│  📋 src/lib/supabase.ts - Client setup                      │
│  📋 src/hooks/useRestaurants.ts - CRUD hooks                │
│  📋 src/hooks/useConversions.ts - Mutation hooks            │
│  📋 src/types/database.ts - TypeScript types                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  NEW DATABASE (Custom Schema for Zomato)                    │
│  🗄️ restaurants - Master data                               │
│  🗄️ drives - Campaign metadata                              │
│  🗄️ drive_data - Restaurant-drive assignments               │
│  🗄️ conversion_tracking - Audit trail                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  AUTOMATION (Use n8n Templates)                              │
│  🔄 Google Sheets → Supabase sync (import template)         │
│  🔄 Email summaries (import template)                       │
│  🔄 AI prioritization (custom workflow)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📅 Sprint Breakdown

### **Sprint 1: Foundation (Days 1-4)**
**Goal:** Database + Supabase + Basic API connection

#### **Day 1: Supabase Setup**
**Technical Achievement:** Cloud PostgreSQL instance with auto-generated REST API

**Tasks:**
1. Create Supabase project at https://supabase.com
2. Create database schema (4 tables: restaurants, drives, drive_data, conversion_tracking)
3. Add indexes for performance
4. Insert sample data (20+ restaurants from CSV)
5. Test API endpoints in Supabase dashboard

**Deliverables:**
- ✅ Supabase project URL
- ✅ API keys (anon, service_role)
- ✅ 4 tables with sample data
- ✅ Working REST endpoints

**Copy from Atomic CRM:**
- Database migration pattern (how they structure SQL files)
- Index strategy (which columns to index)

**Time:** 6-8 hours

---

#### **Day 2: React Integration**
**Technical Achievement:** Type-safe Supabase client with environment-based configuration

**Tasks:**
1. Install Supabase client: `npm install @supabase/supabase-js`
2. Create `.env.local` with Supabase credentials
3. Create `src/lib/supabase.ts` (copy pattern from Atomic CRM)
4. Create `src/types/database.ts` (TypeScript interfaces)
5. Test connection in browser console

**Deliverables:**
- ✅ `src/lib/supabase.ts` - Supabase client singleton
- ✅ `src/types/database.ts` - Type definitions
- ✅ `.env.local` - Environment variables
- ✅ Successful connection test

**Copy from Atomic CRM:**
```typescript
// src/lib/supabase.ts (pattern from Atomic CRM)
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

**Time:** 4-6 hours

---

#### **Day 3: React Query Hooks**
**Technical Achievement:** React Query hooks with cache invalidation and optimistic updates

**Tasks:**
1. Create `src/hooks/useRestaurants.ts` (copy pattern from Atomic CRM's `useContacts.ts`)
2. Create `src/hooks/useDrives.ts`
3. Create `src/hooks/useDriveData.ts`
4. Test hooks in browser console

**Deliverables:**
- ✅ `useRestaurants()` - Fetch all restaurants
- ✅ `useRestaurantsByKAM(kamName)` - Filter by KAM
- ✅ `useDrives()` - Fetch all drives
- ✅ `useDriveData(driveId)` - Fetch drive assignments

**Copy from Atomic CRM:**
```typescript
// Pattern from Atomic CRM's useContacts.ts
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
```

**Time:** 6-8 hours

---

#### **Day 4: UI Connection**
**Technical Achievement:** KAM Hub consuming real-time data from Supabase

**Tasks:**
1. Update `src/pages/KAMHub.tsx` to use `useRestaurants()` hook
2. Replace mock data with real data
3. Add loading states
4. Add error handling
5. Test in browser

**Deliverables:**
- ✅ KAM Hub loads real restaurants from database
- ✅ Loading spinner while fetching
- ✅ Error message if fetch fails
- ✅ No console errors

**Before (Mock Data):**
```typescript
const restaurants = [
  { id: 1, name: "Viraj Restaurant", status: "poor", revenue: "₹12K" },
  // ... hardcoded data
]
```

**After (Real Data):**
```typescript
const { data: restaurants, isLoading, error } = useRestaurants()

if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
```

**Time:** 4-6 hours

---

### **Sprint 2: Core Features (Days 5-8)**
**Goal:** Data sync + Conversion tracking + CRUD operations

#### **Day 5: n8n Setup**
**Technical Achievement:** Event-driven ETL pipeline with error handling and retry logic

**Tasks:**
1. Sign up for n8n Cloud (https://n8n.io) or self-host
2. Import "Google Sheets → Postgres" workflow template
3. Configure Google Sheets credentials
4. Configure Supabase credentials
5. Customize column mappings for Zomato data
6. Test manual sync
7. Schedule daily sync (6 AM IST)

**Deliverables:**
- ✅ n8n workflow running
- ✅ Daily sync scheduled
- ✅ Slack notification on completion
- ✅ Error handling configured

**Use n8n Template:**
- Workflow ID: 2081 (Google Sheets → Postgres)
- Direct import, no coding required
- Just configure credentials and mappings

**Time:** 4-6 hours

---

#### **Day 6: Conversion Mutations**
**Technical Achievement:** React Query mutation with optimistic UI updates and audit logging

**Tasks:**
1. Create `src/hooks/useConversions.ts` (copy pattern from Atomic CRM)
2. Implement `markAsApproached()` mutation
3. Implement `markAsConverted()` mutation
4. Add optimistic updates
5. Add audit trail logging

**Deliverables:**
- ✅ `useMarkAsApproached()` hook
- ✅ `useMarkAsConverted()` hook
- ✅ Optimistic UI updates
- ✅ Automatic audit trail creation

**Copy from Atomic CRM:**
```typescript
// Pattern from Atomic CRM's useMutations.ts
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

**Time:** 6-8 hours

---

#### **Day 11: Priority Scoring Algorithm**
**Technical Achievement:** Multi-factor weighted algorithm with configurable parameters

**Tasks:**
1. Create `src/lib/priorityScore.ts`
2. Implement scoring algorithm: `OV × 0.3 + segments × 0.4 + status × 0.3`
3. Create `src/hooks/usePriorityList.ts`
4. Create `src/components/PriorityList.tsx`
5. Integrate into Restaurant Detail page

**Deliverables:**
- ✅ Priority scoring function
- ✅ Priority list component
- ✅ Sorted by score (highest first)
- ✅ Visual indicators (high/medium/low)

**Custom Business Logic:**
```typescript
// src/lib/priorityScore.ts
export function calculatePriorityScore(restaurant: Restaurant, driveData: DriveData): number {
  // OV component (0-100 scale)
  const ovScore = Math.min(restaurant.sept_ov / 10, 100) * 0.3

  // Segment component (UM + MM + LA)
  const segmentScore = (driveData.um + driveData.mm + driveData.la) / 3 * 0.4

  // Status component
  const statusScore = driveData.approached ? 50 : 0
  const convertedBonus = driveData.converted_stepper ? 50 : 0
  const statusTotal = (statusScore + convertedBonus) * 0.3

  return Math.round(ovScore + segmentScore + statusTotal)
}
```

**Time:** 6-8 hours

---

#### **Day 12: Zonal Head Dashboard**
**Technical Achievement:** Hierarchical data aggregation with team rollup calculations

**Tasks:**
1. Create `src/hooks/useZonalStats.ts`
2. Query KAM performance grouped by team
3. Update `src/pages/ZonalHeadView.tsx` with real data
4. Add team-level metrics
5. Add drill-down to KAM level

**Deliverables:**
- ✅ Zonal Head dashboard with real data
- ✅ Team-level aggregation
- ✅ KAM performance table
- ✅ Drill-down functionality

**SQL Query:**
```sql
SELECT
  r.tl_email,
  r.kam_name,
  COUNT(DISTINCT dd.res_id) as total_restaurants,
  COUNT(DISTINCT CASE WHEN dd.approached = TRUE THEN dd.res_id END) as approached_count,
  COUNT(DISTINCT CASE WHEN dd.converted_stepper = TRUE THEN dd.res_id END) as converted_count,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN dd.converted_stepper = TRUE THEN dd.res_id END) /
    NULLIF(COUNT(DISTINCT dd.res_id), 0), 2) as conversion_rate
FROM restaurants r
LEFT JOIN drive_data dd ON r.res_id = dd.res_id
GROUP BY r.tl_email, r.kam_name
ORDER BY conversion_rate DESC
```

**Time:** 6-8 hours

---

### **Sprint 4: Advanced Features (Days 13-16) - OPTIONAL**
**Goal:** AI prioritization + Email summaries + Slack notifications

#### **Day 13: AI Prioritization**
**Technical Achievement:** OpenAI GPT-4 integration with prompt engineering and JSON parsing

**Tasks:**
1. Sign up for OpenAI API (https://platform.openai.com)
2. Create `src/lib/aiPrioritization.ts`
3. Write prompt for restaurant prioritization
4. Create n8n workflow for batch AI scoring
5. Schedule daily at 5 AM IST

**Deliverables:**
- ✅ AI prioritization function
- ✅ n8n workflow for batch processing
- ✅ Daily scheduled run
- ✅ Priority scores updated in database

**Custom Implementation:**
```typescript
// src/lib/aiPrioritization.ts
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function prioritizeRestaurants(restaurants: Restaurant[]) {
  const prompt = `
You are a restaurant prioritization expert for Zomato drives.
Given the following restaurants, rank them by priority (0-100) based on:
- Order volume (sept_ov)
- Customer segments (UM, MM, LA)
- Current status (approached, converted)

Restaurants:
${JSON.stringify(restaurants, null, 2)}

Return JSON array with res_id and priority_score.
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  })

  return JSON.parse(response.choices[0].message.content)
}
```

**Time:** 6-8 hours

---

#### **Day 14: Email Summaries**
**Technical Achievement:** Template-based HTML email generation with scheduled n8n workflow

**Tasks:**
1. Create email template in n8n
2. Query daily conversion stats
3. Generate HTML email with charts
4. Send via SMTP (Gmail/SendGrid)
5. Schedule daily at 7 AM IST

**Deliverables:**
- ✅ Daily email summary to KAMs
- ✅ HTML template with stats
- ✅ Scheduled delivery
- ✅ Error handling

**Use n8n Template:**
- Email node with HTML template
- Supabase query node for stats
- Schedule trigger (cron: 0 7 * * *)

**Time:** 4-6 hours

---

#### **Day 15: Slack Notifications**
**Technical Achievement:** Webhook-based event broadcasting with formatted message payloads

**Tasks:**
1. Create Slack incoming webhook
2. Create n8n workflow for conversion notifications
3. Trigger on database webhook (Supabase)
4. Format message with restaurant details
5. Test notifications

**Deliverables:**
- ✅ Slack notification on conversion
- ✅ Formatted message with details
- ✅ Real-time delivery
- ✅ Error handling

**Slack Message Format:**
```json
{
  "text": "🎉 New Conversion!",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Restaurant:* Shahi Darbar\n*KAM:* Anudeep Pawar\n*Drive:* Special 35\n*Discount:* 40 upto 80"
      }
    }
  ]
}
```

**Time:** 4-6 hours

---

#### **Day 16: Testing & Polish**
**Technical Achievement:** End-to-end testing with production-ready error handling

**Tasks:**
1. Test all user flows (KAM Hub → Restaurant Detail → Conversion)
2. Test data sync (Google Sheets → Supabase)
3. Test analytics (charts, metrics)
4. Fix bugs
5. Add error boundaries
6. Add loading states
7. Polish UI

**Deliverables:**
- ✅ All features working end-to-end
- ✅ No console errors
- ✅ Proper error handling
- ✅ Loading states everywhere
- ✅ Production-ready

**Time:** 6-8 hours

---

## 📊 Component Mapping: What to Copy vs. Build

### **Copy from Atomic CRM (Patterns Only)**

| Component | Atomic CRM File | Your File | Customization |
|-----------|----------------|-----------|---------------|
| **Supabase Client** | `src/lib/supabase.ts` | `src/lib/supabase.ts` | ✅ Copy as-is |
| **React Query Hooks** | `src/hooks/useContacts.ts` | `src/hooks/useRestaurants.ts` | 🔧 Rename, adjust types |
| **Mutation Hooks** | `src/hooks/useMutations.ts` | `src/hooks/useConversions.ts` | 🔧 Custom logic |
| **TypeScript Types** | `src/types/database.ts` | `src/types/database.ts` | 🔧 Custom schema |
| **Auth Flow** | `src/components/Auth.tsx` | Skip (use email login) | ❌ Not needed |

### **Use n8n Templates (Direct Import)**

| Workflow | Template ID | Customization |
|----------|-------------|---------------|
| **Google Sheets Sync** | 2081 | 🔧 Column mappings |
| **Email Summaries** | Search "email schedule" | 🔧 Template content |
| **Slack Notifications** | Search "slack webhook" | 🔧 Message format |

### **Build Custom (Zomato-Specific)**

| Component | File | Reason |
|-----------|------|--------|
| **Priority Scoring** | `src/lib/priorityScore.ts` | Custom algorithm |
| **Drive Logic** | `src/hooks/useDriveData.ts` | Zomato-specific |
| **Conversion Tracking** | `src/hooks/useConversions.ts` | Custom state machine |
| **KAM Hierarchy** | `src/hooks/useZonalStats.ts` | Custom aggregation |
| **All UI Pages** | `src/pages/*.tsx` | Already built! |

---

## 🎯 Success Metrics

### **Sprint 1 Success (Day 4)**
- [ ] KAM Hub loads real restaurants from Supabase
- [ ] Page loads in <2 seconds
- [ ] No console errors
- [ ] Data persists after refresh

### **Sprint 2 Success (Day 8)**
- [ ] Daily sync runs automatically
- [ ] KAMs can mark restaurants as approached
- [ ] KAMs can mark restaurants as converted
- [ ] Audit trail created for all actions

### **Sprint 3 Success (Day 12)**
- [ ] KAM Analytics shows real conversion trends
- [ ] Priority list ranks restaurants correctly
- [ ] Zonal Head dashboard shows team performance
- [ ] All charts display real data

### **Sprint 4 Success (Day 16) - OPTIONAL**
- [ ] AI recommendations generated daily
- [ ] Email summaries sent to KAMs
- [ ] Slack notifications on conversions
- [ ] All features production-ready

---

## 💰 Time & Cost Savings

| Approach | Time | Cost (1 dev @ $50/hr) | Pros | Cons |
|----------|------|----------------------|------|------|
| **Fork Atomic CRM** | 4-5 weeks | $8,000-$10,000 | Some code ready | Throw away UI, domain mismatch |
| **Build from Scratch** | 3-4 weeks | $6,000-$8,000 | Full control | Reinvent wheel |
| **Hybrid (This Plan)** | 1.5-2 weeks | $3,000-$4,000 | Best of both | Need to learn patterns |

**Savings:** **$4,000-$6,000** (50-66% reduction)

---

## 📁 File Structure (New Files Only)

```
src/
├── lib/
│   ├── supabase.ts (NEW - Day 2)
│   ├── priorityScore.ts (NEW - Day 11)
│   └── aiPrioritization.ts (NEW - Day 13)
├── types/
│   └── database.ts (NEW - Day 2)
├── hooks/
│   ├── useRestaurants.ts (NEW - Day 3)
│   ├── useDrives.ts (NEW - Day 3)
│   ├── useDriveData.ts (NEW - Day 3)
│   ├── useConversions.ts (NEW - Day 6)
│   ├── useKAMStats.ts (NEW - Day 9)
│   ├── useConversionTrend.ts (NEW - Day 10)
│   ├── usePriorityList.ts (NEW - Day 11)
│   └── useZonalStats.ts (NEW - Day 12)
├── components/
│   ├── EditableDiscount.tsx (NEW - Day 8)
│   ├── ConversionTrendChart.tsx (NEW - Day 10)
│   └── PriorityList.tsx (NEW - Day 11)
└── pages/ (UPDATE EXISTING)
    ├── KAMHub.tsx (UPDATE - Day 4)
    ├── RestaurantDetail.tsx (UPDATE - Day 7)
    ├── KAMAnalytics.tsx (UPDATE - Day 10)
    └── ZonalHeadView.tsx (UPDATE - Day 12)
```

**Total New Files:** 15
**Updated Files:** 4
**Existing Files Kept:** 100+

---

## 🚀 Getting Started

### **Prerequisites**
- [ ] Node.js 22 LTS installed
- [ ] Supabase account (free tier)
- [ ] n8n account (free tier or self-hosted)
- [ ] OpenAI API key (optional, for Day 13)

### **Day 1 Checklist**
1. [ ] Create Supabase project
2. [ ] Run database migrations
3. [ ] Insert sample data
4. [ ] Test API endpoints
5. [ ] Save credentials

### **Quick Start Commands**
```bash
# Install Supabase client
npm install @supabase/supabase-js

# Create .env.local
echo "VITE_SUPABASE_URL=your-project-url" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your-anon-key" >> .env.local

# Start dev server
npm run dev
```

---

## 📞 Support Resources

### **Atomic CRM Reference**
- GitHub: https://github.com/marmelab/atomic-crm
- Docs: https://marmelab.com/atomic-crm/
- Focus on: `src/lib/supabase.ts`, `src/hooks/useContacts.ts`

### **n8n Templates**
- Workflows: https://n8n.io/workflows/
- Google Sheets Sync: https://n8n.io/workflows/2081
- Docs: https://docs.n8n.io/

### **Supabase**
- Docs: https://supabase.com/docs
- React Query Guide: https://supabase.com/docs/guides/getting-started/tutorials/with-react
- Database: https://supabase.com/docs/guides/database

### **React Query**
- Docs: https://tanstack.com/query/latest
- Mutations: https://tanstack.com/query/latest/docs/react/guides/mutations
- Optimistic Updates: https://tanstack.com/query/latest/docs/react/guides/optimistic-updates

---

## ✅ Final Checklist

### **Before Starting**
- [ ] Read this entire document
- [ ] Review existing UI pages
- [ ] Check Atomic CRM repository
- [ ] Bookmark n8n workflows
- [ ] Set up Supabase account

### **After Sprint 1**
- [ ] Database schema created
- [ ] Sample data loaded
- [ ] Supabase client working
- [ ] KAM Hub shows real data

### **After Sprint 2**
- [ ] Daily sync running
- [ ] Conversions working
- [ ] Audit trail created
- [ ] CRUD operations functional

### **After Sprint 3**
- [ ] Charts displaying data
- [ ] Priority scoring working
- [ ] Analytics dashboard live
- [ ] Zonal Head view functional

### **After Sprint 4 (Optional)**
- [ ] AI prioritization running
- [ ] Email summaries sent
- [ ] Slack notifications working
- [ ] Production-ready

---

## 🎉 Summary

**This Hybrid Approach gives you:**
- ✅ **66% time savings** vs. building from scratch
- ✅ **Keep your existing UI** (no wasted work)
- ✅ **Learn from Atomic CRM** (proven patterns)
- ✅ **Use n8n templates** (no reinventing automation)
- ✅ **Build custom logic** (perfect fit for Zomato)
- ✅ **Production-ready in 2 weeks** (vs. 4-5 weeks)

**Ready to start?** Begin with Day 1: Supabase Setup! 🚀
#### **Day 7: Restaurant Detail Updates**
**Technical Achievement:** Multi-step form with validation, state transition, and audit trail

**Tasks:**
1. Update `src/pages/RestaurantDetail.tsx` to use real data
2. Add conversion action buttons
3. Integrate `useMarkAsApproached()` and `useMarkAsConverted()` hooks
4. Add success/error toasts
5. Test conversion flow

**Deliverables:**
- ✅ Restaurant Detail page loads real data
- ✅ "Mark as Approached" button works
- ✅ "Mark as Converted" button works
- ✅ Success toast on action
- ✅ Audit trail created automatically

**Time:** 6-8 hours

---

#### **Day 8: Editable Discount Codes**
**Technical Achievement:** Inline editing with debounced saves and rollback on error

**Tasks:**
1. Create `src/components/EditableDiscount.tsx`
2. Add debounced save (500ms delay)
3. Add optimistic update
4. Add rollback on error
5. Integrate into Restaurant Detail page

**Deliverables:**
- ✅ Inline editable discount codes
- ✅ Auto-save after 500ms
- ✅ Loading indicator while saving
- ✅ Rollback on error

**Copy from Atomic CRM:**
- Debounced input pattern
- Optimistic update pattern

**Time:** 4-6 hours

---

### **Sprint 3: Analytics (Days 9-12)**
**Goal:** Charts + Metrics + Priority scoring

#### **Day 9: KAM Performance Queries**
**Technical Achievement:** Complex SQL aggregation with computed metrics and memoization

**Tasks:**
1. Create `src/hooks/useKAMStats.ts`
2. Write SQL query for KAM performance (GROUP BY kam_name)
3. Calculate conversion rate, approach rate
4. Add memoization for performance
5. Test in browser console

**Deliverables:**
- ✅ `useKAMStats()` hook
- ✅ Returns: total_restaurants, approached_count, converted_count, conversion_rate
- ✅ Memoized results
- ✅ Sub-second query performance

**SQL Query:**
```sql
SELECT 
  r.kam_name,
  COUNT(DISTINCT dd.res_id) as total_restaurants,
  COUNT(DISTINCT CASE WHEN dd.approached = TRUE THEN dd.res_id END) as approached_count,
  COUNT(DISTINCT CASE WHEN dd.converted_stepper = TRUE THEN dd.res_id END) as converted_count,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN dd.converted_stepper = TRUE THEN dd.res_id END) / 
    NULLIF(COUNT(DISTINCT dd.res_id), 0), 2) as conversion_rate
FROM restaurants r
LEFT JOIN drive_data dd ON r.res_id = dd.res_id
GROUP BY r.kam_name
```

**Time:** 6-8 hours

---

#### **Day 10: Conversion Trend Chart**
**Technical Achievement:** Time-series data transformation with gap filling for Recharts

**Tasks:**
1. Create `src/hooks/useConversionTrend.ts`
2. Query conversion_tracking by date
3. Transform data for Recharts format
4. Create `src/components/ConversionTrendChart.tsx`
5. Integrate into KAM Analytics page

**Deliverables:**
- ✅ Line chart showing conversions over time
- ✅ Custom tooltip with date and count
- ✅ Responsive design
- ✅ Loading state

**Copy from Recharts Examples:**
```typescript
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={trendData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="conversions" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>
```

**Time:** 6-8 hours

---


