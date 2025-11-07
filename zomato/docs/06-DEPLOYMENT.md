# 🚀 Deployment Guide

## Overview

This guide covers deploying the Zomato Drive Dashboard to production, including:
- Frontend deployment (Vercel)
- Database setup (Supabase)
- Automation workflows (n8n)
- Monitoring and maintenance

---

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings fixed
- [ ] Unit tests passing
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables documented

### Security
- [ ] API keys stored in environment variables
- [ ] Row Level Security (RLS) enabled on Supabase
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on all forms

### Performance
- [ ] Images optimized
- [ ] Database indexes created
- [ ] API responses cached where appropriate
- [ ] Code splitting implemented
- [ ] Lighthouse score > 90

---

## 🗄️ Database Deployment (Supabase)

### Step 1: Create Production Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - **Name:** `zomato-drive-dashboard-prod`
   - **Database Password:** Generate strong password (save to password manager)
   - **Region:** `ap-south-1` (Mumbai - closest to India)
   - **Pricing Plan:** Pro ($25/month recommended for production)

4. Wait for project to initialize (~2 minutes)

### Step 2: Run Database Schema

1. Open SQL Editor in Supabase dashboard
2. Copy contents from `docs/02-DATABASE-SCHEMA.md`
3. Execute all CREATE TABLE statements
4. Execute all CREATE INDEX statements
5. Execute materialized view creation
6. Verify tables created in Table Editor

### Step 3: Enable Row Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: KAMs can only see their restaurants
CREATE POLICY "KAMs see own restaurants"
ON restaurants FOR SELECT
USING (
  auth.jwt() ->> 'email' = kam_email
  OR auth.jwt() ->> 'role' IN ('zonal_head', 'admin')
);

-- Policy: KAMs can update their drive data
CREATE POLICY "KAMs update own drive data"
ON drive_data FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.res_id = drive_data.res_id
    AND restaurants.kam_email = auth.jwt() ->> 'email'
  )
);

-- Policy: Anyone can read drives
CREATE POLICY "Anyone can read drives"
ON drives FOR SELECT
USING (true);

-- Policy: KAMs can insert conversion tracking
CREATE POLICY "KAMs insert conversions"
ON conversion_tracking FOR INSERT
WITH CHECK (
  kam_name = auth.jwt() ->> 'name'
);
```

### Step 4: Set Up Authentication

1. Go to Authentication → Providers
2. Enable Email provider
3. Configure email templates:
   - **Confirm signup:** Customize with Zomato branding
   - **Reset password:** Customize template
4. Add allowed email domains: `@zomato.com`

### Step 5: Create Service Role Key

1. Go to Settings → API
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** For client-side
   - **service_role key:** For server-side (keep secret!)

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Repository

1. Initialize Git (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub:
   ```bash
   git remote add origin https://github.com/your-username/zomato-dashboard.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Step 3: Configure Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # Secret!

# OpenAI (for AI features)
OPENAI_API_KEY=sk-... # Secret!

# n8n Webhooks
N8N_WEBHOOK_URL=https://your-n8n.app.n8n.cloud/webhook
N8N_WEBHOOK_SECRET=your-secret-key # Secret!

# App Config
NEXT_PUBLIC_APP_URL=https://zomato-dashboard.vercel.app
NODE_ENV=production
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Visit your production URL: `https://zomato-dashboard.vercel.app`

### Step 5: Configure Custom Domain (Optional)

1. Go to Settings → Domains
2. Add custom domain: `drive.zomato.com`
3. Add DNS records as instructed by Vercel
4. Wait for SSL certificate to provision

---

## 🤖 n8n Deployment

### Option A: n8n Cloud (Recommended for Quick Start)

1. Go to [n8n.io](https://n8n.io)
2. Sign up for n8n Cloud
3. Choose plan: **Starter** ($20/month)
4. Create workspace

**Import Workflows:**
1. Download workflow JSON files from your dev environment
2. In n8n Cloud: Click "+" → "Import from File"
3. Upload each workflow JSON
4. Configure credentials (see below)

### Option B: Self-Hosted (Cost-Effective)

**Deploy on Railway.app:**

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from Template"
3. Search for "n8n"
4. Configure:
   - **N8N_BASIC_AUTH_USER:** admin
   - **N8N_BASIC_AUTH_PASSWORD:** strong-password
   - **N8N_HOST:** your-n8n.railway.app
   - **WEBHOOK_URL:** https://your-n8n.railway.app/

5. Deploy and wait for service to start

**Alternative: Docker on VPS**

```bash
# On your VPS (Ubuntu)
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=your-password \
  -e WEBHOOK_URL=https://your-domain.com/ \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Configure n8n Credentials

1. **Google Sheets:**
   - Go to Credentials → Add Credential → Google Sheets API
   - Upload service account JSON
   - Test connection

2. **Supabase:**
   - Add Credential → HTTP Header Auth
   - Header: `apikey`
   - Value: Your Supabase service role key

3. **OpenAI:**
   - Add Credential → OpenAI
   - API Key: Your OpenAI key

4. **Slack:**
   - Add Credential → Slack OAuth2
   - Follow OAuth flow
   - Grant permissions: `chat:write`

5. **Email (Gmail):**
   - Add Credential → Gmail OAuth2
   - Authorize with Google account

### Activate Workflows

1. Import all 7 workflows (see `docs/04-N8N-WORKFLOWS.md`)
2. Update credentials in each workflow
3. Test each workflow manually
4. Activate workflows (toggle switch)

---

## 📊 Monitoring & Observability

### Vercel Analytics

1. Go to your Vercel project
2. Click "Analytics" tab
3. Enable Vercel Analytics (free tier available)
4. View real-time traffic, performance metrics

### Sentry Error Tracking

1. Sign up at [sentry.io](https://sentry.io)
2. Create new project: "Zomato Dashboard"
3. Install Sentry:
   ```bash
   npm install @sentry/nextjs
   ```

4. Initialize Sentry:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

5. Add to `next.config.js`:
   ```javascript
   const { withSentryConfig } = require('@sentry/nextjs');
   
   module.exports = withSentryConfig(
     {
       // Your Next.js config
     },
     {
       silent: true,
       org: "your-org",
       project: "zomato-dashboard"
     }
   );
   ```

### Supabase Monitoring

1. Go to Supabase Dashboard → Reports
2. Monitor:
   - Database size
   - API requests
   - Active connections
   - Query performance

3. Set up alerts:
   - Database > 80% capacity
   - API errors > 5%
   - Slow queries > 1s

### n8n Monitoring

1. In n8n: Settings → Log Streaming
2. Configure webhook to send logs to Slack
3. Monitor workflow execution history
4. Set up error notifications

---

## 🔐 Security Hardening

### 1. Environment Variables

**Never commit these to Git:**
```bash
# Add to .gitignore
.env
.env.local
.env.production
```

**Use Vercel's encrypted storage:**
- All secrets stored encrypted at rest
- Only decrypted at build/runtime
- Never exposed in logs

### 2. API Rate Limiting

Add to `middleware.ts`:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 h"),
});

export async function middleware(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response("Too Many Requests", { status: 429 });
  }
}
```

### 3. CORS Configuration

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://zomato-dashboard.vercel.app" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};
```

### 4. Content Security Policy

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📈 Performance Optimization

### 1. Database Optimization

```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_restaurants_kam ON restaurants(kam_name);
CREATE INDEX idx_drive_data_status ON drive_data(approached, converted_stepper);
CREATE INDEX idx_conversion_date ON conversion_tracking(action_date DESC);

-- Refresh materialized view daily
REFRESH MATERIALIZED VIEW CONCURRENTLY kam_performance;
```

### 2. API Response Caching

```typescript
// app/api/restaurants/route.ts
export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  // Your API logic
}
```

### 3. Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/logo.png"
  width={200}
  height={50}
  alt="Zomato"
  priority
/>
```

---

## 🆘 Troubleshooting

### Build Failures

**Error:** `Module not found`
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error:** `Type errors`
```bash
# Check TypeScript
npm run type-check
```

### Database Connection Issues

**Error:** `Invalid API key`
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check if RLS policies are blocking access

**Error:** `Too many connections`
- Upgrade Supabase plan
- Implement connection pooling

### n8n Workflow Failures

**Error:** `Credentials not found`
- Re-authenticate credentials in n8n
- Check credential permissions

**Error:** `Webhook timeout`
- Increase timeout in n8n settings
- Optimize workflow execution time

---

## 📞 Support & Maintenance

### Daily Tasks
- [ ] Check Slack for sync errors
- [ ] Monitor Sentry for new errors
- [ ] Review Vercel analytics

### Weekly Tasks
- [ ] Review database performance
- [ ] Check n8n workflow execution logs
- [ ] Update dependencies (`npm outdated`)

### Monthly Tasks
- [ ] Database backup verification
- [ ] Security audit
- [ ] Performance optimization review
- [ ] User feedback review

---

## 🎉 Go Live Checklist

- [ ] Database deployed and tested
- [ ] Frontend deployed to Vercel
- [ ] n8n workflows activated
- [ ] All environment variables set
- [ ] RLS policies enabled
- [ ] Monitoring tools configured
- [ ] Error tracking active
- [ ] Backups scheduled
- [ ] Team trained on dashboard
- [ ] Documentation shared
- [ ] Support process established

---

**Congratulations! Your Zomato Drive Dashboard is now live! 🚀**

For questions or issues, refer to the documentation in the `docs/` folder or contact the development team.

