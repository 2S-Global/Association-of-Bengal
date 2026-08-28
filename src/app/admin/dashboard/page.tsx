export const metadata = {
  title: "Dashboard | Admin Panel",
  description: "Admin dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-description">Overview and insights will be available here soon.</p>
      </div>
      <div className="admin-card p-6 sm:p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">✓</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Welcome to the admin dashboard</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">Use the sidebar to manage the election portal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
