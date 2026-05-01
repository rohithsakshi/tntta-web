"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Phone,
  ChevronRight,
  Info
} from "lucide-react"
import { toast } from "react-hot-toast"

export default function TournamentRegisterPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  
  const [tournament, setTournament] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    async function fetchTournament() {
      try {
        const res = await fetch(`/api/tournaments`)
        const data = await res.json()
        if (data.success) {
          const t = data.data.find((item: any) => item.slug === params.id)
          if (t) {
            setTournament(t)
          } else {
            toast.error("Tournament not found")
            router.push("/tournaments")
          }
        }
      } catch (err) {
        toast.error("Failed to load tournament")
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchTournament()
    } else if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/tournaments/${params.id}/register`)
    }
  }, [params.id, status, session, router])

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat) 
        : [...prev, cat]
    )
  }

  const handleApply = async () => {
    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category")
      return
    }

    setIsSubmitting(true)
    try {
      // We'll send the categories as an array. The API will need to handle this.
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournamentId: tournament.id,
          categories: selectedCategories,
          totalAmount: tournament.entryFee * selectedCategories.length,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setStep(3)
        toast.success("Tournament entries submitted!")
      } else {
        toast.error(data.error || "Failed to submit entries")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#E85D04]" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link 
          href={`/tournaments/${params.id}`} 
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-8 font-bold text-sm"
        >
          <ArrowLeft size={16} /> Back to Tournament Details
        </Link>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-xs mx-auto mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s ? "bg-[#E85D04] text-white shadow-lg" : "bg-white text-gray-400 border-2 border-gray-200"
                }`}>
                  {step > s ? <CheckCircle2 size={20} /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 mx-2 rounded ${step > s ? "bg-[#E85D04]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest">
            {step === 1 && "Category Selection"}
            {step === 2 && "Entry Summary"}
            {step === 3 && "Payment Status"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
            >
              <div className="mb-8">
                <p className="text-[#E85D04] font-bold text-xs uppercase tracking-widest mb-2">Tournament Entry</p>
                <h2 className="text-3xl font-bebas tracking-wide text-gray-900">{tournament.title}</h2>
              </div>

              <div className="mb-10">
                <label className="block text-sm font-bold text-gray-700 mb-4">Select Your Event Categories * (Choose multiple if eligible)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tournament.categories.map((cat: string) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                        selectedCategories.includes(cat) 
                        ? "bg-[#E85D04]/5 border-[#E85D04] shadow-md" 
                        : "bg-white border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <Trophy className={selectedCategories.includes(cat) ? "text-[#E85D04]" : "text-gray-200"} size={24} />
                        {selectedCategories.includes(cat) && (
                          <div className="bg-[#E85D04] text-white p-1 rounded-full">
                            <CheckCircle2 size={16} />
                          </div>
                        )}
                      </div>
                      <p className={`font-bold mt-4 ${selectedCategories.includes(cat) ? "text-gray-900" : "text-gray-600"}`}>
                        {cat.replace("_", " ")}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 mb-10">
                <Info className="text-[#0077B6] shrink-0" size={24} />
                <p className="text-sm text-blue-800 leading-relaxed">
                  Please ensure your age eligibility for the selected categories. Misrepresentation may lead to disqualification without refund.
                </p>
              </div>

              <button
                disabled={selectedCategories.length === 0}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-[#E85D04] text-white rounded-xl font-bold text-lg hover:bg-[#C44D03] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                Review {selectedCategories.length} Application{selectedCategories.length > 1 ? "s" : ""}
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
            >
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-8 font-bold text-sm">
                <ArrowLeft size={16} /> Back to Selection
              </button>

              <h2 className="text-3xl font-bebas tracking-wide text-gray-900 mb-8 border-b pb-4">Application Summary</h2>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-500 font-medium">Tournament</span>
                  <span className="font-bold text-gray-900 text-right">{tournament.title}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-500 font-medium">Player</span>
                  <span className="font-bold text-gray-900">{session?.user?.firstName} {session?.user?.lastName}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-500 font-medium block mb-2">Selected Categories</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map(cat => (
                      <span key={cat} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700">
                        {cat.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center p-8 bg-[#E85D04]/5 border-2 border-dashed border-[#E85D04]/30 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-gray-600 font-bold">Total Entry Fee</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">₹{tournament.entryFee/100} x {selectedCategories.length} Categories</span>
                  </div>
                  <span className="text-4xl font-bebas text-[#E85D04]">₹{(tournament.entryFee * selectedCategories.length) / 100}</span>
                </div>
              </div>

              <button
                disabled={isSubmitting}
                onClick={handleApply}
                className="w-full py-4 bg-[#E85D04] text-white rounded-xl font-bold text-lg hover:bg-[#C44D03] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm & Pay Total Amount"}
                {!isSubmitting && <ShieldCheck size={20} />}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 text-center border-t-8 border-[#E85D04]"
            >
              <div className="w-24 h-24 bg-orange-100 text-[#E85D04] rounded-full flex items-center justify-center mx-auto mb-8">
                <ShieldCheck size={48} />
              </div>
              <h2 className="text-4xl font-bebas tracking-wide text-gray-900 mb-4">Applications Received</h2>
              <p className="text-gray-600 mb-12 max-w-md mx-auto leading-relaxed">
                Your entries for <strong>{tournament.title}</strong> have been saved with <strong>PENDING</strong> status.
              </p>

              <div className="bg-gray-50 rounded-2xl p-8 mb-12 text-left space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-gray-500 font-medium mb-2 text-sm uppercase tracking-widest">Applied Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map(cat => (
                      <span key={cat} className="px-2 py-1 bg-[#E85D04]/10 text-[#E85D04] text-[10px] font-bold rounded uppercase">
                        {cat.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Total Amount Due</span>
                  <span className="text-gray-900 font-bold text-xl">₹{(tournament.entryFee * selectedCategories.length) / 100}.00</span>
                </div>
              </div>

              <div className="space-y-4">
                <a 
                  href={`https://wa.me/919999999999?text=Hi, I am ${session?.user?.firstName} ${session?.user?.lastName}. I just applied for ${tournament.title} in ${selectedCategories.join(", ")} and want to complete my payment.`}
                  target="_blank"
                  className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#128C7E] transition-all"
                >
                  <Phone size={20} />
                  Chat on WhatsApp for Payment
                </a>
                <Link 
                  href="/dashboard/tournaments"
                  className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all"
                >
                  View My Tournaments
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}