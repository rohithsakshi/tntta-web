import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, ChevronRight, Trophy } from "lucide-react"
import { format } from "date-fns"
import { getUpcomingTournaments } from "@/lib/data"

export default async function Tournaments() {
  const tournaments = await getUpcomingTournaments()

  return (
    <section className="py-24 bg-[#FAFAFA]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bebas tracking-wider text-[#0A0A0A] mb-2 uppercase">Upcoming Tournaments</h2>
            <div className="w-16 sm:w-24 h-1.5 bg-[#E85D04]" />
          </div>
          <Link 
            href="/tournaments" 
            className="flex items-center gap-2 text-[#E85D04] font-bold hover:gap-3 transition-all text-sm sm:text-base"
          >
            VIEW ALL TOURNAMENTS
            <ChevronRight size={20} />
          </Link>
        </div>

        {tournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.map((tournament: any) => (
              <Link 
                key={tournament.id}
                href={`/tournaments/${tournament.slug}`}
                className="group relative bg-[#0A0A0A] rounded-xl overflow-hidden border-l-4 border-[#E85D04] shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Background Image Header */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={[
                      "/image1.jpg",
                      "/image2.jpg",
                      "/image3.jpg"
                    ][tournament.id.length % 3]} 
                    alt={tournament.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                <div className="p-8 relative -mt-16">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-[#E85D04] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                      ENTRY OPEN
                    </div>
                    <Trophy className="text-white group-hover:text-[#E85D04] transition-colors" size={24} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#E85D04] transition-colors line-clamp-2">
                    {tournament.title}
                  </h3>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Calendar size={18} className="text-[#E85D04]" />
                      <span className="text-sm">
                        {format(new Date(tournament.startDate), "MMM dd")} - {format(new Date(tournament.endDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <MapPin size={18} className="text-[#E85D04]" />
                      <span className="text-sm line-clamp-1">{tournament.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <span className="text-white font-bold">₹{tournament.entryFee / 100} Entry</span>
                    <span className="text-[#E85D04] font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Register Now <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center shadow-sm">
            <Trophy size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No tournaments currently open for registration.</p>
            <Link href="/tournaments" className="text-[#E85D04] font-bold mt-4 inline-block hover:underline">
              Check all scheduled tournaments
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}