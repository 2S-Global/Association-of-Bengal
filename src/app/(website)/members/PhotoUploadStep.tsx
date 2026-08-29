"use client";

import React from "react";
import { Upload } from "lucide-react";

interface PhotoUploadStepProps {
  photo: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkip: () => void;
  error?: string;
}

export default function PhotoUploadStep({
  photo,
  onFileChange,
  onSkip,
  error,
}: PhotoUploadStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 py-2 sm:py-4 text-center">
      <div className="space-y-1 text-left">
        <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
          Upload Profile Photograph (Optional)
        </h4>
        <p className="text-[12px] sm:text-[13px] text-[#584141]">
          Please upload a clear passport-size photograph for your verified digital ID card, or skip to complete it later.
        </p>
        {error && <p className="text-[11px] text-red-500">{error}</p>}
      </div>

      <div className="space-y-1">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#e0bfbf] hover:border-[#570013] rounded-2xl p-6 sm:p-10 bg-white/75 cursor-pointer transition-all group shadow-sm">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fbf2ed] flex items-center justify-center text-[#775a19] group-hover:scale-110 transition-transform mb-3 shadow-inner">
            <Upload className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <p className="text-[13px] sm:text-[14px] font-semibold text-[#570013] text-center px-2">
            {photo ? photo.name : "Click to browse or drag photo here"}
          </p>
          <p className="text-[11px] text-[#8c7071] mt-1">SVG, PNG, JPG or WEBP (Max 5MB)</p>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="text-right">
        <button
          type="button"
          onClick={onSkip}
          className="text-[12px] font-semibold text-[#775a19] hover:underline"
        >
          Skip for now →
        </button>
      </div>
    </div>
  );
}