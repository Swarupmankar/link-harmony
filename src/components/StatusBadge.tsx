import { motion } from "framer-motion";

interface StatusBadgeProps {
  status: "pending" | "downloaded" | "scraped";
}

const statusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-muted",
    text: "text-muted-foreground",
  },
  downloaded: {
    label: "Downloaded",
    bg: "bg-info/10",
    text: "text-info",
  },
  scraped: {
    label: "Scraped",
    bg: "bg-success/10",
    text: "text-success",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <motion.span
      key={status}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </motion.span>
  );
}
