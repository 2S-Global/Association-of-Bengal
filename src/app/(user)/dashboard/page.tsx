"use client";

import React from "react";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Globe, 
  Award, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  FileBadge, 
  Vote, 
  HeartHandshake, 
  ArrowRight,
  Sparkles,
  Users
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverviewPage({ userData, memberData }: any) {
  return (
    <div className="space-y-6 animate-fadeIn font-['Libre_Franklin',sans-serif]">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#570013] via-[#70091d] to-[#800020] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none blur-2xl" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-xs border border-white/10">
            <ShieldCheck className="w-4 h-4 text-amber-300" /> Verified Member & Fellow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display',serif] tracking-tight">
            Welcome back, {userData?.fullName || userData?.name || "Member"}!
          </h2>
          <p className="text-xs sm:text-sm text-[#f5e6d8] max-w-lg leading-relaxed">
            Your fellowship credentials and profile data are active under the Association of Bengal for Literature and Culture.
          </p>
        </div>
        <div className="bg-white/10 border border-white/20 px-5 py-4 rounded-2xl text-center backdrop-blur-md shrink-0 shadow-inner">
          <span className="block text-[10px] uppercase tracking-widest text-[#f5e6d8] font-semibold">Member ID</span>
          <span className="text-base sm:text-lg font-mono font-bold tracking-wider text-amber-200">
            {memberData?.memberId || memberData?.membershipNumber || "ABLC-2026"}
          </span>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Personal & Contact Information (Spans 2 columns) */}
        <div className="md:col-span-2 bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#e0bfbf]/30 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] flex items-center gap-2">
              <User className="w-4 h-4 text-[#775a19]" /> Personal & Contact Profile
            </h4>
            <span className="text-[10px] bg-[#fbf2ed] text-[#775a19] font-bold px-2.5 py-1 rounded-full border border-[#e0bfbf]/50">
              Role: {userData?.role || "Member"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#584141]">
            <div className="bg-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Full Name</span>
              <p className="font-bold text-[#1e1b18] text-sm">{userData?.fullName || userData?.name || "N/A"}</p>
            </div>

            <div className="bg-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Email Address</span>
              <p className="font-bold text-[#1e1b18] text-sm flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-[#775a19] shrink-0" /> <span className="truncate">{userData?.email || "N/A"}</span>
              </p>
            </div>

            <div className="bg-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Mobile Number</span>
              <p className="font-bold text-[#1e1b18] text-sm flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#775a19]" /> {userData?.mobile || memberData?.mobile || "Not Provided"}
              </p>
            </div>

            <div className="bg-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Member Since</span>
              <p className="font-bold text-[#1e1b18] text-sm flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#775a19]" /> {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "2026"}
              </p>
            </div>
          </div>
        </div>

        {/* Fellowship Status & Wings (Spans 1 column) */}
        <div className="bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] border-b border-[#e0bfbf]/30 pb-3 flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[#775a19]" /> Fellowship Details
            </h4>
            
            <div className="space-y-4 text-xs text-[#584141]">
              <div>
                <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1">Assigned Wings</span>
                <div className="flex flex-wrap gap-1.5">
                  {memberData?.wings?.length > 0 ? (
                    memberData.wings.map((wing: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] rounded-lg text-[11px] font-bold">
                        {wing}
                      </span>
                    ))
                  ) : (
                    <span className="px-2.5 py-1 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] rounded-lg text-[11px] font-bold">
                      General Member
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1">Chapter Region</span>
                <p className="font-bold text-[#1e1b18] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#775a19]" /> {memberData?.location?.country || memberData?.country || "India"}
                </p>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1">Account Status</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-800 border border-green-300 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Active
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <Link 
          href="/dashboard/wings"
          className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#570013] hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] text-[#570013] flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-[#775a19]" />
            </div>
            <h5 className="font-bold text-sm text-[#570013] pt-1">Association Wings</h5>
            <p className="text-[11px] text-gray-500">Explore and join creative divisions</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8c7071] group-hover:translate-x-1 group-hover:text-[#570013] transition-all" />
        </Link>

        <Link 
          href="/dashboard/my-id"
          className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#570013] hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] text-[#570013] flex items-center justify-center font-bold">
              <FileBadge className="w-5 h-5 text-[#775a19]" />
            </div>
            <h5 className="font-bold text-sm text-[#570013] pt-1">Digital ID Card</h5>
            <p className="text-[11px] text-gray-500">View and download your badge</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8c7071] group-hover:translate-x-1 group-hover:text-[#570013] transition-all" />
        </Link>

        <Link 
          href="/dashboard/election"
          className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#570013] hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] text-[#570013] flex items-center justify-center font-bold">
              <Vote className="w-5 h-5 text-[#775a19]" />
            </div>
            <h5 className="font-bold text-sm text-[#570013] pt-1">Election Portal</h5>
            <p className="text-[11px] text-gray-500">Participate in association voting</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8c7071] group-hover:translate-x-1 group-hover:text-[#570013] transition-all" />
        </Link>

        <Link 
          href="/dashboard/donate"
          className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#570013] hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] text-[#570013] flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5 text-[#775a19]" />
            </div>
            <h5 className="font-bold text-sm text-[#570013] pt-1">Support & Donate</h5>
            <p className="text-[11px] text-gray-500">Contribute to cultural initiatives</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8c7071] group-hover:translate-x-1 group-hover:text-[#570013] transition-all" />
        </Link>

      </div>

    </div>
  );
}