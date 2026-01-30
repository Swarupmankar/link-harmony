import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FolderOpen,
  FileText,
  Plus,
  ChevronRight,
  MoreHorizontal,
  LayoutGrid,
  LayoutList,
  ChevronLeft,
  Edit,
} from "lucide-react";
import { Card, CardContent } from "@/components/Card";
import { AppButton } from "@/components/AppButton";
import { useToastNotification } from "@/components/ToastProvider";
import { NewFileModal } from "@/components/folders/NewFileModal";
import { FileEditorModal } from "@/components/folders/FileEditorModal";
import { FolderItem, FileItem, mockFolders as initialFolders } from "@/data/mockData";

type ViewType = "list" | "grid";

export function FoldersTab() {
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("list");
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [editingFile, setEditingFile] = useState<{ folderId: string; file: FileItem } | null>(null);
  const { showToast } = useToastNotification();

  const openFolder = folders.find((f) => f.id === openFolderId);

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

  const handleOpenFolder = (folderId: string) => {
    setOpenFolderId(folderId);
  };

  const handleBackToFolders = () => {
    setOpenFolderId(null);
  };

  const handleCreateFile = (fileName: string) => {
    if (!openFolderId) return;

    const newFile: FileItem = {
      id: Date.now().toString(),
      name: fileName,
      content: "",
    };

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === openFolderId
          ? { ...folder, files: [...folder.files, newFile] }
          : folder
      )
    );
    showToast("success", "File created");
  };

  const handleEditFile = (file: FileItem) => {
    if (!openFolderId) return;
    setEditingFile({ folderId: openFolderId, file });
  };

  const handleSaveFile = (fileName: string, content: string) => {
    if (!editingFile) return;

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === editingFile.folderId
          ? {
              ...folder,
              files: folder.files.map((f) =>
                f.id === editingFile.file.id
                  ? { ...f, name: fileName, content }
                  : f
              ),
            }
          : folder
      )
    );
    setEditingFile(null);
  };

  // Render folder contents view
  if (openFolder) {
    return (
      <div className="px-4 py-6 pb-24 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <button onClick={handleBackToFolders} className="p-1.5 rounded-lg hover:bg-muted">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <FolderOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-extrabold text-foreground">{openFolder.name}</h1>
          </div>
          <AppButton
            variant="primary"
            size="sm"
            onClick={() => setShowNewFileModal(true)}
          >
            <Plus className="w-4 h-4" />
            New File
          </AppButton>
        </motion.div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {openFolder.files.length} file{openFolder.files.length !== 1 ? "s" : ""}
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

        {/* Files List/Grid */}
        <AnimatePresence mode="popLayout">
          {viewType === "list" ? (
            <div className="space-y-2">
              {openFolder.files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card animate={false}>
                    <CardContent className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{file.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {file.content ? `${file.content.split("\n").length} lines` : "Empty file"}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleEditFile(file)}
                          className="p-2 rounded-lg hover:bg-muted"
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {openFolder.files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card animate={false}>
                    <CardContent className="py-4 px-3 text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 mx-auto mb-2 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm truncate mb-1">{file.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {file.content ? `${file.content.split("\n").length} lines` : "Empty"}
                      </p>
                      <AppButton 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditFile(file)}
                        className="w-full"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </AppButton>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {openFolder.files.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No files yet</p>
            <p className="text-sm text-muted-foreground/70">
              Create your first file to store links
            </p>
          </motion.div>
        )}

        {/* New File Modal */}
        <NewFileModal
          isOpen={showNewFileModal}
          onClose={() => setShowNewFileModal(false)}
          onCreateFile={handleCreateFile}
        />

        {/* File Editor Modal */}
        {editingFile && (
          <FileEditorModal
            isOpen={!!editingFile}
            onClose={() => setEditingFile(null)}
            fileName={editingFile.file.name}
            initialContent={editingFile.file.content}
            onSave={handleSaveFile}
          />
        )}
      </div>
    );
  }

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
          <h1 className="text-2xl font-extrabold text-foreground">Folders</h1>
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

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {folders.length} folder{folders.length !== 1 ? "s" : ""}
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

      {/* Folders List/Grid */}
      <AnimatePresence mode="popLayout">
        {viewType === "list" ? (
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
                    <button
                      onClick={() => handleOpenFolder(folder.id)}
                      className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors rounded-2xl"
                    >
                      <div className="p-2 rounded-xl bg-primary/10">
                        <Folder className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-foreground">{folder.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {folder.files.length} files
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {folders.map((folder, index) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card animate={false}>
                  <button
                    onClick={() => handleOpenFolder(folder.id)}
                    className="w-full text-center p-4"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                      <Folder className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm truncate">{folder.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {folder.files.length} files
                    </p>
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

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
