"use client";

import React, { useState, useEffect, forwardRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Loader2, 
  Save, 
  Sparkles,
  FileText
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

export default function EditEventWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Published" | "Draft">("Published");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const presetCategories = [
    "Flagship Event",
    "Meeting / Stall Selection",
    "Classical Music & Soirée",
    "Theatre Arts",
    "Exhibition",
    "Seminar / Academic Adda",
    "Folk Tradition & Craft"
  ];

  // Custom Input Component for DatePicker
  const CustomDateInput = forwardRef(({ value, onClick, placeholder }: any, ref: any) => (
    <div className="relative cursor-pointer w-full" onClick={onClick} ref={ref}>
      <input
        type="text"
        readOnly
        value={value}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-xs font-bold text-[#1e1b18] bg-[#fff8f5] cursor-pointer"
      />
      <Calendar className="w-4 h-4 text-[#775a19] absolute left-3.5 top-3.5 pointer-events-none" />
    </div>
  ));
  CustomDateInput.displayName = "CustomDateInput";

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch("/api/events");
      const json = await res.json();
      if (json.success) {
        const found = json.data.find((ev: AdminEvent) => ev._id === eventId);
        if (found) {
          setTitle(found.title);
          setCategory(found.category);
          setDateStr(found.dateStr);
          setLocation(found.location);
          setDescription(found.description);
          setStatus(found.status);
          setExistingImageUrl(found.image);
          setImagePreview(found.image);
        } else {
          toast.error("Event not found.");
          router.push("/admin/manage-cms/manage-events");
        }
      }
    } catch (error) {
      console.error("Failed to load event details", error);
      toast.error("Failed to load event details from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Image file size exceeds the 2MB limit.");
      toast.error("Image file size exceeds the 2MB limit.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrorMsg("");
  };

  const handleDateSelection = (start: Date | null, end: Date | null) => {
    if (start && end && end < start) {
      setErrorMsg("End date cannot be earlier than the start date.");
      return;
    }

    setStartDate(start);
    setEndDate(end);

    const formatDate = (d: Date) => 
      d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();

    if (start && end) {
      setDateStr(`${formatDate(start)} - ${formatDate(end)}`);
    } else if (start) {
      setDateStr(formatDate(start));
    }
    setErrorMsg("");
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      setErrorMsg("Title and Location are required fields.");
      toast.error("Title and Location are required fields.");
      return;
    }

    setIsUpdating(true);
    setErrorMsg("");

    const updatePromise = async () => {
      const formData = new FormData();
      formData.append("id", eventId as string);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("dateStr", dateStr || "TBD");
      formData.append("location", location);
      formData.append("description", description);
      formData.append("status", status);

      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        formData.append("image", existingImageUrl);
      }

      const res = await fetch("/api/events", {
        method: "PUT",
        body: formData,
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to update event.");
      return json;
    };

    toast.promise(updatePromise(), {
      loading: "💾 Saving event updates...",
      success: () => {
        router.push("/admin/manage-cms/manage-events");
        return "Event updated successfully!";
      },
      error: (err) => {
        setErrorMsg(err.message || "Failed to update event.");
        return err.message || "Failed to update event.";
      },
    });

    setIsUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-3">
        <Loader2 className="w-8 h-8 text-[#570013] animate-spin" />
        <p className="text-xs font-bold text-[#8c7071]">Loading event workspace...</p>
      </div>
    );
  }

  return (
    <main className="space-y-8 max-w-5xl mx-auto pb-20 animate-in fade-in duration-300 selection:bg-[#fed488] selection:text-[#785a1a]">
      
      {/* Datepicker Styling Overrides */}
      <style jsx global>{`
        .react-datepicker-wrapper { width: 100%; display: block; }
        .react-datepicker {
          font-family: inherit;
          border-color: #e0bfbf;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }
        .react-datepicker__header { background-color: #fbf2ed; border-bottom: 1px solid #e0bfbf; }
        .react-datepicker__current-month { color: #570013; font-family: 'Playfair_Display', serif; font-weight: bold; }
        .react-datepicker__day--selected { background-color: #570013 !important; color: white !important; border-radius: 50%; }
        .react-datepicker__day:hover { background-color: #fed488 !important; color: #570013 !important; border-radius: 50%; }
      `}</style>

      {/* Top Workspace Banner */}
      <div className="bg-gradient-to-r from-white via-[#fff8f5] to-[#fef2eb] p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/70 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-[#775a19] uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Event Workspace
          </span>
          <h1 className="jsx-1e08dac1d6b730fd text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#775a19]" /> Editing: {title || "Untitled Event"}
          </h1>
          <p className="text-xs text-[#564242]">Modify event details, schedule timelines, or refresh the banner illustration.</p>
        </div>
        <button
          onClick={() => router.push("/admin/manage-cms/manage-events")}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#570013] bg-white hover:bg-[#fbf2ed] px-5 py-3 rounded-2xl transition-all cursor-pointer shadow-2xs border border-[#e0bfbf]/80 shrink-0"
        >
          <ArrowLeft className="w-4 h-4" /> Return to All Events
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold shadow-xs">
          {errorMsg}
        </div>
      )}

      {/* Main Workspace Edit Form */}
      <form onSubmit={handleUpdateSubmit} className="space-y-8">
        
        {/* Section 1: Core Metadata */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-6">
          <h2 className="jsx-1e08dac1d6b730fd text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5 border-b border-[#e0bfbf]/40 pb-4">
            <Sparkles className="w-6 h-6 text-[#775a19]" /> Event Core Properties
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-xs font-bold text-[#1e1b18] bg-[#fff8f5]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <input 
                  type="text"
                  list="workspace-categories"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-xs font-bold text-[#1e1b18] bg-[#fff8f5]"
                />
                <datalist id="workspace-categories">
                  {presetCategories.map((cat, idx) => (
                    <option key={idx} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                  Publication Status
                </label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Published" | "Draft")}
                  className="w-full px-4 py-3.5 rounded-2xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-xs font-bold text-[#1e1b18] bg-[#fff8f5] cursor-pointer"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Schedule & Location */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-6">
          <h2 className="jsx-1e08dac1d6b730fd text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5 border-b border-[#e0bfbf]/40 pb-4">
            <Calendar className="w-6 h-6 text-[#775a19]" /> Schedule &amp; Venue Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                Start Date Picker
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => handleDateSelection(date, endDate)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Change start date"
                dateFormat="MMM dd, yyyy"
                customInput={<CustomDateInput />}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                End Date Picker
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => handleDateSelection(startDate, date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || undefined}
                placeholderText="Change end date"
                dateFormat="MMM dd, yyyy"
                customInput={<CustomDateInput />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                Date String Badge Preview
              </label>
              <input 
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-xs font-bold text-[#1e1b18] bg-[#fbf2ed]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                Venue Location <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-xs font-bold text-[#1e1b18] bg-[#fff8f5]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Media & Description */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-6">
          <h2 className="jsx-1e08dac1d6b730fd text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5 border-b border-[#e0bfbf]/40 pb-4">
            <MapPin className="w-6 h-6 text-[#775a19]" /> Banner Illustration &amp; Narrative
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
              Update Banner Image (Max 2MB)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 border border-[#e0bfbf] rounded-2xl bg-[#fff8f5]">
              {imagePreview && (
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-[#e0bfbf] flex-shrink-0 bg-black shadow-xs">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="w-full text-xs text-[#584141] file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#570013] file:text-white cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
              Event Summary Description
            </label>
            <textarea 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-xs font-bold text-[#1e1b18] bg-[#fff8f5]"
            />
          </div>

          {/* Action Buttons Footer */}
          <div className="flex justify-end pt-6 border-t border-[#e0bfbf]/40">
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-2 bg-[#570013] text-white px-8 py-4 rounded-2xl text-xs font-extrabold shadow-md hover:bg-[#40000e] transition-all cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isUpdating ? "Saving Changes..." : "Save Workspace Changes"}
            </button>
          </div>

        </div>

      </form>
    </main>
  );
}