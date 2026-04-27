import { Trophy, Flame, Star, Gift, Target } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

const rewards = [
  { name: "Free Annual Check-up", cost: 1500, icon: Gift, accent: "text-teal border-teal/40" },
  { name: "Pharmacy 10% Voucher", cost: 800, icon: Star, accent: "text-sky-300 border-sky-400/40" },
  { name: "Yoga Class Pass", cost: 600, icon: Flame, accent: "text-emerald-glow border-emerald/40" },
  { name: "Nutrition Consult", cost: 1200, icon: Target, accent: "text-fuchsia-300 border-fuchsia-400/40" },
];

const streaks = [
  { day: "M", done: true }, { day: "T", done: true }, { day: "W", done: true },
  { day: "T", done: true }, { day: "F", done: true }, { day: "S", done: false }, { day: "S", done: false },
];

export const RewardsPage = () => {
  const points = 1240;
  const next = 1500;
  const pct = (points / next) * 100;

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
              <div className="text-[11px] text-muted-foreground uppercase tracking-[0.18em]">Health points</div>
              <div className="text-4xl font-semibold tracking-tight text-gradient-brand mt-1">
                {points.toLocaleString()}
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              {next - points} pts until next reward
            </div>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-gradient-brand transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm font-semibold">Weekly streak</div>
            <span className="text-xs px-3 py-1 rounded-full border border-emerald/40 text-emerald-glow bg-emerald/10 font-medium">
              5 of 7 days
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            {streaks.map((s, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-12 rounded-xl grid place-items-center text-xs font-semibold border",
                  s.done
                    ? "bg-brand-soft border-primary/30 text-foreground"
                    : "bg-secondary/40 border-border/60 text-muted-foreground",
                )}
              >
                {s.day}
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
              <div className="font-semibold leading-tight">5-day streak</div>
              <div className="text-xs text-muted-foreground">Keep it up!</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Log a healthy action today — a walk, a glass of water, or your medication — to extend your streak.
          </p>
          <button className="mt-4 w-full h-10 rounded-full bg-gradient-brand text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition">
            Log activity
          </button>
        </div>
      </div>

      <div className="text-[11px] font-semibold mb-3 text-muted-foreground uppercase tracking-[0.18em]">
        Redeem
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rewards.map((r) => {
          const Icon = r.icon;
          const can = points >= r.cost;
          return (
            <div key={r.name} className="glass rounded-2xl p-5 shadow-card flex flex-col">
              <div className={cn("h-11 w-11 rounded-xl border bg-secondary/40 grid place-items-center mb-3", r.accent)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{r.cost.toLocaleString()} pts</div>
              <button
                disabled={!can}
                className={cn(
                  "mt-4 h-10 rounded-full text-sm font-medium transition",
                  can
                    ? "bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-90"
                    : "bg-secondary/60 text-muted-foreground cursor-not-allowed",
                )}
              >
                {can ? "Redeem" : "Not enough"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
