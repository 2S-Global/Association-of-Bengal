"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type Candidate = {
  _id: string;
  position: string;
  wing: string;
  manifesto: string;
  member: { fullName: string; memberId: string; photoUrl: string } | null;
};

export default function ApprovedCandidateList({ electionId }: { electionId: string }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const response = await fetch(`/api/elections/${electionId}/approved-candidates`, { cache: "no-store" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Unable to load approved candidates.");
        setCandidates(result.data || []);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load approved candidates.");
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, [electionId]);

  if (loading) return <p className="py-12 text-center text-sm text-gray-500">Loading approved candidates...</p>;

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <h2 className="font-semibold text-gray-800 dark:text-white/90">Approved candidates ({candidates.length})</h2>
      </div>
      {candidates.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-gray-500">No approved candidates for this election.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="bg-[#570013] text-left text-xs font-semibold uppercase tracking-wider text-white"><th className="px-5 py-4">Candidate</th><th className="px-5 py-4">Position</th><th className="px-5 py-4">Wing</th><th className="px-5 py-4">Manifesto</th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {candidates.map((candidate) => (
                <tr key={candidate._id}>
                  <td className="px-5 py-4"><div className="flex items-center gap-3">{candidate.member?.photoUrl ? <img src={candidate.member.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#570013]/10 font-semibold text-[#570013]">{candidate.member?.fullName.charAt(0) || "?"}</div>}<div><p className="font-medium text-gray-800 dark:text-white">{candidate.member?.fullName || "Unknown candidate"}</p><p className="text-xs text-gray-500">{candidate.member?.memberId || "Member ID unavailable"}</p></div></div></td>
                  <td className="px-5 py-4 text-gray-700 dark:text-gray-300">{candidate.position}</td><td className="px-5 py-4 text-gray-700 dark:text-gray-300">{candidate.wing}</td><td className="max-w-md px-5 py-4 text-gray-600 dark:text-gray-400">{candidate.manifesto || "No manifesto provided."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
