"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageBreadcrumb from "@/components/admin/ui/PageBreadcrumb";
import ServiceForm, { Service } from "@/components/admin/services/ServiceForm";

function AddServiceContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [service, setService] = useState<Service | null>(null);
  const [message, setMessage] = useState("Loading service details…");

  useEffect(() => {
    if (!id) return;
    void fetch("/api/services?admin=true")
      .then(async (response) => {
        const result = await response.json();
        const found = result.data?.find((item: Service) => item._id === id);
        if (!response.ok || !found) throw new Error("Service not found.");
        setService(found);
      })
      .catch((error: Error) => setMessage(error.message));
  }, [id]);

  const editing = Boolean(id);
  return <div><PageBreadcrumb pageTitle={editing ? "Edit Service" : "Add Service"} previousPage="Manage Services" previousPageHref="/admin/manage-cms/manage-services" />{!editing || service ? <ServiceForm service={service || undefined} /> : <div className="admin-table-card mt-6 p-8 text-sm text-gray-500">{message}</div>}</div>;
}

export default function AddServicePage() {
  return <Suspense fallback={<div className="admin-table-card mt-6 p-8 text-sm text-gray-500">Loading service details…</div>}><AddServiceContent /></Suspense>;
}
