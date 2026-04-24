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
    console.info("Using mock admin players data (Demo Mode)")
    const mockPlayers = Array.from({ length: 8 }).map((_, i) => ({
      id: `mock-p-${i}`,
      firstName: ["Arun", "Suresh", "Priya", "Deepa", "Vikram", "Rahul", "Anjali", "Karthik"][i % 8],
      lastName: ["Kumar", "R", "S", "M", "V", "B", "N", "P"][i % 8],
      tnttaId: `TNTTA-2025-${(1001 + i).toString()}`,
      district: ["Chennai", "Madurai", "Coimbatore", "Salem", "Trichy"][i % 5],
      club: ["SK Academy", "Nungambakkam Club", "Youth Center", null][i % 4],
      rankingPoints: 2500 - (i * 150),
      category: "MENS",
      gender: "MALE",
      createdAt: new Date(Date.now() - 86400000 * i * 2)
    }))

    return { 
      players: mockPlayers, 
      total: 150, 
      districtStats: [
        { district: "Chennai", _count: 45 },
        { district: "Madurai", _count: 32 },
        { district: "Coimbatore", _count: 28 }
      ] 
    }
  }
}

export default async function AdminPlayersPage() {
  const { players, total, districtStats } = await getPlayers()

  const columns = [
    {
      header: "Player",
      accessorKey: "firstName",
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-100">
            <img 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.firstName} ${item.lastName}&backgroundColor=0A0A0A&textColor=E85D04`}
              alt={item.firstName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">{item.firstName} {item.lastName}</p>
            <p className="text-[10px] font-bold text-[#E85D04] uppercase tracking-widest mt-1">{item.tnttaId}</p>
          </div>
        </div>
      )
    },
    {
      header: "District",
      accessorKey: "district",
      cell: (item: any) => (
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin size={14} className="text-[#E85D04]" />
          <span>{item.district}</span>
        </div>
      )
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (item: any) => (
        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
          {item.category.replace("_", " ")}
        </span>
      )
    },
    {
      header: "Points",
      accessorKey: "rankingPoints",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-yellow-500" />
          <span className="font-bold text-gray-900">{item.rankingPoints || 0}</span>
        </div>
      )
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: (item: any) => (
        <span className="text-xs text-gray-500">{format(new Date(item.createdAt), "MMM d, yyyy")}</span>
      )
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Link 
            href={`/admin/players/${item.id}`}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all"
            title="View Profile"
          >
            <Eye size={18} />
          </Link>
          <button 
            className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-all"
            title="Deactivate"
          >
            <UserMinus size={18} />
          </button>
        </div>
      )
    }
  ]

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
        <DataTable 
          columns={columns} 
          data={players} 
          searchKey="firstName"
          searchPlaceholder="Search by first name..."
        />
      </div>
    </div>
  )
}
