import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Download, Scan, Trash2, Copy, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { AppButton } from "@/components/AppButton";
import { StatusBadge } from "@/components/StatusBadge";
import { useToastNotification } from "@/components/ToastProvider";
import { UrlItem, mockUrls as initialUrls } from "@/data/mockData";

export function LinksTab() {
  const [urls, setUrls] = useState<UrlItem[]>(initialUrls);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const { showToast } = useToastNotification();

  const handleAddLink = () => {
    if (!inputValue.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    // Check for duplicate
    const isDuplicate = urls.some((url) => url.url === inputValue.trim());
    if (isDuplicate) {
      setError("This link is already added");
      showToast("warning", "Duplicate link detected");
      return;
    }

    const newUrl: UrlItem = {
      id: Date.now().toString(),
      url: inputValue.trim(),
      title: "Fetching title...",
      status: "pending",
      addedAt: new Date(),
    };

    setUrls((prev) => [newUrl, ...prev]);
    setInputValue("");
    setError("");
    showToast("success", "Link added successfully");

    // Simulate title fetch
    setTimeout(() => {
      setUrls((prev) =>
        prev.map((url) =>
          url.id === newUrl.id
            ? { ...url, title: `Page from ${new URL(inputValue).hostname}` }
            : url
        )
      );
    }, 1000);
  };

  const handleStatusChange = (id: string, newStatus: "downloaded" | "scraped") => {
    setUrls((prev) =>
      prev.map((url) => (url.id === id ? { ...url, status: newStatus } : url))
    );
    showToast("success", `Status changed to ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    setUrls((prev) => prev.filter((url) => url.id !== id));
    showToast("info", "Link removed");
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast("success", "Link copied to clipboard");
  };

  const handleOpen = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="px-4 py-6 pb-24 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-foreground">My Links</h1>
        <span className="text-sm text-muted-foreground">{urls.length} total</span>
      </motion.div>

      {/* Input Card */}
      <Card>
        <CardContent className="pt-5">
          <div className="space-y-3">
            <div className="relative">
              <input
                type="url"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError("");
                }}
                placeholder="Paste a link"
                className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-6 left-0 text-xs text-destructive"
                >
                  {error}
                </motion.p>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <AppButton onClick={handleAddLink} variant="primary" className="flex-1">
                <Plus className="w-4 h-4" />
                Add
              </AppButton>
              <AppButton variant="secondary" size="icon">
                <Search className="w-4 h-4" />
              </AppButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* URL List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {urls.map((url, index) => (
            <motion.div
              key={url.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card animate={false}>
                <CardContent className="pt-4 pb-4">
                  <div className="space-y-3">
                    {/* Title and Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {url.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                          {url.url}
                        </p>
                      </div>
                      <StatusBadge status={url.status} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <AppButton
                        variant="secondary"
                        size="icon-sm"
                        onClick={() => handleStatusChange(url.id, "downloaded")}
                        disabled={url.status === "downloaded"}
                      >
                        <Download className="w-4 h-4" />
                      </AppButton>
                      <AppButton
                        variant="secondary"
                        size="icon-sm"
                        onClick={() => handleStatusChange(url.id, "scraped")}
                        disabled={url.status === "scraped"}
                      >
                        <Scan className="w-4 h-4" />
                      </AppButton>
                      <div className="flex-1" />
                      <AppButton
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopy(url.url)}
                      >
                        <Copy className="w-4 h-4" />
                      </AppButton>
                      <AppButton
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleOpen(url.url)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </AppButton>
                      <AppButton
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(url.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </AppButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
