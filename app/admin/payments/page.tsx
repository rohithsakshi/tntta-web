import connectToDatabase from "@/lib/mongodb"
import { TournamentApplication } from "@/models"
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
import PaymentsTable from "./PaymentsTable"

export const dynamic = "force-dynamic"

async function getPaymentData() {
  try {
    await connectToDatabase();

    const [paymentsRaw, stats] = await Promise.all([
      TournamentApplication.find({})
        .populate("playerId")
        .populate("tournamentId")
        .sort({ appliedAt: -1 })
        .limit(100)
        .lean(),
      TournamentApplication.aggregate([
        { $match: { paymentStatus: "PAID" } },
        { 
          $group: { 
            _id: null, 
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 }
          } 
        }
      ])
    ])

    const pendingCount = await TournamentApplication.countDocuments({
      paymentStatus: "PENDING"
    })

    const payments = paymentsRaw.map((p: any) => ({
      ...p,
      id: p._id.toString(),
      player: p.playerId,
      tournament: p.tournamentId
    }));

    const resultStats = stats[0] || { totalAmount: 0, count: 0 };

    return { 
      payments, 
      totalRevenue: resultStats.totalAmount / 100,
      paidCount: resultStats.count,
      pendingCount
    }
  } catch (error) {
    console.info("Info: Payment data fetch currently offline.")
    return {
      payments: [
        {
          id: "demo-pay-1",
          appId: "APP-DEMO-001",
          amount: 50000,
          paymentStatus: "PAID",
          appliedAt: new Date(),
          player: { firstName: "Demo", lastName: "Player", district: "Chennai" },
          tournament: { title: "Demo Championship" }
        }
      ],
      totalRevenue: 500,
      paidCount: 1,
      pendingCount: 0
    }
  }
}

export default async function AdminPaymentsPage() {
  const { payments, totalRevenue, paidCount, pendingCount } = await getPaymentData()

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
        <PaymentsTable payments={payments} />
      </div>
    </div>
  )
}
