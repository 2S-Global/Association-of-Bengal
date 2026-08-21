"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Upload, CheckCircle2, Loader2, User, Mail, Phone, Lock } from "lucide-react";

interface MembershipApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MembershipApplicationModal({ isOpen, onClose }: MembershipApplicationModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password do not match!");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1b18]/60 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl shadow-[0_20px_50px_-12px_rgba(87,0,19,0.25)] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] cursor-default animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#e0bfbf]/50 bg-gradient-to-r from-[#fbf2ed] to-[#fff8f5]">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl bg-white border border-[#e0bfbf]/60 flex items-center justify-center overflow-hidden shadow-sm">
              <Image 
                src="/images/Logo2.jpg" 
                alt="Association of Bengal Logo"
                fill
                className="object-contain p-1.5"
              />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#570013] font-['Playfair_Display',serif] tracking-tight">
                Association of Bengal  For Literature & Culture
              </h3>
              <p className="text-[11px] text-[#775a19] uppercase tracking-wider font-semibold">
                Membership Application Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8c7071] bg-white/50 hover:bg-[#e9e1dc] hover:text-[#570013] transition-all duration-200 outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar bg-[#fff8f5]">
          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-[#570013]/10 text-[#570013] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-[#570013] font-['Playfair_Display',serif]">
                Application Submitted!
              </h4>
              <p className="text-[14px] text-[#584141] max-w-sm mx-auto">
                Thank you for applying. Your application is now subject to review by the authorized Membership Committee.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="mt-4 px-6 py-2.5 bg-[#570013] text-white text-[13px] font-semibold rounded-lg hover:bg-[#800020] transition-all"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[12px] uppercase tracking-wider font-bold text-[#570013]">
                  Profile Photograph <span className="text-red-600">*</span>
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#e0bfbf] hover:border-[#570013] rounded-xl p-4 bg-white/60 cursor-pointer transition-all group">
                  <div className="flex items-center gap-3 text-[#584141]">
                    <div className="w-9 h-9 rounded-full bg-[#fbf2ed] flex items-center justify-center text-[#775a19] group-hover:scale-110 transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[13px] font-semibold text-[#570013]">
                        {formData.photo ? formData.photo.name : "Upload passport photo"}
                      </p>
                      <p className="text-[11px] text-[#8c7071]">SVG, PNG, JPG or WEBP (Max 5MB)</p>
                    </div>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required />
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[12px] uppercase tracking-wider font-bold text-[#570013]">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full legal name"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#e0bfbf] rounded-xl text-[14px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[12px] uppercase tracking-wider font-bold text-[#570013]">
                  Mobile Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#e0bfbf] rounded-xl text-[14px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[12px] uppercase tracking-wider font-bold text-[#570013]">
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
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#e0bfbf] rounded-xl text-[14px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[12px] uppercase tracking-wider font-bold text-[#570013]">
                  Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#e0bfbf] rounded-xl text-[14px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[12px] uppercase tracking-wider font-bold text-[#570013]">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#e0bfbf] rounded-xl text-[14px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3.5 bg-[#570013] text-white text-[13px] font-semibold tracking-wider uppercase rounded-xl hover:bg-[#800020] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
                  </>
                ) : (
                  "Submit Membership Application"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}