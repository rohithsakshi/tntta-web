import Image from "next/image"

const sponsors = [
  { name: "Butterfly", logo: "/sponsor-butterfly.png" },
  { name: "Stag", logo: "/sponsor-stag.png" },
  { name: "Jio", logo: "/sponsor-jio.png" },
  { name: "Razorpay", logo: "/sponsor-razorpay.png" },
]

export default function Sponsors() {
  return (
    <section className="py-20 bg-white border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Our Official Partners</h3>
        <div className="w-12 h-0.5 bg-gray-200 mx-auto" />
      </div>

      <div className="flex relative">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => (
            <div key={index} className="flex items-center justify-center mx-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Image 
                src={sponsor.logo} 
                alt={sponsor.name} 
                width={140} 
                height={60} 
                className="h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}