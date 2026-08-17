// // "use client";

// // import React from "react";
// // import Image from "next/image";

// // const galleryImages = [
// //   {
// //     src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyXat1WAdNOgzNTub0p1We5Z_rczsXm5wpRb4EE7EyBEysKIafGQ_UMnAPsXv2svjVnuHiuezBa_qopE3uq2LDWsZ8MpAg279OpUcGuHrIeFO4rCbckzO-yFiPhD36jStyViMBr9DvUfh0sZld3Xy8OBc_llV5dxKhBPP7-sfNmeBQ6nOu-NBSMP43lL58eH6fZayDHxsHjRs0y7RPpLiFt7Oz1v_r_itZ1wTDrfwfjicOKBKDHG0",
// //     alt: "Exhibition Hall 1",
// //     stagger: false,
// //   },
// //   {
// //     src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsqK6av3CiNCraOcF5ms985EEFjbP4XA4fehws4BDsREHVsGH7JFE2H3_UIvO_BYu_e-1a6e-6ohclLKxabvHfskuAlMmWgdYmYrQyfOGyME-JtLYPC8mSYnRcnRD8HBuue32qBJnKyhBkUl0Mrw9_sU1q2W8FstnVB4gKQma-cTD3HXWNeQpRuAgSuXyH102jP9fAVZ3189fDuDFj4gj8cQjaft-YHqvcW32b4NWBZg-FQ7z4aLE",
// //     alt: "Exhibition Hall 2",
// //     stagger: true,
// //   },
// //   {
// //     src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-_E25Jvvy5RzsFT8sJpBCh1LKbVYpEE6rIVDxuqV75Kmxb_mb8FzWjYwTz4glEs3FTSZgp0TVl-6ockSXhFuWU0XkSFsmTiu1aD7HwkhDSxX8Vp1nqjdVkWOsKF9Wsf1FvsfpePydBeaXu689gR3w5LLL3tSDoDMeMPry5vHeUM_chAQve7alIazJCTmx7knjUsSjq4-WzcWSd4EuR5zDiL2pmw0HptokNzNeHML85EpcbO0p93A",
// //     alt: "Exhibition Hall 3",
// //     stagger: false,
// //   },
// //   {
// //     src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBi3fvUq0AyP4Mv2yEC_2kRUtevrxEq2wlL1f5o_pFti4NXwdfGUFhLRzIxwZieziuhz-2DfLkEzAaXQ8TaVQ-FOT_eArryoirW4g3KYPFB-kwMMtF0nzYHRbTIK--PhdtZL6Jn9BSfzwcHOSoYbfyREnz5ppfLrj1lAC7SpENtEqZ3yoLSOd94hoRVEmempk2WUn5XFs_vTjDF_QplAgrj1ZIZ5kLb2ByIY4drFGaluJ35U1hfDck",
// //     alt: "Exhibition Hall 4",
// //     stagger: true,
// //   },
// // ];

// // export default function GallerySection() {
// //   return (
// //     <section className="bg-[#fff8f5] py-12 lg:py-20 font-['Libre_Franklin']">

// //       <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">

// //         {/* TITLE */}
// //         <div className="text-center mb-10 lg:mb-12">

// //           <h2 className="font-['Playfair_Display'] text-[#570013] text-[28px] sm:text-[32px] lg:text-[36px] font-semibold mb-2">
// //             Photo Gallery
// //           </h2>

// //           <p className="text-[#604b4d] text-base leading-6">
// //             Explore photos and memorable moments from our past events.
// //           </p>

// //         </div>

// //         {/* GALLERY */}
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">

// //           {galleryImages.map((image) => (
// //             <div
// //               key={image.alt}
// //               className={`
// //                 relative
// //                 aspect-square
// //                 rounded-xl
// //                 sm:rounded-[24px]
// //                 overflow-hidden
// //                 shadow-md
// //                 group
// //                 ${image.stagger ? "mt-4 sm:mt-8" : ""}
// //               `}
// //             >
// //               <Image
// //                 src={image.src}
// //                 alt={image.alt}
// //                 fill
// //                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
// //                 sizes="(max-width: 768px) 50vw, 25vw"
// //               />
// //             </div>
// //           ))}

// //         </div>

// //       </div>
// //     </section>
// //   );
// // }

// "use client";

// import React, { useRef } from "react";
// import Image from "next/image";

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
//       delay: 2500,
//       stopOnInteraction: false,
//       stopOnMouseEnter: true,
//     })
//   );

//   const [emblaRef] = useEmblaCarousel(
//     {
//       loop: true,
//       align: "start",
//       skipSnaps: false,
//       dragFree: false,
//     },
//     [autoplay.current]
//   );

//   return (
//     <section className="bg-[#fff8f5] py-14 sm:py-16 lg:py-20 overflow-hidden font-['Libre_Franklin']">

//       <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">

//         {/* HEADER */}
//         <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-12">

//           <span className="inline-flex items-center px-4 py-1.5 mb-4 rounded-full bg-[#ffdea5] text-[#570013] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em]">
//             Our Moments
//           </span>

//           <h2 className="font-['Playfair_Display'] text-[#570013] text-[28px] sm:text-[32px] lg:text-[38px] leading-tight font-semibold mb-3">
//             Photo Gallery
//           </h2>

//           <p className="text-[#604b4d] text-sm sm:text-base leading-6">
//             Explore memorable moments from Bengal&apos;s literary and
//             cultural events.
//           </p>

//         </div>

//         {/* EMBLA */}
//         <div
//           ref={emblaRef}
//           className="overflow-hidden"
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

//                 <div
//                   className="
//                     group
//                     relative
//                     aspect-[4/3]
//                     overflow-hidden
//                     rounded-[20px]
//                     sm:rounded-[24px]
//                     bg-[#f6efeb]
//                     border
//                     border-[#eaded9]
//                     shadow-[0_8px_25px_rgba(87,0,19,0.08)]
//                     cursor-grab
//                     active:cursor-grabbing
//                   "
//                 >

//                   {/* IMAGE */}
//                   <Image
//                     src={image.src}
//                     alt={image.alt}
//                     fill
//                     priority={image.id <= 4}
//                     className="
//                       object-cover
//                       transition-transform
//                       duration-700
//                       ease-out
//                       group-hover:scale-110
//                     "
//                     sizes="
//                       (max-width:639px) 100vw,
//                       (max-width:767px) 50vw,
//                       (max-width:1023px) 33vw,
//                       25vw
//                     "
//                   />

//                   {/* OVERLAY */}
//                   <div className="
//                     absolute
//                     inset-0
//                     bg-gradient-to-t
//                     from-[#570013]/60
//                     via-transparent
//                     to-transparent
//                     opacity-0
//                     group-hover:opacity-100
//                     transition-opacity
//                     duration-500
//                   " />

//                   {/* LABEL */}
//                   <div className="
//                     absolute
//                     left-4
//                     right-4
//                     bottom-4
//                     translate-y-3
//                     opacity-0
//                     group-hover:translate-y-0
//                     group-hover:opacity-100
//                     transition-all
//                     duration-500
//                   ">

//                     <span className="
//                       inline-flex
//                       px-3
//                       py-1.5
//                       rounded-full
//                       bg-white/90
//                       backdrop-blur-md
//                       text-[#570013]
//                       text-[10px]
//                       font-semibold
//                       uppercase
//                       tracking-[0.08em]
//                     ">
//                       Bengal Literature &amp; Culture
//                     </span>

//                   </div>

//                 </div>

//               </div>
//             ))}

//           </div>
//         </div>

//         {/* FOOTER */}

//       </div>

//     </section>
//   );
// }

"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=85",
    alt: "Book Fair Exhibition",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=85",
    alt: "Books and Literature",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=85",
    alt: "Library Books",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=85",
    alt: "Library Exhibition",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1200&q=85",
    alt: "Literary Event",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=85",
    alt: "Bookshelf",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=1200&q=85",
    alt: "Reading Event",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=1200&q=85",
    alt: "Book Collection",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=85",
    alt: "Literary Books",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=85",
    alt: "Cultural Exhibition",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=85",
    alt: "Children's Books",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=85",
    alt: "Book Display",
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=85",
    alt: "Open Book",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=85",
    alt: "Bookshelf Collection",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=1200&q=85",
    alt: "Literature Collection",
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=85",
    alt: "Reading Space",
  },
  {
    id: 17,
    src: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=85",
    alt: "Cultural Books",
  },
  {
    id: 19,
    src: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=85",
    alt: "Book Reading",
  },
  {
    id: 20,
    src: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=85",
    alt: "Cultural Event",
  },
];

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

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

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

          {/* ARROW CONTROLS */}
          <div className="hidden md:flex items-center gap-3 mt-4 md:mt-0">
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

        {/* EMBLA CAROUSEL */}
        <div
          ref={emblaRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing pb-2"
        >
          <div className="flex -ml-4">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="
                  flex-[0_0_100%]
                  min-w-0
                  pl-4
                  sm:flex-[0_0_50%]
                  md:flex-[0_0_33.333333%]
                  lg:flex-[0_0_25%]
                "
              >
                {/* CARD CONTAINER WITH CLEAN SEPARATE BOTTOM CONTENT AREA */}
                <div
                  className="
                    group
                    bg-white
                    rounded-[24px]
                    overflow-hidden
                    border
                    border-[#eaded9]
                    shadow-[0_8px_25px_rgba(87,0,19,0.06)]
                    flex
                    flex-col
                    h-full
                  "
                >
                  {/* CLEAN IMAGE CONTAINER WITHOUT GRADIENT */}
                  <div className="relative w-full aspect-[4/3] bg-[#fcf8f6] overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      priority={image.id <= 4}
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
                        Bengal Literature &amp; Culture
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
                        {image.alt}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
