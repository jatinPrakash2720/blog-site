import FeatureBar from "@/components/features/blog/FeatureBar";
import TrendingBlog from "@/components/features/blog/TrendingBlog";
import Header from "@/components/layout/Header";
import { useInView } from "@/hooks/UseInView";
import { useBlogs } from "@/store/blog";
import { useCategories } from "@/store/category";
import { Compass, Home, Tag } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { type LayoutType } from "@/components/common/subComps/layout-toggle";
import BlogList from "@/components/features/blog/BlogList";
import Sidebar from "@/components/layout/Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { MenuBar } from "@/components/common/subComps/MenuBar";

const HomePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("for-you");
  const [layout, setLayout] = useState<LayoutType>("square");
  const [headerHeight, setHeaderHeight] = useState(0);
  const [menuItems, setMenuItems] = useState([
    { slug: "for-you", label: "For You", icon: Home },
    { slug: "explore", label: "Explore", icon: Compass },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogListRef = useRef<HTMLDivElement>(null);

  const {
    trendingBlogs,
    loading,
    pagination,
    feedPagination,
    fetchAllBlogs,
    fetchFollowingFeed,
    fetchBlogsByCategory,
  } = useBlogs();
  const { filterableSubCategories, fetchFilterableSubCategories } =
    useCategories();

  const [trendingBlogRef, isTrendingBlogVisible] = useInView( { threshold: 0.1 } );
  const [featureBarRef, isFeatureBarVisible] = useInView({ threshold: 0.5 });
  const showFloatingMenuBar = !isTrendingBlogVisible && !isFeatureBarVisible;
  
  const isFeed = activeFilter === "for-you";
  const currentPagination = isFeed ? feedPagination : pagination;

  useEffect(() => {
    Promise.all([
      fetchFilterableSubCategories(),
      fetchAllBlogs({ page: 1, limit: 10 }),
      fetchFollowingFeed({ page: 1, limit: 10 }),
    ]);
  }, [fetchFilterableSubCategories, fetchAllBlogs, fetchFollowingFeed]);

  useEffect(() => {
    if (currentPage > 1 || (activeFilter !== "for-you" && activeFilter !== "explore")) {
      const params = { page: currentPage, limit: 10 };
      if (activeFilter === "for-you") {
        fetchFollowingFeed(params);
      } else if (activeFilter === "explore") {
        fetchAllBlogs(params);
      } else {
        fetchBlogsByCategory(activeFilter, params);
      }
    }
  }, [activeFilter, currentPage]);

  useEffect(() => {
    if (filterableSubCategories.length > 0) {
      const catgoryItems = filterableSubCategories.map((cat) => ({
        slug: cat.slug,
        label: cat.name,
        icon: Tag,
      }));
      setMenuItems([
        { slug: "for-you", label: "For You", icon: Home },
        { slug: "explore", label: "Explore", icon: Compass },
        ...catgoryItems,
      ]);
    }
  }, [filterableSubCategories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    blogListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header onHeightChange={setHeaderHeight} />
      <div
        className="relative flex-grow w-full"
        style={{ paddingTop: `${headerHeight+14}px` }}
      >
        <main className="container max-w-full mx-auto px-4">
          <section ref={trendingBlogRef} className="">
            <TrendingBlog
              blogs={trendingBlogs}
              isLoading={loading && trendingBlogs.length === 0}
            />
          </section>

          <section>
            <div className="my-6">
              <div ref={featureBarRef}>
                <FeatureBar
                  items={menuItems}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  layout={layout}
                  onLayoutChange={setLayout}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3.5">
              <div className="lg:col-span-3">
                <BlogList activeFilter={activeFilter} layout={layout} />
              </div>
              <div className="hidden lg:block lg:col-pan-1">
                <Sidebar />
              </div>
            </div>
          </section>
        </main>
      </div>
      <AnimatePresence>
        {showFloatingMenuBar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 p-1 bg-white/50 dark:bg-neutral-900/70 backdrop-blur-lg rounded-full shadow-lg border border-white/20 dark:border-neutral-800/80"
              style={{
                maskImage:
                  "linear-gradient(to top, black 50%, transparent 100%)",
              }}
            ></motion.div>
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
            >
              <MenuBar
                items={menuItems}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                layout={layout}
                onLayoutChange={setLayout}
                paginationData={currentPagination}
                onPageChange={handlePageChange}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;