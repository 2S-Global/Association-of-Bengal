"use client";

import { useEffect, useState } from "react";
import { Edit3, FileText, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import HeroSectionForm, {
  HeroSection,
} from "@/components/admin/hero-section/HeroSectionForm";

export default function ManageHeroSectionPage() {
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("Loading Hero Section…");

  useEffect(() => {
    void fetch("/api/hero-section?admin=true")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success)
          throw new Error(result.message || "Unable to load Hero Section.");
        setHeroSection(result.data);
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unable to load Hero Section.";
        setMessage(errorMessage);
        toast.error(errorMessage);
      });
  }, []);

  return (
    <main className="mx-auto max-w-7xl space-y-6 pb-20 animate-in fade-in duration-300">
      <div className="rounded-3xl border border-[#e0bfbf]/70 bg-gradient-to-r from-white via-[#fff8f5] to-[#fef2eb] p-7 shadow-sm sm:p-8">
        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#775a19]">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" /> CMS Administration
        </span>
        <h1 className="mt-1 flex items-center gap-2.5 font-['Playfair_Display'] text-xl font-bold text-[#570013] sm:text-2xl">
          <Sparkles className="h-6 w-6 text-amber-600" /> Manage Hero Section
        </h1>
        <p className="mt-1 text-xs text-[#564242]">
          Review and update the singleton hero content displayed on the
          association website.
        </p>
      </div>

      {!heroSection ? (
        <div className="flex items-center justify-center gap-3 rounded-3xl border border-[#e0bfbf]/60 bg-white p-12 text-sm text-[#725b55] shadow-sm">
          <Loader2
            className={
              message.startsWith("Loading")
                ? "h-5 w-5 animate-spin text-[#570013]"
                : "hidden"
            }
          />
          {message}
        </div>
      ) : editing ? (
        <HeroSectionForm
          heroSection={heroSection}
          onCancel={() => setEditing(false)}
          onSaved={(updatedHero) => {
            setHeroSection(updatedHero);
            setEditing(false);
          }}
        />
      ) : (
        <section className="overflow-hidden rounded-3xl border border-[#e0bfbf]/60 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#eadbd5] bg-[#fffdfc] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <span className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#775a19]">
                <FileText className="h-3.5 w-3.5" /> Website Homepage
              </span>
              <h2 className="mt-1 font-['Playfair_Display'] text-xl font-bold text-[#570013]">
                Hero Section Content
              </h2>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#570013] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#40000e] active:scale-[0.98]"
            >
              <Edit3 className="h-4 w-4" /> Edit Hero Section
            </button>
          </div>
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#775a19]">
                  Badge
                </p>
                <p className="mt-1 text-sm font-bold text-[#570013]">
                  {heroSection.badgeText}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#775a19]">
                  Welcome Title
                </p>
                <p className="mt-1 font-['Playfair_Display'] text-lg font-bold text-[#570013]">
                  {heroSection.welcomeTitle}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#775a19]">
                  Tagline
                </p>
                <p className="mt-1 text-sm italic text-[#775a19]">
                  {heroSection.tagline}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#775a19]">
                  Headline
                </p>
                <p className="mt-1 font-['Playfair_Display'] text-xl font-bold text-[#570013]">
                  {heroSection.headline}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#775a19]">
                  Description
                </p>
                <p className="mt-1 text-sm leading-6 text-[#65504b]">
                  {heroSection.description}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-[#eadbd5] bg-gradient-to-br from-[#fff9f6] to-[#fff1e9] p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#775a19]">
                Hero Statistics
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white bg-white/80 px-4 py-3">
                  <p className="text-xs font-medium text-[#725b55]">
                    Events Planned
                  </p>
                  <p className="mt-1 font-['Playfair_Display'] text-2xl font-bold text-[#570013]">
                    {heroSection.eventsPlanned}
                  </p>
                </div>
                <div className="rounded-xl border border-white bg-white/80 px-4 py-3">
                  <p className="text-xs font-medium text-[#725b55]">
                    Registered Members
                  </p>
                  <p className="mt-1 font-['Playfair_Display'] text-2xl font-bold text-[#570013]">
                    {heroSection.registeredMembers.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-white bg-white/80 px-4 py-3">
                  <p className="text-xs font-medium text-[#725b55]">
                    Indian Cities
                  </p>
                  <p className="mt-1 font-['Playfair_Display'] text-2xl font-bold text-[#570013]">
                    {heroSection.indianCities}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
