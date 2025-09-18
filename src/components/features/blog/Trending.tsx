import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/wrappers/Card";
import Badge from "@/components/common/wrappers/Badge";

// Mock data for demonstration
const mockTrendingTags = [
  "Technology",
  "AI",
  "React",
  "Travel",
  "Foodie",
  "Productivity",
  "JavaScript",
];

const Trending: React.FC = () => {
  return (
    <Card className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border dark:border-neutral-800 border-black/10 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Trending Tags</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {mockTrendingTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="cursor-pointer bg-muted/60 hover:bg-muted/90 dark:bg-neutral-800/60 dark:hover:bg-neutral-800/90 dark:text-neutral-300"
          >
            {tag}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
};

export default Trending;
