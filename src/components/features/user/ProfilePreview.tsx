// src/components/features/user/ProfilePreview.tsx
import type React from "react";
import type { User } from "@/types/api";

const ProfilePreview: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="sticky top-24">
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm text-center">
        <img
          src={user.avatar}
          alt={user.fullName}
          className="w-24 h-24 rounded-full mx-auto ring-4 ring-background"
        />
        <h3 className="text-xl font-bold mt-4 text-foreground">
          {user.fullName}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">1 follower</p>
        <button className="mt-6 w-full px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors duration-200">
          Edit Profile
        </button>
      </div>
      <div className="mt-6 px-4 text-xs text-muted-foreground text-center space-x-4">
        <a href="#" className="hover:text-foreground transition-colors">
          Help
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Status
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          About
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Careers
        </a>
      </div>
    </div>
  );
};

export default ProfilePreview;
