"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Target, 
  BarChart3, 
  CreditCard,
  Camera, 
  Newspaper,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Tournaments", href: "/admin/tournaments", icon: Trophy },
  { name: "Players", href: "/admin/players", icon: Users },
  { name: "Results", href: "/admin/results", icon: Target },
  { name: "Rankings", href: "/admin/rankings", icon: BarChart3 },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Gallery", href: "/admin/gallery", icon: Camera },
  { name: "News", href: "/admin/news", icon: Newspaper },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminSidebarProps {
  user: {
    firstName: string
    lastName: string
    role: string
  }
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-[260px] bg-[#111] flex flex-col border-r border-white/5 fixed top-0 left-0 bottom-0 z-50">
      {/* Logo Area */}
      <div className="p-8 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <img src="/TNTTA_logo.png" alt="TNTTA Logo" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <span className="text-2xl font-bebas tracking-wider text-white leading-none">TNTTA</span>
            <span className="text-[10px] font-bold text-[#E85D04] tracking-[0.2em] uppercase">Control Panel</span>
          </div>
        </Link>
      </div>

      {/* User Area */}
      <div className="p-6">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#E85D04] flex items-center justify-center text-white font-bold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">{user.firstName} {user.lastName}</p>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{user.role.replace("_", " ")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
          return (
            <Link 
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-[#E85D04] text-white shadow-lg shadow-[#E85D04]/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <link.icon size={20} className={cn("transition-colors", isActive ? "text-white" : "group-hover:text-[#E85D04]")} />
                <span className="font-medium text-sm">{link.name}</span>
              </div>
              {isActive && <ChevronRight size={16} className="text-white/50" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Area */}
      <div className="p-6 border-t border-white/5">
        <Link 
          href="/api/auth/signout"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/5 transition-all group"
        >
          <LogOut size={20} className="group-hover:text-red-500" />
          <span className="font-medium text-sm">Logout</span>
        </Link>
      </div>
    </aside>
  )
}
