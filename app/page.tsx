import Navbar from "@/components/Navbar";
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
      name: "Tamil Nadu State TT Open",
      date: "June 5-7",
      location: "Avinashi Ground",
      image: "/tn-state-open.jpg",
    },
    {
      name: "South Zone Championship",
      date: "June 20-23",
      location: "Gachibowli Stadium",
      image: "/south-zone.jpg",
    },
    {
      name: "Indian Nationals Grand Finals",
      date: "August 16-20",
      location: "Indira Gandhi Indoor",
      image: "/nationals-finals.jpg",
    },
  ];

  return (
    <>
      <Navbar />
      <Hero />

      {/* Move Tournaments up */}
      <Tournaments tournaments={tournaments} />

      {/* Features goes below */}
      <Features />

      <Results />
      <News />
      <Sponsors />
      <Footer />
    </>
  );
}