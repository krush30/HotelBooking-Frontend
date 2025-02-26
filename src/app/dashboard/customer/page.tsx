"use client";
import { useEffect, useState } from "react";
import ListingModal from "@/app/components/customer/ListingModal";
// import { useRouter } from "next/navigation";

export default function HomePage() {
  interface Listing {
    id: string;
    name: string;
    address: string;
    type: string;
    description?: string;
    facilities?: string[];
    pricing?: Record<string, number>;
    images?: string;
    rating?: number;
    createdAt?: string;
  }

  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  // const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/listings`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch listings");
        const data = await response.json();
        setListings(data);
        setFilteredListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    console.log("listing:", listings);
    const filtered = listings.filter((listing) =>
      filter === "all" ? true : listing.type === filter
    );

    filtered.sort((a, b) =>
      sortOrder === "desc"
        ? (b.rating || 0) - (a.rating || 0)
        : (a.rating || 0) - (b.rating || 0)
    );

    setFilteredListings(filtered);
  }, [filter, sortOrder, listings]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="relative w-full h-80 bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white text-center shadow-lg rounded-b-lg">
        <div className="absolute inset-0 bg-[url('/images/welcome-bg.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold drop-shadow-lg">
            Welcome to Hotel & Restaurant Explorer! 🍽️🏨
          </h1>
          <p className="mt-2 text-lg drop-shadow-md">
            Discover the best hotels and restaurants near you.
          </p>
        </div>
      </div>

      {/* Filter & Sorting */}
      <div className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div>
          <button
            className={`px-8 py-4 text-lg rounded-xl font-bold shadow-md transition-all transform ${
              filter === "Restaurant"
                ? "bg-orange-500 text-white scale-105 shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("Restaurant")}
          >
            🍽️ Dine In
          </button>
          <button
            className={`ml-6 px-8 py-4 text-lg rounded-xl font-bold shadow-md transition-all transform ${
              filter === "Hotel"
                ? "bg-blue-500 text-white scale-105 shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("Hotel")}
          >
            🏨 Stay In
          </button>
        </div>
        <select
          className="border rounded px-4 py-2"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Sort by: ⭐ High to Low</option>
          <option value="asc">Sort by: ⭐ Low to High</option>
        </select>
      </div>

      {/* Listings Section */}
      <div className="container mx-auto px-6 py-6">
        {filteredListings.length === 0 ? (
          <p className="text-center text-gray-500">No listings available...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <img
                  src={
                    `${process.env.NEXT_PUBLIC_API_URL}${
                      listing.images?.split(",")[0]
                    }` || "/images/default.jpg"
                  }
                  alt={listing.name}
                  // width={400}
                  // height={250}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {listing.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{listing.address}</p>
                  <p className="mt-2 text-lg font-semibold text-orange-500">
                    {listing.type} • ⭐ {listing.rating || "4"}
                  </p>
                  <button
                    className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-bold hover:from-red-500 hover:to-orange-500 transition-all w-full"
                    onClick={() => {
                      setSelectedListing(listing);
                      setModalOpen(true);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Component */}
      <ListingModal
        listing={selectedListing}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
