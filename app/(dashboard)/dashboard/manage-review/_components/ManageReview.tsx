"use client";

import React, { useEffect } from "react";
import { ReviewTable } from "./ReviewTable";
import { useReviews } from "../_hooks/useReviews";
import {
  useGetAllReviewReportQuery,
  useActionReviewReportMutation,
} from "@/src/redux/features/shared/reportApi";
import { toast } from "sonner";

export function ManageReview() {
  const { reviews, updateReviewStatus, deleteReview, setReviews } =
    useReviews();

  const { data: getAllReviewReport, refetch } =
    useGetAllReviewReportQuery(undefined);
  // console.log("all review", getAllReviewReport);

  const [actionReviewReport] = useActionReviewReportMutation();

  const handleApprove = async (id: string) => {
    try {
      const result = await actionReviewReport({
        id,
        status: "accept",
      }).unwrap();
      refetch();
      toast.success(result?.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const result = await actionReviewReport({
        id,
        status: "reject",
      }).unwrap();
      refetch();
      toast.success(result?.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (getAllReviewReport?.data) {
      const formattedReviews = getAllReviewReport?.data?.map((report: any) => {
        return {
          id: report?._id,
          reviewer: {
            name: report?.reviewId?.reciverId?.first_name,
            email: report?.reviewId?.reciverId?.email,
            avatar: report?.reviewId?.reciverId?.profileImage || "",
          },
          flaggedBy: {
            name: report?.reviewId?.reviewerId?.first_name,
            avatar: report?.reviewId?.reviewerId?.profileImage || "",
          },
          reviewText: report?.reviewId?.review,
          document: report?.document,
          rating: report?.reviewId?.rating,
          status: report?.status,
          createdAt: report?.reviewId?.createdAt,
          reportDetails: report?.reportDetails,
          reportDocument: report?.supportingFile,
          personalInfo: report?.reporterId?.personalInfo,
        };
      });

      setReviews(formattedReviews);
    }
  }, [getAllReviewReport?.data, setReviews]);

  // console.log(51, reviews);

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <ReviewTable
        reviews={reviews}
        onStatusChange={updateReviewStatus}
        onDelete={deleteReview}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
