"use client";

import { Skeleton } from "@/components/ui/skeleton";

const BlogCardCompactSkeleton: React.FC = () => {
  return (
    <div className="block relative overflow-hidden rounded-2xl aspect-video w-full bg-muted mt-3.5">
      {/* Gradient overlay skeleton */}
      <div className="absolute inset-0 bg-linear-to-t from-white/90 via-white/40 to-transparent dark:from-black/90 dark:via-black/40 dark:to-transparent" />

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4">
        {/* Top section: Owner and Likes/Comments */}
        <div className="flex items-start justify-between gap-2">
          {/* Owner Avatar */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Likes and Comments */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-6" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-6" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-1 mt-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Bottom section: Title and Excerpt */}
        <div className="mt-auto">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-1" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mt-1" />
        </div>
      </div>
    </div>
  );
};

export default BlogCardCompactSkeleton;
