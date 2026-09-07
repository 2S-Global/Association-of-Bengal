"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Smartphone, 
  Loader2, 
  CheckCircle2, 
  Check, 
  ArrowRight, 
  Clock, 
  Fingerprint, 
  LogOut 
} from "lucide-react";
import { useRouter } from "next/navigation";

interface VerificationStepProps {
  apiBase: string;
  authToken: string;
  mobile: string;
  identificationNumber: string;
  onVerified: () => void;
}

export default function VerificationStep({ 
  apiBase, 
  authToken, 
  mobile, 
  identificationNumber, 
  onVerified 
}: VerificationStepProps) {
  const router = useRouter();
  
  // Mobile verification states
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileSent, setMobileSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [loadingMobile, setLoadingMobile] = useState(false);

  // ID verification states
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [aadhaarRequestId, setAadhaarRequestId] = useState("");
  const [aadhaarSent, setAadhaarSent] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [loadingAadhaar, setLoadingAadhaar] = useState(false);

  // Completion & Finalization states
  const [finalizing, setFinalizing] = useState(false);
  const [verificationCompleted, setVerificationCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken || localStorage.getItem("token") || ""}`,
  });

  // Masking helpers for display
  const maskedMobile = mobile ? `******${mobile.slice(-4)}` : "******7426";
  const maskedAadhaar = identificationNumber && identificationNumber.length === 12 
    ? `XXXX XXXX ${identificationNumber.slice(-4)}` 
    : "XXXX XXXX 9473";

  // --- Mobile Verification Handlers ---
  const handleSendMobileOtp = async () => {
    setLoadingMobile(true);
    setErrorMessage("");
    try {
      const res = await fetch(`${apiBase}/verification/mobile/send-otp`, {
        method: "POST",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send mobile OTP");
      setMobileSent(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoadingMobile(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (mobileOtp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoadingMobile(true);
    setErrorMessage("");
    try {
      const res = await fetch(`${apiBase}/verification/mobile/verify-otp`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ otp: mobileOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid mobile OTP");
      setMobileVerified(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoadingMobile(false);
    }
  };

  // --- ID Verification Handlers ---
  const handleSendAadhaarOtp = async () => {
    if (!identificationNumber || identificationNumber.length !== 12) {
      setErrorMessage("Invalid 12-digit identification number found from profile setup.");
      return;
    }
    setLoadingAadhaar(true);
    setErrorMessage("");
    try {
      const res = await fetch(`${apiBase}/verification/aadhaar/send-otp`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ aadhaarNumber: identificationNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send ID verification OTP");
      setAadhaarRequestId(data.data?.requestId || data.requestId || "");
      setAadhaarSent(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoadingAadhaar(false);
    }
  };

  const handleVerifyAadhaarOtp = async () => {
    if (aadhaarOtp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit verification code.");
      return;
    }
    setLoadingAadhaar(true);
    setErrorMessage("");
    try {
      const res = await fetch(`${apiBase}/verification/aadhaar/verify-otp`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ otp: aadhaarOtp, requestId: aadhaarRequestId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Identification verification failed");
      setAadhaarVerified(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoadingAadhaar(false);
    }
  };

  // --- Finalize Verification & Submission ---
  const handleCompleteVerification = async () => {
    setFinalizing(true);
    setErrorMessage("");
    try {
      const res = await fetch(`${apiBase}/verification/complete`, {
        method: "POST",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to complete verification process");
      
      setVerificationCompleted(true);
      onVerified();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setFinalizing(false);
    }
  };

  // =========================================================================
  // UI: UNIFIED COMPLETION VIEW
  // =========================================================================
  if (verificationCompleted) {
    return (
      <div className="space-y-6 max-w-lg mx-auto pb-6 animate-in fade-in duration-300">
        <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-[#2e7d32] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-[#1b5e20]">KYC Verification Completed</h4>
            <p className="text-xs text-[#2e7d32] leading-relaxed">
              Your KYC is complete. Your account is now pending admin approval.
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-[#2e7d32]/30 rounded-3xl p-6 shadow-md text-center space-y-4">
          <div className="w-14 h-14 bg-[#2e7d32] text-white rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
              Verification Successful!
            </h4>
            <p className="text-xs text-[#584141] max-w-xs mx-auto leading-relaxed">
              All your identity credentials have been successfully validated and recorded.
            </p>
          </div>

          <div className="bg-[#fbf2ed] border border-[#e0bfbf]/60 rounded-2xl p-3.5 space-y-2 text-left text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#584141]">Mobile Number ({maskedMobile})</span>
              <span className="text-green-700 font-bold flex items-center gap-1">✓ Verified</span>
            </div>
            <div className="flex justify-between items-center border-t border-[#e0bfbf]/40 pt-2">
              <span className="font-semibold text-[#584141]">Aadhaar ID ({maskedAadhaar})</span>
              <span className="text-green-700 font-bold flex items-center gap-1">✓ Verified</span>
            </div>
          </div>

          <div className="bg-[#fff9e6] border border-[#ffe0b2] rounded-2xl p-4 text-left space-y-1.5">
            <div className="flex items-center gap-2 text-[#b7791f]">
              <Clock className="w-4 h-4 shrink-0" />
              <h5 className="text-xs font-bold">Awaiting Admin Approval</h5>
            </div>
            <p className="text-[11px] text-[#584141] leading-relaxed">
              Your registration is under review. You will receive access to your member dashboard once an administrator approves your account (typically 1–2 business days).
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full py-3 bg-[#570013] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#800020] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Back to Login
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // UI: SINGLE PAGE SCROLLING FLOW (NO TABS)
  // =========================================================================
  return (
    <div className="space-y-6 max-w-xl mx-auto pb-6 animate-in fade-in duration-300">
      <div className="text-center sm:text-left space-y-1">
        <h4 className="text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
          Identity Verification
        </h4>
        <p className="text-xs text-[#584141]">
          Please complete both mobile and ID verifications below to activate your membership profile.
        </p>
      </div>

      {/* Section 1: Mobile Verification Card */}
      <div className="bg-white border border-[#e0bfbf]/60 p-5 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] text-[#570013] flex items-center justify-center shrink-0 border border-[#e0bfbf]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#570013] uppercase tracking-wider">1. Mobile Number Verification</h5>
              <p className="text-[11px] text-[#775a19]">Registered: <span className="font-semibold">{maskedMobile}</span></p>
            </div>
          </div>
          {mobileVerified && (
            <span className="text-xs text-green-700 font-bold flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
              <CheckCircle2 className="w-4 h-4" /> Verified
            </span>
          )}
        </div>

        {!mobileVerified ? (
          <div className="space-y-3 pt-2 border-t border-[#e0bfbf]/40">
            {!mobileSent ? (
              <button
                type="button"
                disabled={loadingMobile}
                onClick={handleSendMobileOtp}
                className="w-full py-2.5 bg-[#570013] text-white text-xs font-semibold rounded-xl hover:bg-[#800020] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {loadingMobile ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Verification Code via SMS"}
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={mobileOtp}
                  onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit OTP code"
                  maxLength={6}
                  className="w-full text-center tracking-widest py-2.5 border border-[#e0bfbf] rounded-xl text-sm font-semibold outline-none focus:border-[#570013] bg-gray-50"
                />
                <button
                  type="button"
                  disabled={loadingMobile || mobileOtp.length !== 6}
                  onClick={handleVerifyMobileOtp}
                  className="w-full py-2.5 bg-[#775a19] text-white text-xs font-semibold rounded-xl hover:bg-[#5e4412] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {loadingMobile ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Mobile Code"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-green-700 font-medium pt-1">Mobile verification successfully completed.</p>
        )}
      </div>

      {/* Section 2: ID Verification Card */}
      <div className="bg-white border border-[#e0bfbf]/60 p-5 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] text-[#570013] flex items-center justify-center shrink-0 border border-[#e0bfbf]">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#570013] uppercase tracking-wider">2. Government ID Verification</h5>
              <p className="text-[11px] text-[#775a19]">Aadhaar: <span className="font-mono font-semibold">{maskedAadhaar}</span></p>
            </div>
          </div>
          {aadhaarVerified && (
            <span className="text-xs text-green-700 font-bold flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
              <CheckCircle2 className="w-4 h-4" /> Verified
            </span>
          )}
        </div>

        {!aadhaarVerified ? (
          <div className="space-y-3 pt-2 border-t border-[#e0bfbf]/40">
            {!aadhaarSent ? (
              <button
                type="button"
                disabled={loadingAadhaar}
                onClick={handleSendAadhaarOtp}
                className="w-full py-2.5 bg-[#570013] text-white text-xs font-semibold rounded-xl hover:bg-[#800020] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {loadingAadhaar ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send ID Verification OTP"}
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={aadhaarOtp}
                  onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit ID verification OTP"
                  maxLength={6}
                  className="w-full text-center tracking-widest py-2.5 border border-[#e0bfbf] rounded-xl text-sm font-semibold outline-none focus:border-[#570013] bg-gray-50"
                />
                <button
                  type="button"
                  disabled={loadingAadhaar || aadhaarOtp.length !== 6}
                  onClick={handleVerifyAadhaarOtp}
                  className="w-full py-2.5 bg-[#775a19] text-white text-xs font-semibold rounded-xl hover:bg-[#5e4412] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {loadingAadhaar ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm ID Security Code"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-green-700 font-medium pt-1">ID verification successfully completed.</p>
        )}
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-xs text-red-600 font-semibold">{errorMessage}</p>
        </div>
      )}

      {/* Finalize Button (Appears only when both are verified) */}
      {mobileVerified && aadhaarVerified && (
        <div className="pt-2 animate-in fade-in duration-300">
          <button
            type="button"
            disabled={finalizing}
            onClick={handleCompleteVerification}
            className="w-full py-3 bg-green-700 text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl hover:bg-green-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {finalizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Finalize & Submit for Review <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
      )}
    </div>
  );
}