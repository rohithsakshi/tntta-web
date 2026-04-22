import Hero from "@/components/Hero"
import Tournaments from "@/components/Tournaments"
import Features from "@/components/Features"
import Results from "@/components/Results"
import News from "@/components/News"
import Sponsors from "@/components/Sponsors"

export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Tournaments />
      <Features />
      <Results />
      <News />
      <Sponsors />
    </div>
  )
}