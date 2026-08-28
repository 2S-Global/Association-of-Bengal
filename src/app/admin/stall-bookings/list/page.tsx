"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  FileText, 
  Mail, 
  Phone, 
  Loader2, 
  AlertCircle,
  Store,
  X
} from "lucide-react";

interface Application {
  _id: string;
  participant_name: string;
  participant_bengali: string;
  participant_address: string;
  participant_email: string;
  participant_gst?: string;
  participant_head: string;
  participant_mobile: string;
  participant_rep: string;
  space_requirement: string;
  pan_card_doc?: string;
  address_proof_doc?: string;
  titles_copies: string;
  stock_value: string;
  declaration_date: string;
  declaration_place: string;
  createdAt: string;
}

export default function AdminStallBookingsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stallBooking");
      const data = await res.json();

      if (data.success) {
        setApplications(data.data || []);
      } else {
        setError(data.error || "Failed to load bookings.");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("An error occurred while fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => 
    app.participant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.participant_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.participant_mobile?.includes(searchQuery)
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-[#fff8f5] min-h-screen text-[#1e1b18] font-['Libre_Franklin'] overflow-x-hidden">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e0bfbf] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
            <Store className="w-7 h-7 text-[#570013]" />
            Stall Applications
          </h1>
          <p className="text-xs sm:text-sm text-[#775a19] mt-1 font-medium">
            Manage and view all registered participant stall bookings for the International Kolkata Book Fair 2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#fbf2ed] border border-[#e0bfbf] px-4 py-2 rounded-xl text-xs font-bold text-[#570013]">
            Total Bookings: {applications.length}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e0bfbf] shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-[#8c7071] ml-2 shrink-0" />
        <input
          type="text"
          placeholder="Search by participant name, email, or mobile number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm font-medium focus:outline-none text-[#1e1b18] placeholder:text-gray-400"
        />
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#e0bfbf] shadow-sm">
          <Loader2 className="w-10 h-10 animate-spin text-[#570013] mb-3" />
          <p className="text-sm font-bold text-[#584141]">Loading bookings...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-300 p-6 rounded-2xl text-center text-red-900">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="font-bold">{error}</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e0bfbf] p-12 text-center shadow-sm">
          <FileText className="w-12 h-12 text-[#e0bfbf] mx-auto mb-3" />
          <h3 className="font-bold text-base text-[#570013]">No Bookings Found</h3>
          <p className="text-xs text-gray-500 mt-1">No applications match your search query.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e0bfbf] shadow-sm overflow-hidden">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fbf2ed] border-b border-[#e0bfbf] text-[11px] font-bold text-[#570013] uppercase tracking-wider">
                  <th className="py-4 px-6">Participant</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6">Space Requirement</th>
                  <th className="py-4 px-6">Stock Value</th>
                  <th className="py-4 px-6">Documents</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0bfbf]/50 text-sm">
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-[#fff8f5]/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#1e1b18]">
                      <div>{app.participant_name}</div>
                      <div className="text-xs font-normal text-gray-500">{app.participant_bengali}</div>
                    </td>
                    <td className="py-4 px-6 text-xs text-[#584141] space-y-1">
                      <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#775a19]" /> {app.participant_email}</div>
                      <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#775a19]" /> {app.participant_mobile}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-[#fff0f0] text-[#570013] border border-[#e0bfbf] px-3 py-1 rounded-full text-xs font-bold">
                        {app.space_requirement} sq. mt.
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-xs text-[#1e1b18]">
                      ₹ {app.stock_value}
                    </td>
                    <td className="py-4 px-6 space-x-2">
                      {app.pan_card_doc && (
                        <a href={app.pan_card_doc} target="_blank" rel="noopener noreferrer" className="text-xs text-[#570013] underline font-bold hover:text-[#800020]">
                          PAN
                        </a>
                      )}
                      {app.address_proof_doc && (
                        <a href={app.address_proof_doc} target="_blank" rel="noopener noreferrer" className="text-xs text-[#570013] underline font-bold hover:text-[#800020]">
                          Address Proof
                        </a>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedApp(app)}
                        className="bg-[#570013] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#800020] transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed View Modal (Showing all comprehensive record information) */}
      {/* Detailed View Modal (Properly layered and aligned) */}
      {selectedApp && (
        <div className="fixed inset-0 z-[99999] bg-black/30 flex items-center justify-center lg:pl-[270px] p-4 p-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[82vh] flex flex-col shadow-2xl border-2 border-[#e0bfbf] relative overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-20 flex items-center justify-between border-b border-[#e0bfbf] px-6 py-4 shadow-xs">
              <div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#570013]">
                  Application Details
                </h3>
                <p className="text-xs text-[#775a19]">Submitted on {new Date(selectedApp.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-2 bg-[#fbf2ed] hover:bg-[#e0bfbf] rounded-full transition-all text-[#570013] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 space-y-4 text-xs sm:text-sm text-[#1e1b18]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-1">
                  <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider">Participant Name</span>
                  <p className="font-bold text-[#570013]">{selectedApp.participant_name}</p>
                  <p className="text-xs text-gray-600">{selectedApp.participant_bengali}</p>
                </div>

                <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-1">
                  <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider">Contact Details</span>
                  <p className="font-bold">{selectedApp.participant_email}</p>
                  <p className="font-bold">{selectedApp.participant_mobile}</p>
                </div>

                <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-1">
                  <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider">GSTIN</span>
                  <p className="font-bold text-[#1e1b18]">{selectedApp.participant_gst || "N/A"}</p>
                </div>

                <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-1 sm:col-span-2 lg:col-span-2">
                  <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider">Address</span>
                  <p className="font-medium">{selectedApp.participant_address}</p>
                </div>

                <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-1">
                  <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider">Declaration</span>
                  <p><strong>Date:</strong> {selectedApp.declaration_date}</p>
                  <p><strong>Place:</strong> {selectedApp.declaration_place}</p>
                </div>

                <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-1">
                  <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider">Head & Representative</span>
                  <p><strong>Head:</strong> {selectedApp.participant_head}</p>
                  <p><strong>Rep:</strong> {selectedApp.participant_rep}</p>
                </div>

                <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-1 sm:col-span-2 lg:col-span-2">
                  <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider">Stall & Stock Info</span>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <p><strong>Space:</strong> {selectedApp.space_requirement} sq.mt.</p>
                    <p><strong>Stock:</strong> ₹ {selectedApp.stock_value}</p>
                    <p><strong>Copies:</strong> {selectedApp.titles_copies}</p>
                  </div>
                </div>

                <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-2 sm:col-span-2 lg:col-span-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider block">Uploaded Documents</span>
                    <span className="text-xs text-gray-600">Verify PAN and Address proof files directly</span>
                  </div>
                  <div className="flex gap-2">
                    {selectedApp.pan_card_doc && (
                      <a href={selectedApp.pan_card_doc} target="_blank" rel="noopener noreferrer" className="bg-[#570013] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg">
                        View PAN
                      </a>
                    )}
                    {selectedApp.address_proof_doc && (
                      <a href={selectedApp.address_proof_doc} target="_blank" rel="noopener noreferrer" className="bg-[#570013] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg">
                        View Address Proof
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer / Close Action */}
            <div className="sticky bottom-0 bg-white z-20 border-t border-[#e0bfbf] px-6 py-4 shadow-inner">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="w-full bg-[#570013] text-white font-bold py-3 rounded-xl hover:bg-[#800020] transition-all cursor-pointer text-sm shadow-md"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}