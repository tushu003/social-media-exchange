"use client";

import React from "react";
import { ReviewRow } from "./ReviewRow";
import { Review, ReviewStatus } from "../_types";

interface ReviewTableProps {
  reviews: Review[];
  onStatusChange: (id: string, status: ReviewStatus) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ReviewTable({
  reviews,
  onStatusChange,
  onDelete,
  onApprove,
  onReject,
}: ReviewTableProps) {
  return (
    <div className="w-full -mx-3 sm:mx-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left text-xs sm:text-sm text-gray-500 border-b">
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-medium whitespace-nowrap">
                Reviewer
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-medium whitespace-nowrap">
                Flagged By
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-medium whitespace-nowrap">
                Review
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-medium whitespace-nowrap">
                Status
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-medium whitespace-nowrap">
                Action
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-medium whitespace-nowrap">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <ReviewRow
                key={review.id}
                review={review}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
