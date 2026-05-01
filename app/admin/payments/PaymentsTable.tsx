"use client"

import { format } from "date-fns"
import DataTable from "@/components/admin/DataTable"
import StatusBadge from "@/components/admin/StatusBadge"

interface PaymentsTableProps {
  payments: any[]
}

export default function PaymentsTable({ payments }: PaymentsTableProps) {
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
          <span className="font-bold text-gray-900">{item.player?.firstName} {item.player?.lastName}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase">{item.player?.tnttaId}</span>
        </div>
      )
    },
    {
      header: "Tournament",
      accessorKey: "tournament.title",
      cell: (item: any) => (
        <span className="text-sm text-gray-600 truncate max-w-[200px] inline-block">{item.tournament?.title}</span>
      )
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (item: any) => (
        <span className="font-bold text-gray-900 font-bebas text-lg tracking-wide">₹{(item.amount || 0) / 100}</span>
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
        <span className="text-xs text-gray-500">{item.appliedAt ? format(new Date(item.appliedAt), "MMM d, yyyy") : "N/A"}</span>
      )
    }
  ]

  return (
    <DataTable 
      columns={columns} 
      data={payments} 
      searchKey="appId"
      searchPlaceholder="Search by Transaction ID..."
    />
  )
}
