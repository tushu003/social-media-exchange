"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo/logo.png";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Menu,
  MoveUpRight,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import CustomImage from "@/components/reusable/CustomImage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { verifiedUser } from "@/src/utils/token-varify";
import { useGetAllCategoriesQuery } from "@/src/redux/features/categories/categoriesApi";
import {
  useGetSingleUserQuery,
  useGetCurrentUserQuery,
} from "@/src/redux/features/users/userApi";
import NotificationBadge from "./NotificationBadge/NotificationBadge";
import NotificationPopup from "./notification-popup";
import { Button } from "@/components/ui/button";
import { useGetAllExchangeDataQuery } from "@/src/redux/features/auth/authApi";
import { useGetReadExchangeNotificaionQuery } from "@/src/redux/features/notification/notificationApi";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { data: getAllCategories, isLoading } =
    useGetAllCategoriesQuery(undefined);
  const categories = getAllCategories?.data || [];

  const validUser = verifiedUser();
  const { data: singleUser } = useGetSingleUserQuery(validUser?.userId);
  const singleUserData = singleUser?.data;

  const { data: requestList, refetch } = useGetAllExchangeDataQuery(
    {
      userId: validUser?.userId,
      isAccepted: false,
    },
    { pollingInterval: 5000 }
  );

  // console.log("llist", requestList);

  const { data: readNotificationCount, isLoading: isNotificationLoading } =
    useGetReadExchangeNotificaionQuery(validUser?.userId);

  const { refetch: refetchCurrentUser } = useGetCurrentUserQuery(
    validUser?.userId
  );

  useEffect(() => {
    refetch();
  }, []);

  // Update the authentication check
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        setIsAuthenticated(!!token);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setIsAuthenticated(false);
    router.push("/auth/login");
  };

  // Add scroll event handler
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down
        setIsVisible(false);
      } else {
        // scrolling up
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    // cleanup function
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isServicesOpen) setIsServicesOpen(false);
  };

  // Fix the toggleServices function
  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const user = verifiedUser();
  // console.log("user", user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside the mobile menu and services dropdown
      if (
        !target.closest(".mobile-menu-container") &&
        !target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
        setIsServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNotificationPopupOpen(!isNotificationPopupOpen);
  };

  // ==============================Message Request Notificaton ===================

  const handleProtectedNav = (e: React.MouseEvent, targetPath: string) => {
    if (
      singleUserData &&
      singleUserData.profileStatus &&
      singleUserData.profileStatus !== "safe"
    ) {
      e.preventDefault();
      localStorage.removeItem("accessToken");
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      setIsAuthenticated(false);
      router.push("/auth/login");
      return;
    }
    router.push(targetPath);
  };

  // Handler for Dashboard navigation
  const handleDashboardClick = async (e, isMobile = false) => {
    e.preventDefault();
    const refetchResult = await refetchCurrentUser();
    const latestUserInfo = refetchResult?.data?.data;

    if (latestUserInfo?.profileStatus !== "safe") {
      localStorage.removeItem("accessToken");
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      setIsAuthenticated(false);
      router.push("/auth/login");
      if (isMobile) setIsMobileMenuOpen(false);
      return;
    }
    const targetPath =
      user?.role === "admin" ? "/dashboard/user-management" : "/dashboard";
    router.push(targetPath);
    if (isMobile) setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`secondary_color shadow-sm sticky top-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-teal-600">
              <CustomImage
                src={logo.src}
                alt="Company Logo"
                width={120}
                height={40}
                layout="fixed"
              />
            </Link>
          </div>

          {/* Desktop Navigation Menu - Centered */}
          <div className="hidden md:flex flex-1 justify-center items-center">
            <div className="flex items-center space-x-8 text-[#777980]">
              <Link
                href="/"
                className={`font-medium hover:text-teal-600 ${
                  pathname === "/" ? "text-[#070707]" : "text-[#777980]"
                }`}
              >
                Home
              </Link>

              {/* Services Dropdown */}
              <div className="relative group">
                <Link
                  href="/service-result"
                  className={`flex items-center space-x-1 font-medium hover:text-teal-600 ${
                    pathname.includes("/service-result")
                      ? "text-[#070707]"
                      : "text-[#777980]"
                  }`}
                  onClick={(e) => {
                    if (
                      singleUserData &&
                      singleUserData.profileStatus &&
                      singleUserData.profileStatus !== "safe"
                    ) {
                      e.preventDefault();
                      localStorage.removeItem("accessToken");
                      document.cookie =
                        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                      setIsAuthenticated(false);
                      router.push("/auth/login");
                    }
                  }}
                >
                  <span>Services</span>
                  <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform" />
                </Link>

                {/* Dropdown Menu - Shows on Hover */}
                <div className="absolute top-full mt-5 -left-40 w-[calc(100vw-2rem)] md:w-[700px] lg:w-[1000px] bg-white shadow-lg rounded-md p-4 md:p-6 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category) => (
                      <div key={category._id} className="group/item">
                        <h3 className="font-medium text-lg mb-2 md:mb-3 text-[#070707] group-hover/item:text-teal-600">
                          {category.category_name}
                        </h3>
                        <ul className="space-y-1 md:space-y-2">
                          {category.subCategories.map((item) => (
                            <li
                              key={item._id}
                              className="text-xs md:text-sm text-gray-600 hover:text-teal-600 transition-colors"
                            >
                              <Link
                                href={`/service-result?my_service=${encodeURIComponent(
                                  item.subCategory
                                )}`}
                                className="block py-1"
                                onClick={() => {
                                  if (isMobileMenuOpen) {
                                    setIsMobileMenuOpen(false);
                                    setIsServicesOpen(false);
                                  }
                                }}
                              >
                                {item.subCategory}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {isServicesOpen && (
                    <div className="pl-4 pr-2 py-2">
                      {categories.map((category) => (
                        <div key={category._id} className="group/item">
                          <h3 className="font-semibold text-sm mb-2 md:mb-3 text-gray-900 group-hover/item:text-teal-600">
                            {category.category_name}
                          </h3>
                          <ul className="space-y-2">
                            {category.subCategories.map((item) => (
                              <li key={item._id}>
                                <Link
                                  href={`/service-result?category=${encodeURIComponent(
                                    category.category_name
                                  )}&service=${encodeURIComponent(
                                    item.subCategory
                                  )}`}
                                  className="text-sm text-gray-600 hover:text-teal-600 flex items-center group-hover/item:translate-x-1 transition-transform"
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsServicesOpen(false);
                                  }}
                                >
                                  {item.subCategory}
                                  <MoveUpRight className="w-3 h-3 ml-1 opacity-0 group-hover/item:opacity-100" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Link
                href="/#how-it-works"
                className={`font-medium hover:text-teal-600 ${
                  pathname === "/how-it-works"
                    ? "text-[#070707]"
                    : "text-[#777980]"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (pathname !== "/") {
                    router.push("/#how-it-works");
                  } else {
                    document.getElementById("how-it-works")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                How it works
              </Link>

              <Link
                href="/terms-and-conditions"
                className={`font-medium hover:text-teal-600 ${
                  pathname === "/terms-and-conditions"
                    ? "text-[#070707]"
                    : "text-[#777980]"
                }`}
              >
                Terms & Policy
              </Link>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {validUser?.role === "user" && (
              <div className="relative">
                <button
                  onClick={handleBellClick}
                  className="relative p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Bell className="w-7 h-7 text-[#20B894]" />
                  {/* {readNotificationCount?.data?.length > 0 && ( */}
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#20B894] text-white text-xs rounded-full flex items-center justify-center">
                    {readNotificationCount?.data?.length +
                      requestList?.data?.length}
                  </span>
                  {/* )} */}
                </button>
              </div>
            )}

            {validUser?.role === "user" && (
              <NotificationBadge currentUser={validUser?.email} />
            )}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
                  <div className="w-10 h-10 rounded-full relative overflow-hidden">
                    {singleUserData?.profileImage ? (
                      <div>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${singleUserData?.profileImage}`}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xl font-semibold">
                        {singleUserData?.first_name
                          ? singleUserData?.first_name
                              .slice(0, 2)
                              .toUpperCase() ||
                            singleUserData?.personalInfo?.last_name
                              .slice(0, 2)
                              .toUpperCase()
                          : "UN"}
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">
                        {singleUserData?.first_name}{" "}
                        {singleUserData?.personalInfo?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {singleUserData?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={(e) => handleDashboardClick(e, false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>

                  {singleUserData?.role === "user" ? (
                    <Link href="/dashboard/user-profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                  ) : (
                    <Link href="/dashboard/admin-profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="group font-medium px-4 py-2 rounded-full border border-teal-600 transition-all duration-300 text-[#777870] flex items-center gap-2 hover:bg-teal-500 hover:border-teal-500"
                >
                  <span className="group-hover:text-white transition-colors duration-300">
                    Login
                  </span>
                  <MoveUpRight
                    className="text-[#777870] group-hover:text-white transition-colors duration-300"
                    size={20}
                  />
                </Link>
                <Link
                  href="/auth/signup"
                  className="group font-medium px-4 py-2 rounded-full border border-teal-600 transition-all duration-300 text-[#777870] flex items-center gap-2 hover:bg-teal-500 hover:border-teal-500"
                >
                  <span className="group-hover:text-white transition-colors duration-300">
                    Sign Up
                  </span>
                  <MoveUpRight
                    className="text-[#777870] group-hover:text-white transition-colors duration-300"
                    size={20}
                  />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <div className="mr-4 ">
              <NotificationBadge currentUser={validUser?.email} />
            </div>
            {validUser?.role === "user" && (
              <button
                onClick={handleBellClick}
                className="relative p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell className="w-6 h-6 text-[#20B894]" />
                {/* {readNotificationCount?.data?.length > 0 && ( */}
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#20B894] text-white text-xs rounded-full flex items-center justify-center">
                  {readNotificationCount?.data?.length +
                    requestList?.data?.length}
                </span>
                {/* )} */}
              </button>
            )}
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-teal-600 mobile-menu-button"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Popup */}
      <NotificationPopup
        isOpen={isNotificationPopupOpen}
        onClose={() => setIsNotificationPopupOpen(false)}
        notificationCount={readNotificationCount?.data?.length || 0}
        requestList={requestList}
      />

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50 mobile-menu-container">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/" ? "text-[#070707]" : "text-[#777980]"
              } hover:text-teal-600`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            <div>
              <button
                onClick={toggleServices}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                  pathname.includes("/services")
                    ? "text-[#070707]"
                    : "text-[#777980]"
                } hover:text-teal-600`}
              >
                <span>Services</span>
                {isServicesOpen ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>

              {/* Mobile Menu Services Section */}
              {isServicesOpen && (
                <div className="pl-4 pr-2 py-2">
                  {categories.map((category) => (
                    <div key={category._id} className="group/item">
                      <h3 className="font-semibold text-sm mb-1 md:mb-3 text-gray-900 group-hover/item:text-teal-600">
                        {category.category_name}
                      </h3>
                      <ul className="space-y-2 mb-4">
                        {category.subCategories.map((item) => (
                          <li key={item._id}>
                            <Link
                              href={`/service-result?my_service=${encodeURIComponent(
                                item.subCategory
                              )}`}
                              className="text-sm text-gray-600 hover:text-teal-600 flex items-center group-hover/item:translate-x-1 transition-transform"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsServicesOpen(false);
                              }}
                            >
                              {item.subCategory}
                              <MoveUpRight className="w-3 h-3 ml-1 opacity-0 group-hover/item:opacity-100" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#how-it-works"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/how-it-works"
                  ? "text-[#070707]"
                  : "text-[#777980]"
              } hover:text-teal-600`}
              onClick={(e) => {
                e.preventDefault();
                if (pathname !== "/") {
                  router.push("/#how-it-works");
                } else {
                  document.getElementById("how-it-works")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
                setIsMobileMenuOpen(false); // Close mobile menu after click
              }}
            >
              How it works
            </Link>

            <Link
              href="/terms-and-conditions"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/terms" ? "text-[#070707]" : "text-[#777980]"
              } hover:text-teal-600`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Terms & Policy
            </Link>

            {/* Mobile Menu Auth Section */}
            <div className="flex flex-col items-center justify-center w-full gap-4 pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <a
                    href={
                      user?.role === "admin"
                        ? "/dashboard/user-management"
                        : "/dashboard"
                    }
                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-[#777980] hover:text-teal-600"
                    onClick={(e) => handleDashboardClick(e, true)}
                  >
                    Dashboard
                  </a>
                  <Link
                    href={
                      singleUserData?.role === "user"
                        ? "/dashboard/user-profile"
                        : "/dashboard/admin-profile"
                    }
                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-[#777980] hover:text-teal-600"
                    onClick={(e) => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={(e) => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block px-8 py-2 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-8 py-2 rounded-full text-sm font-medium hover:text-teal-600 border border-[#D2B9A1] text-[#D2B9A1]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-8 py-2 rounded-full text-sm font-medium bg-teal-500 text-white hover:bg-teal-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
