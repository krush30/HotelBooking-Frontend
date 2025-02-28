"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerHeader() {
  const [user, setUser] = useState<{ name: string; id: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <header className="bg-orange-500 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">Hotel Booking App</h1>

      {user && (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-bold shadow-md hover:bg-gray-100 transition-all"
          >
            <span>👤 {user.name}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
              <ul className="bg-white shadow-md rounded-lg w-64 p-4">
                <li>
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/customer/bookings?customerId=${user?.id}`
                      )
                    }
                    className="flex w-full items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-lg transition-all hover:bg-orange-100 hover:text-orange-600"
                  >
                    📅 <span>Booked Hotels</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/customer/reviews")}
                    className="flex w-full items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-lg transition-all hover:bg-orange-100 hover:text-orange-600"
                  >
                    📝 <span>My Reviews</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                  >
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
