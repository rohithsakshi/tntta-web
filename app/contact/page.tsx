import GoogleMap from "@/components/GoogleMap"
import { Phone, Mail, MapPin, Clock, Send, ShieldCheck } from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      title: "Our Headquarters",
      details: ["JN Stadium, SY No. 2", "Periamet, Chennai", "Tamil Nadu - 600003"],
      icon: MapPin,
    },
    {
      title: "Direct Contacts",
      details: ["+91 44 2345 6789", "+91 99999 99999", "admin@tntta.com"],
      icon: Phone,
    },
    {
      title: "Office Hours",
      details: ["Monday - Friday", "10:00 AM - 06:00 PM", "Closed on Sundays"],
      icon: Clock,
    },
  ]

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <div className="bg-[#0A0A0A] text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h1 className="text-6xl font-bebas tracking-wider mb-4 animate-fadeIn">Connect With Us</h1>
          <p className="text-xl text-gray-400 font-dm-sans max-w-2xl leading-relaxed">
            Have questions about registrations, tournaments, or district affiliations? Our team is here to help you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-12 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          {contactInfo.map((info) => (
            <div key={info.title} className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 group hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-[#E85D04]/10 rounded-2xl flex items-center justify-center text-[#E85D04] mb-8 group-hover:scale-110 transition-transform">
                <info.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">{info.title}</h3>
              <div className="space-y-2">
                {info.details.map((detail) => (
                  <p key={detail} className="text-gray-500 font-dm-sans">{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Contact Form */}
          <div className="bg-white rounded-[40px] p-10 lg:p-16 shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bebas tracking-wide text-gray-900 mb-8">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Rohith Ganesan"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="rohith@example.com"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 transition-all appearance-none">
                  <option>Tournament Inquiry</option>
                  <option>Registration Support</option>
                  <option>Payment Issue</option>
                  <option>General Feedback</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  rows={5}
                  placeholder="How can we help you today?"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 transition-all resize-none"
                />
              </div>
              <button className="w-full bg-[#E85D04] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#C44D03] transition-all shadow-lg">
                Send Message
                <Send size={20} />
              </button>
            </form>
          </div>

          {/* Map & Security */}
          <div className="flex flex-col gap-8">
            <div className="flex-1 bg-gray-900 rounded-[40px] overflow-hidden relative shadow-2xl min-h-[400px]">
              <GoogleMap location="Chennai" venue="JN Stadium, SY No. 2" />
            </div>

            <div className="bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 rounded-3xl p-8 flex items-start gap-6">
              <div className="w-12 h-12 shrink-0 bg-[#2D6A4F] text-white rounded-2xl flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-gray-900 font-bold mb-1">Official Verification</h4>
                <p className="text-sm text-gray-600 leading-relaxed">This is the only official contact portal for TNTTA. Beware of third-party portals claiming to manage state rankings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
