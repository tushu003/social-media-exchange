"use client";

import { verifiedUser } from "@/src/utils/token-varify";
import Image from "next/image";
import Link from "next/link";

export default function BannerSection() {
  const currentUser = verifiedUser()
  return (
    <section className="bg-[#F1FCF9] py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Left Text Content */}
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-[#070707] leading-tight mb-6">
            Get What You Need, Give What You Can – Service Exchange Made Simple!
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-8">
            Join a global community of resourceful individuals exchanging
            services. Reduce waste, build connections, and discover a new way to
            get what you need all without spending a dime!
          </p>
          <Link
            href={currentUser ? "/service-result" : "/auth/login"}
            className="inline-flex items-center gap-2 bg-[#20B894] text-white text-sm md:text-base font-medium px-6 py-3 rounded-full hover:opacity-90 transition"
          >
            Start Trading Skills Now! ↗
          </Link>
        </div>

        {/* Right Illustration */}
        <div className="w-full md:w-1/2">
          <Image
            src="/hero-section.png"
            alt="Service Exchange Illustration"
            width={600}
            height={400}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
