"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Booking {
  customerName: string;
  listingName: string;
  bookingId: string;
  customerId: string;
  listingId: string;
  unitId: string;
  status: string;
  bookingDates: string[];
  paymentDetails: {
    amount: number;
    method: string;
  };
}

const Page = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendorId");
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!vendorId) return;

      try {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings/vendor/${vendorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch bookings");

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [vendorId]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update booking");

      // Update state after successful response
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  if (loading) return <p className="text-center mt-10 text-xl">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Vendor Bookings</h1>
      {bookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th>#</th>
                <th className="border p-3 text-left">Customer</th>
                <th className="border p-3 text-left">Booking Dates</th>
                <th className="border p-3 text-left">Listing</th>
                <th className="border p-3 text-left">Payment Method</th>
                <th className="border p-3 text-left">Price</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, i) => (
                <tr key={booking.bookingId} className="hover:bg-gray-50">
                  <td className="border p-3">{i + 1}</td>
                  <td className="border p-3">{booking.customerName}</td>

                  <td className="border p-3">
                    {booking.bookingDates.join(", ")}
                  </td>
                  <td className="border p-3">{booking.listingName}</td>
                  <td className="border p-3">
                    {booking.paymentDetails.method}
                  </td>
                  <td className="border p-3">
                    ${booking.paymentDetails.amount}
                  </td>
                  <td className="border p-3">
                    <span
                      className={`px-2 py-1 text-sm font-semibold rounded ${
                        booking.status === "approved"
                          ? "bg-green-200 text-green-700"
                          : booking.status === "rejected"
                          ? "bg-red-200 text-red-700"
                          : "bg-yellow-200 text-yellow-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="border p-3">
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-md disabled:bg-gray-400"
                      onClick={() =>
                        handleStatusChange(booking.bookingId, "approved")
                      }
                      disabled={
                        booking.status === "approved" ||
                        booking.status === "rejected"
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md disabled:bg-gray-400"
                      onClick={() =>
                        handleStatusChange(booking.bookingId, "rejected")
                      }
                      disabled={
                        booking.status === "approved" ||
                        booking.status === "rejected"
                      }
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center mt-10 text-xl">No bookings found.</p>
      )}
    </div>
  );
};

export default Page;
