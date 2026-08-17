"use client";

import "./admin.css";
import { SidebarProvider, useSidebar } from "@/context/admin/SidebarContext";
import AppHeader from "@/components/admin/layout/AppHeader";
import AppSidebar from "@/components/admin/layout/AppSidebar";
import Backdrop from "@/components/admin/layout/Backdrop";
import { usePathname } from "next/navigation";
import React from "react";
import { Toaster } from "sonner";

function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="admin-shell min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="light"
        toastOptions={{
          classNames: {
            toast: "relative",
            closeButton: "!left-auto !right-2 !top-1/2 !-translate-y-1/2",
          },
        }}
      />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminShell>{children}</AdminShell>
    </SidebarProvider>
  );
}