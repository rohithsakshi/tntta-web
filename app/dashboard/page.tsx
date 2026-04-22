import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Trophy, Calendar, Target, Award, ChevronRight, BarChart3 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"

async function getPlayerStats(userId: string) {
  const [user, applications, matches] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.tournamentApplication.count({ where: { playerId: userId } }),
    prisma.matchResult.count({
      where: {
        OR: [{ player1Id: userId }, { player2Id: userId }]
      }
    }),
  ])
  return { user, applications, matches }
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const { user, applications, matches } = await getPlayerStats(session.user.id)

  if (!user) return null

  return (
    <div className="space-y-10 pb-20 lg:pb-0">
      {/* Welcome Card */}
      <div className="bg-[#0A0A0A] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E85D04]/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#E85D04] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-[#E85D04]/20">
                PLAYER ACCOUNT
              </span>
              <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase">
                {user.tnttaId}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bebas tracking-wider mb-2">
              Welcome Back, {user.firstName}!
            </h1>
            <p className="text-gray-400 font-dm-sans max-w-md">
              Check your upcoming matches, tournament entries, and latest rankings.
            </p>
          </div>
          <Link 
            href="/dashboard/profile"
            className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all border border-white/5"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#E85D04]/30">
              <Image
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}&backgroundColor=0A0A0A&textColor=E85D04`}
                alt={user.firstName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="pr-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">District</p>
              <p className="font-bold">{user.district}</p>
            </div>
            <ChevronRight size={20} className="text-gray-600" />
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Ranking Points", value: user.rankingPoints, icon: BarChart3, color: "text-[#E85D04]", bg: "bg-orange-50" },
          { label: "Tournaments", value: applications, icon: Trophy, color: "text-[#0077B6]", bg: "bg-blue-50" },
          { label: "Matches Played", value: matches, icon: Target, color: "text-[#2D6A4F]", bg: "bg-green-50" },
          { label: "Category", value: user.category.replace("_", " "), icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-bebas tracking-wider text-gray-900 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Next Tournament */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bebas tracking-wide text-gray-900">Next Tournament</h3>
            <Link href="/tournaments" className="text-xs font-bold text-[#E85D04] hover:underline">BROWSE ALL</Link>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center py-12">
            <Calendar size={40} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 text-sm font-medium">You haven&apos;t registered for any upcoming tournaments yet.</p>
            <Link 
              href="/tournaments"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-black transition-all"
            >
              Find a Tournament
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bebas tracking-wide text-gray-900">Recent Matches</h3>
            <Link href="/dashboard/history" className="text-xs font-bold text-[#E85D04] hover:underline">VIEW ALL</Link>
          </div>
          <div className="space-y-4">
            <p className="text-center py-12 text-gray-400 text-sm italic">No match history available yet.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
