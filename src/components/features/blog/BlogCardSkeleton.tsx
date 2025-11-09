"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { LayoutType } from "../../common/subComps/layout-toggle";

interface BlogCardSkeletonProps {
  layout?: LayoutType;
}

const BlogCardSkeleton: React.FC<BlogCardSkeletonProps> = ({
  layout = "square",
}) => {
  return (
    <Card className="hover:shadow-3xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border dark:border-neutral-800 border-black/10 rounded-[32px] shadow-2xl mt-3.5">
      <div className="block relative z-10">
        <AspectRatio ratio={16 / 9}>
          <Skeleton className="w-[90%] h-full mx-auto rounded-xl" />
        </AspectRatio>
      </div>

      <CardContent className="p-4 flex flex-col grow justify-between relative z-10">
        {/* Top section */}
        <div>
          {/* Title */}
          <div className="mb-3">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          {/* Excerpt */}
          <div className="mt-2">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Bottom section */}
        <div>
          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2 pb-3">
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-12" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
          </div>

          {/* Author and Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCardSkeleton;
