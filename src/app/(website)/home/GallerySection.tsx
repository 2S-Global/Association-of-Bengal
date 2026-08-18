
// "use client";

// import React, { useRef, useState, useCallback, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";

// const galleryImages = [
//   {
//     id: 1,
//     src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=85",
//     alt: "Book Fair Exhibition",
//   },
//   {
//     id: 2,
//     src: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=85",
//     alt: "Books and Literature",
//   },
//   {
//     id: 3,
//     src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=85",
//     alt: "Library Books",
//   },
//   {
//     id: 4,
//     src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=85",
//     alt: "Library Exhibition",
//   },
//   {
//     id: 5,
//     src: "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1200&q=85",
//     alt: "Literary Event",
//   },
//   {
//     id: 6,
//     src: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=85",
//     alt: "Bookshelf",
//   },
//   {
//     id: 7,
//     src: "https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=1200&q=85",
//     alt: "Reading Event",
//   },
//   {
//     id: 8,
//     src: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=1200&q=85",
//     alt: "Book Collection",
//   },
//   {
//     id: 9,
//     src: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=85",
//     alt: "Literary Books",
//   },
//   {
//     id: 10,
//     src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=85",
//     alt: "Cultural Exhibition",
//   },
//   {
//     id: 11,
//     src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=85",
//     alt: "Children's Books",
//   },
//   {
//     id: 12,
//     src: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=85",
//     alt: "Book Display",
//   },
//   {
//     id: 13,
//     src: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=85",
//     alt: "Open Book",
//   },
//   {
//     id: 14,
//     src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=85",
//     alt: "Bookshelf Collection",
//   },
//   {
//     id: 15,
//     src: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=1200&q=85",
//     alt: "Literature Collection",
//   },
//   {
//     id: 16,
//     src: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=85",
//     alt: "Reading Space",
//   },
//   {
//     id: 17,
//     src: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=85",
//     alt: "Cultural Books",
//   },
//   {
//     id: 19,
//     src: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=85",
//     alt: "Book Reading",
//   },
//   {
//     id: 20,
//     src: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=85",
//     alt: "Cultural Event",
//   },
// ];

// export default function GallerySection() {
//   const autoplay = useRef(
//     Autoplay({
//       delay: 3000,
//       stopOnInteraction: false,
//       stopOnMouseEnter: true,
//     }),
//   );

//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     {
//       loop: true,
//       align: "start",
//       skipSnaps: false,
//       dragFree: false,
//     },
//     [autoplay.current],
//   );

//   const [, setSelectedIndex] = useState(0);
//   const [, setScrollSnaps] = useState<number[]>([]);

//   const scrollPrev = useCallback(() => {
//     if (emblaApi) emblaApi.scrollPrev();
//   }, [emblaApi]);

//   const scrollNext = useCallback(() => {
//     if (emblaApi) emblaApi.scrollNext();
//   }, [emblaApi]);

//   const onSelect = useCallback(() => {
//     if (!emblaApi) return;
//     setSelectedIndex(emblaApi.selectedScrollSnap());
//   }, [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;

//     setScrollSnaps(emblaApi.scrollSnapList());
//     emblaApi.on("select", onSelect);
//     emblaApi.on("reInit", onSelect);

//     return () => {
//       emblaApi.off("select", onSelect);
//       emblaApi.off("reInit", onSelect);
//     };
//   }, [emblaApi, onSelect]);

//   return (
//     <section className="bg-[#fff8f5] py-16 sm:py-20 lg:py-24 overflow-hidden font-['Libre_Franklin']">
//       <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 lg:mb-14">
//           <div className="text-left max-w-xl">
//             <span className="inline-flex items-center px-4 py-1.5 mb-3 rounded-full bg-[#ffdea5] text-[#570013] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em]">
//               Our Moments
//             </span>

//             <h2 className="font-['Playfair_Display'] text-[#570013] text-[28px] sm:text-[34px] lg:text-[40px] leading-tight font-semibold mb-3">
//               Cultural Highlights
//             </h2>

//             <p className="text-[#604b4d] text-sm sm:text-base leading-6">
//               Explore memorable moments from Bengal&apos;s literary and cultural
//               events.
//             </p>
//           </div>

//           {/* RIGHT SIDE CONTROLS & VIEW ALL LINK */}
//           <div className="flex items-center gap-4 mt-4 md:mt-0">
//             <Link
//               href="/gallery"
//               className="inline-flex items-center gap-2 text-sm font-semibold text-[#570013] hover:text-[#775a19] transition-colors underline underline-offset-4"
//             >
//               View Full Gallery &rarr;
//             </Link>

//             <div className="hidden md:flex items-center gap-3">
//               <button
//                 onClick={scrollPrev}
//                 aria-label="Previous slide"
//                 className="w-11 h-11 rounded-full border border-[#570013]/20 bg-white text-[#570013] flex items-center justify-center hover:bg-[#570013] hover:text-white transition-all duration-300 shadow-sm active:scale-95"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 19l-7-7 7-7"
//                   />
//                 </svg>
//               </button>
//               <button
//                 onClick={scrollNext}
//                 aria-label="Next slide"
//                 className="w-11 h-11 rounded-full border border-[#570013]/20 bg-white text-[#570013] flex items-center justify-center hover:bg-[#570013] hover:text-white transition-all duration-300 shadow-sm active:scale-95"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* EMBLA CAROUSEL */}
//         <div
//           ref={emblaRef}
//           className="overflow-hidden cursor-grab active:cursor-grabbing pb-2"
//         >
//           <div className="flex -ml-4">
//             {galleryImages.map((image) => (
//               <div
//                 key={image.id}
//                 className="
//                   flex-[0_0_100%]
//                   min-w-0
//                   pl-4
//                   sm:flex-[0_0_50%]
//                   md:flex-[0_0_33.333333%]
//                   lg:flex-[0_0_25%]
//                 "
//               >
//                 {/* WRAPPED ENTIRE CARD IN NEXT.JS LINK TO GO TO /gallery */}
//                 <Link href="/gallery" className="block h-full group">
//                   <div
//                     className="
//                       bg-white
//                       rounded-[24px]
//                       overflow-hidden
//                       border
//                       border-[#eaded9]
//                       shadow-[0_8px_25px_rgba(87,0,19,0.06)]
//                       flex
//                       flex-col
//                       h-full
//                       transition-transform
//                       duration-300
//                       hover:-translate-y-1
//                     "
//                   >
//                     {/* IMAGE CONTAINER */}
//                     <div className="relative w-full aspect-[4/3] bg-[#fcf8f6] overflow-hidden">
//                       <Image
//                         src={image.src}
//                         alt={image.alt}
//                         fill
//                         priority={image.id <= 4}
//                         className="
//                           object-cover
//                           transition-transform
//                           duration-700
//                           ease-out
//                           group-hover:scale-105
//                         "
//                         sizes="
//                           (max-width:639px) 100vw,
//                           (max-width:767px) 50vw,
//                           (max-width:1023px) 33vw,
//                           25vw
//                         "
//                       />
//                     </div>

//                     {/* CONTENT AREA BELOW IMAGE */}
//                     <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow bg-white border-t border-[#f4ebe6]">
//                       <div className="space-y-1">
//                         <span className="text-[#8a686b] text-[10px] font-semibold uppercase tracking-[0.08em]">
//                           Bengal Literature &amp; Culture
//                         </span>
//                         <h3
//                           className="
//                             font-['Playfair_Display']
//                             text-[#570013]
//                             text-base
//                             sm:text-lg
//                             font-medium
//                             line-clamp-1
//                           "
//                         >
//                           {image.alt}
//                         </h3>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { GALLERY_ITEMS } from "@/data/galleryData";

export default function GallerySection() {
  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: false,
    },
    [autoplay.current],
  );

  const [, setSelectedIndex] = useState(0);
  const [, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="bg-[#fff8f5] py-16 sm:py-20 lg:py-24 overflow-hidden font-['Libre_Franklin']">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 lg:mb-14">
          <div className="text-left max-w-xl">
            <span className="inline-flex items-center px-4 py-1.5 mb-3 rounded-full bg-[#ffdea5] text-[#570013] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em]">
              Our Moments
            </span>

            <h2 className="font-['Playfair_Display'] text-[#570013] text-[28px] sm:text-[34px] lg:text-[40px] leading-tight font-semibold mb-3">
              Cultural Highlights
            </h2>

            <p className="text-[#604b4d] text-sm sm:text-base leading-6">
              Explore memorable moments from Bengal&apos;s literary and cultural
              events.
            </p>
          </div>

          {/* RIGHT SIDE CONTROLS & VIEW ALL LINK */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#570013] hover:text-[#775a19] transition-colors underline underline-offset-4"
            >
              View Full Gallery &rarr;
            </Link>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={scrollPrev}
                aria-label="Previous slide"
                className="w-11 h-11 rounded-full border border-[#570013]/20 bg-white text-[#570013] flex items-center justify-center hover:bg-[#570013] hover:text-white transition-all duration-300 shadow-sm active:scale-95"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next slide"
                className="w-11 h-11 rounded-full border border-[#570013]/20 bg-white text-[#570013] flex items-center justify-center hover:bg-[#570013] hover:text-white transition-all duration-300 shadow-sm active:scale-95"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* EMBLA CAROUSEL */}
        <div
          ref={emblaRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing pb-2"
        >
          <div className="flex -ml-4">
            {GALLERY_ITEMS.map((item, index) => (
              <div
                key={item.id}
                className="
                  flex-[0_0_100%]
                  min-w-0
                  pl-4
                  sm:flex-[0_0_50%]
                  md:flex-[0_0_33.333333%]
                  lg:flex-[0_0_25%]
                "
              >
                {/* WRAPPED ENTIRE CARD IN NEXT.JS LINK TO GO TO /gallery */}
                <Link href="/gallery" className="block h-full group">
                  <div
                    className="
                      bg-white
                      rounded-[24px]
                      overflow-hidden
                      border
                      border-[#eaded9]
                      shadow-[0_8px_25px_rgba(87,0,19,0.06)]
                      flex
                      flex-col
                      h-full
                      transition-transform
                      duration-300
                      hover:-translate-y-1
                    "
                  >
                    {/* IMAGE CONTAINER */}
                    <div className="relative w-full aspect-[4/3] bg-[#fcf8f6] overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.imageAlt}
                        fill
                        priority={index < 4}
                        className="
                          object-cover
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-105
                        "
                        sizes="
                          (max-width:639px) 100vw,
                          (max-width:767px) 50vw,
                          (max-width:1023px) 33vw,
                          25vw
                        "
                      />
                    </div>

                    {/* CONTENT AREA BELOW IMAGE */}
                    <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow bg-white border-t border-[#f4ebe6]">
                      <div className="space-y-1">
                        <span className="text-[#8a686b] text-[10px] font-semibold uppercase tracking-[0.08em]">
                          {item.album}
                        </span>
                        <h3
                          className="
                            font-['Playfair_Display']
                            text-[#570013]
                            text-base
                            sm:text-lg
                            font-medium
                            line-clamp-1
                          "
                        >
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}