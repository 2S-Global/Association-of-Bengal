"use client";

import React, { useState, useEffect, forwardRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MapPin, Calendar, Trash2, Plus, X, Save, Sparkles, Image as ImageIcon, Folder } from "lucide-react";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FolderItem {
  _id: string;
  album: string;
  location: string;
  imageUrls: string[];
  category: string;
  date: string;
}

export default function AlbumWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params?.id;
  const isNew = albumId === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  // Form & Workspace State
  const [album, setAlbum] = useState({
    album: "",
    location: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    imageUrls: [] as string[],
  });

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const presetCategories = [
    "Festivals",
    "Exhibitions",
    "Corporate",
    "Cultural",
    "Press Meet",
    "Meetings"
  ];

  // Custom Input Component for DatePicker for consistent UI styling
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
    if (!isNew && albumId) {
      fetchAlbumDetails();
    }
  }, [albumId, isNew]);

  const fetchAlbumDetails = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/gallery`);
      const json = await res.json();
      if (res.ok && json?.data) {
        const found = json.data.find((item: FolderItem) => item._id === albumId);
        if (found) {
          setAlbum({
            album: found.album,
            location: found.location,
            category: found.category || "Press Meet",
            date: found.date || new Date().toISOString().split("T")[0],
            imageUrls: found.imageUrls || [],
          });
        } else {
          toast.error("Album not found.");
          router.push("/admin/manage-cms/manage-gallery");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load album.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewFiles((prev) => [...prev, ...files]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => setNewPreviews((prev) => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Instant single photo deletion for existing albums
  const removeExistingPhoto = async (urlToRemove: string) => {
    if (album.imageUrls.length <= 1 && newFiles.length === 0) {
      toast.error("An album must contain at least one photo.");
      return;
    }

    if (!confirm("Are you sure you want to delete this single photo?")) return;

    const updatedImageUrls = album.imageUrls.filter((url) => url !== urlToRemove);
    setAlbum({ ...album, imageUrls: updatedImageUrls });

    if (isNew) return;

    const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || "";

    const deletePhotoPromise = async () => {
      const dataToSend = new FormData();
      dataToSend.append("album", album.album);
      dataToSend.append("location", album.location);
      dataToSend.append("category", album.category);
      dataToSend.append("date", album.date);
      dataToSend.append("keptImages", JSON.stringify(updatedImageUrls));

      const res = await fetch(`/api/gallery/${albumId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: dataToSend,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove photo.");
      return data;
    };

    toast.promise(deletePhotoPromise(), {
      loading: "Deleting photo from cloud...",
      success: () => {
        fetchAlbumDetails();
        return "Photo deleted successfully!";
      },
      error: (err) => err.message || "Failed to delete photo.",
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!album.album || !album.location || !album.category || !album.date) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    if (isNew && newFiles.length === 0) {
      toast.error("Please select at least one photo for the new album.");
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || "";

    const submitAction = async () => {
      const dataToSend = new FormData();
      dataToSend.append("album", album.album);
      dataToSend.append("location", album.location);
      dataToSend.append("category", album.category);
      dataToSend.append("date", album.date);

      if (isNew) {
        newFiles.forEach((file) => dataToSend.append("images", file));
        const res = await fetch(`/api/gallery`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: dataToSend,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create album.");
        return data;
      } else {
        dataToSend.append("keptImages", JSON.stringify(album.imageUrls));
        newFiles.forEach((file) => dataToSend.append("newImages", file));
        const res = await fetch(`/api/gallery/${albumId}`, {
          method: "PUT",
          headers: { "Authorization": `Bearer ${token}` },
          body: dataToSend,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update album.");
        return data;
      }
    };

    toast.promise(submitAction(), {
      loading: isNew ? "Creating new album..." : "Saving changes...",
      success: (data) => {
        router.push("/admin/manage-cms/manage-gallery");
        return data.message || (isNew ? "Album created successfully!" : "Album updated successfully!");
      },
      error: (err) => err.message || "Failed to save album.",
    });

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[450px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#570013]" />
        <p className="text-xs font-bold text-[#8c7071]">Loading album workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300 selection:bg-[#fed488] selection:text-[#785a1a]">
      
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

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-white via-[#fff8f5] to-[#fef2eb] p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/70 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-[#775a19] uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> {isNew ? "New Album Creation" : "Album Workspace"}
          </span>
          <h1 className="jsx-1e08dac1d6b730fd text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
            <Folder className="w-6 h-6 text-[#775a19]" /> {isNew ? "Create Event Album" : album.album || "Untitled Album"}
          </h1>
          <p className="text-xs text-[#564242]">
            {isNew ? "Fill in properties and select photos to establish a new gallery collection." : "Manage album properties, remove photos, or append new batches."}
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/manage-cms/manage-gallery")}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#570013] bg-white hover:bg-[#fbf2ed] px-5 py-3 rounded-2xl transition-all cursor-pointer shadow-2xs border border-[#e0bfbf]/80 shrink-0"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Albums
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        
        {/* Properties Section */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-6">
          <h2 className="jsx-1e08dac1d6b730fd text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5 border-b border-[#e0bfbf]/40 pb-4">
            <Sparkles className="w-6 h-6 text-[#775a19]" /> Album Properties & Metadata
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#564242] mb-1.5">Album / Event Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Annual Convention 2026"
                value={album.album}
                onChange={(e) => setAlbum({ ...album, album: e.target.value })}
                className="w-full bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl px-4 py-3.5 text-xs font-bold text-[#570013] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#564242] mb-1.5">Location / Venue *</label>
              <input
                type="text"
                required
                placeholder="e.g. Science City Auditorium"
                value={album.location}
                onChange={(e) => setAlbum({ ...album, location: e.target.value })}
                className="w-full bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl px-4 py-3.5 text-xs font-bold text-[#570013] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#564242] mb-1.5">Category *</label>
              <input
                type="text"
                required
                list="workspace-cats"
                placeholder="Type or select category..."
                value={album.category}
                onChange={(e) => setAlbum({ ...album, category: e.target.value })}
                className="w-full bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl px-4 py-3.5 text-xs font-bold text-[#570013] focus:outline-none"
              />
              <datalist id="workspace-cats">
                {presetCategories.map((cat, idx) => (
                  <option key={idx} value={cat} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#564242] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#775a19]" /> Event Date *
              </label>
              <DatePicker
                selected={album.date ? new Date(album.date) : new Date()}
                onChange={(date: Date | null) => {
                  if (date) {
                    setAlbum({ ...album, date: date.toISOString().split("T")[0] });
                  }
                }}
                dateFormat="MMM dd, yyyy"
                customInput={<CustomDateInput />}
              />
            </div>
          </div>
        </div>

        {/* Photos Management Section */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-6">
          
          {!isNew && (
            <>
              <div className="border-b border-[#e0bfbf]/40 pb-3 flex justify-between items-center">
                <h2 className="jsx-1e08dac1d6b730fd text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
                  <ImageIcon className="w-6 h-6 text-[#775a19]" /> Current Photos ({album.imageUrls.length})
                </h2>
                <span className="text-[11px] text-[#8c7071]">Click the trash icon to delete a photo instantly</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {album.imageUrls.map((url, idx) => (
                  <div key={idx} className="relative group h-32 rounded-2xl overflow-hidden border border-[#e0bfbf] bg-black shadow-2xs">
                    <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(url)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition-all cursor-pointer opacity-90 group-hover:opacity-100"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="space-y-3 pt-6 border-t border-[#e0bfbf]/40">
            <label className="block text-xs font-bold text-[#564242] flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#775a19]" /> {isNew ? "Select Photos for Album *" : "Upload & Append New Photos"}
            </label>
            <div className="p-5 bg-[#fbf2ed]/50 rounded-2xl border border-dashed border-[#e0bfbf] space-y-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewFilesChange}
                className="text-xs text-[#564242] file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#775a19] file:text-white cursor-pointer w-full"
              />
              {newPreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2 max-h-48 overflow-y-auto">
                  {newPreviews.map((url, idx) => (
                    <div key={idx} className="relative group h-24 rounded-xl overflow-hidden border border-[#775a19]/30 bg-white">
                      <img src={url} alt="New preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewFile(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-[#e0bfbf]/40">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-[#570013] text-white px-8 py-4 rounded-2xl text-xs font-extrabold shadow-md hover:bg-[#40000e] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving..." : (isNew ? "Create Album" : "Save Workspace Changes")}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}