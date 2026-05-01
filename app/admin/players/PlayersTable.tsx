"use client"

import { MapPin, Trophy, Eye, UserMinus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import DataTable from "@/components/admin/DataTable"

interface PlayersTableProps {
  players: any[]
}

export default function PlayersTable({ players }: PlayersTableProps) {
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
          {item.category?.replace("_", " ") || "N/A"}
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
    <DataTable 
      columns={columns} 
      data={players} 
      searchKey="firstName"
      searchPlaceholder="Search by first name..."
    />
  )
}
