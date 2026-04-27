import { HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is Public Health Guardian a substitute for a doctor?",
    a: "No. We provide educational health information powered by trusted sources. Always consult a licensed clinician for diagnosis and treatment.",
  },
  {
    q: "How is my data protected?",
    a: "All conversations are encrypted in transit and at rest. Personal records are only accessible to authorized roles (e.g. Doctor, Admin) and never sold to third parties.",
  },
  {
    q: "Can I use the app without an account?",
    a: "Yes — Guests can browse the FAQs. Signing in unlocks the AI assistant, quizzes, and personalized features.",
  },
  {
    q: "How do I report misinformation?",
    a: "Use the Fake News Detector to verify a claim. Flagged items are reviewed by our moderation team and added to the public knowledge base.",
  },
  {
    q: "Where do disease alerts come from?",
    a: "We aggregate signals from public health agencies (e.g. WHO, CDC) and verified local reporting partners.",
  },
];

export const FaqsPage = () => (
  <div className="space-y-6">
    <PageHeader
      icon={<HelpCircle className="h-5 w-5 text-primary-foreground" />}
      eyebrow="Public access"
      title="Frequently Asked Questions"
      description="Everything you might want to know — open to all visitors, no sign-in required."
    />
    <div className="glass rounded-2xl p-6 shadow-card max-w-3xl">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
            <AccordionTrigger className="text-left hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
);
