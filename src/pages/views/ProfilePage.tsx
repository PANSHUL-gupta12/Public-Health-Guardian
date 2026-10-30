import { useState, useEffect } from "react";
import { UserRound, Activity, Trophy, Calendar, Bell, LogOut, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ActivityEntry {
  description: string;
  created_at: string;
}

export const ProfilePage = () => {
  const { user, profile } = useAuth();
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      if (!profile) {
        setLoadingActivities(false);
        return;
      }
      try {
        const { data } = await supabase
          .from("activity_logs")
          .select("description, created_at")
          .eq("user_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (data && data.length > 0) {
          setActivities(data);
        } else {
          // Fallback activities
          setActivities([
            { description: "Completed Awareness Quiz — +150 pts", created_at: new Date().toISOString() },
            { description: "Verified a claim with Fake News Detector", created_at: new Date().toISOString() },
            { description: "Logged morning walk · 32 min", created_at: new Date().toISOString() },
            { description: "Viewed disease alerts", created_at: new Date().toISOString() },
          ]);
        }
      } catch (err) {
        console.warn("Using fallback activities:", err);
        setActivities([
          { description: "Welcome to Public Health Guardian!", created_at: new Date().toISOString() },
        ]);
      } finally {
        setLoadingActivities(false);
      }
    };
    loadActivities();
  }, [profile]);

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
            <div
              className={cn(
                "p-[3px] rounded-full bg-gradient-to-br from-emerald-500 to-teal-400"
              )}
            >
              <div className="h-20 w-20 rounded-full bg-background grid place-items-center text-2xl font-semibold">
                {initials}
              </div>
            </div>
            <div className="mt-4 font-semibold">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            {[
              {
                label: "Streak",
                value: `${profile?.streak_days || 0}d`,
                icon: Activity,
              },
              {
                label: "Points",
                value:
                  (profile?.points || 0) >= 1000
                    ? `${((profile?.points || 0) / 1000).toFixed(1)}k`
                    : `${profile?.points || 0}`,
                icon: Trophy,
              },
              { label: "Visits", value: "—", icon: Calendar },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-secondary/40 p-3">
                <s.icon className="h-4 w-4 mx-auto text-primary" />
                <div className="mt-1 text-sm font-semibold">{s.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {s.label}
                </div>
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
                {
                  label: "Local outbreak alerts",
                  desc: "Get notified about diseases trending nearby",
                },
                {
                  label: "Medication reminders",
                  desc: "Daily reminder to log your medication",
                },
                {
                  label: "Quiz challenges",
                  desc: "Weekly quiz to earn bonus health points",
                },
                {
                  label: "Newsletter",
                  desc: "Curated health insights every Friday",
                },
              ].map((n, i) => (
                <div
                  key={n.label}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-secondary/30 border border-border/40"
                >
                  <div>
                    <div className="text-sm font-medium">{n.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {n.desc}
                    </div>
                  </div>
                  <Switch defaultChecked={i < 2} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold mb-3">Recent activity</div>
            {loadingActivities ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Loading...
                </span>
              </div>
            ) : (
              <ul className="space-y-2 text-sm">
                {activities.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/30"
                  >
                    <div className="h-2 w-2 rounded-full bg-emerald" />
                    <span>{a.description}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
