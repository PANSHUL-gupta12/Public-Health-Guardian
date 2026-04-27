import { Search, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { Role, roleMeta, useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const roles: Role[] = ["patient", "doctor", "admin", "guest"];

export const TopBar = () => {
  const { role, setRole, user } = useAuth();
  const meta = roleMeta[role];
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

      {/* Right: role + avatar */}
      <div className="ml-auto flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="group hidden sm:flex items-center gap-2 pl-1 pr-3 py-1 rounded-full glass border border-border/60 hover:border-primary/40 transition-colors"
            >
              <span
                className={cn(
                  "h-7 w-7 rounded-full bg-gradient-to-br grid place-items-center text-[11px] font-bold text-white",
                  meta.from,
                  meta.to,
                )}
              >
                {meta.label[0]}
              </span>
              <span className="text-xs font-medium">{meta.label}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 glass border-border/60">
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              Switch role
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roles.map((r) => {
              const m = roleMeta[r];
              const active = r === role;
              return (
                <DropdownMenuItem
                  key={r}
                  onClick={() => setRole(r)}
                  className="flex items-start gap-3 cursor-pointer py-2.5"
                >
                  <span
                    className={cn(
                      "h-7 w-7 rounded-full bg-gradient-to-br grid place-items-center text-[11px] font-bold text-white shrink-0",
                      m.from,
                      m.to,
                    )}
                  >
                    {m.label[0]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{m.label}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{m.description}</div>
                  </div>
                  {active && <Check className="h-4 w-4 text-primary mt-1.5" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className={cn("p-[2px] rounded-full bg-gradient-to-br", meta.from, meta.to)}>
          <div className="h-9 w-9 rounded-full bg-background grid place-items-center text-xs font-semibold">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};
