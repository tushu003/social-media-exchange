"use client";

import { Suspense } from "react";
import ServiceResultContent from "./_components/ServiceResultContent";

export default function ServicesPage() {
  
  return (
    <Suspense  
      fallback={
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      {/* <ProtectedRoute> */}
        <ServiceResultContent />
      {/* </ProtectedRoute> */}
    </Suspense>
  );
}
