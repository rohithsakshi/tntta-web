import { User, Search, MapPin, Trophy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

async function getAllPlayers() {
  try {
    const players = await prisma.user.findMany({
      where: { role: "PLAYER" },
      orderBy: { rankingPoints: "desc" },
    })
    return players
  } catch (error) {
    console.warn("Error fetching players:", error)
    return []
  }
}

export default async function PlayersPage() {
  const players = await getAllPlayers()

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-24">
      {/* Header */}
      <div className="bg-[#0A0A0A] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/image2.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bebas tracking-wider mb-4 uppercase">Our Players</h1>
          <p className="text-lg sm:text-xl text-gray-400 font-dm-sans max-w-2xl mx-auto">
            Meet the talent representing Tamil Nadu across all age categories.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, TNTTA ID or district..."
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 shadow-sm focus:ring-2 focus:ring-[#E85D04] focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex gap-4">
            <select className="bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm outline-none font-bold text-sm text-gray-600">
              <option>All Districts</option>
              <option>Chennai</option>
              <option>Madurai</option>
              <option>Coimbatore</option>
            </select>
          </div>
        </div>

        {/* Players Grid */}
        {players.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {players.map((player: any) => (
              <div 
                key={player.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${player.firstName} ${player.lastName}&backgroundColor=0A0A0A&textColor=E85D04`}
                    alt={player.firstName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Trophy size={14} className="text-[#E85D04]" />
                    <span className="text-[10px] font-bold text-gray-900">{player.rankingPoints}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#E85D04] transition-colors mb-1">
                    {player.firstName} {player.lastName}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">
                    {player.tnttaId}
                  </p>
                  <div className="flex items-center gap-2 text-gray-500 mb-6">
                    <MapPin size={14} />
                    <span className="text-xs font-medium">{player.district}</span>
                  </div>
                  <Link 
                    href={`/players/${player.tnttaId}`}
                    className="block w-full py-3 bg-[#0A0A0A] text-white text-center rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#E85D04] transition-colors"
                  >
                    View Career Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-32 text-center border border-gray-100 shadow-sm">
            <User size={64} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No players found</h2>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
