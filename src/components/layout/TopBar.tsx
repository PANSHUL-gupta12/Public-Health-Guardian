import { Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export const TopBar = () => {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-4 md:px-6 relative z-20">
      {/* Logo */}
      <div className="flex items-center gap-3 min-w-0 w-72 shrink-0">
        <div className="h-10 w-10 rounded-xl bg-gradient-brand grid place-items-center shadow-glow shrink-0">
          <span className="text-sm font-bold text-primary-foreground tracking-tight">PH</span>
        </div>
        <div className="text-lg font-semibold tracking-tight text-gradient-brand truncate">
          Public Health Guardian
        </div>
      </div>

      {/* Centered pill search */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for health information..."
            className="w-full h-11 pl-11 pr-4 rounded-full glass border border-border/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
          />
        </div>
      </div>

      {/* Right: profile avatar */}
      <div className="ml-auto flex items-center gap-3">
        <div className="p-[2px] rounded-full bg-gradient-to-br from-emerald-500 to-teal-400">
          <div className="h-9 w-9 rounded-full bg-background grid place-items-center text-xs font-semibold">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};
