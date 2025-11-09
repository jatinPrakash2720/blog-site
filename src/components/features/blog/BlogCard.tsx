import type React from "react";
import { useEffect, useRef, memo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageWithSkeleton } from "@/components/common/ImageWithSkeleton";
import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import type { Blog } from "@/types/apisInterfaces/api";
import { gsap } from "gsap";

interface BlogCardProps {
  blog: Blog;
  layout?: "square";
}

// Shared action buttons component
const ActionButtons = ({
  likeCount,
  commentCount,
}: {
  likeCount: number;
  commentCount: number;
}) => (
  <div className="flex items-center gap-1.5">
    <button className="flex items-center gap-1.5 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
      <ThumbsUp className="p-0" size={18} />
      <span className="text-sm pr-2">{likeCount}</span>
    </button>
    <button className="flex items-center gap-1.5 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
      <MessageCircle size={18} />
      <span className="text-sm">{commentCount}</span>
    </button>
  </div>
);

// Shared author info component
const AuthorInfo = ({
  author,
  size = "md",
}: {
  author: Blog["owner"];
  size?: "sm" | "md";
}) => {
  const avatarSize = size === "sm" ? "w-10 h-10" : "w-12 h-12";
  const textSize = size === "sm" ? "text-base" : "text-[18px]";

  return (
    <div className="flex items-center gap-2">
      <Avatar
        className={`${avatarSize} ring-2 ring-white/30 dark:ring-white/20 hover:ring-white/50 dark:hover:ring-white/30 transition-all duration-200`}
      >
        <AvatarImage src={author.avatar} alt={author.fullName} />
        <AvatarFallback>{author.fullName[0]}</AvatarFallback>
      </Avatar>
      <span
        className={`${textSize} font-semibold text-gray-900/90 dark:text-white/90`}
      >
        {author.fullName}
      </span>
    </div>
  );
};

const BlogCardComponent: React.FC<BlogCardProps> = ({
  blog,
  layout = "square",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Optimized animation - only animate if in viewport
  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const cardClassName =
    "hover:shadow-3xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border dark:border-neutral-800 border-black/10 rounded-[32px] shadow-2xl transform transition-all duration-300";
  const categoryName = blog.categories?.[0]?.name || "General";

  return (
    <Card ref={cardRef} className={cardClassName}>
      <Link to={`/read/${blog._id}`} className="block">
        <AspectRatio ratio={16 / 9}>
          <ImageWithSkeleton
            src={blog.thumbnail}
            alt={blog.title}
            className="w-[90%] h-full mx-auto object-cover rounded-xl opacity-90 hover:opacity-100 transition-opacity duration-300"
            skeletonClassName="rounded-xl"
          />
        </AspectRatio>
      </Link>

      <CardContent className="p-4 flex flex-col gap-4">
        <div>
          <Link to={`/read/${blog._id}`} className="block mb-2">
            <h3 className="font-bold text-lg leading-tight text-gray-900/90 dark:text-white/90 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              {blog.title}
            </h3>
          </Link>
          <p className="text-sm text-foreground line-clamp-3">{blog.excerpt}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <ActionButtons
              likeCount={blog.likeCount}
              commentCount={blog.commentCount}
            />
            <div className="flex items-center gap-3">
              <button className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                <Bookmark size={18} />
              </button>
              <button className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <AuthorInfo author={blog.owner} />
            <Badge
              variant="secondary"
              className="backdrop-blur-sm bg-white/40 dark:bg-black/40 border-white/50 dark:border-white/20 text-gray-800 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-black/50 transition-all duration-200"
            >
              {categoryName}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BlogCard = memo(
  BlogCardComponent,
  (prevProps, nextProps) =>
    prevProps.blog._id === nextProps.blog._id &&
    prevProps.layout === nextProps.layout
);

BlogCard.displayName = "BlogCard";

export default BlogCard;
