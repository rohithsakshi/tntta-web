"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [role, setRole] = useState("Player");

  return (
    <div className="h-screen w-screen overflow-hidden flex">
      
      {/* Left Side Image */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="/login.jpg"
          alt="Table Tennis"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-3xl font-bold">
            Welcome Back
          </h2>
          <p className="opacity-80">
            Manage tournaments. Track performance. Stay competitive.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
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

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-2 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center text-sm mb-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Button */}
          <button className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-lg font-semibold">
            Login
          </button>

          {/* Footer */}
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