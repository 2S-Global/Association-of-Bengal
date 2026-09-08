"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Globe,
  Award,
  CheckCircle2,
  Phone,
  Calendar,
  Vote,
  HeartHandshake,
  Bell,
  CalendarDays,
  Newspaper,
  IndianRupee,
  Loader2,
  ArrowUpRight,
  Coins,
} from "lucide-react";
import Link from "next/link";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

interface MemberData {
  _id: string;
  memberId: string;
  fullName: string;
  wings: string[];
  location: {
    country: string;
  };
  memberSince: number;
  totalContributions: number;
  verified: boolean;
  createdAt: string;
}

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  allstep_completed: boolean;
  createdAt: string;
}

interface Donation {
  _id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  notes: string;
  createdAt: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  location:
    | {
        venue?: string;
        city?: string;
        country?: string;
      }
    | string; // handles both object or string fallback
}

interface LatestNews {
  _id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
}

interface Election {
  _id: string;
  name: string;
  wing: string;
  wings?: string[];
  displayStatus: string;
}

interface DashboardData {
  member: MemberData;
  user: UserData;
  recentDonations: Donation[];
  upcomingEvents: UpcomingEvent[];
  latestNews: LatestNews[];
  unreadNotifications: number;
}

export default function DashboardOverviewPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [activeElections, setActiveElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardAndElections = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("access_token") ||
          "";

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [dashRes, electionRes] = await Promise.all([
          fetch(`${API_BASE}/members/dashboard`, { method: "GET", headers }),
          fetch(`${API_BASE}/elections`, { method: "GET", headers }),
        ]);

        const dashResult = await dashRes.json();
        const electionResult = await electionRes.json();

        if (!dashRes.ok || !dashResult.success) {
          throw new Error(
            dashResult.message || "Failed to fetch dashboard data",
          );
        }

        setDashboardData(dashResult.data);

        if (electionRes.ok && electionResult.success) {
          const allElections =
            electionResult.data?.elections || electionResult.data || [];
          const filtered = allElections.filter((e: Election) =>
            ["NOMINATION_OPEN", "VOTING_OPEN", "WITHDRAWAL_OPEN"].includes(
              e.displayStatus,
            ),
          );
          setActiveElections(filtered);
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardAndElections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4 px-4">
        <Loader2 className="w-9 h-9 animate-spin text-[#570013]" />
        <p className="text-xs font-bold text-[#8c7071] tracking-wider uppercase text-center">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-6 sm:p-8 text-center space-y-3 max-w-md mx-auto my-12 shadow-sm">
        <p className="text-sm font-bold text-red-700">
          Unable to load dashboard overview
        </p>
        <p className="text-xs text-red-600">
          {error || "No dynamic data available from server."}
        </p>
      </div>
    );
  }

  const {
    member,
    user,
    recentDonations,
    upcomingEvents,
    latestNews,
    unreadNotifications,
  } = dashboardData;

  const memberName = member?.fullName || user?.fullName || "Member";
  const memberEmail = user?.email || "N/A";
  const memberPhone = user?.mobile || "Not Provided";
  const memberId = member?.memberId || "N/A";
  const memberWings = member?.wings || [];
  const memberCountry = member?.location?.country || "INDIA";

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-16 px-4 sm:px-6 font-['Libre_Franklin',sans-serif] overflow-hidden">
      {/* 1. Modern Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-[#570013] via-[#70091d] to-[#40000e] text-white p-6 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none blur-3xl" />

        <div className="relative z-10 space-y-3 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-md border border-white/20">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            Verified Fellow & Member
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Playfair_Display',serif] tracking-tight break-words">
            Welcome back, {memberName}!
          </h1>
          <p className="text-xs sm:text-sm text-[#f5e6d8] leading-relaxed">
            Your fellowship credentials and profile data are active under the
            Association of Bengal for Literature and Culture.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 border border-white/20 px-6 py-5 rounded-2xl text-center backdrop-blur-md shrink-0 shadow-inner w-full lg:w-auto">
          <span className="block text-[10px] uppercase tracking-widest text-amber-200 font-bold mb-1">
            Active Member ID
          </span>
          <span className="text-base sm:text-lg lg:text-xl font-mono font-extrabold tracking-widest text-white break-all">
            {memberId}
          </span>
        </div>
      </div>

      {/* 2. Quick Highlight Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fbf2ed] text-[#775a19] flex items-center justify-center shrink-0 border border-[#e0bfbf]/50 font-bold">
            <Coins className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#8c7071] block">
              Total Contributions
            </span>
            <p className="text-base font-extrabold text-[#570013] font-mono mt-0.5 truncate">
              ₹{member?.totalContributions || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fbf2ed] text-[#775a19] flex items-center justify-center shrink-0 border border-[#e0bfbf]/50 font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#8c7071] block">
              Assigned Wings
            </span>
            <p className="text-base font-extrabold text-[#570013] mt-0.5 truncate">
              {memberWings.length > 0 ? memberWings.join(", ") : "General"}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 shadow-xs flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-2xl bg-[#fbf2ed] text-[#775a19] flex items-center justify-center shrink-0 border border-[#e0bfbf]/50 font-bold">
            <Bell className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#8c7071] block">
                Notifications
              </span>
              <p className="text-base font-extrabold text-[#570013] mt-0.5">
                {unreadNotifications ?? 0} Unread
              </p>
            </div>
            <Link
              href="/notifications"
              className="text-xs font-bold text-[#570013] hover:underline shrink-0"
            >
              View
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Detailed Profile & Fellowship Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal & Contact Profile */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 border border-[#e0bfbf]/60 rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#e0bfbf]/40 pb-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
              <User className="w-4 h-4 text-[#775a19]" />
              Personal & Contact Profile
            </h3>
            <span className="text-[10px] bg-[#fbf2ed] text-[#775a19] font-extrabold px-3 py-1 rounded-full border border-[#e0bfbf]/60 capitalize">
              Role: {user?.role || "member"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#584141]">
            <div className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 space-y-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071] block">
                Full Name
              </span>
              <p className="font-extrabold text-[#1e1b18] text-sm truncate">
                {memberName}
              </p>
            </div>

            <div className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 space-y-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071] block">
                Email Address
              </span>
              <p className="font-extrabold text-[#1e1b18] text-sm flex items-center gap-2 truncate">
                <Mail className="w-4 h-4 text-[#775a19] shrink-0" />
                <span className="truncate">{memberEmail}</span>
              </p>
            </div>

            <div className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 space-y-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071] block">
                Mobile Number
              </span>
              <p className="font-extrabold text-[#1e1b18] text-sm flex items-center gap-2 truncate">
                <Phone className="w-4 h-4 text-[#775a19] shrink-0" />
                <span className="truncate">{memberPhone}</span>
              </p>
            </div>

            <div className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 space-y-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071] block">
                Member Since
              </span>
              <p className="font-extrabold text-[#1e1b18] text-sm flex items-center gap-2 truncate">
                <Calendar className="w-4 h-4 text-[#775a19] shrink-0" />
                <span className="truncate">
                  {member?.memberSince ||
                    (user?.createdAt
                      ? new Date(user.createdAt).getFullYear()
                      : "N/A")}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Fellowship Details */}
        <div className="bg-white p-6 sm:p-8 border border-[#e0bfbf]/60 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#570013] border-b border-[#e0bfbf]/40 pb-4 flex items-center gap-2 mb-5">
              <Award className="w-4 h-4 text-[#775a19]" />
              Fellowship Info
            </h3>
            <div className="space-y-4 text-xs text-[#584141]">
              <div>
                <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1.5">
                  Assigned Wings
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {memberWings.length > 0 ? (
                    memberWings.map((wing: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] rounded-xl text-xs font-bold"
                      >
                        {wing}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No wings assigned</span>
                  )}
                </div>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1.5">
                  Chapter Region
                </span>
                <p className="font-extrabold text-[#1e1b18] flex items-center gap-2 truncate">
                  <Globe className="w-4 h-4 text-[#775a19] shrink-0" />
                  <span className="truncate">{memberCountry}</span>
                </p>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1.5">
                  Account Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Verified & Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Elections & Voting */}
      <div className="bg-white p-6 sm:p-8 border border-[#e0bfbf]/60 rounded-3xl shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#e0bfbf]/40 pb-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
            <Vote className="w-4 h-4 text-[#775a19]" />
            Active Elections & Voting
          </h3>
          <Link
            href="/election"
            className="text-xs font-bold text-[#570013] hover:underline flex items-center gap-1"
          >
            Portal <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeElections?.length > 0 ? (
            activeElections.map((election) => (
              <div
                key={election._id}
                className="bg-[#fff8f5] p-5 rounded-2xl border border-[#e0bfbf]/50 space-y-3 hover:border-[#570013]/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wide">
                    {election.displayStatus?.replace("_", " ")}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-[#570013] break-words">
                  {election.name}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {election.wings?.map((w, idx) => (
                    <span
                      key={idx}
                      className="bg-white px-2.5 py-0.5 rounded-lg text-[10px] border border-[#e0bfbf]/60 text-[#775a19] font-bold"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 col-span-1 md:col-span-2 text-center py-6">
              No active elections currently open for voting or nomination.
            </p>
          )}
        </div>
      </div>

      {/* 5. Recent Contributions & Payments */}
      <div className="bg-white p-6 sm:p-8 border border-[#e0bfbf]/60 rounded-3xl shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#e0bfbf]/40 pb-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#775a19]" />
            Recent Contributions & Payments
          </h3>
          <Link
            href="/donate"
            className="text-xs font-bold text-[#570013] hover:underline flex items-center gap-1"
          >
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentDonations?.length > 0 ? (
            recentDonations.map((donation) => (
              <div
                key={donation._id}
                className="bg-[#fff8f5] p-5 rounded-2xl border border-[#e0bfbf]/50 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#fbf2ed] flex items-center justify-center border border-[#e0bfbf]/50 shrink-0">
                      <IndianRupee className="w-4 h-4 text-[#775a19]" />
                    </div>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                      {donation.status}
                    </span>
                  </div>
                  <p className="text-xl font-extrabold font-mono text-[#570013] truncate">
                    {donation.currency || "₹"}
                    {donation.amount?.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs font-bold text-[#1e1b18] break-words">
                    {donation.type}
                  </p>
                  <p className="text-[11px] text-gray-500 italic break-words">
                    {donation.notes || "N/A"}
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 pt-2 border-t border-gray-200/60 mt-2">
                  {donation.createdAt
                    ? new Date(donation.createdAt).toLocaleDateString()
                    : ""}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 col-span-1 sm:col-span-2 lg:col-span-3 text-center py-6">
              No recent transactions found.
            </p>
          )}
        </div>
      </div>

      {/* 6. Upcoming Events & Latest News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events Section */}
        <div className="bg-white p-6 sm:p-8 border border-[#e0bfbf]/60 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#e0bfbf]/40 pb-4 mb-5">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#775a19]" />
                Upcoming Events & Gatherings
              </h3>
              <span className="text-[10px] font-bold px-3 py-1 bg-[#fbf2ed] text-[#775a19] rounded-full border border-[#e0bfbf]/50">
                Schedule
              </span>
            </div>

            {upcomingEvents?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingEvents.map((event: any) => (
                  <div
                    key={event.id || event._id}
                    className="bg-[#fff8f5] p-5 rounded-2xl border border-[#e0bfbf]/50 hover:border-[#570013]/60 transition-all space-y-3 group shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#fbf2ed] flex flex-col items-center justify-center shrink-0 border border-[#e0bfbf]/60 text-[#570013] font-bold">
                        <Calendar className="w-5 h-5 text-[#775a19]" />
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 bg-white text-[#570013] rounded-lg border border-[#e0bfbf]/50 shadow-2xs shrink-0">
                        {event.date
                          ? new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "Soon"}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-[#570013] group-hover:text-[#70091d] transition-colors break-words">
                        {event?.title}
                      </h4>
                      <p className="text-[11px] text-[#584141] font-medium mt-1.5 flex items-center gap-1.5 break-words">
                        <Globe className="w-3.5 h-3.5 text-[#775a19] shrink-0" />
                        <span className="truncate">
                          {typeof event?.location === "object" &&
                          event?.location !== null
                            ? `${event.location.venue || ""}, ${event.location.city || ""}, ${event.location.country || ""}`.replace(
                                /^,\s*|,\s*$/g,
                                "",
                              )
                            : event?.location || "Association Chapter"}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#fff8f5] to-[#fbf2ed]/50 rounded-2xl border border-dashed border-[#e0bfbf] p-6 sm:p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#e0bfbf]/80 flex items-center justify-center mx-auto shadow-xs text-[#775a19]">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-[#570013] uppercase tracking-wider">
                    No Upcoming Gatherings
                  </h4>
                  <p className="text-xs text-[#8c7071] max-w-md mx-auto leading-relaxed">
                    There are currently no events or cultural meets scheduled.
                    Check back soon for announcements regarding upcoming
                    association conferences and programs.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Latest News */}
        <div className="bg-white p-6 sm:p-8 border border-[#e0bfbf]/60 rounded-3xl shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#570013] border-b border-[#e0bfbf]/40 pb-4 flex items-center gap-2 mb-5">
              <Newspaper className="w-4 h-4 text-[#775a19]" />
              Latest News & Announcements
            </h3>
            <div className="space-y-3">
              {latestNews?.length > 0 ? (
                latestNews.slice(0, 2).map((news) => (
                  <div
                    key={news._id}
                    className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-[#570013]/10 text-[#570013] truncate">
                        {news.category || "Update"}
                      </span>
                      <span className="text-[10px] text-gray-500 shrink-0">
                        {news.publishedAt
                          ? new Date(news.publishedAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold text-[#570013] break-words">
                      {news.title}
                    </h4>
                    <p className="text-[11px] text-[#584141] leading-relaxed line-clamp-2 break-words">
                      {news.summary}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center py-6">
                  No news updates at this time.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
