import React from "react";
import { useParams } from "react-router-dom";
import ThemeToggle from "@/components/common/wrappers/ThemeToggle";

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams();
  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <div className="p-8">
        <h1 className="text-foreground">Blog Post: {slug}</h1>
      </div>
    </div>
  );
};

export default BlogDetailPage;
