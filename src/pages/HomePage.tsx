import TrendingBlog from "@/components/features/blog/TrendingBlog";
import Header1 from "@/components/layout/Header1";
import MobileNavBar from "@/components/layout/MobileNavBar";
import { useInView } from "@/hooks/UseInView";
import { useBlogs } from "@/store/blog";
import type React from "react";
import { useEffect } from "react";
import BlogList from "@/components/features/blog/BlogList";
import Sidebar from "@/components/layout/Sidebar";

const HomePage: React.FC = () => {
  const { trendingBlogs, loading, fetchAllBlogs } = useBlogs();

  const [trendingBlogRef] = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    fetchAllBlogs({ page: 1, limit: 10 });
  }, [fetchAllBlogs]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.1] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix in='colorNoise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      <Header1 />
      <div className="relative grow w-full pt-17 pb-20 lg:pb-0">
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3.5 mt-6">
              <div className="lg:col-span-3">
                <BlogList />
              </div>
              <div className="hidden lg:block lg:col-pan-1">
                <Sidebar />
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNavBar />
    </div>
  );
};

export default HomePage;
