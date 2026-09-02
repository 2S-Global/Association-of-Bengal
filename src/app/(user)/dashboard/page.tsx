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
  FileBadge,
  Vote,
  HeartHandshake,
  ArrowRight,
  Bell,
  Users,
  CalendarDays,
  Newspaper,
  IndianRupee,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

interface MemberData {
  memberId: string;
  fullName: string;
  wings: string[];
  location: {
    country: string;
  };
  memberSince: number;
  totalContributions: number;
  createdAt: string;
}

interface UserData {
  fullName: string;
  email: string;
  mobile: string;
  role: string;
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
  location: string;
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
  displayStatus: string;
  startDate?: string;
  endDate?: string;
  voting?: { startDate: string; endDate: string };
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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
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

        // Fetch Dashboard Data & Elections in parallel
        const [dashRes, electionRes] = await Promise.all([
          fetch(`${API_BASE}/members/dashboard`, { method: "GET", headers }),
          fetch(`${API_BASE}/elections`, { method: "GET", headers }),
        ]);

        const dashResult = await dashRes.json();
        const electionResult = await electionRes.json();

        if (!dashRes.ok || !dashResult.success) {
          throw new Error(dashResult.message || "Failed to fetch dashboard data");
        }

        setDashboardData(dashResult.data);

        if (electionRes.ok && electionResult.success) {
          const allElections = electionResult.data?.elections || electionResult.data || [];
          // Filter for active/open voting or nomination statuses
          const filtered = allElections.filter((e: Election) =>
            ["NOMINATION_OPEN", "VOTING_OPEN", "WITHDRAWAL_OPEN"].includes(e.displayStatus)
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
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#570013]" />
        <p className="text-xs font-semibold text-[#584141]">Loading live dashboard overview...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-3 max-w-md mx-auto my-12 shadow-sm">
        <p className="text-sm font-bold text-red-700">Unable to load dashboard overview</p>
        <p className="text-xs text-red-600">{error || "No dynamic data available from server."}</p>
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

  return (
    <div className="space-y-6 animate-fadeIn font-['Libre_Franklin',sans-serif]">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#570013] via-[#70091d] to-[#800020] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none blur-2xl" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-xs border border-white/10">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            Verified Member & Fellow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display',serif] tracking-tight">
            Welcome back, {user?.fullName || member?.fullName || "Member"}!
          </h2>
          <p className="text-xs sm:text-sm text-[#f5e6d8] max-w-lg leading-relaxed">
            Your fellowship credentials and profile data are active under the Association of Bengal for Literature and Culture.
          </p>
        </div>
        <div className="bg-white/10 border border-white/20 px-5 py-4 rounded-2xl text-center backdrop-blur-md shrink-0 shadow-inner">
          <span className="block text-[10px] uppercase tracking-widest text-[#f5e6d8] font-semibold">
            Member ID
          </span>
          <span className="text-base sm:text-lg font-mono font-bold tracking-wider text-amber-200">
            {member?.memberId || "N/A"}
          </span>
        </div>
      </div>

      {/* Notifications Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e0bfbf]/60 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fbf2ed] flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#775a19]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#570013]">Notifications</p>
            <p className="text-xs text-gray-500">
              You have {unreadNotifications ?? 0} unread notifications
            </p>
          </div>
        </div>
        <button className="text-xs font-bold text-[#570013] hover:underline cursor-pointer">
          View All
        </button>
      </div>

      {/* Profile & Fellowship Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Profile */}
        <div className="md:col-span-2 bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#e0bfbf]/30 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] flex items-center gap-2">
              <User className="w-4 h-4 text-[#775a19]" />
              Personal & Contact Profile
            </h4>
            <span className="text-[10px] bg-[#fbf2ed] text-[#775a19] font-bold px-2.5 py-1 rounded-full border border-[#e0bfbf]/50 capitalize">
              Role: {user?.role || "member"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#584141]">
            <div className="bg-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Full Name</span>
              <p className="font-bold text-[#1e1b18] text-sm">{user?.fullName || member?.fullName || "N/A"}</p>
            </div>
            <div className="bg-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Email Address</span>
              <p className="font-bold text-[#1e1b18] text-sm flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-[#775a19] shrink-0" />
                <span className="truncate">{user?.email || "N/A"}</span>
              </p>
            </div>
            <div className="bg-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Mobile Number</span>
              <p className="font-bold text-[#1e1b18] text-sm flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#775a19]" />
                {user?.mobile || "Not Provided"}
              </p>
            </div>
            <div className="bg-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Member Since</span>
              <p className="font-bold text-[#1e1b18] text-sm flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#775a19]" />
                {member?.memberSince || (user?.createdAt ? new Date(user.createdAt).getFullYear() : "N/A")}
              </p>
            </div>
          </div>
        </div>

        {/* Fellowship Details */}
        <div className="bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] border-b border-[#e0bfbf]/30 pb-3 flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[#775a19]" />
              Fellowship Details
            </h4>
            <div className="space-y-4 text-xs text-[#584141]">
              <div>
                <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1">Assigned Wings</span>
                <div className="flex flex-wrap gap-1.5">
                  {member?.wings?.length > 0 ? (
                    member.wings.map((wing: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] rounded-lg text-[11px] font-bold">
                        {wing}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No wings assigned</span>
                  )}
                </div>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1">Chapter Region</span>
                <p className="font-bold text-[#1e1b18] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#775a19]" />
                  {member?.location?.country || "INDIA"}
                </p>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1">Account Status</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-800 border border-green-300 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified & Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Elections Section */}
      <div className="bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs">
        <div className="flex items-center justify-between border-b border-[#e0bfbf]/30 pb-3 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] flex items-center gap-2">
            <Vote className="w-4 h-4 text-[#775a19]" />
            Active Elections & Voting
          </h4>
          <Link href="/dashboard/election" className="text-[11px] font-bold text-[#570013] hover:underline">
            View Portal
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeElections?.length > 0 ? (
            activeElections.map((election) => (
              <div key={election._id} className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                    {election.displayStatus?.replace("_", " ")}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-[#570013]">{election.name}</h5>
                <div className="flex flex-wrap gap-1">
                  {election.wings?.map((w, idx) => (
                    <span key={idx} className="bg-white px-2 py-0.5 rounded text-[10px] border border-[#e0bfbf]/50 text-[#775a19] font-bold">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 col-span-2 text-center py-4">No active elections currently open for voting or nomination.</p>
          )}
        </div>
      </div>

      {/* Recent Contributions Section */}
      <div className="bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs">
        <div className="flex items-center justify-between border-b border-[#e0bfbf]/30 pb-3 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#775a19]" />
            Recent Contributions & Payments
          </h4>
          <Link href="/dashboard/donate" className="text-[11px] font-bold text-[#570013] hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentDonations?.length > 0 ? (
            recentDonations.map((donation) => (
              <div key={donation._id} className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 text-[#775a19]" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 uppercase">
                    {donation.status}
                  </span>
                </div>
                <p className="text-lg font-bold text-[#570013]">
                  {donation.currency || "₹"}{donation.amount?.toLocaleString("en-IN")}
                </p>
                <p className="text-xs font-semibold text-[#1e1b18]">
                  {donation.type}
                </p>
                <p className="text-[11px] text-gray-500 italic">
                  {donation.notes || "N/A"}
                </p>
                <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-200/50">
                  {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : ""}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 col-span-3 text-center py-4">No recent transactions found.</p>
          )}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs">
        <div className="flex items-center justify-between border-b border-[#e0bfbf]/30 pb-3 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#775a19]" />
            Upcoming Events
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingEvents?.length > 0 ? (
            upcomingEvents.map((event: any) => (
              <div key={event.id || event._id} className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 hover:border-[#570013] transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fbf2ed] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#775a19]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-[#570013]">{event.title}</h5>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {event.date ? new Date(event.date).toLocaleDateString() : ""}
                    </p>
                    <p className="text-[11px] text-[#584141] mt-1">{event.location}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 col-span-3 text-center py-4">No upcoming events scheduled at this time.</p>
          )}
        </div>
      </div>

      {/* Latest News Section */}
      <div className="bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs">
        <div className="flex items-center justify-between border-b border-[#e0bfbf]/30 pb-3 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[#775a19]" />
            Latest News & Announcements
          </h4>
        </div>
        <div className="space-y-4">
          {latestNews?.length > 0 ? (
            latestNews.map((news) => (
              <div key={news._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] flex items-center justify-center shrink-0 mt-0.5">
                    <Newspaper className="w-4 h-4 text-[#775a19]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#570013]/10 text-[#570013]">
                        {news.category || "Update"}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-[#570013]">{news.title}</h5>
                    <p className="text-xs text-[#584141] leading-relaxed">{news.summary}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 text-center py-4">No news updates at this time.</p>
          )}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/wings" className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#570013] hover:shadow-md transition-all group flex items-center justify-between">
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] text-[#570013] flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-[#775a19]" />
            </div>
            <h5 className="font-bold text-sm text-[#570013] pt-1">Association Wings</h5>
            <p className="text-[11px] text-gray-500">Explore and join creative divisions</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8c7071] group-hover:translate-x-1 group-hover:text-[#570013] transition-all" />
        </Link>

        <Link href="/dashboard/my-id" className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#570013] hover:shadow-md transition-all group flex items-center justify-between">
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] text-[#570013] flex items-center justify-center font-bold">
              <FileBadge className="w-5 h-5 text-[#775a19]" />
            </div>
            <h5 className="font-bold text-sm text-[#570013] pt-1">Digital ID Card</h5>
            <p className="text-[11px] text-gray-500">View and download your badge</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8c7071] group-hover:translate-x-1 group-hover:text-[#570013] transition-all" />
        </Link>

        <Link href="/dashboard/election" className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#570013] hover:shadow-md transition-all group flex items-center justify-between">
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] text-[#570013] flex items-center justify-center font-bold">
              <Vote className="w-5 h-5 text-[#775a19]" />
            </div>
            <h5 className="font-bold text-sm text-[#570013] pt-1">Election Portal</h5>
            <p className="text-[11px] text-gray-500">Participate in association voting</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8c7071] group-hover:translate-x-1 group-hover:text-[#570013] transition-all" />
        </Link>

        <Link href="/dashboard/donate" className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#570013] hover:shadow-md transition-all group flex items-center justify-between">
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