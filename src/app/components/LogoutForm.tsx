"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from storage
    router.push("/auth/login"); // Redirect to login page
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition-all"
    >
      Logout
    </button>
  );
}
