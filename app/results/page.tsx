import { Trophy, ChevronRight, Calendar, Search, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

async function getTournaments() {
  try {
    return await prisma.tournament.findMany({
      where: { status: "COMPLETED" },
      orderBy: { startDate: "desc" },
    })
  } catch (error) {
    console.error("Database fetch failed for results tournaments")
    return []
  }
}

async function getMatchResults(tournamentId: string) {
  try {
    return await prisma.matchResult.findMany({
      where: { tournamentId },
      include: {
        player1: true,
        player2: true,
        tournament: true,
      },
      orderBy: [{ category: "asc" }, { playedAt: "desc" }],
    })
  } catch (error) {
    console.error("Database fetch failed for match results")
    return []
  }
}

export default async function ResultsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ tournamentId?: string }> 
}) {
  const { tournamentId } = await searchParams
  const tournaments = await getTournaments()
  const selectedTournamentId = tournamentId || tournaments[0]?.id
  const results = selectedTournamentId ? await getMatchResults(selectedTournamentId) : []

  // Group results by category
  const resultsByCategory = results.reduce((acc: any, match: any) => {
    if (!acc[match.category]) acc[match.category] = []
    acc[match.category].push(match)
    return acc
  }, {})

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <div className="bg-[#0A0A0A] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&h=500&q=85&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bebas tracking-wider mb-4 uppercase">Tournament Results</h1>
          <p className="text-lg sm:text-xl text-gray-400 font-dm-sans max-w-2xl">
            Official match scores and brackets from TNTTA sanctioned events.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Tournament Selector */}
        <div className="mb-12">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Select Tournament</label>
          <div className="flex flex-wrap gap-3">
            {tournaments.length > 0 ? (
              tournaments.map((t: any) => (
                <Link
                  key={t.id}
                  href={`/results?tournamentId=${t.id}`}
                  className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                    selectedTournamentId === t.id 
                    ? "bg-[#2D6A4F] border-[#2D6A4F] text-white shadow-lg shadow-green-900/20" 
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200 shadow-sm"
                  }`}
                >
                  {t.title}
                </Link>
              ))
            ) : (
              <div className="p-12 bg-white rounded-3xl border border-dashed border-gray-200 text-center w-full">
                <p className="text-gray-400 italic font-dm-sans">No completed tournaments found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Sections */}
        {Object.keys(resultsByCategory).length > 0 ? (
          <div className="space-y-16">
            {Object.keys(resultsByCategory).map((category) => (
              <section key={category}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-bebas tracking-wide text-gray-900 uppercase">
                    {category.replace("_", " ")}
                  </h2>
                  <div className="flex-1 h-[1px] bg-gray-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resultsByCategory[category].map((match: any) => (
                    <div 
                      key={match.id} 
                      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{match.round}</span>
                        <div className="flex items-center gap-2">
                           <Trophy size={14} className="text-[#2D6A4F]" />
                           <span className="text-[10px] font-bold text-[#2D6A4F] uppercase tracking-widest">FINAL RESULT</span>
                        </div>
                      </div>
                      
                      <div className="p-8 space-y-6">
                        {/* Player 1 Row */}
                        <div className={`flex items-center justify-between ${match.winnerId === match.player1Id ? "text-gray-900" : "text-gray-400"}`}>
                          <div className="flex items-center gap-4">
                            <div className={`relative w-10 h-10 rounded-full overflow-hidden shrink-0 border ${
                              match.winnerId === match.player1Id ? "border-[#2D6A4F]/30" : "border-gray-200"
                            }`}>
                              <Image
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${match.player1.firstName} ${match.player1.lastName}&backgroundColor=0A0A0A&textColor=E85D04`}
                                alt={match.player1.firstName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <p className={`font-bold ${match.winnerId === match.player1Id ? "text-lg" : "text-base"}`}>
                                {match.player1.firstName} {match.player1.lastName}
                              </p>
                              <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">{match.player1.district}</p>
                            </div>
                          </div>
                          {match.winnerId === match.player1Id && <div className="bg-green-500 w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />}
                        </div>

                        <div className="flex items-center justify-center py-2 relative">
                           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dashed border-gray-100"></div></div>
                           <div className="relative bg-white px-4 text-xs font-bold text-gray-300 tracking-widest uppercase">VS</div>
                        </div>

                        {/* Player 2 Row */}
                        <div className={`flex items-center justify-between ${match.winnerId === match.player2Id ? "text-gray-900" : "text-gray-400"}`}>
                          <div className="flex items-center gap-4">
                            <div className={`relative w-10 h-10 rounded-full overflow-hidden shrink-0 border ${
                              match.winnerId === match.player2Id ? "border-[#2D6A4F]/30" : "border-gray-200"
                            }`}>
                              <Image
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${match.player2.firstName} ${match.player2.lastName}&backgroundColor=0A0A0A&textColor=E85D04`}
                                alt={match.player2.firstName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <p className={`font-bold ${match.winnerId === match.player2Id ? "text-lg" : "text-base"}`}>
                                {match.player2.firstName} {match.player2.lastName}
                              </p>
                              <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">{match.player2.district}</p>
                            </div>
                          </div>
                          {match.winnerId === match.player2Id && <div className="bg-green-500 w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />}
                        </div>
                      </div>

                      <div className="mt-auto bg-gray-900 p-6 flex items-center justify-between text-white">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Final Score</span>
                          <span className="font-mono text-lg tracking-wider text-[#2D6A4F]">{match.score}</span>
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/5 flex flex-col items-end">
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Winner</span>
                           <span className="font-bold text-sm">
                             {match.winnerId === match.player1Id ? match.player1.lastName : match.player2.lastName}
                           </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : selectedTournamentId && (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
            <Search size={48} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-2xl font-bebas tracking-wide text-gray-400">No results found</h3>
            <p className="text-gray-500 mt-2">Results will be updated as the tournament progresses.</p>
          </div>
        )}
      </div>
    </div>
  )
}