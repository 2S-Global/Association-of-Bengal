"use client";

import React from "react";

interface RegionStepProps {
  geographicWings: any[];
  selectedWing: string;
  onSelect: (name: string) => void;
}

export default function RegionStep({
  geographicWings,
  selectedWing,
  onSelect,
}: RegionStepProps) {
  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
          Select Your Region
        </h4>
        <p className="text-[12px] text-[#584141]">
          Choose the geographic wing you belong to for accurate registration.
        </p>
      </div>

      <div className="space-y-3 max-h-[280px] sm:max-h-[320px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#e0bfbf] [&::-webkit-scrollbar-thumb]:rounded-full pr-1.5">
        {geographicWings.map((w, idx) => {
          const isSelected = selectedWing === w.name;
          return (
            <div
              key={idx}
              onClick={() => onSelect(w.name)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                isSelected
                  ? "border-[#570013] bg-[#fbf2ed] ring-1 ring-[#570013]/20"
                  : "border-[#e0bfbf]/70 bg-white hover:border-[#775a19]/40"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="text-2xl sm:text-3xl shrink-0">{w.flag}</span>
                <div className="min-w-0">
                  <h5 className="font-bold text-[#570013] text-[13px] sm:text-[14px] truncate">
                    {w.name}
                  </h5>
                  <p className="text-[11px] sm:text-[12px] text-[#775a19] truncate">{w.desc}</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  isSelected ? "border-[#570013] bg-[#570013]" : "border-[#e0bfbf]"
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}