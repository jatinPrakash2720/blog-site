"use client";

import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { CharacterCount, Selection } from "@tiptap/extensions";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import { BubbleMenu as BubbleMenuExtension } from "@tiptap/extension-bubble-menu";
import { EditorBubbleMenu } from "@/components/features/blog/BubbleMenu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSocial } from "@/store/social";
import { useAuth } from "@/store/auth";
import { UserPlus, Check } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/types/apisInterfaces/api";

interface SimpleRepresenterProps {
  title?: string;
  initialContent?: string;
  isEditable?: boolean;
  showTitle?: boolean;
  owner?: User;
  createdAt?: string;
}

export function SimpleRepresenter({
  title = "",
  initialContent,
  isEditable = false,
  showTitle = true,
  owner,
  createdAt,
}: SimpleRepresenterProps) {
  const isMobile = useIsMobile();
  const { toggleFollowUser, fetchFollowers, followers } = useSocial();
  const { currentUser, isAuthenticated } = useAuth();
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main");
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [followerCount, setFollowerCount] = React.useState(0);
  const [isFollowingLoading, setIsFollowingLoading] = React.useState(false);

  const editor = useEditor({
    editable: isEditable,
    content: initialContent
      ? JSON.parse(initialContent)
      : `<p>Start Writing...</p>`,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: cn(
          // Base editor styles
          "font-[DM_Sans] prose prose-lg max-w-none",
          "min-h-[500px] text-lg leading-[1.7]"
        ),
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      BubbleMenuExtension.configure({
        pluginKey: "bubbleMenu",
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      CharacterCount,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  // Fetch followers count when owner changes
  React.useEffect(() => {
    if (owner?._id) {
      fetchFollowers(owner._id);
    }
  }, [owner?._id, fetchFollowers]);

  // Update follower count and check if following when followers list changes
  React.useEffect(() => {
    if (followers && owner?._id) {
      setFollowerCount(followers.length);

      // Check if current user is following
      if (currentUser && isAuthenticated) {
        const isUserFollowing = followers.some(
          (follower) => follower._id === currentUser._id
        );
        setIsFollowing(isUserFollowing);
      } else {
        setIsFollowing(false);
      }
    }
  }, [followers, owner?._id, currentUser, isAuthenticated]);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to follow this user");
      return;
    }

    if (!owner?._id) return;

    if (owner._id === currentUser?._id) {
      toast.error("You cannot follow yourself");
      return;
    }

    setIsFollowingLoading(true);
    try {
      const followed = await toggleFollowUser(owner._id);
      setIsFollowing(followed);
      if (followed) {
        setFollowerCount((prev) => prev + 1);
        toast.success("You are now following this user");
      } else {
        setFollowerCount((prev) => Math.max(0, prev - 1));
        toast.success("You unfollowed this user");
      }
      // Refresh followers list
      await fetchFollowers(owner._id);
    } catch (error) {
      toast.error("Failed to toggle follow");
    } finally {
      setIsFollowingLoading(false);
    }
  };

  if (!editor) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    <>
      {/* Owner Section */}
      {owner && (
        <div className="simple-editor-owner px-8 py-6 border-b border-border/30 max-md:px-6 max-md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={owner.avatar} alt={owner.fullName} />
                <AvatarFallback>
                  {owner.fullName ? getInitials(owner.fullName) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-foreground">
                  {owner.fullName || owner.username}
                </span>
                <div className="flex items-center gap-3">
                  {createdAt && (
                    <span className="text-sm text-muted-foreground">
                      {formatDate(createdAt)}
                    </span>
                  )}
                  {followerCount > 0 && (
                    <>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {followerCount}{" "}
                        {followerCount === 1 ? "follower" : "followers"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Follow Button */}
            {isAuthenticated &&
              owner._id !== currentUser?._id &&
              (isFollowing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFollow}
                  disabled={isFollowingLoading}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  Following
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleFollow}
                  disabled={isFollowingLoading}
                  className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black hover:text-white px-8 py-3 text-lg font-medium rounded-full gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Follow
                </Button>
              ))}
          </div>
        </div>
      )}

      {/* Title Section */}
      {showTitle && (
        <div className="simple-editor-title px-8 py-8 pb-4 border-b border-border/30 max-md:px-6 max-md:py-6 max-md:pb-4">
          <Input
            value={title}
            placeholder="Title"
            className="text-4xl md:text-5xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto bg-transparent placeholder:text-muted-foreground/40"
            disabled={!isEditable}
            readOnly={!isEditable}
          />
        </div>
      )}

      {/* Editor Content */}
      <div className="simple-editor-content relative">
        <EditorContext.Provider value={{ editor }}>
          {/* Bubble Menu - only show in editable mode */}
          {isEditable && (
            <EditorBubbleMenu
              editor={editor}
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          )}

          <EditorContent
            editor={editor}
            role="presentation"
            className={cn(
              "simple-editor-content-body",
              "min-h-[500px] p-12 text-lg leading-[1.7]",
              "text-foreground w-full focus:outline-none",
              // Typography styles
              "[&_h1]:text-[2.5rem] [&_h1]:font-bold [&_h1]:leading-[1.2] [&_h1]:my-8 [&_h1]:mb-6 [&_h1]:text-foreground",
              "[&_h2]:text-[2rem] [&_h2]:font-semibold [&_h2]:leading-[1.3] [&_h2]:my-[1.8rem] [&_h2]:mb-[1.2rem] [&_h2]:text-foreground",
              "[&_h3]:text-[1.5rem] [&_h3]:font-semibold [&_h3]:leading-[1.4] [&_h3]:my-6 [&_h3]:mb-4 [&_h3]:text-foreground",
              "[&_p]:mb-6 [&_p]:text-foreground",
              "[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
              "[&_ul]:my-6 [&_ul]:pl-8 [&_ol]:my-6 [&_ol]:pl-8",
              "[&_li]:mb-2",
              "[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.9em]",
              "[&_pre]:bg-muted [&_pre]:p-6 [&_pre]:rounded-lg [&_pre]:my-8 [&_pre]:overflow-x-auto",
              // Mobile responsive
              "max-md:p-8 max-md:text-base",
              "max-md:[&_h1]:text-[2rem] max-md:[&_h2]:text-[1.5rem] max-md:[&_h3]:text-[1.25rem]"
            )}
          />
        </EditorContext.Provider>
      </div>
    </>
  );
}
