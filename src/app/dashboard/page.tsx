// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { 
//   User, 
//   Mail, 
//   ShieldCheck, 
//   Globe, 
//   Award, 
//   LogOut, 
//   CheckCircle2, 
//   LayoutDashboard, 
//   FileText, 
//   Menu, 
//   X 
// } from "lucide-react";

// export default function UserDashboardPage() {
//   const router = useRouter();
//   const [userData, setUserData] = useState({
//     fullName: "Loading...",
//     email: "Loading...",
//     role: "member"
//   });
//   const [memberData, setMemberData] = useState({
//     memberId: "ABLC-2026",
//     wings: ["General Member"],
//     location: { country: "India" }
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     const storedUser = localStorage.getItem("user");
//     const storedMember = localStorage.getItem("member");

//     if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
//       try {
//         setUserData(JSON.parse(storedUser));
//       } catch (e) {
//         console.error("Error parsing user data");
//       }
//     }

//     if (storedMember && storedMember !== "undefined" && storedMember !== "null") {
//       try {
//         setMemberData(JSON.parse(storedMember));
//       } catch (e) {
//         console.error("Error parsing member data");
//       }
//     }

//     setIsLoading(false);
//   }, [router]);

//   const handleLogout = () => {
//     localStorage.clear();
//     router.push("/login");
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#570013]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#fff8f5] flex font-['Libre_Franklin',sans-serif]">
      
//       {/* Sidebar for Desktop & Mobile */}
//       <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#e0bfbf]/60 flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
//         {/* Sidebar Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0bfbf]/50 bg-gradient-to-r from-[#fbf2ed] via-[#fff8f5] to-[#fbf2ed]">
//           <div className="flex items-center gap-3">
//             <div className="relative w-9 h-9 rounded-xl bg-white border border-[#e0bfbf]/60 flex items-center justify-center overflow-hidden shadow-sm">
//               <Image
//                 src="/images/Logo2.jpg"
//                 alt="Logo"
//                 fill
//                 className="object-contain p-1"
//               />
//             </div>
//             <div>
//               <h3 className="text-[11px] font-bold text-[#570013] font-['Playfair_Display',serif] leading-tight">
//                 ASSOCIATION OF BENGAL
//               </h3>
//               <p className="text-[9px] text-[#775a19] uppercase tracking-wider font-semibold">
//                 Member Portal
//               </p>
//             </div>
//           </div>
//           <button 
//             onClick={() => setSidebarOpen(false)}
//             className="md:hidden text-[#8c7071] hover:text-[#570013]"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Sidebar Navigation Links */}
//         <nav className="flex-1 p-4 space-y-1.5">
//           <button
//             onClick={() => setActiveTab("overview")}
//             className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
//               activeTab === "overview" 
//                 ? "bg-[#570013] text-white shadow-sm" 
//                 : "text-[#584141] hover:bg-[#fbf2ed]"
//             }`}
//           >
//             <LayoutDashboard className="w-4 h-4" /> Dashboard Overview
//           </button>
//           <button
//             onClick={() => setActiveTab("profile")}
//             className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
//               activeTab === "profile" 
//                 ? "bg-[#570013] text-white shadow-sm" 
//                 : "text-[#584141] hover:bg-[#fbf2ed]"
//             }`}
//           >
//             <User className="w-4 h-4" /> Member Profile
//           </button>
//           <button
//             onClick={() => setActiveTab("documents")}
//             className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
//               activeTab === "documents" 
//                 ? "bg-[#570013] text-white shadow-sm" 
//                 : "text-[#584141] hover:bg-[#fbf2ed]"
//             }`}
//           >
//             <FileText className="w-4 h-4" /> Certificates & ID
//           </button>
//         </nav>

//         {/* Sidebar Footer (Logout) */}
//         <div className="p-4 border-t border-[#e0bfbf]/40">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all text-xs font-semibold rounded-xl"
//           >
//             <LogOut className="w-4 h-4" /> Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* Main Content Wrapper */}
//       <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        
//         {/* Top Header Bar */}
//         <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#e0bfbf]/50 px-6 py-3.5 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="md:hidden p-1.5 rounded-lg border border-[#e0bfbf] text-[#570013] bg-[#fbf2ed]"
//             >
//               <Menu className="w-5 h-5" />
//             </button>
//             <h1 className="text-sm sm:text-base font-bold text-[#570013] font-['Playfair_Display',serif]">
//               {activeTab === "overview" && "Dashboard Overview"}
//               {activeTab === "profile" && "Member Profile"}
//               {activeTab === "documents" && "Certificates & Credentials"}
//             </h1>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="hidden sm:flex flex-col text-right">
//               <span className="text-xs font-bold text-[#570013]">{userData.fullName}</span>
//               <span className="text-[10px] text-[#775a19]">{memberData.memberId}</span>
//             </div>
//             <div className="w-9 h-9 rounded-full bg-[#570013]/10 border border-[#e0bfbf] flex items-center justify-center text-[#570013] font-bold text-xs">
//               {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : "M"}
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Content Body */}
//         <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">
          
//           {activeTab === "overview" && (
//             <>
//               {/* Welcome Banner */}
//               <div className="bg-gradient-to-r from-[#570013] to-[#800020] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <div className="relative z-10 space-y-2">
//                   <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-xs">
//                     <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> Verified Fellow
//                   </span>
//                   <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display',serif]">
//                     Welcome back, {userData.fullName}!
//                   </h2>
//                   <p className="text-xs text-[#f5e6d8] max-w-md leading-relaxed">
//                     Your membership credentials are fully active and verified under the Association of Bengal.
//                   </p>
//                 </div>
//                 <div className="bg-white/10 border border-white/20 px-4 py-3 rounded-2xl text-center backdrop-blur-xs shrink-0">
//                   <span className="block text-[10px] uppercase tracking-wider text-[#f5e6d8]">Member ID</span>
//                   <span className="text-sm sm:text-base font-mono font-bold tracking-wider text-white">
//                     {memberData.memberId}
//                   </span>
//                 </div>
//               </div>

//               {/* Stats & Details Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
//                 {/* Personal Information */}
//                 <div className="bg-white p-6 border border-[#e0bfbf]/60 rounded-3xl shadow-xs space-y-4">
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] border-b border-[#e0bfbf]/30 pb-3 flex items-center gap-2">
//                     <User className="w-4 h-4 text-[#775a19]" /> Personal Information
//                   </h4>
//                   <div className="space-y-3 text-xs text-[#584141]">
//                     <div className="flex justify-between py-1 border-b border-[#e0bfbf]/20">
//                       <span className="font-semibold text-[#8c7071]">Full Name:</span>
//                       <span className="font-bold text-[#1e1b18]">{userData.fullName}</span>
//                     </div>
//                     <div className="flex justify-between py-1 border-b border-[#e0bfbf]/20">
//                       <span className="font-semibold text-[#8c7071]">Email Address:</span>
//                       <span className="font-bold text-[#1e1b18] flex items-center gap-1.5">
//                         <Mail className="w-3.5 h-3.5 text-[#775a19]" /> {userData.email}
//                       </span>
//                     </div>
//                     <div className="flex justify-between py-1">
//                       <span className="font-semibold text-[#8c7071]">Account Role:</span>
//                       <span className="font-bold text-[#1e1b18] uppercase tracking-wider">{userData.role}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Membership & Wings */}
//                 <div className="bg-white p-6 border border-[#e0bfbf]/60 rounded-3xl shadow-xs space-y-4">
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] border-b border-[#e0bfbf]/30 pb-3 flex items-center gap-2">
//                     <Award className="w-4 h-4 text-[#775a19]" /> Fellowship Details
//                   </h4>
//                   <div className="space-y-3 text-xs text-[#584141]">
//                     <div className="flex justify-between items-center py-1 border-b border-[#e0bfbf]/20">
//                       <span className="font-semibold text-[#8c7071]">Assigned Wings:</span>
//                       <div className="flex flex-wrap gap-1 justify-end">
//                         {memberData.wings && memberData.wings.length > 0 ? (
//                           memberData.wings.map((wing: string, idx: number) => (
//                             <span key={idx} className="px-2 py-0.5 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] rounded-md text-[10px] font-bold">
//                               {wing}
//                             </span>
//                           ))
//                         ) : (
//                           <span className="font-bold text-[#1e1b18]">General Member</span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex justify-between py-1 border-b border-[#e0bfbf]/20">
//                       <span className="font-semibold text-[#8c7071]">Chapter Location:</span>
//                       <span className="font-bold text-[#1e1b18] flex items-center gap-1.5">
//                         <Globe className="w-3.5 h-3.5 text-[#775a19]" /> {memberData.location?.country || memberData.country || "India"}
//                       </span>
//                     </div>
//                     <div className="flex justify-between py-1">
//                       <span className="font-semibold text-[#8c7071]">Fellowship Status:</span>
//                       <span className="font-bold text-green-700 flex items-center gap-1">
//                         <CheckCircle2 className="w-3.5 h-3.5" /> Active & Verified
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             </>
//           )}

//           {activeTab === "profile" && (
//             <div className="bg-white p-6 sm:p-8 border border-[#e0bfbf]/60 rounded-3xl shadow-xs space-y-6">
//               <h2 className="text-xl font-bold text-[#570013] font-['Playfair_Display',serif] border-b border-[#e0bfbf]/40 pb-3">
//                 Member Profile Information
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#584141]">
//                 <div className="space-y-1">
//                   <label className="block uppercase tracking-wider font-bold text-[#8c7071] text-[10px]">Full Name</label>
//                   <p className="p-3 bg-[#fbf2ed] border border-[#e0bfbf]/50 rounded-xl font-bold text-[#1e1b18]">{userData.fullName}</p>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="block uppercase tracking-wider font-bold text-[#8c7071] text-[10px]">Email Address</label>
//                   <p className="p-3 bg-[#fbf2ed] border border-[#e0bfbf]/50 rounded-xl font-bold text-[#1e1b18]">{userData.email}</p>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="block uppercase tracking-wider font-bold text-[#8c7071] text-[10px]">Member Identification Number</label>
//                   <p className="p-3 bg-[#fbf2ed] border border-[#e0bfbf]/50 rounded-xl font-bold text-[#1e1b18] font-mono">{memberData.memberId}</p>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="block uppercase tracking-wider font-bold text-[#8c7071] text-[10px]">Chapter / Region</label>
//                   <p className="p-3 bg-[#fbf2ed] border border-[#e0bfbf]/50 rounded-xl font-bold text-[#1e1b18]">{memberData.location?.country || memberData.country || "India"}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "documents" && (
//             <div className="bg-white p-6 sm:p-8 border border-[#e0bfbf]/60 rounded-3xl shadow-xs text-center space-y-4">
//               <div className="w-16 h-16 bg-[#570013]/10 text-[#570013] rounded-full flex items-center justify-center mx-auto">
//                 <FileText className="w-8 h-8" />
//               </div>
//               <h3 className="text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
//                 Digital Fellowship Certificate
//               </h3>
//               <p className="text-xs text-[#584141] max-w-sm mx-auto">
//                 Your verified digital certificate and membership badge are active under ID: <span className="font-mono font-bold text-[#570013]">{memberData.memberId}</span>.
//               </p>
//             </div>
//           )}

//         </main>
//       </div>
//     </div>
//   );
// }

"use client";
import React from 'react';

export default function DashboardPage() {
  return (
    <div>Welcome user dashboard</div>
  );
}
