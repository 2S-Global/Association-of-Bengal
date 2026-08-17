export const metadata = {
  title: "Dashboard | Admin Panel",
  description: "Admin dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Overview and insights will be available here soon.</p>
      </div>
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
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
