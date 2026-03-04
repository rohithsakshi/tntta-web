import Hero from "@/components/Hero";
import Tournaments from "@/components/Tournaments";
import Features from "@/components/Features";
import Results from "@/components/Results";
import News from "@/components/News";
import Sponsors from "@/components/Sponsors";
import Footer from "@/components/Footer";

export default function Home() {

  const tournaments = [
    {
      id: "1",
      title: "7th TNTTA State Ranking Table Tennis Tournament 2025",
      location: "SK Academy, Chennai",
      startDate: "2026-02-25",
      endDate: "2026-02-28",
    },
    {
      id: "2",
      title: "Coimbatore District Championship",
      location: "Coimbatore Sports Arena",
      startDate: "2026-03-10",
      endDate: "2026-03-12",
    },
    {
      id: "3",
      title: "Madurai Open Table Tennis Tournament",
      location: "Madurai Indoor Stadium",
      startDate: "2026-04-05",
      endDate: "2026-04-07",
    },
    
  ];

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