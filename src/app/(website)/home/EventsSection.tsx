"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface EventBadge {
  id: number;
  text: string;
  type: "primary" | "light";
}

interface EventData {
  id: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  badges: EventBadge[];
  buttonText: string;
  buttonLink: string;
  size: "large" | "small" | "wide";
}

const eventsData: EventData[] = [
  {
    id: 1,
    title: "Grand Kolkata Book Fair & Literary Fest",
    description:
      "Eastern India's largest literary mela with lakhs of book lovers visiting daily. Prime publisher and distributor stalls available.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Grand Kolkata Book Fair and Literary Festival",

    badges: [
      {
        id: 1,
        text: "Main Exhibition",
        type: "primary",
      },
      {
        id: 2,
        text: "Winter 2026",
        type: "light",
      },
    ],

    buttonText: "Book Stall",
    buttonLink: "/bookfairapplication",
    size: "large",
  },

  {
    id: 2,
    title: "Little Magazine Corner",
    description:
      "Dedicated spaces for independent publishers, regional poets, and literary periodicals.",
    image:
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Little Magazine and Poetry Pavilion",

    badges: [
      {
        id: 1,
        text: "Poetry & Periodicals",
        type: "primary",
      },
    ],

    buttonText: "Apply for Table",
    buttonLink: "/bookfairapplication",
    size: "small",
  },

  {
    id: 3,
    title: "Children's & Educational Book Pavilion",
    description:
      "Highlight academic publications, children's comics, and interactive learning media in high-footfall dedicated zones.",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Children's and Educational Book Pavilion",

    badges: [
      {
        id: 1,
        text: "Special Interest",
        type: "primary",
      },
    ],

    buttonText: "Reserve Educational Stall",
    buttonLink: "/bookfairapplication",
    size: "wide",
  },
];

export default function EventsSection() {
  return (
    <section className="bg-[#fff8f5] py-12 lg:py-20 font-['Libre_Franklin']">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 lg:mb-12 gap-4">

          <div>
            <h2 className="font-['Playfair_Display'] text-[#570013] text-[28px] sm:text-[32px] lg:text-[36px] font-semibold mb-2">
              Upcoming Events
            </h2>

            <p className="text-[#604b4d] text-base leading-6">
              Discover our upcoming events and find the right opportunity to
              participate.
            </p>
          </div>

          <Link
            href="/events"
            className="text-[#7b5800] font-semibold text-sm flex items-center gap-2 hover:underline shrink-0 group"
          >
            View All Events

            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {eventsData.map((event) => (

            <div
              key={event.id}
              className={`
                group
                relative
                rounded-[24px]
                overflow-hidden
                bg-white
                border
                border-[#eaded9]
                shadow-sm
                flex
                flex-col
                justify-end
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-xl

                ${
                  event.size === "large"
                    ? "lg:col-span-8 min-h-[380px] sm:min-h-[450px]"
                    : event.size === "small"
                    ? "lg:col-span-4 min-h-[380px] sm:min-h-[450px]"
                    : "lg:col-span-12 min-h-[280px] sm:min-h-[320px]"
                }
              `}
            >

              {/* IMAGE */}
              <div className="absolute inset-0">

                <Image
                  src={event.image}
                  alt={event.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={
                    event.size === "large"
                      ? "(max-width: 1024px) 100vw, 66vw"
                      : event.size === "small"
                      ? "(max-width: 1024px) 100vw, 33vw"
                      : "100vw"
                  }
                />

              </div>

              {/* OVERLAY */}
              <div
                className={`
                  absolute
                  inset-0
                  ${
                    event.size === "wide"
                      ? "bg-gradient-to-r from-black/90 via-black/60 to-transparent"
                      : "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                  }
                `}
              />

              {/* CONTENT */}
              <div
                className={`
                  relative
                  z-10
                  p-5
                  sm:p-7
                  w-full

                  ${
                    event.size === "wide"
                      ? "max-w-2xl"
                      : ""
                  }
                `}
              >

                <div
                  className={`
                    text-white

                    ${
                      event.size === "large"
                        ? "flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
                        : ""
                    }
                  `}
                >

                  {/* TEXT */}
                  <div className="flex-1">

                    {/* BADGES */}
                    <div className="flex flex-wrap gap-2 mb-3">

                      {event.badges.map((badge) => (

                        <span
                          key={badge.id}
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider

                            ${
                              badge.type === "primary"
                                ? "bg-[#7b5800]"
                                : "bg-white/20 backdrop-blur-md"
                            }
                          `}
                        >
                          {badge.text}
                        </span>

                      ))}

                    </div>

                    {/* TITLE */}
                    <h3
                      className={`
                        font-['Playfair_Display']
                        font-semibold
                        mb-2

                        ${
                          event.size === "wide"
                            ? "text-2xl sm:text-3xl"
                            : "text-2xl sm:text-3xl"
                        }
                      `}
                    >
                      {event.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p
                      className={`
                        text-xs
                        sm:text-sm
                        text-white/80
                        leading-6

                        ${
                          event.size === "small"
                            ? "mb-4"
                            : event.size === "wide"
                            ? "mb-5"
                            : ""
                        }
                      `}
                    >
                      {event.description}
                    </p>

                  </div>

                  {/* BUTTON */}
                  <Link
                    href={event.buttonLink}
                    className={`
                      text-sm
                      font-semibold
                      px-6
                      py-3
                      rounded-xl
                      transition-all
                      shadow-md
                      shrink-0

                      ${
                        event.size === "large"
                          ? "w-full sm:w-auto text-center bg-white text-[#570013] hover:bg-[#fff0d0]"
                          : event.size === "small"
                          ? "block w-full text-center border border-white/40 hover:bg-white hover:text-[#570013] backdrop-blur-md"
                          : "inline-block bg-[#570013] text-white hover:bg-[#70001a]"
                      }
                    `}
                  >
                    {event.buttonText}
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>
      </div>
    </section>
  );
}