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
  Folder, 
  Sparkles,
  Layers,
  Image as ImageIcon,
  Search,
  X
} from "lucide-react";
import { toast } from "sonner";

interface FolderItem {
  _id: string;
  album: string;
  location: string;
  imageUrls: string[];
  category: string;
  date: string;
}

export default function ManageGalleryPage() {
  const router = useRouter();
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchFolders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/gallery`);
      const json = await res.json();
      if (res.ok && json?.data) setFolders(json.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load albums.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleDeleteFolder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this album?")) return;
    
    setDeletingId(id);
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || "";

    const deletePromise = async () => {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete.");
      return data;
    };

    toast.promise(deletePromise(), {
      loading: "Deleting album...",
      success: () => {
        fetchFolders();
        return "Album deleted successfully!";
      },
      error: (err) => err.message || "Failed to delete album.",
    });

    setDeletingId(null);
  };

  const filteredFolders = folders.filter((item) => 
    item.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Sparkles className="w-6 h-6 text-amber-600" /> Manage Gallery Albums
          </h1>
          <p className="text-xs text-[#564242]">Create, search, and curate rich photo collections for your association portal.</p>
        </div>

        <Link
          href="/admin/manage-cms/manage-gallery/new"
          className="inline-flex items-center gap-2 bg-[#570013] text-white px-6 py-3.5 rounded-2xl text-xs font-bold shadow-md hover:bg-[#40000e] hover:shadow-lg transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Album
        </Link>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Loader2 className="w-8 h-8 text-[#570013] animate-spin" />
          <p className="text-xs font-semibold text-[#8c7071]">Loading albums from database...</p>
        </div>
      )}

      {/* Gallery List Container with Search Bar */}
      {!isLoading && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#e0bfbf]/40">
            <h2 className="jsx-1e08dac1d6b730fd text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-[#775a19]" /> All Event Albums
            </h2>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Box */}
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-[#775a19] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search albums, venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl pl-10 pr-9 py-2.5 text-xs font-bold text-[#570013] focus:outline-none focus:border-[#570013]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3 text-[#8c7071] hover:text-[#570013]">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <span className="text-xs font-extrabold bg-[#fbf2ed] text-[#570013] px-3.5 py-2.5 rounded-2xl border border-[#e0bfbf]/80 shrink-0 shadow-2xs">
                {filteredFolders.length} Found
              </span>
            </div>
          </div>

          {folders.length === 0 ? (
            <div className="text-center py-24 space-y-3 bg-[#fff8f5]/50 rounded-3xl border border-dashed border-[#e0bfbf]">
              <ImageIcon className="w-12 h-12 text-[#8c7071] mx-auto opacity-40" />
              <p className="text-xs font-bold text-[#564242]">No albums found.</p>
              <p className="text-[11px] text-[#8c7071]">Get started by clicking the "Create New Album" button above.</p>
            </div>
          ) : filteredFolders.length === 0 ? (
            <div className="text-center py-16 space-y-2 bg-[#fff8f5]/50 rounded-2xl border border-dashed border-[#e0bfbf]">
              <p className="text-xs font-bold text-[#564242]">No albums match "{searchQuery}"</p>
              <button onClick={() => setSearchQuery("")} className="text-[11px] font-bold text-[#775a19] underline cursor-pointer">
                Clear search filter
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFolders.map((item) => (
                <div 
                  key={item._id}
                  onClick={() => router.push(`/admin/manage-cms/manage-gallery/${item._id}`)}
                  className="bg-[#fff8f5] border border-[#e0bfbf]/70 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 shadow-2xs hover:border-[#570013] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
                    <div className="relative w-full sm:w-24 h-32 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#e0bfbf]/60 bg-black">
                      <img src={item.imageUrls?.[0]} alt={item.album} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                        {item.imageUrls?.length || 0}
                      </span>
                    </div>

                    <div className="flex-1 w-full space-y-1.5">
                      <span className="bg-[#ffdea5]/40 text-[#775a19] border border-[#ffdea5] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>

                      <h3 className="font-['Playfair_Display'] text-base sm:text-lg text-[#570013] font-bold group-hover:text-[#775a19] transition-colors line-clamp-1">
                        {item.album}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#584141]/80">
                        <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-[#e0bfbf]/50">
                          <Calendar className="w-3 h-3 text-[#775a19]" /> {item.date}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-[#e0bfbf]/50">
                          <MapPin className="w-3 h-3 text-[#775a19]" /> {item.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#e0bfbf]/60 flex-shrink-0">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/manage-cms/manage-gallery/${item._id}`);
                      }}
                      className="px-4 py-2 rounded-xl border border-[#775a19] text-[#775a19] bg-white hover:bg-[#775a19] hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button 
                      onClick={(e) => handleDeleteFolder(item._id, e)}
                      disabled={deletingId === item._id}
                      className="px-4 py-2 rounded-xl border border-red-200 text-red-600 bg-white hover:bg-red-600 hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      {deletingId === item._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
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