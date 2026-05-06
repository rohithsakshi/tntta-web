import Hero from "@/components/Hero"
import LiveMatchTicker from "@/components/LiveMatchTicker"
import Tournaments from "@/components/Tournaments"
import RankingsSummary from "@/components/RankingsSummary"
import PlayersShowcase from "@/components/PlayersShowcase"
import Features from "@/components/Features"
import Results from "@/components/Results"
import News from "@/components/News"
import Sponsors from "@/components/Sponsors"

export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <div className="flex flex-col">
      <LiveMatchTicker />
      <Hero />
      <Tournaments />
      <RankingsSummary />
      <PlayersShowcase />
      <Features />
      <Results />
      <News />
      <Sponsors />
    </div>
  )
}