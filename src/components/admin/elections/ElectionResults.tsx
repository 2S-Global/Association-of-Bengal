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
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#570013] border-t-transparent" />

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading voting results...
          </p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Voting results are unavailable.
        </p>
      </div>
    );
  }

  const winnerIds = new Set<string>();

  /*
   * Determine the highest vote count for each position.
   *
   * This allows the "Elected" badge to be meaningful
   * when an election contains multiple positions.
   */
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

  return (
    <div className="space-y-6">
      {/* Results Hero */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#8d6412] via-[#713b15] to-[#570013] px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
        <div className="mb-4 inline-flex items-center rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
          Results Certified
        </div>

        <h2 className="max-w-3xl text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
          {results.election.name}
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/90 sm:text-base">
          <span>{results.election.location}</span>

          <span className="text-white/50">•</span>

          <span>Total Ballots: {results.totalBallots}</span>
        </div>

        <p className="mt-2 text-xs text-white/70">
          Voting ended on {formatDate(results.election.voting.endDate)} at{" "}
          {results.election.voting.endTime}
        </p>
      </section>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Total Ballots */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Ballots Cast
          </p>

          <p className="mt-2 text-3xl font-bold text-[#8d6412] dark:text-[#e8b4b4]">
            {results.totalBallots}
          </p>
        </div>

        {/* Audit */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Audit Status
          </p>

          <div className="mt-2 flex items-center gap-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2l2.09 1.26 2.43-.04 1.19 2.12 2.12 1.19-.04 2.43L21 11l-1.26 2.09.04 2.43-2.12 1.19-1.19 2.12-2.43-.04L12 20l-2.09-1.26-2.43.04-1.19-2.12-2.12-1.19.04-2.43L3 11l1.26-2.09-.04-2.43 2.12-1.19 1.19-2.12 2.43.04L12 2z" />

              <path
                d="M9 12.5l2 2 4-4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {results.auditStatus}
          </div>
        </div>
      </div>

      {/* Tally Breakdown */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-5 dark:border-gray-800 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8d6412]/10 text-[#8d6412] dark:bg-[#8d6412]/20 dark:text-[#e8b4b4]">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19V5" />
                <path d="M4 19h17" />
                <path d="M8 16v-5" />
                <path d="M12 16V8" />
                <path d="M16 16V4" />
                <path d="M20 16v-2" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-[#8d6412] dark:text-[#e8b4b4]">
              Tally Breakdown
            </h2>
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          {results.candidates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center dark:border-gray-700">
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
                      ? "border-[#8d6412] bg-[#8d6412]/5 shadow-sm dark:bg-[#8d6412]/10"
                      : "border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-white/[0.02]"
                  }`}
                >
                  {/* Candidate top row */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      {/* Rank */}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          index === 0
                            ? "bg-[#8d6412] text-white"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
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

                      {/* Candidate information */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                            {candidate.fullName}
                          </h3>

                          {isWinner && (
                            <span className="inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                              Elected
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {candidate.position}
                          {candidate.wing ? ` · ${candidate.wing}` : ""}
                        </p>

                        {candidate.memberId && (
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                            {candidate.memberId}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Votes */}
                    <div className="shrink-0 sm:text-right">
                      <p className="text-xl font-bold text-[#8d6412] dark:text-[#e8b4b4]">
                        {candidate.votes}{" "}
                        {candidate.votes === 1 ? "vote" : "votes"}
                      </p>

                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        {candidate.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isWinner ? "bg-[#8d6412]" : "bg-[#570013]"
                        }`}
                        style={{
                          width: `${Math.min(candidate.percentage, 100)}%`,
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
