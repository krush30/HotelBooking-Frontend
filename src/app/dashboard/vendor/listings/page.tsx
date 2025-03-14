"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VendorListingsModal() {
  interface Listing {
    id: string;
    name: string;
    address: string;
    pricing: number;
    facilities: string[];
    vendorId: number;
  }

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendorId");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      if (!token || !vendorId) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/listings?vendorId=${vendorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch listings");

        const data = await response.json();
        setListings(
          data.filter(
            (listing: Listing) => listing.vendorId === parseInt(vendorId)
          )
        );
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchListings();
  }, [token, vendorId]);

  if (typeof window === "undefined") {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Listings</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-center text-gray-600">No listings found.</p>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{listing.name}</h3>
              <p className="text-gray-600">{listing.address}</p>
              <p className="text-orange-600 font-bold">
                ${listing.pricing}/night
              </p>

              {listing.facilities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {listing.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 px-2 py-1 text-sm rounded-md"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
