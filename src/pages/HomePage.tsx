import FeatureBar from "@/components/features/blog/FeatureBar";
import TrendingBlog from "@/components/features/blog/TrendingBlog";
import Header1 from "@/components/layout/Header1";
import MobileNavBar from "@/components/layout/MobileNavBar";
import { useInView } from "@/hooks/UseInView";
import { useBlogs } from "@/store/blog";
import { useCategories } from "@/store/category";
import { Compass, Home, Tag } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { type LayoutType } from "@/components/common/subComps/layout-toggle";
import BlogList from "@/components/features/blog/BlogList";
import Sidebar from "@/components/layout/Sidebar";
import Dock from "@/components/common/subComps/Dock";

const HomePage: React.FC = () => {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState<string>("for-you");
  const [layout, setLayout] = useState<LayoutType>("square");
  const [menuItems, setMenuItems] = useState([
    { slug: "for-you", label: "For You", icon: Home },
    { slug: "explore", label: "Explore", icon: Compass },
  ]);

  // Handle filter from navigation state
  useEffect(() => {
    const filter = (location.state as { filter?: string })?.filter;
    if (filter === "explore") {
      setActiveFilter("explore");
    }
  }, [location.state]);

  const { trendingBlogs, loading, fetchAllBlogs, fetchFollowingFeed } =
    useBlogs();
  const { filterableSubCategories, fetchFilterableSubCategories } =
    useCategories();

  const [trendingBlogRef, isTrendingBlogVisible] = useInView({
    threshold: 0.1,
  });
  const [featureBarRef, isFeatureBarVisible] = useInView({ threshold: 0.5 });
  const showFloatingMenuBar = !isTrendingBlogVisible && !isFeatureBarVisible;

  useEffect(() => {
    Promise.all([
      fetchFilterableSubCategories(),
      fetchAllBlogs({ page: 1, limit: 10 }),
      fetchFollowingFeed({ page: 1, limit: 10 }),
    ]);
  }, [fetchFilterableSubCategories, fetchAllBlogs, fetchFollowingFeed]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header1 />
      <div className="relative grow w-full pt-20 pb-20 lg:pb-0">
        <main
          className="container max-w-full mx-auto px-4"
          style={{ contentVisibility: "auto" }}
        >
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
      {/* Dock - Desktop only, replaced MenuBar */}
      {showFloatingMenuBar && (
        <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-50">
          <div className="pointer-events-none">
            <Dock
              items={menuItems.map((item) => {
                const Icon = item.icon;
                return {
                  icon: <Icon className="w-5 h-5" />,
                  label: item.label,
                  onClick: () => setActiveFilter(item.slug),
                  className:
                    activeFilter === item.slug ? "ring-2 ring-primary" : "",
                };
              })}
              panelHeight={68}
              baseItemSize={50}
              magnification={70}
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation Bar */}
      <MobileNavBar />
    </div>
  );
};

export default HomePage;
