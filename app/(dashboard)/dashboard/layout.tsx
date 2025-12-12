"use client";

import React, { useState, useEffect } from "react";
import Header from "./_components/header";
import Sidebar from "./_components/sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifiedUser } from "@/src/utils/token-varify";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const user = verifiedUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
  }, [user, router]);

  // Handle window resize and check if mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    // Check initially
    checkIsMobile();

    // Add event listener
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <ProtectedRoute>
      <div className="relative flex min-h-screen bg-[#F5FFFD]">
        {/* Mobile Menu Button */}
        {isMobile && !isSidebarOpen && (
          <Button
            variant="ghost"
            className="fixed top-5 left-4 z-50 md:hidden hover:bg-transparent"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </Button>
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed md:static inset-y-0 left-0 z-40 w-64
            transform transition-transform duration-300 ease-in-out
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }
            bg-white shadow-sm md:shadow-none
          `}
        >
          {isMobile && isSidebarOpen && (
            <Button
              variant="ghost"
              className="absolute top-5 right-4 z-50 hover:bg-transparent"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-gray-600" />
            </Button>
          )}
          <Sidebar user={user} />
        </div>

        {/* Overlay */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 md:ml-0">
          <div className="sticky top-0 z-30">
            <Header user={user} />
          </div>
          <main className="p-4 md:p-4">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
