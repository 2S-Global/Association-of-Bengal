// "use client";

// import { useState, useEffect, ReactElement } from "react";

// import Link from "next/link";
// import Image from "next/image";

// import { Menu, X, ArrowRight } from "lucide-react";

// import { usePathname } from "next/navigation";

// const navItems = [
//   {
//     label: "Home",
//     href: "/",
//   },
//   {
//     label: "About Us",
//     href: "/about",
//   },
//   {
//     label: "Services",
//     href: "/services",
//   },
//   {
//     label: "Events",
//     href: "/events",
//   },
//   {
//     label: "Members",
//     href: "/members",
//   },
//   {
//     label: "Contact",
//     href: "/contactus",
//   },
// ];

// export default function Header(): ReactElement {
//   const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

//   const [isScrolled, setIsScrolled] = useState<boolean>(false);

//   const pathname = usePathname();

//   useEffect(() => {
//     const handleScroll = (): void => {
//       setIsScrolled(window.scrollY > 20);
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   useEffect(() => {
//     if (isDrawerOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }

//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isDrawerOpen]);

//   useEffect(() => {
//     setIsDrawerOpen(false);
//   }, [pathname]);

//   const toggleDrawer = (): void => {
//     setIsDrawerOpen((previous) => !previous);
//   };

//   const closeDrawer = (): void => {
//     setIsDrawerOpen(false);
//   };

//   const isActive = (href: string): boolean => {
//     return pathname === href;
//   };

//   return (
//     <>
//       <header
//         className={`
//           md:hidden
//           sticky
//           top-0
//           z-40
//           bg-[#fff8f5]/95
//           backdrop-blur-xl
//           transition-all
//           duration-500
//           ${
//             isScrolled
//               ? "shadow-[0_6px_25px_rgba(87,0,19,0.10)]"
//               : "border-b border-[#e0bfbf]"
//           }
//         `}
//       >
//         <div
//           className="
//             relative
//             flex
//             items-center
//             justify-between
//             px-4
//             py-3
//           "
//         >
//           <Link
//             href="/"
//             className="
//               flex
//               items-center
//               gap-3
//               group
//             "
//           >
//             {/* LOGO */}

//             <div
//               className="
//                 relative
//                 w-[48px]
//                 h-[48px]
//                 shrink-0
//                 rounded-full
//                 overflow-hidden
//                 bg-white
//                 border
//                 border-[#d9c3b7]
//                 shadow-[0_3px_12px_rgba(87,0,19,0.08)]
//                 transition-transform
//                 duration-300
//                 group-hover:scale-[1.03]
//               "
//             >
//               <Image
//                 src="/images/logo/balc_logo.png"
//                 alt="Bengal Association Logo"
//                 fill
//                 priority
//                 sizes="48px"
//                 className="object-contain p-1"
//               />
//             </div>

//             {/* BRAND TEXT */}

//             <div
//               className="
//                 flex
//                 flex-col
//                 justify-center
//               "
//             >
//               <span
//                 className="
//                   font-['Playfair_Display']
//                   text-[15px]
//                   leading-[18px]
//                   font-semibold
//                   tracking-[0.01em]
//                   text-[#570013]
//                   whitespace-nowrap
//                 "
//               >
//                 ASSOCIATION OF BENGAL
//               </span>

//               <span
//                 className="
//                   mt-[3px]
//                   text-[7px]
//                   leading-[10px]
//                   font-semibold
//                   tracking-[0.12em]
//                   text-[#775a19]
//                   uppercase
//                   font-['Libre_Franklin']
//                   whitespace-nowrap
//                 "
//               >
//                 FOR LITERATURE AND CULTURE
//               </span>
//             </div>
//           </Link>

//           <button
//             type="button"
//             onClick={toggleDrawer}
//             aria-label={isDrawerOpen ? "Close Mobile Menu" : "Open Mobile Menu"}
//             aria-expanded={isDrawerOpen}
//             className="
//               relative
//               w-[44px]
//               h-[44px]
//               flex
//               items-center
//               justify-center
//               rounded-full
//               border
//               border-[#dcc7bd]
//               bg-[#fffaf7]
//               text-[#570013]
//               shadow-[0_3px_12px_rgba(87,0,19,0.07)]
//               transition-all
//               duration-300
//               hover:bg-[#f5ece7]
//               hover:border-[#cfae9f]
//               active:scale-90
//             "
//           >
//             {isDrawerOpen ? (
//               <X size={22} strokeWidth={1.8} />
//             ) : (
//               <Menu size={22} strokeWidth={1.8} />
//             )}
//           </button>

//           {/* GOLD ACCENT */}

//           <span
//             className="
//               absolute
//               bottom-0
//               left-1/2
//               -translate-x-1/2
//               w-10
//               h-[2px]
//               rounded-full
//               bg-[#775a19]
//             "
//           />
//         </div>
//       </header>

//       <div
//         className={`
//           fixed
//           inset-0
//           z-50
//           md:hidden
//           bg-[#2a1115]/40
//           backdrop-blur-[4px]
//           transition-all
//           duration-300
//           ${
//             isDrawerOpen
//               ? "opacity-100 visible pointer-events-auto"
//               : "opacity-0 invisible pointer-events-none"
//           }
//         `}
//         onClick={closeDrawer}
//       >
//         <aside
//           className={`
//             absolute
//             top-0
//             left-0
//             bottom-0
//             w-[87%]
//             max-w-[380px]
//             bg-[#fff8f5]
//             shadow-[12px_0_45px_rgba(87,0,19,0.18)]
//             flex
//             flex-col
//             justify-between
//             overflow-y-auto
//             transition-transform
//             duration-500
//             ease-[cubic-bezier(0.22,1,0.36,1)]
//             ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}
//           `}
//           onClick={(event) => event.stopPropagation()}
//         >
//           <div>
//             {/* BRAND */}

//             <div
//               className="
//                 px-6
//                 pt-6
//                 pb-5
//                 border-b
//                 border-[#e0bfbf]
//               "
//             >
//               <div
//                 className="
//                   flex
//                   items-center
//                   justify-between
//                 "
//               >
//                 <Link
//                   href="/"
//                   onClick={closeDrawer}
//                   className="
//                     flex
//                     items-center
//                     gap-3
//                     group
//                   "
//                 >
//                   {/* LOGO */}

//                   <div
//                     className="
//                       relative
//                       w-[52px]
//                       h-[52px]
//                       rounded-full
//                       overflow-hidden
//                       bg-white
//                       border
//                       border-[#d9c3b7]
//                       shadow-[0_4px_15px_rgba(87,0,19,0.10)]
//                     "
//                   >
//                     <Image
//                       src="/images/logo/balc_logo.png"
//                       alt="Bengal Association Logo"
//                       fill
//                       sizes="52px"
//                       className="
//                         object-contain
//                         p-1
//                       "
//                     />
//                   </div>

//                   {/* BRAND TEXT */}

//                   <div
//                     className="
//                       flex
//                       flex-col
//                     "
//                   >
//                     <span
//                       className="
//                         text-[14px]
//                         leading-[18px]
//                         font-semibold
//                         tracking-[0.01em]
//                         text-[#570013]
//                         font-['Playfair_Display']
//                       "
//                     >
//                       ASSOCIATION OF BENGAL
//                     </span>

//                     <span
//                       className="
//                         mt-1
//                         text-[8px]
//                         leading-[12px]
//                         font-semibold
//                         tracking-[0.08em]
//                         text-[#775a19]
//                         font-['Libre_Franklin']
//                       "
//                     >
//                       FOR LITERATURE AND CULTURE
//                     </span>
//                   </div>
//                 </Link>

//                 {/* CLOSE BUTTON */}

//                 <button
//                   type="button"
//                   onClick={closeDrawer}
//                   aria-label="Close navigation menu"
//                   className="
//                     w-10
//                     h-10
//                     flex
//                     items-center
//                     justify-center
//                     rounded-full
//                     text-[#584141]
//                     hover:text-[#570013]
//                     hover:bg-[#f5ece7]
//                     active:scale-90
//                     transition-all
//                     duration-300
//                   "
//                 >
//                   <X size={21} strokeWidth={1.8} />
//                 </button>
//               </div>
//             </div>

//             <div
//               className="
//                 px-6
//                 pt-7
//                 pb-3
//               "
//             ></div>

//             <nav
//               className="
//                 px-4
//                 flex
//                 flex-col
//                 gap-1.5
//               "
//             >
//               {navItems.map((item) => {
//                 const active = isActive(item.href);

//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     onClick={closeDrawer}
//                     className={`
//                       group
//                       relative
//                       flex
//                       items-center
//                       min-h-[52px]
//                       px-4
//                       rounded-xl
//                       overflow-hidden
//                       transition-all
//                       duration-300
//                       ${
//                         active
//                           ? "bg-[#f5ece7] text-[#570013] shadow-[0_4px_14px_rgba(87,0,19,0.05)]"
//                           : "text-[#584141] hover:bg-[#faf1ed] hover:text-[#570013]"
//                       }
//                     `}
//                   >
//                     {/* ACTIVE INDICATOR */}

//                     <span
//                       className={`
//                         absolute
//                         left-0
//                         top-1/2
//                         -translate-y-1/2
//                         w-[3px]
//                         rounded-r-full
//                         bg-[#775a19]
//                         transition-all
//                         duration-300
//                         ${
//                           active
//                             ? "h-7 opacity-100"
//                             : "h-0 opacity-0 group-hover:h-5 group-hover:opacity-70"
//                         }
//                       `}
//                     />

//                     {/* DOT */}

//                     <span
//                       className={`
//                         w-1.5
//                         h-1.5
//                         rounded-full
//                         mr-3.5
//                         shrink-0
//                         transition-all
//                         duration-300
//                         ${
//                           active
//                             ? "bg-[#775a19]"
//                             : "bg-[#d9c8c2] group-hover:bg-[#775a19]"
//                         }
//                       `}
//                     />

//                     {/* LABEL */}

//                     <span
//                       className="
//                         text-[14px]
//                         leading-[20px]
//                         tracking-[0.04em]
//                         font-semibold
//                         font-['Libre_Franklin']
//                       "
//                     >
//                       {item.label}
//                     </span>

//                     {/* ARROW */}

//                     <ArrowRight
//                       size={17}
//                       strokeWidth={1.8}
//                       className={`
//                         ml-auto
//                         transition-all
//                         duration-300
//                         ${
//                           active
//                             ? "opacity-100 text-[#775a19] translate-x-0"
//                             : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
//                         }
//                       `}
//                     />
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>

//           <div
//             className="
//               px-6
//               pb-7
//               pt-8
//             "
//           >
//             <div
//               className="
//                 border-t
//                 border-[#e0bfbf]
//                 pt-5
//               "
//             >
//               {/* BOOK STALL */}

//               <Link
//                 href="/bookfairapplication"
//                 onClick={closeDrawer}
//                 className="
//                   group
//                   relative
//                   flex
//                   items-center
//                   justify-center
//                   w-full
//                   min-h-[52px]
//                   overflow-hidden
//                   rounded-xl
//                   bg-[#570013]
//                   text-white
//                   shadow-[0_8px_25px_rgba(87,0,19,0.20)]
//                   hover:shadow-[0_12px_30px_rgba(87,0,19,0.27)]
//                   hover:-translate-y-[1px]
//                   active:translate-y-0
//                   transition-all
//                   duration-300
//                 "
//               >
//                 <span
//                   className="
//                     relative
//                     z-10
//                     font-['Playfair_Display']
//                     font-medium
//                     text-[18px]
//                     tracking-wide
//                   "
//                 >
//                   Book Stall Now
//                 </span>

//                 <ArrowRight
//                   size={18}
//                   strokeWidth={1.8}
//                   className="
//                     relative
//                     z-10
//                     ml-2
//                     transition-transform
//                     duration-300
//                     group-hover:translate-x-1
//                   "
//                 />

//                 <span
//                   className="
//                     absolute
//                     inset-0
//                     bg-white/10
//                     -translate-x-full
//                     group-hover:translate-x-full
//                     transition-transform
//                     duration-700
//                   "
//                 />
//               </Link>
//             </div>
//           </div>
//         </aside>
//       </div>

//       <header
//         className={`
//           hidden
//           md:block
//           sticky
//           top-0
//           z-40
//           bg-[#fff8f5]/95
//           backdrop-blur-md
//           transition-all
//           duration-500
//           ${
//             isScrolled
//               ? "shadow-[0_5px_25px_rgba(87,0,19,0.08)]"
//               : "border-b border-[#e0bfbf]"
//           }
//         `}
//       >
//         <div
//           className="
//             max-w-[1280px]
//             mx-auto
//             flex
//             items-center
//             justify-between
//             px-6
//             lg:px-[48px]
//             py-3
//           "
//         >
//           <Link
//             href="/"
//             className="
//               flex
//               items-center
//               gap-4
//               group
//             "
//           >
//             <div
//               className="
//                 relative
//                 w-[125px]
//                 h-[50px]
//               "
//             >
//               <Image
//                 src="/images/logo/balc_logo.png"
//                 alt="Bengal Association Logo"
//                 fill
//                 priority
//                 sizes="125px"
//                 className="
//     object-contain
//     transition-transform
//     duration-300
//     group-hover:scale-[1.03]
//   "
//               />
//             </div>

//             <div
//               className="
//                 flex
//                 flex-col
//                 justify-center
//               "
//             >
//               <span
//                 className="
//                   font-['Playfair_Display']
//                   font-medium
//                   text-[21px]
//                   lg:text-[23px]
//                   leading-[28px]
//                   tracking-[-0.01em]
//                   text-[#570013]
//                 "
//               >
//                 ASSOCIATION OF BENGAL
//               </span>

//               <span
//                 className="
//                   text-[9px]
//                   lg:text-[11px]
//                   font-semibold
//                   text-[#775a19]
//                   tracking-[0.09em]
//                   uppercase
//                   mt-1
//                   font-['Libre_Franklin']
//                 "
//               >
//                 FOR LITERATURE AND CULTURE
//               </span>
//             </div>
//           </Link>

//           <nav
//             className="
//               flex
//               items-center
//               gap-[3px]
//               font-['Libre_Franklin']
//             "
//           >
//             {navItems.map((item) => {
//               const active = isActive(item.href);

//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`
//                     group
//                     relative
//                     px-4
//                     py-2.5
//                     rounded-lg
//                     text-[14px]
//                     leading-[20px]
//                     tracking-[0.04em]
//                     font-semibold
//                     transition-all
//                     duration-300
//                     ${
//                       active
//                         ? "text-[#570013] bg-[#f5ece7] shadow-[0_2px_8px_rgba(87,0,19,0.04)]"
//                         : "text-[#584141] hover:text-[#570013] hover:bg-[#f9f1ed]"
//                     }
//                   `}
//                 >
//                   {item.label}

//                   <span
//                     className={`
//                       absolute
//                       left-1/2
//                       bottom-1
//                       -translate-x-1/2
//                       h-[2px]
//                       rounded-full
//                       bg-[#775a19]
//                       transition-all
//                       duration-300
//                       ${active ? "w-5" : "w-0 group-hover:w-4"}
//                     `}
//                   />
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>
//       </header>
//     </>
//   );
// }

"use client";

import { useState, useEffect, ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Events", href: "/events" },
  { label: "Members", href: "/members" },
  { label: "Contact", href: "/contactus" },
];

export default function Header(): ReactElement {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  const toggleDrawer = (): void => setIsDrawerOpen((prev) => !prev);
  const closeDrawer = (): void => setIsDrawerOpen(false);
  const isActive = (href: string): boolean => pathname === href;

  return (
    <>
      {/* ========================================================================= */}
      {/* MOBILE HEADER (< md)                                                      */}
      {/* ========================================================================= */}
      <header
        className={`
          md:hidden
          sticky
          top-0
          z-40
          bg-[#fff8f5]/90
          backdrop-blur-xl
          transition-all
          duration-500
          ${
            isScrolled
              ? "shadow-[0_8px_30px_rgba(87,0,19,0.12)] border-b border-[#e0bfbf]/60"
              : "border-b border-[#e0bfbf]"
          }
        `}
      >
        <div className="relative flex items-center justify-between px-4 py-3">
          {/* Brand Logo & Text */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="
                relative
                w-[46px]
                h-[46px]
                shrink-0
                rounded-full
                overflow-hidden
                bg-white
                border
                border-[#d9c3b7]
                shadow-[0_3px_12px_rgba(87,0,19,0.08)]
                transition-transform
                duration-300
                group-hover:scale-105
              "
            >
              <Image
                src="/images/logo/balc_logo.png"
                alt="Bengal Association Logo"
                fill
                priority
                sizes="46px"
                className="object-contain p-1"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span
                className="
                  font-['Playfair_Display']
                  text-[14.5px]
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
                  mt-[2px]
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

          {/* Toggle Button */}
          <button
            type="button"
            onClick={toggleDrawer}
            aria-label={isDrawerOpen ? "Close Mobile Menu" : "Open Mobile Menu"}
            aria-expanded={isDrawerOpen}
            className="
              relative
              w-[42px]
              h-[42px]
              flex
              items-center
              justify-center
              rounded-full
              border
              border-[#dcc7bd]
              bg-[#fffaf7]
              text-[#570013]
              shadow-[0_3px_12px_rgba(87,0,19,0.08)]
              transition-all
              duration-300
              hover:bg-[#f5ece7]
              hover:border-[#cfae9f]
              active:scale-95
            "
          >
            {isDrawerOpen ? (
              <X size={20} strokeWidth={2} />
            ) : (
              <Menu size={20} strokeWidth={2} />
            )}
          </button>

          {/* Bottom Gold Indicator Accent */}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#775a19] to-transparent" />
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE SLIDE-OVER DRAWER (< md)                                          */}
      {/* ========================================================================= */}
      <div
        className={`
          fixed
          inset-0
          z-50
          md:hidden
          bg-[#2a1115]/50
          backdrop-blur-sm
          transition-all
          duration-300
          ${
            isDrawerOpen
              ? "opacity-100 visible pointer-events-auto"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
        onClick={closeDrawer}
      >
        <aside
          className={`
            absolute
            top-0
            left-0
            bottom-0
            w-[88%]
            max-w-[380px]
            bg-[#fff8f5]
            shadow-[16px_0_50px_rgba(87,0,19,0.22)]
            flex
            flex-col
            justify-between
            overflow-y-auto
            transition-transform
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          onClick={(event) => event.stopPropagation()}
        >
          <div>
            {/* Drawer Header Brand */}
            <div className="px-6 pt-6 pb-5 border-b border-[#e0bfbf]/70 bg-gradient-to-b from-[#fef2eb] to-[#fff8f5]">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  onClick={closeDrawer}
                  className="flex items-center gap-3 group"
                >
                  <div
                    className="
                      relative
                      w-[50px]
                      h-[50px]
                      rounded-full
                      overflow-hidden
                      bg-white
                      border
                      border-[#d9c3b7]
                      shadow-[0_4px_15px_rgba(87,0,19,0.10)]
                    "
                  >
                    <Image
                      src="/images/logo/balc_logo.png"
                      alt="Bengal Association Logo"
                      fill
                      sizes="50px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13.5px] leading-[18px] font-bold tracking-[0.01em] text-[#570013] font-['Playfair_Display']">
                      ASSOCIATION OF BENGAL
                    </span>
                    <span className="mt-[2px] text-[9.5px] leading-[13px] font-bold tracking-[0.1em] text-[#775a19] font-['Libre_Franklin'] uppercase">
                      FOR LITERATURE & CULTURE
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close navigation menu"
                  className="w-9 h-9 flex items-center justify-center rounded-full text-[#584141] hover:text-[#570013] hover:bg-[#f5ece7] active:scale-95 transition-all"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Navigation Menu Items */}
            <nav className="px-4 py-5 flex flex-col gap-1.5">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeDrawer}
                    className={`
                      group
                      relative
                      flex
                      items-center
                      min-h-[50px]
                      px-4
                      rounded-xl
                      overflow-hidden
                      transition-all
                      duration-300
                      ${
                        active
                          ? "bg-[#f5ece7] text-[#570013] shadow-[0_4px_14px_rgba(87,0,19,0.06)] font-semibold"
                          : "text-[#584141] hover:bg-[#fbf2ed] hover:text-[#570013]"
                      }
                    `}
                  >
                    {/* Active Accent Stripe */}
                    <span
                      className={`
                        absolute
                        left-0
                        top-1/2
                        -translate-y-1/2
                        w-[3.5px]
                        rounded-r-full
                        bg-[#775a19]
                        transition-all
                        duration-300
                        ${
                          active
                            ? "h-7 opacity-100"
                            : "h-0 opacity-0 group-hover:h-5 group-hover:opacity-70"
                        }
                      `}
                    />
                    <span
                      className={`
                        w-1.5
                        h-1.5
                        rounded-full
                        mr-3.5
                        shrink-0
                        transition-all
                        duration-300
                        ${
                          active
                            ? "bg-[#775a19]"
                            : "bg-[#d9c8c2] group-hover:bg-[#775a19]"
                        }
                      `}
                    />
                    <span className="text-[14px] leading-[20px] tracking-[0.03em] font-['Libre_Franklin'] font-medium">
                      {item.label}
                    </span>
                    <ArrowRight
                      size={16}
                      strokeWidth={2}
                      className={`
                        ml-auto
                        transition-all
                        duration-300
                        ${
                          active
                            ? "opacity-100 text-[#775a19] translate-x-0"
                            : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        }
                      `}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Drawer Footer CTA */}
          <div className="px-6 pb-7 pt-4 border-t border-[#e0bfbf]/70 bg-gradient-to-t from-[#fef2eb]/50 to-transparent">
            <Link
              href="/bookfairapplication"
              onClick={closeDrawer}
              className="
                group
                relative
                flex
                items-center
                justify-center
                w-full
                min-h-[50px]
                overflow-hidden
                rounded-xl
                bg-[#570013]
                text-white
                shadow-[0_8px_25px_rgba(87,0,19,0.22)]
                hover:shadow-[0_12px_30px_rgba(87,0,19,0.3)]
                hover:-translate-y-0.5
                active:translate-y-0
                transition-all
                duration-300
              "
            >
              <span className="relative z-10 font-['Playfair_Display'] font-medium text-[16px] tracking-wide">
                Book Stall Now
              </span>
              <ArrowRight
                size={17}
                strokeWidth={2}
                className="relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-1"
              />
              <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
          </div>
        </aside>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP HEADER (md+)                                                      */}
      {/* ========================================================================= */}
      <header
        className={`
          hidden
          md:block
          sticky
          top-0
          z-40
          bg-[#fff8f5]/90
          backdrop-blur-md
          transition-all
          duration-500
          ${
            isScrolled
              ? "shadow-[0_6px_30px_rgba(87,0,19,0.08)] border-b border-[#e0bfbf]/70"
              : "border-b border-[#e0bfbf]"
          }
        `}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 lg:px-12 py-3">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-[115px] lg:w-[125px] h-[48px] lg:h-[52px]">
              <Image
                src="/images/logo/balc_logo.png"
                alt="Bengal Association Logo"
                fill
                priority
                sizes="125px"
                className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span
                className="
                  font-['Playfair_Display']
                  font-bold
                  text-[19px]
                  lg:text-[22px]
                  leading-[26px]
                  tracking-[-0.01em]
                  text-[#570013]
                "
              >
                ASSOCIATION OF BENGAL
              </span>
              <span
                className="
                  text-[10px]
                  lg:text-[11.5px]
                  font-bold
                  text-[#775a19]
                  tracking-[0.12em]
                  uppercase
                  mt-0.5
                  font-['Libre_Franklin']
                "
              >
                FOR LITERATURE AND CULTURE
              </span>
            </div>
          </Link>

          {/* Navigation Items + Action CTA */}
          <div className="flex items-center gap-2 lg:gap-4">
            <nav className="flex items-center gap-1 font-['Libre_Franklin']">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group
                      relative
                      px-3.5
                      py-2
                      rounded-lg
                      text-[13.5px]
                      lg:text-[14px]
                      leading-[20px]
                      tracking-[0.02em]
                      font-medium
                      transition-all
                      duration-300
                      ${
                        active
                          ? "text-[#570013] bg-[#f5ece7] shadow-[0_2px_8px_rgba(87,0,19,0.05)] font-semibold"
                          : "text-[#584141] hover:text-[#570013] hover:bg-[#f9f1ed]"
                      }
                    `}
                  >
                    {item.label}
                    <span
                      className={`
                        absolute
                        left-1/2
                        bottom-1
                        -translate-x-1/2
                        h-[2px]
                        rounded-full
                        bg-[#775a19]
                        transition-all
                        duration-300
                        ${active ? "w-5" : "w-0 group-hover:w-4"}
                      `}
                    />
                  </Link>
                );
              })}
            </nav>

            
            {/* <Link
              href="/bookfairapplication"
              className="
                group
                relative
                ml-2
                hidden
                xl:inline-flex
                items-center
                justify-center
                px-5
                py-2.5
                rounded-xl
                bg-[#570013]
                text-white
                text-[13.5px]
                font-['Playfair_Display']
                font-medium
                tracking-wide
                shadow-[0_4px_15px_rgba(87,0,19,0.18)]
                hover:bg-[#6e0019]
                hover:shadow-[0_6px_20px_rgba(87,0,19,0.25)]
                hover:-translate-y-0.5
                active:translate-y-0
                transition-all
                duration-300
              "
            >
              <span>Book Stall</span>
              <ArrowRight
                size={15}
                strokeWidth={2}
                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link> */}
          </div>
        </div>
      </header>
    </>
  );
}