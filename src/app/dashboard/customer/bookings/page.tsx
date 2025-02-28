"use client";

import { Suspense } from "react";
import CustomerBookingsComponent from "@/app/components/customer/CustomerBookings";

export default function CustomerBookings() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-gray-600 text-lg animate-pulse">
          Fetching your reservations...
        </p>
      }
    >
      <CustomerBookingsComponent />
    </Suspense>
  );
}
