import React, { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

interface ProfileHeaderProps {
  formattedInstructor: {
    profileImage: string;
    name: string;
    email: string;
    rating: number;
    totalReview: number;
    location: string;
    isVerified: boolean;
    first_name: string;
  };
}

export default function ProfileHeader({
  formattedInstructor,
}: ProfileHeaderProps) {
  const [imageError, setImageError] = useState(false);

  const firstLetter = formattedInstructor?.first_name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div>
      <div className="flex flex-col gap-4 border p-4  rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Profile Image */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[140px] lg:h-[140px] rounded-full relative overflow-hidden bg-gray-100 flex items-center justify-center">
            {!imageError && formattedInstructor?.profileImage ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${formattedInstructor.profileImage}`}
                alt={formattedInstructor?.first_name || "User"}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-2xl sm:text-3xl lg:text-5xl font-medium text-gray-400">
                {firstLetter}
              </span>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#070707]">
                {formattedInstructor?.name}
              </h1>
              {formattedInstructor.isVerified && (
                <span className="bg-emerald-50 text-[#20B894] text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                  Verified <span className="text-[#20B894]">✓</span>
                </span>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-normal text-base sm:text-lg text-[#4A4C56]">
                  {formattedInstructor?.rating}
                </span>
                <span className="text-[#4A4C56] font-normal text-base sm:text-lg">
                  ({formattedInstructor?.totalReview})
                </span>
              </div>
            </div>

            <p className="text-[#777980] text-sm sm:text-base lg:text-lg">
              {formattedInstructor?.email}
            </p>

            <div className="flex items-center gap-2 sm:gap-4 text-sm text-gray-600">
              {formattedInstructor?.location && (
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="font-normal text-sm sm:text-base lg:text-lg text-[#4A4C56]">
                    {formattedInstructor.location}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
