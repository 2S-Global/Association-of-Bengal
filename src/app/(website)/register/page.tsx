
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PersonalInfoStep from "../members/PersonalInfoStep";
import PhotoUploadStep from "../members/PhotoUploadStep";
import MembershipTypeStep from "../members/MembershipTypeStep";
import RegionStep from "../members/RegionStep";
import KycVerificationStep from "../members/KycStep";
import PaymentStep from "../members/PaymentStep";
import VerificationStep from "../members/VerificationStep";
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

// Fallback list if geographic options need local display reference
const defaultGeographicWings = [
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
  { id: 5, title: "KYC Setup" },
  { id: 6, title: "Payment" },
  { id: 7, title: "Verification" },
  { id: 8, title: "Approval" },
];

export default function MembershipRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [authToken, setAuthToken] = useState<string>("");
  const [dynamicWings, setDynamicWings] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    identificationNumber: "",
    photo: null as File | null,
    photoUrl: "",
    photoPublicId: "",
    selectedCategories: [] as string[],
    agreedToTerms: false,
    wing: "INDIA", // Default dynamic tracking
    contribution: "0",
    baseFee: 1000.0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getActiveToken = () =>
    authToken || localStorage.getItem("token") || localStorage.getItem("accessToken") || "";

  // 1. Fetch available membership wings list on mount
  useEffect(() => {
    const fetchWingsList = async () => {
      try {
        const response = await fetch(`${API_BASE}/wings`);
        const data = await response.json();
        if (response.ok && data?.data) {
          setDynamicWings(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch wings list", err);
      }
    };
    fetchWingsList();
  }, []);

  // 2. Fetch user's current wings when authorized
  useEffect(() => {
    const token = getActiveToken();
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const wingRes = await fetch(`${API_BASE}/auth/wings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wingData = await wingRes.json();
        if (wingRes.ok && wingData?.wings) {
          setFormData((prev) => ({ ...prev, selectedCategories: wingData.wings }));
        }
      } catch (err) {
        console.error("Failed to load user configuration details", err);
      }
    };

    fetchUserData();
  }, [authToken, step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "fullName") finalValue = value.replace(/[0-9]/g, "");
    if (name === "identificationNumber") finalValue = value.replace(/\D/g, "").slice(0, 12);
    if (name === "mobile") finalValue = value.replace(/\D/g, "").slice(0, 15);

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategoryToggle = (categoryName: string) => {
    setFormData((prev) => {
      const exists = prev.selectedCategories.includes(categoryName);
      return {
        ...prev,
        selectedCategories: exists
          ? prev.selectedCategories.filter((c) => c !== categoryName)
          : [...prev.selectedCategories, categoryName],
      };
    });
    if (errors.selectedCategories) setErrors((prev) => ({ ...prev, selectedCategories: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    }
  };

  const handleNextStep = async () => {
    const newErrors: Record<string, string> = {};

    // Step 1: Personal Info & Register Step 1
    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = "Full Name is required.";
      if (!formData.mobile) newErrors.mobile = "Mobile Number is required.";
      if (!formData.email) newErrors.email = "Email Address is required.";
      if (!formData.password) newErrors.password = "Password is required.";
      if (formData.password && formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters.";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match!";
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
        if (!response.ok) throw new Error(data.message || "Registration failed");

        const token = data.data?.accessToken || data.accessToken || data.token;
        if (token) {
          setAuthToken(token);
          localStorage.setItem("token", token);
          localStorage.setItem("accessToken", token);
        } else {
          throw new Error("Authentication token not received.");
        }
      } catch (error: any) {
        setErrors({ email: error.message || "Failed to complete step 1" });
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    // Step 2: Photo Upload
    if (step === 2 && formData.photo) {
      setIsSubmitting(true);
      try {
        const uploadData = new FormData();
        uploadData.append("image", formData.photo);
        const token = getActiveToken();
        const response = await fetch(`${API_BASE}/auth/upload-image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Image upload failed");

        setFormData((prev) => ({
          ...prev,
          photoUrl: data.data?.photoUrl || data.photoUrl || "",
          photoPublicId: data.data?.publicId || data.publicId || "",
        }));
      } catch (error: any) {
        setErrors({ photo: error.message || "Failed to upload image" });
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    // Step 3: Membership Types / Wings
    if (step === 3) {
      if (formData.selectedCategories.length === 0) {
        setErrors({ selectedCategories: "Please select at least one membership type." });
        return;
      }
      setIsSubmitting(true);
      try {
        const token = getActiveToken();
        const response = await fetch(`${API_BASE}/auth/addorupdatewing`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            wings: formData.selectedCategories,
            photoUrl: formData.photoUrl,
            photoPublicId: formData.photoPublicId,
          }),
        });
        if (!response.ok) throw new Error("Failed to update wings");
      } catch (error: any) {
        setErrors({ selectedCategories: error.message });
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    // Step 4: Location / Country Details Update
    if (step === 4) {
      setIsSubmitting(true);
      try {
        const token = getActiveToken();
        const response = await fetch(`${API_BASE}/auth/addorupdatecountry`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ country: formData.wing }),
        });
        if (!response.ok) throw new Error("Failed to update country");
      } catch (error: any) {
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    // Step 5: KYC Setup (Matching backend expectation for mandatory mobile & aadhar)
    if (step === 5) {
      if (!formData.identificationNumber || formData.identificationNumber.length !== 12) {
        setErrors({ identificationNumber: "Please provide a valid 12-digit identification number." });
        return;
      }
      setIsSubmitting(true);
      try {
        const token = getActiveToken();
        const response = await fetch(`${API_BASE}/auth/addorupdatekyc`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            kycMethods: ["mobile", "aadhar"],
            mobile: { selected: true },
            aadhar: { selected: true, aadharNumber: formData.identificationNumber },
            pan: { selected: false, panNumber: "" },
            identificationNumber: formData.identificationNumber
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to complete KYC setup");
      } catch (error: any) {
        setErrors({ identificationNumber: error.message });
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    setErrors({});
    setStep((prev) => Math.min(prev + 1, 8));
  };

  const handleSkipStep = () => setStep((prev) => Math.min(prev + 1, 8));
  const handlePrevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-[#fff8f5] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl bg-white border border-[#e0bfbf] rounded-3xl shadow-xl overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0bfbf]/50 bg-gradient-to-r from-[#fbf2ed] via-[#fff8f5] to-[#fbf2ed]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-white border border-[#e0bfbf]/60 flex items-center justify-center overflow-hidden shadow-sm">
              <Image src="/images/Logo2.jpg" alt="Logo" fill className="object-contain p-1" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#570013] font-['Playfair_Display',serif] tracking-tight">
                ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
              </h3>
              <p className="text-[10px] text-[#775a19] uppercase tracking-wider font-semibold">Member Portal</p>
            </div>
          </div>
          <button type="button" onClick={() => router.push("/")} className="text-xs font-semibold text-[#8c7071] hover:text-[#570013]">
            Home
          </button>
        </div>

        {/* Progress Step Bar */}
        {!isSuccess && (
          <div className="px-4 py-3 bg-[#fbf2ed] border-b border-[#e0bfbf]/60 overflow-x-auto [scrollbar-width:none]">
            <div className="flex items-center justify-start sm:justify-between w-max sm:w-full min-w-full px-1 gap-2">
              {stepsList.map((s, idx) => {
                const isCompleted = step > s.id;
                const isCurrent = step === s.id;
                return (
                  <div key={s.id} className="flex items-center gap-1.5 shrink-0 px-0.5">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all shadow-sm ${
                      isCompleted ? "bg-[#570013] text-white" : isCurrent ? "bg-[#775a19] text-white ring-2 ring-[#775a19]/25 scale-105" : "bg-[#e9e1dc] text-[#8c7071]"
                    }`}>
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.id}
                    </div>
                    <span className={`text-[11px] sm:text-xs font-bold transition-colors hidden md:inline-block ${isCurrent ? "text-[#570013]" : "text-[#8c7071]"}`}>
                      {s.title}
                    </span>
                    {idx < stepsList.length - 1 && (
                      <div className={`w-1.5 sm:w-3 h-[2px] mx-0.5 ${step > s.id ? "bg-[#570013]" : "bg-[#e9e1dc]"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 sm:p-8 bg-[#fff8f5] flex-1">
          {isSuccess ? (
            <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-[#570013]/10 text-[#570013] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-bold text-[#570013] font-['Playfair_Display',serif]">
                Application Submitted Successfully!
              </h4>
              <p className="text-sm text-[#584141] max-w-sm mx-auto leading-relaxed">
                Your payment, KYC, and multi-factor verifications are complete. Your account is now pending admin approval.
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
                  wings={dynamicWings}
                  selectedCategories={formData.selectedCategories}
                  onToggle={handleCategoryToggle}
                  error={errors.selectedCategories}
                />
              )}

              {step === 4 && (
                <RegionStep
                  geographicWings={defaultGeographicWings}
                  selectedWing={formData.wing}
                  onSelect={(name) => setFormData((prev) => ({ ...prev, wing: name }))}
                />
              )}

              {step === 5 && (
                <KycVerificationStep
                  mobile={formData.mobile}
                  identificationNumber={formData.identificationNumber}
                  onChange={handleInputChange}
                  error={errors.identificationNumber}
                  onBack={handlePrevStep}
                  onProceed={handleNextStep}
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
                <VerificationStep
                  apiBase={API_BASE}
                  authToken={authToken}
                  mobile={formData.mobile}
                  identificationNumber={formData.identificationNumber}
                  onVerified={() => setStep(8)}
                />
              )}

              {step === 8 && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-[#775a19]/10 text-[#775a19] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-[#570013] font-['Playfair_Display',serif]">
                    Final Review Queue
                  </h4>
                  <p className="text-xs text-[#584141] max-w-sm mx-auto leading-relaxed">
                    All verifications are completed. Click below to submit your application for final administrator approval.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(true)}
                    className="px-6 py-2.5 bg-[#570013] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#800020] transition-all shadow-md cursor-pointer"
                  >
                    Submit for Final Review
                  </button>
                </div>
              )}

              {/* Navigation Controls for steps other than custom layout steps like step 5 & 6 */}
              {step !== 5 && step !== 6 && step !== 8 && (
                <div className="flex items-center justify-between pt-4 border-t border-[#e0bfbf]/40 mt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-5 py-2.5 bg-white border border-[#e0bfbf] text-[#584141] text-sm font-semibold rounded-xl hover:bg-[#fbf2ed] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  ) : <div />}

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-[#570013] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl hover:bg-[#800020] transition-all shadow-md active:scale-95 flex items-center gap-1.5 ml-auto cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        Next Step <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}