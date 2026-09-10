
// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { 
//   ArrowRight, 
//   Loader2,
//   Calendar as CalendarIcon,
//   MapPin,
//   ChevronLeft,
//   ChevronRight,
//   BookOpen,
//   X,
//   Sparkles
// } from "lucide-react";

// interface DatabaseEvent {
//   _id: string;
//   title: string;
//   category: string;
//   startDate: string; // e.g. "2026-09-12"
//   endDate: string;   // e.g. "2026-10-01"
//   dateStr: string;
//   location: string;
//   description: string;
//   image: string;
//   status: "Published" | "Draft";
//   createdAt: string;
// }

// const MONTHS = [
//   "January", "February", "March", "April", "May", "June", 
//   "July", "August", "September", "October", "November", "December"
// ];

// export default function ActivitiesBody() {
//   const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // September (0-indexed: 8 = September)
//   const [currentYear, setCurrentYear] = useState(2026);
//   const [events, setEvents] = useState<DatabaseEvent[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedDayEvents, setSelectedDayEvents] = useState<{ dayNumber: number; events: DatabaseEvent[] } | null>(null);

//   useEffect(() => {
//     fetchLiveEvents();
//   }, []);

//   const fetchLiveEvents = async () => {
//     try {
//       const res = await fetch("/api/events");
//       const json = await res.json();
//       if (json.success) {
//         const publishedEvents = json.data.filter((ev: DatabaseEvent) => ev.status === "Published");
        
//         // Sort events by startDate ascending so the earliest upcoming event appears first (Flagship position)
//         publishedEvents.sort((a: DatabaseEvent, b: DatabaseEvent) => {
//           return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
//         });

//         setEvents(publishedEvents);
//       }
//     } catch (error) {
//       console.error("Failed to load events from database", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrevMonth = () => {
//     if (currentMonthIndex === 0) {
//       setCurrentMonthIndex(11);
//       setCurrentYear((prev) => prev - 1);
//     } else {
//       setCurrentMonthIndex((prev) => prev - 1);
//     }
//   };

//   const handleNextMonth = () => {
//     if (currentMonthIndex === 11) {
//       setCurrentMonthIndex(0);
//       setCurrentYear((prev) => prev + 1);
//     } else {
//       setCurrentMonthIndex((prev) => prev + 1);
//     }
//   };

//   const flagshipEvent = events[0];
//   const meetingEvent = events[1];
//   const remainingEvents = events.slice(2);

//   const getDaysInMonth = (month: number, year: number) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const totalDays = getDaysInMonth(currentMonthIndex, currentYear);

//   // Accurate range check using separate startDate and endDate strings from API response
//   const isEventActiveOnDay = (event: DatabaseEvent, dayNum: number, monthIdx: number, yearNum: number) => {
//     if (!event.startDate || !event.endDate) return false;

//     // Format current calendar cell date into YYYY-MM-DD
//     const mStr = String(monthIdx + 1).padStart(2, '0');
//     const dStr = String(dayNum).padStart(2, '0');
//     const cellDateStr = `${yearNum}-${mStr}-${dStr}`;

//     return cellDateStr >= event.startDate && cellDateStr <= event.endDate;
//   };

//   const daysInMonth = Array.from({ length: totalDays }, (_, i) => {
//     const dayNum = i + 1;
//     const matchedEvents = events.filter(ev => isEventActiveOnDay(ev, dayNum, currentMonthIndex, currentYear));

//     return {
//       dayNumber: dayNum,
//       matchedEvents,
//       highlight: matchedEvents.length > 0
//     };
//   });

//   return (
//     <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-16 flex-grow font-['Libre_Franklin'] selection:bg-[#fed488] selection:text-[#785a1a]">
      
//       {/* Hero Section */}
//       <section className="mb-20 text-center">
//         <h1 className="text-[28px] sm:text-[32px] md:text-[44px] leading-[1.2] md:leading-[1.2] tracking-[-0.01em] md:tracking-[-0.02em] font-bold text-[#570013] font-['Playfair_Display',serif] mb-4 sm:mb-6">
//           Bengal Cultural Calendar &amp; Festivities
//         </h1>
//         <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#584141] leading-relaxed">
//           Experience the intellectual soul of West Bengal through our official state-wide book fairs, regional symposia, and heritage literary gatherings.
//         </p>
//       </section>

//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-28">
//           <Loader2 className="w-8 h-8 text-[#570013] animate-spin mb-3" />
//           <p className="text-sm font-medium text-[#584141]">Loading cultural events from database...</p>
//         </div>
//       ) : events.length === 0 ? (
//         <div className="text-center py-24 bg-white rounded-2xl border border-[#e0bfbf] p-8 shadow-sm mb-20">
//           <CalendarIcon className="w-10 h-10 text-[#775a19] mx-auto mb-3" />
//           <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#570013] mb-1">No Active Events</h3>
//           <p className="text-sm text-[#584141]">Check back soon or publish events from your Admin CMS dashboard.</p>
//         </div>
//       ) : (
//         <>
//           {/* Bento Grid: Featured Events prioritized by earliest start date */}
//           <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            
//             {flagshipEvent && (
//               <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden bg-white rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-shadow">
//                 <div className="aspect-[4/5] relative w-full h-full bg-gray-900">
//                   <img
//                     className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
//                     alt={flagshipEvent.title}
//                     src={flagshipEvent.image}
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  
//                   {/* Earliest Start Date Highlight Badge */}
//                   <div className="absolute top-6 left-6 z-10">
//                     <span className="inline-flex items-center gap-1.5 bg-[#fed488] text-[#570013] px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md uppercase tracking-wider">
//                       <CalendarIcon className="w-3.5 h-3.5" /> Starts: {flagshipEvent.startDate}
//                     </span>
//                   </div>

//                   <div className="absolute bottom-0 left-0 p-8 text-white z-10 w-full">
//                     <span className="inline-block bg-[#570013] px-3.5 py-1 text-xs font-bold rounded-sm mb-3 uppercase tracking-widest">
//                       {flagshipEvent.category}
//                     </span>
//                     <h2 className="font-['Playfair_Display'] text-3xl lg:text-4xl font-bold mb-3 italic">
//                       {flagshipEvent.title}
//                     </h2>
//                     <p className="text-sm sm:text-base opacity-90 mb-4 line-clamp-3">
//                       {flagshipEvent.description}
//                     </p>
//                     <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-white/90 mb-6">
//                       <span className="inline-flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-xs">
//                         <CalendarIcon className="w-3.5 h-3.5 text-[#fed488]" /> Range: {flagshipEvent.dateStr}
//                       </span>
//                       <span className="inline-flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-xs">
//                         <MapPin className="w-3.5 h-3.5 text-[#fed488]" /> {flagshipEvent.location}
//                       </span>
//                     </div>
//                     <Link
//                       href="/bookfairapplication"
//                       className="inline-block bg-[#570013] hover:bg-[#800020] px-8 py-3.5 text-sm font-bold transition-all active:scale-95 rounded-xl text-white shadow-md"
//                     >
//                       BOOK STALL NOW
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {meetingEvent && (
//               <div className="md:col-span-2 group relative overflow-hidden bg-white rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-shadow">
//                 <div className="aspect-[16/9] md:aspect-[2/1] relative w-full h-full bg-gray-900">
//                   <img
//                     className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
//                     alt={meetingEvent.title}
//                     src={meetingEvent.image}
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
//                   <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white z-10 w-full">
//                     <span className="inline-block bg-[#775a19] px-3 py-1 text-[10px] font-bold rounded-sm mb-2 uppercase tracking-widest text-white">
//                       {meetingEvent.category}
//                     </span>
//                     <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-2 italic">
//                       {meetingEvent.title}
//                     </h3>
//                     <p className="text-xs sm:text-sm opacity-90 mb-3 line-clamp-2">
//                       {meetingEvent.description}
//                     </p>
//                     <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-white/90">
//                       <span className="inline-flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded backdrop-blur-xs">
//                         <CalendarIcon className="w-3 h-3 text-[#fed488]" /> {meetingEvent.dateStr}
//                       </span>
//                       <span className="inline-flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded backdrop-blur-xs">
//                         <MapPin className="w-3 h-3 text-[#fed488]" /> {meetingEvent.location}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {remainingEvents[0] && (
//               <div className="group relative overflow-hidden bg-white rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-shadow">
//                 <div className="aspect-square relative w-full h-full bg-gray-900">
//                   <img
//                     className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
//                     alt={remainingEvents[0].title}
//                     src={remainingEvents[0].image}
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
//                   <div className="absolute bottom-0 left-0 p-5 text-white z-10 w-full">
//                     <span className="inline-block bg-[#775a19] px-2.5 py-0.5 text-[10px] font-bold rounded-sm mb-1.5 uppercase tracking-widest text-white">
//                       {remainingEvents[0].category}
//                     </span>
//                     <h4 className="font-['Playfair_Display'] text-lg font-bold mb-1 italic">
//                       {remainingEvents[0].title}
//                     </h4>
//                     <p className="text-xs opacity-90 mb-2 line-clamp-2">
//                       {remainingEvents[0].description}
//                     </p>
//                     <div className="text-[10px] font-medium text-white/80">
//                       {remainingEvents[0].dateStr} • {remainingEvents[0].location}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {remainingEvents[1] && (
//               <div className="group relative overflow-hidden bg-white rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-shadow">
//                 <div className="aspect-square relative w-full h-full bg-gray-900">
//                   <img
//                     className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
//                     alt={remainingEvents[1].title}
//                     src={remainingEvents[1].image}
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
//                   <div className="absolute bottom-0 left-0 p-5 text-white z-10 w-full">
//                     <span className="inline-block bg-[#775a19] px-2.5 py-0.5 text-[10px] font-bold rounded-sm mb-1.5 uppercase tracking-widest text-white">
//                       {remainingEvents[1].category}
//                     </span>
//                     <h4 className="font-['Playfair_Display'] text-lg font-bold mb-1 italic">
//                       {remainingEvents[1].title}
//                     </h4>
//                     <p className="text-xs opacity-90 mb-2 line-clamp-2">
//                       {remainingEvents[1].description}
//                     </p>
//                     <div className="text-[10px] font-medium text-white/80">
//                       {remainingEvents[1].dateStr} • {remainingEvents[1].location}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </section>

//           {remainingEvents.length > 2 && (
//             <section className="mb-20">
//               <div className="text-center mb-10">
//                 <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl text-[#570013] font-bold italic mb-3">
//                   Cultural &amp; Literary Festivities
//                 </h2>
//                 <p className="text-base text-[#584141] max-w-xl mx-auto leading-relaxed">
//                   Immerse yourself in our premier cultural showcases across landmark locations in West Bengal.
//                 </p>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {remainingEvents.slice(2).map((fest) => (
//                   <div key={fest._id} className="group relative overflow-hidden bg-white rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-all">
//                     <div className="aspect-[4/3] relative w-full bg-gray-900">
//                       <img
//                         className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
//                         src={fest.image}
//                         alt={fest.title}
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
//                       <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
//                         <span className="inline-block bg-[#570013] px-2.5 py-0.5 text-[10px] font-bold rounded-sm mb-2 uppercase tracking-widest">
//                           {fest.category}
//                         </span>
//                         <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2 italic">{fest.title}</h3>
//                         <p className="text-xs opacity-90 line-clamp-2 mb-3">
//                           {fest.description}
//                         </p>
//                         <Link href="/contactus" className="text-[#fed488] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 hover:underline">
//                           Learn More <ArrowRight className="w-4 h-4" />
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}
//         </>
//       )}

//       {/* Ornamental Divider */}
//       <div className="flex items-center gap-6 py-8 max-w-[1280px] mx-auto">
//         <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#8c7071] to-transparent opacity-50" />
//         <BookOpen className="w-6 h-6 text-[#775a19]" />
//         <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#8c7071] to-transparent opacity-50" />
//       </div>

//       {/* Calendar Grid Section */}
//       <section className="mb-20">
//         <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-6">
//           <div className="max-w-xl">
//             <div className="flex items-center gap-2 text-[#775a19] text-xs font-bold uppercase tracking-wider mb-1">
//               <Sparkles className="w-4 h-4 text-[#775a19]" /> Monthly Schedule View
//             </div>
//             <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#570013] font-bold italic">
//               Book Fair Season {currentYear} Calendar
//             </h2>
//           </div>
//           <div className="flex gap-2 items-center">
//             <span className="text-xs font-bold tracking-wider text-[#570013] uppercase bg-[#ffdea5]/40 px-3 py-1.5 rounded-full border border-[#ffdea5]">
//               {MONTHS[currentMonthIndex]} {currentYear}
//             </span>
//             <button 
//               onClick={handlePrevMonth}
//               className="p-2 rounded-xl border border-[#8c7071] text-[#570013] hover:bg-[#570013] hover:text-white transition-all shadow-xs cursor-pointer"
//               aria-label="Previous Month"
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>
//             <button 
//               onClick={handleNextMonth}
//               className="p-2 rounded-xl border border-[#8c7071] text-[#570013] hover:bg-[#570013] hover:text-white transition-all shadow-xs cursor-pointer"
//               aria-label="Next Month"
//             >
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-7 border-t border-l border-[#e0bfbf] rounded-2xl overflow-hidden bg-white shadow-xs text-xs">
//           <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">MON</div>
//           <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">TUE</div>
//           <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">WED</div>
//           <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">THU</div>
//           <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">FRI</div>
//           <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">SAT</div>
//           <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">SUN</div>
          
//           {daysInMonth.map((item, index) => (
//             <div 
//               key={`day-${index}`} 
//               onClick={() => item.highlight && setSelectedDayEvents({ dayNumber: item.dayNumber, events: item.matchedEvents })}
//               className={`p-2 border-b border-r border-[#e0bfbf] flex flex-col justify-between min-h-[55px] transition-colors ${
//                 item.highlight 
//                   ? "bg-[#fed488]/30 cursor-pointer hover:bg-[#fed488]/50" 
//                   : "bg-white hover:bg-[#fbf2ed]/40"
//               }`}
//             >
//               <span className={`text-[11px] font-bold ${item.highlight ? "text-[#570013]" : "text-[#1e1b18]"}`}>
//                 {item.dayNumber}
//               </span>
//               {item.matchedEvents.length > 0 && (
//                 <div className="p-0.5 px-1.5 rounded bg-[#570013]/10 border-l-2 border-[#570013] mt-0.5">
//                   <span className="text-[8px] font-bold leading-tight block text-[#570013] truncate">
//                     {item.matchedEvents[0].title}
//                   </span>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Interactive Day Details Modal */}
//       {selectedDayEvents && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
//           <div className="bg-white rounded-3xl border border-[#e0bfbf] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
//             <button 
//               onClick={() => setSelectedDayEvents(null)}
//               className="absolute top-6 right-6 p-2 rounded-xl bg-[#fbf2ed] text-[#570013] hover:bg-[#570013] hover:text-white transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <div className="flex items-center gap-2 text-[#775a19] text-xs font-bold uppercase tracking-wider mb-1">
//               <CalendarIcon className="w-4 h-4" /> {MONTHS[currentMonthIndex]} {selectedDayEvents.dayNumber}, {currentYear}
//             </div>
//             <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#570013] mb-6">
//               Scheduled Festivities
//             </h3>
            
//             <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
//               {selectedDayEvents.events.map((ev) => (
//                 <div key={ev._id} className="p-4 rounded-2xl bg-[#fbf2ed]/60 border border-[#e0bfbf] flex gap-4 items-start">
//                   {ev.image && (
//                     <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-[#e0bfbf]">
//                       <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
//                     </div>
//                   )}
//                   <div>
//                     <span className="inline-block bg-[#ffdea5]/60 text-[#775a19] px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-1">
//                       {ev.category}
//                     </span>
//                     <h4 className="font-['Playfair_Display'] text-lg font-bold text-[#570013] mb-1">
//                       {ev.title}
//                     </h4>
//                     <p className="text-xs text-[#584141] mb-2">
//                       {ev.description}
//                     </p>
//                     <div className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider flex items-center gap-1">
//                       <MapPin className="w-3 h-3" /> {ev.location}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Recent Cultural Highlights Gallery */}
//       <section className="mb-8">
//         <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl text-[#570013] font-bold italic mb-8 text-center">
//           Recent Cultural Highlights
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {events.slice(0, 3).map((ev) => (
//             <div key={`high-${ev._id}`} className="group cursor-pointer bg-white p-5 rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-all">
//               <div className="overflow-hidden mb-4 aspect-video relative rounded-xl bg-gray-900">
//                 <img
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                   alt={ev.title}
//                   src={ev.image}
//                 />
//               </div>
//               <h3 className="font-['Playfair_Display'] text-xl text-[#570013] font-bold mb-2">{ev.title}</h3>
//               <p className="text-xs text-[#584141] italic mb-3 line-clamp-2">
//                 {ev.description}
//               </p>
//               <div className="h-0.5 bg-[#e0bfbf] w-12 group-hover:w-full transition-all duration-500 rounded-full"></div>
//             </div>
//           ))}
//         </div>
//       </section>

//     </main>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Loader2,
  Calendar as CalendarIcon,
  MapPin,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  X,
  Sparkles
} from "lucide-react";

interface DatabaseEvent {
  _id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  dateStr: string;
  location: string;
  description: string;
  image: string;
  status: "Published" | "Draft";
  createdAt: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export default function ActivitiesBody() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // September
  const [currentYear, setCurrentYear] = useState(2026);
  const [events, setEvents] = useState<DatabaseEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDayEvents, setSelectedDayEvents] = useState<{ dayNumber: number; events: DatabaseEvent[] } | null>(null);

  useEffect(() => {
    fetchLiveEvents();
  }, []);

  const fetchLiveEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const json = await res.json();
      if (json.success) {
        const publishedEvents = json.data.filter((ev: DatabaseEvent) => ev.status === "Published");
        
        // Sort events by startDate ascending so the earliest upcoming event appears first (Flagship position)
        publishedEvents.sort((a: DatabaseEvent, b: DatabaseEvent) => {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });

        setEvents(publishedEvents);
      }
    } catch (error) {
      console.error("Failed to load events from database", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const totalDays = getDaysInMonth(currentMonthIndex, currentYear);

  const isEventActiveOnDay = (event: DatabaseEvent, dayNum: number, monthIdx: number, yearNum: number) => {
    if (!event.startDate || !event.endDate) return false;

    const mStr = String(monthIdx + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const cellDateStr = `${yearNum}-${mStr}-${dStr}`;

    return cellDateStr >= event.startDate && cellDateStr <= event.endDate;
  };

  const daysInMonth = Array.from({ length: totalDays }, (_, i) => {
    const dayNum = i + 1;
    const matchedEvents = events.filter(ev => isEventActiveOnDay(ev, dayNum, currentMonthIndex, currentYear));

    return {
      dayNumber: dayNum,
      matchedEvents,
      highlight: matchedEvents.length > 0
    };
  });

  // Separate full Bento blocks (groups of 4) from any trailing leftovers
  const bentoChunks: DatabaseEvent[][] = [];
  for (let i = 0; i < Math.floor(events.length / 4) * 4; i += 4) {
    bentoChunks.push(events.slice(i, i + 4));
  }
  const leftoverEvents = events.slice(Math.floor(events.length / 4) * 4);

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-16 flex-grow font-['Libre_Franklin'] selection:bg-[#fed488] selection:text-[#785a1a]">
      
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <h1 className="text-[28px] sm:text-[32px] md:text-[44px] leading-[1.2] md:leading-[1.2] tracking-[-0.01em] md:tracking-[-0.02em] font-bold text-[#570013] font-['Playfair_Display',serif] mb-4 sm:mb-6">
          Bengal Cultural Calendar &amp; Festivities
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#584141] leading-relaxed">
          Experience the intellectual soul of West Bengal through our official state-wide book fairs, regional symposia, and heritage literary gatherings.
        </p>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-28">
          <Loader2 className="w-8 h-8 text-[#570013] animate-spin mb-3" />
          <p className="text-sm font-medium text-[#584141]">Loading cultural events from database...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-[#e0bfbf] p-8 shadow-sm mb-20">
          <CalendarIcon className="w-10 h-10 text-[#775a19] mx-auto mb-3" />
          <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#570013] mb-1">No Active Events</h3>
          <p className="text-sm text-[#584141]">Check back soon or publish events from your Admin CMS dashboard.</p>
        </div>
      ) : (
        <>
          {/* Complete Bento Grid Blocks (Groups of 4) */}
          {bentoChunks.map((group, groupIndex) => {
            const flagship = group[0];
            const meeting = group[1];
            const small1 = group[2];
            const small2 = group[3];

            return (
              <section key={`bento-group-${groupIndex}`} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                
                {/* 1. Main Large Flagship Card */}
                {flagship && (
                  <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden bg-white rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[4/5] relative w-full h-full bg-gray-900">
                      <img
                        className="absolute inset-0 w-full h-full object-cover object-center grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                        alt={flagship.title}
                        src={flagship.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      
                      <div className="absolute top-6 left-6 z-10">
                        <span className="inline-flex items-center gap-1.5 bg-[#fed488] text-[#570013] px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md uppercase tracking-wider">
                          <CalendarIcon className="w-3.5 h-3.5" /> Starts: {flagship.startDate}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 p-8 text-white z-10 w-full">
                        <span className="inline-block bg-[#570013] px-3.5 py-1 text-xs font-bold rounded-sm mb-3 uppercase tracking-widest">
                          {flagship.category}
                        </span>
                        <h2 className="font-['Playfair_Display'] text-3xl lg:text-4xl font-bold mb-3 italic">
                          {flagship.title}
                        </h2>
                        <p className="text-sm sm:text-base opacity-90 mb-4 line-clamp-3">
                          {flagship.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-white/90 mb-6">
                          <span className="inline-flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-xs">
                            <CalendarIcon className="w-3.5 h-3.5 text-[#fed488]" /> Range: {flagship.dateStr}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-xs">
                            <MapPin className="w-3.5 h-3.5 text-[#fed488]" /> {flagship.location}
                          </span>
                        </div>
                        <Link
                          href="/bookfairapplication"
                          className="inline-block bg-[#570013] hover:bg-[#800020] px-8 py-3.5 text-sm font-bold transition-all active:scale-95 rounded-xl text-white shadow-md"
                        >
                          BOOK STALL NOW
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Top-Right Wide Card */}
                {meeting && (
                  <div className="md:col-span-2 group relative overflow-hidden bg-white rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[16/9] md:aspect-[2/1] relative w-full h-full bg-gray-900">
                      <img
                        className="absolute inset-0 w-full h-full object-cover object-center grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                        alt={meeting.title}
                        src={meeting.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center gap-1 bg-[#fed488] text-[#570013] px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md uppercase">
                          Starts: {meeting.startDate}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white z-10 w-full">
                        <span className="inline-block bg-[#775a19] px-3 py-1 text-[10px] font-bold rounded-sm mb-2 uppercase tracking-widest text-white">
                          {meeting.category}
                        </span>
                        <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-2 italic">
                          {meeting.title}
                        </h3>
                        <p className="text-xs sm:text-sm opacity-90 mb-3 line-clamp-2">
                          {meeting.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-white/90">
                          <span className="inline-flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded backdrop-blur-xs">
                            <CalendarIcon className="w-3 h-3 text-[#fed488]" /> {meeting.dateStr}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded backdrop-blur-xs">
                            <MapPin className="w-3 h-3 text-[#fed488]" /> {meeting.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Bottom-Right Small Card 1 */}
                {small1 && (
                  <div className="group relative overflow-hidden bg-white rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-square relative w-full h-full bg-gray-900">
                      <img
                        className="absolute inset-0 w-full h-full object-cover object-center grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                        alt={small1.title}
                        src={small1.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-5 text-white z-10 w-full">
                        <span className="inline-block bg-[#775a19] px-2.5 py-0.5 text-[10px] font-bold rounded-sm mb-1.5 uppercase tracking-widest text-white">
                          {small1.category}
                        </span>
                        <h4 className="font-['Playfair_Display'] text-lg font-bold mb-1 italic">
                          {small1.title}
                        </h4>
                        <p className="text-xs opacity-90 mb-2 line-clamp-2">
                          {small1.description}
                        </p>
                        <div className="text-[10px] font-medium text-white/80">
                          {small1.dateStr} • {small1.location}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Bottom-Right Small Card 2 */}
                {small2 && (
                  <div className="group relative overflow-hidden bg-white rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-square relative w-full h-full bg-gray-900">
                      <img
                        className="absolute inset-0 w-full h-full object-cover object-center grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                        alt={small2.title}
                        src={small2.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-5 text-white z-10 w-full">
                        <span className="inline-block bg-[#775a19] px-2.5 py-0.5 text-[10px] font-bold rounded-sm mb-1.5 uppercase tracking-widest text-white">
                          {small2.category}
                        </span>
                        <h4 className="font-['Playfair_Display'] text-lg font-bold mb-1 italic">
                          {small2.title}
                        </h4>
                        <p className="text-xs opacity-90 mb-2 line-clamp-2">
                          {small2.description}
                        </p>
                        <div className="text-[10px] font-medium text-white/80">
                          {small2.dateStr} • {small2.location}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            );
          })}

          {/* Leftover Events Grid (Now styled exactly like the Bento cards with dark overlay and white text) */}
          {leftoverEvents.length > 0 && (
            <section className="mb-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leftoverEvents.map((ev) => (
                  <div key={ev._id} className="group relative overflow-hidden bg-white rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[4/3] relative w-full bg-gray-900">
                      <img
                        className="absolute inset-0 w-full h-full object-cover object-center grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                        src={ev.image}
                        alt={ev.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center gap-1 bg-[#fed488] text-[#570013] px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md uppercase">
                          Starts: {ev.startDate}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
                        <span className="inline-block bg-[#775a19] px-2.5 py-0.5 text-[10px] font-bold rounded-sm mb-1.5 uppercase tracking-widest text-white">
                          {ev.category}
                        </span>
                        <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2 italic">
                          {ev.title}
                        </h3>
                        <p className="text-xs opacity-90 mb-3 line-clamp-2">
                          {ev.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/90">
                          <span className="inline-flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                            <CalendarIcon className="w-3 h-3 text-[#fed488]" /> {ev.dateStr}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                            <MapPin className="w-3 h-3 text-[#fed488]" /> {ev.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Ornamental Divider */}
      <div className="flex items-center gap-6 py-8 max-w-[1280px] mx-auto">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#8c7071] to-transparent opacity-50" />
        <BookOpen className="w-6 h-6 text-[#775a19]" />
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#8c7071] to-transparent opacity-50" />
      </div>

      {/* Calendar Grid Section */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[#775a19] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#775a19]" /> Monthly Schedule View
            </div>
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#570013] font-bold italic">
              Book Fair Season {currentYear} Calendar
            </h2>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs font-bold tracking-wider text-[#570013] uppercase bg-[#ffdea5]/40 px-3 py-1.5 rounded-full border border-[#ffdea5]">
              {MONTHS[currentMonthIndex]} {currentYear}
            </span>
            <button onClick={handlePrevMonth} className="p-2 rounded-xl border border-[#8c7071] text-[#570013] hover:bg-[#570013] hover:text-white transition-all shadow-xs cursor-pointer" aria-label="Previous Month">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={handleNextMonth} className="p-2 rounded-xl border border-[#8c7071] text-[#570013] hover:bg-[#570013] hover:text-white transition-all shadow-xs cursor-pointer" aria-label="Next Month">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-7 border-t border-l border-[#e0bfbf] rounded-2xl overflow-hidden bg-white shadow-xs text-xs">
          <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">MON</div>
          <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">TUE</div>
          <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">WED</div>
          <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">THU</div>
          <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">FRI</div>
          <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">SAT</div>
          <div className="hidden md:block py-2.5 border-b border-r border-[#e0bfbf] bg-[#efe6e2] text-center font-bold uppercase tracking-wider text-[#570013]">SUN</div>
          
          {daysInMonth.map((item, index) => (
            <div 
              key={`day-${index}`} 
              onClick={() => item.highlight && setSelectedDayEvents({ dayNumber: item.dayNumber, events: item.matchedEvents })}
              className={`p-2 border-b border-r border-[#e0bfbf] flex flex-col justify-between min-h-[55px] transition-colors ${
                item.highlight 
                  ? "bg-[#fed488]/30 cursor-pointer hover:bg-[#fed488]/50" 
                  : "bg-white hover:bg-[#fbf2ed]/40"
              }`}
            >
              <span className={`text-[11px] font-bold ${item.highlight ? "text-[#570013]" : "text-[#1e1b18]"}`}>
                {item.dayNumber}
              </span>
              {item.matchedEvents.length > 0 && (
                <div className="p-0.5 px-1.5 rounded bg-[#570013]/10 border-l-2 border-[#570013] mt-0.5">
                  <span className="text-[8px] font-bold leading-tight block text-[#570013] truncate">
                    {item.matchedEvents[0].title}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Day Details Modal */}
      {selectedDayEvents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#e0bfbf] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button 
              onClick={() => setSelectedDayEvents(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-[#fbf2ed] text-[#570013] hover:bg-[#570013] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-[#775a19] text-xs font-bold uppercase tracking-wider mb-1">
              <CalendarIcon className="w-4 h-4" /> {MONTHS[currentMonthIndex]} {selectedDayEvents.dayNumber}, {currentYear}
            </div>
            <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#570013] mb-6">
              Scheduled Festivities
            </h3>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {selectedDayEvents.events.map((ev) => (
                <div key={ev._id} className="p-4 rounded-2xl bg-[#fbf2ed]/60 border border-[#e0bfbf] flex gap-4 items-start">
                  {ev.image && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-[#e0bfbf]">
                      <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <span className="inline-block bg-[#ffdea5]/60 text-[#775a19] px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-1">
                      {ev.category}
                    </span>
                    <h4 className="font-['Playfair_Display'] text-lg font-bold text-[#570013] mb-1">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-[#584141] mb-2">
                      {ev.description}
                    </p>
                    <div className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {ev.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Cultural Highlights Gallery */}
      <section className="mb-8">
        <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl text-[#570013] font-bold italic mb-8 text-center">
          Recent Cultural Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.slice(0, 3).map((ev) => (
            <div key={`high-${ev._id}`} className="group cursor-pointer bg-white p-5 rounded-2xl border border-[#e0bfbf] shadow-sm hover:shadow-md transition-all">
              <div className="overflow-hidden mb-4 aspect-video relative rounded-xl bg-gray-900">
                <img
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  alt={ev.title}
                  src={ev.image}
                />
              </div>
              <h3 className="font-['Playfair_Display'] text-xl text-[#570013] font-bold mb-2">{ev.title}</h3>
              <p className="text-xs text-[#584141] italic mb-3 line-clamp-2">
                {ev.description}
              </p>
              <div className="h-0.5 bg-[#e0bfbf] w-12 group-hover:w-full transition-all duration-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}