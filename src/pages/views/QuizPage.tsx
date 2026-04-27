import { useState } from "react";
import { Brain, CheckCircle2, XCircle, RefreshCcw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";

const questions = [
  {
    q: "How many minutes of moderate exercise per week does the WHO recommend for adults?",
    options: ["75 min", "150 min", "300 min", "500 min"],
    a: 1,
  },
  {
    q: "Which nutrient is the body's primary source of energy?",
    options: ["Protein", "Carbohydrates", "Fats", "Fiber"],
    a: 1,
  },
  {
    q: "What is a normal resting adult heart rate?",
    options: ["30–50 bpm", "60–100 bpm", "100–140 bpm", "140–180 bpm"],
    a: 1,
  },
];

export const QuizPage = () => {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[idx];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.a) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= questions.length) setDone(true);
      else {
        setIdx(idx + 1);
        setPicked(null);
      }
    }, 900);
  };

  const reset = () => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        icon={<Brain className="h-5 w-5 text-primary-foreground" />}
        eyebrow="Learn & earn"
        title="Awareness Quiz"
        description="Quick, evidence-based health questions to sharpen your knowledge."
      />

      <div className="glass rounded-2xl p-6 shadow-card">
        {!done ? (
          <>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-secondary/60 border border-border/60 text-muted-foreground">
                Question {idx + 1} of {questions.length}
              </span>
              <span className="px-3 py-1 rounded-full border border-teal/40 text-teal bg-teal/10 font-medium">
                Score: {score}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-brand transition-all duration-500"
                style={{ width: `${(idx / questions.length) * 100}%` }}
              />
            </div>
            <h3 className="text-lg font-semibold mb-5 leading-snug">{q.q}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {q.options.map((opt, i) => {
                const isCorrect = picked !== null && i === q.a;
                const isWrong = picked === i && i !== q.a;
                return (
                  <button
                    key={opt}
                    onClick={() => choose(i)}
                    className={cn(
                      "text-left px-4 py-3 rounded-2xl border transition-all bg-secondary/30",
                      picked === null && "border-border/60 hover:border-primary/50 hover:bg-secondary/60",
                      isCorrect && "border-emerald/60 bg-emerald/15",
                      isWrong && "border-rose-500/60 bg-rose-500/15",
                      picked !== null && !isCorrect && !isWrong && "border-border/40 opacity-60",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm">{opt}</span>
                      {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald" />}
                      {isWrong && <XCircle className="h-4 w-4 text-rose-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-brand grid place-items-center shadow-glow mb-4">
              <Brain className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-1">
              You scored <span className="text-gradient-brand">{score}/{questions.length}</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-5">Great work! +{score * 50} health points credited.</p>
            <button
              onClick={reset}
              className="h-11 px-5 rounded-full bg-gradient-brand text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition inline-flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" /> Retake quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
