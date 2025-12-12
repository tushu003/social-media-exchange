import React from "react";
import Banner from "./_components/home-page/banner";
import ServicesSection from "./_components/home-page/services";
import ValuePropositionSection from "./_components/home-page/value-proposition";
import ServiceCategoriesSection from "./_components/home-page/Service-categories";
import HowWorks from "./_components/home-page/how-it-works";
import Community from "./_components/home-page/community";
import Footer from "./_components/footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="">
      <Banner />
      <ServicesSection />
      <ValuePropositionSection />
      <ServiceCategoriesSection />
      <div className="w-full flex justify-center my-4">
        <Link
          href="/service-list"
          className="bg-[#20B894] text-white text-sm font-medium px-6 py-3 rounded-full gap-2 hover:opacity-90 transition"
        >
          View All
        </Link>
      </div>

      <HowWorks />
      <Community />
    </div>
  );
}
