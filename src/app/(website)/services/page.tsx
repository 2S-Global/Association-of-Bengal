"use client";

import React, { useEffect } from "react";
import Link from "next/link";

const servicesList = [
  {
    number: 1,
    title: "Member Support",
    description:
      "Resolve professional and organisational issues faced by members associated with literature and culture.",
  },
  {
    number: 2,
    title: "United Literary & Cultural Platform",
    description:
      "Bring together publishers, writers, poets, editors, proofreaders, printers, cover designers, illustrators, booksellers, performing artists, and all related professionals under one umbrella to collectively represent their interests before the appropriate authorities.",
  },
  {
    number: 3,
    title: "Book Distribution Network",
    description:
      "Expand the availability and distribution of Bengali books across every district of West Bengal and throughout India.",
  },
  {
    number: 4,
    title: "Book Fairs & Cultural Festivals",
    description:
      "Organise book fairs, heritage festivals, and literary and cultural programmes not only in Kolkata but across all districts of West Bengal.",
  },
  {
    number: 5,
    title: "Library Development",
    description:
      "Encourage the establishment of new libraries and work towards the revival of closed libraries.",
  },
  {
    number: 6,
    title: "Support for Folk Artists",
    description:
      "Advocate for greater social recognition and financial assistance from the Government for Chhau artists and other traditional folk performers.",
  },
  {
    number: 7,
    title: "Digital Book Catalogue",
    description:
      "Develop a transparent and impartial digital catalogue of books to facilitate Central Library and institutional book purchases.",
  },
  {
    number: 8,
    title: "Anti-Piracy Initiative",
    description:
      "Work to prevent the publication, distribution, and sale of pirated and counterfeit books.",
  },
  {
    number: 9,
    title: "Awards & Recognition",
    description:
      "Introduce sponsored awards, in addition to Government honours, to recognise deserving literary and cultural talents.",
  },
  {
    number: 10,
    title: "Health & Awareness Programmes",
    description:
      "Organise medical camps, health check-up camps, and public awareness programmes for members and the community.",
  },
  {
    number: 11,
    title: "Promotion Through Visual Media",
    description:
      "Promote Bengali literature and culture through films, web series, documentaries, and other digital media in India and abroad.",
  },
  {
    number: 12,
    title: "Translation & Global Reach",
    description:
      "Encourage the translation of Bengali books into various languages and promote them internationally.",
  },
  {
    number: 13,
    title: "Fair Trade Practices",
    description:
      "Advocate for a fixed, transparent, and equitable commission structure between publishers and booksellers.",
  },
  {
    number: 14,
    title: "Fair Wages",
    description:
      "Work towards fair and appropriate remuneration for professionals engaged in book production and publishing.",
  },
  {
    number: 15,
    title: "Group Insurance",
    description:
      "Strive to introduce group insurance schemes for workers, publishers, booksellers, printing press personnel, and other stakeholders.",
  },
  {
    number: 16,
    title: "Children's Literary Development",
    description:
      "Foster reading habits and cultivate an interest in literature and culture among children through various programmes and initiatives.",
  },
  {
    number: 17,
    title: "Rural Literary Network",
    description:
      "Build a strong literary and cultural network connecting rural writers, artists, readers, and organisations.",
  },
  {
    number: 18,
    title: "Promotion of Bengali Education",
    description:
      "Advocate for the strengthening of Bengali language education in schools and colleges.",
  },
  {
    number: 19,
    title: "Archives & Documentation",
    description:
      "Establish archives for rare manuscripts, oral histories, interviews, photographs, audio-visual materials, and other valuable cultural resources.",
  },
  {
    number: 20,
    title: "Legal Assistance",
    description:
      "Provide guidance and legal support to members whenever required.",
  },
  {
    number: 21,
    title: "Welfare & Relief Fund",
    description:
      "Raise funds to assist members of the literary and cultural community who are facing financial hardship or emergencies.",
  },
  {
    number: 22,
    title: "Member Accommodation Support",
    description:
      "Facilitate affordable accommodation or shelter arrangements in different districts for members travelling from distant locations for literary or cultural events.",
  },
  {
    number: 23,
    title: "Artists–Organisers Network",
    description:
      "Create a reliable bridge between performers, artists, and event organisers to encourage greater opportunities and collaboration.",
  },
  {
    number: 24,
    title: "Transparent Administration",
    description:
      "Ensure that all financial and administrative activities of the Association are conducted with complete transparency, neutrality, accountability, and professionalism.",
  },
];

export default function ServicesBody() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-4");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("section, .grid > div");
    elements.forEach((el) => {
      el.classList.add(
        "transition-all",
        "duration-700",
        "opacity-0",
        "translate-y-4"
      );
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-10 lg:py-20 min-h-screen font-['Libre_Franklin']">
      {/* Hero Section */}
      <section className="mb-10 lg:mb-20 text-center">
        <div className="mb-6">
          <h1 className="text-[28px] sm:text-[32px] md:text-[44px] leading-[1.2] md:leading-[1.2] tracking-[-0.01em] md:tracking-[-0.02em] font-bold text-[#570013] font-['Playfair_Display',serif] mb-4 sm:mb-6">
            Our Services
          </h1>
          <p className="font-['Libre_Franklin'] text-base sm:text-lg text-[#584141] max-w-3xl mx-auto italic text-justify sm:text-center">
            The Association of Bengal for Literature and Culture is committed to
            strengthening the literary and cultural ecosystem through the
            following initiatives:
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#775a19]" />
          {/* <span className="material-symbols-outlined text-[#775a19] text-2xl">
            Auto_Stories
          </span> */}
          <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#775a19]" />
        </div>
      </section>

      {/* All 24 Services Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((service) => (
          <div
            key={service.number}
            className="bg-[#f5ece7] rounded-xl border border-[#775a19]/20 p-6 flex flex-col justify-between hover:border-[#775a19] transition-all shadow-xs"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#570013] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {service.number}
                </span>
                <h3 className="font-['Playfair_Display'] text-lg text-[#570013] font-bold">
                  {service.title}
                </h3>
              </div>
              <p className="text-[#584141] text-sm leading-relaxed text-justify">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="mt-10 lg:mt-20 py-10 lg:py-20 px-6 lg:px-12 bg-[#e9e1dc]/30 text-center rounded-2xl border border-[#e0bfbf]">
        <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl text-[#570013] mb-6 font-semibold">
          Interested in our services?
        </h2>
        <p className="font-['Libre_Franklin'] text-base sm:text-lg text-[#584141] mb-8 max-w-xl mx-auto text-justify sm:text-center">
          Whether you&apos;re an individual scholar, artist, or cultural
          institution, we&apos;re here to support and collaborate with you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/contactus"
            className="bg-[#570013] text-white px-8 py-3.5 font-semibold text-sm rounded-lg hover:bg-[#800020] transition-all shadow-md text-center"
          >
            INQUIRE NOW
          </Link>
          <Link
            href="/bookfairapplication"
            className="border border-[#775a19] text-[#570013] px-8 py-3.5 font-semibold text-sm rounded-lg hover:bg-[#f5ece7] transition-all text-center"
          >
            JOIN AS A MEMBER
          </Link>
        </div>
      </section>
    </main>
  );
}