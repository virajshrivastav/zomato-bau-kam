# 📊 Analytics Integration Guide

**Purpose:** How to connect real data to KAM Analytics and Zonal Head View when data stabilizes

**Current Status:** These pages use mock data intentionally (real data is evolving)

**Time to Integrate:** 1-2 hours when ready

---

## 🎯 Why Analytics Use Mock Data

### Business Reason
- Real conversion and performance data is still evolving
- No fixed/stable data available yet for meaningful analytics
- Mock data serves as UI preview for stakeholders
- Core KAM workflow (Sprint 1) is fully functional without analytics

### Technical Reason
- No point calculating metrics on changing/unstable data
- Easy to connect later when data patterns stabilize
- All infrastructure (database, hooks, components) is ready

---

## 📋 What Needs Real Data

### 1. KAM Analytics Page (`src/pages/KAMAnalytics.tsx`)

**Current Mock Data:**
- Weekly conversion trends (bar chart)
- Restaurant status distribution (pie chart)
- Drive-specific KPIs (N2R, NCN, MRP performance)
- Top performing restaurants

**What Real Data Would Show:**
- Actual conversion rates over time
- Real restaurant status counts
- Actual drive performance metrics
- Real top performers based on revenue/conversions

---

### 2. Zonal Head View (`src/pages/ZonalHeadView.tsx`)

**Current Mock Data:**
- Total KAMs count
- Average conversion rate
- Average approach rate
- Total drives count
- KAM performance table with rankings

**What Real Data Would Show:**
- Actual KAM count from database
- Real team conversion/approach rates
- Real drive counts
- Actual KAM performance rankings

---

## 🛠️ How to Integrate Real Data (Step-by-Step)

### Step 1: Create Database Functions (30 min)

Create SQL functions in Supabase to calculate metrics:

```sql
-- Function: Get KAM statistics
CREATE OR REPLACE FUNCTION get_kam_stats(kam_email_param TEXT)
RETURNS TABLE (
  total_restaurants INT,
  approached_count INT,
  converted_count INT,
  conversion_rate DECIMAL,
  approach_rate DECIMAL,
  total_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT r.res_id)::INT as total_restaurants,
    COUNT(DISTINCT CASE WHEN dd.approached = true THEN r.res_id END)::INT as approached_count,
    COUNT(DISTINCT CASE WHEN dd.converted_stepper = true THEN r.res_id END)::INT as converted_count,
    ROUND(
      COUNT(DISTINCT CASE WHEN dd.converted_stepper = true THEN r.res_id END)::DECIMAL / 
      NULLIF(COUNT(DISTINCT CASE WHEN dd.approached = true THEN r.res_id END), 0) * 100, 
      2
    ) as conversion_rate,
    ROUND(
      COUNT(DISTINCT CASE WHEN dd.approached = true THEN r.res_id END)::DECIMAL / 
      NULLIF(COUNT(DISTINCT r.res_id), 0) * 100, 
      2
    ) as approach_rate,
    SUM(r.sept_ov)::DECIMAL as total_revenue
  FROM restaurants r
  LEFT JOIN drive_data dd ON r.res_id = dd.res_id
  WHERE r.kam_email = kam_email_param;
END;
$$ LANGUAGE plpgsql;

-- Function: Get weekly conversion trends
CREATE OR REPLACE FUNCTION get_weekly_trends(kam_email_param TEXT, weeks INT DEFAULT 7)
RETURNS TABLE (
  week_number INT,
  week_label TEXT,
  conversions INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(WEEK FROM ct.timestamp)::INT as week_number,
    'Week ' || EXTRACT(WEEK FROM ct.timestamp)::TEXT as week_label,
    COUNT(*)::INT as conversions
  FROM conversion_tracking ct
  WHERE ct.kam_email = kam_email_param
    AND ct.action = 'converted'
    AND ct.timestamp >= NOW() - INTERVAL '1 week' * weeks
  GROUP BY week_number
  ORDER BY week_number;
END;
$$ LANGUAGE plpgsql;

-- Function: Get zonal team statistics
CREATE OR REPLACE FUNCTION get_zonal_stats()
RETURNS TABLE (
  kam_name TEXT,
  kam_email TEXT,
  total_restaurants INT,
  approached_count INT,
  converted_count INT,
  conversion_rate DECIMAL,
  approach_rate DECIMAL,
  rank INT
) AS $$
BEGIN
  RETURN QUERY
  WITH kam_metrics AS (
    SELECT 
      r.kam_name,
      r.kam_email,
      COUNT(DISTINCT r.res_id)::INT as total_restaurants,
      COUNT(DISTINCT CASE WHEN dd.approached = true THEN r.res_id END)::INT as approached_count,
      COUNT(DISTINCT CASE WHEN dd.converted_stepper = true THEN r.res_id END)::INT as converted_count,
      ROUND(
        COUNT(DISTINCT CASE WHEN dd.converted_stepper = true THEN r.res_id END)::DECIMAL / 
        NULLIF(COUNT(DISTINCT CASE WHEN dd.approached = true THEN r.res_id END), 0) * 100, 
        2
      ) as conversion_rate,
      ROUND(
        COUNT(DISTINCT CASE WHEN dd.approached = true THEN r.res_id END)::DECIMAL / 
        NULLIF(COUNT(DISTINCT r.res_id), 0) * 100, 
        2
      ) as approach_rate
    FROM restaurants r
    LEFT JOIN drive_data dd ON r.res_id = dd.res_id
    GROUP BY r.kam_name, r.kam_email
  )
  SELECT 
    *,
    RANK() OVER (ORDER BY conversion_rate DESC, approach_rate DESC)::INT as rank
  FROM kam_metrics
  ORDER BY rank;
END;
$$ LANGUAGE plpgsql;
```

---

### Step 2: Create React Hooks (20 min)

Create `src/hooks/useAnalytics.ts`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

// Hook: Get KAM statistics
export const useKAMStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["kam-stats", user?.email],
    queryFn: async () => {
      if (!user?.email) throw new Error("No user logged in");

      const { data, error } = await supabase.rpc("get_kam_stats", {
        kam_email_param: user.email,
      });

      if (error) throw error;
      return data[0];
    },
    enabled: !!user?.email,
  });
};

// Hook: Get weekly conversion trends
export const useWeeklyTrends = (weeks: number = 7) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["weekly-trends", user?.email, weeks],
    queryFn: async () => {
      if (!user?.email) throw new Error("No user logged in");

      const { data, error } = await supabase.rpc("get_weekly_trends", {
        kam_email_param: user.email,
        weeks,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.email,
  });
};

// Hook: Get zonal team statistics
export const useZonalStats = () => {
  return useQuery({
    queryKey: ["zonal-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_zonal_stats");

      if (error) throw error;
      return data;
    },
  });
};
```

---

### Step 3: Update KAM Analytics Page (15 min)

Replace mock data in `src/pages/KAMAnalytics.tsx`:

```typescript
// BEFORE (Mock Data)
const barData = [
  { name: "Week 1", value: 45 },
  { name: "Week 2", value: 52 },
  // ... hardcoded
];

// AFTER (Real Data)
import { useWeeklyTrends, useKAMStats } from "@/hooks/useAnalytics";

const KAMAnalytics = () => {
  const { data: weeklyTrends, isLoading: trendsLoading } = useWeeklyTrends();
  const { data: kamStats, isLoading: statsLoading } = useKAMStats();

  // Transform data for charts
  const barData = weeklyTrends?.map(week => ({
    name: week.week_label,
    value: week.conversions,
  })) || [];

  // Show loading state
  if (trendsLoading || statsLoading) {
    return <div>Loading analytics...</div>;
  }

  // Rest of component uses real data
  // ...
};
```

---

### Step 4: Update Zonal Head View (15 min)

Replace mock data in `src/pages/ZonalHeadView.tsx`:

```typescript
// BEFORE (Mock Data)
<KPICard title="Total KAMs" value="5" />
<KPICard title="Avg Conversion Rate" value="76.8%" />

// AFTER (Real Data)
import { useZonalStats } from "@/hooks/useAnalytics";

const ZonalHeadView = () => {
  const { data: zonalStats, isLoading } = useZonalStats();

  const totalKAMs = zonalStats?.length || 0;
  const avgConversionRate = zonalStats?.reduce((sum, kam) => sum + kam.conversion_rate, 0) / totalKAMs;

  return (
    <>
      <KPICard title="Total KAMs" value={totalKAMs.toString()} />
      <KPICard title="Avg Conversion Rate" value={`${avgConversionRate.toFixed(1)}%`} />
      {/* ... */}
    </>
  );
};
```

---

## ✅ Testing Checklist

After integration, verify:

- [ ] KAM Analytics shows real conversion trends
- [ ] Charts update when new conversions are marked
- [ ] Zonal Head View shows actual KAM rankings
- [ ] Performance metrics match database queries
- [ ] Loading states work correctly
- [ ] Error handling works if database is unavailable

---

## 🚀 When to Integrate

**Integrate when:**
- Real conversion data has accumulated (at least 2-4 weeks)
- Data patterns have stabilized
- Stakeholders need real insights (not just UI preview)

**Don't integrate if:**
- Data is still changing frequently
- Not enough historical data for trends
- Mock data is sufficient for current needs

---

## 📝 Notes

- All infrastructure is ready (database, hooks, components)
- Integration is straightforward (1-2 hours)
- No changes needed to UI/UX (just data source)
- Can be done incrementally (one page at a time)

---

**Last Updated:** November 9, 2025
**Status:** Ready to integrate when data stabilizes

