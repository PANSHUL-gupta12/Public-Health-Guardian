import { useAuth, PageId } from "@/context/AuthContext";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  page: PageId;
  children: React.ReactNode;
  onSwitch: (id: PageId) => void;
}

export const AccessGuard = ({ page, children, onSwitch }: Props) => {
  const { hasAccess, role } = useAuth();
  if (hasAccess(page)) return <>{children}</>;
  return (
    <div className="grid place-items-center min-h-[60vh]">
      <div className="glass rounded-2xl p-8 max-w-md text-center shadow-card">
        <div className="h-14 w-14 mx-auto rounded-2xl bg-secondary grid place-items-center mb-4">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Restricted area</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Your current role <span className="text-foreground font-medium capitalize">{role}</span> doesn't have
          permission to view this page. Switch to a role that does, or browse the available sections.
        </p>
        <Button onClick={() => onSwitch("faqs")} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
          Go to FAQs
        </Button>
      </div>
    </div>
  );
};
