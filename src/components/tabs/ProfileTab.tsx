import { motion } from "framer-motion";
import { User, Link, Calendar, LogOut, ChevronRight, Settings, Moon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { AppButton } from "@/components/AppButton";
import { useToastNotification } from "@/components/ToastProvider";
import { mockProfile } from "@/data/mockData";

export function ProfileTab() {
  const profile = mockProfile;
  const { showToast } = useToastNotification();

  const handleLogout = () => {
    showToast("info", "Logout clicked (UI only)");
  };

  const menuItems = [
    { icon: Settings, label: "Settings", action: () => showToast("info", "Settings") },
    { icon: Moon, label: "Appearance", action: () => showToast("info", "Appearance") },
  ];

  return (
    <div className="px-4 py-6 pb-24 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      </motion.div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-primary" />
            </div>

            {/* Username */}
            <h2 className="text-xl font-bold text-foreground">{profile.username}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Member since {profile.joinedDate}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-muted">
              <Link className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {profile.totalLinks.toLocaleString()} links saved
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Card */}
      <Card variant="premium">
        <CardContent className="pt-5 pb-5">
          <div className="text-premium-foreground">
            <h3 className="text-xl font-bold mb-1">Go Premium</h3>
            <p className="text-sm opacity-80 mb-4">
              Unlimited storage, advanced features, and priority support
            </p>
            <AppButton variant="primary" size="sm">
              Upgrade Now
            </AppButton>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card>
        <CardContent className="py-2 px-0">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-2 rounded-xl bg-muted">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <span className="flex-1 text-left font-medium text-foreground">
                  {item.label}
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            );
          })}
        </CardContent>
      </Card>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AppButton
          variant="outline"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </AppButton>
      </motion.div>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground pt-4">
        Version 1.0.0
      </p>
    </div>
  );
}
