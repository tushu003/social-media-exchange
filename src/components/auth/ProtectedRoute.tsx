"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifiedUser, isAdmin } from "@/src/utils/token-varify";
import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";
// import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const router = useRouter();
  const user = verifiedUser();
  const { data: singleUser, isLoading } = useGetSingleUserQuery(user?.userId);
  // console.log("private route singleUser", singleUser);

  // if (isLoading) {
  //   return (
  //     <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      router.push("/dashboard");
    }

    // if (singleUser?.profileStatus !== "safe") {
    //   localStorage.removeItem("accessToken");
    //   document.cookie =
    //     "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    //   router.push("/auth/login");
    //   return;
    // }
  }, [router, allowedRoles]);

  if (!user) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
