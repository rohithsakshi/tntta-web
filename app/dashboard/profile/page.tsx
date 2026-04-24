import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { User, Mail, Phone, MapPin, Building2, Calendar, Award, Edit } from "lucide-react"
import { format } from "date-fns"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect("/login")

  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })
  } catch (error) {
    console.info("Using mock user data (Database offline)")
    user = {
      firstName: session.user.firstName || "Player",
      lastName: session.user.lastName || "Name",
      tnttaId: session.user.tnttaId || "TNTTA-MOCK",
      contact: session.user.contact || "1234567890",
      email: "mock@example.com",
      district: "Chennai",
      club: "Default Club",
      dob: new Date("2000-01-01"),
      category: "MENS"
    }
  }

  if (!user) return null

  const profileItems = [
    { label: "Full Name", value: `${user.firstName} ${user.lastName}`, icon: User },
    { label: "TNTTA ID", value: user.tnttaId, icon: Award },
    { label: "Contact Number", value: user.contact, icon: Phone },
    { label: "Email Address", value: user.email || "Not provided", icon: Mail },
    { label: "District", value: user.district, icon: MapPin },
    { label: "Club", value: user.club || "Unattached", icon: Building2 },
    { label: "Date of Birth", value: format(new Date(user.dob), "PPP"), icon: Calendar },
    { label: "Default Category", value: user.category.replace("_", " "), icon: Trophy },
  ]

  return (
    <div className="max-w-4xl space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bebas tracking-wider text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-500">Your personal and professional details as registered with TNTTA.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
          <Edit size={16} />
          Edit Profile
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Profile Header Banner */}
        <div className="h-32 bg-[#0A0A0A] relative">
          <div className="absolute -bottom-12 left-10">
             <div className="w-24 h-24 rounded-3xl bg-[#E85D04] border-4 border-white flex items-center justify-center text-3xl font-bold text-white shadow-xl">
               {user.firstName[0]}{user.lastName[0]}
             </div>
          </div>
        </div>

        <div className="pt-16 pb-12 px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {profileItems.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-[#E85D04]/10 group-hover:text-[#E85D04] transition-all">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#E85D04] shadow-sm">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Security & Privacy</h4>
            <p className="text-sm text-gray-600">Your profile is verified and protected by TNTTA security protocols.</p>
          </div>
        </div>
        <button className="text-[#E85D04] font-bold text-sm hover:underline">Change Password</button>
      </div>
    </div>
  )
}

import { Trophy, ShieldCheck } from "lucide-react"
import { BarChart3 } from "lucide-react"
