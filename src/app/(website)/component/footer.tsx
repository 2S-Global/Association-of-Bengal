import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#f5ece7] border-t border-[#e0bfbf]/60 w-full font-['Libre_Franklin'] overflow-hidden text-[#1e1b18]">
      {/* Decorative background accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#fed488]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Reduced vertical padding to make the footer compact */}
      <div className="relative z-10 max-w-[1280px] mx-auto grid grid-cols-1 gap-8 px-6 py-8 sm:px-8 md:grid-cols-2 lg:py-10 items-center">

        {/* Brand / About Section (Increased Font Sizes) */}
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="relative w-[52px] h-[52px] lg:w-[60px] lg:h-[60px] shrink-0 bg-transparent overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]">
              <Image
                src="/images/Logo2.jpg"
                alt="Bengal Association Logo"
                fill
                priority
                sizes="60px"
                className="object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span
                className="
                  font-['Playfair_Display']
                  font-bold
                  text-[19px]
                  lg:text-[22px]
                  leading-[25px]
                  tracking-[-0.01em]
                  text-[#570013]
                  whitespace-nowrap
                "
              >
                ASSOCIATION OF BENGAL
              </span>
              <span
                className="
                  text-[10.5px]
                  lg:text-[11.5px]
                  font-bold
                  text-[#775a19]
                  tracking-[0.12em]
                  uppercase
                  mt-0.5
                  font-['Libre_Franklin']
                  whitespace-nowrap
                "
              >
                FOR LITERATURE AND CULTURE
              </span>
            </div>
          </Link>

          <p className="text-sm leading-relaxed text-[#584141] max-w-md">
            Promoting literature, art, and local culture through organized exhibitions, grand book fairs, and cultural meets since 1954 across West Bengal.
          </p>

          <div>
            <span className="inline-flex px-3 py-0.5 rounded-full bg-[#ffdea5] text-[#5d4201] text-[10.5px] font-bold uppercase tracking-wider shadow-xs">
              Registered & Certified
            </span>
          </div>
        </div>

        {/* Connect & Address (Increased Font Sizes) */}
        <div className="space-y-3 md:pl-8 lg:pl-16">
          <h4
            className="text-sm font-bold uppercase tracking-[0.15em]"
            style={{ color: "#590916" }}
          >
            Connect With Us
          </h4>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-[#584141] text-sm leading-relaxed">
              <div className="w-8 h-8 rounded-lg bg-[#fed488]/40 flex items-center justify-center text-[#775a19] shrink-0 mt-0.5 border border-[#fed488]">
                <MapPin className="w-4 h-4" />
              </div>
              <span>
                26/2 Surya Sen Street, Kolkata, India, West Bengal
              </span>
            </div>

            <div className="flex items-center gap-3 text-[#584141] text-sm">
              <div className="w-8 h-8 rounded-lg bg-[#fed488]/40 flex items-center justify-center text-[#775a19] shrink-0 border border-[#fed488]">
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
      <div className="border-t border-[#e0bfbf]/40 py-4 px-6 text-center">
        <p className="text-[11.5px] text-[#584141]/80 uppercase tracking-widest">
          © 2026 Association of Bengal. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}