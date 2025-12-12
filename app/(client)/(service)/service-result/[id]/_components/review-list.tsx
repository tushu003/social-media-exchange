import { serviceCategories } from "@/constants/serviceCategories";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Flag, Star } from "lucide-react";
import FlagIcon from "@/public/icons/flag-icon";
import { useGetSingleReviewQuery } from "@/src/redux/features/shared/reviewApi";
import { useCreateReviewReportMutation } from "@/src/redux/features/shared/reportApi";
import { verifiedUser } from "@/src/utils/token-varify";
import ReportModal from "@/app/(dashboard)/dashboard/review/_components/report-modal";
import { toast } from "sonner";
import {
  useCreateDislikeMutation,
  useCreateLikeMutation,
} from "@/src/redux/features/shared/likeApi";

interface ReviewListProps {
  instructor: {
    profileImage: string;
    name: string;
  };
  review: {
    _id: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
    reviewerId: {
      _id: string;
      first_name: string;
      email: string;
      profileImage?: string;
      personalInfo: {
        display_name: string;
        first_name: string;
        last_name: string;
        gender: string;
        phone_number: number;
        dath_of_birth: string;
      };
    };
    reciverId: string;
    like: number;
    disLike: number;
    report: boolean;
    likedBy?: string[]; // Track who liked the review
    dislikedBy?: string[]; // Track who disliked the review
  };
}

const ReviewList = ({ review }: ReviewListProps) => {
  const [likes, setLikes] = useState(review.like || 0);
  const [dislikes, setDislikes] = useState(review.disLike || 0);
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [createReviewReport] = useCreateReviewReportMutation();
  const currentUser = verifiedUser();
  const [createLike] = useCreateLikeMutation();
  const [createDislike] = useCreateDislikeMutation();
  // console.log("review", review);
  

  // Track if the current user has already liked or disliked this review
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  // Check if user has already liked or disliked this review on component mount
  useEffect(() => {
    const userInteractions = JSON.parse(
      localStorage.getItem("reviewInteractions") || "{}"
    );
    const reviewInteraction = userInteractions[review._id] || {};

    // Check for likes
    if (
      review.likedBy &&
      Array.isArray(review.likedBy) &&
      currentUser?.userId
    ) {
      if (review.likedBy.includes(currentUser.userId)) {
        setIsLiked(true);
        setUserAction("like");
      }
    } else if (reviewInteraction.action === "like") {
      setIsLiked(true);
      setUserAction("like");
    }

    // Check for dislikes
    if (
      review.dislikedBy &&
      Array.isArray(review.dislikedBy) &&
      currentUser?.userId
    ) {
      if (review.dislikedBy.includes(currentUser.userId)) {
        setIsDisliked(true);
        setUserAction("dislike");
      }
    } else if (reviewInteraction.action === "dislike") {
      setIsDisliked(true);
      setUserAction("dislike");
    }
  }, [review._id, review.likedBy, review.dislikedBy, currentUser?.userId]);

  // Helper function to update localStorage
  const updateLocalStorage = (
    reviewId: string,
    action: "like" | "dislike" | null
  ) => {
    const userInteractions = JSON.parse(
      localStorage.getItem("reviewInteractions") || "{}"
    );

    if (action === null) {
      // Remove the action
      if (userInteractions[reviewId]) {
        delete userInteractions[reviewId];
      }
    } else {
      // Set the action
      userInteractions[reviewId] = {
        action,
        timestamp: new Date().toISOString(),
      };
    }

    localStorage.setItem(
      "reviewInteractions",
      JSON.stringify(userInteractions)
    );
  };

  const handleLike = async () => {
    // If already liked or disliked, prevent action
    if (isLiked || isDisliked) return;

    try {
      const response = await createLike({
        reviewId: review._id,
        userId: currentUser?.userId,
      }).unwrap();

      if (response.success) {
        // Update UI
        setLikes((prev) => prev + 1);
        setUserAction("like");
        setIsLiked(true);

        // Store interaction in localStorage
        updateLocalStorage(review._id, "like");

        toast.success("Review liked successfully");
      }
    } catch (error) {
      console.error("Error handling like:", error);
      toast.error("Failed to update like");
    }
  };

  const handleDislike = async () => {
    // If already liked or disliked, prevent action
    if (isLiked || isDisliked) return;

    try {
      const response = await createDislike({
        reviewId: review._id,
        userId: currentUser?.userId,
      }).unwrap();

      if (response.success) {
        // Update UI
        setDislikes((prev) => prev + 1);
        setUserAction("dislike");
        setIsDisliked(true);

        // Store interaction in localStorage
        updateLocalStorage(review._id, "dislike");

        toast.success("Review disliked");
      }
    } catch (error) {
      console.error("Error handling dislike:", error);
      toast.error("Failed to update dislike");
    }
  };

  const handleReportSubmit = async (description: string, file: File | null) => {
    try {
      const formData = new FormData();
      formData.append("reporterId", currentUser.userId);
      formData.append("reportDetails", description);
      formData.append("reviewId", review._id);
      if (file) {
        formData.append("document", file);
      }

      const response = await createReviewReport(formData).unwrap();
      if (response?.success) {
        toast.success("Report submitted successfully");
        setIsReportModalOpen(false);
      } else {
        toast.error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2">
      <div className="border-b pb-4 sm:pb-6 my-4 sm:my-8">
        {/* Rating and Report Header */}
        <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  star <= review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm sm:text-base text-[#1D1F2C]">({review.rating})</span>

          {/* Show report button only if user is logged in and viewing their own profile's review */}
          {currentUser?.userId && review.reciverId === currentUser.userId && (
            <div className="text-gray-500 ml-2 sm:ml-10 flex items-center gap-2">
              <button
                onClick={() => setIsReportModalOpen(true)}
                disabled={review?.report}
                className={`text-[#1D1F2C] hover:text-gray-600 flex items-center gap-1 sm:gap-2 ${
                  review?.report 
                    ? "text-red-500 cursor-not-allowed opacity-50" 
                    : "cursor-pointer"
                }`}
              >
                <FlagIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-sm sm:text-base">{review.report ? "Reported" : "Report"}</p>
              </button>
            </div>
          )}
        </div>

        {/* Review Text */}
        <div className="mb-3 sm:mb-5">
          <p className="text-[#4A4C56] text-base sm:text-lg font-normal mb-1">
            {review.review}
          </p>
          <span className="text-sm sm:text-base text-[#A5A5AB]">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Reviewer Info */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 relative overflow-hidden flex items-center justify-center">
            {review?.reviewerId?.profileImage ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${review.reviewerId.profileImage}`}
                alt={review.reviewerId?.personalInfo?.display_name || "User"}
                fill
                className="object-cover"
                onError={(e: any) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <span class="text-base sm:text-lg font-medium text-gray-500">
                        ${
                          review.reviewerId?.first_name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"
                        }
                      </span>
                    `;
                  }
                }}
              />
            ) : (
              <span className="text-base sm:text-lg font-medium text-gray-500">
                {review.reviewerId?.first_name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-semibold text-[#1D1F2C]">
              {review.reviewerId?.first_name || "Anonymous"}
            </span>
          </div>
        </div>

        {/* Like/Dislike Section */}
        <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
          <button
            onClick={handleLike}
            disabled={isLiked || isDisliked}
            className={`flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer ${
              isLiked
                ? "text-[#20B894] cursor-not-allowed"
                : isDisliked
                ? "text-[#777980] cursor-not-allowed opacity-50"
                : "text-[#777980] hover:text-[#20B894]"
            }`}
            title={
              isLiked
                ? "You already liked this review"
                : isDisliked
                ? "You already disliked this review"
                : "Like this review"
            }
          >
            <span className="text-xs sm:text-sm">{likes}</span>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              viewBox="0 0 24 24"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
              />
            </svg>
          </button>
          <button
            onClick={handleDislike}
            disabled={isLiked || isDisliked}
            className={`flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer ${
              isDisliked
                ? "text-red-500 cursor-not-allowed"
                : isLiked
                ? "text-[#777980] cursor-not-allowed opacity-50"
                : "text-[#777980] hover:text-red-500"
            }`}
            title={
              isDisliked
                ? "You already disliked this review"
                : isLiked
                ? "You already liked this review"
                : "Dislike this review"
            }
          >
            {dislikes > 0 && <span className="text-xs sm:text-sm">{dislikes}</span>}
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 rotate-180"
              viewBox="0 0 24 24"
              fill={isDisliked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Report Modal remains unchanged */}
      {currentUser?.userId && review.reciverId === currentUser.userId && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
};

export default ReviewList;
