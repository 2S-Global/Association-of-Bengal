
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PersonalInfoStep from "../members/PersonalInfoStep";
import AadhaarStep from "../members/AadhaarStep";
import OtpStep from "../members/OtpStep";
import PhotoUploadStep from "../members/PhotoUploadStep";
import MembershipTypeStep from "../members/MembershipTypeStep";
import RegionStep from "../members/RegionStep";
import TermsStep from "../members/TermsStep";
import PaymentStep from "../members/PaymentStep";
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  BookOpen,
  Edit3,
  ShoppingBag,
  PenTool,
  Brush,
  Printer,
  Search,
  BookMarked as BookMarkedIcon,
  Layers,
  Truck,
  Palette,
  Sparkles,
  MoreHorizontal,
  User,
} from "lucide-react";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

const wings = [
  {
    id: "binders",
    name: "Binders",
    nameBn: "বাঁধাই শিল্পী",
    description: "Book Binding & Finishing",
    icon: BookOpen,
    color: "#5c3317",
    bgColor: "#f5e6d8",
  },
  {
    id: "editor",
    name: "Editor",
    nameBn: "সম্পাদক",
    description: "Editing & Content Curation",
    icon: Edit3,
    color: "#1a3a6b",
    bgColor: "#cfe0f9",
  },
  {
    id: "retail-book-seller",
    name: "Retail Book Seller",
    nameBn: "খুচরো বই বিক্রেতা",
    description: "Retail Book Trade",
    icon: ShoppingBag,
    color: "#1b5e20",
    bgColor: "#c8e6c9",
  },
  {
    id: "writer",
    name: "Writer",
    nameBn: "লেখক",
    description: "Literary Writing & Authorship",
    icon: PenTool,
    color: "#4a148c",
    bgColor: "#e1bee7",
  },
  {
    id: "illustrator",
    name: "Illustrator",
    nameBn: "অলংকরণ শিল্পী",
    description: "Illustration & Artwork",
    icon: Brush,
    color: "#e65100",
    bgColor: "#ffe0b2",
  },
  {
    id: "digital-graphic-designer",
    name: "Digital Graphic Designer",
    nameBn: "ডিজিটাল গ্রাফিক শিল্পী",
    description: "Digital Design & Graphics",
    icon: Layers,
    color: "#006064",
    bgColor: "#b2ebf2",
  },
  {
    id: "wholesale-book-distributor",
    name: "Wholesale Book Distributor",
    nameBn: "পাইকারি বই পরিবেশক",
    description: "Wholesale Book Distribution",
    icon: Truck,
    color: "#37474f",
    bgColor: "#cfd8dc",
  },
  {
    id: "publisher",
    name: "Publisher",
    nameBn: "প্রকাশক",
    description: "Book & Media Publishing",
    icon: BookOpen,
    color: "#1a3a6b",
    bgColor: "#bbdefb",
  },
  {
    id: "cover-artist",
    name: "Cover Artist",
    nameBn: "প্রচ্ছদ শিল্পী",
    description: "Book Cover Design & Art",
    icon: Palette,
    color: "#6d1f7a",
    bgColor: "#f3d6f9",
  },
  {
    id: "reader-or-consumer",
    name: "Reader or Consumer",
    nameBn: "পাঠক অথবা ভোক্তা",
    description: "Reader & Book Consumer",
    icon: User,
    color: "#0d47a1",
    bgColor: "#e3f2fd",
  },
  {
    id: "comics-artist",
    name: "Comics Artist",
    nameBn: "কমিক্স শিল্পী",
    description: "Comics & Sequential Art",
    icon: Brush,
    color: "#f57f17",
    bgColor: "#fff9c4",
  },
  {
    id: "proof-reader",
    name: "Proof Reader",
    nameBn: "বর্ণশুদ্ধি শিল্পী",
    description: "Proofreading & Quality Check",
    icon: Search,
    color: "#2e7d32",
    bgColor: "#dcedc8",
  },
  {
    id: "printing-press",
    name: "Printing Press",
    nameBn: "মুদ্রক",
    description: "Printing & Production",
    icon: Printer,
    color: "#4e342e",
    bgColor: "#efebe9",
  },
  {
    id: "composer-dtp-artist",
    name: "Composer or DTP Artist",
    nameBn: "বর্ণসংস্থাপন শিল্পী",
    description: "Typesetting & Desktop Publishing",
    icon: Edit3,
    color: "#283593",
    bgColor: "#e8eaf6",
  },
  {
    id: "employee-bookseller-publisher",
    name: "Employee of Bookseller and/or Publisher",
    nameBn: "বইয়ের দোকান কিংবা প্রকাশনায় কর্মরত ব্যক্তি",
    description: "Employed in Book Trade",
    icon: ShoppingBag,
    color: "#455a64",
    bgColor: "#eceff1",
  },
  {
    id: "poet",
    name: "Poet",
    nameBn: "কবি",
    description: "Poetry & Verse Writing",
    icon: BookMarkedIcon,
    color: "#880e4f",
    bgColor: "#fce4ec",
  },
  {
    id: "performing-artist",
    name: "Performing Artist",
    nameBn: "পারফর্মিং আর্টিস্ট",
    description: "Music, Dance & Theatre",
    icon: Sparkles,
    color: "#7a2e00",
    bgColor: "#fde4cc",
  },
  {
    id: "painter",
    name: "Painter",
    nameBn: "চিত্রশিল্পী",
    description: "Fine Arts & Canvas Painting",
    icon: Brush,
    color: "#2e5b1a",
    bgColor: "#d4f5c2",
  },
  {
    id: "others",
    name: "Others",
    nameBn: "অন্যান্য",
    description: "Other Book Trade Professionals",
    icon: MoreHorizontal,
    color: "#546e7a",
    bgColor: "#eceff1",
  },
];

const geographicWings = [
  { name: "INDIA", desc: "Central & Regional Wings", flag: "🇮🇳" },
  { name: "USA", desc: "North American Chapters", flag: "🇺🇸" },
  { name: "UK", desc: "United Kingdom Branch", flag: "🇬🇧" },
  { name: "EU", desc: "European Union Chapters", flag: "🇪🇺" },
  {
    name: "GCC Countries",
    desc: "Gulf Cooperation Council Chapters",
    flag: "🇸🇦",
  },
];

const stepsList = [
  { id: 1, title: "Personal" },
  { id: 2, title: "Photo" },
  { id: 3, title: "Type" },
  { id: 4, title: "Location" },
  { id: 5, title: "Terms" },
  { id: 6, title: "Pay" },
  { id: 7, title: "Aadhaar" },
  { id: 8, title: "OTP" },
];

export default function MembershipRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [authToken, setAuthToken] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    aadhaarNumber: "",
    otpCode: "",
    photo: null as File | null,
    photoUrl: "",
    photoPublicId: "",
    selectedCategories: [] as string[],
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
  const [otpSent, setOtpSent] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "fullName") {
      finalValue = value.replace(/[0-9]/g, "");
    }
    if (name === "aadhaarNumber") {
      finalValue = value.replace(/\D/g, "").slice(0, 12);
    }
    if (name === "otpCode") {
      finalValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
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
    if (errors.selectedCategories)
      setErrors((prev) => ({ ...prev, selectedCategories: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    }
  };

  const handleNextStep = async () => {
    const newErrors: Record<string, string> = {};
    const getActiveToken = () =>
      authToken ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      "";

    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = "Full Name is required.";
      if (!formData.mobile) newErrors.mobile = "Mobile Number is required.";
      if (!formData.email) newErrors.email = "Email Address is required.";
      if (!formData.password) newErrors.password = "Password is required.";
      if (formData.password && formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters.";
      }

      if (
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      ) {
        newErrors.confirmPassword = "Passwords do not match!";
      } else if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm Password is required.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await fetch(`${API_BASE}/auth/register-step1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName,
            mobile: formData.mobile,
            email: formData.email,
            password: formData.password,
            consent: true,
          }),
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Registration failed");

        const token = data.data?.accessToken || data.accessToken || data.token;
        if (token) {
          setAuthToken(token);
          localStorage.setItem("token", token);
          localStorage.setItem("accessToken", token);
        } else {
          throw new Error("Authentication token not received from server.");
        }
      } catch (error: any) {
        setErrors({ email: error.message || "Failed to complete step 1" });
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    if (step === 2 && formData.photo) {
      setIsSubmitting(true);
      try {
        const uploadData = new FormData();
        uploadData.append("image", formData.photo);

        const token = getActiveToken();
        const response = await fetch(`${API_BASE}/auth/upload-image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Image upload failed");

        // Properly capture photoUrl and publicId from backend response
        const imgUrl = data.data?.photoUrl || data.photoUrl || "";
        const imgPublicId = data.data?.publicId || data.publicId || "";

        setFormData((prev) => ({
          ...prev,
          photoUrl: imgUrl,
          photoPublicId: imgPublicId,
        }));
      } catch (error: any) {
        setErrors({ photo: error.message || "Failed to upload image" });
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    if (step === 3) {
      if (formData.selectedCategories.length === 0) {
        setErrors({
          selectedCategories: "Please select at least one membership type.",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const token = getActiveToken();
        const response = await fetch(`${API_BASE}/auth/addorupdatewing`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            wings: formData.selectedCategories,
            photoUrl: formData.photoUrl,
            photoPublicId: formData.photoPublicId,
          }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok)
          throw new Error(data.message || "Failed to update wings");
      } catch (error: any) {
        setErrors({ selectedCategories: error.message });
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    if (step === 4) {
      setIsSubmitting(true);
      try {
        const token = getActiveToken();
        const response = await fetch(`${API_BASE}/auth/addorupdatecountry`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            country: formData.wing,
          }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok)
          throw new Error(data.message || "Failed to update country");
      } catch (error: any) {
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    if (step === 5 && !formData.agreedToTerms) {
      setErrors({
        agreedToTerms: "You must agree to the Terms and Conditions to proceed.",
      });
      return;
    }

    if (step === 7) {
      if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
        setErrors({
          aadhaarNumber: "Please enter a valid 12-digit identification number.",
        });
        return;
      }
      setOtpSent(true);
    }

    if (step === 8) {
      if (!formData.otpCode || formData.otpCode.length < 4) {
        setErrors({
          otpCode: "Please enter the verification code sent to your mobile.",
        });
        return;
      }
      setIsSuccess(true);
      return;
    }

    setErrors({});
    setStep((prev) => Math.min(prev + 1, 8));
  };

  const handleSkipStep = () => {
    setStep((prev) => Math.min(prev + 1, 8));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl bg-white border border-[#e0bfbf] rounded-3xl shadow-xl overflow-hidden flex flex-col my-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0bfbf]/50 bg-gradient-to-r from-[#fbf2ed] via-[#fff8f5] to-[#fbf2ed]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-white border border-[#e0bfbf]/60 flex items-center justify-center overflow-hidden shadow-sm">
              <Image
                src="/images/Logo2.jpg"
                alt="Association of Bengal Logo"
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#570013] font-['Playfair_Display',serif] tracking-tight">
                ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
              </h3>
              <p className="text-[10px] text-[#775a19] uppercase tracking-wider font-semibold">
                Member Portal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-xs font-semibold text-[#8c7071] hover:text-[#570013] transition-colors cursor-pointer"
          >
            Home
          </button>
        </div>

        {/* Progress Step Bar with Hidden Scrollbars & Responsive Layout */}
        {!isSuccess && (
          <div className="px-4 py-3 bg-[#fbf2ed] border-b border-[#e0bfbf]/60 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center justify-start sm:justify-between w-max sm:w-full min-w-full px-1 gap-2">
              {stepsList.map((s, idx) => {
                const isCompleted = step > s.id;
                const isCurrent = step === s.id;
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-1.5 shrink-0 px-0.5"
                  >
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all shadow-sm ${
                        isCompleted
                          ? "bg-[#570013] text-white"
                          : isCurrent
                            ? "bg-[#775a19] text-white ring-2 ring-[#775a19]/25 scale-105"
                            : "bg-[#e9e1dc] text-[#8c7071]"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        s.id
                      )}
                    </div>
                    <span
                      className={`text-[11px] sm:text-xs font-bold transition-colors hidden md:inline-block ${
                        isCurrent ? "text-[#570013]" : "text-[#8c7071]"
                      }`}
                    >
                      {s.title}
                    </span>
                    {idx < stepsList.length - 1 && (
                      <div
                        className={`w-1.5 sm:w-3 h-[2px] mx-0.5 transition-colors ${
                          step > s.id ? "bg-[#570013]" : "bg-[#e9e1dc]"
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Page Content Body */}
        <div className="p-6 sm:p-8 bg-[#fff8f5] flex-1">
          {isSuccess ? (
            <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-[#570013]/10 text-[#570013] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-bold text-[#570013] font-['Playfair_Display',serif]">
                Registration & Verification Complete!
              </h4>
              <p className="text-sm text-[#584141] max-w-sm mx-auto leading-relaxed">
                Thank you for applying. Your payment, ID verification, and
                mobile authentication are successfully verified.
              </p>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-4 px-6 py-2.5 bg-[#570013] text-white text-sm font-semibold rounded-xl hover:bg-[#800020] transition-all shadow-md cursor-pointer"
              >
                Go to Home Page
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {step === 1 && (
                <PersonalInfoStep
                  formData={formData}
                  onChange={handleInputChange}
                  errors={errors}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                />
              )}

              {step === 2 && (
                <PhotoUploadStep
                  photo={formData.photo}
                  onFileChange={handleFileChange}
                  onSkip={handleSkipStep}
                  error={errors.photo}
                />
              )}

              {step === 3 && (
                <MembershipTypeStep
                  wings={wings}
                  selectedCategories={formData.selectedCategories}
                  onToggle={handleCategoryToggle}
                  error={errors.selectedCategories}
                />
              )}

              {step === 4 && (
                <RegionStep
                  geographicWings={geographicWings}
                  selectedWing={formData.wing}
                  onSelect={(name) =>
                    setFormData((prev) => ({ ...prev, wing: name }))
                  }
                />
              )}

              {step === 5 && (
                <TermsStep
                  apiBase={API_BASE}
                  agreedToTerms={formData.agreedToTerms}
                  onCheckboxChange={handleCheckboxChange}
                  error={errors.agreedToTerms}
                />
              )}

              {step === 6 && (
                <PaymentStep
                  apiBase={API_BASE}
                  authToken={authToken}
                  onSuccessRedirect={() => setStep(7)}
                />
              )}

              {step === 7 && (
                <AadhaarStep
                  aadhaarNumber={formData.aadhaarNumber}
                  onChange={handleInputChange}
                  error={errors.aadhaarNumber}
                  onVerified={() => {
                    setIsSuccess(true);
                  }}
                />
              )}

              {step === 8 && (
                <OtpStep
                  mobile={formData.mobile}
                  otpCode={formData.otpCode}
                  onChange={handleInputChange}
                  error={errors.otpCode}
                  onVerified={() => {
                    setIsSuccess(true);
                  }}
                />
              )}
              {/* Footer Controls */}
              {step !== 6 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#e0bfbf]/40 mt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#e0bfbf] text-[#584141] text-sm font-semibold rounded-xl hover:bg-[#fbf2ed] transition-all flex items-center justify-center gap-1.5 outline-none shadow-sm cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {step < 8 && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleNextStep}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#570013] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl hover:bg-[#800020] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 ml-auto outline-none disabled:opacity-75 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />{" "}
                          Processing...
                        </>
                      ) : (
                        <>
                          Next Step <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}

                  {step === 8 && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleNextStep}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#570013] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl hover:bg-[#800020] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 ml-auto outline-none disabled:opacity-75 cursor-pointer"
                    >
                      Verify & Complete <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="text-center pt-2">
                  <p className="text-xs text-[#584141]">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => router.push("/login")}
                      className="font-bold text-[#570013] hover:underline cursor-pointer bg-transparent border-none"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

