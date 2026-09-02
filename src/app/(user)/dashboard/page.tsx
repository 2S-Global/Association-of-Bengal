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
  Bell,
  Users,
  CalendarDays,
  Newspaper,
  IndianRupee,
} from "lucide-react";
import Link from "next/link";



interface MemberData {
  memberId: string;
  membershipNumber: string;
  mobile: string;
  wings: string[];
  location: {
    country: string;
  };
}

interface UserData {
  fullName: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  createdAt: string;
}

interface Donation {
  id: string;
  amount: number;
  date: string;
  purpose: string;
  status: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
}

interface LatestNews {
  id: string;
  title: string;
  date: string;
}

interface DashboardData {
  member: MemberData;
  user: UserData;
  recentDonations: Donation[];
  upcomingEvents: UpcomingEvent[];
  latestNews: LatestNews[];
  unreadNotifications: number;
}


const dummyApiResponse: {
  success: boolean;
  message: string;
  data: DashboardData;
} = {
  success: true,

  message: "Dashboard data fetched",

  data: {
    /* =====================================================
       MEMBER
    ===================================================== */

    member: {
      memberId: "ABLC-2026-00125",

      membershipNumber: "ABLC-2026-00125",

      mobile: "+91 98765 43210",

      wings: [
        "Literature",
        "Cultural Activities",
        "Arts & Heritage",
      ],

      location: {
        country: "India",
      },
    },

    /* =====================================================
       USER
    ===================================================== */

    user: {
      fullName: "Abhisek Karan",

      name: "Abhisek Karan",

      email: "abhisek@example.com",

      mobile: "+91 98765 43210",

      role: "Member",

      createdAt: "2026-08-08T10:30:00.000Z",
    },

    /* =====================================================
       RECENT DONATIONS
    ===================================================== */

    recentDonations: [
      {
        id: "DON-001",
        amount: 5000,
        date: "2026-08-20",
        purpose: "Cultural Development",
        status: "COMPLETED",
      },

      {
        id: "DON-002",
        amount: 2500,
        date: "2026-07-10",
        purpose: "Literary Program",
        status: "COMPLETED",
      },

      {
        id: "DON-003",
        amount: 1000,
        date: "2026-06-15",
        purpose: "Heritage Preservation",
        status: "COMPLETED",
      },
    ],

    /* =====================================================
       UPCOMING EVENTS
    ===================================================== */

    upcomingEvents: [
      {
        id: "EVT-001",
        title: "Annual Literary Meet",
        date: "2026-09-15",
        location: "Kolkata",
      },

      {
        id: "EVT-002",
        title: "Cultural Heritage Festival",
        date: "2026-10-05",
        location: "Kolkata",
      },

      {
        id: "EVT-003",
        title: "Bengal Literature Conference",
        date: "2026-10-22",
        location: "Howrah",
      },
    ],

    /* =====================================================
       LATEST NEWS
    ===================================================== */

    latestNews: [
      {
        id: "NEWS-001",
        title: "Association Annual Conference Announced",
        date: "2026-08-25",
      },

      {
        id: "NEWS-002",
        title: "New Cultural Programs Added",
        date: "2026-08-18",
      },

      {
        id: "NEWS-003",
        title: "Membership Registration Open for 2026",
        date: "2026-08-10",
      },
    ],

    
    unreadNotifications: 3,
  },
};

export default function DashboardOverviewPage() {
  

  const {
    member,
    user,
    recentDonations,
    upcomingEvents,
    latestNews,
    unreadNotifications,
  } = dummyApiResponse.data;

  return (
    <div className="space-y-6 animate-fadeIn font-['Libre_Franklin',sans-serif]">

    

      <div className="bg-gradient-to-r from-[#570013] via-[#70091d] to-[#800020] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">

        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none blur-2xl" />

        <div className="relative z-10 space-y-2">

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-xs border border-white/10">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            Verified Member & Fellow
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display',serif] tracking-tight">
            Welcome back, {user.fullName || user.name}!
          </h2>

          <p className="text-xs sm:text-sm text-[#f5e6d8] max-w-lg leading-relaxed">
            Your fellowship credentials and profile data are active under
            the Association of Bengal for Literature and Culture.
          </p>

        </div>

        <div className="bg-white/10 border border-white/20 px-5 py-4 rounded-2xl text-center backdrop-blur-md shrink-0 shadow-inner">

          <span className="block text-[10px] uppercase tracking-widest text-[#f5e6d8] font-semibold">
            Member ID
          </span>

          <span className="text-base sm:text-lg font-mono font-bold tracking-wider text-amber-200">
            {member.memberId || member.membershipNumber}
          </span>

        </div>

      </div>

  

      <div className="bg-white p-4 rounded-2xl border border-[#e0bfbf]/60 shadow-xs flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-[#fbf2ed] flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#775a19]" />
          </div>

          <div>
            <p className="text-sm font-bold text-[#570013]">
              Notifications
            </p>

            <p className="text-xs text-gray-500">
              You have {unreadNotifications} unread notifications
            </p>
          </div>

        </div>

        <button className="text-xs font-bold text-[#570013] hover:underline">
          View All
        </button>

      </div>

   

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      

        <div className="md:col-span-2 bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs space-y-5">

          <div className="flex items-center justify-between border-b border-[#e0bfbf]/30 pb-3">

            <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] flex items-center gap-2">
              <User className="w-4 h-4 text-[#775a19]" />
              Personal & Contact Profile
            </h4>

            <span className="text-[10px] bg-[#fbf2ed] text-[#775a19] font-bold px-2.5 py-1 rounded-full border border-[#e0bfbf]/50">
              Role: {user.role}
            </span>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#584141]">

            {/* NAME */}

            <div className="bg-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/40 space-y-1">

              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">
                Full Name
              </span>

              <p className="font-bold text-[#1e1b18] text-sm">
                {user.fullName || user.name}
              </p>

            </div>

            {/* EMAIL */}

            <div className="bg-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/40 space-y-1">

              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">
                Email Address
              </span>

              <p className="font-bold text-[#1e1b18] text-sm flex items-center gap-1.5 truncate">

                <Mail className="w-3.5 h-3.5 text-[#775a19] shrink-0" />

                <span className="truncate">
                  {user.email}
                </span>

              </p>

            </div>

            {/* MOBILE */}

            <div className="bg-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/40 space-y-1">

              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">
                Mobile Number
              </span>

              <p className="font-bold text-[#1e1b18] text-sm flex items-center gap-1.5">

                <Phone className="w-3.5 h-3.5 text-[#775a19]" />

                {user.mobile || member.mobile || "Not Provided"}

              </p>

            </div>

            {/* MEMBER SINCE */}

            <div className="bg-[#fff8f5] p-3.5 rounded-2xl border border-[#e0bfbf]/40 space-y-1">

              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">
                Member Since
              </span>

              <p className="font-bold text-[#1e1b18] text-sm flex items-center gap-1.5">

                <Calendar className="w-3.5 h-3.5 text-[#775a19]" />

                {new Date(user.createdAt).toLocaleDateString()}

              </p>

            </div>

          </div>

        </div>

    

        <div className="bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs space-y-5 flex flex-col justify-between">

          <div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] border-b border-[#e0bfbf]/30 pb-3 flex items-center gap-2 mb-4">

              <Award className="w-4 h-4 text-[#775a19]" />

              Fellowship Details

            </h4>

            <div className="space-y-4 text-xs text-[#584141]">

              {/* WINGS */}

              <div>

                <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1">
                  Assigned Wings
                </span>

                <div className="flex flex-wrap gap-1.5">

                  {member.wings.map(
                    (wing: string, idx: number) => (

                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] rounded-lg text-[11px] font-bold"
                      >
                        {wing}
                      </span>

                    )
                  )}

                </div>

              </div>

              {/* COUNTRY */}

              <div>

                <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1">
                  Chapter Region
                </span>

                <p className="font-bold text-[#1e1b18] flex items-center gap-1.5">

                  <Globe className="w-3.5 h-3.5 text-[#775a19]" />

                  {member.location.country}

                </p>

              </div>

              {/* STATUS */}

              <div>

                <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1">
                  Account Status
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-800 border border-green-300 rounded-full text-xs font-bold">

                  <CheckCircle2 className="w-3.5 h-3.5" />

                  Verified & Active

                </span>

              </div>

            </div>

          </div>

        </div>

      </div>



      <div className="bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs">

        <div className="flex items-center justify-between border-b border-[#e0bfbf]/30 pb-3 mb-5">

          <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] flex items-center gap-2">

            <HeartHandshake className="w-4 h-4 text-[#775a19]" />

            Recent Donations

          </h4>

          <Link
            href="/dashboard/donate"
            className="text-[11px] font-bold text-[#570013] hover:underline"
          >
            View All
          </Link>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {recentDonations.map((donation) => (

            <div
              key={donation.id}
              className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40"
            >

              <div className="flex items-center justify-between mb-3">

                <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] flex items-center justify-center">

                  <IndianRupee className="w-4 h-4 text-[#775a19]" />

                </div>

                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                  {donation.status}
                </span>

              </div>

              <p className="text-lg font-bold text-[#570013]">
                ₹{donation.amount.toLocaleString("en-IN")}
              </p>

              <p className="text-xs font-semibold text-[#1e1b18] mt-1">
                {donation.purpose}
              </p>

              <p className="text-[10px] text-gray-500 mt-2">
                {new Date(donation.date).toLocaleDateString()}
              </p>

            </div>

          ))}

        </div>

      </div>

      

      <div className="bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs">

        <div className="flex items-center justify-between border-b border-[#e0bfbf]/30 pb-3 mb-5">

          <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] flex items-center gap-2">

            <CalendarDays className="w-4 h-4 text-[#775a19]" />

            Upcoming Events

          </h4>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {upcomingEvents.map((event) => (

            <div
              key={event.id}
              className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 hover:border-[#570013] transition-all"
            >

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 rounded-xl bg-[#fbf2ed] flex items-center justify-center shrink-0">

                  <Calendar className="w-5 h-5 text-[#775a19]" />

                </div>

                <div>

                  <h5 className="font-bold text-sm text-[#570013]">
                    {event.title}
                  </h5>

                  <p className="text-[11px] text-gray-500 mt-1">
                    {new Date(event.date).toLocaleDateString()}
                  </p>

                  <p className="text-[11px] text-[#584141] mt-1">
                    {event.location}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    

      <div className="bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs">

        <div className="flex items-center justify-between border-b border-[#e0bfbf]/30 pb-3 mb-5">

          <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] flex items-center gap-2">

            <Newspaper className="w-4 h-4 text-[#775a19]" />

            Latest News

          </h4>

        </div>

        <div className="space-y-3">

          {latestNews.map((news) => (

            <div
              key={news.id}
              className="flex items-center justify-between gap-4 bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40"
            >

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] flex items-center justify-center shrink-0">

                  <Newspaper className="w-4 h-4 text-[#775a19]" />

                </div>

                <div>

                  <h5 className="text-sm font-bold text-[#570013]">
                    {news.title}
                  </h5>

                  <p className="text-[10px] text-gray-500 mt-1">
                    {new Date(news.date).toLocaleDateString()}
                  </p>

                </div>

              </div>

              <ArrowRight className="w-4 h-4 text-[#8c7071] shrink-0" />

            </div>

          ))}

        </div>

      </div>



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* WINGS */}

        <Link
          href="/dashboard/wings"
          className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#570013] hover:shadow-md transition-all group flex items-center justify-between"
        >

          <div className="space-y-1">

            <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] text-[#570013] flex items-center justify-center font-bold">

              <Users className="w-5 h-5 text-[#775a19]" />

            </div>

            <h5 className="font-bold text-sm text-[#570013] pt-1">
              Association Wings
            </h5>

            <p className="text-[11px] text-gray-500">
              Explore and join creative divisions
            </p>

          </div>

          <ArrowRight className="w-4 h-4 text-[#8c7071] group-hover:translate-x-1 group-hover:text-[#570013] transition-all" />

        </Link>

        {/* ID CARD */}

        <Link
          href="/dashboard/my-id"
          className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#570013] hover:shadow-md transition-all group flex items-center justify-between"
        >

          <div className="space-y-1">

            <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] text-[#570013] flex items-center justify-center font-bold">

              <FileBadge className="w-5 h-5 text-[#775a19]" />

            </div>

            <h5 className="font-bold text-sm text-[#570013] pt-1">
              Digital ID Card
            </h5>

            <p className="text-[11px] text-gray-500">
              View and download your badge
            </p>

          </div>

          <ArrowRight className="w-4 h-4 text-[#8c7071] group-hover:translate-x-1 group-hover:text-[#570013] transition-all" />

        </Link>

        {/* ELECTION */}

        <Link
          href="/dashboard/election"
          className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#570013] hover:shadow-md transition-all group flex items-center justify-between"
        >

          <div className="space-y-1">

            <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] text-[#570a013] flex items-center justify-center font-bold">

              <Vote className="w-5 h-5 text-[#775a19]" />

            </div>

            <h5 className="font-bold text-sm text-[#570013] pt-1">
              Election Portal
            </h5>

            <p className="text-[11px] text-gray-500">
              Participate in association voting
            </p>

          </div>

          <ArrowRight className="w-4 h-4 text-[#8c7071] group-hover:translate-x-1 group-hover:text-[#570013] transition-all" />

        </Link>

        {/* DONATE */}

        <Link
          href="/dashboard/donate"
          className="bg-white p-5 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#570013] hover:shadow-md transition-all group flex items-center justify-between"
        >

          <div className="space-y-1">

            <div className="w-9 h-9 rounded-xl bg-[#fbf2ed] text-[#570013] flex items-center justify-center font-bold">

              <HeartHandshake className="w-5 h-5 text-[#775a19]" />

            </div>

            <h5 className="font-bold text-sm text-[#570013] pt-1">
              Support & Donate
            </h5>

            <p className="text-[11px] text-gray-500">
              Contribute to cultural initiatives
            </p>

          </div>

          <ArrowRight className="w-4 h-4 text-[#8c7071] group-hover:translate-x-1 group-hover:text-[#570013] transition-all" />

        </Link>

      </div>

    </div>
  );
}