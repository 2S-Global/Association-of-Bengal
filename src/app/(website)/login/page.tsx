"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn, ArrowRight, ArrowLeft } from "lucide-react";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

export default function LoginPage() {
  const router = useRouter();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "Email address is required.";
    if (!formData.password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid email or password.");

      const token = data.data?.accessToken || data.accessToken || data.token;
      const user = data.data?.user;
      const member = data.data?.member;

      if (token) {
        // Save auth tokens and profile data for use across the dashboard
        localStorage.setItem("token", token);
        localStorage.setItem("accessToken", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));
        if (member) localStorage.setItem("member", JSON.stringify(member));

        // Check if steps are completed or route straight to dashboard
        if (user?.allstep_completed) {
          router.push("/dashboard"); // Route to user dashboard
        } else {
          router.push("/register"); // Fallback if steps are incomplete
        }
      } else {
        throw new Error("Authentication token not received from server.");
      }
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to sign in. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrors({ forgotEmail: "Email address is required for recovery." });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send reset instructions.");

      setSuccessMessage("Password reset instructions have been sent to your email.");
    } catch (error: any) {
      setErrors({ general: error.message || "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 font-['Libre_Franklin',sans-serif]">
      <div className="w-full max-w-md bg-white border border-[#e0bfbf] rounded-3xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0bfbf]/50 bg-gradient-to-r from-[#fbf2ed] via-[#fff8f5] to-[#fbf2ed]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-white border border-[#e0bfbf]/60 flex items-center justify-center overflow-hidden shadow-sm">
              <Image
                src="/images/Logo2.jpg"
                alt="Association of Bengal Logo"
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#570013] font-['Playfair_Display',serif] tracking-tight">
                ASSOCIATION OF BENGAL
              </h3>
              <p className="text-[10px] text-[#775a19] uppercase tracking-wider font-semibold">
                Member Portal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-xs font-semibold text-[#8c7071] hover:text-[#570013] transition-colors"
          >
            Home
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 bg-[#fff8f5]">
          
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
              {errors.general}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl">
              {successMessage}
            </div>
          )}

          {!isForgotPassword ? (
            /* ── LOGIN VIEW ── */
            <>
              <div className="mb-6 space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-[#570013] font-['Playfair_Display',serif]">
                  Welcome Back
                </h2>
                <p className="text-xs text-[#584141]">
                  Enter your credentials to access your fellowship account.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#570013]">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30 shadow-sm"
                      required
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#570013]">
                      Password <span className="text-red-600">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setErrors({});
                        setSuccessMessage("");
                      }}
                      className="text-[11px] font-semibold text-[#775a19] hover:underline outline-none"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30 shadow-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c7071] hover:text-[#570013] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-red-500">{errors.password}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 bg-[#570013] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl hover:bg-[#800020] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 outline-none disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" /> Sign In <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Register Prompt */}
              <div className="text-center pt-6 mt-6 border-t border-[#e0bfbf]/40">
                <p className="text-xs text-[#584141]">
                  Don&apos;t have a membership account yet?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/register")}
                    className="font-bold text-[#570013] hover:underline"
                  >
                    Register Now
                  </button>
                </p>
              </div>
            </>
          ) : (
            /* ── FORGOT PASSWORD VIEW ── */
            <>
              <div className="mb-6 space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-[#570013] font-['Playfair_Display',serif]">
                  Reset Password
                </h2>
                <p className="text-xs text-[#584141]">
                  Enter your registered email address to receive password recovery instructions.
                </p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#570013]">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30 shadow-sm"
                      required
                    />
                  </div>
                  {errors.forgotEmail && <p className="text-[11px] text-red-500">{errors.forgotEmail}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 bg-[#570013] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl hover:bg-[#800020] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 outline-none disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Instructions <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setErrors({});
                    setSuccessMessage("");
                  }}
                  className="w-full py-2.5 bg-white border border-[#e0bfbf] text-[#584141] text-xs font-semibold rounded-xl hover:bg-[#fbf2ed] transition-all flex items-center justify-center gap-1.5 outline-none shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}