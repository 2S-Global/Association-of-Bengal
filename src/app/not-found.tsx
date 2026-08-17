// import GridShape from "@/components/common/GridShape";
// import Image from "next/image";
// import Link from "next/link";
// import React from "react";

// export default function NotFound() {
//   return (
//     <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
//       <GridShape />
//       <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
//         <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
//           ERROR
//         </h1>

//         <Image
//           src="/images/error/404.svg"
//           alt="404"
//           className="dark:hidden"
//           width={472}
//           height={152}
//         />
//         <Image
//           src="/images/error/404-dark.svg"
//           alt="404"
//           className="hidden dark:block"
//           width={472}
//           height={152}
//         />

//         <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
//           We can’t seem to find the page you are looking for!
//         </p>

//         <Link
//           href="/"
//           className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
//         >
//           Back to Home Page
//         </Link>
//       </div>
//       {/* <!-- Footer --> */}
//       <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
//         &copy; {new Date().getFullYear()} - Bengal Association for Literature and Culture
//       </p>
//     </div>
//   );
// }


import Link from "next/link";
import React from "react";
import { Home, AlertTriangle, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-[#fff8f5] font-['Libre_Franklin'] overflow-hidden selection:bg-[#fed488] selection:text-[#785a1a]">
      
      {/* Decorative ambient lighting elements */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-[#fed488]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#570013]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Box */}
      <div className="relative z-10 mx-auto w-full max-w-xl text-center bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-[32px] border border-[#e0bfbf]/80 shadow-xl shadow-[#570013]/5 my-auto">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffdea5]/50 text-[#775a19] text-xs font-semibold tracking-wider uppercase mb-6 border border-[#ffdea5] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#775a19]" />
          <span>Page Not Found</span>
        </div>

        {/* Error Code / Title */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#570013]/10 flex items-center justify-center text-[#570013] border border-[#570013]/20 shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="font-['Playfair_Display'] text-5xl sm:text-6xl font-bold tracking-tight text-[#570013]">
            404
          </h1>
        </div>

        {/* Divider */}
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#775a19] to-transparent mx-auto mb-6 rounded-full" />

        {/* Description */}
        <p className="text-base sm:text-lg text-[#584141] leading-relaxed max-w-md mx-auto mb-8 font-medium">
          We can&apos;t seem to find the page you are looking for! It might have been moved or doesn&apos;t exist in our cultural archives.
        </p>

        {/* Action Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#570013] text-white px-8 py-4 text-sm font-semibold tracking-wide shadow-lg shadow-[#570013]/20 hover:bg-[#800020] hover:-translate-y-0.5 transition-all duration-300"
        >
          <Home className="w-4 h-4 text-[#ffdea5]" />
          <span>Back to Home Page</span>
        </Link>
      </div>

      {/* Footer Copyright */}
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full text-center px-4">
        <p className="text-xs text-[#584141]/70 font-medium tracking-wide">
          &copy; {new Date().getFullYear()} Association of Bengal for Literature and Culture. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}