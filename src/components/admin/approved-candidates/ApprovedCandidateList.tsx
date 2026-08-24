"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Nomination } from "@/types/Nomination";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function ApprovedCandidateList({
  electionId,
}: {
  electionId: string;
}) {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const response = await fetch(
          `/api/nominations?election=${encodeURIComponent(electionId)}&status=approved`,
          { cache: "no-store" },
        );
        const result = await response.json();
        if (!response.ok)
          throw new Error(
            result.message || "Unable to load approved candidates.",
          );
        setNominations(result.data || []);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load approved candidates.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, [electionId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rowsPerPage]);

  const filteredNominations = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return nominations;

    return nominations.filter((nomination) =>
      [
        nomination.member?.fullName,
        nomination.member?.memberId,
        nomination.position,
        nomination.wing,
        nomination.manifesto,
      ].some((value) => value?.toLowerCase().includes(term)),
    );
  }, [nominations, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNominations.length / rowsPerPage),
  );

  const paginatedNominations = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredNominations.slice(start, start + rowsPerPage);
  }, [filteredNominations, currentPage, rowsPerPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page++) pages.push(page);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let page = start; page <= end; page++) pages.push(page);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-3 py-3 dark:border-gray-800">
        <h2 className="font-semibold text-gray-800 dark:text-white/90">
          Approved candidates ({nominations.length})
        </h2>
      </div>

      {/* Header: Rows per page + Search */}
      <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="whitespace-nowrap">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(event) => setRowsPerPage(Number(event.target.value))}
            className="h-9 rounded-lg border border-gray-300 bg-white px-2.5 text-sm outline-none focus:border-[#570013] dark:border-gray-700 dark:bg-gray-900"
          >
            {ROWS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

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
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search candidates..."
            className="h-10 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#570013] focus:ring-2 focus:ring-[#570013]/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#570013] text-left text-xs font-semibold uppercase tracking-wider text-white">
                <th className="px-5 py-4">Candidate</th>
                <th className="px-5 py-4">Position</th>
                <th className="px-5 py-4">Wing</th>
                <th className="px-5 py-4">Manifesto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#570013] border-t-transparent" />
                      <p className="text-sm text-gray-500">
                        Loading approved candidates...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedNominations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
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
                          ? "No matching approved candidates found"
                          : "No approved candidates for this election."}
                      </p>
                      {search && (
                        <p className="text-sm text-gray-500">
                          Try a different search term.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedNominations.map((nomination) => (
                <tr key={nomination._id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {nomination.member?.photoUrl ? (
                        <img
                          src={nomination.member.photoUrl}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#570013]/10 font-semibold text-[#570013]">
                          {nomination.member?.fullName.charAt(0) || "?"}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {nomination.member?.fullName || "Unknown candidate"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {nomination.member?.memberId ||
                            "Member ID unavailable"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                    {nomination.position}
                  </td>
                  <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                    {nomination.wing}
                  </td>
                  <td className="max-w-md px-5 py-4 text-gray-600 dark:text-gray-400">
                    {nomination.manifesto || "No manifesto provided."}
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      {!loading && filteredNominations.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:px-6 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing <strong>{(currentPage - 1) * rowsPerPage + 1}</strong> to{" "}
            <strong>
              {Math.min(currentPage * rowsPerPage, filteredNominations.length)}
            </strong>{" "}
            of <strong>{filteredNominations.length}</strong> entries
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-white/5"
            >
              <span aria-hidden="true">&lt;</span>
            </button>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
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
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-white/5"
            >
              <span aria-hidden="true">&gt;</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
