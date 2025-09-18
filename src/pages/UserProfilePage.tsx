"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-media-query";
import Header from "@/components/layout/Header";
import ProfileSidebar from "@/components/features/user/ProfileSidebar";
import ProfilePreview from "@/components/features/user/ProfilePreview";
import ProfileDetails from "@/components/features/user/ProfileDetails";
import Library from "@/components/features/user/Library";
import { useAuth } from "@/store/auth"; // Import the auth hook
import Loader from "@/components/ui/Loader"; // Import a loader for loading states
// import type { ProfileView } from "@/types/pages"; // Assuming ProfileView is moved to a types file

export type ProfileView = "profile" | "library" | "stories" | "stats";
const UserProfilePage: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<ProfileView>("profile");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // 1. Get the username from the URL, if it exists
  const { username } = useParams<{ username: string }>();

  // 2. Get user data and functions from the Auth Context
  const { currentUser, viewedProfile, fetchUserProfile, loading, error } =
    useAuth();

  // 3. Fetch the appropriate user data when the component loads or username changes
  useEffect(() => {
    // If a username is in the URL, fetch that user's public profile.
    if (username) {
      fetchUserProfile(username);
    }
    // If there is no username, we will display the `currentUser` from the context.
  }, [username, fetchUserProfile]);

  // 4. Determine which user object to display
  const userToDisplay = username ? viewedProfile : currentUser;

  // 5. Handle Loading and Error states
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !userToDisplay) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">{error || "User not found."}</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case "profile":
        return <ProfileDetails user={userToDisplay} />;
      case "library":
        return <Library />;
      // ... other cases
      default:
        return <ProfileDetails user={userToDisplay} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header disableScrollEffect={true} />
      <div className="flex pt-16">
        <ProfileSidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isDesktop={isDesktop}
        />
        <main
          className={`flex-grow transition-all duration-300 ease-in-out ${
            !isDesktop && isSidebarOpen ? "ml-64" : "ml-0 lg:ml-64"
          } p-4 sm:p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-3 gap-8`}
        >
          <div className="xl:col-span-2">{renderContent()}</div>
          <aside className="hidden xl:block">
            <ProfilePreview user={userToDisplay} />
          </aside>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
