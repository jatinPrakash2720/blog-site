"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud } from "lucide-react";
import ThemeToggle from "@/components/common/wrappers/ThemeToggle";
import type { Blog } from "@/types/apisInterfaces/api";

export interface BlogDetailsData {
  title: string;
  categoryId: string;
  subCategoryId?: string;
  thumbnail?: File;
  status: "draft" | "published";
}

interface BlogDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave?: (data: BlogDetailsData) => void;
  initialData?: Partial<Blog>;
  mode: "post-editor";
}

export const BlogDetailsDrawer: React.FC<BlogDetailsDrawerProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
  mode,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [categoryId, setCategoryId] = useState(
    initialData?.categories?.[0]?._id || ""
  );
  const [subCategoryId, setSubCategoryId] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const handleAction = () => {
    if (!categoryId) {
      alert("A category is required before publishing.");
      return;
    }
    onSave?.({
      title,
      categoryId,
      subCategoryId: subCategoryId || undefined,
      thumbnail: thumbnail || undefined,
      status,
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-2xl mx-auto">
        <div className="p-6">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>Publishing Details</DrawerTitle>
                <DrawerDescription>
                  Finalize your post's details before it goes live.
                </DrawerDescription>
              </div>
              <ThemeToggle className="rounded-full h-10 w-10" />
            </div>
          </DrawerHeader>

          <div className="space-y-6 px-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Your blog's title..."
                disabled={mode === "post-editor"}
              />
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Sub Category</Label>
                <Select value={subCategoryId} onValueChange={setSubCategoryId}>
                  <SelectTrigger id="subcategory">
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-dev">Web Development</SelectItem>
                    <SelectItem value="mobile-dev">
                      Mobile Development
                    </SelectItem>
                    <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                    <SelectItem value="ui-ux">UI/UX Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="thumbnail-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <input
                    id="thumbnail-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
              {thumbnail && (
                <p className="text-sm text-muted-foreground">
                  Selected: {thumbnail.name}
                </p>
              )}
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="status-toggle"
                checked={status === "published"}
                onCheckedChange={(checked) =>
                  setStatus(checked ? "published" : "draft")
                }
              />
              <Label htmlFor="status-toggle">
                {status === "published"
                  ? "Publish Immediately"
                  : "Save as Draft"}
              </Label>
            </div>
          </div>

          <DrawerFooter>
            <Button onClick={handleAction} className="w-full">
              {status === "published" ? "Publish Post" : "Save Draft"}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
