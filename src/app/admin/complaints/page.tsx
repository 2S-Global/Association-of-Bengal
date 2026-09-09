"use client";

import React, { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Search, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  Eye, 
  HelpCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ModernAdminComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, PENDING, IN_PROGRESS, RESOLVED

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const res = await fetch("/api/complaints");
        const data = await res.json();
        if (data.success) {
          setComplaints(data.complaints || []);
        }
      } catch (err) {
        console.error("Failed to load complaints", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.membershipId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "ALL" || item.category === filterCategory;
    
    const matchesTab = 
      activeTab === "ALL" ? true :
      activeTab === "RESOLVED" ? (item.status === "RESOLVED" || item.status === "CLOSED") :
      item.status === activeTab;

    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827] font-['Libre_Franklin',sans-serif] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Modern Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#570013]/10 flex items-center justify-center text-[#570013] shrink-0">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#570013] font-['Playfair_Display',serif]">
                Support Grievance Control
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Monitor member inquiries, update ticket statuses, and publish official support remarks.
              </p>
            </div>
          </div>
        </div>

        {/* Search, Status Tabs & Category Filtering Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Status Tabs Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {["ALL", "PENDING", "IN_PROGRESS", "RESOLVED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab 
                    ? "bg-[#570013] text-white shadow-xs" 
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Search Bar & Category Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search tracking ID, name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#570013] bg-gray-50/50"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-gray-200 text-xs sm:text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#570013] text-gray-700 cursor-pointer hidden sm:block"
            >
              <option value="ALL">All Categories</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Membership & Verification">Membership & Verification</option>
              <option value="Payment & Receipts">Payment & Receipts</option>
              <option value="Portal / Technical Issue">Portal / Technical Issue</option>
              <option value="Other Grievance">Other Grievance</option>
            </select>
          </div>

        </div>

        {/* Modern Data Table */}
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-28 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#570013]" />
              <p className="text-xs uppercase font-bold tracking-widest text-gray-400">Loading Support Tickets...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-28 space-y-3 text-gray-500">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <HelpCircle className="w-8 h-8" />
              </div>
              <p className="font-bold text-gray-700 text-base">No support tickets found</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">Try clearing your filters or search criteria to view active submissions.</p>
            </div>
          ) : (
            <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fbf2ed] text-[#570013] text-[11px] uppercase tracking-wider border-b border-gray-100">
                    <th className="py-4 px-5 font-bold whitespace-nowrap">Tracking ID</th>
                    <th className="py-4 px-5 font-bold whitespace-nowrap">Member Name & ID</th>
                    <th className="py-4 px-5 font-bold whitespace-nowrap">Category</th>
                    <th className="py-4 px-5 font-bold whitespace-nowrap">Status</th>
                    <th className="py-4 px-5 font-bold whitespace-nowrap">Date Filed</th>
                    <th className="py-4 px-6 font-bold text-center whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {filteredComplaints.map((item) => {
                    const isResolved = item.status === "RESOLVED" || item.status === "CLOSED";
                    const isInProgress = item.status === "IN_PROGRESS";
                    return (
                      <tr key={item._id || item.id} className="hover:bg-gray-50/60 transition-colors">
                        
                        {/* Tracking ID */}
                        <td className="py-4 px-5 font-mono font-bold text-[#570013] whitespace-nowrap">
                          <span className="bg-[#fbf2ed] px-2.5 py-1 rounded-md border border-[#775a19]/20 text-xs inline-block">
                            {item.trackingId}
                          </span>
                        </td>

                        <td className="py-4 px-5 whitespace-nowrap">
                          <div className="font-bold text-gray-900">{item.name}</div>
                          <div className="text-[11px] text-gray-400 font-mono">{item.membershipId}</div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-5 whitespace-nowrap">
                          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 inline-block">
                            {item.category}
                          </span>
                        </td>

                        <td className="py-4 px-5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isResolved 
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                              : isInProgress
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}>
                            {isResolved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-amber-600" />}
                            {item.status}
                          </span>
                        </td>

                        <td className="py-4 px-5 text-xs text-gray-500 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        {/* Action Button Column with safe right padding */}
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <button
                            onClick={() => router.push(`/admin/complaints/${item._id || item.id}`)}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#570013] text-white hover:bg-[#800020] transition-all cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" /> Manage
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}