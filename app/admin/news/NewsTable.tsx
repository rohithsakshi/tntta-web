"use client"

import { Newspaper, Edit3, Trash2, Calendar, User } from "lucide-react"
import { format } from "date-fns"
import DataTable from "@/components/admin/DataTable"
import StatusBadge from "@/components/admin/StatusBadge"

interface NewsTableProps {
  news: any[]
}

export default function NewsTable({ news }: NewsTableProps) {
  const columns = [
    {
      header: "Article",
      accessorKey: "title",
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100 flex-shrink-0">
             {item.imageUrl ? (
               <img src={item.imageUrl} alt="" className="object-cover w-full h-full" />
             ) : (
               <div className="flex items-center justify-center h-full text-gray-300">
                 <Newspaper size={20} />
               </div>
             )}
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight line-clamp-1">{item.title}</p>
            <p className="text-xs text-gray-500 line-clamp-1 mt-1">{item.excerpt}</p>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "isPublished",
      cell: (item: any) => (
        <StatusBadge status={item.isPublished ? "PUBLISHED" : "DRAFT"} type="news" />
      )
    },
    {
      header: "Author",
      accessorKey: "author.firstName",
      cell: (item: any) => (
        <div className="flex items-center gap-2 text-gray-600">
          <User size={14} className="text-[#E85D04]" />
          <span className="text-sm">{item.author?.firstName} {item.author?.lastName}</span>
        </div>
      )
    },
    {
      header: "Date",
      accessorKey: "publishedAt",
      cell: (item: any) => (
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Calendar size={14} />
          <span>{item.publishedAt ? format(new Date(item.publishedAt), "MMM d, yyyy") : "N/A"}</span>
        </div>
      )
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all">
            <Edit3 size={18} />
          </button>
          <button className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ]

  return (
    <DataTable 
      columns={columns} 
      data={news} 
      searchKey="title"
      searchPlaceholder="Search articles..."
    />
  )
}
