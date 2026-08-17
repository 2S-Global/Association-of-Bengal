import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#f5ece7] border-t border-[#e0bfbf]/60 w-full font-['Libre_Franklin'] overflow-hidden text-[#1e1b18]">
      {/* Decorative background accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#fed488]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto grid grid-cols-1 gap-10 px-6 py-12 sm:px-8 md:grid-cols-2 lg:py-16">

        {/* Brand / About Section */}
        <div className="space-y-4">
          <div
            className="font-['Playfair_Display'] text-xl font-bold tracking-wide leading-snug sm:text-2xl"
            style={{ color: "#590916" }}
          >
            ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
          </div>

          <p className="text-sm leading-relaxed text-[#584141] max-w-md">
            Promoting literature, art, and local culture through organized exhibitions, grand book fairs, and cultural meets since 1954 across West Bengal.
          </p>

          <div className="pt-2">
            <span className="inline-flex px-3 py-1 rounded-full bg-[#ffdea5] text-[#5d4201] text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Registered & Certified
            </span>
          </div>
        </div>

        {/* Connect & Address */}
        <div className="space-y-4 md:pl-8 lg:pl-16">
          <h4
            className="text-xs font-bold uppercase tracking-[0.15em]"
            style={{ color: "#590916" }}
          >
            Connect With Us
          </h4>

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-[#584141] text-sm leading-relaxed">
              <div className="w-8 h-8 rounded-xl bg-[#fed488]/40 flex items-center justify-center text-[#775a19] shrink-0 mt-0.5 border border-[#fed488]">
                <MapPin className="w-4 h-4" />
              </div>
              <span>
                26/2 Surya Sen Street, Kolkata, India, West Bengal
              </span>
            </div>

            <div className="flex items-center gap-3 text-[#584141] text-sm">
              <div className="w-8 h-8 rounded-xl bg-[#fed488]/40 flex items-center justify-center text-[#775a19] shrink-0 border border-[#fed488]">
                <Mail className="w-4 h-4" />
              </div>
              <a 
                href="mailto:bengalassociation2026@gmail.com" 
                className="hover:text-[#590916] transition-colors font-medium break-all underline underline-offset-4"
              >
                bengalassociation2026@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#e0bfbf]/40 py-6 px-6 text-center">
        <p className="text-[11px] text-[#584141]/80 uppercase tracking-widest">
          © 2026 Association of Bengal. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}