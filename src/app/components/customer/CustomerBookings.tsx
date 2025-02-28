"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCreditCard,
} from "react-icons/fa";

interface Booking {
  id: number;
  customerId: number;
  listingId: number;
  listingName: string;
  listingAddress: string;
  unitId: number;
  bookingDates: string[];
  status: string;
  createdAt: string;
  paymentDetails: { method: string; amount: number };
}

export default function CustomerBookingsComponent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId");
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings/customer/${customerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch bookings");

        const data: Booking[] = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) fetchBookings();
  }, [customerId]);

  return (
    <>
      <h2 className="text-4xl font-extrabold text-amber-900 mb-8 text-center tracking-tight">
        My Dining Reservations
      </h2>
      {loading ? (
        <p className="text-center text-gray-600 text-lg animate-pulse">
          Fetching your reservations...
        </p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-600 text-lg italic">
          No reservations yet. Book a table now!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-amber-50 transform hover:-translate-y-1"
            >
              <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-5 text-white relative">
                <h3 className="text-2xl font-semibold tracking-wide">
                  {booking.listingName}
                </h3>
                <p className="text-sm flex items-center mt-1 opacity-90">
                  <FaMapMarkerAlt className="mr-2" /> {booking.listingAddress}
                </p>
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400 opacity-20 rounded-full -mr-12 -mt-12"></div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-800 flex items-center">
                  <FaCalendarAlt className="mr-3 text-amber-600" />
                  <span className="font-medium">Date:</span>{" "}
                  {booking.bookingDates[0]}
                </p>
                <p className="text-gray-800 flex items-center">
                  <FaClock className="mr-3 text-amber-600" />
                  <span className="font-medium">Time:</span>{" "}
                  {booking.bookingDates[1]}
                </p>
                <p className="text-gray-800 flex items-center">
                  <FaMoneyBillWave className="mr-3 text-green-600" />
                  <span className="font-medium">Deposit:</span> $
                  {booking.paymentDetails.amount}
                </p>
                <p className="text-gray-800 flex items-center">
                  <FaCreditCard className="mr-3 text-gray-600" />
                  <span className="font-medium">Paid via:</span>{" "}
                  {booking.paymentDetails.method}
                </p>
                <p
                  className={`text-lg font-semibold flex items-center ${
                    booking.status === "approved"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {booking.status === "approved" ? (
                    <FaCheckCircle className="mr-2" />
                  ) : (
                    <FaTimesCircle className="mr-2" />
                  )}
                  Status:{" "}
                  <span className="ml-1">{booking.status.toUpperCase()}</span>
                </p>
                <p className="text-gray-500 text-sm italic">
                  <span className="font-medium">Reserved on:</span>{" "}
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
                <button className="mt-4 w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition duration-200 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
