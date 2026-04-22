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

export const dynamic = "force-dynamic"

async function getTournaments() {
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
}

export default async function AdminTournamentsPage() {
  const { tournaments, statsMap } = await getTournaments()

  const columns = [
    {
      header: "Tournament",
      accessorKey: "title",
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          <div className="w-16 h-10 rounded overflow-hidden relative border border-gray-100 shrink-0">
             <img 
               src={item.posterUrl || [
                 "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=120&h=80&q=80&auto=format&fit=crop",
                 "https://images.unsplash.com/photo-1509666537727-9154b6962292?w=120&h=80&q=80&auto=format&fit=crop",
                 "https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?w=120&h=80&q=80&auto=format&fit=crop"
               ][item.id.length % 3]} 
               alt={item.title} 
               className="object-cover w-full h-full" 
             />
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">{item.title}</p>
            <p className="text-[10px] font-bold text-[#E85D04] uppercase tracking-widest mt-1">{item.type}</p>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => <StatusBadge status={item.status} type="tournament" />
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: (item: any) => (
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin size={14} className="text-[#E85D04]" />
          <span>{item.location}</span>
        </div>
      )
    },
    {
      header: "Dates",
      accessorKey: "startDate",
      cell: (item: any) => (
        <div className="flex flex-col">
          <span className="text-gray-900">{format(new Date(item.startDate), "MMM d, yyyy")}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase">Registration Ends {format(new Date(item.registrationDeadline), "MMM d")}</span>
        </div>
      )
    },
    {
      header: "Entries",
      accessorKey: "_count.applications",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Users size={14} className="text-gray-400" />
          <span className="font-bold text-gray-900">{item._count.applications}</span>
          <span className="text-gray-400 text-xs">/ {item.maxParticipants || "∞"}</span>
        </div>
      )
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Link 
            href={`/admin/tournaments/${item.id}/entries`}
            className="p-2 hover:bg-[#E85D04]/10 rounded-xl text-gray-400 hover:text-[#E85D04] transition-all"
            title="View Entries"
          >
            <Eye size={18} />
          </Link>
          <Link 
            href={`/admin/tournaments/${item.id}/edit`}
            className="p-2 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all"
            title="Edit"
          >
            <Edit3 size={18} />
          </Link>
          <button 
            className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-all"
            title="Delete"
          >
            <Trash2 size={18} />
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
        <DataTable 
          columns={columns} 
          data={tournaments} 
          searchKey="title"
          searchPlaceholder="Search tournaments by name..."
        />
      </div>
    </div>
  )
}
