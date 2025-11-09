import React, { useEffect } from "react";
import { useSocial } from "@/store/social";
import UserCard from "./UserCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FollowSuggestions: React.FC = () => {
  const { suggestedUsers, fetchSuggestedUsers, loading } = useSocial();

  useEffect(() => {
    fetchSuggestedUsers();
  }, [fetchSuggestedUsers]);

  return (
    <Card className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border dark:border-neutral-800 border-black/10 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Who to follow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && suggestedUsers.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Loading suggestions...
          </div>
        ) : suggestedUsers.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No suggestions available
          </div>
        ) : (
          suggestedUsers.map((user) => (
            <UserCard key={user._id} user={user} />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default FollowSuggestions;
