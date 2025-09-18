"use client";

import { useState, useEffect, useRef, useContext } from "react";
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
  Undo, // Add undo/redo icons
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
  // Editor props for fullscreen mode
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

  const textClass = isScrolled ? "text-foreground" : "text-white";
  const mutedTextClass = isScrolled ? "text-muted-foreground" : "text-white/80";
  const hoverTextClass = isScrolled
    ? "hover:text-foreground"
    : "hover:text-white";
  const iconButtonHoverClass = isScrolled
    ? "hover:bg-muted"
    : "hover:bg-white/10";
  const logoBgClass = isScrolled ? "bg-foreground" : "bg-white";
  const logoTextClass = isScrolled ? "text-background" : "text-black";

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
      <nav
        data-state={menuState ? "active" : "inactive"}
        className="fixed z-20 w-full"
      >
        <div
          className={cn(
            "w-full px-6 transition-all duration-300",
            isScrolled || isEditorMode
              ? "bg-background/95 backdrop-blur-lg shadow-sm border-b border-border"
              : "bg-transparent"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Left side - Logo and word count for editor mode */}
            <div className="relative z-30 flex w-full justify-between lg:w-auto">
              <div className="flex items-center gap-4">
                <Link
                  to={isAuthenticated ? "/home" : "/"}
                  className="flex items-center space-x-2"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300",
                      logoBgClass
                    )}
                  >
                    <span
                      className={cn(
                        "font-bold text-sm transition-colors duration-300",
                        logoTextClass
                      )}
                    >
                      BL
                    </span>
                  </div>
                  <span
                    className={cn(
                      "font-semibold text-lg hidden sm:inline transition-colors duration-300",
                      textClass
                    )}
                  >
                    BlogLikho
                  </span>
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
                className={cn(
                  "relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden transition-colors duration-300",
                  textClass
                )}
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-300" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-300" />
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
                        className={cn(
                          "block duration-150",
                          mutedTextClass,
                          hoverTextClass
                        )}
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
                "fixed inset-0 top-16 z-10 hidden h-[calc(100vh-4rem)] origin-top flex-col justify-between bg-background transition-transform duration-300 group-data-[state=active]:flex lg:relative lg:top-0 lg:h-auto lg:flex-row lg:!flex lg:w-fit lg:translate-y-0 lg:bg-transparent lg:p-0 lg:shadow-none",
                menuState ? "translate-y-0" : "-translate-y-[120%]"
              )}
            >
              {/* Mobile menu (hidden in editor mode) */}
              {!isEditorMode && (
                <div className="px-6 lg:hidden">
                  <ul className="space-y-6 text-2xl font-medium mt-8">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.href}
                          className="text-muted-foreground hover:text-foreground block duration-150"
                          onClick={() => setMenuState(false)}
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex w-full flex-col p-6 sm:w-auto sm:p-0 lg:flex-row lg:items-center lg:gap-3">
                <div className={cn("flex items-center gap-2", textClass)}>
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
                      <ThemeToggle className={iconButtonHoverClass} />
                      {isAuthenticated && currentUser ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className={cn(
                              isScrolled && "lg:hidden",
                              iconButtonHoverClass
                            )}
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
                            className={cn(
                              isScrolled && "lg:hidden",
                              iconButtonHoverClass
                            )}
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
                            variant="ghost"
                            size="sm"
                            className={cn(
                              isScrolled && "lg:hidden",
                              iconButtonHoverClass
                            )}
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
