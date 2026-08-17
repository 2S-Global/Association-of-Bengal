'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div
        id="mobileDrawer"
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleDrawer}
      >
        <div
          id="drawerContent"
          className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-[#fff8f5] p-6 shadow-2xl transition-transform duration-300 flex flex-col justify-between ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#e0bfbf] mb-6">
              <Link href="/" className="flex items-center gap-1.5" onClick={toggleDrawer}>
                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    src="/images/logo/balc_logo.png"
                    alt="Bengal Association Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#570013] leading-tight">
                    ASSOCIATION OF BENGAL
                  </span>
                  <span className="text-[8.5px] font-semibold text-[#775a19] tracking-tight">
                    FOR LITERATURE AND CULTURE
                  </span>
                </div>
              </Link>
              <button
                className="p-2 text-[#584141] hover:text-[#570013]"
                onClick={toggleDrawer}
                aria-label="Close Menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <nav className="flex flex-col space-y-2">
              <Link
                className={`text-sm py-2.5 px-3 rounded-lg transition-colors font-medium ${
                  isActive('/') ? 'font-bold text-[#570013] bg-[#f5ece7]' : 'text-[#584141] hover:text-[#570013]'
                }`}
                href="/"
                onClick={toggleDrawer}
              >
                Home
              </Link>
              <Link
                className={`text-sm py-2.5 px-3 rounded-lg transition-colors font-medium ${
                  isActive('/about') ? 'font-bold text-[#570013] bg-[#f5ece7]' : 'text-[#584141] hover:text-[#570013]'
                }`}
                href="/about"
                onClick={toggleDrawer}
              >
                About Us
              </Link>
              <Link
                className={`text-sm py-2.5 px-3 rounded-lg transition-colors font-medium ${
                  isActive('/services') ? 'font-bold text-[#570013] bg-[#f5ece7]' : 'text-[#584141] hover:text-[#570013]'
                }`}
                href="/services"
                onClick={toggleDrawer}
              >
                Services
              </Link>
              <Link
                className={`text-sm py-2.5 px-3 rounded-lg transition-colors font-medium ${
                  isActive('/activites') ? 'font-bold text-[#570013] bg-[#f5ece7]' : 'text-[#584141] hover:text-[#570013]'
                }`}
                href="/activites"
                onClick={toggleDrawer}
              >
                Events
              </Link>
              <Link
                className={`text-sm py-2.5 px-3 rounded-lg transition-colors font-medium ${
                  isActive('/members') ? 'font-bold text-[#570013] bg-[#f5ece7]' : 'text-[#584141] hover:text-[#570013]'
                }`}
                href="/members"
                onClick={toggleDrawer}
              >
                Members
              </Link>
              <Link
                className={`text-sm py-2.5 px-3 rounded-lg transition-colors font-medium ${
                  isActive('/contactus') ? 'font-bold text-[#570013] bg-[#f5ece7]' : 'text-[#584141] hover:text-[#570013]'
                }`}
                href="/contactus"
                onClick={toggleDrawer}
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-[#e0bfbf]">
            <Link
              href="/bookfairapplication"
              className="block w-full text-center bg-[#570013] text-white font-medium py-3 rounded-xl shadow-md text-sm"
              onClick={toggleDrawer}
            >
              Book Stall Now
            </Link>
          </div>
        </div>
      </div>

      {/* Main Responsive Header */}
      <header className="sticky top-0 z-40 bg-[#fff8f5] border-b border-[#e0bfbf] shadow-sm transition-shadow duration-300 w-full">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-10 py-3">
          
          {/* Logo & Brand Group (Tightened gap using gap-1 / -space-x if needed) */}
          <div className="flex items-center gap-1 sm:gap-1">
            <button
              className="p-2 hover:bg-[#e0bfbf]/20 rounded-full active:scale-95 transition-transform xl:hidden"
              onClick={toggleDrawer}
              aria-label="Open Mobile Menu"
            >
              <span className="material-symbols-outlined text-[#570013]">menu</span>
            </button>
            
            <Link href="/" className="flex items-center gap-1 group">
              <div className="relative h-10 sm:h-12 w-10 sm:w-12 shrink-0">
                <Image
                  src="/images/logo/balc_logo.png"
                  alt="Bengal Association Logo"
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-bold tracking-tight text-[#570013] text-[13px] sm:text-base leading-none">
                  ASSOCIATION OF BENGAL
                </span>
                <span className="text-[7.5px] sm:text-[10px] font-semibold text-[#775a19] tracking-widest uppercase mt-0.5">
                  FOR LITERATURE AND CULTURE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop & Tablet Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5 lg:gap-3">
            <Link
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/') 
                  ? 'text-[#570013] bg-[#f5ece7] shadow-xs' 
                  : 'text-[#584141] hover:text-[#570013] hover:bg-[#f9f1ed]'
              }`}
              href="/"
            >
              Home
            </Link>
            <Link
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/about') 
                  ? 'text-[#570013] bg-[#f5ece7] shadow-xs' 
                  : 'text-[#584141] hover:text-[#570013] hover:bg-[#f9f1ed]'
              }`}
              href="/about"
            >
              About Us
            </Link>
            <Link
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/services') 
                  ? 'text-[#570013] bg-[#f5ece7] shadow-xs' 
                  : 'text-[#584141] hover:text-[#570013] hover:bg-[#f9f1ed]'
              }`}
              href="/services"
            >
              Services
            </Link>
            <Link
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/activites') 
                  ? 'text-[#570013] bg-[#f5ece7] shadow-xs' 
                  : 'text-[#584141] hover:text-[#570013] hover:bg-[#f9f1ed]'
              }`}
              href="/activites"
            >
              Events
            </Link>
            <Link
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/members') 
                  ? 'text-[#570013] bg-[#f5ece7] shadow-xs' 
                  : 'text-[#584141] hover:text-[#570013] hover:bg-[#f9f1ed]'
              }`}
              href="/members"
            >
              Members
            </Link>
            <Link
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/contactus') 
                  ? 'text-[#570013] bg-[#f5ece7] shadow-xs' 
                  : 'text-[#584141] hover:text-[#570013] hover:bg-[#f9f1ed]'
              }`}
              href="/contactus"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action CTA Button */}
          <div className="hidden sm:block">
            <Link
              href="/bookfairapplication"
              className="bg-[#570013] hover:bg-[#6e0019] text-white text-xs sm:text-sm font-medium px-4 lg:px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              Book Stall Now
            </Link>
          </div>

        </div>
      </header>
    </>
  );
}