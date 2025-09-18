import React from "react";
import {
  Flame,
  Code,
  Plane,
  Utensils,
  Heart,
  Brain,
  Leaf,
  Briefcase,
  Film,
  Music,
} from "lucide-react";

// This object maps a category slug to its corresponding icon component
export const categoryIcons: {
  [key: string]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  "for-you": Flame,
  technology: Code,
  travel: Plane,
  food: Utensils,
  wellness: Heart,
  ai: Brain,
  sustainability: Leaf,
  business: Briefcase,
  entertainment: Film,
  music: Music,
};
