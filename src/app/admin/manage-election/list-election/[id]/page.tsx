import Link from "next/link";
import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";
import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";

type Props = { params: Promise<{ id: string }> };

export default async function ElectionDetailsPage({ params }: Props) {
  const { id } = await params;
  await connectDB();
  const election = await Election.findById(id).lean();
  if (!election) notFound();

  const item = JSON.parse(JSON.stringify(election));

  const periods = [
    { title: "Nomination period", data: item.nomination },
    { title: "Withdrawal period", data: item.withdrawal },
    { title: "Voting period", data: item.voting },
  ];

  const isSuspended = item.status === "suspended";

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

        <Link
          href={`/admin/manage-election/list-election/${item._id}/edit`}
          className="inline-flex items-center gap-2 rounded-xl bg-[#8b1a1a] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#6d1414]"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
          Edit election
        </Link>
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
                  isSuspended
                    ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSuspended ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />
                {isSuspended ? "Suspended" : "Active"}
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