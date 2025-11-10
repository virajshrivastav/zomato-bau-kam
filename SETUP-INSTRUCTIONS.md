# 🚀 Quick Setup Instructions

## ✅ What's Already Done

1. ✅ `.env.local` file created with your Supabase credentials
2. ✅ `supabase-setup.sql` file created with complete database setup

---

## 📝 What You Need to Do Now

### **Step 1: Run the SQL Script** (5 minutes)

1. Go to your Supabase Dashboard: https://fsbwbjdnfytqigucuqbs.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase-setup.sql` from this project
5. Copy the ENTIRE contents
6. Paste into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)

**Expected Result:**
```
✅ 4 tables created
✅ 10 restaurants inserted
✅ 3 drives inserted
✅ 13 drive assignments inserted
✅ RLS policies enabled
```

You should see a verification table at the end showing:
```
drive_data    | 13
drives        | 3
restaurants   | 10
```

---

### **Step 2: Create User Accounts** (5 minutes)

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add User** (manually, one by one)
3. Create these 4 users:

| Email | Password | Auto Confirm |
|-------|----------|--------------|
| shiv.kumar@zomato.com | `zomato123` | ✅ Yes |
| amdeep.singh@zomato.com | `zomato123` | ✅ Yes |
| shrawani.patil@zomato.com | `zomato123` | ✅ Yes |
| rutuja.deshmukh@zomato.com | `zomato123` | ✅ Yes |

**Important:** Check "Auto Confirm User" to skip email verification!

---

### **Step 3: Verify Setup** (2 minutes)

1. Go to **Table Editor** in Supabase Dashboard
2. Click on `restaurants` table
3. You should see 10 restaurants
4. Click on `drives` table
5. You should see 3 drives

---

## 🎉 Once Complete

After you've done Steps 1-3 above, come back and let me know. I'll then:

1. ✅ Test the database connection from the app
2. ✅ Create API hooks for data fetching
3. ✅ Update the UI to use real data instead of mock data
4. ✅ Implement authentication
5. ✅ Add conversion tracking functionality

---

## 🆘 Troubleshooting

### Error: "relation already exists"
- **Solution:** Tables already created. Skip to Step 2.

### Error: "duplicate key value"
- **Solution:** Data already inserted. Skip to Step 2.

### Can't find SQL Editor
- **Solution:** Look for the `</>` icon in the left sidebar

### Users not showing up
- **Solution:** Make sure you checked "Auto Confirm User" when creating them

---

## 📊 What This Sets Up

### Database Tables:
- **restaurants** - 10 sample restaurants assigned to 4 KAMs
- **drives** - 3 active marketing drives
- **drive_data** - 13 restaurant-drive assignments (some restaurants in multiple drives)
- **conversion_tracking** - Empty (will be populated when KAMs mark restaurants)

### Security:
- **RLS Policies** - Each KAM sees only their own restaurants
- **Authentication** - 4 test users ready to log in

### Sample Data Distribution:
- **Shiv Kumar** - 3 restaurants (R001, R002, R009)
- **Amdeep Singh** - 3 restaurants (R003, R004, R010)
- **Shrawani Patil** - 2 restaurants (R005, R006)
- **Rutuja Deshmukh** - 2 restaurants (R007, R008)

---

**Ready?** Complete Steps 1-3 above, then let me know and we'll continue! 🚀

