"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Camera, User, Plus, X } from "lucide-react";
import type { ProfileSetupProps } from "@/types/components/features/auth";
import FocusTrackingInput from "@/components/common/wrappers/FocusTrackingInput";
import { useAuthProgress } from "@/store/theme";

export const ProfileSetup: React.FC<ProfileSetupProps> = ({
  onComplete,
  onSkip,
}) => {
  const { setCurrentStep } = useAuthProgress();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Set initial step when component mounts
  useEffect(() => {
    console.log("[ProfileSetup] Setting initial step to: cover");
    setCurrentStep("cover");
  }, [setCurrentStep]);

  const handleAvatarUpload = (file: File) => {
    setUploadingAvatar(true);
    setAvatarFile(file);
    console.log("[ProfileSetup] Setting step to: avatar");
    setCurrentStep("avatar");
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
      setUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (file: File) => {
    setUploadingCover(true);
    setCoverFile(file);
    console.log("[ProfileSetup] Setting step to: cover");
    setCurrentStep("cover");
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverPreview(e.target?.result as string);
      setUploadingCover(false);
    };
    reader.readAsDataURL(file);
  };

  const handleComplete = () => {
    onComplete?.({
      avatar: avatarFile || undefined,
      coverImage: coverFile || undefined,
    });
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatarFile(null);
    setAvatarPreview("");
  };

  const handleRemoveCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverFile(null);
    setCoverPreview("");
  };

  return (
    <div className="h-[100vh] flex flex-col md:flex-row font-sans w-[100vw] flex-1 items-center justify-center p-4 overflow-hidden ">
      <div className="w-full max-w-md  py-4 px-8  hover:shadow-3xl bg-white/50 dark:bg-black/40 backdrop-blur-xl border dark:border-white/10 border-black/10 rounded-[32px] shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="animate-app-zoom-in duration-[0.4s] text-center animate-element animate-delay-100">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-2">
              <span className="font-light text-foreground dark:text-muted-foreground tracking-tighter">
                Setup Your Profile
              </span>
            </h1>
            <p className="text-foreground dark:text-muted-foreground">
              Click on the avatar or cover area to upload your images
            </p>
          </div>

          <div className="animate-app-zoom-in duration-[0.4s]">
            <div className="relative rounded-3xl overflow-hidden bg-card border border-border shadow-lg backdrop-blur-sm">
              {/* Cover Image Area - Clickable */}
              <div
                className="relative h-32 group cursor-pointer"
                onClick={() => document.getElementById("cover-input")?.click()}
              >
                <FocusTrackingInput
                  fieldName="cover"
                  id="cover-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCoverUpload(file);
                  }}
                  className="hidden"
                />
                {/* <input
                  id="cover-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCoverUpload(file);
                  }}
                  className="hidden"
                /> */}

                {coverPreview ? (
                  <>
                    <img
                      src={coverPreview || "/placeholder.svg"}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={handleRemoveCover}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors z-10"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-yellow-600 to-amber-600/40 dark:from-yellow-700/30 group-hover:bg-primary dark:to-yellow-950/30 flex items-center justify-center">
                    <div className="text-center text-muted-foreground group-hover:opacity-0 group-hover:text-foreground  transition-colors">
                      <Camera className="w-8 h-8 mx-auto mb-1" />
                      <p className="text-sm font-medium group-hover:opacity-0">
                        Add Cover
                      </p>
                    </div>
                  </div>
                )}

                {/* Upload overlay on hover */}
                {!coverPreview && (
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center">
                      <Plus className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm font-medium">Change Cover</p>
                    </div>
                  </div>
                )}

                {uploadingCover && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* Profile Content */}
              <div className="relative px-6 pb-6 ">
                {/* Avatar - Clickable */}
                <div className="absolute -top-12 left-6">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() =>
                      document.getElementById("avatar-input")?.click()
                    }
                  >
                    <FocusTrackingInput
                      fieldName="avatar"
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarUpload(file);
                      }}
                      className="hidden"
                    />
                    {/* <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarUpload(file);
                      }}
                      className="hidden"
                    /> */}

                    {avatarPreview ? (
                      <>
                        <img
                          src={avatarPreview || "/placeholder.svg"}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full border-4 border-background object-cover shadow-lg"
                        />
                        <button
                          onClick={handleRemoveAvatar}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors z-10"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </>
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-background  bg-muted flex items-center justify-center shadow-lg group-hover:bg-muted/80 transition-colors">
                        <User className="w-8 h-8 text-muted-foreground group-hover:opacity-0 group-hover:text-foreground transition-colors" />
                      </div>
                    )}

                    {/* Upload overlay */}
                    {!avatarPreview && (
                      <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    )}

                    {uploadingAvatar && (
                      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="pt-16 ">
                  <h3 className="text-xl font-semibold text-foreground animate-app-zoom-in duration-[0.6s] ">
                    Sophia Carter
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2 animate-app-zoom-in duration-[0.6s] ">
                    @sophiacarter
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxedanimate-app-zoom-in duration-[0.6s] ">
                    Software Engineer | Foodie | Travel Enthusiast
                  </p>

                  {/* Follow Button (Mock) */}
                  <button className="animate-app-fade-in duration-[0.8s]  mt-4 w-full py-2 px-4 bg-foreground text-background rounded-xl font-medium text-sm hover:bg-foreground/90 transition-colors">
                    Follow
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 animate-element animate-delay-300">
            <button
              onClick={onSkip}
              className="flex-1 rounded-2xl  py-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
            >
              Skip for Now
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Complete Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
