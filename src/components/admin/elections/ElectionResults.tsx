"use client";

import {
  CalendarDays,
  MapPin,
  Medal,
  ShieldCheck,
  Trophy,
  Vote,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
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
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/elections/${electionId}/results`, {
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Unable to load voting results.");
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
    load();
  }, [electionId]);
  if (loading)
    return (
      <div className="admin-card flex min-h-[360px] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#570013] border-t-transparent" />
      </div>
    );
  if (!results)
    return (
      <div className="admin-card px-6 py-16 text-center">
        <Vote className="mx-auto h-7 w-7 text-gray-400" />
        <p className="mt-3 text-sm text-gray-500">
          Voting results are unavailable.
        </p>
      </div>
    );
  const topVotes = new Map<string, number>();
  results.candidates.forEach((candidate) =>
    topVotes.set(
      candidate.position,
      Math.max(topVotes.get(candidate.position) ?? -1, candidate.votes),
    ),
  );
  const groups = results.candidates.reduce<Record<string, CandidateResult[]>>(
    (all, candidate) => {
      (all[candidate.position] ||= []).push(candidate);
      return all;
    },
    {},
  );
  const date = (value: string) =>
    value
      ? new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";
  return (
    <div className="space-y-5">
      <section className="admin-card overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-5 p-5 sm:p-6">
          <div>
            <div className="mb-3 flex gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                {results.auditStatus}
              </span>
              <span className="admin-detail-label">Official results</span>
            </div>
            <h1 className="admin-page-title">{results.election.name}</h1>
            <p className="admin-page-description">
              Verified election tally and candidate outcome overview.
            </p>
          </div>
          <div className="admin-muted-surface rounded-lg border border-gray-200 px-4 py-3 text-right">
            <p className="admin-detail-label">Voting closed</p>
            <p className="mt-1 text-sm font-semibold">
              {date(results.election.voting.endDate)}
            </p>
            <p className="text-xs text-gray-500">
              {results.election.voting.endTime}
            </p>
          </div>
        </div>
        <div className="grid border-t border-gray-100 sm:grid-cols-2">
          <div className="flex items-center gap-3 p-4 sm:border-r">
            <span className="admin-icon-tile bg-[#570013]/10 text-[#570013]">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <p className="admin-detail-label">Location</p>
              <p className="mt-1 text-sm font-medium">
                {results.election.location || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <span className="admin-icon-tile bg-[#7b5800]/10 text-[#7b5800]">
              <CalendarDays className="h-4 w-4" />
            </span>
            <div>
              <p className="admin-detail-label">Voting period</p>
              <p className="mt-1 text-sm font-medium">
                {date(results.election.voting.startDate)} –{" "}
                {date(results.election.voting.endDate)}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Metric
          label="Total ballots"
          value={results.totalBallots.toLocaleString()}
          icon={<Vote className="h-5 w-5" />}
          tone="maroon"
        />
        <Metric
          label="Contested posts"
          value={String(Object.keys(groups).length)}
          icon={<Medal className="h-5 w-5" />}
          tone="gold"
        />
        <Metric
          label="Result status"
          value={results.auditStatus}
          icon={<ShieldCheck className="h-5 w-5" />}
          tone="green"
        />
      </section>
      <section className="admin-card overflow-hidden">
        <div className="admin-card-header flex items-center gap-3">
          <span className="admin-icon-tile bg-[#570013]/10 text-[#570013]">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <h2 className="admin-section-title">Results by designation</h2>
            <p className="admin-section-description">
              Candidate tallies grouped by contested post.
            </p>
          </div>
        </div>
        <div className="space-y-5 p-5">
          {Object.entries(groups).map(([position, candidates]) => (
            <div
              key={position}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="admin-muted-surface flex justify-between border-b border-gray-200 px-4 py-3">
                <h3 className="text-sm font-semibold">{position}</h3>
                <span className="text-xs text-gray-500">
                  {candidates.length} candidates
                </span>
              </div>
              {candidates.map((candidate, index) => {
                const winner =
                  candidate.votes > 0 &&
                  candidate.votes === topVotes.get(position);
                return (
                  <div
                    key={candidate._id}
                    className={`grid gap-4 border-b border-gray-100 p-4 last:border-0 sm:grid-cols-[1fr_150px] sm:items-center ${winner ? "admin-result-winner" : "hover:bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold ${winner ? "bg-[#570013] text-white" : "bg-gray-100"}`}
                      >
                        {index + 1}
                      </span>
                      {candidate.photoUrl ? (
                        <img
                          src={candidate.photoUrl}
                          alt={candidate.fullName}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#570013]/10 font-semibold text-[#570013]">
                          {candidate.fullName.charAt(0)}
                        </span>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/manage-election/list-election/${electionId}/nominations/${candidate._id}`}
                            className="text-sm font-semibold text-gray-800 hover:text-[#570013] hover:underline"
                          >
                            {candidate.fullName}
                          </Link>
                          {winner && (
                            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                              Elected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {candidate.wing || "Wing unavailable"}
                          {candidate.memberId ? ` · ${candidate.memberId}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-lg font-bold text-[#570013]">
                        {candidate.votes}{" "}
                        <span className="text-xs font-medium text-gray-500">
                          votes
                        </span>
                      </p>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={
                            winner
                              ? "h-full bg-[#570013]"
                              : "h-full bg-[#8d6412]"
                          }
                          style={{
                            width: `${Math.min(Math.max(candidate.percentage, 0), 100)}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {candidate.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone: "maroon" | "gold" | "green";
}) {
  const colors = {
    maroon: "bg-[#570013]/10 text-[#570013]",
    gold: "bg-[#7b5800]/10 text-[#7b5800]",
    green: "bg-emerald-50 text-emerald-600",
  };
  return (
    <div className="admin-card admin-interactive-card p-5">
      <div className="flex justify-between">
        <div>
          <p className="admin-detail-label">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <span className={`admin-icon-tile ${colors[tone]}`}>{icon}</span>
      </div>
    </div>
  );
}
