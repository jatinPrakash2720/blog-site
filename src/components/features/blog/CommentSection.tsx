"use client";

import { useEffect, useState } from "react";
import { useSocial } from "@/store/social";
import { useAuth } from "@/store/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

interface CommentSectionProps {
  blogId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
  const { comments, commentPagination, fetchComments, addComment, loading } =
    useSocial();
  const { currentUser, isAuthenticated } = useAuth();
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (blogId) {
      // Initially load 3 comments
      fetchComments(blogId, { page: 1, limit: 3 }, false);
    }
  }, [blogId, fetchComments]);

  const handleAddComment = async (
    e?:
      | React.MouseEvent<HTMLButtonElement>
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isAuthenticated) {
      toast.error("Please login to add a comment");
      return;
    }

    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await addComment(blogId, commentContent.trim());
      if (success) {
        setCommentContent("");
        // Refetch comments to get updated count and ensure consistency
        await fetchComments(blogId, { page: 1, limit: 3 }, false);
        toast.success("Comment added successfully");
      } else {
        toast.error("Failed to add comment");
      }
    } catch (error) {
      toast.error("Error adding comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name || typeof name !== "string") return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLoadMore = async () => {
    if (!commentPagination || !commentPagination.hasNextPage) return;
    setIsLoadingMore(true);
    try {
      const nextPage = (commentPagination.page || 1) + 1;
      await fetchComments(blogId, { page: nextPage, limit: 10 }, true);
    } catch (error) {
      toast.error("Failed to load more comments");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const remainingComments =
    commentPagination && commentPagination.totalDocs
      ? commentPagination.totalDocs - comments.length
      : 0;

  return (
    <div className="w-full mb-8">
      <div className="bg-white dark:bg-neutral-900 backdrop-blur-xl rounded-2xl border-2 border-border/80 dark:border-white/15 p-8 max-md:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5 text-foreground/70" />
          <h2 className="text-2xl font-semibold text-foreground">
            Comments ({commentPagination?.totalDocs ?? comments.length})
          </h2>
        </div>

        {/* Add Comment Form */}
        {isAuthenticated && (
          <div className="mb-8 pb-8 border-b border-border/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }}
              className="flex gap-4"
              noValidate
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={currentUser?.avatar}
                  alt={currentUser?.fullName || "User"}
                />
                <AvatarFallback>
                  {currentUser?.fullName
                    ? getInitials(currentUser.fullName)
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Add a comment..."
                  className="min-h-[100px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      e.preventDefault();
                      handleAddComment(e);
                    }
                  }}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="lg"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddComment(e);
                    }}
                    disabled={isSubmitting || !commentContent.trim()}
                    className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black hover:text-white px-8 py-3 text-lg font-medium rounded-full gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Press Ctrl+Enter to post
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {loading && comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto pr-2 space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex gap-4 pb-6 border-b border-border/20 last:border-0"
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage
                      src={comment.owner?.avatar}
                      alt={comment.owner?.fullName || "User"}
                    />
                    <AvatarFallback>
                      {getInitials(comment.owner?.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {comment.owner?.fullName || "Anonymous"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-foreground/90 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
              {commentPagination?.hasNextPage && (
                <div className="flex justify-center pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="px-6 py-2 rounded-full"
                  >
                    {isLoadingMore
                      ? "Loading..."
                      : `View more comments (${remainingComments} left)`}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
