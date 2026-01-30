import { useState } from "react";
import { motion } from "framer-motion";
import { User, Link, ChevronRight, Zap, Star, Pencil, ChevronLeft, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/Card";
import { AppButton } from "@/components/AppButton";
import { useToastNotification } from "@/components/ToastProvider";
import { useTheme } from "@/components/ThemeProvider";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { mockProfile } from "@/data/mockData";

export function ProfileTab() {
  const profile = mockProfile;
  const navigate = useNavigate();
  const { showToast } = useToastNotification();
  const { theme, setTheme } = useTheme();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const profileCompletion = 45;

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    showToast("info", "Logged out successfully");
    navigate("/login");
  };

  const themeOptions: { value: "light" | "dark" | "system"; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="px-4 py-6 pb-24 space-y-4">
      {/* Header - Happn style */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <button className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ fontFamily: "'Nunito', sans-serif" }}>
            linkup
          </h1>
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <User className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
        <button 
          onClick={() => showToast("info", "Edit profile")}
          className="flex items-center gap-1 text-sm font-semibold text-foreground"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>
      </motion.div>

      {/* Profile Completion Card - Happn style */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground mb-1">Mysterious profile</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-primary">{profileCompletion}</span>
                <span className="text-xl font-bold text-primary">%</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-golden-gradient rounded-full"
                />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                You're off to a good start, but users are looking for more links.
              </p>
              <AppButton variant="default" size="sm">
                Increase your reach
              </AppButton>
            </div>
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-muted overflow-hidden flex-shrink-0">
              <img
                src="https://picsum.photos/seed/profile/200/200"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Selector Card */}
      <Card>
        <CardContent className="py-4">
          <h3 className="text-lg font-bold text-foreground mb-3">Appearance</h3>
          <div className="flex gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  theme === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <option.icon className="w-5 h-5" />
                <span className="text-xs font-semibold">{option.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Premium Card - Dark with image like Happn */}
      <Card variant="premium">
        <CardContent className="pt-0 pb-0 px-0 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://picsum.photos/seed/premium/400/200"
              alt=""
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-premium/90 to-premium/70" />
          </div>
          <div className="relative p-5">
            <h3 className="text-2xl font-extrabold text-premium-foreground mb-1">
              linkup Premium
            </h3>
            <p className="text-sm text-premium-foreground/80 mb-4 max-w-[200px]">
              Unlimited storage, see who views your profile, and organize faster!
            </p>
            <AppButton variant="outline" size="sm" className="border-premium-foreground text-premium-foreground hover:bg-premium-foreground hover:text-premium">
              Upgrade your membership
            </AppButton>
          </div>
        </CardContent>
      </Card>

      {/* My Boosts Card */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">My Boosts</h3>
              <p className="text-sm text-muted-foreground">
                Your visibility will skyrocket for 24h
              </p>
              <AppButton variant="outline" size="sm" className="mt-3">
                Get a Boost
              </AppButton>
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <Zap className="w-12 h-12 text-destructive" fill="currentColor" />
                <Zap className="w-8 h-8 text-destructive absolute -right-1 -bottom-1" fill="currentColor" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My SuperLinks Card */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">My SuperLinks</h3>
              <p className="text-sm text-muted-foreground">
                5x more chances of getting clicks
              </p>
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-foreground text-background text-sm font-semibold">
                  2 SuperLinks left
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Star className="w-12 h-12 text-info" fill="currentColor" strokeWidth={0} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Link className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total links saved</p>
              <p className="text-xl font-bold text-foreground">{profile.totalLinks.toLocaleString()}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Card>
        <CardContent className="py-4">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-destructive font-semibold hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </CardContent>
      </Card>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground pt-4">
        Version 1.0.0
      </p>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
