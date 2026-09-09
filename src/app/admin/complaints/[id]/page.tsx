"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Send, CheckCircle, Edit3, Save } from "lucide-react";

export default function AdminComplaintDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [complaint, setComplaint] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminReply, setAdminReply] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchTicket = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/complaints?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (res.ok && data.complaint) {
        setComplaint(data.complaint);
        setStatus(data.complaint.status || "PENDING");
        setAdminReply(data.complaint.adminReply || "");
        // If there's already a reply, start in display/edit mode rather than locked
        if (!data.complaint.adminReply) {
          setIsEditing(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
    
    fetch("/api/complaints", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isRead: true }),
    });
  }, [id, fetchTicket]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/complaints", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, adminReply }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setComplaint(data.complaint);
        setSuccessMsg("Admin remark successfully published to member portal!");
        setIsEditing(false); // Lock into display view after saving
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#570013]" /></div>;
  if (!complaint) return <div className="p-8 text-center font-['Libre_Franklin',sans-serif]">Ticket not found.</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-8 font-['Libre_Franklin',sans-serif]">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <button onClick={() => router.push("/admin/complaints")} className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-xs font-bold text-[#570013] border border-gray-200 cursor-pointer shadow-2xs hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" /> Back to List
        </button>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 space-y-6 shadow-sm">
          
          {/* Header Info */}
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#775a19] bg-[#fbf2ed] px-2.5 py-1 rounded-md">{complaint.trackingId}</span>
              <h1 className="text-xl font-bold text-[#570013] mt-2">{complaint.subject}</h1>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${complaint.status === "RESOLVED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {complaint.status}
            </span>
          </div>

          {/* Member Details */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-sm">
            <div><span className="text-[10px] uppercase font-bold text-gray-400 block">Name</span>{complaint.name}</div>
            <div><span className="text-[10px] uppercase font-bold text-gray-400 block">Membership ID</span>{complaint.membershipId}</div>
            <div><span className="text-[10px] uppercase font-bold text-gray-400 block">Email</span>{complaint.email}</div>
            <div><span className="text-[10px] uppercase font-bold text-gray-400 block">Phone</span>{complaint.phone}</div>
          </div>

          {/* User Message */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-gray-400">User Complaint Message</p>
            <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-700 whitespace-pre-wrap">{complaint.message}</div>
          </div>

          {/* ADMIN REMARKS CONTROL DESK */}
          <form onSubmit={handleSave} className="space-y-4 pt-4 border-t">
            
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#570013]">Official Admin Response & Remarks</h3>
              
              {/* Edit / View Toggle Button */}
              {complaint.adminReply && !isEditing && (
                <button 
                  type="button" 
                  onClick={() => setIsEditing(true)} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Remark
                </button>
              )}
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> {successMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Update Ticket Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white cursor-pointer focus:ring-2 focus:ring-[#570013]">
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            {/* Editable Text Area OR Clean Preview Box */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Admin Remark Message</label>
              
              {isEditing ? (
                <textarea 
                  rows={4} 
                  value={adminReply} 
                  onChange={(e) => setAdminReply(e.target.value)} 
                  placeholder="Type official remark response here..." 
                  className="w-full p-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#570013]" 
                />
              ) : (
                <div className="p-4 bg-[#fbf2ed] rounded-xl border border-[#775a19]/30 text-sm whitespace-pre-wrap leading-relaxed text-gray-800">
                  {complaint.adminReply || "No remark published yet."}
                </div>
              )}
            </div>

            {/* Submit / Send Button (Only shown when editing) */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-2">
                {complaint.adminReply && (
                  <button 
                    type="button" 
                    onClick={() => { setAdminReply(complaint.adminReply); setIsEditing(false); }} 
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold uppercase rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#570013] text-white text-xs font-bold uppercase rounded-xl hover:bg-[#800020] cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send & Publish Remark
                </button>
              </div>
            )}

          </form>

        </div>
      </div>
    </div>
  );
}