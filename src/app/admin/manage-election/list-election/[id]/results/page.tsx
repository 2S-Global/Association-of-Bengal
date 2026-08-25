import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";
import ElectionResults from "@/components/admin/elections/ElectionResults";
import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";

export default async function ElectionResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();

  const election = await Election.findById(id).lean();

  if (!election) {
    notFound();
  }

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Official Results"
        previousPage="Elections List"
        previousPageHref="/admin/manage-election/list-election"
      />

      <ElectionResults electionId={id} />
    </div>
  );
}
