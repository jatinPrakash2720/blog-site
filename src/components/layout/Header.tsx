"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  Edit2,
  User,
  Settings,
  LogOut,
  Save,
  Eye,
  Edit,
  Minimize,
  Undo,
  Redo,
} from "lucide-react";
import { useAuth } from "@/store/auth";
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
} from "@/components/common/wrappers/DropdownMenu";
import { cn } from "@/lib/utils";
import { useEditorContextSafe } from "@/store/editor";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Blogs", href: "/blogs" },
  { name: "About", href: "/about" },
];

interface HeaderProps {
  onHeightChange?: (height: number) => void;
  disableScrollEffect?: boolean;
  isEditorMode?: boolean;
  isPreviewMode?: boolean;
  onSave?: () => void;
  onPreview?: () => void;
  onBackToEditor?: () => void;
  onExitFullscreen?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onHeightChange,
  disableScrollEffect = false,
  isEditorMode = false,
  isPreviewMode = false,
  onSave,
  onPreview,
  onBackToEditor,
  onExitFullscreen,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuState, setMenuState] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, currentUser, logout } = useAuth();
  const { wordCount, editor } = useEditorContextSafe();

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

  const showWriteButton = location.pathname === "/home" && !isEditorMode;
  const writeUrl = `${location.pathname}/write`;

  // Debug handlers with visual feedback
  const handleSaveClick = () => {
    console.log("Header Save button clicked");
    onSave?.();
  };

  const handlePreviewClick = () => {
    console.log("Header Preview button clicked, isPreviewMode:", isPreviewMode);
    onPreview?.();
  };

  const handleBackToEditorClick = () => {
    console.log("Header Back to Editor button clicked");
    onBackToEditor?.();
  };

  useEffect(() => {
    if (headerRef.current && onHeightChange) {
      onHeightChange(headerRef.current.offsetHeight);
    }
  }, [isScrolled, onHeightChange, menuState]);

  useEffect(() => {
    if (disableScrollEffect || isEditorMode) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [disableScrollEffect, isEditorMode]);

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header ref={headerRef}>
      <nav
        data-state={menuState ? "active" : "inactive"}
        className="fixed z-20 w-full px-2 group"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            (isScrolled || isEditorMode) &&
              "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Left side - Logo and word count for editor mode */}
            <div className="flex w-full justify-between lg:w-auto">
              <div className="flex items-center gap-4">
                <Link
                  to={isAuthenticated ? "/home" : "/"}
                  aria-label="home"
                  className="flex items-center space-x-2"
                >
                  <Logo />
                </Link>

                {/* Word count and undo/redo for editor mode */}
                {isEditorMode && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {Number(wordCount)} words
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={handleUndo}
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        title="Undo"
                      >
                        <Undo className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleRedo}
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        title="Redo"
                      >
                        <Redo className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            {/* Center - Navigation menu (hidden in editor mode) */}
            {!isEditorMode && (
              <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Right side - Editor controls or regular controls */}
            <div
              className={cn(
                "bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent",
                menuState && "block"
              )}
            >
              {/* Mobile menu (hidden in editor mode) */}
              {!isEditorMode && (
                <div className="lg:hidden">
                  <ul className="space-y-6 text-base">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                          onClick={() => setMenuState(false)}
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Controls Container */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                {/* Editor controls for fullscreen mode */}
                {isEditorMode && (
                  <div className="flex items-center gap-2">
                    {/* Editor-specific controls */}
                    <div className="flex items-center gap-2 p-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg">
                      {isPreviewMode ? (
                        <Button
                          onClick={handleBackToEditorClick}
                          variant="ghost"
                          size="icon"
                          className="rounded-full h-10 w-10"
                          title="Back to Editor"
                        >
                          <Edit className="w-5 h-5" />
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={handleSaveClick}
                            size="icon"
                            className="rounded-full h-10 w-10"
                            title="Save & Publish"
                          >
                            <Save className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={handlePreviewClick}
                            variant="outline"
                            size="icon"
                            className={cn(
                              "rounded-full h-10 w-10",
                              isPreviewMode &&
                                "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                            title="Preview"
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                        </>
                      )}
                      <ThemeToggle className="rounded-full h-10 w-10" />
                      {onExitFullscreen && (
                        <Button
                          onClick={onExitFullscreen}
                          variant="ghost"
                          size="icon"
                          className="rounded-full h-10 w-10"
                          title="Exit Fullscreen"
                        >
                          <Minimize className="w-5 h-5" />
                        </Button>
                      )}
                    </div>

                    {/* User controls - show in fullscreen mode */}
                    {isAuthenticated && currentUser && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full h-10 w-10"
                          title="Notifications"
                        >
                          <Bell className="w-5 h-5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
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
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                              <p className="font-bold">
                                {currentUser.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                @{currentUser.username}
                              </p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                to="/profile"
                                className="flex items-center cursor-pointer"
                              >
                                <User className="w-4 h-4 mr-2" />
                                <span>Profile</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                to="/profile/settings"
                                className="flex items-center cursor-pointer"
                              >
                                <Settings className="w-4 h-4 mr-2" />
                                <span>Settings</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={handleLogout}
                              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              <span>Sign Out</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                )}

                {/* Regular controls for non-editor mode */}
                {!isEditorMode && (
                  <>
                    <ThemeToggle />
                    {isAuthenticated && currentUser ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={cn(isScrolled && "lg:hidden")}
                        >
                          <Link
                            to={writeUrl}
                            className="flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="hidden md:inline">Write</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(isScrolled && "lg:hidden")}
                        >
                          <Bell className="w-5 h-5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
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
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                              <p className="font-bold">
                                {currentUser.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                @{currentUser.username}
                              </p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                to="/profile"
                                className="flex items-center cursor-pointer"
                              >
                                <User className="w-4 h-4 mr-2" />
                                <span>Profile</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                to="/profile/settings"
                                className="flex items-center cursor-pointer"
                              >
                                <Settings className="w-4 h-4 mr-2" />
                                <span>Settings</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={handleLogout}
                              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              <span>Sign Out</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {showWriteButton && (
                          <Button
                            asChild
                            size="sm"
                            className={cn(
                              isScrolled ? "lg:inline-flex" : "hidden"
                            )}
                          >
                            <Link to="/home/write">
                              <span>Write</span>
                            </Link>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className={cn(isScrolled && "lg:hidden")}
                        >
                          <Link to="/auth/login">
                            <span>Login</span>
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className={cn(isScrolled && "lg:hidden")}
                        >
                          <Link to="/auth/register">
                            <span>Sign Up</span>
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className={cn(
                            isScrolled ? "lg:inline-flex" : "hidden"
                          )}
                        >
                          <Link to="/auth/register">
                            <span>Get Started</span>
                          </Link>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

// Logo component from the prompt
const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center space-x-2 ${className} `}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9B99FE] to-[#2BC8B7] flex items-center justify-center">
        <span className="font-bold text-sm text-white">BL</span>
      </div>
      <span className="font-semibold text-lg hidden sm:inline">BlogLikho</span>
    </div>
  );
};

export default Header;
