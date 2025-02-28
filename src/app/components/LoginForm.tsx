"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  interface LoginFormData {
    email: string;
    password: string;
  }

  // Check if user is already logged in and redirect them to their dashboard
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "customer") router.push("/dashboard/customer");
      if (role === "vendor") router.push("/dashboard/vendor");
      if (role === "admin") router.push("/dashboard/admin");
    }
  }, [router]); // Runs once when component mounts

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData: LoginFormData = { email, password };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const { access_token, role, user } = await res.json();

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      console.log(user);

      // Redirect based on role
      if (role === "customer") router.push("/dashboard/customer");
      if (role === "vendor") router.push("/dashboard/vendor");
      if (role === "admin") router.push("/dashboard/admin");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-orange-500 p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hotel-bg.jpg')] bg-cover bg-center opacity-30"></div>

      {/* Application Name */}
      <h1 className="absolute top-8 text-4xl font-extrabold text-white z-10">
        Hotel Booking App
      </h1>

      <div className="relative bg-white p-10 rounded-xl shadow-xl w-96 z-10">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-orange-600">
          Login to Your Account
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-all"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Dont have an account?{" "}
          <a href="/auth/register" className="text-orange-600 font-bold">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
