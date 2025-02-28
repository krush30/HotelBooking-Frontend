"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUsers, FaHotel, FaSignOutAlt } from "react-icons/fa";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer" | "vendor";
  isActive: boolean;
}

interface Listing {
  id: number;
  name: string;
  address: string;
  type: "hotel" | "restaurant";
  isActive: boolean;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "listings">("users");
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    // const role = localStorage.getItem("role");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetchUsers();
    fetchListings();
  }, [router]);

  const fetchUsers = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const users = await response.json();
    setUsers(users.map((user: User) => ({ ...user, isActive: true })));
  };

  const fetchListings = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listings`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const listings = await response.json();
    setListings(
      listings.map((listing: Listing) => ({ ...listing, isActive: true }))
    );
  };

  const deactivateItem = async (id: number, type: "user" | "listing") => {
    if (!confirm("Are you sure you want to deactivate?")) return;
    const url =
      type === "user"
        ? `/users/deactivate/${id}`
        : `/listings/deactivate/${id}`;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    type === "user"
      ? setUsers(
          users.map((user) =>
            user.id === id ? { ...user, isActive: false } : user
          )
        )
      : setListings(
          listings.map((listing) =>
            listing.id === id ? { ...listing, isActive: false } : listing
          )
        );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-3xl font-bold text-center mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <button
            className={`w-full flex items-center p-3 rounded-lg text-lg ${
              activeTab === "users" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers className="mr-3" /> Manage Users
          </button>
          <button
            className={`w-full flex items-center p-3 rounded-lg text-lg ${
              activeTab === "listings" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("listings")}
          >
            <FaHotel className="mr-3" /> Manage Listings
          </button>
          <button
            className="w-full flex items-center p-3 rounded-lg text-lg hover:bg-red-600"
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/auth/login");
            }}
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          {activeTab === "users" ? "User Management" : "Listing Management"}
        </h1>

        {/* Users Section */}
        {activeTab === "users" && (
          <div className="grid gap-6">
            {["Admin", "Customer", "Vendor"].map((role) => (
              <div key={role} className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">{role}s</h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(
                        (user) => user.role.toLowerCase() === role.toLowerCase()
                      )
                      .map((user) => (
                        <tr
                          key={user.id}
                          className="border-b hover:bg-gray-100"
                        >
                          <td className="p-4">{user.name}</td>
                          <td className="p-4">{user.email}</td>
                          <td
                            className={`p-4 ${
                              user.isActive ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </td>
                          <td className="p-4">
                            <button
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                              onClick={() => deactivateItem(user.id, "user")}
                              disabled={!user.isActive}
                            >
                              Deactivate
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Listings Section */}
        {activeTab === "listings" && (
          <div className="grid gap-6">
            {["Hotel", "Restaurant"].map((type) => (
              <div key={type} className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">{type}s</h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Address</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings
                      .filter(
                        (listing) =>
                          listing.type.toLowerCase() === type.toLowerCase()
                      )
                      .map((listing) => (
                        <tr
                          key={listing.id}
                          className="border-b hover:bg-gray-100"
                        >
                          <td className="p-4">{listing.name}</td>
                          <td className="p-4">{listing.address}</td>
                          <td
                            className={`p-4 ${
                              listing.isActive
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {listing.isActive ? "Active" : "Inactive"}
                          </td>
                          <td className="p-4">
                            <button
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                              onClick={() =>
                                deactivateItem(listing.id, "listing")
                              }
                              disabled={!listing.isActive}
                            >
                              Deactivate
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
