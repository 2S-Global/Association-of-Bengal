import Link from "next/link";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";
import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";
import Member from "@/models/Member";
import Nomination from "@/models/Nomination";

type Props = {
  params: Promise<{ id: string; nominationId: string }>;
};

type UserContact = { email?: string; mobile?: string };
type ContributionSummary = { count: number; total: number };

const formatDate = (value?: string | Date | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

export default async function CandidateDetailsPage({ params }: Props) {
  const { id, nominationId } = await params;

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(nominationId)
  ) {
    notFound();
  }

  await connectDB();

  const [election, nomination] = await Promise.all([
    Election.findById(id).lean(),
    Nomination.findOne({ _id: nominationId, election: id }).lean(),
  ]);

  if (!election || !nomination) notFound();

  const member = await Member.findById(nomination.member).lean();
  if (!member) notFound();

  const [user, contributions] = await Promise.all([
    member.user
      ? mongoose.connection
          .collection<UserContact>("users")
          .findOne({ _id: member.user }, { projection: { email: 1, mobile: 1 } })
      : null,
    mongoose.connection
      .collection("donations")
      .aggregate<ContributionSummary>([
        { $match: { member: member._id, status: "completed" } },
        { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$amount" } } },
        { $project: { _id: 0, count: 1, total: 1 } },
      ])
      .toArray(),
  ]);

  const contributionSummary = contributions[0] || { count: 0, total: 0 };
  const item = JSON.parse(JSON.stringify({ election, nomination, member }));
  const nominationsHref = `/admin/manage-election/list-election/${id}/nominations?status=${item.nomination.status}`;
  const statusStyle =
    item.nomination.status === "approved"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
      : item.nomination.status === "rejected"
        ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
        : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Candidate details"
        previousPage="Election nominations"
        previousPageHref={nominationsHref}
      />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {item.member.photoUrl ? (
            <img src={item.member.photoUrl} alt={item.member.fullName} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-[#570013]/10 dark:ring-[#e8b4b4]/20" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#570013]/10 text-xl font-semibold text-[#570013] dark:bg-[#570013]/20 dark:text-[#e8b4b4]">
              {item.member.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{item.member.fullName}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.member.memberId || "Member ID unavailable"} · Candidate for {item.nomination.position}</p>
          </div>
        </div>
        <Link href={nominationsHref} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/5">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to nominations
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="grid gap-5 border-b border-gray-100 p-5 sm:grid-cols-2 lg:grid-cols-4 dark:border-gray-800 sm:p-6">
          <Info label="Election" value={item.election.name} />
          <Info label="Applied for" value={item.nomination.position} />
          <Info label="Wing" value={item.nomination.wing} />
          <div><p className="text-xs font-medium uppercase tracking-wide text-gray-400">Nomination status</p><span className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle}`}>{item.nomination.status.charAt(0).toUpperCase() + item.nomination.status.slice(1)}</span></div>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-2 sm:p-6">
          <DetailsCard title="Member profile">
            <Detail label="Member ID" value={item.member.memberId} />
            <Detail label="Location" value={item.member.location?.country} />
            <Detail label="Member since" value={item.member.memberSince?.toString()} />
            <Detail label="Account status" value={item.member.isActive === false ? "Inactive" : "Active"} />
            <Detail label="Verification" value={item.member.verified ? `Verified ${formatDate(item.member.verifiedAt)}` : "Not verified"} />
            <div className="sm:col-span-2"><p className="text-xs text-gray-400">Wings</p><div className="mt-1.5 flex flex-wrap gap-2">{item.member.wings?.length ? item.member.wings.map((wing: string) => <span key={wing} className="rounded-lg bg-[#570013]/5 px-2.5 py-1 text-xs font-medium text-[#570013] dark:bg-[#570013]/15 dark:text-[#e8b4b4]">{wing}</span>) : <span className="text-sm text-gray-600 dark:text-gray-400">—</span>}</div></div>
          </DetailsCard>

          <DetailsCard title="Contact & contributions">
            <Detail label="Email" value={user?.email} />
            <Detail label="Mobile" value={user?.mobile} />
            <Detail label="Recorded contributions" value={contributionSummary.count.toString()} />
            <Detail label="Contribution total" value={`₹${contributionSummary.total.toLocaleString("en-IN")}`} />
            <div className="sm:col-span-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:bg-white/[0.04] dark:text-gray-400">Profile total contributions: <strong className="font-semibold text-gray-800 dark:text-gray-200">₹{(item.member.totalContributions || 0).toLocaleString("en-IN")}</strong></div>
          </DetailsCard>
        </div>

        <div className="border-t border-gray-100 p-5 dark:border-gray-800 sm:p-6">
          <p className="text-sm font-semibold text-gray-800 dark:text-white/90">Nomination statement</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.nomination.manifesto || "No manifesto provided."}</p>
          <p className="mt-4 text-xs text-gray-400">Submitted {formatDate(item.nomination.createdAt)} · Terms accepted: {item.nomination.agreedToTerms ? "Yes" : "No"}</p>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return <div><p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p><p className="mt-1.5 font-medium text-gray-800 dark:text-gray-200">{value || "—"}</p></div>;
}

function Detail({ label, value }: { label: string; value?: string }) {
  return <div><p className="text-xs text-gray-400">{label}</p><p className="mt-1 font-medium text-gray-800 dark:text-gray-200">{value || "—"}</p></div>;
}

function DetailsCard({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border border-gray-100 p-5 dark:border-gray-800"><h2 className="mb-5 font-semibold text-gray-800 dark:text-white/90">{title}</h2><div className="grid gap-5 sm:grid-cols-2">{children}</div></section>;
}
