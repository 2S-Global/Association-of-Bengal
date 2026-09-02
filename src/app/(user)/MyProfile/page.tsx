"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Globe,
  Award,
  BadgeCheck,
  Save,
  Clock
} from "lucide-react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://balc.albdglobal.org"}/api/v1`;

interface ProfilePageProps {
  userData?: {
    fullName?: string;
    email?: string;
    mobile?: string;
    role?: string;
    createdAt?: string;
  };
  memberData?: {
    memberId?: string;
    wings?: string[];
    location?: { country?: string };
  };
}

export default function MyProfilePage({ userData: initialUser, memberData: initialMember }: ProfilePageProps) {
  const [user, setUser] = useState(initialUser || {});
  const [member, setMember] = useState(initialMember || {});
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Password change form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState({ text: "", type: "" });

  // Fetch dynamic account data on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("access_token");

      if (!token) return;

      try {
        // Fetch /auth/my-account data
        const res = await fetch(`${API_BASE_URL}/auth/my-account`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok && data) {
          const acc = data.user || data.data?.user || data.data || data;
          setAccountInfo(acc);
          if (acc) {
            setUser((prev) => ({ ...prev, ...acc }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch account info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage({ text: "", type: "" });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwMessage({ text: "All password fields are required.", type: "error" });
      return;
    }

    if (newPassword.length < 8) {
      setPwMessage({ text: "New password must be at least 8 characters long.", type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwMessage({ text: "New password and confirmation do not match.", type: "error" });
      return;
    }

    setPwLoading(true);
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update password.");
      }

      setPwMessage({ text: "Password changed successfully!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwMessage({ text: err.message || "An error occurred while updating password.", type: "error" });
    } finally {
      setPwLoading(false);
    }
  };

  if (loading && !accountInfo && !user.email) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#570013]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn font-['Libre_Franklin',sans-serif]">
      {/* Top Banner Profile Summary */}
      <div className="bg-gradient-to-r from-[#570013] via-[#70091d] to-[#800020] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none blur-2xl" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-xs border border-white/10">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            Verified Fellow Account
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display',serif] tracking-tight">
            {user?.fullName || "Member Profile"}
          </h2>
          <p className="text-xs sm:text-sm text-[#f5e6d8] max-w-lg leading-relaxed">
            Manage your personal identity credentials, account settings, and security passwords.
          </p>
        </div>
        <div className="bg-white/10 border border-white/20 px-5 py-4 rounded-2xl text-center backdrop-blur-md shrink-0 shadow-inner">
          <span className="block text-[10px] uppercase tracking-widest text-[#f5e6d8] font-semibold">
            Member ID
          </span>
          <span className="text-base sm:text-lg font-mono font-bold tracking-wider text-amber-200">
            {member?.memberId || "ABLC-2026"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Personal & Fellowship Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#e0bfbf]/30 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] flex items-center gap-2">
                <User className="w-4 h-4 text-[#775a19]" />
                Personal Information
              </h4>
              <span className="text-[10px] bg-[#fbf2ed] text-[#775a19] font-bold px-2.5 py-1 rounded-full border border-[#e0bfbf]/50 capitalize">
                Role: {user?.role || "member"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#584141]">
              <div className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Full Name</span>
                <p className="font-bold text-[#1e1b18] text-sm">{user?.fullName || "N/A"}</p>
              </div>

              <div className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Email Address</span>
                <p className="font-bold text-[#1e1b18] text-sm flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#775a19] shrink-0" />
                  <span className="truncate">{user?.email || "N/A"}</span>
                </p>
              </div>

              <div className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Mobile Number</span>
                <p className="font-bold text-[#1e1b18] text-sm flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#775a19]" />
                  {user?.mobile || "Not Provided"}
                </p>
              </div>

              <div className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Joined Date</span>
                <p className="font-bold text-[#1e1b18] text-sm flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#775a19]" />
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Fellowship & Membership Wings */}
          <div className="bg-white p-6 sm:p-7 border border-[#e0bfbf]/60 rounded-3xl shadow-xs space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] border-b border-[#e0bfbf]/30 pb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#775a19]" />
              Fellowship Credentials & Wings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#584141]">
              <div className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Assigned Wings</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {member?.wings?.length ? (
                    member.wings.map((wing, i) => (
                      <span key={i} className="px-2.5 py-1 bg-[#fbf2ed] text-[#570013] border border-[#e0bfbf] rounded-lg text-[11px] font-bold">
                        {wing}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">General Member</span>
                  )}
                </div>
              </div>

              <div className="bg-[#fff8f5] p-4 rounded-2xl border border-[#e0bfbf]/40 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7071]">Chapter Region</span>
                <p className="font-bold text-[#1e1b18] text-sm flex items-center gap-1.5 pt-1">
                  <Globe className="w-4 h-4 text-[#775a19]" />
                  {member?.location?.country || "INDIA"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Account Credentials Info & Change Password */}
        <div className="space-y-6">
          {/* Account Credentials Widget */}
          <div className="bg-white p-6 border border-[#e0bfbf]/60 rounded-3xl shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] border-b border-[#e0bfbf]/30 pb-3 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#775a19]" />
              Account Credentials Info
            </h4>

            {accountInfo ? (
              <div className="space-y-3 text-xs text-[#584141]">
                <div className="flex justify-between items-center bg-[#fff8f5] p-3 rounded-xl border border-[#e0bfbf]/40">
                  <span className="text-gray-500 font-medium">Account Status</span>
                  <span className="font-bold text-green-700 flex items-center gap-1">
                    <BadgeCheck className="w-4 h-4" /> {accountInfo.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#fff8f5] p-3 rounded-xl border border-[#e0bfbf]/40">
                  <span className="text-gray-500 font-medium">System Role</span>
                  <span className="font-bold text-[#570013] uppercase tracking-wide">
                    {accountInfo.role || "Member"}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#fff8f5] p-3 rounded-xl border border-[#e0bfbf]/40">
                  <span className="text-gray-500 font-medium">Registration Steps</span>
                  <span className="font-bold text-[#775a19]">
                    {accountInfo.allstep_completed ? "All Completed" : `Step ${accountInfo.step}`}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#fff8f5] p-3 rounded-xl border border-[#e0bfbf]/40">
                  <span className="text-gray-500 font-medium">Last Login</span>
                  <span className="font-bold text-[#1e1b18] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#775a19]" />
                    {accountInfo.lastLoginAt ? new Date(accountInfo.lastLoginAt).toLocaleString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#fff8f5] p-3 rounded-xl border border-[#e0bfbf]/40">
                  <span className="text-gray-500 font-medium">Password Updated</span>
                  <span className="font-bold text-[#1e1b18]">
                    {accountInfo.passwordChangedAt ? new Date(accountInfo.passwordChangedAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 text-center py-4">No account info available.</p>
            )}
          </div>

          {/* Change Password Card */}
          <div className="bg-white p-6 border border-[#e0bfbf]/60 rounded-3xl shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#570013] border-b border-[#e0bfbf]/30 pb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#775a19]" />
              Change Password
            </h4>

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#584141] uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-[#fff8f5] border border-[#e0bfbf] p-3 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#570013]/20 text-[#1e1b18]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#584141] uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-[#fff8f5] border border-[#e0bfbf] p-3 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#570013]/20 text-[#1e1b18]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#584141] uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#fff8f5] border border-[#e0bfbf] p-3 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#570013]/20 text-[#1e1b18]"
                />
              </div>

              {pwMessage.text && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    pwMessage.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {pwMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{pwMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={pwLoading}
                className="w-full py-3 bg-[#570013] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#800020] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
              >
                {pwLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Update Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}