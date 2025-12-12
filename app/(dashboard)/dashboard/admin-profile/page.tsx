"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { BsArrowUpRight } from "react-icons/bs";
import { LuPencilLine } from "react-icons/lu";
import {
  useGetSingleUserQuery,
  useUpdateUserMutation,
} from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { toast } from "sonner";

export default function AdminProfile() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validUser = verifiedUser();
  const [updateUser] = useUpdateUserMutation();
  const { data: singleUser } = useGetSingleUserQuery(validUser?.userId);
  const singleUserData = singleUser?.data;

  // Modified formData structure
  const [formData, setFormData] = useState({
    firstName: "", // Moved outside personalInfo
    personalInfo: {
      lastName: "",
      phoneNumber: "",
    },
  });

  // Modified useEffect
  useEffect(() => {
    if (singleUserData) {
      setFormData({
        firstName: singleUserData.first_name || "", // Direct access
        personalInfo: {
          lastName: singleUserData.personalInfo?.last_name || "",
          phoneNumber: singleUserData.personalInfo?.phone_number || "",
        },
      });
    }
  }, [singleUserData]);

  // Modified handleInputChange
  const handleInputChange = (section: string, field: string, value: string) => {
    if (section === "firstName") {
      setFormData((prev) => ({
        ...prev,
        firstName: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleEditSave = async () => {
    if (isEditing) {
      try {
        const formDataToSend = new FormData();

        if (selectedImage) {
          formDataToSend.append("profileImage", selectedImage);
        }

        formDataToSend.append("userId", validUser?.userId);

        // Add firstName directly
        formDataToSend.append("first_name", formData.firstName);

        // Add other personal info
        formDataToSend.append(
          "personalInfo[last_name]",
          formData.personalInfo.lastName
        );
        formDataToSend.append(
          "personalInfo[phone_number]",
          formData.personalInfo.phoneNumber
        );

        // Log formData for debugging
        for (const pair of formDataToSend.entries()) {
          // console.log(pair[0], pair[1]);
        }

        const response = await updateUser(formDataToSend).unwrap();

        if (response.success) {
          toast.success("Profile updated successfully");
        }
      } catch (error: any) {
        console.error("Update Error:", error);
        toast.error(error?.data?.message || "Failed to update profile");
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Profile Image Card */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
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
              value={formData.firstName}
              onChange={(e) =>
                handleInputChange("firstName", "", e.target.value)
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
            <label className="text-sm text-gray-600">Email address</label>
            <Input
              value={singleUserData?.email || ""}
              className="mt-1"
              disabled={true}
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
              type="text"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
