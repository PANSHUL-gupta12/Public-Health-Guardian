import { useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { PageId } from "@/context/AuthContext";
import { ChatPage } from "./views/ChatPage";
import { FakeNewsPage } from "./views/FakeNewsPage";
import { QuizPage } from "./views/QuizPage";
import { RewardsPage } from "./views/RewardsPage";
import { DiseaseMapPage } from "./views/DiseaseMapPage";
import { AdminPanelPage } from "./views/AdminPanelPage";
import { FaqsPage } from "./views/FaqsPage";
import { ProfilePage } from "./views/ProfilePage";

const Shell = () => {
  const [active, setActive] = useState<PageId>("chat");

  const renderPage = () => {
    switch (active) {
      case "chat": return <ChatPage />;
      case "fake-news": return <FakeNewsPage />;
      case "quiz": return <QuizPage />;
      case "rewards": return <RewardsPage />;
      case "disease-map": return <DiseaseMapPage />;
      case "admin-panel": return <AdminPanelPage />;
      case "faqs": return <FaqsPage />;
      case "profile": return <ProfilePage />;
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <BackgroundOrbs />
      <TopBar />
      <div className="flex-1 flex min-h-0">
        <Sidebar active={active} onSelect={setActive} />
        <main className="flex-1 overflow-hidden p-4 pl-0 relative z-10">
          <div className="h-full animate-fade-in" key={active}>
            {active === "chat" ? (
              renderPage()
            ) : (
              <div className="h-full overflow-y-auto scrollbar-thin pr-1">{renderPage()}</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const Index = () => (
  <AuthProvider>
    <Shell />
  </AuthProvider>
);

export default Index;
