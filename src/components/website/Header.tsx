'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      {/* Mobile Drawer */}
      <div
        id="mobileDrawer"
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleDrawer}
      >
        <div
          id="drawerContent"
          className={`fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-surface p-6 shadow-2xl transition-transform duration-300 flex flex-col justify-between ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant mb-6">
              <Link href="/" className="flex items-center gap-3" onClick={toggleDrawer}>
                <div className="relative h-10 w-10">
                  <Image
                    src="/images/logo/balc_logo.png"
                    alt="Bengal Association Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-primary leading-tight">
                    ASSOCIATION OF BENGAL
                  </span>
                  <span className="text-[9px] font-semibold text-secondary tracking-tight">
                    FOR LITERATURE AND CULTURE
                  </span>
                </div>
              </Link>
              <button
                className="p-2 text-on-surface-variant hover:text-primary"
                onClick={toggleDrawer}
                aria-label="Close Menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <nav className="flex flex-col space-y-4">
              <Link
                className="text-label-md font-bold text-primary py-2 px-3 rounded-lg bg-surface-container"
                href="/"
                onClick={toggleDrawer}
              >
                Home
              </Link>
              <Link
                className="text-label-md text-on-surface-variant hover:text-primary py-2 px-3 transition-colors"
                href="/about"
                onClick={toggleDrawer}
              >
                About Us
              </Link>
              <Link
                className="text-label-md text-on-surface-variant hover:text-primary py-2 px-3 transition-colors"
                href="/services"
                onClick={toggleDrawer}
              >
                Services
              </Link>
              <Link
                className="text-label-md text-on-surface-variant hover:text-primary py-2 px-3 transition-colors"
                href="/activites"
                onClick={toggleDrawer}
              >
                Events
              </Link>
              <Link
                className="text-label-md text-on-surface-variant hover:text-primary py-2 px-3 transition-colors"
                href="/members"
                onClick={toggleDrawer}
              >
                Members
              </Link>
              <Link
                className="text-label-md text-on-surface-variant hover:text-primary py-2 px-3 transition-colors"
                href="/contactus"
                onClick={toggleDrawer}
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-outline-variant">
            <Link
              href="/bookfairapplication"
              className="block w-full text-center bg-primary text-on-primary font-headline-md py-3 rounded-xl shadow-md"
              onClick={toggleDrawer}
            >
              Book Stall Now
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#fff8f5] border-b border-outline-variant shadow-sm transition-shadow duration-300">
        <div className="max-w-container-max mx-auto flex justify-between items-center px-4 sm:px-6 md:px-lg py-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="p-2 hover:bg-surface-variant/30 rounded-full active:scale-95 transition-transform md:hidden"
              onClick={toggleDrawer}
              aria-label="Open Mobile Menu"
            >
              <span className="material-symbols-outlined text-primary">menu</span>
            </button>
            
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 sm:h-12 w-10 sm:w-12">
                <Image
                  src="/images/logo/balc_logo.png"
                  alt="Bengal Association Logo"
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-headline-md font-bold tracking-tight text-primary text-base sm:text-headline-md leading-none">
                  ASSOCIATION OF BENGAL
                </span>
                <span className="text-[9px] sm:text-[14px] font-semibold text-secondary tracking-widest uppercase mt-0.5">
                  FOR LITERATURE AND CULTURE
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-base">
            <Link
              className="relative px-4 py-2 rounded-lg text-label-md font-label-md text-primary font-bold bg-surface-container/80 shadow-xs"
              href="/"
            >
              Home
            </Link>
            <Link
              className="px-4 py-2 text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors"
              href="/about"
            >
              About Us
            </Link>
            <Link
              className="px-4 py-2 text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors"
              href="/services"
            >
              Services
            </Link>
            <Link
              className="px-4 py-2 text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors"
              href="/activites"
            >
              Events
            </Link>
            <Link
              className="px-4 py-2 text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors"
              href="/members"
            >
              Members
            </Link>
            <Link
              className="px-4 py-2 text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors"
              href="/contactus"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
