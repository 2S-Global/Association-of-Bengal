"use client";

import React, { useEffect, useMemo, useState } from "react";
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

interface HeroSectionData {
  badgeText: string;
  welcomeTitle: string;
  tagline: string;
  headline: string;
  description: string;
  heroImage: string;
  eventsPlanned: number;
  registeredMembers: number;
  indianCities: number;
}

const heroButtons: HeroButton[] = [
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
];

const formatStat = (value: number) =>
  `${value >= 1000 && value % 1000 === 0 ? `${value / 1000}K` : value}+`;

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
  const [heroSection, setHeroSection] = useState<HeroSectionData | null>(null);
  const [heroError, setHeroError] = useState(false);

  useEffect(() => {
    void fetch("/api/hero-section")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to load Hero Section.");
        setHeroSection(result.data);
      })
      .catch(() => setHeroError(true));
  }, []);

  const heroStats = useMemo<HeroStat[]>(() => heroSection ? [
    { id: 1, value: formatStat(heroSection.eventsPlanned), label: "Events Planned" },
    { id: 2, value: formatStat(heroSection.registeredMembers), label: "Registered Members" },
    { id: 3, value: formatStat(heroSection.indianCities), label: "Indian Cities" },
  ] : [], [heroSection]);
  const headlineParts = heroSection?.headline.split(/(Major)/i) ?? [];
  const displayTagline = heroSection?.tagline.replace(/^[“"]|[”"]$/g, "");
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
      {!heroSection && <p className="sr-only" role="status">{heroError ? "Hero content is temporarily unavailable." : "Loading hero content."}</p>}
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
            {/* LEFT CONTENT */}

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
              {/* Existing Badge */}

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
                {heroSection?.badgeText}
              </span>

              {/* NEW ASSOCIATION CONTENT */}

              <div className="mb-5 sm:mb-6">
                <h2
                  className="
                    text-[22px]
                    sm:text-[25px]
                    md:text-[30px]
                    lg:text-[34px]
                    leading-[1.25]
                    font-semibold
                    text-[#570013]
                    font-['Playfair_Display',serif]
                    tracking-[-0.01em]
                  "
                >
                  {heroSection?.welcomeTitle}
                </h2>

                <div className="mt-2 sm:mt-3 flex items-center gap-3">
                  <span className="h-[1px] w-10 sm:w-14 bg-[#775a19]" />

                  <p
                    className="
                      text-[#775a19]
                      text-[14px]
                      sm:text-[16px]
                      md:text-[17px]
                      font-medium
                      italic
                      tracking-[0.02em]
                    "
                  >
                    “{displayTagline}”
                  </p>
                </div>
              </div>

              {/* PREVIOUS MAIN CONTENT - KEPT */}

              <h1
                className="
                  text-[28px]
                  sm:text-[32px]
                  md:text-[44px]
                  leading-[1.2]
                  md:leading-[1.2]
                  tracking-[-0.01em]
                  md:tracking-[-0.02em]
                  font-bold
                  text-[#570013]
                  font-['Playfair_Display',serif]
                  mb-4
                  sm:mb-6
                "
              >
                {headlineParts.map((part, index) => part.toLowerCase() === "major" ? <span key={index} className="text-[#775a19]">{part}</span> : part)}
              </h1>

              {/* PREVIOUS DESCRIPTION - KEPT */}

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
                {heroSection?.description}
              </p>

              {/* EXISTING BUTTONS - KEPT */}

              {heroButtons.length > 0 && (
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
                  {heroButtons.map((button) => (
                    <HeroButton
                      key={button.id}
                      button={button}
                    />
                  ))}
                </div>
              )}

              {/* EXISTING STATISTICS - KEPT */}

              {heroStats.length > 0 && (
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
                  {heroStats.map((stat, index) => (
                    <HeroStat
                      key={stat.id}
                      stat={stat}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT IMAGE - UNCHANGED */}

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

                {heroSection?.heroImage && <Image
                  src={heroSection.heroImage}
                  alt={heroSection.headline || "Hero image"}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
                />}

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
