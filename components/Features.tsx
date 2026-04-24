import { BarChart3, Users2, Trophy, ClipboardCheck } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: <BarChart3 className="text-[#E85D04]" size={32} />,
    title: "State Rankings",
    description: "Track your progress with our official state-wide ranking system updated after every tournament."
  },
  {
    icon: <ClipboardCheck className="text-[#E85D04]" size={32} />,
    title: "Tournament Management",
    description: "Seamless registration and entry fee payments for all district and state level championships."
  },
  {
    icon: <Users2 className="text-[#E85D04]" size={32} />,
    title: "Player Profiles",
    description: "Build your legacy with a comprehensive career history, match statistics, and achievement tracking."
  },
  {
    icon: <Trophy className="text-[#E85D04]" size={32} />,
    title: "Live Results",
    description: "Stay updated with real-time match scores and draws from ongoing tournaments across Tamil Nadu."
  }
]

export default function Features() {
  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#E85D04 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }} />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bebas tracking-wider text-white mb-4 uppercase">Official TNTTA Platform</h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-dm-sans text-sm sm:text-base px-4">
            Elevating the standard of Table Tennis in Tamil Nadu through technology and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              ...features[0],
              bg: "/image1.jpg"
            },
            {
              ...features[1],
              bg: "/image2.jpg"
            },
            {
              ...features[2],
              bg: "/image3.jpg"
            },
            {
              ...features[3],
              bg: "/image1.jpg"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="relative p-8 bg-[#111111] border border-white/5 rounded-2xl hover:border-[#E85D04]/30 hover:bg-[#151515] transition-all group overflow-hidden"
            >
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={feature.bg}
                  alt=""
                  fill
                  className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-transparent to-transparent" />
              </div>

              <div className="relative z-10">
                <div className="mb-6 p-3 bg-white/5 rounded-xl inline-block group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bebas tracking-wide text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-dm-sans">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}