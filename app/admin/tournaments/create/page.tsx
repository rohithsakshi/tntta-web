"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  MapPin, 
  Trophy, 
  Settings,
  Info,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react"
import Link from "next/link"

type TournamentType = "STATE_RANKING" | "DISTRICT_RANKING" | "STATE_CHAMPIONSHIP" | "INVITATIONAL" | "OPEN_TOURNAMENT"
type Category = "MINI_CADET" | "CADET" | "SUB_JUNIOR" | "JUNIOR" | "SENIOR" | "MENS" | "VETERANS"
type TournamentStatus = "DRAFT" | "UPCOMING" | "OPEN" | "CLOSED" | "ONGOING" | "COMPLETED" | "CANCELLED"

export default function CreateTournamentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    type: "STATE_RANKING" as TournamentType,
    description: "",
    venue: "",
    location: "Chennai",
    startDate: "",
    endDate: "",
    registrationOpens: new Date().toISOString().split("T")[0],
    registrationDeadline: "",
    entryFee: 500,
    maxParticipants: 0,
    categories: [] as Category[],
    status: "DRAFT" as TournamentStatus
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          entryFee: formData.entryFee * 100, // Convert to paise
          maxParticipants: formData.maxParticipants > 0 ? formData.maxParticipants : undefined
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create tournament")
      }

      router.push("/admin/tournaments")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (cat: Category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }))
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-10 gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link 
            href="/admin/tournaments"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E85D04] transition-all shadow-sm shrink-0"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bebas tracking-wider text-gray-900 uppercase leading-none mb-1 sm:mb-2">New Tournament</h1>
            <p className="text-gray-500 font-dm-sans text-xs sm:text-sm">Configure event details, categories, and deadlines.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
           <button 
             onClick={() => setFormData(prev => ({ ...prev, status: "DRAFT" as TournamentStatus }))}
             className="flex-1 md:flex-none px-4 sm:px-6 py-3 bg-white border border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm text-xs sm:text-sm"
           >
             SAVE AS DRAFT
           </button>
           <button 
             onClick={handleSubmit}
             disabled={loading}
             className="flex-1 md:flex-none px-6 sm:px-8 py-3 bg-[#E85D04] text-white rounded-xl font-bold flex items-center justify-center gap-2 sm:gap-3 hover:bg-[#C44D03] transition-all shadow-lg shadow-[#E85D04]/20 disabled:opacity-50 text-xs sm:text-sm"
           >
             {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
             PUBLISH
           </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section 1: Basic Info */}
        <div className="bg-white rounded-3xl sm:rounded-[40px] p-6 sm:p-10 border border-gray-100 shadow-sm">
          <h3 className="text-lg sm:text-xl font-bebas tracking-wide text-gray-900 mb-6 sm:mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#E85D04] flex items-center justify-center shrink-0">
              <Info size={16} />
            </div>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Tournament Title</label>
              <input 
                required
                type="text" 
                placeholder="e.g. 84th State Ranking Championship"
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-medium text-gray-900"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Event Type</label>
              <select 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900 appearance-none"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as TournamentType })}
              >
                {["STATE_RANKING", "DISTRICT_RANKING", "STATE_CHAMPIONSHIP", "INVITATIONAL", "OPEN_TOURNAMENT"].map(t => (
                  <option key={t} value={t}>{t.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Description & Rules</label>
              <textarea 
                required
                rows={6}
                placeholder="Detailed rules, eligibility, and prize information..."
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-medium text-gray-900 resize-none"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Schedule */}
        <div className="bg-white rounded-3xl sm:rounded-[40px] p-6 sm:p-10 border border-gray-100 shadow-sm">
          <h3 className="text-lg sm:text-xl font-bebas tracking-wide text-gray-900 mb-6 sm:mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar size={16} />
            </div>
            Schedule & Deadlines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Start Date</label>
              <input 
                required
                type="date" 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">End Date</label>
              <input 
                required
                type="date" 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900"
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Registration Deadline</label>
              <input 
                required
                type="date" 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900"
                value={formData.registrationDeadline}
                onChange={e => setFormData({ ...formData, registrationDeadline: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Venue */}
        <div className="bg-white rounded-3xl sm:rounded-[40px] p-6 sm:p-10 border border-gray-100 shadow-sm">
          <h3 className="text-lg sm:text-xl font-bebas tracking-wide text-gray-900 mb-6 sm:mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <MapPin size={16} />
            </div>
            Venue Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">District / City</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Chennai"
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Full Venue Address</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Nehru Stadium, Gate No. 2"
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900"
                value={formData.venue}
                onChange={e => setFormData({ ...formData, venue: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Categories */}
        <div className="bg-white rounded-3xl sm:rounded-[40px] p-6 sm:p-10 border border-gray-100 shadow-sm">
          <h3 className="text-lg sm:text-xl font-bebas tracking-wide text-gray-900 mb-6 sm:mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Trophy size={16} />
            </div>
            Eligible Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {["MINI_CADET", "CADET", "SUB_JUNIOR", "JUNIOR", "SENIOR", "MENS", "VETERANS"].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat as Category)}
                className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center gap-3 ${
                  formData.categories.includes(cat as Category)
                    ? "bg-[#E85D04] border-[#E85D04] text-white shadow-lg shadow-[#E85D04]/20"
                    : "bg-gray-50 border-gray-100 text-gray-500 hover:border-[#E85D04]/30"
                }`}
              >
                {formData.categories.includes(cat as Category) ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-current opacity-20" />}
                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{cat.replace("_", " ")}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 5: Registration Settings */}
        <div className="bg-white rounded-3xl sm:rounded-[40px] p-6 sm:p-10 border border-gray-100 shadow-sm">
          <h3 className="text-lg sm:text-xl font-bebas tracking-wide text-gray-900 mb-6 sm:mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center shrink-0">
              <Settings size={16} />
            </div>
            Registration & Fees
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Entry Fee (₹)</label>
              <input 
                required
                type="number" 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900"
                value={formData.entryFee}
                onChange={e => setFormData({ ...formData, entryFee: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Participant Cap (Optional)</label>
              <input 
                type="number" 
                placeholder="Leave 0 for unlimited"
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900"
                value={formData.maxParticipants}
                onChange={e => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-6 pt-6 sm:pt-10">
           <button 
             type="button"
             onClick={() => router.back()}
             className="order-2 sm:order-1 px-10 py-4 sm:py-5 bg-gray-50 text-gray-500 rounded-2xl sm:rounded-3xl font-bold hover:bg-gray-100 transition-all text-sm"
           >
             CANCEL
           </button>
           <button 
             type="submit"
             disabled={loading}
             className="order-1 sm:order-2 px-16 py-4 sm:py-5 bg-gray-900 text-white rounded-2xl sm:rounded-3xl font-bold flex items-center justify-center gap-4 hover:bg-black transition-all shadow-2xl disabled:opacity-50 text-sm"
           >
             {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
             CREATE TOURNAMENT
           </button>
        </div>
      </form>
    </div>
  )
}
