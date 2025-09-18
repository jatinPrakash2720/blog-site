// src/components/features/user/Library.tsx
import type React from "react";
import { Lock, MoreHorizontal } from "lucide-react";

const readingLists = [
  { id: "1", name: "Reading list", stories: 0, isPrivate: true },
  { id: "2", name: "React Deep Dive", stories: 12, isPrivate: false },
  { id: "3", name: "Design Inspiration", stories: 25, isPrivate: false },
];

const Library: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-foreground tracking-tight mb-8">
        Your Library
      </h1>
      <div className="space-y-4">
        {readingLists.map((list) => (
          <div
            key={list.id}
            className="bg-card p-5 rounded-2xl border border-border flex justify-between items-center shadow-sm hover:border-primary/50 transition-colors duration-200"
          >
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {list.name}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1.5">
                <span>
                  {list.stories} {list.stories === 1 ? "story" : "stories"}
                </span>
                {list.isPrivate && (
                  <>
                    <span className="mx-2 font-bold">·</span>
                    <Lock className="w-3.5 h-3.5 mr-1" />
                    <span>Private</span>
                  </>
                )}
              </div>
            </div>
            <button className="p-2 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors duration-200">
              <MoreHorizontal size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
