import React from "react";
import UserCard from "./UserCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/wrappers/Card";

// Mock data for demonstration
const mockUsersToFollow = [
  {
    _id: "1",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    fullName: "Innovate Future",
    username: "innovate_future",
  },
  {
    _id: "2",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    fullName: "Culinary Artist",
    username: "culinary_artist",
  },
  {
    _id: "3",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    fullName: "Wanderlust Stories",
    username: "wanderlust_stories",
  },
];

const FollowSuggestions: React.FC = () => {
  return (
    <Card className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border dark:border-neutral-800 border-black/10 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Who to follow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockUsersToFollow.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </CardContent>
    </Card>
  );
};

export default FollowSuggestions;
