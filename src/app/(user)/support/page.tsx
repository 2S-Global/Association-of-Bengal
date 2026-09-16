// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { LifeBuoy, PlusCircle, MessageSquare, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

// export default function UserComplaintsPage() {
//   const router = useRouter();
//   const [complaints, setComplaints] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [membershipId] = useState("ABLC-2026-6338"); // Logged-in member ID

//   useEffect(() => {
//     async function fetchMyComplaints() {
//       try {
//         const res = await fetch(`/api/complaints?membershipId=${encodeURIComponent(membershipId)}`);
//         const data = await res.json();
//         if (res.ok && data.success) {
//           setComplaints(data.complaints || []);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchMyComplaints();
//   }, [membershipId]);

//   return (
//     <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18] font-['Libre_Franklin',sans-serif] py-8 px-4 sm:px-8">
//       <div className="max-w-3xl mx-auto space-y-6">
        
//         <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#e0bfbf]/80 shadow-sm">
//           <div>
//             <h1 className="text-2xl font-bold text-[#570013] font-['Playfair_Display',serif]">Support Tickets</h1>
//             <p className="text-sm text-gray-500">View your requests and official admin remarks.</p>
//           </div>
//           <button onClick={() => router.push("/complaint")} className="inline-flex items-center gap-2 px-5 py-3 bg-[#570013] text-white text-xs font-bold uppercase rounded-xl cursor-pointer">
//             <PlusCircle className="w-4 h-4" /> File New Ticket
//           </button>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#570013]" /></div>
//         ) : complaints.length === 0 ? (
//           <div className="bg-white p-12 rounded-2xl border text-center space-y-3">
//             <p className="text-sm text-gray-500">No support tickets found.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {complaints.map((item) => (
//               <div key={item._id} className="bg-white rounded-2xl border border-[#e0bfbf]/80 p-6 space-y-4 shadow-sm">
//                 <div className="flex justify-between items-center border-b pb-3">
//                   <div>
//                     <span className="text-xs font-mono font-bold text-[#775a19] bg-[#fbf2ed] px-2.5 py-1 rounded-md">{item.trackingId}</span>
//                     <h3 className="text-base font-bold text-gray-900 mt-1">{item.subject}</h3>
//                   </div>
//                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === "RESOLVED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
//                     {item.status}
//                   </span>
//                 </div>

//                 <div className="space-y-1">
//                   <p className="text-[10px] uppercase font-bold text-gray-400">Your Inquiry</p>
//                   <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">{item.message}</div>
//                 </div>

//                 {/* ADMIN REMARK SECTION */}
//                 <div className="space-y-2 pt-2 border-t">
//                   <div className="flex items-center gap-2 text-[#570013]">
//                     <MessageSquare className="w-4 h-4 text-[#775a19]" />
//                     <h4 className="text-xs font-bold uppercase tracking-wider">Official Admin Remark / Response</h4>
//                   </div>

//                   {item.adminReply ? (
//                     <div className="p-4 bg-[#fbf2ed] rounded-xl border border-[#775a19]/30 text-sm whitespace-pre-wrap">
//                       {item.adminReply}
//                     </div>
//                   ) : (
//                     <div className="p-3 bg-gray-50 rounded-xl text-gray-500 text-xs italic">
//                       Pending review. An admin will add remarks shortly.
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, MessageSquare, Loader2, Send } from "lucide-react";

export default function UserComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");

  // Pre-filled form state
  const [formData, setFormData] = useState({
    membershipId: "",
    name: "",
    email: "",
    phone: "",
    category: "General Inquiry",
    subject: "",
    message: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function initUserData() {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
        if (!token) {
          router.push("/login");
          return;
        }

        // 1. Fetch user complaints securely using the token header
        const res = await fetch(`/api/complaints`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setComplaints(data.complaints || []);
        }

        // 2. Pre-fill user information from saved local storage profile options
        const storedUser = localStorage.getItem("user");
        const storedMember = localStorage.getItem("member");
        const storedLoginData = localStorage.getItem("loginData") || localStorage.getItem("userInfo");

        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const parsedMember = storedMember ? JSON.parse(storedMember) : null;
        const parsedLoginData = storedLoginData ? JSON.parse(storedLoginData) : null;

        const membershipIdVal = 
          parsedLoginData?.data?.member?.memberId || 
          parsedMember?.memberId || 
          parsedUser?.memberId || 
          parsedUser?.membershipId || "";

        const nameVal = 
          parsedLoginData?.data?.user?.fullName || 
          parsedLoginData?.data?.member?.fullName || 
          parsedUser?.fullName || 
          parsedMember?.fullName || "";

        const emailVal = 
          parsedLoginData?.data?.user?.email || 
          parsedUser?.email || 
          parsedMember?.email || "";

        const phoneVal = 
          parsedLoginData?.data?.user?.mobile || 
          parsedLoginData?.data?.member?.kyc?.mobile?.number || 
          parsedUser?.mobile || 
          parsedMember?.mobile || "";

        setFormData((prev) => ({
          ...prev,
          name: nameVal,
          email: emailVal,
          phone: phoneVal,
          membershipId: membershipIdVal,
        }));
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    initUserData();
  }, [router]);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Ticket created successfully! Tracking ID: ${data.trackingId}`);
        setFormData((prev) => ({ ...prev, subject: "", message: "" }));
        setActiveTab("list");
        window.location.reload();
      } else {
        setErrorMsg(data.error || "Failed to submit ticket.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18] font-['Libre_Franklin',sans-serif] py-8 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#e0bfbf]/80 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-[#570013] font-['Playfair_Display',serif]">Support Hub</h1>
            <p className="text-sm text-gray-500">View your support requests and official admin remarks.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab("list")}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${activeTab === "list" ? "bg-[#570013] text-white" : "bg-gray-100 text-gray-600"}`}
            >
              My Tickets
            </button>
            <button 
              onClick={() => setActiveTab("create")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${activeTab === "create" ? "bg-[#570013] text-white" : "bg-gray-100 text-gray-600"}`}
            >
              <PlusCircle className="w-4 h-4" /> New Ticket
            </button>
          </div>
        </div>

        {errorMsg && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{errorMsg}</div>}
        {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm">{successMsg}</div>}

        {/* TAB 1: MY TICKETS */}
        {activeTab === "list" && (
          isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#570013]" /></div>
          ) : complaints.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border text-center space-y-3 shadow-sm">
              <p className="text-sm text-gray-500">No support tickets found.</p>
              <button onClick={() => setActiveTab("create")} className="px-4 py-2 bg-[#570013] text-white text-xs font-bold uppercase rounded-xl cursor-pointer">
                File Your First Ticket
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl border border-[#e0bfbf]/80 p-6 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#775a19] bg-[#fbf2ed] px-2.5 py-1 rounded-md">{item.trackingId}</span>
                      <h3 className="text-base font-bold text-gray-900 mt-1">{item.subject}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === "RESOLVED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-400">Your Inquiry ({item.category})</p>
                    <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">{item.message}</div>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2 text-[#570013]">
                      <MessageSquare className="w-4 h-4 text-[#775a19]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Official Admin Remark / Response</h4>
                    </div>

                    {item.adminReply ? (
                      <div className="p-4 bg-[#fbf2ed] rounded-xl border border-[#775a19]/30 text-sm whitespace-pre-wrap">
                        {item.adminReply}
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl text-gray-500 text-xs italic">
                        Pending review. An admin will add remarks shortly.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* TAB 2: CREATE TICKET (PRE-FILLED) */}
        {activeTab === "create" && (
          <form onSubmit={handleSubmitTicket} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e0bfbf]/80 space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-[#570013] font-['Playfair_Display',serif]">File a Support Request</h2>
            <p className="text-xs text-gray-500">Your membership credentials are pre-filled below for automatic tracking.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input type="text" value={formData.name} readOnly className="w-full p-3 bg-gray-100 border rounded-xl text-sm text-gray-600 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Membership ID</label>
                <input type="text" value={formData.membershipId} readOnly className="w-full p-3 bg-gray-100 border rounded-xl text-sm font-mono text-gray-600 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                <input type="email" value={formData.email} readOnly className="w-full p-3 bg-gray-100 border rounded-xl text-sm text-gray-600 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                <input type="text" value={formData.phone} readOnly className="w-full p-3 bg-gray-100 border rounded-xl text-sm text-gray-600 cursor-not-allowed" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 bg-white border rounded-xl text-sm text-gray-800">
                <option value="General Inquiry">General Inquiry</option>
                <option value="Payment & Contribution">Payment & Contribution</option>
                <option value="Profile & KYC">Profile & KYC</option>
                <option value="Technical Issue">Technical Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject</label>
              <input type="text" placeholder="Brief summary of your issue" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required className="w-full p-3 bg-white border rounded-xl text-sm text-gray-800" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message Details</label>
              <textarea rows={4} placeholder="Describe your issue or request clearly..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="w-full p-3 bg-white border rounded-xl text-sm text-gray-800" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-[#570013] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 hover:bg-[#3d000d] transition-colors cursor-pointer">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Support Ticket
            </button>
          </form>
        )}

      </div>
    </div>
  );
}