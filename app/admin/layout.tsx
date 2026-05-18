import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { UserRole } from "@/models/enums"
import DashboardLayout from "@/app/dashboard/layout"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/login")
  }

  // We reuse the DashboardLayout to provide the unified sidebar and aesthetic
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
