"use client";

import * as React from "react";
import { Editor } from "@tiptap/core";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code2,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Link,
  Image as ImageIcon,
  Highlighter,
  Minus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
  isHeaderVisible: boolean;
  onToggleSidebar?: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  isHeaderVisible,
  onToggleSidebar,
}) => {
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  // Check scroll position to show/hide arrows
  const checkScrollButtons = React.useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  // Scroll handlers
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  };

  // GSAP animation for unfold from bottom on mount
  React.useEffect(() => {
    if (!toolbarRef.current || !editor) return;

    // Animate in on mount - unfold from bottom
    gsap.fromTo(
      toolbarRef.current,
      {
        y: 100,
        opacity: 0,
        scaleY: 0,
        transformOrigin: "bottom center",
        display: "block",
      },
      {
        y: 0,
        opacity: 1,
        scaleY: 1,
        display: "block",
        duration: 0.5,
        ease: "power2.out",
      }
    );
  }, [editor]);

  // Check scroll buttons on mount and scroll
  React.useEffect(() => {
    if (!scrollContainerRef.current) return;

    checkScrollButtons();

    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener("scroll", checkScrollButtons);
    window.addEventListener("resize", checkScrollButtons);

    // Check again after a short delay to account for content loading
    const timeout = setTimeout(checkScrollButtons, 100);

    return () => {
      scrollContainer.removeEventListener("scroll", checkScrollButtons);
      window.removeEventListener("resize", checkScrollButtons);
      clearTimeout(timeout);
    };
  }, [checkScrollButtons, editor]);

  if (!editor) return null;

  // Toolbar actions
  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();

  const setHeading1 = () =>
    editor.chain().focus().toggleHeading({ level: 1 }).run();
  const setHeading2 = () =>
    editor.chain().focus().toggleHeading({ level: 2 }).run();
  const setHeading3 = () =>
    editor.chain().focus().toggleHeading({ level: 3 }).run();
  const setHeading4 = () =>
    editor.chain().focus().toggleHeading({ level: 4 }).run();
  const setHeading5 = () =>
    editor.chain().focus().toggleHeading({ level: 5 }).run();
  const setHeading6 = () =>
    editor.chain().focus().toggleHeading({ level: 6 }).run();

  const toggleBulletList = () =>
    editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor.chain().focus().toggleOrderedList().run();
  const toggleTaskList = () =>
    editor.chain().focus().toggleTaskList().run();
  const toggleBlockquote = () =>
    editor.chain().focus().toggleBlockquote().run();

  const setAlignLeft = () => editor.chain().focus().setTextAlign("left").run();
  const setAlignCenter = () =>
    editor.chain().focus().setTextAlign("center").run();
  const setAlignRight = () =>
    editor.chain().focus().setTextAlign("right").run();
  const setAlignJustify = () =>
    editor.chain().focus().setTextAlign("justify").run();

  const toggleCodeBlock = () =>
    editor.chain().focus().toggleCodeBlock().run();
  const toggleSuperscript = () =>
    editor.chain().focus().toggleSuperscript().run();
  const toggleSubscript = () =>
    editor.chain().focus().toggleSubscript().run();

  const insertHorizontalRule = () =>
    editor.chain().focus().setHorizontalRule().run();

  const toggleHighlight = () =>
    editor.chain().focus().toggleHighlight().run();

  // Get active heading level
  const getActiveHeading = () => {
    if (editor.isActive("heading", { level: 1 })) return 1;
    if (editor.isActive("heading", { level: 2 })) return 2;
    if (editor.isActive("heading", { level: 3 })) return 3;
    if (editor.isActive("heading", { level: 4 })) return 4;
    if (editor.isActive("heading", { level: 5 })) return 5;
    if (editor.isActive("heading", { level: 6 })) return 6;
    return null;
  };

  // Get active list type
  const getActiveList = () => {
    if (editor.isActive("bulletList")) return "bullet";
    if (editor.isActive("orderedList")) return "ordered";
    if (editor.isActive("taskList")) return "task";
    return null;
  };

  const HeadingIcon = () => {
    const level = getActiveHeading();
    if (level === 1) return <Heading1 className="h-3 w-3 lg:h-4 lg:w-4" />;
    if (level === 2) return <Heading2 className="h-3 w-3 lg:h-4 lg:w-4" />;
    if (level === 3) return <Heading3 className="h-3 w-3 lg:h-4 lg:w-4" />;
    if (level === 4) return <Heading4 className="h-3 w-3 lg:h-4 lg:w-4" />;
    if (level === 5) return <Heading5 className="h-3 w-3 lg:h-4 lg:w-4" />;
    if (level === 6) return <Heading6 className="h-3 w-3 lg:h-4 lg:w-4" />;
    return <Heading1 className="h-3 w-3 lg:h-4 lg:w-4" />;
  };

  const ListIcon = () => {
    const type = getActiveList();
    if (type === "bullet") return <List className="h-3 w-3 lg:h-4 lg:w-4" />;
    if (type === "ordered") return <ListOrdered className="h-3 w-3 lg:h-4 lg:w-4" />;
    if (type === "task") return <ListTodo className="h-3 w-3 lg:h-4 lg:w-4" />;
    return <List className="h-3 w-3 lg:h-4 lg:w-4" />;
  };

  const buttonClassName = (isActive?: boolean) =>
    cn(
      "h-7 lg:h-8 px-2 lg:px-2.5 gap-1 lg:gap-1.5 rounded-lg text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10",
      "text-xs lg:text-sm",
      isActive && "bg-black/10 dark:bg-white/10 text-black dark:text-white"
    );

  return (
    <div
      ref={toolbarRef}
      className={cn(
        "fixed left-0 right-0 z-40 bg-background/50 backdrop-blur-lg",
        // Desktop: At top with border-bottom
        "lg:border-b lg:border-black/10 lg:dark:border-white/10",
        isHeaderVisible ? "lg:top-16" : "lg:top-0",
        // Mobile/Tablet: At bottom, above MobileNavBar, with border-top
        "bottom-[72px] border-t border-black/10 dark:border-white/10",
        "lg:bottom-auto lg:border-t-0",
        // Height and padding - reduced height
        "lg:h-auto h-9 py-1 lg:py-2"
      )}
      style={{
        transformOrigin: "bottom center",
      }}
    >
      {/* Burger Menu Button - Extreme Left (Touching screen edge) */}
      {onToggleSidebar && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-30 flex items-center h-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className={cn(
              "h-7 lg:h-8 px-3 lg:px-4 rounded-lg rounded-l-none",
              "text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white",
              "hover:bg-black/10 dark:hover:bg-white/10",
              "text-xs lg:text-sm",
              "border-r border-border"
            )}
            title="Toggle Sidebar"
          >
            <Menu className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Left Scroll Arrow */}
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-20",
            onToggleSidebar && "left-12 sm:left-14 lg:left-16",
            "h-10 w-10 rounded-full",
            "bg-background/90 dark:bg-background/90 backdrop-blur-lg",
            "border border-black/10 dark:border-white/10",
            "flex items-center justify-center",
            "text-black/80 dark:text-white/80",
            "hover:text-black dark:hover:text-white",
            "hover:bg-background dark:hover:bg-background",
            "shadow-lg transition-all duration-200",
            "disabled:opacity-0 disabled:pointer-events-none",
            "cursor-pointer"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Right Scroll Arrow */}
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-20",
            "h-10 w-10 rounded-full",
            "bg-background/90 dark:bg-background/90 backdrop-blur-lg",
            "border border-black/10 dark:border-white/10",
            "flex items-center justify-center",
            "text-black/80 dark:text-white/80",
            "hover:text-black dark:hover:text-white",
            "hover:bg-background dark:hover:bg-background",
            "shadow-lg transition-all duration-200",
            "disabled:opacity-0 disabled:pointer-events-none",
            "cursor-pointer"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Scrollable Toolbar Content */}
        <div
          ref={scrollContainerRef}
          className={cn(
            "flex items-center gap-1 lg:gap-2 overflow-x-auto",
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
            onToggleSidebar ? "pl-12 sm:pl-14 lg:pl-16 pr-14" : "pl-14 pr-14",
            // Smaller padding on mobile/tablet
            "lg:py-2 py-1"
          )}
        >

          {/* Text Formatting - Dropdown on mobile/tablet, full options on laptop */}
          <div className="flex items-center gap-1 border-r border-border pr-2">
            {/* Mobile/Tablet: Dropdown */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      buttonClassName(),
                      "gap-1"
                    )}
                    title="Text Formatting"
                  >
                    <Bold className="h-3 w-3" />
                    <ChevronDown className="h-3 w-3 text-black/60 dark:text-white/60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={toggleBold}>
                    <Bold className="h-4 w-4 mr-2" />
                    Bold
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleItalic}>
                    <Italic className="h-4 w-4 mr-2" />
                    Italic
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleUnderline}>
                    <Underline className="h-4 w-4 mr-2" />
                    Underline
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleStrike}>
                    <Strikethrough className="h-4 w-4 mr-2" />
                    Strikethrough
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleCode}>
                    <Code className="h-4 w-4 mr-2" />
                    Inline Code
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Laptop: Full options with labels */}
            <div className="hidden lg:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBold}
                className={buttonClassName(editor.isActive("bold"))}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
                <span className="text-xs font-medium">Bold</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleItalic}
                className={buttonClassName(editor.isActive("italic"))}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
                <span className="text-xs font-medium">Italic</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleUnderline}
                className={buttonClassName(editor.isActive("underline"))}
                title="Underline"
              >
                <Underline className="h-4 w-4" />
                <span className="text-xs font-medium">Underline</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleStrike}
                className={buttonClassName(editor.isActive("strike"))}
                title="Strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
                <span className="text-xs font-medium">Strike</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCode}
                className={buttonClassName(editor.isActive("code"))}
                title="Inline Code"
              >
                <Code className="h-4 w-4" />
                <span className="text-xs font-medium">Code</span>
              </Button>
            </div>
          </div>

          {/* Headings - Dropdown on mobile/tablet, full options on laptop */}
          {/* Mobile/Tablet: Dropdown */}
          <div className="lg:hidden flex items-center gap-1 border-r border-border pr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    buttonClassName(!!getActiveHeading()),
                    "gap-1"
                  )}
                  title="Heading Styles"
                >
                  <HeadingIcon />
                  <ChevronDown className="h-3 w-3 text-black/60 dark:text-white/60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={setHeading1}>
                  <Heading1 className="h-4 w-4 mr-2" />
                  Heading 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={setHeading2}>
                  <Heading2 className="h-4 w-4 mr-2" />
                  Heading 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={setHeading3}>
                  <Heading3 className="h-4 w-4 mr-2" />
                  Heading 3
                </DropdownMenuItem>
                <DropdownMenuItem onClick={setHeading4}>
                  <Heading4 className="h-4 w-4 mr-2" />
                  Heading 4
                </DropdownMenuItem>
                <DropdownMenuItem onClick={setHeading5}>
                  <Heading5 className="h-4 w-4 mr-2" />
                  Heading 5
                </DropdownMenuItem>
                <DropdownMenuItem onClick={setHeading6}>
                  <Heading6 className="h-4 w-4 mr-2" />
                  Heading 6
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Laptop: Full options with descriptive labels */}
          <div className="hidden lg:flex items-center gap-1 border-r border-border pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={setHeading1}
              className={buttonClassName(editor.isActive("heading", { level: 1 }))}
              title="Heading Styles - Level 1"
            >
              <Heading1 className="h-4 w-4" />
              <span className="text-xs font-medium">Heading Styles</span>
              <span className="text-xs font-medium opacity-70">H1</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={setHeading2}
              className={buttonClassName(editor.isActive("heading", { level: 2 }))}
              title="Heading Styles - Level 2"
            >
              <Heading2 className="h-4 w-4" />
              <span className="text-xs font-medium">H2</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={setHeading3}
              className={buttonClassName(editor.isActive("heading", { level: 3 }))}
              title="Heading Styles - Level 3"
            >
              <Heading3 className="h-4 w-4" />
              <span className="text-xs font-medium">H3</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={setHeading4}
              className={buttonClassName(editor.isActive("heading", { level: 4 }))}
              title="Heading Styles - Level 4"
            >
              <Heading4 className="h-4 w-4" />
              <span className="text-xs font-medium">H4</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={setHeading5}
              className={buttonClassName(editor.isActive("heading", { level: 5 }))}
              title="Heading Styles - Level 5"
            >
              <Heading5 className="h-4 w-4" />
              <span className="text-xs font-medium">H5</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={setHeading6}
              className={buttonClassName(editor.isActive("heading", { level: 6 }))}
              title="Heading Styles - Level 6"
            >
              <Heading6 className="h-4 w-4" />
              <span className="text-xs font-medium">H6</span>
            </Button>
          </div>

          {/* Lists - Dropdown on mobile/tablet, full options on laptop */}
          {/* Mobile/Tablet: Dropdown */}
          <div className="lg:hidden flex items-center gap-1 border-r border-border pr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    buttonClassName(!!getActiveList()),
                    "gap-1"
                  )}
                  title="List Styles"
                >
                  <ListIcon />
                  <ChevronDown className="h-3 w-3 text-black/60 dark:text-white/60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={toggleBulletList}>
                  <List className="h-4 w-4 mr-2" />
                  Bullet List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleOrderedList}>
                  <ListOrdered className="h-4 w-4 mr-2" />
                  Numbered List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTaskList}>
                  <ListTodo className="h-4 w-4 mr-2" />
                  Task List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleBlockquote}>
                  <Quote className="h-4 w-4 mr-2" />
                  Quote
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Laptop: Full options with descriptive labels */}
          <div className="hidden lg:flex items-center gap-1 border-r border-border pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBulletList}
              className={buttonClassName(editor.isActive("bulletList"))}
              title="List Styles - Bullet"
            >
              <List className="h-4 w-4" />
              <span className="text-xs font-medium">List Styles</span>
              <span className="text-xs font-medium opacity-70">Bullet</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleOrderedList}
              className={buttonClassName(editor.isActive("orderedList"))}
              title="List Styles - Numbered"
            >
              <ListOrdered className="h-4 w-4" />
              <span className="text-xs font-medium">Numbered</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTaskList}
              className={buttonClassName(editor.isActive("taskList"))}
              title="List Styles - Task"
            >
              <ListTodo className="h-4 w-4" />
              <span className="text-xs font-medium">Task</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBlockquote}
              className={buttonClassName(editor.isActive("blockquote"))}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
              <span className="text-xs font-medium">Quote</span>
            </Button>
          </div>

          {/* Alignment - Dropdown on mobile/tablet, full options on laptop */}
          {/* Mobile/Tablet: Dropdown */}
          <div className="lg:hidden flex items-center gap-1 border-r border-border pr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    buttonClassName(editor.isActive({ textAlign: "left" }) || editor.isActive({ textAlign: "center" }) || editor.isActive({ textAlign: "right" }) || editor.isActive({ textAlign: "justify" })),
                    "gap-1"
                  )}
                  title="Text Alignment"
                >
                  <AlignLeft className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3 text-black/60 dark:text-white/60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={setAlignLeft}>
                  <AlignLeft className="h-4 w-4 mr-2" />
                  Align Left
                </DropdownMenuItem>
                <DropdownMenuItem onClick={setAlignCenter}>
                  <AlignCenter className="h-4 w-4 mr-2" />
                  Align Center
                </DropdownMenuItem>
                <DropdownMenuItem onClick={setAlignRight}>
                  <AlignRight className="h-4 w-4 mr-2" />
                  Align Right
                </DropdownMenuItem>
                <DropdownMenuItem onClick={setAlignJustify}>
                  <AlignJustify className="h-4 w-4 mr-2" />
                  Justify
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Laptop: Full options with descriptive labels */}
          <div className="hidden lg:flex items-center gap-1 border-r border-border pr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={setAlignLeft}
              className={buttonClassName(editor.isActive({ textAlign: "left" }))}
              title="Text Alignment - Left"
            >
              <AlignLeft className="h-4 w-4" />
              <span className="text-xs font-medium">Text Alignment</span>
              <span className="text-xs font-medium opacity-70">Left</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={setAlignCenter}
              className={buttonClassName(editor.isActive({ textAlign: "center" }))}
              title="Text Alignment - Center"
            >
              <AlignCenter className="h-4 w-4" />
              <span className="text-xs font-medium">Center</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={setAlignRight}
              className={buttonClassName(editor.isActive({ textAlign: "right" }))}
              title="Text Alignment - Right"
            >
              <AlignRight className="h-4 w-4" />
              <span className="text-xs font-medium">Right</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={setAlignJustify}
              className={buttonClassName(editor.isActive({ textAlign: "justify" }))}
              title="Text Alignment - Justify"
            >
              <AlignJustify className="h-4 w-4" />
              <span className="text-xs font-medium">Justify</span>
            </Button>
          </div>

          {/* Additional Tools - Dropdown on mobile/tablet, full options on laptop */}
          {/* Mobile/Tablet: Dropdown */}
          <div className="lg:hidden flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    buttonClassName(editor.isActive("codeBlock") || editor.isActive("highlight")),
                    "gap-1"
                  )}
                  title="More Tools"
                >
                  <Code2 className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3 text-black/60 dark:text-white/60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={toggleCodeBlock}>
                  <Code2 className="h-4 w-4 mr-2" />
                  Code Block
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleSuperscript}>
                  <SuperscriptIcon className="h-4 w-4 mr-2" />
                  Superscript
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleSubscript}>
                  <SubscriptIcon className="h-4 w-4 mr-2" />
                  Subscript
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleHighlight}>
                  <Highlighter className="h-4 w-4 mr-2" />
                  Highlight
                </DropdownMenuItem>
                <DropdownMenuItem onClick={insertHorizontalRule}>
                  <Minus className="h-4 w-4 mr-2" />
                  Horizontal Rule
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Laptop: Full options with descriptive labels */}
          <div className="hidden lg:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCodeBlock}
              className={buttonClassName(editor.isActive("codeBlock"))}
              title="Code Block"
            >
              <Code2 className="h-4 w-4" />
              <span className="text-xs font-medium">Code Block</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSuperscript}
              className={buttonClassName(editor.isActive("superscript"))}
              title="Superscript"
            >
              <SuperscriptIcon className="h-4 w-4" />
              <span className="text-xs font-medium">Superscript</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSubscript}
              className={buttonClassName(editor.isActive("subscript"))}
              title="Subscript"
            >
              <SubscriptIcon className="h-4 w-4" />
              <span className="text-xs font-medium">Subscript</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleHighlight}
              className={buttonClassName(editor.isActive("highlight"))}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
              <span className="text-xs font-medium">Highlight</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={insertHorizontalRule}
              className={buttonClassName()}
              title="Horizontal Rule"
            >
              <Minus className="h-4 w-4" />
              <span className="text-xs font-medium">Horizontal Rule</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
