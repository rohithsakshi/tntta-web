"use client"

import { MapPin, Users, Eye, Edit3, Trash2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import DataTable from "@/components/admin/DataTable"
import StatusBadge from "@/components/admin/StatusBadge"

import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

interface TournamentsTableProps {
  tournaments: any[]
}

export default function TournamentsTable({ tournaments }: TournamentsTableProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tournament? This action cannot be undone.")) return

    try {
      const res = await fetch(`/api/admin/tournaments/${id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete")
      }

      toast.success("Tournament deleted successfully")
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

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
               ][(item.id || "").length % 3]} 
               alt={item.title} 
               className="object-cover w-full h-full" 
             />
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">{item.title}</p>
            <p className="text-[10px] font-bold text-[#E85D04] uppercase tracking-widest mt-1">{item.type?.replace("_", " ")}</p>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: any) => {
        return (
          <select
            value={item.status}
            onChange={async (e) => {
              const newStatus = e.target.value
              try {
                const res = await fetch(`/api/admin/tournaments/${item.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status: newStatus })
                })
                if (!res.ok) throw new Error("Failed to update status")
                toast.success("Status updated to " + newStatus)
                router.refresh()
              } catch (err) {
                toast.error("Could not update status")
              }
            }}
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full outline-none transition-all cursor-pointer border-r-8 border-transparent ${
              item.status === "OPEN" ? "bg-green-100 text-green-700" :
              item.status === "DRAFT" ? "bg-gray-100 text-gray-700" :
              item.status === "CLOSED" ? "bg-yellow-100 text-yellow-700" :
              item.status === "ONGOING" ? "bg-blue-100 text-blue-700" :
              item.status === "COMPLETED" ? "bg-indigo-100 text-indigo-700" :
              item.status === "CANCELLED" ? "bg-red-100 text-red-700" :
              "bg-gray-100 text-gray-700"
            }`}
          >
            <option value="DRAFT">DRAFT</option>
            <option value="UPCOMING">UPCOMING</option>
            <option value="OPEN">OPEN</option>
            <option value="ONGOING">ONGOING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CLOSED">CLOSED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        )
      }
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
          <span className="text-gray-900">{item.startDate ? format(new Date(item.startDate), "MMM d, yyyy") : "N/A"}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase">
            Reg. Ends {item.registrationDeadline ? format(new Date(item.registrationDeadline), "MMM d") : "N/A"}
          </span>
        </div>
      )
    },
    {
      header: "Entries",
      accessorKey: "_count.applications",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Users size={14} className="text-gray-400" />
          <span className="font-bold text-gray-900">{item._count?.applications || 0}</span>
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
            onClick={() => handleDelete(item.id)}
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
    <DataTable 
      columns={columns} 
      data={tournaments} 
      searchKey="title"
      searchPlaceholder="Search tournaments by name..."
    />
  )
}
