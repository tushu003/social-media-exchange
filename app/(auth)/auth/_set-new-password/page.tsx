'use client';

import { useState } from 'react';
import Link from 'next/link';
import CustomImage from '@/components/reusable/CustomImage';
import resetPasswordImage from "@/public/login.png";
import { MoveUpRight, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function SetNewPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const validatePassword = (password: string) => {
    const conditions = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      lowercase: /[a-z]/.test(password),
    };
    return conditions;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isPasswordValid = (conditions: ReturnType<typeof validatePassword>) => {
    return Object.values(conditions).every(condition => condition);
  };

  // Add this state to track if form was submitted
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    
    const conditions = validatePassword(formData.password);
    
    if (!isPasswordValid(conditions)) {
      toast.error("Password doesn't meet all requirements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Password reset failed');
      }

      toast.success('Password reset successful');
      router.push('/auth/login');
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordConditions = validatePassword(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="container w-full flex flex-col md:flex-row overflow-hidden">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2 p-6">
          <CustomImage src={resetPasswordImage.src} alt="Reset Password Illustration" className="w-full h-auto" />
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
            Set new password
          </h1>

          <p className="text-sm text-gray-600 mb-8">
            Your new password must be different from previously used passwords.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Password Field */}
            <div>
              <label className="text-sm text-black block mb-2">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
              
              {/* Password Requirements - Only show after submission attempt */}
              {hasAttemptedSubmit && (
                <div className="mt-2 space-y-1">
                  <p className={`text-xs ${passwordConditions.length ? 'text-green-500' : 'text-gray-500'}`}>
                    • 8 characters
                  </p>
                  <p className={`text-xs ${passwordConditions.uppercase ? 'text-green-500' : 'text-gray-500'}`}>
                    • Uppercase letter (A-Z)
                  </p>
                  <p className={`text-xs ${passwordConditions.number ? 'text-green-500' : 'text-gray-500'}`}>
                    • Number (0-9)
                  </p>
                  <p className={`text-xs ${passwordConditions.lowercase ? 'text-green-500' : 'text-gray-500'}`}>
                    • Lowercase letter (a-z)
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="text-sm text-black block mb-2">
                Confirm Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full primary_color hover:opacity-90 text-white py-2 rounded-full font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  Reset password
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
