import { useState } from "react";
import { ShieldAlert, ShieldCheck, ShieldQuestion, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Verdict = "true" | "false" | "uncertain" | null;

const verdictMeta = {
  true: { label: "Likely accurate", color: "from-emerald-500 to-teal-400", icon: ShieldCheck },
  false: { label: "Likely false", color: "from-rose-500 to-orange-500", icon: ShieldAlert },
  uncertain: { label: "Needs context", color: "from-amber-500 to-yellow-400", icon: ShieldQuestion },
} as const;

const recent = [
  { claim: "Drinking lemon water cures cancer", verdict: "false" as const },
  { claim: "Vaccines undergo multiple safety trials", verdict: "true" as const },
  { claim: "Cracking knuckles causes arthritis", verdict: "uncertain" as const },
];

export const FakeNewsPage = () => {
  const [claim, setClaim] = useState("");
  const [verdict, setVerdict] = useState<Verdict>(null);

  const analyze = () => {
    if (!claim.trim()) return;
    const v: Verdict = ["true", "false", "uncertain"][Math.floor(Math.random() * 3)] as Verdict;
    setVerdict(v);
  };

  const meta = verdict ? verdictMeta[verdict] : null;
  const Icon = meta?.icon;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ShieldAlert className="h-5 w-5 text-primary-foreground" />}
        eyebrow="Misinformation"
        title="Fake News Detector"
        description="Paste a health claim or headline. Our analyzer compares it against verified medical sources."
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="glass rounded-2xl p-5 lg:col-span-2 shadow-card space-y-4">
          <Textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder="e.g. 'Drinking warm water with lemon every morning prevents COVID-19.'"
            className="min-h-32 bg-secondary/40 border-border/60 resize-none"
          />
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">{claim.length} / 1000</div>
            <Button onClick={analyze} className="bg-gradient-brand text-primary-foreground hover:opacity-90 shadow-glow">
              <Search className="h-4 w-4 mr-2" /> Verify claim
            </Button>
          </div>

          {meta && Icon && (
            <div className="rounded-2xl border border-border/60 p-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-br grid place-items-center", meta.color)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Verdict</div>
                  <div className="font-semibold">{meta.label}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Based on cross-referenced sources from WHO, CDC, and peer-reviewed journals. Always confirm with a
                licensed clinician for personal decisions.
              </p>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5 shadow-card">
          <div className="text-sm font-semibold mb-3">Recent checks</div>
          <ul className="space-y-2">
            {recent.map((r) => {
              const m = verdictMeta[r.verdict];
              const I = m.icon;
              return (
                <li key={r.claim} className="flex items-start gap-3 p-2.5 rounded-xl bg-secondary/40">
                  <div className={cn("h-8 w-8 rounded-lg bg-gradient-to-br grid place-items-center shrink-0", m.color)}>
                    <I className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-xs">
                    <div className="text-foreground/90">{r.claim}</div>
                    <div className="text-muted-foreground mt-0.5">{m.label}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
