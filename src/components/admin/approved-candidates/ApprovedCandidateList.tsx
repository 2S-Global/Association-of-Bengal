"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Nomination } from "@/types/Nomination";

export default function ApprovedCandidateList({
  electionId,
}: {
  electionId: string;
}) {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return (
      <p className="py-12 text-center text-sm text-gray-500">
        Loading approved candidates...
      </p>
    );

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <h2 className="font-semibold text-gray-800 dark:text-white/90">
          Approved candidates ({nominations.length})
        </h2>
      </div>
      {nominations.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-gray-500">
          No approved candidates for this election.
        </p>
      ) : (
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
              {nominations.map((nomination) => (
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
