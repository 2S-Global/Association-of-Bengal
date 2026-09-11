"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";
import WingForm, { Wing } from "@/components/admin/wings/WingForm";

export default function AddWingPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [wing, setWing] = useState<Wing | null>(null);
  const [message, setMessage] = useState("Loading wing details…");

  useEffect(() => {
    if (!id) return;
    void fetch("/api/wings?admin=true")
      .then(async (response) => {
        const result = await response.json();
        const found = result.data?.find((item: Wing) => item.id === id);
        if (!response.ok || !found) throw new Error("Wing not found.");
        setWing(found);
      })
      .catch((error: Error) => setMessage(error.message));
  }, [id]);

  const editing = Boolean(id);
  return (
    <div>
      <PageBreadcrumb
        pageTitle={editing ? "Edit Wing" : "Add Wing"}
        previousPage="Manage Wings"
        previousPageHref="/admin/manage-cms/manage-wings"
      />
      <div className="admin-page-header">
        <p className="admin-page-description">
          {editing
            ? "Update the selected wing details."
            : "Add a membership wing for use throughout the portal."}
        </p>
      </div>
      {!editing || wing ? (
        <WingForm wing={wing || undefined} />
      ) : (
        <div className="admin-table-card mt-6 p-8 text-sm text-gray-500">
          {message}
        </div>
      )}
    </div>
  );
}
