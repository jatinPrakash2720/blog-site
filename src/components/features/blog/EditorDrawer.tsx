// src/components/features/blog/EditorDrawer.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import ThemeToggle from "@/components/common/wrappers/ThemeToggle";
import {
  Save,
  Eye,
  Maximize,
  Edit,
  X,
  Undo,
  Redo,
} from "lucide-react";
import { useEditorContextSafe } from "@/store/editor";

interface EditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onPreview: () => void;
  onFullscreen: () => void;
  isPreviewMode?: boolean;
  onBackToEditor?: () => void;
}

export const EditorDrawer: React.FC<EditorDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  onPreview,
  onFullscreen,
  isPreviewMode = false,
  onBackToEditor,
}) => {
  const { title, setTitle, content, wordCount, editor } =
    useEditorContextSafe();

  // Undo/Redo handlers
  const handleUndo = () => {
    if (editor) {
      editor.chain().focus().undo().run();
    }
  };

  const handleRedo = () => {
    if (editor) {
      editor.chain().focus().redo().run();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-w-4xl mx-auto h-[85vh] flex flex-col p-0 rounded-t-3xl">
        {/* Editor Content - Fullscreen Style */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="p-8 flex-grow flex flex-col min-h-0">
            {/* Title Input - Fullscreen Style */}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="text-3xl md:text-4xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto bg-transparent placeholder:text-muted-foreground/40 mb-8 flex-shrink-0"
              disabled={isPreviewMode}
            />

            {/* Editor Container with Scroll */}
            <div className="flex-grow min-h-0 overflow-y-auto">
              <SimpleEditor
                initialContent={content}
                isEditable={!isPreviewMode}
                isDrawerMode={true}
              />
            </div>
          </div>
        </div>

        {/* Minimalistic Header - Moved to Bottom */}
        <div className="flex items-center justify-between p-4 border-t border-border rounded-b-3xl flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {Number(wordCount)} words
            </span>
            {/* Undo/Redo buttons on the left */}
            <div className="flex items-center gap-1">
              <Button
                onClick={handleUndo}
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                title="Undo"
                disabled={isPreviewMode}
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleRedo}
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                title="Redo"
                disabled={isPreviewMode}
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPreviewMode ? (
              <Button
                onClick={onBackToEditor}
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                title="Back to Editor"
              >
                <Edit className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <Button
                  onClick={onSave}
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  title="Save & Publish"
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  onClick={onPreview}
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </>
            )}

            <Button
              onClick={onFullscreen}
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8"
              title="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </Button>

            <ThemeToggle />

            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8"
              title="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
