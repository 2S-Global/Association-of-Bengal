"use client";

import React, { useState } from "react";
import { Smartphone, Loader2 } from "lucide-react";

interface OtpStepProps {
  mobile: string;
  otpCode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerified: () => void;
  error?: string;
}

export default function OtpStep({ mobile, otpCode, onChange, onVerified, error }: OtpStepProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSendMobileOtp = () => {
    if (!mobile || mobile.length < 10) {
      setLocalError("Mobile number is missing or invalid.");
      return;
    }
    setLocalError("");
    setOtpSent(true);
  };

  const handleVerifyMobileOtp = () => {
    if (!otpCode || otpCode.length < 4) {
      setLocalError("Please enter a valid mobile OTP code.");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerifiedSuccess(true);
      onVerified();
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-[#fbf2ed] p-4 rounded-2xl border border-[#e0bfbf]">
        <Smartphone className="w-8 h-8 text-[#570013] shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-[#570013]">Mobile Number Verification</h4>
          <p className="text-xs text-[#775a19] mt-0.5">Verify ownership of your registered contact mobile number.</p>
        </div>
      </div>

      {verifiedSuccess ? (
        <div className="bg-green-50 border border-green-300 p-4 rounded-xl text-center text-green-900 font-bold text-xs">
          ✓ Mobile Number Successfully Verified via OTP!
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
                className="flex-1 bg-gray-100 border border-[#e0bfbf] p-3 rounded-xl text-sm font-medium text-gray-700 cursor-not-allowed"
              />
              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendMobileOtp}
                  className="bg-[#570013] text-white text-xs font-bold px-4 rounded-xl hover:bg-[#800020] transition-all cursor-pointer"
                >
                  Send OTP
                </button>
              )}
            </div>
          </div>

          {otpSent && (
            <div>
              <label className="block text-xs font-bold text-[#584141] uppercase tracking-wider mb-1.5">
                Enter Mobile OTP <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="otpCode"
                  value={otpCode}
                  onChange={onChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="flex-1 bg-white border border-[#e0bfbf] p-3 rounded-xl text-sm font-medium tracking-widest text-center focus:outline-none"
                />
                <button
                  type="button"
                  disabled={verifying}
                  onClick={handleVerifyMobileOtp}
                  className="bg-green-700 text-white text-xs font-bold px-5 rounded-xl hover:bg-green-800 transition-all cursor-pointer flex items-center justify-center gap-1 min-w-[100px]"
                >
                  {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify OTP"}
                </button>
              </div>
            </div>
          )}

          {(error || localError) && (
            <p className="text-xs text-red-600 font-semibold">{error || localError}</p>
          )}
        </div>
      )}
    </div>
  );
}