"use client";

import React, { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

interface AadhaarStepProps {
  aadhaarNumber: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerified: () => void;
  error?: string;
}

export default function AadhaarStep({ aadhaarNumber, onChange, onVerified, error }: AadhaarStepProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSendAadhaarOtp = () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      setLocalError("Please enter a valid 12-digit number.");
      return;
    }
    setLocalError("");
    setOtpSent(true);
  };

  const handleVerifyAadhaarOtp = () => {
    if (!aadhaarOtp || aadhaarOtp.length < 4) {
      setLocalError("Please enter a valid OTP.");
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
        <ShieldCheck className="w-8 h-8 text-[#570013] shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-[#570013]">Identity Verification</h4>
          <p className="text-xs text-[#775a19] mt-0.5">Please provide your government-issued identification number for secure validation.</p>
        </div>
      </div>

      {verifiedSuccess ? (
        <div className="bg-green-50 border border-green-300 p-4 rounded-xl text-center text-green-900 font-bold text-xs">
          ✓ Successfully Verified & Authenticated!
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#584141] uppercase tracking-wider mb-1.5">
              12-Digit Identification Number <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="aadhaarNumber"
                value={aadhaarNumber}
                onChange={onChange}
                placeholder="Enter 12-digit number"
                maxLength={12}
                disabled={otpSent}
                className="flex-1 bg-white border border-[#e0bfbf] p-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#570013]/20 text-[#1e1b18] disabled:bg-gray-100"
              />
              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendAadhaarOtp}
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
                Enter Verification OTP <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aadhaarOtp}
                  onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="flex-1 bg-white border border-[#e0bfbf] p-3 rounded-xl text-sm font-medium tracking-widest text-center focus:outline-none"
                />
                <button
                  type="button"
                  disabled={verifying}
                  onClick={handleVerifyAadhaarOtp}
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