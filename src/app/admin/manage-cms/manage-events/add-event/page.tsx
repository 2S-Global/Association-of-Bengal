"use client";

import React, { useState, forwardRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  FileText, 
  Upload, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Tag,
  Info,
  X,
  AlertCircle,
  ChevronDown
} from "lucide-react";

export default function AddEventPage() {
  const router = useRouter();

  // Form Fields State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Flagship Event");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [dateStr, setDateStr] = useState(""); 
  const [startDate, setStartDate] = useState<Date | null>(null); 
  const [endDate, setEndDate] = useState<Date | null>(null);    
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  
  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  
  const [status, setStatus] = useState<"Published" | "Draft">("Published");
  
  // Interaction & Validation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const presetCategories = [
    "Flagship Event",
    "Meeting / Stall Selection",
    "Classical Music & Soirée",
    "Theatre Arts",
    "Exhibition",
    "Seminar / Academic Adda",
    "Folk Tradition & Craft"
  ];

  // Custom Input Component for DatePicker to embed the Calendar Icon securely
  const CustomDateInput = forwardRef(({ value, onClick, placeholder }: any, ref: any) => (
    <div className="relative cursor-pointer" onClick={onClick} ref={ref}>
      <input
        type="text"
        readOnly
        value={value}
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-11 rounded-xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-sm text-[#1e1b18] bg-white cursor-pointer"
      />
      <CalendarIcon className="w-4 h-4 text-[#775a19] absolute left-3.5 top-3.5 pointer-events-none" />
    </div>
  ));
  CustomDateInput.displayName = "CustomDateInput";

  // Handle file selection with proper validation
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image file size exceeds the 2MB limit." }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  // Format Date to simple clean string (e.g., "2026-09-24")
  const toSimpleDateStr = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Interactive Date Range Formatter with Past Date Validation Prevention
  const handleDateSelection = (start: Date | null, end: Date | null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start && start < today) {
      setErrors((prev) => ({ ...prev, date: "Start date cannot be in the past." }));
      return;
    }

    if (start && end && end < start) {
      setErrors((prev) => ({ ...prev, date: "End date cannot be earlier than the start date." }));
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
    } else {
      setDateStr("");
    }
    
    setErrors((prev) => ({ ...prev, date: "" }));
  };

  // Comprehensive Form Validation Checker
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!title.trim()) {
      newErrors.title = "Event title is required.";
    } else if (title.trim().length < 5) {
      newErrors.title = "Event title must be at least 5 characters long.";
    }

    if (!category.trim()) {
      newErrors.category = "Category type cannot be empty.";
    }

    if (!startDate) {
      newErrors.date = "Please select a start date for the event.";
    } else if (startDate < today) {
      newErrors.date = "Start date cannot be set in the past.";
    } else if (endDate && endDate < startDate) {
      newErrors.date = "End date cannot be earlier than the start date.";
    }

    if (!location.trim()) {
      newErrors.location = "Venue location is required.";
    }

    if (!description.trim()) {
      newErrors.description = "Please provide a brief event summary description.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler appending separate startDate and endDate as clean strings
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      
      if (startDate) {
        formData.append("startDate", toSimpleDateStr(startDate));
      }
      if (endDate) {
        formData.append("endDate", toSimpleDateStr(endDate));
      } else if (startDate) {
        formData.append("endDate", toSimpleDateStr(startDate));
      }

      formData.append("dateStr", dateStr || "TBD");
      formData.append("location", location);
      formData.append("description", description);
      formData.append("status", status);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (json.success) {
        router.push("/admin/manage-cms/manage-events");
      } else {
        setErrors((prev) => ({ ...prev, api: json.error || "Failed to create event. Please try again." }));
        setIsSubmitting(false);
      }
    } catch {
      setErrors((prev) => ({ ...prev, api: "An unexpected network error occurred." }));
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-[1000px] mx-auto px-4 md:px-12 py-16 flex-grow font-['Libre_Franklin'] selection:bg-[#fed488] selection:text-[#785a1a]">
      
      {/* Datepicker Theme Customization */}
      <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker {
          font-family: 'Libre_Franklin', sans-serif;
          border-color: #e0bfbf;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }
        .react-datepicker__header {
          background-color: #fbf2ed;
          border-bottom: 1px solid #e0bfbf;
        }
        .react-datepicker__current-month, .react-datepicker-year-header {
          color: #570013;
          font-family: 'Playfair_Display', serif;
          font-weight: bold;
        }
        .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
          background-color: #570013 !important;
          color: white !important;
          border-radius: 50%;
        }
        .react-datepicker__day:hover {
          background-color: #fed488 !important;
          color: #570013 !important;
          border-radius: 50%;
        }
      `}</style>

      {/* Header */}
      <div className="mb-10">
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#775a19] uppercase tracking-wider mb-3 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Event Manager
        </button>
        <h1 className="text-[28px] sm:text-[32px] md:text-[40px] font-bold text-[#570013] font-['Playfair_Display',serif] leading-tight">
          Add New Cultural Event
        </h1>
        <p className="text-sm sm:text-base text-[#584141] mt-2">
          Complete the required form fields accurately to publish your event live to the database.
        </p>
      </div>

      {/* Global API / Validation Banner Error */}
      {(errors.api || Object.keys(errors).length > 0) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          <div>
            <span className="font-bold block mb-1">Please address the following items before submitting:</span>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              {errors.api && <li>{errors.api}</li>}
              {errors.title && <li>{errors.title}</li>}
              {errors.category && <li>{errors.category}</li>}
              {errors.date && <li>{errors.date}</li>}
              {errors.location && <li>{errors.location}</li>}
              {errors.description && <li>{errors.description}</li>}
              {errors.image && <li>{errors.image}</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#e0bfbf] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8" noValidate>
        
        {/* Section 1: Core Details */}
        <div>
          <h2 className="text-xs font-bold text-[#775a19] uppercase tracking-widest mb-4 flex items-center gap-2">
            <Info className="w-4 h-4" /> General Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => { setTitle(e.target.value); if(e.target.value) setErrors(p => ({...p, title: ""})); }}
                placeholder="e.g., 51st International Kolkata Book Fair 2027"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1e1b18] bg-[#fbf2ed]/20 focus:outline-none ${
                  errors.title ? "border-red-500 bg-red-50/20" : "border-[#e0bfbf] focus:border-[#570013]"
                }`}
              />
              {errors.title && <span className="text-xs text-red-600 mt-1 block font-medium">{errors.title}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Enhanced Category Selector (Dropdown or Custom Input Toggle) */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(!isCustomCategory);
                      setCategory("");
                    }}
                    className="text-[11px] font-bold text-[#775a19] hover:underline inline-flex items-center gap-1"
                  >
                    {isCustomCategory ? "Select from presets" : "+ Type Custom Category"}
                  </button>
                </div>

                {isCustomCategory ? (
                  <div className="relative">
                    <input 
                      type="text"
                      value={category}
                      onChange={(e) => { setCategory(e.target.value); if(e.target.value) setErrors(p => ({...p, category: ""})); }}
                      placeholder="Type custom category..."
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1e1b18] bg-white focus:outline-none ${
                        errors.category ? "border-red-500" : "border-[#e0bfbf] focus:border-[#570013]"
                      }`}
                    />
                    <Tag className="w-4 h-4 text-[#775a19] absolute right-4 top-3.5 pointer-events-none" />
                  </div>
                ) : (
                  <div className="relative">
                    <div 
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1e1b18] bg-white cursor-pointer flex items-center justify-between ${
                        errors.category ? "border-red-500" : "border-[#e0bfbf] focus:border-[#570013]"
                      }`}
                    >
                      <span className={category ? "text-[#1e1b18]" : "text-gray-400"}>
                        {category || "Select category..."}
                      </span>
                      <ChevronDown className="w-4 h-4 text-[#775a19]" />
                    </div>

                    {showCategoryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e0bfbf] rounded-xl shadow-lg z-20 overflow-hidden">
                        {presetCategories.map((cat, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setCategory(cat);
                              setShowCategoryDropdown(false);
                              setErrors(p => ({...p, category: ""}));
                            }}
                            className="px-4 py-2.5 text-xs text-[#1e1b18] hover:bg-[#fbf2ed] cursor-pointer transition-colors border-b border-[#e0bfbf]/30 last:border-none font-medium"
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {errors.category && <span className="text-xs text-red-600 mt-1 block font-medium">{errors.category}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                  Publication Status
                </label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Published" | "Draft")}
                  className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-sm text-[#1e1b18] bg-white cursor-pointer"
                >
                  <option value="Published">Published (Live on Public Site)</option>
                  <option value="Draft">Draft (Hidden)</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        <hr className="border-[#e0bfbf]/60" />

        {/* Section 2: Library Date Picker with Icons & Venue */}
        <div>
          <h2 className="text-xs font-bold text-[#775a19] uppercase tracking-widest mb-4 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" /> Schedule &amp; Venue <span className="text-red-500">*</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                Start Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => handleDateSelection(date, endDate)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()} // Blocks past dates completely
                placeholderText="Select start date"
                dateFormat="MMM dd, yyyy"
                customInput={<CustomDateInput />}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                End Date (Optional)
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => handleDateSelection(startDate, date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()} // Blocks dates prior to start date or today
                placeholderText="Select end date"
                dateFormat="MMM dd, yyyy"
                customInput={<CustomDateInput />}
              />
            </div>
          </div>
          {errors.date && <span className="text-xs text-red-600 mb-4 block font-medium">{errors.date}</span>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                Auto-Formatted Date Badge String
              </label>
              <input 
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                placeholder="e.g., JAN 22 - FEB 03, 2026"
                className="w-full px-4 py-3 rounded-xl border border-[#e0bfbf] focus:outline-none focus:border-[#570013] text-sm text-[#1e1b18] bg-[#fbf2ed]/30 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                Venue Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); if(e.target.value) setErrors(p => ({...p, location: ""})); }}
                  placeholder="e.g., Central Park Mela Ground, Salt Lake, Kolkata"
                  className={`w-full px-4 py-3 pl-10 rounded-xl border text-sm text-[#1e1b18] focus:outline-none ${
                    errors.location ? "border-red-500" : "border-[#e0bfbf] focus:border-[#570013]"
                  }`}
                />
                <MapPin className="w-4 h-4 text-[#775a19] absolute left-3.5 top-3.5" />
              </div>
              {errors.location && <span className="text-xs text-red-600 mt-1 block font-medium">{errors.location}</span>}
            </div>
          </div>
        </div>

        <hr className="border-[#e0bfbf]/60" />

        {/* Section 3: File Upload & Description */}
        <div>
          <h2 className="text-xs font-bold text-[#775a19] uppercase tracking-widest mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Visual &amp; Content Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                Upload Banner Image (Max 2MB)
              </label>
              
              <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-colors relative cursor-pointer ${
                errors.image ? "border-red-400 bg-red-50/10" : "border-[#e0bfbf] bg-[#fbf2ed]/30 hover:bg-[#fbf2ed]/60"
              }`}>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#fed488]/40 flex items-center justify-center text-[#775a19] mb-2 border border-[#fed488]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-[#570013]">Click to upload or drag &amp; drop</p>
                  <p className="text-xs text-[#584141]/70 mt-1">JPG, PNG or WEBP (Max 2MB)</p>
                </div>
              </div>
              {errors.image && <span className="text-xs text-red-600 mt-1 block font-medium">{errors.image}</span>}
            </div>

            {/* Preview Box */}
            {imagePreview && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[#e0bfbf] shadow-xs">
                <Image fill src={imagePreview} alt="Preview" className="object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(""); }}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white p-1.5 rounded-full transition-colors"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#570013] uppercase tracking-wider mb-1.5">
                Event Summary Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => { setDescription(e.target.value); if(e.target.value) setErrors(p => ({...p, description: ""})); }}
                placeholder="Write an overview of the cultural event..."
                className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1e1b18] focus:outline-none ${
                  errors.description ? "border-red-500" : "border-[#e0bfbf] focus:border-[#570013]"
                }`}
              />
              {errors.description && <span className="text-xs text-red-600 mt-1 block font-medium">{errors.description}</span>}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-[#e0bfbf]">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-[#8c7071] text-[#584141] text-sm font-bold hover:bg-[#fbf2ed] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-[#570013] hover:bg-[#800020] text-white text-sm font-bold shadow-md transition-all active:scale-95 inline-flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading &amp; Publishing...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Publish Event
              </>
            )}
          </button>
        </div>

      </form>
    </main>
  );
}