"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  // const [adminName, setAdminName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.push("/auth/login");
      return;
    }

    // Fetch admin details (Mock API call or real API)
    // const fetchAdminDetails = async () => {
    //   try {
    //     const response = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_URL}/admin/me`,
    //       {
    //         headers: { Authorization: `Bearer ${token}` },
    //       }
    //     );
    //     const data = await response.json();
    //     if (response.ok) {
    //       setAdminName(data.name);
    //     } else {
    //       router.push("/login");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching admin data:", error);
    //     router.push("/login");
    //   }
    // };

    // fetchAdminDetails();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-10 rounded-lg w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-blue-600">Admin Dashboard</h1>
        <p className="mt-4 text-lg text-gray-600">Welcome, !</p>
        <div className="mt-6">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
            onClick={() => router.push("/admin/users")}
          >
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );
}
