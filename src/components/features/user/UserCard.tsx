import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/types/apisInterfaces/api";

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative group cursor-pointer rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 gap-0">
      {/* Main content */}
      <div className="flex items-center gap-4 bg-background/50 border border-border/50 dark:bg-background/50 rounded-lg p-2 relative z-10 transition-opacity duration-200 group-hover:opacity-0">
        <Avatar className="h-10 w-10 ring-2 ring-border/50 dark:ring-border/50">
          <AvatarImage src={user.avatar} alt={user.fullName} />
          <AvatarFallback className="text-xs">
            {getInitials(user.fullName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-base text-foreground">
            {user.fullName}
          </p>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      {/* Hover overlay with "see profile" text */}
      <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed bg-background/50 dark:bg-background/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
        <span className="text-foreground font-medium text-sm border-foreground/50 px-4 py-2 rounded-lg">
          see profile
        </span>
      </div>
    </div>
  );
};

export default UserCard;
