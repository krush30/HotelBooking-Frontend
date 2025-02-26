import VendorHeader from "@/app/components/VendorHeader";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <VendorHeader />
      <main className="flex-1 p-6 mt-16">{children}</main>
    </div>
  );
}
