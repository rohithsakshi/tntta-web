import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Trophy, Calendar, MapPin, Clock } from "lucide-react"
import { format } from "date-fns"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function MyTournamentsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const applications = await prisma.tournamentApplication.findMany({
    where: { playerId: session.user.id },
    include: { tournament: true },
    orderBy: { appliedAt: "desc" }
  })

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bebas tracking-wider text-gray-900 mb-2">My Tournaments</h1>
        <p className="text-gray-500">Track your registration status and upcoming match schedules.</p>
      </div>

      {applications.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app: any) => (
            <div key={app.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="p-8 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    app.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {app.paymentStatus === "PAID" ? "CONFIRMED" : "PENDING PAYMENT"}
                  </span>
                  <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">
                    ID: {app.appId}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-6">{app.tournament.title}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar size={18} className="text-[#E85D04]" />
                    <div className="text-sm">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                      <p className="font-bold">{format(new Date(app.tournament.startDate), "MMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={18} className="text-[#E85D04]" />
                    <div className="text-sm">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Venue</p>
                      <p className="font-bold line-clamp-1">{app.tournament.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Trophy size={18} className="text-[#E85D04]" />
                    <div className="text-sm">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</p>
                      <p className="font-bold">{app.category.replace("_", " ")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 flex flex-col justify-center border-l border-gray-100 min-w-[200px]">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Amount</p>
                <p className="text-3xl font-bebas text-gray-900 text-center mb-6">₹{app.amount / 100}</p>
                <button className="w-full py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all">
                  VIEW SLIP
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
          <Trophy size={64} className="mx-auto text-gray-200 mb-6" />
          <h3 className="text-2xl font-bebas tracking-wide text-gray-400">No entries found</h3>
          <p className="text-gray-500 mt-2 mb-8">You haven&apos;t registered for any tournaments yet.</p>
          <Link 
            href="/tournaments"
            className="px-8 py-3 bg-[#E85D04] text-white rounded-xl font-bold hover:bg-[#C44D03] transition-all shadow-lg"
          >
            Register for a Tournament
          </Link>
        </div>
      )}
    </div>
  )
}
