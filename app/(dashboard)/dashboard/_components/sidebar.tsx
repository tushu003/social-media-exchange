"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  ReceiptText,
  MessageCircleMore,
  User,
  SquareKanban,
  CirclePlus,
} from "lucide-react";
import { FaStar } from "react-icons/fa6";
import logo from "@/public/logo/logo.png";

export default function Sidebar({ user }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // User menu items
  const userMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    {
      icon: UserCircle,
      label: "User Profile",
      href: "/dashboard/user-profile",
    },
    { icon: MessageSquare, label: "Message", href: "/dashboard/messages" },
    { icon: Star, label: "Review", href: "/dashboard/review" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  // Admin menu items
  const adminMenuItems = [
    {
      icon: SquareKanban,
      label: "User Management",
      href: "/dashboard/user-management",
    },
    {
      icon: User,
      label: "Admin Profile",
      href: "/dashboard/admin-profile",
    },

    {
      icon: MessageCircleMore,
      label: "Monitor users",
      href: "/dashboard/monitor-users",
    },
    {
      icon: FaStar,
      label: "Manage Report",
      href: "/dashboard/manage-review",
    },
    {
      icon: CirclePlus,
      label: "Add Category",
      href: "/dashboard/add-category",
    },
    {
      icon: ReceiptText,
      label: "Terms of Service",
      href: "/dashboard/terms-of-service",
    },
  ];

  // Combine menu items based on user role
  const menuItems =
    user?.role === "admin" ? [...adminMenuItems] : userMenuItems;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setIsAuthenticated(false);
    router.push("/auth/login");
  };

  return (
    <div className="bg-white h-screen shadow-sm flex flex-col sticky top-0">
      {/* Logo section */}
      <div className="p-6 border-b shrink-0">
        {user?.role === "admin" ? (
          // <Link href="/dashboard/user-management" className="block">
          <Link href="/" className="block">
            <Image src={logo} alt="Logo" width={100} height={40} />
          </Link>
        ) : (
          // <Link href="/dashboard" className="block">
          <Link href="/" className="block">
            <Image src={logo} alt="Logo" width={100} height={40} />
          </Link>
        )}
      </div>

      {/* Navigation section with overflow scroll */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <nav className="px-4 py-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                pathname === item.href
                  ? "bg-[#20B894] text-white"
                  : "text-[#777980] hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout button section */}
      <div className="p-6 border-t shrink-0 bg-white">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors w-full px-4 py-2 cursor-pointer hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
