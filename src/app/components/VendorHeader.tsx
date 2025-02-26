"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VendorHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const vendor = JSON.parse(localStorage.getItem("user") ?? "");

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    router.push("/auth/login"); // Redirect to login
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-orange-600 text-white py-4 px-6 flex justify-between items-center shadow-md fixed top-0 left-0 right-0 z-50">
        {/* Logo or Branding */}
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>

        {/* Profile Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
        >
          <span>👤 Profile</span>
        </button>
      </header>

      {/* RIGHT SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="self-end text-gray-600 hover:text-gray-900"
          >
            ✖
          </button>

          {/* Sidebar Content */}
          <nav className="mt-6 space-y-4">
            <Link
              href="/vendor/dashboard"
              className="block py-3 px-4 rounded-lg text-orange-600 font-bold hover:bg-gray-200 transition"
            >
              📊 Dashboard
            </Link>
            <Link
              href={`listings?vendorId=${vendor?.id}`}
              className="block py-3 px-4 rounded-lg text-orange-600 font-bold hover:bg-gray-200 transition"
            >
              🏨 My Listings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left py-3 px-4 rounded-lg text-red-600 font-bold hover:bg-gray-200 transition"
            >
              🚪 Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Background Overlay When Sidebar is Open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
