export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {/* <aside className="w-64 bg-blue-600 text-white p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <ul className="mt-6 space-y-4">
          <li>
            <a
              href="/admin"
              className="block px-4 py-2 rounded hover:bg-blue-700"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/admin/users"
              className="block px-4 py-2 rounded hover:bg-blue-700"
            >
              Manage Users
            </a>
          </li>
          <li>
            <a
              href="/admin/reports"
              className="block px-4 py-2 rounded hover:bg-blue-700"
            >
              Reports
            </a>
          </li>
        </ul>
      </aside> */}

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
