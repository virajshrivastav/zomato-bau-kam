# 🚀 Sprint 0: Environment Setup & Prerequisites

**Duration:** 3-5 days  
**Goal:** Set up all development tools, accounts, and infrastructure before coding begins.

---

## 🎯 Sprint Objectives

By the end of this sprint, you will have:

✅ All required accounts created and configured  
✅ Development environment ready  
✅ Database infrastructure provisioned  
✅ Automation platform (n8n) running  
✅ Sample data loaded for testing  
✅ Team access configured  

---

## 📋 Task Breakdown

### Task 1: Create Supabase Project (Priority: CRITICAL)

**Estimated Time:** 30 minutes

**Steps:**

1. **Sign up for Supabase**
   - Go to [supabase.com](https://supabase.com)
   - Create account (use work email)
   - Verify email

2. **Create New Project**
   - Click "New Project"
   - Name: `zomato-drive-dashboard`
   - Database Password: Generate strong password (save in password manager)
   - Region: Choose closest to your location (e.g., Mumbai for India)
   - Pricing Plan: Start with Free tier

3. **Save Credentials**
   ```
   Project URL: https://xxxxx.supabase.co
   Anon Key: eyJhbGc...
   Service Role Key: eyJhbGc... (keep secret!)
   Database Password: [your-password]
   ```

4. **Enable Required Extensions**
   - Go to Database → Extensions
   - Enable: `pg_stat_statements` (for performance monitoring)

**Deliverable:** Supabase project URL and API keys saved securely

---

### Task 2: Set Up n8n (Priority: CRITICAL)

**Estimated Time:** 1-2 hours

**Option A: n8n Cloud (Recommended for Beginners)**

1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up for free trial
3. Create workspace: `zomato-automation`
4. Note your instance URL: `https://xxxxx.app.n8n.cloud`

**Option B: Self-Hosted (For Advanced Users)**

```bash
# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Access at http://localhost:5678
```

**Initial Configuration:**

1. Set up admin account
2. Configure timezone (Asia/Kolkata)
3. Enable webhook URL (for API triggers)

**Deliverable:** n8n instance running and accessible

---

### Task 3: Google Sheets API Setup (Priority: CRITICAL)

**Estimated Time:** 45 minutes

**Steps:**

1. **Enable Google Sheets API**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project: `zomato-drive-sync`
   - Enable "Google Sheets API"
   - Enable "Google Drive API"

2. **Create Service Account**
   - Go to IAM & Admin → Service Accounts
   - Create service account: `n8n-sheets-reader`
   - Grant role: "Viewer"
   - Create JSON key → Download

3. **Share Google Sheets**
   - Open your drive sheets
   - Share with service account email (e.g., `n8n-sheets-reader@xxxxx.iam.gserviceaccount.com`)
   - Grant "Viewer" access

4. **Add Credentials to n8n**
   - In n8n: Credentials → Add Credential
   - Type: "Google Sheets API"
   - Upload JSON key file

**Deliverable:** n8n can read your Google Sheets

---

### Task 4: Development Environment Setup (Priority: HIGH)

**Estimated Time:** 1 hour

**Prerequisites:**
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

**Steps:**

1. **Install Node.js**
   ```bash
   # Check version
   node --version  # Should be 18+
   npm --version
   ```

2. **Install pnpm (faster than npm)**
   ```bash
   npm install -g pnpm
   ```

3. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd zomato-dashboard
   ```

4. **Install VS Code Extensions**
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - PostgreSQL (for SQL syntax)

**Deliverable:** Development environment ready

---

### Task 5: Create Database Schema (Priority: CRITICAL)

**Estimated Time:** 1 hour

**Steps:**

1. **Open Supabase SQL Editor**
   - Go to your Supabase project
   - Click "SQL Editor" in sidebar

2. **Run Schema Creation Script**
   - Copy SQL from `docs/02-DATABASE-SCHEMA.md`
   - Paste into SQL Editor
   - Execute in this order:
     1. Create `restaurants` table
     2. Create `drives` table
     3. Create `drive_data` table
     4. Create `conversion_tracking` table
     5. Create indexes
     6. Create materialized view

3. **Verify Tables Created**
   - Go to Table Editor
   - Should see 4 tables

4. **Load Sample Data**
   ```sql
   -- Insert test restaurant
   INSERT INTO restaurants (res_id, res_name, kam_name, kam_email, sept_ov)
   VALUES ('TEST001', 'Test Restaurant', 'Your Name', 'your.email@zomato.com', 100);
   
   -- Insert test drive
   INSERT INTO drives (drive_name, drive_type, city)
   VALUES ('Test Drive', 'discount', 'Pune');
   
   -- Verify
   SELECT * FROM restaurants;
   SELECT * FROM drives;
   ```

**Deliverable:** Database schema created with sample data

---

### Task 6: Configure Environment Variables (Priority: HIGH)

**Estimated Time:** 15 minutes

**Steps:**

1. **Create `.env.local` file**
   ```bash
   cd zomato-dashboard
   touch .env.local
   ```

2. **Add Configuration**
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   
   # n8n
   N8N_WEBHOOK_URL=https://xxxxx.app.n8n.cloud/webhook/
   
   # OpenAI (for AI features - optional for now)
   OPENAI_API_KEY=sk-...
   
   # App Config
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Add to `.gitignore`**
   ```bash
   echo ".env.local" >> .gitignore
   ```

**Deliverable:** Environment variables configured

---

### Task 7: Test Data Migration (Priority: MEDIUM)

**Estimated Time:** 2 hours

**Steps:**

1. **Prepare Sample CSV**
   - Use the provided `Special 35 __ Shiv - Sheet10.csv`
   - Verify it has all required columns

2. **Create n8n Test Workflow**
   - Create new workflow: "Test CSV Import"
   - Add nodes:
     1. Manual Trigger
     2. Read Binary File (CSV)
     3. Split Out (to process rows)
     4. Supabase Insert

3. **Map CSV Columns to Database**
   ```javascript
   // In n8n Function node
   return {
     res_id: $json.res_id,
     res_name: $json.res_name,
     kam_name: $json.am_name,
     kam_email: $json['AM Email'],
     cuisine: $json.Cuisine,
     locality: $json.Locality,
     sept_ov: parseInt($json['Sept OV']) || 0
   };
   ```

4. **Run Test Import**
   - Execute workflow
   - Check Supabase Table Editor
   - Verify 20 restaurants imported

**Deliverable:** Sample data successfully imported to database

---

### Task 8: Set Up Version Control (Priority: MEDIUM)

**Estimated Time:** 30 minutes

**Steps:**

1. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Project setup"
   ```

2. **Create GitHub Repository**
   - Go to GitHub
   - Create new private repository: `zomato-drive-dashboard`
   - Push code:
     ```bash
     git remote add origin <your-repo-url>
     git push -u origin main
     ```

3. **Set Up Branch Protection**
   - Protect `main` branch
   - Require pull request reviews

**Deliverable:** Code in version control

---

### Task 9: Team Access Configuration (Priority: LOW)

**Estimated Time:** 30 minutes

**Steps:**

1. **Supabase Access**
   - Go to Settings → Team
   - Invite team members (if applicable)

2. **n8n Access**
   - Share instance URL with team
   - Create separate user accounts (if using n8n Cloud)

3. **GitHub Access**
   - Add collaborators to repository

**Deliverable:** Team can access all tools

---

### Task 10: Documentation & Handoff (Priority: MEDIUM)

**Estimated Time:** 1 hour

**Steps:**

1. **Create Setup Guide**
   - Document all credentials (in secure location)
   - Write quick start guide for team

2. **Create Architecture Diagram**
   - Use draw.io or Excalidraw
   - Show: Google Sheets → n8n → Supabase → Next.js

3. **Record Demo Video** (Optional)
   - Screen record the setup process
   - Share with team

**Deliverable:** Team can replicate setup

---

## ✅ Sprint Completion Checklist

Before moving to Sprint 1, verify:

- [ ] Supabase project created and accessible
- [ ] Database schema created (4 tables + indexes)
- [ ] Sample data loaded (at least 10 restaurants)
- [ ] n8n instance running
- [ ] Google Sheets API connected to n8n
- [ ] Test CSV import successful
- [ ] Environment variables configured
- [ ] Git repository initialized
- [ ] All credentials documented securely
- [ ] Team has access to all tools

---

## 🚨 Common Issues & Solutions

### Issue 1: Supabase Connection Fails

**Symptoms:** Can't connect to database from n8n

**Solution:**
- Check if Supabase project is paused (free tier auto-pauses after inactivity)
- Verify API keys are correct
- Check network/firewall settings

### Issue 2: Google Sheets API 403 Error

**Symptoms:** n8n can't read sheets

**Solution:**
- Verify service account email has access to sheet
- Check if Google Sheets API is enabled in Cloud Console
- Regenerate service account key

### Issue 3: n8n Workflow Fails

**Symptoms:** Workflow execution errors

**Solution:**
- Check n8n logs for detailed error
- Verify all credentials are configured
- Test each node individually

---

## 📊 Success Metrics

- **Setup Time:** <1 day for experienced developers, <3 days for beginners
- **Data Import Success Rate:** 100% of CSV rows imported correctly
- **Team Onboarding:** All team members can access tools within 1 hour

---

## 🎓 Learning Resources

- [Supabase Documentation](https://supabase.com/docs)
- [n8n Documentation](https://docs.n8n.io)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com)

---

**Next Sprint:** [Sprint 1 - Foundation (Data Pipeline)](SPRINT-01-FOUNDATION.md)

