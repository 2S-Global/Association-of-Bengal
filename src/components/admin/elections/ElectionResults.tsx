"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type CandidateResult = {
  _id: string;
  fullName: string;
  memberId: string;
  photoUrl: string;
  position: string;
  wing: string;
  votes: number;
  percentage: number;
};

type Results = {
  election: {
    _id: string;
    name: string;
    location: string;
    voting: {
      startDate: string;
      startTime: string;
      endDate: string;
      endTime: string;
    };
  };
  totalBallots: number;
  auditStatus: string;
  candidates: CandidateResult[];
};

export default function ElectionResults({
  electionId,
}: {
  electionId: string;
}) {
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/elections/${electionId}/results`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to load voting results.");
        }

        setResults(result.data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load voting results.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [electionId]);

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#570013] border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading voting results…
          </p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
          <svg
            className="h-7 w-7 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Voting results are unavailable
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Please try again later or contact support.
        </p>
      </div>
    );
  }

  // Determine winners per position
  const winnerIds = new Set<string>();
  const positionHighestVotes = new Map<string, number>();

  for (const candidate of results.candidates) {
    const currentHighest = positionHighestVotes.get(candidate.position) ?? -1;
    if (candidate.votes > currentHighest) {
      positionHighestVotes.set(candidate.position, candidate.votes);
    }
  }

  for (const candidate of results.candidates) {
    const highest = positionHighestVotes.get(candidate.position);
    if (
      highest !== undefined &&
      candidate.votes === highest &&
      candidate.votes > 0
    ) {
      winnerIds.add(candidate._id);
    }
  }

  const formatDate = (date: string) => {
    if (!date) return "—";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return date;
    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#570013] via-[#6d1414] to-[#8d6412] px-6 py-8 text-white shadow-lg sm:px-8 sm:py-10">
        {/* subtle pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Results Certified
          </div>

          <h1 className="max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            {results.election.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-white/90">
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {results.election.location}
            </span>

            <span className="hidden text-white/40 sm:inline">•</span>

            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {results.totalBallots} Total Ballots
            </span>
          </div>

          <p className="mt-3 text-xs text-white/70">
            Voting ended on {formatDate(results.election.voting.endDate)} at{" "}
            {results.election.voting.endTime}
          </p>
        </div>
      </section>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Ballots Cast
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-[#570013] dark:text-[#e8b4b4]">
                {results.totalBallots.toLocaleString()}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#570013]/10 text-[#570013] dark:bg-[#570013]/20 dark:text-[#e8b4b4]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Audit Status
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {results.auditStatus}
                </span>
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tally Breakdown */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 dark:border-gray-800 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#570013]/10 text-[#570013] dark:bg-[#570013]/20 dark:text-[#e8b4b4]">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19V5" />
              <path d="M4 19h16" />
              <path d="M8 16v-5" />
              <path d="M12 16V8" />
              <path d="M16 16v-9" />
              <path d="M20 16v-3" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Tally Breakdown
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ranked results by position
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          {results.candidates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 px-5 py-12 text-center dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No approved candidates found for this election.
              </p>
            </div>
          ) : (
            results.candidates.map((candidate, index) => {
              const isWinner = winnerIds.has(candidate._id);

              return (
                <div
                  key={candidate._id}
                  className={`rounded-2xl border p-5 transition ${
                    isWinner
                      ? "border-[#570013]/40 bg-[#570013]/[0.04] shadow-sm dark:border-[#570013]/50 dark:bg-[#570013]/10"
                      : "border-gray-200 bg-gray-50/40 dark:border-gray-700 dark:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left: Rank + Photo + Info */}
                    <div className="flex min-w-0 items-center gap-4">
                      {/* Rank */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          index === 0
                            ? "bg-[#570013] text-white"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Photo */}
                      {candidate.photoUrl ? (
                        <img
                          src={candidate.photoUrl}
                          alt={candidate.fullName}
                          className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-gray-900"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          {candidate.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Details */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-semibold text-gray-800 dark:text-white">
                            {candidate.fullName}
                          </h3>

                          {isWinner && (
                            <span className="inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                              Elected
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          {candidate.position}
                          {candidate.wing ? ` · ${candidate.wing}` : ""}
                        </p>

                        {candidate.memberId && (
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                            ID: {candidate.memberId}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Votes */}
                    <div className="shrink-0 text-left sm:text-right">
                      <p className="text-xl font-bold text-[#570013] dark:text-[#e8b4b4]">
                        {candidate.votes.toLocaleString()}
                        <span className="ml-1 text-sm font-medium text-gray-500">
                          {candidate.votes === 1 ? "vote" : "votes"}
                        </span>
                      </p>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        {candidate.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWinner ? "bg-[#570013]" : "bg-[#8d6412]"
                        }`}
                        style={{
                          width: `${Math.min(Math.max(candidate.percentage, 0), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}