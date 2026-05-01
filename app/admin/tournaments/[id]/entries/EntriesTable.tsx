"use client"

import { Clock, XCircle } from "lucide-react"
import { format } from "date-fns"
import DataTable from "@/components/admin/DataTable"
import StatusBadge from "@/components/admin/StatusBadge"

interface EntriesTableProps {
  applications: any[]
}

export default function EntriesTable({ applications }: EntriesTableProps) {
  const columns = [
    {
      header: "Player",
      accessorKey: "player.firstName",
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
            {item.player?.firstName?.[0] || ""}{item.player?.lastName?.[0] || ""}
          </div>
          <div>
            <p className="font-bold text-gray-900">{item.player?.firstName} {item.player?.lastName}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase">{item.player?.tnttaId}</p>
          </div>
        </div>
      )
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (item: any) => (
        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
          {item.category?.replace("_", " ")}
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
      accessorKey: "appliedAt",
      cell: (item: any) => (
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Clock size={14} />
          <span>{item.appliedAt ? format(new Date(item.appliedAt), "MMM d, h:mm a") : "N/A"}</span>
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
    <DataTable 
      columns={columns} 
      data={applications} 
      searchKey="id" 
      searchPlaceholder="Search participants..."
    />
  )
}
