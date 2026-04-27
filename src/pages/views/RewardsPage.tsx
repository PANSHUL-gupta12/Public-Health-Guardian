import { Trophy, Flame, Star, Gift, Target } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const rewards = [
  { name: "Free Annual Check-up", cost: 1500, icon: Gift },
  { name: "Pharmacy 10% Voucher", cost: 800, icon: Star },
  { name: "Yoga Class Pass", cost: 600, icon: Flame },
  { name: "Nutrition Consult", cost: 1200, icon: Target },
];

const streaks = [
  { day: "M", done: true }, { day: "T", done: true }, { day: "W", done: true },
  { day: "T", done: true }, { day: "F", done: true }, { day: "S", done: false }, { day: "S", done: false },
];

export const RewardsPage = () => {
  const points = 1240;
  const next = 1500;
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Trophy className="h-5 w-5 text-primary-foreground" />}
        eyebrow="Patient perks"
        title="Health Rewards"
        description="Earn points for healthy habits and redeem them for real-world wellness benefits."
      />

      <div className="grid md:grid-cols-3 gap-5">
        <div className="glass rounded-2xl p-6 shadow-card md:col-span-2">
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Health points</div>
              <div className="text-4xl font-semibold tracking-tight text-gradient-brand">{points.toLocaleString()}</div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              {next - points} pts until next reward
            </div>
          </div>
          <Progress value={(points / next) * 100} className="h-2" />
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm font-medium">Weekly streak</div>
            <div className="text-xs text-muted-foreground">5 of 7 days</div>
          </div>
          <div className="mt-3 flex gap-2">
            {streaks.map((s, i) => (
              <div
                key={i}
                className={`flex-1 h-12 rounded-xl grid place-items-center text-xs font-medium border ${
                  s.done ? "bg-brand-soft border-primary/30 text-foreground" : "bg-secondary/40 border-border/60 text-muted-foreground"
                }`}
              >
                {s.day}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 grid place-items-center">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold">5-day streak</div>
              <div className="text-xs text-muted-foreground">Keep it up!</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Log a healthy action today — a walk, a glass of water, or your medication — to extend your streak.
          </p>
          <Button className="mt-4 w-full bg-gradient-brand text-primary-foreground hover:opacity-90">Log activity</Button>
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Redeem</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map((r) => {
            const Icon = r.icon;
            const can = points >= r.cost;
            return (
              <div key={r.name} className="glass rounded-2xl p-5 shadow-card flex flex-col">
                <div className="h-11 w-11 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-3">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.cost.toLocaleString()} pts</div>
                <Button
                  disabled={!can}
                  className={`mt-4 ${can ? "bg-gradient-brand text-primary-foreground hover:opacity-90" : "bg-secondary text-muted-foreground"}`}
                >
                  {can ? "Redeem" : "Not enough"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
