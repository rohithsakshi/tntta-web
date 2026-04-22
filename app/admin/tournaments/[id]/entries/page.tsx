import prisma from "@/lib/prisma"
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

export const dynamic = "force-dynamic"

async function getTournamentEntries(id: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      applications: {
        include: {
          player: true
        },
        orderBy: { appliedAt: "desc" }
      },
      _count: {
        select: { applications: true }
      }
    }
  })

  if (!tournament) return null

  const stats = {
    total: (tournament as any)._count.applications,
    paid: (tournament as any).applications.filter((a: any) => a.paymentStatus === "PAID").length,
    pending: (tournament as any).applications.filter((a: any) => a.paymentStatus === "PENDING").length,
    failed: (tournament as any).applications.filter((a: any) => a.paymentStatus === "FAILED").length,
  }

  return { tournament, stats }
}

export default async function TournamentEntriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getTournamentEntries(id)

  if (!data) notFound()

  const { tournament, stats } = data

  const columns = [
    {
      header: "Player",
      accessorKey: "player.firstName",
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
            {item.player.firstName[0]}{item.player.lastName[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900">{item.player.firstName} {item.player.lastName}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase">{item.player.tnttaId}</p>
          </div>
        </div>
      )
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (item: any) => (
        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
          {item.category.replace("_", " ")}
        </span>
      )
    },
    {
      header: "Payment",
      accessorKey: "paymentStatus",
      cell: (item: any) => <StatusBadge status={item.paymentStatus} type="payment" />
    },
    {
      header: "Applied At",
      accessorKey: "createdAt",
      cell: (item: any) => (
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Clock size={14} />
          <span>{format(new Date(item.appliedAt), "MMM d, h:mm a")}</span>
        </div>
      )
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          {item.paymentStatus === "PENDING" && (
            <button className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-lg border border-green-100 hover:bg-green-100 transition-all">
              MARK PAID
            </button>
          )}
          <button className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-all">
            <XCircle size={16} />
          </button>
        </div>
      )
    }
  ]

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
        <DataTable 
          columns={columns} 
          data={(tournament as any).applications} 
          searchKey="id" 
          searchPlaceholder="Search participants..."
        />
      </div>
    </div>
  )
}
