"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  Loader2, 
  Search,
  X,
  CalendarDays
} from "lucide-react";
import Link from "next/link";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

interface PublicEvent {
  _id: string;
  title: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  eventDate?: string;
  dateStr?: string;
  location: 
    | {
        venue?: string;
        city?: string;
        country?: string;
      }
    | string;
  description?: string;
  image?: string;
  imageUrl?: string;
  status?: "Published" | "Draft";
}

// Helper function to format any date string to DD/MM/YYYY
const formatDDMMYYYY = (dateInput?: string | number | Date | null) => {
  if (!dateInput) return "Upcoming";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return typeof dateInput === "string" ? dateInput : "Upcoming";
  
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

export default function UserEventsPage() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const json = await res.json();
      if (json.success) {
        // Filter only published events for users
        const published = (json.data || []).filter(
          (ev: PublicEvent) => !ev.status || ev.status === "Published"
        );
        setEvents(published);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories for filtering tabs
  const categories = ["All", ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))];

  // Filter events based on search query and category
  const filteredEvents = events.filter((event) => {
    const locationStr =
      typeof event.location === "object" && event.location !== null
        ? [event.location.venue, event.location.city, event.location.country].filter(Boolean).join(", ")
        : event.location || "";

    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locationStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 px-4 sm:px-6 lg:px-8 font-['Libre_Franklin',sans-serif]">
      
      {/* Controls Bar: Search & Category Filters */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e0bfbf]/60 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat as string)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                selectedCategory === cat
                  ? "bg-[#570013] text-white shadow-md scale-[1.02]"
                  : "bg-[#fff8f5] text-[#775a19] border border-[#e0bfbf]/60 hover:bg-[#fbf2ed]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#775a19] absolute left-4 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events, venues, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl pl-11 pr-10 py-3 text-xs font-bold text-[#570013] placeholder-[#8c7071]/70 focus:outline-none focus:border-[#570013] focus:ring-1 focus:ring-[#570013] transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-3.5 text-[#8c7071] hover:text-[#570013] p-0.5 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-[#570013] animate-spin" />
          <p className="text-xs font-bold text-[#8c7071] uppercase tracking-wider">Loading events catalog...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        /* Empty State */
        <div className="text-center py-28 bg-white rounded-3xl border border-dashed border-[#e0bfbf] p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#fbf2ed] border border-[#e0bfbf]/80 flex items-center justify-center mx-auto text-[#775a19]">
            <CalendarDays className="w-8 h-8 opacity-70" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#570013]">No Events Found</h3>
            <p className="text-xs sm:text-sm text-[#8c7071] max-w-md mx-auto">
              {searchQuery || selectedCategory !== "All" 
                ? "No events match your current search criteria or category filter combination." 
                : "There are currently no published events scheduled. Please check back later for updates."}
            </p>
          </div>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] rounded-xl text-xs font-bold hover:bg-[#570013] hover:text-white transition-all cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        /* Event Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((event) => {
            const eventImg = event.image || event.imageUrl;
            const displayDate = event.dateStr || event.startDate || event.eventDate;

            const locationParts =
              typeof event?.location === "object" && event?.location !== null
                ? [event.location.venue, event.location.city, event.location.country].filter(Boolean)
                : [event?.location || "Association Chapter"];
            const locationText = locationParts.join(", ");

            return (
              <div
                key={event._id}
                className="bg-white rounded-3xl border border-[#e0bfbf]/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Event Thumbnail */}
                  <div className="relative aspect-video w-full bg-[#fbf2ed] overflow-hidden">
                    {eventImg ? (
                      <img
                        src={eventImg}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#fff8f5] to-[#fbf2ed] text-[#775a19]">
                        <Calendar className="w-10 h-10 mb-1 opacity-60" />
                        <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">BALC Event</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#570013] px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm border border-white/40">
                      {event.category || "Cultural Event"}
                    </span>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 text-xs font-bold text-white drop-shadow-md">
                      <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>{formatDDMMYYYY(displayDate)}</span>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#570013] group-hover:text-[#775a19] transition-colors line-clamp-2 leading-snug">
                      {event.title}
                    </h3>

                    <p className="text-xs text-[#584141] leading-relaxed line-clamp-3">
                      {event.description || "Join us for this special cultural gathering and celebration hosted by the Association."}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Location */}
                <div className="px-6 pb-6 pt-3 border-t border-[#e0bfbf]/30 flex items-center gap-2 text-xs bg-[#fff8f5]/50">
                  <MapPin className="w-3.5 h-3.5 text-[#775a19] shrink-0" />
                  <span className="text-[#8c7071] font-semibold truncate w-full">
                    {locationText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}