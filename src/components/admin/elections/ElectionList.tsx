"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getElectionTimestamp } from "@/lib/election-timeline-validation";
import ElectionActionLinks from "@/components/admin/elections/ElectionActionLinks";
import type { ElectionStatus } from "@/types/Election";

type Election = {
  _id: string;
  name: string;
  location: string;
  voting: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };
  status: ElectionStatus;
};

const statusStyles: Record<
  ElectionStatus,
  { label: string; badge: string; dot: string }
> = {
  draft: {
    label: "Draft",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  active: {
    label: "Active",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  suspended: {
    label: "Suspended",
    badge: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    dot: "bg-red-500",
  },
  completed: {
    label: "Completed",
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300",
    dot: "bg-gray-500",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    dot: "bg-red-500",
  },
};

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function ElectionList() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [electionToSuspend, setElectionToSuspend] = useState<Election | null>(
    null,
  );
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Table controls
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadElections = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/elections");
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setElections(result.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load elections.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reset to page 1 when search or rowsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, rowsPerPage]);

  const filteredElections = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return elections;

    return elections.filter(
      (e) =>
        e.name.toLowerCase().includes(term) ||
        e.location.toLowerCase().includes(term) ||
        e.status.toLowerCase().includes(term),
    );
  }, [elections, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredElections.length / rowsPerPage),
  );

  const paginatedElections = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredElections.slice(start, start + rowsPerPage);
  }, [filteredElections, currentPage, rowsPerPage]);

  const updateStatus = async (
    election: Election,
    status: "active" | "suspended",
  ) => {
    try {
      const response = await fetch(`/api/elections/${election._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      const updatedStatus = result.data.status as ElectionStatus;
      setElections((items) =>
        items.map((item) =>
          item._id === election._id ? { ...item, status: updatedStatus } : item,
        ),
      );

      toast.success(
        updatedStatus === "completed"
          ? "Election completed automatically"
          : status === "suspended"
          ? "Election suspended successfully"
          : "Election activated successfully",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update election.",
      );
    }
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const formatDate = (date: string) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const hasVotingEnded = (election: Election) => {
    if (!election.voting?.endDate || !election.voting?.endTime) {
      return false;
    }

    const endTimestamp = getElectionTimestamp(
      election.voting.endDate,
      election.voting.endTime,
    );

    if (endTimestamp === null) {
      return false;
    }

    return currentTime >= endTimestamp;
  };

  return (
    <>
      <section className="admin-table-card overflow-hidden">
        {/* Header: Rows per page + Search */}
        <div className="flex flex-col gap-4 border-b border-gray-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800">
          {/* Left → Rows per page */}
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="whitespace-nowrap">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="h-9 rounded-lg border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-[#570013] dark:border-gray-700 dark:bg-gray-900"
            >
              {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Right → Search */}
          <div className="relative w-full sm:w-72">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search elections..."
              className="h-10 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#570013] focus:ring-2 focus:ring-[#570013]/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#570013] text-xs font-semibold uppercase tracking-wider text-white">
                <th className="px-5 py-4 text-center sm:px-6">
                  Election Title
                </th>
                <th className="px-5 py-4 text-center">Voting Period</th>
                <th className="px-5 py-4 text-center">Location</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-center sm:px-6">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#570013] border-t-transparent" />
                      <p className="text-sm text-gray-500">
                        Loading elections…
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedElections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                        <svg
                          className="h-6 w-6 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {search
                          ? "No matching elections found"
                          : "No elections yet"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {search
                          ? "Try a different search term."
                          : "Create your first election to get started."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedElections.map((election) => {
                  const status = statusStyles[election.status];
                  const canToggleStatus =
                    election.status === "active" || election.status === "suspended";

                  return (
                  <tr
                    key={election._id}
                    className="group transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4 text-center sm:px-6">
                      <Link
                        href={`/admin/manage-election/list-election/${election._id}`}
                        className="font-medium text-gray-800 transition hover:text-[#570013] dark:text-white/90 dark:hover:text-[#e8b4b4]"
                      >
                        {election.name}
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-center text-gray-600 dark:text-gray-400">
                      <span>
                        {formatDate(election.voting.startDate)} -{" "}
                        {formatDate(election.voting.endDate)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center text-gray-600 dark:text-gray-400">
                      {election.location}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          status.badge
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            status.dot
                          }`}
                        />
                        {status.label}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center sm:px-6">
                      <div className="flex items-center justify-center gap-1.5">
                        <ElectionActionLinks
                          electionId={election._id}
                          hasVotingEnded={hasVotingEnded(election)}
                          includeView
                        />

                        {/* Suspend / Activate */}
                        {canToggleStatus && <button
                          type="button"
                          onClick={() =>
                            election.status === "suspended"
                              ? updateStatus(election, "active")
                              : setElectionToSuspend(election)
                          }
                          title={
                            election.status === "suspended"
                              ? "Activate election"
                              : "Suspend election"
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            election.status === "suspended"
                              ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                              : "text-[#570013] hover:bg-red-50 dark:hover:bg-red-500/10"
                          }`}
                        >
                          {election.status === "suspended" ? (
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="9"
                                strokeDasharray="3 2.5"
                              />
                              <path
                                d="M9 12.5l2.2 2.2 4.3-4.3"
                                strokeWidth="2"
                              />
                              <rect
                                x="10.8"
                                y="2.8"
                                width="2.4"
                                height="2.4"
                                rx="0.4"
                              />
                              <circle cx="19.5" cy="12" r="1.3" />
                              <path d="M4.8 16.8l1.6 1.1 1.6-1.1-1.6-1.1z" />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <line
                                x1="6.5"
                                y1="6.5"
                                x2="17.5"
                                y2="17.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          )}
                        </button>}
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && filteredElections.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:px-6 dark:border-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing <strong>{(currentPage - 1) * rowsPerPage + 1}</strong> to{" "}
              <strong>
                {Math.min(currentPage * rowsPerPage, filteredElections.length)}
              </strong>{" "}
              of <strong>{filteredElections.length}</strong> entries
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-white/5"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-[#570013] text-white"
                        : "border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/5"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-white/5"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Suspend confirmation modal */}
      {electionToSuspend && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Suspend election?
              </h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                Are you sure you want to suspend{" "}
                <strong className="font-semibold text-gray-800 dark:text-white/90">
                  {electionToSuspend.name}
                </strong>
                ? This will temporarily disable the election until it is active.
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setElectionToSuspend(null)}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateStatus(electionToSuspend, "suspended");
                  setElectionToSuspend(null);
                }}
                className="rounded-xl bg-[#570013] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#450010]"
              >
                Yes, suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
