"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Target, 
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

const mobileLinks = [
  { name: "Home", href: "/admin", icon: LayoutDashboard },
  { name: "Tours", href: "/admin/tournaments", icon: Trophy },
  { name: "Players", href: "/admin/players", icon: Users },
  { name: "Results", href: "/admin/results", icon: Target },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminMobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111] border-t border-white/5 px-6 py-4 z-50 flex items-center justify-between shadow-2xl">
      {mobileLinks.map((link) => {
        const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
        return (
          <Link 
            key={link.name}
            href={link.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive ? "text-[#E85D04]" : "text-gray-500"
            )}
          >
            <link.icon size={20} className={cn("transition-all", isActive && "scale-110")} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{link.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
