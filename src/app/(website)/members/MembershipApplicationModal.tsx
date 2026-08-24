
"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  CheckCircle2,
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Layers,
  Check,
  ShieldCheck,
  FileText,
  BookOpen,
  Edit3,
  ShoppingBag,
  PenTool,
  Brush,
  Printer,
  Search,
  BookMarked,
  Heart,
  CreditCard,
} from "lucide-react";

interface MembershipApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoriesList = [
  { name: "Binder / Bookbinder", bengali: "বাঁধাই শিল্পী", desc: "Book Binding & Finishing", icon: BookOpen, color: "bg-[#faecd8]" },
  { name: "Comics Artist", bengali: "কমিক্স শিল্পী", desc: "Sequential Art & Illustration", icon: PenTool, color: "bg-[#e2edf8]" },
  { name: "Composer / DTP Artist", bengali: "কম্পোজার / ডিটিপি শিল্পী", desc: "Typesetting & Digital Layout", icon: Edit3, color: "bg-[#e3f4e8]" },
  { name: "Cover Artist", bengali: "প্রচ্ছদ শিল্পী", desc: "Book Cover Design & Art", icon: Brush, color: "bg-[#fae2e2]" },
  { name: "Digital Graphic Designer", bengali: "ডিজিটাল গ্রাফিক ডিজাইনার", desc: "Digital Media & Visuals", icon: Layers, color: "bg-[#eae2f8]" },
  { name: "Editor", bengali: "সম্পাদক", desc: "Editing & Content Curation", icon: Edit3, color: "bg-[#e2edf8]" },
  { name: "Employee of Bookseller and/or Publisher", bengali: "বই বিক্রেতা বা প্রকাশকের কর্মী", desc: "Publishing & Bookstore Staff", icon: ShoppingBag, color: "bg-[#f8f2e2]" },
  { name: "Illustrator", bengali: "চিত্রকর", desc: "Published Illustration & Portfolio", icon: Brush, color: "bg-[#e3f4e8]" },
  { name: "Painter", bengali: "চিত্রশিল্পী", desc: "Fine Arts & Exhibition Work", icon: Brush, color: "bg-[#faecd8]" },
  { name: "Performing Artist", bengali: "পরিবেশন শিল্পী", desc: "Stage, Theatre & Performance", icon: User, color: "bg-[#fae2e2]" },
  { name: "Poet", bengali: "কবি", desc: "Literary Verse & Poetry", icon: BookMarked, color: "bg-[#eae2f8]" },
  { name: "Printing Press / Printer", bengali: "প্রিন্টিং প্রেস / মুদ্রক", desc: "Trade License & Press Work", icon: Printer, color: "bg-[#e2edf8]" },
  { name: "Proofreader", bengali: "প্রুফরিডার", desc: "Text Verification & Correction", icon: Search, color: "bg-[#e3f4e8]" },
  { name: "Publisher", bengali: "প্রকাশক", desc: "Book Publishing & Distribution", icon: BookOpen, color: "bg-[#faecd8]" },
  { name: "Reader / Consumer", bengali: "পাঠক / ভোক্তা", desc: "Culture & Literature Enthusiast", icon: User, color: "bg-[#eef8e2]" },
  { name: "Retail Bookseller", bengali: "খুচরো বই বিক্রেতা", desc: "Retail Book Trade", icon: ShoppingBag, color: "bg-[#e3f4e8]" },
  { name: "Wholesale Book Distributor", bengali: "পাইকারি বই পরিবেশক", desc: "Book Distribution & Wholesale", icon: ShoppingBag, color: "bg-[#faecd8]" },
  { name: "Writer", bengali: "লেখক", desc: "Literary Writing & Authorship", icon: PenTool, color: "bg-[#eae2f8]" },
];

const termsContent = [
  {
    id: "membership-agreement",
    icon: CheckCircle2,
    title: "Membership Agreement",
    paragraphs: [
      "By registering as a member of the Association of Bengal for Literature and Culture, I affirm my commitment to promoting and preserving Bengali literature, language, art, heritage, and cultural traditions.",
      "I agree to uphold the values and objectives of the Association, participate respectfully in its literary and cultural activities, and contribute positively to the growth and enrichment of Bengal's cultural heritage."
    ]
  },
  {
    id: "privacy-policy",
    icon: ShieldCheck,
    title: "Data Privacy Policy",
    paragraphs: [
      "Your privacy is important to us. The Association of Bengal for Literature and Culture may collect personal information for membership registration, verification, communication, event participation, and issuing membership identification.",
      "Personal information will be handled responsibly and used only for legitimate Association-related purposes. By proceeding with registration, you consent to the collection, storage, and processing of your information in accordance with applicable privacy and data protection requirements."
    ]
  },
  {
    id: "code-of-conduct",
    icon: FileText,
    title: "Code of Conduct",
    paragraphs: [
      "Members are expected to maintain respectful, ethical, and responsible conduct while participating in the activities of the Association. Any behaviour that seriously harms the reputation, objectives, or cultural values of the Association may result in suspension or termination of membership."
    ],
    bullets: [
      "Maintain respect and decorum during literary and cultural programmes.",
      "Encourage constructive discussion and respectful exchange of ideas.",
      "Respect fellow members, artists, writers, performers, and cultural contributors.",
      "Support the preservation and promotion of Bengali literature, language, art, and heritage.",
      "Follow the rules, guidelines, and decisions established by the Association."
    ]
  }
];

const geographicWings = [
  { name: "INDIA", desc: "Central & Regional Wings", flag: "🇮🇳" },
  { name: "USA", desc: "North American Chapters", flag: "🇺🇸" },
  { name: "UK", desc: "United Kingdom Branch", flag: "🇬🇧" },
  { name: "EU", desc: "European Union Chapters", flag: "🇪🇺" },
  { name: "GCC Countries", desc: "Gulf Cooperation Council Chapters", flag: "🇸🇦" },
];

const stepsList = [
  { id: 1, title: "Personal" },
  { id: 2, title: "Photo" },
  { id: 3, title: "Type" },
  { id: 4, title: "Location" },
  { id: 5, title: "Terms" },
  { id: 6, title: "Pay" },
];

export default function MembershipApplicationModal({
  isOpen,
  onClose,
}: MembershipApplicationModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: null as File | null,
    selectedCategories: [] as string[], // Removed default value
    agreedToTerms: false,
    wing: geographicWings[0].name,
    contribution: "0",
    baseFee: 1000.0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    
    // Prevent numbers in fullName input
    let finalValue = value;
    if (name === "fullName") {
      finalValue = value.replace(/[0-9]/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    
    // Clear specific error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategoryToggle = (categoryName: string) => {
    setFormData((prev) => {
      const exists = prev.selectedCategories.includes(categoryName);
      if (exists) {
        return {
          ...prev,
          selectedCategories: prev.selectedCategories.filter(
            (c) => c !== categoryName,
          ),
        };
      } else {
        return {
          ...prev,
          selectedCategories: [...prev.selectedCategories, categoryName],
        };
      }
    });
    if (errors.selectedCategories) setErrors((prev) => ({ ...prev, selectedCategories: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    }
  };

  const handleNextStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = "Full Name is required.";
      if (!formData.mobile) newErrors.mobile = "Mobile Number is required.";
      if (!formData.email) newErrors.email = "Email Address is required.";
      if (!formData.password) newErrors.password = "Password is required.";
      
      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match!";
      } else if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm Password is required.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    
    if (step === 3 && formData.selectedCategories.length === 0) {
      setErrors({ selectedCategories: "Please select at least one membership type." });
      return;
    }
    
    if (step === 5 && !formData.agreedToTerms) {
      setErrors({ agreedToTerms: "You must agree to the Terms and Conditions to proceed." });
      return;
    }
    
    setErrors({});
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const handleSkipStep = () => {
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 6) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Submission failed");

      setIsSuccess(true);
    } catch (error) {
      // Handle error gracefully
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount =
    formData.baseFee + (parseFloat(formData.contribution) || 0);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#1e1b18]/75 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl shadow-[0_25px_60px_-15px_rgba(87,0,19,0.3)] w-full max-w-xl overflow-hidden flex flex-col my-auto max-h-[92vh] sm:max-h-[88vh] cursor-default animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#e0bfbf]/50 bg-gradient-to-r from-[#fbf2ed] via-[#fff8f5] to-[#fbf2ed] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white border border-[#e0bfbf]/60 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
              <Image
                src="/images/Logo2.jpg"
                alt="Association of Bengal Logo"
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-[11px] sm:text-[13px] font-bold text-[#570013] font-['Playfair_Display',serif] tracking-tight leading-tight truncate">
                ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
              </h3>
              <p className="text-[9px] sm:text-[10px] text-[#775a19] uppercase tracking-wider font-semibold">
                Membership Registration Portal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full text-[#8c7071] bg-white/70 hover:bg-[#e9e1dc] hover:text-[#570013] transition-all duration-200 outline-none shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Progress Step Bar */}
        {!isSuccess && (
          <div className="px-2 sm:px-4 py-2.5 sm:py-3 bg-[#fbf2ed] border-b border-[#e0bfbf]/60 flex items-center justify-between shadow-inner shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {stepsList.map((s, idx) => {
              const isCompleted = step > s.id;
              const isCurrent = step === s.id;
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-1 shrink-0 px-1"
                >
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all shadow-sm ${
                      isCompleted
                        ? "bg-[#570013] text-white"
                        : isCurrent
                          ? "bg-[#775a19] text-white ring-3 ring-[#775a19]/25 scale-105"
                          : "bg-[#e9e1dc] text-[#8c7071]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                    ) : (
                      s.id
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold transition-colors hidden xs:inline-block sm:inline-block ${isCurrent ? "text-[#570013]" : "text-[#8c7071]"}`}
                  >
                    {s.title}
                  </span>
                  {idx < stepsList.length - 1 && (
                    <div
                      className={`w-2 sm:w-3 h-[2px] mx-0.5 sm:mx-1 transition-colors ${step > s.id ? "bg-[#570013]" : "bg-[#e9e1dc]"}`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#e0bfbf] [&::-webkit-scrollbar-thumb]:rounded-full bg-[#fff8f5]">
          {isSuccess ? (
            <div className="text-center py-8 sm:py-12 space-y-3 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-[#570013]/10 text-[#570013] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#570013] font-['Playfair_Display',serif]">
                Application Submitted!
              </h4>
              <p className="text-[13px] sm:text-[14px] text-[#584141] max-w-sm mx-auto leading-relaxed">
                Thank you for applying. Your registration and payment details
                are under review.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setStep(1);
                  onClose();
                }}
                className="mt-4 px-6 py-2.5 bg-[#570013] text-white text-[13px] font-semibold rounded-xl hover:bg-[#800020] transition-all shadow-md"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              className="space-y-4"
            >
              {step === 1 && (
                <div className="space-y-3.5 sm:space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#570013]">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full legal name"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30 shadow-sm"
                        required
                      />
                    </div>
                    {errors.fullName && <p className="text-[11px] text-red-500">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#570013]">
                      Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30 shadow-sm"
                        required
                      />
                    </div>
                    {errors.mobile && <p className="text-[11px] text-red-500">{errors.mobile}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#570013]">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30 shadow-sm"
                        required
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#570013]">
                      Password <span className="text-red-600">*</span>
                    </label>

                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30 shadow-sm"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c7071] hover:text-[#570013] transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="text-[11px] text-red-500">{errors.password}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#570013]">
                      Confirm Password <span className="text-red-600">*</span>
                    </label>

                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />

                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30 shadow-sm"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c7071] hover:text-[#570013] transition-colors"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-[11px] text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300 py-2 sm:py-4 text-center">
                  <div className="space-y-1 text-left">
                    <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
                      Upload Profile Photograph
                    </h4>
                    <p className="text-[12px] sm:text-[13px] text-[#584141]">
                      Please upload a clear passport-size photograph for your
                      verified digital ID card, or skip to complete it later.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#e0bfbf] hover:border-[#570013] rounded-2xl p-6 sm:p-10 bg-white/75 cursor-pointer transition-all group shadow-sm">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fbf2ed] flex items-center justify-center text-[#775a19] group-hover:scale-110 transition-transform mb-3 shadow-inner">
                        <Upload className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <p className="text-[13px] sm:text-[14px] font-semibold text-[#570013] text-center px-2">
                        {formData.photo
                          ? formData.photo.name
                          : "Click to browse or drag photo here"}
                      </p>
                      <p className="text-[11px] text-[#8c7071] mt-1">
                        SVG, PNG, JPG or WEBP (Max 5MB)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handleSkipStep}
                      className="text-[12px] font-semibold text-[#775a19] hover:underline"
                    >
                      Skip for now →
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
                      Choose Your Membership Type
                    </h4>
                    <p className="text-[12px] text-[#584141]">
                      You can select{" "}
                      <span className="font-semibold text-[#775a19]">
                        multiple types
                      </span>{" "}
                      that best describe your role.
                    </p>
                    {errors.selectedCategories && <p className="text-[11px] text-red-500 font-medium">{errors.selectedCategories}</p>}
                  </div>

                  <div className="space-y-2.5 max-h-[280px] sm:max-h-[320px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#e0bfbf] [&::-webkit-scrollbar-thumb]:rounded-full pr-1.5">
                    {categoriesList.map((cat, idx) => {
                      const isSelected = formData.selectedCategories.includes(
                        cat.name,
                      );
                      const IconComp = cat.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleCategoryToggle(cat.name)}
                          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                            isSelected
                              ? "border-[#570013] bg-[#fbf2ed] ring-1 ring-[#570013]/30"
                              : "border-[#e0bfbf]/70 bg-white hover:border-[#775a19]/50"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${cat.color} flex items-center justify-center text-[#570013] shrink-0 shadow-sm`}
                            >
                              <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-bold text-[#570013] text-[13px] sm:text-[14px] truncate">
                                {cat.name}
                              </h5>
                              <p className="text-[11px] sm:text-[12px] font-medium text-[#775a19] truncate">
                                {cat.bengali}
                              </p>
                              <p className="text-[10px] sm:text-[11px] text-[#584141] opacity-90 truncate">
                                {cat.desc}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                              isSelected
                                ? "bg-[#570013] border-[#570013] text-white"
                                : "border-[#e0bfbf] bg-white"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
                      Select Your Region
                    </h4>
                    <p className="text-[12px] text-[#584141]">
                      Choose the geographic wing you belong to for accurate
                      registration.
                    </p>
                  </div>

                  <div className="space-y-3 max-h-[280px] sm:max-h-[320px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#e0bfbf] [&::-webkit-scrollbar-thumb]:rounded-full pr-1.5">
                    {geographicWings.map((w, idx) => {
                      const isSelected = formData.wing === w.name;
                      return (
                        <div
                          key={idx}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, wing: w.name }))
                          }
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                            isSelected
                              ? "border-[#570013] bg-[#fbf2ed] ring-1 ring-[#570013]/20"
                              : "border-[#e0bfbf]/70 bg-white hover:border-[#775a19]/40"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <span className="text-2xl sm:text-3xl shrink-0">
                              {w.flag}
                            </span>
                            <div className="min-w-0">
                              <h5 className="font-bold text-[#570013] text-[13px] sm:text-[14px] truncate">
                                {w.name}
                              </h5>
                              <p className="text-[11px] sm:text-[12px] text-[#775a19] truncate">
                                {w.desc}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "border-[#570013] bg-[#570013]" : "border-[#e0bfbf]"}`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1 text-center">
                    <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
                      Membership Registration Terms & Conditions
                    </h4>
                    <p className="text-[12px] text-[#584141]">
                      Please review our policies and agreements before
                      proceeding.
                    </p>
                  </div>

                  <div className="space-y-3.5 max-h-[240px] sm:max-h-[280px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#e0bfbf] [&::-webkit-scrollbar-thumb]:rounded-full pr-1.5">
                    {/* Dynamic Content Mapping */}
                    {termsContent.map((term) => (
                      <div
                        key={term.id}
                        className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e0bfbf]/70 shadow-sm space-y-2"
                      >
                        <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px]">
                          <term.icon className="w-4 h-4 text-[#775a19] shrink-0" />
                          <span>{term.title}</span>
                        </div>

                        {term.paragraphs.map((text, index) => (
                          <p
                            key={index}
                            className="text-[12px] text-[#584141] leading-relaxed"
                          >
                            {text}
                          </p>
                        ))}

                        {/* Render bullets only if they exist in the object */}
                        {term.bullets && (
                          <ul className="list-disc pl-5 text-[12px] text-[#584141] space-y-1">
                            {term.bullets.map((bullet, index) => (
                              <li key={index}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-start gap-3 cursor-pointer pt-2 bg-[#fbf2ed] p-3 rounded-xl border border-[#e0bfbf] shadow-sm">
                      <input
                        type="checkbox"
                        name="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 mt-0.5 rounded border-[#e0bfbf] text-[#570013] focus:ring-[#570013] shrink-0"
                      />
                      <span className="text-[11px] sm:text-[12px] text-[#570013] font-bold leading-tight">
                        I agree to the Membership Terms, Privacy Policy, and Code
                        of Conduct. <span className="text-red-600">*</span>
                      </span>
                    </label>
                    {errors.agreedToTerms && <p className="text-[11px] text-red-500 font-medium pl-1">{errors.agreedToTerms}</p>}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-3.5 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <h4 className="text-base sm:text-lg font-bold text-[#570013] font-['Playfair_Display',serif]">
                      Finalize Payment
                    </h4>
                    <p className="text-[12px] text-[#584141]">
                      Review your fees and select a secure payment option.
                    </p>
                  </div>

                  {/* Fee Summary Card */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e0bfbf]/80 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px] sm:text-[14px] border-b border-[#e0bfbf]/40 pb-2">
                      <FileText className="w-4 h-4 text-[#775a19]" />
                      <span>Fee Summary</span>
                    </div>
                    <div className="flex justify-between text-[12px] sm:text-[13px] text-[#584141]">
                      <span>Membership Fee (DEFAULT)</span>
                      <span className="font-semibold text-[#1e1b18]">
                        ₹{formData.baseFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-[#e0bfbf]/40 pt-2 flex justify-between text-[13px] sm:text-[14px] font-bold text-[#570013]">
                      <span>Total</span>
                      <span className="text-[#775a19]">
                        ₹{totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Contribution Card */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e0bfbf]/80 shadow-sm space-y-1.5">
                    <div className="flex items-center gap-2 text-[#570013] font-bold text-[13px]">
                      <Heart className="w-4 h-4 text-red-600 fill-red-600" />
                      <span>Contribution (Optional)</span>
                    </div>
                    <p className="text-[11px] text-[#584141]">
                      Support upcoming national development initiatives.
                    </p>
                    <div className="relative pt-1">
                      <span className="absolute left-3.5 top-4 text-[#8c7071] font-semibold text-[14px]">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="contribution"
                        value={formData.contribution}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-2 sm:py-2.5 bg-white border border-[#e0bfbf] rounded-xl text-[13px] text-[#1e1b18] focus:outline-none focus:ring-2 focus:ring-[#570013]/30"
                      />
                    </div>
                  </div>

                  {/* Secure Payment Methods */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#775a19]">
                      Secure Payment Methods
                    </p>

                    {/* PayPal Button */}
                    <button
                      type="button"
                      className="w-full py-2.5 sm:py-3 px-4 bg-[#003087] hover:bg-[#002060] text-white rounded-xl font-semibold flex items-center justify-between shadow-sm transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="bg-[#ffc439] text-[#003087] font-extrabold px-2 py-0.5 rounded text-[11px] sm:text-[12px]">
                          PayPal
                        </span>
                        <span className="text-[12px] sm:text-[13px]">
                          Pay with PayPal
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Stripe Button */}
                    <button
                      type="button"
                      className="w-full py-2.5 sm:py-3 px-4 bg-[#635bff] hover:bg-[#5147e5] text-white rounded-xl font-semibold flex items-center justify-between shadow-sm transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-white" />
                        <span className="text-[12px] sm:text-[13px]">
                          Pay with Stripe (Credit / Debit Card)
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Footer Controls */}
              <div className="flex items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-[#e0bfbf]/40 mt-4 shrink-0">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 sm:px-5 py-2.5 bg-white border border-[#e0bfbf] text-[#584141] text-[12px] sm:text-[13px] font-semibold rounded-xl hover:bg-[#fbf2ed] transition-all flex items-center gap-1.5 outline-none shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 6 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-5 sm:px-6 py-2.5 bg-[#570013] text-white text-[12px] sm:text-[13px] font-semibold tracking-wider uppercase rounded-xl hover:bg-[#800020] transition-all shadow-md active:scale-95 flex items-center gap-1.5 ml-auto outline-none"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 sm:px-6 py-2.5 bg-[#570013] text-white text-[12px] sm:text-[13px] font-semibold tracking-wider uppercase rounded-xl hover:bg-[#800020] transition-all shadow-md active:scale-95 flex items-center gap-2 ml-auto outline-none disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      "Confirm & Submit Application"
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}