"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LifeBuoy, PlusCircle, MessageSquare, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function UserComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [membershipId] = useState("ABLC-2026-6338"); // Logged-in member ID

  useEffect(() => {
    async function fetchMyComplaints() {
      try {
        const res = await fetch(`/api/complaints?membershipId=${encodeURIComponent(membershipId)}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setComplaints(data.complaints || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyComplaints();
  }, [membershipId]);

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18] font-['Libre_Franklin',sans-serif] py-8 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#e0bfbf]/80 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-[#570013] font-['Playfair_Display',serif]">Support Tickets</h1>
            <p className="text-sm text-gray-500">View your requests and official admin remarks.</p>
          </div>
          <button onClick={() => router.push("/complaint")} className="inline-flex items-center gap-2 px-5 py-3 bg-[#570013] text-white text-xs font-bold uppercase rounded-xl cursor-pointer">
            <PlusCircle className="w-4 h-4" /> File New Ticket
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#570013]" /></div>
        ) : complaints.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border text-center space-y-3">
            <p className="text-sm text-gray-500">No support tickets found.</p>
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
                  <p className="text-[10px] uppercase font-bold text-gray-400">Your Inquiry</p>
                  <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">{item.message}</div>
                </div>

                {/* ADMIN REMARK SECTION */}
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
        )}

      </div>
    </div>
  );
}