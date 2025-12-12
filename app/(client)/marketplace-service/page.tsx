"use client";

import React, { useState } from "react";
import Image from "next/image";
import { serviceCategories } from "@/constants/serviceCategories";
import banner from "@/public/client/home/service-banner.png";
import Link from "next/link";

const categories = [
  "All",
  "Personal & Care Services",
  "Events & Entertainment",
  "Automotive & Transportation",
  "Wellness & Personal Growth",
  "Education & Learning",
  "Professional & Business Services",
  "Home Services & Maintenance",
];

export default function MarketplaceServices() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredServices = serviceCategories.filter((service) =>
    activeCategory === "All" ? true : service.category === activeCategory
  );

  return (
    <div className="mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="flex justify-between items-center mb-16 bg-[#F9F9F9]">
        <h1 className="text-[40px] font-medium  text-[#070707] max-w-3xl">
          Explore & Exchange: Your Marketplace for Services
        </h1>
        <Image src={banner} alt="Marketplace Hero" width={300} height={300} />
      </div>

      {/* Categories Section */}
      <div className="mb-16">
        <h2 className="text-[48px] font-medium text-center text-[#070707] mb-8">
          Service Categories
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-base transition-colors cursor-pointer ${
                activeCategory === category
                  ? "bg-[#20B894] text-white"
                  : "bg-transparent text-[#777980] hover:text-[#20B894]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredServices.map((service, index) => (
          <Link key={index} href={`/marketplace/service/${index}`}>
            <div
              key={service.name}
              className="flex flex-col items-center p-6 bg-white rounded-lg hover:shadow-lg hover:bg-[#20B894]/5  transition-all border cursor-pointer"
            >
              <div className="w-12 h-12 border border-[#20B894]/20 rounded-full flex items-center justify-center mb-4">
                <service.icon className="w-6 h-6 text-[#20B894]" />
              </div>
              <h3 className="text-[#4A4C56] text-lg font-medium text-center mb-4">
                {service.name}
              </h3>
              <button className="text-[#20B894] hover:text-[#1a9678] flex items-center gap-1 group">
                Exchange Service
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
