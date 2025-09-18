import type React from "react";
import { useEffect,useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/common/wrappers/Card";
import Avatar from "@/components/common/wrappers/Avatar";
import Badge from "@/components/common/wrappers/Badge";
import AspectRatio from "@/components/common/wrappers/AspectRatio";
import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import type { Blog } from "@/types/api";

interface AnimatedTitleProps {
  title: string;
  baseClassName: string;
}

const AnimatedTitle = ({
  title,
  baseClassName,
}: AnimatedTitleProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) return;

    // This function checks if the text is overflowing and applies the necessary class and CSS variable.
    const checkAndApplyAnimation = () => {
      const isOverflowing = titleElement.scrollWidth > titleElement.clientWidth;

      if (isOverflowing) {
        titleElement.classList.add("is-truncated");
        // Calculate the exact distance the text needs to scroll
        const scrollAmount =
          titleElement.scrollWidth - titleElement.clientWidth;
        // Set the value for our CSS variable, adding 20px of padding for a better look
        titleElement.style.setProperty(
          "--scroll-amount",
          `-${scrollAmount + 20}px`
        );
      } else {
        titleElement.classList.remove("is-truncated");
      }
    };

    // Run the check initially and whenever the window is resized
    checkAndApplyAnimation();
    window.addEventListener("resize", checkAndApplyAnimation);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener("resize", checkAndApplyAnimation);
  }, [title]); // Rerun this effect if the title prop changes

  return (
    <div className="animated-title-wrapper">
      <h3
        ref={titleRef}
        className={`${baseClassName} title-content`}
        title={title}
      >
        {title}
      </h3>
    </div>
  );
};


// Define the props for the BlogCard to make it reusable
interface BlogCardProps {
  blog: Blog;
  layout?: "square" | "landscape";
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, layout = "square" }) => {
  if (layout === "landscape") {
    return (
      <Card className="hover:shadow-3xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border dark:border-neutral-800 border-black/10 rounded-[32px] shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <CardContent className="p-4 flex gap-4 relative z-10">
          {/* Left side content */}
          <div className="flex-1 flex flex-col justify-between min-h-[200px]">
            {/* Author info at top */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar
                src={blog.owner.avatar}
                alt={blog.owner.fullName}
                className="w-10 h-10 ring-2 ring-white/30 dark:ring-white/20 hover:ring-white/50 dark:hover:ring-white/30 transition-all duration-200"
              />
              <span className="text-base font-semibold text-gray-900/90 dark:text-white/90">
                {blog.owner.fullName}
              </span>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-4">
              <Badge
                variant="secondary"
                className="backdrop-blur-sm bg-green-500/80 text-white border-none hover:bg-green-600/80 transition-all duration-200 text-xs"
              >
                {blog.categories?.[0]?.name || "General"}

                {/* {blog.topTag} */}
              </Badge>
              <Badge
                variant="secondary"
                className="backdrop-blur-sm bg-green-600/60 text-white border-none hover:bg-green-700/60 transition-all duration-200 text-xs"
              >
                subcategorie tag
              </Badge>
            </div>

            {/* Title section */}
            <Link to={`/blog/${blog._id}`} className="block mb-3">
              <h3 className="font-bold text-lg leading-tight text-gray-900/90 dark:text-white/90 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                {blog.title}
              </h3>
            </Link>

            {/* Content section */}
            <div className="mb-4 flex-1">
              <p className="text-sm text-gray-700/80 dark:text-gray-300/80 line-clamp-3">
                {blog.excerpt}
              </p>
            </div>

            {/* Action Bar at bottom */}
            <div className="flex items-center justify-between text-gray-600/80 dark:text-gray-400/80">
              <div className="flex items-center">
                <button className="flex items-center gap-1.5 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                  <ThumbsUp className="p-0" size={18} />
                  <span className="text-sm pr-2">{blog.likeCount}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                  <MessageCircle size={18} />
                  <span className="text-sm">{blog.commentCount}</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                  <Bookmark size={18} />
                </button>
                <button className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right side image */}
          <div className="w-92 flex-shrink-0">
            <Link to={`/blog/${blog._id}`} className="block">
              <AspectRatio ratio={16 / 9}>
                <img
                  //  src={blog.thumbnail}
                  src={blog.thumbnail || "/placeholder.svg"}
                  alt={blog.title}
                  // alt={blog.title}
                  className="w-full h-full object-cover rounded-xl opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
              </AspectRatio>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-3xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border dark:border-neutral-800 border-black/10 rounded-[32px] shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
      <Link to={`/blog/${blog._id}`} className="block relative z-10">
        <AspectRatio ratio={16 / 9}>
          <img
            src={blog.thumbnail || "/placeholder.svg"}
            alt={blog.title}
            className="w-[90%] h-full mx-auto object-cover rounded-xl opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
        </AspectRatio>
      </Link>

      <CardContent className="p-4 flex flex-col flex-grow justify-between relative z-10">
        {/* Top section for title and excerpt */}
        <div>
          <Link to={`/blog/${blog._id}`} className="block mb-3 group">
            <AnimatedTitle
              title={blog.title}
              baseClassName="font-bold text-lg leading-tight text-gray-900/90 dark:text-white/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
            />
          </Link>
          <p className="text-sm text-foreground mt-2 line-clamp-3">
            {blog.excerpt}
          </p>
        </div>

        {/* Bottom section for actions and author info */}
        <div>
          {/* Action Bar */}
          <div className="flex items-center justify-between text-foreground pt-2 pb-3">
            <div className="flex items-center">
              <button className="flex items-center gap-1.5 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                <ThumbsUp className="p-0" size={18} />
                <span className="text-sm pr-2">{blog.likeCount}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                <MessageCircle size={18} />
                <span className="text-sm">{blog.commentCount}</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                <Bookmark size={18} />
              </button>
              <button className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Author and Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                src={blog.owner.avatar}
                alt={blog.owner.fullName}
                className="w-12 h-12 ring-2 ring-white/30 dark:ring-white/20 hover:ring-white/50 dark:hover:ring-white/30 transition-all duration-200"
              />
              <span className="text-[18px] font-semibold text-gray-900/90 dark:text-white/90">
                {blog.owner.fullName}
              </span>
            </div>
            <Badge
              variant="secondary"
              className="backdrop-blur-sm bg-white/40 dark:bg-black/40 border-white/50 dark:border-white/20 text-gray-800 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-black/50 transition-all duration-200"
            >
              {blog.categories?.[0]?.name || "General"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
