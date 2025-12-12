"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CustomImage from "@/components/reusable/CustomImage";
import verifyEmailImage from "@/public/login.png";
import { MoveUpRight } from "lucide-react";
import { useVerifyOTPForResetPasswordMutation } from "@/src/redux/features/auth/authApi";
import { toast } from "sonner";
import { Suspense } from "react";

function ResetPasswordOTPVerifyContent() {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();
  const [verifyOTP, { isLoading }] = useVerifyOTPForResetPasswordMutation();

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedValue = value.slice(0, 6).split("");
      const newCode = [...verificationCode];
      pastedValue.forEach((val, idx) => {
        if (idx < 6) newCode[idx] = val;
      });
      setVerificationCode(newCode);
      return;
    }

    // Handle single character input
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      if (value && index < 5) {
        const nextInput = document.querySelector(
          `input[name="code-${index + 1}"]`
        ) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !verificationCode[index]) {
      e.preventDefault();
      if (index > 0) {
        const prevInput = document.querySelector(
          `input[name="code-${index - 1}"]`
        ) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          const newCode = [...verificationCode];
          newCode[index - 1] = "";
          setVerificationCode(newCode);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otp = verificationCode.join("");
    if (otp.length !== 6) {
      toast.error("Please enter complete verification code");
      return;
    }

    try {
      const response = await verifyOTP({
        email,
        otp: Number(otp),
      }).unwrap();

      if (response.success) {
        toast.success("OTP verification successful!");
        router.push("/auth/login");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.errorSources?.[0]?.message ||
        error?.data?.message ||
        "Verification failed";
      toast.error(errorMessage);
      setVerificationCode(["", "", "", "", "", ""]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="container w-full flex flex-col md:flex-row overflow-hidden">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2 p-6">
          <CustomImage
            src={verifyEmailImage.src}
            alt="Email Verification Illustration"
            className="w-full h-auto"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← Back
            </Link>
          </div>

          <h1 className="text-[32px] font-medium leading-[126%] tracking-[-0.96px] heading_color mb-6">
            Verify OTP
          </h1>

          <p className="text-sm text-gray-600 mb-8">
            We sent a verification code to {email}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex justify-center gap-4">
              {verificationCode.map((code, index) => (
                <input
                  key={index}
                  type="text"
                  name={`code-${index}`}
                  maxLength={1}
                  className="w-12 h-12 text-center border border-[#20B894] rounded-lg text-xl focus:outline-none focus:border-[#20B894] focus:ring-1 focus:ring-[#20B894]"
                  value={code}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedData = e.clipboardData.getData("text");
                    handleCodeChange(index, pastedData);
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full primary_color hover:opacity-90 text-white py-2 rounded-full font-medium transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Verifying..."
              ) : (
                <>
                  Verify OTP
                  <MoveUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-500">
            Didn't receive the code?{" "}
            <button className="text-[#20B894] hover:underline">
              Click to resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordOTPVerify() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordOTPVerifyContent />
    </Suspense>
  );
}
