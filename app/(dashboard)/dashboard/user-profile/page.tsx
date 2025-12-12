"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import profile from "@/public/avatars/emily.png";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BsArrowUpRight } from "react-icons/bs";
import { LuPencilLine } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Change this import
import MyService from "./_components/my-services";
import Portfolio from "./_components/portfolio";

// Update imports
import Certificate from "./_components/certificate";
import {
  useGetSingleUserQuery,
  useUpdateUserMutation,
} from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { toast } from "sonner";
import { useRef } from "react"; // Add this import
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function UserProfile() {
  const [profileImage, setProfileImage] = useState(profile);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const validUser = verifiedUser();

  // Update the mutation hook
  const [updateUser] = useUpdateUserMutation();
  const { data: singleUser } = useGetSingleUserQuery(validUser?.userId);
  const singleUserData = singleUser?.data;
  // console.log("singleUser", singleUserData);

  // Add these after other state declarations
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      displayName: "",
      phoneNumber: "",
      // email: "",
      dateOfBirth: "",
      gender: "",
    },
    addressInfo: {
      country: "",
      streetAddress: "",
      aptSuite: "",
      city: "",
      stateProvinceCountryRegion: "",
      zipCode: "",
    },
    aboutMe: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev) => {
      if (section === "aboutMe") {
        return { ...prev, [section]: value };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };
    });
  };

  // Update the handleEditSave function
  useEffect(() => {
    if (singleUserData) {
      // Convert the stored date string to Date object if it exists
      const storedDate = singleUserData.personalInfo?.dath_of_birth
        ? new Date(singleUserData.personalInfo.dath_of_birth)
        : null;
      setSelectedDate(storedDate);

      setFormData({
        personalInfo: {
          firstName: singleUserData.personalInfo?.first_name || "",
          lastName: singleUserData.personalInfo?.last_name || "",
          displayName: singleUserData.personalInfo?.display_name || "",
          phoneNumber: singleUserData.personalInfo?.phone_number || "",
          // email: singleUserData.email || "",
          dateOfBirth: singleUserData.personalInfo?.dath_of_birth || "",
          gender: singleUserData.personalInfo?.gender || "",
        },
        addressInfo: {
          country: singleUserData.addressInfo?.country || "",
          streetAddress: singleUserData.addressInfo?.streetAddress || "",
          aptSuite: singleUserData.addressInfo?.apt_suite || "",
          city: singleUserData.addressInfo?.city || "",
          stateProvinceCountryRegion:
            singleUserData.addressInfo?.state_province_country_region || "",
          zipCode: singleUserData.addressInfo?.zipCode || "",
        },
        aboutMe: singleUserData?.about_me || "",
      });
    }
  }, [singleUserData]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      handleInputChange("personalInfo", "dateOfBirth", formattedDate);
    }
  };

  // Update handleEditSave function
  const handleEditSave = async () => {
    if (isEditing) {
      try {
        const formDataToSend = new FormData();

        // Add image if selected
        if (selectedImage) {
          formDataToSend.append("profileImage", selectedImage);
        }

        // Add personal info
        formDataToSend.append("first_name", formData.personalInfo.firstName);
        formDataToSend.append("userId", validUser?.userId);

        // Add nested personal info
        formDataToSend.append(
          "personalInfo[first_name]",
          formData.personalInfo.firstName
        );
        formDataToSend.append(
          "personalInfo[last_name]",
          formData.personalInfo.lastName
        );
        formDataToSend.append(
          "personalInfo[display_name]",
          formData.personalInfo.displayName
        );
        formDataToSend.append(
          "personalInfo[phone_number]",
          formData.personalInfo.phoneNumber
        );
        formDataToSend.append(
          "personalInfo[gender]",
          formData.personalInfo.gender
        );
        formDataToSend.append(
          "personalInfo[dath_of_birth]",
          selectedDate ? selectedDate.toISOString().split("T")[0] : ""
        );

        // Add address info
        formDataToSend.append(
          "addressInfo[country]",
          formData.addressInfo.country
        );
        formDataToSend.append(
          "addressInfo[streetAddress]",
          formData.addressInfo.streetAddress
        );
        formDataToSend.append(
          "addressInfo[apt_suite]",
          formData.addressInfo.aptSuite
        );
        formDataToSend.append("addressInfo[city]", formData.addressInfo.city);
        formDataToSend.append(
          "addressInfo[state_province_country_region]",
          formData.addressInfo.stateProvinceCountryRegion
        );
        formDataToSend.append(
          "addressInfo[zipCode]",
          formData.addressInfo.zipCode
        );
        formDataToSend.append("about_me", formData.aboutMe);
        const formDataObject = Object.fromEntries(formDataToSend.entries());
        // console.log("formDataObject", formDataObject);

        const response = await updateUser(formDataToSend).unwrap();

        if (response.success) {
          toast.success("Profile updated successfully");
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to update profile");
      }
    }
    setIsEditing(!isEditing);
  };

  const handleAddService = () => {
    setShowServiceModal(true);
  };

  // Add these new states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update handleImageClick
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Profile Photo Section */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto sm:mx-0">
            {selectedImage || singleUserData?.profileImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${singleUserData?.profileImage}`
                  }
                  alt="Profile"
                  fill
                  className="object-cover"
                  onError={(e: any) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.innerHTML = `
                      <div class="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xl font-semibold rounded-full">
                        ${
                          singleUserData?.first_name
                            ?.slice(0, 2)
                            ?.toUpperCase() || "UN"
                        }
                      </div>
                    `;
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xl font-semibold rounded-full">
                {singleUserData?.first_name?.slice(0, 2)?.toUpperCase() || "UN"}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-medium">
              {singleUserData?.first_name}
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              {isEditing && (
                <button
                  onClick={handleImageClick}
                  className="px-3 py-1.5 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678] flex justify-center items-center gap-x-2 cursor-pointer"
                >
                  Replace Photo
                  <BsArrowUpRight />
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Button Card */}
      <Card className="p-4 md:p-6">
        <div className="flex justify-end">
          <button
            onClick={handleEditSave}
            className={`text-sm border p-3 rounded-full flex items-center gap-x-2 cursor-pointer ${
              isEditing ? "bg-[#20B894] text-white" : "text-[#20B894]"
            }`}
          >
            <LuPencilLine />
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg font-medium mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="text-sm text-gray-600">First name</label>
            <Input
              value={formData.personalInfo.firstName}
              onChange={(e) =>
                handleInputChange("personalInfo", "firstName", e.target.value)
              }
              className="mt-1"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Last name</label>
            <Input
              value={formData.personalInfo.lastName}
              onChange={(e) =>
                handleInputChange("personalInfo", "lastName", e.target.value)
              }
              className="mt-1"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Display name</label>
            <Input
              value={formData.personalInfo.displayName}
              onChange={(e) =>
                handleInputChange("personalInfo", "displayName", e.target.value)
              }
              placeholder="Choose display name"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone number</label>
            <Input
              value={formData.personalInfo.phoneNumber}
              onChange={(e) =>
                handleInputChange("personalInfo", "phoneNumber", e.target.value)
              }
              placeholder="+1234567890"
              type="number"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Date of birth</label>
            <div className="mt-1">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd-MM-yyyy"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholderText="Select date"
                disabled={!isEditing}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                maxDate={new Date()}
              />
            </div>
          </div>

          <div className="w-full">
            <label className="text-sm text-gray-600">Gender</label>
            <Select
              value={formData.personalInfo.gender}
              onValueChange={(value) =>
                handleInputChange("personalInfo", "gender", value)
              }
              disabled={!isEditing}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg font-medium mb-6">Address Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="text-sm text-gray-600">Country</label>
            <Input
              value={formData.addressInfo.country}
              required
              onChange={(e) =>
                handleInputChange("addressInfo", "country", e.target.value)
              }
              placeholder="Enter your country"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Street address</label>
            <Input
              value={formData.addressInfo.streetAddress}
              onChange={(e) =>
                handleInputChange(
                  "addressInfo",
                  "streetAddress",
                  e.target.value
                )
              }
              placeholder="e.g. 123 Main St."
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Apt, suite. (optional)
            </label>
            <Input
              value={formData.addressInfo.aptSuite}
              onChange={(e) =>
                handleInputChange("addressInfo", "aptSuite", e.target.value)
              }
              placeholder="e.g. Apt #123"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">City</label>
            <Input
              value={formData.addressInfo.city}
              onChange={(e) =>
                handleInputChange("addressInfo", "city", e.target.value)
              }
              placeholder="e.g. America #123"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              State / Province / County / Region
            </label>
            <Input
              value={formData.addressInfo.stateProvinceCountryRegion}
              onChange={(e) =>
                handleInputChange(
                  "addressInfo",
                  "stateProvinceCountryRegion",
                  e.target.value
                )
              }
              placeholder="e.g. State #123"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Zip code</label>
            <Input
              value={formData.addressInfo.zipCode}
              onChange={(e) =>
                handleInputChange("addressInfo", "zipCode", e.target.value)
              }
              placeholder="726 664 074"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>
        </div>
      </Card>

      {/* About Me */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg font-medium mb-6">About Me</h2>
        <Textarea
          value={formData.aboutMe}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, aboutMe: e.target.value }))
          }
          className="min-h-[100px]"
          placeholder="Passionate about learning and sharing skills!..."
          disabled={!isEditing}
        />
      </Card>

      {/* My Service and Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <MyService singleUser={singleUser?.data} />
        <Portfolio />
      </div>

      {/* Extra Skills and Certificate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* <ExtraSkills /> */}
        <Certificate />
      </div>

      {/* Add Service Modal */}
      <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
        <DialogContent className="sm:max-w-[425px] p-4 md:p-6">
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Service name
              </label>
              <Input placeholder="Enter service name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Service description (optional)
              </label>
              <Textarea
                placeholder="Describe your service..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowServiceModal(false)}
                className="px-4 py-2 text-sm text-gray-500 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678]">
                Add Service
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
