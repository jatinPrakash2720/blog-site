"use client";

import { Button } from "@/components/common/wrappers/Button";
import { cn } from "@/lib/utils";
import type { Blog } from "@/types/apisInterfaces/api";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface TrendingBlogProps {
  blogs: Blog[];
  isLoading: boolean;
}

const TrendingBlog: React.FC<TrendingBlogProps> = ({ blogs, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPage = () => {
    if (blogs && blogs.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
    }
  };

  const prevPage = () => {
    if (blogs && blogs.length > 0) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + blogs.length) % blogs.length
      );
    }
  };
  useEffect(() => {
    if (!blogs || blogs.length <= 1) {
      return;
    }
    const timer = setInterval(() => {
      nextPage();
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, [currentIndex, blogs, nextPage]);

  if (isLoading) {
    return (
      <div className="relative flex items-center justify-center w-full h-[50vh] lg:h-[96vh] rounded-2xl overflow-hidden bg-muted">
        <div aria-label="Loading..." role="status">
          <svg
            className="h-12 w-12 animate-spin text-primary"
            viewBox="3 3 18 18"
          >
            <path
              className="fill-primary/20"
              d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
            ></path>
            <path
              className="fill-primary"
              d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="relative flex items-center justify-center w-full h-[96vh] rounded-2xl overflow-hidden bg-muted">
        <p className="text-muted-foreground">
          No trending posts available at the moment.
        </p>
      </div>
    );
  }
  const currentBlog = blogs[currentIndex];
  return (
    <div className="relative w-full h-[60vh] rounded-2xl overflow-hidden group">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentBlog.thumbnail})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* --- THIS IS THE CHANGE --- */}
      {/* Navigation Dots are now positioned at the bottom-right */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4 z-10">
        <div className="flex space-x-2">
          {blogs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                currentIndex === index
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={prevPage}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextPage}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      <Link
        to={`/preview/${currentBlog._id}`}
        className="absolute bottom-0 left-0 right-0 p-8 text-white z-10"
      >
        <div className="inline-block mb-4">
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            {currentBlog.categories?.[0]?.name || "General"}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {currentBlog.title}
        </h1>
        <p className="text-white/90 text-lg mb-6 max-w-2xl leading-relaxed line-clamp-2">
          {currentBlog.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={currentBlog.owner.avatar}
              alt={currentBlog.owner.fullName}
              className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
            />
            <div>
              <p className="font-semibold text-lg">
                {currentBlog.owner.fullName}
              </p>
              <div className="flex items-center space-x-4 text-white/80 text-sm">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  {new Date(currentBlog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TrendingBlog;
