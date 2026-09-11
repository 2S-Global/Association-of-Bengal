// "use client";

// import React, { useState, useEffect, forwardRef } from "react";
// import Link from "next/link";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { 
//   Plus, 
//   Trash2, 
//   Edit3, 
//   Calendar, 
//   MapPin, 
//   FileText, 
//   Loader2, 
//   Tag, 
//   X, 
//   Save
// } from "lucide-react";
// import { toast } from "sonner";

// interface AdminEvent {
//   _id: string;
//   title: string;
//   category: string;
//   dateStr: string;
//   location: string;
//   description: string;
//   image: string;
//   status: "Published" | "Draft";
// }

// export default function ManageEventsPage() {
//   const [events, setEvents] = useState<AdminEvent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   // Edit Modal State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [dateStr, setDateStr] = useState("");
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const [location, setLocation] = useState("");
//   const [description, setDescription] = useState("");
//   const [status, setStatus] = useState<"Published" | "Draft">("Published");
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [existingImageUrl, setExistingImageUrl] = useState("");
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const presetCategories = [
//     "Flagship Event",
//     "Meeting / Stall Selection",
//     "Classical Music & Soirée",
//     "Theatre Arts",
//     "Exhibition",
//     "Seminar / Academic Adda",
//     "Folk Tradition & Craft"
//   ];

//   // Custom Input Component for DatePicker
//   const CustomDateInput = forwardRef(({ value, onClick, placeholder }: any, ref: any) => (
//     <div className="relative cursor-pointer w-full" onClick={onClick} ref={ref}>
//       <input
//         type="text"
//         readOnly
//         value={value}
//         placeholder={placeholder}
//         className="w-full px-4 py-3 pl-11 rounded-xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-sm text-[#1e1b18] bg-white cursor-pointer"
//       />
//       <Calendar className="w-4 h-4 text-[#775a19] absolute left-3.5 top-3.5 pointer-events-none" />
//     </div>
//   ));
//   CustomDateInput.displayName = "CustomDateInput";

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const res = await fetch("/api/events");
//       const json = await res.json();
//       if (json.success) {
//         setEvents(json.data);
//       }
//     } catch (error) {
//       console.error("Failed to load events", error);
//       toast.error("Failed to load events from server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Open Edit Modal & Load Event Data
//   const handleOpenEditModal = (event: AdminEvent) => {
//     setEditingId(event._id);
//     setTitle(event.title);
//     setCategory(event.category);
//     setDateStr(event.dateStr);
//     setLocation(event.location);
//     setDescription(event.description);
//     setStatus(event.status);
//     setExistingImageUrl(event.image);
//     setImagePreview(event.image);
//     setImageFile(null);
//     setStartDate(null);
//     setEndDate(null);
//     setErrorMsg("");
//     setIsModalOpen(true);
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > 2 * 1024 * 1024) {
//       setErrorMsg("Image file size exceeds the 2MB limit.");
//       toast.error("Image file size exceeds the 2MB limit.");
//       return;
//     }

//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//     setErrorMsg("");
//   };

//   const handleDateSelection = (start: Date | null, end: Date | null) => {
//     if (start && end && end < start) {
//       setErrorMsg("End date cannot be earlier than the start date.");
//       return;
//     }

//     setStartDate(start);
//     setEndDate(end);

//     const formatDate = (d: Date) => 
//       d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();

//     if (start && end) {
//       setDateStr(`${formatDate(start)} - ${formatDate(end)}`);
//     } else if (start) {
//       setDateStr(formatDate(start));
//     }
//     setErrorMsg("");
//   };

//   // Submit Update
//   const handleUpdateSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim() || !location.trim()) {
//       setErrorMsg("Title and Location are required fields.");
//       toast.error("Title and Location are required fields.");
//       return;
//     }

//     setIsUpdating(true);
//     setErrorMsg("");

//     try {
//       const formData = new FormData();
//       formData.append("id", editingId!);
//       formData.append("title", title);
//       formData.append("category", category);
//       formData.append("dateStr", dateStr || "TBD");
//       formData.append("location", location);
//       formData.append("description", description);
//       formData.append("status", status);

//       if (imageFile) {
//         formData.append("image", imageFile);
//       } else {
//         formData.append("image", existingImageUrl);
//       }

//       const res = await fetch("/api/events", {
//         method: "PUT",
//         body: formData,
//       });

//       const json = await res.json();

//       if (json.success) {
//         setIsModalOpen(false);
//         toast.success("Event updated successfully!");
//         fetchEvents();
//       } else {
//         setErrorMsg(json.error || "Failed to update event.");
//         toast.error(json.error || "Failed to update event.");
//       }
//     } catch {
//       setErrorMsg("An unexpected error occurred during update.");
//       toast.error("An unexpected error occurred during update.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // Delete Handler
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this event?")) return;

//     setDeletingId(id);
//     try {
//       const res = await fetch(`/api/events?id=${id}`, {
//         method: "DELETE",
//       });
//       const json = await res.json();

//       if (json.success) {
//         setEvents((prev) => prev.filter((event) => event._id !== id));
//         toast.success("Event deleted successfully!");
//       } else {
//         toast.error(json.error || "Failed to delete event.");
//       }
//     } catch {
//       toast.error("An unexpected error occurred while deleting.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   return (
//     <main className="w-full max-w-[1280px] mx-auto px-3 sm:px-6 md:px-12 py-8 sm:py-16 flex-grow font-['Libre_Franklin'] selection:bg-[#fed488] selection:text-[#785a1a]">
      
//       {/* Datepicker Styling Overrides */}
//       <style jsx global>{`
//         .react-datepicker-wrapper { width: 100%; display: block; }
//         .react-datepicker {
//           font-family: 'Libre_Franklin', sans-serif;
//           border-color: #e0bfbf;
//           border-radius: 1rem;
//           overflow: hidden;
//           box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
//         }
//         .react-datepicker__header { background-color: #fbf2ed; border-bottom: 1px solid #e0bfbf; }
//         .react-datepicker__current-month { color: #570013; font-family: 'Playfair_Display', serif; font-weight: bold; }
//         .react-datepicker__day--selected { background-color: #570013 !important; color: white !important; border-radius: 50%; }
//         .react-datepicker__day:hover { background-color: #fed488 !important; color: #570013 !important; border-radius: 50%; }
//       `}</style>

//       {/* Top Header */}
//       <section className="mb-8 sm:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e0bfbf] pb-6">
//         <div>
//           <div className="flex items-center gap-2 text-[#775a19] text-xs font-bold uppercase tracking-wider mb-1">
//             <FileText className="w-4 h-4" /> Admin CMS Panel
//           </div>
//           <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
//             Manage Cultural Events &amp; Festivities
//           </h1>
//           <p className="text-xs sm:text-sm text-[#584141] mt-1">
//             View, edit via modal, and publish live event schedules.
//           </p>
//         </div>

//         <Link
//           href="/admin/manage-cms/manage-events/add-event"
//           className="w-full sm:w-auto text-center bg-[#570013] hover:bg-[#800020] text-white px-6 py-3.5 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 flex-shrink-0"
//         >
//           <Plus className="w-4 h-4" /> Add New Event
//         </Link>
//       </section>

//       {loading && (
//         <div className="flex flex-col items-center justify-center py-24">
//           <Loader2 className="w-8 h-8 text-[#570013] animate-spin mb-3" />
//           <p className="text-sm font-medium text-[#584141]">Loading events from database...</p>
//         </div>
//       )}

//       {/* Event Records List */}
//       {!loading && events.length > 0 && (
//         <section className="space-y-4">
//           {events.map((event) => (
//             <div 
//               key={event._id} 
//               className="bg-white border border-[#e0bfbf] p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 shadow-sm hover:border-[#570013] transition-all"
//             >
//               <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 w-full md:w-auto">
//                 <div className="relative w-full sm:w-28 h-40 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 border border-[#e0bfbf]/50 bg-gray-50">
//                   <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
//                 </div>
//                 <div className="flex-1 w-full">
//                   <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
//                     <span className="bg-[#ffdea5]/40 text-[#775a19] border border-[#ffdea5] px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
//                       <Tag className="w-3 h-3" /> {event.category}
//                     </span>
//                     <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
//                       event.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
//                     }`}>
//                       {event.status}
//                     </span>
//                   </div>

//                   <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl text-[#570013] font-bold mb-1.5">
//                     {event.title}
//                   </h3>

//                   <p className="text-xs sm:text-sm text-[#584141] line-clamp-2 max-w-2xl mb-3 leading-relaxed">
//                     {event.description}
//                   </p>

//                   <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-medium text-[#584141]/80">
//                     <span className="inline-flex items-center gap-1.5 bg-[#fbf2ed] px-2.5 py-1 rounded-lg border border-[#e0bfbf]/50">
//                       <Calendar className="w-3.5 h-3.5 text-[#775a19]" /> {event.dateStr}
//                     </span>
//                     <span className="inline-flex items-center gap-1.5 bg-[#fbf2ed] px-2.5 py-1 rounded-lg border border-[#e0bfbf]/50">
//                       <MapPin className="w-3.5 h-3.5 text-[#775a19]" /> {event.location}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Controls */}
//               <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#e0bfbf]/60 flex-shrink-0">
//                 <button 
//                   onClick={() => handleOpenEditModal(event)}
//                   className="flex-1 md:flex-none justify-center px-4 py-2.5 rounded-xl border border-[#775a19] text-[#775a19] hover:bg-[#775a19] hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
//                 >
//                   <Edit3 className="w-3.5 h-3.5" /> Edit
//                 </button>

//                 <button 
//                   onClick={() => handleDelete(event._id)}
//                   disabled={deletingId === event._id}
//                   className="flex-1 md:flex-none justify-center px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
//                 >
//                   {deletingId === event._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
//                 </button>
//             </div>
//           </div>
//           ))}
//         </section>
//       )}

//       {/* FULLY RESPONSIVE & NON-OVERLAPPING EDIT MODAL DIALOG */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center pt-20 sm:pt-24 pb-4 px-3 sm:px-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
//           <div className="bg-white rounded-3xl border border-[#e0bfbf] max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
//             {/* Modal Sticky Header */}
//             <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-[#e0bfbf] flex justify-between items-center bg-[#fbf2ed]/50 flex-shrink-0">
//               <h2 className="font-['Playfair_Display'] text-lg sm:text-2xl font-bold text-[#570013]">
//                 Edit Cultural Event
//               </h2>
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-[#584141] hover:text-[#570013] p-1.5 rounded-xl bg-white border border-[#e0bfbf] transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Modal Scrollable Content Body */}
//             <div className="p-4 sm:p-8 overflow-y-auto flex-grow space-y-5 sm:space-y-6">
//               {errorMsg && (
//                 <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
//                   {errorMsg}
//                 </div>
//               )}

//               <form id="edit-event-form" onSubmit={handleUpdateSubmit} className="space-y-4 sm:space-y-5">
//                 <div>
//                   <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
//                     Event Title <span className="text-red-500">*</span>
//                   </label>
//                   <input 
//                     type="text" 
//                     required
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-sm text-[#1e1b18]"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
//                       Category
//                     </label>
//                     <input 
//                       type="text"
//                       list="modal-categories"
//                       value={category}
//                       onChange={(e) => setCategory(e.target.value)}
//                       className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-sm text-[#1e1b18] bg-white"
//                     />
//                     <datalist id="modal-categories">
//                       {presetCategories.map((cat, idx) => (
//                         <option key={idx} value={cat} />
//                       ))}
//                     </datalist>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
//                       Status
//                     </label>
//                     <select 
//                       value={status}
//                       onChange={(e) => setStatus(e.target.value as "Published" | "Draft")}
//                       className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-sm text-[#1e1b18] bg-white cursor-pointer"
//                     >
//                       <option value="Published">Published</option>
//                       <option value="Draft">Draft</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
//                       Start Date Picker
//                     </label>
//                     <DatePicker
//                       selected={startDate}
//                       onChange={(date: Date | null) => handleDateSelection(date, endDate)}
//                       selectsStart
//                       startDate={startDate}
//                       endDate={endDate}
//                       placeholderText="Change start date"
//                       dateFormat="MMM dd, yyyy"
//                       customInput={<CustomDateInput />}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
//                       End Date Picker
//                     </label>
//                     <DatePicker
//                       selected={endDate}
//                       onChange={(date: Date | null) => handleDateSelection(startDate, date)}
//                       selectsEnd
//                       startDate={startDate}
//                       endDate={endDate}
//                       minDate={startDate || undefined}
//                       placeholderText="Change end date"
//                       dateFormat="MMM dd, yyyy"
//                       customInput={<CustomDateInput />}
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
//                       Date String Badge
//                     </label>
//                     <input 
//                       type="text"
//                       value={dateStr}
//                       onChange={(e) => setDateStr(e.target.value)}
//                       className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-sm text-[#1e1b18] bg-[#fbf2ed]/30"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
//                       Venue Location <span className="text-red-500">*</span>
//                     </label>
//                     <input 
//                       type="text"
//                       required
//                       value={location}
//                       onChange={(e) => setLocation(e.target.value)}
//                       className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-sm text-[#1e1b18]"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
//                     Update Banner Image (Optional)
//                   </label>
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 sm:p-4 border border-[#e0bfbf] rounded-2xl bg-[#fbf2ed]/20">
//                     {imagePreview && (
//                       <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#e0bfbf] flex-shrink-0 bg-gray-50 shadow-xs">
//                         <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
//                       </div>
//                     )}
//                     <input 
//                       type="file" 
//                       accept="image/jpeg,image/png,image/webp"
//                       onChange={handleFileSelect}
//                       className="w-full text-xs text-[#584141] file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#fed488]/50 file:text-[#775a19] hover:file:bg-[#fed488] cursor-pointer"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
//                     Event Summary Description
//                   </label>
//                   <textarea 
//                     rows={3}
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-sm text-[#1e1b18]"
//                   />
//                 </div>
//               </form>
//             </div>

//             {/* Modal Sticky Footer Actions */}
//             <div className="px-5 sm:px-8 py-3.5 sm:py-4 bg-[#fbf2ed]/50 border-t border-[#e0bfbf] flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 flex-shrink-0">
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#8c7071] text-[#584141] text-xs font-bold hover:bg-white transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="edit-event-form"
//                 disabled={isUpdating}
//                 className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#570013] hover:bg-[#800020] text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
//               >
//                 {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Update Event
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </main>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  MapPin, 
  Loader2, 
  Tag, 
  Sparkles,
  Layers,
  Image as ImageIcon,
  Search,
  X
} from "lucide-react";
import { toast } from "sonner";

interface AdminEvent {
  _id: string;
  title: string;
  category: string;
  dateStr: string;
  location: string;
  description: string;
  image: string;
  status: "Published" | "Draft";
}

export default function ManageEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const json = await res.json();
      if (json.success) {
        setEvents(json.data);
      }
    } catch (error) {
      console.error("Failed to load events", error);
      toast.error("Failed to load events from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this event?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/events?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.success) {
        setEvents((prev) => prev.filter((event) => event._id !== id));
        toast.success("Event deleted successfully!");
      } else {
        toast.error(json.error || "Failed to delete event.");
      }
    } catch {
      toast.error("An unexpected error occurred while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter events based on search query
  const filteredEvents = events.filter((event) => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300 selection:bg-[#fed488] selection:text-[#785a1a]">
      
      {/* Top Executive Banner */}
      <div className="bg-gradient-to-r from-white via-[#fff8f5] to-[#fef2eb] p-8 rounded-3xl border border-[#e0bfbf]/70 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-[#775a19] uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> CMS Administration
          </span>
          <h1 className="jsx-1e08dac1d6b730fd text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-600" /> Manage Cultural Events &amp; Festivities
          </h1>
          <p className="text-xs text-[#564242]">View, search, edit, and publish live event schedules for your portal.</p>
        </div>

        <Link
          href="/admin/manage-cms/manage-events/add-event"
          className="inline-flex items-center gap-2 bg-[#570013] text-white px-6 py-3.5 rounded-2xl text-xs font-bold shadow-md hover:bg-[#40000e] hover:shadow-lg transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Event
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Loader2 className="w-8 h-8 text-[#570013] animate-spin" />
          <p className="text-xs font-semibold text-[#8c7071]">Loading events from database...</p>
        </div>
      )}

      {/* Events List Container with Search Bar */}
      {!loading && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#e0bfbf]/40">
            <h2 className="jsx-1e08dac1d6b730fd text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-[#775a19]" /> All Scheduled Events
            </h2>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Input Box */}
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-[#775a19] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl pl-10 pr-9 py-2.5 text-xs font-bold text-[#570013] focus:outline-none focus:border-[#570013]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-[#8c7071] hover:text-[#570013]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <span className="text-xs font-extrabold bg-[#fbf2ed] text-[#570013] px-3.5 py-2.5 rounded-2xl border border-[#e0bfbf]/80 shrink-0">
                {filteredEvents.length} Found
              </span>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-24 space-y-3 bg-[#fff8f5]/50 rounded-3xl border border-dashed border-[#e0bfbf]">
              <ImageIcon className="w-12 h-12 text-[#8c7071] mx-auto opacity-40" />
              <p className="text-xs font-bold text-[#564242]">No events found.</p>
              <p className="text-[11px] text-[#8c7071]">Get started by clicking the "Add New Event" button above.</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16 space-y-2 bg-[#fff8f5]/50 rounded-2xl border border-dashed border-[#e0bfbf]">
              <p className="text-xs font-bold text-[#564242]">No events match "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="text-[11px] font-bold text-[#775a19] underline cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div 
                  key={event._id}
                  onClick={() => router.push(`/admin/manage-cms/manage-events/${event._id}`)}
                  className="bg-[#fff8f5] border border-[#e0bfbf]/70 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 shadow-2xs hover:border-[#570013] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
                    <div className="relative w-full sm:w-24 h-32 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#e0bfbf]/60 bg-black">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>

                    <div className="flex-1 w-full space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-[#ffdea5]/40 text-[#775a19] border border-[#ffdea5] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {event.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          event.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>

                      <h3 className="font-['Playfair_Display'] text-base sm:text-lg text-[#570013] font-bold group-hover:text-[#775a19] transition-colors line-clamp-1">
                        {event.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#584141]/80">
                        <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-[#e0bfbf]/50">
                          <Calendar className="w-3 h-3 text-[#775a19]" /> {event.dateStr}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-[#e0bfbf]/50">
                          <MapPin className="w-3 h-3 text-[#775a19]" /> {event.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center gap-2.5 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#e0bfbf]/60 flex-shrink-0">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/manage-cms/manage-events/${event._id}`);
                      }}
                      className="px-4 py-2 rounded-xl border border-[#775a19] text-[#775a19] bg-white hover:bg-[#775a19] hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button 
                      onClick={(e) => handleDelete(event._id, e)}
                      disabled={deletingId === event._id}
                      className="px-4 py-2 rounded-xl border border-red-200 text-red-600 bg-white hover:bg-red-600 hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      {deletingId === event._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </main>
  );
}