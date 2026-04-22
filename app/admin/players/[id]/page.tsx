import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { 
  ArrowLeft, 
  MapPin, 
  Trophy, 
  Calendar, 
  Phone, 
  Mail, 
  UserCheck, 
  UserMinus,
  Key,
  ShieldCheck,
  History,
  TrendingUp,
  CreditCard,
  Target
} from "lucide-react"
import Link from "next/link"
import StatusBadge from "@/components/admin/StatusBadge"
import { format } from "date-fns"

export const dynamic = "force-dynamic"

async function getPlayerData(id: string) {
  const player = await prisma.user.findUnique({
    where: { id },
    include: {
      applications: {
        include: { tournament: true },
        orderBy: { appliedAt: "desc" }
      },
      matchesAsPlayer1: { include: { tournament: true, player2: true, winner: true }, take: 10 },
      matchesAsPlayer2: { include: { tournament: true, player1: true, winner: true }, take: 10 },
      rankingEntries: { orderBy: { updatedAt: "desc" } }
    }
  })
  return player
}

export default async function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const player = await getPlayerData(id)

  if (!player) notFound()

  // Combine and sort matches
  const allMatches = [...player.matchesAsPlayer1, ...player.matchesAsPlayer2].sort(
    (a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime()
  )

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/players"
            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E85D04] transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-4xl font-bebas tracking-wider text-gray-900 uppercase leading-none mb-2">Player Profile</h1>
            <p className="text-gray-500 font-dm-sans text-sm">Reviewing career history and account status.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2">
             <Key size={18} />
             RESET PASSWORD
           </button>
           {player.isActive ? (
             <button className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold border border-red-100 hover:bg-red-100 transition-all flex items-center gap-2">
               <UserMinus size={18} />
               DEACTIVATE
             </button>
           ) : (
             <button className="px-6 py-3 bg-green-50 text-green-600 rounded-xl font-bold border border-green-100 hover:bg-green-100 transition-all flex items-center gap-2">
               <UserCheck size={18} />
               ACTIVATE
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Profile Card */}
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-[#E85D04]" />
             
             <div className="flex flex-col items-center text-center mb-10">
                <div className="w-32 h-32 rounded-3xl bg-gray-50 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-bold text-[#E85D04] mb-6 overflow-hidden">
                  {player.profilePhoto ? (
                    <img src={player.profilePhoto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{player.firstName[0]}{player.lastName[0]}</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{player.firstName} {player.lastName}</h2>
                <p className="text-[#E85D04] font-bold text-[10px] tracking-widest uppercase mt-2">{player.tnttaId}</p>
             </div>

             <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#E85D04] shadow-sm">
                      <Trophy size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ranking Points</p>
                      <p className="text-xl font-bebas text-gray-900 tracking-wide">{player.rankingPoints || 0}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">District</p>
                    <p className="font-bold text-gray-900 text-sm">{player.district}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</p>
                    <p className="font-bold text-gray-900 text-sm">{player.category}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                   <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone size={16} className="text-[#E85D04]" />
                      <span>{player.contact}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail size={16} className="text-[#E85D04]" />
                      <span>{player.email || "No email provided"}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar size={16} className="text-[#E85D04]" />
                      <span>Born {format(new Date(player.dob), "PPP")}</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-gray-900 rounded-[40px] p-8 text-white">
             <h3 className="text-xl font-bebas tracking-wider mb-6 flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#E85D04]" />
                Verification Status
             </h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                   <span className="text-sm">Account Status</span>
                   <StatusBadge status={player.isActive ? "ACTIVE" : "INACTIVE"} type="player" />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                   <span className="text-sm">Payment Profile</span>
                   <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">VERIFIED</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Tabs/History */}
        <div className="lg:col-span-2 space-y-10">
          {/* Tournament History */}
          <section className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
             <h3 className="text-2xl font-bebas tracking-wide text-gray-900 mb-8 flex items-center gap-3">
                <History className="text-[#E85D04]" size={24} />
                Tournament Participation
             </h3>
             <div className="space-y-4">
                {player.applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-[#E85D04]/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#E85D04] font-bebas text-xl">
                        {app.tournament.startDate.getFullYear()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-[#E85D04] transition-colors">{app.tournament.title}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Applied {format(new Date(app.appliedAt), "MMM d")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <StatusBadge status={app.paymentStatus} type="payment" />
                       <p className="text-[10px] font-bold text-gray-900 mt-2">₹{app.amount / 100}</p>
                    </div>
                  </div>
                ))}
                {player.applications.length === 0 && (
                  <div className="py-20 text-center text-gray-400 italic">No tournament history found.</div>
                )}
             </div>
          </section>

          {/* Match Results */}
          <section className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
             <h3 className="text-2xl font-bebas tracking-wide text-gray-900 mb-8 flex items-center gap-3">
                <Target className="text-[#E85D04]" size={24} />
                Recent Match Results
             </h3>
             <div className="space-y-4">
                {(allMatches as any[]).map((match) => {
                  const opponent = match.player1Id === player.id ? match.player2 : match.player1
                  const isWinner = match.winnerId === player.id
                  return (
                    <div key={match.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{match.tournament.title}</p>
                        <div className="flex items-center gap-4">
                           <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${isWinner ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                             {isWinner ? "W" : "L"}
                           </span>
                           <p className="font-bold text-gray-900">vs {opponent.firstName} {opponent.lastName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-lg font-bebas text-gray-900 tracking-wider">{match.score}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{match.round}</p>
                      </div>
                    </div>
                  )
                })}
                {allMatches.length === 0 && (
                  <div className="py-20 text-center text-gray-400 italic">No match results recorded.</div>
                )}
             </div>
          </section>
        </div>
      </div>
    </div>
  )
}
