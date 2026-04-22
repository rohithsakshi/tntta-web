import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminMobileNav from "@/components/admin/AdminMobileNav"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <div className="hidden lg:block">
        <AdminSidebar user={session.user} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[260px] min-h-screen flex flex-col pb-24 lg:pb-0">
        <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto">
          {children}
        </main>
      </div>

      <AdminMobileNav />
    </div>
  )
}
