import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FolderOpen,
  FileText,
  Plus,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { AppButton } from "@/components/AppButton";
import { useToastNotification } from "@/components/ToastProvider";
import { FolderItem, FileItem, mockFolders as initialFolders } from "@/data/mockData";

export function FoldersTab() {
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const { showToast } = useToastNotification();

  const toggleFolder = (id: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id ? { ...folder, isExpanded: !folder.isExpanded } : folder
      )
    );
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: FolderItem = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      files: [],
      isExpanded: false,
    };

    setFolders((prev) => [...prev, newFolder]);
    setNewFolderName("");
    setShowNewFolder(false);
    showToast("success", "Folder created");
  };

  const addFileToFolder = (folderId: string) => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: `New File ${Date.now() % 1000}.txt`,
      content: "",
    };

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? { ...folder, files: [...folder.files, newFile], isExpanded: true }
          : folder
      )
    );
    showToast("success", "File added");
  };

  return (
    <div className="px-4 py-6 pb-24 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Folder className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Folders</h1>
        </div>
        <AppButton
          variant="primary"
          size="sm"
          onClick={() => setShowNewFolder(true)}
        >
          <Plus className="w-4 h-4" />
          New
        </AppButton>
      </motion.div>

      {/* New Folder Input */}
      <AnimatePresence>
        {showNewFolder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card animate={false}>
              <CardContent className="pt-4 pb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    className="flex-1 h-10 px-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && createFolder()}
                  />
                  <AppButton variant="primary" size="sm" onClick={createFolder}>
                    Create
                  </AppButton>
                  <AppButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewFolder(false)}
                  >
                    Cancel
                  </AppButton>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Folders List */}
      <div className="space-y-3">
        {folders.map((folder, index) => (
          <motion.div
            key={folder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card animate={false}>
              <CardContent className="py-0 px-0">
                {/* Folder Header */}
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors rounded-t-2xl"
                >
                  <div className="p-2 rounded-xl bg-primary/10">
                    {folder.isExpanded ? (
                      <FolderOpen className="w-5 h-5 text-primary" />
                    ) : (
                      <Folder className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">{folder.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {folder.files.length} files
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: folder.isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>

                {/* Files */}
                <AnimatePresence>
                  {folder.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2">
                        {folder.files.map((file) => (
                          <motion.div
                            key={file.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                          >
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="flex-1 text-sm text-foreground truncate">
                              {file.name}
                            </span>
                            <button className="p-1 rounded-full hover:bg-muted">
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </motion.div>
                        ))}
                        <button
                          onClick={() => addFileToFolder(folder.id)}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-sm">Add file</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {folders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Folder className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No folders yet</p>
          <p className="text-sm text-muted-foreground/70">
            Create your first folder to organize files
          </p>
        </motion.div>
      )}
    </div>
  );
}
