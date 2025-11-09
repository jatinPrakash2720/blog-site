"use client";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBlogs } from "@/store/blog";
import { toast } from "sonner";
import { SimpleRepresenter } from "@/components/tiptap-templates/simple/simple-representer";
import { CommentSection } from "@/components/features/blog/CommentSection";
import { BlogStatsBar } from "@/components/features/blog/BlogStatsBar";
import Header1 from "@/components/layout/Header1";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const ReadPage = () => {
  const { blogId } = useParams();
  const { fetchSearchBlog, currentBlog } = useBlogs();

  useEffect(() => {
    async function fetchBlog() {
      try {
        if (!blogId) {
          return;
        }
        // Only fetch if blog is not already in context or if it's a different blog
        if (currentBlog && currentBlog._id === blogId) {
          return; // Blog already loaded, no need to fetch
        }
        const response = await fetchSearchBlog(blogId);
        if (!response.success) {
          toast.error(response.message);
        }
      } catch {
        toast.error("Error while fetching searched blog");
      }
    }

    fetchBlog();
  }, [blogId, fetchSearchBlog, currentBlog]);

  if (!currentBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.1] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix in='colorNoise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      {/* Header */}
      <Header1 />

      {/* Background with thumbnail */}
      {currentBlog.thumbnail && (
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat h-[40vh]"
          style={{ backgroundImage: `url(${currentBlog.thumbnail})` }}
        >
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-black/30" />
        </div>
      )}

      {/* Container with Editor and Comments */}
      <div
        className={cn(
          "simple-editor-container",
          "relative z-10",
          "max-w-[70%] w-full bg-background rounded-2xl",
          "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
          "border-2 border-border/80 dark:border-white/15",
          "overflow-y-auto",
          "flex flex-col gap-8 mx-auto my-8 mt-24",
          "max-md:max-w-[90%]"
        )}
      >
        {/* Editor Content */}
        <SimpleRepresenter
          title={currentBlog.title}
          initialContent={currentBlog.content}
          isEditable={false}
          showTitle={true}
          owner={currentBlog.owner}
          createdAt={currentBlog.createdAt}
        />

        {/* Comment Section */}
      </div>
      {blogId && currentBlog && (
        <div className="relative z-10 pb-12 mx-auto max-w-[70%]">
          {/* Blog Stats Bar */}
          <div className="bg-background/90 backdrop-blur-sm rounded-2xl border-2 border-border/80 dark:border-white/15 mb-4">
            <BlogStatsBar blog={currentBlog} />
          </div>
          {/* Comment Section */}
          <CommentSection blogId={blogId} />
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ReadPage;

