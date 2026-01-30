import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { AppButton } from "@/components/AppButton";

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmDialog({ isOpen, onClose, onConfirm }: LogoutConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-sm bg-card rounded-2xl shadow-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 pb-0">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-destructive" />
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <h2 className="text-xl font-extrabold text-foreground mb-2">
              Log out?
            </h2>
            <p className="text-muted-foreground text-sm">
              Are you sure you want to log out? You'll need to sign in again to access your links.
            </p>
          </div>

          {/* Actions */}
          <div className="p-5 pt-6 flex gap-3">
            <AppButton
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </AppButton>
            <AppButton
              variant="primary"
              className="flex-1 bg-destructive hover:bg-destructive/90"
              onClick={onConfirm}
            >
              Log out
            </AppButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
