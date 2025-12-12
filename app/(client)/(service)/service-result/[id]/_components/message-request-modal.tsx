"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { verifiedUser } from "@/src/utils/token-varify";
import { useGetCurrentUserQuery } from "@/src/redux/features/users/userApi";
import Link from "next/link";
import { toast } from "sonner";
import RequiredFieldsModal from "@/app/components/RequiredFieldsModal";
import { logout } from "@/src/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";

interface MessageRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (service: string) => void;
  instructor: any;
  singleUser: any;
}

const MessageRequestModal = ({
  isOpen,
  onClose,
  onSubmit,
  instructor,
  singleUser,
}: MessageRequestModalProps) => {
  const [selectedService, setSelectedService] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showRequiredFieldsModal, setShowRequiredFieldsModal] = useState(false);
  const [missingFields, setMissingFields] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const currentUser = verifiedUser();
  const { data: currentUserData, refetch } = useGetCurrentUserQuery(
    currentUser?.userId
  );
  const currentUserInfo = currentUserData?.data;

  const checkMissingFields = (userInfo = currentUserInfo) => {
    const personalInfo = userInfo?.personalInfo || {};
    const addressInfo = userInfo?.addressInfo || {};

    // console.log("personalInfo:", personalInfo); // For debugging

    const missing = {
      firstName: !personalInfo.first_name,
      lastName: !personalInfo.last_name,
      phoneNumber: !personalInfo.phone_number,
      dateOfBirth: !personalInfo.dath_of_birth,
      gender: !personalInfo.gender,
      country: !addressInfo.country,
      city: !addressInfo.city,
      state: !addressInfo.state_province_country_region,
      zipCode: !addressInfo.zipCode,
      // streetAddress: !addressInfo.streetAddress,
      aboutMe: !currentUserInfo?.about_me,
    };

    // Filter out fields that are not missing
    const actualMissingFields = Object.fromEntries(
      Object.entries(missing).filter(([_, isMissing]) => isMissing)
    );

    return actualMissingFields;
  };

  const handleSubmit = async () => {
    // Refetch user info and get the latest data
    const refetchResult = await refetch();
    const latestUserInfo = refetchResult?.data?.data;

    // If profile status is not safe, logout and redirect
    if (latestUserInfo?.profileStatus !== "safe") {
      localStorage.removeItem("accessToken");
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      setIsAuthenticated(false);
      router.push("/auth/login");
      return;
    }

    if (!selectedService) {
      setError("Please select a service to continue");
      return;
    }

    // Check if user has my_service
    if (
      !latestUserInfo?.my_service ||
      latestUserInfo?.my_service.length === 0
    ) {
      setShowServiceModal(true);
      return;
    }

    // Check for missing required fields
    const missingFieldsObj = checkMissingFields(latestUserInfo);
    if (Object.keys(missingFieldsObj).length > 0) {
      setMissingFields(missingFieldsObj);
      setShowRequiredFieldsModal(true);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(selectedService);
      setSelectedService("");
      setError("");
    } finally {
      setIsLoading(false);
    }
  };

  const skilles = singleUser?.my_service || [];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-10 md:px-0">
        <div className="bg-white rounded-xl p-6 w-[480px] relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full relative overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${instructor?.profileImage}`}
                alt={instructor?.first_name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-lg">{instructor?.first_name}</h3>
              <p className="text-gray-500 text-sm">{instructor?.email}</p>
            </div>
          </div>

          <h2 className="text-lg font-medium mb-2">Request Service</h2>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
              <span>⚠</span>
              <p>{error}</p>
              <button onClick={() => setError("")} className="ml-auto">
                ×
              </button>
            </div>
          )}

          <div className="space-y-2 mb-6">
            {skilles.map((skill: string) => (
              <button
                key={skill}
                onClick={() => setSelectedService(skill)}
                className={`w-full p-3 text-left rounded-lg border ${
                  selectedService === skill
                    ? "border-[#20B894] text-[#20B894]"
                    : "border-gray-200 text-gray-700"
                } hover:border-[#20B894] transition-colors`}
              >
                {skill}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`flex-1 bg-[#20B894] text-white py-2.5 rounded-lg ${
                !isLoading && "hover:bg-emerald-700"
              } transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? "Sending..." : "Send Request"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Service Required Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-[95%] sm:max-w-[500px] p-6 relative">
            <button
              className="absolute top-4 right-4 text-[#20B894] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowServiceModal(false)}
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-center">
              Service Required
            </h3>
            <p className="text-center mb-6">
              You need to add your service before sending exchange requests.
            </p>

            <div className="flex justify-center">
              <Link href="/dashboard/user-profile">
                <button
                  onClick={() => {
                    setShowServiceModal(false);
                    onClose();
                  }}
                  className="bg-[#20B894] text-white px-6 py-2.5 rounded-full hover:bg-[#1a9677] transition-colors duration-300 cursor-pointer"
                >
                  Add Service
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Required Fields Modal */}
      <RequiredFieldsModal
        isOpen={showRequiredFieldsModal}
        onClose={() => setShowRequiredFieldsModal(false)}
        missingFields={missingFields}
      />
    </>
  );
};

export default MessageRequestModal;
