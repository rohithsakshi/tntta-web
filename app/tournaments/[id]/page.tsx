import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Trophy, Users, Clock, Info, ChevronRight, FileText } from "lucide-react"
import { format } from "date-fns"
import GoogleMap from "@/components/GoogleMap"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

async function getTournament(slug: string) {
  return await prisma.tournament.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { applications: true }
      },
      applications: {
        include: {
          player: true
        },
        take: 10
      }
    }
  })
}

export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tournament = await getTournament(id)

  if (!tournament) {
    notFound()
  }

  const isClosed = new Date() > new Date(tournament.registrationDeadline)

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image 
          src={tournament.posterUrl || [
            "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=1600&h=900&q=90&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1509666537727-9154b6962292?w=1600&h=900&q=90&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?w=1600&h=900&q=90&auto=format&fit=crop"
          ][tournament.id.length % 3]} 
          alt={tournament.title} 
          fill 
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    tournament.status === "OPEN" ? "bg-[#2D6A4F] text-white" : "bg-[#E85D04] text-white"
                  }`}>
                    {tournament.status}
                  </span>
                  <span className="text-white/60 text-xs font-bold tracking-widest flex items-center gap-1">
                    <Trophy size={14} className="text-[#E85D04]" />
                    STATE RANKING
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bebas tracking-wider text-white leading-tight">
                  {tournament.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bebas tracking-wide text-gray-900 mb-6 flex items-center gap-3">
                <Info size={24} className="text-[#E85D04]" />
                Tournament Overview
              </h2>
              <div className="prose prose-orange max-w-none text-gray-600 font-dm-sans leading-relaxed">
                {tournament.description}
              </div>
            </section>

            {/* Categories */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bebas tracking-wide text-gray-900 mb-6 flex items-center gap-3">
                <Trophy size={24} className="text-[#E85D04]" />
                Categories & Fees
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tournament.categories.map((cat: any) => (
                  <div key={cat} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</p>
                    <p className="font-bold text-gray-900">{cat.replace("_", " ")}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Venue Map Placeholder */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bebas tracking-wide text-gray-900 mb-6 flex items-center gap-3">
                <MapPin size={24} className="text-[#E85D04]" />
                Venue Details
              </h2>
              <div className="p-6 bg-gray-900 rounded-2xl text-white">
                <p className="text-lg font-bold mb-2">{tournament.venue}</p>
                <p className="text-gray-400 text-sm mb-6">{tournament.location}, Tamil Nadu</p>
                <div className="h-64 rounded-xl overflow-hidden relative border border-white/5">
                  <GoogleMap 
                    location={tournament.location}
                    venue={tournament.venue}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Action Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-24">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 font-medium">Entry Fee</span>
                  <span className="text-3xl font-bebas text-[#E85D04]">₹{tournament.entryFee / 100}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl mb-4">
                  <Users className="text-[#E85D04]" size={20} />
                  <span className="font-bold">{tournament._count.applications} Players Registered</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                  <Clock className="text-[#E85D04]" size={20} />
                  <div>
                    <p className="font-bold">Deadline</p>
                    <p className="text-xs">{format(new Date(tournament.registrationDeadline), "PPP")}</p>
                  </div>
                </div>
              </div>

              {!isClosed && tournament.status === "OPEN" ? (
                <Link 
                  href={`/tournaments/${tournament.slug}/register`}
                  className="w-full bg-[#E85D04] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#C44D03] transition-all shadow-lg"
                >
                  Register Now
                  <ChevronRight size={20} />
                </Link>
              ) : (
                <button 
                  disabled 
                  className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-bold cursor-not-allowed"
                >
                  Registrations Closed
                </button>
              )}

              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6">
                Official TNTTA Sanctioned Event
              </p>
            </div>

            {/* Recent Registrations */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bebas tracking-wide text-gray-900 mb-6 flex items-center gap-2">
                <Users size={20} className="text-[#E85D04]" />
                Recently Registered
              </h3>
              <div className="space-y-4">
                {tournament.applications.length > 0 ? (
                  tournament.applications.map((app: any) => (
                    <div key={app.id} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100">
                        <Image
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${app.player.firstName} ${app.player.lastName}&backgroundColor=0A0A0A&textColor=E85D04`}
                          alt={app.player.firstName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{app.player.firstName} {app.player.lastName}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{app.player.district}</p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">{app.category.replace("_", " ")}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic">Be the first to register!</p>
                )}
                {tournament._count.applications > 10 && (
                  <Link href={`/tournaments/${tournament.slug}/participants`} className="text-xs font-bold text-[#E85D04] hover:underline mt-4 inline-block">
                    View all {tournament._count.applications} participants
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}