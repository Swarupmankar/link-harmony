import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText } from "lucide-react";
import { AppButton } from "@/components/AppButton";

interface NewFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFile: (fileName: string) => void;
}

export function NewFileModal({ isOpen, onClose, onCreateFile }: NewFileModalProps) {
  const [fileName, setFileName] = useState("");

  const handleCreate = () => {
    if (!fileName.trim()) return;
    onCreateFile(fileName.trim().endsWith(".txt") ? fileName.trim() : `${fileName.trim()}.txt`);
    setFileName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-sm bg-card rounded-2xl shadow-elevated overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">New File</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">File Name</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name..."
                className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
              <p className="text-xs text-muted-foreground">.txt extension will be added automatically</p>
            </div>

            <div className="flex gap-2">
              <AppButton variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </AppButton>
              <AppButton 
                variant="primary" 
                onClick={handleCreate} 
                className="flex-1"
                disabled={!fileName.trim()}
              >
                Create File
              </AppButton>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
