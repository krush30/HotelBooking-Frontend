"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // Default role
  const router = useRouter();

  interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    role: string;
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: RegisterFormData = { name, email, password, role };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (res.ok) router.push("/auth/login");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-orange-500 p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hotel-bg.jpg')] bg-cover bg-center opacity-30"></div>
      <div className="relative bg-white p-10 rounded-xl shadow-xl w-96 z-10">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-orange-600">
          Create an Account
        </h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-all"
          >
            Sign Up
          </button>
        </form>

        {/* Redirect to Login if user already has an account */}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/auth/login" className="text-orange-600 font-bold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
