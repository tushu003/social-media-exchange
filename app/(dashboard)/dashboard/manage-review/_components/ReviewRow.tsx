"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Review, ReviewStatus } from "../_types";
import { ReviewDetailsModal } from "./ReviewDetailsModal";
import { ReviewActionModal } from "./ReviewActionModal";
import Image from "next/image";
import { useActionReviewReportMutation } from "@/src/redux/features/shared/reportApi";
import { ApproveIcon } from "@/public/icons/approve-icon";
import { CircleCheck, CircleX } from "lucide-react";

interface ReviewRowProps {
  review: Review;
  onStatusChange: (id: string, status: ReviewStatus) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ReviewRow({ review, onApprove, onReject }: ReviewRowProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionReviewReport] = useActionReviewReportMutation();

  return (
    <>
      <tr className="border-b hover:bg-gray-50">
        <td className="py-4 sm:py-5 px-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {review?.reviewer?.avatar ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${review?.reviewer?.avatar}`}
                  alt={review?.reviewer?.name || "User"}
                  className="w-full h-full object-cover"
                  height={100}
                  width={100}
                />
              ) : (
                <span className="text-sm sm:text-base font-medium text-gray-600">
                  {review?.reviewer?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <span className="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-[180px]">
              {review?.reviewer?.name}
            </span>
          </div>
        </td>

        <td className="py-4 sm:py-5 px-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {review?.flaggedBy?.avatar ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${review?.flaggedBy?.avatar}`}
                  alt={review?.flaggedBy?.name || "User"}
                  className="w-full h-full object-cover"
                  height={100}
                  width={100}
                />
              ) : (
                <span className="text-sm sm:text-base font-medium text-gray-600">
                  {review?.flaggedBy?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <span className="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-[180px]">
              {review?.flaggedBy?.name}
            </span>
          </div>
        </td>

        <td className="py-4 sm:py-5 px-4 sm:px-6 text-sm sm:text-base max-w-[180px] sm:max-w-[250px] cursor-pointer hover:text-gray-600">
          <div className="truncate" onClick={() => setIsReviewModalOpen(true)}>
            {review?.reportDetails}
          </div>
        </td>

        <td className="py-4 sm:py-5 px-4 sm:px-6">
          <span
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium uppercase ${review?.status === "accept"
              ? "bg-green-100 text-green-700"
              : review?.status === "reject"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {review?.status === "accept"
              ? "Accepted"
              : review?.status === "reject"
                ? "Rejected"
                : "Pending"}
          </span>
        </td>

        <td className="py-4 sm:py-5 px-4 sm:px-6">
          <div className="flex gap-2 sm:gap-3">
            {/* Action buttons with responsive sizing */}
            {review?.status === "accept" && (
              <button
                className="h-6 w-6 sm:h-12 sm:w-12 text-red-500"
                onClick={() => onReject(review.id)}
              >
                <span className="sr-only">Reject</span>
                <CircleX className="w-6 h-6 cursor-pointer" />
              </button>
            )}

            {review?.status === "reject" && (
              <button
                className="h-6 w-6 sm:h-8 sm:w-8 text-green-500"
                onClick={() => onApprove(review.id)}
              >
                <span className="sr-only">Approve</span>
                <CircleCheck className="w-6 h-6 cursor-pointer" />
              </button>
            )}

            {review?.status !== "accept" && review?.status !== "reject" && (
              <>
                {/* TODO: Add approve button */}
                <button
                  className="h-10 w-10 sm:h-12 sm:w-12 text-green-500"
                  onClick={() => onApprove(review.id)}
                >
                  <span className="sr-only">Approve</span>
                  {/* <ApproveIcon /> */}
                  <CircleCheck className="w-6 h-6 cursor-pointer" />
                </button>
                {/* TODO: Add reject button */}
                <button
                  className="h-10 w-10 sm:h-12 sm:w-12 text-red-500"
                  onClick={() => onReject(review.id)}
                >
                  <span className="sr-only">Reject</span>
                  <CircleX className="w-6 h-6 cursor-pointer" />
                </button>
              </>
            )}
          </div>
        </td>
        <td className="py-4 sm:py-5 px-4 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500 p-0 text-sm sm:text-base hover:bg-transparent font-medium cursor-pointer"
            onClick={() => setIsActionModalOpen(true)}
          >
            View details
          </Button>
        </td>
      </tr>

      {/* Existing modals */}
      <ReviewDetailsModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        review={review}
      />
      <ReviewActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        review={review}
      />
    </>
  );
}
