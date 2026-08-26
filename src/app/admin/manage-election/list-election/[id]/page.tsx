import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";
import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";
import ElectionActionLinks from "@/components/admin/elections/ElectionActionLinks";
import { hasElectionPeriodEnded } from "@/lib/election-timeline-validation";
import { synchronizeElectionStatus } from "@/lib/election-status";
import type { ElectionStatus } from "@/types/Election";

type Props = { params: Promise<{ id: string }> };

export default async function ElectionDetailsPage({ params }: Props) {
  const { id } = await params;
  await connectDB();
  const election = await Election.findById(id).lean();
  if (!election) notFound();

  const synchronizedElection = await synchronizeElectionStatus(election);
  const item = JSON.parse(JSON.stringify(synchronizedElection));

  const periods = [
    { title: "Nomination period", data: item.nomination },
    { title: "Withdrawal period", data: item.withdrawal },
    { title: "Voting period", data: item.voting },
  ];

  const hasVotingEnded = hasElectionPeriodEnded(item.voting);
  const statusStyles = {
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
  } as const;
  const status = statusStyles[item.status as ElectionStatus];

  return (
    <div>
      <PageBreadcrumb pageTitle="Election details" />

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            {item.name}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {item.description || "No description provided."}
          </p>
        </div>

        <ElectionActionLinks
          electionId={item._id}
          hasVotingEnded={hasVotingEnded}
        />
      </div>

      {/* Periods */}
      <section className="grid gap-5 lg:grid-cols-3">
        {periods.map((period) => (
          <div
            key={period.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#8b1a1a]" />
              <h2 className="font-semibold text-gray-800 dark:text-white/90">
                {period.title}
              </h2>
            </div>

            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Starts
                </dt>
                <dd className="mt-1 font-medium text-gray-800 dark:text-gray-200">
                  {period.data.startDate}
                  <span className="mx-1.5 text-gray-300">·</span>
                  {period.data.startTime}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Ends
                </dt>
                <dd className="mt-1 font-medium text-gray-800 dark:text-gray-200">
                  {period.data.endDate}
                  <span className="mx-1.5 text-gray-300">·</span>
                  {period.data.endTime}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </section>

      {/* Details card */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Top info grid */}
        <div className="grid gap-6 p-5 sm:grid-cols-3 sm:p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Location
            </p>
            <p className="mt-1.5 font-medium text-gray-800 dark:text-gray-200">
              {item.location}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Eligible wings
            </p>
            <p className="mt-1.5 font-medium text-gray-800 dark:text-gray-200">
              {item.wings?.length ? item.wings.join(", ") : "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Status
            </p>
            <div className="mt-1.5">
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
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="border-t border-gray-100 px-5 py-5 dark:border-gray-800 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Posts
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.postDesignations?.length ? (
              item.postDesignations.map((post: string) => (
                <span
                  key={post}
                  className="inline-flex items-center rounded-lg border border-[#8b1a1a]/15 bg-[#8b1a1a]/5 px-3 py-1.5 text-sm font-medium text-[#8b1a1a] dark:border-[#8b1a1a]/30 dark:bg-[#8b1a1a]/10 dark:text-[#e8b4b4]"
                >
                  {post}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No posts defined</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
