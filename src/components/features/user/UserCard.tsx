import React from "react";
import Avatar from "@/components/common/wrappers/Avatar";
import {Button} from "@/components/common/wrappers/Button";
// import type { User } from "@/types"; // Assuming a User type exists

interface UserCardProps {
  user: {
    // Using a simplified user type for now
    _id: string;
    avatar: string;
    fullName: string;
    username: string;
  };
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar src={user.avatar} alt={user.fullName} />
        <div>
          <p className="font-semibold text-sm">{user.fullName}</p>
          <p className="text-xs text-gray-500">@{user.username}</p>
        </div>
      </div>
      <Button intent="secondary" className="text-xs h-8">
        Follow
      </Button>
    </div>
  );
};

export default UserCard;
