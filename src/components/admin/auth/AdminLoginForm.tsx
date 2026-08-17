"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Image from "next/image";

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result: { message?: string } = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to sign in.");
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1a0505]">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#7a1f1f]/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#c9a227]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5c1212]/30 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full max-w-[420px]">
          {/* Card */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#2a0a0a]/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#8b1a1a] via-[#c9a227] to-[#8b1a1a]" />

            <div className="px-7 pb-8 pt-8 sm:px-9 sm:pb-10 sm:pt-9">
              {/* Logo + Title */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex justify-center">
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg ring-1 ring-black/5">
                    <Image
                      src="/images/logo/balc_logo.png"
                      alt="Bengal Association for Literature and Culture"
                      width={80}
                      height={80}
                      className="h-full w-full object-contain"
                      priority
                    />
                  </div>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  Admin Sign In
                </h1>
                <p className="mt-2 text-sm text-white/55">
                  Bengal Association for Literature & Culture
                </p>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={signIn}>
                <div>
                  <label
                    htmlFor="admin-username"
                    className="mb-1.5 block text-sm font-medium text-white/80"
                  >
                    Username
                  </label>
                  <input
                    id="admin-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                    placeholder="Enter your username"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#c9a227]/60 focus:bg-white/10 focus:ring-2 focus:ring-[#c9a227]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="mb-1.5 block text-sm font-medium text-white/80"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#c9a227]/60 focus:bg-white/10 focus:ring-2 focus:ring-[#c9a227]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white/80"
                    >
                      {showPassword ? (
                        <EyeIcon className="h-5 w-5 fill-current" />
                      ) : (
                        <EyeCloseIcon className="h-5 w-5 fill-current" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative mt-2 flex h-11 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-[#8b1a1a] to-[#a52a2a] text-sm font-semibold text-white shadow-lg shadow-[#8b1a1a]/25 transition hover:from-[#9b2222] hover:to-[#b33a3a] focus:outline-none focus:ring-2 focus:ring-[#c9a227]/40 focus:ring-offset-2 focus:ring-offset-[#2a0a0a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-white/30">
            Authorized personnel only · Bengal Association
          </p>
        </section>
      </div>
    </main>
  );
}