"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerHeader() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch user details from localStorage (assuming token contains name)
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem("user"); // Clear user data
    router.push("/auth/login"); // Redirect to login
  };

  return (
    <header className="bg-orange-500 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">Hotel Booking App</h1>

      {/* Profile Dropdown */}
      {user && (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-bold shadow-md hover:bg-gray-100 transition-all"
          >
            <span>👤 {user.name}</span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
              <ul className="bg-white shadow-md rounded-lg w-64 p-4">
                <li>
                  <a
                    href="/customer/bookings"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-lg transition-all hover:bg-orange-100 hover:text-orange-600"
                  >
                    📅 <span>Booked Hotels</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/customer/reviews"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-lg transition-all hover:bg-orange-100 hover:text-orange-600"
                  >
                    📝 <span>My Reviews</span>
                  </a>
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
