import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Download, X, Trash2, Copy, ExternalLink, LayoutGrid, LayoutList, Filter } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { AppButton } from "@/components/AppButton";
import { StatusBadge } from "@/components/StatusBadge";
import { useToastNotification } from "@/components/ToastProvider";
import { UrlItem, mockUrls as initialUrls } from "@/data/mockData";

type FilterType = "all" | "pending" | "downloaded" | "scraped";
type ViewType = "list" | "grid";

export function LinksTab() {
  const [urls, setUrls] = useState<UrlItem[]>(initialUrls);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [viewType, setViewType] = useState<ViewType>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { showToast } = useToastNotification();

  const filteredUrls = useMemo(() => {
    let result = urls;
    
    if (filter !== "all") {
      result = result.filter((url) => url.status === filter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (url) => 
          url.title.toLowerCase().includes(query) || 
          url.url.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [urls, filter, searchQuery]);

  const handleAddLink = () => {
    if (!inputValue.trim()) {
      setError("Please enter a valid URL");
      return;
    }

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
      thumbnail: `https://picsum.photos/seed/${Date.now()}/200/150`,
    };

    setUrls((prev) => [newUrl, ...prev]);
    setInputValue("");
    setError("");
    showToast("success", "Link added successfully");

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

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Downloaded", value: "downloaded" },
    { label: "Scraped", value: "scraped" },
  ];

  return (
    <div className="px-4 py-6 pb-24 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-extrabold text-foreground">My Links</h1>
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
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-destructive"
              >
                {error}
              </motion.p>
            )}
            <div className="flex gap-2">
              <AppButton onClick={handleAddLink} variant="primary" className="flex-1">
                <Plus className="w-4 h-4" />
                Add
              </AppButton>
              <AppButton 
                variant={showSearch ? "primary" : "secondary"} 
                size="icon"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="w-4 h-4" />
              </AppButton>
            </div>
            
            {/* Search Input */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search links..."
                    className="w-full h-11 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Filters & View Toggle */}
      <div className="space-y-3">
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                filter === f.value
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground shadow-soft"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {filteredUrls.length} link{filteredUrls.length !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-1 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setViewType("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewType === "list" ? "bg-card shadow-sm" : ""
              }`}
            >
              <LayoutList className={`w-4 h-4 ${viewType === "list" ? "text-foreground" : "text-muted-foreground"}`} />
            </button>
            <button
              onClick={() => setViewType("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewType === "grid" ? "bg-card shadow-sm" : ""
              }`}
            >
              <LayoutGrid className={`w-4 h-4 ${viewType === "grid" ? "text-foreground" : "text-muted-foreground"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* URL List/Grid */}
      <AnimatePresence mode="popLayout">
        {viewType === "list" ? (
          <div className="space-y-3">
            {filteredUrls.map((url, index) => (
              <motion.div
                key={url.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card animate={false}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={url.thumbnail || `https://picsum.photos/seed/${url.id}/200/150`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-foreground truncate text-sm">
                              {url.title}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {url.url}
                            </p>
                          </div>
                          <StatusBadge status={url.status} />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <AppButton
                            variant="secondary"
                            size="icon-sm"
                            onClick={() => handleStatusChange(url.id, "downloaded")}
                            disabled={url.status === "downloaded"}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </AppButton>
                          <AppButton
                            variant="secondary"
                            size="icon-sm"
                            onClick={() => handleStatusChange(url.id, "scraped")}
                            disabled={url.status === "scraped"}
                          >
                            <X className="w-3.5 h-3.5" />
                          </AppButton>
                          <div className="flex-1" />
                          <AppButton
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleCopy(url.url)}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </AppButton>
                          <AppButton
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleOpen(url.url)}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </AppButton>
                          <AppButton
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDelete(url.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </AppButton>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredUrls.map((url, index) => (
              <motion.div
                key={url.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card animate={false}>
                  {/* Thumbnail */}
                  <div className="aspect-[4/3] rounded-t-2xl overflow-hidden bg-muted">
                    <img
                      src={url.thumbnail || `https://picsum.photos/seed/${url.id}/200/150`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-3 pb-3 px-3">
                    {/* Status Badge - moved below image */}
                    <div className="mb-2">
                      <StatusBadge status={url.status} />
                    </div>
                    <h3 className="font-bold text-foreground text-xs line-clamp-2 mb-2">
                      {url.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <AppButton
                        variant="secondary"
                        size="icon-sm"
                        onClick={() => handleStatusChange(url.id, "downloaded")}
                        disabled={url.status === "downloaded"}
                      >
                        <Download className="w-3 h-3" />
                      </AppButton>
                      <AppButton
                        variant="secondary"
                        size="icon-sm"
                        onClick={() => handleStatusChange(url.id, "scraped")}
                        disabled={url.status === "scraped"}
                      >
                        <X className="w-3 h-3" />
                      </AppButton>
                      <div className="flex-1" />
                      <AppButton
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(url.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </AppButton>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {filteredUrls.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Filter className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No links found</p>
          <p className="text-sm text-muted-foreground/70">
            {filter !== "all" ? "Try changing the filter" : "Add your first link above"}
          </p>
        </motion.div>
      )}
    </div>
  );
}
