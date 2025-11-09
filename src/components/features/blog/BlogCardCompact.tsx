"use client";

import { useEffect, useRef, memo } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Blog } from "@/types/apisInterfaces/api";
import { gsap } from "gsap";

interface BlogCardCompactProps {
  blog: Blog;
}

const BlogCardCompact: React.FC<BlogCardCompactProps> = ({ blog }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);

  // Optimized animation - lighter and faster
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Link
      ref={cardRef}
      to={`/read/${blog._id}`}
      className="block relative group overflow-hidden rounded-2xl aspect-video w-full"
    >
      {/* Thumbnail as background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundImage: `url(${blog.thumbnail || "/placeholder.svg"})`,
        }}
      >
        {/* Gradient overlay - black to transparent (dark) / white to transparent (light) */}
        <div className="absolute inset-0 bg-linear-to-t from-white/70 via-white/20 to-transparent dark:from-black/90 dark:via-black/40 dark:to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4">
        {/* Top section: Owner and Likes/Comments */}
        <div className="flex items-start justify-between">
          {/* Owner Avatar */}
          <div className="flex items-center gap-2 dark:bg-black/60 bg-white/60 px-4 py-2 rounded-3xl justify-center ">
            <Avatar className="h-5 w-5 ring-2 ring-black/30 dark:ring-white/60">
              <AvatarImage src={blog.owner.avatar} alt={blog.owner.fullName} />
              <AvatarFallback className="text-sm bg-black/20 dark:bg-white/20 text-white dark:text-black font-semibold">
                {getInitials(blog.owner.fullName || blog.owner.username)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-black dark:text-white">
              {blog.owner.fullName || blog.owner.username}
            </span>
          </div>

          {/* Likes and Comments - extreme opposite of Owner name */}
        </div>

        {/* Categories below owner */}
        {blog.categories && blog.categories.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-2">
            {blog.categories.slice(0, 2).map((category, index) => (
              <Badge
                key={category._id || index}
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-black/20 dark:bg-white/20 text-black dark:text-white border-black/30 dark:border-white/30 backdrop-blur-sm"
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Bottom section: Title and Excerpt */}
        <div className="mt-auto">
          <h3 className="text-lg font-bold text-black dark:text-white line-clamp-2 leading-tight mb-1">
            {blog.title}
          </h3>
          {blog.excerpt && (
            <p className="text-sm text-black/80 dark:text-white/80 line-clamp-2 leading-snug">
              {blog.excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default memo(
  BlogCardCompact,
  (prevProps, nextProps) => prevProps.blog._id === nextProps.blog._id
);
