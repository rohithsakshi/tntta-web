"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  User, 
  Trophy, 
  CreditCard, 
  BarChart3, 
  LogOut,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/dashboard/profile", icon: User },
  { name: "My Tournaments", href: "/dashboard/tournaments", icon: Trophy },
  { name: "Payment History", href: "/dashboard/history", icon: CreditCard },
  { name: "Rankings", href: "/rankings", icon: BarChart3 },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session) return null

  return (
    <div className="flex min-h-[calc(100vh-72px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 bg-[#0A0A0A] flex-col border-r border-white/5">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E85D04] flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-[#E85D04]/20">
              {session.user.firstName[0]}{session.user.lastName[0]}
            </div>
            <div>
              <p className="text-white font-bold text-sm truncate w-32">{session.user.firstName} {session.user.lastName}</p>
              <p className="text-[#E85D04] text-[10px] font-bold tracking-widest">{session.user.tnttaId}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-[#E85D04] text-white shadow-lg shadow-[#E85D04]/20" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon size={20} />
                <span className="font-medium text-sm">{link.name}</span>
                {isActive && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 mt-auto">
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all group"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-white/10 px-4 py-2 flex items-center justify-between z-40">
        {sidebarLinks.slice(0, 4).map((link) => {
          const isActive = pathname === link.href
          return (
            <Link 
              key={link.name}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg",
                isActive ? "text-[#E85D04]" : "text-gray-400"
              )}
            >
              <link.icon size={20} />
              <span className="text-[10px] font-medium">{link.name.split(' ')[0]}</span>
            </Link>
          )
        })}
        <button 
          onClick={() => signOut()}
          className="flex flex-col items-center gap-1 p-2 text-red-400"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
