"use client";

import { useState } from "react";
import { Review, ReviewStatus } from "../_types";

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState<string>("Most Recent");

  const updateReviewStatus = (id: string, status: ReviewStatus) => {
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, status } : review
      )
    );
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "Oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "Highest Rating":
        return b.rating - a.rating;
      case "Lowest Rating":
        return a.rating - b.rating;
      case "Most Recent":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  return {
    reviews: sortedReviews,
    updateReviewStatus,
    deleteReview,
    sortBy,
    setSortBy,
    setReviews,
  };
}
