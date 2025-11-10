# Authentication Setup - Complete Guide

## Overview

**Authentication Provider**: Supabase Auth
**Methods**: Email/Password + Google OAuth
**Security**: JWT tokens + Row Level Security (RLS)
**Domain Restriction**: @zomato.com emails only (production mode)

---

## Authentication Flow

### High-Level Flow

```
User visits app
    ↓
Redirected to Auth page (/)
    ↓
User chooses login method:
    ├── Email/Password
    │   ↓
    │   Supabase validates credentials
    │   ↓
    │   Returns JWT token + user object
    │
    └── Google OAuth
        ↓
        Redirected to Google consent screen
        ↓
        Google returns auth code
        ↓
        Supabase exchanges code for JWT token
    ↓
AuthContext validates email domain
    ↓
If valid @zomato.com email:
    ├── Store user in context
    ├── Store JWT in localStorage (auto-managed)
    └── Redirect to /dashboard
    ↓
If invalid email:
    ├── Sign out user
    └── Show error message
    ↓
All subsequent API calls include JWT in Authorization header
    ↓
RLS policies filter data based on JWT email claim
```

---

## Supabase Configuration

### Environment Variables

**File**: `.env.local` (not committed to git)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_RESTRICT_DOMAIN=false  # Set to 'true' in production
```

### Supabase Client Setup

**File**: `src/lib/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## AuthContext Implementation

**File**: `src/contexts/AuthContext.tsx`

### Email Validation

```typescript
// Whitelist for development/testing
const ALLOWED_TEST_EMAILS = [
  'virajshrivastav919@gmail.com',
];

// Email validation function
const isAuthorizedEmail = (email: string): boolean => {
  const isZomatoEmail = email.endsWith("@zomato.com");
  const isTestEmail = ALLOWED_TEST_EMAILS.includes(email);
  const restrictDomain = import.meta.env.VITE_RESTRICT_DOMAIN === "true";
  
  if (restrictDomain) {
    // Production mode: Only @zomato.com emails
    return isZomatoEmail;
  }
  
  // Development mode: @zomato.com OR whitelisted emails
  return isZomatoEmail || isTestEmail;
};
```

### AuthContext Provider

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email || "";
        if (isAuthorizedEmail(email)) {
          setUser(session.user);
        } else {
          // Invalid email, sign out
          supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "Only @zomato.com emails are allowed.",
            variant: "destructive",
          });
        }
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || "";
        if (isAuthorizedEmail(email)) {
          setUser(session.user);
        } else {
          supabase.auth.signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    if (!isAuthorizedEmail(email)) {
      throw new Error("Only @zomato.com emails are allowed");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  // Sign up with email/password
  const signUp = async (email: string, password: string) => {
    if (!isAuthorizedEmail(email)) {
      throw new Error("Only @zomato.com emails are allowed");
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

---

## Protected Routes

**File**: `src/components/ProtectedRoute.tsx`

```typescript
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
```

---

## Auth Page Implementation

**File**: `src/pages/Auth.tsx`

### Email/Password Login

```typescript
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);

const handleEmailLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    await signIn(email, password);
    toast({
      title: "Success",
      description: "Logged in successfully",
    });
    navigate("/dashboard");
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
```

### Google OAuth Login

```typescript
const handleGoogleLogin = async () => {
  try {
    await signInWithGoogle();
    // User will be redirected to Google, then back to /dashboard
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};
```

### UI Components

```tsx
<form onSubmit={handleEmailLogin}>
  <Input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  <Input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <Button type="submit" disabled={isLoading}>
    {isLoading ? "Logging in..." : "Login"}
  </Button>
</form>

<Button onClick={handleGoogleLogin} variant="outline">
  <svg>...</svg> {/* Google icon */}
  Sign in with Google
</Button>
```

---

## Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized JavaScript origins:
   - `http://localhost:8080` (development)
   - `https://your-domain.com` (production)
7. Authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
8. Copy Client ID and Client Secret

### Step 2: Configure Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Paste Client ID and Client Secret
4. Save

### Step 3: Add Client ID to .env.local

```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Step 4: (Optional) Restrict to @zomato.com Domain

In Google Cloud Console:
1. Go to OAuth consent screen
2. Add `zomato.com` to authorized domains
3. Set user type to "Internal" (if using Google Workspace)

---

## JWT Token Structure

### Token Claims

```json
{
  "aud": "authenticated",
  "exp": 1699999999,
  "sub": "user-uuid-here",
  "email": "shiv.kumar@zomato.com",
  "phone": "",
  "app_metadata": {
    "provider": "google",
    "providers": ["google"]
  },
  "user_metadata": {
    "avatar_url": "https://...",
    "email": "shiv.kumar@zomato.com",
    "email_verified": true,
    "full_name": "Shiv Kumar",
    "iss": "https://accounts.google.com",
    "name": "Shiv Kumar",
    "picture": "https://...",
    "provider_id": "...",
    "sub": "..."
  },
  "role": "authenticated",
  "aal": "aal1",
  "amr": [
    {
      "method": "oauth",
      "timestamp": 1699999999
    }
  ],
  "session_id": "session-uuid-here"
}
```

### Accessing Email in RLS Policies

```sql
-- Extract email from JWT
auth.jwt() ->> 'email'

-- Example usage in RLS policy
CREATE POLICY "KAMs see own restaurants"
ON restaurants FOR SELECT
USING (kam_email = auth.jwt() ->> 'email');
```

---

## Session Management

### Auto-Refresh

Supabase automatically refreshes JWT tokens before expiry. No manual intervention needed.

### Session Persistence

Sessions are stored in localStorage by default. Users remain logged in across browser sessions.

### Manual Session Check

```typescript
const { data: { session } } = await supabase.auth.getSession();
if (session) {
  console.log("User is logged in:", session.user.email);
} else {
  console.log("User is not logged in");
}
```

---

## Logout Implementation

### AppSidebar Logout Button

**File**: `src/components/AppSidebar.tsx`

```typescript
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar>
      {/* ... other sidebar items ... */}
      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </SidebarMenuButton>
      </SidebarMenuItem>
    </Sidebar>
  );
}
```

---

## Security Best Practices

### 1. Never Expose Service Role Key
- Only use `VITE_SUPABASE_ANON_KEY` in frontend
- Service role key bypasses RLS - keep it server-side only

### 2. Always Use RLS Policies
- Never rely on frontend validation alone
- Database-level security is mandatory

### 3. Validate Email Domain
- Check email domain in AuthContext
- Also enforce in Supabase Auth settings if possible

### 4. Use HTTPS in Production
- Set `VITE_RESTRICT_DOMAIN=true` in production
- Ensure Supabase project uses HTTPS

### 5. Rotate Keys Regularly
- Rotate Supabase anon key every 6 months
- Update Google OAuth credentials if compromised

---

## Test Accounts

### Development Test Accounts

```
Email: shiv.kumar@zomato.com
Password: zomato123

Email: amdeep.singh@zomato.com
Password: zomato123

Email: shrawani.patil@zomato.com
Password: zomato123

Email: rutuja.deshmukh@zomato.com
Password: zomato123
```

### Whitelisted Non-Zomato Email (Development Only)

```
Email: virajshrivastav919@gmail.com
Password: (set your own)
```

---

## Troubleshooting

### Issue: "Only @zomato.com emails are allowed"

**Solution**: 
- Check `VITE_RESTRICT_DOMAIN` in `.env.local`
- Set to `false` for development
- Add email to `ALLOWED_TEST_EMAILS` array in `AuthContext.tsx`

### Issue: Google OAuth redirects to wrong URL

**Solution**:
- Check authorized redirect URIs in Google Cloud Console
- Ensure `https://your-project.supabase.co/auth/v1/callback` is added
- Check `redirectTo` option in `signInWithGoogle()`

### Issue: User logged out immediately after login

**Solution**:
- Check email validation in `AuthContext.tsx`
- Ensure email passes `isAuthorizedEmail()` check
- Check browser console for error messages

### Issue: RLS policies not working

**Solution**:
- Verify RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Check policy conditions match JWT email claim
- Test with `SELECT auth.jwt() ->> 'email';` in SQL editor

---

## Production Checklist

- [ ] Set `VITE_RESTRICT_DOMAIN=true` in production environment
- [ ] Remove test emails from `ALLOWED_TEST_EMAILS` array
- [ ] Configure Google OAuth with production domain
- [ ] Enable email confirmation in Supabase Auth settings
- [ ] Set up custom SMTP for email delivery
- [ ] Configure password strength requirements
- [ ] Enable MFA (Multi-Factor Authentication) if needed
- [ ] Set up monitoring for failed login attempts
- [ ] Configure session timeout settings
- [ ] Test all auth flows in production environment

