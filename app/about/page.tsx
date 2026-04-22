import GoogleMap from "@/components/GoogleMap"
import Image from "next/image"
import { Trophy, Shield, Users, Target, History, Globe } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { label: "Founded", value: "1956", icon: History },
    { label: "Districts", value: "38", icon: Globe },
    { label: "Active Players", value: "5000+", icon: Users },
    { label: "Tournaments", value: "24/yr", icon: Trophy },
  ]

  const values = [
    {
      title: "Excellence",
      description: "Striving for the highest standards in sportsmanship and competitive play across all age groups.",
      icon: Trophy,
    },
    {
      title: "Integrity",
      description: "Maintaining absolute transparency in rankings, selection processes, and association governance.",
      icon: Shield,
    },
    {
      title: "Development",
      description: "Focusing on grassroots programs to identify and nurture the next generation of champions.",
      icon: Target,
    },
  ]

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#0A0A0A] text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/hero_tt_action_1776836674855.png')] bg-cover bg-center" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-7xl font-bebas tracking-wider mb-6 animate-fadeIn">Legacy of Excellence</h1>
          <p className="text-xl text-gray-400 font-dm-sans max-w-3xl mx-auto leading-relaxed">
            The Tamil Nadu Table Tennis Association (TNTTA) has been the cornerstone of the sport in the state for over six decades, fostering talent that shines on the national and international stage.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto px-4 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#E85D04]/10 rounded-2xl flex items-center justify-center text-[#E85D04] mb-4">
                <stat.icon size={24} />
              </div>
              <p className="text-3xl font-bebas tracking-wide text-gray-900">{stat.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="container mx-auto px-4 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl">
            <Image 
              src="/tt_training_camp_1776836814533.png" 
              alt="TNTTA Training" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="space-y-10">
            <div>
              <h2 className="text-4xl font-bebas tracking-wide text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 font-dm-sans leading-relaxed text-lg">
                To promote Table Tennis as a sport for all, providing equal opportunities for players from every district in Tamil Nadu. We aim to create a robust infrastructure that supports athletes from the grassroots level to professional excellence.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {values.map((value) => (
                <div key={value.title} className="flex gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                    <value.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white py-24 border-y border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bebas tracking-wide text-gray-900 mb-12 text-center">Historical Timeline</h2>
            {/* ... historical items ... */}
            <div className="space-y-12">
              <div className="flex gap-8 relative">
                <div className="absolute left-[23px] top-12 bottom-0 w-[2px] bg-gray-100" />
                <div className="w-12 h-12 shrink-0 bg-[#E85D04] text-white rounded-full flex items-center justify-center font-bebas text-xl z-10">1956</div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Foundation</h3>
                  <p className="text-gray-600 leading-relaxed">The TNTTA was officially established with a vision to unify table tennis clubs across the state under a single governing body.</p>
                </div>
              </div>
              <div className="flex gap-8 relative">
                <div className="absolute left-[23px] top-12 bottom-0 w-[2px] bg-gray-100" />
                <div className="w-12 h-12 shrink-0 bg-[#E85D04] text-white rounded-full flex items-center justify-center font-bebas text-xl z-10">1984</div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">National Recognition</h3>
                  <p className="text-gray-600 leading-relaxed">Tamil Nadu hosted its first Senior National Championship, marking our entry as a major hub for Indian table tennis.</p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="w-12 h-12 shrink-0 bg-[#E85D04] text-white rounded-full flex items-center justify-center font-bebas text-xl z-10">2025</div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Transformation</h3>
                  <p className="text-gray-600 leading-relaxed">Launching the unified digital platform to streamline player registrations, tournament management, and real-time rankings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* District Presence Map */}
      <div className="container mx-auto px-4 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bebas tracking-wider text-gray-900 mb-4">State-Wide Presence</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">TNTTA oversees development programs and tournaments across all 38 districts of Tamil Nadu.</p>
        </div>
        <div className="h-[600px] w-full rounded-[40px] overflow-hidden shadow-2xl border border-gray-100">
          <GoogleMap location="Tamil Nadu" />
        </div>
      </div>
    </div>
  )
}
