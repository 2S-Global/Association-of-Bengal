"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  Vote, 
  IdCard, 
  HeartHandshake, 
  Menu, 
  X,
  Sparkles,
  ChevronRight
} from "lucide-react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [userData, setUserData] = useState({
    fullName: "Loading...",
    email: "Loading...",
    role: "member"
  });
  const [memberData, setMemberData] = useState({
    memberId: "ABLC-2026",
    wings: ["General Member"],
    location: { country: "India" }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = 
        localStorage.getItem("token") || 
        localStorage.getItem("accessToken") || 
        localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        if (res.ok && data) {
          const userObj = data.user || data.data?.user || data.data || data;
          const memberObj = data.member || data.data?.member;

          if (userObj) setUserData(userObj);
          if (memberObj) setMemberData(memberObj);
        } else {
          localStorage.clear();
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = 
        localStorage.getItem("token") || 
        localStorage.getItem("accessToken") || 
        localStorage.getItem("access_token");
      
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      localStorage.clear();
      router.push("/login");
    }
  };

  const getPageTitle = () => {
    if (pathname.includes("/wings")) return "Association Wings";
    if (pathname.includes("/election")) return "Election Portal";
    if (pathname.includes("/my-id")) return "Digital ID Card";
    if (pathname.includes("/donate")) return "Support & Donate";
    return "Dashboard Overview";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#570013]"></div>
      </div>
    );
  }

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { userData, memberData } as any);
    }
    return child;
  });

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/wings", label: "Association Wings", icon: Users },
    { href: "/election", label: "Election Portal", icon: Vote },
    { href: "/MyProfile", label: "My Profile ", icon: IdCard },
    { href: "/donate", label: "Donate & Support", icon: HeartHandshake },
  ];

  return (
    <div className="min-h-screen bg-[#fff8f5] flex font-['Libre_Franklin',sans-serif]">
      
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar for Desktop & Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#e0bfbf]/60 flex flex-col transition-transform duration-300 shadow-xl md:shadow-none md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e0bfbf]/50 bg-gradient-to-r from-[#fbf2ed] via-[#fff8f5] to-[#fbf2ed]">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-white border border-[#e0bfbf]/80 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
              <Image
                src="/images/logo/balc_logo.png"
                alt="Logo"
                fill
                className="object-contain p-1.5"
              />
            </div>
            <div>
              <h3 className="text-[10px] font-extrabold text-[#570013] font-['Playfair_Display',serif] leading-tight uppercase tracking-tight">
                ASSOCIATION OF BENGAL
              </h3>
              <span className="inline-flex items-center gap-1 text-[9px] text-[#775a19] uppercase tracking-wider font-bold mt-0.5">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Member Portal
              </span>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-xl text-[#8c7071] hover:text-[#570013] hover:bg-[#fbf2ed] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Links (Scrollbar hidden inline) */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="px-3 pb-2 pt-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#8c7071]/80">
              Main Menu
            </span>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact 
              ? pathname === link.href 
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`group relative w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive 
                    ? "bg-[#570013] text-white shadow-md shadow-[#570013]/20 translate-x-1" 
                    : "text-[#584141] hover:bg-[#fbf2ed] hover:text-[#570013]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-colors ${
                    isActive ? "bg-white/15 text-white" : "bg-[#fbf2ed] text-[#775a19] group-hover:bg-[#570013]/10 group-hover:text-[#570013]"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="tracking-wide">{link.label}</span>
                </div>
                
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Member Quick Card Widget inside Sidebar */}
        <div className="px-4 py-3">
          <div className="bg-gradient-to-br from-[#fbf2ed] to-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/50 space-y-1">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#775a19]">
              Active Credential
            </span>
            <p className="text-xs font-bold font-mono text-[#570013]">
              {memberData.memberId}
            </p>
          </div>
        </div>

        {/* Sidebar Footer (Logout) */}
        <div className="p-4 border-t border-[#e0bfbf]/40 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-red-50/80 border border-red-200/80 text-red-700 hover:bg-red-100 transition-all text-xs font-bold rounded-2xl cursor-pointer shadow-xs active:scale-98"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-72 min-h-screen transition-all">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#e0bfbf]/50 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl border border-[#e0bfbf]/80 text-[#570013] bg-[#fbf2ed] hover:bg-[#e0bfbf]/30 transition-colors shadow-xs"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-[#775a19] font-bold">
                Member Dashboard
              </span>
              <h1 className="text-base sm:text-lg font-extrabold text-[#570013] font-['Playfair_Display',serif] tracking-tight">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#fbf2ed]/60 border border-[#e0bfbf]/50 py-1.5 px-3 rounded-2xl shadow-xs">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-extrabold text-[#570013]">{userData.fullName}</span>
              <span className="text-[10px] text-[#775a19] font-semibold">{memberData.memberId}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#570013] text-white border border-[#570013] flex items-center justify-center font-bold text-xs shadow-sm">
              {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : "M"}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {childrenWithProps}
        </main>
      </div>
    </div>
  );
}