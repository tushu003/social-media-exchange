import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/src/redux/types/authInterface";
import { verifiedUser } from "@/src/utils/token-varify";
import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";

interface ServiceCardProps {
  user: User;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ user }) => {
  const [instructorImageError, setInstructorImageError] = useState(false);
  const [portfolioImageError, setPortfolioImageError] = useState(false);
  const router = useRouter();

  const currentUser = verifiedUser();
  const { data: singleUser } = useGetSingleUserQuery(currentUser?.userId);
  const singleUserData = singleUser?.data;

  const handleCardClick = () => {
    if (!currentUser) {
      // Store the target user ID before redirecting to login
      localStorage.setItem("redirectUserId", user?._id || "");
      router.push("/auth/login");
      return;
    }

    if (
      singleUserData?.profileStatus &&
      singleUserData.profileStatus !== "safe"
    ) {
      localStorage.removeItem("accessToken");
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      router.push("/auth/login");
      return;
    }

    if (user?._id) {
      router.push(`/service-result/${user._id}`);
    }
  };

  const profileImageUrl = user?.profileImage
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${user.profileImage}`
    : null;

  const portfolioImageUrl = user?.portfolio
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${user.portfolio}`
    : null;

  return (
    <Card className="w-full bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-all flex flex-col h-full p-0">
      {/* Portfolio Image Section */}
      <div className="w-full h-56 relative bg-gray-100">
        {portfolioImageUrl && !portfolioImageError ? (
          <Image
            src={portfolioImageUrl}
            alt="Portfolio"
            fill
            className="object-cover"
            onError={() => setPortfolioImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No portfolio image</span>
          </div>
        )}
        {/* Rating Badge Overlay */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-gray-700 font-medium">
            {typeof user?.rating === "number" ? user.rating.toFixed(1) : "0.0"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 relative overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
            {profileImageUrl && !instructorImageError ? (
              <Image
                src={profileImageUrl}
                alt={user?.first_name || "User"}
                fill
                sizes="64px"
                className="object-cover"
                onError={() => setInstructorImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl font-medium text-gray-600">
                  {user?.first_name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xl font-semibold text-[#070707] truncate">
              {user?.first_name || "User"}
            </h4>
            <p className="text-sm text-[#777980] truncate">{user?.email}</p>
          </div>
        </div>

        {/* Services & Stats */}
        <div className="bg-[#F9F9F9] p-4 rounded-xl mb-6">
          {/* Services List */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-[#777980] mb-2">
              Services:
            </h5>
            <div className="flex flex-wrap gap-2">
              {user?.my_service?.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="bg-teal-50 text-teal-700 text-xs px-3 py-1.5 rounded-full font-medium"
                >
                  {service}
                </span>
              ))}
              {user?.my_service?.length > 3 && (
                <span
                  className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                  title={`${user.my_service.length - 3} more services`}
                >
                  +{user.my_service.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-center">
              <span className="block text-[#777980] text-sm">
                Total Services
              </span>
              <span className="font-semibold text-[#4A4C56]">
                {user?.my_service?.length || 0}
              </span>
            </div>
            <div className="text-center">
              <span className="block text-[#777980] text-sm">Reviews</span>
              <span className="font-semibold text-[#4A4C56]">
                {user?.review || 0}
              </span>
            </div>
          </div>
        </div>

        {/* View Profile Button */}
        <button
          onClick={handleCardClick}
          className="w-full py-3.5 bg-[#20B894] text-white rounded-xl font-medium text-md hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 mt-auto shadow-sm hover:shadow shadow-[#20B894]/30 hover:cursor-pointer"
        >
          View Profile
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14m-7-7l7 7-7 7" />
          </svg>
        </button>
      </div>
    </Card>
  );
};
