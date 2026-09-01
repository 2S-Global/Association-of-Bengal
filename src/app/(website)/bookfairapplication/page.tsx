"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  User,
  Store,
  CloudUpload,
  BookOpen,
  Scale,
  CheckCircle2,
  AlertCircle,
  Building2,
  ShieldCheck,
  ExternalLink,
  X,
  Send,
  Loader2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  XCircle,
  Sparkles,
  Mail,
  Phone,
  FileText,
  Calendar,
  Eye
} from "lucide-react";

interface FormFieldConfig {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "textarea" | "date" | "select" | "file";
  placeholder?: string;
  required: boolean;
  colSpan?: "full" | "half";
  options?: { label: string; value: string }[];
  validation?: (val: any) => string;
}

interface SectionConfig {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: FormFieldConfig[];
}

interface FairEventConfig {
  fairTitle: string;
  fairSubtitle: string;
  fairDates: string;
  stallSelectionText: string;
  stallSelectionVenue: string;
  organizerName: string;
  organizerSubtext: string;
  logoSrc: string;
  spaceOptions?: { label: string; value: string }[];
  termsAndConditionsHTML?: string;
  fairTimingsText?: string;
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
}

interface BookFairApplicationFormProps {
  fairConfig?: FairEventConfig;
  isAdminView?: boolean;
}

function CustomDatePicker({ 
  id, 
  value, 
  onChange, 
  onBlur, 
  className 
}: { 
  id: string; 
  value: string; 
  onChange: (e: any) => void; 
  onBlur: () => void; 
  className: string; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const initialDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          onBlur();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onBlur]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleSelectDate = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

    if (dateStr < todayStr) return;

    onChange({ target: { id, value: dateStr } });
    setIsOpen(false);
    onBlur();
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border p-3 pl-11 pr-10 rounded-lg font-medium text-[#1e1b18] text-sm uppercase cursor-pointer flex items-center justify-between transition-all duration-200 select-none ${className}`}
      >
        <span className={value ? "text-[#1e1b18]" : "text-gray-400 font-normal"}>
          {value || "SELECT DATE (YYYY-MM-DD)"}
        </span>
        <Calendar className="w-5 h-5 text-[#775a19] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <ChevronDown className={`w-4 h-4 text-[#8c7071] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 z-[99999] w-full sm:w-80 bg-white rounded-2xl shadow-2xl border-2 border-[#e0bfbf] p-4 animate-fadeIn">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e0bfbf]/60">
            <button
              type="button"
              onClick={() => {
                if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
                else { setCurrentMonth(currentMonth - 1); }
              }}
              className="p-1.5 rounded-full hover:bg-[#fbf2ed] text-[#570013] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-xs uppercase tracking-wider text-[#570013]">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={() => {
                if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
                else { setCurrentMonth(currentMonth + 1); }
              }}
              className="p-1.5 rounded-full hover:bg-[#fbf2ed] text-[#570013] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#775a19] uppercase mb-1">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {Array.from({ length: firstDayIndex }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const formattedMonth = String(currentMonth + 1).padStart(2, '0');
              const formattedDay = String(day).padStart(2, '0');
              const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
              const isSelected = value === dateStr;
              const isPast = dateStr < todayStr;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleSelectDate(day)}
                  className={`h-8 w-8 mx-auto flex items-center justify-center rounded-lg font-semibold transition-all ${
                    isPast
                      ? "text-gray-300 cursor-not-allowed bg-transparent"
                      : isSelected
                      ? "bg-[#570013] text-white shadow-md cursor-pointer"
                      : "hover:bg-[#fbf2ed] text-[#1e1b18]"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookFairApplicationForm({ fairConfig, isAdminView = false }: BookFairApplicationFormProps) {
  const activeFair = fairConfig || {
    fairTitle: "International Kolkata Book Fair",
    fairSubtitle: "FORM FOR PARTICIPATION WITH THE BUILT UP STALLS FOR REGIONAL BOOKS",
    fairDates: "22 January to 3 February 2026",
    stallSelectionText: "30 DECEMBER 2025 at 12:30pm",
    stallSelectionVenue: "MAHABODHI SOCIETY, 4A Bankim Chatterjee Street, Kolkata-73",
    organizerName: "ASSOCIATION OF BENGAL",
    organizerSubtext: "FOR LITERATURE AND CULTURE",
    logoSrc: "/images/logo/balc_logo.png",
    spaceOptions: [
      { label: "9 sq. metre (Standard Stall)", value: "9" },
      { label: "18 sq. metre (Medium Stall)", value: "18" },
      { label: "27 sq. metre (Large Stall)", value: "27" },
      { label: "36 sq. metre (Extra Large Stall)", value: "36" },
    ],
    termsAndConditionsHTML: `
      <p><strong>1A.</strong> Participation in the fair is open to Publishers and to a limited number of authorised distributors selling only regional books. Approval of participation and exhibits will be at the sole discretion of Publishers &amp; Booksellers Guild (PBG).</p>
      <p><strong>1B.</strong> Only books and CDs, pendrives and other information material including posters, stamps, cards etc. comprising an integral part of the book may be exhibited and sold at the fair. However, any material in whatever form comprising, in whole or in part, forbidden literature or violating the laws of India shall not be allowed to be exhibited or sold at the fair.</p>
      <p><strong>1C.</strong> CDs, pendrives or other information materials such as music, games etc. not forming part of the book shall not be allowed to be exhibited or sold at the fair except in stalls in separate enclosures set up for the purpose.</p>
      <p><strong>1D.</strong> Rosary beads, incense sticks and materials other than books should not be exhibited or sold in the fairground.</p>
      <p><strong>2A.</strong> Participants have to allow a discount of 10% on the printed price of the book to the customers at the fair and must display exchange rates in case of books having printed price in foreign currency and produce lists and catalogues on demand.</p>
      <p><strong>2B.</strong> Publicity or promotional materials other than that related to the participant's publications should not be displayed in the stall.</p>
      <p><strong>2C.</strong> Participant under whose name the stall is allotted will not be allowed to share the space partly or fully with any other publisher/bookseller.</p>
      <p><strong>3.</strong> Each Stall will be provided with an Entry Gate, three side partitions, fascia and platform. For every 9 sq. mt. of stall, one LED batten, 1 table and 2 chairs &amp; a maximum of 18 shelves will be provided. Additional lights may be provided subject to prior application to fair authorities, availability of fittings and adequate power load for which charges (both for fittings and power consumption) will have to be paid separately. These, however, cannot be claimed as a matter of right.</p>
      <p><strong>3A.</strong> The corner stalls will be provided with one Gate only. However, Gates on two sides may be provided subject to prior approval of the Fair Authorities and will have to be paid separately.</p>
      <p><strong>4.</strong> Space Allocation: Space allocation will be made by Publishers &amp; Booksellers Guild and the space will be allocated to Exhibitors by name and no subletting will be allowed in any manner.</p>
      <p><strong>5.</strong> Booking will be accepted subject to availability of space. Priority will be extended to Publishers, Foreign participants and government agencies. Mere submission of the application form does not confirm acceptance of booking. Allotment of stalls will be provisional and in case of exigencies may be altered at any time prior to the inauguration of the fair. In case of disputes, the decision of the organizers is final.</p>
      <p><strong>6.</strong> Encroachment in any form (E.g.: Display and sale of books and posters or any form of art beyond the specified area) is liable for closure of the stall.</p>
      <p><strong>7.</strong> It is compulsory for every stall holder to fix in their stall one fire extinguisher for every 9 sq. mt. of area allotted.</p>
      <p><strong>7A.</strong> No inflammable and/or explosive materials could be used for stall decoration.</p>
      <p><strong>8.</strong> Fire insurance policy must be taken by every participant for their own safety. Coverage must include the value of stocks, furniture and fittings, electronic items. Photocopies of the insurance policy certificates and/or money receipt for payment of premium must be shown as and when necessary.</p>
      <p><strong>9.</strong> Operation of Stalls: No stall should be left unattended during the exhibition hours. Exhibitors must not obstruct passages.</p>
      <p><strong>10.</strong> The organizers of the fair reserve the right to postpone the fair, alter the venue or duration or hour of opening, exclude the public and to close the fair early or cancel it altogether if there are unavoidable reasons for doing so. Any of these alterations will not constitute a breach of contracts with exhibitors and the organizers' claim for full payment of the stall amount. They also reserve the right to allot the space as per their own specification, written or unwritten.</p>
      <p><strong>11.</strong> Anything that may disturb the peace and tranquility of the exhibition will not be allowed. Demonstration, procession and any form of advertisement and publicity that disturbs the sanctity of the fair is strictly prohibited. Use of a Sound Limiter Instrument is mandatory. Audio/video systems may be used only inside the stalls so that the sound does not disturb the neighbouring stalls. In case of video, the set has to be installed inside the stall so that it is not visible from outside. However, in all such cases, prior written permission has to be obtained from the organizers.</p>
      <p><strong>12.</strong> Corporation Tax and other taxes as may be applicable will have to be paid by the participants on their own. Receipts should be produced at the time of getting the Gate Pass.</p>
      <p><strong>13.</strong> Electricity Consumption Charges: Power service consumption charges will be as fixed by the organizers in consultation with the Electrical Contractors and will be notified in advance to the participants.</p>
      <p><strong>14.</strong> Remittance: All remittances in full for stall occupation, seminar halls, etc., have to be made at the time of booking.</p>
      <p><strong>15.</strong> Possession of Space: Decorations of stalls must be completed by the evening of 20.01.2026 and must be vacated by the evening of 04.02.2026. Participants who fail to vacate the space will have to pay a penalty to the organizers as prescribed by PBG and the organizers shall have the right to remove the exhibits/materials etc. of participants at the risk and cost of participants. Stalls not occupied by 20.01.2026 may be assigned to other applicants at the discretion of the fair authorities. In such cases, the original hirer will not be entitled to any refund of the contribution amount.</p>
      <p><strong>16.</strong> Security: The organizers will make general security arrangements. However, the participants will be responsible for the security of their exhibits and personal belongings.</p>
      <p><strong>17.</strong> One participant pass for every 9 sq. mt. of stall area will be issued to participants on production of relevant documents to facilitate entry into the fairground before the opening of the Fair.</p>
      <p><strong>18.</strong> Parking of vehicles in the fairground: For security reasons, no two-wheelers, four-wheelers or other vehicles will be allowed to be parked inside the fairground during the period when the fair remains open. If any such vehicle is found to be parked in the fairground during the fair, the organizers reserve the right to forcibly remove the same from the fairground at the cost of the participant and any loss or damage caused in such act will have to be borne by the participant.</p>
      <p><strong>19.</strong> Smoking inside the fairground premises/halls is strictly prohibited.</p>
      <p><strong>20.</strong> Notes: The organizers reserve the right to refuse or cancel any booking without assigning any reason whatsoever to the applicant.<br/><br/>The terms and conditions mentioned above may be changed if necessary without notice.<br/><br/>Neither the organizers nor their advisors, special invitees, sponsors, officers, employees or agents are responsible in any way whatsoever for any loss, theft, damage or injury of any character suffered by persons or goods due to natural calamity or fire or other accidents during the International Kolkata Book Fair 2026.</p>
      <p><strong>21.</strong> Dispute: Disputes, if any, arising out of participation in the fair shall fall within the jurisdiction of Calcutta High Court and City Civil Court, Kolkata.</p>
      <p><strong>22.</strong> The terms and conditions mentioned above will be binding on the participants and any breach/violation of any of the clauses contained herein will call for strict disciplinary action which may include permanent closure of the stall, penalty or otherwise as may be decided by the organizers.</p>
    `,
    fairTimingsText: "Timing of the Fair: From 12:00 noon to 8:00 PM on all days and 12:00 noon to 9:00 PM on 03.02.2026. Fair timings may be changed by the authorities as may be deemed necessary.",
  };

  const formSections: SectionConfig[] = [
    {
      title: "Participant Details",
      icon: User,
      fields: [
        {
          id: "participant_name",
          label: "Name of the participant",
          type: "text",
          placeholder: "Enter Name",
          required: true,
          colSpan: "full",
          validation: (val) => (!val || !val.trim() ? "Please enter the organization/participant name." : ""),
        },
        {
          id: "participant_bengali",
          label: "Name of the participant in Bengali",
          type: "text",
          placeholder: "Enter Bengali Name",
          required: true,
          colSpan: "full",
          validation: (val) => (!val || !val.trim() ? "Please enter the Bengali participant name." : ""),
        },
        {
          id: "participant_address",
          label: "Address",
          type: "textarea",
          placeholder: "Complete Address",
          required: true,
          colSpan: "full",
          validation: (val) => (!val || !val.trim() ? "Please enter complete address details." : ""),
        },
        {
          id: "participant_email",
          label: "E-mail",
          type: "email",
          placeholder: "Official@domain.com",
          required: true,
          colSpan: "half",
          validation: (val) => {
            if (!val || !val.trim()) return "Please enter a valid e-mail address.";
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return !emailRegex.test(val) ? "Please enter a valid e-mail address." : "";
          },
        },
        {
          id: "participant_gst",
          label: "GSTIN",
          type: "text",
          placeholder: "15-Digit Gst Number",
          required: false,
          colSpan: "half",
          validation: (val) => {
            if (!val || !val.trim()) return "";
            const cleanVal = val.trim();
            if (cleanVal.length !== 15) return "GSTIN must be exactly 15 characters.";
            const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
            return !gstRegex.test(cleanVal) ? "Invalid GSTIN format." : "";
          },
        },
        {
          id: "participant_head",
          label: "Head of the Organisation",
          type: "text",
          placeholder: "Head Name",
          required: true,
          colSpan: "half",
          validation: (val) => (!val || !val.trim() ? "Please specify the Head of the organization." : ""),
        },
        {
          id: "participant_mobile",
          label: "Mobile Number(s)",
          type: "tel",
          placeholder: "10-digit mobile number",
          required: true,
          colSpan: "half",
          validation: (val) => {
            if (!val || !val.trim()) return "Please enter a valid 10-digit mobile number.";
            const cleanVal = val.replace(/[\s-]/g, "");
            if (cleanVal.length !== 10) return "Mobile number must be exactly 10 digits.";
            const phoneRegex = /^[0-9]{10}$/;
            return !phoneRegex.test(cleanVal) ? "Please enter a valid 10-digit mobile number." : "";
          },
        },
        {
          id: "participant_rep",
          label: "Representative at the Fair",
          type: "text",
          placeholder: "Representative Names",
          required: true,
          colSpan: "full",
          validation: (val) => (!val || !val.trim() ? "Please enter the representative name(s)." : ""),
        },
      ],
    },
    {
      title: "Space Required",
      icon: Store,
      fields: [
        {
          id: "space_requirement",
          label: "Select Area Requirement",
          type: "select",
          required: true,
          colSpan: "full",
          options: activeFair.spaceOptions,
          validation: (val) => (!val ? "Please select a space requirement option." : ""),
        },
      ],
    },
    {
      title: "Document Uploads (PAN Card & Owner Address Proof)",
      icon: CloudUpload,
      fields: [
        {
          id: "pan_card_doc",
          label: "Upload PAN Card",
          type: "file",
          required: true,
          colSpan: "half",
          validation: (file) => {
            if (!file) return "Please upload the PAN card document.";
            if (file.size > 100 * 1024) return "File size must be less than 100 KB.";
            return "";
          },
        },
        {
          id: "address_proof_doc",
          label: "Upload Owner Address Proof (Voter ID / Passport)",
          type: "file",
          required: true,
          colSpan: "half",
          validation: (file) => {
            if (!file) return "Please upload the owner address proof document.";
            if (file.size > 100 * 1024) return "File size must be less than 100 KB.";
            return "";
          },
        },
      ],
    },
    {
      title: "Publications & Requirements",
      icon: BookOpen,
      fields: [
        {
          id: "titles_copies",
          label: "Number of titles & copies to be displayed at the Fair",
          type: "text",
          placeholder: "E.g. 130 Titles, 450 Copies",
          required: true,
          colSpan: "half",
          validation: (val) => (!val || !val.trim() ? "Required" : ""),
        },
        {
          id: "stock_value",
          label: "Declaration of stock value in Rs.",
          type: "text",
          placeholder: "E.g. 1 Lakh",
          required: true,
          colSpan: "half",
          validation: (val) => (!val || !val.trim() ? "Required" : ""),
        },
      ],
    },
    {
      title: "Terms & Declaration",
      icon: Scale,
      fields: [
        {
          id: "declaration_date",
          label: "Date",
          type: "date",
          required: true,
          colSpan: "half",
          validation: (val) => {
            if (!val || !val.trim()) return "Required";
            return "";
          },
        },
        {
          id: "declaration_place",
          label: "Place",
          type: "text",
          placeholder: "Enter Location",
          required: true,
          colSpan: "half",
          validation: (val) => (!val || !val.trim() ? "Required" : ""),
        },
      ],
    },
  ];

  const allFieldIds = formSections.flatMap((sec) => sec.fields.map((f) => f.id));

  const todayDateStr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<Record<string, any>>({
    ...allFieldIds.reduce((acc, id) => ({ ...acc, [id]: "" }), {}),
    declaration_date: todayDateStr,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showErrorSummary, setShowErrorSummary] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ name: string; url: string } | null>(null);

  // Admin View State
  const [applications, setApplications] = useState<Application[]>([]);
  const [adminLoading, setAdminLoading] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (isAdminView) {
      fetchApplications();
    }
  }, [isAdminView]);

  const fetchApplications = async () => {
    try {
      setAdminLoading(true);
      const res = await fetch("/api/stallBooking");
      const data = await res.json();
      if (data.success) {
        setApplications(data.data || []);
      } else {
        setAdminError(data.error || "Failed to load bookings.");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setAdminError("An error occurred while fetching bookings.");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAppAction = async (appId: string, action: 'ACCEPTED' | 'REJECTED') => {
    try {
      setActionLoading(true);
      setActionMessage(null);

      const res = await fetch(`/api/stallBooking/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, status: action }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setActionMessage({
          type: 'success',
          text: `Application successfully ${action.toLowerCase()} and email notification sent to the participant!`
        });
        
        setApplications(prev => 
          prev.map(app => app._id === appId ? { ...app, status: action } : app)
        );
        
        if (selectedApp && selectedApp._id === appId) {
          setSelectedApp(prev => prev ? { ...prev, status: action } : null);
        }
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

  const filteredApplications = applications.filter((app) => 
    app.participant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.participant_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.participant_mobile?.includes(searchQuery)
  );

  useEffect(() => {
    if (isModalOpen || isSubmitted || selectedApp || previewFile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, isSubmitted, selectedApp, previewFile]);

  const getFieldError = (id: string, value: any): string => {
    const fieldConfig = formSections.flatMap((s) => s.fields).find((f) => f.id === id);
    if (fieldConfig && fieldConfig.validation) {
      return fieldConfig.validation(value);
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;
      setFormData((prev) => ({ ...prev, [id]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleBlur = (id: string) => {
    setTouched((prev) => ({ ...prev, [id]: true }));
  };

  const getInputClassName = (id: string) => {
    const isTouched = touched[id];
    const val = formData[id];
    const err = getFieldError(id, val);

    if (!isTouched || !val) return "border-[#e0bfbf] bg-[#fbf2ed]";
    if (err) return "border-[#ba1a1a] bg-[#fff0f0]";
    if (id === "participant_gst" && !val?.trim()) return "border-[#e0bfbf] bg-[#fbf2ed]";
    return "border-[#e0bfbf] bg-[#fbf2ed]";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = allFieldIds.reduce((acc, id) => ({ ...acc, [id]: true }), {});
    setTouched(allTouched);

    const formHasErrors = allFieldIds.some((id) => {
      const err = getFieldError(id, formData[id]);
      return err !== "";
    });

    if (formHasErrors || !agreeTerms) {
      setShowErrorSummary(true);
      return;
    }

    setShowErrorSummary(false);
    setIsSubmitting(true);

    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
          dataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch("/api/stallBooking", {
        method: "POST",
        body: dataToSend,
      });

      const contentType = response.headers.get("content-type");
      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const textResponse = await response.text();
        throw new Error(`Server returned invalid response: ${textResponse.substring(0, 100)}`);
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit application.");
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      setShowErrorSummary(true);
      alert(`Submission error: ${error.message || "Please try again later."}`);
    }
  };

  return (
    <>
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-12 bg-[#fff8f5] text-[#1e1b18] font-['Libre_Franklin'] antialiased selection:bg-[#ffdada] selection:text-[#570013]">
        
        {/* Admin View Mode Rendering */}
        {isAdminView ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e0bfbf] shadow-sm">
              <div>
                <h1 className="text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
                  <Store className="w-7 h-7 text-[#570013]" />
                  Stall Applications (Admin View)
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

            <div className="bg-white p-4 rounded-2xl border border-[#e0bfbf] shadow-sm flex items-center gap-3">
              <User className="w-5 h-5 text-[#8c7071] ml-2 shrink-0" />
              <input
                type="text"
                placeholder="Search by participant name, email, or mobile number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none text-[#1e1b18] placeholder:text-gray-400"
              />
            </div>

            {adminLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#e0bfbf] shadow-sm">
                <Loader2 className="w-10 h-10 animate-spin text-[#570013] mb-3" />
                <p className="text-sm font-bold text-[#584141]">Loading bookings...</p>
              </div>
            ) : adminError ? (
              <div className="bg-red-50 border border-red-300 p-6 rounded-2xl text-center text-red-900">
                <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="font-bold">{adminError}</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e0bfbf] p-12 text-center shadow-sm">
                <FileText className="w-12 h-12 text-[#e0bfbf] mx-auto mb-3" />
                <h3 className="font-bold text-base text-[#570013]">No Bookings Found</h3>
                <p className="text-xs text-gray-500 mt-1">No applications match your search query.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#e0bfbf] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#fbf2ed] border-b border-[#e0bfbf] text-[11px] font-bold text-[#570013] uppercase tracking-wider">
                        <th className="py-4 px-6">Participant</th>
                        <th className="py-4 px-6">Contact Info</th>
                        <th className="py-4 px-6">Space Requirement</th>
                        <th className="py-4 px-6">Status</th>
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
                          <td className="py-4 px-6">
                            <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wider inline-block ${
                              (app.status || 'PENDING') === 'ACCEPTED' ? 'bg-green-100 text-green-800 border border-green-300' : 
                              (app.status || 'PENDING') === 'REJECTED' ? 'bg-red-100 text-red-800 border border-red-300' :
                              'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {app.status || 'PENDING'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedApp(app);
                                setActionMessage(null);
                              }}
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
          </div>
        ) : (
          <>
            {/* General Error Summary Banner */}
            <div
              className={`${
                showErrorSummary ? "flex" : "hidden"
              } mb-6 p-5 rounded-2xl bg-gradient-to-br from-red-50 via-red-50/40 to-white border border-red-300 text-red-950 text-sm font-medium items-start gap-3.5 shadow-lg shadow-red-900/5 transition-all duration-300`}
            >
              <div className="p-2 bg-red-100 rounded-xl text-red-700 shrink-0 shadow-inner">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 flex-1">
                <h5 className="font-bold text-red-950 text-sm uppercase tracking-wider">Action Required</h5>
                <p className="text-red-900 leading-relaxed">
                  Please correct the highlighted fields below, or verify if an application has already been registered with your email/mobile number.
                </p>
              </div>
            </div>

            {/* Top Header Card */}
            <div className="bg-white rounded-t-3xl p-6 sm:p-8 shadow-sm border border-[#e0bfbf] mb-0 relative z-10">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#570013] via-[#800020] to-[#775a19]"></div>

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6">
                <div className="text-left space-y-1">
                  <div className="text-base sm:text-lg lg:text-xl font-bold font-['Playfair_Display'] tracking-wide text-[#570013] whitespace-nowrap">
                    {activeFair.fairTitle}
                  </div>
                  <div className="inline-block bg-[#fff0f0] text-[#570013] px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase border border-[#e0bfbf]">
                    {activeFair.fairDates}
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-[#e0bfbf]/30">
                  <div className="flex flex-col items-start lg:items-end justify-center">
                    <strong className="block text-[#570013] font-['Playfair_Display'] text-[15px] sm:text-[18px] lg:text-[19px] tracking-wide uppercase font-bold leading-tight">
                      {activeFair.organizerName}
                    </strong>
                    <span className="block text-[#9a7625] font-['Libre_Franklin'] text-[11px] sm:text-[12px] tracking-[0.08em] font-bold uppercase mt-0.5">
                      {activeFair.organizerSubtext}
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-1.5 border border-[#e0bfbf]/60 shadow-sm shrink-0">
                    <Image
                      src={activeFair.logoSrc}
                      alt="Organization Logo"
                      width={70}
                      height={70}
                      className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e0bfbf]/30">
                <h2 className="text-[12px] sm:text-[13px] text-center font-bold uppercase tracking-wider text-[#584141] leading-relaxed">
                  {activeFair.fairSubtitle}
                </h2>
              </div>
            </div>

            {/* Main Dynamic Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-b-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-[#e0bfbf] flex flex-col divide-y divide-[#e0bfbf]/60 border-t-0 relative z-0"
              noValidate
            >
              {/* Section 1: Participant Details */}
              <div className="pb-8 space-y-5 sm:space-y-6 mt-1">
                <h3 className="text-base text-[#570013] font-bold uppercase tracking-tight flex items-center gap-2">
                  {React.createElement(formSections[0].icon, { className: "w-5 h-5 text-[#570013]" })}
                  {formSections[0].title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {formSections[0].fields.map((field) => {
                    const err = getFieldError(field.id, formData[field.id]);
                    return (
                      <div key={field.id} className={`space-y-1 ${field.colSpan === "full" ? "md:col-span-2" : "md:col-span-1"}`}>
                        <label className="block text-[11px] sm:text-xs font-bold text-[#584141] uppercase tracking-wider">
                          {field.label} {field.required && <span className="text-red-600 font-bold ml-0.5">*</span>}
                        </label>
                        {field.type === "textarea" ? (
                          <textarea
                            id={field.id}
                            rows={2}
                            value={formData[field.id]}
                            onChange={handleChange}
                            onBlur={() => handleBlur(field.id)}
                            placeholder={field.placeholder}
                            className={`w-full border p-3 rounded-lg font-medium text-[#1e1b18] text-sm transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-[#570013]/15 ${getInputClassName(
                              field.id
                            )}`}
                          />
                        ) : (
                          <input
                            type={field.type}
                            id={field.id}
                            value={formData[field.id]}
                            onChange={handleChange}
                            onBlur={() => handleBlur(field.id)}
                            placeholder={field.placeholder}
                            maxLength={field.id === "participant_mobile" ? 10 : field.id === "participant_gst" ? 15 : undefined}
                            className={`w-full border p-3 rounded-lg font-medium text-[#1e1b18] text-sm transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-[#570013]/15 ${getInputClassName(
                              field.id
                            )}`}
                          />
                        )}
                        {touched[field.id] && err && <p className="error-msg text-xs text-red-600 block">{err}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Space Required */}
              <div className="py-8 space-y-5 sm:space-y-6">
                <h3 className="text-base text-[#570013] font-bold uppercase tracking-tight flex items-center gap-2">
                  {React.createElement(formSections[1].icon, { className: "w-5 h-5 text-[#570013]" })}
                  {formSections[1].title}
                </h3>

                <div className="bg-[#fbf2ed] border border-[#e0bfbf] rounded-xl p-5 space-y-4">
                  {formSections[1].fields.map((field) => {
                    const err = getFieldError(field.id, formData[field.id]);
                    return (
                      <div key={field.id} className="space-y-2">
                        <label className="block text-xs font-bold text-[#584141] uppercase tracking-wider">
                          {field.label} <span className="text-red-600 font-bold ml-0.5">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id={field.id}
                            value={formData[field.id]}
                            onChange={handleChange}
                            onBlur={() => handleBlur(field.id)}
                            className={`w-full border p-3 pr-10 rounded-lg font-bold text-sm sm:text-base text-[#1e1b18] shadow-sm transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-[#570013]/15 cursor-pointer appearance-none ${getInputClassName(
                              field.id
                            )}`}
                          >
                            <option value="" disabled className="text-gray-400">
                              -- Select Stall Area Requirement --
                            </option>
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7071] pointer-events-none" />
                        </div>
                        {touched[field.id] && err && <p className="error-msg text-xs text-red-600 block">{err}</p>}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-yellow-200 border border-yellow-400 p-4 rounded-lg text-center font-bold text-black text-sm shadow-sm leading-relaxed">
                  STALL SELECTION :{" "}
                  <span className="underline inline-block mx-1">{activeFair.stallSelectionText}</span> at the{" "}
                  <u className="inline-block mt-1 sm:mt-0">{activeFair.stallSelectionVenue}</u>
                </div>
              </div>

              {/* Section 3: Document Uploads */}
              <div className="py-8 space-y-5 sm:space-y-6">
                <h3 className="text-base text-[#570013] font-bold uppercase tracking-tight flex items-center gap-2">
                  {React.createElement(formSections[2].icon, { className: "w-5 h-5 text-[#570013]" })}
                  {formSections[2].title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {formSections[2].fields.map((field) => {
                    const err = getFieldError(field.id, formData[field.id]);
                    const hasFile = formData[field.id];
                    return (
                      <div key={field.id} className="space-y-3 bg-[#fbf2ed] p-5 rounded-2xl border border-[#e0bfbf] flex flex-col justify-between shadow-xs">
                        <div>
                          <label className="block text-[11px] sm:text-xs font-bold text-[#584141] uppercase tracking-wider mb-1">
                            {field.label} <span className="text-red-600 font-bold ml-0.5">*</span>
                          </label>
                          <p className="text-[11px] text-[#775a19] font-medium">Supported formats: PDF, JPG, PNG (Max 100 KB)</p>
                        </div>

                        <div className="relative w-full overflow-hidden">
                          <input
                            type={field.type}
                            id={field.id}
                            onChange={handleChange}
                            onBlur={() => handleBlur(field.id)}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                          />
                          <div className={`w-full bg-white p-3.5 border rounded-xl flex items-center justify-between transition-all ${getInputClassName(field.id)}`}>
                            <div className="flex items-center gap-2.5 truncate">
                              <CloudUpload className="w-5 h-5 text-[#570013] shrink-0" />
                              <span className="text-xs font-semibold text-[#584141] truncate">
                                {hasFile ? hasFile.name : "Choose file to upload..."}
                              </span>
                            </div>
                            <span className="bg-[#570013] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shrink-0">
                              Browse
                            </span>
                          </div>
                        </div>

                        {hasFile && (
                          <div className="flex items-center justify-between bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold truncate mr-2">
                              <FileCheck className="w-4 h-4 shrink-0" />
                              <span className="truncate">Ready: {hasFile.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const fileUrl = URL.createObjectURL(hasFile);
                                setPreviewFile({ name: hasFile.name, url: fileUrl });
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1 rounded-md inline-flex items-center gap-1 transition-all shadow-xs cursor-pointer shrink-0"
                            >
                              <Eye className="w-3.5 h-3.5" /> Preview
                            </button>
                          </div>
                        )}

                        {touched[field.id] && err && <p className="error-msg text-xs text-red-600 block">{err}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Publications & Requirements */}
              <div className="py-8 space-y-5 sm:space-y-6">
                <h3 className="text-base text-[#570013] font-bold uppercase tracking-tight flex items-center gap-2">
                  {React.createElement(formSections[3].icon, { className: "w-5 h-5 text-[#570013]" })}
                  {formSections[3].title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {formSections[3].fields.map((field) => {
                    const err = getFieldError(field.id, formData[field.id]);
                    return (
                      <div key={field.id} className="space-y-1 flex flex-col justify-between md:col-span-1">
                        <label className="block text-[11px] sm:text-xs font-bold text-[#584141] uppercase tracking-wider mb-2">
                          {field.label} {field.required && <span className="text-red-600 font-bold ml-0.5">*</span>}
                        </label>
                        <input
                          type={field.type}
                          id={field.id}
                          value={formData[field.id]}
                          onChange={handleChange}
                          onBlur={() => handleBlur(field.id)}
                          placeholder={field.placeholder}
                          className={`w-full border p-3 rounded-lg font-medium text-[#1e1b18] text-sm transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-[#570013]/15 ${getInputClassName(
                            field.id
                          )}`}
                        />
                        {touched[field.id] && err && <p className="error-msg text-xs text-red-600 block">{err}</p>}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-[#570013]/5 border border-[#570013]/20 p-4 sm:p-5 rounded-xl">
                  <p className="font-bold text-[#570013] text-sm mb-3">
                    ** Production of the receipt is mandatory at the time of stall selection.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-[13px] sm:text-sm text-[#584141]">
                    <li>(Stock value must corroborate with Insurance Policy Certificate)</li>
                    <li>Copy of the Fire Insurance policy must be submitted along with the Form</li>
                    <li>
                      Please enclose remittance within the last date of submission. Remittance may be made by{" "}
                      <strong className="text-[#1e1b18]">Bank Draft</strong> drawn in favour of{" "}
                      <strong className="text-[#1e1b18]">ASSOCIATION OF BENGAL</strong>{" "}
                      and payable at Kolkata or by <strong className="text-[#1e1b18]">UPI</strong> at the Association office.
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 bg-[#fbf2ed] p-4 rounded-xl border border-[#e0bfbf] shadow-xs transition-transform hover:-translate-y-0.5">
                    <div className="bg-[#fed488]/80 p-3 rounded-xl text-[#785a1a] shrink-0 shadow-xs">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#775a19] uppercase tracking-wider font-bold">Official Banker</span>
                      <span className="text-sm font-bold text-[#1e1b18] mt-0.5 block">State Bank of India</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-[#fbf2ed] p-4 rounded-xl border border-[#e0bfbf] shadow-xs transition-transform hover:-translate-y-0.5">
                    <div className="bg-[#fed488]/80 p-3 rounded-xl text-[#785a1a] shrink-0 shadow-xs">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#775a19] uppercase tracking-wider font-bold">Official Insurer</span>
                      <span className="text-sm font-bold text-[#1e1b18] mt-0.5 block">HDFC ERGO GIC Ltd</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Terms & Declaration */}
              <div className="pt-8 space-y-5 sm:space-y-6">
                <h3 className="text-base text-[#570013] font-bold uppercase tracking-tight flex items-center gap-2">
                  {React.createElement(formSections[4].icon, { className: "w-5 h-5 text-[#570013]" })}
                  {formSections[4].title}
                </h3>

                <div className="flex items-start gap-3 p-3 sm:p-4 bg-[#fbf2ed] rounded-xl border border-[#e0bfbf] mt-4">
                  <input
                    type="checkbox"
                    id="agree_terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 sm:mt-1 w-5 h-5 text-[#570013] rounded border-[#e0bfbf] focus:ring-[#570013] focus:ring-offset-0 cursor-pointer shrink-0"
                  />
                  <label
                    htmlFor="agree_terms"
                    className="text-[13px] sm:text-sm font-semibold text-[#1e1b18] cursor-pointer select-none leading-relaxed"
                  >
                    I/ We undertake to abide by the above terms and conditions which are fully understood by me/us.
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="text-[#570013] underline ml-0 sm:ml-1 mt-1 sm:mt-0 hover:text-[#ff828a] inline-flex items-center gap-1 font-bold bg-transparent border-none cursor-pointer p-0"
                    >
                      <ExternalLink className="w-4 h-4 inline" />
                      Read Terms &amp; Conditions
                    </button>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
                  {formSections[4].fields.map((field) => {
                    const err = getFieldError(field.id, formData[field.id]);
                    const isReadOnlyDate = field.id === "declaration_date";

                    return (
                      <div key={field.id} className="space-y-1 w-full">
                        <label className="block text-[11px] sm:text-xs font-bold text-[#584141] uppercase tracking-wider">
                          {field.label} {field.required && <span className="text-red-600 font-bold ml-0.5">*</span>}
                        </label>
                        {field.type === "date" ? (
                          isReadOnlyDate ? (
                            <input
                              type="date"
                              id={field.id}
                              value={formData[field.id]}
                              readOnly
                              disabled
                              className="w-full border p-3 rounded-lg font-medium text-[#1e1b18] text-sm uppercase bg-gray-100 cursor-not-allowed border-[#e0bfbf]"
                            />
                          ) : (
                            <CustomDatePicker
                              id={field.id}
                              value={formData[field.id]}
                              onChange={handleChange}
                              onBlur={() => handleBlur(field.id)}
                              className={getInputClassName(field.id)}
                            />
                          )
                        ) : (
                          <input
                            type={field.type}
                            id={field.id}
                            value={formData[field.id]}
                            onChange={handleChange}
                            onBlur={() => handleBlur(field.id)}
                            placeholder={field.placeholder}
                            className={`w-full border p-3 rounded-lg font-medium text-[#1e1b18] text-sm transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-[#570013]/15 ${getInputClassName(
                              field.id
                            )}`}
                          />
                        )}
                        {touched[field.id] && err && <p className="error-msg text-xs text-red-600 block">{err}</p>}
                      </div>
                    );
                  })}
                </div>

                {/* Form Submission Button Container with Cancel Option */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-full sm:w-auto bg-[#fef2eb] hover:bg-[#fed488]/40 border border-[#e0bfbf] text-[#570013] py-3 sm:py-4 px-6 sm:px-8 text-sm font-bold transition-all rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!agreeTerms || isSubmitting}
                    className={`w-full sm:w-auto py-3 sm:py-4 px-6 sm:px-8 text-sm font-bold transition-all rounded-xl flex items-center justify-center gap-3 shadow-sm ${
                      !agreeTerms
                        ? "bg-[#570013] text-white opacity-50 cursor-not-allowed"
                        : "bg-[#570013] text-white hover:bg-[#800020] hover:shadow-xl active:scale-95 cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Application Received
                      </>
                    ) : (
                      <>
                        Submit Application
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </main>

      {/* Global Root-Level File Preview Modal Popup (Fixed PDF vs Image check) */}
      {previewFile && (
        <div className="fixed inset-0 z-[9999999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] p-6 shadow-2xl border-2 border-[#e0bfbf] flex flex-col relative m-auto">
            <div className="flex items-center justify-between border-b border-[#e0bfbf] pb-3 shrink-0">
              <h4 className="font-bold text-[#570013] text-sm truncate flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#775a19]" />
                Document Preview: {previewFile.name}
              </h4>
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(previewFile.url);
                  setPreviewFile(null);
                }}
                className="p-1.5 bg-[#fbf2ed] hover:bg-[#e0bfbf] rounded-full text-[#570013] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 bg-[#fbf2ed] p-4 rounded-xl border border-[#e0bfbf] my-4 overflow-hidden flex items-center justify-center">
              {previewFile.name.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={previewFile.url} 
                  className="w-full h-full rounded-lg border-0 bg-white"
                  title="PDF Preview"
                />
              ) : (
                <img src={previewFile.url} alt="Uploaded Document Preview" className="max-h-full max-w-full object-contain rounded-lg" />
              )}
            </div>
            <div className="flex justify-end pt-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(previewFile.url);
                  setPreviewFile(null);
                }}
                className="bg-[#570013] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#800020] transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Root-Level Success Message Modal Popup */}
      <div
        className={`${
          isSubmitted ? "flex" : "hidden"
        } fixed inset-0 z-[999999] bg-black/60 backdrop-blur-md items-center justify-center p-4 overflow-y-auto`}
      >
        <div className="bg-gradient-to-b from-white via-white to-emerald-50/30 rounded-3xl w-full max-w-md p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl border-2 border-emerald-500/30 relative m-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner mb-1">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-emerald-950 tracking-tight">
              Application Submitted Successfully!
            </h3>
            <p className="text-sm text-emerald-900/90 leading-relaxed">
              Thank you, <strong className="underline decoration-emerald-400 font-semibold">{formData["participant_name"]}</strong>. Your application form for stall participation in the{" "}
              <strong>{activeFair.fairTitle}</strong> has been securely registered.
            </p>
          </div>

          <div className="w-full bg-emerald-50/80 border border-emerald-200/80 p-3.5 rounded-xl text-xs text-emerald-900 font-medium space-y-1 text-left">
            <div className="text-emerald-700 font-bold uppercase tracking-wider text-[10px]">Notification Info</div>
            <div>Confirmation details sent to: <span className="font-bold text-emerald-950 break-all">{formData["participant_email"]}</span></div>
            <div>Mobile Contact: <span className="font-bold text-emerald-950">{formData["participant_mobile"]}</span></div>
            <div>Space Allotment Requested: <span className="font-bold text-emerald-950">{formData["space_requirement"]} sq. mt.</span></div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              window.location.href = "/";
            }}
            className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl hover:opacity-95 transition-all shadow-lg shadow-emerald-900/20 cursor-pointer text-sm"
          >
            Done / Return to Home
          </button>
        </div>
      </div>

      {/* Global Root-Level Terms and Conditions Modal Popup */}
      <div
        className={`${
          isModalOpen ? "flex" : "hidden"
        } fixed inset-0 z-[999999] bg-black/60 backdrop-blur-md items-center justify-center p-4 overflow-y-auto`}
      >
        <div className="bg-gradient-to-b from-white via-white to-[#fff8f5] rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl border-2 border-[#e0bfbf]/60 overflow-hidden relative m-auto">
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#570013] via-[#800020] to-[#775a19] text-white shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm border border-white/20">
                <Sparkles className="w-5 h-5 text-[#fed488]" />
              </div>
              <div>
                <h2 className="font-['Playfair_Display'] text-base sm:text-lg font-bold tracking-wide">
                  Rules and Regulations
                </h2>
                <p className="text-[10px] text-[#fed488] font-medium tracking-wider uppercase mt-0.5">
                  Official Terms of Participation
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white shrink-0 cursor-pointer border-none flex items-center justify-center shadow-inner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-[13px] sm:text-sm text-[#1e1b18] space-y-4 text-justify leading-relaxed">
            <div className="space-y-4 pt-2 text-[#443838]" dangerouslySetInnerHTML={{ __html: activeFair.termsAndConditionsHTML || "" }} />
          </div>

          <div className="px-6 py-4 border-t border-[#e0bfbf] bg-[#fff8f5] flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0 shadow-inner">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 rounded-xl font-bold text-[#584141] bg-[#f5ece7] hover:bg-[#e0bfbf] transition-all w-full sm:w-auto cursor-pointer border border-[#e0bfbf]/60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setAgreeTerms(true);
                setIsModalOpen(false);
              }}
              className="bg-gradient-to-r from-[#570013] to-[#800020] text-white px-7 py-2.5 rounded-xl font-bold hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer border-none"
            >
              <CheckCircle2 className="w-4 h-4 text-[#fed488]" />
              Accept Terms &amp; Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}