"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  User,  
  LogOut, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Vote, 
  IdCard, 
  HeartHandshake, 
  Menu, 
  X 
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

  // Updated title map to handle all new routes
  const getPageTitle = () => {
    if (pathname.includes("/profile")) return "Member Profile";
    if (pathname.includes("/documents")) return "Certificates & Credentials";
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

  return (
    <div className="min-h-screen bg-[#fff8f5] flex font-['Libre_Franklin',sans-serif]">
      
      {/* Sidebar for Desktop & Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#e0bfbf]/60 flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Sidebar Header with Full Name */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0bfbf]/50 bg-gradient-to-r from-[#fbf2ed] via-[#fff8f5] to-[#fbf2ed]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-white border border-[#e0bfbf]/60 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
              <Image
                src="/images/logo/balc_logo.png"
                alt="Logo"
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-[#570013] font-['Playfair_Display',serif] leading-tight uppercase">
                ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
              </h3>
              <p className="text-[9px] text-[#775a19] uppercase tracking-wider font-semibold mt-0.5">
                Member Portal
              </p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-[#8c7071] hover:text-[#570013]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Links (Including new sections) */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              pathname === "/dashboard" 
                ? "bg-[#570013] text-white shadow-sm" 
                : "text-[#584141] hover:bg-[#fbf2ed]"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard Overview
          </Link>

          <Link
            href="/dashboard/profile"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              pathname.includes("/profile") 
                ? "bg-[#570013] text-white shadow-sm" 
                : "text-[#584141] hover:bg-[#fbf2ed]"
            }`}
          >
            <User className="w-4 h-4" /> Member Profile
          </Link>

          <Link
            href="/dashboard/wings"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              pathname.includes("/wings") 
                ? "bg-[#570013] text-white shadow-sm" 
                : "text-[#584141] hover:bg-[#fbf2ed]"
            }`}
          >
            <Users className="w-4 h-4" /> Association Wings
          </Link>

          <Link
            href="/dashboard/election"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              pathname.includes("/election") 
                ? "bg-[#570013] text-white shadow-sm" 
                : "text-[#584141] hover:bg-[#fbf2ed]"
            }`}
          >
            <Vote className="w-4 h-4" /> Election Portal
          </Link>

          <Link
            href="/dashboard/my-id"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              pathname.includes("/my-id") 
                ? "bg-[#570013] text-white shadow-sm" 
                : "text-[#584141] hover:bg-[#fbf2ed]"
            }`}
          >
            <IdCard className="w-4 h-4" /> My ID Card
          </Link>

          <Link
            href="/dashboard/donate"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              pathname.includes("/donate") 
                ? "bg-[#570013] text-white shadow-sm" 
                : "text-[#584141] hover:bg-[#fbf2ed]"
            }`}
          >
            <HeartHandshake className="w-4 h-4" /> Donate & Support
          </Link>

          <Link
            href="/dashboard/documents"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              pathname.includes("/documents") 
                ? "bg-[#570013] text-white shadow-sm" 
                : "text-[#584141] hover:bg-[#fbf2ed]"
            }`}
          >
            <FileText className="w-4 h-4" /> Certificates & ID
          </Link>
        </nav>

        {/* Sidebar Footer (Logout) */}
        <div className="p-4 border-t border-[#e0bfbf]/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all text-xs font-semibold rounded-xl cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#e0bfbf]/50 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg border border-[#e0bfbf] text-[#570013] bg-[#fbf2ed]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base font-bold text-[#570013] font-['Playfair_Display',serif]">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-[#570013]">{userData.fullName}</span>
              <span className="text-[10px] text-[#775a19]">{memberData.memberId}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#570013]/10 border border-[#e0bfbf] flex items-center justify-center text-[#570013] font-bold text-xs">
              {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : "M"}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">
          {childrenWithProps}
        </main>
      </div>
    </div>
  );
}