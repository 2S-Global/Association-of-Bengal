
"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Camera, 
  Lock, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Award,
  CalendarCheck,
  Edit3,
  X,
  KeyRound,
  UserPen,
  Shield,
  Coins,
  Calendar,
  Sparkles
} from "lucide-react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

export default function MyProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    mobile: "",
    memberId: "",
    wings: [] as string[],
    country: "",
    photoUrl: "",
    totalContributions: 0,
    memberSince: 2026,
    verified: false,
    allstep_completed: true,
  });

  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Password state
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passMessage, setPassMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || localStorage.getItem("access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/members/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await res.json();
        
        if (res.ok && json?.data) {
          const u = json.data.user || {};
          const m = json.data.member || {};

          setProfile({
            fullName: m.fullName || u.fullName || "",
            email: u.email || "",
            mobile: u.mobile || "",
            memberId: m.memberId || "",
            wings: m.wings || [],
            country: m.location?.country || "",
            photoUrl: m.photoUrl || "",
            totalContributions: m.totalContributions || 0,
            memberSince: m.memberSince || 2026,
            verified: m.verified ?? false,
            allstep_completed: u.allstep_completed ?? true,
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || localStorage.getItem("access_token");

    try {
      const res = await fetch(`${API_BASE_URL}/members/profile`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: profile.fullName,
          photoUrl: profile.photoUrl,
          location: { country: profile.country }
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploadingPhoto(true);
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || localStorage.getItem("access_token");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile-photo`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        const newUrl = data.data?.photoUrl || data.photoUrl;
        setProfile(prev => ({ ...prev, photoUrl: newUrl }));
        setMessage({ type: "success", text: "Profile picture updated successfully!" });
      } else {
        alert(data.message || "Failed to upload image.");
      }
    } catch (err) {
      alert("Error uploading image.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPassMessage({ type: "", text: "" });

    const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || localStorage.getItem("access_token");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(passwords)
      });

      const data = await res.json();
      if (res.ok) {
        setPassMessage({ type: "success", text: "Password changed successfully!" });
        setPasswords({ currentPassword: "", newPassword: "" });
      } else {
        setPassMessage({ type: "error", text: data.message || "Failed to change password." });
      }
    } catch (err) {
      setPassMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="w-9 h-9 animate-spin text-[#570013]" />
        <p className="text-xs font-bold text-[#8c7071] tracking-wider uppercase">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-['Libre_Franklin',sans-serif]">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#e0bfbf]/60 shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold text-[#775a19] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" /> Member Control Panel
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#570013] font-['Playfair_Display',serif]">
            Account Settings & Profile
          </h1>
        </div>

        {/* Action Tabs switcher */}
        <div className="flex items-center gap-1.5 bg-[#fbf2ed] p-1.5 rounded-2xl border border-[#e0bfbf]/60">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === "profile" 
                ? "bg-[#570013] text-white shadow-xs" 
                : "text-[#584141] hover:text-[#570013]"
            }`}
          >
            <UserPen className="w-3.5 h-3.5" /> Profile Info
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === "security" 
                ? "bg-[#570013] text-white shadow-xs" 
                : "text-[#584141] hover:text-[#570013]"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> Security
          </button>
        </div>
      </div>

      {/* Main Split Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Sidebar Card: Profile Summary */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
          
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-[#570013] bg-[#fbf2ed] relative shadow-md">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-extrabold text-[#570013]">
                  {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "M"}
                </div>
              )}
            </div>
            <label className="absolute inset-0 bg-black/50 text-white rounded-3xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-xs font-bold backdrop-blur-xs">
              {isUploadingPhoto ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Camera className="w-5 h-5 mb-1" /> Change Photo</>}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-2 w-full">
            <div className="flex flex-wrap justify-center lg:justify-start gap-1.5">
              <span className="text-xs font-mono font-extrabold bg-[#570013] text-white px-2.5 py-0.5 rounded-md">
                {profile.memberId}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CalendarCheck className="w-3 h-3 text-emerald-600" /> Active
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#570013] font-['Playfair_Display',serif]">{profile.fullName}</h2>
            <p className="text-xs text-[#8c7071] truncate">{profile.email}</p>
          </div>

          <div className="w-full border-t border-[#e0bfbf]/40 pt-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8c7071] font-bold flex items-center gap-1.5"><Coins className="w-3.5 h-3.5 text-[#775a19]" /> Total Contributions</span>
              <span className="font-mono font-extrabold text-[#570013]">₹{profile.totalContributions}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8c7071] font-bold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#775a19]" /> Member Since</span>
              <span className="font-mono font-extrabold text-[#570013]">{profile.memberSince}</span>
            </div>
          </div>

          {/* Professional ID Card Download Notice */}
          <div className="w-full bg-[#fbf2ed] border border-[#e0bfbf]/70 rounded-2xl p-4 text-left space-y-2">
            <div className="flex items-center gap-2 text-[#570013]">
              <Sparkles className="w-4 h-4 text-[#775a19] shrink-0" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider">Digital Member ID Card</h4>
            </div>
            <p className="text-[11px] text-[#584141] leading-relaxed">
              Download our official mobile app to access, view, and download your verified digital membership ID card on the go.
            </p>
          </div>

        </div>

        {/* Right Content Area: Tabs Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === "profile" ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-6 animate-in fade-in duration-200">
              
              <div className="flex items-center justify-between border-b border-[#e0bfbf]/40 pb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-[#570013] uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-[#775a19]" /> Personal Information
                  </h3>
                  <p className="text-xs text-[#8c7071] mt-0.5">Update your editable member attributes below.</p>
                </div>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isEditing 
                      ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100" 
                      : "bg-[#570013] text-white shadow-md hover:bg-[#40000e]"
                  }`}
                >
                  {isEditing ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Edit3 className="w-3.5 h-3.5" /> Edit</>}
                </button>
              </div>

              {message.text && (
                <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                  {message.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-[#584141] mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                      <input 
                        type="text" 
                        name="fullName" 
                        value={profile.fullName} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                        className={`w-full rounded-2xl px-4 py-3 pl-11 text-xs font-bold transition-all ${
                          isEditing ? "bg-[#fff8f5] border border-[#e0bfbf] text-[#570013]" : "bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#584141] mb-1.5">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                      <input 
                        type="text" 
                        name="country" 
                        value={profile.country} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full rounded-2xl px-4 py-3 pl-11 text-xs font-bold transition-all ${
                          isEditing ? "bg-[#fff8f5] border border-[#e0bfbf] text-[#570013]" : "bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#584141] mb-1.5">Email (Read-only)</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="email" 
                        value={profile.email} 
                        disabled
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 pl-11 text-xs font-bold text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#584141] mb-1.5">Mobile (Read-only)</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        value={profile.mobile} 
                        disabled
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 pl-11 text-xs font-bold text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                </div>

                {/* Assigned Wings */}
                <div className="bg-[#fbf2ed]/50 p-4 rounded-2xl border border-[#e0bfbf]/60 space-y-1.5">
                  <span className="text-[10px] uppercase font-extrabold text-[#775a19] tracking-wider block">Assigned Wings</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.wings.map((w, i) => (
                      <span key={i} className="bg-white text-[#570013] border border-[#e0bfbf] px-3 py-1 rounded-xl text-xs font-bold shadow-2xs">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-3 border-t border-[#e0bfbf]/40">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 bg-[#570013] text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-md hover:bg-[#40000e] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0bfbf]/60 shadow-sm space-y-6 animate-in fade-in duration-200">
              
              <div className="border-b border-[#e0bfbf]/40 pb-4">
                <h3 className="text-sm font-extrabold text-[#570013] uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#775a19]" /> Password & Security
                </h3>
                <p className="text-xs text-[#8c7071] mt-0.5">Update your password to keep your account safe.</p>
              </div>

              {passMessage.text && (
                <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${passMessage.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                  {passMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                  {passMessage.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#584141] mb-1.5">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                    <input 
                      type="password" 
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      required
                      placeholder="••••••••"
                      className="w-full bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl px-4 py-3 pl-11 text-xs font-bold text-[#570013] focus:outline-none focus:border-[#570013]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#584141] mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8c7071]" />
                    <input 
                      type="password" 
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      required
                      placeholder="••••••••"
                      className="w-full bg-[#fff8f5] border border-[#e0bfbf] rounded-2xl px-4 py-3 pl-11 text-xs font-bold text-[#570013] focus:outline-none focus:border-[#570013]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="inline-flex items-center gap-2 bg-[#570013] text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-md hover:bg-[#40000e] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}


