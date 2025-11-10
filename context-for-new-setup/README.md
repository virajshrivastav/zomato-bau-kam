# Zomato Drive Dashboard - Context Documentation

## What This Is

**Comprehensive technical context for the Zomato Drive Dashboard MVP.**

This folder contains 9 detailed markdown files that cover every aspect of the project:
- What it is and why it exists
- How it works technically
- How to set it up from scratch
- What's built vs. what's pending
- How to continue building

---

## Files in This Folder

| File | Purpose | Read When |
|------|---------|-----------|
| **00-START-HERE.md** | Overview and navigation guide | First time here |
| **01-PROJECT-OVERVIEW.md** | Business context, goals, status | Understanding the project |
| **02-TECHNICAL-ARCHITECTURE.md** | System design, data flow, security | Building features |
| **03-DATABASE-SCHEMA.md** | Complete schema, RLS policies | Working with database |
| **04-AUTHENTICATION-SETUP.md** | Auth flow, Google OAuth, security | Setting up auth |
| **05-COMPONENT-STRUCTURE.md** | All components with code examples | Building UI |
| **06-DATA-HOOKS-API.md** | React Query hooks, API reference | Fetching/mutating data |
| **07-CURRENT-STATUS.md** | What's done, what's pending, next steps | Planning work |
| **08-SETUP-GUIDE.md** | Step-by-step setup instructions | Getting started |

---

## Quick Start

### For New Developers

1. **Read**: `00-START-HERE.md` (overview)
2. **Read**: `01-PROJECT-OVERVIEW.md` (business context)
3. **Follow**: `08-SETUP-GUIDE.md` (get it running)
4. **Test**: Log in with test accounts and explore
5. **Read**: `07-CURRENT-STATUS.md` (what's built)

### For Continuing Development

1. **Read**: `07-CURRENT-STATUS.md` (current state)
2. **Read**: `02-TECHNICAL-ARCHITECTURE.md` (how it works)
3. **Reference**: `06-DATA-HOOKS-API.md` (data patterns)
4. **Build**: Follow existing patterns
5. **Deploy**: Use checklist in `08-SETUP-GUIDE.md`

---

## Project Summary

### What It Is
A centralized MVP dashboard for viewing and managing Google Sheets data for Zomato's restaurant partnership drives.

### Current Status
- **Completion**: ~70%
- **Production Ready**: Yes (for core workflows)
- **Recommended Next**: Google Sheets integration (2-3 days)

### Tech Stack
- React 18 + TypeScript + Vite
- Supabase (PostgreSQL + Auth)
- TanStack Query (React Query)
- shadcn/ui + Tailwind CSS
- Recharts

### Key Features
- ✅ Authentication (Email/Password + Google OAuth)
- ✅ Row Level Security (RLS)
- ✅ KAM Hub (Restaurant portfolio)
- ✅ Restaurant Detail (Conversion tracking)
- ✅ Main Dashboard (BAU Dashboard)
- ✅ Real-time search
- 📊 Analytics (UI complete, using mock data)

---

## How to Use This Documentation

### Scenario 1: "I'm new to this project"

**Goal**: Understand what it is and get it running

**Read**:
1. `00-START-HERE.md` - Overview
2. `01-PROJECT-OVERVIEW.md` - Business context
3. `08-SETUP-GUIDE.md` - Setup instructions

**Time**: 1-2 hours

---

### Scenario 2: "I need to build a new feature"

**Goal**: Understand architecture and data patterns

**Read**:
1. `07-CURRENT-STATUS.md` - What's already done
2. `02-TECHNICAL-ARCHITECTURE.md` - System design
3. `06-DATA-HOOKS-API.md` - Data fetching patterns
4. `05-COMPONENT-STRUCTURE.md` - Existing components

**Time**: 2-3 hours

---

### Scenario 3: "I need to set up authentication"

**Goal**: Configure Supabase Auth and Google OAuth

**Read**:
1. `04-AUTHENTICATION-SETUP.md` - Complete auth guide

**Time**: 1 hour (reading) + 2-3 hours (implementation)

---

### Scenario 4: "I need to work with the database"

**Goal**: Understand schema and write queries

**Read**:
1. `03-DATABASE-SCHEMA.md` - Complete schema reference

**Time**: 1 hour

---

### Scenario 5: "I need to deploy to production"

**Goal**: Deploy and configure for production

**Read**:
1. `07-CURRENT-STATUS.md` - What's ready for production
2. `08-SETUP-GUIDE.md` - Deployment checklist

**Time**: 1 hour (reading) + 2-4 hours (deployment)

---

## Key Concepts Explained

### Row Level Security (RLS)
Database-level security that filters data based on the logged-in user's email. KAMs see only their restaurants.

**Learn More**: `02-TECHNICAL-ARCHITECTURE.md` (Security section)

### React Query
Data fetching library that handles caching, loading states, and automatic refetching.

**Learn More**: `06-DATA-HOOKS-API.md`

### Protected Routes
Pages that require authentication. Unauthenticated users are redirected to login.

**Learn More**: `04-AUTHENTICATION-SETUP.md` (Protected Routes section)

### Optimistic Updates
UI updates immediately when user takes action, before server confirms. Provides instant feedback.

**Learn More**: `02-TECHNICAL-ARCHITECTURE.md` (Data Flow section)

---

## Common Questions

### Q: What's the difference between this and the main project docs?

**A**: Main project docs are scattered across multiple files with overlapping information. This context folder is:
- **Comprehensive**: All information in one place
- **Structured**: Organized by topic
- **Straightforward**: Single actionable path (no multiple options)
- **Technical**: Deep technical details with code examples

### Q: Do I need to read all files?

**A**: No. Start with `00-START-HERE.md` which guides you to relevant files based on your needs.

### Q: Is this documentation up to date?

**A**: Yes. Created on Nov 10, 2025 to reflect the current state of the project (~70% complete).

### Q: Can I use this to onboard new developers?

**A**: Yes! That's exactly what it's for. New developers should:
1. Read `00-START-HERE.md`
2. Read `01-PROJECT-OVERVIEW.md`
3. Follow `08-SETUP-GUIDE.md`
4. Explore the running app
5. Read other files as needed

### Q: What if I find outdated information?

**A**: Update the relevant markdown file and commit the change. Keep documentation in sync with code.

---

## Documentation Principles

This documentation follows these principles:

### 1. Straightforward
- Single actionable path (no multiple options)
- Clear step-by-step instructions
- No decision paralysis

### 2. Comprehensive
- Deep technical details
- Code examples for everything
- Complete reference material

### 3. Structured
- Organized by topic
- Easy to navigate
- Cross-referenced

### 4. Practical
- Focus on what's actually built
- Real code examples
- Troubleshooting guides

---

## Maintenance

### When to Update This Documentation

Update when:
- New features are added
- Architecture changes
- Database schema changes
- Authentication flow changes
- Deployment process changes

### How to Update

1. Identify which file(s) need updates
2. Edit the markdown file(s)
3. Update `07-CURRENT-STATUS.md` if completion % changes
4. Commit with clear message: "docs: update [file] for [reason]"

---

## File Size Reference

| File | Lines | Topics Covered |
|------|-------|----------------|
| 00-START-HERE.md | ~300 | Overview, navigation, quick reference |
| 01-PROJECT-OVERVIEW.md | ~300 | Business context, status, tech stack |
| 02-TECHNICAL-ARCHITECTURE.md | ~300 | System design, data flow, security |
| 03-DATABASE-SCHEMA.md | ~300 | Schema, RLS, sample data |
| 04-AUTHENTICATION-SETUP.md | ~300 | Auth flow, Google OAuth, security |
| 05-COMPONENT-STRUCTURE.md | ~300 | All components with code |
| 06-DATA-HOOKS-API.md | ~300 | React Query hooks, API reference |
| 07-CURRENT-STATUS.md | ~300 | What's done, what's pending |
| 08-SETUP-GUIDE.md | ~300 | Step-by-step setup |

**Total**: ~2,700 lines of comprehensive technical documentation

---

## Next Steps

1. **Start with**: `00-START-HERE.md`
2. **Then read**: Files relevant to your task
3. **Get coding**: Follow patterns in documentation
4. **Update docs**: When you make changes

---

## Contact

For questions or clarifications:
- Check relevant documentation file first
- Check troubleshooting sections
- Review code examples
- Test with sample data

---

## License

This documentation is part of the Zomato Drive Dashboard project.

---

**Last Updated**: November 10, 2025  
**Project Status**: ~70% complete, production-ready for core workflows  
**Recommended Next Step**: Google Sheets integration (2-3 days)

