"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Listing {
  id: string;
  name: string;
  address: string;
  type: string;
  description?: string;
  facilities?: string[];
  images?: string[];
  createdAt?: string;
}

interface BookingData {
  listingId: number;
  unitId: number;
  bookingDates: string[];
  status: string;
  paymentDetails: { method: string; amount: number };
}

interface ListingModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

const ListingModal: React.FC<ListingModalProps> = ({
  listing,
  isOpen,
  onClose,
}) => {
  const [bookingDates, setBookingDates] = useState<Date[]>([]);
  const [unitId, setUnitId] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [bookingMethod, setBookingMethod] = useState<string>("Online");

  interface Customer {
    id: string;
    // Add other properties if needed
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  useEffect(() => {
    // const token = localStorage.getItem("token");
    // const role = localStorage.getItem("role");
    if (typeof window === "undefined") return;
    const user = localStorage.getItem("user");

    if (user) {
      setCustomer(JSON.parse(user));
    }
  }, []);

  const handleBooking = async () => {
    if (!listing || !bookingDates.length || !unitId || !amount) {
      alert("Please fill in all details.");
      return;
    }

    try {
      const formattedDates = bookingDates.map(
        (date) => date.toISOString().split("T")[0]
      );

      const bookingData: BookingData = {
        listingId: Number(listing.id),
        unitId: Number(unitId),
        bookingDates: formattedDates,
        status: "pending",
        paymentDetails: {
          method: bookingMethod,
          amount: Number(amount),
        },
      };

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId: Number(customer?.id),
            ...bookingData,
          }),
        }
      );

      if (!response.ok) throw new Error("Booking failed");

      alert("Booking successful!");
      onClose();
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Booking failed, please try again.");
    }
  };

  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[75%] max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {listing.name}
        </h2>
        {listing.images?.length && (
          <Image
            src={listing.images[0]}
            alt={listing.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
            width={500}
            height={500}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <p className="text-gray-600">
            <strong>Type:</strong> {listing.type}
          </p>
          <p className="text-gray-600">
            <strong>Address:</strong> {listing.address}
          </p>
          <p className="text-gray-600 col-span-2">
            <strong>Description:</strong>{" "}
            {listing.description || "No description available"}
          </p>
          <p className="text-gray-600 col-span-2">
            <strong>Facilities:</strong>{" "}
            {listing.facilities?.join(", ") || "N/A"}
          </p>
        </div>

        {/* Booking Section */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <h3 className="text-lg font-semibold col-span-2">Book This Hotel</h3>

          <div className="col-span-2">
            <label className="block mt-3 text-gray-700">Select Dates:</label>
            <DatePicker
              selected={bookingDates[0] || null}
              onChange={(dates: [Date | null, Date | null]) =>
                dates &&
                setBookingDates(
                  dates.filter((date): date is Date => date !== null)
                )
              }
              startDate={bookingDates[0]}
              endDate={bookingDates[1]}
              selectsRange
              inline
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Unit ID:</label>
            <input
              type="number"
              placeholder="Enter unit ID"
              value={unitId}
              onChange={(e) => setUnitId(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Amount ($):</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700">Payment Method:</label>
            <select
              value={bookingMethod}
              onChange={(e) => setBookingMethod(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <button
            className="col-span-2 mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-all w-full"
            onClick={handleBooking}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingModal;
