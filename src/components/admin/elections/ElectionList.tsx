"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Election = {
  _id: string;
  name: string;
  location: string;
  voting: { startDate: string; startTime: string };
  status?: "active" | "suspended";
};

export default function ElectionList() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [electionToSuspend, setElectionToSuspend] = useState<Election | null>(null);

  const loadElections = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/elections");
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setElections(result.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load elections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  const updateStatus = async (election: Election, status: "active" | "suspended") => {
    try {
      const response = await fetch(`/api/elections/${election._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setElections((items) =>
        items.map((item) =>
          item._id === election._id ? { ...item, status } : item
        )
      );

      toast.success(
        status === "suspended"
          ? "Election suspended successfully"
          : "Election activated successfully"
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update election.");
    }
  };

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col gap-1 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Saved Elections
            </h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Manage all elections — view, edit or suspend
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#8b1a1a] text-xs font-semibold uppercase tracking-wider text-white">
                <th className="px-5 py-4 sm:px-6 text-center">Election Title</th>
                <th className="px-5 py-4 text-center">Voting Starts</th>
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
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8b1a1a] border-t-transparent" />
                      <p className="text-sm text-gray-500">Loading elections…</p>
                    </div>
                  </td>
                </tr>
              ) : elections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        No elections yet
                      </p>
                      <p className="text-sm text-gray-500">
                        Create your first election to get started.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                elections.map((election) => (
                  <tr
                    key={election._id}
                    className="group transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                  >
                    {/* Election Title */}
                    <td className="px-5 py-4 sm:px-6 text-center">
                      <Link
                        href={`/admin/manage-election/list-election/${election._id}`}
                        className="font-medium text-gray-800 transition hover:text-[#8b1a1a] dark:text-white/90 dark:hover:text-[#e8b4b4]"
                      >
                        {election.name}
                      </Link>
                    </td>

                    {/* Voting Starts */}
                    <td className="px-5 py-4 text-center text-gray-600 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <span>{election.voting.startDate}</span>
                        <span className="text-xs text-gray-400">{election.voting.startTime}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 text-center text-gray-600 dark:text-gray-400">
                      {election.location}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          election.status === "suspended"
                            ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            election.status === "suspended" ? "bg-red-500" : "bg-emerald-500"
                          }`}
                        />
                        {election.status === "suspended" ? "Suspended" : "Active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View */}
                        <Link
                          href={`/admin/manage-election/list-election/${election._id}`}
                          title="View"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-[#8b1a1a]/10 hover:text-[#8b1a1a] dark:hover:bg-[#8b1a1a]/20 dark:hover:text-[#e8b4b4]"
                        >
                          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/admin/manage-election/list-election/${election._id}/edit`}
                          title="Edit"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-[#8b1a1a]/10 hover:text-[#8b1a1a] dark:hover:bg-[#8b1a1a]/20 dark:hover:text-[#e8b4b4]"
                        >
                          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </Link>

                        {/* Suspend / Activate */}
                        <button
                          type="button"
                          onClick={() =>
                            election.status === "suspended"
                              ? updateStatus(election, "active")
                              : setElectionToSuspend(election)
                          }
                          title={election.status === "suspended" ? "Activate election" : "Suspend election"}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            election.status === "suspended"
                              ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                              : "text-[#8b1a1a] hover:bg-red-50 dark:hover:bg-red-500/10"
                          }`}
                        >
                          {election.status === "suspended" ? (
                            // Active icon
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="9" strokeDasharray="3 2.5" />
                              <path d="M9 12.5l2.2 2.2 4.3-4.3" strokeWidth="2" />
                              <rect x="10.8" y="2.8" width="2.4" height="2.4" rx="0.4" />
                              <circle cx="19.5" cy="12" r="1.3" />
                              <path d="M4.8 16.8l1.6 1.1 1.6-1.1-1.6-1.1z" />
                            </svg>
                          ) : (
                            // Suspend icon
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
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
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
                className="rounded-xl bg-[#8b1a1a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#6d1414]"
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