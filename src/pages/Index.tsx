import { useState } from "react";
import { BottomNav, TabType } from "@/components/BottomNav";
import { ToastProvider } from "@/components/ToastProvider";
import { LinksTab } from "@/components/tabs/LinksTab";
import { StatsTab } from "@/components/tabs/StatsTab";
import { FoldersTab } from "@/components/tabs/FoldersTab";
import { ProfileTab } from "@/components/tabs/ProfileTab";
import { AnimatePresence, motion } from "framer-motion";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("links");

  const renderTab = () => {
    switch (activeTab) {
      case "links":
        return <LinksTab />;
      case "stats":
        return <StatsTab />;
      case "folders":
        return <FoldersTab />;
      case "profile":
        return <ProfileTab />;
      default:
        return <LinksTab />;
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ToastProvider>
  );
};

export default Index;
