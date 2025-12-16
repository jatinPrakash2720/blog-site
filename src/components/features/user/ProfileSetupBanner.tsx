import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { X, Image, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ProfileSetupBanner: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Check if user needs to setup profile images
  const needsSetup = React.useMemo(() => {
    if (!isAuthenticated || !currentUser) return false;
    
    const hasAvatar = currentUser.avatar && 
      currentUser.avatar.trim() !== "" && 
      currentUser.avatar !== "null" && 
      currentUser.avatar !== "undefined";
    
    const hasCoverImage = currentUser.coverImage && 
      currentUser.coverImage.trim() !== "" && 
      currentUser.coverImage !== "null" && 
      currentUser.coverImage !== "undefined";
    
    return !hasAvatar || !hasCoverImage;
  }, [currentUser, isAuthenticated]);

  // Check localStorage on mount and clear if images are now set
  React.useEffect(() => {
    if (needsSetup) {
      const dismissed = localStorage.getItem("profileSetupBannerDismissed");
      if (dismissed === "true") {
        setIsDismissed(true);
      }
    } else {
      // If images are set, clear dismissal so banner can show again if images are removed
      setIsDismissed(false);
      localStorage.removeItem("profileSetupBannerDismissed");
    }
  }, [needsSetup]);

  const handleGoToSettings = () => {
    navigate("/profile/settings");
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Store dismissal in localStorage to persist across sessions
    localStorage.setItem("profileSetupBannerDismissed", "true");
  };

  // Don't show if dismissed or doesn't need setup - MUST be after all hooks
  if (!needsSetup || isDismissed) return null;

  return (
    <div
      className={cn(
        "w-full bg-background dark:bg-zinc-900",
        "border-b border-border dark:border-zinc-800",
        "px-4 py-2 shadow-sm",
        "fixed top-[64px] left-0 right-0 z-40" // Position below header (header is ~64px tall)
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-black dark:bg-zinc-800 flex items-center justify-center">
              <Image className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              Setup your profile images
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={handleGoToSettings}
            size="sm"
            className={cn(
              "bg-black dark:bg-zinc-800",
              "hover:bg-zinc-800 dark:hover:bg-zinc-700",
              "text-white shadow-sm hover:shadow",
              "transition-all duration-200",
              "h-8 px-3 text-xs"
            )}
          >
            <Settings className="w-3.5 h-3.5 mr-1.5" />
            Go to Settings
          </Button>
          <button
            onClick={handleDismiss}
            className={cn(
              "p-1 rounded-md",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800",
              "transition-colors duration-200"
            )}
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupBanner;

