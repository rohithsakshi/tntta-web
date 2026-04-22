import { Trophy, ArrowUp, ArrowDown, Minus, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/prisma"
import { Category, Gender } from "@prisma/client"

export const dynamic = "force-dynamic"

async function getRankings(category?: string, gender?: string) {
  return await prisma.user.findMany({
    where: {
      role: "PLAYER",
      category: category && category !== "ALL" ? (category as Category) : undefined,
      gender: gender && gender !== "ALL" ? (gender as Gender) : undefined,
    },
    orderBy: { rankingPoints: "desc" },
    take: 50,
  })
}

export default async function RankingsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ category?: string, gender?: string }> 
}) {
  const { category, gender } = await searchParams
  const currentCategory = category || "ALL"
  const currentGender = gender || "ALL"
  const players = await getRankings(currentCategory, currentGender)

  const categoryFilters = [
    { label: "All", value: "ALL" },
    { label: "Mini Cadet", value: Category.MINI_CADET },
    { label: "Cadet", value: Category.CADET },
    { label: "Sub Junior", value: Category.SUB_JUNIOR },
    { label: "Junior", value: Category.JUNIOR },
    { label: "Senior", value: Category.SENIOR },
    { label: "Mens", value: Category.MENS },
    { label: "Veterans", value: Category.VETERANS },
  ]

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <div className="bg-[#0A0A0A] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1544X0TzmHY?w=1600&h=500&q=85&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bebas tracking-wider mb-4 uppercase">Player Rankings</h1>
          <p className="text-lg sm:text-xl text-gray-400 font-dm-sans max-w-2xl">
            Official TNTTA State Rankings for the 2025-26 Season.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Category Tabs */}
          <div className="flex-1 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm border border-gray-100 min-w-max">
              {categoryFilters.map((f) => (
                <Link
                  key={f.value}
                  href={`/rankings?category=${f.value}&gender=${currentGender}`}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    currentCategory === f.value 
                    ? "bg-[#0A0A0A] text-white shadow-lg" 
                    : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Gender Toggles */}
          <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm border border-gray-100">
            {["ALL", "MALE", "FEMALE"].map((g) => (
              <Link
                key={g}
                href={`/rankings?category=${currentCategory}&gender=${g}`}
                className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  currentGender === g 
                  ? "bg-[#E85D04] text-white shadow-lg shadow-[#E85D04]/20" 
                  : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {g === "ALL" ? "All Genders" : g}
              </Link>
            ))}
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-gray-100">
                  <th className="px-8 py-6 text-center">Rank</th>
                  <th className="px-8 py-6">Player Details</th>
                  <th className="px-8 py-6">District / Club</th>
                  <th className="px-8 py-6 text-right">Points</th>
                  <th className="px-8 py-6 text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {players.length > 0 ? (
                  players.map((player: any, index: number) => {
                    const rank = index + 1
                    return (
                      <tr key={player.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6 text-center">
                          {rank === 1 && (
                            <div className="w-10 h-10 bg-yellow-400 text-white rounded-full flex items-center justify-center mx-auto font-bebas text-xl shadow-lg shadow-yellow-400/30">1</div>
                          )}
                          {rank === 2 && (
                            <div className="w-10 h-10 bg-gray-300 text-white rounded-full flex items-center justify-center mx-auto font-bebas text-xl shadow-lg shadow-gray-300/30">2</div>
                          )}
                          {rank === 3 && (
                            <div className="w-10 h-10 bg-orange-300 text-white rounded-full flex items-center justify-center mx-auto font-bebas text-xl shadow-lg shadow-orange-300/30">3</div>
                          )}
                          {rank > 3 && (
                            <span className="text-lg font-bebas text-gray-400">{rank}</span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100">
                              <Image 
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${player.firstName} ${player.lastName}&backgroundColor=0A0A0A&textColor=E85D04`}
                                alt={player.firstName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-[#E85D04] transition-colors">
                                {player.firstName} {player.lastName}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                {player.tnttaId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-medium text-gray-700">{player.district}</p>
                          <p className="text-xs text-gray-400">{player.club || "Unattached"}</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-xl font-bebas tracking-wide text-gray-900">
                            {player.rankingPoints}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center">
                            {rank === 1 ? <ArrowUp size={16} className="text-green-500" /> : <Minus size={16} className="text-gray-300" />}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-gray-500 italic">
                      No rankings available for this selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400 font-medium uppercase tracking-[0.2em]">
          Rankings are updated after each sanctioned tournament.
        </p>
      </div>
    </div>
  )
}