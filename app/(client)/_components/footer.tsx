import Image from "next/image";
import React from "react";
import logo from "@/public/logo/logo.png";

export default function Footer() {
  return (
    <>
      <footer className="bg-[#F9FAFB] md:block hidden py-6 ">
        <div className="w-full bg-white py-6 px-4">
          <div className="mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Left Text */}
            <p className="text-[#070707] text-sm md:text-base font-normal">
              ©2025 Ollivu. All rights reserved.
            </p>

            {/* Center Logo */}
            <div className="flex justify-center">
              <Image
                src={logo}
                alt="Ollivu Logo"
                width={100}
                height={100}
                className="h-6 w-auto object-contain"
                priority
              />
            </div>

            {/* Right Links */}
            <div className="flex items-center space-x-2">
              <span className="text-[#1D1F2C]">•</span>
              <a
                href="/terms-and-conditions"
                className="text-[#070707] text-sm md:text-base font-normal hover:underline"
              >
                Privacy Policy
              </a>
              <span className="text-[#1D1F2C]">•</span>
              <a
                href="/terms-and-conditions"
                className="text-[#070707] text-sm md:text-base font-normal hover:underline"
              >
                Terms and Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
      <footer className="bg-[#F9FAFB] md:hidden sm:block py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-4 sm:space-y-6">
          {/* Logo */}
          <div className="w-[100px] h-auto">
            <Image
              src={logo}
              alt="Ollivu Logo"
              width={100}
              height={40}
              className="mx-auto"
              priority
            />
          </div>

          {/* Links */}
          <div className="flex items-center justify-center space-x-4 text-sm sm:text-base font-normal text-[#070707]">
            <a href="/terms-and-conditions" className="hover:underline">
              Privacy Policy
            </a>
            <span className="text-[#1D1F2C]">•</span>
            <a href="/terms-and-conditions" className="hover:underline">
              Terms and Policy
            </a>
          </div>

          {/* Copyright */}
          <p className="text-[#070707] text-sm sm:text-base font-normal">
            ©2025 Ollivu. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
