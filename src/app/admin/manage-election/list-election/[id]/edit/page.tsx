import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";
import AddElectionForm, { ElectionFormData } from "@/components/admin/elections/AddElectionForm";
import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";

type Props = { params: Promise<{ id: string }> };

export default async function EditElectionPage({ params }: Props) {
  const { id } = await params;
  await connectDB();
  const election = await Election.findById(id).lean();
  if (!election) notFound();
  const initialElection = JSON.parse(JSON.stringify(election)) as ElectionFormData;

  return <div><PageBreadcrumb pageTitle="Edit election" previousPage="Election list" previousPageHref="/admin/manage-election/list-election" /><div className="mb-6"><p className="text-sm text-gray-500 dark:text-gray-400">Update the election details, key dates, and eligible wings.</p></div><AddElectionForm initialElection={initialElection} /></div>;
}
