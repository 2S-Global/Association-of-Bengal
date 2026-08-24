


"use client";

import React from "react";
import Image from "next/image";

interface AboutStat {
  id: number;
  value: string;
  label: string;
}

interface AboutSectionData {
  badge?: string;
  title: string;
  highlightedTitle?: string;
  description: string[];
  image: string;
  imageAlt: string;
  stats: AboutStat[];
}

const aboutData: AboutSectionData = {
  badge: "About Bengal Stall Pro",

  title: "Supporting the Growth of Bengal's Literature & Culture",

  highlightedTitle: "",

  description: [
    "Bengal Stall Pro connects publishers, artisans, and sellers directly with major event committees across West Bengal and surrounding regions.",

    "We make stall booking transparent and simple, helping sellers get prime locations at book fairs, handicraft melas, and cultural exhibitions.",
  ],

  image:
    "https://media.assettype.com/outlooktraveller/2023-12/4f4d6897-932b-4dbd-be07-7db574253cc6/kolkata_book_fair_1.jpg?w=960&auto=format%2Ccompress&fit=max&format=webp&dpr=1.0",

  imageAlt:
    "Kolkata Book Fair and cultural exhibition",

  stats: [
    {
      id: 1,
      value: "500+",
      label: "Events Planned",
    },
    {
      id: 2,
      value: "10+",
      label: "Indian Cities",
    },
  ],
};

/* =====================================================
   COMPONENT
===================================================== */

export default function AboutSection() {
  return (
    <section
      id="about"
      className="
        bg-[#fff7f3]
        py-12
        lg:py-16
        font-['Libre_Franklin']
      "
    >
      <div
        className="
          max-w-[1200px]
          mx-auto
          px-6
          lg:px-8
        "
      >

        {/* =================================================
            MAIN GRID
        ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-10
            lg:gap-16
            items-center
          "
        >

          {/* =================================================
              IMAGE
          ================================================== */}

          <div className="w-full">

            <div
              className="
                relative
                w-full
                aspect-[4/3]
                overflow-hidden
                rounded-[28px]
                border
                border-[#eaded8]
                shadow-[0_12px_30px_rgba(80,30,20,0.10)]
                group
              "
            >

              <Image
                src={aboutData.image}
                alt={aboutData.imageAlt}
                fill
                className="
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
                sizes="
                  (max-width: 1024px) 100vw,
                  50vw
                "
              />

              {/* IMAGE OVERLAY */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#570013]/20
                  via-transparent
                  to-transparent
                  pointer-events-none
                "
              />

            </div>

          </div>

          {/* =================================================
              CONTENT
          ================================================== */}

          <div>

            {/* BADGE */}

            

            {/* TITLE */}

            <h2
              className="
                font-['Playfair_Display']
                text-[#720018]
                text-3xl
                sm:text-4xl
                lg:text-[40px]
                leading-tight
                font-bold
                mb-6
              "
            >
              {aboutData.title}

              {aboutData.highlightedTitle && (
                <>
                  {" "}
                  <span className="text-[#b27620]">
                    {aboutData.highlightedTitle}
                  </span>
                </>
              )}
            </h2>

            {/* GOLD LINE */}

            <div
              className="
                w-16
                h-1
                bg-[#b27620]
                mb-7
              "
            />

            {/* =================================================
                DESCRIPTIONS
            ================================================== */}

            <div className="space-y-5 mb-9">

              {aboutData.description.map(
                (paragraph, index) => (
                  <p
                    key={index}
                    className="
                      text-[#684b4b]
                      text-base
                      sm:text-lg
                      leading-7
                    "
                  >
                    {paragraph}
                  </p>
                )
              )}

            </div>

            {/* =================================================
                STATS
            ================================================== */}

            {aboutData.stats.length > 0 && (
              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                "
              >

                {aboutData.stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="
                      group
                      bg-[#f8eee9]
                      border
                      border-[#eaded8]
                      rounded-xl
                      p-5
                      sm:p-6
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-[0_10px_25px_rgba(80,30,20,0.08)]
                    "
                  >

                    {/* VALUE */}

                    <div
                      className="
                        font-['Playfair_Display']
                        text-3xl
                        font-semibold
                        text-[#720018]
                        mb-1
                      "
                    >
                      {stat.value}
                    </div>

                    {/* LABEL */}

                    <div
                      className="
                        text-[10px]
                        sm:text-xs
                        text-[#684b4b]
                        uppercase
                        tracking-[0.12em]
                        font-semibold
                      "
                    >
                      {stat.label}
                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}