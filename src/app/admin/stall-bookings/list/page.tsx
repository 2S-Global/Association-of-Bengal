
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
  X,
  CheckCircle2,
  XCircle,
  ArrowLeft
} from "lucide-react";

interface HistoryItem {
  action: string;
  amount?: string;
  remark?: string;
  date: string;
}

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
  status?: string;
  amount?: string;
  remark?: string;
  history?: HistoryItem[];
}

export default function AdminStallBookingsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  
  const [modalMode, setModalMode] = useState<'view' | 'accept_prompt' | 'reconsider_prompt' | 'reject_prompt' | 'success'>('view');
  const [inputAmount, setInputAmount] = useState<string>("");
  const [inputRemark, setInputRemark] = useState<string>("");
  const [reconsiderReason, setReconsiderReason] = useState<string>("");

  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Document Viewer Modal State
  const [viewerData, setViewerData] = useState<{ url: string; type: 'image' | 'pdf' } | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stallBooking");
      const data = await res.json();

      if (data.success) {
        const sortedData = (data.data || []).sort((a: Application, b: Application) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setApplications(sortedData);
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

  const handleAppAction = async (appId: string, action: 'ACCEPTED' | 'REJECTED') => {
    try {
      setActionLoading(true);
      setActionMessage(null);

      if (action === 'ACCEPTED' && !inputAmount.trim()) {
        setActionMessage({
          type: 'error',
          text: 'Please enter the payable amount before accepting the application.'
        });
        setActionLoading(false);
        return;
      }

      let finalRemark = inputRemark;
      if (modalMode === 'reconsider_prompt' && reconsiderReason.trim()) {
        finalRemark = `Reconsidered: ${reconsiderReason} | Note: ${inputRemark}`;
      }

      const res = await fetch(`/api/stallBooking/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          applicationId: appId, 
          status: action, 
          amount: action === 'ACCEPTED' ? inputAmount : undefined, 
          remark: finalRemark 
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const updatedRecord = data.data;

        setApplications(prev => 
          prev.map(app => app._id === appId ? (updatedRecord || { ...app, status: action, amount: action === 'ACCEPTED' ? inputAmount : undefined, remark: finalRemark }) : app)
        );
        
        if (selectedApp && selectedApp._id === appId) {
          setSelectedApp(updatedRecord || (prev => prev ? { ...prev, status: action, amount: action === 'ACCEPTED' ? inputAmount : undefined, remark: finalRemark } : null));
        }

        setModalMode('success');
        setActionMessage({
          type: 'success',
          text: `Application successfully ${action.toLowerCase()} and email notification sent!`
        });

        setTimeout(() => {
          setSelectedApp(null);
          setModalMode('view');
          fetchApplications();
        }, 1500);

      } else {
        setActionMessage({
          type: 'error',
          text: data.error || `Failed to process application ${action.toLowerCase()}.`
        });
      }
    } catch (err) {
      console.error("Action error:", err);
      setActionMessage({
        type: 'error',
        text: "An unexpected error occurred while processing the request."
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openDocument = (url?: string) => {
    if (!url) return;
    const fullUrl = url.startsWith('http') ? url : url;
    const isPdf = 
      fullUrl.toLowerCase().includes('.pdf') || 
      fullUrl.toLowerCase().includes('/raw/') ||
      fullUrl.toLowerCase().includes('format_pdf');

    setViewerData({
      url: fullUrl,
      type: isPdf ? 'pdf' : 'image',
    });
  };

  const filteredApplications = applications.filter((app) => 
    app.participant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.participant_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.participant_mobile?.includes(searchQuery)
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 bg-[#fff8f5] min-h-screen text-[#1e1b18] font-['Libre_Franklin']">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-[#e0bfbf] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
            <Store className="w-6 h-6 sm:w-7 sm:h-7 text-[#570013]" />
            Stall Applications
          </h1>
          <p className="text-xs sm:text-sm text-[#775a19] mt-1 font-medium">
            Manage and view all registered participant stall bookings for the International Kolkata Book Fair 2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#fbf2ed] border border-[#e0bfbf] px-4 py-2 rounded-xl text-xs font-bold text-[#570013] whitespace-nowrap">
            Total Bookings: {applications.length}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#e0bfbf] shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-[#8c7071] ml-2 shrink-0" />
        <input
          type="text"
          placeholder="Search by participant name, email, or mobile number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none text-[#1e1b18] placeholder:text-gray-400"
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
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fbf2ed] border-b border-[#e0bfbf] text-[10px] sm:text-[11px] font-bold text-[#570013] uppercase tracking-wider">
                  <th className="py-3 px-3 sm:px-5">Participant</th>
                  <th className="py-3 px-3 sm:px-5">Contact</th>
                  <th className="py-3 px-3 sm:px-5">Space</th>
                  <th className="py-3 px-3 sm:px-5">Status</th>
                  <th className="py-3 px-3 sm:px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0bfbf]/50 text-xs sm:text-sm">
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-[#fff8f5]/60 transition-colors">
                    
                    <td className="py-3 px-3 sm:px-5 font-semibold text-[#1e1b18]">
                      <div className="text-xs sm:text-sm font-bold truncate max-w-[160px] sm:max-w-xs">{app.participant_name}</div>
                      <div className="text-[10px] text-gray-500 font-normal truncate max-w-[160px] sm:max-w-xs">{app.participant_bengali}</div>
                    </td>

                    <td className="py-3 px-3 sm:px-5 text-[11px] sm:text-xs text-[#584141]">
                      <div className="flex items-center gap-1 truncate max-w-[150px] sm:max-w-[200px]">
                        <Mail className="w-3 h-3 text-[#775a19] shrink-0" /> 
                        <span className="truncate">{app.participant_email}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#775a19] shrink-0" /> 
                        <span>{app.participant_mobile}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 sm:px-5 whitespace-nowrap">
                      <span className="bg-[#fff0f0] text-[#570013] border border-[#e0bfbf] px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold">
                        {app.space_requirement} sq.m
                      </span>
                    </td>

                    <td className="py-3 px-3 sm:px-5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                        app.status === 'ACCEPTED' 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : app.status === 'REJECTED' 
                          ? 'bg-red-100 text-red-800 border border-red-300' 
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {app.status || 'PENDING'}
                      </span>
                    </td>

                    <td className="py-3 px-3 sm:px-5 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedApp(app);
                          setInputAmount(app.amount || "");
                          setInputRemark("");
                          setReconsiderReason("");
                          setModalMode('view');
                          setActionMessage(null);
                        }}
                        className="bg-[#570013] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#800020] transition-all cursor-pointer shadow-xs inline-flex items-center gap-1"
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

      {/* Detailed View Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border-2 border-[#e0bfbf] relative overflow-y-auto my-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-20 flex items-center justify-between border-b border-[#e0bfbf] px-4 sm:px-6 py-4 shadow-xs">
              <div className="flex items-center gap-3">
                {modalMode !== 'view' && modalMode !== 'success' && (
                  <button 
                    type="button"
                    onClick={() => { setModalMode('view'); setActionMessage(null); }}
                    className="p-1.5 bg-[#fbf2ed] hover:bg-[#e0bfbf] rounded-full transition-all text-[#570013] cursor-pointer"
                    title="Back to Details"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <h3 className="font-['Playfair_Display'] text-lg sm:text-xl font-bold text-[#570013] flex flex-wrap items-center gap-2">
                    {modalMode === 'view' ? "Application Details" : modalMode === 'accept_prompt' ? "Accept Application & Send Invoice" : modalMode === 'reconsider_prompt' ? "Reconsider Cancelled Application" : modalMode === 'reject_prompt' ? "Reject Application & Send Update" : "Action Completed Successfully"}
                    {selectedApp.status && modalMode === 'view' && (
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                        selectedApp.status === 'ACCEPTED' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {selectedApp.status}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#775a19]">
                    {modalMode === 'view' ? `Submitted on ${new Date(selectedApp.createdAt).toLocaleDateString()}` : `Participant: ${selectedApp.participant_name}`}
                  </p>
                </div>
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
            <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-[#1e1b18]">
              
              {actionMessage && actionMessage.type === 'error' && (
                <div className="p-3.5 sm:p-4 rounded-xl border flex items-center gap-2.5 text-xs font-bold bg-red-50 border-red-300 text-red-900">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{actionMessage.text}</span>
                </div>
              )}

              {modalMode === 'view' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-1">
                      <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider">Participant Name</span>
                      <p className="font-bold text-[#570013] break-words">{selectedApp.participant_name}</p>
                      <p className="text-xs text-gray-600">{selectedApp.participant_bengali}</p>
                    </div>

                    <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-1">
                      <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider">Contact Details</span>
                      <p className="font-bold break-all">{selectedApp.participant_email}</p>
                      <p className="font-bold">{selectedApp.participant_mobile}</p>
                    </div>

                    <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-1">
                      <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider">GSTIN</span>
                      <p className="font-bold text-[#1e1b18]">{selectedApp.participant_gst || "N/A"}</p>
                    </div>

                    <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-1 sm:col-span-2 lg:col-span-2">
                      <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider">Address</span>
                      <p className="font-medium break-words">{selectedApp.participant_address}</p>
                    </div>

                    <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-1">
                      <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider">Stock & Value</span>
                      <p><strong>Stock Value:</strong> ₹ {selectedApp.stock_value}</p>
                      <p><strong>Copies:</strong> {selectedApp.titles_copies}</p>
                    </div>

                    <div className="bg-[#fbf2ed] p-3.5 rounded-xl border border-[#e0bfbf]/60 space-y-1 sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider block">Uploaded Documents</span>
                        <span className="text-xs text-gray-600">Verify PAN and Address proof files directly</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.pan_card_doc && (
                          <button 
                            type="button"
                            onClick={() => openDocument(selectedApp.pan_card_doc)} 
                            className="bg-[#570013] text-white text-xs font-bold px-3.5 py-2 rounded-lg text-center cursor-pointer hover:bg-[#800020]"
                          >
                            View PAN
                          </button>
                        )}
                        {selectedApp.address_proof_doc && (
                          <button 
                            type="button"
                            onClick={() => openDocument(selectedApp.address_proof_doc)} 
                            className="bg-[#570013] text-white text-xs font-bold px-3.5 py-2 rounded-lg text-center cursor-pointer hover:bg-[#800020]"
                          >
                            View Address Proof
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Restored Live Admin Decision Record Summary Box */}
                  {(selectedApp.amount || selectedApp.remark || selectedApp.status) && (
                    <div className={`border-l-4 p-4 rounded-xl space-y-1 text-xs ${
                      selectedApp.status === 'REJECTED' 
                        ? 'bg-red-50 border-red-600 text-red-900' 
                        : selectedApp.status === 'ACCEPTED'
                        ? 'bg-green-50 border-green-600 text-green-900'
                        : 'bg-[#fef3c7] border-amber-600 text-amber-900'
                    }`}>
                      <h4 className="font-bold uppercase tracking-wider text-[10px] opacity-80">
                        {selectedApp.status === 'REJECTED' ? 'Cancellation / Rejection Record' : 'Admin Decision Record'}
                      </h4>
                      {selectedApp.status && <p><strong>Status:</strong> {selectedApp.status}</p>}
                      {selectedApp.amount && <p><strong>Assigned Payable Amount:</strong> ₹{selectedApp.amount}</p>}
                      {selectedApp.remark && (
                        <p>
                          <strong>{selectedApp.status === 'REJECTED' ? 'Reason for Cancellation / Rejection:' : 'Admin Remark / Instructions:'}</strong> {selectedApp.remark}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 📜 Action History & Audit Log Timeline (Descending Order with Step 1, 2, 3...) */}
                  {selectedApp.history && selectedApp.history.length > 0 && (
                    <div className="bg-[#fbf2ed] p-4 rounded-2xl border border-[#e0bfbf] space-y-3">
                      <h4 className="font-bold uppercase tracking-wider text-[10px] text-[#570013] border-b border-[#e0bfbf]/50 pb-2 flex items-center justify-between">
                        <span>📜 Action History & Audit Log (Newest First)</span>
                        <span className="bg-white px-2 py-0.5 rounded-full text-[#775a19]">{selectedApp.history.length} Events</span>
                      </h4>
                      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                        {[...selectedApp.history].reverse().map((item, idx) => {
                          const stepNumber = selectedApp.history!.length - idx;
                          return (
                            <div key={idx} className="bg-white p-3 rounded-xl border border-[#e0bfbf]/60 space-y-1 text-xs">
                              <div className="flex items-center justify-between">
                                <span className={`font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded ${
                                  item.action === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  Step {stepNumber}: {item.action}
                                </span>
                                <span className="text-gray-400 font-mono text-[10px]">
                                  {new Date(item.date).toLocaleString()}
                                </span>
                              </div>
                              {item.amount && (
                                <p className="text-[#570013] font-bold">Payable Amount: ₹{item.amount}</p>
                              )}
                              {item.remark && (
                                <p className="text-gray-700 bg-[#fff8f5] p-2 rounded-lg border border-[#e0bfbf]/30">
                                  <strong className="text-[#775a19]">Note:</strong> {item.remark}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : modalMode === 'accept_prompt' ? (
                <div className="bg-[#fbf2ed] p-6 rounded-2xl border border-[#e0bfbf] space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#570013]">Acceptance Form & Payment Request</h4>
                    <p className="text-xs text-[#775a19]">Provide the payable stall booking fee and optional payment instructions.</p>
                  </div>

                  {selectedApp.remark && (
                    <div className="bg-white/80 p-3 rounded-xl border border-[#e0bfbf]/60 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Previous Remark Reference:</span>
                      <p className="text-xs text-gray-700 italic">{selectedApp.remark}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#775a19] mb-1">Total Payable Amount (₹) *</label>
                      <input 
                        type="text"
                        placeholder="e.g., 5000"
                        value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value)}
                        className="w-full bg-white border border-[#e0bfbf] px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#775a19] mb-1">New Admin Remarks / Instructions (Optional)</label>
                      <textarea 
                        rows={3}
                        placeholder="Type new remarks for this acceptance step..."
                        value={inputRemark}
                        onChange={(e) => setInputRemark(e.target.value)}
                        className="w-full bg-white border border-[#e0bfbf] px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : modalMode === 'reconsider_prompt' ? (
                <div className="bg-[#fbf2ed] p-6 rounded-2xl border border-[#e0bfbf] space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-amber-900">Reconsider Cancelled / Rejected Application</h4>
                    <p className="text-xs text-[#775a19]">Explain why this previously rejected application is being reconsidered and approved.</p>
                  </div>

                  {selectedApp.remark && (
                    <div className="bg-white/80 p-3 rounded-xl border border-[#e0bfbf]/60 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Previous Rejection/Cancellation Reason:</span>
                      <p className="text-xs text-gray-700 italic">{selectedApp.remark}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 mb-1">Reason for Reconsideration *</label>
                      <textarea 
                        rows={2}
                        placeholder="e.g., Participant provided missing documents and appealed successfully."
                        value={reconsiderReason}
                        onChange={(e) => setReconsiderReason(e.target.value)}
                        className="w-full bg-white border border-[#e0bfbf] px-3.5 py-2 rounded-xl text-xs font-medium focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#775a19] mb-1">Total Payable Amount (₹) *</label>
                      <input 
                        type="text"
                        placeholder="e.g., 5000"
                        value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value)}
                        className="w-full bg-white border border-[#e0bfbf] px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#775a19] mb-1">Additional New Remarks (Optional)</label>
                      <textarea 
                        rows={2}
                        placeholder="Type any new instructions..."
                        value={inputRemark}
                        onChange={(e) => setInputRemark(e.target.value)}
                        className="w-full bg-white border border-[#e0bfbf] px-3.5 py-2 rounded-xl text-xs font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : modalMode === 'reject_prompt' ? (
                <div className="bg-[#fbf2ed] p-6 rounded-2xl border border-[#e0bfbf] space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-red-800">Cancellation / Rejection Reason</h4>
                    <p className="text-xs text-gray-600">Provide a clear note explaining why this booking is being declined or canceled.</p>
                  </div>

                  {selectedApp.remark && (
                    <div className="bg-white/80 p-3 rounded-xl border border-[#e0bfbf]/60 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Previous Remark Reference:</span>
                      <p className="text-xs text-gray-700 italic">{selectedApp.remark}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-[#775a19] mb-1">Remark / Reason for Cancellation *</label>
                    <textarea 
                      rows={3}
                      placeholder="e.g., Spatial limitations, incomplete documents, or missed payment deadline."
                      value={inputRemark}
                      onChange={(e) => setInputRemark(e.target.value)}
                      className="w-full bg-white border border-[#e0bfbf] px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-300 p-8 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                  <h4 className="font-bold text-base text-green-900">Success!</h4>
                  <p className="text-xs sm:text-sm text-green-800 max-w-md mx-auto">
                    {actionMessage?.text || "The application status has been updated and the notification email has been successfully dispatched."}
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="sticky bottom-0 bg-white z-20 border-t border-[#e0bfbf] px-4 sm:px-6 py-4 shadow-inner flex flex-col sm:flex-row items-center gap-3">
              {modalMode === 'view' ? (
                <>
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedApp.status !== 'ACCEPTED' && selectedApp.status !== 'REJECTED' && (
                      <button
                        type="button"
                        onClick={() => { setModalMode('accept_prompt'); setInputRemark(""); }}
                        className="bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-all cursor-pointer text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accept Application
                      </button>
                    )}

                    {selectedApp.status === 'REJECTED' && (
                      <button
                        type="button"
                        onClick={() => { setModalMode('reconsider_prompt'); setInputRemark(""); }}
                        className="bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-all cursor-pointer text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Reconsider Application
                      </button>
                    )}

                    {selectedApp.status !== 'REJECTED' && (
                      <button
                        type="button"
                        onClick={() => { setModalMode('reject_prompt'); setInputRemark(""); }}
                        className={`bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-800 transition-all cursor-pointer text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 ${selectedApp.status === 'ACCEPTED' ? 'sm:col-span-2' : ''}`}
                      >
                        <XCircle className="w-4 h-4" />
                        {selectedApp.status === 'ACCEPTED' ? 'Cancel / Reject Booking' : 'Reject Application'}
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="w-full sm:w-auto px-6 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] font-bold py-3 rounded-xl hover:bg-[#e0bfbf] transition-all cursor-pointer text-xs sm:text-sm whitespace-nowrap"
                  >
                    Close
                  </button>
                </>
              ) : modalMode === 'accept_prompt' ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleAppAction(selectedApp._id, 'ACCEPTED')}
                    className="bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-all cursor-pointer text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Confirm & Send Invoice Mail
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalMode('view')}
                    className="bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] font-bold py-3 rounded-xl hover:bg-[#e0bfbf] transition-all cursor-pointer text-xs sm:text-sm"
                  >
                    Back to Details
                  </button>
                </div>
              ) : modalMode === 'reconsider_prompt' ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleAppAction(selectedApp._id, 'ACCEPTED')}
                    className="bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-all cursor-pointer text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Confirm Reconsideration & Send Mail
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalMode('view')}
                    className="bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] font-bold py-3 rounded-xl hover:bg-[#e0bfbf] transition-all cursor-pointer text-xs sm:text-sm"
                  >
                    Back to Details
                  </button>
                </div>
              ) : modalMode === 'reject_prompt' ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleAppAction(selectedApp._id, 'REJECTED')}
                    className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-800 transition-all cursor-pointer text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Confirm Cancellation & Send Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalMode('view')}
                    className="bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] font-bold py-3 rounded-xl hover:bg-[#e0bfbf] transition-all cursor-pointer text-xs sm:text-sm"
                  >
                    Back to Details
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { setSelectedApp(null); setModalMode('view'); fetchApplications(); }}
                  className="w-full bg-[#570013] text-white font-bold py-3 rounded-xl hover:bg-[#800020] transition-all cursor-pointer text-xs sm:text-sm"
                >
                  Done & Close
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Embedded Document Viewer Modal (Bypasses download triggers via Google Docs Viewer for PDFs) */}
      {viewerData && (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 transition-all">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="bg-[#fbf2ed] flex items-center justify-between px-6 py-4 border-b border-[#e0bfbf]">
              <h3 className="font-bold text-[#570013] flex items-center gap-2 text-sm sm:text-base">
                <FileText className="w-5 h-5 text-[#570013]" />
                Document Viewer Modal
              </h3>
              <button
                type="button"
                onClick={() => setViewerData(null)}
                className="px-4 py-1.5 bg-[#570013] text-white font-bold rounded-lg hover:bg-[#800020] transition-all text-xs cursor-pointer"
              >
                Close Viewer
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 overflow-hidden relative">
              {viewerData.type === 'pdf' ? (
                <iframe 
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(viewerData.url)}&embedded=true`} 
                  className="w-full h-full rounded-xl border border-gray-300 shadow-inner bg-white"
                  title="PDF Document Viewer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  <img 
                    src={viewerData.url} 
                    alt="Document Preview" 
                    className="max-w-full max-h-full object-contain rounded-xl shadow-md"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.error-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'error-fallback text-center p-6 bg-white rounded-xl shadow-sm border border-red-200';
                        fallback.innerHTML = `
                          <p class="text-xs font-bold text-red-800 mb-2">Unable to load image preview.</p>
                          <a href="${viewerData.url}" target="_blank" rel="noopener noreferrer" class="text-xs bg-[#570013] text-white px-4 py-2 rounded-lg font-bold inline-block">Open file in new tab</a>
                        `;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}