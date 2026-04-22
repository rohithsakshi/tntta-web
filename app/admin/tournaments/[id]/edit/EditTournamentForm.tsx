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
import type { $Enums } from "@prisma/client"

type TournamentType = $Enums.TournamentType
type Category = $Enums.Category
type TournamentStatus = $Enums.TournamentStatus

interface EditTournamentFormProps {
  tournament: any
}

export default function EditTournamentForm({ tournament }: EditTournamentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: tournament.title,
    type: tournament.type,
    description: tournament.description,
    venue: tournament.venue,
    location: tournament.location,
    startDate: new Date(tournament.startDate).toISOString().split("T")[0],
    endDate: new Date(tournament.endDate).toISOString().split("T")[0],
    registrationOpens: new Date(tournament.registrationOpens).toISOString().split("T")[0],
    registrationDeadline: new Date(tournament.registrationDeadline).toISOString().split("T")[0],
    entryFee: tournament.entryFee / 100,
    maxParticipants: tournament.maxParticipants || 0,
    categories: tournament.categories as Category[],
    status: tournament.status as TournamentStatus
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/admin/tournaments/${tournament.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          entryFee: formData.entryFee * 100,
          maxParticipants: formData.maxParticipants > 0 ? formData.maxParticipants : undefined
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update tournament")
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
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/tournaments"
            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E85D04] transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-4xl font-bebas tracking-wider text-gray-900 uppercase leading-none mb-2">Edit Tournament</h1>
            <p className="text-gray-500 font-dm-sans text-sm">Update event details and registration settings.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={handleSubmit}
             disabled={loading}
             className="px-8 py-3 bg-[#E85D04] text-white rounded-xl font-bold flex items-center gap-3 hover:bg-[#C44D03] transition-all shadow-lg shadow-[#E85D04]/20 disabled:opacity-50"
           >
             {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
             SAVE CHANGES
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
        {/* Same fields as Create Form but pre-filled */}
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bebas tracking-wide text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#E85D04] flex items-center justify-center">
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
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Status</label>
              <select 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900 appearance-none"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as TournamentStatus })}
              >
                {["DRAFT", "UPCOMING", "OPEN", "CLOSED", "ONGOING", "COMPLETED", "CANCELLED"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Description & Rules</label>
              <textarea 
                required
                rows={6}
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-medium text-gray-900 resize-none"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* ... Other sections omitted for brevity in this snippet, but I'll include them in the real file ... */}
        {/* I'll use the full form logic from Create but with the pre-filled values */}
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bebas tracking-wide text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar size={16} />
            </div>
            Schedule & Deadlines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Start Date</label>
              <input required type="date" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">End Date</label>
              <input required type="date" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Registration Deadline</label>
              <input required type="date" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900" value={formData.registrationDeadline} onChange={e => setFormData({ ...formData, registrationDeadline: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Venue */}
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bebas tracking-wide text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
              <MapPin size={16} />
            </div>
            Venue Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">District / City</label>
              <input required type="text" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Full Venue Address</label>
              <input required type="text" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bebas tracking-wide text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
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

        {/* Settings */}
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bebas tracking-wide text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center">
              <Settings size={16} />
            </div>
            Registration & Fees
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Entry Fee (₹)</label>
              <input required type="number" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900" value={formData.entryFee} onChange={e => setFormData({ ...formData, entryFee: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Participant Cap</label>
              <input type="number" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900" value={formData.maxParticipants} onChange={e => setFormData({ ...formData, maxParticipants: Number(e.target.value) })} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-6 pt-10">
           <button type="button" onClick={() => router.back()} className="px-10 py-5 bg-gray-50 text-gray-500 rounded-3xl font-bold hover:bg-gray-100 transition-all">CANCEL</button>
           <button type="submit" disabled={loading} className="px-16 py-5 bg-gray-900 text-white rounded-3xl font-bold flex items-center gap-4 hover:bg-black transition-all shadow-2xl disabled:opacity-50">
             {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
             SAVE CHANGES
           </button>
        </div>
      </form>
    </div>
  )
}
