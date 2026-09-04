"use client";

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Loader2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OtpStepProps {
  mobile: string;
  otpCode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerified: () => void;
  error?: string;
}

export default function OtpStep({
  mobile,
  otpCode,
  onChange,
  onVerified,
  error,
}: OtpStepProps) {
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Resend countdown timer state (30 seconds)
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token");

  const handleSendMobileOtp = async () => {
    if (!mobile || mobile.length < 10) {
      setLocalError("Mobile number is missing or invalid.");
      return;
    }

    setIsSending(true);
    setLocalError("");
    setSuccessMessage("");

    const token = getToken();

    try {
      const res = await fetch(
        `/api/verification/mobile/send-otp?mobile=${encodeURIComponent(mobile)}`,
        {
          method: "GET",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setSuccessMessage(
          data.message || "OTP sent successfully to your mobile number.",
        );
        setCountdown(30); // Start 30s cooldown for resend
      } else {
        setLocalError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setLocalError("Network error occurred while sending OTP.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      setLocalError("Please enter a valid 6-digit OTP code.");
      return;
    }

    setVerifying(true);
    setLocalError("");
    setSuccessMessage("");

    const token = getToken();

    try {
      const res = await fetch(
        `/api/verification/mobile/verify-otp?mobile=${encodeURIComponent(mobile)}&otp=${encodeURIComponent(otpCode)}`,
        {
          method: "GET",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        setVerifiedSuccess(true);
        setSuccessMessage("Your OTP verified successfully!");

        // Hold for 500 milliseconds, then trigger parent callback and redirect home
        setTimeout(() => {
          onVerified();
        }, 1000);
      } else {
        setLocalError(
          data.message || "Invalid OTP code. Please check and try again.",
        );
      }
    } catch (err) {
      setLocalError("Failed to verify OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-[#fbf2ed] p-4 rounded-2xl border border-[#e0bfbf]">
        <Smartphone className="w-8 h-8 text-[#570013] shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-[#570013]">
            Mobile Number Verification
          </h4>
          <p className="text-xs text-[#775a19] mt-0.5">
            Verify ownership of your registered contact mobile number.
          </p>
        </div>
      </div>

      {verifiedSuccess ? (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-center text-emerald-900 font-bold text-xs flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />{" "}
          {successMessage}
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#584141] uppercase tracking-wider mb-1.5">
              Registered Mobile Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={mobile || "Not Provided"}
                disabled
                className="flex-1 bg-gray-50 border border-[#e0bfbf] p-3 rounded-2xl text-xs font-bold text-gray-500 cursor-not-allowed"
              />
              {!otpSent && (
                <button
                  type="button"
                  disabled={isSending}
                  onClick={handleSendMobileOtp}
                  className="bg-[#570013] text-white text-xs font-bold px-5 py-3 rounded-2xl hover:bg-[#40000e] transition-all cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50 shadow-xs"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Send OTP"
                  )}
                </button>
              )}
            </div>
          </div>

          {otpSent && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-[#584141] uppercase tracking-wider">
                    Enter Mobile OTP <span className="text-red-600">*</span>
                  </label>
                  <button
                    type="button"
                    disabled={countdown > 0 || isSending}
                    onClick={handleSendMobileOtp}
                    className="text-[11px] font-bold text-[#775a19] hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {countdown > 0
                      ? `Resend OTP in ${countdown}s`
                      : "Resend OTP"}
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    name="otpCode"
                    value={otpCode}
                    onChange={onChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="flex-1 bg-white border border-[#e0bfbf] p-3 rounded-2xl text-xs font-bold tracking-widest text-center text-[#570013] focus:outline-none focus:border-[#570013]"
                  />
                  <button
                    type="button"
                    disabled={verifying}
                    onClick={handleVerifyMobileOtp}
                    className="bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-2xl hover:bg-emerald-800 transition-all cursor-pointer flex items-center justify-center gap-1 min-w-[110px] shadow-xs disabled:opacity-50"
                  >
                    {verifying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {successMessage && !verifiedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />{" "}
              {successMessage}
            </div>
          )}

          {(error || localError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />{" "}
              {error || localError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
