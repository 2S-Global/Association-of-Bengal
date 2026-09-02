"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Loader2, CheckCircle2, RefreshCw } from "lucide-react";

interface AadhaarStepProps {
  aadhaarNumber: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerified: () => void;
  error?: string;
}

export default function AadhaarStep({
  aadhaarNumber,
  onChange,
  onVerified,
  error,
}: AadhaarStepProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [localError, setLocalError] = useState("");
  
  // Timer state (10 minutes = 600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);
  const [canResend, setCanResend] = useState(false);

  const cleanNumber = aadhaarNumber.replace(/\D/g, "");

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Requesting OTP
  const handleSendOtp = async () => {
    if (cleanNumber.length !== 12) {
      setLocalError("Please enter a valid 12-digit identification number.");
      return;
    }

    setLocalError("");
    setSendingOtp(true);

    try {
      const response = await fetch("/api/verification/aadhaar/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaar: cleanNumber }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send verification code.");
      }

      setOtpSent(true);
      setTimeLeft(600); // Reset timer to 10 mins
      setCanResend(false);
    } catch (err: any) {
      setLocalError(err.message || "Unable to send verification code at this time.");
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle Resending OTP
  const handleResendOtp = async () => {
    setLocalError("");
    setResendingOtp(true);

    try {
      const response = await fetch("/api/verification/aadhaar/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaar: cleanNumber }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to resend verification code.");
      }

      setTimeLeft(600); // Reset timer to 10 mins
      setCanResend(false);
    } catch (err: any) {
      setLocalError(err.message || "Unable to resend verification code at this time.");
    } finally {
      setResendingOtp(false);
    }
  };

  // Handle Verifying OTP
  const handleVerifyOtp = async () => {
    if (aadhaarOtp.length !== 6) {
      setLocalError("Please enter a valid 6-digit verification code.");
      return;
    }

    setLocalError("");
    setVerifying(true);

    try {
      const response = await fetch("/api/verification/aadhaar/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadhaar: cleanNumber,
          otp: aadhaarOtp,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid verification code.");
      }

      setVerifiedSuccess(true);
      onVerified();
    } catch (err: any) {
      setLocalError(err.message || "Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="flex items-center gap-3 bg-[#fbf2ed] p-4 rounded-2xl border border-[#e0bfbf]">
        <ShieldCheck className="w-8 h-8 text-[#570013] shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-[#570013]">Identity Verification</h4>
          <p className="text-xs text-[#775a19] mt-0.5">
            Secure validation via government-issued identification.
          </p>
        </div>
      </div>

      {verifiedSuccess ? (
        <div className="bg-green-50 border border-green-300 p-4 rounded-xl text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="w-7 h-7 text-green-700" />
          </div>
          <p className="text-sm text-green-900 font-bold">Successfully Verified & Authenticated!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Input Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-[#584141] uppercase tracking-wider">
                12-Digit Identification Number <span className="text-red-600">*</span>
              </label>
              <span className="text-[10px] text-gray-500 font-medium">
                {cleanNumber.length}/12 digits
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                name="aadhaarNumber"
                value={aadhaarNumber}
                onChange={onChange}
                placeholder="Enter 12-digit number"
                maxLength={12}
                disabled={otpSent || sendingOtp}
                inputMode="numeric"
                className="flex-1 bg-white border border-[#e0bfbf] p-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#570013]/25 text-[#1e1b18] disabled:bg-gray-100 tracking-wider"
              />

              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || cleanNumber.length !== 12}
                  className="bg-[#570013] text-white text-xs font-bold px-4 rounded-xl hover:bg-[#800020] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                >
                  {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP"}
                </button>
              )}
            </div>
          </div>

          {/* OTP Input Section */}
          {otpSent && (
            <div className="pt-2 animate-in fade-in duration-200 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-[#584141] uppercase tracking-wider">
                    Enter 6-Digit OTP <span className="text-red-600">*</span>
                  </label>
                  <span className="text-xs font-semibold text-[#775a19]">
                    Valid for: <span className="font-mono">{formatTime(timeLeft)}</span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aadhaarOtp}
                    onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter OTP"
                    maxLength={6}
                    inputMode="numeric"
                    className="flex-1 bg-white border border-[#e0bfbf] p-3 rounded-xl text-sm font-medium tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#570013]/25 text-[#1e1b18]"
                  />

                  <button
                    type="button"
                    disabled={verifying || aadhaarOtp.length !== 6}
                    onClick={handleVerifyOtp}
                    className="bg-green-700 text-white text-xs font-bold px-5 rounded-xl hover:bg-green-800 transition-all cursor-pointer flex items-center justify-center gap-1 min-w-[110px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify OTP"}
                  </button>
                </div>
              </div>

              {/* Resend Option */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#584141]">Didn't receive the code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || resendingOtp}
                  className="font-bold text-[#570013] hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer flex items-center gap-1"
                >
                  {resendingOtp ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  {canResend ? "Resend OTP" : `Resend in ${formatTime(timeLeft)}`}
                </button>
              </div>
            </div>
          )}

          {/* Error Message Display */}
          {(error || localError) && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <p className="text-xs text-red-600 font-semibold">{error || localError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}