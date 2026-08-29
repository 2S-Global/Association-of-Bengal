"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2, ShieldCheck, FileText } from "lucide-react";

interface TermsStepProps {
  apiBase: string;
  agreedToTerms: boolean;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function TermsStep({
  apiBase,
  agreedToTerms,
  onCheckboxChange,
  error,
}: TermsStepProps) {
  const [termsSections, setTermsSections] = useState<any[]>([]);
  const [isLoadingTerms, setIsLoadingTerms] = useState(false);

  useEffect(() => {
    const fetchTerms = async () => {
      setIsLoadingTerms(true);
      try {
        const res = await fetch(`${apiBase}/terms-conditions`);
        const json = await res.json();
        
        if (res.ok && json.success && json.data?.sections) {
          const mappedSections = json.data.sections.map((sec: any, idx: number) => ({
            id: sec._id || `section-${idx}`,
            icon: idx === 0 ? CheckCircle2 : idx === 1 ? ShieldCheck : FileText,
            title: sec.title || "Terms & Conditions",
            paragraphs: Array.isArray(sec.content) ? sec.content : [sec.content],
            bullets: Array.isArray(sec.bullets) && sec.bullets.length > 0 ? sec.bullets : undefined,
          }));
          setTermsSections(mappedSections);
        }
      } catch (err) {
        setTermsSections([]);
      } finally {
        setIsLoadingTerms(false);
      }
    };
    fetchTerms();
  }, [apiBase]);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="space-y-1 text-center">
        <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
          Membership Registration Terms & Conditions
        </h4>
        <p className="text-[12px] text-[#584141]">
          Please review our policies and agreements before proceeding.
        </p>
      </div>

      {isLoadingTerms ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#570013]" />
          <p className="text-[12px] text-[#584141]">Loading terms and conditions...</p>
        </div>
      ) : (
        <div className="space-y-3.5 max-h-[240px] sm:max-h-[280px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#e0bfbf] [&::-webkit-scrollbar-thumb]:rounded-full pr-1.5">
          {termsSections.length === 0 ? (
            <p className="text-center text-[12px] text-[#584141] py-6">No terms and conditions found.</p>
          ) : (
            termsSections.map((term, idx) => {
              const IconComponent = term.icon || FileText;
              return (
                <div
                  key={term.id || idx}
                  className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e0bfbf]/70 shadow-sm space-y-2"
                >
                  <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px]">
                    <IconComponent className="w-4 h-4 text-[#775a19] shrink-0" />
                    <span>{term.title}</span>
                  </div>

                  {term.paragraphs?.map((text: string, index: number) => (
                    <p key={index} className="text-[12px] text-[#584141] leading-relaxed">
                      {text}
                    </p>
                  ))}

                  {term.bullets && term.bullets.length > 0 && (
                    <ul className="list-disc pl-5 text-[12px] text-[#584141] space-y-1">
                      {term.bullets.map((bullet: string, index: number) => (
                        <li key={index}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      <div className="space-y-1">
        <label className="flex items-start gap-3 cursor-pointer pt-2 bg-[#fbf2ed] p-3 rounded-xl border border-[#e0bfbf] shadow-sm">
          <input
            type="checkbox"
            name="agreedToTerms"
            checked={agreedToTerms}
            onChange={onCheckboxChange}
            className="w-4 h-4 mt-0.5 rounded border-[#e0bfbf] text-[#570013] focus:ring-[#570013] shrink-0"
          />
          <span className="text-[11px] sm:text-[12px] text-[#570013] font-bold leading-tight">
            I agree to the Membership Terms, Privacy Policy, and Code of Conduct. <span className="text-red-600">*</span>
          </span>
        </label>
        {error && <p className="text-[11px] text-red-500 font-medium pl-1">{error}</p>}
      </div>
    </div>
  );
}