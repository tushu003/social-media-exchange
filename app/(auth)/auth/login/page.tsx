"use client";

import { useLoginUserMutation } from "@/src/redux/features/auth/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import loginImg from "@/public/login.png";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        email,
        password,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Login successful!");
        
        // Check for stored selections
        const storedUsers = localStorage.getItem('selectedUsers');
        const storedService = localStorage.getItem('selectedService');
        const redirectUserId = localStorage.getItem('redirectUserId');
        const redirectPath = localStorage.getItem('redirectPath');
        
        if (storedUsers && storedService) {
          // Check if redirect path exists (for service-list)
          if (redirectPath) {
            localStorage.removeItem('redirectPath');
            router.push(redirectPath);
          } else {
            router.push('/#service-categories');
          }
        } else if (redirectUserId) {
          localStorage.removeItem('redirectUserId');
          router.push(`/service-result/${redirectUserId}`);
        } else {
          router.push("/");
        }
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error?.data?.message || "Login failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="max-w-[1224px] w-full flex flex-col md:flex-row ounded-lg overflow-hidden shadow-lg">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2 p-6">
          <Image
            src={loginImg}
            alt="Login Illustration"
            className="w-full h-auto"
          />
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2  p-8">
          <h1 className="text-[32px] font-medium leading-[126%] tracking-[-0.96px] heading_color mb-6">
            Login to your account
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="text-sm text-black block mb-2">
                Email address<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Input your full name"
                className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-black block mb-2">
                Password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Input your password"
                className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-end items-center text-sm text-gray-500">
              <Link href="/auth/forgot-password">
                <button
                  type="button"
                  className="hover:underline cursor-pointer"
                >
                  Forgot Password
                </button>
              </Link>
            </div>

            {/* Login Button */}
            
            <button
              type="submit"
              className="w-full primary_color hover:opacity-90 text-white py-2 rounded-full font-medium transition-all cursor-pointer"
            >
              {isLoading ? "Logging in..." : "Log in ↗"}
            </button>
          </form>
          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            You're new in here?{" "}
            <a href="/auth/signup" className="text-[#20B894] hover:underline">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
