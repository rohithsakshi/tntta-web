import prisma from "@/lib/prisma"
import { 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Download, 
  Filter,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import StatsCard from "@/components/admin/StatsCard"
import StatusBadge from "@/components/admin/StatusBadge"
import DataTable from "@/components/admin/DataTable"
import { format } from "date-fns"

export const dynamic = "force-dynamic"

async function getPaymentData() {
  const [payments, stats] = await Promise.all([
    prisma.tournamentApplication.findMany({
      orderBy: { appliedAt: "desc" },
      include: {
        player: true,
        tournament: true
      },
      take: 100
    }),
    prisma.tournamentApplication.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { amount: true },
      _count: true
    })
  ])

  const pendingCount = await prisma.tournamentApplication.count({
    where: { paymentStatus: "PENDING" }
  })

  return { 
    payments, 
    totalRevenue: (stats._sum.amount || 0) / 100,
    paidCount: stats._count,
    pendingCount
  }
}

export default async function AdminPaymentsPage() {
  const { payments, totalRevenue, paidCount, pendingCount } = await getPaymentData()

  const columns = [
    {
      header: "Transaction ID",
      accessorKey: "appId",
      cell: (item: any) => (
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.appId}</span>
      )
    },
    {
      header: "Player",
      accessorKey: "player.firstName",
      cell: (item: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{item.player.firstName} {item.player.lastName}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase">{item.player.tnttaId}</span>
        </div>
      )
    },
    {
      header: "Tournament",
      accessorKey: "tournament.title",
      cell: (item: any) => (
        <span className="text-sm text-gray-600 truncate max-w-[200px] inline-block">{item.tournament.title}</span>
      )
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (item: any) => (
        <span className="font-bold text-gray-900 font-bebas text-lg tracking-wide">₹{item.amount / 100}</span>
      )
    },
    {
      header: "Status",
      accessorKey: "paymentStatus",
      cell: (item: any) => <StatusBadge status={item.paymentStatus} type="payment" />
    },
    {
      header: "Date",
      accessorKey: "appliedAt",
      cell: (item: any) => (
        <span className="text-xs text-gray-500">{format(new Date(item.appliedAt), "MMM d, yyyy")}</span>
      )
    }
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bebas tracking-wider text-gray-900 uppercase">Financial Management</h1>
          <p className="text-gray-500 font-dm-sans">Monitor transactions and tournament fee collections.</p>
        </div>
        <button className="px-8 py-4 bg-[#2D6A4F] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#1B4332] transition-all shadow-lg shadow-[#2D6A4F]/20">
          <Download size={20} />
          EXPORT LEDGER
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatsCard 
          title="Paid Transactions"
          value={paidCount}
          icon={CheckCircle2}
          color="green"
        />
        <StatsCard 
          title="Pending Verification"
          value={pendingCount}
          icon={Clock}
          color="orange"
        />
        <StatsCard 
          title="Success Rate"
          value="98.2%" // Static for now
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Table Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-bebas tracking-wide text-gray-900 flex items-center gap-3 uppercase">
             Transaction History
           </h3>
        </div>
        <DataTable 
          columns={columns} 
          data={payments} 
          searchKey="appId"
          searchPlaceholder="Search by Transaction ID..."
        />
      </div>
    </div>
  )
}
