// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import {
//   Loader2,
//   Save,
//   Plus,
//   CheckCircle2,
//   Trash2,
//   Calendar,
//   MapPin,
//   FileText,
//   Building,
//   Clock,
//   Edit3,
//   ArrowLeft,
//   AlertCircle,
//   Layers,
//   AlertTriangle,
//   Search,
//   Sparkles,
//   Tag,
//   Globe,
//   EyeOff,
//   Lock,
//   Image as ImageIcon,
// } from "lucide-react";

// const DEFAULT_TERMS_PREFILL = `
//   <p><strong>1A.</strong> Participation in the fair is open to Publishers and to a limited number of authorised distributors selling only regional books. Approval of participation and exhibits will be at the sole discretion of Publishers &amp; Booksellers Guild (PBG).</p>
//   <p><strong>1B.</strong> Only books and CDs, pendrives and other information material including posters, stamps, cards etc. comprising an integral part of the book may be exhibited and sold at the fair. However, any material in whatever form comprising, in whole or in part, forbidden literature or violating the laws of India shall not be allowed to be exhibited or sold at the fair.</p>
//   <p><strong>1C.</strong> CDs, pendrives or other information materials such as music, games etc. not forming part of the book shall not be allowed to be exhibited or sold at the fair except in stalls in separate enclosures set up for the purpose.</p>
//   <p><strong>1D.</strong> Rosary beads, incense sticks and materials other than books should not be exhibited or sold in the fairground.</p>
//   <p><strong>2A.</strong> Participants have to allow a discount of 10% on the printed price of the book to the customers at the fair and must display exchange rates in case of books having printed price in foreign currency and produce lists and catalogues on demand.</p>
//   <p><strong>2B.</strong> Publicity or promotional materials other than that related to the participant's publications should not be displayed in the stall.</p>
//   <p><strong>2C.</strong> Participant under whose name the stall is allotted will not be allowed to share the space partly or fully with any other publisher/bookseller.</p>
//   <p><strong>3.</strong> Each Stall will be provided with an Entry Gate, three side partitions, fascia and platform. For every 9 sq. mt. of stall, one LED batten, 1 table and 2 chairs &amp; a maximum of 18 shelves will be provided. Additional lights may be provided subject to prior application to fair authorities, availability of fittings and adequate power load for which charges (both for fittings and power consumption) will have to be paid separately. These, however, cannot be claimed as a matter of right.</p>
//   <p><strong>3A.</strong> The corner stalls will be provided with one Gate only. However, Gates on two sides may be provided subject to prior approval of the Fair Authorities and will have to be paid separately.</p>
//   <p><strong>4.</strong> Space Allocation: Space allocation will be made by Publishers &amp; Booksellers Guild and the space will be allocated to Exhibitors by name and no subletting will be allowed in any manner.</p>
//   <p><strong>5.</strong> Booking will be accepted subject to availability of space. Priority will be extended to Publishers, Foreign participants and government agencies. Mere submission of the application form does not confirm acceptance of booking. Allotment of stalls will be provisional and in case of exigencies may be altered at any time prior to the inauguration of the fair. In case of disputes, the decision of the organizers is final.</p>
//   <p><strong>6.</strong> Encroachment in any form (E.g.: Display and sale of books and posters or any form of art beyond the specified area) is liable for closure of the stall.</p>
//   <p><strong>7.</strong> It is compulsory for every stall holder to fix in their stall one fire extinguisher for every 9 sq. mt. of area allotted.</p>
//   <p><strong>7A.</strong> No inflammable and/or explosive materials could be used for stall decoration.</p>
//   <p><strong>8.</strong> Fire insurance policy must be taken by every participant for their own safety. Coverage must include the value of stocks, furniture and fittings, electronic items. Photocopies of the insurance policy certificates and/or money receipt for payment of premium must be shown as and when necessary.</p>
//   <p><strong>9.</strong> Operation of Stalls: No stall should be left unattended during the exhibition hours. Exhibitors must not obstruct passages.</p>
//   <p><strong>10.</strong> The organizers of the fair reserve the right to postpone the fair, alter the venue or duration or hour of opening, exclude the public and to close the fair early or cancel it altogether if there are unavoidable reasons for doing so. Any of these alterations will not constitute a breach of contracts with exhibitors and the organizers' claim for full payment of the stall amount. They also reserve the right to allot the space as per their own specification, written or unwritten.</p>
//   <p><strong>11.</strong> Anything that may disturb the peace and tranquility of the exhibition will not be allowed. Demonstration, procession and any form of advertisement and publicity that disturbs the sanctity of the fair is strictly prohibited. Use of a Sound Limiter Instrument is mandatory. Audio/video systems may be used only inside the stalls so that the sound does not disturb the neighbouring stalls. In case of video, the set has to be installed inside the stall so that it is not visible from outside. However, in all such cases, prior written permission has to be obtained from the organizers.</p>
//   <p><strong>12.</strong> Corporation Tax and other taxes as may be applicable will have to be paid by the participants on their own. Receipts should be produced at the time of getting the Gate Pass.</p>
//   <p><strong>13.</strong> Electricity Consumption Charges: Power service consumption charges will be as fixed by the organizers in consultation with the Electrical Contractors and will be notified in advance to the participants.</p>
//   <p><strong>14.</strong> Remittance: All remittances in full for stall occupation, seminar halls, etc., have to be made at the time of booking.</p>
//   <p><strong>15.</strong> Possession of Space: Decorations of stalls must be completed by the evening of 20.01.2026 and must be vacated by the evening of 04.02.2026. Participants who fail to vacate the space will have to pay a penalty to the organizers as prescribed by PBG and the organizers shall have the right to remove the exhibits/materials etc. of participants at the risk and cost of participants. Stalls not occupied by 20.01.2026 may be assigned to other applicants at the discretion of the fair authorities. In such cases, the original hirer will not be entitled to any refund of the contribution amount.</p>
//   <p><strong>16.</strong> Security: The organizers will make general security arrangements. However, the participants will be responsible for the security of their exhibits and personal belongings.</p>
//   <p><strong>17.</strong> One participant pass for every 9 sq. mt. of stall area will be issued to participants on production of relevant documents to facilitate entry into the fairground before the opening of the Fair.</p>
//   <p><strong>18.</strong> Parking of vehicles in the fairground: For security reasons, no two-wheelers, four-wheelers or other vehicles will be allowed to be parked inside the fairground during the period when the fair remains open. If any such vehicle is found to be parked in the fairground during the fair, the organizers reserve the right to forcibly remove the same from the fairground at the cost of the participant and any loss or damage caused in such act will have to be borne by the participant.</p>
//   <p><strong>19.</strong> Smoking inside the fairground premises/halls is strictly prohibited.</p>
//   <p><strong>20.</strong> Notes: The organizers reserve the right to refuse or cancel any booking without assigning any reason whatsoever to the applicant.<br/><br/>The terms and conditions mentioned above may be changed if necessary without notice.<br/><br/>Neither the organizers nor their advisors, special invitees, sponsors, officers, employees or agents are responsible in any way whatsoever for any loss, theft, damage or injury of any character suffered by persons or goods due to natural calamity or fire or other accidents during the International Kolkata Book Fair 2026.</p>
//   <p><strong>21.</strong> Dispute: Disputes, if any, arising out of participation in the fair shall fall within the jurisdiction of Calcutta High Court and City Civil Court, Kolkata.</p>
//   <p><strong>22.</strong> The terms and conditions mentioned above will be binding on the participants and any breach/violation of any of the clauses contained herein will call for strict disciplinary action which may include permanent closure of the stall, penalty or otherwise as may be decided by the organizers.</p>
// `;

// const DEFAULT_TIMINGS_PREFILL =
//   "Timing of the Fair: From 12:00 noon to 8:00 PM on all days and 12:00 noon to 9:00 PM on 03.02.2026. Fair timings may be changed by the authorities as may be deemed necessary.";

// const STATIC_ORGANIZER_NAME = "ASSOCIATION OF BENGAL";
// const STATIC_ORGANIZER_SUBTEXT = "FOR LITERATURE AND CULTURE";
// const DEFAULT_SUBTITLE = "FORM FOR PARTICIPATION WITH THE BUILT UP STALLS";
// const DEFAULT_LOGO = "/images/logo/balc_logo.png";

// const formatDisplayDate = (dateVal: string | undefined) => {
//   if (!dateVal) return "";
//   if (dateVal.includes("to")) return dateVal;

//   const parsed = Date.parse(dateVal);
//   if (isNaN(parsed)) return dateVal;

//   const d = new Date(parsed);
//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();
//   return `${day}/${month}/${year}`;
// };

// const parseCustomDateTime = (str: string) => {
//   if (!str) return null;
//   try {
//     const parts = str.split(" at ");
//     if (parts.length !== 2) return null;
//     const [datePart, timePart] = parts;
//     const [day, month, year] = datePart.split("/").map(Number);
//     if (!day || !month || !year) return null;

//     const timeClean = timePart.trim().toLowerCase();
//     const isPM = timeClean.includes("pm");
//     const isAM = timeClean.includes("am");
//     const timeDigits = timeClean.replace(/(am|pm)/g, "").trim();
//     let [hours, minutes] = timeDigits.split(":").map(Number);

//     if (isNaN(hours) || isNaN(minutes)) return null;

//     if (isPM && hours < 12) hours += 12;
//     if (isAM && hours === 12) hours = 0;

//     const d = new Date(year, month - 1, day, hours, minutes);
//     return isNaN(d.getTime()) ? null : d;
//   } catch (e) {
//     return null;
//   }
// };

// export default function AdminFairSettingsPage() {
//   const [list, setList] = useState<any[]>([]);
//   const [selected, setSelected] = useState<any>(null);
//   const [viewMode, setViewMode] = useState<"cards" | "editor">("cards");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [activeTab, setActiveTab] = useState<"general" | "space" | "terms">(
//     "general"
//   );
//   const [searchQuery, setSearchQuery] = useState("");

//   const [startDatePicker, setStartDatePicker] = useState<Date | null>(null);
//   const [endDatePicker, setEndDatePicker] = useState<Date | null>(null);

//   const [deleteModal, setDeleteModal] = useState<{
//     isOpen: boolean;
//     id: string | null;
//     title: string;
//   }>({
//     isOpen: false,
//     id: null,
//     title: "",
//   });

//   const [publishModal, setPublishModal] = useState<{
//     isOpen: boolean;
//     item: any | null;
//     targetState: boolean;
//   }>({
//     isOpen: false,
//     item: null,
//     targetState: false,
//   });

//   const safeFetchJson = async (url: string, options?: RequestInit) => {
//     const res = await fetch(url, options);
//     const contentType = res.headers.get("content-type");
//     if (!res.ok || !contentType || !contentType.includes("application/json")) {
//       const text = await res.text();
//       throw new Error(`API failed (${res.status}): ${text.substring(0, 100)}`);
//     }
//     return res.json();
//   };

//   const loadAll = async () => {
//     setLoading(true);
//     setErrorMsg("");
//     try {
//       const json = await safeFetchJson("/api/form-schema");
//       if (json.allConfigs) {
//         setList(json.allConfigs);
//       } else if (json.data) {
//         setList([json.data]);
//       }
//     } catch (err: any) {
//       console.error("Safe load error:", err);
//       setErrorMsg(
//         "Could not fetch fair configs. Ensure API path /api/form-schema or your route exists and dev server is restarted."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadAll();
//   }, []);

//   const handleCreateNew = () => {
//     const slug = `fair-${Date.now()}`;
//     const newConfig = {
//       slug,
//       fairTitle: "",
//       fairSubtitle: DEFAULT_SUBTITLE,
//       fairDates: "",
//       stallSelectionText: "",
//       stallSelectionVenue: "",
//       organizerName: STATIC_ORGANIZER_NAME,
//       organizerSubtext: STATIC_ORGANIZER_SUBTEXT,
//       tagLabel: "FLAGSHIP EVENT",
//       locationName: "",
//       logoSrc: DEFAULT_LOGO,
//       spaceOptions: [
//         { label: "9 sq. metre (Standard Stall)", value: "9" },
//       ],
//       fairTimingsText: DEFAULT_TIMINGS_PREFILL,
//       termsAndConditionsHTML: DEFAULT_TERMS_PREFILL,
//       isActive: false,
//     };
//     setSelected(newConfig);
//     setStartDatePicker(null);
//     setEndDatePicker(null);
//     setViewMode("editor");
//     setActiveTab("general");
//     setMsg("");
//     setErrorMsg("");
//   };

//   const handleEdit = (item: any) => {
//     setSelected({
//       ...item,
//       tagLabel: item.tagLabel || "FLAGSHIP EVENT",
//       fairSubtitle: item.fairSubtitle?.trim() || DEFAULT_SUBTITLE,
//       logoSrc: DEFAULT_LOGO,
//       locationName: item.locationName || "",
//       stallSelectionVenue: item.stallSelectionVenue || "",
//       organizerName: STATIC_ORGANIZER_NAME,
//       organizerSubtext: STATIC_ORGANIZER_SUBTEXT,
//       fairTimingsText: item.fairTimingsText?.trim() || DEFAULT_TIMINGS_PREFILL,
//       termsAndConditionsHTML:
//         item.termsAndConditionsHTML?.trim() || DEFAULT_TERMS_PREFILL,
//     });
//     setStartDatePicker(null);
//     setEndDatePicker(null);
//     setViewMode("editor");
//     setActiveTab("general");
//     setMsg("");
//     setErrorMsg("");
//   };

//   const openPublishModal = (item: any) => {
//     const targetState = !item.isActive;
//     setPublishModal({
//       isOpen: true,
//       item,
//       targetState,
//     });
//   };

//   const closePublishModal = () => {
//     setPublishModal({ isOpen: false, item: null, targetState: false });
//   };

//   const handleConfirmPublishToggle = async () => {
//     const item = publishModal.item;
//     const targetState = publishModal.targetState;
//     if (!item) return;

//     closePublishModal();
//     setSaving(true);
//     setErrorMsg("");
//     try {
//       if (targetState) {
//         const currentlyActive = list.filter(
//           (i) => i.isActive && i._id !== item._id && i.slug !== item.slug
//         );
//         for (const activeItem of currentlyActive) {
//           await safeFetchJson("/api/form-schema", {
//             method: activeItem._id ? "PUT" : "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ ...activeItem, isActive: false }),
//           });
//         }
//       }

//       const updatedPayload = {
//         ...item,
//         fairSubtitle: item.fairSubtitle?.trim() || DEFAULT_SUBTITLE,
//         logoSrc: DEFAULT_LOGO,
//         organizerName: STATIC_ORGANIZER_NAME,
//         organizerSubtext: STATIC_ORGANIZER_SUBTEXT,
//         isActive: targetState
//       };
//       const json = await safeFetchJson("/api/form-schema", {
//         method: item._id ? "PUT" : "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedPayload),
//       });
//       if (json.success) {
//         setMsg(
//           targetState
//             ? `"${item.fairTitle || "Event"}" broadcast is now LIVE!`
//             : `"${item.fairTitle || "Event"}" returned to DRAFT mode.`
//         );
//         await loadAll();
//         if (
//           selected &&
//           (selected._id === item._id || selected.slug === item.slug)
//         ) {
//           setSelected((prev: any) => ({ ...prev, isActive: targetState }));
//         }
//         setTimeout(() => setMsg(""), 3500);
//       }
//     } catch (err: any) {
//       setErrorMsg(`Toggle error: ${err.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const confirmDeleteModalOpen = (id: string, title: string) => {
//     setDeleteModal({ isOpen: true, id, title });
//   };

//   const confirmDeleteModalClose = () => {
//     setDeleteModal({ isOpen: false, id: null, title: "" });
//   };

//   const handleDeleteConfirmed = async () => {
//     if (!deleteModal.id) return;
//     try {
//       const json = await safeFetchJson(`/api/form-schema?id=${deleteModal.id}`, {
//         method: "DELETE",
//       });
//       if (json.success) {
//         setMsg("Template deleted.");
//         loadAll();
//         setTimeout(() => setMsg(""), 3000);
//       }
//     } catch (err: any) {
//       setErrorMsg(`Delete error: ${err.message}`);
//     } finally {
//       confirmDeleteModalClose();
//     }
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setMsg("");
//     setErrorMsg("");
//     try {
//       const payloadToSave = {
//         ...selected,
//         fairSubtitle: selected.fairSubtitle?.trim() || DEFAULT_SUBTITLE,
//         logoSrc: DEFAULT_LOGO,
//         organizerName: STATIC_ORGANIZER_NAME,
//         organizerSubtext: STATIC_ORGANIZER_SUBTEXT,
//       };
//       const isUpdate = Boolean(selected._id);
//       const method = isUpdate ? "PUT" : "POST";
//       const json = await safeFetchJson("/api/form-schema", {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payloadToSave),
//       });
//       if (json.success && json.data) {
//         setSelected({
//           ...json.data,
//           fairSubtitle: json.data.fairSubtitle?.trim() || DEFAULT_SUBTITLE,
//           logoSrc: DEFAULT_LOGO,
//           organizerName: STATIC_ORGANIZER_NAME,
//           organizerSubtext: STATIC_ORGANIZER_SUBTEXT,
//           fairTimingsText:
//             json.data.fairTimingsText?.trim() || DEFAULT_TIMINGS_PREFILL,
//           termsAndConditionsHTML:
//             json.data.termsAndConditionsHTML?.trim() || DEFAULT_TERMS_PREFILL,
//         });
//         setMsg("Template changes saved & committed!");
//         await loadAll();
//         setTimeout(() => setMsg(""), 3500);
//       }
//     } catch (err: any) {
//       setErrorMsg(`Save error: ${err.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const filteredList = useMemo(() => {
//     if (!searchQuery.trim()) return list;
//     const q = searchQuery.toLowerCase();
//     return list.filter(
//       (item) =>
//         (item.fairTitle || "").toLowerCase().includes(q) ||
//         (item.organizerName || "").toLowerCase().includes(q) ||
//         (item.locationName || item.stallSelectionVenue || "")
//           .toLowerCase()
//           .includes(q)
//     );
//   }, [list, searchQuery]);

//   const currentlyActiveForm = useMemo(() => {
//     return list.find((i) => i.isActive);
//   }, [list]);

//   const formatDateDDMMYYYY = (d: Date | null) => {
//     if (!d) return "";
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const handleRangeUpdate = (start: Date | null, end: Date | null) => {
//     setStartDatePicker(start);
//     setEndDatePicker(end);
//     const startStr = formatDateDDMMYYYY(start);
//     const endStr = formatDateDDMMYYYY(end);

//     const specialDateStr = endStr ? endStr.replace(/\//g, ".") : (startStr ? startStr.replace(/\//g, ".") : "03.02.2026");

//     if (startStr && endStr) {
//       setSelected((prev: any) => ({
//         ...prev,
//         fairDates: `${startStr} to ${endStr}`,
//         fairTimingsText: `Timing of the Fair: From 12:00 noon to 8:00 PM on all days and 12:00 noon to 9:00 PM on ${specialDateStr}. Fair timings may be changed by the authorities as may be deemed necessary.`,
//       }));
//     } else if (startStr) {
//       setSelected((prev: any) => ({ ...prev, fairDates: startStr }));
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#570013] px-4">
//         <Loader2 className="w-10 h-10 animate-spin mb-3 text-[#570013]" />
//         <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#584141] text-center">
//           Loading Cultural Events Registry...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div id="root-portal" className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 font-['Libre_Franklin'] bg-[#fff8f5] min-h-screen text-[#1e1b18] relative">
//       {msg && (
//         <div className="mb-6 p-4 rounded-2xl bg-emerald-950/5 border border-emerald-500/30 text-emerald-900 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
//           <div className="flex items-center gap-2.5">
//             <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
//             <span>{msg}</span>
//           </div>
//         </div>
//       )}

//       {errorMsg && (
//         <div className="mb-6 p-4 rounded-2xl bg-red-950/5 border border-red-500/30 text-red-900 text-xs font-bold flex items-center gap-2.5">
//           <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
//           <span>{errorMsg}</span>
//         </div>
//       )}

//       {viewMode === "cards" ? (
//         <div className="space-y-6">
//           <div className="bg-gradient-to-r from-white via-[#fff8f5] to-[#fef2eb] p-8 rounded-3xl border border-[#e0bfbf]/70 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
//             <div className="space-y-1">
//               <span className="text-[10px] font-extrabold text-[#775a19] uppercase tracking-[0.2em] flex items-center gap-1.5">
//                 <Sparkles className="w-3.5 h-3.5 text-amber-600" /> CMS Administration
//               </span>
//               <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
//                 <Sparkles className="w-6 h-6 text-amber-600" /> Manage Cultural Events &amp; Festivities
//               </h1>
//               <p className="text-xs text-[#564242]">
//                 View, search, edit, and publish live event schedules for your portal.
//               </p>
//             </div>
//             <button
//               type="button"
//               onClick={handleCreateNew}
//               className="inline-flex items-center gap-2 bg-[#570013] text-white px-6 py-3.5 rounded-2xl text-xs font-bold shadow-md hover:bg-[#40000e] hover:shadow-lg transition-all cursor-pointer active:scale-95 shrink-0"
//             >
//               <Plus className="w-4 h-4" /> Add New Event
//             </button>
//           </div>

//           <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-[#e0bfbf] shadow-xs p-5 sm:p-8 space-y-6">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e0bfbf]/50">
//               <div className="flex items-center gap-2.5 text-[#570013]">
//                 <Layers className="w-5 h-5 text-[#775a19]" />
//                 <h2 className="text-lg sm:text-xl font-bold font-['Playfair_Display']">
//                   All Scheduled Events
//                 </h2>
//               </div>
//               <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//                 <div className="relative flex-1 sm:w-72">
//                   <Search className="w-4 h-4 text-[#775a19] absolute left-3.5 top-1/2 -translate-y-1/2" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search by title, location..."
//                     className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e0bfbf] bg-[#fbf2ed]/50 text-xs font-medium text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/20"
//                   />
//                 </div>
//                 <div className="bg-[#fbf2ed] border border-[#e0bfbf] text-[#570013] px-4 py-2.5 rounded-xl text-xs font-bold text-center shrink-0">
//                   {filteredList.length} Found
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {filteredList.length === 0 ? (
//                 <div className="py-16 text-center text-gray-400 text-xs font-medium">
//                   No scheduled events match your search query.
//                 </div>
//               ) : (
//                 filteredList.map((item, idx) => (
//                   <div
//                     key={item._id || item.slug || idx}
//                     className="border border-[#e0bfbf] rounded-[1.25rem] p-4 sm:p-6 bg-white hover:bg-[#fffdfb] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
//                   >
//                     <div className="flex items-start gap-3.5 sm:gap-5 w-full md:w-auto">
//                       <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#fbf2ed] to-[#fed488]/30 border border-[#e0bfbf] flex items-center justify-center shrink-0 overflow-hidden p-1">
//                         <img
//                           src={item.logoSrc || DEFAULT_LOGO}
//                           alt={item.fairTitle || "Logo"}
//                           onError={(e) => {
//                             (e.target as HTMLImageElement).src = "https://placehold.co/100x100/fff8f5/570013?text=Logo";
//                           }}
//                           className="w-full h-full object-contain"
//                         />
//                       </div>
//                       <div className="space-y-1.5 flex-1 min-w-0">
//                         <div className="flex flex-wrap items-center gap-1.5">
//                           <span className="inline-flex items-center gap-1 bg-[#fbf2ed] text-[#775a19] border border-[#e0bfbf]/60 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
//                             <Tag className="w-2.5 h-2.5" />
//                             {item.tagLabel || "FLAGSHIP EVENT"}
//                           </span>
//                           <span
//                             className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
//                               item.isActive
//                                 ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
//                                 : "bg-amber-100 text-amber-800 border border-amber-300"
//                             }`}
//                           >
//                             {item.isActive ? "PUBLISHED" : "DRAFT"}
//                           </span>
//                         </div>
//                         <h3 className="text-base sm:text-xl font-bold font-['Playfair_Display'] text-[#570013] leading-snug truncate sm:whitespace-normal">
//                           {item.fairTitle || "Untitled Fair"}
//                         </h3>
//                         <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-[11px] sm:text-xs text-[#584141] font-medium pt-0.5">
//                           <span className="inline-flex items-center gap-1.5 truncate">
//                             <Calendar className="w-3.5 h-3.5 text-[#775a19] shrink-0" />
//                             <span className="truncate">
//                               {formatDisplayDate(item.fairDates) || "Dates not set"}
//                             </span>
//                           </span>
//                           <span className="inline-flex items-center gap-1.5 truncate">
//                             <MapPin className="w-3.5 h-3.5 text-[#775a19] shrink-0" />
//                             <span className="truncate">
//                               {item.locationName ||
//                                 item.stallSelectionVenue ||
//                                 "Venue not set"}
//                             </span>
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-[#e0bfbf]/40 w-full md:w-auto">
//                       <button
//                         type="button"
//                         onClick={() => openPublishModal(item)}
//                         disabled={saving}
//                         className={`flex-1 md:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
//                           item.isActive
//                             ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
//                             : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
//                         }`}
//                         title="Toggle Published State"
//                       >
//                         {item.isActive ? (
//                           <>
//                             <EyeOff className="w-3.5 h-3.5" /> Unpublish
//                           </>
//                         ) : (
//                           <>
//                             <Globe className="w-3.5 h-3.5" /> Publish
//                           </>
//                         )}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => handleEdit(item)}
//                         className="bg-white hover:bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-2xs"
//                       >
//                         <Edit3 className="w-3.5 h-3.5" /> Edit
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() =>
//                           confirmDeleteModalOpen(item._id, item.fairTitle)
//                         }
//                         className="text-red-700 hover:bg-red-50 border border-red-200/80 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center"
//                         title="Delete"
//                       >
//                         <Trash2 className="w-3.5 h-3.5" />
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div className="bg-gradient-to-r from-white via-[#fff8f5] to-[#fef2eb] p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/70 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
//             <div className="space-y-1.5">
//               <button
//                 type="button"
//                 onClick={() => setViewMode("cards")}
//                 className="inline-flex items-center gap-2 text-xs font-semibold text-[#570013] hover:text-[#800020] cursor-pointer bg-white px-3.5 py-1.5 rounded-xl border border-[#e0bfbf]/80 shadow-2xs transition-all mb-1"
//               >
//                 <ArrowLeft className="w-3.5 h-3.5" /> Back to Events Registry
//               </button>
//               <div className="text-[10px] font-extrabold text-[#775a19] uppercase tracking-[0.2em] flex items-center gap-1.5">
//                 <Sparkles className="w-3.5 h-3.5 text-amber-600" /> CMS ADMINISTRATION
//               </div>
//               <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
//                 <Sparkles className="w-5 h-5 text-amber-600" /> {selected?._id ? "Edit Event Configuration" : "Create New Event Configuration"}
//               </h1>
//               <p className="text-xs text-[#564242]">Configure event details, stall tier options, and terms.</p>
//             </div>

//           </div>

//           <div className="bg-white p-5 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] border border-[#e0bfbf] shadow-xs flex flex-col space-y-8">
//             <form
//               onSubmit={handleSave}
//               className="flex-1 flex flex-col justify-between space-y-8"
//             >
//               <div className="space-y-6">
//                 <div className="flex flex-wrap items-center gap-2 border-b border-[#e0bfbf]/50 pb-4">
//                   {[
//                     { id: "general", label: "General & Identity" },
//                     { id: "space", label: "Stall / Space Options" },
//                     { id: "terms", label: "Terms & Conditions" },
//                   ].map((tab) => (
//                     <button
//                       key={tab.id}
//                       type="button"
//                       onClick={() => setActiveTab(tab.id as any)}
//                       className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
//                         activeTab === tab.id
//                           ? "bg-[#570013] text-white shadow-md shadow-[#570013]/20"
//                           : "text-[#584141] hover:bg-[#fbf2ed]"
//                       }`}
//                     >
//                       {tab.label}
//                     </button>
//                   ))}
//                 </div>

//                 {activeTab === "general" && (
//                   <div className="space-y-8 animate-fadeIn">
//                     <div className="border border-[#e0bfbf]/60 p-5 sm:p-6 rounded-2xl bg-[#fffaf8]/60 space-y-5">
//                       <div className="border-b border-[#e0bfbf]/40 pb-3 flex items-center justify-between">
//                         <div>
//                           <h3 className="text-xs font-bold uppercase tracking-widest text-[#570013]">
//                             1. Event Identity &amp; Branding
//                           </h3>
//                           <p className="text-[11px] text-[#584141] mt-0.5">
//                             Core titles and badges displayed on participant application headers.
//                           </p>
//                         </div>
//                         <span className="inline-flex items-center gap-1 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
//                           <Lock className="w-3 h-3 text-[#775a19]" /> Locked Metadata
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                         <div>
//                           <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2">
//                             EVENT BADGE / TAG LABEL
//                           </label>
//                           <input
//                             type="text"
//                             value={selected.tagLabel || ""}
//                             onChange={(e) =>
//                               setSelected({ ...selected, tagLabel: e.target.value })
//                             }
//                             placeholder="e.g. FLAGSHIP EVENT"
//                             className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-white border-[#e0bfbf] focus:outline-none focus:ring-2 focus:ring-[#570013]/20"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2">
//                             PRIMARY FAIR TITLE
//                           </label>
//                           <input
//                             type="text"
//                             value={selected.fairTitle || ""}
//                             onChange={(e) =>
//                               setSelected({ ...selected, fairTitle: e.target.value })
//                             }
//                             placeholder="e.g. 49th International Kolkata Book Fair 2026"
//                             className="w-full border p-3.5 rounded-2xl text-sm font-bold font-['Playfair_Display'] bg-white border-[#e0bfbf] focus:outline-none focus:ring-2 focus:ring-[#570013]/20"
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                         <div>
//                           <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2">
//                             HEADER SUBTITLE BANNER TEXT (READ-ONLY)
//                           </label>
//                           <div className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-[#f3ece9] text-[#584141] border-[#e0bfbf]/70 cursor-not-allowed select-none">
//                             {selected.fairSubtitle || DEFAULT_SUBTITLE}
//                           </div>
//                         </div>
//                         <div>
//                           <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2 flex items-center gap-1.5">
//                             <ImageIcon className="w-3.5 h-3.5 text-[#775a19]" /> ORGANIZATION LOGO ASSET
//                           </label>
//                           <div className="w-full border p-2.5 px-4 rounded-2xl bg-[#f3ece9] border-[#e0bfbf]/70 flex items-center justify-between cursor-not-allowed select-none">
//                             <span className="text-xs font-semibold text-[#584141]">Official System Header Logo</span>
//                             <div className="w-10 h-10 rounded-xl bg-white border border-[#e0bfbf] p-1 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
//                               <img
//                                 src={selected.logoSrc || DEFAULT_LOGO}
//                                 alt="Logo"
//                                 onError={(e) => {
//                                   (e.target as HTMLImageElement).src = "https://placehold.co/100x100/fff8f5/570013?text=Logo";
//                                 }}
//                                 className="w-full h-full object-contain"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="border border-[#e0bfbf]/60 p-5 sm:p-6 rounded-2xl bg-[#fffaf8]/60 space-y-5">
//                       <div className="border-b border-[#e0bfbf]/40 pb-3">
//                         <h3 className="text-xs font-bold uppercase tracking-widest text-[#570013]">
//                           2. Schedule &amp; Venue Telemetry
//                         </h3>
//                         <p className="text-[11px] text-[#584141] mt-0.5">
//                           Define main exhibition runtime and stall allocation milestones.
//                         </p>
//                       </div>

//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
//                         <div className="relative">
//                           <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2 flex items-center gap-1.5">
//                             <Calendar className="w-3.5 h-3.5 text-[#775a19]" /> FAIR DATES RANGE (DD/MM/YYYY)
//                           </label>
//                           <div className="grid grid-cols-2 gap-2 relative">
//                             <DatePicker
//                               selected={startDatePicker}
//                               onChange={(date: Date | null) =>
//                                 handleRangeUpdate(date, endDatePicker)
//                               }
//                               dateFormat="dd/MM/yyyy"
//                               minDate={new Date()}
//                               selectsStart
//                               startDate={startDatePicker}
//                               endDate={endDatePicker}
//                               placeholderText="Start Date"
//                               portalId="root-portal"
//                               popperClassName="z-[9999]"
//                               className="w-full border p-3 rounded-xl text-xs font-semibold bg-white border-[#e0bfbf]"
//                             />
//                             <DatePicker
//                               selected={endDatePicker}
//                               onChange={(date: Date | null) =>
//                                 handleRangeUpdate(startDatePicker, date)
//                               }
//                               dateFormat="dd/MM/yyyy"
//                               minDate={startDatePicker || new Date()}
//                               selectsEnd
//                               startDate={startDatePicker}
//                               endDate={endDatePicker}
//                               placeholderText="End Date"
//                               portalId="root-portal"
//                               popperClassName="z-[9999]"
//                               className="w-full border p-3 rounded-xl text-xs font-semibold bg-white border-[#e0bfbf]"
//                             />
//                           </div>
//                         </div>

//                         <div>
//                           <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2 flex items-center gap-1.5">
//                             <MapPin className="w-3.5 h-3.5 text-[#775a19]" /> MAIN VENUE / LOCATION NAME
//                           </label>
//                           <input
//                             type="text"
//                             value={selected.locationName || ""}
//                             onChange={(e) =>
//                               setSelected({
//                                 ...selected,
//                                 locationName: e.target.value,
//                               })
//                             }
//                             placeholder="e.g. Central Park Mela Ground, Salt Lake, Kolkata"
//                             className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-white border-[#e0bfbf]"
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 items-start">
//                         <div className="relative">
//                           <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2">
//                             STALL SELECTION DATE &amp; TIME
//                           </label>
//                           <DatePicker
//                             showTimeSelect
//                             dateFormat="dd/MM/yyyy h:mm aa"
//                             minDate={new Date()}
//                             placeholderText="Select date and time (DD/MM/YYYY)"
//                             portalId="root-portal"
//                             popperClassName="z-[9999]"
//                             selected={parseCustomDateTime(selected.stallSelectionText)}
//                             onChange={(date: Date | null) => {
//                               if (date) {
//                                 const day = String(date.getDate()).padStart(2, "0");
//                                 const month = String(date.getMonth() + 1).padStart(2, "0");
//                                 const year = date.getFullYear();
//                                 const timeStr = date
//                                   .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//                                   .toLowerCase();
//                                 setSelected({
//                                   ...selected,
//                                   stallSelectionText: `${day}/${month}/${year} at ${timeStr}`,
//                                 });
//                               }
//                             }}
//                             className="w-full border p-3.5 rounded-2xl text-xs font-bold bg-white border-[#e0bfbf]"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2 flex items-center gap-1.5">
//                             <MapPin className="w-3.5 h-3.5 text-[#775a19]" /> STALL SELECTION MEETING VENUE
//                           </label>
//                           <input
//                             type="text"
//                             value={selected.stallSelectionVenue || ""}
//                             onChange={(e) =>
//                               setSelected({
//                                 ...selected,
//                                 stallSelectionVenue: e.target.value,
//                               })
//                             }
//                             placeholder="e.g. Guild House, Salt Lake, Kolkata"
//                             className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-white border-[#e0bfbf]"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="border border-[#e0bfbf]/60 p-5 sm:p-6 rounded-2xl bg-[#fffaf8]/60 space-y-5">
//                       <div className="border-b border-[#e0bfbf]/40 pb-3 flex items-center justify-between">
//                         <div>
//                           <h3 className="text-xs font-bold uppercase tracking-widest text-[#570013]">
//                             3. Organizing Authority
//                           </h3>
//                           <p className="text-[11px] text-[#584141] mt-0.5">
//                             Entity names appearing in official footer or seal blocks (Read-Only).
//                           </p>
//                         </div>
//                         <span className="inline-flex items-center gap-1 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
//                           <Lock className="w-3 h-3 text-[#775a19]" /> Locked Metadata
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                         <div>
//                           <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2 flex items-center gap-1.5">
//                             <Building className="w-3.5 h-3.5 text-[#775a19]" /> ORGANIZER NAME
//                           </label>
//                           <div className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-[#f3ece9] text-[#584141] border-[#e0bfbf]/70 cursor-not-allowed select-none">
//                             {STATIC_ORGANIZER_NAME}
//                           </div>
//                         </div>
//                         <div>
//                           <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2">
//                             ORGANIZER SUBTEXT LINE
//                           </label>
//                           <div className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-[#f3ece9] text-[#584141] border-[#e0bfbf]/70 cursor-not-allowed select-none">
//                             {STATIC_ORGANIZER_SUBTEXT}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {activeTab === "space" && (
//                   <div className="space-y-5 animate-fadeIn">
//                     <div className="bg-[#fffaf8] p-5 rounded-2xl border border-[#e0bfbf]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                       <div>
//                         <h4 className="text-xs font-bold text-[#570013] uppercase tracking-wide">
//                           Dynamic Stall Tier Catalog
//                         </h4>
//                         <p className="text-[11px] text-[#775a19] mt-0.5">
//                           Configure stall size tiers and values for exhibitors.
//                         </p>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setSelected({
//                             ...selected,
//                             spaceOptions: [
//                               ...(selected.spaceOptions || []),
//                               { label: "", value: "" },
//                             ],
//                           });
//                         }}
//                         className="bg-[#570013] text-white hover:bg-[#800020] text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-2xs self-start"
//                       >
//                         <Plus className="w-3.5 h-3.5 text-[#fed488]" /> Add Stall Tier
//                       </button>
//                     </div>

//                     <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
//                       {(selected.spaceOptions || []).map(
//                         (opt: { label: string; value: string }, idx: number) => (
//                           <div
//                             key={idx}
//                             className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center bg-[#fffaf8] p-3 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#e0bfbf] transition-all"
//                           >
//                             <div className="flex items-center gap-2.5 flex-1">
//                               <span className="w-7 text-center text-[10px] font-extrabold text-[#775a19] bg-white rounded-xl py-1.5 border border-[#e0bfbf]/50 shrink-0">
//                                 #{idx + 1}
//                               </span>
//                               <input
//                                 type="text"
//                                 placeholder="e.g. 9 sq. metre (Standard Stall)"
//                                 value={opt.label}
//                                 onChange={(e) => {
//                                   const updated = [
//                                     ...(selected.spaceOptions || []),
//                                   ];
//                                   updated[idx] = {
//                                     ...updated[idx],
//                                     label: e.target.value,
//                                   };
//                                   setSelected({
//                                     ...selected,
//                                     spaceOptions: updated,
//                                   });
//                                 }}
//                                 className="flex-1 border p-2.5 sm:p-3 rounded-xl text-xs font-semibold bg-white border-[#e0bfbf]/80"
//                               />
//                             </div>
//                             <div className="flex items-center gap-2.5">
//                               <input
//                                 type="text"
//                                 placeholder="Value (e.g. 9)"
//                                 value={opt.value}
//                                 onChange={(e) => {
//                                   const updated = [
//                                     ...(selected.spaceOptions || []),
//                                   ];
//                                   updated[idx] = {
//                                     ...updated[idx],
//                                     value: e.target.value,
//                                   };
//                                   setSelected({
//                                     ...selected,
//                                     spaceOptions: updated,
//                                   });
//                                 }}
//                                 className="w-24 sm:w-32 border p-2.5 sm:p-3 rounded-xl text-xs font-bold bg-white border-[#e0bfbf]/80"
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   const updated = (
//                                     selected.spaceOptions || []
//                                   ).filter((_: any, i: number) => i !== idx);
//                                   setSelected({
//                                     ...selected,
//                                     spaceOptions: updated,
//                                   });
//                                 }}
//                                 className="text-red-700 hover:text-white hover:bg-red-600 p-3 rounded-xl transition-all cursor-pointer border border-transparent shrink-0"
//                                 title="Delete tier"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </div>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {activeTab === "terms" && (
//                   <div className="space-y-5 animate-fadeIn">
//                     <div className="bg-[#fffaf8] p-5 rounded-2xl border border-[#e0bfbf]/70 space-y-2">
//                       <label className="text-[11px] font-bold uppercase tracking-wider text-[#584141] flex items-center gap-1.5">
//                         <Clock className="w-3.5 h-3.5 text-[#775a19]" /> Fair Timings Display Text
//                       </label>
//                       <input
//                         type="text"
//                         value={selected.fairTimingsText || ""}
//                         onChange={(e) =>
//                           setSelected({
//                             ...selected,
//                             fairTimingsText: e.target.value,
//                           })
//                         }
//                         placeholder="e.g. Timing of the Fair: From 12:00 noon to 8:00 PM on all days"
//                         className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-white border-[#e0bfbf]"
//                       />
//                     </div>

//                     <div className="bg-[#fffaf8] p-5 rounded-2xl border border-[#e0bfbf]/60 space-y-3">
//                       <div className="flex items-center justify-between">
//                         <label className="text-[11px] font-bold uppercase tracking-wider text-[#584141] flex items-center gap-1.5">
//                           <FileText className="w-3.5 h-3.5 text-[#775a19]" /> Standardized Terms &amp; Conditions (Read-Only)
//                         </label>
//                         <span className="text-[10px] bg-white text-[#570013] border border-[#e0bfbf] px-2.5 py-0.5 rounded-full font-semibold">
//                           Global Standard Applied
//                         </span>
//                       </div>
//                       <div
//                         className="w-full max-h-[480px] overflow-y-auto border p-5 rounded-2xl text-xs text-[#1e1b18] bg-white border-[#e0bfbf]/80 space-y-3 leading-relaxed text-justify shadow-2xs"
//                         dangerouslySetInnerHTML={{
//                           __html:
//                             selected.termsAndConditionsHTML ||
//                             DEFAULT_TERMS_PREFILL,
//                         }}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="pt-6 border-t border-[#e0bfbf]/60 flex flex-col sm:flex-row items-center justify-between gap-4">

//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="w-full sm:w-auto bg-gradient-to-r from-[#570013] to-[#800020] text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#570013]/20 hover:opacity-95 transition-all active:scale-95 disabled:opacity-50"
//                 >
//                   {saving ? (
//                     <Loader2 className="w-4 h-4 animate-spin text-[#fed488]" />
//                   ) : (
//                     <Save className="w-4 h-4 text-[#fed488]" />
//                   )}
//                   Commit Template Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {publishModal.isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
//           <div className="bg-white rounded-[2rem] border border-[#e0bfbf] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center">
//             <div
//               className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
//                 publishModal.targetState
//                   ? "bg-emerald-100 text-emerald-700"
//                   : "bg-amber-100 text-amber-700"
//               }`}
//             >
//               {publishModal.targetState ? (
//                 <Globe className="w-6 h-6" />
//               ) : (
//                 <EyeOff className="w-6 h-6" />
//               )}
//             </div>
//             <div className="space-y-2">
//               <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#570013]">
//                 {publishModal.targetState
//                   ? "Publish Event Live?"
//                   : "Unpublish Event?"}
//               </h3>
//               <p className="text-xs text-[#584141] leading-relaxed">
//                 {publishModal.targetState ? (
//                   <>
//                     Making{" "}
//                     <span className="font-bold text-[#570013]">
//                       &quot;{publishModal.item?.fairTitle || "this event"}&quot;
//                     </span>{" "}
//                     LIVE will automatically unpublish any currently active event
//                     so only one form remains public.
//                   </>
//                 ) : (
//                   <>
//                     Are you sure you want to return{" "}
//                     <span className="font-bold text-[#570013]">
//                       &quot;{publishModal.item?.fairTitle || "this event"}&quot;
//                     </span>{" "}
//                     to draft status? Public access to participation forms for this event will be paused.
//                   </>
//                 )}
//               </p>
//               {publishModal.targetState && currentlyActiveForm && (
//                 <div className="mt-3 p-3 rounded-xl bg-[#fbf2ed] border border-[#e0bfbf]/60 text-[11px] text-[#775a19]">
//                   Currently live: <strong>{currentlyActiveForm.fairTitle || "Untitled"}</strong> (will be replaced)
//                 </div>
//               )}
//             </div>
//             <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
//               <button
//                 type="button"
//                 onClick={closePublishModal}
//                 className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-[#e0bfbf] text-xs font-bold text-[#584141] hover:bg-[#fbf2ed] transition-all cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleConfirmPublishToggle}
//                 className={`w-full sm:flex-1 py-3 px-4 rounded-xl text-white text-xs font-bold transition-all cursor-pointer shadow-md ${
//                   publishModal.targetState
//                     ? "bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20"
//                     : "bg-amber-700 hover:bg-amber-800 shadow-amber-700/20"
//                 }`}
//               >
//                 {publishModal.targetState ? "Confirm & Go Live" : "Confirm Unpublish"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {deleteModal.isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
//           <div className="bg-white rounded-[2rem] border border-[#e0bfbf] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center">
//             <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
//               <AlertTriangle className="w-6 h-6" />
//             </div>
//             <div className="space-y-2">
//               <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#570013]">
//                 Confirm Deletion
//               </h3>
//               <p className="text-xs text-[#584141] leading-relaxed">
//                 Are you sure you want to delete template{" "}
//                 <span className="font-bold text-[#570013]">
//                   &quot;{deleteModal.title || "this event"}&quot;
//                 </span>
//                 ? This action cannot be undone.
//               </p>
//             </div>
//             <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
//               <button
//                 type="button"
//                 onClick={confirmDeleteModalClose}
//                 className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-[#e0bfbf] text-xs font-bold text-[#584141] hover:bg-[#fbf2ed] transition-all cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDeleteConfirmed}
//                 className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-600/20"
//               >
//                 Delete Template
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Loader2,
  Save,
  Plus,
  CheckCircle2,
  Trash2,
  Calendar,
  MapPin,
  FileText,
  Building,
  Clock,
  Edit3,
  ArrowLeft,
  AlertCircle,
  Layers,
  AlertTriangle,
  Search,
  Sparkles,
  Tag,
  Globe,
  EyeOff,
  Lock,
  Image as ImageIcon,
} from "lucide-react";

const DEFAULT_TERMS_PREFILL = `
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
`;

const DEFAULT_TIMINGS_PREFILL =
  "Timing of the Fair: From 12:00 noon to 8:00 PM on all days and 12:00 noon to 9:00 PM on 03.02.2026. Fair timings may be changed by the authorities as may be deemed necessary.";

const STATIC_ORGANIZER_NAME = "ASSOCIATION OF BENGAL";
const STATIC_ORGANIZER_SUBTEXT = "FOR LITERATURE AND CULTURE";
const DEFAULT_SUBTITLE = "FORM FOR PARTICIPATION WITH THE BUILT UP STALLS";
const DEFAULT_LOGO = "/images/logo/balc_logo.png";

const formatDisplayDate = (dateVal: string | undefined) => {
  if (!dateVal) return "";
  if (dateVal.includes("to")) return dateVal;

  const parsed = Date.parse(dateVal);
  if (isNaN(parsed)) return dateVal;

  const d = new Date(parsed);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseCustomDateTime = (str: string) => {
  if (!str) return null;
  try {
    const parts = str.split(" at ");
    if (parts.length !== 2) return null;
    const [datePart, timePart] = parts;
    const [day, month, year] = datePart.split("/").map(Number);
    if (!day || !month || !year) return null;

    const timeClean = timePart.trim().toLowerCase();
    const isPM = timeClean.includes("pm");
    const isAM = timeClean.includes("am");
    const timeDigits = timeClean.replace(/(am|pm)/g, "").trim();
    let [hours, minutes] = timeDigits.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) return null;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    const d = new Date(year, month - 1, day, hours, minutes);
    return isNaN(d.getTime()) ? null : d;
  } catch (e) {
    return null;
  }
};

const parseFairDatesRange = (rangeStr: string) => {
  if (!rangeStr || !rangeStr.includes("to")) return { start: null, end: null };
  try {
    const [startPart, endPart] = rangeStr.split("to").map((s) => s.trim());
    const parseDate = (dStr: string) => {
      const [day, month, year] = dStr.split("/").map(Number);
      if (!day || !month || !year) return null;
      const d = new Date(year, month - 1, day);
      return isNaN(d.getTime()) ? null : d;
    };
    return {
      start: parseDate(startPart),
      end: parseDate(endPart),
    };
  } catch (e) {
    return { start: null, end: null };
  }
};

export default function AdminFairSettingsPage() {
  const [list, setList] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"cards" | "editor">("cards");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "space" | "terms">(
    "general",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [startDatePicker, setStartDatePicker] = useState<Date | null>(null);
  const [endDatePicker, setEndDatePicker] = useState<Date | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
    title: string;
  }>({
    isOpen: false,
    id: null,
    title: "",
  });

  const [publishModal, setPublishModal] = useState<{
    isOpen: boolean;
    item: any | null;
    targetState: boolean;
  }>({
    isOpen: false,
    item: null,
    targetState: false,
  });

  const safeFetchJson = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(`API failed (${res.status}): ${text.substring(0, 100)}`);
    }
    return res.json();
  };

  const loadAll = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const json = await safeFetchJson("/api/form-schema");
      if (json.allConfigs) {
        setList(json.allConfigs);
      } else if (json.data) {
        setList([json.data]);
      }
    } catch (err: any) {
      console.error("Safe load error:", err);
      setErrorMsg(
        "Could not fetch fair configs. Ensure API path /api/form-schema or your route exists and dev server is restarted.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateNew = () => {
    const slug = `fair-${Date.now()}`;
    const newConfig = {
      slug,
      fairTitle: "",
      fairSubtitle: DEFAULT_SUBTITLE,
      fairDates: "",
      stallSelectionText: "",
      stallSelectionVenue: "",
      organizerName: STATIC_ORGANIZER_NAME,
      organizerSubtext: STATIC_ORGANIZER_SUBTEXT,
      tagLabel: "FLAGSHIP EVENT",
      locationName: "",
      logoSrc: DEFAULT_LOGO,
      spaceOptions: [{ label: "9 sq. metre (Standard Stall)", value: "9" }],
      fairTimingsText: DEFAULT_TIMINGS_PREFILL,
      termsAndConditionsHTML: DEFAULT_TERMS_PREFILL,
      isActive: false,
    };
    setSelected(newConfig);
    setStartDatePicker(null);
    setEndDatePicker(null);
    setViewMode("editor");
    setActiveTab("general");
    setMsg("");
    setErrorMsg("");
  };

  const handleEdit = (item: any) => {
    const { start, end } = parseFairDatesRange(item.fairDates);

    setSelected({
      ...item,
      tagLabel: item.tagLabel || "FLAGSHIP EVENT",
      fairSubtitle: item.fairSubtitle?.trim() || DEFAULT_SUBTITLE,
      logoSrc: DEFAULT_LOGO,
      locationName: item.locationName || "",
      stallSelectionVenue: item.stallSelectionVenue || "",
      organizerName: STATIC_ORGANIZER_NAME,
      organizerSubtext: STATIC_ORGANIZER_SUBTEXT,
      fairTimingsText: item.fairTimingsText?.trim() || DEFAULT_TIMINGS_PREFILL,
      termsAndConditionsHTML:
        item.termsAndConditionsHTML?.trim() || DEFAULT_TERMS_PREFILL,
    });

    setStartDatePicker(start);
    setEndDatePicker(end);
    setViewMode("editor");
    setActiveTab("general");
    setMsg("");
    setErrorMsg("");
  };

  const openPublishModal = (item: any) => {
    const targetState = !item.isActive;
    setPublishModal({
      isOpen: true,
      item,
      targetState,
    });
  };

  const closePublishModal = () => {
    setPublishModal({ isOpen: false, item: null, targetState: false });
  };

  const handleConfirmPublishToggle = async () => {
    const item = publishModal.item;
    const targetState = publishModal.targetState;
    if (!item) return;

    closePublishModal();
    setSaving(true);
    setErrorMsg("");
    try {
      if (targetState) {
        const currentlyActive = list.filter(
          (i) => i.isActive && i._id !== item._id && i.slug !== item.slug,
        );
        for (const activeItem of currentlyActive) {
          await safeFetchJson("/api/form-schema", {
            method: activeItem._id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...activeItem, isActive: false }),
          });
        }
      }

      const updatedPayload = {
        ...item,
        fairSubtitle: item.fairSubtitle?.trim() || DEFAULT_SUBTITLE,
        logoSrc: DEFAULT_LOGO,
        organizerName: STATIC_ORGANIZER_NAME,
        organizerSubtext: STATIC_ORGANIZER_SUBTEXT,
        isActive: targetState,
      };
      const json = await safeFetchJson("/api/form-schema", {
        method: item._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });
      if (json.success) {
        setMsg(
          targetState
            ? `"${item.fairTitle || "Event"}" broadcast is now LIVE!`
            : `"${item.fairTitle || "Event"}" returned to DRAFT mode.`,
        );
        await loadAll();
        if (
          selected &&
          (selected._id === item._id || selected.slug === item.slug)
        ) {
          setSelected((prev: any) => ({ ...prev, isActive: targetState }));
        }
        setTimeout(() => setMsg(""), 3500);
      }
    } catch (err: any) {
      setErrorMsg(`Toggle error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteModalOpen = (id: string, title: string) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDeleteModalClose = () => {
    setDeleteModal({ isOpen: false, id: null, title: "" });
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteModal.id) return;
    try {
      const json = await safeFetchJson(
        `/api/form-schema?id=${deleteModal.id}`,
        {
          method: "DELETE",
        },
      );
      if (json.success) {
        setMsg("Template deleted.");
        loadAll();
        setTimeout(() => setMsg(""), 3000);
      }
    } catch (err: any) {
      setErrorMsg(`Delete error: ${err.message}`);
    } finally {
      confirmDeleteModalClose();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setErrorMsg("");
    try {
      const payloadToSave = {
        ...selected,
        locationName: selected.locationName || "",
        stallSelectionVenue: selected.stallSelectionVenue || "",
        fairSubtitle: selected.fairSubtitle?.trim() || DEFAULT_SUBTITLE,
        logoSrc: DEFAULT_LOGO,
        organizerName: STATIC_ORGANIZER_NAME,
        organizerSubtext: STATIC_ORGANIZER_SUBTEXT,
      };
      const isUpdate = Boolean(selected._id);
      const method = isUpdate ? "PUT" : "POST";
      const json = await safeFetchJson("/api/form-schema", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToSave),
      });
      if (json.success && json.data) {
        setSelected({
          ...json.data,
          fairSubtitle: json.data.fairSubtitle?.trim() || DEFAULT_SUBTITLE,
          logoSrc: DEFAULT_LOGO,
          organizerName: STATIC_ORGANIZER_NAME,
          organizerSubtext: STATIC_ORGANIZER_SUBTEXT,
          locationName: json.data.locationName || "",
          tagLabel: json.data.tagLabel || "FLAGSHIP EVENT",
          fairTimingsText:
            json.data.fairTimingsText?.trim() || DEFAULT_TIMINGS_PREFILL,
          termsAndConditionsHTML:
            json.data.termsAndConditionsHTML?.trim() || DEFAULT_TERMS_PREFILL,
        });
        setMsg("Template changes saved & committed!");
        await loadAll();
        setTimeout(() => setMsg(""), 3500);
      }
    } catch (err: any) {
      setErrorMsg(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        (item.fairTitle || "").toLowerCase().includes(q) ||
        (item.organizerName || "").toLowerCase().includes(q) ||
        (item.locationName || item.stallSelectionVenue || "")
          .toLowerCase()
          .includes(q),
    );
  }, [list, searchQuery]);

  const currentlyActiveForm = useMemo(() => {
    return list.find((i) => i.isActive);
  }, [list]);

  const formatDateDDMMYYYY = (d: Date | null) => {
    if (!d) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleRangeUpdate = (start: Date | null, end: Date | null) => {
    setStartDatePicker(start);
    setEndDatePicker(end);
    const startStr = formatDateDDMMYYYY(start);
    const endStr = formatDateDDMMYYYY(end);

    const specialDateStr = endStr
      ? endStr.replace(/\//g, ".")
      : startStr
        ? startStr.replace(/\//g, ".")
        : "03.02.2026";

    if (startStr && endStr) {
      setSelected((prev: any) => ({
        ...prev,
        fairDates: `${startStr} to ${endStr}`,
        fairTimingsText: `Timing of the Fair: From 12:00 noon to 8:00 PM on all days and 12:00 noon to 9:00 PM on ${specialDateStr}. Fair timings may be changed by the authorities as may be deemed necessary.`,
      }));
    } else if (startStr) {
      setSelected((prev: any) => ({ ...prev, fairDates: startStr }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#570013] px-4">
        <Loader2 className="w-10 h-10 animate-spin mb-3 text-[#570013]" />
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#584141] text-center">
          Loading Cultural Events Registry...
        </p>
      </div>
    );
  }

  return (
    <div
      id="root-portal"
      className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 font-['Libre_Franklin'] bg-[#fff8f5] min-h-screen text-[#1e1b18] relative"
    >
      {msg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/5 border border-emerald-500/30 text-emerald-900 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{msg}</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/5 border border-red-500/30 text-red-900 text-xs font-bold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {viewMode === "cards" ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-white via-[#fff8f5] to-[#fef2eb] p-8 rounded-3xl border border-[#e0bfbf]/70 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-[#775a19] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> CMS
                Administration
              </span>
              <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-amber-600" /> Manage Cultural
                Events &amp; Festivities
              </h1>
              <p className="text-xs text-[#564242]">
                View, search, edit, and publish live event schedules for your
                portal.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 bg-[#570013] text-white px-6 py-3.5 rounded-2xl text-xs font-bold shadow-md hover:bg-[#40000e] hover:shadow-lg transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add New Event
            </button>
          </div>

          <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-[#e0bfbf] shadow-xs p-5 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e0bfbf]/50">
              <div className="flex items-center gap-2.5 text-[#570013]">
                <Layers className="w-5 h-5 text-[#775a19]" />
                <h2 className="text-lg sm:text-xl font-bold font-['Playfair_Display']">
                  All Scheduled Events
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-[#775a19] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, location..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e0bfbf] bg-[#fbf2ed]/50 text-xs font-medium text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/20"
                  />
                </div>
                <div className="bg-[#fbf2ed] border border-[#e0bfbf] text-[#570013] px-4 py-2.5 rounded-xl text-xs font-bold text-center shrink-0">
                  {filteredList.length} Found
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredList.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-xs font-medium">
                  No scheduled events match your search query.
                </div>
              ) : (
                filteredList.map((item, idx) => (
                  <div
                    key={item._id || item.slug || idx}
                    className="border border-[#e0bfbf] rounded-[1.25rem] p-4 sm:p-6 bg-white hover:bg-[#fffdfb] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 sm:gap-5 w-full md:w-auto">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#fbf2ed] to-[#fed488]/30 border border-[#e0bfbf] flex items-center justify-center shrink-0 overflow-hidden p-1">
                        <img
                          src={item.logoSrc || DEFAULT_LOGO}
                          alt={item.fairTitle || "Logo"}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/100x100/fff8f5/570013?text=Logo";
                          }}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 bg-[#fbf2ed] text-[#775a19] border border-[#e0bfbf]/60 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                            <Tag className="w-2.5 h-2.5" />
                            {item.tagLabel || "FLAGSHIP EVENT"}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                              item.isActive
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-amber-100 text-amber-800 border border-amber-300"
                            }`}
                          >
                            {item.isActive ? "PUBLISHED" : "DRAFT"}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-xl font-bold font-['Playfair_Display'] text-[#570013] leading-snug truncate sm:whitespace-normal">
                          {item.fairTitle || "Untitled Fair"}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-[11px] sm:text-xs text-[#584141] font-medium pt-0.5">
                          <span className="inline-flex items-center gap-1.5 truncate">
                            <Calendar className="w-3.5 h-3.5 text-[#775a19] shrink-0" />
                            <span className="truncate">
                              {formatDisplayDate(item.fairDates) ||
                                "Dates not set"}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#775a19] shrink-0" />
                            <span className="truncate">
                              {item.locationName ||
                                item.stallSelectionVenue ||
                                "Venue not set"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-[#e0bfbf]/40 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => openPublishModal(item)}
                        disabled={saving}
                        className={`flex-1 md:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                          item.isActive
                            ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                        }`}
                        title="Toggle Published State"
                      >
                        {item.isActive ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" /> Unpublish
                          </>
                        ) : (
                          <>
                            <Globe className="w-3.5 h-3.5" /> Publish
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="bg-white hover:bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          confirmDeleteModalOpen(item._id, item.fairTitle)
                        }
                        className="text-red-700 hover:bg-red-50 border border-red-200/80 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-white via-[#fff8f5] to-[#fef2eb] p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/70 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#570013] hover:text-[#800020] cursor-pointer bg-white px-3.5 py-1.5 rounded-xl border border-[#e0bfbf]/80 shadow-2xs transition-all mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Events Registry
              </button>
              <div className="text-[10px] font-extrabold text-[#775a19] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> CMS
                ADMINISTRATION
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-600" />{" "}
                {selected?._id
                  ? "Edit Event Configuration"
                  : "Create New Event Configuration"}
              </h1>
              <p className="text-xs text-[#564242]">
                Configure event details, stall tier options, and terms.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] border border-[#e0bfbf] shadow-xs flex flex-col space-y-8">
            <form
              onSubmit={handleSave}
              className="flex-1 flex flex-col justify-between space-y-8"
            >
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2 border-b border-[#e0bfbf]/50 pb-4">
                  {[
                    { id: "general", label: "General & Identity" },
                    { id: "space", label: "Stall / Space Options" },
                    { id: "terms", label: "Terms & Conditions" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-[#570013] text-white shadow-md shadow-[#570013]/20"
                          : "text-[#584141] hover:bg-[#fbf2ed]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === "general" && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="border border-[#e0bfbf]/60 p-5 sm:p-6 rounded-2xl bg-[#fffaf8]/60 space-y-5">
                      <div className="border-b border-[#e0bfbf]/40 pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-[#570013]">
                            1. Event Identity &amp; Branding
                          </h3>
                          <p className="text-[11px] text-[#584141] mt-0.5">
                            Core titles and badges displayed on participant
                            application headers.
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                          <Lock className="w-3 h-3 text-[#775a19]" /> Locked
                          Metadata
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2">
                            EVENT BADGE / TAG LABEL
                          </label>
                          <input
                            type="text"
                            value={selected.tagLabel || ""}
                            onChange={(e) =>
                              setSelected({
                                ...selected,
                                tagLabel: e.target.value,
                              })
                            }
                            placeholder="e.g. FLAGSHIP EVENT"
                            className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-white border-[#e0bfbf] focus:outline-none focus:ring-2 focus:ring-[#570013]/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2">
                            PRIMARY FAIR TITLE
                          </label>
                          <input
                            type="text"
                            value={selected.fairTitle || ""}
                            onChange={(e) =>
                              setSelected({
                                ...selected,
                                fairTitle: e.target.value,
                              })
                            }
                            placeholder="e.g. 49th International Kolkata Book Fair 2026"
                            className="w-full border p-3.5 rounded-2xl text-sm font-bold font-['Playfair_Display'] bg-white border-[#e0bfbf] focus:outline-none focus:ring-2 focus:ring-[#570013]/20"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2">
                            HEADER SUBTITLE BANNER TEXT (READ-ONLY)
                          </label>
                          <div className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-[#f3ece9] text-[#584141] border-[#e0bfbf]/70 cursor-not-allowed select-none">
                            {selected.fairSubtitle || DEFAULT_SUBTITLE}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-[#775a19]" />{" "}
                            ORGANIZATION LOGO ASSET
                          </label>
                          <div className="w-full border p-2.5 px-4 rounded-2xl bg-[#f3ece9] border-[#e0bfbf]/70 flex items-center justify-between cursor-not-allowed select-none">
                            <span className="text-xs font-semibold text-[#584141]">
                              Official System Header Logo
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-white border border-[#e0bfbf] p-1 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                              <img
                                src={selected.logoSrc || DEFAULT_LOGO}
                                alt="Logo"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://placehold.co/100x100/fff8f5/570013?text=Logo";
                                }}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-[#e0bfbf]/60 p-5 sm:p-6 rounded-2xl bg-[#fffaf8]/60 space-y-5">
                      <div className="border-b border-[#e0bfbf]/40 pb-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#570013]">
                          2. Schedule &amp; Venue Telemetry
                        </h3>
                        <p className="text-[11px] text-[#584141] mt-0.5">
                          Define main exhibition runtime and stall allocation
                          milestones.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                        <div className="relative">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#775a19]" />{" "}
                            FAIR DATES RANGE (DD/MM/YYYY)
                          </label>
                          <div className="grid grid-cols-2 gap-2 relative">
                            <DatePicker
                              selected={startDatePicker}
                              onChange={(date: Date | null) =>
                                handleRangeUpdate(date, endDatePicker)
                              }
                              dateFormat="dd/MM/yyyy"
                              minDate={new Date()}
                              selectsStart
                              startDate={startDatePicker}
                              endDate={endDatePicker}
                              placeholderText="Start Date"
                              portalId="root-portal"
                              popperClassName="z-[9999]"
                              className="w-full border p-3 rounded-xl text-xs font-semibold bg-white border-[#e0bfbf]"
                            />
                            <DatePicker
                              selected={endDatePicker}
                              onChange={(date: Date | null) =>
                                handleRangeUpdate(startDatePicker, date)
                              }
                              dateFormat="dd/MM/yyyy"
                              minDate={startDatePicker || new Date()}
                              selectsEnd
                              startDate={startDatePicker}
                              endDate={endDatePicker}
                              placeholderText="End Date"
                              portalId="root-portal"
                              popperClassName="z-[9999]"
                              className="w-full border p-3 rounded-xl text-xs font-semibold bg-white border-[#e0bfbf]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#775a19]" />{" "}
                            MAIN VENUE / LOCATION NAME
                          </label>
                          <input
                            type="text"
                            value={selected.locationName || ""}
                            onChange={(e) =>
                              setSelected({
                                ...selected,
                                locationName: e.target.value,
                              })
                            }
                            placeholder="e.g. Central Park Mela Ground, Salt Lake, Kolkata"
                            className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-white border-[#e0bfbf]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 items-start">
                        <div className="relative">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2">
                            STALL SELECTION DATE &amp; TIME
                          </label>
                          <DatePicker
                            showTimeSelect
                            dateFormat="dd/MM/yyyy h:mm aa"
                            minDate={new Date()}
                            placeholderText="Select date and time (DD/MM/YYYY)"
                            portalId="root-portal"
                            popperClassName="z-[9999]"
                            selected={parseCustomDateTime(
                              selected.stallSelectionText,
                            )}
                            onChange={(date: Date | null) => {
                              if (date) {
                                const day = String(date.getDate()).padStart(
                                  2,
                                  "0",
                                );
                                const month = String(
                                  date.getMonth() + 1,
                                ).padStart(2, "0");
                                const year = date.getFullYear();
                                const timeStr = date
                                  .toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                  .toLowerCase();
                                setSelected({
                                  ...selected,
                                  stallSelectionText: `${day}/${month}/${year} at ${timeStr}`,
                                });
                              }
                            }}
                            className="w-full border p-3.5 rounded-2xl text-xs font-bold bg-white border-[#e0bfbf]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#775a19]" />{" "}
                            STALL SELECTION MEETING VENUE
                          </label>
                          <input
                            type="text"
                            value={selected.stallSelectionVenue || ""}
                            onChange={(e) =>
                              setSelected({
                                ...selected,
                                stallSelectionVenue: e.target.value,
                              })
                            }
                            placeholder="e.g. Guild House, Salt Lake, Kolkata"
                            className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-white border-[#e0bfbf]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border border-[#e0bfbf]/60 p-5 sm:p-6 rounded-2xl bg-[#fffaf8]/60 space-y-5">
                      <div className="border-b border-[#e0bfbf]/40 pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-[#570013]">
                            3. Organizing Authority
                          </h3>
                          <p className="text-[11px] text-[#584141] mt-0.5">
                            Entity names appearing in official footer or seal
                            blocks (Read-Only).
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                          <Lock className="w-3 h-3 text-[#775a19]" /> Locked
                          Metadata
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2 flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-[#775a19]" />{" "}
                            ORGANIZER NAME
                          </label>
                          <div className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-[#f3ece9] text-[#584141] border-[#e0bfbf]/70 cursor-not-allowed select-none">
                            {STATIC_ORGANIZER_NAME}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#584141] mb-2">
                            ORGANIZER SUBTEXT LINE
                          </label>
                          <div className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-[#f3ece9] text-[#584141] border-[#e0bfbf]/70 cursor-not-allowed select-none">
                            {STATIC_ORGANIZER_SUBTEXT}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "space" && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="bg-[#fffaf8] p-5 rounded-2xl border border-[#e0bfbf]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-[#570013] uppercase tracking-wide">
                          Dynamic Stall Tier Catalog
                        </h4>
                        <p className="text-[11px] text-[#775a19] mt-0.5">
                          Configure stall size tiers and values for exhibitors.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected({
                            ...selected,
                            spaceOptions: [
                              ...(selected.spaceOptions || []),
                              { label: "", value: "" },
                            ],
                          });
                        }}
                        className="bg-[#570013] text-white hover:bg-[#800020] text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-2xs self-start"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#fed488]" /> Add
                        Stall Tier
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {(selected.spaceOptions || []).map(
                        (
                          opt: { label: string; value: string },
                          idx: number,
                        ) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center bg-[#fffaf8] p-3 rounded-2xl border border-[#e0bfbf]/60 hover:border-[#e0bfbf] transition-all"
                          >
                            <div className="flex items-center gap-2.5 flex-1">
                              <span className="w-7 text-center text-[10px] font-extrabold text-[#775a19] bg-white rounded-xl py-1.5 border border-[#e0bfbf]/50 shrink-0">
                                #{idx + 1}
                              </span>
                              <input
                                type="text"
                                placeholder="e.g. 9 sq. metre (Standard Stall)"
                                value={opt.label}
                                onChange={(e) => {
                                  const updated = [
                                    ...(selected.spaceOptions || []),
                                  ];
                                  updated[idx] = {
                                    ...updated[idx],
                                    label: e.target.value,
                                  };
                                  setSelected({
                                    ...selected,
                                    spaceOptions: updated,
                                  });
                                }}
                                className="flex-1 border p-2.5 sm:p-3 rounded-xl text-xs font-semibold bg-white border-[#e0bfbf]/80"
                              />
                            </div>
                            <div className="flex items-center gap-2.5">
                              <input
                                type="text"
                                placeholder="Value (e.g. 9)"
                                value={opt.value}
                                onChange={(e) => {
                                  const updated = [
                                    ...(selected.spaceOptions || []),
                                  ];
                                  updated[idx] = {
                                    ...updated[idx],
                                    value: e.target.value,
                                  };
                                  setSelected({
                                    ...selected,
                                    spaceOptions: updated,
                                  });
                                }}
                                className="w-24 sm:w-32 border p-2.5 sm:p-3 rounded-xl text-xs font-bold bg-white border-[#e0bfbf]/80"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (
                                    selected.spaceOptions || []
                                  ).filter((_: any, i: number) => i !== idx);
                                  setSelected({
                                    ...selected,
                                    spaceOptions: updated,
                                  });
                                }}
                                className="text-red-700 hover:text-white hover:bg-red-600 p-3 rounded-xl transition-all cursor-pointer border border-transparent shrink-0"
                                title="Delete tier"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "terms" && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="bg-[#fffaf8] p-5 rounded-2xl border border-[#e0bfbf]/70 space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#584141] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#775a19]" /> Fair
                        Timings Display Text
                      </label>
                      <input
                        type="text"
                        value={selected.fairTimingsText || ""}
                        onChange={(e) =>
                          setSelected({
                            ...selected,
                            fairTimingsText: e.target.value,
                          })
                        }
                        placeholder="e.g. Timing of the Fair: From 12:00 noon to 8:00 PM on all days"
                        className="w-full border p-3.5 rounded-2xl text-xs font-semibold bg-white border-[#e0bfbf]"
                      />
                    </div>

                    <div className="bg-[#fffaf8] p-5 rounded-2xl border border-[#e0bfbf]/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#584141] flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#775a19]" />{" "}
                          Standardized Terms &amp; Conditions (Read-Only)
                        </label>
                        <span className="text-[10px] bg-white text-[#570013] border border-[#e0bfbf] px-2.5 py-0.5 rounded-full font-semibold">
                          Global Standard Applied
                        </span>
                      </div>
                      <div
                        className="w-full max-h-[480px] overflow-y-auto border p-5 rounded-2xl text-xs text-[#1e1b18] bg-white border-[#e0bfbf]/80 space-y-3 leading-relaxed text-justify shadow-2xs"
                        dangerouslySetInnerHTML={{
                          __html:
                            selected.termsAndConditionsHTML ||
                            DEFAULT_TERMS_PREFILL,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-[#e0bfbf]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#570013] to-[#800020] text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#570013]/20 hover:opacity-95 transition-all active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#fed488]" />
                  ) : (
                    <Save className="w-4 h-4 text-[#fed488]" />
                  )}
                  Commit Template Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {publishModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-[2rem] border border-[#e0bfbf] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                publishModal.targetState
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {publishModal.targetState ? (
                <Globe className="w-6 h-6" />
              ) : (
                <EyeOff className="w-6 h-6" />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#570013]">
                {publishModal.targetState
                  ? "Publish Event Live?"
                  : "Unpublish Event?"}
              </h3>
              <p className="text-xs text-[#584141] leading-relaxed">
                {publishModal.targetState ? (
                  <>
                    Making{" "}
                    <span className="font-bold text-[#570013]">
                      &quot;{publishModal.item?.fairTitle || "this event"}&quot;
                    </span>{" "}
                    LIVE will automatically unpublish any currently active event
                    so only one form remains public.
                  </>
                ) : (
                  <>
                    Are you sure you want to return{" "}
                    <span className="font-bold text-[#570013]">
                      &quot;{publishModal.item?.fairTitle || "this event"}&quot;
                    </span>{" "}
                    to draft status? Public access to participation forms for
                    this event will be paused.
                  </>
                )}
              </p>
              {publishModal.targetState && currentlyActiveForm && (
                <div className="mt-3 p-3 rounded-xl bg-[#fbf2ed] border border-[#e0bfbf]/60 text-[11px] text-[#775a19]">
                  Currently live:{" "}
                  <strong>{currentlyActiveForm.fairTitle || "Untitled"}</strong>{" "}
                  (will be replaced)
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={closePublishModal}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-[#e0bfbf] text-xs font-bold text-[#584141] hover:bg-[#fbf2ed] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPublishToggle}
                className={`w-full sm:flex-1 py-3 px-4 rounded-xl text-white text-xs font-bold transition-all cursor-pointer shadow-md ${
                  publishModal.targetState
                    ? "bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20"
                    : "bg-amber-700 hover:bg-amber-800 shadow-amber-700/20"
                }`}
              >
                {publishModal.targetState
                  ? "Confirm & Go Live"
                  : "Confirm Unpublish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-[2rem] border border-[#e0bfbf] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#570013]">
                Confirm Deletion
              </h3>
              <p className="text-xs text-[#584141] leading-relaxed">
                Are you sure you want to delete template{" "}
                <span className="font-bold text-[#570013]">
                  &quot;{deleteModal.title || "this event"}&quot;
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={confirmDeleteModalClose}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-[#e0bfbf] text-xs font-bold text-[#584141] hover:bg-[#fbf2ed] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-600/20"
              >
                Delete Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
