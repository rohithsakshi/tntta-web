import prisma from "@/lib/prisma"
import { 
  Users, 
  Search, 
  MapPin, 
  Trophy, 
  Eye, 
  Edit3, 
  ShieldCheck,
  UserCheck,
  UserMinus,
  Download
} from "lucide-react"
import Link from "next/link"
import StatsCard from "@/components/admin/StatsCard"
import StatusBadge from "@/components/admin/StatusBadge"
import DataTable from "@/components/admin/DataTable"
import { format } from "date-fns"
import PlayersTable from "./PlayersTable"

export const dynamic = "force-dynamic"

async function getPlayers() {
  try {
    const [players, stats] = await Promise.all([
      prisma.user.findMany({
        where: { role: "PLAYER" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where: { role: "PLAYER" } }),
    ])

    const districtStats = await prisma.user.groupBy({
      by: ["district"],
      where: { role: "PLAYER" },
      _count: true
    })

    if (players.length === 0) throw new Error("No players")
    return { players, total: stats, districtStats }
  } catch (error) {
    console.warn("Database fetch failed. Returning empty data (offline).")
    return { 
      players: [], 
      total: 0, 
      districtStats: [] 
    }
  }
}

export default async function AdminPlayersPage() {
  const { players, total, districtStats } = await getPlayers()

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bebas tracking-wider text-gray-900 uppercase">Player Directory</h1>
          <p className="text-gray-500 font-dm-sans">Manage registered athletes across all districts.</p>
        </div>
        <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg">
          <Download size={20} />
          EXPORT CSV
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Players"
          value={total}
          icon={Users}
          color="orange"
        />
        <StatsCard 
          title="Districts Active"
          value={districtStats.length}
          icon={MapPin}
          color="blue"
        />
        <StatsCard 
          title="Avg. Points"
          value={Math.round(players.reduce((acc: number, curr: any) => acc + (curr.rankingPoints || 0), 0) / (players.length || 1))}
          icon={Trophy}
          color="green"
        />
        <StatsCard 
          title="Verified Players"
          value={total} // Assuming all are verified for now
          icon={ShieldCheck}
          color="blue"
        />
      </div>

      {/* Table Section */}
      <div className="space-y-6">
        <PlayersTable players={players} />
      </div>
    </div>
  )
}
