"use client";

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useBlogs } from "@/store/blog";
import { toast } from "sonner";
import Header1 from "@/components/layout/Header1";
import Footer from "@/components/layout/Footer";
import { HorizontalBlogList } from "@/components/features/blog/HorizontalBlogList";
import FollowSuggestions from "@/components/features/user/FollowSuggestions";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageWithSkeleton } from "@/components/common/ImageWithSkeleton";
import { ThumbsUp, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
import { extractTextFromTiptap } from "@/utils/extractTextFromTiptap";
import { cn } from "@/lib/utils";

const RepresentationPage = () => {
  const { blogId } = useParams();
  const { fetchSearchBlog, currentBlog } = useBlogs();

  useEffect(() => {
    async function fetchBlog() {
      try {
        if (!blogId) {
          return;
        }
        const response = await fetchSearchBlog(blogId);
        if (!response.success) {
          toast.error(response.message);
        }
      } catch {
        toast.error("Error while fetching searched blog");
      }
    }

    fetchBlog();
  }, [blogId, fetchSearchBlog]);

  if (!currentBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Extract text from tiptap content for description
  const contentText = currentBlog.content
    ? extractTextFromTiptap(JSON.parse(currentBlog.content), 200)
    : currentBlog.excerpt || "";

  const categoryName = currentBlog.categories?.[0]?.name || "General";

  return (
    <div className="min-h-screen relative">
      {/* Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.1] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix in='colorNoise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      
      {/* Header */}
      <Header1 />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Blog Card - Large */}
          <div className="lg:col-span-2">
            <Card className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border dark:border-neutral-800 border-black/10 rounded-3xl shadow-2xl overflow-hidden">
              {/* Thumbnail */}
              <Link to={`/read/${currentBlog._id}`} className="block">
                <AspectRatio ratio={16 / 9}>
                  <ImageWithSkeleton
                    src={currentBlog.thumbnail}
                    alt={currentBlog.title}
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                    skeletonClassName="rounded-t-3xl"
                  />
                </AspectRatio>
              </Link>

              <CardContent className="p-8">
                {/* Title */}
                <Link to={`/read/${currentBlog._id}`} className="block mb-4">
                  <h1 className="text-3xl font-bold leading-tight text-gray-900/90 dark:text-white/90 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 mb-4">
                    {currentBlog.title}
                  </h1>
                </Link>

                {/* Description - Truncated */}
                <p className="text-base text-foreground/80 line-clamp-4 mb-6 leading-relaxed">
                  {contentText}
                </p>

                {/* Read More Link */}
                <Link
                  to={`/read/${currentBlog._id}`}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-lg transition-colors duration-200 mb-6"
                >
                  Read more
                  <span className="ml-2">→</span>
                </Link>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mb-6 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                      <ThumbsUp size={20} />
                      <span className="text-sm font-medium">
                        {currentBlog.likeCount}
                      </span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                      <MessageCircle size={20} />
                      <span className="text-sm font-medium">
                        {currentBlog.commentCount}
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                      <Bookmark size={20} />
                    </button>
                    <button className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>

                {/* Author Info and Category */}
                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-14 h-14 ring-2 ring-white/30 dark:ring-white/20 hover:ring-white/50 dark:hover:ring-white/30 transition-all duration-200">
                      <AvatarImage
                        src={currentBlog.owner.avatar}
                        alt={currentBlog.owner.fullName}
                      />
                      <AvatarFallback>
                        {currentBlog.owner.fullName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-semibold text-gray-900/90 dark:text-white/90">
                        {currentBlog.owner.fullName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{currentBlog.owner.username}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="backdrop-blur-sm bg-white/40 dark:bg-black/40 border-white/50 dark:border-white/20 text-gray-800 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-black/50 transition-all duration-200 text-sm px-4 py-2"
                  >
                    {categoryName}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - User Suggestions */}
          <div className="lg:col-span-1">
            <FollowSuggestions />
          </div>
        </div>

        {/* Blog Suggestions */}
        <div className="mt-12">
          <HorizontalBlogList
            title="More Blogs"
            excludeBlogId={blogId}
            limit={8}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RepresentationPage;
