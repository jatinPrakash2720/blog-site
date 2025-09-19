"use client";

import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { CharacterCount, Selection } from "@tiptap/extensions";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

import { Edit } from "lucide-react";

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile";

// --- Components ---
import ThemeToggle from "@/components/common/wrappers/ThemeToggle";
import { Input } from "@/components/ui/input";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

import { BubbleMenu as BubbleMenuExtension } from "@tiptap/extension-bubble-menu";
import { EditorBubbleMenu } from "@/components/features/blog/BubbleMenu";

// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/store/auth";
import { Button as WrapperButton } from "@/components/common/wrappers/Button";
import { cn } from "@/lib/utils";
import {  useEditorContextSafe } from "@/store/editor";

interface SimpleEditorProps {
  // onSave?: (content: object) => void;
  // onPreview?: (currentContent: object) => void;
  onBackToEditor?: () => void;
  initialContent?: string;
  isEditable?: boolean;
  isDrawerMode?: boolean;
  isFullscreenMode?: boolean;
  // onFullscreen?: () => void;
  // onExitFullscreen?: () => void;
}

// Header for preview mode (non-fullscreen)
const PreviewHeader: React.FC<{ onBackToEditor?: () => void }> = ({
  onBackToEditor,
}) => (
  <header className="fixed top-0 left-0 right-0 z-50 p-4">
    <div className="mx-auto max-w-7xl flex justify-end items-center">
      <div className="flex items-center gap-2 p-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg">
        <WrapperButton
          onClick={onBackToEditor}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 rounded-full"
        >
          <Edit className="w-4 h-4" />
          <span>Back to Editor</span>
        </WrapperButton>
        <ThemeToggle />
      </div>
    </div>
  </header>
);

export function SimpleEditor({
  // onSave,
  // onPreview,
  onBackToEditor,
  initialContent,
  isEditable = true,
  isDrawerMode = false,
  isFullscreenMode = false,
  // onFullscreen,
  // onExitFullscreen,
}: SimpleEditorProps) {
  const { setEditor, setContent, setWordCount, title, setTitle } =
    useEditorContextSafe();
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main");
  // const navigate = useNavigate();
  // const { currentUser } = useAuth();
  // const handleGoBack = () => navigate(-1);

  const editor = useEditor({
    editable: isEditable,
    content: initialContent
      ? JSON.parse(initialContent)
      : `<h1>Start Writing...</h1>`,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: cn(
          "simple-editor",
          isDrawerMode && "drawer-mode fullscreen-style", // Add fullscreen-style class
          isFullscreenMode && "fullscreen-mode"
        ),
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      BubbleMenuExtension.configure({
        pluginKey: "bubbleMenu",
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      CharacterCount,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    onUpdate: ({ editor }) => {
      setContent(JSON.stringify(editor.getJSON()));
      setWordCount(editor.storage.characterCount.words());
    },
  });

  React.useEffect(() => {
    setEditor(editor);
    return () => setEditor(null);
  }, [editor, setEditor]);

  // const handleSave = () => {
  //   console.log("SimpleEditor handleSave called");
  //   onSave?.(editor?.getJSON() || {});
  // };

  // const handlePreview = () => {
  //   console.log("SimpleEditor handlePreview called");
  //   if (!editor || !currentUser) return;
  //   onPreview?.(editor.getJSON());
  // };

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  const isPreviewMode = !isEditable;

  return (
    <div
      className={cn(
        "simple-editor-wrapper",
        isFullscreenMode && "fullscreen-wrapper"
      )}
    >
      {/* Header only for non-fullscreen preview mode */}
      {!isDrawerMode && !isFullscreenMode && isPreviewMode && (
        <PreviewHeader onBackToEditor={onBackToEditor} />
      )}

      {/* Fullscreen Editor Container */}
      {isFullscreenMode ? (
        <div className="fullscreen-editor-container">
          {/* Title Input for Fullscreen */}
          <div className="fullscreen-title-section">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="text-4xl md:text-5xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto bg-transparent placeholder:text-muted-foreground/40"
              disabled={isPreviewMode}
            />
          </div>

          {/* Editor Content */}
          <div className="relative flex-1">
            <EditorContext.Provider value={{ editor }}>
              {/* Bubble Menu - only show in editable mode */}
              {isEditable && (
                <EditorBubbleMenu
                  editor={editor}
                  onHighlighterClick={() => setMobileView("highlighter")}
                  onLinkClick={() => setMobileView("link")}
                  // onGoBack={handleGoBack}
                  isMobile={isMobile}
                  // onSave={handleSave}
                  // onPreview={handlePreview}
                />
              )}

              <EditorContent
                editor={editor}
                role="presentation"
                className="fullscreen-editor-content"
              />
            </EditorContext.Provider>
          </div>
        </div>
      ) : (
        /* Regular Editor Content */
        <EditorContext.Provider value={{ editor }}>
          {/* Bubble Menu - only show in editable mode */}
          {isEditable && (
            <EditorBubbleMenu
              editor={editor}
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              // onGoBack={handleGoBack}
              isMobile={isMobile}
              // onSave={handleSave}
              // onPreview={handlePreview}
            />
          )}

          <EditorContent
            editor={editor}
            role="presentation"
            className={cn(
              "simple-editor-content",
              !isDrawerMode && !isFullscreenMode && isPreviewMode && "pt-24",
              isDrawerMode && "drawer-content"
            )}
          />
        </EditorContext.Provider>
      )}
    </div>
  );
}
