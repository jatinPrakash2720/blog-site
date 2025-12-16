"use client";

import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useThrottledCallback } from "@/hooks/use-throttled-callback";
import { useAuth } from "@/store/auth";
import { useEditorContextSafe } from "@/store/editor";
import ThemeToggle from "@/components/common/wrappers/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit2,
  User,
  Settings,
  LogOut,
  Save,
  Eye,
  Edit,
  Undo,
  Redo,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Header1Props {
  onHeightChange?: (height: number) => void;
  disableScrollEffect?: boolean;
  isEditorMode?: boolean;
  isPreviewMode?: boolean;
  onSave?: () => void;
  onPreview?: () => void;
  onBackToEditor?: () => void;
  isVisible?: boolean;
}

const Header1: React.FC<Header1Props> = ({
  onHeightChange,
  disableScrollEffect = false,
  isEditorMode = false,
  isPreviewMode = false,
  onSave,
  onPreview,
  onBackToEditor,
  isVisible = true,
}) => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { wordCount, editor } = useEditorContextSafe();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [userResults, setUserResults] = useState<any[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hardcoded search results
  const mockSearchResults = [
    {
      _id: "1",
      title: "Getting Started with React Hooks",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=150&fit=crop",
      excerpt: "Learn how to use React Hooks in your applications...",
      owner: { fullName: "John Doe", username: "johndoe" },
    },
    {
      _id: "2",
      title: "Advanced TypeScript Patterns",
      thumbnail:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=200&h=150&fit=crop",
      excerpt: "Explore advanced patterns and techniques in TypeScript...",
      owner: { fullName: "Jane Smith", username: "janesmith" },
    },
    {
      _id: "3",
      title: "Building Modern Web Applications",
      thumbnail:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=150&fit=crop",
      excerpt: "A comprehensive guide to modern web development...",
      owner: { fullName: "Alex Johnson", username: "alexj" },
    },
    {
      _id: "4",
      title: "CSS Grid Layout Mastery",
      thumbnail:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop",
      excerpt: "Master CSS Grid with practical examples and tips...",
      owner: { fullName: "Sarah Williams", username: "sarahw" },
    },
    {
      _id: "5",
      title: "Node.js Best Practices",
      thumbnail:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=150&fit=crop",
      excerpt: "Learn the best practices for Node.js development...",
      owner: { fullName: "Mike Brown", username: "mikeb" },
    },
  ];

  // Hardcoded users
  const mockUsers = [
    {
      _id: "u1",
      fullName: "John Doe",
      username: "johndoe",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      bio: "Full-stack developer passionate about React and TypeScript",
    },
    {
      _id: "u2",
      fullName: "Jane Smith",
      username: "janesmith",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      bio: "UI/UX designer and frontend enthusiast",
    },
    {
      _id: "u3",
      fullName: "Alex Johnson",
      username: "alexj",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      bio: "Backend engineer specializing in Node.js and databases",
    },
    {
      _id: "u4",
      fullName: "Sarah Williams",
      username: "sarahw",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      bio: "Content creator and tech blogger",
    },
    {
      _id: "u5",
      fullName: "Mike Brown",
      username: "mikeb",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
      bio: "DevOps engineer and cloud architecture expert",
    },
  ];

  // Undo/Redo handlers
  const handleUndo = () => {
    if (editor) {
      editor.chain().focus().undo().run();
    }
  };

  const handleRedo = () => {
    if (editor) {
      editor.chain().focus().redo().run();
    }
  };

  // Editor mode handlers
  const handleSaveClick = () => {
    console.log("Header1 Save button clicked");
    onSave?.();
  };

  const handlePreviewClick = () => {
    console.log(
      "Header1 Preview button clicked, isPreviewMode:",
      isPreviewMode
    );
    onPreview?.();
  };

  const handleBackToEditorClick = () => {
    console.log("Header1 Back to Editor button clicked");
    onBackToEditor?.();
  };

  // Throttle header height recalculation
  const updateHeight = useThrottledCallback(
    () => {
      if (headerRef.current && onHeightChange) {
        onHeightChange(headerRef.current.offsetHeight);
      }
    },
    100,
    [isScrolled, onHeightChange],
    { leading: true, trailing: true }
  );

  useEffect(() => {
    updateHeight();
  }, [updateHeight, isSearchExpanded]);

  // Search logic - filter immediately without debounce
  useEffect(() => {
    if (searchQuery.trim()) {
      // Filter blogs immediately
      const filteredBlogs = mockSearchResults.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredBlogs);

      // Filter users immediately
      const filteredUsers = mockUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUserResults(filteredUsers);
    } else {
      // Show all hardcoded results when search is expanded but no query
      setSearchResults(mockSearchResults);
      setUserResults(mockUsers);
    }
  }, [searchQuery]);

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
    // Show all hardcoded results when focused
    if (!searchQuery.trim()) {
      setSearchResults(mockSearchResults);
      setUserResults(mockUsers);
    }
  };

  const handleSearchBlur = (e: React.FocusEvent) => {
    // Don't collapse if clicking on results
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setTimeout(() => {
        setIsSearchExpanded(false);
        setSearchQuery("");
        setSearchResults([]);
        setUserResults([]);
      }, 200);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!isSearchExpanded) {
      setIsSearchExpanded(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults(mockSearchResults);
    setUserResults(mockUsers);
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    if (disableScrollEffect || isEditorMode) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [disableScrollEffect, isEditorMode]);

  const handleSignIn = () => {
    navigate("/auth/login");
  };

  const handleGetStarted = () => {
    navigate("/auth/register");
  };

  const handleLogout = async () => {
    await logout();
    // logout() already navigates to /auth/login, no need to navigate again
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const showWriteButton = location.pathname === "/home";
  const writeUrl = "/editor";

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled || isSearchExpanded
            ? "border-b border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-lg"
            : "border-b border-transparent",
          isEditorMode &&
            "border-b-2 border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-lg",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div
          className={cn(
            "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
            isEditorMode && "max-w-full px-4 sm:px-6 lg:px-8"
          )}
        >
          <div
            className={cn(
              "relative flex items-center justify-between transition-all duration-300",
              isSearchExpanded ? "h-auto py-4" : "h-16"
            )}
          >
            {/* Logo and Editor Info */}
            <div className="shrink-0 flex items-center gap-4">
              <Link
                to={isAuthenticated ? "/home" : "/"}
                className="flex items-center cursor-pointer"
              >
                <span className="text-2xl font-bold text-black dark:text-white">
                  BlogLikho
                </span>
              </Link>

              {/* Word count and undo/redo for editor mode */}
              {isEditorMode && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-black/60 dark:text-white/60">
                    {Number(wordCount)} words
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={handleUndo}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10"
                      title="Undo"
                    >
                      <Undo className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleRedo}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10"
                      title="Redo"
                    >
                      <Redo className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar - Center */}
            {!isEditorMode && (
              <div className="flex-1 max-w-2xl mx-4 hidden md:block">
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search blogs..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      className="w-full pl-10 pr-10 py-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent text-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Right side */}
            <div className="flex items-center shrink-0 gap-2">
              {/* Editor controls */}
              {isEditorMode && (
                <div className="flex items-center gap-2">
                  {isPreviewMode ? (
                    <Button
                      onClick={handleBackToEditorClick}
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10"
                      title="Back to Editor"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleSaveClick}
                        size="icon"
                        className="h-10 w-10 rounded-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black hover:text-white"
                        title="Save & Publish"
                      >
                        <Save className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={handlePreviewClick}
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-10 w-10 rounded-full text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10",
                          isPreviewMode &&
                            "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        )}
                        title="Preview"
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                  <ThemeToggle className="hover:bg-transparent text-sm md:text-md lg:text-lg font-semibold hover:text-black dark:hover:text-white" />

                  {/* User controls in editor mode */}
                  {isAuthenticated && currentUser && (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="hidden lg:block rounded-full focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent">
                            <Avatar>
                              <AvatarImage
                                src={currentUser.avatar}
                                alt={currentUser.fullName}
                              />
                              <AvatarFallback>
                                {getInitials(currentUser.fullName)}
                              </AvatarFallback>
                            </Avatar>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className={cn(
                            "w-56 backdrop-blur-lg border border-black/10 dark:border-white/10",
                            isScrolled
                              ? "bg-background/80 dark:bg-background/80"
                              : "bg-background/50 dark:bg-background/50"
                          )}
                        >
                          <DropdownMenuLabel>
                            <p className="font-bold text-black dark:text-white">
                              {currentUser.fullName}
                            </p>
                            <p className="text-xs text-black/60 dark:text-white/60">
                              @{currentUser.username}
                            </p>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
                          <DropdownMenuItem
                            className="cursor-pointer text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 focus:bg-black/10 dark:focus:bg-white/10"
                            asChild
                          >
                            <Link to="/profile" className="flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              <span>Profile</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 focus:bg-black/10 dark:focus:bg-white/10"
                            asChild
                          >
                            <Link
                              to="/profile/settings"
                              className="flex items-center"
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              <span>Settings</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
                          <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300 focus:bg-red-50 dark:focus:bg-red-950/20"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            <span>Sign Out</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              )}

              {/* Regular controls for non-editor mode */}
              {!isEditorMode && (
                <>
                  <ThemeToggle className="hover:bg-transparent text-sm md:text-md lg:text-lg font-semibold hover:text-black dark:hover:text-white" />

                  {isAuthenticated && currentUser ? (
                    <div className="flex items-center gap-2">
                      {showWriteButton && (
                        <Link to={writeUrl} className="hidden lg:block">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm md:text-md lg:text-lg font-semibold text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            <span className="hidden md:inline">Write</span>
                          </Button>
                        </Link>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="hidden lg:block rounded-full focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent">
                            <Avatar>
                              <AvatarImage
                                src={currentUser.avatar}
                                alt={currentUser.fullName}
                              />
                              <AvatarFallback>
                                {getInitials(currentUser.fullName)}
                              </AvatarFallback>
                            </Avatar>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className={cn(
                            "w-56 backdrop-blur-lg border border-black/10 dark:border-white/10",
                            isScrolled
                              ? "bg-background/80 dark:bg-background/80"
                              : "bg-background/50 dark:bg-background/50"
                          )}
                        >
                          <DropdownMenuLabel>
                            <p className="font-bold text-black dark:text-white">
                              {currentUser.fullName}
                            </p>
                            <p className="text-xs text-black/60 dark:text-white/60">
                              @{currentUser.username}
                            </p>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
                          <DropdownMenuItem
                            className="cursor-pointer text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 focus:bg-black/10 dark:focus:bg-white/10"
                            asChild
                          >
                            <Link to="/profile" className="flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              <span>Profile</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 focus:bg-black/10 dark:focus:bg-white/10"
                            asChild
                          >
                            <Link
                              to="/profile/settings"
                              className="flex items-center"
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              <span>Settings</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
                          <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300 focus:bg-red-50 dark:focus:bg-red-950/20"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            <span>Sign Out</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <div className="flex items-center md:space-x-4">
                      <Button
                        variant="ghost"
                        size="default"
                        onClick={handleSignIn}
                        className="text-black/80 text-sm md:text-md lg:text-lg font-semibold hover:bg-transparent dark:text-white/80 hover:text-black dark:hover:text-white"
                      >
                        Sign In
                      </Button>
                      <Button
                        size="lg"
                        onClick={handleGetStarted}
                        className="hidden md:inline-flex bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black hover:text-white px-8 py-3 text-lg font-medium rounded-full"
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Search Results - Expanded */}
          {isSearchExpanded && !isEditorMode && (
            <div className="border-t border-border/50 pt-4 pb-2">
              {/* Trending Tags Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3 px-2">
                  Trending Tags
                </h3>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-2">
                  {[
                    "Technology",
                    "AI",
                    "React",
                    "Travel",
                    "Foodie",
                    "Productivity",
                    "JavaScript",
                    "TypeScript",
                    "Web Development",
                    "Design",
                  ].map((tag) => (
                    <button
                      key={tag}
                      className="cursor-pointer bg-muted/60 hover:bg-muted/90 dark:bg-neutral-800/60 dark:hover:bg-neutral-800/90 dark:text-neutral-300 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors"
                      onClick={() => {
                        setSearchQuery(tag);
                        searchInputRef.current?.focus();
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {userResults.length > 0 || searchResults.length > 0 ? (
                <div className="space-y-6 max-h-[400px] overflow-y-auto scrollbar-hide">
                  {/* Users Section */}
                  {userResults.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3 px-2">
                        Users
                      </h3>
                      <div className="space-y-2">
                        {userResults.map((user) => (
                          <Link
                            key={user._id}
                            to={`/profile/${user.username}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-background/80 transition-colors group"
                            onClick={() => {
                              setIsSearchExpanded(false);
                              setSearchQuery("");
                              setSearchResults([]);
                              setUserResults([]);
                            }}
                          >
                            <Avatar className="h-12 w-12 shrink-0">
                              <AvatarImage
                                src={user.avatar}
                                alt={user.fullName}
                              />
                              <AvatarFallback>
                                {user.fullName
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-foreground group-hover:text-foreground/80 truncate">
                                {user.fullName}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                @{user.username}
                              </p>
                              {user.bio && (
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                  {user.bio}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blogs Section */}
                  {searchResults.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3 px-2">
                        Blogs
                      </h3>
                      <div className="space-y-2">
                        {searchResults.map((blog) => (
                          <Link
                            key={blog._id}
                            to={`/representation/${blog._id}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-background/80 transition-colors group"
                            onClick={() => {
                              setIsSearchExpanded(false);
                              setSearchQuery("");
                              setSearchResults([]);
                              setUserResults([]);
                            }}
                          >
                            <img
                              src={blog.thumbnail}
                              alt={blog.title}
                              className="w-16 h-12 object-cover rounded-md shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-foreground group-hover:text-foreground/80 truncate">
                                {blog.title}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {blog.excerpt}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                by {blog.owner.fullName}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : searchQuery.trim() ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No results found
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Start typing to search...
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header1;
