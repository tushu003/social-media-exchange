import React, { useState, useEffect } from "react";
import { Star, X } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
}

const ReviewModal = ({ isOpen, onClose, onSubmit }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    onSubmit(rating, review);
    setRating(0);
    setReview("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-2xl p-6 w-[400px] max-w-[95%] relative mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-medium text-gray-900 mb-4 cursor-pointer">
          Write Review
        </h2>

        <div className="mb-6">
          <p className="text-gray-700 text-sm mb-3">
            How satisfied are you with the service?
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-colors"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= (hoveredStar || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 text-sm mb-2">
            Write your feedback (optional)
          </p>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Type your Review here"
            className="w-full h-[120px] p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center cursor-pointer"
        >
          Submit
          <svg
            className="w-4 h-4 ml-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14m-7-7l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
