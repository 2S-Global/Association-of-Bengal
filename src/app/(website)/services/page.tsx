"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Service = { number: number; title: string; description: string };

export default function ServicesBody() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    void fetch("/api/services")
      .then(async (response) => {
        const result = await response.json();
        if (response.ok && result.success && Array.isArray(result.data)) setServices(result.data);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-4");
        }
      }),
      { threshold: 0.1 },
    );
    const elements = document.querySelectorAll("section, .grid > div");
    elements.forEach((element) => {
      element.classList.add("transition-all", "duration-700", "opacity-0", "translate-y-4");
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [services]);

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-10 lg:py-20 min-h-screen font-['Libre_Franklin']">
      {/* Hero Section */}
      <section className="mb-10 lg:mb-20 text-center">
        <div className="mb-6">
          <h1 className="text-[28px] sm:text-[32px] md:text-[44px] leading-[1.2] md:leading-[1.2] tracking-[-0.01em] md:tracking-[-0.02em] font-bold text-[#570013] font-['Playfair_Display',serif] mb-4 sm:mb-6">Our Services</h1>
          <p className="font-['Libre_Franklin'] text-base sm:text-lg text-[#584141] max-w-3xl mx-auto italic text-justify sm:text-center">The Association of Bengal for Literature and Culture is committed to strengthening the literary and cultural ecosystem through the following initiatives:</p>
        </div>
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#775a19]" />
          <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#775a19]" />
        </div>
      </section>

      {/* Services Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.number} className="bg-[#f5ece7] rounded-xl border border-[#775a19]/20 p-6 flex flex-col justify-between hover:border-[#775a19] transition-all shadow-xs">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#570013] text-white flex items-center justify-center font-bold text-sm shrink-0">{service.number}</span>
                <h3 className="font-['Playfair_Display'] text-lg text-[#570013] font-bold">{service.title}</h3>
              </div>
              <p className="text-[#584141] text-sm leading-relaxed text-justify">{service.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="mt-10 lg:mt-20 py-10 lg:py-20 px-6 lg:px-12 bg-[#e9e1dc]/30 text-center rounded-2xl border border-[#e0bfbf]">
        <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl text-[#570013] mb-6 font-semibold">Interested in our services?</h2>
        <p className="font-['Libre_Franklin'] text-base sm:text-lg text-[#584141] mb-8 max-w-xl mx-auto text-justify sm:text-center">Whether you&apos;re an individual scholar, artist, or cultural institution, we&apos;re here to support and collaborate with you.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/contactus" className="bg-[#570013] text-white px-8 py-3.5 font-semibold text-sm rounded-lg hover:bg-[#800020] transition-all shadow-md text-center">INQUIRE NOW</Link>
          <Link href="/register" className="border border-[#775a19] text-[#570013] px-8 py-3.5 font-semibold text-sm rounded-lg hover:bg-[#f5ece7] transition-all text-center">JOIN AS A MEMBER</Link>
        </div>
      </section>
    </main>
  );
}
