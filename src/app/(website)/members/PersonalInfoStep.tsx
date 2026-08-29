"use client";

import React from "react";
import { User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface PersonalInfoStepProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PersonalInfoStep({
  formData,
  onChange,
  errors,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}: PersonalInfoStepProps) {
  return (
    <div className="space-y-3.5 sm:space-y-4 animate-in fade-in duration-300">
      <div className="space-y-1">
        <label className="block text-[11px] uppercase tracking-wider font-bold text-[#570013]">
          Full Name <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            placeholder="Enter your full name"
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30 shadow-sm"
            required
          />
        </div>
        {errors.fullName && <p className="text-[11px] text-red-500">{errors.fullName}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] uppercase tracking-wider font-bold text-[#570013]">
          Mobile Number <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={onChange}
            placeholder="+91 98765 43210"
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30 shadow-sm"
            required
          />
        </div>
        {errors.mobile && <p className="text-[11px] text-red-500">{errors.mobile}</p>}
      </div>

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
            onChange={onChange}
            placeholder="name@example.com"
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30 shadow-sm"
            required
          />
        </div>
        {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] uppercase tracking-wider font-bold text-[#570013]">
          Password <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onChange}
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

      <div className="space-y-1">
        <label className="block text-[11px] uppercase tracking-wider font-bold text-[#570013]">
          Confirm Password <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            placeholder="••••••••"
            className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30 shadow-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c7071] hover:text-[#570013] transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-[11px] text-red-500">{errors.confirmPassword}</p>}
      </div>
    </div>
  );
}