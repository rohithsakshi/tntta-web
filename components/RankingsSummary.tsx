import { Trophy, ArrowUp, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getRankingsSummary } from "@/lib/data"

export default async function RankingsSummary() {
  const players = await getRankingsSummary()

  return (
    <section className="py-24 bg-[#0A0A0A] text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#E85D04]/5 skew-x-12 transform translate-x-1/2" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-5xl font-bebas tracking-wider mb-2">State Rankings</h2>
            <div className="w-24 h-1.5 bg-[#E85D04]" />
          </div>
          <Link 
            href="/rankings" 
            className="flex items-center gap-2 text-[#E85D04] font-bold hover:gap-3 transition-all"
          >
            VIEW ALL RANKINGS
            <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                      <th className="px-8 py-6 text-center">Rank</th>
                      <th className="px-8 py-6">Player</th>
                      <th className="px-8 py-6 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {players.length > 0 ? (
                      players.map((player: any, index: number) => (
                        <tr key={player.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-6 text-center">
                            <span className={`font-bebas text-2xl ${index === 0 ? "text-[#E85D04]" : "text-gray-400"}`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                <Image 
                                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${player.firstName} ${player.lastName}&backgroundColor=0A0A0A&textColor=E85D04`}
                                  alt={player.firstName}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <div>
                                <p className="font-bold text-white group-hover:text-[#E85D04] transition-colors">
                                  {player.firstName} {player.lastName}
                                </p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                  {player.district}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <span className="font-bebas text-xl text-white tracking-wide">
                              {player.rankingPoints}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-20 text-center text-gray-500 italic">
                          Rankings will be available soon.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-[#E85D04] rounded-3xl shadow-xl shadow-[#E85D04]/20 relative overflow-hidden group">
              <Trophy className="absolute -right-4 -bottom-4 text-white/20 w-32 h-32 transform rotate-12 group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-bebas tracking-wide mb-4 relative z-10">Live Points System</h3>
              <p className="text-white/90 text-sm leading-relaxed mb-6 relative z-10">
                Our advanced ranking engine calculates points in real-time based on tournament performance, match quality, and opponent strength.
              </p>
              <button className="bg-white text-[#E85D04] px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg transition-all relative z-10">
                How it works
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Players</p>
                <p className="text-3xl font-bebas text-white">1,240+</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tournaments</p>
                <p className="text-3xl font-bebas text-white">24/yr</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
