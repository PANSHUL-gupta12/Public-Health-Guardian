import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  icon?: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({ icon, eyebrow, title, description, actions, className }: Props) => (
  <div className={cn("flex items-start justify-between gap-4 flex-wrap", className)}>
    <div className="flex items-start gap-4">
      {icon && (
        <div className="h-12 w-12 rounded-2xl bg-gradient-brand grid place-items-center shadow-glow shrink-0">
          {icon}
        </div>
      )}
      <div>
        {eyebrow && (
          <div className="text-xs uppercase tracking-[0.18em] text-primary/80 font-medium">{eyebrow}</div>
        )}
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          <span className="text-gradient-brand">{title}</span>
        </h1>
        {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>}
      </div>
    </div>
    {actions}
  </div>
);
