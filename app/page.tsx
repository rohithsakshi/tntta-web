import Hero from "@/components/Hero";
import Tournaments from "@/components/Tournaments";
import Features from "@/components/Features";
import Results from "@/components/Results";
import News from "@/components/News";
import Sponsors from "@/components/Sponsors";
import Footer from "@/components/Footer";

async function getTournaments() {
  try {
    const res = await fetch("http://localhost:3000/api/tournaments", {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const tournaments = await getTournaments();

  return (
    <>
      <Hero />
      <Tournaments tournaments={tournaments} />
      <Features />
      <Results />
      <News />
      <Sponsors />
      <Footer />
    </>
  );
}