import { Star } from 'lucide-react'
import React, { useMemo } from 'react'
import { verifiedUser } from "@/src/utils/token-varify";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authApi } from '@/src/redux/features/auth/authApi';

interface RatingOverviewProps {
  formattedInstructor: {
    rating: number;
    totalReview: number;
  };
  setIsReviewModalOpen: (isOpen: boolean) => void;
  currentUserId?: string;
  instructorId?: string;
  reviews?: any[];
}

export default function RatingOverview({ 
  formattedInstructor, 
  setIsReviewModalOpen,
  currentUserId,
  instructorId,
  reviews 
}: RatingOverviewProps) {
  const router = useRouter();
  const currentUser = verifiedUser();

  const { data: userList } = authApi.useGetAllExchangeDataQuery({
    userId: currentUserId,
    isAccepted: true,
  });
  // console.log("userList", userList);
  // Check if users have exchanged services and both accepted
  const canWriteReview = useMemo(() => {
    if (!userList?.data || !currentUserId || !instructorId) return false;

    return userList.data.some(exchange => {
      // Check if the current user and instructor are involved in this exchange
      const isValidExchange = (
        (exchange.senderUserId?._id === currentUserId && exchange.reciverUserId?._id === instructorId) ||
        (exchange.senderUserId?._id === instructorId && exchange.reciverUserId?._id === currentUserId)
      );

      // Check if both users have accepted the exchange
      const bothAccepted = exchange.senderUserAccepted && exchange.reciverUserAccepted;

      return isValidExchange && bothAccepted;
    });
  }, [userList?.data, currentUserId, instructorId]);

  const handleWriteReview = () => {
    if (!currentUser) {
      toast.error("Please login to write a review");
      router.push("/auth/login");
      return;
    }

    // Check if user has already reviewed
    const hasReviewed = reviews?.some(
      (review) => review.reviewerId?._id === currentUserId
    );

    if (hasReviewed) {
      toast.error("You have already reviewed this instructor");
      return;
    }

    // Check if reviewing self
    if (currentUserId === instructorId) {
      toast.error("You cannot review yourself");
      return;
    }

    // Check if service exchange is completed
    if (!canWriteReview) {
      toast.error("You can only review after completing a service exchange");
      return;
    }

    setIsReviewModalOpen(true);
  };

  return (
    <div>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-6 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between gap-8">
          <div className="text-center bg-[#F9F9F9] px-8 py-6 rounded-xl">
            <div className="text-5xl font-bold text-[#070707] mb-2">
              {formattedInstructor.rating}
            </div>
            <div className="flex items-center gap-1.5 justify-center my-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= formattedInstructor.rating 
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-gray-200 text-gray-200'
                  } transition-colors duration-200`}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-[#777980]">
              Based on {formattedInstructor.totalReview} reviews
            </p>
          </div>

          <div className="flex-1 flex items-center justify-end">
            {canWriteReview && (
              <button
                onClick={handleWriteReview}
                className="px-8 py-4 bg-[#20B894] text-white rounded-xl text-sm font-medium 
                  hover:bg-[#1a9678] active:scale-[0.98] transition-all duration-200 
                  flex items-center gap-3 shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>Write Review</span>
                <Star className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
