"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedUser) setUser(storedUser);
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <nav className="bg-black text-white px-8 h-20 flex justify-between items-center shadow-md">
      
      <Link href="/" className="relative -mt-2">
        <Image
          src="/logo-dark.png"
          alt="TN TTA Logo"
          width={130}
          height={130}
          priority
          className="object-contain"
        />
      </Link>

      <div className="flex space-x-8 text-base items-center">

        <Link
          href="/"
          className={pathname === "/" ? "text-orange-400 font-semibold" : "hover:text-orange-400"}
        >
          Home
        </Link>

        <Link
          href="/tournaments"
          className={pathname === "/tournaments" ? "text-orange-400 font-semibold" : "hover:text-orange-400"}
        >
          Tournaments
        </Link>

        {role === "admin" && (
          <Link
            href="/admin"
            className={pathname === "/admin" ? "text-orange-400 font-semibold" : "hover:text-orange-400"}
          >
            Admin
          </Link>
        )}

        {/* 🔥 Show Name Instead of Logout */}
        {user ? (
          <button
            onClick={handleLogout}
            className="text-orange-400 font-semibold hover:text-orange-300 transition"
          >
            {user}
          </button>
        ) : (
          <Link
            href="/login"
            className={pathname === "/login" ? "text-orange-400 font-semibold" : "hover:text-orange-400"}
          >
            Login
          </Link>
        )}

      </div>
    </nav>
  );
}