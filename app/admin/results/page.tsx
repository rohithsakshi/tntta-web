import prisma from "@/lib/prisma"
import { 
  Target, 
  Trophy, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Plus
} from "lucide-react"
import Link from "next/link"
import StatsCard from "@/components/admin/StatsCard"
import StatusBadge from "@/components/admin/StatusBadge"

export const dynamic = "force-dynamic"

async function getTournamentsWithResultStats() {
  const tournaments = await prisma.tournament.findMany({
    where: {
      status: { in: ["ONGOING", "COMPLETED"] }
    },
    include: {
      _count: {
        select: { 
          matches: true,
          applications: true
        }
      }
    },
    orderBy: { startDate: "desc" }
  })
  return tournaments
}

export default async function AdminResultsPage() {
  const tournaments = await getTournamentsWithResultStats()

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bebas tracking-wider text-gray-900 uppercase mb-2">Match Results</h1>
        <p className="text-gray-500 font-dm-sans">Select a tournament to manage scores and winners.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          title="Active Tournaments"
          value={tournaments.filter(t => t.status === "ONGOING").length}
          icon={Activity} // Activity not imported, wait. Lucide Activity.
          color="orange"
        />
        <StatsCard 
          title="Total Matches Entered"
          value={tournaments.reduce((acc, curr) => acc + curr._count.matches, 0)}
          icon={Target}
          color="blue"
        />
        <StatsCard 
          title="Awaiting Finalization"
          value={tournaments.filter(t => t.status === "COMPLETED").length}
          icon={Clock}
          color="green"
        />
      </div>

      {/* Tournament Selection Grid */}
      <div className="space-y-8">
        <h3 className="text-2xl font-bebas tracking-wide text-gray-900 flex items-center gap-3 uppercase">
          Select Tournament
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tournaments.map((tourn) => (
            <div key={tourn.id} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between mb-8">
                <StatusBadge status={tourn.status} type="tournament" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {tourn._count.matches} Results Entered
                </span>
              </div>
              
              <h4 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#E85D04] transition-colors">{tourn.title}</h4>
              <div className="flex items-center gap-4 text-gray-500 text-sm mb-8">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{format(new Date(tourn.startDate), "MMM yyyy")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{tourn._count.applications} Registered</span>
                </div>
              </div>

              <div className="flex gap-4">
                 <Link 
                   href={`/admin/results/${tourn.id}/enter`}
                   className="flex-1 px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
                 >
                   <Plus size={18} />
                   ENTER RESULTS
                 </Link>
                 <Link 
                   href={`/admin/results/${tourn.id}/view`}
                   className="px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
                 >
                   <Eye size={18} />
                 </Link>
              </div>
            </div>
          ))}
          {tournaments.length === 0 && (
            <div className="md:col-span-2 py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
               <Trophy className="mx-auto text-gray-200 mb-4" size={48} />
               <p className="text-gray-400 font-medium">No ongoing or completed tournaments found.</p>
               <p className="text-xs text-gray-400 mt-1">Start a tournament or change its status to enter results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Fix missing imports
import { Activity, Users, Eye } from "lucide-react"
import { format } from "date-fns"
