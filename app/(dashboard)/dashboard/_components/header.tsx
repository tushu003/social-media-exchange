"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  MessageCircle,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Home,
} from "lucide-react";
import profile from "@/public/avatars/emily.png";
import { MdNotifications } from "react-icons/md";
import Link from "next/link";
import { verifiedUser } from "@/src/utils/token-varify";
import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";
import { useGetAllExchangeDataQuery } from "@/src/redux/features/auth/authApi";
import { useGetReadExchangeNotificaionQuery } from "@/src/redux/features/notification/notificationApi";
import DashboardNotificationPopup from "./dashboard-notification-popup";

export default function Header({ user }) {
  const router = useRouter();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);

  const validUser = verifiedUser();
  const { data: singleUser } = useGetSingleUserQuery(validUser?.userId);
  const singleUserData = singleUser?.data;
  // console.log("singleUserData", singleUserData);

  const { data: readNotificationCount, isLoading: isNotificationLoading } =
    useGetReadExchangeNotificaionQuery(validUser?.userId, {
      skip: !validUser,
      pollingInterval: 5000,
    });
  
  const notifications = [
    {
      id: 1,
      name: "Jerry ",
      type: "message",
      text: "I'd love to swap my Graphic Design for your Marketing help! Let's chat specifics. When are you free to have a...",
      image: profile,
    },
    {
      id: 2,
      name: "Jhon ",
      type: "alert",
      text: "Account Suspension Notice: 2 weeks suspension.",
      image: null,
    },
    {
      id: 3,
      name: "Jane ",
      type: "message",
      text: "John Doe liked your post.",
      image: profile,
    },
    {
      id: 4,
      name: "Alex",
      type: "alert",
      text: "Server maintenance scheduled for tomorrow.",
      image: null,
    },
    {
      id: 5,
      name: "Alice",
      type: "message",
      text: "Alice commented on your post.",
      image: profile,
    },
    {
      id: 6,
      name: "Bob",
      type: "message",
      text: "Your password was changed successfully.",
      image: null,
    },
  ];

  const { data: requestList, refetch } = useGetAllExchangeDataQuery(
    {
      userId: validUser?.userId,
      isAccepted: false,
    },
    { pollingInterval: 5000 }
  );

  useEffect(() => {
    refetch();
  }, []);

  // Toggle dropdowns
  const handleProfileClick = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  const handleBellClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNotificationPopupOpen(!isNotificationPopupOpen);
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add logout handler
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setIsAuthenticated(false);
    router.push("/auth/login");
  };

  const profileMenuItems = [
    {
      label: "Profile",
      icon: User,
      href: "/dashboard/user-profile",
    },
    {
      label: "Back to Home",
      icon: Home,
      href: "/",
    },
  ];

  return (
    <div className="bg-white shadow-sm py-[21px] px-6 sticky top-0 z-50">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-6">
       

         

          {singleUserData?.role === "user" && (
           
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

          {/* Notification Popup */}
          <DashboardNotificationPopup
            isOpen={isNotificationPopupOpen}
            onClose={() => setIsNotificationPopupOpen(false)}
            notificationCount={readNotificationCount?.data?.length || 0}
            requestList={requestList}
          />

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-full p-1 transition-colors duration-200"
            >
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
                      ? singleUserData.first_name.slice(0, 2).toUpperCase()
                      : "UN"}
                  </div>
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[#070707] text-left">
                  {singleUserData?.first_name}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute top-14 right-0 w-64 bg-white rounded-lg shadow-lg py-2 border border-gray-100 transition-all duration-200 ease-in-out">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {singleUserData?.first_name} {singleUserData?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {singleUserData?.email}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {profileMenuItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <item.icon className="w-4 h-4 mr-3 text-gray-500" />
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
