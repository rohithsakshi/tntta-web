import connectToDatabase from "@/lib/mongodb"
import { Tournament, TournamentApplication } from "@/models"
import { 
  ArrowLeft, 
  Users, 
  Download, 
  CheckCircle2, 
  XCircle,
  Clock,
  Filter
} from "lucide-react"
import Link from "next/link"
import StatsCard from "@/components/admin/StatsCard"
import StatusBadge from "@/components/admin/StatusBadge"
import DataTable from "@/components/admin/DataTable"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import EntriesTable from "./EntriesTable"

export const dynamic = "force-dynamic"

async function getTournamentEntries(id: string) {
  try {
    await connectToDatabase();
    const tournamentRaw = await Tournament.findById(id).lean();
    if (!tournamentRaw) return null;

    const applicationsRaw = await TournamentApplication.find({ tournamentId: id })
      .populate("playerId")
      .sort({ appliedAt: -1 })
      .lean();

    const applications = applicationsRaw.map((app: any) => ({
      ...app,
      id: app._id.toString(),
      player: app.playerId
    }));

    const stats = {
      total: applications.length,
      paid: applications.filter((a: any) => a.paymentStatus === "PAID").length,
      pending: applications.filter((a: any) => a.paymentStatus === "PENDING").length,
      failed: applications.filter((a: any) => a.paymentStatus === "FAILED").length,
    }

    return { 
      tournament: { ...tournamentRaw, id: tournamentRaw._id.toString(), applications }, 
      stats 
    }
  } catch (error) {
    console.error("Error fetching tournament entries:", error);
    return null;
  }
}

export default async function TournamentEntriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getTournamentEntries(id)

  if (!data) notFound()

  const { tournament, stats } = data

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/tournaments"
            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E85D04] transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-4xl font-bebas tracking-wider text-gray-900 uppercase leading-none mb-2">Tournament Entries</h1>
            <p className="text-gray-500 font-dm-sans text-sm">{tournament.title}</p>
          </div>
        </div>
        <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg">
          <Download size={20} />
          EXPORT LIST
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Entries"
          value={stats.total}
          icon={Users}
          color="blue"
        />
        <StatsCard 
          title="Paid Entries"
          value={stats.paid}
          icon={CheckCircle2}
          color="green"
        />
        <StatsCard 
          title="Pending Payment"
          value={stats.pending}
          icon={Clock}
          color="orange"
        />
        <StatsCard 
          title="Failed / Cancelled"
          value={stats.failed}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Table Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-bebas tracking-wide text-gray-900 flex items-center gap-3">
             <Filter className="text-[#E85D04]" size={20} />
             Registered Participants
           </h3>
        </div>
        <EntriesTable applications={(tournament as any).applications} />
      </div>
    </div>
  )
}
