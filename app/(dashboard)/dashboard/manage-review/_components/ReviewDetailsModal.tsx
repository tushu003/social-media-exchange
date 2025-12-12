import { X, Star } from "lucide-react";
import { Review } from "../_types";
import Image from "next/image";

interface ReviewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
}

export function ReviewDetailsModal({
  isOpen,
  onClose,
  review,
}: ReviewDetailsModalProps) {
  if (!isOpen || !review) return null;
  // console.log("review details modal", review);
  

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-[500px] max-h-[80vh] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center pt-8 pb-6 border-b">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-3">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${review?.reviewer?.avatar}`}
              alt={review?.reviewer?.name}
              className="w-full h-full object-cover"
              height={100}
              width={100}
            />
          </div>
          <h2 className="text-xl font-semibold mb-1">{review?.reviewer?.name}</h2>
          <p className="text-gray-500 text-sm mb-4">
            {review?.reviewer?.email || "chris_glasser@gmail.com"}
          </p>

          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="px-8  py-8 overflow-y-auto">
          <h3 className="font-semibold mb-3">Report Details</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {review?.reportDetails}
          </p>

         

          <div className="mt-4 text-gray-400 text-sm">
            {review?.createdAt ? new Date(review.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }) : 'Date not available'}
          </div>
        </div>
      </div>
    </div>
  );
}
