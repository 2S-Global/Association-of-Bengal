"use client";

import { FormEvent, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type Wing = {
  id: string;
  name: string;
  nameBn?: string;
  description?: string;
  icon?: string;
  fees?: number;
  bgColor?: string;
  color?: string;
  sortOrder?: number;
  isActive: boolean;
};
type Data = {
  name: string;
  nameBn: string;
  description: string;
  icon: string;
  fees: number;
  bgColor: string;
  color: string;
  sortOrder: number;
};
const blank: Data = {
  name: "",
  nameBn: "",
  description: "",
  icon: "",
  fees: 0,
  bgColor: "#f5e6d8",
  color: "#570013",
  sortOrder: 0,
};

export default function WingForm({ wing }: { wing?: Wing }) {
  const router = useRouter();
  const [data, setData] = useState<Data>(
    wing
      ? {
          name: wing.name,
          nameBn: wing.nameBn || "",
          description: wing.description || "",
          icon: wing.icon || "",
          fees: wing.fees || 0,
          bgColor: wing.bgColor || "#f5e6d8",
          color: wing.color || "#570013",
          sortOrder: wing.sortOrder || 0,
        }
      : blank,
  );
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof Data>(key: K, value: Data[K]) =>
    setData((current) => ({ ...current, [key]: value }));
  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/wings", {
        method: wing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wing ? { ...data, id: wing.id } : data),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Unable to save wing.");
      toast.success(result.message);
      router.push("/admin/manage-cms/manage-wings");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save wing.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={save} className="admin-table-card mt-6 overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white">
          {wing ? "Wing details" : "New wing details"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Fields marked with an asterisk are required.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <Field
          label="Wing name"
          required
          value={data.name}
          onChange={(value) => set("name", value)}
        />
        <Field
          label="Wing name (Bengali)"
          value={data.nameBn}
          onChange={(value) => set("nameBn", value)}
        />
        <Field
          label="Icon name"
          placeholder="e.g. book"
          value={data.icon}
          onChange={(value) => set("icon", value)}
        />
        <Field
          label="Sort order"
          type="number"
          value={String(data.sortOrder)}
          onChange={(value) => set("sortOrder", Number(value))}
        />
        <Field
          label="Fee (₹)"
          type="number"
          value={String(data.fees)}
          onChange={(value) => set("fees", Number(value))}
        />
        <Field
          label="Background colour"
          value={data.bgColor}
          onChange={(value) => set("bgColor", value)}
        />
        <Field
          label="Text/icon colour"
          value={data.color}
          onChange={(value) => set("color", value)}
        />
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </span>
          <textarea
            value={data.description}
            onChange={(event) => set("description", event.target.value)}
            rows={4}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#570013] focus:ring-2 focus:ring-[#570013]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </label>
      </div>
      <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:px-6 dark:border-gray-800">
        <button
          type="button"
          onClick={() => router.push("/admin/manage-cms/manage-wings")}
          className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
        >
          Cancel
        </button>
        <button
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#570013] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#450010] disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {wing ? "Save Changes" : "Create Wing"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  type = "text",
  value,
  placeholder,
  onChange,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        required={required}
        type={type}
        min={type === "number" ? 0 : undefined}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-[#570013] focus:ring-2 focus:ring-[#570013]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />
    </label>
  );
}
