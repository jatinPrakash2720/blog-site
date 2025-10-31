"use client";

import { useEffect } from "react";
import { useBlogs } from "@/store/blog";
import BlogCard from "./BlogCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Loader from "@/components/ui/Loader";
import type { Blog } from "@/types/apisInterfaces/api";

interface HorizontalBlogListProps {
  title?: string;
  excludeBlogId?: string;
  limit?: number;
  category?: string;
  ownerId?: string;
}

export const HorizontalBlogList: React.FC<HorizontalBlogListProps> = ({
  title = "More Blogs",
  excludeBlogId,
  limit = 10,
  category,
  ownerId,
}) => {
  const { allBlogs, loading, fetchAllBlogs } = useBlogs();

  useEffect(() => {
    fetchAllBlogs({ limit, page: 1 });
  }, [fetchAllBlogs, limit]);

  // Filter out current blog and optionally filter by owner/category
  const filteredBlogs = allBlogs
    .filter((blog) => {
      if (excludeBlogId && blog._id === excludeBlogId) return false;
      if (ownerId && blog.owner._id !== ownerId) return false;
      if (category) {
        const hasCategory = blog.categories?.some(
          (cat) => cat._id === category || cat.slug === category
        );
        if (!hasCategory) return false;
      }
      return true;
    })
    .slice(0, limit);

  if (loading && filteredBlogs.length === 0) {
    return (
      <div className="w-full py-8">
        <Loader />
      </div>
    );
  }

  if (filteredBlogs.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <Link
          to="/home"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Horizontal Scrollable List */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border/20 scrollbar-track-transparent pb-4">
        <div className="flex gap-4 min-w-max">
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className="shrink-0 w-[320px]">
              <BlogCard blog={blog} layout="landscape" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
