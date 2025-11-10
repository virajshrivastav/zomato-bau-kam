# 🚀 Quick Start Guide

Get started with implementing the Zomato Drive Dashboard backend in 30 minutes.

---

## ⚡ Prerequisites

Before you begin, ensure you have:

- [ ] Node.js 18+ installed
- [ ] npm or pnpm installed
- [ ] Git installed
- [ ] Google account (for Sheets API)
- [ ] Email account (for Supabase)

---

## 📋 30-Minute Setup

### **Step 1: Create Supabase Project** (10 minutes)

1. **Sign up for Supabase**
   - Go to https://supabase.com
   - Click "Start your project"
   - Sign in with GitHub

2. **Create new project**
   - Organization: "Zomato"
   - Project name: `zomato-drive-dashboard`
   - Database password: (save this!)
   - Region: `ap-south-1` (Mumbai)
   - Click "Create new project"
   - Wait 2-3 minutes for provisioning

3. **Get API credentials**
   - Go to Project Settings → API
   - Copy `Project URL`
   - Copy `anon public` key
   - Save both securely

---

### **Step 2: Set Up Database** (10 minutes)

1. **Open SQL Editor**
   - In Supabase Dashboard, click "SQL Editor"
   - Click "New query"

2. **Create tables**
   - Copy SQL from `PHASE-1-FOUNDATION.md` Task 1.2
   - Paste into SQL Editor
   - Click "Run"
   - Verify: Go to Table Editor, should see 4 tables

3. **Create sample drive**
   ```sql
   INSERT INTO drives (drive_name, drive_type, city, start_date, end_date, status)
   VALUES ('Special 35', 'discount', 'Pune', '2024-11-01', '2024-11-30', 'active');
   ```

4. **Import sample data**
   - Go to Table Editor → `restaurants`
   - Click "Insert" → "Import data from CSV"
   - Upload `/zomato/Special 35 __ Shiv - Sheet10.csv`
   - Map columns
   - Click "Import"

---

### **Step 3: Configure React App** (10 minutes)

1. **Install Supabase client**
   ```bash
   cd d:\Projects\WARP\zomato-loveable
   npm install @supabase/supabase-js date-fns
   ```

2. **Create environment file**
   - Create `.env.local` in project root
   ```bash
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```
   - Replace with your actual values

3. **Create Supabase client**
   - Create file: `src/lib/supabase.ts`
   - Copy code from `UI-INTEGRATION-GUIDE.md` Step 2

4. **Create types**
   - Create file: `src/types/database.ts`
   - Copy code from `UI-INTEGRATION-GUIDE.md` Step 3

5. **Test connection**
   ```bash
   npm run dev
   ```
   - Open browser console
   - Run:
   ```javascript
   import { supabase } from './src/lib/supabase'
   const { data } = await supabase.from('restaurants').select('*').limit(1)
   console.log(data)
   ```
   - Should see 1 restaurant

---

## ✅ Verification

After 30 minutes, you should have:

- ✅ Supabase project running
- ✅ 4 database tables created
- ✅ Sample data loaded
- ✅ React app connected to Supabase
- ✅ Test query working

---

## 🎯 Next Steps

### **Day 1-2: Complete Phase 1**
- Follow `PHASE-1-FOUNDATION.md`
- Connect KAM Hub to real data
- Connect Restaurant Detail to real data
- Test all screens

### **Day 3-5: Complete Phase 2**
- Follow `PHASE-2-CORE-FEATURES.md`
- Set up n8n for data sync
- Implement conversion actions
- Add multi-drive view

### **Day 6-8: Complete Phase 3**
- Follow `PHASE-3-ANALYTICS.md`
- Build analytics charts
- Implement priority scoring
- Build Zonal Head dashboard

### **Day 9-12: Complete Phase 4**
- Follow `PHASE-4-ADVANCED.md`
- Add AI prioritization
- Set up email summaries
- Configure Slack notifications

---

## 📚 Documentation Index

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `README.md` | Overview and strategy | Start here |
| `PHASE-1-FOUNDATION.md` | Database and basic API | Week 1 |
| `PHASE-2-CORE-FEATURES.md` | Core KAM workflows | Week 2 |
| `PHASE-3-ANALYTICS.md` | Charts and insights | Week 2-3 |
| `PHASE-4-ADVANCED.md` | AI and automation | Week 3-4 |
| `API-ENDPOINTS.md` | API reference | As needed |
| `DATABASE-MIGRATION.md` | Data migration guide | Week 1-2 |
| `UI-INTEGRATION-GUIDE.md` | Connect UI to backend | Week 1 |
| `TESTING-CHECKLIST.md` | Testing guide | Every phase |

---

## 🆘 Troubleshooting

### **Issue: Can't connect to Supabase**

**Solution:**
1. Check `.env.local` file exists
2. Verify environment variables are correct
3. Restart dev server: `npm run dev`
4. Check browser console for errors

### **Issue: No data showing in UI**

**Solution:**
1. Check database has data:
   ```sql
   SELECT COUNT(*) FROM restaurants;
   ```
2. Check Supabase query in browser console
3. Check for CORS errors
4. Verify API keys are correct

### **Issue: Import CSV fails**

**Solution:**
1. Check CSV format (UTF-8 encoding)
2. Remove empty rows
3. Ensure column names match exactly
4. Try importing smaller batch first

### **Issue: Foreign key violation**

**Solution:**
1. Ensure `drives` table has records first
2. Check `res_id` exists in `restaurants` before adding to `drive_data`
3. Use correct data types (string vs number)

---

## 💡 Pro Tips

1. **Use Supabase Studio**
   - Visual query builder
   - Easy data browsing
   - Real-time updates

2. **Enable RLS later**
   - Start without Row Level Security
   - Add RLS in Phase 4
   - Easier to debug initially

3. **Test incrementally**
   - Test each feature before moving on
   - Use `TESTING-CHECKLIST.md`
   - Don't skip validation queries

4. **Keep backups**
   - Export data regularly
   - Use version control (Git)
   - Document changes

5. **Monitor usage**
   - Check Supabase dashboard
   - Watch for quota limits
   - Optimize queries if slow

---

## 📞 Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **React Query Docs:** https://tanstack.com/query/latest
- **n8n Docs:** https://docs.n8n.io
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## 🎉 Success Criteria

You'll know you're successful when:

1. ✅ KAM Hub shows real restaurants from database
2. ✅ Clicking a restaurant shows its details
3. ✅ "Mark as Approached" button works
4. ✅ Stats update in real-time
5. ✅ No console errors
6. ✅ Data persists after page refresh

---

## 🚀 Ready to Start?

1. **Read:** `README.md` (this file)
2. **Follow:** `PHASE-1-FOUNDATION.md`
3. **Test:** Use `TESTING-CHECKLIST.md`
4. **Repeat:** For each phase

**Estimated Total Time:** 3-4 weeks  
**Difficulty:** Intermediate  
**Reward:** Production-ready dashboard! 🎉

---

**Let's build something amazing!** 💪

