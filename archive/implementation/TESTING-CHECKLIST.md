# ✅ Testing Checklist

Comprehensive testing checklist for the Zomato Drive Dashboard implementation.

---

## 🎯 Testing Strategy

**Approach:** Test each phase incrementally before moving to the next  
**Tools:** Manual testing + Supabase SQL queries  
**Environment:** Development (local) → Staging → Production

---

## 📋 Phase 1: Foundation Testing

### **Database Setup**

- [ ] **Supabase project created**
  - [ ] Project accessible at dashboard
  - [ ] API keys copied and saved
  - [ ] Region set to ap-south-1 (Mumbai)

- [ ] **Tables created successfully**
  - [ ] `restaurants` table exists with correct schema
  - [ ] `drives` table exists with correct schema
  - [ ] `drive_data` table exists with correct schema
  - [ ] `conversion_tracking` table exists with correct schema
  - [ ] All indexes created

- [ ] **Foreign keys working**
  ```sql
  -- Test: Try to insert drive_data with non-existent res_id (should fail)
  INSERT INTO drive_data (res_id, drive_id) VALUES ('INVALID', 1);
  -- Expected: Error 23503 (foreign key violation)
  ```

- [ ] **Sample data loaded**
  - [ ] At least 20 restaurants imported
  - [ ] At least 1 drive created
  - [ ] Drive data linked to restaurants
  - [ ] No orphaned records

### **Supabase Client**

- [ ] **Environment variables set**
  - [ ] `.env.local` file created
  - [ ] `VITE_SUPABASE_URL` set correctly
  - [ ] `VITE_SUPABASE_ANON_KEY` set correctly
  - [ ] Variables accessible in code

- [ ] **Client connection working**
  ```typescript
  // Test in browser console
  import { supabase } from './src/lib/supabase'
  const { data, error } = await supabase.from('restaurants').select('*').limit(1)
  console.log(data) // Should return 1 restaurant
  ```

### **UI Integration**

- [ ] **KAM Hub loads real data**
  - [ ] Restaurant list displays
  - [ ] Restaurant names correct
  - [ ] Localities showing
  - [ ] No console errors

- [ ] **Restaurant Detail loads**
  - [ ] Click restaurant from KAM Hub
  - [ ] Detail page loads
  - [ ] Restaurant info displays
  - [ ] Drive data shows

- [ ] **Loading states work**
  - [ ] Spinner shows while loading
  - [ ] Content appears after load
  - [ ] No flash of empty state

- [ ] **Error handling works**
  - [ ] Disconnect internet
  - [ ] Error message displays
  - [ ] Reconnect internet
  - [ ] Data loads successfully

---

## 📋 Phase 2: Core Features Testing

### **Data Sync**

- [ ] **n8n workflow configured**
  - [ ] Google Sheets API connected
  - [ ] Supabase credentials added
  - [ ] Workflow executes without errors

- [ ] **Manual sync test**
  - [ ] Click "Execute Workflow" in n8n
  - [ ] Check execution log (should be green)
  - [ ] Verify data in Supabase matches Google Sheets
  - [ ] Check row counts match

- [ ] **Scheduled sync test**
  - [ ] Wait for scheduled time (or change to 1 minute for testing)
  - [ ] Verify workflow executed automatically
  - [ ] Check Slack notification received

- [ ] **Data transformation**
  - [ ] Boolean fields converted correctly (Yes → true)
  - [ ] Numeric fields parsed correctly
  - [ ] Null values handled properly
  - [ ] Whitespace trimmed

### **Mark as Approached**

- [ ] **Button appears**
  - [ ] Go to Restaurant Detail page
  - [ ] "Mark as Approached" button visible
  - [ ] Button disabled if already approached

- [ ] **Action works**
  - [ ] Click "Mark as Approached"
  - [ ] Toast notification appears
  - [ ] Button changes to "Already Approached"
  - [ ] Status pill updates to "Approached"

- [ ] **Database updated**
  ```sql
  SELECT approached FROM drive_data WHERE res_id = 'TEST_ID';
  -- Should return TRUE
  ```

- [ ] **Tracking logged**
  ```sql
  SELECT * FROM conversion_tracking 
  WHERE res_id = 'TEST_ID' AND action_type = 'approached';
  -- Should return 1 row
  ```

### **Mark as Converted**

- [ ] **Dialog appears**
  - [ ] Click "Mark as Converted"
  - [ ] Dialog opens
  - [ ] Suggested discount pre-filled

- [ ] **Conversion works**
  - [ ] Enter discount code
  - [ ] Add notes (optional)
  - [ ] Click "Confirm Conversion"
  - [ ] Success toast appears
  - [ ] Dialog closes

- [ ] **Database updated**
  ```sql
  SELECT converted_stepper, approached FROM drive_data WHERE res_id = 'TEST_ID';
  -- Both should be TRUE
  ```

- [ ] **Tracking logged**
  ```sql
  SELECT * FROM conversion_tracking 
  WHERE res_id = 'TEST_ID' AND action_type = 'converted';
  -- Should return 1 row with discount_applied
  ```

### **Editable Discounts**

- [ ] **Edit mode activates**
  - [ ] Click pencil icon next to discount
  - [ ] Input field appears
  - [ ] Current value shown

- [ ] **Save works**
  - [ ] Change discount value
  - [ ] Click checkmark
  - [ ] Value updates in UI
  - [ ] Database updated

- [ ] **Cancel works**
  - [ ] Click pencil icon
  - [ ] Change value
  - [ ] Click X
  - [ ] Original value restored

### **Multi-Drive View**

- [ ] **Multi-drive restaurants identified**
  ```sql
  SELECT r.res_id, r.res_name, COUNT(dd.drive_id) as drive_count
  FROM restaurants r
  JOIN drive_data dd ON r.res_id = dd.res_id
  GROUP BY r.res_id, r.res_name
  HAVING COUNT(dd.drive_id) > 1;
  ```

- [ ] **Badge shows on KAM Hub**
  - [ ] Multi-drive restaurants have "X Drives" badge
  - [ ] Badge shows correct count

- [ ] **All drives show on detail page**
  - [ ] Click multi-drive restaurant
  - [ ] All drives displayed
  - [ ] Each drive has separate card
  - [ ] Each drive has own status

---

## 📋 Phase 3: Analytics Testing

### **KAM Stats**

- [ ] **Stats calculate correctly**
  - [ ] Total restaurants matches database count
  - [ ] Approached count correct
  - [ ] Converted count correct
  - [ ] Conversion rate = (converted / total) * 100

- [ ] **Stats update in real-time**
  - [ ] Mark restaurant as approached
  - [ ] Go back to KAM Hub
  - [ ] Approached count increased by 1

### **Conversion Trend Chart**

- [ ] **Chart displays**
  - [ ] Go to KAM Analytics page
  - [ ] Conversion trend chart visible
  - [ ] X-axis shows dates
  - [ ] Y-axis shows conversion count

- [ ] **Data accurate**
  - [ ] Compare chart data with database
  ```sql
  SELECT DATE(action_date) as date, COUNT(*) as conversions
  FROM conversion_tracking
  WHERE kam_name = 'Anudeep Pawar' AND action_type = 'converted'
  GROUP BY DATE(action_date)
  ORDER BY date;
  ```

- [ ] **Chart interactive**
  - [ ] Hover over data points
  - [ ] Tooltip shows date and count
  - [ ] Chart responsive on mobile

### **Drive Distribution Chart**

- [ ] **Pie chart displays**
  - [ ] Chart visible on KAM Analytics
  - [ ] Segments colored differently
  - [ ] Legend shows drive types

- [ ] **Data accurate**
  ```sql
  SELECT d.drive_type, COUNT(*) as count
  FROM conversion_tracking ct
  JOIN drives d ON ct.drive_id = d.id
  WHERE ct.kam_name = 'Anudeep Pawar' AND ct.action_type = 'converted'
  GROUP BY d.drive_type;
  ```

### **Priority Scoring**

- [ ] **Algorithm works**
  - [ ] Run priority score update script
  - [ ] Check scores in database
  ```sql
  SELECT res_id, priority_score FROM drive_data ORDER BY priority_score DESC LIMIT 10;
  ```

- [ ] **Priority list displays**
  - [ ] Top 10 restaurants shown
  - [ ] Sorted by priority score (highest first)
  - [ ] Scores displayed correctly

- [ ] **Scores make sense**
  - [ ] High OV restaurants have high scores
  - [ ] Not approached restaurants have high scores
  - [ ] Converted restaurants have low scores

### **Zonal Head Dashboard**

- [ ] **Team stats load**
  - [ ] Go to Zonal Head View
  - [ ] All KAMs listed
  - [ ] Stats shown for each KAM

- [ ] **Leaderboard sorted**
  - [ ] KAMs sorted by conversion rate
  - [ ] Top performer at #1
  - [ ] Conversion rates correct

---

## 📋 Phase 4: Advanced Features Testing

### **AI Prioritization**

- [ ] **OpenAI API connected**
  - [ ] API key configured
  - [ ] Test API call works
  - [ ] Response parsed correctly

- [ ] **AI insights display**
  - [ ] Click "Get AI Recommendation"
  - [ ] Loading state shows
  - [ ] AI score displays (0-100)
  - [ ] Reasoning text shows
  - [ ] Recommended action shows

- [ ] **n8n AI workflow**
  - [ ] Workflow executes daily
  - [ ] All restaurants scored
  - [ ] Scores saved to database

### **Email Summaries**

- [ ] **Email template renders**
  - [ ] HTML template valid
  - [ ] Variables replaced correctly
  - [ ] Styling displays properly

- [ ] **n8n email workflow**
  - [ ] Workflow executes at 7 AM
  - [ ] Email sent to all KAMs
  - [ ] Content accurate
  - [ ] Links work

- [ ] **Email received**
  - [ ] Check inbox
  - [ ] Email from correct sender
  - [ ] Subject line correct
  - [ ] Content displays properly
  - [ ] Dashboard link works

### **Slack Notifications**

- [ ] **Slack app configured**
  - [ ] Bot added to workspace
  - [ ] Channel created (#drive-updates)
  - [ ] Webhook URL working

- [ ] **Conversion notification**
  - [ ] Mark restaurant as converted
  - [ ] Slack message received
  - [ ] Message format correct
  - [ ] KAM name, restaurant name, discount shown

- [ ] **Sync notification**
  - [ ] n8n sync completes
  - [ ] Slack message received
  - [ ] Row count shown

### **Incentive Tracker**

- [ ] **Incentive rules created**
  ```sql
  SELECT * FROM incentive_rules;
  -- Should return 3 tiers
  ```

- [ ] **Calculation correct**
  - [ ] Test with 25 conversions → Tier 1 (₹2,500)
  - [ ] Test with 75 conversions → Tier 2 (₹11,250 + ₹2,000)
  - [ ] Test with 150 conversions → Tier 3 (₹30,000 + ₹5,000)

- [ ] **Tracker displays**
  - [ ] Go to KAM Hub
  - [ ] Incentive tracker card visible
  - [ ] Current tier shown
  - [ ] Conversions count correct
  - [ ] Total incentive calculated correctly

### **Bulk Actions**

- [ ] **Selection works**
  - [ ] Checkboxes appear on restaurant cards
  - [ ] Click checkbox to select
  - [ ] Multiple selection works
  - [ ] Selected count shows

- [ ] **Bulk action bar appears**
  - [ ] Select 1+ restaurants
  - [ ] Action bar appears at bottom
  - [ ] Selected count correct

- [ ] **Bulk mark approached**
  - [ ] Select 5 restaurants
  - [ ] Click "Mark as Approached"
  - [ ] All 5 updated in database
  - [ ] Success toast shows

---

## 🔍 Cross-Browser Testing

- [ ] **Chrome** (latest)
  - [ ] All features work
  - [ ] No console errors
  - [ ] UI renders correctly

- [ ] **Firefox** (latest)
  - [ ] All features work
  - [ ] No console errors
  - [ ] UI renders correctly

- [ ] **Safari** (latest)
  - [ ] All features work
  - [ ] No console errors
  - [ ] UI renders correctly

- [ ] **Edge** (latest)
  - [ ] All features work
  - [ ] No console errors
  - [ ] UI renders correctly

---

## 📱 Mobile Testing

- [ ] **Responsive design**
  - [ ] Test on iPhone (Safari)
  - [ ] Test on Android (Chrome)
  - [ ] All screens responsive
  - [ ] Touch interactions work

- [ ] **Performance**
  - [ ] Pages load in <3 seconds
  - [ ] Smooth scrolling
  - [ ] No layout shifts

---

## 🚀 Performance Testing

- [ ] **Page load times**
  - [ ] Main Dashboard: <2s
  - [ ] KAM Hub: <2s
  - [ ] Restaurant Detail: <1.5s
  - [ ] KAM Analytics: <2.5s

- [ ] **Database queries**
  - [ ] All queries <500ms
  - [ ] Indexes used correctly
  - [ ] No N+1 queries

- [ ] **Bundle size**
  - [ ] Run `npm run build`
  - [ ] Check bundle size <1MB
  - [ ] Code splitting working

---

## 🔒 Security Testing

- [ ] **RLS policies** (if implemented)
  - [ ] KAMs can only see their restaurants
  - [ ] Zonal Heads can see their team
  - [ ] No unauthorized access

- [ ] **API keys secure**
  - [ ] No keys in client-side code
  - [ ] Environment variables used
  - [ ] `.env.local` in `.gitignore`

---

## ✅ Final Checklist

- [ ] All Phase 1 tests passed
- [ ] All Phase 2 tests passed
- [ ] All Phase 3 tests passed
- [ ] All Phase 4 tests passed
- [ ] Cross-browser testing complete
- [ ] Mobile testing complete
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Documentation updated
- [ ] Ready for production deployment

---

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

