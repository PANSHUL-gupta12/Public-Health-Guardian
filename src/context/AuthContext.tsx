import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

export type PageId =
  | "chat"
  | "fake-news"
  | "quiz"
  | "rewards"
  | "disease-map"
  | "admin-panel"
  | "faqs"
  | "profile";

interface Profile {
  id: string;
  name: string;
  email: string;
  points: number;
  streak_days: number;
  avatar_url: string | null;
}

interface AuthCtx {
  user: { name: string; email: string };
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchProfile = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data as Profile);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const refreshProfile = useCallback(async () => {
    if (session?.user) {
      await fetchProfile(session.user);
    }
  }, [session?.user]);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      
      if (s?.user) {
        setSession(s);
        await fetchProfile(s.user);
        setLoading(false);
      } else {
        // If no session exists, silently create an anonymous user!
        console.log("No session found. Creating anonymous user...");
        try {
          const { data: anonData, error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
          if (anonData.session) {
            setSession(anonData.session);
            // The DB trigger handles creating the row in `profiles`, so we fetch it
            setTimeout(() => {
              if (anonData.user) fetchProfile(anonData.user);
            }, 1000); // Give the trigger a second to complete
          }
        } catch (err) {
          console.error("Failed to sign in anonymously. Make sure Anonymous Sign-ins are enabled in Supabase Dashboard -> Authentication -> Providers.", err);
        } finally {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s?.user && s.user.id !== session?.user.id) {
        setSession(s);
        fetchProfile(s.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user: {
        name: profile?.name || "Health Guardian User",
        email: profile?.email || "anonymous@guardian.health",
      },
      profile,
      session,
      loading,
      refreshProfile,
    }),
    [profile, session, loading, refreshProfile]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
