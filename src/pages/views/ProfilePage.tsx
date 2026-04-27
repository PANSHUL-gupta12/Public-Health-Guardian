import { UserRound, Activity, Trophy, Calendar, Bell } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useAuth, roleMeta } from "@/context/AuthContext";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const ProfilePage = () => {
  const { user, role } = useAuth();
  const meta = roleMeta[role];
  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<UserRound className="h-5 w-5 text-primary-foreground" />}
        eyebrow="Account"
        title="Your Profile"
        description="Track your health journey, preferences, and notifications."
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="glass rounded-2xl p-6 shadow-card">
          <div className="flex flex-col items-center text-center">
            <div className={cn("p-[3px] rounded-full bg-gradient-to-br", meta.from, meta.to)}>
              <div className="h-20 w-20 rounded-full bg-background grid place-items-center text-2xl font-semibold">
                {initials}
              </div>
            </div>
            <div className="mt-4 font-semibold">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
            <div className={cn("mt-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gradient-to-br text-white", meta.from, meta.to)}>
              {meta.label}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Streak", value: "5d", icon: Activity },
              { label: "Points", value: "1.24k", icon: Trophy },
              { label: "Visits", value: "12", icon: Calendar },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-secondary/40 p-3">
                <s.icon className="h-4 w-4 mx-auto text-primary" />
                <div className="mt-1 text-sm font-semibold">{s.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-card lg:col-span-2 space-y-5">
          <div>
            <div className="font-semibold mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Notification preferences
            </div>
            <div className="space-y-3">
              {[
                { label: "Local outbreak alerts", desc: "Get notified about diseases trending nearby" },
                { label: "Medication reminders", desc: "Daily reminder to log your medication" },
                { label: "Quiz challenges", desc: "Weekly quiz to earn bonus health points" },
                { label: "Newsletter", desc: "Curated health insights every Friday" },
              ].map((n, i) => (
                <div key={n.label} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-secondary/30 border border-border/40">
                  <div>
                    <div className="text-sm font-medium">{n.label}</div>
                    <div className="text-xs text-muted-foreground">{n.desc}</div>
                  </div>
                  <Switch defaultChecked={i < 2} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold mb-3">Recent activity</div>
            <ul className="space-y-2 text-sm">
              {[
                "Completed Awareness Quiz — +150 pts",
                "Verified a claim with Fake News Detector",
                "Logged morning walk · 32 min",
                "Viewed disease alerts in Northern District",
              ].map((t, i) => (
                <li key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/30">
                  <div className="h-2 w-2 rounded-full bg-emerald" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
