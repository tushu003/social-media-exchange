"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ReviewList from "./_components/review-list";
import ProfileHeader from "./_components/profile-header";
import About from "./_components/about";
import RatingOverview from "./_components/rating-overview";
import ReviewModal from "./_components/review-modal";
import {
  useGetCurrentUserQuery,
  useGetSingleUserQuery,
} from "@/src/redux/features/users/userApi";
import { Pagination } from "@/components/reusable/pagination";
import FlagIcon from "@/public/icons/flag-icon";
import {
  useCreateReviewMutation,
  useGetSingleReviewQuery,
} from "@/src/redux/features/shared/reviewApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { toast } from "sonner";
import ReportProfileModal from "./_components/report-profile-modal";
import {
  useCreateProfileReportMutation,
  useGetAllProfileReportQuery,
} from "@/src/redux/features/shared/reportApi";
import MessageRequestModal from "./_components/message-request-modal";
import { useCreateExchangeMutation } from "@/src/redux/features/admin/exchangeApi";
import { differenceInDays } from "date-fns";
import VerifiedIcons from "@/public/icons/verified-icons";

const ServiceDetails = () => {
  const params = useParams();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportProfileModalOpen, setIsReportProfileModalOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const currentUser = verifiedUser();
  const itemsPerPage = 10;

  const { data: instructor, isLoading } = useGetSingleUserQuery(
    params.id as string
  );
  const singleUserData = instructor?.data;

  const { data: currentUserData } = useGetCurrentUserQuery(currentUser?.userId);
  const currentUsreInfo = currentUserData?.data;
  const singleUser = instructor?.data;
  const { data: getSingleReview } = useGetSingleReviewQuery(params?.id);
  const singleReview = getSingleReview?.data;

  const [createProfileReport] = useCreateProfileReportMutation();

  const [createReview] = useCreateReviewMutation();

  const [createExchange] = useCreateExchangeMutation();
  const { data: allProfileReport, refetch } = useGetAllProfileReportQuery({});
  console.log("all profile report", allProfileReport);

  const filteredProfileReport = allProfileReport?.data?.filter(
    (report) => report?.reporterId?._id === currentUser?.userId
  );

  // Pagination logic
  const reviews = getSingleReview?.data || [];
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);
  const indexOfLastReview = currentPage * itemsPerPage;
  const indexOfFirstReview = indexOfLastReview - itemsPerPage;
  const currentReviews = sortedReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  useEffect(() => {
    refetch();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: document.getElementById("reviews-section")?.offsetTop,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!singleUser) {
    return <div>User not found</div>;
  }

  // Modify the location formatting in formattedInstructor
  const formattedInstructor = {
    id: singleUser._id,
    name: singleUser?.first_name,
    first_name: singleUser.personalInfo?.first_name,
    last_name: singleUser.personalInfo?.last_name,
    email: singleUser?.email,
    profileImage: singleUser?.profileImage || "/default-avatar.jpg",
    rating: singleUser?.rating || 0,
    skills: singleUser?.extra_skills || [],
    experience: "5+ years",
    totalReview: singleUser?.review || 0,
    customerSatisfaction: 95,
    isVerified: true,
    portfolioImage: singleUser?.portfolio || "/default-portfolio.jpg",
    about: singleUser?.about_me,
    location:
      singleUser?.addressInfo?.city && singleUser?.addressInfo?.country
        ? `${singleUser.addressInfo.city}, ${singleUser.addressInfo.country}`
        : "",
    // languages: ["English", "Bengali"], // Add default languages
  };

  const handleReviewSubmit = async (rating: number, review: string) => {
    // Handle the review submission here
    const reviewCreate = {
      reviewerId: currentUser?.userId,
      reciverId: singleUser._id,
      rating: rating,
      review: review,
    };
    try {
      const response = await createReview(reviewCreate).unwrap();
      toast.success("Review submitted successfully");
    } catch (err) {
      toast.error("Something went wrong");
    }

    // Call your API to submit the review
  };
  const handleProfileReport = async (reason: string, file: File | null) => {
    try {
      const formData = new FormData();
      formData.append("reporterId", currentUser?.userId);
      formData.append("reportedId", singleUser?._id);
      formData.append("reportType", reason);
      if (file) {
        formData.append("supportingFile", file);
      }

      const response = await createProfileReport(formData).unwrap();
      // console.log("response", response);

      if (response?.success) {
        toast.success("Report submitted successfully");
        setIsReportProfileModalOpen(false);
        refetch();
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    }
  };

  const handleMessageRequest = async (selectedService: string) => {
    try {
      const exchangeData = [
        {
          senderUserId: currentUser?.userId,
          senderImage: currentUsreInfo?.profileImage,
          reciverUserId: singleUser?._id,
          reciverImage: singleUser?.profileImage,
          email: currentUser?.email,
          selectedEmail: singleUser?.email,
          senderService: selectedService,
          my_service: currentUsreInfo?.my_service,
        },
      ];

      const response = await createExchange(exchangeData).unwrap();

      if (response?.success) {
        toast.success("Message request sent successfully");
        setIsMessageModalOpen(false);
      }
    } catch (error) {
      console.error("Error sending message request:", error);
      toast.error("Failed to send message request");
    }
  };

  const isProfileReported = () => {
    return filteredProfileReport?.some(
      (report) =>
        report.reporterId._id === currentUser?.userId &&
        report.reportedId._id === params?.id
    );
  };

  // Calculate years of experience
  const daysSinceCreation = singleUserData?.createdAt
    ? differenceInDays(new Date(), new Date(singleUserData.createdAt))
    : 0;

  // Calculate years and remaining days
  const yearsOfExperience = Math.floor(daysSinceCreation / 365);
  const remainingDays = daysSinceCreation % 365;

  // Format the experience label
  const getExperienceLabel = () => {
    if (yearsOfExperience >= 1) {
      return `${yearsOfExperience} Year${
        yearsOfExperience > 1 ? "s" : ""
      } Experience`;
    }
    return `${remainingDays} Day${remainingDays !== 1 ? "s" : ""} Experience`;
  };

  const averageRating = singleUserData?.rating || 0;

  // Calculate quality service badge eligibility
  const hasQualityService = () => {
    if (!singleReview || singleReview?.length < 10) return false;
    const highRatingReviews = singleReview?.filter(
      (review) => review?.rating >= 4.5
    );
    return highRatingReviews?.length >= 10;
  };

  const badges = [
    yearsOfExperience >= 1 && {
      label: getExperienceLabel(),
      icon: "/badges/icon.png",
      progress: Math.min(Math.round((daysSinceCreation / 365) * 100), 100),
      show: true,
    },
    hasQualityService() && {
      label: "Quality Service Ensured",
      icon: "/badges/icon (2).png",
      progress: 100,
      show: true,
    },
    singleUserData?.cartificate && {
      label: "Verified Trainer",
      icon: <VerifiedIcons className="text-[#20B894]" />,
      progress: 100,
      show: true,
    },
  ].filter(Boolean);

  // Remove the filteredBadges mapping since we're handling it directly in the badges array
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-10">
    {badges
      .filter((badge) => badge.show)
      .map((badge, i) => (
        <div
          key={i}
          className="relative border rounded-xl px-3 py-4 flex flex-col items-center text-center shadow-sm bg-white"
        >
          <div className="relative w-20 h-20 mb-3">
            <div className="absolute inset-0 flex items-center justify-center">
              {typeof badge.icon === "string" ? (
                <Image
                  src={badge.icon}
                  alt={badge.label}
                  width={50}
                  height={50}
                  className="object-contain"
                />
              ) : (
                badge.icon
              )}
            </div>
          </div>

          <p className="text-sm text-[#4A4C56] mb-2">{badge.label}</p>
        </div>
      ))}
  </div>;

  return (
    <div className="container mx-auto md:px-2 py-8 overflow-hidden px-4">
      <button
        onClick={() => router.back()}
        className="mb-4 sm:mb-6 text-white bg-[#20B894] px-4 py-2 my-2 rounded-full hover:bg-[#62c5ac] cursor-pointer ease-in duration-200 font-semibold hover:text-gray-900 flex items-center gap-2 text-sm sm:text-base"
      >
        ← Back
      </button>

      <div className="w-full flex gap-6">
        <div className="md:flex justify-center w-full md:gap-10">
          <div className="w-full md:w-[70%]  justify-center gap-6">
            <div className="bg-white rounded-xl shadow-sm md:px-4">
              <ProfileHeader formattedInstructor={formattedInstructor} />

              {/* About Me Section */}
              <About
                instructor={formattedInstructor}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
              />

              {/* Rating Overview Section */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-10">
                {badges.map((badge, i) => (
                  <div
                    key={i}
                    className="relative border rounded-xl px-3 py-4 flex flex-col items-center text-center shadow-sm bg-white"
                  >
                    
                    <div className="relative w-20 h-20 mb-3">
                     
                      <div className="absolute inset-0 flex items-center justify-center">
                        {typeof badge.icon === "string" ? (
                          <Image
                            src={badge.icon}
                            alt={badge.label}
                            width={50}
                            height={50}
                            className="object-contain"
                          />
                        ) : (
                          badge.icon
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-[#4A4C56] mb-2">{badge.label}</p>

                   
                  </div>
                ))}
              </div>

              {/* Skills Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-medium text-[#070707] mb-4">
                  Services
                </h2>
                <div className="flex flex-wrap gap-2">
                  {singleUser?.my_service?.map((service, index) => (
                    <span
                      key={index}
                      className="bg-[#F9F9F9] border border-[#777980] text-[#777980] px-4 py-2 rounded-full text-sm md:text-base"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Portfolio Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#070707] mb-4">
                  Portfolio
                </h2>
                <div className="relative h-[200px] md:h-[410px] rounded-xl overflow-hidden bg-gray-100">
                  {formattedInstructor?.portfolioImage &&
                  formattedInstructor.portfolioImage !==
                    "/default-portfolio.jpg" ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${formattedInstructor.portfolioImage}`}
                      alt="Portfolio"
                      fill
                      className="object-cover"
                      onError={(e: any) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            <span class="text-4xl font-medium text-gray-400">
                              Portfolio
                            </span>
                          </div>
                        `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-medium text-gray-400">
                        Portfolio
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* added review section */}
              <div className="mb-8">
                <div className="flex items-start mb-6 px-4 sm:px-0">
                  <h2 className="text-xl sm:text-2xl font-medium text-[#070707]">
                    Reviews
                  </h2>
                </div>

                {/* Rating Overview */}
                <RatingOverview
                  formattedInstructor={formattedInstructor}
                  setIsReviewModalOpen={setIsReviewModalOpen}
                  currentUserId={currentUser?.userId}
                  instructorId={singleUser?._id}
                  reviews={reviews}
                />

                {/* Review Tabs */}
                <div className="border-b mb-6">
                  <h2 className="text-2xl font-medium text-[#070707] my-5">
                    Review Lists
                  </h2>
                  <div className="flex gap-6">
                    <button
                      // onClick={() => setActiveTab("all")}
                      className={`pb-2 text-sm"text-[#20B894] border-b-2 border-[#20B894] font-normal text-xl"
                        `}
                    >
                      All reviews
                    </button>
                  </div>
                </div>

                {/* Review List */}
                <div id="reviews-section">
                  {reviews.length > 0 ? (
                    <>
                      <div>
                        {currentReviews?.map((singleReview: any) => (
                          <ReviewList
                            key={singleReview?._id}
                            review={singleReview}
                            instructor={formattedInstructor}
                          />
                        ))}
                      </div>
                      {totalPages > 1 && (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      )}
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No reviews yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* added user profile */}
          <div className="w-full md:w-[30%] my-10 md:my-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full relative overflow-hidden mb-3 bg-gray-100">
                  {formattedInstructor?.profileImage &&
                  formattedInstructor.profileImage !== "/default-avatar.jpg" ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${formattedInstructor.profileImage}`}
                      alt={formattedInstructor.first_name || "User"}
                      fill
                      className="object-cover"
                      onError={(e: any) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            <span class="text-2xl font-medium text-gray-400">
                              ${
                                formattedInstructor?.first_name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "U"
                              }
                            </span>
                          </div>
                        `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl font-medium text-gray-400">
                        {formattedInstructor?.name?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-[#070707]">
                  {formattedInstructor.name}
                </h3>
                <p className="text-gray-500 text-sm">Online</p>
                {/* <p className="text-xs text-gray-500 mt-1">
                  10:05 PM local time
                </p> */}
              </div>

              <div className="mt-6 space-y-3">
                {singleUserData?._id !== currentUser?.userId && (
                  <>
                    <button
                      onClick={() => setIsMessageModalOpen(true)}
                      className="w-full py-2.5 bg-[#20B894] text-white rounded-lg text-sm md:text-base font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Exchange Service{" "}
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14m-7-7l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setIsReportProfileModalOpen(true)}
                      disabled={isProfileReported()}
                      className={`w-full py-2.5 border rounded-lg text-sm md:text-base font-medium transition-colors flex items-center justify-center gap-2 ${
                        isProfileReported()
                          ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-50"
                          : "text-[#FE5050] border-[#FE5050] hover:bg-red-50 cursor-pointer"
                      }`}
                    >
                      {isProfileReported()
                        ? "Reported Profile"
                        : "Report Profile"}
                      <FlagIcon className="w-4 h-4 stroke-current" />
                    </button>
                  </>
                )}

                {/* Add the modal component */}
                <ReportProfileModal
                  isOpen={isReportProfileModalOpen}
                  onClose={() => setIsReportProfileModalOpen(false)}
                  onSubmit={handleProfileReport}
                  isLoading={isLoading}
                />

                <MessageRequestModal
                  isOpen={isMessageModalOpen}
                  onClose={() => setIsMessageModalOpen(false)}
                  onSubmit={handleMessageRequest}
                  instructor={formattedInstructor}
                  singleUser={singleUser}
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default ServiceDetails;
