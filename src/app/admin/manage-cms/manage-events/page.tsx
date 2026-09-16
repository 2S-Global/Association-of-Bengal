

"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

interface AdminEvent {
  _id: string;
  title: string;
  category: string;
  dateStr: string;
  startDate?: string;
  eventDate?: string;
  // Updated to handle both old string locations and new object locations
  location: string | { venue: string; city?: string; country?: string };
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

  // Pagination state (5 data items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const json = await res.json();
      if (json.success) {
        // Sort events so the nearest upcoming dates appear first
        const sortedEvents = (json.data || []).sort((a: AdminEvent, b: AdminEvent) => {
          const dateA = new Date(a.startDate || a.eventDate || a.dateStr || 0).getTime();
          const dateB = new Date(b.startDate || b.eventDate || b.dateStr || 0).getTime();
          return dateA - dateB;
        });
        setEvents(sortedEvents);
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

  // Filter events based on search query safely handling location as string or object
  const filteredEvents = events.filter((event) => {
    const locationStr = typeof event.location === 'string' 
      ? event.location 
      : (event.location?.venue || "");

    return (
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locationStr.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Paginated subset (5 items per page)
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage]);

  return (
    <main className="space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300 selection:bg-[#fed488] selection:text-[#785a1a]">
      
      {/* Top Executive Banner */}
      <div className="bg-gradient-to-r from-white via-[#fff8f5] to-[#fef2eb] p-8 rounded-3xl border border-[#e0bfbf]/70 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-[#775a19] uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> CMS Administration
          </span>

          <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
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
            <h2 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#570013] flex items-center gap-2.5">
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
            <>
              <div className="space-y-4">
                {paginatedEvents.map((event) => (
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
                            {/* Safely rendering the location here */}
                            <MapPin className="w-3 h-3 text-[#775a19]" /> {typeof event.location === 'string' ? event.location : event.location?.venue}
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

              {/* 5-Data Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-[#e0bfbf]/40">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#570013] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#fff8f5] px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        type="button"
                        onClick={() => setCurrentPage(pg)}
                        className={`w-7 h-7 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          currentPage === pg
                            ? "bg-[#570013] text-white shadow-2xs"
                            : "bg-[#fff8f5] text-[#775a19] border border-[#e0bfbf]/50 hover:bg-[#fbf2ed]"
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#570013] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#fff8f5] px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
      </div>
    )}

    </main>
  );
}