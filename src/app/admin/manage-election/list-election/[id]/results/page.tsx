import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";
import ElectionResults from "@/components/admin/elections/ElectionResults";
import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";

export default async function ElectionResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const election = await Election.findById(id).lean();
  if (!election) notFound();
  return <div><PageBreadcrumb pageTitle="Voting results" previousPage="Elections List" previousPageHref="/admin/manage-election/list-election" /><div className="mb-6"><h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{election.name}</h1><p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Final vote totals and voter information.</p></div><ElectionResults electionId={id} /></div>;
}
