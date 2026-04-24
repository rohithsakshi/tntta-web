import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Trophy, Users, ChevronRight, Search } from "lucide-react"
import { format } from "date-fns"
import prisma from "@/lib/prisma"
import { TournamentStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

async function getTournaments(status?: string) {
  try {
    return await prisma.tournament.findMany({
      where: status && status !== "ALL" ? { status: status as TournamentStatus } : {},
      orderBy: { startDate: "asc" },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    })
  } catch (error) {
    console.error("Database fetch failed for tournaments page")
    return []
  }
}

export default async function TournamentsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ status?: string }> 
}) {
  const { status } = await searchParams
  const currentStatus = status || "ALL"
  const tournaments = await getTournaments(currentStatus)

  const statusFilters = [
    { label: "All", value: "ALL" },
    { label: "Upcoming", value: "UPCOMING" },
    { label: "Open", value: "OPEN" },
    { label: "Completed", value: "COMPLETED" },
  ]

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <div className="bg-[#0A0A0A] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/hero-table-tennis.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h1 className="text-6xl font-bebas tracking-wider mb-4 animate-fadeIn">Tournaments</h1>
          <p className="text-xl text-gray-400 font-dm-sans max-w-2xl">
            State, District & Open Championships. Compete with the best players in Tamil Nadu.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
          <div className="flex gap-2 p-1 bg-gray-50 rounded-xl w-full md:w-auto">
            {statusFilters.map((filter) => (
              <Link
                key={filter.value}
                href={`/tournaments?status=${filter.value}`}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  currentStatus === filter.value 
                  ? "bg-[#E85D04] text-white shadow-md" 
                  : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {filter.label}
              </Link>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tournaments..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {tournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.map((t: any) => (
              <Link 
                key={t.id}
                href={`/tournaments/${t.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative h-56 w-full">
                  <Image 
                    src={t.posterUrl || "/tournament1.jpg"} 
                    alt={t.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg ${
                      t.status === "OPEN" ? "bg-[#2D6A4F] text-white" :
                      t.status === "UPCOMING" ? "bg-[#E85D04] text-white" :
                      t.status === "COMPLETED" ? "bg-[#0077B6] text-white" :
                      "bg-gray-500 text-white"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#E85D04] transition-colors line-clamp-2">
                    {t.title}
                  </h3>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Calendar size={18} className="text-[#E85D04]" />
                      <span className="text-sm font-medium">
                        {format(new Date(t.startDate), "MMM dd")} - {format(new Date(t.endDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                      <MapPin size={18} className="text-[#E85D04]" />
                      <span className="text-sm font-medium line-clamp-1">{t.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users size={16} />
                      <span className="text-xs font-bold">{t._count.applications} Registered</span>
                    </div>
                    <span className="text-[#E85D04] font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300">
            <Trophy size={64} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-2xl font-bebas tracking-wide text-gray-400">No tournaments found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  )
}