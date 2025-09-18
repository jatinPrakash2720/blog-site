import type React from "react";
import BlogCard from "./BlogCard";
import type { LayoutType } from "../../common/subComps/layout-toggle";
import { useBlogs } from "../../../store/blog"; // Import the hook
import Loader from "../../ui/Loader"; // Assuming a loader component exists

interface BlogListProps {
  layout?: LayoutType;
  activeFilter: string; // New prop to decide which blogs to show
}

const BlogList: React.FC<BlogListProps> = ({
  layout = "square",
  activeFilter,
}) => {
  // Get the blog arrays and loading state directly from the context
  const { allBlogs, feedBlogs, loading } = useBlogs();
  console.log(allBlogs);
  // Decide which array of blogs to display based on the active filter
  const blogsToDisplay = activeFilter === "for-you" ? feedBlogs : allBlogs;

  // Show a full-page loader only on the initial fetch when the list is empty
  if (loading && blogsToDisplay.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader />
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

  const gridClasses =
    layout === "landscape"
      ? "grid grid-cols-1 gap-3.5"
      : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5";

  return (
    <div className={gridClasses}>
      {blogsToDisplay.map((blog) => (
          <BlogCard layout={layout} key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
