"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBlogs } from "@/store/blog";
import { useAuth } from "@/store/auth";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { EditorDrawer } from "@/components/features/blog/EditorDrawer";
import {
  BlogDetailsDrawer,
  type BlogDetailsData,
} from "@/components/features/blog/BlogDetailsDrawer";
import type { Blog } from "@/types/api";
import Loader from "@/components/ui/Loader";
import Header from "@/components/layout/Header";
import { useEditorContextSafe } from "@/store/editor";

type EditorView =
  | "drawer"
  | "fullscreen"
  | "preview-drawer"
  | "preview-fullscreen"
  | "publish";

interface EditorPageProps {
  isStandalone?: boolean;
}

const EditorPage: React.FC<EditorPageProps> = ({ isStandalone = false }) => {
  const [view, setView] = useState<EditorView>("drawer");
  const [createdBlog, setCreatedBlog] = useState<Blog | null>(null);

  const { initiateBlogCreation, updateBlogDetailsAction, loading } = useBlogs();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { title, content } = useEditorContextSafe();

  // Check if we're in standalone mode (fullscreen from another route)
  useEffect(() => {
    if (isStandalone) {
      setView("fullscreen");
    }
  }, [isStandalone]);

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
    if (view === "drawer") {
      setView("preview-drawer");
    } else if (view === "fullscreen") {
      console.log("Setting view to preview-fullscreen");
      setView("preview-fullscreen");
    }
  };

  const handleBackToEditor = () => {
    console.log("EditorPage handleBackToEditor called, current view:", view);
    if (view === "preview-drawer") {
      setView("drawer");
    } else if (view === "preview-fullscreen") {
      console.log("Setting view back to fullscreen");
      setView("fullscreen");
    }
  };

  const handleFullscreen = () => {
    // Navigate to standalone editor route for fullscreen
    navigate("/editor", {
      state: {
        returnPath: location.pathname,
        mode: "fullscreen",
      },
    });
  };

  const handleExitFullscreen = () => {
    // Return to the original path or default to home
    const returnPath = location.state?.returnPath || "/home";
    navigate(returnPath);
  };

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
  const isCurrentlyInPreview =
    view === "preview-fullscreen" || view === "preview-drawer";

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
        onOpenChange={(isOpen) =>
          !isOpen && setView(isStandalone ? "fullscreen" : "drawer")
        }
        onSave={handleFinalizeBlog}
        initialData={createdBlog}
        mode="post-editor"
      />
    );
  }

  // Fullscreen modes (standalone)
  if (isStandalone || view === "fullscreen") {
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
          onExitFullscreen={handleExitFullscreen}
        />
        <SimpleEditor
          initialContent={content}
          isEditable={view !== "preview-fullscreen"}
          isFullscreenMode={true}
          onSave={handleSave}
          onPreview={handlePreview}
          onBackToEditor={handleBackToEditor}
        />
      </>
    );
  }

  if (view === "preview-fullscreen") {
    return (
      <>
        <Header
          disableScrollEffect
          isEditorMode={true}
          isPreviewMode={true}
          onBackToEditor={handleBackToEditor}
          onExitFullscreen={handleExitFullscreen}
        />
        <SimpleEditor
          initialContent={content}
          isEditable={false}
          isFullscreenMode={true}
          onBackToEditor={handleBackToEditor}
        />
      </>
    );
  }

  // Preview drawer mode
  if (view === "preview-drawer") {
    return (
      <EditorDrawer
        isOpen={true}
        onClose={() => navigate(-1)}
        onSave={handleSave}
        onPreview={handlePreview}
        onFullscreen={handleFullscreen}
        isPreviewMode={true}
        onBackToEditor={handleBackToEditor}
      />
    );
  }

  // Default drawer mode
  return (
    <EditorDrawer
      isOpen={true}
      onClose={() => navigate(-1)}
      onSave={handleSave}
      onPreview={handlePreview}
      onFullscreen={handleFullscreen}
    />
  );
};

export default EditorPage;
