import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Info, X, Copy, Link2 } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToastNotification() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastNotification must be used within ToastProvider");
  }
  return context;
}

const iconMap = {
  success: Check,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
};

const colorMap = {
  success: "bg-success text-success-foreground",
  error: "bg-destructive text-destructive-foreground",
  info: "bg-info text-info-foreground",
  warning: "bg-warning text-warning-foreground",
};

const barColorMap = {
  success: "bg-success-foreground/30",
  error: "bg-destructive-foreground/30",
  info: "bg-info-foreground/30",
  warning: "bg-warning-foreground/30",
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const Icon = iconMap[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="bg-card rounded-2xl shadow-elevated overflow-hidden mx-4">
        <div className="flex items-center gap-3 p-4">
          <div className={`p-2 rounded-full ${colorMap[toast.type]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <p className="flex-1 text-sm font-medium text-card-foreground">
            {toast.message}
          </p>
          <button
            onClick={onRemove}
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="h-1 bg-muted">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "linear" }}
            className={`h-full ${colorMap[toast.type]}`}
            onAnimationComplete={onRemove}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-0 right-0 z-[100] pointer-events-none">
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="sync">
            {toasts.slice(-3).map((toast) => (
              <div key={toast.id} className="mb-2 pointer-events-auto">
                <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
}
