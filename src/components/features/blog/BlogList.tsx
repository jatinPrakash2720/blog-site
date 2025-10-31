import type React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import BlogCard from "./BlogCard";
import BlogCardCompact from "./BlogCardCompact";
import BlogCardSkeleton from "./BlogCardSkeleton";
import BlogCardCompactSkeleton from "./BlogCardCompactSkeleton";
import type { LayoutType } from "../../common/subComps/layout-toggle";
import { useBlogs } from "../../../store/blog"; // Import the hook
import { gsap } from "gsap";
import { useIsMobile } from "@/hooks/use-mobile";

interface BlogListProps {
  layout?: LayoutType;
  activeFilter: string; // New prop to decide which blogs to show
}

const BlogList: React.FC<BlogListProps> = ({
  layout = "square",
  activeFilter,
}) => {
  // Get the blog arrays and loading state directly from the context
  const {
    allBlogs,
    feedBlogs,
    loading,
    pagination,
    feedPagination,
    fetchAllBlogs,
    fetchFollowingFeed,
    fetchBlogsByCategory,
  } = useBlogs();
  console.log(allBlogs);
  // Decide which array of blogs to display based on the active filter
  const blogsToDisplay = activeFilter === "for-you" ? feedBlogs : allBlogs;
  const currentPagination =
    activeFilter === "for-you" ? feedPagination : pagination;
  const gridRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile(1024); // Tablet breakpoint (< 1024px)

  // Grid classes - use compact cards for mobile/tablet, regular cards for desktop
  // Mobile (< 768px): 1 column with compact cards
  // Tablet (768px - 1023px): 2 columns with compact cards
  // Desktop (>= 1024px): 2 columns at md, 3 columns at xl with regular cards
  const gridClasses = isMobile
    ? "grid grid-cols-1 md:grid-cols-2 gap-3.5" // Mobile: 1 col, Tablet: 2 cols
    : layout === "landscape"
    ? "grid grid-cols-1 gap-3.5"
    : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5";

  // Reset page and fetch first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
    // Fetch first page when filter changes
    if (activeFilter === "for-you") {
      fetchFollowingFeed({ page: 1, limit: 10 });
    } else if (activeFilter === "explore") {
      fetchAllBlogs({ page: 1, limit: 10 });
    } else {
      fetchBlogsByCategory(activeFilter, { page: 1, limit: 10 });
    }
  }, [activeFilter, fetchFollowingFeed, fetchAllBlogs, fetchBlogsByCategory]);

  // Load more blogs function
  const loadMoreBlogs = useCallback(async () => {
    if (
      isLoadingMore ||
      loading ||
      !currentPagination ||
      !currentPagination.hasNextPage
    )
      return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      if (activeFilter === "for-you") {
        await fetchFollowingFeed({ page: nextPage, limit: 10 });
      } else if (activeFilter === "explore") {
        await fetchAllBlogs({ page: nextPage, limit: 10 });
      } else {
        await fetchBlogsByCategory(activeFilter, {
          page: nextPage,
          limit: 10,
        });
      }
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error loading more blogs:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    loading,
    currentPagination,
    currentPage,
    activeFilter,
    fetchFollowingFeed,
    fetchAllBlogs,
    fetchBlogsByCategory,
  ]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && !isLoadingMore) {
          loadMoreBlogs();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px", // Start loading before reaching bottom
      }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [loadMoreBlogs, loading, isLoadingMore]);

  // Stagger animation for cards when they appear
  useEffect(() => {
    if (!gridRef.current || loading || blogsToDisplay.length === 0) return;

    const cards = gridRef.current.querySelectorAll("[data-blog-card]");
    if (cards.length === 0) return;

    // Reset all cards to initial state
    gsap.set(cards, {
      opacity: 0,
      y: 30,
      scale: 0.95,
    });

    // Animate cards with stagger
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
      stagger: {
        amount: 0.4,
        from: "start",
      },
    });
  }, [blogsToDisplay.length, loading, activeFilter]);

  // Show skeleton loaders when loading (initial or loading more)
  if (loading && blogsToDisplay.length === 0) {
    return (
      <div className={gridClasses}>
        {Array.from({
          length: isMobile ? 3 : layout === "landscape" ? 3 : 6,
        }).map((_, index) =>
          isMobile ? (
            <BlogCardCompactSkeleton key={`skeleton-${index}`} />
          ) : (
            <BlogCardSkeleton key={`skeleton-${index}`} layout={layout} />
          )
        )}
      </div>
    );
  }

  // Show a "not found" message if loading is done and the list is still empty
  if (!loading && (!blogsToDisplay || blogsToDisplay.length === 0)) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">No posts found</h2>
        <p className="text-gray-500 mt-2">
          Try a different category or check back later!
        </p>
      </div>
    );
  }

  return (
    <>
      <div ref={gridRef} className={gridClasses}>
        {/* Render actual blog cards */}
        {blogsToDisplay.map((blog) => (
          <div key={blog._id} data-blog-card>
            {isMobile ? (
              <BlogCardCompact blog={blog} />
            ) : (
              <BlogCard layout={layout} blog={blog} />
            )}
          </div>
        ))}
      </div>
      {/* Intersection Observer trigger element and skeleton loaders */}
      {currentPagination?.hasNextPage && (
        <>
          {/* Show skeleton loaders when loading more */}
          {(isLoadingMore || (loading && blogsToDisplay.length > 0)) && (
            <div className={gridClasses}>
              {Array.from({
                length: isMobile ? 2 : layout === "landscape" ? 2 : 3,
              }).map((_, index) =>
                isMobile ? (
                  <BlogCardCompactSkeleton key={`loading-skeleton-${index}`} />
                ) : (
                  <BlogCardSkeleton
                    key={`loading-skeleton-${index}`}
                    layout={layout}
                  />
                )
              )}
            </div>
          )}
          {/* Invisible trigger element for Intersection Observer */}
          <div ref={loadMoreRef} className="w-full h-20" />
        </>
      )}
    </>
  );
};

export default BlogList;
