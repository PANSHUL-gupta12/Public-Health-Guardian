import { useState, useEffect, useCallback } from "react";
import {
  Brain,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";
import { getQuizModel } from "@/lib/gemini";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  options: string[];
  correct_index: number;
  category?: string;
}

const fallbackQuestions: Question[] = [
  {
    question:
      "How many minutes of moderate exercise per week does the WHO recommend for adults?",
    options: ["75 min", "150 min", "300 min", "500 min"],
    correct_index: 1,
  },
  {
    question:
      "Which nutrient is the body's primary source of energy?",
    options: ["Protein", "Carbohydrates", "Fats", "Fiber"],
    correct_index: 1,
  },
  {
    question: "What is a normal resting adult heart rate?",
    options: ["30–50 bpm", "60–100 bpm", "100–140 bpm", "140–180 bpm"],
    correct_index: 1,
  },
  {
    question: "How many glasses of water should an average adult drink daily?",
    options: ["2-3 glasses", "4-5 glasses", "6-8 glasses", "10-12 glasses"],
    correct_index: 2,
  },
  {
    question: "Which vitamin is primarily produced when skin is exposed to sunlight?",
    options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
    correct_index: 3,
  },
];

const QUIZ_CACHE_KEY = "health_quiz_cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms

export const QuizPage = () => {
  const { profile } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Try loading from Supabase first
      const { data: dbQuestions } = await supabase
        .from("quizzes")
        .select("*")
        .limit(5)
        .order("created_at", { ascending: false });

      if (dbQuestions && dbQuestions.length >= 3) {
        console.log("[Quiz] Loaded from Supabase");
        setQuestions(
          dbQuestions.map((q) => ({
            question: q.question,
            options: q.options as string[],
            correct_index: q.correct_index,
            category: q.category || undefined,
          }))
        );
        setLoading(false);
        return;
      }

      // 2. Try localStorage cache next
      const cached = localStorage.getItem(QUIZ_CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > CACHE_DURATION;
          if (!isExpired) {
            console.log("[Quiz] Loaded from local cache");
            setQuestions(data);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("[Quiz] Failed to parse cache", e);
        }
      }

      // 3. If no DB or valid cache, try Gemini to generate
      try {
        console.log("[Quiz] Fetching fresh questions from Gemini...");
        const model = getQuizModel();
        const result = await model.generateContent(
          "Generate 5 public health awareness quiz questions. Topics: nutrition, exercise, disease prevention, mental health, hygiene."
        );
        const text = result.response.text();
        const cleaned = text
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .trim();
        const generated: Question[] = JSON.parse(cleaned);

        if (Array.isArray(generated) && generated.length > 0) {
          // Save to local cache
          localStorage.setItem(QUIZ_CACHE_KEY, JSON.stringify({
            data: generated,
            timestamp: Date.now()
          }));

          setQuestions(generated);

          // Background save to Supabase for other users/future use
          const toInsert = generated.map((q) => ({
            question: q.question,
            options: q.options,
            correct_index: q.correct_index,
            category: q.category || null,
          }));
          supabase.from("quizzes").insert(toInsert).then(() => {});

          setLoading(false);
          return;
        }
      } catch (genErr) {
        console.warn("Gemini quiz generation failed, using fallbacks:", genErr);
      }

      // 4. Fallback to hardcoded questions
      setQuestions(fallbackQuestions);
    } catch (err) {
      console.error("Error loading quiz:", err);
      setQuestions(fallbackQuestions);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const q = questions[idx];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correct_index) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        finishQuiz();
      } else {
        setIdx(idx + 1);
        setPicked(null);
      }
    }, 900);
  };

  const finishQuiz = async () => {
    setDone(true);
    const pointsEarned = score * 50;

    if (profile) {
      setSaving(true);
      try {
        // Save quiz score
        await supabase.from("quiz_scores").insert({
          user_id: profile.id,
          score,
          total: questions.length,
          points_earned: pointsEarned,
        });

        // Update user points
        await supabase
          .from("profiles")
          .update({ points: (profile.points || 0) + pointsEarned })
          .eq("id", profile.id);

        // Log activity
        await supabase.from("activity_logs").insert({
          user_id: profile.id,
          description: `Completed quiz — scored ${score}/${questions.length}`,
          points_delta: pointsEarned,
        });
      } catch (err) {
        console.error("Error saving quiz results:", err);
      } finally {
        setSaving(false);
      }
    }
  };

  const reset = () => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    loadQuestions();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <PageHeader
          icon={<Brain className="h-5 w-5 text-primary-foreground" />}
          eyebrow="Learn & earn"
          title="Awareness Quiz"
          description="Loading quiz questions..."
        />
        <div className="glass rounded-2xl p-12 shadow-card flex items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <span className="text-muted-foreground">
            Generating questions...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        icon={<Brain className="h-5 w-5 text-primary-foreground" />}
        eyebrow="Learn & earn"
        title="Awareness Quiz"
        description="AI-generated health questions to sharpen your knowledge. Earn points for correct answers!"
      />

      <div className="glass rounded-2xl p-6 shadow-card">
        {!done ? (
          q && (
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
                  style={{
                    width: `${((idx + (picked !== null ? 1 : 0)) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold mb-5 leading-snug">
                {q.question}
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {q.options.map((opt, i) => {
                  const isCorrect = picked !== null && i === q.correct_index;
                  const isWrong = picked === i && i !== q.correct_index;
                  return (
                    <button
                      key={opt}
                      onClick={() => choose(i)}
                      className={cn(
                        "text-left px-4 py-3 rounded-2xl border transition-all bg-secondary/30",
                        picked === null &&
                          "border-border/60 hover:border-primary/50 hover:bg-secondary/60",
                        isCorrect && "border-emerald/60 bg-emerald/15",
                        isWrong && "border-rose-500/60 bg-rose-500/15",
                        picked !== null &&
                          !isCorrect &&
                          !isWrong &&
                          "border-border/40 opacity-60"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm">{opt}</span>
                        {isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-emerald" />
                        )}
                        {isWrong && (
                          <XCircle className="h-4 w-4 text-rose-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )
        ) : (
          <div className="text-center py-6">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-brand grid place-items-center shadow-glow mb-4">
              <Brain className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-1">
              You scored{" "}
              <span className="text-gradient-brand">
                {score}/{questions.length}
              </span>
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Saving results...
                </span>
              ) : (
                `Great work! +${score * 50} health points credited.`
              )}
            </p>
            <button
              onClick={reset}
              className="h-11 px-5 rounded-full bg-gradient-brand text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition inline-flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" /> New quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
