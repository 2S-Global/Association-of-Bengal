"use client";

import React, { useEffect } from "react";
import { Eye, Flag, CheckCircle2 } from "lucide-react";

export default function AboutBody() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-8");
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      section.classList.add(
        "transition-all",
        "duration-700",
        "ease-out",
        "opacity-0",
        "translate-y-8"
      );
      observer.observe(section);
    });

    const hero = document.querySelector("section");
    if (hero) {
      hero.classList.remove("opacity-0", "translate-y-8");
      hero.classList.add("opacity-100", "translate-y-0");
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="w-full flex-grow">
      {/* Main About Us Section */}
      <section className="relative py-12 md:py-16 px-4 sm:px-6 md:px-16 bg-gradient-to-b from-[#fbf2ed]/80 via-[#fff8f5] to-[#fff8f5] overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          {/* Header Title */}
          <div className="text-center space-y-3">
            <h1 className="text-[28px] sm:text-[32px] md:text-[44px] leading-[1.2] md:leading-[1.2] tracking-[-0.01em] md:tracking-[-0.02em] font-bold text-[#570013] font-['Playfair_Display',serif] mb-4 sm:mb-6">
              About Us
            </h1>
            <div className="w-24 h-1 bg-[#775a19] mx-auto rounded-full"></div>
          </div>

          {/* Introductory Narrative Card */}
          <div className="bg-white/85 backdrop-blur-[12px] p-6 md:p-10 rounded-2xl border border-[#e0bfbf]/80 shadow-sm space-y-5 text-[#584141] text-base sm:text-lg leading-relaxed text-justify">
            <p className="font-semibold text-[#570013]/95 text-lg border-l-4 border-[#775a19] pl-4 py-1 text-justify">
              The Association of Bengal for Literature and Culture is a
              dedicated platform committed to promoting Bengali literature,
              language, art, heritage, and cultural traditions.
            </p>
            <p className="text-justify">
              Our association brings together writers, poets, artists,
              researchers, publishers, performers, readers, and cultural
              enthusiasts. We aim to create meaningful opportunities for both
              established and emerging talents to present their work, exchange
              ideas, and contribute to the enrichment of Bengal’s literary and
              cultural heritage.
            </p>
            <p className="text-justify">
              Through literary programmes, cultural events, workshops,
              publications, discussions, competitions, and community
              initiatives, we strive to preserve our traditions while
              encouraging creativity and contemporary expression.
            </p>
          </div>
        </div>
      </section>

      {/* Ornamental Divider */}
      <div className="flex items-center gap-6 py-4 px-4 sm:px-6 md:px-16 max-w-[1280px] mx-auto">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#8c7071] to-transparent opacity-50" />
        {/* <span className="material-symbols-outlined text-[#775a19] opacity-80 scale-125">
          auto_stories
        </span> */}
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#8c7071] to-transparent opacity-50" />
      </div>

      {/* Our Vision & Mission Cards */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-16 py-10 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Our Vision */}
          <div className="md:col-span-5 bg-gradient-to-br from-white via-[#fbf2ed] to-[#fff8f5] p-8 md:p-10 rounded-2xl border border-[#e0bfbf] shadow-sm relative group overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col justify-between">
            <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Eye className="w-[180px] h-[180px] text-[#570013]" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#fed488]/80 flex items-center justify-center text-[#785a1a] shadow-xs">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#775a19]">
                  OUR VISION
                </span>
              </div>
              <h2 className="font-['Playfair_Display'] text-3xl text-[#570013] font-bold">
                Our Vision
              </h2>
              <p className="text-base sm:text-lg text-[#584141] leading-relaxed text-justify">
                To build an inclusive and inspiring platform that celebrates the
                richness of Bengali literature and culture and connects it with
                audiences across generations and regions.
              </p>
            </div>
          </div>

          {/* Our Mission */}
          <div className="md:col-span-7 bg-[#800020] p-8 md:p-10 rounded-2xl text-white shadow-xl relative overflow-hidden group border border-[#570013]/20">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#ffdea5] border border-white/10 shadow-xs">
                  <Flag className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#ffdea5]">
                  OUR MISSION
                </span>
              </div>

              <h2 className="font-['Playfair_Display'] text-3xl text-[#fff8f5] font-bold">
                Our Mission
              </h2>

              <ul className="grid grid-cols-1 gap-3 text-sm sm:text-base text-white/95">
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 transition-all hover:bg-white/15">
                  <CheckCircle2 className="w-5 h-5 text-[#ffdea5] shrink-0 mt-0.5" />
                  <span className="text-justify">
                    To promote Bengali language, literature, art, and culture.
                  </span>
                </li>
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 transition-all hover:bg-white/15">
                  <CheckCircle2 className="w-5 h-5 text-[#ffdea5] shrink-0 mt-0.5" />
                  <span className="text-justify">
                    To support emerging writers, poets, artists, and performers.
                  </span>
                </li>
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 transition-all hover:bg-white/15">
                  <CheckCircle2 className="w-5 h-5 text-[#ffdea5] shrink-0 mt-0.5" />
                  <span className="text-justify">
                    To organise literary and cultural programmes.
                  </span>
                </li>
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 transition-all hover:bg-white/15">
                  <CheckCircle2 className="w-5 h-5 text-[#ffdea5] shrink-0 mt-0.5" />
                  <span className="text-justify">
                    To encourage reading, writing, creativity, and cultural
                    awareness.
                  </span>
                </li>
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 transition-all hover:bg-white/15">
                  <CheckCircle2 className="w-5 h-5 text-[#ffdea5] shrink-0 mt-0.5" />
                  <span className="text-justify">
                    To preserve Bengal’s literary and cultural heritage.
                  </span>
                </li>
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 transition-all hover:bg-white/15">
                  <CheckCircle2 className="w-5 h-5 text-[#ffdea5] shrink-0 mt-0.5" />
                  <span className="text-justify">
                    To create opportunities for collaboration among creative
                    individuals and organisations.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}