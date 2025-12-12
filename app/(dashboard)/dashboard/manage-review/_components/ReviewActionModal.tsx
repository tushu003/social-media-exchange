import { X } from "lucide-react";
import { Review } from "../_types";
import Image from "next/image";

interface ReviewActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
}

export function ReviewActionModal({
  isOpen,
  onClose,
  review,
}: ReviewActionModalProps) {
  console.log("review", review);

  if (!isOpen || !review) return null;
  const reviewWithDocument = {
    ...review,
    document: review.document || review.reportDocument,
  };
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-[450px] max-h-screen relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 pb-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-gray-600">Reviewed By:</div>
              <div className="font-medium">
                {reviewWithDocument?.reviewer?.name}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-600">Flagged By:</div>
              <div className="font-medium">
                {reviewWithDocument?.flaggedBy?.name}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-600">Date:</div>
              <div className="font-medium">
                {reviewWithDocument?.createdAt
                  ? new Date(reviewWithDocument.createdAt).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )
                  : "Date not available"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-b-lg mt-2 max-h-[70vh] overflow-y-auto">
          <div className="px-6 pt-4 pb-2">
            <h3 className="font-semibold mb-2 text-gray-800 border-b pb-1">
              Review Document
            </h3>
            <div className="flex justify-center items-center bg-gray-100 rounded-lg p-3 min-h-[120px]">
              {reviewWithDocument.document ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${reviewWithDocument.document}`}
                  alt="Document"
                  width={320}
                  height={400}
                  className="rounded shadow max-h-[300px] object-contain bg-white"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/no-image.png";
                  }}
                />
              ) : (
                <span className="text-gray-400 text-sm">
                  No document uploaded
                </span>
              )}
            </div>
          </div>
          <h3 className="font-semibold mb-2">Review</h3>
          <div className="mb-4">
            <div className="text-gray-600 mb-1">Review:</div>
            <div className="font-medium whitespace-pre-line text-gray-900 text-[15px] leading-relaxed">
              {reviewWithDocument?.reviewText}
            </div>
          </div>
          <div className="mb-4">
            <div className="text-gray-600 mb-1">Report Details:</div>
            <div className="font-medium whitespace-pre-line text-gray-900 text-[15px] leading-relaxed">
              {reviewWithDocument?.reportDetails}
            </div>
          </div>
          <div className="text-gray-400 text-xs mt-4 text-right">
            {reviewWithDocument?.createdAt
              ? new Date(reviewWithDocument.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "Date not available"}
          </div>
        </div>
      </div>
    </div>
  );
}
