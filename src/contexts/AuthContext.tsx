import { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// Whitelist for development testing
// Add your test Gmail accounts here during development
const ALLOWED_TEST_EMAILS = [
  "virajshrivastav919@gmail.com",
  // Add more test emails below as needed
];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to check if email is authorized
const isAuthorizedEmail = (email: string): boolean => {
  const isZomatoEmail = email.endsWith("@zomato.com");
  const isTestEmail = ALLOWED_TEST_EMAILS.includes(email);
  const restrictDomain = import.meta.env.VITE_RESTRICT_DOMAIN === "true";

  if (restrictDomain) {
    // Production mode: only @zomato.com emails
    return isZomatoEmail;
  }

  // Development mode: @zomato.com OR whitelisted test emails
  return isZomatoEmail || isTestEmail;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        // Validate email authorization
        if (!isAuthorizedEmail(session.user.email)) {
          toast({
            title: "Access Denied",
            description:
              "Your email is not authorized to access this dashboard. Only @zomato.com emails are allowed.",
            variant: "destructive",
          });
          supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        // Validate email authorization
        if (!isAuthorizedEmail(session.user.email)) {
          toast({
            title: "Access Denied",
            description:
              "Your email is not authorized to access this dashboard. Only @zomato.com emails are allowed.",
            variant: "destructive",
          });
          supabase.auth.signOut();
          setSession(null);
          setUser(null);
          return;
        }
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const restrictDomain = import.meta.env.VITE_RESTRICT_DOMAIN === "true";

    const options: any = {
      redirectTo: `${window.location.origin}/dashboard`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    };

    // Only restrict to @zomato.com in production mode
    if (restrictDomain) {
      options.queryParams.hd = "zomato.com";
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
