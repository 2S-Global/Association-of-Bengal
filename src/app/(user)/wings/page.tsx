"use client";

import React, { useEffect, useState } from "react";
import { 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  RefreshCw 
} from "lucide-react";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

interface WingsApiResponse {
  success: boolean;
  message: string;
  data: {
    wings: string[];
  };
}

export default function CurrentWingsPage() {
  const [wings, setWings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        "";

      const response = await fetch(`${API_BASE}/auth/current-wing`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result: WingsApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch current wings.");
      }

      setWings(result.data?.wings || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWings();
  }, []);

  return (
    <div className="min-h-[320px] bg-white border border-[#e0bfbf] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between font-['Playfair_Display',serif]">
      <div className="space-y-6">
        {/* Header with React Icons */}
        <div className="flex items-center justify-between border-b border-[#e0bfbf]/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fbf2ed] border border-[#e0bfbf]/60 flex items-center justify-center text-[#570013] shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#570013]">
                Your Active Membership Wings
              </h3>
              <p className="text-xs text-[#8c7071] font-sans mt-0.5">
                Categories and literary divisions you are currently enrolled in.
              </p>
            </div>
          </div>
          
          <button
            onClick={fetchWings}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white border border-[#e0bfbf] text-[#570013] hover:bg-[#fbf2ed] transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            title="Refresh Wings"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-3 font-sans">
            <Loader2 className="w-6 h-6 animate-spin text-[#570013]" />
            <p className="text-xs text-[#8c7071]">Fetching your assigned wings...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 font-sans">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <div className="text-xs">
              <span className="font-bold">Error loading wings: </span>
              {error}
            </div>
          </div>
        )}

        {/* Success / Empty State */}
        {!isLoading && !error && (
          <div className="space-y-3 font-sans">
            {wings.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {wings.map((wing, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-[#fbf2ed] border border-[#e0bfbf] text-[#570013] text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-transform hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#775a19]" />
                    <span>{wing}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 space-y-2 bg-[#fff8f5] rounded-2xl border border-dashed border-[#e0bfbf]">
                <Layers className="w-8 h-8 text-[#8c7071] mx-auto mb-1 opacity-60" />
                <p className="text-xs font-semibold text-[#570013]">
                  No Wings Assigned
                </p>
                <p className="text-[11px] text-[#8c7071] max-w-xs mx-auto">
                  You haven&apos;t selected any membership wings yet. Update your profile preferences to join a wing.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-6 mt-6 border-t border-[#e0bfbf]/30 text-[11px] text-[#8c7071] font-sans flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1b5e20]" />
          Verified Membership Portal
        </span>
        <span className="text-[#775a19] font-semibold">Live Sync</span>
      </div>
    </div>
  );
}