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
  const { comments, fetchComments, addComment, loading } = useSocial();
  const { currentUser, isAuthenticated } = useAuth();
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (blogId) {
      fetchComments(blogId);
    }
  }, [blogId, fetchComments]);

  const handleAddComment = async () => {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full mb-8">
      <div className="bg-background/90 backdrop-blur-sm rounded-2xl border-2 border-border/80 dark:border-white/15 p-8 max-md:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5 text-foreground/70" />
          <h2 className="text-2xl font-semibold text-foreground">
            Comments ({comments.length})
          </h2>
        </div>

        {/* Add Comment Form */}
        {isAuthenticated && (
          <div className="mb-8 pb-8 border-b border-border/30">
            <div className="flex gap-4">
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
                      handleAddComment();
                    }
                  }}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddComment}
                    disabled={isSubmitting || !commentContent.trim()}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Press Ctrl+Enter to post
                </p>
              </div>
            </div>
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
            comments.map((comment) => (
              <div
                key={comment._id}
                className="flex gap-4 pb-6 border-b border-border/20 last:border-0"
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage
                    src={comment.owner.avatar}
                    alt={comment.owner.fullName}
                  />
                  <AvatarFallback>
                    {getInitials(comment.owner.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {comment.owner.fullName}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};
