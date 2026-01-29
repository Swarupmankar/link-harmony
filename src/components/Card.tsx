import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "premium";
  animate?: boolean;
}

export function Card({ children, className = "", variant = "default", animate = true }: CardProps) {
  const baseClasses = "rounded-2xl overflow-hidden";
  
  const variantClasses = {
    default: "bg-card shadow-soft",
    premium: "bg-premium-gradient shadow-elevated",
  };

  const content = (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`px-5 pt-5 pb-3 ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={`px-5 pb-5 ${className}`}>
      {children}
    </div>
  );
}
