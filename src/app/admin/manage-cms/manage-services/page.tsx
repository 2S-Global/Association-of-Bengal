"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Edit3, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";
import type { Service } from "@/components/admin/services/ServiceForm";

const sizes = [5, 10, 20, 50];

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/services?admin=true");
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Unable to load services.");
      setServices(result.data.filter((service: Service) => service.isActive));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load services.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? services.filter((service) =>
          `${service.number} ${service.title} ${service.description}`
            .toLowerCase()
            .includes(term),
        )
      : services;
  }, [search, services]);

  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const safePage = Math.min(page, pages);
  const items = useMemo(
    () => filtered.slice((safePage - 1) * size, safePage * size),
    [filtered, safePage, size],
  );

  const deactivate = async (service: Service) => {
    if (!confirm(`Deactivate “${service.title}”?`)) return;
    setDeleting(service._id);
    try {
      const response = await fetch(
        `/api/services?id=${encodeURIComponent(service._id)}`,
        { method: "DELETE" },
      );
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Unable to deactivate service.");
      setServices((current) =>
        current.filter((item) => item._id !== service._id),
      );
      toast.success(result.message);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to deactivate service.",
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* <PageBreadcrumb pageTitle="Manage Services" showTitle={false} /> */}
      <div className="mt-0 flex flex-col items-start justify-between gap-5 rounded-3xl border border-[#e0bfbf]/70 bg-gradient-to-r from-white via-[#fff8f5] to-[#fef2eb] p-8 shadow-sm sm:flex-row sm:items-center">
        <div className="space-y-1">
          <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#775a19]">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" /> CMS
            Administration
          </span>
          <h1 className="flex items-center gap-2.5 font-['Playfair_Display'] text-xl font-bold text-[#570013] sm:text-2xl">
            <Sparkles className="h-6 w-6 text-amber-600" /> Manage Services
          </h1>
          <p className="text-xs text-[#564242]">
            Create and manage the services displayed on the association website.
          </p>
        </div>
        <Link
          href="/admin/manage-cms/manage-services/add-service"
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#570013] px-6 py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#40000e] hover:shadow-lg active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add New Service
        </Link>
      </div>
      <section className="admin-table-card mt-6 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span>Rows per page:</span>
            <select
              value={size}
              onChange={(event) => {
                setSize(Number(event.target.value));
                setPage(1);
              }}
              className="h-9 rounded-lg border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-[#570013] dark:border-gray-700 dark:bg-gray-900"
            >
              {sizes.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search services..."
            className="h-10 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-[#570013] focus:ring-2 focus:ring-[#570013]/20 sm:w-72 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#570013] text-xs font-semibold uppercase tracking-wider text-white">
                <th className="whitespace-nowrap px-5 py-4 text-center align-middle">
                  SL No.
                </th>
                <th className="px-5 py-4 text-left">Title</th>
                <th className="px-5 py-4 text-left">Description</th>
                <th className="whitespace-nowrap px-5 py-4 text-center align-middle">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#570013]" />
                    <p className="mt-3 text-sm text-gray-500">
                      Loading services…
                    </p>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-16 text-center text-sm text-gray-500"
                  >
                    {search
                      ? "No matching services found."
                      : "No services have been added yet."}
                  </td>
                </tr>
              ) : (
                items.map((service) => (
                  <tr
                    key={service._id}
                    className="transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-center align-middle">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#570013] text-xs font-bold text-white">
                        {service.number}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                      {service.title}
                    </td>
                    <td className="max-w-xl px-5 py-4 text-gray-600 dark:text-gray-400">
                      <span className="line-clamp-2">
                        {service.description}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-1">
                        <Link
                          href={`/admin/manage-cms/manage-services/add-service?id=${encodeURIComponent(service._id)}`}
                          title="Edit service"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#570013] transition hover:bg-[#570013]/10"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deactivate(service)}
                          disabled={deleting === service._id}
                          title="Deactivate service"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          {deleting === service._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:px-6 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <strong>{(safePage - 1) * size + 1}</strong> to{" "}
              <strong>{Math.min(safePage * size, filtered.length)}</strong> of{" "}
              <strong>{filtered.length}</strong> entries
            </p>
            <div className="flex items-center gap-1">
              <button
                aria-label="Previous page"
                onClick={() => setPage(safePage - 1)}
                disabled={safePage === 1}
                className="pager"
              >
                ‹
              </button>
              {Array.from({ length: pages }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => setPage(number)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium ${safePage === number ? "bg-[#570013] text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/5"}`}
                  >
                    {number}
                  </button>
                ),
              )}
              <button
                aria-label="Next page"
                onClick={() => setPage(safePage + 1)}
                disabled={safePage === pages}
                className="pager"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </section>
      <style jsx>{`
        .pager {
          display: flex;
          height: 2.25rem;
          width: 2.25rem;
          align-items: center;
          justify-content: center;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          color: #4b5563;
          font-size: 1.125rem;
        }
        .pager:disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }
      `}</style>
    </div>
  );
}
