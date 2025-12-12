"use client";

import { verifiedUser } from "@/src/utils/token-varify";
import Image from "next/image";
import Link from "next/link";

export default function Community() {
  const currentUser = verifiedUser()
  return (
    <section className="py-20 px-6 md:px-16">
      <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-[#070707] leading-tight mb-6">
            Exchange Your Services. Build Your Community.
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-8">
            Join Ollivu today and discover a world where everyone has something
            valuable to offer.
          </p>
          <Link
            href={currentUser ? "/service-result" : "/auth/login"}
            className="inline-flex items-center gap-2 bg-[#20B894] text-white text-sm md:text-base font-medium px-6 py-3 rounded-full hover:opacity-90 transition"
          >
            Start Trading Skills Now! ↗
          </Link>
        </div>

        {/* Right Illustration */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/community.png"
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
