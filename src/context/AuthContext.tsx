import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type Role = "patient" | "doctor" | "admin" | "guest";
export type PageId =
  | "chat"
  | "fake-news"
  | "quiz"
  | "rewards"
  | "disease-map"
  | "medical-records"
  | "admin-panel"
  | "faqs"
  | "profile";

export const pageAccessRules: Record<PageId, Role[]> = {
  chat: ["patient", "doctor", "admin"],
  "fake-news": ["patient", "doctor", "admin"],
  quiz: ["patient", "doctor", "admin"],
  rewards: ["patient"],
  "disease-map": ["patient", "doctor", "admin"],
  "medical-records": ["doctor", "admin"],
  "admin-panel": ["admin"],
  faqs: ["patient", "doctor", "admin", "guest"],
  profile: ["patient", "doctor", "admin"],
};

export const roleMeta: Record<Role, { label: string; from: string; to: string; ring: string; description: string }> = {
  patient: {
    label: "Patient",
    from: "from-sky-500",
    to: "to-cyan-400",
    ring: "ring-sky-400/60",
    description: "General health information & rewards",
  },
  doctor: {
    label: "Doctor",
    from: "from-fuchsia-500",
    to: "to-pink-500",
    ring: "ring-fuchsia-400/60",
    description: "Clinical tools & patient records",
  },
  admin: {
    label: "Admin",
    from: "from-orange-500",
    to: "to-rose-500",
    ring: "ring-orange-400/60",
    description: "Full system access & management",
  },
  guest: {
    label: "Guest",
    from: "from-slate-500",
    to: "to-slate-700",
    ring: "ring-slate-400/50",
    description: "Public FAQs only — sign in for more",
  },
};

interface AuthCtx {
  role: Role;
  setRole: (r: Role) => void;
  hasAccess: (page: PageId) => boolean;
  user: { name: string; email: string };
}

const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("patient");

  const value = useMemo<AuthCtx>(() => ({
    role,
    setRole,
    hasAccess: (page) => pageAccessRules[page]?.includes(role) ?? false,
    user: {
      name: role === "guest" ? "Guest User" : role === "doctor" ? "Dr. Lin Hayes" : role === "admin" ? "Avery Stone" : "Jordan Rivera",
      email: role === "guest" ? "guest@example.com" : `${role}@guardian.health`,
    },
  }), [role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
