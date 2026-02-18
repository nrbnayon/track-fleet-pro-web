// components\Dashboard\Profile\ProfileClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";
import NotificationsClient from "@/components/Notifications/NotificationsClient";

import { useUser } from "@/hooks/useUser";
import { 
  useUpdateProfileMutation, 
  useChangePasswordMutation 
} from "@/redux/services/authApi";

export default function ProfileClient() {
  const { profile, role, isLoading: profileLoading, email: userEmail } = useUser();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  const [isSaving, setIsSaving] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState<
    "account" | "notifications" | "language"
  >("account");
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [editNameValue, setEditNameValue] = useState("");
  const [editPhoneValue, setEditPhoneValue] = useState("");
  const [editAddressValue, setEditAddressValue] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editVehicle, setEditVehicle] = useState("");
  
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language === "om" ? "Oromo" : "English");

  // Sync with profile data
  useEffect(() => {
    if (profile) {
      setEditNameValue(profile.full_name || "");
      
      if (role === "SUPER_ADMIN") {
        setEditAddressValue(profile.address || "");
      } else if (role === "SELLER") {
        setEditPhoneValue(profile.seller_profile?.phone_number || "");
        setEditAddressValue(profile.seller_profile?.address || "");
      } else if (role === "DRIVER") {
        setEditFirstName(profile.driver_profile?.first_name || "");
        setEditLastName(profile.driver_profile?.last_name || "");
        setEditPhoneValue(profile.driver_profile?.phone_number || "");
        setEditAddressValue(profile.driver_profile?.address || "");
        setEditVehicle(profile.driver_profile?.vehicle_number || "");
      } else if (role === "CUSTOMER") {
        setEditPhoneValue(profile.customer_profile?.phone_number || "");
        setEditAddressValue(profile.customer_profile?.default_delivery_address || "");
      }
      
      setImagePreview(profile.profile_image || null);
    }
  }, [profile, role]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setHasChanges(true);
    }
  };

  const handleSaveName = () => {
    if (!editNameValue.trim()) {
      toast.error("Name is required");
      return;
    }
    setIsEditingName(false);
    setHasChanges(true);
  };

  const handleSavePhone = () => {
    setIsEditingPhone(false);
    setHasChanges(true);
  };

  const handleSaveAddress = () => {
    setIsEditingAddress(false);
    setHasChanges(true);
  };

  const handleChangePassword = async () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast.error("All fields required");
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const response = await changePassword({
        old_password: passwordData.current,
        new_password: passwordData.new,
        confirm_password: passwordData.confirm
      }).unwrap();

      if (response.success) {
        toast.success("Password updated successfully");
        setIsEditingPassword(false);
        setPasswordData({ current: "", new: "", confirm: "" });
      } else {
        toast.error(response.message || "Failed to update password");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  // Helper to extract the first error message from a nested error object
  const getFirstError = (err: any): string => {
    if (typeof err === 'string') return err;
    if (Array.isArray(err)) return getFirstError(err[0]);
    if (typeof err === 'object' && err !== null) {
      const firstKey = Object.keys(err)[0];
      if (firstKey) return getFirstError(err[firstKey]);
    }
    return "Validation failed";
  };

  const handleGlobalSave = async () => {
    // Basic validation
    if (!editNameValue.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (role as any !== "SUPER_ADMIN") {
      if (!editPhoneValue?.trim()) {
        toast.error("Phone number is required");
        return;
      }
      if (!editAddressValue?.trim()) {
        toast.error("Address is required");
        return;
      }
      if (role === "DRIVER" && !editVehicle?.trim()) {
        toast.error("Vehicle number is required");
        return;
      }
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("full_name", editNameValue);
      
      if (profileImage) {
        formData.append("profile_image", profileImage);
        // Add nested for specific roles
        if (role === "SELLER") {
          formData.append("seller_profile.profile_image", profileImage);
          formData.append("seller_profile[profile_image]", profileImage);
        } else if (role === "DRIVER") {
          formData.append("driver_profile.profile_image", profileImage);
          formData.append("driver_profile[profile_image]", profileImage);
        } else if (role === "CUSTOMER") {
          formData.append("customer_profile.profile_image", profileImage);
          formData.append("customer_profile[profile_image]", profileImage);
        }
      }

      if (role === "SUPER_ADMIN") {
        formData.append("address", editAddressValue);
        formData.append("phone_number", editPhoneValue);
      } else if (role === "SELLER") {
        // Flat fields as primary
        formData.append("address", editAddressValue);
        formData.append("phone_number", editPhoneValue);
        // Nested structure using common multipart formats
        formData.append("seller_profile[address]", editAddressValue);
        formData.append("seller_profile[phone_number]", editPhoneValue);
        formData.append("seller_profile.address", editAddressValue);
        formData.append("seller_profile.phone_number", editPhoneValue);
      } else if (role === "DRIVER") {
        formData.append("first_name", editFirstName);
        formData.append("last_name", editLastName);
        formData.append("phone_number", editPhoneValue);
        formData.append("address", editAddressValue);
        formData.append("vehicle_number", editVehicle);
        // Nested fallbacks
        formData.append("driver_profile[first_name]", editFirstName);
        formData.append("driver_profile[last_name]", editLastName);
        formData.append("driver_profile[phone_number]", editPhoneValue);
        formData.append("driver_profile[address]", editAddressValue);
        formData.append("driver_profile[vehicle_number]", editVehicle);
      } else if (role === "CUSTOMER") {
        formData.append("phone_number", editPhoneValue);
        formData.append("address", editAddressValue);
        // Nested fallbacks
        formData.append("customer_profile[phone_number]", editPhoneValue);
        formData.append("customer_profile[default_delivery_address]", editAddressValue);
      }

      const response = await updateProfile(formData).unwrap();

      if (response.success) {
        toast.success("Profile saved successfully");
        setHasChanges(false);
        // Update language if changed
        if (selectedLanguage === "English") setLanguage("en");
        else if (selectedLanguage === "Oromo") setLanguage("om");
      } else {
        const errorMsg = response.errors ? getFirstError(response.errors) : (response.message || "Failed to save profile");
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error("Update error:", error);
      const errorData = error.data;
      const errorMessage = errorData?.errors ? getFirstError(errorData.errors) : (errorData?.message || "Something went wrong");
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGlobalCancel = () => {
    if (hasChanges) {
      const confirm = window.confirm("Discard unsaved changes?");
      if (!confirm) return;
    }
    window.location.reload();
  };

  const handleCancelName = () => {
    setEditNameValue(profile?.full_name || "");
    setEditFirstName(profile?.driver_profile?.first_name || "");
    setEditLastName(profile?.driver_profile?.last_name || "");
    setIsEditingName(false);
  };

  const handleCancelPhone = () => {
    if (role === "SELLER") setEditPhoneValue(profile?.seller_profile?.phone_number || "");
    else if (role === "DRIVER") setEditPhoneValue(profile?.driver_profile?.phone_number || "");
    else if (role === "CUSTOMER") setEditPhoneValue(profile?.customer_profile?.phone_number || "");
    setIsEditingPhone(false);
  };

  const handleCancelAddress = () => {
    if (role === "SUPER_ADMIN") setEditAddressValue(profile?.address || "");
    else if (role === "SELLER") setEditAddressValue(profile?.seller_profile?.address || "");
    else if (role === "DRIVER") setEditAddressValue(profile?.driver_profile?.address || "");
    else if (role === "CUSTOMER") setEditAddressValue(profile?.customer_profile?.default_delivery_address || "");
    setIsEditingAddress(false);
  };

  const handleCancelPassword = () => {
    setPasswordData({ current: "", new: "", confirm: "" });
    setIsEditingPassword(false);
  };

  if (profileLoading) {
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
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }


  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome {profile?.full_name}!
          </h1>
          <p className="text-sm text-secondary mt-1">
            Manage your profile information here as a <span className="font-bold text-primary">{role}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleGlobalCancel}
            disabled={isSaving || !hasChanges}
            className="text-foreground border-gray-300 bg-transparent hover:bg-primary/30 hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGlobalSave}
            disabled={isSaving || !hasChanges}
            className="bg-foreground text-white hover:bg-foreground"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        {/* User Info Header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 bg-gray-100 group">
            <Image
              src={imagePreview?.startsWith('/') ? imagePreview : "/images/user.webp"}
              alt="Profile"
              width={1000}
              height={1000}
              unoptimized
              className="object-cover w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile?.full_name || "User"
                )}&background=random&size=80`;
              }}
            />
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Pencil className="w-5 h-5 text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{profile?.full_name}</h2>
            <p className="text-sm text-secondary">
              Update your personal details and account settings
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Section Navigation Tabs */}
          <div className="w-full md:w-48 shrink-0 space-y-3">
            <button
              onClick={() => setActiveSection("account")}
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${activeSection === "account"
                ? "bg-green-50 text-primary border-l-4 border-primary"
                : "text-secondary hover:bg-blue-50"
                }`}
            >
              Account Settings
            </button>
            <button
              onClick={() => setActiveSection("notifications")}
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${activeSection === "notifications"
                ? "bg-green-50 text-primary border-l-4 border-primary"
                : "text-secondary hover:bg-blue-50"
                }`}
            >
              Notifications
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
                        {role === "DRIVER" ? "Personal Name" : "Display Name"}
                      </label>

                      {isEditingName ? (
                        <div className="mt-3 max-w-full bg-blue-50 text-foreground p-6 rounded-lg space-y-4">
                          {role === "DRIVER" ? (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs font-medium text-secondary">First Name</label>
                                <Input value={editFirstName} onChange={(e) => {setEditFirstName(e.target.value); setHasChanges(true);}} className="bg-white border-gray-300" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-medium text-secondary">Last Name</label>
                                <Input value={editLastName} onChange={(e) => {setEditLastName(e.target.value); setHasChanges(true);}} className="bg-white border-gray-300" />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-secondary">Full name</label>
                              <Input
                                value={editNameValue}
                                onChange={(e) => {setEditNameValue(e.target.value); setHasChanges(true);}}
                                className="w-full bg-white border-gray-300"
                                placeholder="Enter your full name"
                              />
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            <Button type="button" variant="secondary" onClick={handleCancelName} className="bg-gray-100">Cancel</Button>
                            <Button type="button" onClick={handleSaveName} className="text-white">Done</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground mt-1 text-lg font-medium">
                          {role === "DRIVER" ? `${profile?.driver_profile?.first_name} ${profile?.driver_profile?.last_name}` : profile?.full_name}
                        </div>
                      )}
                    </div>

                    {!isEditingName && (
                      <button onClick={() => setIsEditingName(true)} className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors mt-1">
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Phone Number Field */}
                {role !== "SUPER_ADMIN" && (
                  <div className="py-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                        {isEditingPhone ? (
                          <div className="mt-3 bg-blue-50 p-6 rounded-lg space-y-4">
                            <Input value={editPhoneValue} onChange={(e) => {setEditPhoneValue(e.target.value); setHasChanges(true);}} className="bg-white border-gray-300" />
                            <div className="flex items-center gap-3">
                              <Button variant="secondary" onClick={handleCancelPhone}>Cancel</Button>
                              <Button onClick={handleSavePhone}>Done</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-foreground mt-1 text-lg">{editPhoneValue || "N/A"}</div>
                        )}
                      </div>
                      {!isEditingPhone && (
                        <button onClick={() => setIsEditingPhone(true)} className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors mt-1">
                          <Pencil className="w-4 h-4" /> Edit
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Address Field */}
                <div className="py-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-foreground mb-1.5">Address</label>
                      {isEditingAddress ? (
                        <div className="mt-3 bg-blue-50 p-6 rounded-lg space-y-4">
                          <Input value={editAddressValue} onChange={(e) => {setEditAddressValue(e.target.value); setHasChanges(true);}} className="bg-white border-gray-300" />
                          <div className="flex items-center gap-3">
                            <Button variant="secondary" onClick={handleCancelAddress}>Cancel</Button>
                            <Button onClick={handleSaveAddress}>Done</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground mt-1 text-lg">{editAddressValue || "N/A"}</div>
                      )}
                    </div>
                    {!isEditingAddress && (
                      <button onClick={() => setIsEditingAddress(true)} className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors mt-1">
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Vehicle Field (Driver Only) */}
                {role === "DRIVER" && (
                  <div className="py-6 border-b border-gray-100">
                    <div className="flex justify-between items-start gap-4">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-foreground mb-1.5">Vehicle Number</label>
                        <Input 
                          value={editVehicle} 
                          onChange={(e) => {setEditVehicle(e.target.value); setHasChanges(true);}} 
                          className="bg-white border-gray-300 font-bold" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="py-6 border-b border-gray-100">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email (Security Locked)</label>
                      <div className="text-foreground text-lg">
                        {showEmail ? profile?.email_address : profile?.email_address?.replace(/(.{3})(.*)(@.*)/, "$1***$3")}
                      </div>
                    </div>
                    <button onClick={() => setShowEmail(!showEmail)} className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors">
                      {showEmail ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showEmail ? "Hide" : "View"}
                    </button>
                  </div>
                </div>

                {/* Password Field */}
                <div className="py-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-foreground mb-1.5">Security Password</label>
                      {isEditingPassword ? (
                        <div className="mt-3 bg-blue-50 p-6 rounded-lg space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">Current password</label>
                            <Input type={showPassword ? "text" : "password"} value={passwordData.current} onChange={(e) => setPasswordData({...passwordData, current: e.target.value})} className="bg-white border-gray-300" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">New password</label>
                            <Input type={showPassword ? "text" : "password"} value={passwordData.new} onChange={(e) => setPasswordData({...passwordData, new: e.target.value})} className="bg-white border-gray-300" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">Confirm new password</label>
                            <Input type={showPassword ? "text" : "password"} value={passwordData.confirm} onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} className="bg-white border-gray-300" />
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="showPassword" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="rounded" />
                            <label htmlFor="showPassword" className="text-xs text-secondary">Show passwords</label>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button variant="secondary" onClick={handleCancelPassword}>Cancel</Button>
                            <Button onClick={handleChangePassword} disabled={isChangingPassword}>{isChangingPassword ? "Updating..." : "Update Password"}</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground text-xl tracking-widest mt-1">••••••••••••••••</div>
                      )}
                    </div>
                    {!isEditingPassword && (
                      <button onClick={() => setIsEditingPassword(true)} className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors mt-1">
                        <Pencil className="w-4 h-4" /> Change
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && <div className="py-6"><NotificationsClient /></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

