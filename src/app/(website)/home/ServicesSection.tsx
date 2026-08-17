"use client";

import React from "react";
import {
  BookOpen,
  Palette,
  Landmark,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    icon: <BookOpen className="w-7 h-7" />,
    title: "Book Fairs",
    description:
      "Discover major book fairs and literary exhibitions across Bengal, explore available opportunities, and connect with publishers, authors, and readers.",
    features: [
      "Explore upcoming book fairs",
      "Stall booking opportunities",
    ],
  },

  {
    icon: <Palette className="w-7 h-7" />,
    title: "Literary Services",
    description:
      "Support and promote authors, publishers, writers, and literary communities through programs and initiatives dedicated to the growth of literature.",
    features: [
      "Author & publisher support",
      "Literary programs & initiatives",
    ],
  },

  {
    icon: <Landmark className="w-7 h-7" />,
    title: "Cultural Programs",
    description:
      "Participate in cultural programs, exhibitions, and community activities that celebrate Bengal's literature, heritage, arts, traditions, and creative expression.",
    features: [
      "Cultural events & exhibitions",
      "Community participation",
    ],
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-[#f6efeb] py-12 lg:py-20 font-['Libre_Franklin']"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="text-center mb-10 lg:mb-12 max-w-2xl mx-auto">

          <h2
            className="
              font-['Playfair_Display']
              text-[#570013]
              text-[28px]
              sm:text-[32px]
              lg:text-[36px]
              font-semibold
              mb-3
            "
          >
            Events &amp; Cultural Programs
          </h2>

          <p
            className="
              text-[#604b4d]
              text-base
              leading-6
            "
          >
            Explore literary and cultural opportunities, connect with
            communities, and help preserve and promote Bengal&apos;s rich
            cultural heritage.
          </p>

        </div>

        {/* =====================================================
            SERVICES CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {services.map((service) => (

            <div
              key={service.title}
              className="
                bg-white
                p-6
                sm:p-8
                rounded-[24px]
                border
                border-[#eaded9]
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
                group
                md:[&:last-child]:col-span-2
                lg:[&:last-child]:col-span-1
              "
            >

              {/* =================================================
                  ICON
              ================================================== */}

              <div
                className="
                  w-14
                  h-14
                  sm:w-16
                  sm:h-16
                  bg-[#570013]/5
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  mb-7
                  group-hover:bg-[#570013]
                  transition-colors
                  duration-300
                "
              >

                <span
                  className="
                    text-[#570013]
                    group-hover:text-white
                    transition-colors
                    duration-300
                  "
                >
                  {service.icon}
                </span>

              </div>

              {/* =================================================
                  TITLE
              ================================================== */}

              <h3
                className="
                  font-['Playfair_Display']
                  text-xl
                  sm:text-2xl
                  font-semibold
                  text-[#570013]
                  mb-4
                "
              >
                {service.title}
              </h3>

              
              <p
                  className="
                    text-[#604b4d]
                    text-base
                    leading-7
                    mb-6
                    text-justify
                  "
                >
  {service.description}
</p>

              
              <ul className="space-y-3">

                {service.features.map((feature) => (

                  <li
                    key={feature}
                    className="
                      flex
                      items-center
                      gap-3
                      text-sm
                      text-[#3e3435]
                    "
                  >

                    <span
                      className="
                        text-[#7b5800]
                        text-lg
                        flex
                        items-center
                        shrink-0
                      "
                    >
                      <CheckCircle2 className="w-[18px] h-[18px]" />
                    </span>

                    <span>{feature}</span>

                  </li>

                ))}

              </ul>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}