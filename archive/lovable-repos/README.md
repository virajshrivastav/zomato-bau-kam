# 📦 Archived Lovable Repositories

**Last Updated:** November 9, 2025  
**Purpose:** Reference storage for original 5 Lovable repos that were integrated into main `src/` folder

---

## 📋 Original Repositories

These 6 folders in the root directory are the original Lovable repositories that were integrated:

1. **drive-focus-view/** - Screen 4: KAM Analytics
2. **drive-focus-view-new/** - Alternative version of Screen 4
3. **drive-kam-central/** - Screen 2: KAM Hub
4. **drivehub-zonal/** - Screen 5: Zonal Head View
5. **kam-action-center/** - Screen 3: Restaurant Detail
6. **zomato-drive-dash/** - Screen 1: Main Dashboard

---

## ✅ Integration Status

All 6 repositories have been **successfully integrated** into the main `src/` folder:

- ✅ Components extracted and merged
- ✅ Routes configured in `src/App.tsx`
- ✅ Styling unified with Tailwind CSS
- ✅ Dependencies consolidated in root `package.json`
- ✅ All screens accessible and functional

---

## 🗂️ Current Structure

**Active Codebase:**
```
src/
├── pages/
│   ├── MainDashboard.tsx      (from zomato-drive-dash)
│   ├── KAMHub.tsx              (from drive-kam-central)
│   ├── RestaurantDetail.tsx    (from kam-action-center)
│   ├── KAMAnalytics.tsx        (from drive-focus-view)
│   ├── ZonalHeadView.tsx       (from drivehub-zonal)
│   └── LiveSprints.tsx         (bonus screen)
└── components/
    └── [21 custom components extracted from all repos]
```

---

## 📝 Note on Archiving

**Status:** These folders remain in the root directory due to `.git` folder permission restrictions.

**Recommendation:** 
- Keep them as-is for reference
- Do NOT modify them
- All active development happens in `src/` folder
- If needed, manually delete after confirming integration is stable

---

## 🚫 Do Not Use

These folders are **reference only**. Do NOT:
- ❌ Run `npm install` in these folders
- ❌ Make changes to these folders
- ❌ Copy code from these folders (use `src/` instead)
- ❌ Deploy from these folders

---

## ✅ What to Use Instead

**For Development:** Use the main `src/` folder
**For Documentation:** See root directory docs:
- PROJECT-GOALS.md
- CURRENT-STATE.md
- IMPLEMENTATION-PLAN.md

---

**Last Integration:** November 2025  
**Integration Summary:** See `CURRENT-STATE.md` for details

