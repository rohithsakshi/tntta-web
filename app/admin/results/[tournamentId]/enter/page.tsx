"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  ArrowLeft, 
  Save, 
  Target, 
  Users, 
  Trophy, 
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2
} from "lucide-react"
import Link from "next/link"

export default function EnterResultsPage() {
  const router = useRouter()
  const { tournamentId } = useParams()
  const [loading, setLoading] = useState(false)
  const [fetchingPlayers, setFetchingPlayers] = useState(true)
  const [error, setError] = useState("")
  const [players, setPlayers] = useState<any[]>([])

  const [formData, setFormData] = useState({
    player1Id: "",
    player2Id: "",
    winnerId: "",
    score: "",
    round: "Preliminary",
    category: "SENIOR"
  })

  // Fetch players registered for this tournament
  useEffect(() => {
    async function getPlayers() {
      try {
        const res = await fetch(`/api/admin/tournaments/${tournamentId}/entries`)
        if (res.ok) {
          const data = await res.json()
          // Extract players from applications
          setPlayers(data.map((app: any) => app.player))
        }
      } catch (err) {
        console.error("Failed to fetch players", err)
      } finally {
        setFetchingPlayers(false)
      }
    }
    getPlayers()
  }, [tournamentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.player1Id === formData.player2Id) {
      setError("Players must be different")
      return
    }
    if (!formData.winnerId) {
      setError("Please select a winner")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tournamentId
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save result")
      }

      // Reset form for next entry but keep round/category
      setFormData(prev => ({
        ...prev,
        player1Id: "",
        player2Id: "",
        winnerId: "",
        score: ""
      }))
      
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-6 mb-10">
        <Link 
          href="/admin/results"
          className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E85D04] transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-4xl font-bebas tracking-wider text-gray-900 uppercase leading-none mb-2">Enter Results</h1>
          <p className="text-gray-500 font-dm-sans text-sm">Add match scores for tournament progression.</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Match Config */}
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Category</label>
              <select 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900 appearance-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="MINI_CADET">MINI CADET</option>
                <option value="CADET">CADET</option>
                <option value="SUB_JUNIOR">SUB JUNIOR</option>
                <option value="JUNIOR">JUNIOR</option>
                <option value="SENIOR">SENIOR</option>
                <option value="MENS">MENS</option>
                <option value="VETERANS">VETERANS</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Tournament Round</label>
              <select 
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900 appearance-none"
                value={formData.round}
                onChange={e => setFormData({ ...formData, round: e.target.value })}
              >
                <option value="Preliminary">Preliminary</option>
                <option value="Round of 32">Round of 32</option>
                <option value="Round of 16">Round of 16</option>
                <option value="Quarterfinal">Quarterfinal</option>
                <option value="Semifinal">Semifinal</option>
                <option value="Final">Final</option>
              </select>
            </div>
          </div>
        </div>

        {/* Players & Score */}
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Player 1 */}
            <div className="flex-1 space-y-4 text-center">
               <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Player 1</label>
               <select 
                 required
                 className="w-full px-6 py-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900 text-center"
                 value={formData.player1Id}
                 onChange={e => setFormData({ ...formData, player1Id: e.target.value })}
               >
                 <option value="">Select Player</option>
                 {players.map(p => (
                   <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                 ))}
               </select>
               <button 
                 type="button"
                 onClick={() => setFormData({ ...formData, winnerId: formData.player1Id })}
                 className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all ${
                   formData.winnerId === formData.player1Id && formData.player1Id
                     ? "bg-green-500 text-white shadow-lg"
                     : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                 }`}
               >
                 {formData.winnerId === formData.player1Id && formData.player1Id ? "WINNER" : "MARK AS WINNER"}
               </button>
            </div>

            <div className="text-3xl font-bebas text-gray-300">VS</div>

            {/* Player 2 */}
            <div className="flex-1 space-y-4 text-center">
               <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Player 2</label>
               <select 
                 required
                 className="w-full px-6 py-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-[#E85D04]/30 focus:bg-white outline-none transition-all font-bold text-gray-900 text-center"
                 value={formData.player2Id}
                 onChange={e => setFormData({ ...formData, player2Id: e.target.value })}
               >
                 <option value="">Select Player</option>
                 {players.map(p => (
                   <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                 ))}
               </select>
               <button 
                 type="button"
                 onClick={() => setFormData({ ...formData, winnerId: formData.player2Id })}
                 className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all ${
                   formData.winnerId === formData.player2Id && formData.player2Id
                     ? "bg-green-500 text-white shadow-lg"
                     : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                 }`}
               >
                 {formData.winnerId === formData.player2Id && formData.player2Id ? "WINNER" : "MARK AS WINNER"}
               </button>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-gray-100">
             <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-6">Final Match Score</label>
             <input 
               required
               type="text" 
               placeholder="e.g. 11-8, 9-11, 11-6, 11-7"
               className="w-full px-8 py-6 bg-gray-900 text-white rounded-[32px] text-center text-2xl font-bebas tracking-[0.2em] outline-none border-4 border-transparent focus:border-[#E85D04] transition-all placeholder:text-gray-700"
               value={formData.score}
               onChange={e => setFormData({ ...formData, score: e.target.value })}
             />
          </div>
        </div>

        {/* Submit */}
        <button 
          type="submit"
          disabled={loading || fetchingPlayers}
          className="w-full py-6 bg-[#E85D04] text-white rounded-[32px] font-bold text-lg flex items-center justify-center gap-4 hover:bg-[#C44D03] transition-all shadow-2xl shadow-[#E85D04]/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
          SAVE MATCH RESULT
        </button>
      </form>
    </div>
  )
}
