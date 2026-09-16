
// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   User,
//   Mail,
//   ShieldCheck,
//   Globe,
//   Award,
//   CheckCircle2,
//   Phone,
//   Calendar,
//   Vote,
//   HeartHandshake,
//   Bell,
//   CalendarDays,
//   Newspaper,
//   IndianRupee,
//   Loader2,
//   ArrowUpRight,
//   Coins,
//   MapPin,
// } from "lucide-react";
// import Link from "next/link";

// const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

// interface MemberData {
//   _id: string;
//   memberId: string;
//   fullName: string;
//   wings: string[];
//   location: {
//     country: string;
//   };
//   memberSince: number;
//   totalContributions: number;
//   verified: boolean;
//   createdAt: string;
// }

// interface UserData {
//   _id: string;
//   fullName: string;
//   email: string;
//   mobile: string;
//   role: string;
//   allstep_completed: boolean;
//   createdAt: string;
// }

// interface Donation {
//   _id: string;
//   type: string;
//   amount: number;
//   currency: string;
//   status: string;
//   notes: string;
//   createdAt: string;
// }

// interface UpcomingEvent {
//   _id?: string;
//   id?: string;
//   title: string;
//   date?: string;
//   startDate?: string;
//   eventDate?: string;
//   dateStr?: string;
//   image?: string;
//   imageUrl?: string;
//   category?: string;
//   description?: string;
//   location:
//     | {
//         venue?: string;
//         city?: string;
//         country?: string;
//       }
//     | string;
// }

// interface LatestNews {
//   _id: string;
//   title: string;
//   summary: string;
//   category: string;
//   imageUrl?: string;
//   publishedAt: string;
// }

// interface Election {
//   _id: string;
//   name: string;
//   wing: string;
//   wings?: string[];
//   displayStatus: string;
// }

// interface DashboardData {
//   member: MemberData;
//   user: UserData;
//   recentDonations: Donation[];
//   upcomingEvents: UpcomingEvent[];
//   latestNews: LatestNews[];
//   unreadNotifications: number;
// }

// export default function DashboardOverviewPage() {
//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//   const [activeElections, setActiveElections] = useState<Election[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDashboardAndElections = async () => {
//       try {
//         const token =
//           localStorage.getItem("token") ||
//           localStorage.getItem("accessToken") ||
//           localStorage.getItem("access_token") ||
//           "";

//         const headers = {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         };

//         const [dashRes, electionRes] = await Promise.all([
//           fetch(`${API_BASE}/members/dashboard`, { method: "GET", headers }),
//           fetch(`${API_BASE}/elections`, { method: "GET", headers }),
//         ]);

//         const dashResult = await dashRes.json();
//         const electionResult = await electionRes.json();

//         if (!dashRes.ok || !dashResult.success) {
//           throw new Error(dashResult.message || "Failed to fetch dashboard data");
//         }

//         setDashboardData(dashResult.data);

//         if (electionRes.ok && electionResult.success) {
//           const allElections =
//             electionResult.data?.elections || electionResult.data || [];
//           const filtered = allElections.filter((e: Election) =>
//             ["NOMINATION_OPEN", "VOTING_OPEN", "WITHDRAWAL_OPEN"].includes(
//               e.displayStatus,
//             ),
//           );
//           setActiveElections(filtered);
//         }
//       } catch (err: any) {
//         setError(err.message || "An unexpected error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardAndElections();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4 px-4 w-full">
//         <Loader2 className="w-10 h-10 animate-spin text-[#570013]" />
//         <p className="text-xs sm:text-sm font-bold text-[#8c7071] tracking-wider uppercase text-center">
//           Loading Dashboard...
//         </p>
//       </div>
//     );
//   }

//   if (error || !dashboardData) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center space-y-3 max-w-md mx-auto my-8 sm:my-12 shadow-sm mx-4">
//         <p className="text-sm sm:text-base font-bold text-red-700">
//           Unable to load dashboard overview
//         </p>
//         <p className="text-xs sm:text-sm text-red-600">
//           {error || "No dynamic data available from server."}
//         </p>
//       </div>
//     );
//   }

//   const {
//     member,
//     user,
//     recentDonations,
//     upcomingEvents,
//     latestNews,
//     unreadNotifications,
//   } = dashboardData;

//   const memberName = member?.fullName || user?.fullName || "Member";
//   const memberEmail = user?.email || "N/A";
//   const memberPhone = user?.mobile || "Not Provided";
//   const memberId = member?.memberId || "N/A";
//   const memberWings = member?.wings || [];
//   const memberCountry = member?.location?.country || "INDIA";

//   return (
//     <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-16 px-4 sm:px-6 lg:px-8 font-['Libre_Franklin',sans-serif] overflow-x-hidden">
//       {/* 1. Modern Welcome Hero Banner */}
//       <div className="bg-gradient-to-r from-[#570013] via-[#70091d] to-[#40000e] text-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
//         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
//         <div className="absolute -right-16 -bottom-16 w-48 sm:w-64 h-48 sm:h-64 bg-white/5 rounded-full pointer-events-none blur-2xl sm:blur-3xl" />

//         <div className="relative z-10 space-y-3 sm:space-y-4 max-w-2xl w-full">
//           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-md border border-white/20">
//             <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
//             Verified Fellow & Member
//           </span>
//           <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-['Playfair_Display',serif] tracking-tight break-words leading-tight">
//             Welcome back, {memberName}!
//           </h1>
//           <p className="text-xs sm:text-sm lg:text-base text-[#f5e6d8] leading-relaxed max-w-xl">
//             Your fellowship credentials and profile data are active under the
//             Association of Bengal for Literature and Culture.
//           </p>
//         </div>

//         <div className="relative z-10 bg-white/10 border border-white/20 p-5 sm:p-6 rounded-2xl text-center backdrop-blur-md shrink-0 shadow-inner w-full lg:w-auto">
//           <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-200 font-bold mb-1.5">
//             Active Member ID
//           </span>
//           <span className="text-lg sm:text-xl lg:text-2xl font-mono font-extrabold tracking-widest text-white break-all">
//             {memberId}
//           </span>
//         </div>
//       </div>

//       {/* 2. Quick Highlight Stat Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
//         <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-[#e0bfbf]/60 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
//           <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#fbf2ed] text-[#775a19] flex items-center justify-center shrink-0 border border-[#e0bfbf]/50">
//             <Coins className="w-6 h-6 sm:w-7 sm:h-7" />
//           </div>
//           <div className="min-w-0 flex-1">
//             <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#8c7071] block truncate">
//               Total Contributions
//             </span>
//             <p className="text-base sm:text-lg lg:text-xl font-extrabold text-[#570013] font-mono mt-0.5 truncate">
//               ₹{member?.totalContributions || 0}
//             </p>
//           </div>
//         </div>

//         <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-[#e0bfbf]/60 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
//           <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#fbf2ed] text-[#775a19] flex items-center justify-center shrink-0 border border-[#e0bfbf]/50">
//             <Award className="w-6 h-6 sm:w-7 sm:h-7" />
//           </div>
//           <div className="min-w-0 flex-1">
//             <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#8c7071] block truncate">
//               Assigned Wings
//             </span>
//             <p className="text-base sm:text-lg lg:text-xl font-extrabold text-[#570013] mt-0.5 truncate">
//               {memberWings.length > 0 ? memberWings.join(", ") : "General"}
//             </p>
//           </div>
//         </div>

//         <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-[#e0bfbf]/60 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 sm:col-span-2 lg:col-span-1">
//           <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#fbf2ed] text-[#775a19] flex items-center justify-center shrink-0 border border-[#e0bfbf]/50">
//             <Bell className="w-6 h-6 sm:w-7 sm:h-7" />
//           </div>
//           <div className="min-w-0 flex-1 flex items-center justify-between gap-3">
//             <div className="min-w-0">
//               <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#8c7071] block truncate">
//                 Notifications
//               </span>
//               <p className="text-base sm:text-lg lg:text-xl font-extrabold text-[#570013] mt-0.5 truncate">
//                 {unreadNotifications ?? 0} Unread
//               </p>
//             </div>
//             <Link
//               href="/notifications"
//               className="text-[11px] sm:text-xs font-bold text-[#570013] bg-[#fbf2ed] px-3 py-1.5 rounded-lg border border-[#e0bfbf]/60 hover:bg-[#570013] hover:text-white transition-colors shrink-0"
//             >
//               View
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* 3. Detailed Profile & Fellowship Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
//         {/* Personal & Contact Profile */}
//         <div className="lg:col-span-2 bg-white p-5 sm:p-6 lg:p-8 border border-[#e0bfbf]/60 rounded-2xl sm:rounded-3xl shadow-sm flex flex-col">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e0bfbf]/40 pb-4 sm:pb-5 mb-5 sm:mb-6">
//             <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
//               <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
//               Personal & Contact Profile
//             </h3>
//             <span className="text-[10px] sm:text-xs bg-[#fbf2ed] text-[#775a19] font-extrabold px-3 py-1.5 rounded-full border border-[#e0bfbf]/60 capitalize whitespace-nowrap">
//               Role: {user?.role || "member"}
//             </span>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-[#584141] flex-1">
//             <div className="bg-[#fff8f5] p-4 sm:p-5 rounded-2xl border border-[#e0bfbf]/40 flex flex-col justify-center min-w-0">
//               <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8c7071] block mb-1">
//                 Full Name
//               </span>
//               <p className="font-extrabold text-[#1e1b18] text-sm sm:text-base truncate">
//                 {memberName}
//               </p>
//             </div>

//             <div className="bg-[#fff8f5] p-4 sm:p-5 rounded-2xl border border-[#e0bfbf]/40 flex flex-col justify-center min-w-0">
//               <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8c7071] block mb-1">
//                 Email Address
//               </span>
//               <p className="font-extrabold text-[#1e1b18] text-sm sm:text-base flex items-center gap-2 truncate">
//                 <Mail className="w-4 h-4 sm:w-4 sm:h-4 text-[#775a19] shrink-0" />
//                 <span className="truncate">{memberEmail}</span>
//               </p>
//             </div>

//             <div className="bg-[#fff8f5] p-4 sm:p-5 rounded-2xl border border-[#e0bfbf]/40 flex flex-col justify-center min-w-0">
//               <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8c7071] block mb-1">
//                 Mobile Number
//               </span>
//               <p className="font-extrabold text-[#1e1b18] text-sm sm:text-base flex items-center gap-2 truncate">
//                 <Phone className="w-4 h-4 sm:w-4 sm:h-4 text-[#775a19] shrink-0" />
//                 <span className="truncate">{memberPhone}</span>
//               </p>
//             </div>

//             <div className="bg-[#fff8f5] p-4 sm:p-5 rounded-2xl border border-[#e0bfbf]/40 flex flex-col justify-center min-w-0">
//               <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8c7071] block mb-1">
//                 Member Since
//               </span>
//               <p className="font-extrabold text-[#1e1b18] text-sm sm:text-base flex items-center gap-2 truncate">
//                 <Calendar className="w-4 h-4 sm:w-4 sm:h-4 text-[#775a19] shrink-0" />
//                 <span className="truncate">
//                   {member?.memberSince ||
//                     (user?.createdAt
//                       ? new Date(user.createdAt).getFullYear()
//                       : "N/A")}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Fellowship Details */}
//         <div className="bg-white p-5 sm:p-6 lg:p-8 border border-[#e0bfbf]/60 rounded-2xl sm:rounded-3xl shadow-sm flex flex-col h-full">
//           <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#570013] border-b border-[#e0bfbf]/40 pb-4 sm:pb-5 flex items-center gap-2 mb-5 sm:mb-6">
//             <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
//             Fellowship Info
//           </h3>
//           <div className="space-y-5 sm:space-y-6 flex-1 flex flex-col justify-center">
//             <div>
//               <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-2">
//                 Assigned Wings
//               </span>
//               <div className="flex flex-wrap gap-2">
//                 {memberWings.length > 0 ? (
//                   memberWings.map((wing: string, idx: number) => (
//                     <span
//                       key={idx}
//                       className="px-3 py-1.5 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] rounded-xl text-xs font-bold"
//                     >
//                       {wing}
//                     </span>
//                   ))
//                 ) : (
//                   <span className="text-gray-400 text-xs sm:text-sm">No wings assigned</span>
//                 )}
//               </div>
//             </div>

//             <div>
//               <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1.5">
//                 Chapter Region
//               </span>
//               <p className="font-extrabold text-[#1e1b18] text-sm sm:text-base flex items-center gap-2 truncate">
//                 <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19] shrink-0" />
//                 <span className="truncate">{memberCountry}</span>
//               </p>
//             </div>

//             <div>
//               <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-2">
//                 Account Status
//               </span>
//               <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs sm:text-sm font-bold">
//                 <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
//                 Verified & Active
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 4. Active Elections & Voting */}
//       <div className="bg-white p-5 sm:p-6 lg:p-8 border border-[#e0bfbf]/60 rounded-2xl sm:rounded-3xl shadow-sm">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e0bfbf]/40 pb-4 sm:pb-5 mb-5 sm:mb-6">
//           <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
//             <Vote className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
//             Active Elections & Voting
//           </h3>
//           <Link
//             href="/election"
//             className="text-[11px] sm:text-xs font-bold text-[#570013] bg-[#fbf2ed] px-3.5 py-2 rounded-xl border border-[#e0bfbf]/60 hover:bg-[#570013] hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
//           >
//             Portal <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//           </Link>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//           {activeElections?.length > 0 ? (
//             activeElections.map((election) => (
//               <div
//                 key={election._id}
//                 className="bg-[#fff8f5] p-5 sm:p-6 rounded-2xl border border-[#e0bfbf]/50 space-y-3 sm:space-y-4 hover:border-[#570013]/50 hover:shadow-md transition-all flex flex-col justify-between"
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="text-[9px] sm:text-[10px] font-extrabold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
//                     {election.displayStatus?.replace("_", " ")}
//                   </span>
//                 </div>
//                 <h4 className="font-extrabold text-sm sm:text-base text-[#570013] break-words line-clamp-2">
//                   {election.name}
//                 </h4>
//                 <div className="flex flex-wrap gap-2">
//                   {election.wings?.map((w, idx) => (
//                     <span
//                       key={idx}
//                       className="bg-white px-3 py-1 rounded-lg text-[10px] sm:text-xs border border-[#e0bfbf]/60 text-[#775a19] font-bold"
//                     >
//                       {w}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-xs sm:text-sm text-gray-500 col-span-1 md:col-span-2 text-center py-8">
//               No active elections currently open for voting or nomination.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* 5. Recent Contributions & Payments */}
//       <div className="bg-white p-5 sm:p-6 lg:p-8 border border-[#e0bfbf]/60 rounded-2xl sm:rounded-3xl shadow-sm">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e0bfbf]/40 pb-4 sm:pb-5 mb-5 sm:mb-6">
//           <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
//             <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
//             Recent Contributions
//           </h3>
//           <Link
//             href="/donate"
//             className="text-[11px] sm:text-xs font-bold text-[#570013] bg-[#fbf2ed] px-3.5 py-2 rounded-xl border border-[#e0bfbf]/60 hover:bg-[#570013] hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
//           >
//             View All <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//           </Link>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//           {recentDonations?.length > 0 ? (
//             recentDonations.map((donation) => (
//               <div
//                 key={donation._id}
//                 className="bg-[#fff8f5] p-5 sm:p-6 rounded-2xl border border-[#e0bfbf]/50 flex flex-col justify-between hover:shadow-md hover:border-[#570013]/40 transition-all"
//               >
//                 <div className="space-y-3 sm:space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#fbf2ed] flex items-center justify-center border border-[#e0bfbf]/50 shrink-0">
//                       <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
//                     </div>
//                     <span className="text-[9px] sm:text-[10px] font-extrabold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
//                       {donation.status}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="text-xl sm:text-2xl font-extrabold font-mono text-[#570013] truncate">
//                       {donation.currency || "₹"}
//                       {donation.amount?.toLocaleString("en-IN")}
//                     </p>
//                     <p className="text-xs sm:text-sm font-bold text-[#1e1b18] break-words mt-1">
//                       {donation.type}
//                     </p>
//                     <p className="text-[10px] sm:text-[11px] text-gray-500 italic break-words mt-1 line-clamp-2">
//                       {donation.notes || "N/A"}
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-[9px] sm:text-[10px] font-semibold text-gray-400 pt-3 border-t border-gray-200/60 mt-4 uppercase tracking-widest">
//                   {donation.createdAt
//                     ? new Date(donation.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
//                     : ""}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p className="text-xs sm:text-sm text-gray-500 col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8">
//               No recent transactions found.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* 6. Upcoming Events & Latest News Grid (Now 100% Matching Layout with Image) */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
//         {/* Upcoming Events Section (Matching Latest News Format + Image) */}
//         <div className="bg-white p-5 sm:p-6 lg:p-8 border border-[#e0bfbf]/60 rounded-2xl sm:rounded-3xl shadow-sm flex flex-col h-full">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e0bfbf]/40 pb-4 sm:pb-5 mb-5 sm:mb-6">
//             <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
//               <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
//               Upcoming Events & Gatherings
//             </h3>
//             <span className="text-[10px] sm:text-xs font-bold px-4 py-1.5 bg-[#fbf2ed] text-[#775a19] rounded-full border border-[#e0bfbf]/50 whitespace-nowrap">
//               Schedule
//             </span>
//           </div>

//           <div className="space-y-4 sm:space-y-5 flex-1 content-start">
//             {upcomingEvents?.length > 0 ? (
//               upcomingEvents.map((event: any) => {
//                 const displayDate = event.startDate || event.eventDate || event.date;
//                 const eventImg = event.image || event.imageUrl;

//                 // Cleanly format location without extra commas
//                 const locationParts =
//                   typeof event?.location === "object" && event?.location !== null
//                     ? [event.location.venue, event.location.city, event.location.country].filter(Boolean)
//                     : [event?.location || "Association Chapter"];
//                 const locationText = locationParts.join(", ");

//                 return (
//                   <div
//                     key={event.id || event._id}
//                     className="bg-[#fff8f5] p-4 sm:p-5 rounded-2xl border border-[#e0bfbf]/50 hover:border-[#570013]/60 transition-all shadow-sm flex flex-col gap-2.5 sm:gap-3 group"
//                   >
//                     {/* Header: Category Badge Left, Date Right (Matches News exactly) */}
//                     <div className="flex items-center justify-between gap-3 border-b border-[#e0bfbf]/30 pb-2 sm:pb-3">
//                       <span className="text-[10px] sm:text-[11px] font-extrabold px-3 py-1 rounded-md bg-[#570013]/10 text-[#570013] whitespace-nowrap truncate max-w-[140px] sm:max-w-none">
//                         {event.category || "Flagship Event"}
//                       </span>
//                       <span className="text-[10px] sm:text-[11px] font-semibold text-[#8c7071] shrink-0 flex items-center gap-1">
//                         <Calendar className="w-3.5 h-3.5 text-[#775a19]" />
//                         {displayDate
//                           ? new Date(displayDate).toLocaleDateString("en-US", {
//                               month: "numeric",
//                               day: "numeric",
//                               year: "numeric",
//                             })
//                           : "Soon"}
//                       </span>
//                     </div>

//                     {/* Content Body: Image on left + Title, Description & Location on right */}
//                     <div className="flex gap-3.5 sm:gap-4 items-start">
//                       {eventImg ? (
//                         <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#e0bfbf]/60 bg-white">
//                           <img
//                             src={eventImg}
//                             alt={event.title}
//                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                           />
//                         </div>
//                       ) : (
//                         <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white flex flex-col items-center justify-center shrink-0 border border-[#e0bfbf]/60 text-[#570013]">
//                           <Calendar className="w-6 h-6 text-[#775a19]" />
//                         </div>
//                       )}

//                       <div className="flex-1 min-w-0 space-y-1">
//                         <h4 className="text-sm sm:text-base font-extrabold text-[#570013] line-clamp-1 group-hover:text-[#70091d] transition-colors">
//                           {event?.title}
//                         </h4>
//                         <p className="text-[11px] sm:text-xs text-[#584141] leading-relaxed line-clamp-2">
//                           {event?.description || "Cultural event and literary fair gathering."}
//                         </p>
//                         <div className="text-[10px] sm:text-[11px] font-medium text-[#775a19] flex items-center gap-1.5 pt-0.5">
//                           <MapPin className="w-3.5 h-3.5 shrink-0" />
//                           <span className="truncate">{locationText}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="bg-gradient-to-br from-[#fff8f5] to-[#fbf2ed]/50 rounded-2xl border border-dashed border-[#e0bfbf] p-6 sm:p-10 text-center flex-1 flex flex-col items-center justify-center space-y-4">
//                 <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white border border-[#e0bfbf]/80 flex items-center justify-center shadow-sm text-[#775a19]">
//                   <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8" />
//                 </div>
//                 <div className="space-y-1.5">
//                   <h4 className="text-xs sm:text-sm font-extrabold text-[#570013] uppercase tracking-wider">
//                     No Upcoming Gatherings
//                   </h4>
//                   <p className="text-[11px] sm:text-xs text-[#8c7071] max-w-sm mx-auto leading-relaxed">
//                     There are currently no events or cultural meets scheduled.
//                     Check back soon for announcements.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Latest News (Identical Format) */}
//         <div className="bg-white p-5 sm:p-6 lg:p-8 border border-[#e0bfbf]/60 rounded-2xl sm:rounded-3xl shadow-sm flex flex-col h-full">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e0bfbf]/40 pb-4 sm:pb-5 mb-5 sm:mb-6">
//             <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
//               <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
//               Latest News & Announcements
//             </h3>
//           </div>

//           <div className="space-y-4 sm:space-y-5 flex-1 content-start">
//             {latestNews?.length > 0 ? (
//               latestNews.slice(0, 2).map((news) => (
//                 <div
//                   key={news._id}
//                   className="bg-[#fff8f5] p-4 sm:p-5 rounded-2xl border border-[#e0bfbf]/50 hover:border-[#570013]/60 transition-all shadow-sm flex flex-col gap-2.5 sm:gap-3 group"
//                 >
//                   <div className="flex items-center justify-between gap-3 border-b border-[#e0bfbf]/30 pb-2 sm:pb-3">
//                     <span className="text-[10px] sm:text-[11px] font-extrabold px-3 py-1 rounded-md bg-[#570013]/10 text-[#570013] whitespace-nowrap truncate max-w-[140px] sm:max-w-none">
//                       {news.category || "Announcement"}
//                     </span>
//                     <span className="text-[10px] sm:text-[11px] font-semibold text-[#8c7071] shrink-0 flex items-center gap-1">
//                       <Newspaper className="w-3.5 h-3.5" />
//                       {news.publishedAt
//                         ? new Date(news.publishedAt).toLocaleDateString("en-US", {
//                             year: "numeric",
//                             month: "numeric",
//                             day: "numeric",
//                           })
//                         : ""}
//                     </span>
//                   </div>
//                   <div>
//                     <h4 className="text-sm sm:text-base font-extrabold text-[#570013] line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-[#70091d] transition-colors">
//                       {news.title}
//                     </h4>
//                     <p className="text-[11px] sm:text-xs text-[#584141] leading-relaxed line-clamp-3">
//                       {news.summary}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="bg-gradient-to-br from-[#fff8f5] to-[#fbf2ed]/50 rounded-2xl border border-dashed border-[#e0bfbf] p-6 sm:p-10 text-center flex-1 flex flex-col items-center justify-center">
//                 <p className="text-xs sm:text-sm text-gray-500">
//                   No news updates at this time.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


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
  MapPin,
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
  _id?: string;
  id?: string;
  title: string;
  date?: string;
  startDate?: string;
  eventDate?: string;
  dateStr?: string;
  image?: string;
  imageUrl?: string;
  category?: string;
  description?: string;
  location:
    | {
        venue?: string;
        city?: string;
        country?: string;
      }
    | string;
}

interface LatestNews {
  _id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl?: string;
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

// Helper function to format any date string to DD/MM/YYYY
const formatDDMMYYYY = (dateInput: string | number | Date) => {
  if (!dateInput) return "N/A";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return typeof dateInput === "string" ? dateInput : "N/A";
  
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

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
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4 px-4 w-full">
        <Loader2 className="w-10 h-10 animate-spin text-[#570013]" />
        <p className="text-xs sm:text-sm font-bold text-[#8c7071] tracking-wider uppercase text-center">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center space-y-3 max-w-md mx-auto my-8 sm:my-12 shadow-sm mx-4">
        <p className="text-sm sm:text-base font-bold text-red-700">
          Unable to load dashboard overview
        </p>
        <p className="text-xs sm:text-sm text-red-600">
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

  // Sort events so the soonest upcoming dates appear first
  const sortedUpcomingEvents = [...(upcomingEvents || [])].sort((a, b) => {
    const dateA = new Date(a.startDate || a.eventDate || a.date || 0).getTime();
    const dateB = new Date(b.startDate || b.eventDate || b.date || 0).getTime();
    return dateA - dateB;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-16 px-4 sm:px-6 lg:px-8 font-['Libre_Franklin',sans-serif] overflow-x-hidden">
      
      {/* 1. Modern Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-[#570013] via-[#70091d] to-[#40000e] text-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -right-16 -bottom-16 w-48 sm:w-64 h-48 sm:h-64 bg-white/5 rounded-full pointer-events-none blur-2xl sm:blur-3xl" />

        <div className="relative z-10 space-y-3 sm:space-y-4 max-w-2xl w-full">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-md border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            Verified Fellow & Member
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-['Playfair_Display',serif] tracking-tight break-words leading-tight">
            Welcome back, {memberName}!
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-[#f5e6d8] leading-relaxed max-w-xl">
            Your fellowship credentials and profile data are active under the
            Association of Bengal for Literature and Culture.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 border border-white/20 p-5 sm:p-6 rounded-2xl text-center backdrop-blur-md shrink-0 shadow-inner w-full lg:w-auto">
          <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-200 font-bold mb-1.5">
            Active Member ID
          </span>
          <span className="text-lg sm:text-xl lg:text-2xl font-mono font-extrabold tracking-widest text-white break-all">
            {memberId}
          </span>
        </div>
      </div>

      {/* 2. Quick Highlight Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-[#e0bfbf]/60 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#fbf2ed] text-[#775a19] flex items-center justify-center shrink-0 border border-[#e0bfbf]/50">
            <Coins className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#8c7071] block truncate">
              Total Contributions
            </span>
            <p className="text-base sm:text-lg lg:text-xl font-extrabold text-[#570013] font-mono mt-0.5 truncate">
              ₹{member?.totalContributions || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-[#e0bfbf]/60 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#fbf2ed] text-[#775a19] flex items-center justify-center shrink-0 border border-[#e0bfbf]/50">
            <Award className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#8c7071] block truncate">
              Assigned Wings
            </span>
            <p className="text-base sm:text-lg lg:text-xl font-extrabold text-[#570013] mt-0.5 truncate">
              {memberWings.length > 0 ? memberWings.join(", ") : "General"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-[#e0bfbf]/60 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#fbf2ed] text-[#775a19] flex items-center justify-center shrink-0 border border-[#e0bfbf]/50">
            <Bell className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0 flex-1 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#8c7071] block truncate">
                Notifications
              </span>
              <p className="text-base sm:text-lg lg:text-xl font-extrabold text-[#570013] mt-0.5 truncate">
                {unreadNotifications ?? 0} Unread
              </p>
            </div>
            <Link
              href="/notifications"
              className="text-[11px] sm:text-xs font-bold text-[#570013] bg-[#fbf2ed] px-3 py-1.5 rounded-lg border border-[#e0bfbf]/60 hover:bg-[#570013] hover:text-white transition-colors shrink-0"
            >
              View
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Detailed Profile & Fellowship Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Personal & Contact Profile */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 lg:p-8 border border-[#e0bfbf]/60 rounded-2xl sm:rounded-3xl shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e0bfbf]/40 pb-4 sm:pb-5 mb-5 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
              Personal & Contact Profile
            </h3>
            <span className="text-[10px] sm:text-xs bg-[#fbf2ed] text-[#775a19] font-extrabold px-3 py-1.5 rounded-full border border-[#e0bfbf]/60 capitalize whitespace-nowrap">
              Role: {user?.role || "member"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-[#584141] flex-1">
            <div className="bg-[#fff8f5] p-4 sm:p-5 rounded-2xl border border-[#e0bfbf]/40 flex flex-col justify-center min-w-0">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8c7071] block mb-1">
                Full Name
              </span>
              <p className="font-extrabold text-[#1e1b18] text-sm sm:text-base truncate">
                {memberName}
              </p>
            </div>

            <div className="bg-[#fff8f5] p-4 sm:p-5 rounded-2xl border border-[#e0bfbf]/40 flex flex-col justify-center min-w-0">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8c7071] block mb-1">
                Email Address
              </span>
              <p className="font-extrabold text-[#1e1b18] text-sm sm:text-base flex items-center gap-2 truncate">
                <Mail className="w-4 h-4 sm:w-4 sm:h-4 text-[#775a19] shrink-0" />
                <span className="truncate">{memberEmail}</span>
              </p>
            </div>

            <div className="bg-[#fff8f5] p-4 sm:p-5 rounded-2xl border border-[#e0bfbf]/40 flex flex-col justify-center min-w-0">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8c7071] block mb-1">
                Mobile Number
              </span>
              <p className="font-extrabold text-[#1e1b18] text-sm sm:text-base flex items-center gap-2 truncate">
                <Phone className="w-4 h-4 sm:w-4 sm:h-4 text-[#775a19] shrink-0" />
                <span className="truncate">{memberPhone}</span>
              </p>
            </div>

            <div className="bg-[#fff8f5] p-4 sm:p-5 rounded-2xl border border-[#e0bfbf]/40 flex flex-col justify-center min-w-0">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8c7071] block mb-1">
                Member Since
              </span>
              <p className="font-extrabold text-[#1e1b18] text-sm sm:text-base flex items-center gap-2 truncate">
                <Calendar className="w-4 h-4 sm:w-4 sm:h-4 text-[#775a19] shrink-0" />
                <span className="truncate">
                  {formatDDMMYYYY(
                    member?.memberSince
                      ? `${member.memberSince}-01-01`
                      : user?.createdAt
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Fellowship Details */}
        <div className="bg-white p-5 sm:p-6 lg:p-8 border border-[#e0bfbf]/60 rounded-2xl sm:rounded-3xl shadow-sm flex flex-col h-full">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#570013] border-b border-[#e0bfbf]/40 pb-4 sm:pb-5 flex items-center gap-2 mb-5 sm:mb-6">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
            Fellowship Info
          </h3>
          <div className="space-y-5 sm:space-y-6 flex-1 flex flex-col justify-center">
            <div>
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-2">
                Assigned Wings
              </span>
              <div className="flex flex-wrap gap-2">
                {memberWings.length > 0 ? (
                  memberWings.map((wing: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] rounded-xl text-xs font-bold"
                    >
                      {wing}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs sm:text-sm">No wings assigned</span>
                )}
              </div>
            </div>

            <div>
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-1.5">
                Chapter Region
              </span>
              <p className="font-extrabold text-[#1e1b18] text-sm sm:text-base flex items-center gap-2 truncate">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19] shrink-0" />
                <span className="truncate">{memberCountry}</span>
              </p>
            </div>

            <div>
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#8c7071] mb-2">
                Account Status
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs sm:text-sm font-bold">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                Verified & Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Elections & Voting */}
      <div className="bg-white p-5 sm:p-6 lg:p-8 border border-[#e0bfbf]/60 rounded-2xl sm:rounded-3xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e0bfbf]/40 pb-4 sm:pb-5 mb-5 sm:mb-6">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
            <Vote className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
            Active Elections & Voting
          </h3>
          <Link
            href="/election"
            className="text-[11px] sm:text-xs font-bold text-[#570013] bg-[#fbf2ed] px-3.5 py-2 rounded-xl border border-[#e0bfbf]/60 hover:bg-[#570013] hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
          >
            Portal <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {activeElections?.length > 0 ? (
            activeElections.map((election) => (
              <div
                key={election._id}
                className="bg-[#fff8f5] p-5 sm:p-6 rounded-2xl border border-[#e0bfbf]/50 space-y-3 sm:space-y-4 hover:border-[#570013]/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] font-extrabold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                    {election.displayStatus?.replace("_", " ")}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-[#570013] break-words line-clamp-2">
                  {election.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {election.wings?.map((w, idx) => (
                    <span
                      key={idx}
                      className="bg-white px-3 py-1 rounded-lg text-[10px] sm:text-xs border border-[#e0bfbf]/60 text-[#775a19] font-bold"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs sm:text-sm text-gray-500 col-span-1 md:col-span-2 text-center py-8">
              No active elections currently open for voting or nomination.
            </p>
          )}
        </div>
      </div>

      {/* 5. Recent Contributions & Payments */}
      <div className="bg-white p-5 sm:p-6 lg:p-8 border border-[#e0bfbf]/60 rounded-2xl sm:rounded-3xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e0bfbf]/40 pb-4 sm:pb-5 mb-5 sm:mb-6">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
            Recent Contributions
          </h3>
          <Link
            href="/donate"
            className="text-[11px] sm:text-xs font-bold text-[#570013] bg-[#fbf2ed] px-3.5 py-2 rounded-xl border border-[#e0bfbf]/60 hover:bg-[#570013] hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
          >
            View All <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recentDonations?.length > 0 ? (
            recentDonations.map((donation) => (
              <div
                key={donation._id}
                className="bg-[#fff8f5] p-5 sm:p-6 rounded-2xl border border-[#e0bfbf]/50 flex flex-col justify-between hover:shadow-md hover:border-[#570013]/40 transition-all"
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#fbf2ed] flex items-center justify-center border border-[#e0bfbf]/50 shrink-0">
                      <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-extrabold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                      {donation.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-extrabold font-mono text-[#570013] truncate">
                      {donation.currency || "₹"}
                      {donation.amount?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-[#1e1b18] break-words mt-1">
                      {donation.type}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 italic break-words mt-1 line-clamp-2">
                      {donation.notes || "N/A"}
                    </p>
                  </div>
                </div>
                <p className="text-[9px] sm:text-[10px] font-semibold text-gray-400 pt-3 border-t border-gray-200/60 mt-4 uppercase tracking-widest">
                  {formatDDMMYYYY(donation.createdAt)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs sm:text-sm text-gray-500 col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8">
              No recent transactions found.
            </p>
          )}
        </div>
      </div>

      {/* 6. Upcoming Events & Latest News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Upcoming Events Section */}
        <div className="bg-white p-5 sm:p-6 lg:p-8 border border-[#e0bfbf]/60 rounded-2xl sm:rounded-3xl shadow-sm flex flex-col h-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e0bfbf]/40 pb-4 sm:pb-5 mb-5 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
              Upcoming Events & Gatherings
            </h3>
            <Link
              href="/eventsall"
              className="text-[11px] sm:text-xs font-bold text-[#570013] bg-[#fbf2ed] px-3.5 py-2 rounded-xl border border-[#e0bfbf]/60 hover:bg-[#570013] hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          <div className="space-y-4 sm:space-y-5 flex-1 content-start">
            {sortedUpcomingEvents?.length > 0 ? (
              sortedUpcomingEvents.slice(0, 2).map((event: any) => {
                const displayDate = event.startDate || event.eventDate || event.date;
                const eventImg = event.image || event.imageUrl;

                const locationParts =
                  typeof event?.location === "object" && event?.location !== null
                    ? [event.location.venue, event.location.city, event.location.country].filter(Boolean)
                    : [event?.location || "Association Chapter"];
                const locationText = locationParts.join(", ");

                return (
                  <div
                    key={event.id || event._id}
                    className="bg-[#fff8f5] p-4 sm:p-5 rounded-2xl border border-[#e0bfbf]/50 hover:border-[#570013]/60 transition-all shadow-sm flex flex-col gap-2.5 sm:gap-3 group"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-[#e0bfbf]/30 pb-2 sm:pb-3">
                      <span className="text-[10px] sm:text-[11px] font-extrabold px-3 py-1 rounded-md bg-[#570013]/10 text-[#570013] whitespace-nowrap truncate max-w-[140px] sm:max-w-none">
                        {event.category || "Flagship Event"}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-[#8c7071] shrink-0 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#775a19]" />
                        {formatDDMMYYYY(displayDate)}
                      </span>
                    </div>

                    <div className="flex gap-3.5 sm:gap-4 items-start">
                      {eventImg ? (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#e0bfbf]/60 bg-white">
                          <img
                            src={eventImg}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white flex flex-col items-center justify-center shrink-0 border border-[#e0bfbf]/60 text-[#570013]">
                          <Calendar className="w-6 h-6 text-[#775a19]" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm sm:text-base font-extrabold text-[#570013] line-clamp-1 group-hover:text-[#70091d] transition-colors">
                          {event?.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-[#584141] leading-relaxed line-clamp-2">
                          {event?.description || "Cultural event and literary fair gathering."}
                        </p>
                        <div className="text-[10px] sm:text-[11px] font-medium text-[#775a19] flex items-center gap-1.5 pt-0.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{locationText}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-gradient-to-br from-[#fff8f5] to-[#fbf2ed]/50 rounded-2xl border border-dashed border-[#e0bfbf] p-6 sm:p-10 text-center flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white border border-[#e0bfbf]/80 flex items-center justify-center shadow-sm text-[#775a19]">
                  <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#570013] uppercase tracking-wider">
                    No Upcoming Gatherings
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#8c7071] max-w-sm mx-auto leading-relaxed">
                    There are currently no events or cultural meets scheduled.
                    Check back soon for announcements.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Latest News Section */}
        <div className="bg-white p-5 sm:p-6 lg:p-8 border border-[#e0bfbf]/60 rounded-2xl sm:rounded-3xl shadow-sm flex flex-col h-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e0bfbf]/40 pb-4 sm:pb-5 mb-5 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#570013] flex items-center gap-2">
              <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-[#775a19]" />
              Latest News & Announcements
            </h3>
          </div>

          <div className="space-y-4 sm:space-y-5 flex-1 content-start">
            {latestNews?.length > 0 ? (
              latestNews.slice(0, 2).map((news) => (
                <div
                  key={news._id}
                  className="bg-[#fff8f5] p-4 sm:p-5 rounded-2xl border border-[#e0bfbf]/50 hover:border-[#570013]/60 transition-all shadow-sm flex flex-col gap-2.5 sm:gap-3 group"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-[#e0bfbf]/30 pb-2 sm:pb-3">
                    <span className="text-[10px] sm:text-[11px] font-extrabold px-3 py-1 rounded-md bg-[#570013]/10 text-[#570013] whitespace-nowrap truncate max-w-[140px] sm:max-w-none">
                      {news.category || "Announcement"}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#8c7071] shrink-0 flex items-center gap-1">
                      <Newspaper className="w-3.5 h-3.5" />
                      {formatDDMMYYYY(news.publishedAt)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#570013] line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-[#70091d] transition-colors">
                      {news.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#584141] leading-relaxed line-clamp-3">
                      {news.summary}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gradient-to-br from-[#fff8f5] to-[#fbf2ed]/50 rounded-2xl border border-dashed border-[#e0bfbf] p-6 sm:p-10 text-center flex-1 flex flex-col items-center justify-center">
                <p className="text-xs sm:text-sm text-gray-500">
                  No news updates at this time.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}