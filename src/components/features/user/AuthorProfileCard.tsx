import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/common/wrappers/Button";
import type { User } from "@/types/apisInterfaces/api";

interface AuthorProfileCardProps {
  author: User;
}

const AuthorProfileCard: React.FC<AuthorProfileCardProps> = ({ author }) => {
  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") {
      return "?";
    }
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!author) {
    return null;
  }
  return (
    <div className="w-full dark:bg-background/50  bg-background/10 backdrop-blur-lg border border-border rounded-2xl  rounded-b-none shadow-sm p-4">
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={author.avatar} alt={author.fullName} />
          <AvatarFallback>{getInitials(author.fullName)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow text-left">
          <h3 className="text-md font-bold">{author.fullName}</h3>
          <p className="text-xs text-muted-foreground">@{author.username}</p>
        </div>
        <Button
          variant="default" // Using shadcn variant
          className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black"
        >
          Follow
        </Button>
      </div>
    </div>
  );
};

export default AuthorProfileCard;
