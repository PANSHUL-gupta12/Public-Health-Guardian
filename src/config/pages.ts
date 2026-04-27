import {
  MessageSquare,
  ShieldAlert,
  Brain,
  Trophy,
  Map,
  FileHeart,
  Settings2,
  HelpCircle,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { PageId } from "@/context/AuthContext";

export interface PageDef {
  id: PageId;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const pages: PageDef[] = [
  { id: "chat", label: "Chat", description: "AI Health Assistant", icon: MessageSquare },
  { id: "fake-news", label: "Fake News Detector", description: "Verify health claims", icon: ShieldAlert },
  { id: "quiz", label: "Awareness Quiz", description: "Test your knowledge", icon: Brain },
  { id: "rewards", label: "Rewards", description: "Earn health points", icon: Trophy },
  { id: "disease-map", label: "Disease Map", description: "Local health alerts", icon: Map },
  { id: "medical-records", label: "Medical Records", description: "Patient files", icon: FileHeart },
  { id: "admin-panel", label: "Admin Panel", description: "System management", icon: Settings2 },
  { id: "faqs", label: "FAQs", description: "Common questions", icon: HelpCircle },
  { id: "profile", label: "Profile", description: "Your health journey", icon: UserRound },
];
