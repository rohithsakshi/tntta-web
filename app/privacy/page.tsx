import { Shield, Lock, Eye, FileText, Scale } from "lucide-react"

export default function PrivacyPage() {
  const sections = [
    {
      title: "Data Collection",
      content: "We collect personal information such as your name, date of birth, contact number, and district affiliation during registration. This is necessary for identifying players, generating ranking points, and processing tournament entries.",
      icon: Eye
    },
    {
      title: "How we use your data",
      content: "Your data is used to manage the state-wide ranking system, notify you of upcoming tournaments, and verify your eligibility for age-restricted categories. We do not sell your personal data to third parties.",
      icon: Shield
    },
    {
      title: "Security Measures",
      content: "We implement industry-standard encryption for all data transmissions. Payment information is handled exclusively by Razorpay and is never stored on our local servers.",
      icon: Lock
    },
    {
      title: "Cookies",
      content: "We use essential session cookies to keep you logged in to your player dashboard. These cookies do not track your activity on other websites.",
      icon: FileText
    }
  ]

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#0A0A0A] text-white py-24 relative overflow-hidden text-center">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h1 className="text-6xl font-bebas tracking-wider mb-4 animate-fadeIn">Privacy Policy</h1>
          <p className="text-xl text-gray-400 font-dm-sans max-w-2xl mx-auto leading-relaxed">
            Protecting your data and ensuring transparency in how we handle athlete information.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Main Card */}
          <div className="bg-white rounded-[40px] p-10 lg:p-20 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4 mb-12 pb-6 border-b border-gray-50">
               <Scale className="text-[#E85D04]" size={32} />
               <div>
                 <p className="text-[#E85D04] font-bold text-xs uppercase tracking-widest mb-1">Legal Document</p>
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Last Updated: April 2026</p>
               </div>
            </div>

            <div className="space-y-16">
              {sections.map((section) => (
                <section key={section.title} className="group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-[#E85D04] group-hover:text-white transition-all duration-300">
                      <section.icon size={20} />
                    </div>
                    <h2 className="text-2xl font-bebas tracking-wide text-gray-900 uppercase">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-gray-500 font-dm-sans leading-relaxed text-lg pl-14">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>

            <div className="mt-20 p-10 bg-gray-50 rounded-3xl border border-gray-100">
              <p className="text-sm text-gray-500 leading-relaxed italic">
                If you have any questions or concerns regarding our privacy practices, please contact our Data Protection Officer through the <a href="/contact" className="text-[#E85D04] font-bold hover:underline">Contact Us</a> page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
