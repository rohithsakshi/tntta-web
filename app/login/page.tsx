"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState("Player");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // ✅ Always store server-confirmed role
      localStorage.setItem("user", firstName);
      localStorage.setItem("role", data.role);

      // ✅ Redirect based on API response
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex">
      
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="/login.jpg"
          alt="Table Tennis"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="opacity-80">
            Manage tournaments. Track performance. Stay competitive.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-100 px-8 h-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Login to TN TTA
          </h1>

          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}

          {/* Role Selector */}
          <div className="mb-6">
            <label className="text-sm text-gray-600">
              Login As
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-2 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>Player</option>
              <option>Coach</option>
              <option>Admin</option>
              <option>Official</option>
            </select>
          </div>

          {/* First Name */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">
              First Name
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full mt-2 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}