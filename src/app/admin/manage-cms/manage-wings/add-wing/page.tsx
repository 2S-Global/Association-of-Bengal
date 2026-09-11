import { Suspense } from "react";
import AddWingContent from "./AddWingContent";

export default function AddWingPage() {
  return (
    <Suspense fallback={<div className="admin-table-card mt-6 p-8 text-sm text-gray-500">Loading wing form…</div>}>
      <AddWingContent />
    </Suspense>
  );
}
