"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogs } from "@/store/blog";
// import { useAuth } from "@/store/auth";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import {
  BlogDetailsDrawer,
  type BlogDetailsData,
} from "@/components/features/blog/BlogDetailsDrawer";
import type { Blog } from "@/types/apisInterfaces/api";
import Loader from "@/components/ui/Loader";
import Header from "@/components/layout/Header";
import { useEditorContextSafe } from "@/store/editor";

type EditorView = "fullscreen" | "preview-fullscreen" | "publish";

interface EditorPageProps {
  isStandalone?: boolean;
}

const EditorPage: React.FC<EditorPageProps> = () => {
  // isStandalone is kept for future use but not currently needed
  const [view, setView] = useState<EditorView>("fullscreen");
  const [createdBlog, setCreatedBlog] = useState<Blog | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const { initiateBlogCreation, updateBlogDetailsAction, loading } = useBlogs();
  // const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { title, content } = useEditorContextSafe();

  // Always start in fullscreen mode
  useEffect(() => {
    setView("fullscreen");
  }, []);

  // --- HANDLERS ---

  const handleSave = async () => {
    console.log("EditorPage handleSave called");
    console.log("Title:", title, "Type:", typeof title);
    console.log("Content:", content, "Type:", typeof content);

    const newBlog = await initiateBlogCreation({
      title,
      content: content,
    });

    console.log("initiateBlogCreation returned:", newBlog);
    console.log("newBlog truthy check:", !!newBlog);

    if (newBlog) {
      console.log("Setting createdBlog and view to publish");
      setCreatedBlog(newBlog);
      setView("publish");
    } else {
      console.log("newBlog is falsy, showing alert");
      alert("Failed to save draft. Please try again.");
    }
  };

  const handlePreview = () => {
    console.log("EditorPage handlePreview called, current view:", view);
    if (view === "fullscreen") {
      console.log("Setting view to preview-fullscreen");
      setView("preview-fullscreen");
    }
  };

  const handleBackToEditor = () => {
    console.log("EditorPage handleBackToEditor called, current view:", view);
    if (view === "preview-fullscreen") {
      console.log("Setting view back to fullscreen");
      setView("fullscreen");
    }
  };

  // Remove handleFullscreen since we're always in fullscreen mode

  const handleFinalizeBlog = async (details: BlogDetailsData) => {
    if (!createdBlog) return;

    const success = await updateBlogDetailsAction({
      blogId: createdBlog._id,
      status: details.status,
      thumbnail: details.thumbnail,
    });

    if (success) {
      navigate(details.status === "published" ? `/home` : "/home");
    }
  };

  // --- RENDER LOGIC ---

  if (loading) return <Loader />;

  // Determine if we're in preview mode
  const isCurrentlyInPreview = view === "preview-fullscreen";

  console.log(
    "Current view:",
    view,
    "isCurrentlyInPreview:",
    isCurrentlyInPreview
  );

  // Publish details drawer - CHECK THIS FIRST
  if (view === "publish" && createdBlog) {
    return (
      <BlogDetailsDrawer
        isOpen={true}
        onOpenChange={(isOpen) => !isOpen && setView("fullscreen")}
        onSave={handleFinalizeBlog}
        initialData={createdBlog}
        mode="post-editor"
      />
    );
  }

  // Always render fullscreen mode
  return (
    <>
      <Header
        disableScrollEffect
        isEditorMode={true}
        isPreviewMode={view === "preview-fullscreen"}
        onSave={handleSave}
        onPreview={handlePreview}
        onBackToEditor={
          view === "preview-fullscreen" ? handleBackToEditor : undefined
        }
        isVisible={isHeaderVisible}
      />
      <SimpleEditor
        initialContent={content}
        isEditable={view !== "preview-fullscreen"}
        isFullscreenMode={true}
        onBackToEditor={handleBackToEditor}
        isHeaderVisible={isHeaderVisible}
        onToggleHeader={() => setIsHeaderVisible(!isHeaderVisible)}
      />
    </>
  );
};

export default EditorPage;
