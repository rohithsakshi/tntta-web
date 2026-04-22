import prisma from "@/lib/prisma"
import { 
  Users, 
  Trophy, 
  CreditCard, 
  Target, 
  Activity, 
  Calendar, 
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  History
} from "lucide-react"
import Link from "next/link"
import StatsCard from "@/components/admin/StatsCard"
import StatusBadge from "@/components/admin/StatusBadge"
import { formatDistanceToNow } from "date-fns"

export const dynamic = "force-dynamic"

async function getDashboardData() {
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    playerCount,
    newPlayersThisMonth,
    activeTournaments,
    openTournaments,
    pendingPayments,
    totalCollected,
    recentApplications,
    upcomingDeadlines,
    recentTournaments
  ] = await Promise.all([
    prisma.user.count({ where: { role: "PLAYER" } }),
    prisma.user.count({ where: { role: "PLAYER", createdAt: { gte: firstDayOfMonth } } }),
    prisma.tournament.count({ where: { status: { in: ["OPEN", "ONGOING"] } } }),
    prisma.tournament.count({ where: { status: "OPEN" } }),
    prisma.tournamentApplication.count({ where: { paymentStatus: "PENDING" } }),
    prisma.tournamentApplication.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { amount: true }
    }),
    prisma.tournamentApplication.findMany({
      take: 10,
      orderBy: { appliedAt: "desc" },
      include: {
        player: true,
        tournament: true
      }
    }),
    prisma.tournament.findMany({
      where: { 
        status: "OPEN",
        registrationDeadline: { gte: now }
      },
      orderBy: { registrationDeadline: "asc" },
      take: 5
    }),
    prisma.tournament.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }
    })
  ])

  return {
    playerCount,
    newPlayersThisMonth,
    activeTournaments,
    openTournaments,
    pendingPayments,
    totalCollected: (totalCollected._sum.amount || 0) / 100,
    recentApplications,
    upcomingDeadlines,
    recentTournaments
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bebas tracking-wider text-gray-900 mb-2 uppercase">Platform Overview</h1>
        <p className="text-gray-500 font-dm-sans">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Players"
          value={data.playerCount}
          subtitle={`+${data.newPlayersThisMonth} new this month`}
          icon={Users}
          color="blue"
          trend={{ value: 12, label: "from last month", isUp: true }}
        />
        <StatsCard 
          title="Active Tournaments"
          value={data.activeTournaments}
          subtitle={`${data.openTournaments} open for registration`}
          icon={Trophy}
          color="orange"
        />
        <StatsCard 
          title="Pending Payments"
          value={data.pendingPayments}
          subtitle="Awaiting verification"
          icon={CreditCard}
          color="red"
        />
        <StatsCard 
          title="Collections (INR)"
          value={`₹${data.totalCollected.toLocaleString()}`}
          subtitle="Total fees collected"
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-2xl font-bebas tracking-wide text-gray-900 flex items-center gap-3">
                 <History className="text-[#E85D04]" size={24} />
                 Recent Activity
               </h3>
               <Link href="/admin/players" className="text-xs font-bold text-[#E85D04] hover:underline uppercase tracking-widest">
                 View All Players
               </Link>
            </div>
            
            <div className="space-y-6">
              {(data.recentApplications as any[]).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-5 hover:bg-gray-50 rounded-2xl transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                      {app.player.firstName[0]}{app.player.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#E85D04] transition-colors">
                        {app.player.firstName} {app.player.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Registered for <span className="font-medium text-gray-700">{app.tournament.title}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={app.paymentStatus} type="payment" />
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">
                      {formatDistanceToNow(new Date(app.appliedAt))} ago
                    </p>
                  </div>
                </div>
              ))}
              {data.recentApplications.length === 0 && (
                <div className="py-20 text-center text-gray-400 italic">No recent registrations found.</div>
              )}
            </div>
          </div>

          {/* Quick Tournaments List */}
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-2xl font-bebas tracking-wide text-gray-900 flex items-center gap-3">
                 <Trophy className="text-[#E85D04]" size={24} />
                 Latest Tournaments
               </h3>
               <Link href="/admin/tournaments" className="text-xs font-bold text-[#E85D04] hover:underline uppercase tracking-widest">
                 Manage All
               </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</th>
                    <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deadline</th>
                    <th className="pb-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.recentTournaments.map((tourn) => (
                    <tr key={tourn.id} className="group hover:bg-gray-50 transition-all">
                      <td className="py-5 font-bold text-gray-900 text-sm">{tourn.title}</td>
                      <td className="py-5"><StatusBadge status={tourn.status} type="tournament" /></td>
                      <td className="py-5 text-gray-500 text-xs font-medium">
                        {new Date(tourn.registrationDeadline).toLocaleDateString()}
                      </td>
                      <td className="py-5 text-right">
                        <Link href={`/admin/tournaments/${tourn.id}/edit`} className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-[#E85D04] transition-all inline-block">
                          <ArrowRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-gray-900 rounded-[40px] p-10 text-white shadow-2xl">
            <h3 className="text-2xl font-bebas tracking-wider mb-8 uppercase">Quick Actions</h3>
            <div className="space-y-4">
              <Link href="/admin/tournaments/create" className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl hover:bg-[#E85D04] transition-all group border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                  <Plus size={20} />
                </div>
                <span className="font-bold text-sm">New Tournament</span>
              </Link>
              <Link href="/admin/results" className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl hover:bg-[#E85D04] transition-all group border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                  <Target size={20} />
                </div>
                <span className="font-bold text-sm">Enter Results</span>
              </Link>
              <Link href="/admin/rankings" className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl hover:bg-[#E85D04] transition-all group border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                  <TrendingUp size={20} />
                </div>
                <span className="font-bold text-sm">Update Rankings</span>
              </Link>
            </div>
          </div>

          {/* Critical Deadlines */}
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bebas tracking-wide text-gray-900 mb-8 flex items-center gap-3">
              <AlertCircle className="text-red-500" size={24} />
              Deadlines
            </h3>
            <div className="space-y-6">
              {data.upcomingDeadlines.map((tourn) => (
                <div key={tourn.id} className="border-l-4 border-red-500 pl-4 py-1">
                  <p className="text-sm font-bold text-gray-900 leading-tight mb-1">{tourn.title}</p>
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                    Closes {formatDistanceToNow(new Date(tourn.registrationDeadline), { addSuffix: true })}
                  </p>
                </div>
              ))}
              {data.upcomingDeadlines.length === 0 && (
                <p className="text-gray-400 text-xs italic">No urgent deadlines.</p>
              )}
            </div>
            <Link href="/admin/tournaments" className="mt-8 w-full py-4 bg-gray-50 text-gray-900 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
              Manage Schedule
              <Calendar size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}