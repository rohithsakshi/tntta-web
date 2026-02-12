"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Tournaments", href: "/tournaments" },
    { name: "Rankings", href: "/rankings" },
    { name: "Login", href: "/login" },
  ];

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      
      {/* Logo */}
      <Link href="/" className="font-bold text-lg">
        TN TTA
      </Link>

      {/* Navigation Links */}
      <div className="flex space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition ${
              pathname === link.href
                ? "text-orange-400 font-semibold"
                : "hover:text-orange-400"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

    </nav>
  );
}