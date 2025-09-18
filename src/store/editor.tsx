"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Editor } from "@tiptap/core";
import { type IEditorContext } from "@/types/context";

export const EditorContext = createContext<IEditorContext | undefined>(undefined);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  return context; // Return undefined instead of throwing error
};

// Optional: Create a safe hook that provides defaults
export const useEditorContextSafe = () => {
  const context = useContext(EditorContext);
  return (
    context || {
      editor: null,
      setEditor: () => {},
      wordCount: 0,
      setWordCount: () => {},
      isSaving: false,
      title: "",
      setTitle: () => {},
      content: "",
      setContent: () => {},
      handleSave: () => {},
      handlePreview: () => {},
    }
  );
};

export const EditorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [wordCount, setWordCount] = useState(0);
  // const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");

  const handleSave = () => console.log("Save triggered from context");
  const handlePreview = () => console.log("Preview triggered from context");

  const value = {
    editor,
    setEditor,
    wordCount,
    setWordCount,
    isSaving: false,
    title,
    setTitle,
    content,
    setContent,
    handleSave,
    handlePreview,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};
