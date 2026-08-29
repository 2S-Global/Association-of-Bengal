


"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface HeroStat {
  id: number;
  value: string;
  label: string;
}

interface HeroButton {
  id: number;
  label: string;
  href: string;
  variant: "primary" | "secondary";
}

interface HeroData {
  badge: string;
  titleBefore: string;
  highlightedTitle: string;
  titleAfter: string;
  description: string;
  image: string;
  imageAlt: string;
  buttons: HeroButton[];
  stats: HeroStat[];
}

const heroData: HeroData = {
  badge: "Official Event Booking Platform",
  titleBefore: "Book Stall Spaces for Bengal's",
  highlightedTitle: "Major",
  titleAfter: "Cultural Expos & Book Fairs.",
  description:
    "Book exhibition stalls online for major book fairs, cultural meets, and art expos with fast processing and clear layout maps.",
  image: "/images/abcd.jpeg",
  imageAlt: "Exhibition Hall",
  buttons: [
    {
      id: 1,
      label: "Book Stall Now",
      href: "/bookfairapplication",
      variant: "primary",
    },
    {
    id: 2,
    label: "Apply Membership",
    href: "/register",
    variant: "secondary",
  },
  ],
  stats: [
    {
      id: 1,
      value: "500+",
      label: "Events Planned",
    },
    {
      id: 2,
      value: "12K+",
      label: "Registered Members",
    },
    {
      id: 3,
      value: "10+",
      label: "Indian Cities",
    },
  ],
};

function HeroButton({
  button,
}: {
  button: HeroButton;
}) {
  const isPrimary = button.variant === "primary";

  return (
    <Link
      href={button.href}
      className={`
        group
        inline-flex
        items-center
        justify-center
        w-full
        sm:w-auto
        min-h-[52px]
        px-6
        sm:px-8
        py-3
        rounded-xl
        font-['Playfair_Display']
        text-[18px]
        sm:text-[20px]
        lg:text-[22px]
        leading-[28px]
        font-medium
        transition-all
        duration-300
        active:scale-[0.97]

        ${
          isPrimary
            ? `
              bg-[#570013]
              text-white
              shadow-[0_8px_25px_rgba(87,0,19,0.18)]
              hover:bg-[#680019]
              hover:-translate-y-0.5
              hover:shadow-[0_12px_30px_rgba(87,0,19,0.25)]
            `
            : `
              border-2
              border-[#775a19]
              text-[#775a19]
              bg-transparent
              hover:bg-[#ffdea5]
              hover:-translate-y-0.5
            `
        }
      `}
    >
      {button.label} 
    </Link>
  );
}

function HeroStat({
  stat,
  index,
}: {
  stat: HeroStat;
  index: number;
}) {
  return (
    <div
      className={`
        min-w-0
        ${
          index !== 0
            ? "border-l border-[#e0bfbf] pl-3 sm:pl-5 lg:pl-6"
            : ""
        }
      `}
    >
      <div
        className="
          font-['Playfair_Display']
          text-[20px]
          sm:text-[20px]
          lg:text-[27px]
          leading-tight
          font-medium
          text-[#570013]
        "
      >
        {stat.value}
      </div>

      <div
        className="
          mt-1
          text-[9px]
          sm:text-[11px]
          lg:text-[12px]
          leading-[15px]
          sm:leading-[16px]
          tracking-[0.04em]
          sm:tracking-[0.05em]
          font-semibold
          text-[#584141]
        "
      >
        {stat.label}
      </div>
    </div>
  );
}

export default function HomeBody() {
  return (
    <main
      className="
        w-full
        overflow-x-hidden
        bg-[#fff8f5]
        text-[#1e1b18]
        font-['Libre_Franklin']
      "
    >
      
      <section
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-[rgba(87,0,19,0.03)]
          to-[rgba(123,88,0,0.05)]
        "
      >
        {/* Decorative Background */}

        <div
          className="
            pointer-events-none
            absolute
            -top-24
            -right-24
            w-72
            h-72
            sm:w-96
            sm:h-96
            rounded-full
            bg-[#775a19]/[0.04]
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-32
            -left-32
            w-80
            h-80
            rounded-full
            bg-[#570013]/[0.035]
            blur-3xl
          "
        />

       

        <div
          className="
            relative
            w-full
            max-w-[1280px]
            mx-auto
            px-4
            sm:px-6
            lg:px-10
            xl:px-16
            py-10
            sm:py-12
            lg:py-16
            xl:py-20
          "
        >
          

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-12
              gap-10
              sm:gap-12
              lg:gap-8
              xl:gap-12
              items-center
            "
          >
           

            <div
              className="
                lg:col-span-7
                flex
                flex-col
                justify-center
                order-2
                lg:order-1
              "
            >
              

              <span
                className="
                  inline-flex
                  items-center
                  self-start
                  w-fit
                  bg-[#ffdea5]
                  text-[#261900]
                  px-3
                  sm:px-4
                  py-1.5
                  rounded-full
                  text-[9px]
                  sm:text-[10px]
                  lg:text-[11px]
                  font-semibold
                  tracking-[0.08em]
                  uppercase
                  mb-5
                  sm:mb-6
                "
              >
                {heroData.badge}
              </span>

             

              <h1
               className="text-[28px] sm:text-[32px] md:text-[44px] leading-[1.2] md:leading-[1.2] tracking-[-0.01em] md:tracking-[-0.02em] font-bold text-[#570013] font-['Playfair_Display',serif] mb-4 sm:mb-6"
              >
                {heroData.titleBefore}{" "}

                <span className="text-[#775a19]">
                  {heroData.highlightedTitle}
                </span>{" "}

                {heroData.titleAfter}
              </h1>

              
              <p
                className="
                  max-w-[650px]
                  text-[#584141]
                  text-[15px]
                  sm:text-[16px]
                  lg:text-[17px]
                  xl:text-[18px]
                  leading-[24px]
                  sm:leading-[27px]
                  lg:leading-[29px]
                  font-normal
                  mb-7
                  sm:mb-9
                  lg:mb-10
                "
              >
                {heroData.description}
              </p>

              
              {heroData.buttons.length > 0 && (
                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    items-stretch
                    sm:items-center
                    gap-3
                    sm:gap-4
                  "
                >
                  {heroData.buttons.map((button) => (
                    <HeroButton
                      key={button.id}
                      button={button}
                    />
                  ))}
                </div>
              )}

             

              {heroData.stats.length > 0 && (
                <div
                  className="
                    mt-8
                    sm:mt-10
                    lg:mt-12
                    pt-6
                    sm:pt-7
                    border-t
                    border-[#e0bfbf]/50
                    grid
                    grid-cols-3
                    gap-2
                    sm:gap-4
                    max-w-[620px]
                  "
                >
                  {heroData.stats.map(
                    (stat, index) => (
                      <HeroStat
                        key={stat.id}
                        stat={stat}
                        index={index}
                      />
                    )
                  )}
                </div>
              )}
            </div>

            

            <div
              className="
                lg:col-span-5
                order-1
                lg:order-2
                w-full
              "
            >
              <div
                className="
                  relative
                  w-full
                  aspect-[4/3]
                  sm:aspect-[16/10]
                  lg:aspect-[4/5]
                  xl:aspect-[4/5]
                  overflow-hidden
                  rounded-[22px]
                  sm:rounded-[28px]
                  lg:rounded-[32px]
                  border-2
                  sm:border-4
                  border-white
                  bg-[#f5ece7]
                  shadow-[0_15px_40px_rgba(80,30,20,0.16)]
                  group
                "
              >
                {/* IMAGE */}

                <Image
                  src={heroData.image}
                  alt={heroData.imageAlt}
                  fill
                  priority
                  sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 1024px) 90vw,
                    42vw
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
                />

                {/* IMAGE GRADIENT */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#570013]/45
                    via-[#570013]/5
                    to-transparent
                    pointer-events-none
                  "
                />

                {/* IMAGE BORDER */}

                <div
                  className="
                    absolute
                    inset-2
                    sm:inset-3
                    rounded-[17px]
                    sm:rounded-[23px]
                    border
                    border-white/30
                    pointer-events-none
                  "
                />

              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}