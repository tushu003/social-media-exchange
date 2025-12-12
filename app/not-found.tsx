import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Error from "@/public/client/not-found.png"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5FFFD] px-4">
      <div className="max-w-[500px] text-center">
        <div className="relative w-full h-[300px] mb-8">
          <Image
            src={Error}
            alt="404 Error Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        <h1 className="text-3xl font-bold text-[#070707] mb-3">
          Oops! Page Not Found
        </h1>
        
        <p className="text-[#777980] mb-8">
          The page you're looking for may be broken or have been removed.
        </p>

        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#20B894] text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
