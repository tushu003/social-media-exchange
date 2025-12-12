"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useGetSingleReviewQuery } from "@/src/redux/features/shared/reviewApi";
import { verifiedUser } from "@/src/utils/token-varify";
import ReportModal from "./_components/report-modal";
import { toast } from "sonner";
import { useCreateReviewReportMutation } from "@/src/redux/features/shared/reportApi";
import { StatCard } from "./_components/stat-card";
import { StarRating } from "./_components/star-rating";
import { Pagination } from "@/components/reusable/pagination";
import FlagIcon from "@/public/icons/flag-icon";
import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";

export default function AdminReviewsPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [createReviewReport] = useCreateReviewReportMutation();

  const currentUser = verifiedUser();
  const { data: singleUser, refetch: refetchSingleUser } = useGetSingleUserQuery(currentUser?.userId);
  const singleUserData = singleUser?.data;
  useEffect(() => {
    refetchSingleUser();
  }, []);
  // console.log("singleUserData", singleUserData);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: getSingleReview, refetch: refetchGetSingleReview } = useGetSingleReviewQuery(
    currentUser?.userId
  );
  useEffect(() => {
    refetchGetSingleReview();
  }, []);

  const singleUserAllReview = getSingleReview?.data;
  // console.log("singleUserAllReview", singleUserAllReview);

  // Calculate pagination
  const filteredReviews = useMemo(() => {
    return singleUserAllReview || [];
  }, [singleUserAllReview]);
  const review = filteredReviews?.length;
  // console.log("filteredReviews", review);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Update the handleReportSubmit function
  const handleReportSubmit = async (description: string, file: File | null) => {
    try {
      const formData = new FormData();
      formData.append("reporterId", currentUser.userId);
      formData.append("receiverId", selectedReview?.reviewerId?._id);
      formData.append("reviewId", selectedReview._id);
      formData.append("reportDetails", description);
      if (file) {
        formData.append("document", file);
      }

      const response = await createReviewReport(formData).unwrap();

      if (response?.success) {
        toast.success("Report submitted successfully");
        setIsReportModalOpen(false);
        setSelectedReview(null);
        refetchGetSingleReview();
      } else {
        toast.error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    }
  };

  return (
    <div className="bg-white text-[#1D1F2C] min-h-screen p-4 sm:p-6 md:p-10 space-y-4 sm:space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="col-span-1 sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            title="Total Reviews"
            value={review || 0}
            valueClass="text-[#20B894]"
            subtitle="Growth in reviews on this year"
          />
          <StatCard
            title="Average Rating"
            value={singleUserData?.rating || 0}
            subtitle="Average Rating on this year"
            stars
          />
          <StatCard
            title="Customer Satisfaction"
            value="90%"
            valueClass="text-[#20B894]"
            subtitle="Average Rating on this year"
          />
        </div>
      </div>
      {/* Sort + Header */}
      <div className="flex items-center justify-between mt-4 sm:mt-8 border-b pb-2 sm:pb-3">
        <h2 className="text-sm sm:text-base font-semibold">All reviews</h2>
      </div>

      {/* Reviews */}
      <div className="space-y-4 sm:space-y-6">
        {paginatedReviews.map((review) => (
          <div key={review._id} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg sm:rounded-xl">
            {review?.reviewerId?.profileImage ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${review?.reviewerId?.profileImage}`}
                alt={review?.reviewerId?.first_name || "User"}
                width={40}
                height={40}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#20B894] text-white flex items-center justify-center text-base sm:text-lg font-semibold">
                {review?.reviewerId?.first_name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <h4 className="font-medium text-sm sm:text-base truncate">
                  {review?.reviewerId?.first_name}
                </h4>
                <span className="text-[10px] sm:text-xs text-gray-400">
                  {new Date(review?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-xs sm:text-sm mt-1 text-[#4A4C56] line-clamp-3">{review?.review}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs sm:text-sm">
                <StarRating rating={review?.rating} />
                <span className="text-gray-500">({review?.rating})</span>
                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setIsReportModalOpen(true);
                  }}
                  disabled={review?.report}
                  className={`text-[#1D1F2C] hover:text-gray-600 ml-0 sm:ml-10 flex items-center gap-1 sm:gap-2 ${
                    review?.report 
                      ? "text-red-500 opacity-50 cursor-not-allowed" 
                      : "cursor-pointer"
                  }`}
                >
                  <FlagIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">
                    {review?.report ? "Reported" : "Report"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-8 sm:py-10">
            <p className="text-gray-500 text-sm sm:text-base">No reviews found</p>
          </div>
        )}
      </div>

      {/* ReportModal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedReview(null);
        }}
        onSubmit={handleReportSubmit}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 sm:mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
