"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useGetAllUserBaseOnSubCategoryQuery } from "@/src/redux/features/shared/categoryAPi";
import { useGetAllCategoriesQuery } from "@/src/redux/features/categories/categoriesApi";
import {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
} from "@/src/redux/features/users/userApi";
import CategoryCard from "./service-categories/CategoryCard";
import UserList from "./service-categories/UserList";
import SkillExchange from "./service-categories/SkillExchange";
import SuccessMessage from "./service-categories/SuccessMessage";
import { useCreateExchangeMutation } from "@/src/redux/features/shared/exchangeApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { useGetCurrentUserQuery } from "@/src/redux/features/users/userApi";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ServiceExchangeFlowProps {
  activeCategory?: string;
  showAllCategories?: boolean;
}

export default function ServiceExchangeFlow({
  activeCategory = "All",
  showAllCategories = false,
}: ServiceExchangeFlowProps) {
  const [modalStep, setModalStep] = useState<
    "none" | "exchange" | "users" | "success"
  >("none");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("Web Development");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedService, setSelectedService] = useState<any>({
    subCategory: "",
    categoryImage: "",
    _id: "",
    my_service: [],
  });

  const router = useRouter();

  const { data: getAllCategories } = useGetAllCategoriesQuery({});
  const allCategories = getAllCategories?.data || [];

  // Create subcategories array with parent category info
  const allSubCategories = allCategories.flatMap((category) =>
    category.subCategories.map((sub) => ({
      ...sub,
      parentCategory: category.category_name,
    }))
  );

  // Filter subcategories based on activeCategory
  const filteredSubCategories =
    activeCategory === "All"
      ? allSubCategories
      : allSubCategories.filter((sub) => sub.parentCategory === activeCategory);

  // Apply category limit based on showAllCategories prop
  const displayedCategories = showAllCategories
    ? filteredSubCategories
    : filteredSubCategories.slice(0, 8);

  const { data: getAllUserBaseOnSubCategory, isLoading: isLoadingUsers } =
    useGetAllUserBaseOnSubCategoryQuery(selectedService.subCategory, {
      skip: !selectedService.subCategory,
    });

  const allUsers = getAllUserBaseOnSubCategory?.data || [];
  console.log("all users", allUsers);

  const [createExchange] = useCreateExchangeMutation();

  const currentUser = verifiedUser();
  const { data: currentUserData } = useGetCurrentUserQuery(currentUser?.userId);
  const currentUserInfo = currentUserData?.data;

  // Add this state near your other state declarations
  const [isLoading, setIsLoading] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Update the handleExchangeClick function
  const handleExchangeClick = (service: any) => {
    if (currentUserInfo?.profileStatus !== "safe") {
      localStorage.removeItem("accessToken");
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      setIsAuthenticated(false);
      router.push("/auth/login");
      return;
    }

    setSelectedService(service);
    setModalStep("users");
    setSelectedUsers([]); // Reset selected users when changing category
  };
  // console.log("currentUserInfo", currentUserInfo);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSendRequest = async () => {
    if (!currentUser) {
      localStorage.setItem("selectedUsers", JSON.stringify(selectedUsers));
      localStorage.setItem(
        "selectedService",
        JSON.stringify({
          skill: selectedSkill,
          subCategory: selectedService.subCategory,
          serviceData: selectedService,
        })
      );
      router.push("/auth/login");
      return;
    }

    // Check if user has my_service
    if (
      !currentUserInfo?.my_service ||
      currentUserInfo?.my_service.length === 0
    ) {
      setShowServiceModal(true);
      return;
    }

    setIsLoading(true);
    try {
      // Get the selected user's details - fixing the comparison
      const selectedUserDetails = allUsers.find(
        (user) => user._id === selectedUsers[0]
      );

      const exchangeRequests = selectedUsers.map((userId) => {
        // Find user details for each selected user
        const userDetails = allUsers.find((user) => user._id === userId);
        console.log("userDetails", userDetails);

        return {
          senderUserId: currentUser?.userId,
          senderImage: currentUserInfo?.profileImage,
          reciverUserId: userId,
          reciverImage: userDetails?.profileImage,
          email: currentUser?.email,
          selectedEmail: userDetails?.email,
          senderService: selectedService?.subCategory,
          my_service: currentUserInfo?.my_service,
        };
      });

      const response = await createExchange(exchangeRequests).unwrap();
      console.log("request send", response);

      if (response?.success) {
        setModalStep("success");
        toast.success("Exchange request sent successfully");
      }
    } catch (error) {
      // console.error("Error sending exchange request:", error);
      toast.error("Failed to send exchange request");
    } finally {
      setIsLoading(false);
    }
  };

  // Update useEffect to properly restore the state
  useEffect(() => {
    if (currentUser) {
      const storedUsers = localStorage.getItem("selectedUsers");
      const storedService = localStorage.getItem("selectedService");

      if (storedUsers && storedService) {
        const parsedUsers = JSON.parse(storedUsers);
        const parsedService = JSON.parse(storedService);

        // Restore all necessary states
        setSelectedUsers(parsedUsers);
        setSelectedSkill(parsedService.skill);
        setSelectedService(parsedService.serviceData);
        setModalStep("users");

        // Clean up storage
        localStorage.removeItem("selectedUsers");
        localStorage.removeItem("selectedService");
      }
    }
  }, [currentUser]);

  return (
    <>
      <section className="bg-white text-[#4A4C56] px-4 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Service Categories
        </h2>
        <div className="grid grid-cols-1 text-center sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedCategories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onExchangeClick={handleExchangeClick}
            />
          ))}
        </div>
      </section>

      {modalStep !== "none" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full p-10 max-w-[70%] relative">
            <button
              className="absolute top-4 right-4 text-[#20B894] text-xl cursor-pointer"
              onClick={() => {
                setModalStep("none");
                setSelectedUsers([]);
              }}
            >
              <X className="h-6 w-6" />
            </button>

            {modalStep === "users" && (
              <>
                <div className="bg-[#EDE3D9] p-5 rounded-2xl">
                  <h3 className="text-xl font-semibold mb-4">
                    Select Specific Users
                  </h3>
                  <UserList
                    users={allUsers}
                    selectedUsers={selectedUsers}
                    onUserToggle={handleUserToggle}
                    isLoading={isLoadingUsers}
                  />
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-4">
                    <button
                      onClick={handleSendRequest}
                      disabled={selectedUsers.length === 0 || isLoading}
                      className={`text-sm sm:text-base bg-[#20B894] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full cursor-pointer order-2 sm:order-1 ${
                        selectedUsers.length === 0 || isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-[#1a9677] ease-in-out duration-300"
                      }`}
                    >
                      {isLoading ? "Sending..." : "Send Request"}
                    </button>
                    <button
                      onClick={() => setModalStep("none")}
                      className="border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-50 cursor-pointer ease-in-out duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <SkillExchange
                  selectedService={selectedService}
                  selectedSkill={selectedSkill}
                  onSkillChange={setSelectedSkill}
                  users={allUsers}
                />
              </>
            )}

            {modalStep === "success" && <SuccessMessage />}
          </div>
        </div>
      )}

      {/* Add this modal for service requirement */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-[95%] sm:max-w-[500px] p-6 relative">
            <button
              className="absolute top-4 right-4 text-[#20B894] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowServiceModal(false)}
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-center">
              Service Required
            </h3>
            <p className="text-center mb-6">
              You need to add your service before sending exchange requests.
            </p>

            <div className="flex justify-center">
              <Link href="/dashboard/user-profile">
                <button className="bg-[#20B894] text-white px-6 py-2.5 rounded-full hover:bg-[#1a9677] transition-colors duration-300 cursor-pointer">
                  Add Service
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
