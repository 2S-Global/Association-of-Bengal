import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";
import AddElectionForm from "@/components/admin/elections/AddElectionForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Election | Bengal Association Administration",
  description: "Create and schedule a Bengal Association election.",
};

export default function AddElectionPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Election" />
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Set the election details, key dates and eligible wings.
        </p>
      </div>
      <AddElectionForm />
    </div>
  );
}
