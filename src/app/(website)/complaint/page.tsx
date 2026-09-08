"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle, ArrowLeft, LifeBuoy, User, Tag, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

export default function MemberComplaintPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    membershipId: "",
    subject: "",
    category: "General Inquiry",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit your request. Please try again later.");
      }

      setSubmitted(true);
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fff8f5] text-[#1e1b18] font-['Libre_Franklin',sans-serif] min-h-screen py-8 lg:py-12 px-4 sm:px-6 md:px-12 w-full">
      <div className="max-w-3xl mx-auto">
        
        {/* Main Form Container */}
        <div className="bg-white border border-[#e0bfbf]/80 rounded-2xl shadow-[0_15px_35px_rgba(87,0,19,0.06)] overflow-hidden">
          
          {/* Top Decorative Header with Integrated Back Button */}
          <div className="bg-gradient-to-r from-[#fbf2ed] to-[#fff8f5] border-b border-[#e0bfbf]/50 px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#570013] text-white shadow-sm">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-[22px] sm:text-[26px] font-bold text-[#570013] font-['Playfair_Display',serif] tracking-tight">
                  Member Support Desk
                </h1>
                <p className="text-[13px] text-[#584141]">
                  Submit your query or report any discrepancies below.
                </p>
              </div>
            </div>

            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider text-[#570013] bg-white border border-[#e0bfbf] hover:bg-[#570013] hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Portal
            </button>
          </div>

          <div className="p-6 sm:p-10">
            {submitted ? (
              <div className="text-center py-16 space-y-5 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-[#fbf2ed] rounded-full flex items-center justify-center mx-auto border border-[#775a19]/20 shadow-inner">
                  <CheckCircle2 className="w-10 h-10 text-[#775a19]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#570013] font-['Playfair_Display',serif]">
                  Request Submitted Successfully
                </h3>
                <p className="text-[#584141] max-w-md mx-auto text-[15px] leading-relaxed">
                  Thank you for reaching out. Your tracking ID has been logged, and our team will review your message shortly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        membershipId: "",
                        subject: "",
                        category: "General Inquiry",
                        message: "",
                      });
                    }}
                    className="px-8 py-3 bg-[#570013] text-white text-[13px] uppercase tracking-wider font-bold rounded-xl hover:bg-[#800020] transition-all shadow-md hover:shadow-lg"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {errorMessage && (
                  <div className="bg-[#fdf2f2] text-[#991b1b] p-4 rounded-xl border border-[#fecaca] flex items-center gap-3 text-sm animate-in fade-in duration-200">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* SECTION 1: Personal Information */}
                <div className="space-y-4">
                  <div className="border-b border-[#e0bfbf]/40 pb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#775a19]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#570013]">
                      1. Personal Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#584141] mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Dr. / Mr. / Ms. Full Name"
                        className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] bg-[#fff8f5]/30 text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013] focus:bg-white transition-all text-[14px]"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#584141] mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@domain.com"
                        className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] bg-[#fff8f5]/30 text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013] focus:bg-white transition-all text-[14px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#584141] mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+880 1XXXXXXXXX"
                        className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] bg-[#fff8f5]/30 text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013] focus:bg-white transition-all text-[14px]"
                      />
                    </div>

                    {/* Membership ID (Now Mandatory) */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#584141] mb-1.5">
                        Membership ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="membershipId"
                        required
                        value={formData.membershipId}
                        onChange={handleChange}
                        placeholder="BALC-2026-XXXX"
                        className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] bg-[#fff8f5]/30 text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013] focus:bg-white transition-all text-[14px]"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Inquiry & Subject Details */}
                <div className="space-y-4 pt-2">
                  <div className="border-b border-[#e0bfbf]/40 pb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#775a19]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#570013]">
                      2. Inquiry Classification & Subject
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Category */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#584141] mb-1.5">
                        Issue Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] bg-[#fff8f5]/30 text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013] focus:bg-white transition-all text-[14px] cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Membership & Verification">Membership & Verification</option>
                        <option value="Payment & Receipts">Payment & Receipts</option>
                        <option value="Portal / Technical Issue">Portal / Technical Issue</option>
                        <option value="Other Grievance">Other Grievance</option>
                      </select>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#584141] mb-1.5">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Summary of your inquiry"
                        className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] bg-[#fff8f5]/30 text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013] focus:bg-white transition-all text-[14px]"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Detailed Message */}
                <div className="space-y-4 pt-2">
                  <div className="border-b border-[#e0bfbf]/40 pb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#775a19]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#570013]">
                      3. Description
                    </h3>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#584141] mb-1.5">
                      Detailed Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Provide full details regarding your complaint, support request, or inquiry..."
                      className="w-full px-4 py-3.5 rounded-xl border border-[#e0bfbf] bg-[#fff8f5]/30 text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013] focus:bg-white transition-all text-[14px] resize-none"
                    />
                  </div>
                </div>

                {/* Submit Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[#e0bfbf]/40">
                  <span className="text-xs text-[#584141] italic">
                    * All fields are required
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#570013] text-white text-[13px] uppercase tracking-wider font-bold rounded-xl hover:bg-[#800020] transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}