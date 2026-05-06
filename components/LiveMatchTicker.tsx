"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Trophy } from "lucide-react"
import { pusherClient } from "@/lib/pusher-client"

export default function LiveMatchTicker() {
  const [liveMatches, setLiveMatches] = useState<any[]>([])

  useEffect(() => {
    if (!pusherClient) return;

    const channel = pusherClient.subscribe('global-live-updates')

    channel.bind('match.started', (data: any) => {
      setLiveMatches(prev => [data, ...prev].slice(0, 3))
    })

    channel.bind('score.updated', (data: any) => {
      setLiveMatches(prev => prev.map(m => m.id === data.id ? { ...m, ...data } : m))
    })

    channel.bind('match.completed', (data: any) => {
      setLiveMatches(prev => prev.filter(m => m.id !== data.id))
    })

    return () => {
      pusherClient?.unsubscribe('global-live-updates')
    }
  }, [])

  if (liveMatches.length === 0) return null

  return (
    <div className="bg-[#E85D04] text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-6 whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest shrink-0">
            <Activity size={14} className="animate-pulse" />
            Live Now:
          </div>
          <AnimatePresence mode="popLayout">
            {liveMatches.map((match) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-4 text-xs font-bold"
              >
                <span className="opacity-70">{match.tournamentName}</span>
                <span>{match.player1Name} vs {match.player2Name}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded font-mono">{match.score}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
