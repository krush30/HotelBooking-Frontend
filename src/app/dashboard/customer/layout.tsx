import CustomerHeader from "@/app/components/CustomerHeader";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <CustomerHeader />

      {/* Main Layout with Sidebar and Content */}
      <div className="flex flex-1">
        {/* Sidebar for Navigation */}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-6">
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
