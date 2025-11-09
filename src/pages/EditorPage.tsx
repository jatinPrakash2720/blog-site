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
import Header1 from "@/components/layout/Header1";
import { useEditorContextSafe } from "@/store/editor";
import MobileNavBar from "@/components/layout/MobileNavBar";
import DraftBlogsSidebar from "@/components/features/blog/DraftBlogsSidebar";

type EditorView = "fullscreen" | "preview-fullscreen" | "publish";

interface EditorPageProps {
  isStandalone?: boolean;
}

const EditorPage: React.FC<EditorPageProps> = () => {
  // isStandalone is kept for future use but not currently needed
  const [view, setView] = useState<EditorView>("fullscreen");
  const [createdBlog, setCreatedBlog] = useState<Blog | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="min-h-screen relative">
      {/* Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.1] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix in='colorNoise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      {/* Header1 - All screen sizes */}
      <Header1
        disableScrollEffect
        isEditorMode={true}
        isPreviewMode={view === "preview-fullscreen"}
        onSave={handleSave}
        onPreview={handlePreview}
        onBackToEditor={
          view === "preview-fullscreen" ? handleBackToEditor : undefined
        }
        isVisible={true}
      />

      {/* Main Content Area with Sidebar */}
      <div className="relative">
        {/* Editor */}
        <SimpleEditor
          initialContent={content}
          isEditable={view !== "preview-fullscreen"}
          isFullscreenMode={true}
          onBackToEditor={handleBackToEditor}
          showNotesButton={view !== "preview-fullscreen"}
          showAISearchButton={view !== "preview-fullscreen"}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Drafts Sidebar */}
        <DraftBlogsSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Mobile Navigation Bar - Mobile and Tablet only */}
      <MobileNavBar />
    </div>
  );
};

export default EditorPage;
