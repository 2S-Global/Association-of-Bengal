"use client";

import { FormEvent, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type Service = {
  _id: string;
  number: number;
  title: string;
  description: string;
  isActive: boolean;
};

export default function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter();
  const [number, setNumber] = useState(service?.number ?? 1);
  const [title, setTitle] = useState(service?.title ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [saving, setSaving] = useState(false);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/services", {
        method: service ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: service?._id, number, title, description }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to save service.");
      toast.success(result.message);
      router.push("/admin/manage-cms/manage-services");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="admin-table-card mt-6 overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white">{service ? "Service details" : "New service details"}</h3>
        <p className="mt-1 text-sm text-gray-500">All fields are required.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Service number *</span>
          <input required min={1} type="number" value={number} onChange={(event) => setNumber(Number(event.target.value))} className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-[#570013] focus:ring-2 focus:ring-[#570013]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</span>
          <input required value={title} onChange={(event) => setTitle(event.target.value)} className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-[#570013] focus:ring-2 focus:ring-[#570013]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</span>
          <textarea required rows={6} value={description} onChange={(event) => setDescription(event.target.value)} className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#570013] focus:ring-2 focus:ring-[#570013]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
        </label>
      </div>
      <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:px-6 dark:border-gray-800">
        <button type="button" onClick={() => router.push("/admin/manage-cms/manage-services")} className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Cancel</button>
        <button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#570013] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#450010] disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{service ? "Save Changes" : "Create Service"}
        </button>
      </div>
    </form>
  );
}
