// import Link from "next/link";
// import { Mail, MapPin } from "lucide-react";

// export default function Footer() {
//   return (
//     <footer className="relative bg-[#f5ece7] border-t border-[#e0bfbf]/60 w-full font-['Libre_Franklin'] overflow-hidden text-[#1e1b18]">
//       {/* Decorative background accents */}
//       <div className="absolute top-0 right-0 w-64 h-64 bg-[#fed488]/10 rounded-full blur-3xl pointer-events-none" />

//       <div className="relative z-10 max-w-[1280px] mx-auto grid grid-cols-1 gap-10 px-6 py-12 sm:px-8 md:grid-cols-2 lg:py-16">

//         {/* Brand / About Section */}
//         <div className="space-y-4">
//           <div
//             className="font-['Playfair_Display'] text-xl font-bold tracking-wide leading-snug sm:text-2xl"
//             style={{ color: "#590916" }}
//           >
//             ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
//           </div>

//           <p className="text-sm leading-relaxed text-[#584141] max-w-md">
//             Promoting literature, art, and local culture through organized exhibitions, grand book fairs, and cultural meets since 1954 across West Bengal.
//           </p>

//           <div className="pt-2">
//             <span className="inline-flex px-3 py-1 rounded-full bg-[#ffdea5] text-[#5d4201] text-[10px] font-bold uppercase tracking-wider shadow-xs">
//               Registered & Certified
//             </span>
//           </div>
//         </div>

//         {/* Connect & Address */}
//         <div className="space-y-4 md:pl-8 lg:pl-16">
//           <h4
//             className="text-xs font-bold uppercase tracking-[0.15em]"
//             style={{ color: "#590916" }}
//           >
//             Connect With Us
//           </h4>

//           <div className="space-y-4">
//             <div className="flex items-start gap-3 text-[#584141] text-sm leading-relaxed">
//               <div className="w-8 h-8 rounded-xl bg-[#fed488]/40 flex items-center justify-center text-[#775a19] shrink-0 mt-0.5 border border-[#fed488]">
//                 <MapPin className="w-4 h-4" />
//               </div>
//               <span>
//                 26/2 Surya Sen Street, Kolkata, India, West Bengal
//               </span>
//             </div>

//             <div className="flex items-center gap-3 text-[#584141] text-sm">
//               <div className="w-8 h-8 rounded-xl bg-[#fed488]/40 flex items-center justify-center text-[#775a19] shrink-0 border border-[#fed488]">
//                 <Mail className="w-4 h-4" />
//               </div>
//               <a 
//                 href="mailto:bengalassociation2026@gmail.com" 
//                 className="hover:text-[#590916] transition-colors font-medium break-all underline underline-offset-4"
//               >
//                 bengalassociation2026@gmail.com
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Copyright Bar */}
//       <div className="border-t border-[#e0bfbf]/40 py-6 px-6 text-center">
//         <p className="text-[11px] text-[#584141]/80 uppercase tracking-widest">
//           © 2026 Association of Bengal. All Rights Reserved.
//         </p>
//       </div>
//     </footer>
//   );
// }

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#f5ece7] border-t border-[#e0bfbf]/60 w-full font-['Libre_Franklin'] overflow-hidden text-[#1e1b18]">
      {/* Decorative background accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#fed488]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Reduced vertical padding (py-8 lg:py-10) to make the footer more compact */}
      <div className="relative z-10 max-w-[1280px] mx-auto grid grid-cols-1 gap-8 px-6 py-8 sm:px-8 md:grid-cols-2 lg:py-10 items-center">

        {/* Brand / About Section (Matched with Header Branding Style) */}
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div
              className="
                relative
                w-[42px]
                h-[42px]
                shrink-0
                rounded-full
                overflow-hidden
                bg-white
                border
                border-[#d9c3b7]
                shadow-[0_3px_12px_rgba(87,0,19,0.08)]
              "
            >
              <Image
                src="/images/logo/balc_logo.png"
                alt="Bengal Association Logo"
                fill
                sizes="42px"
                className="object-contain p-1"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span
                className="
                  font-['Playfair_Display']
                  text-[15px]
                  leading-[18px]
                  font-bold
                  tracking-[0.01em]
                  text-[#570013]
                  whitespace-nowrap
                "
              >
                ASSOCIATION OF BENGAL
              </span>
              <span
                className="
                  mt-[1px]
                  text-[9px]
                  leading-[12px]
                  font-bold
                  tracking-[0.14em]
                  text-[#775a19]
                  uppercase
                  font-['Libre_Franklin']
                  whitespace-nowrap
                "
              >
                FOR LITERATURE AND CULTURE
              </span>
            </div>
          </Link>

          <p className="text-xs leading-relaxed text-[#584141] max-w-md">
            Promoting literature, art, and local culture through organized exhibitions, grand book fairs, and cultural meets since 1954 across West Bengal.
          </p>

          <div>
            <span className="inline-flex px-2.5 py-0.5 rounded-full bg-[#ffdea5] text-[#5d4201] text-[9.5px] font-bold uppercase tracking-wider shadow-xs">
              Registered & Certified
            </span>
          </div>
        </div>

        {/* Connect & Address */}
        <div className="space-y-3 md:pl-8 lg:pl-16">
          <h4
            className="text-xs font-bold uppercase tracking-[0.15em]"
            style={{ color: "#590916" }}
          >
            Connect With Us
          </h4>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-[#584141] text-xs leading-relaxed">
              <div className="w-7 h-7 rounded-lg bg-[#fed488]/40 flex items-center justify-center text-[#775a19] shrink-0 mt-0.5 border border-[#fed488]">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span>
                26/2 Surya Sen Street, Kolkata, India, West Bengal
              </span>
            </div>

            <div className="flex items-center gap-3 text-[#584141] text-xs">
              <div className="w-7 h-7 rounded-lg bg-[#fed488]/40 flex items-center justify-center text-[#775a19] shrink-0 border border-[#fed488]">
                <Mail className="w-3.5 h-3.5" />
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
        <p className="text-[10.5px] text-[#584141]/80 uppercase tracking-widest">
          © 2026 Association of Bengal. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}