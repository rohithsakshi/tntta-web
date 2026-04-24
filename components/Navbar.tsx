"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LogOut, User, LayoutDashboard, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Tournaments", href: "/tournaments" },
  { name: "Rankings", href: "/rankings" },
  { name: "Results", href: "/results" },
  { name: "Gallery", href: "/gallery" },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isLoading = status === "loading"
  const user = session?.user

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[72px] flex items-center border-b-[2px]",
        isScrolled 
          ? "bg-[#0A0A0A]/95 backdrop-blur-md border-[#E85D04]" 
          : "bg-[#0A0A0A] border-[#E85D04]/20"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image 
            src="/TNTTA_logo.png" 
            alt="TNTTA Logo" 
            width={100} 
            height={40} 
            className="object-contain h-10 sm:h-12 w-auto"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#E85D04]",
                  isActive ? "text-[#E85D04]" : "text-white"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="h-0.5 bg-[#E85D04] mt-0.5"
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Auth Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoading ? (
            <div className="w-24 h-8 bg-gray-800 animate-pulse rounded" />
          ) : user ? (
            <div className="flex items-center gap-4">
              {user.role === "ADMIN" ? (
                <Link 
                  href="/admin"
                  className="bg-[#E85D04] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#C44D03] transition-all"
                >
                  <Settings size={14} />
                  ADMIN PANEL
                </Link>
              ) : (
                <Link 
                  href="/dashboard"
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-[#E85D04] flex items-center justify-center text-[10px] font-bold text-white">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className="text-sm text-white font-medium">Dashboard</span>
                </Link>
              )}
              <button 
                onClick={() => signOut()}
                className="text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-white text-sm font-medium hover:text-[#E85D04] transition-colors">
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-[#E85D04] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#C44D03] transition-all shadow-[0_4px_14px_rgba(232,93,4,0.3)]"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-white p-2 -mr-2"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-[#0A0A0A] flex flex-col p-6 sm:p-8 lg:hidden"
          >
            <div className="flex items-center justify-between mb-8 sm:mb-12">
              <Image src="/TNTTA_logo.png" alt="TNTTA Logo" width={90} height={36} className="h-9 w-auto" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2 -mr-2">
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-4xl font-bebas tracking-wider",
                    pathname === link.href ? "text-[#E85D04]" : "text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              {user ? (
                <>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-[#E85D04] flex items-center justify-center text-xl font-bold text-white">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <p className="text-white font-bold">{user.firstName} {user.lastName}</p>
                      <p className="text-gray-400 text-sm">{user.tnttaId}</p>
                    </div>
                  </div>
                  <Link 
                    href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white text-black font-bold"
                  >
                    {user.role === "ADMIN" ? <Settings size={20} /> : <LayoutDashboard size={20} />}
                    {user.role === "ADMIN" ? "Admin Panel" : "Dashboard"}
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="w-full py-4 rounded-xl border border-white/20 text-white font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="w-full py-4 rounded-xl border border-white/20 text-white text-center font-bold"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    className="w-full py-4 rounded-xl bg-[#E85D04] text-white text-center font-bold"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}