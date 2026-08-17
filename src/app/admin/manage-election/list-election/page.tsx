import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";
import ElectionList from "@/components/admin/elections/ElectionList";

export default function ListElectionPage() {
  return <div><PageBreadcrumb pageTitle="List Election" /><ElectionList /></div>;
}
