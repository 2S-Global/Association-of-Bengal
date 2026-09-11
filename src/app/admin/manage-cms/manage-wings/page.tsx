"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Edit3, Loader2, Plus, Trash2, UsersRound } from "lucide-react";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";
import type { Wing } from "@/components/admin/wings/WingForm";

const sizes = [5, 10, 20, 50];
export default function ManageWingsPage() {
  const [wings, setWings] = useState<Wing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [deleting, setDeleting] = useState<string | null>(null);
  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/wings?admin=true");
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Unable to load wings.");
      setWings(result.data.filter((wing: Wing) => wing.isActive));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load wings.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void Promise.resolve().then(load);
  }, []);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? wings.filter((wing) =>
          [wing.id, wing.name, wing.nameBn, wing.description].some((value) =>
            value?.toLowerCase().includes(term),
          ),
        )
      : wings;
  }, [wings, search]);
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const safePage = Math.min(page, pages);
  const items = useMemo(
    () => filtered.slice((safePage - 1) * size, safePage * size),
    [filtered, safePage, size],
  );
  const deleteWing = async (wing: Wing) => {
    if (
      !confirm(
        `Deactivate ${wing.name}? It will no longer appear to users or in election wing selection.`,
      )
    )
      return;
    setDeleting(wing.id);
    try {
      const response = await fetch(
        `/api/wings?id=${encodeURIComponent(wing.id)}`,
        { method: "DELETE" },
      );
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.message || "Unable to delete wing.");
      setWings((current) => current.filter((item) => item.id !== wing.id));
      toast.success(result.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete wing.",
      );
    } finally {
      setDeleting(null);
    }
  };
  return (
    <div>
      <PageBreadcrumb pageTitle="Manage Wings" />
      <div className="admin-page-header mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="admin-page-description">
          Create and manage membership wings available across the portal.
        </p>
        <Link
          href="/admin/manage-cms/manage-wings/add-wing"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#570013] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#450010]"
        >
          <Plus className="h-4 w-4" /> Add New Wing
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
            placeholder="Search wings..."
            className="h-10 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-[#570013] focus:ring-2 focus:ring-[#570013]/20 sm:w-72 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#570013] text-xs font-semibold uppercase tracking-wider text-white">
                <th className="px-5 py-4 text-left">Wing</th>
                <th className="px-5 py-4 text-left">Description</th>
                <th className="px-5 py-4 text-center">Fee</th>
                <th className="px-5 py-4 text-center">Order</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#570013]" />
                    <p className="mt-3 text-sm text-gray-500">Loading wings…</p>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center text-sm text-gray-500"
                  >
                    {search
                      ? "No matching wings found."
                      : "No wings have been added yet."}
                  </td>
                </tr>
              ) : (
                items.map((wing) => (
                  <tr
                    key={wing.id}
                    className="transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: wing.bgColor || "#f7e8e8",
                            color: wing.color || "#570013",
                          }}
                        >
                          <UsersRound className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white/90">
                            {wing.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {wing.nameBn || wing.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-xs px-5 py-4 text-gray-600 dark:text-gray-400">
                      <span className="line-clamp-2">
                        {wing.description || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center text-gray-600 dark:text-gray-400">
                      ₹{wing.fees || 0}
                    </td>
                    <td className="px-5 py-4 text-center text-gray-600 dark:text-gray-400">
                      {wing.sortOrder || 0}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-1">
                        <Link
                          href={`/admin/manage-cms/manage-wings/add-wing?id=${encodeURIComponent(wing.id)}`}
                          title="Edit wing"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#570013] transition hover:bg-[#570013]/10"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteWing(wing)}
                          disabled={deleting === wing.id}
                          title="Deactivate wing"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          {deleting === wing.id ? (
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
