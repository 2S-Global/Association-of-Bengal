"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Landmark 
} from "lucide-react";

// Types for dynamic data
interface FeaturedEvent {
  id: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  dateStr: string;
  location: string;
  linkHref: string;
}

interface CulturalFestival {
  id: string;
  category: string;
  meta: string;
  title: string;
  description: string;
  image: string;
  linkHref: string;
}

interface CalendarDay {
  dayNumber: string | number;
  isSpacer?: boolean;
  eventTitle?: string;
  eventType?: "primary" | "secondary";
  highlight?: boolean;
}

interface CulturalHighlight {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export default function ActivitiesBody() {
  // Dynamic state for interactive calendar navigation and event data
  const [currentMonth, setCurrentMonth] = useState("January 2026");
  
  // Sample Dynamic Event Data
  const [featuredMainEvent] = useState<FeaturedEvent>({
  id: "flagship-1",
  badge: "Flagship Event",
  title: "49th Regional Book Fair Season 2026",
  description: "Join us from January 22 to February 3, 2026, at our official regional book stalls for Bengal's grandest literary celebration.",
  image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=3840&q=95",
  dateStr: "JAN 22 - FEB 03, 2026",
  location: "Kolkata Fair Grounds, West Bengal",
  linkHref: "/bookfairapplication",
});
  const [meetingEvent] = useState({
    date: "DEC 30, 2025",
    title: "Official Stall Selection Meeting",
    description: "Gathering at Mahabodhi Society, Bankim Chatterjee Street, Kolkata-73 at 12:30 PM for formal stall allocation and verification.",
    location: "Bankim Chatterjee St, West Bengal",
  });

  const [culturalFestivals] = useState<CulturalFestival[]>([
    {
      id: "fest-1",
      category: "Classical Music",
      meta: "STATE HERITAGE HALL • 6:00 PM",
      title: "Rabindra Sangeet & Classical Soirée",
      description: "An enchanting evening celebrating Tagore’s timeless compositions and classical instrumental recitals hosted across major cultural centers.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTbUinw4vnVIX4rH4ozCRssSKs4JunMH6YR-emxc18WLTYyuxDCFUut7KW2UgtHeUasAZVRs7cWZNHLQzVFdhx3LrQfAbM7OJFU0Hl9ISrwQlpSOK80w3w1Pz6gSSCiFb-MVESS0_9Q6ALb1cZzcUy06ieWrAN6kLpyEPHMvwSLQ450ICLz3bEkE-OsrgnO0FLfRRrqtRr6mi88xAEHspH_j16PIOUScO9ICfawtdU1AiMsquNirMs",
      linkHref: "/contactus",
    },
    {
      id: "fest-2",
      category: "Theatre Arts",
      meta: "ACADEMY OF FINE ARTS • 5:30 PM",
      title: "Regional Stage Drama Utsav",
      description: "A multi-day theater festival showcasing prominent Bengali stage productions, play readings, and discussions with veteran playwrights.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLVrv6ZkID3eFA2qR-IzGpyULBVADXLBARcSmkIlSjj5dsZTgH5R5-FoBlq2DqL9n2QE-as245pTzGaPlc5ne6tuyQgnJQDFp0nIsgArSvjjKlgCIQKDLfE3rC9vJYKVJgfGA5v4GOiiNu-bqteY609T_sp5EsUI2SjpecIr4mjhFWIPDLITjm8qss522kFtANdw1RdTU7IeAP2qBB9qT2A9nD6hSab9BOoOpRDDDZ6Co-mAA3UNKP",
      linkHref: "/contactus",
    },
    {
      id: "fest-3",
      category: "Folk Tradition",
      meta: "BENGAL ASSOCIATION PREMISES • 11:00 AM",
      title: "Rarh Bengal Folk & Craft Fair",
      description: "Celebrating the rural crafts, Baul folk music, and indigenous literary traditions native to the soil of West Bengal.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuoQpWPM3PC6ToFJzTGWgnzjKJFrBfc1-5iz9cjfPS_DGb_34hPIopDnEJuurC-15ZPLiCtpEJDkeGviPmczKhzurvLfv1Ba7JbdRqqDXyQ7V5fUpn9VW-vjSdAdryOQzZ-KdzGm_fc0Piev4wOTqdrnKOaZgDC1wXkYE6bYmRPZ-ugzcUHFx3k65KKpWCrfs52HuqvCT9sAH0VfYE__eMx3rRUxcl41ADa03SZETVOwXdf1DevhdV",
      linkHref: "/contactus",
    },
  ]);

  const [calendarDays] = useState<CalendarDay[]>([
    { dayNumber: "", isSpacer: true },
    { dayNumber: "", isSpacer: true },
    { dayNumber: "", isSpacer: true },
    { dayNumber: 22, eventTitle: "BOOK FAIR OPENS", eventType: "primary" },
    { dayNumber: 23 },
    { dayNumber: 24 },
    { dayNumber: 25 },
    { dayNumber: 26 },
    { dayNumber: 27 },
    { dayNumber: 28, eventTitle: "LITERARY ADDA", eventType: "secondary", highlight: true },
    { dayNumber: 29 },
    { dayNumber: 30, eventTitle: "STALL SELECTION", eventType: "primary" },
    { dayNumber: 31 },
    { dayNumber: "03", eventTitle: "FAIR FINALE (9PM)", eventType: "primary" },
  ]);

  const [culturalHighlights] = useState<CulturalHighlight[]>([
    {
      id: "high-1",
      title: "Regional Cultural Eve",
      subtitle: "Recap of the literary meet hosted at our headquarters.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTbUinw4vnVIX4rH4ozCRssSKs4JunMH6YR-emxc18WLTYyuxDCFUut7KW2UgtHeUasAZVRs7cWZNHLQzVFdhx3LrQfAbM7OJFU0Hl9ISrwQlpSOK80w3w1Pz6gSSCiFb-MVESS0_9Q6ALb1cZzcUy06ieWrAN6kLpyEPHMvwSLQ450ICLz3bEkE-OsrgnO0FLfRRrqtRr6mi88xAEHspH_j16PIOUScO9ICfawtdU1AiMsquNirMs",
    },
    {
      id: "high-2",
      title: "Young Writers' Workshop",
      subtitle: "Empowering the next generation of Bengali novelists and poets.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLVrv6ZkID3eFA2qR-IzGpyULBVADXLBARcSmkIlSjj5dsZTgH5R5-FoBlq2DqL9n2QE-as245pTzGaPlc5ne6tuyQgnJQDFp0nIsgArSvjjKlgCIQKDLfE3rC9vJYKVJgfGA5v4GOiiNu-bqteY609T_sp5EsUI2SjpecIr4mjhFWIPDLITjm8qss522kFtANdw1RdTU7IeAP2qBB9qT2A9nD6hSab9BOoOpRDDDZ6Co-mAA3UNKP",
    },
    {
      id: "high-3",
      title: "Archive & Heritage Exhibit",
      subtitle: "Showcasing rare historical texts and documents from West Bengal.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuoQpWPM3PC6ToFJzTGWgnzjKJFrBfc1-5iz9cjfPS_DGb_34hPIopDnEJuurC-15ZPLiCtpEJDkeGviPmczKhzurvLfv1Ba7JbdRqqDXyQ7V5fUpn9VW-vjSdAdryOQzZ-KdzGm_fc0Piev4wOTqdrnKOaZgDC1wXkYE6bYmRPZ-ugzcUHFx3k65KKpWCrfs52HuqvCT9sAH0VfYE__eMx3rRUxcl41ADa03SZETVOwXdf1DevhdV",
    },
  ]);

  useEffect(() => {
    // Micro-interaction: Smooth hover states for calendar days
    const days = document.querySelectorAll(".custom-calendar-day");
    const handleMouseEnter = (e: Event) => {
      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
    };
    const handleMouseLeave = (e: Event) => {
      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
    };

    days.forEach((day) => {
      day.addEventListener("mouseenter", handleMouseEnter);
      day.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      days.forEach((day) => {
        day.removeEventListener("mouseenter", handleMouseEnter);
        day.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-16 flex-grow font-['Libre_Franklin'] selection:bg-[#fed488] selection:text-[#785a1a]">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <h1 className="text-[28px] sm:text-[32px] md:text-[44px] leading-[1.2] md:leading-[1.2] tracking-[-0.01em] md:tracking-[-0.02em] font-bold text-[#570013] font-['Playfair_Display',serif] mb-4 sm:mb-6">
          Bengal Cultural Calendar &amp; Festivities
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#584141] leading-relaxed">
          Experience the intellectual soul of West Bengal through our iconic state-wide book fairs, regional symposia, and heritage literary gatherings.
        </p>
      </section>

      {/* Bento Grid: Featured Events */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
        {/* Main Featured Festival Card */}
        <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden bg-white rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-shadow">
          <div className="aspect-[4/5] relative w-full h-full">
            <Image
              fill
              className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
              alt={featuredMainEvent.title}
              src={featuredMainEvent.image}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white z-10">
              <span className="inline-block bg-[#570013] px-3.5 py-1 text-xs font-bold rounded-sm mb-3 uppercase tracking-widest">
                {featuredMainEvent.badge}
              </span>
              <h2 className="font-['Playfair_Display'] text-3xl lg:text-4xl font-bold mb-3 italic">
                {featuredMainEvent.title}
              </h2>
              <p className="text-sm sm:text-base opacity-90 mb-6 line-clamp-2">
                {featuredMainEvent.description}
              </p>
              <Link
                href={featuredMainEvent.linkHref}
                className="inline-block bg-[#570013] hover:bg-[#800020] px-8 py-3.5 text-sm font-bold transition-all active:scale-95 rounded-xl text-white shadow-md"
              >
                BOOK STALL NOW
              </Link>
            </div>
          </div>
        </div>

        {/* Exhibition Card */}
        <div className="md:col-span-2 bg-white border border-[#e0bfbf] p-6 sm:p-8 rounded-2xl flex flex-col justify-between group hover:border-[#570013] transition-colors shadow-sm">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#fed488]/40 flex items-center justify-center text-[#775a19] border border-[#fed488]">
                <Landmark className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#570013] tracking-wider uppercase bg-[#ffdea5]/40 px-3 py-1 rounded-full border border-[#ffdea5]">
                {meetingEvent.date}
              </span>
            </div>
            <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl text-[#570013] font-bold mb-3 italic">
              {meetingEvent.title}
            </h3>
            <p className="text-sm sm:text-base text-[#584141] leading-relaxed">
              {meetingEvent.description}
            </p>
          </div>
          <div className="mt-6 border-t border-[#e0bfbf]/60 pt-4 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#584141]">
            <span>{meetingEvent.location}</span>
            <ArrowRight className="w-4 h-4 text-[#570013] group-hover:translate-x-2 transition-transform" />
          </div>
        </div>

        {/* Small Event 1 */}
        <div className="bg-white border border-[#e0bfbf] p-6 rounded-2xl hover:bg-[#fbf2ed] transition-colors shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[#775a19] font-bold text-xs uppercase tracking-widest block mb-2">SEMINAR</span>
            <h4 className="font-['Playfair_Display'] text-xl text-[#570013] font-bold mb-2">Academic Adda</h4>
            <p className="text-sm text-[#584141] leading-relaxed mb-4">
              Intellectual discourses near premier regional universities and colleges.
            </p>
          </div>
          <span className="text-xs font-bold text-[#584141]/80 uppercase tracking-widest">WEEKLY • CULTURAL HUBS</span>
        </div>

        {/* Small Event 2 */}
        <div className="bg-white border border-[#e0bfbf] p-6 rounded-2xl hover:bg-[#fbf2ed] transition-colors shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[#775a19] font-bold text-xs uppercase tracking-widest block mb-2">EXHIBITION</span>
            <h4 className="font-['Playfair_Display'] text-xl text-[#570013] font-bold mb-2">Regional Book Showcase</h4>
            <p className="text-sm text-[#584141] leading-relaxed mb-4">
              Displaying rare regional manuscripts and publications from across the state.
            </p>
          </div>
          <span className="text-xs font-bold text-[#584141]/80 uppercase tracking-widest">STATEWIDE CAMPUS</span>
        </div>
      </section>

      {/* Expanded Cultural Events Showcase Section */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl text-[#570013] font-bold italic mb-3">
            Cultural &amp; Literary Festivities
          </h2>
          <p className="text-base text-[#584141] max-w-xl mx-auto leading-relaxed">
            Immerse yourself in our premier cultural showcases across landmark locations in West Bengal, celebrating regional literature, music, and dramatic arts.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {culturalFestivals.map((fest) => (
            <div key={fest.id} className="bg-white border border-[#e0bfbf] rounded-2xl overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
              <div>
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={fest.image}
                    alt={fest.title}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="absolute top-3 left-3 bg-[#570013] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    {fest.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="text-xs font-bold text-[#775a19] mb-1.5 uppercase tracking-wider">{fest.meta}</div>
                  <h3 className="font-['Playfair_Display'] text-xl text-[#570013] font-bold mb-3">{fest.title}</h3>
                  <p className="text-sm text-[#584141] line-clamp-3 leading-relaxed">
                    {fest.description}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link href={fest.linkHref} className="text-[#570013] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 hover:underline">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ornamental Divider */}
      <div className="flex items-center gap-6 py-8 max-w-[1280px] mx-auto">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#8c7071] to-transparent opacity-50" />
        <BookOpen className="w-6 h-6 text-[#775a19]" />
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#8c7071] to-transparent opacity-50" />
      </div>

      {/* Academic Calendar Section */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div className="max-w-xl">
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl text-[#570013] font-bold italic mb-3">
              Book Fair Season {currentMonth.split(" ")[1]} Calendar
            </h2>
            <p className="text-base text-[#584141] leading-relaxed">
              Key milestones leading up to the major book fair events. Check stall selection dates and venue notices.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-xs font-bold tracking-wider text-[#570013] uppercase mr-2 bg-[#ffdea5]/40 px-3 py-1.5 rounded-full border border-[#ffdea5]">
              {currentMonth}
            </span>
            <button 
              onClick={() => setCurrentMonth("December 2025")}
              className="p-2.5 rounded-xl border border-[#8c7071] text-[#570013] hover:bg-[#570013] hover:text-white transition-all shadow-xs"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentMonth("January 2026")}
              className="p-2.5 rounded-xl border border-[#8c7071] text-[#570013] hover:bg-[#570013] hover:text-white transition-all shadow-xs"
              aria-label="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-7 border-t border-l border-[#e0bfbf] rounded-2xl overflow-hidden bg-white shadow-sm">
          {/* Day Headers */}
          <div className="hidden md:block py-4 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold text-xs uppercase tracking-wider text-[#570013]">MON</div>
          <div className="hidden md:block py-4 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold text-xs uppercase tracking-wider text-[#570013]">TUE</div>
          <div className="hidden md:block py-4 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold text-xs uppercase tracking-wider text-[#570013]">WED</div>
          <div className="hidden md:block py-4 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold text-xs uppercase tracking-wider text-[#570013]">THU</div>
          <div className="hidden md:block py-4 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold text-xs uppercase tracking-wider text-[#570013]">FRI</div>
          <div className="hidden md:block py-4 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold text-xs uppercase tracking-wider text-[#570013]">SAT</div>
          <div className="hidden md:block py-4 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold text-xs uppercase tracking-wider text-[#570013]">SUN</div>
          
          {/* Calendar Days Dynamic Loop */}
          {calendarDays.map((item, index) => {
            if (item.isSpacer) {
              return <div key={`spacer-${index}`} className="custom-calendar-day p-4 border-b border-r border-[#e0bfbf] bg-[#fbf2ed] opacity-40"></div>;
            }

            return (
              <div 
                key={`day-${index}`} 
                className={`custom-calendar-day p-4 border-b border-r border-[#e0bfbf] flex flex-col justify-between hover:bg-[#f5ece7] transition-colors ${
                  item.highlight ? "bg-[#fed488]/20" : ""
                }`}
              >
                <span className={`text-sm font-bold ${item.eventTitle ? "text-[#570013]" : "text-[#1e1b18]"}`}>
                  {item.dayNumber}
                </span>
                {item.eventTitle && (
                  <div className={`p-2 rounded-lg border-l-2 ${
                    item.eventType === "secondary" ? "bg-[#775a19]/10 border-[#775a19]" : "bg-[#570013]/10 border-[#570013]"
                  }`}>
                    <span className={`text-[10px] font-bold leading-tight block ${
                      item.eventType === "secondary" ? "text-[#775a19]" : "text-[#570013]"
                    }`}>
                      {item.eventTitle}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Highlights Gallery */}
      <section className="mb-8">
        <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl text-[#570013] font-bold italic mb-8 text-center">
          Recent Cultural Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {culturalHighlights.map((high) => (
            <div key={high.id} className="group cursor-pointer bg-white p-5 rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-all">
              <div className="overflow-hidden mb-4 aspect-video relative rounded-xl">
                <Image
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={high.title}
                  src={high.image}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="font-['Playfair_Display'] text-xl text-[#570013] font-bold mb-2">{high.title}</h3>
              <p className="text-xs text-[#584141] italic mb-3">
                {high.subtitle}
              </p>
              <div className="h-0.5 bg-[#e0bfbf] w-12 group-hover:w-full transition-all duration-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}