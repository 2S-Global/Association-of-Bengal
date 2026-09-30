"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

const initialPasswords: Record<PasswordField, string> = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordPage() {
  const [passwords, setPasswords] = useState(initialPasswords);
  const [visibleFields, setVisibleFields] = useState<Record<PasswordField, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState<Partial<Record<PasswordField, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updatePassword(field: PasswordField, value: string) {
    setPasswords((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: Partial<Record<PasswordField, string>> = {};
    if (!passwords.currentPassword) nextErrors.currentPassword = "Enter your current password.";
    if (!passwords.newPassword) nextErrors.newPassword = "Enter a new password.";
    else if (passwords.newPassword.length < 8) nextErrors.newPassword = "Use at least 8 characters.";
    if (!passwords.confirmPassword) nextErrors.confirmPassword = "Confirm your new password.";
    else if (passwords.newPassword !== passwords.confirmPassword) nextErrors.confirmPassword = "New passwords do not match.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin-auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwords),
      });
      const result: { success?: boolean; message?: string } = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to change password.");

      setPasswords(initialPasswords);
      toast.success(result.message || "Password changed successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to change password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const fields: Array<{ id: PasswordField; label: string; autoComplete: string; hint?: string }> = [
    { id: "currentPassword", label: "Current password", autoComplete: "current-password" },
    { id: "newPassword", label: "New password", autoComplete: "new-password", hint: "Use at least 8 characters." },
    { id: "confirmPassword", label: "Confirm new password", autoComplete: "new-password" },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Change Password" />

      <div className="mx-auto mt-6 max-w-2xl">
        <section className="admin-card overflow-hidden">
          <div className="border-b border-gray-100 bg-linear-to-r from-[#fff9f8] to-[#fffdf7] px-5 py-5 sm:px-6 dark:border-gray-800 dark:from-[#2a1619] dark:to-gray-dark">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#570013] text-white shadow-sm">
                <KeyRound className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Update your password</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose a strong password that you do not use elsewhere.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5 px-5 py-6 sm:px-6">
              {fields.map((field) => {
                const error = errors[field.id];
                const visible = visibleFields[field.id];
                return (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        id={field.id}
                        type={visible ? "text" : "password"}
                        value={passwords[field.id]}
                        onChange={(event) => updatePassword(field.id, event.target.value)}
                        autoComplete={field.autoComplete}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error || field.hint ? `${field.id}-hint` : undefined}
                        className={`h-11 w-full rounded-xl border bg-white px-3 pr-11 text-sm text-gray-800 outline-none transition focus:ring-2 dark:bg-gray-800 dark:text-white ${error ? "border-error-500 focus:border-error-500 focus:ring-error-500/15" : "border-gray-300 focus:border-[#570013] focus:ring-[#570013]/20 dark:border-gray-700"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setVisibleFields((current) => ({ ...current, [field.id]: !current[field.id] }))}
                        aria-label={visible ? `Hide ${field.label}` : `Show ${field.label}`}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#570013] dark:hover:text-white"
                      >
                        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {(error || field.hint) && (
                      <p id={`${field.id}-hint`} className={`mt-1.5 text-xs ${error ? "text-error-600" : "text-gray-500 dark:text-gray-400"}`}>
                        {error || field.hint}
                      </p>
                    )}
                  </div>
                );
              })}

              <div className="flex gap-3 rounded-xl border border-gold-200 bg-gold-25 px-4 py-3 text-sm text-gold-800 dark:border-gold-900 dark:bg-gold-950/30 dark:text-gold-200">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Your password is stored securely and is never shown in the admin panel.</p>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-[#570013] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#450010] focus:outline-none focus:ring-2 focus:ring-[#570013]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-dark"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
