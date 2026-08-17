"use client";
import UserDropdown from "@/components/admin/layout/UserDropdown";
import React from "react";

const AppHeader: React.FC = () => {
  return (
    <header className="sticky top-0 flex w-full bg-brand-500 border-brand-600 z-99999 lg:border-b">
      <div className="flex items-center justify-between w-full gap-2 px-3 py-3 lg:px-6 lg:py-4">
        {/* Logo for mobile */}
        {/* <Link href="/admin" className="lg:hidden">
          <Image
            width={40}
            height={40}
            src="/images/logo/balc_logo.png"
            alt="Logo"
          />
        </Link> */}

        {/* Logo + Text for desktop */}
        {/* <Link href="/admin" className="hidden lg:flex items-center gap-3">
          <Image
            width={40}
            height={40}
            src="/images/logo/balc_logo.png"
            alt="Logo"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white leading-tight">
              ASSOCIATION OF BENGAL
            </span>
            <span className="text-xs font-semibold text-white/80 leading-tight">
              FOR LITERATURE AND CULTURE
            </span>
          </div>
        </Link> */}

        <div className="ml-auto">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
