"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar = pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <PageTransition>
        {children}
      </PageTransition>
    </>
  );
}