import prisma from "@/lib/prisma"
import { 
  Plus, 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Edit3, 
  Eye, 
  Trash2,
  Filter,
  Activity
} from "lucide-react"
import Link from "next/link"
import StatsCard from "@/components/admin/StatsCard"
import StatusBadge from "@/components/admin/StatusBadge"
import DataTable from "@/components/admin/DataTable"
import { format } from "date-fns"
import TournamentsTable from "./TournamentsTable"

export const dynamic = "force-dynamic"



async function getTournaments() {
  try {
    if (!prisma) return { tournaments: [], statsMap: {} }
    
    const [tournaments, stats] = await Promise.all([
      prisma.tournament.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { applications: true }
          }
        }
      }),
      prisma.tournament.groupBy({
        by: ["status"],
        _count: true
      })
    ])

    const statsMap = stats.reduce((acc: any, curr: any) => {
      acc[curr.status] = curr._count
      return acc
    }, {} as Record<string, number>)

    return { tournaments, statsMap }
  } catch (error) {
    console.info("Info: Tournaments data fetch currently offline.")
    // Provide a mock tournament so the list isn't empty in demo mode
    return { 
      tournaments: [
        {
          id: "demo-1",
          title: "Demo State Ranking Championship",
          status: "DRAFT",
          location: "Chennai",
          startDate: new Date(),
          endDate: new Date(),
          _count: { applications: 0 }
        }
      ], 
      statsMap: { "DRAFT": 1 } 
    }
  }
}

export default async function AdminTournamentsPage() {
  const { tournaments, statsMap } = await getTournaments()

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bebas tracking-wider text-gray-900 uppercase">Tournament Management</h1>
          <p className="text-gray-500 font-dm-sans">Create and manage state-wide sanctioned tournaments.</p>
        </div>
        <Link 
          href="/admin/tournaments/create"
          className="px-8 py-4 bg-[#E85D04] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#C44D03] transition-all shadow-lg shadow-[#E85D04]/20"
        >
          <Plus size={20} />
          CREATE TOURNAMENT
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Tournaments"
          value={tournaments.length}
          icon={Trophy}
          color="blue"
        />
        <StatsCard 
          title="Open for Registration"
          value={statsMap["OPEN"] || 0}
          icon={Calendar}
          color="green"
        />
        <StatsCard 
          title="Ongoing Events"
          value={statsMap["ONGOING"] || 0}
          icon={Activity}
          color="orange"
        />
        <StatsCard 
          title="Completed"
          value={statsMap["COMPLETED"] || 0}
          icon={Eye}
          color="blue"
        />
      </div>

      {/* Table Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-bebas tracking-wide text-gray-900 flex items-center gap-3">
             <Filter className="text-[#E85D04]" size={20} />
             Tournament Inventory
           </h3>
        </div>
        <TournamentsTable tournaments={tournaments} />
      </div>
    </div>
  )
}
