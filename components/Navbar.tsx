"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Tournaments", href: "/tournaments" },
    { name: "Rankings", href: "/rankings" },
    { name: "Gallery", href: "/gallery" },
    { name: "Login", href: "/login" },
  ];

  return (
   <nav className="bg-black text-white px-8 h-20 flex justify-between items-center shadow-md relative">
  
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

  <div className="flex space-x-8 text-base">
    {navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={`transition duration-300 ${
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