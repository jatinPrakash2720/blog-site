"use client"

import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { CharacterCount, Selection } from "@tiptap/extensions"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

import { Edit } from "lucide-react"

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile"

// --- Components ---
import ThemeToggle from "@/components/common/wrappers/ThemeToggle"
import { Input } from "@/components/ui/input"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"
import {
  Search,
  X,
  Plus,
  Edit2,
  Trash2,
  StickyNote,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

// --- Styles ---
// Global styles for the editor (converted from SCSS)
const globalStyles = `
  /* Hide scrollbar completely */
  ::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
  }
  
  * {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
  
  ::-webkit-scrollbar-thumb {
    display: none !important;
  }
  
  ::-webkit-scrollbar-track {
    display: none !important;
  }
  
  /* Completely remove scrollbar arrows - multiple approaches */
  ::-webkit-scrollbar-button {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
    border: none !important;
  }
  
  /* Target all possible arrow states */
  ::-webkit-scrollbar-button:start:decrement,
  ::-webkit-scrollbar-button:end:increment {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
  
  /* Vertical scrollbar arrows */
  ::-webkit-scrollbar-button:vertical:start:decrement,
  ::-webkit-scrollbar-button:vertical:end:increment {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
  
  /* Horizontal scrollbar arrows */
  ::-webkit-scrollbar-button:horizontal:start:decrement,
  ::-webkit-scrollbar-button:horizontal:end:increment {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
  
  /* Additional targeting for stubborn arrows */
  ::-webkit-scrollbar-button:single-button {
    display: none !important;
  }
  
  ::-webkit-scrollbar-button:double-button {
    display: none !important;
  }
  
  /* Dark mode scrollbar styling - also hidden */
  .dark ::-webkit-scrollbar {
    display: none !important;
  }
  
  .dark * {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
  
  /* Force remove arrows on the editor container specifically */
  .simple-editor-wrapper ::-webkit-scrollbar-button {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
    border: none !important;
  }
  
  /* Nuclear option - hide all scrollbar buttons globally */
  *::-webkit-scrollbar-button {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
    border: none !important;
  }
  
  /* Body styles for editor */
  body {
    --tt-toolbar-height: 44px;
    --tt-theme-text: var(--tt-gray-light-900);
    font-family: "Inter", sans-serif;
    color: var(--tt-theme-text);
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    padding: 0;
    overscroll-behavior-y: none;
  }
  
  .dark body {
    --tt-theme-text: var(--tt-gray-dark-900);
  }
  
  .tiptap.ProseMirror {
    font-family: "DM Sans", sans-serif;
  }
  
  /* Header visibility control */
  .header-hidden {
    transform: translateY(-100%);
    transition: transform 0.3s ease-in-out;
  }
  
  .header-visible {
    transform: translateY(0);
    transition: transform 0.3s ease-in-out;
  }
`

import { BubbleMenu as BubbleMenuExtension } from "@tiptap/extension-bubble-menu"
import { EditorBubbleMenu } from "@/components/features/blog/BubbleMenu"

// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/store/auth";
import {
  Button,
  Button as WrapperButton,
} from "@/components/common/wrappers/Button"
import { cn } from "@/lib/utils"
import { useEditorContextSafe } from "@/store/editor"

interface SimpleEditorProps {
  onBackToEditor?: () => void
  initialContent?: string
  isEditable?: boolean
  isFullscreenMode?: boolean
  isHeaderVisible?: boolean
  onToggleHeader?: () => void
}

// Header for preview mode (non-fullscreen)
const PreviewHeader: React.FC<{ onBackToEditor?: () => void }> = ({
  onBackToEditor,
}) => (
  <header className="fixed top-0 left-0 right-0 z-50 p-4">
    <div className="mx-auto max-w-7xl flex justify-end items-center">
      <div className="flex items-center gap-2 p-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg">
        <WrapperButton
          onClick={onBackToEditor}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 rounded-full"
        >
          <Edit className="w-4 h-4" />
          <span>Back to Editor</span>
        </WrapperButton>
        <ThemeToggle />
      </div>
    </div>
  </header>
)

export function SimpleEditor({
  onBackToEditor,
  initialContent,
  isEditable = true,
  isFullscreenMode = false,
  isHeaderVisible = true,
  onToggleHeader,
}: SimpleEditorProps) {
  const { setEditor, setContent, setWordCount, title, setTitle } =
    useEditorContextSafe()
  const isMobile = useIsMobile()
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main")
  const [showTooltip, setShowTooltip] = React.useState(true)
  const [isHovered, setIsHovered] = React.useState(false)
  const [notes, setNotes] = React.useState<
    Array<{ id: string; content: string; color: string }>
  >([])
  const [showNotes, setShowNotes] = React.useState(false)
  const [editingNote, setEditingNote] = React.useState<string | null>(null)
  const [newNoteContent, setNewNoteContent] = React.useState("")
  const [notesPosition, setNotesPosition] = React.useState({ x: 16, y: 80 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 })
  const [drawerPosition, setDrawerPosition] = React.useState<
    "right" | "left" | "bottom" | "top" | "top-left"
  >("right")
  // const navigate = useNavigate();
  // const { currentUser } = useAuth();
  // const handleGoBack = () => navigate(-1);

  const editor = useEditor({
    editable: isEditable,
    content: initialContent
      ? JSON.parse(initialContent)
      : `<p>Start Writing...</p>`,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: cn(
          // Base editor styles
          "font-[DM_Sans] prose prose-lg max-w-none",
          // Fullscreen mode styles
          isFullscreenMode && "min-h-[500px] text-lg leading-[1.7]"
        ),
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      BubbleMenuExtension.configure({
        pluginKey: "bubbleMenu",
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      CharacterCount,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    onUpdate: ({ editor }) => {
      setContent(JSON.stringify(editor.getJSON()))
      setWordCount(editor.storage.characterCount.words())
    },
  })

  React.useEffect(() => {
    setEditor(editor)
    return () => setEditor(null)
  }, [editor, setEditor])

  // const handleSave = () => {
  //   console.log("SimpleEditor handleSave called");
  //   onSave?.(editor?.getJSON() || {});
  // };

  // const handlePreview = () => {
  //   console.log("SimpleEditor handlePreview called");
  //   if (!editor || !currentUser) return;
  //   onPreview?.(editor.getJSON());
  // };

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  // Hide tooltip after 4 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  // Calculate initial drawer position
  React.useEffect(() => {
    calculateDrawerPosition(notesPosition.x, notesPosition.y)
  }, [])

  const isPreviewMode = !isEditable

  // Header toggle functionality
  const toggleHeader = () => {
    console.log(
      "Toggle header clicked, current isHeaderVisible:",
      isHeaderVisible
    )
    onToggleHeader?.()
  }

  // Note management functions
  const addNote = () => {
    if (newNoteContent.trim()) {
      const newNote = {
        id: Date.now().toString(),
        content: newNoteContent.trim(),
        color: [
          "bg-background/30 backdrop-blur-sm border-border/20",
          "bg-primary/5 backdrop-blur-sm border-primary/15",
          "bg-purple-500/5 backdrop-blur-sm border-purple-500/15",
          "bg-pink-500/5 backdrop-blur-sm border-pink-500/15",
          "bg-emerald-500/5 backdrop-blur-sm border-emerald-500/15",
        ][Math.floor(Math.random() * 5)],
      }
      setNotes((prev) => [...prev, newNote])
      setNewNoteContent("")
    }
  }

  const updateNote = (id: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, content } : note))
    )
    setEditingNote(null)
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  const startEditing = (id: string, content: string) => {
    setEditingNote(id)
    setNewNoteContent(content)
  }

  // Drag handling functions
  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).closest("[data-draggable]")
    ) {
      setIsDragging(true)
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    // Get editor container bounds
    const editorContainer = document.querySelector(
      '[class*="max-w-[70%]"]'
    ) as HTMLElement
    let editorBounds = { left: 0, right: 0, top: 0, bottom: 0 }

    if (editorContainer) {
      const rect = editorContainer.getBoundingClientRect()
      editorBounds = {
        left: rect.left - 20, // Add some margin
        right: rect.right + 20,
        top: rect.top - 20,
        bottom: rect.bottom + 20,
      }
    }

    // Get research icon bounds (bottom-right corner)
    const researchIconSize = 56 // 14 * 4 (h-14 w-14)
    const researchIconMargin = 24 // 6 * 4 (bottom-6 right-6)
    const researchIconBounds = {
      left: window.innerWidth - researchIconSize - researchIconMargin,
      right: window.innerWidth - researchIconMargin,
      top: window.innerHeight - researchIconSize - researchIconMargin,
      bottom: window.innerHeight - researchIconMargin,
    }

    // Boundary constraints
    const headerHeight = 100
    const editorTop = 100 // Allow notes to go closer to header
    const minY = editorTop
    const maxY = window.innerHeight - 60 // Allow notes to go much closer to bottom
    const minX = 16
    const maxX = window.innerWidth - 80 // Only account for button width, not full notes width

    let constrainedX = Math.max(minX, Math.min(maxX, newX))
    let constrainedY = Math.max(minY, Math.min(maxY, newY))

    // Check if notes would overlap with research icon
    const notesWidth = 80 // Button width
    const notesHeight = 60 // Button height

    const wouldOverlapResearchIcon =
      constrainedX < researchIconBounds.right &&
      constrainedX + notesWidth > researchIconBounds.left &&
      constrainedY < researchIconBounds.bottom &&
      constrainedY + notesHeight > researchIconBounds.top

    if (wouldOverlapResearchIcon) {
      // Move notes up to avoid research icon
      constrainedY = researchIconBounds.top - notesHeight - 10
    }

    // Check if notes would overlap with editor container (only when close to it)
    const notesExpandedWidth = 320
    const notesExpandedHeight = 400 // Approximate height when expanded

    // Only apply collision detection when notes are relatively close to the editor
    const isNearEditor =
      Math.abs(constrainedX - (editorBounds.left + editorBounds.right) / 2) <
        400 &&
      Math.abs(constrainedY - (editorBounds.top + editorBounds.bottom) / 2) <
        400

    const wouldOverlapEditor =
      isNearEditor &&
      constrainedX < editorBounds.right &&
      constrainedX + notesExpandedWidth > editorBounds.left &&
      constrainedY < editorBounds.bottom &&
      constrainedY + notesExpandedHeight > editorBounds.top

    if (wouldOverlapEditor) {
      // Try to position to the right of editor
      if (
        editorBounds.right + 20 + notesExpandedWidth <
        window.innerWidth - 16
      ) {
        constrainedX = editorBounds.right + 20
      }
      // Try to position to the left of editor
      else if (editorBounds.left - 20 - notesExpandedWidth > 16) {
        constrainedX = editorBounds.left - 20 - notesExpandedWidth
      }
      // Try to position below editor
      else if (
        editorBounds.bottom + 20 + notesExpandedHeight <
        window.innerHeight - 16
      ) {
        constrainedY = editorBounds.bottom + 20
        constrainedX = Math.max(
          16,
          Math.min(
            editorBounds.left,
            window.innerWidth - notesExpandedWidth - 16
          )
        )
      }
      // Try to position above editor
      else if (editorBounds.top - 20 - notesExpandedHeight > editorTop) {
        constrainedY = editorBounds.top - 20 - notesExpandedHeight
        constrainedX = Math.max(
          16,
          Math.min(
            editorBounds.left,
            window.innerWidth - notesExpandedWidth - 16
          )
        )
      }
    }

    setNotesPosition({ x: constrainedX, y: constrainedY })

    // Calculate best drawer position with a slight delay for smooth transition
    setTimeout(() => {
      calculateDrawerPosition(constrainedX, constrainedY)
    }, 50)
  }

  const calculateDrawerPosition = (x: number, y: number) => {
    const notesWidth = 320
    const notesHeight = 400
    const spaceRight = window.innerWidth - x - 80 // 80px for button width
    const spaceLeft = x
    const spaceBottom = window.innerHeight - y - 60 // 60px for button height
    const spaceTop = y - 100 // Account for header space

    // Determine best position based on available space
    // Priority: right > left > bottom > top
    // But if near bottom-right of screen, use left position
    const isNearBottom = y > window.innerHeight * 0.7
    const isNearRight = x > window.innerWidth * 0.7

    console.log("Position calculation:", {
      x,
      y,
      isNearBottom,
      isNearRight,
      spaceTop,
      spaceLeft,
      spaceRight,
      spaceBottom,
    })

    if (
      isNearBottom &&
      isNearRight &&
      spaceLeft >= notesWidth &&
      spaceTop >= 200
    ) {
      // If near bottom-right, use top-left position
      console.log("Setting position: top-left (bottom-right)")
      setDrawerPosition("top-left")
    } else if (isNearBottom && spaceTop >= 200) {
      // If near bottom (but not right), use top position
      console.log("Setting position: top (near bottom)")
      setDrawerPosition("top")
    } else if (spaceRight >= notesWidth) {
      console.log("Setting position: right")
      setDrawerPosition("right")
    } else if (spaceLeft >= notesWidth) {
      console.log("Setting position: left")
      setDrawerPosition("left")
    } else if (spaceBottom >= notesHeight) {
      console.log("Setting position: bottom")
      setDrawerPosition("bottom")
    } else if (spaceTop >= 200) {
      // Use top if we have at least 200px of space
      console.log("Setting position: top (fallback)")
      setDrawerPosition("top")
    } else {
      // If no space in any direction, choose the one with most space
      const spaces = [
        { pos: "right", space: spaceRight },
        { pos: "left", space: spaceLeft },
        { pos: "bottom", space: spaceBottom },
        { pos: "top", space: spaceTop },
      ]
      const bestPosition = spaces.reduce((max, current) =>
        current.space > max.space ? current : max
      )
      console.log("Setting position: fallback to", bestPosition.pos)
      setDrawerPosition(bestPosition.pos as any)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "grabbing"
    } else {
      document.body.style.cursor = "default"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "default"
    }
  }, [isDragging, dragOffset])

  // Close notes menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotes) {
        const target = event.target as HTMLElement
        const notesContainer = target.closest("[data-notes-container]")
        const notesButton = target.closest("[data-notes-button]")

        // If click is outside both notes container and button, close the menu
        if (!notesContainer && !notesButton) {
          setShowNotes(false)
        }
      }
    }

    if (showNotes) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showNotes])

  return (
    <>
      {/* Inject global styles */}
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <div
        className={cn(
          // Default editor wrapper styles
          !isFullscreenMode && [
            "w-[63.8vw] h-[70vh] overflow-auto bg-background",
            "flex flex-col",
          ],
          // Fullscreen mode styles
          isFullscreenMode && [
            "w-screen h-screen fixed top-0 left-0 z-[40]", // Lower z-index than header (z-50)
            "border-none flex flex-col justify-center items-center",
            "bg-gradient-to-br from-background via-background to-muted/20",
            isHeaderVisible ? "pt-[100px]" : "pt-0", // Dynamic space for header
          ]
        )}
      >
        {/* Header only for non-fullscreen preview mode */}
        {!isFullscreenMode && isPreviewMode && (
          <PreviewHeader onBackToEditor={onBackToEditor} />
        )}

        {/* Fullscreen Editor Container */}
        {isFullscreenMode ? (
          <div
            className={cn(
              "max-w-[70%] w-full bg-background rounded-2xl",
              // Light mode shadow
              "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
              // Dark mode shadow - very prominent white shadow
              // "dark:shadow-[0_0_0_2px_rgba(255,255,255,0.2)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.15)] dark:shadow-[0_16px_64px_rgba(255,255,255,0.1)] dark:shadow-[0_32px_128px_rgba(255,255,255,0.05)]",
              // More visible border
              "border-2 border-border/80 dark:border-1 dark:border-white/15",
              "overflow-y-auto", // Move scrollbar to main container
              isHeaderVisible
                ? "min-h-[calc(100vh-180px)] max-h-[calc(100vh-180px)]"
                : "min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)]",
              "flex flex-col mx-auto",
              // Responsive adjustments
              isHeaderVisible
                ? "max-md:max-w-[90%] max-md:min-h-[calc(100vh-140px)] max-md:max-h-[calc(100vh-140px)]"
                : "max-md:max-w-[90%] max-md:min-h-[calc(100vh-40px)] max-md:max-h-[calc(100vh-40px)]"
            )}
          >
            {/* Title Input for Fullscreen */}
            <div className="px-8 py-8 pb-4 border-b border-border/30 max-md:px-6 max-md:py-6 max-md:pb-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="text-4xl md:text-5xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto bg-transparent placeholder:text-muted-foreground/40"
                disabled={isPreviewMode}
              />
            </div>

            {/* Editor Content */}
            <div className="relative flex-1">
              <EditorContext.Provider value={{ editor }}>
                {/* Bubble Menu - only show in editable mode */}
                {isEditable && (
                  <EditorBubbleMenu
                    editor={editor}
                    onHighlighterClick={() => setMobileView("highlighter")}
                    onLinkClick={() => setMobileView("link")}
                    // onGoBack={handleGoBack}
                    isMobile={isMobile}
                    // onSave={handleSave}
                    // onPreview={handlePreview}
                  />
                )}

                <EditorContent
                  editor={editor}
                  role="presentation"
                  className={cn(
                    "min-h-[500px] p-12 text-lg leading-[1.7]",
                    "text-foreground w-full focus:outline-none",
                    // Typography styles
                    "[&_h1]:text-[2.5rem] [&_h1]:font-bold [&_h1]:leading-[1.2] [&_h1]:my-8 [&_h1]:mb-6 [&_h1]:text-foreground",
                    "[&_h2]:text-[2rem] [&_h2]:font-semibold [&_h2]:leading-[1.3] [&_h2]:my-[1.8rem] [&_h2]:mb-[1.2rem] [&_h2]:text-foreground",
                    "[&_h3]:text-[1.5rem] [&_h3]:font-semibold [&_h3]:leading-[1.4] [&_h3]:my-6 [&_h3]:mb-4 [&_h3]:text-foreground",
                    "[&_p]:mb-6 [&_p]:text-foreground",
                    "[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
                    "[&_ul]:my-6 [&_ul]:pl-8 [&_ol]:my-6 [&_ol]:pl-8",
                    "[&_li]:mb-2",
                    "[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.9em]",
                    "[&_pre]:bg-muted [&_pre]:p-6 [&_pre]:rounded-lg [&_pre]:my-8 [&_pre]:overflow-x-auto",
                    // Mobile responsive
                    "max-md:p-8 max-md:text-base",
                    "max-md:[&_h1]:text-[2rem] max-md:[&_h2]:text-[1.5rem] max-md:[&_h3]:text-[1.25rem]"
                  )}
                />
              </EditorContext.Provider>
            </div>
          </div>
        ) : (
          /* Regular Editor Content */
          <EditorContext.Provider value={{ editor }}>
            {/* Bubble Menu - only show in editable mode */}
            {isEditable && (
              <EditorBubbleMenu
                editor={editor}
                onHighlighterClick={() => setMobileView("highlighter")}
                onLinkClick={() => setMobileView("link")}
                // onGoBack={handleGoBack}
                isMobile={isMobile}
                // onSave={handleSave}
                // onPreview={handlePreview}
              />
            )}

            <EditorContent
              editor={editor}
              role="presentation"
              className={cn(
                // Default editor content styles
                "max-w-[648px] w-full mx-auto h-full flex flex-col flex-1",
                // Preview mode spacing
                !isFullscreenMode && isPreviewMode && "pt-24",
                // Editor content padding
                "flex-1 p-12 pb-[30vh] max-sm:p-6 max-sm:pb-[30vh]"
              )}
            />
          </EditorContext.Provider>
        )}

        {/* AI Assistant Button - Bottom Right */}
        <div className="fixed bottom-6 right-6 z-50">
          {/* Tooltip */}
          {(showTooltip || isHovered) && (
            <div className="absolute bottom-16 right-0 w-64 p-3 bg-background border border-border rounded-lg shadow-lg animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground mb-1">
                    Research Assistant
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This feature will cover all researching sections of blog
                    writing in one place. Get AI-powered research,
                    fact-checking, and content suggestions.
                  </p>
                </div>
                <Button
                  onClick={() => setShowTooltip(false)}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              {/* Arrow pointing to button */}
              <div className="absolute bottom-[-6px] right-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-background"></div>
            </div>
          )}

          {/* Button */}
          <Button
            onClick={() => {
              // TODO: Navigate to AI assistant page
              console.log("AI Assistant clicked")
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
            size="icon"
            title="Research Assistant"
          >
            <Search className="h-6 w-6" />
          </Button>
        </div>

        {/* Sticky Notes Section */}
        <div
          className="fixed z-40 max-w-xs select-none transition-all duration-300 ease-out"
          style={{
            left: `${notesPosition.x}px`,
            top: `${notesPosition.y}px`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
          data-draggable
        >
          {/* Notes Toggle Button */}
          <Button
            onClick={() => setShowNotes(!showNotes)}
            className={`mb-3 h-11 px-4 bg-background/80 backdrop-blur-sm border border-border/20 dark:border-border/40 hover:bg-background/90 text-foreground rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${
              isDragging ? "cursor-grabbing scale-105" : "cursor-grab"
            }`}
            size="sm"
            data-draggable
            data-notes-button
          >
            <StickyNote className="h-4 w-4 mr-2" />
            <span className="font-medium">Notes</span>
            <span className="ml-2 px-2 py-0.5 bg-muted/60 text-muted-foreground text-xs rounded-full">
              {notes.length}
            </span>
          </Button>

          {/* Notes Container */}
          {showNotes && (
            <div
              data-notes-container
              className={`space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-border/20 scrollbar-track-transparent absolute z-50 animate-in fade-in-0 slide-in-from-bottom-2 duration-200 bg-background/90 backdrop-blur-sm border-2 border-border/80 dark:border-1 dark:border-white/15 rounded-xl p-4 shadow-sm ${
                drawerPosition === "right"
                  ? "left-full top-0 ml-2"
                  : drawerPosition === "left"
                  ? "right-full top-0 mr-2"
                  : drawerPosition === "bottom"
                  ? "top-full left-0 mt-2"
                  : drawerPosition === "top-left"
                  ? "right-full bottom-0 mr-2"
                  : "bottom-full left-0 mb-2"
              }`}
              style={{
                width:
                  drawerPosition === "left" ||
                  drawerPosition === "right" ||
                  drawerPosition === "top-left"
                    ? "320px"
                    : "280px",
                maxHeight:
                  drawerPosition === "top" ||
                  drawerPosition === "bottom" ||
                  drawerPosition === "top-left"
                    ? "300px"
                    : "400px",
              }}
            >
              {/* Add New Note */}
              <div className="bg-background/40 backdrop-blur-sm border-2 border-border/80 dark:border-1 dark:border-white/15 rounded-xl p-4 shadow-sm">
                <div className="space-y-3">
                  <Input
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Write your idea..."
                    className="bg-background/60 border-border/40 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-primary/20 rounded-lg"
                    onKeyPress={(e) => e.key === "Enter" && addNote()}
                  />
                  <Button
                    onClick={addNote}
                    size="sm"
                    className="w-full bg-muted/60 hover:bg-muted/80 border border-border/40 text-foreground hover:text-foreground/80 rounded-lg transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </div>

              {/* Existing Notes */}
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`${note.color} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 relative group border`}
                >
                  {editingNote === note.id ? (
                    <div className="space-y-3">
                      <Input
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        className="bg-background/80 border-border/60 text-foreground focus:border-primary/50 focus:ring-primary/20 rounded-lg"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          updateNote(note.id, newNoteContent)
                        }
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateNote(note.id, newNoteContent)}
                          size="sm"
                          className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 hover:text-emerald-200 rounded-lg text-xs"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingNote(null)}
                          size="sm"
                          variant="outline"
                          className="flex-1 border-border/60 text-muted-foreground hover:bg-background/80 rounded-lg text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-foreground/90 break-words leading-relaxed">
                        {note.content}
                      </p>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button
                          onClick={() => startEditing(note.id, note.content)}
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 bg-background/80 hover:bg-background/90 border border-border/60 rounded-lg"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => deleteNote(note.id)}
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 rounded-lg"
                        >
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {notes.length === 0 && (
                <div className="bg-background/20 backdrop-blur-sm border-2 border-border/80 dark:border-1 dark:border-white/15 rounded-xl p-6 text-center shadow-sm">
                  <StickyNote className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                  <p className="text-sm text-muted-foreground/80">
                    No notes yet. Add your first idea!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Header Toggle Button - Right Side */}
      <div className="fixed top-24 right-6 z-[60]">
        <Button
          onClick={toggleHeader}
          className="h-12 w-12 rounded-full bg-background border-2 border-border hover:bg-background/90 shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
          title={isHeaderVisible ? "Hide Header" : "Show Header"}
        >
          {isHeaderVisible ? (
            <ChevronUp className="h-5 w-5 text-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-foreground" />
          )}
        </Button>
      </div>
    </>
  )
}
