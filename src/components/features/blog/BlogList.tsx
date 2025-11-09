import type React from "react";
import { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import BlogCard from "./BlogCard";
import BlogCardCompact from "./BlogCardCompact";
import BlogCardSkeleton from "./BlogCardSkeleton";
import BlogCardCompactSkeleton from "./BlogCardCompactSkeleton";
import type { LayoutType } from "../../common/subComps/layout-toggle";
import { useBlogs } from "../../../store/blog";
import { useIsMobile } from "@/hooks/use-mobile";

interface BlogListProps {
  layout?: LayoutType;
  activeFilter?: string; // Optional prop to decide which blogs to show
}

const BlogList: React.FC<BlogListProps> = ({
  layout = "square",
  activeFilter = "explore", // Default to explore (all blogs)
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

  // Memoize blogs selection to prevent unnecessary recalculations
  const blogsToDisplay = useMemo(
    () => (activeFilter === "for-you" ? feedBlogs : allBlogs),
    [activeFilter, feedBlogs, allBlogs]
  );
  const currentPagination = useMemo(
    () => (activeFilter === "for-you" ? feedPagination : pagination),
    [activeFilter, feedPagination, pagination]
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile(1024); // Tablet breakpoint (< 1024px)

  // Memoize grid classes to prevent recalculation
  const gridClasses = useMemo(
    () =>
      isMobile
        ? "grid grid-cols-1 md:grid-cols-2 gap-3.5"
        : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5",
    [isMobile]
  );

  // Memoize skeleton counts to prevent recalculation
  const skeletonCount = useMemo(
    () => (isMobile ? 3 : 6),
    [isMobile]
  );
  const loadingSkeletonCount = useMemo(
    () => (isMobile ? 2 : 3),
    [isMobile]
  );

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

  // Intersection Observer for infinite scroll - optimized
  useEffect(() => {
    if (!currentPagination?.hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && !isLoadingMore) {
          loadMoreBlogs();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Reduced from 200px to prevent premature loading
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
  }, [loadMoreBlogs, loading, isLoadingMore, currentPagination?.hasNextPage]);


  // Show skeleton loaders when loading (initial or loading more)
  if (loading && blogsToDisplay.length === 0) {
    return (
      <div className={gridClasses}>
        {Array.from({ length: skeletonCount }).map((_, index) =>
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
        {blogsToDisplay.map((blog) =>
          isMobile ? (
            <BlogCardCompact key={blog._id} blog={blog} />
          ) : (
            <BlogCard key={blog._id} layout={layout} blog={blog} />
          )
        )}
      </div>
      {/* Intersection Observer trigger element and skeleton loaders */}
      {currentPagination?.hasNextPage && (
        <>
          {/* Show skeleton loaders when loading more */}
          {(isLoadingMore || (loading && blogsToDisplay.length > 0)) && (
            <div className={gridClasses}>
              {Array.from({ length: loadingSkeletonCount }).map((_, index) =>
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

export default memo(BlogList);
