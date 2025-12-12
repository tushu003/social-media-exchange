"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Service } from "@/types/service.types";
import { serviceCategories } from "@/data/services";
import { CategorySidebar } from "./category-sidebar";
import { ServiceCard } from "./service-card";
import { Pagination } from "@/components/reusable/pagination";
import { useGetAllUsersQuery } from "@/src/redux/features/users/userApi";
import { ChevronDown, X, LoaderCircle } from "lucide-react";

const ITEMS_PER_PAGE = 10;

interface CategoryItem {
  id: number;
  title: string;
  instructor: {
    image: any;
    name: any;
    location: string;
    email: string;
    languages: string[];
    totalReview: number;
    experience: any;
    about: string;
    description: string;
    status: string;
    isVerified: boolean;
  };
  rating: number;
  reviewCount: number;
  image: any;
}

interface Category {
  title: string;
  items: CategoryItem[];
}

export default function ServiceResultContent() {
  const searchParams = useSearchParams();

  // State for selected filters and pagination
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  // Animation and transition state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract filter parameters from URL
  const myServiceParam = searchParams.get("my_service");
  const ratingParam = searchParams.get("rating");
  const locationParam = searchParams.get("country");
  const searchTermParam = searchParams.get("searchTerm");

  // Create a query params object for fetching
  const queryParams = {
    ...(myServiceParam && { my_service: myServiceParam }),
    ...(ratingParam && { rating: Number(ratingParam) }),
    ...(locationParam && { country: locationParam }),
    ...(searchTermParam && { searchTerm: searchTermParam }),
  };

  // Fetch all users with filter params
  const {
    data: users,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllUsersQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  useEffect(() => {
    refetch();
  }, []);
  // console.log("users", users?.data);

  // Handle content transitions
  const startTransition = useCallback(() => {
    setIsTransitioning(true);

    // Clear any existing timeouts
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
  }, []);

  const endTransition = useCallback(() => {
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Set initial state based on URL parameters
  useEffect(() => {
    if (myServiceParam) {
      // Try to determine if it's a category or subcategory
      const categoryMatch = serviceCategories.find(
        (cat) => cat.title === myServiceParam
      );

      if (categoryMatch) {
        setSelectedCategory(myServiceParam);
        setSelectedItem(null);
      } else {
        // Check if it's a subcategory
        const parentCategory = serviceCategories.find((cat) =>
          cat.items.some((item) => item.title === myServiceParam)
        );

        if (parentCategory) {
          setSelectedCategory(parentCategory.title);
          setSelectedItem(myServiceParam);
        } else {
          // If not found in our structure, just use it as a search term
          setSelectedCategory(myServiceParam);
          setSelectedItem(null);
        }
      }
    } else {
      // If no service parameter, reset selections
      setSelectedCategory(null);
      setSelectedItem(null);
    }
  }, [myServiceParam]);

  // Initialize filtered users when data is loaded
  useEffect(() => {
    if (isLoading || isFetching) {
      startTransition();
    } else if (users?.data) {
      startTransition();
      const usersWithServices = users.data.filter(
        (user: any) => user.my_service && user.my_service.length > 0
      );
      setFilteredUsers(usersWithServices);
      endTransition();
    }
  }, [users, isLoading, isFetching, startTransition, endTransition]);

  // Handle category selection
  const handleCategorySelect = useCallback(
    (category: string | null) => {
      setSelectedCategory(category);
      // When selecting a category, clear any selected item if category changes
      if (category !== selectedCategory) {
        setSelectedItem(null);
      }
    },
    [selectedCategory]
  );

  // Handle item selection
  const handleItemSelect = useCallback((item: string | null) => {
    setSelectedItem(item);
    // Close sidebar on mobile when subcategory is selected
    setIsSidebarOpen(false);
  }, []);

  // Handle service filtering
  const handleServiceFilter = useCallback(
    (filteredData: any[]) => {
      startTransition();
      setFilteredUsers(filteredData);
      setCurrentPage(1);
      endTransition();
    },
    [startTransition, endTransition]
  );

  const validUsers = filteredUsers.filter(
    (user: any) => user.my_service && user.my_service.length > 0
  );

  // Calculate pagination values
  const totalItems = validUsers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedUsers = validUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change with smooth transition
  const handlePageChange = useCallback(
    (page: number) => {
      startTransition();
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
      endTransition();
    },
    [startTransition, endTransition]
  );

  // Handle sidebar toggle for mobile
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Render loading state
  if (isLoading && !filteredUsers.length) {
    return (
      <div className="container mx-auto p-4 text-center py-20">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-600">Loading services...</p>
      </div>
    );
  }

  // Count valid services (with my_service property)
  const validServiceCount = paginatedUsers.filter(
    (user: any) => user.my_service && user.my_service.length > 0
  ).length;

  return (
    <div className="container mx-auto p-4">
      {/* Add CSS transition for smooth content changes */}
      <style jsx>{`
        .content-transition {
          transition: opacity 0.3s ease-in-out, filter 0.3s ease-in-out;
          opacity: 1;
        }
        .content-transition.loading {
          opacity: 0.7;
          filter: grayscale(20%);
          pointer-events: none;
        }
      `}</style>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4 mt-5">
        <button
          onClick={toggleSidebar}
          className="w-full py-2 px-4 bg-teal-500 text-white rounded-lg flex items-center justify-between"
        >
          <span>Filter Categories</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-4 lg:mt-20">
        {/* Sidebar (mobile and desktop) */}
        <div
          className={`
            lg:w-1/4 fixed lg:relative inset-0 mt-16 lg:mt-0 z-30 lg:z-auto 
            transform transition-transform duration-300 ease-in-out 
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            } 
            bg-white lg:bg-transparent p-4 lg:p-0 overflow-y-auto lg:block
          `}
        >
          {/* Close Button for Mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          <CategorySidebar
            selectedCategory={selectedCategory}
            selectedItem={selectedItem}
            onCategorySelect={handleCategorySelect}
            onItemSelect={handleItemSelect}
            onServiceFilter={handleServiceFilter}
          />
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content with transition */}
        <div
          className={`lg:w-3/4 w-full content-transition ${
            isTransitioning || isFetching ? "loading" : ""
          }`}
        >
          {/* Page header with service count */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {!selectedCategory && !selectedItem
                ? "All Services"
                : selectedItem || selectedCategory || "All Services"}{" "}
              <span className="text-gray-500">({validServiceCount})</span>
            </h1>

            {/* Loading indicator next to title */}
            {(isFetching || isTransitioning) && (
              <LoaderCircle className="animate-spin text-teal-500 h-5 w-5" />
            )}
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user: any) => (
                <ServiceCard key={user._id} user={user} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">No services found</p>
                {(isLoading || isFetching) && (
                  <div className="mt-4 flex justify-center">
                    <LoaderCircle className="animate-spin text-teal-500 h-6 w-6" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
