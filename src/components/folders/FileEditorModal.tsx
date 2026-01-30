import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  Save, 
  FileText, 
  Link as LinkIcon, 
  ExternalLink, 
  Copy, 
  Trash2 
} from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { useToastNotification } from "@/components/ToastProvider";

interface ExtractedLink {
  id: string;
  url: string;
  domain: string;
}

interface FileEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  initialContent: string;
  onSave: (name: string, content: string) => void;
}

export function FileEditorModal({ 
  isOpen, 
  onClose, 
  fileName: initialFileName, 
  initialContent, 
  onSave 
}: FileEditorModalProps) {
  const [fileName, setFileName] = useState(initialFileName);
  const [content, setContent] = useState(initialContent);
  const { showToast } = useToastNotification();

  // Extract links from content
  const extractedLinks = useMemo((): ExtractedLink[] => {
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
    const matches = content.match(urlRegex) || [];
    const uniqueUrls = [...new Set(matches)];
    
    return uniqueUrls.map((url, index) => {
      let domain = url;
      try {
        domain = new URL(url).hostname;
      } catch {}
      return {
        id: `${index}-${url}`,
        url,
        domain,
      };
    });
  }, [content]);

  const lineCount = content.split("\n").length;

  const handleSave = () => {
    if (!fileName.trim()) {
      showToast("warning", "Please enter a file name");
      return;
    }
    onSave(fileName.trim(), content);
    showToast("success", "File saved successfully");
    onClose();
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast("success", "Link copied");
  };

  const handleVisitLink = (url: string) => {
    window.open(url, "_blank");
  };

  const handleRemoveLink = (url: string) => {
    const newContent = content.replace(url, "").replace(/\n\n+/g, "\n").trim();
    setContent(newContent);
    showToast("info", "Link removed");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <h1 className="text-lg font-bold text-foreground">Edit File</h1>
                <p className="text-xs text-muted-foreground">Manage your links and content</p>
              </div>
            </div>
          </div>
          <AppButton variant="primary" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save
          </AppButton>
        </div>

        {/* Content Area */}
        <div className="flex flex-col h-[calc(100vh-60px)] overflow-y-auto p-4 space-y-4">
          {/* File Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">File Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name..."
              className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-2 flex-1">
            <label className="text-sm font-semibold text-foreground">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your links here, one per line..."
              className="w-full h-48 min-h-[200px] p-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono text-sm"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Links will be automatically detected and extracted</span>
              <span>{lineCount} lines • {extractedLinks.length} links</span>
            </div>
          </div>

          {/* Extracted Links Section */}
          {extractedLinks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-base font-bold text-foreground">Extracted Links</h2>
                  <p className="text-xs text-muted-foreground">{extractedLinks.length} links found</p>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {extractedLinks.map((link) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-card border border-border shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <img 
                          src={`https://www.google.com/s2/favicons?domain=${link.domain}&sz=32`}
                          alt=""
                          className="w-5 h-5"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{link.domain}</p>
                        <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <AppButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVisitLink(link.url)}
                        className="flex-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Visit
                      </AppButton>
                      <AppButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopyLink(link.url)}
                        className="flex-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </AppButton>
                      <AppButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveLink(link.url)}
                        className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </AppButton>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Last Saved Info */}
          <p className="text-center text-xs text-muted-foreground py-2">
            Last saved: {new Date().toLocaleString()}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
