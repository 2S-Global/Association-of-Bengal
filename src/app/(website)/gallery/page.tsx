// "use client";

// import { useState, useMemo } from "react";
// import Image from "next/image";
// import { X, ZoomIn, SearchX, MapPin, Eye, Folder, ChevronLeft, ChevronRight } from "lucide-react";

// interface GalleryItem {
//   id: string;
//   title: string;
//   category: "Festivals" | "Exhibitions" | "Corporate";
//   year: string;
//   location: string;
//   imageUrl: string;
//   imageAlt: string;
//   album: string; // Album or folder grouping name
// }

// const GALLERY_ITEMS: GalleryItem[] = [
//   {
//     id: "1",
//     title: "Press Conference on Cultural Restoration",
//     category: "Corporate",
//     year: "2026",
//     location: "Kolkata Press Club",
//     imageUrl: "/gallery/kolkataPressClub1.jpg",
//     imageAlt: "A press conference panel at Kolkata Press Club discussing literature, culture, and submitting a memorandum.",
//     album: "Kolkata Press Club Meet",
//   },
//   {
//     id: "2",
//     title: "Panelists Addressing the Media",
//     category: "Corporate",
//     year: "2026",
//     location: "Kolkata Press Club",
//     imageUrl: "/gallery/kolkataPressClub2.jpg",
//     imageAlt: "Speakers and media personnel gathered during an event at Kolkata Press Club.",
//     album: "Kolkata Press Club Meet",
//   },
//   {
//     id: "3",
//     title: "Cultural Discussion & Memorandum Presentation",
//     category: "Corporate",
//     year: "2026",
//     location: "Kolkata Press Club",
//     imageUrl: "/gallery/kolkataPressClub3.jpg",
//     imageAlt: "A focused view of the discussion panel under the Press Club Kolkata banner.",
//     album: "Kolkata Press Club Meet",
//   },
//   {
//     id: "4",
//     title: "Media Gathering at Press Club",
//     category: "Corporate",
//     year: "2026",
//     location: "Kolkata Press Club",
//     imageUrl: "/gallery/kolkataPressClub4.jpg",
//     imageAlt: "An interactive session with members and attendees at Kolkata Press Club.",
//     album: "Kolkata Press Club Meet",
//   },
//   {
//     id: "5",
//     title: "Dr. Syama Prasad Mookerjee 125th Birth Anniversary",
//     category: "Festivals",
//     year: "2026",
//     location: "Ramamohan Hall",
//     imageUrl: "/gallery/dr1.jpg",
//     imageAlt: "Stage setup and gathering for the 125th birth anniversary celebration.",
//     album: "Dr. Syama Prasad Mookerjee Jayanti",
//   },
//   {
//     id: "6",
//     title: "Cultural & Literary Discussion Session",
//     category: "Festivals",
//     year: "2026",
//     location: "Ramamohan Hall",
//     imageUrl: "/gallery/dr2.jpg",
//     imageAlt: "Honored guests and speakers on stage during the birth anniversary event.",
//     album: "Dr. Syama Prasad Mookerjee Jayanti",
//   },
//   {
//     id: "7",
//     title: "Tribute and Address to Attendees",
//     category: "Festivals",
//     year: "2026",
//     location: "Ramamohan Hall",
//     imageUrl: "/gallery/dr3.jpg",
//     imageAlt: "Speakers addressing the audience during the commemorative event.",
//     album: "Dr. Syama Prasad Mookerjee Jayanti",
//   },
//   {
//     id: "8",
//     title: "Event Banner and Setup",
//     category: "Festivals",
//     year: "2026",
//     location: "Ramamohan Hall",
//     imageUrl: "/gallery/dr4.jpg",
//     imageAlt: "Event banner for the 125th birth anniversary celebration.",
//     album: "Dr. Syama Prasad Mookerjee Jayanti",
//   },
//   {
//     id: "9",
//     title: "Audience and Member Interaction",
//     category: "Festivals",
//     year: "2026",
//     location: "Ramamohan Hall",
//     imageUrl: "/gallery/dr5.jpg",
//     imageAlt: "Attendees and organization members participating in the program.",
//     album: "Dr. Syama Prasad Mookerjee Jayanti",
//   },
// ];

// interface AlbumGroup {
//   albumName: string;
//   coverImage: string;
//   count: number;
//   items: GalleryItem[];
// }

// export default function GalleryPage() {
//   const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
//   const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

//   // Group items into distinct albums automatically
//   const albums: AlbumGroup[] = useMemo(() => {
//     const map: { [key: string]: GalleryItem[] } = {};
//     GALLERY_ITEMS.forEach((item) => {
//       if (!map[item.album]) {
//         map[item.album] = [];
//       }
//       map[item.album].push(item);
//     });

//     return Object.keys(map).map((albumName) => ({
//       albumName,
//       coverImage: map[albumName][0].imageUrl,
//       count: map[albumName].length,
//       items: map[albumName],
//     }));
//   }, []);

//   // Get active items for the currently opened album modal
//   const activeAlbumItems = useMemo(() => {
//     if (!activeAlbum) return [];
//     const found = albums.find((a) => a.albumName === activeAlbum);
//     return found ? found.items : [];
//   }, [activeAlbum, albums]);

//   const handleNextSlide = () => {
//     setCurrentSlideIndex((prev) => (prev + 1) % activeAlbumItems.length);
//   };

//   const handlePrevSlide = () => {
//     setCurrentSlideIndex((prev) => (prev - 1 + activeAlbumItems.length) % activeAlbumItems.length);
//   };

//   const currentActiveImage = activeAlbumItems[currentSlideIndex];

//   return (
//     <main className="flex-grow bg-[#fff8f5] text-[#1a1c1b] min-h-screen selection:bg-[#570013] selection:text-white">
//       {/* Hero Section */}
//       <section className="relative h-[160px] md:h-[200px] w-full flex items-center justify-center bg-gradient-to-b from-[#fef2eb] to-[#fff8f5] border-b border-[#e0bfbf]/60">
//         <div className="relative z-10 text-center max-w-4xl px-6">
//           <span className="inline-block px-3 py-1 rounded-full bg-[#775a19]/10 text-[#775a19] border border-[#775a19]/20 font-semibold text-[9px] md:text-[10px] tracking-[0.2em] uppercase mb-2 shadow-sm">
//             Visual Archives
//           </span>
//           <h1 className="text-2xl md:text-4xl font-extrabold text-[#570013] mb-1.5 tracking-tight font-['Playfair_Display']">
//             Our Event Albums
//           </h1>
//           <p className="text-xs md:text-sm text-[#564242] max-w-xl mx-auto leading-relaxed font-['Libre_Franklin']">
//             Explore our events organized by albums. Click any album to view and slide through photos.
//           </p>
//         </div>
//       </section>

//       {/* Album Folders Grid Section */}
//       <section className="max-w-[1280px] mx-auto px-6 lg:px-12 py-12">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           {albums.map((album) => (
//             <div
//               key={album.albumName}
//               onClick={() => {
//                 setActiveAlbum(album.albumName);
//                 setCurrentSlideIndex(0);
//               }}
//               className="group relative h-[340px] overflow-hidden rounded-3xl cursor-pointer bg-white border border-[#e0bfbf]/80 shadow-[0_10px_30px_rgba(87,0,19,0.06)] hover:shadow-[0_20px_50px_rgba(87,0,19,0.18)] transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
//             >
//               {/* Album Cover Image */}
//               <div className="relative h-[240px] w-full overflow-hidden bg-[#1a0508]">
//                 <Image
//                   src={album.coverImage}
//                   alt={album.albumName}
//                   fill
//                   sizes="(max-width: 768px) 100vw, 33vw"
//                   className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
//                 {/* Photo Count Badge */}
//                 <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5 shadow-md">
//                   <Folder className="w-3.5 h-3.5 text-[#e0bfbf]" /> {album.count} Photos
//                 </span>

//                 {/* View Album Badge */}
//                 <div className="absolute top-4 right-4 bg-[#570013]/80 backdrop-blur-md rounded-full p-2.5 text-white opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
//                   <ZoomIn className="w-4 h-4" />
//                 </div>
//               </div>

//               {/* Album Info Footer */}
//               <div className="p-5 bg-gradient-to-b from-[#fff8f5] to-[#fef2eb] flex-grow flex flex-col justify-center border-t border-[#e0bfbf]/40">
//                 <h3 className="text-lg font-bold text-[#570013] font-['Playfair_Display'] tracking-wide group-hover:text-[#775a19] transition-colors">
//                   {album.albumName}
//                 </h3>
//                 <p className="text-xs text-[#564242] mt-1 font-medium flex items-center gap-1">
//                   <span>Click to open album slider</span>
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Lightbox Modal with Slider */}
//       {activeAlbum && currentActiveImage && (
//         <div 
//           className="fixed inset-0 z-50 bg-[#2a1115]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
//           onClick={() => setActiveAlbum(null)}
//         >
//           <div 
//             className="relative bg-[#fff8f5] rounded-3xl overflow-hidden max-w-4xl w-full max-h-[92vh] flex flex-col shadow-[0_25px_60px_rgba(87,0,19,0.4)] border border-[#e0bfbf]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Top Bar Header inside Modal */}
//             <div className="flex items-center justify-between px-6 py-4 bg-[#570013] text-white">
//               <div className="flex items-center gap-2">
//                 <Folder className="w-4 h-4 text-[#e0bfbf]" />
//                 <span className="text-xs font-semibold uppercase tracking-wider">{activeAlbum}</span>
//                 <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-2">
//                   {currentSlideIndex + 1} / {activeAlbumItems.length}
//                 </span>
//               </div>
//               <button 
//                 onClick={() => setActiveAlbum(null)}
//                 className="bg-black/40 hover:bg-black text-white rounded-full p-2 transition-all duration-300 shadow-md flex items-center justify-center border border-white/10"
//                 aria-label="Close modal"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Slider Main Frame */}
//             <div className="relative h-[320px] md:h-[450px] w-full bg-[#1a0508] flex items-center justify-center overflow-hidden">
//               {/* Blurred Background Glow */}
//               <div className="absolute inset-0 opacity-25 blur-xl scale-110">
//                 <Image 
//                   src={currentActiveImage.imageUrl} 
//                   alt="" 
//                   fill 
//                   className="object-cover"
//                 />
//               </div>

//               {/* Current Display Image */}
//               <Image 
//                 src={currentActiveImage.imageUrl} 
//                 alt={currentActiveImage.imageAlt} 
//                 fill 
//                 className="object-contain relative z-10 p-2 transition-all duration-300"
//               />

//               {/* Slider Left Arrow */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handlePrevSlide();
//                 }}
//                 className="absolute left-4 z-30 bg-black/50 hover:bg-[#570013] text-white rounded-full p-3 transition-all shadow-lg backdrop-blur-sm border border-white/15"
//                 aria-label="Previous slide"
//               >
//                 <ChevronLeft className="w-6 h-6" />
//               </button>

//               {/* Slider Right Arrow */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleNextSlide();
//                 }}
//                 className="absolute right-4 z-30 bg-black/50 hover:bg-[#570013] text-white rounded-full p-3 transition-all shadow-lg backdrop-blur-sm border border-white/15"
//                 aria-label="Next slide"
//               >
//                 <ChevronRight className="w-6 h-6" />
//               </button>
//             </div>

//             {/* Image Details Footer */}
//             <div className="p-6 md:p-7 bg-gradient-to-b from-[#fff8f5] to-[#fef2eb] border-t border-[#e0bfbf]/40">
//               <div className="flex flex-wrap items-center justify-between gap-3">
//                 <span className="text-xs font-bold text-[#775a19] uppercase tracking-[0.15em] bg-[#775a19]/10 px-3.5 py-1.5 rounded-full border border-[#775a19]/20 shadow-sm">
//                   {currentActiveImage.category} • {currentActiveImage.year}
//                 </span>
//                 <span className="text-xs font-medium text-[#564242] flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#dcc0c0]/50 shadow-sm">
//                   <MapPin className="w-3.5 h-3.5 text-[#775a19]" /> {currentActiveImage.location}
//                 </span>
//               </div>
//               <h2 className="text-2xl font-bold text-[#570013] mt-3 font-['Playfair_Display']">
//                 {currentActiveImage.title}
//               </h2>
//               <p className="text-sm text-[#564242] mt-1.5 leading-relaxed font-['Libre_Franklin']">
//                 {currentActiveImage.imageAlt}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { X, ZoomIn, MapPin, Folder, ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_ITEMS, GalleryItem } from "@/data/galleryData";

interface AlbumGroup {
  albumName: string;
  coverImage: string;
  count: number;
  items: GalleryItem[];
}

export default function GalleryPage() {
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Group items into distinct albums automatically
  const albums: AlbumGroup[] = useMemo(() => {
    const map: { [key: string]: GalleryItem[] } = {};
    GALLERY_ITEMS.forEach((item) => {
      if (!map[item.album]) {
        map[item.album] = [];
      }
      map[item.album].push(item);
    });

    return Object.keys(map).map((albumName) => ({
      albumName,
      coverImage: map[albumName][0].imageUrl,
      count: map[albumName].length,
      items: map[albumName],
    }));
  }, []);

  // Get active items for the currently opened album modal
  const activeAlbumItems = useMemo(() => {
    if (!activeAlbum) return [];
    const found = albums.find((a) => a.albumName === activeAlbum);
    return found ? found.items : [];
  }, [activeAlbum, albums]);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % activeAlbumItems.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + activeAlbumItems.length) % activeAlbumItems.length);
  };

  const currentActiveImage = activeAlbumItems[currentSlideIndex];

  return (
    <main className="flex-grow text-[#1a1c1b] min-h-screen selection:bg-[#570013] selection:text-white">
      {/* Hero Section */}
      <section className="relative h-[160px] md:h-[200px] w-full flex items-center justify-center bg-gradient-to-b from-[#fef2eb] to-[#fff8f5] border-b border-[#e0bfbf]/60">
        <div className="relative z-10 text-center max-w-4xl px-6">
          <span className="inline-block px-3 py-1 rounded-full bg-[#775a19]/10 text-[#775a19] border border-[#775a19]/20 font-semibold text-[9px] md:text-[10px] tracking-[0.2em] uppercase mb-2 shadow-sm">
            Visual Archives
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#570013] mb-1.5 tracking-tight font-['Playfair_Display']">
            Our Event Albums
          </h1>
          <p className="text-xs md:text-sm text-[#564242] max-w-xl mx-auto leading-relaxed font-['Libre_Franklin']">
            Explore our events organized by albums. Click any album to view and slide through photos.
          </p>
        </div>
      </section>

      {/* Album Folders Grid Section */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {albums.map((album) => (
            <div
              key={album.albumName}
              onClick={() => {
                setActiveAlbum(album.albumName);
                setCurrentSlideIndex(0);
              }}
              className="group relative h-[340px] overflow-hidden rounded-3xl cursor-pointer bg-white border border-[#e0bfbf]/80 shadow-[0_10px_30px_rgba(87,0,19,0.06)] hover:shadow-[0_20px_50px_rgba(87,0,19,0.18)] transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Album Cover Image */}
              <div className="relative h-[240px] w-full overflow-hidden bg-[#1a0508]">
                <Image
                  src={album.coverImage}
                  alt={album.albumName}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {/* Photo Count Badge */}
                <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5 shadow-md">
                  <Folder className="w-3.5 h-3.5 text-[#e0bfbf]" /> {album.count} Photos
                </span>

                {/* View Album Badge */}
                <div className="absolute top-4 right-4 bg-[#570013]/80 backdrop-blur-md rounded-full p-2.5 text-white opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              {/* Album Info Footer */}
              <div className="p-5 bg-gradient-to-b from-[#fff8f5] to-[#fef2eb] flex-grow flex flex-col justify-center border-t border-[#e0bfbf]/40">
                <h3 className="text-lg font-bold text-[#570013] font-['Playfair_Display'] tracking-wide group-hover:text-[#775a19] transition-colors">
                  {album.albumName}
                </h3>
                <p className="text-xs text-[#564242] mt-1 font-medium flex items-center gap-1">
                  <span>Click to open album slider</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compact & Clean Lightbox Modal */}
      {activeAlbum && currentActiveImage && (
        <div 
          className="fixed inset-0 z-50 bg-[#2a1115]/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveAlbum(null)}
        >
          <div 
            className="relative bg-[#fff8f5] text-[#1a1c1b] rounded-2xl overflow-hidden max-w-xl w-full flex flex-col shadow-[0_25px_60px_rgba(87,0,19,0.3)] border border-[#e0bfbf]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar Header inside Modal */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-[#fef2eb] to-[#fff8f5] border-b border-[#e0bfbf]/60 z-20">
              <div className="flex items-center gap-2">
                <Folder className="w-3.5 h-3.5 text-[#775a19]" />
                <span className="text-xs font-bold tracking-wide font-['Playfair_Display'] text-[#570013]">
                  {activeAlbum}
                </span>
                <span className="text-[10px] bg-[#570013]/10 text-[#570013] px-2 py-0.5 rounded-full font-semibold ml-1">
                  {currentSlideIndex + 1} / {activeAlbumItems.length}
                </span>
              </div>

              <button 
                onClick={() => setActiveAlbum(null)}
                className="bg-black/10 hover:bg-[#570013] hover:text-white text-[#570013] rounded-full p-2 transition-all duration-300 shadow-sm flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Compact Image Showcase Frame */}
            <div className="relative h-[260px] sm:h-[310px] w-full bg-[#1a0508] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 blur-xl scale-110 pointer-events-none">
                <Image 
                  src={currentActiveImage.imageUrl} 
                  alt="" 
                  fill 
                  className="object-cover"
                />
              </div>

              <div className="relative w-full h-full flex items-center justify-center z-10 px-1">
                <Image 
                  src={currentActiveImage.imageUrl} 
                  alt={currentActiveImage.imageAlt} 
                  fill 
                  className="object-contain transition-all duration-300 ease-out"
                  priority
                  sizes="(max-width: 640px) 100vw, 600px"
                />
              </div>

              {/* Slider Left Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevSlide();
                }}
                className="absolute left-2.5 z-30 bg-black/50 hover:bg-[#570013] text-white rounded-full p-2 transition-all shadow-md backdrop-blur-sm border border-white/20 active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Slider Right Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSlide();
                }}
                className="absolute right-2.5 z-30 bg-black/50 hover:bg-[#570013] text-white rounded-full p-2 transition-all shadow-md backdrop-blur-sm border border-white/20 active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Compact Thumbnail Strip */}
            <div className="bg-[#fef2eb] px-4 py-2 border-t border-[#e0bfbf]/60 flex items-center gap-2 overflow-x-auto scrollbar-thin">
              {activeAlbumItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`relative flex-shrink-0 w-12 h-9 rounded-lg overflow-hidden border transition-all duration-300 ${
                    idx === currentSlideIndex
                      ? "border-[#570013] scale-105 shadow-md"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Clean Details Footer */}
            <div className="p-4 sm:p-5 bg-gradient-to-b from-[#fff8f5] to-[#fef2eb] border-t border-[#e0bfbf]/60">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold text-[#775a19] uppercase tracking-wider bg-[#775a19]/10 px-2.5 py-1 rounded-full border border-[#775a19]/20">
                  {currentActiveImage.category} • {currentActiveImage.year}
                </span>
                <span className="text-[10px] font-medium text-[#564242] flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-[#dcc0c0]/50 shadow-sm">
                  <MapPin className="w-3 h-3 text-[#775a19]" /> {currentActiveImage.location}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display']">
                {currentActiveImage.title}
              </h2>
              <p className="text-xs text-[#564242] mt-1 leading-relaxed font-['Libre_Franklin'] line-clamp-2">
                {currentActiveImage.imageAlt}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}