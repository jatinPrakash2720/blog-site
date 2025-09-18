// src/components/features/user/ProfileDetails.tsx
import type React from "react";
import type { User } from "@/types/api";

const ProfileDetails: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">
          {user.fullName}
        </h1>
        <button className="px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors duration-200 self-start sm:self-center">
          Update Profile
        </button>
      </div>

      <div className="space-y-6">
        <div className="border-b border-border pb-4">
          <h3 className="font-semibold text-xl mb-3 text-foreground">About</h3>
          <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
        </div>
        <div>
          <h3 className="font-semibold text-xl mb-4 text-foreground">
            Details
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-baseline">
              <span className="w-28 font-medium text-foreground">Username</span>
              <span className="text-muted-foreground">@{user.username}</span>
            </li>
            <li className="flex items-baseline">
              <span className="w-28 font-medium text-foreground">Email</span>
              <span className="text-muted-foreground">{user.email}</span>
            </li>
            <li className="flex items-baseline">
              <span className="w-28 font-medium text-foreground">Joined</span>
              <span className="text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
