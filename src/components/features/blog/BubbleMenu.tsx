"use client";

import * as React from "react";
import { Editor, isTextSelection } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react/menus";
import { EditorState } from "prosemirror-state";
import { cn } from "@/lib/utils";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { ToolbarGroup } from "@/components/tiptap-ui-primitive/toolbar";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { LinkButton, LinkPopover } from "@/components/tiptap-ui/link-popover";
import { ColorHighlightPopover, ColorHighlightPopoverButton } from "@/components/tiptap-ui/color-highlight-popover";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";

interface EditorBubbleMenuProps {
  editor: Editor | null;
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  onGoBack: () => void;
  isMobile: boolean;
  onSave: () => void;
  onPreview: () => void;
}

export const EditorBubbleMenu: React.FC<EditorBubbleMenuProps> = ({
  editor,
  onHighlighterClick,
  onLinkClick,
  onGoBack,
  isMobile,
  onSave,
  onPreview,
}) => {
  if (!editor) return null;

  

  return (
    <BubbleMenu
      editor={editor}
      
      shouldShow={({ state }: { state: EditorState }) => {
        const { from, to } = state.selection;
        return isTextSelection(state.selection) && from !== to;
      }}
      className="flex flex-col gap-1 bg-background text-foreground border border-border rounded-lg shadow-xl p-1"
    >
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center">
         

          <ToolbarGroup>
            <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
            <ListDropdownMenu
              types={["bulletList", "orderedList", "taskList"]}
              portal={isMobile}
            />
            <BlockquoteButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <MarkButton type="bold" />
            <MarkButton type="italic" />
            <MarkButton type="strike" />
            <MarkButton type="code" />
            <MarkButton type="underline" />
            <ImageUploadButton />
          </ToolbarGroup>

        </div>

        <div className="flex items-center">
          <ToolbarGroup>
            {!isMobile ? (
              <ColorHighlightPopover />
            ) : (
              <ColorHighlightPopoverButton onClick={onHighlighterClick} />
            )}
            {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
            <CodeBlockButton />
            <MarkButton type="superscript" />
            <MarkButton type="subscript" />
          </ToolbarGroup>

          <ToolbarGroup>
            <TextAlignButton align="left" />
            <TextAlignButton align="center" />
            <TextAlignButton align="right" />
            <TextAlignButton align="justify" />
          </ToolbarGroup>

        </div>
      </div>
    </BubbleMenu>
  );
};

export default EditorBubbleMenu;
