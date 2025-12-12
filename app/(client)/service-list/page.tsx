"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useGetAllCategoriesQuery } from "@/src/redux/features/categories/categoriesApi";
import { useGetAllUserBaseOnSubCategoryQuery } from "@/src/redux/features/shared/categoryAPi";
import { useCreateExchangeMutation } from "@/src/redux/features/shared/exchangeApi";
import { useGetCurrentUserQuery } from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ArrowUpRight, X } from "lucide-react";
import UserList from "../_components/home-page/service-categories/UserList";
import SkillExchange from "../_components/home-page/service-categories/SkillExchange";
import SuccessMessage from "../_components/home-page/service-categories/SuccessMessage";
import exchange from "@/public/service-list.png";
import { useRouter } from "next/navigation";
import { ServiceCard } from "../(service)/service-result/_components/service-card";
import ServiceExchangeFlow from "../_components/home-page/Service-categories";

export default function ServiceList() {
  const { data: categories } = useGetAllCategoriesQuery({});
  const categoriesData = categories?.data;

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [modalStep, setModalStep] = useState<"none" | "users" | "success">(
    "none"
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Fetch users based on selected service
  const { data: getUsersByService, isLoading: isLoadingUsers } =
    useGetAllUserBaseOnSubCategoryQuery(selectedService?.subCategory || "", {
      skip: !selectedService?.subCategory,
    });

  const filteredUsers = getUsersByService?.data || [];

  const allSubCategories =
    categoriesData?.flatMap((category) =>
      category.subCategories.map((sub) => ({
        ...sub,
        parentCategory: category.category_name,
      }))
    ) || [];

  const filteredSubCategories =
    activeCategory === "All"
      ? allSubCategories
      : categoriesData?.find((cat) => cat.category_name === activeCategory)
          ?.subCategories || [];

  const currentUser = verifiedUser();
  const { data: currentUserData } = useGetCurrentUserQuery(currentUser?.userId);
  const currentUserInfo = currentUserData?.data;

  const [createExchange] = useCreateExchangeMutation();

  // Handle user selection
  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle exchange click
  const handleExchangeClick = (service: any) => {
    setSelectedService(service);
    setModalStep("users");
    setSelectedUsers([]); // Reset selected users when opening modal
  };

  // Reset selections when modal closes
  const handleCloseModal = () => {
    setModalStep("none");
    setSelectedUsers([]);
    setSelectedService("");
    // setSelectedSkill("");
  };

  // Handle send request
  // Add useRouter at the top with other imports
  const router = useRouter();

  // Modify handleSendRequest function
  const handleSendRequest = async () => {
    if (!currentUser) {
      // Store selected users and service info before redirecting
      localStorage.setItem("selectedUsers", JSON.stringify(selectedUsers));
      localStorage.setItem(
        "selectedService",
        JSON.stringify({
          skill: selectedService?.subCategory,
          subCategory: selectedService?.subCategory,
          serviceData: selectedService,
          activeCategory: activeCategory, // Store active category to restore tab state
        })
      );
      localStorage.setItem("redirectPath", "/service-list"); // Add this line
      router.push("/auth/login");
      return;
    }

    try {
      const exchangeRequests = selectedUsers.map((userId) => {
        // Find user details for each selected user
        const userDetails = filteredUsers.find((user) => user._id === userId);

        return {
          senderUserId: currentUser?.userId,
          senderImage: currentUserInfo?.profileImage,
          reciverUserId: userId,
          reciverImage: userDetails?.profileImage,
          email: currentUser?.email,
          senderService: selectedService?.subCategory,
          my_service: currentUserInfo?.my_service,
        };
      });

      const response = await createExchange(exchangeRequests).unwrap();

      if (response?.success) {
        setModalStep("success");
        toast.success("Exchange request sent successfully");

        setTimeout(() => {
          setModalStep("none");
          setSelectedUsers([]);
          setSelectedService("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error sending exchange request:", error);
      toast.error("Failed to send exchange request");
    }
  };

  // Add useEffect to restore state after login
  useEffect(() => {
    if (currentUser) {
      const storedUsers = localStorage.getItem("selectedUsers");
      const storedService = localStorage.getItem("selectedService");

      if (storedUsers && storedService) {
        const parsedUsers = JSON.parse(storedUsers);
        const parsedService = JSON.parse(storedService);

        // Restore all states
        setSelectedUsers(parsedUsers);
        setSelectedService(parsedService.serviceData);
        setActiveCategory(parsedService.activeCategory || "All");
        setModalStep("users");

        // Clean up storage
        localStorage.removeItem("selectedUsers");
        localStorage.removeItem("selectedService");
      }
    }
  }, [currentUser]);
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 mb-8 md:mb-12">
        <div className="text-center md:text-left mt-5 md:mt-0">
          <h2 className="text-3xl md:text-[40px] font-medium font-inter leading-tight">
            Explore & Exchange: Your Marketplace{" "}
            <br className="hidden md:block" /> for Services
          </h2>
        </div>
        <div className="w-full md:w-auto">
          <Image
            src={exchange}
            alt="Exchange"
            width={400}
            height={400}
            className="w-full max-w-[300px] md:max-w-[400px] mx-auto"
          />
        </div>
      </div>

      <div className="mt-8 md:mt-12">
        <div className="flex justify-center items-center mb-6 md:mb-8">
          <h3 className="text-3xl sm:text-4xl md:text-[48px] font-medium font-inter text-[#070707]">
            Service Categories
          </h3>
        </div>

        {/* Category Tabs */}
        <div className="container mx-auto mb-6 md:mb-8">
          <div className="flex items-center justify-center flex-wrap gap-2 md:gap-3 p-2 bg-[#F9F9F9] rounded-xl">
            <button
              onClick={() => setActiveCategory("All")}
              className={cn(
                "px-6 py-3 rounded-md transition-all cursor-pointer text-[16px] font-medium",
                activeCategory === "All"
                  ? "bg-[#20B894] text-white"
                  : "text-[#777980] hover:bg-gray-100"
              )}
            >
              All
            </button>
            {categoriesData?.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category.category_name)}
                className={cn(
                  "px-6 py-3 rounded-md transition-all cursor-pointer text-[16px] font-medium",
                  activeCategory === category.category_name
                    ? "bg-[#20B894] text-white"
                    : "text-[#777980] hover:bg-gray-100"
                )}
              >
                {category.category_name}
              </button>
            ))}
          </div>
        </div>
        <ServiceExchangeFlow
          activeCategory={activeCategory}
          showAllCategories={true}
        />
      </div>
    </div>
  );
}
