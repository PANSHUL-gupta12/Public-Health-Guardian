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
  <div className={cn("flex items-start justify-between gap-4 flex-wrap mb-5", className)}>
    <div className="flex items-start gap-3">
      {icon && (
        <div className="h-11 w-11 rounded-xl bg-gradient-brand grid place-items-center shadow-glow shrink-0">
          {icon}
        </div>
      )}
      <div>
        {eyebrow && (
          <div className="text-[11px] uppercase tracking-[0.18em] text-primary/80 font-medium mb-0.5">
            {eyebrow}
          </div>
        )}
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight leading-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>}
      </div>
    </div>
    {actions}
  </div>
);
