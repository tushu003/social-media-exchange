"use client";

import { useState } from "react";
import Link from "next/link";
import CustomImage from "@/components/reusable/CustomImage";
import forgotPassImage from "@/public/login.png";
import { MoveUpRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/src/redux/features/auth/authApi";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const validatePassword = () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      const response = await resetPassword({
        email,
        password,
      }).unwrap();

      if (response.success) {
        toast.success("Password reset successful! Please verify OTP");
        router.push(
          `/auth/reset-password-otp-verify?email=${encodeURIComponent(email)}`
        );
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="container w-full flex flex-col md:flex-row overflow-hidden">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2 p-6">
          <CustomImage
            src={forgotPassImage.src}
            alt="Forgot Password Illustration"
            className="w-full h-auto"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← Back
            </Link>
          </div>

          <h1 className="text-[32px] font-medium leading-[126%] tracking-[-0.96px] heading_color mb-6">
            Reset password
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="text-sm text-black block mb-2">
                Email address<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Input your email"
                className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-black block mb-2">
                New Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-black block mb-2">
                Confirm Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full primary_color hover:opacity-90 text-white py-2 rounded-full font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <p>"Processing..."</p>
              ) : (
                <>
                  Send OTP
                  <MoveUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
