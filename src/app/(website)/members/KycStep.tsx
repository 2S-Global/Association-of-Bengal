"use client";

import React from "react";
import { 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Fingerprint,
  CreditCard 
} from "lucide-react";

interface KycVerificationStepProps {
  mobile: string;
  identificationNumber: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onProceed: () => void;
  kycFees?: {
    mobile: number;
    aadhar: number;
    currencySymbol: string;
  };
  error?: string;
}

export default function KycVerificationStep({
  mobile,
  identificationNumber,
  onChange,
  onBack,
  onProceed,
  kycFees = { mobile: 15, aadhar: 30, currencySymbol: "₹" },
  error,
}: KycVerificationStepProps) {
  const cleanAadhaar = identificationNumber.replace(/\D/g, "").slice(0, 12);
  const totalKycFee = (kycFees.mobile || 15) + (kycFees.aadhar || 30);

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-6">
      
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#570013] to-[#775a19] p-5 text-white shadow-md">
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#fed488]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold font-['Playfair_Display',serif]">
              Identity Verification
            </h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Mobile & Aadhaar verification are required
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                <CheckCircle2 className="w-3 h-3 text-green-400" /> Mobile OTP
              </span>
              <span className="inline-flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                <CheckCircle2 className="w-3 h-3 text-green-400" /> Aadhaar
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#584141] font-medium px-1">
        Both Mobile OTP and Aadhaar verification are mandatory to complete your registration.
      </p>

      {/* Card 1: Mobile Number Verification */}
      <div className="bg-white border border-[#e0bfbf]/70 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fbf2ed] border border-[#e0bfbf] flex items-center justify-center text-[#570013] shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-[#570013]">Mobile Number Verification</h5>
              <p className="text-[11px] text-[#584141]">6-digit OTP sent to your registered number</p>
            </div>
          </div>
          <span className="bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
            +{kycFees.currencySymbol}{kycFees.mobile} MANDATORY
          </span>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-[#e0bfbf]/30">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#584141]">Registered Mobile Number</span>
            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-green-200">
              <Lock className="w-3 h-3" /> Non-Editable
            </span>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c7071]">
              <Smartphone className="w-4 h-4" />
            </span>
            <input
              type="text"
              readOnly
              value={mobile}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-[#e0bfbf]/60 rounded-xl text-[#570013] font-semibold cursor-not-allowed tracking-wider"
            />
          </div>
          <p className="text-[10px] text-[#8c7071] pt-0.5">
            This number was verified during registration and cannot be changed here.
          </p>
        </div>
      </div>

      {/* Card 2: Aadhaar Verification */}
      <div className="bg-white border border-[#e0bfbf]/70 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fbf2ed] border border-[#e0bfbf] flex items-center justify-center text-[#570013] shrink-0">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-[#570013]">Aadhaar Verification</h5>
              <p className="text-[11px] text-[#584141]">OTP-based via UIDAI Unique Identification Authority</p>
            </div>
          </div>
          <span className="bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
            +{kycFees.currencySymbol}{kycFees.aadhar} MANDATORY
          </span>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-[#e0bfbf]/30">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-[#584141]">Aadhaar Number *</label>
            <span className="text-[10px] font-mono text-gray-500">{cleanAadhaar.length}/12</span>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c7071]">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <input
              type="text"
              name="identificationNumber"
              value={identificationNumber}
              onChange={onChange}
              placeholder="12-digit Aadhaar number"
              maxLength={12}
              inputMode="numeric"
              className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all text-[#570013] font-mono tracking-widest ${
                error
                  ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-[#e0bfbf] focus:border-[#570013] focus:ring-2 focus:ring-[#570013]/20"
              }`}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#8c7071]">
            <span>XXXX XXXX XXXX</span>
            {error && <span className="text-red-500 font-medium">{error}</span>}
          </div>
        </div>
      </div>

      {/* Card 3: Fee Breakdown */}
      <div className="bg-white border border-[#e0bfbf]/70 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#e0bfbf]/40 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#775a19]" />
            <h5 className="text-xs font-bold text-[#570013] uppercase tracking-wider">Fee Breakdown</h5>
          </div>
          <span className="text-[10px] bg-[#fbf2ed] text-[#775a19] font-semibold px-2 py-0.5 rounded-md border border-[#e0bfbf]">
            2 mandatory methods
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-[#584141]">
            <span>Mobile OTP</span>
            <span className="font-semibold">{kycFees.currencySymbol}{kycFees.mobile}.00</span>
          </div>
          <div className="flex justify-between text-[#584141]">
            <span>Aadhaar</span>
            <span className="font-semibold">{kycFees.currencySymbol}{kycFees.aadhar}.00</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#e0bfbf]/40 flex justify-between items-center font-bold text-sm text-[#570013]">
          <span>Total KYC Fee</span>
          <span className="text-base font-['Playfair_Display',serif]">{kycFees.currencySymbol}{totalKycFee}.00</span>
        </div>

        <div className="p-3 bg-[#fbf2ed] rounded-xl border border-[#e0bfbf]/50 text-[11px] text-[#584141] leading-relaxed">
          ℹ️ KYC fees are added to your membership payment. Verification is done only after successful payment.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 bg-white border border-[#e0bfbf] text-[#584141] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#fbf2ed] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          type="button"
          onClick={onProceed}
          className="flex-1 py-3 bg-[#775a19] text-white text-xs font-bold tracking-wider uppercase rounded-xl hover:bg-[#5e4412] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          Proceed to Payment <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}