// components\Dashboard\Profile\ProfileClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import TranslatedText from "@/components/Shared/TranslatedText";
import { useLanguage } from "@/context/LanguageContext";

interface UserProfile {
  name: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
}

const MOCK_USER: UserProfile = {
  name: "Nayon",
  fullName: "Nrb Nayon",
  email: "nrbnayon@gmail.com",
  role: "Super Admin",
};

export default function ProfileClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState<
    "account" | "notifications" | "language"
  >("account");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [editNameValue, setEditNameValue] = useState(user.fullName);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [popUpNotification, setPopUpNotification] = useState(true);
  const [chatNotification, setChatNotification] = useState(true);
  const [newUpdateNotification, setNewUpdateNotification] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language === "om" ? "Oromo" : "English");

  // Sync with global language if it changes externally and we don't have local changes
  useEffect(() => {
    if (!hasChanges) {
      setSelectedLanguage(language === "om" ? "Oromo" : "English");
    }
  }, [language, hasChanges]);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setUser(MOCK_USER);
      setEditNameValue(MOCK_USER.fullName);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveName = () => {
    if (!editNameValue.trim()) {
      toast.error("Name is required", {
        description: "Please enter a valid name.",
      });
      return;
    }

    if (editNameValue.length > 32) {
      toast.error("Name too long", {
        description: "Name must be 32 characters or less.",
      });
      return;
    }

    setUser({
      ...user,
      name: editNameValue.split(" ")[0] || editNameValue,
      fullName: editNameValue,
    });
    setIsEditingName(false);
    setHasChanges(true);
    toast.success("Name updated", {
      description: "Your name has been updated successfully.",
    });
  };

  const handleCancelName = () => {
    setEditNameValue(user.fullName);
    setIsEditingName(false);
  };

  const handleChangePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast.error("All fields required", {
        description: "Please fill in all password fields.",
      });
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      toast.error("Passwords don't match", {
        description: "New password and confirmation must match.",
      });
      return;
    }

    if (passwordData.new.length < 8) {
      toast.error("Password too short", {
        description: "Password must be at least 8 characters.",
      });
      return;
    }

    setIsEditingPassword(false);
    setPasswordData({ current: "", new: "", confirm: "" });
    setHasChanges(true);
    toast.success("Password changed", {
      description: "Your password has been updated successfully.",
    });
  };

  const handleCancelPassword = () => {
    setPasswordData({ current: "", new: "", confirm: "" });
    setIsEditingPassword(false);
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update global language
      if (selectedLanguage === "English") {
        setLanguage("en");
      } else if (selectedLanguage === "Oromo") {
        setLanguage("om");
      }

      toast.success("Profile saved", {
        description: "All changes have been saved successfully.",
      });
      setHasChanges(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save", {
        description: "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGlobalCancel = () => {
    if (hasChanges) {
      const confirm = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirm) return;
    }

    // Reset all editing states
    setIsEditingName(false);
    setIsEditingPassword(false);
    setEditNameValue(user.fullName);
    setPasswordData({ current: "", new: "", confirm: "" });
    setPopUpNotification(true);
    setChatNotification(true);
    setNewUpdateNotification(false);
    setSelectedLanguage(language === "om" ? "Oromo" : "English");
    setHasChanges(false);

    toast.info("Changes discarded", {
      description: "All unsaved changes have been discarded.",
    });
  };

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            <TranslatedText text={user.role} />
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            <TranslatedText text="Track, manage and forecast your lands." />
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleGlobalCancel}
            disabled={isSaving}
            className="text-foreground border-gray-300 bg-transparent hover:bg-primary/30 hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGlobalSave}
            disabled={isSaving || !hasChanges}
            className="bg-gray-800 text-white hover:bg-gray-900"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        {/* User Info Header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="relative w-18 h-18 rounded-full overflow-hidden shrink-0 bg-gray-200">
            <Image
              src={user.avatar || "/images/avatar.png"}
              alt="Profile"
              width={72}
              height={72}
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=random&size=72`;
              }}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-gray-500">
              <TranslatedText text="Update your username and manage your account" />
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Section Navigation Tabs */}
          <div className="w-full md:w-48 shrink-0 space-y-3">
            <button
              onClick={() => setActiveSection("account")}
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${activeSection === "account"
                ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                : "text-secondary hover:bg-gray-50"
                }`}
            >
              <TranslatedText text="Account Settings" />
            </button>
            <button
              onClick={() => setActiveSection("notifications")}
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${activeSection === "notifications"
                ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                : "text-secondary hover:bg-gray-50"
                }`}
            >
              <TranslatedText text="Notifications" />
            </button>
            <button
              onClick={() => setActiveSection("language")}
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${activeSection === "language"
                ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                : "text-secondary hover:bg-gray-50"
                }`}
            >
              <TranslatedText text="Language" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="flex-1 flex flex-col divide-y divide-gray-100">
            {/* Account Settings Section */}
            {activeSection === "account" && (
              <>
                {/* Name Field */}
                <div className="py-6 first:pt-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        <TranslatedText text="Your name" />
                      </label>

                      {isEditingName ? (
                        <div className="mt-3 max-w-lg bg-gray-50 text-foreground p-6 rounded-lg">
                          <p className="text-sm text-gray-500 mb-3">
                            Make sure this match the name on your any gov. ID.
                          </p>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">
                              <TranslatedText text="Full name" />
                            </label>
                            <Input
                              value={editNameValue}
                              onChange={(e) => setEditNameValue(e.target.value)}
                              className="w-full bg-white border-gray-300 text-foreground dark:text-gray-100"
                              placeholder="Enter your full name"
                              maxLength={32}
                            />
                            <div className="text-right text-xs text-gray-400">
                              <TranslatedText text="text limit" />{" "}
                              {editNameValue.length}/32
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-4">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleCancelName}
                              className="bg-gray-100 text-foreground hover:bg-gray-200"
                            >
                              <TranslatedText text="Cancel" />
                            </Button>
                            <Button
                              type="button"
                              onClick={handleSaveName}
                              className="text-white hover:bg-gray-800"
                            >
                              <TranslatedText text="Save" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground mt-1">
                          {user.fullName}
                        </div>
                      )}
                    </div>

                    {!isEditingName && (
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="flex items-center gap-2 text-gray-500 hover:text-foreground font-semibold text-sm transition-colors mt-1"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="py-6">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Email
                      </label>
                      <div className="text-foreground">
                        {showEmail
                          ? user.email
                          : user.email.replace(/(.{3})(.*)(@.*)/, "$1***$3")}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEmail(!showEmail)}
                      className="flex items-center gap-2 text-gray-500 hover:text-foreground font-semibold text-sm transition-colors"
                    >
                      {showEmail ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      {showEmail ? "Hide" : "View"}
                    </button>
                  </div>
                </div>

                {/* Password Field */}
                <div className="py-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Password
                      </label>

                      {isEditingPassword ? (
                        <div className="mt-3 max-w-lg bg-gray-50 text-foreground p-6 rounded-lg space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">
                              Current password
                            </label>
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={passwordData.current}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  current: e.target.value,
                                })
                              }
                              className="w-full bg-white border-gray-300"
                              placeholder="Enter current password"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">
                              New password
                            </label>
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={passwordData.new}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  new: e.target.value,
                                })
                              }
                              className="w-full bg-white border-gray-300"
                              placeholder="Enter new password"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">
                              Confirm new password
                            </label>
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={passwordData.confirm}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  confirm: e.target.value,
                                })
                              }
                              className="w-full bg-white border-gray-300"
                              placeholder="Confirm new password"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="showPassword"
                              checked={showPassword}
                              onChange={(e) =>
                                setShowPassword(e.target.checked)
                              }
                              className="rounded"
                            />
                            <label
                              htmlFor="showPassword"
                              className="text-xs text-secondary"
                            >
                              Show passwords
                            </label>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleCancelPassword}
                              className="bg-gray-100 text-foreground hover:bg-gray-200"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={handleChangePassword}
                              className="bg-gray-900 text-white hover:bg-gray-800"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground text-xl leading-none tracking-widest mt-1">
                          ••••••••••••••••
                        </div>
                      )}
                    </div>

                    {!isEditingPassword && (
                      <button
                        onClick={() => setIsEditingPassword(true)}
                        className="flex items-center gap-2 text-gray-500 hover:text-foreground font-semibold text-sm transition-colors mt-1"
                      >
                        <Pencil className="w-4 h-4" /> Change
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <div className="py-6">
                <div className="w-full">
                  <label className="block text-sm font-medium text-foreground mb-6">
                    <TranslatedText text="Notifications" />
                  </label>

                  <div className="space-y-4">
                    {/* Pop up notification */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">
                        <TranslatedText text="Pop up notification" />
                      </span>
                      <button
                        onClick={() => {
                          setPopUpNotification(!popUpNotification);
                          setHasChanges(true);
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${popUpNotification ? "bg-green-500" : "bg-gray-300"
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${popUpNotification
                            ? "translate-x-6"
                            : "translate-x-1"
                            }`}
                        />
                      </button>
                    </div>

                    {/* Turn on all chat notification */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">
                        <TranslatedText text="Turn on all chat notification" />
                      </span>
                      <button
                        onClick={() => {
                          setChatNotification(!chatNotification);
                          setHasChanges(true);
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${chatNotification ? "bg-green-500" : "bg-gray-300"
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${chatNotification ? "translate-x-6" : "translate-x-1"
                            }`}
                        />
                      </button>
                    </div>

                    {/* Turn on new update notification */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">
                        <TranslatedText text="Turn on new update notification" />
                      </span>
                      <button
                        onClick={() => {
                          setNewUpdateNotification(!newUpdateNotification);
                          setHasChanges(true);
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${newUpdateNotification ? "bg-green-500" : "bg-gray-300"
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newUpdateNotification
                            ? "translate-x-6"
                            : "translate-x-1"
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Language Section */}
            {activeSection === "language" && (
              <div className="py-6">
                <div className="w-full">
                  <label className="block text-sm font-medium text-foreground mb-4">
                    <TranslatedText text="Language" />
                  </label>

                  <div className="space-y-3">
                    {/* English */}
                    <button
                      onClick={() => {
                        setSelectedLanguage("English");
                        setHasChanges(true);
                      }}
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🇬🇧</span>
                        <span className="text-sm text-foreground font-medium">
                          <TranslatedText text="English" />
                        </span>
                      </div>
                      {selectedLanguage === "English" && (
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Oromo */}
                    <button
                      onClick={() => {
                        setSelectedLanguage("Oromo");
                        setHasChanges(true);
                      }}
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🇪🇹</span>
                        <span className="text-sm text-foreground font-medium">
                          <TranslatedText text="Oromo" />
                        </span>
                      </div>
                      {selectedLanguage === "Oromo" && (
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
