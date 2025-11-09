import React, { useState, useEffect } from "react";
import { useAuth } from "@/store/auth";
import { useSocial } from "@/store/social";
import { getUserBlogs } from "@/services/user.service";
import { getBlogsInCollection } from "@/services/save.service";
import { useBlogs } from "@/store/blog";
import { useCategories } from "@/store/category";
import type { Blog } from "@/types/apisInterfaces/api";
import Header1 from "@/components/layout/Header1";
import Loader from "@/components/ui/Loader";
import FeatureBar from "@/components/features/blog/FeatureBar";
import TrendingBlog from "@/components/features/blog/TrendingBlog";
import Trending from "@/components/features/blog/Trending";
import FollowSuggestions from "@/components/features/user/FollowSuggestions";
import BlogList from "@/components/features/blog/BlogList";
import {
  LayoutToggle,
  type LayoutType,
} from "@/components/common/subComps/layout-toggle";

// Icons - using Lucide React instead of Heroicons
import {
  Bookmark,
  FileText,
  Plus,
  ChevronRight,
  Clock,
  Heart,
  Folder,
  User,
  Menu,
  X,
  Compass,
  Settings,
  Home,
  Tag,
} from "lucide-react";

export type SidebarSection =
  | "saved"
  | "draft"
  | "custom"
  | "profile"
  | "history"
  | "liked"
  | "explore"
  | "settings";

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
  type: SidebarSection;
  collectionId?: string;
  isDefault?: boolean;
}

const UserProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { collections, fetchCollections, loading: socialLoading } = useSocial();
  const [activeSection, setActiveSection] = useState<SidebarSection>("saved");
  const [draftBlogs, setDraftBlogs] = useState<Blog[]>([]);
  const [savedBlogs, setSavedBlogs] = useState<Blog[]>([]);
  const [collectionBlogs, setCollectionBlogs] = useState<{
    [key: string]: Blog[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);

  // Explore section state
  const [activeFilter, setActiveFilter] = useState<string>("for-you");
  const [layout, setLayout] = useState<LayoutType>("square");
  const [menuItems, setMenuItems] = useState([
    { slug: "for-you", label: "For You", icon: Home },
    { slug: "explore", label: "Explore", icon: Compass },
  ]);

  // Blog store hooks
  const {
    trendingBlogs,
    loading: blogLoading,
    fetchAllBlogs,
    fetchFollowingFeed,
  } = useBlogs();
  const { filterableSubCategories, fetchFilterableSubCategories } =
    useCategories();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch user collections and blogs
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?._id) return;

      try {
        setLoading(true);

        // Fetch collections using social store
        await fetchCollections();

        // Fetch user's draft blogs
        const draftResponse = await getUserBlogs({
          userId: currentUser._id,
          page: 1,
          limit: 50,
        });

        if (draftResponse.data.success) {
          const userBlogs = draftResponse.data.data.blogs;
          const drafts = userBlogs.filter((blog) => blog.status === "draft");
          const published = userBlogs.filter(
            (blog) => blog.status === "published"
          );
          setDraftBlogs(drafts);
          setSavedBlogs(published); // For now, treating published as "saved"
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser?._id, fetchCollections]);

  // Fetch explore data
  useEffect(() => {
    if (activeSection === "explore") {
      Promise.all([
        fetchFilterableSubCategories(),
        fetchAllBlogs({ page: 1, limit: 10 }),
        fetchFollowingFeed({ page: 1, limit: 10 }),
      ]);
    }
  }, [
    activeSection,
    fetchFilterableSubCategories,
    fetchAllBlogs,
    fetchFollowingFeed,
  ]);

  // Update menu items when categories are loaded
  useEffect(() => {
    if (filterableSubCategories.length > 0) {
      const categoryItems = filterableSubCategories.map((cat) => ({
        slug: cat.slug,
        label: cat.name,
        icon: Tag,
      }));
      setMenuItems([
        { slug: "for-you", label: "For You", icon: Home },
        { slug: "explore", label: "Explore", icon: Compass },
        ...categoryItems,
      ]);
    }
  }, [filterableSubCategories]);

  // Function to handle collection selection
  const handleCollectionSelect = async (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    setActiveSection("custom");

    // Fetch blogs for this collection if not already loaded
    if (!collectionBlogs[collectionId]) {
      try {
        const response = await getBlogsInCollection(collectionId);
        if (response.data.success) {
          setCollectionBlogs((prev) => ({
            ...prev,
            [collectionId]: response.data.data.data.blogs,
          }));
        }
      } catch (error) {
        console.error("Error fetching collection blogs:", error);
      }
    }
  };

  // Create sidebar items
  const sidebarItems: SidebarItem[] = [
    // Default sections
    {
      id: "saved",
      name: "Saved",
      icon: <Bookmark className="w-5 h-5" />,
      count: (savedBlogs || []).length,
      type: "saved",
      isDefault: true,
    },
    {
      id: "draft",
      name: "Draft",
      icon: <FileText className="w-5 h-5" />,
      count: (draftBlogs || []).length,
      type: "draft",
      isDefault: true,
    },
    {
      id: "history",
      name: "History",
      icon: <Clock className="w-5 h-5" />,
      count: 0,
      type: "history",
      isDefault: true,
    },
    {
      id: "liked",
      name: "Liked",
      icon: <Heart className="w-5 h-5" />,
      count: 0,
      type: "liked",
      isDefault: true,
    },
    {
      id: "explore",
      name: "Explore",
      icon: <Compass className="w-5 h-5" />,
      count: 0,
      type: "explore",
      isDefault: true,
    },
    {
      id: "settings",
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      count: 0,
      type: "settings",
      isDefault: true,
    },
    // Custom collections
    ...(collections || []).map((collection) => ({
      id: collection._id,
      name: collection.name,
      icon: <Folder className="w-5 h-5" />,
      count: (collection.blogs || []).length,
      type: "custom" as SidebarSection,
      collectionId: collection._id,
      isDefault: false,
    })),
  ];

  const renderMainContent = () => {
    const getSectionTitle = () => {
      switch (activeSection) {
        case "saved":
          return "Saved Blogs";
        case "draft":
          return "Draft Blogs";
        case "history":
          return "Reading History";
        case "liked":
          return "Liked Blogs";
        case "explore":
          return "Explore";
        case "settings":
          return "Settings";
        case "custom":
          const currentCollection = (collections || []).find(
            (c) => c._id === selectedCollectionId
          );
          return currentCollection ? currentCollection.name : "Collection";
        default:
          return "Profile";
      }
    };

    const getSectionContent = () => {
      switch (activeSection) {
        case "saved":
          return (savedBlogs || []).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(savedBlogs || []).map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {blog.thumbnail && (
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {blog.views} views
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No saved blogs yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Start saving blogs you want to read later
              </p>
            </div>
          );

        case "draft":
          return (draftBlogs || []).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(draftBlogs || []).map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {blog.thumbnail && (
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Draft
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No draft blogs yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Start writing your first blog post
              </p>
            </div>
          );

        case "history":
          return (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No reading history
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your reading history will appear here
              </p>
            </div>
          );

        case "liked":
          return (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No liked blogs yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Like blogs to see them here
              </p>
            </div>
          );

        case "explore":
          return (
            <div className="space-y-6">
              {/* Trending Blog Section */}
              <section>
                <TrendingBlog
                  blogs={trendingBlogs || []}
                  isLoading={blogLoading && (trendingBlogs || []).length === 0}
                />
              </section>

              {/* Feature Bar */}
              <section>
                <div className="my-6">
                  <FeatureBar
                    items={menuItems}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    layout={layout}
                    onLayoutChange={setLayout}
                  />
                </div>

                {/* Blog List */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3.5">
                  <div className="lg:col-span-3">
                    <BlogList activeFilter={activeFilter} layout={layout} />
                  </div>
                  <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-40 space-y-3.5">
                      <Trending />
                      <FollowSuggestions />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          );

        case "settings":
          return (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Profile Information</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Update your profile details
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Edit
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Privacy Settings</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Control your privacy and visibility
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Manage
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Configure notification preferences
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Settings
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Content Management
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Draft Management</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage your draft blogs
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      View Drafts
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Collections</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Organize your saved blogs
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Theme</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choose your preferred theme
                      </p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Layout</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choose your preferred layout
                      </p>
                    </div>
                    <LayoutToggle layout={layout} onLayoutChange={setLayout} />
                  </div>
                </div>
              </div>
            </div>
          );

        case "custom":
          if (!selectedCollectionId) {
            return (
              <div className="text-center py-12">
                <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Select a collection
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a collection from the sidebar to view its blogs
                </p>
              </div>
            );
          }

          const currentCollection = (collections || []).find(
            (c) => c._id === selectedCollectionId
          );
          const blogs = collectionBlogs[selectedCollectionId] || [];

          return blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {blog.thumbnail && (
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {blog.views} views
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {currentCollection?.name || "Collection"} is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                No blogs in this collection yet
              </p>
            </div>
          );

        default:
          return (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Profile
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Profile information will be displayed here
              </p>
            </div>
          );
      }
    };

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {getSectionTitle()}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {activeSection === "saved" &&
                `${(savedBlogs || []).length} blogs`}
              {activeSection === "draft" &&
                `${(draftBlogs || []).length} drafts`}
              {activeSection === "custom" &&
                selectedCollectionId &&
                `${collectionBlogs[selectedCollectionId]?.length || 0} blogs`}
            </span>
          </div>
        </div>
        {getSectionContent()}
      </div>
    );
  };

  if (loading || socialLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.1] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix in='colorNoise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      <Header1 isEditorMode={true} />

      <div className="flex relative">
        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          ${sidebarOpen ? "w-64" : "w-16"} 
          transition-all duration-300 
          bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700 
          min-h-screen flex-shrink-0
          ${isMobile ? "fixed left-0 top-0 z-50" : "relative"}
          ${isMobile && !sidebarOpen ? "-translate-x-full" : ""}
        `}
        >
          <div className="p-4 h-full flex flex-col">
            {/* Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mb-6 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors self-start"
            >
              {isMobile ? (
                <X className="w-5 h-5" />
              ) : (
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${
                    sidebarOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Sidebar Items */}
            <nav className="flex-1 space-y-1">
              {/* Default Collections Section */}
              <div className="mb-6">
                {sidebarOpen && (
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
                    Collections
                  </h3>
                )}
                <div className="space-y-1">
                  {sidebarItems
                    .filter((item) => item.isDefault)
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.type)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors group ${
                          activeSection === item.type
                            ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex-shrink-0">{item.icon}</div>
                        {sidebarOpen && (
                          <>
                            <span className="flex-1 font-medium text-sm">
                              {item.name}
                            </span>
                            {item.count !== undefined && item.count > 0 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                                {item.count}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    ))}
                </div>
              </div>

              {/* Custom Collections Section */}
              {(collections || []).length > 0 && (
                <div className="mb-6">
                  {sidebarOpen && (
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
                      Your Collections
                    </h3>
                  )}
                  <div className="space-y-1">
                    {sidebarItems
                      .filter((item) => !item.isDefault)
                      .map((item) => (
                        <button
                          key={item.id}
                          onClick={() =>
                            handleCollectionSelect(item.collectionId!)
                          }
                          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors group ${
                            activeSection === item.type &&
                            selectedCollectionId === item.collectionId
                              ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <div className="flex-shrink-0">{item.icon}</div>
                          {sidebarOpen && (
                            <>
                              <span className="flex-1 font-medium text-sm truncate">
                                {item.name}
                              </span>
                              {item.count !== undefined && item.count > 0 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                                  {item.count}
                                </span>
                              )}
                            </>
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Add Collection Button */}
              {sidebarOpen && (
                <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors group border-t border-gray-200 dark:border-gray-700 pt-4">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium text-sm">Add Collection</span>
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 pt-20">
          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <Menu className="w-6 h-6" />
                <span className="font-medium">Menu</span>
              </button>
            </div>
          )}

          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
