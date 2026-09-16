"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export type HeroSection = {
  _id: string;
  badgeText: string;
  welcomeTitle: string;
  tagline: string;
  headline: string;
  description: string;
  heroImage: string;
  eventsPlanned: number;
  registeredMembers: number;
  indianCities: number;
  isActive: boolean;
};

type EditableField = "badgeText" | "welcomeTitle" | "tagline" | "headline" | "description" | "eventsPlanned" | "registeredMembers" | "indianCities";

export default function HeroSectionForm({ heroSection, onCancel, onSaved }: { heroSection: HeroSection; onCancel: () => void; onSaved: (heroSection: HeroSection) => void }) {
  const [form, setForm] = useState(heroSection);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = <K extends EditableField>(key: K, value: HeroSection[K]) => setForm((current) => ({ ...current, [key]: value }));

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (![form.badgeText, form.welcomeTitle, form.tagline, form.headline, form.description].every((value) => value.trim())) {
      setError("Please complete all text fields.");
      return;
    }
    if (![form.eventsPlanned, form.registeredMembers, form.indianCities].every((value) => Number.isInteger(value) && value >= 0)) {
      setError("Statistics must be whole numbers greater than or equal to zero.");
      return;
    }
    setSaving(true);
    try {
      const data = new FormData();
      data.append("badgeText", form.badgeText);
      data.append("welcomeTitle", form.welcomeTitle);
      data.append("tagline", form.tagline);
      data.append("headline", form.headline);
      data.append("description", form.description);
      data.append("eventsPlanned", String(form.eventsPlanned));
      data.append("registeredMembers", String(form.registeredMembers));
      data.append("indianCities", String(form.indianCities));
      const response = await fetch("/api/hero-section", { method: "PUT", body: data });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to update Hero Section.");
      toast.success(result.message);
      onSaved(result.data);
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to update Hero Section.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const input = (label: string, field: "badgeText" | "welcomeTitle" | "tagline" | "headline") => <label className="block"><span className="mb-2 block text-xs font-bold text-[#570013]">{label} <span className="text-red-600">*</span></span><input required value={form[field]} onChange={(event) => update(field, event.target.value)} className="h-11 w-full rounded-xl border border-[#e5d7d2] bg-[#fffdfc] px-3.5 text-sm text-[#342222] shadow-sm outline-none transition focus:border-[#570013] focus:ring-4 focus:ring-[#570013]/10" /></label>;
  const statistic = (label: string, field: "eventsPlanned" | "registeredMembers" | "indianCities") => <label className="block"><span className="mb-2 block text-xs font-bold text-[#570013]">{label} <span className="text-red-600">*</span></span><input required min={0} type="number" value={form[field]} onChange={(event) => update(field, Number(event.target.value))} className="h-11 w-full rounded-xl border border-[#e5d7d2] bg-[#fffdfc] px-3.5 text-sm text-[#342222] shadow-sm outline-none transition focus:border-[#570013] focus:ring-4 focus:ring-[#570013]/10" /></label>;

  return <form onSubmit={save} className="mt-6 overflow-hidden rounded-3xl border border-[#e0bfbf]/70 bg-white shadow-sm">
    <div className="border-b border-[#eadbd5] bg-gradient-to-r from-[#fffdfc] to-[#fff7f3] px-6 py-5 sm:px-8"><h2 className="font-['Playfair_Display'] text-xl font-bold text-[#570013]">Edit Hero Section</h2><p className="mt-1 text-xs text-[#6d5550]">Update the text and statistics displayed on the public website.</p></div>
    <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 sm:p-8">{input("Badge Text", "badgeText")}{input("Welcome Title", "welcomeTitle")}{input("Tagline", "tagline")}{input("Headline", "headline")}
      <label className="block sm:col-span-2"><span className="mb-2 block text-xs font-bold text-[#570013]">Description <span className="text-red-600">*</span></span><textarea required rows={5} value={form.description} onChange={(event) => update("description", event.target.value)} className="w-full resize-y rounded-xl border border-[#e5d7d2] bg-[#fffdfc] px-3.5 py-3 text-sm text-[#342222] shadow-sm outline-none transition focus:border-[#570013] focus:ring-4 focus:ring-[#570013]/10" /></label>
      <div className="sm:col-span-2"><div className="mb-4 flex items-center gap-3"><span className="h-px flex-1 bg-[#eadbd5]" /><span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#775a19]">Hero Statistics</span><span className="h-px flex-1 bg-[#eadbd5]" /></div><div className="grid grid-cols-1 gap-5 sm:grid-cols-3">{statistic("Events Planned", "eventsPlanned")}{statistic("Registered Members", "registeredMembers")}{statistic("Indian Cities", "indianCities")}</div></div>
      {error && <p role="alert" className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
    <div className="flex flex-col-reverse gap-3 border-t border-[#eadbd5] bg-[#fffdfc] px-6 py-5 sm:flex-row sm:justify-between sm:px-8"><button type="button" onClick={onCancel} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8c3ba] px-5 py-2.5 text-sm font-bold text-[#684b45] transition hover:bg-[#fff4ef] disabled:opacity-50"><ArrowLeft className="h-4 w-4" /> Back to overview</button><button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#570013] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#40000e] disabled:cursor-not-allowed disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes</button></div>
  </form>;
}
