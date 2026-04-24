import { Trophy, ChevronRight } from "lucide-react"
import Link from "next/link"
import { getRecentResults } from "@/lib/data"

export default async function Results() {
  const results = await getRecentResults()

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-5xl font-bebas tracking-wider text-[#0A0A0A] mb-2">Recent Results</h2>
            <div className="w-24 h-1.5 bg-[#2D6A4F]" />
          </div>
          <Link 
            href="/results" 
            className="flex items-center gap-2 text-[#2D6A4F] font-bold hover:gap-3 transition-all"
          >
            FULL TOURNAMENT RESULTS
            <ChevronRight size={20} />
          </Link>
        </div>

        {results.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Tournament</th>
                    <th className="px-6 py-4">Matchup</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4 text-right">Round</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((match: any) => (
                    <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-gray-900 line-clamp-1">{match.tournament.title}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{match.category}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className={`text-sm flex items-center gap-2 ${match.winnerId === match.player1Id ? "font-bold text-[#2D6A4F]" : "text-gray-600"}`}>
                            {match.player1.firstName} {match.player1.lastName}
                            {match.winnerId === match.player1Id && <Trophy size={14} />}
                          </div>
                          <div className={`text-sm flex items-center gap-2 ${match.winnerId === match.player2Id ? "font-bold text-[#2D6A4F]" : "text-gray-600"}`}>
                            {match.player2.firstName} {match.player2.lastName}
                            {match.winnerId === match.player2Id && <Trophy size={14} />}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {match.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                          {match.round}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {results.map((match: any) => (
                <div key={match.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{match.category}</p>
                      <p className="font-bold text-gray-900 line-clamp-1">{match.tournament.title}</p>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                      {match.round}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <div className={`text-sm flex items-center gap-2 ${match.winnerId === match.player1Id ? "font-bold text-[#2D6A4F]" : "text-gray-600"}`}>
                        {match.player1.firstName} {match.player1.lastName}
                        {match.winnerId === match.player1Id && <Trophy size={14} />}
                      </div>
                      {match.winnerId === match.player1Id && <span className="text-xs font-bold text-[#2D6A4F]">WINNER</span>}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className={`text-sm flex items-center gap-2 ${match.winnerId === match.player2Id ? "font-bold text-[#2D6A4F]" : "text-gray-600"}`}>
                        {match.player2.firstName} {match.player2.lastName}
                        {match.winnerId === match.player2Id && <Trophy size={14} />}
                      </div>
                      {match.winnerId === match.player2Id && <span className="text-xs font-bold text-[#2D6A4F]">WINNER</span>}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">Final Score</span>
                    <span className="font-mono text-sm bg-[#0A0A0A] text-white px-3 py-1 rounded">
                      {match.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">No recent match results available.</p>
          </div>
        )}
      </div>
    </section>
  )
}