import Link from "next/link";
import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";
import NominationList from "@/components/admin/nominations/NominationList";
import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
};

export default async function ElectionNominationsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { status: statusParam } = await searchParams;
  const status = ["pending", "approved", "rejected", "withdrawn"].includes(statusParam || "")
    ? (statusParam as "pending" | "approved" | "rejected" | "withdrawn")
    : undefined;

  await connectDB();

  const election = await Election.findById(id).lean();

  if (!election) {
    notFound();
  }

  const item = JSON.parse(JSON.stringify(election));

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Election nominations"
        previousPage="Elections List"
        previousPageHref="/admin/manage-election/list-election"
      />

      {/* Page header */}
      <div className="admin-card mb-5 flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
        <div>
          <h1 className="admin-page-title">
            {item.name}
          </h1>

          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Review and approve candidates who submitted nominations for this
            election.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/manage-election/list-election/${item._id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/5"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Election details
          </Link>

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
      </div>

      {/* Election information */}
      <section className="mb-5 grid gap-4 sm:grid-cols-3">
        {/* Location */}
        <div className="admin-card border-l-4 border-l-[#B88A44] p-5 dark:border-l-[#B88A44]">
          <p className="text-xs font-medium uppercase tracking-wide text-[#8B1A1A] dark:text-[#C9A15A]">
            Location
          </p>

          <p className="mt-1.5 font-medium text-gray-800 dark:text-gray-200">
            {item.location || "—"}
          </p>
        </div>

        {/* Eligible wings */}
        <div className="admin-card border-l-4 border-l-[#8B1A1A] p-5 dark:border-l-[#8B1A1A]">
          <p className="text-xs font-medium uppercase tracking-wide text-[#8B1A1A] dark:text-[#C9A15A]">
            Eligible wings
          </p>

          <p className="mt-1.5 font-medium text-gray-800 dark:text-gray-200">
            {item.wings?.length ? item.wings.join(", ") : "—"}
          </p>
        </div>

        {/* Posts */}
        <div className="admin-card border-l-4 border-l-[#B88A44] p-5 dark:border-l-[#B88A44]">
          <p className="text-xs font-medium uppercase tracking-wide text-[#8B1A1A] dark:text-[#C9A15A]">
            Posts
          </p>

          <p className="mt-1.5 font-medium text-gray-800 dark:text-gray-200">
            {item.postDesignations?.length
              ? item.postDesignations.join(", ")
              : "—"}
          </p>
        </div>
      </section>

      {/* Nominations */}
      <NominationList
        electionId={item._id}
        status={status}
        voting={item.voting}
      />
    </div>
  );
}
