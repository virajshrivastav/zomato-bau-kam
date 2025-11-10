# 📁 Archived Documentation

**Status:** Reference Only - Do Not Follow for Implementation  
**Date Archived:** November 9, 2025  
**Reason:** Technology stack mismatch and outdated approach

---

## ⚠️ Important Notice

**DO NOT use these documents for step-by-step implementation.**

These documents were created for a **Next.js-based** implementation approach, but the current project uses **React + Vite**.

---

## 📚 What's Archived Here

### 1. `/archive/zomato/` - Original Comprehensive Documentation

**Created for:** Next.js 14 full-stack application  
**Includes:**
- 6 detailed documentation files (00-GETTING-STARTED.md through 06-DEPLOYMENT.md)
- 6 sprint plans (SPRINT-00-SETUP.md through SPRINT-05-ADVANCED.md)
- Sample CSV data
- Complete project context and requirements

**Why archived:**
- Assumes Next.js framework (we use Vite)
- Assumes building from scratch (UI already built)
- Timeline doesn't match current state (4-6 weeks vs 3 weeks)

**Still useful for:**
- Understanding project requirements
- Database schema concepts
- Business logic reference
- n8n workflow ideas
- Deployment concepts (adapt for Vite)

---

### 2. `/archive/implementation/` - Alternative Implementation Plans

**Created for:** Multiple implementation approaches  
**Includes:**
- Phase-by-Phase approach (4 phases)
- Hybrid approach (16-day sprint)
- Fork Atomic CRM approach
- Various reference documents

**Why archived:**
- Multiple competing approaches (confusing)
- Some assume Next.js
- Not aligned with current UI state
- Overlaps with zomato docs

**Still useful for:**
- Database schema SQL
- API endpoint patterns
- Testing checklist concepts
- Quick reference code snippets

---

## ✅ What to Use Instead

**Use the NEW consolidated guides in the project root:**

1. **[START-HERE.md](../START-HERE.md)** - Master implementation guide
2. **[BACKEND-SETUP.md](../BACKEND-SETUP.md)** - Database setup
3. **[CONNECTING-UI-TO-BACKEND.md](../CONNECTING-UI-TO-BACKEND.md)** - API integration
4. **[COMPONENT-DATA-MAPPING.md](../COMPONENT-DATA-MAPPING.md)** - Component updates
5. **[TESTING-GUIDE.md](../TESTING-GUIDE.md)** - Testing checklist

These guides:
- ✅ Match your current tech stack (React + Vite)
- ✅ Acknowledge UI is already built
- ✅ Provide single recommended path
- ✅ Focus on backend integration
- ✅ Are step-by-step and clear

---

## 🔍 How to Use Archived Docs

### ✅ DO Use For:
- **Conceptual understanding** of the project
- **Database schema reference** (SQL is framework-agnostic)
- **Business logic ideas** (conversion tracking, priority scoring)
- **n8n workflow patterns** (Google Sheets sync)
- **Understanding requirements** (user personas, features)

### ❌ DON'T Use For:
- **Step-by-step setup instructions** (use new guides)
- **Framework-specific code** (Next.js vs Vite differences)
- **Timeline planning** (outdated estimates)
- **Component structure** (UI already built differently)
- **Deployment steps** (Next.js specific)

---

## 📖 Archived Documentation Map

### `/archive/zomato/docs/`
- `00-GETTING-STARTED.md` - Project overview (Next.js focused)
- `01-PROJECT-CONTEXT.md` - **USEFUL:** Requirements, user personas
- `02-DATABASE-SCHEMA.md` - **USEFUL:** Database design concepts
- `03-API-SPECIFICATION.md` - **USEFUL:** API patterns (adapt for Supabase)
- `04-N8N-WORKFLOWS.md` - **USEFUL:** Automation workflow ideas
- `05-UI-COMPONENTS.md` - Outdated (UI already built)
- `06-DEPLOYMENT.md` - Outdated (Next.js/Vercel specific)

### `/archive/zomato/sprints/`
- `SPRINT-00-SETUP.md` - Environment setup (Next.js)
- `SPRINT-01-FOUNDATION.md` - **USEFUL:** Data pipeline concepts
- `SPRINT-02-BASIC-UI.md` - Outdated (UI built)
- `SPRINT-03-FEATURES.md` - **USEFUL:** Feature implementation ideas
- `SPRINT-04-ANALYTICS.md` - **USEFUL:** Analytics patterns
- `SPRINT-05-ADVANCED.md` - **USEFUL:** AI and automation ideas

### `/archive/implementation/`
- `README.md` - Overview of multiple approaches
- `INDEX.md` - Documentation index
- `PHASE-1-FOUNDATION.md` - **USEFUL:** Database setup SQL
- `PHASE-2-CORE-FEATURES.md` - **USEFUL:** n8n patterns
- `PHASE-3-ANALYTICS.md` - **USEFUL:** Analytics queries
- `PHASE-4-ADVANCED.md` - **USEFUL:** AI integration ideas
- `API-ENDPOINTS.md` - **USEFUL:** Supabase query patterns
- `DATABASE-MIGRATION.md` - **USEFUL:** Data migration concepts
- `HYBRID-APPROACH.md` - Alternative approach (reference)
- `APPROACH-COMPARISON.md` - Decision analysis (reference)

---

## 🎯 Quick Reference Extraction

### Useful SQL from Archived Docs

**Database Schema:**
```
See: /archive/implementation/PHASE-1-FOUNDATION.md
Lines 69-160: Complete table creation SQL
```

**Database Functions:**
```
See: /archive/implementation/PHASE-3-ANALYTICS.md
Lines 50-120: Aggregation functions
```

**n8n Workflows:**
```
See: /archive/zomato/docs/04-N8N-WORKFLOWS.md
Complete workflow configurations
```

### Useful Concepts from Archived Docs

**Priority Scoring Algorithm:**
```
See: /archive/implementation/PHASE-3-ANALYTICS.md
Lines 180-250: Multi-factor scoring logic
```

**Conversion Tracking:**
```
See: /archive/zomato/docs/01-PROJECT-CONTEXT.md
Lines 150-200: Business logic for status flow
```

**AI Prioritization:**
```
See: /archive/implementation/PHASE-4-ADVANCED.md
Lines 30-100: GPT-4 integration patterns
```

---

## 🔄 Migration Notes

If you need to adapt something from archived docs:

### Next.js → Vite Conversions

| Next.js Pattern | Vite Equivalent |
|-----------------|-----------------|
| `process.env.NEXT_PUBLIC_*` | `import.meta.env.VITE_*` |
| `getServerSideProps` | React Query hooks |
| `api/` routes | Supabase client calls |
| `next/image` | Regular `<img>` or `vite-imagetools` |
| `next/router` | `react-router-dom` |

### File Structure Differences

| Next.js | Vite/React |
|---------|------------|
| `pages/` | `src/pages/` |
| `public/` | `public/` (same) |
| `api/` | Not needed (Supabase) |
| `next.config.js` | `vite.config.ts` |

---

## 📞 Questions?

**"Should I read the archived docs?"**  
→ Only for conceptual understanding. Follow the new guides for implementation.

**"Can I use the SQL from archived docs?"**  
→ Yes! SQL is framework-agnostic. Copy database schemas and functions.

**"What about the n8n workflows?"**  
→ Yes! n8n workflows work the same regardless of frontend framework.

**"Can I use the API patterns?"**  
→ Adapt them. The concepts are good, but use Supabase client instead of Next.js API routes.

**"Should I follow the sprint plans?"**  
→ No. Use the new 3-week plan in START-HERE.md instead.

---

## 🎓 Learning Value

These archived docs are **excellent learning resources** for:
- Understanding the full scope of the project
- Learning database design principles
- Seeing comprehensive planning examples
- Understanding business requirements deeply
- Getting ideas for advanced features

Just don't follow them step-by-step for your current implementation.

---

**For current implementation, always refer to the root-level guides! 🚀**

