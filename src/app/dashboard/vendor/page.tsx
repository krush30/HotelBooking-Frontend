"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddListingModal from "@/app/components/Vendors/AddListingModal";
// import VendorListingsModal from "@/app/components/Vendors/ViewVendorListing";
import AddUnitsModal from "@/app/components/Vendors/AddUnitsModal";
import { FaHotel } from "react-icons/fa";
export interface ListingData {
  type: string;
  name: string;
  address: string;
  description: string;
  facilities: string[];
  pricing: number;
  images: string;
  vendorId: number;
}
export default function VendorDashboard() {
  const router = useRouter();
  interface Vendor {
    name: string;
    id: number;
    email: string;
    // Add other properties as needed
  }

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  // const [isListingsModalOpen, setListingsModalOpen] = useState(false);
  const [isUnitsModalOpen, setUnitsModalOpen] = useState(false);

  const handleAddListing = async (data: ListingData): Promise<void> => {
    try {
      const token =
        typeof window != "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach token in the request
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add listing: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Listing added successfully:", result);
    } catch (error) {
      console.error("Error adding listing:", error);
    }
  };

  useEffect(() => {
    const token =
      typeof window != "undefined" ? localStorage.getItem("token") : null;
    const role =
      typeof window != "undefined" ? localStorage.getItem("role") : null;
    const user =
      typeof window != "undefined" ? localStorage.getItem("user") : null;

    if (!token || role !== "vendor") {
      router.push("/auth/login");
      return;
    }

    if (user) {
      setVendor(JSON.parse(user));
    }
  }, [router]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white shadow-xl rounded-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                  Welcome, {vendor?.name}! 🎉
                </h1>
                <p className="mt-3 text-lg text-gray-600 leading-relaxed">
                  Manage your listings and grow your business with ease.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="relative w-16 h-16 bg-gradient-to-br from-orange-200 via-orange-100 to-yellow-100 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group">
                  {/* Animated Ring Effect */}
                  <div className="absolute inset-0 rounded-full border-2 border-orange-300 opacity-50 group-hover:animate-pulse group-hover:border-orange-500 transition-opacity"></div>

                  {/* Emoji with Bounce */}
                  <span className="text-3xl transform group-hover:scale-110 transition-transform duration-200">
                    👋
                  </span>

                  {/* Subtle Glow */}
                  <div className="absolute inset-0 bg-orange-200 opacity-0 group-hover:opacity-20 rounded-full blur-md transition-opacity duration-300"></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  router.push(`vendor/listings?vendorId=${vendor?.id}`)
                }
                className="relative px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold overflow-hidden group hover:bg-orange-700 transition-all duration-300"
              >
                <span className="relative z-10">📋 View My Listings</span>
                <div className="absolute inset-0 bg-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </button>
              {/* <VendorListingsModal
                isOpen={isListingsModalOpen}
                onClose={() => setListingsModalOpen(false)}
                vendorId={vendor?.id?.toString() || ""}
              /> */}
              <div>
                <button
                  onClick={() => setModalOpen(true)}
                  className=" bg-green-600 text-white px-4 py-2 rounded transform  group-hover:translate-x-0 transition-transform duration-300"
                >
                  ➕ Add New Listing
                </button>

                <AddListingModal
                  isOpen={isModalOpen}
                  onClose={() => setModalOpen(false)}
                  onSubmit={handleAddListing}
                  vendorId={vendor?.id ?? 0}
                />
              </div>
              <div>
                <button
                  onClick={() => setUnitsModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded transform group-hover:translate-x-0 transition-transform duration-300"
                >
                  ➕ Add List Units
                </button>

                <AddUnitsModal
                  isOpen={isUnitsModalOpen}
                  onClose={() => setUnitsModalOpen(false)}
                  vendorId={vendor?.id ?? 0}
                />
              </div>
            </div>
          </div>

          {/* Stats/Quick Info Section */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Decorative Element */}
            <div className=" w-12 h-12 bg-blue-100 rounded-full -translate-x-4 -translate-y-4 opacity-50"></div>

            {/* Icon */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaHotel className="text-blue-600" /> Pending Bookings
              </h3>
            </div>

            <p className="text-sm text-gray-500"></p>

            {/* Button */}
            <button
              onClick={() =>
                router.push(`/dashboard/vendor/orders?vendorId=${vendor?.id}`)
              }
              className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold text-sm py-2 px-4 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View Bookings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
