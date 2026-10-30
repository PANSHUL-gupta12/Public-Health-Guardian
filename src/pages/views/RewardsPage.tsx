import { useState, useEffect } from "react";
import { Trophy, Flame, Star, Gift, Target, Loader2, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface Reward {
  id: string;
  name: string;
  cost: number;
  icon: string;
}

const iconMap: Record<string, LucideIcon> = { Gift, Star, Flame, Target, Trophy };
const accentMap: Record<string, string> = {
  Gift: "text-teal border-teal/40",
  Star: "text-sky-300 border-sky-400/40",
  Flame: "text-emerald-glow border-emerald/40",
  Target: "text-fuchsia-300 border-fuchsia-400/40",
  Trophy: "text-amber-300 border-amber-400/40",
};

const fallbackRewards: Reward[] = [
  { id: "1", name: "Free Annual Check-up", cost: 1500, icon: "Gift" },
  { id: "2", name: "Pharmacy 10% Voucher", cost: 800, icon: "Star" },
  { id: "3", name: "Yoga Class Pass", cost: 600, icon: "Flame" },
  { id: "4", name: "Nutrition Consult", cost: 1200, icon: "Target" },
];

const streakDays = ["M", "T", "W", "T", "F", "S", "S"];

export const RewardsPage = () => {
  const { profile, refreshProfile } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>(fallbackRewards);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [loggingActivity, setLoggingActivity] = useState(false);

  const points = profile?.points || 0;
  const streakCount = profile?.streak_days || 0;
  const next = 1500;
  const pct = Math.min((points / next) * 100, 100);

  // Load rewards from Supabase
  useEffect(() => {
    const loadRewards = async () => {
      try {
        const { data } = await supabase
          .from("rewards")
          .select("*")
          .eq("active", true)
          .order("cost", { ascending: true });

        if (data && data.length > 0) {
          setRewards(data);
        }
      } catch (err) {
        console.warn("Using fallback rewards:", err);
      }
    };
    loadRewards();
  }, []);

  const redeemReward = async (reward: Reward) => {
    if (!profile || points < reward.cost) return;
    setRedeeming(reward.id);

    try {
      // Insert redemption
      await supabase.from("redemptions").insert({
        user_id: profile.id,
        reward_id: reward.id,
      });

      // Deduct points
      await supabase
        .from("profiles")
        .update({ points: points - reward.cost })
        .eq("id", profile.id);

      // Log activity
      await supabase.from("activity_logs").insert({
        user_id: profile.id,
        description: `Redeemed: ${reward.name}`,
        points_delta: -reward.cost,
      });

      await refreshProfile();
    } catch (err) {
      console.error("Redemption error:", err);
    } finally {
      setRedeeming(null);
    }
  };

  const logActivity = async () => {
    if (!profile) return;
    setLoggingActivity(true);

    try {
      const today = new Date().toISOString().split("T")[0];
      const bonusPoints = 25;

      await supabase
        .from("profiles")
        .update({
          points: points + bonusPoints,
          streak_days:
            profile.streak_last_date === today
              ? streakCount
              : streakCount + 1,
          streak_last_date: today,
        })
        .eq("id", profile.id);

      await supabase.from("activity_logs").insert({
        user_id: profile.id,
        description: "Logged daily healthy activity",
        points_delta: bonusPoints,
      });

      await refreshProfile();
    } catch (err) {
      console.error("Log activity error:", err);
    } finally {
      setLoggingActivity(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        icon={<Trophy className="h-5 w-5 text-primary-foreground" />}
        eyebrow="Patient perks"
        title="Health Rewards"
        description="Earn points for healthy habits and redeem them for real-world wellness benefits."
      />

      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <div className="glass rounded-2xl p-6 shadow-card md:col-span-2">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
                Health points
              </div>
              <div className="text-4xl font-semibold tracking-tight text-gradient-brand mt-1">
                {points.toLocaleString()}
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              {Math.max(next - points, 0)} pts until next reward
            </div>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-brand transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm font-semibold">Weekly streak</div>
            <span className="text-xs px-3 py-1 rounded-full border border-emerald/40 text-emerald-glow bg-emerald/10 font-medium">
              {streakCount} of 7 days
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            {streakDays.map((s, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-12 rounded-xl grid place-items-center text-xs font-semibold border",
                  i < streakCount
                    ? "bg-brand-soft border-primary/30 text-foreground"
                    : "bg-secondary/40 border-border/60 text-muted-foreground"
                )}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 grid place-items-center shrink-0">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold leading-tight">
                {streakCount}-day streak
              </div>
              <div className="text-xs text-muted-foreground">Keep it up!</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Log a healthy action today — a walk, a glass of water, or your
            medication — to extend your streak.
          </p>
          <button
            onClick={logActivity}
            disabled={loggingActivity}
            className={cn(
              "mt-4 w-full h-10 rounded-full bg-gradient-brand text-primary-foreground text-sm font-medium shadow-glow transition flex items-center justify-center gap-2",
              loggingActivity ? "opacity-60" : "hover:opacity-90"
            )}
          >
            {loggingActivity ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Log activity"
            )}
          </button>
        </div>
      </div>

      <div className="text-[11px] font-semibold mb-3 text-muted-foreground uppercase tracking-[0.18em]">
        Redeem
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rewards.map((r) => {
          const IconComp = iconMap[r.icon] || Gift;
          const accent = accentMap[r.icon] || accentMap.Gift;
          const can = points >= r.cost;
          const isRedeeming = redeeming === r.id;
          return (
            <div key={r.id} className="glass rounded-2xl p-5 shadow-card flex flex-col">
              <div
                className={cn(
                  "h-11 w-11 rounded-xl border bg-secondary/40 grid place-items-center mb-3",
                  accent
                )}
              >
                <IconComp className="h-5 w-5" />
              </div>
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {r.cost.toLocaleString()} pts
              </div>
              <button
                onClick={() => redeemReward(r)}
                disabled={!can || isRedeeming}
                className={cn(
                  "mt-4 h-10 rounded-full text-sm font-medium transition flex items-center justify-center gap-2",
                  can && !isRedeeming
                    ? "bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90"
                    : "bg-secondary/60 text-muted-foreground cursor-not-allowed"
                )}
              >
                {isRedeeming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : can ? (
                  "Redeem"
                ) : (
                  "Not enough"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
