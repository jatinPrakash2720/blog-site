"use client";

import { useState } from "react";
import { useSocial } from "@/store/social";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Share2, Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Blog } from "@/types/apisInterfaces/api";

interface BlogStatsBarProps {
  blog: Blog;
  onLikeUpdate?: (likeCount: number, isLiked: boolean) => void;
}

export const BlogStatsBar: React.FC<BlogStatsBarProps> = ({
  blog,
  onLikeUpdate,
}) => {
  const { toggleBlogLike } = useSocial();
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(blog.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(blog.likeCount ?? 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like this blog");
      return;
    }

    setIsLiking(true);
    try {
      const liked = await toggleBlogLike(blog._id);
      setIsLiked(liked);
      const newLikeCount = liked ? likeCount + 1 : likeCount - 1;
      setLikeCount(newLikeCount);
      onLikeUpdate?.(newLikeCount, liked);
    } catch (error) {
      toast.error("Failed to toggle like");
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: url,
        });
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== "AbortError") {
          copyToClipboard(url);
        }
      }
    } else {
      // Fallback to copying to clipboard
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Link copied to clipboard!");
      },
      () => {
        toast.error("Failed to copy link");
      }
    );
  };

  return (
    <div className="flex items-center justify-between px-8 py-4  border-b border-border/30 bg-background/50 backdrop-blur-sm rounded-2xl max-md:px-6 max-md:py-3">
      <div className="flex items-center gap-6">
        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLiking}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
            isLiked
              ? "text-red-500 hover:text-red-600 hover:bg-red-500/10"
              : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
          )}
        >
          {isLiked ? (
            <Heart className="h-5 w-5 fill-current" />
          ) : (
            <ThumbsUp className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">{likeCount}</span>
        </Button>

        {/* Comment Count */}
        <div className="flex items-center gap-2 px-3 py-2 text-foreground/70">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{blog.commentCount ?? 0}</span>
        </div>
      </div>

      {/* Share Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-all duration-200"
      >
        <Share2 className="h-5 w-5" />
        <span className="text-sm font-medium">Share</span>
      </Button>
    </div>
  );
};
