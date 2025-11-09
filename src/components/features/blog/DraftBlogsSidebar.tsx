"use client";

import React from "react";
import { Link } from "react-router-dom";
import { X, FileText, Edit2, Square, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Blog } from "@/types/apisInterfaces/api";

interface DraftBlogsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleSidebar?: () => void;
}

// Hardcoded draft blogs data
const hardcodedDrafts: Blog[] = [
  {
    _id: "draft-1",
    title: "Getting Started with React and TypeScript",
    slug: "getting-started-with-react-and-typescript",
    excerpt: "Learn how to set up a modern React application with TypeScript...",
    content: "<p>This is draft content...</p>",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    owner: {
      _id: "user-1",
      username: "johndoe",
      fullName: "John Doe",
      email: "john@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      verifyCode: "",
      verifyCodeExpiry: new Date(),
    },
    views: 0,
    isPublished: false,
    status: "draft",
    categories: [
      { _id: "cat-1", name: "Technology", slug: "technology", parent: null, blogCount: 10 },
    ],
    likeCount: 0,
    commentCount: 0,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
  },
  {
    _id: "draft-2",
    title: "Advanced CSS Techniques for Modern Web Design",
    slug: "advanced-css-techniques",
    excerpt: "Discover powerful CSS techniques that will take your web design to the next level...",
    content: "<p>This is draft content...</p>",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    owner: {
      _id: "user-1",
      username: "johndoe",
      fullName: "John Doe",
      email: "john@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      verifyCode: "",
      verifyCodeExpiry: new Date(),
    },
    views: 0,
    isPublished: false,
    status: "draft",
    categories: [
      { _id: "cat-2", name: "Design", slug: "design", parent: null, blogCount: 8 },
    ],
    likeCount: 0,
    commentCount: 0,
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-22T16:20:00Z",
  },
  {
    _id: "draft-3",
    title: "Understanding JavaScript Closures and Scope",
    slug: "understanding-javascript-closures",
    excerpt: "A deep dive into JavaScript closures and how they work in modern development...",
    content: "<p>This is draft content...</p>",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    owner: {
      _id: "user-1",
      username: "johndoe",
      fullName: "John Doe",
      email: "john@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      verifyCode: "",
      verifyCodeExpiry: new Date(),
    },
    views: 0,
    isPublished: false,
    status: "draft",
    categories: [
      { _id: "cat-1", name: "Technology", slug: "technology", parent: null, blogCount: 10 },
    ],
    likeCount: 0,
    commentCount: 0,
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-19T13:30:00Z",
  },
  {
    _id: "draft-4",
    title: "Building Scalable APIs with Node.js",
    slug: "building-scalable-apis-nodejs",
    excerpt: "Learn how to build robust and scalable REST APIs using Node.js and Express...",
    content: "<p>This is draft content...</p>",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    owner: {
      _id: "user-1",
      username: "johndoe",
      fullName: "John Doe",
      email: "john@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      verifyCode: "",
      verifyCodeExpiry: new Date(),
    },
    views: 0,
    isPublished: false,
    status: "draft",
    categories: [
      { _id: "cat-1", name: "Technology", slug: "technology", parent: null, blogCount: 10 },
    ],
    likeCount: 0,
    commentCount: 0,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-21T10:15:00Z",
  },
  {
    _id: "draft-5",
    title: "The Art of User Experience Design",
    slug: "art-of-user-experience-design",
    excerpt: "Explore the principles and practices of creating exceptional user experiences...",
    content: "<p>This is draft content...</p>",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    owner: {
      _id: "user-1",
      username: "johndoe",
      fullName: "John Doe",
      email: "john@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      verifyCode: "",
      verifyCodeExpiry: new Date(),
    },
    views: 0,
    isPublished: false,
    status: "draft",
    categories: [
      { _id: "cat-2", name: "Design", slug: "design", parent: null, blogCount: 8 },
    ],
    likeCount: 0,
    commentCount: 0,
    createdAt: "2024-01-08T12:00:00Z",
    updatedAt: "2024-01-17T15:45:00Z",
  },
];

const DraftBlogsSidebar: React.FC<DraftBlogsSidebarProps> = ({
  isOpen,
  onClose,
  onToggleSidebar,
}) => {
  // Sort drafts by date (most recent first)
  const sortedDrafts = [...hardcodedDrafts].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA; // Most recent first
  });

  const sidebarRef = React.useRef<HTMLElement>(null);

  // Close sidebar when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) return;
      
      const target = event.target as HTMLElement;
      const sidebar = sidebarRef.current;
      const burgerButton = target.closest('button[title="Toggle Sidebar"]');
      
      // Don't close if clicking inside sidebar or on burger button
      if (sidebar && sidebar.contains(target)) return;
      if (burgerButton) return;
      
      // Close sidebar when clicking outside
      onClose();
    };

    if (isOpen) {
      // Use setTimeout to avoid closing immediately when opening
      const timeout = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeout);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop - Mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[45] lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Backdrop - Desktop (transparent, for click outside) */}
      {isOpen && (
        <div
          className="hidden lg:block fixed inset-0 bg-transparent z-[44]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed left-0 w-[90%] max-w-[400px] z-[50]",
          // Start below Header1 (64px = 16 units)
          "top-16 h-[calc(100vh-64px)]",
          "bg-background/95 dark:bg-background/95 backdrop-blur-lg",
          "border-r border-border/20 dark:border-white/10",
          "shadow-2xl",
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:fixed lg:z-[45]",
          !isOpen && "lg:hidden",
          "flex flex-col"
        )}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-border/20 dark:border-white/10 flex items-center justify-between">
          {/* Hamburger menu icon - closes sidebar */}
          <button
            onClick={onToggleSidebar || onClose}
            className="h-7 lg:h-8 px-2 lg:px-2.5 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30 flex items-center justify-center transition-colors"
            aria-label="Close sidebar"
          >
            <Menu className="h-3 w-3 lg:h-4 lg:w-4 text-foreground/80" />
          </button>
          
          {/* Search icon */}
          <button
            className="h-8 w-8 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30 flex items-center justify-center transition-colors ml-auto"
            aria-label="Search drafts"
          >
            <Search className="h-4 w-4 text-foreground/70" />
          </button>
          
          {/* Close button - Mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden h-8 w-8 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30 flex items-center justify-center transition-colors ml-2"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4 text-foreground/70" />
          </button>
        </div>

        {/* New Draft Button */}
        <div className="px-4 py-3 border-b border-border/20 dark:border-white/10">
          <Link
            to="/editor"
            onClick={onClose}
            className={cn(
              "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg",
              "bg-muted/30 dark:bg-muted/20",
              "border border-border/20 dark:border-white/10",
              "hover:bg-muted/50 dark:hover:bg-muted/30",
              "transition-colors duration-200",
              "text-foreground text-sm font-medium"
            )}
          >
            <div className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              <span>New Draft</span>
            </div>
            <Square className="h-4 w-4 opacity-60" />
          </Link>
        </div>


        {/* Recent Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recent
            </h2>
          </div>
          
          <div className="px-2">
            {sortedDrafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                <FileText className="h-8 w-8 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-muted-foreground mb-1">No drafts yet</p>
                <p className="text-xs text-muted-foreground/70">
                  Start writing to see your drafts here
                </p>
              </div>
            ) : (
              sortedDrafts.map((draft) => (
                <Link
                  key={draft._id}
                  to={`/editor?id=${draft._id}`}
                  onClick={onClose}
                  className={cn(
                    "block px-3 py-2.5 rounded-lg",
                    "text-sm text-foreground/80",
                    "hover:bg-muted/50 dark:hover:bg-muted/30",
                    "transition-colors duration-200",
                    "cursor-pointer",
                    "truncate"
                  )}
                  title={draft.title}
                >
                  {draft.title}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Footer - Settings & Help */}
        <div className="px-4 py-4 border-t border-border/20 dark:border-white/10">
          <button
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg",
              "text-sm text-foreground/80",
              "hover:bg-muted/50 dark:hover:bg-muted/30",
              "transition-colors duration-200"
            )}
          >
            <div className="h-4 w-4 rounded-full bg-muted-foreground/20 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/40"></div>
            </div>
            <span>Settings & help</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DraftBlogsSidebar;

