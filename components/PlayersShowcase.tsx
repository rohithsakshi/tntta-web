import { User, ChevronRight, Star, Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getTopPlayers, getTournamentWinners } from "@/lib/data"

export default async function PlayersShowcase() {
  const featured = await getTopPlayers()
  const winners = await getTournamentWinners()
  
  // Combine and deduplicate
  const allShown = [...featured]
  winners.forEach(w => {
    if (!allShown.find(p => p.id === w.id)) {
      allShown.push({ ...w, isWinner: true })
    } else {
      const existing = allShown.find(p => p.id === w.id)
      if (existing) existing.isWinner = true
    }
  })

  const players = allShown.slice(0, 6)

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-5xl font-bebas tracking-wider text-[#0A0A0A] mb-2">Featured Players</h2>
            <div className="w-24 h-1.5 bg-[#E85D04]" />
          </div>
          <Link 
            href="/players" 
            className="flex items-center gap-2 text-[#E85D04] font-bold hover:gap-3 transition-all"
          >
            DISCOVER ALL PLAYERS
            <ChevronRight size={20} />
          </Link>
        </div>

        {players.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {players.map((player: any) => (
              <div key={player.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300">
                  <Image 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${player.firstName} ${player.lastName}&backgroundColor=0A0A0A&textColor=E85D04`}
                    alt={player.firstName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {player.isFeatured && (
                      <div className="bg-[#E85D04] text-white text-[8px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Star size={10} className="fill-white" />
                        FEATURED
                      </div>
                    )}
                    {player.isWinner && (
                      <div className="bg-[#2D6A4F] text-white text-[8px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Trophy size={10} className="fill-white" />
                        WINNER
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                    <button className="w-full bg-[#E85D04] text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
                      View Profile
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-[#E85D04] transition-colors">
                    {player.firstName} {player.lastName}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star size={12} className="text-[#E85D04] fill-[#E85D04]" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {player.district}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-3xl p-20 text-center border border-dashed border-gray-200">
            <User size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium italic">Player profiles are currently being updated.</p>
          </div>
        )}
      </div>
    </section>
  )
}
