import prisma from "@/lib/prisma"
import { 
  BarChart3, 
  Trophy, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  History,
  Settings
} from "lucide-react"
import Link from "next/link"
import StatsCard from "@/components/admin/StatsCard"

export const dynamic = "force-dynamic"

async function getRankingStats() {
  const currentSeason = "2025-26" // Should be dynamic
  
  const [totalRanked, categories] = await Promise.all([
    prisma.rankingEntry.count({ where: { season: currentSeason } }),
    prisma.rankingEntry.groupBy({
      by: ["category"],
      where: { season: currentSeason },
      _count: true
    })
  ])

  return { totalRanked, categories, currentSeason }
}

export default async function AdminRankingsPage() {
  const { totalRanked, categories, currentSeason } = await getRankingStats()

  const CATEGORY_LIST = [
    "MINI_CADET", "CADET", "SUB_JUNIOR", "JUNIOR", "SENIOR", "MENS", "VETERANS"
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bebas tracking-wider text-gray-900 uppercase mb-2">Rankings Management</h1>
          <p className="text-gray-500 font-dm-sans">Update state rankings based on sanctioned tournament points.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
           <Calendar size={18} className="text-[#E85D04]" />
           <span className="font-bold text-gray-900">Season: {currentSeason}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Ranked Players"
          value={totalRanked}
          icon={Trophy}
          color="orange"
        />
        <StatsCard 
          title="Categories Managed"
          value={categories.length}
          icon={BarChart3}
          color="blue"
        />
        <StatsCard 
          title="Last Point Update"
          value="Today" // Should be dynamic
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Category Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-bebas tracking-wide text-gray-900 flex items-center gap-3 uppercase">
             Manage by Category
           </h3>
           <button className="text-xs font-bold text-[#E85D04] hover:underline flex items-center gap-2 uppercase tracking-widest">
             <Settings size={14} />
             Ranking Rules
           </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_LIST.map((cat) => {
            const count = categories.find(c => c.category === cat)?._count || 0
            return (
              <Link 
                key={cat}
                href={`/admin/rankings/${cat}/manage`}
                className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div>
                   <div className="w-12 h-12 rounded-2xl bg-gray-50 text-[#E85D04] flex items-center justify-center mb-6 group-hover:bg-[#E85D04] group-hover:text-white transition-all">
                      <Trophy size={24} />
                   </div>
                   <h4 className="text-xl font-bold text-gray-900 mb-2">{cat.replace("_", " ")}</h4>
                   <p className="text-sm text-gray-400">{count} Ranked Players</p>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                   <span className="text-[10px] font-bold text-[#E85D04] uppercase tracking-widest">Manage Rank</span>
                   <ArrowRight size={16} className="text-gray-300 group-hover:text-[#E85D04] transition-all" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-[40px] p-10 text-white shadow-2xl">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-[#E85D04]">
                  <TrendingUp size={32} />
               </div>
               <div>
                  <h3 className="text-2xl font-bebas tracking-wide uppercase">Recalculate All Rankings</h3>
                  <p className="text-white/50 text-sm">Automatically sync points from all completed tournaments this season.</p>
               </div>
            </div>
            <button className="px-10 py-5 bg-[#E85D04] text-white rounded-[32px] font-bold hover:bg-[#C44D03] transition-all shadow-xl shadow-[#E85D04]/20">
               SYNC DATA NOW
            </button>
         </div>
      </div>
    </div>
  )
}
