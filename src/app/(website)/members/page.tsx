
"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import { 
  FileCheck, 
  Users, 
  ShieldCheck, 
  PenTool, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  User, 
  Mail, 
  ChevronDown, 
  CheckCircle, 
  Loader2,
  X,
  UserPlus
} from "lucide-react";
import MembershipApplicationModal from "./MembershipApplicationModal";

// ============================================================================
// DYNAMIC DATA ARRAYS
// ============================================================================

const bentoCards = [
  {
    id: "member-portal",
    type: "featured-large",
    badge: "MEMBER BENEFITS",
    title: "Exclusive Member Portal",
    description:
      "Gain verified fellowship status. Access your digital ID card, track payment receipts, view upcoming cultural events, and participate in association elections.",
    imageSrc: "/images/shape/multipleuser.png",
  },
  {
    id: "circles",
    type: "featured-horizontal",
    title: "Apply for Membership",
    description:
      "Join our community of scholars, writers, and cultural enthusiasts to access exclusive events and archives.",
    icon: UserPlus,
  },
  {
    id: "Membership Categories",
    type: "standard",
    bgClass: "bg-[#efe6e2]",
    title: "Membership Categories",
    description: "Early-bird invitations to the Annual Heritage Festival.",
    icon: FileCheck,
  },
  {
    id: "Eligibility Criteria",
    type: "standard",
    bgClass: "bg-[#e9e1dc]",
    title: "Eligibility Criteria",
    description: "Submit your work to our biannual peer-reviewed journal.",
    icon: ShieldCheck,
  },
];

const membersData = [
  {
    id: 1,
    name: "Dr. Alok Nath Tagore",
    role: "Fellow Emeritus",
    quote: '"Preserving the rhythm of our ancestors\' ink."',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDe_QKspD1HGoYjwyOgNkoZoywIxiJQKV_d3V5x15Qf9eh4Hbqilp7gKj_CvzBI0KPQaqbjG-yw7egD3q4-ogoFQ4jJ0gcmmqZh9OUOY6tj3QkwxiQ5b7SriGqBFMEVVfnH1Bx1s1iDf9NY45Y7bjnuAA7RZMIRm575B3iime-qZVAsP61rilZQhD84Y_B75MphIRlu8E3tI8-4fsMCp53d_vp3NvHbRFiQnnYevUx4789julJ75WYK",
    tags: ["Historiography", "Medieval Poetry"],
  },
  {
    id: 2,
    name: "Sumitra Sen",
    role: "Contributing Writer",
    quote: '"Connecting global Bengali voices through digital prose."',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA---YTuPXKXgwMPMK3d1C2uvub8erz0p213ZHVDuRiemhf_NxzhY0jO02-5cw_wct4CF7t_FH3qazl4AJGydhp-EVXZYT6K6cYmf9ZfL0VU6LDN0C8LvkUEk4JeegOoSobxr8ameKY0pEXsP8NcBF83DolxERwKjxiKabhBLuLVtLLn_6yhfYkjwDgW645UeS7x-gDTDHpXuzhd2StWTALIg1jNtbA_uHu0vwwk8_aNvjF1LXRD2s4",
    tags: ["Modern Fiction", "Essays"],
  },
  {
    id: 3,
    name: "Rohan Mukherjee",
    role: "Archive Specialist",
    quote: '"Technology is the bridge to our archival heritage."',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUV6XwvaEMPmxFVWQp15JyRbLKZdb6NHOoH_2ZTkBrXXeoCMXawD3KD8XUtOhITaAf2qzlQBG9AqHsAmpn4jyeXJBL8vm1wRnNAZEa0R4n80v-53B7TUaCb_sSvd1qnFBLkoutS3BoPnsZcbhJeaf1JwzUdna6NsMQDAkXWX5RfeYdprGg5UgwTV8q-k4EMR0yvNxQXGwPbUu15wa-8cv7OCD6vtrrP4nQ1RHTGv2bwNxVItgR7RWJ",
    tags: ["Digital Curation", "Rare Books"],
  },
];

const proofData = [
  { no: "1", cat: "Bookbinder", proof: "Business/professional proof or work reference" },
  { no: "2", cat: "Comics Artist", proof: "Sample work, publication, portfolio or professional link" },
  { no: "3", cat: "Composer / DTP Artist", proof: "Sample work, portfolio, publication credit or professional proof" },
  { no: "4", cat: "Cover Artist", proof: "Published cover/sample work/portfolio" },
  { no: "5", cat: "Digital Graphic Designer", proof: "Portfolio, sample work or professional proof" },
  { no: "6", cat: "Editor", proof: "Publication credit, employer/publisher certificate or sample professional work" },
  { no: "7", cat: "Employee of Bookseller/Publisher", proof: "Employee ID, appointment letter or employer certificate" },
  { no: "8", cat: "Illustrator", proof: "Published illustration, portfolio or sample work" },
  { no: "9", cat: "Painter", proof: "Portfolio, exhibition/event proof or sample work" },
  { no: "10", cat: "Performing Artist", proof: "Performance certificate, event poster, portfolio, video/link or organisation reference" },
  { no: "11", cat: "Poet", proof: "Published work (Book Cover), Magazine contribution (Head-peace, magazine name, magazine cover and publisher name) or other literary evidence" },
  { no: "12", cat: "Printing Press / Printer", proof: "Business/professional proof (Trade license)" },
  { no: "13", cat: "Proofreader", proof: "Publisher/employer certificate, publication credit or professional reference" },
  { no: "14", cat: "Publisher", proof: "Publication details and appropriate business/publishing proof. (Trade License / Second page of any published book, where publisher's name is printed with address)" },
  { no: "15", cat: "Reader / Consumer", proof: "No professional proof required. Only identity proof." },
  { no: "16", cat: "Retail Bookseller", proof: "Shop/business/professional proof. (Municipal tax receipt / Rent receipt)" },
  { no: "17", cat: "Wholesale Book Distributor", proof: "Business/distribution proof (Municipal tax receipt / Rent receipt)" },
  { no: "18", cat: "Writer", proof: "Published work, magazine contribution, book, digital publication or other literary evidence. (Same as Poet)" }
];

const eligibilityList = [
  "Be 18 years of age or above for regular membership. A separate student/junior category can be introduced later if desired.",
  "Select the appropriate membership category.",
  "Provide valid identity and contact details.",
  "Provide reasonable proof of professional, creative, business, or cultural involvement wherever applicable.",
  "Agree to abide by the Constitution, Rules, Code of Conduct, and objectives of the Association.",
  "Pay the prescribed membership fee (if applicable).",
  "Be subject to verification and approval by the authorised Membership Committee/Admin."
];

// Sequential Categories List (1 to 18)
const categoriesList = [
  "Binder / Bookbinder",
  "Comics Artist",
  "Composer / DTP Artist",
  "Cover Artist",
  "Digital Graphic Designer",
  "Editor",
  "Employee of Bookseller and/or Publisher",
  "Illustrator",
  "Painter",
  "Performing Artist",
  "Poet",
  "Printing Press / Printer",
  "Proofreader",
  "Publisher",
  "Reader / Consumer",
  "Retail Bookseller",
  "Wholesale Book Distributor",
  "Writer"
];

// ============================================================================
// MODAL UI STRUCTURES
// ============================================================================

const modalContentData: Record<string, ReactNode> = {
  // COMBINED & COMPACT MODAL: ELIGIBILITY + CATEGORY PROOF
  "Eligibility Criteria": (
    <div className="text-[#1e1b18] space-y-8 bg-white p-4 sm:p-6 rounded-xl border border-[#e0bfbf]/40 shadow-sm">
      
      {/* SECTION 1: General Eligibility */}
      <div className="space-y-5">
        <p className="text-[15px] leading-relaxed text-[#584141]">
          Membership should be open to individuals and organisations genuinely associated with literature, books, publishing, printing, visual arts, performing arts, or cultural activities, as well as readers who support the objectives of the Association.
        </p>
        
        <div className="space-y-3">
          <p className="font-bold text-[#570013] font-['Playfair_Display',serif] text-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#775a19]"></span>
            The applicant should:
          </p>
          <ul className="space-y-2.5">
            {eligibilityList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#775a19] shrink-0 mt-0.5" />
                <span className="text-[14px] leading-relaxed text-[#584141]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#fbf2ed] text-[#584141] p-4 rounded-lg border-l-4 border-[#775a19] text-[14px]">
          <strong className="text-[#570013]">For Reader / Consumer:</strong> Professional proof should not be necessary. Valid identity proof and declaration of interest in literature and culture should be sufficient.
        </div>
      </div>

      {/* SECTION 2: Category-Specific Proof Table */}
      <div className="space-y-4 pt-4 border-t border-[#e0bfbf]/40">
        <p className="font-bold text-[#570013] font-['Playfair_Display',serif] text-lg flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#775a19]"></span>
          Category-Specific Proof
        </p>

        <div className="overflow-x-auto rounded-lg border border-[#e0bfbf]/60">
          <table className="w-full text-left border-collapse text-[14px] min-w-[500px]">
            <thead>
              <tr className="bg-[#570013] text-white">
                <th className="p-3 sm:px-4 font-semibold w-[40%]">Category</th>
                <th className="p-3 sm:px-4 font-semibold">Suggested Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0bfbf]/40">
              {proofData.map((row, index) => (
                <tr key={index} className="hover:bg-[#fbf2ed]/40 even:bg-[#fff8f5]/50 transition-colors">
                  <td className="p-3 sm:px-4 align-top">
                    <div className="flex gap-2">
                      <span className="font-bold text-[#775a19] text-xs mt-0.5 shrink-0">{row.no}.</span>
                      <span className="font-semibold text-[#570013]">{row.cat}</span>
                    </div>
                  </td>
                  <td className="p-3 sm:px-4 align-top text-[#584141]">
                    <span>{row.proof}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#fbf2ed] text-[#584141] p-4 rounded-lg border-l-4 border-[#775a19] text-[14px]">
          <strong className="text-[#570013] uppercase text-xs tracking-wider block mb-1">Important Principle</strong> 
          Do not make a published book compulsory for writers or poets. That could unfairly exclude genuine new writers. A manuscript, recognised digital publication, magazine contribution, literary activity, or other reasonable evidence can be considered.
        </div>
      </div>
    </div>
  ),

  "Membership Categories": (
    <div className="space-y-6 text-[#1e1b18]">
      <div className="flex items-center gap-3 border-b border-[#e0bfbf]/40 pb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#775a19]"></span>
        <p className="font-bold text-lg text-[#570013] font-['Playfair_Display',serif] tracking-wide">
          Membership Categories (Sequential Order)
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {categoriesList.map((cat, i) => (
          <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-[#e0bfbf]/40 bg-white hover:border-[#775a19]/40 hover:shadow-sm transition-all">
            <span className="text-xs font-bold text-[#775a19] w-6 text-right shrink-0">{i + 1}.</span>
            <span className="text-[14px] text-[#584141] font-semibold">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function MembersPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
        setIsApplyModalOpen(false);
      }
    };

    if (activeModal || isApplyModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal, isApplyModalOpen]);

  return (
    <>
      <div className="bg-[#fff8f5] text-[#1e1b18] font-['Libre_Franklin',sans-serif] min-h-screen overflow-x-hidden w-full">
        <main className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 py-10 lg:py-20 w-full">
          
          {/* Hero Section */}
          <section className="mb-12 lg:mb-20 text-center">
            <h2 className="text-[28px] sm:text-[32px] md:text-[44px] leading-[1.2] md:leading-[1.2] tracking-[-0.01em] md:tracking-[-0.02em] font-bold text-[#570013] font-['Playfair_Display',serif] mb-4 sm:mb-6">
              Our Community of Scholars
            </h2>
            <p className="max-w-2xl mx-auto text-[16px] sm:text-[18px] leading-[1.6] sm:leading-[28px] text-[#584141] opacity-80 px-4">
              Join a legacy of intellectual pursuit and cultural preservation. Our
              members are the guardians of Bengali literature and the architects
              of its future.
            </p>
          </section>

          {/* Dynamic Bento Grid */}
          <section className="mb-12 lg:mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {bentoCards.map((card) => {
                const IconComponent = card.icon;
                const isTargetCardModal = activeModal === card.title;

                if (card.type === "featured-large") {
                  return (
                    <div
                      key={card.id}
                      className="group relative overflow-hidden min-h-[320px] md:min-h-[400px] rounded-2xl p-6 sm:p-8 transition-all duration-300 col-span-1 sm:col-span-2 md:col-span-2 md:row-span-2 bg-[#fcf5f3] border border-[#e0bfbf]/60 shadow-[0_4px_15px_rgba(87,0,19,0.03)] hover:shadow-[0_12px_30px_rgba(87,0,19,0.08)] flex flex-col justify-between"
                    >
                      {/* Faded Background Watermark Icon */}
                      {card.imageSrc && (
                        <div className="absolute -right-8 -bottom-8 opacity-[0.05] pointer-events-none group-hover:opacity-[0.08] group-hover:scale-105 transition-all duration-700 ease-out">
                          <Image
                            src={card.imageSrc}
                            alt=""
                            width={280}
                            height={280}
                            className="object-contain filter-[brightness(0)_saturate(100%)_invert(8%)_sepia(87%)_saturate(5412%)_hue-rotate(339deg)_brightness(88%)_contrast(106%)]"
                          />
                        </div>
                      )}

                      {/* Top Bar: Badge & Icon */}
                      <div className="relative z-10 flex items-start justify-between">
                        {card.badge && (
                          <span className="bg-[#f8d48d] text-[#7a5c18] px-3.5 py-1.5 rounded-full text-[11px] sm:text-[12px] uppercase tracking-wider font-bold shadow-sm">
                            {card.badge}
                          </span>
                        )}
                        <div className="w-12 h-12 rounded-[14px] bg-[#ebd8d8]/60 flex items-center justify-center shrink-0 border border-[#d6bcbc]/80 group-hover:bg-[#570013] transition-colors duration-300 shadow-sm">
                          <Users className="w-6 h-6 text-[#570013] group-hover:text-white transition-colors duration-300" />
                        </div>
                      </div>

                      {/* Middle Content Area */}
                      <div className="relative z-10 my-auto py-6">
                        <h3 className="text-[24px] sm:text-[28px] leading-[1.2] font-bold text-[#570013] font-['Playfair_Display',serif] mb-3 group-hover:text-[#800020] transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-[14px] sm:text-[16px] leading-[1.6] text-[#5c4949] font-medium max-w-[92%]">
                          {card.description}
                        </p>
                      </div>

                      <div className="relative z-10"></div>
                    </div>
                  );
                }

                if (card.type === "featured-horizontal") {
                  return (
                    <div
                      key={card.id}
                      onClick={() => setIsApplyModalOpen(true)}
                      className="col-span-1 sm:col-span-2 md:col-span-2 bg-[#800020] p-6 sm:p-10 rounded-xl flex items-center justify-between group cursor-pointer transition-all duration-300 hover:shadow-[0_12px_24px_-10px_rgba(87,0,19,0.2)] hover:-translate-y-0.5 border border-[#800020]"
                    >
                      <div className="pr-4">
                        <h3 className="text-[18px] sm:text-[22px] leading-[1.2] sm:leading-[28px] font-medium text-white font-['Playfair_Display',serif] mb-2 sm:mb-1">
                          {card.title}
                        </h3>
                        <p className="text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[24px] text-white/90 mb-3">
                          {card.description}
                        </p>
                        
                        {/* Clear UX visual hint so users know it opens a form */}
                        <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] uppercase tracking-widest font-bold text-[#fed488] group-hover:text-white transition-colors">
                          Click to open form 
                          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        {IconComponent && <IconComponent className="w-6 h-6 stroke-[1.75]" />}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={card.id}
                    onClick={() => setActiveModal(card.title)}
                    className={`group ${card.bgClass} p-6 rounded-xl flex flex-col items-center justify-center text-center col-span-1 cursor-pointer transition-all duration-300 ${
                      isTargetCardModal
                        ? "ring-2 ring-[#570013] border-transparent shadow-lg scale-[0.99]"
                        : "border border-[#e0bfbf] hover:border-[#570013]/40 hover:shadow-[0_12px_24px_-10px_rgba(87,0,19,0.15)] hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-xl bg-[#570013]/5 text-[#775a19] shrink-0 border border-[#775a19]/10 group-hover:scale-110 transition-transform">
                      {IconComponent && <IconComponent className="w-6 h-6 stroke-[1.75]" />}
                    </div>
                    <h4 className="text-[18px] sm:text-[20px] leading-[1.3] font-medium text-[#570013] font-['Playfair_Display',serif]">
                      {card.title}
                    </h4>
                    <p className="text-[12px] leading-[16px] text-[#584141] mt-2 opacity-90">
                      {card.description}
                    </p>
                    <span className="mt-3 text-[11px] uppercase tracking-wider font-semibold text-[#775a19] opacity-80 group-hover:opacity-100 transition-opacity">
                      Click to expand →
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="relative flex items-center justify-center w-full my-10 before:content-[''] before:flex-1 before:h-[1px] before:bg-[#8c7071] before:opacity-30 after:content-[''] after:flex-1 after:h-[1px] after:bg-[#8c7071] after:opacity-30">
            <PenTool className="px-4 text-[#775a19] w-10 h-6 box-content" />
          </div>

          {/* Member Directory */}
          <section className="mb-12 lg:mb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
              <div>
                <h2 className="text-[24px] sm:text-[28px] md:text-[32px] leading-[1.2] sm:leading-[38px] font-semibold text-[#570013] font-['Playfair_Display',serif] mb-2 sm:mb-1">
                  Member Spotlight
                </h2>
                <p className="text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[24px] text-[#584141]">
                  Celebrating our most dedicated contributors and fellows.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  className="p-2 sm:p-3 border border-[#8c7071] rounded-full hover:bg-[#e9e1dc] transition-colors focus:ring-2 focus:ring-[#570013] outline-none flex items-center justify-center"
                  aria-label="Previous Members"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  className="p-2 sm:p-3 border border-[#8c7071] rounded-full hover:bg-[#e9e1dc] transition-colors focus:ring-2 focus:ring-[#570013] outline-none flex items-center justify-center"
                  aria-label="Next Members"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {membersData.map((member) => (
                <div
                  key={member.id}
                  className="border border-[#e0bfbf] rounded-lg p-2 bg-[#fff8f5] shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="h-56 sm:h-64 overflow-hidden mb-4 sm:mb-6 rounded-lg relative shrink-0">
                    <Image
                      fill
                      className="w-full h-full object-cover"
                      alt={member.name}
                      src={member.image}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-2 flex-grow flex flex-col">
                    <span className="text-[12px] sm:text-[14px] leading-[20px] font-semibold text-[#775a19] uppercase tracking-[0.05em] mb-1 block">
                      {member.role}
                    </span>
                    <h3 className="text-[18px] sm:text-[22px] leading-[1.2] sm:leading-[28px] font-medium text-[#570013] font-['Playfair_Display',serif] mb-2 sm:mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[24px] text-[#584141] italic mb-4 sm:mb-6 flex-grow">
                      {member.quote}
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-1 mt-auto">
                      {member.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#fbf2ed] text-[#775a19] px-2 py-1 rounded text-[11px] sm:text-[12px] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Modal Window */}
        {activeModal && (
          <div 
            onClick={() => setActiveModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1b18]/60 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl shadow-[0_20px_50px_-12px_rgba(87,0,19,0.25)] w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] cursor-default animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
            >
              <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-[#e0bfbf]/50 bg-gradient-to-r from-[#fbf2ed] to-[#fff8f5]">
                <h3 className="text-[22px] sm:text-[26px] font-bold text-[#570013] font-['Playfair_Display',serif] tracking-tight">
                  {activeModal}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-full text-[#8c7071] bg-white/50 hover:bg-[#e9e1dc] hover:text-[#570013] transition-all duration-200 outline-none"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar bg-[#fff8f5]">
                {modalContentData[activeModal] || (
                  <p className="text-[#584141] text-center italic py-8">No additional details available.</p>
                )}
              </div>

              <div className="px-6 sm:px-8 py-4 border-t border-[#e0bfbf]/50 bg-white/40 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 bg-[#570013] text-white text-[13px] tracking-[0.03em] font-semibold rounded-lg hover:bg-[#800020] transition-all"
                >
                  Acknowledge & Close
                </button>
              </div>
            </div>
          </div>
        )}

        <MembershipApplicationModal 
          isOpen={isApplyModalOpen} 
          onClose={() => setIsApplyModalOpen(false)} 
        />
      </div>
    </>
  );
}